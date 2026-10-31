/* Base Completa — questões do texto em modo interativo, nos leitores de teoria.
   Formatos reconhecidos (sem alterar o conteúdo salvo):
   - múltipla escolha com alternativas "A) ... B) ..." e "Gabarito: X." (CPP, ADM, CPC);
   - Certo/Errado com "Gabarito: CERTO|ERRADO" (CPC e demais);
   - "Teste de compreensão" + "Resposta comentada" (Constitucional): resposta sob demanda.
   O gabarito e a explicação ficam ocultos até o aluno responder. */
(function (g) {
  'use strict';
  if (g.CentralReaderQuestions) return;
  const GABARITO = /Gabarito\s*(?:oficial)?\s*[:\-–]\s*(?:letra\s*)?(CERTO|ERRADO|Certo|Errado|[A-E])\b/;
  const ALT_LINE = /^\s*([A-E])\)\s+/;
  const checked = new WeakSet();
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));

  function linesOf(el) {
    return el.innerHTML.split(/<br\s*\/?>|\n/i).map(html => {
      const t = document.createElement('div'); t.innerHTML = html;
      return {html: html.trim(), text: t.textContent.trim()};
    }).filter(line => line.text);
  }
  // Alternativas em um elemento (uma por linha) ou em elementos irmãos seguidos.
  function alternativesBefore(gabarito) {
    const found = [];
    for (let el = gabarito.previousElementSibling, steps = 0; el && steps < 8 && !/^H[1-6]$/.test(el.tagName); el = el.previousElementSibling, steps++) {
      const lines = linesOf(el);
      if (lines.length >= 2 && lines.every(l => ALT_LINE.test(l.text))) return {nodes: [el], alts: lines};
      if (lines.length === 1 && ALT_LINE.test(lines[0].text)) { found.unshift({el, line: lines[0]}); continue; }
      if (found.length) break;
    }
    return found.length >= 2 ? {nodes: found.map(x => x.el), alts: found.map(x => x.line)} : null;
  }

  function widget(kind, options, correct, reveal) {
    const box = document.createElement('div');
    box.className = 'bc-iq bc-iq-' + kind;
    box.innerHTML = '<div class="bc-iq-options">' + options.map(o =>
      '<button type="button" class="bc-iq-option" data-value="' + esc(o.value) + '">' +
      (o.letter ? '<b>' + esc(o.letter) + ')</b> ' : '') + o.html + '</button>').join('') +
      '</div><p class="bc-iq-feedback" role="status" hidden></p>';
    const feedback = box.querySelector('.bc-iq-feedback');
    box.querySelectorAll('.bc-iq-option').forEach(button => button.addEventListener('click', () => {
      if (box.classList.contains('answered')) return;
      box.classList.add('answered');
      const ok = button.dataset.value === correct;
      box.querySelectorAll('.bc-iq-option').forEach(b => {
        b.disabled = true;
        if (b.dataset.value === correct) b.classList.add('correct');
        else if (b === button) b.classList.add('wrong');
      });
      feedback.hidden = false;
      feedback.textContent = ok ? '✓ Você acertou.' : '✕ Resposta incorreta.';
      feedback.className = 'bc-iq-feedback ' + (ok ? 'ok' : 'bad');
      reveal.forEach(el => { el.hidden = false; });
      const retry = document.createElement('button');
      retry.type = 'button'; retry.className = 'bc-iq-retry'; retry.textContent = 'Refazer';
      retry.addEventListener('click', () => {
        box.classList.remove('answered');
        box.querySelectorAll('.bc-iq-option').forEach(b => { b.disabled = false; b.classList.remove('correct', 'wrong'); });
        feedback.hidden = true; retry.remove();
        reveal.forEach(el => { el.hidden = true; });
      });
      feedback.after(retry);
    }));
    return box;
  }

  function inlineChoice(el, match) {
    // "Enunciado: A) ... B) ... Gabarito: B. Explicação" em um único item.
    const html = el.innerHTML, at = html.search(/Gabarito\s*(?:oficial)?\s*[:\-–]/);
    const head = html.slice(0, at), tail = html.slice(at);
    const parts = head.split(/(?:^|\s)([A-E])\)\s+/);
    if (parts.length < 5) return false;
    const statement = parts[0].trim();
    const options = [];
    for (let i = 1; i < parts.length; i += 2) options.push({letter: parts[i], value: parts[i], html: parts[i + 1].trim()});
    if (!options.some(o => o.value === match[1])) return false;
    const answer = document.createElement('div');
    answer.className = 'bc-iq-answer'; answer.innerHTML = tail; answer.hidden = true;
    el.innerHTML = '<div class="bc-iq-statement">' + statement + '</div>';
    el.append(widget('choice', options, match[1], [answer]), answer);
    return true;
  }

  // Enunciado e gabarito no mesmo elemento (às vezes várias "Questão N" num só
  // parágrafo): cada questão vira enunciado visível + botões + resposta oculta.
  function splitEmbedded(el) {
    const segments = el.innerHTML.split(/(?=Quest[ãa]o\s+\d+\b)/);
    const fragment = document.createDocumentFragment();
    let converted = 0;
    segments.forEach(segment => {
      const holder = document.createElement('div'); holder.innerHTML = segment;
      const match = holder.textContent.match(GABARITO), at = segment.search(/Gabarito\s*(?:oficial)?\s*[:\-–]/);
      const value = match && match[1].toUpperCase();
      if (!match || at < 0 || !/^(CERTO|ERRADO)$/.test(value)) {
        if (holder.textContent.trim()) { const p = document.createElement('p'); p.innerHTML = segment; fragment.append(p); }
        return;
      }
      const item = document.createElement('div');
      item.className = 'bc-iq-item'; item.dataset.bcIq = '1';
      const statement = document.createElement('p');
      statement.className = 'bc-iq-statement'; statement.innerHTML = segment.slice(0, at);
      const answer = document.createElement('p');
      answer.className = 'bc-iq-answer'; answer.innerHTML = segment.slice(at); answer.hidden = true;
      item.append(statement, widget('tf', [{value: 'CERTO', html: 'Certo'}, {value: 'ERRADO', html: 'Errado'}], value, [answer]), answer);
      fragment.append(item); converted++;
    });
    if (!converted) return false;
    el.replaceWith(fragment);
    return true;
  }

  function convertGabarito(el) {
    const text = el.textContent, match = text.match(GABARITO);
    if (!match) return;
    el.dataset.bcIq = '1';
    const value = match[1].toUpperCase();
    const before = text.slice(0, text.search(/Gabarito/));
    if (/^[A-E]$/.test(value) && /(?:^|\s)A\)\s+[\s\S]*\sB\)\s+/.test(before) && inlineChoice(el, [null, value])) return;
    if (before.trim().length >= 25 && splitEmbedded(el)) return;
    const found = /^[A-E]$/.test(value) ? alternativesBefore(el) : null;
    if (found) {
      const options = found.alts.map(line => {
        const letter = line.text.match(ALT_LINE)[1];
        return {letter, value: letter, html: line.html.replace(/^\s*(?:<[^>]+>\s*)*[A-E]\)\s*/, '')};
      });
      if (!options.some(o => o.value === value)) return;
      found.nodes[0].before(widget('choice', options, value, [el]));
      found.nodes.forEach(node => node.remove());
      el.hidden = true;
      return;
    }
    if (/^(CERTO|ERRADO)$/.test(value)) {
      el.before(widget('tf', [{value: 'CERTO', html: 'Certo'}, {value: 'ERRADO', html: 'Errado'}], value, [el]));
      el.hidden = true;
    }
  }

  function convertSelfCheck(question) {
    const answer = question.nextElementSibling;
    if (!answer?.matches('.cf-native-callout.answer') || !/^Resposta comentada/.test(answer.textContent.trim())) return;
    question.dataset.bcIq = '1';
    answer.hidden = true;
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'bc-iq-reveal'; button.textContent = 'Mostrar resposta';
    button.addEventListener('click', () => {
      answer.hidden = !answer.hidden;
      button.textContent = answer.hidden ? 'Mostrar resposta' : 'Ocultar resposta';
    });
    question.after(button);
  }

  function process(article) {
    article.querySelectorAll('p,li,div:not([class^="bc-iq"])').forEach(el => {
      if (checked.has(el) || el.dataset.bcIq || el.closest('.bc-iq, .bc-iq-answer') || el.querySelector('p,li,div')) return;
      checked.add(el);
      if (GABARITO.test(el.textContent)) convertGabarito(el);
    });
    article.querySelectorAll('.cf-native-callout.question').forEach(q => {
      if (!q.dataset.bcIq && /^Teste de compreens/.test(q.textContent.trim())) convertSelfCheck(q);
    });
  }

  const style = document.createElement('style');
  style.textContent =
    '.bc-iq{margin:.6em 0 1em;padding:12px;border:1px solid var(--border,#d9e2ea);border-radius:12px;background:var(--surface,#fff)}' +
    '.bc-iq-options{display:grid;gap:8px}.bc-iq-tf .bc-iq-options{grid-template-columns:1fr 1fr}' +
    '.bc-iq-option{font:inherit;text-align:left;padding:10px 12px;border:1px solid var(--border,#cfd9e2);border-radius:10px;background:transparent;color:inherit;cursor:pointer;line-height:1.45}' +
    '.bc-iq-tf .bc-iq-option{text-align:center;font-weight:700}' +
    '.bc-iq-option:hover:not(:disabled){border-color:#1d7f86}.bc-iq-option:disabled{cursor:default}' +
    '.bc-iq-option.correct{border-color:#1f8a52;background:rgba(31,138,82,.12)}.bc-iq-option.wrong{border-color:#c0392b;background:rgba(192,57,43,.1)}' +
    '.bc-iq-feedback{margin:10px 0 0;font-weight:700}.bc-iq-feedback.ok{color:#1f8a52}.bc-iq-feedback.bad{color:#c0392b}' +
    '.bc-iq-retry,.bc-iq-reveal{font:600 14px system-ui,sans-serif;margin:8px 0;padding:7px 12px;border-radius:9px;border:1px solid var(--border,#cfd9e2);background:transparent;color:inherit;cursor:pointer}';
  document.head.appendChild(style);

  let queued = false;
  function scan() {
    queued = false;
    document.querySelectorAll('.bc-native-reader-overlay .bc-native-article').forEach(process);
  }
  new MutationObserver(() => { if (!queued) { queued = true; setTimeout(scan, 80); } })
    .observe(document.documentElement, {childList: true, subtree: true});
  g.CentralReaderQuestions = {process};
})(window);
