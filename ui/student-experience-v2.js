(function (global) {
  'use strict';
  if (global.__centralStudentExperienceV2) return;
  global.__centralStudentExperienceV2 = true;

  const SUBJECT_LABELS = {
    pt: 'Português', cf: 'Direito Constitucional', adm: 'Direito Administrativo',
    civil: 'Direito Civil', cpc: 'Direito Processual Civil', penal: 'Direito Penal',
    cpp: 'Direito Processual Penal', trab: 'Direito do Trabalho',
    ptra: 'Direito Processual do Trabalho', rlm: 'Raciocínio Lógico-Matemático',
  };
  let queued = false;

  function byId(id) { return document.getElementById(id); }
  function setText(element, value) {
    const text = String(value ?? '');
    if (element && element.textContent !== text) element.textContent = text;
  }
  function localDate(offset = 0) {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() + offset);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
  function readLast() {
    try { return JSON.parse(localStorage.getItem('central-v6:last') || 'null'); } catch (_) { return null; }
  }
  function subjects() {
    try { return Array.isArray(SUBJECTS) ? SUBJECTS : []; } catch (_) { return []; }
  }
  function subjectId(value) {
    const text = String(value || '').trim().toLocaleLowerCase('pt-BR');
    return Object.keys(SUBJECT_LABELS).find((id) => id === text || SUBJECT_LABELS[id].toLocaleLowerCase('pt-BR') === text) || '';
  }

  function renameNavButton(button, text, key) {
    if (!button) return;
    button.dataset.studentPrimaryNav = key;
    const label = button.querySelector('.nav-text');
    if (label && label.textContent !== text) label.textContent = text;
    button.setAttribute('aria-label', text);
    button.setAttribute('title', text);
  }

  function closeMore(restoreFocus = false) {
    const panel = byId('studentMorePanel');
    const trigger = byId('studentMoreButton');
    if (!panel || panel.hidden) return;
    panel.hidden = true;
    document.documentElement.classList.remove('student-more-open');
    trigger?.setAttribute('aria-expanded', 'false');
    if (restoreFocus) trigger?.focus({ preventScroll: true });
  }

  function runMoreAction(action) {
    closeMore(false);
    if (action === 'tec') return global.centralSidebarAction?.('tec-cadernos');
    if (action === 'law') return global.openEmbeddedTool?.('decorando', {});
    if (action === 'vade') return global.openEmbeddedTool?.('vade', {});
    if (action === 'settings') return global.openCentralSettings?.();
    if (action === 'logout') return document.querySelector('[data-bc-logout]')?.click();
    return false;
  }

  function ensureNavigation() {
    const nav = document.querySelector('#centralSidebar .nav');
    if (!nav) return;
    renameNavButton(nav.querySelector('button[onclick*="\'home\'"]'), 'Hoje', 'today');
    renameNavButton(nav.querySelector('[data-central-agenda]'), 'Plano', 'plan');
    renameNavButton(nav.querySelector('[data-central-native="disciplines"]'), 'Disciplinas', 'subjects');
    renameNavButton(nav.querySelector('button[onclick*="\'performance\'"]'), 'Progresso', 'progress');

    if (!byId('studentMoreButton')) {
      const button = document.createElement('button');
      button.id = 'studentMoreButton';
      button.type = 'button';
      button.className = 'student-more-button';
      button.dataset.studentPrimaryNav = 'more';
      button.setAttribute('aria-label', 'Mais opções');
      button.setAttribute('title', 'Mais opções');
      button.setAttribute('aria-haspopup', 'dialog');
      button.setAttribute('aria-expanded', 'false');
      button.innerHTML = '<span class="nav-icon student-more-icon" aria-hidden="true">•••</span><span class="nav-text">Mais</span>';
      button.addEventListener('click', () => {
        const panel = byId('studentMorePanel');
        if (!panel) return;
        const open = panel.hidden;
        panel.hidden = !open;
        document.documentElement.classList.toggle('student-more-open', open);
        button.setAttribute('aria-expanded', String(open));
        if (open) panel.querySelector('button')?.focus({ preventScroll: true });
      });
      nav.appendChild(button);
    }

    if (!byId('studentMorePanel')) {
      const panel = document.createElement('section');
      panel.id = 'studentMorePanel';
      panel.className = 'student-more-panel';
      panel.hidden = true;
      panel.setAttribute('role', 'dialog');
      panel.setAttribute('aria-modal', 'false');
      panel.setAttribute('aria-label', 'Mais opções');
      panel.innerHTML = `
        <div class="student-more-head"><div><small>Mais opções</small><b>Ferramentas da Central</b></div><button type="button" data-student-close-more aria-label="Fechar">×</button></div>
        <div class="student-more-grid">
          <button type="button" data-student-more-action="tec"><span aria-hidden="true">▤</span><span><b>Cadernos TEC</b><small>Questões e registros</small></span></button>
          <button type="button" data-student-more-action="law"><span aria-hidden="true">✓</span><span><b>Lei em Dia</b><small>Revisão de lei seca</small></span></button>
          <button type="button" data-student-more-action="vade"><span aria-hidden="true">§</span><span><b>Vade Mecum</b><small>Consulta rápida</small></span></button>
          <button type="button" data-student-more-action="settings"><span aria-hidden="true">⚙</span><span><b>Configurações</b><small>Aparência e dados</small></span></button>
          <button type="button" data-student-more-action="logout"><span aria-hidden="true">⇥</span><span><b>Sair da conta</b><small>Encerrar esta sessão</small></span></button>
        </div>`;
      panel.addEventListener('click', (event) => {
        const action = event.target.closest('[data-student-more-action]')?.dataset.studentMoreAction;
        if (action) runMoreAction(action);
        if (event.target.closest('[data-student-close-more]')) closeMore(true);
      });
      document.body.appendChild(panel);
    }
  }

  function canonicalProgress() {
    const list = subjects();
    if (!list.length) return;
    list.forEach((subject) => {
      if (subject.id === 'rlm') return;
      const percentages = global.CentralDisciplineLoader?.percentages(subject);
      if (!Array.isArray(percentages) || !percentages.length) return;
      const total = percentages.length;
      const done = percentages.filter((value) => Number(value) === 100).length;
      const percent = Math.round(percentages.reduce((sum, value) => sum + (Number(value) || 0), 0) / total);
      const home = document.querySelector(`#subjects > .subject[data-id="${subject.id}"]`);
      if (home) {
        const count = home.querySelector('.subject-count');
        const pct = home.querySelector('.subject-pct');
        const meta = home.querySelector('.bc-row-meta');
        const submeta = home.querySelector('.bc-home-submeta');
        const countText = `${done}/${total} módulos`;
        if (count && count.textContent !== countText) count.textContent = countText;
        if (pct && pct.textContent !== `${percent}%`) pct.textContent = `${percent}%`;
        if (meta && meta.textContent !== `${total} módulos`) meta.textContent = `${total} módulos`;
        if (submeta && submeta.textContent !== `${total} módulos · Curso Integrado`) submeta.textContent = `${total} módulos · Curso Integrado`;
        home.style.setProperty('--bc-pct', String(percent));
      }
      const card = document.querySelector(`#disciplineGrid .disc-card[data-id="${subject.id}"]`);
      if (card) {
        const small = card.querySelector('small');
        const meta = card.querySelector('.disc-meta');
        if (small && small.textContent !== `${total} módulos • curso integrado`) small.textContent = `${total} módulos • curso integrado`;
        if (meta && meta.textContent !== `${done}/${total} módulos · ${percent}%`) meta.textContent = `${done}/${total} módulos · ${percent}%`;
      }
    });
  }

  function nextRecommendation() {
    const agenda = global.CentralAgenda;
    const pending = typeof agenda?.read === 'function' ? agenda.read(localDate()).find((task) => !task.done) : null;
    if (pending) {
      const id = subjectId(pending.discipline);
      return {
        eyebrow: 'Tarefa de hoje',
        title: String(pending.task || 'Continuar o plano de hoje'),
        meta: `${pending.time || 'Sem horário'} · ${SUBJECT_LABELS[id] || pending.discipline || 'Estudo'} · cerca de 25 min`,
        action: id ? 'subject' : 'plan', id, label: id ? 'Começar agora' : 'Ver plano',
      };
    }
    const last = readLast();
    if (last && typeof last === 'object') {
      return {
        eyebrow: 'Continuar de onde parou',
        title: String(last.title || 'Retomar último estudo'),
        meta: 'Seu progresso foi salvo · cerca de 25 min',
        action: 'resume', label: 'Continuar estudo',
      };
    }
    const list = subjects().filter((subject) => subject.id !== 'rlm');
    let selected = list[0];
    let moduleNumber = 1;
    for (const subject of list) {
      const values = global.CentralDisciplineLoader?.percentages(subject);
      const started = Array.isArray(values) && values.some((value) => Number(value) > 0 && Number(value) < 100);
      const index = started ? values.findIndex((value) => Number(value) < 100) : -1;
      if (index >= 0) { selected = subject; moduleNumber = index + 1; break; }
    }
    return {
      eyebrow: 'Seu próximo passo',
      title: selected ? `${selected.name} · Módulo ${String(moduleNumber).padStart(2, '0')}` : 'Escolha sua primeira disciplina',
      meta: 'Comece pela leitura e avance para as questões · cerca de 25 min',
      action: selected ? 'subject' : 'subjects', id: selected?.id || '', label: 'Começar agora',
    };
  }

  function activateNextStep(data) {
    if (data.action === 'resume') return global.centralResumeLast?.();
    if (data.action === 'plan') return global.CentralAgenda?.open();
    if (data.action === 'subjects') return global.centralHardOpen?.('disciplines');
    if (data.id) return (global.centralHardSubject || global.jumpSubject)?.(data.id);
    return false;
  }

  function ensureNextStep() {
    const home = byId('homeView');
    const left = home?.querySelector('.home-grid > div:first-child');
    if (!left) return;
    let card = byId('studentNextStep');
    if (!card) {
      card = document.createElement('section');
      card.id = 'studentNextStep';
      card.className = 'card student-next-step';
      card.innerHTML = '<div class="student-next-copy"><small></small><h2></h2><p></p></div><button type="button" class="btn primary"></button>';
      left.insertBefore(card, left.firstChild);
    }
    const dashboard = left.querySelector('.home-dashboard-row');
    if (dashboard && card.nextElementSibling !== dashboard) left.insertBefore(card, dashboard);
    const data = nextRecommendation();
    const signature = JSON.stringify(data);
    if (card.dataset.signature !== signature) {
      card.dataset.signature = signature;
      card.querySelector('small').textContent = data.eyebrow;
      card.querySelector('h2').textContent = data.title;
      card.querySelector('p').textContent = data.meta;
      const button = card.querySelector('button');
      button.textContent = data.label;
      button.onclick = () => activateNextStep(data);
    }
  }

  function weekStats() {
    let total = 0; let done = 0;
    for (let offset = 0; offset < 7; offset += 1) {
      const tasks = global.CentralAgenda?.read?.(localDate(offset)) || [];
      total += tasks.length;
      done += tasks.filter((task) => task.done).length;
    }
    return { total, done, pending: Math.max(0, total - done), percent: total ? Math.round(done / total * 100) : 0 };
  }

  function ensureWeekSummary() {
    const left = byId('homeView')?.querySelector('.home-grid > div:first-child');
    const intro = byId('disciplinasHome');
    if (!left || !intro) return;
    let summary = byId('studentWeekSummary');
    if (!summary) {
      summary = document.createElement('section');
      summary.id = 'studentWeekSummary';
      summary.className = 'student-week-summary';
      summary.setAttribute('aria-label', 'Resumo dos próximos sete dias');
      left.insertBefore(summary, intro);
    }
    const stats = weekStats();
    const signature = `${stats.done}:${stats.pending}:${stats.percent}`;
    if (summary.dataset.signature === signature) return;
    summary.dataset.signature = signature;
    summary.innerHTML = `<div><small>Próximos 7 dias</small><b>${stats.total ? `${stats.done} de ${stats.total} concluídas` : 'Plano ainda vazio'}</b></div>
      <div><span><b>${stats.done}</b><small>concluídas</small></span><span><b>${stats.pending}</b><small>pendentes</small></span><span><b>${stats.percent}%</b><small>ritmo</small></span></div>`;
  }

  function ensureStudyPath() {
    document.querySelectorAll('#subjects > .subject.open:not([data-id="rlm"])').forEach((section) => {
      const body = section.querySelector(':scope > .subject-body');
      if (!body || body.querySelector(':scope > .student-study-path')) return;
      const guide = document.createElement('aside');
      guide.className = 'student-study-path';
      guide.setAttribute('aria-label', 'Sequência sugerida de estudo');
      guide.innerHTML = '<div><small>Sequência sugerida</small><b>Avance uma etapa por vez</b></div><ol><li><span>1</span>Leia</li><li><span>2</span>Pratique</li><li><span>3</span>Revise erros</li><li><span>4</span>Conclua</li></ol>';
      const bar = body.querySelector(':scope > .subject-bar');
      if (bar?.nextSibling) body.insertBefore(guide, bar.nextSibling); else body.prepend(guide);
    });
  }

  function agendaDayLabel(date, weekday = false) {
    const options = weekday ? { weekday: 'short', day: '2-digit', month: 'short' } : { weekday: 'long', day: '2-digit', month: 'long' };
    return new Intl.DateTimeFormat('pt-BR', options).format(new Date(`${date}T12:00:00`)).replace('.', '');
  }

  function renderAgendaWeek() {
    const host = byId('studentAgendaWeek');
    const selected = byId('agendaDate')?.value || localDate();
    if (!host) return;
    const days = Array.from({ length: 7 }, (_, offset) => {
      const date = localDate(offset);
      const tasks = global.CentralAgenda?.read?.(date) || [];
      const done = tasks.filter((task) => task.done).length;
      const preview = tasks.find((task) => !task.done) || tasks[0];
      return { date, tasks, done, preview };
    });
    const signature = `${selected}|${days.map(({ date, tasks }) => `${date}:${tasks.map((task) => `${task.id}:${task.done}:${task.task}`).join(',')}`).join('|')}`;
    if (host.dataset.signature !== signature) {
      host.dataset.signature = signature;
      host.innerHTML = days.map(({ date, tasks, done, preview }) => `<button type="button" class="student-agenda-day${date === selected ? ' active' : ''}" data-student-agenda-date="${date}" aria-pressed="${date === selected}">
        <span>${agendaDayLabel(date, true)}</span><b>${tasks.length ? `${done}/${tasks.length} feitas` : 'Livre'}</b><small>${preview ? String(preview.task || '').replace(/[&<>]/g, '') : 'Sem tarefa planejada'}</small></button>`
      ).join('');
    }
    const title = byId('studentAgendaDayTitle');
    const count = byId('studentAgendaDayCount');
    const tasks = global.CentralAgenda?.read?.(selected) || [];
    setText(title, agendaDayLabel(selected, false).replace(/^./, (char) => char.toUpperCase()));
    setText(count, tasks.length ? `${tasks.filter((task) => !task.done).length} pendente(s)` : 'Dia livre');
  }

  function ensureAgenda() {
    const view = byId('agendaView');
    const formGrid = view?.querySelector('.form-grid');
    const formCard = formGrid?.closest('.card');
    const editor = byId('agendaEditor');
    if (!view || !formCard || !editor) return;
    view.classList.add('student-agenda-view');
    const title = view.querySelector('.hero h1');
    const description = view.querySelector('.hero p');
    setText(title, 'Plano de estudos');
    setText(description, 'Veja a semana primeiro e ajuste uma tarefa quando precisar.');
    formCard.classList.add('student-agenda-form-card');

    let toolbar = byId('studentAgendaToolbar');
    if (!toolbar) {
      toolbar = document.createElement('div');
      toolbar.id = 'studentAgendaToolbar';
      toolbar.className = 'student-agenda-toolbar';
      toolbar.innerHTML = '<div><small>Organização simples</small><h2>Próximos 7 dias</h2></div><button id="studentAgendaAddToggle" type="button" class="btn primary" aria-expanded="false">+ Adicionar tarefa</button>';
      formCard.parentNode.insertBefore(toolbar, formCard);
      byId('studentAgendaAddToggle').addEventListener('click', () => {
        const hidden = formCard.hidden;
        formCard.hidden = !hidden;
        byId('studentAgendaAddToggle').setAttribute('aria-expanded', String(hidden));
        byId('studentAgendaAddToggle').textContent = hidden ? 'Fechar formulário' : '+ Adicionar tarefa';
        if (hidden) setTimeout(() => byId('agendaTask')?.focus(), 0);
      });
      formCard.hidden = true;
    }

    let week = byId('studentAgendaWeek');
    if (!week) {
      week = document.createElement('div');
      week.id = 'studentAgendaWeek';
      week.className = 'student-agenda-week';
      week.setAttribute('aria-label', 'Próximos sete dias');
      formCard.parentNode.insertBefore(week, formCard);
      week.addEventListener('click', (event) => {
        const button = event.target.closest('[data-student-agenda-date]');
        if (!button) return;
        const date = byId('agendaDate');
        if (date) {
          date.value = button.dataset.studentAgendaDate;
          date.dispatchEvent(new Event('change', { bubbles: true }));
        }
        global.CentralAgenda?.render?.();
        renderAgendaWeek();
      });
    }

    let dayCard = byId('studentAgendaDayCard');
    if (!dayCard) {
      dayCard = document.createElement('section');
      dayCard.id = 'studentAgendaDayCard';
      dayCard.className = 'card student-agenda-day-card';
      dayCard.innerHTML = '<div class="card-head"><div><small>Tarefas do dia</small><h2 id="studentAgendaDayTitle"></h2></div><span id="studentAgendaDayCount"></span></div>';
      formCard.parentNode.insertBefore(dayCard, formCard);
      dayCard.appendChild(editor);
    } else if (editor.parentElement !== dayCard) dayCard.appendChild(editor);
    const empty = editor.querySelector('.agenda-empty');
    setText(empty, 'Adicione leitura, questões ou revisão para este dia.');

    if (!byId('agendaDate')?.dataset.studentWeekBound) {
      const date = byId('agendaDate');
      if (date) {
        date.dataset.studentWeekBound = '1';
        date.addEventListener('change', () => setTimeout(renderAgendaWeek, 0));
      }
      byId('agendaAddButton')?.addEventListener('click', () => setTimeout(() => {
        renderAgendaWeek(); ensureNextStep(); ensureWeekSummary();
      }, 0));
      editor.addEventListener('change', () => setTimeout(() => {
        renderAgendaWeek(); ensureNextStep(); ensureWeekSummary();
      }, 0));
    }
    renderAgendaWeek();
  }

  function ensurePerformance() {
    const view = byId('performanceView');
    if (!view) return;
    view.classList.add('student-performance-view');
    const title = view.querySelector('.hero h1');
    const description = view.querySelector('.hero p');
    setText(title, 'Progresso');
    setText(description, 'Acompanhe suas sessões, questões e pontos que pedem mais atenção.');
    const duplicate = byId('mapaEstudos')?.closest('.card');
    duplicate?.classList.add('student-duplicate-map');
    const host = byId('perfBySubject');
    const mainCard = host?.closest('.card');
    if (!host || !mainCard) return;
    let heading = mainCard.querySelector('.student-performance-heading');
    if (!heading) {
      heading = document.createElement('div');
      heading.className = 'student-performance-heading';
      heading.innerHTML = '<div><small>Detalhamento</small><h2>Questões por disciplina</h2></div>';
      mainCard.insertBefore(heading, host);
    }
    let insight = byId('studentPerformanceInsight');
    if (!insight) {
      insight = document.createElement('section');
      insight.id = 'studentPerformanceInsight';
      insight.className = 'card student-performance-insight';
      insight.innerHTML = '<div><small>Próxima recomendação</small><h2></h2><p></p></div><button type="button" class="btn primary">Escolher disciplina</button>';
      insight.querySelector('button').onclick = () => global.centralHardOpen?.('disciplines');
      mainCard.insertAdjacentElement('afterend', insight);
    }
    const rows = Array.from(host.querySelectorAll('.hist')).map((row) => {
      const cells = row.querySelectorAll('span');
      const questions = Number((cells[1]?.textContent || '').match(/\d+/)?.[0] || 0);
      const accuracy = Number((cells[2]?.textContent || '').replace(',', '.').match(/\d+(?:\.\d+)?/)?.[0] || NaN);
      return { name: cells[0]?.textContent?.trim() || '', questions, accuracy };
    }).filter((row) => row.questions > 0 && Number.isFinite(row.accuracy));
    rows.sort((a, b) => a.accuracy - b.accuracy);
    const target = rows[0];
    const nextTitle = target ? `Revise ${target.name}` : 'Faça seu primeiro bloco de questões';
    const nextText = target ? `Seu aproveitamento atual é ${target.accuracy}%. Revise os erros antes de avançar.` : 'Os resultados por disciplina aparecem aqui assim que você registrar questões.';
    setText(insight.querySelector('h2'), nextTitle);
    setText(insight.querySelector('p'), nextText);
  }

  function readerIsOpen(element) {
    if (!element?.isConnected || element.hidden || element.getAttribute('aria-hidden') === 'true') return false;
    return getComputedStyle(element).display !== 'none';
  }

  function ensureReaders() {
    const readers = document.querySelectorAll('.bc-native-reader-overlay:not(.bc-rlm-overlay),.cf-native-overlay');
    readers.forEach((overlay) => {
      overlay.classList.add('student-reader-shell');
      const head = overlay.querySelector('.bc-native-reader-head,.cf-native-shell > header');
      const tools = overlay.querySelector('.bc-native-reader-tools,.cf-native-reader > aside');
      const close = head?.querySelector('.bc-native-reader-close,[data-close]');
      if (!head || !tools || head.querySelector('.student-reader-options-toggle')) return;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'student-reader-options-toggle';
      button.textContent = 'Aa';
      button.setAttribute('aria-label', 'Abrir opções de leitura');
      button.setAttribute('aria-expanded', 'false');
      button.onclick = () => {
        const open = !overlay.classList.contains('student-reader-options-open');
        overlay.classList.toggle('student-reader-options-open', open);
        button.setAttribute('aria-expanded', String(open));
        button.setAttribute('aria-label', open ? 'Fechar opções de leitura' : 'Abrir opções de leitura');
      };
      if (close) head.insertBefore(button, close); else head.appendChild(button);
    });
    const active = Array.from(readers).some(readerIsOpen) || document.documentElement.classList.contains('central-reading-fullscreen-v66124');
    document.documentElement.classList.toggle('student-reader-active', active);
  }

  function syncVisibleLabels() {
    const performance = byId('performanceView');
    const agenda = byId('agendaView');
    const crumb = byId('crumb');
    if (!crumb) return;
    if (performance && !performance.classList.contains('hidden')) setText(crumb, 'Progresso');
    else if (agenda && !agenda.classList.contains('hidden')) setText(crumb, 'Plano');
    else if (byId('homeView') && !byId('homeView').classList.contains('hidden')) setText(crumb, 'Hoje');
  }

  function enhance() {
    queued = false;
    document.documentElement.classList.add('student-experience-v2');
    ensureNavigation();
    canonicalProgress();
    ensureNextStep();
    ensureWeekSummary();
    ensureStudyPath();
    ensureAgenda();
    ensurePerformance();
    ensureReaders();
    syncVisibleLabels();
  }

  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(enhance);
  }

  function start() {
    enhance();
    const observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'hidden', 'aria-hidden'] });
    document.addEventListener('central:discipline-ready', schedule);
    global.addEventListener('central-cloud-applied', schedule);
    global.addEventListener('storage', schedule);
    document.addEventListener('click', (event) => {
      if (!event.target.closest('#studentMorePanel,#studentMoreButton')) closeMore(false);
      if (event.target.closest('#centralSidebar .nav button:not(#studentMoreButton)')) closeMore(false);
      setTimeout(schedule, 0);
    }, true);
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !byId('studentMorePanel')?.hidden) {
        event.preventDefault();
        closeMore(true);
      }
    });
    [120, 500, 1200].forEach((delay) => setTimeout(schedule, delay));
  }

  global.CentralStudentExperience = { enhance, renderAgendaWeek, canonicalProgress };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})(window);
