/* Base Completa — Correção editorial V2 (apresentação; o conteúdo salvo não muda).
   1) Parágrafos cortados no meio da frase (quebra de diagramação do material de origem)
      são reunidos num só parágrafo, com o texto idêntico.
   2) Tabelas de estudo simples viram cartões no celular (cada linha = um cartão, com o
      rótulo da coluna); tabelas complexas ficam numa área com rolagem horizontal.
   3) "Entenda o termo": explicações complementares, revisadas, de termos jurídicos
      selecionados (primeira ocorrência de cada leitura).
   Nunca altera questões, gabaritos, links, código, campos editáveis ou anotações. */
(function (g) {
  'use strict';
  if (g.CentralEditorialReading) return;
  const ROOTS = [
    '.bc-native-reader-overlay .bc-native-article', '.bc-guided-overlay .bc-m01-paper',
    '.cf-native-reader article', '.cv-reader article', '.cv-reader-content',
    '.cpc-apostila-content', '.cpc-apostila-topic', '.cpp-source', '.adm-native-content',
    '.pen-theory-scroll article', '.pen-theory-scroll main',
    '.central-reading-active-topic .ct-body', '.central-reading-active-topic .cf-theory-text',
    '.bc-universal-projection'
  ].join(',');
  const SKIP = 'script,style,textarea,input,select,button,code,pre,a,mark,abbr,svg,table,' +
    '.bc-iq,.bc-iq-answer,.bc-native-quiz-card,[contenteditable="true"],.bc-term,.bc-acr-full,.bc-hl,[data-highlight]';
  const done = new WeakSet();

  /* 1) Parágrafos cortados: o anterior não termina em pontuação e o seguinte começa
     com letra minúscula — sinal inequívoco de quebra de diagramação, não de novo parágrafo. */
  function plainParagraph(p) {
    return p && p.tagName === 'P' && !p.className && !p.id && !p.closest(SKIP) &&
      !p.querySelector('br,img,table,ul,ol,mark,[data-highlight],.bc-hl');
  }
  function mergeSplitParagraphs(root) {
    let merged = 0;
    root.querySelectorAll('p').forEach(p => {
      if (!p.isConnected || !plainParagraph(p)) return;
      let next = p.nextElementSibling;
      while (plainParagraph(next)) {
        const prev = p.textContent.replace(/\s+$/, ''), cur = next.textContent.replace(/^\s+/, '');
        if (prev.length < 25 || /[.:;!?)"»”…]$/.test(prev) || !/^[a-zà-ÿ]/.test(cur)) break;
        p.append(' ', ...next.childNodes);
        next.remove(); merged++;
        next = p.nextElementSibling;
      }
    });
    return merged;
  }

  /* 2) Tabelas. */
  function tableShape(t) {
    if (t.querySelector('[colspan]:not([colspan="1"]),[rowspan]:not([rowspan="1"]),table')) return null;
    const rows = [...t.rows];
    if (rows.length < 2) return null;
    const head = t.tHead?.rows[0] || (rows[0].cells.length && [...rows[0].cells].every(c => c.tagName === 'TH') ? rows[0] : null);
    if (!head) return null;
    const labels = [...head.cells].map(c => c.textContent.replace(/\s+/g, ' ').trim());
    if (labels.length < 2 || labels.length > 6 || labels.some(l => !l || l.length > 60)) return null;
    const body = rows.filter(r => r !== head && r.parentElement !== t.tHead);
    if (!body.length || body.some(r => r.cells.length !== labels.length)) return null;
    return { labels, body };
  }
  function enhanceTable(t) {
    if (done.has(t) || t.closest('.bc-iq,[contenteditable="true"]')) return;
    done.add(t);
    const shape = tableShape(t);
    if (shape) {
      shape.body.forEach(r => [...r.cells].forEach((c, i) => { c.dataset.label = shape.labels[i]; }));
      t.classList.add('bc-tcards');
    }
    // Rolagem horizontal acessível: no computador (e para tabelas complexas também no celular).
    if (!t.parentElement?.classList.contains('bc-table-scroll')) {
      const wrap = document.createElement('div');
      wrap.className = 'bc-table-scroll';
      wrap.tabIndex = 0;
      wrap.setAttribute('role', 'region');
      wrap.setAttribute('aria-label', (t.caption?.textContent.trim() || 'Tabela') + ' (role para o lado se necessário)');
      t.before(wrap); wrap.appendChild(t);
    }
  }

  /* 2b) Tabelas importadas como texto de largura fixa (<pre class="…source-table">):
     as colunas são lidas pelas posições do cabeçalho. Só converte quando todo caractere
     cai dentro de uma coluna e o texto reconstruído é idêntico ao original; caso
     contrário mantém o bloco original com rolagem. */
  function fixedWidthTable(pre) {
    const all = pre.textContent.replace(/\r/g, '').split('\n');
    while (all.length && !all[0].trim()) all.shift();
    if (all.length < 2) return null;
    const head = all[0];
    const starts = [];
    for (const m of head.matchAll(/\S+(?: \S+)*/g)) starts.push(m.index);
    if (starts.length < 2 || starts.length > 6) return null;
    const cut = line => starts.map((s, i) => line.slice(s, i + 1 < starts.length ? starts[i + 1] : undefined));
    // A linha cabe na grade quando nenhum texto atravessa uma divisa e nada começa antes da 1ª coluna.
    const fits = line => {
      const lead = line.search(/\S/);
      if (lead < 0) return true;
      if (lead < starts[0]) return false;
      for (let k = 1; k < starts.length; k++) {
        const b = starts[k];
        if (line[b - 1] && line[b - 1] !== ' ' && line[b] && line[b] !== ' ') return false;
      }
      return true;
    };
    let end = 1;
    while (end < all.length && fits(all[end])) end++;
    const lines = all.slice(0, end).filter(l => l.trim());
    const rest = all.slice(end).join('\n');
    const labels = cut(head).map(c => c.trim());
    const rows = [];
    for (const line of lines.slice(1)) {
      const cells = cut(line).map(c => c.trim());
      if (cells[0] || !rows.length) rows.push(cells);
      else cells.forEach((c, i) => { if (c) rows[rows.length - 1][i] = (rows[rows.length - 1][i] ? rows[rows.length - 1][i] + ' ' : '') + c; });
    }
    const word = t => /[\p{L}\p{N}]/u.test(t);
    if (!labels.every(word) || rows.length < 1 || rows.some(r => !word(r[0]) || r.filter(Boolean).length < 2)) return null;
    // Conservação do texto: as mesmas palavras, sem perda nem acréscimo.
    const words = t => t.split(/\s+/).filter(Boolean).sort().join(' ');
    if (words(lines.join(' ')) !== words([labels.join(' '), ...rows.map(r => r.join(' '))].join(' '))) return null;
    return { labels, rows, rest: rest.trim() ? rest : '' };
  }
  // Cabeçalho com 2+ colunas separadas por 2+ espaços = tabela de verdade.
  function looksTabular(pre) {
    const head = pre.textContent.replace(/\r/g, '').split('\n').find(l => l.trim()) || '';
    return (head.trim().match(/\S+(?: \S+)*/g) || []).length >= 2;
  }
  // Bloco de uma coluna (lista ou destaque): cada item com suas linhas reunidas.
  function listFromPre(pre) {
    const lines = pre.textContent.replace(/\r/g, '').split('\n').filter(l => l.trim());
    const base = Math.min(...lines.map(l => l.search(/\S/)));
    const items = [];
    for (const line of lines) {
      const indent = line.search(/\S/), text = line.trim();
      if (!items.length || indent <= base || /^[•▪◦–-]\s/.test(text)) items.push([text]);
      else items[items.length - 1].push(text);
    }
    const join = parts => g.CentralUniversalReader?.reflow ? g.CentralUniversalReader.reflow(parts) : parts.join(' ');
    const box = document.createElement('div');
    box.className = 'bc-rebuilt-list';
    const bullets = items.every(it => /^[•▪◦–-]\s/.test(it[0]));
    if (bullets) {
      const ul = document.createElement('ul');
      items.forEach(it => { const li = document.createElement('li'); li.textContent = join(it).replace(/^[•▪◦–-]\s+/, ''); ul.appendChild(li); });
      box.appendChild(ul);
    } else items.forEach(it => { const p = document.createElement('p'); p.textContent = join(it); box.appendChild(p); });
    pre.hidden = true; pre.dataset.bcRebuilt = '1';
    pre.after(box);
  }
  function convertPreTable(pre) {
    if (done.has(pre)) return;
    done.add(pre);
    const data = fixedWidthTable(pre);
    if (!data && !looksTabular(pre)) { listFromPre(pre); return; }
    if (!data) {
      if (!pre.parentElement?.classList.contains('bc-table-scroll')) {
        const wrap = document.createElement('div'); wrap.className = 'bc-table-scroll'; wrap.tabIndex = 0;
        wrap.setAttribute('role', 'region'); wrap.setAttribute('aria-label', 'Quadro (role para o lado se necessário)');
        pre.before(wrap); wrap.appendChild(pre);
      }
      return;
    }
    const t = document.createElement('table');
    t.className = 'bc-rebuilt-table';
    const tr = document.createElement('tr');
    data.labels.forEach(l => { const th = document.createElement('th'); th.scope = 'col'; th.textContent = l; tr.appendChild(th); });
    t.createTHead().appendChild(tr);
    const body = t.createTBody();
    data.rows.forEach(r => { const row = body.insertRow(); r.forEach(c => { row.insertCell().textContent = c; }); });
    pre.hidden = true; pre.dataset.bcRebuilt = '1';
    pre.after(t);
    enhanceTable(t);
    if (data.rest) {
      // Texto que vinha depois da tabela no mesmo bloco: volta como texto comum (o leitor
      // universal o organiza em títulos e parágrafos).
      const tail = document.createElement('pre');
      tail.className = 'bc-rebuilt-tail';
      tail.textContent = data.rest;
      (t.closest('.bc-table-scroll') || t).after(tail);
      if (g.CentralUniversalReader && !g.CentralUniversalReader.formatRaw(tail)) {
        const p = document.createElement('p'); p.textContent = g.CentralUniversalReader.reflow ? g.CentralUniversalReader.reflow(data.rest.split('\n').filter(l => l.trim())) : data.rest;
        tail.replaceWith(p);
      }
    }
  }

  /* 3) Entenda o termo — dicionário curado (texto de apoio; não substitui a apostila). */
  const TERMS = {
    nascituro: {
      label: 'Nascituro',
      simples: 'É quem já foi concebido, mas ainda não nasceu.',
      juridico: 'A personalidade civil começa do nascimento com vida, mas a lei põe a salvo, desde a concepção, os direitos do nascituro (Código Civil, art. 2º).',
      exemplo: 'O nascituro pode ser beneficiado por doação, aceita por seu representante legal (art. 542 do Código Civil).'
    },
    'comoriência': {
      label: 'Comoriência',
      simples: 'É a morte de duas ou mais pessoas na mesma ocasião, quando não se sabe quem morreu primeiro.',
      juridico: 'Se não for possível averiguar se algum dos comorientes precedeu aos outros, presumem-se simultaneamente mortos (Código Civil, art. 8º).',
      exemplo: 'Pai e filho morrem no mesmo acidente sem prova de quem faleceu antes: considera-se que morreram juntos, e um não herda do outro.'
    },
    curatela: {
      label: 'Curatela',
      simples: 'É o encargo dado a uma pessoa (o curador) para cuidar dos interesses de um adulto que precisa de apoio para certos atos da vida civil.',
      juridico: 'Medida protetiva extraordinária, proporcional às necessidades de cada caso e restrita, em regra, aos atos de natureza patrimonial e negocial (Lei 13.146/2015, arts. 84 e 85; Código Civil, art. 1.767).',
      exemplo: ''
    },
    'preclusão': {
      label: 'Preclusão',
      simples: 'É a perda da chance de praticar um ato no processo.',
      juridico: 'Ocorre pelo decurso do prazo (temporal), pela prática de ato incompatível (lógica) ou porque o ato já foi praticado (consumativa). Decorrido o prazo, extingue-se o direito de praticar ou de emendar o ato processual (CPC, art. 223).',
      exemplo: 'Se a parte não recorre dentro do prazo, não pode mais recorrer daquela decisão.'
    },
    'coisa julgada': {
      label: 'Coisa julgada',
      simples: 'É a qualidade da decisão que não pode mais ser mudada por recurso.',
      juridico: 'Coisa julgada material é a autoridade que torna imutável e indiscutível a decisão de mérito não mais sujeita a recurso (CPC, art. 502). A Constituição protege a coisa julgada (CF, art. 5º, XXXVI).',
      exemplo: ''
    },
    'prescrição': {
      label: 'Prescrição',
      simples: 'É a perda, pelo passar do tempo, do poder de exigir um direito na Justiça.',
      juridico: 'Violado o direito, nasce para o titular a pretensão, que se extingue pela prescrição nos prazos previstos em lei (Código Civil, art. 189). No Direito Penal, a prescrição é causa de extinção da punibilidade (Código Penal, art. 107, IV).',
      exemplo: ''
    },
    'decadência': {
      label: 'Decadência',
      simples: 'É a perda do próprio direito por não exercê-lo no prazo.',
      juridico: 'Atinge direitos potestativos. Diferentemente da prescrição, em regra não se aplicam a ela as normas que impedem, suspendem ou interrompem a prescrição (Código Civil, art. 207), e a decadência fixada em lei deve ser conhecida de ofício pelo juiz (art. 210).',
      exemplo: ''
    },
    legitimidade: {
      label: 'Legitimidade',
      simples: 'É ser a pessoa certa para entrar com o processo ou para responder a ele.',
      juridico: 'Para postular em juízo é necessário ter interesse e legitimidade (CPC, art. 17). Em regra, ninguém pode pleitear direito alheio em nome próprio, salvo quando autorizado pelo ordenamento jurídico (CPC, art. 18).',
      exemplo: ''
    },
    jurisprudência: {
      label: 'Jurisprudência',
      simples: 'É o conjunto de decisões dos tribunais sobre um mesmo tema.',
      juridico: 'Os tribunais devem uniformizar sua jurisprudência e mantê-la estável, íntegra e coerente (CPC, art. 926).',
      exemplo: 'Súmulas e teses de repercussão geral são formas de consolidar a jurisprudência.'
    }
  };
  const TERM_KEYS = Object.keys(TERMS).sort((a, b) => b.length - a.length);
  const TERM_RE = new RegExp('(?<![\\p{L}\\p{N}])(' + TERM_KEYS.map(k => k.replace(/ /g, '\\s+')).join('|') + ')(?![\\p{L}\\p{N}])', 'iu');
  const keyOf = text => text.toLocaleLowerCase('pt-BR').replace(/\s+/g, ' ');

  function markTerms(root) {
    const seen = new Set([...root.querySelectorAll('.bc-term')].map(e => e.dataset.term));
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: n => !n.nodeValue.trim() || n.parentElement?.closest(SKIP + ',h1,h2,h3,h4,h5,h6,summary') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
    });
    const nodes = [];
    for (let n = walker.nextNode(); n; n = walker.nextNode()) nodes.push(n);
    for (const node of nodes) {
      if (seen.size === TERM_KEYS.length) break;
      const m = node.nodeValue.match(TERM_RE);
      if (!m || seen.has(keyOf(m[1]))) continue;
      const key = keyOf(m[1]);
      seen.add(key);
      const after = node.splitText(m.index), rest = after.splitText(m[1].length);
      const term = document.createElement('span');
      term.className = 'bc-term'; term.dataset.term = key;
      term.tabIndex = 0; term.setAttribute('role', 'button');
      term.setAttribute('aria-haspopup', 'dialog');
      term.setAttribute('aria-label', m[1] + ' — entenda o termo');
      term.textContent = after.nodeValue;
      after.replaceWith(term);
      void rest;
    }
  }

  let pop = null, popFor = null;
  function closePop() { if (pop) { pop.remove(); pop = null; popFor?.setAttribute('aria-expanded', 'false'); popFor?.focus?.(); popFor = null; } }
  function openTerm(el) {
    const data = TERMS[el.dataset.term]; if (!data) return;
    closePop();
    pop = document.createElement('div');
    pop.className = 'bc-term-pop'; pop.setAttribute('role', 'dialog'); pop.setAttribute('aria-label', 'Entenda o termo: ' + data.label);
    const esc = s => s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
    pop.innerHTML = '<div class="bc-term-head"><b>Entenda o termo · ' + esc(data.label) + '</b><button type="button" class="bc-term-close" aria-label="Fechar">×</button></div>' +
      '<p><strong>Significado simples:</strong> ' + esc(data.simples) + '</p>' +
      '<p><strong>Explicação jurídica:</strong> ' + esc(data.juridico) + '</p>' +
      (data.exemplo ? '<p><strong>Exemplo prático:</strong> ' + esc(data.exemplo) + '</p>' : '') +
      '<small>Explicação complementar da Base Completa; não substitui a apostila.</small>';
    (el.closest('.bc-native-reader-overlay,.bc-guided-overlay') || document.body).appendChild(pop);
    const r = el.getBoundingClientRect(), w = Math.min(360, innerWidth - 24);
    pop.style.width = w + 'px';
    pop.style.left = Math.max(12, Math.min(r.left, innerWidth - w - 12)) + 'px';
    const below = r.bottom + 8, h = pop.offsetHeight;
    pop.style.top = (below + h < innerHeight - 8 ? below : Math.max(8, r.top - h - 8)) + 'px';
    popFor = el; el.setAttribute('aria-expanded', 'true');
    pop.querySelector('.bc-term-close').addEventListener('click', closePop);
    pop.querySelector('.bc-term-close').focus();
  }
  document.addEventListener('click', e => {
    const t = e.target.closest?.('.bc-term');
    if (t) { e.preventDefault(); openTerm(t); return; }
    if (pop && !e.target.closest('.bc-term-pop')) closePop();
  });
  g.addEventListener('keydown', e => {
    if (e.key === 'Escape' && pop) { e.preventDefault(); e.stopImmediatePropagation(); closePop(); }
  }, true);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') return;
    const t = e.target.closest?.('.bc-term');
    if (t && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openTerm(t); }
  });
  document.addEventListener('scroll', () => closePop(), true);

  /* Marcador de lista do Word (fonte Symbol, U+F0B7) aparece como quadrado vazio:
     exibido como "•". Só apresentação. */
  function fixSymbolBullets(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: n => n.nodeValue.includes('\uf0b7') && !n.parentElement?.closest('textarea,input,[contenteditable="true"]') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
    });
    const nodes = []; for (let n = walker.nextNode(); n; n = walker.nextNode()) nodes.push(n);
    nodes.forEach(n => { n.nodeValue = n.nodeValue.replace(/\uf0b7/g, '•'); });
  }
  function process(root) {
    if (!(root instanceof Element) || root.closest('.visual-editor-v1,.block-editor,[contenteditable="true"]')) return;
    fixSymbolBullets(root);
    root.querySelectorAll('pre[class*="source-table"]').forEach(convertPreTable);
    mergeSplitParagraphs(root);
    root.querySelectorAll('table').forEach(enhanceTable);
    markTerms(root);
  }

  const style = document.createElement('style');
  style.id = 'bc-editorial-reading-v2';
  style.textContent = [
    // Leitura: sem hifenização automática (palavras partidas); quebras do texto viram espaço.
    ':is(' + ROOTS + ') :is(p,li,dd,dt,blockquote,td,th){-webkit-hyphens:manual;hyphens:manual;word-break:normal;overflow-wrap:break-word}',
    ':is(' + ROOTS + ') p{margin-block:0 .9em}',
    // Tabelas: área com rolagem quando a tabela não cabe.
    '.bc-table-scroll{max-width:100%;overflow-x:auto;-webkit-overflow-scrolling:touch;margin:1em 0}',
    '.bc-table-scroll:focus-visible{outline:3px solid #1d7f86;outline-offset:2px;border-radius:6px}',
    '.bc-table-scroll>table{margin:0;min-width:100%}',
    '.bc-table-scroll>pre{margin:0;white-space:pre;overflow:visible}',
    '.bc-rebuilt-list{margin:1em 0;padding:12px 16px;border-left:3px solid var(--line,#c9d6e2);border-radius:0 10px 10px 0;background:rgba(93,125,176,.06)}',
    '.bc-rebuilt-list p:last-child,.bc-rebuilt-list ul{margin-bottom:0}',
    '@media (max-width:640px){' +
      '.bc-table-scroll:has(>table.bc-tcards){overflow-x:visible}' +
      'table.bc-tcards,table.bc-tcards tbody,table.bc-tcards tr,table.bc-tcards td{display:block;width:auto!important;min-width:0!important;max-width:100%!important;box-sizing:border-box}' +
      'table.bc-tcards{border:0!important;background:none!important;min-width:0}' +
      'table.bc-tcards thead,table.bc-tcards tr:has(>th:only-child),table.bc-tcards tr:first-child:has(>th){display:none}' +
      'table.bc-tcards tr{margin:0 0 12px;padding:12px 14px;border:1px solid var(--line,#d9e2ea);border-radius:12px;background:var(--surface,#fff);box-shadow:0 1px 2px rgba(10,30,45,.05)}' +
      'table.bc-tcards td{border:0!important;padding:4px 0!important;text-align:left!important;background:none!important}' +
      'table.bc-tcards td::before{content:attr(data-label);display:block;font:700 11px/1.3 system-ui,sans-serif;letter-spacing:.04em;text-transform:uppercase;color:var(--muted,#5b6f80);margin-bottom:2px}' +
      'table.bc-tcards td:first-child{font-weight:700;padding-bottom:8px!important;margin-bottom:4px;border-bottom:1px solid var(--line,#e4eaf0)!important}' +
    '}',
    // Entenda o termo.
    '.bc-term{text-decoration:underline dotted 1.5px;text-underline-offset:3px;text-decoration-color:#1d7f86;cursor:help;border-radius:3px}',
    '.bc-term:focus-visible{outline:2px solid #1d7f86;outline-offset:2px}',
    '.bc-term-pop{position:fixed;z-index:2147483100;padding:14px 16px;border-radius:12px;background:#fff;color:#12384e;border:1px solid #cfdae4;box-shadow:0 14px 40px rgba(0,0,0,.22);font:14px/1.5 system-ui,-apple-system,Segoe UI,sans-serif;text-align:left}',
    '.bc-term-pop p{margin:.5em 0;text-align:left!important}',
    '.bc-term-pop small{display:block;margin-top:6px;color:#5b6f80}',
    '.bc-term-head{display:flex;justify-content:space-between;align-items:center;gap:10px}',
    '.bc-term-close{border:0;background:transparent;font-size:20px;line-height:1;cursor:pointer;color:inherit;padding:2px 6px}'
  ].join('\n');
  document.head.appendChild(style);

  let queued = false;
  // Só reprocessa um texto quando o conteúdo muda (destaques da busca, por exemplo,
  // não mudam o texto e não disparam nova varredura).
  const lastLength = new WeakMap();
  function scan() {
    queued = false;
    document.querySelectorAll(ROOTS).forEach(el => {
      if (!el.isConnected) return;
      const len = el.textContent.length;
      if (lastLength.get(el) === len) return;
      process(el);
      lastLength.set(el, el.textContent.length);
    });
  }
  new MutationObserver(() => { if (!queued) { queued = true; setTimeout(scan, 140); } })
    .observe(document.documentElement, { childList: true, subtree: true });
  g.CentralEditorialReading = { process, mergeSplitParagraphs, tableShape, fixedWidthTable, TERMS };
})(window);
