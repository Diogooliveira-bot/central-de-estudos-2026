import crypto from 'node:crypto';
import { publicAppBase } from './public-app-url.js';
import { database, normalizeEmail, safeSecretEqual } from './auth.js';
import { deliverViaGmail, emailConfig } from './password-reset.js';
import {transactionalEmailConfig,sendTransactionalEmail} from './transactional-email.js';
import {sendApprovedEventEmail} from './approved-email-dispatcher.js';

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

// Base pública sem lançar erro (avisos opcionais não podem falhar por URL ausente).
function siteBaseOrDefault(env) {
  try {return hotmartSiteBase(env)} catch {return 'https://app.basecompleta.com.br'}
}

export async function sendHotmartWelcome({env=process.env,to,token,transport=sendTransactionalEmail}) {
  const cfg=transactionalEmailConfig(env);
  if(!cfg)throw Error('Serviço de e-mail indisponível');
  const link=hotmartSiteBase(env)+'/ativar-acesso.html#token='+encodeURIComponent(token);
  const title='Ative seu Premium | Base Completa';
  const esc=v=>String(v).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const safeLink=esc(link), site=esc(hotmartSiteBase(env)), support='basecompleta.estudos@gmail.com';
  const logo=site+'/icons/email/logo.webp';
  const step=(n,t)=>'<tr><td style="padding:6px 12px 6px 0;vertical-align:top"><span style="display:inline-block;width:24px;height:24px;border-radius:12px;background:#e8f1f8;color:#0b4f7a;text-align:center;font:700 13px/24px Arial,sans-serif">'+n+'</span></td><td style="padding:6px 0;font:14px/21px Arial,sans-serif;color:#2c4254">'+t+'</td></tr>';
  const html='<!doctype html><html lang="pt-BR"><body style="margin:0;background:#f2f6fa">'+
    '<div style="display:none;max-height:0;overflow:hidden">Seu pagamento foi aprovado. Ative seu acesso Premium em um minuto.</div>'+
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f2f6fa"><tr><td align="center" style="padding:24px 12px">'+
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #d9e5ed;border-radius:14px">'+
    '<tr><td style="padding:22px 28px 0"><img src="'+logo+'" alt="Base Completa" width="150" style="display:block;border:0;max-width:150px;height:auto"></td></tr>'+
    '<tr><td style="padding:14px 28px 0"><p style="margin:0;font:700 11px Arial,sans-serif;letter-spacing:1.4px;color:#0c6780">COMPRA APROVADA</p>'+
    '<h1 style="margin:6px 0 10px;font:800 24px/30px Arial,sans-serif;color:#10364c">Seu pagamento foi aprovado.</h1>'+
    '<p style="margin:0;font:15px/23px Arial,sans-serif;color:#2c4254">Falta só criar sua senha para liberar o Premium da Base Completa. Leva cerca de um minuto.</p></td></tr>'+
    '<tr><td style="padding:20px 28px 6px"><a href="'+safeLink+'" style="display:inline-block;background:#163b59;color:#ffffff;padding:14px 26px;text-decoration:none;border-radius:10px;font:700 15px Arial,sans-serif">Ativar meu acesso</a></td></tr>'+
    '<tr><td style="padding:14px 28px 0"><table role="presentation" cellpadding="0" cellspacing="0">'+
      step(1,'Clique em <b>Ativar meu acesso</b>.')+step(2,'Informe seu nome e crie uma senha pessoal.')+step(3,'Pronto: a Central abre com todos os recursos Premium.')+
    '</table></td></tr>'+
    '<tr><td style="padding:16px 28px 0"><p style="margin:0;font:13px/20px Arial,sans-serif;color:#526d81">O link é individual, funciona <b>uma única vez</b> e vale por <b>7 dias</b>. Se o botão não abrir, copie este endereço no navegador:<br><span style="word-break:break-all;color:#0b4f7a">'+safeLink+'</span></p></td></tr>'+
    '<tr><td style="padding:14px 28px 0"><p style="margin:0;font:13px/20px Arial,sans-serif;color:#526d81"><b>Já tem conta com este e-mail?</b> O Premium já foi liberado nela: <a href="'+site+'/login.html" style="color:#0b4f7a">entre normalmente</a>. A contratação é por período definido, sem renovação automática.</p></td></tr>'+
    '<tr><td style="padding:14px 28px 24px"><p style="margin:0;font:13px/20px Arial,sans-serif;color:#526d81"><b>Link expirou ou não funcionou?</b> Escreva para <a href="mailto:'+support+'" style="color:#0b4f7a">'+support+'</a> informando o e-mail da compra e enviaremos um novo. Nunca pedimos sua senha por e-mail.</p></td></tr>'+
    '</table><p style="margin:14px 0 0;font:12px Arial,sans-serif;color:#7a8ea0">Base Completa · Sua preparação começa pela base.</p>'+
    '</td></tr></table></body></html>';
  const text='Base Completa — seu pagamento foi aprovado.\n\nPara liberar o Premium, crie sua senha pelo link abaixo (individual, uso único, vale por 7 dias):\n'+link+
    '\n\n1) Abra o link  2) Informe seu nome e crie uma senha  3) Pronto: a Central abre com os recursos Premium.\n\n'+
    'Já tem conta com este e-mail? O Premium já foi liberado nela: entre normalmente em '+hotmartSiteBase(env)+'/login.html\n'+
    'Link expirou ou não funcionou? Escreva para '+support+' informando o e-mail da compra e enviaremos um novo. Nunca pedimos sua senha por e-mail.';
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


// ---- Avisos operacionais de venda (produção) --------------------------------------------------
const EVENT_TITLE={
  PURCHASE_APPROVED:'Venda aprovada',PURCHASE_REFUNDED:'Reembolso',PURCHASE_CHARGEBACK:'Chargeback',
  PURCHASE_CANCELED:'Compra cancelada',PURCHASE_EXPIRED:'Compra expirada',
};
const OUTCOME_TEXT={
  applied:'Premium liberado agora na conta que o comprador já tinha.',
  pending_claim:'Conta nova: enviamos o e-mail para o comprador criar a senha (link vale 7 dias).',
  revoked:'Premium dessa compra revogado; a conta volta ao plano Gratuito (se não houver outro Premium válido).',
};
export function maskEmail(email) {
  const [user='',domain='']=String(email||'').split('@');
  if(!user||!domain)return '(sem e-mail)';
  return user.slice(0,1)+'***@'+domain;
}
// Aviso para o dono a cada venda/reembolso. Sem senha, token ou payload; e-mail do comprador mascarado.
export async function sendHotmartSaleNotice({env=process.env,eventName,months,transaction,outcome,email,transport=sendTransactionalEmail}) {
  const cfg=transactionalEmailConfig(env);
  if(!cfg)throw Error('Provedor de e-mail indisponível');
  const to=String(env.HOTMART_ALERT_EMAIL||cfg.user||ALERT_DEFAULT_TO).trim();
  const title=EVENT_TITLE[eventName]||'Evento Hotmart';
  const plan=months===12?'Anual (12 meses)':'Semestral (6 meses)';
  const base=siteBaseOrDefault(env);
  const lines=[
    title+' — Base Completa Premium '+plan+'.',
    'Comprador: '+maskEmail(email),
    'Transação Hotmart: '+transaction,
    'Na Central: '+(OUTCOME_TEXT[outcome]||outcome),
    eventName==='PURCHASE_REFUNDED'||eventName==='PURCHASE_CHARGEBACK'
      ?'O reembolso/estorno em si é tratado dentro da Hotmart (painel de Vendas). O acesso Premium já foi retirado automaticamente.'
      :'Acompanhe tudo em '+base+'/vendas-hotmart.html',
  ];
  const esc=v=>String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;');
  const html='<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.55;color:#10364c">'+lines.map((l,i)=>i===0?'<h2 style="margin:0 0 12px">'+esc(l)+'</h2>':'<p style="margin:6px 0">'+esc(l)+'</p>').join('')+'</div>';
  return transport({from:cfg.from,to,subject:'[Base Completa] '+title+' · '+plan,html,text:lines.join('\n')},cfg);
}

function brDate(value) {
  return new Intl.DateTimeFormat('pt-BR',{timeZone:'America/Fortaleza',day:'2-digit',month:'2-digit',year:'numeric'}).format(new Date(value));
}
// E-mail "Premium ativado" para quem já tinha conta (quem não tinha recebe o link de ativação).
export async function sendPremiumActivatedNotice({env=process.env,sql,email,buyerName,months,transaction,sendEmail=sendApprovedEventEmail}) {
  const rows=await sql`
    SELECT s.starts_at,s.ends_at,u.name
      FROM public.central_user_subscriptions s
      JOIN public.central_users u ON u.user_id=s.user_id
     WHERE lower(u.email)=${email} AND s.plan_code='premium' AND s.status='active' AND s.ends_at>NOW()
     ORDER BY s.ends_at DESC LIMIT 1`;
  if(!rows.length)return false;
  const who=String(rows[0].name||buyerName||'').trim().split(/\s+/u)[0]||'estudante';
  await sendEmail({
    type:'premium-ativado',to:email,env,verifiedEventId:'hotmart-activated:'+transaction,
    fields:{
      PRIMEIRO_NOME:who,NOME_PLANO:months===12?'Premium Anual':'Premium Semestral',
      DATA_INICIO:brDate(rows[0].starts_at),DATA_VENCIMENTO:brDate(rows[0].ends_at),
      IDENTIFICADOR_PEDIDO:transaction,LINK_CENTRAL:siteBaseOrDefault(env)+'/',
    },
  });
  return true;
}

// Nunca altera a resposta à Hotmart: qualquer falha aqui só vai para o log.
export async function notifyHotmartOutcome({env=process.env,sql,parsed,result,sendSale=sendHotmartSaleNotice,sendActivated=sendPremiumActivatedNotice}) {
  if(env.VERCEL_ENV!=='production')return;
  const {eventName,transaction,months,email,buyerName}=parsed;
  const outcome=result.outcome;
  const relevant=outcome==='applied'||outcome==='revoked'||(outcome==='pending_claim'&&result.should_send_email===true);
  if(!relevant)return;
  try {await sendSale({env,eventName,months,transaction,outcome,email})}
  catch(e){console.error('hotmart sale notice failed',{code:String(e?.code||e?.name||'UNKNOWN').replace(/[^a-zA-Z0-9_]/g,'').slice(0,32)})}
  if(outcome==='applied'){
    try {await sendActivated({env,sql,email,buyerName,months,transaction})}
    catch(e){console.error('premium activated notice failed',{code:String(e?.code||e?.name||'UNKNOWN').replace(/[^a-zA-Z0-9_]/g,'').slice(0,32)})}
  }
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

export function createHotmartWebhook({env=process.env,sqlProvider=database,sendWelcome=sendHotmartWelcome,sendAlert=sendHotmartAlert,notify=notifyHotmartOutcome}={}) {
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
      await notify({env,sql,parsed:parsed.value,result});
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
