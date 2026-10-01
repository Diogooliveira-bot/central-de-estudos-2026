/* Central de Estudos — cache completo dos arquivos usados na abertura da Central. */
var CACHE='central-v66172-correcoes2';
var BOOT='/central-v119.html?direct=34';
var OFFLINE_MANIFEST='/central-offline-files-v66172.json';
function cacheResponse(cache,request,response){if(response&&response.ok)cache.put(request,response.clone()).catch(function(){});return response}
async function prepareOffline(){
 var response=await fetch(OFFLINE_MANIFEST,{cache:'no-store'});
 if(!response.ok)throw new Error('Manifesto offline indisponível');
 var manifest=await response.clone().json(),files=manifest.files;
 if(manifest.build!=='66172-correcoes2'||!Array.isArray(files)||!files.length)throw new Error('Manifesto offline inválido');
 var cache=await caches.open(CACHE),index=0;
 await cache.put(OFFLINE_MANIFEST,response);
 async function worker(){
  while(index<files.length){
   var url=files[index++],asset=await fetch(url,{cache:'no-store'});
   if(!asset.ok)throw new Error('Arquivo offline indisponível: '+url);
   await cache.put(url,asset);
  }
 }
 await Promise.all([worker(),worker(),worker(),worker()]);
 await self.skipWaiting();
}
self.addEventListener('install',function(event){event.waitUntil(prepareOffline())});
self.addEventListener('activate',function(event){event.waitUntil(caches.keys().then(function(keys){return Promise.all(keys.filter(function(key){return key!==CACHE&&key.indexOf('central-')===0}).map(function(key){return caches.delete(key)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener('fetch',function(event){var request=event.request,url=new URL(request.url);if(request.method!=='GET'||url.origin!==self.location.origin||url.pathname.startsWith('/api/'))return;if(request.mode==='navigate'&&(url.pathname==='/'||url.pathname==='/index.html')){event.respondWith(caches.open(CACHE).then(function(cache){return fetch(BOOT,{cache:'no-store'}).then(function(response){return cacheResponse(cache,BOOT,response)}).catch(function(){return cache.match(BOOT)})}));return}if(request.mode==='navigate'||/\.(?:html)$/.test(url.pathname)){event.respondWith(caches.open(CACHE).then(function(cache){return fetch(request,{cache:'no-store'}).then(function(response){return cacheResponse(cache,request,response)}).catch(function(){return cache.match(request).then(function(hit){if(hit)return hit;return cache.match(url.pathname).then(function(pathHit){if(pathHit)return pathHit;if(url.pathname==='/central-v119.html')return cache.match(BOOT);return new Response('Esta página ainda não foi salva para uso offline.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}})})})})}));return}if(url.pathname==='/index.html'){event.respondWith(caches.open(CACHE).then(function(cache){return fetch(request,{cache:'no-store'}).then(function(response){if(response&&response.ok){cache.put('/index.html',response.clone()).catch(function(){});cache.put(request,response.clone()).catch(function(){})}return response}).catch(function(){return cache.match(request).then(function(hit){return hit||cache.match('/index.html')})})}));return}var versioned=/\.(?:js|css|woff2?|png|ico|svg)$/.test(url.pathname)||/\?v=/.test(url.search)||/central-core|central-minimal|central-lazy-theory|central-health-entry|civil-theory|civil-decorando|central-civil-progress|central-progress-entry|central-updater|central-version|sync-client|adm-m(?:[1-9]|1[0-9]|20)/.test(url.pathname);if(versioned){event.respondWith(caches.open(CACHE).then(function(cache){return cache.match(request).then(function(hit){if(hit)return hit;return fetch(request,{cache:'no-store'}).then(function(response){return cacheResponse(cache,request,response)})})}))}});
