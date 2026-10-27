/* Etapa 4.3 — ADM restantes M02–M19, exceto M03 e M08, no leitor real e com arquivos oficiais.
 * Chromium local isolado; não acessa autenticação/Neon/Vercel.
 */
import assert from 'node:assert/strict';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {createServer} from 'node:http';
import {chromium} from 'playwright';

const read=p=>readFile(new URL('../'+p,import.meta.url),'utf8');
const ids=Array.from({length:20},(_,i)=>i+1).filter(n=>![1,3,8,20].includes(n));
const file=(n,type)=>'content/adm/m'+String(n).padStart(2,'0')+'-'+type+'.js';
const sources=['content/adm/adm-native-index.js',
  ...ids.flatMap(n=>[file(n,'native-data-lite'),file(n,'approved-complete')])];
const styles=['ui/native-study-reader.css','ui/adm-native-layer.css','ui/legal-complete-premium-v1.css','ui/reading-appearance-v1.css'];
const scripts=['ui/native-reading-session.js','ui/reading-appearance-v1.js',
  'ui/legal-complete-premium-v1.js','ui/adm-native-layer.js'];
const [files,css,js]=await Promise.all([
  Promise.all(sources.map(read)),Promise.all(styles.map(read)),Promise.all(scripts.map(read))
]);
await mkdir('artifacts/etapa4-adm-expansao',{recursive:true});
const server=createServer((_req,res)=>{
  res.writeHead(200,{'content-type':'text/html; charset=utf-8'});
  res.end('<!doctype html><html lang="pt-BR" class="bc-ui-v1"><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><main id="subjects"></main></body></html>');
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const url='http://127.0.0.1:'+server.address().port;
let browser;
const results=[];
try{
 browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 for(const width of [390,768,1366]){
  const height=width===390?844:width===768?1024:768;
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  try{
   await page.goto(url);
   await page.evaluate(()=>{
     window.renderDetail=()=>'';window.renderAll=()=>{};window.subjStats=()=>({});
     window.renderDisciplineGrid=()=>{};window.renderContinue=()=>{};
   });
   for(const c of css)await page.addStyleTag({content:c});
   for(const s of files)await page.addScriptTag({content:s});
   for(const s of js)await page.addScriptTag({content:s});
   const uids=await page.evaluate(()=>Object.values(window.ADM_NATIVE_INDEX.modules)
     .filter(m=>![1,3,8,20].includes(m.number)).map(m=>({number:m.number,uid:m.uid,title:m.title})));
   assert.equal(uids.length,16,'índice ADM incompleto');
   for(const spec of uids){
     const tag='ADM M'+String(spec.number).padStart(2,'0');
     const startingErrors=errors.length;
     await page.evaluate(async uid=>window.AdmNative.open(uid,'complete'),spec.uid);
     await page.waitForFunction(()=>document.querySelector('#adm-native-reader.bc-apostila-v1 .bc-native-article h1'),null,{timeout:10000});
     await page.waitForTimeout(100);
     const m=await page.evaluate(()=>{
       const o=document.getElementById('adm-native-reader'),a=o.querySelector('.bc-native-article');
       const h1=a.querySelector('h1'),h2=a.querySelector('h2');
       const tables=[...a.querySelectorAll('table')];
       const wrapped=tables.filter(t=>!!t.closest('.adm-table-scroll,.bc-editor-table-wrap,.table-wrap'));
       const wraps=[...a.querySelectorAll('.adm-table-scroll,.bc-editor-table-wrap,.table-wrap')];
       return {
         premium:o.classList.contains('bc-apostila-v1'),
         readingControls:o.classList.contains('bc-reading-appearance'),
         title:h1?.textContent.trim(),
         sectionCount:a.querySelectorAll('h2').length,
         sectionBorder:h2?getComputedStyle(h2).borderLeftWidth:null,
         subheadings:a.querySelectorAll('h3').length,
         callouts:a.querySelectorAll('.bc-native-callout,.adm-reading-note,.adm-reading-box').length,
         tables:tables.length,
         semanticTables:tables.every(t=>!!t.rows.length),
         wrappedTables:wrapped.length,
         scrollWrappers:wraps.filter(w=>getComputedStyle(w).overflowX==='auto').length,
         contentChecks:a.querySelectorAll('input[data-adm-check]').length,
         sessionChecks:a.querySelectorAll('input[data-adm-session-check]').length,
         tocLinks:o.querySelectorAll('.bc-native-toc button').length,
         overflow:document.documentElement.scrollWidth>innerWidth+2
       };
     });
     assert.equal(m.premium,true,tag+' tema Premium não aplicado');
     assert.equal(m.readingControls,true,tag+' controles de leitura ausentes');
     assert.equal(m.title,spec.title,tag+' título divergente');
     assert.ok(m.sectionCount>0,tag+' sem títulos');
     assert.equal(m.sectionBorder,'5px',tag+' CSS Premium dos H2 não funcionou');
     assert.ok(m.tocLinks>0,tag+' navegação dos capítulos ausente');
     assert.equal(m.semanticTables,true,tag+' tabela inválida');
     assert.equal(m.overflow,false,tag+' overflow horizontal da página');
     const screenshot='artifacts/etapa4-adm-expansao/adm-m'+String(spec.number).padStart(2,'0')+'-'+width;
     await page.locator('#adm-native-reader .bc-native-reader').screenshot({path:screenshot+'-leitor.png'});
     if(m.tables&&m.wrappedTables) await page.locator('#adm-native-reader table').first().screenshot({path:screenshot+'-tabela.png'});
     const selector=m.contentChecks?'input[data-adm-check]':'input[data-adm-session-check]';
     assert.ok(m.contentChecks||m.sessionChecks,tag+' sem checkbox para testar');
     await page.locator('#adm-native-reader '+selector).first().check();
     await page.evaluate(()=>window.AdmNative.close());
     await page.evaluate(async uid=>window.AdmNative.open(uid,'complete'),spec.uid);
     await page.waitForFunction(()=>document.querySelector('#adm-native-reader .bc-native-article h1'),null,{timeout:10000});
     assert.equal(await page.locator('#adm-native-reader '+selector).first().isChecked(),true,tag+' checkbox não persistiu');
     await page.evaluate(()=>window.AdmNative.close());
     await page.evaluate(async uid=>window.AdmNative.open(uid,'summary'),spec.uid);
     await page.waitForFunction(()=>document.querySelector('#adm-native-reader .bc-native-article h1'),null,{timeout:10000});
     await page.waitForTimeout(60);
     assert.equal(await page.locator('#adm-native-reader').evaluate(o=>o.classList.contains('bc-apostila-v1')),false,tag+' visual Premium vazou para resumo');
     await page.evaluate(()=>window.AdmNative.close());
     assert.deepEqual(errors.slice(startingErrors),[],tag+' erro JavaScript');
     results.push({module:tag,width,...m,checkboxPersisted:true,summaryUnstyled:true,errors:[]});
   }
  }finally{await page.close();}
 }
 assert.equal(results.length,48);
 await writeFile('artifacts/etapa4-adm-expansao/metricas.json',JSON.stringify(results,null,2)+'\n');
 console.log('ETAPA4_ADM_EXPANSAO_RESULTS='+JSON.stringify(results));
}finally{if(browser)await browser.close();server.close();}
