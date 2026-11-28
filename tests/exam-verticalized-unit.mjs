import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';

const root=path.resolve(import.meta.dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const catalog=JSON.parse(read('content/tjpb-2026-verticalized.json'));
const dataScript=read('content/tjpb-2026-verticalized.js');
const objectiveCatalog=read('ui/study-objectives-catalog-v1.js');
const objectiveRuntime=read('ui/study-objectives-v1.js');
const ux=read('ui/student-ux-core-v3.js');
const screen=read('ui/exam-verticalized-v1.js');
const goal='exam-tjpb-2026-analista-judiciaria';
const progressFiles=['content/cf','content/adm','content/civil','content/cpc','content/penal','content/cpp'];
const actualModuleSource=progressFiles.flatMap(dir=>fs.readdirSync(path.join(root,dir)).filter(file=>file.endsWith('.js')).map(file=>read(path.join(dir,file)))).join('\n');

function makeStorage(seed={}){const data=new Map(Object.entries(seed));return {getItem:key=>data.get(String(key))??null,setItem:(key,value)=>data.set(String(key),String(value)),removeItem:key=>data.delete(String(key)),key:i=>[...data.keys()][i]??null,get length(){return data.size;},data};}
function setup({user='student-1',storage=makeStorage()}={}){
 const dom=new JSDOM('<!doctype html><html><body><div id="subjects"></div><div id="disciplinesView"><div id="disciplineGrid"></div></div><div id="homeView"></div><div id="moduleView" class="hidden"></div></body></html>',{url:'https://preview.example.test/central-v119.html',runScripts:'outside-only',pretendToBeVisual:true});
 const w=dom.window; Object.defineProperty(w,'localStorage',{value:storage,configurable:true}); Object.defineProperty(w.navigator,'onLine',{value:false,configurable:true});
 w.__BASE_COMPLETA_USER_ID__=user; w.__BASE_COMPLETA_PREVIEW_GUEST__=true; w.SUBJECTS=[]; w.requestAnimationFrame=()=>0; w.cancelAnimationFrame=()=>{}; w.fetch=async()=>{throw Error('preview guest must not call APIs')};
 w.eval(ux); w.eval(objectiveCatalog); w.eval(dataScript); w.eval(objectiveRuntime); w.eval(screen);
 w.CentralStudyObjectives.setActive(goal);
 return {dom,storage,w};
}

test('transcrição tem as dez disciplinas do edital e preserva os tópicos numerados das pp. 27–29',()=>{
 assert.equal(catalog.subjects.length,10);
 assert.match(catalog.source,/edição nº 17\.456.*pp\. 27–29/);
 const titles=catalog.subjects.map(s=>s.title);
 for(const title of ['Língua Portuguesa','Ética e Gestão no Serviço Público','Noções de Informática e Proteção de Dados','Direito Constitucional','Direito Administrativo','Direito Civil e Direito do Consumidor','Direito Processual Civil','Direito Penal','Direito Processual Penal','Direitos Humanos e Tutela Coletiva']) assert.ok(titles.includes(title));
 const all=catalog.subjects.flatMap(s=>s.items);
 assert.ok(all.some(i=>i.number==='7.5'&&i.text.includes('Resoluções CNJ nº 230/2021')));
 assert.ok(all.some(i=>i.number==='12'&&i.text.includes('Lei Mariana Ferrer')));
 assert.ok(all.some(i=>i.number==='7.2'&&i.text.includes('mínimo existencial')));
 assert.equal(all.filter(i=>i.organizational).length>0,true);
 assert.ok(all.filter(i=>!i.organizational).length<all.length,'organization headings must not count as progress items');
});

test('links apontam para IDs reais já presentes no catálogo de módulos',()=>{
 const ids=new Set(catalog.subjects.flatMap(s=>s.items.flatMap(i=>i.moduleIds||[])));
 assert.ok(ids.size>0);
 for(const id of ids) assert.ok(actualModuleSource.includes(id),`module id ${id} not found in existing discipline data`);
 const missing=catalog.subjects.flatMap(s=>s.items).filter(i=>i.coverage==='preparation');
 assert.ok(missing.length>0);
 assert.ok(catalog.subjects.find(s=>s.id==='tjp-ethics').items.every(i=>i.coverage==='preparation'));
});

test('tela abre no objetivo TJPB, oferece três marcações e calcula avanço sem títulos',()=>{
 const {dom,w}=setup();
 assert.equal(w.CentralExamVerticalized.open(),true);
 const counted=catalog.subjects.flatMap(s=>s.items.filter(i=>!i.organizational));
 assert.equal(w.CentralExamVerticalized.overall(),0);
 const item=counted[0];
 const inputs=w.document.querySelectorAll(`[data-exam-topic="${item.id}"]`);
 assert.equal(inputs.length,3);
 inputs[0].click();
 assert.equal(w.CentralExamVerticalized.getState()[item.id].studied.value,true);
 assert.equal(w.document.querySelector(`[data-exam-topic-row="${item.id}"] [data-exam-marker="studied"]`).checked,true);
 assert.equal(w.document.querySelectorAll('.exam-topic-heading').length,catalog.subjects.flatMap(s=>s.items).filter(i=>i.organizational).length);
 assert.ok(w.CentralExamVerticalized.overall()>0);
 assert.equal(w.localStorage.getItem(`central-v6:exam-progress:${catalog.examId}:student-1:pending`),'1');
 dom.window.close();
});

test('mensagem de sincronização sobrevive à renderização após marcar o checklist',()=>{
 const {dom,w}=setup();
 w.CentralExamVerticalized.open();
 const marker=w.document.querySelector('#examVerticalizedDialog [data-exam-marker="studied"]');
 marker.click();
 assert.match(w.document.querySelector('#examVerticalizedDialog [data-exam-sync-status]').textContent,/apenas neste navegador/);
 dom.window.close();
});

test('progresso permanece no aparelho e fica isolado por identidade do aluno',()=>{
 const storage=makeStorage(); const a=setup({user:'student-A',storage}); a.w.CentralExamVerticalized.open();
 const item=catalog.subjects.flatMap(s=>s.items).find(i=>!i.organizational);
 a.w.document.querySelector(`[data-exam-topic="${item.id}"][data-exam-marker="reviewed"]`).click();
 const saved=storage.getItem(`central-v6:exam-progress:${catalog.examId}:student-A`); assert.ok(saved);
 a.dom.window.close();
 const b=setup({user:'student-B',storage}); b.w.CentralExamVerticalized.open();
 assert.equal(b.w.CentralExamVerticalized.getState()[item.id],undefined);
 b.dom.window.close();
 const again=setup({user:'student-A',storage}); again.w.CentralExamVerticalized.open();
 assert.equal(again.w.CentralExamVerticalized.getState()[item.id].reviewed.value,true);
 again.dom.window.close();
});

test('API aplica isolamento por user_id, guarda marcações por tópico e aceita desmarcar',()=>{
 const api=read('api/objective.js');
 assert.match(api,/REFERENCES central_users\(user_id\) ON DELETE CASCADE/);
 assert.match(api,/PRIMARY KEY \(user_id, exam_id, topic_id, marker\)/);
 assert.match(api,/WHERE user_id=\$\{session\.user\.id\}/);
 assert.match(api,/completed=EXCLUDED\.completed/);
 assert.match(api,/CREATE TABLE IF NOT EXISTS central_exam_topic_progress/);
 assert.match(api,/VERCEL_ENV === 'preview'.*EXAM_PROGRESS_PREVIEW_DB_ISOLATED !== 'true'/s,'Preview without a verified isolated database must stop before SQL/session access');
 assert.match(api,/req\.query\?\.resource === 'exam-progress'/);
 assert.doesNotMatch(api,/DROP TABLE|TRUNCATE/);
});

test('Abrir módulo usa navegação nativa e expande o módulo, não apenas a disciplina',async()=>{
 const {dom,w}=setup();
 w.HTMLElement.prototype.scrollIntoView=()=>{};
 w.CentralDisciplineLoader={isReady:()=>true};
 const targets=[
  {subject:'cf',id:'w1',topic:'tjp-cf-1',attr:'data-cf'},
  {subject:'cpc',id:'cpc1',topic:'tjp-cpc-1',attr:'data-cf'},
  {subject:'penal',id:'p1',topic:'tjp-penal-1-1',attr:'data-cf'},
  {subject:'adm',id:'adm-01-01-regime-juridico-e-principios',topic:'tjp-adm-1-1',attr:'data-uid'},
 ];
 w.SUBJECTS=[...targets.map(x=>({id:x.subject})),{id:'civil'},{id:'cpp'}];
 const root=w.document.getElementById('subjects');
 for(const t of targets){
  const section=w.document.createElement('section');
  section.className='subject open';section.dataset.id=t.subject;
  section.innerHTML='<div class="subject-body"><section class="'+(t.subject==='adm'?'topic-item':'cf-module')+'" '+t.attr+'="'+t.id+'"><button class="'+(t.subject==='adm'?'open-topic':'cf-module-head')+'">Abrir</button></section></div>';
  section.querySelector('button').addEventListener('click',()=>section.querySelector('section').classList.add('open'));
  root.appendChild(section);
 }
 let civilCalled=0,cppCalled=0;
 w.CIVIL_NATIVE_INDEX={modules:[{id:'civil-m01',number:1}]};
 w.CivilNative={openModule(n){assert.equal(n,1);civilCalled++;}};
 w.CppNative={};
 w.openCppLast=id=>{assert.equal(id,'cpp-m01');cppCalled++;};
 w.jumpSubject=id=>{assert.ok(w.SUBJECTS.some(s=>s.id===id));return false;};
 w.eval(read('ui/study-navigation.js'));
 assert.equal(typeof w.CentralStudyNavigation?.openContext,'function');
 for(const t of targets){
  assert.equal(w.CentralExamVerticalized.open(),true);
  const button=w.document.querySelector('[data-exam-discipline="'+t.subject+'"][data-exam-module="'+t.id+'"]');
  assert.ok(button,'Botão de '+t.subject+' encontrado');
  button.click();
  await new Promise(resolve=>setTimeout(resolve,175));
  const module=root.querySelector('[data-id="'+t.subject+'"] ['+t.attr+'="'+t.id+'"]');
  assert.ok(module.classList.contains('open'),'Módulo '+t.id+' expandido');
 }
 for(const t of [{subject:'civil',id:'civil-m01'},{subject:'cpp',id:'cpp-m01'}]){
  assert.equal(w.CentralExamVerticalized.open(),true);
  const button=w.document.querySelector('[data-exam-discipline="'+t.subject+'"][data-exam-module="'+t.id+'"]');
  assert.ok(button,'Botão nativo de '+t.subject+' encontrado');
  button.click();
 }
 assert.equal(civilCalled,1,'Navegação invoca expansor nativo de Civil');
 assert.equal(cppCalled,1,'Navegação invoca expansor nativo de Processo Penal');
 dom.window.close();
});

test('entrada unificada abre o edital ativo preservando o checklist existente',async()=>{
 const {dom,w}=setup();
 assert.equal(await w.CentralUnifiedVertical.open(),true);
 const panel=w.document.querySelector('#examVerticalizedDialog');
 assert.equal(panel.hidden,false);
 assert.ok(panel.querySelector('.exam-unified-actions'));
 panel.querySelector('[data-exam-marker="studied"]').click();
 assert.ok(w.CentralExamVerticalized.overall()>0);
 dom.window.close();
});

test('estudo livre exibe somente as disciplinas selecionadas e progresso real',async()=>{
 const {dom,w,storage}=setup();
 storage.setItem('central-v6:free-study-subjects:v1',JSON.stringify(['cf','pt']));
 w.CentralStudyObjectives.setActive('free-study');
 w.BaseCompletaProgressReportSnapshot=()=>({modules:Array.from({length:15},(_,i)=>({subjectId:'cf',pct:i===0?100:0}))});
 assert.equal(await w.CentralUnifiedVertical.open(),true);
 const panel=w.document.querySelector('#unifiedVerticalDialog');
 assert.deepEqual([...panel.querySelectorAll('details.exam-subject')].map(x=>x.dataset.examSubject),['cf','pt']);
 assert.equal(panel.querySelectorAll('[data-exam-subject="cf"] .exam-topic').length,15);
 assert.match(panel.querySelector('[data-exam-subject="cf"] .exam-topic').textContent,/Concluído/);
 assert.equal(panel.querySelectorAll('input[type=checkbox]').length,0,'sem duplicar progresso real');
 dom.window.close();
});

test('concurso de catálogo usa assuntos reais, só liga módulos aprovados e mantém marcações separadas',async()=>{
 const {dom,w,storage}=setup();
 const id='exam-catalog-exemplo-cargo-1';
 w.CentralStudyObjectives.catalog.goals[id]={id,type:'exam',title:'Concurso fictício',subjectIds:['cf']};
 w.CentralStudyObjectives.setActive(id);
 w.CentralStudyObjectives.activeContest=async()=>({status:'previsto',subjects:[{id:'d1',name:'Disciplina',centralId:'cf',syllabus:[{id:'t1',title:'<img src=x onerror=alert(1)>',links:[{status:'suggested',subjectId:'cf',moduleId:'cf-01'}]},{id:'t2',title:'Assunto dois',links:[{status:'approved',subjectId:'cf',moduleId:'cf-02'}]}]}]});
 await w.CentralUnifiedVertical.open();
 const panel=w.document.querySelector('#unifiedVerticalDialog');
 assert.equal(panel.querySelector('img'),null);
 assert.equal(panel.querySelectorAll('.exam-module-link').length,1);
 assert.match(panel.querySelector('.exam-module-link').textContent,/^M02 · /,'link único segue o mesmo padrão visual dos múltiplos');
 panel.querySelector('input').click();
 assert.match(panel.querySelector('.exam-overview').textContent,/50%/);
 assert.equal(JSON.parse(storage.getItem('central-v6:vertical-catalog:student-1:'+id))['d1:t1'].value,true);
 dom.window.close();
});


test('catálogo gera IDs estáveis e separados por disciplina para sincronização',async()=>{
 const {catalogExamTopicIds}=await import('../api/objective.js');
 const a={subjects:[{id:'a',syllabus:[{id:'x',title:'T'}]},{id:'b',syllabus:[{id:'x',title:'T'}]}]};
 assert.deepEqual([...catalogExamTopicIds(a)],['a:x','b:x']);
 const b={subjects:[{id:'a',topics:['Primeiro','Segundo']}]};
 const c={subjects:[{id:'a',topics:['Segundo','Primeiro']}]};
 assert.deepEqual([...catalogExamTopicIds(b)].sort(),[...catalogExamTopicIds(c)].sort());
});

test('leitura completa marca somente Estudei, não revisão nem questões',()=>{
 const {dom,w,storage}=setup();
 const target=catalog.subjects.find(s=>s.disciplineId==='cf').items.find(i=>i.moduleIds?.length===1&&i.moduleIds[0]==='w1');
 assert.ok(target);
 storage.setItem('central-v6:cf-native-v2',JSON.stringify({modules:{1:{completeRead:true}}}));
 w.CentralExamVerticalized.open();
 const row=w.document.querySelector('[data-exam-topic-row="'+target.id+'"]');
 assert.equal(row.querySelector('[data-exam-marker="studied"]').checked,true);
 assert.equal(row.querySelector('[data-exam-marker="reviewed"]').checked,false);
 assert.equal(row.querySelector('[data-exam-marker="questions"]').checked,false);
 storage.setItem('central-v6:cf-native-v2',JSON.stringify({modules:{1:{completeRead:false}}}));
 w.CentralExamVerticalized.close();w.CentralExamVerticalized.open();
 assert.equal(w.document.querySelector('[data-exam-topic-row="'+target.id+'"] [data-exam-marker="studied"]').checked,false);
 dom.window.close();
});
test('acertos são ponderados por questão, sem duplicar módulos nem incluir outros objetivos',()=>{
 const {dom,w,storage}=setup();
 storage.setItem('central-v6:questoes:v2',JSON.stringify({h:{'cf-m01-q1':{u:'c'},'cf-m01-q2':{u:'e'},'cf-m02-q1':{u:'c'},'pt-m01-q1':{u:'e'}}}));
 const result=w.CentralUnifiedVertical.accuracy([{subjectId:'cf',moduleId:'w1'},{subjectId:'cf',moduleId:'cf-01'},{subjectId:'cf',moduleId:'w2'}]);
 assert.equal(result.answered,3);assert.equal(result.hits,2);assert.equal(result.pct,67);
 assert.equal(w.CentralUnifiedVertical.accuracy([]).pct,null);
 dom.window.close();
});
test('dois módulos de um assunto ficam ordenados e leitura de apenas um não conclui o assunto',async()=>{
 const {dom,w,storage}=setup();
 const id='exam-catalog-exemplo-cargo-1';
 w.CentralStudyObjectives.catalog.goals[id]={id,type:'exam',title:'Concurso fictício',subjectIds:['cf']};
 w.CentralStudyObjectives.setActive(id);
 w.CentralStudyObjectives.activeContest=async()=>({status:'publicado',subjects:[{id:'d',name:'Constitucional',centralId:'cf',syllabus:[{id:'t',title:'Assunto',links:[{status:'approved',subjectId:'cf',moduleId:'cf-02'},{status:'approved',subjectId:'cf',moduleId:'cf-01'}]}]}]});
 storage.setItem('central-v6:cf-native-v2',JSON.stringify({modules:{1:{completeRead:true}}}));
 await w.CentralUnifiedVertical.open();
 const panel=w.document.querySelector('#unifiedVerticalDialog');
 assert.equal(panel.querySelector('input').checked,false);
 assert.deepEqual([...panel.querySelectorAll('.exam-module-links button')].map(b=>b.textContent.slice(0,3)),['M01','M02']);
 storage.setItem('central-v6:cf-native-v2',JSON.stringify({modules:{1:{completeRead:true},2:{completeRead:true}}}));
 await w.CentralUnifiedVertical.open();
 assert.equal(panel.querySelector('input').checked,true);
 dom.window.close();
});
