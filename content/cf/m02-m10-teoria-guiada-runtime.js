/* Base Completa — CF M02–M10: leitor didático experimental sem cabeçalho; conteúdos nativos e progresso intactos. */
(function(global){
'use strict';
if(global.__BC_CF_GUIDED_2_10__)return;
global.__BC_CF_GUIDED_2_10__=true;
const MIN=2,MAX=10,DATA=global.BC_CF_GUIDED_MODULES||{};
let overlay=null,origin=null,originalOverflow='',scheduled=false;
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));}
function p(v){return String(v||'').split(/\n\n+/).map(s=>'<p>'+esc(s)+'</p>').join('');}
function get(n){return DATA[n];}
function key(n){return 'bc:cf:m'+String(n).padStart(2,'0')+':teoria-guiada:checklist:v1';}
function state(n){try{const x=JSON.parse(localStorage.getItem(key(n))||'{}');return x&&typeof x==='object'?x:{};}catch(_){return {};}}
function save(n,i,on){const x=state(n);x[i]=on;try{localStorage.setItem(key(n),JSON.stringify(x));}catch(_){}}
function card(topic,index){
  const sections=[
    ['bc-m01-foundation','Entenda',topic[1]],
    ['bc-m01-example','Na prática',topic[2]],
    ['bc-m01-law','Regra e fundamento',topic[3]],
    ['bc-m01-deeper','Aprofundamento',topic[4]],
    ['bc-m01-trap','Pegadinha de prova',topic[5]],
    ['bc-m01-recall','Revisão em 30 segundos',topic[6]]
  ];
  return '<section class="bc-m01-topic" aria-labelledby="bc-guided-title-'+index+'"><h2 id="bc-guided-title-'+index+'"><span>'+String(index+1).padStart(2,'0')+'</span> '+esc(topic[0])+'</h2>'+
    sections.map(s=>'<div class="bc-m01-card '+s[0]+'"><h3>'+esc(s[1])+'</h3>'+p(s[2])+'</div>').join('')+'</section>';
}
function checklist(n,topics){
 const s=state(n);
 return '<section class="bc-m01-checklist" aria-label="Checklist de compreensão"><h2>Checklist de compreensão</h2><p>Marque apenas os assuntos que você já consegue explicar com suas palavras.</p>'+
  topics.map((topic,i)=>'<label><input type="checkbox" data-bc-guided-check="'+i+'" '+(s[i]?'checked':'')+'><span>'+esc(topic[7])+'</span></label>').join('')+
  '<p class="bc-m01-local-note">Checklist experimental salvo somente neste navegador, sem modificar o progresso oficial do módulo.</p></section>';
}
function keydown(e){
 if(e.key==='Escape'){close();return;}
 if(e.key!=='Tab'||!overlay)return;
 const tabs=Array.from(overlay.querySelectorAll('button:not(:disabled),input:not(:disabled)'));
 if(!tabs.length)return;
 const a=tabs[0],z=tabs[tabs.length-1];
 if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus();}
 else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus();}
}
function close(){
 if(!overlay)return;
 document.removeEventListener('keydown',keydown);
 overlay.remove();overlay=null;document.body.style.overflow=originalOverflow;
 if(origin&&origin.isConnected)origin.focus();
}
function switchMode(mode){
 if(!overlay)return;
 overlay.querySelector('.bc-m01-reader').dataset.view=mode;
 overlay.querySelectorAll('[data-bc-guided-mode]').forEach(btn=>{
  const on=btn.getAttribute('data-bc-guided-mode')===mode;
  btn.classList.toggle('active',on);btn.setAttribute('aria-pressed',on?'true':'false');
 });
 const sc=overlay.querySelector('.bc-m01-scroll');if(sc)sc.scrollTop=0;
}
function open(n){
 n=Number(n);
 const d=get(n);if(!d||n<MIN||n>MAX||!Array.isArray(d.topics))return false;
 close();origin=document.activeElement;originalOverflow=document.body.style.overflow;
 const o=document.createElement('div');
 o.className='bc-m01-overlay bc-guided-overlay';
 o.setAttribute('role','dialog');o.setAttribute('aria-modal','true');
 o.setAttribute('aria-label','Teoria guiada experimental de Direito Constitucional, módulo '+n);
 o.innerHTML='<div class="bc-m01-reader" data-view="study">'+
  '<nav class="bc-m01-toolbar" aria-label="Controles de leitura">'+
   '<button type="button" data-bc-guided-close>← Voltar</button>'+
   '<div class="bc-m01-modes" role="group" aria-label="Modo de leitura">'+
    '<button type="button" data-bc-guided-mode="study" class="active" aria-pressed="true">Primeira leitura</button>'+
    '<button type="button" data-bc-guided-mode="review" aria-pressed="false">Revisão rápida</button>'+
   '</div></nav>'+
  '<main class="bc-m01-scroll" tabindex="0"><div class="bc-m01-paper">'+
  d.topics.map(card).join('')+checklist(n,d.topics)+'</div></main></div>';
 overlay=o;document.body.appendChild(o);document.body.style.overflow='hidden';
 o.querySelector('[data-bc-guided-close]').addEventListener('click',close);
 o.querySelectorAll('[data-bc-guided-mode]').forEach(btn=>btn.addEventListener('click',()=>switchMode(btn.getAttribute('data-bc-guided-mode'))));
 o.querySelectorAll('[data-bc-guided-check]').forEach(input=>input.addEventListener('change',()=>save(n,input.getAttribute('data-bc-guided-check'),input.checked)));
 document.addEventListener('keydown',keydown);
 o.querySelector('[data-bc-guided-close]').focus();
 return true;
}
function mount(){
 for(let n=MIN;n<=MAX;n++){
  if(!get(n))continue;
  const body=document.querySelector('.cf-module[data-cf="w'+n+'"] .cf-study-review .cf-study-actions');
  if(!body||body.querySelector('[data-bc-guided-launch]'))continue;
  const button=document.createElement('button');
  button.type='button';button.className='bc-m01-pilot-launch';
  button.setAttribute('data-bc-guided-launch',String(n));
  button.textContent='Nova teoria guiada · testar';
  button.setAttribute('aria-label','Abrir nova teoria guiada experimental do módulo '+n);
  button.addEventListener('click',()=>open(n));
  body.appendChild(button);
 }
}
function schedule(){
 if(scheduled)return;scheduled=true;
 requestAnimationFrame(()=>{scheduled=false;mount();});
}
function styles(){
 if(document.getElementById('bc-guided-2-10-css'))return;
 const el=document.createElement('style');
 el.id='bc-guided-2-5-css';
 el.textContent=[
 '.cf-module[data-cf="w2"] .cf-study-actions .bc-m01-pilot-launch,.cf-module[data-cf="w3"] .cf-study-actions .bc-m01-pilot-launch,.cf-module[data-cf="w4"] .cf-study-actions .bc-m01-pilot-launch,.cf-module[data-cf="w5"] .cf-study-actions .bc-m01-pilot-launch,.cf-module[data-cf="w6"] .cf-study-actions .bc-m01-pilot-launch,.cf-module[data-cf="w7"] .cf-study-actions .bc-m01-pilot-launch,.cf-module[data-cf="w8"] .cf-study-actions .bc-m01-pilot-launch,.cf-module[data-cf="w9"] .cf-study-actions .bc-m01-pilot-launch,.cf-module[data-cf="w10"] .cf-study-actions .bc-m01-pilot-launch{border:1px solid #94b3d3!important;background:#f0f6fc!important;color:#1b527f!important;box-shadow:none!important;min-height:40px!important;font-size:12px!important;}',
 '.bc-guided-overlay .bc-m01-toolbar{background:#fff;}',
 '.bc-guided-overlay .bc-m01-paper>.bc-m01-topic:first-child{margin-top:0;}'
 ].join('\n');
 document.head.appendChild(el);
}
styles();
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
document.addEventListener('click',schedule,true);
const observer=new MutationObserver(schedule);
observer.observe(document.body||document.documentElement,{subtree:true,childList:true});
global.BcCfGuidedPilot=Object.freeze({open,close,modules:[2,3,4,5,6,7,8,9,10]});
})(window);
