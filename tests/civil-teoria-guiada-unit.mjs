import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const two=n=>String(n).padStart(2,'0');

test('Civil M01–M15: oito campos didáticos completos e estrutura íntegra',()=>{
  const counts=[11,11,12,12,12,16,12,15,12,16,13,15,14,17,17];
  const sandbox={window:{}};
  for(let n=1;n<=15;n++){
    new vm.Script(read('content/civil/m'+two(n)+'-teoria-guiada-data.js')).runInNewContext(sandbox);
    const data=sandbox.window.BC_CIV_GUIDED_MODULES?.[n];
    assert.equal(data?.module,n,'identificação incorreta M'+two(n));
    assert.equal(data.topics.length,counts[n-1],'assuntos M'+two(n));
    assert.ok(data.topics.every(t=>t.length===8&&t.every(x=>typeof x==='string'&&x.trim().length>10)),'campos M'+two(n));
  }
  assert.equal(counts.reduce((a,b)=>a+b,0),205);
});

test('Civil M01–M15: carregador e leitor oficiais na Preview sem mudar banco ou API',()=>{
  const boot=read('central-v119.html');
  const reader=read('content/civil/civil-teoria-guiada-reader-v1.js');
  const ui=read('ui/civil-native-study-v1.js');
  new vm.Script(reader);new vm.Script(ui);
  for(let n=1;n<=15;n++){
    const file='m'+two(n)+'-teoria-guiada-data.js';
    assert.ok(boot.includes(file),'script ausente '+file);
    assert.ok(boot.indexOf(file)<boot.indexOf('civil-teoria-guiada-reader-v1.js'),'ordem incorreta '+file);
  }
  assert.ok(boot.indexOf('civil-teoria-guiada-reader-v1.js')<boot.indexOf('ui/civil-native-study-v1.js?v=20261031readerstd2'));
  assert.ok(ui.includes("kind==='summary'&&n>=1&&n<=15&&g.BcCivilGuidedReader?.open(n)"));
  assert.ok(ui.includes('d.completeHtml'),'teoria completa original preservada');
  assert.ok(ui.includes("openQuestions(${m.number},'${kind}')"),'questões internas preservadas');
  assert.ok(ui.includes('markGuidedRead'),'marcação isolada do progresso mantida');
  assert.ok(reader.includes('MIN=1,MAX=15'));
  assert.ok(reader.includes('data-bc-guided-mode="review"'));
  assert.ok(reader.includes('data-bc-guided-check'));
  assert.ok(!reader.includes('fetch('),'sem uso de API no leitor');
  assert.ok(!reader.includes('Nova teoria guiada · testar'),'sem card de piloto');
});

test('Civil M12–M15: matrizes jurídicas e campos completos',()=>{
  const topics={12:15,13:14,14:17,15:17};
  for(const [number,expected] of Object.entries(topics)){
    const code=read('content/civil/m'+two(Number(number))+'-teoria-guiada-data.js');
    assert.ok(code.includes('BC_CIV_GUIDED_MODULES'));
    const w={};new vm.Script(code).runInNewContext({window:w});
    assert.equal(w.BC_CIV_GUIDED_MODULES[Number(number)].topics.length,expected);
  }
});
