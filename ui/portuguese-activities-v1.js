/* Base Completa — atividades interativas reutilizáveis do Português Autodidata. */
(function (global) {
'use strict';
if (global.BasePortugueseActivities) return;

const VERSION = '1.0.0';
const STYLE_ID = 'base-portuguese-activities-v1-style';
const ROOT_CLASS = 'pta-v1';
const stateByArticle = new WeakMap();

const CSS = `
.pta-v1{--pta-accent:var(--accent,#38bdb3);--pta-line:var(--line,#30445b);--pta-panel:var(--panel,#101b2c);--pta-panel2:var(--panel2,#15243a);--pta-text:var(--text,#edf4fa);--pta-muted:var(--muted,#9fb0c3);--pta-ok:#2eb67d;--pta-bad:#e06969;color:var(--pta-text)}
.pta-v1 .pta-module-summary{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:12px;align-items:center;margin:22px 0;padding:16px;border:1px solid var(--pta-line);border-radius:14px;background:color-mix(in srgb,var(--pta-panel2) 78%,transparent);font-family:system-ui,sans-serif}
.pta-v1 .pta-module-summary h3,.pta-v1 .pta-module-summary p{margin:0}.pta-v1 .pta-module-summary h3{font-size:15px}.pta-v1 .pta-module-summary p{margin-top:4px;color:var(--pta-muted);font-size:12px}.pta-v1 .pta-module-score{min-width:82px;text-align:right}.pta-v1 .pta-module-score strong{display:block;font-size:23px;color:var(--pta-accent)}.pta-v1 .pta-module-score span{color:var(--pta-muted);font-size:11px}
.pta-v1 .pta-guided{margin:10px 0 22px;padding:0 14px;border:1px solid var(--pta-line);border-radius:12px;background:color-mix(in srgb,var(--pta-panel2) 70%,transparent);font-family:system-ui,sans-serif}.pta-v1 .pta-guided>summary{display:flex;align-items:center;min-height:48px;gap:8px;cursor:pointer;color:var(--pta-accent);font-size:13px;font-weight:800;list-style:none}.pta-v1 .pta-guided>summary::-webkit-details-marker{display:none}.pta-v1 .pta-guided>summary:after{content:'Revelar resposta';margin-left:auto;padding:5px 8px;border:1px solid var(--pta-line);border-radius:999px;color:var(--pta-muted);font-size:10px}.pta-v1 .pta-guided[open]>summary:after{content:'Ocultar resposta'}.pta-v1 .pta-guided-body{padding:4px 0 14px;border-top:1px solid var(--pta-line)}
.pta-v1 .pta-question{position:relative;margin:14px 0 20px;padding:16px;border:1px solid var(--pta-line);border-radius:14px;background:color-mix(in srgb,var(--pta-panel) 92%,transparent);font-family:system-ui,sans-serif;overflow:hidden}.pta-v1 .pta-question:focus-within{border-color:color-mix(in srgb,var(--pta-accent) 65%,var(--pta-line))}.pta-v1 .pta-question-kicker{display:flex;justify-content:space-between;gap:10px;margin:-2px 0 12px;color:var(--pta-muted);font-size:10px;font-weight:850;letter-spacing:.08em;text-transform:uppercase}.pta-v1 .pta-question-id{font-variant-numeric:tabular-nums}.pta-v1 .pta-question-content{font-family:inherit}.pta-v1 .pta-question-content>:first-child{margin-top:0}.pta-v1 .pta-question-content>:last-child{margin-bottom:0}
.pta-v1 .pta-options{display:grid;gap:8px;margin:14px 0 4px;padding:0;border:0}.pta-v1 .pta-option{display:grid;grid-template-columns:22px minmax(0,1fr);gap:10px;align-items:start;padding:12px;border:1px solid var(--pta-line);border-radius:10px;cursor:pointer;background:color-mix(in srgb,var(--pta-panel2) 65%,transparent);line-height:1.45}.pta-v1 .pta-option:hover{border-color:var(--pta-accent)}.pta-v1 .pta-option:has(input:focus-visible){outline:3px solid color-mix(in srgb,var(--pta-accent) 55%,transparent);outline-offset:2px}.pta-v1 .pta-option:has(input:checked){border-color:var(--pta-accent);background:color-mix(in srgb,var(--pta-accent) 15%,var(--pta-panel2))}.pta-v1 .pta-option input{margin-top:3px;accent-color:var(--pta-accent)}.pta-v1 .pta-option.is-correct{border-color:var(--pta-ok);background:color-mix(in srgb,var(--pta-ok) 13%,var(--pta-panel2))}.pta-v1 .pta-option.is-wrong{border-color:var(--pta-bad);background:color-mix(in srgb,var(--pta-bad) 12%,var(--pta-panel2))}
.pta-v1 .pta-writing-label{display:block;margin:14px 0 6px;font-size:12px;font-weight:750}.pta-v1 .pta-writing{display:block;width:100%;min-height:112px;box-sizing:border-box;resize:vertical;padding:12px;border:1px solid var(--pta-line);border-radius:10px;background:var(--pta-panel2);color:inherit;font:inherit;line-height:1.55}.pta-v1 .pta-writing:focus{border-color:var(--pta-accent);outline:3px solid color-mix(in srgb,var(--pta-accent) 35%,transparent)}.pta-v1 .pta-autosave{display:block;margin-top:5px;color:var(--pta-muted);font-size:10px}
.pta-v1 .pta-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}.pta-v1 .pta-button{min-height:42px;padding:9px 14px;border:1px solid var(--pta-accent);border-radius:9px;background:var(--pta-accent);color:#062825;font:800 12px/1 system-ui,sans-serif;cursor:pointer}.pta-v1 .pta-button.secondary{background:transparent;color:var(--pta-accent)}.pta-v1 .pta-button:disabled{cursor:not-allowed;opacity:.5}.pta-v1 .pta-button:focus-visible{outline:3px solid color-mix(in srgb,var(--pta-accent) 45%,transparent);outline-offset:2px}
.pta-v1 .pta-feedback{margin-top:14px;padding:12px 14px;border-left:4px solid var(--pta-accent);border-radius:0 9px 9px 0;background:var(--pta-panel2)}.pta-v1 .pta-feedback[hidden]{display:none}.pta-v1 .pta-feedback.is-correct{border-color:var(--pta-ok)}.pta-v1 .pta-feedback.is-wrong{border-color:var(--pta-bad)}.pta-v1 .pta-feedback.is-pending{border-color:#d7ad55}.pta-v1 .pta-feedback-title{display:block;margin-bottom:7px;font-size:13px}.pta-v1 .pta-feedback-answer{font-family:inherit}.pta-v1 .pta-feedback-answer>:first-child{margin-top:0}.pta-v1 .pta-feedback-answer>:last-child{margin-bottom:0}.pta-v1 .pta-history{margin-top:10px;color:var(--pta-muted);font-size:10px}
.pta-v1 .pta-self-check{display:grid;grid-template-columns:22px minmax(0,1fr);gap:10px;align-items:start}.pta-v1 .pta-self-check input{margin-top:4px;accent-color:var(--pta-accent)}
.pta-v1 .pta-section-summary{margin:18px 0;padding:14px;border:1px solid var(--pta-line);border-radius:12px;background:var(--pta-panel2);font-family:system-ui,sans-serif}.pta-v1 .pta-section-summary strong{color:var(--pta-accent)}.pta-v1 .pta-section-summary p{margin:5px 0;color:var(--pta-muted);font-size:12px}.pta-v1 .pta-source-answer{display:none!important}.pta-v1 .pta-original-options{display:none!important}.pta-v1 [data-pta-source-hidden='true']{display:none!important}
@media(max-width:700px){.pta-v1 .pta-module-summary{grid-template-columns:1fr}.pta-v1 .pta-module-score{text-align:left}.pta-v1 .pta-question{padding:13px;margin:12px 0 18px}.pta-v1 .pta-question-kicker{display:grid}.pta-v1 .pta-actions{display:grid}.pta-v1 .pta-button{width:100%}.pta-v1 .pta-option{padding:11px}}
@media(prefers-reduced-motion:reduce){.pta-v1 *{scroll-behavior:auto!important;transition:none!important}}
`;

function addStyle() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = CSS;
  document.head.appendChild(style);
}
function clean(value) { return String(value || '').replace(/\s+/g, ' ').trim(); }
function fold(value) { return clean(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(); }
function directChildren(article) { return [...article.children]; }
function headingText(el) { return /^H[1-6]$/.test(el?.tagName || '') ? clean(el.textContent) : ''; }
function isH2(el) { return el?.tagName === 'H2'; }
function followingUntil(start, stop) {
  const nodes = [];
  for (let node = start?.nextElementSibling; node && node !== stop; node = node.nextElementSibling) nodes.push(node);
  return nodes;
}
function nextH2(start, predicate) {
  for (let node = start?.nextElementSibling; node; node = node.nextElementSibling) {
    if (isH2(node) && (!predicate || predicate(node))) return node;
  }
  return null;
}
function nextDirect(start, predicate) {
  for (let node = start?.nextElementSibling; node; node = node.nextElementSibling) if (!predicate || predicate(node)) return node;
  return null;
}
function nextSectionH2(start, keepPattern) {
  for (let node = start?.nextElementSibling; node; node = node.nextElementSibling) {
    if (!isH2(node)) continue;
    if (numberFrom(node.textContent) != null) continue;
    if (keepPattern?.test(clean(node.textContent))) continue;
    return node;
  }
  return null;
}
function numberFrom(value) {
  const match = clean(value).match(/^(?:quest[aã]o\s*)?(\d{1,3})(?:\s*[.ªº):—-]|$)/i);
  return match ? Number(match[1]) : null;
}
function userScope() {
  const direct = global.__BASE_COMPLETA_USER_ID__ || global.BASE_COMPLETA_USER?.id;
  if (direct) return String(direct);
  try { return String(localStorage.getItem('central-v6:local-owner') || 'visitante'); } catch (_) { return 'visitante'; }
}
function storageKey(id) { return 'central-v6:exercise-progress:u:' + userScope() + ':pt:v1:' + id; }
function readState(id) {
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey(id)) || 'null');
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch (_) { return {}; }
}
function writeState(id, value) {
  try {
    localStorage.setItem(storageKey(id), JSON.stringify(value));
    global.dispatchEvent(new CustomEvent('base-portuguese-progress', { detail: { id, value } }));
  } catch (_) {}
}
function stableId(moduleId, kind, ordinal) { return 'pt-' + moduleId + '-' + kind + '-' + String(ordinal).padStart(3, '0'); }
function sectionLabel(kind) {
  return ({ guided: 'Prática guiada', independent: 'Prática independente', active: 'Revisão ativa', mastery: 'Miniteste de domínio', exit: 'Teste de saída', cumulative: 'Revisão cumulativa' })[kind] || 'Atividade';
}
function createFeedback() {
  const box = document.createElement('div');
  box.className = 'pta-feedback'; box.hidden = true; box.setAttribute('role', 'status'); box.setAttribute('aria-live', 'polite');
  box.innerHTML = '<strong class="pta-feedback-title"></strong><div class="pta-feedback-answer"></div><div class="pta-history"></div>';
  return box;
}
function showFeedback(box, title, html, mode, history) {
  box.hidden = false;
  box.className = 'pta-feedback' + (mode ? ' is-' + mode : '');
  box.querySelector('.pta-feedback-title').textContent = title;
  box.querySelector('.pta-feedback-answer').innerHTML = html || '';
  box.querySelector('.pta-history').textContent = history ? 'Tentativas registradas: ' + history : '';
}
function parseAlternatives(card) {
  const candidates = [...card.querySelectorAll('.pta-question-content p')];
  for (const paragraph of candidates) {
    const text = clean(paragraph.textContent);
    const markers = [...text.matchAll(/(?:^|\s)([A-E])[).]\s*/g)];
    if (markers.length < 2) continue;
    const choices = [];
    markers.forEach((marker, index) => {
      const start = marker.index + marker[0].length;
      const end = index + 1 < markers.length ? markers[index + 1].index : text.length;
      choices.push({ letter: marker[1].toUpperCase(), text: text.slice(start, end).trim() });
    });
    paragraph.classList.add('pta-original-options');
    return choices.filter(choice => choice.text);
  }
  const separate = candidates.map(p => {
    const match = clean(p.textContent).match(/^([A-E])[).]\s*(.+)$/i);
    return match ? { node: p, letter: match[1].toUpperCase(), text: match[2] } : null;
  }).filter(Boolean);
  if (separate.length >= 2) { separate.forEach(x => x.node.classList.add('pta-original-options')); return separate; }
  return [];
}
function correctLetter(answerText) {
  const text = clean(answerText).replace(/^\d{1,3}\s*[-—.:)]\s*/, '');
  const match = text.match(/^(?:alternativa\s+)?([A-E])(?:\s*[).:—-]|\s|$)/i) || text.match(/(?:resposta|gabarito)\s*[:—-]?\s*([A-E])\b/i);
  return match ? match[1].toUpperCase() : '';
}
function questionType(prompt, alternatives, kind) {
  if (alternatives.length) return 'objective';
  const text = fold(prompt);
  if (/classifi|identifi|indique|associe|relacione/.test(text)) return 'classification';
  if (kind === 'guided') return 'reveal';
  if (text.length < 130 && /qual|quem|quando|onde|quant|complete/.test(text)) return 'short';
  return 'discursive';
}
function moveRangeToContainer(start, end, container) {
  let node = start;
  while (node && node !== end) { const next = node.nextElementSibling; container.appendChild(node); node = next; }
}
function makeQuestion(articleState, start, end, config) {
  const id = stableId(articleState.moduleId, config.kind, config.ordinal);
  const saved = readState(id);
  const reuseListItem = start.tagName === 'LI' && end === start.nextElementSibling;
  const card = reuseListItem ? start : document.createElement('section');
  card.className = 'pta-question'; card.dataset.ptaId = id; card.dataset.ptaKind = config.kind;
  card.setAttribute('aria-labelledby', id + '-label');
  const kicker = document.createElement('div'); kicker.className = 'pta-question-kicker';
  kicker.innerHTML = '<span id="' + id + '-label">' + sectionLabel(config.kind) + '</span><span class="pta-question-id">' + id.toUpperCase() + '</span>';
  const content = document.createElement('div'); content.className = 'pta-question-content';
  if (reuseListItem) {
    while (card.firstChild) content.appendChild(card.firstChild);
    card.append(kicker, content);
  } else {
    start.before(card); card.append(kicker, content); moveRangeToContainer(start, end, content);
  }
  const prompt = clean(content.textContent);
  const alternatives = parseAlternatives(card);
  const type = questionType(prompt, alternatives, config.kind);
  card.dataset.ptaType = type;
  let feedback = createFeedback();
  let controls;
  if (alternatives.length) {
    controls = document.createElement('fieldset'); controls.className = 'pta-options';
    controls.setAttribute('aria-label', 'Alternativas da questão');
    alternatives.forEach(choice => {
      const label = document.createElement('label'); label.className = 'pta-option'; label.dataset.letter = choice.letter;
      const input = document.createElement('input'); input.type = 'radio'; input.name = id; input.value = choice.letter;
      if (saved.choice === choice.letter) input.checked = true;
      input.addEventListener('change', () => { const state = readState(id); state.choice = input.value; state.updatedAt = new Date().toISOString(); writeState(id, state); });
      const span = document.createElement('span'); span.innerHTML = '<b>' + choice.letter + ')</b> ' + choice.text;
      label.append(input, span); controls.appendChild(label);
    });
    card.appendChild(controls);
  } else {
    const label = document.createElement('label'); label.className = 'pta-writing-label'; label.htmlFor = id + '-answer'; label.textContent = 'Sua resposta';
    controls = document.createElement('textarea'); controls.className = 'pta-writing'; controls.id = id + '-answer'; controls.placeholder = 'Escreva seu raciocínio antes de conferir…'; controls.value = saved.text || '';
    const note = document.createElement('small'); note.className = 'pta-autosave'; note.textContent = 'Resposta salva automaticamente na sua conta.';
    let timer; controls.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(() => { const state = readState(id); state.text = controls.value; state.updatedAt = new Date().toISOString(); writeState(id, state); }, 180); });
    card.append(label, controls, note);
  }
  const actions = document.createElement('div'); actions.className = 'pta-actions';
  const check = document.createElement('button'); check.type = 'button'; check.className = 'pta-button'; check.textContent = alternatives.length ? 'Verificar resposta' : 'Conferir resposta';
  const retry = document.createElement('button'); retry.type = 'button'; retry.className = 'pta-button secondary'; retry.textContent = 'Nova tentativa'; retry.hidden = !saved.attempts?.length;
  actions.append(check, retry); card.append(actions, feedback);
  const answer = config.answer || null;
  const answerHtml = answer?.html || '';
  const answerText = answer?.text || '';
  const correct = alternatives.length ? correctLetter(answerText) : '';
  card.dataset.ptaHasAnswer = answerText ? 'true' : 'false';
  card.dataset.ptaAutoCorrect = correct ? 'true' : 'false';
  function updateSummary() { articleState.update(); }
  check.addEventListener('click', () => {
    const state = readState(id), attempts = Array.isArray(state.attempts) ? state.attempts : [];
    if (alternatives.length) {
      const selected = card.querySelector('input[type=radio]:checked');
      if (!selected) { showFeedback(feedback, 'Escolha uma alternativa antes de verificar.', '', 'pending', attempts.length); return; }
      if (!correct) {
        attempts.push({ choice: selected.value, result: 'manual-review', at: new Date().toISOString() });
        state.choice = selected.value; state.attempts = attempts; writeState(id, state);
        showFeedback(feedback, 'Correção automática indisponível no material original.', answerHtml || '<p>Esta questão exige revisão editorial do gabarito.</p>', 'pending', attempts.length);
      } else {
        const ok = selected.value === correct;
        attempts.push({ choice: selected.value, correct: ok, at: new Date().toISOString() });
        state.choice = selected.value; state.correct = ok; state.responded = true; state.attempts = attempts; writeState(id, state);
        card.querySelectorAll('.pta-option').forEach(label => { label.classList.toggle('is-correct', label.dataset.letter === correct); label.classList.toggle('is-wrong', label.dataset.letter === selected.value && !ok); });
        showFeedback(feedback, ok ? 'Resposta correta.' : 'Resposta incorreta. A alternativa correta é ' + correct + '.', answerHtml, ok ? 'correct' : 'wrong', attempts.length);
      }
    } else {
      const text = controls.value.trim();
      if (!text) { showFeedback(feedback, 'Escreva sua resposta antes de conferir.', '', 'pending', attempts.length); return; }
      attempts.push({ text, result: answerText ? 'compared' : 'manual-review', at: new Date().toISOString() });
      state.text = text; state.responded = true; state.attempts = attempts; writeState(id, state);
      showFeedback(feedback, answerText ? 'Compare sua resposta com o modelo.' : 'Resposta registrada; o material original não fornece resposta-modelo.', answerHtml || '<p>Questão registrada para revisão editorial, sem avaliação automática.</p>', answerText ? '' : 'pending', attempts.length);
    }
    retry.hidden = false; updateSummary();
  });
  retry.addEventListener('click', () => {
    if (alternatives.length) { card.querySelectorAll('input[type=radio]').forEach(input => { input.checked = false; }); card.querySelectorAll('.pta-option').forEach(label => label.classList.remove('is-correct', 'is-wrong')); }
    else controls.value = '';
    feedback.hidden = true; const state = readState(id); delete state.choice; delete state.text; delete state.correct; state.responded = false; writeState(id, state); updateSummary();
  });
  if (saved.attempts?.length) {
    const last = saved.attempts[saved.attempts.length - 1];
    showFeedback(feedback, last.correct === true ? 'Última tentativa: correta.' : last.correct === false ? 'Última tentativa: incorreta.' : 'Tentativa anterior registrada.', answerHtml, last.correct === true ? 'correct' : last.correct === false ? 'wrong' : '', saved.attempts.length);
  }
  const record = { id, moduleId: articleState.moduleId, kind: config.kind, type, prompt, answer: answerText, autoCorrect: !!correct, status: answerText ? 'associated' : 'missing-answer' };
  articleState.records.push(record);
  return card;
}
function parseAnswerEntries(start, end) {
  const nodes = followingUntil(start, end);
  const map = new Map(); let current = null; let currentNodes = [];
  function flush() {
    if (current == null || !currentNodes.length) return;
    const box = document.createElement('div'); currentNodes.forEach(node => box.appendChild(node.cloneNode(true)));
    map.set(current, { text: clean(box.textContent).replace(/^\d{1,3}\s*[-—.:)]\s*/, ''), html: box.innerHTML });
  }
  for (const node of nodes) {
    const n = numberFrom(node.textContent);
    const isHeading = /^H[2-4]$/.test(node.tagName);
    if (isHeading && n != null) { flush(); current = n; currentNodes = []; continue; }
    const text = clean(node.textContent);
    const many = [...text.matchAll(/(?:^|\s)(\d{1,3})\s*[-—:]\s*([A-E])(?=\s*(?:[.;]|$))/gi)];
    if (many.length >= 2) {
      many.forEach(match => map.set(Number(match[1]), { text: match[2].toUpperCase(), html: '<p>' + match[1] + ' — ' + match[2].toUpperCase() + '.</p>' }));
      continue;
    }
    const inline = text.match(/^(\d{1,3})\s*[-—.:)]\s*(.+)$/);
    if (inline && !isHeading) {
      flush(); current = Number(inline[1]); currentNodes = [node]; flush(); current = null; currentNodes = []; continue;
    }
    if (current != null) currentNodes.push(node);
  }
  flush();
  return map;
}
function findQuestionStarts(start, end) {
  const nodes = followingUntil(start, end);
  let starts = nodes.filter(node => /^H[2-4]$/.test(node.tagName) && numberFrom(node.textContent) != null);
  if (!starts.length) starts = nodes.filter(node => node.tagName === 'P' && numberFrom(node.textContent) != null);
  return starts;
}
function markAnswerSource(start, end) {
  start.classList.add('pta-source-answer'); start.setAttribute('aria-hidden', 'true');
  followingUntil(start, end).forEach(node => { node.dataset.ptaSourceHidden = 'true'; node.setAttribute('aria-hidden', 'true'); });
}
function processQuestionSection(articleState, start, answerStart, answerEnd, kind) {
  const starts = findQuestionStarts(start, answerStart);
  if (!starts.length) return 0;
  const answers = parseAnswerEntries(answerStart, answerEnd);
  starts.forEach((questionStart, index) => {
    const end = starts[index + 1] || answerStart;
    const n = numberFrom(questionStart.textContent) || index + 1;
    makeQuestion(articleState, questionStart, end, { kind, ordinal: articleState.counters[kind]++, answer: answers.get(n) || answers.get(index + 1) });
  });
  const records = articleState.records.slice(-starts.length);
  if (records.every(record => record.status === 'associated')) markAnswerSource(answerStart, answerEnd);
  return starts.length;
}
function processPractice(articleState) {
  const article = articleState.article;
  const startPattern = /^(?:\d+\.\s*)?(?:pr[aá]tica independente|segunda bateria|bloco [ab]\b|bloco extra\b)/i;
  const answerPattern = /^(?:\d+\.\s*)?(?:gabarito(?: comentado| da| do)?|respostas? comentadas?)/i;
  const seen = new Set();
  for (const start of directChildren(article).filter(node => isH2(node) && startPattern.test(clean(node.textContent)))) {
    if (seen.has(start) || start.dataset.ptaProcessed) continue;
    const answerStart = nextH2(start, node => answerPattern.test(clean(node.textContent)));
    if (!answerStart) continue;
    for (const node of followingUntil(start, answerStart)) if (isH2(node) && startPattern.test(clean(node.textContent))) seen.add(node);
    const answerEnd = nextSectionH2(answerStart, answerPattern);
    processQuestionSection(articleState, start, answerStart, answerEnd, 'independent');
    start.dataset.ptaProcessed = 'true';
  }
}
function processMastery(articleState) {
  const article = articleState.article;
  const starts = directChildren(article).filter(node => isH2(node) && /(?:mini\s*teste de dom[ií]nio|teste final de dom[ií]nio)/i.test(clean(node.textContent)));
  starts.forEach(start => {
    const answerStart = nextDirect(start, node => /^H[2-4]$/.test(node.tagName) && /(?:gabarito do mini teste|respostas? do teste|respostas? do teste final)/i.test(clean(node.textContent)));
    if (!answerStart) return;
    const answerEnd = nextSectionH2(answerStart);
    const count = processQuestionSection(articleState, start, answerStart, answerEnd, 'mastery');
    if (count) addSectionSummary(articleState, start, answerStart, 'mastery');
  });
}
function guidedSplit(nodes) {
  const marker = /^(?:passo(?:\s+a\s+passo|\s*\d*)?|primeiro|agora|an[aá]lise|resolu[cç][aã]o|resposta|conclus[aã]o|logo|portanto|resultado)\b/i;
  let index = nodes.findIndex((node, i) => i > 0 && marker.test(clean(node.textContent)));
  if (index < 0) index = Math.min(nodes.length, nodes.length > 3 ? 2 : 1);
  return Math.max(1, index);
}
function wrapGuided(articleState, promptEnd, end, ordinal) {
  const solutionStart = promptEnd;
  if (!solutionStart || solutionStart === end) return;
  const details = document.createElement('details'); details.className = 'pta-guided';
  const summary = document.createElement('summary'); summary.textContent = 'Raciocínio e resposta';
  const body = document.createElement('div'); body.className = 'pta-guided-body';
  solutionStart.before(details); details.append(summary, body); moveRangeToContainer(solutionStart, end, body);
  const id = stableId(articleState.moduleId, 'guided', ordinal); details.dataset.ptaId = id;
  details.addEventListener('toggle', () => { const state = readState(id); state.revealed = details.open; state.updatedAt = new Date().toISOString(); writeState(id, state); articleState.update(); });
  const saved = readState(id); if (saved.revealed) details.open = true;
  articleState.records.push({ id, moduleId: articleState.moduleId, kind: 'guided', type: 'reveal', prompt: clean(details.previousElementSibling?.textContent), answer: clean(body.textContent), autoCorrect: false, status: 'associated' });
}
function processGuided(articleState) {
  const article = articleState.article;
  const headings = directChildren(article).filter(node => isH2(node) && /pr[aá]tica (?:guiada|\d+\s*[—-])/i.test(clean(node.textContent)) && !/independente/i.test(clean(node.textContent)));
  for (const heading of headings) {
    if (!heading.isConnected || heading.dataset.ptaProcessed) continue;
    const end = nextH2(heading);
    const section = followingUntil(heading, end);
    const subQuestions = section.filter(node => /^H[3-4]$/.test(node.tagName) && /quest[aã]o guiada\s*\d+/i.test(clean(node.textContent)));
    if (subQuestions.length) {
      subQuestions.forEach((sub, index) => {
        const subEnd = subQuestions[index + 1] || end;
        const nodes = followingUntil(sub, subEnd); const split = guidedSplit(nodes);
        wrapGuided(articleState, nodes[split], subEnd, articleState.counters.guided++);
      });
    } else if (section.length) {
      const split = guidedSplit(section);
      wrapGuided(articleState, section[split], end, articleState.counters.guided++);
    }
    heading.dataset.ptaProcessed = 'true';
  }
}
function processActiveReview(articleState) {
  const article = articleState.article;
  directChildren(article).filter(node => isH2(node) && /revis[aã]o ativa/i.test(clean(node.textContent))).forEach(start => {
    const end = nextH2(start); const listItems = followingUntil(start, end).flatMap(node => node.tagName === 'LI' ? [node] : [...node.querySelectorAll('li')]);
    listItems.forEach(item => {
      const itemEnd = item.nextElementSibling;
      const placeholder = document.createElement('span'); item.before(placeholder);
      makeQuestion(articleState, item, itemEnd, { kind: 'active', ordinal: articleState.counters.active++, answer: null });
      placeholder.remove();
    });
  });
}
function processExitTests(articleState) {
  const article = articleState.article;
  directChildren(article).filter(node => isH2(node) && /teste (?:de sa[ií]da|de dom[ií]nio\s*[—-]\s*produ[cç][aã]o pr[oó]pria)/i.test(clean(node.textContent))).forEach(start => {
    const end = nextH2(start); const items = followingUntil(start, end).flatMap(node => node.tagName === 'LI' ? [node] : [...node.querySelectorAll('li')]);
    items.forEach(item => {
      const id = stableId(articleState.moduleId, 'exit', articleState.counters.exit++); const saved = readState(id);
      item.classList.add('pta-question'); item.dataset.ptaId = id; item.dataset.ptaKind = 'exit';
      const content = item.innerHTML; item.innerHTML = '';
      const label = document.createElement('label'); label.className = 'pta-self-check';
      const input = document.createElement('input'); input.type = 'checkbox'; input.checked = !!saved.checked;
      const span = document.createElement('span'); span.innerHTML = content; label.append(input, span); item.appendChild(label);
      input.addEventListener('change', () => { writeState(id, { checked: input.checked, responded: input.checked, updatedAt: new Date().toISOString() }); articleState.update(); });
      articleState.records.push({ id, moduleId: articleState.moduleId, kind: 'exit', type: 'self-assessment', prompt: clean(span.textContent), answer: '', autoCorrect: false, status: 'self-assessment' });
    });
    if (items.length) addSectionSummary(articleState, start, end, 'exit');
  });
}
function processCumulative(articleState) {
  if (articleState.moduleId !== 'review') return;
  const article = articleState.article;
  const part1 = directChildren(article).find(node => isH2(node) && /parte 1\s*[—-]\s*diagn[oó]stico/i.test(clean(node.textContent)));
  const part2 = directChildren(article).find(node => isH2(node) && /parte 2\s*[—-]\s*integra[cç][aã]o/i.test(clean(node.textContent)));
  const answerStart = directChildren(article).find(node => isH2(node) && /gabarito sint[eé]tico/i.test(clean(node.textContent)));
  if (!part1 || !part2 || !answerStart) return;
  const answerEnd = nextH2(answerStart);
  const answerItems = followingUntil(answerStart, answerEnd).flatMap(node => node.tagName === 'LI' ? [node] : [...node.querySelectorAll('li')]);
  const answers = answerItems.map(item => ({ text: clean(item.textContent), html: '<p>' + item.innerHTML + '</p>' }));
  const diagnosticItems = followingUntil(part1, part2).flatMap(node => node.tagName === 'LI' ? [node] : [...node.querySelectorAll('li')]);
  let index = 0;
  diagnosticItems.forEach(item => {
    const itemEnd = item.nextElementSibling;
    makeQuestion(articleState, item, itemEnd, { kind: 'cumulative', ordinal: articleState.counters.cumulative++, answer: answers[index++] });
  });
  const integrationStarts = followingUntil(part2, answerStart).filter(node => isH2(node) && numberFrom(node.textContent) != null);
  integrationStarts.forEach((start, position) => {
    const end = integrationStarts[position + 1] || answerStart;
    makeQuestion(articleState, start, end, { kind: 'cumulative', ordinal: articleState.counters.cumulative++, answer: answers[index++] });
  });
  const cumulative = articleState.records.filter(record => record.kind === 'cumulative');
  if (cumulative.length && cumulative.every(record => record.status === 'associated') && cumulative.length === answers.length) markAnswerSource(answerStart, answerEnd);
  addSectionSummary(articleState, part1, answerStart, 'cumulative');
}
function addSectionSummary(articleState, start, end, kind) {
  const box = document.createElement('div'); box.className = 'pta-section-summary'; box.dataset.ptaSummaryKind = kind;
  end?.before(box); articleState.sectionSummaries.push(box); articleState.update();
}
function addModuleSummary(articleState) {
  const first = articleState.article.querySelector('[data-pta-id]'); if (!first) return;
  const box = document.createElement('section'); box.className = 'pta-module-summary'; box.innerHTML = '<div><h3>Atividades interativas</h3><p>Responda e confira cada item sem consultar um gabarito separado.</p></div><div class="pta-module-score"><strong>0%</strong><span>0 de 0 respondidas</span></div>';
  first.before(box); articleState.moduleSummary = box;
}
function updateState(articleState) {
  const records = articleState.records;
  const answered = records.filter(record => { const state = readState(record.id); return !!(state.responded || state.checked || state.revealed); }).length;
  const auto = records.filter(record => record.autoCorrect); const correct = auto.filter(record => readState(record.id).correct === true).length;
  const pct = records.length ? Math.round(answered / records.length * 100) : 0;
  if (articleState.moduleSummary) {
    articleState.moduleSummary.querySelector('strong').textContent = pct + '%';
    articleState.moduleSummary.querySelector('span').textContent = answered + ' de ' + records.length + ' atividades feitas';
  }
  articleState.sectionSummaries.forEach(box => {
    const kind = box.dataset.ptaSummaryKind; const subset = records.filter(record => record.kind === kind);
    const done = subset.filter(record => { const state = readState(record.id); return !!(state.responded || state.checked); }).length;
    const scored = subset.filter(record => record.autoCorrect); const hits = scored.filter(record => readState(record.id).correct === true).length;
    const pending = subset.length - done;
    box.innerHTML = '<strong>Resumo: ' + done + '/' + subset.length + ' concluídas</strong><p>' + (scored.length ? hits + ' acertos em ' + scored.length + ' questões com correção automática. ' : '') + pending + ' pendente(s).</p>';
  });
}
function enhance(article, options) {
  if (!article || article.dataset.ptaV1Enhanced === 'true') return stateByArticle.get(article)?.records || [];
  const contentRoot = article.matches?.('.pt-doc') ? article : article.querySelector?.('.pt-doc') || article;
  addStyle(); article.dataset.ptaV1Enhanced = 'true'; contentRoot.classList.add(ROOT_CLASS);
  const articleState = { article: contentRoot, moduleId: options?.moduleId || article.dataset.moduleId || 'unknown', records: [], counters: { guided: 1, independent: 1, active: 1, mastery: 1, exit: 1, cumulative: 1 }, sectionSummaries: [], moduleSummary: null, update() { updateState(this); } };
  stateByArticle.set(article, articleState); stateByArticle.set(contentRoot, articleState);
  processGuided(articleState);
  if (articleState.moduleId === 'review') processCumulative(articleState);
  else {
    processPractice(articleState);
    processMastery(articleState);
    processActiveReview(articleState);
    processExitTests(articleState);
  }
  addModuleSummary(articleState); articleState.update();
  article.dataset.ptaRecordCount = String(articleState.records.length); contentRoot.dataset.ptaRecordCount = String(articleState.records.length);
  return articleState.records.slice();
}
function audit(article) { return (stateByArticle.get(article)?.records || []).map(record => ({ ...record })); }
global.BasePortugueseActivities = { version: VERSION, enhance, audit };
})(window);
