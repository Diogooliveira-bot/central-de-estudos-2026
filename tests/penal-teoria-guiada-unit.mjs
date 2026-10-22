import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=f=>fs.readFileSync(path.join(ROOT,f),'utf8');

test('Penal M01–M05: conteúdos completos e 8 campos por assunto',()=>{
 const ctx={window:{}}, counts=[12,12,14,11,13];
 for(let n=1;n<=5;n++){
  const nn=String(n).padStart(2,'0'),src=read('content/penal/m'+nn+'-teoria-guiada-data.js');
  new vm.Script(src).runInNewContext(ctx);
  const d=ctx.window.BC_PEN_GUIDED_MODULES[n];
  assert.equal(d.module,n,'M'+nn+' número de módulo');
  assert.equal(d.topics.length,counts[n-1],'M'+nn+' quantidade');
  assert.ok(d.topics.every(topic=>topic.length===8&&topic.every(x=>typeof x==='string'&&x.trim().length>10)));
 }
 assert.equal(counts.reduce((s,x)=>s+x,0),62);
});
test('Penal: links da Preview, leitor e questões nativas preservados',()=>{
 const html=read('central-v119.html');
 const reader=read('content/penal/penal-teoria-guiada-reader-v1.js');
 const bridge=read('ui/penal-teoria-guiada-bridge-v1.js');
 new vm.Script(reader);new vm.Script(bridge);
 for(let n=1;n<=5;n++){
  const nn=String(n).padStart(2,'0');
  assert.ok(html.includes('content/penal/m'+nn+'-native-data.js'));
  assert.ok(html.includes('content/penal/m'+nn+'-teoria-guiada-data.js'));
  assert.ok(html.indexOf('m'+nn+'-teoria-guiada-data.js')<html.indexOf('penal-teoria-guiada-reader-v1.js'));
  assert.ok(html.includes('native-module-m'+nn+'-shell.js'));
 }
 assert.ok(html.indexOf('penal-teoria-guiada-reader-v1.js')<html.indexOf('penal-teoria-guiada-bridge-v1.js'));
 assert.ok(reader.includes('MIN=1,MAX=5'));
 assert.ok(reader.includes('data-bc-guided-mode="review"'));
 assert.ok(reader.includes('data-bc-guided-check'));
 assert.ok(reader.includes('Primeira leitura')&&reader.includes('Revisão rápida'));
 assert.ok(reader.includes('data-bc-penal-quiz'));
 assert.ok(bridge.includes("reader.open('summary')"));
 assert.ok(bridge.includes('.bc-native-internal-review'));
 assert.ok(bridge.includes('data-native-kind="summary"'));
 assert.ok(!bridge.includes("data-native-kind=\"complete\""));
 assert.ok(!reader.includes('markGuidedRead'));
 assert.ok(!reader.includes('fetch('));
 for(let n=6;n<=17;n++)assert.ok(!html.includes('m'+String(n).padStart(2,'0')+'-teoria-guiada-data.js'));
});
