/* Etapa 7 — Civil M01–M15 com pacote original gzip, leitor real e formatador M03.
 * Chromium local sem autenticação, Neon, Production ou dados de aluno.
 */
import assert from 'node:assert/strict';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {createServer} from 'node:http';
import {chromium} from 'playwright';

const read=p=>readFile(new URL('../'+p,import.meta.url),'utf8');
const [baseCss, civilCss, premiumCss, appearanceCss, sessionJs, appearanceJs,
 themeJs, indexJs, packedJs, bensJs, civilJs]=await Promise.all([
 'ui/native-study-reader.css','ui/civil-native-study-v1.css',
 'ui/legal-complete-premium-v1.css','ui/reading-appearance-v1.css',
 'ui/native-reading-session.js','ui/reading-appearance-v1.js',
 'ui/legal-complete-premium-v1.js','content/civil/civil-native-index.js',
 'content/civil/civil-native-content-packed.js','ui/civil-bens-apostila-v1.js',
 'ui/civil-native-study-v1.js'
].map(read));
const folder='artifacts/etapa7-civil-m01-m15';
await mkdir(folder,{recursive:true});
const server=createServer((_req,res)=>{
 res.writeHead(200,{'content-type':'text/html; charset=utf-8'});
 res.end('<!doctype html><html lang="pt-BR" class="bc-ui-v1" data-bc-reading-mode="paper"><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><main id="subjects"></main></body></html>');
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
let browser;
const rows=[];
try{
 browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 for(const width of [390,768,1366]){
  const height=width===390?844:width===768?1024:768;
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  try{
   await page.goto('http://127.0.0.1:'+server.address().port);
   await page.evaluate(()=>{
     window.renderContinue=()=>{};
     window.renderDisciplineGrid=()=>{};
     window.subjStats=()=>({});
   });
   for(const css of [baseCss,civilCss,premiumCss,appearanceCss])await page.addStyleTag({content:css});
   for(const source of [sessionJs,appearanceJs,themeJs,indexJs,packedJs,bensJs,civilJs])await page.addScriptTag({content:source});
   const source=await page.evaluate(async ()=>{
     const raw=window.CIVIL_NATIVE_PACKED_B64;
     if(!raw || typeof DecompressionStream!=='function')return {packed:false,modules:0};
     const bin=Uint8Array.from(atob(raw),c=>c.charCodeAt(0));
     const value=await new Response(new Blob([bin]).stream().pipeThrough(new DecompressionStream('gzip'))).json();
     return {packed:true,modules:Object.keys(value).length,withComplete:Object.values(value).filter(x=>typeof x?.completeHtml==='string'&&x.completeHtml.length>400).length,withSummary:Object.values(value).filter(x=>typeof x?.summaryHtml==='string'&&x.summaryHtml.length>100).length};
   });
   assert.equal(source.packed,true,'Civil: pacote original não foi descompactado');
   assert.equal(source.modules,15,'Civil: pacote não tem 15 módulos');
   assert.equal(source.withComplete,15,'Civil: apostilas completas não estão presentes no pacote');
   assert.equal(source.withSummary,15,'Civil: resumos não estão presentes no pacote');
   for(const n of Array.from({length:15},(_,i)=>i+1)){
    const label='CIVIL M'+String(n).padStart(2,'0');
    const errorIndex=errors.length;
    await page.evaluate(async n=>window.CivilNative.openReader(n,'complete'),n);
    await page.waitForFunction(()=>{
      const o=document.getElementById('civil-native-reader');
      return o?.classList.contains('bc-apostila-v1')&&!!o.querySelector('.bc-native-article');
    },null,{timeout:12000});
    await page.waitForTimeout(70);
    const m=await page.evaluate(n=>{
     const o=document.getElementById('civil-native-reader'),a=o.querySelector('.bc-native-article');
     const h2=a.querySelector('h2'),tables=[...a.querySelectorAll('table')];
     return {
       title:o.querySelector('.bc-native-reader-title b')?.textContent.trim()||'',
       eyebrow:o.querySelector('.bc-native-reader-title small')?.textContent.trim()||'',
       premium:o.classList.contains('bc-apostila-v1'),
       appearance:o.classList.contains('bc-reading-appearance'),
       chars:a.textContent.trim().length,
       h1:a.querySelectorAll('h1').length,
       h2:a.querySelectorAll('h2').length,
       h3:a.querySelectorAll('h3').length,
       h2Border:h2?getComputedStyle(h2).borderLeftWidth:null,
       tables:tables.length,
       semanticTables:tables.every(t=>t.rows.length>0),
       callouts:a.querySelectorAll('.bc-native-callout,.cv-callout,.cv-alert').length,
       tocButtons:o.querySelectorAll('.bc-native-toc button').length,
       preTables:a.querySelectorAll('pre.civil-source-table').length,
       bensEnhanced:a.classList.contains('bc-bens-apostila'),
       pageOverflow:document.documentElement.scrollWidth>innerWidth+2,
       finishButtons:o.querySelectorAll('[data-finish-reading]').length
     };
    },n);
    assert.equal(m.premium,true,label+': estilo Premium ausente');
    assert.equal(m.appearance,true,label+': aparência de leitura ausente');
    assert.ok(m.chars>650,label+': conteúdo integral curto/ausente');
    assert.ok(m.h1+m.h2+m.h3>=2,label+': hierarquia de títulos ausente');
    assert.ok(m.tocButtons>=1,label+': navegação de capítulos ausente');
    assert.equal(m.semanticTables,true,label+': tabela HTML sem linhas');
    assert.equal(m.pageOverflow,false,label+': página estoura lateralmente');
    assert.equal(m.finishButtons,1,label+': botão de conclusão ausente');
    if(n===3)assert.equal(m.bensEnhanced,true,label+': formatador próprio de Bens falhou');
    await page.locator('#civil-native-reader .bc-native-reader').screenshot({path:folder+'/civil-m'+String(n).padStart(2,'0')+'-'+width+'-leitor.png'});
    if(m.tables)await page.locator('#civil-native-reader .bc-native-article table').first().screenshot({path:folder+'/civil-m'+String(n).padStart(2,'0')+'-'+width+'-tabela.png'});
    const key='central-v6:civil-native:m'+String(n).padStart(2,'0')+':complete:read';
    const old=await page.evaluate(k=>localStorage.getItem(k),key);
    await page.locator('#civil-native-reader [data-finish-reading]').click();
    const pct=await page.evaluate(k=>localStorage.getItem(k),key);
    assert.equal(pct,'100',label+': conclusão não foi registrada');
    await page.evaluate(()=>window.CivilNative.closeReader());
    await page.evaluate(async n=>window.CivilNative.openReader(n,'complete'),n);
    await page.waitForFunction(()=>!!document.querySelector('#civil-native-reader .bc-native-article'),null,{timeout:12000});
    const restored=await page.locator('#civil-native-reader .bc-native-reader-meta').innerText();
    assert.ok(restored.includes('100%'),label+': conclusão não persistiu na reabertura');
    await page.evaluate(()=>window.CivilNative.closeReader());
    await page.evaluate(async n=>window.CivilNative.openReader(n,'summary'),n);
    await page.waitForFunction(()=>!!document.querySelector('#civil-native-reader .bc-native-article'),null,{timeout:12000});
    await page.waitForTimeout(55);
    const summary=await page.locator('#civil-native-reader').evaluate(o=>({premium:o.classList.contains('bc-apostila-v1'),chars:o.querySelector('.bc-native-article').textContent.trim().length}));
    assert.equal(summary.premium,false,label+': Premium aplicado no resumo');
    assert.ok(summary.chars>100,label+': resumo vazio');
    await page.evaluate(()=>window.CivilNative.closeReader());
    assert.deepEqual(errors.slice(errorIndex),[],label+': erros JavaScript');
    rows.push({module:label,width,...m,oldProgress:old,progressAfter:pct,restored,summaryExcluded:true,sourceModules:source.modules});
   }
  }finally{await page.close();}
 }
 assert.equal(rows.length,45,'esperados 15×3 testes Civil');
 await writeFile(folder+'/metricas.json',JSON.stringify(rows,null,2)+'\n');
 console.log('ETAPA7_CIVIL_RESULTS='+JSON.stringify(rows));
}finally{if(browser)await browser.close();server.close();}
