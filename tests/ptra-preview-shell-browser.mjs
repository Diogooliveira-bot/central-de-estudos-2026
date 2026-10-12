import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import {chromium} from 'playwright';
const root=path.resolve('.');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.bin':'application/octet-stream','.avif':'image/avif','.webp':'image/webp','.svg':'image/svg+xml','.png':'image/png'};
const server=http.createServer((req,res)=>{
 const u=new URL(req.url,'http://localhost');
 if(u.pathname==='/api/auth'&&u.searchParams.get('action')==='me'){res.writeHead(200,{'Content-Type':'application/json'});res.end(JSON.stringify({authenticated:true,user:{id:'ptra-shell-test',name:'Aluno de teste',role:'aluno'}}));return;}
 if(u.pathname.startsWith('/api/')){res.writeHead(200,{'Content-Type':'application/json'});res.end('{}');return;}
 const p=(u.pathname==='/'?'/central-v119.html':u.pathname);
 const absolute=path.resolve(root,'.'+p);
 if(!(absolute===root||absolute.startsWith(root+path.sep))){res.writeHead(403);res.end();return;}
 fs.readFile(absolute,(err,data)=>{if(err){res.writeHead(404);res.end('Not found '+p);return;}
   res.writeHead(200,{'Content-Type':mime[path.extname(absolute)]||'application/octet-stream','Cache-Control':'no-store'});res.end(data);});
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
test('PTRA: o bootstrap real da Central precisa mostrar leitor atualizado e não a versão antiga',async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1280,height:900}});
 const errors=[];
 page.on('pageerror',e=>errors.push(e.message.slice(0,300)));
 page.on('console',m=>{if(m.type()==='error'&&errors.length<30)errors.push(m.text().slice(0,300))});
 try{
  const url='http://127.0.0.1:'+server.address().port+'/central-v119.html';
  await page.goto(url,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>!!window.PtraNative&&!!window.PtraReaderUpgrade,{timeout:60000});
  await page.waitForFunction(()=>!!document.querySelector('.subject[data-id="ptra"]'),{timeout:30000});
  const version=await page.evaluate(()=>({
    upgrade:typeof window.PtraReaderUpgrade?.render,
    native:typeof window.PtraNative?.openReader,
    count:window.PTRA_NATIVE_INDEX?.modules?.length,
    ready:document.documentElement.dataset.centralReady,
    moduleHeaders:document.querySelectorAll('.subject[data-id="ptra"] [data-ptra-module]').length,
    pageUrl:location.href
  }));
  console.log('PTRA_REAL_SHELL',JSON.stringify(version),'PAGE_ERRORS',JSON.stringify(errors.slice(0,7)));
  assert.equal(version.count,21);
  assert.equal(version.moduleHeaders,21);
  await page.evaluate(()=>window.PtraNative.openModule(1));
  await page.waitForSelector('.ptra-native-mod.open [data-ptra-read="resumido"]',{timeout:20000});
  await page.evaluate(()=>window.PtraNative.openReader(1,'resumido'));
  await page.waitForSelector('.ptra-book-qcard',{timeout:25000});
  const result=await page.evaluate(()=>({
    old:document.querySelectorAll('#ptra-native-overlay .ptra-native-page').length,
    new:document.querySelectorAll('#ptra-native-overlay .ptra-book').length,
    buttons:document.querySelectorAll('#ptra-native-overlay .ptra-book-option').length,
    qs:document.querySelectorAll('#ptra-native-overlay .ptra-book-qcard').length
  }));
  console.log('PTRA_READER_REAL_SHELL',JSON.stringify(result));
  assert.deepEqual(result.old,0);
  assert.equal(result.new,1);
  assert.equal(result.qs,5);
  assert.ok(result.buttons>=10);
 } finally {await page.close();await browser.close();}
});
test.after(()=>new Promise(resolve=>server.close(resolve)));