/* Novas disciplinas GMF: roteiros introdutórios, sem liberar teoria ou questões não revisadas. */
(function (global) {
  'use strict';
  const catalog = global.GmfCourseCatalog;
  const subjects = typeof SUBJECTS !== 'undefined' ? SUBJECTS : null;
  if (global.GmfDisciplines?.installed) return;
  if (!catalog || !subjects || !Array.isArray(catalog.subjects)) return;

  const ids = new Set(catalog.subjects.map(subject => subject.id));
  const safe = text => String(text == null ? '' : text).replace(/[&<>"']/g, char => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
  })[char]);
  const escapeAttr = safe;
  const progressUnit = 'módulos';

  for (const course of catalog.subjects) {
    if (subjects.some(subject => subject.id === course.id)) continue;
    subjects.push({
      id: course.id,
      name: course.name,
      special: course.modules.length + ' módulos · estrutura inicial do edital GMF/2023',
      topics: course.modules.map((module, index) => ({
        uid: 'gmf-' + course.id + '-' + module.id,
        title: module.title,
        origin: 'Módulo ' + String(index + 1).padStart(2, '0') + ' · GMF 2023',
        type: 'Em preparação',
        tips: module.focus
      }))
    });
  }

  // Não atribuir progresso por módulos que ainda não têm teoria publicada.
  if (typeof global.subjStats === 'function') {
    const originalStats = global.subjStats;
    global.subjStats = function (subject) {
      if (!ids.has(subject?.id)) return originalStats.apply(this, arguments);
      const course = catalog.subjects.find(item => item.id === subject.id);
      return {total: course.modules.length, done: 0, pct: 0, unit: progressUnit};
    };
  }

  // Mesma estrutura de módulo das outras disciplinas (cf-module > cabeçalho + corpo): a Central mostra a grade
  // "Escolha um módulo" e a página do módulo com "Como estudar", "Versão de revisão" e "Teoria completa".
  function renderMaster(course) {
    const courseId = escapeAttr(course.id);
    const referenceLink = '<p class="gmf-edital-note">' + safe(course.reference) + '. Estrutura baseada no último edital oficial; ' +
      'o próximo edital ainda não foi publicado e os assuntos e a legislação deverão ser conferidos quando sair. ' +
      '<a href="' + escapeAttr(catalog.referenceUrl) + '" target="_blank" rel="noopener noreferrer">Consultar edital oficial de 2023 ↗</a></p>';
    return course.modules.map((module, index) => {
      const number = String(index + 1).padStart(2, '0');
      const moduleId = escapeAttr(module.id);
      const bodyId = 'gmf-body-' + courseId + '-' + moduleId;
      const published = module.id === 'm01' || (catalog.availableModules?.[course.id] || []).includes(module.id);
      const attention = module.attention
        ? '<p><strong>Atenção:</strong> ' + safe(module.attention) + '</p>' : '';
      const orient = '<section class="cf-native-oriented"><section class="bc-orient" aria-label="Como estudar este módulo">' +
        '<div class="bc-orient-head"><b>Como estudar este módulo</b></div><div class="bc-orient-body">' +
        '<p><strong>Foco:</strong> ' + safe(module.focus.map(item => String(item).replace(/[.\s]+$/, '')).join('; ')) + '.</p>' + attention +
        '<p><strong>Como estudar:</strong> comece pela versão de revisão e aprofunde na teoria completa.</p></div></section></section>';
      const action = (kind) => ' data-gmf-action="' + kind + '" data-gmf-course="' + courseId + '" data-gmf-module="' + moduleId + '"';
      const cards = published
        ? '<section class="cf-native-cards">' +
          '<article class="cf-study-card cf-study-review"><span class="cf-study-icon" aria-hidden="true">⚡</span><b>Versão de revisão</b>' +
          '<small>Aprenda com explicações, exemplos e aprofundamento. Alterne para revisão rápida quando precisar.</small>' +
          '<span class="cf-study-tags" aria-hidden="true"><span>▤ Guia didático</span><span>Leitura + revisão</span></span>' +
          '<div class="cf-study-actions"><button type="button" class="cf-study-open"' + action('review') + '>Revisar conteúdo</button></div></article>' +
          '<article class="cf-study-card cf-study-primary"><span class="cf-study-icon" aria-hidden="true">📚</span><b>Teoria completa</b>' +
          '<small>Apostila integral no site, para estudar o conteúdo em profundidade.</small>' +
          '<span class="cf-study-tags" aria-hidden="true"><span>▤ Apostila</span><span>Conteúdo completo</span></span>' +
          '<div class="cf-study-actions"><button type="button" class="cf-study-open"' + action('complete') + '>Estudar conteúdo</button></div></article>' +
          '<article class="bcmc-card bcmc-questions gmf-questions-soon"><div class="bcmc-icon" aria-hidden="true">✍️</div>' +
          '<div class="bcmc-copy"><h3>Questões do módulo</h3><p>Os exercícios preliminares ainda não estão disponíveis nesta etapa. A leitura isolada não equivale à conclusão do módulo.</p>' +
          '<div class="bcmc-tags"><span>Em preparação</span></div></div>' +
          '<div class="bcmc-actions"><button type="button" class="bcmc-primary" disabled>Em preparação</button></div></article></section>'
        : '<section class="cf-native-cards"><article class="cf-study-card"><span class="cf-study-icon" aria-hidden="true">🕒</span><b>Conteúdo em preparação</b>' +
          '<small>Roteiro de assuntos do edital. A teoria e a revisão deste módulo serão publicadas em breve.</small></article></section>';
      return '<div class="cf-module bc-accordion ds-module gmf-std-module" data-std-module="1" data-module="gmf-' + courseId + '-' + moduleId +
        '" data-gmf-course="' + courseId + '" data-gmf-module="' + moduleId + '">' +
        '<button type="button" class="cf-module-head bc-accordion-header ds-module-head" aria-expanded="false" aria-controls="' + bodyId + '">' +
        '<span class="cf-module-no">MÓDULO ' + number + '</span><span class="cf-module-title">' + safe(module.title) +
        '</span><span class="chev" aria-hidden="true">⌄</span></button>' +
        '<div class="cf-module-body ds-module-body" id="' + bodyId + '">' + orient + cards + referenceLink + '</div></div>';
    }).join('');
  }

  // Abrir/fechar o módulo (as outras disciplinas fazem o mesmo com os seus próprios controles).
  document.addEventListener('click', event => {
    const head = event.target instanceof Element ? event.target.closest('.gmf-std-module > .cf-module-head') : null;
    if (!head) return;
    const box = head.parentElement;
    const open = !box.classList.contains('open');
    box.classList.toggle('open', open);
    head.setAttribute('aria-expanded', String(open));
  });

  // O leitor carrega sob demanda para não interferir nas telas das demais disciplinas.
  let readerLoading=null;
  function loadGmfReader(){
    if(global.GmfCourseReaderV2)return Promise.resolve(global.GmfCourseReaderV2);
    if(readerLoading)return readerLoading;
    readerLoading=new Promise((resolve,reject)=>{
      const script=document.createElement('script');
      script.src='/ui/gmf-course-reader-v2.js?v=20261124gmfProgress1';
      script.onload=()=>global.GmfCourseReaderV2?resolve(global.GmfCourseReaderV2):reject(new Error('Leitor GMF indisponível.'));
      script.onerror=()=>reject(new Error('Não foi possível carregar o leitor GMF.'));
      document.head.appendChild(script);
    }).catch(error=>{readerLoading=null;throw error});
    return readerLoading;
  }

  // Event delegation: evita manipulação de JavaScript em atributos onclick.
  document.addEventListener('click',event=>{
    const button=event.target.closest?.('button[data-gmf-action][data-gmf-course][data-gmf-module]');
    if(!button)return;
    event.preventDefault();
    const id=button.dataset.gmfCourse;
    const action=button.dataset.gmfAction;
    const module=button.dataset.gmfModule;
    if(!ids.has(id)||!catalog.subjects.find(subject=>subject.id===id)?.modules.some(item=>item.id===module))return;
    if(action!=='review'&&action!=='complete')return;
    const label=button.textContent;
    button.disabled=true;
    loadGmfReader().then(reader=>reader.open(id,module,action)).catch(error=>{
      console.error('[GMF] Falha ao abrir módulo',error);
      button.textContent='Não foi possível carregar · tentar novamente';
    }).finally(()=>{button.disabled=false;if(button.isConnected&&button.textContent==='Não foi possível carregar · tentar novamente')return;if(button.isConnected)button.textContent=label});
  });

  // A renderização da área Início é executada no runtime nativo por meio de GmfDisciplines.renderMaster.
  // Identifica os roteiros na grade sem apresentá-los como cursos publicados.
  if (typeof global.renderDisciplineGrid === 'function') {
    const originalGrid = global.renderDisciplineGrid;
    global.renderDisciplineGrid = function () {
      const result = originalGrid.apply(this, arguments);
      for (const course of catalog.subjects) {
        const card = document.querySelector('.disc-card[data-id="' + course.id + '"]');
        const subtitle = card?.querySelector('small');
        const meta = card?.querySelector('.disc-meta');
        if (subtitle) subtitle.textContent = course.modules.length + ' módulos · roteiro do edital GMF/2023';
        if (meta) meta.textContent = (catalog.availableModules?.[course.id]||['m01']).length + ' módulos com teoria e revisão · questões em preparação';
      }
      return result;
    };
  }

  // A agenda é inicializada antes do carregamento deste pacote.
  const agendaSelect = document.getElementById('agendaDisc');
  if (agendaSelect) {
    for (const course of catalog.subjects) {
      if (!Array.from(agendaSelect.options).some(option => option.value === course.id)) {
        agendaSelect.add(new Option(course.name, course.id));
      }
    }
  }

  // Metadados públicos para sumários e navegação; não altera módulos existentes.
  if (global.CentralModuleCatalog) {
    for (const course of catalog.subjects) {
      if (!global.CentralModuleCatalog[course.id]) {
        global.CentralModuleCatalog[course.id] =
          course.modules.map((module, index) => ({number:index + 1, title:module.title}));
      }
    }
  }

  // Cor de destaque de cada disciplina: campo "accent" do catálogo (#rrggbb) ou uma cor da paleta, em ordem.
  const ACCENTS = ['#356a9e', '#438a80', '#506a92', '#6476a3', '#7a6aa8', '#a0714f', '#4f7f9c', '#5d8f5a'];
  function accentRule(course, index) {
    const color = /^#[0-9a-f]{6}$/i.test(String(course.accent || '')) ? course.accent : ACCENTS[index % ACCENTS.length];
    const r = parseInt(color.slice(1, 3), 16), g = parseInt(color.slice(3, 5), 16), b = parseInt(color.slice(5, 7), 16);
    const id = String(course.id).replace(/[^a-z]/g, '');
    return '.disc-card[data-id="' + id + '"],.subject[data-id="' + id + '"]{--discipline-accent:' + color + ';--discipline-accent-soft:rgba(' + r + ',' + g + ',' + b + ',.10)}';
  }

  const style = document.createElement('style');
  style.id = 'gmf-disciplines-v1-style';
  style.textContent = [
    ...catalog.subjects.map((course, index) => accentRule(course, index)),
    'html.bc-ui-v1 #subjects .gmf-std-module .gmf-edital-note{margin:14px 2px 2px;font-size:.8125rem;line-height:1.6;color:var(--muted,#6c7584)}',
    'html.bc-ui-v1 #subjects .gmf-std-module .gmf-edital-note a{font-weight:650;color:var(--discipline-accent,#356a9e)}',
    '.gmf-questions-soon .bcmc-primary[disabled]{opacity:.6;cursor:not-allowed}'
  ].join('');
  document.head.appendChild(style);

  global.GmfDisciplines = Object.freeze({installed:true,subjectIds:Array.from(ids),moduleCount:catalog.subjects.reduce((sum,course)=>sum+course.modules.length,0),renderMaster:(id)=>{const course=catalog.subjects.find(s=>s.id===id);return course?renderMaster(course):''}});
  global.GmfStudyObjective?.sync?.();
  try { global.renderAll?.(); global.renderDisciplineGrid?.(); } catch (error) {
    console.error('[GMF] Não foi possível atualizar a lista de disciplinas',error);
  }
})(window);
