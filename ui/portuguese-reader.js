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

const PRACTICE_MODES={
 exam:{title:'Questões estilo prova',kind:'exam',limit:10,description:'Questões de múltipla escolha com correção imediata.'},
 active:{title:'Revisão ativa',kind:'active',limit:5,description:'Tente responder antes de revelar a resposta.'},
 cumulative:{title:'Questões cumulativas',kind:'cumulative',limit:10,description:'Pratique questões sobre os 24 módulos.'},
 'cumulative-review':{title:'Revisão cumulativa ativa',kind:'cumulative',limit:5,description:'Recupere os pontos essenciais da revisão final.'},
};
function focusedPractice(article,records,mode,id){
 const config=PRACTICE_MODES[mode];
 if(!config)return null;
 const subset=records.filter(record=>config.kind==='exam'
  ? (record.kind==='independent'||record.kind==='mastery')&&record.type==='objective'
  : record.kind===config.kind).slice(0,config.limit);
 const cards=subset.map(r=>[...article.querySelectorAll('[data-pta-id]')].find(node=>node.dataset.ptaId===r.id)).filter(Boolean);
 const root=document.createElement('section');
 root.className='pt-native-practice-collection';
 root.innerHTML='<header class="pt-native-practice-intro"><span class="pt-doc-kicker">PORTUGUÊS • ATIVIDADE INTERATIVA</span>'+
  '<h2>'+esc(config.title)+'</h2><p>'+esc(config.description)+'</p>'+
  '<small>'+cards.length+' atividade(s) disponível(is) neste módulo'+(cards.length<config.limit?' • quantidade real do material':'')+'.</small></header>';
 if(cards.length)cards.forEach(card=>root.appendChild(card));
 else{
  const empty=document.createElement('p');
  empty.className='pt-native-practice-empty';
  empty.textContent='Esta modalidade de questões não está disponível neste módulo. Consulte os exercícios do conteúdo original.';
  root.appendChild(empty);
 }
 const nav=document.createElement('div');
 nav.className='pt-native-practice-navigation';
 const back=document.createElement('button');
 back.type='button';back.className='btn primary';back.textContent='Abrir conteúdo completo';
 back.addEventListener('click',()=>open(id,'complete'));
 nav.appendChild(back);root.appendChild(nav);
 article.classList.add('pta-v1');
 article.replaceChildren(root);
 return {count:cards.length,limit:config.limit};
}


/* Organização do índice e das respostas (sem alterar o texto das aulas). */
const PT_MAIN=/^(?:\d+\.\s*)?(?:CAMADA \d|PARTE \d|M[ée]todo-mestre|Antes de come[cç]ar|Voc[eê] precisa saber antes|O que voc[eê] (?:vai aprender|precisa saber antes)|Ao terminar este m[oó]dulo|SE VOC[EÊ] N[AÃ]O ENTENDEU|Voc[eê] precisa lembrar|Confus[õo]es que voc[eê]|Revis[aã]o ativa|Mini teste|Teste (?:de sa[ií]da|final)|Fechamento do M|FIM DO CICLO|GABARITO SINT|MAPA DE RETORNO|Como usar)/i;
const PT_SUB=/^(?:\d+(?:\.\d+)?\.\s|AULA\s\d|M\d\d — )/i;
function outline(root){
 return [...root.querySelectorAll('h2')].map(h=>{
  if(h.closest('[aria-hidden="true"],[data-pta-source-hidden="true"]')||h.classList.contains('pt-next-module'))return null;
  const text=h.textContent.replace(/\s+/g,' ').trim();
  if(!text||/^(?:quest[aã]o\s*)?\d+$/i.test(text))return null;
  const level=PT_MAIN.test(text)?1:(h.classList.contains('pt-doc-h1')||PT_SUB.test(text))?2:0;
  return level?{h,level,text}:null;
 }).filter(Boolean);
}
function revealBox(label,nodes){
 const box=document.createElement('details');box.className='pt-reveal';
 const sum=document.createElement('summary');sum.textContent=label;box.appendChild(sum);
 nodes[0].before(box);nodes.forEach(n=>box.appendChild(n));return box;
}
function hideLooseAnswers(article){
 const free=n=>!n.closest('.pta-question,details,[aria-hidden="true"],[data-pta-source-hidden="true"]');
 [...article.querySelectorAll('h2,h3,h4')].filter(h=>free(h)&&/^respostas?\s+(?:esperadas|essenciais)\b/i.test(h.textContent.trim())).forEach(h=>{
  const rank=Number(h.tagName[1]),nodes=[];
  for(let n=h.nextElementSibling;n;n=n.nextElementSibling){if(/^H[1-6]$/.test(n.tagName)&&Number(n.tagName[1])<=rank)break;if(n.matches('.pt-module-finish'))break;nodes.push(n)}
  if(nodes.length)revealBox('Ver respostas',nodes);
 });
 [...article.querySelectorAll('p')].filter(p=>free(p)&&/^respostas?(?:\s+esperadas)?\s*:/i.test(p.textContent.trim())).forEach(p=>{
  const rest=p.textContent.trim().replace(/^respostas?(?:\s+esperadas)?\s*:/i,'').trim();
  const nodes=[p],next=p.nextElementSibling;
  if(!rest&&next&&!/^H[1-6]$/.test(next.tagName)&&!next.matches('.pt-module-finish,hr'))nodes.push(next);
  revealBox('Ver resposta',nodes);
 });
}
const PT_ORG_CSS='.pt-native-reader .bc-native-article h2.pt-doc-h1{font-size:1.45em;margin-top:1.6em;padding-bottom:.25em;border-bottom:1px solid var(--bc-color-border)}'+
 '.pt-native-reader .bc-native-article h2:not(.pt-doc-h1):not(.pt-next-module){font-size:1.12em;margin-top:1.2em}'+
 '.pt-native-reader h2.pt-next-module{font-size:1em;margin:18px 0;padding:12px 14px;border:1px solid var(--bc-color-border);border-radius:12px;background:var(--bc-color-surface)}'+
 '.pt-native-reader h2.pt-next-module::before{content:"Próximo módulo";display:block;font-size:.72em;letter-spacing:.06em;text-transform:uppercase;color:var(--bc-color-muted,#7a716a);margin-bottom:2px}'+
 '.pt-native-reader .bc-native-toc button.pt-toc-l1{font-weight:800}.pt-native-reader .bc-native-toc button.pt-toc-l2{padding-left:24px;font-size:.92em}'+
 '.pt-native-reader details.pt-reveal{margin:10px 0 14px;padding:6px 12px;border:1px dashed var(--bc-color-border);border-radius:10px}'+
 '.pt-native-reader details.pt-reveal>summary{cursor:pointer;font-weight:700;font-size:.9em}.pt-native-reader details.pt-reveal[open]>summary{margin-bottom:6px}';
