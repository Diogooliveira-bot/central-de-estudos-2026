import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import {
  createInviteToken, hashInviteToken, validInviteToken, inviteStatus,
  INVITE_TTL_DAYS,
} from '../lib/invites.js';

test('token individual possui 256 bits, formato URL-safe e não se repete', () => {
  const tokens = Array.from({ length: 30 }, createInviteToken);
  assert.equal(new Set(tokens).size, tokens.length);
  for (const token of tokens) {
    assert.equal(token.length, 43);
    assert.equal(validInviteToken(token), true);
    assert.match(hashInviteToken(token), /^[a-f0-9]{64}$/);
    assert.notEqual(hashInviteToken(token), token);
  }
  assert.equal(validInviteToken('curto'), false);
  assert.equal(hashInviteToken('curto'), '');
});

test('convite tem prazo padrão e estados consistentes', () => {
  assert.equal(INVITE_TTL_DAYS, 7);
  const future = new Date(Date.now() + 86400000).toISOString();
  const past = new Date(Date.now() - 86400000).toISOString();
  assert.equal(inviteStatus({expires_at: future}), 'pendente');
  assert.equal(inviteStatus({expires_at: past}), 'expirado');
  assert.equal(inviteStatus({expires_at: future, used_at: new Date()}), 'utilizado');
  assert.equal(inviteStatus({expires_at: future, revoked_at: new Date()}), 'revogado');
});

test('API: somente admin gera convite; cadastro sempre cria aluno; resgate atômico', () => {
  const source = readFileSync(new URL('../lib/invite-handler.js', import.meta.url), 'utf8');
  assert.match(source, /requireSession\(req, \['admin'\]\)/);
  assert.match(source, /role,password_hash,active/);
  assert.match(source, /'aluno',/);
  assert.match(source, /WITH claimed AS/);
  assert.match(source, /AND used_at IS NULL AND revoked_at IS NULL AND expires_at > NOW\(\)/);
  assert.match(source, /FROM claimed/);
  assert.match(source, /sameOriginRequest\(req\)/);
  assert.doesNotMatch(source, /INSERT INTO central_users[^;]+\$\{body\.role\}/s);
});

test('acesso público limitado ao resgate: páginas administrativas seguem protegidas', () => {
  const middleware = readFileSync(new URL('../middleware.js', import.meta.url), 'utf8');
  const html = readFileSync(new URL('../convite.html', import.meta.url), 'utf8');
  const auth = readFileSync(new URL('../api/auth.js', import.meta.url), 'utf8');
  assert.match(auth, /handleInviteAction/);
  assert.match(middleware, /'\/convite\.html'/);
  assert.match(middleware, /session\.role !== 'admin'/);
  assert.match(html, /base-completa-symbol\.webp/);
  assert.match(html, /history\.replaceState/);
  assert.match(html, /\/api\/auth\?action=invite-redeem/);
});


test('scripts das telas de convite e administração possuem sintaxe JavaScript válida', () => {
  for (const path of ['../convite.html', '../usuarios.html']) {
    const html = readFileSync(new URL(path, import.meta.url), 'utf8');
    const scripts = [...html.matchAll(/<script(?:\\s[^>]*)?>([\\s\\S]*?)<\\/script>/g)];
    assert.ok(scripts.length > 0, 'Script ausente: ' + path);
    for (const script of scripts) assert.doesNotThrow(() => new vm.Script(script[1]));
  }
});
