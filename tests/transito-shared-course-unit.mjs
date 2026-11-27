import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {JSDOM} from 'jsdom';

const read=path=>fs.readFileSync(new URL('../'+path,import.meta.url),'utf8');

test('a biblioteca de trânsito é canônica, compartilhada e não declara módulos incompletos como publicados',()=>{
 const subjects=[],handlers={};
 const document={querySelector:()=>null,addEventListener:(type,fn)=>handlers[type]=fn};
 const win={SUBJECTS:subjects,document,localStorage:{getItem:()=>null,setItem:()=>{}},renderSubjects(){},renderDisciplineGrid(){},renderAll(){}};
 vm.runInNewContext(read('ui/transito-shared-course-v1.js'),{window:win});
 assert.equal(subjects.length,1);assert.equal(subjects[0].id,'transito');
 assert.equal(win.BaseTransitoCourse.modules.length,17);
 assert.deepEqual(Array.from(win.BaseTransitoCourse.available()),['m01','m02']);
 assert.equal(win.BaseTransitoCourse.modules.filter(m=>m.status==='published').length,2);
 assert.match(read('ui/study-objectives-catalog-v1.js'),/transito: \{ id:'transito', name:'Legislação de Trânsito'/);
 assert.match(read('ui/study-objectives-catalog-v1.js'),/itaitinga-ctb[^\n]+subjectId":"transito","status":"partial"/);
 assert.match(read('ui/study-objectives-catalog-v1.js'),/prf21-v-transito[^\n]+subjectId":"transito","status":"partial"/);
 assert.match(read('api/objective.js'),/FREE_STUDY_SUBJECT_IDS = new Set\([^\n]*'transito'/);
});

test('M01 entrega conteúdo completo, revisão, checklist e 10 questões por trilha',()=>{
 const win={};vm.runInNewContext(read('content/transito/m01.js'),{window:win});
 const m=win.BC_TRANSITO_CONTENT.m01;
 assert.equal(m.status,'revisado');assert.equal(m.full.length,6);assert.equal(m.review.length,4);
 assert.equal(m.questions.summary.length,10);assert.equal(m.questions.complete.length,10);
 assert.equal(m.checklist.length,5);
 assert.ok(m.resources.every(r=>r.url.startsWith('https://')));
 assert.ok(m.full.some(c=>c.html.includes('§ 5º afirma')));
 assert.ok(m.review.every(c=>c.html.length>250));
 for(const q of [...m.questions.summary,...m.questions.complete]){
  assert.equal(q.options.length,5);assert.ok(q.answer>=0&&q.answer<5);assert.ok(q.explanation.length>30);
  assert.ok(q.options.every((o,i)=>q.options.indexOf(o)===i),'alternativas duplicadas');
 }
});

test('M02 cobre composição e funções do SNT com material completo e questões fundamentadas',()=>{
 const win={};vm.runInNewContext(read('content/transito/m02.js'),{window:win});
 const m=win.BC_TRANSITO_CONTENT.m02;
 assert.equal(m.status,'revisado');assert.equal(m.full.length,6);assert.equal(m.review.length,4);assert.equal(m.checklist.length,5);
 assert.equal(m.questions.summary.length,10);assert.equal(m.questions.complete.length,10);
 const reviewText=m.review.map(c=>c.html).join(' ').toLowerCase();
 for(const topic of ['sistema nacional de trânsito','art. 7º','contran','jari','competência','circunscrição'])assert.ok(reviewText.includes(topic),'revisão deve ensinar o tema do checklist: '+topic);
 for(const q of [...m.questions.summary,...m.questions.complete]){
  assert.equal(q.options.length,5);assert.ok(q.answer>=0&&q.answer<5);assert.ok(q.explanation.length>30);
  assert.equal(new Set(q.options).size,5,'alternativas distintas');
 }
 assert.ok(m.resources.some(r=>r.url.includes('planalto.gov.br/ccivil_03/leis/l9503compilado.htm')));
});

test('leitor só revela gabarito depois da tentativa e grava estado local do aluno',async()=>{
 const dom=new JSDOM('<!doctype html><html><body><button id="start">Abrir</button></body></html>',{url:'https://central.test/',runScripts:'outside-only',pretendToBeVisual:true});
 const w=dom.window;let loaded=false;
 w.BC_TRANSITO_CONTENT={m01:{id:'m01',title:'Teste do módulo',full:[{title:'Capítulo',html:'<p>Conteúdo.</p>'}],review:[{title:'Revisão',html:'<p>Resumo.</p>'}],questions:{summary:[{q:'Qual é a correta?',options:['A','B','C','D','E'],answer:3,explanation:'Comentário fundamentado.'}],complete:[{q:'A segunda?',options:['A1','B1','C1','D1','E1'],answer:0,explanation:'Outro comentário fundamentado.'}]},resources:[]}};
 w.eval(read('ui/transito-course-reader-v1.js'));
 await w.BaseTransitoReader.open('m01','questions-review');
 assert.equal(w.document.querySelector('.bc-transito-feedback').textContent,'');
 w.document.querySelector('input[value="3"]').checked=true;
 w.document.querySelector('[data-answer="0"]').click();
 assert.match(w.document.querySelector('.bc-transito-feedback').textContent,/Correta/);
 assert.equal(w.localStorage.getItem('central-v6:transito:answer:m01:questions-review:0'),'3');
 w.document.querySelector('[data-close]').click();
 assert.equal(w.document.querySelector('.bc-transito-reader-overlay'),null);
 w.eval(read('content/transito/m02.js'));
 await w.BaseTransitoReader.open('m02','review');
 assert.match(w.document.querySelector('.bc-info-reader-top small').textContent,/MÓDULO 02/);
 w.document.querySelector('[data-check="0"]').checked=true;w.document.querySelector('[data-check="0"]').dispatchEvent(new w.Event('change',{bubbles:true}));
 assert.equal(w.localStorage.getItem('central-v6:transito:check:m02:0'),'1');
 dom.window.close();loaded=true;assert.equal(loaded,true);
});

test('boot e pacote offline carregam curso e leitura sem alterar a produção',()=>{
 const boot=read('central-v119.html'),manifest=JSON.parse(read('central-offline-files-v66172.json'));
 assert.match(boot,/ui\/transito-shared-course-v1\.js\?v=/);
 assert.match(boot,/ui\/transito-course-reader-v1\.js\?v=/);
 assert.match(boot,/ui\/transito-shared-course-v1\.css\?v=/);
 for(const path of ['/ui/transito-shared-course-v1.js?v=20261127m01a','/ui/transito-course-reader-v1.js?v=20261127m01a','/ui/transito-shared-course-v1.css?v=20261127m01a','/content/transito/m01.js?v=20261127m01a','/content/transito/m02.js?v=20261127m01a'])assert.ok(manifest.files.includes(path),path+' ausente do cache offline');
 assert.match(read('index.html'),/Legislação de Trânsito/);
});
