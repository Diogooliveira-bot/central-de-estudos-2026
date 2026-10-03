/* Português Autodidata uses the Central's shared native reader and material cards. */
(function(global){
'use strict';
if(global.CentralPortugueseReader)return;
const ID='centralPortugueseReader';
let active=null;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const item=id=>global.CentralPortugueseCourse.modules.concat([global.CentralPortugueseCourse.review]).find(m=>m.id===id);
function close(){if(active){localStorage.setItem('central-v6:pt:auto24:scroll:'+active.id,String(active.scroll?.scrollTop||0));active=null}document.getElementById(ID)?.remove()}
function finish(id,value){
 localStorage.setItem('central-v6:pt:auto24:done:'+id,value?'1':'0');
 if(typeof global.renderAll==='function')global.renderAll();
 if(typeof global.renderDisciplineGrid==='function')global.renderDisciplineGrid();
}
function prepare(markup){
 const template=document.createElement('template');template.innerHTML=markup;
 template.content.querySelectorAll('script').forEach(el=>el.remove());
 const headings=[...template.content.querySelectorAll('h2,h3,h4')];
 headings.forEach((h,i)=>h.id='pt-native-section-'+i);
 template.content.querySelectorAll('table').forEach(table=>{const wrap=document.createElement('div');wrap.className='pt-table-wrap';table.replaceWith(wrap);wrap.appendChild(table)});
 return {template,headings};
}
async function open(id,mode='complete'){
 const module=item(id);if(!module)return;
 close();
 const overlay=document.createElement('div');overlay.id=ID;overlay.className='bc-native-reader-overlay pt-native-reader';
 overlay.innerHTML='<section class="bc-native-reader" role="dialog" aria-modal="true" aria-label="'+esc(module.title)+'"><header class="bc-native-reader-head"><div class="bc-native-reader-title"><b>Português • '+esc(module.title)+'</b><small>'+(mode==='review'?'Revisão e exercícios':'Conteúdo completo')+'</small></div><button type="button" class="bc-native-reader-close" aria-label="Fechar conteúdo">×</button></header><div class="pt-native-loading" role="status">Carregando conteúdo…</div></section>';
 document.body.appendChild(overlay);overlay.querySelector('.bc-native-reader-close').onclick=close;
 overlay.addEventListener('click',e=>{if(e.target===overlay)close()});
 try{
 const data=await global.CentralPortugueseCourse.load();
 if(!data[id])throw Error('Conteúdo indisponível. Tente novamente.');
 if(!overlay.isConnected)return;
 const {template,headings}=prepare(data[id]);
 if(mode==='mindmap'){
  const root={label:module.title,children:[],expanded:true},stack=[{level:1,node:root}];
  headings.forEach(h=>{const level=Number(h.tagName.slice(1));while(stack.length>1&&stack.at(-1).level>=level)stack.pop();const node={label:h.textContent.trim(),children:[]};stack.at(-1).node.children.push(node);stack.push({level,node})});
  close();global.BaseMindMap.register('pt',id,root);global.BaseMindMap.open('pt',id);return;
 }
 const shell=overlay.querySelector('.bc-native-reader');overlay.querySelector('.pt-native-loading').remove();
 shell.insertAdjacentHTML('beforeend','<div class="bc-native-reader-tools"><input type="search" placeholder="Buscar neste material…" aria-label="Buscar no conteúdo"><button type="button" data-pt-font="-1" aria-label="Diminuir fonte">A−</button><button type="button" data-pt-font="1" aria-label="Aumentar fonte">A+</button><button type="button" class="primary" data-pt-top>Ir ao topo</button></div><div class="bc-native-reader-body"><nav class="bc-native-toc" aria-label="Índice do material"><div class="bc-native-toc-label">Índice do módulo</div>'+headings.map(h=>'<button type="button" data-pt-jump="'+h.id+'">'+esc(h.textContent)+'</button>').join('')+'</nav><main class="bc-native-scroll"><div class="bc-native-article"></div></main></div>');
 const article=overlay.querySelector('.bc-native-article');article.appendChild(template.content);
 const scroll=overlay.querySelector('.bc-native-scroll');active={id,scroll};
 let size=Math.max(85,Math.min(180,Number(localStorage.getItem('central-v6:reading-font-size'))||100));
 const applyFont=()=>article.style.fontSize=size/100+'em';applyFont();
 overlay.querySelectorAll('[data-pt-font]').forEach(b=>b.onclick=()=>{size=Math.max(85,Math.min(180,size+Number(b.dataset.ptFont)*5));localStorage.setItem('central-v6:reading-font-size',String(size));applyFont()});
 overlay.querySelector('[data-pt-top]').onclick=()=>scroll.scrollTo({top:0,behavior:'smooth'});
 overlay.querySelectorAll('[data-pt-jump]').forEach(b=>b.onclick=()=>article.querySelector('#'+b.dataset.ptJump)?.scrollIntoView({block:'start',behavior:'smooth'}));
 overlay.querySelector('input[type=search]').addEventListener('input',e=>{
  const query=e.target.value.trim().toLocaleLowerCase('pt-BR');
  overlay.querySelectorAll('[data-pt-jump]').forEach(b=>b.hidden=!!query&&!b.textContent.toLocaleLowerCase('pt-BR').includes(query));
  if(query.length<3)return;
  const match=[...article.querySelectorAll('h2,h3,h4,p,li')].find(el=>el.textContent.toLocaleLowerCase('pt-BR').includes(query));
  match?.scrollIntoView({block:'start',behavior:'smooth'});
 });
 article.querySelectorAll('[data-pt-complete]').forEach(cb=>{cb.checked=localStorage.getItem('central-v6:pt:auto24:done:'+id)==='1';cb.onchange=()=>finish(id,cb.checked)});
 article.querySelectorAll('a[href]').forEach(a=>{if(/^https?:/.test(a.href)&&new URL(a.href).origin!==location.origin){a.target='_blank';a.rel='noopener noreferrer'}});
 requestAnimationFrame(()=>{
  const reviewHeading=mode==='review'?headings.find(h=>/CONSOLIDAR|DOMINAR|REVISÃO|REVIS[AÃ]O|EXERC[IÍ]C|QUEST[OÕ]ES/i.test(h.textContent)):null;
  if(reviewHeading)article.querySelector('#'+reviewHeading.id)?.scrollIntoView({block:'start',behavior:'auto'});
  else scroll.scrollTop=Number(localStorage.getItem('central-v6:pt:auto24:scroll:'+id))||0;
 });
 overlay.querySelector('.bc-native-reader-close').focus();
 }catch(error){if(overlay.isConnected)overlay.querySelector('.pt-native-loading').innerHTML='<p>Não foi possível carregar o material. Verifique a conexão.</p><button type="button" class="btn primary">Tentar novamente</button>';overlay.querySelector('.pt-native-loading button')?.addEventListener('click',()=>open(id,mode))}
}
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.getElementById(ID))close()});
global.CentralPortugueseReader={open,close};
})(window);
