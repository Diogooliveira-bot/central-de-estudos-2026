// Limite diário das Questões do módulo contra PostgreSQL real (PGlite, em memória).
// Executa as migrações versionadas (001–010) e o handler real; nenhum banco externo nem dado de aluno.
import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import { PGlite } from '@electric-sql/pglite';
import { createQuestoesHandler, loadModule, projectStatement } from '../lib/questoes-handler.js';

const db = new PGlite();
for (const file of fs.readdirSync(new URL('../db/migrations/', import.meta.url)).sort())
  await db.exec(fs.readFileSync(new URL('../db/migrations/' + file, import.meta.url), 'utf8'));

function sql(strings, ...values) {
  const text = strings.reduce((acc, part, i) => acc + '$' + i + part);
  return db.query(text, values.map(v => v instanceof Date ? v.toISOString() : v)).then(r => r.rows);
}
const handler = createQuestoesHandler({
  requireSession: async req => req.userId ? { ok: true, sql, user: { id: req.userId } } : { ok: false, status: 401, error: 'Sessão necessária' },
});
function res() { return { headers: {}, setHeader(k, v) { this.headers[k] = v; }, end(v) { this.body = v ? JSON.parse(v) : null; } }; }
async function call(req) { const r = res(); await handler({ headers: { host: 'app.example', origin: 'https://app.example' }, ...req }, r); return r; }
const modulo = (userId, disc = 'adm', n = 3) => call({ method: 'GET', query: { action: 'modulo', disc, n: String(n) }, userId });
const uso = userId => call({ method: 'GET', query: { action: 'uso' }, userId });
const responder = (userId, id, choice = 0, disc = 'adm', n = 3) => call({ method: 'POST', query: { action: 'responder' }, body: { disc, n, id, choice }, userId });

async function aluno({ plan = 'free', role = 'aluno', ends = null, status = 'active', active = true } = {}) {
  const id = crypto.randomUUID();
  await sql`INSERT INTO central_users(user_id,name,email,role,password_hash,active)
    VALUES(${id},'Aluno Ficticio',${'a-' + id.slice(0, 8) + '@example.invalid'},${role},'x',${active})`;
  if (plan) await sql`INSERT INTO central_user_subscriptions(subscription_id,user_id,plan_code,status,starts_at,ends_at,grant_source)
    VALUES(${crypto.randomUUID()},${id},${plan},${status},NOW()-INTERVAL '2 days',${ends},'manual')`;
  return id;
}
const IDS = (await loadModule('adm', 3)).map(q => q.id);
const OUTROS = (await loadModule('adm', 4)).map(q => q.id);

test('o banco tem questões suficientes para os cenários', () => {
  assert.ok(IDS.length >= 8, 'adm M03 precisa de 8+ questões para testar a 6ª e as repetidas');
});

test('migração 010: Gratuito com 5/dia e Premium sem limite na matriz de direitos', async () => {
  const rows = await sql`SELECT plan_code, enabled, daily_limit FROM central_plan_entitlements WHERE feature_code='questoes_modulo' ORDER BY plan_code`;
  assert.deepEqual(rows.map(r => [r.plan_code, r.enabled, r.daily_limit]), [['free', true, 5], ['premium', true, null]]);
});

test('a lista do módulo traz enunciados e alternativas, nunca gabarito, comentário ou base legal', async () => {
  const id = await aluno();
  const r = await modulo(id);
  assert.equal(r.statusCode, 200);
  assert.equal(r.body.items.length, IDS.length);
  const texto = JSON.stringify(r.body);
  for (const campo of ['"answer"', '"explanation"', '"lawRef"']) assert.ok(!texto.includes(campo), 'vazou ' + campo);
  assert.deepEqual(Object.keys(r.body.items[0]).sort(), ['id', 'options', 'origem', 'q']);
  assert.equal(r.body.items[0].options.length, 5);
  assert.deepEqual(r.body.usage, { plan: 'free', enabled: true, limit: 5, used: 0, remaining: 5, answeredToday: [], resetsAt: '00:00 America/Sao_Paulo' });
  assert.equal(r.headers['Cache-Control'], 'private, no-store, no-cache, max-age=0');
});

