/* Base Completa — leitura de apostilas PDF de Português M01–M24 e RLM M01–M15. */
(function (global) {
  'use strict';
  if (global.BaseApostilasPdf) return;
  var overlay = null, previousFocus = null, previousOverflow = '';
  var styleId = 'bc-apostilas-pdf-v1-style';

  function path(subject, module) {
    var num = Number(module);
    var isPt = subject === 'pt';
    if ((!isPt && subject !== 'rlm') || !Number.isInteger(num) || num < 1 || num > (isPt ? 24 : 15)) return null;
    var n = String(num).padStart(2, '0');
    return isPt ? '/apostilas/portugues/pt-m' + n + '.pdf' : '/apostilas/rlm/rlm-m' + n + '.pdf';
  }

  function ensureStyle() {
    if (document.getElementById(styleId)) return;
    var css = document.createElement('style');
    css.id = styleId;
    css.textContent = [
      '.bc-pdf-overlay{position:fixed;inset:0;z-index:2147483100;background:rgba(15,30,50,.76);display:flex;align-items:center;justify-content:center;padding:16px;font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif;}',
      '.bc-pdf-window{width:min(100%,1000px);height:min(96dvh,1100px);min-height:320px;display:flex;flex-direction:column;overflow:hidden;background:#fff;color:#1a3552;border:1px solid #cfdce9;border-radius:14px;box-shadow:0 24px 65px rgba(6,20,40,.3);}',
      '.bc-pdf-header{display:flex;align-items:center;gap:12px;padding:12px 16px;border-bottom:1px solid #dce5ee;background:#fff;}',
      '.bc-pdf-heading{flex:1;min-width:0}.bc-pdf-heading span{display:block;color:#617b96;text-transform:uppercase;letter-spacing:.07em;font-size:10px;font-weight:700}.bc-pdf-heading h2{margin:3px 0 0;font-size:clamp(15px,2vw,19px);font-weight:700;color:#193652;}',
      '.bc-pdf-actions{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.bc-pdf-actions a,.bc-pdf-actions button{display:inline-flex;align-items:center;justify-content:center;min-height:40px;padding:8px 12px;border:1px solid #bfd0e0;border-radius:8px;background:#fff;color:#244663;font:600 12px/1.4 inherit;cursor:pointer;text-decoration:none;}',
      '.bc-pdf-actions a:first-child{background:#18446b;color:#fff;border-color:#18446b}.bc-pdf-actions button:focus-visible,.bc-pdf-actions a:focus-visible{outline:3px solid #70a6dc;outline-offset:2px;}',
      '.bc-pdf-viewport{flex:1;min-height:0;background:#f0f4f8}.bc-pdf-viewport iframe{border:0;width:100%;height:100%;background:#f0f4f8;display:block}',
      '.bc-pdf-help{margin:0;padding:7px 16px;color:#5e7184;background:#f8fafc;font-size:11px;border-top:1px solid #e4eaf0;}',
      '@media(max-width:650px){.bc-pdf-overlay{padding:0}.bc-pdf-window{width:100%;height:100dvh;border:0;border-radius:0}.bc-pdf-header{padding:10px 12px;flex-wrap:wrap;gap:8px}.bc-pdf-actions{width:100%;justify-content:flex-start}.bc-pdf-actions a,.bc-pdf-actions button{font-size:12px;min-height:38px;padding:7px 10px}.bc-pdf-help{font-size:10px;padding:8px 12px}}'
    ].join('\n');
    document.head.appendChild(css);
  }

  function onKey(e) {
    if (!overlay) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key !== 'Tab') return;
    var focusables = Array.from(overlay.querySelectorAll('a[href],button:not([disabled])'));
    if (!focusables.length) return;
    if (e.shiftKey && document.activeElement === focusables[0]) {
      e.preventDefault(); focusables[focusables.length - 1].focus();
    } else if (!e.shiftKey && document.activeElement === focusables[focusables.length - 1]) {
      e.preventDefault(); focusables[0].focus();
    }
  }

  function close() {
    if (!overlay) return false;
    document.removeEventListener('keydown', onKey, true);
    overlay.remove();
    overlay = null;
    document.body.style.overflow = previousOverflow;
    if (previousFocus && previousFocus.isConnected) previousFocus.focus();
    return false;
  }

  function open(subject, module) {
    var pdf = path(subject, module);
    if (!pdf) return false;
    close(); ensureStyle();
    previousFocus = document.activeElement;
    previousOverflow = document.body.style.overflow;
    var name = subject === 'pt' ? 'Português' : 'Raciocínio Lógico-Matemático';
    var number = String(Number(module)).padStart(2, '0');
    var el = document.createElement('div');
    el.className = 'bc-pdf-overlay';
    el.innerHTML = '<section class="bc-pdf-window" role="dialog" aria-modal="true" aria-label="Apostila em PDF do módulo ' + number + '">' +
      '<header class="bc-pdf-header"><div class="bc-pdf-heading"><span>BASE COMPLETA / APOSTILA TEÓRICA</span><h2>' + name + ' · Módulo ' + number + '</h2></div>' +
      '<nav class="bc-pdf-actions" aria-label="Ações da apostila"><a data-bc-pdf-download download>Baixar PDF</a>' +
      '<a data-bc-pdf-new target="_blank" rel="noopener noreferrer">Abrir em outra aba</a>' +
      '<button type="button" data-bc-pdf-close>Voltar à Central</button></nav></header>' +
      '<div class="bc-pdf-viewport"><iframe title="Apostila em PDF" loading="eager"></iframe></div>' +
      '<p class="bc-pdf-help">Material de síntese didática. Se seu navegador não mostrar o PDF aqui, use “Abrir em outra aba”. O progresso oficial do curso não é alterado.</p></section>';
    el.querySelector('[data-bc-pdf-download]').href = pdf;
    el.querySelector('[data-bc-pdf-new]').href = pdf;
    el.querySelector('iframe').src = pdf + '#toolbar=1&navpanes=0';
    el.querySelector('[data-bc-pdf-close]').addEventListener('click', close);
    el.addEventListener('mousedown', function (e) { if (e.target === el) close(); });
    overlay = el;
    document.body.appendChild(el);
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey, true);
    el.querySelector('[data-bc-pdf-close]').focus();
    return false;
  }

  global.BaseApostilasPdf = Object.freeze({open: open, close: close, path: path});
})(window);
