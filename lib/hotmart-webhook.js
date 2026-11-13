import crypto from 'node:crypto';
import { publicAppBase } from './public-app-url.js';
import { database, normalizeEmail, safeSecretEqual } from './auth.js';
import { deliverViaGmail, emailConfig } from './password-reset.js';
import {transactionalEmailConfig,sendTransactionalEmail} from './transactional-email.js';

const SUPPORTED_EVENTS = new Set([
  'PURCHASE_APPROVED','PURCHASE_CANCELED','PURCHASE_REFUNDED',
  'PURCHASE_CHARGEBACK','PURCHASE_EXPIRED',
]);
const MAX_BODY_BYTES = 32 * 1024;
const CLAIM_TTL_DAYS = 7;

function answer(res,status,body) {
  res.statusCode=status;
  res.setHeader('Content-Type','application/json; charset=utf-8');
  res.setHeader('Cache-Control','no-store, private');
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('Referrer-Policy','no-referrer');
  res.end(JSON.stringify(body));
}

export function webhookConfig(env=process.env) {
  const preview=env.VERCEL_ENV==='preview' && env.HOTMART_TEST_RECEIVER_ENABLED==='true';
  const production=env.VERCEL_ENV==='production' && env.HOTMART_LIVE_ENABLED==='true';
  const productId=String(env.HOTMART_PRODUCT_ID||'').trim();
  const offer6=String(env.HOTMART_OFFER_6M_CODE||'').trim();
  const offer12=String(env.HOTMART_OFFER_12M_CODE||'').trim();
  const hottok=String(env.HOTMART_HOTTOK||'').trim();
  if ((!preview && !production) || !/^\d{4,20}$/.test(productId) ||
    !/^[a-zA-Z0-9_-]{4,80}$/.test(offer6) ||
    !/^[a-zA-Z0-9_-]{4,80}$/.test(offer12) ||
    offer6===offer12 || hottok.length<24 || hottok.length>256) return null;
  return {productId,hottok,offers:{[offer6]:6,[offer12]:12}};
}

