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

  // Busca padrão: destaca todos os resultados e "Enter" avança para o próximo.
  // Penal mantém a própria busca; a do CPC (só o primeiro resultado) é trocada.
  function search(overlay, info) {
    let input = overlay.querySelector('.bc-native-reader-tools input[type="search"]');
    if (input?.dataset.bcStdSearch || (input && !(info.legacy && info.subject === 'cpc'))) return input;
    const fresh = document.createElement('input');
    fresh.type = 'search';
    fresh.placeholder = 'Buscar neste material…';
    fresh.setAttribute('aria-label', 'Buscar neste material');
    fresh.dataset.bcStdSearch = '1';
    if (input) {
      overlay.querySelector('.bc-native-article')?.querySelectorAll('mark.cpc-hit').forEach(m => m.replaceWith(document.createTextNode(m.textContent)));
      input.replaceWith(fresh);
    } else overlay.querySelector('.bc-native-reader-tools').appendChild(fresh);
    input = fresh;
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
  // Texto justificado: opção do aluno, guardada no aparelho e válida para todos
  // os leitores (teoria completa e revisão guiada).
  const JUSTIFY_KEY = 'base-completa:reading-justify:v1';
  let justify = false;
  try { justify = localStorage.getItem(JUSTIFY_KEY) === '1'; } catch (_) {}
  function applyJustify() {
    document.documentElement.classList.toggle('bc-reading-justify', justify);
    document.querySelectorAll('.bc-std-justify').forEach(b => {
      b.setAttribute('aria-pressed', String(justify));
      b.textContent = justify ? '☰ Justificado' : '☰ Justificar';
    });
  }
  function justifyButton(host) {
    if (!host || host.querySelector('.bc-std-justify')) return;
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'bc-std-justify';
    button.setAttribute('aria-label', 'Justificar o texto da leitura');
    button.addEventListener('click', () => {
      justify = !justify;
      try { localStorage.setItem(JUSTIFY_KEY, justify ? '1' : '0'); } catch (_) {}
      applyJustify();
    });
    host.appendChild(button);
    applyJustify();
  }

  function order(overlay) {
    const tools = overlay.querySelector('.bc-native-reader-tools');
    const pick = selector => tools.querySelector(selector);
    // "☰ Sumário" (leitor universal) duplica "Capítulos" quando os dois chegam.
    const universal = pick('[data-bc-universal-index]');
    if (universal && pick('.bc-reading-chapters-toggle')) universal.hidden = true;
    [pick('.bc-native-reader-meta'), pick('[data-finish-reading], .bc-std-finish'), pick('input[type="search"]'),
      pick('.bc-reading-chapters-toggle'), pick('.bc-reading-appearance-controls')]
      .filter(Boolean).forEach(element => tools.appendChild(element));
    justifyButton(tools);
    const justifyNode = pick('.bc-std-justify');
    if (justifyNode) tools.appendChild(justifyNode);
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
  // ADM: linhas de capa e anotações internas da apostila antes do 1º título
  // ("DIREITO ADMINISTRATIVOMÓDULO 01", "Apostila de estudo", título repetido,
  // "Modo: OFFLINE · não publicar"...). Orientações e fontes permanecem.
  const ADM_COVER = /^(?:DIREITO ADMINISTRATIVO|Apostila de estudo\b|ADM M\d+\b|Central de Estudos\b)|OFFLINE\b|n[ãa]o publica(?:r|do)|UID futuro|pacote offline|pronto para integra/i;
  const plain = text => String(text || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  function cleanAdmCover(article) {
    const h1 = article.querySelector(':scope > h1');
    if (!h1) return;
    const title = plain(h1.textContent);
    for (let node = h1.nextElementSibling, next; node && !/^H[1-6]$/.test(node.tagName); node = next) {
      next = node.nextElementSibling;
      if (node.tagName !== 'P') continue;
      const flat = document.createElement('span'); flat.innerHTML = node.innerHTML.replace(/<br\s*\/?>/gi, ' ');
      const whole = plain(flat.textContent);
      if (whole && (title === whole || title.startsWith(whole + ' '))) { node.remove(); continue; }
      const parts = node.innerHTML.split(/<br\s*\/?>/i).filter(part => {
        const holder = document.createElement('span'); holder.innerHTML = part;
        const text = holder.textContent.trim();
        return text && !ADM_COVER.test(text);
      });
      if (!parts.length) node.remove();
      else if (parts.length !== node.innerHTML.split(/<br\s*\/?>/i).length) node.innerHTML = parts.join('<br>');
    }
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
    if (info.subject === 'adm' && info.mode === 'complete' && !article.dataset.bcStdCover) {
      article.dataset.bcStdCover = '1';
      cleanAdmCover(article);
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
    search(overlay, info);
    intro(overlay, info);
    order(overlay);
  }

  const style = document.createElement('style');
  style.id = 'bc-reader-standard-v1';
  style.textContent =
    'html.bc-reading-justify :is(.bc-native-reader-overlay .bc-native-article,.bc-guided-overlay .bc-m01-paper) :is(p,li,dd,blockquote)' +
    '{text-align:justify;text-align-last:start;text-justify:inter-word;-webkit-hyphens:auto;hyphens:auto;overflow-wrap:break-word}' +
    '.bc-std-justify[aria-pressed=true]{border-color:#1d7f86;color:#0f6f75;background:rgba(29,127,134,.1)}' +
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
    document.querySelectorAll('.bc-guided-overlay .bc-m01-toolbar').forEach(justifyButton);
  }
  new MutationObserver(() => { if (!queued) { queued = true; requestAnimationFrame(() => requestAnimationFrame(scan)); } })
    .observe(document.documentElement, {childList: true, subtree: true});
  applyJustify();
  g.CentralReaderStandard = {standardize, identify};
})(window);
