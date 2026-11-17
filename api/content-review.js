/* Painel de revisão: somente administradores, identidade verificada na sessão. */
import {readJsonBody,requireSession,sameOriginRequest} from '../lib/auth.js';
import {ensureReviewTables,normalizeReviewKey,statusView} from '../lib/module-review.js';
function send(res,status,body){
 res.statusCode=status;res.setHeader('Content-Type','application/json; charset=utf-8');
 res.setHeader('Cache-Control','private, no-store');res.end(JSON.stringify(body));
}
export default async function handler(req,res){
 try{
  const auth=await requireSession(req,['admin']);
  if(!auth.ok)return send(res,auth.status,{error:auth.error});
  const sql=auth.sql;await ensureReviewTables(sql);
  if(req.method==='GET'){
   const raw=String(req.query?.key||'');
   const key=raw?normalizeReviewKey(raw):'';
   if(raw&&!key)return send(res,400,{error:'Módulo inválido'});
   if(key){
    const rows=await sql`SELECT * FROM central_module_review_status WHERE module_key=${key} LIMIT 1`;
    return send(res,200,{item:statusView(rows[0],key)});
   }
   const rows=await sql`SELECT * FROM central_module_review_status ORDER BY module_key LIMIT 500`;
   const events=await sql`
     SELECT module_key,content_id,revision,action,actor_name,at
     FROM central_module_review_events ORDER BY event_id DESC LIMIT 100
   `;
   return send(res,200,{items:rows.map(row=>statusView(row,row.module_key)),
    events:events.map(row=>({key:row.module_key,contentId:row.content_id||null,
      revision:row.revision==null?null:Number(row.revision),
      action:row.action,by:row.actor_name,at:row.at}))});
  }
  if(req.method!=='POST'){res.setHeader('Allow','GET, POST');return send(res,405,{error:'Método não permitido'})}
  if(!sameOriginRequest(req))return send(res,403,{error:'Origem não permitida'});
  const body=await readJsonBody(req);
  const key=normalizeReviewKey(body?.key);
  if(!key||typeof body?.reviewed!=='boolean')return send(res,400,{error:'Informe módulo e situação da revisão'});
  const expected=Number(body?.expectedVersion);
  if(!Number.isSafeInteger(expected)||expected<0||body?.expectedVersion===undefined)
    return send(res,400,{error:'Versão da revisão inválida'});
  // Criação inicial neutra: o check será gravado com controle de concorrência.
  await sql`INSERT INTO central_module_review_status(module_key)
    VALUES(${key}) ON CONFLICT(module_key) DO NOTHING`;
  // Publicação de conteúdo ou outra revisão entre o GET e o POST gera 409,
  // em vez de marcar como revisado um conteúdo que foi alterado por outro ADM.
  const rows=await sql`
    WITH saved AS (
      UPDATE central_module_review_status
      SET reviewed=${body.reviewed},reviewed_by=${body.reviewed?auth.user.id:null},
          reviewed_by_name=${body.reviewed?auth.user.name:null},
          reviewed_at=CASE WHEN ${body.reviewed} THEN NOW() ELSE NULL END,
          version=version+1,updated_at=NOW()
      WHERE module_key=${key} AND version=${expected}
      RETURNING *
    ), logged AS (
      INSERT INTO central_module_review_events(module_key,content_id,revision,action,actor_id,actor_name)
      SELECT module_key,last_content_id,last_revision,
       ${body.reviewed?'review':'reopen'},${auth.user.id},${auth.user.name} FROM saved
      RETURNING event_id
    )
    SELECT saved.* FROM saved JOIN logged ON TRUE
  `;
  if(!rows.length)return send(res,409,{error:'Este módulo foi alterado ou revisado por outro administrador. Atualize a página.'});
  return send(res,200,{ok:true,item:statusView(rows[0],key)});
 }catch(error){
  console.error('content review error',String(error?.code||error?.name||'UNKNOWN').slice(0,40));
  return send(res,500,{error:'Não foi possível consultar ou atualizar as revisões'});
 }
}
