(function(){
'use strict';
if(window.__CENTRAL_MODULE_STANDARD_V1__)return;
window.__CENTRAL_MODULE_STANDARD_V1__=true;
var NOTE_PREFIX='central-v6:module-standard-notes:v1:';
var MODULES='.topic-item[data-uid],.cf-module[data-cf],.cf-module[data-ptn-module],.cpp-mod[data-cpp-num],[data-civil-analista],.civil-module[data-civil]';

function esc(v){return String(v==null?'':v).replace(/[&<>\"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]})}
function safeId(v){return String(v||'module').replace(/[^a-zA-Z0-9_-]/g,'-')}
function moduleId(el){var value=el.getAttribute('data-uid')||el.getAttribute('data-cf')||el.getAttribute('data-ptn-module')||el.getAttribute('data-civil-analista')||el.getAttribute('data-civil');if(value)return value;var cpp=el.getAttribute('data-cpp-num');if(cpp)return 'cpp-'+cpp;return 'module-'+Array.prototype.indexOf.call(document.querySelectorAll(MODULES),el)}
function bodyFor(el){
 if(el.matches('.topic-item'))return el.querySelector('.detail-panel');
 return el.querySelector('.cf-module-body,.cpp-mod-body,.civil-module-body')||el;
}
function hasStagePanel(body){return !!body.querySelector('.csp-panel,.cms-progress')}
function progressValue(el){
 var n=el.querySelector('.cpp-mpct,.cf-module-stat,[data-ptn-stat],.civil-pct');
 if(n){var m=String(n.textContent||'').match(/(\d{1,3})\s*%/);if(m)return Math.max(0,Math.min(100,Number(m[1])))}
 var check=el.querySelector('.topic-row input[type="checkbox"]');
 if(check)return check.checked?100:0;
 return 0;
}
function checkCounts(el,kind){
 var boxes=Array.from(el.querySelectorAll('input[type="checkbox"]'));
 var picked=boxes.filter(function(input){var label=input.closest('label');var txt=(label&&label.textContent)||input.parentElement&&input.parentElement.textContent||'';return kind.test(txt)});
 return picked.length?{done:picked.filter(function(x){return x.checked}).length,total:picked.length,known:true}:{done:0,total:0,known:false};
}
function readCounts(el){
 var p=el.querySelectorAll('.csp-topic-read button'),sessions=el.querySelectorAll('[data-ptn-done]'),reading=checkCounts(el,/leitura|li e concluí esta sessão/i);
 if(p.length)return {done:Array.from(p).filter(function(x){return x.classList.contains('done')}).length,total:p.length,known:true};
 if(sessions.length)return {done:Array.from(sessions).filter(function(x){return x.checked}).length,total:sessions.length,known:true};
 if(reading.known)return reading;
 return {done:0,total:0,known:false};
}
function decorandoCounts(el){var x=checkCounts(el,/decorando|lei seca/i);return x.known?x:{done:0,total:0,known:false}}
function roundCounts(el){
 var rows=Array.from(el.querySelectorAll('.cpp-round,.csp-tec-row,.hist'));
 var done=rows.filter(function(row){var inputs=row.querySelectorAll('input[type="number"]');if(inputs.length)return Array.from(inputs).some(function(x){return String(x.value||'').trim()!==''});return true}).length;
 var total=rows.length;
 var hist=el.querySelector('.history-label');var match=hist&&String(hist.textContent||'').match(/total\s+(\d+)\s+feitas/i);
 return {done:done,total:total,questions:match?Number(match[1]):null};
}
function pct(x){return x&&x.total?Math.round(x.done/x.total*100):0}
function meter(n){return '<div class="cms-meter"><span style="width:'+Math.max(0,Math.min(100,n))+'%"></span></div>'}
function stageCard(title,desc,value,icon){return '<article class="cms-stage"><div><b>'+icon+' '+title+'</b><small>'+desc+'</small></div><strong>'+value+'%</strong>'+meter(value)+'</article>'}
function progressPanel(el,id){
 var reading=readCounts(el),deco=decorandoCounts(el),rounds=roundCounts(el),overall=progressValue(el);
 var readDesc=reading.known?reading.done+'/'+reading.total+' etapas já marcadas':'Mais marcações de leitura serão adicionadas depois';
 var decoDesc=deco.known?deco.done+'/'+deco.total+' itens marcados':'Acesso pelo recurso Lei em Dia do módulo';
 var roundsDesc=rounds.questions!=null?rounds.questions+' questões feitas · '+rounds.done+' rodadas':'Registre e acompanhe as rodadas TEC nos recursos do módulo';
 return '<section class="cms-progress" data-cms-progress="'+esc(id)+'"><div class="cms-progress-head"><div><span>PROGRESSO DE ESTUDO</span><b>'+overall+'% do módulo</b></div><small>Leitura · Lei em Dia · TEC</small></div>'+meter(overall)+'<div class="cms-grid">'+stageCard('Leitura',readDesc,reading.known?pct(reading):0,'📘')+stageCard('Lei em Dia',decoDesc,deco.known?pct(deco):0,'📖')+'<article class="cms-stage cms-round-summary"><div><b>✓ Questões TEC</b><small>'+roundsDesc+'</small></div><strong>'+rounds.done+'</strong>'+meter(rounds.total?100:0)+'</article></div></section>';
}
function notePanel(id){var key=NOTE_PREFIX+id;var value='';try{value=localStorage.getItem(key)||''}catch(_){}return '<section class="cms-note-final" data-cms-note="'+esc(id)+'"><label for="cms-note-'+safeId(id)+'">ANOTAÇÕES DO MÓDULO</label><textarea id="cms-note-'+safeId(id)+'" data-cms-note-input="'+esc(id)+'" placeholder="Regra, artigo, pegadinha ou dúvida...">'+esc(value)+'</textarea><button type="button" data-cms-note-save="'+esc(id)+'">Salvar anotação</button></section>'}
function noteNodes(el){
 var out=[];
 Array.from(el.querySelectorAll('.notes,.cpp-note,.cf-resource-box,.cms-note-final')).forEach(function(node){if(node.querySelector('textarea')&&(/anota|note/i.test(node.textContent||'')||node.matches('.notes,.cpp-note,.cms-note-final')))out.push(node)});
 return out;
}
function normalizeNotes(el,body,id){
 var found=noteNodes(el);
 if(found.length){
  var keep=found[0],textareas=Array.from(keep.querySelectorAll('textarea'));
  found.slice(1).forEach(function(extra){var extraArea=extra.querySelector('textarea');if(extraArea&&textareas[0]){var old=String(textareas[0].value||'').trim(),next=String(extraArea.value||'').trim();if(next&&next!==old)textareas[0].value=old?old+'\n\n'+next:next}extra.remove()});
  var heading=keep.querySelector('label,.resource-label,h4');if(heading&&heading.textContent!=='Anotações do módulo')heading.textContent='Anotações do módulo';
  var resources=keep.closest('details.cf-resources');var summary=resources&&resources.querySelector('summary');if(summary&&summary.textContent!=='Recursos do módulo • TEC/QC e Anki')summary.textContent='Recursos do módulo • TEC/QC e Anki';
  keep.classList.add('cms-note-final');
  if(keep.parentNode!==body||body.lastElementChild!==keep)body.appendChild(keep);
  return;
 }
 body.insertAdjacentHTML('beforeend',notePanel(id));
}
function enhanceModule(el){
 var subject=el.closest('.subject');if(subject&&!subject.classList.contains('open'))return;
 if(el.matches('.topic-item')&&!el.classList.contains('open'))return;
 if((el.matches('.cf-module,.cpp-mod,.civil-module'))&&!el.classList.contains('open'))return;
 if(el.hasAttribute('data-civil-analista')){var civilCard=el.closest('.civil-a-module,.civil-module,[data-civil]')||el;if(!civilCard.classList.contains('open'))return}
 var body=bodyFor(el);if(!body)return;
 var id=moduleId(el);
 if(!hasStagePanel(body))body.insertAdjacentHTML('afterbegin',progressPanel(el,id));
 el.querySelectorAll('.inline-tools button').forEach(function(button){if(/anotar/i.test(button.textContent||''))button.remove()});
 normalizeNotes(el,body,id);
 el.setAttribute('data-cms-standardized','1');
}
function enhance(){
 try{document.querySelectorAll(MODULES).forEach(enhanceModule)}catch(e){console.warn('Padronização dos módulos',e)}
}
var updateScheduled=false;
function scheduleEnhance(){if(updateScheduled)return;updateScheduled=true;requestAnimationFrame(function(){updateScheduled=false;enhance()})}
function installStyle(){
 if(document.getElementById('central-module-standard-style-v1'))return;
 var s=document.createElement('style');s.id='central-module-standard-style-v1';s.textContent='.cms-progress{margin:0 0 13px;padding:12px;border:1px solid rgba(36,199,122,.34);border-radius:12px;background:linear-gradient(180deg,rgba(36,199,122,.07),transparent 90%)}.cms-progress-head{display:flex;justify-content:space-between;align-items:end;gap:10px;margin-bottom:8px}.cms-progress-head span{display:block;color:#45d58e;font-size:8px;font-weight:900;letter-spacing:.08em}.cms-progress-head b{display:block;margin-top:3px;font-size:14px}.cms-progress-head small{font-size:9px;color:var(--muted);text-align:right}.cms-meter{height:6px;margin-top:8px;border-radius:999px;background:var(--panel2);overflow:hidden}.cms-meter span{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#24c77a,#19b6cf)}.cms-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:9px}.cms-stage{min-width:0;padding:10px;border:1px solid var(--line);border-radius:10px;background:var(--panel)}.cms-stage>div:first-child{display:flex;justify-content:space-between;align-items:flex-start;gap:8px}.cms-stage b{display:block;font-size:10px}.cms-stage small{display:block;margin-top:3px;color:var(--muted);font-size:8px;line-height:1.45}.cms-stage strong{color:#20bbca;font-size:13px;white-space:nowrap}.cms-round-summary{grid-column:1/-1}.cms-note-final{display:grid;gap:8px;margin-top:12px;padding:12px;border:1px solid var(--line);border-radius:10px;background:var(--panel)}.cms-note-final>label,.cms-note-final .resource-label,.cms-note-final h4{margin:0;color:var(--text);font-size:10px;font-weight:900}.cms-note-final textarea{width:100%;min-height:92px;box-sizing:border-box;border:1px solid var(--line2);border-radius:8px;background:var(--input);color:var(--text);padding:10px;font:inherit;resize:vertical}.cms-note-final button{justify-self:start;min-height:36px;border:1px solid rgba(25,182,207,.55);border-radius:8px;background:var(--panel2);color:var(--text);padding:7px 12px;font-weight:800;cursor:pointer}@media(max-width:760px){.cms-progress{padding:10px}.cms-grid{grid-template-columns:1fr}.cms-round-summary{grid-column:auto}.cms-progress-head{align-items:flex-start}.cms-progress-head small{text-align:left}}';document.head.appendChild(s);
}
document.addEventListener('click',function(e){var button=e.target&&e.target.closest&&e.target.closest('[data-cms-note-save]');if(!button)return;var id=button.getAttribute('data-cms-note-save'),area=Array.from(document.querySelectorAll('[data-cms-note-input]')).find(function(x){return x.getAttribute('data-cms-note-input')===id});if(!area)return;try{localStorage.setItem(NOTE_PREFIX+id,area.value.trim())}catch(err){console.warn('Anotação não salva',err)}button.textContent='Anotação salva';setTimeout(function(){if(button.isConnected)button.textContent='Salvar anotação'},1300)});
installStyle();
document.addEventListener('click',scheduleEnhance,true);
if(typeof window.renderSubjects==='function'){
 var originalRenderSubjects=window.renderSubjects;
 window.renderSubjects=function(){var r=originalRenderSubjects.apply(this,arguments);enhance();return r};
}
if(window.CppCourseV1&&typeof window.CppCourseV1.render==='function'){
 var api=window.CppCourseV1,originalRender=api.render;api.render=function(){var r=originalRender.apply(api,arguments);enhance();return r};
}
enhance();
var observer=new MutationObserver(function(){scheduleEnhance()});
try{observer.observe(document.documentElement,{childList:true,subtree:true})}catch(_){}
})();
