/* Base Completa — leitor de apostilas do TRT-8 Técnico (sem modificar o progresso do edital). */
(function(global){
'use strict';
if (global.TRT8TechTopicContent) return;
const data=global.TRT8TechManagementLessons;
if (!data || !Array.isArray(data.lessons)) return;
const chapters=new Map(data.lessons.map(x=>[x.topicId,x]));
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let current=null,previousFocus=null;
function block(title,text,clazz=''){
 return '<section class="tt-reader-card '+clazz+'"><h3>'+esc(title)+'</h3>'+
 (Array.isArray(text)?text.map(x=>'<p>'+esc(x)+'</p>').join(''):'<p>'+esc(text)+'</p>')+'</section>';
}
function items(title,lines,cls=''){
 return '<section class="tt-reader-card '+cls+'"><h3>'+esc(title)+'</h3><ul>'+
 lines.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul></section>';
}
function quiz(lesson){
 return '<section id="tt-questions" class="tt-reader-questions"><h2>Questões internas comentadas</h2>'+
 lesson.questions.map((q,i)=>'<article class="tt-reader-question" data-tt-question="'+i+'"><h3>Questão '+(i+1)+'</h3><p>'+esc(q.stem)+'</p><div class="tt-reader-alternatives">'+
 q.options.map((option,index)=>'<button type="button" class="tt-reader-answer" data-tt-answer="'+index+'" aria-label="Alternativa '+String.fromCharCode(65+index)+'">'+String.fromCharCode(65+index)+') '+esc(option)+'</button>').join('')+
 '</div><p class="tt-reader-feedback" aria-live="polite" hidden></p></article>').join('')+'</section>';
}
function checklist(lesson){
 return '<section class="tt-reader-card tt-reader-checklist" id="tt-checklist"><h3>Checklist de aprendizagem</h3><p>Marque para conferir o que já dominou nesta leitura. Seu progresso permanente é registrado nas marcações do Edital Verticalizado.</p>'+
 lesson.checklist.map((x,i)=>'<label><input type="checkbox" data-tt-check="'+i+'"><span>'+esc(x)+'</span></label>').join('')+
 '<output id="tt-check-progress" aria-live="polite">0/'+lesson.checklist.length+' itens conferidos</output></section>';
}
function header(lesson){
 return '<header class="tt-reader-header"><div class="tt-reader-meta">BASE COMPLETA · TRT-8 2026 · TÉCNICO</div>'+
 '<button type="button" class="tt-reader-close" data-tt-close aria-label="Voltar ao edital">← Voltar ao edital</button>'+
 '<p class="tt-reader-eyebrow">NOÇÕES DE ADMINISTRAÇÃO PÚBLICA · ASSUNTO '+String(lesson.number).padStart(2,'0')+' / 13</p>'+
 '<h1 id="tt-reader-title">'+esc(lesson.title)+'</h1><p>'+esc(lesson.goal)+'</p>'+
 '<p class="tt-reader-review-status">Material didático produzido · revisão editorial pendente</p></header>';
}
function sources(){
 return '<section class="tt-reader-sources"><h2>Fontes de apoio e conferência</h2><p>Referências conceituais. Leis e decretos indicados têm seus próprios âmbitos de aplicação.</p><ul>'+
 data.sources.map(s=>'<li><a target="_blank" rel="noopener noreferrer" href="'+esc(s.url)+'">'+esc(s.label)+'</a> — '+esc(s.scope)+'</li>').join('')+'</ul></section>';
}
function page(lesson){
 return '<main class="tt-reader-panel" role="dialog" aria-modal="true" aria-labelledby="tt-reader-title">'+header(lesson)+
 '<nav class="tt-reader-nav" aria-label="Seções da apostila"><a href="#tt-complete">Teoria completa</a><a href="#tt-summary">Revisão</a><a href="#tt-questions">Questões comentadas</a><a href="#tt-checklist">Checklist</a></nav>'+
 '<div class="tt-reader-body"><section id="tt-complete" class="tt-reader-section"><h2>Teoria completa: entender antes de decorar</h2>'+
 block('Primeira leitura — do zero',lesson.complete.firstRead)+
 block('Como o assunto funciona',lesson.complete.howItWorks)+
 block('Exemplo guiado no cotidiano do tribunal',lesson.complete.workedExample,'tt-reader-example')+
 block('Aprofundamento para prova',lesson.complete.advanced)+'</section>'+
 '<section id="tt-summary" class="tt-reader-section"><h2>Revisão rápida e ativa</h2>'+
 items('O que você precisa recuperar da memória',lesson.summary)+
 items('Pegadinhas frequentes',lesson.examTraps,'tt-reader-traps')+'</section>'+
 quiz(lesson)+checklist(lesson)+sources()+'</div>'+
 '<footer class="tt-reader-footer"><button type="button" data-tt-close>Voltar ao Edital Verticalizado</button><p>Se marcou um assunto como estudado, registre-o no próprio edital para sincronizar entre dispositivos.</p></footer></main>';
}
function feedback(event){
 const button=event.target.closest('[data-tt-answer]');if(!button)return;
 const article=button.closest('[data-tt-question]');const q=current?.questions[Number(article?.dataset.ttQuestion)];if(!q)return;
 const choice=Number(button.dataset.ttAnswer);
 article.querySelectorAll('[data-tt-answer]').forEach(el=>{el.setAttribute('aria-pressed',el===button?'true':'false');el.classList.toggle('tt-reader-correct',Number(el.dataset.ttAnswer)===q.correct);el.classList.toggle('tt-reader-wrong',el===button&&choice!==q.correct);});
 const el=article.querySelector('.tt-reader-feedback');
 el.hidden=false;el.textContent=(choice===q.correct?'Correto. ':'Revise este ponto. ')+q.commentary;
}
function markCheck(event){
 if(!event.target.matches('[data-tt-check]'))return;
 const list=event.target.closest('.tt-reader-checklist');
 const total=list.querySelectorAll('[data-tt-check]').length;
 const done=list.querySelectorAll('[data-tt-check]:checked').length;
 list.querySelector('#tt-check-progress').textContent=done+'/'+total+' itens conferidos';
}
function dismiss(){
 const root=document.getElementById('tt-tech-reader');
 if(root)root.remove();document.documentElement.classList.remove('tt-reader-open');
 current=null;
 if(previousFocus?.isConnected)previousFocus.focus();
 previousFocus=null;
}
function open(topicId){
 const lesson=chapters.get(String(topicId));if(!lesson)return false;
 dismiss();previousFocus=document.activeElement;current=lesson;
 const overlay=document.createElement('div');overlay.id='tt-tech-reader';overlay.className='tt-reader-backdrop';
 overlay.innerHTML=page(lesson);
 document.body.appendChild(overlay);
 document.documentElement.classList.add('tt-reader-open');
 overlay.addEventListener('click',event=>{
 if(event.target===overlay||event.target.closest('[data-tt-close]')){dismiss();return}
 feedback(event);
 });
 overlay.addEventListener('change',markCheck);
 const nav=overlay.querySelector('.tt-reader-nav');
 nav.addEventListener('click',event=>{const href=event.target.closest('a')?.getAttribute('href');if(href&&href.startsWith('#')){event.preventDefault();overlay.querySelector(href)?.scrollIntoView({block:'start',behavior:'smooth'});}});
 overlay.querySelector('[data-tt-close]')?.focus();
 return true;
}
document.addEventListener('keydown',event=>{
 if(!current)return;
 if(event.key==='Escape'){event.preventDefault();dismiss();}
 // Keep keyboard focus inside the modal without blocking access to screen-reader controls.
 if(event.key==='Tab'){
  const root=document.getElementById('tt-tech-reader');
  const focusable=[...root.querySelectorAll('button,a[href],input:not([disabled])')].filter(el=>el.getClientRects().length||el.offsetParent!==null);
  if(focusable.length){const first=focusable[0],last=focusable[focusable.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}
 }
});
global.TRT8TechTopicContent={has:id=>chapters.has(String(id)),open,close:dismiss,getLesson:id=>chapters.get(String(id))||null,count:chapters.size};
})(window);
