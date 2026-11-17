import { database, readJsonBody, requireSession, sameOriginRequest } from '../lib/auth.js';
import { requirePlanFeature } from '../lib/plan-access.js';
import { handleContentImage } from '../lib/content-image-handler.js';
import { contentEditorReadFeature } from '../lib/content-editor-access.js';
import {ensureReviewTables,normalizeReviewKey,keyFromLabel} from '../lib/module-review.js';

function send(res,status,body){
  res.statusCode=status;
  res.setHeader('Content-Type','application/json; charset=utf-8');
  res.setHeader('Cache-Control','no-store');
  res.end(JSON.stringify(body));
}
async function ensureTable(sql){
  await sql`
    CREATE TABLE IF NOT EXISTS central_content_overrides (
      content_id TEXT PRIMARY KEY,
      label TEXT,
      html TEXT NOT NULL,
      revision BIGINT NOT NULL DEFAULT 1,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS central_content_override_history (
      content_id TEXT NOT NULL,
      revision BIGINT NOT NULL,
      label TEXT,
      html TEXT NOT NULL,
      archived_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY(content_id, revision)
    )
  `;
}
function cleanHtml(value){
  let html=String(value||'');
  html=html.replace(/<\s*(script|iframe|object|embed|form)\b[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi,'');
  html=html.replace(/<\s*(script|iframe|object|embed|form)\b[^>]*\/?>/gi,'');
  html=html.replace(/\son[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi,'');
  html=html.replace(/\s(href|src)\s*=\s*(["'])\s*javascript:[\s\S]*?\2/gi,'');
  return html;
}
const ORIENTATION_ID=/^orient:(?:adm|cf|civil|cpc|penal|cpp|rlm|info):\d{1,2}$/;
const ORIENTATION_FIELDS=['foco','atencao','dica'];
// Orientações iniciais são texto simples curto: aceitamos somente JSON com os três campos conhecidos.
export function normalizeOrientation(html){
  let data;
  try{data=JSON.parse(String(html||''))}catch(_){return null}
  if(!data||typeof data!=='object'||Array.isArray(data))return null;
  const out={};
  for(const field of ORIENTATION_FIELDS){
    const value=data[field];
    if(value===undefined||value===null||value==='')continue;
    if(typeof value!=='string')return null;
    const text=value.replace(/[<>]/g,'').replace(/\s+/g,' ').trim();
    if(text.length>400)return null;
    if(text)out[field]=text;
  }
  if(Object.keys(data).some(key=>!ORIENTATION_FIELDS.includes(key)))return null;
  return Object.keys(out).length?JSON.stringify(out):null;
}
export function imageSignature(html){
  const value=String(html||'');
  // O perfil editor pode preservar imagens existentes, mas não incluir,
  // remover, substituir ou alterar figuras já publicadas pelo administrador.
  const figures=(value.match(/<figure\b[^>]*>[\s\S]*?<\/figure\s*>/gi)||[]).filter(x=>/<(?:img|picture|svg|image)\b/i.test(x));
  const media=(value.match(/<\s*(?:img|picture|svg|image|source)\b[^>]*>/gi)||[]);
  return JSON.stringify({figures,media});
}
export default async function handler(req,res){
  if(req.query?.action==='image')return handleContentImage(req,res);
  try{
    const sql=database();await ensureTable(sql);
    const id=String(req.query?.id||'').trim().slice(0,240);
    if(req.method==='GET'&&req.query?.action==='history'){
      const historian=await requireSession(req,['admin','editor']);
      if(!historian.ok)return send(res,historian.status,{error:historian.error});
      if(!id)return send(res,400,{error:'ID do conteúdo não informado'});
      if(req.query?.revision!==undefined){
        const revision=Number(req.query.revision);
        if(!Number.isSafeInteger(revision)||revision<1)return send(res,400,{error:'Revisão inválida'});
        const rows=await sql`SELECT revision,label,html,archived_at FROM central_content_override_history WHERE content_id=${id} AND revision=${revision} LIMIT 1`;
        if(!rows.length)return send(res,404,{error:'Revisão não encontrada'});
        return send(res,200,{id,revision:Number(rows[0].revision),label:rows[0].label||'',html:rows[0].html,archivedAt:rows[0].archived_at});
      }
      const rows=await sql`SELECT revision,label,archived_at FROM central_content_override_history WHERE content_id=${id} ORDER BY revision DESC LIMIT 25`;
      return send(res,200,{id,versions:rows.map(r=>({revision:Number(r.revision),label:r.label||'',archivedAt:r.archived_at}))});
    }
    if(req.method==='GET'&&req.query?.action==='orientations'){
      // Orientação inicial é material gratuito e curto: qualquer conta ativa pode ler.
      const reader=await requireSession(req,['admin','editor','aluno']);
      if(!reader.ok)return send(res,reader.status,{error:reader.error});
      const rows=await sql`SELECT content_id,html,revision FROM central_content_overrides WHERE content_id LIKE 'orient:%' LIMIT 300`;
      const items=rows.filter(r=>ORIENTATION_ID.test(r.content_id)).map(r=>({id:r.content_id,html:r.html,revision:Number(r.revision||1)}));
      return send(res,200,{items});
    }
    if(req.method==='GET'){
      // Only fixed, audited guided-review IDs use the free summary entitlement.
      // Every other edited document fails closed under the Premium theory policy.
      const reader=await requirePlanFeature(req,contentEditorReadFeature(id),['admin','editor','aluno']);
      if(!reader.ok)return send(res,reader.status,{error:reader.error});
      if(!id)return send(res,400,{error:'ID do conteúdo não informado'});
      let rows=await sql`SELECT content_id,label,html,revision,updated_at FROM central_content_overrides WHERE content_id=${id} LIMIT 1`;
      // Importa automaticamente publicações feitas antes da adoção da chave estável.
      // A transação SQL preserva a última versão e seu histórico; a chave antiga permanece como backup.
      const legacyId=String(req.query?.legacyId||'').trim();
      if(!rows.length&&legacyId!==id&&/^reader:[a-z0-9]{1,50}$/.test(id)&&/^reader:[a-z0-9]{1,50}$/.test(legacyId)){
        await sql`
          WITH migrated AS (
            INSERT INTO central_content_overrides(content_id,label,html,revision,updated_at)
            SELECT ${id},label,html,revision,updated_at
            FROM central_content_overrides WHERE content_id=${legacyId}
            ON CONFLICT(content_id) DO NOTHING
            RETURNING content_id
          ), migrated_history AS (
            INSERT INTO central_content_override_history(content_id,revision,label,html,archived_at)
            SELECT ${id},h.revision,h.label,h.html,h.archived_at
            FROM central_content_override_history h
            WHERE h.content_id=${legacyId} AND EXISTS(SELECT 1 FROM migrated)
            ON CONFLICT(content_id,revision) DO NOTHING
            RETURNING revision
          )
          SELECT content_id FROM migrated
        `;
        rows=await sql`SELECT content_id,label,html,revision,updated_at FROM central_content_overrides WHERE content_id=${id} LIMIT 1`;
      }
      if(!rows.length)return send(res,200,{exists:false,id});
      const r=rows[0];
      return send(res,200,{exists:true,id:r.content_id,label:r.label||'',html:r.html,revision:Number(r.revision||1),updatedAt:r.updated_at});
    }
    if(!sameOriginRequest(req))return send(res,403,{error:'Origem da requisição não permitida'});
    const auth=await requireSession(req,['admin','editor']);
    if(!auth.ok)return send(res,auth.status,{error:auth.error});
    if(req.method==='POST'){
      const body=await readJsonBody(req);
      const contentId=String(body?.id||'').trim().slice(0,240);
      const label=String(body?.label||'').slice(0,240);
      const declaredKey=String(body?.moduleKey||'').trim();
      const moduleKey=normalizeReviewKey(declaredKey)||keyFromLabel(label);
      if(declaredKey&&!normalizeReviewKey(declaredKey))return send(res,400,{error:'Identificador do módulo inválido'});
      let html=cleanHtml(body?.html||'');
      if(contentId.startsWith('orient:')){
        if(!ORIENTATION_ID.test(contentId))return send(res,400,{error:'Identificador de orientação inválido'});
        html=normalizeOrientation(html);
        if(!html)return send(res,400,{error:'Orientação inválida: use apenas foco, atenção e dica (até 400 caracteres cada)'});
      }
      if(!contentId||!html)return send(res,400,{error:'Conteúdo definitivo inválido'});
      const bytes=Buffer.byteLength(html,'utf8');
      if(bytes>1_500_000)return send(res,413,{error:'Conteúdo acima de 1,5 MB'});
      if(auth.user.role!=='admin'){
        const previous=await sql`SELECT html FROM central_content_overrides WHERE content_id=${contentId} LIMIT 1`;
        if(imageSignature(html)!==imageSignature(previous[0]?.html||'')){
          return send(res,403,{error:'Somente o administrador pode adicionar, remover ou alterar imagens do módulo'});
        }
      }
      // expectedRevision is optional to preserve compatibility with the legacy editor.
      // The Premium editor always sends it to prevent overwriting another session.
      const hasExpected=body?.expectedRevision!==undefined&&body?.expectedRevision!==null;
      const expected=hasExpected?Number(body.expectedRevision):null;
      if(hasExpected&&(!Number.isSafeInteger(expected)||expected<0)){
        return send(res,400,{error:'Revisão esperada inválida'});
      }
      await ensureReviewTables(sql);
      // Publicação, histórico e identificação do editor são gravados na MESMA transação SQL:
      // se o backup falhar, a publicação também falha.
      const rows=await sql`
        WITH published AS (
          INSERT INTO central_content_overrides(content_id,label,html,revision,updated_at)
          SELECT ${contentId},${label},${html},1,NOW()
          WHERE ${!hasExpected||expected===0}
             OR EXISTS(
               SELECT 1 FROM central_content_overrides
               WHERE content_id=${contentId} AND revision=${expected}
             )
          ON CONFLICT(content_id) DO UPDATE SET
            label=EXCLUDED.label,
            html=EXCLUDED.html,
            revision=central_content_overrides.revision+1,
            updated_at=NOW()
          WHERE ${!hasExpected} OR central_content_overrides.revision=${expected}
          RETURNING content_id,label,html,revision,updated_at
        ), archived AS (
          INSERT INTO central_content_override_history(content_id,revision,label,html,archived_at)
          SELECT content_id,revision,label,html,NOW() FROM published WHERE TRUE
          ON CONFLICT(content_id,revision) DO UPDATE SET
            label=EXCLUDED.label,html=EXCLUDED.html
          RETURNING content_id,revision
        ), marked AS (
          INSERT INTO central_module_review_status(
            module_key,reviewed,reviewed_by,reviewed_by_name,reviewed_at,
            last_edit_by,last_edit_by_name,last_edit_at,last_content_id,last_revision,version,updated_at
          )
          SELECT ${moduleKey},FALSE,NULL,NULL,NULL,${auth.user.id},${auth.user.name},NOW(),
                 content_id,revision,1,NOW() FROM published WHERE ${Boolean(moduleKey)}
          ON CONFLICT(module_key) DO UPDATE SET
            reviewed=FALSE,reviewed_by=NULL,reviewed_by_name=NULL,reviewed_at=NULL,
            last_edit_by=EXCLUDED.last_edit_by,last_edit_by_name=EXCLUDED.last_edit_by_name,
            last_edit_at=NOW(),last_content_id=EXCLUDED.last_content_id,last_revision=EXCLUDED.last_revision,
            version=central_module_review_status.version+1,updated_at=NOW()
          RETURNING module_key
        ), tracked AS (
          INSERT INTO central_module_review_events(
            module_key,content_id,revision,action,actor_id,actor_name
          )
          SELECT ${moduleKey},content_id,revision,'publish',${auth.user.id},${auth.user.name}
          FROM published WHERE ${Boolean(moduleKey)}
          RETURNING event_id
        )
        SELECT published.revision,published.updated_at
        FROM published JOIN archived USING(content_id,revision)
      `;
      if(!rows.length)return send(res,hasExpected?409:500,{error:hasExpected
        ?'Este conteúdo foi alterado em outra sessão. Seu rascunho não foi publicado.'
        :'Não foi possível confirmar o salvamento e o histórico.'});
      return send(res,200,{ok:true,id:contentId,revision:Number(rows[0].revision),updatedAt:rows[0].updated_at});
    }
    if(req.method==='DELETE'){
      if(!id)return send(res,400,{error:'ID do conteúdo não informado'});
      const current=await sql`SELECT revision,label,html FROM central_content_overrides WHERE content_id=${id} LIMIT 1`;
      if(current.length){
        await sql`
          INSERT INTO central_content_override_history(content_id,revision,label,html,archived_at)
          VALUES(${id},${current[0].revision},${current[0].label},${current[0].html},NOW())
          ON CONFLICT(content_id,revision) DO NOTHING
        `;
      }
      const declaredKey=String(req.query?.moduleKey||'').trim();
      const moduleKey=normalizeReviewKey(declaredKey)||keyFromLabel(current[0]?.label||'');
      if(declaredKey&&!normalizeReviewKey(declaredKey))return send(res,400,{error:'Identificador de módulo inválido'});
      await ensureReviewTables(sql);
      await sql`
        WITH removed AS (
          DELETE FROM central_content_overrides WHERE content_id=${id}
          RETURNING content_id,revision
        ), marked AS (
          INSERT INTO central_module_review_status(module_key,reviewed,version,updated_at)
          SELECT ${moduleKey},FALSE,1,NOW() FROM removed WHERE ${Boolean(moduleKey)}
          ON CONFLICT(module_key) DO UPDATE SET
            reviewed=FALSE,reviewed_by=NULL,reviewed_by_name=NULL,reviewed_at=NULL,
            version=central_module_review_status.version+1,updated_at=NOW()
          RETURNING module_key
        ), tracked AS (
          INSERT INTO central_module_review_events(module_key,content_id,revision,action,actor_id,actor_name)
          SELECT ${moduleKey},content_id,revision,'restore',${auth.user.id},${auth.user.name}
          FROM removed WHERE ${Boolean(moduleKey)}
          RETURNING event_id
        )
        SELECT content_id FROM removed
      `;
      return send(res,200,{ok:true,id});
    }
    res.setHeader('Allow','GET, POST, DELETE');
    return send(res,405,{error:'Método não permitido'});
  }catch(error){
    console.error('content editor error',String(error?.code||error?.name||'UNKNOWN').slice(0,32));
    if(Number(error?.statusCode)===413)return send(res,413,{error:'Solicitação acima do limite permitido'});
    return send(res,500,{error:'Falha interna no editor de conteúdo'});
  }
}
