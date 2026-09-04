/* Central de Estudos — service worker v6.6.96 */
var CACHE='central-v6696';
var SHELL=[
 './','./index.html','./sync-client.js?v=6679','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png',
 './central-updater-v6696.js?v=6696','./central-version-v6696.js?v=6696',
 './tools/anki-migrate-v6696.js?v=6696','./tools/anki-deck-manager-v6685.js?v=6685','./tools/anki-file-import-v6687.js?v=6687','./tools/anki-subdeck-delete-v6696.js?v=6696'
];

self.addEventListener('install',function(e){e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(SHELL)}).then(function(){return self.skipWaiting()}))});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(keys){return Promise.all(keys.filter(function(k){return k!==CACHE}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
function saveFresh(req,r){if(r&&r.ok){var cp=r.clone();caches.open(CACHE).then(function(c){c.put(req,cp)}).catch(function(){})}return r}

function patchAnkiNativeDecks(html){
 var oldCode="function allDecks(){const set=new Set([...(SOURCE.meta?.decks||[]),...customDecks()]);S.cards.forEach(c=>{if(c.deck)set.add(c.deck)});return [...set].filter(Boolean).sort((a,b)=>a.localeCompare(b,'pt-BR',{numeric:true}))}";
 var newCode="function allDecks(){const hidden=(()=>{try{const v=JSON.parse(localStorage.getItem('central-v6:anki-hidden-decks')||'[]');return Array.isArray(v)?v:[]}catch{return[]}})();const norm=x=>String(x||'').trim().toLocaleLowerCase('pt-BR');const isHidden=d=>hidden.some(h=>{const a=norm(d),b=norm(h);return b&&(a===b||a.startsWith(b+'::'))});const set=new Set([...(SOURCE.meta?.decks||[]),...customDecks()]);S.cards.forEach(c=>{if(c.deck&&!c.suspended&&!isHidden(c.deck))set.add(c.deck)});return [...set].filter(d=>d&&!isHidden(d)).sort((a,b)=>a.localeCompare(b,'pt-BR',{numeric:true}))}";
 var patched=html.indexOf(oldCode)>=0;if(patched)html=html.replace(oldCode,newCode);
 html=html.replace('</head>','<meta name="central-native-deck-filter-v6696" content="'+(patched?'patched':'not-found')+'"></head>');
 return html;
}

function injectAnki(response){
 if(!response)return response;
 return response.text().then(function(html){
  html=patchAnkiNativeDecks(html);
  html=html.replace(/<script\b[^>]*\bsrc=["'][^"']*anki-migrate-v\d+\.js[^"']*["'][^>]*>\s*<\/script>/gi,'');
  html=html.replace(/<script\b[^>]*\bsrc=["'][^"']*(?:anki-deck-delete(?:-fix)?|anki-subdeck-delete)-v\d+\.js[^"']*["'][^>]*>\s*<\/script>/gi,'');
  if(html.indexOf('anki-migrate-v6696.js')<0)html=html.replace('</body>','<script src="./anki-migrate-v6696.js?v=6696"></script></body>');
  if(html.indexOf('anki-deck-manager-v6685.js')<0)html=html.replace('</body>','<script src="./anki-deck-manager-v6685.js?v=6685"></script></body>');
  if(html.indexOf('anki-file-import-v6687.js')<0)html=html.replace('</body>','<script src="./anki-file-import-v6687.js?v=6687"></script></body>');
  if(html.indexOf('anki-subdeck-delete-v6696.js')<0)html=html.replace('</body>','<script src="./anki-subdeck-delete-v6696.js?v=6696"></script></body>');
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
  html=html.replace('</body>','<script src="./central-version-v6696.js?v=6696"></script><script src="./central-updater-v6696.js?v=6696"></script></body>');
  var h=new Headers(response.headers);h.set('Content-Type','text/html; charset=utf-8');h.delete('Content-Length');
  return new Response(html,{status:response.status,statusText:response.statusText,headers:h});
 })
}

self.addEventListener('fetch',function(e){
 var u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==location.origin||u.pathname.startsWith('/api/'))return;
 var main=u.pathname==='/'||u.pathname.endsWith('/index.html');
 var anki=u.pathname.endsWith('/tools/anki.html');
 var updater=u.pathname.endsWith('/update-central.html');
 var versioned=/\?v=\d+/.test(u.search)||/\/(?:central-updater|central-version)-v\d+\.js$/.test(u.pathname)||/\/tools\/(?:anki-migrate|anki-deck-manager|anki-file-import|anki-subdeck-delete)-v\d+\.js$/.test(u.pathname);

 if(updater){
  e.respondWith(fetch(e.request,{cache:'no-store'}).then(function(r){return saveFresh(e.request,r)}).catch(function(){return caches.match(e.request)}));return;
 }

 if(anki){
  e.respondWith(caches.match(e.request).then(function(hit){
   var bg=fetch(e.request).then(function(r){return saveFresh(e.request,r)}).catch(function(){return null});
   if(hit){e.waitUntil(bg);return injectAnki(hit)}
   return bg.then(function(r){return r?injectAnki(r):caches.match('./index.html')});
  }));return;
 }

 if(versioned){
  e.respondWith(caches.match(e.request).then(function(hit){
   if(hit)return hit;
   return fetch(e.request).then(function(r){return saveFresh(e.request,r)});
  }));return;
 }

 var p=caches.match(e.request).then(function(hit){if(hit){fetch(e.request).then(function(r){saveFresh(e.request,r)}).catch(function(){});return hit}return fetch(e.request).then(function(r){return saveFresh(e.request,r)}).catch(function(){return caches.match('./index.html')})});
 if(main)p=p.then(injectMain);e.respondWith(p);
});
