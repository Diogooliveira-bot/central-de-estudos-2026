(function (global) {
  'use strict';
  const UX = global.CentralStudentUX;
  if (!UX || global.__centralStudentDashboardV3) return;
  global.__centralStudentDashboardV3 = true;
  const { byId, setText, localDate, readJSON, writeJSON, subjects, subjectId, subjectProgress, escapeHTML } = UX;
  const PROFILE_KEY = 'central-v6:student-profile-v1';

  function readLast() { const last = readJSON('central-v6:last', null); return global.CentralDisciplineAvailability?.isRemovedRecord(last) ? null : last; }
  function friendlyLastTitle(last) {
    const title = String(last?.title || '').trim();
    if (title === 'decorando' || String(last?.url || '').includes('decorando')) return 'Lei em Dia';
    if (title === 'vade' || String(last?.url || '').includes('vade')) return 'Vade Mecum';
    return title || 'Último estudo';
  }
  function agendaTasks(offset = 0) { return global.CentralAgenda?.read?.(localDate(offset)) || []; }
  function canonicalProgress() {
    for (const subject of subjects()) {
      if (subject.id === 'rlm') continue;
      const progress = subjectProgress(subject);
      if (!progress) continue;
      const { total, done, percent } = progress;
      const home = document.querySelector(`#subjects > .subject[data-id="${subject.id}"]`);
      if (home) {
        setText(home.querySelector('.subject-count'), `${done}/${total} módulos`);
        setText(home.querySelector('.subject-pct'), `${percent}%`);
        setText(home.querySelector('.bc-row-meta'), `${total} módulos`);
        setText(home.querySelector('.bc-home-submeta'), `${total} módulos · Curso Integrado`);
        home.style.setProperty('--bc-pct', String(percent));
      }
      const card = document.querySelector(`#disciplineGrid .disc-card[data-id="${subject.id}"]`);
      if (card) {
        setText(card.querySelector(':scope > small'), `${total} módulos • curso integrado`);
        setText(card.querySelector(':scope > .disc-meta'), `${done}/${total} módulos · ${percent}%`);
      }
    }
  }
  function nextRecommendation() {
    const pending = agendaTasks(0).find((task) => !task.done);
    if (pending) {
      const id = subjectId(pending.disciplineId || pending.discipline);
      return {
        eyebrow:'Tarefa de hoje', title:String(pending.task || 'Continuar o plano de hoje'),
        meta:`${pending.time || 'Sem horário'} · ${UX.SUBJECT_LABELS[id] || pending.discipline || 'Estudo'} · cerca de 25 min`,
        action:id ? 'subject' : 'plan', id, label:id ? 'Começar agora' : 'Ver plano',
      };
    }
    const last = readLast();
    if (last && typeof last === 'object') return {
      eyebrow:'Continuar de onde parou', title:friendlyLastTitle(last),
      meta:'Seu progresso foi salvo · cerca de 25 min', action:'resume', label:'Continuar estudo',
    };
    const list = subjects().filter((subject) => subject.id !== 'rlm');
    let selected = list[0]; let moduleNumber = 1;
    for (const subject of list) {
      const progress = subjectProgress(subject);
      if (progress?.status === 'active') { selected = subject; moduleNumber = progress.current; break; }
    }
    return {
      eyebrow:'Seu próximo passo',
      title:selected ? `${selected.name} · Módulo ${String(moduleNumber).padStart(2, '0')}` : 'Escolha sua primeira disciplina',
      meta:'Comece pela leitura e avance para as questões · cerca de 25 min',
      action:selected ? 'subject' : 'subjects', id:selected?.id || '', label:'Começar agora',
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
    const left = byId('homeView')?.querySelector('.home-grid > div:first-child');
    if (!left) return;
    let card = byId('studentNextStep');
    if (!card) {
      card = document.createElement('section');
      card.id = 'studentNextStep'; card.className = 'card student-next-step';
      card.innerHTML = '<div class="student-next-copy"><small></small><h2></h2><p></p></div><button type="button" class="btn primary"></button>';
      left.prepend(card);
    }
    const dashboard = left.querySelector('.home-dashboard-row');
    if (dashboard && card.nextElementSibling !== dashboard) left.insertBefore(card, dashboard);
    const data = nextRecommendation();
    const signature = JSON.stringify(data);
    if (card.dataset.signature === signature) return;
    card.dataset.signature = signature;
    setText(card.querySelector('small'), data.eyebrow); setText(card.querySelector('h2'), data.title); setText(card.querySelector('p'), data.meta);
    const button = card.querySelector('button'); setText(button, data.label); button.onclick = () => activateNextStep(data);
  }
  function weekStats() {
    let total = 0; let done = 0;
    for (let offset = 0; offset < 7; offset += 1) {
      const tasks = agendaTasks(offset); total += tasks.length; done += tasks.filter((task) => task.done).length;
    }
    return { total, done, pending:Math.max(0, total - done), percent:total ? Math.round(done / total * 100) : 0 };
  }
  function ensureWeekSummary() {
    const left = byId('homeView')?.querySelector('.home-grid > div:first-child');
    const intro = byId('disciplinasHome');
    if (!left || !intro) return;
    let summary = byId('studentWeekSummary');
    if (!summary) {
      summary = document.createElement('section'); summary.id = 'studentWeekSummary'; summary.className = 'student-week-summary';
      summary.setAttribute('aria-label', 'Resumo dos próximos sete dias'); left.insertBefore(summary, intro);
    }
    const stats = weekStats(); const signature = `${stats.done}:${stats.pending}:${stats.percent}`;
    if (summary.dataset.signature === signature) return;
    summary.dataset.signature = signature;
    summary.innerHTML = `<div><small>Próximos 7 dias</small><b>${stats.total ? `${stats.done} de ${stats.total} concluídas` : 'Plano ainda vazio'}</b></div>
      <div><span><b>${stats.done}</b><small>concluídas</small></span><span><b>${stats.pending}</b><small>pendentes</small></span><span><b>${stats.percent}%</b><small>ritmo</small></span></div>`;
  }
  function lastMatchesSubject(last, subject) {
    if (!last || !subject) return false;
    if (String(last.topicUid || '').startsWith(`${subject.id}-`)) return true;
    return String(last.title || '').toLocaleLowerCase('pt-BR').includes(subject.name.toLocaleLowerCase('pt-BR'));
  }
  function ensureSubjectSummaries() {
    const last = readLast();
    for (const subject of subjects()) {
      if (subject.id === 'rlm') continue;
      const section = document.querySelector(`#subjects > .subject[data-id="${subject.id}"]`);
      if (!section) continue;
      let summary = section.querySelector(':scope > .student-subject-summary');
      if (!summary) {
        summary = document.createElement('div'); summary.className = 'student-subject-summary';
        section.insertBefore(summary, section.querySelector(':scope > .subject-body'));
      }
      const progress = subjectProgress(subject);
      if (!progress) { summary.hidden = true; continue; }
      summary.hidden = false;
      const statusLabel = progress.status === 'done' ? 'Concluída' : progress.status === 'active' ? 'Em andamento' : 'Não iniciada';
      const moduleLabel = `Módulo ${String(progress.current).padStart(2, '0')}`;
      const recent = lastMatchesSubject(last, subject) ? 'Última atividade' : `${Math.max(0, progress.total - progress.done)} pendentes`;
      const signature = `${statusLabel}:${moduleLabel}:${recent}:${progress.percent}`;
      if (summary.dataset.signature === signature) continue;
      summary.dataset.signature = signature;
      summary.innerHTML = `<div class="student-subject-status ${progress.status}"><span>${statusLabel}</span><b>${moduleLabel}</b><small>${recent}</small></div>
        <button type="button" class="student-subject-action">${progress.status === 'new' ? 'Começar' : progress.status === 'done' ? 'Revisar' : 'Continuar'} <span aria-hidden="true">→</span></button>`;
      summary.querySelector('button').onclick = (event) => { event.stopPropagation(); (global.centralHardSubject || global.jumpSubject)?.(subject.id); };
    }
  }
  function ensureDisciplineCards() {
    for (const subject of subjects()) {
      if (subject.id === 'rlm') continue;
      const card = document.querySelector(`#disciplineGrid .disc-card[data-id="${subject.id}"]`);
      const progress = subjectProgress(subject);
      if (!card || !progress) continue;
      card.classList.add('student-discipline-card');
      let details = card.querySelector('.student-discipline-details');
      if (!details) { details = document.createElement('span'); details.className = 'student-discipline-details'; card.appendChild(details); }
      const statusLabel = progress.status === 'done' ? 'Concluída' : progress.status === 'active' ? 'Em andamento' : 'Não iniciada';
      const signature = `${progress.percent}:${progress.current}:${statusLabel}`;
      if (details.dataset.signature === signature) continue;
      details.dataset.signature = signature;
      details.innerHTML = `<span class="student-card-progress"><i style="width:${progress.percent}%"></i></span><span><em>${statusLabel}</em><b>${progress.status === 'done' ? 'Revisar módulos' : progress.status === 'new' ? `Começar pelo módulo ${String(progress.current).padStart(2, '0')}` : `Continuar no módulo ${String(progress.current).padStart(2, '0')}`}</b></span><strong>${progress.status === 'new' ? 'Começar' : 'Continuar'} →</strong>`;
    }
  }
  function progressDays() {
    return Array.from({ length:7 }, (_, index) => {
      const offset = index - 6; const tasks = agendaTasks(offset); const done = tasks.filter((task) => task.done).length;
      const date = new Date(`${localDate(offset)}T12:00:00`);
      return { label:new Intl.DateTimeFormat('pt-BR', { weekday:'short' }).format(date).replace('.', ''), total:tasks.length, done, percent:tasks.length ? Math.round(done / tasks.length * 100) : 0 };
    });
  }
  function ensurePerformance() {
    const view = byId('performanceView'); if (!view) return;
    view.classList.add('student-performance-view');
    setText(view.querySelector('.hero h1'), 'Progresso');
    setText(view.querySelector('.hero p'), 'Acompanhe seu ritmo, seus resultados e o próximo ponto que pede atenção.');
    byId('mapaEstudos')?.closest('.card')?.classList.add('student-duplicate-map');
    const host = byId('perfBySubject'); const mainCard = host?.closest('.card'); if (!host || !mainCard) return;
    let weekly = byId('studentProgressWeek');
    if (!weekly) {
      weekly = document.createElement('section'); weekly.id = 'studentProgressWeek'; weekly.className = 'card student-progress-week';
      mainCard.parentNode.insertBefore(weekly, mainCard);
    }
    const days = progressDays(); const total = days.reduce((sum, day) => sum + day.total, 0); const done = days.reduce((sum, day) => sum + day.done, 0);
    const signature = days.map((day) => `${day.total}:${day.done}`).join('|');
    if (weekly.dataset.signature !== signature) {
      weekly.dataset.signature = signature;
      weekly.innerHTML = `<div class="student-progress-week-head"><div><small>Ritmo semanal</small><h2>${total ? `${done} de ${total} tarefas concluídas` : 'Comece pelo seu plano semanal'}</h2></div><span>${total ? Math.round(done / total * 100) : 0}%</span></div>
        <div class="student-week-chart" aria-label="Conclusão dos últimos sete dias">${days.map((day) => `<div><span><i style="height:${Math.max(day.percent, day.total ? 8 : 2)}%"></i></span><b>${day.label}</b><small>${day.done}/${day.total}</small></div>`).join('')}</div>`;
    }
    if (!mainCard.querySelector('.student-performance-heading')) {
      const heading = document.createElement('div'); heading.className = 'student-performance-heading';
      heading.innerHTML = '<div><small>Resultados</small><h2>Questões por disciplina</h2></div>'; mainCard.insertBefore(heading, host);
    }
    let insight = byId('studentPerformanceInsight');
    if (!insight) {
      insight = document.createElement('section'); insight.id = 'studentPerformanceInsight'; insight.className = 'card student-performance-insight';
      insight.innerHTML = '<div><small>Próxima recomendação</small><h2></h2><p></p></div><button type="button" class="btn primary">Escolher disciplina</button>';
      insight.querySelector('button').onclick = () => global.centralHardOpen?.('disciplines'); mainCard.insertAdjacentElement('afterend', insight);
    }
    const rows = Array.from(host.querySelectorAll('.hist')).map((row) => {
      const cells = row.querySelectorAll('span');
      return { name:cells[0]?.textContent?.trim() || '', questions:Number((cells[1]?.textContent || '').match(/\d+/)?.[0] || 0), accuracy:Number((cells[2]?.textContent || '').replace(',', '.').match(/\d+(?:\.\d+)?/)?.[0] || NaN) };
    }).filter((row) => row.questions > 0 && Number.isFinite(row.accuracy)).sort((a, b) => a.accuracy - b.accuracy);
    const target = rows[0];
    setText(insight.querySelector('h2'), target ? `Revise ${target.name}` : 'Faça seu primeiro bloco de questões');
    setText(insight.querySelector('p'), target ? `Seu aproveitamento atual é ${target.accuracy}%. Revise os erros antes de avançar.` : 'Os resultados aparecem aqui assim que você registrar questões.');
  }

  function hasStudentActivity() {
    if (readLast()) return true;
    if (Array.from({ length:7 }, (_, offset) => agendaTasks(offset).length).some(Boolean)) return true;
    return subjects().some((subject) => subject.id !== 'rlm' && (subjectProgress(subject)?.percent || 0) > 0);
  }
  function onboardingMarkup(profile) {
    const selected = new Set(profile.priorities || ['pt', 'cf', 'adm']);
    const days = new Set(profile.days || [1, 2, 3, 4, 5]);
    return `<div class="student-onboarding-backdrop" data-student-onboarding>
      <section class="student-onboarding" role="dialog" aria-modal="true" aria-labelledby="studentOnboardingTitle">
        <button type="button" class="student-onboarding-close" data-onboarding-close aria-label="Configurar depois">×</button>
        <div class="student-onboarding-brand"><span>✓</span><div><small>BASE COMPLETA</small><b>Seu plano de partida</b></div></div>
        <div class="student-onboarding-intro"><span>1 minuto</span><h1 id="studentOnboardingTitle">Vamos organizar seus estudos</h1><p>Escolha uma rotina inicial. Você poderá alterar tudo depois em Mais → Meu plano.</p></div>
        <form id="studentOnboardingForm">
          <label class="student-field"><span>Seu objetivo</span><input name="objective" value="${escapeHTML(profile.objective || 'TJCE 2026 — Analista Judiciário')}" maxlength="80" required></label>
          <div class="student-onboarding-row"><label class="student-field"><span>Tempo por dia</span><select name="minutes"><option value="30">30 minutos</option><option value="45">45 minutos</option><option value="60">1 hora</option><option value="90">1h30</option><option value="120">2 horas</option></select></label></div>
          <fieldset><legend>Dias disponíveis</legend><div class="student-choice-row">${[['D','Domingo',0],['S','Segunda-feira',1],['T','Terça-feira',2],['Q','Quarta-feira',3],['Q','Quinta-feira',4],['S','Sexta-feira',5],['S','Sábado',6]].map(([label, name, value]) => `<label><input type="checkbox" name="days" value="${value}" aria-label="${name}" ${days.has(value) ? 'checked' : ''}><span aria-hidden="true">${label}</span></label>`).join('')}</div></fieldset>
          <fieldset><legend>Prioridades iniciais <small>escolha até 3</small></legend><div class="student-priority-grid">${subjects().filter((subject) => subject.id !== 'rlm').map((subject) => `<label><input type="checkbox" name="priorities" value="${subject.id}" ${selected.has(subject.id) ? 'checked' : ''}><span>${escapeHTML(subject.name)}</span></label>`).join('')}</div></fieldset>
          <div class="student-onboarding-actions"><button type="button" class="btn" data-onboarding-close>Agora não</button><button type="submit" class="btn primary">Salvar meu plano</button></div>
        </form>
      </section></div>`;
  }
  function createStarterPlan(profile) {
    const ids = profile.priorities || []; if (!ids.length) return;
    let cursor = 0;
    for (let offset = 0; offset < 7; offset += 1) {
      const date = new Date(`${localDate(offset)}T12:00:00`);
      if (!profile.days.includes(date.getDay())) continue;
      const key = `central-v6:agenda:${localDate(offset)}`;
      const current = readJSON(key, []); if (Array.isArray(current) && current.length) continue;
      const id = ids[cursor % ids.length]; const label = UX.SUBJECT_LABELS[id] || id; cursor += 1;
      writeJSON(key, [{ id:Date.now() + offset, time:'', discipline:label, disciplineId:id, task:`Estudar ${Math.max(20, Number(profile.minutes) || 60)} minutos`, done:false }]);
    }
  }
  function closeOnboarding(dismiss = true) {
    const modal = document.querySelector('[data-student-onboarding]'); if (!modal) return;
    if (dismiss && !readJSON(PROFILE_KEY, null)) writeJSON(PROFILE_KEY, { dismissed:true });
    modal.remove(); document.documentElement.classList.remove('student-onboarding-open');
    byId('studentMoreButton')?.focus({ preventScroll:true }); UX.schedule();
  }
  function openOnboarding() {
    document.querySelector('[data-student-onboarding]')?.remove();
    const current = readJSON(PROFILE_KEY, {}) || {};
    document.body.insertAdjacentHTML('beforeend', onboardingMarkup(current));
    document.documentElement.classList.add('student-onboarding-open');
    const modal = document.querySelector('[data-student-onboarding]'); const form = byId('studentOnboardingForm');
    form.elements.minutes.value = String(current.minutes || 60);
    modal.addEventListener('click', (event) => {
      if (event.target.matches('[data-student-onboarding]') || event.target.closest('[data-onboarding-close]')) closeOnboarding(true);
      const priority = event.target.closest('input[name="priorities"]');
      if (priority && form.querySelectorAll('input[name="priorities"]:checked').length > 3) priority.checked = false;
    });
    modal.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') { event.preventDefault(); closeOnboarding(true); return; }
      if (event.key !== 'Tab') return;
      const focusable = Array.from(modal.querySelectorAll('button,input,select,[href],[tabindex]:not([tabindex="-1"])')).filter((element) => !element.disabled && element.getClientRects().length);
      if (!focusable.length) return;
      const first = focusable[0]; const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const profile = { objective:String(data.get('objective') || '').trim(), minutes:Number(data.get('minutes') || 60), days:data.getAll('days').map(Number), priorities:data.getAll('priorities').slice(0, 3), completedAt:new Date().toISOString() };
      if (!profile.days.length || !profile.priorities.length) return;
      writeJSON(PROFILE_KEY, profile); createStarterPlan(profile); closeOnboarding(false);
      global.dispatchEvent(new Event('central-cloud-applied'));
    });
    setTimeout(() => form.elements.objective?.focus(), 0);
  }
  function ensureOnboarding() {
    // The required career/exam/free-study choice replaces the legacy free-text
    // objective prompt; keep its routine planner from opening a second modal.
    if (global.CentralStudyObjectives) return;
    const home = byId('homeView');
    if (!home || home.classList.contains('hidden')) return;
    if (readJSON(PROFILE_KEY, null) || hasStudentActivity() || document.querySelector('[data-student-onboarding]')) return;
    setTimeout(() => {
      if (!home.classList.contains('hidden') && !readJSON(PROFILE_KEY, null) && !hasStudentActivity()) openOnboarding();
    }, 700);
  }
  function enhance() {
    canonicalProgress(); ensureNextStep(); ensureWeekSummary(); ensureSubjectSummaries(); ensureDisciplineCards(); ensurePerformance(); ensureOnboarding();
  }
  global.CentralStudentOnboarding = { open:openOnboarding, close:closeOnboarding, read:() => readJSON(PROFILE_KEY, null) };
  UX.register('dashboard', enhance);
})(window);

