import test from 'node:test';
import assert from 'node:assert/strict';

process.env.AUTH_SECRET = 'revocation-test-secret-only-for-unit-tests-20261024';
process.env.DATABASE_URL = 'postgresql://test:test@ep-unit-test.us-east-2.aws.neon.tech/test';
delete process.env.VERCEL_ENV;
delete process.env.BC_PREVIEW_GUEST_TOKEN;

const { createSessionGuard } = await import('../lib/session-guard.js');
const { createSessionToken } = await import('../lib/auth.js');

/* ------------------------------------------------------------------ */
/* 1. Regras do guard (relógio falso, banco falso)                    */
/* ------------------------------------------------------------------ */

function fakeClock(start = 1_000_000) {
  let t = start;
  return { now: () => t, advance: (ms) => { t += ms; } };
}

function guardWith(rowRef, { clock = fakeClock(), counters = { lookups: 0 }, fail = { on: false } } = {}) {
  const guard = createSessionGuard({
    now: clock.now,
    lookup: async () => {
      counters.lookups++;
      if (fail.on) throw new Error('banco indisponível');
      return rowRef.row;
    },
  });
  return { guard, clock, counters, fail };
}

const payload = { uid: 'u-1', sv: 1 };

test('conta ativa com mesma versão de sessão passa e devolve o papel do BANCO', async () => {
  const ref = { row: { role: 'aluno', active: true, session_version: 1 } };
  const { guard } = guardWith(ref);
  assert.deepEqual(await guard.check(payload), { ok: true, role: 'aluno' });
});

test('conta desativada perde o acesso assim que o cache de 30 s vence', async () => {
  const ref = { row: { role: 'aluno', active: true, session_version: 1 } };
  const { guard, clock } = guardWith(ref);
  assert.equal((await guard.check(payload)).ok, true);

  ref.row = { role: 'aluno', active: false, session_version: 1 };
  clock.advance(29_000);
  assert.equal((await guard.check(payload)).ok, true, 'dentro do prazo ainda vale o resultado em cache');
  clock.advance(2_000); // 31 s no total
  assert.deepEqual(await guard.check(payload), { ok: false, reason: 'revoked' });
});

test('troca de senha ou de papel (session_version) revoga o cookie antigo', async () => {
  const ref = { row: { role: 'aluno', active: true, session_version: 1 } };
  const { guard, clock } = guardWith(ref);
  assert.equal((await guard.check(payload)).ok, true);

  ref.row = { role: 'aluno', active: true, session_version: 2 };
  clock.advance(31_000);
  assert.deepEqual(await guard.check(payload), { ok: false, reason: 'revoked' });
});

test('usuário apagado do banco é revogado', async () => {
  const ref = { row: null };
  const { guard } = guardWith(ref);
  assert.deepEqual(await guard.check(payload), { ok: false, reason: 'revoked' });
});

test('rebaixamento: o papel devolvido é o do banco, não o do cookie', async () => {
  const ref = { row: { role: 'admin', active: true, session_version: 1 } };
  const { guard, clock } = guardWith(ref);
  assert.equal((await guard.check({ uid: 'u-1', sv: 1, role: 'admin' })).role, 'admin');
  ref.row = { role: 'aluno', active: true, session_version: 1 };
  clock.advance(31_000);
  assert.equal((await guard.check({ uid: 'u-1', sv: 1, role: 'admin' })).role, 'aluno');
});

test('papel desconhecido no banco é tratado como revogado', async () => {
  const ref = { row: { role: 'superuser', active: true, session_version: 1 } };
  const { guard } = guardWith(ref);
  assert.equal((await guard.check(payload)).ok, false);
});

test('rajada de pedidos do mesmo usuário gera UMA consulta ao banco', async () => {
  const ref = { row: { role: 'aluno', active: true, session_version: 1 } };
  const counters = { lookups: 0 };
  const { guard } = guardWith(ref, { counters });
  const results = await Promise.all(Array.from({ length: 60 }, () => guard.check(payload)));
  assert.equal(results.every((r) => r.ok), true);
  assert.equal(counters.lookups, 1);
  await guard.check(payload);
  assert.equal(counters.lookups, 1, 'dentro do TTL não consulta de novo');
});

test('banco fora do ar: sem resultado anterior recusa (não libera)', async () => {
  const ref = { row: { role: 'aluno', active: true, session_version: 1 } };
  const { guard } = guardWith(ref, { fail: { on: true } });
  assert.deepEqual(await guard.check(payload), { ok: false, reason: 'unavailable' });
});

test('banco fora do ar: resultado de até 5 min ainda vale; depois recusa', async () => {
  const ref = { row: { role: 'aluno', active: true, session_version: 1 } };
  const fail = { on: false };
  const { guard, clock } = guardWith(ref, { fail });
  assert.equal((await guard.check(payload)).ok, true);

  fail.on = true;
  clock.advance(60_000);
  assert.equal((await guard.check(payload)).ok, true, 'resultado de 1 min vale durante a falha');
  clock.advance(5 * 60_000);
  assert.deepEqual(await guard.check(payload), { ok: false, reason: 'unavailable' });
});

test('banco fora do ar não ressuscita uma sessão já revogada', async () => {
  const ref = { row: { role: 'aluno', active: false, session_version: 1 } };
  const fail = { on: false };
  const { guard, clock } = guardWith(ref, { fail });
  assert.equal((await guard.check(payload)).ok, false);
  fail.on = true;
  clock.advance(60_000);
  assert.equal((await guard.check(payload)).ok, false);
});

