import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const source = readFileSync('ui/tablet-scale-v1.js', 'utf8');
const css = readFileSync('ui/tablet-scale-v1.css', 'utf8');

function boot({ coarse = true, screenW = 820, screenH = 1180, portrait = true, saved = null, innerW = 1024 } = {}) {
  const dom = new JSDOM('<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' +
    '<div id="centralSettingsBackdrop"><div class="central-settings-body"><span>existente</span></div></div></body></html>',
    { url: 'https://central.test/', runScripts: 'outside-only' });
  const w = dom.window;
  const store = new Map(saved == null ? [] : [['central-v6:ui-scale:v1', String(saved)]]);
  Object.defineProperty(w, 'localStorage', { value: { getItem: k => (store.has(k) ? store.get(k) : null), setItem: (k, v) => store.set(k, String(v)), removeItem: k => store.delete(k) }, configurable: true });
  Object.defineProperty(w, 'screen', { value: { width: screenW, height: screenH }, configurable: true });
  Object.defineProperty(w, 'innerWidth', { value: innerW, configurable: true });
  w.matchMedia = q => ({ matches: q.includes('pointer:coarse') ? coarse : q.includes('orientation:portrait') ? portrait : false, addEventListener() {}, addListener() {} });
  w.eval(source);
  return { w, store, content: () => w.document.querySelector('meta[name="viewport"]').getAttribute('content') };
}

test('padrão é Automático: tablet cresce com a largura; celular e computador (meta) não mudam', () => {
  assert.equal(boot().content(), 'width=713,initial-scale=1', 'tablet 820 px em pé');
  assert.equal(boot({ portrait: false }).content(), 'width=843,initial-scale=1', 'tablet em paisagem (1180 px → 1,4)');
  assert.equal(boot({ screenW: 1024, screenH: 1366 }).content(), 'width=731,initial-scale=1', 'tablet grande (1024 px → 1,4)');
  assert.equal(boot({ screenW: 390, screenH: 844 }).content(), 'width=device-width,initial-scale=1', 'celular');
  assert.equal(boot({ coarse: false }).content(), 'width=device-width,initial-scale=1', 'computador não usa a meta viewport');
});

test('"Normal" (1) devolve a tela de antes; "Maior"/"Muito maior" valem em tablet e celular', () => {
  assert.equal(boot({ saved: 1 }).content(), 'width=device-width,initial-scale=1');
  assert.equal(boot({ saved: 1.15 }).content(), 'width=713,initial-scale=1');
  assert.equal(boot({ saved: 1.3 }).content(), 'width=631,initial-scale=1');
  assert.equal(boot({ saved: 1.15, portrait: false }).content(), 'width=1026,initial-scale=1');
  assert.equal(boot({ saved: 1.3, screenW: 390, screenH: 844 }).content(), 'width=300,initial-scale=1', 'celular em "Muito maior"');
});

test('valores desconhecidos voltam ao Automático', () => {
  assert.equal(boot({ saved: 3 }).content(), 'width=713,initial-scale=1');
  assert.equal(boot({ saved: 'abc' }).content(), 'width=713,initial-scale=1');
});

test('computador: --bc-zoom cresce com a largura da janela e "Normal" desliga', () => {
  const big = boot({ coarse: false, innerW: 1920 });
  const root = big.w.document.documentElement;
  assert.equal(root.style.getPropertyValue('--bc-zoom'), '1.35');
  assert.ok(root.classList.contains('bc-zoom-on'));
  assert.equal(root.getAttribute('data-bc-ui-scale'), '1.35');
  assert.equal(boot({ coarse: false, innerW: 1366 }).w.document.documentElement.style.getPropertyValue('--bc-zoom'), '1.25');
  assert.equal(boot({ coarse: false, innerW: 1024 }).w.document.documentElement.classList.contains('bc-zoom-on'), false, 'janela estreita: sem ampliação');
  big.w.BCUiScale.set(1);
  assert.equal(root.classList.contains('bc-zoom-on'), false);
  assert.equal(root.style.getPropertyValue('--bc-zoom'), '');
  big.w.BCUiScale.set(1.15);
  assert.equal(root.style.getPropertyValue('--bc-zoom'), '1.15', 'escolha manual vale no computador');
  assert.equal(boot({ coarse: false, innerW: 1920 }).content(), 'width=device-width,initial-scale=1');
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
  assert.equal(w.BCUiScale.get(), 0, 'valor inválido é ignorado na leitura (volta ao Automático)');
});

