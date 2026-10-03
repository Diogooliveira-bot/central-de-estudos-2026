/* Central de Estudos — PWA cache repair 2026-10-03. */
var CACHE='central-20261003-cpc-m10-v1';
var BOOT='/central-v119.html';
var OFFLINE_MANIFEST='/central-offline-files-v66172.json?v=20261003cpcm10v1';

function cacheResponse(cache,request,response){
  if(response&&response.ok)cache.put(request,response.clone()).catch(function(){});
  return response;
}

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
      var index=0;
      async function worker(){
        while(index<files.length){
          var url=files[index++];
          try{
            var asset=await fetch(url,{cache:'no-store'});
            if(asset&&asset.ok)await cache.put(url,asset.clone());
          }catch(_){}
        }
      }
      await Promise.all([worker(),worker(),worker(),worker()]);
      await cache.put(OFFLINE_MANIFEST,manifestResponse);
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
          .then(function(response){return cacheResponse(cache,request,response)})
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
          .catch(function(){return cache.match(request)})
      })
    );
    return;
  }

  /* JS/CSS e assets versionados passam a ser network-first.
     O cache vira apenas fallback offline, evitando ficar preso em scripts antigos. */
  var dynamic=/\.(?:js|css|json|woff2?|png|ico|svg)$/.test(url.pathname)||/\.txt$/.test(url.pathname)||url.search;
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
self.addEventListener('message',function(event){if(event.data&&event.data.type==='PREPARE_OFFLINE')event.waitUntil(offlineJob||(offlineJob=caches.open(CACHE).then(function(cache){return cache.match(OFFLINE_MANIFEST)}).then(function(hit){if(!hit)return prepareOffline()}).finally(function(){offlineJob=null}))) });
