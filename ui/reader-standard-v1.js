/* Base Completa — padrão único do leitor de teoria (modelo Administrativo).
   Cabeçalho "Título" + "DISCIPLINA · MÓDULO NN · TEORIA COMPLETA", barra
   "% lido · Concluir leitura · Buscar · Capítulos · aparência" e abertura com o
   título do módulo. Os motores de Penal e Processo Civil continuam os mesmos:
   o "% lido" vem dos capítulos que eles já marcam, sem migrar progresso salvo. */
(function (g) {
  'use strict';
  if (g.CentralReaderStandard) return;
  const NAMES = {
    adm: 'DIREITO ADMINISTRATIVO', civil: 'DIREITO CIVIL', cpp: 'DIREITO PROCESSUAL PENAL',
    cf: 'DIREITO CONSTITUCIONAL', penal: 'DIREITO PENAL', cpc: 'DIREITO PROCESSUAL CIVIL'
  };
  const pad = n => String(n).padStart(2, '0');

  // Leitores com motor próprio (capítulos com check) e leitores da sessão compartilhada.
  function identify(overlay) {
    const id = overlay.id || '';
    let match = id.match(/^bcNativeReaderOverlay(?:M(\d+))?$/);
    if (match) return {subject: 'penal', n: Number(match[1] || 1), legacy: true};
    match = id.match(/^cpc(?:M(\d+))?NativeReaderOverlay$/);
    if (match) return {subject: 'cpc', n: Number(match[1] || 1), legacy: true};
    match = id.match(/^(adm|civil|cpp|cf)-native-reader$/);
    if (match) return {subject: match[1], legacy: false};
    return null;
  }
  function modeOf(overlay) {
    const label = overlay.querySelector('.bc-native-reader-title small')?.textContent || '';
    return /resumid|revis/i.test(label) ? 'summary' : 'complete';
  }

  function header(overlay, info) {
    const title = overlay.querySelector('.bc-native-reader-title b');
    const eyebrow = overlay.querySelector('.bc-native-reader-title small');
    if (!title || !eyebrow) return;
    if (info.legacy) {
      title.textContent = title.textContent.replace(/^(?:PEN|CPC|CF)\s*M\d+\s*[—–-]\s*/i, '');
      eyebrow.textContent = NAMES[info.subject] + ' · MÓDULO ' + pad(info.n) + ' · ' +
        (info.mode === 'summary' ? 'VERSÃO DE REVISÃO' : 'TEORIA COMPLETA');
      overlay.querySelector('.bc-native-reader-head > .bc-native-reader-meta')?.remove();
    } else {
      eyebrow.textContent = eyebrow.textContent
        .replace(/·\s*(?:COMPLET[AO])\s*$/i, '· TEORIA COMPLETA')
        .replace(/·\s*(?:RESUMID[AO])\s*$/i, '· VERSÃO DE REVISÃO');
    }
  }

  // Capítulos do índice: base do "% lido" e do "Concluir leitura" nos motores próprios.
  function chapterChecks(overlay) {
    return [...overlay.querySelectorAll('.bc-native-toc [data-chapter-check], .bc-native-toc [data-cpc-chapter-check]')];
  }
  function legacyPercent(overlay) {
    const checks = chapterChecks(overlay);
    if (!checks.length) return 0;
    return Math.round(checks.filter(b => b.classList.contains('done')).length / checks.length * 100);
  }

  function search(overlay) {
    let input = overlay.querySelector('.bc-native-reader-tools input[type="search"]');
    if (input) return input;
    input = document.createElement('input');
    input.type = 'search';
    input.placeholder = 'Buscar neste material…';
    input.setAttribute('aria-label', 'Buscar neste material');
    let hits = [], index = -1;
    const clear = article => {
      article.querySelectorAll('mark.bc-std-hit').forEach(m => m.replaceWith(document.createTextNode(m.textContent)));
      article.normalize();
    };
    const run = () => {
      const article = overlay.querySelector('.bc-native-article');
      if (!article) return;
      clear(article); hits = []; index = -1;
      const term = input.value.trim().toLowerCase();
      if (term.length < 2) return;
      const walker = document.createTreeWalker(article, NodeFilter.SHOW_TEXT);
      const nodes = [];
      for (let node = walker.nextNode(); node; node = walker.nextNode()) nodes.push(node);
      nodes.forEach(node => {
        const text = node.nodeValue, lower = text.toLowerCase();
        let at = lower.indexOf(term);
        if (at < 0) return;
        const fragment = document.createDocumentFragment();
        let from = 0;
        while (at >= 0) {
          fragment.append(text.slice(from, at));
          const mark = document.createElement('mark');
          mark.className = 'bc-std-hit';
          mark.textContent = text.slice(at, at + term.length);
          fragment.append(mark); hits.push(mark);
          from = at + term.length; at = lower.indexOf(term, from);
        }
        fragment.append(text.slice(from));
        node.replaceWith(fragment);
      });
      next();
    };
    const next = () => {
      if (!hits.length) return;
      hits[index]?.classList.remove('current');
      index = (index + 1) % hits.length;
      hits[index].classList.add('current');
      hits[index].scrollIntoView({block: 'center'});
    };
    let timer = 0;
    input.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(run, 180); });
    input.addEventListener('keydown', event => { if (event.key === 'Enter') { event.preventDefault(); next(); } });
    overlay.querySelector('.bc-native-reader-tools').appendChild(input);
    return input;
  }

  function legacyTools(overlay) {
    const tools = overlay.querySelector('.bc-native-reader-tools');
    tools.querySelectorAll('[data-cpc-back], [data-cpc-top], [data-native-action="top"]').forEach(b => { b.hidden = true; });
    let pct = tools.querySelector('.bc-std-pct');
    if (!pct) {
      pct = document.createElement('span');
      pct.className = 'bc-native-reader-meta bc-std-pct';
      const finish = document.createElement('button');
      finish.type = 'button'; finish.textContent = 'Concluir leitura'; finish.className = 'bc-std-finish';
      finish.addEventListener('click', () => {
        chapterChecks(overlay).filter(b => !b.classList.contains('done')).forEach(b => b.click());
        update();
      });
      tools.prepend(pct, finish);
      const toc = overlay.querySelector('.bc-native-toc');
      if (toc) new MutationObserver(update).observe(toc, {subtree: true, childList: true, attributes: true, attributeFilter: ['class']});
    }
    function update() { pct.textContent = legacyPercent(overlay) + '% lido'; }
    update();
  }

  // Ordem fixa da barra, igual em todas as disciplinas.
  function order(overlay) {
    const tools = overlay.querySelector('.bc-native-reader-tools');
    const pick = selector => tools.querySelector(selector);
    // "☰ Sumário" (leitor universal) duplica "Capítulos" quando os dois chegam.
    const universal = pick('[data-bc-universal-index]');
    if (universal && pick('.bc-reading-chapters-toggle')) universal.hidden = true;
    [pick('.bc-native-reader-meta'), pick('[data-finish-reading], .bc-std-finish'), pick('input[type="search"]'),
      pick('.bc-reading-chapters-toggle'), pick('.bc-reading-appearance-controls')]
      .filter(Boolean).forEach(element => tools.appendChild(element));
  }

  // CPC M01–M07: capa do PDF (BASE COMPLETA, letras espaçadas) antes do 1º capítulo,
  // como o leitor de Penal já remove. Só sai o trecho com a marca da capa.
  function removeCover(article) {
    const nodes = [];
    for (let node = article.querySelector(':scope > h1')?.nextElementSibling; node && node.tagName !== 'H2'; node = node.nextElementSibling) {
      if (!node.matches('.bc-native-kicker, .lead, .bc-native-study-progress')) nodes.push(node);
    }
    const text = nodes.map(node => node.textContent).join(' ');
    if (/BASE COMPLETA|(?:\b\p{Lu} ){6,}/u.test(text)) nodes.forEach(node => node.remove());
  }
  function intro(overlay, info) {
    const article = overlay.querySelector('.bc-native-article');
    if (!article || article.querySelector('.bc-std-intro')) return;
    const first = article.firstElementChild;
    if (!first || first.matches('.central-discipline-loading')) return;
    if (info.legacy) {
      article.classList.add('bc-std-legacy-article');
      if (info.subject === 'cpc' && info.mode === 'complete') removeCover(article);
      return;
    }
    const title = overlay.querySelector('.bc-native-reader-title b')?.textContent || '';
    const key = text => String(text || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    const firstHeading = article.querySelector('h1');
    if (firstHeading && key(firstHeading.textContent) === key(title)) return;
    const block = document.createElement('header');
    block.className = 'bc-std-intro';
    block.innerHTML = '<h1></h1>';
    block.querySelector('h1').textContent = title;
    article.prepend(block);
  }

  function standardize(overlay) {
    const info = identify(overlay);
    if (!info || !overlay.querySelector('.bc-native-reader-tools')) return;
    info.mode = modeOf(overlay);
    overlay.classList.add('bc-std-reader');
    if (!overlay.dataset.bcStandard) {
      overlay.dataset.bcStandard = '1';
      header(overlay, info);
      if (info.legacy) legacyTools(overlay);
    }
    search(overlay);
    intro(overlay, info);
    order(overlay);
  }

  const style = document.createElement('style');
  style.id = 'bc-reader-standard-v1';
  style.textContent =
    '.bc-std-reader .bc-native-reader-tools [hidden]{display:none!important}' +
    '.bc-std-reader .bc-native-reader-tools input[type=search]{min-width:180px;max-width:280px;flex:1 1 200px}' +
    '.bc-std-reader .bc-std-legacy-article>.bc-native-kicker,.bc-std-reader .bc-std-legacy-article>.lead,' +
    '.bc-std-reader .bc-std-legacy-article>.bc-native-study-progress{display:none!important}' +
    '.bc-std-intro{margin:0 0 1.4em}.bc-std-intro p{margin:0 0 .4em;font:700 12px/1.4 system-ui,sans-serif;letter-spacing:.06em;color:var(--muted,#6b7c8a)}' +
    '.bc-std-intro h1{margin:0}mark.bc-std-hit{background:#ffe98a;color:inherit}mark.bc-std-hit.current{background:#ffb84d}';
  document.head.appendChild(style);

  let queued = false;
  function scan() {
    queued = false;
    document.querySelectorAll('.bc-native-reader-overlay').forEach(standardize);
  }
  new MutationObserver(() => { if (!queued) { queued = true; requestAnimationFrame(() => requestAnimationFrame(scan)); } })
    .observe(document.documentElement, {childList: true, subtree: true});
  g.CentralReaderStandard = {standardize, identify};
})(window);
