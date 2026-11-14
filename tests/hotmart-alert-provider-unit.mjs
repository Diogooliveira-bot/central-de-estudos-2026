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

import { sendHotmartWelcome } from '../lib/hotmart-webhook.js';
import fsx from 'node:fs';
test('e-mail de ativação do comprador: marca, passos, link único, suporte e imagens hospedadas no app', async () => {
  const enviados = [];
  const token = 'Ab1_'.repeat(10) + 'xyz';   // 43 caracteres
  await sendHotmartWelcome({ env: { ...RESEND, BC_PUBLIC_APP_URL: 'https://app.basecompleta.com.br' }, to: 'comprador@example.invalid', token, transport: async m => { enviados.push(m); } });
  const [m] = enviados;
  assert.equal(m.subject, 'Ative seu Premium | Base Completa');
  assert.ok(m.html.includes('https://app.basecompleta.com.br/ativar-acesso.html#token=' + token));
  assert.ok(m.text.includes('https://app.basecompleta.com.br/ativar-acesso.html#token=' + token));
  for (const re of [/uma única vez/, /7 dias/, /basecompleta\.estudos@gmail\.com/, /Já tem conta/, /sem renovação automática/, /Nunca pedimos sua senha/]) assert.match(m.html, re);
  assert.match(m.text, /Nunca pedimos sua senha/);
  assert.ok(m.html.includes('https://app.basecompleta.com.br/icons/email/logo.webp'));
  assert.ok(fsx.existsSync(new URL('../icons/email/logo.webp', import.meta.url)), 'imagem do e-mail precisa existir no repositório');
  assert.doesNotMatch(m.html, /vitrine-estatica/);
});
