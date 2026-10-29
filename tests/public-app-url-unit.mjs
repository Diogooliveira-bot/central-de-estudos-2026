import test from 'node:test';
import assert from 'node:assert/strict';
import {publicAppBase,validatedPublicOrigin} from '../lib/public-app-url.js';
import {resetPageBase} from '../lib/password-reset.js';
import {hotmartSiteBase} from '../lib/hotmart-webhook.js';
import {expiryAppUrl,expiryRemindersEnabled} from '../lib/premium-expiry-reminders.js';

test('Preview usa somente hostname do próprio deployment, sem domínio próprio',()=>{
 const env={VERCEL_ENV:'preview',VERCEL_URL:'central-de-estudos-9abgbtvjw-estudotd.vercel.app',
   BC_PUBLIC_APP_URL:'https://app.basecompleta.com.br/',BC_PUBLIC_URL:'https://outro.invalid/'};
 const expected='https://central-de-estudos-9abgbtvjw-estudotd.vercel.app';
 assert.equal(publicAppBase(env),expected);
 assert.equal(resetPageBase(env),expected);
 assert.equal(hotmartSiteBase(env),expected);
 assert.equal(expiryAppUrl(env),expected);
});

test('Production requer endereço explicitamente escolhido, nunca cai na Preview ecru',()=>{
 for(const env of [{VERCEL_ENV:'production'},{VERCEL_ENV:'production',VERCEL_URL:'test.vercel.app'}]){
  assert.throws(()=>publicAppBase(env),/BC_PUBLIC_APP_URL/);
  assert.equal(expiryAppUrl(env),'');
 }
 assert.throws(()=>publicAppBase({VERCEL_ENV:'production',BC_PUBLIC_APP_URL:'https://central-de-estudos-ecru.vercel.app/'}),/homologação/);
});

test('Acesso provisório Vercel é aceito em produção somente após configurar origem',()=>{
 const env={VERCEL_ENV:'production',BC_PUBLIC_APP_URL:'https://central-de-estudos.vercel.app/'};
 assert.equal(publicAppBase(env),'https://central-de-estudos.vercel.app');
 assert.equal(resetPageBase(env),'https://central-de-estudos.vercel.app');
 assert.equal(hotmartSiteBase(env),'https://central-de-estudos.vercel.app');
 assert.equal(expiryAppUrl(env),'https://central-de-estudos.vercel.app');
});

test('Apenas URLs HTTPS de host conhecido e sem caminhos/credenciais',()=>{
 for(const bad of ['http://central-de-estudos.vercel.app/','https://evil.invalid/',
  'https://central-de-estudos.vercel.app/login','https://central-de-estudos.vercel.app/?code=abc',
  'https://user:pass@central-de-estudos.vercel.app/',
  'https://central-de-estudos.vercel.app:444/','javascript:alert(1)',
  'https://central-de-estudos-ecru.vercel.app/']){
  assert.throws(()=>validatedPublicOrigin(bad));
 }
 assert.equal(validatedPublicOrigin('https://app.basecompleta.com.br/'),'https://app.basecompleta.com.br');
});

test('A falta de domínio não ativa cron Premium ou cadastro público',()=>{
 const env={VERCEL_ENV:'production',BC_EXPIRY_REMINDERS_ENABLED:'true',
  CRON_SECRET:'test-secret-32-characters-abcdefghij',
  GMAIL_USER:'teste@gmail.com',GMAIL_APP_PASSWORD:'A'.repeat(16)};
 assert.equal(expiryRemindersEnabled(env),false);
 assert.throws(()=>publicAppBase({VERCEL_ENV:'preview',VERCEL_URL:'unknown.invalid'}),/seguro/);
});
