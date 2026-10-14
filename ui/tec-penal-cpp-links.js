/* Apenas Penal e Processo Penal; não altera estado de estudo. */
(function(g){
'use strict';
const data=g.TEC_PENAL_CPP_LINKS;
if(!data)return;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const approved=r=>['VALIDADO_NA_CONTA_CRIADORA','REUTILIZADO'].includes(r.status)&&!!r.id&&r.quantity>0&&/^https:\/\/www\.tecconcursos\.com\.br\/s\/[A-Za-z0-9]+$/.test(r.url||'');
function markup(d,code){
 const rows=data.records.filter(r=>r.discipline===d&&r.module===code),note=data.notes[d]?.[code];
 const actions=rows.filter(approved).map(r=>'<a class="tec-validated-button" data-tec-validated-link="'+esc(r.id)+'" data-tec-part="'+esc(r.part||'')+'" href="'+esc(r.url)+'" target="_blank" rel="noopener noreferrer"><b>'+esc(r.subtitle)+'</b><span>'+r.quantity+' '+(r.quantity===1?'questão':'questões')+'</span></a>'+(r.shared?'<small class="tec-validated-note">Filtro compartilhado entre M13 e M14.</small>':'')).join('');
 return '<section class="tec-validated-panel" data-tec-validated-panel="'+d+':'+code+'" aria-label="Questões TEC '+esc(code)+'"><header><b>TEC Concursos</b><small>'+(code==='GERAL'?'Caderno existente · cobertura específica':'Questões do módulo')+'</small></header><div class="tec-validated-actions">'+actions+'</div>'+(note?'<p class="tec-validated-note">'+esc(note)+'</p>':'')+(code==='GERAL'?'<p class="tec-validated-note">Este caderno cobre o recorte registrado; não é um geral completo da disciplina.</p>':'')+'</section>';
}
function mount(host,d,code){if(!host||host.querySelector('[data-tec-validated-panel="'+d+':'+code+'"]'))return;const holder=document.createElement('div');holder.innerHTML=markup(d,code);host.appendChild(holder.firstElementChild);}
function refresh(){
 for(const d of ['penal','cpp']){
  const subject=document.querySelector('#subjects .subject[data-id="'+d+'"]');if(!subject)continue;
  const selector=d==='penal'?'.cf-module[data-cf]':'[data-cpp-native-module]';
  const modules=subject.querySelectorAll(selector);if(!modules.length)continue;
  modules.forEach(m=>{const raw=d==='penal'?m.getAttribute('data-cf'):m.getAttribute('data-cpp-native-module'),n=Number(String(raw).replace(/^p/,''));if(!n)return;mount(m.querySelector(d==='penal'?'.cf-module-body':'.detail-panel'),d,'M'+String(n).padStart(2,'0'));});
  mount(subject.querySelector('.subject-body'),d,'GERAL');
 }
}
let queued=false;
const schedule=()=>{if(queued)return;queued=true;g.requestAnimationFrame(()=>{queued=false;refresh();});};
g.TecPenalCppLinks={markup,refresh,approved};
new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener('central:discipline-ready',schedule);
refresh();
})(window);
