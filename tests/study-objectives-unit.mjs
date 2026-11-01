// Preview V2: seleção de áreas, cargos e matérias livres com as regras atuais da Central.
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
function openArea(w,id){w.document.querySelector('[data-study-area="'+id+'"]').click()}
function chooseRole(w,id){w.document.querySelector('[data-study-role="'+id+'"]').click();w.document.querySelector('[data-study-confirm="'+id+'"]').click()}
function chooseExam(w,id){w.document.querySelector('[data-study-exams]').click();w.document.querySelector('[data-study-exam="'+id+'"]').click()}
function chooseFree(w,ids){w.document.querySelector('[data-study-free]').click();for(const id of ids)w.document.querySelector('input[name="studyFreeSubject"][value="'+id+'"]').checked=true;w.document.querySelector('[data-study-save-free]').click()}

test('catálogo TJPB possui dez blocos oficiais e sem links fictícios para preparação', () => {
  const { dom } = setup();
  const { window } = dom;
  const entries = window.CentralStudyObjectiveCatalog.goals['exam-tjpb-2026-analista-judiciaria'].examSubjects;
  assert.equal(entries.length, 10);
  assert.deepEqual(Array.from(entries.filter((item) => item.status === 'preparation').map((item) => item.id)), ['tjp-ethics','tjp-it-data','tjp-human-rights']);
  assert.equal(entries.find((item) => item.id === 'tjp-civil-consumer').status, 'partial');
  dom.window.close();
});

test('boas-vindas: áreas, cargo, edital e estudo livre',async()=>{
  const storage=makeStorage({'central-v6:done:cf-m01':'1'});
  const {dom}=setup(storage),w=dom.window;
  await settle(w);
  assert.match(w.document.querySelector('#studyObjectiveDialog').textContent,/Bem-vindo à Base Completa/);
  assert.equal(w.document.querySelectorAll('[data-study-area]').length,9);
  assert.ok(w.document.querySelector('[data-study-free]'));
  chooseExam(w,'exam-tjpb-2026-analista-judiciaria');
  await settle(w);
  assert.equal(w.CentralStudyObjectives.getActive(),'exam-tjpb-2026-analista-judiciaria');
  assert.equal(w.document.querySelectorAll('#disciplineGrid .study-objective-card--pending').length,3);
  w.CentralStudyObjectives.open();
  openArea(w,'judiciaria');
  chooseRole(w,'career-tribunais-tecnico');
  await settle(w);
  assert.equal(w.CentralStudyObjectives.getActive(),'career-tribunais-tecnico');
  w.CentralStudyObjectives.open();
  chooseFree(w,['pt','penal']);
  await settle(w);
  assert.equal(w.CentralStudyObjectives.getActive(),'free-study');
  assert.deepEqual(Array.from(w.CentralStudyObjectives.activeSubjectIds()),['pt','penal']);
  assert.equal(w.document.querySelectorAll('#disciplineGrid [data-study-open-subject]').length,2);
  assert.equal(w.document.querySelector('#subjects [data-id="adm"]').hidden,true);
  assert.equal(storage.getItem('central-v6:done:cf-m01'),'1');
  assert.equal(w.__fetchCalls,0);
  dom.window.close();
});

test('estudo livre guarda escolha local e exige pelo menos uma disciplina',async()=>{
 const storage=makeStorage();const first=setup(storage);await settle(first.dom.window);
 const w=first.dom.window;
 w.document.querySelector('[data-study-free]').click();
 w.document.querySelector('[data-study-save-free]').click();
 assert.match(w.document.querySelector('.study-form-error').textContent,/pelo menos uma/);
 w.document.querySelector('input[value="pt"]').checked=true;
 w.document.querySelector('input[value="civil"]').checked=true;
 w.document.querySelector('[data-study-save-free]').click();
 await settle(w);first.dom.window.close();
 const second=setup(storage);await settle(second.dom.window);
 assert.equal(second.dom.window.CentralStudyObjectives.getActive(),'free-study');
 assert.deepEqual(Array.from(second.dom.window.CentralStudyObjectives.activeSubjectIds()),['pt','civil']);
 assert.equal(second.dom.window.document.querySelector('#studyObjectiveDialog'),null);
 second.dom.window.close();
});

test('catálogo de carreiras usa apenas disciplinas canônicas disponíveis',()=>{
 const {dom}=setup();const c=dom.window.CentralStudyObjectiveCatalog;
 assert.equal(c.areas.length,9);
 for(const g of Object.values(c.goals))for(const id of g.subjectIds)assert.ok(c.subjects[id],g.id+': '+id);
 for(const id of ['career-policial-civil-investigador','career-guarda-municipal','career-agente-transito','career-oficial-justica'])assert.ok(c.goals[id]);
 dom.window.close();
});

test('objetivo escolhido sem conexão entra na fila e sincroniza quando a conexão volta', async () => {
  const { dom, storage } = setup();
  const { window } = dom;
  await settle(window);
  window.__BASE_COMPLETA_PREVIEW_GUEST__ = false;
  Object.defineProperty(window.navigator, 'onLine', { value:false, configurable:true });
  openArea(window,'judiciaria');
  chooseRole(window,'career-tribunais-analista');
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

