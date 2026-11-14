import test from 'node:test';
import assert from 'node:assert/strict';
import { sendViaResend, SUPPORT_REPLY_TO } from '../lib/resend-email.js';
import {
  createHotmartWebhook, maskEmail, sendHotmartSaleNotice, notifyHotmartOutcome, sendPremiumActivatedNotice,
} from '../lib/hotmart-webhook.js';
import { notifyTicket, ticketProtocol } from '../lib/study-communication.js';

const resendEnv = { BC_EMAIL_PROVIDER: 'resend', RESEND_API_KEY: 're_abcdefghijklmnop' };

test('Resend: respostas vão para o atendimento; Reply-To do aluno só quando informado e válido', async () => {
  const bodies = [];
  const fetcher = async (_u, init) => { bodies.push(JSON.parse(init.body)); return { ok: true, json: async () => ({ id: 'e_1' }) }; };
  const cfg = { apiKey: 're_abcdefghijklmnop' };
  await sendViaResend({ to: 'aluno@example.test', subject: 'A', text: 'x' }, cfg, { fetcher });
  await sendViaResend({ to: 'equipe@example.test', subject: 'B', text: 'x', replyTo: 'aluno@example.test' }, cfg, { fetcher });
  await sendViaResend({ to: 'equipe@example.test', subject: 'C', text: 'x', replyTo: 'x@y.z\r\nBcc: a@b.c' }, cfg, { fetcher });
  assert.equal(bodies[0].reply_to, SUPPORT_REPLY_TO);
  assert.equal(SUPPORT_REPLY_TO, 'basecompleta.estudos@gmail.com');
  assert.equal(bodies[1].reply_to, 'aluno@example.test');
  assert.equal(bodies[2].reply_to, SUPPORT_REPLY_TO, 'valor com quebra de linha é descartado');
  assert.equal(bodies[0].from, 'Base Completa <notificacoes@basecompleta.com.br>');
});

test('aviso de venda ao dono: plano, transação e comprador mascarado', async () => {
  assert.equal(maskEmail('maria.silva@gmail.com'), 'm***@gmail.com');
  assert.equal(maskEmail(''), '(sem e-mail)');
  const sent = [];
  await sendHotmartSaleNotice({
    env: resendEnv, eventName: 'PURCHASE_REFUNDED', months: 6, transaction: 'HP123456', outcome: 'revoked',
    email: 'maria.silva@gmail.com', transport: async m => { sent.push(m); },
  });
  const m = sent[0];
  assert.equal(m.to, 'basecompleta.estudos@gmail.com');
  assert.match(m.subject, /Reembolso · Semestral/);
  assert.ok(!m.text.includes('maria.silva') && !m.html.includes('maria.silva'), 'e-mail completo não vai no aviso');
  assert.match(m.text, /m\*\*\*@gmail\.com/);
  assert.match(m.text, /HP123456/);
  assert.match(m.text, /dentro da Hotmart/);
  const own = await (async () => { const out = []; await sendHotmartSaleNotice({ env: { ...resendEnv, HOTMART_ALERT_EMAIL: 'dono@example.test' }, eventName: 'PURCHASE_APPROVED', months: 12, transaction: 'HP9', outcome: 'applied', email: 'a@b.co', transport: async x => { out.push(x); } }); return out[0]; })();
  assert.equal(own.to, 'dono@example.test');
  assert.match(own.subject, /Venda aprovada · Anual/);
});

test('avisos só em produção e só nos desfechos que mudam algo; falhas não propagam', async () => {
  const calls = [];
  const sendSale = async a => { calls.push('sale:' + a.outcome); };
  const sendActivated = async () => { calls.push('activated'); };
  const parsed = { eventName: 'PURCHASE_APPROVED', transaction: 'HP1', months: 6, email: 'a@b.co', buyerName: 'Ana' };
  const prod = { VERCEL_ENV: 'production' };
  await notifyHotmartOutcome({ env: { VERCEL_ENV: 'preview' }, sql: null, parsed, result: { outcome: 'applied' }, sendSale, sendActivated });
  assert.deepEqual(calls, [], 'prévia não envia');
  await notifyHotmartOutcome({ env: prod, sql: null, parsed, result: { outcome: 'applied' }, sendSale, sendActivated });
  await notifyHotmartOutcome({ env: prod, sql: null, parsed, result: { outcome: 'pending_claim', should_send_email: true }, sendSale, sendActivated });
  await notifyHotmartOutcome({ env: prod, sql: null, parsed: { ...parsed, eventName: 'PURCHASE_REFUNDED' }, result: { outcome: 'revoked' }, sendSale, sendActivated });
  await notifyHotmartOutcome({ env: prod, sql: null, parsed, result: { outcome: 'already_applied' }, sendSale, sendActivated });
  await notifyHotmartOutcome({ env: prod, sql: null, parsed, result: { outcome: 'pending_claim', should_send_email: false }, sendSale, sendActivated });
  assert.deepEqual(calls, ['sale:applied', 'activated', 'sale:pending_claim', 'sale:revoked']);
  await notifyHotmartOutcome({ env: prod, sql: null, parsed, result: { outcome: 'applied' },
    sendSale: async () => { throw new Error('smtp'); }, sendActivated: async () => { throw new Error('smtp'); } });
});

