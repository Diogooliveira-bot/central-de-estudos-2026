import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import nodemailer from 'nodemailer';
import { createFreeSignupHandler } from '../lib/free-signup-handler.js';
import { sendResetEmail,emailConfig } from '../lib/password-reset.js';

const env={
 VERCEL_ENV:'preview',VERCEL_URL:'preview-free-45.vercel.app',
 BC_PUBLIC_FREE_SIGNUP_ENABLED:'true',BC_FREE_SIGNUP_PREVIEW_ISOLATED:'YES',
 AUTH_SECRET:'homologacao-exclusiva-local-mailpit-sem-segredos-reais',
 GMAIL_USER:'fake.homologacao@gmail.com',GMAIL_APP_PASSWORD:'AAAAAAAAAAAAAAAA'
};
process.env.AUTH_SECRET=env.AUTH_SECRET;
const pending=new Map(),users=new Map(),assigned=new Map(),calls=[];
const sql=async(chunks,...values)=>{
 const q=chunks.join('?');calls.push(q);
 if(q.includes('central_free_signup_limits'))return [{identity_hash:'fictional'}];
 if(q.includes('SELECT 1 FROM public.central_users'))return users.has(values[0])?[{exists:1}]:[];
 if(q.includes('INSERT INTO public.central_free_signup_pending')){
   const [tokenHash,email,name,passwordHash]=values;
   pending.set(tokenHash,{email,name,passwordHash});return [];
 }
 if(q.includes('WITH claimed AS')){
   const [digest,id,subId]=values;
   const row=pending.get(digest);if(!row||users.has(row.email))return [];
   pending.delete(digest);
   const user={user_id:id,name:row.name,email:row.email,role:'aluno',active:true,
      session_version:1,created_at:new Date().toISOString()};
   users.set(row.email,user);assigned.set(id,{subscription_id:subId,plan_code:'free'});
   return [user];
 }
 throw Error('SQL de teste inesperado: '+q.slice(0,90));
};
const transport=nodemailer.createTransport({
 host:'127.0.0.1',port:1025,secure:false,ignoreTLS:true,
 connectionTimeout:3000,socketTimeout:3000
});
function response(){return{headers:{},setHeader(k,v){this.headers[k]=v},end(b){this.body=JSON.parse(b)}}}
function request(body){return{method:'POST',headers:{host:'localhost',origin:'http://localhost',
 'x-real-ip':'127.0.0.45','sec-fetch-site':'same-origin'},body}}
try{
 const handler=createFreeSignupHandler({env,sqlProvider:()=>sql,sendEmail:async(message)=>{
   const info=await transport.sendMail(message);
   assert.ok(info.accepted?.length===1,'SMTP nao confirmou recebimento');
   return info.messageId;
 }});
 const register=response();
 await handler(request({action:'request',name:'Aluno Ficticio Mailpit',
   email:'mailpit@example.invalid',password:'SenhaFicticiaSegura123!'}),register);
 assert.equal(register.statusCode,200,JSON.stringify(register.body));
 assert.equal(users.size,0,'Conta criada antes de confirmar!');
 let textMessage;
 for(let i=0;i<20;i++){
   const r=await fetch('http://127.0.0.1:8025/view/latest.txt');
   if(r.ok){textMessage=await r.text();break}
   await new Promise(resolve=>setTimeout(resolve,150));
 }
 assert.ok(textMessage,'Email nao apareceu no Mailpit');
 const token=textMessage.match(/#token=([A-Za-z0-9_-]{43})/)?.[1];
 assert.ok(token,'Link de confirmacao nao chegou completo no Mailpit');
 assert.equal(pending.size,1);
 const confirmed=response();
 await handler(request({action:'confirm',token}),confirmed);
 assert.equal(confirmed.statusCode,201);
 assert.equal(confirmed.body.user.role,'aluno');
 assert.equal(users.size,1);
 assert.equal(assigned.get(confirmed.body.user.id)?.plan_code,'free');
 assert.match(confirmed.headers['Set-Cookie'],/HttpOnly; Secure; SameSite=Lax/);
 const reused=response();
 await handler(request({action:'confirm',token}),reused);
 assert.equal(reused.statusCode,410);
 assert.equal(assigned.size,1);

 const resetLink='https://preview-free-45.vercel.app/recuperar-senha.html#token='+'R'.repeat(43);
 await sendResetEmail({
  to:'mailpit-reset@example.invalid',link:resetLink,id:crypto.randomUUID(),
  config:emailConfig(env),transport:async(message)=>{
    const result=await transport.sendMail(message);
    assert.equal(result.accepted.length,1);
    return result.messageId;
  },
 });
 const recoveryMessage=await (await fetch('http://127.0.0.1:8025/view/latest.txt')).text();
 assert.ok(recoveryMessage.includes(resetLink),'Email de recuperacao nao chegou ao Mailpit');
 console.log('PASS: SMTP Mailpit recebeu email de recuperacao de senha em endereco ficticio');

 console.log('PASS: SMTP REAL local no Mailpit, mensagem recebida, token confirmado, plano free, token reusado bloqueado');
} finally{transport.close()}
