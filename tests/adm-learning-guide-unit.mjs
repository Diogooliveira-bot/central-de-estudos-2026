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
 win.eval(read('ui/adm-native-layer.js'));
 await new Promise(resolve=>win.document.addEventListener('DOMContentLoaded',resolve,{once:true}));
 for(const m of modules){
  const html=win.renderDetail({id:'adm'},{uid:m.uid});
  const result=new JSDOM('<main>'+html+'</main>');
  const doc=result.window.document;
  const guide=doc.querySelector('.adm-learning-guide');
  assert.ok(guide,'M'+m.number+': guia renderizado');
  assert.equal(guide.querySelectorAll('.adm-learning-goals li').length,3,'M'+m.number+': objetivos');
  assert.equal(guide.querySelectorAll('.adm-learning-check li').length,2,'M'+m.number+': autoavaliação');
  assert.equal(doc.querySelectorAll('.adm-reading-focus li').length,3,'M'+m.number+': leitura orientada');
  assert.ok(doc.querySelector('.adm-learning-tip')?.textContent.includes(m.studyTip));
  assert.ok(doc.querySelector('.adm-learning-warning')?.textContent.includes(m.examPitfall));
  assert.equal(doc.querySelectorAll('.adm-cf-card').length,3,'M'+m.number+': materiais mantidos');
  assert.match(html,/Estudar conteúdo/);
  assert.match(html,/Resolver 10 questões/);
  assert.match(html,/Resolver 5 questões/);
  assert.match(html,/adm-session-plan/);
  result.window.close();
 }
 dom.window.close();
});

test('guia responsivo respeita largura interna e blocos expansíveis',()=>{
 const css=read('ui/adm-native-layer.css');
 const ui=read('ui/adm-native-layer.js');
 assert.match(css,/container:adm-reading\/inline-size/);
 assert.match(css,/@container adm-reading \(min-width:610px\)/);
 assert.match(css,/\.adm-learning-goals,[\s\S]*?\.adm-learning-check\{grid-column:1\/-1\}/);
 assert.ok(!css.includes('.adm-cf-oriented details{margin:10px 0 0 54px}'),'Evitar alinhamento antigo dentro do guia');
 assert.match(ui,/<details class="adm-learning-panel adm-learning-check"/);
 assert.match(ui,/<details class="adm-reading-focus"/);
 assert.match(ui,/function progress\(uid,kind\)/);
 assert.match(ui,/central-v6:adm-native:/);
});

test('índice, interface, estilos e cache offline são carregados com a versão correta',()=>{
 const loader=read('central-lazy-theory-v66119.js');
 const shell=read('central-v119.html');
 const manifest=JSON.parse(read('central-offline-files-v66172.json')).files;
 for(const name of ['content/adm/adm-native-index.js','ui/adm-native-layer.js']){
  assert.ok(loader.includes(name+'?v=20261102admguide1'),name+' no carregador');
  assert.ok(manifest.includes('/'+name+'?v=20261102admguide1'),name+' no cache');
 }
 for(const name of ['central-lazy-theory-v66119.js','ui/adm-native-layer.css']){
  assert.ok(shell.includes(name+'?v=20261102admguide1'),name+' no bootstrap');
  assert.ok(manifest.includes('/'+name+'?v=20261102admguide1'),name+' no cache');
 }
});
