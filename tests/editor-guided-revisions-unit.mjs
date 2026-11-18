import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { contentEditorReadFeature } from '../lib/content-editor-access.js';

const premium=readFileSync(new URL('../ui/editor-premium-v1.js',import.meta.url),'utf8');
const legacy=readFileSync(new URL('../ui/visual-editor-v1.js',import.meta.url),'utf8');
const wait=(ms=55)=>new Promise(resolve=>setTimeout(resolve,ms));

async function setup(subject='Civil',role='admin',remote=null,moduleNumber=3){
 const guided=subject!=='Penal';
 const label='Teoria guiada de Direito '+subject+', módulo '+moduleNumber;
 const paper=guided?'<article class="bc-m01-paper bc-apostila-paper">':'<div class="bc-m01-paper">';
 const end=guided?'</article>':'</div>';
 const dom=new JSDOM('<!doctype html><html><body>'+
  '<div class="bc-guided-overlay" role="dialog" aria-label="'+label+'">'+
  '<nav class="bc-m01-toolbar"><button data-bc-guided-close>Voltar</button></nav>'+
  '<main class="bc-m01-scroll">'+paper+
  '<h1>Revisão do módulo</h1><p>Conteúdo original.</p>'+
  (guided?'<details class="bc-apostila-checklist"><summary>Checagem</summary>':
          '')+
  '<section class="bc-m01-checklist"><label><input type="checkbox" data-bc-guided-check="0">Compreendi</label></section>'+
  (guided?'</details>':'')+end+'</main></div></body></html>',{
  url:'https://example.test/central-v119.html',
  runScripts:'outside-only',pretendToBeVisual:true
 });
 const win=dom.window, calls=[];
 win.MutationObserver=class{observe(){}disconnect(){}};
 win.confirm=()=>true;
 win.prompt=()=>null;
 win.fetch=async (url,options={})=>{
  const target=String(url);
  calls.push({target,options});
  if(target.startsWith('/api/auth'))return {ok:true,json:async()=>({authenticated:true,user:{role}})};
  if(options.method==='POST')return {ok:true,json:async()=>({ok:true,revision:1})};
  if(target.startsWith('/api/content-editor'))return {ok:true,json:async()=>remote||{exists:false}};
  return {ok:true,json:async()=>({})};
 };
 const originalCheck=win.document.querySelector('[data-bc-guided-check]');
 let changes=0;originalCheck.addEventListener('change',()=>{changes++});
 win.eval(legacy);
 win.eval(premium);
 await wait();
 return {win,dom,calls,originalCheck,get changes(){return changes},
  cleanup(){win.close()}};
}

for(const subject of ['Civil','Constitucional','Penal']){
 test('Editor Premium disponível na revisão guiada de Direito '+subject,async()=>{
  const app=await setup(subject),doc=app.win.document;
  assert.ok(doc.querySelector('.bcpe-launch'),'falta botão do editor');
  assert.equal(doc.querySelector('.bc-editor-trigger'),null,'editor antigo duplicado');
  doc.querySelector('.bcpe-launch').click();await wait();
  assert.ok(doc.querySelector('.bcpe-screen'));
  const workspace=doc.querySelector('.bcpe-workspace');
  assert.match(workspace.textContent,/Revisão do módulo/);
  doc.querySelector('[data-action="publish"]').click();await wait();
  const write=app.calls.find(call=>call.options.method==='POST');
  assert.ok(write,'publicação não foi acionada');
  const content=JSON.parse(write.options.body);
  assert.ok(content.id.startsWith('reader:'),'ID incompatível com a API');
  assert.match(content.label,new RegExp('Direito '+subject));
  assert.ok(doc.querySelector('.bc-m01-paper .bc-m01-checklist'),'checklist desapareceu');
  assert.equal(doc.querySelector('[data-bc-guided-check]'),app.originalCheck,
   'o checkbox original precisa manter seus listeners');
  app.originalCheck.dispatchEvent(new app.win.Event('change',{bubbles:true}));
  assert.equal(app.changes,1,'listener do checklist se perdeu');
  app.cleanup();
 });
}

test('as revisões de Civil e Constitucional têm identificadores diferentes',async()=>{
 const civil=await setup('Civil'),cf=await setup('Constitucional');
 assert.notEqual(civil.win.BCPremiumEditor.contentId(civil.win.document.querySelector('.bc-guided-overlay')),
  cf.win.BCPremiumEditor.contentId(cf.win.document.querySelector('.bc-guided-overlay')));
 civil.cleanup();cf.cleanup();
});

