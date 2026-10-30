// Protecao de cadastro publico: sem dependencia de servicos externos em testes isolados.
export const SIGNUP_MAX_BODY_BYTES=12*1024;
// Official Cloudflare testing credentials bypass real bot screening.
// They are valid ONLY outside Production; prevent accidental public launch.
const TURNSTILE_TEST_SITE_KEYS=new Set([
 '1x00000000000000000000AA', '2x00000000000000000000AB',
 '1x00000000000000000000BB', '2x00000000000000000000BB',
 '3x00000000000000000000FF',
]);
const TURNSTILE_TEST_SECRET_KEYS=new Set([
 '1x0000000000000000000000000000000AA',
 '2x0000000000000000000000000000000AA',
 '3x0000000000000000000000000000000AA',
]);
export function signupCaptchaConfigured(env=process.env){
 const site=String(env.BC_SIGNUP_TURNSTILE_SITE_KEY||'');
 const secret=String(env.BC_SIGNUP_TURNSTILE_SECRET_KEY||'');
 if(env.VERCEL_ENV==='production' &&
    (TURNSTILE_TEST_SITE_KEYS.has(site)||TURNSTILE_TEST_SECRET_KEYS.has(secret)))return false;
 return /^[A-Za-z0-9_-]{10,100}$/.test(site) && secret.length>=16 && secret.length<=512;
}
export function signupCaptchaPartial(env=process.env){
 return Boolean(env.BC_SIGNUP_TURNSTILE_SITE_KEY) !== Boolean(env.BC_SIGNUP_TURNSTILE_SECRET_KEY);
}
export async function safeSignupBody(req){
 const known=Number(req.headers?.['content-length']||0);
 if(known>SIGNUP_MAX_BODY_BYTES)throw Object.assign(Error('Solicitacao grande demais'),{httpStatus:413});
 if(req.body&&typeof req.body==='object'){
  if(Buffer.byteLength(JSON.stringify(req.body))>SIGNUP_MAX_BODY_BYTES)
   throw Object.assign(Error('Solicitacao grande demais'),{httpStatus:413});
  return req.body;
 }
 if(typeof req.body==='string'){
  if(Buffer.byteLength(req.body)>SIGNUP_MAX_BODY_BYTES)
   throw Object.assign(Error('Solicitacao grande demais'),{httpStatus:413});
  return JSON.parse(req.body||'{}');
 }
 const chunks=[];let n=0;
 for await(const chunk of req){
  n+=chunk.length;
  if(n>SIGNUP_MAX_BODY_BYTES)throw Object.assign(Error('Solicitacao grande demais'),{httpStatus:413});
  chunks.push(chunk);
 }
 return JSON.parse(Buffer.concat(chunks).toString('utf8')||'{}');
}
export function verifiedClientIp(req){
 // Vercel sobrescreve X-Forwarded-For e disponibiliza o mesmo IP como
 // X-Vercel-Forwarded-For. Header isolado fora da Vercel nao e confiavel;
 // em Production exigir sinal de ambiente Vercel e IP valido.
 const v=String(req.headers?.['x-vercel-forwarded-for']||req.headers?.['x-forwarded-for']||'');
 const ip=v.split(',')[0].trim();
 if(ip.length<3||ip.length>65||!/^[0-9a-fA-F.:]+$/.test(ip))return '';
 return ip;
}
export async function verifySignupBot({token,requestHost,env=process.env,fetcher=fetch}){
 if(!signupCaptchaConfigured(env))return false;
 if(typeof token!=='string'||token.length<1||token.length>2048)return false;
 const secret=String(env.BC_SIGNUP_TURNSTILE_SECRET_KEY);
 const body=new URLSearchParams({secret,response:token});
 try{
  const response=await fetcher('https://challenges.cloudflare.com/turnstile/v0/siteverify',{
   method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},
   body,signal:AbortSignal.timeout(5000)
  });
  if(!response?.ok)return false;
  const data=await response.json();
  const host=String(requestHost||'').split(':')[0].toLowerCase();
  return data.success===true && data.action==='free-signup' && !!host
   && String(data.hostname||'').toLowerCase()===host;
 }catch(_){return false}
}
