import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const files={'/cadastro-gratuito.html':'cadastro-gratuito.html','/login.html':'login.html','/recuperar-senha.html':'recuperar-senha.html'};
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

 const recovery=await browser.newPage({viewport:{width:390,height:844}});
 await recovery.route('**/api/auth?action=password-reset-*',async route=>{
   const action=new URL(route.request().url()).searchParams.get('action');
   const data=action==='password-reset-request'?{ok:true,message:'Se houver conta, enviaremos um link simulado.'}
     :action==='password-reset-check'?{valid:true}
     :{ok:true,message:'Senha alterada em simulação.'};
   return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(data)});
 });
 await recovery.goto(root+'/recuperar-senha.html');
 await recovery.getByLabel('E-mail cadastrado').fill('ficticio@example.invalid');
 await recovery.getByRole('button',{name:'Enviar link de recuperação'}).click();
 await recovery.getByText('Se houver conta, enviaremos um link simulado.').waitFor();
 await recovery.goto(root+'/recuperar-senha.html#token='+'Z'.repeat(43));
 // Navegação somente por hash não recarrega a página: force uma nova inicialização.
 await recovery.reload();
 await recovery.getByLabel('Nova senha',{exact:true}).fill('NovaSenhaFicticia123');
 await recovery.getByLabel('Confirme a nova senha').fill('NovaSenhaFicticia123');
 await recovery.getByRole('button',{name:'Salvar nova senha'}).click();
 await recovery.getByText('Senha alterada em simulação.').waitFor();
 assert.equal(new URL(recovery.url()).hash,'');
 await recovery.close();
 const login=await browser.newPage({viewport:{width:1366,height:768}});
 let authenticated=false;
 await login.route('**/api/auth?*',async route=>{
   const url=new URL(route.request().url());
   const action=url.searchParams.get('action');
   let payload={};
   if(action==='me')payload={authenticated:false};
   if(action==='bootstrap-status')payload={needsBootstrap:false};
   if(action==='free-signup-status')payload={enabled:false};
   if(action==='login'){payload={ok:true,user:{role:'aluno'}};authenticated=true}
   await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(payload)});
 });
 await login.goto(root+'/login.html?next=%2Fcentral-v119.html');
 await login.getByLabel('E-mail',{exact:true}).fill('ficticio@example.invalid');
 await login.getByLabel('Senha',{exact:true}).fill('NovaSenhaFicticia123');
 await login.getByRole('button',{name:'Entrar',exact:true}).click();
 await login.waitForURL('**/central-v119.html');
 assert.equal(authenticated,true);
 await login.close();
 console.log('PASS: Chromium tela recuperar senha e login simulado; nenhum banco real foi consultado');

 console.log('PASS: Chromium desktop/celular, formulário, API simulada, token invalidado');
}finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve))}
