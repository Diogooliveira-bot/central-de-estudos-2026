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
test('CPP lei seca: cobertura auditada, fontes literais e lacunas anteriores',()=>{
 const audit=JSON.parse(read('audits/cpp-law-coverage.json')),sources=JSON.parse(read('audits/cpp-official-source-lines.json')),ctx={window:{}};
 vm.runInNewContext(read('content/cpp/cpp-visual-law.js'),ctx);const data=ctx.window.CPP_VISUAL_LAW;
 const clean=t=>t.replace(/【\d+†([^†】]+)(?:†[^】]*)?】/g,'$1').replace(/^#+\s*/,'').trim();
 for(const [n,module]of Object.entries(audit.modules))for(const r of module.references)assert.ok(data.modules[n].some(x=>x.key===r.law+':'+r.ref),n+': '+r.law+':'+r.ref);
 for(const article of Object.values(data.articles)){
  const source=sources[article.law],lines=[];for(let n=article.sourceLines[0];n<=article.sourceLines[1];n++){assert.ok(n in source.lines,article.label+': linha ausente');lines.push(clean(source.lines[n]));}
  for(const p of article.paragraphs)assert.ok(lines.includes(p),article.label+': literalidade');
  assert.equal(article.officialUrl,source.url);
 }
 for(const [n,keys]of Object.entries({1:['cf:5','cpp:3-F'],3:['cpp:6','l12830:2','l8906:7'],10:['cpc:252','cpc:1046'],12:['cpp:158-F','lep:9-A'],14:['eca:241-D','cpp:350-B'],18:['cpp:396-A'],21:['l10741:94','cpp:798-A'],22:['cpp:647-A','l12016:23']}))for(const key of keys)assert.ok(data.modules[n].some(x=>x.key===key),n+': '+key);
 for(const [n,first,last]of [[4,24,68],[12,155,250],[16,406,497],[20,581,646]])for(let ref=first;ref<=last;ref++)assert.ok(data.modules[n].some(x=>x.key==='cpp:'+ref),n+': capítulo integral, art. '+ref);
});
function setup(){
 const dom=new JSDOM('<!doctype html><html><body></body></html>',{url:'https://example.test',runScripts:'outside-only'});
 const w=dom.window;
 w.requestAnimationFrame=()=>0;
 w.HTMLElement.prototype.scrollIntoView=function(){};
 w.CPP_NATIVE_CONTENT=content;
 for(const p of ['content/cpp/cpp-native-index.js','content/cpp/cpp-visual-law.js','ui/native-reading-session.js','ui/cpp-m01-visual-pilot.js','ui/central-internal-question-policy-v1.js','ui/central-authorial-quiz-v1.js','ui/grounded-authorial-questions-v1.js','ui/cpp-native-study-v1.js','ui/reader-questions-v1.js'])w.eval(read(p));
 return {dom,w};
}
test('CPP M01–M22: 330 itens originais continuam nas fontes, mas não entram na leitura',async()=>{
 const {dom,w}=setup();let total=0;
 try{
  for(const d of Object.values(content))for(const kind of ['summary','complete']){
   const original=new JSDOM(d[kind+'Html']).window.document;
   const keys=[...original.body.textContent.matchAll(/Gabarito:\s*([A-E])\b/gi)];
   assert.equal(keys.length,kind==='summary'?5:10,d.uid+' '+kind+' fonte intacta');
   total+=keys.length;original.defaultView.close();
   await w.CppNative.open(d.number,kind,false);
   const body=w.document.querySelector('#cpp-native-reader .bc-native-scroll');
   assert(body,d.uid+' '+kind+' leitura aberta');
   w.CentralReaderQuestions.process(body);
   assert.equal(body.querySelectorAll('.cpp-native-question,[data-cpp-option],.bc-iq').length,0,d.uid+' '+kind+' sem perguntas intercaladas');
   w.CppNative.close();
  }
  assert.equal(total,330,'todos os 330 itens legados permanecem como origem auditável');
 }finally{dom.window.close();}
});
test('CPP: 22 versões completas preservam teoria, tabelas e lei seca sem questões intercaladas',async()=>{
 const {dom,w}=setup();
 try{
  for(const d of Object.values(content)){
   await w.CppNative.open(d.number,'complete',false);
   const article=w.document.querySelector('.cpp-visual-pilot');
   assert.ok(article,d.uid);
   assert.equal(article.querySelectorAll('.cppv-hero').length,1);
   const lawBlocks=[...article.querySelectorAll('.cppv-literal-law')];
   assert.equal(lawBlocks.length,w.CPP_VISUAL_LAW.modules[d.number].length);
   lawBlocks.forEach(box=>{
    const source=w.CPP_VISUAL_LAW.articles[box.dataset.lawKey];
    assert.deepEqual([...box.querySelectorAll('blockquote p')].map(p=>p.textContent),[...source.paragraphs]);
    assert.match(box.querySelector('a').href,/^https:\/\/(www2\.camara\.leg\.br|legis\.senado\.leg\.br)\//);
    assert.equal(box.closest('table,li,.cpp-native-question'),null);
   });
   assert.equal(new Set(lawBlocks.map(x=>x.dataset.lawKey)).size,lawBlocks.length);
   assert.ok(article.querySelectorAll('.cppv-scheme').length>=3,d.uid);
   assert.equal(article.querySelectorAll('.cpp-native-question').length,0);
   const original=new JSDOM(d.completeHtml).window.document;
   assert.deepEqual([...article.querySelectorAll('table')].map(t=>t.textContent),[...original.querySelectorAll('table')].map(t=>t.textContent),'tabelas preservadas');
   const questionStart=[...original.querySelectorAll('h1,h2,h3,h4,h5,h6')].find(h=>/quest[aã]o\s+\d+/i.test(h.textContent));
   const normalize=t=>t.replace(/\s+/g,' ').trim(),articleText=normalize(article.textContent);
   for(const p of original.querySelectorAll('p')){
    if(questionStart&&(questionStart.compareDocumentPosition(p)&original.defaultView.Node.DOCUMENT_POSITION_FOLLOWING))continue;
    if(/Gabarito:|Explicação:|Dificuldade:|^[A-E][).]/.test(p.textContent.trim()))continue;
    assert.ok(articleText.includes(normalize(p.textContent)),d.uid+': teoria preservada: '+p.textContent.slice(0,100));
   }
   original.defaultView.close();
   const count=article.querySelectorAll('.cppv-scheme').length;
   w.CppVisualPilot.enhance(w.document.querySelector('.bc-native-scroll'),d.number,'complete');
   assert.equal(article.querySelectorAll('.cppv-scheme').length,count);
   w.CppNative.close();await w.CppNative.open(d.number,'summary',false);
   assert.equal(w.document.querySelector('.cpp-visual-pilot'),null);
   assert.equal(w.document.querySelectorAll('.cpp-native-question').length,0);
   w.CppNative.close();
  }
 }finally{dom.window.close();}
});
test('CPP: 10 questões autorais fora da leitura, resposta e progresso separados da versão completa',async()=>{
 const {dom,w}=setup();
 try{
  const key='central-v6:cpp-native:m01:summary:read';
  w.localStorage.setItem(key,'40');
  await w.CppNative.open(1,'summary',true);
  let overlay=w.document.getElementById('bc-authorial-quiz');
  assert.ok(overlay,'M01 abre questionário separado');
  assert.equal(overlay.querySelectorAll('[data-authorial-index]').length,10);
  let card=overlay.querySelector('[data-authorial-index="0"]');
  const reveal=card.querySelector('[data-reveal]'),option=card.querySelector('[data-answer]');
  assert.ok(reveal||option,'questão autoral interativa');
  (reveal||option).click();
  const stored=w.localStorage.getItem('central-v6:authorial-ten:Direito Processual Penal:M01');
  assert.ok(stored&&stored!=='{}','resposta de treino salva em chave própria');
  overlay.querySelector('[data-authorial-close]').click();
  await w.CppNative.open(1,'summary',true);
  overlay=w.document.getElementById('bc-authorial-quiz');
  card=overlay.querySelector('[data-authorial-index="0"]');
  assert.ok(card.querySelector('[data-retry]'),'reabre resposta anterior');
  card.querySelector('[data-retry]').click();
  assert.ok(card.querySelector('[data-reveal],[data-answer]'),'refazer questão funciona');
  overlay.querySelector('[data-authorial-close]').click();
  await w.CppNative.open(1,'complete',true);
  assert.ok(w.document.getElementById('bc-internal-pending-modal'),'completo reserva questões reais em breve');
  assert.equal(w.document.getElementById('bc-authorial-quiz'),null,'não apresenta itens autorais como oficiais');
  assert.equal(w.localStorage.getItem(key),'40','leitura preservada');
  assert.equal(w.localStorage.getItem('central-v6:cpp:curso22:v1'),null);
 }finally{dom.window.close();}
});
