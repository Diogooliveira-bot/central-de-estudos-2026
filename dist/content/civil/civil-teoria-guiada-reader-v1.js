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
 return '<details class="bc-m01-lei-seca"><summary>Ver lei seca — '+esc(head)+'</summary>'+items.map(x=>'<div class="bc-m01-lei-art">'+(x[1]||[]).map(t=>'<p>'+esc(t)+'</p>').join('')+'</div>').join('')+'</details>';
}

/* A edição teórica de novembro/2026 substitui o leitor anterior de cartões.
 * Texto fiel aos tópicos usados nas apostilas M01–M15; não toca em questões ou teoria integral. */
function card(topic,index,n){
 const name=esc(topic[0]),num=String(index+1).padStart(2,'0');
 const explain='<div class="bc-apostila-prose">'+p(topic[1])+(topic[4]?p(topic[4]):'')+'</div>';
 const example=topic[2]?'<p class="bc-apostila-example"><strong>Exemplo prático.</strong> '+esc(topic[2])+'</p>':'';
 const law=topic[3]?'<p class="bc-apostila-law"><strong>Base legal.</strong> '+esc(topic[3])+'</p>':'';
 const warning=topic[5]&&(index%4===1||index%4===2)?'<p class="bc-apostila-alert"><strong>Atenção.</strong> '+esc(topic[5])+'</p>':'';
 return '<section class="bc-m01-topic bc-apostila-topic" aria-labelledby="bc-guided-title-'+n+'-'+index+'"><h2 id="bc-guided-title-'+n+'-'+index+'"><span>'+num+'</span> '+name+'</h2>'+explain+example+law+lawBox(n,index)+warning+'</section>';
}
function apostilaInicio(d,n){
 const first=d.topics&&d.topics[0]||[],title=esc(d.title||'Módulo '+n),name='Direito Civil';
 const basis=d.base?'Base normativa: '+esc(d.base):'';
 const lead=first[2]?'Imagine o seguinte: '+esc(first[2]):'Leia o problema, identifique a regra e acompanhe sua aplicação prática.';
 return '<header class="bc-apostila-hero"><p class="bc-apostila-overline">BASE COMPLETA &nbsp; / &nbsp; APOSTILA TEÓRICA</p><p class="bc-apostila-mod"> '+name.toUpperCase()+' &nbsp; • &nbsp; MÓDULO '+String(n).padStart(2,'0')+'</p><h1>'+title+'</h1>'+(basis?'<p class="bc-apostila-base">'+basis+'</p>':'')+'<p class="bc-apostila-intro">'+lead+'</p></header><section class="bc-apostila-abertura"><h2>Antes de começar: o raciocínio principal</h2><p>O caminho desta leitura é entender a situação concreta, construir o raciocínio, reconhecer o conceito jurídico e aplicar a regra. Os exemplos e as referências normativas integram a explicação, sem questões ou gabaritos.</p></section>';
}
function apostilaSintese(d,n){
 const topics=d.topics||[],chosen=[0,Math.floor((topics.length-1)/3),Math.floor(2*(topics.length-1)/3),topics.length-1];
 const rows=[...new Set(chosen)].map(i=>topics[i]).filter(Boolean).map(t=>'<li><strong>'+esc(t[0])+'.</strong> '+esc(t[6]||'')+'</li>').join('');
 return '<section class="bc-apostila-sintese" aria-label="Síntese do módulo"><h2>Síntese do módulo</h2><ul>'+rows+'</ul><p>Material teórico de revisão • Novembro de 2026</p></section>';
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
function open(n){
 n=Number(n);
 const d=get(n);if(!d||n<MIN||n>MAX||!Array.isArray(d.topics))return false;
 close();origin=document.activeElement;originalOverflow=document.body.style.overflow;
 const o=document.createElement('div');
 o.className='bc-m01-overlay bc-guided-overlay civil-guided-reading bc-apostila-overlay';
 o.setAttribute('role','dialog');o.setAttribute('aria-modal','true');
 o.setAttribute('aria-label','Teoria guiada de Direito Civil, módulo '+n);
 o.innerHTML='<div class="bc-m01-reader bc-apostila-v20261111">'+
  '<nav class="bc-m01-toolbar" aria-label="Controles de leitura"><button type="button" data-bc-guided-close>← Voltar</button><span class="bc-apostila-toolbar-label">Leitura teórica • M'+String(n).padStart(2,'0')+'</span></nav>'+
  '<main class="bc-m01-scroll" tabindex="0"><article class="bc-m01-paper bc-apostila-paper">'+
  apostilaInicio(d,n)+d.topics.map((topic,i)=>card(topic,i,n)).join('')+apostilaSintese(d,n)+
  '<details class="bc-apostila-checklist"><summary>Minha checagem de compreensão</summary>'+checklist(n,d.topics)+'</details></article></main></div>';
 overlay=o;document.body.appendChild(o);document.body.style.overflow='hidden';
 o.querySelector('[data-bc-guided-close]').addEventListener('click',close);
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
      '.bc-m01-toolbar button:focus-visible,.bc-m01-checklist input:focus-visible{outline:3px solid #3988d9;outline-offset:2px;}',
      '.bc-m01-scroll{flex:1;min-height:0;overflow:auto;overscroll-behavior:contain;}',
      '.bc-m01-paper{width:min(780px,calc(100% - 28px));margin:0 auto;padding:28px 0 90px;}',
      '.bc-m01-topic{margin-bottom:38px;}',
      '.bc-m01-topic h2{margin:0 0 14px;font-size:clamp(20px,3vw,26px);font-weight:750;line-height:1.27;letter-spacing:-.018em;color:#1d3657;}',
      '.bc-m01-topic h2 span{font-size:12px;letter-spacing:.04em;color:#67809d;vertical-align:middle;margin-right:5px;}',
      '.bc-m01-card{padding:17px 20px;margin:0 0 10px;border:1px solid #dce3eb;border-radius:12px;background:#fff;box-shadow:0 1px 2px rgba(20,38,63,.02);}',
      '.bc-m01-card h3{margin:0 0 9px;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.075em;color:#385b80;}',
      '.bc-m01-card p{margin:0;font-size:16px;line-height:1.75;color:#27384e;}.bc-m01-lei-seca{margin:12px 0 0;border:1px dashed #d8c8a8;border-radius:10px;padding:8px 12px;background:rgba(255,255,255,.6);}.bc-m01-lei-seca summary{cursor:pointer;font-size:13px;font-weight:700;color:#7a5a24;}.bc-m01-lei-seca p{margin:8px 0 0;font-size:14px;line-height:1.6;}.bc-m01-lei-seca .bc-m01-lei-art+.bc-m01-lei-art{margin-top:12px;}',
      '.bc-m01-card p+p{margin-top:10px;}',
      '.bc-m01-example{background:#edf8f2;border-left:4px solid #438b68;}',
      '.bc-m01-law{background:#fffaf0;border-left:4px solid #be9152;}',
      '.bc-m01-deeper{background:#f1f6fc;border-left:4px solid #6c87b2;}',
      '.bc-m01-trap{background:#fff8e3;border-left:4px solid #d5a62e;}',
      '.bc-m01-recall{background:#203b61;border-color:#203b61;}',
      '.bc-m01-recall h3,.bc-m01-recall p{color:#fff;}',
      '.bc-m01-checklist{border-top:1px solid #d7e1eb;padding:22px 0;}',
      '.bc-m01-checklist h2{margin:0 0 8px;font-size:22px;color:#1d3657;}',
      '.bc-m01-checklist>p{font-size:14px;color:#5b6d82;line-height:1.5;}',
      '.bc-m01-checklist label{display:flex;align-items:flex-start;gap:12px;margin:7px 0;padding:12px 14px;background:#fff;border:1px solid #dce3eb;border-radius:10px;font-size:14px;line-height:1.4;cursor:pointer;}',
      '.bc-m01-checklist input{margin-top:2px;width:18px;height:18px;accent-color:#203b61;}',
      '.bc-m01-checklist .bc-m01-local-note{font-size:12px;color:#65788d;}',
      '@media(max-width:600px){.bc-m01-toolbar{gap:5px;padding:8px}.bc-m01-toolbar button{font-size:12px;padding:9px}.bc-m01-paper{padding-top:18px;width:calc(100% - 22px)}.bc-m01-card{padding:14px 15px}.bc-m01-card p{font-size:15px;line-height:1.7}.bc-m01-topic{margin-bottom:30px}}',
      '.civil-guided-reading{background:#fff;}.civil-guided-reading .bc-m01-card{border:0;border-radius:0;box-shadow:none;background:none;padding:0;margin:0 0 14px;}.civil-guided-reading .bc-m01-card h3{color:#385b80;}.civil-guided-reading .bc-m01-card p{color:#27384e;}.civil-guided-reading .bc-m01-topic{border-top:1px solid #dbe5ed;padding-top:25px;margin-bottom:45px;}.civil-guided-reading .bc-m01-lei-seca{border:0;border-left:3px solid #89b3d0;border-radius:0;background:none;padding:4px 0 4px 18px;}.civil-guided-reading .bc-m01-lei-seca summary{color:#3377a4;}.civil-guided-reading .bc-m01-checklist label{border:0;border-bottom:1px solid #dbe5ed;border-radius:0;padding:12px 0;}',
      '@media(prefers-reduced-motion:reduce){.bc-m01-scroll{scroll-behavior:auto}}'
    ].join('\n');
    style.textContent += '\n' + "\n.bc-m01-overlay .bc-apostila-v20261111{background:#fff;color:#1b2e47}\n.bc-apostila-v20261111 .bc-m01-toolbar{background:#fff;border-bottom:1px solid #dce8f1;min-height:58px;}\n.bc-apostila-v20261111 .bc-m01-paper.bc-apostila-paper{width:min(820px,calc(100% - 36px));padding:34px 0 92px}\n.bc-apostila-v20261111 .bc-apostila-toolbar-label{font:600 12px/1.3 system-ui,sans-serif;color:#7188a2}\n.bc-apostila-v20261111 .bc-apostila-hero{padding-bottom:24px;border-bottom:2px solid #d4e5f2;margin-bottom:28px}\n.bc-apostila-v20261111 .bc-apostila-overline{font-size:11px;color:#6a829b;font-weight:650;letter-spacing:.09em;margin:0 0 17px}\n.bc-apostila-v20261111 .bc-apostila-mod{font-size:11px;font-weight:750;letter-spacing:.08em;color:#326c95;margin:0 0 9px}\n.bc-apostila-v20261111 h1{font-size:clamp(24px,3.6vw,33px);color:#183653;letter-spacing:-.025em;line-height:1.16;margin:0 0 12px}\n.bc-apostila-v20261111 .bc-apostila-base{font-size:13px;color:#627890;margin:0 0 18px}\n.bc-apostila-v20261111 .bc-apostila-intro{font-size:16px;line-height:1.72;color:#304864;margin:0}\n.bc-apostila-v20261111 .bc-apostila-abertura{margin:0 0 28px}\n.bc-apostila-v20261111 .bc-apostila-abertura h2{font-size:18px;line-height:1.3;color:#1e446c;margin:0 0 10px}\n.bc-apostila-v20261111 .bc-apostila-abertura p{font-size:15.5px;line-height:1.8;margin:0;color:#30465f}\n.bc-apostila-v20261111 .bc-m01-topic.bc-apostila-topic{padding:23px 0 12px;border-top:1px solid #dce6ee;margin:0 0 10px}\n.bc-apostila-v20261111 .bc-apostila-topic h2{font-size:clamp(19px,2.7vw,22px);line-height:1.3;margin:0 0 13px;font-weight:750}\n.bc-apostila-v20261111 .bc-apostila-topic h2 span{font-size:12px;vertical-align:baseline;margin-right:9px;color:#6a98b6}\n.bc-apostila-v20261111 .bc-apostila-prose p{font-size:15.4px;line-height:1.81;color:#283c55;margin:0 0 13px}\n.bc-apostila-v20261111 .bc-apostila-example{font-size:14.5px;line-height:1.75;color:#23435b;background:#f3f8fc;padding:12px 16px;border-left:3px solid #7caecb;margin:13px 0 12px;border-radius:0 5px 5px 0}\n.bc-apostila-v20261111 .bc-apostila-law{font-size:13.3px;line-height:1.68;color:#4a6581;margin:10px 0 13px}\n.bc-apostila-v20261111 .bc-apostila-alert{font-size:13.5px;line-height:1.65;margin:9px 0 13px;color:#51687d}\n.bc-apostila-v20261111 .bc-m01-lei-seca{margin:9px 0 14px;border:0;border-left:3px solid #89b2d0;border-radius:0;background:transparent;padding:6px 0 6px 16px}\n.bc-apostila-v20261111 .bc-m01-lei-seca summary{color:#2a709e;font-size:13px}\n.bc-apostila-v20261111 .bc-apostila-sintese{border-top:2px solid #c9deed;margin-top:24px;padding-top:24px}\n.bc-apostila-v20261111 .bc-apostila-sintese h2{font-size:20px;color:#1f4667;margin:0 0 13px}\n.bc-apostila-v20261111 .bc-apostila-sintese ul{margin:0;padding-left:21px}\n.bc-apostila-v20261111 .bc-apostila-sintese li{font-size:14.6px;line-height:1.72;color:#2e4660;padding-bottom:9px}\n.bc-apostila-v20261111 .bc-apostila-sintese>p{font-size:12px;color:#8294a7;margin:20px 0 0}\n.bc-apostila-v20261111 .bc-apostila-checklist{border-top:1px solid #dce6ee;margin-top:28px;padding:12px 0}\n.bc-apostila-v20261111 .bc-apostila-checklist>summary{font-size:14px;font-weight:650;color:#2a678b;cursor:pointer;padding:9px 0}\n.bc-apostila-v20261111 .bc-m01-checklist{padding-top:12px}\n.bc-apostila-v20261111 .bc-m01-checklist label{border:0;border-bottom:1px solid #dce6ee;border-radius:0;padding:11px 0;background:transparent}\n@media(max-width:600px){.bc-apostila-v20261111 .bc-m01-paper.bc-apostila-paper{width:calc(100% - 26px);padding-top:22px}.bc-apostila-v20261111 .bc-apostila-intro{font-size:15px}.bc-apostila-v20261111 .bc-apostila-prose p{font-size:15px}.bc-apostila-v20261111 .bc-apostila-topic h2{font-size:19px}.bc-apostila-v20261111 .bc-apostila-toolbar-label{font-size:11px}}\n";
    document.head.appendChild(style);
  }

css();
global.BcCivilGuidedReader=Object.freeze({open,close,modules:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]});
})(window);
