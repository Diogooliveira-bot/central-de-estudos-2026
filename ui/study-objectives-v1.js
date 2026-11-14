/* Seleção e persistência do objetivo sem alterar IDs, módulos ou estado de estudo. */
(function (global) {
  'use strict';
  if (global.CentralStudyObjectives) return;

  const catalog = global.CentralStudyObjectiveCatalog;
  const UX = global.CentralStudentUX;
  if (!catalog || !UX) return;

  const KEY = 'central-v6:study-objective:v1';
  const PENDING_KEY = 'central-v6:study-objective:pending:v1';
  const FREE_SUBJECTS_KEY = 'central-v6:free-study-subjects:v1';
  function savedFreeSubjectIds() {
    try {
      const raw = localStorage.getItem(FREE_SUBJECTS_KEY);
      if (raw === null) return null;
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return null;
      const unique = [...new Set(parsed.filter((id) => !!catalog.subjects[id]))];
      return unique.length ? unique : null;
    } catch (_) { return null; }
  }
  let activeId = '';
  let loaded = false;
  let loading = false;
  let returnFocus = null;

  const goal = () => catalog.goals[activeId] || null;
  const allSubjectIds = () => Object.keys(catalog.subjects);
  function activeSubjectIds() {
    const current = goal();
    if (!current) return allSubjectIds();
    return current.type === 'free' ? (savedFreeSubjectIds() || allSubjectIds()) : current.subjectIds.slice();
  }
  function activeQuestionKeys() {
    const allowed = new Set(activeSubjectIds());
    if (!activeId || (activeId === 'free-study' && !savedFreeSubjectIds())) return null;
    return new Set(Object.values(catalog.subjects).filter((subject) => allowed.has(subject.id) && subject.questionKey).map((subject) => subject.questionKey));
  }
  function dispatchChange() {
    document.dispatchEvent(new CustomEvent('central:study-objective-changed', { detail:{ objectiveId:activeId, objective:goal() } }));
    UX.schedule();
  }
  function localObjective() {
    const saved = localStorage.getItem(KEY) || '';
    return catalog.goals[saved] ? saved : '';
  }
  async function persistRemote(id) {
    if (global.__BASE_COMPLETA_PREVIEW_GUEST__ === true) return false;
    if (!navigator.onLine) {
      localStorage.setItem(PENDING_KEY, '1');
      setSyncMessage('Objetivo salvo neste aparelho; será sincronizado quando a conexão voltar.');
      return false;
    }
    try {
      const response = await fetch('/api/objective', {
        method:'PUT', cache:'no-store', headers:{ 'Content-Type':'application/json' },
        body:JSON.stringify({
          objectiveId:id,
          ...(id === 'free-study' && savedFreeSubjectIds() ? { freeSubjectIds:savedFreeSubjectIds() } : {}),
        }),
      });
      if (!response.ok) throw new Error('Falha HTTP ' + response.status);
      localStorage.removeItem(PENDING_KEY);
      setSyncMessage('Objetivo salvo na sua conta.');
      return true;
    } catch (_) {
      localStorage.setItem(PENDING_KEY, '1');
      setSyncMessage('Objetivo salvo neste aparelho; será sincronizado quando a conexão voltar.');
      return false;
    }
  }
  function setSyncMessage(message) {
    document.querySelectorAll('[data-study-objective-sync],[data-settings-objective-sync]').forEach((node) => {
      if (node.textContent !== message) node.textContent = message;
    });
  }
  async function selectObjective(id) {
    if (!catalog.goals[id]) return false;
    activeId = id;
    localStorage.setItem(KEY, id);
    dispatchChange();
    applyObjective();
    close(true);
    await persistRemote(id);
    return true;
  }
  function setActive(id) {
    if (!catalog.goals[id]) return false;
    activeId = id;
    localStorage.setItem(KEY, id);
    dispatchChange();
    applyObjective();
    return true;
  }
  function objectiveCard(subject, examEntry) {
    const preparation = examEntry.status === 'preparation';
    const title = examEntry.title || subject?.name || '';
    const note = examEntry.note || subject?.notice || '';
    if (preparation || !examEntry.subjectId) {
      return `<article class="study-objective-card study-objective-card--pending" data-study-objective-goal="${UX.escapeHTML(activeId)}"><span class="study-objective-icon" aria-hidden="true">↗</span><div><b>${UX.escapeHTML(title)}</b><small>${UX.escapeHTML(note || 'Conteúdo em preparação.')}</small></div><span class="study-objective-status">Em preparação</span></article>`;
    }
    const label = examEntry.status === 'partial' ? 'Cobertura parcial' : 'Abrir disciplina';
    return `<button type="button" class="study-objective-card" data-study-objective-goal="${UX.escapeHTML(activeId)}" data-study-open-subject="${UX.escapeHTML(examEntry.subjectId)}"><span class="study-objective-icon" aria-hidden="true">↗</span><div><b>${UX.escapeHTML(title)}</b><small>${UX.escapeHTML(note || 'Conteúdo disponível na Central.')}</small></div><span class="study-objective-status">${label}</span></button>`;
  }
  function renderDisciplineCards() {
    const host = document.getElementById('disciplineGrid');
    if (!host) return;
    const current = goal();
    if (!current) return;
    const selectedIds = activeSubjectIds();
    const signature = activeId + '|' + selectedIds.join(',');
    if (host.dataset.studyObjectiveSignature === signature && host.children.length === (current.examSubjects?.length || selectedIds.length) && [...host.children].every((el) => el.dataset.studyObjectiveGoal === activeId)) return;
    let html = '';
    if (current.examSubjects) {
      html = current.examSubjects.map((entry) => objectiveCard(catalog.subjects[entry.subjectId], entry)).join('');
    } else {
      html = selectedIds.map((id) => objectiveCard(catalog.subjects[id], { subjectId:id, title:catalog.subjects[id].name })).join('');
    }
    host.innerHTML = html;
    host.dataset.studyObjectiveSignature = signature;
  }
  function ensureSettingsObjectiveControl() {
    const body = document.querySelector('#centralSettingsBackdrop .central-settings-body');
    if (!body) return;
    let block = document.getElementById('studySettingsObjective');
    if (!block) {
      block = document.createElement('section');
      block.id = 'studySettingsObjective';
      block.className = 'study-settings-objective';
      block.setAttribute('aria-labelledby', 'studySettingsObjectiveTitle');
      block.innerHTML =
        '<div><span class="study-settings-objective-kicker">MEUS ESTUDOS</span>' +
        '<h3 id="studySettingsObjectiveTitle">Objetivo de estudo</h3>' +
        '<p data-settings-objective-label>Carregando objetivo…</p></div>' +
        '<button type="button" data-settings-change-objective>Alterar objetivo</button>' +
        '<p class="study-settings-sync" data-settings-objective-sync role="status"></p>';
      block.querySelector('[data-settings-change-objective]').addEventListener('click', () => {
        global.closeCentralSettings?.();
        open();
      });
      body.insertBefore(block, body.firstElementChild);
    }
    const label = block.querySelector('[data-settings-objective-label]');
    const next = goal()?.title || 'Nenhum objetivo selecionado';
    if (label && label.textContent !== next) label.textContent = next;
  }
  function renderTopbar() {
    // O objetivo fica exclusivamente em Configurações para não ocupar o topo.
    document.getElementById('studyObjectiveTopbar')?.remove();
    ensureSettingsObjectiveControl();
  }
  function applyObjective() {
    const allowed = new Set(activeSubjectIds());
    document.querySelectorAll('#subjects > .subject[data-id]').forEach((section) => {
      const hide = !!activeId && !allowed.has(section.dataset.id);
      section.hidden = hide;
      section.classList.toggle('study-objective-hidden', hide);
    });
    renderTopbar();
    renderDisciplineCards();
    const activeModule = document.querySelector('#moduleView:not(.hidden) [data-subject-id],#moduleView:not(.hidden) .subject[data-id]');
    const activeSubject = document.querySelector('#homeView #subjects > .subject.open[data-id]');
    const currentId = activeModule?.dataset.subjectId || activeModule?.dataset.id || activeSubject?.dataset.id;
    if (currentId && activeId && !allowed.has(currentId) && typeof global.openHome === 'function') global.openHome();
  }
  function observeDynamicSubjects() {
    const host = document.getElementById('subjects');
    if (!host || host.__studyObjectiveObserver) return;
    const observer = new MutationObserver(() => {
      const allowed = new Set(activeSubjectIds());
      host.querySelectorAll(':scope > .subject[data-id]').forEach((section) => {
        const hide = !!activeId && !allowed.has(section.dataset.id);
        section.hidden = hide;
        section.classList.toggle('study-objective-hidden', hide);
      });
    });
    observer.observe(host, { childList:true });
    host.__studyObjectiveObserver = observer;
    host.addEventListener('central:study-objective-changed', applyObjective);
    const grid = document.getElementById('disciplineGrid');
    if (grid && !grid.__studyObjectiveGridObserver) {
      const gridObserver = new MutationObserver(() => renderDisciplineCards());
      gridObserver.observe(grid, { childList:true });
      grid.__studyObjectiveGridObserver = gridObserver;
    }
    const app = document.getElementById('appRoot');
    if (app && !app.__studyObjectiveViewObserver) {
      const viewObserver = new MutationObserver(() => renderTopbar());
      viewObserver.observe(app, { subtree:true, attributes:true, attributeFilter:['class'] });
      app.__studyObjectiveViewObserver = viewObserver;
    }
  }
  function renderChooser(step = 'areas', value = '') {
    let modal = document.getElementById('studyObjectiveDialog');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'studyObjectiveDialog';
      modal.className = 'study-objective-backdrop';
      document.body.appendChild(modal);
    }
    const initial = !activeId;
    const selected = goal();
    const escape = (v) => UX.escapeHTML(v);
    const card = (area) =>
      '<button type="button" class="study-area-card" data-study-area="' + escape(area.id) + '">' +
      '<span class="study-area-icon" aria-hidden="true">' + escape(area.icon) + '</span>' +
      '<span class="study-area-copy"><strong>' + escape(area.title) + '</strong><small>' + escape(area.description) + '</small></span>' +
      '<span class="study-area-chevron" aria-hidden="true">›</span></button>';
    const roleCard = (item) =>
      '<button type="button" class="study-role-card" data-study-role="' + escape(item.id) + '">' +
      '<span><strong>' + escape(item.title) + '</strong><small>Ver matérias sugeridas</small></span><b aria-hidden="true">›</b></button>';

    let title = 'Bem-vindo à Base Completa!';
    let intro = 'Vamos organizar seus estudos. Primeiro, escolha a área em que deseja atuar.';
    let badge = initial ? 'SEU PRIMEIRO ACESSO' : 'ALTERAR OBJETIVO';
    let options = '';
    let backStep = '';
    let backValue = '';
    if (step === 'areas') {
      const mainAreas = catalog.areas.slice(0,6);
      const otherAreas = catalog.areas.slice(6);
      options = '<div class="study-area-grid">' + mainAreas.map(card).join('') + '</div>' +
        '<details class="study-more-areas"><summary>Ver outras áreas</summary><div class="study-area-grid">' +
        otherAreas.map(card).join('') + '</div></details>' +
        '<div class="study-start-alternatives">' +
        '<button type="button" class="study-free-entry" data-study-free><span aria-hidden="true">✦</span><span><strong>Estudo livre</strong><small>Escolha as disciplinas que deseja estudar, sem escolher um cargo.</small></span><b aria-hidden="true">›</b></button>' +
        '</div>';
    } else if (step === 'roles') {
      const area = catalog.areas.find((a) => a.id === value);
      if (!area) return renderChooser('areas');
      title = 'Qual cargo você pretende conquistar?';
      intro = area.title + ' — selecione seu cargo para ver uma sugestão inicial de disciplinas.';
      badge = 'ETAPA 2 DE 3';
      const roles = Object.values(catalog.goals).filter((item) => item.type === 'career' && item.area === area.id);
      options = '<div class="study-role-grid">' + roles.map(roleCard).join('') + '</div>';
      backStep = 'areas';
    } else if (step === 'review') {
      const chosen = catalog.goals[value];
      if (!chosen || chosen.type !== 'career') return renderChooser('areas');
      title = 'Sua primeira trilha de estudos';
      intro = chosen.title;
      badge = 'ETAPA 3 DE 3';
      options = '<div class="study-review"><p>Estas são as disciplinas <strong>já disponíveis</strong> na Base Completa que podem ajudar a começar:</p>' +
        '<div class="study-subject-chips">' + chosen.subjectIds.map((id) =>
          '<span>' + escape(catalog.subjects[id]?.name || id) + '</span>').join('') +
        '</div><p class="study-disclaimer">Esta seleção é uma referência inicial, não substitui o conteúdo programático do edital. Outras matérias específicas podem estar em preparação.</p>' +
        '<button type="button" class="study-primary-button" data-study-confirm="' + escape(value) + '">Começar meus estudos</button></div>';
      backStep = 'roles';backValue = chosen.area;
    } else if (step === 'free') {
      title = 'Monte seu estudo livre';
      intro = 'Escolha as disciplinas que deseja estudar. Depois de salvar, abra uma delas na página inicial e comece pelo primeiro módulo. Pode alterar sua seleção depois, sem perder o progresso.';
      badge = 'ESTUDO LIVRE';
      const selectedIds = savedFreeSubjectIds() || [];
      options = '<div class="study-free-picker"><p>Selecione pelo menos uma disciplina.</p><div class="study-free-grid">' +
        Object.values(catalog.subjects).filter((item) => item.available).map((item) =>
          '<label class="study-free-choice"><input type="checkbox" name="studyFreeSubject" value="' + escape(item.id) + '"' +
          (selectedIds.includes(item.id) ? ' checked' : '') +
          '><span>' + escape(item.name) + '</span></label>').join('') +
        '</div><p class="study-form-error" role="alert" hidden></p>' +
        '<button type="button" class="study-primary-button" data-study-save-free>Começar estudo livre</button></div>';
      backStep = 'areas';
    } else if (step === 'exams') {
      title = 'Escolha um edital cadastrado';
      intro = 'Veja os concursos já cadastrados. Alguns assuntos ainda estão em preparação.';
      badge = 'ESTUDO POR EDITAL';
      const exams = Object.values(catalog.goals).filter((item) => item.type === 'exam');
      options = '<div class="study-role-grid">' + exams.map((item) =>
        '<button type="button" class="study-role-card" data-study-exam="' + escape(item.id) + '"><span><strong>' +
        escape(item.title) + '</strong><small>' + escape(item.description) + '</small></span><b aria-hidden="true">›</b></button>'
      ).join('') + '</div>';
      backStep = 'areas';
    }
    modal.innerHTML = '<section class="study-objective-dialog study-welcome-dialog" role="dialog" aria-modal="true" aria-labelledby="studyObjectiveTitle">' +
      '<header class="study-welcome-brand"><img src="/assets/base-completa-symbol.webp" alt="" width="40" height="40"><div><b>BASE COMPLETA</b><small>CENTRAL DE ESTUDOS</small></div></header>' +
      '<div class="study-welcome-intro"><div><span>' + badge + '</span><h1 id="studyObjectiveTitle">' + escape(title) +
      '</h1><p>' + escape(intro) + '</p></div><img src="/assets/mascote/mascote-boas-vindas.webp" alt="" aria-hidden="true" loading="lazy"></div>' +
      options +
      '<p class="study-objective-sync" data-study-objective-sync role="status">' +
      (global.__BASE_COMPLETA_PREVIEW_GUEST__ === true ? 'Prévia: escolha guardada somente neste navegador.' : '') +
      '</p><footer class="study-welcome-actions">' +
      (backStep ? '<button type="button" class="study-back-button" data-study-back>‹ Voltar</button>' : '<span></span>') +
      (!initial ? '<button type="button" class="study-keep-button" data-study-close>Manter minha escolha atual</button>' : '') +
      '</footer></section>';
    modal.hidden = false;
    modal.querySelector('[data-study-back]')?.addEventListener('click', () => renderChooser(backStep, backValue));
    modal.querySelector('[data-study-close]')?.addEventListener('click', () => close(true));
    modal.querySelectorAll('[data-study-area]').forEach((button) => button.addEventListener('click', () => renderChooser('roles', button.dataset.studyArea)));
    modal.querySelectorAll('[data-study-role]').forEach((button) => button.addEventListener('click', () => renderChooser('review', button.dataset.studyRole)));
    modal.querySelector('[data-study-free]')?.addEventListener('click', () => renderChooser('free'));
    modal.querySelector('[data-study-exams]')?.addEventListener('click', () => renderChooser('exams'));
    modal.querySelectorAll('[data-study-exam]').forEach((button) => button.addEventListener('click', () => selectObjective(button.dataset.studyExam)));
    modal.querySelector('[data-study-confirm]')?.addEventListener('click', (event) => selectObjective(event.currentTarget.dataset.studyConfirm));
    modal.querySelector('[data-study-save-free]')?.addEventListener('click', () => {
      const chosen = [...modal.querySelectorAll('input[name="studyFreeSubject"]:checked')].map((input) => input.value);
      if (!chosen.length) {
        const error = modal.querySelector('.study-form-error');
        error.textContent = 'Escolha pelo menos uma disciplina para continuar.';
        error.hidden = false;
        return;
      }
      localStorage.setItem(FREE_SUBJECTS_KEY, JSON.stringify(chosen));
      selectObjective('free-study');
    });
    if (!modal.__studyObjectiveTrap) {
      modal.addEventListener('keydown', trapFocus);
      modal.__studyObjectiveTrap = true;
    }
    modal.querySelector('button')?.focus({ preventScroll:true });
    document.documentElement.classList.add('study-objective-open');
  }
  function trapFocus(event) {
    if (event.key === 'Escape' && !activeId) { event.preventDefault(); return; }
    if (event.key === 'Escape') { close(true); return; }
    if (event.key !== 'Tab') return;
    const modal = document.getElementById('studyObjectiveDialog');
    const focusable = Array.from(modal?.querySelectorAll('button') || []).filter((item) => !item.disabled);
    if (!focusable.length) return;
    if (event.shiftKey && document.activeElement === focusable[0]) { event.preventDefault(); focusable.at(-1).focus(); }
    else if (!event.shiftKey && document.activeElement === focusable.at(-1)) { event.preventDefault(); focusable[0].focus(); }
  }
  function open() { returnFocus = document.activeElement; renderChooser('areas'); }
  function close(restoreFocus = false) {
    if (!activeId) return;
    document.getElementById('studyObjectiveDialog')?.remove();
    document.documentElement.classList.remove('study-objective-open');
    if (restoreFocus) returnFocus?.focus?.({ preventScroll:true });
  }
  async function load() {
    if (loaded || loading) return;
    loading = true;
    const local = localObjective();
    if (global.__BASE_COMPLETA_PREVIEW_GUEST__ === true) {
      activeId = local;
    } else {
      try {
        const response = await fetch('/api/objective', { cache:'no-store' });
        if (!response.ok) throw new Error('Preferência indisponível');
        const result = await response.json();
        const remote = catalog.goals[result.objectiveId] ? result.objectiveId : '';
        const validRemoteSubjects = Array.isArray(result.freeSubjectIds) &&
          result.freeSubjectIds.length > 0 &&
          result.freeSubjectIds.every((id) => !!catalog.subjects[id]) &&
          new Set(result.freeSubjectIds).size === result.freeSubjectIds.length;
        const pending = localStorage.getItem(PENDING_KEY) === '1';
        // Uma seleção pendente deste aparelho tem prioridade até sua sincronização.
        if (!pending && validRemoteSubjects) {
          localStorage.setItem(FREE_SUBJECTS_KEY, JSON.stringify(result.freeSubjectIds));
        }
        if (pending && local) {
          activeId = local;
          persistRemote(local);
        } else {
          activeId = remote || local;
          if (activeId) localStorage.setItem(KEY, activeId);
          if (!remote && local) persistRemote(local);
          else if (activeId === 'free-study' && !validRemoteSubjects && savedFreeSubjectIds()) {
            // Migração das escolhas salvas antes da sincronização entre dispositivos.
            persistRemote(activeId);
          }
        }
      } catch (_) { activeId = local; }
    }
    loaded = true;
    loading = false;
    applyObjective();
    if (!activeId) open();
    else dispatchChange();
  }

  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-study-open-subject]');
    if (button) (global.centralHardSubject || global.jumpSubject)?.(button.dataset.studyOpenSubject);
  });
  global.addEventListener('online', () => { if (localStorage.getItem(PENDING_KEY) === '1' && activeId) persistRemote(activeId); });
  document.addEventListener('base-completa-auth-ready', () => { if (!loaded) load(); });

  global.CentralStudyObjectives = {
    catalog, open, setActive, getActive:() => activeId,
    hasActiveObjective:() => !!activeId,
    activeSubjectIds, questionDisciplineKeys:activeQuestionKeys,
    load, get loaded() { return loaded; },
  };

  document.addEventListener('central:discipline-ready', applyObjective);
  document.addEventListener('central:study-objective-changed', applyObjective);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', observeDynamicSubjects, { once:true });
  else observeDynamicSubjects();

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', load, { once:true });
  else load();
})(window);
