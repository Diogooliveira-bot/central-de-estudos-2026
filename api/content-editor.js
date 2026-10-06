import { neon } from '@neondatabase/serverless';
import { requireSession, safeSecretEqual } from '../lib/auth.js';

function send(res,status,body){
  res.statusCode=status;
  res.setHeader('Content-Type','application/json; charset=utf-8');
  res.setHeader('Cache-Control','no-store');
  res.end(JSON.stringify(body));
}
async function writerAuthorized(req){
  const session=await requireSession(req,['admin','editor']);
  if(session.ok)return session;
  const expected=process.env.BACKUP_SECRET;
  if(expected&&safeSecretEqual(req.headers['x-backup-key'],expected))return {ok:true,legacy:true};
  return {ok:false,status:session.status||401,error:session.error||'Acesso de edição negado'};
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
export default async function handler(req,res){
  try{
    const sql=database();await ensureTable(sql);
    const id=String(req.query?.id||'').trim().slice(0,240);
    if(req.method==='GET'){
      const reader=await requireSession(req,['admin','editor','aluno']);
      if(!reader.ok)return send(res,reader.status,{error:reader.error});
      if(!id)return send(res,400,{error:'ID do conteúdo não informado'});
      const rows=await sql`SELECT content_id,label,html,revision,updated_at FROM central_content_overrides WHERE content_id=${id} LIMIT 1`;
      if(!rows.length)return send(res,200,{exists:false,id});
      const r=rows[0];
      return send(res,200,{exists:true,id:r.content_id,label:r.label||'',html:r.html,revision:Number(r.revision||1),updatedAt:r.updated_at});
    }
    const auth=await writerAuthorized(req);
    if(!auth.ok)return send(res,auth.status,{error:auth.error});
    if(req.method==='POST'){
      const body=await readJsonBody(req);
      const contentId=String(body?.id||'').trim().slice(0,240);
      const label=String(body?.label||'').slice(0,240);
      const html=cleanHtml(body?.html||'');
      if(!contentId||!html)return send(res,400,{error:'Conteúdo definitivo inválido'});
      const bytes=Buffer.byteLength(html,'utf8');
      if(bytes>1_500_000)return send(res,413,{error:'Conteúdo acima de 1,5 MB'});
      const rows=await sql`
        INSERT INTO central_content_overrides(content_id,label,html,revision,updated_at)
        VALUES(${contentId},${label},${html},1,NOW())
        ON CONFLICT(content_id) DO UPDATE SET
          label=EXCLUDED.label,
          html=EXCLUDED.html,
          revision=central_content_overrides.revision+1,
          updated_at=NOW()
        RETURNING revision,updated_at
      `;
      return send(res,200,{ok:true,id:contentId,revision:Number(rows[0].revision),updatedAt:rows[0].updated_at});
    }
    if(req.method==='DELETE'){
      if(!id)return send(res,400,{error:'ID do conteúdo não informado'});
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