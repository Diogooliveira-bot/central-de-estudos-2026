import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const read = f => readFileSync(f, 'utf8');
const VERSION = '20261115rev1';

test('Revisão no padrão do Constitucional está carregada e no pacote offline', () => {
  const boot = read('central-v119.html');
  const offline = JSON.parse(read('central-offline-files-v66172.json')).files;
  assert.ok(boot.includes('/ui/revisao-padrao-cf-v1.css?v=' + VERSION));
  assert.ok(boot.includes("ui/revisao-padrao-cf-v1.js?v=" + VERSION));
  assert.ok(offline.includes('/ui/revisao-padrao-cf-v1.css?v=' + VERSION));
  assert.ok(offline.includes('/ui/revisao-padrao-cf-v1.js?v=' + VERSION));
  // a folha só pode ser carregada depois da aparência de leitura (papel/serifa), para não perder a cascata
  assert.ok(boot.indexOf('revisao-padrao-cf-v1.css') > boot.indexOf('/ui/mascote-v1.css'));
});

test('o padrão usa fundo branco, Inter, kicker e respeita o modo noturno', () => {
  const css = read('ui/revisao-padrao-cf-v1.css');
  assert.match(css, /--bc-reading-paper:#fff/);
  assert.match(css, /Inter/);
  assert.match(css, /BASE COMPLETA\s+\/\s+APOSTILA TEÓRICA/);
  assert.match(css, /data-bc-reading-mode="night"/);
  assert.ok(!/font-family:\s*Georgia/i.test(css), 'sem serifa no padrão de revisão');
  assert.match(css, /data-id="cpc"/);
});

test('só leitores em modo de revisão recebem a marca bc-rev-cf', () => {
  const classes = new Map();
  const mkOverlay = (label) => {
    const set = new Set();
    return { dataset: { bcLei: 'x' }, isConnected: false, classList: { contains: c => set.has(c), toggle: (c, on) => (on ? set.add(c) : set.delete(c)) }, querySelector: () => ({ textContent: label }), set };
  };
  const rev = mkOverlay('DIREITO PENAL · MÓDULO 01 · VERSÃO DE REVISÃO');
  const full = mkOverlay('DIREITO PENAL · MÓDULO 01 · TEORIA COMPLETA');
  const body = { querySelectorAll: () => [rev, full] };
  const ctx = { window: {}, document: { body, addEventListener() {} }, MutationObserver: class { observe() {} }, setTimeout() {} };
  ctx.window = ctx;
  vm.runInNewContext(read('ui/revisao-padrao-cf-v1.js'), ctx);
  ctx.BCRevisaoPadraoCF.mark(body);
  assert.ok(rev.set.has('bc-rev-cf'));
  assert.ok(!full.set.has('bc-rev-cf'));
});

test('lei seca recolhível: itens únicos, texto só ao abrir, links só https', () => {
  const ctx = { window: {}, document: { body: null, addEventListener() {} }, MutationObserver: class { observe() {} }, setTimeout() {} };
  ctx.window = ctx;
  vm.runInNewContext(read('ui/revisao-padrao-cf-v1.js'), ctx);
  const data = {
    articles: {
      'cp:1': { label: 'Código Penal — art. 1', paragraphs: ['Art. 1º Não há crime sem lei anterior.'], officialUrl: 'https://legis.senado.leg.br/x' },
      'cp:2': { label: 'Código Penal — art. 2', paragraphs: ['Art. 2º Ninguém pode ser punido.'], officialUrl: 'javascript:alert(1)' },
      'cp:3': { label: 'sem texto', paragraphs: [] },
    },
    modules: { 1: [{ key: 'cp:1' }, { key: 'cp:2' }, { key: 'cp:1' }, { key: 'cp:3' }, { key: 'cp:9' }] },
  };
  const items = ctx.BCRevisaoPadraoCF.leiItems(data, 1);
  assert.equal(JSON.stringify(items.map(i => i.key)), JSON.stringify(['cp:1', 'cp:2']));
  assert.equal(items[0].url, 'https://legis.senado.leg.br/x');
  assert.equal(items[1].url, '', 'só https');
  assert.equal(ctx.BCRevisaoPadraoCF.leiItems(data, 2).length, 0);
  const html = ctx.BCRevisaoPadraoCF.leiGroupHtml(items);
  assert.match(html, /Ver lei seca do módulo · 2 dispositivos/);
  assert.ok(!html.includes('Não há crime'), 'o texto do artigo só é montado ao abrir');
  assert.ok(!/<details[^>]*\sopen/.test(html), 'tudo fechado');
});
