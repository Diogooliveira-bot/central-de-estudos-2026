import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const root=new URL('../',import.meta.url),ctx=vm.createContext({});
for(const path of ['tools/decorando-data-cf.js','tools/decorando-data-cf-leis.js']) vm.runInContext(readFileSync(new URL(path,root),'utf8'),ctx);
const base=vm.runInContext('DATA_CF',ctx),added=vm.runInContext('DATA_CF_LEIS',ctx),topics=vm.runInContext('TOPICS_CF_LEIS',ctx);
const report=JSON.parse(readFileSync(new URL('audits/lei-em-dia-constitucional-20261008.json',root)));
const signature=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');

test('98 questões novas em oito leis; IDs anteriores preservados',()=>{
  assert.equal(base.length,3034);assert.equal(added.length,98);assert.equal(topics.length,8);
  assert.equal(new Set([...base,...added].map(q=>q.id)).size,3132);
  const seen=new Set(base.map(q=>signature(q.question.statement)));
  for(const q of added){assert.ok(!seen.has(signature(q.question.statement)),q.id);seen.add(signature(q.question.statement));}
  for(const source of report.sources)assert.equal(added.filter(q=>q.question.source.startsWith(source.pdf+' ·')).length,source.imported);
});
test('cada questão tem gabarito, fundamento, origem e filtro utilizáveis',()=>{
  for(const q of added){
    assert.equal(q.discipline,'cf');assert.equal(typeof q.question.answer,'boolean');
    assert.ok(q.question.statement.length>20);assert.ok(q.parts[0].length>20);
    assert.equal(q.question.explanation,q.parts[0]);
    assert.ok(topics.find(t=>t.id===q.topicId)?.subtopics.includes(q.subtopic));
    assert.ok(!/https?:\/\/|Gabarito:|Decorando a Lei Seca|\(\s*\)\s*(Verdadeiro|Falso)|\d{2}\/\d{2}\/2026,/.test(q.question.statement+' '+q.parts[0]),q.id);
    assert.ok(!q.question.statement.startsWith('('),q.id+' contém cargo no enunciado');
    assert.ok(['real','authorial'].includes(q.origin));
    if(q.origin==='real'){assert.ok(q.question.bank);assert.ok(Number.isInteger(q.question.year),q.id);}
    else {assert.equal(q.question.bank,'Exercício da fonte fornecida');assert.equal(q.question.origin,'authorial');}
  }
});
test('exclusões e duplicatas estão documentadas sem inventar respostas',()=>{
  assert.equal(report.duplicates.length,5);assert.equal(report.excluded.length,3);assert.equal(report.answerConflicts.length,0);
  for(const q of report.excluded)assert.ok(!added.some(a=>a.question.source.startsWith(q.pdf+' · questão '+q.question+' ·')));
});

test('revisão remove repetições de dispositivo e mantém incisos distintos',()=>{
  assert.equal(report.deviceReview.removedCount,200);
  const device=r=>r.toUpperCase().replace(/,?\s*LEI.*$/, '').replace(/[º°"“”]/g,'').replace(/\s+/g,'').replace(/,ADPF$/,'');
  const seen=new Set();
  for(const q of added){
    const key=q.topicId+'|'+device(q.number);
    assert.ok(!seen.has(key),'Dispositivo repetido: '+key);seen.add(key);
  }
  const ms=added.filter(q=>q.topicId==='cf-lei-12016');
  for(const inciso of ['I','II','III'])assert.ok(ms.some(q=>device(q.number)==='ART.5,'+inciso),'Inciso '+inciso+' do art. 5º removido');
  const adi=added.filter(q=>q.topicId==='cf-lei-9868');
  for(const inciso of ['I','II','IX'])assert.ok(adi.some(q=>device(q.number)==='ART.2,'+inciso));
  assert.ok(added.every(q=>!report.deviceReview.removed.some(x=>x.id===q.id)));
  for(const removal of report.deviceReview.removed){
    assert.ok(removal.keptIds.length>0);
    assert.ok(removal.keptIds.every(id=>added.some(q=>q.id===id)));
  }
});
test('interface e pacote offline carregam as leis mantendo a chave do progresso',()=>{
  const html=readFileSync(new URL('tools/decorando.html',root),'utf8');
  assert.ok(html.includes('...DATA_CF,...DATA_CF_LEIS,'));assert.ok(html.includes('cf:TOPICS_CF_EXTENDED'));
  assert.ok(html.includes('const TOPICS_CF_EXTENDED = [...TOPICS_CF,...TOPICS_CF_LEIS]'));
  assert.equal((html.match(/<script src="\.\/decorando-data-cf-leis\.js/g)||[]).length,1);
  assert.ok(html.includes('const STORAGE_KEY = "lei-seca-enxuta-state"'));
  const offline=JSON.parse(readFileSync(new URL('central-offline-files-v66172.json',root)));
  assert.ok(offline.files.includes('/tools/decorando-data-cf-leis.js?v=20261008cf1'));
});

test('filtros das oito leis, resposta e recarga preservam o progresso anterior',()=>{
  const html=readFileSync(new URL('tools/decorando.html',root),'utf8');
  const priorId=base[0].id,attempt={date:'2026-10-08T12:00:00.000Z',choice:true,correct:true};
  const storage=new Map([['lei-seca-enxuta-state',JSON.stringify({attempts:{[priorId]:[attempt]},notes:{[priorId]:'Minha anotação'},preferences:{discipline:'cf'}})]]);
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
  assert.equal(vm.runInContext('allActive().length',context),3132);
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
