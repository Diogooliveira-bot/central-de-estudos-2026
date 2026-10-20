/* Seleção e persistência do objetivo sem alterar IDs, módulos ou estado de estudo. */
(function (global) {
  'use strict';
  if (global.CentralStudyObjectives) return;

  const catalog = global.CentralStudyObjectiveCatalog;
  const UX = global.CentralStudentUX;
  if (!catalog || !UX) return;

  const KEY = 'central-v6:study-objective:v1';
  const PENDING_KEY = 'central-v6:study-objective:pending:v1';
  let activeId = '';
  let loaded = false;
  let loading = false;
  let returnFocus = null;

  const goal = () => catalog.goals[activeId] || null;
  const allSubjectIds = () => Object.keys(catalog.subjects);
  function activeSubjectIds() {
    const current = goal();
    return !current || current.type === 'free' ? allSubjectIds() : current.subjectIds.slice();
  }
  function activeQuestionKeys() {
    const allowed = new Set(activeSubjectIds());
    if (activeId === 'free-study' || !activeId) return null;
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
        body:JSON.stringify({ objectiveId:id }),
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
    const node = document.querySelector('[data-study-objective-sync]');
    if (node) node.textContent = message;
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
    const expectedCount = current.examSubjects?.length || current.subjectIds.length;
    if (host.children.length === expectedCount && Array.from(host.children).every((item) => item.dataset.studyObjectiveGoal === activeId)) return;
    let html = '';
    if (current.examSubjects) {
      html = current.examSubjects.map((entry) => objectiveCard(catalog.subjects[entry.subjectId], entry)).join('');
    } else {
      html = current.subjectIds.map((id) => objectiveCard(catalog.subjects[id], { subjectId:id, title:catalog.subjects[id].name })).join('');
    }
    host.innerHTML = html;
  }
  function renderTopbar() {
    const host = document.querySelector('#appRoot .view.central-view-visible:not(.hidden)') || document.querySelector('#appRoot .view:not(.hidden)') || document.getElementById('homeView') || document.getElementById('appRoot') || document.body;
    if (!host) return;
    let control = document.getElementById('studyObjectiveTopbar');
    if (!control) {
      control = document.createElement('div'); control.id = 'studyObjectiveTopbar'; control.className = 'study-objective-topbar';
      control.innerHTML = '<span class="study-objective-topbar-label">Objetivo</span><span data-study-objective-label></span><button type="button">Alterar</button>';
      control.querySelector('button').addEventListener('click', () => open());
    }
    if (control.parentElement !== host || host.firstElementChild !== control) host.insertBefore(control, host.firstElementChild);
    const label = control.querySelector('[data-study-objective-label]');
    const shortLabel = goal()?.shortLabel || 'Escolher';
    const accessibleLabel = 'Objetivo ativo: ' + (goal()?.title || 'nenhum');
    if (label.textContent !== shortLabel) label.textContent = shortLabel;
    if (control.getAttribute('aria-label') !== accessibleLabel) control.setAttribute('aria-label', accessibleLabel);
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
  function renderChooser(step = 'types', type = '') {
    let modal = document.getElementById('studyObjectiveDialog');
    if (!modal) { modal = document.createElement('div'); modal.id = 'studyObjectiveDialog'; modal.className = 'study-objective-backdrop'; document.body.appendChild(modal); }
    const isInitial = !activeId;
    const selected = goal();
    const choices = Object.values(catalog.goals).filter((item) => item.type === type);
    const title = step === 'types' ? 'Como você quer estudar?' : type === 'career' ? 'Escolha sua carreira' : 'Escolha seu edital';
    const intro = step === 'types'
      ? 'Escolha um caminho para organizar as disciplinas. Seu progresso e suas anotações continuarão guardados.'
      : type === 'career'
        ? 'Esta é uma trilha inicial configurável; o programa muda conforme o tribunal e o edital.'
        : 'As disciplinas que ainda não têm conteúdo próprio aparecem como “Em preparação”.';
    const options = step === 'types'
      ? `<div class="study-objective-options">
          <button type="button" data-study-type="career"><strong>Por carreira</strong><span>Trilha configurável para uma área de atuação.</span></button>
          <button type="button" data-study-type="exam"><strong>Por edital</strong><span>Disciplinas relacionadas a um concurso específico.</span></button>
          <button type="button" data-study-select="free-study"><strong>Estudo livre</strong><span>Acesse todas as disciplinas disponíveis.</span></button>
        </div>`
      : `<div class="study-objective-options">${choices.map((item) => `<button type="button" data-study-select="${UX.escapeHTML(item.id)}"${item.id === activeId ? ' aria-current="true"' : ''}><strong>${UX.escapeHTML(item.title)}</strong><span>${UX.escapeHTML(item.description)}</span></button>`).join('')}</div>`;
    modal.innerHTML = `<section class="study-objective-dialog" role="dialog" aria-modal="true" aria-labelledby="studyObjectiveTitle">
      <div class="study-objective-brand"><span aria-hidden="true">◎</span><div><small>BASE COMPLETA</small><b>Seu objetivo de estudo</b></div></div>
      <div class="study-objective-intro"><span>${selected ? 'Objetivo atual: ' + UX.escapeHTML(selected.shortLabel) : 'Primeiro acesso'}</span><h1 id="studyObjectiveTitle">${title}</h1><p>${intro}</p></div>
      ${options}
      <p class="study-objective-sync" data-study-objective-sync role="status">${global.__BASE_COMPLETA_PREVIEW_GUEST__ === true ? 'Prévia de teste: preferência guardada apenas neste navegador.' : ''}</p>
      <div class="study-objective-actions">${step === 'options' ? '<button type="button" data-study-back>Voltar</button>' : '<span></span>'}${!isInitial ? '<button type="button" data-study-close>Manter objetivo atual</button>' : ''}</div>
    </section>`;
    modal.hidden = false;
    modal.querySelector('[data-study-back]')?.addEventListener('click', () => renderChooser('types'));
    modal.querySelector('[data-study-close]')?.addEventListener('click', () => close(true));
    modal.querySelectorAll('[data-study-type]').forEach((button) => button.addEventListener('click', () => renderChooser('options', button.dataset.studyType)));
    modal.querySelectorAll('[data-study-select]').forEach((button) => button.addEventListener('click', () => selectObjective(button.dataset.studySelect)));
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
  function open() { returnFocus = document.activeElement; renderChooser('types'); }
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
        if (localStorage.getItem(PENDING_KEY) === '1' && local) {
          activeId = local;
          persistRemote(local);
        } else {
          activeId = remote || local;
          if (activeId) localStorage.setItem(KEY, activeId);
          if (!remote && local) persistRemote(local);
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
    if (button) global.centralHardSubject?.(button.dataset.studyOpenSubject);
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
