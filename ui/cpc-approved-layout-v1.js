(function (global) {
  'use strict';

  if (global.CpcApprovedLayout) return;
  const ROOT = '#subjects .subject[data-id="cpc"]';
  const MODULE = ROOT + ' .cf-module[data-cf^="cpc"]';
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let observer, queued = false;

  function moduleWeek(module) {
    const id = module.dataset.cf;
    return (global.__CPC_WEEKS || []).find(week => week.id === id) || null;
  }

  function readingCard(module, week) {
    if (!week || module.querySelector(':scope > .cf-module-body > .cpc-approved-reading')) return;
    const body = module.querySelector(':scope > .cf-module-body');
    const state = typeof global.cpcWeekState === 'function' ? global.cpcWeekState(week.id) : {};
    const completed = !!state.reading;
    const num = String(week.num).padStart(2, '0');
    const law = 'cpc-m' + num.toLowerCase();
    const card = document.createElement('section');
    card.className = 'cpc-approved-reading';
    card.innerHTML = '<div class="cpc-approved-reading-icon" aria-hidden="true">📖</div>' +
      '<div class="cpc-approved-reading-copy"><h3>Leitura orientada inicial</h3>' +
      '<p>' + esc(week.read || '') + '</p>' +
      '<details><summary>Ver pontos para observar</summary><ul>' +
      (week.read_focus || []).map(point => '<li>' + esc(point) + '</li>').join('') +
      '</ul></details><div class="cpc-approved-reading-actions">' +
      '<button type="button" class="cpc-approved-secondary" data-cpc-reading-toggle>' + (completed ? '✓ Leitura concluída' : 'Marcar concluída') + '</button>' +
      '<button type="button" class="cpc-approved-secondary" data-cpc-law>📖 Lei em Dia deste módulo</button>' +
      '</div></div>';
    card.querySelector('[data-cpc-reading-toggle]').addEventListener('click', () => {
      if (typeof global.cpcUpdateWeek === 'function') global.cpcUpdateWeek(week.id, { reading: !completed });
    });
    card.querySelector('[data-cpc-law]').addEventListener('click', () => {
      if (typeof global.openLeiSecaEnxuta === 'function') global.openLeiSecaEnxuta(null, 'cpc', law);
    });
    body.insertBefore(card, body.querySelector(':scope > .bc-native-materials') || body.firstChild);
  }

  function cardInfo(original, type) {
    const sourceTitle = original.querySelector('strong')?.textContent.trim() || '';
    const description = original.querySelector('span:nth-of-type(2) small')?.textContent.trim() || '';
    const progress = original.querySelector('.bc-native-material-action')?.textContent.replace(/→/g, '').trim() || '';
    const action = original.getAttribute('onclick') || '';
    const typeInfo = {
      complete: { title:'Teoria completa', description:'Aprofunde o conteúdo integral do módulo.', icon:'📚', button:'Estudar conteúdo', tone:'complete' },
      summary: { title:'Versão de revisão', description:'Retome os pontos essenciais com rapidez.', icon:'⚡', button:'Revisar conteúdo', tone:'summary' },
      map: { title:'Mapa mental', description:'Revise visualmente os principais pontos do módulo.', icon:'🧠', button:'Visualizar mapa mental', tone:'map' }
    }[type];
    return { ...typeInfo, sourceTitle, sourceDescription:description, progress, action };
  }

  function questionFor(intro, type) {
    if (!intro) return null;
    const buttons = Array.from(intro.querySelectorAll('button'));
    const matcher = type === 'summary' ? /5\s*(?:do|questões|questoes)/i : /10\s*(?:do|questões|questoes)/i;
    return buttons.find(button => matcher.test(button.textContent)) || null;
  }

  function materialCard(info, question, type) {
    const article = document.createElement('article');
    article.className = 'cpc-approved-card cpc-approved-' + info.tone;
    article.dataset.cpcApprovedCard = type;
    const primary = document.createElement('button');
    primary.type = 'button';
    primary.className = 'cpc-approved-primary';
    primary.textContent = info.button;
    if (info.action) primary.setAttribute('onclick', info.action);
    article.innerHTML = '<div class="cpc-approved-icon" aria-hidden="true">' + info.icon + '</div>' +
      '<div class="cpc-approved-copy"><h3>' + info.title + '</h3><p>' + esc(info.sourceDescription || info.description) + '</p>' +
      (info.progress ? '<small class="cpc-approved-progress-label">' + esc(info.progress) + '</small>' : '') +
      '<div class="cpc-approved-tags"><span>' + esc(info.sourceTitle) + '</span><span>Processo Civil</span></div></div>' +
      '<div class="cpc-approved-actions"></div>';
    article.querySelector('.cpc-approved-actions').append(primary);
    if (question) {
      question.classList.remove('good');
      question.classList.add('cpc-approved-secondary');
      question.textContent = type === 'summary' ? 'Resolver 5 questões' : 'Resolver 10 questões';
      article.querySelector('.cpc-approved-actions').append(question);
    }
    return article;
  }

  function enhance(module) {
    const body = module.querySelector(':scope > .cf-module-body');
    const materials = body?.querySelector(':scope > .bc-native-materials');
    if (!body || !materials || materials.dataset.cpcApproved === '1') return;
    const week = moduleWeek(module);
    const grid = materials.querySelector('.bc-native-material-grid');
    const originals = Array.from(grid?.querySelectorAll('.bc-native-material-card') || []);
    if (!week || originals.length < 3) return;
    const complete = originals.find(button => /complete/i.test(button.getAttribute('onclick') || '') || /conteúdo completo/i.test(button.textContent));
    const summary = originals.find(button => button !== complete && (/summary/i.test(button.getAttribute('onclick') || '') || /resumido|resumo/i.test(button.textContent)));
    const map = originals.find(button => button !== complete && button !== summary);
    if (!complete || !summary || !map) return;
    const intro = body.querySelector(':scope > .cpc-study-intro');
    const completeQuiz = questionFor(intro, 'complete');
    const summaryQuiz = questionFor(intro, 'summary');
    readingCard(module, week);
    const cards = [
      materialCard(cardInfo(complete, 'complete'), completeQuiz, 'complete'),
      materialCard(cardInfo(summary, 'summary'), summaryQuiz, 'summary'),
      materialCard(cardInfo(map, 'map'), null, 'map')
    ];
    materials.classList.add('cpc-approved-materials');
    materials.querySelector('.bc-native-materials-head')?.remove();
    grid.replaceChildren(...cards);
    intro?.remove();
    body.querySelector(':scope > .cf-module-bar')?.remove();
    body.querySelector(':scope > .bc-native-metrics')?.classList.add('cpc-approved-metrics');
    materials.dataset.cpcApproved = '1';
  }

  function refresh() {
    queued = false;
    const root = document.querySelector(ROOT);
    if (!root) return;
    observer?.disconnect();
    root.querySelectorAll('.cf-module[data-cf^="cpc"]').forEach(module => {
      try { enhance(module); } catch (error) { console.warn('Apresentação CPC', error); }
    });
    observer?.observe(root, { childList:true, subtree:true });
  }
  function schedule() { if (!queued) { queued = true; requestAnimationFrame(refresh); } }
  function start() {
    observer = new MutationObserver(schedule);
    refresh();
    observer.observe(document.querySelector(ROOT) || document.body, { childList:true, subtree:true });
  }
  global.CpcApprovedLayout = { refresh, version:'2026-10-19.1' };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once:true });
  else start();
})(window);
