/* Base Completa — CIVIL M01–M15: leitor guiado isolado, sem cabeçalho institucional. */
(function(global){
'use strict';
if(global.__BC_CIV_GUIDED_READER_V1__)return;
global.__BC_CIV_GUIDED_READER_V1__=true;
const MIN=1,MAX=15,DATA=global.BC_CIV_GUIDED_MODULES||{};
let overlay=null,origin=null,originalOverflow='';
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));}
function p(v){return String(v||'').split(/\n\n+/).map(s=>'<p>'+esc(s)+'</p>').join('');}
function get(n){return DATA[n];}
function key(n){return 'bc:civil:m'+String(n).padStart(2,'0')+':teoria-guiada:checklist:v1';}
function state(n){try{const x=JSON.parse(localStorage.getItem(key(n))||'{}');return x&&typeof x==='object'?x:{};}catch(_){return {};}}
function save(n,i,on){const x=state(n);x[i]=on;try{localStorage.setItem(key(n),JSON.stringify(x));}catch(_){}}
function lawBox(n,index){
 const L=global.BC_CIV_GUIDED_LAW&&global.BC_CIV_GUIDED_LAW[n],items=L&&L[index];
 if(!Array.isArray(items)||!items.length)return '';
 const names=items.map(x=>x[0]),head=names.length===1?names[0]:names[0]+' e mais '+(names.length-1);
 return '<details class="bc-m01-lei-seca"><summary>Ver lei seca — '+esc(head)+'</summary>'+items.map(x=>'<p class="bc-m01-lei-ref"><strong>'+esc(x[0])+'</strong></p>'+(x[1]||[]).map(t=>'<p>'+esc(t)+'</p>').join('')).join('')+'</details>';
}
function card(topic,index,n){
  const sections=[
    ['bc-m01-foundation','Entenda',topic[1]],
    ['bc-m01-example','Na prática',topic[2]],
    ['bc-m01-law','Regra e fundamento',topic[3]],
    ['bc-m01-deeper','Aprofundamento',topic[4]],
    ['bc-m01-trap','Pegadinha de prova',topic[5]],
    ['bc-m01-recall','Revisão em 30 segundos',topic[6]]
  ];
  return '<section class="bc-m01-topic" aria-labelledby="bc-guided-title-'+index+'"><h2 id="bc-guided-title-'+index+'"><span>'+String(index+1).padStart(2,'0')+'</span> '+esc(topic[0])+'</h2>'+
    sections.map(s=>'<div class="bc-m01-card '+s[0]+'"><h3>'+esc(s[1])+'</h3>'+p(s[2])+(s[0]==='bc-m01-law'?lawBox(n,index):'')+'</div>').join('')+'</section>';
}
function checklist(n,topics){
 const s=state(n);
 return '<section class="bc-m01-checklist" aria-label="Checklist de compreensão"><h2>Checklist de compreensão</h2><p>Marque apenas os assuntos que você já consegue explicar com suas palavras.</p>'+
  topics.map((topic,i)=>'<label><input type="checkbox" data-bc-guided-check="'+i+'" '+(s[i]?'checked':'')+'><span>'+esc(topic[7])+'</span></label>').join('')+
  '<p class="bc-m01-local-note">Checklist salvo neste navegador, sem alterar o progresso oficial do módulo.</p></section>';
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
 o.setAttribute('aria-label','Teoria guiada de Direito Civil, módulo '+n);
 o.innerHTML='<div class="bc-m01-reader" data-view="study">'+
  '<nav class="bc-m01-toolbar" aria-label="Controles de leitura">'+
   '<button type="button" data-bc-guided-close>← Voltar</button>'+
   '<div class="bc-m01-modes" role="group" aria-label="Modo de leitura">'+
    '<button type="button" data-bc-guided-mode="study" class="active" aria-pressed="true">Primeira leitura</button>'+
    '<button type="button" data-bc-guided-mode="review" aria-pressed="false">Revisão rápida</button>'+
   '</div></nav>'+
  '<main class="bc-m01-scroll" tabindex="0"><div class="bc-m01-paper">'+
  d.topics.map((topic,i)=>card(topic,i,n)).join('')+checklist(n,d.topics)+'</div></main></div>';
 overlay=o;document.body.appendChild(o);document.body.style.overflow='hidden';
 o.querySelector('[data-bc-guided-close]').addEventListener('click',close);
 o.querySelectorAll('[data-bc-guided-mode]').forEach(btn=>btn.addEventListener('click',()=>switchMode(btn.getAttribute('data-bc-guided-mode'))));
 o.querySelectorAll('[data-bc-guided-check]').forEach(input=>input.addEventListener('change',()=>save(n,input.getAttribute('data-bc-guided-check'),input.checked)));
 document.addEventListener('keydown',keydown);
 const scroller=o.querySelector('.bc-m01-scroll');
 let recorded=false;
 scroller.addEventListener('scroll',()=>{
   if(recorded)return;
   const remaining=scroller.scrollHeight-scroller.clientHeight;
   if(remaining>0 && scroller.scrollTop>=remaining*.92){
     recorded=true;
     global.CivilNative?.markGuidedRead?.(n);
   }
 },{passive:true});
 o.querySelector('[data-bc-guided-close]').focus();
 return true;
}
  function css() {
    if(document.getElementById('bc-civil-guided-reader-style-v1'))return;
    const style=document.createElement('style');
    style.id='bc-civil-guided-reader-style-v1';
    style.textContent=[
      '.bc-m01-overlay{position:fixed;inset:0;z-index:2147483000;background:#f0f3f8;color:#172b47;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;}',
      '.bc-m01-reader{width:100%;height:100%;display:flex;flex-direction:column;}',
      '.bc-m01-toolbar{flex:0 0 auto;min-height:54px;padding:8px max(14px,env(safe-area-inset-right));border-bottom:1px solid #dce3eb;background:#fff;display:flex;align-items:center;justify-content:space-between;gap:12px;}',
      '.bc-m01-toolbar button{font:600 13px/1.3 inherit;padding:10px 13px;border-radius:8px;cursor:pointer;border:1px solid #cbd6e2;background:#fff;color:#183653;}',
      '.bc-m01-modes{display:flex;gap:4px;padding:4px;background:#edf2f7;border-radius:10px;}',
      '.bc-m01-modes button{border:0;background:transparent;padding:9px 12px;}',
      '.bc-m01-modes button.active{background:#203b61;color:#fff;}',
      '.bc-m01-toolbar button:focus-visible,.bc-m01-checklist input:focus-visible{outline:3px solid #3988d9;outline-offset:2px;}',
      '.bc-m01-scroll{flex:1;min-height:0;overflow:auto;overscroll-behavior:contain;}',
      '.bc-m01-paper{width:min(780px,calc(100% - 28px));margin:0 auto;padding:28px 0 90px;}',
      '.bc-m01-topic{margin-bottom:38px;}',
      '.bc-m01-topic h2{margin:0 0 14px;font-size:clamp(20px,3vw,26px);font-weight:750;line-height:1.27;letter-spacing:-.018em;color:#1d3657;}',
      '.bc-m01-topic h2 span{font-size:12px;letter-spacing:.04em;color:#67809d;vertical-align:middle;margin-right:5px;}',
      '.bc-m01-card{padding:17px 20px;margin:0 0 10px;border:1px solid #dce3eb;border-radius:12px;background:#fff;box-shadow:0 1px 2px rgba(20,38,63,.02);}',
      '.bc-m01-card h3{margin:0 0 9px;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.075em;color:#385b80;}',
      '.bc-m01-card p{margin:0;font-size:16px;line-height:1.75;color:#27384e;}.bc-m01-lei-seca{margin:12px 0 0;border:1px dashed #d8c8a8;border-radius:10px;padding:8px 12px;background:rgba(255,255,255,.6);}.bc-m01-lei-seca summary{cursor:pointer;font-size:13px;font-weight:700;color:#7a5a24;}.bc-m01-lei-seca p{margin:8px 0 0;font-size:14px;line-height:1.6;}.bc-m01-lei-seca .bc-m01-lei-ref{margin-top:12px;}',
      '.bc-m01-card p+p{margin-top:10px;}',
      '.bc-m01-example{background:#edf8f2;border-left:4px solid #438b68;}',
      '.bc-m01-law{background:#fffaf0;border-left:4px solid #be9152;}',
      '.bc-m01-deeper{background:#f1f6fc;border-left:4px solid #6c87b2;}',
      '.bc-m01-trap{background:#fff8e3;border-left:4px solid #d5a62e;}',
      '.bc-m01-recall{background:#203b61;border-color:#203b61;}',
      '.bc-m01-recall h3,.bc-m01-recall p{color:#fff;}',
      '.bc-m01-reader[data-view="review"] .bc-m01-foundation,.bc-m01-reader[data-view="review"] .bc-m01-example,.bc-m01-reader[data-view="review"] .bc-m01-deeper{display:none;}',
      '.bc-m01-checklist{border-top:1px solid #d7e1eb;padding:22px 0;}',
      '.bc-m01-checklist h2{margin:0 0 8px;font-size:22px;color:#1d3657;}',
      '.bc-m01-checklist>p{font-size:14px;color:#5b6d82;line-height:1.5;}',
      '.bc-m01-checklist label{display:flex;align-items:flex-start;gap:12px;margin:7px 0;padding:12px 14px;background:#fff;border:1px solid #dce3eb;border-radius:10px;font-size:14px;line-height:1.4;cursor:pointer;}',
      '.bc-m01-checklist input{margin-top:2px;width:18px;height:18px;accent-color:#203b61;}',
      '.bc-m01-checklist .bc-m01-local-note{font-size:12px;color:#65788d;}',
      '@media(max-width:600px){.bc-m01-toolbar{gap:5px;padding:8px}.bc-m01-toolbar button{font-size:12px;padding:9px}.bc-m01-modes button{padding:8px 6px}.bc-m01-paper{padding-top:18px;width:calc(100% - 22px)}.bc-m01-card{padding:14px 15px}.bc-m01-card p{font-size:15px;line-height:1.7}.bc-m01-topic{margin-bottom:30px}}',
      '@media(prefers-reduced-motion:reduce){.bc-m01-scroll{scroll-behavior:auto}}'
    ].join('\n');
    document.head.appendChild(style);
  }

css();
global.BcCivilGuidedReader=Object.freeze({open,close,modules:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]});
})(window);
