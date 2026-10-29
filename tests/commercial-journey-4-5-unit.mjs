import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('página comercial somente em prévia, com CTA de acesso já existente',()=>{
const p=read('conheca.html');
assert.match(p, /<html lang="pt-BR">/);
assert.match(p,/name="viewport"/);
assert.match(p,/noindex,nofollow/);
assert.match(p,/href="\/login.html"/);
assert.match(p,/href="\/recuperar-senha.html"/);
assert.match(p,/href="#acesso"/);
assert.match(p,/R\$ 97(?:<sup>)?,00/);
assert.match(p,/R\$ 194(?:<sup>)?,00/);
assert.match(p,/6 meses/);
assert.match(p,/12 meses/);
assert.match(p,/Gratuito/i);
assert.match(p,/Premium semestral/i);
assert.match(p,/Premium anual/i);
assert.match(p,/20 questões/);
assert.match(p,/TEC Concursos e (?:do )?Qconcursos/i);
assert.match(p,/sem promessa de aprovação|sem promessa de aprovaç|sem promessa/i);
assert.match(p,/Checkout aguardando validação comercial/);
assert.doesNotMatch(p,/href=["']https:\/\/pay\.hotmart\.com/);
assert.doesNotMatch(p,/<form\b/i);
});
test('navegação sem links quebrados internos, com páginas conhecidas',()=>{
const p=read('conheca.html');
for(const fragment of ['#como','#acesso','#duvidas']){
assert.ok(p.includes('id="'+fragment.slice(1)+'"'));
}
for(const file of ['login.html','recuperar-senha.html'])assert.ok(read(file).length>100);
});
test('V24 preserva demonstracoes e resolve cadastro no proprio ambiente',()=>{
const p=read('conheca.html');
assert.match(p,/id="v21-interactions"/);
assert.match(p,/id="bc-v24-integration"/);
assert.match(p,/free-signup-status/);
assert.match(p,/registrationApproved=status.enabled===true/);
assert.match(p,/href="\/termos-de-uso.html"/);
assert.doesNotMatch(p,/https:\/\/(?:app\.basecompleta\.com\.br|central-de-estudos-ecru\.vercel\.app)/);
});
test('funcionamento Hotmart requer flags explícitas no ambiente certo',()=>{
const p=read('lib/hotmart-webhook.js');
assert.match(p,/HOTMART_LIVE_ENABLED/);
assert.match(p,/HOTMART_TEST_RECEIVER_ENABLED/);
assert.match(p,/x-hotmart-hottok/);
assert.match(p,/safeSecretEqual/);
});
