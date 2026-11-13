import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { JSDOM } from 'jsdom';

const read=path=>readFileSync(path,'utf8');
const data={};
runInNewContext(read('content/adm/adm-native-index.js'),{window:data},{timeout:2000});
const index=data.ADM_NATIVE_INDEX;
const modules=Object.values(index.modules).sort((a,b)=>a.number-b.number);

test('todos os 20 módulos ADM possuem orientação pedagógica individual',()=>{
 assert.equal(index.moduleCount,20);
 assert.equal(modules.length,20);
 assert.deepEqual(modules.map(x=>x.number),Array.from({length:20},(_,i)=>i+1));
 const tips=new Set();
 for(const m of modules){
  assert.equal(m.learningGoals.length,3,'M'+m.number+': três metas');
  assert.ok(m.learningGoals.every(x=>typeof x==='string'&&x.length>=30),'M'+m.number+': metas detalhadas');
  assert.ok(typeof m.readingIntro==='string'&&m.readingIntro.length>55,'M'+m.number+': introdução');
  assert.ok(typeof m.studyTip==='string'&&m.studyTip.length>80,'M'+m.number+': orientação de estudo');
  assert.ok(typeof m.examPitfall==='string'&&m.examPitfall.length>75,'M'+m.number+': alerta de prova');
  assert.equal(m.learningCheck.length,2,'M'+m.number+': duas questões');
  assert.ok(m.learningCheck.every(x=>x.endsWith('?')),'M'+m.number+': questões com pergunta');
  assert.equal(m.readingFocus.length,3,'M'+m.number+': pontos de leitura');
  assert.equal(m.completeQuestions,10,'M'+m.number+': dez questões de teoria completa preservadas');
  assert.equal(m.summaryQuestions,5,'M'+m.number+': cinco questões de revisão preservadas');
  assert.ok(m.title.length>10&&m.uid.startsWith('adm-'),'M'+m.number+': identidade preservada');
  assert.ok(!tips.has(m.studyTip),'M'+m.number+': orientação não pode ser genérica');
  tips.add(m.studyTip);
 }
});

test('módulos ADM apresentam guia antes de materiais, sem alterar funcionalidades',async()=>{
 const dom=new JSDOM('<!doctype html><html><body><div id="subjects"></div></body></html>',{
  url:'https://preview.example/central-v119.html',runScripts:'outside-only'
 });
 const win=dom.window;
 win.eval(read('content/adm/adm-native-index.js'));
 win.eval(read('content/adm/adm-session-index.js'));
 win.renderDetail=()=>'<div class="adm-m1"><p>Leitura original mantida</p></div>';
 win.renderAll=()=>{};
 win.renderDisciplineGrid=()=>{};
 win.subjStats=()=>({});
 win.eval(read('ui/orientation-defaults-v1.js'));
 win.eval(read('ui/orientation-v1.js'));
 win.eval(read('ui/adm-native-layer.js'));
 await new Promise(resolve=>win.document.addEventListener('DOMContentLoaded',resolve,{once:true}));
 for(const m of modules){
  const html=win.renderDetail({id:'adm'},{uid:m.uid});
  const result=new JSDOM('<main>'+html+'</main>');
  const doc=result.window.document;
  const orient=doc.querySelector('.bc-orient');
  assert.ok(orient,'M'+m.number+': orientação curta renderizada');
  assert.equal(orient.dataset.bcOrient,'adm:'+m.number);
  assert.equal(orient.querySelectorAll('p').length,3,'M'+m.number+': foco, atenção e como estudar');
  assert.equal(doc.querySelectorAll('.adm-learning-guide,.adm-learning-panel,.adm-reading-focus,details').length,0,'M'+m.number+': sem painéis nem blocos expansíveis');
  assert.equal(doc.querySelectorAll('.adm-cf-card').length,2,'M'+m.number+': dois materiais preservados');
  assert.match(html,/Estudar conteúdo/);
  assert.match(html,/Resolver 10 questões/);
  assert.match(html,/Resolver 5 questões/);
  assert.doesNotMatch(html,/adm-session-plan|Estudar por sessão/,'M'+m.number+': "Estudar por sessão" foi retirado');
  result.window.close();
 }
 dom.window.close();
});

test('orientação ADM usa o bloco único e preserva progresso e anotações',()=>{
 const ui=read('ui/adm-native-layer.js');
 assert.match(ui,/BCOrientation\.html\('adm:'/);
 assert.ok(!ui.includes('adm-learning-panel'),'painéis antigos removidos');
 assert.match(ui,/function progress\(uid,kind\)/);
 assert.match(ui,/central-v6:adm-native:/);
});

test('índice, interface, estilos e cache offline são carregados com a versão correta',()=>{
 const loader=read('central-lazy-theory-v66119.js');
 const shell=read('central-v119.html');
 const manifest=JSON.parse(read('central-offline-files-v66172.json')).files;
 for(const name of ['content/adm/adm-native-index.js','ui/adm-native-layer.js']){
  const version=name==='ui/adm-native-layer.js'?'20261113orient1':'20261102admguide1';
  assert.ok(loader.includes(name+'?v='+version),name+' no carregador');
  assert.ok(manifest.includes('/'+name+'?v='+version),name+' no cache');
 }
 for(const name of ['central-lazy-theory-v66119.js','ui/adm-native-layer.css']){
  const version=name==='central-lazy-theory-v66119.js'?'20261113orient1':'20261102admguide1';
  assert.ok(shell.includes(name+'?v='+version),name+' no bootstrap');
  assert.ok(manifest.includes('/'+name+'?v='+version),name+' no cache');
 }
});
