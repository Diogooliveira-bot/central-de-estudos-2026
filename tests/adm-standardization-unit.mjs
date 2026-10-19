import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('Direito Administrativo renders the approved module structure without dropping records', async () => {
  const dom = new JSDOM('<!doctype html><html><body><div id="subjects"></div></body></html>', {
    url: 'https://preview.example/central-v119.html', runScripts: 'outside-only'
  });
  const { window } = dom;
  const indexScript = read('content/adm/adm-native-index.js');
  window.eval(indexScript);
  window.localStorage.setItem('central-v6:module-rounds:adm-01-01-regime-juridico-e-principios', JSON.stringify([{ done: 8, correct: 6 }]));
  window.localStorage.setItem('central-v6:adm-native:adm-01-01-regime-juridico-e-principios:summary:read', '40');
  window.localStorage.setItem('central-v6:adm-01-01-regime-juridico-e-principios:notes', JSON.stringify([{ id: 1, text: 'anotação antiga', at: '2026-01-01T00:00:00.000Z' }]));
  window.renderDetail = () => '<div class="adm-m1"><h2>Teoria original</h2><p>QUESTÃO INTERNA INTACTA</p><div class="resource"><span class="resource-label">Filtro do TEC</span><a href="https://tecconcursos.com.br/cadernos/123">Filtro oficial</a></div><div class="perf-form"><input placeholder="Questões feitas"><input placeholder="Questões certas"><button>Registrar</button></div><div class="history-label">Histórico antigo</div><div class="hist">8 / 6</div></div>';
  window.renderAll = () => {};
  window.renderDisciplineGrid = () => {};
  window.subjStats = () => ({});
  window.eval(read('ui/adm-native-layer.js'));
  await new Promise((resolve) => window.document.addEventListener('DOMContentLoaded', resolve, { once: true }));
  const uid = 'adm-01-01-regime-juridico-e-principios';
  const html = window.renderDetail({ id: 'adm' }, { uid });
  const result = new JSDOM(`<main>${html}</main>`);
  const doc = result.window.document;
  const zone = doc.querySelector('[data-adm-native]');
  assert.ok(zone);
  assert.deepEqual([...zone.querySelectorAll('.adm-cf-card > b')].map((x) => x.textContent), ['Teoria completa', 'Versão de revisão', 'Infográfico']);
  assert.equal(zone.querySelectorAll('.adm-native-notes').length, 1);
  assert.ok(zone.querySelector('.adm-cf-scheduled-review'));
  assert.equal(zone.querySelectorAll('[data-kind="complete"] .adm-cf-quiz').length, 1);
  assert.match(zone.querySelector('[data-kind="complete"] .adm-cf-quiz').textContent, /10 questões/);
  assert.match(zone.querySelector('[data-kind="summary"] .adm-cf-quiz').textContent, /5 questões/);
  for (const legacyLabel of ['Filtro do TEC deste módulo', 'Registrar questões externas', 'Questões feitas', 'Questões certas']) assert.doesNotMatch(html, new RegExp(legacyLabel));
  const readerLegacy = window.ADM_NATIVE_LEGACY[uid];
  assert.match(readerLegacy, /QUESTÃO INTERNA INTACTA/);
  assert.doesNotMatch(readerLegacy, /perf-form|Filtro do TEC|Histórico antigo/);
  assert.equal(JSON.parse(window.localStorage.getItem(`central-v6:${uid}:notes`))[0].text, 'anotação antiga');
  assert.equal(JSON.parse(window.localStorage.getItem(`central-v6:module-rounds:${uid}`))[0].done, 8);
  assert.equal(window.localStorage.getItem(`central-v6:adm-native:${uid}:summary:read`), '40');
  assert.equal(Object.keys(window.ADM_NATIVE_INDEX.modules).length, 20);
  assert.ok(Object.values(window.ADM_NATIVE_INDEX.modules).every((module) => module.summaryQuestions === 5 && module.completeQuestions === 10 && module.spriteHeight > 0));
  dom.window.close();
  result.window.close();
});
