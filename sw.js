/* Central de Estudos — service worker
   Cache-first no shell do app para abrir sem rede após a 1ª visita.
   Nomes de arquivo com ?v= são tratados como recursos distintos. */
var CACHE = 'central-v6678';
var SHELL = [
  './',
  './index.html',
  './sync-client.js?v=6678',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png'
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

self.addEventListener('fetch', function (e) {
  var url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  // APIs de backup nunca devem cair no cache/fallback HTML.
  if (url.pathname.startsWith('/api/')) return;
  var isMainDocument = url.pathname === '/' || url.pathname.endsWith('/index.html');
  var responsePromise =
    caches.match(e.request, { ignoreSearch: false }).then(function (hit) {
      if (hit) {
        // revalida em segundo plano
        fetch(e.request).then(function (r) { if (r && r.ok) caches.open(CACHE).then(function (c) { c.put(e.request, r); }); }).catch(function () {});
        return hit;
      }
      return fetch(e.request).then(function (r) {
        if (r && r.ok) { var cp = r.clone(); caches.open(CACHE).then(function (c) { c.put(e.request, cp); }); }
        return r;
      }).catch(function () {
        return caches.match('./index.html');
      });
    });
  if (isMainDocument) {
    responsePromise = responsePromise.then(function (response) {
      if (!response) return response;
      return response.text().then(function (html) {
        if (html.indexOf('central-sync-v6678') < 0 && html.indexOf('sync-client.js?v=6678') < 0) {
          html = html.replace('</body>', '<script src="./sync-client.js?v=6678"></script></body>');
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
