import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
// Teoria completa no padrão único (modelo Administrativo) nas seis disciplinas jurídicas.
const root=resolve(process.env.ROOT||'.');
const mime={'.html':'text/html','.js':'application/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.avif':'image/avif','.ico':'image/x-icon','.txt':'text/plain'};
const ent=Object.fromEntries(['theory.summary','theory.complete','vade_mecum','lei_em_dia','tec.links','qc.links','premium.reviews','progress.advanced_sync'].map(k=>[k,{enabled:true}]));
const server=createServer(async(req,res)=>{const path=new URL(req.url,'http://l').pathname;const json=b=>{res.writeHead(200,{'content-type':'application/json'});res.end(JSON.stringify(b))};
 if(path==='/api/auth')return json({authenticated:true,user:{id:'p',name:'Aluno',role:'aluno',plan:'premium'}});
 if(path==='/api/plans')return json({role:'aluno',plan:'premium',status:'active',isStaff:false,entitlements:ent});
 if(path==='/api/sync')return json({exists:false});if(path==='/api/objective')return json({objectiveId:'career-tribunais-analista'});if(path.startsWith('/api/'))return json({});
 try{const f=resolve(root,'.'+(path==='/'?'/central-v119.html':decodeURIComponent(path)));const d=await readFile(f);res.writeHead(200,{'content-type':mime[extname(f)]||'application/octet-stream'});res.end(d)}catch(e){res.writeHead(404);res.end()}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch();const page=await browser.newPage({viewport:{width:1366,height:900}});const errs=[];page.on('pageerror',e=>errs.push(e.message.slice(0,160)));

// Correção editorial V2 nos leitores reais: parágrafos, tabelas em cartões no celular,
// glossário por toque/teclado, "Entenda o termo", botão Aa, sem erros de JavaScript.
const SHOTS=process.env.SHOTS||'';
const CASES=[['adm','.open-topic',1,'Estudar conteúdo'],['civil','.cv-module-head',1,'Estudar conteúdo'],['penal','.cf-module-head',4,'Estudar conteúdo'],['cf','.cf-module-head',0,'Estudar conteúdo'],['cpc','.cf-module-head',1,'Estudar conteúdo'],['cpp','.open-topic',0,'Estudar conteúdo']];
const WIDTHS=(process.env.WIDTHS||'360,390,768,1366').split(',').map(Number);
const open=async(id,head,idx,label)=>{
 await page.goto(base+'/central-v119.html?view=home');await page.waitForFunction(()=>document.documentElement.dataset.centralReady==='true',{timeout:40000});
 await page.evaluate(()=>window.openDisciplines());await page.locator('#disciplineGrid [data-study-open-subject="'+id+'"]').first().click();
 await page.waitForFunction(id=>window.CentralDisciplineLoader.isReady(id),id,{timeout:40000});await page.waitForTimeout(600);
 const sec=page.locator('.subject[data-id="'+id+'"]');const btn=sec.locator('button:visible').filter({hasText:new RegExp('^'+label)}).first();
 // O módulo pode já estar aberto (estado lembrado): só clica no cabeçalho se o botão não estiver visível.
 for(let k=0;k<2&&!(await btn.count());k++){await sec.locator(head+':visible').nth(idx).click();await page.waitForTimeout(800);}
 await btn.click();await page.waitForTimeout(3200);
};
const state=()=>page.evaluate(()=>{
 const a=[...document.querySelectorAll('.bc-native-reader-overlay .bc-native-article')].pop();
 const ps=[...a.querySelectorAll('p,li')].filter(e=>e.offsetParent!==null&&!e.closest('table'));
 const pres=/pre/;let nl=0,split=0;
 ps.forEach(e=>{if(/\n/.test(e.textContent.trim())&&pres.test(getComputedStyle(e).whiteSpace))nl++});
 const pp=[...a.querySelectorAll('p')].filter(e=>e.offsetParent!==null&&!e.closest('table,aside,li,.bc-iq'));
 for(let i=1;i<pp.length;i++){const x=pp[i-1].textContent.trim(),y=pp[i].textContent.trim();if(x.length>25&&!/[.:;!?)"»”…]$/.test(x)&&/^[a-zà-ÿ]/.test(y)&&pp[i-1].nextElementSibling===pp[i])split++}
 const tables=[...a.querySelectorAll('table')].filter(t=>t.offsetParent!==null);
 const card=tables.find(t=>t.classList.contains('bc-tcards'));
 const cardInfo=card?{display:getComputedStyle(card.tBodies[0].rows[0]).display,label:getComputedStyle(card.tBodies[0].rows[0].cells[1],'::before').content,headHidden:card.tHead?getComputedStyle(card.tHead).display==='none':null}:null;
 return {nl,split,hy:ps.length?getComputedStyle(ps[Math.floor(ps.length/2)]).hyphens:'none',tables:tables.length,cards:tables.filter(t=>t.classList.contains('bc-tcards')).length,
  overflowPage:document.documentElement.scrollWidth-innerWidth,overflowArticle:a.scrollWidth-a.clientWidth,cardInfo,
  acr:a.querySelectorAll('abbr.bc-acr').length,terms:a.querySelectorAll('.bc-term').length,tofu://.test(a.innerText),
  fontSize:parseFloat(getComputedStyle(ps[0]).fontSize)};
});
const failures=[];const check=(ok,msg)=>{if(!ok)failures.push(msg)};
for(const [id,head,idx,label] of CASES){
 for(const w of WIDTHS){
  await page.setViewportSize({width:w,height:w<700?820:900});
  await open(id,head,idx,label);
  const s=await state();
  console.log('EDITORIAL='+JSON.stringify({id,w,...s}));
  if(!process.env.REPORT_ONLY){
   check(s.nl===0,id+' '+w+'px: '+s.nl+' parágrafos com quebra de linha preservada');
   check(s.split===0,id+' '+w+'px: '+s.split+' parágrafos cortados no meio da frase');
   check(s.hy!=='auto',id+' '+w+'px: hifenização automática ativa');
   check(!s.tofu,id+' '+w+'px: marcador U+F0B7 visível');
   check(s.overflowPage<=1,id+' '+w+'px: página com rolagem lateral ('+s.overflowPage+'px)');
   if(w<=640)check(s.overflowArticle<=2,id+' '+w+'px: conteúdo mais largo que a tela ('+s.overflowArticle+'px)');
   if(s.cardInfo&&w<=640){check(s.cardInfo.display==='block',id+' '+w+'px: tabela não virou cartão');check(/"/.test(s.cardInfo.label),id+': cartão sem rótulo da coluna');check(s.cardInfo.headHidden===true,id+': cabeçalho duplicado no cartão');}
   if(s.cardInfo&&w>=1000)check(s.cardInfo.display!=='block',id+' '+w+'px: no computador a tabela deve continuar tabela');
  }
  if(SHOTS)await page.screenshot({path:SHOTS+'/'+id+'-'+w+'.png'});
 }
}
// Glossário e "Entenda o termo" por toque e teclado; botão Aa.
if(!process.env.REPORT_ONLY){
 await page.setViewportSize({width:390,height:820});await open('penal','.cf-module-head',4,'Estudar conteúdo');
 const abbr=page.locator('.bc-native-reader-overlay abbr.bc-acr').first();
 if(await abbr.count()){
  await abbr.scrollIntoViewIfNeeded();await abbr.click();
  check(await page.locator('.bc-acr-tip').count()===1,'toque na sigla não mostrou o significado');
  await page.keyboard.press('Escape');check(await page.locator('.bc-acr-tip').count()===0,'Esc não fechou a sigla');check(await page.locator('.bc-native-reader-overlay').count()===1,'Esc na sigla fechou o leitor inteiro');
  await abbr.evaluate(e=>{e.scrollIntoView({block:'center'});e.focus()});await page.keyboard.press('Enter');check(await page.locator('.bc-acr-tip').count()===1,'Enter na sigla não mostrou o significado');await page.keyboard.press('Escape');
 } else failures.push('nenhuma sigla tratada no leitor de Penal');
 const term=page.locator('.bc-native-reader-overlay .bc-term').first();
 if(await term.count()){
  await term.scrollIntoViewIfNeeded();await term.click();
  check(/Significado simples/.test(await page.locator('.bc-term-pop').textContent().catch(()=>'')),'toque no termo não abriu a explicação');
  await page.keyboard.press('Escape');check(await page.locator('.bc-term-pop').count()===0,'Esc não fechou a explicação');check(await page.locator('.bc-native-reader-overlay').count()===1,'Esc no termo fechou o leitor inteiro');
  await term.evaluate(e=>{e.scrollIntoView({block:'center'});e.focus()});await page.keyboard.press('Enter');check(await page.locator('.bc-term-pop').count()===1,'Enter no termo não abriu a explicação');await page.keyboard.press('Escape');
 } else failures.push('nenhum termo marcado no leitor de Penal');
 const size0=(await state()).fontSize;
 const plus=page.locator('.bc-native-reader-overlay [data-bc-reading-size="1"]').last();
 if(await plus.count()){await plus.click();await page.waitForTimeout(300);check((await state()).fontSize>size0,'botão Aa (A+) não aumentou a fonte');const minus=page.locator('.bc-native-reader-overlay [data-bc-reading-size="-1"]').last();await minus.click();}
 else failures.push('botão Aa ausente');
}
check([...new Set(errs)].length===0,'erros de JavaScript: '+[...new Set(errs)].join(' | '));
if(failures.length&&!process.env.REPORT_ONLY){console.error('EDITORIAL_FAILED='+JSON.stringify(failures));process.exitCode=1}else console.log('EDITORIAL_OK');
await browser.close();server.close();
