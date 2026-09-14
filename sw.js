/* Central de Estudos — v6.6.122 CPC M1 estrutura
   Offline não destrutivo: preserva a rota aberta e mantém uma cópia das ferramentas. */
var CACHE='central-v66122-cpc-m1-estrutura';
var BOOT='/central-v119.html?direct=4';
var STRUCTURAL_MANIFEST='/central-structural-files-v66119.json?v=66119s2';
var CORE=[
  BOOT,
  '/index.html',
  STRUCTURAL_MANIFEST,
  '/manifest.webmanifest',
  '/central-lazy-theory-v66119.js?v=66119p2',
  '/cpc-m1-apostila-v66121.js?v=66122a1',
  '/central-health-entry-v66119.js?v=66119s2',
  '/tools/anki.html',
  '/tools/decorando.html',
  '/tools/vade.html',
  '/tools/rlm.html',
  '/tools/cronograma.html',
  '/tools/progresso.html',
  '/tools/diagnostico.html'
];

function cacheResponse(cache,request,response){
  if(response&&response.ok)cache.put(request,response.clone()).catch(function(){});
  return response;
}

self.addEventListener('install',function(event){
  event.waitUntil(
    caches.open(CACHE).then(function(cache){
      return fetch(STRUCTURAL_MANIFEST,{cache:'no-store'}).then(function(response){
        if(!response||!response.ok)return [];
        return response.clone().json().then(function(data){return Array.isArray(data.files)?data.files:[]});
      }).catch(function(){return []}).then(function(extra){
        return Promise.all(CORE.concat(extra).map(function(url){
          return fetch(url,{cache:'no-store'}).then(function(response){
            if(response&&response.ok)return cache.put(url,response.clone());
          }).catch(function(){return null});
        }));
      });
    }).then(function(){return self.skipWaiting()})
  );
});

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
  var request=event.request;
  var url=new URL(request.url);
  if(request.method!=='GET'||url.origin!==self.location.origin||url.pathname.startsWith('/api/'))return;

  if(request.mode==='navigate'||/\.(?:html)$/.test(url.pathname)||url.pathname==='/'){
    event.respondWith(
      caches.open(CACHE).then(function(cache){
        return fetch(request,{cache:'no-store'}).then(function(response){
          return cacheResponse(cache,request,response);
        }).catch(function(){
          return cache.match(request).then(function(hit){
            if(hit)return hit;
            return cache.match(url.pathname).then(function(pathHit){
              if(pathHit)return pathHit;
              if(url.pathname==='/'||url.pathname==='/index.html'||url.pathname==='/central-v119.html')return cache.match(BOOT);
              return new Response('Esta página ainda não foi salva para uso offline.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});
            });
          });
        });
      })
    );
    return;
  }

  if(url.pathname==='/index.html'){
    event.respondWith(
      caches.open(CACHE).then(function(cache){
        return fetch(request,{cache:'no-store'}).then(function(response){
          if(response&&response.ok){
            cache.put('/index.html',response.clone()).catch(function(){});
            cache.put(request,response.clone()).catch(function(){});
          }
          return response;
        }).catch(function(){return cache.match(request).then(function(hit){return hit||cache.match('/index.html')})});
      })
    );
    return;
  }

  var versioned=/\?v=/.test(url.search)||/central-core|central-minimal|central-lazy-theory|central-health-entry|civil-theory|civil-decorando|central-civil-progress|central-progress-entry|central-updater|central-version|sync-client/.test(url.pathname);
  if(versioned){
    event.respondWith(
      caches.open(CACHE).then(function(cache){
        return cache.match(request).then(function(hit){
          if(hit)return hit;
          return fetch(request).then(function(response){return cacheResponse(cache,request,response)});
        });
      })
    );
  }
});