export function readHotmartEvent(body,config) {
  if (!body || typeof body!=='object' || Array.isArray(body) || body.version!=='2.0.0') {
    return {error:'Versão ou formato inválido',code:'invalid_format'};
  }
  const eventName=String(body.event||'');
  if (!SUPPORTED_EVENTS.has(eventName)) return {ignored:true,reason:'Evento informativo',code:'informational_event'};
  const productId=String(body.data?.product?.id||'');
  if (productId!==config.productId) return {ignored:true,reason:'Produto não configurado',code:'product_not_configured'};
  const offerCode=String(body.data?.purchase?.offer?.code||'').trim();
  const months=Object.hasOwn(config.offers,offerCode)?config.offers[offerCode]:null;
  if (!months) return {ignored:true,reason:'Oferta não configurada',code:'offer_not_configured'};
  const eventId=String(body.id||'').trim();
  const transaction=String(body.data?.purchase?.transaction||'').trim();
  const email=normalizeEmail(body.data?.buyer?.email||'');
  const buyerName=String(body.data?.buyer?.name||'').trim().replace(/\s+/g,' ').slice(0,120);
  const isApproval=eventName==='PURCHASE_APPROVED';
  // Modelo comercial aprovado: compra por prazo fixo e renovacao manual.
  // O filtro nao bloqueia estornos, chargebacks ou cancelamentos de compras anteriores.
  // Assinatura Hotmart (objeto subscription com plano/assinante, ou renovacao
  // antecipada) continua recusada. Ja o Recuperador automatico de vendas cobra uma
  // compra unica em parcelas mensais: a 1a cobranca libera o prazo da oferta e as
  // seguintes (recurrence_number > 1, novas transacoes) nao somam tempo.
  if (isApproval) {
    const purchase=body.data?.purchase||{};
    const sub=body.data?.subscription;
    const isSubscription=sub!=null &&
      !(typeof sub==='object' && !Array.isArray(sub) && Object.keys(sub).length===0);
    const anticipation=purchase.subscription_anticipation_purchase===true;
    if (isSubscription || anticipation)
      return {error:'Compra recorrente incompatível com renovação manual; revisar oferta Hotmart',code:'recurring_offer'};
    if (Number(purchase.recurrence_number||0)>1)
      return {ignored:true,reason:'Parcela seguinte de compra recuperada',code:'installment_charge'};
  }
  if (!/^[a-zA-Z0-9_-]{5,120}$/.test(eventId) ||
      !/^[a-zA-Z0-9_-]{5,120}$/.test(transaction) ||
      (email!=='' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) ||
      (isApproval && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
    return {error:'Identificadores ou comprador inválidos',code:'invalid_identifiers'};
  }
  // Só a aprovação exige o estado exato. Estorno, chargeback, cancelamento e
  // expiração sempre revogam: a Hotmart usa variações (CANCELED/CANCELLED,
  // PARTIALLY_REFUNDED...) e rejeitar uma revogação manteria Premium indevido.
  const status=String(body.data?.purchase?.status||'').toUpperCase();
  if (isApproval && status && status!=='APPROVED')
    return {error:'Estado de compra incompatível com o evento',code:'status_mismatch'};
  // A Hotmart converte automaticamente o preço em BRL para compradores no exterior
  // (não pode ser desligado); produto + código da oferta definem o plano, não a moeda.
  const created=Number(body.creation_date);
  const createdAt=Number.isFinite(created)&&created>0&&created<8640000000000000?
    new Date(created).toISOString():null;
  return {value:{eventId,eventName,transaction,productId,offerCode,months,
    email,buyerName,createdAt}};
}

export function claimToken() {return crypto.randomBytes(32).toString('base64url')}
export function hashClaimToken(token) {return crypto.createHash('sha256').update(token).digest('hex')}

export function hotmartSiteBase(env=process.env) {
  return publicAppBase(env);
}

export async function sendHotmartWelcome({env=process.env,to,token,transport=sendTransactionalEmail}) {
  const cfg=transactionalEmailConfig(env);
  if(!cfg)throw Error('Serviço de e-mail indisponível');
  const link=hotmartSiteBase(env)+'/ativar-acesso.html#token='+encodeURIComponent(token);
  const title='Seu acesso à Base Completa Premium';
  const safeLink=link.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
  const html='<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:22px;color:#19334a">'+
    '<h2>Base Completa Premium</h2><p>Seu pagamento foi aprovado. Para começar a estudar, '+
    'crie sua senha pessoal e acesse a Central.</p>'+
    '<p><a href="'+safeLink+'" style="background:#163b59;color:white;padding:14px 20px;text-decoration:none;border-radius:8px">Ativar meu acesso</a></p>'+
    '<p>Este link é individual, funciona uma única vez e expira em 7 dias. '+
    'Se você já tiver conta, entre normalmente com seu e-mail.</p></div>';
  const text='Base Completa Premium — compra aprovada.\nCrie sua conta pelo link:\n'+link+
    '\nEste link expira em 7 dias e só pode ser usado uma vez.';
  return transport({from:cfg.from,to,subject:title,html,text},cfg);
}

const ALERT_INTERVAL_MS = 30 * 60 * 1000;
const lastAlertByReason = new Map();

function safeId(value) {
  const text=String(value??'').trim();
  return /^[a-zA-Z0-9_.-]{1,120}$/.test(text)?text:null;
}

// Apenas identificadores técnicos; nunca e-mail, nome, token ou payload.
export function hotmartEventMeta(body) {
  return {
    eventId:safeId(body?.id),eventName:safeId(body?.event),
    transaction:safeId(body?.data?.purchase?.transaction),
    offerCode:safeId(body?.data?.purchase?.offer?.code),
  };
}

const ALERT_DEFAULT_TO='basecompleta.estudos@gmail.com';
export async function sendHotmartAlert({env=process.env,issue,transport=sendTransactionalEmail}) {
  // Usa o mesmo provedor dos e-mails transacionais (Resend ou Gmail); sem HOTMART_ALERT_EMAIL, vai para o e-mail de atendimento.
  const cfg=transactionalEmailConfig(env);
  if(!cfg)throw Error('Provedor de e-mail indisponível');
  const to=String(env.HOTMART_ALERT_EMAIL||cfg.user||ALERT_DEFAULT_TO).trim();
  const lines=[
    'Falha ou pendência no webhook Hotmart da Base Completa.',
    'Motivo: '+issue.reason,'HTTP devolvido à Hotmart: '+issue.status,
    'Evento: '+(issue.eventName||'-')+' ('+(issue.eventId||'-')+')',
    'Transação: '+(issue.transaction||'-'),
    'Acompanhe e reprocesse em '+(()=>{try{return hotmartSiteBase(env)}catch{return 'https://app.basecompleta.com.br'}})()+'/vendas-hotmart.html',
    'Se a falha persistir, reenvie a notificação pelo histórico de webhooks da Hotmart.',
  ];
  const text=lines.join('\n');
  const html='<div style="font-family:Arial,sans-serif">'+lines.map(l=>'<p>'+
    l.replace(/&/g,'&amp;').replace(/</g,'&lt;')+'</p>').join('')+'</div>';
  return transport({from:cfg.from,to,subject:'[Base Completa] Alerta webhook Hotmart: '+issue.reason,html,text},cfg);
}

// Registro e alerta nunca alteram a resposta devolvida à Hotmart.
async function reportIssue({sql,env,sendAlert,severity,reason,status,meta}) {
  const issue={severity,reason,status,...meta};
  let shouldAlert=severity==='error';
  let id=null;
  if(sql){
    try {
      const rows=await sql`
        INSERT INTO public.central_hotmart_webhook_issues
          (severity,reason,http_status,event_id,event_name,transaction_id,offer_code)
        VALUES(${severity},${reason},${status},${meta.eventId},${meta.eventName},
               ${meta.transaction},${meta.offerCode})
        RETURNING id,(SELECT COUNT(*) FROM public.central_hotmart_webhook_issues
          WHERE reason=${reason} AND alerted_at>NOW()-INTERVAL '30 minutes')::int AS recent
      `;
      id=rows[0]?.id??null;
      if(Number(rows[0]?.recent||0)>0)shouldAlert=false;
    } catch (recordError) {
      console.error('hotmart webhook issue not recorded',{code:String(recordError?.code||'UNKNOWN').slice(0,32)});
    }
  }
  console.warn('hotmart webhook issue',{severity,reason,status,eventName:meta.eventName,transaction:meta.transaction});
  if(!shouldAlert)return;
  // Notificações simultâneas: só quem conquista a vaga do motivo envia o alerta.
  // O ON CONFLICT trava a linha, então chamadas concorrentes não passam juntas.
  let claimed=false;
  if(sql && id!=null){
    try {
      const slot=await sql`
        INSERT INTO public.central_hotmart_alert_throttle(reason,last_alert_at)
        VALUES(${reason},NOW())
        ON CONFLICT(reason) DO UPDATE SET last_alert_at=EXCLUDED.last_alert_at
        WHERE public.central_hotmart_alert_throttle.last_alert_at<NOW()-INTERVAL '30 minutes'
        RETURNING reason
      `;
      if(!slot.length)return;
      claimed=true;
    } catch (slotError) {
      // Antes da migração 009 vale o limite anterior (por registro e por instância).
      if(slotError?.code!=='42P01')
        console.error('hotmart webhook alert slot failed',{code:String(slotError?.code||'UNKNOWN').slice(0,32)});
    }
  }
  if(!claimed){
    const last=lastAlertByReason.get(reason)||0;
    if(Date.now()-last<ALERT_INTERVAL_MS)return;
  }
  lastAlertByReason.set(reason,Date.now());
  try {
    await sendAlert({env,issue});
    if(sql && id!=null)await sql`
      UPDATE public.central_hotmart_webhook_issues SET alerted_at=NOW() WHERE id=${id}`;
  } catch (alertError) {
    console.error('hotmart webhook alert failed',{code:String(alertError?.code||alertError?.name||'UNKNOWN').slice(0,32)});
    lastAlertByReason.delete(reason);
    // Libera a vaga para a próxima falha tentar avisar de novo.
    if(claimed)await sql`
      UPDATE public.central_hotmart_alert_throttle
      SET last_alert_at=NOW()-INTERVAL '31 minutes' WHERE reason=${reason}`.catch(()=>{});
  }
}

export function createHotmartWebhook({env=process.env,sqlProvider=database,sendWelcome=sendHotmartWelcome,sendAlert=sendHotmartAlert}={}) {
  return async(req,res)=>{
    if(req.method!=='POST'){
      res.setHeader('Allow','POST');return answer(res,405,{error:'Método não permitido'});
    }
    const config=webhookConfig(env);
    if(!config)return answer(res,503,{error:'Integração não ativada'});
    if(!safeSecretEqual(req.headers?.['x-hotmart-hottok'],config.hottok)){
      // Sem banco nem alerta: requisição não autenticada pode ser abuso externo.
      console.warn('hotmart webhook unauthorized',{hasToken:!!req.headers?.['x-hotmart-hottok']});
      return answer(res,401,{error:'Notificação não autorizada'});
    }
    if(!/^application\/json(?:\s*;|$)/i.test(String(req.headers?.['content-type']||'')))
      return answer(res,415,{error:'Use JSON'});
    const length=Number(req.headers?.['content-length']||0);
    if(!Number.isFinite(length)||length<0||length>MAX_BODY_BYTES)
      return answer(res,413,{error:'Notificação excedeu o limite'});
    let sql=null,meta={eventId:null,eventName:null,transaction:null,offerCode:null};
    const report=(severity,reason,status)=>reportIssue({sql,env,sendAlert,severity,reason,status,meta});
    try {
      let body=req.body;
      if(typeof body==='string')body=JSON.parse(body);
      if(body==null){
        const parts=[];let bytes=0;
        for await(const chunk of req){
          bytes+=chunk.length;
          if(bytes>MAX_BODY_BYTES)return answer(res,413,{error:'Notificação excedeu o limite'});
          parts.push(chunk);
        }
        body=JSON.parse(Buffer.concat(parts).toString('utf8'));
      }
      if(Buffer.byteLength(JSON.stringify(body))>MAX_BODY_BYTES)
        return answer(res,413,{error:'Notificação excedeu o limite'});
      meta=hotmartEventMeta(body);
      const parsed=readHotmartEvent(body,config);
      if(parsed.error||parsed.ignored){
        // O banco só registra a ocorrência; indisponível, a resposta não muda.
        try {sql=sqlProvider()} catch (_) {sql=null}
      } else sql=sqlProvider();
      if(parsed.error){
        await report('error',parsed.code||'invalid_event',422);
        return answer(res,422,{error:parsed.error});
      }
      if(parsed.ignored){
        // Pix/boleto pendente e demais eventos informativos são esperados;
        // produto/oferta/moeda desconhecidos indicam venda que não seria liberada.
        await report(['informational_event','installment_charge'].includes(parsed.code)?'info':'error',parsed.code||'ignored',200);
        return answer(res,200,{ok:true,ignored:true});
      }
      const {eventId,eventName,transaction,productId,offerCode,months,email,buyerName,createdAt}=parsed.value;
      const token=claimToken();
      const hash=hashClaimToken(token);
      const expiresAt=new Date(Date.now()+CLAIM_TTL_DAYS*86400000).toISOString();
      const rows=await sql`
        SELECT * FROM public.central_hotmart_apply_event(
          ${eventId},${eventName},${transaction},${productId},${offerCode},
          ${months}::smallint,${email},${buyerName},
          ${createdAt}::timestamptz,${hash},${expiresAt}::timestamptz
        )
      `;
      const result=rows[0]||{};
      if(result.should_send_email===true){
        try {
          await sendWelcome({env,to:email,token});
        } catch (sendError) {
          // A reserva do token foi confirmada antes do SMTP. Se o envio falhar,
          // libere essa reserva para que o retry autenticado da Hotmart tente
          // novamente imediatamente, sem aguardar a janela de 2 minutos.
          // O hash impede que uma tentativa antiga apague uma reserva nova.
          await sql`
            UPDATE public.central_hotmart_orders
            SET claim_token_hash=NULL,claim_expires_at=NULL,updated_at=NOW()
            WHERE transaction_id=${transaction} AND claim_token_hash=${hash}
              AND state='approved' AND credit_applied=FALSE
              AND claim_sent_at IS NULL
          `;
          throw sendError;
        }
        await sql`
          UPDATE public.central_hotmart_orders
          SET claim_sent_at=NOW(),updated_at=NOW()
          WHERE transaction_id=${transaction} AND claim_token_hash=${hash}
            AND state='approved' AND claim_sent_at IS NULL
        `;
      }
      if(result.outcome==='pending_claim' && result.should_send_email!==true){
        // Outro POST pode chegar enquanto o SMTP ainda está pendente.
        // Nunca confirmar recebimento à Hotmart antes de registrar o envio.
        const sent=await sql`
          SELECT claim_sent_at FROM public.central_hotmart_orders
          WHERE transaction_id=${transaction}
            AND state='approved' AND credit_applied=FALSE
        `;
        if(!sent[0] || sent[0].claim_sent_at==null)
          return answer(res,503,{error:'Envio de ativação ainda pendente'});
      }
      if(result.outcome==='manual_review')await report('error','manual_review',200);
      return answer(res,200,{ok:true,received:true,state:result.outcome||'received'});
    }catch(err){
      // No webhook secret, mail content, token, buyer address or payload in logs.
      const code=String(err?.code||err?.name||'UNKNOWN').replace(/[^a-zA-Z0-9_]/g,'').slice(0,32);
      console.error('hotmart webhook request failed',{code});
      await report('error','processing_failed_'+code.toLowerCase(),503);
      return answer(res,503,{error:'Não foi possível receber a notificação'});
    }
  };
}
export default createHotmartWebhook();
