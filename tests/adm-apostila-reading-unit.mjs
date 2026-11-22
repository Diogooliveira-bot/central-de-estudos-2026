import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {gunzipSync} from 'node:zlib';
import {JSDOM} from 'jsdom';
import {protectedAsset} from '../lib/protected-content.js';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const bundle=(n,mode)=>`content/adm/m${String(n).padStart(2,'0')}-apostila-${mode}.js`;

test('40 approved views load through the real compressed reader, with literal law collapsed and numbered session anchors',async()=>{
 const dom=new JSDOM('<!doctype html><html><head></head><body></body></html>',{url:'https://central.test',runScripts:'outside-only'}),w=dom.window;
 w.Response=Response;w.Blob=Blob;w.DecompressionStream=DecompressionStream;
 w.eval(read('ui/adm-apostila-reading-v1.js'));
 let blocks=0;
 for(let n=1;n<=20;n++)for(const mode of ['complete','summary']){
  w.eval(read(bundle(n,mode)));if(mode==='summary')w.eval(read('content/adm/autor-20261110/adm-m'+String(n).padStart(2,'0')+'-submitted-review.js'));let html=await w.AdmApostilaReading.load(n,mode);w.document.body.innerHTML='<article>'+html+'</article>';let d=w.document;
  if(mode==='complete'){assert.ok(d.querySelector('.overview'));assert.ok(d.querySelector('.synthesis'));}else{assert.ok(d.querySelector('.adm-author-reading'));assert.ok(d.querySelector('.adm-author-reading table.adm-author-table'));}
  assert.equal(d.querySelectorAll('details.law[open]').length,0);
  for(const law of d.querySelectorAll('details.law [data-law-key]'))assert.match(law.querySelector('p').textContent,/^Art\.?\s*\d/i);
  for(const h of d.querySelectorAll('h2,h3'))assert.doesNotMatch(h.textContent.trim(),/^(?:\d+\.\s*)?(Entenda primeiro|Regra jurídica|Como funciona na prática|O que levar para a prova|Como cai na prova|O que decorar)$/i);
  if(mode==='complete')assert.ok(d.querySelectorAll('[data-adm-session]').length>=5);
  if(mode==='summary'&&n===2){
   const review=d.querySelector('.adm-author-reading');
   const headings=[...review.querySelectorAll('h2')];
   const chapters=headings.filter(h=>/^0[1-9]\s/.test(h.textContent.trim()));
   const arts=[...review.querySelectorAll('.adm-guided-review-art')];
   assert.equal(chapters.length,9,'the source review contains nine numbered chapters');
   assert.equal(arts.length,9,'each M02 chapter receives one art');
   for(let i=0;i<9;i++){
    assert.ok(chapters[i].compareDocumentPosition(arts[i])&w.Node.DOCUMENT_POSITION_FOLLOWING);
    assert.match(arts[i].querySelector('img').getAttribute('src'),new RegExp(`ADM-M02-C${String(i+1).padStart(2,'0')}\\.webp$`));
    const next=headings[headings.indexOf(chapters[i])+1];
    if(next)assert.ok(arts[i].compareDocumentPosition(next)&w.Node.DOCUMENT_POSITION_FOLLOWING,'art must appear before the next chapter');
    const stem=`ADM-M02-C${String(i+1).padStart(2,'0')}`;
    const png=fs.readFileSync(new URL(`../artes/adm-m02/png/${stem}.png`,import.meta.url));
    const webp=fs.readFileSync(new URL(`../assets/adm/revisao-guiada/m02/${stem}.webp`,import.meta.url));
    assert.equal(png.subarray(0,8).toString('hex'),'89504e470d0a1a0a',`${stem} PNG is readable`);
    assert.equal(png.readUInt32BE(16),1229,`${stem} PNG width`);assert.equal(png.readUInt32BE(20),1536,`${stem} PNG height`);
    assert.equal(webp.subarray(8,12).toString(),'WEBP',`${stem} integration image is WebP`);
    assert.ok(webp.length<220_000,`${stem} WebP stays optimized for delivery`);
   }
  }else if(mode==='summary')assert.equal(d.querySelectorAll('.adm-guided-review-art').length,0,'other modules remain unchanged');
  if(mode==='complete'){assert.ok(d.querySelectorAll('details.law').length>0);blocks+=d.querySelectorAll('details.law').length;}
 }
 assert.ok(blocks>150,'legislação recolhível das versões completas preservada');assert.equal(w.document.querySelectorAll('link[data-adm-apostila-style]').length,1);dom.window.close();
});

test('complete ADM presentation stays Premium and outside service worker caching; summaries contain no complete mode',()=>{
 const sw=read('sw.js');let source=sw.slice(sw.indexOf('function protectedContentPath'),sw.indexOf('async function purgeProtectedCaches'));const match=source.match(/function protectedContentPath\(path\)\{[\s\S]*?\n\}/);const context={};vm.createContext(context);vm.runInContext(match[0],context);
 for(let n=1;n<=20;n++){
  let p='/'+bundle(n,'complete');assert.equal(protectedAsset(p)?.feature,'theory.complete');assert.equal(context.protectedContentPath(p),true);
  const sandbox={window:{}};vm.createContext(sandbox);vm.runInContext(read(bundle(n,'summary')),sandbox);assert.deepEqual(Object.keys(sandbox.window.ADM_APOSTILA_PACKED),[n+':summary']);
 }
});

test('native reader retains source questions, saved check identifiers and reading session count',()=>{
 const data={window:{}};vm.createContext(data);vm.runInContext(read('content/adm/adm-native-index.js'),data);vm.runInContext(read('content/adm/adm-session-index.js'),data);
 for(let n=1;n<=20;n++){
  const file=bundle(n,'complete');vm.runInContext(read(file),data);const d=new JSDOM(gunzipSync(Buffer.from(data.window.ADM_APOSTILA_PACKED[n+':complete'],'base64')).toString()).window.document;
  assert.equal(d.querySelectorAll('[data-adm-session]').length,data.window.ADM_SESSION_INDEX[n].length);
  vm.runInContext(read(`content/adm/m${String(n).padStart(2,'0')}-approved-complete.js`),data);const old=new JSDOM(data.window.ADM_APPROVED_COMPLETE[n]).window.document;
  assert.deepEqual([...d.querySelectorAll('[data-adm-check]')].map(x=>x.dataset.admCheck),[...old.querySelectorAll('[data-adm-check]')].map(x=>x.dataset.admCheck));
  if([1,2,5,11].includes(n)){const uid=Object.keys(data.window.ADM_NATIVE_INDEX.modules).find(uid=>data.window.ADM_NATIVE_INDEX.modules[uid].number===n);vm.runInContext(read(`content/adm/m${String(n).padStart(2,'0')}-native-data-lite.js`),data);const q=new JSDOM(data.window.ADM_NATIVE_CONTENT[uid].completeAppendHtml).window.document;assert.deepEqual([...d.querySelectorAll('details.question')].map(x=>x.textContent),[...q.querySelectorAll('details.question')].map(x=>x.textContent));}
 }
});
