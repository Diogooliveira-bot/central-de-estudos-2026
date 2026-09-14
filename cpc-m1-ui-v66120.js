(function(){
'use strict';
if(window.__cpcM1UiV66120)return;
window.__cpcM1UiV66120=true;

function txt(el){return (el&&el.textContent||'').replace(/\s+/g,' ').trim()}
function m1root(){
 var direct=document.querySelector('.cf-module[data-cf="cpc1"],.cf-module[data-cf="cpc-m01"]');
 if(direct)return direct;
 var mods=[].slice.call(document.querySelectorAll('.cf-module'));
 return mods.find(function(el){var t=txt(el);return /M[oó]dulo\s*1\b/i.test(t)&&/Normas fundamentais, fontes, aplica[cç][aã]o e direito intertemporal/i.test(t)})||null;
}
function hasAll(el,parts){var t=txt(el);return parts.every(function(p){return t.indexOf(p)!==-1})}
function smallestBlock(root,parts){
 var all=[].slice.call(root.querySelectorAll('section,article,div,details,li'));
 var hits=all.filter(function(el){return hasAll(el,parts)});
 if(!hits.length)return null;
 hits.sort(function(a,b){return (txt(a).length-txt(b).length)});
 return hits[0];
}
function hideInternalQuestions(root){
 [
  ['Diagnóstico','Começar 5 FCC'],
  ['Questões intermediárias','Fazer 8 FCC'],
  ['Bateria final FCC','FCC real'],
  ['Revisão de erros']
 ].forEach(function(parts){
  var block=smallestBlock(root,parts);
  if(block){block.setAttribute('data-cpc-m1-internal-questions','removed');block.style.display='none'}
 });
}
function findLeaf(root,label){
 var nodes=[].slice.call(root.querySelectorAll('h1,h2,h3,h4,h5,h6,strong,b,span,div'));
 return nodes.find(function(el){return txt(el)===label})||null;
}
function commonCard(root,titleEl,bodyProbe){
 var el=titleEl;
 while(el&&el!==root){
  if(txt(el).indexOf(bodyProbe)!==-1 && txt(el).length<2500)return el;
  el=el.parentElement;
 }
 return null;
}
function civilizeTheory(root){
 root.classList.add('cpc-m1-civil-visual');
 var w=(typeof CPC_WEEKS!=='undefined'&&Array.isArray(CPC_WEEKS))?(CPC_WEEKS.find(function(x){return x&&x.editalModule==='cpc-m01'})||CPC_WEEKS.find(function(x){return x&&x.id==='cpc1'})):null;
 if(!w||!Array.isArray(w.theory))return;
 w.theory.forEach(function(item,i){
  if(!item||!item[0]||!item[1])return;
  var head=findLeaf(root,String(item[0]));
  if(!head)return;
  var probe=String(item[1]).replace(/\s+/g,' ').trim().slice(0,42);
  var card=commonCard(root,head,probe)||head.parentElement;
  if(!card)return;
  card.classList.add('cpc-m1-theory-topic');
  card.setAttribute('data-cpc-topic-index',String(i+1));
  head.classList.add('cpc-m1-theory-title');
  var descendants=[].slice.call(card.querySelectorAll('p,div,span'));
  var body=descendants.find(function(el){var t=txt(el);return t.indexOf(probe)!==-1&&t!==txt(card)});
  if(body)body.classList.add('cpc-m1-theory-text');
 });
 var nuclear=findLeaf(root,'Teoria nuclear');
 if(nuclear)nuclear.classList.add('cpc-m1-theory-heading');
 var advanced=findLeaf(root,'Aprofundamento FCC');
 if(advanced)advanced.classList.add('cpc-m1-theory-heading');
}
function apply(){
 var root=m1root();if(!root)return false;
 hideInternalQuestions(root);
 civilizeTheory(root);
 return true;
}
function schedule(){setTimeout(apply,60);setTimeout(apply,350);setTimeout(apply,1200)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
var obs=new MutationObserver(function(){if(!window.__cpcM1UiApplying){window.__cpcM1UiApplying=true;requestAnimationFrame(function(){try{apply()}finally{window.__cpcM1UiApplying=false}})}});
obs.observe(document.documentElement,{subtree:true,childList:true});

var style=document.createElement('style');
style.id='cpc-m1-civil-style-v66120';
style.textContent='\
html.central-minimal-v66119 .cpc-m1-civil-visual .cpc-m1-theory-heading{margin:24px 0 10px!important;font-family:Inter,ui-sans-serif,system-ui,sans-serif!important;font-size:10px!important;letter-spacing:.09em!important;text-transform:uppercase!important;color:var(--cm-accent)!important;font-weight:750!important}\
html.central-minimal-v66119 .cpc-m1-civil-visual .cpc-m1-theory-topic{position:relative!important;margin:8px 0!important;padding:18px 20px 18px 52px!important;border:1px solid var(--cm-line)!important;border-radius:10px!important;background:var(--cm-paper)!important;box-shadow:none!important}\
html.central-minimal-v66119 .cpc-m1-civil-visual .cpc-m1-theory-topic:before{content:attr(data-cpc-topic-index);position:absolute;left:14px;top:17px;width:24px;height:24px;display:grid;place-items:center;border:1px solid var(--cm-line2);border-radius:8px;color:var(--cm-muted);font:650 10px/1 Inter,system-ui,sans-serif}\
html.central-minimal-v66119 .cpc-m1-civil-visual .cpc-m1-theory-title{display:block!important;margin:0 0 8px!important;color:var(--cm-text)!important;font-family:Georgia,"Times New Roman",serif!important;font-size:18px!important;line-height:1.35!important;font-weight:600!important}\
html.central-minimal-v66119 .cpc-m1-civil-visual .cpc-m1-theory-text{color:var(--cm-text)!important;font-family:Georgia,"Times New Roman",serif!important;font-size:16px!important;line-height:1.72!important}\
html.central-minimal-v66119 .cpc-m1-civil-visual .cpc-m1-theory-topic:hover{border-color:color-mix(in srgb,var(--cm-accent) 30%,var(--cm-line))!important}\
@media(max-width:760px){html.central-minimal-v66119 .cpc-m1-civil-visual .cpc-m1-theory-topic{padding:15px 14px 16px 46px!important}.cpc-m1-civil-visual .cpc-m1-theory-title{font-size:17px!important}.cpc-m1-civil-visual .cpc-m1-theory-text{font-size:15px!important;line-height:1.7!important}}';
document.head.appendChild(style);
})();
