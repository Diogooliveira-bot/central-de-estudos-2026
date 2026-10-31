import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
// Questões do texto em modo interativo e siglas com descrição nos leitores jurídicos.
const root=resolve('.');
const mime={'.html':'text/html','.js':'application/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.avif':'image/avif','.ico':'image/x-icon','.txt':'text/plain'};
const ent=Object.fromEntries(['theory.summary','theory.complete','vade_mecum','lei_em_dia','tec.links','qc.links','premium.reviews','progress.advanced_sync'].map(k=>[k,{enabled:true}]));
const server=createServer(async(req,res)=>{const path=new URL(req.url,'http://l').pathname;const json=b=>{res.writeHead(200,{'content-type':'application/json'});res.end(JSON.stringify(b))};
 if(path==='/api/auth')return json({authenticated:true,user:{id:'p',name:'Aluno',role:'aluno',plan:'premium'}});
 if(path==='/api/plans')return json({role:'aluno',plan:'premium',status:'active',isStaff:false,entitlements:ent});
 if(path==='/api/sync')return json({exists:false});if(path==='/api/objective')return json({objectiveId:'career-tribunais-analista'});if(path.startsWith('/api/'))return json({});
 try{const f=resolve(root,'.'+(path==='/'?'/central-v119.html':decodeURIComponent(path)));const d=await readFile(f);res.writeHead(200,{'content-type':mime[extname(f)]||'application/octet-stream'});res.end(d)}catch(e){res.writeHead(404);res.end()}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch();const page=await browser.newPage({viewport:{width:Number(process.env.W||1280),height:Number(process.env.H||900)}});const errs=[];page.on('pageerror',e=>errs.push(e.message.slice(0,160)));
const S={cpp:['.open-topic >> nth=0'],adm:['.open-topic >> nth=2'],cpc:['.cf-module-head >> nth=3'],cf:['.cf-module-head >> nth=1'],penal:['.cf-module-head >> nth=2'],civil:['.cv-module-head >> nth=3']};
for(const id of (process.env.SUBJ||Object.keys(S).join(',')).split(',')){
 await page.goto(base+'/central-v119.html?view=home');await page.waitForFunction(()=>document.documentElement.dataset.centralReady==='true',{timeout:40000});
 await page.evaluate(()=>window.openDisciplines());await page.locator('#disciplineGrid [data-study-open-subject="'+id+'"]').first().click();
 await page.waitForFunction(id=>window.CentralDisciplineLoader.isReady(id),id,{timeout:40000});await page.waitForTimeout(800);
 const sec=page.locator('.subject[data-id="'+id+'"]');await sec.locator(S[id][0]).click();await page.waitForTimeout(900);
 const modAbbr=await sec.locator('.bc-acr-full').count();
 await sec.locator('button:visible').filter({hasText:/^Estudar conteúdo$/}).first().click();await page.waitForTimeout(3500);
 const r=await page.evaluate(()=>{const a=[...document.querySelectorAll('.bc-native-reader-overlay .bc-native-article')].pop();const vis=el=>el.offsetParent!==null;
  const gab=[...a.querySelectorAll('p,li,div')].filter(e=>!e.querySelector('p,li,div')&&/Gabarito\s*[:\-–]/.test(e.textContent)&&vis(e)).length;
  return {choice:a.querySelectorAll('.bc-iq-choice').length,tf:a.querySelectorAll('.bc-iq-tf').length,reveal:a.querySelectorAll('.bc-iq-reveal').length,gabaritoVisivel:gab,siglasExpandidas:a.querySelectorAll('.bc-acr-full').length,siglas:a.querySelectorAll('abbr.bc-acr').length,
  exemplos:[...a.querySelectorAll('.bc-acr-full')].slice(0,4).map(e=>e.textContent)}});
 const MIN={cpp:['choice',10],adm:['choice',10],cpc:['tf',10],cf:['reveal',10]}[id];
 if(MIN)assert.ok(r[MIN[0]]>=MIN[1],id+': esperadas '+MIN[1]+' questões interativas ('+MIN[0]+'), obtidas '+r[MIN[0]]);
 assert.equal(r.gabaritoVisivel,0,id+': gabarito à vista antes da resposta');
 assert.ok(r.siglasExpandidas>0&&r.siglas>0,id+': siglas sem descrição');
 assert.ok(modAbbr>0||id==='civil',id+': siglas da tela do módulo sem descrição');
 const q=page.locator('.bc-native-reader-overlay .bc-iq').first();
 if(await q.count()){
  const hidden=await q.evaluate(box=>{const sib=[...box.parentElement.children];const i=sib.indexOf(box);return sib.slice(i+1,i+3).some(e=>e.hidden&&/Gabarito/.test(e.textContent))});
  assert.ok(hidden,id+': gabarito deve ficar oculto até responder');
  await q.locator('.bc-iq-option').first().click();
  assert.ok(await q.evaluate(box=>box.classList.contains('answered')&&!!box.querySelector('.correct')),id+': resposta não corrigida');
  assert.ok(await q.evaluate(box=>{const sib=[...box.parentElement.children];const i=sib.indexOf(box);return sib.slice(i+1,i+4).some(e=>!e.hidden&&/Gabarito/.test(e.textContent))}),id+': gabarito não apareceu após responder');
 }
 const reveal=page.locator('.bc-native-reader-overlay .bc-iq-reveal').first();
 if(await reveal.count()){await reveal.scrollIntoViewIfNeeded();await reveal.click();assert.equal(await reveal.textContent(),'Ocultar resposta');}
 console.log('READER_QUESTIONS_OK='+id+' '+JSON.stringify({choice:r.choice,tf:r.tf,reveal:r.reveal,siglas:r.siglasExpandidas}));
}
assert.deepEqual([...new Set(errs)],[],'erros de JavaScript');
await browser.close();server.close();
