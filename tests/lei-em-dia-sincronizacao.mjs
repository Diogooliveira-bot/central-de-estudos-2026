import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {leiRuntime} from '../scripts/lei-em-dia-runtime.mjs';
const root=new URL('../',import.meta.url),read=p=>fs.readFileSync(new URL(p,root),'utf8');
const context=leiRuntime(root),data=vm.runInContext('DATA',context),index=vm.runInContext('CENTRAL_LAW_MODULES',context);
const report=JSON.parse(read('audits/lei-em-dia-sincronizacao-20261009.json'));
const allModules=[...index.modules,...index.complement],expected={cf:15,adm:20,civil:15,cpc:20,penal:17,cpp:22,trabalho:18,ptrabalho:11};
const asJSON=x=>JSON.parse(JSON.stringify(x));
test('138 módulos centrais e lote jurídico aprovado correspondem à matriz corrente',()=>{
 const approved=vm.runInContext('DATA_LED_APPROVED',context);
 assert.equal(data.length,12044+approved.length);assert.equal(index.modules.length,138);assert.equal(new Set(data.map(q=>q.id)).size,data.length);
 assert.ok(approved.every(q=>q.id.startsWith('LED-')&&q.origin==='authorial'&&q.question?.source?.startsWith('https://')));
 assert.equal(!!vm.runInContext('DISCIPLINES.consumidor',context),approved.some(q=>q.discipline==='consumidor'));
 for(const [d,n] of Object.entries(expected))assert.equal(index.modules.filter(m=>m.discipline===d).length,n);
 const sourceJSON=p=>JSON.parse(read(p).split('=').slice(1).join('=').trim().replace(/;$/,''));
 for(const d of ['civil','cpp','adm']){
  const native=sourceJSON(`content/${d}/${d}-native-index.js`).modules;
  for(const m of Array.isArray(native)?native:Object.values(native)){
   const target=index.modules.find(x=>x.id===m.uid);assert.equal(target.title,m.title);assert.equal(target.number,m.number);
  }
 }
 const penal=index.modules.filter(m=>m.discipline==='penal');assert.equal(penal.find(m=>m.number===3).title,'Teoria do Crime');assert.equal(penal.find(m=>m.number===14).title,'Abuso de Autoridade');
 assert.equal(new Set(index.modules.map(m=>m.id)).size,138);
});
test('nenhuma questão desaparece ou cruza de disciplina nos vínculos',()=>{
 const byId=new Map(data.map(q=>[q.id,q])),covered=new Set();
 for(const m of allModules){
  assert.equal(new Set(m.questionIds).size,m.questionIds.length);
  for(const id of m.questionIds){assert.equal(byId.get(id)?.discipline,m.discipline,id);covered.add(id);}
 }
 assert.equal(covered.size,data.length);
 for(const m of report.modules)assert.equal(m.questions,index.modules.find(x=>x.id===m.id).questionIds.length);
});
test('todos os módulos abrem seus próprios recortes, incluindo os vazios',()=>{
 const c=leiRuntime(root);
 for(const m of allModules){
  assert.equal(vm.runInContext(`centralOpenModule(${JSON.stringify(m.id)},${JSON.stringify(m.discipline)},true)`,c),true,m.id);
  assert.equal(vm.runInContext('currentDiscipline().id',c),m.discipline);
  const qs=vm.runInContext('visible()',c);
  assert.deepEqual(asJSON(qs.map(q=>q.id).sort()),asJSON([...m.questionIds].sort()),m.id);
  assert.equal(vm.runInContext('statusCounts().all',c),m.questionIds.length);
  assert.ok(vm.runInContext('renderStudy()',c).includes(m.title.replace(/&/g,'&amp;'))||m.title.includes('—'));
  if(!m.questionIds.length)assert.ok(vm.runInContext('emptyStudy()',c).includes('ainda não possui questões vinculadas'));
 }
});
test('recortes jurídicos centrais não confundem módulos antigos com a numeração atual',()=>{
 const c=leiRuntime(root);
 for(const [id,check] of [
  ['pen-m03',q=>q.discipline==='penal'&&/Art\.\s*(?:1[3-9])\b/.test(q.number)],
  ['pen-m14',q=>q.topicId==='pen-lei-13869'],
  ['cpp-m03',q=>q.topicId==='cpp-lei-12830'],
  ['cpp-m12',q=>Number(q.number.match(/\d+/)?.[0])===155],
  ['cpc-m19',q=>q.topicId==='cpc-lei-12016'],
  ['civil-m14',q=>q.topicId==='civ-lei-11804'],
  ['trab-m18',q=>q.topicId==='trab-lei-7783'],
  ['ptra-a07',q=>q.topicId==='ptrab-lei-6830']
 ]){vm.runInContext(`centralOpenModule(${JSON.stringify(id)},null,true)`,c);assert.ok(vm.runInContext('visible()',c).some(check),id);}
 vm.runInContext("centralOpenTopic('pen-m03',true)",c);assert.equal(vm.runInContext("[...ui.selectedModules][0]",c),'pen-m03');
 assert.ok(!vm.runInContext("qcOptions('topic').some(o=>/^Módulo /.test(o.label))",c));
});
test('rotas da Central preservam módulo e aliases de Trabalho',()=>{
 const source=read('index.html').match(/<script id="central-offline-folder-router-v6659">([\s\S]*?)<\/script>/)[1];
 const c=vm.createContext({URLSearchParams,window:{}});vm.runInContext(source,c);
 const cases=[['civil','civ-familia','civil'],['adm','adm-06-06-processo-administrativo-lei-9-784','adm'],['cpp','cpp-m03','cpp'],['trab','trab-m18','trabalho'],['ptra','ptra-a07','ptrabalho']];
 for(const [d,m,normalized] of cases){
  const path=vm.runInContext(`centralToolPath('decorando',{discipline:${JSON.stringify(d)},module:${JSON.stringify(m)}})`,c),url=new URL(path,'https://example.test/');
  assert.equal(url.searchParams.get('module'),m);assert.equal(url.searchParams.get('discipline'),normalized);
  const tool=leiRuntime(root);assert.equal(vm.runInContext(`centralOpenModule(${JSON.stringify(m)},${JSON.stringify(d)},true)`,tool),true);
 }
 assert.ok(read('ui/adm-native-layer.js').includes("{discipline:'adm',module:uid}"));
 assert.ok(read('ui/cpp-native-study-v1.js').includes("module:'cpp-m'+String(n).padStart(2,'0')"));
 assert.ok(read('ui/current-courses.js').includes('Abrir questões deste módulo'));
 for(let n=1;n<=18;n++)assert.ok(read(`modules/trabalho/base-completa/m${String(n).padStart(2,'0')}.html`).includes(`module=trab-m${String(n).padStart(2,'0')}`));
});
test('filtro de módulo combina com leis, status e troca de disciplina sem vazar itens',()=>{
 const c=leiRuntime(root);
 vm.runInContext("chooseDiscipline('cpc');qcPick('module','cpc-m19');qcPick('topic','cpc-lei-12016')",c);
 const qs=vm.runInContext('visible()',c);assert.ok(qs.length);assert.ok(qs.every(q=>q.discipline==='cpc'&&q.topicId==='cpc-lei-12016'));
 assert.ok(vm.runInContext('renderFilters()',c).includes('Módulo da Central'));
 vm.runInContext("chooseDiscipline('civil')",c);assert.equal(vm.runInContext('ui.selectedModules.size',c),0);assert.ok(vm.runInContext('visible()',c).every(q=>q.discipline==='civil'));
});
test('questão compartilhada entre módulos mantém uma tentativa e o progresso anterior',()=>{
 const storage=new Map(),c=leiRuntime(root,storage),q=data.find(q=>q.topicId==='cf-lei-11417');
 vm.runInContext(`saved.notes[${JSON.stringify(data[0].id)}]='Nota preservada';save();centralOpenModule('cf-m09','cf',true);`,c);
 const pos=vm.runInContext('visible()',c).findIndex(a=>a.id===q.id);assert.ok(pos>=0);
 vm.runInContext(`ui.articleIndex=${pos};answerFocus(${q.question.answer});centralOpenModule('cf-m12','cf',true);`,c);
 assert.ok(vm.runInContext('visible()',c).some(a=>a.id===q.id));assert.equal(vm.runInContext(`saved.attempts[${JSON.stringify(q.id)}].length`,c),1);
 const reloaded=leiRuntime(root,storage);assert.equal(vm.runInContext(`saved.attempts[${JSON.stringify(q.id)}].length`,reloaded),1);assert.equal(vm.runInContext(`saved.notes[${JSON.stringify(data[0].id)}]`,reloaded),'Nota preservada');
});
test('índice de progresso Civil e pacote offline acompanham a mesma matriz',()=>{
 const c=vm.createContext({window:{}});vm.runInContext(read('civil-decorando-index-v1.js'),c);const ids=c.window.CIVIL_DECORANDO_IDS_V1;
 const native=JSON.parse(read('content/civil/civil-native-index.js').split('=').slice(1).join('=').trim().replace(/;$/,''));
 for(const m of native.modules)assert.deepEqual(asJSON(ids[m.id]),asJSON(index.modules.find(x=>x.id===m.uid).questionIds));
 const manifest=JSON.parse(read('central-offline-files-v66172.json'));assert.ok(manifest.files.includes('/tools/decorando-data-modulos.js?v=20261009sync1'));
 for(const p of manifest.files){const path=p.split('?')[0].replace(/^\//,'');assert.ok(fs.existsSync(new URL(path,root)),path);}
});
