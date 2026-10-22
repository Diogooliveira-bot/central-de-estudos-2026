import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=f=>fs.readFileSync(path.join(ROOT,f),'utf8');

test('Civil M01–M05: conteúdos pedagógicos completos em oito campos',()=>{
 const ctx={window:{}};
 const counts=[11,11,12,12,12];
 for(let n=1;n<=5;n++){
   const p='content/civil/m'+String(n).padStart(2,'0')+'-teoria-guiada-data.js';
   new vm.Script(read(p)).runInNewContext(ctx);
   const d=ctx.window.BC_CIV_GUIDED_MODULES[n];
   assert.equal(d.module,n);
   assert.equal(d.topics.length,counts[n-1]);
   assert.ok(d.topics.every(t=>t.length===8&&t.every(s=>typeof s==='string'&&s.trim().length>10)));
 }
});
test('Civil: carregamento gradual de M01–M05, sem alterar M06–M15',()=>{
 const boot=read('central-v119.html');
 const ui=read('ui/civil-native-study-v1.js');
 const reader=read('content/civil/civil-teoria-guiada-reader-v1.js');
 new vm.Script(ui);new vm.Script(reader);
 for(let n=1;n<=5;n++)assert.ok(boot.includes('m'+String(n).padStart(2,'0')+'-teoria-guiada-data.js'));
 assert.ok(boot.includes('civil-teoria-guiada-reader-v1.js'));
 assert.ok(boot.indexOf('m05-teoria-guiada-data.js')<boot.indexOf('civil-teoria-guiada-reader-v1.js'));
 assert.ok(boot.indexOf('civil-teoria-guiada-reader-v1.js')<boot.indexOf('ui/civil-native-study-v1.js?v=20261022civilpilot1'));
 assert.ok(ui.includes("kind==='summary'&&n>=1&&n<=5&&g.BcCivilGuidedReader?.open(n)"));
 assert.ok(ui.includes('d.completeHtml'));
 assert.ok(ui.includes("openQuestions(${m.number},'${kind}')"));
 assert.ok(ui.includes('markGuidedRead'));
 assert.ok(reader.includes('MIN=1,MAX=5'));
 assert.ok(reader.includes('data-bc-guided-mode="review"'));
 assert.ok(reader.includes('data-bc-guided-check'));
 assert.ok(!reader.includes('bc_preview='));
 assert.ok(!reader.includes('Nova teoria guiada · testar'));
 assert.ok(!reader.includes('fetch('));
});
