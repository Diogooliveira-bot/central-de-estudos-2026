/* Base Completa — Editor visual de leitura v1
   Edição não destrutiva: salva no localStorage e acompanha a sincronização já existente da Central. */
(function(){
'use strict';
if(window.__bcVisualEditorV1)return;window.__bcVisualEditorV1=true;

var PREFIX='base-completa:visual-editor:v1:';
var PROTECTED='.bc-native-study-progress,.bc-native-internal-review';
var mounted=new WeakSet();

function hash(s){
  var h=2166136261;
  for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}
  return (h>>>0).toString(36);
}
function identity(overlay){
  var title=(overlay.querySelector('.bc-native-reader-title b,.cf-native-shell>header b')||{}).textContent||'material';
  var sub=(overlay.querySelector('.bc-native-reader-title small,.cf-native-shell>header small')||{}).textContent||'';
  return location.pathname+'|'+title.trim()+'|'+sub.trim();
}
function keyFor(overlay){return PREFIX+hash(identity(overlay))}
function articleFor(overlay){return overlay.querySelector('.bc-native-article,.cf-native-reader article')}
function toolsFor(overlay){return overlay.querySelector('.bc-native-reader-tools,.cf-native-reader>aside')}

function sanitize(root){
  root.querySelectorAll('script,iframe,object,embed,form').forEach(function(n){n.remove()});
  root.querySelectorAll('*').forEach(function(el){
    Array.from(el.attributes).forEach(function(a){
      if(/^on/i.test(a.name))el.removeAttribute(a.name);
      if((a.name==='href'||a.name==='src')&&/^\s*javascript:/i.test(a.value))el.removeAttribute(a.name);
    });
  });
}
function capture(article){
  var clone=article.cloneNode(true);
  var protectedNodes=Array.from(clone.querySelectorAll(PROTECTED));
  protectedNodes.forEach(function(node,i){
    var ph=document.createElement('div');
    ph.setAttribute('data-bc-editor-preserve',String(i));
    node.replaceWith(ph);
  });
  clone.removeAttribute('contenteditable');
  clone.classList.remove('bc-editor-active');
  clone.querySelectorAll('[contenteditable]').forEach(function(n){n.removeAttribute('contenteditable')});
  sanitize(clone);
  return clone.innerHTML;
}
function applySnapshot(article,html){
  if(!html)return;
  var live=Array.from(article.querySelectorAll(PROTECTED));
  var tpl=document.createElement('template');
  tpl.innerHTML=html;
  sanitize(tpl.content);
  tpl.content.querySelectorAll('[data-bc-editor-preserve]').forEach(function(ph){
    var i=Number(ph.getAttribute('data-bc-editor-preserve'));
    if(live[i])ph.replaceWith(live[i]);
    else ph.remove();
  });
  article.replaceChildren(tpl.content.cloneNode(true));
}
function getSaved(overlay){
  try{return localStorage.getItem(keyFor(overlay))||''}catch(_){return ''}
}
function setSaved(overlay,html){
  try{localStorage.setItem(keyFor(overlay),html)}catch(_){}
}
function removeSaved(overlay){
  try{localStorage.removeItem(keyFor(overlay))}catch(_){}
}
function toast(msg){
  var old=document.querySelector('.bc-editor-toast');if(old)old.remove();
  var el=document.createElement('div');el.className='bc-editor-toast';el.textContent=msg;
  document.body.appendChild(el);requestAnimationFrame(function(){el.classList.add('show')});
  setTimeout(function(){el.classList.remove('show');setTimeout(function(){el.remove()},220)},1800);
}
function blockFromSelection(article){
  var sel=getSelection();if(!sel||!sel.rangeCount)return article.querySelector('p,h1,h2,h3,li,blockquote');
  var n=sel.anchorNode;
  if(n&&n.nodeType===3)n=n.parentElement;
  if(!n||!article.contains(n))return null;
  return n.closest('p,h1,h2,h3,h4,li,blockquote,div,section');
}
function focusArticle(article){
  if(!article.contains(document.activeElement))article.focus({preventScroll:true});
}
function exec(article,cmd,value){
  focusArticle(article);
  try{document.execCommand(cmd,false,value==null?null:value)}catch(_){}
}
function setBlockTag(article,tag){
  exec(article,'formatBlock','<'+tag+'>');
}
function adjustGap(article,delta){
  var block=blockFromSelection(article);if(!block)return;
  var current=parseInt(getComputedStyle(block).marginBottom,10)||0;
  block.style.marginBottom=Math.max(0,Math.min(80,current+delta))+'px';
}
function toggleCallout(article){
  var block=blockFromSelection(article);if(!block)return;
  block.classList.toggle('bc-editor-callout');
}
function makeEditorBar(overlay,article,state){
  var bar=document.createElement('div');bar.className='bc-editor-bar';
  bar.innerHTML=
    '<select data-ed="block" aria-label="Estilo do bloco"><option value="">Estilo</option><option value="p">Texto</option><option value="h1">Título 1</option><option value="h2">Título 2</option><option value="h3">Título 3</option><option value="blockquote">Citação</option></select>'+
    '<button type="button" data-ed="bold" title="Negrito"><b>B</b></button>'+
    '<button type="button" data-ed="italic" title="Itálico"><i>I</i></button>'+
    '<button type="button" data-ed="underline" title="Sublinhado"><u>U</u></button>'+
    '<select data-ed="color" aria-label="Cor do texto"><option value="">Cor</option><option value="#34312d">Preto</option><option value="#087584">Azul petróleo</option><option value="#6d5b88">Roxo</option><option value="#9b3d3d">Vermelho</option><option value="#2f7a4f">Verde</option><option value="#b36b00">Laranja</option></select>'+
    '<button type="button" data-ed="mark" title="Marca-texto">Destaque</button>'+
    '<button type="button" data-ed="ul" title="Lista com marcadores">• Lista</button>'+
    '<button type="button" data-ed="ol" title="Lista numerada">1. Lista</button>'+
    '<button type="button" data-ed="callout" title="Caixa de destaque">Caixa</button>'+
    '<button type="button" data-ed="gapminus" title="Diminuir espaço abaixo">Espaço −</button>'+
    '<button type="button" data-ed="gapplus" title="Aumentar espaço abaixo">Espaço +</button>'+
    '<span class="bc-editor-spacer"></span>'+
    '<button type="button" data-ed="undo" title="Desfazer">↶</button>'+
    '<button type="button" data-ed="redo" title="Refazer">↷</button>'+
    '<button type="button" class="bc-editor-cancel" data-ed="cancel">Cancelar</button>'+
    '<button type="button" class="bc-editor-save" data-ed="save">Salvar</button>';
  bar.addEventListener('change',function(e){
    if(e.target.matches('[data-ed="block"]')&&e.target.value){setBlockTag(article,e.target.value);e.target.value=''}
    if(e.target.matches('[data-ed="color"]')&&e.target.value){exec(article,'foreColor',e.target.value);e.target.value=''}
  });
  bar.addEventListener('click',function(e){
    var b=e.target.closest('[data-ed]');if(!b)return;
    var a=b.dataset.ed;
    if(a==='bold')exec(article,'bold');
    else if(a==='italic')exec(article,'italic');
    else if(a==='underline')exec(article,'underline');
    else if(a==='mark')exec(article,'hiliteColor','#ffe4a0');
    else if(a==='ul')exec(article,'insertUnorderedList');
    else if(a==='ol')exec(article,'insertOrderedList');
    else if(a==='undo')exec(article,'undo');
    else if(a==='redo')exec(article,'redo');
    else if(a==='callout')toggleCallout(article);
    else if(a==='gapminus')adjustGap(article,-8);
    else if(a==='gapplus')adjustGap(article,8);
    else if(a==='cancel'){applySnapshot(article,state.beforeEdit);exitEdit(overlay,article,state);toast('Alterações canceladas')}
    else if(a==='save'){setSaved(overlay,capture(article));state.sourceChanged=true;exitEdit(overlay,article,state);toast('Alterações salvas')}
  });
  return bar;
}
function enterEdit(overlay,article,state){
  if(state.editing)return;
  state.editing=true;state.beforeEdit=capture(article);
  article.classList.add('bc-editor-active');
  article.setAttribute('contenteditable','true');
  article.setAttribute('spellcheck','true');
  article.querySelectorAll(PROTECTED).forEach(function(n){n.setAttribute('contenteditable','false')});
  var tools=toolsFor(overlay);
  var bar=makeEditorBar(overlay,article,state);
  state.bar=bar;
  (tools&&tools.parentElement?tools.parentElement:overlay).insertBefore(bar,tools?tools.nextSibling:overlay.firstChild);
  state.button.textContent='Editando…';state.button.disabled=true;
  article.focus({preventScroll:true});
}
function exitEdit(overlay,article,state){
  state.editing=false;
  article.removeAttribute('contenteditable');article.removeAttribute('spellcheck');article.classList.remove('bc-editor-active');
  article.querySelectorAll(PROTECTED).forEach(function(n){n.removeAttribute('contenteditable')});
  if(state.bar){state.bar.remove();state.bar=null}
  state.button.disabled=false;state.button.textContent='✎ Editar';
}
function addReset(overlay,article,state,tools){
  var btn=document.createElement('button');btn.type='button';btn.className='bc-editor-reset';btn.textContent='Restaurar';
  btn.title='Remover suas alterações e voltar ao conteúdo original';
  btn.hidden=!getSaved(overlay);
  btn.addEventListener('click',function(){
    if(!confirm('Remover as alterações deste material e restaurar o conteúdo original?'))return;
    if(state.editing)exitEdit(overlay,article,state);
    removeSaved(overlay);applySnapshot(article,state.sourceSnapshot);btn.hidden=true;toast('Conteúdo original restaurado');
  });
  tools.appendChild(btn);state.reset=btn;
}
function mount(overlay){
  if(mounted.has(overlay))return;
  var article=articleFor(overlay),tools=toolsFor(overlay);if(!article||!tools)return;
  mounted.add(overlay);
  var state={editing:false,sourceSnapshot:capture(article),beforeEdit:'',bar:null,button:null,reset:null};
  var saved=getSaved(overlay);if(saved)applySnapshot(article,saved);
  var btn=document.createElement('button');btn.type='button';btn.className='bc-editor-trigger';btn.textContent='✎ Editar';btn.title='Editar este material';
  btn.addEventListener('click',function(){enterEdit(overlay,article,state)});
  tools.appendChild(btn);state.button=btn;
  addReset(overlay,article,state,tools);
  overlay.addEventListener('click',function(e){
    if(e.target.closest('.bc-editor-reset,.bc-editor-trigger,.bc-editor-bar'))return;
  });
}
function scan(){
  document.querySelectorAll('.bc-native-reader-overlay,.cf-native-overlay').forEach(mount);
}
var scheduled=false;
function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(function(){scheduled=false;scan()})}
function start(){scan();new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true})}
window.addEventListener('central-cloud-applied',function(){setTimeout(scan,0)});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();