test('Gratuito: 5 questões distintas por dia; a 6ª recebe 429 e não vê o gabarito', async () => {
  const id = await aluno();
  for (let i = 0; i < 5; i++) {
    const r = await responder(id, IDS[i], 0);
    assert.equal(r.statusCode, 200, 'questão ' + (i + 1));
    assert.equal(r.body.usage.used, i + 1);
    assert.equal(r.body.usage.remaining, 4 - i);
    assert.ok(Number.isInteger(r.body.answer) && r.body.explanation.length > 50);
  }
  const sexta = await responder(id, IDS[5], 0);
  assert.equal(sexta.statusCode, 429);
  assert.equal(sexta.body.code, 'DAILY_LIMIT');
  assert.equal(sexta.body.dailyLimit, 5);
  assert.equal(sexta.body.used, 5);
  const texto = JSON.stringify(sexta.body);
  assert.ok(!/answer|explanation|lawRef|correct/.test(texto), 'a 429 não pode revelar a correção');
  const total = (await sql`SELECT COUNT(*)::int AS n FROM central_questoes_daily_usage WHERE user_id=${id}`)[0].n;
  assert.equal(total, 5, 'a 6ª não grava uso');
});

test('responder de novo a mesma questão no mesmo dia não gasta cota, mesmo com a cota esgotada', async () => {
  const id = await aluno();
  for (let i = 0; i < 5; i++) await responder(id, IDS[i], 1);
  const repetida = await responder(id, IDS[2], 3);
  assert.equal(repetida.statusCode, 200);
  assert.equal(repetida.body.usage.used, 5);
  assert.equal(repetida.body.usage.alreadyCounted, true);
  const lista = await modulo(id);
  assert.equal(lista.body.usage.remaining, 0);
  assert.equal(lista.body.usage.answeredToday.length, 5);
  assert.ok(lista.body.usage.answeredToday.includes(IDS[0]));
});

test('a cota vale para o aluno no total (outros módulos e disciplinas), não por módulo', async () => {
  const id = await aluno();
  for (let i = 0; i < 3; i++) await responder(id, IDS[i], 0);
  for (let i = 0; i < 2; i++) assert.equal((await responder(id, OUTROS[i], 0, 'adm', 4)).statusCode, 200);
  assert.equal((await responder(id, OUTROS[2], 0, 'adm', 4)).statusCode, 429);
});

test('correção: acerta e erra conforme o gabarito do servidor', async () => {
  const id = await aluno();
  const banco = await loadModule('adm', 3);
  const q = banco[0];
  const certa = await responder(id, q.id, q.answer);
  assert.equal(certa.body.correct, true);
  const errada = await responder(id, q.id, (q.answer + 1) % 5);
  assert.equal(errada.body.correct, false);
  assert.equal(errada.body.answer, q.answer);
  assert.equal(errada.body.lawRef, q.lawRef);
});

test('o dia civil (America/Sao_Paulo) zera a cota: uso de ontem não conta hoje', async () => {
  const id = await aluno();
  for (let i = 0; i < 5; i++) await sql`INSERT INTO central_questoes_daily_usage(user_id,usage_date,question_id)
    VALUES(${id},(NOW() AT TIME ZONE 'America/Sao_Paulo')::DATE - 1,${IDS[i]})`;
  const r = await responder(id, IDS[0], 0);
  assert.equal(r.statusCode, 200);
  assert.equal(r.body.usage.used, 1);
  assert.equal(r.body.usage.alreadyCounted, false);
});

test('cliques simultâneos não furam o limite (8 em paralelo → exatamente 5 liberadas)', async () => {
  const id = await aluno();
  const rs = await Promise.all(IDS.slice(0, 8).map(q => responder(id, q, 0)));
  assert.equal(rs.filter(r => r.statusCode === 200).length, 5);
  assert.equal(rs.filter(r => r.statusCode === 429).length, 3);
  assert.equal((await sql`SELECT COUNT(*)::int AS n FROM central_questoes_daily_usage WHERE user_id=${id}`)[0].n, 5);
});

