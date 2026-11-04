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
 root.querySelectorAll('script,iframe,object,embed,form,svg,math,style,link,meta,base').forEach(n=>n.remove());
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
 if(node.matches('table,.bc-editor-table-wrap,.adm-table-scroll'))options.unshift(['table-row','+ Linha','Adicionar linha'],['table-col','+ Coluna','Adicionar coluna']);
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
function undo(state,dir){
 const dest=state.cursor+dir;if(dest<0||dest>=state.snapshots.length)return notify('Sem mais alterações nesse sentido');
 state.cursor=dest;
 state.workspace.replaceChildren(...parseNodes(state.snapshots[state.cursor]).map(block));
 select(state,blocks(state)[0]);state.dirty=true;queueDraft(state);
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
  const figure=document.createElement('figure');figure.className='bc-editor-image bc-editor-image-full';
  const picture=document.createElement('img');picture.src=result.url;picture.alt='Ilustração do módulo';picture.loading='lazy';
  const caption=document.createElement('figcaption');caption.textContent='Legenda da imagem';
  figure.append(picture,caption);add(state,figure);notify('Imagem adicionada ao rascunho.');
 }catch(err){notify(err.message||'Falha ao carregar imagem.')}finally{URL.revokeObjectURL(url)}
}
function makeToolbar(state){
 const bar=document.createElement('div');bar.className='bcpe-toolbar';
 bar.innerHTML='<div class="bcpe-row"><strong>BASE COMPLETA <span>· Editor Premium</span></strong><span class="bcpe-spacer"></span><span data-status aria-live="polite">Edição não publicada</span><button data-action="close">Fechar</button></div>'+
 '<div class="bcpe-row"><select data-style aria-label="Estilo"><option value="">Estilo do bloco</option><option value="p">Texto normal</option><option value="h1">Título 1</option><option value="h2">Título 2</option><option value="h3">Título 3</option><option value="blockquote">Citação</option></select>'+
 '<select data-font aria-label="Fonte"><option value="">Fonte</option><option value="Arial">Arial</option><option value="Georgia">Georgia</option><option value="Verdana">Verdana</option><option value="Tahoma">Tahoma</option></select>'+
 '<select data-size aria-label="Tamanho"><option value="">Tamanho</option><option value="12">12</option><option value="14">14</option><option value="16">16</option><option value="18">18</option><option value="20">20</option><option value="24">24</option></select>'+
 '<button data-format="strong" title="Negrito"><b>B</b></button><button data-format="em" title="Itálico"><i>I</i></button><button data-format="u" title="Sublinhado"><u>U</u></button><button data-format="mark">Destaque</button><button data-action="clear-format" title="Remover formatação de fonte do parágrafo atual">Limpar formatação</button>'+
 '<label class="bcpe-color">Cor <input type="color" data-color value="#17293e"></label>'+
 '<select data-align aria-label="Alinhamento"><option value="">Alinhar</option><option value="left">Esquerda</option><option value="center">Centro</option><option value="right">Direita</option><option value="justify">Justificado</option></select>'+
 '<select data-line aria-label="Espaçamento"><option value="">Linhas</option><option value="1.3">1,3</option><option value="1.5">1,5</option><option value="1.8">1,8</option><option value="2">2,0</option></select><span data-context aria-live="polite">Clique em um parágrafo para editar</span></div>'+
 '<div class="bcpe-row"><select data-insert><option value="">+ Inserir</option><option value="p">Parágrafo</option><option value="h2">Título</option><option value="h3">Subtítulo</option><option value="ul">Lista</option><option value="ol">Lista numerada</option><option value="table">Tabela</option><option value="atencao">Card ATENÇÃO</option><option value="decore">Card DECORE</option><option value="pegadinha">Card PEGADINHA</option><option value="exemplo">Card EXEMPLO</option><option value="resumo">Card RESUMO</option><option value="image">Imagem</option></select>'+
 '<button data-action="paste">Colar capítulo</button><button data-action="undo" title="Desfazer">↶ Desfazer</button><button data-action="redo" title="Refazer">↷ Refazer</button>'+
 '<span class="bcpe-spacer"></span><button data-action="versions">Versões</button><button data-action="preview">Prévia</button><button class="bcpe-primary" data-action="publish">Publicar conteúdo</button></div>';
 if(!isAdmin){const imageOption=bar.querySelector('[data-insert] option[value="image"]');if(imageOption)imageOption.remove()}
 state.status=bar.querySelector('[data-status]');state.typeSelect=bar.querySelector('[data-style]');state.context=bar.querySelector('[data-context]');
 bar.addEventListener('pointerdown',function(e){
  rememberSelection(state);
  if(e.target.closest('button[data-format]'))e.preventDefault()
 });
 bar.addEventListener('change',function(e){
  const t=e.target;
  if(t.matches('[data-style]')&&t.value)changeType(state,t.value);
  if(t.matches('[data-insert]')&&t.value){
   const v=t.value;t.value='';
   if(v==='image'){state.input.click();return}
   if(v==='table'){add(state,tableNode());return}
   if(['atencao','decore','pegadinha','exemplo','resumo'].includes(v)){add(state,cardNode(v));return}
   if(v==='ul'||v==='ol'){const node=document.createElement(v);node.innerHTML='<li>Novo item</li>';add(state,node);return}
   add(state,richNode(v));
  }
  if(t.matches('[data-align]')&&t.value)applyParagraphStyle(state,'textAlign',t.value);
  if(t.matches('[data-line]')&&t.value)applyParagraphStyle(state,'lineHeight',t.value);
  if(t.matches('[data-color]'))styleSelected(state,'span',{color:t.value});
  if(t.matches('[data-font]')&&t.value)styleSelected(state,'span',{fontFamily:t.value});
  if(t.matches('[data-size]')&&t.value)styleSelected(state,'span',{fontSize:t.value+'px'});
 });
 bar.addEventListener('click',async function(e){
  const b=e.target.closest('button');if(!b)return;
  if(b.dataset.format){styleSelected(state,b.dataset.format);return}
  const action=b.dataset.action;
  if(action==='clear-format')clearParagraphFormatting(state);
  if(action==='close')close(state);
  if(action==='undo')undo(state,-1);
  if(action==='redo')undo(state,1);
  if(action==='paste')showPasteDialog(state);
  if(action==='versions')await showVersions(state);
  if(action==='preview'){
   state.dialog.classList.toggle('bcpe-preview');
   b.textContent=state.dialog.classList.contains('bcpe-preview')?'Voltar a editar':'Prévia';
  }
  if(action==='publish')await publish(state,b);
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
 input.addEventListener('change',function(){if(input.files&&input.files[0])uploadImage(state,input.files[0]);input.value=''});
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
 state.onSelectionChange=function(){rememberSelection(state)};
 document.addEventListener('selectionchange',state.onSelectionChange);
 workspace.addEventListener('input',function(){queueDraft(state)});
 workspace.addEventListener('paste',function(e){safeInlinePaste(state,e)});
 workspace.addEventListener('click',function(e){
  const b=e.target.closest('button[data-action]');if(!b)return;
  const box=b.closest('.bcpe-block');if(!box)return;
  select(state,box);
  const cmd=b.dataset.action, list=blocks(state),idx=list.indexOf(box);
  if(cmd==='table-row'||cmd==='table-col'){
   const table=box.querySelector('table');if(!table)return notify('Tabela não encontrada.');
   if(cmd==='table-row'){
    const sample=table.rows[table.rows.length-1],cols=sample?sample.cells.length:2;
    const row=table.insertRow(-1);for(let i=0;i<cols;i++){const cell=row.insertCell(-1);cell.textContent='Nova célula';cell.setAttribute('contenteditable','true');cell.setAttribute('data-bcpe-edit','true')}
   }else{
    Array.from(table.rows).forEach(function(row){const cell=row.insertCell(-1);cell.textContent='Nova coluna';cell.setAttribute('contenteditable','true');cell.setAttribute('data-bcpe-edit','true')});
   }
   queueDraft(state);return;
  }
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
  if(e.key==='Escape'){e.preventDefault();close(state);return}
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='s'){e.preventDefault();toolbar.querySelector('[data-action="publish"]').click()}
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'){e.preventDefault();undo(state,e.shiftKey?1:-1)}
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='y'){e.preventDefault();undo(state,1)}
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