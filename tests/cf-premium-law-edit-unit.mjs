import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';

const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const pause=(ms=40)=>new Promise(resolve=>setTimeout(resolve,ms));
const source=read('ui/editor-premium-v1.js');

async function setup({role='admin',remote=true}={}){
 const html='<div class="cf-apostila"><h2>Princípios</h2>'+
  '<p>A legalidade está no art. 5º, II, da Constituição Federal.</p>'+
  '<p>A forma federativa é protegida pelo art. 60, § 4º, I, da Constituição.</p></div>';
 const documentHtml='<!doctype html><html><body><div id="cf-native-reader" class="bc-native-reader-overlay">'+
  '<div class="bc-native-reader-title"><b>Direito Constitucional</b><small>Módulo 03</small></div>'+
  '<div class="bc-native-reader-tools"></div><article class="bc-native-article">'+html+'</article></div></body></html>';
 const dom=new JSDOM(documentHtml,{url:'https://app.basecompleta.com.br/',pretendToBeVisual:true,runScripts:'outside-only'});
 const w=dom.window,posts=[];let revision=5,latest=html;
 w.MutationObserver=class {observe(){}disconnect(){}};
 w.confirm=()=>true;
 w.fetch=async(url,options={})=>{
  if(String(url).includes('/api/auth'))return {ok:true,json:async()=>({authenticated:role!=='aluno',user:{role}})};
  if(options.method==='POST'){
   const payload=JSON.parse(options.body);posts.push(payload);
   latest=payload.html;revision++;return{ok:true,json:async()=>({revision})};
  }
  return {ok:true,json:async()=>({exists:remote,html:latest,revision})};
 };
 w.eval(read('content/cf/cf-teoria-guiada-lei-seca.js'));
 w.eval(read('content/cf/cf-ec141-extras.js'));
 w.eval(read('ui/cf-apostila-reading-v1.js'));
 w.eval(source);
 await pause();
 if(role!=='aluno'){
  const button=w.document.querySelector('.bcpe-launch');
  assert.ok(button,'editor não montou no leitor CF');
  button.click();await pause();
 }
 return {w,dom,posts,article:()=>w.document.querySelector('#cf-native-reader article'),
  workspace:()=>w.document.querySelector('.bcpe-workspace'),
  publish:async()=>{
   w.document.querySelector('[data-action="publish"]').click();await pause(100);
  }, close:()=>dom.window.close()};
}

test('CF M01–M15: botão de editar lei seca aparece e cada dispositivo é editável com publicação definitiva',async()=>{
 const app=await setup();
 const d=app.w.document;
 try{
  const btn=d.querySelector('[data-action="edit-law"]');
  assert.ok(btn,'botão de edição de lei seca ausente no conteúdo completo');
  const laws=app.workspace().querySelectorAll('details.cf-apostila-law-inline');
  assert.equal(laws.length,2,'versão publicada antiga precisa receber os dois artigos da CF');
  assert.ok(laws[0].open,'a lei deve abrir na edição');
  assert.ok(laws[0].querySelector('summary').hasAttribute('contenteditable'));
  assert.ok(laws[0].querySelector('.cf-apostila-law-body p').hasAttribute('contenteditable'));
  btn.click();
  const panel=d.querySelector('.bcpe-law-panel');
  assert.ok(panel,'não abriu editor do dispositivo constitucional');
  const selector=panel.querySelector('[aria-label="Dispositivo constitucional para editar"]');
  assert.equal(selector.options.length,2);
  const txt=panel.querySelector('[aria-label="Redação da Lei Seca"]');
  assert.match(txt.value,/ninguém será obrigado/i);
  const correction='II — Redação revisada pelo administrador da Central.';
  txt.value=correction;
  panel.querySelector('.bcpe-primary').click();
  assert.equal(app.posts.length,0,'aplicar ao rascunho não pode publicar');
  assert.match(app.workspace().textContent,/Redação revisada pelo administrador/);
  await app.publish();
  assert.equal(app.posts.length,1);
  assert.equal(app.posts[0].expectedRevision,5);
  assert.match(app.posts[0].html,/Redação revisada pelo administrador/);
  assert.match(app.posts[0].html,/data-bc-cf-editor-law="1"/);
  assert.doesNotMatch(app.posts[0].html,/data-bc-cf-auto-law="1"/,'lei automática não alterada não pode virar texto permanente');
  assert.match(app.article().textContent,/Redação revisada pelo administrador/);
  assert.equal(app.article().querySelectorAll('details.cf-apostila-law-inline').length,2,'os demais incisos devem reaparecer para os alunos');
  d.querySelector('.bcpe-launch').click();await pause();
  assert.match(app.workspace().textContent,/Redação revisada pelo administrador/,'reabrir o editor deve preservar alteração publicada');
 }finally{app.close()}
});

test('CF: digitação direta na lei seca também preserva alterações, sem persistir os outros blocos',async()=>{
 const app=await setup();try{
  const laws=app.workspace().querySelectorAll('details.cf-apostila-law-inline');
  laws[1].querySelector('.cf-apostila-law-body p').textContent='Forma federativa — versão ajustada';
  await app.publish();
  assert.equal(app.posts.length,1);
  assert.match(app.posts[0].html,/Forma federativa — versão ajustada/);
  assert.match(app.posts[0].html,/data-bc-cf-editor-law="1"/);
  assert.doesNotMatch(app.posts[0].html,/data-bc-cf-auto-law="1"/);
  assert.match(app.article().textContent,/Forma federativa — versão ajustada/);
 }finally{app.close()}
});

test('CF: aluno não recebe Editor Premium nem controles para alterar lei seca',async()=>{
 const app=await setup({role:'aluno'});
 try{
  assert.equal(app.w.document.querySelector('.bcpe-launch'),null);
  assert.equal(app.w.document.querySelector('[data-action="edit-law"]'),null);
 }finally{app.close()}
});
