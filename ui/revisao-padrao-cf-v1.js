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
  /* ---- Lei seca recolhível na Revisão (Administrativo, Penal e Processo Penal) ---------------------------
     Mesmo gesto do Constitucional: logo depois do assunto que cita o artigo, "▸ Ver lei seca — CP, art. 59 e mais 2",
     fechado. O vínculo é feito pelas citações do próprio texto ("CP, art. 59", "Constituição Federal — artigo 37").
     Usa os textos legais já existentes na Teoria completa; sem acesso a eles, nada aparece (sem erro). */
  // Arquivos por módulo, só com a redação oficial (liberados à Revisão do plano Gratuito).
  const LEI_DEFAULT = { penal: 'cp', cpp: 'cpp', adm: '' };
  const LEI_VERSION = '20261115rev1';
  const SHORT = { cf: 'CF/88', cp: 'CP', cpp: 'CPP' };
  const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const norm = t => String(t || '').replace(/\s+/g, ' ').trim();
  function identify(text) {
    const t = String(text || '').toUpperCase();
    const m = t.match(/DIREITO\s+(ADMINISTRATIVO|PROCESSUAL PENAL|PENAL)\s*[·•-]\s*M[ÓO]DULO\s*(\d{1,2})/);
    if (!m) return null;
    return { disc: m[1] === 'ADMINISTRATIVO' ? 'adm' : m[1] === 'PENAL' ? 'penal' : 'cpp', n: Number(m[2]) };
  }
  // Sinônimos com que o texto costuma chamar cada norma.
  function lawPattern(item) {
    const known = { cf: /constitui[çc][ãa]o|\bCF\b|\bCRFB\b/i, cp: /c[óo]digo penal|\bCP\b/i, cpp: /c[óo]digo de processo penal|\bCPP\b/i, cc: /c[óo]digo civil|\bCC\b/i, cpc: /c[óo]digo de processo civil|\bCPC\b/i };
    if (known[item.law]) return known[item.law];
    const digits = String(item.law).match(/\d+/);
    if (digits) { const d = digits[0]; const spaced = d.length > 3 ? d.slice(0, -3) + '\\.?' + d.slice(-3) : d; return new RegExp('(?<!\\d)' + spaced + '(?!\\d)'); }
    const name = norm(String(item.label).split(/\s[—-]\s|·/)[0]).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return name.length > 3 ? new RegExp(name, 'i') : null;
  }
  // Pares {pos, refs[]} para cada "art./arts./artigo(s)" do texto (inteiros, com sufixo -A etc.; ignora § e incisos).
  function articleCitations(text) {
    const out = [], re = /\bart(?:igos?|s?\.?)\s*((?:\d{1,4}(?:\.\d{3})?\s*[ºo°]?(?:\s*-\s*[A-Z])?(?:\s*(?:,|;|e|ou|a|ao|à|até|–|—|e\/ou)\s*(?:§\s*\d+\s*[ºo°]?\s*,?\s*|[IVXLC]{1,6}\s*,?\s*|(?:inc(?:iso)?s?\.?|par[áa]grafo|caput|al[íi]nea)\s*[a-zIVXLC0-9º°]*\s*,?\s*)*)?)+)/giu;
    let m;
    while ((m = re.exec(text))) {
      const refs = [];
      const nums = /(\d{1,4}(?:\.\d{3})?)\s*[ºo°]?(?:\s*-\s*([A-Z]))?/g;
      let x; const body = m[1];
      while ((x = nums.exec(body))) {
        const before = body.slice(Math.max(0, x.index - 2), x.index);
        if (/§\s*$/.test(before) || /§\s*\d*\s*$/.test(body.slice(0, x.index).slice(-6))) continue;
        refs.push(x[1].replace('.', '') + (x[2] ? '-' + x[2] : ''));
      }
      if (refs.length) out.push({ pos: m.index, end: m.index + m[0].length, refs });
    }
    return out;
  }
  // Quais dispositivos o texto de um bloco cita? defaultLaw: norma assumida quando só se diz "art. 59".
  function citedItems(text, items, defaultLaw) {
    const cites = articleCitations(text);
    if (!cites.length) return [];
    const pats = new Map();
    const result = [];
    items.forEach(item => {
      if (!pats.has(item.law)) pats.set(item.law, lawPattern(item));
      const pat = pats.get(item.law);
      const hit = cites.some(c => {
        if (!c.refs.includes(String(item.ref).replace(/^0+/, ''))) return false;
        const before = text.slice(Math.max(0, c.pos - 90), c.pos), after = text.slice(c.end, c.end + 70);
        if (pat) {
          // mesma norma citada logo antes ("CP, art. 59") ou logo depois ("art. 59 do Código Penal")
          if (new RegExp(pat.source, pat.flags.replace('g', '')).test(before.slice(-60)) || new RegExp(pat.source, pat.flags.replace('g', '')).test(after.slice(0, 50))) {
            // se outra norma conhecida está mais perto, não é esta
            return true;
          }
        }
        // sem norma por perto: vale a norma padrão da disciplina
        const anyLaw = /constitui[çc][ãa]o|\bCF\b|c[óo]digo|\bC[CP]P?\b|\bLei\s+(?:n[ºo°.]*\s*)?\d|Estatuto/i.test(before.slice(-40) + after.slice(0, 40));
        return !anyLaw && defaultLaw && item.law === defaultLaw;
      });
      if (hit) result.push(item);
    });
    return result;
  }
  function blockOf(head) {
    const nodes = [head];
    for (let el = head.nextElementSibling; el && !/^H[1-6]$/.test(el.tagName) && !el.querySelector?.('h1,h2,h3,h4'); el = el.nextElementSibling) nodes.push(el);
    return nodes;
  }
  function groupHtml(items) {
    const first = items[0], short = (SHORT[first.law] ? SHORT[first.law] + ', art. ' + first.ref : first.label.replace(/^Lei seca\s*·\s*/i, '').replace(/\s*[·—-]\s*Art\.?\s*/i, ', art. '));
    const more = items.length > 1 ? ' e mais ' + (items.length - 1) : '';
    return '<summary>Ver lei seca — ' + esc(short) + more + '</summary><div class="bc-rev-lei-body" data-empty="1"></div>';
  }
  function fillGroup(det, items) {
    const body = det.querySelector('.bc-rev-lei-body');
    if (!body || !body.dataset.empty) return;
    delete body.dataset.empty;
    body.innerHTML = items.map(it => '<div class="bc-rev-lei-art"><h5>' + esc(it.label.replace(/^Lei seca\s*·\s*/i, '')) + '</h5>' +
      it.paragraphs.map(p => '<p>' + esc(p) + '</p>').join('') +
      (it.url ? '<a href="' + esc(it.url) + '" target="_blank" rel="noopener noreferrer">Consultar fonte oficial</a>' : '') + '</div>').join('');
  }
  // Coloca a lei seca logo após cada trecho do texto que cita o artigo. Devolve quantos blocos receberam.
  function place(article, items, defaultLaw) {
    const heads = [...article.querySelectorAll('h2,h3,h4')].filter(h => !h.closest('.bc-native-internal-review') && !/Quest(ões|oes) Internas/i.test(h.textContent));
    let count = 0, chapterSeen = new Set(), chapter = null;
    const stop = [...article.querySelectorAll('h2')].find(h => /Quest(ões|oes) Internas/i.test(h.textContent));
    // texto introdutório antes do primeiro título também conta
    const lead = [];
    for (let el = article.firstElementChild; el && !/^H[1-6]$/.test(el.tagName); el = el.nextElementSibling) lead.push(el);
    const units = heads.map(h => ({ head: h, nodes: blockOf(h) }));
    units.forEach(u => {
      if (stop && (stop.compareDocumentPosition(u.head) & Node.DOCUMENT_POSITION_FOLLOWING)) return;
      if (u.head.tagName === 'H2') { chapter = u.head; chapterSeen = new Set(); }
      const text = u.nodes.map(n => n.textContent).join(' \n ');
      // listas de fontes e links oficiais não são "assunto": não recebem lei seca
      if (/^\s*(fontes?|refer[êe]ncias?|bibliografia|links?)\b/i.test(u.head.textContent) || (text.match(/https?:\/\//g) || []).length >= 2) return;
      const hits = citedItems(text, items, defaultLaw).filter(i => !chapterSeen.has(i.key));
      if (!hits.length) return;
      hits.forEach(i => chapterSeen.add(i.key));
      const det = document.createElement('details');
      det.className = 'bc-rev-lei-group';
      det.innerHTML = groupHtml(hits);
      det.addEventListener('toggle', () => { if (det.open) fillGroup(det, hits); });
      const last = u.nodes[u.nodes.length - 1];
      last.after(det);
      count++;
    });
    return count;
  }
  function loadScript(src, ready) {
    return new Promise((resolve, reject) => {
      if (ready()) return resolve();
      const tag = document.createElement('script'); tag.src = src;
      tag.onload = () => { tag.remove(); ready() ? resolve() : reject(new Error('vazio')); };
      tag.onerror = () => { tag.remove(); reject(new Error('indisponível')); };
      document.head.append(tag);
    });
  }
  async function itemsFor(info) {
    const read = () => global.BC_LEI_REVISAO && global.BC_LEI_REVISAO[info.disc] && global.BC_LEI_REVISAO[info.disc][info.n];
    await loadScript('/content/' + (info.disc === 'cpp' ? 'cpp' : info.disc) + '/lei-revisao/m' + String(info.n).padStart(2, '0') + '.js?v=' + LEI_VERSION, () => !!read());
    return (read() || []).filter(it => it && Array.isArray(it.paragraphs) && it.paragraphs.length);
  }
  async function attachLei(overlay) {
    if (overlay.dataset.bcLei) return;
    const info = identify(overlay.querySelector('.bc-native-reader-title small,.bc-native-reader-head small')?.textContent);
    if (!info) return;
    overlay.dataset.bcLei = 'pendente';
    try {
      const items = await itemsFor(info);
      const article = overlay.querySelector('.bc-native-article');
      if (!items.length || !article || article.querySelector('.bc-rev-lei-group')) { overlay.dataset.bcLei = 'vazio'; return; }
      const n = place(article, items, LEI_DEFAULT[info.disc] || '');
      overlay.dataset.bcLei = n ? 'ok' : 'sem-citacoes';
    } catch (e) { overlay.dataset.bcLei = 'indisponivel'; }
  }

  // Somente fontes do próprio material de revisão: jamais consultar a teoria completa.
  function reviewChecklistSource(overlay) {
    if (!isReview(overlay)) return null;
    const article = overlay.querySelector('.bc-native-article');
    if (!article?.querySelectorAll) return null;
    const label = overlay.querySelector('.bc-native-reader-title small,.bc-native-reader-head small')?.textContent || '';
    const info = identify(label);
    const cpc = article.querySelector('.cpc-didactic-review[data-cpc-review]');
    let disc, n, headings;
    if (cpc && article.querySelector('[data-cpc-apostila="summary"]')) {
      disc = 'cpc'; n = Number(cpc.dataset.cpcReview);
      headings = [...cpc.querySelectorAll('.cpc-study-step > summary > strong')];
    } else if (info?.disc === 'adm' || info?.disc === 'cpp') {
      disc = info.disc; n = info.n;
      const source = article.querySelector(disc === 'adm' ? '.adm-author-reading' : '.bc-apostila-teoria');
      if (!source) return null;
      headings = [...source.querySelectorAll('h2,h3')].filter(h => /^\s*\d{1,2}(?:[.)]|\s|—|–)/.test(h.textContent));
    } else return null;
    const max = disc === 'cpp' ? 22 : 20;
    if (!Number.isInteger(n) || n < 1 || n > max) return null;
    const items = [...new Set(headings.map(h => norm(h.textContent)
      .replace(/^\d{1,2}(?:[.)]|\s|—|–)+\s*/, '')
      .replace(/[.?!]+$/, '').trim()).filter(Boolean))];
    return items.length ? { article, disc, n, items } : null;
  }
  function attachChecklist(overlay) {
    const data = reviewChecklistSource(overlay);
    if (!data) return false;
    const { article, disc, n, items } = data;
    const signature = JSON.stringify(items);
    const previous = article.querySelector('[data-bc-review-comprehension]');
    if (previous?.dataset.signature === signature && previous === article.lastElementChild) return true;
    const doc = article.ownerDocument;
    const key = 'bc:' + disc + ':m' + String(n).padStart(2, '0') + ':revisao:compreensao:v1';
    let state = Object.create(null);
    try {
      const saved = JSON.parse(global.localStorage.getItem(key) || '{}');
      if (saved && typeof saved === 'object' && !Array.isArray(saved)) Object.assign(state, saved);
    } catch (_) {}
    // Remover apenas checagens antigas explicitamente identificadas como checklist de compreensão.
    // Os controles de questões e progresso por capítulo não são checklists de compreensão.
    article.querySelectorAll('[data-bc-review-comprehension],.bc-apostila-checklist,.bc-m01-checklist,.cf-native-checklist').forEach(el => el.remove());
    const details = doc.createElement('details');
    details.className = 'bc-apostila-checklist bc-revision-comprehension';
    details.dataset.bcReviewComprehension = disc + ':' + n;
    details.dataset.signature = signature;
    const summary = doc.createElement('summary');
    summary.textContent = 'Minha checagem de compreensão';
    const section = doc.createElement('section');
    section.className = 'bc-m01-checklist';
    section.setAttribute('aria-label', 'Checklist de compreensão');
    const heading = doc.createElement('h2'); heading.textContent = 'Checklist de compreensão';
    const intro = doc.createElement('p'); intro.textContent = 'Marque apenas os assuntos que você já consegue explicar com suas palavras.';
    section.append(heading, intro);
    for (const topic of items) {
      const row = doc.createElement('label'), input = doc.createElement('input'), span = doc.createElement('span');
      input.type = 'checkbox'; input.checked = state[topic] === true;
      span.textContent = 'Consigo explicar, com minhas palavras: ' + topic + '.';
      input.addEventListener('change', () => {
        state[topic] = input.checked;
        try { global.localStorage.setItem(key, JSON.stringify(state)); } catch (_) {}
      });
      row.append(input, span); section.append(row);
    }
    const note = doc.createElement('p'); note.className = 'bc-m01-local-note';
    note.textContent = 'Checklist salvo neste navegador, sem alterar o progresso oficial do módulo.';
    section.append(note); details.append(summary, section); article.append(details);
    return true;
  }

  function mark(root) {
    const list = root.matches?.(READERS) ? [root] : [...(root.querySelectorAll?.(READERS) || [])];
    list.forEach(el => {
      const on = isReview(el);
      if (on !== el.classList.contains(CLASS)) el.classList.toggle(CLASS, on);
      if (on) attachChecklist(el);
      if (on && !el.dataset.bcLei) {
        // O leitor do Administrativo monta o texto de forma assíncrona: tenta até o artigo existir.
        let tries = 0;
        const ready = () => !!identify(el.querySelector('.bc-native-reader-title small,.bc-native-reader-head small')?.textContent) && !!el.querySelector('.bc-native-article h2');
        const wait = () => { if (ready()) attachLei(el); else if (tries++ < 40 && el.isConnected) setTimeout(wait, 250); };
        wait();
      }
    });
  }
  function start() {
    mark(document.body);
    new MutationObserver(records => {
      for (const r of records) {
        r.addedNodes.forEach(n => { if (n.nodeType === 1) mark(n); });
        const reader = r.target.closest?.(READERS);
        if (reader && reader.querySelector('.bc-native-article')) attachChecklist(reader);
        if (r.type === 'characterData' || r.type === 'attributes') { const o = r.target.parentElement?.closest?.(READERS); if (o) mark(o); }
      }
    }).observe(document.body, { childList: true, subtree: true });
  }
  global.BCRevisaoPadraoCF = { mark, citedItems, articleCitations, reviewChecklistSource, attachChecklist };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})(window);
