// Temporary E2E harness. Preview-only, test recipient fixed, secret-gated.
// Remove after validation; production and public signup are untouched.
import crypto from 'node:crypto';
import {database} from './auth.js';
import {createFreeSignupHandler, FREE_SIGNUP_TERMS_VERSION} from './free-signup-handler.js';
import handlePasswordReset from './password-reset.js';
import {sendTransactionalEmail} from './transactional-email.js';

const TARGET='basecompleta.estudos+resend-e2e-20261110@gmail.com';
const BRANCH='feature/resend-email-integration-20261109';
function respond(res,status,body){
 res.statusCode=status;res.setHeader('Content-Type','application/json; charset=utf-8');
 res.setHeader('Cache-Control','no-store');res.setHeader('Referrer-Policy','no-referrer');
 res.end(JSON.stringify(body));
}
function authorized(req){
 const env=process.env;
 if(env.VERCEL_ENV!=='preview'||env.VERCEL_GIT_COMMIT_REF!==BRANCH||
  env.BC_PREVIEW_NEON_GUARD!=='YES'||env.BC_EMAIL_PROVIDER!=='resend')return false;
 const expected=String(env.BC_EMAIL_E2E_TOKEN||''),supplied=String(req.query?.auth||'');
 if(expected.length<40||expected.length!==supplied.length)return false;
 return crypto.timingSafeEqual(crypto.createHash('sha256').update(expected).digest(),
  crypto.createHash('sha256').update(supplied).digest());
}
function simulatedRequest(req,body){
 const host=String(req.headers?.host||'');
 return {method:'POST',headers:{host,origin:'https://'+host,
  'sec-fetch-site':'same-origin','x-real-ip':'127.0.0.42',
  'x-forwarded-for':'127.0.0.42'},body};
}
function memoryResponse(){
 return {headers:{},statusCode:200,setHeader(k,v){this.headers[k]=v;},
  end(x){try{this.body=JSON.parse(x)}catch{this.body={}}}};
}
function password(suffix){
 return 'E2E@'+crypto.createHash('sha256').update(String(process.env.BC_EMAIL_E2E_TOKEN)+suffix).digest('hex').slice(0,25);
}
async function signup(req){
 let token='',sentId='';
 const env={...process.env,BC_PUBLIC_FREE_SIGNUP_ENABLED:'true',
  BC_FREE_SIGNUP_PREVIEW_ISOLATED:'YES',
  BC_SIGNUP_TURNSTILE_SITE_KEY:'E2eSyntheticSiteKey123',
  BC_SIGNUP_TURNSTILE_SECRET_KEY:'E2eSyntheticSecretKey123'};
 const handler=createFreeSignupHandler({env,sqlProvider:database,
  // Simulated anti-bot verification ONLY in secret-gated test harness.
  botVerifier:async()=>true,
  sendEmail:async(message,config)=>{
   if(message.to!==TARGET)throw new Error('unexpected_recipient');
   token=message.text.match(/#token=([A-Za-z0-9_-]{43})/)?.[1]||'';
   sentId=await sendTransactionalEmail(message,config);
   return sentId;
  }});
 const first=memoryResponse();
 await handler(simulatedRequest(req,{action:'request',
  name:'Aluno de Teste Base Completa',email:TARGET,password:password('signup'),
  ageConfirmed:true,termsAccepted:true,termsVersion:FREE_SIGNUP_TERMS_VERSION,
  marketingOptIn:false,emailMarketingOptIn:false,turnstileToken:'E2E_ONLY'}),first);
 if(first.statusCode!==200||!token||!sentId)throw new Error('signup_request_'+first.statusCode);
 const confirm=memoryResponse();
 await handler(simulatedRequest(req,{action:'confirm',token}),confirm);
 const replay=memoryResponse();
 await handler(simulatedRequest(req,{action:'confirm',token}),replay);
 if(confirm.statusCode!==201||confirm.body?.user?.role!=='aluno'||replay.statusCode!==410)
  throw new Error('signup_confirm_or_replay');
 return {ok:true,signupRequest:200,signupConfirm:201,replay:410,role:'aluno',sentViaResend:true};
}
async function resetRequest(req){
 const r=memoryResponse();
 await handlePasswordReset(simulatedRequest(req,{email:TARGET}),r,'request');
 if(r.statusCode!==200)throw new Error('reset_request_'+r.statusCode);
 return {ok:true,resetRequest:200};
}
async function resetConfirm(req){
 const token=String(req.query?.reset_token||'');
 if(!/^[A-Za-z0-9_-]{43}$/.test(token))throw new Error('test_token_invalid');
 const check=memoryResponse();
 await handlePasswordReset(simulatedRequest(req,{token}),check,'check');
 if(check.body?.valid!==true)throw new Error('reset_invalid_before');
 const confirm=memoryResponse();
 await handlePasswordReset(simulatedRequest(req,{token,password:password('reset')}),confirm,'confirm');
 const replay=memoryResponse();
 await handlePasswordReset(simulatedRequest(req,{token,password:password('reset')}),replay,'confirm');
 const again=memoryResponse();
 await handlePasswordReset(simulatedRequest(req,{token}),again,'check');
 if(confirm.statusCode!==200||replay.statusCode!==410||again.body?.valid!==false)
  throw new Error('reset_confirm_or_replay');
 return {ok:true,resetCheckBefore:true,resetConfirm:200,replay:410,resetCheckAfter:false};
}
export default async function emailE2e(req,res){
 if(req.method!=='GET'||!authorized(req))return respond(res,404,{error:'not_found'});
 try{
  const step=String(req.query?.step||'');
  const result=step==='signup'?await signup(req):step==='reset-request'?await resetRequest(req)
   :step==='reset-confirm'?await resetConfirm(req):null;
  return respond(res,result?200:400,result||{error:'invalid_step'});
 }catch(error){
  const code=String(error?.message||'ERROR').replace(/[^A-Za-z0-9_]/g,'').slice(0,60);
  console.error('resend e2e failed',code);
  return respond(res,503,{ok:false,step:String(req.query?.step||''),code});
 }
}
