// Economia do banco (Neon): conta as consultas de cada fluxo e confere as regras de sincronização econômica.
// Usa um banco FALSO que só registra os comandos; nenhum dado real.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

process.env.AUTH_SECRET = 'economia-do-banco-' + 'segredo-so-para-testes-20261125';
const { __setDatabaseForTests, createSessionToken, COOKIE_NAME } = await import('../lib/auth.js');
const { ensureOnce, forgetEnsured } = await import('../lib/db-once.js');
const { requirePlanFeature } = await import('../lib/plan-access.js');
const { default: syncHandler } = await import('../api/sync.js');

function fakeDb({ role = 'aluno', revision = 7 } = {}) {
  const log = [];
  const sql = async (strings, ...values) => {
    const text = strings.join('?').replace(/\s+/g, ' ').trim();
    log.push({ text, values });
    if (/^(CREATE|ALTER)/i.test(text)) return [];
    if (/FROM central_users WHERE user_id/i.test(text)) return [{ user_id: 'u1', name: 'Aluno', email: 'a@example.test', role, active: true, session_version: 1 }];
    if (/free_enabled/i.test(text)) return [{ user_id: 'u1', role, active: true, plan_code: 'premium', subscription_status: 'active', starts_at: '2026-01-01T00:00:00Z', ends_at: '2099-01-01T00:00:00Z', free_enabled: true, premium_enabled: true }];
    if (/central_user_sync_state/i.test(text) && /^SELECT/i.test(text)) {
      const since = values.find((v) => typeof v === 'number');
      return [{ revision, updated_at: '2026-11-25T00:00:00Z', device_id: 'd', content_hash: 'h', payload_bytes: 12, payload: since === revision ? null : { 'central-v6:x': '1' } }];
    }
    return [];
  };
  return { sql, log, count: () => log.length, ddl: () => log.filter((q) => /^(CREATE|ALTER)/i.test(q.text)).length };
}
const request = (query = {}, role = 'aluno') => ({
  method: 'GET', query, headers: { cookie: `${COOKIE_NAME}=${encodeURIComponent(createSessionToken({ user_id: 'u1', email: 'a@example.test', name: 'Aluno', role, session_version: 1 }, 600))}` },
});
const response = () => { const r = { headers: {}, setHeader(k, v) { r.headers[k] = v; }, end(b) { r.body = b; } }; return r; };

test('ensureOnce: roda uma vez por cliente, tenta de novo se falhar', async () => {
  const a = {}, b = {}; let runs = 0;
  await ensureOnce(a, 'k', async () => { runs++; }); await ensureOnce(a, 'k', async () => { runs++; });
  assert.equal(runs, 1);
  await ensureOnce(b, 'k', async () => { runs++; });
  assert.equal(runs, 2, 'outro cliente tem a sua própria memória');
  let tries = 0;
  await assert.rejects(ensureOnce(a, 'falha', async () => { tries++; throw new Error('x'); }));
  await ensureOnce(a, 'falha', async () => { tries++; });
  assert.equal(tries, 2, 'depois de falhar, a próxima chamada tenta de novo');
  forgetEnsured(a); await ensureOnce(a, 'k', async () => { runs++; });
  assert.equal(runs, 3);
});

test('aluno: no máximo 2 consultas por pedido depois da primeira (antes eram ~8), sem comandos de estrutura', async () => {
  const db = fakeDb(); __setDatabaseForTests(db.sql);
  try {
    assert.equal((await requirePlanFeature(request(), 'progress.advanced_sync')).ok, true);
    const firstDdl = db.ddl();
    assert.ok(firstDdl >= 1, 'a primeira chamada confere a tabela de usuários');
    const before = db.count();
    const again = await requirePlanFeature(request(), 'progress.advanced_sync');
    assert.equal(again.ok, true);
    assert.equal(db.ddl(), firstDdl, 'nenhum comando de estrutura novo');
    assert.equal(db.count() - before, 2, 'sessão (1) + plano e permissão (1)');
  } finally { __setDatabaseForTests(null); }
});

test('administrador: só a consulta da sessão (sem plano)', async () => {
  const db = fakeDb({ role: 'admin' }); __setDatabaseForTests(db.sql);
  try {
    await requirePlanFeature(request({}, 'admin'), 'progress.advanced_sync');
    const before = db.count();
    const r = await requirePlanFeature(request({}, 'admin'), 'progress.advanced_sync');
    assert.equal(r.ok, true); assert.equal(r.plan.isStaff, true);
    assert.equal(db.count() - before, 1);
  } finally { __setDatabaseForTests(null); }
});

test('plano sem o recurso continua bloqueado (403) e conta inexistente (401)', async () => {
  const db = fakeDb(); __setDatabaseForTests(async (strings, ...v) => {
    const rows = await db.sql(strings, ...v);
    return rows[0] && 'free_enabled' in rows[0] ? [{ ...rows[0], plan_code: 'free', free_enabled: false, premium_enabled: true }] : rows;
  });
  try {
    const r = await requirePlanFeature(request(), 'progress.advanced_sync');
    assert.equal(r.ok, false); assert.equal(r.status, 403);
  } finally { __setDatabaseForTests(null); }
});

test('sync GET: com ?since igual à revisão da nuvem responde "sem mudanças" e não manda os dados', async () => {
  const db = fakeDb({ revision: 7 }); __setDatabaseForTests(db.sql);
  try {
    const sem = response(); await syncHandler(request({ since: '7' }), sem);
    const bodySem = JSON.parse(sem.body);
    assert.equal(bodySem.unchanged, true); assert.equal(bodySem.revision, 7); assert.equal('payload' in bodySem, false);
    const com = response(); await syncHandler(request({ since: '3' }), com);
    const bodyCom = JSON.parse(com.body);
    assert.equal(bodyCom.unchanged, undefined); assert.deepEqual(bodyCom.payload, { 'central-v6:x': '1' });
    const sem2 = response(); await syncHandler(request({}), sem2);
    assert.ok(JSON.parse(sem2.body).payload, 'sem ?since (app antigo) continua recebendo os dados');
  } finally { __setDatabaseForTests(null); }
});

test('sync GET completo: 3 consultas (sessão, plano, estado) depois da primeira', async () => {
  const db = fakeDb(); __setDatabaseForTests(db.sql);
  try {
    await syncHandler(request({ since: '7' }), response());
    const before = db.count();
    await syncHandler(request({ since: '7' }), response());
    assert.equal(db.count() - before, 3);
  } finally { __setDatabaseForTests(null); }
});

test('aplicativo: não consulta a nuvem com a aba escondida e pede só a revisão quando já tem os dados', () => {
  const src = readFileSync(new URL('../sync-client.js', import.meta.url), 'utf8');
  assert.match(src, /'\/api\/sync'\+\(meta\.revision>0\?'\?since='/);
  assert.match(src, /setInterval\(function\(\)\{if\(document\.visibilityState==='visible'\)sync\('poll'\)\},300000\)/);
  assert.match(src, /visibilityState==='visible'&&Date\.now\(\)-lastOkAt>60000\)sync\('visible'\)/);
  assert.doesNotMatch(src, /setInterval\(function\(\)\{sync\('poll'\)\},120000\)/);
});
