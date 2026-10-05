/* Central de Estudos — PWA cache repair 2026-10-03. */
var CACHE='central-20261005-adm-native-v1';
var BOOT='/central-v119.html';
var OFFLINE_MANIFEST='/central-offline-files-v66172.json?v=20261005adm1';
var OFFLINE_READY='/central-offline-ready?v=20261005adm1';

function cacheResponse(cache,request,response){
  if(response&&response.ok)cache.put(request,response.clone()).catch(function(){});
  return response;
}

var pauseOfflineUntil=0;
async function yieldToStudy(){while(Date.now()<pauseOfflineUntil)await new Promise(function(resolve){setTimeout(resolve,300)})}
async function prepareOffline(){
  var cache=await caches.open(CACHE);
  try{
    var boot=await fetch(BOOT,{cache:'no-store'});
    if(boot&&boot.ok)await cache.put(BOOT,boot.clone());
  }catch(_){}
  try{
    var response=await fetch(OFFLINE_MANIFEST,{cache:'no-store'});
    if(response&&response.ok){
      var manifestResponse=response.clone();
      var manifest=await response.json(),files=Array.isArray(manifest.files)?manifest.files:[];
      var index=0,saved=0,failed=[];
      async function worker(){
        while(index<files.length){
          await yieldToStudy();
          var url=files[index++];
          try{
            var asset=await fetch(url,{cache:'no-store'});
            if(asset&&asset.ok){await cache.put(url,asset.clone());saved++;}else failed.push(url+': HTTP '+asset.status);
          }catch(error){failed.push(url+': '+error.message)}
        }
      }
      await Promise.all([worker(),worker()]);
      await cache.put(OFFLINE_MANIFEST,manifestResponse);
      await cache.put(OFFLINE_READY,new Response(JSON.stringify({total:files.length,saved,failed:failed.slice(0,10)})));
    }
  }catch(_){}
  await self.skipWaiting();
}

self.addEventListener('install',function(event){event.waitUntil(caches.open(CACHE).then(async function(cache){try{var boot=await fetch(BOOT,{cache:'no-store'});if(boot.ok)await cache.put(BOOT,boot)}catch(_){}return self.skipWaiting()}))});

self.addEventListener('activate',function(event){
  event.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(key){
        return key!==CACHE&&key.indexOf('central-')===0;
      }).map(function(key){return caches.delete(key)}));
    }).then(function(){return self.clients.claim()})
  );
});

self.addEventListener('fetch',function(event){
  var request=event.request,url=new URL(request.url);
  if(request.method!=='GET'||url.origin!==self.location.origin||url.pathname.startsWith('/api/'))return;

  /* Qualquer abertura da Central instalada usa sempre o boot atual,
     mesmo que o ícone antigo ainda tenha start_url ?direct=30. */
  if(request.mode==='navigate'&&(url.pathname==='/'||url.pathname==='/index.html'||url.pathname==='/central-v119.html')){
    event.respondWith(
      caches.open(CACHE).then(function(cache){
        var entry=new URL(request.url);entry.pathname=BOOT;entry.searchParams.delete('direct');
        return fetch(entry.href,{cache:'no-store'})
          .then(function(response){return cacheResponse(cache,BOOT,response)})
          .catch(function(){return cache.match(BOOT)})
      })
    );
    return;
  }

  if(/\.html$/.test(url.pathname)){
    event.respondWith(
      caches.open(CACHE).then(function(cache){
        return fetch(request,{cache:'no-store'})
          .then(function(response){return cacheResponse(cache,request,response)})
          .catch(function(){return cache.match(request).then(function(hit){return hit||(url.pathname==='/tools/decorando.html'?cache.match(url.pathname):undefined)})})
      })
    );
    return;
  }

  /* JS/CSS e assets versionados passam a ser network-first.
     O cache vira apenas fallback offline, evitando ficar preso em scripts antigos. */
  var dynamic=/\.(?:js|css|json|woff2?|png|webp|avif|ico|svg)$/.test(url.pathname)||/\.txt$/.test(url.pathname)||url.search;
  if(dynamic){
    event.respondWith(
      caches.open(CACHE).then(function(cache){
        return fetch(request,{cache:'no-store'})
          .then(function(response){return cacheResponse(cache,request,response)})
          .catch(function(){return cache.match(request).then(function(hit){return hit||Response.error()})})
      })
    );
  }
});

var offlineJob=null;
self.addEventListener('message',function(event){if(event.data?.type==='PAUSE_OFFLINE'){pauseOfflineUntil=Date.now()+45000;return;}if(event.data?.type==='RESUME_OFFLINE'){pauseOfflineUntil=0;return;}if(event.data&&event.data.type==='PREPARE_OFFLINE')event.waitUntil(offlineJob||(offlineJob=caches.open(CACHE).then(function(cache){return cache.match(OFFLINE_READY)}).then(function(hit){if(!hit)return prepareOffline()}).finally(function(){offlineJob=null}))) });

