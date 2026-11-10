// Base diária para cálculo futuro de variações semanais reais.
// Nunca envia mensagens; somente registra contadores acumulados de alunos ativos
// que consentiram com comunicação por e-mail. Retenção máxima: 70 dias.
import {database} from './auth.js';
export function studySnapshotsEnabled(env=process.env){
  return env.VERCEL_ENV==='production' && env.BC_STUDY_EMAIL_SNAPSHOTS_ENABLED==='YES';
}
export async function captureStudyEmailSnapshots({env=process.env,sqlProvider=database}={}){
  if(!studySnapshotsEnabled(env))return {disabled:true,saved:0};
  const sql=sqlProvider();
  await sql`
    CREATE TABLE IF NOT EXISTS public.central_email_study_snapshots (
      user_id TEXT NOT NULL REFERENCES public.central_users(user_id) ON DELETE CASCADE,
      snapshot_date DATE NOT NULL,
      questions BIGINT NOT NULL,
      study_seconds BIGINT NOT NULL,
      overall_pct INTEGER NOT NULL,
      disciplines JSONB NOT NULL DEFAULT '[]'::jsonb,
      last_study TIMESTAMPTZ,
      PRIMARY KEY(user_id,snapshot_date)
    )
  `;
  const saved=await sql`
    INSERT INTO public.central_email_study_snapshots
    (user_id,snapshot_date,questions,study_seconds,overall_pct,disciplines,last_study)
    SELECT u.user_id,(NOW() AT TIME ZONE 'America/Fortaleza')::date,
      GREATEST(p.questions,0),GREATEST(p.study_seconds,0),
      p.overall_pct,p.disciplines,p.last_study
    FROM public.central_user_progress_summary p
    JOIN public.central_users u ON u.user_id=p.user_id
    JOIN public.central_free_signup_contacts consent ON consent.user_id=u.user_id
    WHERE u.active=TRUE AND u.role='aluno'
      AND consent.email_marketing_opt_in=TRUE AND consent.email_marketing_revoked_at IS NULL
    ON CONFLICT(user_id,snapshot_date) DO UPDATE
      SET questions=EXCLUDED.questions,study_seconds=EXCLUDED.study_seconds,
      overall_pct=EXCLUDED.overall_pct,disciplines=EXCLUDED.disciplines,
      last_study=EXCLUDED.last_study
    RETURNING user_id
  `;
  await sql`
    DELETE FROM public.central_email_study_snapshots
    WHERE snapshot_date<(NOW() AT TIME ZONE 'America/Fortaleza')::date-70
  `;
  return {disabled:false,saved:saved.length};
}
export function weeklyDelta(before,after){
  if(!before||!after)return null;
  const q=Number(after.questions)-Number(before.questions);
  const s=Number(after.study_seconds)-Number(before.study_seconds);
  if(!Number.isFinite(q)||!Number.isFinite(s)||q<0||s<0)return null;
  const old=new Map((Array.isArray(before.disciplines)?before.disciplines:[])
    .map(d=>[String(d.id),Number(d.pct)]));
  const changed=(Array.isArray(after.disciplines)?after.disciplines:[])
    .filter(d=>Number(d.pct)>Number(old.get(String(d.id))||0))
    .map(d=>String(d.name||'').slice(0,120));
  return {questions:Math.round(q),studySeconds:Math.round(s),disciplines:changed};
}
