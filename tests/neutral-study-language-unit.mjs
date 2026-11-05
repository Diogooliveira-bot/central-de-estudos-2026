import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import vm from 'node:vm';
const bank=/\b(?:FCC|FGV|CEBRASPE|CESPE|VUNESP|AOCP|CONSULPLAN|CESGRANRIO|IBFC|IDECAN)\b/i;
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const files=p=>readdirSync(new URL('../'+p,import.meta.url));
function context(){const c={};c.window=c;c.globalThis=c;return vm.createContext(c)}
function load(c,p){vm.runInContext(read(p),c,{filename:p,timeout:3000})}

test('Português mantém todos os módulos e títulos sem direcionamento a banca',()=>{
 const c=context();
 for(const f of files('portugues-native-data').filter(f=>/^m\d+\.js$/.test(f)))load(c,'portugues-native-data/'+f);
 assert.equal(Object.keys(c.PT_NATIVE_DATA).length,17);
 for(const m of Object.values(c.PT_NATIVE_DATA)){
  assert.doesNotMatch(m.title,bank,m.id);
  for(const s of m.sections){assert.doesNotMatch(s.title,bank,m.id+'/'+s.id);assert.ok(s.id)}
 }
});

test('apostilas de Administrativo e Penal usam títulos neutros sem perder capítulos',()=>{
 const c=context();
 for(const f of files('content/adm').filter(f=>/^m\d+-approved-complete\.js$/.test(f)))load(c,'content/adm/'+f);
 for(let n=1;n<=4;n++)load(c,`penal-full-theory-data-0${n}.js`);
 assert.equal(Object.keys(c.ADM_APPROVED_COMPLETE).length,20);
 assert.equal(Object.keys(c.PENAL_FULL_THEORY).length,17);
 for(const [id,html] of [...Object.entries(c.ADM_APPROVED_COMPLETE),...Object.entries(c.PENAL_FULL_THEORY).map(([id,m])=>[id,m.html])]){
  const headings=[...html.matchAll(/<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]>/gi)];
  assert.ok(headings.length>5,id);
  for(const [,h] of headings)assert.doesNotMatch(h.replace(/<[^>]+>/g,''),bank,id);
 }
});

test('RLM apresenta simulado autoral neutro e mantém a referência factual do edital',()=>{
 const c=context();load(c,'content/rlm-tjce-2026/estrutura.js');
 const structure=c.RLM_TJCE_STRUCTURE;
 assert.doesNotMatch(structure.revisaoFinal.titulo,bank);
 assert.equal(structure.reference.banca,'FCC');
 assert.deepEqual(JSON.parse(JSON.stringify(structure)),JSON.parse(read('content/rlm-tjce-2026/estrutura.json')));
 const ui=read('ui/rlm-native-v1.js');
 assert.doesNotMatch(ui,/Revisão cumulativa FCC|simulado FCC/);
});

test('questões reais de CPC conservam banca, fonte e gabarito',()=>{
 const c=context();
 load(c,'central-structural-v66119/cpc-questions-000-init.js');
 load(c,'content/cpc/cpc-fixation-questions-v1.js');
 const questions=vm.runInContext('CPC_QUESTIONS',c);
 assert.equal(questions.length,165);
 for(const q of questions){
  assert.equal(q.bank,'FCC',q.id);
  assert.equal(q.bankLabel,'QUESTÃO REAL FCC',q.id);
  assert.match(q.source,/FCC/);
  assert.ok(q.url.startsWith('https://www.tecconcursos.com.br/questoes/'));
  assert.ok(Number.isInteger(q.a)&&q.a>=0&&q.a<q.o.length,q.id);
 }
});
