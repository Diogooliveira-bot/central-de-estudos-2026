/* Base Completa — "Tamanho da tela": automático por aparelho, com ajuste manual (Normal / Maior / Muito maior).
   Tablet e celular (toque): amplia mudando a largura que o navegador usa para montar a página (meta viewport),
   o que mantém todas as unidades (vh, dvh, media queries) coerentes.
   Computador: amplia o CONTEÚDO das telas e o menu do topo (CSS "zoom" só nos filhos das telas, em ui/auto-scale-v1.css),
   sem mexer na altura da janela. Padrão: Automático (cresce com a largura da tela). */
(function (global) {
  'use strict';
  if (global.BCUiScale) return;
  var KEY = 'central-v6:ui-scale:v1';
  var BASE = 'width=device-width,initial-scale=1';
  var OPTIONS = [[0, 'Automático'], [1, 'Normal'], [1.15, 'Maior'], [1.3, 'Muito maior']];
  var lastOrientation = '';

  function isTouch() {
    try { return global.matchMedia('(pointer:coarse)').matches; } catch (_) { return false; }
  }
  function isTablet() {
    try {
      var shortSide = Math.min(global.screen.width, global.screen.height);
      return isTouch() && shortSide >= 700;
    } catch (_) { return false; }
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
  var round05 = function (n) { return Math.round(n * 20) / 20; };
  // Tablet: largura-alvo ~700 px CSS (820 → 1,15 · 1024 → 1,4). Celular: já foi desenhado para ele (1).
  function autoTouch() { return isTablet() ? Math.max(1, Math.min(1.4, round05(deviceWidth() / 700))) : 1; }
  // Computador: cresce a partir de 1100 px de largura até 1,35.
  function autoDesktop() { return Math.max(1, Math.min(1.35, round05(global.innerWidth / 1100))); }
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
  function applyTouch() {
    var node = meta();
    if (!node) return 1;
    var chosen = saved();
    var scale = chosen === 0 ? autoTouch() : chosen;
    var content = scale === 1 ? BASE : 'width=' + Math.round(deviceWidth() / scale) + ',initial-scale=1';
    if (node.getAttribute('content') !== content) node.setAttribute('content', content);
    return scale;
  }
  // Computador: --bc-zoom amplia o conteúdo das telas; o menu do topo cresce menos (cabem os 7 atalhos) e a altura dele acompanha.
  function applyDesktop() {
    var root = document.documentElement, chosen = saved();
    var z = chosen === 0 ? autoDesktop() : chosen;
    root.style.removeProperty('--bc-nav-height');
    if (z <= 1) {
      if (root.classList.contains('bc-zoom-on')) root.classList.remove('bc-zoom-on');
      ['--bc-zoom', '--bc-nav-zoom'].forEach(function (p) { root.style.removeProperty(p); });
      root.removeAttribute('data-bc-zoom');
      return 1;
    }
    var nav = document.getElementById('centralSidebar');
    var base = nav ? nav.offsetHeight : 0;
    var navZoom = 1 + (z - 1) * 0.55;
    root.style.setProperty('--bc-zoom', String(z));
    root.style.setProperty('--bc-nav-zoom', navZoom.toFixed(3));
    root.setAttribute('data-bc-zoom', String(z));
    // No modo leitura em tela cheia a Central zera a altura do menu: não sobrepor.
    if (base > 0 && !root.classList.contains('student-reader-active')) root.style.setProperty('--bc-nav-height', Math.round(base * navZoom) + 'px', 'important');
    if (!root.classList.contains('bc-zoom-on')) root.classList.add('bc-zoom-on');
    return z;
  }
  function apply() {
    var scale = isTouch() ? applyTouch() : applyDesktop();
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
    var body = document.querySelector('#centralSettingsBackdrop .central-settings-body');
    if (!body || document.getElementById('bcUiScale')) return;
    var block = document.createElement('section');
    block.id = 'bcUiScale';
    block.className = 'bc-ui-scale';
    block.setAttribute('aria-labelledby', 'bcUiScaleTitle');
    block.innerHTML = '<div><span class="bc-ui-scale-kicker">ESTE APARELHO</span>' +
      '<h3 id="bcUiScaleTitle">Tamanho da tela</h3>' +
      '<p>No Automático, textos e botões se ajustam sozinhos ao tamanho da tela (celular, tablet ou computador). Se algo ainda parecer pequeno, escolha Maior. Vale só neste aparelho.</p></div>' +
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
  // No computador a largura da janela muda sem girar o aparelho: reaplica (com pausa) ao redimensionar.
  var resizeTimer = 0;
  function onResize() {
    onOrientation();
    if (isTouch()) return;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(apply, 160);
  }
  global.addEventListener('orientationchange', function () { setTimeout(onOrientation, 120); });
  global.addEventListener('resize', onResize);
  // O menu do topo só existe depois da montagem da Central, e muda de altura ao entrar/sair da leitura em tela cheia.
  [600, 1500, 3500].forEach(function (ms) { setTimeout(apply, ms); });
  global.addEventListener('load', function () { setTimeout(apply, 200); });
  try {
    var lastReader = document.documentElement.classList.contains('student-reader-active');
    new MutationObserver(function () {
      var now = document.documentElement.classList.contains('student-reader-active');
      if (now !== lastReader) { lastReader = now; if (!isTouch()) apply(); }
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  } catch (_) { /* sem observador: vale a cada redimensionamento */ }
  document.addEventListener('click', function (event) {
    if (event.target.closest && event.target.closest('.nav-settings,.student-more-button,[data-central-native="settings"],[data-student-action="settings"]')) setTimeout(ensureControl, 80);
  }, true);

  lastOrientation = orientation();
  apply();
  setTimeout(ensureControl, 1200);
  global.BCUiScale = { set: set, get: saved, isTablet: isTablet, options: OPTIONS.map(function (o) { return o[0]; }) };
})(window);
