import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';

// Armazenamento local isolado por usuário (index.html). Regressão de desempenho: key(i)/length relia todo o
// armazenamento a cada chamada; com muito progresso salvo a abertura levava dezenas de segundos (O(n²)).
function load(extraKeys = 0) {
  const html = readFileSync('index.html', 'utf8');
  const a = html.indexOf('<script id="central-content-storage-fix-v6650">');
  const code = html.slice(html.indexOf('>', a) + 1, html.indexOf('</script>', a));
  const store = new Map();
  const calls = { key: 0, length: 0 };
  const native = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => { store.set(String(k), String(v)); },
    removeItem: (k) => { store.delete(k); },
    key: (i) => { calls.key++; return [...store.keys()][i] ?? null; },
    get length() { calls.length++; return store.size; },
  };
  const listeners = {};
  const window = { __BASE_COMPLETA_USER_ID__: 'u1', __BASE_COMPLETA_USER_ROLE__: 'aluno', localStorage: native, addEventListener: (n, f) => { listeners[n] = f; }, name: '' };
  for (let i = 0; i < extraKeys; i++) native.setItem('BC_USER_V1:u1:chave:' + i, String(i));
  native.setItem('BC_USER_V1:outro:chave', 'x');
  const ctx = { window, Object, String, Number, JSON, Array, Set, decodeURIComponent, encodeURIComponent };
  vm.createContext(ctx);
  vm.runInContext(code + '\n;this.__scoped = localStorage;', ctx);
  return { ls: ctx.__scoped, native, store, calls, listeners };
}
const listKeys = (ls) => { const out = []; for (let i = 0; i < ls.length; i++) out.push(ls.key(i)); return out.sort(); };

test('isola por usuário: só enxerga as próprias chaves, sem o prefixo', () => {
  const { ls } = load(3);
  assert.equal(ls.length, 3);
  assert.deepEqual(listKeys(ls), ['chave:0', 'chave:1', 'chave:2']);
  assert.equal(ls.getItem('chave:1'), '1');
  assert.equal(ls.getItem('outro'), null);
});

test('lista de chaves acompanha setItem, removeItem e clear', () => {
  const { ls, store } = load(2);
  ls.setItem('nova', '1');
  assert.deepEqual(listKeys(ls), ['chave:0', 'chave:1', 'nova']);
  ls.setItem('nova', '2'); // mesma chave: não duplica
  assert.equal(ls.length, 3);
  assert.equal(ls.getItem('nova'), '2');
  ls.removeItem('chave:0');
  assert.deepEqual(listKeys(ls), ['chave:1', 'nova']);
  ls.clear();
  assert.equal(ls.length, 0);
  assert.equal(store.has('BC_USER_V1:outro:chave'), true, 'clear não apaga dados de outro usuário');
});

test('mudança feita por outra aba (evento storage) e por fora do wrapper é percebida', () => {
  const { ls, native, listeners } = load(2);
  assert.equal(ls.length, 2);
  native.setItem('BC_USER_V1:u1:de-fora', '1'); // gravação direta no armazenamento nativo
  assert.equal(ls.length, 3, 'o total de chaves mudou: lista refeita');
  native.setItem('BC_USER_V1:u1:chave:0', 'novo-valor'); // mesmo conjunto de chaves
  listeners.storage && listeners.storage();
  assert.equal(ls.getItem('chave:0'), 'novo-valor');
});

test('varrer todas as chaves é linear: não relê o armazenamento a cada key(i)', () => {
  const { ls, calls } = load(2000);
  const before = calls.key;
  const keys = listKeys(ls);
  assert.equal(keys.length, 2000);
  // uma leitura completa (≈ 2001 chamadas de key), nunca 2000 × 2000
  assert.ok(calls.key - before < 10000, 'chamadas a key(): ' + (calls.key - before));
  // gravar chave nova no meio da varredura não obriga a reler tudo
  const mid = calls.key;
  for (let i = 0; i < 200; i++) { ls.setItem('extra:' + i, '1'); ls.key(0); }
  assert.ok(calls.key - mid < 10000, 'chamadas após gravações: ' + (calls.key - mid));
  assert.equal(ls.length, 2200);
});
