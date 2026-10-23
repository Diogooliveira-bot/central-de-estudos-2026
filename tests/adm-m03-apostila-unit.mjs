import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const uid = 'adm-03-03-atos-administrativos';

test('ADM M03 delivers the complete didactic booklet without HTML tables', () => {
  const dom = new JSDOM('<!doctype html><body></body>', { runScripts: 'outside-only' });
  dom.window.eval(read('content/adm/m03-native-complete.js'));
  dom.window.eval(read('content/adm/m03-native-data-lite.js'));
  const data = dom.window.ADM_NATIVE_CONTENT[uid];
  const host = dom.window.document.createElement('main');
  host.innerHTML = dom.window.ADM_M03_COMPLETE_HTML + data.completeAppendHtml;

  assert.equal(host.querySelectorAll('.adm-m01-session[id^="adm-m03-s"]').length, 12);
  assert.ok(host.querySelectorAll('.adm-m01-compare').length >= 8);
  assert.ok(host.querySelectorAll('.adm-m01-card-grid').length >= 10);
  assert.equal(host.querySelectorAll('table').length, 0);
  assert.equal(host.querySelectorAll('[data-adm-check]').length, 10);
  assert.match(host.textContent, /Os cinco elementos são competência, finalidade, forma, motivo e objeto/);
  assert.match(host.textContent, /Perfeição, validade, eficácia e exequibilidade são planos diferentes/);
  assert.match(host.textContent, /Art\. 54/);
  assert.match(host.textContent, /Abrir Lei em Dia deste módulo/);

  const completeQuestions = host.querySelectorAll('.adm2x-q');
  assert.equal(completeQuestions.length, 10);
  assert.deepEqual(
    [...completeQuestions].map((question) => question.dataset.difficulty),
    ['FÁCIL', 'FÁCIL', 'FÁCIL', 'FÁCIL', 'MÉDIA', 'MÉDIA', 'MÉDIA', 'MÉDIA', 'DIFÍCIL', 'DIFÍCIL']
  );
  for (const question of completeQuestions) {
    assert.equal(question.querySelectorAll('ol > li').length, 4);
    assert.ok(question.querySelector('details'));
  }

  const summary = dom.window.document.createElement('main');
  summary.innerHTML = data.summaryHtml;
  assert.equal(summary.querySelectorAll('table').length, 0);
  const summaryQuestions = summary.querySelectorAll('.adm2x-q');
  assert.equal(summaryQuestions.length, 5);
  assert.deepEqual(
    [...summaryQuestions].map((question) => question.dataset.difficulty),
    ['FÁCIL', 'FÁCIL', 'MÉDIA', 'MÉDIA', 'DIFÍCIL']
  );
  dom.window.close();
});

test('ADM M03 checklist persists independently and Lei em Dia uses the module route', async () => {
  const dom = new JSDOM('<!doctype html><html><body></body></html>', {
    url: 'https://preview.example/central-v119.html', runScripts: 'outside-only'
  });
  const { window } = dom;
  window.eval(read('content/adm/adm-native-index.js'));
  window.eval(read('content/adm/m03-native-complete.js'));
  window.eval(read('content/adm/m03-native-data-lite.js'));
  window.renderDetail = () => '<div class="adm-m3"><h2>Legado</h2></div>';
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
  assert.equal(JSON.parse(window.localStorage.getItem(key)).natureza, true);
  assert.equal(window.document.querySelector('[data-adm-check-count]').textContent, '1/10 concluídos');

  window.AdmNative.close();
  await window.AdmNative.open(uid, 'complete', false);
  inputs = [...window.document.querySelectorAll('[data-adm-check]')];
  assert.equal(inputs[0].checked, true);

  window.AdmNative.tool(uid, 'decorando');
  assert.equal(lawRoute.tool, 'decorando');
  assert.equal(lawRoute.params.discipline, 'adm');
  assert.equal(lawRoute.params.module, uid);
  dom.window.close();
});

test('ADM M03 release wiring is versioned for online and offline loading', () => {
  const lazy = read('central-lazy-theory-v66119.js');
  const manifest = read('central-offline-files-v66172.json');
  const shell = read('central-v119.html');
  const sw = read('sw.js');
  assert.match(lazy, /content\/adm\/m03-native-complete\.js\?v=20261023admm03/);
  assert.match(lazy, /ui\/adm-native-layer\.js\?v=20261023admm03/);
  assert.match(manifest, /m03-native-complete\.js\?v=20261023admm03/);
  assert.match(shell, /adm-native-layer\.css\?v=20261023admm03/);
  assert.match(sw, /20261023-adm-m01-m03-apostilas-v1/);
});
