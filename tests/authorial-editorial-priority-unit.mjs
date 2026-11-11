import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('M03 ADM e M01 CPC: 10 questões autorais inéditas, objetivas e comentadas, sem banca fictícia',()=>{
 const ctx={window:{}};
 for(const p of ['content/adm/m03-authorial10-v1.js','content/cpc/m01-authorial10-v1.js'])vm.runInNewContext(read(p),ctx);
 for(const [subject,items] of [['ADM M03',ctx.window.BC_ADM_AUTHORIAL_OVERRIDES[3]],['CPC M01',ctx.window.BC_CPC_AUTHORIAL_OVERRIDES[1]]]){
  assert.equal(items.length,10,subject);
  assert.equal(new Set(items.map(q=>q.q)).size,10,subject+' enunciados distintos');
  assert.equal(new Set(items.map(q=>q.id)).size,10,subject+' ids estáveis');
  for(const q of items){
   assert.equal(q.options.length,5);
   assert.equal(new Set(q.options).size,5);
   assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<5);
   assert.ok(q.explanation.length>=65);
   assert.ok(q.lawRef);
   assert.equal(q.provenance,'questao-autoral-IA-revisada');
   for(const key of ['banca','bank','official','real','sourceUrl'])assert.ok(!q[key],subject+' sem atribuição de concurso real');
  }
 }
 const ui=read('ui/cpc-authorial10-v1.js'),adm=read('ui/adm-authorial-source-v1.js'),index=read('index.html');
 assert.match(ui,/BC_CPC_AUTHORIAL_OVERRIDES/);
 assert.match(adm,/BC_ADM_AUTHORIAL_OVERRIDES/);
 assert.match(index,/m01-authorial10-v1\.js/);
 assert.match(index,/m03-authorial10-v1\.js/);
});

test('questões de IA no nível de prova: gabarito distribuído e alternativa certa sem "pista" de tamanho',()=>{
 const ctx={window:{}};
 for(const p of ['content/adm/m03-authorial10-v1.js','content/cpc/m01-authorial10-v1.js','content/rlm-tjce-2026/m01-authorial10.js'])vm.runInNewContext(read(p),ctx);
 const sets=[['ADM M03',ctx.window.BC_ADM_AUTHORIAL_OVERRIDES[3],true],['CPC M01',ctx.window.BC_CPC_AUTHORIAL_OVERRIDES[1],true],['RLM M01',ctx.window.BC_RLM_M01_AUTHORIAL,false]];
 for(const [subject,items,textual] of sets){
  const counts=[0,0,0,0,0];
  let longest=0;
  for(const q of Array.from(items)){
   assert.equal(q.options.length,5,subject+': cinco alternativas');
   counts[q.answer]++;
   const sizes=Array.from(q.options,x=>x.length);
   if(sizes[q.answer]===Math.max(...sizes)&&sizes.filter(x=>x===sizes[q.answer]).length===1)longest++;
  }
  // Nenhuma letra concentra o gabarito: cada uma aparece de 1 a 3 vezes em 10 questões.
  assert.ok(counts.every(n=>n>=1&&n<=3),subject+': gabarito concentrado '+JSON.stringify(counts));
  if(textual)assert.ok(longest<=3,subject+': a alternativa certa é a mais longa em '+longest+' de 10');
 }
});
