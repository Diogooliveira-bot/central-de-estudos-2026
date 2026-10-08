import {createServer} from "node:http";
import {readFile} from "node:fs/promises";
import {resolve,extname} from "node:path";
import assert from "node:assert/strict";
import {chromium} from "playwright";

const root=resolve(".");
const mime={".html":"text/html",".js":"text/javascript",".css":"text/css",".json":"application/json",".png":"image/png",".webp":"image/webp",".svg":"image/svg+xml"};
const server=createServer(async(request,response)=>{
 const uri=new URL(request.url,"http://localhost"),pathname=decodeURIComponent(uri.pathname);
 if(pathname.startsWith("/api/")){response.writeHead(200,{"Content-Type":"application/json"});response.end(pathname==="/api/auth"?JSON.stringify({authenticated:true,user:{id:"smoke-adm",role:"aluno"}}):"{}");return;}
 const file=resolve(root,"."+pathname);
 if(!file.startsWith(root+"/")){response.writeHead(403);response.end();return;}
 try{const body=await readFile(file);response.writeHead(200,{"Content-Type":mime[extname(file)]||"application/octet-stream"});response.end(body)}
 catch{response.writeHead(404);response.end();}
});
await new Promise(ok=>server.listen(0,"127.0.0.1",ok));
const base="http://127.0.0.1:"+server.address().port;
let browser;
const report=[];
try{
 browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
 for(const width of [390,1280]){
  const context=await browser.newContext({viewport:{width,height:880},serviceWorkers:"block"});
  const page=await context.newPage(),errors=[];
  page.on("pageerror",e=>errors.push(e.message));
  page.on("response",response=>{if(response.status()===404&&response.url().startsWith(base))errors.push("404 "+response.url())});
  await page.goto(base+"/tools/decorando.html",{waitUntil:"domcontentloaded"});
  await page.waitForFunction(()=>typeof DATA!=="undefined"&&document.querySelector(".qc-title"),{timeout:10000});
  await page.locator(".bc-discipline-step .qc-select").click();
  await page.locator(".qc-pop .qc-opt").filter({hasText:"Direito Administrativo"}).click();
  const inventory=await page.evaluate(()=>({discipline:currentDiscipline().id,questions:allActive().length,laws:disciplineTopics().length,lawCounts:Object.fromEntries(["adm-lei-9784","adm-lei-12527","adm-lei-13709","adm-lei-14133"].map(id=>[id,allActive().filter(q=>q.topicId===id).length]))}));
  assert.equal(inventory.discipline,"adm");
  assert.equal(inventory.questions,678);
  assert.equal(inventory.laws,25);
  assert.deepEqual(inventory.lawCounts,{"adm-lei-9784":69,"adm-lei-12527":52,"adm-lei-13709":43,"adm-lei-14133":67});
  await page.evaluate(()=>toggleTopic("adm-lei-9784"));
  assert.equal(await page.evaluate(()=>selectedActive().length),69);
  await page.locator(".qc-status-options button").filter({hasText:"Não vistas"}).click();
  await page.locator(".qc-go").click();
  await page.locator(".exercise-card").waitFor();
  const target=await page.evaluate(()=>({id:visible()[ui.articleIndex].id,answer:visible()[ui.articleIndex].question.answer}));
  await page.locator(".main-answers button").filter({hasText:target.answer?"Certo":"Errado"}).click();
  await page.locator(".feedback").first().waitFor();
  assert.equal(await page.evaluate(id=>!!saved.answered[id],target.id),true);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,"Overflow horizontal na largura "+width);
  await page.reload({waitUntil:"domcontentloaded"});
  await page.waitForFunction(()=>document.querySelector(".qc-title"));
  assert.equal(await page.evaluate(id=>!!saved.answered[id],target.id),true);
  assert.deepEqual(errors,[]);
  report.push({width,...inventory,answeredId:target.id,result:"ok"});
  await context.close();
 }
 console.log(JSON.stringify({result:"PASS",screens:report},null,2));
}finally{if(browser)await browser.close();await new Promise(ok=>server.close(ok));}
