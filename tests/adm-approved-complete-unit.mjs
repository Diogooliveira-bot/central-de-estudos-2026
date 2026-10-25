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

test('sessões e checks podem ser marcados e desmarcados sem alterar o leitor compartilhado', () => {
  const data = { window: {} };
  vm.createContext(data);
  vm.runInContext(read('content/adm/adm-session-index.js'), data);
  assert.equal(Object.keys(data.window.ADM_SESSION_INDEX).length, 20);
  assert.match(data.window.ADM_SESSION_INDEX[1][0], /SESSÃO 01 · Regime jurídico/);
  for (let n = 1; n <= 20; n++) {
    assert.ok(data.window.ADM_SESSION_INDEX[n].length >= 5, `M${n}: sessões identificadas`);
    const html = JSON.parse(read(`content/adm/m${String(n).padStart(2, '0')}-approved-complete.js`).match(/=(".*");\s*$/s)[1]);
    assert.doesNotMatch(html, /[□☐]/, `M${n}: nenhum quadradinho de texto`);
  }
  for (const n of [1, 3, 11, 14, 16, 18, 19]) {
    const html = JSON.parse(read(`content/adm/m${String(n).padStart(2, '0')}-approved-complete.js`).match(/=(".*");\s*$/s)[1]);
    if (n !== 3) assert.match(html, /type="checkbox" data-adm-check="1"/, `M${n}: check funcional`);
  }
  const saved = new Map();
  const context = {
    window: data.window,
    document: { readyState: 'loading', addEventListener() {}, querySelectorAll() { return []; } },
    localStorage: {getItem: key => saved.get(key) ?? null, setItem: (key,value) => saved.set(key,value), removeItem: key => saved.delete(key)},
  };
  vm.createContext(context);
  vm.runInContext(read('content/adm/adm-native-index.js'), context);
  vm.runInContext(read('ui/adm-native-layer.js'), context);
  const uid = Object.keys(context.window.ADM_NATIVE_INDEX.modules).find(id => context.window.ADM_NATIVE_INDEX.modules[id].number === 1);
  const key = `central-v6:adm-native:${uid}:complete:session-1`;
  context.window.AdmNative.toggleSession(uid, 1, true);
  assert.equal(saved.get(key), '1');
  context.window.AdmNative.toggleSession(uid, 1, false);
  assert.equal(saved.has(key), false);
  assert.doesNotMatch(read('ui/native-reading-session.js'), /adm-session|adm-reading-check/);
});

test('quadros comparativos das 20 apostilas são tabelas legíveis e mantêm as células', () => {
  let tables = 0;
  for (let n = 1; n <= 20; n++) {
    const html = JSON.parse(read(`content/adm/m${String(n).padStart(2, '0')}-approved-complete.js`).match(/=(".*");\s*$/s)[1]);
    const count = (html.match(/<table class="adm-reading-table"/g) || []).length;
    assert.ok(count >= 10, `M${n}: tabelas comparativas presentes`);
    assert.equal((html.match(/<\/table>/g) || []).length, count, `M${n}: todas as tabelas fechadas`);
    tables += count;
  }
  assert.equal(tables, 366);
  const m04 = JSON.parse(read('content/adm/m04-approved-complete.js').match(/=(".*");\s*$/s)[1]);
  assert.match(m04, /<th scope="col">Ponto<\/th><th scope="col">Delegação<\/th><th scope="col">Avocação<\/th>/);
  assert.match(m04, /<td>Transfere o exercício de parte da competência para outro órgão\/titular\.<\/td>/);
  const m12 = JSON.parse(read('content/adm/m12-approved-complete.js').match(/=(".*");\s*$/s)[1]);
  assert.match(m12, /<th scope="col">Termo de parceria<\/th><th scope="col">Termo de colaboração<\/th>/);
});
