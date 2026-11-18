import test from 'node:test';
import { JSDOM } from 'jsdom';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=(f)=>fs.readFileSync(path.join(ROOT,f),'utf8');
test('CF M01–M15: todos os assuntos e 8 campos pedagógicos carregam sem alterações na teoria completa',()=>{
 const sandbox={window:{}};
 let count=0;
 for(let n=1;n<=15;n++){
  const pad=String(n).padStart(2,'0');
  const txt=read('content/cf/m'+pad+'-teoria-guiada-data.js');
  new vm.Script(txt,{filename:pad}).runInNewContext(sandbox);
  const data=sandbox.window.BC_CF_GUIDED_MODULES?.[n];
  assert.equal(data?.module,n,'M'+pad+' ausente');
  assert.ok(data.topics.length>=10,'M'+pad+' sem cobertura');
  for(const t of data.topics){
   assert.equal(t.length,8,'M'+pad+' formato inesperado');
   for(const cell of t)assert.ok(typeof cell==='string'&&cell.trim().length>10,'M'+pad+' célula insuficiente');
  }
  const native=read('content/cf/m'+pad+'-native-data.js');
  assert.match(native,/complete/);
  assert.match(native,/summary/);
  count+=data.topics.length;
 }
 assert.equal(count,194,'total de assuntos deve corresponder à teoria aprovada');
});
test('CF: leitor de revisão é substituído sem botão de piloto, sem tocar nos exercícios',()=>{
 const html=read('index.html');
 const ui=read('ui/cf-native-study-v2.js');
 const reader=read('content/cf/cf-teoria-guiada-reader-v1.js');
 new vm.Script(ui);new vm.Script(reader);
 for(let n=1;n<=15;n++){
  const tag='m'+String(n).padStart(2,'0')+'-teoria-guiada-data.js';
  assert.ok(html.includes(tag),'referência ausente '+tag);
 }
 assert.ok(html.indexOf('m15-teoria-guiada-data.js')<html.indexOf('cf-teoria-guiada-reader-v1.js'));
 assert.ok(html.indexOf('cf-teoria-guiada-reader-v1.js')<html.indexOf('ui/cf-native-study-v2.js'));
 assert.ok(ui.includes("mode==='summary'&&g.BcCfGuidedReader?.open(n)"));
 assert.ok(ui.includes('Teoria completa'));
 assert.ok(ui.includes('Resolver 10 questões'));
 assert.ok(ui.includes('Resolver 5 questões'));
 assert.ok(ui.includes('Revisar conteúdo'));
 assert.ok(ui.includes('markSummaryRead(n)'));
 assert.ok(!html.includes('m01-teoria-guiada-preview.js'));
 assert.ok(!reader.includes('Nova teoria guiada · testar'));
 assert.ok(!reader.includes('function mount()'));
 assert.ok(!reader.includes('fetch('));
 assert.ok(reader.includes('bc-apostila-v20261111'));
 assert.ok(reader.includes('apostilaSintese'));
 assert.ok(!reader.includes('data-bc-guided-mode="review"'));
 assert.ok(reader.includes('bc-m01-checklist'));
 assert.ok(reader.includes('localStorage'));
 assert.ok(reader.includes('const MIN=1,MAX=15'));
});

test('CF M01: dispositivos ausentes aparecem, repetidos são consolidados e grupos abrem individualmente',()=>{
 const dom=new JSDOM('<!doctype html><html><body></body></html>',{url:'https://example.test',runScripts:'outside-only',pretendToBeVisual:true});
 const w=dom.window;
 w.eval(read('content/cf/m01-teoria-guiada-data.js'));
 w.eval(read('content/cf/cf-teoria-guiada-lei-seca.js'));
 w.eval(read('content/cf/m01-lei-seca-patch.js'));
 w.eval(read('content/cf/cf-teoria-guiada-reader-v1.js'));
 assert.equal(w.BcCfGuidedReader.open(1),true);
 const topics=w.document.querySelectorAll('.bc-m01-topic');
 assert.equal(topics.length,13);
 for(const [index,part] of [[1,'art. 242'],[3,'art. 5º, § 3º'],[4,'art. 103, § 2º'],[6,'LINDB']]){
  const label=topics[index].querySelector('.bc-m01-lei-seca')?.textContent||'';
  assert.ok(label.includes(part),'falta a referência '+part+' no tópico '+index);
 }
 const group=topics[4].querySelector('.bc-m01-lei-seca');
 assert.match(group.querySelector(':scope > summary').textContent,/e mais 2/);
 const nested=group.querySelectorAll('details.bc-m01-lei-item');
 assert.equal(nested.length,3,'cada lei adicional deve ter uma abertura própria');
 group.open=true;nested[1].open=true;
 assert.ok(nested[1].querySelectorAll('p').length>0,'item adicional deve abrir seu texto');
 assert.doesNotMatch(topics[9].querySelector('.bc-m01-lei-seca > summary').textContent,/e mais/,'art. 1º duplicado');
 assert.equal(topics[7].querySelector('.bc-m01-lei-seca'),null,'art. 60 indevido em mutação');
 w.close();
});


test('CF M01: revisão 20 publicada mantém os textos e adiciona somente leis secas ausentes',()=>{
 const dom=new JSDOM('<!doctype html><html><body></body></html>',{url:'https://example.test',runScripts:'outside-only'});
 const w=dom.window;
 w.eval(read('content/cf/m01-teoria-guiada-data.js'));
 w.eval(read('content/cf/cf-teoria-guiada-lei-seca.js'));
 w.eval(read('content/cf/m01-lei-seca-patch.js'));
 w.eval(read('content/cf/cf-teoria-guiada-reader-v1.js'));
 const old='<section class="bc-m01-topic"><h2 id="bc-guided-title-1-4">Eficácia</h2><p>Edição do professor mantida.</p></section>'+
  '<section class="bc-m01-topic"><h2 id="bc-guided-title-1-9">Art. 1º</h2><details class="bc-m01-lei-seca"><summary>Ver lei seca — CF/88, art. 1º e mais 2</summary><p>duplicado</p></details></section>';
 const value=w.BcCfGuidedReader.reconcileM01Html(old,20);
 const wrap=w.document.createElement('div');wrap.innerHTML=value;
 assert.match(value,/Edição do professor mantida/,'teoria editada não pode ser perdida');
 assert.equal(wrap.querySelectorAll('.bc-m01-topic').length,2,'não restaurar tópicos removidos');
 assert.equal(wrap.querySelectorAll('#bc-guided-title-1-4 ~ .bc-m01-lei-seca .bc-m01-lei-item').length,3);
 assert.match(value,/duplicado/,'preservar os trechos legais existentes mesmo quando repetidos');
 assert.match(value,/Ver lei seca — CF\\/88, art\\. 1º e mais 2/,'preservar o título existente');
 assert.match(value,/CF\/88, art\. 103, § 2º/,'novo texto legal incluído');
 assert.equal(w.BcCfGuidedReader.reconcileM01Html(old,21),old,'não modificar publicações posteriores');
 w.close();
});
