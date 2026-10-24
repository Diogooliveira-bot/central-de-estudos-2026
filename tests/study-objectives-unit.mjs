import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';
import { isSyncKey } from '../sync-local-state.js';

const root = path.resolve(import.meta.dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const catalogSource = read('ui/study-objectives-catalog-v1.js');
const uxSource = read('ui/student-ux-core-v3.js');
const objectivesSource = read('ui/study-objectives-v1.js');
const ids = ['pt','cf','adm','civil','cpc','penal','cpp','trab','ptra','rlm'];

test('objetivo usa persistência de preferência própria e não entra no snapshot de progresso', () => {
  assert.equal(isSyncKey('central-v6:study-objective:v1'), false);
  assert.equal(isSyncKey('central-v6:study-objective:pending:v1'), false);
  assert.equal(isSyncKey('central-v6:done:cf-m01'), true);
});

function makeStorage(seed = {}) {
  const data = new Map(Object.entries(seed));
  return {
    getItem(key) { return data.has(String(key)) ? data.get(String(key)) : null; },
    setItem(key, value) { data.set(String(key), String(value)); },
    removeItem(key) { data.delete(String(key)); },
    key(index) { return [...data.keys()][index] ?? null; },
    get length() { return data.size; },
    data,
  };
}

function setup(storage = makeStorage()) {
  const sections = ids.map((id) => `<article class="subject" data-id="${id}"><button class="subject-head">${id}</button></article>`).join('');
  const dom = new JSDOM(`<!doctype html><html><body><div class="topbar"><b>Central</b></div><div id="homeView"><div id="subjects">${sections}</div></div><div id="disciplinesView"><div id="disciplineGrid"><button class="disc-card">Original</button></div></div><div id="moduleView" class="hidden"></div></body></html>`, {
    url:'https://preview.example.test/central-v119.html', runScripts:'outside-only', pretendToBeVisual:true,
  });
  const { window } = dom;
  Object.defineProperty(window, 'localStorage', { value:storage, configurable:true });
  window.requestAnimationFrame = () => 0;
  window.cancelAnimationFrame = () => {};
  window.__BASE_COMPLETA_PREVIEW_GUEST__ = true;
  window.__BASE_COMPLETA_USER_ID__ = 'base-completa-preview-guest';
  window.SUBJECTS = ids.map((id) => ({ id, name:id, topics:[] }));
  window.__fetchCalls = 0;
  window.fetch = async () => { window.__fetchCalls += 1; throw new Error('Preview guest must not make account API calls'); };
  window.eval(uxSource);
  window.eval(catalogSource);
  window.eval(objectivesSource);
  return { dom, storage };
}

const settle = (window) => new Promise((resolve) => window.setTimeout(resolve, 25));
function chooseType(window, type) { window.document.querySelector(`[data-study-type="${type}"]`).click(); }
function chooseGoal(window, id) { window.document.querySelector(`[data-study-select="${id}"]`).click(); }

test('catálogo TJPB possui dez blocos oficiais e sem links fictícios para preparação', () => {
  const { dom } = setup();
  const { window } = dom;
  const entries = window.CentralStudyObjectiveCatalog.goals['exam-tjpb-2026-analista-judiciaria'].examSubjects;
  assert.equal(entries.length, 10);
  assert.deepEqual(Array.from(entries.filter((item) => item.status === 'preparation').map((item) => item.id)), ['tjp-ethics','tjp-it-data','tjp-human-rights']);
  assert.equal(entries.find((item) => item.id === 'tjp-civil-consumer').status, 'partial');
  dom.window.close();
});

test('primeiro acesso escolhe carreira, edital ou estudo livre e mantém o objetivo no armazenamento local', async () => {
  const progress = {
    'central-v6:done:cf-m01':'1',
    'central-v6:note:cf-m01':'anotação preservada',
    'central-v6:external-filter-sessions:v1':JSON.stringify({ version:1, filters:{ 'qc:123':[{ id:'s1', answered:12, correct:9 }] } }),
  };
  const { dom, storage } = setup(makeStorage(progress));
  const { window } = dom;
  await settle(window);
  assert.match(window.document.querySelector('#studyObjectiveDialog').textContent, /Como você quer estudar\?/);
  assert.equal(window.document.querySelectorAll('[data-study-type]').length, 2);
  assert.ok(window.document.querySelector('[data-study-select="free-study"]'));

  chooseType(window, 'exam');
  chooseGoal(window, 'exam-tjpb-2026-analista-judiciaria');
  await settle(window);
  assert.equal(window.CentralStudyObjectives.getActive(), 'exam-tjpb-2026-analista-judiciaria');
  assert.equal(storage.getItem('central-v6:study-objective:v1'), 'exam-tjpb-2026-analista-judiciaria');
  assert.equal(window.CentralStudentUX.subjects().length, 7);
  assert.equal(window.document.querySelectorAll('#disciplineGrid [data-study-open-subject]').length, 7);
  assert.equal(window.document.querySelectorAll('#disciplineGrid .study-objective-card--pending [data-study-open-subject]').length, 0);
  assert.equal(window.document.querySelectorAll('#disciplineGrid .study-objective-card--pending').length, 3);
  assert.match(window.document.querySelector('#disciplineGrid').textContent, /Direito do Consumidor — Em preparação/);
  assert.match(window.document.querySelector('#disciplineGrid').textContent, /módulos 11 a 17 pendente/);
  assert.equal(window.document.querySelector('#subjects [data-id="trab"]').hidden, true);
  assert.equal(window.document.querySelector('#subjects [data-id="ptra"]').hidden, true);
  assert.equal(window.document.querySelector('#studyObjectiveTopbar [data-study-objective-label]').textContent, 'TJPB 2026 · Analista');

  window.document.querySelector('#studyObjectiveTopbar button').click();
  chooseType(window, 'career');
  chooseGoal(window, 'career-tribunais-tecnico');
  await settle(window);
  assert.equal(window.CentralStudentUX.subjects().length, 8);
  assert.equal(window.document.querySelector('#subjects [data-id="trab"]').hidden, true);

  window.document.querySelector('#studyObjectiveTopbar button').click();
  chooseGoal(window, 'free-study');
  await settle(window);
  assert.equal(window.CentralStudentUX.subjects().length, 8);
  assert.equal(window.document.querySelectorAll('#disciplineGrid [data-study-open-subject]').length, 8);
  for (const [key, value] of Object.entries(progress)) assert.equal(storage.getItem(key), value);
  assert.equal(window.__fetchCalls, 0);
  await settle(window); await settle(window);
  dom.window.close();
});

test('preferência local reaparece após recriar a sessão de demonstração', async () => {
  const storage = makeStorage();
  const first = setup(storage); await settle(first.dom.window);
  chooseGoal(first.dom.window, 'free-study'); await settle(first.dom.window); await settle(first.dom.window);
  first.dom.window.close();

  const second = setup(storage); await settle(second.dom.window);
  assert.equal(second.dom.window.CentralStudyObjectives.getActive(), 'free-study');
  assert.equal(second.dom.window.document.querySelector('#studyObjectiveDialog'), null);
  await settle(second.dom.window); await settle(second.dom.window);
  second.dom.window.close();
});

test('objetivo escolhido sem conexão entra na fila e sincroniza quando a conexão volta', async () => {
  const { dom, storage } = setup();
  const { window } = dom;
  await settle(window);
  window.__BASE_COMPLETA_PREVIEW_GUEST__ = false;
  Object.defineProperty(window.navigator, 'onLine', { value:false, configurable:true });
  chooseType(window, 'career');
  chooseGoal(window, 'career-tribunais-analista');
  await settle(window);
  assert.equal(storage.getItem('central-v6:study-objective:pending:v1'), '1');

  let saved = null;
  window.fetch = async (_url, options) => { saved = JSON.parse(options.body); return { ok:true }; };
  Object.defineProperty(window.navigator, 'onLine', { value:true, configurable:true });
  window.dispatchEvent(new window.Event('online'));
  await settle(window); await settle(window);
  assert.deepEqual(saved, { objectiveId:'career-tribunais-analista' });
  assert.equal(storage.getItem('central-v6:study-objective:pending:v1'), null);
  dom.window.close();
});

