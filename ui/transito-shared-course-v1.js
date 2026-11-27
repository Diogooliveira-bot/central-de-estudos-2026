/* Base Completa — disciplina compartilhada de Legislação de Trânsito.
 * O curso é comum a concursos municipais, PRF e outras carreiras. Itaitinga
 * seleciona os assuntos do seu programa; não recebe uma cópia do conteúdo.
 */
(function (g) {
  'use strict';
  if (g.BaseTransitoCourse || !Array.isArray(g.SUBJECTS) || typeof g.renderSubjects !== 'function') return;

  const ID = 'transito';
  const MODULES = [
    ['m01','Introdução ao Código de Trânsito Brasileiro'],
    ['m02','Sistema Nacional de Trânsito'],
    ['m03','Competências dos órgãos de trânsito'],
    ['m04','Normas gerais de circulação e conduta'],
    ['m05','Pedestres e veículos não motorizados'],
    ['m06','Sinalização de trânsito'],
    ['m07','Classificação e características dos veículos'],
    ['m08','Registro e licenciamento'],
    ['m09','Habilitação'],
    ['m10','Infrações de trânsito'],
    ['m11','Penalidades'],
    ['m12','Medidas administrativas'],
    ['m13','Processo administrativo de trânsito'],
    ['m14','Crimes de trânsito'],
    ['m15','Fiscalização e operações de trânsito'],
    ['m16','Transporte escolar'],
    ['m17','Conceitos e definições do CTB']
  ].map(([id,title],i)=>({id,number:i+1,title,status:i<2?'published':'in_production'}));
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const pad=n=>String(n).padStart(2,'0');
  const PREFIX='central-v6:transito:module-open:';
  const existing=g.SUBJECTS.find(s=>s.id===ID);
  const subject=existing||{id:ID,name:'Legislação de Trânsito',special:'17 módulos • conteúdo compartilhado',topics:MODULES.map(m=>({uid:'transito-'+m.id,title:pad(m.number)+' '+m.title.toUpperCase(),origin:m.status==='published'?'Módulo '+pad(m.number)+' • Conteúdo disponível':'Módulo '+pad(m.number)+' • Em preparação',type:'Curso',tips:['Conteúdo compartilhado da Base Completa; a cobertura depende do edital selecionado.']}))};
  if(!existing)g.SUBJECTS.push(subject);

  function card(title,description,tag,action,enabled,mode,id){
    const button=enabled?'<button type="button" class="pt-cf-button pt-cf-button-open" data-bc-transito-open="'+mode+'" data-module-id="'+id+'">'+action+'</button>':'<button type="button" class="pt-cf-button bc-info-disabled" disabled aria-disabled="true">Em preparação</button>';
    return '<article class="pt-cf-card '+(mode==='review'?'pt-cf-card-review':'pt-cf-card-primary')+'"><span class="pt-cf-icon" aria-hidden="true">'+(mode==='review'?'↺':mode.startsWith('questions')?'✍':'≡')+'</span><b>'+title+'</b><small>'+description+'</small><span class="pt-cf-tags"><span>'+tag+'</span></span><div class="pt-cf-actions">'+button+'</div></article>';
  }
  function moduleHtml(m){
    const open=(()=>{try{return g.localStorage.getItem(PREFIX+m.id)==='1'}catch(_){return false}})();
    const ready=m.status==='published';
    const outline=m.id==='m01'?['Objeto e alcance do CTB','Trânsito seguro e prioridade à vida','Estrutura e leitura da lei','Aplicação no trabalho municipal']:m.id==='m02'?['Finalidades do Sistema Nacional de Trânsito','Órgãos e entidades que compõem o sistema','Coordenação, execução e julgamento','Integração municipal e limites de atuação']:['Conteúdo programático organizado para produção e conferência de vigência.'];
    const note=m.id==='m01'?'<p><strong>Pegadinhas do módulo:</strong> não confundir trânsito com circulação de veículos; a lei também alcança pedestres, veículos e condutas previstas no CTB. O agente só atua dentro da competência do órgão e da circunscrição.</p><p><strong>Checklist:</strong> diferencie CTB e regulamentação; explique o alcance territorial; relacione segurança, fluidez e proteção da vida; reconheça por que município precisa integrar-se ao SNT para exercer as competências do art. 24.</p>':'<p><strong>Pegadinhas do módulo:</strong> integrar o SNT não dá a todos os seus componentes as mesmas atribuições. CONTRAN, órgãos executivos e JARI têm funções diferentes.</p><p><strong>Checklist:</strong> identifique o sistema e seus participantes; diferencie coordenação normativa, execução e julgamento recursal; antes de atuar, confira competência e circunscrição.</p>';
    const chapters=ready?'<div class="pt-cf-cards bc-info-materials">'+
      card('Revisão Guiada','Primeiro contato explicado e retomada rápida.','Revisão • 4 capítulos','Abrir revisão',true,'review',m.id)+
      card('Conteúdo Completo','Fundamentos, regras, aplicação e limites.','Teoria • 6 capítulos','Estudar conteúdo',true,'complete',m.id)+
      card('Questões da Revisão','10 questões autorais com gabarito comentado.','10 questões','Resolver revisão',true,'questions-review',m.id)+
      card('Questões de Aprofundamento','10 questões para consolidar a teoria.','10 questões','Resolver questões',true,'questions-complete',m.id)+
      '</div><div class="bc-info-reading">'+note+'</div>' :
      '<div class="bc-info-note">O roteiro do módulo já está organizado, mas o material ainda está em produção. Não há leitura, questões ou filtro externo publicado para este módulo.</div>';
    return '<section class="cf-module bc-info-module '+(open?'open':'')+'" data-module="transito-'+m.id+'"><button type="button" class="cf-module-head" aria-expanded="'+open+'" data-bc-transito-toggle="'+m.id+'"><span class="cf-module-no">MÓDULO '+pad(m.number)+'</span><span class="cf-module-title">'+esc(m.title)+'</span><span class="bc-info-status">'+(ready?'Conteúdo disponível':'Em preparação')+'</span><span class="cf-module-stat">'+(ready?'Revisão · teoria · questões':'Em preparação')+'</span><span class="chev">⌄</span></button><div class="cf-module-body"><div class="pt-cf-module-inside bc-info-inside"><ul class="bc-transito-outline">'+outline.map(x=>'<li>'+x+'</li>').join('')+'</ul>'+chapters+'</div></div></section>';
  }
  function shell(){return '<div class="bc-info-intro"><b>Legislação de Trânsito — biblioteca compartilhada</b><p>Os mesmos módulos podem compor trilhas da AMC, PRF, guardas e agentes municipais. O edital escolhido determina quais módulos entram na preparação; progresso e seleção de edital permanecem separados.</p><p><strong>Atualização jurídica:</strong> legislação conferida em 27/11/2026. Cada módulo será liberado somente após revisão da lei vigente e das normas regulamentares aplicáveis.</p></div><div class="cf-modules bc-info-modules bc-transito-modules">'+MODULES.map(moduleHtml).join('')+'</div>'}
  const previous= g.renderSubjects;
  g.renderSubjects=function(){const result=previous.apply(this,arguments);const el=g.document.querySelector('#subjects > .subject[data-id="'+ID+'"]');if(el?.classList.contains('open')){const body=el.querySelector(':scope > .subject-body');if(body)body.innerHTML=shell()}return result};
  const gridPrevious=g.renderDisciplineGrid;
  if(typeof gridPrevious==='function')g.renderDisciplineGrid=function(){const result=gridPrevious.apply(this,arguments);const cardEl=g.document.querySelector('#disciplineGrid .disc-card[data-id="'+ID+'"]');const sub=cardEl?.querySelector('small');if(sub)sub.textContent='17 módulos • M01–M02 disponíveis; demais em preparação';return result};

  function toggle(id){const m=MODULES.find(x=>x.id===id);if(!m)return false;const el=g.document.querySelector('#subjects .bc-info-module[data-module="transito-'+id+'"]');if(!el)return false;const opening=!el.classList.contains('open');el.classList.toggle('open',opening);el.querySelector('[data-bc-transito-toggle]')?.setAttribute('aria-expanded',String(opening));try{g.localStorage.setItem(PREFIX+id,opening?'1':'0')}catch(_){}return false}
  g.document.addEventListener('click',event=>{const toggleButton=event.target.closest('[data-bc-transito-toggle]');if(toggleButton){event.preventDefault();event.stopPropagation();toggle(toggleButton.dataset.bcTransitoToggle);return}const button=event.target.closest('[data-bc-transito-open]');if(!button)return;event.preventDefault();event.stopPropagation();g.BaseTransitoReader?.open(button.dataset.moduleId,button.dataset.bcTransitoOpen)});
  g.BaseTransitoCourse=Object.freeze({modules:MODULES,toggle,available:()=>MODULES.filter(m=>m.status==='published').map(m=>m.id)});
  try{g.renderAll?.();g.renderDisciplineGrid?.()}catch(_){/* render do app pode estar em inicialização */}
})(window);
