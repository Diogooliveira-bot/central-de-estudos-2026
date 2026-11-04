/* Base Completa — Editor Premium (laboratorio isolado).
 * Mantem o HTML legado e os componentes interativos existentes.
 * O aluno nunca recebe os controles; a publicacao exige sessao autorizada.
 */
(function(){
'use strict';
if(window.__bcPremiumEditor)return;
window.__bcPremiumEditor=true;
const PREFIX='bcpe:draft:v1:', PROTECTED='.bc-native-study-progress,.bc-native-internal-review';
const mounted=new WeakSet();
let authorized=false, isAdmin=false, active=null, editorTimer=null, toastTimer=null;

function hash(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return(h>>>0).toString(36)}
function identity(overlay){
 const t=overlay.querySelector('.bc-native-reader-title b,.cf-native-shell>header b');
 const s=overlay.querySelector('.bc-native-reader-title small,.cf-native-shell>header small');
 return location.pathname+'|'+(t?t.textContent.trim():'material')+'|'+(s?s.textContent.trim():'');
}
function contentId(o){return 'reader:'+hash(identity(o))}
function articleFor(o){return o.querySelector('.bc-native-article,.cf-native-reader article')}
function toolsFor(o){return o.querySelector('.bc-native-reader-tools,.cf-native-reader>aside')}
function notify(msg){
 let el=document.querySelector('.bcpe-toast');
 if(!el){el=document.createElement('div');el.className='bcpe-toast';document.body.appendChild(el)}
 el.textContent=msg;el.classList.add('show');clearTimeout(toastTimer);
 toastTimer=setTimeout(function(){el.classList.remove('show')},3500);
}
async function api(url,options){
 const response=await fetch(url,Object.assign({credentials:'same-origin',cache:'no-store'},options||{}));
 let value={};try{value=await response.json()}catch(_){}
 if(!response.ok){const err=new Error(value.error||'Não foi possível concluir a operação');err.status=response.status;throw err}
 return value;
}
function clean(root){
 // Ícones SVG do material são preservados; apenas partes que executam código ou animam links são removidas.
 root.querySelectorAll('script,iframe,object,embed,form,math,style,link,meta,base,foreignObject,foreignobject,animate,set,animateMotion,animatemotion,animateTransform,animatetransform').forEach(n=>n.remove());
 root.querySelectorAll('*').forEach(function(el){
   Array.from(el.attributes).forEach(function(a){
     const n=a.name.toLowerCase(),v=a.value.trim();
     if(n.startsWith('on')||n==='srcdoc'||n==='formaction'||n==='autofocus'||n==='contenteditable'||n==='spellcheck'||n==='data-bcpe-edit'){
       el.removeAttribute(a.name);return;
     }
     if((n==='src'||n==='href'||n==='xlink:href')&&/^\s*(?:javascript|vbscript|data):/i.test(v)){el.removeAttribute(a.name);return}
     if(n==='style'&&/(?:url\s*\(|expression\s*\(|@import|behavior\s*:)/i.test(v))el.removeAttribute(a.name);
   })
 });
 return root;
}
function capture(article){
 const cloned=article.cloneNode(true);
 Array.from(cloned.querySelectorAll(PROTECTED)).forEach(function(node,i){
  const slot=document.createElement('div');
  slot.setAttribute('data-bc-editor-preserve',String(i));
  node.replaceWith(slot);
 });
 cloned.querySelectorAll('[data-bc-block-editor-ui],.bcpe-toolbar,.bcpe-tools').forEach(n=>n.remove());
 cloned.querySelectorAll('[data-bc-editable]').forEach(n=>{
  n.removeAttribute('data-bc-editable');n.removeAttribute('contenteditable');n.removeAttribute('spellcheck');n.removeAttribute('lang');
 });
 cloned.querySelectorAll('.bc-block-selected,[data-bc-spell-error]').forEach(n=>n.classList.remove('bc-block-selected','bc-spell-error'));
 cloned.querySelectorAll('.bc-editor-image figcaption').forEach(n=>n.removeAttribute('contenteditable'));
 clean(cloned);return cloned.innerHTML;
}
function applySnapshot(article,html){
 const live=Array.from(article.querySelectorAll(PROTECTED));
 const template=document.createElement('template');
 template.innerHTML=html;
 clean(template.content);
 template.content.querySelectorAll('[data-bc-editor-preserve]').forEach(function(slot){
  const i=Number(slot.getAttribute('data-bc-editor-preserve'));
  if(live[i])slot.replaceWith(live[i]);else slot.remove();
 });
 article.replaceChildren(template.content.cloneNode(true));
}
function parseNodes(html){
 const template=document.createElement('template');template.innerHTML=html;clean(template.content);
 return Array.from(template.content.children).map(n=>n.cloneNode(true));
}
function draftKey(id){return PREFIX+id}
function draftRead(id){try{return JSON.parse(localStorage.getItem(draftKey(id))||'null')}catch(_){return null}}
function draftWrite(state){
 try{localStorage.setItem(draftKey(state.id),JSON.stringify({html:serialize(state),revision:state.revision,at:Date.now()}))}catch(_){}
}
function draftClear(id){try{localStorage.removeItem(draftKey(id))}catch(_){}}
function markFields(node){
 const fieldTags='p,h1,h2,h3,h4,h5,h6,li,blockquote,figcaption,td,th';
 const tag=node.tagName.toLowerCase();
 const editableRoot=/^(p|h1|h2|h3|h4|h5|h6|blockquote|ul|ol|pre)$/.test(tag);
 if(editableRoot&&tag!=='ul'&&tag!=='ol'){
  node.setAttribute('contenteditable','true');node.setAttribute('data-bcpe-edit','true');
 }else{
  const children=Array.from(node.querySelectorAll(fieldTags));
  const leaf=children.filter(el=>!Array.from(el.children).some(ch=>ch.matches(fieldTags)));
  leaf.forEach(el=>{if(!isAdmin&&node.matches('figure'))return;el.setAttribute('contenteditable','true');el.setAttribute('data-bcpe-edit','true')});
  // Texto solto em caixas (div/aside sem parágrafo) também precisa ser editável.
  const blockish=fieldTags+',[data-bcpe-edit],div,section,aside,article,table,ul,ol,figure,img,svg,button,input,select,textarea,video,audio,[data-bc-editor-preserve]';
  [node,...node.querySelectorAll('div,section,aside,dd,dt,span,small,strong,em,b,label')].forEach(function(el){
   if(!isAdmin&&node.matches('figure'))return;
   if(el.closest('[data-bcpe-edit],[data-bc-editor-preserve],button,select,a'))return;
   if(el.querySelector(blockish))return;
   if(!Array.from(el.childNodes).some(n=>n.nodeType===3&&n.nodeValue.trim()))return;
   el.setAttribute('contenteditable','true');el.setAttribute('data-bcpe-edit','true');
  });
  // Estruturas desconhecidas continuam preservadas, sem permitir editar HTML de componentes JS.
 }
 node.querySelectorAll('img,svg,button,input,select,video,audio').forEach(el=>el.setAttribute('contenteditable','false'));
 if(node.matches('[data-bc-editor-preserve]'))node.setAttribute('contenteditable','false');
}
function getType(node){
 if(node.matches('[data-bc-editor-preserve]'))return 'Componente protegido';
 if(node.matches('.bcpe-educational'))return 'Card educativo';
 if(node.matches('.bc-editor-cards,.bc-editor-compare'))return 'Grupo de cards';
 if(node.matches('.bc-editor-review-box'))return 'Caixa de revisão';
 if(node.matches('figure')){
  const descendants=node.querySelectorAll('p,h1,h2,h3,h4,li,td,th');
  return descendants.length>2?'Seção ilustrada · textos independentes':'Imagem';
 }
 if(node.matches('table,.bc-editor-table-wrap,.adm-table-scroll'))return 'Tabela';
 const names={p:'Parágrafo',h1:'Título 1',h2:'Título 2',h3:'Título 3',h4:'Título 4',ul:'Lista',ol:'Lista numerada',blockquote:'Citação'};
 return names[node.tagName.toLowerCase()]||'Bloco especial';
}
function block(node){
 const box=document.createElement('section');box.className='bcpe-block';
 if(node.matches('figure,section,div')&&node.querySelectorAll('p,h1,h2,h3,h4,li,td,th').length>2)box.classList.add('bcpe-block-composite');
 const top=document.createElement('header');top.className='bcpe-block-head';
 const label=document.createElement('span');label.className='bcpe-block-name';label.textContent=getType(node);
 const commands=document.createElement('div');commands.className='bcpe-block-actions';
 // Seções compostas podem conter imagem, tabelas e diversos capítulos.
 // Nunca oferecer exclusão/duplicação em um clique para o conjunto inteiro.
 const composite=box.classList.contains('bcpe-block-composite');
 const options=composite?[['up','↑','Mover seção para cima'],['down','↓','Mover seção para baixo']]:
  [['up','↑','Mover para cima'],['down','↓','Mover para baixo'],['duplicate','⧉','Duplicar'],['delete','×','Excluir bloco']];
 if(node.matches('table,.bc-editor-table-wrap,.adm-table-scroll'))options.unshift(['table-row','+ Linha','Adicionar linha abaixo da célula atual'],['table-row-remove','− Linha','Excluir a linha da célula atual'],['table-col','+ Coluna','Adicionar coluna à direita da célula atual'],['table-col-remove','− Coluna','Excluir a coluna da célula atual']);
 if(isAdmin&&!composite&&node.matches('figure.bc-editor-image'))options.unshift(['image-small','P','Imagem pequena'],['image-medium','M','Imagem média'],['image-full','G','Imagem em largura total'],['image-alt','Descrição','Descrição acessível da imagem'],['image-replace','Trocar','Substituir imagem']);
 options.forEach(function(item){
  const b=document.createElement('button');b.type='button';b.dataset.action=item[0];b.textContent=item[1];b.title=item[2];b.setAttribute('aria-label',item[2]);commands.appendChild(b);
 });
 top.append(label,commands);box.append(top);
 node.classList.add('bcpe-node');markFields(node);box.appendChild(node);return box;
}
function blocks(state){return Array.from(state.workspace.children).filter(el=>el.classList.contains('bcpe-block'))}
function select(state,box){
 if(!box)return;
 state.workspace.querySelectorAll('.bcpe-block.selected').forEach(el=>el.classList.remove('selected'));
 box.classList.add('selected');state.selected=box;
 const node=box.querySelector(':scope > .bcpe-node');
 const label=box.querySelector('.bcpe-block-name');if(label&&node)label.textContent=getType(node);
 if(state.currentField&&!box.contains(state.currentField))state.currentField=null;
 updateContext(state);

}
function serialize(state){
 const doc=document.createElement('div');
 blocks(state).forEach(function(box){
  const node=box.querySelector(':scope > .bcpe-node');if(!node)return;
  const cloned=node.cloneNode(true);
  cloned.classList.remove('bcpe-node','bcpe-field-selected');
  cloned.querySelectorAll('.bcpe-field-selected').forEach(el=>el.classList.remove('bcpe-field-selected'));
  cloned.querySelectorAll('[data-bcpe-edit]').forEach(el=>{el.removeAttribute('data-bcpe-edit');el.removeAttribute('contenteditable')});
  cloned.removeAttribute('contenteditable');cloned.removeAttribute('data-bcpe-edit');
  clean(cloned);
  doc.appendChild(cloned);
 });
 return doc.innerHTML;
}
function historyPush(state){
 const value=serialize(state);if(value===state.snapshots[state.cursor])return;
 state.snapshots.splice(state.cursor+1);state.snapshots.push(value);
 if(state.snapshots.length>40)state.snapshots.shift();
 state.cursor=state.snapshots.length-1;
}
function renderSnapshot(state,html){
 state.workspace.replaceChildren(...parseNodes(html).map(block));
 select(state,blocks(state)[0]);state.dirty=true;queueDraft(state);
}
function fields(state){return Array.from(state.workspace.querySelectorAll('[data-bcpe-edit]'))}
function placeCaret(el,atEnd){
 if(!el)return;
 try{el.focus({preventScroll:true})}catch(_){el.focus()}
 const range=document.createRange();range.selectNodeContents(el);range.collapse(!atEnd);
 const sel=window.getSelection();sel.removeAllRanges();sel.addRange(range);
}
// Grava imediatamente o que foi digitado antes de uma ação, para o Desfazer voltar só um passo.
function checkpoint(state){clearTimeout(editorTimer);historyPush(state)}
function undo(state,dir){
 checkpoint(state);
 const dest=state.cursor+dir;if(dest<0||dest>=state.snapshots.length)return notify('Sem mais alterações nesse sentido');
 const list=fields(state),index=Math.max(0,list.indexOf(currentEditable(state)));
 state.cursor=dest;
 state.workspace.replaceChildren(...parseNodes(state.snapshots[state.cursor]).map(block));
 const after=fields(state),target=after[Math.min(index,after.length-1)];
 select(state,target?target.closest('.bcpe-block'):blocks(state)[0]);
 if(target){state.currentField=target;placeCaret(target,true);updateContext(state)}
 // Normaliza a foto atual para que um novo Desfazer/Refazer não apague o caminho de volta.
 state.snapshots[state.cursor]=serialize(state);
 state.dirty=true;draftWrite(state);state.status.textContent='Rascunho salvo neste navegador';
}
function queueDraft(state){
 state.dirty=true;state.status.textContent='Rascunho não publicado';
 clearTimeout(editorTimer);
 editorTimer=setTimeout(function(){historyPush(state);draftWrite(state);state.status.textContent='Rascunho salvo neste navegador'},650);
}
function add(state,node,after){
 const box=block(node),reference=after||state.selected;
 if(reference&&reference.parentElement===state.workspace)reference.insertAdjacentElement('afterend',box);
 else state.workspace.appendChild(box);
 select(state,box);queueDraft(state);
 const field=box.querySelector('[data-bcpe-edit]');if(field)field.focus();
 return box;
}
function richNode(kind){
 const node=document.createElement(kind);node.textContent=kind.startsWith('h')?'Novo título':'Escreva seu texto aqui.';return node;
}
function cardNode(kind){
 const labels={atencao:'ATENÇÃO',decore:'DECORE',pegadinha:'PEGADINHA',exemplo:'EXEMPLO',resumo:'RESUMO'};
 const outer=document.createElement('aside');
 outer.className='bcpe-educational bcpe-kind-'+kind;
 const title=document.createElement('h4');title.textContent=labels[kind]||'ATENÇÃO';
 const text=document.createElement('p');text.textContent='Clique para editar o conteúdo deste card.';
 outer.append(title,text);return outer;
}
function tableNode(){
 const wrap=document.createElement('div');wrap.className='bc-editor-table-wrap';
 const table=document.createElement('table');table.className='bc-editor-table';
 const body=document.createElement('tbody');
 for(let r=0;r<3;r++){const tr=document.createElement('tr');for(let c=0;c<2;c++){const td=document.createElement(r===0?'th':'td');td.textContent=r===0?'Cabeçalho '+(c+1):'Conteúdo';tr.appendChild(td)}body.appendChild(tr)}
 table.appendChild(body);wrap.appendChild(table);return wrap;
}
function fieldFromRange(state,range){
 if(!range||!range.startContainer||!range.endContainer)return null;
 const root=range.commonAncestorContainer.nodeType===1?range.commonAncestorContainer:range.commonAncestorContainer.parentElement;
 const field=root&&root.closest('[data-bcpe-edit]');
 if(!field||!field.isConnected||!state.workspace.contains(field))return null;
 if(!field.contains(range.startContainer)||!field.contains(range.endContainer))return null;
 return field;
}
function getSelectionRange(state){
 const selection=window.getSelection();if(!selection||!selection.rangeCount||selection.isCollapsed)return null;
 const range=selection.getRangeAt(0);
 return fieldFromRange(state,range)?range:null;
}
function rememberSelection(state){
 const range=getSelectionRange(state);
 if(!range)return;
 state.savedRange=range.cloneRange();
 state.currentField=fieldFromRange(state,range);
 updateContext(state);
}
function currentEditable(state){
 const field=state.currentField;
 if(field&&field.isConnected&&state.workspace.contains(field)&&field.hasAttribute('data-bcpe-edit'))return field;
 const selected=state.selected&&state.selected.querySelector(':scope > .bcpe-node');
 return selected&&selected.matches('[data-bcpe-edit]')?selected:null;
}
function fieldLabel(field){
 if(!field)return 'Clique em um parágrafo para editar';
 const names={p:'Parágrafo',h1:'Título 1',h2:'Título 2',h3:'Título 3',h4:'Título 4',li:'Item de lista',td:'Célula da tabela',th:'Cabeçalho da tabela',figcaption:'Legenda',blockquote:'Citação'};
 return 'Editando: '+(names[field.tagName.toLowerCase()]||'Trecho de texto');
}
function updateContext(state){
 const field=currentEditable(state);
 if(state.typeSelect)state.typeSelect.value=field&&/^(P|H1|H2|H3|BLOCKQUOTE)$/.test(field.tagName)?field.tagName.toLowerCase():'';
 if(state.context)state.context.textContent=fieldLabel(field);
 if(state.workspace){
  state.workspace.querySelectorAll('.bcpe-field-selected').forEach(x=>x.classList.remove('bcpe-field-selected'));
  if(field)field.classList.add('bcpe-field-selected');
 }
 updateFormatButtons(state);
}
function styleSelected(state,tag,styles){
 const live=getSelectionRange(state);
 const remembered=state.savedRange&&fieldFromRange(state,state.savedRange)?state.savedRange.cloneRange():null;
 const range=live||remembered;
 const field=range?fieldFromRange(state,range):currentEditable(state);
 if(!field)return notify('Clique no parágrafo desejado ou selecione um trecho antes de formatar.');
 if(!range){
  // Without a selection, Word-like behavior: format only the active paragraph.
  if(styles&&Object.keys(styles).length){
   Object.entries(styles).forEach(([k,v])=>field.style.setProperty(k.replace(/[A-Z]/g,m=>'-'+m.toLowerCase()),v,'important'));
  }else{
   const el=document.createElement(tag);
   while(field.firstChild)el.appendChild(field.firstChild);
   field.appendChild(el);
  }
  queueDraft(state);updateContext(state);
  notify('Formato aplicado apenas ao parágrafo ativo.');
  return;
 }
 const el=document.createElement(tag);
 Object.entries(styles||{}).forEach(([k,v])=>el.style[k]=v);
 try{
  el.appendChild(range.extractContents());range.insertNode(el);
  const sel=window.getSelection();sel.removeAllRanges();
  const newRange=document.createRange();newRange.selectNodeContents(el);sel.addRange(newRange);
  state.savedRange=newRange.cloneRange();state.currentField=field;
  queueDraft(state);updateContext(state);
 }catch(_){notify('Não foi possível formatar esta seleção. Selecione um trecho menor.')}
}
const FORMAT_MATCH={strong:'strong,b',em:'em,i',u:'u',mark:'mark'};
function textNodesIn(range,field){
 const out=[],walker=document.createTreeWalker(field,NodeFilter.SHOW_TEXT);let n;
 while((n=walker.nextNode())){
  if(!n.nodeValue||!range.intersectsNode(n))continue;
  const start=n===range.startContainer?range.startOffset:0,end=n===range.endContainer?range.endOffset:n.nodeValue.length;
  if(end>start&&n.nodeValue.slice(start,end).trim())out.push(n);
 }
 return out;
}
function formatActive(range,field,tag){
 const selector=FORMAT_MATCH[tag];if(!selector||!range||!field)return false;
 const within=n=>{const el=(n.nodeType===1?n:n.parentElement);const hit=el&&el.closest(selector);return !!(hit&&field.contains(hit))};
 if(range.collapsed)return within(range.startContainer);
 const nodes=textNodesIn(range,field);
 return nodes.length>0&&nodes.every(within);
}
// Sem seleção, como no Word, B/I/U/Destaque valem para a palavra onde está o cursor.
function wordRange(range,field){
 const node=range.startContainer;
 if(node.nodeType!==3||!field.contains(node))return null;
 const text=node.nodeValue,isWord=c=>/[\p{L}\p{N}_-]/u.test(c);
 let s=range.startOffset,e=range.startOffset;
 while(s>0&&isWord(text[s-1]))s--;
 while(e<text.length&&isWord(text[e]))e++;
 if(s===e)return null;
 const r=document.createRange();r.setStart(node,s);r.setEnd(node,e);return r;
}
function unwrap(el){el.replaceWith(...Array.from(el.childNodes))}
function removeFormat(range,field,selector){
 const startMark=document.createElement('span'),endMark=document.createElement('span');
 const endRange=range.cloneRange();endRange.collapse(false);endRange.insertNode(endMark);
 const startRange=range.cloneRange();startRange.collapse(true);startRange.insertNode(startMark);
 Array.from(field.querySelectorAll(selector)).forEach(function(el){
  if(!el.isConnected)return;
  const r=document.createRange();r.setStartBefore(startMark);r.setEndAfter(endMark);
  if(!r.intersectsNode(el))return;
  if(el.contains(startMark)){
   const before=document.createRange();before.setStart(el,0);before.setEndBefore(startMark);
   const part=before.extractContents();
   if(part.textContent){const copy=el.cloneNode(false);copy.appendChild(part);el.before(copy)}
  }
  if(el.contains(endMark)){
   const after=document.createRange();after.setStartAfter(endMark);after.setEnd(el,el.childNodes.length);
   const part=after.extractContents();
   if(part.textContent){const copy=el.cloneNode(false);copy.appendChild(part);el.after(copy)}
  }
  unwrap(el);
 });
 const result=document.createRange();result.setStartAfter(startMark);result.setEndBefore(endMark);
 const sel=window.getSelection();sel.removeAllRanges();sel.addRange(result);
 const saved=result.cloneRange();
 startMark.remove();endMark.remove();field.normalize();
 return saved;
}
function toggleInline(state,tag){
 const live=getSelectionRange(state)||collapsedRange(state);
 const remembered=state.savedRange&&fieldFromRange(state,state.savedRange)?state.savedRange.cloneRange():null;
 let range=live||remembered;
 const field=range?fieldFromRange(state,range):null;
 if(!field)return notify('Clique no texto ou selecione o trecho que deseja formatar.');
 checkpoint(state);
 if(range.collapsed){
  const word=wordRange(range,field);
  if(!word)return notify('Selecione o trecho que deseja formatar.');
  range=word;
 }
 const selector=FORMAT_MATCH[tag];
 let next;
 try{
  if(formatActive(range,field,tag)){
   next=removeFormat(range,field,selector);
  }else{
   const el=document.createElement(tag),part=range.extractContents();
   part.querySelectorAll(selector).forEach(unwrap);
   el.appendChild(part);range.insertNode(el);
   next=document.createRange();next.selectNodeContents(el);
   const sel=window.getSelection();sel.removeAllRanges();sel.addRange(next);
  }
 }catch(_){return notify('Não foi possível formatar esta seleção. Selecione um trecho menor.')}
 state.savedRange=next?next.cloneRange():null;state.currentField=field;
 queueDraft(state);updateContext(state);
}
function collapsedRange(state){
 const sel=window.getSelection();if(!sel||!sel.rangeCount)return null;
 const range=sel.getRangeAt(0);
 return range.collapsed&&fieldFromRange(state,range)?range:null;
}
function updateFormatButtons(state){
 if(!state.dialog)return;
 const sel=window.getSelection(),range=sel&&sel.rangeCount?sel.getRangeAt(0):null;
 const field=range?fieldFromRange(state,range):null;
 state.dialog.querySelectorAll('.bcpe-toolbar [data-format]').forEach(function(b){
  const on=!!field&&formatActive(range,field,b.dataset.format);
  b.classList.toggle('is-active',on);b.setAttribute('aria-pressed',on?'true':'false');
 });
}
function nearestEditable(state){
 const sel=window.getSelection();
 if(sel&&sel.rangeCount){
  const range=sel.getRangeAt(0),field=fieldFromRange(state,range);
  if(field)return field;
 }
 return currentEditable(state);
}
function selectedNode(state){return state.selected&&state.selected.querySelector(':scope > .bcpe-node')}
function changeType(state,tag){
 const old=nearestEditable(state);
 if(!old||!/^(P|H1|H2|H3|H4|BLOCKQUOTE)$/.test(old.tagName)){
  if(state.typeSelect)state.typeSelect.value='';
  return notify('Clique dentro de um parágrafo ou título para alterar o estilo.');
 }
 if(old.tagName.toLowerCase()===tag)return;
 const wasTopLevel=old.classList.contains('bcpe-node');
 const newNode=document.createElement(tag);newNode.innerHTML=old.innerHTML;
 Array.from(old.attributes).forEach(a=>{if(!['contenteditable','data-bcpe-edit','class'].includes(a.name))newNode.setAttribute(a.name,a.value)});
 // Remove the legacy monospace font when converting a code-like paragraph to a heading.
 if(tag!=='p'){newNode.style.removeProperty('font-family');newNode.style.removeProperty('font-size')}
 newNode.className=old.className;
 if(wasTopLevel)newNode.classList.add('bcpe-node');
 old.replaceWith(newNode);
 newNode.setAttribute('contenteditable','true');newNode.setAttribute('data-bcpe-edit','true');
 if(wasTopLevel)markFields(newNode);
 state.currentField=newNode;state.savedRange=null;
 select(state,newNode.closest('.bcpe-block'));newNode.focus();updateContext(state);queueDraft(state);
}
function applyParagraphStyle(state,name,value){
 const field=nearestEditable(state);
 if(!field)return notify('Clique no parágrafo desejado para ajustar o alinhamento ou espaçamento.');
 if(name==='textAlign')field.style.textAlign=value;
 if(name==='lineHeight')field.style.lineHeight=value;
 state.currentField=field;queueDraft(state);updateContext(state);
}
function clearParagraphFormatting(state){
 const field=nearestEditable(state);
 if(!field)return notify('Selecione primeiro o parágrafo que deseja normalizar.');
 const nodes=Array.from(field.querySelectorAll('span,font,code'));
 nodes.reverse().forEach(n=>n.replaceWith(...Array.from(n.childNodes)));
 field.removeAttribute('style');
 field.querySelectorAll('[style]').forEach(n=>n.removeAttribute('style'));
 field.normalize();
 state.currentField=field;state.savedRange=null;queueDraft(state);updateContext(state);
 notify('Formatação de fonte normalizada neste parágrafo, sem alterar outros blocos.');
}
function safeInlinePaste(state,event){
 const field=event.target.closest('[data-bcpe-edit]');if(!field)return;
 const clipboard=event.clipboardData;if(!clipboard)return;
 const html=clipboard.getData('text/html'),plain=clipboard.getData('text/plain');
 const fragments=html?htmlToNodes(html):textToNodes(plain);
 if(!fragments.length)return;
 event.preventDefault();
 if(fragments.length===1&&fragments[0].tagName==='P'&&!/\n/.test(plain)){
  const selection=window.getSelection(),range=selection&&selection.rangeCount?selection.getRangeAt(0):null;
  if(range&&field.contains(range.commonAncestorContainer)){
    range.deleteContents();
    const frag=document.createDocumentFragment();
    Array.from(fragments[0].childNodes).forEach(n=>frag.appendChild(n.cloneNode(true)));
    range.insertNode(frag);queueDraft(state);return;
  }
 }
 const current=field.closest('.bcpe-block');let after=current;
 fragments.forEach(n=>{after=add(state,n,after)});
 notify(fragments.length+' bloco(s) inserido(s), sem misturar os títulos.');
}
function inlineMd(text){
 const frag=document.createDocumentFragment(), pattern=/(\*\*([^*]+)\*\*|\*([^*]+)\*)/g;
 let i=0,m;while((m=pattern.exec(text))!==null){
  if(m.index>i)frag.append(document.createTextNode(text.slice(i,m.index)));
  const tag=document.createElement(m[2]?'strong':'em');tag.textContent=m[2]||m[3];frag.append(tag);i=pattern.lastIndex;
 }
 if(i<text.length)frag.append(document.createTextNode(text.slice(i)));
 return frag;
}
function textToNodes(text){
 const lines=String(text||'').replace(/\r\n?/g,'\n').split('\n'),out=[];let list=null;
 lines.forEach(function(raw){
  const line=raw.trim();
  if(!line){list=null;return}
  const heading=line.match(/^(#{1,4})\s+(.+)$/);
  const bullet=line.match(/^[-*•]\s+(.+)$/);
  const numbered=line.match(/^\d+[.)]\s+(.+)$/);
  if(heading){const n=document.createElement('h'+Math.min(4,heading[1].length));n.append(inlineMd(heading[2]));out.push(n);list=null}
  else if(bullet||numbered){
   const tag=bullet?'ul':'ol';if(!list||list.tagName.toLowerCase()!==tag){list=document.createElement(tag);out.push(list)}
   const li=document.createElement('li');li.append(inlineMd((bullet||numbered)[1]));list.appendChild(li);
  }else{const n=document.createElement('p');n.append(inlineMd(line));out.push(n);list=null}
 });
 return out;
}
function htmlToNodes(html){
 const tpl=document.createElement('template');tpl.innerHTML=html;clean(tpl.content);
 const allowed=new Set(['p','h1','h2','h3','h4','ul','ol','blockquote','table','pre']);
 const found=[];
 const roots=Array.from(tpl.content.children);
 roots.forEach(function(n){
  if(allowed.has(n.tagName.toLowerCase()))found.push(n.cloneNode(true));
  else{
   const descendants=Array.from(n.querySelectorAll('p,h1,h2,h3,h4,ul,ol,blockquote,table,pre'));
   const top=descendants.filter(x=>!x.parentElement.closest('p,h1,h2,h3,h4,ul,ol,blockquote,table,pre'));
   top.forEach(x=>found.push(x.cloneNode(true)));
  }
 });
 if(!found.length)return textToNodes(tpl.content.textContent||'');
 // Descarta classes e estilos colados do Word para manter o design da Central.
 found.forEach(function(root){
  [root,...root.querySelectorAll('*')].forEach(function(n){
   if(n.nodeType!==1)return;
   for(const a of Array.from(n.attributes)){
    if(!['href','colspan','rowspan'].includes(a.name))n.removeAttribute(a.name);
   }
   if(n.tagName==='IMG')n.remove();
  });
 });
 return found.slice(0,200);
}
function showPasteDialog(state){
 const backdrop=document.createElement('div');backdrop.className='bcpe-paste-dialog';
 const panel=document.createElement('div');panel.className='bcpe-paste-panel';
 const title=document.createElement('h3');title.textContent='Importar capítulo';
 const hint=document.createElement('p');hint.textContent='Cole aqui o texto do Word ou Markdown. Títulos, listas e parágrafos serão transformados em blocos independentes.';
 const area=document.createElement('textarea');area.rows=13;area.placeholder='## 1. Conceito e finalidade\n\nTexto do capítulo...';
 const actions=document.createElement('div');actions.className='bcpe-paste-actions';
 const cancel=document.createElement('button');cancel.textContent='Cancelar';cancel.type='button';
 const confirm=document.createElement('button');confirm.textContent='Inserir conteúdo';confirm.type='button';confirm.className='bcpe-primary';
 cancel.onclick=function(){backdrop.remove()};
 confirm.onclick=function(){
  if(!area.value.trim())return notify('Cole o texto do capítulo primeiro.');
  const nodes=textToNodes(area.value);
  if(nodes.length>300)return notify('Este capítulo é muito grande para uma importação. Divida-o em partes.');
  let after=state.selected;nodes.forEach(function(n){after=add(state,n,after)});
  backdrop.remove();notify(nodes.length+' blocos importados.');
 };
 actions.append(cancel,confirm);panel.append(title,hint,area,actions);backdrop.appendChild(panel);
 backdrop.addEventListener('click',function(e){if(e.target===backdrop)backdrop.remove()});
 state.dialog.appendChild(backdrop);area.focus();
}
async function showVersions(state){
 try{
  const result=await api('/api/content-editor?action=history&id='+encodeURIComponent(state.id));
  const list=(result.versions||[]).slice(0,25);
  if(!list.length)return notify('Este módulo ainda não possui versões publicadas.');
  const desc=list.map(x=>x.revision+' — '+new Date(x.archivedAt).toLocaleString('pt-BR')).join('\n');
  const selected=window.prompt('Histórico do módulo:\n'+desc+'\n\nDigite o número da versão para carregar como rascunho (não publica automaticamente):','');
  if(selected===null||selected.trim()==='')return;
  const revision=Number(selected);if(!Number.isSafeInteger(revision)||!list.some(x=>x.revision===revision))return notify('Selecione uma das revisões exibidas.');
  const version=await api('/api/content-editor?action=history&id='+encodeURIComponent(state.id)+'&revision='+revision);
  if(!window.confirm('Carregar a versão '+revision+' no editor? Você ainda precisará clicar em Publicar conteúdo.'))return;
  historyPush(state);renderSnapshot(state,version.html);historyPush(state);
  notify('Revisão '+revision+' carregada como rascunho.');
 }catch(err){notify(err.message||'Não foi possível consultar o histórico.')}
}
async function uploadImage(state,file){
 if(!isAdmin)return notify('Somente o administrador pode incluir ou alterar imagens.');
 if(!file||!/^image\/(jpeg|png|webp)$/i.test(file.type)||file.size>15*1024*1024)return notify('Use uma imagem JPG, PNG ou WebP de até 15 MB.');
 const url=URL.createObjectURL(file);
 try{
  const img=new Image();await new Promise(function(resolve,reject){img.onload=resolve;img.onerror=reject;img.src=url});
  const ratio=Math.min(1,1600/Math.max(img.naturalWidth,img.naturalHeight));
  const canvas=document.createElement('canvas');canvas.width=Math.round(img.naturalWidth*ratio);canvas.height=Math.round(img.naturalHeight*ratio);
  canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);
  const dataUrl=canvas.toDataURL('image/webp',.78);
  const result=await api('/api/content-editor?action=image',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({contentId:state.id,dataUrl})});
  const target=state.replaceTarget;state.replaceTarget=null;
  if(target&&target.isConnected&&target.querySelector('img')){
   checkpoint(state);target.querySelector('img').src=result.url;queueDraft(state);
   return notify('Imagem substituída no rascunho.');
  }
  const figure=document.createElement('figure');figure.className='bc-editor-image bc-editor-image-full';
  const picture=document.createElement('img');picture.src=result.url;picture.alt='Ilustração do módulo';picture.loading='lazy';
  const caption=document.createElement('figcaption');caption.textContent='Legenda da imagem';
  checkpoint(state);figure.append(picture,caption);add(state,figure);notify('Imagem adicionada ao rascunho.');
 }catch(err){notify(err.message||'Falha ao carregar imagem.')}finally{URL.revokeObjectURL(url)}
}
function caretAt(field,range,edge){
 const probe=document.createRange();probe.selectNodeContents(field);
 if(edge==='start')probe.setEnd(range.startContainer,range.startOffset);
 else probe.setStart(range.endContainer,range.endOffset);
 return !probe.toString().length&&!probe.cloneContents().querySelector('img,svg,br:not(:last-child)');
}
function fillEmpty(el){if(!el.textContent&&!el.querySelector('img,svg,br'))el.appendChild(document.createElement('br'))}
function makeField(el){el.setAttribute('contenteditable','true');el.setAttribute('data-bcpe-edit','true');return el}
function insertBreak(range){
 range.deleteContents();
 const br=document.createElement('br');range.insertNode(br);
 // O navegador só mostra a linha nova se houver algo depois do último <br>.
 if(!br.nextSibling||(br.nextSibling.nodeType===3&&!br.nextSibling.nodeValue&&!br.nextSibling.nextSibling))br.after(document.createElement('br'));
 const after=document.createRange();after.setStartAfter(br);after.collapse(true);
 const sel=window.getSelection();sel.removeAllRanges();sel.addRange(after);
}
function splitAtCaret(field,range){
 range.deleteContents();
 const rest=document.createRange();rest.setStart(range.startContainer,range.startOffset);rest.setEnd(field,field.childNodes.length);
 return rest.extractContents();
}
// Enter cria um parágrafo/item novo, como no Word; Shift+Enter quebra a linha.
function pressEnter(state,field,range){
 const tag=field.tagName;
 const topLevel=field.classList.contains('bcpe-node');
 if(tag==='LI'){
  const list=field.parentElement;
  if(!field.textContent.trim()&&!field.querySelector('img,svg')){
   // Item vazio: sai da lista e continua com um parágrafo normal.
   field.remove();
   const box=list.closest('.bcpe-block');
   const p=makeField(document.createElement('p'));fillEmpty(p);
   if(list.classList.contains('bcpe-node')){
    add(state,p,box);
    if(!list.querySelector('li'))box.remove();
    state.currentField=p;placeCaret(p,false);
   }else{list.after(p);placeCaret(p,false);if(!list.querySelector('li'))list.remove()}
   queueDraft(state);return;
  }
  const rest=splitAtCaret(field,range);
  const li=makeField(document.createElement('li'));li.appendChild(rest);
  field.after(li);fillEmpty(field);fillEmpty(li);
  state.currentField=li;placeCaret(li,false);queueDraft(state);return;
 }
 if(topLevel&&/^(P|H1|H2|H3|H4|H5|H6|BLOCKQUOTE|PRE)$/.test(tag)){
  const atEnd=caretAt(field,range,'end'),atStart=caretAt(field,range,'start');
  const rest=splitAtCaret(field,range);
  const nextTag=(/^H/.test(tag)&&atEnd&&!atStart)?'p':tag.toLowerCase();
  const node=document.createElement(nextTag);
  if(nextTag===tag.toLowerCase()&&field.getAttribute('style'))node.setAttribute('style',field.getAttribute('style'));
  node.appendChild(rest);fillEmpty(field);fillEmpty(node);
  const box=add(state,node,field.closest('.bcpe-block'));
  const created=box.querySelector(':scope > .bcpe-node');
  state.currentField=created;placeCaret(created,false);updateContext(state);return;
 }
 if(tag==='P'&&field.parentElement&&!field.closest('figure')){
  // Parágrafo dentro de card: novo parágrafo no mesmo card.
  const rest=splitAtCaret(field,range);
  const p=makeField(document.createElement('p'));p.appendChild(rest);
  field.after(p);fillEmpty(field);fillEmpty(p);
  state.currentField=p;placeCaret(p,false);queueDraft(state);return;
 }
 insertBreak(range);queueDraft(state);
}
function textField(node){return node&&/^(P|H1|H2|H3|H4|H5|H6|BLOCKQUOTE|PRE)$/.test(node.tagName)&&node.hasAttribute('data-bcpe-edit')}
function mergeInto(target,source){
 if(target.lastChild&&target.lastChild.nodeName==='BR'&&target.childNodes.length===1)target.lastChild.remove();
 const mark=document.createRange();mark.selectNodeContents(target);mark.collapse(false);
 const point=document.createElement('span');mark.insertNode(point);
 while(source.firstChild){const n=source.firstChild;if(n.nodeName==='BR'&&source.childNodes.length===1){n.remove();break}target.appendChild(n)}
 const caret=document.createRange();caret.setStartBefore(point);caret.collapse(true);point.remove();
 try{target.focus({preventScroll:true})}catch(_){}
 const sel=window.getSelection();sel.removeAllRanges();sel.addRange(caret);
}
// Backspace no início junta com o bloco de cima, como no Word.
function pressBackspace(state,field,range,e){
 if(field.tagName==='LI'){
  const prev=field.previousElementSibling;
  if(prev&&prev.tagName==='LI'){e.preventDefault();checkpoint(state);mergeInto(prev,field);field.remove();state.currentField=prev;queueDraft(state);return}
  const list=field.parentElement;
  if(!list.classList.contains('bcpe-node'))return;
  // Primeiro item: tira o marcador e vira parágrafo.
  e.preventDefault();checkpoint(state);
  const p=document.createElement('p');while(field.firstChild)p.appendChild(field.firstChild);fillEmpty(p);
  field.remove();
  const box=list.closest('.bcpe-block'),added=block(p);
  box.before(added);select(state,added);
  if(!list.querySelector('li'))box.remove();
  const created=added.querySelector(':scope > .bcpe-node');state.currentField=created;placeCaret(created,false);queueDraft(state);return;
 }
 if(!field.classList.contains('bcpe-node')||!textField(field))return;
 const box=field.closest('.bcpe-block'),prevBox=box.previousElementSibling;
 const prev=prevBox&&prevBox.classList.contains('bcpe-block')?prevBox.querySelector(':scope > .bcpe-node'):null;
 if(!prev)return;
 let target=null;
 if(textField(prev))target=prev;
 else if(/^(UL|OL)$/.test(prev.tagName)&&prev.lastElementChild&&prev.lastElementChild.hasAttribute('data-bcpe-edit'))target=prev.lastElementChild;
 e.preventDefault();checkpoint(state);
 if(target){mergeInto(target,field);box.remove();state.currentField=target;select(state,target.closest('.bcpe-block'));queueDraft(state);return}
 if(!field.textContent.trim()){
  box.remove();const fallback=prevBox.querySelector('[data-bcpe-edit]');
  select(state,prevBox);if(fallback){state.currentField=fallback;placeCaret(fallback,true)}queueDraft(state);
  return;
 }
 select(state,prevBox);notify('O bloco de cima é especial (imagem, tabela ou card) e não pode ser unido a este parágrafo.');
}
function editingKeys(state,e){
 const field=e.target.closest('[data-bcpe-edit]');if(!field||!state.workspace.contains(field))return;
 const sel=window.getSelection();if(!sel||!sel.rangeCount)return;
 const range=sel.getRangeAt(0);if(!field.contains(range.startContainer))return;
 if(e.key==='Enter'&&!e.isComposing){
  e.preventDefault();checkpoint(state);
  if(e.shiftKey){insertBreak(range);queueDraft(state);return}
  pressEnter(state,field,range);return;
 }
 if(e.key==='Backspace'&&range.collapsed&&caretAt(field,range,'start')){pressBackspace(state,field,range,e);return}
 // Setas passam de um parágrafo para o outro sem precisar clicar.
 if(e.shiftKey||e.ctrlKey||e.metaKey||e.altKey||!range.collapsed)return;
 const list=fields(state),index=list.indexOf(field);
 const back=e.key==='ArrowLeft'||e.key==='ArrowUp',fwd=e.key==='ArrowRight'||e.key==='ArrowDown';
 if(!back&&!fwd)return;
 let edge=back?caretAt(field,range,'start'):caretAt(field,range,'end');
 if(!edge&&(e.key==='ArrowUp'||e.key==='ArrowDown')){
  const caret=range.getClientRects?range.getClientRects()[0]:null,box=field.getBoundingClientRect();
  const line=parseFloat(getComputedStyle(field).lineHeight)||20;
  if(caret&&box.height)edge=e.key==='ArrowUp'?caret.top-box.top<line*.8:box.bottom-caret.bottom<line*.8;
 }
 if(!edge)return;
 const target=list[index+(back?-1:1)];if(!target)return;
 e.preventDefault();placeCaret(target,!!back);state.currentField=target;select(state,target.closest('.bcpe-block'));
}
function spellMap(state){
 let text='';const map=[];
 fields(state).forEach(function(field){
  const walker=document.createTreeWalker(field,NodeFilter.SHOW_TEXT);let n;
  while((n=walker.nextNode())){
   if(!n.nodeValue||!n.nodeValue.trim())continue;
   if(text&&!/\s$/.test(text))text+=' ';
   const start=text.length;text+=n.nodeValue;map.push({node:n,start,end:text.length});
  }
 });
 return {text,map};
}
async function spellCheck(state,button){
 const data=spellMap(state);if(!data.text.trim())return notify('Não há texto para revisar.');
 const old=button.textContent;button.disabled=true;button.textContent='Revisando…';
 try{
  const result=await api('/api/spellcheck',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:data.text,language:'pt-BR'})});
  const fixes=(result.matches||[]).filter(m=>m.replacements&&m.replacements[0]&&m.length>0);
  if(!fixes.length)return notify((result.matches||[]).length?(result.matches.length+' ponto(s) para conferir, sem sugestão automática.'):'Nenhum erro encontrado.');
  const sample=fixes.slice(0,8).map(m=>'• '+data.text.substr(m.offset,m.length)+' → '+m.replacements[0].value).join('\n');
  if(!window.confirm(fixes.length+' sugestão(ões) de correção:\n'+sample+(fixes.length>8?'\n…':'')+'\n\nAplicar todas?'))return;
  checkpoint(state);let applied=0;
  fixes.sort((a,b)=>b.offset-a.offset).forEach(function(m){
   const s=Number(m.offset)||0,e=s+Number(m.length||0);
   const item=data.map.find(x=>s>=x.start&&e<=x.end&&x.node.isConnected);
   if(!item)return;
   const v=item.node.nodeValue;item.node.nodeValue=v.slice(0,s-item.start)+m.replacements[0].value+v.slice(e-item.start);applied++;
  });
  queueDraft(state);notify(applied+' correção(ões) aplicada(s). Confira antes de publicar.');
 }catch(err){notify(err.message||'Falha na revisão ortográfica.')}
 finally{button.disabled=false;button.textContent=old}
}
async function copyAll(state,button){
 const holder=document.createElement('div');holder.innerHTML=serialize(state);
 holder.querySelectorAll('[data-bc-editor-preserve]').forEach(n=>n.remove());
 const html=holder.innerHTML,text=holder.innerText||holder.textContent||'';
 let ok=false;
 try{
  if(navigator.clipboard&&window.ClipboardItem){await navigator.clipboard.write([new ClipboardItem({'text/html':new Blob([html],{type:'text/html'}),'text/plain':new Blob([text],{type:'text/plain'})})]);ok=true}
  else if(navigator.clipboard&&navigator.clipboard.writeText){await navigator.clipboard.writeText(text);ok=true}
 }catch(_){}
 notify(ok?'Todo o capítulo foi copiado.':'Não foi possível copiar. Selecione o texto e use Ctrl+C.');
 button.blur();
}
function tableCell(state,table){
 const field=state.currentField;
 return field&&field.isConnected&&table.contains(field)&&/^(TD|TH)$/.test(field.tagName)?field:null;
}
function tableAction(state,box,cmd){
 const table=box.querySelector('table');if(!table)return notify('Tabela não encontrada.');
 checkpoint(state);
 const cell=tableCell(state,table),row=cell?cell.parentElement:table.rows[table.rows.length-1];
 const col=cell?cell.cellIndex:(row?row.cells.length-1:0);
 // Tabelas antigas guardam o número de colunas numa variável de estilo.
 const columns=function(){if(table.style.getPropertyValue('--adm-table-columns'))table.style.setProperty('--adm-table-columns',String(table.rows[0]?table.rows[0].cells.length:1))};
 if(cmd==='table-row'){
  const model=row||table.rows[0],cols=model?model.cells.length:2;
  let section,index;
  if(row&&row.parentElement.tagName!=='THEAD'){section=row.parentElement;index=row.sectionRowIndex+1}
  else{section=table.tBodies[0]||table.createTBody();index=0}
  const tr=section.insertRow(index);
  for(let i=0;i<cols;i++){const c=makeField(tr.insertCell(-1));c.textContent='Nova célula'}
 }else if(cmd==='table-row-remove'){
  const bodyRows=Array.from(table.rows).filter(r=>r.parentElement.tagName!=='THEAD');
  if(bodyRows.length<=1||!row||row.parentElement.tagName==='THEAD')return notify('A tabela precisa manter ao menos uma linha de dados (clique numa célula da linha a excluir).');
  if(!window.confirm('Excluir esta linha da tabela?'))return;
  row.remove();state.currentField=null;
 }else if(cmd==='table-col'){
  Array.from(table.rows).forEach(function(r){
   const ref=r.cells[Math.min(col,r.cells.length-1)];
   const c=makeField(document.createElement(ref&&ref.tagName==='TH'?'th':'td'));
   if(c.tagName==='TH'&&r.parentElement.tagName==='THEAD')c.scope='col';
   c.textContent=r.parentElement.tagName==='THEAD'||(ref&&ref.tagName==='TH')?'Nova coluna':'Nova célula';
   if(ref)ref.after(c);else r.appendChild(c);
  });
  columns();
 }else if(cmd==='table-col-remove'){
  const width=table.rows[0]?table.rows[0].cells.length:0;
  if(width<=1)return notify('A tabela precisa manter ao menos uma coluna.');
  if(!window.confirm('Excluir esta coluna da tabela?'))return;
  Array.from(table.rows).forEach(r=>{const c=r.cells[Math.min(col,r.cells.length-1)];if(c)c.remove()});
  state.currentField=null;columns();
 }
 queueDraft(state);
}
function imageAction(state,box,cmd){
 const figure=box.querySelector(':scope > figure.bc-editor-image');if(!figure)return;
 if(cmd==='image-replace'){state.replaceTarget=figure;state.input.click();return}
 checkpoint(state);
 if(cmd==='image-alt'){
  const img=figure.querySelector('img');if(!img)return;
  const value=window.prompt('Descreva a imagem para quem usa leitor de tela:',img.alt||'');
  if(value!==null)img.alt=value.trim().slice(0,240);
 }else{
  figure.classList.remove('bc-editor-image-small','bc-editor-image-medium','bc-editor-image-full');
  figure.classList.add('bc-editor-image-'+cmd.slice(6));
 }
 queueDraft(state);
}
function makeToolbar(state){
 const bar=document.createElement('div');bar.className='bcpe-toolbar';
 bar.innerHTML='<div class="bcpe-row"><strong>BASE COMPLETA <span>· Editor Premium</span></strong><span class="bcpe-spacer"></span><span data-status aria-live="polite">Edição não publicada</span><button data-action="close">Fechar</button></div>'+
 '<div class="bcpe-row"><select data-style aria-label="Estilo"><option value="">Estilo do bloco</option><option value="p">Texto normal</option><option value="h1">Título 1</option><option value="h2">Título 2</option><option value="h3">Título 3</option><option value="blockquote">Citação</option></select>'+
 '<select data-font aria-label="Fonte"><option value="">Fonte</option><option value="Arial">Arial</option><option value="Georgia">Georgia</option><option value="Verdana">Verdana</option><option value="Tahoma">Tahoma</option></select>'+
 '<select data-size aria-label="Tamanho"><option value="">Tamanho</option><option value="12">12</option><option value="14">14</option><option value="16">16</option><option value="18">18</option><option value="20">20</option><option value="24">24</option></select>'+
 '<button data-format="strong" title="Negrito (Ctrl+B)" aria-pressed="false"><b>B</b></button><button data-format="em" title="Itálico (Ctrl+I)" aria-pressed="false"><i>I</i></button><button data-format="u" title="Sublinhado (Ctrl+U)" aria-pressed="false"><u>U</u></button><button data-format="mark" aria-pressed="false">Destaque</button><button data-action="clear-format" title="Remover formatação de fonte do parágrafo atual">Limpar formatação</button>'+
 '<label class="bcpe-color">Cor <input type="color" data-color value="#17293e"></label><button data-action="color-again" title="Aplicar novamente a cor escolhida ao trecho selecionado">Aplicar cor</button>'+
 '<select data-align aria-label="Alinhamento"><option value="">Alinhar</option><option value="left">Esquerda</option><option value="center">Centro</option><option value="right">Direita</option><option value="justify">Justificado</option></select>'+
 '<select data-line aria-label="Espaçamento"><option value="">Linhas</option><option value="1.3">1,3</option><option value="1.5">1,5</option><option value="1.8">1,8</option><option value="2">2,0</option></select><span data-context aria-live="polite">Clique em um parágrafo para editar</span></div>'+
 '<div class="bcpe-row"><select data-insert><option value="">+ Inserir</option><option value="p">Parágrafo</option><option value="h2">Título</option><option value="h3">Subtítulo</option><option value="ul">Lista</option><option value="ol">Lista numerada</option><option value="table">Tabela</option><option value="atencao">Card ATENÇÃO</option><option value="decore">Card DECORE</option><option value="pegadinha">Card PEGADINHA</option><option value="exemplo">Card EXEMPLO</option><option value="resumo">Card RESUMO</option><option value="image">Imagem</option></select>'+
 '<button data-action="paste">Colar capítulo</button><button data-action="undo" title="Desfazer (Ctrl+Z)">↶ Desfazer</button><button data-action="redo" title="Refazer (Ctrl+Y)">↷ Refazer</button><button data-action="spell" title="Revisar a ortografia do capítulo">Ortografia</button><button data-action="copy-all" title="Copiar todo o capítulo">Copiar tudo</button>'+
 '<span class="bcpe-spacer"></span><button data-action="versions">Versões</button><button data-action="preview">Prévia</button><button class="bcpe-primary" data-action="publish">Publicar conteúdo</button></div>';
 if(!isAdmin){const imageOption=bar.querySelector('[data-insert] option[value="image"]');if(imageOption)imageOption.remove()}
 state.status=bar.querySelector('[data-status]');state.typeSelect=bar.querySelector('[data-style]');state.context=bar.querySelector('[data-context]');
 bar.addEventListener('pointerdown',function(e){
  rememberSelection(state);
  if(e.target.closest('button'))e.preventDefault()
 });
 bar.addEventListener('change',function(e){
  const t=e.target;
  if(t.matches('[data-style]')&&t.value){checkpoint(state);changeType(state,t.value)}
  if(t.matches('[data-insert]')&&t.value){
   const v=t.value;t.value='';
   if(v==='image'){state.replaceTarget=null;state.input.click();return}
   checkpoint(state);
   let box;
   if(v==='table')box=add(state,tableNode());
   else if(['atencao','decore','pegadinha','exemplo','resumo'].includes(v))box=add(state,cardNode(v));
   else if(v==='ul'||v==='ol'){const node=document.createElement(v);node.innerHTML='<li>Novo item</li>';box=add(state,node)}
   else box=add(state,richNode(v));
   // O texto de exemplo fica selecionado: basta digitar para substituí-lo.
   const field=box&&Array.from(box.querySelectorAll('[data-bcpe-edit]')).find(f=>!/^H4$/.test(f.tagName))||box&&box.querySelector('[data-bcpe-edit]');
   if(field){const r=document.createRange();r.selectNodeContents(field);const sel=window.getSelection();sel.removeAllRanges();sel.addRange(r);state.currentField=field;updateContext(state)}
  }
  if(t.matches('[data-align]')&&t.value){checkpoint(state);applyParagraphStyle(state,'textAlign',t.value)}
  if(t.matches('[data-line]')&&t.value){checkpoint(state);applyParagraphStyle(state,'lineHeight',t.value)}
  if(t.matches('[data-color]')){checkpoint(state);styleSelected(state,'span',{color:t.value})}
  if(t.matches('[data-font]')&&t.value){checkpoint(state);styleSelected(state,'span',{fontFamily:t.value})}
  if(t.matches('[data-size]')&&t.value){checkpoint(state);styleSelected(state,'span',{fontSize:t.value+'px'})}
  // Volta o menu ao rótulo para que a mesma opção possa ser aplicada no próximo trecho.
  if(t.matches('[data-align],[data-line],[data-font],[data-size]'))t.value='';
 });
 bar.addEventListener('click',async function(e){
  const b=e.target.closest('button');if(!b)return;
  if(b.dataset.format){toggleInline(state,b.dataset.format);return}
  const action=b.dataset.action;
  if(action==='clear-format'){checkpoint(state);clearParagraphFormatting(state)}
  if(action==='color-again'){checkpoint(state);styleSelected(state,'span',{color:bar.querySelector('[data-color]').value})}
  if(action==='spell')await spellCheck(state,b);
  if(action==='copy-all')await copyAll(state,b);
  if(action==='close')close(state);
  if(action==='undo')undo(state,-1);
  if(action==='redo')undo(state,1);
  if(action==='paste')showPasteDialog(state);
  if(action==='versions')await showVersions(state);
  if(action==='preview'){
   state.dialog.classList.toggle('bcpe-preview');
   b.textContent=state.dialog.classList.contains('bcpe-preview')?'Voltar a editar':'Prévia';
  }
  if(action==='publish'&&window.confirm('Publicar esta versão para os alunos?'))await publish(state,b);
 });
 return bar;
}
function makeDialog(state,html){
 const dialog=document.createElement('div');dialog.className='bcpe-screen';dialog.setAttribute('role','dialog');dialog.setAttribute('aria-modal','true');
 dialog.setAttribute('aria-label','Editor Premium do módulo');
 state.dialog=dialog;
 const toolbar=makeToolbar(state);
 const scroll=document.createElement('div');scroll.className='bcpe-scroll';
 const paper=document.createElement('div');paper.className='bcpe-paper';
 const title=document.createElement('h2');title.className='bcpe-document-title';title.textContent=state.label.split('|').slice(-2).join(' · ');
 const workspace=document.createElement('div');workspace.className='bcpe-workspace';state.workspace=workspace;
 workspace.replaceChildren(...parseNodes(html).map(block));
 paper.append(title,workspace);scroll.appendChild(paper);
 const input=document.createElement('input');input.type='file';input.accept='image/png,image/jpeg,image/webp';input.hidden=true;state.input=input;
 input.addEventListener('change',function(){if(input.files&&input.files[0])uploadImage(state,input.files[0]);else state.replaceTarget=null;input.value=''});
 dialog.append(toolbar,scroll,input);
 workspace.addEventListener('focusin',function(e){
  const box=e.target.closest('.bcpe-block');if(box)select(state,box);
  const field=e.target.closest('[data-bcpe-edit]');
  if(field&&workspace.contains(field)){state.currentField=field;state.savedRange=null;updateContext(state)}
 });
 workspace.addEventListener('pointerdown',function(e){
  const box=e.target.closest('.bcpe-block');if(box)select(state,box);
  const field=e.target.closest('[data-bcpe-edit]');
  if(field&&workspace.contains(field)){state.currentField=field;updateContext(state)}
 });
 workspace.addEventListener('keyup',function(){rememberSelection(state)});
 workspace.addEventListener('mouseup',function(){rememberSelection(state)});
 state.onSelectionChange=function(){rememberSelection(state);updateFormatButtons(state)};
 document.addEventListener('selectionchange',state.onSelectionChange);
 workspace.addEventListener('input',function(){queueDraft(state)});
 workspace.addEventListener('paste',function(e){safeInlinePaste(state,e)});
 workspace.addEventListener('click',function(e){
  const b=e.target.closest('button[data-action]');if(!b)return;
  const box=b.closest('.bcpe-block');if(!box)return;
  select(state,box);
  const cmd=b.dataset.action, list=blocks(state),idx=list.indexOf(box);
  if(cmd.startsWith('table-'))return tableAction(state,box,cmd);
  if(cmd.startsWith('image-'))return imageAction(state,box,cmd);
  if(['delete','duplicate','up','down'].includes(cmd))checkpoint(state);
  if(cmd==='delete'){
   if(box.querySelector('[data-bc-editor-preserve]'))return notify('Este componente não pode ser removido.');
   if(!window.confirm('Excluir este bloco do rascunho?'))return;
   box.remove();select(state,blocks(state)[Math.max(0,idx-1)]);queueDraft(state);
  }
  if(cmd==='duplicate'){
   if(box.querySelector('[data-bc-editor-preserve]'))return notify('Este componente não pode ser duplicado.');
   const clone=box.querySelector(':scope > .bcpe-node').cloneNode(true);add(state,clone,box);
  }
  if((cmd==='up'||cmd==='down')&&box.querySelector('[data-bc-editor-preserve]'))return notify('Componentes protegidos não podem ser movidos.');
  if(cmd==='up'&&idx>0){list[idx-1].before(box);select(state,box);queueDraft(state)}
  if(cmd==='down'&&idx<list.length-1){list[idx+1].after(box);select(state,box);queueDraft(state)}
 });
 dialog.addEventListener('keydown',function(e){
  // Esc só fecha a janela de importação; o editor nunca fecha por acidente.
  if(e.key==='Escape'){const box=dialog.querySelector('.bcpe-paste-dialog');if(box){e.preventDefault();box.remove()}return}
  const mod=e.ctrlKey||e.metaKey,key=e.key.toLowerCase();
  // Ctrl+S guarda o rascunho, como no Word; publicar para os alunos é sempre pelo botão.
  if(mod&&key==='s'){e.preventDefault();checkpoint(state);draftWrite(state);state.status.textContent='Rascunho salvo neste navegador';notify('Rascunho salvo. Para os alunos verem, clique em Publicar conteúdo.');return}
  if(mod&&key==='z'){e.preventDefault();undo(state,e.shiftKey?1:-1);return}
  if(mod&&key==='y'){e.preventDefault();undo(state,1);return}
  if(mod&&!e.shiftKey&&!e.altKey&&e.target.closest&&e.target.closest('[data-bcpe-edit]')){
   const tag={b:'strong',i:'em',u:'u'}[key];
   if(tag){e.preventDefault();toggleInline(state,tag);return}
  }
  if(e.target.closest&&e.target.closest('[data-bcpe-edit]'))editingKeys(state,e);
 });
 document.body.appendChild(dialog);document.body.classList.add('bcpe-open');select(state,blocks(state)[0]);
 state.snapshots=[serialize(state)];state.cursor=0;
 const first=workspace.querySelector('[data-bcpe-edit]');if(first)first.focus();
}
function close(state){
 if(state!==active)return;
 if(state.dirty&&!window.confirm('Fechar o editor? O rascunho ficará salvo neste navegador, mas não será publicado.'))return;
 clearTimeout(editorTimer);if(state.dirty)draftWrite(state);
 if(state.onSelectionChange)document.removeEventListener('selectionchange',state.onSelectionChange);
 state.dialog.remove();document.body.classList.remove('bcpe-open');active=null;
}
async function publish(state,button){
 if(state.saving)return;
 clearTimeout(editorTimer);historyPush(state);draftWrite(state);
 const html=serialize(state);
 if(!html.trim())return notify('O capítulo não pode ficar vazio.');
 state.saving=true;button.disabled=true;button.textContent='Publicando...';
 try{
  const result=await api('/api/content-editor',{method:'POST',headers:{'Content-Type':'application/json'},
   body:JSON.stringify({id:state.id,label:state.label,html,expectedRevision:state.revision})});
  state.revision=Number(result.revision||0);state.dirty=false;draftClear(state.id);
  applySnapshot(state.article,html);state.status.textContent='Publicado · revisão '+state.revision;
  notify('Capítulo publicado com sucesso.');
  if(state.onSelectionChange)document.removeEventListener('selectionchange',state.onSelectionChange);
  state.dialog.remove();document.body.classList.remove('bcpe-open');active=null;
 }catch(err){
  if(err.status===409){state.status.textContent='Conflito: outra alteração foi publicada';notify('O conteúdo foi atualizado em outra sessão. Seu rascunho está preservado; feche e recarregue para comparar.')}
  else notify(err.message||'Erro ao publicar.');
 }finally{state.saving=false;button.disabled=false;button.textContent='Publicar conteúdo'}
}
async function open(overlay){
 if(active)return notify('Conclua ou feche o capítulo que está sendo editado.');
 const article=articleFor(overlay);if(!article)return;
 const state={overlay,article,id:contentId(overlay),label:identity(overlay),revision:0,selected:null,currentField:null,savedRange:null,dirty:false,saving:false,snapshots:[],cursor:0};
 let html=capture(article);
 try{
  const remote=await api('/api/content-editor?id='+encodeURIComponent(state.id));
  if(remote.exists){html=remote.html;state.revision=Number(remote.revision||0)}
 }catch(err){return notify('Não foi possível carregar a versão atual. Por segurança, a edição foi cancelada.')}
 const draft=draftRead(state.id);
 if(draft&&draft.html&&draft.html!==html){
  if(draft.revision!==state.revision)notify('Há um rascunho criado sobre outra revisão.');
  if(window.confirm('Existe um rascunho local não publicado. Deseja recuperá-lo?'))html=draft.html;
 }
 active=state;makeDialog(state,html);
 if(draft&&html===draft.html){state.dirty=true;state.status.textContent='Rascunho recuperado'}
}
function mount(overlay){
 if(mounted.has(overlay))return;
 const article=articleFor(overlay),tools=toolsFor(overlay);if(!article||!tools)return;
 mounted.add(overlay);
 const button=document.createElement('button');button.type='button';
 button.className='bcpe-launch';button.textContent='✦ Editor Premium';
 button.title='Abrir o editor de capítulos em tela inteira';
 button.addEventListener('click',function(){open(overlay)});
 tools.appendChild(button);
}
function scan(){document.querySelectorAll('.bc-native-reader-overlay,.cf-native-overlay').forEach(mount)}
let scheduled=false;
function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(function(){scheduled=false;scan()})}
async function start(){
 try{const auth=await api('/api/auth?action=me');authorized=!!(auth.authenticated&&auth.user&&['admin','editor'].includes(auth.user.role));isAdmin=authorized&&auth.user.role==='admin'}catch(_){authorized=false}
 if(!authorized)return;
 scan();new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});
 window.addEventListener('central-cloud-applied',schedule);
}
window.BCPremiumEditor={textToNodes,htmlToNodes,contentId};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();