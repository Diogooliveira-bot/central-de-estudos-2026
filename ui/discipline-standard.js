/* Shared study presentation: every renderer keeps its content, handlers, and storage. */
(function () {
  'use strict';
  if (window.CentralDisciplineStandard) return;
  const MODULES = '.civil-module[data-civil-analista],.cf-module[data-cf],.cf-module[data-penal],.cf-module[data-cpc],.cf-module[data-ptn-module],.cf-module[data-pt-current],.cpp-mod[data-cpp-num],.topic-item[data-uid],.topic-item[data-cpp-native-module]';
  let observer, scheduled = false;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const read = key => { try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch (_) { return null; } };
  const meter = value => Number.isFinite(value) ? '<div class="csp-meter" aria-hidden="true"><span style="width:' + Math.max(0, Math.min(100, value)) + '%"></span></div>' : '';
  function identity(module) {
    const subject = module.closest('.subject').dataset.id;
    const id = module.dataset.civilAnalista || module.dataset.civilNativeModule || module.dataset.ptCurrent || module.dataset.ptnModule || module.dataset.cf || module.dataset.penal || module.dataset.cpc || module.dataset.rlmModule || module.dataset.cppNativeModule || module.dataset.cppNum || module.dataset.ptraModule || module.dataset.uid;
    return { subject, id, key: subject + ':' + id };
  }
  function bodyOf(module) { return module.querySelector('.civil-module-body,.cv-module-body,.cf-module-body,.cpp-mod-body,.ptra-native-mod-body,.detail-panel'); }
  function standardizeStudyCards(body, meta) {
    // Preserve RLM M01's special speed-training sequence; all remaining study
    // cards follow the approved Administrative module order without replacing nodes.
    if (meta.subject === 'rlm' && /^M0?1$/i.test(meta.id)) return;
    const containers = body.querySelectorAll('.bc-native-material-grid,.adm-native-material-grid,.cv-cards,.ptra-native-card-grid,.cf-native-cards,.pt-cf-cards');
    containers.forEach((container) => {
      const cards = Array.from(container.children).filter((node) => node.matches('article,button'));
      if (!cards.length) return;
      container.classList.add('ds-study-material-grid');
      if (!container.hasAttribute('aria-label')) container.setAttribute('aria-label','Materiais e exercícios do módulo');
      const kindOf = (card) => {
        const text = (card.textContent || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
        if (/infografico|mapa mental|visual real/.test(text)) return 'infographic';
        if (/teoria completa|conteudo completo|versao completa/.test(text)) return 'complete';
        if (/versao resumida|versao de revisao|teoria resumida|conteudo resumido|resumo/.test(text)) return 'summary';
        return 'other';
      };
      const rank = { complete:0, summary:1, infographic:2, other:3 };
      const identified = cards.map((card, index) => ({ card, index, kind:kindOf(card) }));
      identified.forEach(({ card, kind }) => {
        card.classList.add('ds-study-material-card');
        card.dataset.dsMaterialKind = kind;
      });
      const ordered = identified.slice().sort((a,b) => rank[a.kind]-rank[b.kind] || a.index-b.index);
      if (ordered.some((item,index) => item.card !== cards[index])) ordered.forEach(({card}) => container.appendChild(card));
    });
  }
  function removeAdmLegacyDuplicates(body) {
    // ADM now has consolidated TEC/QC filters and per-filter performance controls
    // inside its native zone. Drop only the obsolete parallel blocks; keep records,
    // current filters, curated sharing links, and the native notes store untouched.
    body.querySelectorAll(':scope > .adm-native-preserved:not(.adm-native-sharing),:scope > .adm-native-external-entry')
      .forEach(node => node.remove());
    const zone = body.querySelector(':scope > .adm-native-zone');
    if (!zone) return;
    const head = zone.querySelector(':scope > .adm-native-zone-head');
    const progress = zone.querySelector(':scope > .adm-native-progress-panel');
    const materials = zone.querySelector(':scope > .adm-native-material-grid');
    const notes = body.querySelector(':scope > .adm-native-notes') || zone.querySelector(':scope > .adm-native-notes');
    const tools = zone.querySelector(':scope > .adm-native-module-tools');
    zone.querySelector(':scope > .adm-native-hint')?.remove();
    // Match the approved ADM screenshot: progress, complete, summary, infographic,
    // notes, QC/TEC panels, then tools. Moving native nodes keeps their handlers.
    if (head && progress && head.nextElementSibling !== progress) head.after(progress);
    if (materials) {
      const cards = Array.from(materials.children);
      const rank = node => (node.dataset.dsMaterialKind || node.dataset.kind) === 'complete' ? 0 : (node.dataset.dsMaterialKind || node.dataset.kind) === 'summary' ? 1 : (node.dataset.dsMaterialKind || node.dataset.kind) === 'infographic' || /infograf|visual/i.test(node.textContent || '') ? 2 : 3;
      cards.sort((a,b) => rank(a)-rank(b)).forEach(node => materials.appendChild(node));
      if (progress && progress.nextElementSibling !== materials) progress.after(materials);
      if (notes && notes.parentElement !== zone) zone.appendChild(notes);
      if (notes && materials.nextElementSibling !== notes) materials.after(notes);
    }
    const filterPanels = Array.from(zone.querySelectorAll(':scope > .bcq-module-panels'));
    filterPanels.forEach(panel => { if (notes && notes.nextElementSibling !== panel) notes.after(panel); });
    if (tools) zone.appendChild(tools);
  }

  function arrangeStudySections(body, meta) {
    if (body.querySelector(':scope > .adm-native-zone')) return;
    const materials = body.querySelector('.ds-study-material-grid');
    const footer = body.querySelector(':scope > .ds-module-footer');
    if (!materials) return;
    const nativeNote = body.querySelector(':scope > .ds-notes,:scope > .cf-native-note,:scope > .ptra-native-notes,:scope > .cms-note-final');
    let notesNode = nativeNote;
    const footerNotes = footer?.querySelector('.ds-notes');
    if (!notesNode && footerNotes) {
      notesNode = footerNotes;
      body.insertBefore(notesNode, footer);
    }
    if (notesNode && materials.nextElementSibling !== notesNode) materials.after(notesNode);

    const panels = Array.from(body.querySelectorAll(':scope > [data-bcq-module-panel]'));
    panels.forEach(panel => { if (notesNode && notesNode.nextElementSibling !== panel) notesNode.after(panel); });

    const tools = footer?.querySelector('.ds-footer-tools');
    if (footer && panels.length && footer.previousElementSibling !== panels[panels.length - 1]) {
      body.appendChild(footer);
    }
    if (tools && tools.parentElement === footer) {
      body.appendChild(tools);
    }
    const review = footer?.querySelector('.ds-footer-review');
    if (review && tools && tools.nextElementSibling !== review) body.appendChild(review);
    // The per-filter + controls are the live entry point. Keep legacy round data
    // and its summary, while suppressing a second manual entry form only when a
    // module actually has filter cards.
    const questionPanel = footer?.querySelector(':scope > .ds-footer-questions');
    if (questionPanel) questionPanel.hidden = panels.some(panel => panel.querySelector('.bcq-card'));
  }

  function arrangeNativeCourseLayouts(root) {
    root.querySelectorAll('.subject[data-id="civil"] .cv-module[data-civil-native-module]').forEach(module => {
      const body = module.querySelector('.cv-module-body'), zone = body?.querySelector('.cv-zone');
      if (!body || !zone) return;
      const cards = zone.querySelector('.cv-cards'), tools = zone.querySelector('.cv-tools');
      const below = body.querySelector('.cv-below');
      const note = below?.querySelector('.cv-panel:not([data-civil-tec])');
      const tec = below?.querySelector('[data-civil-tec]');
      if (cards && note) { zone.appendChild(note); cards.after(note); }
      if (note && tec) note.after(tec); else if (cards && tec) cards.after(tec);
      const panel = body.querySelector(':scope > [data-bcq-module-panel]');
      if (panel && note) note.after(panel); else if (panel && cards) cards.after(panel);
      if (tools) zone.appendChild(tools);
    });
    root.querySelectorAll('.subject[data-id="ptra"] .ptra-native-mod[data-ptra-module]').forEach(module => {
      const body = module.querySelector('.ptra-native-mod-body'), zone = body?.querySelector('.ptra-native-zone');
      if (!body || !zone) return;
      const cards = zone.querySelector('.ptra-native-card-grid'), tools = zone.querySelector('.ptra-native-tools');
      const notes = zone.querySelector('.ptra-native-notes'), tec = zone.querySelector('.ptra-native-tec');
      const bottom = zone.querySelector('.ptra-native-bottom');
      if (notes && cards && notes.parentElement !== zone) { zone.appendChild(notes); cards.after(notes); }
      if (tec && notes) notes.after(tec);
      if (bottom && !bottom.querySelector('.ptra-native-notes,.ptra-native-tec')) bottom.remove();
      const panel = body.querySelector(':scope > [data-bcq-module-panel]');
      if (panel && notes) notes.after(panel); else if (panel && cards) cards.after(panel);
      if (tools) zone.appendChild(tools);
    });
  }
  function readingStats(module, meta) {
    if (meta.subject === 'cpp' && window.CppCourseV1) {
      const state = window.CppCourseV1.state().modules[meta.id];
      return { pct: state?.reading ? 100 : 0, text: state?.reading ? 'Leitura concluída' : 'Marque a leitura ao terminar o conteúdo' };
    }
    const fn = {cf:'cfWeekState',penal:'penalWeekState',cpc:'cpcWeekState'}[meta.subject];
    if (fn && typeof window[fn] === 'function') {
      const state = window[fn](meta.id), done = ['reading','theory','deep'].filter(k => state[k]).length;
      return { pct: Math.round(done / 3 * 100), text: done + '/3 etapas de leitura concluídas' };
    }
    const boxes = Array.from(module.querySelectorAll('[data-ptn-done]'));
    if (boxes.length) {
      const done = boxes.filter(x => x.checked).length;
      return { pct: Math.round(done / boxes.length * 100), text: done + '/' + boxes.length + ' sessões concluídas' };
    }
    if (meta.subject === 'pt') {
      const state = read('base-completa:pt:v1:module:' + meta.id + ':progress');
      const done = Object.values(state?.sections || {}).filter(Boolean).length;
      return { pct: null, text: done + ' sessões concluídas · confira a teoria' };
    }
    const goal = module.querySelector('.topic-row input[type=checkbox]');
    if (goal) return { pct: goal.checked ? 100 : 0, text: 'Conclusão manual do módulo' };
    return { pct: null, text: 'Use os controles de conclusão no conteúdo' };
  }
  function questionStats(module, meta) {
    const manual = footerRounds(meta);
    const manualTotal = manual.reduce((n,r) => n + r.done,0);
    const manualCorrect = manual.reduce((n,r) => n + r.correct,0);
    const course = meta.subject === 'cf' && typeof CF_WEEKS !== 'undefined' ? { weeks:CF_WEEKS, pool:window.cfPool, state:window.cfState } :
      meta.subject === 'penal' && typeof PENAL_WEEKS !== 'undefined' ? { weeks:PENAL_WEEKS, pool:window.penalPool, state:window.penalState } :
      meta.subject === 'cpc' && typeof CPC_WEEKS !== 'undefined' ? { weeks:CPC_WEEKS, pool:window.cpcPool, state:window.cpcState } : null;
    if (course && typeof course.pool === 'function' && typeof course.state === 'function') {
      const week = course.weeks.find(w => w.id === meta.id);
      if (week) {
        const answers = course.state().answers || {};
        const answered = course.pool(week).map(q => answers[q.id]).filter(a => a?.attempts);
        const correct = answered.filter(a => a.lastCorrect).length;
        if (manualTotal) return { total:manualTotal + answered.length, correct:manualCorrect + correct,
          text:manualTotal + ' questões em rodadas · ' + manualCorrect + ' acertos; ' + answered.length + ' exercícios internos · ' + correct + ' acertos na última resposta' };
        return { total:answered.length, correct, text:answered.length + ' questões respondidas · ' + correct + ' acertos na última resposta' };
      }
    }
    if (meta.subject === 'cpp' && window.CppCourseV1) {
      const rounds = window.CppCourseV1.state().modules[meta.id]?.rounds || [];
      const valid = rounds.reduce((n,r) => n + Math.max(0,Number(r.valid)||0),0);
      const correct = rounds.reduce((n,r) => n + Math.max(0,Number(r.correct)||0),0);
      return { total: valid, correct, text: valid + ' questões · ' + correct + ' acertos' };
    }
    if (meta.subject === 'pt') {
      const state = read('base-completa:pt:v1:module:' + meta.id + ':progress');
      const answers = Object.values(state?.answers || {});
      if (manualTotal) return { total:manualTotal, correct:manualCorrect,
        text:manualTotal + ' questões em rodadas · ' + manualCorrect + ' acertos; ' + answers.length + ' exercícios internos respondidos · resultado na área de prática' };
      // Native Portuguese stores selected alternatives, not correctness. Its own question UI owns the result.
      return { total: answers.length, correct: null, text: answers.length + ' questões respondidas · resultado na área de prática' };
    }
    if (module.dataset.uid && typeof window.getPerf === 'function') {
      const rounds = window.getPerf(meta.id);
      const total = rounds.reduce((n,r) => n + (Number(r.q)||0),0);
      const correct = rounds.reduce((n,r) => n + (Number(r.c)||0),0);
      return { total, correct, text: total + ' questões · ' + rounds.length + ' rodadas' };
    }
    return { total: 0, correct: 0, text: 'Use as questões e os cadernos vinculados abaixo' };
  }
  function percentage(module) {
    const text = module.querySelector('.civil-pct,.cf-module-stat,.cpp-mpct')?.textContent || '';
    const match = text.match(/(\d+)\s*%/);
    if (match) return Number(match[1]);
    const goal = module.querySelector('.topic-row input[type=checkbox]');
    return goal ? (goal.checked ? 100 : 0) : 0;
  }
  function progressPanel(module, meta) {
    const reading = readingStats(module, meta);
    const rounds = footerRounds(meta);
    const total = rounds.reduce((sum,row) => sum + row.done,0), correct = rounds.reduce((sum,row) => sum + row.correct,0);
    const questions = { total, correct, text:total ? total + ' questões em rodadas · ' + correct + ' acertos' : 'Nenhuma rodada registrada ainda' };
    return '<section class="csp-panel ds-progress" data-ds-summary><div class="csp-grid">' +
      '<article class="csp-stage-card"><div class="csp-stage-head"><div><b>Progresso da teoria</b><small>' + esc(reading.text) + '</small></div><strong>' + (reading.pct === null ? '—' : reading.pct + '%') + '</strong></div>' + meter(reading.pct) + '</article>' +
      '<article class="csp-stage-card csp-tec"><div class="csp-stage-head"><div><b>Questões externas</b><small>' + esc(questions.text) + '</small></div><strong>' + (questions.total && questions.correct !== null ? Math.round(questions.correct / questions.total * 100) + '% de acertos' : questions.total ? '—' : 'Sem registro') + '</strong></div>' + meter(questions.total && questions.correct !== null ? Math.round(questions.correct / questions.total * 100) : 0) + '</article></div></section>';
  }
  function notes(module, body, meta) {
    // Constitutional modules already provide a native note with their own save handler.
    // Keep that note in its existing position and do not create a second footer note.
    if (meta.subject === 'cf') {
      const native = body.querySelector(':scope > .cf-native-note');
      if (native) {
        const duplicate = body.querySelector(':scope > .ds-module-footer > .ds-notes[data-ds-notes]');
        const area = native.querySelector('textarea');
        const oldKey = 'central-v6:module-notes:' + meta.key;
        const newKey = 'central-v6:cf-note:' + meta.id;
        const importKey = 'central-v6:cf-standard-note-imported:' + meta.id;
        // Non-destructive one-time import if a student used the older, redundant note.
        // The previous storage key is intentionally not deleted.
        try {
          if (area && localStorage.getItem(importKey) !== '1') {
            const previous = duplicate?.querySelector('textarea')?.value || localStorage.getItem(oldKey) || '';
            if (previous.trim() && !area.value.includes(previous.trim())) {
              const combined = area.value.trim()
                ? area.value.trim() + '\n\n--- Anotação anterior ---\n' + previous.trim()
                : previous.trim();
              localStorage.setItem(newKey, combined);
              area.value = combined;
            }
            localStorage.setItem(importKey, '1');
          }
        } catch (_) { /* Keep both original saved notes intact if storage is unavailable. */ }
        duplicate?.remove();
        return;
      }
    }
    const host = body.querySelector(':scope > .ds-module-footer') || body;
    const native = body.querySelector('.notes,.cpp-note,.cf-resource-box:has(textarea),[data-ds-notes]');
    if (native) {
      native.classList.add('ds-notes');
      if (native.parentElement !== host || host.lastElementChild !== native) host.appendChild(native);
      const heading = native.querySelector('label,h4,.resource-label');
      if (heading && heading.textContent !== 'Anotações do módulo') heading.textContent = 'Anotações do módulo';
      const area = native.querySelector('textarea');
      if (area) area.placeholder = 'Regra, dúvida, pegadinha, observação...';
      if (native.matches('.cpp-note') && !native.querySelector('[data-ds-footer-save-note]')) native.insertAdjacentHTML('beforeend','<div class="ds-actions"><button type="button" class="ds-action" data-ds-footer-save-note>Salvar anotação</button><span role="status" class="ds-note-status"></span></div>');
      return;
    }
    const note = document.createElement('section');
    note.className = 'ds-notes'; note.dataset.dsNotes = meta.key;
    const id = 'ds-note-' + meta.key.replace(/[^a-zA-Z0-9_-]/g,'-');
    let value = ''; try {
      const current = localStorage.getItem('central-v6:module-notes:' + meta.key);
      const oldId = meta.subject === 'cpp' ? 'cpp-' + meta.id : meta.id;
      value = current ?? localStorage.getItem('central-v6:module-standard-notes:v1:' + oldId) ??
        (meta.subject === 'civil' ? localStorage.getItem('central-v6:civil-note:' + meta.id) : null) ?? '';
    } catch (_) {}
    note.innerHTML = '<label for="' + id + '">Anotações do módulo</label><textarea id="' + id + '" placeholder="Regra, dúvida, pegadinha, observação...">' + esc(value) + '</textarea><div class="ds-actions"><button type="button" class="ds-action" data-ds-save-note>Salvar anotação</button><span role="status" aria-live="polite" class="ds-note-status"></span></div>';
    host.appendChild(note);
  }
  function reviewUid(module, meta) {
    if (module.dataset.uid) return meta.id;
    const subject = window.SUBJECTS?.find(s => s.id === meta.subject);
    if (meta.subject === 'civil') return subject?.topics.find(t => t.uid === meta.id + '-analista')?.uid || meta.key;
    const number = Number((meta.id.match(/\d+/) || [])[0]);
    return subject?.topics[number - 1]?.uid || meta.key;
  }
  function footerRounds(meta) {
    if (meta.subject === 'civil') return window.civilStudyFooterRows?.(meta.id) || [];
    const rows = meta.subject === 'cpp' ? window.CppCourseV1.state().modules[meta.id]?.rounds || [] :
      read('central-v6:module-rounds:' + meta.key) || [];
    return rows.map((r,index) => ({ index, done:Number(r.valid ?? r.done)||0, correct:Number(r.correct)||0, date:r.date })).filter(r => r.done > 0);
  }
  function footerHistory(meta) {
    const rows = footerRounds(meta), done = rows.reduce((n,r) => n + r.done,0), correct = rows.reduce((n,r) => n + r.correct,0);
    return '<div class="history-label">Questões feitas por rodadas · total ' + done + ' feitas · ' + correct + ' certas</div>' +
      (rows.length ? rows.map((r,i) => '<div class="hist"><span>Rodada ' + (i+1) + '</span><span>' + r.done + ' feitas · ' + r.correct + ' certas</span><span class="rate">' + Math.round(r.correct/r.done*100) + '%</span></div>').join('') : '<div class="muted small">Nenhum resultado registrado.</div>');
  }
  function footerTools(body, host) {
    if (host.children.length) return;
    const actions = [
      {label:'📖 Lei em Dia', selector:'[onclick*="openLeiSeca"],[onclick*="decorando"]', tool:'decorando'},
      {label:'⚖ Vade Mecum', selector:'[onclick*="vade"]', tool:'vade'},
      {label:'▤ Cadernos do TEC', selector:'[onclick*="tec-cadernos"]', tool:'tec'}
    ];
    actions.forEach(action => {
      const native = body.querySelector('button' + action.selector.split(',').join(',button'));
      const button = native ? native.cloneNode(false) : document.createElement('button');
      button.removeAttribute('id'); button.removeAttribute('style'); button.type = 'button'; button.className = 'chip real'; button.textContent = action.label;
      if (!native) button.dataset.dsFooterTool = action.tool;
      host.appendChild(button);
    });
  }
  function moduleFooter(module, body, meta) {
    let footer = body.querySelector(':scope > .ds-module-footer');
    if (!footer) {
      footer = document.createElement('section'); footer.className = 'ds-module-footer'; footer.dataset.dsFooter = meta.key;
      const questions = document.createElement('section'); questions.className = 'ds-footer-questions';
      const perf = body.querySelector(':scope > .perf-form');
      if (perf) {
        let node = perf;
        while (node) {
          const next = node.nextElementSibling;
          if (node.matches('.resource,.ds-notes,.notes')) footer.appendChild(node); else questions.appendChild(node);
          node = next;
        }
        footer.prepend(questions);
      } else {
        const suffix = meta.key.replace(/[^a-zA-Z0-9_-]/g,'-'), uid = reviewUid(module,meta);
        questions.innerHTML = '<form class="perf-form" data-ds-footer-register><div class="field"><label for="ds-q-' + suffix + '">Questões feitas</label><input id="ds-q-' + suffix + '" name="done" type="number" inputmode="numeric" min="1" step="1" placeholder="—" required></div><div class="field"><label for="ds-c-' + suffix + '">Questões certas</label><input id="ds-c-' + suffix + '" name="correct" type="number" inputmode="numeric" min="0" step="1" placeholder="—"></div><button class="btn green" type="submit">✓ Registrar</button><div class="ds-footer-status" role="status" hidden></div></form><div data-ds-footer-history></div>';
        footer.appendChild(questions);
        const review = document.createElement('section'); review.className = 'resource ds-footer-review';
        const date = localStorage.getItem(key(uid,'review')) || todayISO();
        review.innerHTML = '<div class="resource-label">Revisão</div><div class="chips"><input type="date" aria-label="Data da revisão" value="' + esc(date) + '"><button class="btn sm" type="button" data-ds-footer-review>Agendar revisão</button><span class="muted small" data-ds-review-status></span></div>';
        footer.appendChild(review);
      }
      let tools = Array.from(footer.children).find(el => /Ferramentas do módulo/i.test(el.querySelector('.resource-label')?.textContent || ''));
      if (!tools) {
        tools = document.createElement('section'); tools.className = 'resource';
        tools.innerHTML = '<div class="resource-label">Ferramentas do módulo</div><div class="chips"></div>';
        footer.appendChild(tools);
      }
      tools.classList.add('ds-footer-tools');
      const chips = tools.querySelector('.chips');
      // One set of three tools for every discipline; native module context is retained.
      chips.replaceChildren(); footerTools(body,chips);
      Array.from(footer.children).find(el => el.querySelector('.resource-label')?.textContent === 'Revisão')?.classList.add('ds-footer-review');
      body.appendChild(footer);
    }
    if (meta.subject === 'cf') {
      // Remove only the redundant manual question entry/history UI; keep stored rounds intact.
      footer.querySelector(':scope > .ds-footer-questions')?.remove();
    }
    if (body.lastElementChild !== footer) body.appendChild(footer);
    const history = footer.querySelector('[data-ds-footer-history]');
    if (history) { const html = footerHistory(meta); if (history.innerHTML !== html) history.innerHTML = html; }
    const savedReview = localStorage.getItem(key(reviewUid(module,meta),'review'));
    const status = footer.querySelector('[data-ds-review-status]');
    const reviewText = savedReview ? 'marcada para ' + window.formatDate(savedReview) : '';
    if (status && status.textContent !== reviewText) status.textContent = reviewText;
    footer.querySelectorAll('.perf-form .field').forEach(field => {
      const input = field.querySelector('input'), label = field.querySelector('label');
      if (input && label) { label.htmlFor = input.id; input.inputMode = 'numeric'; input.step = '1'; }
    });
    body.querySelectorAll(':scope > .cf-resources,:scope > .cpp-rounds').forEach(el => el.classList.add('ds-footer-replaced'));
    // Completion controls stay with the study controls, above the reading content.
    body.querySelectorAll(':scope > .cpp-actions,:scope > .civil-a-actions').forEach(el => {
      const nav = body.querySelector(':scope > .ds-module-nav');
      if (nav && nav.nextElementSibling !== el) nav.after(el);
    });
  }
  function enhance(module) {
    const body = bodyOf(module); if (!body) return;
    const meta = identity(module);
    module.classList.add('ds-module'); body.classList.add('ds-module-body');
    standardizeStudyCards(body, meta);
    const head = module.querySelector('.civil-module-head,.cf-module-head,.cpp-mod-head,.topic-row');
    if (head) {
      head.classList.add('ds-module-head');
      const toggle = head.matches('button') ? head : head.querySelector('.open-topic');
      if (toggle) { toggle.setAttribute('aria-expanded',String(module.classList.contains('open'))); toggle.setAttribute('aria-controls','ds-body-' + meta.key.replace(/[^a-zA-Z0-9_-]/g,'-')); }
      body.id = 'ds-body-' + meta.key.replace(/[^a-zA-Z0-9_-]/g,'-');
      const goal = head.querySelector('input[type=checkbox]');
      if (goal) goal.setAttribute('aria-label','Marcar módulo concluído: ' + (head.querySelector('.topic-title')?.textContent || '').trim());
      const toggleOnly = head.querySelector('.open-topic');
      if (toggleOnly) toggleOnly.setAttribute('aria-label',(module.classList.contains('open') ? 'Recolher' : 'Abrir') + ' módulo');
    }
    if(body.querySelector('.adm-native-zone')) {
      removeAdmLegacyDuplicates(body);
      return;
    }
    if (!module.classList.contains('open') || !module.closest('.subject').classList.contains('open')) return;

    // Direito Penal M01-M17 usa o fluxo nativo aprovado.
    // Mantém apenas o rodapé padrão (questões externas, revisão, ferramentas e anotações),
    // sem recriar o painel/progresso e a navegação legados por cima dos cards nativos.
    if ((meta.subject === 'penal' && /^p(?:[1-9]|1[0-7])$/.test(meta.id)) || (meta.subject === 'pt' && module.dataset.ptCurrent)) {
      body.querySelector(':scope > .csp-panel[data-ds-summary]')?.remove();
      body.querySelector(':scope > .ds-module-nav')?.remove();
      moduleFooter(module,body,meta);
      notes(module,body,meta);
      arrangeStudySections(body,meta);
      return;
    }

    const nativeProgress = body.querySelector('.bc-native-metrics,.bc-native-study-progress,.cv-progress-grid,.ptra-native-progress-grid,.adm-native-progress-panel');
    if (nativeProgress) body.querySelector(':scope > .csp-panel[data-ds-summary]')?.remove();
    else if (!body.querySelector('.csp-panel')) body.insertAdjacentHTML('afterbegin',progressPanel(module,meta));
    else {
      const panel = body.querySelector('[data-ds-summary]');
      if (panel) { const html = progressPanel(module,meta); if (panel.outerHTML !== html) panel.outerHTML = html; }
    }
    // The approved module layout places its tools and external filters in flow;
    // remove only the redundant jump strip introduced by the earlier layer.
    body.querySelector(':scope > .ds-module-nav')?.remove();
    moduleFooter(module,body,meta);
    notes(module,body,meta);
    arrangeStudySections(body,meta);
  }
  function refresh() {
    scheduled = false;
    const root = document.getElementById('subjects'); if (!root) return;
    observer?.disconnect();
    try {
      root.querySelectorAll('.subject').forEach(subject => {
        const body = subject.querySelector('.subject-body');
        if (!body) return;
        if (subject.dataset.id === 'civil') { body.querySelector('.civil-master-intro')?.classList.add('ds-course-intro'); return; }
        if (body.querySelector('.ptra-native-intro,.bc-rlm-intro')) {
          body.querySelector(':scope > .ds-course-intro')?.remove();
          return;
        }
        let intro = body.querySelector(':scope > .ds-course-intro');
        if (!intro) {
          intro = document.createElement('header'); intro.className = 'ds-course-intro';
          intro.innerHTML = '<h3></h3><p></p>';
          body.prepend(intro);
        }
        const title = subject.querySelector('.subject-name')?.textContent || '';
        const count = subject.querySelector('.subject-count')?.textContent || '';
        if (intro.querySelector('h3').textContent !== title) intro.querySelector('h3').textContent = title;
        if (intro.querySelector('p').textContent !== count) intro.querySelector('p').textContent = count;
      });
      root.querySelectorAll(MODULES).forEach(module => { try { enhance(module); } catch (error) { console.warn('Apresentação do módulo',error); } });
      root.querySelectorAll('.subject[data-id="civil"] .cv-module[data-civil-native-module],.subject[data-id="ptra"] .ptra-native-mod[data-ptra-module]').forEach(module => {
        const body = bodyOf(module);
        if (body) standardizeStudyCards(body,identity(module));
      });
      // RLM owns its reader, progress, notes, and speed-training flow; only align existing M02+ cards.
      root.querySelectorAll('.subject[data-id="rlm"] .cf-module[data-rlm-module]').forEach(module => {
        const body = bodyOf(module);
        if (body) standardizeStudyCards(body,identity(module));
      });
      arrangeNativeCourseLayouts(root);
      root.querySelectorAll(MODULES).forEach(module => {
        const body = bodyOf(module);
        if (body && module.classList.contains('open') && module.closest('.subject')?.classList.contains('open')) {
          arrangeStudySections(body,identity(module));
        }
      });
    }
    finally { observer?.observe(root,{childList:true,subtree:true}); }
  }
  function schedule() { if (!scheduled) { scheduled = true; requestAnimationFrame(refresh); } }
  function navigate(module, action) {
    const body = bodyOf(module), meta = identity(module);
    if (action === 'notes') { const area = body.querySelector('.ds-notes textarea'); area?.scrollIntoView({block:'center'}); area?.focus({preventScroll:true}); return; }
    if (action === 'questions' && ['cpp','cf','cpc','penal'].includes(meta.subject)) {
      const form = body.querySelector('.ds-footer-questions .perf-form');
      form?.scrollIntoView({block:'start'});
      form?.querySelector('input[type=number]')?.focus({preventScroll:true});
      return;
    }
    if (meta.subject === 'pt' && typeof window.ptNativeTab === 'function') {
      window.ptNativeTab(meta.id,action === 'questions' ? 'questoes' : action === 'review' ? 'revisao' : action === 'resources' ? 'tec' : 'teoria'); return;
    }
    if (action === 'resources') {
      const button = body.querySelector('button[onclick*="openLeiSeca"],button[onclick*="decorando"],a[onclick*="openLeiSeca"]');
      if (button) { button.click(); return; }
    }
    const selector = action === 'questions' ? '.csp-tec:not(.ds-progress .csp-tec),.perf-form,.cpp-rounds,.cf-step,.cf-resources' : action === 'resources' ? '.cpp-actions,.resource,.cf-resources' : '.civil-a-section,.cf-steps,[data-ptn-host],.cpp-summary,.prestudy';
    let target = body.querySelector(selector) || body;
    if (action === 'questions' && meta.subject !== 'civil') {
      const stages = Array.from(body.querySelectorAll('.cf-step'));
      target = stages.find(x => /diagnóstico|bateria|questões/i.test(x.querySelector('.cf-step-copy b')?.textContent || '')) || body.querySelector('.cf-resources') || target;
    }
    const details = target.closest('details'); if (details) details.open = true;
    target.scrollIntoView({block:'start'});
  }
  document.addEventListener('click',function (event) {
    const cppNote = event.target.closest('[data-ds-footer-save-note]');
    if (cppNote) {
      const module = cppNote.closest('.ds-module'), box = cppNote.closest('.ds-notes');
      window.CppCourseV1.note(Number(module.dataset.cppNum),box.querySelector('textarea').value);
      box.querySelector('[role=status]').textContent = 'Anotação salva';
    }
    const tool = event.target.closest('[data-ds-footer-tool]');
    if (tool) {
      if (tool.dataset.dsFooterTool === 'tec') window.centralSidebarAction('tec-cadernos',tool);
      else window.openEmbeddedTool(tool.dataset.dsFooterTool,{},tool);
    }
    const review = event.target.closest('[data-ds-footer-review]');
    if (review) {
      const module = review.closest('.ds-module'), meta = identity(module), uid = reviewUid(module,meta), footer = review.closest('.ds-module-footer');
      const date = footer.querySelector('input[type=date]').value;
      if (date) {
        const saved = window.scheduleModuleReview(uid,date,{
          discipline:module.closest('.subject').querySelector('.subject-name').textContent,
          task:'Revisão — ' + module.querySelector('.civil-module-title,.cf-module-title,.cpp-mod-title,.topic-title').textContent.trim()
        });
        if (saved) schedule();
        else footer.querySelector('[data-ds-review-status]').textContent = 'Não foi possível agendar a revisão.';
      }
    }
    const action = event.target.closest('[data-ds-action]');
    if (action) { const module = action.closest('.ds-module'); if (module) navigate(module,action.dataset.dsAction); }
    const save = event.target.closest('[data-ds-save-note]');
    if (save) {
      const box = save.closest('[data-ds-notes]');
      try { localStorage.setItem('central-v6:module-notes:' + box.dataset.dsNotes,box.querySelector('textarea').value); box.querySelector('[role=status]').textContent = 'Anotação salva'; }
      catch (_) { box.querySelector('[role=status]').textContent = 'Não foi possível salvar. Copie o texto para preservá-lo.'; }
    }
    if (event.target.closest('#subjects')) schedule();
  });
  document.addEventListener('submit',function(event) {
    const form = event.target.closest('[data-ds-footer-register]'); if (!form) return;
    event.preventDefault();
    const module = form.closest('.ds-module'), meta = identity(module);
    const done = Number(form.elements.done.value), correct = Number(form.elements.correct.value || 0), status = form.querySelector('[role=status]');
    try {
      if (!Number.isInteger(done) || !Number.isInteger(correct) || done < 1 || correct < 0 || correct > done) throw new Error('Confira questões feitas e certas.');
      if (meta.subject === 'civil') { if (!window.civilStudyRegisterRound(meta.id,done,correct)) throw new Error('Não foi possível registrar.'); }
      else if (meta.subject === 'cpp') { if (!window.CppCourseV1.registerRound(Number(meta.id),done,correct)) throw new Error('Não foi possível registrar.'); }
      else {
        const k = 'central-v6:module-rounds:' + meta.key, rows = read(k) || [];
        const index = rows.findIndex(r => r.done === '' && r.correct === '');
        const record = {done,correct,date:todayISO(),id:Date.now()};
        if (index < 0) rows.push(record); else rows[index] = record;
        localStorage.setItem(k,JSON.stringify(rows));
      }
      form.reset(); status.hidden = true; schedule();
    } catch (error) { status.textContent = error.message; status.hidden = false; }
  });
  document.addEventListener('change',function(event) { if (event.target.closest('#subjects')) schedule(); });
  // Keep new-note drafts during native re-renders without touching the original note stores.
  document.addEventListener('input',function(event) {
    const box = event.target.closest('[data-ds-notes]');
    if (box && event.target.matches('textarea')) {
      try { localStorage.setItem('central-v6:module-notes:' + box.dataset.dsNotes,event.target.value); box.querySelector('[role=status]').textContent = 'Anotação salva'; }
      catch (_) { box.querySelector('[role=status]').textContent = 'Não foi possível salvar'; }
    }
  });
  window.CentralDisciplineStandard = { refresh, standardizeStudyCards, version:'1.3.0' };
  function start() { observer = new MutationObserver(schedule); refresh(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',start,{once:true}); else start();
})();
