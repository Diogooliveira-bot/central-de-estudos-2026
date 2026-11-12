import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {JSDOM} from 'jsdom';
import {protectedAsset} from '../lib/protected-content.js';

const read=p=>fs.readFileSync(p,'utf8');
const source=n=>'content/cf/m'+String(n).padStart(2,'0')+'-teoria-guiada-data.js';

test('Constitucional: 194 tópicos M01-M15 na nova leitura única, com acesso do Gratuito',()=>{
 const dom=new JSDOM('<!doctype html><body></body>',{runScripts:'outside-only',url:'https://preview.local'});
 const w=dom.window;
 let expected=0;
 for(let n=1;n<=15;n++){
  const file='/'+source(n);
  assert.equal(protectedAsset(file)?.feature,'theory.summary',file);
  assert.equal(protectedAsset('/content/cf/m'+String(n).padStart(2,'0')+'-native-data.js')?.feature,'theory.complete');
  w.eval(read(source(n)));
  expected+=w.BC_CF_GUIDED_MODULES[n].topics.length;
 }
 w.eval(read('content/cf/cf-teoria-guiada-lei-seca.js'));
 w.eval(read('content/cf/cf-teoria-guiada-reader-v1.js'));
 let checked=0;
 for(let n=1;n<=15;n++){
  assert.equal(w.BcCfGuidedReader.open(n),true,'abertura M'+n);
  const overlay=w.document.querySelector('.bc-guided-overlay');
  assert(overlay,'overlay M'+n);
  assert(overlay.querySelector('.bc-apostila-v20261111'),'novo padrão M'+n);
  assert(overlay.querySelector('.bc-apostila-sintese'),'síntese M'+n);
  assert.equal(overlay.querySelectorAll('[data-bc-guided-mode]').length,0,'abas antigas M'+n);
  assert.equal(overlay.querySelectorAll('.bc-m01-card').length,0,'cards antigos M'+n);
  const records=w.BC_CF_GUIDED_MODULES[n].topics;
  const items=[...overlay.querySelectorAll('.bc-apostila-topic')];
  assert.equal(items.length,records.length,'cobertura M'+n);
  for(let i=0;i<records.length;i++){
   assert(items[i].querySelector('h2').textContent.includes(records[i][0]));
   assert(items[i].querySelector('.bc-apostila-prose').textContent.length>60);
   assert(items[i].querySelector('.bc-apostila-example').textContent.length>20);
   assert(items[i].querySelector('.bc-apostila-law').textContent.length>20);
  }
  const check=overlay.querySelector('[data-bc-guided-check="0"]');
  assert(check,'checklist M'+n);
  check.checked=true;check.dispatchEvent(new w.Event('change'));
  assert(JSON.parse(w.localStorage.getItem('bc:cf:m'+String(n).padStart(2,'0')+':teoria-guiada:checklist:v1'))['0']);
  w.BcCfGuidedReader.close();checked+=items.length;
 }
 assert.equal(checked,194);assert.equal(expected,194);
 dom.window.close();
});
