import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { chromium } from 'playwright';
import { freePlanAsset } from './helpers/free-plan-content.mjs';

const root=resolve('.');
const mime={'.html':'text/html','.js':'application/javascript','.css':'text/css','.json':'application/json','.webmanifest':'application/manifest+json','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.ico':'image/x-icon'};
const counts={protected:0,styles:0,files:0};
const server=createServer(async(req,res)=>{
 const url=new URL(req.url,'http://localhost'),path=url.pathname;
 const json=(body,status=200)=>{res.writeHead(status,{'content-type':'application/json','cache-control':'no-store'});res.end(JSON.stringify(body))};
 if(path==='/api/auth'){return json({authenticated:true,user:{id:'fictional-free-student',name:'Aluno Fictício',role:'aluno',plan:'free'}})}
 if(path==='/api/sync'){return json(req.method==='POST'?{revision:1}:{exists:false})}
 if(path==='/api/objective')return json({objectiveId:'career-tribunais-analista'});
 if(path==='/api/plans')return json({role:'aluno',plan:'free',status:'active',isStaff:false,entitlements:{'theory.summary':{enabled:true},'progress.advanced_sync':{enabled:false}}});
 if(path==='/api/lei-em-dia-questions'){
  if(req.method==='GET'){res.writeHead(200,{'content-type':'application/javascript'});res.end('const DATA_LED_APPROVED=[{id:"LED-FREE-1",discipline:"cf",topicId:"led-cf",number:"Art. 5º",title:"Constituição Federal"}];');return}
  return json({question:{id:'LED-FREE-1',title:'Constituição Federal',discipline:'cf',question:{statement:'A lei protege os direitos fundamentais.',answer:true,explanation:'Revisão de questão de teste.'}},plan:'free'});
 }

 if(path.startsWith('/api/')){return json({},200)}
 const projected=await freePlanAsset(root,path);
 if(projected){counts.protected++;res.writeHead(projected.status,{'content-type':projected.type,'cache-control':'no-store'});res.end(projected.body);return}
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
 if(info.ready!=='true'){process.exitCode=1;console.error('ALUNO_FREE_BOOT_FAILED')} else console.log('ALUNO_FREE_BOOT_READY');

 await page.evaluate(()=>window.openDisciplines());
 await page.waitForTimeout(700);
 console.log('FREE_DISC_VIEW='+JSON.stringify(await page.evaluate(()=>({
  active:window.CentralStudyObjectives?.getActive?.(),
  url:location.href,disciplineView:document.getElementById('disciplinesView')?.className,
  grid:document.getElementById('disciplineGrid')?.outerHTML.slice(0,1400),
  cards:[...document.querySelectorAll('[data-id="cf"]')].map(x=>({tag:x.tagName,class:x.className,outer:x.outerHTML.slice(0,250)})),
  nav:document.querySelector('#centralSidebar .nav')?.textContent?.slice(0,500)
 }))));
 await page.waitForFunction(()=>window.CentralPlanAccess?.isKnown?.()&&window.CentralPlanAccess.isFree(),{timeout:10000});
 // Mesma interface do Premium nas seis disciplinas, com resumo liberado e Premium bloqueado.
 const subjects=[
  ['cf','.cf-module-head >> nth=0','Abrir teoria guiada'],
  ['penal','.cf-module-head >> nth=0','Revisar conteúdo'],
  ['cpc','.cf-module-head >> nth=1','Revisar conteúdo'],
  ['adm','.open-topic >> nth=0','Revisar conteúdo'],
  ['civil','.cv-module-head >> nth=0','Abrir teoria guiada'],
  ['cpp','.open-topic >> nth=0','Revisar conteúdo'],
 ];
 for(const [id,head,summary] of subjects){
  await page.evaluate(()=>window.openDisciplines());
  await page.locator('#disciplineGrid [data-study-open-subject="'+id+'"]').first().click({timeout:8000});
  await page.waitForFunction(id=>window.CentralDisciplineLoader.isReady(id)||window.CentralDisciplineLoader.hasError(id),id,{timeout:30000});
  if(await page.evaluate(id=>window.CentralDisciplineLoader.hasError(id),id))throw Error(id+': disciplina não carregou para o Gratuito');
  if(await page.locator('.central-free-study').count())throw Error(id+': ainda usa a tela gratuita separada');
  const section=page.locator('.subject[data-id="'+id+'"]');
  await section.locator(head).click({timeout:8000});
  const locked=section.locator('button.bc-plan-locked:visible').filter({hasText:'Estudar conteúdo'}).first();
  await locked.waitFor({state:'visible',timeout:10000});
  await locked.click();
  await page.locator('.bc-plan-lock-box').getByText('exclusivo do Base Completa Premium',{exact:false}).waitFor({timeout:5000});
  await page.locator('.bc-plan-lock-box button').click();
  if(await page.locator('.bc-plan-lock-dialog').count())throw Error(id+': aviso Premium não fechou');
  const visuals=section.locator('button:visible').filter({hasText:/Visualizar (?:infográfico|mapa mental)/});
  for(let i=0;i<await visuals.count();i++){
   if(!await visuals.nth(i).evaluate(el=>el.classList.contains('bc-plan-locked')))throw Error(id+': infográfico liberado no Gratuito');
  }
  const open=section.locator('button:visible').filter({hasText:summary}).first();
  if(await open.evaluate(el=>el.classList.contains('bc-plan-locked')))throw Error(id+': resumo marcado como Premium');
  await open.click();
  await page.waitForTimeout(2500);
  const reader=await page.evaluate(()=>{const t=document.body.innerText;return {failed:/Não foi possível carregar a leitura/.test(t),premiumOnly:/exclusivo do Base Completa Premium/.test(t)}});
  if(reader.failed)throw Error(id+': leitura do resumo falhou');
  console.log('FREE_SAME_UI_OK='+id);
  await page.keyboard.press('Escape');
  await page.goto(base+'/central-v119.html?view=home',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.documentElement.dataset.centralReady==='true',{timeout:30000});
 }
 await page.goto(base+'/tools/decorando.html',{waitUntil:'domcontentloaded'});
 await page.waitForURL('**/tools/lei-em-dia-gratis.html',{timeout:12000});
 await page.waitForSelector('#filters:not(.hidden)',{timeout:10000});
 await page.locator('#load').click();
 await page.waitForFunction(()=>document.querySelector('.statement')?.textContent?.includes('direitos fundamentais'),{timeout:10000});
 await page.locator('#exercise button').first().click();
 const result=await page.locator('#exercise').innerText();
 if(!result.includes('Resposta correta.'))throw Error('Questão gratuita não foi respondida');
 console.log('FREE_LEI_EM_DIA_OK='+result.slice(0,160));
 await context.close();
}finally{await browser.close();server.close()}
