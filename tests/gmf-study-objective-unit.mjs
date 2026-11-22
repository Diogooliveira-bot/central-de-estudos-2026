import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {JSDOM} from 'jsdom';

const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');

function makeApp(){
  const store=new Map(),styles=[],dispatched=[],listeners=new Map();
  const doc={
    readyState:'loading',
    documentElement:{dataset:{}},
    head:{appendChild(node){styles.push(node)}},
    createElement(tag){return {tagName:tag,id:'',textContent:''}},
    getElementById(){return null},
    addEventListener(type,fn){const list=listeners.get(type)||[];list.push(fn);listeners.set(type,list)},
    dispatchEvent(event){dispatched.push(event);for(const fn of listeners.get(event.type)||[])fn(event)}
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
 assert.equal(counts.render,0);assert.equal(counts.grid,0);assert.equal(counts.reset,1);
 assert.equal(dispatched[0].type,'central:study-objective-changed');
});
test('trocar editais no seletor principal não reconstrói toda a Central nem dispara eventos em cadeia',()=>{
 const {win,doc,counts,dispatched}=makeApp();
 doc.dispatchEvent({type:'central:study-objective-changed',detail:{objectiveId:'exam-catalog-gmf-fortaleza-monitoramento-cargo-1'}});
 assert.equal(win.GmfStudyObjective.current(),'gmf-fortaleza');
 assert.equal(counts.render,0);
 assert.equal(counts.grid,0);
 assert.equal(counts.reset,0);
 assert.equal(dispatched.length,1,'evento externo não pode ser reenviado');
 doc.dispatchEvent({type:'central:study-objective-changed',detail:{objectiveId:'exam-trt8-2026-analista-judiciaria'}});
 assert.equal(win.GmfStudyObjective.current(),'general');
 assert.equal(counts.render,0);
 assert.equal(counts.grid,0);
 assert.equal(counts.reset,0);
 assert.equal(dispatched.length,2);
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
 assert.match(runtime,/\$\('subjects'\)\.innerHTML=SUBJECTS\.map\(s=>/,'renderização original preservada');
 assert.match(read('ui/gmf-study-objective-v1.js'),/html:not\(\[data-gmf-study-goal/,'disciplinas GMF escondidas no objetivo geral');
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

test('teste real da grade GMF: a grade antiga continua intacta e GMF tem seus 11 cartões', async()=>{
 const dom=new JSDOM('<!doctype html><html><head></head><body><section id="disciplinesView"><div id="disciplineGrid"><button data-original="1">Disciplina original</button></div></section></body></html>',{url:'https://central.local/',runScripts:'outside-only',pretendToBeVisual:true});
 const w=dom.window;
 Object.defineProperty(w,'__BASE_COMPLETA_USER_ID__',{value:'student-001',configurable:true});
 w.renderAll=()=>{};
 w.renderDisciplineGrid=()=>{};
 w.renderMapaEstudos=()=>{};
 w.eval(read('ui/gmf-study-objective-v1.js'));
 w.document.dispatchEvent(new w.Event('DOMContentLoaded'));
 const old=w.document.getElementById('disciplineGrid');
 assert.equal(old.children.length,1,'a grade nativa não pode ser substituída');
 assert.equal(old.querySelector('[data-original="1"]')?.textContent,'Disciplina original');
 const extra=w.document.getElementById('gmfGoalGrid');
 assert.ok(extra,'a grade GMF deve existir como irmã da grade nativa');
 assert.equal(extra.querySelectorAll('[data-study-open-subject]').length,11);
 assert.equal(w.GmfStudyObjective.current(),'general');
 w.GmfStudyObjective.choose('gmf-fortaleza');
 assert.equal(w.document.documentElement.dataset.gmfStudyGoal,'gmf-fortaleza');
 assert.equal(old.children.length,1,'escolha GMF não modifica a lista de cursos já existente');
 assert.ok(extra.querySelector('[data-study-open-subject="fortaleza"]'));
 assert.ok(extra.querySelector('[data-study-open-subject="dh"]'));
 let opened=0, duplicate=0;
 w.BaseCompletaFocusNavigation={chooseSubject(){opened++}};
 w.openHome=()=>{};
 w.document.addEventListener('click',()=>{duplicate++});
 extra.querySelector('[data-study-open-subject="dh"]').click();
 assert.equal(opened,1,'um clique abre a disciplina somente uma vez');
 assert.equal(duplicate,0,'clique GMF não deve vazar ao navegador geral de disciplinas');
 const css=w.document.getElementById('gmf-study-objective-css').textContent;
 assert.match(css,/#disciplineGrid\{display:none!important\}/,'apenas ocultação visual em GMF');
 assert.match(css,/#gmfGoalGrid\{display:none!important\}/,'ocultar grade GMF em estudo geral');
 w.document.dispatchEvent(new w.CustomEvent('central:study-objective-changed',{detail:{objectiveId:'career-tribunais-analista'}}));
 assert.equal(w.GmfStudyObjective.current(),'general');
 w.document.dispatchEvent(new w.CustomEvent('central:study-objective-changed',{detail:{objectiveId:'exam-catalog-gmf-fortaleza-monitoramento-cargo-0'}}));
 assert.equal(w.GmfStudyObjective.current(),'gmf-fortaleza');
 dom.window.close();
});

test('a escolha de objetivo GMF não compartilha armazenamento entre duas contas',()=>{
 const script=read('ui/gmf-study-objective-v1.js');
 const keys=[];
 for(const account of ['student-001','student-002']){
  const d={readyState:'loading',documentElement:{dataset:{}},head:{appendChild(){}},createElement(){return {id:'',textContent:''}},getElementById(){return null},addEventListener(){},dispatchEvent(){}};
  const storage=new Map();
  const w={document:d,__BASE_COMPLETA_USER_ID__:account,localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},renderAll(){},renderDisciplineGrid(){},renderMapaEstudos(){}};
  new Function('window','CustomEvent','Event','console',script)(w,class{},class{},console);
  keys.push(w.GmfStudyObjective.key);
 }
 assert.notEqual(keys[0],keys[1]);
});
