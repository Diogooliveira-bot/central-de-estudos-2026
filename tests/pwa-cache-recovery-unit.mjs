import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const script=readFileSync(new URL('../sw.js',import.meta.url),'utf8');
const origin='https://base.test';

function createWorker({network,cacheOpen,cacheKeys}={}){
  const handlers=new Map(),requests=[],background=[];
  let claims=0;
  const storage={
    open:cacheOpen|| (async()=>({match:async()=>undefined,put:async()=>{}})),
    keys:cacheKeys|| (async()=>[]),
    delete:async()=>true
  };
  const worker={
    location:{origin},
    addEventListener(type,handler){handlers.set(type,handler)},
    skipWaiting:async()=>true,
    clients:{claim:async()=>{claims++}}
  };
  const fetchMock=async(request,options)=>{
    requests.push({request,options});
    return network ? network(request,options) : new Response('online',{status:200});
  };
  runInNewContext(script,{
    self:worker,caches:storage,fetch:fetchMock,Response,URL,Date,Promise,
    setTimeout,JSON
  },{filename:'sw.js'});
  async function trigger(type,request){
    let response,waited;
    handlers.get(type)({
      request,
      respondWith(value){response=Promise.resolve(value)},
      waitUntil(value){waited=Promise.resolve(value);background.push(waited)}
    });
    if(type==='fetch'){
      assert.ok(response,'fetch must call respondWith');
      return response;
    }
    return waited;
  }
  return {trigger,requests,background,getClaims:()=>claims};
}

const navigate=(path='/')=>({url:origin+path,method:'GET',mode:'navigate'});
const asset=(path='/ui/example.js')=>({url:origin+path,method:'GET',mode:'cors'});

test('online navigation succeeds even when Cache Storage is broken',async()=>{
  const w=createWorker({
    cacheOpen:async()=>{throw new Error('corrupt cache')},
    network:async(req)=>new Response('healthy web page '+req.url,{status:200})
  });
  const response=await w.trigger('fetch',navigate('/'));
  assert.equal(response.status,200);
  assert.match(await response.text(),/healthy web page/);
  assert.equal(w.requests.length,1);
  assert.equal(w.requests[0].request.url,origin+'/');
  assert.equal(w.requests[0].options.cache,'no-store');
});

test('online login respects original requested URL, without serving offline shell',async()=>{
  const w=createWorker({
    network:async(req)=>new Response('login from '+req.url,{status:200})
  });
  const response=await w.trigger('fetch',navigate('/login.html?next=%2F'));
  assert.equal(response.status,200);
  assert.match(await response.text(),/login from .*login.html/);
  assert.equal(w.requests.length,1);
  assert.equal(w.requests[0].request.url,origin+'/login.html?next=%2F');
});

test('offline navigation with no verified session returns recoverable HTML',async()=>{
  const w=createWorker({
    network:async()=>{throw new Error('offline')},
    cacheOpen:async()=>{throw new Error('Cache Storage unavailable')}
  });
  const response=await w.trigger('fetch',navigate());
  assert.equal(response.status,401);
  assert.match(response.headers.get('content-type'),/text\/html/);
  assert.match(await response.text(),/Tentar novamente/);
});

test('offline navigation uses cached shell only for a verified offline session',async()=>{
  const auth={authenticated:true,user:{id:'student'},offline:false};
  const store={
    async match(key){
      if(key==='/__bc_offline_auth__')return new Response(JSON.stringify({
        verifiedAt:Date.now(),data:auth
      }));
      if(key==='/central-v119.html')return new Response('verified offline shell',{status:200});
      return undefined;
    },
    async put(){}
  };
  const w=createWorker({
    network:async()=>{throw new Error('offline')},
    cacheOpen:async()=>store
  });
  const response=await w.trigger('fetch',navigate('/'));
  assert.equal(response.status,200);
  assert.equal(await response.text(),'verified offline shell');
});

