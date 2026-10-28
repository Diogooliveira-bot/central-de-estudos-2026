/* Etapa 10.4 — smoke E2E local do fluxo real da Central.
 * Chromium + arquivos da aplicação + API de sessão/planos simulada em localhost.
 * Não entra em Vercel, Neon nem cria senha. Isto NÃO homologa a Preview real.
 */
import assert from 'node:assert/strict';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {createServer} from 'node:http';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dir=path.join(root,'artifacts','etapa10-4-cpc-home-flow');
await mkdir(dir,{recursive:true});
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.woff2':'font/woff2'};
let plan='premium';
const calls=[];
const user={id:'cpc-test-local-fixture',name:'Aluno fictício - smoke local',role:'aluno',active:true,email:'fixture@local.invalid'};
const entitlement=()=>Object.fromEntries(['theory.summary','theory.complete','tec.links','qc.links','progress.advanced_sync','premium.reviews'].map(x=>[x,{enabled:x==='theory.summary'||plan==='premium',dailyLimit:null}]));
const json=(res,status,obj)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(obj))};
const server=createServer(async(req,res)=>{
 const url=new URL(req.url,'http://localhost');let urlPath=url.pathname;
 if(urlPath==='/') {res.writeHead(307,{Location:'/central-v119.html'});res.end();return}
 if(urlPath==='/api/auth'&&url.searchParams.get('action')==='me'){json(res,200,{authenticated:true,user});return}
 if(urlPath==='/api/plans'&&url.searchParams.get('action')==='me'){json(res,200,{role:'aluno',plan,status:'active',isStaff:false,entitlements:entitlement()});return}
 if(urlPath==='/api/sync'){json(res,200,{exists:false,revision:1});return}
 if(urlPath.startsWith('/api/')){calls.push(url.pathname);json(res,200,{});return}
 if(plan==='free' && urlPath==='/content/civil/civil-sharing-links.js'){
  calls.push('403 '+urlPath);json(res,403,{error:'Links de Direito Civil exclusivos do Premium'});return;
 }
 if(plan==='free' && urlPath==='/content/cpc/cpc-fixation-questions-v1.js'){
  calls.push('403 '+urlPath);res.writeHead(403,{'Content-Type':'application/json; charset=utf-8'});res.end('{"error":"Recurso exclusivo do Premium"}');return;
 }
 let decoded;try{decoded=decodeURIComponent(urlPath)}catch{res.writeHead(400);res.end();return}
 const filename=path.resolve(root,'.'+decoded);
 if(!filename.startsWith(root+path.sep)){res.writeHead(403);res.end();return}
 try{const content=await readFile(filename);res.writeHead(200,{'Content-Type':mime[path.extname(filename)]||'application/octet-stream','Cache-Control':'no-store','Access-Control-Allow-Origin':'*'});res.end(content)}
 catch(err){if(err.code==='ENOENT'||err.code==='EISDIR'){res.writeHead(404);res.end('not found '+decoded);return}res.writeHead(500);res.end('server file error')}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base='http://127.0.0.1:'+server.address().port;
let browser;const results=[];
try{
 browser=await chromium.launch({headless:true,args:['--disable-dev-shm-usage']});
 for(const variant of ['premium','free']){
  plan=variant;
  const context=await browser.newContext({viewport:{width:variant==='free'?390:1366,height:840},serviceWorkers:'block'});
  const page=await context.newPage();
  const errors=[],badAssets=[],rejections=[];
  page.on('pageerror',e=>errors.push(String(e.message).slice(0,380)));
  page.on('response',r=>{if(r.status()>=400&&/\.(?:js|css|html|json)(?:\?|$)/.test(r.url()))badAssets.push({status:r.status(),path:new URL(r.url()).pathname})});
  page.on('console',m=>{if(m.type()==='error')rejections.push(m.text().slice(0,280))});
  let ready=false,navVisible=false,cpcReady=false,mode='unknown',cpcItems=0;
  try {
   await page.goto(base+'/central-v119.html',{waitUntil:'domcontentloaded',timeout:30000});
   await page.waitForFunction(()=>document.documentElement.dataset.centralReady==='true',{timeout:75000});
   ready=true;
   // O caminho '/' é esperado: central-v119 troca o histórico, não fecha a Central.
   assert.equal(new URL(page.url()).pathname,'/','rota / é o caminho canônico após o boot');
   // O primeiro acesso exige seleção de objetivo; sem isso a navegação fica coberta.
   const freeStudy=page.locator('#studyObjectiveDialog [data-study-select="free-study"]');
   await freeStudy.waitFor({state:'visible',timeout:18000});
   await freeStudy.click();
   await page.waitForFunction(()=>!document.documentElement.classList.contains('study-objective-open'),null,{timeout:17000});
   const onboarding=page.locator('[data-student-onboarding] button.student-onboarding-close').first();
   // O onboarding possui dois botões com data-onboarding-close. Selecionar
   // explicitamente o botão X evita a violação de strict mode do Playwright.
   if(await onboarding.isVisible())await onboarding.click();
   const nav=page.locator('[data-central-native="disciplines"]');
   assert.equal(await nav.count(),1,'botão Disciplinas não está presente');
   if(await nav.isVisible()){
    try{await nav.click({timeout:2000})}catch{await page.evaluate(()=>window.centralHardOpen('disciplines'))}
   }else await page.evaluate(()=>window.centralHardOpen('disciplines'));
   await page.locator('#disciplinesView:not(.hidden)').waitFor({timeout:20000});
   // O painel moderno transforma o cartão em [data-study-open-subject],
   // preservando o onclick anterior apenas como fallback.
   const card=page.locator('#disciplineGrid [data-study-open-subject="cpc"], #disciplineGrid .disc-card[data-id="cpc"]').first();
   await card.waitFor({state:'visible',timeout:20000});
   navVisible=true;
   await card.click({timeout:15000});
   await page.waitForFunction(()=>window.CentralDisciplineLoader?.isReady('cpc')===true,{timeout:65000});
   cpcReady=true;
   if(variant==='free'){
    assert.equal(calls.some(p=>p==='403 /content/cpc/cpc-fixation-questions-v1.js'),false,'Free não deve requisitar o banco Premium no carregamento');
    const status=await page.evaluate(()=>fetch('/content/cpc/cpc-fixation-questions-v1.js',{cache:'no-store'}).then(r=>r.status));
    assert.equal(status,403,'O arquivo premium precisa retornar HTTP 403 para Free');
   }
   const stats=await page.evaluate(()=>({
     target:!!document.querySelector('.subject[data-id="cpc"]'),
     itemCount:document.querySelectorAll('.subject[data-id="cpc"] .cpc-module,.subject[data-id="cpc"] button').length,
     module05:!!window.CpcM05NativeReader||!!window.CpcStudyM05,
     readerM05:typeof window.CpcM05NativeReader?.open,
   }));
   cpcItems=stats.itemCount;
   if(variant==='premium'){
    assert.equal(stats.target,true,'disciplina CPC não apareceu');
    assert.equal(stats.module05,true,'módulo CPC M05 ausente');
    assert.equal(stats.readerM05,'function','leitor M05 não disponível');
   }
   // Reproduz o print do cliente: ao abrir Civil, o leitor não pode
   // transformar um 403 Premium de arquivo legado em erro da disciplina.
   await page.evaluate(()=>window.CentralDisciplineLoader.load('civil'));
   await page.waitForFunction(()=>window.CentralDisciplineLoader?.isReady('civil')===true,{timeout:50000});
   const civil=await page.evaluate(()=>({
    loaded:window.CentralDisciplineLoader?.isReady('civil')===true,
    error:window.CentralDisciplineLoader?.hasError('civil')===true,
    modules:document.querySelectorAll('.subject[data-id="civil"] .cv-module').length,
    deniedMessage:document.querySelector('.subject[data-id="civil"] .central-discipline-loading')?.textContent?.includes('Não foi possível carregar')||false,
   }));
   assert.equal(civil.loaded,true,variant+': Civil não carregou');
   assert.equal(civil.error,false,variant+': falha ao carregar Civil');
   assert.ok(civil.modules>=15,variant+': módulos Civil não renderizados ('+civil.modules+')');
   assert.equal(civil.deniedMessage,false,variant+': placeholder de erro no Civil');
   if(variant==='free'){
    assert.equal(calls.includes('403 /content/civil/civil-sharing-links.js'),false,'Gratuito requisitou os links Civil Premium durante o carregamento');
    const denied=await page.evaluate(()=>fetch('/content/civil/civil-sharing-links.js',{cache:'no-store'}).then(r=>r.status));
    assert.equal(denied,403,'servidor deve negar os links Civil Premium ao Gratuito');
   }
   mode='ok';
  } catch(error){mode=String(error).slice(0,550)}
  const state=await page.evaluate(()=>({
   currentUrl:location.pathname,
   boot:document.documentElement.dataset.centralReady||null,
   title:document.title,
   bootText:document.getElementById('central-boot-screen')?.textContent.trim().slice(0,150)||null,
   cpcLoaded:window.CentralDisciplineLoader?.isReady('cpc')===true,
   cpcError:window.CentralDisciplineLoader?.hasError('cpc')===true,
   nav:!!document.querySelector('[data-central-native="disciplines"]'),
   rootClasses:document.documentElement.className,
   navDisplay:(()=>{const n=document.querySelector('[data-central-native="disciplines"]');return n?getComputedStyle(n).display:null})(),
   objectiveOpen:document.documentElement.classList.contains('study-objective-open'),
   viewClasses:document.getElementById('disciplinesView')?.className||null,
   main:!!document.getElementById('homeView'),
  }));
  await page.screenshot({path:path.join(dir,variant+'-home.png'),fullPage:false}).catch(()=>{});
  results.push({variant,ready,navVisible,cpcReady,cpcItems,mode,state,question403Handled:variant==='free'&&calls.includes('403 /content/cpc/cpc-fixation-questions-v1.js'),errors:errors.slice(0,18),badAssets:badAssets.slice(0,26),consoleErrors:rejections.slice(0,15)});
  await context.close();
 }
} finally {await browser?.close();await new Promise(resolve=>server.close(resolve));}
await writeFile(path.join(dir,'results.json'),JSON.stringify(results,null,2));
console.log('ETAPA104_CPC_HOME_FLOW='+JSON.stringify(results));
assert.equal(results[0].ready,true,'Premium: boot inicial falhou');
assert.equal(results[0].navVisible,true,'Premium: navegação para Disciplinas falhou');
assert.equal(results[0].cpcReady,true,'Premium: carregamento dos módulos CPC falhou');
assert.equal(results[0].mode,'ok','Premium: navegação e abertura do CPC falhou');
assert.equal(results[1].ready,true,'Gratuito: boot inicial falhou');
assert.equal(results[1].navVisible,true,'Gratuito: navegação para Disciplinas falhou');

assert.equal(results[1].cpcReady,true,'Gratuito: carregamento CPC resumido falhou após 403 da bateria Premium');
assert.equal(results[1].mode,'ok','Gratuito: fluxo de Disciplinas não concluiu');
assert.equal(results[1].question403Handled,true,'Gratuito: o cenário 403 esperado não foi exercitado');
