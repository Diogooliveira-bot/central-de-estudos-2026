import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {Script} from 'node:vm';

const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');

test('cadastros públicos são consultados somente com sessão administrativa',()=>{
  const api=read('lib/admin-public-signups-handler.js'),auth=read('api/auth.js');
  assert.match(auth,/action === 'admin-public-signups'/);
  assert.match(auth,/handleAdminPublicSignups/);
  assert.match(api,/requireSession\(req,\['admin'\]\)/);
  assert.match(api,/req\.method!=='GET'/);
  assert.match(api,/Cache-Control','private, no-store'/);
  assert.match(api,/central_free_signup_pending/);
  assert.match(api,/central_free_signup_legal_acceptances/);
  assert.match(api,/JOIN public\.central_users/);
  assert.match(api,/WHERE u\.role='aluno'/);
  assert.match(api,/SELECT name,email,created_at,expires_at/);
  assert.doesNotMatch(api,/SELECT\s+\*/);
  assert.doesNotMatch(api,/(?:SELECT|RETURNING)[^\x60]*(?:password_hash|token_hash)/i);
});

test('painel diferencia solicitação pendente de aluno confirmado',()=>{
  const html=read('usuarios.html');
  assert.match(html,/id="cadastrosPublicos"/);
  assert.match(html,/id="publicSignups"/);
  assert.match(html,/\/api\/auth\?action=admin-public-signups/);
  assert.match(html,/AGUARDANDO E-MAIL/);
  assert.match(html,/LINK EXPIRADO/);
  assert.match(html,/E-MAIL CONFIRMADO/);
  assert.match(html,/esc\(u\.name\)/);
  assert.match(html,/esc\(u\.email\)/);
  assert.match(html,/load\(\);loadPublicSignups\(\);loadInvites\(\)/);
  const script=html.match(/<script>([\s\S]*?)<\/script>/);
  assert.ok(script);
  assert.doesNotThrow(()=>new Script(script[1]));
});
