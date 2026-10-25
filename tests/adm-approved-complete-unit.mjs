import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('20 apostilas aprimoradas carregam com teoria e questões no leitor ADM', () => {
  const context = { window: {} };
  vm.createContext(context);
  for (let n = 1; n <= 20; n++) {
    const path = `content/adm/m${String(n).padStart(2, '0')}-approved-complete.js`;
    vm.runInContext(read(path), context, { filename: path });
    const html = context.window.ADM_APPROVED_COMPLETE[n];
    assert.ok(html.length > 10000, `M${n}: teoria extensa`);
    if (![1, 2, 5, 11].includes(n)) assert.match(html, /Gabarito:/i, `M${n}: respostas preservadas`);
    else {
      const lite = { window: {} };
      vm.createContext(lite);
      vm.runInContext(read(`content/adm/m${String(n).padStart(2, '0')}-native-data-lite.js`), lite);
      const existing = Object.values(lite.window.ADM_NATIVE_CONTENT)[0];
      assert.match(existing.completeAppendHtml, /Questão 10|<h2>10\./i, `M${n}: dez questões respondidas na Central`);
    }
  }
  assert.equal(Object.keys(context.window.ADM_APPROVED_COMPLETE).length, 20);
  const layer = read('ui/adm-native-layer.js');
  assert.match(layer, /kind==='summary'\?d\.summaryHtml:await loadApprovedComplete\(uid\)/);
  assert.match(layer, /\[1,2,5,11\]\.includes\(num\(uid\)\)/);
  assert.match(layer, /central-v6:adm-native:/);
});
