// Relatório semanal factual, limitado aos contadores que a Central realmente registra.
// Mantém o modelo completo aprovado no catálogo, sem preencher métricas ausentes com números fictícios.
import {database} from './auth.js';
import {weeklyDelta,studySnapshotsEnabled} from './email-study-snapshots.js';
import {ensureEmailJobsTable} from './email-premium-automation.js';
import {transactionalEmailConfig,sendTransactionalEmail} from './transactional-email.js';

const ZONE='America/Fortaleza';
export function weeklyEmailEnabled(env=process.env){
  return env.VERCEL_ENV==='production' && env.BC_WEEKLY_STUDY_EMAIL_ENABLED==='YES'
    && studySnapshotsEnabled(env);
}
function localDay(date=new Date()){
  return new Intl.DateTimeFormat('en-CA',{timeZone:ZONE,year:'numeric',month:'2-digit',day:'2-digit'}).format(date);
}
export function weeklyStudyMessage({name,questions,studySeconds,disciplines}){
  if(!Number.isInteger(questions)||questions<0||!Number.isInteger(studySeconds)||studySeconds<0)
    throw new Error('Contadores semanais inválidos');
  const who=String(name||'').trim().split(/\s+/u)[0]||'estudante';
  const mins=Math.round(studySeconds/60);
  const hours=Math.floor(mins/60),minutes=mins%60;
  const time=hours ? hours+'h'+(minutes?' '+minutes+'min':'') : mins+'min';
  const names=Array.isArray(disciplines)?disciplines.slice(0,8).map(x=>String(x).slice(0,90)):[];
  const disciplinesText=names.length?names.join(', '):'Nenhuma evolução de percentual identificada';
  const link='https://app.basecompleta.com.br/';
  const safe=(s)=>String(s).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const body=[
    'Olá, '+who+'!',
    'Confira a atividade registrada na sua Central nos últimos 7 dias.',
    'Questões registradas: '+questions+'.',
    'Tempo de estudo registrado: '+time+'.',
    'Disciplinas com avanço de progresso: '+disciplinesText+'.',
    'Estes números são calculados por diferença de registros acumulados; podem não incluir estudos feitos fora da Central.',
    'Acesse: '+link,
    'Você pode alterar suas preferências de comunicação na Central.'
  ];
  const html='<!doctype html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>'+
    '<body style="margin:0;padding:24px;background:#eef3f8;font-family:Arial,Helvetica,sans-serif;color:#10364c">'+
    '<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;max-width:620px;margin:0 auto;background:#fff;border:1px solid #dae6ee;border-radius:12px"><tr>'+
    '<td style="padding:24px 30px;font-size:20px;font-weight:700">BASE COMPLETA</td></tr>'+
    '<tr><td style="padding:30px;background:#10364c;color:#fff;border-top:4px solid #10c0d6">'+
    '<p style="font-size:12px;color:#7de3ee">RELATÓRIO DE ESTUDOS</p>'+
    '<h1 style="margin:0;font-size:27px;color:#fff">Sua semana na Central</h1></td></tr>'+
    '<tr><td style="padding:28px 30px"><p>Olá, '+safe(who)+'!</p>'+
    '<p>Confira sua atividade registrada nos últimos 7 dias.</p>'+
    '<p><b>Questões registradas:</b> '+questions+'</p>'+
    '<p><b>Tempo de estudo registrado:</b> '+safe(time)+'</p>'+
    '<p><b>Disciplinas com avanço:</b> '+safe(disciplinesText)+'</p>'+
    '<p style="color:#667788;font-size:13px">As informações consideram apenas o progresso registrado na Central, não estudos externos.</p>'+
    '<p><a href="'+link+'" style="color:#126180">Acessar minha Central</a></p>'+
    '<p style="color:#667788;font-size:12px">Altere suas preferências de comunicação na Central para deixar de receber este resumo.</p>'+
    '</td></tr></table></body></html>';
  return {subject:'Seu resumo semanal de estudos | Base Completa',text:body.join('\n\n'),html};
}

export async function runWeeklyEmailAutomation({
  env=process.env,sqlProvider=database,sendEmail=sendTransactionalEmail,now=new Date()
}={}){
  if(!weeklyEmailEnabled(env))return {disabled:true,attempted:0,sent:0,failed:0};
  // Uma execução na segunda-feira, 09:00 em Fortaleza, após a coleta dos contadores do dia.
  const today=localDay(now);
  const weekday=new Intl.DateTimeFormat('en-US',{weekday:'short',timeZone:ZONE}).format(now);
  if(weekday!=='Mon')return {skipped:'not-monday',attempted:0,sent:0,failed:0};
  const sql=sqlProvider();
  await ensureEmailJobsTable(sql);
  const rows=await sql`
    SELECT current.user_id,u.name,u.email,
      current.questions,current.study_seconds,current.disciplines,
      previous.questions AS previous_questions,
      previous.study_seconds AS previous_study_seconds,
      previous.disciplines AS previous_disciplines
    FROM public.central_email_study_snapshots current
    JOIN public.central_users u ON u.user_id=current.user_id
    JOIN public.central_free_signup_contacts consent ON consent.user_id=u.user_id
    JOIN LATERAL (
      SELECT old.questions,old.study_seconds,old.disciplines
      FROM public.central_email_study_snapshots old
      WHERE old.user_id=current.user_id AND old.snapshot_date<=current.snapshot_date-7
      ORDER BY old.snapshot_date DESC LIMIT 1
    ) previous ON TRUE
    WHERE current.snapshot_date=${today}::date
      AND u.active=TRUE AND u.role='aluno'
      AND consent.email_marketing_opt_in=TRUE
      AND consent.email_marketing_revoked_at IS NULL
    ORDER BY current.user_id
    LIMIT 50
  `;
  const outcome={attempted:0,sent:0,failed:0};
  const cfg=transactionalEmailConfig(env);
  if(!cfg)throw new Error('Provedor indisponível');
  for(const row of rows){
    const delta=weeklyDelta({
      questions:row.previous_questions,study_seconds:row.previous_study_seconds,
      disciplines:row.previous_disciplines
    },{
      questions:row.questions,study_seconds:row.study_seconds,disciplines:row.disciplines
    });
    if(!delta || (!delta.questions && !delta.studySeconds && !delta.disciplines.length))continue;
    const key='weekly:'+today+':'+String(row.user_id);
    const reservation=await sql`
      INSERT INTO public.central_email_automation_jobs(event_key)
      VALUES(${key})
      ON CONFLICT(event_key) DO UPDATE
        SET reserved_at=NOW(),attempts=public.central_email_automation_jobs.attempts+1
      WHERE public.central_email_automation_jobs.sent_at IS NULL
        AND public.central_email_automation_jobs.reserved_at<NOW()-INTERVAL '12 hours'
      RETURNING event_key
    `;
    if(!reservation.length)continue;
    outcome.attempted++;
    try{
      const mail=weeklyStudyMessage({name:row.name, ...delta});
      await sendEmail({to:row.email,from:cfg.from,...mail,auditKind:'weekly-study'},cfg);
      await sql`UPDATE public.central_email_automation_jobs SET sent_at=NOW(),failure_code=NULL WHERE event_key=${key}`;
      outcome.sent++;
    }catch(err){
      const code=String(err?.code||err?.name||'UNKNOWN').replace(/[^a-z0-9_]/gi,'').slice(0,40);
      await sql`UPDATE public.central_email_automation_jobs SET failure_code=${code} WHERE event_key=${key}`;
      outcome.failed++;
    }
  }
  return outcome;
}
