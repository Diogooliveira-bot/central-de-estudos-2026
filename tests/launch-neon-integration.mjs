// Opt-in integration test: real isolated Neon, captured (unsent) emails.
// Never run against Production. All fixtures are synthetic and unique.
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {neon} from '@neondatabase/serverless';
import {createFreeSignupHandler,FREE_SIGNUP_TERMS_VERSION} from '../lib/free-signup-handler.js';
import {createContactPreferencesHandler} from '../lib/free-signup-contact-preferences.js';
import {createHotmartWebhook} from '../lib/hotmart-webhook.js';
import {getEffectivePlan,getPlanEntitlements} from '../lib/plan-access.js';
import {requireSession} from '../lib/auth.js';
import syncHandler from '../api/sync.js';

const EXPECTED_BRANCH='br-sweet-waterfall-b7ry8jlw';
assert.equal(process.env.BC_TEST_ISOLATION_APPROVED,'YES','Explicit opt-in required');
assert.ok(process.env.DATABASE_URL,'Provide TEST DATABASE_URL securely');
const sql=neon(process.env.DATABASE_URL);
const [identity]=await sql`SELECT current_setting('neon.branch_id',true) AS branch_id`;
assert.equal(identity.branch_id,EXPECTED_BRANCH,'Refusing all writes outside the named TEST branch');
const uid='launch-neon-'+crypto.randomUUID(),email=uid+'@example.invalid';
const secret=crypto.randomBytes(48).toString('hex');
process.env.AUTH_SECRET=secret;
const env={VERCEL_ENV:'preview',VERCEL_URL:'synthetic-launch.vercel.app',
 BC_PUBLIC_FREE_SIGNUP_ENABLED:'true',BC_FREE_SIGNUP_PREVIEW_ISOLATED:'YES',
 AUTH_SECRET:secret,BC_SIGNUP_PII_KEY:crypto.randomBytes(32).toString('hex'),
 GMAIL_USER:'synthetic.capture@gmail.com',GMAIL_APP_PASSWORD:'A'.repeat(16),
 HOTMART_TEST_RECEIVER_ENABLED:'true',HOTMART_LIVE_ENABLED:'false',
 HOTMART_PRODUCT_ID:'8805543',HOTMART_OFFER_6M_CODE:'SYNTHETIC6M',
 HOTMART_OFFER_12M_CODE:'SYNTHETIC12M',HOTMART_HOTTOK:crypto.randomBytes(32).toString('hex')};
