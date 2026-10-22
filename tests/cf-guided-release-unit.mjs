import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=(f)=>fs.readFileSync(path.join(ROOT,f),'utf8');
test('CF M01–M15: todos os assuntos e 8 campos pedagógicos carregam sem alterações na teoria completa',()=>{
 const sandbox={window:{}};
 let count=0;
 for(let n=1;n<=15;n++){
  const pad=String(n).padStart(2,'0');
  const txt=read('content/cf/m'+pad+'-teoria-guiada-data.js');
  new vm.Script(txt,{filename:pad}).runInNewContext(sandbox);
  const data=sandbox.window.BC_CF_GUIDED_MODULES?.[n];
  assert.equal(data?.module,n,'M'+pad+' ausente');
  assert.ok(data.topics.length>=10,'M'+pad+' sem cobertura');
  for(const t of data.topics){
   assert.equal(t.length,8,'M'+pad+' formato inesperado');
   for(const cell of t)assert.ok(typeof cell==='string'&&cell.trim().length>10,'M'+pad+' célula insuficiente');
  }
  const native=read('content/cf/m'+pad+'-native-data.js');
  assert.match(native,/complete/);
  assert.match(native,/summary/);
  count+=data.topics.length;
 }
 assert.equal(count,194,'total de assuntos deve corresponder à teoria aprovada');
});
test('CF: leitor de revisão é substituído sem botão de piloto, sem tocar nos exercícios',()=>{
 const html=read('index.html');
 const ui=read('ui/cf-native-study-v2.js');
 const reader=read('content/cf/cf-teoria-guiada-reader-v1.js');
 new vm.Script(ui);new vm.Script(reader);
 for(let n=1;n<=15;n++){
  const tag='m'+String(n).padStart(2,'0')+'-teoria-guiada-data.js';
  assert.ok(html.includes(tag),'referência ausente '+tag);
 }
 assert.ok(html.indexOf('m15-teoria-guiada-data.js')<html.indexOf('cf-teoria-guiada-reader-v1.js'));
 assert.ok(html.indexOf('cf-teoria-guiada-reader-v1.js')<html.indexOf('ui/cf-native-study-v2.js'));
 assert.ok(ui.includes("mode==='summary'&&g.BcCfGuidedReader?.open(n)"));
 assert.ok(ui.includes('Teoria completa'));
 assert.ok(ui.includes('Resolver 10 questões'));
 assert.ok(ui.includes('Resolver 5 questões'));
 assert.ok(ui.includes('Abrir teoria guiada'));
 assert.ok(ui.includes('markSummaryRead(n)'));
 assert.ok(!html.includes('m01-teoria-guiada-preview.js'));
 assert.ok(!reader.includes('Nova teoria guiada · testar'));
 assert.ok(!reader.includes('function mount()'));
 assert.ok(!reader.includes('fetch('));
 assert.ok(reader.includes('data-bc-guided-mode="review"'));
 assert.ok(reader.includes('bc-m01-checklist'));
 assert.ok(reader.includes('localStorage'));
 assert.ok(reader.includes('const MIN=1,MAX=15'));
});
