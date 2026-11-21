import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');

function makeApp(){
  const store=new Map(),styles=[],dispatched=[];
  const doc={
    readyState:'loading',
    documentElement:{dataset:{}},
    head:{appendChild(node){styles.push(node)}},
    createElement(tag){return {tagName:tag,id:'',textContent:''}},
    getElementById(){return null},
    addEventListener(){},
    dispatchEvent(event){dispatched.push(event)}
  };
  const counts={render:0,grid:0,reset:0};
  const win={
    document:doc,
    localStorage:{getItem:key=>store.get(key)||null,setItem:(key,val)=>store.set(key,String(val))},
    BaseCompletaFocusNavigation:{backToSubjects(){counts.reset++}},
    renderAll(){counts.render++},
    renderDisciplineGrid(){counts.grid++}
  };
  const CustomEvent=class {constructor(type,options){this.type=type;this.detail=options?.detail}};
  vm.runInNewContext(read('ui/gmf-study-objective-v1.js'),{window:win,CustomEvent,Event:CustomEvent,console});
  return {win,doc,store,styles,dispatched,counts};
}
test('objetivo geral oculta as quatro disciplinas exclusivas da GMF',()=>{
 const {win,doc}=makeApp(),g=win.GmfStudyObjective;
 assert.equal(g.current(),'general');
 assert.equal(doc.documentElement.dataset.gmfStudyGoal,'general');
 assert.equal(g.allowsSubject('pt'),true);
 assert.equal(g.allowsSubject('civil'),true);
 assert.equal(g.allowsSubject('cpc'),true);
 for(const id of ['atual','fortaleza','legesp','dh']) assert.equal(g.allowsSubject(id),false,id);
});
test('selecionar GMF ativa somente as 11 disciplinas pertinentes e guarda a escolha',()=>{
 const {win,doc,store,counts,dispatched}=makeApp(),g=win.GmfStudyObjective;
 assert.equal(g.choose('gmf-fortaleza'),'gmf-fortaleza');
 assert.equal(g.current(),'gmf-fortaleza');
 assert.equal(store.get(g.key),'gmf-fortaleza');
 assert.equal(doc.documentElement.dataset.gmfStudyGoal,'gmf-fortaleza');
 const permitted=['pt','rlm','info','cf','adm','penal','cpp','atual','fortaleza','legesp','dh'];
 for(const id of permitted)assert.equal(g.allowsSubject(id),true,id);
 for(const id of ['civil','cpc'])assert.equal(g.allowsSubject(id),false,id);
 assert.equal(counts.render,1);assert.equal(counts.grid,1);assert.equal(counts.reset,1);
 assert.equal(dispatched[0].type,'central:study-objective-changed');
});
test('trocar objetivo não apaga progresso e não aceita valores arbitrários',()=>{
 const {win,store}=makeApp(),g=win.GmfStudyObjective;
 store.set('central-v6:gmf:m01:dh:review:read:0','1');
 g.choose('gmf-fortaleza');
 assert.equal(g.allowsSubject('dh'),true);
 g.choose('general');
 assert.equal(g.allowsSubject('dh'),false);
 assert.equal(g.allowsSubject('civil'),true);
 assert.equal(store.get('central-v6:gmf:m01:dh:review:read:0'),'1');
 g.choose('fake');
 assert.equal(g.current(),'general');
});
test('a grade e a área inicial respeitam a seleção em vez de ocultar só visualmente',()=>{
 const runtime=read('central-structural-v66119/runtime.js');
 const source=read('ui/gmf-disciplines-v1.js');
 const index=read('index.html');
 assert.match(runtime,/SUBJECTS\.filter\(s=>window\.GmfStudyObjective\?\.allowsSubject\(s\.id\)!==false\)/);
 assert.match(runtime,/window\.GmfDisciplines\?\.renderMaster\?\.\(s\.id\)/);
 assert.match(source,/renderMaster:\(id\)=>/);
 assert.match(index,/gmf-study-objective-v1\.js/);
 assert.ok(index.indexOf('gmf-study-objective-v1.js')<index.indexOf('/ui/gmf-disciplines-v1.js'));
});
test('o banco de questões e o catálogo de concursos também seguem o objetivo',()=>{
 assert.match(read('ui/questoes-area-v1.js'),/g\.GmfStudyObjective\?\.allowsSubject\(d\)!==false/);
 const catalog=read('ui/concursos-catalog-v1.js');
 assert.match(catalog,/data-contest-objective="gmf-fortaleza"/);
 assert.match(catalog,/global\.GmfStudyObjective\?\.choose/);
});
