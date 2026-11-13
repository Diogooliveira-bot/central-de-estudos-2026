import { neon } from '@neondatabase/serverless';
import { requireSession, sameOriginRequest } from '../lib/auth.js';
import { requirePlanFeature } from '../lib/plan-access.js';
import { handleContentImage } from '../lib/content-image-handler.js';
import { contentEditorReadFeature } from '../lib/content-editor-access.js';

function send(res,status,body){
  res.statusCode=status;
  res.setHeader('Content-Type','application/json; charset=utf-8');
  res.setHeader('Cache-Control','no-store');
  res.end(JSON.stringify(body));
}
function database(){
  if(!process.env.DATABASE_URL)throw new Error('DATABASE_URL não configurado no Vercel');
  return neon(process.env.DATABASE_URL);
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
async function readJsonBody(req){
  if(req.body&&typeof req.body==='object')return req.body;
  if(typeof req.body==='string')return JSON.parse(req.body||'{}');
  const chunks=[];for await(const chunk of req)chunks.push(chunk);
  const raw=Buffer.concat(chunks).toString('utf8');
  return raw?JSON.parse(raw):{};
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
      const rows=await sql`SELECT content_id,label,html,revision,updated_at FROM central_content_overrides WHERE content_id=${id} LIMIT 1`;
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
      let rows;
      if(hasExpected){
        rows=await sql`
          INSERT INTO central_content_overrides(content_id,label,html,revision,updated_at)
          VALUES(${contentId},${label},${html},1,NOW())
          ON CONFLICT(content_id) DO UPDATE SET
            label=EXCLUDED.label,
            html=EXCLUDED.html,
            revision=central_content_overrides.revision+1,
            updated_at=NOW()
          WHERE central_content_overrides.revision=${expected}
          RETURNING revision,updated_at
        `;
        if(!rows.length)return send(res,409,{error:'Este conteúdo foi alterado em outra sessão. Seu rascunho não foi publicado.'});
      }else{
        rows=await sql`
          INSERT INTO central_content_overrides(content_id,label,html,revision,updated_at)
          VALUES(${contentId},${label},${html},1,NOW())
          ON CONFLICT(content_id) DO UPDATE SET
            label=EXCLUDED.label,
            html=EXCLUDED.html,
            revision=central_content_overrides.revision+1,
            updated_at=NOW()
          RETURNING revision,updated_at
        `;
      }
      // Each published revision can be restored in a later controlled publication.
      try{
        await sql`
          INSERT INTO central_content_override_history(content_id,revision,label,html,archived_at)
          VALUES(${contentId},${rows[0].revision},${label},${html},NOW())
          ON CONFLICT(content_id,revision) DO NOTHING
        `;
      }catch(historyError){console.error('content editor history error',historyError)}
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
      await sql`DELETE FROM central_content_overrides WHERE content_id=${id}`;
      return send(res,200,{ok:true,id});
    }
    res.setHeader('Allow','GET, POST, DELETE');
    return send(res,405,{error:'Método não permitido'});
  }catch(error){
    console.error('content editor error',error);
    return send(res,500,{error:error?.message||'Falha interna no editor de conteúdo'});
  }
}
