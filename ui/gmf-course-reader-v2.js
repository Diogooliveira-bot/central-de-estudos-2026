/* Leitor por módulo GMF. Carrega os assets somente pela API privada. */
(function(global){
 'use strict';
 if(global.GmfCourseReader)return;
 const catalog=global.GmfCourseCatalog;
 if(!catalog?.subjects?.length)return;
 const subjects=new Map(catalog.subjects.map(s=>[s.id,s]));
 const userId=String(global.__BASE_COMPLETA_USER_ID__||'guest').trim().slice(0,120);
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const key=(subject,module,mode,index)=>'central-v6:gmf:'+userId+':'+subject+':'+module+':'+mode+':read:'+index;
 const saved=k=>{try{return global.localStorage.getItem(k)==='1'}catch(_){return false}};
 const save=(k,v)=>{try{global.localStorage.setItem(k,v?'1':'0')}catch(_){}};
 const dataByPath=new Map(), pending=new Map();
 const state={root:null,subject:'',module:'',mode:'review',active:null};
 function assetPath(subject,module,mode){
   if(module==='m01')return mode==='review'?'/content/gmf/m01-review-v1.js':'/content/gmf/m01-full-v1.js';
   return '/content/gmf/'+subject+'/'+module+'-'+(mode==='review'?'review':'full')+'-v1.js';
 }
 function recordFor(subject,module,mode,path){
   if(module==='m01'){
     const all=mode==='review'?global.GMF_M01_REVIEW:global.GMF_M01_FULL;
     return all?.[subject]||null;
   }
   const r=dataByPath.get(path);
   return r?.subject===subject&&r?.module===module?r:null;
 }
 function load(subject,module,mode){
   const path=assetPath(subject,module,mode);
   const ready=recordFor(subject,module,mode,path);
   if(ready)return Promise.resolve(ready);
   if(pending.has(path))return pending.get(path);
   const task=new Promise((resolve,reject)=>{
     const script=global.document.createElement('script');
     script.async=true;
     script.src='/api/private-content?asset='+encodeURIComponent(path);
     script.onload=()=>{
       script.remove();
       const item=module==='m01'
         ?(mode==='review'?global.GMF_M01_REVIEW:global.GMF_M01_FULL)?.[subject]
         :(mode==='review'?global.GMF_MODULE_REVIEW:global.GMF_MODULE_FULL);
       if(item&&(module==='m01'||item.subject===subject&&item.module===module)){
         dataByPath.set(path,item);resolve(item);
       }else reject(new Error('O servidor não entregou este módulo.'));
     };
     script.onerror=()=>{script.remove();reject(new Error('Não foi possível carregar este material autorizado.'))};
     global.document.head.appendChild(script);
   }).finally(()=>pending.delete(path));
   pending.set(path,task);
   return task;
 }
 function close(){
   if(!state.root)return;
   state.root.remove();state.root=null;
   global.document.body.classList.remove('gmf-reader-open');
   global.document.removeEventListener('keydown',onKey);
   if(state.active?.isConnected)state.active.focus();
   state.active=null;
 }
 function onKey(e){if(e.key==='Escape'){e.preventDefault();close()}}
 function shell(){
   const root=global.document.createElement('div');
   root.className='gmf-reader-overlay';root.setAttribute('role','dialog');root.setAttribute('aria-modal','true');root.setAttribute('aria-label','Leitor de estudos GMF');
   root.addEventListener('click',e=>{if(e.target===root)close()});
   global.document.body.appendChild(root);global.document.body.classList.add('gmf-reader-open');
   global.document.addEventListener('keydown',onKey);state.root=root;return root;
 }
 function render(record){
   if(!state.root)return;
   const {subject,module,mode}=state;
   const course=subjects.get(subject),modules=course.modules,index=modules.findIndex(m=>m.id===module);
   const title=record.title||modules[index]?.title||'Módulo';
   const chapters=record.chapters||[];
   const done=chapters.filter((_,i)=>saved(key(subject,module,mode,i))).length;
   const pct=chapters.length?Math.round(done*100/chapters.length):0;
   const nav=chapters.map((c,i)=>'<button type="button" data-jump="'+i+'"><span>'+String(i+1).padStart(2,'0')+'</span>'+esc(c.title)+'</button>').join('');
   const sections=chapters.map((c,i)=>'<section class="gmf-reader-chapter" id="gmf-v2-chapter-'+i+'"><small>CAPÍTULO '+String(i+1).padStart(2,'0')+' DE '+String(chapters.length).padStart(2,'0')+'</small><h2>'+esc(c.title)+'</h2><div class="gmf-reader-prose">'+c.html+'</div><div class="gmf-reader-footer"><button type="button" data-mark="'+i+'" aria-pressed="'+saved(key(subject,module,mode,i))+'">'+(saved(key(subject,module,mode,i))?'✓ Seção lida · desfazer':'Marcar seção como lida')+'</button></div></section>').join('');
   const other=mode==='review'?'complete':'review',otherLabel=mode==='review'?'Abrir Conteúdo Completo':'Abrir Revisão Guiada';
   const resources=(record.resources||[]).filter(x=>/^https:\/\//.test(x.url)).map(x=>'<a href="'+esc(x.url)+'" target="_blank" rel="noopener noreferrer">'+esc(x.title)+'</a>').join(' · ');
   const previous=index>0?modules[index-1]:null,next=index<modules.length-1?modules[index+1]:null;
   state.root.innerHTML='<div class="gmf-reader-box"><header class="gmf-reader-top"><button type="button" data-close>← Voltar</button><div><small>BASE COMPLETA · '+esc(course.name)+' · '+module.toUpperCase()+'</small><h1>'+esc(title)+'</h1></div><button type="button" data-mode="'+other+'">'+otherLabel+'</button></header>'+
    '<div class="gmf-reader-progress"><b>'+(mode==='review'?'Revisão Guiada':'Conteúdo Completo')+'</b><small>Progresso desta leitura: <span data-pct>'+pct+'</span>% · '+done+'/'+chapters.length+' seções</small><div role="progressbar" aria-label="Progresso de leitura" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+pct+'"><span style="width:'+pct+'%"></span></div></div>'+
    '<div class="gmf-reader-module-nav"><button type="button" data-module="'+(previous?.id||'')+'" '+(!previous?'disabled':'')+'>← '+(previous?esc(previous.title):'Início do curso')+'</button><button type="button" data-module="'+(next?.id||'')+'" '+(!next?'disabled':'')+'>'+(next?esc(next.title):'Fim do curso')+' →</button></div>'+
    '<div class="gmf-reader-grid"><nav aria-label="Sumário"><b>SUMÁRIO</b>'+nav+'</nav><main><p class="gmf-reader-lead">'+(mode==='review'?'Revise os pontos principais e tente recuperar as ideias antes de consultar suas anotações.':'Estude os capítulos em sequência. O indicador registra seções lidas, não conclui o módulo automaticamente.')+'</p>'+sections+(resources?'<div class="gmf-reader-sources"><b>Fontes verificáveis · consulta em 22/11/2026</b><p>'+resources+'</p></div>':'')+'<aside class="gmf-reader-questions"><b>Questões do módulo</b><p>Em preparação — questões disponíveis em breve.</p></aside></main></div></div>';
   state.root.querySelector('[data-close]')?.addEventListener('click',close);
   state.root.querySelector('[data-mode]')?.addEventListener('click',e=>open(subject,module,e.currentTarget.dataset.mode));
   state.root.querySelectorAll('[data-module]').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.module)open(subject,b.dataset.module,mode)}));
   state.root.querySelectorAll('[data-jump]').forEach(b=>b.addEventListener('click',()=>global.document.getElementById('gmf-v2-chapter-'+b.dataset.jump)?.scrollIntoView({behavior:'smooth',block:'start'})));
   state.root.querySelectorAll('[data-mark]').forEach(b=>b.addEventListener('click',()=>{
     const i=Number(b.dataset.mark),v=!saved(key(subject,module,mode,i));save(key(subject,module,mode,i),v);
     b.setAttribute('aria-pressed',String(v));b.textContent=v?'✓ Seção lida · desfazer':'Marcar seção como lida';
     const current=chapters.filter((_,n)=>saved(key(subject,module,mode,n))).length,percent=chapters.length?Math.round(current*100/chapters.length):0;
     const out=state.root.querySelector('[data-pct]');if(out)out.textContent=String(percent);
     const bar=state.root.querySelector('[role=progressbar]');if(bar){bar.setAttribute('aria-valuenow',String(percent));bar.querySelector('span').style.width=percent+'%'}
   }));
 }
 async function open(subject,module,mode='review'){
   subject=String(subject||'').toLowerCase();module=String(module||'').toLowerCase();mode=mode==='complete'?'complete':'review';
   const course=subjects.get(subject);if(!course||!course.modules.some(m=>m.id===module))return false;
   if(mode==='complete'){try{await global.CentralPlanAccess?.ready}catch(_){} if(global.CentralPlanAccess?.isFree?.()===true){global.CentralPlanAccess.showLock?.();return false}}
   if(!state.root){state.active=global.document.activeElement;shell()}
   state.subject=subject;state.module=module;state.mode=mode;
   state.root.innerHTML='<div class="gmf-reader-box"><p class="gmf-reader-loading" role="status">Carregando conteúdo protegido…</p><button type="button" data-close>← Voltar</button></div>';
   state.root.querySelector('[data-close]')?.addEventListener('click',close);
   try{const record=await load(subject,module,mode);if(state.subject!==subject||state.module!==module||state.mode!==mode)return false;render(record)}
   catch(error){if(state.root&&state.subject===subject&&state.module===module)state.root.innerHTML='<div class="gmf-reader-box"><button type="button" data-close>← Voltar</button><div class="gmf-reader-intro"><h2>Conteúdo indisponível</h2><p>'+esc(error.message)+'</p></div></div>';state.root?.querySelector('[data-close]')?.addEventListener('click',close)}
   return false;
 }
 const style=global.document.createElement('style');style.id='gmf-course-reader-v2-css';style.textContent=[
  'body.gmf-reader-open{overflow:hidden}.gmf-reader-overlay{position:fixed;inset:0;z-index:2147482901;background:rgba(16,31,44,.65);padding:18px;display:grid;place-items:center}',
  '.gmf-reader-box{background:var(--panel,#fff);color:var(--text,#223344);height:min(96vh,920px);width:min(1080px,100%);border-radius:14px;overflow:auto;box-shadow:0 18px 48px rgba(0,0,0,.24)}',
  '.gmf-reader-top{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:16px;padding:18px 20px;border-bottom:1px solid var(--line,#dfe5ed)}.gmf-reader-top h1{font-size:19px;margin:3px 0;line-height:1.3}.gmf-reader-top small{font-size:11px;color:var(--muted,#738092)}',
  '.gmf-reader-top button,.gmf-reader-module-nav button,.gmf-reader-footer button{background:var(--soft,#f6f8fa);color:var(--text,#243244);border:1px solid var(--line,#dbe2ea);border-radius:8px;padding:10px 12px;cursor:pointer;font:600 12px system-ui}.gmf-reader-progress{padding:14px 20px;display:grid;gap:7px}.gmf-reader-progress>b{font-size:14px}.gmf-reader-progress small{font-size:12px;color:var(--muted,#738092)}.gmf-reader-progress [role=progressbar]{height:5px;border-radius:4px;overflow:hidden;background:var(--line,#dce2e8)}.gmf-reader-progress [role=progressbar] span{display:block;height:100%;background:#4c8096}',
  '.gmf-reader-module-nav{display:flex;justify-content:space-between;gap:12px;padding:8px 20px}.gmf-reader-module-nav button:disabled{opacity:.45;cursor:default}.gmf-reader-grid{display:grid;grid-template-columns:235px minmax(0,1fr);border-top:1px solid var(--line,#e2e7ed)}.gmf-reader-grid nav{padding:18px 12px;border-right:1px solid var(--line,#e2e7ed);align-self:start;position:sticky;top:0;display:grid;gap:4px}.gmf-reader-grid nav>b{padding:6px 8px;font-size:11px;letter-spacing:.07em;color:var(--muted,#738092)}.gmf-reader-grid nav button{border:0;background:transparent;text-align:left;color:inherit;display:flex;gap:9px;padding:8px;font:500 12px/1.5 system-ui;cursor:pointer;border-radius:6px}.gmf-reader-grid nav button:hover{background:var(--soft,#f2f6f8)}.gmf-reader-grid nav button span{color:#4c8096;font-weight:800}',
  '.gmf-reader-grid main{padding:20px 26px 34px;min-width:0}.gmf-reader-lead{font-size:13px;color:var(--muted,#738092);line-height:1.7}.gmf-reader-chapter{padding:14px 0 22px;border-bottom:1px solid var(--line,#e2e7ed);scroll-margin-top:16px}.gmf-reader-chapter>small{font-size:10px;letter-spacing:.06em;color:var(--muted,#738092)}.gmf-reader-chapter h2{font-size:19px;line-height:1.35;margin:8px 0 14px}.gmf-reader-prose{font-size:14px;line-height:1.85}.gmf-reader-prose p{margin:0 0 13px}.gmf-reader-footer{text-align:right;margin-top:15px}.gmf-reader-sources,.gmf-reader-questions{margin-top:20px;padding:14px;background:var(--soft,#f6f8fa);border-radius:10px;font-size:12px;line-height:1.6}.gmf-reader-questions{border-left:3px solid #758394}.gmf-reader-questions p{margin-bottom:0}.gmf-reader-sources a{color:#327190}.gmf-reader-loading{margin:32px;font-size:15px}.gmf-reader-intro{padding:22px}',
  '@media(max-width:720px){.gmf-reader-overlay{padding:0}.gmf-reader-box{height:100dvh;width:100%;border-radius:0}.gmf-reader-top{grid-template-columns:1fr;gap:8px;padding:14px}.gmf-reader-top button{justify-self:start}.gmf-reader-grid{display:block}.gmf-reader-grid nav{position:static;display:flex;overflow:auto;gap:5px;padding:8px;border-right:0;border-bottom:1px solid var(--line,#e2e7ed)}.gmf-reader-grid nav>b{display:none}.gmf-reader-grid nav button{flex:0 0 auto;white-space:nowrap}.gmf-reader-grid main{padding:12px 16px 24px}.gmf-reader-chapter h2{font-size:17px}.gmf-reader-module-nav{padding:8px 12px}}'
 ].join('');
 global.document.head.appendChild(style);
 global.GmfCourseReader=Object.freeze({open,close});
})(window);
