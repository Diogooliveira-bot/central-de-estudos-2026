/**
 * Etapa 10.4 — ensaio integrado de navegação CPC no app real, rodando em localhost.
 * Não usa Neon, Vercel, credenciais, aluno real nem captura dados pessoais.
 * NÃO substitui a homologação autenticada do deployment externo.
 */
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { chromium } from 'playwright';

const root=resolve('.');
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css','.png':'image/png','.svg':'image/svg+xml','.json':'application/json','.webp':'image/webp','.ico':'image/x-icon','.webmanifest':'application/manifest+json'};
const server=createServer(async(req,res)=>{
  const u=new URL(req.url,'http://127.0.0.1');
  if(u.pathname==='/api/auth'){
    res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'});
    res.end(JSON.stringify({authenticated:true,user:{id:'cpc-integrated-fixture',name:'Aluno Sintético',role:'aluno',active:true}}));return;
  }
  if(u.pathname==='/api/plans'){
    const features={'theory.summary':{enabled:true},'theory.complete':{enabled:true},'qc.links':{enabled:true},'tec.links':{enabled:true}};
    res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'});
    res.end(JSON.stringify({role:'aluno',plan:'premium',status:'active',isStaff:false,entitlements:features}));return;
  }
  if(u.pathname.startsWith('/api/')){
    res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'});
    res.end(u.pathname==='/api/sync'?JSON.stringify({exists:false}):'{}');return;
  }
  let requestPath=u.pathname==='/'?'/central-v119.html':u.pathname;
  try{requestPath=decodeURIComponent(requestPath)}catch{res.writeHead(400);res.end();return}
  const file=resolve(root,'.'+requestPath);
  if(!file.startsWith(root+'/')){res.writeHead(403);res.end();return}
  try{
    const body=await readFile(file);
    res.writeHead(200,{'Content-Type':mime[extname(file)]||'application/octet-stream','Cache-Control':'no-store'});
    res.end(body);
  }catch{res.writeHead(404);res.end('not found')}
});
await new Promise(resolveListen=>server.listen(0,'127.0.0.1',resolveListen));
const base='http://127.0.0.1:'+server.address().port;
let browser;
const results=[];
try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  await mkdir('artifacts/etapa10-4-cpc-integrated',{recursive:true});
  for(const width of [390,1366]){
    const context=await browser.newContext({viewport:{width,height:width===390?844:768},serviceWorkers:'block'});
    const page=await context.newPage(),failures=[];
    page.on('pageerror',err=>failures.push('JS: '+err.message.slice(0,230)));
    page.on('response',r=>{if(r.status()>=400&&/content\/cpc\/m05-native-data\.js/.test(r.url()))failures.push('M05 HTTP '+r.status())});
    try{
      const response=await page.goto(base+'/central-v119.html',{waitUntil:'domcontentloaded',timeout:40000});
      assert.equal(response.status(),200,'bootstrap HTML');
      await page.waitForFunction(()=>!!document.getElementById('centralSidebar')&&typeof window.centralHardOpen==='function',{timeout:25000});
      // O app altera a URL para / pelo histórico; isso não é um redirect externo.
      assert.equal(new URL(page.url()).pathname,'/','o app usa / no histórico do painel');
      await page.evaluate(()=>window.centralHardOpen('disciplines',document.querySelector('[data-central-native="disciplines"]')));
      await page.waitForSelector('#disciplineGrid .disc-card[data-id="cpc"]',{timeout:16000});
      await page.locator('#disciplineGrid .disc-card[data-id="cpc"]').click({timeout:12000});
      await page.waitForFunction(()=>window.CentralDisciplineLoader?.isReady('cpc')===true,null,{timeout:100000});
      await page.waitForFunction(()=>!!window.CpcM05NativeReader?.open,null,{timeout:10000});
      await page.evaluate(()=>window.CpcM05NativeReader.open('complete'));
      await page.waitForSelector('#cpcM05NativeReaderOverlay.bc-apostila-v1 .bc-native-article',{timeout:15000});
      const result=await page.evaluate(()=>{
        const overlay=document.querySelector('#cpcM05NativeReaderOverlay');
        const article=overlay?.querySelector('.bc-native-article');
        const dividers=[...article?.querySelectorAll('.bc-cpc-m05-part-divider')||[]];
        return {
          view:!document.getElementById('disciplinesView')?.classList.contains('hidden'),
          cpcInstalled:window.CentralDisciplineLoader?.isReady('cpc')===true,
          title:article?.querySelector('h1')?.textContent.trim(),
          headings:article?.querySelectorAll('h2').length,
          partIV:dividers.some(x=>x.textContent.includes('PARTE IV')),
          partVIII:dividers.some(x=>x.textContent.includes('PARTE VIII')),
          quiz15:!![...article?.querySelectorAll('h2')||[]].find(x=>x.textContent.trim().startsWith('15. Na denunciação')),
          quiz2:!!article?.querySelector('p.bc-cpc-m05-quiz-prompt'),
          overflow:document.documentElement.scrollWidth>innerWidth+2,
          path:location.pathname
        };
      });
      assert.equal(result.cpcInstalled,true,'CPC carregado pela navegação da Central');
      assert.ok(result.title,'leitor M05 abriu');
      assert.equal(result.partIV,true,'parte IV visível');
      assert.equal(result.partVIII,true,'parte VIII visível');
      assert.equal(result.quiz15,true,'questão 15 visível');
      assert.equal(result.quiz2,true,'questão 2 visível');
      assert.equal(result.overflow,false,'sem overflow da página');
      assert.equal(failures.filter(x=>x.startsWith('M05 HTTP')).length,0,'script M05 entregue');
      if(width===390)await page.locator('#cpcM05NativeReaderOverlay .bc-native-article').first().screenshot({path:'artifacts/etapa10-4-cpc-integrated/cpc-m05-mobile.png',timeout:25000});
      results.push({width,pass:true,...result,jsErrors:failures.slice(0,5)});
    }catch(e){
      const debug=await page.evaluate(()=>({path:location.pathname,title:document.title,boot:document.querySelector('#status')?.textContent,centralReady:document.documentElement.dataset.centralReady,hasCpc:!!window.CpcM05NativeReader,loader:!!window.CentralDisciplineLoader,cpcReady:window.CentralDisciplineLoader?.isReady('cpc'),hasError:window.CentralDisciplineLoader?.hasError('cpc')})).catch(()=>({}));
      results.push({width,pass:false,error:e.message.slice(0,480),debug,jsErrors:failures.slice(0,12)});
    }finally{await context.close()}
  }
}finally{if(browser)await browser.close();await new Promise(r=>server.close(r))}
console.log('ETAPA10_4_CPC_INTEGRATED='+JSON.stringify(results));
assert.ok(results.length===2&&results.every(x=>x.pass),'CPC integrado com navegação + leitor M05 precisa funcionar nos dois viewports');
