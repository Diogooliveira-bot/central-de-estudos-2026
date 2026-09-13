/* Central de Estudos — v6.6.119 performance hotfix
   Objetivo: preservar conteúdo/progresso e evitar reprocessar ~9 MB de HTML
   em toda navegação. O HTML principal transformado é montado uma vez por
   versão deste worker e depois reutilizado do cache.
*/
var CACHE='central-v66119-fast3';
var MAIN_CACHE_KEY='/__central_main_v66119_fast3';
var VISUAL_CSS='/central-minimal-theme-v66119.css?v=66119h3';
var VISUAL_JS='/central-minimal-ui-v66119.js?v=66119h3';

var SHELL=[
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './central-minimal-theme-v66119.css?v=66119h3',
  './central-minimal-ui-v66119.js?v=66119h3'
];

self.addEventListener('install',function(e){
  e.waitUntil(
    caches.open(CACHE).then(function(c){
      return Promise.all(SHELL.map(function(url){
        return fetch(url,{cache:'no-store'}).then(function(r){
          if(r&&r.ok)return c.put(url,r.clone());
        }).catch(function(){return null});
      }));
    }).then(function(){return self.skipWaiting();})
  );
});

self.addEventListener('activate',function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(k){
        return k!==CACHE&&k.indexOf('central-')===0;
      }).map(function(k){return caches.delete(k);}));
    }).then(function(){return self.clients.claim();})
  );
});

function responseFromHtml(response,html){
  var h=new Headers(response.headers);
  h.set('Content-Type','text/html; charset=utf-8');
  h.delete('Content-Length');
  h.set('Cache-Control','no-cache');
  return new Response(html,{status:response.status,statusText:response.statusText,headers:h});
}

