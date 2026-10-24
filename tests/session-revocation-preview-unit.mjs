import test from 'node:test';
import assert from 'node:assert/strict';

// Regressão de docs/PREVIEW_ACCESS.md: o visitante da Prévia (cookie bc_preview_guest)
// NUNCA toca o banco. A verificação de sessão revogada só vale para login real.
// Arquivo separado porque middleware.js lê VERCEL_ENV na importação.
const GUEST_TOKEN = 'token-ficticio-somente-para-teste-unitario-0123456789';
process.env.VERCEL_ENV = 'preview';
process.env.BC_PREVIEW_GUEST_TOKEN = GUEST_TOKEN;
process.env.AUTH_SECRET = 'preview-test-secret-only-for-unit-tests-20261024';
process.env.DATABASE_URL = 'postgresql://test:test@ep-unit-test.us-east-2.aws.neon.tech/test';

let queries = 0;
globalThis.fetch = async () => {
  queries++;
  return new Response(JSON.stringify({
    command: 'SELECT', rowCount: 1,
    fields: [{ name: 'role', dataTypeID: 25 }, { name: 'active', dataTypeID: 16 }, { name: 'session_version', dataTypeID: 23 }],
    rows: [['aluno', 't', '1']],
  }), { status: 200, headers: { 'content-type': 'application/json' } });
};

const { default: middleware } = await import('../middleware.js');
const { createSessionToken } = await import('../lib/auth.js');

const guestReq = (path) => new Request('https://prev.example.test' + path, {
  headers: { cookie: 'bc_preview_guest=' + encodeURIComponent(GUEST_TOKEN) },
});
const passed = (res) => res.headers.get('x-middleware-next') === '1';

test.beforeEach(() => { queries = 0; });

test('visitante da Prévia abre a Central e os arquivos sem consultar o banco', async () => {
  assert.equal(passed(await middleware(guestReq('/central-v119.html'))), true);
  assert.equal(passed(await middleware(guestReq('/index.html'))), true);
  assert.equal(passed(await middleware(guestReq('/modules/x.js'))), true);
  assert.equal(queries, 0);
});

test('visitante: só GET /api/auth?action=me passa; o resto das APIs e as páginas de admin dão 403', async () => {
  assert.equal(passed(await middleware(guestReq('/api/auth?action=me'))), true);
  assert.equal((await middleware(guestReq('/api/users'))).status, 403);
  assert.equal((await middleware(guestReq('/api/sync'))).status, 403);
  assert.equal((await middleware(guestReq('/usuarios.html'))).status, 403);
  assert.equal((await middleware(guestReq('/update-central.html'))).status, 403);
  assert.equal(queries, 0);
});

test('cookie de visitante errado não vale e cai no login', async () => {
  const res = await middleware(new Request('https://prev.example.test/index.html', {
    headers: { cookie: 'bc_preview_guest=' + encodeURIComponent('x'.repeat(48)) },
  }));
  assert.equal(res.status, 302);
  assert.match(res.headers.get('location'), /\/login\.html/);
  assert.equal(queries, 0);
});

test('na Prévia, login REAL continua passando pela verificação de sessão no banco', async () => {
  const row = { user_id: 'real-1', email: 'real@example.test', name: 'Real', role: 'aluno', session_version: 1 };
  const token = createSessionToken(row, 3600);
  const res = await middleware(new Request('https://prev.example.test/index.html', {
    headers: { cookie: 'bc_session=' + encodeURIComponent(token) },
  }));
  assert.equal(passed(res), true);
  assert.equal(queries, 1);
});
