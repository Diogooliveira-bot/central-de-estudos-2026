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
    if (/^(?:NÃO|CAI MUITO|PEGADINHA|ATENÇÃO|REGRA DE|REGRA DE BOLSO|EXEMPLO|STJ|VOCÊ PRECISA|LEMBRAR)\b/i.test(text)) return 'callout';
    if (/\S\s{3,}\S/.test(line)) return 'table';
    return 'paragraph';
  }

  // Somente cabeçalhos tabulares explícitos iniciam tabelas.
  // Linhas comuns com espaçamento largo NÃO são tratadas como tabelas.
  const TABLE_HEADINGS = /^(?:Situação|Elemento|Pertença|Tipo|Critério|Espécie|Categoria|Classificação|Bem|Benfeitoria|Natureza|Característica|Modalidade|Objeto|Hipótese)\s{2,}\S/i;

  function isTableHeader(line) {
    return TABLE_HEADINGS.test(line.trimStart());
  }

  function endsTable(line) {
    if (!line.trim()) return true;
    if (/^\s*\d{1,2}\.(?:\d{1,2})?\s+\S/.test(line)) return true;
    if (/^\s*(?:EXEMPLO|ATENÇÃO|REGRA DE BOLSO|PEGADINHA|DICA|IMPORTANTE|NÃO CONFUNDA|CAI MUITO)\s{2,}/i.test(line)) return true;
    // Narrativa do PDF tem um espaço inicial; as linhas tabulares têm dois
    // ou mais, inclusive quando a célula ocupa uma linha complementar.
    if (/^ \S/.test(line) && !/\S\s{3,}\S/.test(line)) return true;
    return false;
  }

  function toGroups(lines, mode) {
    const groups = [];
    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i];
      if (isTableHeader(line)) {
        let end = i;
        for (let j = i + 1; j < lines.length; j += 1) {
          if (endsTable(lines[j])) break;
          end = j;
        }
        if (end > i) {
          groups.push({type:'table',start:i,end});
          i=end;
          continue;
        }
      }
      let type = lineType(line, mode);
      if (type === 'table') type = 'paragraph';
      const prev = groups[groups.length - 1];
      // Só agrupa linhas de continuação de quadros já identificados.
      if (type === 'paragraph' && /^\s{2,}\S/.test(line) && prev?.type === 'callout') type = 'callout';
      if (prev && prev.type === type && type !== 'section' && type !== 'subsection' &&
          (type !== 'paragraph' || line.trim())) {
        prev.end=i;
      } else {
        groups.push({type,start:i,end:i});
      }
    }
    return groups;
  }

  function makeTable(source) {
    const lines = source.split('\n').filter(line => line.trim());
    if (lines.length < 2 || !isTableHeader(lines[0])) return null;
    const first = lines[0];
    const heads = [];
    const start = first.search(/\S/);
    const segments = [...first.slice(start).matchAll(/\S(?:.*?\S)?(?=\s{2,}|$)/g)];
    for (const seg of segments) {
      const value = seg[0].trim();
      if (value) heads.push({label:value, at:start+seg.index});
    }
    if (heads.length < 2 || heads.length > 4) return null;
    const rows = [];
    for (const line of lines.slice(1)) {
      if (isTableHeader(line) && line.trim().split(/\s{2,}/).length === heads.length) continue;
      const parts=heads.map((head,i)=>line.slice(head.at,i+1<heads.length?heads[i+1].at:undefined).trim());
      if (!parts.some(Boolean)) continue;
      const newRow=!!parts[0] && parts.slice(1).some(Boolean);
      if (newRow || !rows.length) {
        rows.push(parts);
      } else {
        const row=rows[rows.length-1];
        parts.forEach((part,i)=>{
          if (part) row[i]+=(row[i]?' ':'')+part;
        });
      }
    }
    if (!rows.length) return null;
    const wrap=document.createElement('div');
    wrap.className='bc-bens-table-wrap';
    const table=document.createElement('table');
    table.className='bc-bens-real-table';
    const thead=document.createElement('thead');
    const hr=document.createElement('tr');
    heads.forEach(head=>{
      const th=document.createElement('th');
      th.scope='col';th.textContent=head.label;hr.appendChild(th);
    });
    thead.appendChild(hr);table.appendChild(thead);
    const tbody=document.createElement('tbody');
    rows.forEach(parts=>{
      const tr=document.createElement('tr');
      heads.forEach((head,i)=>{
        const td=document.createElement('td');
        td.textContent=parts[i]||'';
        td.dataset.label=head.label;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);wrap.appendChild(table);
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
