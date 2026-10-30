import crypto from 'node:crypto';
import { publicAppBase } from './public-app-url.js';
import { database, normalizeEmail, safeSecretEqual } from './auth.js';
import { deliverViaGmail, emailConfig } from './password-reset.js';

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
    return {error:'Versão ou formato inválido'};
  }
  const eventName=String(body.event||'');
  if (!SUPPORTED_EVENTS.has(eventName)) return {ignored:true,reason:'Evento informativo'};
  const productId=String(body.data?.product?.id||'');
  if (productId!==config.productId) return {ignored:true,reason:'Produto não configurado'};
  const offerCode=String(body.data?.purchase?.offer?.code||'').trim();
  const months=Object.hasOwn(config.offers,offerCode)?config.offers[offerCode]:null;
  if (!months) return {ignored:true,reason:'Oferta não configurada'};
  const eventId=String(body.id||'').trim();
  const transaction=String(body.data?.purchase?.transaction||'').trim();
  const email=normalizeEmail(body.data?.buyer?.email||'');
  const buyerName=String(body.data?.buyer?.name||'').trim().replace(/\s+/g,' ').slice(0,120);
  const isApproval=eventName==='PURCHASE_APPROVED';
  // Modelo comercial aprovado: compra por prazo fixo e renovacao manual.
  // O filtro nao bloqueia estornos, chargebacks ou cancelamentos de compras anteriores.
  // Na Hotmart, o objeto subscription e os campos de recorrencia indicam assinatura
  // que poderia cobrar novamente independentemente do vencimento na Central.
  if (isApproval) {
    const purchase=body.data?.purchase||{};
    const hasSubscription=body.data?.subscription!=null;
    const recurrence=Number(purchase.recurrence_number||0);
    const nextCharge=purchase.date_next_charge;
    const hasNextCharge=nextCharge!=null && nextCharge!=='' &&
      nextCharge!==0 && nextCharge!=='0';
    const anticipation=purchase.subscription_anticipation_purchase===true;
    if (hasSubscription || recurrence>0 || hasNextCharge || anticipation)
      return {error:'Compra recorrente incompatível com renovação manual; revisar oferta Hotmart'};
  }
  if (!/^[a-zA-Z0-9_-]{5,120}$/.test(eventId) ||
      !/^[a-zA-Z0-9_-]{5,120}$/.test(transaction) ||
      (email!=='' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) ||
      (isApproval && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
    return {error:'Identificadores ou comprador inválidos'};
  }
  const status=String(body.data?.purchase?.status||'').toUpperCase();
  const expected={
    PURCHASE_APPROVED:'APPROVED',PURCHASE_REFUNDED:'REFUNDED',
    PURCHASE_CHARGEBACK:'CHARGEBACK',PURCHASE_CANCELED:'CANCELLED',
    PURCHASE_EXPIRED:'EXPIRED',
  }[eventName];
  if (status && status!==expected) return {error:'Estado de compra incompatível com o evento'};
  const currency=String(body.data?.purchase?.price?.currency_value||'').toUpperCase();
  if (currency && currency!=='BRL') return {ignored:true,reason:'Moeda diferente do produto brasileiro'};
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

export async function sendHotmartWelcome({env=process.env,to,token,transport=deliverViaGmail}) {
  const cfg=emailConfig(env);
  if(!cfg)throw Error('Gmail indisponível');
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

export function createHotmartWebhook({env=process.env,sqlProvider=database,sendWelcome=sendHotmartWelcome}={}) {
  return async(req,res)=>{
    if(req.method!=='POST'){
      res.setHeader('Allow','POST');return answer(res,405,{error:'Método não permitido'});
    }
    const config=webhookConfig(env);
    if(!config)return answer(res,503,{error:'Integração não ativada'});
    if(!safeSecretEqual(req.headers?.['x-hotmart-hottok'],config.hottok))
      return answer(res,401,{error:'Notificação não autorizada'});
    if(!/^application\/json(?:\s*;|$)/i.test(String(req.headers?.['content-type']||'')))
      return answer(res,415,{error:'Use JSON'});
    const length=Number(req.headers?.['content-length']||0);
    if(!Number.isFinite(length)||length<0||length>MAX_BODY_BYTES)
      return answer(res,413,{error:'Notificação excedeu o limite'});
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
      const parsed=readHotmartEvent(body,config);
      if(parsed.error)return answer(res,422,{error:parsed.error});
      if(parsed.ignored)return answer(res,200,{ok:true,ignored:true});
      const {eventId,eventName,transaction,productId,offerCode,months,email,buyerName,createdAt}=parsed.value;
      const token=claimToken();
      const hash=hashClaimToken(token);
      const expiresAt=new Date(Date.now()+CLAIM_TTL_DAYS*86400000).toISOString();
      const sql=sqlProvider();
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
      return answer(res,200,{ok:true,received:true,state:result.outcome||'received'});
    }catch(err){
      // No webhook secret, mail content, token, buyer address or payload in logs.
      const code=String(err?.code||err?.name||'UNKNOWN').replace(/[^a-zA-Z0-9_]/g,'').slice(0,32);
      console.error('hotmart webhook request failed',{code});
      return answer(res,503,{error:'Não foi possível receber a notificação'});
    }
  };
}
export default createHotmartWebhook();