test('Premium e equipe respondem sem limite e sem gravar uso', async () => {
  const premium = await aluno({ plan: 'premium', ends: new Date(Date.now() + 90 * 86400000) });
  const editor = await aluno({ plan: null, role: 'editor' });
  for (const id of [premium, editor]) {
    for (let i = 0; i < 8; i++) assert.equal((await responder(id, IDS[i], 0)).statusCode, 200);
    assert.equal((await sql`SELECT COUNT(*)::int AS n FROM central_questoes_daily_usage WHERE user_id=${id}`)[0].n, 0);
  }
  assert.equal((await uso(premium)).body.usage.limit, null);
  assert.equal((await uso(editor)).body.usage.plan, 'staff');
});

test('Premium vencido volta ao limite do Gratuito', async () => {
  const id = await aluno({ plan: 'premium', ends: new Date(Date.now() - 86400000), status: 'expired' });
  for (let i = 0; i < 5; i++) assert.equal((await responder(id, IDS[i], 0)).statusCode, 200);
  assert.equal((await responder(id, IDS[5], 0)).statusCode, 429);
});

test('o limite é lido do banco: mudar o valor vale na hora, sem novo código', async () => {
  const id = await aluno();
  await sql`UPDATE central_plan_entitlements SET daily_limit=2 WHERE plan_code='free' AND feature_code='questoes_modulo'`;
  try {
    assert.equal((await responder(id, IDS[0], 0)).statusCode, 200);
    assert.equal((await responder(id, IDS[1], 0)).statusCode, 200);
    const r = await responder(id, IDS[2], 0);
    assert.equal(r.statusCode, 429);
    assert.equal(r.body.dailyLimit, 2);
    await sql`UPDATE central_plan_entitlements SET enabled=FALSE WHERE plan_code='free' AND feature_code='questoes_modulo'`;
    assert.equal((await responder(id, IDS[0], 0)).statusCode, 403, 'recurso desligado para o Gratuito');
  } finally {
    await sql`UPDATE central_plan_entitlements SET daily_limit=5, enabled=TRUE WHERE plan_code='free' AND feature_code='questoes_modulo'`;
  }
});

test('conta inativa, sem plano e sem sessão não recebem questões', async () => {
  assert.equal((await modulo(null)).statusCode, 401);
  assert.equal((await modulo(await aluno({ active: false }))).statusCode, 401);
  assert.equal((await modulo(await aluno({ plan: null }))).statusCode, 403);
  assert.equal((await responder(await aluno({ plan: null }), IDS[0], 0)).statusCode, 403);
});

test('entradas inválidas são recusadas sem tocar na cota', async () => {
  const id = await aluno();
  assert.equal((await modulo(id, '../etc', 3)).statusCode, 400);
  assert.equal((await modulo(id, 'adm', 0)).statusCode, 400);
  assert.equal((await modulo(id, 'adm', 'x')).statusCode, 400);
  assert.equal((await modulo(id, 'xyz', 3)).statusCode, 404);
  assert.equal((await responder(id, IDS[0], 9)).statusCode, 400);
  assert.equal((await responder(id, IDS[0], '1')).statusCode, 400);
  assert.equal((await responder(id, 'questao-inexistente', 1)).statusCode, 404);
  assert.equal((await responder(id, OUTROS[0], 1, 'adm', 3)).statusCode, 404, 'id de outro módulo');
  assert.equal((await sql`SELECT COUNT(*)::int AS n FROM central_questoes_daily_usage WHERE user_id=${id}`)[0].n, 0);
});

test('origem cruzada é recusada no POST e no GET', async () => {
  const id = await aluno();
  const post = await call({ method: 'POST', query: { action: 'responder' }, body: { disc: 'adm', n: 3, id: IDS[0], choice: 0 }, userId: id, headers: { host: 'app.example', origin: 'https://evil.example' } });
  assert.equal(post.statusCode, 403);
  const get = await call({ method: 'GET', query: { action: 'modulo', disc: 'adm', n: '3' }, userId: id, headers: { host: 'app.example', 'sec-fetch-site': 'cross-site' } });
  assert.equal(get.statusCode, 403);
  assert.equal((await call({ method: 'DELETE', query: { action: 'modulo' }, userId: id })).statusCode, 405);
});

