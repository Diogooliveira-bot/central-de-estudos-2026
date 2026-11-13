// O alerta de falha do webhook Hotmart precisa chegar mesmo quando Production usa Resend (sem Gmail).
import test from 'node:test';
import assert from 'node:assert/strict';
import { sendHotmartAlert } from '../lib/hotmart-webhook.js';
const issue = { reason: 'product_not_configured', status: 200, eventName: 'PURCHASE_APPROVED', eventId: 'e1', transaction: 'T1' };
const BASE = { VERCEL_ENV: 'production' };
const RESEND = { ...BASE, BC_EMAIL_PROVIDER: 'resend', RESEND_API_KEY: 're_' + 'a'.repeat(24) };
const GMAIL = { ...BASE, GMAIL_USER: 'suporte.teste@gmail.com', GMAIL_APP_PASSWORD: 'abcdefghijklmnop' };

test('com Resend e sem HOTMART_ALERT_EMAIL, o alerta vai ao e-mail de atendimento', async () => {
  const enviados = [];
  await sendHotmartAlert({ env: RESEND, issue, transport: async (msg, cfg) => { enviados.push({ msg, provider: cfg.provider }); return 'ok'; } });
  assert.equal(enviados.length, 1);
  assert.equal(enviados[0].provider, 'resend');
  assert.equal(enviados[0].msg.to, 'basecompleta.estudos@gmail.com');
  assert.match(enviados[0].msg.subject, /Alerta webhook Hotmart/);
  assert.doesNotMatch(enviados[0].msg.text + enviados[0].msg.html, /re_[a-z]{24}/, 'sem segredo na mensagem');
});

test('HOTMART_ALERT_EMAIL tem prioridade e o Gmail continua funcionando', async () => {
  const a = [];
  await sendHotmartAlert({ env: { ...RESEND, HOTMART_ALERT_EMAIL: 'dono@example.com' }, issue, transport: async m => { a.push(m.to); } });
  const b = [];
  await sendHotmartAlert({ env: GMAIL, issue, transport: async (m, cfg) => { b.push([m.to, cfg.provider]); } });
  assert.deepEqual(a, ['dono@example.com']);
  assert.deepEqual(b, [['suporte.teste@gmail.com', 'gmail']]);
});

test('sem nenhum provedor configurado o alerta falha de forma explícita', async () => {
  await assert.rejects(() => sendHotmartAlert({ env: BASE, issue, transport: async () => 'x' }), /Provedor de e-mail indisponível/);
});
