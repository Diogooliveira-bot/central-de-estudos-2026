import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
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

// Todos os conjuntos de questões de IA já escritos: ADM (um arquivo por módulo), CPC M01 e RLM M01.
const admFiles=readdirSync(new URL('../content/adm/',import.meta.url)).filter(f=>/^m\d{2}-authorial10-v1\.js$/.test(f)).sort();
function aiSets({withRlm=true}={}){
 const ctx={window:{}};
 for(const f of admFiles)vm.runInNewContext(read('content/adm/'+f),ctx);
 vm.runInNewContext(read('content/cpc/m01-authorial10-v1.js'),ctx);
 if(withRlm)vm.runInNewContext(read('content/rlm-tjce-2026/m01-authorial10.js'),ctx);
 const sets=admFiles.map(f=>{const n=Number(f.slice(1,3));return ['ADM M'+f.slice(1,3),ctx.window.BC_ADM_AUTHORIAL_OVERRIDES[n],true]});
 sets.push(['CPC M01',ctx.window.BC_CPC_AUTHORIAL_OVERRIDES[1],true]);
 if(withRlm)sets.push(['RLM M01',ctx.window.BC_RLM_M01_AUTHORIAL,false]);
 return sets;
}

test('ADM: cada módulo com questões de IA tem 10 itens válidos, ids próprios e está carregado no index',()=>{
 const index=read('index.html');
 assert.ok(admFiles.length>=4,'ao menos M01, M02, M03 e M04');
 for(const [subject,items] of aiSets({withRlm:false}).filter(([s])=>s.startsWith('ADM'))){
  const nn=subject.slice(-2);
  assert.equal(items.length,10,subject);
  assert.equal(new Set(items.map(q=>q.q)).size,10,subject+' enunciados distintos');
  assert.ok(items.every((q,i)=>q.id==='adm-m'+nn+'-autoral-'+String(i+1).padStart(2,'0')),subject+' ids');
  for(const q of items){
   assert.equal(new Set(q.options).size,5,subject);
   assert.ok(q.lawRef&&q.explanation.length>=150,subject+' comentário completo');
   assert.equal(q.provenance,'questao-autoral-IA-revisada');
   for(const key of ['banca','bank','official','real','sourceUrl'])assert.ok(!q[key],subject+' sem atribuição de concurso real');
  }
  assert.match(index,new RegExp('/content/adm/m'+nn+'-authorial10-v1\\.js\\?v='),subject+' carregado no index');
 }
});

test('questões de IA no nível de prova: gabarito distribuído e alternativa certa sem "pista" de tamanho',()=>{
 for(const [subject,items,textual] of aiSets()){
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

test('comentários jurídicos: toda lei citada vem com o nome e todo artigo citado vem com o que ele diz',()=>{
 for(const [subject,items] of aiSets({withRlm:false})){
  Array.from(items).forEach((q,i)=>{
   for(const field of ['q','explanation','lawRef']){
    const text=q[field];
    const laws=new Set(text.match(/Lei \d[\d.]*\/\d{4}/g)||[]);
    for(const law of laws){
     const at=[...text.matchAll(new RegExp(law.replace(/[.\/]/g,'\\$&'),'g'))].map(m=>m.index);
     const named=at.some(k=>text.slice(k+law.length,k+law.length+2)===' ('||/\([^()]*$/.test(text.slice(Math.max(0,k-60),k)));
     assert.ok(named,`${subject} ${i+1} (${field}): "${law}" citada sem dizer qual lei é`);
    }
   }
   if(/\bart(s)?\.\s*\d/.test(q.explanation))assert.match(q.explanation,/\bdiz\b|"/,`${subject} ${i+1}: artigo citado sem dizer o que está escrito`);
  });
 }
});
