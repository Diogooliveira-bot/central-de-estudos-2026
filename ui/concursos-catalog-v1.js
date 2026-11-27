(function (global) {
  'use strict';
  if (global.CentralContestCatalog) return;
  let payload = null, overlay = null, selected = null, adminMode = false;
  let offlineCopy = false;
  const PUBLIC_CACHE_KEY = 'central-v6:contest-public-offline-v1';
  const PUBLIC_CACHE_TTL = 72 * 60 * 60 * 1000;
  const filters = {q:'',state:'',status:'',cargo:''};
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  // Never inject arbitrary API data into an inline style or a clickable URL.
  const percent = (value) => { const n=Number(value); return Number.isFinite(n)?Math.max(0,Math.min(100,n)):0; };
  const httpsUrl = (value) => { try { const url=new URL(String(value)); return url.protocol==='https:'?url.href:'#'; } catch (_) { return '#'; } };
  const date = (value) => value ? new Intl.DateTimeFormat('pt-BR',{timeZone:'UTC'}).format(new Date(value+'T12:00:00Z')) : 'Não informado';
  const userRole = () => global.BASE_COMPLETA_USER?.role || global.__BASE_COMPLETA_USER_ROLE__ || '';
  function cachedPublicCatalog() {
    if(userRole()==='admin')return null;
    try {
      const saved=JSON.parse(localStorage.getItem(PUBLIC_CACHE_KEY)||'null');
      if(!saved || !Number.isFinite(saved.at) || Date.now()-saved.at>PUBLIC_CACHE_TTL || saved.at>Date.now() || !Array.isArray(saved.items))return null;
      return {items:saved.items,canManage:false};
    } catch (_) { return null; }
  }
  function rememberPublicCatalog(body) {
    if(body.canManage || !Array.isArray(body.items))return;
    try { localStorage.setItem(PUBLIC_CACHE_KEY,JSON.stringify({at:Date.now(),items:body.items})); } catch (_) { /* sem espaço disponível */ }
  }
  const offlineNotice = () => offlineCopy ? '<p class="contest-notice">Catálogo salvo neste aparelho. Conecte-se para atualizar os editais e alterar sua seleção.</p>' : '';
  function toast(message) { const node=document.createElement('div');node.className='contest-toast';node.textContent=message;document.body.appendChild(node);setTimeout(()=>node.remove(),3200); }
  async function load(force=false) {
    if (payload && !force) return payload;
    try {
      const response = await fetch('/api/concursos'+(userRole()==='admin'?'?admin=1':''),{cache:'no-store',credentials:'same-origin'});
      const body = await response.json().catch(()=>({}));
      if (!response.ok) throw new Error(body.error || 'Não foi possível carregar os concursos.');
      payload = body; offlineCopy=false; rememberPublicCatalog(body); return body;
    } catch (error) {
      const cached=cachedPublicCatalog();
      if(!cached)throw new Error('Catálogo indisponível sem conexão. Abra os concursos online para preparar o acesso offline.');
      payload=cached; offlineCopy=true; return cached;
    }
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
  // Data from contests and imported PDF is always inserted through DOM text nodes.
  // The only remaining innerHTML assignments build constant, trusted markup.
  function node(tag, className='', content=null) {
    const out=document.createElement(tag);
    if(className)out.className=className;
    if(content!==null&&content!==undefined)out.textContent=String(content);
    return out;
  }
  function control(label, className, attribute, value='') {
    const button=node('button',className,label);
    button.type='button';
    if(attribute)button.setAttribute(attribute,value);
    return button;
  }
  function notice() {
    return node('p','contest-notice','Catálogo salvo neste aparelho. Conecte-se para atualizar os editais e alterar sua seleção.');
  }
  function badgeBar(item) {
    const div=node('div','contest-badges');
    div.append(node('span','contest-badge '+(item.status==='publicado'?'published':'expected'),item.status==='publicado'?'Edital publicado':'Previsto / autorizado'));
    div.append(node('span','contest-badge '+(item.state==='CE'?'ce':''),item.state));
    if(item.featured)div.append(node('span','contest-badge ce','Prioridade'));
    if(item.active===false)div.append(node('span','contest-badge','Inativo'));
    return div;
  }
  function detailPair(container,label,value) {
    container.append(node('dt','',label),node('dd','',value));
  }
  function card(item) {
    const article=node('article','contest-card'+(item.featured?' featured':''));
    article.append(badgeBar(item),node('h2','',item.name),node('div','organ',item.organ));
    if(item.currentStage) {
      const stage=node('p','contest-stage');
      stage.append(node('b','','Etapa atual:'),document.createTextNode(' '+item.currentStage));
      article.append(stage);
    }
    const dl=node('dl');
    detailPair(dl,'Edital',item.noticeNumber||'Ainda não publicado');
    detailPair(dl,'Cargos',String(item.cargos?.length||0)+' grupos cadastrados');
    detailPair(dl,'Vagas',item.vacancies==null?'Não confirmadas':item.vacancies);
    detailPair(dl,'Verificado',date(item.lastVerified));
    article.append(dl);
    const cover=node('div','contest-coverage'), headline=node('div');
    headline.append(node('span','','Cobertura da Central'),node('b','',percent(item.coverage?.percent)+'%'));
    const bar=node('i');const fill=node('span');fill.style.width=percent(item.coverage?.percent)+'%';bar.append(fill);
    cover.append(headline,bar);article.append(cover);
    article.append(control('Ver concurso','contest-open','data-contest-open',item.id));
    return article;
  }
  function home() {
    selected=null;adminMode=false;
    const items=filtered(),states=[...new Set((payload.items||[]).map(i=>String(i.state||'')))].sort();
    overlay.innerHTML='<main class="contest-catalog-shell"><header class="contest-catalog-head"><div><span class="contest-catalog-kicker">BASE COMPLETA · 2026</span><h1>Editais e Concursos</h1><p>Catálogo seletivo com fontes oficiais, situação conferida e correspondência real com o conteúdo da Central.</p></div><button type="button" class="contest-close" data-contest-close>Fechar</button></header><section class="contest-controls" aria-label="Filtros"></section><div class="contest-summary"></div><section class="contest-grid"></section></main>';
    const header=overlay.querySelector('.contest-catalog-head');
    if(offlineCopy)header.after(notice());
    if(payload.canManage) {
      const bar=node('div','contest-admin-bar');
      bar.append(control('Novo concurso','contest-admin-button','data-contest-new'),control('Histórico e pendências','contest-admin-button','data-contest-history'));
      header.after(bar);
    }
    const filtersArea=overlay.querySelector('.contest-controls');
    const q=node('input');q.dataset.contestFilter='q';q.value=filters.q;q.placeholder='Pesquisar nome, órgão ou cargo';q.setAttribute('aria-label','Pesquisar concursos');
    const state=node('select');state.dataset.contestFilter='state';
    const all=node('option','','Todos os locais');all.value='';state.append(all);
    for(const value of states){const opt=node('option','',value);opt.value=value;opt.selected=filters.state===value;state.append(opt);}
    const status=node('select');status.dataset.contestFilter='status';
    for(const [value,title] of [['','Todas as situações'],['publicado','Edital publicado'],['previsto','Previsto / autorizado']]) {
      const opt=node('option','',title);opt.value=value;opt.selected=filters.status===value;status.append(opt);
    }
    const cargo=node('input');cargo.dataset.contestFilter='cargo';cargo.value=filters.cargo;cargo.placeholder='Filtrar por cargo';cargo.setAttribute('aria-label','Filtrar por cargo');
    filtersArea.append(q,state,status,cargo);
    const summary=overlay.querySelector('.contest-summary');
    summary.append(node('span','',items.length+' concursos exibidos'),
      node('span','',items.filter(i=>i.status==='publicado').length+' com edital publicado'),
      node('span','',items.filter(i=>i.state==='CE').length+' do Ceará'));
    const grid=overlay.querySelector('.contest-grid');
    if(items.length)grid.append(...items.map(card));else grid.append(node('div','contest-empty','Nenhum concurso corresponde aos filtros.'));
  }
  function topicItem(topic) {
    const li=node('li','',topic.title);
    const status=topic.links?.some(l=>l.status==='approved')?'vínculo conferido; confira pendências':
      topic.links?.some(l=>l.status==='suggested')?'sugestão pendente':'Em preparação';
    const supplement=topic.supplement?.title?
      ' · complementação '+(topic.supplement.status==='approved'?'conferida':'pendente'):'';
    li.append(document.createTextNode(' '),node('small','','· '+status+supplement));
    return li;
  }
  function subject(item) {
    const article=node('article','contest-subject'),head=node('header');
    const label={complete:'Cobertura forte',partial:'Cobertura parcial',missing:'Em preparação'}[item.coverage]||'Em preparação';
    head.append(node('h3','',item.name),node('span','contest-subject-status '+(['complete','partial','missing'].includes(item.coverage)?item.coverage:'missing'),label));
    article.append(head);
    const topics=item.syllabus?.length?item.syllabus.map(topicItem):(item.topics||[]).map(t=>node('li','',t));
    if(topics.length){const ul=node('ul');ul.append(...topics);article.append(ul);}
    if(item.centralId&&item.coverage!=='missing') {
      const link=control('Abrir na Central','contest-study-link','data-contest-study',item.centralId);
      link.dataset.contestModule=item.moduleIds?.[0]||'';
      article.append(link);
    }
    return article;
  }
  function sectionTitle(parent,text){parent.append(node('h3','contest-section-title',text));}
  function metaPair(parent,label,value,className='') {
    const box=node('div',className);
    box.append(node('small','',label),node('b','',value));
    parent.append(box);
  }
  function officialLink(source) {
    const a=node('a','contest-source');a.href=httpsUrl(source.url);a.target='_blank';a.rel='noopener noreferrer';
    const text=node('span');text.append(document.createTextNode(String(source.title||'')),node('br'),node('small','',source.type));
    a.append(text,node('b','','abrir ↗'));
    return a;
  }
  function detail(item) {
    selected=item;adminMode=false;
    overlay.innerHTML='<main class="contest-catalog-shell"><button type="button" class="contest-detail-back" data-contest-back>← Voltar ao catálogo</button><article class="contest-detail"></article></main>';
    const article=overlay.querySelector('.contest-detail');
    const title=node('div','contest-detail-title'),titleInfo=node('div');
    titleInfo.append(node('h2','',item.name),node('p','lead',item.summary));
    title.append(titleInfo,badgeBar(item));
    article.append(title);
    if(offlineCopy)article.append(notice());
    if(!offlineCopy&&item.active!==false&&item.status==='publicado') {
      const bar=node('div','contest-admin-bar');
      bar.append(control('Adicionar/remover dos meus editais','contest-admin-button','data-contest-follow',item.id),
        node('small','','O histórico dos capítulos é compartilhado; os checklists de cada edital continuam separados.'));
      article.append(bar);
    }
    if(payload.canManage) {
      const bar=node('div','contest-admin-bar');
      const edit=control('Editar cadastro','contest-admin-button','data-contest-edit',item.id);
      const toggle=control(item.active===false?'Ativar':'Desativar'+' concurso','contest-admin-button','data-contest-toggle',item.id);
      if(item.active===false)toggle.textContent='Ativar concurso';
      bar.append(edit,toggle);article.append(bar);
    }
    if(item.status==='previsto')article.append(node('p','contest-notice','Atenção: não existe edital de abertura de 2026 confirmado neste cadastro. Dados antigos não são apresentados como atuais.'));
    if(item.id==='gmf-fortaleza-monitoramento'){
      const bar=node('div','contest-admin-bar');bar.append(control('Selecionar GMF como objetivo de estudos','contest-admin-button','data-contest-objective','gmf-fortaleza'),control('Abrir edital verticalizado · GMF','contest-admin-button','data-contest-gmf-verticalized','gmf-fortaleza'));article.append(bar);
    }
    if(item.id==='prf-2021-policial-rodoviario-federal'&&item.active!==false){
      const bar=node('div','contest-admin-bar');bar.append(control('Abrir edital verticalizado · PRF','contest-admin-button','data-contest-prf-verticalized','prf'));article.append(bar);
    }
    const meta=node('section','contest-meta');
    if(item.currentStage)metaPair(meta,'Etapa atual · atualizada em '+date(item.currentStageDate),item.currentStage,'contest-meta-stage');
    metaPair(meta,'Edital',item.noticeNumber||'Não publicado');
    metaPair(meta,'Banca',item.board||'Não definida');
    metaPair(meta,'Vagas',item.vacancies==null?'Não confirmadas':item.vacancies);
    metaPair(meta,'Última verificação',date(item.lastVerified));
    metaPair(meta,'Inscrições',item.registrationStart?date(item.registrationStart)+' a '+date(item.registrationEnd):'Não informadas');
    metaPair(meta,'Prova',date(item.examDate));
    metaPair(meta,'Remuneração',item.salary||'Não confirmada');
    metaPair(meta,'Cobertura',percent(item.coverage?.percent)+'%');
    article.append(meta);
    const methodology=node('p','lead');methodology.append(node('small','',item.coverage?.method||''));article.append(methodology);
    sectionTitle(article,'Cargos e escolaridade');
    const cargos=node('div','contest-sources');
    for(const c of item.cargos||[]) {
      const panel=node('div','contest-source'),text=node('span');
      text.append(document.createTextNode(String(c.name||'')),node('br'),node('small','',c.education||'Escolaridade não informada'));
      panel.append(text,node('b','',c.vacancies==null?'—':String(c.vacancies)+' vagas'));cargos.append(panel);
    }
    if(!cargos.childNodes.length)cargos.append(node('p','','Sem cargos cadastrados.'));
    article.append(cargos);
    sectionTitle(article,'Disciplinas e cobertura');
    const subjects=node('section','contest-subjects');subjects.append(...(item.subjects||[]).map(subject));article.append(subjects);
    if(item.pending?.length) {
      sectionTitle(article,'Informações pendentes');const ul=node('ul','lead');
      ul.append(...item.pending.map(p=>node('li','',p)));article.append(ul);
    }
    sectionTitle(article,'Fontes oficiais');
    const sources=node('div','contest-sources');sources.append(...(item.sources||[]).map(officialLink));article.append(sources);
  }
  function editor(item, isNew=false) {
    adminMode=true;selected=item;
    global.CentralContestAdminForm.open(overlay,item,isNew);
  }
  function history() {
    adminMode=true;selected=null;
    overlay.innerHTML='<main class="contest-catalog-shell"><button type="button" class="contest-detail-back" data-contest-back>← Voltar</button><section class="contest-admin-panel"><h1>Histórico e controle</h1><h3>Alterações recentes</h3><div class="contest-admin-history" data-history-events></div><h3>Pesquisados e não cadastrados como edital de 2026</h3><div class="contest-admin-history" data-history-rejections></div></section></main>';
    const events=overlay.querySelector('[data-history-events]');
    for(const entry of payload.events||[]) {
      const div=node('div');
      div.append(node('span','',entry.contestId+' · '+entry.action+' · versão '+entry.revision),node('b','',entry.by),node('time','',new Date(entry.at).toLocaleString('pt-BR')));
      events.append(div);
    }
    if(!events.childNodes.length)events.append(node('p','','Sem eventos.'));
    const rejected=overlay.querySelector('[data-history-rejections]');
    for(const entry of payload.researchRejections||[]) {
      const div=node('div'),span=node('span');
      span.append(node('b','',entry.name),node('br'),document.createTextNode(String(entry.reason||'')));
      const a=node('a','','fonte oficial');a.href=httpsUrl(entry.url);a.target='_blank';a.rel='noopener noreferrer';
      div.append(span,a);rejected.append(div);
    }
  }
  async function save(action) {
    const data=global.CentralContestAdminForm.value();
    const response=await fetch('/api/concursos',{method:action==='create'?'POST':'PUT',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({action,data,revision:selected?.revision})});
    const body=await response.json().catch(()=>({}));if(!response.ok)return toast(body.error||'Não foi possível salvar.');
    await load(true);const updated=payload.items.find(i=>i.id===data.id);toast('Cadastro salvo com histórico.');updated?detail(updated):home();
  }
  async function toggle(item) {
    const response=await fetch('/api/concursos',{method:'PUT',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'toggle',id:item.id,active:item.active===false,revision:item.revision})});
    const body=await response.json().catch(()=>({}));if(!response.ok)return toast(body.error||'Não foi possível alterar.');await load(true);toast(body.active?'Concurso ativado.':'Concurso desativado.');home();
  }
  function blank() { return {id:'novo-concurso-2026',name:'',organ:'',state:'CE',sphere:'Estadual',year:2026,noticeNumber:null,noticeDate:null,status:'previsto',active:false,featured:false,board:null,vacancies:null,salary:null,registrationStart:null,registrationEnd:null,examDate:null,lastVerified:new Date().toISOString().slice(0,10),currentStage:null,currentStageDate:null,summary:'',pending:['Completar dados oficiais antes de ativar'],sources:[{type:'oficial',title:'',url:'https://'}],cargos:[],subjects:[]}; }
  function onInput(event) { const key=event.target.dataset.contestFilter;if(!key)return;filters[key]=event.target.value;home();const next=overlay.querySelector(`[data-contest-filter="${key}"]`);next?.focus();if(next?.setSelectionRange&&key==='q')next.setSelectionRange(filters[key].length,filters[key].length); }
  function onClick(event) {
    if(event.target.closest('[data-contest-close]'))return close();if(event.target.closest('[data-contest-back]'))return selected&&!adminMode?home():home();
    const open=event.target.closest('[data-contest-open]')?.dataset.contestOpen;if(open)return detail(payload.items.find(i=>i.id===open));
    const edit=event.target.closest('[data-contest-edit]')?.dataset.contestEdit;if(edit)return editor(payload.items.find(i=>i.id===edit));
    if(event.target.closest('[data-contest-new]'))return editor(blank(),true);if(event.target.closest('[data-contest-history]'))return history();
    const toggleId=event.target.closest('[data-contest-toggle]')?.dataset.contestToggle;if(toggleId)return toggle(payload.items.find(i=>i.id===toggleId));
    const saveAction=event.target.closest('[data-contest-save]')?.dataset.contestSave;if(saveAction)return save(saveAction);
    if(event.target.closest('[data-contest-gmf-verticalized]')){close();global.CentralStudyObjectives?.setActive?.('exam-catalog-gmf-fortaleza-monitoramento-cargo-1');global.GmfStudyObjective?.choose('gmf-fortaleza',{navigate:true});global.CentralGMFVerticalized?.open();return;}
    if(event.target.closest('[data-contest-prf-verticalized]')){const objectives=global.CentralStudyObjectives;const goal='exam-catalog-prf-2021-policial-rodoviario-federal-cargo-1';if(!objectives)return;const selecting=objectives.selectObjective(goal);if(objectives.getActive()!==goal){toast('Não foi possível selecionar o edital.');return;}close();global.CentralPRFVerticalized?.open();void selecting;return;}
    const goal=event.target.closest('[data-contest-objective]');if(goal){close();global.GmfStudyObjective?.choose(goal.dataset.contestObjective,{navigate:true});return;}
    const follow=event.target.closest('[data-contest-follow]');if(follow){global.CentralStudyObjectives?.toggleCatalogContest?.(follow.dataset.contestFollow).then((ok)=>toast(ok?'Seleção de editais atualizada.':'Não foi possível alterar a seleção.'));return;}
    const study=event.target.closest('[data-contest-study]');if(study){close();global.CentralStudyNavigation?.openContext?.({subject:study.dataset.contestStudy,module:study.dataset.contestModule||undefined});}
  }
  async function open() { ensureOverlay();overlay.hidden=false;document.documentElement.style.overflow='hidden';overlay.innerHTML='<main class="contest-catalog-shell"><div class="contest-empty">Carregando catálogo oficial…</div></main>';try{await load();home();}catch(error){overlay.innerHTML='<main class="contest-catalog-shell"><button class="contest-close" data-contest-close>Fechar</button><div class="contest-empty"></div></main>';overlay.querySelector('.contest-empty').textContent=error.message;}return true; }
  function close(){if(overlay)overlay.hidden=true;document.documentElement.style.overflow='';}
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&overlay&&!overlay.hidden)close();});
  global.CentralContestCatalog={open,close,reload:()=>load(true)};
})(window);
