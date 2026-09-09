// v6.6.98 — atualizador leve do Service Worker.
(() => {
  'use strict';
  window.__CENTRAL_VERSION__ = '6.6.98';
  localStorage.removeItem('central_template_check_v2');
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistration().then((reg) => {
      if (!reg) return navigator.serviceWorker.register('./sw.js');
      return reg.update();
    }).catch(() => {});
  }
})();
