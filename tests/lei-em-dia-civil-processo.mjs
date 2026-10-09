import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const root=new URL('../',import.meta.url);
for(const discipline of ['civil','cpc']){
 const ctx=vm.createContext({});
 for(const path of [`tools/decorando-data-${discipline}.js`,`tools/decorando-data-${discipline}-leis.js`])vm.runInContext(readFileSync(new URL(path,root),'utf8'),ctx);
 const base=vm.runInContext(`DATA_${discipline.toUpperCase()}`,ctx),added=vm.runInContext(`DATA_${discipline.toUpperCase()}_LEIS`,ctx),topics=vm.runInContext(`TOPICS_${discipline.toUpperCase()}_LEIS`,ctx);
 const report=JSON.parse(readFileSync(new URL(`audits/lei-em-dia-${discipline}-20261008.json`,root)));
 test(discipline+' — integridade, dispositivos e fontes',()=>{
  assert.equal(base.length,discipline==='civil'?1056:2620);assert.equal(added.length,discipline==='civil'?145:142);
  assert.equal(new Set([...base,...added].map(q=>q.id)).size,base.length+added.length);
  assert.equal(report.answerConflicts.length,0);
  const devices=new Set();
  for(const q of added){
   assert.equal(q.discipline,discipline);assert.equal(typeof q.question.answer,'boolean');
   assert.ok(q.question.statement.length>20);assert.ok(q.parts[0].length>20);
   assert.equal(q.question.explanation,q.parts[0]);
   assert.ok(topics.find(t=>t.id===q.topicId)?.subtopics.includes(q.subtopic));
   assert.ok(!/https?:\/\/|Gabarito:|Decorando a Lei Seca|\(\s*\)\s*(Verdadeiro|Falso)/.test(q.question.statement+' '+q.parts[0]),q.id);
   assert.ok(!/^(Substituto|Nacional Unificado|\()/.test(q.question.statement),q.id);
   for(const device of report.deviceReview.retained[q.id]){assert.ok(!devices.has(device),device);devices.add(device);}
  }
  for(const source of report.sources)assert.equal(added.filter(q=>q.question.source.startsWith(source.pdf+' ·')).length,source.imported);
  for(const x of report.deviceReview.removed)assert.ok(x.keptIds.every(id=>[...base,...added].some(q=>q.id===id)));
  const offline=JSON.parse(readFileSync(new URL('central-offline-files-v66172.json',root)));
  assert.ok(offline.files.includes(`/tools/decorando-data-${discipline}-leis.js?v=20261008civil1`));
 });
test(discipline+' — filtros, respostas e progresso, resposta e recarga preservam o progresso anterior',()=>{
  const html=readFileSync(new URL('tools/decorando.html',root),'utf8');
  const priorId=base[0].id,attempt={date:'2026-10-08T12:00:00.000Z',choice:true,correct:true};
  const storage=new Map([['lei-seca-enxuta-state',JSON.stringify({attempts:{[priorId]:[attempt]},notes:{[priorId]:'Minha anotação'},preferences:{discipline}})]]);
  const makeContext=()=>{
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
  };
  let context=makeContext();
  assert.equal(vm.runInContext('allActive().length',context),base.length+added.length+(discipline==='cpc'?17:0));
  for(const topic of topics){
    vm.runInContext(`centralOpenTopic(${JSON.stringify(topic.id)},true)`,context);
    const items=vm.runInContext('visible()',context);
    assert.equal(items.length,added.filter(q=>q.topicId===topic.id).length);
    assert.ok(items.every(q=>q.topicId===topic.id));
  }
  const target=added[0];
  vm.runInContext(`centralOpenTopic(${JSON.stringify(target.topicId)},true); answerFocus(${target.question.answer});`,context);
  assert.equal(vm.runInContext(`saved.attempts[${JSON.stringify(target.id)}][0].correct`,context),true);
  assert.equal(vm.runInContext(`saved.attempts[${JSON.stringify(priorId)}].length`,context),1);
  context=makeContext();
  assert.equal(vm.runInContext(`saved.notes[${JSON.stringify(priorId)}]`,context),'Minha anotação');
  assert.equal(vm.runInContext(`saved.attempts[${JSON.stringify(target.id)}].length`,context),1);
});

}
