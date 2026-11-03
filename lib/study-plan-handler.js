
import crypto from 'node:crypto';
import {readJsonBody,requireSession,sameOriginRequest} from './auth.js';
import {parseStudyPlanZip,knownModule} from './study-plan-import.js';
import {STUDY_PLAN_MODULES} from './study-plan-module-catalog.js';

const SUBJECT_IDS=new Set(['pt','cf','adm','civil','cpc','penal','cpp','rlm']);
const uuid=v=>typeof v==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
function reply(res,status,body){
 res.statusCode=status;
 res.setHeader('Content-Type','application/json; charset=utf-8');
 res.setHeader('Cache-Control','private, no-store');
 res.setHeader('X-Content-Type-Options','nosniff');
 res.setHeader('Referrer-Policy','no-referrer');
 return res.end(JSON.stringify(body));
}
const fail=(res,status,error)=>reply(res,status,{error});
let ready;
async function setup(sql){
 if(!ready)ready=(async()=>{
  await sql`CREATE TABLE IF NOT EXISTS central_study_plans(
    id UUID PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES central_users(user_id) ON DELETE CASCADE,
    source_plan_id TEXT,
    sha256 CHAR(64) NOT NULL,
    title TEXT NOT NULL,
    original JSONB NOT NULL,
    normalized JSONB NOT NULL,
    pdf_bytes BYTEA NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '24 months'),
    UNIQUE(user_id,sha256), UNIQUE(user_id,id)
  )`;
  await sql`CREATE TABLE IF NOT EXISTS central_study_plan_active(
    user_id TEXT PRIMARY KEY REFERENCES central_users(user_id) ON DELETE CASCADE,
    plan_id UUID NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    FOREIGN KEY(user_id,plan_id) REFERENCES central_study_plans(user_id,id) ON DELETE CASCADE
  )`;
  await sql`CREATE TABLE IF NOT EXISTS central_study_plan_task_state(
    user_id TEXT NOT NULL,
    plan_id UUID NOT NULL,
    task_id TEXT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    subject_id TEXT,
    module_uid TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY(user_id,plan_id,task_id),
    FOREIGN KEY(user_id,plan_id) REFERENCES central_study_plans(user_id,id) ON DELETE CASCADE
  )`;
  await sql`CREATE INDEX IF NOT EXISTS central_study_plans_user_date_idx ON central_study_plans(user_id,created_at DESC)`;
 })().catch(e=>{ready=null;throw e});
 return ready;
}
async function owned(sql,userId,id){
 const r=await sql`SELECT id,title,original,normalized,created_at,expires_at
 FROM central_study_plans WHERE id=${id}::uuid AND user_id=${userId} AND expires_at>NOW() LIMIT 1`;
 return r[0]||null;
}
async function activeId(sql,userId){
 const r=await sql`SELECT plan_id FROM central_study_plan_active WHERE user_id=${userId} LIMIT 1`;
 return r[0]?.plan_id||null;
}
async function activate(sql,userId,id){
 await sql`INSERT INTO central_study_plan_active(user_id,plan_id,updated_at)
 VALUES(${userId},${id}::uuid,NOW())
 ON CONFLICT(user_id) DO UPDATE SET plan_id=EXCLUDED.plan_id,updated_at=NOW()`;
}
function summary(row,active){
 const n=row.normalized||{};
 return {id:row.id,titulo:row.title,criadoEm:row.created_at,expiraEm:row.expires_at,
 ativo:String(row.id)===String(active||''),aluno:n.nome,objetivo:n.objetivo,cargo:n.cargo,
 inicio:n.periodo_inicio,fim:n.periodo_fim,resumo:n.resumo||{}};
}

