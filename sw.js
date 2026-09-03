/* Central de Estudos — service worker
   Shell cacheado para uso offline; páginas críticas usam rede primeiro quando houver conexão. */
var CACHE = 'central-v6690';
var SHELL = [
  './',
  './index.html',
  './sync-client.js?v=6679',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './central-updater-v6690.js?v=6690',
  './tools/anki-migrate-v6679.js?v=6679',
  './tools/anki-deck-manager-v6685.js?v=6685',
  './tools/anki-file-import-v6687.js?v=6687',
  './tools/anki-deck-delete-fix-v6688.js?v=6688'
];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

function saveFresh(req, response) {
  if (response && response.ok) {
    var cp = response.clone();
    caches.open(CACHE).then(function (c) { c.put(req, cp); });
  }
  return response;
}

/*
 * O Anki original monta a lista de baralhos somando SOURCE.meta.decks,
 * baralhos personalizados e todos os cards, inclusive os suspensos.
 * Por isso um subbaralho excluído podia reaparecer mesmo sem cards ativos.
 * Desde a v6689 substituímos a função nativa allDecks() antes de entregar o HTML:
 * - respeita central-v6:anki-hidden-decks;
 * - ignora cards suspensos;
 * - oculta somente o caminho excluído e seus descendentes;
 * - preserva pai e irmãos ao excluir apenas um subbaralho.
 */
function patchAnkiNativeDecks(html) {
  var oldCode = "function allDecks(){const set=new Set([...(SOURCE.meta?.decks||[]),...customDecks()]);S.cards.forEach(c=>{if(c.deck)set.add(c.deck)});return [...set].filter(Boolean).sort((a,b)=>a.localeCompare(b,'pt-BR',{numeric:true}))}";
  var newCode = "function allDecks(){const hidden=(()=>{try{return JSON.parse(localStorage.getItem('central-v6:anki-hidden-decks')||'[]')}catch{return[]}})();const isHidden=d=>hidden.some(h=>String(d)===String(h)||String(d).startsWith(String(h)+'::'));const set=new Set([...(SOURCE.meta?.decks||[]),...customDecks()]);S.cards.forEach(c=>{if(c.deck&&!c.suspended)set.add(c.deck)});return [...set].filter(d=>d&&!isHidden(d)).sort((a,b)=>a.localeCompare(b,'pt-BR',{numeric:true}))}";

  if (html.indexOf(oldCode) >= 0) {
    html = html.replace(oldCode, newCode);
  }

  if (html.indexOf('central-native-deck-filter-v6689') < 0) {
    html = html.replace('</head>', '<meta name="central-native-deck-filter-v6689" content="1"></head>');
  }
  return html;
}

function injectAnkiTools(response) {
  if (!response) return response;
  return response.text().then(function (html) {
    html = patchAnkiNativeDecks(html);
    if (html.indexOf('anki-deck-manager-v6685.js') < 0) {
      html = html.replace('</body>', '<script src="./anki-deck-manager-v6685.js?v=6685"></script></body>');
    }
    if (html.indexOf('anki-file-import-v6687.js') < 0) {
      html = html.replace('</body>', '<script src="./anki-file-import-v6687.js?v=6687"></script></body>');
    }
    if (html.indexOf('anki-deck-delete-fix-v6688.js') < 0) {
      html = html.replace('</body>', '<script src="./anki-deck-delete-fix-v6688.js?v=6688"></script></body>');
    }
    var headers = new Headers(response.headers);
    headers.set('Content-Type', 'text/html; charset=utf-8');
    headers.delete('Content-Length');
    return new Response(html, { status: response.status, statusText: response.statusText, headers: headers });
  });
}

function injectMainTools(response) {
  if (!response) return response;
  return response.text().then(function (html) {
    if (html.indexOf('central-sync-v6679') < 0 && html.indexOf('sync-client.js?v=6679') < 0) {
      html = html.replace('</body>', '<script src="./sync-client.js?v=6679"></script></body>');
    }

    /* Remove qualquer atualizador antigo gravado no HTML antes de inserir o atual. */
    html = html.replace(/<script\b[^>]*\bsrc=["'][^"']*central-updater-v\d+\.js[^"']*["'][^>]*>\s*<\/script>/gi, '');
    if (html.indexOf('central-updater-v6690.js') < 0) {
      html = html.replace('</body>', '<script src="./central-updater-v6690.js?v=6690"></script></body>');
    }

    var headers = new Headers(response.headers);
    headers.set('Content-Type', 'text/html; charset=utf-8');
    headers.delete('Content-Length');
    return new Response(html, { status: response.status, statusText: response.statusText, headers: headers });
  });
}

self.addEventListener('fetch', function (e) {
  var url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  if (url.pathname.startsWith('/api/')) return;

  var isMainDocument = url.pathname === '/' || url.pathname.endsWith('/index.html');
  var isAnkiPage = url.pathname.endsWith('/tools/anki.html');
  var isUpdatePage = url.pathname.endsWith('/update-central.html');
  var isUpdaterScript = url.pathname.endsWith('/central-updater-v6690.js');
  var isAnkiCritical = isAnkiPage || url.pathname.endsWith('/tools/anki-migrate-v6679.js') || url.pathname.endsWith('/tools/anki-deck-manager-v6685.js') || url.pathname.endsWith('/tools/anki-file-import-v6687.js') || url.pathname.endsWith('/tools/anki-deck-delete-fix-v6688.js');
  var isNetworkFirstCritical = isAnkiCritical || isUpdatePage || isUpdaterScript;

  if (isNetworkFirstCritical) {
    e.respondWith(
      fetch(e.request).then(function (r) {
        if (isAnkiPage) {
          return injectAnkiTools(r).then(function (injected) { return saveFresh(e.request, injected); });
        }
        return saveFresh(e.request, r);
      }).catch(function () {
        return caches.match(e.request, { ignoreSearch: false }).then(function (hit) {
          if (isAnkiPage && hit) return injectAnkiTools(hit);
          return hit || caches.match('./index.html');
        });
      })
    );
    return;
  }

  var responsePromise = caches.match(e.request, { ignoreSearch: false }).then(function (hit) {
    if (hit) {
      fetch(e.request).then(function (r) { saveFresh(e.request, r); }).catch(function () {});
      return hit;
    }
    return fetch(e.request).then(function (r) { return saveFresh(e.request, r); }).catch(function () {
      return caches.match('./index.html');
    });
  });

  if (isMainDocument) {
    responsePromise = responsePromise.then(injectMainTools);
  }
  e.respondWith(responsePromise);
});
