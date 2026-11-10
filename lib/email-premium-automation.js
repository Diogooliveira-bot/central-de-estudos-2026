// Avisos de assinatura por tarefa autenticada e idempotente.
// Desligado por padrão: exige BC_PREMIUM_EMAIL_AUTOMATION_ENABLED=YES.
import {database} from './auth.js';
import {sendApprovedEventEmail} from './approved-email-dispatcher.js';

export function premiumAutomationEnabled(env=process.env){
  return env.VERCEL_ENV==='production' && env.BC_PREMIUM_EMAIL_AUTOMATION_ENABLED==='YES';
}
export function premiumAutomationFields({name,endsAt,kind,base='https://app.basecompleta.com.br'}){
  const date=new Date(endsAt);
  if(!Number.isFinite(date.getTime())||!['expiring','expired'].includes(kind))throw Error('Dados de assinatura inválidos');
  const when=new Intl.DateTimeFormat('pt-BR',{timeZone:'America/Fortaleza',day:'2-digit',month:'2-digit',year:'numeric'}).format(date);
  const who=String(name||'').trim().split(/\s+/u)[0]||'estudante';
  if(kind==='expiring')return {
    PRIMEIRO_NOME:who,NOME_PLANO:'Premium',DATA_VENCIMENTO:when,
    PRAZO_RESTANTE:'7 dias',DIAS_RESTANTES:'7',
    LINK_CENTRAL:base+'/planos.html'
  };
  return {PRIMEIRO_NOME:who,NOME_PLANO:'Premium',DATA_VENCIMENTO:when,LINK_CENTRAL:base+'/planos.html'};
}
export async function ensureEmailJobsTable(sql){
  await sql`
    CREATE TABLE IF NOT EXISTS public.central_email_automation_jobs (
      event_key TEXT PRIMARY KEY,
      reserved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      sent_at TIMESTAMPTZ,
      attempts INTEGER NOT NULL DEFAULT 1,
      failure_code TEXT
    )
  `;
}
export async function runPremiumEmailAutomation({env=process.env,sqlProvider=database,sendEmail=sendApprovedEventEmail,now=new Date()}={}){
  if(!premiumAutomationEnabled(env))return {disabled:true,attempted:0,sent:0,failed:0};
  const sql=sqlProvider();
  await ensureEmailJobsTable(sql);
  // Apenas Premium vigente com vencimento em 7 dias ou recém-vencido.
  // Assinaturas renovadas por outro registro ativo não devem gerar alertas antigos.
  const rows=await sql`
    SELECT s.subscription_id,s.ends_at,u.name,u.email,
      CASE WHEN s.ends_at>NOW() THEN 'expiring' ELSE 'expired' END AS kind
    FROM public.central_user_subscriptions s
    JOIN public.central_users u ON u.user_id=s.user_id
    WHERE s.plan_code='premium' AND s.status='active' AND u.active=TRUE AND u.role='aluno'
      AND ((s.ends_at>NOW()+INTERVAL '6 days' AND s.ends_at<=NOW()+INTERVAL '7 days')
         OR (s.ends_at<=NOW() AND s.ends_at>NOW()-INTERVAL '1 day'))
      AND NOT EXISTS (
        SELECT 1 FROM public.central_user_subscriptions newer
        WHERE newer.user_id=s.user_id AND newer.subscription_id<>s.subscription_id
          AND newer.plan_code='premium' AND newer.status='active'
          AND newer.starts_at<=NOW() AND newer.ends_at>s.ends_at
      )
    ORDER BY s.ends_at ASC LIMIT 50
  `;
  const outcome={attempted:0,sent:0,failed:0};
  for(const row of rows){
    const kind=row.kind==='expiring'?'expiring':'expired';
    const type=kind==='expiring'?'premium-perto-do-vencimento':'premium-expirado';
    const eventKey=kind+':'+String(row.subscription_id);
    const reserved=await sql`
      INSERT INTO public.central_email_automation_jobs (event_key)
      VALUES(${eventKey})
      ON CONFLICT(event_key) DO UPDATE
        SET reserved_at=NOW(), attempts=public.central_email_automation_jobs.attempts+1
        WHERE public.central_email_automation_jobs.sent_at IS NULL
          AND public.central_email_automation_jobs.reserved_at<NOW()-INTERVAL '30 minutes'
      RETURNING event_key
    `;
    if(!reserved.length)continue;
    outcome.attempted++;
    try{
      const fields=premiumAutomationFields({name:row.name,endsAt:row.ends_at,kind});
      await sendEmail({type,to:row.email,fields,verifiedEventId:eventKey,env});
      await sql`UPDATE public.central_email_automation_jobs SET sent_at=NOW(),failure_code=NULL WHERE event_key=${eventKey}`;
      outcome.sent++;
    }catch(err){
      const code=String(err?.code||err?.name||'UNKNOWN').replace(/[^A-Z0-9_]/gi,'').slice(0,40);
      await sql`UPDATE public.central_email_automation_jobs SET failure_code=${code} WHERE event_key=${eventKey}`;
      outcome.failed++;
    }
  }
  return outcome;
}
