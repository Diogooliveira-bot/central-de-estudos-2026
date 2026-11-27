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
  assert.equal(isSyncKey('central-v6:selected-contests:v1'), false);
  assert.equal(isSyncKey('central-v6:free-study-subjects:v1'), false);
  assert.equal(isSyncKey('central-v6:ui-scale:v1'), false, 'tamanho da tela é do aparelho, não do progresso');
  assert.equal(isSyncKey('central-v6:done:cf-m01'), true);
});

test('alternar entre dois editais preserva histórico compartilhado e seleção simultânea', async () => {
  const storage=makeStorage({'central-v6:done:cf-m01':'1'});
  const {dom}=setup(storage), w=dom.window;
  await settle(w);
  const first='exam-tjpb-2026-analista-judiciaria', second='exam-trt8-2026-analista-judiciaria';
  assert.equal(w.CentralStudyObjectives.setActive(first),true);
  assert.equal(w.CentralStudyObjectives.setActive(second),true);
  assert.deepEqual(Array.from(w.CentralStudyObjectives.selectedContestIds()),[first,second]);
  assert.equal(w.CentralStudyObjectives.getActive(),second);
  assert.equal(storage.getItem('central-v6:done:cf-m01'),'1');
  await w.CentralStudyObjectives.toggleContest(first);
  assert.deepEqual(Array.from(w.CentralStudyObjectives.selectedContestIds()),[second]);
  assert.equal(storage.getItem('central-v6:done:cf-m01'),'1');
  dom.window.close();
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
  const dom = new JSDOM(`<!doctype html><html><body><div class="topbar"><b>Central</b></div><div id="homeView"><div id="subjects">${sections}</div></div><div id="disciplinesView"><div id="disciplineGrid"><button class="disc-card">Original</button></div></div><div id="moduleView" class="hidden"></div><div id="centralSettingsBackdrop" class="hidden"><section class="central-settings"><div class="central-settings-body"><div class="central-appearance-heading"><h3>Aparência</h3></div></div></section></div></body></html>`, {
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
function openArea(w,id){if(w.document.querySelector('[data-study-careers]'))w.document.querySelector('[data-study-careers]').click();w.document.querySelector('[data-study-area="'+id+'"]').click()}
function chooseRole(w,id){w.document.querySelector('[data-study-role="'+id+'"]').click();w.document.querySelector('[data-study-confirm="'+id+'"]').click()}
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

test('boas-vindas: três caminhos diretos, carreira e editais em telas separadas',async()=>{
  const storage=makeStorage({'central-v6:done:cf-m01':'1'});
  const {dom}=setup(storage),w=dom.window;
  await settle(w);
  assert.match(w.document.querySelector('#studyObjectiveDialog').textContent,/Bem-vindo à Base Completa/);
  assert.equal(w.document.querySelectorAll('.study-start-choice').length,3);
  const free=w.document.querySelector('[data-study-free]');
  assert.ok(free);
  assert.ok(free.compareDocumentPosition(w.document.querySelector('[data-study-careers]')) & 4,'Estudo livre vem primeiro');
  assert.equal(w.document.querySelectorAll('[data-study-area],[data-study-exam]').length,0,'detalhes ficam no caminho escolhido');
  w.document.querySelector('[data-study-exams]').click();
  assert.equal(w.document.querySelectorAll('[data-study-exam]').length,4,'GMF, PRF, TJPA e TJAL ficam à vista');
  assert.equal(w.document.querySelector('[data-study-exam-request]'),null,'sem pedido ou listagem extra na seleção simplificada');
  w.document.querySelector('[data-study-back]').click();
  w.document.querySelector('[data-study-careers]').click();
  assert.equal(w.document.querySelectorAll('[data-study-area]').length,7);
  assert.equal(w.document.querySelector('#studyObjectiveTopbar'),null);
  const settings=w.document.querySelector('#studySettingsObjective');
  assert.ok(settings);
  assert.match(settings.textContent,/Alterar objetivo/);
  assert.doesNotMatch(w.document.querySelector('#studyObjectiveDialog').textContent,/estudar por um edital já cadastrado/i);
  // O catálogo de editais já existente continua disponível para objetivos previamente salvos.
  w.CentralStudyObjectives.setActive('exam-tjpb-2026-analista-judiciaria');
  await settle(w);
  assert.equal(w.CentralStudyObjectives.getActive(),'exam-tjpb-2026-analista-judiciaria');
  assert.equal(w.document.querySelectorAll('#disciplineGrid .study-objective-card--pending').length,3);
  w.document.querySelector('#studySettingsObjective [data-settings-change-objective]').click();
  assert.ok(w.document.querySelector('#studyObjectiveDialog'));
  w.document.querySelector('[data-study-careers]').click();
  w.document.querySelector('[data-study-area="judiciaria"]').click();
  assert.equal(w.document.querySelectorAll('[data-study-exam]').length,2,'Tribunal mostra apenas TJPA e TJAL');
  w.document.querySelector('[data-study-exam="exam-tjpa-em-preparacao"]').click();
  await settle(w);
  assert.equal(w.CentralStudyObjectives.getActive(),'exam-tjpa-em-preparacao');
  w.CentralStudyObjectives.open();
  chooseFree(w,['pt','penal']);
  await settle(w);
  assert.equal(w.CentralStudyObjectives.getActive(),'free-study');
  assert.deepEqual(Array.from(w.CentralStudyObjectives.activeSubjectIds()),['pt','penal']);
  // Acesso a tudo: a escolha só destaca a trilha; nenhuma disciplina é escondida.
  assert.equal(w.document.querySelectorAll('#disciplineGrid [data-study-open-subject]').length,9);
  assert.equal(w.document.querySelector('#subjects [data-id="adm"]').hidden,false);
  assert.equal(w.document.querySelector('#subjects [data-id="adm"]').dataset.studyTrail,'0');
  assert.equal(w.document.querySelector('#subjects [data-id="pt"]').dataset.studyTrail,'1');
  assert.equal(w.CentralStudyObjectives.questionDisciplineKeys(),null,'filtros e questões de todas as disciplinas ficam liberados');
  assert.equal(storage.getItem('central-v6:done:cf-m01'),'1');
  assert.equal(w.__fetchCalls,0);
  dom.window.close();
});

test('editais antigos permanecem carregáveis e novos concursos aparecem na seleção', async () => {
  const legacyId='exam-catalog-receita-federal-autorizado-2026-cargo-1';
  const {dom}=setup(makeStorage({'central-v6:study-objective:v1':legacyId})),w=dom.window;
  w.__BASE_COMPLETA_PREVIEW_GUEST__=false;
  w.fetch=async (url) => ({ok:true,json:async () => String(url).includes('/api/concursos') ? {items:[
    {id:'receita-federal-autorizado-2026',name:'Receita Federal',status:'previsto',active:true,cargos:[{name:'Analista-Tributário'}],subjects:[],sources:[{type:'autorizacao'}]},
  ]} : {objectiveId:null}});
  await settle(w);
  assert.equal(w.CentralStudyObjectives.getActive(),legacyId,'objetivo salvo continua válido');
  w.CentralStudyObjectives.open();
  w.document.querySelector('[data-study-exams]').click();
  const options=[...w.document.querySelectorAll('[data-study-exam]')];
  assert.deepEqual(options.map(x=>x.dataset.studyExam),[
    'exam-catalog-prf-2021-policial-rodoviario-federal-cargo-1',
    'exam-catalog-gmf-fortaleza-monitoramento-cargo-1',
    'exam-tjpa-em-preparacao','exam-tjal-em-preparacao',
    'exam-catalog-receita-federal-autorizado-2026-cargo-1',
  ]);
  assert.match(w.document.querySelector('#studyObjectiveDialog').textContent,/Receita Federal/);
  options.find(x=>x.dataset.studyExam==='exam-tjal-em-preparacao').click();
  await settle(w);
  assert.equal(w.CentralStudyObjectives.getActive(),'exam-tjal-em-preparacao');
  assert.ok(w.CentralStudyObjectives.catalog.goals[legacyId],'o objetivo antigo foi preservado');
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
 assert.equal(c.areas.length,7);
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
  openArea(window,'policial');
  await settle(window);
  assert.equal(storage.getItem('central-v6:study-objective:pending:v1'), '1');

  let saved = null;
  window.fetch = async (_url, options) => { saved = JSON.parse(options.body); return { ok:true }; };
  Object.defineProperty(window.navigator, 'onLine', { value:true, configurable:true });
  window.dispatchEvent(new window.Event('online'));
  await settle(window); await settle(window);
  assert.deepEqual(saved, { objectiveId:'career-area-policial', selectedContestIds:[] });
  assert.equal(storage.getItem('central-v6:study-objective:pending:v1'), null);
  dom.window.close();
});


test('seleção do Estudo livre sincroniza entre aparelhos na conta do aluno', async () => {
  const remote = { objectiveId:null, freeSubjectIds:null };
  const writes = [];
  const original = setup(makeStorage());
  const w1 = original.dom.window;
  w1.__BASE_COMPLETA_PREVIEW_GUEST__ = false;
  w1.fetch = async (_url, options) => {
    if (options?.method === 'PUT') {
      const data = JSON.parse(options.body);
      writes.push(data);
      remote.objectiveId = data.objectiveId;
      if (data.freeSubjectIds) remote.freeSubjectIds = data.freeSubjectIds.slice();
      return { ok:true, json:async () => ({ ...remote, ok:true }) };
    }
    return { ok:true, json:async () => ({ ...remote }) };
  };
  await settle(w1);
  chooseFree(w1,['pt','civil','rlm']);
  await settle(w1);
  assert.deepEqual(writes.at(-1), { objectiveId:'free-study', selectedContestIds:[], freeSubjectIds:['pt','civil','rlm'] });
  assert.equal(remote.objectiveId,'free-study');
  assert.equal(w1.document.querySelector('#studyObjectiveTopbar'),null);
  original.dom.window.close();

  const second = setup(makeStorage());
  const w2=second.dom.window;
  w2.__BASE_COMPLETA_PREVIEW_GUEST__ = false;
  w2.fetch = async () => ({ ok:true, json:async () => ({ ...remote }) });
  await settle(w2);
  assert.equal(w2.CentralStudyObjectives.getActive(),'free-study');
  assert.deepEqual(Array.from(w2.CentralStudyObjectives.activeSubjectIds()),['pt','civil','rlm']);
  assert.equal(w2.document.querySelector('#subjects [data-id="penal"]').hidden,false);
  assert.equal(w2.document.querySelector('#subjects [data-id="penal"]').dataset.studyTrail,'0');
  assert.ok(w2.document.querySelector('#studySettingsObjective [data-settings-change-objective]'));
  second.dom.window.close();
});

test('escolha livre desconectada é enviada na volta da internet, sem limpar progresso', async () => {
  const storage=makeStorage({'central-v6:done:cf-m01':'1'});
  const {dom}=setup(storage),w=dom.window;
  await settle(w);
  w.__BASE_COMPLETA_PREVIEW_GUEST__ = false;
  Object.defineProperty(w.navigator,'onLine',{value:false,configurable:true});
  chooseFree(w,['adm','cpp']);
  await settle(w);
  assert.equal(storage.getItem('central-v6:study-objective:pending:v1'),'1');
  const submissions=[];
  w.fetch=async (_url,options) => {
    submissions.push(JSON.parse(options.body));
    return {ok:true,json:async()=>({ok:true})};
  };
  Object.defineProperty(w.navigator,'onLine',{value:true,configurable:true});
  w.dispatchEvent(new w.Event('online'));
  await settle(w);await settle(w);
  assert.deepEqual(submissions.at(-1),{objectiveId:'free-study',selectedContestIds:[],freeSubjectIds:['adm','cpp']});
  assert.equal(storage.getItem('central-v6:study-objective:pending:v1'),null);
  assert.equal(storage.getItem('central-v6:done:cf-m01'),'1');
  dom.window.close();
});

test('API do objetivo valida disciplinas, persiste JSONB e mantém dados ao mudar de carreira',()=>{
  const api=read('api/objective.js');
  assert.match(api,/free_subject_ids JSONB/);
  assert.match(api,/validFreeSubjectIds\(freeSubjectIds\)/);
  assert.match(api,/freeSubjectIds:validFreeSubjectIds/);
  assert.match(api,/CASE WHEN \$\{hasFreeSelection\}/);
  assert.match(api,/free_subject_ids=CASE WHEN/);
  assert.doesNotMatch(api,/DELETE FROM central_user_preferences/i);
});


test('as cinco áreas gerais são diretas e as outras duas apresentam somente os editais indicados', async()=>{
  for(const area of ['policial','educacao','saude','bancaria','transito']){
    const {dom}=setup(),w=dom.window;await settle(w);
    openArea(w,area);
    assert.equal(w.document.getElementById('studyObjectiveDialog'),null,area+' não abre subtema');
    assert.equal(w.CentralStudyObjectives.getActive(),w.CentralStudyObjectiveCatalog.areas.find(a=>a.id===area).objectiveId);
    dom.window.close();
  }
  for(const [area,expected] of [
    ['guarda',['exam-catalog-gmf-fortaleza-monitoramento-cargo-1']],
    ['judiciaria',['exam-tjpa-em-preparacao','exam-tjal-em-preparacao']],
  ]){
    const {dom}=setup(),w=dom.window;await settle(w);
    openArea(w,area);
    assert.deepEqual([...w.document.querySelectorAll('[data-study-exam]')].map(el=>el.dataset.studyExam),expected);
    assert.equal(w.document.querySelector('[data-study-role]'),null);
    dom.window.close();
  }
});

test('edital previsto com examSubjects vazio preserva contagem da grade e não inicia loop de mutações', async () => {
  const { dom } = setup(); const w = dom.window; await settle(w);
  const id = 'exam-catalog-gmf-fortaleza-monitoramento-cargo-1';
  w.CentralStudyObjectiveCatalog.goals[id] = {
    id, type:'exam', subjectIds:['pt','cf','info'], examSubjects:[],
  };
  const grid = w.document.getElementById('disciplineGrid');
  // Evita que uma regressão com laço infinito bloqueie o próprio executor de testes.
  grid.__studyObjectiveGridObserver?.disconnect();
  w.CentralStudyObjectives.setActive(id);
  assert.equal(w.CentralStudyObjectives.getActive(), id);
  assert.equal(grid.children.length, Object.keys(w.CentralStudyObjectiveCatalog.subjects).length);
  assert.equal(Number(grid.dataset.studyObjectiveCount), grid.children.length,
    'a assinatura da grade precisa refletir exatamente os cartões renderizados');
  dom.window.close();
});

test('carreira e edital não escondem disciplinas e Informática entra nas trilhas', async () => {
  const { dom } = setup(); const w = dom.window; await settle(w);
  const c = w.CentralStudyObjectiveCatalog;
  assert.ok(Object.values(c.goals).filter((g) => g.type === 'career').every((g) => g.subjectIds.includes('info')), 'Informática em todas as trilhas de carreira');
  assert.deepEqual(Array.from(c.areas, (a) => a.id), ['policial','guarda','educacao','saude','bancaria','judiciaria','transito']);
  w.CentralStudyObjectives.setActive('career-guarda-municipal'); await settle(w);
  const hidden = [...w.document.querySelectorAll('#subjects > .subject')].filter((s) => s.hidden || s.classList.contains('study-objective-hidden'));
  assert.equal(hidden.length, 0, 'nenhuma disciplina escondida');
  w.CentralStudyObjectives.setActive('exam-tjpb-2026-analista-judiciaria'); await settle(w);
  assert.equal([...w.document.querySelectorAll('#subjects > .subject')].filter((s) => s.hidden).length, 0);
  dom.window.close();
});

test('API: estudo livre aceita Informática e pedidos de edital são validados e exclusivos do administrador', async () => {
  const api = read('api/objective.js');
  assert.match(api, /FREE_STUDY_SUBJECT_IDS = new Set\(\[[^\]]*'info'/);
  assert.match(api, /resource === 'exam-request'/);
  assert.match(api, /resource === 'exam-requests'/);
  assert.match(api, /role !== 'admin'/, 'lista de pedidos só para administrador');
  const { cleanExamRequest, examRequestKey } = await import('../api/objective.js');
  assert.equal(cleanExamRequest('  Polícia   Civil <b>MG</b> 2027 '), 'Polícia Civil b MG /b 2027');
  assert.equal(cleanExamRequest('ab'), '');
  assert.equal(cleanExamRequest('x'.repeat(121)), '');
  assert.equal(examRequestKey('Polícia Civil — MG 2027'), examRequestKey('policia civil mg 2027'));
  const admin = read('usuarios.html');
  assert.match(admin, /id="pedidosEdital"/);
  assert.match(admin, /resource=exam-requests/);
});
