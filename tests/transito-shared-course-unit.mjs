import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {JSDOM} from 'jsdom';

const read=path=>fs.readFileSync(new URL('../'+path,import.meta.url),'utf8');

test('a biblioteca de trânsito é canônica, compartilhada e não declara módulos incompletos como publicados',()=>{
 const handlers={};
 const document={querySelector:()=>null,addEventListener:(type,fn)=>handlers[type]=fn};
 const win={document,localStorage:{getItem:()=>null,setItem:()=>{}},renderCount:0,renderSubjects(){this.renderCount++},renderDisciplineGrid(){}};
 const context=vm.createContext({window:win});
 vm.runInContext('const SUBJECTS=[]',context);
 vm.runInContext(read('ui/transito-shared-course-v1.js'),context);
 const subjects=vm.runInContext('SUBJECTS',context);
 assert.equal(subjects.length,1);assert.equal(subjects[0].id,'transito');
 assert.equal(win.renderCount,1,'após registrar a biblioteca, redesenha a lista inicial da Central');
 assert.equal(win.BaseTransitoCourse.modules.length,17);
 assert.deepEqual(Array.from(win.BaseTransitoCourse.available()),['m01','m02','m03','m04','m05','m06','m07','m08','m09','m10','m11' ,'m12','m13','m14']);
 assert.equal(win.BaseTransitoCourse.modules.filter(m=>m.status==='published').length,14);
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
 for(const set of [m.questions.summary,m.questions.complete]){
  const counts=Array.from({length:5},(_,i)=>set.filter(q=>q.answer===i).length);
  assert.ok(Math.max(...counts)<=3,'gabarito sem concentração artificial');
  assert.ok(set.every((q,i)=>i<2||q.answer!==set[i-1].answer||q.answer!==set[i-2].answer),'gabarito sem sequência longa previsível');
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
 for(const set of [m.questions.summary,m.questions.complete]){
  const counts=Array.from({length:5},(_,i)=>set.filter(q=>q.answer===i).length);
  assert.ok(Math.max(...counts)<=3,'gabarito sem concentração artificial');
  assert.ok(set.every((q,i)=>i<2||q.answer!==set[i-1].answer||q.answer!==set[i-2].answer),'gabarito sem sequência longa previsível');
 }
 assert.ok(m.resources.some(r=>r.url.includes('planalto.gov.br/ccivil_03/leis/l9503compilado.htm')));
});

test('M03 ensina competências por esfera e diferencia circunscrição, concorrência e matérias privativas',()=>{
 const win={};vm.runInNewContext(read('content/transito/m03.js'),{window:win});
 const m=win.BC_TRANSITO_CONTENT.m03;
 assert.equal(m.status,'revisado');assert.equal(m.full.length,6);assert.equal(m.review.length,4);assert.equal(m.checklist.length,5);
 assert.equal(m.questions.summary.length,10);assert.equal(m.questions.complete.length,10);
 const reviewText=m.review.map(c=>c.html).join(' ').toLowerCase();
 for(const topic of ['competência','circunscrição','contran','art. 24-a','vagas reservadas','convênio'])assert.ok(reviewText.includes(topic),'revisão deve ensinar o tema do checklist: '+topic);
 for(const q of [...m.questions.summary,...m.questions.complete]){
  assert.equal(q.options.length,5);assert.ok(q.answer>=0&&q.answer<5);assert.ok(q.explanation.length>35);
  assert.equal(new Set(q.options).size,5,'alternativas distintas');
 }
 for(const set of [m.questions.summary,m.questions.complete]){
  const counts=Array.from({length:5},(_,i)=>set.filter(q=>q.answer===i).length);
  assert.ok(Math.max(...counts)<=3,'gabarito sem concentração artificial');
  assert.ok(set.every((q,i)=>i<2||q.answer!==set[i-1].answer||q.answer!==set[i-2].answer),'gabarito sem sequência longa previsível');
 }
 assert.ok(m.full.some(c=>c.html.includes('Lei nº 14.599/2023')));
 assert.ok(m.resources.some(r=>r.url.includes('planalto.gov.br/ccivil_03/leis/l9503compilado.htm')));
 assert.ok(m.resources.some(r=>r.url.includes('/2023/lei/l14599.htm')));
});

test('M04 cobre as normas gerais com revisão, visual didático, checklist e gabaritos auditáveis',()=>{
 const win={};vm.runInNewContext(read('content/transito/m04.js'),{window:win});
 const m=win.BC_TRANSITO_CONTENT.m04;
 assert.equal(m.status,'revisado');assert.equal(m.full.length,7);assert.equal(m.review.length,5);assert.equal(m.checklist.length,5);
 assert.equal(m.questions.summary.length,10);assert.equal(m.questions.complete.length,10);
 const reviewText=m.review.map(c=>c.html).join(' ').toLowerCase();
 for(const topic of ['preferência','ultrapassagem','cruzamento','velocidade','parada','estacionamento','luz baixa'])assert.ok(reviewText.includes(topic),'revisão deve ensinar o tema: '+topic);
 assert.match(m.review[1].html,/<svg[\s>]/,'o fluxograma acessível aparece somente na revisão');
 assert.ok(m.full.every(c=>!c.html.includes('<svg')),'conteúdo completo não recebe imagem didática');
 for(const q of [...m.questions.summary,...m.questions.complete]){
  assert.equal(q.options.length,5);assert.ok(q.answer>=0&&q.answer<5);assert.ok(q.explanation.length>35);
  assert.equal(new Set(q.options).size,5,'alternativas distintas');
 }
 for(const set of [m.questions.summary,m.questions.complete]){
  const counts=Array.from({length:5},(_,i)=>set.filter(q=>q.answer===i).length);
  assert.deepEqual(counts,[2,2,2,2,2],'gabarito equilibrado sem sequência previsível');
 }
 for(const source of ['planalto.gov.br/ccivil_03/leis/l9503compilado.htm','/2020/lei/l14071.htm','/2022/lei/l14440.htm','/2023/lei/l14599.htm'])assert.ok(m.resources.some(r=>r.url.includes(source)),source);
});

test('M05 cobre pedestres, bicicletas, ciclomotores e animais com revisão e questões auditáveis',()=>{
 const win={};vm.runInNewContext(read('content/transito/m05.js'),{window:win});
 const m=win.BC_TRANSITO_CONTENT.m05;
 assert.equal(m.status,'revisado');assert.equal(m.full.length,5);assert.equal(m.review.length,5);assert.equal(m.checklist.length,5);
 assert.equal(m.questions.summary.length,10);assert.equal(m.questions.complete.length,10);
 const reviewText=m.review.map(c=>c.html).join(' ').toLowerCase();
 for(const topic of ['pedestre','bicicleta','50 metros','perpendicularmente','preferência','ciclomotor','tração animal','arts. 69 e 70'])assert.ok(reviewText.includes(topic),'revisão deve ensinar o tema: '+topic);
 assert.match(m.review[2].html,/<svg[\s>]/,'o fluxograma está na Revisão Guiada');
 assert.ok(m.full.every(c=>!/<(?:svg|img)\b/i.test(c.html)),'Conteúdo Completo não recebe imagem didática');
 assert.equal(m.review.filter(c=>/<svg\b/i.test(c.html)).length,1,'diagrama de categorias fica exclusivamente na Revisão Guiada');
 const stems=[...m.questions.summary,...m.questions.complete].map(q=>q.q);
 assert.equal(new Set(stems).size,20,'não deve repetir enunciados');
 for(const q of [...m.questions.summary,...m.questions.complete]){
  assert.equal(q.options.length,5);assert.ok(q.answer>=0&&q.answer<5);assert.ok(q.explanation.length>35);
  assert.equal(new Set(q.options).size,5,'alternativas distintas');
 }
 for(const set of [m.questions.summary,m.questions.complete]){
  const counts=Array.from({length:5},(_,i)=>set.filter(q=>q.answer===i).length);
  assert.deepEqual(counts,[2,2,2,2,2],'gabarito equilibrado sem padrão por letra');
 }
 for(const source of ['planalto.gov.br/ccivil_03/leis/l9503compilado.htm','gov.br/transportes/pt-br/assuntos/transito/noticias-senatran/perguntas-sobre-seguranca-de-transito','gov.br/dnit/pt-br/assuntos/noticias/dnit-orienta-sobre-direitos-e-deveres-de-quem-pedala'])assert.ok(m.resources.some(r=>r.url.includes(source)),source);
});

test('M06 ensina sinalização vigente, hierarquia, checklist e questões fundamentadas',()=>{
 const win={};vm.runInNewContext(read('content/transito/m06.js'),{window:win});
 const m=win.BC_TRANSITO_CONTENT.m06;
 assert.equal(m.status,'revisado');assert.equal(m.full.length,5);assert.equal(m.review.length,5);assert.equal(m.checklist.length,5);
 assert.equal(m.questions.summary.length,10);assert.equal(m.questions.complete.length,10);
 const reviewText=m.review.map(c=>c.html).join(' ').toLowerCase();
 for(const topic of ['sinalização','art. 87','nove volumes','art. 89','insuficiente ou incorreta','obras'])assert.ok(reviewText.includes(topic),'revisão deve ensinar o tema: '+topic);
 assert.match(m.review[1].html,/<svg[\s>]/,'diagrama fica na Revisão Guiada');
 assert.ok(m.full.every(c=>!/<(?:svg|img)\b/i.test(c.html)),'Conteúdo Completo não recebe imagem didática');
 for(const q of [...m.questions.summary,...m.questions.complete]){
  assert.equal(q.options.length,5);assert.ok(q.answer>=0&&q.answer<5);assert.ok(q.explanation.length>35);
  assert.equal(new Set(q.options).size,5,'alternativas distintas');
 }
 for(const set of [m.questions.summary,m.questions.complete]){
  const counts=Array.from({length:5},(_,i)=>set.filter(q=>q.answer===i).length);
  assert.deepEqual(counts,[2,2,2,2,2],'gabarito equilibrado sem padrão por letra');
 }
 for(const source of ['planalto.gov.br/ccivil_03/leis/l9503compilado.htm','gov.br/transportes/pt-br/pt-br/assuntos/transito/conteudo-Senatran/resolucoes-contran','gov.br/transportes/pt-br/assuntos/transito/senatran/manuais-brasileiros-de-sinalizacao-de-transito'])assert.ok(m.resources.some(r=>r.url.includes(source)),source);
});

test('M07 diferencia tração, espécie e categoria e cobre limites técnicos dos veículos',()=>{
 const win={};vm.runInNewContext(read('content/transito/m07.js'),{window:win});
 const m=win.BC_TRANSITO_CONTENT.m07;
 assert.equal(m.status,'revisado');assert.equal(m.full.length,5);assert.equal(m.review.length,5);assert.equal(m.checklist.length,5);
 assert.equal(m.questions.summary.length,10);assert.equal(m.questions.complete.length,10);
 const reviewText=m.review.map(c=>c.html).join(' ').toLowerCase();
 for(const topic of ['art. 96','tração','espécie','categoria','automotor','reboque','modific','peso'])assert.ok(reviewText.includes(topic),'revisão deve ensinar o tema: '+topic);
 assert.match(m.review[0].html,/<svg[\s>]/,'quadro de classificação fica na Revisão Guiada');
 assert.ok(m.full.every(c=>!/<(?:svg|img)\b/i.test(c.html)),'Conteúdo Completo não recebe imagem didática');
 for(const q of [...m.questions.summary,...m.questions.complete]){
  assert.equal(q.options.length,5);assert.ok(q.answer>=0&&q.answer<5);assert.ok(q.explanation.length>35);
  assert.equal(new Set(q.options).size,5,'alternativas distintas');
 }
 for(const set of [m.questions.summary,m.questions.complete]){
  const counts=Array.from({length:5},(_,i)=>set.filter(q=>q.answer===i).length);
  assert.deepEqual(counts,[2,2,2,2,2],'gabarito equilibrado sem padrão por letra');
 }
 for(const source of ['planalto.gov.br/ccivil_03/leis/l9503compilado.htm','/2023/lei/l14599.htm','gov.br/transportes/pt-br/assuntos/transito/conteudo-contran/resolucoes/Resolucao10172024.pdf'])assert.ok(m.resources.some(r=>r.url.includes(source)),source);
});

test('M08 ensina registro, transferência e licenciamento conforme a Resolução CONTRAN 1.027/2026',()=>{
 const win={};vm.runInNewContext(read('content/transito/m08.js'),{window:win});
 const m=win.BC_TRANSITO_CONTENT.m08;
 assert.equal(m.status,'revisado');assert.equal(m.full.length,5);assert.equal(m.review.length,5);assert.equal(m.checklist.length,5);
 assert.equal(m.questions.summary.length,10);assert.equal(m.questions.complete.length,10);
 const reviewText=m.review.map(c=>c.html).join(' ').toLowerCase();
 for(const topic of ['registro','art. 123','30 dias','licenciamento anual','crlv-e','1.027/2026','revogou'])assert.ok(reviewText.includes(topic),'revisão deve ensinar o tema: '+topic);
 assert.match(m.review[3].html,/<svg[\s>]/,'diagrama fica na Revisão Guiada');
 assert.ok(m.full.every(c=>!/<(?:svg|img)\b/i.test(c.html)),'Conteúdo Completo não recebe imagem didática');
 for(const q of [...m.questions.summary,...m.questions.complete]){
  assert.equal(q.options.length,5);assert.ok(q.answer>=0&&q.answer<5);assert.ok(q.explanation.length>35);
  assert.equal(new Set(q.options).size,5,'alternativas distintas');
 }
 for(const set of [m.questions.summary,m.questions.complete]){
  const counts=Array.from({length:5},(_,i)=>set.filter(q=>q.answer===i).length);
  assert.deepEqual(counts,[2,2,2,2,2],'gabarito equilibrado sem padrão por letra');
 }
 for(const source of ['planalto.gov.br/ccivil_03/leis/l9503compilado.htm','resolucao10272026.pdf','/conteudo-Senatran/resolucoes-contran'])assert.ok(m.resources.some(r=>r.url.includes(source)),source);
});

test('M09 entrega habilitação atualizada, revisão inicial, questões equilibradas e fontes oficiais',()=>{
 const win={};vm.runInNewContext(read('content/transito/m09.js'),{window:win});
 const m=win.BC_TRANSITO_CONTENT.m09;
 assert.equal(m.status,'revisado');assert.equal(m.full.length,5);assert.equal(m.review.length,5);assert.equal(m.checklist.length,5);
 assert.equal(m.questions.summary.length,10);assert.equal(m.questions.complete.length,10);
 const reviewText=m.review.map(c=>c.html).join(' ').toLowerCase();
 for(const topic of ['ppd','acc','renach','categoria b','4.250 kg','1.020/2025','1.033/2026','art. 162'])assert.ok(reviewText.includes(topic),'revisão deve ensinar o tema: '+topic);
 assert.ok(m.full.every(c=>!/<(?:svg|img)\b/i.test(c.html)),'Conteúdo Completo não recebe imagem didática');
 for(const q of [...m.questions.summary,...m.questions.complete]){
  assert.equal(q.options.length,5);assert.ok(q.answer>=0&&q.answer<5);assert.ok(q.explanation.length>35);
  assert.equal(new Set(q.options).size,5,'alternativas distintas');
 }
 for(const set of [m.questions.summary,m.questions.complete]){
  const counts=Array.from({length:5},(_,i)=>set.filter(q=>q.answer===i).length);
  assert.ok(Math.max(...counts)<=3,'gabarito sem concentração artificial');
  assert.ok(set.every((q,i)=>i<2||q.answer!==set[i-1].answer||q.answer!==set[i-2].answer),'sem três respostas iguais em sequência');
 }
 for(const source of ['planalto.gov.br/ccivil_03/leis/l9503compilado.htm','Resolucao10202025.pdf','resolucao10332026.pdf','conteudo-Senatran/resolucoes-contran'])assert.ok(m.resources.some(r=>r.url.includes(source)),source);
});

test('M10 ensina infrações, responsabilidade e autuação com MBFT atualizado',()=>{
 const win={};vm.runInNewContext(read('content/transito/m10.js'),{window:win});
 const m=win.BC_TRANSITO_CONTENT.m10;
 assert.equal(m.status,'revisado');assert.equal(m.full.length,5);assert.equal(m.review.length,5);assert.equal(m.checklist.length,5);
 assert.equal(m.questions.summary.length,10);assert.equal(m.questions.complete.length,10);
 const reviewText=m.review.map(c=>c.html).join(' ').toLowerCase();
 for(const topic of ['tipificação','sete pontos','proprietário','ait','30 dias','mbft','1.031/2026'])assert.ok(reviewText.includes(topic),'revisão deve ensinar o tema: '+topic);
 assert.ok(m.full.every(c=>!/<(?:svg|img)\b/i.test(c.html)),'Conteúdo Completo não recebe imagem didática');
 assert.equal(m.review.filter(c=>/<svg\b/i.test(c.html)).length,1,'quadro de responsabilidade fica somente na Revisão Guiada');
 for(const q of [...m.questions.summary,...m.questions.complete]){
  assert.equal(q.options.length,5);assert.ok(q.answer>=0&&q.answer<5);assert.ok(q.explanation.length>35);
  assert.equal(new Set(q.options).size,5,'alternativas distintas');
 }
 for(const set of [m.questions.summary,m.questions.complete]){
  const counts=Array.from({length:5},(_,i)=>set.filter(q=>q.answer===i).length);
  assert.deepEqual(counts,[2,2,2,2,2],'gabarito equilibrado');
  assert.ok(set.every((q,i)=>i<2||q.answer!==set[i-1].answer||q.answer!==set[i-2].answer),'sem três respostas iguais em sequência');
 }
 for(const source of ['planalto.gov.br/ccivil_03/leis/l9503compilado.htm','conteudo-Senatran/resolucoes-contran','manuais-de-fiscalizacao-sinalizacao','in.gov.br/en/web/dou/-/resolucao-contran'])assert.ok(m.resources.some(r=>r.url.includes(source)),source);
});

test('M11 ensina penalidades, advertência, suspensão e cassação conforme o CTB vigente',()=>{
 const win={};vm.runInNewContext(read('content/transito/m11.js'),{window:win});
 const m=win.BC_TRANSITO_CONTENT.m11;
 assert.equal(m.status,'revisado');assert.equal(m.full.length,5);assert.equal(m.review.length,5);assert.equal(m.checklist.length,5);
 assert.equal(m.questions.summary.length,10);assert.equal(m.questions.complete.length,10);
 const reviewText=m.review.map(c=>c.html).join(' ').toLowerCase();
 for(const topic of ['20 pontos','30 pontos','40 pontos','advertência por escrito','suspensão','cassação','medida administrativa'])assert.ok(reviewText.includes(topic),'revisão deve ensinar o tema: '+topic);
 assert.ok(m.full.every(c=>!/<(?:svg|img)\b/i.test(c.html)),'Conteúdo Completo não recebe imagem didática');
 assert.equal(m.review.filter(c=>/<svg\b/i.test(c.html)).length,1,'diagrama de suspensão fica só na Revisão Guiada');
 for(const q of [...m.questions.summary,...m.questions.complete]){
  assert.equal(q.options.length,5);assert.ok(q.answer>=0&&q.answer<5);assert.ok(q.explanation.length>35);
  assert.equal(new Set(q.options).size,5,'alternativas distintas');
 }
 for(const set of [m.questions.summary,m.questions.complete]){
  const counts=Array.from({length:5},(_,i)=>set.filter(q=>q.answer===i).length);
  assert.deepEqual(counts,[2,2,2,2,2],'gabarito equilibrado');
  assert.ok(set.every((q,i)=>i<2||q.answer!==set[i-1].answer||q.answer!==set[i-2].answer),'sem três respostas iguais em sequência');
 }
 for(const source of ['planalto.gov.br/ccivil_03/leis/l9503compilado.htm','resolucao7232018.pdf','conteudo-Senatran/resolucoes-contran'])assert.ok(m.resources.some(r=>r.url.includes(source)),source);
});

test('M12 ensina medidas administrativas, retenção, remoção e fiscalização conforme o CTB vigente',()=>{
 const win={};vm.runInNewContext(read('content/transito/m12.js'),{window:win});
 const m=win.BC_TRANSITO_CONTENT.m12;
 assert.equal(m.status,'revisado');assert.equal(m.full.length,5);assert.equal(m.review.length,5);assert.equal(m.checklist.length,5);
 assert.equal(m.questions.summary.length,10);assert.equal(m.questions.complete.length,10);
 const reviewText=m.review.map(c=>c.html).join(' ').toLowerCase();
 for(const topic of ['retenção','remoção','renavam','transbordo','165-a','1.031/2026','art. 269'])assert.ok(reviewText.includes(topic),'revisão deve ensinar o tema: '+topic);
 assert.ok(m.full.every(c=>!/<(?:svg|img)\b/i.test(c.html)),'Conteúdo Completo não recebe imagem didática');
 assert.equal(m.review.filter(c=>/<svg\b/i.test(c.html)).length,1,'quadro comparativo fica só na Revisão Guiada');
 for(const q of [...m.questions.summary,...m.questions.complete]){
  assert.equal(q.options.length,5);assert.ok(q.answer>=0&&q.answer<5);assert.ok(q.explanation.length>35);
  assert.equal(new Set(q.options).size,5,'alternativas distintas');
 }
 for(const set of [m.questions.summary,m.questions.complete]){
  const counts=Array.from({length:5},(_,i)=>set.filter(q=>q.answer===i).length);
  assert.deepEqual(counts,[2,2,2,2,2],'gabarito equilibrado');
  assert.ok(set.every((q,i)=>i<2||q.answer!==set[i-1].answer||q.answer!==set[i-2].answer),'sem três respostas iguais em sequência');
 }
 for(const source of ['planalto.gov.br/ccivil_03/leis/l9503compilado.htm','in.gov.br/en/web/dou/-/resolucao-contran-n-1.031','conteudo-Senatran/resolucoes-contran'])assert.ok(m.resources.some(r=>r.url.includes(source)),source);
});

test('M13 ensina o processo administrativo, prazos, notificações e recursos com base vigente',()=>{
 const win={};vm.runInNewContext(read('content/transito/m13.js'),{window:win});
 const m=win.BC_TRANSITO_CONTENT.m13;
 assert.equal(m.status,'revisado');assert.equal(m.full.length,5);assert.equal(m.review.length,5);assert.equal(m.checklist.length,5);
 assert.equal(m.questions.summary.length,10);assert.equal(m.questions.complete.length,10);
 const reviewText=m.review.map(c=>c.html).join(' ').toLowerCase();
 for(const topic of ['ait','notificação da autuação','defesa prévia','notificação da penalidade','jari','contraditório','ampla defesa'])assert.ok(reviewText.includes(topic),'revisão deve ensinar o tema: '+topic);
 assert.ok(m.full.every(c=>!c.html.includes('<svg')&&!c.html.includes('<img')),'Conteúdo Completo não recebe imagem didática');
 assert.equal(m.review.filter(c=>c.html.includes('<svg')).length,1,'fluxograma fica apenas na Revisão Guiada');
 const fullText=m.full.map(c=>c.html).join(' ').toLowerCase();
 for(const topic of ['art. 280','art. 281','art. 281-a','180 dias','360 dias','24 meses','resolução contran nº 900/2022'])assert.ok(fullText.includes(topic),'conteúdo completo deve cobrir '+topic);
 for(const set of [m.questions.summary,m.questions.complete]){
  assert.deepEqual(Array.from({length:5},(_,i)=>set.filter(q=>q.answer===i).length),[2,2,2,2,2],'gabarito equilibrado');
  assert.ok(set.every((q,i)=>i<2||q.answer!==set[i-1].answer||q.answer!==set[i-2].answer),'sem sequência previsível');
  for(const q of set){assert.equal(q.options.length,5);assert.ok(q.answer>=0&&q.answer<5);assert.ok(q.explanation.length>35);assert.equal(new Set(q.options).size,5)}
 }
 assert.ok(m.resources.some(r=>r.url.includes('planalto.gov.br/ccivil_03/leis/l9503compilado.htm')));
 assert.ok(m.resources.some(r=>r.url.includes('Resolucao9182022.pdf')));
});
test('M14 ensina crimes de trânsito, elementos dos tipos e atuação do agente',()=>{
 const win={};vm.runInNewContext(read('content/transito/m14.js'),{window:win});
 const m=win.BC_TRANSITO_CONTENT.m14;
 assert.equal(m.status,'revisado');assert.equal(m.full.length,5);assert.equal(m.review.length,5);assert.equal(m.checklist.length,5);
 assert.equal(m.questions.summary.length,10);assert.equal(m.questions.complete.length,10);
 const reviewText=m.review.map(c=>c.html).join(' ').toLowerCase();
 for(const topic of ['art. 302','art. 303','art. 304','art. 305','art. 306','art. 308','art. 309','art. 310','art. 311','art. 312'])assert.ok(reviewText.includes(topic),'revisão deve ensinar '+topic);
 assert.ok(m.full.every(c=>!c.html.includes('<svg')&&!c.html.includes('<img')),'Conteúdo Completo não recebe imagem didática');
 assert.equal(m.review.filter(c=>c.html.includes('<svg')).length,1,'diagrama fica apenas na Revisão Guiada');
 const fullText=m.full.map(c=>c.html).join(' ').toLowerCase();
 for(const topic of ['art. 291','art. 298','art. 301','art. 312-a','art. 312-b'])assert.ok(fullText.includes(topic),'conteúdo completo deve cobrir '+topic);
 for(const set of [m.questions.summary,m.questions.complete]){
  assert.deepEqual(Array.from({length:5},(_,i)=>set.filter(q=>q.answer===i).length),[2,2,2,2,2],'gabarito equilibrado');
  assert.ok(set.every((q,i)=>i<2||q.answer!==set[i-1].answer||q.answer!==set[i-2].answer),'sem sequência previsível');
  for(const q of set){assert.equal(q.options.length,5);assert.ok(q.answer>=0&&q.answer<5);assert.ok(q.explanation.length>35);assert.equal(new Set(q.options).size,5)}
 }
 assert.ok(m.resources.some(r=>r.url.includes('planalto.gov.br/ccivil_03/leis/l9503compilado.htm')));
 assert.ok(m.resources.some(r=>r.url.includes('/2017/lei/l13546.htm')));
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
 w.eval(read('content/transito/m03.js'));
 await w.BaseTransitoReader.open('m03','review');
 assert.match(w.document.querySelector('.bc-info-reader-top h1').textContent,/Competências dos órgãos/);
 assert.equal(w.document.querySelectorAll('.bc-transito-checklist input').length,5);
 w.document.querySelector('[data-close]').click();
 await w.BaseTransitoReader.open('m03','questions-complete');
 assert.equal(w.document.querySelectorAll('.bc-transito-question').length,10);
 assert.equal(w.document.querySelector('[data-feedback="0"]').textContent,'','o gabarito não aparece antes da tentativa');
 w.eval(read('content/transito/m04.js'));
 await w.BaseTransitoReader.open('m04','review');
 assert.match(w.document.querySelector('.bc-info-reader-top h1').textContent,/Normas gerais de circulação/);
 assert.equal(w.document.querySelectorAll('.bc-transito-checklist input').length,5);
 assert.equal(w.document.querySelectorAll('.bc-transito-flow svg').length,1);
 w.document.querySelector('[data-close]').click();
 await w.BaseTransitoReader.open('m04','questions-review');
 assert.equal(w.document.querySelectorAll('.bc-transito-question').length,10);
 w.eval(read('content/transito/m05.js'));
 await w.BaseTransitoReader.open('m05','review');
 assert.match(w.document.querySelector('.bc-info-reader-top h1').textContent,/Pedestres e veículos não motorizados/);
 assert.equal(w.document.querySelectorAll('.bc-transito-checklist input').length,5);
 assert.equal(w.document.querySelectorAll('.bc-transito-flow svg').length,1);
 assert.equal(w.document.querySelectorAll('.bc-transito-question').length,0);
 w.document.querySelector('[data-close]').click();
 await w.BaseTransitoReader.open('m05','questions-review');
 assert.equal(w.document.querySelectorAll('.bc-transito-question').length,10);
 w.eval(read('content/transito/m06.js'));
 await w.BaseTransitoReader.open('m06','review');
 assert.match(w.document.querySelector('.bc-info-reader-top h1').textContent,/Sinalização de trânsito/);
 assert.equal(w.document.querySelectorAll('.bc-transito-checklist input').length,5);
 assert.equal(w.document.querySelectorAll('.bc-transito-flow svg').length,1);
 w.document.querySelector('[data-close]').click();
 await w.BaseTransitoReader.open('m06','questions-complete');
 assert.equal(w.document.querySelectorAll('.bc-transito-question').length,10);
 w.eval(read('content/transito/m07.js'));
 await w.BaseTransitoReader.open('m07','review');
 assert.match(w.document.querySelector('.bc-info-reader-top h1').textContent,/Classificação e características/);
 assert.equal(w.document.querySelectorAll('.bc-transito-checklist input').length,5);
 w.document.querySelector('[data-close]').click();
 await w.BaseTransitoReader.open('m07','questions-review');
 assert.equal(w.document.querySelectorAll('.bc-transito-question').length,10);
 w.eval(read('content/transito/m08.js'));
 await w.BaseTransitoReader.open('m08','review');
 assert.match(w.document.querySelector('.bc-info-reader-top h1').textContent,/Registro e licenciamento/);
 assert.equal(w.document.querySelectorAll('.bc-transito-checklist input').length,5);
 assert.equal(w.document.querySelectorAll('.bc-transito-flow svg').length,1);
 w.document.querySelector('[data-close]').click();
 await w.BaseTransitoReader.open('m08','questions-complete');
 assert.equal(w.document.querySelectorAll('.bc-transito-question').length,10);
 w.eval(read('content/transito/m09.js'));
 await w.BaseTransitoReader.open('m09','review');
 assert.match(w.document.querySelector('.bc-info-reader-top h1').textContent,/Habilitação de condutores/);
 assert.equal(w.document.querySelectorAll('.bc-transito-checklist input').length,5);
 assert.equal(w.document.querySelectorAll('.bc-transito-flow svg').length,1);
 assert.equal(w.document.querySelectorAll('.bc-transito-question').length,0);
 w.document.querySelector('[data-close]').click();
 await w.BaseTransitoReader.open('m09','questions-review');
 assert.equal(w.document.querySelectorAll('.bc-transito-question').length,10);
 w.eval(read('content/transito/m10.js'));
 await w.BaseTransitoReader.open('m10','review');
 assert.match(w.document.querySelector('.bc-info-reader-top h1').textContent,/Infrações de trânsito/);
 assert.equal(w.document.querySelectorAll('.bc-transito-checklist input').length,5);
 assert.equal(w.document.querySelectorAll('.bc-transito-flow svg').length,1);
 w.document.querySelector('[data-close]').click();
 await w.BaseTransitoReader.open('m10','questions-complete');
 assert.equal(w.document.querySelectorAll('.bc-transito-question').length,10);
 w.eval(read('content/transito/m11.js'));
 await w.BaseTransitoReader.open('m11','review');
 assert.match(w.document.querySelector('.bc-info-reader-top h1').textContent,/Penalidades de trânsito/);
 assert.equal(w.document.querySelectorAll('.bc-transito-checklist input').length,5);
 assert.equal(w.document.querySelectorAll('.bc-transito-flow svg').length,1);
 w.document.querySelector('[data-close]').click();
 await w.BaseTransitoReader.open('m11','questions-complete');
 assert.equal(w.document.querySelectorAll('.bc-transito-question').length,10);
 w.eval(read('content/transito/m12.js'));
 await w.BaseTransitoReader.open('m12','review');
 assert.match(w.document.querySelector('.bc-info-reader-top h1').textContent,/Medidas administrativas de trânsito/);
 assert.equal(w.document.querySelectorAll('.bc-transito-checklist input').length,5);
 assert.equal(w.document.querySelectorAll('.bc-transito-flow svg').length,1);
 w.document.querySelector('[data-close]').click();
 await w.BaseTransitoReader.open('m12','questions-complete');
 assert.equal(w.document.querySelectorAll('.bc-transito-question').length,10);
 w.eval(read('content/transito/m13.js'));
 await w.BaseTransitoReader.open('m13','review');
 assert.match(w.document.querySelector('.bc-info-reader-top h1').textContent,/Processo administrativo de trânsito/);
 assert.equal(w.document.querySelectorAll('.bc-transito-checklist input').length,5);
 assert.equal(w.document.querySelectorAll('.bc-transito-flow svg').length,1);
 w.document.querySelector('[data-close]').click();
 await w.BaseTransitoReader.open('m13','questions-review');
 assert.equal(w.document.querySelectorAll('.bc-transito-question').length,10);
 w.eval(read('content/transito/m14.js'));
 await w.BaseTransitoReader.open('m14','review');
 assert.match(w.document.querySelector('.bc-info-reader-top h1').textContent,/Crimes de trânsito/);
 assert.equal(w.document.querySelectorAll('.bc-transito-checklist input').length,5);
 assert.equal(w.document.querySelectorAll('.bc-transito-flow svg').length,1);
 w.document.querySelector('[data-close]').click();
 await w.BaseTransitoReader.open('m14','questions-complete');
 assert.equal(w.document.querySelectorAll('.bc-transito-question').length,10);
 dom.window.close();loaded=true;assert.equal(loaded,true);
});

test('boot e pacote offline carregam curso e leitura sem alterar a produção',()=>{
 const boot=read('central-v119.html'),manifest=JSON.parse(read('central-offline-files-v66172.json'));
 assert.match(boot,/ui\/transito-shared-course-v1\.js\?v=20261127m14a/);
 assert.match(boot,/ui\/transito-course-reader-v1\.js\?v=20261127m14a/);
 assert.match(read('ui/transito-shared-course-v1.js'),/Filtro pendente de validação/);
 assert.ok(read('ui/transito-course-reader-v1.js').includes("'/content/transito/'+id+'.js?v=20261127m14a"));
 assert.ok(manifest.files.some(x=>x==='/content/transito/m03.js?v=20261127m14a'));
 assert.match(boot,/ui\/transito-course-reader-v1\.js\?v=/);
 assert.match(boot,/ui\/transito-shared-course-v1\.css\?v=/);
 for(const path of ['/ui/transito-shared-course-v1.js?v=20261127m14a','/ui/transito-course-reader-v1.js?v=20261127m14a','/ui/transito-shared-course-v1.css?v=20261127m14a','/content/transito/m01.js?v=20261127m14a','/content/transito/m02.js?v=20261127m14a','/content/transito/m03.js?v=20261127m14a','/content/transito/m04.js?v=20261127m14a','/content/transito/m05.js?v=20261127m14a','/content/transito/m06.js?v=20261127m14a','/content/transito/m07.js?v=20261127m14a','/content/transito/m08.js?v=20261127m14a','/content/transito/m09.js?v=20261127m14a','/content/transito/m10.js?v=20261127m14a','/content/transito/m11.js?v=20261127m14a','/content/transito/m12.js?v=20261127m14a','/content/transito/m13.js?v=20261127m14a','/content/transito/m14.js?v=20261127m14a'])assert.ok(manifest.files.includes(path),path+' ausente do cache offline');
 assert.match(boot,/20261127-transito-m14a/);
 assert.match(read('index.html'),/Legislação de Trânsito/);
});
