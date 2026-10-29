import crypto from 'node:crypto';
import { publicAppBase } from './public-app-url.js';
import {database,safeSecretEqual} from './auth.js';
import {deliverViaGmail,emailConfig} from './password-reset.js';

const ZONE='America/Fortaleza';
const EMAIL_PATTERN=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_BATCH=75;

// Fail closed. Does not switch on when deployed, unless specifically enabled
// with an authenticated CRON_SECRET and an approved public app URL.
export function expiryRemindersEnabled(env=process.env){
  return env.VERCEL_ENV==='production'
    && env.BC_EXPIRY_REMINDERS_ENABLED==='true'
    && typeof env.CRON_SECRET==='string' && env.CRON_SECRET.length>=32
    && Boolean(emailConfig(env))
    && Boolean(expiryAppUrl(env));
}
export function expiryAppUrl(env=process.env){
  try { return publicAppBase(env); } catch { return ''; }
}
export function expiryReminderMessage({name,endsAt,kind,baseUrl}){
  if(!['seven_days','expiry_day'].includes(kind))throw new Error('Aviso inválido');
  const end=new Date(endsAt);
  if(!Number.isFinite(end.getTime()))throw new Error('Vencimento inválido');
  const date=new Intl.DateTimeFormat('pt-BR',{day:'2-digit',month:'2-digit',year:'numeric',timeZone:ZONE}).format(end);
  const subject=kind==='seven_days'?'Seu Premium vence em 7 dias · Base Completa':'Vencimento do seu Premium · Base Completa';
  const salutation=String(name||'Estudante').trim().split(/\s+/)[0].slice(0,60)||'Estudante';
  const detail=kind==='seven_days'
    ?'Faltam 7 dias para o fim do período Premium que você contratou.'
    :'A data de vencimento do seu período Premium é hoje.';
  const note='A renovação não é automática. Você só pagará por um novo período se decidir fazer outra compra. Ao terminar o acesso Premium, sua conta continuará no plano Gratuito, respeitadas as condições da plataforma.';
  const text=`${salutation},\n\n${detail}\nVencimento: ${date} (Fortaleza/CE).\n\n${note}\n\nAcesse sua Central: ${baseUrl}\n\nEsta é uma mensagem de serviço da sua assinatura, não uma oferta publicitária.\nSuporte: basecompleta.estudos@gmail.com`;
  const esc=x=>String(x).replace(/[&<>"']/g,k=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[k]));
  const html=`<main style="max-width:580px;margin:auto;font:16px/1.6 Arial,sans-serif;color:#152e4d;padding:28px"><p style="font-weight:800;color:#133a68">BASE COMPLETA · CENTRAL DE ESTUDOS</p><h1 style="font-size:23px">${esc(subject.split(' · ')[0])}</h1><p>Olá, ${esc(salutation)}.</p><p>${esc(detail)}</p><p><strong>Data: ${esc(date)}</strong> (Fortaleza/CE)</p><p>${esc(note)}</p><p><a href="${esc(baseUrl)}">Acessar minha Central</a></p><p style="font-size:13px;color:#52657b">Aviso operacional da sua assinatura, sem publicidade. Suporte: basecompleta.estudos@gmail.com.</p></main>`;
  return {subject,text,html};
}
function respond(res,status,body){
 res.statusCode=status;
 res.setHeader('Content-Type','application/json; charset=utf-8');
 res.setHeader('Cache-Control','private, no-store');
 res.setHeader('X-Content-Type-Options','nosniff');
 res.setHeader('Referrer-Policy','no-referrer');
 res.end(JSON.stringify(body));
}

export function createExpiryReminderHandler({
 env=process.env,sqlProvider=database,sendEmail=deliverViaGmail,
 newId=()=>crypto.randomUUID()
}={}){
 return async function expiryReminders(req,res){
  if(req.method!=='GET'){
    res.setHeader('Allow','GET');
    return respond(res,405,{error:'Método não permitido'});
  }
  const supplied=String(req.headers?.authorization||'');
  const secret=String(env.CRON_SECRET||'');
  if(secret.length<32||!safeSecretEqual(supplied,'Bearer '+secret))
    return respond(res,401,{error:'Não autorizado'});
  if(!expiryRemindersEnabled(env))
    return respond(res,503,{error:'Avisos de vencimento desativados'});
  const cfg=emailConfig(env),baseUrl=expiryAppUrl(env);
  let sql;
  try{sql=sqlProvider()}catch{return respond(res,503,{error:'Serviço indisponível'})}
  try{
    // The latest started plan must be Premium, and the user must be active.
    // Evaluate expiry by Fortaleza calendar date, not UTC day boundary.
    const due=await sql`
      SELECT u.user_id,u.name,u.email,s.subscription_id,s.ends_at,n.kind
      FROM public.central_users u
      JOIN LATERAL (
        SELECT subscription_id,plan_code,status,starts_at,ends_at,grant_source
        FROM public.central_user_subscriptions
        WHERE user_id=u.user_id AND starts_at<=NOW()
        ORDER BY starts_at DESC,created_at DESC
        LIMIT 1
      ) s ON TRUE
      CROSS JOIN (VALUES ('seven_days'::text,7),('expiry_day'::text,0)) n(kind,days_until)
      WHERE u.active=TRUE AND u.role='aluno'
        AND s.plan_code='premium' AND s.grant_source='hotmart'
        AND s.status IN ('active','cancelled') AND s.ends_at IS NOT NULL
        AND (s.ends_at AT TIME ZONE 'America/Fortaleza')::date =
           ((NOW() AT TIME ZONE 'America/Fortaleza')::date+n.days_until)
      ORDER BY s.ends_at,u.user_id
      LIMIT ${MAX_BATCH}
    `;
    let sent=0,failed=0,skipped=0,duplicates=0;
    for(const item of due){
      const id=newId();
      const reserved=await sql`
        INSERT INTO public.central_premium_expiry_notices
          (notice_id,subscription_id,user_id,kind,ends_at,status)
        VALUES (${id},${item.subscription_id},${item.user_id},
          ${item.kind},${item.ends_at},'sending')
        ON CONFLICT (subscription_id,kind,ends_at) DO NOTHING
        RETURNING notice_id
      `;
      if(!reserved.length){duplicates++;continue}
      try{
        // Re-check after reserving: skip if a concurrent renewal or revocation
        // changed the entitlement. No marketing preference is consulted.
        const valid=await sql`
          SELECT 1 FROM public.central_user_subscriptions s
          JOIN public.central_users u ON u.user_id=s.user_id
          WHERE s.subscription_id=${item.subscription_id} AND s.user_id=${item.user_id}
            AND s.ends_at=${item.ends_at} AND s.plan_code='premium'
            AND s.status IN ('active','cancelled') AND s.grant_source='hotmart'
            AND u.active=TRUE AND u.role='aluno'
            AND NOT EXISTS (
              SELECT 1 FROM public.central_user_subscriptions newer
              WHERE newer.user_id=s.user_id AND newer.starts_at<=NOW()
                AND (newer.starts_at>s.starts_at
                  OR (newer.starts_at=s.starts_at AND newer.created_at>s.created_at))
            ) LIMIT 1
        `;
        if(!valid.length||!EMAIL_PATTERN.test(String(item.email||''))){
          await sql`UPDATE public.central_premium_expiry_notices
            SET status='skipped',completed_at=NOW()
            WHERE notice_id=${id} AND status='sending'`;
          skipped++;continue;
        }
        const message=expiryReminderMessage({
          name:item.name,endsAt:item.ends_at,kind:item.kind,baseUrl
        });
        const messageId=await sendEmail({
          from:cfg.from,to:item.email,...message,
          messageId:'<'+id+'@basecompleta.local>'
        },cfg);
        await sql`UPDATE public.central_premium_expiry_notices
          SET status='sent',smtp_message_id=${String(messageId||'').slice(0,250)},
              completed_at=NOW()
          WHERE notice_id=${id} AND status='sending'`;
        sent++;
      }catch(error){
        // No automatic retry of ambiguous SMTP outcomes: a send may have been
        // accepted even when response/DB update fails. Review failed records.
        const code=String(error?.code||error?.name||'UNKNOWN').replace(/[^A-Za-z0-9_]/g,'').slice(0,30);
        await sql`UPDATE public.central_premium_expiry_notices
          SET status='failed',error_code=${code},completed_at=NOW()
          WHERE notice_id=${id} AND status='sending'`;
        failed++;
      }
    }
    return respond(res,200,{ok:true,selected:due.length,sent,failed,skipped,duplicates,
      capped:due.length===MAX_BATCH});
  }catch(error){
    console.error('premium expiry cron failure',String(error?.code||error?.name||'UNKNOWN').slice(0,25));
    return respond(res,503,{error:'Não foi possível processar os avisos'});
  }
 }
}
export default createExpiryReminderHandler();
