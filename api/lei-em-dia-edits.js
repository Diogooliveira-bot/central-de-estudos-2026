import {database, requireSession, sameOriginRequest, readJsonBody} from '../lib/auth.js';

const send=(res,status,body)=>{res.statusCode=status;res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');res.end(JSON.stringify(body));};
async function ensure(sql){
 await sql`CREATE TABLE IF NOT EXISTS lei_em_dia_edits (
  question_id TEXT PRIMARY KEY, data JSONB NOT NULL, revision INTEGER NOT NULL DEFAULT 1,
  editor_id TEXT NOT NULL, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
 )`;
 await sql`CREATE TABLE IF NOT EXISTS lei_em_dia_edit_history (
  id BIGSERIAL PRIMARY KEY, question_id TEXT NOT NULL, revision INTEGER NOT NULL,
  data JSONB NOT NULL, editor_id TEXT NOT NULL, changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
 )`;
}
export default async function handler(req,res){
 try{
  if(req.method!=='GET'&&req.method!=='PUT'){res.setHeader('Allow','GET, PUT');return send(res,405,{error:'Método inválido'});}
  const session=await requireSession(req);
  if(!session.ok)return send(res,401,{error:'Entre na Central para acessar as questões'});
  const sql=database();await ensure(sql);
  if(req.method==='GET'){
   const rows=await sql`SELECT question_id,data,revision FROM lei_em_dia_edits`;
   return send(res,200,{edits:rows,canEdit:session.user.role==='admin'});
  }
  if(!sameOriginRequest(req))return send(res,403,{error:'Origem não autorizada'});
  if(session.user.role!=='admin')return send(res,403,{error:'Edição exclusiva do administrador'});
  const body=await readJsonBody(req),id=String(body.id||'');
  const data=body.data,revision=Number(body.revision||0);
  if(!/^[a-zA-Z0-9_-]{1,150}$/.test(id)||!data||typeof data!=='object'||Array.isArray(data))return send(res,400,{error:'Dados inválidos'});
  if(Object.keys(data).some(k=>!['statement','explanation','answer'].includes(k))||typeof data.statement!=='string'||data.statement.trim().length<10||data.statement.length>20000||typeof data.explanation!=='string'||data.explanation.length>30000||typeof data.answer!=='boolean'||!Number.isSafeInteger(revision)||revision<0)return send(res,400,{error:'Campos de edição inválidos'});
  const existing=await sql`SELECT revision FROM lei_em_dia_edits WHERE question_id=${id}`;
  const current=Number(existing[0]?.revision||0);
  if(current!==revision)return send(res,409,{error:'Questão alterada em outra sessão. Atualize antes de salvar.'});
  const newRevision=revision+1,encoded=JSON.stringify(data),actor=session.user.user_id;
  const rows=await sql`INSERT INTO lei_em_dia_edits(question_id,data,revision,editor_id) VALUES(${id},${encoded}::jsonb,1)
   ON CONFLICT(question_id) DO UPDATE SET data=EXCLUDED.data,revision=lei_em_dia_edits.revision+1,editor_id=EXCLUDED.editor_id,updated_at=NOW()
   WHERE lei_em_dia_edits.revision=${revision} RETURNING revision`;
  if(!rows.length)return send(res,409,{error:'Edição concorrente. Recarregue a questão.'});
  await sql`INSERT INTO lei_em_dia_edit_history(question_id,revision,data,editor_id) VALUES(${id},${rows[0].revision},${encoded}::jsonb,${actor})`;
  return send(res,200,{ok:true,revision:rows[0].revision});
 }catch(e){console.error('lei em dia editor',e);return send(res,500,{error:'Não foi possível acessar o banco de edições'});}
}
