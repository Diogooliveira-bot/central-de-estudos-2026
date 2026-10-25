import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {JSDOM} from 'jsdom';

const root=path.resolve(import.meta.dirname,'..');
const read=p=>readFileSync(path.join(root,p),'utf8');
const tjp=JSON.parse(read('content/tjpb-2026-verticalized.json'));
const trt=JSON.parse(read('content/trt8-2026-verticalized.json'));
const goalT='exam-tjpb-2026-analista-judiciaria',goalR='exam-trt8-2026-analista-judiciaria';
function setup(user='aluno-A',storage){
 const dom=new JSDOM('<!doctype html><html><body><div id="subjects"></div><div id="disciplinesView"><div id="disciplineGrid"></div></div><div id="homeView"></div><div id="moduleView" class="hidden"></div></body></html>',{url:'https://preview.example.test/central-v119.html',runScripts:'outside-only',pretendToBeVisual:true});
 const w=dom.window;
 if(storage)Object.defineProperty(w,'localStorage',{value:storage,configurable:true});
 Object.defineProperty(w.navigator,'onLine',{value:false,configurable:true});
 w.__BASE_COMPLETA_USER_ID__=user;w.__BASE_COMPLETA_PREVIEW_GUEST__=true;w.SUBJECTS=[];
 w.requestAnimationFrame=()=>0;w.cancelAnimationFrame=()=>{};
 w.fetch=async()=>{throw Error('Preview guest should never access network');};
 for(const p of ['ui/student-ux-core-v3.js','ui/study-objectives-catalog-v1.js','content/tjpb-2026-verticalized.js','content/trt8-2026-verticalized.js','ui/study-objectives-v1.js','ui/exam-verticalized-v1.js'])w.eval(read(p));
 return {dom,w};
}
function firstBy(d){return d.subjects.flatMap(s=>s.items).find(x=>!x.organizational).id;}
test('duas opções de edital independentes no catálogo',()=>{
 const {w,dom}=setup();
 assert.equal(Object.values(w.CentralStudyObjectiveCatalog.goals).filter(x=>x.type==='exam').length,2);
 assert.equal(w.CentralStudyObjectiveCatalog.goals[goalR].examSubjects.length,10);
 assert.equal(w.CentralStudyObjectiveCatalog.goals[goalT].examSubjects.length,10);
 assert.deepEqual(Object.keys(w.CentralStudyObjectiveCatalog.subjects).sort(),['pt','cf','adm','civil','cpc','penal','cpp','rlm'].sort());
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
test('TRT8 renderiza 10 disciplinas atuais, três marcadores e links exclusivamente auditados',()=>{
 const {w,dom}=setup();
 w.CentralStudyObjectives.setActive(goalR);const r=w.CentralTRT8Verticalized;
 assert.equal(r.open(),true);
 assert.equal(w.document.querySelectorAll('#trt8VerticalizedDialog .exam-subject').length,10);
 const item=w.document.querySelector('#trt8VerticalizedDialog [data-exam-topic="trt8-rlm-010"]');
 assert.ok(item);
 assert.equal(w.document.querySelectorAll('#trt8VerticalizedDialog [data-exam-topic="trt8-rlm-010"]').length,3);
 const linked=trt.subjects.flatMap(s=>s.items).filter(x=>x.moduleIds.length);
 assert.equal(linked.length,34);
 assert.equal(w.document.querySelectorAll('#trt8VerticalizedDialog [data-exam-module]').length,trt.subjects.filter(s=>!['trab','ptra'].includes(s.disciplineId)).flatMap(s=>s.items).reduce((n,i)=>n+i.moduleIds.length,0));
 assert.equal(w.document.querySelectorAll('#trt8VerticalizedDialog .exam-subject').length,10);
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
});
test('carregador e PWA incluem TRT8, não esquecem TJPB e mantêm versão do cache',()=>{
 const boot=read('central-v119.html'),manifest=JSON.parse(read('central-offline-files-v66172.json')),sw=read('sw.js');
 assert.match(boot,/content\/trt8-2026-verticalized\.js/);
 assert.match(boot,/content\/tjpb-2026-verticalized\.js/);
 assert.ok(boot.indexOf('content/trt8-2026-verticalized.js')<boot.indexOf("tag('ui/exam-verticalized-v1.js"));
 assert.ok(manifest.files.some(s=>s.includes('/content/trt8-2026-verticalized.js?v=')));
 assert.ok(manifest.files.some(s=>s.includes('/ui/study-navigation.js?v=20261023-remove-labor-disciplines-v1')));
 assert.equal(manifest.build,'20261024-premium-progressive-v2');
 assert.match(sw,/var CACHE='central-20261024-premium-progressive-v2'/);
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
test('navegação não oferece leitores das disciplinas removidas',()=>{
 const nav=read('ui/study-navigation.js');
 assert.doesNotMatch(nav,/\.bc-trabalho-module/);
 assert.match(nav,/isRemovedRecord/);
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

