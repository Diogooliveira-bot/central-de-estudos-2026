import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const g={},context=vm.createContext({window:g});
for(const name of ['m11-m15','m16-m20'])vm.runInContext(read('content/adm/adm-review-didactic-'+name+'.js'),context);
const m=g.ADM_REVIEW_V2_DATA;
test('ADM M11–M20: todas as revisões são explicativas, com exemplo e legislação',()=>{
 assert.deepEqual(Object.keys(m).map(Number),[11,12,13,14,15,16,17,18,19,20]);
 for(let i=11;i<=20;i++){
  let v=m[i];
  assert.ok(v.title&&v.intro, 'M'+i+' título/introd. ausentes');
  assert.ok(v.sections.length>=5,'M'+i+' seções insuficientes');
  assert.ok(v.sections.every(s=>s[0]&&s[1].length>=2&&s[1].every(p=>p.length>=80)&&s[2]),'M'+i+' explicação/exemplo ausentes');
  assert.ok(v.remember.length>=5,'M'+i+' pontos para memorizar');
  assert.ok(v.laws.length>=1&&v.laws.every(x=>x[0]&&/^https:\/\//.test(x[1])),'M'+i+' lei');
  const words=[v.intro,...v.sections.flatMap(s=>[s[0],...s[1],s[2]]),...v.remember].join(' ').trim().split(/\s+/).length;
  assert.ok(words>=525,'M'+i+' breve demais: '+words);
 }
});
test('ADM M11–M20: marcos jurídicos recentes são identificados',()=>{
 const t=i=>JSON.stringify(m[i]);
 assert.match(t(12),/15\.364\/2026/);
 assert.match(t(13),/7156|7236/);
 assert.match(t(13),/20 anos/);
 assert.match(t(17),/12\.807\/2025/);
 assert.match(t(17),/15\.471\/2026/);
 assert.match(t(20),/15\.352\/2026/);
 assert.match(t(20),/três dias úteis/);
});
