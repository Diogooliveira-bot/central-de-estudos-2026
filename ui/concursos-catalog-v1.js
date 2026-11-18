(function (global) {
  'use strict';
  if (global.CentralContestCatalog) return;
  let payload = null, overlay = null, selected = null, adminMode = false;
  const filters = {q:'',state:'',status:'',cargo:''};
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const date = (value) => value ? new Intl.DateTimeFormat('pt-BR',{timeZone:'UTC'}).format(new Date(value+'T12:00:00Z')) : 'Não informado';
  const userRole = () => global.BASE_COMPLETA_USER?.role || global.__BASE_COMPLETA_USER_ROLE__ || '';
  function toast(message) { const node=document.createElement('div');node.className='contest-toast';node.textContent=message;document.body.appendChild(node);setTimeout(()=>node.remove(),3200); }
  async function load(force=false) {
    if (payload && !force) return payload;
    const response = await fetch('/api/concursos'+(userRole()==='admin'?'?admin=1':''),{cache:'no-store',credentials:'same-origin'});
    const body = await response.json().catch(()=>({}));
    if (!response.ok) throw new Error(body.error || 'Não foi possível carregar os concursos.');
    payload = body; return body;
  }
  function ensureOverlay() {
    if (overlay) return overlay;
    overlay=document.createElement('div');overlay.className='contest-catalog-overlay';overlay.hidden=true;document.body.appendChild(overlay);
    overlay.addEventListener('click',onClick);overlay.addEventListener('input',onInput);overlay.addEventListener('change',onInput);
    return overlay;
  }
  function filtered() {
    const q=filters.q.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
    return (payload?.items||[]).filter(item => {
      const text=[item.name,item.organ,item.state,...(item.cargos||[]).map(c=>c.name)].join(' ').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
      return (!q||text.includes(q))&&(!filters.state||item.state===filters.state)&&(!filters.status||item.status===filters.status)&&(!filters.cargo||(item.cargos||[]).some(c=>c.name.toLowerCase().includes(filters.cargo.toLowerCase())));
    });
  }
  function badges(item) { return `<div class="contest-badges"><span class="contest-badge ${item.status==='publicado'?'published':'expected'}">${item.status==='publicado'?'Edital publicado':'Previsto / autorizado'}</span><span class="contest-badge ${item.state==='CE'?'ce':''}">${esc(item.state)}</span>${item.featured?'<span class="contest-badge ce">Prioridade</span>':''}${item.active===false?'<span class="contest-badge">Inativo</span>':''}</div>`; }
  function card(item) { return `<article class="contest-card ${item.featured?'featured':''}">${badges(item)}<h2>${esc(item.name)}</h2><div class="organ">${esc(item.organ)}</div><dl><dt>Edital</dt><dd>${esc(item.noticeNumber||'Ainda não publicado')}</dd><dt>Cargos</dt><dd>${item.cargos?.length||0} grupos cadastrados</dd><dt>Vagas</dt><dd>${item.vacancies==null?'Não confirmadas':esc(item.vacancies)}</dd><dt>Verificado</dt><dd>${date(item.lastVerified)}</dd></dl><div class="contest-coverage"><div><span>Cobertura da Central</span><b>${item.coverage?.percent||0}%</b></div><i><span style="width:${item.coverage?.percent||0}%"></span></i></div><button type="button" class="contest-open" data-contest-open="${esc(item.id)}">Ver concurso</button></article>`; }
  function home() {
    selected=null;adminMode=false;
    const items=filtered();const states=[...new Set((payload.items||[]).map(i=>i.state))].sort();
    overlay.innerHTML=`<main class="contest-catalog-shell"><header class="contest-catalog-head"><div><span class="contest-catalog-kicker">BASE COMPLETA · 2026</span><h1>Editais e Concursos</h1><p>Catálogo seletivo com fontes oficiais, situação conferida e correspondência real com o conteúdo da Central.</p></div><button type="button" class="contest-close" data-contest-close>Fechar</button></header>${payload.canManage?'<div class="contest-admin-bar"><button type="button" class="contest-admin-button" data-contest-new>Novo concurso</button><button type="button" class="contest-admin-button" data-contest-history>Histórico e pendências</button></div>':''}<section class="contest-controls" aria-label="Filtros"><input data-contest-filter="q" value="${esc(filters.q)}" placeholder="Pesquisar nome, órgão ou cargo" aria-label="Pesquisar concursos"><select data-contest-filter="state"><option value="">Todos os locais</option>${states.map(s=>`<option ${filters.state===s?'selected':''}>${esc(s)}</option>`).join('')}</select><select data-contest-filter="status"><option value="">Todas as situações</option><option value="publicado" ${filters.status==='publicado'?'selected':''}>Edital publicado</option><option value="previsto" ${filters.status==='previsto'?'selected':''}>Previsto / autorizado</option></select><input data-contest-filter="cargo" value="${esc(filters.cargo)}" placeholder="Filtrar por cargo" aria-label="Filtrar por cargo"></section><div class="contest-summary"><span>${items.length} concursos exibidos</span><span>${items.filter(i=>i.status==='publicado').length} com edital publicado</span><span>${items.filter(i=>i.state==='CE').length} do Ceará</span></div><section class="contest-grid">${items.length?items.map(card).join(''):'<div class="contest-empty">Nenhum concurso corresponde aos filtros.</div>'}</section></main>`;
  }
  function subject(item) { const status={complete:'Cobertura forte',partial:'Cobertura parcial',missing:'Sem cobertura'}[item.coverage]||'Sem cobertura';return `<article class="contest-subject"><header><h3>${esc(item.name)}</h3><span class="contest-subject-status ${esc(item.coverage)}">${status}</span></header>${item.topics?.length?`<ul>${item.topics.map(t=>`<li>${esc(t)}</li>`).join('')}</ul>`:''}${item.centralId?`<button type="button" class="contest-study-link" data-contest-study="${esc(item.centralId)}" data-contest-module="${esc(item.moduleIds?.[0]||'')}">Abrir na Central</button>`:''}</article>`; }
  function detail(item) {
    selected=item;adminMode=false;
    const pending=(item.pending||[]).map(p=>`<li>${esc(p)}</li>`).join('');
    overlay.innerHTML=`<main class="contest-catalog-shell"><button type="button" class="contest-detail-back" data-contest-back>← Voltar ao catálogo</button><article class="contest-detail"><div class="contest-detail-title"><div><h2>${esc(item.name)}</h2><p class="lead">${esc(item.summary)}</p></div>${badges(item)}</div>${payload.canManage?`<div class="contest-admin-bar"><button class="contest-admin-button" data-contest-edit="${esc(item.id)}">Editar cadastro</button><button class="contest-admin-button" data-contest-toggle="${esc(item.id)}">${item.active===false?'Ativar':'Desativar'} concurso</button></div>`:''}${item.status==='previsto'?'<p class="contest-notice"><b>Atenção:</b> não existe edital de abertura de 2026 confirmado neste cadastro. Dados antigos não são apresentados como atuais.</p>':''}<section class="contest-meta"><div><small>Edital</small><b>${esc(item.noticeNumber||'Não publicado')}</b></div><div><small>Banca</small><b>${esc(item.board||'Não definida')}</b></div><div><small>Vagas</small><b>${item.vacancies==null?'Não confirmadas':esc(item.vacancies)}</b></div><div><small>Última verificação</small><b>${date(item.lastVerified)}</b></div><div><small>Inscrições</small><b>${item.registrationStart?date(item.registrationStart)+' a '+date(item.registrationEnd):'Não informadas'}</b></div><div><small>Prova</small><b>${date(item.examDate)}</b></div><div><small>Remuneração</small><b>${esc(item.salary||'Não confirmada')}</b></div><div><small>Cobertura</small><b>${item.coverage?.percent||0}%</b></div></section><p class="lead"><small>${esc(item.coverage?.method||'')}</small></p><h3 class="contest-section-title">Cargos e escolaridade</h3><div class="contest-sources">${(item.cargos||[]).map(c=>`<div class="contest-source"><span>${esc(c.name)}<br><small>${esc(c.education||'Escolaridade não informada')}</small></span><b>${c.vacancies==null?'—':esc(c.vacancies)+' vagas'}</b></div>`).join('')||'<p>Sem cargos cadastrados.</p>'}</div><h3 class="contest-section-title">Disciplinas e cobertura</h3><section class="contest-subjects">${(item.subjects||[]).map(subject).join('')}</section>${pending?`<h3 class="contest-section-title">Informações pendentes</h3><ul class="lead">${pending}</ul>`:''}<h3 class="contest-section-title">Fontes oficiais</h3><div class="contest-sources">${(item.sources||[]).map(s=>`<a class="contest-source" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer"><span>${esc(s.title)}<br><small>${esc(s.type)}</small></span><b>abrir ↗</b></a>`).join('')}</div></article></main>`;
  }
  function editor(item, isNew=false) {
    adminMode=true;selected=item;
    overlay.innerHTML=`<main class="contest-catalog-shell"><button type="button" class="contest-detail-back" data-contest-back>← Cancelar</button><section class="contest-admin-panel"><h1>${isNew?'Novo concurso':'Editar concurso'}</h1><p>Editor administrativo completo. Mantenha apenas dados confirmados por fontes oficiais; a revisão é controlada para evitar sobrescrever alterações de outro administrador.</p><textarea id="contestAdminJson" spellcheck="false">${esc(JSON.stringify(item,null,2))}</textarea><div class="contest-admin-actions"><button type="button" class="contest-close" data-contest-back>Cancelar</button><button type="button" class="contest-admin-save" data-contest-save="${isNew?'create':'update'}">Salvar cadastro</button></div></section></main>`;
  }
  function history() {
    adminMode=true;selected=null;
    const rejected=(payload.researchRejections||[]).map(r=>`<div><span><b>${esc(r.name)}</b><br>${esc(r.reason)}</span><a href="${esc(r.url)}" target="_blank" rel="noopener">fonte oficial</a></div>`).join('');
    overlay.innerHTML=`<main class="contest-catalog-shell"><button type="button" class="contest-detail-back" data-contest-back>← Voltar</button><section class="contest-admin-panel"><h1>Histórico e controle</h1><h3>Alterações recentes</h3><div class="contest-admin-history">${(payload.events||[]).map(e=>`<div><span>${esc(e.contestId)} · ${esc(e.action)} · versão ${e.revision}</span><b>${esc(e.by)}</b><time>${new Date(e.at).toLocaleString('pt-BR')}</time></div>`).join('')||'<p>Sem eventos.</p>'}</div><h3>Pesquisados e não cadastrados como edital de 2026</h3><div class="contest-admin-history">${rejected}</div></section></main>`;
  }
  async function save(action) {
    let data;try{data=JSON.parse(document.getElementById('contestAdminJson').value);}catch(_){return toast('O JSON possui erro de formatação.');}
    const response=await fetch('/api/concursos',{method:action==='create'?'POST':'PUT',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({action,data,revision:selected?.revision})});
    const body=await response.json().catch(()=>({}));if(!response.ok)return toast(body.error||'Não foi possível salvar.');
    await load(true);const updated=payload.items.find(i=>i.id===data.id);toast('Cadastro salvo com histórico.');updated?detail(updated):home();
  }
  async function toggle(item) {
    const response=await fetch('/api/concursos',{method:'PUT',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'toggle',id:item.id,active:item.active===false,revision:item.revision})});
    const body=await response.json().catch(()=>({}));if(!response.ok)return toast(body.error||'Não foi possível alterar.');await load(true);toast(body.active?'Concurso ativado.':'Concurso desativado.');home();
  }
  function blank() { return {id:'novo-concurso-2026',name:'',organ:'',state:'CE',sphere:'Estadual',year:2026,noticeNumber:null,noticeDate:null,status:'previsto',active:false,featured:false,board:null,vacancies:null,salary:null,registrationStart:null,registrationEnd:null,examDate:null,lastVerified:new Date().toISOString().slice(0,10),summary:'',pending:['Completar dados oficiais antes de ativar'],sources:[{type:'oficial',title:'',url:'https://'}],cargos:[],subjects:[]}; }
  function onInput(event) { const key=event.target.dataset.contestFilter;if(!key)return;filters[key]=event.target.value;home();const next=overlay.querySelector(`[data-contest-filter="${key}"]`);next?.focus();if(next?.setSelectionRange&&key==='q')next.setSelectionRange(filters[key].length,filters[key].length); }
  function onClick(event) {
    if(event.target.closest('[data-contest-close]'))return close();if(event.target.closest('[data-contest-back]'))return selected&&!adminMode?home():home();
    const open=event.target.closest('[data-contest-open]')?.dataset.contestOpen;if(open)return detail(payload.items.find(i=>i.id===open));
    const edit=event.target.closest('[data-contest-edit]')?.dataset.contestEdit;if(edit)return editor(payload.items.find(i=>i.id===edit));
    if(event.target.closest('[data-contest-new]'))return editor(blank(),true);if(event.target.closest('[data-contest-history]'))return history();
    const toggleId=event.target.closest('[data-contest-toggle]')?.dataset.contestToggle;if(toggleId)return toggle(payload.items.find(i=>i.id===toggleId));
    const saveAction=event.target.closest('[data-contest-save]')?.dataset.contestSave;if(saveAction)return save(saveAction);
    const study=event.target.closest('[data-contest-study]');if(study){close();global.CentralStudyNavigation?.openContext?.({subject:study.dataset.contestStudy,module:study.dataset.contestModule||undefined});}
  }
  async function open() { ensureOverlay();overlay.hidden=false;document.documentElement.style.overflow='hidden';overlay.innerHTML='<main class="contest-catalog-shell"><div class="contest-empty">Carregando catálogo oficial…</div></main>';try{await load();home();}catch(error){overlay.innerHTML=`<main class="contest-catalog-shell"><button class="contest-close" data-contest-close>Fechar</button><div class="contest-empty">${esc(error.message)}</div></main>`;}return true; }
  function close(){if(overlay)overlay.hidden=true;document.documentElement.style.overflow='';}
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&overlay&&!overlay.hidden)close();});
  global.CentralContestCatalog={open,close,reload:()=>load(true)};
})(window);
