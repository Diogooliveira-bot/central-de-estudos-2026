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

  function renderMaster(course) {
    const cards = course.modules.map((module, index) => {
      const number = String(index + 1).padStart(2, '0');
      const points = module.focus.map(item => '<li>' + safe(item) + '</li>').join('');
      const attention = module.attention
        ? '<p class="gmf-attention"><b>Ponto de atenção:</b> ' + safe(module.attention) + '</p>' : '';
      const published = module.id === 'm01' || (catalog.availableModules?.[course.id] || []).includes(module.id);
      const label = published ? 'Conteúdo completo e revisão disponíveis' : 'Roteiro de assuntos · conteúdo em preparação';
      const courseId = escapeAttr(course.id);
      const moduleId = escapeAttr(module.id);
      const buttons = published
        ? '<div class="gmf-module-actions"><button type="button" data-gmf-action="review" data-gmf-course="' + courseId + '" data-gmf-module="' + moduleId + '">Abrir revisão guiada</button>' +
          '<button type="button" data-gmf-action="complete" data-gmf-course="' + courseId + '" data-gmf-module="' + moduleId + '">Estudar teoria completa</button></div>'
        : '';

      return '<details class="gmf-module"><summary><span class="gmf-module-number">M' + number +
        '</span><span class="gmf-module-heading"><b>' + safe(module.title) +
        '</b><small>' + label + '</small></span><span class="gmf-chevron" aria-hidden="true">⌄</span></summary>' +
        '<div class="gmf-module-body"><h4>O que estudar neste módulo</h4><ul>' + points + '</ul>' +
        attention + buttons + '<p class="gmf-unreleased">'+(published?'Questões do módulo — Em preparação. Os exercícios preliminares não estão disponíveis nesta etapa. A leitura isolada não equivale à conclusão do módulo.':'Questões do módulo — Em preparação. Teoria completa e revisão guiada ainda não disponibilizadas. Este roteiro não conta como módulo concluído.')+'</p></div></details>';
    }).join('');

    return '<div class="gmf-course"><div class="gmf-course-intro"><b>' + safe(course.name) +
      '</b><p>' + safe(course.reference) + '</p><p>Estrutura inicial de ' + course.modules.length +
      ' módulos, baseada no último edital oficial. O próximo edital ainda não foi publicado; os assuntos e a legislação deverão ser conferidos quando sair.</p>' +
      '<a href="' + escapeAttr(catalog.referenceUrl) +
      '" target="_blank" rel="noopener noreferrer">Consultar edital oficial de 2023</a></div>' +
      '<div class="gmf-modules">' + cards + '</div></div>';
  }

  // O leitor carrega sob demanda para não interferir nas telas das demais disciplinas.
  let readerLoading=null;
  function loadGmfReader(){
    if(global.GmfCourseReaderV2)return Promise.resolve(global.GmfCourseReaderV2);
    if(readerLoading)return readerLoading;
    readerLoading=new Promise((resolve,reject)=>{
      const script=document.createElement('script');
      script.src='/ui/gmf-course-reader-v2.js?v=20261122gmfModuleReader1';
      script.onload=()=>global.GmfCourseReaderV2?resolve(global.GmfCourseReaderV2):reject(new Error('Leitor GMF indisponível.'));
      script.onerror=()=>reject(new Error('Não foi possível carregar o leitor GMF.'));
      document.head.appendChild(script);
    }).catch(error=>{readerLoading=null;throw error});
    return readerLoading;
  }

  // Event delegation: evita manipulação de JavaScript em atributos onclick.
  document.addEventListener('click',event=>{
    const button=event.target.closest?.('.gmf-module-actions button[data-gmf-action][data-gmf-course][data-gmf-module]');
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

  const style = document.createElement('style');
  style.id = 'gmf-disciplines-v1-style';
  style.textContent = [
    '.disc-card[data-id="atual"],.subject[data-id="atual"]{--discipline-accent:#356a9e;--discipline-accent-soft:rgba(53,106,158,.10)}',
    '.disc-card[data-id="fortaleza"],.subject[data-id="fortaleza"]{--discipline-accent:#438a80;--discipline-accent-soft:rgba(67,138,128,.10)}',
    '.disc-card[data-id="legesp"],.subject[data-id="legesp"]{--discipline-accent:#506a92;--discipline-accent-soft:rgba(80,106,146,.10)}',
    '.disc-card[data-id="dh"],.subject[data-id="dh"]{--discipline-accent:#6476a3;--discipline-accent-soft:rgba(100,118,163,.10)}',
    '.gmf-course{font:inherit;color:var(--text,#283647);max-width:100%;overflow-wrap:anywhere}',
    '.gmf-course-intro{padding:18px;border:1px solid var(--line,#dce3ea);border-radius:12px;background:var(--panel,#fff);margin-bottom:12px}',
    '.gmf-course-intro>b{font-size:17px}.gmf-course-intro p{font-size:13px;line-height:1.65;margin:9px 0}',
    '.gmf-course-intro a{font-size:13px;font-weight:650;color:var(--discipline-accent,#356a9e)}',
    '.gmf-modules{display:grid;gap:10px}.gmf-module{border:1px solid var(--line,#dce3ea);border-radius:12px;background:var(--panel,#fff);overflow:hidden}',
    '.gmf-module summary{cursor:pointer;display:flex;align-items:center;gap:12px;padding:15px;list-style:none}',
    '.gmf-module summary::-webkit-details-marker{display:none}.gmf-module summary:focus-visible{outline:2px solid var(--discipline-accent,#356a9e);outline-offset:-2px}',
    '.gmf-module-number{display:grid;place-items:center;flex:0 0 42px;min-height:36px;border-radius:7px;background:var(--discipline-accent-soft,#edf3f7);color:var(--discipline-accent,#356a9e);font-size:12px;font-weight:750}',
    '.gmf-module-heading{display:grid;gap:4px;min-width:0;flex:1}.gmf-module-heading b{font-size:14px;line-height:1.4}.gmf-module-heading small{font-size:12px;color:var(--muted,#6c7584)}',
    '.gmf-chevron{font-size:18px;color:var(--muted,#6c7584)}.gmf-module[open] .gmf-chevron{transform:rotate(180deg)}',
    '.gmf-module-body{border-top:1px solid var(--line,#dce3ea);padding:14px 18px 17px;font-size:13px;line-height:1.65}',
    '.gmf-module-body h4{font-size:13px;margin:0 0 7px}.gmf-module-body ul{padding-left:20px;margin:0 0 12px}',
    '.gmf-module-body li{margin:5px 0}.gmf-attention{margin:10px 0;padding:10px;border-left:3px solid var(--discipline-accent,#356a9e);background:var(--soft,#f8fafc)}',
    '.gmf-unreleased{font-size:12px;color:var(--muted,#6c7584);border-top:1px solid var(--line,#dce3ea);padding-top:12px;margin:15px 0 0}',
    '.gmf-module-actions{display:flex;flex-wrap:wrap;gap:9px;margin:14px 0}.gmf-module-actions button{font:600 13px system-ui;border:1px solid var(--line,#dce3ea);background:var(--soft,#f8fafc);color:var(--text,#263445);border-radius:8px;padding:11px 13px;cursor:pointer}.gmf-module-actions button:first-child{background:var(--discipline-accent,#356a9e);color:white;border-color:transparent}.gmf-module-actions button:focus-visible{outline:2px solid currentColor;outline-offset:2px}',
    '@media(max-width:600px){.gmf-module summary{padding:12px;gap:9px}.gmf-module-number{flex-basis:37px}.gmf-course-intro{padding:14px}.gmf-module-body{padding:13px}}'
  ].join('');
  document.head.appendChild(style);

  global.GmfDisciplines = Object.freeze({installed:true,subjectIds:Array.from(ids),moduleCount:catalog.subjects.reduce((sum,course)=>sum+course.modules.length,0),renderMaster:(id)=>{const course=catalog.subjects.find(s=>s.id===id);return course?renderMaster(course):''}});
  global.GmfStudyObjective?.sync?.();
  try { global.renderAll?.(); global.renderDisciplineGrid?.(); } catch (error) {
    console.error('[GMF] Não foi possível atualizar a lista de disciplinas',error);
  }
})(window);
