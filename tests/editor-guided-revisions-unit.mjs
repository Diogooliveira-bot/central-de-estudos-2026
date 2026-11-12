import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { contentEditorReadFeature } from '../lib/content-editor-access.js';

const premium=readFileSync(new URL('../ui/editor-premium-v1.js',import.meta.url),'utf8');
const legacy=readFileSync(new URL('../ui/visual-editor-v1.js',import.meta.url),'utf8');
const wait=(ms=55)=>new Promise(resolve=>setTimeout(resolve,ms));

async function setup(subject='Civil',role='admin',remote=null){
 const guided=subject!=='Penal';
 const label='Teoria guiada de Direito '+subject+', módulo 3';
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
