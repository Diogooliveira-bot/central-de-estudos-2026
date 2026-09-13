/* Central de Estudos — v6.6.119 direct bootstrap
   Worker leve: não altera o HTML nem o progresso salvo no navegador. */
var CACHE='central-v66119-direct4';
var BOOT='/central-v119.html?direct=4';

self.addEventListener('install',function(event){
  event.waitUntil(
    caches.open(CACHE).then(function(cache){
      return fetch(BOOT,{cache:'no-store'}).then(function(response){
        if(response&&response.ok)return cache.put(BOOT,response.clone());
      }).catch(function(){return null});
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
      .then(function(){return self.clients.matchAll({type:'window',includeUncontrolled:true})})
      .then(function(clients){
        return Promise.all(clients.map(function(client){
          try{
            var url=new URL(client.url);
            if(url.origin===self.location.origin&&url.pathname!=='/central-v119.html'){
              return client.navigate(BOOT);
            }
          }catch(error){}
          return null;
        }));
      })
  );
});

self.addEventListener('fetch',function(event){
  var request=event.request;
  var url=new URL(request.url);
  if(request.method!=='GET'||url.origin!==self.location.origin||url.pathname.startsWith('/api/'))return;

  if(request.mode==='navigate'||url.pathname==='/index.html'){
    event.respondWith(
      fetch(request,{cache:'no-store'}).catch(function(){
        return caches.match(BOOT).then(function(hit){return hit||Response.error()});
      })
    );
    return;
  }

  var versioned=/\?v=/.test(url.search)||/central-minimal|civil-theory|civil-decorando|central-civil-progress|central-progress-entry|central-updater|central-version/.test(url.pathname);
  if(versioned){
    event.respondWith(
      caches.match(request).then(function(hit){
        if(hit)return hit;
        return fetch(request).then(function(response){
          if(response&&response.ok){
            var copy=response.clone();
            caches.open(CACHE).then(function(cache){return cache.put(request,copy)}).catch(function(){});
          }
          return response;
        });
      })
    );
  }
});
