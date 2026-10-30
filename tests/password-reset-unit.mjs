import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import {
  PASSWORD_RESET_TTL_MINUTES,
  emailConfig,
  gmailSmtpOptions,
  newResetToken,
  rateIdentity,
  resetPageBase,
  resetTokenHash,
  sendResetEmail,
  validResetToken,
  confirmReset,
} from '../lib/password-reset.js';
import { hashPassword, verifyPassword } from '../lib/auth.js';

const read=(path)=>readFile(new URL('../'+path,import.meta.url),'utf8');

test('token aleatório com 256 bits, formato URL-safe, hash irreversível',()=>{
 const tokens=Array.from({length:50},newResetToken);
 assert.equal(new Set(tokens).size,tokens.length);
 for(const token of tokens){
  assert.equal(token.length,43);
  assert.equal(validResetToken(token),true);
  assert.match(resetTokenHash(token),/^[a-f0-9]{64}$/);
  assert.notEqual(token,resetTokenHash(token));
 }
 assert.equal(validResetToken('wrong'),false);
 assert.equal(resetTokenHash('wrong'),'');
 assert.equal(PASSWORD_RESET_TTL_MINUTES,30);
});

test('limites HMAC não expõem e-mail e variam por identidade',()=>{
 const key='a'.repeat(48);
 const a=rateIdentity('email','aluno@example.test',key);
 assert.match(a,/^[a-f0-9]{64}$/);
 assert.doesNotMatch(a,/aluno|example/);
 assert.notEqual(a,rateIdentity('ip','aluno@example.test',key));
 assert.notEqual(a,rateIdentity('email','outro@example.test',key));
 assert.throws(()=>rateIdentity('email','a','short'),/Segredo/);
});

test('senha de app Gmail é lida com segurança e SMTP usa TLS na porta 465',()=>{
 assert.equal(emailConfig({}),null);
 assert.equal(emailConfig({RESEND_API_KEY:'re_dummy',PASSWORD_RESET_FROM:'x'}),null);
 assert.equal(emailConfig({GMAIL_USER:'basecompleta.estudos@gmail.com',GMAIL_APP_PASSWORD:'invalid'}),null);
 const config = emailConfig({
  GMAIL_USER:'basecompleta.estudos@gmail.com',
  GMAIL_APP_PASSWORD:'abcd efgh ijkl mnop',
 });
 assert.deepEqual(config,{
  user:'basecompleta.estudos@gmail.com',
  password:'abcdefghijklmnop',
  from:'Base Completa <basecompleta.estudos@gmail.com>',
 });
 const smtp=gmailSmtpOptions(config);
 assert.equal(smtp.host,'smtp.gmail.com');
 assert.equal(smtp.port,465);
 assert.equal(smtp.secure,true);
 assert.equal(smtp.auth.user,config.user);
 assert.equal(smtp.auth.pass,config.password);
 assert.equal(smtp.tls.servername,'smtp.gmail.com');
 assert.throws(()=>resetPageBase({VERCEL_ENV:'production'}),/BC_PUBLIC_APP_URL/);
 assert.equal(resetPageBase({VERCEL_ENV:'production',BC_PUBLIC_APP_URL:'https://central-de-estudos.vercel.app/'}),'https://central-de-estudos.vercel.app');
 assert.equal(resetPageBase({VERCEL_ENV:'production',BC_PUBLIC_APP_URL:'https://central-de-estudos-ecru.vercel.app/'}),'https://central-de-estudos-ecru.vercel.app');
 assert.throws(()=>resetPageBase({VERCEL_ENV:'production',BC_PUBLIC_APP_URL:'https://central-de-estudos-9abgbtvjw-estudotd.vercel.app/'}),/homologação/);
 assert.equal(resetPageBase({VERCEL_ENV:'preview',VERCEL_URL:'my-preview.vercel.app'}),'https://my-preview.vercel.app');
 assert.throws(()=>resetPageBase({VERCEL_ENV:'preview',VERCEL_URL:'untrusted.example.org'}),/seguro/);
});

test('envio SMTP prepara mensagem segura e utiliza transporte mockado',async()=>{
 const calls=[];
 const config={user:'basecompleta.estudos@gmail.com',password:'abcdefghijklmnop',from:'Base Completa <basecompleta.estudos@gmail.com>'};
 const link='https://central-de-estudos-ecru.vercel.app/recuperar-senha.html#token=abc';
 const send=async(message,cfg)=>{calls.push({message,cfg});return 'smtp-message-id-1'};
 const result=await sendResetEmail({to:'aluno@example.test',link,id:'mock-request-1',config,transport:send});
 assert.equal(result,'smtp-message-id-1');
 assert.equal(calls[0].message.to,'aluno@example.test');
 assert.equal(calls[0].message.from,config.from);
 assert.match(calls[0].message.text,/30 minutos/);
 assert.ok(calls[0].message.html.includes(link));
 assert.ok(!JSON.stringify(calls[0].message).includes('SenhaAntigaDoAluno'));
 assert.equal(calls[0].cfg,config);
 await assert.rejects(sendResetEmail({to:'aluno@example.test',link,id:'2',config,transport:async()=>{throw new Error('Falha SMTP simulada')}}),/Falha SMTP simulada/);
});

