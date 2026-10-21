import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {JSDOM} from 'jsdom';

const root=path.resolve(import.meta.dirname,'..');
const read=p=>readFileSync(path.join(root,p),'utf8');
const tjp=JSON.parse(read('content/tjpb-2026-verticalized.json'));
const trt=JSON.parse(read('content/trt8-2026-verticalized.json'));
const technician=JSON.parse(read('content/trt8-2026-tecnico-administrativo.json'));
const goalT='exam-tjpb-2026-analista-judiciaria',goalR='exam-trt8-2026-analista-judiciaria',goalTech='exam-trt8-2026-tecnico-administrativa';
function setup(user='aluno-A',storage){
 const dom=new JSDOM('<!doctype html><html><body><div id="subjects"></div><div id="disciplinesView"><div id="disciplineGrid"></div></div><div id="homeView"></div><div id="moduleView" class="hidden"></div></body></html>',{url:'https://preview.example.test/central-v119.html',runScripts:'outside-only',pretendToBeVisual:true});
 const w=dom.window;
 if(storage)Object.defineProperty(w,'localStorage',{value:storage,configurable:true});
 Object.defineProperty(w.navigator,'onLine',{value:false,configurable:true});
 w.__BASE_COMPLETA_USER_ID__=user;w.__BASE_COMPLETA_PREVIEW_GUEST__=true;w.SUBJECTS=[];
 w.requestAnimationFrame=()=>0;w.cancelAnimationFrame=()=>{};
 w.fetch=async()=>{throw Error('Preview guest should never access network');};
 for(const p of ['ui/student-ux-core-v3.js','ui/study-objectives-catalog-v1.js','content/tjpb-2026-verticalized.js','content/trt8-2026-verticalized.js','content/trt8-2026-tecnico-administrativo.js','ui/study-objectives-v1.js','ui/exam-verticalized-v1.js'])w.eval(read(p));
 return {dom,w};
}
function firstBy(d){return d.subjects.flatMap(s=>s.items).find(x=>!x.organizational).id;}
test('três opções de edital independentes no catálogo',()=>{
 const {w,dom}=setup();
 assert.equal(Object.values(w.CentralStudyObjectiveCatalog.goals).filter(x=>x.type==='exam').length,3);
 assert.equal(w.CentralStudyObjectiveCatalog.goals[goalR].examSubjects.length,12);
 assert.equal(w.CentralStudyObjectiveCatalog.goals[goalT].examSubjects.length,10);
 assert.equal(w.CentralStudyObjectiveCatalog.goals[goalTech].examSubjects.length,11);
 assert.deepEqual(Object.keys(w.CentralStudyObjectiveCatalog.subjects).sort(),['pt','cf','adm','civil','cpc','penal','cpp','trab','ptra','rlm'].sort());
 dom.window.close();
});
test('TJPB e TRT8 têm instâncias e armazenamento separados sem apagar o legado undefined',()=>{
 const {w,dom}=setup();
 const t=w.CentralExamVerticalized,r=w.CentralTRT8Verticalized;
 assert.ok(t&&r);
 w.CentralStudyObjectives.setActive(goalT);assert.equal(r.open(),false);assert.equal(t.open(),true);
 const firstT=firstBy(tjp);
 w.document.querySelector('[data-exam-topic="'+firstT+'"][data-exam-marker="studied"]').click();
 assert.equal(w.localStorage.getItem('central-v6:exam-progress:undefined:aluno-A:pending'),'1');
 w.CentralStudyObjectives.setActive(goalR);
 assert.equal(t.open(),false);assert.equal(r.open(),true);
 assert.equal(r.overall(),0);
 const firstR=firstBy(trt);
 w.document.querySelector('[data-exam-topic="'+firstR+'"][data-exam-marker="reviewed"]').click();
 assert.equal(w.localStorage.getItem('central-v6:exam-progress:trt8-2026-aj-area-judiciaria:aluno-A:pending'),'1');
 assert.ok(r.getState()[firstR]?.reviewed.value);
 w.CentralStudyObjectives.setActive(goalT);
 assert.equal(t.open(),true);
 assert.ok(t.getState()[firstT]?.studied.value);
 dom.window.close();
});
test('TRT8 renderiza 12 disciplinas, três marcadores e links exclusivamente auditados',()=>{
 const {w,dom}=setup();
 w.CentralStudyObjectives.setActive(goalR);const r=w.CentralTRT8Verticalized;
 assert.equal(r.open(),true);
 assert.equal(w.document.querySelectorAll('#trt8VerticalizedDialog .exam-subject').length,12);
 const item=w.document.querySelector('#trt8VerticalizedDialog [data-exam-topic="trt8-rlm-010"]');
 assert.ok(item);
 assert.equal(w.document.querySelectorAll('#trt8VerticalizedDialog [data-exam-topic="trt8-rlm-010"]').length,3);
 const linked=trt.subjects.flatMap(s=>s.items).filter(x=>x.moduleIds.length);
 assert.equal(linked.length,34);
 assert.equal(w.document.querySelectorAll('#trt8VerticalizedDialog [data-exam-module]').length,39);
 assert.equal(w.document.querySelectorAll('#trt8VerticalizedDialog .exam-subject').length,12);
 assert.equal(r.overall(),0);
 dom.window.close();
});
test('API valida edital e lista de assuntos antes de gravar, sem misturar alunos',()=>{
 const source=read('api/objective.js'),allow=read('lib/exam-progress-topic-ids.js');
 assert.match(source,/req\.query\?\.examId === undefined \? DEFAULT_EXAM_ID/);
 assert.match(source,/Object\.hasOwn\(EXAM_TOPIC_SETS,EXAM_ID\)/);
 assert.match(source,/!topicIds\.has\(change\.topicId\)/);
 assert.match(source,/WHERE user_id=\$\{session\.user\.id\} AND exam_id=\$\{EXAM_ID\}/);
 assert.match(source,/PRIMARY KEY \(user_id, exam_id, topic_id, marker\)/);
 assert.doesNotMatch(source,/TRUNCATE|DROP TABLE/);
 assert.match(allow,/tjp-2026-aj-area-judiciaria/);
 assert.match(allow,/trt8-2026-aj-area-judiciaria/);
 assert.match(allow,/trt8-2026-tecnico-administrativa-21/);
});
test('carregador e PWA incluem TRT8, não esquecem TJPB e mantêm versão do cache',()=>{
 const boot=read('central-v119.html'),manifest=JSON.parse(read('central-offline-files-v66172.json')),sw=read('sw.js');
 assert.match(boot,/content\/trt8-2026-verticalized\.js/);
 assert.match(boot,/content\/trt8-2026-tecnico-administrativo\.js/);
 assert.match(boot,/content\/tjpb-2026-verticalized\.js/);
 assert.ok(boot.indexOf('content/trt8-2026-verticalized.js')<boot.indexOf("tag('ui/exam-verticalized-v1.js"));
 assert.ok(manifest.files.some(s=>s.includes('/content/trt8-2026-verticalized.js?v=')));
 assert.ok(manifest.files.some(s=>s.includes('/ui/study-navigation.js?v=20261021multiexam2')));
 assert.equal(manifest.build,'20261021-multiexam-tech21-v1');
 assert.match(sw,/var CACHE='central-20261021-multiexam-tech21-v1'/);
});
test('vínculos do TRT8 são reais e sem alegações de cobertura total',()=>{
 const bySubject=Object.fromEntries(trt.subjects.map(s=>[s.id,s]));
 assert.equal(trt.subjects.length,12);
 assert.equal(trt.subjects.reduce((n,s)=>n+s.items.length,0),300);
 assert.equal(trt.subjects.reduce((n,s)=>n+s.items.filter(i=>i.moduleIds.length).length,0),34);
 assert.ok(trt.subjects.every(s=>s.items.every(i=>i.coverage!=='complete')));
 assert.ok(Object.values(bySubject).filter(s=>!s.disciplineId).every(s=>s.items.every(i=>!i.moduleIds.length)));
 assert.match(bySubject['trt8-leg'].originalProgram,/Resolução TRT8 nº 065\/2025 alterada pela Resolução TRT8 nº 23\/2026/);
});
test('navegação admite módulo nativo de Direito do Trabalho',()=>{
 const nav=read('ui/study-navigation.js');
 assert.match(nav,/moduleSelector = '[^']*\.bc-trabalho-module'/);
 assert.match(nav,/\.bc-trabalho-module-head'/);
});

test('RLM usa IDs nativos Mnn e o JS publicado reflete a última auditoria',()=>{
 const runtime=read('ui/rlm-native-v1.js'),nav=read('ui/study-navigation.js');
 const js=read('content/trt8-2026-verticalized.js');
 const browser={};(new Function('window',js))(browser);
 const json=trt.subjects.find(s=>s.id==='trt8-rlm').items.flatMap(i=>i.moduleIds);
 const published=browser.TRT82026Verticalized.subjects.find(s=>s.id==='trt8-rlm').items.flatMap(i=>i.moduleIds);
 assert.deepEqual(json,['M07','M09','M12','M14','M15','M13']);
 assert.deepEqual(published,json);
 assert.match(runtime,/data-rlm-module=/);
 assert.match(nav,/'data-rlm-module'/);
});

test('cargo 21 da FCC tem 11 disciplinas e 176 assuntos com retificação sem vínculos não auditados',()=>{
 assert.equal(technician.examId,'trt8-2026-tecnico-administrativa-21');
 assert.equal(technician.cargoCode,'21');
 assert.equal(technician.subjects.length,11);
 assert.equal(technician.subjects.filter(x=>x.group==='general').length,6);
 assert.equal(technician.subjects.filter(x=>x.group==='specific').length,5);
 assert.equal(technician.itemsCount,176);
 assert.equal(new Set(technician.subjects.flatMap(s=>s.items.map(i=>i.id))).size,176);
 assert.equal(technician.curatedLinkedTopics,91);
 assert.equal(technician.curatedModuleDestinations,114);
 assert.equal(technician.subjects.flatMap(s=>s.items).filter(i=>!i.moduleIds.length).length,85);
 assert.ok(technician.subjects.every(s=>s.items.every(i=>i.coverage!=='complete')));
 assert.ok(technician.subjects.filter(s=>!s.disciplineId).every(s=>s.items.every(i=>!i.moduleIds.length)));
 assert.ok(technician.subjects.flatMap(s=>s.items).filter(i=>i.moduleIds.length).every(i=>i.moduleEvidence?.length===i.moduleIds.length&&i.mappingStatus==='thematic_title_matched_content_review_pending'));
 assert.ok(technician.subjects.flatMap(s=>s.items).every(i=>i.moduleIds.length||i.mappingStatus==='pending_content_review'));
 assert.ok(technician.subjects.find(s=>s.id.endsWith('-leg')).originalProgram.includes('TRT8 nº 065/2025 alterada pela Resolução TRT8 nº 23/2026'));
});
test('TRT8 técnico e analista possuem telas e estados separados',()=>{
 const {w,dom}=setup();
 assert.ok(w.CentralTRT8TecnicoVerticalized);
 w.CentralStudyObjectives.setActive(goalTech);
 assert.equal(w.CentralTRT8TecnicoVerticalized.open(),true);
 assert.equal(w.CentralTRT8Verticalized.open(),false);
 assert.equal(w.document.querySelectorAll('#trt8TecnicoVerticalizedDialog .exam-subject').length,11);
 assert.equal(w.document.querySelectorAll('#trt8TecnicoVerticalizedDialog [data-exam-module]').length,114);
 assert.equal(w.document.querySelectorAll('#trt8TecnicoVerticalizedDialog .exam-topic small').length,176);
 assert.match(w.document.getElementById('trt8TecnicoVerticalizedDialog').textContent,/Técnico Judiciário/);
 const item=technician.subjects[0].items[0];
 w.document.querySelector('[data-exam-topic="'+item.id+'"][data-exam-marker="studied"]').click();
 assert.ok(w.localStorage.getItem('central-v6:exam-progress:trt8-2026-tecnico-administrativa-21:aluno-A:pending'));
 w.CentralStudyObjectives.setActive(goalR);assert.equal(w.CentralTRT8Verticalized.open(),true);
 assert.equal(w.CentralTRT8Verticalized.overall(),0);
 w.CentralStudyObjectives.setActive(goalTech);assert.equal(w.CentralTRT8TecnicoVerticalized.open(),true);
 assert.equal(w.CentralTRT8TecnicoVerticalized.getState()[item.id].studied.value,true);
 dom.window.close();
});

test('Processo do Trabalho vincula módulos com número verdadeiro do leitor nativo (1 a 21)',()=>{
 const native=read('content/ptra/ptra-native-index.js'),navigation=read('ui/study-navigation.js');
 const parsed=(new Function('window',native+';return window.PTRA_NATIVE_INDEX;'))({});
 const validNumbers=new Set(parsed.modules.map(m=>String(m.number)));
 const ptra=technician.subjects.find(s=>s.id==='trt8-tec-21-ptra');
 assert.equal(ptra.items.filter(i=>i.moduleIds.length).length,12);
 assert.ok(ptra.items.flatMap(i=>i.moduleIds).every(x=>validNumbers.has(x)));
 assert.match(read('ui/ptra-native-study-v1.js'),/data-ptra-module=/);
 assert.match(navigation,/\.ptra-native-mod/);
 assert.match(navigation,/'data-ptra-module'/);
 assert.match(navigation,/\.ptra-native-mod-head'/);
 const warningItems=ptra.items.filter(i=>i.moduleEvidence?.some(e=>e.warning));
 assert.ok(warningItems.length>=1);
 assert.ok(warningItems.every(i=>i.coverage==='partial'));
});
test('RLM, Constitucional, Administrativo e Trabalho referenciam módulos válidos',()=>{
 const runtime=read('central-structural-v66119/runtime.js');
 assert.match(runtime,/const SUBJECTS=/);
 const match=runtime.match(/const SUBJECTS=(\[[\s\S]*?\]);\s*\n/);
 assert.ok(match);
 const modules=JSON.parse(match[1]);
 const sourceIds=Object.fromEntries(modules.filter(s=>['cf','rlm','adm','trab'].includes(s.id)).map(s=>[s.id,new Set(s.topics.map(t=>s.id==='cf'?t.studyUrl.match(/week=(w\d+)/)?.[1]:s.id==='rlm'?t.title.match(/M\d\d/)?.[0]:t.uid))]));
 for(const subj of technician.subjects.filter(s=>sourceIds[s.disciplineId])){
   for(const item of subj.items)for(const id of item.moduleIds)assert.ok(sourceIds[subj.disciplineId].has(id),item.id+' apontou para módulo ausente '+id);
 }
});