test('webhook chama o aviso depois de processar e não muda a resposta se ele falhar', async () => {
  const token = 'TestOnlyHottok0123456789xxxxxxxx';
  const env = { VERCEL_ENV: 'preview', HOTMART_TEST_RECEIVER_ENABLED: 'true', HOTMART_HOTTOK: token, HOTMART_PRODUCT_ID: '8805543', HOTMART_OFFER_6M_CODE: 'semestralTEST', HOTMART_OFFER_12M_CODE: 'anualTEST' };
  const body = { id: 'evt_abcdef123', event: 'PURCHASE_REFUNDED', creation_date: 1792930000000, version: '2.0.0',
    data: { product: { id: 8805543 }, buyer: { email: 'teste@example.com', name: 'Aluno' }, purchase: { transaction: 'HP1234567890', status: 'REFUNDED', offer: { code: 'semestralTEST' } } } };
  const seen = [];
  const sql = async () => [{ outcome: 'revoked', should_send_email: false }];
  const handler = createHotmartWebhook({ env, sendAlert: async () => {}, sqlProvider: () => sql, notify: async a => { seen.push(a.parsed.eventName + ':' + a.result.outcome); } });
  const res = { statusCode: 0, headers: {}, setHeader() {}, end(s) { this.body = JSON.parse(s); } };
  await handler({ method: 'POST', headers: { 'x-hotmart-hottok': token, 'content-type': 'application/json' }, body }, res);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(seen, ['PURCHASE_REFUNDED:revoked']);
});

test('Premium ativado para quem já tinha conta usa datas reais da assinatura', async () => {
  const sent = [];
  const sql = async () => [{ starts_at: '2026-11-14T15:00:00Z', ends_at: '2027-05-14T15:00:00Z', name: 'Ana Souza' }];
  const ok = await sendPremiumActivatedNotice({ env: { VERCEL_ENV: 'production' }, sql, email: 'ana@example.test', buyerName: 'x', months: 6, transaction: 'HP77', sendEmail: async a => { sent.push(a); } });
  assert.equal(ok, true);
  assert.equal(sent[0].type, 'premium-ativado');
  assert.equal(sent[0].fields.PRIMEIRO_NOME, 'Ana');
  assert.equal(sent[0].fields.NOME_PLANO, 'Premium Semestral');
  assert.equal(sent[0].fields.DATA_VENCIMENTO, '14/05/2027');
  assert.equal(sent[0].fields.IDENTIFICADOR_PEDIDO, 'HP77');
  assert.match(sent[0].verifiedEventId, /^hotmart-activated:HP77$/);
  const none = await sendPremiumActivatedNotice({ env: {}, sql: async () => [], email: 'z@example.test', buyerName: '', months: 12, transaction: 'HP78', sendEmail: async () => { throw new Error('não deve enviar'); } });
  assert.equal(none, false);
});

test('chamado de suporte: aviso à equipe com Reply-To do aluno e confirmação com protocolo', async () => {
  const id = '3f2a9c1e-1111-4222-8333-444455556666';
  assert.equal(ticketProtocol(id), '3F2A9C1E');
  const mails = [], confirmations = [];
  await notifyTicket({
    id, subject: 'Dúvida sobre meu acesso', message: 'Não consigo entrar no módulo.', user: { name: 'Ana Souza', email: 'ana@example.test' },
    env: resendEnv, send: async m => { mails.push(m); }, sendConfirmation: async c => { confirmations.push(c); },
  });
  assert.equal(mails[0].to, 'basecompleta.estudos@gmail.com');
  assert.equal(mails[0].replyTo, 'ana@example.test');
  assert.match(mails[0].subject, /#3F2A9C1E/);
  assert.match(mails[0].text, /Não consigo entrar/);
  assert.equal(confirmations[0].type, 'suporte-recebido');
  assert.equal(confirmations[0].to, 'ana@example.test');
  assert.equal(confirmations[0].fields.NUMERO_PROTOCOLO, '3F2A9C1E');
  assert.equal(confirmations[0].fields.PRIMEIRO_NOME, 'Ana');
  // falha de e-mail não derruba o chamado
  await notifyTicket({ id, subject: 'Assunto longo ok', message: 'mensagem longa o bastante', user: { name: 'Ana', email: 'ana@example.test' }, env: resendEnv,
    send: async () => { throw new Error('x'); }, sendConfirmation: async () => { throw new Error('y'); } });
});
