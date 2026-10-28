import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createContactPreferencesHandler} from '../lib/free-signup-contact-preferences.js';
import {EMAIL_MARKETING_NOTICE_VERSION} from '../lib/free-signup-contact.js';

const response=()=>({headers:{},setHeader(k,v){this.headers[k]=v},end(s){this.body=JSON.parse(s)}});
function request(method='GET',action='revokeMarketing',origin='https://localhost',extra={}){
 return {method,headers:{host:'localhost',origin,'sec-fetch-site':origin==='https://localhost'?'same-origin':'cross-site'},body:{action,...extra}};
}
function mock(row={marketing_opt_in:true,has_whatsapp:true,email_marketing_opt_in:false}){
 const seen=[];
 const sql=async(strings,...values)=>{
  const q=strings.join('?');seen.push({q,values});
  if(q.includes('SELECT marketing_opt_in'))return [row];
  if(q.includes('UPDATE public.central_free_signup_contacts'))return [{user_id:'fictional-owned-user'}];
  if(q.includes('INSERT INTO public.central_free_signup_contacts'))return [];
  throw Error('unexpected SQL');
 };
 const handler=createContactPreferencesHandler({getSession:async()=>({ok:true,user:{id:'fictional-owned-user',role:'aluno'},sql}),readBody:async req=>req.body});
 return {handler,seen};
}
test('GET retorna consentimentos independentes sem expor telefone ou endereco',async()=>{
 const {handler,seen}=mock(),res=response();
 await handler(request(),res);
 assert.equal(res.statusCode,200);
 assert.deepEqual(res.body,{marketingOptIn:true,hasWhatsapp:true,emailMarketingOptIn:false,
   emailNoticeVersion:EMAIL_MARKETING_NOTICE_VERSION});
 assert.equal(JSON.stringify(res.body).includes('whatsapp_ciphertext'),false);
 assert.ok(seen[0].q.includes('WHERE user_id='));
 assert.equal(seen[0].values[0],'fictional-owned-user');
});
test('revogar WhatsApp nao altera consentimento de email',async()=>{
 const {handler,seen}=mock(),res=response();
 await handler(request('POST','revokeMarketing'),res);
 assert.equal(res.statusCode,200);
 assert.equal(res.body.marketingOptIn,false);
 const q=seen.at(-1);
 assert.ok(q.q.includes('SET marketing_opt_in=FALSE'));
 assert.ok(q.q.includes('WHERE user_id='));
 assert.equal(q.values.at(-1),'fictional-owned-user');
 assert.equal(q.values[0],false);
 assert.doesNotMatch(q.q,/email_marketing_opt_in/);
});
test('excluir WhatsApp nao altera consentimento de email',async()=>{
 const {handler,seen}=mock(),res=response();
 await handler(request('POST','eraseWhatsapp'),res);
 assert.equal(res.statusCode,200);
 assert.equal(res.body.hasWhatsapp,false);
 assert.equal(seen.at(-1).values[0],true);
 assert.match(seen.at(-1).q,/marketing_consent_at=NULL/);
 assert.doesNotMatch(seen.at(-1).q,/email_marketing_opt_in/);
});
test('ativacao de email exige escolha afirmativa e aviso na versao vigente',async()=>{
 const {handler,seen}=mock();
 for(const body of [{},{emailMarketingOptIn:false,emailNoticeVersion:EMAIL_MARKETING_NOTICE_VERSION},
   {emailMarketingOptIn:'true',emailNoticeVersion:EMAIL_MARKETING_NOTICE_VERSION},
   {emailMarketingOptIn:true,emailNoticeVersion:'old'}]){
  const res=response();
  await handler(request('POST','enableEmailMarketing','https://localhost',body),res);
  assert.equal(res.statusCode,400);
 }
 assert.equal(seen.length,0);
 const res=response();
 await handler(request('POST','enableEmailMarketing','https://localhost',
   {emailMarketingOptIn:true,emailNoticeVersion:EMAIL_MARKETING_NOTICE_VERSION}),res);
 assert.equal(res.statusCode,200);
 assert.equal(res.body.emailMarketingOptIn,true);
 const q=seen.at(-1);
 assert.match(q.q,/INSERT INTO public.central_free_signup_contacts/);
 assert.match(q.q,/ON CONFLICT \(user_id\) DO UPDATE SET/);
 assert.match(q.q,/email_marketing_opt_in=TRUE/);
 assert.doesNotMatch(q.q,/SET marketing_opt_in=TRUE/);
 assert.equal(q.values[0],'fictional-owned-user');
 assert.equal(q.values[1],EMAIL_MARKETING_NOTICE_VERSION);
});
test('revogar email mantem whatsapp e registra revogacao',async()=>{
 const {handler,seen}=mock(),res=response();
 await handler(request('POST','revokeEmailMarketing'),res);
 assert.equal(res.statusCode,200);
 assert.equal(res.body.emailMarketingOptIn,false);
 assert.match(seen.at(-1).q,/email_marketing_opt_in=FALSE/);
 assert.match(seen.at(-1).q,/email_marketing_revoked_at=CASE/);
 assert.doesNotMatch(seen.at(-1).q,/marketing_opt_in=FALSE/);
 assert.equal(seen.at(-1).values[0],'fictional-owned-user');
});
test('nao permite acionar WhatsApp nem email sem consentimento valido, ou fora da origem',async()=>{
 const {handler,seen}=mock();
 let res=response();await handler(request('POST','enableMarketing'),res);
 assert.equal(res.statusCode,400);assert.equal(seen.length,0);
 res=response();await handler(request('POST','enableEmailMarketing','https://attacker.invalid',
   {emailMarketingOptIn:true,emailNoticeVersion:EMAIL_MARKETING_NOTICE_VERSION}),res);
 assert.equal(res.statusCode,403);assert.equal(seen.length,0);
});
test('preferencias exigem sessao para GET ou POST',async()=>{
 const handler=createContactPreferencesHandler({getSession:async()=>({ok:false,status:401,error:'Não autenticado'})});
 for(const method of ['GET','POST']){
  const res=response();await handler(request(method),res);
  assert.equal(res.statusCode,401);
 }
});
test('interface separa autorização e revogacao de email e whatsapp',()=>{
 const h=readFileSync(new URL('../preferencias-contato.html',import.meta.url),'utf8');
 assert.match(h,/enableEmailMarketing/);assert.match(h,/revokeEmailMarketing/);
 assert.match(h,/id="emailOptInConfirmation"/);assert.match(h,/emailNoticeVersion/);
 assert.match(h,/revokeMarketing/);assert.match(h,/eraseWhatsapp/);
 assert.match(h,/credentials:'same-origin'/);
});
