import crypto from 'node:crypto';
import {
  createSessionToken,database,hashPassword,publicUser,
  readJsonBody,sameOriginRequest,sessionCookie,validatePassword,
} from './auth.js';
import { hashClaimToken } from './hotmart-webhook.js';

function send(res,status,body,cookie) {
  res.statusCode=status;
  res.setHeader('Content-Type','application/json; charset=utf-8');
  res.setHeader('Cache-Control','private, no-store');
  res.setHeader('Referrer-Policy','no-referrer');
  res.setHeader('X-Content-Type-Options','nosniff');
  if(cookie)res.setHeader('Set-Cookie',cookie);
  res.end(JSON.stringify(body));
}
function validToken(token) {
  return typeof token==='string' && /^[A-Za-z0-9_-]{43}$/.test(token);
}
export function createHotmartClaim({sqlProvider=database}={}) {
  return async(req,res)=>{
    if(req.method!=='POST'){
      res.setHeader('Allow','POST');
      return send(res,405,{error:'Método não permitido'});
    }
    if(!sameOriginRequest(req))return send(res,403,{error:'Origem não permitida'});
    const size=Number(req.headers?.['content-length']||0);
    if(!Number.isFinite(size)||size<0||size>8192)
      return send(res,413,{error:'Solicitação acima do tamanho permitido'});
    try {
      const body=await readJsonBody(req);
      if(Buffer.byteLength(JSON.stringify(body))>8192)
        return send(res,413,{error:'Solicitação acima do tamanho permitido'});
      const token=String(body.token||'');
      const action=String(req.query?.action||'check').toLowerCase();
      if(!validToken(token))return send(res,410,{error:'Link inválido ou expirado'});
      const digest=hashClaimToken(token),sql=sqlProvider();
      if(action==='check'){
        const found=await sql\`
          SELECT 1 FROM public.central_hotmart_orders
          WHERE claim_token_hash=\${digest} AND claim_expires_at>NOW()
            AND state='approved' AND user_id IS NULL AND credit_applied=FALSE
          LIMIT 1
        \`;
        return send(res,200,{valid:found.length>0});
      }
      if(action!=='redeem')return send(res,404,{error:'Ação não encontrada'});
      const name=String(body.name||'').trim().replace(/\s+/g,' ').slice(0,120);
      const password=String(body.password||'');
      if(name.length<3)return send(res,400,{error:'Informe seu nome completo'});
      const problem=validatePassword(password);
      if(problem)return send(res,400,{error:problem});
      const newUserId=crypto.randomUUID(),hashedPassword=hashPassword(password);
      const users=await sql\`
        SELECT * FROM public.central_hotmart_redeem_claim(
          \${digest},\${newUserId},\${name},\${hashedPassword}
        )
      \`;
      if(!users.length)return send(res,410,{error:'Link inválido, expirado ou já utilizado'});
      const user=users[0];
      return send(res,201,{ok:true,user:publicUser(user)},
        sessionCookie(createSessionToken(user)));
    }catch(error){
      if(error?.code==='23505')
        return send(res,409,{error:'Este e-mail já possui conta. Entre com sua senha na Central.'});
      console.error('hotmart claim error',String(error?.code||error?.name||'UNKNOWN').replace(/[^a-z0-9_]/gi,'').slice(0,32));
      return send(res,503,{error:'Não foi possível ativar o acesso agora'});
    }
  };
}
export default createHotmartClaim();
