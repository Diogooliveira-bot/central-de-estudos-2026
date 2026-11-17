import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  MAX_JSON_BODY_BYTES,
  assertPreviewDatabaseIsolation,
  readJsonBody,
  sameOriginRequest,
  verifiedClientIp,
} from '../lib/auth.js';

const text = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('toda Preview com banco falha fechada sem confirmação de isolamento', () => {
  const base = {
    VERCEL_ENV: 'preview',
    DATABASE_URL: 'postgresql:' + '//user:pass@ep-test.us-east-1.aws.neon.tech/neondb',
    BC_PREVIEW_NEON_EXPECTED_HOST: 'ep-test.us-east-1.aws.neon.tech',
  };
  assert.throws(() => assertPreviewDatabaseIsolation(base), /isolamento Neon TEST/);
  assert.throws(() => assertPreviewDatabaseIsolation({ ...base, BC_PREVIEW_NEON_GUARD: 'YES', BC_PREVIEW_NEON_EXPECTED_HOST: 'ep-production.us-east-1.aws.neon.tech' }), /banco Neon diferente/);
  assert.equal(assertPreviewDatabaseIsolation({ ...base, BC_PREVIEW_NEON_GUARD: 'YES' }), true);
  assert.equal(assertPreviewDatabaseIsolation({ VERCEL_ENV: 'production', DATABASE_URL: base.DATABASE_URL }), true);
});

test('JSON, IP e origem possuem limites e validação defensiva', async () => {
  await assert.rejects(
    readJsonBody({ headers: { 'content-length': String(MAX_JSON_BODY_BYTES + 1) }, body: '{}' }),
    (error) => error.statusCode === 413,
  );
  assert.deepEqual(await readJsonBody({ headers: {}, body: '{"ok":true}' }), { ok: true });
  assert.equal(verifiedClientIp({ headers: { 'x-vercel-forwarded-for': '2001:db8::1, 10.0.0.1' } }), '2001:db8::1');
  assert.equal(verifiedClientIp({ headers: { 'x-forwarded-for': 'invalid-ip' } }), '');
  assert.equal(sameOriginRequest({ method: 'DELETE', headers: { host: 'app.example', origin: 'https://evil.example', 'sec-fetch-site': 'cross-site' } }), false);
});

test('configuração HTTP aplica proteções globais sem alterar os domínios', async () => {
  const config = JSON.parse(await text('vercel.json'));
  const global = config.headers.find((entry) => entry.source === '/(.*)');
  assert.ok(global);
  const headers = Object.fromEntries(global.headers.map(({ key, value }) => [key.toLowerCase(), value]));
  assert.equal(headers['x-content-type-options'], 'nosniff');
  assert.equal(headers['x-frame-options'], 'SAMEORIGIN');
  assert.match(headers['content-security-policy'], /frame-ancestors 'self'/);
  assert.match(headers['permissions-policy'], /camera=\(\)/);
  assert.equal(config.domains, undefined);
});

test('quota gratuita falha fechada e função sensível perde EXECUTE de PUBLIC', async () => {
  const handler = await text('lib/questoes-handler.js');
  const migration = await text('db/migrations/011_security_hardening.sql');
  assert.match(handler, /pendingMigration\) throw quotaUnavailable\(\)/);
  assert.doesNotMatch(handler, /SEM_LIMITE|fallback ilimitado/i);
  assert.match(migration, /REVOKE ALL ON FUNCTION public\.central_claim_questao\(TEXT, TEXT\) FROM PUBLIC/);
});

test('operações administrativas sensíveis geram auditoria imutável', async () => {
  const users = await text('api/users.js');
  const migration = await text('db/migrations/011_security_hardening.sql');
  for (const action of ['user_created', 'user_updated', 'student_deleted', 'password_reset']) {
    assert.match(users, new RegExp(action));
  }
  assert.match(migration, /central_admin_security_audit/);
  assert.match(migration, /REVOKE UPDATE, DELETE, TRUNCATE/);
  assert.doesNotMatch(users, /metadata[^\n]*(email|password)/i);
});

test('endpoints de dados usam identidade da sessão, não userId do navegador', async () => {
  for (const file of ['api/backups.js', 'api/sync.js', 'api/progress-summary.js', 'api/objective.js']) {
    const source = await text(file);
    assert.match(source, /session\.user\.id|auth\.user\.id/);
    assert.doesNotMatch(source, /body\?\.userId|query\?\.userId/);
  }
});

test('nenhum endpoint retorna mensagem interna de exceção ao cliente', async () => {
  const files = ['api/admin-dashboard.js', 'api/backups.js', 'api/content-editor.js', 'api/objective.js', 'api/progress-summary.js', 'api/sync.js', 'api/users.js'];
  for (const file of files) {
    assert.doesNotMatch(await text(file), /send\([^\n]*error\?\.message|error:\s*error\.message/);
  }
});
