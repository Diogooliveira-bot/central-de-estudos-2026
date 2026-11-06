import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const SCRIPT = readFileSync('ui/module-quick-actions-v1.js', 'utf8');

function mount(moduleHtml) {
  const dom = new JSDOM(`<!doctype html><body><div id="appRoot"><main id="homeView" class="bc-focus-has-module">
    <section class="subject bc-focus-selected-subject"><section class="cf-module bc-focus-current-module">${moduleHtml}</section></section>
  </main></div></body>`, { runScripts: 'dangerously' });
  const { window } = dom;
  // jsdom não calcula layout: considera visível todo botão que não esteja marcado como oculto.
  Object.defineProperty(window.HTMLElement.prototype, 'offsetParent', {
    get() { return this.closest('[data-hidden]') ? null : this.ownerDocument.body; }
  });
  window.clicks = [];
  for (const fn of ['openEmbeddedTool', 'openLeiSecaEnxuta']) window[fn] = () => false;
  for (const ns of ['CivilNative', 'CfNativeStudy', 'AdmNative', 'CppNative']) window[ns] = { tool() {}, openDecorando() {} };
  window.eval(SCRIPT);
  window.BCModuleQuickActions.update();
  return window;
}
const quick = (w, key) => w.document.querySelector(`.bc-module-quickbar [data-quick="${key}"]`);
const order = w => [...w.document.querySelectorAll('.bc-module-quickbar [data-quick]')].map(b => b.dataset.quick);

const STUDY = `<button onclick="clicks.push('theory')">Estudar conteúdo</button>
  <button onclick="clicks.push('review')">Revisar conteúdo</button>
  <button onclick="clicks.push('quiz')">Resolver 10 questões</button>`;

test('ordem: teoria completa, revisão, Lei em Dia e questões', () => {
  const w = mount(STUDY + `<button onclick="clicks.push('law');CivilNative.tool(3,'decorando')">📖 Lei em Dia</button>`);
  assert.deepEqual(order(w), ['theory', 'review', 'law', 'quiz']);
  assert.equal(quick(w, 'law').querySelector('b').textContent, 'Lei em Dia');
  assert.ok(quick(w, 'theory').classList.contains('bc-module-quick-primary'));
});

test('Lei em Dia aciona o botão do próprio módulo em cada disciplina', () => {
  const variants = {
    penal: `<div class="cf-resource-box"><h4>Lei em Dia</h4><button onclick="clicks.push('law');openEmbeddedTool('decorando',{discipline:'penal',module:'pen-m03'},this)">Abrir questões deste módulo</button></div>`,
    cf: `<button class="cf-study-open" onclick="clicks.push('law');CfNativeStudy.openDecorando(3)">Abrir Lei em Dia</button>`,
    adm: `<button onclick="clicks.push('law');AdmNative.tool('adm-m03','decorando')">📖 Lei em Dia</button>`,
    civilLegado: `<button onclick="clicks.push('law');openLeiSecaEnxuta(null,'civil','civ-m03')">📖 Lei em Dia deste módulo</button>`,
    cpc: `<button type="button" data-cpc-law onclick="clicks.push('law')">📖 Lei em Dia deste módulo</button>`
  };
  for (const [name, html] of Object.entries(variants)) {
    const w = mount(STUDY + html);
    const btn = quick(w, 'law');
    assert.ok(btn, name + ': botão Lei em Dia na barra');
    w.clicks.length = 0;
    btn.click();
    assert.deepEqual(w.clicks, ['law'], name + ': aciona o Lei em Dia do módulo');
  }
});

test('Lei em Dia oculto no rodapé do módulo continua acessível pela barra', () => {
  const w = mount(STUDY + `<div data-hidden><button onclick="clicks.push('law');CppNative.tool(2,'decorando')">📖 Lei em Dia</button></div>`);
  quick(w, 'law').click();
  assert.deepEqual(w.clicks, ['law']);
});

test('sem Lei em Dia do módulo, a barra não inventa ligação', () => {
  const w = mount(STUDY + `<button onclick="clicks.push('generic');openEmbeddedTool('decorando',{},this)">Lei em Dia</button>`);
  assert.equal(quick(w, 'law'), null);
  assert.deepEqual(order(w), ['theory', 'review', 'quiz']);
});

test('teoria completa e revisão acionam os botões originais (mesmo progresso)', () => {
  const w = mount(STUDY);
  quick(w, 'theory').click();
  quick(w, 'review').click();
  quick(w, 'quiz').click();
  assert.deepEqual(w.clicks, ['theory', 'review', 'quiz']);
});

test('barra publicada no boot e no pacote offline com a mesma versão', () => {
  const boot = readFileSync('central-v119.html', 'utf8');
  const offline = JSON.parse(readFileSync('central-offline-files-v66172.json', 'utf8')).files;
  for (const file of ['ui/module-quick-actions-v1.js', 'ui/module-quick-actions-v1.css']) {
    const m = boot.match(new RegExp(file.replace(/[.]/g, '\\.') + '\\?v=([\\w-]+)'));
    assert.ok(m, file + ' no boot');
    assert.ok(offline.includes('/' + file + '?v=' + m[1]), file + ' no offline');
  }
});