function orgStyle(){if(document.getElementById('pt-org-style'))return;const st=document.createElement('style');st.id='pt-org-style';st.textContent=PT_ORG_CSS;document.head.appendChild(st)}
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
 const practiceMode=PRACTICE_MODES[mode]||null;
 close();
 const overlay=document.createElement('div');overlay.id=ID;overlay.className='bc-native-reader-overlay pt-native-reader';
 overlay.innerHTML='<section class="bc-native-reader" role="dialog" aria-modal="true" aria-label="'+esc(module.title)+'"><header class="bc-native-reader-head"><div class="bc-native-reader-title"><b>Português • '+esc(module.title)+'</b><small>'+(practiceMode?esc(practiceMode.title):mode==='review'?'Revisão e exercícios':'Conteúdo completo')+'</small></div><button type="button" class="bc-native-reader-close" aria-label="Fechar conteúdo">×</button></header><div class="pt-native-loading" role="status">Carregando conteúdo…</div></section>';
 document.body.appendChild(overlay);overlay.querySelector('.bc-native-reader-close').onclick=close;
 overlay.addEventListener('click',e=>{if(e.target===overlay)close()});
 try{
 const data=await global.CentralPortugueseCourse.load();
 if(!data[id])throw Error('Conteúdo indisponível. Tente novamente.');
 if(!overlay.isConnected)return;
 const {template,headings}=prepare(data[id]);
 if(practiceMode)overlay.dataset.ptPractice=mode;
 if(mode==='mindmap'){
  const root={label:module.title,children:[],expanded:true},stack=[{level:1,node:root}];
  outline(template.content).forEach(({level,text})=>{while(stack.length>1&&stack.at(-1).level>=level)stack.pop();const node={label:text,children:[]};stack.at(-1).node.children.push(node);stack.push({level,node})});
  close();global.BaseMindMap.register('pt',id,root);global.BaseMindMap.open('pt',id);return;
 }
 const shell=overlay.querySelector('.bc-native-reader');overlay.querySelector('.pt-native-loading').remove();
 shell.insertAdjacentHTML('beforeend','<div class="bc-native-reader-tools"><input type="search" placeholder="Buscar neste material…" aria-label="Buscar no conteúdo"><button type="button" data-pt-font="-1" aria-label="Diminuir fonte">A−</button><button type="button" data-pt-font="1" aria-label="Aumentar fonte">A+</button><button type="button" class="primary" data-pt-top>Ir ao topo</button></div><div class="bc-native-reader-body"><nav class="bc-native-toc" aria-label="Índice do material"><div class="bc-native-toc-label">Índice do módulo</div></nav><main class="bc-native-scroll"><div class="bc-native-article"></div></main></div>');
 const article=overlay.querySelector('.bc-native-article');article.appendChild(template.content);
 const exerciseRecords=global.BasePortugueseActivities?.enhance(article,{moduleId:id})||[];
 if(practiceMode)focusedPractice(article,exerciseRecords,mode,id);
 else{
  hideLooseAnswers(article);orgStyle();
  overlay.querySelector('.bc-native-toc').insertAdjacentHTML('beforeend',outline(article).map(x=>'<button type="button" class="pt-toc-l'+x.level+'" data-pt-jump="'+x.h.id+'">'+esc(x.text)+'</button>').join(''));
 }
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
  if(practiceMode)scroll.scrollTop=0;
  else if(reviewHeading)article.querySelector('#'+reviewHeading.id)?.scrollIntoView({block:'start',behavior:'auto'});
  else scroll.scrollTop=Number(localStorage.getItem('central-v6:pt:auto24:scroll:'+id))||0;
 });
 overlay.querySelector('.bc-native-reader-close').focus();
 }catch(error){if(overlay.isConnected)overlay.querySelector('.pt-native-loading').innerHTML='<p>Não foi possível carregar o material. Verifique a conexão.</p><button type="button" class="btn primary">Tentar novamente</button>';overlay.querySelector('.pt-native-loading button')?.addEventListener('click',()=>open(id,mode))}
}
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.getElementById(ID))close()});
global.CentralPortugueseReader={open,close};
})(window);
