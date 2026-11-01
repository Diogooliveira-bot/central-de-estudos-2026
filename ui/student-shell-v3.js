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
    // O visitante da Preview recebe apenas um atalho para a Central oficial.
    // Gerenciamento verdadeiro exige sessão admin verificada pelo servidor.
    const mode = isAdmin() ? 'admin' : global.__BASE_COMPLETA_PREVIEW_GUEST__ === true ? 'admin-preview' : null;
    const existing = grid.querySelector('[data-student-more-action="admin"],[data-student-more-action="admin-preview"]');
    if (!mode) { existing?.remove(); return; }
    if (existing?.dataset.studentMoreAction === mode) return;
    existing?.remove();
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'student-more-admin';
    button.dataset.studentMoreAction = mode;
    const subtitle = mode === 'admin' ? 'Usuários, convites e acessos' : 'Gerenciar alunos na Central oficial · login obrigatório';
    const title = mode === 'admin' ? 'Administração' : 'Administração · acesso oficial';
    button.innerHTML = '<span aria-hidden="true">⚑</span><span><b>'+title+'</b><small>'+subtitle+'</small></span><span class="student-more-arrow" aria-hidden="true">→</span>';
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
    if (action === 'admin-preview' && global.__BASE_COMPLETA_PREVIEW_GUEST__ === true) {
      return global.location.assign('https://app.basecompleta.com.br/usuarios.html#convites');
    }
    return false;
  }
  // Barra compacta: seis ferramentas com rolagem, mais menu fixo à direita.
  // Os atalhos reutilizam as rotas já implementadas; não alteram permissões.
  function quickIcon(kind) {
    const paths = {
      law:'<path d="M4 4h12a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3z"/><path d="M7 4v16M10 9h6M10 13h6"/>',
      vade:'<path d="M5 4h13a2 2 0 0 1 2 2v14H7a3 3 0 0 1-3-3V6a2 2 0 0 1 1-2z"/><path d="M8 4v16M11 9h6M11 13h6"/>',
      edital:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>',
      filters:'<path d="M4 7h16M7 12h10M10 17h4"/><circle cx="8" cy="7" r="2" fill="#12344d"/><circle cx="14" cy="12" r="2" fill="#12344d"/>',
    };
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+paths[kind]+'</svg>';
  }
  function openEdital() {
    // Editais verticalizados existentes: TJPB e TRT-8; dependem do objetivo selecionado.
    if (global.CentralExamVerticalized?.open?.() === true) return true;
    if (global.CentralTRT8Verticalized?.open?.() === true) return true;
    // Objetivos gerais não possuem um edital oficial específico.
    if (global.CentralStudyObjectives?.open) return global.CentralStudyObjectives.open();
    global.alert('Não há edital verticalizado associado ao objetivo atual.');
    return false;
  }
  function ensureNavigation() {
    const nav = document.querySelector('#centralSidebar .nav');
    if (!nav) return;
    if (!nav.querySelector('.student-nav-scroll')) {
      const agenda = nav.querySelector('[data-central-agenda]');
      const progress = Array.from(nav.querySelectorAll('button')).find((item) => (item.getAttribute('onclick') || '').includes('performance'));
      const rail = document.createElement('div');
      rail.className = 'student-nav-scroll';
      rail.setAttribute('role', 'group');
      rail.setAttribute('aria-label', 'Ferramentas de estudo');
      nav.prepend(rail);
      if (agenda) {renameNavButton(agenda,'Agenda','agenda');rail.appendChild(agenda);}
      if (progress) {renameNavButton(progress,'Progresso','progress');rail.appendChild(progress);}
      const actions = [
        ['law','Lei em Dia',() => global.openEmbeddedTool?.('decorando', {})],
        ['vade','Vade Mecum',() => global.openEmbeddedTool?.('vade', {})],
        ['edital','Edital',openEdital],
        ['filters','Filtro de questões',(button) => global.ExternalQuestionFilters?.openPage(button,{tab:'filters'})],
      ];
      actions.forEach(([key,label,action]) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'student-quick-nav';
        button.dataset.studentPrimaryNav = key;
        button.setAttribute('aria-label',label);
        button.setAttribute('title',label);
        const shortLabel = key === 'filters' ? 'Filtros' : label;
        button.innerHTML = '<span class="nav-icon" aria-hidden="true">'+quickIcon(key)+'</span><span class="nav-text">'+shortLabel+'</span>';
        button.addEventListener('click',() => action(button));
        rail.appendChild(button);
      });
    }
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
        <div class="student-more-head"><div><small>BASE COMPLETA</small><b>Mais opções</b></div><button type="button" data-student-close-more aria-label="Fechar">×</button></div>
        <div class="student-more-grid">
          <button type="button" data-student-more-action="settings"><span aria-hidden="true">⚙</span><span><b>Configurações</b><small>Aparência e dados</small></span></button>
          <button type="button" data-student-more-action="onboarding"><span aria-hidden="true">◎</span><span><b>Meu perfil e plano</b><small>Objetivos e rotina</small></span></button>
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
      ['agendaView', 'agenda'], ['performanceView', 'progress'], ['leiSecaView', 'law'], ['vadeMecumView', 'vade'], ['questionFiltersView', 'filters'],
    ];
    for (const [viewId, key] of map) {
      if (!byId(viewId)?.classList.contains('hidden')) document.querySelector(`[data-student-primary-nav="${key}"]`)?.setAttribute('aria-current', 'page');
    }
  }
  function syncVisibleLabels() {
    const crumb = byId('crumb');
    if (!crumb) return;
    if (!byId('performanceView')?.classList.contains('hidden')) setText(crumb, 'Progresso');
    else if (!byId('agendaView')?.classList.contains('hidden')) setText(crumb, 'Agenda');
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
