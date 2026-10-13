import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import zlib from 'node:zlib';
import { JSDOM } from 'jsdom';
import { isSyncKey } from '../sync-local-state.js';

const root = path.resolve(import.meta.dirname, '..');
const source = JSON.parse(zlib.gunzipSync(Buffer.from(fs.readFileSync(path.join(root, 'portugues-autodidata-data.txt'), 'utf8').trim(), 'base64')).toString('utf8'));
const component = fs.readFileSync(path.join(root, 'ui/portuguese-activities-v1.js'), 'utf8');

function render(moduleId) {
  const dom = new JSDOM('<!doctype html><html><head></head><body><main id="reader"></main></body></html>', { url: 'https://base-completa.test/' + moduleId, runScripts: 'outside-only' });
  dom.window.__BASE_COMPLETA_USER_ID__ = 'student-a';
  dom.window.eval(component);
  const host = dom.window.document.getElementById('reader');
  host.innerHTML = source[moduleId];
  const records = dom.window.BasePortugueseActivities.enhance(host, { moduleId });
  return { dom, host, records };
}

test('todos os 24 módulos e a revisão recebem atividades com IDs únicos', () => {
  const ids = new Set();
  for (const moduleId of Object.keys(source)) {
    const { dom, host, records } = render(moduleId);
    assert.ok(records.length > 0, moduleId + ' ficou sem atividades');
    assert.equal(Number(host.dataset.ptaRecordCount), records.length);
    for (const record of records) { assert.ok(!ids.has(record.id), 'ID duplicado: ' + record.id); ids.add(record.id); }
    assert.equal(host.querySelectorAll('.pta-module-summary').length, 1);
    dom.window.close();
  }
});

test('M01 tem revelação guiada, correção objetiva e revisão ativa sem gabarito inventado', () => {
  const { dom, host, records } = render('m01');
  assert.ok(records.some(item => item.kind === 'guided' && item.answer));
  assert.ok(records.some(item => item.kind === 'mastery' && item.autoCorrect));
  assert.ok(records.some(item => item.kind === 'active' && item.status === 'missing-answer'));
  assert.ok(host.querySelector('.pta-guided:not([open])'));
  dom.window.close();
});

test('questão objetiva informa resultado e preserva o histórico', () => {
  const { dom, host } = render('m01');
  const card = [...host.querySelectorAll('.pta-question')].find(node => node.dataset.ptaAutoCorrect === 'true');
  assert.ok(card, 'nenhuma questão objetiva autocorrigível no M01');
  const option = card.querySelector('input[type=radio]'); option.checked = true;
  option.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
  card.querySelector('.pta-button').click();
  assert.equal(card.querySelector('.pta-feedback').hidden, false);
  assert.match(card.querySelector('.pta-history').textContent, /1/);
  dom.window.close();
});

test('persistência é isolada pelo usuário autenticado', () => {
  const first = render('m02');
  const card = [...first.host.querySelectorAll('.pta-question')].find(node => node.querySelector('textarea'));
  assert.ok(card);
  const id = card.dataset.ptaId;
  first.dom.window.localStorage.setItem('central-v6:exercise-progress:u:student-a:pt:v1:' + id, JSON.stringify({ text: 'resposta A' }));
  first.dom.window.__BASE_COMPLETA_USER_ID__ = 'student-b';
  assert.equal(first.dom.window.localStorage.getItem('central-v6:exercise-progress:u:student-b:pt:v1:' + id), null);
  assert.equal(isSyncKey('central-v6:exercise-progress:u:student-a:pt:v1:' + id), true);
  first.dom.window.close();
});

test('revisão cumulativa preserva e associa os 84 itens', () => {
  const { dom, records } = render('review');
  const cumulative = records.filter(item => item.kind === 'cumulative');
  assert.equal(cumulative.length, 84);
  assert.equal(cumulative.filter(item => item.status === 'associated').length, 84);
  dom.window.close();
});

test('interface exibe somente guiadas, estilo prova e revisão do módulo', () => {
  const { dom, host, records } = render('m01');
  assert.equal(records.some(item => item.kind === 'exit'), false);
  assert.equal(host.querySelectorAll('[data-pta-kind="exit"]').length, 0);
  assert.equal(host.querySelectorAll('[data-pta-source-hidden="true"]').length > 0, true);
  const labels = [...host.querySelectorAll('.pta-question-kicker span:first-child')].map(node => node.textContent);
  assert.equal(labels.length > 0, true);
  assert.ok(labels.every(label => ['Questões estilo prova', 'Questões de revisão do módulo'].includes(label)));
  dom.window.close();
});
