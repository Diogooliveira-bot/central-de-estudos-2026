// Repeatable local validation only: fictional Premium account; no production APIs.
import {createServer} from 'node:http';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {gzipSync} from 'node:zlib';
import {chromium} from 'playwright';
const root=resolve(process.env.BC_TEST_ROOT||'.'),out=resolve(process.env.BC_TEST_OUT||'audits/responsividade-20261115/after');
await mkdir(out,{recursive:true});
const mime={'.html':'text/html','.js':'application/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp'};
const server=createServer(async(req,res)=>{
 const u=new URL(req.url,'http://localhost'),p=u.pathname;
 const json=body=>{res.writeHead(200,{'content-type':'application/json','cache-control':'no-store'});res.end(JSON.stringify(body));};
 if(p==='/api/auth')return json({authenticated:true,user:{id:'responsive-fixture',name:'Aluno de demonstração',role:'aluno',plan:'premium'}});
 if(p==='/api/plans')return json({role:'aluno',plan:'premium',status:'active',entitlements:{'theory.summary':{enabled:true},'theory.complete':{enabled:true},'questions.external':{enabled:true}}});
 if(p==='/api/sync')return json({exists:false});
 if(p==='/api/objective')return json({objectiveId:'career-tribunais-analista'});
 if(p.startsWith('/api/'))return json({});
 const f=resolve(root,'.'+(p==='/'?'/central-v119.html':decodeURIComponent(p)));
 if(!f.startsWith(root+'/')){res.writeHead(403);res.end();return;}
 try{let body=await readFile(f);const headers={'content-type':mime[extname(f)]||'application/octet-stream','cache-control':'no-cache, must-revalidate'};
 // Match explicitly configured public versioned headers, never infer from extension.
 const config=JSON.parse(await readFile(resolve(root,'vercel.json'),'utf8'));
 for(const rule of config.headers||[])if(rule.source===p&&rule.has?.some(h=>h.type==='query'&&h.key==='v')&&u.searchParams.has('v'))for(const h of rule.headers)headers[h.key.toLowerCase()]=h.value;
 if(/\.(js|html|css|json|svg)$/.test(f)){body=gzipSync(body);headers['content-encoding']='gzip';}res.writeHead(200,headers);res.end(body);
 }catch{res.writeHead(404);res.end('NOT_FOUND');}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const base='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{}),headless:true,args:['--no-sandbox']});
const results={environment:{root,network:'local gzip; Chromium CDP throttling; mocked account/API; SW blocked'},runs:[],catalog:{},visual:[]};
const subjects=['cf','adm','civil','penal','cpc','cpp','pt','rlm','informatica'];
const ready=p=>p.waitForFunction(()=>document.documentElement.dataset.centralReady==='true',null,{timeout:120000});
const settle=p=>p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
const measure=p=>p.evaluate(()=>{const selectors=['.subject-name','.bc-focus-module-copy strong','#centralSidebar .nav-text','.bc-ui-scale-options button'];return {width:innerWidth,scrollWidth:document.documentElement.scrollWidth,rootFont:getComputedStyle(document.documentElement).fontSize,viewport:document.querySelector('meta[name="viewport"]')?.content,elements:selectors.map(selector=>{const e=[...document.querySelectorAll(selector)].find(e=>e.getBoundingClientRect().width);if(!e)return {selector};const r=e.getBoundingClientRect();return {selector,font:getComputedStyle(e).fontSize,width:r.width,height:r.height};})};});
try{
 for(const slow of (process.env.BC_VISUAL_ONLY?[]:[false,true])){
  const context=await browser.newContext({viewport:{width:1366,height:768},serviceWorkers:'block'}),page=await context.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));const cdp=await context.newCDPSession(page);
  if(slow){await cdp.send('Network.enable');await cdp.send('Network.emulateNetworkConditions',{offline:false,downloadThroughput:1600000/8,uploadThroughput:750000/8,latency:150});await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});}
  for(const access of ['cold','warm']){
   let start=performance.now();await page.goto(base,{waitUntil:'domcontentloaded',timeout:120000});await ready(page);await settle(page);
   const run={slow,access,bootMs:performance.now()-start,subjects:[],errors};results.runs.push(run);
   for(const id of subjects){
    try{
     await page.evaluate(()=>window.openHome());start=performance.now();await page.evaluate(id=>window.BaseCompletaFocusNavigation.chooseSubject(id),id);
     await page.locator('#bcFocusModules .bc-focus-module-card').first().waitFor({state:'visible',timeout:120000});await settle(page);
     const modulesMs=performance.now()-start;
     results.catalog[id]=await page.locator('#bcFocusModules .bc-focus-module-card').evaluateAll(nodes=>nodes.map(n=>({title:n.querySelector('strong')?.textContent,number:n.querySelector('.bc-focus-module-number')?.textContent})));
     start=performance.now();await page.locator('#bcFocusModules .bc-focus-module-card').first().click();
     await page.waitForFunction(()=>window.BaseCompletaFocusNavigation.state.stage==='reading',null,{timeout:120000});
     const section=page.locator('#subjects > .subject[data-id="'+id+'"]');
     const button=section.locator('button:visible').filter({hasText:/Revisar conteúdo/}).first();
     await button.waitFor({timeout:15000});await button.click();
     await page.waitForFunction(()=>document.documentElement.classList.contains('student-reader-active') && !/Carregando (?:a )?leitura|Preparando (?:a )?leitura/.test(document.body.innerText),null,{timeout:60000});await settle(page);
     const readingMs=performance.now()-start;
     await page.keyboard.press('Escape');await page.evaluate(()=>{window.openHome();window.BaseCompletaFocusNavigation.backToSubjects();});
     start=performance.now();await page.evaluate(id=>window.BaseCompletaFocusNavigation.chooseSubject(id),id);await page.locator('#bcFocusModules .bc-focus-module-card').first().waitFor({state:'visible',timeout:30000});await settle(page);
     const reopenMs=performance.now()-start;
     run.subjects.push({id,modulesMs,readingMs,reopenMs,count:results.catalog[id].length});
    }catch(e){run.subjects.push({id,error:e.message.slice(0,280)});await page.goto(base,{waitUntil:'domcontentloaded',timeout:120000});await ready(page);}
    await writeFile(out+'/results.json',JSON.stringify(results,null,2));
   }
  }
  await context.close();
 }
 if(!process.env.BC_PERF_ONLY){
  const sizes=process.env.BC_BASELINE?[[390,844],[820,1180],[1920,1080]]:[[360,800],[390,844],[430,932],[768,1024],[1024,768],[820,1180],[1180,820],[1024,1366],[1366,1024],[1366,768],[1920,1080],[2560,1440]];
  for(const [width,height] of sizes){
   const c=await browser.newContext({viewport:{width,height},isMobile:width<1100,hasTouch:width<1100,serviceWorkers:'block'}),p=await c.newPage();await p.goto(base,{waitUntil:'domcontentloaded'});await ready(p);
   await p.screenshot({path:out+`/${width}x${height}-home.png`});
   await p.evaluate(()=>{openHome();BaseCompletaFocusNavigation.chooseSubject('adm');});await p.locator('#bcFocusModules .bc-focus-module-card').first().waitFor({timeout:60000});await settle(p);
   for(const scale of [0,1,1.15,1.3]){await p.evaluate(s=>BCUiScale.set(s),scale);await settle(p);results.visual.push({width,height,scale,...await measure(p)});}
   await p.evaluate(()=>BCUiScale.set(0));await settle(p);await p.screenshot({path:out+`/${width}x${height}-modules.png`});
   await c.close();await writeFile(out+'/results.json',JSON.stringify(results,null,2));
  }
 }
}finally{await writeFile(out+'/results.json',JSON.stringify(results,null,2));await browser.close();server.close();}
console.log(JSON.stringify({runs:results.runs.map(r=>({slow:r.slow,access:r.access,bootMs:r.bootMs,subjects:r.subjects})),visualCases:results.visual.length}));
