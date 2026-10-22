import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const pad=n=>String(n).padStart(2,'0');

test('Penal M01–M11: 149 assuntos e 8 campos didáticos',()=>{
 const counts=[12,12,14,11,13,12,16,14,15,16,14];
 const ctx={window:{}};
 for(let n=1;n<=11;n++){
  const p='content/penal/m'+pad(n)+'-teoria-guiada-data.js';
  new vm.Script(read(p)).runInNewContext(ctx);
  const d=ctx.window.BC_PEN_GUIDED_MODULES?.[n];
  assert.equal(d?.module,n,'identificação M'+pad(n));
  assert.equal(d.topics.length,counts[n-1],'assuntos M'+pad(n));
  assert.ok(d.topics.every(t=>t.length===8&&t.every(s=>typeof s==='string'&&s.trim().length>4)),'campos M'+pad(n));
 }
 assert.equal(counts.reduce((sum,x)=>sum+x,0),149);
});
test('Penal M01–M11: leitores nativos, carregamento e progresso preservados',()=>{
 const h=read('central-v119.html');
 const rd=read('content/penal/penal-teoria-guiada-reader-v1.js');
 const br=read('ui/penal-teoria-guiada-bridge-v1.js');
 new vm.Script(rd);new vm.Script(br);
 for(let n=1;n<=11;n++){
  const nn=pad(n);
  assert.ok(h.includes('content/penal/m'+nn+'-native-data.js'),'base original M'+nn);
  assert.ok(h.includes('content/penal/m'+nn+'-teoria-guiada-data.js'),'novo conteúdo M'+nn);
  assert.ok(h.includes('native-study-reader-m'+nn+'.js')||n===1&&h.includes('native-study-reader.js'),'leitor original M'+nn);
  assert.ok(h.indexOf('m'+nn+'-teoria-guiada-data.js')<h.indexOf('penal-teoria-guiada-reader-v1.js'));
 }
 assert.ok(h.indexOf('m11-teoria-guiada-data.js')<h.indexOf('penal-teoria-guiada-reader-v1.js'));
 assert.ok(h.indexOf('penal-teoria-guiada-reader-v1.js')<h.indexOf('penal-teoria-guiada-bridge-v1.js'));
 assert.ok(rd.includes('MIN=1,MAX=11'));
 assert.ok(br.includes('/^p([1-9]|1[01])$/'));
 assert.ok(br.includes('BaseNativeReaderM11'));
 assert.ok(rd.includes('Primeira leitura')&&rd.includes('Revisão rápida'));
 assert.ok(rd.includes('data-bc-guided-check'));
 assert.ok(rd.includes('data-bc-penal-quiz'));
 assert.ok(br.includes("reader.open('summary')"));
 assert.ok(br.includes('.bc-native-internal-review'));
 assert.ok(!rd.includes('markGuidedRead'));
 assert.ok(!rd.includes('fetch('));
 assert.ok(!br.includes('localStorage.setItem'));
 for(let n=12;n<=17;n++)assert.ok(!h.includes('m'+pad(n)+'-teoria-guiada-data.js'));
});
test('Penal: quantidade de questões originais de revisão/teoria completa continua intacta',()=>{
 const ctx={window:{}};
 for(let n=1;n<=11;n++){
  const js=read('content/penal/m'+pad(n)+'-native-data.js');
  new vm.Script(js).runInNewContext(ctx);
  const d=ctx.window.BASE_NATIVE_CONTENT?.penal?.['m'+pad(n)];
  assert.equal(d.internalQuestions.summary.length,5);
  assert.equal(d.internalQuestions.complete.length,10);
 }
});
