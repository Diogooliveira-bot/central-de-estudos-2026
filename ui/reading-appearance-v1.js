/* Base Completa — aparência de leitura. Preferências separadas do progresso. */
(function () {
  'use strict';
  if (window.__bcReadingAppearanceV1) return;
  window.__bcReadingAppearanceV1 = true;
  var KEY = 'base-completa:reading-appearance:v1';
  var MIN = 16, MAX = 26, DEFAULT = 18, pending = false, nextId = 0;
  var legacyTopic = null, legacyFontObserver = null;
  function normalize(value) {
    value = value || {};
    var size = Number(value.size);
    return {mode: value.mode === 'night' ? 'night' : 'paper', size: Number.isFinite(size) ? Math.max(MIN, Math.min(MAX, Math.round(size))) : DEFAULT};
  }
  function read() {
    try { return normalize(JSON.parse(localStorage.getItem(KEY) || 'null')); }
    catch (_) { return normalize(null); }
  }
  var preference = read();
  function setAttribute(element, name, value) {
    if (element.getAttribute(name) !== value) element.setAttribute(name, value);
  }
  function syncPreference() {
    setAttribute(document.documentElement, 'data-bc-reading-mode', preference.mode);
    var size = preference.size + 'px';
    if (document.documentElement.style.getPropertyValue('--bc-reading-size') !== size)
      document.documentElement.style.setProperty('--bc-reading-size', size);
    document.querySelectorAll('.bc-reading-appearance-controls').forEach(function (group) {
      group.querySelectorAll('[data-bc-reading-mode-choice]').forEach(function (button) {
        setAttribute(button, 'aria-pressed', String(button.dataset.bcReadingModeChoice === preference.mode));
      });
      var output = group.querySelector('output');
      if (output && output.textContent !== size) output.textContent = size;
      group.querySelector('[data-bc-reading-size="-1"]').disabled = preference.size <= MIN;
      group.querySelector('[data-bc-reading-size="1"]').disabled = preference.size >= MAX;
    });
  }
  function change(values) {
    preference = normalize({mode: values.mode || preference.mode, size: values.size == null ? preference.size : values.size});
    try { localStorage.setItem(KEY, JSON.stringify(preference)); } catch (_) {}
    syncPreference();
    schedule();
  }
  function controls() {
    var group = document.createElement('div');
    group.className = 'bc-reading-appearance-controls';
    group.setAttribute('role', 'group');
    group.setAttribute('aria-label', 'Aparência da leitura');
    group.innerHTML = '<button type="button" data-bc-reading-size="-1" aria-label="Diminuir fonte da leitura">A−</button><output aria-label="Tamanho da fonte"></output><button type="button" data-bc-reading-size="1" aria-label="Aumentar fonte da leitura">A+</button><span class="bc-reading-mode-options" role="group" aria-label="Cor da página"><button type="button" data-bc-reading-mode-choice="paper" aria-pressed="false">Papel</button><button type="button" data-bc-reading-mode-choice="night" aria-pressed="false">Noturno</button></span>';
    group.addEventListener('click', function (event) {
      var button = event.target.closest('button');
      if (!button || !group.contains(button)) return;
      if (button.dataset.bcReadingModeChoice) change({mode: button.dataset.bcReadingModeChoice});
      if (button.dataset.bcReadingSize) change({size: preference.size + Number(button.dataset.bcReadingSize)});
    });
    return group;
  }
  function mountNative(overlay) {
    if (overlay.classList.contains('bc-reading-appearance')) return;
    var tools = overlay.querySelector('.bc-native-reader-tools');
    if (!tools) return;
    overlay.classList.add('bc-reading-appearance');
    tools.querySelectorAll('[data-cpc-font],[data-native-action="smaller"],[data-native-action="larger"]').forEach(function (button) { button.hidden = true; button.classList.add('bc-reading-replaced-font'); });
    var toc = overlay.querySelector('.bc-native-toc');
    if (toc) {
      if (!toc.id) toc.id = 'bc-reading-chapters-' + (++nextId);
      var toggle = document.createElement('button');
      toggle.type = 'button'; toggle.textContent = 'Capítulos';
      toggle.className = 'bc-reading-chapters-toggle';
      toggle.setAttribute('aria-controls', toc.id); toggle.setAttribute('aria-expanded', 'false');
      toggle.addEventListener('click', function () {
        var open = !overlay.classList.contains('bc-reading-chapters-open');
        overlay.classList.toggle('bc-reading-chapters-open', open);
        toggle.setAttribute('aria-expanded', String(open));
      });
      tools.appendChild(toggle);
    }
    tools.appendChild(controls());
    var close = overlay.querySelector('.bc-native-reader-close');
    if (close) close.setAttribute('aria-label', 'Fechar leitura e voltar ao módulo');
    var search = tools.querySelector('input[type="search"]');
    if (search && !search.hasAttribute('aria-label')) search.setAttribute('aria-label', 'Buscar neste material');
  }
  function refresh() {
    pending = false;
    document.querySelectorAll('.bc-native-reader-overlay').forEach(mountNative);
    var legacy = document.documentElement.classList.contains('central-reading-fullscreen-v66124');
    var topic = legacy ? document.querySelector('.central-reading-active-topic') : null;
    if (topic !== legacyTopic) {
      if (legacyFontObserver) legacyFontObserver.disconnect();
      legacyTopic = topic;
      if (topic) {
        legacyFontObserver = new MutationObserver(schedule);
        legacyFontObserver.observe(topic, {subtree: true, attributes: true, attributeFilter: ['style']});
      }
    }
    if (topic) topic.querySelectorAll('p,li,.cf-theory-text').forEach(function (element) {
      var size = preference.size + 'px';
      if (element.style.getPropertyValue('font-size') !== size || element.style.getPropertyPriority('font-size') !== 'important')
        element.style.setProperty('font-size', size, 'important');
    });
    var bar = document.getElementById('bc-reading-legacy-controls');
    if (legacy && !bar) {
      bar = document.createElement('div'); bar.id = 'bc-reading-legacy-controls';
      bar.appendChild(controls()); document.body.appendChild(bar);
    }
    if (bar) bar.hidden = !legacy;
    var visible = legacy || !!document.querySelector('.bc-native-reader-overlay');
    if (document.documentElement.classList.contains('bc-reading-visible') !== visible)
      document.documentElement.classList.toggle('bc-reading-visible', visible);
    syncPreference();
  }
  function schedule() {
    if (!pending) { pending = true; requestAnimationFrame(refresh); }
  }
  function start() {
    refresh();
    new MutationObserver(schedule).observe(document.body, {childList: true, subtree: true});
    new MutationObserver(schedule).observe(document.documentElement, {attributes: true, attributeFilter: ['class']});
    document.addEventListener('click', function (event) {
      if (!event.target.closest('#centralSidebar .nav button')) return;
      document.querySelectorAll('.bc-native-reader-overlay .bc-native-reader-close').forEach(function (button) { button.click(); });
      if (window.CentralReadingFullscreen && window.CentralReadingFullscreen.active()) window.CentralReadingFullscreen.leave();
    }, true);
  }
  window.addEventListener('storage', function (event) { if (event.key === KEY || event.key === null) { preference = read(); syncPreference(); schedule(); } });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once: true});
  else start();
})();