test('aluno não recebe ferramenta administrativa; versão publicada usa o leitor guiado',async()=>{
 const app=await setup('Civil','aluno',{
  exists:true,revision:2,
  html:'<h1>Revisão atualizada</h1><p>Texto publicado.</p><div data-bc-editor-preserve="0"></div>'
 });
 const doc=app.win.document;
 assert.equal(doc.querySelector('.bcpe-launch'),null);
 assert.equal(doc.querySelector('.bc-editor-trigger'),null);
 assert.match(doc.querySelector('.bc-m01-paper').textContent,/Revisão atualizada/);
 assert.equal(doc.querySelector('[data-bc-guided-check]'),app.originalCheck);
 assert.ok(app.calls.some(call=>call.target.startsWith('/api/content-editor?id=')));
 app.cleanup();
});

test('revisões oficiais editadas são gratuitas; teoria completa segue Premium',()=>{
 function hash(value){
  let h=2166136261;
  for(let i=0;i<value.length;i++){h^=value.charCodeAt(i);h=Math.imul(h,16777619)}
  return 'reader:'+(h>>>0).toString(36);
 }
 for(const [subject,count] of [['Civil',15],['Constitucional',15],['Penal',17]]){
  for(let n=1;n<=count;n++){
   const label='/central-v119.html|guided-review|Teoria guiada de Direito '+subject+', módulo '+n;
   assert.equal(contentEditorReadFeature(hash(label)),'theory.summary',subject+' M'+n);
  }
  assert.equal(contentEditorReadFeature(hash('/central-v119.html|guided-review|Teoria guiada de Direito '+subject+', módulo '+(count+1))),'theory.complete');
 }
 for(const candidate of [
   '', 'reader:arbitrario','reader:0',
   hash('/central-v119.html|Teoria completa|Direito Civil'),
   hash('/central-v119.html|guided-review|Teoria guiada de Direito Civil, módulo 99'),
   hash('/outra-rota|guided-review|Teoria guiada de Direito Civil, módulo 1')
 ])assert.equal(contentEditorReadFeature(candidate),'theory.complete',candidate);
});

test('título da lei seca na revisão CF é editável e publicado sem deixar o artigo aberto por padrão',async()=>{
 const app=await setup('Constitucional'),doc=app.win.document;
 const paper=doc.querySelector('.bc-m01-paper');
 paper.insertAdjacentHTML('afterbegin','<section><details class="bc-m01-lei-seca"><summary>Ver lei seca — CF/88, art. 1º e mais 1</summary><details class="bc-m01-lei-item"><summary>CF/88, art. 1º</summary><p>Artigo</p></details></details></section>');
 doc.querySelector('.bcpe-launch').click();await wait();
 const workspace=doc.querySelector('.bcpe-workspace');
 const summary=workspace.querySelector('.bc-m01-lei-seca > summary');
 assert.equal(summary?.getAttribute('contenteditable'),'true');
 assert.equal(summary.closest('details').open,true,'expandido apenas durante a edição');
 const nested=workspace.querySelector('.bc-m01-lei-item > summary');
 assert.equal(nested.getAttribute('contenteditable'),'true','subtítulo de lei seca editável');
 summary.textContent='Ver lei seca — CF/88, art. 1º — Fundamentos';
 summary.dispatchEvent(new app.win.Event('input',{bubbles:true}));
 doc.querySelector('[data-action="publish"]').click();await wait();
 const write=app.calls.find(c=>c.options.method==='POST');
 assert.ok(write);
 const published=JSON.parse(write.options.body).html;
 assert.match(published,/Ver lei seca — CF\/88, art\. 1º — Fundamentos/);
 assert.doesNotMatch(published,/data-bcpe-law-was-open|<details[^>]+open/);
 app.cleanup();
});


