import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const root=resolve('.');
const mime={'.js':'application/javascript','.css':'text/css','.html':'text/html','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.json':'application/json','.txt':'text/plain'};
const server=createServer(async(req,res)=>{
 const u=new URL(req.url,'http://127.0.0.1');
 if(u.pathname.startsWith('/api/')){
   const body=u.pathname==='/api/auth'?{authenticated:true,user:{id:'universal-reader-audit',name:'Aluno de teste',role:'aluno'}}:{ok:true};
   res.writeHead(200,{'Content-Type':'application/json'});res.end(JSON.stringify(body));return;
 }
 const p=resolve(root,'.'+decodeURIComponent(u.pathname==='/'?'/central-v119.html':u.pathname));
 if(!p.startsWith(root+'/')){res.writeHead(403);res.end();return}
 try{res.writeHead(200,{'Content-Type':mime[extname(p)]||'application/octet-stream'});res.end(await readFile(p))}
 catch(e){res.writeHead(404);res.end('not found')}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const base='http://127.0.0.1:'+server.address().port,rows=[];
let browser;
try{
 browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 for(const vp of [{name:'celular',width:390,height:844},{name:'tablet',width:768,height:1024},{name:'computador',width:1366,height:768}]){
  const context=await browser.newContext({viewport:{width:vp.width,height:vp.height},serviceWorkers:'block'});
  const page=await context.newPage();const assetErrors=[],events=[];page.on('pageerror',e=>events.push('pageerror:'+e.message.slice(0,130)));page.on('console',e=>{if(e.type()==='error')events.push('console:'+e.text().slice(0,120))});
  page.on('response',r=>{if(r.status()===404&&/universal-reader-v1/.test(r.url()))assetErrors.push(r.url())});
  try {
   const response=await page.goto(base+'/central-v119.html',{waitUntil:'domcontentloaded',timeout:35000});
   await page.waitForFunction(()=>!!window.CentralUniversalReader,null,{timeout:12500});
   const result=await page.evaluate(()=>({
     reader:typeof window.CentralUniversalReader?.scan==='function',
     css:[...document.styleSheets].some(s=>s.href?.includes('universal-reader-v1.css')),
     app:!!document.querySelector('#subjects'),
     bootPending:document.documentElement.classList.contains('central-boot-pending'),
     hasAdmIndex:!!window.ADM_NATIVE_INDEX,
     overflow:document.documentElement.scrollWidth>innerWidth+2
   }));
   rows.push({viewport:vp.name,http:response?.status(),...result,missingAssets:assetErrors,
     pass:response?.status()===200&&result.reader&&result.css&&result.app&&assetErrors.length===0});
   if(vp.name==='computador'){
    try{
      await page.evaluate(async()=>{
        if(window.CentralDisciplineLoader?.load) await window.CentralDisciplineLoader.load('adm');
        else if(window.loadCentralTheoryGroup) await window.loadCentralTheoryGroup('adm');
      });
      await page.waitForTimeout(350);
      const adm=await page.evaluate(()=>{
        const uids=Object.keys(window.ADM_NATIVE_INDEX?.modules||{});
        const problems=[];
        const stages=[];
        for(const uid of uids) {
          try{
            const entry=typeof window.topicByUid==='function'?window.topicByUid(uid):null;
            const html=entry && typeof window.renderDetail==='function'?window.renderDetail(entry.s,entry.t,entry.r||{}):'';
            stages.push({uid,htmlLength:String(html||'').length,legacyLength:String(window.ADM_NATIVE_LEGACY?.[uid]||'').length});
          }catch(e){problems.push({uid,error:e.message})}
        }
        return {indexCount:uids.length,legacyAvailable:stages.filter(x=>x.legacyLength>0).length,
          stageCount:stages.filter(x=>x.htmlLength>0).length,problems:problems.slice(0,6),samples:stages.slice(0,2)};
      });
      console.log('ADM_RUNTIME',JSON.stringify(adm));
    }catch(e){console.log('ADM_RUNTIME_BLOCKER',e.message.slice(0,300))}
   }
  }catch(e){const debug=await page.evaluate(()=>({url:location.href,ready:document.readyState,title:document.title,status:document.querySelector('#status')?.textContent,body:document.body?.textContent?.slice(0,280),hasIndex:!!document.querySelector('#subjects'),hasAsset:!!document.querySelector('script[src*=universal-reader]')})).catch(x=>({evalError:x.message}));rows.push({viewport:vp.name,pass:false,error:e.message.slice(0,300),debug,events:events.slice(-8),missingAssets:assetErrors})}
  await context.close();
 }
}finally{await browser?.close();await new Promise(r=>server.close(r))}
console.log('CENTRAL_BROWSER',JSON.stringify(rows));
assert.ok(rows.every(x=>x.pass),'Universal assets must be active in real Central bootstrap');
