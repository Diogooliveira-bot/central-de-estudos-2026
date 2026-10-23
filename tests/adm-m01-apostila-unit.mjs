import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const uid = 'adm-01-01-regime-juridico-e-principios';

test('ADM M01 delivers the complete didactic booklet without broken table text', () => {
  const dom = new JSDOM('<!doctype html><body></body>', { runScripts: 'outside-only' });
  dom.window.eval(read('content/adm/m01-native-complete.js'));
  dom.window.eval(read('content/adm/m01-native-data-lite.js'));
  const data = dom.window.ADM_NATIVE_CONTENT[uid];
  const host = dom.window.document.createElement('main');
  host.innerHTML = dom.window.ADM_M01_COMPLETE_HTML + data.completeAppendHtml;

  assert.equal(host.querySelectorAll('.adm-m01-session[id^="adm-m01-s0"]').length, 6);
  assert.ok(host.querySelectorAll('.adm-m01-compare').length >= 9);
  assert.equal(host.querySelectorAll('table').length, 0);
  assert.equal(host.querySelectorAll('[data-adm-check]').length, 10);
  assert.match(host.textContent, /Regime jurídico-administrativo = prerrogativas \+ sujeições/);
  assert.match(host.textContent, /Adequação → Necessidade → Proporcionalidade/);
  assert.match(host.textContent, /Abrir Lei em Dia deste módulo/);
  const source = read('content/adm/m01-native-complete.js');
  for (const broken of ['Finalidadeo ato', 'Isonomiasituações', 'Adequaçãoo meio', 'Necessidadeexiste', 'legitimidade\/veracidadeatos', '§1ºLIMPE']) {
    assert.doesNotMatch(source, new RegExp(broken, 'i'));
  }

  const completeQuestions = host.querySelectorAll('details.question');
  assert.equal(completeQuestions.length, 10);
  assert.deepEqual(
    [...completeQuestions].map((question) => question.querySelector('.level')?.textContent),
    ['FÁCIL', 'FÁCIL', 'FÁCIL', 'FÁCIL', 'MÉDIA', 'MÉDIA', 'MÉDIA', 'MÉDIA', 'DIFÍCIL', 'DIFÍCIL']
  );

  const summary = dom.window.document.createElement('main');
  summary.innerHTML = data.summaryHtml;
  const summaryQuestions = summary.querySelectorAll('details.question');
  assert.equal(summaryQuestions.length, 5);
  assert.deepEqual([...summaryQuestions].map((question) => question.querySelector('.level')?.textContent), ['FÁCIL', 'FÁCIL', 'MÉDIA', 'MÉDIA', 'DIFÍCIL']);
  dom.window.close();
});

test('ADM M01 checklist is interactive, isolated and persistent', async () => {
  const dom = new JSDOM('<!doctype html><html><body></body></html>', {
    url: 'https://preview.example/central-v119.html', runScripts: 'outside-only'
  });
  const { window } = dom;
  window.eval(read('content/adm/adm-native-index.js'));
  window.eval(read('content/adm/m01-native-complete.js'));
  window.eval(read('content/adm/m01-native-data-lite.js'));
  window.renderDetail = () => '<div class="adm-m1"><h2>Legado</h2></div>';
  window.renderAll = () => {};
  window.renderDisciplineGrid = () => {};
  window.subjStats = () => ({});
  let lawRoute = null;
  window.openEmbeddedTool = (tool, params) => { lawRoute = { tool, params }; };
  window.CentralNativeReadingSession = {
    create() {
      const wrapper = window.document.createElement('div');
      wrapper.id = 'adm-native-reader';
      wrapper.innerHTML = '<div class="bc-native-scroll"></div>';
      window.document.body.appendChild(wrapper);
      return wrapper;
    },
    show(wrapper, content) {
      const body = wrapper.querySelector('.bc-native-scroll');
      body.innerHTML = content;
      return body;
    },
    percent() {},
    canTrack() { return true; },
    fail() {}
  };
  window.eval(read('ui/adm-native-layer.js'));

  await window.AdmNative.open(uid, 'complete', false);
  let inputs = [...window.document.querySelectorAll('[data-adm-check]')];
  assert.equal(inputs.length, 10);
  inputs[0].checked = true;
  inputs[0].dispatchEvent(new window.Event('change', { bubbles: true }));
  const key = `central-v6:adm-native:${uid}:complete:checklist`;
  assert.equal(JSON.parse(window.localStorage.getItem(key)).regimes, true);
  assert.equal(window.document.querySelector('[data-adm-check-count]').textContent, '1/10 concluídos');

  window.AdmNative.close();
  await window.AdmNative.open(uid, 'complete', false);
  inputs = [...window.document.querySelectorAll('[data-adm-check]')];
  assert.equal(inputs[0].checked, true);
  assert.equal(window.document.querySelector('[data-adm-check-count]').textContent, '1/10 concluídos');

  window.AdmNative.tool(uid, 'decorando');
  assert.equal(lawRoute.tool, 'decorando');
  assert.equal(lawRoute.params.discipline, 'adm');
  assert.equal(lawRoute.params.module, uid);
  dom.window.close();
});

test('ADM M01 responsive styles and release wiring are versioned', () => {
  const css = read('ui/adm-native-layer.css');
  const lazy = read('central-lazy-theory-v66119.js');
  const manifest = read('central-offline-files-v66172.json');
  const shell = read('central-v119.html');
  assert.match(css, /\.adm-m01-compare\{display:grid/);
  assert.match(css, /@media\(max-width:620px\)/);
  assert.match(css, /\.adm-m01-check-items input/);
  assert.match(lazy, /content\/adm\/m01-native-complete\.js\?v=20261023admm03/);
  assert.match(manifest, /m01-native-complete\.js\?v=20261023admm03/);
  assert.match(shell, /adm-native-layer\.css\?v=20261023admm03/);
});