export default async function handleStudyPlans(req,res){
 // Preview recebe variáveis do projeto inteiro por padrão; nunca acessar banco sem guarda.
 if(process.env.VERCEL_ENV==='preview' &&
   (process.env.BC_STUDY_PLANS_PREVIEW_ISOLATED!=='YES'||process.env.BC_PREVIEW_NEON_GUARD!=='YES'))
   return fail(res,503,'Importação bloqueada: banco Preview não isolado.');
 if(!['GET','POST','PATCH','DELETE'].includes(req.method)){
   res.setHeader('Allow','GET, POST, PATCH, DELETE');return fail(res,405,'Método não permitido');
 }
 if(req.method!=='GET'&&(!sameOriginRequest(req)||
  !String(req.headers?.['content-type']||'').toLowerCase().startsWith('application/json')))
   return fail(res,403,'Origem ou formato inválido');
 if(req.method!=='GET'&&Number(req.headers?.['content-length']||0)>4_100_000)
   return fail(res,413,'Arquivo acima do limite');
 let session;
 try{session=await requireSession(req,['admin','editor','aluno'])}
 catch(_){return fail(res,503,'Autenticação temporariamente indisponível')}
 if(!session.ok)return fail(res,session.status,session.error);
 const {sql,user}=session,userId=user.id;
 const action=String(req.query?.action||'').toLowerCase();
 const id=String(req.query?.id||'');
 try{
  await setup(sql);
  if(req.method==='GET'){
   if(action==='catalog')return reply(res,200,{
    disciplinas:[...SUBJECT_IDS],
    modulos:STUDY_PLAN_MODULES.map(m=>({uid:m.uid,disciplina_id:m.subjectId,titulo:m.title,url:m.url}))
   });
   if(action==='pdf'){
    if(!uuid(id))return fail(res,400,'Identificador inválido');
    const r=await sql`SELECT encode(pdf_bytes,'base64') AS pdf FROM central_study_plans
    WHERE id=${id}::uuid AND user_id=${userId} AND expires_at>NOW() LIMIT 1`;
    if(!r.length)return fail(res,404,'Plano não encontrado');
    const b=Buffer.from(r[0].pdf,'base64');
    res.statusCode=200;
    res.setHeader('Content-Type','application/pdf');
    res.setHeader('Content-Length',String(b.length));
    res.setHeader('Content-Disposition',req.query?.download==='1'?'attachment; filename="plano-base-completa.pdf"':'inline; filename="plano-base-completa.pdf"');
    res.setHeader('Cache-Control','private, no-store');
    res.setHeader('Content-Security-Policy','sandbox');
    res.setHeader('X-Content-Type-Options','nosniff');
    res.setHeader('Referrer-Policy','no-referrer');
    return res.end(b);
   }
   if(id){
    if(!uuid(id))return fail(res,400,'Identificador inválido');
    const row=await owned(sql,userId,id);
    if(!row)return fail(res,404,'Plano não encontrado');
    const state=await sql`SELECT task_id,completed,subject_id,module_uid
      FROM central_study_plan_task_state WHERE user_id=${userId} AND plan_id=${id}::uuid`;
    const stateMap=new Map(state.map(x=>[x.task_id,x]));
    const activities=(row.normalized.atividades||[]).map(x=>{
      const st=stateMap.get(x.id);return {...x,concluida:st?.completed===true,
      disciplina_confirmada:st?.subject_id||null,modulo_confirmado:st?.module_uid||null};
    });
    const done=activities.filter(a=>a.concluida).length;
    return reply(res,200,{plano:summary(row,await activeId(sql,userId)),
      dadosOriginais:row.original,atividades:activities,
      progresso:{total:activities.length,concluidas:done,percentual:activities.length?Math.round(100*done/activities.length):0}});
   }
   const rows=await sql`SELECT id,title,normalized,created_at,expires_at FROM central_study_plans
     WHERE user_id=${userId} AND expires_at>NOW() ORDER BY created_at DESC LIMIT 20`;
   const active=await activeId(sql,userId);
   return reply(res,200,{planos:rows.map(x=>summary(x,active)),ativoId:active});
  }
  let body;
  try{body=await readJsonBody(req)}catch(_){return fail(res,400,'JSON da requisição inválido')}
  if(req.method==='POST'){
   if(!['preview','import'].includes(action))return fail(res,400,'Ação inválida');
   if(typeof body?.zipBase64!=='string')return fail(res,400,'Envie um ZIP');
   const parsed=parseStudyPlanZip(body.zipBase64);
   if(action==='preview')return reply(res,200,{
     valido:true,sha256:parsed.sha256,plano:parsed.normalized,
     aviso:'Confira nome e concurso antes de confirmar a importação.'
   });
   const old=await sql`SELECT id FROM central_study_plans WHERE user_id=${userId}
      AND sha256=${parsed.sha256} AND expires_at>NOW() LIMIT 1`;
   let newId=old[0]?.id;
   if(!newId){
    const count=await sql`SELECT COUNT(*)::int AS total FROM central_study_plans
      WHERE user_id=${userId} AND expires_at>NOW()`;
    if(Number(count[0]?.total||0)>=20)return fail(res,409,'Limite de 20 planos por aluno.');
    newId=crypto.randomUUID();
    const json=JSON.stringify(parsed.document),normalized=JSON.stringify(parsed.normalized);
    const hex=parsed.pdf.toString('hex');
    const inserted=await sql`INSERT INTO central_study_plans
     (id,user_id,source_plan_id,sha256,title,original,normalized,pdf_bytes)
     VALUES(${newId}::uuid,${userId},${parsed.normalized.plano_id},${parsed.sha256},
       ${parsed.normalized.titulo},${json}::jsonb,${normalized}::jsonb,decode(${hex},'hex'))
     ON CONFLICT(user_id,sha256) DO NOTHING RETURNING id`;
    if(inserted.length)newId=inserted[0].id;
    else {
      const r=await sql`SELECT id FROM central_study_plans WHERE user_id=${userId} AND sha256=${parsed.sha256} LIMIT 1`;
      newId=r[0]?.id;
    }
   }
   if(!newId)return fail(res,503,'Falha ao salvar plano');
   if(body.ativar!==false)await activate(sql,userId,newId);
   return reply(res,old.length?200:201,{ok:true,id:newId,jaExistia:!!old.length,ativo:body.ativar!==false});
  }

  if(!uuid(id))return fail(res,400,'Identificador inválido');
  const row=await owned(sql,userId,id);
  if(!row)return fail(res,404,'Plano não encontrado');
  if(req.method==='DELETE'){
   await sql`DELETE FROM central_study_plans WHERE id=${id}::uuid AND user_id=${userId}`;
   return reply(res,200,{ok:true,excluido:id});
  }
  if(action==='activate'){
   await activate(sql,userId,id);return reply(res,200,{ok:true,ativoId:id});
  }
  if(!['toggle','confirm'].includes(action))return fail(res,400,'Ação inválida');
  const taskId=String(body?.taskId||'');
  const task=(row.normalized.atividades||[]).find(t=>t.id===taskId);
  if(!task)return fail(res,404,'Atividade não encontrada');
  if(action==='toggle'){
   if(typeof body?.concluida!=='boolean')return fail(res,400,'Conclusão inválida');
   await sql`INSERT INTO central_study_plan_task_state(user_id,plan_id,task_id,completed)
     VALUES(${userId},${id}::uuid,${taskId},${body.concluida})
     ON CONFLICT(user_id,plan_id,task_id) DO UPDATE SET completed=EXCLUDED.completed,updated_at=NOW()`;
   return reply(res,200,{ok:true,taskId,concluida:body.concluida});
  }
  const subjectId=String(body?.disciplinaId||''),moduleUid=String(body?.moduloUid||'');
  if(!SUBJECT_IDS.has(subjectId))return fail(res,400,'Disciplina inválida');
  if(moduleUid&&!knownModule(subjectId,moduleUid,''))return fail(res,400,'Módulo incompatível');
  await sql`INSERT INTO central_study_plan_task_state(user_id,plan_id,task_id,subject_id,module_uid)
    VALUES(${userId},${id}::uuid,${taskId},${subjectId},${moduleUid||null})
    ON CONFLICT(user_id,plan_id,task_id) DO UPDATE
      SET subject_id=EXCLUDED.subject_id,module_uid=EXCLUDED.module_uid,updated_at=NOW()`;
  return reply(res,200,{ok:true,taskId,disciplinaId:subjectId,moduloUid:moduleUid||null});
 }catch(e){
  if(e?.status===422)return fail(res,422,e.message);
  console.error('study-plans',String(e?.code||e?.name||'UNKNOWN').slice(0,40));
  return fail(res,503,'Não foi possível processar o plano.');
 }
}
