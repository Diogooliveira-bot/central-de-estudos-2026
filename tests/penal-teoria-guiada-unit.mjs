import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const pad=n=>String(n).padStart(2,'0');
const counts=[12,12,14,11,13,12,16,14,15,16,14,12,14,11,11,11,12];

test('Penal M01–M17: 220 assuntos com oito campos',()=>{
 const context={window:{}};
 for(let n=1;n<=17;n++){
  const p='content/penal/m'+pad(n)+'-teoria-guiada-data.js';
  new vm.Script(read(p)).runInNewContext(context);
  const d=context.window.BC_PEN_GUIDED_MODULES?.[n];
  assert.equal(d?.module,n,'M'+pad(n));
  assert.equal(d.topics.length,counts[n-1],'quantidade M'+pad(n));
  assert.ok(d.topics.every(t=>t.length===8&&t.every(s=>typeof s==='string'&&s.trim().length>=9)),'campos M'+pad(n));
 }
 assert.equal(counts.reduce((s,n)=>s+n,0),220);
});

test('Penal M01–M17: loader e leitor guiado preservam os nativos',()=>{
 const html=read('central-v119.html');
 const rd=read('content/penal/penal-teoria-guiada-reader-v1.js');
 const bridge=read('ui/penal-teoria-guiada-bridge-v1.js');
 new vm.Script(rd);new vm.Script(bridge);
 for(let n=1;n<=17;n++){
  const nn=pad(n);
  assert.ok(html.includes('content/penal/m'+nn+'-native-data.js'),'dados originais M'+nn);
  assert.ok(html.includes('content/penal/m'+nn+'-teoria-guiada-data.js'),'guia M'+nn);
  assert.ok(html.includes('native-study-reader-m'+nn+'.js')||(n===1&&html.includes('native-study-reader.js')),'leitor original M'+nn);
  assert.ok(html.indexOf('m'+nn+'-teoria-guiada-data.js')<html.indexOf('penal-teoria-guiada-reader-v1.js'));
 }
 assert.ok(html.indexOf('m17-teoria-guiada-data.js')<html.indexOf('penal-teoria-guiada-reader-v1.js'));
 assert.ok(html.indexOf('penal-teoria-guiada-reader-v1.js')<html.indexOf('penal-teoria-guiada-bridge-v1.js'));
 assert.ok(!html.includes("')++tag('content/penal/"));
 assert.ok(!html.includes("')tag('content/penal/"));
 assert.ok(rd.includes('MIN=1,MAX=17'));
 assert.ok(bridge.includes('/^p([1-9]|1[0-7])$/'));
 assert.ok(bridge.includes('BaseNativeReaderM17'));
 assert.ok(rd.includes('Primeira leitura')&&rd.includes('Revisão rápida'));
 assert.ok(rd.includes('data-bc-guided-check'));
 assert.ok(rd.includes('data-bc-penal-quiz'));
 assert.ok(bridge.includes("reader.open('summary')"));
 assert.ok(bridge.includes('.bc-native-internal-review'));
 assert.ok(!rd.includes('markGuidedRead'));
 assert.ok(!rd.includes('fetch('));
 assert.ok(!bridge.includes('localStorage.setItem'));
});

test('Penal M01–M17: questões originais 5/10 mantidas',()=>{
 const context={window:{}};
 for(let n=1;n<=17;n++){
  new vm.Script(read('content/penal/m'+pad(n)+'-native-data.js')).runInNewContext(context);
  const d=context.window.BASE_NATIVE_CONTENT?.penal?.['m'+pad(n)];
  assert.equal(d?.internalQuestions?.summary?.length,5,'5 questões revisão M'+pad(n));
  assert.equal(d?.internalQuestions?.complete?.length,10,'10 questões completa M'+pad(n));
 }
});
