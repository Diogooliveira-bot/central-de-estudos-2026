import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createContactPreferencesHandler} from '../lib/free-signup-contact-preferences.js';
const response=()=>({headers:{},setHeader(k,v){this.headers[k]=v},end(s){this.body=JSON.parse(s)}});
function request(method='GET',action='revokeMarketing',origin='https://localhost'){
 return {method,headers:{host:'localhost',origin,'sec-fetch-site':origin==='https://localhost'?'same-origin':'cross-site'},body:{action}};
}
function mock(){
 const seen=[];
 const sql=async(strings,...values)=>{
  const q=strings.join('?');seen.push({q,values});
  if(q.includes('SELECT marketing_opt_in'))return [{marketing_opt_in:true,has_whatsapp:true}];
  if(q.includes('UPDATE public.central_free_signup_contacts'))return [{user_id:'fictional-owned-user'}];
  throw Error('unexpected SQL');
 };
 const handler=createContactPreferencesHandler({getSession:async()=>({ok:true,user:{id:'fictional-owned-user',role:'aluno'},sql}),readBody:async req=>req.body});
 return {handler,seen};
}
test('GET das preferencias so revela flags; nunca retorna telefone cifrado nem puro',async()=>{
 const {handler,seen}=mock(),res=response();
 await handler(request(),res);
 assert.equal(res.statusCode,200);
 assert.deepEqual(res.body,{marketingOptIn:true,hasWhatsapp:true});
 assert.equal(JSON.stringify(res.body).includes('whatsapp_ciphertext'),false);
 assert.ok(seen[0].q.includes('WHERE user_id='));
 assert.equal(seen[0].values[0],'fictional-owned-user');
});
test('somente o dono da sessão pode retirar marketing',async()=>{
 const {handler,seen}=mock(),res=response();
 await handler(request('POST','revokeMarketing'),res);
 assert.equal(res.statusCode,200);
 assert.equal(res.body.marketingOptIn,false);
 const q=seen.at(-1);
 assert.ok(q.q.includes('UPDATE public.central_free_signup_contacts'));
 assert.ok(q.q.includes('SET marketing_opt_in=FALSE'));
 assert.ok(q.q.includes('WHERE user_id='));
 assert.equal(q.values.at(-1),'fictional-owned-user');
 assert.equal(q.values[0],false);
});
test('exclusão do contato revoga simultaneamente o marketing',async()=>{
 const {handler,seen}=mock(),res=response();
 await handler(request('POST','eraseWhatsapp'),res);
 assert.equal(res.statusCode,200);
 assert.equal(res.body.hasWhatsapp,false);
 assert.equal(seen.at(-1).values[0],true);
 assert.ok(seen.at(-1).q.includes('marketing_consent_at=NULL'));
});
test('não permite acionar opt-in por API de preferências nem origem cruzada',async()=>{
 const {handler,seen}=mock();
 let res=response();await handler(request('POST','enableMarketing'),res);
 assert.equal(res.statusCode,400);assert.equal(seen.length,0);
 res=response();await handler(request('POST','revokeMarketing','https://attacker.invalid'),res);
 assert.equal(res.statusCode,403);assert.equal(seen.length,0);
});
test('preferências exigem sessão',async()=>{
 const handler=createContactPreferencesHandler({getSession:async()=>({ok:false,status:401,error:'Não autenticado'})});
 const res=response();await handler(request(),res);
 assert.equal(res.statusCode,401);
});
test('interface tem botão de revogação e de exclusão separados',()=>{
 const h=readFileSync(new URL('../preferencias-contato.html',import.meta.url),'utf8');
 assert.match(h,/revokeMarketing/);assert.match(h,/eraseWhatsapp/);
 assert.match(h,/credentials:'same-origin'/);
});
