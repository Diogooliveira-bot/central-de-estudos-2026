import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { chromium } from 'playwright';
const root=process.cwd();
const mime={'.html':'text/html','.js':'application/javascript','.css':'text/css','.json':'application/json'};
const server=createServer(async(req,res)=>{
 const url=new URL(req.url,'http://localhost'),path=url.pathname;
 const json=(b,s=200)=>{res.writeHead(s,{'content-type':'application/json'});res.end(JSON.stringify(b))};
 if(path==='/api/auth')return json({authenticated:true,user:{id:'fictional-premium',name:'Aluno Fictício',role:'aluno',plan:'premium'}});
 if(path==='/api/sync')return json(req.method==='POST'?{revision:1}:{exists:false});
 if(path==='/api/plans')return json({role:'aluno',plan:'premium',status:'active',isStaff:false,entitlements:{}});
 if(path==='/api/objective')return json({objectiveId:'career-tribunais-analista'});
 if(path.startsWith('/api/'))return json({});
 const file=resolve(root,'.'+(path==='/'?'/central-v119.html':decodeURIComponent(path)));
 try{const d=await readFile(file);res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream'});res.end(d)}catch(e){res.writeHead(404);res.end()}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const base='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const page=await (await browser.newContext({viewport:{width:1200,height:900},serviceWorkers:'block'})).newPage();
page.on('pageerror',e=>console.log('ERR',e.message.slice(0,200)));
await page.goto(base+'/central-v119.html?view=home');
await page.waitForFunction(()=>document.documentElement.dataset.centralReady==='true',{timeout:30000});


// Premium (aluno fictício): todas as baterias internas de Penal e Processo Civil
// precisam estar disponíveis e abrir as questões (5 da revisão + 10 do completo).
const failures=[];
for(const id of ['cpc','penal']){
 await page.evaluate(()=>window.openDisciplines());
 await page.locator('#disciplineGrid [data-study-open-subject="'+id+'"]').first().click();
 await page.waitForFunction(id=>window.CentralDisciplineLoader.isReady(id),id,{timeout:30000});
 const heads=page.locator('.subject[data-id="'+id+'"] .cf-module-head');
 const n=await heads.count();
 if(n<(id==='cpc'?20:17))failures.push(id+': apenas '+n+' módulos');
 for(let i=0;i<n;i++){
  await heads.nth(i).click();await page.waitForTimeout(400);
  const labels=await page.evaluate(([id,i])=>{const m=document.querySelectorAll('.subject[data-id="'+id+'"] .cf-module')[i];return [...(m?.querySelectorAll('.cpc-approved-secondary,.penal-approved-secondary')||[])].map(b=>b.textContent.trim()+(b.disabled?' [desativado]':'')).filter(t=>/quest/i.test(t))},[id,i]);
  if(labels.sort().join('|')!=='Resolver 10 questões|Resolver 5 questões')failures.push(id+' M'+(i+1)+': '+labels.join(', '));
  await heads.nth(i).click();await page.waitForTimeout(120);
 }
 // Abre uma bateria e confere as questões.
 for(const [mi,label,expect] of id==='cpc'?[[0,'Resolver 10 questões',10],[17,'Resolver 5 questões',5]]:[[2,'Resolver 10 questões',10]]){
  await heads.nth(mi).click();await page.waitForTimeout(500);
  const module=page.locator('.subject[data-id="'+id+'"] .cf-module').nth(mi);
  await module.getByRole('button',{name:label,exact:true}).click();
  await page.waitForTimeout(2500);
  const seen=await page.evaluate(()=>{
   const native=document.querySelector('.bc-native-reader-overlay .bc-native-quiz-card');
   if(native)return {kind:'leitor',count:document.querySelectorAll('.bc-native-reader-overlay .bc-native-quiz-card').length,top:Math.round(native.getBoundingClientRect().top)};
   const ov=document.querySelector('#cpcStudyQuizOverlay,[id^="cpcM"][id$="Quiz"]');
   return ov?{kind:'quiz',text:ov.innerText.slice(0,200)}:{kind:'nada'};
  });
  if(seen.kind==='leitor'){if(seen.count!==expect||seen.top>700)failures.push(id+' M'+(mi+1)+': leitor '+JSON.stringify(seen))}
  else if(seen.kind!=='quiz'||!new RegExp('(?:de|/)\\s*'+expect+'\\b','i').test(seen.text))failures.push(id+' M'+(mi+1)+': bateria não abriu '+JSON.stringify(seen));
  console.log('INTERNAL_QUESTIONS_OPEN='+id+' M'+(mi+1)+' '+JSON.stringify(seen).slice(0,160));
  await page.keyboard.press('Escape');
  await page.goto(base+'/central-v119.html?view=home');await page.waitForFunction(()=>document.documentElement.dataset.centralReady==='true');
  await page.evaluate(()=>window.openDisciplines());
  await page.locator('#disciplineGrid [data-study-open-subject="'+id+'"]').first().click();
  await page.waitForFunction(id=>window.CentralDisciplineLoader.isReady(id),id,{timeout:30000});
 }
 await page.goto(base+'/central-v119.html?view=home');await page.waitForFunction(()=>document.documentElement.dataset.centralReady==='true');
}
if(failures.length){console.error('INTERNAL_QUESTIONS_FAILED='+JSON.stringify(failures));process.exitCode=1}
else console.log('INTERNAL_QUESTIONS_OK=penal 17 + cpc 20 módulos');
await browser.close();server.close();
