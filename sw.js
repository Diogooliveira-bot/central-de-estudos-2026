/* Central de Estudos — v6.6.119 stability 1
   Offline não destrutivo: preserva a rota aberta e mantém uma cópia das ferramentas. */
var CACHE='central-v66119-stability1';
var BOOT='/central-v119.html?direct=4';
var CORE=[BOOT,'/index.html','/manifest.webmanifest','/tools/anki.html','/tools/decorando.html','/tools/vade.html','/tools/rlm.html','/tools/cronograma.html','/tools/progresso.html'];
function cacheResponse(cache,request,response){if(response&&response.ok)cache.put(request,response.clone()).catch(function(){});return response}
self.addEventListener('install',function(event){event.waitUntil(caches.open(CACHE).then(function(cache){return Promise.all(CORE.map(function(url){return fetch(url,{cache:'no-store'}).then(function(response){if(response&&response.ok)return cache.put(url,response.clone())}).catch(function(){return null})}))}).then(function(){return self.skipWaiting()}))});
self.addEventListener('activate',function(event){event.waitUntil(caches.keys().then(function(keys){return Promise.all(keys.filter(function(key){return key!==CACHE&&key.indexOf('central-')===0}).map(function(key){return caches.delete(key)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener('fetch',function(event){
 var request=event.request,url=new URL(request.url);
 if(request.method!=='GET'||url.origin!==self.location.origin||url.pathname.startsWith('/api/'))return;
 if(request.mode==='navigate'||/\.(?:html)$/.test(url.pathname)||url.pathname==='/'){
  event.respondWith(caches.open(CACHE).then(function(cache){return fetch(request,{cache:'no-store'}).then(function(response){return cacheResponse(cache,request,response)}).catch(function(){return cache.match(request).then(function(hit){if(hit)return hit;return cache.match(url.pathname).then(function(pathHit){if(pathHit)return pathHit;if(url.pathname==='/'||url.pathname==='/index.html'||url.pathname==='/central-v119.html')return cache.match(BOOT);return new Response('Esta página ainda não foi salva para uso offline.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}})})})})}));
  return;
 }
 var versioned=/\?v=/.test(url.search)||/central-minimal|civil-theory|civil-decorando|central-civil-progress|central-progress-entry|central-updater|central-version|sync-client/.test(url.pathname);
 if(versioned){event.respondWith(caches.open(CACHE).then(function(cache){return cache.match(request).then(function(hit){if(hit)return hit;return fetch(request).then(function(response){return cacheResponse(cache,request,response)})})}))}
});
