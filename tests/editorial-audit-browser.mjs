import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
// Teoria completa no padrão único (modelo Administrativo) nas seis disciplinas jurídicas.
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

const S={adm:'.open-topic',cf:'.cf-module-head',civil:'.cv-module-head',cpc:'.cf-module-head',penal:'.cf-module-head',cpp:'.open-topic'};
const MODS=(process.env.MODS||'1').split(',').map(Number);
const only=process.env.ONLY?process.env.ONLY.split(','):Object.keys(S);
const report=[];
const metrics=()=>page.evaluate(()=>{
 const o=[...document.querySelectorAll('.bc-native-reader-overlay')].pop();const a=o?.querySelector('.bc-native-article');if(!a)return null;
 const blocks=[...a.querySelectorAll('p,li')].filter(e=>e.offsetParent!==null&&!e.closest('table,.bc-iq,.bc-native-quiz-card'));
 const ws=e=>getComputedStyle(e).whiteSpace;
 const nl=blocks.filter(e=>/\n/.test(e.textContent.trim())&&/pre/.test(ws(e)));
 let split=0;const splitEx=[];
 const ps=[...a.querySelectorAll('p')].filter(e=>e.offsetParent!==null&&!e.closest('table,.bc-iq,aside,li'));
 for(let i=1;i<ps.length;i++){const prev=ps[i-1].textContent.trim(),cur=ps[i].textContent.trim();
  if(prev.length>25&&!/[.:;!?)"»”…]$/.test(prev)&&/^[a-zà-ÿ]/.test(cur)&&ps[i-1].nextElementSibling===ps[i]){split++;if(splitEx.length<2)splitEx.push(prev.slice(-40)+' ¶ '+cur.slice(0,40))}}
 const hy=blocks.length?getComputedStyle(blocks[Math.floor(blocks.length/2)]).hyphens:'-';
 const tables=[...a.querySelectorAll('table')].filter(t=>t.offsetParent!==null||t.closest('[data-bc-cards]'));
 const tinfo=tables.map(t=>{const rows=t.rows.length,cols=Math.max(0,...[...t.rows].map(r=>r.cells.length));const box=(t.parentElement.getBoundingClientRect());return {cards:t.classList.contains('bc-tcards'),rows,cols,overflow:Math.round(Math.max(t.getBoundingClientRect().width,t.closest('.bc-table-scroll')?t.closest('.bc-table-scroll').scrollWidth:0)-a.clientWidth),scroll:!!t.closest('.bc-table-scroll'),th:t.querySelectorAll('th').length,colspan:t.querySelectorAll('[colspan],[rowspan]').length}});
 // texto "tabela achatada": linhas com separador | ou várias colunas por espaços
 const pipeRows=blocks.filter(e=>(e.textContent.match(/\|/g)||[]).length>=2).length;
 const text=a.innerText;
 const known=new Set([...a.querySelectorAll('abbr.bc-acr')].map(x=>x.textContent));
 const tok={};for(const m of text.matchAll(/(?<![\p{L}\p{N}])([A-Z]{2,6}(?:\/\d{2})?)(?![\p{L}\p{N}])/gu)){const t=m[1];if(!known.has(t))tok[t]=(tok[t]||0)+1}
 const unknown=Object.entries(tok).sort((x,y)=>y[1]-x[1]).slice(0,25);
 return {pagew:document.documentElement.scrollWidth-innerWidth,terms:a.querySelectorAll('.bc-term').length,tofu:(text.match(/\uf0b7/g)||[]).length,preVisible:[...a.querySelectorAll('pre')].filter(p=>p.offsetParent!==null).length,paras:blocks.length,nl:nl.length,nlEx:nl.slice(0,1).map(e=>e.textContent.trim().slice(0,90)),split,splitEx,hyphens:hy,tables:tinfo,pipeRows,acrKnown:[...known].length,unknown,width:a.clientWidth};
});
for(const id of only){
 for(const n of MODS){
  for(const mode of ['Estudar conteúdo','Revisar conteúdo']){
   await page.goto(base+'/central-v119.html?view=home');await page.waitForFunction(()=>document.documentElement.dataset.centralReady==='true',{timeout:40000});
   await page.evaluate(()=>window.openDisciplines());await page.locator('#disciplineGrid [data-study-open-subject="'+id+'"]').first().click();
   await page.waitForFunction(id=>window.CentralDisciplineLoader.isReady(id),id,{timeout:40000});await page.waitForTimeout(600);
   const sec=page.locator('.subject[data-id="'+id+'"]');const heads=sec.locator(S[id]+':visible');
   const idx=id==='cpc'?n:n-1; if(idx>=await heads.count())continue;
   const btn=sec.locator('button:visible').filter({hasText:new RegExp('^'+mode)}).first();
   for(let k=0;k<2&&!(await btn.count());k++){await heads.nth(idx).click();await page.waitForTimeout(800);}
   if(!await btn.count()){report.push({id,n,mode,err:'sem botão'});console.log('AUDIT='+JSON.stringify(report[report.length-1]));continue}
   await btn.click();await page.waitForTimeout(3500);
   const m=await metrics();report.push({id,n,mode:mode.split(' ')[0],...(m||{err:'leitor não abriu'})});
   console.log('AUDIT='+JSON.stringify(report[report.length-1]));
  }
 }
}
console.log('ERRS='+JSON.stringify([...new Set(errs)]));
await browser.close();server.close();