const messages=[];
const signup=createFreeSignupHandler({env,sqlProvider:()=>sql,sendEmail:async m=>{messages.push(m);return 'captured-unsent'}});
function req(body,extra={}){return {method:body?'POST':'GET',query:{},headers:{host:env.VERCEL_URL,origin:'https://'+env.VERCEL_URL,'x-real-ip':'192.0.2.45','content-type':'application/json',...extra},body};}
function res(){return {headers:{},setHeader(k,v){this.headers[k]=v},end(v){this.body=JSON.parse(v)}};}
async function call(handler,request){const response=res();await handler(request,response);return response;}
let userId;
try{
 const body={action:'request',name:'Pessoa Ficticia Neon',email,password:crypto.randomBytes(24).toString('base64url'),whatsapp:'',ageConfirmed:true,termsAccepted:true,termsVersion:FREE_SIGNUP_TERMS_VERSION,emailMarketingOptIn:true,marketingOptIn:false};
 assert.equal((await call(signup,req({...body,ageConfirmed:false}))).statusCode,400);
 assert.equal((await call(signup,req({...body,termsAccepted:false}))).statusCode,400);
 const requested=await call(signup,req(body));assert.equal(requested.statusCode,200,JSON.stringify(requested.body));
 assert.equal(messages.length,1);
 assert.equal((await sql`SELECT 1 FROM public.central_users WHERE email=${email}`).length,0);
 const token=messages[0].text.match(/#token=([A-Za-z0-9_-]{43})/)[1];
 const confirmed=await call(signup,req({action:'confirm',token}));assert.equal(confirmed.statusCode,201,JSON.stringify(confirmed.body));userId=confirmed.body.user.id;
 const cookie=confirmed.headers['Set-Cookie'].split(';')[0];
 assert.equal((await call(signup,req({action:'confirm',token}))).statusCode,410);
 assert.equal((await requireSession(req(null,{cookie}))).ok,true);
 assert.equal((await getEffectivePlan(sql,userId)).plan,'free');
 const entitlements=await getPlanEntitlements(sql,'free');
 assert.equal(entitlements['tec.links'].enabled,false);assert.equal(entitlements['qc.links'].enabled,false);assert.equal(entitlements.lei_em_dia.dailyLimit,20);
 const [contact]=await sql`SELECT marketing_opt_in,email_marketing_opt_in,whatsapp_ciphertext FROM public.central_free_signup_contacts WHERE user_id=${userId}`;
 assert.equal(contact.whatsapp_ciphertext,null);assert.equal(contact.marketing_opt_in,false);assert.equal(contact.email_marketing_opt_in,true);
 assert.equal((await sql`SELECT 1 FROM public.central_free_signup_legal_acceptances WHERE user_id=${userId} AND terms_version=${FREE_SIGNUP_TERMS_VERSION}`).length,1);
 const prefs=createContactPreferencesHandler();
 assert.equal((await call(prefs,req({action:'revokeEmailMarketing'},{cookie}))).statusCode,200);
 const [revoked]=await sql`SELECT email_marketing_opt_in,email_marketing_revoked_at,marketing_opt_in FROM public.central_free_signup_contacts WHERE user_id=${userId}`;
 assert.equal(revoked.email_marketing_opt_in,false);assert.ok(revoked.email_marketing_revoked_at);assert.equal(revoked.marketing_opt_in,false);
 console.log('PASS: real Neon signup, legal records, optional WhatsApp, single-use token, real session, free plan, independent consent revocation; email captured and NOT sent');
 const claims=await Promise.all(Array.from({length:21},(_,i)=>sql`SELECT * FROM public.central_claim_lei_em_dia_question(${userId},${'synthetic-'+i})`));
 assert.equal(claims.filter(x=>x[0].allowed).length,20);assert.equal(claims.filter(x=>!x[0].allowed).length,1);
 console.log('PASS: real Neon concurrent quota: 20 allowed, request 21 blocked');
 const webhook=createHotmartWebhook({env,sqlProvider:()=>sql,sendWelcome:async()=>{throw Error('Existing user must not receive activation email')}});
 const transaction='SYNTH-'+crypto.randomUUID();
 function event(kind='PURCHASE_APPROVED',tx=transaction,offer='SYNTHETIC6M'){
  return {version:'2.0.0',id:'SYNTH-EVT-'+crypto.randomUUID(),event:kind,creation_date:Date.now(),data:{product:{id:8805543},buyer:{email,name:'Pessoa Ficticia Neon'},purchase:{transaction:tx,offer:{code:offer},status:({PURCHASE_APPROVED:'APPROVED',PURCHASE_REFUNDED:'REFUNDED',PURCHASE_CHARGEBACK:'CHARGEBACK',PURCHASE_EXPIRED:'EXPIRED'})[kind],price:{currency_value:'BRL'}}}};
 }
 async function dispatch(body,token=env.HOTMART_HOTTOK){return call(webhook,req(body,{'x-hotmart-hottok':token}));}
 assert.equal((await dispatch(event(),'incorrect')).statusCode,401);
 const recurring=event();recurring.data.subscription={id:'synthetic'};assert.equal((await dispatch(recurring)).statusCode,422);
 const approval=event();assert.equal((await dispatch(approval)).statusCode,200);
 const plan=await getEffectivePlan(sql,userId);assert.equal(plan.plan,'premium');
 assert.equal((await dispatch(approval)).statusCode,200);assert.equal(new Date((await getEffectivePlan(sql,userId)).endsAt).getTime(),new Date(plan.endsAt).getTime());
 const sync=await call(syncHandler,req({baseRevision:0,deviceId:'synthetic-device',hash:'synthetic-hash',payload:{'launch:progress':{module:'cpc-m05',percent:45}}},{cookie}));assert.equal(sync.statusCode,200,JSON.stringify(sync.body));
 const read=await call(syncHandler,req(null,{cookie}));assert.equal(read.body.payload['launch:progress'].percent,45);
 const renewal=event('PURCHASE_APPROVED','SYNTH-'+crypto.randomUUID(),'SYNTHETIC12M');assert.equal((await dispatch(renewal)).statusCode,200);
 const renewed=await getEffectivePlan(sql,userId);assert.ok(new Date(renewed.endsAt)>new Date(plan.endsAt));
 assert.equal((await dispatch(renewal)).statusCode,200);assert.equal(new Date((await getEffectivePlan(sql,userId)).endsAt).getTime(),new Date(renewed.endsAt).getTime());
 console.log('PASS: real Neon authenticated webhook handler, recurrence blocked, Premium activation, idempotence, manual renewal, stored progress');
 for(const purchase of [approval,renewal]){
  const refund=structuredClone(purchase);refund.id='SYNTH-EVT-'+crypto.randomUUID();refund.event='PURCHASE_REFUNDED';refund.data.purchase.status='REFUNDED';assert.equal((await dispatch(refund)).statusCode,200);
 }
 assert.equal((await getEffectivePlan(sql,userId)).plan,'free');
 assert.equal((await call(syncHandler,req(null,{cookie}))).statusCode,403);
 const [preserved]=await sql`SELECT payload FROM public.central_user_sync_state WHERE user_id=${userId}`;assert.equal(preserved.payload['launch:progress'].percent,45);
 assert.equal((await dispatch(approval)).body.state,'ignored_after_reversal');
 for(const kind of ['PURCHASE_CHARGEBACK','PURCHASE_EXPIRED']){
  const purchase=event('PURCHASE_APPROVED','SYNTH-'+crypto.randomUUID());assert.equal((await dispatch(purchase)).statusCode,200);assert.equal((await getEffectivePlan(sql,userId)).plan,'premium');
  const reversal=event(kind,purchase.data.purchase.transaction);assert.equal((await dispatch(reversal)).statusCode,200);assert.equal((await getEffectivePlan(sql,userId)).plan,'free');
 }
 console.log('PASS: real Neon refund, chargeback and expiry return to Free; progress preserved; reversed approval cannot restore Premium');
 console.log('PASS: integrated handler + real TEST database checks completed; no deployed UI, Turnstile or external SMTP validation is implied');
}finally{
 if(userId)await sql`UPDATE public.central_users SET active=FALSE,session_version=session_version+1,updated_at=NOW() WHERE user_id=${userId} AND email=${email}`;
}
