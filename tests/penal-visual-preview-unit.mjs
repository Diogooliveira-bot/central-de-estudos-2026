import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {JSDOM} from 'jsdom';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
function setup(){
 const dom=new JSDOM('<!doctype html><div id="subjects"><section class="subject" data-id="penal"></section></div>',{url:'https://example.test',runScripts:'outside-only'}),w=dom.window;
 w.requestAnimationFrame=()=>0;w.alert=m=>{throw new Error(m)};w.HTMLElement.prototype.scrollIntoView=function(){};
 for(let i=1;i<=4;i++)w.eval(read('penal-full-theory-data-0'+i+'.js'));
 w.eval(read('content/penal/penal-visual-law.js'));w.eval(read('ui/penal-visual-preview.js'));const enhancer=w.PenalVisualPreview;
 for(let n=1;n<=17;n++){w.eval(read('content/penal/m'+String(n).padStart(2,'0')+'-native-data.js'));w.eval(read('ui/native-study-reader'+(n===1?'':'-m'+String(n).padStart(2,'0'))+'.js'));}
 return{dom,w,enhancer,reader:n=>w[n===1?'BaseNativeReader':'BaseNativeReaderM'+String(n).padStart(2,'0')]};
}
test('Penal M01–M17: teoria, tabelas, questões e resumos preservados; lei seca junto à leitura',()=>{
 const{dom,w,enhancer,reader}=setup();let questions=0;
 try{for(let n=1;n<=17;n++){
  const r=reader(n);w.PenalVisualPreview=undefined;r.open('complete');let article=w.document.querySelector('.bc-native-article');
  const baseline=article.textContent.replace(/\s+/g,' ').trim(),tables=[...article.querySelectorAll('table')].map(x=>x.textContent),paras=[...article.querySelectorAll('p')].map(x=>x.textContent),quiz=[...article.querySelectorAll('[data-quiz-card]')].map(x=>x.textContent);r.close();
  w.PenalVisualPreview=enhancer;r.open('complete');article=w.document.querySelector('.bc-native-article');assert.ok(article.classList.contains('penal-visual-preview'),'M'+n);
  assert.equal(article.querySelectorAll('.penv-hero').length,1);assert.ok(article.querySelectorAll('.penv-scheme').length>=1);
  const text=article.textContent.replace(/\s+/g,' ').trim();assert.ok(baseline.length>1000);for(const p of paras)assert.ok(text.includes(p.replace(/\s+/g,' ').trim()),'M'+n+': teoria preservada');
  assert.deepEqual([...article.querySelectorAll('table')].map(x=>x.textContent),tables);
  assert.deepEqual([...article.querySelectorAll('[data-quiz-card]')].map(x=>x.textContent),quiz);questions+=quiz.length;
  const laws=[...article.querySelectorAll('.penv-literal-law')];assert.ok(laws.length>=w.PENAL_VISUAL_LAW.modules[n].length);assert.equal(new Set(laws.map(x=>x.dataset.lawKey)).size,w.PENAL_VISUAL_LAW.modules[n].length);
  for(const group of article.querySelectorAll('.penv-law-group')){
   if(group.closest('.penv-law-library'))continue;
   assert.ok(group.previousElementSibling,'M'+n+': lei após a referência');
   assert.equal(group.querySelector('.penv-law-fold'),null,'M'+n+': referência sem grupo recolhido');
   for(const box of group.querySelectorAll('.penv-literal-law'))assert.ok(box.open,'M'+n+': texto legal visível');
  }
  laws.forEach(box=>{const source=w.PENAL_VISUAL_LAW.articles[box.dataset.lawKey];assert.deepEqual([...box.querySelectorAll('blockquote p')].map(x=>x.textContent),[...source.paragraphs]);assert.ok(!box.closest('table,li,.bc-native-internal-review'));});
  const count=laws.length;enhancer.enhance(article,n);assert.equal(article.querySelectorAll('.penv-literal-law').length,count);r.close();
  w.PenalVisualPreview=undefined;r.open('summary');const summary=w.document.querySelector('.bc-native-article').innerHTML;r.close();w.PenalVisualPreview=enhancer;r.open('summary');assert.equal(w.document.querySelector('.bc-native-article').innerHTML,summary);r.close();
 }assert.equal(questions,170);}finally{dom.window.close();}
});
test('Penal: capítulos legais completos e fontes sem lacunas, inclusive leis especiais',()=>{
 const ctx={window:{}};vm.runInNewContext(read('content/penal/penal-visual-law.js'),ctx);const data=ctx.window.PENAL_VISUAL_LAW;
 assert.equal(Object.keys(data.modules).length,17);
 for(const[n,from,to]of [[2,1,12],[3,13,22],[4,23,25],[6,29,31],[7,32,99],[8,100,120],[9,121,154],[10,155,183],[11,289,311],[12,213,234],[13,312,359]])for(let ref=from;ref<=to;ref++)assert.ok(data.modules[n].some(x=>x.key==='cp:'+ref),n+': CP '+ref);
 for(const[n,keys]of Object.entries({1:['cf:5'],9:['cp:121-A','cp:121-B','cp:154-B'],10:['cp:183-A'],11:['cp:311-A'],12:['cp:217-A'],14:['l13869:1','l13869:38'],15:['l9613:1','l9613:18'],16:['cp:337-E','cp:337-P'],17:['cf:225','l9605:3']}))for(const key of keys)assert.ok(data.modules[n].some(x=>x.key===key),n+': '+key);
 const old=JSON.parse(read('audits/cpp-official-source-lines.json')),fresh=JSON.parse(read('audits/penal-official-source-lines.json')),sources={...old,...fresh,...JSON.parse(read('audits/penal-supplemental-source-lines.json'))};sources.cf={...old.cf,lines:{...old.cf.lines,...fresh.cf.lines}};
 const clean=t=>t.replace(/【\d+†([^†】]+)(?:†[^】]*)?】/g,'$1').replace(/^#+\s*/,'').trim();
 for(const article of Object.values(data.articles)){assert.equal(article.gaps,undefined);const source=sources[article.law],lines=[];for(let n=article.sourceLines[0];n<=article.sourceLines[1];n++){assert.ok(n in source.lines,article.label);lines.push(clean(source.lines[n]));}for(const p of article.paragraphs)assert.ok(lines.includes(p),article.label);assert.equal(article.officialUrl,source.url);}
});

test('Citações correlatas e repetidas permanecem junto de cada explicação',()=>{
 const{dom,w,reader}=setup();try{
  for(const[n,keys]of [[1,['cf:1','l9472:183','cp:155']],[2,['l3914:1','lcp:2','lcp:4','lcp:17','cf:105','cpp:798-A']],[9,['l7716:2-A']],[16,['l8666:89','cp:29','cp:30']],[17,['l8137:1','l9605:21']]]){
   reader(n).open('complete');const article=w.document.querySelector('.bc-native-article');
   for(const key of keys)assert.ok(article.querySelector('.penv-law-group .penv-literal-law[data-law-key="'+key+'"]'),'M'+n+': '+key);
   reader(n).close();
  }
  reader(2).open('complete');assert.ok(w.document.querySelectorAll('.penv-literal-law[data-law-key="cp:7"]').length>1,'art. 7º deve reaparecer nos trechos que o citam');
 }finally{dom.window.close();}
});
