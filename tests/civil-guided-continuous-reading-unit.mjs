import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {JSDOM} from 'jsdom';
const read=p=>fs.readFileSync(p,'utf8');
const normalize=t=>t.replace(/\s+/g,' ').trim();
test('Civil: 205 topics keep explanations, examples, laws and revision without repeated generic subtitles',()=>{
 const dom=new JSDOM('<button id="origin">Abrir</button>',{runScripts:'outside-only',url:'https://preview.local'}),w=dom.window,d=w.document;
 for(let n=1;n<=15;n++)w.eval(read('content/civil/m'+String(n).padStart(2,'0')+'-teoria-guiada-data.js'));
 w.eval(read('content/civil/civil-teoria-guiada-lei-seca.js'));
 w.eval(read('content/civil/civil-teoria-guiada-reader-v1.js'));
 let topics=0;
 for(let n=1;n<=15;n++){
  assert.equal(w.BcCivilGuidedReader.open(n),true);
  const overlay=d.querySelector('.civil-guided-reading');assert(overlay);
  const rendered=[...overlay.querySelectorAll('.bc-m01-topic')];
  const expected=w.BC_CIV_GUIDED_MODULES[n].topics;assert.equal(rendered.length,expected.length);
  assert.equal(overlay.querySelectorAll('.bc-m01-card h3').length,0);
  for(let i=0;i<expected.length;i++){
   const topic=rendered[i],data=expected[i];assert(topic.querySelector('h2').textContent.includes(data[0]));
   const fields=[...topic.querySelectorAll('.bc-m01-card')];assert.equal(fields.length,6);
   for(let field=1;field<=6;field++)assert.equal(normalize([...fields[field-1].children].filter(x=>x.tagName==='P').map(p=>p.textContent).join(' ')),normalize(data[field]));
   if(w.BC_CIV_GUIDED_LAW[n]?.[i]?.length){assert(topic.querySelector('.bc-m01-law details[open]'));assert.equal(topic.querySelectorAll('.bc-m01-lei-art').length,w.BC_CIV_GUIDED_LAW[n][i].length);}
  }
  overlay.querySelector('[data-bc-guided-mode="review"]').click();assert.equal(overlay.querySelector('.bc-m01-reader').dataset.view,'review');
  overlay.querySelector('[data-bc-guided-mode="study"]').click();assert.equal(overlay.querySelector('.bc-m01-reader').dataset.view,'study');
  const check=overlay.querySelector('[data-bc-guided-check]');check.checked=true;check.dispatchEvent(new w.Event('change'));
  w.BcCivilGuidedReader.close();w.BcCivilGuidedReader.open(n);assert(d.querySelector('[data-bc-guided-check]').checked);
  w.BcCivilGuidedReader.close();topics+=expected.length;
 }
 assert.equal(topics,205);dom.window.close();
});
