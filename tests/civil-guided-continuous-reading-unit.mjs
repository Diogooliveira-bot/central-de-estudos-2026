import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {JSDOM} from 'jsdom';
const read=p=>fs.readFileSync(p,'utf8');
const normalize=t=>String(t||'').replace(/\s+/g,' ').trim();

test('Civil M01–M15: 205 tópicos da apostila de novembro em leitura contínua, sem cartões repetidos',()=>{
 const dom=new JSDOM('<!doctype html><button id="origin">Abrir</button>',{runScripts:'outside-only',url:'https://preview.local'});
 const w=dom.window,d=w.document;
 for(let n=1;n<=15;n++)w.eval(read('content/civil/m'+String(n).padStart(2,'0')+'-teoria-guiada-data.js'));
 w.eval(read('content/civil/civil-teoria-guiada-lei-seca.js'));
 w.eval(read('content/civil/civil-teoria-guiada-reader-v1.js'));
 let topics=0;
 for(let n=1;n<=15;n++){
  assert.equal(w.BcCivilGuidedReader.open(n),true);
  const overlay=d.querySelector('.civil-guided-reading'),data=w.BC_CIV_GUIDED_MODULES[n];
  assert(overlay,'leitor ausente no M'+n);
  assert(overlay.querySelector('.bc-apostila-v20261111'),'nova edição não instalada');
  assert(overlay.querySelector('.bc-apostila-sintese'),'síntese ausente');
  assert.equal(overlay.querySelectorAll('.bc-m01-card').length,0,'cartões antigos');
  assert.equal(overlay.querySelectorAll('[data-bc-guided-mode]').length,0,'modo duplicado');
  const sections=[...overlay.querySelectorAll('.bc-apostila-topic')];
  assert.equal(sections.length,data.topics.length,'tópicos M'+n);
  for(let i=0;i<data.topics.length;i++){
   const topic=data.topics[i],section=sections[i];
   assert(section.querySelector('h2').textContent.includes(topic[0]),'título '+n+'/'+i);
   const explanation=normalize(section.querySelector('.bc-apostila-prose')?.textContent);
   assert(explanation.includes(normalize(topic[1])),'conceito '+n+'/'+i);
   if(topic[4])assert(explanation.includes(normalize(topic[4])),'aprofundamento '+n+'/'+i);
   assert(normalize(section.querySelector('.bc-apostila-example')?.textContent).includes(normalize(topic[2])),'exemplo '+n+'/'+i);
   assert(normalize(section.querySelector('.bc-apostila-law')?.textContent).includes(normalize(topic[3])),'fundamento '+n+'/'+i);
   if(w.BC_CIV_GUIDED_LAW[n]?.[i]?.length)assert(section.querySelector('.bc-m01-lei-seca:not([open])'),'lei seca deve ficar recolhida '+n+'/'+i);
  }
  const check=overlay.querySelector('[data-bc-guided-check="0"]');
  assert(check,'checklist preservado');
  check.checked=true;check.dispatchEvent(new w.Event('change'));
  w.BcCivilGuidedReader.close();
  assert(w.BcCivilGuidedReader.open(n));
  assert(d.querySelector('[data-bc-guided-check="0"]').checked,'checklist não persistiu');
  w.BcCivilGuidedReader.close();
  topics+=sections.length;
 }
 assert.equal(topics,205);
 dom.window.close();
});
