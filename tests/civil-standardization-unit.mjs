import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { JSDOM } from 'jsdom';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('Direito Civil: 15 módulos seguem a ordem aprovada e mantêm os acessos existentes', async () => {
  const dom = new JSDOM('<!doctype html><html class="bc-ui-v1"><body><main id="subjects"><section class="subject" data-id="civil"><div class="subject-body"></div></section></main></body></html>', { url: 'https://central.test/central-v119.html', runScripts: 'outside-only' });
  const { window } = dom;
  window.eval(read('content/civil/civil-native-index.js'));
  window.eval(read('content/civil/civil-sharing-links.js'));
  window.eval(read('ui/civil-native-study-v1.js'));
  const host = window.document.querySelector('.subject-body');
  window.CivilNative.renderInto(host);

  const modules = [...host.querySelectorAll('[data-civil-native-module]')];
  assert.equal(modules.length, 15);
  const index = window.CIVIL_NATIVE_INDEX.modules;
  assert.equal(index.length, 15);
  for (const module of modules) {
    const n = Number(module.dataset.civilNativeModule);
    const source = index.find((item) => item.number === n);
    const zone = module.querySelector('.cv-zone');
    assert.deepEqual([...zone.children].map((node) => node.matches('.cv-sharing') ? 'cv-sharing' : node.classList[0]), [
      'cv-zone-head', 'cv-progress-grid', 'cv-oriented', 'cv-cards', 'cv-panel', 'cv-sharing', 'cv-panel', 'cv-tools',
    ], `M${n}: hierarquia visual divergente.`);
    assert.equal(module.querySelectorAll('.cv-note-input').length, 1, `M${n}: card de notas não é único.`);
    assert.equal(module.querySelectorAll('.cv-rounds, input[id^="cv-ext-"]').length, 0, `M${n}: campos manuais legados visíveis.`);
    assert.equal(module.querySelector('.cv-card-complete b').textContent, 'Teoria completa');
    assert.equal(module.querySelector('.cv-card-review b').textContent, 'Versão de revisão');
    assert.equal(module.querySelector('.cv-card-infographic b').textContent, 'Infográfico');
    assert.deepEqual([...module.querySelectorAll('.cv-card-complete .cv-standard-actions button')].map((button) => button.textContent.trim()), ['Estudar conteúdo', `Resolver ${source.completeQuestions} questões`]);
    assert.deepEqual([...module.querySelectorAll('.cv-card-review .cv-standard-actions button')].map((button) => button.textContent.trim()), ['Revisar conteúdo', `Resolver ${source.summaryQuestions} questões`]);
    assert.equal(module.querySelector('.cv-card-infographic button').textContent, 'Visualizar infográfico');
    assert(module.querySelectorAll('.cv-sharing-link').length > 0, `M${n}: links TEC oficiais ausentes.`);
    assert(module.querySelector('.cv-tec-panel .cv-question-center'), `M${n}: Central de Questões inacessível.`);
  }
  assert.equal(host.querySelectorAll('.cv-sharing-link').length, 66);

  const noteKey = 'central-v6:civil-native:m01:notes:history';
  const questionKey = 'central-v6:civil-native:m01:complete:questions';
  const externalKey = 'central-v6:civil-native:external:v1';
  window.localStorage.setItem(noteKey, JSON.stringify([{ id: 1, text: 'nota antiga', at: null }]));
  window.localStorage.setItem(questionKey, JSON.stringify({ attempts: [{ score: 7, total: 10 }], current: { answers: { 0: 'B' } } }));
  window.localStorage.setItem(externalKey, JSON.stringify({ 1: [{ done: 12, correct: 9 }] }));
  window.CivilNative.renderInto(host);
  assert.equal(host.querySelector('[data-civil-native-module="1"] .cv-note').textContent.includes('nota antiga'), true);
  window.document.getElementById('cv-note-1').value = 'nova nota';
  window.CivilNative.saveNote(1);
  window.CivilNative.markModuleRead(1);
  assert.deepEqual(JSON.parse(window.localStorage.getItem(noteKey)).map((row) => row.text), ['nota antiga', 'nova nota']);
  assert.equal(JSON.parse(window.localStorage.getItem(questionKey)).attempts[0].score, 7);
  assert.equal(JSON.parse(window.localStorage.getItem(questionKey)).current.answers[0], 'B');
  assert.equal(JSON.parse(window.localStorage.getItem(externalKey))[1][0].done, 12);
  assert.equal(window.localStorage.getItem('central-v6:civil-native:m01:summary:read'), '100');
  assert.equal(window.localStorage.getItem('central-v6:civil-native:m01:complete:read'), '100');

  window.CIVIL_NATIVE_IMAGES = { m01: 'data:image/webp;base64,UklGRg==' };
  await window.CivilNative.openImage(1);
  const viewer = window.document.getElementById('civil-native-image-viewer');
  assert.equal(viewer.hidden, false);
  assert.match(window.document.getElementById('cv-img-download').download, /direito-civil-modulo-01-infografico\.webp/);
  assert.equal(window.document.getElementById('cv-img-download').href, window.CIVIL_NATIVE_IMAGES.m01);
  window.CivilNative.zoomImage(.5);
  assert.equal(viewer.dataset.zoom, '1.5');
  window.CivilNative.closeImage();
  assert.equal(viewer.hidden, true);

  const css = read('ui/civil-native-study-v1.css');
  assert(css.includes('html.bc-ui-v1 #subjects .subject[data-id="civil"] .cv-standard-card'));
  const civilOverrides = css.split('/* Direito Civil segue')[1] || '';
  assert(civilOverrides.length > 0);
  assert(!/html\.bc-ui-v1\s+(?!#subjects)/.test(civilOverrides), 'Os novos estilos de Civil devem ficar limitados ao contêiner da disciplina.');
  dom.window.close();
});
