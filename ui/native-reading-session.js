/* Shared reader layout for ADM and CPP: loading, appearance and editing. */
(function (g) {
  'use strict';
  function create(options) {
    const overlay = document.createElement('div');
    overlay.id = options.id;
    overlay.className = 'bc-native-reader-overlay ' + options.subject + '-native-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    const prefix = options.subject + '-native';
    overlay.setAttribute('aria-labelledby', prefix + '-title');
    overlay.innerHTML = '<div class="bc-native-reader">' +
      '<header class="bc-native-reader-head"><div class="bc-native-reader-title"><b id="' + prefix + '-title"></b><small id="' + prefix + '-eyebrow"></small></div>' +
      '<button type="button" class="bc-native-reader-close" aria-label="Fechar leitura e voltar ao módulo">✕</button>' +
      '<div class="bc-native-reader-progress-track"><div id="' + prefix + '-reader-bar" class="bc-native-reader-progress"></div></div></header>' +
      '<div class="bc-native-reader-tools"><span id="' + prefix + '-reader-pct" class="bc-native-reader-meta">0% lido</span>' +
      '<button type="button" data-finish-reading>Concluir leitura</button></div>' +
      '<div class="bc-native-reader-body"><aside id="' + prefix + '-toc" class="bc-native-toc"></aside>' +
      '<main id="' + prefix + '-body" class="bc-native-scroll"></main></div></div>';
    overlay.querySelector('.bc-native-reader-title b').textContent = options.title;
    overlay.querySelector('.bc-native-reader-title small').textContent = options.eyebrow;
    overlay.querySelector('.bc-native-reader-close').onclick = options.close;
    overlay.querySelector('[data-finish-reading]').onclick = options.finish;
    overlay.querySelector('[data-finish-reading]').disabled = true;
    const body = overlay.querySelector('.bc-native-scroll');
    body.innerHTML = '<section class="central-discipline-loading" role="status" aria-live="polite" aria-busy="true">' +
      '<img src="/assets/base-completa-symbol.webp" alt="Logomarca Base Completa"><h3>Carregando sua leitura</h3>' +
      '<p>Preparando o material…</p><div class="loading-track" aria-hidden="true"><span></span></div></section>';
    document.body.appendChild(overlay);
    return overlay;
  }
  function show(overlay, html, toc, scroll, onScroll) {
    const body = overlay.querySelector('.bc-native-scroll');
    const article = document.createElement('article');
    article.className = 'bc-native-article ' + overlay.id.replace('-reader', '-content');
    article.innerHTML = html;
    body.replaceChildren(article);
    overlay.querySelector('.bc-native-toc').innerHTML = toc(body);
    overlay.querySelector('[data-finish-reading]').disabled = false;
    body.onscroll = onScroll;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (!overlay.isConnected) return;
      body.scrollTo({top: scroll, behavior: 'instant'});
      if (scroll > 0) onScroll();
    }));
    return body;
  }
  function fail(overlay, retry) {
    const status = overlay.querySelector('[role="status"]');
    if (!status) return;
    status.setAttribute('aria-busy', 'false');
    status.querySelector('h3').textContent = 'Não foi possível carregar a leitura';
    status.querySelector('p').textContent = 'Verifique sua conexão e tente novamente.';
    status.querySelector('.loading-track').remove();
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'btn primary'; button.textContent = 'Tentar novamente'; button.onclick = retry;
    status.appendChild(button);
  }
  function canTrack(overlay, body) {
    if (!overlay?.isConnected || overlay.hidden || !body?.clientHeight) return false;
    const article = body.querySelector('.bc-native-article');
    if (!article || article.isContentEditable) return false;
    // Never count reading in a hidden, unstyled or unconstrained container.
    return getComputedStyle(overlay).position === 'fixed' &&
      /auto|scroll/.test(getComputedStyle(body).overflowY) &&
      body.getBoundingClientRect().height <= window.innerHeight &&
      body.getBoundingClientRect().top >= 0 && body.getBoundingClientRect().bottom <= window.innerHeight + 1;
  }
  function percent(overlay, value) {
    overlay.querySelector('.bc-native-reader-progress').style.width = value + '%';
    overlay.querySelector('.bc-native-reader-meta').textContent = value + '% lido';
  }
  g.CentralNativeReadingSession = {create, show, fail, canTrack, percent};
})(window);
