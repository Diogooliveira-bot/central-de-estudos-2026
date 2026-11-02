/* Base Completa — questões do texto em modo interativo, nos leitores de teoria.
   Formatos reconhecidos (sem alterar o conteúdo salvo):
   - múltipla escolha com alternativas "A) ... B) ..." e "Gabarito: X." (CPP, ADM, CPC);
   - Certo/Errado com "Gabarito: CERTO|ERRADO" (CPC e demais);
   - "Resposta comentada. B." ou "Resposta comentada. Gabarito B." depois das
     alternativas (Constitucional): múltipla escolha e certo/errado com botões;
   - "Teste de compreensão" + "Resposta comentada. Sim./Não." (Constitucional): botões
     Sim/Não; demais respostas abertas continuam sob demanda ("Mostrar resposta").
   O gabarito e a explicação ficam ocultos até o aluno responder. */
(function (g) {
  'use strict';
  if (g.CentralReaderQuestions) return;
  const GABARITO = /Gabarito\s*(?:oficial)?\s*[:\-–]\s*(?:letra\s*)?(CERTO|ERRADO|Certo|Errado|[A-E])\b/;
  const ALT_LINE = /^\s*([A-E])\)\s+/;
  const COMMENTED = /^Resposta comentada\.\s*(?:Gabarito\s*)?([A-E])\./;
  const YES_NO = /^Resposta comentada\.\s*(Sim|Não)\b/;
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
      if (/^(UL|OL)$/.test(el.tagName)) {
        const items = [...el.children].map(li => ({html: li.innerHTML.trim(), text: li.textContent.trim()}));
        if (!found.length && items.length >= 2 && items.every(l => ALT_LINE.test(l.text))) return {nodes: [el], alts: items};
        // Lista sem letras logo antes do gabarito: a ordem impressa corresponde a A, B, C...
        if (!found.length && steps === 0 && items.length >= 2 && items.length <= 5 && !items.some(l => ALT_LINE.test(l.text)))
          return {nodes: [el], alts: items.map((l, i) => ({html: l.html, text: 'ABCDE'[i] + ') ' + l.text}))};
        break;
      }
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

  // "Explicação: ..." logo depois do gabarito também fica oculta até responder.
  function explanationsAfter(el) {
    const list = [];
    for (let next = el.nextElementSibling; next && list.length < 3 && /^(Explica[çc][ãa]o|Coment[áa]rio|Justificativa|Fundamento)\s*[:.\-–]/i.test(next.textContent.trim()); next = next.nextElementSibling) list.push(next);
    return list;
  }
  // "Enunciado? A) ... B) ... C) ..." num único elemento (sem quebra de linha).
  function inlineOptions(el) {
    if (!el || /^H[1-6]$/.test(el.tagName) || el.dataset.bcIq || el.matches('.bc-iq, .bc-iq *')) return null;
    const parts = el.innerHTML.split(/(?:^|\s|<br\s*\/?>)([A-E])\)\s+/);
    if (parts.length < 5) return null;
    const options = [];
    for (let i = 1; i < parts.length; i += 2) {
      if (parts[i] !== 'ABCDE'[options.length]) return null;
      options.push({letter: parts[i], value: parts[i], html: parts[i + 1].trim()});
    }
    return {statement: parts[0].trim(), options};
  }
  function choiceFromLines(found) {
    return found.alts.map(line => {
      const letter = line.text.match(ALT_LINE)[1];
      return {letter, value: letter, html: line.html.replace(/^\s*(?:<[^>]+>\s*)*[A-E]\)\s*/, '')};
    });
  }

  function convertGabarito(el) {
    const text = el.textContent, match = text.match(GABARITO);
    if (!match) return;
    el.dataset.bcIq = '1';
    const value = match[1].toUpperCase();
    const before = text.slice(0, text.search(/Gabarito/));
    if (/^[A-E]$/.test(value) && /(?:^|\s)A\)\s+[\s\S]*\sB\)\s+/.test(before) && inlineChoice(el, [null, value])) return;
    if (before.trim().length >= 25 && splitEmbedded(el)) return;
    const reveal = [el, ...explanationsAfter(el)];
    const found = /^[A-E]$/.test(value) ? alternativesBefore(el) : null;
    if (found) {
      const options = choiceFromLines(found);
      if (!options.some(o => o.value === value)) return;
      found.nodes[0].before(widget('choice', options, value, reveal));
      found.nodes.forEach(node => node.remove());
      reveal.forEach(x => { x.hidden = true; });
      return;
    }
    const prev = el.previousElementSibling, inline = /^[A-E]$/.test(value) ? inlineOptions(prev) : null;
    if (inline && inline.options.some(o => o.value === value)) {
      const box = widget('choice', inline.options, value, reveal);
      if (inline.statement.replace(/<[^>]+>/g, '').trim()) { prev.innerHTML = inline.statement; prev.after(box); }
      else prev.replaceWith(box);
      reveal.forEach(x => { x.hidden = true; });
      return;
    }
    if (/^(CERTO|ERRADO)$/.test(value)) {
      el.before(widget('tf', [{value: 'CERTO', html: 'Certo'}, {value: 'ERRADO', html: 'Errado'}], value, reveal));
      reveal.forEach(x => { x.hidden = true; });
    }
  }

  // <details class="question">: enunciado no <summary>, alternativas em <ol>/<li> e
  // gabarito em .answer; ou alternativas antes de um <details> "Ver gabarito".
  function convertDetails(details) {
    const mark = [...details.querySelectorAll('b, strong')].find(x => GABARITO.test(x.textContent));
    const match = (mark || details).textContent.match(GABARITO);
    if (!match || details.dataset.bcIq) return;
    const value = match[1].toUpperCase();
    const summary = details.querySelector(':scope > summary');
    const items = [...details.querySelectorAll(':scope > ol > li, :scope > ul > li')].filter(li => ALT_LINE.test(li.textContent));
    if (items.length >= 2 && /^[A-E]$/.test(value)) {
      const options = items.map(li => ({letter: li.textContent.trim()[0], value: li.textContent.trim()[0], html: li.innerHTML.replace(/^\s*(?:<[^>]+>\s*)*[A-E]\)\s*/, '')}));
      if (!options.some(o => o.value === value)) return;
      details.dataset.bcIq = '1';
      const item = document.createElement('div');
      item.className = 'bc-iq-item ' + (details.className || ''); item.dataset.bcIq = '1';
      const statement = document.createElement('p');
      statement.className = 'bc-iq-statement'; statement.innerHTML = summary ? summary.innerHTML : '';
      const answer = document.createElement('div');
      answer.className = 'bc-iq-answer';
      [...details.children].filter(c => c !== summary && !c.matches('ol, ul')).forEach(c => answer.append(c));
      answer.hidden = true;
      item.append(statement, widget('choice', options, value, [answer]), answer);
      details.replaceWith(item);
      return;
    }
    const found = /^[A-E]$/.test(value) ? alternativesBefore(details) : null;
    const prev = details.previousElementSibling, inline = !found && /^[A-E]$/.test(value) ? inlineOptions(prev) : null;
    const options = found ? choiceFromLines(found) : inline?.options;
    if (options && options.some(o => o.value === value)) {
      details.dataset.bcIq = '1'; details.open = true; details.hidden = true;
      const box = widget('choice', options, value, [details]);
      if (found) { found.nodes[0].before(box); found.nodes.forEach(node => node.remove()); }
      else if (inline.statement.replace(/<[^>]+>/g, '').trim()) { prev.innerHTML = inline.statement; prev.after(box); }
      else prev.replaceWith(box);
      return;
    }
    if (/^(CERTO|ERRADO)$/.test(value)) {
      details.dataset.bcIq = '1'; details.open = true; details.hidden = true;
      details.before(widget('tf', [{value: 'CERTO', html: 'Certo'}, {value: 'ERRADO', html: 'Errado'}], value, [details]));
    }
  }

  // Alternativas A) B)... seguidas de "Resposta comentada. B." (sem "Gabarito:").
  function convertCommented(el) {
    const match = el.textContent.trim().match(COMMENTED);
    if (!match) return false;
    const found = alternativesBefore(el);
    if (!found) return false;
    const options = found.alts.map(line => {
      const letter = line.text.match(ALT_LINE)[1];
      return {letter, value: letter, html: line.html.replace(/^\s*(?:<[^>]+>\s*)*[A-E]\)\s*/, '')};
    });
    if (!options.some(o => o.value === match[1])) return false;
    el.dataset.bcIq = '1';
    found.nodes[0].before(widget('choice', options, match[1], [el]));
    found.nodes.forEach(node => node.remove());
    el.hidden = true;
    return true;
  }

  function convertSelfCheck(question) {
    const answer = question.nextElementSibling;
    if (!answer?.matches('.cf-native-callout.answer') || !/^Resposta comentada/.test(answer.textContent.trim())) return;
    question.dataset.bcIq = '1';
    answer.dataset.bcIq = '1';
    answer.hidden = true;
    const yesNo = answer.textContent.trim().match(YES_NO);
    if (yesNo) {
      question.after(widget('tf', [{value: 'Sim', html: 'Sim'}, {value: 'Não', html: 'Não'}], yesNo[1], [answer]));
      return;
    }
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'bc-iq-reveal'; button.textContent = 'Mostrar resposta';
    button.addEventListener('click', () => {
      answer.hidden = !answer.hidden;
      button.textContent = answer.hidden ? 'Mostrar resposta' : 'Ocultar resposta';
    });
    question.after(button);
  }

  // "Gabarito de controle" de perguntas abertas (revisão ativa): respostas sob demanda.
  function convertAnswerKey(label) {
    const hide = [];
    for (let next = label.nextElementSibling; next && hide.length < 4 && !/^(H[1-6]|HR)$/.test(next.tagName); next = next.nextElementSibling) hide.push(next);
    if (!hide.length) return;
    label.dataset.bcIq = '1';
    hide.forEach(el => { el.hidden = true; el.dataset.bcIq = '1'; });
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'bc-iq-reveal'; button.textContent = 'Mostrar respostas';
    button.addEventListener('click', () => {
      const show = hide[0].hidden;
      hide.forEach(el => { el.hidden = !show; });
      button.textContent = show ? 'Ocultar respostas' : 'Mostrar respostas';
    });
    label.after(button);
  }

  function process(article) {
    article.querySelectorAll('p,h3,h4').forEach(el => {
      if (!el.dataset.bcIq && /^Gabarito de controle:?$/i.test(el.textContent.trim())) convertAnswerKey(el);
    });
    article.querySelectorAll('details').forEach(d => { if (/Gabarito/.test(d.textContent)) convertDetails(d); });
    article.querySelectorAll('p,li,div:not([class^="bc-iq"])').forEach(el => {
      if (checked.has(el) || el.dataset.bcIq || el.closest('.bc-iq, .bc-iq-answer, details[data-bc-iq]') || el.querySelector('p,li,div')) return;
      checked.add(el);
      if (GABARITO.test(el.textContent)) convertGabarito(el);
      else if (el.matches('.cf-native-callout.answer') && COMMENTED.test(el.textContent.trim())) convertCommented(el);
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
