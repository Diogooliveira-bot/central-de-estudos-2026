import test from 'node:test';
import assert from 'node:assert/strict';
import {expiryRemindersEnabled,expiryAppUrl,expiryReminderMessage} from '../lib/premium-expiry-reminders.js';
test('aviso de vencimento desativado por padrão',()=>{
 assert.equal(expiryRemindersEnabled({}),false);
 assert.equal(expiryRemindersEnabled({VERCEL_ENV:'preview'}),false);
});
test('link do aplicativo usa HTTPS e hostname permitido',()=>{
 assert.equal(expiryAppUrl({VERCEL_ENV:'production',BC_PUBLIC_APP_URL:'https://app.basecompleta.com.br/'}),'https://app.basecompleta.com.br');
 assert.equal(expiryAppUrl({VERCEL_ENV:'production',BC_PUBLIC_APP_URL:'https://exemplo.invalid/'}),'');
 assert.equal(expiryAppUrl({VERCEL_ENV:'production',BC_PUBLIC_APP_URL:'http://app.basecompleta.com.br/'}),'');
});
test('aviso é transacional, sem anúncio, com data de Fortaleza',()=>{
 const msg=expiryReminderMessage({name:'Aluno',endsAt:'2026-11-04T01:15:00Z',kind:'seven_days',baseUrl:'https://app.basecompleta.com.br'});
 assert.match(msg.subject,/7 dias/);
 assert.match(msg.text,/03\/11\/2026/);
 assert.match(msg.text,/renovação não é automática/);
 assert.doesNotMatch(msg.text,/cupom|50%|promoção/i);
});
