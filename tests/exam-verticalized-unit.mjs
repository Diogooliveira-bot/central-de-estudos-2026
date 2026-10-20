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
