import {database, requireSession, sameOriginRequest, readJsonBody, readCookie} from '../lib/auth.js';

const IS_PREVIEW=process.env.VERCEL_ENV!=='production';
function send(res,status,body){
 res.statusCode=status;
 res.setHeader('Content-Type','application/json; charset=utf-8');
 res.setHeader('Cache-Control','private, no-store');
 res.setHeader('X-Content-Type-Options','nosniff');
 res.end(JSON.stringify(body));
}
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
async function ensurePreview(sql){
 await sql`CREATE TABLE IF NOT EXISTS lei_em_dia_edits_preview (
  question_id TEXT PRIMARY KEY, data JSONB NOT NULL, revision INTEGER NOT NULL DEFAULT 1,
  editor_id TEXT NOT NULL, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
 )`;
 await sql`CREATE TABLE IF NOT EXISTS lei_em_dia_edit_history_preview (
  id BIGSERIAL PRIMARY KEY, question_id TEXT NOT NULL, revision INTEGER NOT NULL,
  data JSONB NOT NULL, editor_id TEXT NOT NULL, changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
 )`;
}
export function validateEditPayload(body){
 const id=String(body?.id||''),data=body?.data,revision=body?.revision;
 if(!/^[a-zA-Z0-9_.:-]{1,200}$/.test(id))return 'Identificador inválido';
 if(!data||typeof data!=='object'||Array.isArray(data))return 'Dados da questão inválidos';
 const allowed=['statement','explanation','answer','discipline','topicId','subtopic','moduleId'];
 if(Object.keys(data).some(k=>!allowed.includes(k)))return 'Campo de edição não permitido';
 if(typeof data.statement!=='string'||data.statement.trim().length<10||data.statement.length>20000)return 'Enunciado inválido';
 if(typeof data.explanation!=='string'||data.explanation.length>30000)return 'Explicação inválida';
 if(typeof data.answer!=='boolean')return 'Gabarito inválido';
 const classification=['discipline','topicId','subtopic','moduleId'];
 const supplied=classification.filter(k=>Object.hasOwn(data,k));
 if(supplied.length&&supplied.length!==4)return 'Classificação incompleta';
 if(supplied.length){
  if(!/^(cf|adm|civil|cpc|penal|cpp|consumidor)$/.test(data.discipline))return 'Disciplina inválida';
  if(typeof data.topicId!=='string'||!/^[-a-zA-Z0-9_.:]{1,180}$/.test(data.topicId))return 'Assunto inválido';
  if(typeof data.subtopic!=='string'||!data.subtopic.trim()||data.subtopic.length>600)return 'Subassunto inválido';
  if(typeof data.moduleId!=='string'||(data.moduleId!==''&&!/^[-a-zA-Z0-9_.:]{1,150}$/.test(data.moduleId)))return 'Módulo inválido';
 }
 if(!Number.isSafeInteger(revision)||revision<0)return 'Revisão inválida';
 return '';
}
export default async function handler(req,res){
 try{
  if(!['GET','PUT'].includes(req.method)){res.setHeader('Allow','GET, PUT');return send(res,405,{error:'Método não permitido'});}
  // A leitura das correções é pública; apenas salvar exige sessão administrativa.
  if(req.method==='GET'){
   const sql=database();await (IS_PREVIEW?ensurePreview:ensure)(sql);
   const edits=IS_PREVIEW
    ? await sql`SELECT question_id,data,revision FROM lei_em_dia_edits_preview`
    : await sql`SELECT question_id,data,revision FROM lei_em_dia_edits`;
   let canEdit=false;
   if(readCookie(req)){
    try{const auth=await requireSession(req,['admin']);canEdit=auth.ok===true}catch(_){}
   }
   return send(res,200,{edits,canEdit});
  }
  if(!sameOriginRequest(req))return send(res,403,{error:'Origem não autorizada'});
  const session=await requireSession(req,['admin']);
  if(!session.ok)return send(res,session.status||403,{error:session.error||'Edição exclusiva do administrador'});
  const body=await readJsonBody(req);
  const validation=validateEditPayload(body);
  if(validation)return send(res,400,{error:validation});
  const {id,data,revision}=body;
  const sql=session.sql||database();await (IS_PREVIEW?ensurePreview:ensure)(sql);
  const encoded=JSON.stringify(data),actor=session.user.id;
  // Edição e registro de histórico acontecem na mesma instrução atômica.
  const rows=IS_PREVIEW
    ? await sql`WITH change AS (
    INSERT INTO lei_em_dia_edits_preview(question_id,data,revision,editor_id)
    VALUES(${id},${encoded}::jsonb,1,${actor})
    ON CONFLICT(question_id) DO UPDATE SET
      data=EXCLUDED.data,revision=lei_em_dia_edits_preview.revision+1,
      editor_id=EXCLUDED.editor_id,updated_at=NOW()
    WHERE lei_em_dia_edits_preview.revision=${revision}
    RETURNING question_id,data,revision,editor_id
   ), recorded AS (
    INSERT INTO lei_em_dia_edit_history_preview(question_id,revision,data,editor_id)
    SELECT question_id,revision,data,editor_id FROM change
    RETURNING revision
   ) SELECT revision FROM recorded`
    : await sql`WITH change AS (
    INSERT INTO lei_em_dia_edits(question_id,data,revision,editor_id)
    VALUES(${id},${encoded}::jsonb,1,${actor})
    ON CONFLICT(question_id) DO UPDATE SET
      data=EXCLUDED.data,revision=lei_em_dia_edits.revision+1,
      editor_id=EXCLUDED.editor_id,updated_at=NOW()
    WHERE lei_em_dia_edits.revision=${revision}
    RETURNING question_id,data,revision,editor_id
   ), recorded AS (
    INSERT INTO lei_em_dia_edit_history(question_id,revision,data,editor_id)
    SELECT question_id,revision,data,editor_id FROM change
    RETURNING revision
   ) SELECT revision FROM recorded`;
  if(!rows.length)return send(res,409,{error:'Questão já alterada em outra sessão. Recarregue para não sobrescrever.'});
  return send(res,200,{ok:true,revision:Number(rows[0].revision)});
 }catch(e){
  console.error('lei em dia editor',e);
  return send(res,500,{error:'Não foi possível acessar o banco de edições'});
 }
}

