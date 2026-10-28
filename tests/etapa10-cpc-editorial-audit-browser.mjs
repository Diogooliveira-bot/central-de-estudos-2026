/* Etapa 10 — auditoria editorial de CPC M01–M20.
 * Chromium real e fontes originais em localhost; sem sessão de aluno, rede externa,
 * produção, Preview Vercel ou banco de dados. Métricas diagnósticas não são
 * certificação de precisão jurídica nem de fidelidade visual humana.
 */
import assert from 'node:assert/strict';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {createServer} from 'node:http';
import {chromium} from 'playwright';
const read=p=>readFile(new URL('../'+p,import.meta.url),'utf8');
const pad=n=>String(n).padStart(2,'0');
const styles=await Promise.all([
 read('ui/native-study-reader.css'),
 read('ui/legal-complete-premium-v1.css'),
 read('ui/reading-appearance-v1.css')
]);
const shell=await Promise.all([
 read('ui/reading-appearance-v1.js'),read('ui/legal-complete-premium-v1.js')
]);
const modules=await Promise.all(Array.from({length:20},async(_,i)=>{
 const n=i+1,id=pad(n);
 return {
  n,
  data:await read('content/cpc/m'+id+'-native-data.js'),
  reader:await read(n===1?'ui/cpc-native-study-reader.js':'ui/cpc-m'+id+'-native-study-reader.js')
 };
}));
const dir='artifacts/etapa10-cpc-editorial';
await mkdir(dir,{recursive:true});
const server=createServer((req,res)=>{
 res.writeHead(200,{'content-type':'text/html; charset=utf-8'});
 res.end('<!doctype html><html lang="pt-BR" class="bc-ui-v1" data-bc-reading-mode="paper"><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><main id="subjects"></main></body></html>');
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const base='http://127.0.0.1:'+server.address().port;
let browser;
const findings=[];
try{
 browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 for(const width of [390,768,1366]){
  for(const module of modules){
   const {n}=module,label='CPC M'+pad(n),id=n===1?'cpcNativeReaderOverlay':'cpcM'+pad(n)+'NativeReaderOverlay',
   api=n===1?'CpcNativeReader':'CpcM'+pad(n)+'NativeReader';
   const page=await browser.newPage({viewport:{width,height:width===390?844:width===768?1024:768},deviceScaleFactor:1});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   try{
    await page.goto(base);
    for(const css of styles)await page.addStyleTag({content:css});
    for(const js of [...shell,module.data,module.reader])await page.addScriptTag({content:js});
    await page.evaluate(api=>window[api].open('complete'),api);
    await page.waitForFunction(id=>document.getElementById(id)?.classList.contains('bc-apostila-v1'),id,{timeout:10000});
    await page.waitForTimeout(60);
    const result=await page.evaluate(({n,id,width})=>{
     const o=document.getElementById(id),a=o.querySelector('.bc-native-article');
     const src=window.BASE_NATIVE_CONTENT.cpc['m'+String(n).padStart(2,'0')].complete;
     const text=a.innerText.replace(/\s+/g,' ').trim();
     const sourceLines=src.replace(/\r/g,'').split('\n').map(s=>s.replace(/\s+/g,' ').trim()).filter(s=>s.length>28&&!/^BASE COMPLETA/.test(s));
     const lost=sourceLines.filter(s=>!text.includes(s));
     const headings=[...a.querySelectorAll('h1,h2,h3')].map(h=>({level:h.tagName,title:h.textContent.trim(),id:h.id}));
     const suspicious=headings.filter(h=>/^\d+\.\s+\d+\./.test(h.title)||/^\d+\.\s*$/i.test(h.title));
     const repeated=headings.map(h=>h.title).filter((h,i,arr)=>arr.indexOf(h)!==i);
     const toc=[...o.querySelectorAll('.bc-native-toc button')];
     const tables=[...a.querySelectorAll('table')].map((t,i)=>{
      const wrap=t.closest('.table-wrap,.bc-cpc-m01-table-scroll,.bc-editor-table-wrap,.adm-table-scroll');
      const th=[...t.querySelectorAll('thead th')];
      const styles=getComputedStyle(t);
      return {
       index:i,rows:t.tBodies[0]?.rows.length||0,cols:t.tHead?.rows[0]?.cells.length||0,
       caption:!!t.caption?.textContent.trim(),
       headers:th.length,headingScopes:th.every(h=>h.scope==='col'),
       rowHeaderScopes:[...t.tBodies].every(tb=>[...tb.rows].every(r=>r.cells[0]?.tagName==='TH'&&r.cells[0]?.scope==='row')),
       wrapper:!!wrap,overflowX:wrap?getComputedStyle(wrap).overflowX:null,
       scrollWidth:wrap?.scrollWidth||0,clientWidth:wrap?.clientWidth||0,
       tableWidth:Math.round(t.getBoundingClientRect().width),
       minFont:Math.min(...[...t.querySelectorAll('th,td')].map(c=>parseFloat(getComputedStyle(c).fontSize)||100)),
       nativeDisplay:styles.display
      };
     });
     return {
      module:'CPC M'+String(n).padStart(2,'0'),width,title:window.BASE_NATIVE_CONTENT.cpc['m'+String(n).padStart(2,'0')].title,
      sourceChars:src.length,readableChars:text.length,
      sourceLines:sourceLines.length,notExactLines:lost.length,
      missingLineExamples:lost.slice(0,8),missingLinePercent:Math.round(1000*lost.length/Math.max(1,sourceLines.length))/10,
      headingsTotal:headings.length,h1:headings.filter(h=>h.level==='H1').length,h2:headings.filter(h=>h.level==='H2').length,h3:headings.filter(h=>h.level==='H3').length,
      suspiciousHeadings:suspicious,repeatedHeadings:[...new Set(repeated)].slice(0,9),
      tocItems:toc.length,chapterCheckButtons:o.querySelectorAll('[data-cpc-chapter-check]').length,
      tables,pageOverflow:document.documentElement.scrollWidth>innerWidth+2,
      premium:o.classList.contains('bc-apostila-v1'),readerName:o.querySelector('.bc-native-reader-title b')?.textContent.trim(),
      narrowArticle:a.getBoundingClientRect().width<260,
      horizontalArticleOverflow:a.scrollWidth>a.clientWidth+4
     };
    },{n,id,width});
    assert.equal(result.premium,true,label+': tema Premium não carregado');
    assert.equal(result.h1,1,label+': esperado um H1 no artigo');
    assert.ok(result.h2>0,label+': capítulos H2 indisponíveis');
    assert.equal(result.pageOverflow,false,label+': transbordamento da página');
    assert.ok(result.tables.length>0,label+': quadro consultivo HTML ausente');
    assert.ok(result.tables.every(t=>t.rows>0&&t.cols>1&&t.wrapper),label+': tabela fora do padrão semântico');
    assert.ok(result.tables.every(t=>t.overflowX==='auto'),label+': tabela sem rolagem horizontal própria');
    if(width===390)assert.ok(result.tables.every(t=>t.scrollWidth>t.clientWidth+1),label+': tabela sem rolagem celular');
    assert.deepEqual(errors,[],label+': erro JavaScript');
    findings.push({...result,errors});
    if(width===390||n===1||n===20){
     await page.locator('#'+id+' .bc-native-reader').screenshot({path:dir+'/m'+pad(n)+'-'+width+'-leitor.png'});
     await page.locator('#'+id+' .bc-native-article table').first().screenshot({path:dir+'/m'+pad(n)+'-'+width+'-tabela.png'});
    }
    await page.evaluate(api=>window[api].close(),api);
   }finally{await page.close();}
  }
 }
 assert.equal(findings.length,60,'esperados 20 módulos × 3 telas');
 await writeFile(dir+'/metricas.json',JSON.stringify(findings,null,2)+'\n');
 console.log('ETAPA10_CPC_AUDIT='+JSON.stringify(findings));
}finally{if(browser)await browser.close();server.close()}
