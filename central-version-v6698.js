// v6.6.98 — ajustes estruturais da Central.
// Preserva integralmente conteúdo didático, questões, Anki, Decorando e histórico.
window.__CENTRAL_VERSION__ = '6.6.98';
localStorage.removeItem('central_template_check_v2');
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistration().then(function (reg) {
    if (reg) reg.update().catch(function () {});
  }).catch(function () {});
}
