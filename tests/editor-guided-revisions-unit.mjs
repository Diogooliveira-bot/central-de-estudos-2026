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

test('título da lei seca é editado no formulário e o quadro permanece recolhível após publicar',async()=>{
 const app=await setup('Constitucional','admin',null,1),doc=app.win.document;
 doc.querySelector('.bc-m01-paper').insertAdjacentHTML('afterbegin',
  '<section class="bc-m01-topic"><h2 id="bc-guided-title-1-9">Art. 1º</h2>'+
  '<details class="bc-m01-lei-seca"><summary>Ver lei seca — CF/88, art. 1º</summary>'+
  '<div class="bc-m01-lei-art"><p>Art. 1º Conteúdo.</p></div></details></section>');
 doc.querySelector('.bcpe-launch').click();await wait();
 const summary=doc.querySelector('.bcpe-workspace .bc-m01-lei-seca > summary');
 assert.notEqual(summary?.getAttribute('contenteditable'),'true','título não deve prender o cursor do editor');
 doc.querySelector('[data-action="edit-law"]').click();
 const panel=doc.querySelector('.bcpe-law-edit-panel');
 panel.querySelector('input[aria-label="Título da Lei Seca"]').value='Ver lei seca — CF/88, art. 1º — Fundamentos';
 panel.querySelector('button.bcpe-primary').click();
 doc.querySelector('[data-action="publish"]').click();await wait();
 const write=app.calls.find(c=>c.options.method==='POST');
 assert.ok(write);
 const published=JSON.parse(write.options.body).html;
 assert.match(published,/Ver lei seca — CF\/88, art\. 1º — Fundamentos/);
 assert.doesNotMatch(published,/data-bcpe-law-was-open|<details[^>]+open/);
 assert.match(published,/Art\. 1º Conteúdo/,'o texto da lei existente deve ser preservado');
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


test('M1 Constitucional: + Inserir Lei Seca não cria outra aba dentro do assunto',async()=>{
 const app=await setup('Constitucional','admin',null,1),d=app.win.document;
 d.querySelector('.bc-m01-paper').insertAdjacentHTML('afterbegin',
  '<section class="bc-m01-topic"><h2 id="bc-guided-title-1-9">Art. 1º</h2>'+
  '<p>Teoria aprovada pelo professor.</p></section>');
 d.querySelector('.bcpe-launch').click();await wait();
 const target=d.querySelector('.bcpe-workspace .bc-m01-topic p');
 target.dispatchEvent(new app.win.MouseEvent('pointerdown',{bubbles:true}));
 const menu=d.querySelector('.bcpe-toolbar [data-insert]');
 assert.ok(menu.querySelector('option[value="law"]'));
 function fill(ref,text){
  menu.value='law';menu.dispatchEvent(new app.win.Event('change',{bubbles:true}));
  const modal=d.querySelector('.bcpe-law-edit-panel');
  assert.ok(modal);
  modal.querySelector('input[aria-label="Título da Lei Seca"]').value='Ver lei seca — CF/88';
  modal.querySelector('input[aria-label="Identificação do dispositivo"]').value=ref;
  const area=modal.querySelector('textarea[aria-label="Texto da Lei Seca"]');
  area.value=text;area.dispatchEvent(new app.win.Event('input',{bubbles:true}));
  modal.querySelector('button.bcpe-primary').click();
 }
 fill('CF/88, art. 1º','Art. 1º Texto legal inicial.');
 const root=d.querySelector('.bcpe-workspace .bc-m01-topic');
 assert.equal(root.querySelectorAll('details.bc-m01-lei-seca').length,1);
 assert.equal(root.querySelectorAll('details details').length,0);
 fill('CF/88, art. 2º','Art. 2º Texto legal acrescentado.');
 assert.equal(root.querySelectorAll('details.bc-m01-lei-seca').length,1,'deve reutilizar uma aba');
 assert.equal(root.querySelectorAll('details details').length,0);
 assert.equal(root.querySelectorAll('.bc-m01-lei-item').length,2);
 assert.match(root.textContent,/Teoria aprovada pelo professor/);
 assert.match(root.textContent,/Art. 1º Texto legal inicial/);
 assert.match(root.textContent,/Art. 2º Texto legal acrescentado/);
 d.querySelector('[data-action="publish"]').click();await wait();
 const saved=app.calls.find(call=>call.options.method==='POST');
 assert.ok(saved);
 const published=JSON.parse(saved.options.body).html;
 assert.match(published,/Art\. 2º Texto legal acrescentado/);
 assert.match(published,/Teoria aprovada pelo professor/);
 assert.equal((published.match(/class="bc-m01-lei-seca"/g)||[]).length,1);
 app.cleanup();
});

test('Revisão Civil: + Inserir Lei Seca permite texto manual sem catálogo de Constitucional',async()=>{
 const app=await setup('Civil'),d=app.win.document;
 d.querySelector('.bcpe-launch').click();await wait();
 const menu=d.querySelector('.bcpe-toolbar [data-insert]');
 assert.ok(menu.querySelector('option[value="law"]'));
 menu.value='law';menu.dispatchEvent(new app.win.Event('change',{bubbles:true}));
 const modal=d.querySelector('.bcpe-law-edit-panel');
 assert.ok(modal);
 assert.equal(modal.querySelector('select[aria-label="Lei pronta para inserir"]').disabled,true);
 modal.querySelector('button:not(.bcpe-primary)').click();
 app.cleanup();
});

test('M1: inserir card após o parágrafo selecionado, dividindo a prosa sem mudar texto',async()=>{
 const a=await setup('Constitucional','admin',null,1),d=a.win.document;
 d.querySelector('.bc-m01-paper').insertAdjacentHTML('afterbegin',
  '<section class="bc-m01-topic"><h2 id="bc-guided-title-1-4">Eficácia</h2>'+
  '<div class="bc-apostila-prose"><p>Primeiro parágrafo.</p><p>Segundo parágrafo escolhido.</p><p>Terceiro parágrafo.</p></div>'+
  '<details class="bc-m01-lei-seca"><summary>Ver Lei Seca — CF/88</summary><div class="bc-m01-lei-art"><p>Art. 1º.</p></div></details>'+
  '</section>');
 d.querySelector('.bcpe-launch').click();await wait();
 const topic=d.querySelector('.bcpe-workspace .bc-m01-topic');
 const chosen=topic.querySelectorAll('.bc-apostila-prose p')[1];
 chosen.dispatchEvent(new a.win.MouseEvent('pointerdown',{bubbles:true}));
 const select=d.querySelector('.bcpe-toolbar [data-insert]');
 select.value='atencao';select.dispatchEvent(new a.win.Event('change',{bubbles:true}));
 const direct=Array.from(topic.children);
 const card=topic.querySelector(':scope > aside.bcpe-educational');
 assert.ok(card,'card deve aparecer dentro do assunto, não após o capítulo');
 assert.ok(direct.indexOf(card)>0);
 assert.equal(direct[direct.indexOf(card)-1].textContent.includes('Segundo parágrafo escolhido.'),true);
 assert.equal(direct[direct.indexOf(card)+1].textContent.includes('Terceiro parágrafo.'),true);
 assert.equal(topic.querySelectorAll('.bc-apostila-prose p').length,3,'nenhum parágrafo pode ser apagado');
 assert.ok(card.querySelector('.bcpe-drag-handle'),'card pode ser arrastado');
 d.querySelector('[data-action="publish"]').click();await wait();
 const payload=JSON.parse(a.calls.find(x=>x.options.method==='POST').options.body).html;
 assert.match(payload,/Primeiro parágrafo/);
 assert.match(payload,/Segundo parágrafo escolhido/);
 assert.match(payload,/Terceiro parágrafo/);
 assert.match(payload,/bcpe-kind-atencao/);
 assert.doesNotMatch(payload,/bcpe-drag-target|bcpe-drag-handle|bcpe-drop-after/,'alças não devem ser publicadas');
 a.cleanup();
});

test('M1: arrastar Lei Seca e cards pelo mouse reordena blocos sem alterar artigos',async()=>{
 const a=await setup('Constitucional','admin',null,1),d=a.win.document;
 d.querySelector('.bc-m01-paper').insertAdjacentHTML('afterbegin',
  '<section class="bc-m01-topic"><h2 id="bc-guided-title-1-9">Fundamentos</h2>'+
  '<p class="intro">Parágrafo de introdução.</p>'+
  '<aside class="bcpe-educational bcpe-kind-decore"><h4>DECORE</h4><p>Texto do card.</p></aside>'+
  '<p class="middle">Texto intermediário.</p>'+
  '<details class="bc-m01-lei-seca"><summary>Ver lei seca — Art. 1º</summary><div class="bc-m01-lei-art"><p>Art. 1º Intacto.</p></div></details>'+
  '</section>');
 d.querySelector('.bcpe-launch').click();await wait();
 const topic=d.querySelector('.bcpe-workspace .bc-m01-topic');
 const law=topic.querySelector('details.bc-m01-lei-seca');
 const card=topic.querySelector('aside.bcpe-educational');
 function drag(source,target){
  const handle=source.querySelector('.bcpe-drag-handle');
  assert.ok(handle,'alça de arrastar ausente');
  const transfer={setData(){},effectAllowed:'',dropEffect:''};
  for(const [name,el] of [['dragstart',handle],['dragover',target],['drop',target]]){
   const ev=new a.win.Event(name,{bubbles:true,cancelable:true});
   Object.defineProperty(ev,'dataTransfer',{value:transfer});
   el.dispatchEvent(ev);
  }
  handle.dispatchEvent(new a.win.Event('dragend',{bubbles:true}));
 }
 drag(law,topic.querySelector('p.intro'));
 assert.equal(topic.children[2],law,'Lei Seca deve se mover após o parágrafo introdutório');
 drag(card,topic.querySelector('p.middle'));
 assert.equal(card.previousElementSibling?.className,'middle');
 assert.equal(topic.querySelectorAll('details.bc-m01-lei-seca').length,1,'nunca duplicar Lei Seca');
 assert.equal(topic.querySelectorAll('aside.bcpe-educational').length,1,'não duplicar card');
 d.querySelector('[data-action="publish"]').click();await wait();
 const payload=JSON.parse(a.calls.find(x=>x.options.method==='POST').options.body).html;
 assert.match(payload,/Art\. 1º Intacto/);
 assert.match(payload,/Texto do card/);
 assert.ok(payload.indexOf('Parágrafo de introdução.')<payload.indexOf('Art. 1º Intacto'));
 assert.doesNotMatch(payload,/bcpe-drag-handle|bcpe-drag-target|draggable="true"/);
 a.cleanup();
});



async function setupLawFull(subject='Constitucional',catalog=null){
 const cf=subject==='Constitucional';
 const view=cf
  ?'<div class="cf-native-overlay"><div class="cf-native-shell"><header><b>Direito Constitucional</b><small>Módulo 1</small></header></div><div class="cf-native-reader"><aside></aside><article><p id="intro">Comentário do art. 1º.</p><p id="second">Segundo parágrafo preservado.</p></article></div></div>'
  :'<div class="bc-native-reader-overlay"><div class="bc-native-reader-title"><b>Direito Civil</b><small>Módulo 1</small></div><div class="bc-native-reader-tools"></div><article class="bc-native-article"><p>Primeiro parágrafo do material.</p><p>Segundo parágrafo.</p></article></div>';
 const dom=new JSDOM('<!doctype html><html><body>'+view+'</body></html>',{url:'https://example.test/central-v119.html',runScripts:'outside-only',pretendToBeVisual:true});
 const win=dom.window,calls=[];
 win.MutationObserver=class{observe(){}disconnect(){}};
 win.confirm=()=>true;
 win.BC_CF_GUIDED_LAW=catalog||undefined;
 win.fetch=async(url,options={})=>{
  calls.push({url:String(url),options});
  if(String(url).startsWith('/api/auth'))return{ok:true,json:async()=>({authenticated:true,user:{role:'admin'}})};
  if(options.method==='POST')return{ok:true,json:async()=>({ok:true,revision:30})};
  return{ok:true,json:async()=>({exists:false})};
 };
 win.eval(premium);await wait();
 const launch=win.document.querySelector('.bcpe-launch');
 assert.ok(launch,'botão do Editor Premium ausente no conteúdo completo');
 launch.click();await wait();
 return {win,dom,calls,close(){win.close()}};
}

test('Conteúdo completo Constitucional: + Inserir inclui Lei Seca pronta do catálogo existente',async()=>{
 const catalog={'1':{'1':[['CF/88, art. 2º',['Art. 2º São Poderes da União, independentes e harmônicos entre si, o Legislativo, o Executivo e o Judiciário.']]],
  '9':[['CF/88, art. 1º',['Art. 1º A República Federativa do Brasil constitui-se em Estado Democrático de Direito.','I - a soberania;','II - a cidadania;']]]}};
 const app=await setupLawFull('Constitucional',catalog),d=app.win.document;
 const menu=d.querySelector('[data-insert]');
 assert.ok(menu.querySelector('option[value="law"]'),'Lei Seca deve estar disponível no conteúdo completo');
 const intro=d.querySelector('.bcpe-workspace #intro');
 intro.dispatchEvent(new app.win.MouseEvent('pointerdown',{bubbles:true}));
 menu.value='law';menu.dispatchEvent(new app.win.Event('change',{bubbles:true}));
 const panel=d.querySelector('.bcpe-law-edit-panel');
 assert.ok(panel,'deve abrir escolha de legislação pronta');
 const presets=panel.querySelector('select[aria-label="Lei pronta para inserir"]');
 assert.ok(presets);
 assert.equal(presets.options.length,3,'duas leis cadastradas e opção manual');
 assert.match(panel.querySelector('textarea').value,/Art. 1º A República Federativa/,'deve abrir a lei sugerida já preenchida');
 assert.match(panel.querySelector('textarea').value,/II - a cidadania/,'preservar incisos sem resumir');
 panel.querySelector('button.bcpe-primary').click();
 assert.equal(d.querySelector('.bcpe-law-edit-panel'),null);
 const root=d.querySelector('.bcpe-workspace');
 const sections=Array.from(root.children);
 const pos=sections.findIndex(b=>b.querySelector('details.bc-m01-lei-seca'));
 assert.ok(pos>0,'Lei Seca deve ser inserida após o parágrafo selecionado');
 assert.match(sections[pos-1].textContent,/Comentário do art. 1º/);
 assert.match(sections[pos+1].textContent,/Segundo parágrafo preservado/);
 const law=root.querySelector('details.bc-m01-lei-seca');
 assert.equal(law.querySelectorAll('details').length,0,'não criar aba dentro de aba');
 assert.equal(law.querySelectorAll('.bc-m01-lei-art p').length,3);
 assert.ok(law.querySelector('.bcpe-drag-handle'),'a Lei Seca também deve permitir arrastar');
 d.querySelector('[data-action="publish"]').click();await wait();
 const saved=app.calls.find(c=>c.options.method==='POST');
 assert.ok(saved);
 const html=JSON.parse(saved.options.body).html;
 assert.match(html,/CF\/88, art\. 1º/);
 assert.match(html,/II - a cidadania/);
 assert.doesNotMatch(html,/bcpe-drag-handle|bcpe-drag-target/,'não publicar controles');
 app.close();
});

test('Conteúdo completo Civil: Lei Seca pode ser criada manualmente sem inventar legislação',async()=>{
 const app=await setupLawFull('Civil'),d=app.win.document;
 const menu=d.querySelector('[data-insert]');
 assert.ok(menu.querySelector('option[value="law"]'));
 menu.value='law';menu.dispatchEvent(new app.win.Event('change',{bubbles:true}));
 const panel=d.querySelector('.bcpe-law-edit-panel');
 assert.ok(panel);
 assert.equal(panel.querySelector('select[aria-label="Lei pronta para inserir"]').disabled,true,'sem fonte local não criar lei fictícia');
 assert.equal(panel.querySelector('textarea').value,'');
 panel.querySelector('input[aria-label="Título da Lei Seca"]').value='Ver lei seca — artigo indicado';
 panel.querySelector('input[aria-label="Identificação do dispositivo"]').value='Dispositivo informado pelo professor';
 let area=panel.querySelector('textarea');area.value='Texto oficial fornecido pelo professor.\nParágrafo adicional.';
 area.dispatchEvent(new app.win.Event('input',{bubbles:true}));
 panel.querySelector('button.bcpe-primary').click();
 const law=d.querySelector('.bcpe-workspace details.bc-m01-lei-seca');
 assert.ok(law);
 assert.equal(law.querySelectorAll('.bc-m01-lei-art p').length,2);
 assert.match(law.textContent,/Texto oficial fornecido pelo professor/);
 app.close();
});
