/* Base Completa — "Tamanho da tela" para tablets (opcional, escolha do aluno).
   Amplia a interface mudando a largura que o navegador usa para montar a página (meta viewport),
   o que mantém todas as unidades (vh, dvh, media queries) coerentes; não usa o CSS "zoom".
   Só aparece em aparelhos de toque com tela grande (>= 700 px no lado menor). Padrão: Normal. */
(function (global) {
  'use strict';
  if (global.BCUiScale) return;
  var KEY = 'central-v6:ui-scale:v1';
  var BASE = 'width=device-width,initial-scale=1';
  var OPTIONS = [[1, 'Normal'], [1.15, 'Maior'], [1.3, 'Muito maior']];
  var lastOrientation = '';

  function isTablet() {
    try {
      var coarse = global.matchMedia('(pointer:coarse)').matches;
      var shortSide = Math.min(global.screen.width, global.screen.height);
      return coarse && shortSide >= 700;
    } catch (_) { return false; }
  }
  function saved() {
    try {
      var value = Number(localStorage.getItem(KEY));
      return OPTIONS.some(function (o) { return o[0] === value; }) ? value : 1;
    } catch (_) { return 1; }
  }
  function meta() {
    var node = document.querySelector('meta[name="viewport"]');
    if (!node && document.head) {
      node = document.createElement('meta');
      node.setAttribute('name', 'viewport');
      document.head.appendChild(node);
    }
    return node;
  }
  function orientation() {
    try { return global.matchMedia('(orientation:portrait)').matches ? 'p' : 'l'; } catch (_) { return 'p'; }
  }
  // Largura do aparelho em px CSS na orientação atual (independe da escala já aplicada).
  function deviceWidth() {
    var a = global.screen.width, b = global.screen.height;
    return orientation() === 'p' ? Math.min(a, b) : Math.max(a, b);
  }
  function apply() {
    var node = meta();
    if (!node) return;
    var scale = isTablet() ? saved() : 1;
    var content = scale === 1 ? BASE : 'width=' + Math.round(deviceWidth() / scale) + ',initial-scale=1';
    if (node.getAttribute('content') !== content) node.setAttribute('content', content);
    document.documentElement.setAttribute('data-bc-ui-scale', String(scale));
    refreshControl();
  }
  function set(scale) {
    try { localStorage.setItem(KEY, String(scale)); } catch (_) { /* sem armazenamento: vale só nesta sessão */ }
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
    if (!isTablet()) return;
    var body = document.querySelector('#centralSettingsBackdrop .central-settings-body');
    if (!body || document.getElementById('bcUiScale')) return;
    var block = document.createElement('section');
    block.id = 'bcUiScale';
    block.className = 'bc-ui-scale';
    block.setAttribute('aria-labelledby', 'bcUiScaleTitle');
    block.innerHTML = '<div><span class="bc-ui-scale-kicker">ESTE APARELHO</span>' +
      '<h3 id="bcUiScaleTitle">Tamanho da tela</h3>' +
      '<p>Aumenta textos e botões quando a tela do tablet parecer pequena. Vale só neste aparelho.</p></div>' +
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

  // Reaplica ao girar o aparelho (a largura em px CSS muda) e quando as Configurações são abertas.
  function onOrientation() {
    var now = orientation();
    if (now !== lastOrientation) { lastOrientation = now; apply(); }
  }
  global.addEventListener('orientationchange', function () { setTimeout(onOrientation, 120); });
  global.addEventListener('resize', onOrientation);
  document.addEventListener('click', function (event) {
    if (event.target.closest && event.target.closest('.nav-settings,.student-more-button,[data-central-native="settings"],[data-student-action="settings"]')) setTimeout(ensureControl, 80);
  }, true);

  lastOrientation = orientation();
  apply();
  setTimeout(ensureControl, 1200);
  global.BCUiScale = { set: set, get: saved, isTablet: isTablet, options: OPTIONS.map(function (o) { return o[0]; }) };
})(window);