test('todos os módulos do banco têm enunciado público sem gabarito', async () => {
  const w = { window: {} };
  new (await import('node:vm')).Script(fs.readFileSync(new URL('../content/questoes/index.js', import.meta.url), 'utf8')).runInNewContext(w);
  const indice = JSON.parse(JSON.stringify(w.window.BC_QUESTOES_INDICE));
  let total = 0;
  for (const [disc, mods] of Object.entries(indice)) for (const n of mods) {
    const itens = await loadModule(disc, n);
    assert.ok(itens.length >= 10, `${disc} M${n}: ${itens.length} questões`);
    total += itens.length;
    const pub = JSON.stringify(itens.map(projectStatement));
    assert.ok(!/"answer"|"explanation"|"lawRef"/.test(pub));
  }
  assert.ok(total >= 1480);
});

test('antes da migração 010 o recurso funciona SEM limite; ao aplicar a migração, o limite de 5 liga sozinho', async () => {
  const antigo = new PGlite();
  const arquivos = fs.readdirSync(new URL('../db/migrations/', import.meta.url)).sort();
  for (const f of arquivos.filter(x => !x.startsWith('010_'))) await antigo.exec(fs.readFileSync(new URL('../db/migrations/' + f, import.meta.url), 'utf8'));
  const sqlAntigo = (strings, ...values) => antigo.query(strings.reduce((a, part, i) => a + '$' + i + part), values.map(v => v instanceof Date ? v.toISOString() : v)).then(r => r.rows);
  const h = createQuestoesHandler({ requireSession: async req => ({ ok: true, sql: sqlAntigo, user: { id: req.userId } }) });
  const chamar = async req => { const r = res(); await h({ headers: { host: 'app.example', origin: 'https://app.example' }, ...req }, r); return r; };
  const id = crypto.randomUUID();
  await sqlAntigo`INSERT INTO central_users(user_id,name,email,role,password_hash,active) VALUES(${id},'Aluno Ficticio','pre010@example.invalid','aluno','x',TRUE)`;
  await sqlAntigo`INSERT INTO central_user_subscriptions(subscription_id,user_id,plan_code,status,starts_at,grant_source) VALUES(${crypto.randomUUID()},${id},'free','active',NOW()-INTERVAL '1 day','manual')`;
  const lista = await chamar({ method: 'GET', query: { action: 'modulo', disc: 'adm', n: '3' }, userId: id });
  assert.equal(lista.statusCode, 200);
  assert.equal(lista.body.usage.limit, null, 'sem migração não há limite');
  for (let i = 0; i < 8; i++) {
    const r = await chamar({ method: 'POST', query: { action: 'responder' }, body: { disc: 'adm', n: 3, id: IDS[i], choice: 0 }, userId: id });
    assert.equal(r.statusCode, 200, 'questão ' + (i + 1) + ' sem migração');
    assert.ok(Number.isInteger(r.body.answer));
  }
  // aplica a migração: a partir daí vale o limite, sem reiniciar nada
  await antigo.exec(fs.readFileSync(new URL('../db/migrations/010_questoes_daily_limit.sql', import.meta.url), 'utf8'));
  let liberadas = 0;
  for (let i = 0; i < 8; i++) {
    const r = await chamar({ method: 'POST', query: { action: 'responder' }, body: { disc: 'adm', n: 3, id: IDS[i], choice: 0 }, userId: id });
    if (r.statusCode === 200) liberadas++;
  }
  assert.equal(liberadas, 5);
  const uso = await chamar({ method: 'GET', query: { action: 'uso' }, userId: id });
  assert.equal(uso.body.usage.limit, 5);
  assert.equal(uso.body.usage.remaining, 0);
});
