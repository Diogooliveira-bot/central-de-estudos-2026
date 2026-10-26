import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { chromium } from 'playwright';
import { protectedAsset } from '../lib/protected-content.js';

const root=resolve('.');
const mime={'.html':'text/html','.js':'application/javascript','.css':'text/css','.json':'application/json','.webmanifest':'application/manifest+json','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.ico':'image/x-icon'};
const counts={protected:0,styles:0,files:0};
const server=createServer(async(req,res)=>{
 const url=new URL(req.url,'http://localhost'),path=url.pathname;
 const json=(body,status=200)=>{res.writeHead(status,{'content-type':'application/json','cache-control':'no-store'});res.end(JSON.stringify(body))};
 if(path==='/api/auth'){return json({authenticated:true,user:{id:'fictional-free-student',name:'Aluno Fictício',role:'aluno',plan:'free'}})}
 if(path==='/api/sync'){return json(req.method==='POST'?{revision:1}:{exists:false})}
 if(path.startsWith('/api/')){return json({},200)}
 const policy=protectedAsset(path);
 if(policy){
   counts.protected++;
   const body=policy.kind==='native'
     ? 'window.BASE_NATIVE_CONTENT=window.BASE_NATIVE_CONTENT||{};window.BASE_NATIVE_CONTENT['+JSON.stringify(policy.discipline)+']=window.BASE_NATIVE_CONTENT['+JSON.stringify(policy.discipline)+']||{};'
     : policy.kind==='admin-lite'?'window.ADM_NATIVE_CONTENT={};'
     : policy.kind==='cpp-course'?'window.CPP_COURSE_MODULES=[];'
     : policy.kind==='portuguese-native'?'window.PT_NATIVE_DATA=window.PT_NATIVE_DATA||{};'
     : policy.kind==='packed-native'?'window.CIVIL_NATIVE_PACKED_B64="";window.CPP_NATIVE_PACKED_B64="";'
     : path==='/content/tec-cadernos-data.js'?'window.TEC_CADERNOS_DATA={schemaVersion:1,locked:true,cadernos:[]};'
     : path==='/content/qc-sharing-links.js'?'window.QC_CENTRAL_SHARING_LINKS={schemaVersion:1,locked:true,items:[]};'
     : path==='/content/qc-notebook-catalog.js'?'window.QC_NOTEBOOK_CATALOG={schemaVersion:1,locked:true,notebooks:[]};'
     : path==='/content/cpc/cpc-sharing-links.js'?'window.CPC_SHARING_LINKS={schemaVersion:1,locked:true,modules:{}};'
     : null;
   if(body!==null){res.writeHead(200,{'content-type':'application/javascript','cache-control':'no-store'});res.end(body);return}
   res.writeHead(403,{'content-type':'application/json','cache-control':'no-store'});res.end('{"error":"Premium"}');return;
 }
 const file=resolve(root,'.'+(path==='/'?'/central-v119.html':decodeURIComponent(path)));
 if(!file.startsWith(root+'/')){res.writeHead(403);res.end();return}
 try{const data=await readFile(file);if(extname(file)==='.css')counts.styles++;counts.files++;res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream'});res.end(data)}
 catch(e){res.writeHead(404,{'content-type':'text/plain'});res.end('NOT_FOUND')}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
try{
 const context=await browser.newContext({viewport:{width:390,height:844},serviceWorkers:'block'});
 const page=await context.newPage(),errors=[],httpErrors=[],messages=[];
 page.on('pageerror',e=>errors.push(e.message.slice(0,500)));
 page.on('console',e=>{if(e.type()==='error'||e.type()==='warning')messages.push(e.text().slice(0,400))});
 page.on('response',r=>{if(r.status()>=400)httpErrors.push({status:r.status(),path:new URL(r.url()).pathname})});
 await page.goto(base+'/central-v119.html?view=home',{waitUntil:'domcontentloaded',timeout:30000});
 try {await page.waitForFunction(()=>document.documentElement.dataset.centralReady==='true'||document.getElementById('retry')?.hidden===false,{timeout:25000})}catch(_){}
 const info=await page.evaluate(()=>({
  location:location.pathname,ready:document.documentElement.dataset.centralReady,
  boot:!!document.getElementById('central-boot-screen'),status:document.getElementById('status')?.textContent,
  retry:document.getElementById('retry')?.hidden,
  rootClasses:document.documentElement.className,
  renderType:typeof window.renderAll,
  sheets:[...document.querySelectorAll('link[rel="stylesheet"]')].filter(l=>!l.sheet).map(l=>l.href),
  home:!!document.getElementById('homeView'),
  user:window.BASE_COMPLETA_USER?.role
 }));
 console.log('FREE_BROWSER_DIAGNOSTIC='+JSON.stringify({info,counts,errors:errors.slice(0,25),httpErrors:httpErrors.slice(0,60),messages:messages.slice(0,60)}));
 if(info.ready!=='true'){process.exitCode=1;console.error('ALUNO_FREE_BOOT_FAILED')}
 await context.close();
}finally{await browser.close();server.close()}
