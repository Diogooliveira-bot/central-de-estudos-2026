import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {confirmationEmail,welcomeEmail,recoveryEmail,passwordChangedEmail,escapeEmailHtml} from '../lib/transactional-email-templates.js';

const confirmationLink='https://central-de-estudos-ecru.vercel.app/cadastro-gratuito.html#token=AAAABBBBCCCC';
const loginLink='https://central-de-estudos-ecru.vercel.app/login.html';
const resetLink='https://central-de-estudos-ecru.vercel.app/recuperar-senha.html#token=XYZ';

test('confirmation: approved HTML, unique token link, text alternative',()=>{
  const msg=confirmationEmail({name:'João Silva',link:confirmationLink});
  assert.match(msg.subject,/acesso está quase pronto/i);
  assert.match(msg.html,/Olá, João/);
  assert.match(msg.html,/CONFIRMAR MEU E-MAIL/);
  assert.match(msg.html,/30 minutos/);
  assert.ok(msg.html.includes(confirmationLink));
  assert.ok(msg.text.includes(confirmationLink));
  assert.ok(msg.html.includes('/img/logo.webp'));
  assert.doesNotMatch(msg.html,/cid:bc-|\{\{LINK_CONFIRMACAO\}\}/);
});

test('confirmation: names are HTML-escaped; no link injection',()=>{
  const msg=confirmationEmail({name:'<script>alert(1)</script> Nome',link:confirmationLink});
  assert.ok(!msg.html.includes('<script>alert(1)</script>'));
  assert.match(msg.html,/&lt;script&gt;/);
  assert.equal(escapeEmailHtml('"&<>'), '&quot;&amp;&lt;&gt;');
  assert.throws(()=>confirmationEmail({name:'Ana',link:'javascript:alert(1)'}),/não seguro/);
});

test('welcome: only grants Free; premium is presented as optional',()=>{
  const msg=welcomeEmail({name:'Maria Ferreira',link:loginLink});
  assert.match(msg.html,/Bem-vindo, Maria/);
  assert.match(msg.html,/Lei em Dia/i);
  assert.match(msg.html,/Cronograma de estudos/i);
  assert.match(msg.html,/Premium/i);
  assert.ok(msg.html.includes(loginLink));
  assert.ok(msg.text.includes('até 20 questões'));
  assert.ok(msg.html.includes('mascote-alegre.webp'));
  assert.doesNotMatch(msg.html,/\{\{(?:PRIMEIRO_NOME|LINK_CENTRAL)\}\}/);
});

test('reset email: security language, safe link, no password',()=>{
  const msg=recoveryEmail({link:resetLink});
  assert.match(msg.subject,/Recupere seu acesso/);
  assert.match(msg.html,/30 minutos/);
  assert.ok(msg.html.includes(resetLink));
  assert.match(msg.text,/uso único/);
  assert.throws(()=>recoveryEmail({link:'http://localhost/reset'}),/não seguro/);
});

test('password changed email: no plaintext password/token',()=>{
  const msg=passwordChangedEmail({name:'Lia',link:loginLink});
  assert.match(msg.html,/senha foi alterada/i);
  assert.ok(msg.html.includes(loginLink));
  assert.doesNotMatch(msg.html,/token=/);
  assert.match(msg.text,/não foi você/);
});

test('send hooks occur after confirmed account/password change; no unconditional marketing',()=>{
  const signup=readFileSync(new URL('../lib/free-signup-handler.js',import.meta.url),'utf8');
  const pwd=readFileSync(new URL('../lib/password-reset.js',import.meta.url),'utf8');
  assert.match(signup,/confirmationEmail\(\{name,link:url\}\)/);
  assert.ok(signup.indexOf('if(!rows.length)return send(res,410') < signup.indexOf('welcomeEmail({name:'));
  assert.match(signup,/backgroundTask\(task\)/);
  assert.match(pwd,/recoveryEmail\(\{link\}\)/);
  assert.ok(pwd.indexOf('if (!rows.length) return respond(res, 410') < pwd.indexOf('passwordChangedEmail({name:'));
  assert.doesNotMatch(signup,/emailMarketingOptIn\s*\?\s*welcomeEmail/);
});
