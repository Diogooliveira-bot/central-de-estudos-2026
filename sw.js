/* Central de Estudos — service worker v6.6.93 */
var CACHE='central-v6693';
var SHELL=[
 './','./index.html','./sync-client.js?v=6679','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png',
 './central-updater-v6693.js?v=6693','./central-version-v6693.js?v=6693',
 './tools/anki-migrate-v6679.js?v=6679','./tools/anki-deck-manager-v6685.js?v=6685','./tools/anki-file-import-v6687.js?v=6687','./tools/anki-subdeck-delete-v6693.js?v=6693'
];

self.addEventListener('install',function(e){e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(SHELL)}).then(function(){return self.skipWaiting()}))});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(keys){return Promise.all(keys.filter(function(k){return k!==CACHE}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});

function saveFresh(req,r){if(r&&r.ok){var cp=r.clone();caches.open(CACHE).then(function(c){c.put(req,cp)}).catch(function(){})}return r}

function injectAnki(response){
 if(!response)return response;
 return response.text().then(function(html){
  /* Remove qualquer tentativa antiga de exclusão para existir um único fluxo. */
  html=html.replace(/<script\b[^>]*\bsrc=["'][^"']*(?:anki-deck-delete(?:-fix)?|anki-subdeck-delete)-v\d+\.js[^"']*["'][^>]*>\s*<\/script>/gi,'');
  if(html.indexOf('anki-deck-manager-v6685.js')<0)html=html.replace('</body>','<script src="./anki-deck-manager-v6685.js?v=6685"></script></body>');
  if(html.indexOf('anki-file-import-v6687.js')<0)html=html.replace('</body>','<script src="./anki-file-import-v6687.js?v=6687"></script></body>');
  if(html.indexOf('anki-subdeck-delete-v6693.js')<0)html=html.replace('</body>','<script src="./anki-subdeck-delete-v6693.js?v=6693"></script></body>');
  var h=new Headers(response.headers);h.set('Content-Type','text/html; charset=utf-8');h.delete('Content-Length');
  return new Response(html,{status:response.status,statusText:response.statusText,headers:h});
 })
}

function injectMain(response){
 if(!response)return response;
 return response.text().then(function(html){
  if(html.indexOf('central-sync-v6679')<0&&html.indexOf('sync-client.js?v=6679')<0)html=html.replace('</body>','<script src="./sync-client.js?v=6679"></script></body>');
  html=html.replace(/<script\b[^>]*\bsrc=["'][^"']*central-updater-v\d+\.js[^"']*["'][^>]*>\s*<\/script>/gi,'');
  html=html.replace(/<script\b[^>]*\bsrc=["'][^"']*central-version-v\d+\.js[^"']*["'][^>]*>\s*<\/script>/gi,'');
  html=html.replace('</body>','<script src="./central-version-v6693.js?v=6693"></script><script src="./central-updater-v6693.js?v=6693"></script></body>');
  var h=new Headers(response.headers);h.set('Content-Type','text/html; charset=utf-8');h.delete('Content-Length');
  return new Response(html,{status:response.status,statusText:response.statusText,headers:h});
 })
}

self.addEventListener('fetch',function(e){
 var u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==location.origin||u.pathname.startsWith('/api/'))return;
 var main=u.pathname==='/'||u.pathname.endsWith('/index.html');
 var anki=u.pathname.endsWith('/tools/anki.html');
 var critical=anki||u.pathname.endsWith('/update-central.html')||u.pathname.endsWith('/central-updater-v6693.js')||u.pathname.endsWith('/central-version-v6693.js')||u.pathname.endsWith('/tools/anki-migrate-v6679.js')||u.pathname.endsWith('/tools/anki-deck-manager-v6685.js')||u.pathname.endsWith('/tools/anki-file-import-v6687.js')||u.pathname.endsWith('/tools/anki-subdeck-delete-v6693.js');
 if(critical){
  e.respondWith(fetch(e.request,{cache:'no-store'}).then(function(r){return anki?injectAnki(r).then(function(x){return saveFresh(e.request,x)}):saveFresh(e.request,r)}).catch(function(){return caches.match(e.request,{ignoreSearch:false}).then(function(hit){if(anki&&hit)return injectAnki(hit);return hit||caches.match('./index.html')})}));return;
 }
 var p=caches.match(e.request,{ignoreSearch:false}).then(function(hit){if(hit){fetch(e.request).then(function(r){saveFresh(e.request,r)}).catch(function(){});return hit}return fetch(e.request).then(function(r){return saveFresh(e.request,r)}).catch(function(){return caches.match('./index.html')})});
 if(main)p=p.then(injectMain);e.respondWith(p);
});
