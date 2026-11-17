import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';
const source=readFileSync('ui/tablet-scale-v1.js','utf8');
function boot(t,{width=390,saved=null,storageFails=false}={}){
 const dom=new JSDOM('<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><div id="centralSettingsBackdrop"><div class="central-settings-body"></div></div></body></html>',{url:'https://central.test',runScripts:'outside-only'});
 const w=dom.window;t.after(()=>w.close());
 Object.defineProperty(w,'innerWidth',{value:width,writable:true});
 w.matchMedia=()=>({matches:false});
 if(saved!==null)w.localStorage.setItem('central-v6:ui-scale:v1',saved);
 if(storageFails)Object.defineProperty(w,'localStorage',{get(){throw Error('disabled')}});
 w.eval(source);return w;
}
const scale=w=>Number(w.document.documentElement.style.getPropertyValue('--bc-ui-scale'));
test('Automático cresce também no celular, mantendo o viewport real',t=>{
 for(const width of [360,390,430,768,820,1024,1366,1920,2560]){
  const w=boot(t,{width});assert.equal(w.BCUiScale.get(),0);assert.ok(scale(w)>1);
  assert.equal(w.document.querySelector('meta').content,'width=device-width,initial-scale=1');
 }
});
test('cada escolha aplica uma escala distinta e preserva valores antigos',t=>{
 for(const saved of [0,1,1.15,1.3]){const w=boot(t,{saved});assert.equal(w.BCUiScale.get(),saved);assert.equal(scale(w),saved||1.0625);}
 const w=boot(t);const sizes=[0,1,1.15,1.3].map(s=>{w.BCUiScale.set(s);return scale(w)});assert.equal(new Set(sizes).size,4);
 assert.equal(w.localStorage.getItem('central-v6:ui-scale:v1'),'1.3');
});
test('valores desconhecidos voltam ao Automático',t=>{const w=boot(t,{saved:'abc'});assert.equal(w.BCUiScale.get(),0);w.BCUiScale.set(7);assert.equal(w.BCUiScale.get(),0);});
test('armazenamento bloqueado mantém escolha durante a sessão',t=>{const w=boot(t,{storageFails:true});w.BCUiScale.set(1.3);assert.equal(w.BCUiScale.get(),1.3);assert.equal(scale(w),1.3);});
test('resize, orientação e restauração recalculam sem recarregar',async t=>{
 const w=boot(t);w.innerWidth=1920;w.dispatchEvent(new w.Event('resize'));await new Promise(r=>setTimeout(r,110));assert.equal(scale(w),1.2);
 w.BCUiScale.set(1.15);w.innerWidth=820;w.dispatchEvent(new w.Event('orientationchange'));await new Promise(r=>setTimeout(r,110));assert.equal(scale(w),1.15);
 w.dispatchEvent(new w.Event('pageshow'));assert.equal(scale(w),1.15);
});
test('preferência alterada em outra aba atualiza o controle',t=>{const w=boot(t);w.BCUiScale.set(1.15);w.localStorage.setItem('central-v6:ui-scale:v1','1.3');w.dispatchEvent(new w.StorageEvent('storage',{key:'central-v6:ui-scale:v1'}));assert.equal(scale(w),1.3);});
test('controle tem quatro opções, opera imediatamente e informa a opção ativa',async t=>{
 const w=boot(t);await new Promise(r=>setTimeout(r,20));const block=w.document.querySelector('#bcUiScale');assert.ok(block);assert.equal(block.querySelectorAll('button').length,4);
 block.querySelector('[data-bc-ui-scale="1.3"]').click();assert.equal(scale(w),1.3);assert.equal(block.querySelector('.is-active').getAttribute('aria-pressed'),'true');
});
test('tipografia compartilhada não depende de zoom ou alteração dinâmica de viewport',()=>{
 const css=readFileSync('ui/auto-scale-v1.css','utf8');assert.doesNotMatch(css,/\bzoom\s*:/);assert.doesNotMatch(source,/setAttribute\('content'/);
 assert.match(css,/--bc-ui-scale/);assert.match(css,/student-reader-active/);assert.match(css,/minmax\(min\(100%,27rem\)/);
 assert.match(readFileSync('sync-local-state.js','utf8'),/central-v6:ui-scale/);
});
