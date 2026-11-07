import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import crypto from 'node:crypto';import {JSDOM}from'jsdom';
const read=p=>fs.readFileSync(p,'utf8'),audit=JSON.parse(read('audits/cpc-apostila-reading-20261107.json'));
const pause=ms=>new Promise(r=>setTimeout(r,ms));
function setup(n){const dom=new JSDOM('<!doctype html><body></body>',{runScripts:'outside-only',url:'https://preview.local',pretendToBeVisual:true}),w=dom.window;w.HTMLElement.prototype.scrollIntoView=()=>{};w.Response=Response;w.Blob=Blob;w.DecompressionStream=DecompressionStream;w.alert=msg=>{throw Error(msg)};w.eval(read('content/cpc/m'+String(n).padStart(2,'0')+'-native-data.js'));w.eval(read('content/cpc/cpc-reading-laws-v1.js'));w.eval(read('ui/cpc-apostila-reading-v1.js'));w.eval(read(n===1?'ui/cpc-native-study-reader.js':'ui/cpc-m'+String(n).padStart(2,'0')+'-native-study-reader.js'));return{dom,w,api:n===1?w.CpcNativeReader:w['CpcM'+String(n).padStart(2,'0')+'NativeReader']};}
test('20 CPC readers preserve both source texts, all articles, chapter controls and close behavior',async()=>{
 assert.equal(audit.modules,20);assert.equal(audit.checks.length,40);assert.equal(audit.unresolved,0);
 for(let n=1;n<=20;n++){
  const{dom,w,api}=setup(n),d=w.document;
  for(const mode of ['complete','summary']){
   const source=w.BASE_NATIVE_CONTENT.cpc['m'+String(n).padStart(2,'0')];const row=audit.checks.find(x=>x.module===n&&x.mode===mode);
   assert.equal(crypto.createHash('sha256').update(source[mode]).digest('hex'),row.sourceHash,'source unchanged M'+n);
   await api.open(mode);const article=d.querySelector('.bc-native-article');assert(article,'open M'+n+' '+mode);assert(article.querySelector('.cpc-apostila'));
   assert(article.querySelector('.cpc-overview'));assert(article.querySelector('.cpc-synthesis'));
   assert.equal(article.querySelectorAll('details.cpc-law[open]').length,0);
   assert.equal(article.querySelectorAll('details.cpc-law').length,row.lawBlocks);
   assert.equal(article.querySelectorAll('[data-law-key]').length,row.lawArticles);
   assert.equal(article.querySelectorAll('.bc-native-callout').length,0);
   for(const law of article.querySelectorAll('[data-law-key]')){assert(law.querySelector('a[href^="https://www2.camara.leg.br/"]'));assert(law.querySelectorAll('p').length>1);}
   assert.equal(d.querySelectorAll('[data-cpc-chapter-check]').length,source.chapters[mode].length);
   const details=article.querySelector('details.cpc-law');if(details){details.querySelector('summary').click();assert(details.open);details.querySelector('summary').click();assert(!details.open);}
   api.close();assert.equal(d.querySelector('.bc-native-reader-overlay'),null);
  }
  dom.window.close();
 }
});
test('CPC and constitutional citations keep distinct identities, ranges include lettered articles',async()=>{
 const{dom,w,api}=setup(19);await api.open('complete');const d=w.document;
 for(const key of ['popular:21','acp:5','cdc:81','ms:23','mi:12','hd:8','adi:12-H','adpf:11','cf:5'])assert(d.querySelector('[data-law-key="'+key+'"]'),key);
 dom.window.close();const ctx=setup(20);await ctx.api.open('complete');assert(ctx.w.document.querySelector('[data-law-key="cf:97"]'));assert(ctx.w.document.querySelector('[data-law-key="cpc:988"]').textContent.includes('V - em casos excepcionais'));ctx.dom.window.close();
 const ctx2=setup(15);await ctx2.api.open('complete');assert(ctx2.w.document.querySelector('[data-law-key="cpc:1035-A"]'));ctx2.dom.window.close();
});
test('standard reader keeps the complete article and search opens matching collapsed law',async()=>{
 const{dom,w,api}=setup(1);await api.open('complete');const d=w.document,overlay=d.querySelector('.bc-native-reader-overlay'),article=overlay.querySelector('article');const law=article.querySelector('details.cpc-law'),p=d.createElement('p');p.textContent='termosingularparabusca';law.append(p);
 w.eval(read('ui/reader-standard-v1.js'));await pause(60);assert(d.querySelector('.cpc-apostila'));const input=overlay.querySelector('input[type="search"]');input.value='termosingularparabusca';input.dispatchEvent(new w.Event('input'));await pause(230);assert(law.open);assert(article.querySelector('mark.bc-std-hit'));api.close();dom.window.close();
});
test('CPC selection list shows only module number, title and native percentage',async()=>{
 const dom=new JSDOM('<main id="homeView"><div><div id="subjects"><section class="subject" data-id="cpc"><button class="subject-head"><span class="subject-name">Processo Civil</span></button><div class="cf-module" data-cf="cpc9"><button class="cf-module-head"><span class="cf-module-no">MÓDULO 9</span><span class="cf-module-title">Tutela provisória</span><span class="cf-module-stat">Cobertura 62% · externas 40%</span></button></div></section></div></div></main>',{runScripts:'outside-only',pretendToBeVisual:true,url:'https://preview.local'}),w=dom.window,d=w.document;
 w.HTMLElement.prototype.scrollIntoView=()=>{};w.toggleSubject=()=>d.querySelector('.subject').classList.add('open');w.eval(read('ui/disciplinas-foco-v1.js'));await pause(30);d.querySelector('.subject-head').click();await pause(40);const card=d.querySelector('.bc-focus-module-card');assert.equal(card.querySelector('.bc-focus-module-number').textContent,'MÓDULO 09');assert.equal(card.querySelector('.bc-focus-module-progress').textContent,'62%');assert.equal(card.querySelector('strong').textContent,'Tutela provisória');assert(!card.textContent.includes('externas'));dom.window.close();
});
