import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {JSDOM,ResourceLoader,VirtualConsole} from 'jsdom';
const root=fileURLToPath(new URL('../',import.meta.url));
class LocalFiles extends ResourceLoader{
 fetch(url){
  const u=new URL(url);if(u.origin!=='http://rlm.test')return null;
  const p=path.resolve(root,'.'+decodeURIComponent(u.pathname));
  if(!p.startsWith(root)||!fs.existsSync(p))return null;
  return Promise.resolve(fs.readFileSync(p));
 }
}
test('leitor integrado abre os capítulos, revela exemplos, busca e preserva respostas',async()=>{
 const errors=[],vc=new VirtualConsole();
 vc.on('jsdomError',e=>{if(!e.message.includes('CSS stylesheet'))errors.push(e.message)});
 const dom=new JSDOM(fs.readFileSync(path.join(root,'preview-central-rlm-integrada.html'),'utf8'),{
  url:'http://rlm.test/preview-central-rlm-integrada.html',resources:new LocalFiles(),runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:vc,
  beforeParse(w){w.HTMLElement.prototype.scrollIntoView=function(){}}
 });
 try{
  await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('Prévia não carregou')),5000);dom.window.addEventListener('load',()=>{clearTimeout(timer);resolve()},{once:true})});
  const w=dom.window,doc=w.document;
  w.localStorage.setItem('central-v6:done:rlm-calculo-rapido-v6638','1');
  let tables=0,figures=0;
  for(let i=2;i<=15;i++){
   const id='M'+String(i).padStart(2,'0');w.RlmNative.open(id,'theory');
   assert.equal(doc.querySelectorAll('.bc-rlm-lesson').length,5,id);
   assert.equal(doc.querySelectorAll('.bc-rlm-worked').length,5,id);
   assert.equal(doc.querySelectorAll('.bc-rlm-method').length,5,id);
   tables+=doc.querySelectorAll('.bc-rlm-table').length;figures+=doc.querySelectorAll('.bc-rlm-figure').length;
   const example=doc.querySelector('.bc-rlm-worked');assert.equal(example.open,false);
   example.querySelector('summary').click();assert.equal(example.open,true,id+' revela resolução por clique');
   w.RlmNative.close();
  }
  assert.equal(tables,36);assert.equal(figures,10);
  w.RlmNative.open('M15','theory');w.RlmNative.search('variância');
  assert.ok(doc.querySelectorAll('mark[data-rlm-search]').length>0,'a busca encontra o conteúdo ampliado');
  w.RlmNative.close();w.RlmNative.open('M14','summary');
  assert.equal(doc.querySelectorAll('.bc-rlm-quiz').length,10);
  doc.querySelector('.bc-rlm-option').click();assert.ok(doc.querySelector('.bc-rlm-feedback'));
  assert.ok(w.localStorage.getItem('central-v6:rlm-tjce2026:answers:M14'));
  w.RlmNative.close();w.RlmNative.open('M14','summary');
  assert.ok(doc.querySelector('.bc-rlm-feedback'),'feedback reaparece ao reabrir o leitor');
  assert.equal(w.localStorage.getItem('central-v6:done:rlm-calculo-rapido-v6638'),'1');
  assert.deepEqual(errors,[]);
 }finally{dom.window.close()}
});
