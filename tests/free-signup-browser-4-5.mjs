import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const files={'/cadastro-gratuito.html':'cadastro-gratuito.html','/login.html':'login.html'};
const requests=[];
const server=createServer((req,res)=>{
 const path=new URL(req.url,'http://localhost').pathname;
 if(files[path]){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});res.end(readFileSync(new URL('../'+files[path],import.meta.url)));return}
 res.writeHead(404);res.end('Not found');
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const port=server.address().port;
const root='http://127.0.0.1:'+port;
let browser;
try{
 browser=await chromium.launch({headless:true});
 for(const device of [{label:'desktop',width:1366,height:768},{label:'celular',width:390,height:844}]){
  const page=await browser.newPage({viewport:{width:device.width,height:device.height}});
  await page.route('**/api/auth?action=free-signup',async route=>{
   const body=route.request().postDataJSON();requests.push(body);
   if(body.action==='request')return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,message:'Mensagem enviada para caixa de teste simulada'})});
   if(body.action==='confirm')return route.fulfill({status:201,contentType:'application/json',body:JSON.stringify({ok:true,user:{id:'aluno-ficticio',role:'aluno'}})});
   return route.fulfill({status:400,body:'{}'});
  });
  await page.goto(root+'/cadastro-gratuito.html');
  await page.getByLabel('Seu nome').fill('Pessoa Fictícia');
  await page.getByLabel('Seu e-mail').fill('aluno@example.invalid');
  await page.getByLabel('Crie uma senha (mínimo 12 caracteres)').fill('SenhaSegura1234!');
  await page.getByLabel('Confirme sua senha').fill('SenhaSegura1234!');
  await page.getByRole('button',{name:'Enviar confirmação por e-mail'}).click();
  await page.getByText('Mensagem enviada para caixa de teste simulada').waitFor();
  assert.equal(requests.at(-1).action,'request');
  const overflows=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
  assert.equal(overflows,false,'Horizontal overflow at '+device.label);
  await page.close();
 }
 const page=await browser.newPage();
 await page.route('**/api/auth?action=free-signup',async route=>route.fulfill({status:410,contentType:'application/json',body:JSON.stringify({error:'Link inválido, expirado ou utilizado'})}));
 await page.goto(root+'/cadastro-gratuito.html#token='+'A'.repeat(43));
 await page.getByText('Link inválido, expirado ou utilizado').waitFor();
 assert.equal(new URL(page.url()).hash,'','Token must be removed from visible URL');
 await page.close();
 console.log('PASS: Chromium desktop/celular, formulário, API simulada, token invalidado');
}finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve))}
