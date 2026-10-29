/* Shared presentation based on Direito Civil. Native content, handlers and storage stay authoritative. */
(function () {
  'use strict';
  if (window.CentralDisciplineStandard) return;
  const MODULES = '.civil-module[data-civil-analista],.cf-module[data-cf],.cf-module[data-penal],.cf-module[data-cpc],.cf-module[data-ptn-module],.cf-module[data-pt-current],.cpp-mod[data-cpp-num],.topic-item[data-uid],.topic-item[data-cpp-native-module]';
  let observer, scheduled = false;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const read = key => { try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch (_) { return null; } };
  const meter = value => Number.isFinite(value) ? '<div class="csp-meter" aria-hidden="true"><span style="width:' + Math.max(0, Math.min(100, value)) + '%"></span></div>' : '';

  function penalApprovedProgress(module, week) {
    const body = bodyOf(module);
    if (!body || !week) return;
    const state = typeof window.penalWeekState === 'function' ? window.penalWeekState(week.id) : {};
    const theorySteps = ['reading','theory','deep'].filter(key => !!state?.[key]).length;
    const readerName = week.num === 1 ? 'BaseNativeReader' : 'BaseNativeReaderM' + String(week.num).padStart(2,'0');
    const readerStats = window[readerName]?.theoryStats?.();
    const theoryPct = Number.isFinite(readerStats?.pct) ? Math.max(0,Math.min(100,readerStats.pct)) : Math.round(theorySteps / 3 * 100);
    const rounds = footerRounds(identity(module));
    const roundCount = Math.min(rounds.length,3);
    const roundPct = Math.round(roundCount / 3 * 100);
    const done = rounds.reduce((sum,row) => sum + row.done, 0);
    const correct = rounds.reduce((sum,row) => sum + row.correct, 0);
    let panel = body.querySelector(':scope > .penal-approved-progress');
    if (!panel) {
      panel = document.createElement('section');
      panel.className = 'penal-approved-progress';
      panel.setAttribute('aria-label','Progresso do módulo');
      body.insertBefore(panel,body.firstElementChild);
    }
    panel.innerHTML = '<article class="penal-approved-progress-card"><div class="penal-approved-progress-head"><b>Progresso da teoria</b><strong>' + theoryPct + '% concluído</strong></div><div class="penal-approved-progress-track" role="progressbar" aria-label="Progresso da teoria" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + theoryPct + '"><span style="width:' + theoryPct + '%"></span></div><small>' + (Number.isFinite(readerStats?.pct) ? 'Leitura resumida + teoria completa' : 'Leitura orientada + revisão + aprofundamento · ' + theorySteps + '/3 etapas') + '</small></article>' +
      '<article class="penal-approved-progress-card"><div class="penal-approved-progress-head"><b>Questões externas</b><strong>' + roundPct + '% · ' + roundCount + '/3 rodadas</strong></div><div class="penal-approved-progress-track" role="progressbar" aria-label="Progresso das questões externas" aria-valuemin="0" aria-valuemax="3" aria-valuenow="' + roundCount + '"><span style="width:' + roundPct + '%"></span></div><small>' + (roundCount ? done + ' questões registradas · ' + correct + ' certas' : 'Nenhuma rodada registrada ainda') + '</small></article>';
  }

  function penalQuestionAction(week, desired, mode) {
    const pool = typeof penalPool === 'function' ? penalPool(week) : [];
    const real = pool.filter(question => question.real !== false);
    const available = real.length ? real : pool.filter(question => question.real === false);
    const count = Math.min(desired,available.length);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'cf-btn penal-approved-secondary';
    button.dataset.penalApprovedQuestions = String(desired);
    if (!count) {
      button.textContent = 'Questões indisponíveis';
      button.disabled = true;
      return button;
    }
    button.textContent = 'Resolver ' + count + ' questões';
    button.addEventListener('click',function () {
      if (typeof window.startPenalQuiz === 'function') window.startPenalQuiz(week.id,real.length ? mode : 'coverage',count);
    });
    return button;
  }

  function penalApprovedNativeLayout(module, week, body) {
    const materials = body.querySelector(':scope > .bc-native-materials');
    const grid = materials?.querySelector(':scope > .bc-native-material-grid');
    if (!materials || !grid) return false;
    if (materials.dataset.penalApproved === '1') return true;
    const originals = Array.from(grid.querySelectorAll(':scope > .bc-native-material-card'));
    const complete = originals.find(button => button.dataset.nativeKind === 'complete' || /conteúdo completo/i.test(button.textContent));
    const summary = originals.find(button => button.dataset.nativeKind === 'summary' || /conteúdo resumido/i.test(button.textContent));
    const mindmap = originals.find(button => button.dataset.nativeKind === 'mindmap' || /mapa mental/i.test(button.textContent));
    if (!complete || !summary) return false;

    const state = typeof window.penalWeekState === 'function' ? window.penalWeekState(week.id) : {};
    const subtitle = body.querySelector(':scope > .cf-subtitle');
    const statute = week.read || subtitle?.textContent?.trim() || '';
    const focus = Array.isArray(week.read_focus) ? week.read_focus : [];
    const reading = document.createElement('section');
    reading.className = 'cf-step penal-approved-reading' + (state.reading ? ' done' : '');
    reading.innerHTML = '<div class="cf-step-head"><div class="cf-step-no">' + (state.reading ? '✓' : '1') + '</div><div class="cf-step-copy"><b>Leitura orientada inicial</b><small>Leia os dispositivos indicados e observe os pontos centrais do módulo.</small></div></div>' +
      '<div class="cf-step-body"><div class="cf-reading"><strong>' + esc(statute) + '</strong><details><summary>Ver pontos para observar</summary><ul>' + focus.map(point => '<li>' + esc(point) + '</li>').join('') + '</ul></details></div><div class="cf-actions"><button type="button" class="cf-btn ' + (state.reading ? 'good' : '') + '" data-penal-reading-toggle>' + (state.reading ? '✓ Concluída' : 'Marcar concluída') + '</button></div></div>';
    reading.querySelector('[data-penal-reading-toggle]').addEventListener('click', function () {
      const current = typeof window.penalWeekState === 'function' ? window.penalWeekState(week.id) : {};
      if (typeof window.penalUpdateWeek === 'function') window.penalUpdateWeek(week.id, {reading: !current.reading});
    });
    subtitle?.remove();
    body.insertBefore(reading, materials);

    const makeCard = (original, type) => {
      const isComplete = type === 'complete';
      const title = isComplete ? 'Teoria completa' : 'Versão de revisão';
      const action = isComplete ? 'Estudar conteúdo' : 'Revisar conteúdo';
      const description = original.querySelector('small')?.textContent?.trim() ||
        (isComplete ? 'Apostila integral para estudar o conteúdo em profundidade.' : 'Retome os pontos essenciais e revise rapidamente.');
      const article = document.createElement('article');
      article.className = 'penal-approved-card ' + (isComplete ? 'penal-approved-complete' : 'penal-approved-review');
      article.dataset.penalApprovedCard = type;
      article.innerHTML = '<div class="penal-approved-icon" aria-hidden="true">' + (isComplete ? '📚' : '⚡') + '</div>' +
        '<div class="penal-approved-copy"><h3>' + title + '</h3><p>' + esc(description) + '</p><div class="penal-approved-tags"><span>' +
        (isComplete ? 'Apostila' : 'Resumo') + '</span><span>' + (isComplete ? 'Conteúdo completo' : 'Pontos essenciais') +
        '</span></div></div><div class="penal-approved-card-actions"></div>';
      const actions = article.querySelector('.penal-approved-card-actions');
      const primary = document.createElement('button');
      primary.type = 'button';
      primary.className = 'cf-btn primary penal-approved-primary';
      primary.textContent = action;
      const handler = original.getAttribute('onclick');
      if (handler) primary.setAttribute('onclick', handler);
      else primary.addEventListener('click', () => original.click());
      actions.appendChild(primary);
      actions.appendChild(penalQuestionAction(week, isComplete ? 10 : 5, isComplete ? 'fixation' : 'intermediate'));
      return article;
    };
    const fullCard = makeCard(complete, 'complete');
    const reviewCard = makeCard(summary, 'summary');
    const preservedExtras = mindmap ? [mindmap] : [];
    grid.replaceChildren(fullCard, reviewCard, ...preservedExtras);
    materials.querySelector(':scope > .bc-native-metrics')?.remove();
    materials.querySelector(':scope > .bc-native-materials-head')?.remove();
    materials.classList.add('penal-approved-native-materials');
    materials.dataset.penalApproved = '1';
    return true;
  }

  function penalApprovedLayout(module, week) {
    const body = bodyOf(module);
    if (!body || !week) return;
    penalApprovedProgress(module,week);
    if (penalApprovedNativeLayout(module,week,body)) return;
    if (body.dataset.penalApprovedLayout === '1') return;
    const steps = body.querySelector(':scope > .cf-steps');
    if (!steps) return;
    const stepTitle = step => (step?.querySelector('.cf-step-copy b')?.textContent || '').trim().toLocaleLowerCase('pt-BR');
    const reading = Array.from(steps.querySelectorAll(':scope > .cf-step')).find(step => stepTitle(step).startsWith('leitura orientada'));
    const review = Array.from(steps.querySelectorAll(':scope > .cf-step')).find(step => stepTitle(step) === 'teoria completa');
    const extra = Array.from(steps.querySelectorAll(':scope > .cf-step')).find(step => stepTitle(step).startsWith('aprofundamento'));
    const full = body.querySelector(':scope > .pen-full-entry');
    if (!reading || !review) return;

    reading.classList.add('penal-approved-reading');
    review.classList.add('penal-approved-review');
    const subtitle = body.querySelector(':scope > .cf-subtitle');
    const readingBody = reading.querySelector('.cf-step-body');
    if (subtitle && readingBody) {
      subtitle.classList.add('penal-approved-topic');
      readingBody.prepend(subtitle);
    }
    const readLabel = reading.querySelector('.cf-step-copy b');
    if (readLabel) readLabel.textContent = 'Leitura orientada inicial';
    const readDesc = reading.querySelector('.cf-step-copy small');
    if (readDesc) readDesc.textContent = 'Dispositivos e pontos para observar na legislação penal.';
    reading.querySelectorAll('.cf-actions button[onclick*="openLeiSecaEnxuta"]').forEach(button => button.remove());

    const reviewLabel = review.querySelector('.cf-step-copy b');
    if (reviewLabel) reviewLabel.textContent = 'Versão de revisão';
    const reviewDesc = review.querySelector('.cf-step-copy small');
    if (reviewDesc && !reviewDesc.textContent.trim()) reviewDesc.textContent = 'Revisão objetiva para retomar os pontos essenciais do módulo.';
    const reviewDone = review.querySelector('.cf-actions button[onclick*="penalUpdateWeek"]');
    if (reviewDone) reviewDone.textContent = reviewDone.textContent.replace(/teoria/ig,'revisão');
    const reviewActions = document.createElement('div');
    reviewActions.className = 'penal-approved-actions';
    const reviewButton = document.createElement('button');
    reviewButton.type = 'button';
    reviewButton.className = 'cf-btn primary penal-approved-primary';
    reviewButton.textContent = 'Revisar conteúdo';
    reviewButton.addEventListener('click',function () {
      const details = Array.from(review.querySelectorAll('.cf-theory'));
      const open = details.some(item => !item.open);
      details.forEach(item => { item.open = open; });
      review.scrollIntoView?.({block:'center',behavior:'smooth'});
    });
    reviewActions.appendChild(reviewButton);
    reviewActions.appendChild(penalQuestionAction(week,5,'intermediate'));
    review.querySelector('.cf-step-head')?.after(reviewActions);

    if (full) {
      full.classList.add('penal-approved-card','penal-approved-complete');
      const existingButton = full.querySelector('button');
      const description = full.querySelector('small')?.textContent.trim() || 'Apostila integral do módulo para estudo aprofundado.';
      const icon = document.createElement('div');
      icon.className = 'penal-approved-icon';
      icon.setAttribute('aria-hidden','true');
      icon.textContent = '📚';
      const copy = document.createElement('div');
      copy.className = 'penal-approved-copy';
      copy.innerHTML = '<h3>Teoria completa</h3><p></p><div class="penal-approved-tags"><span>Apostila</span><span>Conteúdo completo</span></div>';
      copy.querySelector('p').textContent = description;
      const actions = document.createElement('div');
      actions.className = 'penal-approved-card-actions';
      if (existingButton) {
        existingButton.type = 'button';
        existingButton.className = 'cf-btn primary penal-approved-primary';
        existingButton.textContent = 'Estudar conteúdo';
        actions.appendChild(existingButton);
      }
      actions.appendChild(penalQuestionAction(week,10,'fixation'));
      full.replaceChildren(icon,copy,actions);
    }

    reading.remove();
    review.remove();
    if (extra) {
      extra.classList.add('penal-approved-extra');
      extra.remove();
      body.appendChild(extra);
    }
    if (full) {
      full.after(reading);
      reading.after(full);
      full.after(review);
    } else {
      reading.after(review);
    }
    if (!steps.children.length) steps.remove();
    body.querySelector(':scope > .cf-module-bar')?.setAttribute('data-penal-legacy-progress','1');
    body.dataset.penalApprovedLayout = '1';
  }

  function penalApprovedFooter(body) {
    const footer = body.querySelector(':scope > .ds-module-footer');
    if (!footer) return;
    if (footer.dataset.penalApprovedFooter !== '1') {
      footer.dataset.penalApprovedFooter = '1';
      footer.querySelector(':scope > .ds-footer-questions')?.remove();
    }

    const note = footer.querySelector(':scope > .ds-notes');
    const filterPanels = Array.from(body.querySelectorAll(':scope > .tec-validated-panel,:scope > .bcq-module-panels,:scope > .ds-module-footer > .tec-validated-panel,:scope > .ds-module-footer > .bcq-module-panels'));
    const mountedBcqPanels = new Set();
    filterPanels.forEach(panel => {
      if (!panel.matches('.bcq-module-panels')) return;
      const key = panel.getAttribute('data-bcq-module-panel') || 'module';
      if (mountedBcqPanels.has(key)) panel.remove();
      else mountedBcqPanels.add(key);
    });
    const uniqueFilterPanels = filterPanels.filter(panel => panel.isConnected);
    uniqueFilterPanels.forEach(panel => panel.classList.add('penal-approved-filter-panel'));
    const moduleLaw = Array.from(body.querySelectorAll(':scope > .cf-resource-box,:scope > .ds-module-footer > .cf-resource-box')).find(box => (box.querySelector('h4')?.textContent || '').trim().toLocaleLowerCase('pt-BR') === 'lei em dia');
    moduleLaw?.classList.add('penal-approved-extra');
    const review = footer.querySelector(':scope > .ds-footer-review');
    const tools = footer.querySelector(':scope > .ds-footer-tools');
    const resources = body.querySelector(':scope > .cf-resources,:scope > .ds-module-footer > .cf-resources');
    const module = body.closest('.cf-module');
    const extra = body.querySelector(':scope > .penal-approved-extra');

    if (resources) {
      resources.classList.add('penal-approved-external-filters');
      resources.open = true;
      const title = resources.querySelector(':scope > summary');
      if (title) title.textContent = 'Filtros de questões';
      resources.querySelectorAll('.bc-module-rounds').forEach(node => node.remove());
      const saved = read('central-v6:penal-res:' + (module?.dataset.cf || '')) || {};
      resources.querySelectorAll('.cf-resource-box').forEach(box => {
        const heading = (box.querySelector('h4')?.textContent || '').trim().toLocaleLowerCase('pt-BR');
        if (/^(lei em dia|vade mecum|cadernos tec)$/.test(heading)) { box.remove(); return; }
        if (/filtro do tec/.test(heading)) {
          const label = box.querySelector('h4');
          if (label) label.textContent = 'TEC e QConcursos';
          box.querySelectorAll('button[onclick*="openPenalResource"]').forEach(button => {
            const action = button.getAttribute('onclick') || '';
            const kind = /,'qc'/.test(action) ? 'qc' : 'tec';
            if (/^\s*\+/.test(button.textContent.trim()) && !saved[kind]) button.remove();
          });
        }
      });
    }

    const ordered = [note,...uniqueFilterPanels,moduleLaw,extra,tools,resources,review].filter(Boolean);
    const others = Array.from(footer.children).filter(node => !ordered.includes(node));
    footer.replaceChildren(...ordered,...others);
  }

  function cpcApprovedProgress(module, week) {
    const body = bodyOf(module);
    if (!body || !week) return;
    const meta = identity(module);
    const state = typeof window.cpcWeekState === 'function' ? window.cpcWeekState(week.id) : {};
    const theorySteps = ['reading','theory','deep'].filter(key => !!state?.[key]).length;
    const theoryPct = Math.round(theorySteps / 3 * 100);
    const rounds = footerRounds(meta);
    const roundCount = rounds.length;
    const roundPct = Math.round(Math.min(roundCount,3) / 3 * 100);
    const done = rounds.reduce((sum,row) => sum + row.done,0);
    const correct = rounds.reduce((sum,row) => sum + row.correct,0);
    let panel = body.querySelector(':scope > .cpc-approved-progress');
    if (!panel) {
      panel = document.createElement('section');
      panel.className = 'cpc-approved-progress';
      panel.setAttribute('aria-label','Progresso do módulo');
      const anchor = body.querySelector(':scope > .cpc-approved-reading,:scope > .bc-native-materials');
      body.insertBefore(panel,anchor || body.firstElementChild);
    }
    panel.innerHTML = '<article class="cpc-approved-progress-card"><div class="cpc-approved-progress-head"><b>Progresso da teoria</b><strong>' + theoryPct + '% concluído</strong></div><div class="cpc-approved-progress-track" role="progressbar" aria-label="Progresso da teoria" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + theoryPct + '"><span style="width:' + theoryPct + '%"></span></div><small>Versão resumida + versão completa · ' + theorySteps + '/3 etapas</small></article>' +
      '<article class="cpc-approved-progress-card"><div class="cpc-approved-progress-head"><b>Questões externas</b><strong>' + roundPct + '% · ' + Math.min(roundCount,3) + '/3 rodadas</strong></div><div class="cpc-approved-progress-track" role="progressbar" aria-label="Progresso das questões externas" aria-valuemin="0" aria-valuemax="3" aria-valuenow="' + Math.min(roundCount,3) + '"><span style="width:' + roundPct + '%"></span></div><small>' + (roundCount ? done + ' questões registradas · ' + correct + ' certas' : 'Nenhuma rodada registrada ainda') + '</small></article>';
  }
  function cpcApprovedLayout(module) {
    const body = bodyOf(module);
    const materials = body?.querySelector(':scope > .bc-native-materials');
    if (!body || !materials) return;
    const week = (window.__CPC_WEEKS || []).find(item => item.id === module.dataset.cf);
    if (materials.dataset.cpcApproved === '1') { cpcApprovedProgress(module,week); return; }
    const grid = materials.querySelector('.bc-native-material-grid');
    const originals = Array.from(grid?.querySelectorAll('.bc-native-material-card') || []);
    if (!week || originals.length < 2) return;

    const complete = originals.find(button => /complete/i.test(button.getAttribute('onclick') || '') || /conteúdo completo/i.test(button.textContent));
    const summary = originals.find(button => button !== complete && (/summary/i.test(button.getAttribute('onclick') || '') || /resumido|resumo/i.test(button.textContent)));
    const map = originals.find(button => button !== complete && button !== summary) || null;
    if (!complete || !summary) return;

    const state = typeof window.cpcWeekState === 'function' ? window.cpcWeekState(week.id) : {};
    const completed = !!state.reading;
    const number = String(week.num).padStart(2,'0');
    const reading = document.createElement('section');
    reading.className = 'cpc-approved-reading';
    reading.innerHTML = '<div class="cpc-approved-reading-icon" aria-hidden="true">📖</div>' +
      '<div class="cpc-approved-reading-copy"><h3>Leitura orientada inicial</h3><p>' + esc(week.read || '') + '</p>' +
      '<details><summary>Ver pontos para observar</summary><ul>' + (week.read_focus || []).map(point => '<li>' + esc(point) + '</li>').join('') +
      '</ul></details><div class="cpc-approved-reading-actions">' +
      '<button type="button" class="cpc-approved-secondary" data-cpc-reading-toggle>' + (completed ? '✓ Leitura concluída' : 'Marcar concluída') + '</button>' +
      '</div></div>';
    reading.querySelector('[data-cpc-reading-toggle]').addEventListener('click', () => {
      if (typeof window.cpcUpdateWeek === 'function') window.cpcUpdateWeek(week.id,{reading:!completed});
    });
    body.insertBefore(reading,materials);

    const intro = body.querySelector(':scope > .cpc-study-intro');
    const question = (type) => {
      const pattern = type === 'summary' ? /5\s*(?:do|questões|questoes)/i : /10\s*(?:do|questões|questoes)/i;
      const button = Array.from(intro?.querySelectorAll('button') || []).find(item => pattern.test(item.textContent));
      if (!button) return null;
      const explicit = button.textContent.match(/(\d+)\s*\/\s*(\d+)/);
      const requested = Number(button.getAttribute('onclick')?.match(/,\s*(\d+)\s*\)/)?.[1]) || (type === 'summary' ? 5 : 10);
      let weekPool = [];
      try {
        const source = typeof window.__cpcPool === 'function' ? window.__cpcPool(week) : [];
        if (Array.isArray(source)) weekPool = source.filter(item => item && Array.isArray(item.o) && item.o.length >= 4);
      } catch (_) { /* Keep question controls unavailable until the verified pool loads. */ }
      const nativeCount = Number(explicit?.[2] || 0);
      const validatedCount = weekPool.length;
      const knownLegacyCount = Number(week.num) >= 7 && Number(week.num) <= 17 ? 15 : 0;
      // A stale 0/0 rendering must not hide an already loaded, validated question bank.
      // Never enable a full 5/10-question quiz from a partial pool.
      const available = validatedCount || (explicit ? nativeCount : knownLegacyCount);
      const count = available >= requested ? requested : 0;
      return {button,count};
    };
    const card = (original,type,quiz) => {
      const tone = type === 'complete' ? 'complete' : type === 'summary' ? 'summary' : 'map';
      const title = type === 'complete' ? 'Teoria completa' : type === 'summary' ? 'Versão de revisão' : 'Mapa mental';
      const action = type === 'complete' ? 'Estudar conteúdo' : type === 'summary' ? 'Revisar conteúdo' : 'Visualizar mapa mental';
      const icon = type === 'complete' ? '📚' : type === 'summary' ? '⚡' : '🧠';
      const description = original.querySelector('span:nth-of-type(2) small')?.textContent.trim() || (type === 'map' ? 'Revise visualmente os principais pontos do módulo.' : 'Retome os pontos principais do módulo.');
      const sourceTitle = original.querySelector('strong')?.textContent.trim() || title;
      const progress = original.querySelector('.bc-native-material-action')?.textContent.replace(/→/g,'').trim() || '';
      const article = document.createElement('article');
      article.className = 'cpc-approved-card cpc-approved-' + tone;
      article.dataset.cpcApprovedCard = type;
      article.innerHTML = '<div class="cpc-approved-icon" aria-hidden="true">' + icon + '</div>' +
        '<div class="cpc-approved-copy"><h3>' + title + '</h3><p>' + esc(description) + '</p>' +
        (progress ? '<small class="cpc-approved-progress-label">' + esc(progress) + '</small>' : '') +
        '<div class="cpc-approved-tags"><span>' + esc(sourceTitle) + '</span><span>Processo Civil</span></div></div><div class="cpc-approved-actions"></div>';
      const primary = document.createElement('button');
      primary.type = 'button'; primary.className = 'cpc-approved-primary'; primary.textContent = action;
      const handler = original.getAttribute('onclick'); if (handler) primary.setAttribute('onclick',handler);
      article.querySelector('.cpc-approved-actions').append(primary);
      if (quiz?.button) {
        quiz.button.classList.remove('good'); quiz.button.classList.add('cpc-approved-secondary');
        quiz.button.textContent = quiz.count ? 'Resolver ' + quiz.count + ' questões' : 'Questões internas indisponíveis';
        if (!quiz.count) { quiz.button.disabled = true; quiz.button.setAttribute('aria-label','Não há questões disponíveis nesta bateria'); }
        article.querySelector('.cpc-approved-actions').append(quiz.button);
      }
      return article;
    };
    grid.replaceChildren(card(complete,'complete',question('complete')),card(summary,'summary',question('summary')));
    if (map) grid.append(card(map,'map',null));
    materials.classList.add('cpc-approved-materials'); materials.querySelector('.bc-native-materials-head')?.remove();
    intro?.remove(); body.querySelector(':scope > .cf-module-bar')?.remove();
    // Render the approved two-bar progress summary; native counters/history remain untouched.
    body.querySelector(':scope > .bc-native-metrics')?.remove();
    body.querySelectorAll('.cpc-mini-panel').forEach(panel => {
      // This is only the manual external-question entry card. The actual QC/TEC filters stay intact.
      if (panel.querySelector('.cpc-external-form')) panel.remove();
    });
    cpcApprovedProgress(module,week);
    materials.dataset.cpcApproved = '1';
  }
  function identity(module) {
    const subject = module.closest('.subject').dataset.id;
    const id = module.dataset.civilAnalista || module.dataset.ptCurrent || module.dataset.ptnModule || module.dataset.cf || module.dataset.penal || module.dataset.cpc || module.dataset.cppNativeModule || module.dataset.cppNum || module.dataset.uid;
    return { subject, id, key: subject + ':' + id };
  }
  function bodyOf(module) { return module.querySelector('.civil-module-body,.cf-module-body,.cpp-mod-body,.detail-panel'); }
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
    const reading = readingStats(module, meta), questions = meta.subject === 'cf' ? null : questionStats(module, meta), overall = percentage(module);
    const law = module.querySelector('button[onclick*="openLeiSeca"],button[onclick*="decorando"],a[onclick*="openLeiSeca"]');
    const label = law ? 'Lei em Dia' : (meta.subject === 'pt' ? 'Revisão' : 'Materiais');
    const description = law ? 'Artigos e exercícios vinculados ao módulo' : (meta.subject === 'pt' ? 'Pontos de revisão disponíveis no módulo' : 'Consulte os materiais e recursos vinculados');
    return '<section class="csp-panel ds-progress" data-ds-summary><div class="csp-panel-head"><div><span>PROGRESSO DE ESTUDO</span><b>' + overall + '% do módulo</b></div><div class="csp-panel-note">Conclusão conforme os critérios desta disciplina</div></div>' + meter(overall) + '<div class="csp-grid">' +
      '<article class="csp-stage-card"><div class="csp-stage-head"><div><b>Leitura</b><small>' + esc(reading.text) + '</small></div><strong>' + (reading.pct === null ? '—' : reading.pct + '%') + '</strong></div>' + meter(reading.pct) + '</article>' +
      (meta.subject === 'cf' ? '' : '<article class="csp-stage-card"><div class="csp-stage-head"><div><b>' + label + '</b><small>' + description + '</small></div></div><button type="button" class="ds-action" data-ds-action="' + (meta.subject === 'pt' ? 'review' : 'resources') + '">Abrir ' + (law ? 'Lei em Dia' : label.toLowerCase()) + '</button></article>') +
      (meta.subject === 'cf' ? '' : '<article class="csp-stage-card csp-tec"><div class="csp-stage-head"><div><b>Questões / TEC</b><small>' + esc(questions.text) + '</small></div><strong>' + (questions.total && questions.correct !== null ? Math.round(questions.correct / questions.total * 100) + '% de acertos' : questions.total ? '—' : 'Sem registro') + '</strong></div><div class="ds-actions"><button type="button" class="ds-action" data-ds-action="questions">Abrir questões e registros</button></div></article>') + '</div></section>';
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
      const standard = localStorage.getItem('central-v6:module-standard-notes:v1:' + oldId);
      if (meta.subject === 'penal') {
        const candidates = [current, standard, localStorage.getItem('central-v6:penal-note:' + meta.id)].filter(item => typeof item === 'string' && item.trim());
        value = candidates.reduce((saved,item) => {
          const note = item.trim();
          if (!note || saved.includes(note)) return saved;
          return saved ? saved + '\n\n--- Anotação anterior preservada ---\n' + note : note;
        }, '');
      } else {
        value = current ?? (meta.subject === 'cpc' ? localStorage.getItem('central-v6:cpc-note:' + meta.id) : null) ??
          standard ??
          (meta.subject === 'civil' ? localStorage.getItem('central-v6:civil-note:' + meta.id) : null) ?? '';
      }
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
    if (meta.subject === 'cpc') {
      // Remove the duplicate entry form, preserving the round history and saved records.
      footer.querySelector(':scope > .ds-footer-questions form.perf-form')?.remove();
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
    if(body.querySelector('.adm-native-zone'))return;
    if (!module.classList.contains('open') || !module.closest('.subject').classList.contains('open')) return;

    // Direito Penal M01-M17 usa o fluxo nativo aprovado.
    // Mantém apenas o rodapé padrão (questões externas, revisão, ferramentas e anotações),
    // sem recriar o painel/progresso e a navegação legados por cima dos cards nativos.
    if (meta.subject === 'penal' && /^p(?:[1-9]|1[0-7])$/.test(meta.id)) {
      const week = typeof PENAL_WEEKS !== 'undefined' ? PENAL_WEEKS.find(item => item.id === meta.id) : null;
      penalApprovedLayout(module,week);
      body.querySelector(':scope > .csp-panel[data-ds-summary]')?.remove();
      body.querySelector(':scope > .ds-module-nav')?.remove();
      moduleFooter(module,body,meta);
      notes(module,body,meta);
      penalApprovedFooter(body);
      return;
    }
    if (meta.subject === 'pt' && module.dataset.ptCurrent) {
      body.querySelector(':scope > .csp-panel[data-ds-summary]')?.remove();
      body.querySelector(':scope > .ds-module-nav')?.remove();
      moduleFooter(module,body,meta);
      notes(module,body,meta);
      return;
    }

    // CPC already renders its native progress and linked study actions. Keep
    // those controls as the source of truth and avoid adding a second progress
    // panel and navigation strip over the approved module layout.
    if (meta.subject === 'cpc') {
      cpcApprovedLayout(module);
      body.querySelector(':scope > .csp-panel[data-ds-summary]')?.remove();
      body.querySelector(':scope > .ds-module-nav')?.remove();
      moduleFooter(module,body,meta);
      notes(module,body,meta);
      return;
    }

    if (!body.querySelector('.csp-panel')) body.insertAdjacentHTML('afterbegin',progressPanel(module,meta));
    else {
      const panel = body.querySelector('[data-ds-summary]');
      if (panel) { const html = progressPanel(module,meta); if (panel.outerHTML !== html) panel.outerHTML = html; }
    }
    if (meta.subject === 'cf') {
      // The native Constitutional module already presents its study content directly.
      body.querySelector(':scope > .ds-module-nav')?.remove();
    } else if (!body.querySelector(':scope > .ds-module-nav')) {
      const nav = document.createElement('nav'); nav.className = 'ds-module-nav'; nav.setAttribute('aria-label','Navegação do módulo');
      nav.innerHTML = '<button type="button" data-ds-action="content">Conteúdo</button><button type="button" data-ds-action="questions">Questões / TEC</button><button type="button" data-ds-action="resources">Ferramentas</button><button type="button" data-ds-action="notes">Anotações</button>';
      const panel = body.querySelector('.csp-panel'); if (panel) panel.after(nav); else body.prepend(nav);
    }
    moduleFooter(module,body,meta);
    notes(module,body,meta);
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
  window.CentralDisciplineStandard = { refresh, cpcApprovedLayout, version:'1.1.3' };
  function start() { observer = new MutationObserver(schedule); refresh(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',start,{once:true}); else start();
})();