test('Editor Premium M1: edita título e texto em campos separados e remove abas aninhadas',async()=>{
 const a=await setup('Constitucional','admin',null,1),d=a.win.document;
 const paper=d.querySelector('.bc-m01-paper');
 paper.insertAdjacentHTML('afterbegin','<section class="bc-m01-topic"><h2 id="bc-guided-title-1-9">Art. 1º</h2><p>Teoria que não pode ser alterada.</p>'+
  '<details class="bc-m01-lei-seca"><summary>Ver lei seca — Original</summary>'+
  '<details class="bc-m01-lei-item"><summary>CF/88, art. 1º</summary><div class="bc-m01-lei-art"><p>Art. 1º Texto anterior.</p></div></details></details></section>');
 d.querySelector('.bcpe-launch').click();await wait();
 d.querySelector('[data-action="edit-law"]').click();
 const panel=d.querySelector('.bcpe-law-edit-panel');
 assert.ok(panel,'não abriu o editor específico de Lei Seca');
 const title=panel.querySelector('input[aria-label="Título da Lei Seca"]');
 assert.equal(title.value,'Ver lei seca — Original');
 title.value='Ver lei seca — CF/88, art. 1º';
 const area=panel.querySelector('textarea[aria-label="Conteúdo da lei seca"]');
 area.value='Art. 1º Texto atualizado.\nI - A soberania.';
 area.dispatchEvent(new a.win.Event('input',{bubbles:true}));
 panel.querySelector('button.bcpe-primary').click();
 assert.equal(d.querySelector('.bcpe-law-edit-panel'),null,'modal deve fechar ao aplicar');
 const root=d.querySelector('.bcpe-workspace .bc-m01-topic');
 const law=root.querySelector('.bc-m01-lei-seca');
 assert.equal(law.querySelector(':scope > summary').textContent,'Ver lei seca — CF/88, art. 1º');
 assert.equal(law.querySelectorAll('details').length,0,'aba interna não pode continuar');
 assert.equal(law.querySelectorAll('.bc-m01-lei-art p').length,2);
 assert.match(root.textContent,/Teoria que não pode ser alterada/);
 assert.notEqual(law.querySelector(':scope > summary').getAttribute('contenteditable'),'true','título usa campo dedicado');
 d.querySelector('[data-action="publish"]').click();await wait();
 const write=a.calls.find(c=>c.options.method==='POST');
 assert.ok(write,'deve publicar pelo fluxo usual');
 const html=JSON.parse(write.options.body).html;
 assert.match(html,/Art\. 1º Texto atualizado/);
 assert.match(html,/Ver lei seca — CF\/88, art\. 1º/);
 assert.match(html,/Teoria que não pode ser alterada/);
 assert.doesNotMatch(html,/<details[^>]*bc-m01-lei-item/);
 a.cleanup();
});

test('Editor Premium M1: após excluir toda a lei seca pode recriar artigo e parágrafo',async()=>{
 const a=await setup('Constitucional','admin',null,1),d=a.win.document;
 d.querySelector('.bc-m01-paper').insertAdjacentHTML('afterbegin',
  '<section class="bc-m01-topic"><h2 id="bc-guided-title-1-9">Fundamentos</h2>'+
  '<p>Material do professor preservado.</p>'+
  '<details class="bc-m01-lei-seca"><summary>Ver lei seca — Art. 1º</summary>'+
  '<div class="bc-m01-lei-art"><p>Texto antigo.</p></div></details></section>');
 d.querySelector('.bcpe-launch').click();await wait();
 d.querySelector('[data-action="edit-law"]').click();
 d.querySelector('.bcpe-law-edit-panel .bcpe-law-edit-tools button.bcpe-law-danger').click();
 assert.equal(d.querySelector('.bcpe-workspace .bc-m01-lei-seca'),null,'exclusão no rascunho');
 d.querySelector('[data-action="edit-law"]').click();
 let panel=d.querySelector('.bcpe-law-edit-panel');
 panel.querySelector('input[aria-label="Título da Lei Seca"]').value='Ver lei seca — Nova redação';
 panel.querySelector('input[aria-label="Identificação do artigo"]').value='CF/88, art. 1º';
 let area=panel.querySelector('textarea');
 area.value='Art. 1º Texto restaurado.';area.dispatchEvent(new a.win.Event('input',{bubbles:true}));
 panel.querySelector('.bcpe-law-edit-tools button:not(.bcpe-law-danger)').click();
 const row2=panel.querySelectorAll('.bcpe-law-edit-row')[1];
 assert.ok(row2,'deve poder acrescentar novo artigo mesmo após excluir toda a lei');
 row2.querySelector('input').value='CF/88, art. 2º';
 const area2=row2.querySelector('textarea');
 area2.value='Art. 2º Texto adicional.';area2.dispatchEvent(new a.win.Event('input',{bubbles:true}));
 panel.querySelector('button.bcpe-primary').click();
 const law=d.querySelector('.bcpe-workspace .bc-m01-lei-seca');
 assert.ok(law,'lei seca criada novamente');
 assert.equal(law.querySelectorAll('.bc-m01-lei-item').length,2);
 assert.equal(law.querySelectorAll('details').length,0);
 assert.match(d.querySelector('.bcpe-workspace').textContent,/Material do professor preservado/);
 d.querySelector('[data-action="publish"]').click();await wait();
 const html=JSON.parse(a.calls.find(c=>c.options.method==='POST').options.body).html;
 assert.match(html,/Art\. 1º Texto restaurado/);
 assert.match(html,/Art\. 2º Texto adicional/);
 assert.doesNotMatch(html,/data-bc-law-removed/,'exclusão anterior não deve bloquear a nova lei seca');
 a.cleanup();
});
