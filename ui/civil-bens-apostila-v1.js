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

  function toGroups(lines, mode) {
    const groups = [];
    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i];
      let type = lineType(line, mode);
      const prev = groups[groups.length - 1];
      // A linha com recuo após um item/quadros continua no mesmo bloco.
      if (type === 'paragraph' && /^\s{2,}\S/.test(line) &&
          (prev?.type === 'bullet' || prev?.type === 'table' || prev?.type === 'callout')) {
        type = prev.type;
      }
      // Um título é sempre um bloco independente.
      if (prev && prev.type === type && type !== 'section' && type !== 'subsection' &&
          (type !== 'paragraph' || line.trim())) {
        prev.end = i;
      } else {
        groups.push({type, start: i, end: i});
      }
    }
    return groups;
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
      block.textContent = lines.slice(group.start, group.end + 1).join('\n');
      output.appendChild(block);
      if (group.end < lines.length - 1) output.appendChild(document.createTextNode('\n'));
    }

    // Garantia de integridade: nem um espaço, sinal ou artigo pode desaparecer.
    if (output.textContent !== original) {
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
