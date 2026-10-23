import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const mfile=n=>'content/penal/m'+String(n).padStart(2,'0')+'-teoria-guiada-data.js';

test('V3 Penal M01–M17: módulos preservados, 220 assuntos e lei por extenso',()=>{
 const w={},expect=[12,12,14,11,13,12,16,14,15,16,14,12,14,11,11,11,12];
 for(let n=1;n<=17;n++){
  new vm.Script(read(mfile(n))).runInNewContext({window:w});
  const d=w.BC_PEN_GUIDED_MODULES[n];
  assert.equal(d.module,n);
  assert.equal(d.topics.length,expect[n-1]);
  assert.ok(d.topics.every(t=>t.length===8||t.length===9));
  assert.ok(d.topics.every(t=>t.slice(0,8).every(s=>typeof s==='string'&&s.trim().length>4)));
  assert.ok(d.topics.some(t=>t.length===9&&t[8].lei?.length>0),'lei por extenso em M'+n);
 }
 assert.equal(expect.reduce((a,b)=>a+b,0),220);
 const m8=w.BC_PEN_GUIDED_MODULES[8];
 assert.equal(m8.topics.length,14);
 assert.ok(m8.topics.every(t=>t[8]?.caso&&t[8]?.resolucao&&t[8]?.quadro));
});
test('V3 questões isoladas: 103, M08 com 23, alternativas válidas',()=>{
 const w={};
 new vm.Script(read('content/penal/penal-teoria-guiada-questions-v3.js')).runInNewContext({window:w});
 const q=w.BC_PEN_GUIDED_QUIZZES_V3;
 assert.equal(Object.keys(q).length,17);
 for(let n=1;n<=17;n++){
  assert.equal(q[n].length,n===8?23:5);
  assert.ok(q[n].every(x=>Array.isArray(x.options)&&x.options.length>=4&&Number.isInteger(x.answer)&&x.answer>=0&&x.answer<x.options.length));
 }
 assert.equal(Object.values(q).reduce((n,arr)=>n+arr.length,0),103);
});
test('V3 Central: carregador válido, isolado e fontes originais preservadas',()=>{
 const html=read('central-v119.html');
 const rd=read('content/penal/penal-teoria-guiada-reader-v1.js');
 const br=read('ui/penal-teoria-guiada-bridge-v1.js');
 const quiz=read('ui/penal-teoria-guiada-quiz-v3.js');
 new vm.Script(rd);new vm.Script(br);new vm.Script(quiz);
 const sources=Array.from({length:17},(_,i)=>mfile(i+1));
 for(const source of sources)assert.ok(html.includes(source),'script ausente '+source);
 const order=['penal-teoria-guiada-questions-v3.js','penal-teoria-guiada-reader-v1.js','penal-teoria-guiada-quiz-v3.js','penal-teoria-guiada-bridge-v1.js'];
 for(let i=0;i<order.length-1;i++)assert.ok(html.indexOf(order[i])<html.indexOf(order[i+1]));
 assert.ok(html.indexOf(sources[16])<html.indexOf(order[0]));
 assert.ok(rd.includes('MIN=1,MAX=17'));
 assert.ok(rd.includes('BC_PEN_GUIDED_QUIZZES_V3'));
 assert.ok(quiz.includes('Refazer só as erradas'));
 assert.ok(quiz.includes('deal(list)'));
 assert.ok(br.includes('BcPenalGuidedQuizV3?.open'));
 assert.ok(br.includes("reader.open('summary')"),'fallback nativo');
 assert.ok(!rd.includes('fetch(')&&!quiz.includes('fetch(')&&!br.includes('fetch('));
 assert.ok(!rd.includes('markGuidedRead'));
 const pkg=JSON.parse(read('package.json'));
 assert.ok(pkg.scripts.test.includes('tests/penal-teoria-guiada-v3-unit.mjs'));
});
