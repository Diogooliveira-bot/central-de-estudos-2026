import test from 'node:test';
import assert from 'node:assert/strict';
import { createSessionToken, verifySessionToken, sessionCookie, clearSessionCookie, sameOriginRequest, normalizeRole, hashPassword, verifyPassword } from '../lib/auth.js';

process.env.AUTH_SECRET='audit-only-secret-for-local-unit-tests-20261007';
const user={user_id:'student-test',email:'student@example.test',name:'Student',role:'aluno',session_version:2};
test('session signature, expiry and version payload',()=>{
  const token=createSessionToken(user,60);
  assert.equal(verifySessionToken(token)?.uid,user.user_id);
  assert.equal(verifySessionToken(token)?.sv,2);
  assert.equal(verifySessionToken(token.slice(0,-1)+'x'),null);
  assert.equal(verifySessionToken(createSessionToken(user,-1)),null);
});
test('cookie flags and origin check',()=>{
  assert.match(sessionCookie('token'),/HttpOnly; Secure; SameSite=Lax/);
  assert.match(clearSessionCookie(),/Max-Age=0/);
  assert.equal(sameOriginRequest({method:'POST',headers:{host:'example.test',origin:'https://example.test','sec-fetch-site':'same-origin'}}),true);
  assert.equal(sameOriginRequest({method:'POST',headers:{host:'example.test',origin:'https://evil.test','sec-fetch-site':'cross-site'}}),false);
});
test('roles and password hash',()=>{
  assert.equal(normalizeRole('editor'),'editor');assert.equal(normalizeRole('superuser'),'');
  const hash=hashPassword('audit-password');assert.equal(verifyPassword('audit-password',hash),true);assert.equal(verifyPassword('wrong-password',hash),false);
});

// Evita regressão no acesso da Preview com credencial longa (sem usar segredo real).
import { readFileSync } from 'node:fs';
test('Preview: token longo válido não é rejeitado por limite antigo de 128 caracteres', () => {
  const middleware = readFileSync(new URL('../middleware.js', import.meta.url), 'utf8');
  const authApi = readFileSync(new URL('../api/auth.js', import.meta.url), 'utf8');
  assert.match(middleware, /token\.length\s*>\s*2048/);
  assert.match(authApi, /supplied\.length\s*>\s*2048/);
  assert.match(middleware, /process\.env\.VERCEL_ENV\s*===\s*'preview'/);
  assert.match(authApi, /process\.env\.VERCEL_ENV\s*!==\s*'preview'/);
  assert.match(middleware, /path\.startsWith\('\/api\/'\)/);
  assert.match(middleware, /previewForbidden\(\)/);
});
