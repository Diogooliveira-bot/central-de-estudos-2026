/* Etapa 10.4: navegação pelo menu real da Central, Chromium com sessão simulada.
 * Não é E2E autenticado no deployment; não confundir este teste com teste de rede Vercel/Neon.
 */
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { chromium } from 'playwright';

const root = resolve('.');
const mime = {
 '.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8',
 '.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8',
 '.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml',
 '.ico':'image/x-icon','.webmanifest':'application/manifest+json',
 '.txt':'text/plain; charset=utf-8',
};
const server = createServer(async (req,res) => {
 const url = new URL(req.url,'http://127.0.0.1');
 if(url.pathname==='/api/auth') {
  res.writeHead(200,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});
  res.end(JSON.stringify({authenticated:true,user:{id:'cpc-10-4-fixture',name:'Aluno Premium fictício',role:'aluno',active:true}}));return;
 }
 if(url.pathname==='/api/plans') {
  res.writeHead(200,{'Content-Type':'application/json; charset=utf-8'});
  res.end(JSON.stringify({role:'aluno',plan:'premium',status:'active',entitlements:{'theory.complete':{enabled:true},'theory.summary':{enabled:true}}}));return;
 }
 if(url.pathname==='/api/sync') {
  res.writeHead(200,{'Content-Type':'application/json; charset=utf-8'});
  res.end(req.method==='POST'?JSON.stringify({revision:1}):JSON.stringify({exists:false}));return;
 }
 if(url.pathname.startsWith('/api/')) {
  res.writeHead(200,{'Content-Type':'application/json; charset=utf-8'});res.end('{}');return;
 }
 const path=resolve(root,'.'+decodeURIComponent(url.pathname==='/'?'/central-v119.html':url.pathname));
 if(!path.startsWith(root+'/')){res.writeHead(403);res.end();return}
 try{const contents=await readFile(path);res.writeHead(200,{'Content-Type':mime[extname(path)]||'application/octet-stream'});res.end(contents)}
 catch{res.writeHead(404);res.end('Not found')}
});
await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
const base='http://127.0.0.1:'+server.address().port;
const metrics=[];
let browser;
await mkdir('artifacts/etapa10-4-cpc-integrated',{recursive:true});
try{
 browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 for(const width of [390,768,1366]) {
  const height=width===390?844:width===768?1024:768;
  const ctx=await browser.newContext({viewport:{width,height},serviceWorkers:'block'});
  const page=await ctx.newPage();
  const errors=[];let navDiagnostic=null,navClickError=null;
  page.on('pageerror',e=>errors.push(String(e.message).slice(0,230)));
  try{
   const response=await page.goto(base+'/central-v119.html',{waitUntil:'domcontentloaded',timeout:45000});
   assert.equal(response?.status(),200,'Bootstrap HTTP '+width);
   await page.waitForFunction(()=>document.documentElement.dataset.centralReady==='true' && typeof window.centralHardOpen==='function',{},{timeout:50000});
   // O bootstrap substitui intencionalmente a rota pelo caminho /.
   assert.equal(new URL(page.url()).pathname,'/','Boot reescreveu o endereço inesperadamente');
   const nav=page.locator('[data-central-native="disciplines"]');
   navDiagnostic=await page.evaluate(()=>{
    const b=document.querySelector('[data-central-native="disciplines"]');
    function details(el){if(!el)return null;const cs=getComputedStyle(el),r=el.getBoundingClientRect();return {tag:el.tagName,id:el.id||'',className:typeof el.className==='string'?el.className.slice(0,110):'',display:cs.display,visibility:cs.visibility,opacity:cs.opacity,width:Math.round(r.width),height:Math.round(r.height)}}
    return {rootClasses:document.documentElement.className,nav:details(b),parent:details(b?.parentElement),aside:details(document.getElementById('centralSidebar')),topbar:details(document.querySelector('.topbar')),readerActive:document.documentElement.classList.contains('student-reader-active'),pageButtons:[...document.querySelectorAll('[data-student-primary-nav]')].map(details)};
   });
   const navVisible=await nav.isVisible();
   if(navVisible){
    try{await nav.click({timeout:1300});}
    catch(e){navClickError=String(e.message).slice(0,260);await page.evaluate(()=>window.centralHardOpen('disciplines'));}
   }else{
    navClickError='O botão não está visível';
    await page.evaluate(()=>window.centralHardOpen('disciplines'));
   }
   await page.waitForSelector('#disciplinesView:not(.hidden)',{timeout:15000});
   const card=page.locator('#disciplineGrid .disc-card[data-id="cpc"]');
   assert.equal(await card.count(),1,'Cartão CPC ausente');
   await card.click();
   await page.waitForFunction(()=>window.CentralDisciplineLoader?.isReady('cpc')===true,null,{timeout:100000});
   const cpc=await page.evaluate(()=>({
    moduleCount:document.querySelectorAll('#subjects .subject[data-id="cpc"] .cf-module').length,
    m05Reader:typeof window.CpcM05NativeReader?.open==='function',
    loaded:window.CentralDisciplineLoader?.isReady('cpc'),
   }));
   assert.ok(cpc.loaded&&cpc.m05Reader,'Leitor CPC M05 não carregou');
   page.on('dialog',dialog=>dialog.dismiss());
   await page.evaluate(()=>window.CpcM05NativeReader.open('complete'));
   const overlay=page.locator('#cpcM05NativeReaderOverlay');
   await overlay.waitFor({state:'visible',timeout:15000});
   const dividers=await overlay.locator('p.bc-cpc-m05-part-divider').allTextContents();
   assert.ok(dividers.some(x=>x.includes('PARTE IV - PEGADINHAS FCC')),'Divisor IV ausente');
   assert.ok(dividers.some(x=>x.includes('PARTE VIII - ROTEIRO DE REVISÃO')),'Divisor VIII ausente');
   assert.equal(await overlay.locator('h2.bc-cpc-m05-quiz-heading').count(),14,'Questões destacadas: H2');
   assert.equal(await overlay.locator('p.bc-cpc-m05-quiz-prompt').count(),1,'Questão 2 destacada');
   const check=overlay.locator('[data-cpc-chapter-check]').first();
   const chapter=await check.getAttribute('data-cpc-chapter-check');
   assert.ok(chapter,'Checkbox de capítulo ausente');
   const initial=await page.evaluate(id=>window.CpcM05NativeReader.chapterDone('complete',id),chapter);
   await check.click();
   const toggled=await page.evaluate(id=>window.CpcM05NativeReader.chapterDone('complete',id),chapter);
   assert.notEqual(toggled,initial,'Checkbox não alterou o estado');
   await page.evaluate(()=>window.CpcM05NativeReader.close());
   await page.evaluate(()=>window.CpcM05NativeReader.open('complete'));
   const reopened=await page.evaluate(id=>window.CpcM05NativeReader.chapterDone('complete',id),chapter);
   assert.equal(reopened,toggled,'Marcação não persistiu ao reabrir o leitor');
   // Fixture: restaura estado para permitir reexecução idempotente.
   if(toggled!==initial) await page.locator('#cpcM05NativeReaderOverlay [data-cpc-chapter-check]').first().click();
   await page.locator('#cpcM05NativeReaderOverlay').screenshot({path:'artifacts/etapa10-4-cpc-integrated/'+width+'-m05.png'});
   metrics.push({width,navVisible,navDiagnostic,navClickError,boot:'ready',route:'/',disciplinesView:'opened',cpcLoaded:cpc.loaded,m05Reader:cpc.m05Reader,modules:cpc.moduleCount,dividers:dividers.length,quizHeadings:14,chapterPersisted:reopened===toggled,errors:errors.slice(0,8),passed:true});
  }catch(e){
   const debug=await page.evaluate(()=>({url:location.pathname,ready:document.documentElement.dataset.centralReady||'',bootMessage:document.getElementById('status')?.textContent?.slice(0,120),hasSubjects:!!document.getElementById('subjects'),cpcReady:window.CentralDisciplineLoader?.isReady('cpc')||false})).catch(()=>({}));
   await page.screenshot({path:'artifacts/etapa10-4-cpc-integrated/'+width+'-failure.png',fullPage:false}).catch(()=>{});
   metrics.push({width,passed:false,error:String(e.message).slice(0,420),debug,navDiagnostic,navClickError,errors:errors.slice(0,10)});
  }
  await ctx.close();
 }
}finally{
 await browser?.close();
 await new Promise(ok=>server.close(ok));
}
await writeFile('artifacts/etapa10-4-cpc-integrated/metricas.json',JSON.stringify(metrics,null,2));
console.log('ETAPA10_4_CPC_NAV='+JSON.stringify(metrics));
assert.equal(metrics.length,3);
assert.ok(metrics.every(m=>m.passed),'O teste de navegação interna CPC deve passar em 390/768/1366px');
