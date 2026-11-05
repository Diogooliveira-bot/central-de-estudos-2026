import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import vm from 'node:vm';
import {JSDOM} from 'jsdom';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const packed={};
vm.runInNewContext(read('content/cpp/cpp-native-content-packed.js'),{window:packed});
const content=JSON.parse(gunzipSync(Buffer.from(packed.CPP_NATIVE_PACKED_B64,'base64')));
function setup(){
 const dom=new JSDOM('<!doctype html><html><body></body></html>',{url:'https://example.test',runScripts:'outside-only'});
 const w=dom.window;
 w.requestAnimationFrame=()=>0;
 w.HTMLElement.prototype.scrollIntoView=function(){};
 w.CPP_NATIVE_CONTENT=content;
 for(const p of ['content/cpp/cpp-native-index.js','ui/native-reading-session.js','ui/cpp-m01-visual-pilot.js','ui/cpp-native-study-v1.js','ui/reader-questions-v1.js'])w.eval(read(p));
 return {dom,w};
}
test('CPP M01–M22: as 330 questões originais oferecem alternativas e correção',async()=>{
 const {dom,w}=setup();let total=0;
 try{
  for(const d of Object.values(content))for(const kind of ['summary','complete']){
   await w.CppNative.open(d.number,kind,true);
   const body=w.document.querySelector('#cpp-native-reader .bc-native-scroll');
   w.CentralReaderQuestions.process(body);
   const cards=[...body.querySelectorAll('.cpp-native-question')];
   assert.equal(cards.length,kind==='summary'?5:10,`${d.uid}/${kind}`);
   assert.equal(body.querySelectorAll('.bc-iq').length,0,'não duplicar questões com o conversor genérico');
   const original=new JSDOM(d[kind+'Html']).window.document;
   const keys=[...original.body.textContent.matchAll(/Gabarito:\s*([A-E])\b/gi)].map(m=>m[1].toUpperCase());
   assert.equal(keys.length,cards.length);
   cards.forEach((card,i)=>{
    const optionCount=card.querySelectorAll('[data-cpp-option]').length;
    assert.ok(optionCount>=2&&optionCount<=5);
    assert.doesNotMatch(card.textContent,/Gabarito:/);
    const correct=keys[i].charCodeAt(0)-65;
    card.querySelector(`[data-cpp-option="${correct}"]`).click();
    assert.match(card.querySelector('[role="status"]').textContent,/✓ Correto/);
    assert.equal(card.querySelectorAll('[data-cpp-option]:disabled').length,optionCount);
    assert.ok(card.querySelector('[role="status"] p').textContent.trim());
    total++;
   });
   original.defaultView.close();
  }
  assert.equal(total,330);
 }finally{dom.window.close()}
});
test('CPP visual: 22 completas preservam texto e tabelas, com quadros inteiros e revisão antes das questões',async()=>{
 const {dom,w}=setup();try{
  for(const d of Object.values(content)){
   await w.CppNative.open(d.number,'complete',false);
   const article=w.document.querySelector('.cpp-visual-pilot');
   assert.ok(article,d.uid);
   assert.equal(article.querySelectorAll('.cppv-hero').length,1);
   assert.ok(article.querySelectorAll('.cppv-scheme').length>=3,d.uid);
   const original=new JSDOM(d.completeHtml).window.document;
   const tables=[...original.querySelectorAll('table')].map(t=>t.textContent);
   assert.deepEqual([...article.querySelectorAll('table')].map(t=>t.textContent),tables,'tabelas originais preservadas');
   const questionStart=[...original.querySelectorAll('h1,h2,h3,h4,h5,h6')].find(h=>/quest[aã]o\s+\d+/i.test(h.textContent));
   for(const p of original.querySelectorAll('p')){
    if(questionStart&&(questionStart.compareDocumentPosition(p)&original.defaultView.Node.DOCUMENT_POSITION_FOLLOWING))continue;
    if(/Gabarito:|Explicação:|Dificuldade:|^[A-E][).]/.test(p.textContent.trim()))continue;
    const normalize=s=>s.replace(/\s+/g,' ').trim();
    assert.ok(normalize(article.textContent).includes(normalize(p.textContent)),d.uid+': texto preservado: '+p.textContent.slice(0,240));
   }
   const review=[...article.querySelectorAll('.cppv-scheme')].find(el=>el.textContent.includes('ANTES DE RESPONDER'));
   assert.ok(review.compareDocumentPosition(article.querySelector('.cpp-native-question'))&w.Node.DOCUMENT_POSITION_FOLLOWING);
   const count=article.querySelectorAll('.cppv-scheme').length;
   w.CppVisualPilot.enhance(w.document.querySelector('.bc-native-scroll'),d.number,'complete');
   assert.equal(article.querySelectorAll('.cppv-scheme').length,count);
   original.defaultView.close();
   w.CppNative.close();await w.CppNative.open(d.number,'summary',false);
   assert.equal(w.document.querySelector('.cpp-visual-pilot'),null,'resumida permanece no formato anterior');
  }
 }finally{dom.window.close()}
});
test('CPP: erro, refazer e respostas preservadas ao reabrir; módulos e modos isolados',async()=>{
 const {dom,w}=setup();try{
  const readingKey='central-v6:cpp-native:m01:summary:read';
  w.localStorage.setItem(readingKey,'40');
  await w.CppNative.open(1,'summary',true);
  let card=w.document.querySelector('.cpp-native-question');
  card.querySelector('[data-cpp-option="0"]').click();
  const selected=card.querySelector('[role="status"]').textContent;
  assert.match(selected,/Gabarito:/);
  w.CppNative.close();await w.CppNative.open(1,'summary',true);
  card=w.document.querySelector('.cpp-native-question');
  assert.equal(card.querySelector('[role="status"]').textContent,selected);
  card.querySelector('[data-cpp-retry]').click();
  assert.equal(card.querySelectorAll('[data-cpp-option]:disabled').length,0);
  assert.doesNotMatch(card.textContent,/Gabarito:/);
  const correctText=content['cpp-m01'].summaryHtml.match(/Gabarito:\s*([A-E])/i)[1];
  const wrong=(correctText.charCodeAt(0)-65+1)%5;
  card.querySelector(`[data-cpp-option="${wrong}"]`).click();
  assert.match(card.querySelector('[role="status"]').textContent,/✕ Incorreto/);
  w.CppNative.close();await w.CppNative.open(1,'complete',false);
  assert.equal(w.document.querySelectorAll('[data-cpp-option]:disabled').length,0);
  w.CppNative.close();await w.CppNative.open(2,'summary',false);
  assert.equal(w.document.querySelectorAll('[data-cpp-option]:disabled').length,0);
  assert.equal(w.localStorage.getItem(readingKey),'40');
  assert.equal(w.localStorage.getItem('central-v6:cpp:curso22:v1'),null);
 }finally{dom.window.close()}
});
