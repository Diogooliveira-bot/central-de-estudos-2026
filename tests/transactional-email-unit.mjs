import test from 'node:test';
import assert from 'node:assert/strict';
import {transactionalEmailConfig,sendTransactionalEmail} from '../lib/transactional-email.js';
test('Gmail remains default without activation flag',()=>{
  assert.equal(transactionalEmailConfig({RESEND_API_KEY:'re_abcdefghijklmnop'}),null);
  const gmail=transactionalEmailConfig({GMAIL_USER:'basecompleta.estudos@gmail.com',GMAIL_APP_PASSWORD:'abcd efgh ijkl mnop'});
  assert.equal(gmail.provider,'gmail');
  assert.equal(gmail.user,'basecompleta.estudos@gmail.com');
});
test('Resend only activates when explicitly selected',()=>{
  assert.equal(transactionalEmailConfig({BC_EMAIL_PROVIDER:'resend'}),null);
  const config=transactionalEmailConfig({BC_EMAIL_PROVIDER:'resend',RESEND_API_KEY:'re_abcdefghijklmnop'});
  assert.equal(config.provider,'resend');
  assert.equal(config.from,'Base Completa <notificacoes@basecompleta.com.br>');
});
test('unknown provider fails closed',async()=>{
  await assert.rejects(sendTransactionalEmail({to:'a@example.test',subject:'Teste',text:'Teste'}, {provider:'invalid'}),/Provedor de e-mail/);
});
