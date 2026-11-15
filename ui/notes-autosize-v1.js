/* Base Completa — a caixa de Anotações do módulo só cresce conforme o texto escrito.
   Sem texto: poucas linhas; com texto: a altura acompanha o conteúdo (o aluno ainda pode arrastar para aumentar). */
(function (global) {
  'use strict';
  if (global.BCNotesAutosize) return;
  // Todas as caixas de "Anotações do módulo" (padrão, Constitucional, Administrativo, Civil, Penal, Português, Processo Civil…).
  const SELECTOR = '.ds-notes textarea,.cms-note-final textarea,.cf-native-note textarea,.adm-native-notes textarea,.cv-native-notes textarea,.cpp-native-notes textarea,.cv-panel textarea[id*="note"],.csp-note-label textarea,textarea[id^="cf-note-"],textarea[id^="cms-note-"],textarea[id^="csp-note-"],textarea[id^="ds-note-"]';
  function fit(area) {
    if (!area || area.dataset.bcManual === '1') return;
    area.style.height = 'auto';
    const lineHeight = parseFloat(getComputedStyle(area).lineHeight) || 22;
    const min = Math.round(lineHeight * 3 + 20);                      // ~3 linhas quando vazia
    const wanted = Math.max(min, area.scrollHeight + 2);
    area.style.height = Math.min(wanted, Math.round(global.innerHeight * 0.7)) + 'px';
    area.style.overflowY = wanted > global.innerHeight * 0.7 ? 'auto' : 'hidden';
  }
  function fitAll() { document.querySelectorAll(SELECTOR).forEach(fit); }
  let timer = 0;
  function later(ms) { clearTimeout(timer); timer = setTimeout(fitAll, ms); }
  document.addEventListener('input', e => { if (e.target.matches?.(SELECTOR)) fit(e.target); }, true);
  document.addEventListener('focusin', e => { if (e.target.matches?.(SELECTOR)) fit(e.target); }, true);
  // Quem arrasta a alça manualmente passa a mandar no tamanho daquela caixa.
  document.addEventListener('mouseup', e => { const a = e.target; if (a && a.matches?.(SELECTOR) && a.style.height && Math.abs(a.offsetHeight - parseFloat(a.style.height)) > 6) a.dataset.bcManual = '1'; }, true);
  document.addEventListener('click', () => later(350), true);
  document.addEventListener('central:discipline-ready', () => later(150));
  global.addEventListener('load', () => later(1200));
  global.BCNotesAutosize = { fit, fitAll };
})(window);