function patchVisualHtml(html){
  html=html.replace(/<link\b[^>]*\bhref=["'][^"']*central-minimal(?:-theme)?-v\d+\.css[^"']*["'][^>]*>/gi,'');
  html=html.replace(/<script\b[^>]*\bsrc=["'][^"']*central-minimal(?:-ui)?-v\d+\.js[^"']*["'][^>]*>\s*<\/script>/gi,'');
  if(html.indexOf('</head>')>=0)html=html.replace('</head>','<link rel="stylesheet" href="'+VISUAL_CSS+'"></head>');
  if(html.indexOf('</body>')>=0)html=html.replace('</body>','<script defer src="'+VISUAL_JS+'"></script></body>');
  return html;
}

function injectVisual(response){
  return response.text().then(function(html){
    return responseFromHtml(response,patchVisualHtml(html));
  });
}

var CIVIL_SCRIPTS=[
 'civil-decorando-index-v1.js?v=1','central-civil-progress-v2.js?v=2','civil-theory-v66107.js?v=66107','civil-theory-module6-v66108.js?v=66108',
 'civil-theory-module7-part1-v66109.js?v=66109','civil-theory-module7-part2-v66109.js?v=66109','civil-theory-module7-part3-v66109.js?v=66109','civil-theory-module7-runtime-v66109.js?v=66109',
 'civil-theory-module8-part1-v66110.js?v=66110','civil-theory-module8-part2-v66110.js?v=66110','civil-theory-module8-part3-v66110.js?v=66110','civil-theory-module8-part4-v66110.js?v=66110','civil-theory-module8-part5-v66110.js?v=66110','civil-theory-module8-runtime-v66110.js?v=66110',
 'civil-theory-module9-part1-v66111.js?v=66111','civil-theory-module9-part2-v66111.js?v=66111','civil-theory-module9-part3-v66111.js?v=66111','civil-theory-module9-part4-v66111.js?v=66111','civil-theory-module9-runtime-v66111.js?v=66111',
 'civil-theory-module10-part1-v66112.js?v=66112','civil-theory-module10-part2-v66112.js?v=66112','civil-theory-module10-part3-v66112.js?v=66112','civil-theory-module11-posse-runtime-v66113.js?v=66113',
 'civil-theory-company-module10-part1-v66113.js?v=66113','civil-theory-company-module10-part2-v66113.js?v=66113','civil-theory-company-module10-part3-v66113.js?v=66113','civil-theory-company-module10-part4-v66113.js?v=66113','civil-theory-company-module10-part5-v66113.js?v=66113','civil-theory-company-module10-runtime-v66113.js?v=66113',
 'civil-theory-module12-part1-v66114.js?v=66114','civil-theory-module12-part2-v66114.js?v=66114','civil-theory-module12-part3-v66114.js?v=66114','civil-theory-module12-part4-v66114.js?v=66114','civil-theory-module12-part5-v66114.js?v=66114','civil-theory-module12-part6-v66114.js?v=66114','civil-theory-module12-runtime-v66114.js?v=66114',
 'civil-theory-module13-part1-v66115.js?v=66115','civil-theory-module13-part2-v66115.js?v=66115','civil-theory-module13-part3-v66115.js?v=66115','civil-theory-module13-part4-v66115.js?v=66115','civil-theory-module13-part5-v66115.js?v=66115','civil-theory-module13-runtime-v66115.js?v=66115',
 'civil-theory-module14-part1-v66116.js?v=66116','civil-theory-module14-part2-v66116.js?v=66116','civil-theory-module14-part3-v66116.js?v=66116','civil-theory-module14-part4-v66116.js?v=66116','civil-theory-module14-part5-v66116.js?v=66116','civil-theory-module14-part6-v66116.js?v=66116','civil-theory-module14-runtime-v66116.js?v=66116',
 'civil-theory-module15-part1-v66117.js?v=66117','civil-theory-module15-part2-v66117.js?v=66117','civil-theory-module15-part3-v66117.js?v=66117','civil-theory-module15-part4-v66117.js?v=66117','civil-theory-module15-part5-v66117.js?v=66117','civil-theory-module15-part6-v66117.js?v=66117','civil-theory-module15-runtime-v66117.js?v=66117',
 'civil-theory-audit-v66118.js?v=66118'
];

function injectMain(response){
  return response.text().then(function(html){
    if(html.indexOf('central-sync-v6679')<0&&html.indexOf('sync-client.js?v=66107')<0){
      html=html.replace('</body>','<script defer src="./sync-client.js?v=66107"></script></body>');
    }
    html=html.replace(/<script\b[^>]*\bsrc=["'][^"']*(?:central-updater|central-version)-v\d+\.js[^"']*["'][^>]*>\s*<\/script>/gi,'');
    html=html.replace(/<script\b[^>]*\bsrc=["'][^"']*central-progress-entry-v\d+\.js[^"']*["'][^>]*>\s*<\/script>/gi,'');
    html=html.replace(/<script\b[^>]*\bsrc=["'][^"']*civil-decorando-index-v\d+\.js[^"']*["'][^>]*>\s*<\/script>/gi,'');
    html=html.replace(/<script\b[^>]*\bsrc=["'][^"']*central-civil-progress-v\d+\.js[^"']*["'][^>]*>\s*<\/script>/gi,'');
    html=html.replace(/<script\b[^>]*\bsrc=["'][^"']*civil-theory(?:-company)?(?:-module\d+(?:-posse)?-(?:part\d+|runtime)|-module\d+|)-v\d+\.js[^"']*["'][^>]*>\s*<\/script>/gi,'');
    html=html.replace(/<script\b[^>]*\bsrc=["'][^"']*civil-theory-audit-v\d+\.js[^"']*["'][^>]*>\s*<\/script>/gi,'');
    var tags=CIVIL_SCRIPTS.map(function(src){return '<script defer src="./'+src+'"></script>';}).join('');
    tags+='<script defer src="./central-version-v66107.js?v=66119"></script><script defer src="./central-updater-v66107.js?v=66119"></script><script defer src="./central-progress-entry-v1.js?v=1"></script>';
    html=html.replace('</body>',tags+'</body>');
    html=patchVisualHtml(html);
    return responseFromHtml(response,html);
  });
}

function patchAnkiNativeDecks(html){
  var oldCode="function allDecks(){const set=new Set([...(SOURCE.meta?.decks||[]),...customDecks()]);S.cards.forEach(c=>{if(c.deck)set.add(c.deck)});return [...set].filter(Boolean).sort((a,b)=>a.localeCompare(b,'pt-BR',{numeric:true}))}";
  var newCode="function allDecks(){const hidden=(()=>{try{const v=JSON.parse(localStorage.getItem('central-v6:anki-hidden-decks')||'[]');return Array.isArray(v)?v:[]}catch{return[]}})();const norm=x=>String(x||'').trim().toLocaleLowerCase('pt-BR');const isHidden=d=>hidden.some(h=>{const a=norm(d),b=norm(h);return b&&(a===b||a.startsWith(b+'::'))});const set=new Set([...(SOURCE.meta?.decks||[]),...customDecks()]);S.cards.forEach(c=>{if(c.deck&&!c.suspended&&!isHidden(c.deck))set.add(c.deck)});return [...set].filter(d=>d&&!isHidden(d)).sort((a,b)=>a.localeCompare(b,'pt-BR',{numeric:true}))}";
  var patched=html.indexOf(oldCode)>=0;
  if(patched)html=html.replace(oldCode,newCode);
  html=html.replace('</head>','<meta name="central-native-deck-filter-v6697" content="'+(patched?'patched':'not-found')+'"></head>');
  return html;
}

function injectAnki(response){
  return response.text().then(function(html){
    html=patchAnkiNativeDecks(html);
    html=html.replace(/<script\b[^>]*\bsrc=["'][^"']*anki-migrate-v\d+\.js[^"']*["'][^>]*>\s*<\/script>/gi,'');
    html=html.replace(/<script\b[^>]*\bsrc=["'][^"']*anki-deck-manager-v\d+\.js[^"']*["'][^>]*>\s*<\/script>/gi,'');
    html=html.replace(/<script\b[^>]*\bsrc=["'][^"']*(?:anki-deck-delete(?:-fix)?|anki-subdeck-delete)-v\d+\.js[^"']*["'][^>]*>\s*<\/script>/gi,'');
    if(html.indexOf('anki-migrate-v6696.js')<0)html=html.replace('</body>','<script defer src="./anki-migrate-v6696.js?v=6696"></script></body>');
    if(html.indexOf('anki-deck-manager-v6697.js')<0)html=html.replace('</body>','<script defer src="./anki-deck-manager-v6697.js?v=6697"></script></body>');
    if(html.indexOf('anki-file-import-v6687.js')<0)html=html.replace('</body>','<script defer src="./anki-file-import-v6687.js?v=6687"></script></body>');
    if(html.indexOf('anki-subdeck-delete-v6696.js')<0)html=html.replace('</body>','<script defer src="./anki-subdeck-delete-v6696.js?v=6696"></script></body>');
    html=patchVisualHtml(html);
    return responseFromHtml(response,html);
  });
}

function putCache(req,r){
  if(r&&r.ok){
    var cp=r.clone();
    caches.open(CACHE).then(function(c){return c.put(req,cp);}).catch(function(){});
  }
  return r;
}

function networkFirst(req,transform){
  return fetch(req,{cache:'no-store'}).then(function(r){
    putCache(req,r);
    return transform?transform(r.clone()):r;
  }).catch(function(){
    return caches.match(req).then(function(hit){
      if(hit)return transform?transform(hit.clone()):hit;
      return Response.error();
    });
  });
}

/* O ponto central do hotfix: transforma o HTML principal só uma vez. */
function mainCached(){
  return caches.open(CACHE).then(function(c){
    return c.match(MAIN_CACHE_KEY).then(function(hit){
      if(hit)return hit;
      return fetch('/index.html?central_build=66119-fast3',{cache:'no-store'}).then(function(r){
        if(!r||!r.ok)throw new Error('Falha ao carregar index');
        return injectMain(r.clone()).then(function(out){
          c.put(MAIN_CACHE_KEY,out.clone()).catch(function(){});
          return out;
        });
      });
    });
  });
}

self.addEventListener('fetch',function(e){
  var u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==location.origin||u.pathname.startsWith('/api/'))return;

  var main=u.pathname==='/'||u.pathname.endsWith('/index.html');
  var anki=u.pathname.endsWith('/tools/anki.html');
  var updater=u.pathname.endsWith('/update-central.html');
  var toolHtml=u.pathname.startsWith('/tools/')&&u.pathname.endsWith('.html')&&!anki;
  var versioned=/\?v=/.test(u.search)||/central-minimal/.test(u.pathname)||/civil-theory|civil-decorando|central-civil-progress|central-progress-entry|central-updater|central-version/.test(u.pathname);

  if(main){e.respondWith(mainCached());return;}
  if(anki){e.respondWith(networkFirst(e.request,injectAnki));return;}
  if(toolHtml){e.respondWith(networkFirst(e.request,injectVisual));return;}
  if(updater){e.respondWith(networkFirst(e.request,null));return;}

  if(versioned){
    e.respondWith(caches.match(e.request).then(function(hit){
      if(hit)return hit;
      return fetch(e.request).then(function(r){return putCache(e.request,r);});
    }));
    return;
  }

  e.respondWith(caches.match(e.request).then(function(hit){
    if(hit){
      fetch(e.request).then(function(r){putCache(e.request,r);}).catch(function(){});
      return hit;
    }
    return fetch(e.request).then(function(r){return putCache(e.request,r);});
  }));
});
