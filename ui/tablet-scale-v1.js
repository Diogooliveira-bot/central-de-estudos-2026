/* Responsive typography; saved option values remain compatible with v1. */
(function (global) {
  'use strict';
  if (global.BCUiScale) return;
  var KEY = 'central-v6:ui-scale:v1';
  var OPTIONS = [[0, 'Automático'], [1, 'Normal'], [1.15, 'Maior'], [1.3, 'Muito maior']];

  function isTouch() {
    try {
      return Boolean(global.matchMedia('(pointer:coarse)').matches ||
        global.matchMedia('(any-pointer:coarse)').matches ||
        Number(global.navigator && global.navigator.maxTouchPoints || 0) >= 2);
    } catch (_) { return Number(global.navigator && global.navigator.maxTouchPoints || 0) >= 2; }
  }
  // A viewport in "Versão para computador" pode ser maior que a tela física:
  // reconhecer o tablet pela tela (CSS px), não apenas por innerWidth.
  function isTablet() {
    try {
      var shortSide = Math.min(Number(global.screen.width), Number(global.screen.height));
      var longSide = Math.max(Number(global.screen.width), Number(global.screen.height));
      return isTouch() && shortSide >= 600 && shortSide <= 1400 && longSide >= 900;
    } catch (_) { return false; }
  }
  function tabletPortrait() {
    return Number(global.screen.height) >= Number(global.screen.width);
  }
  // 0 = Automático (padrão). Valores desconhecidos voltam ao Automático.
  function saved() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw == null) return 0;
      var value = Number(raw);
      return OPTIONS.some(function (o) { return o[0] === value; }) ? value : 0;
    } catch (_) { return 0; }
  }
  // One typography scale for every viewport, including overlays outside #appRoot.
  // Keep layout pixels and viewport geometry stable; rem text reflows naturally.
  var sessionChoice = null;
  var readSaved = saved;
  saved = function () { return sessionChoice === null ? readSaved() : sessionChoice; };
  function autoScale() {
    var width = global.innerWidth;
    // Tablets com navegador em "Versão para computador" usam viewport ampliado:
    // 1.1x (regra desktop) ainda deixa toda a interface pequena.
    if (isTablet()) return width >= 1200 ? 1.46 : width >= 900 ? 1.36 : 1.24;
    return width < 600 ? 1.0625 : width < 1100 ? 1.1 : width < 1800 ? 1.125 : 1.2;
  }
  function apply() {
    var root = document.documentElement, chosen = saved();
    var tablet = isTablet();
    root.classList.toggle('bc-tablet-device', tablet);
    root.classList.toggle('bc-tablet-portrait', tablet && tabletPortrait());
    var scale = chosen === 0 ? autoScale() : chosen;
    root.style.setProperty('--bc-ui-scale', String(scale));
    root.setAttribute('data-bc-ui-scale', String(scale));
    root.setAttribute('data-bc-ui-mode', chosen === 0 ? 'auto' : String(chosen));
    refreshControl();
  }
  function set(scale) {
    scale = Number(scale);
    if (!OPTIONS.some(function (o) { return o[0] === scale; })) scale = 0;
    sessionChoice = scale;
    try { localStorage.setItem(KEY, String(scale)); } catch (_) { /* session remains usable */ }
    apply();
  }

  // ---- controle em Configurações ----
  function refreshControl() {
    var current = saved();
    document.querySelectorAll('#bcUiScale [data-bc-ui-scale]').forEach(function (button) {
      var active = Number(button.getAttribute('data-bc-ui-scale')) === current;
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
      button.classList.toggle('is-active', active);
    });
  }
  function ensureControl() {
    var body = document.querySelector('#centralSettingsBackdrop .central-settings-body');
    if (!body || document.getElementById('bcUiScale')) return;
    var block = document.createElement('section');
    block.id = 'bcUiScale';
    block.className = 'bc-ui-scale';
    block.setAttribute('aria-labelledby', 'bcUiScaleTitle');
    block.innerHTML = '<div><span class="bc-ui-scale-kicker">ESTE APARELHO</span>' +
      '<h3 id="bcUiScaleTitle">Tamanho da tela</h3>' +
      '<p>No Automático, textos e botões se ajustam ao celular, tablet ou computador. Você também pode escolher um tamanho manual. Vale só neste aparelho.</p></div>' +
      '<div class="bc-ui-scale-options" role="group" aria-label="Tamanho da tela">' +
      OPTIONS.map(function (o) { return '<button type="button" data-bc-ui-scale="' + o[0] + '">' + o[1] + '</button>'; }).join('') +
      '</div>';
    block.addEventListener('click', function (event) {
      var button = event.target.closest && event.target.closest('[data-bc-ui-scale]');
      if (button) set(Number(button.getAttribute('data-bc-ui-scale')));
    });
    body.insertBefore(block, body.firstElementChild);
    refreshControl();
  }

  var resizeTimer = 0;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(apply, 80);
  }
  global.addEventListener('resize', onResize);
  global.addEventListener('orientationchange', onResize);
  global.addEventListener('pageshow', apply);
  global.addEventListener('storage', function (event) {
    if (event.key === KEY || event.key === null) { sessionChoice = null; apply(); }
  });
  document.addEventListener('click', function (event) {
    if (event.target.closest && event.target.closest('.nav-settings,.student-more-button,[data-central-native="settings"],[data-student-action="settings"]')) setTimeout(ensureControl, 80);
  }, true);
  apply();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ensureControl, {once:true});
  else ensureControl();
  global.BCUiScale = { set: set, get: saved, isTablet: isTablet, options: OPTIONS.map(function (o) { return o[0]; }) };
})(window);