test('expired offline session cannot load protected shell',async()=>{
  const store={
    async match(key){
      if(key==='/__bc_offline_auth__')return new Response(JSON.stringify({
        verifiedAt:Date.now()-73*60*60*1000,
        data:{authenticated:true,user:{id:'student'}}
      }));
      if(key==='/central-v119.html')return new Response('PRIVATE HTML');
      return undefined;
    },
    async put(){},
    async delete(){return true}
  };
  const w=createWorker({
    network:async()=>{throw new Error('offline')},
    cacheOpen:async()=>store
  });
  const response=await w.trigger('fetch',navigate('/'));
  assert.equal(response.status,401);
  assert.doesNotMatch(await response.text(),/PRIVATE HTML/);
});

test('online static resources load even when cache initialization fails',async()=>{
  const w=createWorker({
    cacheOpen:async()=>{throw new Error('storage failure')},
    network:async()=>new Response('console.log("ok")',{status:200})
  });
  const response=await w.trigger('fetch',asset('/ui/app.js'));
  assert.equal(response.status,200);
  assert.match(await response.text(),/console.log/);
  await Promise.all(w.background);
});

test('activation claims clients even if cache cleanup fails',async()=>{
  const w=createWorker({cacheKeys:async()=>{throw new Error('storage failure')}});
  await w.trigger('activate');
  assert.equal(w.getClaims(),1);
});

test('installation works without Cache Storage',async()=>{
  const w=createWorker({cacheOpen:async()=>{throw new Error('storage failure')}});
  await w.trigger('install');
  assert.equal(w.requests.length,0);
});


function createCentralBootHarness(){
  const source=readFileSync(new URL('../central-boot-ready.js',import.meta.url),'utf8');
  const winEvents=new Map(),docEvents=new Map(),classes=new Set(['central-boot-pending','bc-ui-v1','bc-topnav','bc-home-v3-active']);
  const status={textContent:'Organizando seu ambiente de estudo...'},spinner={hidden:false},retry={hidden:true};
  let removed=false,rendered=0;
  const root={dataset:{centralBuild:'test'},classList:{contains:x=>classes.has(x),remove:x=>classes.delete(x)}};
  const document={
    documentElement:root,readyState:'loading',
    getElementById:id=>id==='status'?status:id==='retry'?retry:id==='central-boot-screen'?{remove(){removed=true}}:null,
    querySelector:selector=>selector==='#central-boot-screen .spinner'?spinner:null,
    querySelectorAll:selector=>selector==='link[rel="stylesheet"]'?[{sheet:{}}]:[],
    addEventListener:(name,callback)=>docEvents.set(name,callback),
    dispatchEvent(){}
  };
  const messages=[];
  const window={addEventListener:(name,callback)=>winEvents.set(name,callback),renderAll:()=>{rendered++}};
  runInNewContext(source,{window,document,navigator:{},Date,CustomEvent:class{},setTimeout,clearTimeout,
    requestAnimationFrame:fn=>fn(),console:{warn:(...args)=>messages.push(args),error:()=>{}},location:{reload(){}}},
    {filename:'central-boot-ready.js'});
  return {resourceError:target=>winEvents.get('error')({target}),start:()=>docEvents.get('DOMContentLoaded')(),
    status,spinner,retry,root,messages,rendered:()=>rendered,removed:()=>removed};
}

test('aluno gratuito nao fica bloqueado no splash se um script Premium opcional retorna erro',()=>{
  const ui=createCentralBootHarness();
  ui.resourceError({tagName:'SCRIPT',src:'https://base.test/penal-full-theory-data-01.js'});
  assert.equal(ui.retry.hidden,true,'script opcional nao pode derrubar a Central');
  ui.start();
  assert.equal(ui.rendered(),1);
  assert.equal(ui.removed(),true,'a Central precisa liberar a interface apos renderizar');
  assert.equal(ui.root.dataset.centralReady,'true');
  assert.ok(ui.messages.length,'falha do arquivo deve ser registrada para diagnostico');
});

test('erro real em folha de estilo ainda pode bloquear inicializacao quebrada',()=>{
  const ui=createCentralBootHarness();
  ui.resourceError({tagName:'LINK',rel:'stylesheet',href:'https://base.test/ui/layout.css'});
  assert.equal(ui.retry.hidden,false);
  assert.equal(ui.spinner.hidden,true);
  assert.match(ui.status.textContent,/Nao foi possivel|Não foi possível/);
});