test('payload sem uid é revogado sem consultar o banco', async () => {
  const counters = { lookups: 0 };
  const { guard } = guardWith({ row: null }, { counters });
  assert.equal((await guard.check({ sv: 1 })).ok, false);
  assert.equal(counters.lookups, 0);
});

/* ------------------------------------------------------------------ */
/* 2. Middleware real contra um "Neon" simulado (fetch falso)         */
/* ------------------------------------------------------------------ */

const db = { users: new Map(), fail: false, queries: 0 };

globalThis.fetch = async (_url, init) => {
  db.queries++;
  if (db.fail) throw new TypeError('rede indisponível (simulada)');
  const { params } = JSON.parse(init.body);
  const user = db.users.get(params[0]);
  const rows = user ? [[user.role, user.active ? 't' : 'f', String(user.session_version)]] : [];
  return new Response(JSON.stringify({
    command: 'SELECT',
    rowCount: rows.length,
    fields: [
      { name: 'role', dataTypeID: 25 },
      { name: 'active', dataTypeID: 16 },
      { name: 'session_version', dataTypeID: 23 },
    ],
    rows,
  }), { status: 200, headers: { 'content-type': 'application/json' } });
};

const { default: middleware } = await import('../middleware.js');
const { sessionGuard } = await import('../lib/session-guard.js');

function makeUser(id, role = 'aluno', sv = 1) {
  const row = { user_id: id, email: id + '@example.test', name: id, role, session_version: sv };
  db.users.set(id, { role, active: true, session_version: sv });
  return row;
}

function req(path, row) {
  const headers = {};
  if (row) headers.cookie = 'bc_session=' + encodeURIComponent(createSessionToken(row, 3600));
  return new Request('https://central.example.test' + path, { headers });
}

const passedThrough = (res) => res.headers.get('x-middleware-next') === '1';

test.beforeEach(() => {
  db.users.clear();
  db.fail = false;
  db.queries = 0;
  sessionGuard.clear();
});

test('middleware: aluno ativo abre página e arquivo estático', async () => {
  const row = makeUser('mw-ok');
  assert.equal(passedThrough(await middleware(req('/index.html', row))), true);
  assert.equal(passedThrough(await middleware(req('/modules/x.js', row))), true);
});

test('middleware: conta desativada é mandada ao login e o cookie é apagado', async () => {
  const row = makeUser('mw-off');
  assert.equal(passedThrough(await middleware(req('/index.html', row))), true);

  db.users.get('mw-off').active = false;
  sessionGuard.clear(); // simula o fim do prazo de 30 s
  const res = await middleware(req('/index.html', row));
  assert.equal(res.status, 302);
  assert.match(res.headers.get('location'), /\/login\.html\?next=%2Findex\.html$/);
  assert.match(res.headers.get('set-cookie'), /bc_session=; .*Max-Age=0/);
  assert.equal(passedThrough(res), false);
});

test('middleware: senha trocada (session_version) revoga o cookie antigo', async () => {
  const row = makeUser('mw-pw', 'aluno', 1);
  db.users.get('mw-pw').session_version = 2;
  const res = await middleware(req('/index.html', row));
  assert.equal(res.status, 302);
  assert.match(res.headers.get('location'), /\/login\.html/);
});

test('middleware: admin rebaixado perde /usuarios.html mas ainda abre a Central', async () => {
  const row = makeUser('mw-adm', 'admin', 1);
  assert.equal(passedThrough(await middleware(req('/usuarios.html', row))), true);

  db.users.get('mw-adm').role = 'aluno'; // rebaixado; o cookie ainda diz "admin"
  sessionGuard.clear();
  const usuarios = await middleware(req('/usuarios.html', row));
  assert.equal(usuarios.status, 302);
  assert.equal(new URL(usuarios.headers.get('location')).pathname, '/');
  assert.equal(passedThrough(await middleware(req('/index.html', row))), true);
});

test('middleware: banco fora do ar e sem resultado recente devolve 503 sem cookie nem cache', async () => {
  const row = makeUser('mw-down');
  db.fail = true;
  const res = await middleware(req('/index.html', row));
  assert.equal(res.status, 503);
  assert.equal(res.headers.get('retry-after'), '15');
  assert.equal(res.headers.get('cache-control'), 'no-store');
  assert.equal(res.headers.get('set-cookie'), null, 'não apaga o cookie por causa de uma falha do banco');
});

test('middleware: sem cookie, rotas de API e páginas públicas não consultam o banco', async () => {
  const noCookie = await middleware(req('/index.html'));
  assert.equal(noCookie.status, 302);
  assert.equal(passedThrough(await middleware(req('/api/auth?action=me'))), true);
  assert.equal(passedThrough(await middleware(req('/login.html'))), true);
  assert.equal(passedThrough(await middleware(req('/sw.js'))), true);
  assert.equal(db.queries, 0);
});

test('middleware: cookie adulterado não chega a consultar o banco', async () => {
  const row = makeUser('mw-forged');
  const forged = createSessionToken(row, 3600).slice(0, -2) + 'xx';
  const res = await middleware(new Request('https://central.example.test/index.html', {
    headers: { cookie: 'bc_session=' + encodeURIComponent(forged) },
  }));
  assert.equal(res.status, 302);
  assert.equal(db.queries, 0);
});

test('middleware: uma rajada de 50 arquivos do mesmo aluno faz uma única consulta', async () => {
  const row = makeUser('mw-burst');
  const results = await Promise.all(Array.from({ length: 50 }, (_, i) => middleware(req('/modules/f' + i + '.js', row))));
  assert.equal(results.every(passedThrough), true);
  assert.equal(db.queries, 1);
});
