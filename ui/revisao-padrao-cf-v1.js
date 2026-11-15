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
  /* ---- Lei seca recolhível na Revisão (Administrativo, Penal e Processo Penal) --------------------------
     Mesmo gesto do Constitucional: "▸ Ver lei seca …", fechado. Reaproveita os textos legais já existentes
     na Teoria completa; se o aluno não tem acesso a eles, o bloco simplesmente não aparece. */
  const LEI_FILES = {
    penal: { name: 'PENAL_VISUAL_LAW', src: '/content/penal/penal-visual-law.js?v=20261106penal4' },
    cpp: { name: 'CPP_VISUAL_LAW', src: '/content/cpp/cpp-visual-law.js?v=20261105literal3' },
  };
  const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  function identify(text) {
    const t = String(text || '').toUpperCase();
    const m = t.match(/DIREITO\s+(ADMINISTRATIVO|PROCESSUAL PENAL|PENAL)\s*[·•-]\s*M[ÓO]DULO\s*(\d{1,2})/);
    if (!m) return null;
    return { disc: m[1] === 'ADMINISTRATIVO' ? 'adm' : m[1] === 'PENAL' ? 'penal' : 'cpp', n: Number(m[2]) };
  }
  // Itens da lei seca de um módulo (sem repetir o mesmo dispositivo).
  function leiItems(data, n) {
    const entries = data && data.modules && (data.modules[n] || data.modules[String(n)]);
    if (!Array.isArray(entries) || !data.articles) return [];
    const seen = new Set(), out = [];
    entries.forEach(e => {
      const a = data.articles[e.key];
      if (!a || seen.has(e.key) || !Array.isArray(a.paragraphs) || !a.paragraphs.length) return;
      seen.add(e.key);
      out.push({ key: e.key, label: String(a.label || e.key), paragraphs: a.paragraphs.map(String), url: /^https:\/\//.test(a.officialUrl || '') ? a.officialUrl : '' });
    });
    return out;
  }
  function leiGroupHtml(items) {
    if (!items.length) return '';
    const rows = items.map((it, i) => '<details class="bc-rev-lei-item" data-i="' + i + '"><summary>Lei seca · ' + esc(it.label) + '</summary><div class="bc-rev-lei-body"></div></details>').join('');
    return '<details class="bc-rev-lei-group"><summary>Ver lei seca do módulo · ' + items.length + (items.length === 1 ? ' dispositivo' : ' dispositivos') + '</summary>' + rows + '</details>';
  }
  function bindLei(section, items) {
    // O texto de cada artigo só é montado quando o aluno abre (módulos chegam a ter mais de 90).
    section.addEventListener('toggle', ev => {
      const d = ev.target;
      if (!d.classList || !d.classList.contains('bc-rev-lei-item') || !d.open) return;
      const body = d.querySelector('.bc-rev-lei-body');
      if (body.childNodes.length) return;
      const it = items[Number(d.dataset.i)];
      body.innerHTML = '<blockquote>' + it.paragraphs.map(p => '<p>' + esc(p) + '</p>').join('') + '</blockquote>' +
        (it.url ? '<a href="' + esc(it.url) + '" target="_blank" rel="noopener noreferrer">Consultar fonte oficial</a>' : '');
    }, true);
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
    if (info.disc === 'adm') {
      if (!global.AdmApostilaReading) return [];
      const html = await global.AdmApostilaReading.load(info.n, 'complete');
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const seen = new Set(), out = [];
      doc.querySelectorAll('details.law').forEach(d => {
        const sec = d.querySelector('[data-law-key]');
        const key = sec ? sec.getAttribute('data-law-key') : d.querySelector('summary')?.textContent;
        if (seen.has(key)) return; seen.add(key);
        const label = (d.querySelector('summary')?.textContent || '').replace(/^\s*Lei seca\s*[·•-]\s*/i, '').trim();
        const paragraphs = [...d.querySelectorAll('p')].map(p => p.textContent.trim()).filter(Boolean);
        if (label && paragraphs.length) out.push({ key, label, paragraphs, url: '' });
      });
      return out;
    }
    const cfg = LEI_FILES[info.disc];
    if (!cfg) return [];
    await loadScript(cfg.src, () => !!global[cfg.name]);
    return leiItems(global[cfg.name], info.n);
  }
  async function attachLei(overlay) {
    if (overlay.dataset.bcLei) return;
    const info = identify(overlay.querySelector('.bc-native-reader-title small,.bc-native-reader-head small')?.textContent);
    if (!info) return;
    overlay.dataset.bcLei = 'pendente';
    try {
      const items = await itemsFor(info);
      const article = overlay.querySelector('.bc-native-article');
      if (!items.length || !article || article.querySelector('.bc-rev-lei')) { overlay.dataset.bcLei = 'vazio'; return; }
      const section = document.createElement('section');
      section.className = 'bc-rev-lei';
      section.innerHTML = leiGroupHtml(items);
      bindLei(section, items);
      const questions = article.querySelector('.bc-native-internal-review') ||
        [...article.querySelectorAll('h2')].find(h => /Quest(ões|oes) Internas/i.test(h.textContent));
      if (questions) questions.before(section); else article.append(section);
      overlay.dataset.bcLei = 'ok';
    } catch (e) { overlay.dataset.bcLei = 'indisponivel'; }
  }
  function mark(root) {
    const list = root.matches?.(READERS) ? [root] : [...(root.querySelectorAll?.(READERS) || [])];
    list.forEach(el => {
      const on = isReview(el);
      if (on !== el.classList.contains(CLASS)) el.classList.toggle(CLASS, on);
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
        if (r.type === 'characterData' || r.type === 'attributes') { const o = r.target.parentElement?.closest?.(READERS); if (o) mark(o); }
      }
    }).observe(document.body, { childList: true, subtree: true });
  }
  global.BCRevisaoPadraoCF = { mark, leiItems, leiGroupHtml };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})(window);
