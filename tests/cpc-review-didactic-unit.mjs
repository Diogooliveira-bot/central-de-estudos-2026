import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
function load(){
 const window={},ctx=vm.createContext({window});
 for(const range of ['m01-m04','m05-m08','m09-m14','m15-m20'])vm.runInContext(read('content/cpc/cpc-review-didactic-'+range+'.js'),ctx);
 return window.CPC_DIDACTIC_REVIEW;
}
const records=load();
test('CPC M01–M20: cobertura integral, sem duplicar títulos e com explicações reais',()=>{
 assert.deepEqual(Object.keys(records).map(Number),Array.from({length:20},(_,i)=>i+1));
 for(let n=1;n<=20;n++){
  const d=records[n];
  assert.ok(d.title.length>20,'M'+n+' título');
  assert.ok(d.intro.length>160,'M'+n+' introdução');
  assert.ok(d.sections.length>=5&&d.sections.length<=6,'M'+n+' seções');
  for(const [heading,paragraphs,example] of d.sections){
   assert.ok(heading&&paragraphs.length>=2,'M'+n+' seção com dois parágrafos');
   assert.ok(paragraphs.every(p=>p.length>=125),'M'+n+' parágrafos explicativos');
   assert.ok(/^Exemplo:/.test(example)&&example.length>=80,'M'+n+' exemplo concreto');
  }
  assert.ok(d.remember.length>=5,'M'+n+' síntese final');
  assert.ok(d.laws.length>=1&&d.laws.every(a=>a[0]&&/^https:\/\//.test(a[1])),'M'+n+' fontes');
  assert.ok(d.story&&d.story.case.length>=160,'M'+n+' caso inicial');
  assert.ok(d.story.steps.length>=5,'M'+n+' cinco passos');
  assert.ok(d.story.conclusion.length>=90,'M'+n+' conclusão encadeada');
  for(const [i,step] of d.story.steps.entries()){
   assert.ok(step[0].length>15,'M'+n+' passo '+(i+1)+' com título claro');
   assert.ok(Array.isArray(step[1])&&step[1].length>=2,'M'+n+' passo '+(i+1)+' em prosa');
   assert.ok(step[1].every(p=>p.length>=100),'M'+n+' passo '+(i+1)+' explica, não só cita');
   assert.ok(step[2].startsWith('Pergunta:'),'M'+n+' passo '+(i+1)+' pergunta');
   assert.ok(step[3].length>=35,'M'+n+' passo '+(i+1)+' resposta');
  }

  const words=[d.intro,...d.sections.flatMap(s=>[s[0],...s[1],s[2]]),...d.remember].join(' ').split(/\s+/).filter(Boolean).length;
  assert.ok(words>=580,'M'+n+' insuficiente: '+words);
 }
});
test('CPC: fontes atualizadas em 2026 não antecipam vacatio legis e distinguem RE/REsp',()=>{
 const m14=JSON.stringify(records[14]),m15=JSON.stringify(records[15]),m16=JSON.stringify(records[16]),m20=JSON.stringify(records[20]);
 assert.match(m14,/15\.479\/2026/);
 assert.match(m14,/vig[eê]ncia futura|vacatio legis/i);
 assert.match(m16,/15\.479\/2026/);
 assert.match(m15,/15\.484\/2026/);
 assert.match(m20,/15\.484\/2026/);
 assert.match(m20,/IAC/);
 assert.match(m20,/IRDR/);
});
test('CPC: leitura completa não recebe revisão explicada, e progresso não é alterado',()=>{
 const s=read('ui/cpc-apostila-reading-v1.js');
 assert.match(s,/mode==='summary'\?await didactic\(n\):null/);
 assert.match(s,/if\(n<1\|\|n>20\)return null/);
 assert.match(s,/enhance\(host,n,mode,registry\);if\(review\)insertDidactic/);
 assert.doesNotMatch(s,/\.setItem\(|fetch\(['"]\/api|localStorage|sessionStorage/);
});
