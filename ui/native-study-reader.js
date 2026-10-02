(function(global){
'use strict';

const OVERLAY_ID='bcNativeReaderOverlay';
const M1_SELECTOR='#subjects .subject[data-id="penal"] .cf-module[data-cf="p1"]';
let current=null;
let observer=null;

function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function norm(s){return String(s||'').replace(/\u00a0/g,' ').replace(/[ \t]+/g,' ').trim()}
function slug(s){return norm(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,70)}
function source(){return global.BASE_NATIVE_CONTENT?.penal?.m01||null}

function cleanLines(raw){
  const lines=String(raw||'').replace(/\r/g,'').split('\n').map(norm);
  const out=[];
  for(let line of lines){
    if(!line) { out.push(''); continue; }
    if(/^BASE COMPLETA(?:\s*[|•-]|$)/i.test(line)) continue;
    if(/^D\s*IRE\s*ITO PENAL\s*•\s*M0?1$/i.test(line)) continue;
    if(/^\d+\s*\/\s*\d+$/.test(line)) continue;
    if(/^P[aá]gina\s+\d+$/i.test(line)) continue;
    out.push(line);
  }
  return out;
}
function headingInfo(line){
  const l=norm(line);
  if(!l) return null;
  let m=l.match(/^(\d+)\.(\d+)\s+(.{3,120})$/);
  if(m) return {level:3,text:l};
  m=l.match(/^(\d+)\.?\s+(.{3,120})$/);
  if(m && !/^\d+\s*\/\s*\d+/.test(l)) return {level:2,text:l};
  if(/^(VISÃO GERAL|VISAO GERAL|REVISÃO ATIVA|REVISAO ATIVA|ARTIGOS PARA DECORAR|PEGADINHAS DE PROVA|MAPA DO MÓDULO|MAPA DO MODULO)$/i.test(l)) return {level:2,text:l};
  return null;
}
function calloutType(line){
  const l=norm(line).toUpperCase();
  if(/^(✅\s*)?EXEMPLO/.test(l)) return ['example','Exemplo'];
  if(/PEGADINHA/.test(l)) return ['trap','Pegadinha'];
  if(/^(⚖️\s*)?LEI SECA/.test(l)) return ['law','Lei seca'];
  if(/^(DECORE|MEMÓRIA|MEMORIA|MNEMÔNICO|MNEMONICO|REGRA DE OURO|IDEIA-CENTRAL|IDEIA CENTRAL|FÓRMULA|FORMULA)/.test(l)) return ['memory',norm(line)];
  if(/^(STF|STJ|JURISPRUDÊNCIA|JURISPRUDENCIA|ATUALIZAÇÃO|ATUALIZACAO)/.test(l)) return ['case',norm(line)];
  if(/^(COMPARAÇÃO|COMPARACAO|ATENÇÃO|ATENCAO|PROVA)/.test(l)) return ['case',norm(line)];
  return null;
}
function isBullet(line){return /^[•●▪◦*-]\s+/.test(line)}
function looksTitle(line){
  const l=norm(line);
  if(l.length<3||l.length>105) return false;
  if(/[.!?]$/.test(l)) return false;
  if(/^[A-ZÁÉÍÓÚÂÊÔÃÕÇ0-9][A-ZÁÉÍÓÚÂÊÔÃÕÇ0-9\s:–—()/%ºª,.-]+$/.test(l) && l.split(/\s+/).length<=12) return true;
  return false;
}

function parse(raw,mode){
  const lines=cleanLines(raw);
  const blocks=[];
  let para=[];
  const flush=()=>{if(para.length){blocks.push({type:'p',text:para.join(' ')});para=[]}};
  for(let i=0;i<lines.length;i++){
    const line=lines[i];
    if(!line){flush();continue}
    const hi=headingInfo(line);
    if(hi){flush();blocks.push({type:'h',level:hi.level,text:hi.text});continue}
    const co=calloutType(line);
    if(co){
      flush();
      const body=[];
      for(let j=i+1;j<lines.length;j++){
        const next=lines[j];
        if(!next){if(body.length) break; else continue}
        if(headingInfo(next)||calloutType(next)||looksTitle(next)) break;
        body.push(next); i=j;
      }
      blocks.push({type:'callout',kind:co[0],label:co[1],text:body.join(' ')});
      continue;
    }
    if(isBullet(line)){
      flush();
      const items=[line.replace(/^[•●▪◦*-]\s+/,'')];
      while(i+1<lines.length && isBullet(lines[i+1])) items.push(lines[++i].replace(/^[•●▪◦*-]\s+/,''));
      blocks.push({type:'ul',items});
      continue;
    }
    if(looksTitle(line) && mode==='summary'){
      flush();blocks.push({type:'h',level:3,text:line});continue;
    }
    para.push(line);
  }
  flush();

  // Remove obvious cover repetition before first substantive heading.
  const firstH=blocks.findIndex(b=>b.type==='h');
  if(firstH>2){
    const lead=blocks.slice(0,firstH).filter(b=>b.type==='p').map(b=>b.text).join(' ');
    blocks.splice(0,firstH,{type:'lead',text:lead});
  }
  return blocks;
}

function buildHtml(data,mode){
  const raw=mode==='summary'?data.summary:data.complete;
  const blocks=parse(raw,mode);
  const headings=[];
  let hCount=0;
  const body=blocks.map(b=>{
    if(b.type==='h'){
      const id='bcsec-'+(++hCount)+'-'+slug(b.text);
      headings.push({id,text:b.text,level:b.level});
      return '<h'+b.level+' id="'+id+'">'+esc(b.text)+'</h'+b.level+'>';
    }
    if(b.type==='lead') return '<p class="lead">'+esc(b.text)+'</p>';
    if(b.type==='p') return '<p>'+esc(b.text)+'</p>';
    if(b.type==='ul') return '<ul>'+b.items.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>';
    if(b.type==='callout') return '<aside class="bc-native-callout '+b.kind+'"><b>'+esc(b.label)+'</b><div>'+esc(b.text)+'</div></aside>';
    return '';
  }).join('');
  const words=norm(raw).split(/\s+/).filter(Boolean).length;
  const mins=Math.max(1,Math.round(words/(mode==='summary'?220:190)));
  return {body,headings,words,mins};
}

function close(){
  document.getElementById(OVERLAY_ID)?.remove();
  document.body.style.overflow='';
  current=null;
}
function markRead(){
  if(!current) return;
  localStorage.setItem('central-v6:native-reader:penal:p1:'+current.mode+':read','1');
  const btn=current.overlay.querySelector('[data-native-action="read"]');
  if(btn){btn.textContent='✓ Marcado como lido';btn.disabled=true}
  refreshCardState();
}
function refreshCardState(){
  document.querySelectorAll('[data-native-kind]').forEach(card=>{
    const kind=card.dataset.nativeKind;
    const done=localStorage.getItem('central-v6:native-reader:penal:p1:'+kind+':read')==='1';
    const tag=card.querySelector('.bc-native-material-action span:first-child');
    if(tag) tag.textContent=done?'✓ Lido':'Abrir';
  });
}
function updateProgress(){
  if(!current) return;
  const sc=current.scroll;
  const max=Math.max(1,sc.scrollHeight-sc.clientHeight);
  const pct=Math.max(0,Math.min(100,sc.scrollTop/max*100));
  current.overlay.querySelector('.bc-native-reader-progress').style.width=pct+'%';
  localStorage.setItem('central-v6:native-reader:penal:p1:'+current.mode+':scroll',String(sc.scrollTop));
}
function restoreScroll(){
  if(!current) return;
  const v=Number(localStorage.getItem('central-v6:native-reader:penal:p1:'+current.mode+':scroll')||0);
  if(v>0) current.scroll.scrollTop=v;
}
function setFont(delta){
  if(!current) return;
  current.font=Math.max(14,Math.min(21,current.font+delta));
  current.article.style.fontSize=current.font+'px';
  localStorage.setItem('central-v6:native-reader:font',String(current.font));
}
function stripMarks(){
  if(!current)return;
  current.article.querySelectorAll('mark.bc-native-search-hit').forEach(m=>m.replaceWith(document.createTextNode(m.textContent)));
  current.article.normalize();
}
function search(term){
  stripMarks();
  term=norm(term);
  if(term.length<2)return 0;
  let n=0;
  const root=current.article;
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(node){
    if(!node.nodeValue.trim())return NodeFilter.FILTER_REJECT;
    if(node.parentElement.closest('mark'))return NodeFilter.FILTER_REJECT;
    return node.nodeValue.toLocaleLowerCase('pt-BR').includes(term.toLocaleLowerCase('pt-BR'))?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;
  }});
  const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
  for(const node of nodes){
    const raw=node.nodeValue,low=raw.toLocaleLowerCase('pt-BR'),needle=term.toLocaleLowerCase('pt-BR');
    let pos=0,idx;const frag=document.createDocumentFragment();
    while((idx=low.indexOf(needle,pos))>=0){
      frag.append(raw.slice(pos,idx));const mk=document.createElement('mark');mk.className='bc-native-search-hit';mk.textContent=raw.slice(idx,idx+term.length);frag.append(mk);n++;pos=idx+term.length;
    }
    frag.append(raw.slice(pos));node.replaceWith(frag);
  }
  root.querySelector('mark.bc-native-search-hit')?.scrollIntoView({block:'center'});
  return n;
}
function open(mode){
  const data=source(); if(!data){alert('Conteúdo nativo do M01 ainda não foi carregado.');return}
  close();
  const parsed=buildHtml(data,mode);
  const ov=document.createElement('div');ov.id=OVERLAY_ID;ov.className='bc-native-reader-overlay';
  const label=mode==='summary'?'Conteúdo resumido':'Conteúdo completo';
  const done=localStorage.getItem('central-v6:native-reader:penal:p1:'+mode+':read')==='1';
  ov.innerHTML='<section class="bc-native-reader" role="dialog" aria-modal="true" aria-label="'+esc(label)+'">'+
    '<header class="bc-native-reader-head"><div class="bc-native-reader-title"><b>PEN M01 — '+esc(data.title)+'</b><small>'+label+' • experiência nativa da Base Completa</small></div><span class="bc-native-reader-meta">'+parsed.words.toLocaleString('pt-BR')+' palavras • ~'+parsed.mins+' min</span><button class="bc-native-reader-close" data-native-action="close" aria-label="Fechar">×</button><div class="bc-native-reader-progress-track"><div class="bc-native-reader-progress"></div></div></header>'+
    '<div class="bc-native-reader-tools"><input type="search" placeholder="Buscar neste material…" aria-label="Buscar"><button data-native-action="smaller">A−</button><button data-native-action="larger">A+</button><button class="primary" data-native-action="top">Ir ao topo</button></div>'+
    '<div class="bc-native-reader-body"><nav class="bc-native-toc"><div class="bc-native-toc-label">Neste material</div>'+parsed.headings.map(h=>'<button class="level-'+h.level+'" data-target="'+h.id+'">'+esc(h.text)+'</button>').join('')+'</nav>'+
    '<main class="bc-native-scroll"><article class="bc-native-article"><div class="bc-native-kicker">'+(mode==='summary'?'PRIMEIRA LEITURA + REVISÃO':'TEORIA INTEGRAL')+'</div><h1>'+esc(data.title)+'</h1><p class="lead">'+(mode==='summary'?'Versão condensada para compreender o módulo e revisar os pontos de maior rendimento.':'Conteúdo integral convertido para leitura nativa, sem leitor de PDF.')+'</p>'+parsed.body+
    '<div class="bc-native-reader-footer"><span>Seu ponto de leitura é salvo automaticamente neste navegador.</span><button data-native-action="read" '+(done?'disabled':'')+'>'+(done?'✓ Marcado como lido':'Marcar como lido')+'</button></div></article></main></div></section>';
  document.body.appendChild(ov);document.body.style.overflow='hidden';
  current={mode,overlay:ov,scroll:ov.querySelector('.bc-native-scroll'),article:ov.querySelector('.bc-native-article'),font:Number(localStorage.getItem('central-v6:native-reader:font')||16)};
  current.article.style.fontSize=current.font+'px';
  current.scroll.addEventListener('scroll',updateProgress,{passive:true});
  ov.querySelector('[data-native-action="close"]').onclick=close;
  ov.querySelector('[data-native-action="smaller"]').onclick=()=>setFont(-1);
  ov.querySelector('[data-native-action="larger"]').onclick=()=>setFont(1);
  ov.querySelector('[data-native-action="top"]').onclick=()=>current.scroll.scrollTo({top:0,behavior:'smooth'});
  ov.querySelector('[data-native-action="read"]').onclick=markRead;
  ov.querySelector('.bc-native-reader-tools input').addEventListener('input',e=>search(e.target.value));
  ov.querySelectorAll('.bc-native-toc [data-target]').forEach(btn=>btn.onclick=()=>ov.querySelector('#'+CSS.escape(btn.dataset.target))?.scrollIntoView({behavior:'smooth',block:'start'}));
  ov.addEventListener('click',e=>{if(e.target===ov)close()});
  requestAnimationFrame(()=>{restoreScroll();updateProgress()});
}
function openMap(){
  if(global.BaseMindMap?.open) global.BaseMindMap.open('penal','p1');
  else alert('O mapa mental interativo ainda está carregando. Tente novamente em alguns segundos.');
}

