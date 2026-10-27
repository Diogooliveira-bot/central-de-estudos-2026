/* Base Completa — Direito Penal M02–M17.
 * Chromium usa os leitores nativos e os conteúdos originais, sem autenticação nem banco.
 * A validação é TÉCNICA; correção de paginação, títulos e tabelas é editorial.
 */
import assert from 'node:assert/strict';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {createServer} from 'node:http';
import {chromium} from 'playwright';

const read=path=>readFile(new URL('../'+path,import.meta.url),'utf8');
const ids=Array.from({length:16},(_,i)=>i+2);
const two=n=>String(n).padStart(2,'0');
const [baseCss,themeCss,appearanceCss,appearanceJs,themeJs,fullTheory,...rest]=await Promise.all([
 read('ui/native-study-reader.css'),
 read('ui/legal-complete-premium-v1.css'),
 read('ui/reading-appearance-v1.css'),
 read('ui/reading-appearance-v1.js'),
 read('ui/legal-complete-premium-v1.js'),
 Promise.all([1,2,3,4].map(n=>read('penal-full-theory-data-0'+n+'.js'))),
 ...ids.flatMap(n=>[
   read('content/penal/m'+two(n)+'-native-data.js'),
   read('ui/native-study-reader-m'+two(n)+'.js')
 ])
]);
const content=new Map(ids.map((n,i)=>[n,{data:rest[i*2],reader:rest[i*2+1]}]));
await mkdir('artifacts/etapa5-penal-m02-m17',{recursive:true});
const server=createServer((_req,res)=>{
 res.writeHead(200,{'content-type':'text/html; charset=utf-8'});
 res.end('<!doctype html><html lang="pt-BR" class="bc-ui-v1" data-bc-reading-mode="paper"><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><div id="subjects"></div></body></html>');
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
let browser;
const rows=[];
try{
 browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 for(const width of [390,768,1366]){
  const height=width===390?844:width===768?1024:768;
  for(const n of ids){
   const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   const id='bcNativeReaderOverlayM'+two(n),api='BaseNativeReaderM'+two(n);
   const label='PEN M'+two(n);
   try{
    await page.goto('http://127.0.0.1:'+server.address().port);
    for(const css of [baseCss,themeCss,appearanceCss]) await page.addStyleTag({content:css});
    for(const src of [appearanceJs,themeJs,...fullTheory,content.get(n).data,content.get(n).reader])
      await page.addScriptTag({content:src});
    const srcData=await page.evaluate(number=>{
      const d=window.BASE_NATIVE_CONTENT?.penal?.['m'+String(number).padStart(2,'0')];
      const t=window.PENAL_FULL_THEORY?.['p'+number];
      return {hasData:!!d,completeLength:(d?.complete||'').length,hasTheory:!!t?.html,theoryLength:t?.html?.length||0,
        completeChapters:d?.chapters?.complete?.length||0,title:d?.title||''};
    },n);
    assert.ok(srcData.hasData,label+': dados nativos não carregados');
    assert.ok(srcData.hasTheory || srcData.completeLength>1000,label+': fonte da apostila completa não carregada');
    await page.evaluate(name=>window[name].open('complete'),api);
    await page.waitForFunction(overlayId=>!!document.getElementById(overlayId)?.querySelector('.bc-native-article'),id,{timeout:10000});
    await page.waitForTimeout(75);
    const m=await page.evaluate(overlayId=>{
      const o=document.getElementById(overlayId),art=o.querySelector('.bc-native-article');
      const h1=art.querySelector('h1'),h2=art.querySelector('h2');
      const tables=[...art.querySelectorAll('table')];
      const headings=[...art.querySelectorAll('h2,h3')].map(h=>h.textContent.replace(/\\s+/g,' ').trim());
      return {
       premium:o.classList.contains('bc-apostila-v1'),
       appearance:o.classList.contains('bc-reading-appearance'),
       label:o.querySelector('.bc-native-reader-title small')?.textContent.trim(),
       textLength:art.textContent.trim().length,
       h1: h1?.textContent.trim()||null,
       h2Count:art.querySelectorAll('h2').length,
       h3Count:art.querySelectorAll('h3').length,
       h2Border:h2?getComputedStyle(h2).borderLeftWidth:null,
       tables:tables.length,
       semanticTables:tables.every(t=>t.rows.length>0),
       callouts:art.querySelectorAll('.bc-native-callout').length,
       chapterButtons:o.querySelectorAll('[data-chapter-check]').length,
       headingsLinks:art.querySelectorAll('h2[id],h3[id]').length,
       pageOverflow:document.documentElement.scrollWidth>innerWidth+2,
       headingExamples:headings.slice(0,5),
       suspiciousNumberedHeadings:headings.filter(t=>/^\\d{2,4}\\.\\s*[A-Za-zÀ-ÿ]/.test(t)).slice(0,8),
       brokenPageMarker: /BASE COMPLETA[^\\n]{0,50}\\d+\\s*\\/\\s*\\d+/i.test(art.textContent)
      };
    },id);
    assert.equal(m.premium,true,label+': tema Premium não aplicado');
    assert.equal(m.appearance,true,label+': controles de leitura ausentes');
    assert.ok(m.textLength>650,label+': apostila completa sem corpo de texto adequado');
    assert.ok(m.h2Count>=1,label+': títulos da apostila ausentes');
    assert.equal(m.h2Border,'5px',label+': hierarquia CSS Premium ausente');
    assert.equal(m.semanticTables,true,label+': estrutura de tabela inválida');
    assert.equal(m.pageOverflow,false,label+': conteúdo invade largura da janela');
    assert.ok(m.chapterButtons>=1,label+': marcação de capítulo não encontrada');
    const name='artifacts/etapa5-penal-m02-m17/pen-m'+two(n)+'-'+width;
    await page.locator('#'+id+' .bc-native-reader').screenshot({path:name+'-leitor.png'});
    if(m.tables)await page.locator('#'+id+' .bc-native-article table').first().screenshot({path:name+'-tabela.png'});
    const check=page.locator('#'+id+' [data-chapter-check]').first();
    const before=await check.evaluate(b=>b.classList.contains('done'));
    await check.click();
    const after=await check.evaluate(b=>b.classList.contains('done'));
    assert.notEqual(after,before,label+': marcação não reagiu');
    await page.evaluate(name=>window[name].close(),api);
    await page.evaluate(name=>window[name].open('complete'),api);
    await page.waitForFunction(overlayId=>!!document.getElementById(overlayId)?.querySelector('[data-chapter-check]'),id);
    const reopen=await page.locator('#'+id+' [data-chapter-check]').first().evaluate(b=>b.classList.contains('done'));
    assert.equal(reopen,after,label+': marcação não persistiu');
    await page.evaluate(name=>window[name].open('summary'),api);
    await page.waitForTimeout(70);
    const summary=await page.locator('#'+id).evaluate(o=>o.classList.contains('bc-apostila-v1'));
    assert.equal(summary,false,label+': estilo Premium vazou para resumo');
    assert.deepEqual(errors,[],label+': erros JS');
    rows.push({module:label,width,source:srcData,...m,checkboxPersisted:true,summaryUnstyled:true,errors});
   }finally{await page.close();}
  }
 }
 assert.equal(rows.length,48,'16 módulos em 3 larguras');
 await writeFile('artifacts/etapa5-penal-m02-m17/metricas.json',JSON.stringify(rows,null,2)+'\n');
 console.log('ETAPA5_PENAL_RESULTS='+JSON.stringify(rows));
}finally{if(browser)await browser.close();server.close();}
