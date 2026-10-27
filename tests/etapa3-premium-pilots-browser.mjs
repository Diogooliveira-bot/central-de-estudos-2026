/* Chromium executes the ACTUAL penal/CPC reader renderers. No authenticated-site claim. */
import assert from 'node:assert/strict';
import {readFile,mkdir} from 'node:fs/promises';
import {createServer} from 'node:http';
import {chromium} from 'playwright';
const read=p=>readFile(new URL('../'+p,import.meta.url),'utf8');
const files=await Promise.all([
 read('ui/native-study-reader.css'),read('ui/legal-complete-premium-v1.css'),read('ui/reading-appearance-v1.css'),
 read('ui/legal-complete-premium-v1.js'),read('ui/reading-appearance-v1.js'),
 read('content/penal/m01-native-data.js'),read('content/cpc/m01-native-data.js'),
 read('ui/native-study-reader.js'),read('ui/cpc-native-study-reader.js')
]);
const [baseCss,premiumCss,readingCss,activator,readingJs,penalData,cpcData,penalJs,cpcJs]=files;
await mkdir('artifacts/etapa3-premium-pilots',{recursive:true});
const server=createServer((_req,res)=>{res.writeHead(200,{'content-type':'text/html; charset=utf-8'});res.end('<!doctype html><html class="bc-ui-v1" data-bc-reading-mode="paper"><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><div id="subjects"></div></body></html>')});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const base='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const results=[];
const setup=async(width)=>{
 const height=width===390?844:width===768?1024:768;
 const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base);
 for(const css of [baseCss,premiumCss,readingCss])await page.addStyleTag({content:css});
 for(const src of [readingJs,activator,penalData,cpcData,penalJs,cpcJs])await page.addScriptTag({content:src});
 return {page,errors};
};
try{
 for(const width of [390,768,1366]){
  const {page,errors}=await setup(width);
  for(const spec of [
   {name:'penal-m01',id:'bcNativeReaderOverlay',api:'BaseNativeReader',attr:'penal-m01',sel:'[data-chapter-check]'},
   {name:'cpc-m01',id:'cpcNativeReaderOverlay',api:'CpcNativeReader',attr:'cpc-m01',sel:'[data-cpc-chapter-check]'}
  ]){
   await page.evaluate(({api})=>window[api].open('complete'),spec);
   await page.waitForFunction(id=>document.getElementById(id)?.classList.contains('bc-apostila-v1'),spec.id,{timeout:8000});
   await page.waitForTimeout(100);
   const m=await page.evaluate(({id})=>{
     const overlay=document.getElementById(id),article=overlay.querySelector('.bc-native-article');
     const h1=article.querySelector('h1'),h2=article.querySelector('h2');
     return {
       premium:overlay.classList.contains('bc-apostila-v1'),pilot:overlay.dataset.bcPremiumPilot,
       appearance:overlay.classList.contains('bc-reading-appearance'),
       title:h1?.textContent?.trim(),h2Count:article.querySelectorAll('h2').length,h3Count:article.querySelectorAll('h3').length,
       h1Color:getComputedStyle(h1).color,h2Bg:getComputedStyle(h2).backgroundColor,h2Border:getComputedStyle(h2).borderLeftWidth,
       callouts:article.querySelectorAll('.bc-native-callout').length,tableCount:article.querySelectorAll('table').length,
       scrollXLeak:document.documentElement.scrollWidth>innerWidth+2,
       headingsLinks:article.querySelectorAll('h2[id],h3[id]').length
     };
   },spec);
   assert.equal(m.premium,true,spec.name+': tema não aplicado');
   assert.equal(m.pilot,spec.attr,spec.name+': sem escopo específico');
   assert.ok(m.h2Count>3,spec.name+': sem hierarquia');
   assert.equal(m.h2Border,'5px',spec.name+': CSS Premium sem efeito');
   assert.equal(m.scrollXLeak,false,spec.name+': vazamento lateral');
   assert.ok(m.headingsLinks>2,spec.name+': navegação interna perdida');
   const pre='artifacts/etapa3-premium-pilots/'+spec.name+'-'+width;
   await page.locator('#'+spec.id+' .bc-native-article > h1').screenshot({path:pre+'-titulo.png'});
   await page.locator('#'+spec.id+' .bc-native-article h2').first().screenshot({path:pre+'-secao.png'});
   if(m.callouts)await page.locator('#'+spec.id+' .bc-native-callout').first().screenshot({path:pre+'-quadro.png'});
   await page.locator('#'+spec.id+' .bc-native-reader').screenshot({path:pre+'-leitor.png'});
   if(spec.name==='cpc-m01'){
     const fix=await page.evaluate(()=>{
       const o=document.getElementById('cpcNativeReaderOverlay'),a=o.querySelector('.bc-native-article');
       const headings=[...a.querySelectorAll('h2')].map(h=>h.textContent.trim());
       const law=a.querySelector('.bc-cpc-m01-table-scroll');
       const table=law?.querySelector('table');
       const note=[...a.querySelectorAll('.bc-native-callout.trap')].find(x=>x.textContent.includes('boa-fé processual não depende'));
       return {
         h9:headings.find(x=>x.startsWith('9. SISTEMA MULTIPORTAS')),
         h10:headings.find(x=>x.startsWith('10. DURAÇÃO RAZOÁVEL')),
         h27:headings.find(x=>x.startsWith('27. PONTE')),
         noteText:note?.textContent.replace(/\s+/g,' ').trim(),
         tableRows:table?.tBodies[0]?.rows.length||0,
         tableColumns:table?.tHead.rows[0]?.cells.length||0,
         tableDisplay:table?getComputedStyle(table).display:null,
         tableOverflow:law?getComputedStyle(law).overflowX:null,
         tableScroll:law?law.scrollWidth-law.clientWidth:0,
         pdfArtifact:a.textContent.includes('BASE COMPLETA · CPC · M01 3 / 23')
       }
     });
     assert.ok(fix.h9?.includes('ART. 3º, §§ 1º A 3º'),'CPC art. 3º ainda dividido');
     assert.ok(fix.h10?.includes('DO MÉRITO — ART. 4º'),'CPC duração razoável ainda dividida');
     assert.ok(fix.h27?.includes('NACIONAL (ARTS. 21 A 25)'),'CPC título oculto pelo marcador de página');
     assert.match(fix.noteText||'',/intenção psicológica de prejudicar\./i);
     assert.equal(fix.tableRows,14,'linhas do quadro CPC foram perdidas');
     assert.equal(fix.tableColumns,3,'quadro CPC precisa manter três colunas');
     assert.equal(fix.tableDisplay,'table','quadro perdeu semântica de tabela');
     assert.equal(fix.tableOverflow,'auto','rolagem interna da tabela ausente');
     assert.equal(fix.pdfArtifact,false,'marcador de PDF ficou misturado ao texto');
     if(width<=768)assert.ok(fix.tableScroll>1,'rolagem horizontal da tabela não funcional');
     await page.locator('#cpcNativeReaderOverlay .bc-cpc-m01-table-scroll').screenshot({path:pre+'-tabela-cpc.png'});
     await page.locator('#cpcNativeReaderOverlay .bc-native-callout.trap').filter({hasText:'boa-fé processual não depende'}).first().screenshot({path:pre+'-pegadinha-cpc.png'});
     results.push({width,module:'cpc-m01-correcoes',...fix});
   }
   const check=await page.evaluate(({id,sel})=>{
     const btn=document.getElementById(id).querySelector(sel);
     if(!btn)return null;const old=btn.classList.contains('done');btn.click();
     return {old,updated:btn.classList.contains('done')};
   },spec);
   assert.ok(check,spec.name+': checkbox ausente');
   assert.notEqual(check.old,check.updated,spec.name+': checkbox não reagiu');
   await page.evaluate(({api})=>window[api].close(),spec);
   assert.equal(await page.locator('#'+spec.id).count(),0);
   await page.evaluate(({api})=>window[api].open('complete'),spec);
   await page.waitForFunction(id=>!!document.getElementById(id),spec.id);
   const after=await page.evaluate(({id,sel})=>document.getElementById(id).querySelector(sel)?.classList.contains('done'),spec);
   assert.equal(after,check.updated,spec.name+': checkbox não persistiu');
   await page.evaluate(({api})=>window[api].open('summary'),spec);
   await page.waitForFunction(id=>!!document.getElementById(id),spec.id);
   await page.waitForTimeout(50);
   const summary=await page.evaluate(({id})=>{const o=document.getElementById(id);return {premium:o.classList.contains('bc-apostila-v1'),pilot:o.dataset.bcPremiumPilot||null}},spec);
   assert.equal(summary.premium,false,spec.name+': resumo afetado');
   assert.equal(summary.pilot,null,spec.name+': resumo recebeu CSS exclusivo');
   await page.evaluate(({api})=>window[api].close(),spec);
   results.push({width,module:spec.name,...m,chapterPersisted:true,summaryUnstyled:true});
  }
  assert.deepEqual(errors,[],'Erros JS no Chromium '+width+'px');
  await page.close();
 }
 console.log('ETAPA3_CHROMIUM_RESULTS='+JSON.stringify(results));
}finally{await browser.close();server.close();}