test('o fluxo usa resgate SQL atômico, invalida sessões e exige role aluno',async()=>{
 const [auth,reset,middleware,sw,page,login]=await Promise.all([
  read('api/auth.js'),read('lib/password-reset.js'),read('middleware.js'),
  read('sw.js'),read('recuperar-senha.html'),read('login.html'),
 ]);
 assert.match(auth,/password-reset-/);
 assert.match(reset,/WITH claimed AS/);
 assert.match(reset,/AND r\.used_at IS NULL/);
 assert.match(reset,/delivery_status='sent'/);
 assert.match(reset,/r\.expires_at>NOW\(\)/);
 assert.match(reset,/session_version=session_version\+1/);
 assert.doesNotMatch(reset,/role='aluno'/);
 assert.equal((reset.match(/role IN \('aluno','editor','admin'\)/g)||[]).length,3);
 assert.match(reset,/central_password_reset_limits/);
 assert.match(reset,/sameOriginRequest\(req\)/);
 assert.match(middleware,/'\/recuperar-senha\.html'/);
 assert.match(sw,/if\(url\.pathname==='\/recuperar-senha\.html'\)return/);
 assert.match(page,/history\.replaceState/);
 assert.match(page,/location\.hash/);
 assert.match(page,/name="viewport"/);
 assert.match(login,/href="\/recuperar-senha\.html"/);
 assert.match(page,/Se houver uma conta ativa/);
 assert.match(reset,/password reset email accepted by SMTP/);
 const scripts=[...page.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)];
 assert.equal(scripts.length,1);
 assert.doesNotThrow(()=>new vm.Script(scripts[0][1]));
});

test('recuperacao de senha: token consumido uma vez; repeticao nao altera senha nem sessao',async()=>{
 const validToken='Z'.repeat(43),password='SenhaForteNova@2026';
 const sqlCalls=[];
 let alreadyUsed=false,updatedPasswords=0;
 const sql=async(strings,...values)=>{
   const query=strings.join('?');
   sqlCalls.push({query,values});
   if(query.includes('WITH claimed AS')){
     assert.match(query,/UPDATE central_password_resets r SET used_at=NOW\(\)/);
     assert.match(query,/r\.used_at IS NULL/);
     assert.match(query,/r\.delivery_status='sent'/);
     assert.match(query,/r\.expires_at>NOW\(\)/);
     assert.match(query,/session_version=session_version\+1/);
     if(alreadyUsed)return [];
     alreadyUsed=true;updatedPasswords++;return [{user_id:'synthetic-user'}];
   }
   if(query.includes('UPDATE central_password_resets SET used_at=NOW()'))return [];
   throw Error('SQL inesperado em teste isolado');
 };
 const deps={sqlProvider:()=>sql,ensureUsers:async()=>{},ensureTables:async()=>{}};
 const response=()=>({headers:{},setHeader(key,val){this.headers[key]=val;},end(value){this.body=JSON.parse(value);}});
 const req={body:{token:validToken,password}};
 const first=response();await confirmReset(req,first,deps);
 assert.equal(first.statusCode,200);
 assert.equal(first.body.ok,true);
 assert.match(first.headers['Set-Cookie'],/Max-Age=0|Expires=/);
 const replay=response();await confirmReset(req,replay,deps);
 assert.equal(replay.statusCode,410);
 assert.equal(replay.body.ok,undefined);
 assert.equal(updatedPasswords,1);
 assert.equal(sqlCalls.filter(x=>x.query.includes('WITH claimed AS')).length,2);
 assert.equal(sqlCalls.filter(x=>x.query.includes('UPDATE central_password_resets SET used_at=NOW()')).length,1);
});

test('recuperacao: token invalido/expirado/nao enviado nunca gera nova sessao nem altera senha',async()=>{
 let attempted=0,changed=0;
 const sql=async(strings,...values)=>{
   const query=strings.join('?');
   attempted++;
   if(query.includes('WITH claimed AS')){changed+=0;return [];}
   throw Error('SQL inesperado');
 };
 const deps={sqlProvider:()=>sql,ensureUsers:async()=>{},ensureTables:async()=>{}};
 const response=()=>({headers:{},setHeader(key,val){this.headers[key]=val;},end(value){this.body=JSON.parse(value);}});
 const malformed=response();await confirmReset({body:{token:'curto',password:'SenhaSegura@2026'}},malformed,deps);
 assert.equal(malformed.statusCode,410);
 assert.equal(attempted,0);
 const expired=response();await confirmReset({body:{token:'X'.repeat(43),password:'SenhaSegura@2026'}},expired,deps);
 assert.equal(expired.statusCode,410);
 assert.equal(attempted,1);
 assert.equal(changed,0);
 assert.equal(expired.headers['Set-Cookie'],undefined);
});

test('a autenticação existente continua aceitando novas senhas',()=>{
 const pass='SenhaNovissima-2026!';
 assert.equal(verifyPassword(pass,hashPassword(pass)),true);
});
