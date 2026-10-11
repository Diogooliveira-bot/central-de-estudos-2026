import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const root=resolve('.');
const text=['1. TÍTULO PRINCIPAL','Esta é uma apostila de teste, mantida integralmente no DOM.','',
'2. PRESSUPOSTOS','Art. 1º A norma permanece inalterada.','• primeiro item do texto','• segundo item do texto','',
'3. DESTAQUES JURÍDICOS','ATENÇÃO: hipótese de teste.','Uma explicação adicional com pontuação e palavras preservadas.'].concat(
 Array.from({length:9},(_,i)=>'Parágrafo '+(i+1)+' de leitura de teste para verificar responsividade, conteúdos extensos e quebra de linha.'));
const original=text.join('\n');
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const fixture='<!doctype html><html lang="pt-BR" class="bc-ui-v1"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'+
 '<link rel="stylesheet" href="/ui/universal-reader-v1.css"></head><body><div class="bc-native-reader-overlay">'+
 '<section class="bc-native-reader"><header class="bc-native-reader-head"><div class="bc-native-reader-title"><b>Módulo M08 — Teste de leitura</b><small>Teoria Resumida e Completa</small></div><button class="bc-native-reader-close">×</button></header>'+
 '<div class="bc-native-reader-tools"><button type="button">Voltar</button><input type="search" aria-label="Buscar no material"></div><div class="bc-native-reader-body">'+
 '<nav class="bc-native-toc"><button>Capítulo 1</button><button>Capítulo 2</button></nav><main class="bc-native-scroll"><article class="bc-native-article">'+
 '<h1>Apostila digital</h1><pre id="raw">'+esc(original)+'</pre><section class="fixation-question"><button id="q" type="button">Questão</button></section>'+
 '<textarea id="note">Anotação existente</textarea><img alt="Figura de teste" src="/assets/base-completa-symbol.webp"></article></main></div></section></div>'+
 '<script>document.querySelector("#q").onclick=()=>document.querySelector("#q").dataset.clicked="1"</script>'+
 '<script defer src="/ui/universal-reader-v1.js"></script></body></html>';
const mime={'.js':'application/javascript','.css':'text/css','.html':'text/html','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{
 const u=new URL(req.url,'http://127.0.0.1');
 if(u.pathname==='/__fixture__'){res.writeHead(200,{'Content-Type':'text/html'});res.end(fixture);return}
 const file=resolve(root,'.'+decodeURIComponent(u.pathname));
 if(!file.startsWith(root+'/')){res.writeHead(403);res.end();return}
 try{const data=await readFile(file);res.writeHead(200,{'Content-Type':mime[extname(file)]||'application/octet-stream'});res.end(data)}catch(e){res.writeHead(404);res.end('missing')}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const port=server.address().port,base='http://127.0.0.1:'+port;
const viewports=[{name:'celular',width:390,height:844},{name:'tablet',width:768,height:1024},{name:'computador',width:1366,height:768}];
const results=[];
let browser;
try{
 browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 for(const vp of viewports){
  const context=await browser.newContext({viewport:{width:vp.width,height:vp.height}});
  await context.addInitScript(()=>localStorage.setItem('central-v6:reader-user-note','NAO_ALTERAR'));
  const page=await context.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/__fixture__',{waitUntil:'load'});
  await page.waitForTimeout(150);
  const state=await page.evaluate(()=>({
   sheet:!!document.querySelector('.bc-universal-sheet'),
   projection:!!document.querySelector('.bc-universal-projection'),
   rawStillPresent:!!document.getElementById('raw'),
   rawHidden:document.getElementById('raw')?.hidden===true,
   headingCount:document.querySelectorAll('.bc-universal-projection h2,.bc-universal-projection h3').length,
   law:!!document.querySelector('.bc-universal-law'),
   index:!!document.querySelector('[data-bc-universal-index]'),
   stored:localStorage.getItem('central-v6:reader-user-note'),
   width:document.documentElement.scrollWidth,
   original:document.getElementById('raw')?.textContent,
  }));
  const button=page.locator('[data-bc-universal-index]');if(state.index)await button.click();
  await page.locator('#q').click();
  const after=await page.evaluate(()=>({
    expanded:document.querySelector('[data-bc-universal-index]')?.getAttribute('aria-expanded'),
    question:document.querySelector('#q')?.dataset.clicked,
    note:document.querySelector('#note')?.value,
  }));
  results.push({type:'fixture',viewport:vp.name,overflow:state.width>vp.width+2,
   pass:state.sheet&&state.projection&&state.rawStillPresent&&state.rawHidden&&state.headingCount>=2&&
    state.law&&state.index&&state.stored==='NAO_ALTERAR'&&state.original===original&&
    after.expanded==='true'&&after.question==='1'&&after.note==='Anotação existente'&&errors.length===0,
    errors,details:{headings:state.headingCount,originalUnchanged:state.original===original,scrollWidth:state.width}});
  await context.close();
 }
 for(let n=1;n<=18;n++){
  for(const vp of viewports){
   const context=await browser.newContext({viewport:{width:vp.width,height:vp.height}});
   const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
   const assets=[];page.on('response',r=>{if(r.status()===404&&/universal-reader/.test(r.url()))assets.push(r.url())});
   const url=base+'/modules/trabalho/base-completa/m'+String(n).padStart(2,'0')+'.html';
   const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:25000});
   await page.waitForTimeout(75);
   const audit=await page.evaluate(()=>({
    applied:document.body.classList.contains('bc-universal-standalone'),
    headings:document.querySelectorAll('main h1,main h2,main h3').length,
    text:document.querySelector('main')?.textContent.length||0,
    width:document.documentElement.scrollWidth
   }));
   results.push({type:'trabalho',module:'M'+String(n).padStart(2,'0'),viewport:vp.name,
    pass:response?.status()===200&&audit.applied&&audit.headings>=2&&audit.text>1800&&
       audit.width<=vp.width+2&&!errors.length&&!assets.length,
    overflow:audit.width>vp.width+2,status:response?.status(),headings:audit.headings,
    characters:audit.text,errors,missingAssets:assets});
   await context.close();
  }
 }
}finally{await browser?.close();await new Promise(r=>server.close(r))}
const failures=results.filter(r=>!r.pass);
console.log('BROWSER_RESULTS',JSON.stringify({total:results.length,passed:results.length-failures.length,
 failed:failures.length,byViewport:Object.fromEntries(viewports.map(x=>[x.name,results.filter(r=>r.viewport===x.name).length])),
 fixture:results.filter(r=>r.type==='fixture'),failures:failures.slice(0,15)}));
assert.equal(failures.length,0,'Universal reader browser smoke failed');
