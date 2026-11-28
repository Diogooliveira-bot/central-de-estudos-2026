/* Leitor por módulo GMF. Carrega os assets somente pela API privada. */
(function(global){
 'use strict';
 if(global.GmfCourseReaderV2)return;
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
 // O M01 das quatro primeiras disciplinas vive num pacote único antigo; as demais usam um arquivo por módulo (como M02+).
 const LEGACY_M01=new Set(['atual','fortaleza','legesp','dh']);
 const usesBundle=(subject,module)=>module==='m01'&&LEGACY_M01.has(subject);
 function assetPath(subject,module,mode){
   if(usesBundle(subject,module))return mode==='review'?'/content/gmf/m01-review-v1.js':'/content/gmf/m01-full-v1.js';
   return '/content/gmf/'+subject+'/'+module+'-'+(mode==='review'?'review':'full')+'-v1.js';
 }
 function recordFor(subject,module,mode,path){
   if(usesBundle(subject,module)){
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
 // O leitor usa a MESMA estrutura das demais disciplinas (CentralNativeReadingSession): tela cheia, barra de ferramentas,
 // sumário, títulos com barra lateral, Papel/Noturno/Justificado e a "capa" de apostila teórica.
 function close(){
   if(!state.root)return;
   state.root.remove();state.root=null;
   global.document.documentElement.classList.remove('gmf-native-reader-open');
   if(state.active?.isConnected)state.active.focus({preventScroll:true});
   state.active=null;
 }
 const readCount=(subject,module,mode,total)=>{let n=0;for(let i=0;i<total;i++)if(saved(key(subject,module,mode,i)))n++;return n};
 function paint(record){
   if(!state.root)return;
   const {subject,module,mode}=state,chapters=record.chapters||[];
   if(mode==='complete'&&chapters.length){try{global.localStorage.setItem(key(subject,module,mode,'count'),String(chapters.length));}catch(_){}}
   const done=readCount(subject,module,mode,chapters.length),pct=chapters.length?Math.round(done*100/chapters.length):0;
   global.CentralNativeReadingSession.percent(state.root,pct);
   const out=state.root.querySelector('[data-done]');if(out)out.textContent=String(done);
   const track=state.root.querySelector('[data-gmf-bar]');if(track)track.style.width=pct+'%';
   state.root.querySelectorAll('[data-mark]').forEach(b=>{const v=saved(key(subject,module,mode,Number(b.dataset.mark)));b.setAttribute('aria-pressed',String(v));b.textContent=v?'✓ Seção lida · desfazer':'Marcar seção como lida'});
 }
 function articleHtml(record){
   const {subject,module,mode}=state;
   const course=subjects.get(subject),modules=course.modules,index=modules.findIndex(m=>m.id===module);
   const title=modules[index]?.title||record.title||'Módulo';
   const chapters=record.chapters||[];
   const done=readCount(subject,module,mode,chapters.length),pct=chapters.length?Math.round(done*100/chapters.length):0;
   const review=mode==='review';
   const sections=chapters.map((c,i)=>'<h2 id="gmf-native-chapter-'+i+'">'+String(i+1).padStart(2,'0')+' '+esc(c.title)+'</h2>'+c.html+'<div class="gmf-native-mark-row"><button type="button" data-mark="'+i+'" aria-pressed="false">Marcar seção como lida</button></div>').join('');
   const resources=(record.resources||[]).filter(x=>/^https:\/\//.test(x.url)).map(x=>'<a href="'+esc(x.url)+'" target="_blank" rel="noopener noreferrer">'+esc(x.title)+'</a>').join(' · ');
   const previous=index>0?modules[index-1]:null,next=index<modules.length-1?modules[index+1]:null;
   const other=review?'complete':'review';
   return '<h1>'+esc(title)+'</h1>'+
     '<p class="lead">'+(review?'Revise os pontos principais e tente recuperar as ideias antes de consultar suas anotações.':'Estude os capítulos em sequência. O indicador registra seções lidas, não conclui o módulo automaticamente.')+'</p>'+
     '<div class="gmf-native-progress" role="group" aria-label="Progresso desta leitura"><span>Progresso desta leitura: <span data-done>'+done+'</span>/'+chapters.length+' seções lidas</span><div class="gmf-native-track" aria-hidden="true"><span data-gmf-bar style="width:'+pct+'%"></span></div></div>'+
     '<div class="gmf-native-actions"><button type="button" data-mode="'+other+'">'+(review?'Abrir Conteúdo Completo':'Abrir Revisão Guiada')+'</button></div>'+
     sections+
     (resources?'<div class="gmf-reader-sources"><b>Fontes verificáveis · consulta em 22/11/2026</b><p>'+resources+'</p></div>':'')+
     '<aside class="gmf-reader-questions"><b>Questões do módulo</b><p>Em preparação — questões disponíveis em breve.</p></aside>'+
     '<nav class="gmf-native-modules" aria-label="Outros módulos"><button type="button" data-module="'+(previous?.id||'')+'" '+(!previous?'disabled':'')+'>← '+(previous?esc(previous.title):'Início do curso')+'</button><button type="button" data-module="'+(next?.id||'')+'" '+(!next?'disabled':'')+'>'+(next?esc(next.title):'Fim do curso')+' →</button></nav>';
 }
 function render(record){
   const {subject,module,mode}=state,reader=global.CentralNativeReadingSession,chapters=record.chapters||[];
   const toc=()=>'<div class="bc-native-toc-label">Capítulos</div>'+chapters.map((c,i)=>'<button type="button" data-jump="'+i+'"><span>'+String(i+1).padStart(2,'0')+'</span> '+esc(c.title)+'</button>').join('');
   reader.show(state.root,articleHtml(record),toc,0,()=>{});
   const root=state.root;
   root.querySelector('[data-mode]')?.addEventListener('click',e=>open(subject,module,e.currentTarget.dataset.mode));
   root.querySelectorAll('[data-module]').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.module)open(subject,b.dataset.module,mode)}));
   root.querySelectorAll('[data-jump]').forEach(b=>b.addEventListener('click',()=>global.document.getElementById('gmf-native-chapter-'+b.dataset.jump)?.scrollIntoView({behavior:'smooth',block:'start'})));
   root.querySelectorAll('[data-mark]').forEach(b=>b.addEventListener('click',()=>{
     const i=Number(b.dataset.mark);save(key(subject,module,mode,i),!saved(key(subject,module,mode,i)));paint(record);
   }));
   paint(record);
 }
 async function open(subject,module,mode='review'){
   subject=String(subject||'').toLowerCase();module=String(module||'').toLowerCase();mode=mode==='complete'?'complete':'review';
   const course=subjects.get(subject);if(!course||!course.modules.some(m=>m.id===module))return false;
   if(mode==='complete'){try{await global.CentralPlanAccess?.ready}catch(_){} if(global.CentralPlanAccess?.isFree?.()===true){global.CentralPlanAccess.showLock?.();return false}}
   const reader=global.CentralNativeReadingSession;
   if(!reader){global.alert?.('O leitor ainda está carregando. Tente novamente em instantes.');return false}
   const keepFocus=state.active||global.document.activeElement;
   close();state.active=keepFocus;
   state.subject=subject;state.module=module;state.mode=mode;
   const index=course.modules.findIndex(m=>m.id===module);
   state.root=reader.create({id:'gmf-native-reader',subject:'gmf',title:course.modules[index].title,
     eyebrow:course.name.toUpperCase()+' · MÓDULO '+String(index+1).padStart(2,'0')+' · '+(mode==='review'?'VERSÃO DE REVISÃO':'TEORIA COMPLETA'),
     close,finish:()=>{const rec=dataByPath.get(assetPath(subject,module,mode))||recordFor(subject,module,mode,assetPath(subject,module,mode));const total=rec?.chapters?.length||0;for(let i=0;i<total;i++)save(key(subject,module,mode,i),true);if(rec)paint(rec)}});
   global.document.documentElement.classList.add('gmf-native-reader-open');
   try{const record=await load(subject,module,mode);if(state.subject!==subject||state.module!==module||state.mode!==mode||!state.root)return false;render(record)}
   catch(error){if(state.root&&state.subject===subject&&state.module===module)reader.fail(state.root,()=>open(subject,module,mode));const message=state.root?.querySelector('[role="status"] p');if(message)message.textContent=error.message||'Verifique sua conexão e tente novamente.'}
   return false;
 }
 const style=global.document.createElement('style');style.id='gmf-course-reader-v2-css';style.textContent=[
  'html.gmf-native-reader-open{overflow:hidden}',
  '.gmf-native-progress{margin:14px 0 4px;font-size:.8125rem;color:var(--muted,#5b6b7d)}.gmf-native-track{height:6px;margin-top:6px;border-radius:4px;overflow:hidden;background:var(--line,#dce2e8)}.gmf-native-track span{display:block;height:100%;background:#16b5d9}',
  '.gmf-native-actions,.gmf-native-modules{display:flex;flex-wrap:wrap;justify-content:space-between;gap:10px;margin:16px 0}.gmf-native-actions button,.gmf-native-modules button,.gmf-native-mark-row button{min-height:44px;padding:9px 14px;border:1px solid var(--line,#cfe0ef);border-radius:10px;background:var(--panel,#fff);color:inherit;font:inherit;font-size:.875rem;font-weight:650;cursor:pointer}.gmf-native-modules button:disabled{opacity:.45;cursor:default}',
  '.gmf-native-mark-row{text-align:right;margin:10px 0 6px}.gmf-native-mark-row button[aria-pressed="true"]{background:#e8f6f1;border-color:#9fd6c2}',
  '.bc-native-toc [data-jump]{display:flex;gap:8px;width:100%;padding:8px;border:0;border-radius:8px;background:transparent;color:inherit;text-align:left;font:inherit;font-size:.8125rem;cursor:pointer}.bc-native-toc [data-jump]:hover{background:var(--soft,#f2f6f8)}.bc-native-toc [data-jump] span{font-weight:800;color:#0a5fa8}',
  '.gmf-reader-sources,.gmf-reader-questions{margin-top:20px;padding:14px;background:var(--soft,#f6f8fa);border-radius:10px;font-size:.8125rem;line-height:1.6}.gmf-reader-questions{border-left:3px solid #758394}.gmf-reader-questions p{margin-bottom:0}.gmf-reader-sources a{color:#0a5fa8}'
 ].join('');
 global.document.head.appendChild(style);
 global.GmfCourseReaderV2=Object.freeze({open,close});
 global.GmfCourseReader=global.GmfCourseReaderV2;
})(window);
