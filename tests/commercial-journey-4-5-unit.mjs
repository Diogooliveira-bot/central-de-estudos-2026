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
assert.match(p,/href="#planos"/);
assert.match(p,/R\$ 97,00/);
assert.match(p,/R\$ 194,00/);
assert.match(p,/6 meses/);
assert.match(p,/12 meses/);
assert.match(p,/Gratuito/);
assert.match(p,/Premium semestral/);
assert.match(p,/Premium anual/);
assert.match(p,/20 questões/);
assert.match(p,/TEC e QConcursos/);
assert.match(p,/sem promessa de aprovação|sem promessa de aprovaç|sem promessa/i);
assert.match(p,/Checkout aguardando validação comercial/);
assert.doesNotMatch(p,/href=["']https:\/\/pay\.hotmart\.com/);
assert.doesNotMatch(p,/<form\b/i);
});
test('navegação sem links quebrados internos, com páginas conhecidas',()=>{
const p=read('conheca.html');
for(const fragment of ['#como-funciona','#planos','#duvidas']){
assert.ok(p.includes('id="'+fragment.slice(1)+'"'));
}
for(const file of ['login.html','recuperar-senha.html'])assert.ok(read(file).length>100);
});
test('funcionamento Hotmart requer flags explícitas no ambiente certo',()=>{
const p=read('lib/hotmart-webhook.js');
assert.match(p,/HOTMART_LIVE_ENABLED/);
assert.match(p,/HOTMART_TEST_RECEIVER_ENABLED/);
assert.match(p,/x-hotmart-hottok/);
assert.match(p,/safeSecretEqual/);
});
