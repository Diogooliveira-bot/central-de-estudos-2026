/* Base Completa · leitor seguro dos primeiros módulos GMF.
   Textos são servidos por API autorizada; progresso indica apenas SEÇÕES lidas. */
(function (global) {
  'use strict';
  if (global.GmfReader) return;
  const SUMMARY='/content/gmf/m01-review-v1.js';
  const COMPLETE='/content/gmf/m01-full-v1.js';
  const names={atual:'Atualidades',fortaleza:'Conhecimentos sobre Fortaleza',legesp:'Legislação Extravagante',dh:'Direitos Humanos'};
  const current={dialog:null,active:null,id:'',mode:''};
  const loading={};
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const USER_ID=String(global.__BASE_COMPLETA_USER_ID__||'guest').trim().slice(0,120);
  const key=(id,mode,i)=>'central-v6:gmf:m01:'+USER_ID+':'+id+':'+mode+':read:'+i;
  const saved=k=>{try{return global.localStorage.getItem(k)==='1'}catch(_){return false}};
  const save=(k,v)=>{try{global.localStorage.setItem(k,v?'1':'0')}catch(_){}};
  const chapters=(id,mode)=>((mode==='review'?global.GMF_M01_REVIEW:global.GMF_M01_FULL)||{})[id];
  const n2=i=>String(i+1).padStart(2,'0');
  function percent(id,mode,record){
    const all=record?.chapters||[];
    const done=all.filter((_,i)=>saved(key(id,mode,i))).length;
    return {done,total:all.length,value:all.length?Math.round(100*done/all.length):0};
  }
  function load(mode){
    const path=mode==='review'?SUMMARY:COMPLETE;
    if(mode==='review'&&global.GMF_M01_REVIEW)return Promise.resolve();
    if(mode==='complete'&&global.GMF_M01_FULL)return Promise.resolve();
    if(loading[path])return loading[path];
    loading[path]=new Promise((resolve,reject)=>{
      const script=global.document.createElement('script');
      script.async=true;
      script.src='/api/private-content?asset='+encodeURIComponent(path);
      script.onload=()=>{
        script.remove();
        if(mode==='review'&&global.GMF_M01_REVIEW||mode==='complete'&&global.GMF_M01_FULL)resolve();
        else reject(new Error('O servidor não entregou o material solicitado.'));
      };
      script.onerror=()=>{script.remove();reject(new Error('O material não pôde ser carregado. Verifique sua conexão ou seu plano.'))};
      global.document.head.appendChild(script);
    }).catch(err=>{delete loading[path];throw err});
    return loading[path];
  }
  function close(){
    if(!current.dialog)return false;
    current.dialog.remove();
    current.dialog=null;
    global.document.body.classList.remove('gmf-reader-open');
    global.document.removeEventListener('keydown',onKey);
    if(current.active?.isConnected)current.active.focus();
    current.active=null;current.id='';current.mode='';
    return false;
  }
  function onKey(event){if(event.key==='Escape'){event.preventDefault();close()}}
  function shell(){
    const root=global.document.createElement('div');
    root.className='gmf-reader-overlay';
    root.setAttribute('role','dialog');
    root.setAttribute('aria-modal','true');
    root.setAttribute('aria-label','Material de estudo GMF');
    root.addEventListener('click',event=>{if(event.target===root)close()});
    global.document.body.appendChild(root);
    global.document.body.classList.add('gmf-reader-open');
    global.document.addEventListener('keydown',onKey);
    current.dialog=root;
    return root;
  }
  function renderError(error){
    if(!current.dialog)return;
    current.dialog.innerHTML='<div class="gmf-reader-box"><div class="gmf-reader-top"><button type="button" data-gmf-close>← Voltar</button></div>'+
      '<div class="gmf-reader-intro"><h2>Não foi possível abrir o material</h2><p>'+esc(error.message)+'</p><button type="button" data-gmf-retry>Tentar novamente</button></div></div>';
    current.dialog.querySelector('[data-gmf-close]')?.addEventListener('click',close);
    current.dialog.querySelector('[data-gmf-retry]')?.addEventListener('click',()=>open(current.id,current.mode));
  }
  function render(id,mode){
    if(!current.dialog)return;
    const record=chapters(id,mode);
    if(!record||!Array.isArray(record.chapters)||!record.chapters.length)throw new Error('Material não disponível para este módulo.');
    const stat=percent(id,mode,record);
    const label=mode==='review'?'Revisão guiada':'Teoria completa';
    const alt=mode==='review'?'complete':'review';
    const altLabel=mode==='review'?'Abrir teoria completa':'Abrir revisão guiada';
    const nav=record.chapters.map((chapter,i)=>'<button type="button" data-gmf-jump="'+i+'"><span>'+n2(i)+'</span>'+esc(chapter.title)+'</button>').join('');
    const main=record.chapters.map((chapter,i)=>'<section class="gmf-reader-chapter" id="gmf-study-chapter-'+i+'">'+
      '<small>CAPÍTULO '+n2(i)+' DE '+n2(record.chapters.length)+'</small><h2>'+esc(chapter.title)+'</h2>'+
      '<div class="gmf-reader-prose">'+chapter.html+'</div><div class="gmf-reader-footer"><button type="button" data-gmf-mark="'+i+'" aria-pressed="'+saved(key(id,mode,i))+'">'+
      (saved(key(id,mode,i))?'✓ Seção lida · desfazer':'Marcar seção como lida')+'</button></div></section>').join('');
    const sources=(record.resources||[]).filter(x=>/^https:\/\//.test(x.url)).map(x=>
      '<a href="'+esc(x.url)+'" target="_blank" rel="noopener noreferrer">'+esc(x.title)+'</a>').join(' · ');
    current.dialog.innerHTML='<div class="gmf-reader-box"><div class="gmf-reader-top"><button type="button" data-gmf-close>← Voltar</button>'+
      '<div><small>BASE COMPLETA · GMF · MÓDULO 01</small><h1>'+esc(names[id]||id)+'</h1></div>'+
      '<button type="button" data-gmf-switch="'+alt+'">'+altLabel+'</button></div>'+
      '<div class="gmf-reader-progress"><b>'+label+'</b><small>Progresso de leitura: <span data-gmf-percent>'+stat.value+'</span>% · '+stat.done+'/'+stat.total+' seções</small>'+
      '<div role="progressbar" aria-label="Leitura realizada" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+stat.value+'" data-gmf-meter><span style="width:'+stat.value+'%"></span></div></div>'+
      '<div class="gmf-reader-grid"><nav aria-label="Sumário"><b>SUMÁRIO</b>'+nav+'</nav><main><p class="gmf-reader-lead">'+
      (mode==='review'?'Responda mentalmente às perguntas antes de consultar a teoria.':
        'Leia cada capítulo e faça anotações. O percentual indica somente leitura, não conclusão da disciplina.')+'</p>'+
      main+(sources?'<div class="gmf-reader-sources"><b>Fontes verificáveis</b><p>'+sources+'</p></div>':'')+
      '<div class="gmf-reader-done">M01 · '+label+' concluído para leitura? O banco de questões é separado e seguirá o limite do plano do aluno.</div>'+
      '</main></div></div>';
    current.dialog.querySelector('[data-gmf-close]')?.addEventListener('click',close);
    current.dialog.querySelector('[data-gmf-switch]')?.addEventListener('click',()=>open(id,alt));
    current.dialog.querySelectorAll('[data-gmf-jump]').forEach(button=>button.addEventListener('click',()=>{
      const i=Number(button.dataset.gmfJump);
      current.dialog.querySelector('#gmf-study-chapter-'+i)?.scrollIntoView({behavior:'smooth',block:'start'});
    }));
    current.dialog.querySelectorAll('[data-gmf-mark]').forEach(button=>button.addEventListener('click',()=>{
      const i=Number(button.dataset.gmfMark),state=!saved(key(id,mode,i));
      save(key(id,mode,i),state);
      button.textContent=state?'✓ Seção lida · desfazer':'Marcar seção como lida';
      button.setAttribute('aria-pressed',String(state));
      const next=percent(id,mode,record);
      const pct=current.dialog.querySelector('[data-gmf-percent]');if(pct)pct.textContent=String(next.value);
      const meter=current.dialog.querySelector('[data-gmf-meter]');
      if(meter){meter.setAttribute('aria-valuenow',String(next.value));const bar=meter.querySelector('span');if(bar)bar.style.width=next.value+'%';}
      const subtitle=current.dialog.querySelector('.gmf-reader-progress small');
      if(subtitle)subtitle.innerHTML='Progresso de leitura: <span data-gmf-percent>'+next.value+'</span>% · '+next.done+'/'+next.total+' seções';
    }));
    current.dialog.querySelector('[data-gmf-close]')?.focus();
  }
  async function open(id,mode='review'){
    id=String(id||'').toLowerCase();mode=mode==='complete'?'complete':'review';
    if(!Object.prototype.hasOwnProperty.call(names,id))return false;
    if(mode==='complete'){
      try{await global.CentralPlanAccess?.ready;}catch(_){}
      if(global.CentralPlanAccess?.isFree?.()===true){
        global.CentralPlanAccess.showLock?.();return false;
      }
    }
    if(!current.dialog) {current.active=global.document.activeElement;shell()}
    current.id=id;current.mode=mode;
    current.dialog.innerHTML='<div class="gmf-reader-box"><p class="gmf-reader-loading" role="status">Carregando material autorizado…</p><button data-gmf-close>← Voltar</button></div>';
    current.dialog.querySelector('[data-gmf-close]')?.addEventListener('click',close);
    try{
      await load(mode);
      if(!current.dialog||current.id!==id||current.mode!==mode)return false;
      render(id,mode);
    }catch(error){if(current.dialog&&current.id===id&&current.mode===mode)renderError(error)}
    return false;
  }
  const css=global.document.createElement('style');
  css.id='gmf-reader-css-v1';
  css.textContent=[
    'body.gmf-reader-open{overflow:hidden}.gmf-reader-overlay{position:fixed;inset:0;z-index:2147482900;background:rgba(16,31,44,.65);padding:18px;display:grid;place-items:center}',
    '.gmf-reader-box{background:var(--panel,#fff);color:var(--text,#223344);height:min(96vh,920px);width:min(1080px,100%);border-radius:14px;overflow:auto;box-shadow:0 18px 48px rgba(0,0,0,.24)}',
    '.gmf-reader-top{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:18px;padding:18px 20px;border-bottom:1px solid var(--line,#dfe5ed)}',
    '.gmf-reader-top h1{font-size:19px;margin:3px 0 0;line-height:1.3}.gmf-reader-top small{font-size:11px;color:var(--muted,#738092)}',
    '.gmf-reader-top button,.gmf-reader-intro button,.gmf-reader-footer button{background:var(--soft,#f6f8fa);color:var(--text,#243244);border:1px solid var(--line,#dbe2ea);border-radius:8px;padding:10px 12px;cursor:pointer;font:600 12px system-ui}',
    '.gmf-reader-progress{padding:14px 20px;display:grid;gap:7px}.gmf-reader-progress>b{font-size:14px}.gmf-reader-progress small{font-size:12px;color:var(--muted,#738092)}',
    '.gmf-reader-progress [role=progressbar]{height:5px;border-radius:4px;overflow:hidden;background:var(--line,#dce2e8)}.gmf-reader-progress [role=progressbar] span{display:block;height:100%;background:#4c8096}',
    '.gmf-reader-grid{display:grid;grid-template-columns:235px minmax(0,1fr);border-top:1px solid var(--line,#e2e7ed)}',
    '.gmf-reader-grid nav{padding:18px 12px;border-right:1px solid var(--line,#e2e7ed);align-self:start;position:sticky;top:0;display:grid;gap:4px}',
    '.gmf-reader-grid nav>b{padding:6px 8px;font-size:11px;letter-spacing:.07em;color:var(--muted,#738092)}',
    '.gmf-reader-grid nav button{border:0;background:transparent;text-align:left;color:inherit;display:flex;gap:9px;padding:8px;font:500 12px/1.5 system-ui;cursor:pointer;border-radius:6px}',
    '.gmf-reader-grid nav button:hover{background:var(--soft,#f2f6f8)}.gmf-reader-grid nav button span{color:#4c8096;font-weight:800}',
    '.gmf-reader-grid main{padding:20px 26px 34px;min-width:0}.gmf-reader-lead{font-size:13px;color:var(--muted,#738092);line-height:1.7}',
    '.gmf-reader-chapter{padding:14px 0 22px;border-bottom:1px solid var(--line,#e2e7ed);scroll-margin-top:16px}',
    '.gmf-reader-chapter>small{font-size:10px;letter-spacing:.06em;color:var(--muted,#738092)}.gmf-reader-chapter h2{font-size:19px;line-height:1.35;margin:8px 0 14px}',
    '.gmf-reader-prose{font-size:14px;line-height:1.85}.gmf-reader-prose p{margin:0 0 13px}.gmf-reader-prose strong{font-weight:700}',
    '.gmf-reader-footer{text-align:right;margin-top:15px}.gmf-reader-sources,.gmf-reader-done{margin-top:20px;padding:14px;background:var(--soft,#f6f8fa);border-radius:10px;font-size:12px;line-height:1.6}',
    '.gmf-reader-sources a{color:#327190}.gmf-reader-loading{margin:32px;font-size:15px}.gmf-reader-intro{padding:22px}',
    '@media(max-width:720px){.gmf-reader-overlay{padding:0}.gmf-reader-box{height:100dvh;width:100%;border-radius:0}.gmf-reader-top{grid-template-columns:1fr;gap:8px;padding:14px}.gmf-reader-top button{justify-self:start}.gmf-reader-grid{display:block}.gmf-reader-grid nav{position:static;display:flex;overflow:auto;gap:5px;padding:8px;border-right:0;border-bottom:1px solid var(--line,#e2e7ed)}.gmf-reader-grid nav>b{display:none}.gmf-reader-grid nav button{flex:0 0 auto;white-space:nowrap}.gmf-reader-grid main{padding:12px 16px 24px}.gmf-reader-chapter h2{font-size:17px}}',
    '@media(prefers-reduced-motion:reduce){.gmf-reader-overlay *{scroll-behavior:auto!important}}'
  ].join('');
  global.document.head.appendChild(css);
  global.GmfReader=Object.freeze({open,close,percent:(id,mode)=>percent(id,mode,chapters(id,mode))});
})(window);
