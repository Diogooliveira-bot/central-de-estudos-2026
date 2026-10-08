import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { extname, resolve, join } from 'node:path';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const root=resolve('.'),outDir=join(root,'audits/lei-em-dia-20261008');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.ico':'image/x-icon'};
const server=createServer(async(request,response)=>{
  const pathname=new URL(request.url,'http://localhost').pathname;
  if(pathname.startsWith('/api/')){response.writeHead(200,{'Content-Type':'application/json'});response.end(pathname==='/api/auth'?JSON.stringify({authenticated:true,user:{id:'lei-test',role:'aluno'}}):'{}');return}
  const file=resolve(root,'.'+(pathname==='/'?'/tools/decorando.html':decodeURIComponent(pathname)));
  if(!file.startsWith(root+'/')){response.writeHead(403);response.end();return}
  try{const body=await readFile(file);response.writeHead(200,{'Content-Type':mime[extname(file)]||'application/octet-stream'});response.end(body)}
  catch{response.writeHead(404);response.end()}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
const base=`http://127.0.0.1:${server.address().port}`;
const issues=[],cases=[];
async function open(width){
  const context=await browser.newContext({viewport:{width,height:900},serviceWorkers:'block'}),page=await context.newPage();
  page.on('pageerror',error=>issues.push({width,kind:'js',message:error.message}));
  page.on('response',response=>{if(response.status()===404&&new URL(response.url()).origin===base)issues.push({width,kind:'404',url:response.url()})});
  await page.goto(base+'/tools/decorando.html',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>typeof DATA!=='undefined'&&DATA.length>0&&document.querySelector('.qc-title'));
  return {context,page};
}
async function chooseCf(page){
  await page.locator('.bc-discipline-step .qc-select').click();
  await page.locator('.qc-pop .qc-opt').filter({hasText:'Direito Constitucional'}).click();
  assert.equal(await page.evaluate(()=>currentDiscipline().id),'cf');
}
async function size(page,width,screen){
  const result=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,viewport:innerWidth}));
  cases.push({width,screen,...result});assert.ok(result.scroll<=result.viewport+1,`Overflow em ${screen} ${width}px: ${JSON.stringify(result)}`);
}
async function selectText(page,selector,length=12){
  await page.evaluate(({selector,length})=>{
    const host=document.querySelector(selector),walker=document.createTreeWalker(host,NodeFilter.SHOW_TEXT);
    let node;while((node=walker.nextNode())&&node.textContent.trim().length<length){}
    if(!node)throw new Error('Texto selecionável não encontrado: '+selector);
    const start=node.textContent.search(/\S/),range=document.createRange();
    range.setStart(node,start);range.setEnd(node,Math.min(start+length,node.textContent.length));
    const selection=getSelection();selection.removeAllRanges();selection.addRange(range);captureTextSelection();
  },{selector,length});
  await page.locator('#lei-selection-toolbar:not([hidden])').waitFor();
}
try{
  await mkdir(outDir,{recursive:true});
  const {context,page}=await open(390);
  assert.equal(await page.title(),'Lei em Dia · Base Completa');
  await size(page,390,'filtros vazios');
  await chooseCf(page);
  const inventory=await page.evaluate(()=>({all:allActive().length,withExplanation:allActive().filter(a=>a.question.explanation&&a.parts?.length).length,years:qcOptions('year').length,roles:qcOptions('role').length}));
  assert.ok(inventory.all>0&&inventory.withExplanation>0);
  await page.locator('.qc-status-options button').filter({hasText:'Não vistas'}).click();
  assert.equal(await page.evaluate(()=>statusFiltered(selectedActive()).length),inventory.all);
  await page.locator('.qc-go').click();
  assert.ok(await page.locator('.exercise-card').count());
  await size(page,390,'foco antes da resposta');
  const target=await page.evaluate(()=>allActive().find(a=>a.question.explanation&&a.parts?.length).id);
  await page.evaluate(id=>{ui.articleIndex=visible().findIndex(a=>a.id===id);render()},target);
  const correct=await page.evaluate(()=>visible()[ui.articleIndex].question.answer);
  await page.locator('.main-answers button').filter({hasText:correct?'Certo':'Errado'}).click();
  assert.ok(await page.locator('.feedback').count());
  assert.equal(await page.evaluate(()=>visible()[ui.articleIndex].id),target);
  await size(page,390,'foco respondido');
  const drag=await page.evaluate(()=>{
    const node=document.querySelector('.feedback .selectable-highlight').firstChild;
    const start=document.createRange(),end=document.createRange();
    start.setStart(node,0);start.setEnd(node,1);end.setStart(node,10);end.setEnd(node,11);
    const a=start.getBoundingClientRect(),b=end.getBoundingClientRect();
    return {start:{x:a.left+1,y:a.top+a.height/2},end:{x:b.left+1,y:b.top+b.height/2}};
  });
  await page.mouse.move(drag.start.x,drag.start.y);
  await page.mouse.down();
  await page.mouse.move(drag.end.x,drag.end.y,{steps:8});
  await page.mouse.up();
  assert.ok((await page.evaluate(()=>getSelection().toString())).length>0,'Arrastar o mouse deve selecionar texto da resposta');
  await page.locator('#lei-selection-toolbar:not([hidden])').waitFor();
  await page.locator('#lei-selection-toolbar [data-cancel]').click();
  await selectText(page,'.feedback .selectable-highlight');
  await page.locator('#lei-selection-toolbar [data-color="yellow"]').click();
  assert.equal(await page.locator('.feedback mark.user-highlight.yellow').count(),1);
  await selectText(page,'.law-text .law-part');
  await page.locator('#lei-selection-toolbar [data-color="blue"]').click();
  assert.equal(await page.locator('.law-text mark.user-highlight.blue').count(),1);
  await selectText(page,'.law-text .law-part');
  await page.locator('#lei-selection-toolbar [data-color="pink"]').click();
  assert.equal(await page.locator('.law-text mark.user-highlight.pink').count(),1);
  await selectText(page,'.law-text .law-part');
  await page.locator('#lei-selection-toolbar [data-remove]').click();
  assert.equal(await page.locator('.law-text mark.user-highlight').count(),0);
  await selectText(page,'.law-text .law-part');
  await page.locator('#lei-selection-toolbar [data-color="blue"]').click();
  await page.locator('.law-text .law-part').first().click();
  assert.equal(await page.evaluate(id=>saved.highlights[id]?.[0],target),'yellow');
  await page.locator('.importance select').selectOption('alta');
  await page.locator('.question-actions button').filter({hasText:'Comentário'}).click();
  await page.locator('.comment-box textarea').fill('Nota de teste');
  assert.equal(await page.evaluate(id=>saved.notes[id],target),'Nota de teste');
  await page.locator('.history-toggle').click();
  assert.ok((await page.locator('.history-progress').innerText()).includes('de 5 acertos consecutivos'));
  await page.locator('.feedback').scrollIntoViewIfNeeded();
  await page.screenshot({path:join(outDir,'destaque-resposta-mobile.png')});
  const mastery=await page.evaluate(id=>{
    const article=DATA.find(a=>a.id===id);
    for(let i=0;i<5;i++)record(article,article.question.answer);
    const mastered=attemptStats(id);
    record(article,!article.question.answer);
    const reset=attemptStats(id);
    for(let i=0;i<5;i++)record(article,article.question.answer);
    const recovered=attemptStats(id);render();
    return {mastered,reset,recovered,history:saved.attempts[id].length};
  },target);
  assert.equal(mastery.mastered.mastered,true);
  assert.equal(mastery.reset.streak,0);
  assert.equal(mastery.reset.mastered,false);
  assert.equal(mastery.recovered.mastered,true);
  assert.equal(mastery.history,12);
  await page.evaluate(()=>setScreen('filters'));
  await page.locator('.qc-status-options button').filter({hasText:'Dominadas'}).click();
  assert.equal(await page.evaluate(()=>statusFiltered(selectedActive()).length),1);
  await page.locator(`.qc-status-options button[onclick="chooseStatus('answered')"]`).click();
  assert.equal(await page.evaluate(()=>statusFiltered(selectedActive()).length),1);
  await page.locator('.qc-status-options button').filter({hasText:'Errei por último'}).click();
  assert.equal(await page.evaluate(()=>statusFiltered(selectedActive()).length),0);
  await page.locator('.qc-status-options button').filter({hasText:'Não vistas'}).click();
  assert.equal(await page.evaluate(()=>statusFiltered(selectedActive()).length),inventory.all-1);
  await page.locator('.qc-opts summary').click();
  await page.locator('.qc-opts button').filter({hasText:'Scroll'}).click();
  assert.equal(await page.evaluate(()=>saved.preferences.studyMode),'scroll');
  assert.ok(await page.locator('.qc-opts[open]').count());
  await page.locator('.qc-go').click();
  const scrollTarget=await page.evaluate(()=>({id:visible()[0].id,answer:visible()[0].question.answer}));
  await page.locator('.scroll-question-card').first().locator('.main-answers button').filter({hasText:scrollTarget.answer?'Certo':'Errado'}).click();
  assert.equal(await page.locator('.scroll-question-card .feedback').count(),1);
  assert.equal(await page.evaluate(()=>visible()[0].id),scrollTarget.id);
  await size(page,390,'scroll respondido');
  await page.evaluate(()=>setScreen('audit'));
  assert.match(await page.locator('.metric-grid').innerText(),/dominadas/i);
  await size(page,390,'auditoria');
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.querySelector('.qc-title'));
  assert.equal(await page.evaluate(id=>saved.textHighlights[id].explanation.length,target),1);
  assert.equal(await page.evaluate(id=>saved.textHighlights[id]['part:0'].length,target),1);
  assert.equal(await page.evaluate(id=>saved.importance[id],target),'alta');
  await page.locator('.theme-toggle').click();
  assert.equal(await page.evaluate(()=>document.documentElement.dataset.theme),'dark');
  await page.reload({waitUntil:'domcontentloaded'});
  assert.equal(await page.evaluate(()=>document.documentElement.dataset.theme),'dark');
  await size(page,390,'filtros escuros');
  await page.screenshot({path:join(outDir,'filtros-mobile.png')});
  await chooseCf(page);
  await page.screenshot({path:join(outDir,'filtros-configurados-mobile.png'),fullPage:true});
  await context.close();
  const secondary=await open(800),other=secondary.page;
  await chooseCf(other);
  await other.locator('.bc-filter-section').last().locator('summary').click();
  await other.locator('.qc-field:has(#label-year) .qc-select').click();
  await other.locator('.qc-pop .qc-opt').first().click();
  assert.equal(await other.evaluate(()=>ui.fYears.size),1);
  await other.locator('.qc-pop-foot .primary').click();
  await other.evaluate(()=>qcClearAll());
  const filters=await other.evaluate(()=>{
    const base=allActive(),first=base.find(a=>qcYear(a)!=='Sem ano'&&qcBank(a)!=='Sem banca informada');
    ui.fYears.add(qcYear(first));ui.fBanks.add(qcBank(first));ui.fOrigin=qcOrigin(first);render();
    const match=selectedActive();
    const coherent=match.every(a=>qcYear(a)===qcYear(first)&&qcBank(a)===qcBank(first)&&qcOrigin(a)===qcOrigin(first));
    qcClearAll();
    return {filtered:match.length,coherent,restored:selectedActive().length,all:base.length};
  });
  assert.ok(filters.filtered>0&&filters.coherent&&filters.restored===filters.all);
  await other.locator('.qc-go').click();
  const deletedId=await other.evaluate(()=>visible()[0].id);
  other.once('dialog',dialog=>dialog.accept());
  await other.locator('.question-actions .delete-action').click();
  assert.equal(await other.evaluate(id=>!!saved.deleted[id],deletedId),true);
  assert.equal(await other.evaluate(id=>visible().some(a=>a.id===id),deletedId),false);
  await other.evaluate(()=>setScreen('audit'));
  assert.equal(await other.locator('.deleted-list button').count(),1);
  await other.locator('.deleted-list button').click();
  assert.equal(await other.evaluate(id=>!!saved.deleted[id],deletedId),false);
  await other.evaluate(()=>setScreen('filters'));
  await other.locator('.qc-opts summary').click();
  await other.locator('.qc-opts button').filter({hasText:'Aleatória'}).click();
  await other.locator('.qc-opts button').filter({hasText:'Errado à esquerda'}).click();
  assert.deepEqual(await other.evaluate(()=>[saved.preferences.order,saved.preferences.answerOrder]),['random','wrong-left']);
  await other.locator('.qc-go').click();
  assert.match(await other.locator('.main-answers button').first().innerText(),/Errado/);
  const firstRandom=await other.evaluate(()=>visible()[ui.articleIndex].id);
  await other.evaluate(()=>randomQuestion());
  assert.notEqual(await other.evaluate(()=>visible()[ui.articleIndex].id),firstRandom);
  await size(other,800,'aleatório e ações');
  await secondary.context.close();
  for(const width of [360,800,900,1440]){
    const opened=await open(width);await chooseCf(opened.page);await size(opened.page,width,'filtros');
    await opened.page.locator('.qc-go').click();await size(opened.page,width,'foco');
    const answer=await opened.page.evaluate(()=>visible()[0].question.answer);
    await opened.page.locator('.main-answers button').filter({hasText:answer?'Certo':'Errado'}).click();
    await size(opened.page,width,'resposta');
    if(width===800)await opened.page.screenshot({path:join(outDir,'resposta-tablet.png')});
    if(width===1440)await opened.page.screenshot({path:join(outDir,'resposta-desktop.png')});
    await opened.page.evaluate(()=>setScreen('audit'));await size(opened.page,width,'auditoria');
    await opened.context.close();
  }
  const offlineContext=await browser.newContext({viewport:{width:390,height:850}}),offlinePage=await offlineContext.newPage();
  await offlinePage.goto(base+'/tools/decorando.html');
  await offlinePage.evaluate(async()=>{await navigator.serviceWorker.register('/sw.js',{scope:'/'});await navigator.serviceWorker.ready});
  await offlinePage.reload();
  await offlinePage.waitForFunction(()=>!!navigator.serviceWorker.controller);
  await offlinePage.evaluate(async()=>{await fetch('/api/auth?action=me');saved.notes['offline-check']='progresso salvo';save()});
  await offlineContext.setOffline(true);
  const offlineResponse=await offlinePage.reload({waitUntil:'domcontentloaded'});
  await offlinePage.waitForFunction(()=>typeof DATA!=='undefined'&&DATA.length>0);
  assert.equal(offlineResponse.status(),200);
  assert.equal(await offlinePage.evaluate(()=>saved.notes['offline-check']),'progresso salvo');
  await offlineContext.setOffline(false);
  await offlinePage.reload({waitUntil:'domcontentloaded'});
  assert.equal(await offlinePage.evaluate(()=>saved.notes['offline-check']),'progresso salvo');
  await offlineContext.close();
  assert.deepEqual(issues,[]);
  const result={inventory,mastery:{mastered:mastery.mastered.mastered,resetStreak:mastery.reset.streak,recovered:mastery.recovered.mastered,history:mastery.history},offline:{reloadStatus:offlineResponse.status(),persisted:true,reconnected:true},cases,issues};
  await writeFile(join(outDir,'browser-results.json'),JSON.stringify(result,null,2)+'\n');
  console.log(JSON.stringify(result));
} finally {await browser.close();server.close()}
