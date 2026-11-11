import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {JSDOM} from 'jsdom';
const root=new URL('../',import.meta.url),read=p=>fs.readFileSync(new URL(p,root),'utf8');
function fixture(){
 const dom=new JSDOM('<!doctype html><html><body></body></html>',{url:'https://test.local',runScripts:'outside-only'});
 const g=dom.window;
 for(const p of ['ui/central-internal-question-policy-v1.js','ui/central-authorial-quiz-v1.js','ui/grounded-authorial-questions-v1.js','ui/adm-authorial-source-v1.js'])g.eval(read(p));
 return dom;
}
function lesson(n){
 const w={window:{}};const source=read('content/adm/m'+String(n).padStart(2,'0')+'-native-data-lite.js');
 new vm.Script(source).runInNewContext(w);
 return Object.values(w.window.ADM_NATIVE_CONTENT)[0];
}
test('ADM M01–M20: 10 questões autorais disponíveis por módulo, sem duplicação nem gabarito inventado',()=>{
 const dom=fixture(),source=dom.window.BcAdmAuthorialSource;
 const inventory=[];
 for(let n=1;n<=20;n++){
  const d=lesson(n),result=source.select(d.summaryHtml,d.completeAppendHtml),grounded=dom.window.BcGroundedQuestions.build({html:d.summaryHtml,title:d.title});
  const items=result.ready?result.items:grounded;
  inventory.push({n,count:items.length,objective:result.items.length,grounded:grounded.length,ready:items.length===10});
  if(items.length!==10)console.error('ADM_MISSING='+JSON.stringify(inventory.at(-1)));
  assert.equal(new Set(items.map(x=>x.q.toLowerCase().trim())).size,10,'M'+n+' duplicado');
  for(const q of items)assert.ok(dom.window.CentralAuthorialQuiz.valid(q),'M'+n+': '+q.q.slice(0,60));
 }
 console.log('ADM_AUTHORIAL_INVENTORY='+JSON.stringify(inventory));
 assert.equal(inventory.filter(x=>!x.ready).length,0,'ADM incompletos: '+JSON.stringify(inventory.filter(x=>!x.ready)));
 dom.window.close();
});
test('ADM separa leitura e 10+10 sem mexer nos arquivos autorais originais',()=>{
 const ui=read('ui/adm-native-layer.js'),html=read('index.html');
 assert.match(ui,/Resolver 10 questões autorais/);
 assert.match(ui,/10 questões de bancas reais · em breve/);
 assert.match(ui,/BcAdmAuthorialSource\?\.strip/);
 assert.match(ui,/openAuthorial\(uid\)/);
 assert.match(html,/adm-authorial-source-v1\.js/);
});
