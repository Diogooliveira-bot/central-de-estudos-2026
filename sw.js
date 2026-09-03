/* Central de Estudos — service worker
   Shell cacheado para uso offline; páginas críticas do Anki usam rede primeiro quando houver conexão. */
var CACHE = 'central-v6688';
var SHELL = [
  './',
  './index.html',
  './sync-client.js?v=6679',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './central-updater-v6682.js?v=6682',
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

function injectAnkiTools(response) {
  if (!response) return response;
  return response.text().then(function (html) {
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

self.addEventListener('fetch', function (e) {
  var url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  if (url.pathname.startsWith('/api/')) return;

  var isMainDocument = url.pathname === '/' || url.pathname.endsWith('/index.html');
  var isAnkiPage = url.pathname.endsWith('/tools/anki.html');
  var isAnkiCritical = isAnkiPage || url.pathname.endsWith('/tools/anki-migrate-v6679.js') || url.pathname.endsWith('/tools/anki-deck-manager-v6685.js') || url.pathname.endsWith('/tools/anki-file-import-v6687.js') || url.pathname.endsWith('/tools/anki-deck-delete-fix-v6688.js');

  if (isAnkiCritical) {
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
    responsePromise = responsePromise.then(function (response) {
      if (!response) return response;
      return response.text().then(function (html) {
        if (html.indexOf('central-sync-v6679') < 0 && html.indexOf('sync-client.js?v=6679') < 0) {
          html = html.replace('</body>', '<script src="./sync-client.js?v=6679"></script></body>');
        }
        if (html.indexOf('central-updater-v6682.js') < 0) {
          html = html.replace('</body>', '<script src="./central-updater-v6682.js?v=6682"></script></body>');
        }
        var headers = new Headers(response.headers);
        headers.set('Content-Type', 'text/html; charset=utf-8');
        headers.delete('Content-Length');
        return new Response(html, { status: response.status, statusText: response.statusText, headers: headers });
      });
    });
  }
  e.respondWith(responsePromise);
});
