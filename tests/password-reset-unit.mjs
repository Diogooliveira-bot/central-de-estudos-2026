import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import {
  PASSWORD_RESET_TTL_MINUTES,
  emailConfig,
  newResetToken,
  rateIdentity,
  resetPageBase,
  resetTokenHash,
  sendResetEmail,
  validResetToken,
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

test('configuração do provedor e URL confiável não são aceitas sem ambiente seguro',()=>{
 assert.equal(emailConfig({}),null);
 assert.equal(emailConfig({RESEND_API_KEY:'re_dummy',PASSWORD_RESET_FROM:'x'}),null);
 assert.deepEqual(emailConfig({RESEND_API_KEY:'re_test',PASSWORD_RESET_FROM:'Base Completa <suporte@example.test>'}),{
  key:'re_test',from:'Base Completa <suporte@example.test>',
 });
 assert.equal(resetPageBase({VERCEL_ENV:'production'}),'https://central-de-estudos-ecru.vercel.app');
 assert.equal(resetPageBase({VERCEL_ENV:'preview',VERCEL_URL:'my-preview.vercel.app'}),'https://my-preview.vercel.app');
 assert.throws(()=>resetPageBase({VERCEL_ENV:'preview',VERCEL_URL:'untrusted.example.org'}),/seguro/);
});

test('envio Resend produz mensagem com link e sem divulgar senha; falhas interrompem envio',async()=>{
 const calls=[];
 const send=async(url,opt)=>{calls.push({url,opt});return {ok:true,json:async()=>({id:'email_123'})}};
 const config={key:'re_for_test',from:'Base Completa <suporte@example.test>'};
 const link='https://central-de-estudos-ecru.vercel.app/recuperar-senha.html#token=abc';
 const result=await sendResetEmail({to:'aluno@example.test',link,id:'mock-request-1',config,transport:send});
 assert.equal(result,'email_123');
 assert.equal(calls[0].url,'https://api.resend.com/emails');
 assert.equal(calls[0].opt.headers['Idempotency-Key'],'mock-request-1');
 const body=JSON.parse(calls[0].opt.body);
 assert.deepEqual(body.to,['aluno@example.test']);
 assert.match(body.text,/30 minutos/);
 assert.ok(body.html.includes(link));
 assert.ok(!JSON.stringify(body).includes('SenhaAntigaDoAluno'));
 await assert.rejects(sendResetEmail({to:'aluno@example.test',link,id:'2',config,transport:async()=>({ok:false,status:401})}),/Falha de envio/);
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
 assert.match(reset,/role='aluno'/);
 assert.match(reset,/central_password_reset_limits/);
 assert.match(reset,/sameOriginRequest\(req\)/);
 assert.match(middleware,/'\/recuperar-senha\.html'/);
 assert.match(sw,/if\(url\.pathname==='\/recuperar-senha\.html'\)return/);
 assert.match(page,/history\.replaceState/);
 assert.match(page,/location\.hash/);
 assert.match(page,/name="viewport"/);
 assert.match(login,/href="\/recuperar-senha\.html"/);
 const scripts=[...page.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)];
 assert.equal(scripts.length,1);
 assert.doesNotThrow(()=>new vm.Script(scripts[0][1]));
});

test('a autenticação existente continua aceitando novas senhas',()=>{
 const pass='SenhaNovissima-2026!';
 assert.equal(verifyPassword(pass,hashPassword(pass)),true);
});
