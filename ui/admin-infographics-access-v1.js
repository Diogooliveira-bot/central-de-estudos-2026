(function (global) {
  'use strict';
  if (global.__BC_ADMIN_INFOGRAPHICS_V1) return;
  global.__BC_ADMIN_INFOGRAPHICS_V1 = true;

  const root = document.documentElement;
  const cardSelector = [
    '.adm-cf-card-map', '.cf-study-map', '.cv-card-infographic',
    '[data-kind="infographic"]', '[data-kind="infografico"]',
    '.ptra-native-card:has([data-ptra-image])',
    '.bc-trabalho-infografico', '.reader-infographic', '.cf-native-map',
    '#adm-native-image-viewer', '#civil-native-image-viewer', '#cpp-native-image-viewer',
    '.ptra-native-image-viewer', '.ptra-native-overlay:has(.ptra-native-image-viewer)',
    '.cf-native-overlay:has(.cf-native-map)', '.bc-native-reader:has(.reader-infographic)',
    '[data-native-kind="mindmap"]'
  ].join(',');
  const clickableSelector = [
    'button[onclick*="openMap"]', 'button[onclick*="openImage"]',
    '[data-ptra-image]', 'a[href*="infograf" i]', 'a[download*="infograf" i]',
    'button[aria-label*="infograf" i]', 'img[src*="infograf" i]',
    'img[src*="infographic" i]', 'img[alt*="infograf" i]'
  ].join(',');
  let observer = null;

  function isAdmin() {
    return global.BASE_COMPLETA_USER?.role === 'admin' ||
      root.getAttribute('data-bc-role') === 'admin';
  }
  function labelOf(element) {
    return [
      element.getAttribute('aria-label'), element.getAttribute('title'),
      element.getAttribute('download'), element.getAttribute('href'),
      element.getAttribute('onclick'), element.getAttribute('src'),
      element.getAttribute('alt'), element.textContent
    ].filter(Boolean).join(' ');
  }
  function isVisualControl(element) {
    if (!(element instanceof Element)) return false;
    if (element.matches(cardSelector + ',' + clickableSelector)) return true;
    return /infograf|infographic|mapa\s+(?:mental|visual)|mindmap/i.test(labelOf(element)) &&
      /^(BUTTON|A|IMG|FIGURE)$/.test(element.tagName);
  }
  function targetFor(element) {
    return element.closest(cardSelector) ||
      element.closest('.adm-cf-card,.cf-study-card,.cv-standard-card,.ptra-native-card,figure') ||
      element;
  }
  function hideElement(element) {
    const target = targetFor(element);
    if (!target || target.dataset.bcAdminInfographicHidden === '1') return;
    target.dataset.bcAdminInfographicHidden = '1';
    target.dataset.bcAdminInfographicWasHidden = target.hidden ? '1' : '0';
    target.dataset.bcAdminInfographicAriaHidden = target.getAttribute('aria-hidden') || '';
    target.hidden = true;
    target.setAttribute('aria-hidden', 'true');
  }
  function restoreElements() {
    document.querySelectorAll('[data-bc-admin-infographic-hidden="1"]').forEach((element) => {
      delete element.dataset.bcAdminInfographicHidden;
      element.hidden = element.dataset.bcAdminInfographicWasHidden === '1';
      delete element.dataset.bcAdminInfographicWasHidden;
      const previousAria = element.dataset.bcAdminInfographicAriaHidden;
      if (previousAria) element.setAttribute('aria-hidden', previousAria);
      else element.removeAttribute('aria-hidden');
      delete element.dataset.bcAdminInfographicAriaHidden;
    });
  }
  function scan(node) {
    if (!(node instanceof Element || node instanceof Document)) return;
    const candidates = [];
    if (node instanceof Element && isVisualControl(node)) candidates.push(node);
    node.querySelectorAll?.(cardSelector + ',' + clickableSelector + ',button,a,[role="button"],figure').forEach((element) => {
      if (isVisualControl(element)) candidates.push(element);
    });
    candidates.forEach(hideElement);
  }
  function applyRole() {
    if (isAdmin()) {
      if (observer) observer.disconnect();
      restoreElements();
      return;
    }
    scan(document);
    if (!observer) {
      observer = new MutationObserver((records) => {
        records.forEach((record) => record.addedNodes.forEach((node) => {
          if (node instanceof Element) scan(node);
        }));
      });
      observer.observe(document.documentElement, { childList: true, subtree: true });
    }
  }
  document.addEventListener('base-completa-auth-ready', applyRole);
  document.addEventListener('click', (event) => {
    if (isAdmin()) return;
    const target = event.target instanceof Element ? event.target.closest('button,a,[role="button"],img') : null;
    if (!target || !isVisualControl(target)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  }, true);
  applyRole();
})(window);
