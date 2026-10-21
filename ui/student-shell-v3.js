(function (global) {
  'use strict';
  const UX = global.CentralStudentUX;
  if (!UX || global.__centralStudentShellV3) return;
  global.__centralStudentShellV3 = true;
  const { byId, setText } = UX;
  let syncState = global.__BASE_COMPLETA_PREVIEW_GUEST__ === true
    ? { message:'Modo de testes · dados locais, sem sincronização.', type:'ok' }
    : { message:'Dados salvos automaticamente.', type:'ok' };

  function renameNavButton(button, text, key) {
    if (!button) return;
    button.dataset.studentPrimaryNav = key;
    const label = button.querySelector('.nav-text');
    if (label && label.textContent !== text) label.textContent = text;
    button.setAttribute('aria-label', text);
    button.setAttribute('title', text);
  }
  function isAdmin() {
    const role = global.BASE_COMPLETA_USER?.role || global.__BASE_COMPLETA_USER_ROLE__;
    return role === 'admin' && global.__BASE_COMPLETA_PREVIEW_GUEST__ !== true;
  }
  function ensureAdminEntry() {
    const grid = byId('studentMorePanel')?.querySelector('.student-more-grid');
    if (!grid) return;
    const existing = grid.querySelector('[data-student-more-action="admin"]');
    if (!isAdmin()) { existing?.remove(); return; }
    if (existing) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'student-more-admin';
    button.dataset.studentMoreAction = 'admin';
    button.innerHTML = '<span aria-hidden="true">⚑</span><span><b>Administração</b><small>Usuários, convites e acessos</small></span><span class="student-more-arrow" aria-hidden="true">→</span>';
    grid.insertBefore(button, grid.querySelector('[data-student-more-action="logout"]'));
  }
  function closeMore(restoreFocus = false) {
    const panel = byId('studentMorePanel');
    const trigger = byId('studentMoreButton');
    if (!panel || panel.hidden) return;
    panel.hidden = true;
    document.documentElement.classList.remove('student-more-open');
    trigger?.setAttribute('aria-expanded', 'false');
    if (restoreFocus) trigger?.focus({ preventScroll:true });
  }
  function runMoreAction(action) {
    closeMore(false);
    if (action === 'law') return global.openEmbeddedTool?.('decorando', {});
    if (action === 'vade') return global.openEmbeddedTool?.('vade', {});
    if (action === 'settings') return global.openCentralSettings?.();
    if (action === 'onboarding') return (global.CentralStudyObjectives?.open || global.CentralStudentOnboarding?.open)?.();
    if (action === 'logout') return document.querySelector('[data-bc-logout]')?.click();
    if (action === 'admin' && isAdmin()) return global.location.assign('/usuarios.html');
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
        if (open) panel.querySelector('button')?.focus({ preventScroll:true });
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
        <div class="student-more-head"><div><small>BASE COMPLETA</small><b>Ferramentas</b></div><button type="button" data-student-close-more aria-label="Fechar">×</button></div>
        <div class="student-more-grid">
          <button type="button" data-student-more-action="law"><span aria-hidden="true">✓</span><span><b>Lei em Dia</b><small>Revisão de lei seca</small></span></button>
          <button type="button" data-student-more-action="vade"><span aria-hidden="true">§</span><span><b>Vade Mecum</b><small>Consulta rápida</small></span></button>
          <button type="button" data-student-more-action="onboarding"><span aria-hidden="true">◎</span><span><b>Meu plano</b><small>Objetivo e rotina</small></span></button>
          <button type="button" data-student-more-action="settings"><span aria-hidden="true">⚙</span><span><b>Configurações</b><small>Aparência e dados</small></span></button>
          <button type="button" data-student-more-action="logout"><span aria-hidden="true">⇥</span><span><b>Sair da conta</b><small>Encerrar esta sessão</small></span></button>
        </div>
        <div id="studentConnectionStatus" class="student-connection-status" role="status"></div>`;
      panel.addEventListener('click', (event) => {
        const action = event.target.closest('[data-student-more-action]')?.dataset.studentMoreAction;
        if (action) runMoreAction(action);
        if (event.target.closest('[data-student-close-more]')) closeMore(true);
      });
      document.body.appendChild(panel);
    }
    ensureAdminEntry();
  }
  function ensureSkipLink() {
    if (!byId('studentSkipLink')) {
      const link = document.createElement('a');
      link.id = 'studentSkipLink';
      link.className = 'student-skip-link';
      link.href = '#appRoot';
      link.textContent = 'Pular para o conteúdo';
      document.body.prepend(link);
    }
    const app = byId('appRoot');
    if (app) { app.setAttribute('role', 'main'); app.setAttribute('tabindex', '-1'); }
  }
  function ensureConnectionState() {
    const status = byId('studentConnectionStatus');
    if (!status) return;
    let state = syncState;
    if (!navigator.onLine) state = { message:'Sem internet · seu progresso fica salvo neste aparelho.', type:'warn' };
    if (UX.failures.size) state = { message:'Uma parte da tela não carregou. Atualize para tentar novamente.', type:'error' };
    status.className = `student-connection-status ${state.type}`;
    setText(status, state.message);
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
  function ensureAccessibility() {
    document.querySelectorAll('#subjects > .subject').forEach((section) => {
      const button = section.querySelector(':scope > .subject-head');
      const body = section.querySelector(':scope > .subject-body');
      if (!button || !body) return;
      const id = `student-subject-body-${section.dataset.id}`;
      body.id = id;
      button.type = 'button';
      button.setAttribute('aria-controls', id);
      button.setAttribute('aria-expanded', String(section.classList.contains('open')));
      button.setAttribute('aria-label', `${button.querySelector('.subject-name')?.textContent || 'Disciplina'}: ${section.classList.contains('open') ? 'fechar' : 'abrir'} conteúdo`);
    });
    document.querySelectorAll('#agendaEditor input[type="checkbox"]').forEach((input) => {
      const task = input.closest('.agenda-edit-row')?.querySelector('span:nth-child(2)')?.textContent?.trim();
      input.setAttribute('aria-label', `Marcar ${task || 'tarefa'} como concluída`);
    });
    const visible = Array.from(document.querySelectorAll('#centralSidebar [data-student-primary-nav]'));
    visible.forEach((button) => button.removeAttribute('aria-current'));
    const map = [
      ['homeView', 'today'], ['agendaView', 'plan'], ['disciplinesView', 'subjects'], ['performanceView', 'progress'],
    ];
    for (const [viewId, key] of map) {
      if (!byId(viewId)?.classList.contains('hidden')) document.querySelector(`[data-student-primary-nav="${key}"]`)?.setAttribute('aria-current', 'page');
    }
  }
  function syncVisibleLabels() {
    const crumb = byId('crumb');
    if (!crumb) return;
    if (!byId('performanceView')?.classList.contains('hidden')) setText(crumb, 'Progresso');
    else if (!byId('agendaView')?.classList.contains('hidden')) setText(crumb, 'Plano');
    else if (!byId('homeView')?.classList.contains('hidden')) setText(crumb, 'Hoje');
  }
  function enhance() {
    ensureNavigation(); ensureSkipLink(); ensureConnectionState(); ensureReaders(); ensureAccessibility(); syncVisibleLabels();
  }

  global.addEventListener('base-completa-auth-ready', () => UX.schedule());
  global.addEventListener('central:sync-status', (event) => {
    const type = String(event.detail?.type || 'ok');
    syncState = { message:String(event.detail?.message || 'Dados salvos automaticamente.'), type:type === 'err' ? 'error' : type };
    UX.schedule();
  });
  document.addEventListener('click', (event) => {
    if (!event.target.closest('#studentMorePanel,#studentMoreButton')) closeMore(false);
    if (event.target.closest('#centralSidebar .nav button:not(#studentMoreButton)')) closeMore(false);
    setTimeout(UX.schedule, 0);
  }, true);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !byId('studentMorePanel')?.hidden) { event.preventDefault(); closeMore(true); }
  });
  UX.register('shell', enhance);
})(window);
