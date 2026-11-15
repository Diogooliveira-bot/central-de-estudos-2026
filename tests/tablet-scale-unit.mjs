import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const source = readFileSync('ui/tablet-scale-v1.js', 'utf8');
const css = readFileSync('ui/tablet-scale-v1.css', 'utf8');

function boot({ coarse = true, screenW = 820, screenH = 1180, portrait = true, saved = null } = {}) {
  const dom = new JSDOM('<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' +
    '<div id="centralSettingsBackdrop"><div class="central-settings-body"><span>existente</span></div></div></body></html>',
    { url: 'https://central.test/', runScripts: 'outside-only' });
  const w = dom.window;
  const store = new Map(saved == null ? [] : [['central-v6:ui-scale:v1', String(saved)]]);
  Object.defineProperty(w, 'localStorage', { value: { getItem: k => (store.has(k) ? store.get(k) : null), setItem: (k, v) => store.set(k, String(v)), removeItem: k => store.delete(k) }, configurable: true });
  Object.defineProperty(w, 'screen', { value: { width: screenW, height: screenH }, configurable: true });
  w.matchMedia = q => ({ matches: q.includes('pointer:coarse') ? coarse : q.includes('orientation:portrait') ? portrait : false, addEventListener() {}, addListener() {} });
  w.eval(source);
  return { w, store, content: () => w.document.querySelector('meta[name="viewport"]').getAttribute('content') };
}

test('padrão é Normal: a meta viewport original não muda em nenhum aparelho', () => {
  assert.equal(boot().content(), 'width=device-width,initial-scale=1');
  assert.equal(boot({ coarse: false }).content(), 'width=device-width,initial-scale=1');
});

test('tablet com "Maior"/"Muito maior" reduz a largura da página (retrato e paisagem)', () => {
  assert.equal(boot({ saved: 1.15 }).content(), 'width=713,initial-scale=1');
  assert.equal(boot({ saved: 1.3 }).content(), 'width=631,initial-scale=1');
  assert.equal(boot({ saved: 1.15, portrait: false }).content(), 'width=1026,initial-scale=1');
});

test('celular, computador e valores desconhecidos nunca são ampliados', () => {
  assert.equal(boot({ saved: 1.3, screenW: 390, screenH: 844 }).content(), 'width=device-width,initial-scale=1', 'celular');
  assert.equal(boot({ saved: 1.3, coarse: false }).content(), 'width=device-width,initial-scale=1', 'computador com mouse');
  assert.equal(boot({ saved: 3 }).content(), 'width=device-width,initial-scale=1', 'valor fora da lista');
  assert.equal(boot({ saved: 'abc' }).content(), 'width=device-width,initial-scale=1');
});

test('set() grava só opções válidas e volta ao normal', () => {
  const { w, store, content } = boot();
  w.BCUiScale.set(1.15);
  assert.equal(store.get('central-v6:ui-scale:v1'), '1.15');
  assert.equal(content(), 'width=713,initial-scale=1');
  assert.equal(w.document.documentElement.getAttribute('data-bc-ui-scale'), '1.15');
  w.BCUiScale.set(1);
  assert.equal(content(), 'width=device-width,initial-scale=1');
  w.BCUiScale.set(7);
  assert.equal(w.BCUiScale.get(), 1, 'valor inválido é ignorado na leitura');
});

test('controle em Configurações aparece só no tablet, com 3 opções e botão ativo', async () => {
  const t = boot({ saved: 1.15 });
  t.w.document.querySelector('.student-more-button') || t.w.document.body.insertAdjacentHTML('beforeend', '<button class="student-more-button">Mais</button>');
  t.w.document.querySelector('.student-more-button').click();
  await new Promise(r => setTimeout(r, 140));
  const block = t.w.document.querySelector('#bcUiScale');
  assert.ok(block, 'bloco criado');
  assert.equal(block.querySelectorAll('[data-bc-ui-scale]').length, 3);
  assert.equal(block.querySelector('.is-active').getAttribute('data-bc-ui-scale'), '1.15');
  block.querySelector('[data-bc-ui-scale="1.3"]').click();
  assert.equal(t.content(), 'width=631,initial-scale=1');
  assert.equal(block.querySelector('.is-active').getAttribute('data-bc-ui-scale'), '1.3');
  const phone = boot({ screenW: 390, screenH: 844 });
  phone.w.document.body.insertAdjacentHTML('beforeend', '<button class="student-more-button">Mais</button>');
  phone.w.document.querySelector('.student-more-button').click();
  await new Promise(r => setTimeout(r, 140));
  assert.equal(phone.w.document.querySelector('#bcUiScale'), null, 'celular não vê o controle');
});

test('carregamento: CSS e script no carregador e no cache offline; chave fora da sincronização', () => {
  const shell = readFileSync('central-v119.html', 'utf8');
  const manifest = JSON.parse(readFileSync('central-offline-files-v66172.json', 'utf8')).files;
  for (const f of ['ui/tablet-scale-v1.css', 'ui/tablet-scale-v1.js']) {
    assert.ok(shell.includes(f + '?v=20261115tablet2'), f + ' no carregador');
    assert.ok(manifest.includes('/' + f + '?v=20261115tablet2'), f + ' no cache offline');
  }
  assert.match(shell, /central-v6:ui-scale:v1/, 'o carregador monta a largura já na 1ª carga');
  assert.match(readFileSync('sync-local-state.js', 'utf8'), /central-v6:ui-scale/, 'preferência do aparelho não é sincronizada');
});

test('CSS de tablet só vale para toque e telas grandes, e não amplia por "zoom"', () => {
  assert.doesNotMatch(css.replace(/\/\*[\s\S]*?\*\//g, ''), /\bzoom\s*:/, 'sem CSS zoom (quebraria alturas em vh/dvh)');
  for (const block of css.match(/@media[^{]+\{/g)) {
    assert.match(block, /pointer:coarse/);
    assert.match(block, /min-height:700px/);
  }
});
