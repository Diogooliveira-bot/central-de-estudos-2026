/* Base Completa — leitor teórico de Informática, isolado do banco de questões.
   Conteúdos publicados por módulo sob /content/informatica/mNN.js. */
(function (global) {
 "use strict";
 if (global.BaseInformaticaReader || !global.BaseInformatica) return;
 const VERSION="20261114m03visuals1";
 const AVAILABLE=new Set(Array.from({length:13},(_,i)=>"m"+String(i+1).padStart(2,"0")));
 const API=global.BaseInformatica;
 for(const m of API.modules){if(AVAILABLE.has(m.id)){m.status="theory_published";m.theory.summary=true;m.theory.complete=true;}}
 const $=s=>global.document.querySelector(s);
 const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const key=(m,k,i)=>"central-v6:info:read:"+m+":"+k+":"+i;
 const localGet=k=>{try{return global.localStorage.getItem(k)}catch(_){return null}};
 const localSet=(k,v)=>{try{global.localStorage.setItem(k,v)}catch(_){}};
 const current={dialog:null,id:"",mode:"",active:null};
 let inflight={};
 function lesson(id){return global.BC_INFO_CONTENT?.[id]||null}
 function load(id){
   if(lesson(id))return Promise.resolve(lesson(id));
   if(inflight[id])return inflight[id];
   if(!AVAILABLE.has(id))return Promise.reject(new Error("Esta teoria ainda está em produção."));
   inflight[id]=new Promise((resolve,reject)=>{
     const script=global.document.createElement("script");
     script.src="/content/informatica/"+id+".js?v="+VERSION;
     script.async=true;
     script.onload=()=>{if(!lesson(id))reject(new Error("Não foi possível ler o material deste módulo."));else resolve(lesson(id))};
     script.onerror=()=>reject(new Error("Não foi possível carregar o conteúdo. Confira a conexão e tente novamente."));
     global.document.head.appendChild(script);
   }).catch(e=>{delete inflight[id];throw e});
   return inflight[id];
 }
 const chapters=(data,mode)=>mode==="review"?data.review:data.full;
 const isRead=(id,mode,i)=>localGet(key(id,mode,i))==="1";
 function fraction(id,data,mode){
   const list=chapters(data,mode),done=list.filter((_,i)=>isRead(id,mode,i)).length;
   return {done,total:list.length,pct:list.length?Math.round(done/list.length*100):0};
 }
 function combined(id,data){
   const full=fraction(id,data,"complete"),review=fraction(id,data,"review");
   const total=full.total+review.total,done=full.done+review.done;
   return {done,total,pct:total?Math.round(done/total*100):0};
 }

 function updateModuleRows() {
   for(const m of API.modules) {
     const host=$('#subjects .bc-info-module[data-module="info-'+m.id+'"]');
     if(!host)continue;
     // A disciplina ainda está em construção: perguntas e filtro QC não publicados.
     const badge=host.querySelector(".bc-info-status");
     if(badge)badge.textContent="Em construção";
     const data=lesson(m.id);
     const pct=data?combined(m.id,data).pct:0;
     const stat=host.querySelector(".cf-module-stat");
     if(stat)stat.textContent=pct+"%";
     const value=host.querySelector(".bc-info-reading-value");
     if(value)value.textContent=pct+"%";
     const track=host.querySelector(".pt-cf-progress-track");
     if(track){
       track.setAttribute("aria-valuenow",String(pct));
       const bar=track.querySelector("span");
       if(bar)bar.style.width=pct+"%";
     }
     // Preserva os quatro cartões existentes, inclusive os links funcionais para leituras.
   }
 }
 function renderDialog(data,mode){
   const list=chapters(data,mode);
   const f=fraction(data.id,data,mode);
   const close='<button class="bc-info-reader-close" type="button" data-bc-info-close aria-label="Fechar material">← Voltar</button>';
   const other=mode==="complete"?"review":"complete";
   const short=mode==="complete"?"Teoria completa":"Modo de revisão";
   const otherTitle=mode==="complete"?"Modo de revisão":"Teoria completa";
   const nav=list.map((c,i)=>'<button type="button" class="bc-info-reader-nav-item" data-bc-info-jump="'+i+'"><span>'+(isRead(data.id,mode,i)?"✓":String(i+1).padStart(2,"0"))+'</span><b>'+esc(c.title)+'</b></button>').join("");
   const body=list.map((c,i)=>'<section class="bc-info-reader-chapter" id="bc-info-'+data.id+'-'+mode+'-'+i+'" data-bc-info-chapter="'+i+'">'+
      '<div class="bc-info-reader-chapter-kicker">SEÇÃO '+String(i+1).padStart(2,"0")+' DE '+String(list.length).padStart(2,"0")+'</div>'+
      '<h2>'+esc(c.title)+'</h2><div class="bc-info-reader-text">'+c.html+'</div>'+
      '<div class="bc-info-reader-chapter-footer"><button class="bc-info-reader-mark" type="button" data-bc-info-mark="'+i+'" aria-pressed="'+isRead(data.id,mode,i)+'">'+(isRead(data.id,mode,i)?"✓ Seção lida · desfazer":"Marcar seção como lida")+'</button>'+
      (i<list.length-1?'<button type="button" class="bc-info-reader-next" data-bc-info-jump="'+(i+1)+'">Próxima seção →</button>':'')+'</div></section>').join("");
   const refs=(data.resources||[]).filter(r=>/^https:\/\//.test(r.url)).map(r=>'<a href="'+esc(r.url)+'" target="_blank" rel="noopener noreferrer">'+esc(r.title)+' ↗</a>').join(" · ");
   current.dialog.innerHTML='<div class="bc-info-reader" role="document"><header class="bc-info-reader-top">'+close+
     '<div><small>BASE COMPLETA · INFORMÁTICA · MÓDULO '+String(Number(data.id.slice(1))).padStart(2,"0")+'</small><h1>'+esc(data.title)+'</h1></div>'+
     '<button type="button" class="bc-info-reader-switch" data-bc-info-switch="'+other+'">'+otherTitle+' →</button></header>'+
     '<div class="bc-info-reader-heading"><div><b>'+short+'</b><span>'+list.length+' seções · conteúdo autoral</span></div>'+
     '<div class="bc-info-reader-track" role="progressbar" aria-label="Leitura deste modo" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+f.pct+'"><span style="width:'+f.pct+'%"></span></div><strong class="bc-info-reader-percent">'+f.pct+'%</strong></div>'+
     '<div class="bc-info-reader-columns"><nav class="bc-info-reader-toc" aria-label="Índice dos capítulos"><b>SUMÁRIO</b>'+nav+'</nav>'+
     '<main class="bc-info-reader-content"><p class="bc-info-reader-intro">'+(mode==="complete"?
       "Estude o conteúdo com atenção e marque cada seção após a leitura. O percentual mede a leitura, não a conclusão do módulo.":
       "Recupere os conceitos principais antes de consultar a teoria. Revise os pontos em que houver dificuldade.")+'</p>'+body+
       (refs?'<div class="bc-info-reader-resources"><b>Referências complementares</b><p>'+refs+'</p></div>':'')+
       '<div class="bc-info-reader-end"><b>Final da '+(mode==="complete"?"teoria completa":"revisão")+'</b><p>As questões próprias e o link do QC serão acrescentados posteriormente.</p>'+
       '<button class="bc-info-reader-switch" type="button" data-bc-info-switch="'+other+'">Abrir '+otherTitle.toLowerCase()+' →</button></div></main></div></div>';
   current.dialog.querySelectorAll("[data-bc-info-close]").forEach(b=>b.addEventListener("click",closeReader));
   current.dialog.querySelectorAll("[data-bc-info-switch]").forEach(b=>b.addEventListener("click",()=>open(data.id,b.dataset.bcInfoSwitch)));
   current.dialog.querySelectorAll("[data-bc-info-jump]").forEach(b=>b.addEventListener("click",()=>{
     const t=current.dialog.querySelector('[data-bc-info-chapter="'+b.dataset.bcInfoJump+'"]');
     t?.scrollIntoView({behavior:"smooth",block:"start"});
   }));
   current.dialog.querySelectorAll("[data-bc-info-mark]").forEach(b=>b.addEventListener("click",()=>{
     const i=Number(b.dataset.bcInfoMark),next=!isRead(data.id,mode,i);
     localSet(key(data.id,mode,i),next?"1":"0");
     const read=fraction(data.id,data,mode);
     const meter=current.dialog.querySelector(".bc-info-reader-track");
     meter?.setAttribute("aria-valuenow",String(read.pct));
     const bar=meter?.querySelector("span");if(bar)bar.style.width=read.pct+"%";
     const percent=current.dialog.querySelector(".bc-info-reader-percent");if(percent)percent.textContent=read.pct+"%";
     b.textContent=next?"✓ Seção lida · desfazer":"Marcar seção como lida";b.setAttribute("aria-pressed",String(next));
     const navNode=current.dialog.querySelector('[data-bc-info-jump="'+i+'"] span');
     if(navNode)navNode.textContent=next?"✓":String(i+1).padStart(2,"0");
     updateModuleRows();
   }));
 }
 function closeReader(){
   if(current.dialog){current.dialog.remove();current.dialog=null}
   global.document.body.classList.remove("bc-info-reader-open");
   global.document.removeEventListener("keydown",escapeReader);
   current.id="";current.mode="";
   if(current.active?.isConnected)current.active.focus();current.active=null;
 }
 function escapeReader(event){if(event.key==="Escape"){event.preventDefault();closeReader()}}
 function ensureDialog(){
   if(current.dialog)return current.dialog;
   current.dialog=global.document.createElement("div");
   current.dialog.className="bc-info-reader-overlay";
   current.dialog.setAttribute("role","dialog");
   current.dialog.setAttribute("aria-modal","true");
   current.dialog.setAttribute("aria-label","Material de Informática");
   global.document.body.appendChild(current.dialog);
   global.document.body.classList.add("bc-info-reader-open");
   global.document.addEventListener("keydown",escapeReader);
   return current.dialog;
 }
 async function open(id,mode){
   mode=mode==="review"?"review":"complete";
   if(!AVAILABLE.has(id))return false;
   if(!current.dialog)current.active=global.document.activeElement;
   const dialog=ensureDialog();current.id=id;current.mode=mode;
   dialog.innerHTML='<div class="bc-info-reader-loading" role="status">Carregando conteúdo teórico… <button type="button" data-bc-info-close>Voltar</button></div>';
   dialog.querySelector("button")?.addEventListener("click",closeReader);
   try{
     const data=await load(id);
     if(current.id!==id || current.mode!==mode || !current.dialog)return false;
     if(!Array.isArray(chapters(data,mode))||!chapters(data,mode).length)throw new Error(mode==="complete"?"Teoria completa exclusiva do Base Completa Premium. A versão de revisão permanece disponível.":"Conteúdo em elaboração.");
     renderDialog(data,mode);dialog.scrollTop=0;dialog.querySelector(".bc-info-reader-close")?.focus();
   }catch(err){
     if(current.dialog){
       current.dialog.innerHTML='<div class="bc-info-reader-loading" role="alert"><strong>Não foi possível abrir a leitura.</strong><p>'+esc(err.message)+'</p><button type="button" data-bc-info-close>Voltar</button></div>';
       current.dialog.querySelector("button")?.addEventListener("click",closeReader);
     }
   }
   return false;
 }
 const previousRender=global.renderSubjects;
 global.renderSubjects=function(){const result=previousRender.apply(this,arguments);updateModuleRows();return result};
 const previousGrid=global.renderDisciplineGrid;
 if(typeof previousGrid==="function")global.renderDisciplineGrid=function(){const result=previousGrid.apply(this,arguments);
   const card=$('#disciplineGrid .disc-card[data-id="info"]');
   const desc=card?.querySelector("small");
   if(desc)desc.textContent=AVAILABLE.size+" módulos com teoria e revisão · questões em construção";
   return result;
 };
 global.BaseInformaticaReader=Object.freeze({open,close:closeReader,available:()=>Array.from(AVAILABLE),load});
 updateModuleRows();
})(window);
