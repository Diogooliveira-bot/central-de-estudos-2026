/* Base Completa — PWA autenticado e offline por sessão verificada. */
var CACHE='central-20261010-auditfix1-ptra2';
var AUTH_CACHE='central-auth-session-v1';
var AUTH_KEY='/__bc_offline_auth__';
var AUTH_TTL_MS=72*60*60*1000;
var BOOT='/central-v119.html';
var OFFLINE_MANIFEST='/central-offline-files-v66172.json?v=20261010ptra2';
var OFFLINE_READY='/central-offline-ready?v=20261010-auditfix1-ptra2';

function publicPath(path){
  return path==='/login.html'||path==='/favicon.ico'||path==='/robots.txt'||path==='/assets/base-completa-symbol.webp';
}
function cacheResponse(cache,request,response){
  if(response&&response.ok&&!response.redirected)cache.put(request,response.clone()).catch(function(){});
  return response;
}
async function clearOfflineAuth(){
  try{var cache=await caches.open(AUTH_CACHE);await cache.delete(AUTH_KEY)}catch(_){}
}
async function cacheOfflineAuth(response){
  if(!response||!response.ok)return response;
  try{
    var data=await response.clone().json(),cache=await caches.open(AUTH_CACHE);
    if(data&&data.authenticated&&data.user){
      await cache.put(AUTH_KEY,new Response(JSON.stringify({verifiedAt:Date.now(),data:data}),{headers:{'Content-Type':'application/json','Cache-Control':'no-store'}}));
    }else await cache.delete(AUTH_KEY);
  }catch(_){}
  return response;
}
async function offlineAuthData(){
  try{
    var cache=await caches.open(AUTH_CACHE),hit=await cache.match(AUTH_KEY);
    if(!hit)return null;
    var wrapper=await hit.json(),verifiedAt=Number(wrapper&&wrapper.verifiedAt||0),data=wrapper&&wrapper.data;
    if(!data||!data.authenticated||!data.user||!verifiedAt||Date.now()-verifiedAt>AUTH_TTL_MS){
      await cache.delete(AUTH_KEY);return null;
    }
    return data;
  }catch(_){return null}
}
async function offlineAuthResponse(){
  var data=await offlineAuthData();
  if(!data)return new Response(JSON.stringify({authenticated:false,offline:true}),{status:200,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});
  return new Response(JSON.stringify(Object.assign({},data,{offline:true})),{status:200,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});
}
async function offlineAllowed(){return !!(await offlineAuthData())}
function offlineDenied(){
  return new Response('<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Base Completa</title><body style="font:16px system-ui;padding:28px;background:#f3efe7;color:#312d29"><h1>Base Completa</h1><p>Não há uma sessão offline válida neste aparelho. Conecte-se à internet e entre novamente.</p></body></html>',{status:401,headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}});
}

var pauseOfflineUntil=0;
async function yieldToStudy(){while(Date.now()<pauseOfflineUntil)await new Promise(function(resolve){setTimeout(resolve,300)})}
async function prepareOffline(){
  try{
    var auth=await fetch('/api/auth?action=me',{cache:'no-store'});
    await cacheOfflineAuth(auth);
  }catch(_){}
  if(!(await offlineAllowed()))return;
  var cache=await caches.open(CACHE);
  try{
    var boot=await fetch(BOOT,{cache:'no-store'});
    if(boot&&boot.ok&&!boot.redirected)await cache.put(BOOT,boot.clone());
  }catch(_){}
  try{
    var response=await fetch(OFFLINE_MANIFEST,{cache:'no-store'});
    if(response&&response.ok&&!response.redirected){
      var manifestResponse=response.clone();
      var manifest=await response.json(),files=Array.isArray(manifest.files)?manifest.files:[];
      var index=0,saved=0,failed=[];
      async function worker(){
        while(index<files.length){
          await yieldToStudy();
          var url=files[index++];
          try{
            var asset=await fetch(url,{cache:'no-store'});
            if(asset&&asset.ok&&!asset.redirected){await cache.put(url,asset.clone());saved++}else failed.push(url+': HTTP '+asset.status);
          }catch(error){failed.push(url+': '+error.message)}
        }
      }
      await Promise.all([worker(),worker()]);
      await cache.put(OFFLINE_MANIFEST,manifestResponse);
      await cache.put(OFFLINE_READY,new Response(JSON.stringify({total:files.length,saved:saved,failed:failed.slice(0,10)})));
    }
  }catch(_){}
  await self.skipWaiting();
}

