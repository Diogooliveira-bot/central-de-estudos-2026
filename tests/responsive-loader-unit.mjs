import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {JSDOM} from 'jsdom';
const source=readFileSync('central-discipline-loader.js','utf8');
function setup(t,fetch){
 const dom=new JSDOM('<!doctype html><html><head></head><body></body></html>',{url:'https://central.test',runScripts:'dangerously',pretendToBeVisual:true});t.after(()=>dom.window.close());
 const w=dom.window;w.__centralDisciplineFiles={adm:['/one.js?v=1','/two.js?v=1']};w.fetch=fetch;w.AbortController=AbortController;w.eval(source);return w;
}
const response=body=>({ok:true,status:200,text:async()=>body});
test('executa em ordem sem esperar o último download; requisição concorrente é reutilizada',async t=>{
 let finish;const second=new Promise(r=>finish=r),calls=[];
 const w=setup(t,async url=>{calls.push(url);return url.includes('one.js')?response('window.order=[1];'):await second;});
 const a=w.CentralDisciplineLoader.load('adm'),b=w.CentralDisciplineLoader.load('adm');assert.equal(a,b);
 await new Promise(r=>setTimeout(r,20));assert.deepEqual([...w.order],[1]);
 finish(response('window.order.push(2);window.AdmNative={};'));await a;
 assert.deepEqual([...w.order],[1,2]);assert.equal(calls.length,2);assert.equal(w.CentralDisciplineLoader.isReady('adm'),true);
 await w.CentralDisciplineLoader.load('adm');assert.equal(calls.length,2);
});
test('falha de download permite repetir sem reexecutar scripts já concluídos',async t=>{
 let fail=true,count=0;
 const w=setup(t,async url=>{if(url.includes('one.js')){count++;return response('window.executions=(window.executions||0)+1;')}await new Promise(r=>setTimeout(r,5));if(fail)throw Error('offline');return response('window.AdmNative={};');});
 w.console.error=()=>{};await assert.rejects(w.CentralDisciplineLoader.load('adm'));assert.equal(w.executions,1);
 fail=false;await w.CentralDisciplineLoader.load('adm');assert.equal(w.executions,1);assert.equal(count,1);
});
test('403 Premium não é ignorado fora do Gratuito',async t=>{
 const w=setup(t,async()=>({ok:false,status:403}));w.console.error=()=>{};await assert.rejects(w.CentralDisciplineLoader.load('adm'),/403/);assert.equal(w.CentralDisciplineLoader.isReady('adm'),false);
});
test('catálogo é regenerável e só contém número e título públicos',()=>{
 execFileSync(process.execPath,['scripts/build-module-catalog.mjs','--check']);const w={};new Function('window',readFileSync('central-module-catalog.js','utf8'))(w);
 const counts={cf:15,adm:20,civil:15,penal:17,cpc:20,cpp:22};
 for(const [id,count] of Object.entries(counts)){assert.equal(w.CentralModuleCatalog[id].length,count);for(const m of w.CentralModuleCatalog[id])assert.deepEqual(Object.keys(m),['number','title']);}
});
test('lista pública aparece sem baixar teoria; abrir módulo usa o carregador autorizado',async t=>{
 const dom=new JSDOM('<main id="homeView"><div><div id="subjects"><section class="subject central-subject-pending" data-id="adm"><button class="subject-head"><span class="subject-name">ADM</span></button><div class="subject-body"></div></section></div></div></main>',{url:'https://central.test',runScripts:'outside-only',pretendToBeVisual:true});const w=dom.window;t.after(()=>w.close());w.HTMLElement.prototype.scrollIntoView=()=>{};
 let loads=0,resolveLoad;w.CentralModuleCatalog={adm:[{number:1,title:'Título atual'}]};let ready=false;
 w.CentralDisciplineLoader={isReady:()=>ready,isLoading:()=>loads>0,hasError:()=>false,load:()=>{loads++;return new Promise(r=>resolveLoad=()=>{ready=true;w.document.querySelector('.subject-body').innerHTML='<div class="topic-item" data-uid="adm-01"><button class="open-topic">Abrir</button><span class="topic-title">Título atual</span></div>';r();})}};
 w.eval(readFileSync('ui/disciplinas-foco-v1.js','utf8'));await new Promise(r=>setTimeout(r,20));w.BaseCompletaFocusNavigation.chooseSubject('adm');await new Promise(r=>setTimeout(r,30));
 assert.equal(loads,0);assert.equal(w.document.querySelectorAll('.bc-focus-module-card').length,1);
 const promise=w.BaseCompletaFocusNavigation.openModule(0);assert.equal(loads,1);w.BaseCompletaFocusNavigation.backToSubjects();resolveLoad();await promise;assert.equal(w.BaseCompletaFocusNavigation.state.stage,'choose');
});
