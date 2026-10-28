/* Etapa 10.4 — testar a navegação real da interface até o CPC.
 * Navegador Chromium em servidor localhost e usuário fictício via API mock.
 * NÃO comprova autorização HTTP da Vercel ou persistência no Neon.
 */
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {extname,resolve,sep} from 'node:path';
import {chromium} from 'playwright';

const root=resolve('.');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.ico':'image/x-icon','.webmanifest':'application/manifest+json'};
const audit={checks:[],warnings:[]};
const dir='artifacts/etapa10-4-cpc-navegacao';
await mkdir(dir,{recursive:true});
const server=createServer(async(req,res)=>{
 const url=new URL(req.url,'http://localhost');
 if(url.pathname==='/api/auth'){
  res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'});
  res.end(JSON.stringify({authenticated:true,user:{id:'cpc-editorial-fixture',name:'Aluno Premium (fixture)',role:'aluno',active:true}}));return;
 }
 if(url.pathname==='/api/plans'){
  res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'});
  res.end(JSON.stringify({plan:'premium',status:'active',role:'aluno',entitlements:{'theory.complete':{enabled:true},'theory.summary':{enabled:true}}}));return;
 }
 if(url.pathname==='/api/sync'){
  res.writeHead(200,{'Content-Type':'application/json'});
  res.end(JSON.stringify(req.method==='POST'?{ok:true,revision:1}:{exists:false}));return;
 }
 if(url.pathname.startsWith('/api/')){
  res.writeHead(200,{'Content-Type':'application/json'});res.end('{}');return;
 }
 const requested=url.pathname==='/'?'/central-v119.html':url.pathname;
 const file=resolve(root,'.'+decodeURIComponent(requested));
 if(!file.startsWith(root+sep)){res.writeHead(403);res.end('Forbidden');return;}
 try{const data=await readFile(file);res.writeHead(200,{'Content-Type':mime[extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(data)}
 catch{res.writeHead(404);res.end('Not found');}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const base='http://127.0.0.1:'+server.address().port;
let browser;
try{
 browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 for(const width of [390,1366]){
  const label='CPC interface '+width+'px';
  const ctx=await browser.newContext({viewport:{width,height:width===390?844:768},serviceWorkers:'block'});
  const page=await ctx.newPage();
  const errors=[],assetFailures=[];
  page.on('pageerror',e=>errors.push(e.message.slice(0,220)));
  page.on('response',r=>{if(r.status()>=400)assetFailures.push({status:r.status(),path:new URL(r.url()).pathname});});
  try{
   const resp=await page.goto(base+'/central-v119.html',{waitUntil:'domcontentloaded',timeout:35000});
   assert.equal(resp?.status(),200,label+': HTML não disponível');
   await page.waitForFunction(()=>document.documentElement.dataset.centralReady==='true'&&!!window.CentralDisciplineLoader&&!!document.querySelector('#centralSidebar'),null,{timeout:40000});
   const boot=await page.evaluate(()=>({path:location.pathname,disciplineCards:document.querySelectorAll('#disciplineGrid .disc-card').length,disciplineLink:!!document.querySelector('#disciplineGrid .disc-card[data-id="cpc"]')}));
   assert.equal(boot.path,'/',label+': o aplicativo deve normalizar a rota para /');
   assert.equal(boot.disciplineLink,true,label+': card Direito Processual Civil ausente');
   const nav=page.locator('#centralSidebar button').filter({hasText:'Disciplinas'}).first();
   await nav.click({timeout:10000});
   await page.waitForSelector('#disciplinesView:not(.hidden)',{timeout:10000});
   const card=page.locator('#disciplineGrid .disc-card[data-id="cpc"]');
   await card.click({timeout:10000});
   // Este clique inicia o carregamento da disciplina e não deve tentar abrir /central.
   await page.waitForFunction(()=>window.CentralDisciplineLoader?.isReady?.('cpc')===true,null,{timeout:45000});
   const loaded=await page.evaluate(()=>({
    path:location.pathname,
    ready:window.CentralDisciplineLoader.isReady('cpc'),
    cpcM05:typeof window.CpcM05NativeReader?.open==='function',
    cpcM20:typeof window.CpcM20NativeReader?.open==='function',
    cpcError:window.CentralDisciplineLoader.hasError('cpc'),
    cpcModule:!!document.querySelector('.subject[data-id="cpc"]'),
   }));
   assert.equal(loaded.ready,true,label+': loader CPC não concluiu');
   assert.equal(loaded.cpcError,false,label+': loader CPC apresentou erro');
   assert.equal(loaded.cpcM05,true,label+': leitor CPC M05 ausente');
   assert.equal(loaded.cpcM20,true,label+': leitor CPC M20 ausente');
   await page.evaluate(()=>window.CpcM05NativeReader.open('complete'));
   await page.waitForSelector('#cpcM05NativeReaderOverlay.bc-apostila-v1 .bc-native-article',{timeout:10000});
   const reader=await page.evaluate(()=>{
    const ov=document.getElementById('cpcM05NativeReaderOverlay');
    const text=ov?.querySelector('.bc-native-article')?.textContent||'';
    return {
     show:!!ov?.classList.contains('bc-apostila-v1'),
     part4:text.includes('PARTE IV - PEGADINHAS FCC'),
     part8:text.includes('PARTE VIII - ROTEIRO DE REVISÃO'),
     question2:!!ov?.querySelector('.bc-cpc-m05-quiz-prompt'),
     tables:ov?.querySelectorAll('.bc-native-article table').length||0,
     viewportOverflow:document.documentElement.scrollWidth>window.innerWidth+3,
    };
   });
   assert.equal(reader.show,true,label+': modal de leitura não abriu');
   assert.equal(reader.part4,true,label+': Parte IV ausente');
   assert.equal(reader.part8,true,label+': Parte VIII ausente');
   assert.equal(reader.question2,true,label+': questão 2 não foi separada');
   assert.ok(reader.tables>0,label+': tabelas ausentes');
   assert.equal(reader.viewportOverflow,false,label+': overflow da página');
   await page.locator('#cpcM05NativeReaderOverlay .bc-native-reader').screenshot({path:dir+'/cpc-m05-'+width+'px.png'});
   audit.checks.push({width,boot,loaded,reader,assetErrors:assetFailures.length,jsErrors:errors.length,pass:true});
  }catch(e){
   const debug=await page.evaluate(()=>({
     path:location.pathname,title:document.title,
     centralReady:document.documentElement.dataset.centralReady,
     status:document.querySelector('#status')?.textContent?.slice(0,220),
     loader:typeof window.CentralDisciplineLoader!=='undefined'?{ready:window.CentralDisciplineLoader.isReady('cpc'),error:window.CentralDisciplineLoader.hasError('cpc')}:null,
     cpcVisible:!!document.querySelector('.subject[data-id="cpc"]'),
     previewGuest:!!window.__BASE_COMPLETA_PREVIEW_GUEST__,
   })).catch(err=>({evalError:err.message.slice(0,160)}));
   audit.checks.push({width,pass:false,error:e.message.slice(0,320),debug,errors:errors.slice(0,8),assetFailures:assetFailures.slice(0,15)});
  }finally{await ctx.close();}
 }
}finally{
 if(browser)await browser.close();
 await new Promise(r=>server.close(r));
 await writeFile(dir+'/metricas.json',JSON.stringify(audit,null,2)+'\n');
}
console.log('ETAPA10_4_CPC_NAV='+JSON.stringify(audit));
assert.equal(audit.checks.length,2,'dois viewports esperados');
assert.ok(audit.checks.every(c=>c.pass),'A navegação via Disciplinas → CPC → M05 deve funcionar em localhost');
