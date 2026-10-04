/* Visual aprovado da Base Completa. Não altera dados, progresso ou ações nativas. */
(function () {
  'use strict';
  if (window.__bcHomeTopnavV1) return;
  window.__bcHomeTopnavV1 = true;
  var queued = false;
  var book = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 6C9 3 5 3 2 4v15c3-1 7-1 10 2 3-3 7-3 10-2V4c-3-1-7-1-10 2Z"/><path d="M12 6v15"/></svg>';
  function decorate() {
    var home = document.getElementById('homeView');
    var sidebar = document.getElementById('centralSidebar');
    if (!home || !sidebar) return;
    document.documentElement.classList.add('bc-topnav');
    sidebar.setAttribute('aria-label', 'Menu principal');
    var nav = sidebar.querySelector('.nav');
    if (nav) { nav.setAttribute('role', 'navigation'); nav.setAttribute('aria-label', 'Navegação principal'); }
    home.querySelectorAll('#subjects > .subject[data-id]').forEach(function (subject) {
      var head = subject.querySelector('.subject-head');
      if (!head) return;
      if (!head.querySelector('.bc-row-icon')) {
        var icon = document.createElement('span');
        icon.className = 'bc-row-icon';
        icon.setAttribute('aria-hidden', 'true');
        icon.innerHTML = book;
        head.insertBefore(icon, head.firstChild);
      }
      var count = head.querySelector('.subject-count');
      var meta = head.querySelector('.bc-row-meta');
      if (!meta) { meta = document.createElement('span'); meta.className = 'bc-row-meta'; head.appendChild(meta); }
      var nativeCount = count ? count.textContent.trim() : '';
      var total = nativeCount.match(/\/(\d+)/);
      var text = total ? total[1] + ' módulos' : nativeCount;
      if (meta.textContent !== text) meta.textContent = text;
      if (!head.querySelector('.bc-row-track')) {
        var track = document.createElement('span');
        track.className = 'bc-row-track'; track.setAttribute('aria-hidden', 'true');
        track.appendChild(document.createElement('span')); head.appendChild(track);
      }
      var pct = head.querySelector('.subject-pct');
      var match = pct && pct.textContent.match(/(\d+(?:[.,]\d+)?)\s*%/);
      var value = match ? Math.max(0, Math.min(100, Number(match[1].replace(',', '.')))) : 0;
      if (subject.style.getPropertyValue('--bc-pct') !== String(value)) subject.style.setProperty('--bc-pct', String(value));
    });
  }
  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(function () { queued = false; decorate(); });
  }
  function init() {
    decorate();
    var host = document.getElementById('subjects');
    if (host) new MutationObserver(schedule).observe(host, { childList: true, subtree: true, characterData: true });
    window.addEventListener('storage', schedule);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
