import { requireSession } from '../lib/auth.js';
import { normalizeAdminInfographicPath } from '../lib/admin-infographics.js';

function noStore(res){
  res.setHeader('Cache-Control','private, no-store, max-age=0');
  res.setHeader('Vercel-CDN-Cache-Control','private, no-store');
  res.setHeader('Vary','Cookie');
  res.setHeader('X-Content-Type-Options','nosniff');
}
function asBuffer(value){
  if(Buffer.isBuffer(value))return value;
  if(value instanceof Uint8Array)return Buffer.from(value);
  if(value instanceof ArrayBuffer)return Buffer.from(new Uint8Array(value));
  if(typeof value==='string'&&value.startsWith('\\x'))return Buffer.from(value.slice(2),'hex');
  if(typeof value==='string')return Buffer.from(value,'base64');
  return Buffer.from([]);
}
export function createAdminInfographicHandler({
  authorize=async req=>requireSession(req,['admin']),
  readAsset=async(sql,key)=>sql`SELECT content_type,content,byte_length FROM public.central_private_infographics WHERE path=${key} LIMIT 1`,
}={}){
  return async function handler(req,res){
    noStore(res);
    if(!['GET','HEAD'].includes(String(req.method||'GET').toUpperCase())){
      res.setHeader('Allow','GET, HEAD');
      res.statusCode=405;
      return res.end(JSON.stringify({error:'Método não permitido'}));
    }
    try{
      const auth=await authorize(req);
      if(!auth?.ok){
        res.statusCode=auth?.status||401;
        res.setHeader('Content-Type','application/json; charset=utf-8');
        return res.end(JSON.stringify({error:auth?.error||'Acesso negado'}));
      }
      const raw=req.query?.path;
      const key=typeof raw==='string'?normalizeAdminInfographicPath(raw):null;
      if(!key){
        res.statusCode=404;
        return res.end('Não encontrado');
      }
      const rows=await readAsset(auth.sql,key);
      const asset=rows?.[0];
      if(!asset){
        res.statusCode=404;
        return res.end('Não encontrado');
      }
      const allowedTypes=new Set(['image/avif','image/webp','image/svg+xml','application/javascript']);
      if(!allowedTypes.has(String(asset.content_type||''))){
        res.statusCode=415;
        return res.end('Tipo de arquivo não permitido');
      }
      const body=asBuffer(asset.content);
      const length=Number(asset.byte_length);
      if(!Number.isSafeInteger(length)||length<0||body.length!==length){
        res.statusCode=500;
        return res.end('Falha ao carregar o arquivo');
      }
      res.statusCode=200;
      res.setHeader('Content-Type',asset.content_type);
      res.setHeader('Content-Length',String(length));
      res.setHeader('Content-Disposition','inline');
      return res.end(String(req.method).toUpperCase()==='HEAD'?undefined:body);
    }catch(_){
      res.statusCode=500;
      res.setHeader('Content-Type','application/json; charset=utf-8');
      return res.end(JSON.stringify({error:'Não foi possível carregar o infográfico'}));
    }
  };
}
export default createAdminInfographicHandler();
