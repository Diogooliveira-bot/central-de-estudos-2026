import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const editorSource=readFileSync(new URL('../ui/editor-premium-v1.js',import.meta.url),'utf8');
const loaderSource=readFileSync(new URL('../central-v119.html',import.meta.url),'utf8');
const css=readFileSync(new URL('../ui/editor-premium-v1.css',import.meta.url),'utf8');
const wait=(ms=25)=>new Promise(r=>setTimeout(r,ms));

async function setup(role='admin',opts={}){
 const dom=new JSDOM('<!doctype html><html><body><div class="bc-native-reader-overlay">'+
  '<div class="bc-native-reader-title"><b>Direito Constitucional</b><small>Módulo 12</small></div>'+
  '<div class="bc-native-reader-tools"></div><article class="bc-native-article">'+
  '<h2>Título antigo</h2><p>Texto inicial.</p></article></div></body></html>',{
  url:'https://example.test/central-v119.html',runScripts:'outside-only',pretendToBeVisual:true
 });
 const win=dom.window;let posted=null,calls=[],savedRevision=0;
 win.MutationObserver=class{observe(){}disconnect(){}};
 win.confirm=()=>true;
 win.prompt=()=>null;
 win.fetch=async (uri,options={})=>{
  const path=String(uri);calls.push({path,options});
  if(path.startsWith('/api/auth'))return {ok:true,json:async()=>({authenticated:role!=='aluno',user:{role}})};
  if(path.includes('action=history')&&path.includes('revision=1')){
   return {ok:true,json:async()=>({html:'<h2>Versão anterior</h2><p>Histórico.</p>',revision:1})};
  }
  if(path.includes('action=history'))return {ok:true,json:async()=>({versions:[{revision:1,archivedAt:'2026-11-01T12:00:00Z'}]})};
  if(options.method==='POST'){
   posted=JSON.parse(options.body);
   if(opts.conflict)return {ok:false,status:409,json:async()=>({error:'Revisão divergente'})};
   savedRevision++;
   return {ok:true,json:async()=>({ok:true,revision:savedRevision})};
  }
  return {ok:true,json:async()=>({exists:false})};
 };
 win.eval(editorSource);
 await wait();
 return {dom,win,get posted(){return posted},calls,cleanup(){dom.window.close()}};
}

test('entrada de homologação carrega o novo editor sem remover o antigo',()=>{
 assert.match(loaderSource,/ui\/visual-editor-v1\.js/);
 assert.match(loaderSource,/ui\/editor-premium-v1\.js/);
 assert.match(loaderSource,/ui\/editor-premium-v1\.css/);
 assert.match(css,/bcpe-educational/);
});
test('estudantes não recebem o botão administrativo',async()=>{
 const app=await setup('aluno');
 assert.equal(app.win.document.querySelector('.bcpe-launch'),null);
 app.cleanup();
});
test('administrador abre tela isolada e publica card sem alterar título anterior',async()=>{
 const app=await setup(),d=app.win.document;
 assert.ok(d.querySelector('.bcpe-launch'));
 d.querySelector('.bcpe-launch').click();await wait();
 const insert=d.querySelector('[data-insert]');
 insert.value='atencao';insert.dispatchEvent(new app.win.Event('change',{bubbles:true}));
 const card=d.querySelector('.bcpe-workspace .bcpe-kind-atencao');
 assert.ok(card);assert.match(card.textContent,/ATENÇÃO/);
 assert.equal(d.querySelector('.bc-native-article h2').textContent,'Título antigo');
 d.querySelector('[data-action="publish"]').click();await wait();
 assert.ok(app.posted);assert.equal(app.posted.expectedRevision,0);
 assert.match(app.posted.html,/bcpe-kind-atencao/);
 assert.equal(d.querySelector('.bc-native-article h2').textContent,'Título antigo');
 assert.ok(d.querySelector('.bc-native-article .bcpe-kind-atencao'));
 app.cleanup();
});
test('editor pode alterar texto mas não encontra opção de imagem',async()=>{
 const app=await setup('editor'),d=app.win.document;
 d.querySelector('.bcpe-launch').click();await wait();
 assert.equal(d.querySelector('[data-insert] option[value="image"]'),null);
 assert.ok(d.querySelector('[data-insert] option[value="pegadinha"]'));
 app.cleanup();
});
test('importação de Markdown separa títulos, parágrafos e listas',async()=>{
 const app=await setup(),d=app.win.document;
 d.querySelector('.bcpe-launch').click();await wait();
 d.querySelector('[data-action="paste"]').click();
 const input=d.querySelector('.bcpe-paste-panel textarea');
 assert.ok(input);input.value='## Súmula Vinculante\nO **STF** aprova.\n- Decisões reiteradas\n- Dois terços';
 d.querySelector('.bcpe-paste-panel .bcpe-primary').click();
 assert.equal(d.querySelector('.bcpe-paste-panel'),null);
 assert.ok(d.querySelector('.bcpe-workspace h2.bcpe-node'));
 assert.ok(d.querySelector('.bcpe-workspace strong'));
 assert.equal(d.querySelectorAll('.bcpe-workspace li').length,2);
 app.cleanup();
});
test('409 não publica e preserva rascunho',async()=>{
 const app=await setup('admin',{conflict:true}),d=app.win.document;
 d.querySelector('.bcpe-launch').click();await wait();
 const insert=d.querySelector('[data-insert]');insert.value='decore';
 insert.dispatchEvent(new app.win.Event('change',{bubbles:true}));
 d.querySelector('[data-action="publish"]').click();await wait();
 assert.ok(d.querySelector('.bcpe-screen'));
 assert.match(d.querySelector('[data-status]').textContent,/Conflito/);
 assert.match(app.win.localStorage.getItem('bcpe:draft:v1:'+app.posted.id),/bcpe-kind-decore/);
 assert.equal(d.querySelector('.bc-native-article .bcpe-kind-decore'),null);
 app.cleanup();
});
test('historico carrega versão antiga como rascunho sem publicar',async()=>{
 const app=await setup(),d=app.win.document;app.win.prompt=()=> '1';
 d.querySelector('.bcpe-launch').click();await wait();
 d.querySelector('[data-action="versions"]').click();await wait();
 d.querySelector('.bcpe-versions button[data-revision="1"]').click();await wait();
 assert.match(d.querySelector('.bcpe-workspace').textContent,/Versão anterior/);
 assert.equal(app.posted,null);
 app.cleanup();
});
test('não utiliza API legada execCommand',()=>{
 assert.doesNotMatch(editorSource,/document\.execCommand/);
 assert.match(editorSource,/expectedRevision/);
 assert.match(editorSource,/contenteditable/);
});