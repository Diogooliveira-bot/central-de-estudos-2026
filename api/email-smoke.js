// Temporary smoke test; preview-only, fixed recipient, secret-gated.
// Remove immediately after one controlled delivery verification.
import {createHash,timingSafeEqual} from 'node:crypto';
import {resendConfig,sendViaResend} from '../lib/resend-email.js';

export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  res.setHeader('Referrer-Policy','no-referrer');
  res.setHeader('Content-Type','application/json; charset=utf-8');
  if(req.method!=='GET'){res.statusCode=405;return res.end('{"error":"method"}');}
  const env=process.env;
  if(env.VERCEL_ENV!=='preview'||env.VERCEL_GIT_COMMIT_REF!=='feature/resend-email-integration-20261109'){
    res.statusCode=404;return res.end('{"error":"not_found"}');
  }
  const expected=String(env.BC_EMAIL_SMOKE_TOKEN||'');
  const supplied=String(req.query?.token||'');
  if(expected.length<40||supplied.length!==expected.length){
    res.statusCode=403;return res.end('{"error":"forbidden"}');
  }
  const a=createHash('sha256').update(expected).digest();
  const b=createHash('sha256').update(supplied).digest();
  if(!timingSafeEqual(a,b)){res.statusCode=403;return res.end('{"error":"forbidden"}');}
  try{
    const cfg=resendConfig();
    if(!cfg){res.statusCode=503;return res.end('{"error":"config"}');}
    const id=await sendViaResend({
      to:'basecompleta.estudos@gmail.com',
      subject:'Teste de envio — Base Completa',
      text:'Teste de integração do Resend na homologação da Base Completa. Nenhuma conta de aluno foi modificada.'
    },cfg);
    return res.end(JSON.stringify({ok:true,accepted:true,id}));
  }catch(e){
    console.error('email smoke failed',String(e?.code||e?.name||'ERROR').slice(0,40));
    res.statusCode=502;return res.end('{"ok":false,"error":"provider_failed"}');
  }
}
