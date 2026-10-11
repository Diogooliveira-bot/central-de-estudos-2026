/*
 * Base Completa — M03 Direito Civil (Bens).
 * Apresentação sem alterar o HTML original compactado, os enunciados ou os dados do aluno.
 * Cada caractere do <pre> original permanece no textContent após a conversão.
 */
(function (global) {
  'use strict';

  const SUMMARY_SUBHEADINGS = new Set([
    'Imóveis', 'Móveis', 'Fungíveis x consumíveis', 'Divisíveis',
    'Universalidades', 'Principal/acessório', 'Benfeitorias', 'Bens públicos'
  ]);
  const STYLE_ID = 'bc-bens-apostila-v1-styles';

  function lineType(line, mode) {
    const text = line.trim();
    if (/^\d{1,2}\.\d{1,2}\s+\S/.test(text)) return 'subsection';
    if (/^\d{1,2}\.\s+\S/.test(text)) return 'section';
    if (mode === 'summary' && SUMMARY_SUBHEADINGS.has(text)) return 'subsection';
    if (/^[•●▪]\s+/.test(text)) return 'bullet';
    if (/^(?:NÃO|CAI MUITO|PEGADINHA|ATENÇÃO|REGRA DE|REGRA DE BOLSO|STJ|VOCÊ PRECISA|LEMBRAR)\b/i.test(text)) return 'callout';
    if (/\S\s{3,}\S/.test(line)) return 'table';
    return 'paragraph';
  }

  const TABLE_HEADINGS = [
    /^Elemento\s+Características\s+Exemplo$/i,
    /^Pertença\s+Parte integrante$/i,
    /^Situação\s+Classificação\s+Motivo$/i
  ];

  function isTableHeader(line) {
    const normalized = line.trim().replace(/\s+/g, ' ');
    return TABLE_HEADINGS.some(pattern => pattern.test(normalized));
  }

  function toGroups(lines, mode) {
    const groups = [];
    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i];
      let type = isTableHeader(line) ? 'table' : lineType(line, mode);
      const prev = groups[groups.length - 1];

      // Um cabeçalho de comparação determina toda a extensão da tabela,
      // incluindo linhas quebradas com apenas um espaço entre palavras.
      if (isTableHeader(line)) {
        let end = i;
        for (let j = i + 1; j < lines.length; j += 1) {
          if (!lines[j].trim()) break;
          if (/^\d{1,2}\.(?:\d{1,2})?\s+\S/.test(lines[j])) break;
          if (/^(?:ATENÇÃO|REGRA DE BOLSO|EXEMPLO:)\s{2,}/i.test(lines[j])) break;
          end = j;
        }
        groups.push({type: 'table', start: i, end});
        i = end;
        continue;
      }

      if (type === 'paragraph' && /^\s{2,}\S/.test(line) &&
          (prev?.type === 'bullet' || prev?.type === 'table' || prev?.type === 'callout')) {
        type = prev.type;
      }
      if (prev && prev.type === type && type !== 'section' && type !== 'subsection' &&
          (type !== 'paragraph' || line.trim()) && type !== 'table') {
        prev.end = i;
      } else {
        groups.push({type, start: i, end: i});
      }
    }
    return groups;
  }

  // Mantém os textos do PDF intactos no atributo originalText para auditoria,
  // mas apresenta as células em uma estrutura real de tabela HTML.
  function makeTable(source) {
    const lines = source.split('\n').filter(line => line.trim());
    if (lines.length < 2) return null;
    const first = lines[0];
    const headings = first.trim().split(/\s{2,}|\t+/).map(s => s.trim()).filter(Boolean);
    if (headings.length < 2 || headings.length > 4) return null;
    const boundaryPositions = [];
    for (let i = 1, from = 0; i < headings.length; i += 1) {
      const pos = first.indexOf(headings[i], from + headings[i - 1].length);
      boundaryPositions.push(pos);
      from = pos;
    }
    if (boundaryPositions.some(n => n <= 0)) return null;
    const rows = [];
    const normalizedHeading = first.trim().replace(/\s+/g, ' ').toLowerCase();
    for (const line of lines.slice(1)) {
      if (line.trim().replace(/\s+/g, ' ').toLowerCase() === normalizedHeading) continue;
      const parts = [];
      let prev = 0;
      for (const boundary of boundaryPositions) {
        parts.push(line.slice(prev, boundary).trim());
        prev = boundary;
      }
      parts.push(line.slice(prev).trim());
      if (parts.every(v => !v)) continue;
      // O texto do PDF pode quebrar uma célula entre linhas: preserva a ordem
      // e evita fabricar relações semânticas quando não for possível distingui-las.
      const startsRow = !!parts[0] && (parts.some((v, i) => i > 0 && v) || !rows.length);
      if (startsRow) rows.push(parts);
      else if (rows.length) parts.forEach((v, i) => {
        if (v) rows[rows.length - 1][i] += (rows[rows.length - 1][i] ? ' ' : '') + v;
      });
      else rows.push(parts);
    }
    if (!rows.length) return null;
    const wrap = document.createElement('div');
    wrap.className = 'bc-bens-table-wrap';
    const table = document.createElement('table');
    table.className = 'bc-bens-real-table';
    const thead = document.createElement('thead');
    const headingRow = document.createElement('tr');
    headings.forEach(label => {
      const th = document.createElement('th');
      th.scope = 'col';
      th.textContent = label;
      headingRow.appendChild(th);
    });
    thead.appendChild(headingRow);
    table.appendChild(thead);
    const tbody = document.createElement('tbody');
    rows.forEach(parts => {
      const tr = document.createElement('tr');
      headings.forEach((label, i) => {
        const td = document.createElement('td');
        td.textContent = parts[i] || '';
        td.dataset.label = label;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    wrap.appendChild(table);
    return wrap;
  }

  function formatPre(pre, mode) {
    const original = pre.textContent;
    if (!original || !original.trim() || pre.dataset.bensFormatted === '1') return false;
    const lines = original.split('\n');
    const groups = toGroups(lines, mode);
    const output = document.createElement('div');
    output.className = 'bc-bens-flow';

    for (const group of groups) {
      const tag = group.type === 'section' ? 'h2' :
        group.type === 'subsection' ? 'h3' : 'div';
      const block = document.createElement(tag);
      block.className = 'bc-bens-' + group.type;
      const raw = lines.slice(group.start, group.end + 1).join('\n');
      const table = group.type === 'table' ? makeTable(raw) : null;
      if (table) {
        table.dataset.originalText = raw;
        output.appendChild(table);
      } else {
        block.textContent = raw;
        output.appendChild(block);
      }
      if (group.end < lines.length - 1) output.appendChild(document.createTextNode('\n'));
    }

    // Garantia de integridade: nem um espaço, sinal ou artigo pode desaparecer.
    const reconstructed = [...output.childNodes].map(node => node.nodeType === 3 ? node.textContent : (node.dataset?.originalText ?? node.textContent)).join('');
    if (reconstructed !== original) {
      console.error('[Base Completa] O M03 não foi reformatado: divergência no texto original.');
      return false;
    }
    pre.replaceWith(output);
    return true;
  }

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = [
      '.bc-bens-apostila .civil-source-content{max-width:860px;margin:0 auto;color:inherit;font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif;font-size:1rem;line-height:1.8}',
      '.bc-bens-apostila .civil-source-content>h2,.bc-bens-apostila .bc-bens-section{font-size:1.36rem;font-weight:750;line-height:1.3;letter-spacing:-.02em;margin:2.1rem 0 .85rem;padding:0 0 .65rem;border-bottom:1px solid var(--line,#d6dfeb);color:var(--text,#172f55);white-space:normal}',
      '.bc-bens-apostila .bc-bens-subsection{font-size:1.13rem;font-weight:700;line-height:1.35;margin:1.6rem 0 .55rem;color:var(--text,#172f55);white-space:normal}',
      '.bc-bens-apostila .bc-bens-paragraph{margin:.72rem 0 1.12rem;line-height:1.85;white-space:normal;overflow-wrap:break-word;text-align:left}',
      '.bc-bens-apostila .bc-bens-bullet{margin:.65rem 0;padding:.65rem .9rem;border-left:3px solid #8aa5c7;border-radius:0 .45rem .45rem 0;background:rgba(93,125,176,.065);white-space:pre-line;line-height:1.8}',
      '.bc-bens-apostila .bc-bens-callout{margin:1rem 0;padding:1rem 1.12rem;border-left:4px solid #4a76b2;background:rgba(93,125,176,.08);border-radius:0 .55rem .55rem 0;white-space:pre-line;line-height:1.75}',
      '.bc-bens-apostila .bc-bens-table{display:block;box-sizing:border-box;margin:1rem 0 1.4rem;padding:1.05rem;border:1px solid var(--line,#d6dfeb);border-radius:.75rem;background:rgba(115,139,173,.055);font:inherit;font-size:.95rem;line-height:1.7;white-space:pre-line;overflow-wrap:break-word;word-break:normal;overflow-x:visible;max-width:100%;tab-size:4}',
      '.bc-bens-apostila .bc-bens-table-wrap{margin:1rem 0 1.4rem;border:1px solid var(--line,#d6dfeb);border-radius:.7rem;overflow:hidden}',
      '.bc-bens-apostila .bc-bens-real-table{width:100%;border-collapse:collapse;table-layout:fixed;font:inherit;font-size:.91rem;line-height:1.55}',
      '.bc-bens-apostila .bc-bens-real-table th{background:#e5edf7;color:#17375b;text-align:left;font-weight:700}',
      '.bc-bens-apostila .bc-bens-real-table th,.bc-bens-apostila .bc-bens-real-table td{padding:.8rem .7rem;border-bottom:1px solid #dce3ec;overflow-wrap:anywhere;vertical-align:top}',
      '.bc-bens-apostila .bc-bens-real-table tr:last-child td{border-bottom:0}',
      '.bc-bens-apostila .bc-bens-real-table tr:nth-child(even) td{background:rgba(115,139,173,.045)}',
      '@media(max-width:700px){.bc-bens-apostila .bc-bens-real-table,.bc-bens-apostila .bc-bens-real-table tbody,.bc-bens-apostila .bc-bens-real-table tr,.bc-bens-apostila .bc-bens-real-table td{display:block;width:100%;box-sizing:border-box}.bc-bens-apostila .bc-bens-real-table thead{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)}.bc-bens-apostila .bc-bens-real-table tr{padding:.55rem 0;border-bottom:1px solid #cbd5e1}.bc-bens-apostila .bc-bens-real-table tr:last-child{border-bottom:0}.bc-bens-apostila .bc-bens-real-table td{padding:.35rem .8rem;border:0!important;background:transparent!important}.bc-bens-apostila .bc-bens-real-table td:before{content:attr(data-label);display:block;color:#17375b;font-weight:750;font-size:.76rem;margin-bottom:.1rem}}',
      '.bc-bens-apostila .bc-bens-flow{min-width:0}',
      '.bc-bens-apostila .bc-bens-flow>:first-child{margin-top:1rem}',
      '@media(max-width:700px){.bc-bens-apostila .civil-source-content{font-size:.98rem;line-height:1.75}.bc-bens-apostila .bc-bens-section{font-size:1.2rem;margin-top:1.7rem}.bc-bens-apostila .bc-bens-subsection{font-size:1.07rem}.bc-bens-apostila .bc-bens-table{font-size:.8rem;padding:.8rem;white-space:pre-line;overflow-wrap:break-word}}'
    ].join('\n');
    document.head.appendChild(style);
  }

  function enhance(body, mode) {
    const article = body?.querySelector('.bc-native-article');
    if (!article || (mode !== 'summary' && mode !== 'complete')) return false;
    const originalPres = [...article.querySelectorAll('pre.civil-source-table')];
    if (!originalPres.length) return false;
    ensureStyles();
    let count = 0;
    for (const pre of originalPres) if (formatPre(pre, mode)) count += 1;
    if (!count) return false;
    article.classList.add('bc-bens-apostila');
    article.dataset.bensSourcePreserved = 'true';
    return true;
  }

  global.CivilBensApostila = {enhance, lineType, toGroups};
})(window);
