/* Base Completa — Etapa 4.1.
 * Chromium local com os 14 leitores de CF M02–M15, conteúdos originais,
 * sem credenciais, banco, servidor remoto ou alteração de apostilas.
 */
import assert from 'node:assert/strict';
import {readFile, mkdir, writeFile} from 'node:fs/promises';
import {createServer} from 'node:http';
import {chromium} from 'playwright';

const read = p => readFile(new URL('../' + p, import.meta.url), 'utf8');
const ids = Array.from({length:14}, (_,i) => i+2);
const file = n => 'content/cf/m' + String(n).padStart(2,'0') + '-native-data.js';
const [theme, readingCss, readingJs, activator, cfJs, ...sources] = await Promise.all([
  read('ui/legal-complete-premium-v1.css'),
  read('ui/reading-appearance-v1.css'),
  read('ui/reading-appearance-v1.js'),
  read('ui/legal-complete-premium-v1.js'),
  read('ui/cf-native-study-v2.js'),
  ...ids.map(n => read(file(n)))
]);
await mkdir('artifacts/etapa4-constitucional-m02-m15',{recursive:true});
const server=createServer((_req,res)=>{
 res.writeHead(200,{'content-type':'text/html; charset=utf-8'});
 res.end('<!doctype html><html lang="pt-BR" class="bc-ui-v1"><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><main id="subjects"></main></body></html>');
});
await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
const url = 'http://127.0.0.1:' + server.address().port;
let browser;
const results=[];
try {
 browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 for (const width of [390,768,1366]) {
  const height=width===390?844:width===768?1024:768;
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  try {
   await page.goto(url);
   await page.evaluate(() => {
     window.CF_WEEKS=Array.from({length:15},(_,i)=>({num:i+1,id:'w'+(i+1)}));
     window.renderSubjects=()=>{};
     window.renderAll=()=>{};
   });
   for (const css of [theme,readingCss]) await page.addStyleTag({content:css});
   for (const src of [readingJs,activator,...sources,cfJs]) await page.addScriptTag({content:src});
   for(const n of ids){
    const label='CF M'+String(n).padStart(2,'0');
    const startErrors=errors.length;
    await page.evaluate(num=>window.CfNativeStudy.openReader(num,'complete'),n);
    await page.waitForFunction(()=>document.getElementById('cfNativeOverlay')?.classList.contains('bc-apostila-v1'),null,{timeout:8000});
    await page.waitForTimeout(60);
    const m=await page.evaluate(()=>{
      const o=document.getElementById('cfNativeOverlay');
      const a=o.querySelector('.cf-native-reader article');
      const h2=a.querySelector('h2');
      const tables=[...a.querySelectorAll('table')];
      const wraps=[...a.querySelectorAll('.cf-native-table-wrap')];
      return {
        premium:o.classList.contains('bc-apostila-v1'),
        readingControls:o.classList.contains('bc-reading-appearance'),
        title:o.querySelector('.cf-native-shell header b')?.textContent.trim()||'',
        h2Count:a.querySelectorAll('h2').length,
        h2Border:h2?getComputedStyle(h2).borderLeftWidth:null,
        tables:tables.length,
        tablesSemantic:tables.every(t=>!!t.tHead && !!t.tBodies.length),
        tableWrappers:wraps.length,
        allTableWrappersScroll:wraps.every(w=>getComputedStyle(w).overflowX==='auto'),
        callouts:a.querySelectorAll('.cf-native-callout').length,
        checkboxes:a.querySelectorAll('input[data-cf-check]').length,
        pageOverflow:document.documentElement.scrollWidth>innerWidth+2
      };
    });
    assert.equal(m.premium,true,label+' sem tema');
    assert.equal(m.readingControls,true,label+' sem controles de leitura');
    assert.ok(m.h2Count>0,label+' sem títulos');
    assert.equal(m.h2Border,'5px',label+' sem aparência nos títulos');
    assert.equal(m.pageOverflow,false,label+' vazamento lateral de viewport');
    assert.equal(m.tablesSemantic,true,label+' tabela perdeu semântica');
    assert.equal(m.tableWrappers,m.tables,label+' tabela sem contêiner');
    assert.equal(m.allTableWrappersScroll,true,label+' rolagem de tabela sem CSS');
    assert.ok(m.title.includes(label),label+' título incorreto');
    const slug='artifacts/etapa4-constitucional-m02-m15/cf-m'+String(n).padStart(2,'0')+'-'+width;
    await page.locator('#cfNativeOverlay .cf-native-shell').screenshot({path:slug+'.png'});
    if (m.checkboxes) {
      await page.locator('#cfNativeOverlay input[data-cf-check]').first().check();
      await page.evaluate(()=>window.CfNativeStudy.close());
      await page.evaluate(num=>window.CfNativeStudy.openReader(num,'complete'),n);
      assert.equal(await page.locator('#cfNativeOverlay input[data-cf-check]').first().isChecked(),true,label+' checkbox não persistiu');
    }
    await page.evaluate(num=>window.CfNativeStudy.openReader(num,'summary'),n);
    await page.waitForTimeout(30);
    assert.equal(await page.locator('#cfNativeOverlay').evaluate(o=>o.classList.contains('bc-apostila-v1')),false,label+' visual Premium vazou para resumo');
    await page.evaluate(()=>window.CfNativeStudy.close());
    assert.equal(errors.length,startErrors,label+' erro JavaScript: '+errors.slice(startErrors).join('; '));
    results.push({module:'CF M'+String(n).padStart(2,'0'),width,...m,checkboxPersisted:m.checkboxes>0?true:null,summaryExcluded:true,errors:[]});
   }
  } finally {await page.close();}
 }
 await writeFile('artifacts/etapa4-constitucional-m02-m15/metricas.json',JSON.stringify(results,null,2)+'\n');
 console.log('CF_M02_M15_RESULTS='+JSON.stringify(results));
 assert.equal(results.length,42,'Deveriam existir 14 módulos em 3 resoluções');
} finally {if(browser)await browser.close();server.close();}
