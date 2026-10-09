import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const root=new URL('../',import.meta.url),html=readFileSync(new URL('tools/decorando.html',root),'utf8');
const c=vm.createContext({});vm.runInContext(readFileSync(new URL('tools/decorando-data-restantes.js',root),'utf8'),c);
const data=vm.runInContext('DATA_RESTANTES',c),topicMap=vm.runInContext('TOPICS_RESTANTES',c);
const report=JSON.parse(readFileSync(new URL('audits/lei-em-dia-restantes-20261009.json',root)));
const expected={penal:147,cpp:50,trabalho:165,ptrabalho:69,cpc:17};
const storage=new Map();
function makeContext(){
 const document={documentElement:{dataset:{}},addEventListener(){},getElementById(){return null}};
 const window={scrollTo(){},addEventListener(){}};
 const localStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)};
 const context=vm.createContext({document,window,localStorage,URLSearchParams,location:{search:''},setTimeout,clearTimeout});
 for(const m of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)){
  const external=m[1].match(/src="\.\/(decorando-data-[^"?]+)(?:\?[^" ]*)?"/);
  if(external)vm.runInContext(readFileSync(new URL('tools/'+external[1],root),'utf8'),context);
  else if(m[2].includes('const TOPICS_CF')||m[2].includes('const DATA_ADM_EXTRAS'))vm.runInContext(m[2].replace(/\nrender\(\);\s*$/, '\nrender=()=>{};'),context);
 }
 return context;
}
test('448 itens preservam fontes, gabaritos e dispositivos únicos por disciplina',()=>{
 assert.equal(data.length,448);assert.equal(report.answerConflicts.length,0);
 const seen=new Set();
 for(const q of data){
  assert.equal(typeof q.question.answer,'boolean');assert.ok(q.question.statement.length>20);assert.ok(q.parts[0].length>20);
  assert.equal(q.question.explanation,q.parts[0]);
  assert.ok(topicMap[q.discipline].find(t=>t.id===q.topicId)?.subtopics.includes(q.subtopic));
  assert.ok(!/Gabarito:|Decorando a Lei Seca|vade-mecum-de-questoes|\(\s*\)\s*(Verdadeiro|Falso)/.test(q.question.statement+' '+q.parts[0]),q.id);
  assert.ok(!/^(Social|Complementar|Federal|Substituto|Administrativos)\s*\(/.test(q.question.statement),q.id);
  if(q.origin==='real'){assert.ok(Number.isInteger(q.question.year),q.id);assert.ok(q.question.bank);}
  else assert.equal(q.question.bank,'Exercício da fonte fornecida');
  for(const device of report.deviceReview.retained[q.id]){const key=q.discipline+'|'+device;assert.ok(!seen.has(key),key);seen.add(key);}
 }
 for(const [d,n] of Object.entries(expected))assert.equal(data.filter(q=>q.discipline===d).length,n);
 for(const src of report.sources){assert.ok(src.url.startsWith('https://drive.google.com/file/d/'));assert.equal(data.filter(q=>q.discipline===src.discipline&&q.question.source.startsWith(src.pdf+' ·')).length,src.imported);}
});
test('novas disciplinas, filtros e estatísticas funcionam com o banco existente',()=>{
 const context=makeContext();const all=vm.runInContext('DATA',context);
 assert.equal(new Set(all.map(q=>q.id)).size,all.length);
 for(const [discipline,topics] of Object.entries(topicMap)){
  assert.ok(vm.runInContext(`DISCIPLINES[${JSON.stringify(discipline)}]`,context));
  for(const topic of topics){
   vm.runInContext(`centralOpenTopic(${JSON.stringify(topic.id)},true)`,context);
   assert.equal(vm.runInContext('currentDiscipline().id',context),discipline);
   const visible=vm.runInContext('visible()',context);
   assert.equal(visible.length,data.filter(q=>q.topicId===topic.id).length);
   assert.ok(visible.every(q=>q.discipline===discipline));
  }
  assert.equal(vm.runInContext('totalCount()',context),all.filter(q=>q.discipline===discipline).length);
 }
 for(const key of ['cf','civil','adm']){
  const topic=vm.runInContext(`TOPICS_BY_DISCIPLINE.${key}[0].id`,context);
  vm.runInContext(`centralOpenTopic(${JSON.stringify(topic)},true)`,context);assert.equal(vm.runInContext('currentDiscipline().id',context),key);
 }
});
test('respostas e notas antigas sobrevivem à inclusão e à recarga',()=>{
 let context=makeContext();const old=vm.runInContext('DATA_CIVIL[0].id',context);
 vm.runInContext(`saved.notes[${JSON.stringify(old)}]='Anotação anterior';save();`,context);
 for(const discipline of ['trabalho','ptrabalho']){
  const q=data.find(q=>q.discipline===discipline);
  vm.runInContext(`centralOpenTopic(${JSON.stringify(q.topicId)},true);answerFocus(${q.question.answer});`,context);
  assert.equal(vm.runInContext(`saved.attempts[${JSON.stringify(q.id)}][0].correct`,context),true);
 }
 context=makeContext();assert.equal(vm.runInContext(`saved.notes[${JSON.stringify(old)}]`,context),'Anotação anterior');
 for(const d of ['trabalho','ptrabalho']){const q=data.find(q=>q.discipline===d);assert.equal(vm.runInContext(`saved.attempts[${JSON.stringify(q.id)}].length`,context),1);}
});
test('parte cível dos Juizados não é apresentada como criminal e pendências são explícitas',()=>{
 assert.ok(data.filter(q=>q.question.source.startsWith('61.pdf')).every(q=>q.discipline==='cpc'));
 assert.ok(report.missingSources.penal.some(s=>s.includes('parte criminal')));
 assert.ok(report.missingSources.trabalho.some(s=>s.startsWith('CLT')));
 const offline=JSON.parse(readFileSync(new URL('central-offline-files-v66172.json',root)));
 assert.ok(offline.files.includes('/tools/decorando-data-restantes.js?v=20261009rest1'));
 for(const x of report.deviceReview.removed)assert.ok(x.keptIds.length>0);
});
