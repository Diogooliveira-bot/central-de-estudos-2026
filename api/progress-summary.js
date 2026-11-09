import { readJsonBody, sameOriginRequest } from '../lib/auth.js';
import { requirePlanFeature } from '../lib/plan-access.js';

function send(res,status,body){
  res.statusCode=status;
  res.setHeader('Content-Type','application/json; charset=utf-8');
  res.setHeader('Cache-Control','no-store');
  res.end(JSON.stringify(body));
}
function clamp(value,min,max){
  const n=Number(value);
  return Number.isFinite(n)?Math.max(min,Math.min(max,n)):min;
}
function cleanSummary(input){
  const disciplines=Array.isArray(input?.disciplines)?input.disciplines.slice(0,40).map((d)=>({
    id:String(d?.id||'').slice(0,60),
    name:String(d?.name||'').slice(0,120),
    pct:Math.round(clamp(d?.pct,0,100)),
  })).filter((d)=>d.id&&d.name):[];
  const modules=Array.isArray(input?.modules)?input.modules.slice(0,800).map(m=>({
    subjectId:String(m?.subjectId||'').slice(0,40),
    name:String(m?.name||'').slice(0,150),
    pct:Math.round(clamp(m?.pct,0,100))
  })).filter(m=>m.subjectId&&m.name):[];
  const lastStudyRaw=input?.lastStudy?new Date(input.lastStudy):null;
  return {
    overallPct:Math.round(clamp(input?.overallPct,0,100)),
    questions:Math.max(0,Math.trunc(clamp(input?.questions,0,10_000_000))),
    studySeconds:Math.max(0,Math.trunc(clamp(input?.studySeconds,0,100_000_000))),
    lastStudy:lastStudyRaw&&!Number.isNaN(lastStudyRaw.getTime())?lastStudyRaw.toISOString():null,
    disciplines,
    modules,
  };
}
async function ensureTable(sql){
  await sql`
    CREATE TABLE IF NOT EXISTS central_user_progress_summary (
      user_id TEXT PRIMARY KEY REFERENCES central_users(user_id) ON DELETE CASCADE,
      overall_pct INTEGER NOT NULL DEFAULT 0,
      questions BIGINT NOT NULL DEFAULT 0,
      study_seconds BIGINT NOT NULL DEFAULT 0,
      last_study TIMESTAMPTZ,
      disciplines JSONB NOT NULL DEFAULT '[]'::jsonb,
      modules JSONB NOT NULL DEFAULT '[]'::jsonb,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`ALTER TABLE central_user_progress_summary ADD COLUMN IF NOT EXISTS modules JSONB NOT NULL DEFAULT '[]'::jsonb`;
}

export default async function handler(req,res){
  if(req.method!=='GET'&&!sameOriginRequest(req))return send(res,403,{error:'Origem da requisição não permitida'});
  const session=await requirePlanFeature(req,'progress.advanced_sync',['admin','editor','aluno']);
  if(!session.ok)return send(res,session.status,{error:session.error});
  try{
    const sql=session.sql;
    await ensureTable(sql);

    if(req.method==='GET'){
      const rows=await sql`
        SELECT overall_pct,questions,study_seconds,last_study,disciplines,modules,updated_at
        FROM central_user_progress_summary
        WHERE user_id=${session.user.id}
        LIMIT 1
      `;
      return send(res,200,{summary:rows[0]||null});
    }

    if(req.method==='POST'){
      const body=await readJsonBody(req);
      const summary=cleanSummary(body?.summary||body||{});
      const disciplines=JSON.stringify(summary.disciplines);
      const modules=JSON.stringify(summary.modules);
      const rows=await sql`
        INSERT INTO central_user_progress_summary
          (user_id,overall_pct,questions,study_seconds,last_study,disciplines,modules,updated_at)
        VALUES
          (${session.user.id},${summary.overallPct},${summary.questions},${summary.studySeconds},${summary.lastStudy},${disciplines}::jsonb,${modules}::jsonb,NOW())
        ON CONFLICT(user_id) DO UPDATE SET
          overall_pct=EXCLUDED.overall_pct,
          questions=EXCLUDED.questions,
          study_seconds=EXCLUDED.study_seconds,
          last_study=EXCLUDED.last_study,
          disciplines=EXCLUDED.disciplines,
          modules=EXCLUDED.modules,
          updated_at=NOW()
        RETURNING updated_at
      `;
      return send(res,200,{ok:true,updatedAt:rows[0].updated_at});
    }

    res.setHeader('Allow','GET, POST');
    return send(res,405,{error:'Método não permitido'});
  }catch(error){
    console.error('progress summary error',error);
    return send(res,500,{error:error?.message||'Falha ao salvar resumo de progresso'});
  }
}
