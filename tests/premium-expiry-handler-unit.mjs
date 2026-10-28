import test from 'node:test';
import assert from 'node:assert/strict';
import {createExpiryReminderHandler} from '../lib/premium-expiry-reminders.js';

const environment={
 VERCEL_ENV:'production',BC_EXPIRY_REMINDERS_ENABLED:'true',
 CRON_SECRET:'only-for-a-synthetic-automated-test-not-real',
 BC_PUBLIC_APP_URL:'https://app.basecompleta.com.br/',
 GMAIL_USER:'test@example.gmail.com'.replace('example.',''),
 GMAIL_APP_PASSWORD:'A'.repeat(16)
};
const due={user_id:'synthetic-user',subscription_id:'synthetic-sub',
 name:'Aluno de teste',email:'aluno@example.invalid',ends_at:'2026-11-04T10:00:00Z',
 kind:'seven_days'};
const response=()=>({setHeader(){},end(body){this.json=JSON.parse(body)}});
const request=(token='Bearer '+environment.CRON_SECRET)=>({method:'GET',headers:{authorization:token}});
function fixture(valid=true,shouldFail=false){
 let idempotency=false;
 const queries=[],emails=[];
 const sql=async(chunks,...values)=>{
   const q=chunks.join('?');queries.push(q);
   if(q.includes('SELECT u.user_id,u.name,u.email'))return [due];
   if(q.includes('INSERT INTO public.central_premium_expiry_notices')){
     if(idempotency)return [];
     idempotency=true;return [{notice_id:'notice-synthetic'}];
   }
   if(q.includes('SELECT 1 FROM public.central_user_subscriptions'))return valid?[{ok:true}]:[];
   if(q.includes('UPDATE public.central_premium_expiry_notices'))return [];
   throw Error('Unexpected SQL statement');
 };
 const handler=createExpiryReminderHandler({env:environment,sqlProvider:()=>sql,
  newId:()=> 'notice-synthetic',sendEmail:async message=>{
    emails.push(message);
    if(shouldFail)throw Object.assign(Error('Synthetic transport failed'),{code:'E_SYNTHETIC'});
    return '<synthetic-message>';
  }});
 return {handler,queries,emails};
}
test('token de cron incorreto nao chega ao banco',async()=>{
 const f=fixture(),r=response();
 await f.handler(request('Bearer invalid'),r);
 assert.equal(r.statusCode,401);assert.equal(f.queries.length,0);
 assert.equal(f.emails.length,0);
});
test('aviso transacional enviado uma vez, sem consultar consentimento comercial',async()=>{
 const f=fixture();
 let r=response();await f.handler(request(),r);
 assert.equal(r.statusCode,200);assert.equal(r.json.sent,1);
 assert.equal(f.emails.length,1);
 assert.match(f.emails[0].subject,/7 dias/);
 assert.match(f.emails[0].text,/renovação não é automática/);
 assert.ok(f.queries.some(q=>q.includes("s.grant_source='hotmart'")));
 assert.ok(f.queries.every(q=>!q.includes('email_marketing_opt_in')));
 r=response();await f.handler(request(),r);
 assert.equal(r.json.sent,0);assert.equal(r.json.duplicates,1);
 assert.equal(f.emails.length,1);
});
test('renovacao concorrente cancela aviso, falha de envio nao gera repeticao',async()=>{
 const changed=fixture(false),a=response();
 await changed.handler(request(),a);
 assert.equal(a.json.skipped,1);assert.equal(changed.emails.length,0);
 const fail=fixture(true,true),b=response();
 await fail.handler(request(),b);
 assert.equal(b.json.failed,1);
 const c=response();await fail.handler(request(),c);
 assert.equal(c.json.duplicates,1);assert.equal(fail.emails.length,1);
});
