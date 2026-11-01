// "Excluir minha conta": só o próprio aluno, com senha e confirmação; apaga a conta
// (cascata no banco) e encerra a sessão. Banco simulado — nenhum dado real.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createAccountDeletionHandler } from '../lib/account-deletion-handler.js';

function res() {
  return { statusCode: 0, headers: {}, body: '', setHeader(k, v) { this.headers[k] = v; }, end(b) { this.body = b; }, json() { return JSON.parse(this.body); } };
}
const req = (body = {}, method = 'POST') => ({ method, headers: { origin: 'https://app.basecompleta.com.br', host: 'app.basecompleta.com.br', 'sec-fetch-site': 'same-origin' }, body });
function setup({ role = 'aluno', passwordOk = true, locked = null, sessionOk = true } = {}) {
  const calls = [], failed = [];
  const sql = async (strings, ...values) => {
    const q = strings.join('?'); calls.push({ q, values });
    if (/SELECT password_hash/.test(q)) return [{ password_hash: 'hash', locked_until: locked }];
    if (/DELETE FROM public\.central_free_signup_pending/.test(q)) return [];
    if (/DELETE FROM central_users/.test(q)) return [{ user_id: 'u-1' }];
    throw Error('consulta inesperada: ' + q);
  };
  const handler = createAccountDeletionHandler({
    getSession: async () => sessionOk ? { ok: true, sql, user: { id: 'u-1', email: 'Aluno@Example.invalid', role } } : { ok: false, status: 401, error: 'Sessão inválida' },
    readBody: async r => r.body,
    verify: (p, h) => passwordOk && p === 'SenhaCerta#2026' && h === 'hash',
    failedLogin: async (_sql, id) => { failed.push(id); return { locked: false }; }
  });
  return { handler, calls, failed };
}

test('aluno confirma com senha e EXCLUIR: conta apagada e sessão encerrada', async () => {
  const { handler, calls } = setup();
  const r = res(); await handler(req({ password: 'SenhaCerta#2026', confirmation: 'excluir' }), r);
  assert.equal(r.statusCode, 200);
  assert.deepEqual(r.json(), { ok: true });
  assert.match(r.headers['Set-Cookie'], /bc_session=;.*Max-Age=0/);
  const del = calls.find(c => /DELETE FROM central_users/.test(c.q));
  assert.ok(del, 'apaga a conta');
  assert.match(del.q, /role='aluno'/, 'só apaga conta de aluno');
  assert.deepEqual(del.values, ['u-1'], 'apaga somente o próprio usuário');
  const pending = calls.find(c => /central_free_signup_pending/.test(c.q));
  assert.deepEqual(pending.values, ['aluno@example.invalid']);
});

test('senha errada não apaga nada e conta como tentativa', async () => {
  const { handler, calls, failed } = setup({ passwordOk: false });
  const r = res(); await handler(req({ password: 'errada', confirmation: 'EXCLUIR' }), r);
  assert.equal(r.statusCode, 401);
  assert.deepEqual(failed, ['u-1']);
  assert.ok(!calls.some(c => /DELETE/.test(c.q)));
});

test('sem a palavra EXCLUIR ou sem senha: recusa antes do banco', async () => {
  for (const body of [{ password: 'SenhaCerta#2026', confirmation: 'sim' }, { confirmation: 'EXCLUIR' }]) {
    const { handler, calls } = setup();
    const r = res(); await handler(req(body), r);
    assert.equal(r.statusCode, 400);
    assert.equal(calls.length, 0);
  }
});

test('conta bloqueada, equipe, sessão inválida, GET e outra origem são recusados', async () => {
  let s = setup({ locked: new Date(Date.now() + 60000).toISOString() }), r = res();
  await s.handler(req({ password: 'SenhaCerta#2026', confirmation: 'EXCLUIR' }), r);
  assert.equal(r.statusCode, 429); assert.ok(!s.calls.some(c => /DELETE/.test(c.q)));
  for (const role of ['admin', 'editor']) {
    s = setup({ role }); r = res(); await s.handler(req({ password: 'SenhaCerta#2026', confirmation: 'EXCLUIR' }), r);
    assert.equal(r.statusCode, 403); assert.equal(s.calls.length, 0);
  }
  s = setup({ sessionOk: false }); r = res(); await s.handler(req({}), r); assert.equal(r.statusCode, 401);
  s = setup(); r = res(); await s.handler(req({}, 'GET'), r); assert.equal(r.statusCode, 405);
  s = setup(); r = res();
  await s.handler({ method: 'POST', headers: { origin: 'https://evil.example', 'sec-fetch-site': 'cross-site' }, body: {} }, r);
  assert.equal(r.statusCode, 403); assert.equal(s.calls.length, 0);
});

test('todas as tabelas do aluno são apagadas em cascata; compras ficam sem vínculo', () => {
  const sqlFiles = ['001_plans_progress.sql', '003_hotmart_automatic_access.sql', '004_public_free_signup.sql', '005_free_signup_legal_acceptance.sql', '007_premium_expiry_notices.sql']
    .map(f => readFileSync(new URL('../db/migrations/' + f, import.meta.url), 'utf8')).join('\n');
  const refs = [...sqlFiles.matchAll(/user_id TEXT[^,\n]*REFERENCES public\.central_users\(user_id\) ON DELETE (CASCADE|SET NULL)/g)].map(m => m[1]);
  assert.ok(refs.length >= 10);
  assert.match(sqlFiles, /central_hotmart_orders[\s\S]*?user_id TEXT REFERENCES public\.central_users\(user_id\) ON DELETE SET NULL/);
  const api = readFileSync(new URL('../api/auth.js', import.meta.url), 'utf8');
  assert.match(api, /action === 'delete-account' && req\.method === 'POST'/);
  const boot = readFileSync(new URL('../central-v119.html', import.meta.url), 'utf8');
  assert.match(boot, /ui\/account-deletion-v1\.js\?v=/);
  assert.match(readFileSync(new URL('../index.html', import.meta.url), 'utf8'), /data-account-delete/);
});