test('controle em Configurações aparece em todos os aparelhos, com 4 opções e botão ativo', async () => {
  const t = boot({ saved: 1.15 });
  t.w.document.querySelector('.student-more-button') || t.w.document.body.insertAdjacentHTML('beforeend', '<button class="student-more-button">Mais</button>');
  t.w.document.querySelector('.student-more-button').click();
  await new Promise(r => setTimeout(r, 140));
  const block = t.w.document.querySelector('#bcUiScale');
  assert.ok(block, 'bloco criado');
  assert.equal(block.querySelectorAll('[data-bc-ui-scale]').length, 4);
  assert.equal(block.querySelector('.is-active').getAttribute('data-bc-ui-scale'), '1.15');
  block.querySelector('[data-bc-ui-scale="1.3"]').click();
  assert.equal(t.content(), 'width=631,initial-scale=1');
  assert.equal(block.querySelector('.is-active').getAttribute('data-bc-ui-scale'), '1.3');
  block.querySelector('[data-bc-ui-scale="0"]').click();
  assert.equal(block.querySelector('.is-active').getAttribute('data-bc-ui-scale'), '0');
  assert.equal(t.content(), 'width=713,initial-scale=1', 'Automático volta ao tamanho do aparelho');
  for (const cfg of [{ screenW: 390, screenH: 844 }, { coarse: false, innerW: 1920 }]) {
    const d = boot(cfg);
    d.w.document.body.insertAdjacentHTML('beforeend', '<button class="student-more-button">Mais</button>');
    d.w.document.querySelector('.student-more-button').click();
    await new Promise(r => setTimeout(r, 140));
    assert.ok(d.w.document.querySelector('#bcUiScale'), 'celular e computador também veem o controle');
  }
});

test('carregamento: CSS e script no carregador e no cache offline; chave fora da sincronização', () => {
  const shell = readFileSync('central-v119.html', 'utf8');
  const manifest = JSON.parse(readFileSync('central-offline-files-v66172.json', 'utf8')).files;
  for (const f of ['ui/tablet-scale-v1.css', 'ui/tablet-scale-v1.js']) {
    assert.ok(shell.includes(f + '?v=20261115auto1'), f + ' no carregador');
    assert.ok(manifest.includes('/' + f + '?v=20261115auto1'), f + ' no cache offline');
  }
  assert.match(shell, /central-v6:ui-scale:v1/, 'o carregador monta a largura já na 1ª carga');
  assert.ok(shell.includes('ui/auto-scale-v1.css?v=20261115auto1') && manifest.includes('/ui/auto-scale-v1.css?v=20261115auto1'), 'CSS do computador carregado e offline');
  assert.match(readFileSync('sync-local-state.js', 'utf8'), /central-v6:ui-scale/, 'preferência do aparelho não é sincronizada');
});

test('CSS de tablet só vale para toque e telas grandes, e não amplia por "zoom"', () => {
  assert.doesNotMatch(css.replace(/\/\*[\s\S]*?\*\//g, ''), /\bzoom\s*:/, 'sem CSS zoom (quebraria alturas em vh/dvh)');
  for (const block of css.match(/@media[^{]+\{/g)) {
    assert.match(block, /pointer:coarse/);
    assert.match(block, /min-height:700px/);
  }
});

test('ampliação no computador usa zoom só nos filhos das telas e do menu (altura da janela intacta)', () => {
  const auto = readFileSync('ui/auto-scale-v1.css', 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  assert.match(auto, /html\.bc-zoom-on #appRoot \.workspace > \.view > \*\s*\{\s*zoom:\s*var\(--bc-zoom\)/);
  assert.match(auto, /#centralSidebar > \*\s*\{\s*zoom:\s*var\(--bc-nav-zoom/);
  assert.ok(!/html\.bc-zoom-on\s*\{[^}]*zoom/.test(auto) && !/body\s*\{[^}]*zoom/.test(auto), 'nunca no html/body: quebraria vh/dvh');
  const js = readFileSync('ui/tablet-scale-v1.js', 'utf8');
  assert.match(js, /student-reader-active/, 'não sobrepõe a altura zero do menu na leitura em tela cheia');
});
