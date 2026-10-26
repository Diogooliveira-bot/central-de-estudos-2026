/* Ativação visual local: sem persistência, sem alteração de conteúdo ou progresso. */
(function () {
  'use strict';
  const overlays = '.bc-native-reader-overlay,.cf-native-overlay';
  const complete = /^(?:conteúdo|teoria)\s+(?:completo|completa)\b|^teoria\s+integral\b|(?:^|·)\s*complet[oa]\b/i;
  const summary = /^(?:conteúdo|teoria)\s+resumid[ao]\b|^primeira\s+leitura\b|^revis[aã]o\b|(?:^|·)\s*resumid[oa]\b/i;

  function readerSubject(overlay) {
    if (overlay.matches('.adm-native-overlay')) return 'adm';
    if (overlay.matches('.civil-native-overlay')) return 'civil';
    if (overlay.matches('.cpp-native-overlay')) return 'cpp';
    if (overlay.matches('.cf-native-overlay')) return 'cf';
    const id = String(overlay.id || '');
    if (/^cpc(?:M\d+)?NativeReaderOverlay$/i.test(id)) return 'cpc';
    if (/^bcNativeReaderOverlay(?:M\d+)?$/i.test(id)) return 'penal';
    return null;
  }
  function readerMode(overlay) {
    const marked = String(overlay.dataset.bcReadingMode || '').toLowerCase();
    if (marked === 'complete' || marked === 'summary') return marked;
    const subtitle = overlay.querySelector('.bc-native-reader-title small,.cf-native-shell > header small');
    const label = [subtitle?.textContent || '', overlay.querySelector('[role="dialog"]')?.getAttribute('aria-label') || '']
      .join(' ').replace(/\s+/g, ' ').trim();
    if (summary.test(label)) return 'summary';
    if (complete.test(label)) return 'complete';
    return null;
  }
  function eligible(overlay) {
    if (!overlay || overlay.nodeType !== 1 || overlay.matches('.pt-native-reader,.bc-rlm-overlay')) return false;
    return !!readerSubject(overlay) && readerMode(overlay) === 'complete';
  }
  function sync(overlay) { overlay?.classList.toggle('bc-apostila-v1', eligible(overlay)); }
  function scan(root) {
    if (root?.nodeType === 1 && root.matches(overlays)) sync(root);
    root?.querySelectorAll?.(overlays).forEach(sync);
  }
  scan(document);
  let scheduled = false;
  const defer = typeof queueMicrotask === 'function' ? queueMicrotask : callback => Promise.resolve().then(callback);
  const rescan = () => {
    if (scheduled) return;
    scheduled = true;
    defer(() => {
      scheduled = false;
      if (!document.documentElement) return;
      document.querySelectorAll(overlays).forEach(sync);
    });
  };
  new MutationObserver(rescan).observe(document.documentElement, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['class', 'id', 'data-bc-reading-mode', 'aria-label'] });
})();
