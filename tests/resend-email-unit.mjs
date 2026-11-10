import test from 'node:test';
import assert from 'node:assert/strict';
import {resendConfig,sendViaResend} from '../lib/resend-email.js';
test('Resend configurado somente com chave válida',()=>{
 assert.equal(resendConfig({}),null);
 assert.equal(resendConfig({RESEND_API_KEY:'invalid'}),null);
 assert.equal(resendConfig({RESEND_API_KEY:'re_abcdefghijklmnop'}).from,
  'Base Completa <notificacoes@basecompleta.com.br>');
});
test('envio usa domínio verificado e não expõe a chave no corpo',async()=>{
 let request;
 const config=resendConfig({RESEND_API_KEY:'re_abcdefghijklmnop'});
 const id=await sendViaResend({to:'aluno@example.test',subject:'Teste',text:'Olá'},config,{
  fetcher:async(url,init)=>{request={url,init};return {ok:true,json:async()=>({id:'email_123'})}}
 });
 assert.equal(id,'email_123');
 assert.equal(request.url,'https://api.resend.com/emails');
 assert.equal(request.init.method,'POST');
 const body=JSON.parse(request.init.body);
 assert.equal(body.from,'Base Completa <notificacoes@basecompleta.com.br>');
 assert.deepEqual(body.to,['aluno@example.test']);
 assert.ok(!request.init.body.includes(config.apiKey));
});
test('não envia com destinatário inválido',async()=>{
 await assert.rejects(sendViaResend({to:'invalid',subject:'teste',text:'teste'},
  {apiKey:'re_abcdefghijklmnop'}, {fetcher:()=>{throw Error('não deveria chamar')}}),
  /Destinatário inválido/);
});
test('erro remoto não expõe resposta do provedor',async()=>{
 await assert.rejects(sendViaResend({to:'aluno@example.test',subject:'teste',text:'teste'},
  {apiKey:'re_abcdefghijklmnop'}, {fetcher:async()=>({ok:false,status:403})}),
  /Falha no envio Resend/);
});