self.addEventListener('install',function(event){
  event.waitUntil(caches.open(CACHE).then(async function(cache){
    try{var boot=await fetch(BOOT,{cache:'no-store'});if(boot.ok&&!boot.redirected)await cache.put(BOOT,boot)}catch(_){}
    return self.skipWaiting();
  }))
});

self.addEventListener('activate',function(event){
  event.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(key){
        return key!==CACHE&&key!==AUTH_CACHE&&key.indexOf('central-')===0;
      }).map(function(key){return caches.delete(key)}));
    }).then(function(){return self.clients.claim()})
  );
});

self.addEventListener('fetch',function(event){
  var request=event.request,url=new URL(request.url);
  if(url.origin!==self.location.origin)return;

  if(url.pathname==='/api/auth'&&url.searchParams.get('action')==='me'&&request.method==='GET'){
    event.respondWith(fetch(request,{cache:'no-store'}).then(cacheOfflineAuth).catch(function(){return offlineAuthResponse()}));
    return;
  }

  if(url.pathname==='/api/auth'&&url.searchParams.get('action')==='logout'&&request.method==='POST'){
    event.respondWith((async function(){
      try{
        var response=await fetch(request);
        if(response&&response.ok)await clearOfflineAuth();
        return response;
      }catch(_){
        return new Response(JSON.stringify({error:'Sair da conta requer conexão com a internet'}),{status:503,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});
      }
    })());
    return;
  }

  if(request.method!=='GET'||url.pathname.startsWith('/api/'))return;

  if(request.mode==='navigate'&&(url.pathname==='/'||url.pathname==='/index.html'||url.pathname==='/central-v119.html')){
    event.respondWith(
      caches.open(CACHE).then(function(cache){
        var entry=new URL(request.url);entry.pathname=BOOT;entry.searchParams.delete('direct');
        return fetch(entry.href,{cache:'no-store'})
          .then(function(response){return cacheResponse(cache,BOOT,response)})
          .catch(async function(){return (await offlineAllowed())?(await cache.match(BOOT)||offlineDenied()):offlineDenied()})
      })
    );
    return;
  }

  if(/\.html$/.test(url.pathname)){
    event.respondWith(
      caches.open(CACHE).then(function(cache){
        return fetch(request,{cache:'no-store'})
          .then(function(response){return cacheResponse(cache,request,response)})
          .catch(async function(){
            if(publicPath(url.pathname))return (await cache.match(request))||Response.error();
            if(!(await offlineAllowed()))return offlineDenied();
            return (await cache.match(request))||(url.pathname==='/tools/decorando.html'?await cache.match(url.pathname):undefined)||Response.error();
          })
      })
    );
    return;
  }

  var dynamic=/\.(?:js|css|json|woff2?|png|webp|avif|ico|svg)$/.test(url.pathname)||/\.txt$/.test(url.pathname)||url.search;
  if(dynamic){
    event.respondWith(
      caches.open(CACHE).then(function(cache){
        return fetch(request,{cache:'no-store'})
          .then(function(response){return cacheResponse(cache,request,response)})
          .catch(async function(){
            if(!publicPath(url.pathname)&&!(await offlineAllowed()))return Response.error();
            return (await cache.match(request))||Response.error();
          })
      })
    );
  }
});

var offlineJob=null;
self.addEventListener('message',function(event){
  if(event.data&&event.data.type==='CLEAR_OFFLINE_AUTH'){event.waitUntil(clearOfflineAuth());return}
  if(event.data&&event.data.type==='PAUSE_OFFLINE'){pauseOfflineUntil=Date.now()+45000;return}
  if(event.data&&event.data.type==='RESUME_OFFLINE'){pauseOfflineUntil=0;return}
  if(event.data&&event.data.type==='PREPARE_OFFLINE')event.waitUntil(offlineJob||(offlineJob=caches.open(CACHE).then(function(cache){return cache.match(OFFLINE_READY)}).then(function(hit){if(!hit)return prepareOffline()}).finally(function(){offlineJob=null})))
});
