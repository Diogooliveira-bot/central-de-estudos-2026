/* Etapa 8 — Direito Processual Penal M01–M22.
 * Material real compactado; leitor de produção em Chromium local isolado.
 * Sem contas, credenciais, Neon, Production ou Preview autenticada.
 */
import assert from 'node:assert/strict';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {createServer} from 'node:http';
import {chromium} from 'playwright';

const read=p=>readFile(new URL('../'+p,import.meta.url),'utf8');
const assets=await Promise.all([
 'ui/native-study-reader.css',
 'ui/cpp-native-study-v1.css',
 'ui/legal-complete-premium-v1.css',
 'ui/reading-appearance-v1.css',
 'ui/native-reading-session.js',
 'ui/reading-appearance-v1.js',
 'ui/legal-complete-premium-v1.js',
 'content/cpp/cpp-native-index.js',
 'content/cpp/cpp-native-content-packed.js',
 'ui/cpp-native-study-v1.js'
].map(read));
const [baseCss,cppCss,premiumCss,appearanceCss,sessionJs,appearanceJs,themeJs,indexJs,packedJs,cppJs]=assets;
const folder='artifacts/etapa8-cpp-m01-m22';
await mkdir(folder,{recursive:true});
const server=createServer((_req,res)=>{
 res.writeHead(200,{'content-type':'text/html; charset=utf-8'});
 res.end('<!doctype html><html lang="pt-BR" class="bc-ui-v1" data-bc-reading-mode="paper"><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><main id="subjects"></main></body></html>');
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
let browser;
const result=[];
try{
 browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 for(const width of [390,768,1366]){
  const height=width===390?844:width===768?1024:768;
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  try{
   await page.goto('http://127.0.0.1:'+server.address().port);
   await page.evaluate(()=>{
     window.renderDisciplineGrid=()=>{};
     window.renderContinue=()=>{};
     window.subjStats=()=>({});
   });
   for(const css of [baseCss,cppCss,premiumCss,appearanceCss])await page.addStyleTag({content:css});
   for(const script of [sessionJs,appearanceJs,themeJs,indexJs,packedJs,cppJs])await page.addScriptTag({content:script});
   const inventory=await page.evaluate(async ()=>{
     const raw=window.CPP_NATIVE_PACKED_B64, idx=window.CPP_NATIVE_INDEX;
     if(typeof DecompressionStream!=='function'||!raw)return {unpacked:false};
     const bin=Uint8Array.from(atob(raw),c=>c.charCodeAt(0));
     const modules=await new Response(new Blob([bin]).stream().pipeThrough(new DecompressionStream('gzip'))).json();
     return {
       unpacked:true,
       moduleCount:idx?.modules?.length,
       payloadCount:Object.keys(modules).length,
       completeCount:Object.values(modules).filter(x=>String(x?.completeHtml||'').length>500).length,
       summaryCount:Object.values(modules).filter(x=>String(x?.summaryHtml||'').length>100).length,
       moduleCodes:Object.keys(modules),
     };
   });
   assert.equal(inventory.unpacked,true,'CPP: descompactação indisponível');
   assert.equal(inventory.moduleCount,22,'CPP: índice incompleto');
   assert.equal(inventory.payloadCount,22,'CPP: pacote original incompleto');
   assert.equal(inventory.completeCount,22,'CPP: há apostilas completas vazias');
   assert.equal(inventory.summaryCount,22,'CPP: há resumos vazios');
   for(const n of Array.from({length:22},(_,i)=>i+1)){
    const label='CPP M'+String(n).padStart(2,'0');
    const beforeErrors=errors.length;
    await page.evaluate(async n=>window.CppNative.open(n,'complete'),n);
    await page.waitForFunction(()=>{
      const o=document.getElementById('cpp-native-reader');
      return o?.classList.contains('bc-apostila-v1')&&!!o.querySelector('.bc-native-article');
    },null,{timeout:14000});
    await page.waitForTimeout(70);
    const m=await page.evaluate(n=>{
      const o=document.getElementById('cpp-native-reader'),a=o.querySelector('.bc-native-article');
      const h2=a.querySelector('h2'),tables=[...a.querySelectorAll('table')];
      return {
        premium:o.classList.contains('bc-apostila-v1'),
        appearance:o.classList.contains('bc-reading-appearance'),
        eyebrow:o.querySelector('.bc-native-reader-title small')?.textContent.trim()||'',
        title:o.querySelector('.bc-native-reader-title b')?.textContent.trim()||'',
        textChars:a.textContent.trim().length,
        h1:a.querySelectorAll('h1').length,
        h2:a.querySelectorAll('h2').length,
        h3:a.querySelectorAll('h3').length,
        h2Border:h2?getComputedStyle(h2).borderLeftWidth:null,
        tocButtons:o.querySelectorAll('.bc-native-toc button').length,
        tables:tables.length,
        semanticTables:tables.every(t=>t.rows.length>0),
        preBlocks:a.querySelectorAll('pre').length,
        callouts:a.querySelectorAll('.bc-native-callout').length,
        finishButtons:o.querySelectorAll('[data-finish-reading]').length,
        pageOverflow:document.documentElement.scrollWidth>innerWidth+2,
        headingSamples:[...a.querySelectorAll('h2,h3')].slice(0,5).map(h=>h.textContent.trim()),
        externalLinks:a.querySelectorAll('a[href^="http"]').length
      };
    },n);
    assert.equal(m.premium,true,label+': CSS Premium ausente');
    assert.equal(m.appearance,true,label+': aparência de leitura ausente');
    assert.ok(m.eyebrow.includes('MÓDULO '+String(n).padStart(2,'0')),label+': módulo incorreto');
    assert.ok(m.textChars>650,label+': conteúdo completo insuficiente');
    assert.ok(m.h1+m.h2+m.h3>=2,label+': títulos insuficientes');
    assert.ok(m.tocButtons>=1,label+': navegação ausente');
    assert.equal(m.semanticTables,true,label+': tabela semântica inválida');
    assert.equal(m.pageOverflow,false,label+': página transborda na horizontal');
    assert.equal(m.finishButtons,1,label+': botão Concluir leitura ausente');
    const name=folder+'/cpp-m'+String(n).padStart(2,'0')+'-'+width;
    await page.locator('#cpp-native-reader .bc-native-reader').screenshot({path:name+'-leitor.png'});
    if(m.tables)await page.locator('#cpp-native-reader .bc-native-article table').first().screenshot({path:name+'-tabela.png'});
    const key='central-v6:cpp-native:m'+String(n).padStart(2,'0')+':complete:read';
    await page.locator('#cpp-native-reader [data-finish-reading]').click();
    assert.equal(await page.evaluate(k=>localStorage.getItem(k),key),'100',label+': conclusão não registrada');
    await page.evaluate(()=>window.CppNative.close());
    await page.evaluate(async n=>window.CppNative.open(n,'complete'),n);
    await page.waitForFunction(()=>!!document.querySelector('#cpp-native-reader .bc-native-article'),null,{timeout:14000});
    const restored=await page.locator('#cpp-native-reader .bc-native-reader-meta').innerText();
    assert.ok(restored.includes('100%'),label+': progresso perdido ao reabrir');
    await page.evaluate(()=>window.CppNative.close());
    await page.evaluate(async n=>window.CppNative.open(n,'summary'),n);
    await page.waitForFunction(()=>!!document.querySelector('#cpp-native-reader .bc-native-article'),null,{timeout:14000});
    await page.waitForTimeout(55);
    const summary=await page.locator('#cpp-native-reader').evaluate(o=>({premium:o.classList.contains('bc-apostila-v1'),chars:o.querySelector('.bc-native-article').textContent.trim().length}));
    assert.equal(summary.premium,false,label+': visual exclusivo Premium vazou para resumo');
    assert.ok(summary.chars>100,label+': resumo não foi renderizado');
    await page.evaluate(()=>window.CppNative.close());
    assert.deepEqual(errors.slice(beforeErrors),[],label+': exceção JavaScript');
    result.push({module:label,width,...m,progressPersisted:true,summaryUnstyled:true,errors:[]});
   }
  }finally{await page.close();}
 }
 assert.equal(result.length,66,'esperados 22 módulos × 3 telas');
 await writeFile(folder+'/metricas.json',JSON.stringify(result,null,2)+'\n');
 console.log('ETAPA8_CPP_RESULTS='+JSON.stringify(result));
}finally{if(browser)await browser.close();server.close();}
