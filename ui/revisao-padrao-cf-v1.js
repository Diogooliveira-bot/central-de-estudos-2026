/* Base Completa — "Revisão" no padrão visual do Direito Constitucional (apostila teórica).
   Só marca o leitor aberto; todo o desenho está em revisao-padrao-cf-v1.css. Não altera conteúdo nem progresso. */
(function (global) {
  'use strict';
  if (global.BCRevisaoPadraoCF) return;
  const CLASS = 'bc-rev-cf';
  const READERS = '.bc-native-reader-overlay,#centralPortugueseReader';
  function isReview(overlay) {
    const label = overlay.querySelector('.bc-native-reader-title small,.bc-native-reader-head small,.pt-doc-eyebrow')?.textContent || '';
    return /revis|resumid/i.test(label);
  }
  function mark(root) {
    const list = root.matches?.(READERS) ? [root] : [...(root.querySelectorAll?.(READERS) || [])];
    list.forEach(el => {
      const on = isReview(el);
      if (on !== el.classList.contains(CLASS)) el.classList.toggle(CLASS, on);
    });
  }
  function start() {
    mark(document.body);
    new MutationObserver(records => {
      for (const r of records) {
        r.addedNodes.forEach(n => { if (n.nodeType === 1) mark(n); });
        if (r.type === 'characterData' || r.type === 'attributes') { const o = r.target.parentElement?.closest?.(READERS); if (o) mark(o); }
      }
    }).observe(document.body, { childList: true, subtree: true });
  }
  global.BCRevisaoPadraoCF = { mark };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})(window);
