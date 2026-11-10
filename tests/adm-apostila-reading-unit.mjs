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