function removeLegacyM01Content(){
  const module=document.querySelector(M1_SELECTOR);
  if(!module) return;
  module.querySelectorAll('.bc-session-nav,.bc-session-pager').forEach(function(el){ el.remove(); });
}

function inject(){
  const module=document.querySelector(M1_SELECTOR);if(!module)return;
  removeLegacyM01Content();
  const body=module.querySelector('.cf-module-body');if(!body||body.querySelector('.bc-native-materials'))return;
  const host=document.createElement('section');host.className='bc-native-materials';
  host.innerHTML='<div class="bc-native-materials-head"><div><b>Materiais do módulo</b><small>Escolha como estudar</small></div><small>Piloto M01 • sem PDF embutido</small></div>'+
  '<div class="bc-native-material-grid">'+
   '<button class="bc-native-material-card" data-native-kind="summary"><span class="bc-native-material-icon">⚡</span><span><strong>Conteúdo resumido</strong><small>Primeira leitura, revisão rápida, artigos, pegadinhas e revisão ativa.</small></span><span class="bc-native-material-action"><span>Abrir</span><span>→</span></span></button>'+
   '<button class="bc-native-material-card" data-native-kind="complete"><span class="bc-native-material-icon">📚</span><span><strong>Conteúdo completo</strong><small>Teoria integral do M01 em formato de site, com índice, busca e progresso de leitura.</small></span><span class="bc-native-material-action"><span>Abrir</span><span>→</span></span></button>'+
   '<button class="bc-native-material-card" data-native-kind="mindmap"><span class="bc-native-material-icon">🧠</span><span><strong>Mapa mental</strong><small>Ferramenta interativa aprovada: abrir/recolher ramos, zoom, arrastar e tela cheia.</small></span><span class="bc-native-material-action"><span>Abrir</span><span>→</span></span></button>'+
  '</div>'+
  '<section class="bc-native-quick-summary" aria-label="Resumo do módulo">'+
    '<div class="bc-native-quick-summary-head"><span class="bc-native-quick-summary-no">1</span><div><b>Resumo do módulo</b><small>O M01 em poucas palavras.</small></div></div>'+
    '<div class="bc-native-quick-summary-body">Legalidade e princípios penais • interpretação e analogia • intervenção mínima e insignificância • conflito aparente de normas (ESCA).</div>'+
  '</section>';
  host.querySelector('[data-native-kind="summary"]').onclick=()=>open('summary');
  host.querySelector('[data-native-kind="complete"]').onclick=()=>open('complete');
  host.querySelector('[data-native-kind="mindmap"]').onclick=openMap;
  const subtitle=body.querySelector('.cf-subtitle');
  if(subtitle) subtitle.insertAdjacentElement('afterend',host); else body.insertAdjacentElement('afterbegin',host);
  refreshCardState();
}
function install(){
  inject();
  observer=new MutationObserver(()=>{clearTimeout(install._t);install._t=setTimeout(()=>{removeLegacyM01Content();inject()},50)});
  observer.observe(document.documentElement,{subtree:true,childList:true});
}
global.BaseNativeReader={open,close,version:'2026.10.02-m01-pilot1'};
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.getElementById(OVERLAY_ID))close()});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})(window);
