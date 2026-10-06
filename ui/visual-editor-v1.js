/* Base Completa — Editor visual de leitura v1
   Edição não destrutiva: salva no localStorage e acompanha a sincronização já existente da Central. */
(function(){
'use strict';
if(window.__bcVisualEditorV1)return;window.__bcVisualEditorV1=true;

var PREFIX='base-completa:visual-editor:v1:';
var PROTECTED='.bc-native-study-progress,.bc-native-internal-review';
var mounted=new WeakSet();
var authUser=null,canEdit=false;

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
function contentId(overlay){return 'reader:'+hash(identity(overlay))}
function keyFor(overlay){return PREFIX+hash(identity(overlay))}
async function loadAuth(){
  try{
    var r=await fetch('/api/auth?action=me',{cache:'no-store'}),j=await r.json();
    if(j&&j.authenticated&&j.user){
      authUser=j.user;window.BASE_COMPLETA_USER=j.user;
      canEdit=j.user.role==='admin'||j.user.role==='editor';
    }
  }catch(_){}
  return authUser;
}
async function cloudGet(overlay){
  try{
    var r=await fetch('/api/content-editor?id='+encodeURIComponent(contentId(overlay)),{cache:'no-store'});
    if(!r.ok)return null;
    var j=await r.json();
    return j&&j.exists?j:null;
  }catch(_){return null}
}
async function cloudSave(overlay,html){
  if(!canEdit)throw new Error('Seu perfil não permite editar conteúdo');
  var label=identity(overlay);
  var r=await fetch('/api/content-editor',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:contentId(overlay),label:label,html:html})});
  var j={};try{j=await r.json()}catch(_){}
  if(!r.ok)throw new Error(j.error||('Falha ao salvar (HTTP '+r.status+')'));
  return j;
}
async function cloudDelete(overlay){
  if(!canEdit)throw new Error('Seu perfil não permite restaurar conteúdo');
  var r=await fetch('/api/content-editor?id='+encodeURIComponent(contentId(overlay)),{method:'DELETE'});
  var j={};try{j=await r.json()}catch(_){}
  if(!r.ok)throw new Error(j.error||('Falha ao restaurar (HTTP '+r.status+')'));
  return j;
}
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
  clone.querySelectorAll('[data-bc-spell-error]').forEach(function(n){n.replaceWith(document.createTextNode(n.textContent||''))});
  clone.querySelectorAll('.bc-editor-image.is-selected').forEach(function(n){n.classList.remove('is-selected')});
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
function headingEnterToParagraph(article,e){
  if(e.key!=='Enter'||e.shiftKey)return;
  var sel=getSelection();if(!sel||!sel.rangeCount||!sel.isCollapsed)return;
  var node=sel.anchorNode;if(node&&node.nodeType===3)node=node.parentElement;
  if(!node)return;
  var heading=node.closest('h1,h2,h3,h4');
  if(!heading||!article.contains(heading))return;
  var range=sel.getRangeAt(0);
  var tail=range.cloneRange();
  tail.setEndAfter(heading.lastChild||heading);
  var frag=tail.extractContents();
  var p=document.createElement('p');
  while(frag.firstChild)p.appendChild(frag.firstChild);
  if(!p.textContent.trim())p.appendChild(document.createElement('br'));
  heading.insertAdjacentElement('afterend',p);
  var nr=document.createRange();nr.selectNodeContents(p);nr.collapse(true);
  sel.removeAllRanges();sel.addRange(nr);
  e.preventDefault();
}
function adjustGap(article,delta){
  var block=blockFromSelection(article);if(!block)return;
  var current=parseInt(getComputedStyle(block).marginBottom,10)||0;
  block.style.marginBottom=Math.max(0,Math.min(80,current+delta))+'px';
}
function clearCalloutClasses(block){
  block.classList.remove('bc-editor-callout','bc-editor-callout-atencao','bc-editor-callout-pegadinha','bc-editor-callout-decore','bc-editor-callout-lei','bc-editor-callout-juris','bc-editor-callout-exemplo','bc-editor-callout-resumo','bc-editor-callout-fcc','bc-editor-callout-prazo','bc-editor-callout-erro','bc-editor-callout-palavra');
}
function applyCallout(article,type){
  var block=blockFromSelection(article);if(!block)return;
  clearCalloutClasses(block);
  if(type==='remove')return;
  if(type==='generic')block.classList.add('bc-editor-callout');
  if(type==='atencao')block.classList.add('bc-editor-callout','bc-editor-callout-atencao');
  if(type==='pegadinha')block.classList.add('bc-editor-callout','bc-editor-callout-pegadinha');
  if(type==='decore')block.classList.add('bc-editor-callout','bc-editor-callout-decore');
  if(type==='lei')block.classList.add('bc-editor-callout','bc-editor-callout-lei');
  if(type==='juris')block.classList.add('bc-editor-callout','bc-editor-callout-juris');
  if(type==='exemplo')block.classList.add('bc-editor-callout','bc-editor-callout-exemplo');
  if(type==='resumo')block.classList.add('bc-editor-callout','bc-editor-callout-resumo');
  if(type==='fcc')block.classList.add('bc-editor-callout','bc-editor-callout-fcc');
  if(type==='prazo')block.classList.add('bc-editor-callout','bc-editor-callout-prazo');
  if(type==='erro')block.classList.add('bc-editor-callout','bc-editor-callout-erro');
  if(type==='palavra')block.classList.add('bc-editor-callout','bc-editor-callout-palavra');
}
function selectionElement(article){
  var sel=getSelection();if(!sel||!sel.rangeCount)return null;
  var n=sel.anchorNode;if(n&&n.nodeType===3)n=n.parentElement;
  return n&&article.contains(n)?n:null;
}
function selectedTable(article){
  var n=selectionElement(article);
  return n?n.closest('table'):null;
}
function topLevelBlock(article,node){
  if(!node)return null;
  if(node.nodeType===3)node=node.parentElement;
  if(!node||!article.contains(node))return null;
  while(node.parentElement&&node.parentElement!==article)node=node.parentElement;
  return node;
}
function insertBlockAtSelection(article,node,focusTarget){
  var sel=getSelection(),range=sel&&sel.rangeCount?sel.getRangeAt(0):null;
  var current=range?topLevelBlock(article,range.commonAncestorContainer):null;
  if(current)current.insertAdjacentElement('afterend',node);
  else article.appendChild(node);
  var p=document.createElement('p');p.appendChild(document.createElement('br'));
  node.insertAdjacentElement('afterend',p);
  if(focusTarget)setCaret(focusTarget);
  else setCaret(p);
}
function createEditableText(tag,text){
  var el=document.createElement(tag);el.textContent=text;return el;
}
function insertComparison(article){
  var wrap=document.createElement('section');wrap.className='bc-editor-compare';
  for(var i=0;i<2;i++){
    var card=document.createElement('div');card.className='bc-editor-compare-card';
    card.appendChild(createEditableText('h4',i===0?'Conceito A':'Conceito B'));
    var p1=document.createElement('p');p1.innerHTML='<strong>Pergunta-chave:</strong> escreva a pergunta que diferencia este conceito.';
    var p2=document.createElement('p');p2.innerHTML='<strong>Ideia:</strong> escreva a regra essencial para revisão.';
    card.appendChild(p1);card.appendChild(p2);wrap.appendChild(card);
  }
  insertBlockAtSelection(article,wrap,wrap.querySelector('h4'));
}
function insertCards(article,count){
  count=Math.max(2,Math.min(4,Number(count)||3));
  var wrap=document.createElement('section');wrap.className='bc-editor-cards';wrap.setAttribute('data-card-count',String(count));
  for(var i=0;i<count;i++){
    var card=document.createElement('div');card.className='bc-editor-card';
    card.appendChild(createEditableText('h4','Título'));
    card.appendChild(createEditableText('p','Escreva o conteúdo deste card.'));
    wrap.appendChild(card);
  }
  insertBlockAtSelection(article,wrap,wrap.querySelector('h4'));
}
function insertReviewBox(article){
  var box=document.createElement('section');box.className='bc-editor-review-box';
  box.appendChild(createEditableText('h4','Resumo de revisão'));
  box.appendChild(createEditableText('p','Escreva aqui o ponto essencial que o aluno precisa recuperar na revisão.'));
  insertBlockAtSelection(article,box,box.querySelector('h4'));
}
function fitImageToDataUrl(file){
  return new Promise(function(resolve,reject){
    if(!file||!/^image\//i.test(file.type||''))return reject(new Error('Selecione uma imagem válida'));
    if(file.size>15*1024*1024)return reject(new Error('Imagem muito grande. Use um arquivo de até 15 MB'));
    var reader=new FileReader();
    reader.onerror=function(){reject(new Error('Não foi possível ler a imagem'))};
    reader.onload=function(){
      var img=new Image();
      img.onerror=function(){reject(new Error('Formato de imagem não suportado'))};
      img.onload=function(){
        var max=1400,scale=Math.min(1,max/Math.max(img.naturalWidth,img.naturalHeight));
        var w=Math.max(1,Math.round(img.naturalWidth*scale)),h=Math.max(1,Math.round(img.naturalHeight*scale));
        var canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
        var ctx=canvas.getContext('2d');ctx.drawImage(img,0,0,w,h);
        var url=canvas.toDataURL('image/webp',0.72);
        if(url.length>850000){
          var scale2=Math.min(1,1000/Math.max(w,h));
          var c2=document.createElement('canvas');c2.width=Math.max(1,Math.round(w*scale2));c2.height=Math.max(1,Math.round(h*scale2));
          c2.getContext('2d').drawImage(canvas,0,0,c2.width,c2.height);
          url=c2.toDataURL('image/webp',0.58);
        }
        if(url.length>1100000)return reject(new Error('A imagem ainda ficou grande após compactação. Escolha uma imagem menor.'));
        resolve(url);
      };
      img.src=reader.result;
    };
    reader.readAsDataURL(file);
  });
}
function chooseImage(callback){
  var input=document.createElement('input');input.type='file';input.accept='image/*';input.hidden=true;
  document.body.appendChild(input);
  input.addEventListener('change',function(){
    var file=input.files&&input.files[0];if(!file){input.remove();return}
    fitImageToDataUrl(file).then(callback).catch(function(err){toast(err.message||'Falha ao inserir imagem')}).finally(function(){input.remove()});
  },{once:true});
  input.click();
}
function makeImageFigure(dataUrl){
  var figure=document.createElement('figure');figure.className='bc-editor-image bc-editor-image-full';
  var img=document.createElement('img');img.src=dataUrl;img.alt='';img.setAttribute('contenteditable','false');
  var cap=document.createElement('figcaption');cap.textContent='Legenda opcional';
  figure.appendChild(img);figure.appendChild(cap);return figure;
}
function insertImage(article){
  chooseImage(function(dataUrl){
    var figure=makeImageFigure(dataUrl);
    insertBlockAtSelection(article,figure,figure.querySelector('figcaption'));
    toast('Imagem inserida. Edite a legenda e salve o material.');
  });
}
function selectedFigure(article){
  var n=selectionElement(article),figure=n&&n.closest('.bc-editor-image');
  return figure||article.querySelector('.bc-editor-image.is-selected');
}
function clearImageSelection(article){
  article.querySelectorAll('.bc-editor-image.is-selected').forEach(function(n){n.classList.remove('is-selected')});
}
function imageAction(article,action){
  var figure=selectedFigure(article);if(!figure)return toast('Toque primeiro na imagem que deseja editar');
  if(action==='small'||action==='medium'||action==='full'){
    figure.classList.remove('bc-editor-image-small','bc-editor-image-medium','bc-editor-image-full');
    figure.classList.add('bc-editor-image-'+action);return;
  }
  if(action==='caption'){
    var cap=figure.querySelector('figcaption');if(cap){setCaret(cap);toast('Edite a legenda abaixo da imagem')}return;
  }
  if(action==='replace'){
    chooseImage(function(url){var img=figure.querySelector('img');if(img)img.src=url;toast('Imagem substituída')});return;
  }
  if(action==='delete'){
    if(confirm('Excluir esta imagem do material?'))figure.remove();
  }
}
function setCaret(node){
  var sel=getSelection(),range=document.createRange();
  range.selectNodeContents(node);range.collapse(true);
  sel.removeAllRanges();sel.addRange(range);
}
function insertTable(article,rows,cols){
  rows=Math.max(1,Math.min(20,Number(rows)||3));
  cols=Math.max(1,Math.min(8,Number(cols)||3));
  var wrap=document.createElement('div');wrap.className='bc-editor-table-wrap';
  var table=document.createElement('table');table.className='bc-editor-table';
  var tbody=document.createElement('tbody');
  for(var r=0;r<rows;r++){
    var tr=document.createElement('tr');
    for(var c=0;c<cols;c++){
      var cell=document.createElement(r===0?'th':'td');
      cell.appendChild(document.createElement('br'));
      tr.appendChild(cell);
    }
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);wrap.appendChild(table);
  insertBlockAtSelection(article,wrap,table.querySelector('th,td'));
}
function addTableRow(article){
  var table=selectedTable(article);if(!table)return toast('Toque em uma célula da tabela primeiro');
  var rows=table.rows,cols=rows.length?rows[0].cells.length:1;
  var tr=document.createElement('tr');
  for(var i=0;i<cols;i++){var td=document.createElement('td');td.appendChild(document.createElement('br'));tr.appendChild(td)}
  (table.tBodies[0]||table).appendChild(tr);setCaret(tr.cells[0]);
}
function removeTableRow(article){
  var n=selectionElement(article),row=n&&n.closest('tr'),table=row&&row.closest('table');
  if(!row||!table)return toast('Toque na linha que deseja remover');
  if(table.rows.length<=1)return toast('A tabela precisa ter pelo menos uma linha');
  var next=row.nextElementSibling||row.previousElementSibling;row.remove();if(next&&next.cells[0])setCaret(next.cells[0]);
}
function addTableColumn(article){
  var table=selectedTable(article);if(!table)return toast('Toque em uma célula da tabela primeiro');
  Array.from(table.rows).forEach(function(row,i){
    var tag=i===0&&row.cells[0]&&row.cells[0].tagName==='TH'?'th':'td';
    var cell=document.createElement(tag);cell.appendChild(document.createElement('br'));row.appendChild(cell);
  });
}
function removeTableColumn(article){
  var n=selectionElement(article),cell=n&&n.closest('th,td'),table=cell&&cell.closest('table');
  if(!cell||!table)return toast('Toque na coluna que deseja remover');
  var index=cell.cellIndex;if(table.rows[0].cells.length<=1)return toast('A tabela precisa ter pelo menos uma coluna');
  Array.from(table.rows).forEach(function(row){if(row.cells[index])row.cells[index].remove()});
  if(table.rows[0].cells[Math.max(0,index-1)])setCaret(table.rows[0].cells[Math.max(0,index-1)]);
}
function toggleTableHeader(article){
  var table=selectedTable(article);if(!table)return toast('Toque em uma célula da tabela primeiro');
  var row=table.rows[0];if(!row)return;
  var makeHeader=!Array.from(row.cells).every(function(c){return c.tagName==='TH'});
  Array.from(row.cells).forEach(function(cell){
    if((makeHeader&&cell.tagName==='TH')||(!makeHeader&&cell.tagName==='TD'))return;
    var repl=document.createElement(makeHeader?'th':'td');repl.innerHTML=cell.innerHTML;cell.replaceWith(repl);
  });
}
function clearSpellHighlights(article){
  article.querySelectorAll('[data-bc-spell-error]').forEach(function(n){
    n.replaceWith(document.createTextNode(n.textContent||''));
  });
  article.normalize();
}
function textNodesForSpell(article){
  var out=[],walker=document.createTreeWalker(article,NodeFilter.SHOW_TEXT,{
    acceptNode:function(node){
      if(!node.nodeValue||!node.nodeValue.trim())return NodeFilter.FILTER_REJECT;
      var p=node.parentElement;
      if(!p||p.closest('[data-bc-editor-preserve],script,style'))return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  var n;while((n=walker.nextNode()))out.push(n);return out;
}
function plainTextMap(article){
  var nodes=textNodesForSpell(article),text='',map=[];
  nodes.forEach(function(node,i){
    if(i&&text&&!/\s$/.test(text))text+=' ';
    var start=text.length;var value=node.nodeValue||'';
    text+=value;map.push({node:node,start:start,end:start+value.length});
  });
  return {text:text,map:map};
}
function highlightSpellMatches(article,matches){
  clearSpellHighlights(article);
  var data=plainTextMap(article);
  var sorted=(matches||[]).slice().sort(function(a,b){return b.offset-a.offset});
  sorted.forEach(function(m){
    var start=Number(m.offset)||0,end=start+(Number(m.length)||0);
    for(var i=data.map.length-1;i>=0;i--){
      var item=data.map[i];
      if(end<=item.start||start>=item.end)continue;
      var localStart=Math.max(0,start-item.start),localEnd=Math.min(item.end,end)-item.start;
      if(localEnd<=localStart)continue;
      var node=item.node;if(!node.isConnected)continue;
      var range=document.createRange();
      try{
        range.setStart(node,localStart);range.setEnd(node,localEnd);
        var mark=document.createElement('span');
        mark.className='bc-spell-error';mark.setAttribute('data-bc-spell-error','1');
        mark.title=(m.message||'Possível erro')+(m.replacements&&m.replacements.length?' — Sugestão: '+m.replacements[0].value:'');
        range.surroundContents(mark);
      }catch(_){}
    }
  });
}
function ensureSpellPanel(overlay,state){
  if(state.spellPanel&&state.spellPanel.isConnected)return state.spellPanel;
  var panel=document.createElement('aside');panel.className='bc-spell-panel';panel.hidden=true;
  panel.innerHTML='<div class="bc-spell-panel-head"><b>Revisão ortográfica</b><button type="button" data-spell-close aria-label="Fechar">×</button></div><div class="bc-spell-panel-body"></div>';
  panel.addEventListener('click',function(e){
    if(e.target.closest('[data-spell-close]')){panel.hidden=true;clearSpellHighlights(articleFor(overlay));}
    var fix=e.target.closest('[data-spell-fix]');
    if(fix){
      var index=Number(fix.getAttribute('data-spell-fix')),m=(state.spellMatches||[])[index],article=articleFor(overlay);
      if(!m||!article)return;
      var target=article.querySelectorAll('[data-bc-spell-error]')[index];
      if(target&&m.replacements&&m.replacements[0]){
        target.replaceWith(document.createTextNode(m.replacements[0].value));
        article.normalize();panel.hidden=true;toast('Correção aplicada. Revise novamente.');
      }
    }
  });
  overlay.appendChild(panel);state.spellPanel=panel;return panel;
}
function applyAllSpellFixes(article,matches){
  if(!matches||!matches.length)return 0;
  clearSpellHighlights(article);
  var data=plainTextMap(article),applied=0;
  var fixes=matches.filter(function(m){return m&&m.replacements&&m.replacements[0]&&m.length>0})
    .slice().sort(function(a,b){return b.offset-a.offset});
  fixes.forEach(function(m){
    var start=Number(m.offset)||0,end=start+(Number(m.length)||0),replacement=String(m.replacements[0].value||'');
    for(var i=data.map.length-1;i>=0;i--){
      var item=data.map[i];
      if(start>=item.start&&end<=item.end){
        var node=item.node;if(!node.isConnected)break;
        var value=node.nodeValue||'';
        var ls=start-item.start,le=end-item.start;
        node.nodeValue=value.slice(0,ls)+replacement+value.slice(le);
        applied++;break;
      }
    }
  });
  article.normalize();
  return applied;
}
async function reviewAndFixAll(overlay,article,state,button){
  clearSpellHighlights(article);
  var data=plainTextMap(article),text=data.text.trim();
  if(!text)return toast('Não há texto para revisar');
  if(!confirm('Revisar todo o material e aplicar automaticamente todas as sugestões disponíveis? Revise o resultado antes de salvar.'))return;
  button.disabled=true;var old=button.textContent;button.textContent='Ajustando…';
  try{
    var r=await fetch('/api/spellcheck',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:text,language:'pt-BR'})});
    var j={};try{j=await r.json()}catch(_){}
    if(!r.ok)throw new Error(j.error||'Falha na revisão ortográfica');
    state.spellMatches=j.matches||[];
    var applied=applyAllSpellFixes(article,state.spellMatches);
    if(state.spellPanel){state.spellPanel.hidden=true}
    toast(applied?applied+' correção(ões) aplicada(s). Revise antes de salvar.':'Nenhuma correção automática disponível');
  }catch(err){toast(err.message||'Falha na revisão ortográfica')}
  finally{button.disabled=false;button.textContent=old}
}
async function runSpellReview(overlay,article,state,button){
  clearSpellHighlights(article);
  var data=plainTextMap(article),text=data.text.trim();
  if(!text)return toast('Não há texto para revisar');
  button.disabled=true;var old=button.textContent;button.textContent='Revisando…';
  try{
    var r=await fetch('/api/spellcheck',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:text,language:'pt-BR'})});
    var j={};try{j=await r.json()}catch(_){}
    if(!r.ok)throw new Error(j.error||'Falha na revisão ortográfica');
    state.spellMatches=j.matches||[];
    highlightSpellMatches(article,state.spellMatches);
    var panel=ensureSpellPanel(overlay,state),body=panel.querySelector('.bc-spell-panel-body');
    if(!state.spellMatches.length)body.innerHTML='<p class="bc-spell-ok">Nenhum erro encontrado.</p>';
    else body.innerHTML=state.spellMatches.map(function(m,i){
      var replacement=m.replacements&&m.replacements[0]?m.replacements[0].value:'';
      return '<div class="bc-spell-item"><div><b>'+(m.shortMessage||'Possível erro')+'</b><p>'+String(m.message||'').replace(/[<>&]/g,function(ch){return {'<':'&lt;','>':'&gt;','&':'&amp;'}[ch]})+'</p>'+(replacement?'<small>Sugestão: <strong>'+String(replacement).replace(/[<>&]/g,function(ch){return {'<':'&lt;','>':'&gt;','&':'&amp;'}[ch]})+'</strong></small>':'')+'</div>'+(replacement?'<button type="button" data-spell-fix="'+i+'">Aplicar</button>':'')+'</div>';
    }).join('');
    panel.hidden=false;toast(state.spellMatches.length?state.spellMatches.length+' ponto(s) para revisar':'Nenhum erro encontrado');
  }catch(err){toast(err.message||'Falha na revisão ortográfica')}
  finally{button.disabled=false;button.textContent=old}
}
function makeEditorBar(overlay,article,state){
  var bar=document.createElement('div');bar.className='bc-editor-bar';
  bar.innerHTML=
    '<select data-ed="block" aria-label="Formato do bloco"><option value="">Formato ▾</option><option value="p">Texto normal</option><option value="h1">Título 1</option><option value="h2">Título 2</option><option value="h3">Título 3</option><option value="blockquote">Citação</option></select>'+
    '<button type="button" data-ed="bold" title="Negrito"><b>B</b></button>'+
    '<button type="button" data-ed="italic" title="Itálico"><i>I</i></button>'+
    '<button type="button" data-ed="underline" title="Sublinhado"><u>U</u></button>'+
    '<select data-ed="color" aria-label="Cor do texto"><option value="">Cor</option><option value="#34312d">Preto</option><option value="#087584">Azul petróleo</option><option value="#6d5b88">Roxo</option><option value="#9b3d3d">Vermelho</option><option value="#2f7a4f">Verde</option><option value="#b36b00">Laranja</option></select>'+
    '<button type="button" data-ed="mark" title="Marca-texto">Destaque</button>'+

    '<button type="button" data-ed="spellreview" title="Mostrar erros de ortografia e gramática">Revisar ortografia</button>'+
    '<button type="button" data-ed="spellfixall" title="Revisar e aplicar automaticamente todas as sugestões disponíveis">Revisar e ajustar tudo</button>'+
    '<button type="button" data-ed="ul" title="Lista com marcadores">• Lista</button>'+
    '<button type="button" data-ed="ol" title="Lista numerada">1. Lista</button>'+
    '<select data-ed="insert" aria-label="Inserir bloco"><option value="">+ Inserir ▾</option><option value="table">Tabela simples</option><option value="compare">Quadro comparativo</option><option value="cards">Cards</option><option value="image">Imagem</option><option value="review">Caixa de revisão</option></select>'+
    '<select data-ed="imageaction" aria-label="Editar imagem"><option value="">Imagem ▾</option><option value="small">Pequena</option><option value="medium">Média</option><option value="full">Largura total</option><option value="caption">Editar legenda</option><option value="replace">Substituir</option><option value="delete">Excluir</option></select>'+
    '<button type="button" data-ed="rowplus" title="Adicionar linha à tabela">Linha +</button>'+
    '<button type="button" data-ed="rowminus" title="Remover linha da tabela">Linha −</button>'+
    '<button type="button" data-ed="colplus" title="Adicionar coluna à tabela">Coluna +</button>'+
    '<button type="button" data-ed="colminus" title="Remover coluna da tabela">Coluna −</button>'+
    '<button type="button" data-ed="header" title="Alternar cabeçalho da primeira linha">Cabeçalho</button>'+
    '<select data-ed="callout" aria-label="Tipo de caixa"><option value="">Caixa ▾</option><option value="generic">Caixa padrão</option><option value="atencao">⚠ Atenção</option><option value="pegadinha">🎯 Pegadinha</option><option value="decore">🧠 Decore</option><option value="lei">⚖ Lei seca</option><option value="juris">🏛 Jurisprudência</option><option value="exemplo">💡 Exemplo</option><option value="resumo">📌 Resumo</option><option value="fcc">📝 FCC</option><option value="prazo">⏱ Prazo</option><option value="erro">✕ Erro comum</option><option value="palavra">🔑 Palavra-chave</option><option value="remove">Remover caixa</option></select>'+
    '<button type="button" data-ed="gapminus" title="Diminuir espaço abaixo">Espaço −</button>'+
    '<button type="button" data-ed="gapplus" title="Aumentar espaço abaixo">Espaço +</button>'+
    '<span class="bc-editor-spacer"></span>'+
    '<button type="button" data-ed="undo" title="Desfazer">↶</button>'+
    '<button type="button" data-ed="redo" title="Refazer">↷</button>'+
    '<button type="button" class="bc-editor-cancel" data-ed="cancel">Cancelar</button>'+
    '<button type="button" class="bc-editor-save" data-ed="save">Salvar</button>';
  bar.addEventListener('mousedown',function(e){
    if(e.target.closest('button[data-ed]'))e.preventDefault();
  });
  bar.addEventListener('change',function(e){
    if(e.target.matches('[data-ed="block"]')&&e.target.value){setBlockTag(article,e.target.value);e.target.value=''}
    if(e.target.matches('[data-ed="color"]')&&e.target.value){exec(article,'foreColor',e.target.value);e.target.value=''}
    if(e.target.matches('[data-ed="callout"]')&&e.target.value){applyCallout(article,e.target.value);e.target.value=''}
    if(e.target.matches('[data-ed="insert"]')&&e.target.value){
      var v=e.target.value;e.target.value='';
      if(v==='table'){
        var rows=prompt('Quantas linhas?', '5');if(rows===null)return;
        var cols=prompt('Quantas colunas?', '3');if(cols===null)return;
        insertTable(article,rows,cols);
      }else if(v==='compare')insertComparison(article);
      else if(v==='cards'){
        var count=prompt('Quantos cards? (2 a 4)','3');if(count!==null)insertCards(article,count);
      }else if(v==='image')insertImage(article);
      else if(v==='review')insertReviewBox(article);
    }
    if(e.target.matches('[data-ed="imageaction"]')&&e.target.value){var action=e.target.value;e.target.value='';imageAction(article,action)}
  });
  bar.addEventListener('click',function(e){
    var b=e.target.closest('[data-ed]');if(!b)return;
    var a=b.dataset.ed;
    if(a==='bold')exec(article,'bold');
    else if(a==='italic')exec(article,'italic');
    else if(a==='underline')exec(article,'underline');
    else if(a==='mark')exec(article,'hiliteColor','#ffe4a0');
    else if(a==='spellreview')runSpellReview(overlay,article,state,b);
    else if(a==='spellfixall')reviewAndFixAll(overlay,article,state,b);
    else if(a==='ul')exec(article,'insertUnorderedList');
    else if(a==='ol')exec(article,'insertOrderedList');
    else if(a==='rowplus')addTableRow(article);
    else if(a==='rowminus')removeTableRow(article);
    else if(a==='colplus')addTableColumn(article);
    else if(a==='colminus')removeTableColumn(article);
    else if(a==='header')toggleTableHeader(article);
    else if(a==='undo')exec(article,'undo');
    else if(a==='redo')exec(article,'redo');
    else if(a==='gapminus')adjustGap(article,-8);
    else if(a==='gapplus')adjustGap(article,8);
    else if(a==='cancel'){applySnapshot(article,state.beforeEdit);exitEdit(overlay,article,state);toast('Alterações canceladas')}
    else if(a==='save'){
      var html=capture(article);
      b.disabled=true;b.textContent='Salvando…';
      cloudSave(overlay,html).then(function(result){
        setSaved(overlay,html);state.sourceChanged=true;state.cloudRevision=result.revision||0;
        exitEdit(overlay,article,state);
        if(state.reset)state.reset.hidden=false;
        toast('Conteúdo definitivo salvo');
      }).catch(function(err){
        b.disabled=false;b.textContent='Salvar';
        toast(err.message||'Falha ao salvar');
      });
    }
  });
  return bar;
}
function enterEdit(overlay,article,state){
  if(state.editing)return;
  if(!canEdit){toast('Seu perfil não permite editar');return;}
  state.editing=true;state.beforeEdit=capture(article);
  article.classList.add('bc-editor-active');
  article.setAttribute('contenteditable','true');
  article.setAttribute('spellcheck','true');
  article.setAttribute('lang','pt-BR');
  article.setAttribute('autocapitalize','sentences');
  article.setAttribute('autocorrect','on');
  article.querySelectorAll(PROTECTED).forEach(function(n){n.setAttribute('contenteditable','false')});
  state.keyHandler=function(e){headingEnterToParagraph(article,e)};
  article.addEventListener('keydown',state.keyHandler);
  state.imageClickHandler=function(e){
    var figure=e.target.closest&&e.target.closest('.bc-editor-image');
    if(!figure)return;
    clearImageSelection(article);figure.classList.add('is-selected');
  };
  article.addEventListener('click',state.imageClickHandler);
  var tools=toolsFor(overlay);
  var bar=makeEditorBar(overlay,article,state);
  state.bar=bar;
  (tools&&tools.parentElement?tools.parentElement:overlay).insertBefore(bar,tools?tools.nextSibling:overlay.firstChild);
  state.button.textContent='Editando…';state.button.disabled=true;
  article.focus({preventScroll:true});
}
function exitEdit(overlay,article,state){
  state.editing=false;
  article.removeAttribute('contenteditable');article.removeAttribute('spellcheck');article.removeAttribute('autocapitalize');article.removeAttribute('autocorrect');article.classList.remove('bc-editor-active');
  article.querySelectorAll(PROTECTED).forEach(function(n){n.removeAttribute('contenteditable')});
  if(state.keyHandler){article.removeEventListener('keydown',state.keyHandler);state.keyHandler=null}
  if(state.imageClickHandler){article.removeEventListener('click',state.imageClickHandler);state.imageClickHandler=null}
  clearImageSelection(article);
  clearSpellHighlights(article);
  if(state.spellPanel){state.spellPanel.remove();state.spellPanel=null;state.spellMatches=[]}
  if(state.bar){state.bar.remove();state.bar=null}
  state.button.disabled=false;state.button.textContent='✎ Editar';
}
function addReset(overlay,article,state,tools){
  var btn=document.createElement('button');btn.type='button';btn.className='bc-editor-reset';btn.textContent='Restaurar';
  btn.title='Remover suas alterações e voltar ao conteúdo original';
  btn.hidden=!getSaved(overlay);
  btn.addEventListener('click',function(){
    if(!confirm('Remover as alterações definitivas deste material e restaurar o conteúdo original?'))return;
    btn.disabled=true;
    cloudDelete(overlay).then(function(){
      if(state.editing)exitEdit(overlay,article,state);
      removeSaved(overlay);applySnapshot(article,state.sourceSnapshot);btn.hidden=true;
      toast('Conteúdo original restaurado');
    }).catch(function(err){
      toast(err.message||'Falha ao restaurar');
    }).finally(function(){btn.disabled=false});
  });
  tools.appendChild(btn);state.reset=btn;
}
function mount(overlay){
  if(mounted.has(overlay))return;
  var article=articleFor(overlay),tools=toolsFor(overlay);if(!article||!tools)return;
  mounted.add(overlay);
  var state={editing:false,sourceSnapshot:capture(article),beforeEdit:'',bar:null,button:null,reset:null,cloudRevision:0,keyHandler:null,imageClickHandler:null,spellPanel:null,spellMatches:[]};
  var saved=getSaved(overlay);if(saved)applySnapshot(article,saved);
  cloudGet(overlay).then(function(remote){
    if(!remote||state.editing)return;
    applySnapshot(article,remote.html);setSaved(overlay,remote.html);state.cloudRevision=remote.revision||0;
    if(state.reset)state.reset.hidden=false;
  });
  if(!canEdit)return;
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
async function start(){await loadAuth();scan();new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true})}
window.addEventListener('central-cloud-applied',function(){setTimeout(scan,0)});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();