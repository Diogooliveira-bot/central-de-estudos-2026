import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { chromium } from 'playwright';

const root=path.resolve('.');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const indexScript=read('content/ptra/ptra-native-index.js');
const readerScript=read('ui/ptra-reader-upgrade-v1.js');
const style=read('ui/ptra-native-study-v1.css')+'\n'+read('ui/universal-reader-v1.css')+'\n'+read('ui/ptra-reader-upgrade-v1.css');
const parts=Array.from({length:12},(_,i)=>fs.readFileSync(path.join(root,'content/ptra/packed/ptra-pack-'+String(i+1).padStart(2,'0')+'.bin')));
const packed=JSON.parse(zlib.gunzipSync(Buffer.concat(parts)).toString('utf8'));
const w={};(new Function('window',indexScript))(w);
const meta=w.PTRA_NATIVE_INDEX.modules[0];
const moduleData=packed.modules.find(m=>Number(m.number)===1);
const baseHtml='<!doctype html><html lang="pt-BR"><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>'+
 '<div id="ptra-native-overlay" class="ptra-native-overlay"><div class="ptra-native-overlay-shell">'+
 '<header><button type="button">← Fechar</button><div><small>MÓDULO 01</small><h2>Processo do Trabalho</h2></div></header>'+
 '<main id="ptra-ov-content" class="ptra-native-overlay-content ptra-native-reader"></main></div></div></body></html>';
function render(args){
 const el=document.getElementById('ptra-ov-content');
 el.innerHTML=window.PtraReaderUpgrade.render(args.meta,args.mat,args.kind);
 window.PtraReaderUpgrade.mount(el,args.meta.number,args.kind,args.mat);
}
async function setup(page){
 await page.route('http://ptra.test/**',route=>route.fulfill({status:200,contentType:'text/html; charset=utf-8',body:baseHtml}));
 await page.goto('http://ptra.test/');
 await page.addStyleTag({content:style});
 await page.addScriptTag({content:readerScript});
}
test('PTRA: desktop e celular preservam teoria e permitem responder com botões',async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  for(const size of [{width:1280,height:900},{width:390,height:844},{width:820,height:1000}]){
   const page=await browser.newPage({viewport:size});
   await setup(page);
   await page.evaluate(()=>{
    localStorage.setItem('base-completa:ptra:v2:m01:reading:resumido',JSON.stringify({pct:43,scroll:120}));
    localStorage.setItem('base-completa:ptra:v2:m01:questions:resumido',JSON.stringify([{at:1,answered:5,correct:4,wrong:[2],pct:80}]));
   });
   await page.evaluate(render,{meta,mat:moduleData.resumido,kind:'resumido'});
   assert.equal(await page.locator('.ptra-book-qcard').count(),5,'M01 resumida precisa ter 5 questões');
   assert.equal(await page.locator('.ptra-native-page').count(),0,'Não pode mostrar cartões de páginas PDF');
   const visible=await page.locator('.ptra-book-cover h1').isVisible();
   if(!visible){
     const diagnostic=await page.evaluate(()=>{
       const el=document.querySelector('.ptra-book-cover h1');
       if(!el)return {missing:true};
       const chain=[];for(let x=el;x&&chain.length<9;x=x.parentElement){
         const c=getComputedStyle(x),r=x.getBoundingClientRect();
         chain.push({tag:x.tagName,className:x.className,id:x.id,display:c.display,visibility:c.visibility,width:r.width,height:r.height});
       }return {chain};
     });
     console.log('PTRA VISIBILITY DIAGNOSTIC',JSON.stringify(diagnostic));
   }
   assert.ok(visible,'O título da apostila precisa estar visível');
   const metrics=await page.evaluate(()=>({inner:window.innerWidth,scroll:document.documentElement.scrollWidth,book:document.querySelector('.ptra-book').getBoundingClientRect().width}));
   assert.ok(metrics.scroll<=metrics.inner+2,'Overflow horizontal: '+JSON.stringify({size,metrics}));
   const option=page.locator('.ptra-book-qcard').first().locator('[data-ptra-option]').first();
   await option.click();
   assert.equal(await option.getAttribute('aria-pressed'),'true');
   await page.locator('[data-ptra-check="0"]').click();
   assert.ok(await page.locator('[data-ptra-feedback="0"]').isVisible());
   assert.ok((await page.locator('[data-ptra-feedback="0"]').innerText()).includes('Gabarito'));
   await page.locator('[data-ptra-finish]').click();
   const saved=await page.evaluate(()=>({
    reading:JSON.parse(localStorage.getItem('base-completa:ptra:v2:m01:reading:resumido')),
    history:JSON.parse(localStorage.getItem('base-completa:ptra:v2:m01:questions:resumido')),
    draft:JSON.parse(localStorage.getItem('base-completa:ptra:v2:m01:questions:resumido:draft'))
   }));
   assert.equal(saved.reading.pct,43,'O leitor não deve sobrescrever progresso durante a renderização');
   assert.equal(saved.history.length,2,'Novo resultado deve ser acrescentado sem apagar histórico antigo');
   assert.equal(saved.history[0].pct,80,'Histórico antigo preservado');
   assert.equal(saved.history[1].source,'reader-inline');
   assert.equal(saved.draft.completed,true);
   await page.evaluate(render,{meta,mat:moduleData.completo,kind:'completo'});
   assert.equal(await page.locator('.ptra-book-qcard').count(),10,'M01 completa precisa ter 10 questões');
   await page.close();
   console.log('PTRA viewport OK:',size.width,'px');
  }
 }finally{await browser.close();}
});