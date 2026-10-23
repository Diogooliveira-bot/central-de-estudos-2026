import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {JSDOM} from 'jsdom';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');

function env(mod){
 const n=String(mod).padStart(2,'0');
 const dom=new JSDOM('<!doctype html><html><head></head><body><div id="subjects"><section class="subject" data-id="penal"><div class="cf-module" data-cf="p'+mod+'"><button type="button" data-native-kind="summary"><strong>Conteúdo resumido</strong><small>Versão original</small></button><button type="button" data-native-kind="complete">Teoria completa</button></div></section></div></body></html>',{url:'https://preview.base-completa.test/',pretendToBeVisual:true,runScripts:'outside-only'});
 const {window}=dom;
 const context=dom.getInternalVMContext();
 for(const name of [
  'content/penal/m'+n+'-teoria-guiada-data.js',
  'content/penal/penal-teoria-guiada-questions-v3.js',
  'content/penal/penal-teoria-guiada-reader-v1.js',
  'ui/penal-teoria-guiada-quiz-v3.js',
  'ui/penal-teoria-guiada-bridge-v1.js'
 ])vm.runInContext(read(name),context,{filename:name});
 window.document.dispatchEvent(new window.Event('DOMContentLoaded',{bubbles:true}));
 return dom;
}

test('V3 DOM M08: card abre Teoria Guiada, modos, lei por extenso, checklist e 23 questões',()=>{
 const dom=env(8),w=dom.window,d=w.document;
 const card=d.querySelector('[data-native-kind="summary"]');
 assert.equal(card.querySelector('strong').textContent,'Teoria guiada');
 card.click();
 assert.ok(d.querySelector('.bc-m01-overlay'),'leitor não abriu');
 assert.match(d.querySelector('.bc-m01-overlay').textContent,/Punibilidade e causas que a extinguem/);
 assert.ok(d.querySelector('.bc-m01-lawitem'),'texto legal não apareceu');
 assert.equal(d.querySelectorAll('[data-bc-guided-check]').length,14);
 const toggle=d.querySelector('[data-bc-guided-mode="review"]');toggle.click();
 assert.equal(d.querySelector('.bc-m01-reader').dataset.view,'review');
 const quiz=d.querySelector('[data-bc-penal-quiz]');assert.ok(quiz);
 quiz.click();
 assert.equal(d.querySelectorAll('.off-q').length,23);
 assert.ok(d.querySelector('.off-quiz-panel'));
 assert.ok(d.getElementById('bc-pen-guided-quiz-style-v3')?.textContent.includes('.off-quiz-panel'),'CSS da janela ausente');
 d.querySelector('[data-correct]').click();
 assert.match(d.querySelector('[data-score]').textContent,/Acertos: 0\/23/);
 assert.ok(d.querySelector('[data-again]')&&!d.querySelector('[data-again]').hidden);
 d.querySelector('[data-again]').click();
 assert.equal(d.querySelectorAll('.off-q').length,23);
 d.querySelector('[data-close]').click();
 assert.equal(d.querySelector('.off-quiz-overlay'),null);
 dom.window.close();
});

test('V3 DOM M01/M17: cards novos sem afetar Teoria Completa',()=>{
 for(const n of [1,17]){
  const dom=env(n),w=dom.window,d=w.document;
  assert.ok(d.querySelector('[data-native-kind="complete"]'),'card Teoria Completa alterado');
  d.querySelector('[data-native-kind="summary"]').click();
  assert.ok(d.querySelector('.bc-m01-overlay'),'leitor não abriu '+n);
  assert.equal(d.querySelectorAll('[data-bc-guided-check]').length,w.BC_PEN_GUIDED_MODULES[n].topics.length);
  d.querySelector('[data-bc-guided-close]').click();
  assert.equal(d.querySelector('.bc-m01-overlay'),null);
  dom.window.close();
 }
});
