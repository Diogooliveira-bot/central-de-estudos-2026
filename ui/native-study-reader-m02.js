(function(global){
'use strict';

const OVERLAY_ID='bcNativeReaderOverlayM02';
const M1_SELECTOR='#subjects .subject[data-id="penal"] .cf-module[data-cf="p2"]';
const STORAGE_PREFIX='central-v6:native-reader:penal:p2';
let current=null;
let observer=null;

function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function norm(s){return String(s||'').replace(/\u00a0/g,' ').replace(/[ \t]+/g,' ').trim()}
function normKey(s){return norm(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
function slug(s){return normKey(s).replace(/\s+/g,'-').slice(0,70)}
function source(){return global.BASE_NATIVE_CONTENT?.penal?.m02||null}
function storageKey(part){return STORAGE_PREFIX+':'+part}

function cleanLines(raw,mode){
  const lines=String(raw||'').replace(/\r/g,'').split('\n').map(norm);
  const out=[];
  let skipOldSummaryReview=false;
  for(let line of lines){
    if(mode==='summary' && /^13\.\s*REVIS(?:A|Ã)O ATIVA/i.test(line)){skipOldSummaryReview=true;continue}
    if(skipOldSummaryReview && /^ESQUELETO DE MEM(?:O|Ó)RIA/i.test(line)){skipOldSummaryReview=false;continue}
    if(skipOldSummaryReview)continue;
    if(!line){out.push('');continue}
    if(/^BASE COMPLETA(?:\s*[|•-]|$)/i.test(line))continue;
    if(/^D\s*IRE\s*ITO PENAL\s*•\s*M0?1$/i.test(line))continue;
    if(/^\d+\s*\/\s*\d+$/.test(line))continue;
    if(/^P[aá]gina\s+\d+$/i.test(line))continue;
    if(/^Conteudo restrito ao PEN M1/i.test(line))continue;
    out.push(line);
  }
  return out;
}
function headingInfo(line){
  const l=norm(line);
  if(!l)return null;
  let m=l.match(/^(\d+)\.(\d+)\s+(.{3,140})$/);
  if(m)return {level:3,text:l};
  m=l.match(/^(\d+)\.?\s+(.{3,140})$/);
  if(m && !/^\d+\s*\/\s*\d+/.test(l) && !/^\d+\s+(Quais|Qual|A |O |Como |Quando |Pequeno|Pessoalidade|Na )/i.test(l)){
    return {level:2,text:l};
  }
  if(/^(VISÃO GERAL|VISAO GERAL|REVISÃO ATIVA|REVISAO ATIVA|ARTIGOS PARA DECORAR|PEGADINHAS DE PROVA|MAPA DO MÓDULO|MAPA DO MODULO|TEORIA ESSENCIAL)$/i.test(l)){
    return {level:2,text:l};
  }
  return null;
}
function calloutType(line){
  const l=norm(line).toUpperCase();
  if(/^(✅\s*)?EXEMPLO/.test(l))return ['example','Exemplo'];
  if(/PEGADINHA/.test(l))return ['trap','Pegadinha'];
  if(/^(⚖️\s*)?LEI SECA/.test(l))return ['law','Lei seca'];
  if(/^(DECORE|MEMÓRIA|MEMORIA|MNEMÔNICO|MNEMONICO|REGRA DE OURO|IDEIA-CENTRAL|IDEIA CENTRAL|FÓRMULA|FORMULA|MEMORIZACAO RAPIDA)/.test(l))return ['memory',norm(line)];
  if(/^(STF|STJ|JURISPRUDÊNCIA|JURISPRUDENCIA|ATUALIZAÇÃO|ATUALIZACAO)/.test(l))return ['case',norm(line)];
  if(/^(COMPARAÇÃO|COMPARACAO|ATENÇÃO|ATENCAO|PROVA|CUIDADO|FRONTEIRA DO MÓDULO|FRONTEIRA DO MODULO)/.test(l))return ['case',norm(line)];
  return null;
}
function isBullet(line){return /^[•●▪◦*-]\s+/.test(line)}
function looksTitle(line){
  const l=norm(line);
  if(l.length<3||l.length>105)return false;
  if(/[.!?]$/.test(l))return false;
  if(/^[A-ZÁÉÍÓÚÂÊÔÃÕÇ0-9][A-ZÁÉÍÓÚÂÊÔÃÕÇ0-9\s:–—()/%ºª,.-]+$/.test(l)&&l.split(/\s+/).length<=12)return true;
  return false;
}
function parse(raw,mode){
  const lines=cleanLines(raw,mode);
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
        if(!next){if(body.length)break;else continue}
        if(headingInfo(next)||calloutType(next)||looksTitle(next))break;
        body.push(next);i=j;
      }
      blocks.push({type:'callout',kind:co[0],label:co[1],text:body.join(' ')});
      continue;
    }
    if(isBullet(line)){
      flush();
      const items=[line.replace(/^[•●▪◦*-]\s+/,'')];
      while(i+1<lines.length&&isBullet(lines[i+1]))items.push(lines[++i].replace(/^[•●▪◦*-]\s+/,''));
      blocks.push({type:'ul',items});
      continue;
    }
    if(looksTitle(line)&&mode==='summary'){flush();blocks.push({type:'h',level:3,text:line});continue}
    para.push(line);
  }
  flush();
  const firstH=blocks.findIndex(b=>b.type==='h');
  if(firstH>2){
    const lead=blocks.slice(0,firstH).filter(b=>b.type==='p').map(b=>b.text).join(' ');
    blocks.splice(0,firstH,{type:'lead',text:lead});
  }
  return blocks;
}
function buildHtml(data,mode){
  if(mode==='complete' && data.completeHtml){
    const host=document.createElement('div');
    host.innerHTML=data.completeHtml;
    host.querySelector('.pen-m2-cover')?.remove();
    host.querySelector('.pen-m2-toc')?.remove();
    host.querySelector('.pen-m2-orientacao')?.remove();
    host.querySelector('#pen-m2-s25')?.remove();

    const headings=[];
    host.querySelectorAll('article.pen-m2-session').forEach((section,index)=>{
      const h=section.querySelector('h3');
      if(!h)return;
      if(!h.id)h.id='bcsec-complete-'+(index+1)+'-'+slug(h.textContent);
      headings.push({id:h.id,text:norm(h.textContent),level:2,key:normKey(h.textContent)});
    });

    // Normalize native M2 blocks to the reader's component vocabulary.
    host.querySelectorAll('.pen-m2-callout').forEach(el=>el.classList.add('bc-native-callout'));
    host.querySelectorAll('.pen-m2-table-wrap').forEach(el=>el.classList.add('bc-native-table-wrap'));
    const text=norm(host.textContent);
    const words=text.split(/\s+/).filter(Boolean).length;
    const mins=Math.max(1,Math.round(words/190));
    return {body:host.innerHTML,headings,words,mins};
  }

  const raw=mode==='summary'?data.summary:data.complete;
  const blocks=parse(raw,mode);
  const headings=[];
  let hCount=0;
  const body=blocks.map(b=>{
    if(b.type==='h'){
      const id='bcsec-'+(++hCount)+'-'+slug(b.text);
      headings.push({id,text:b.text,level:b.level,key:normKey(b.text)});
      return '<h'+b.level+' id="'+id+'">'+esc(b.text)+'</h'+b.level+'>';
    }
    if(b.type==='lead')return '<p class="lead">'+esc(b.text)+'</p>';
    if(b.type==='p')return '<p>'+esc(b.text)+'</p>';
    if(b.type==='ul')return '<ul>'+b.items.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>';
    if(b.type==='callout')return '<aside class="bc-native-callout '+b.kind+'"><b>'+esc(b.label)+'</b><div>'+esc(b.text)+'</div></aside>';
    return '';
  }).join('');
  const words=norm(raw).split(/\s+/).filter(Boolean).length;
  const mins=Math.max(1,Math.round(words/(mode==='summary'?220:190)));
  return {body,headings,words,mins};
}
function modeChapters(data,mode){return Array.isArray(data?.chapters?.[mode])?data.chapters[mode]:[]}
function modeQuestions(data,mode){return Array.isArray(data?.internalQuestions?.[mode])?data.internalQuestions[mode]:[]}
function chapterDone(mode,id){return localStorage.getItem(storageKey('chapter:'+mode+':'+id))==='1'}
function setChapterDone(mode,id,done){
  localStorage.setItem(storageKey('chapter:'+mode+':'+id),done?'1':'0');
}
function internalAnswer(mode,id){
  try{return JSON.parse(localStorage.getItem(storageKey('internal:'+mode+':'+id))||'null')}catch(_){return null}
}
function saveInternalAnswer(mode,q,selected){
  const prev=internalAnswer(mode,q.id)||{attempts:0};
  const state={
    selected:Number(selected),
    correct:Number(selected)===Number(q.answer),
    attempts:(prev.attempts||0)+1,
    updatedAt:new Date().toISOString()
  };
  localStorage.setItem(storageKey('internal:'+mode+':'+q.id),JSON.stringify(state));
  return state;
}
function resetInternalAnswer(mode,id){localStorage.removeItem(storageKey('internal:'+mode+':'+id))}

function modeStudyStats(data,mode){
  const chapters=modeChapters(data,mode);
  const questions=modeQuestions(data,mode);
  const chapterDoneCount=chapters.filter(ch=>chapterDone(mode,ch.id)).length;
  const answered=questions.filter(q=>!!internalAnswer(mode,q.id)).length;
  const correct=questions.filter(q=>internalAnswer(mode,q.id)?.correct).length;
  return {
    chapterDone:chapterDoneCount,
    chapterTotal:chapters.length,
    answered,
    questionTotal:questions.length,
    correct,
    done:chapterDoneCount+answered,
    total:chapters.length+questions.length
  };
}
function theoryStats(){
  const data=source();
  if(!data)return {done:0,total:0,pct:0};
  const s=modeStudyStats(data,'summary');
  const c=modeStudyStats(data,'complete');
  const done=s.done+c.done,total=s.total+c.total;
  return {done,total,pct:total?Math.round(done/total*100):0,summary:s,complete:c};
}
function externalStats(){
  try{
    const rows=JSON.parse(localStorage.getItem('central-v6:module-rounds:penal:p2')||'[]');
    const valid=(Array.isArray(rows)?rows:[]).map(r=>({
      done:Math.max(0,Number(r.valid ?? r.done)||0),
      correct:Math.max(0,Number(r.correct)||0)
    })).filter(r=>r.done>0);
    const answered=valid.reduce((n,r)=>n+r.done,0);
    const correct=valid.reduce((n,r)=>n+Math.min(r.correct,r.done),0);
    return {answered,correct,rounds:valid.length,accuracy:answered?Math.round(correct/answered*100):null};
  }catch(_){
    return {answered:0,correct:0,rounds:0,accuracy:null};
  }
}
function setRing(el,pct,label){
  if(!el)return;
  const safe=Math.max(0,Math.min(100,Number(pct)||0));
  el.style.setProperty('--pct',String(safe));
  const value=el.querySelector('[data-ring-value]');
  if(value)value.textContent=label??(safe+'%');
}
function refreshModuleMetrics(){
  const module=document.querySelector(M1_SELECTOR);
  if(!module)return;
  const theory=theoryStats(),external=externalStats();

  setRing(module.querySelector('[data-native-ring="theory"]'),theory.pct,theory.pct+'%');
  const theoryDetail=module.querySelector('[data-native-metric-detail="theory"]');
  if(theoryDetail)theoryDetail.textContent=theory.done+' de '+theory.total+' pontos concluídos';

  setRing(module.querySelector('[data-native-ring="external"]'),external.accuracy??0,external.accuracy==null?'—':external.accuracy+'%');
  const extDetail=module.querySelector('[data-native-metric-detail="external"]');
  if(extDetail){
    extDetail.textContent=external.answered
      ? external.correct+' acertos em '+external.answered+' questões externas'
      : 'Nenhuma questão externa respondida';
  }
  const extMeta=module.querySelector('[data-native-metric-meta="external"]');
  if(extMeta)extMeta.textContent=external.answered
    ? external.rounds+' rodada(s) registrada(s) no final do módulo'
    : 'Registre questões externas no final do módulo';

  const headerStat=module.querySelector('.cf-module-stat');
  if(headerStat)headerStat.textContent='Cobertura '+theory.pct+'% • teoria + revisão interna';
  const legacyBar=module.querySelector('.cf-module-bar span');
  if(legacyBar)legacyBar.style.width=theory.pct+'%';
  refreshCardState();
}
function refreshCardState(){
  const data=source();if(!data)return;
  ['summary','complete'].forEach(kind=>{
    const st=modeStudyStats(data,kind);
    document.querySelectorAll(M1_SELECTOR+' [data-native-kind="'+kind+'"]').forEach(card=>{
      const tag=card.querySelector('.bc-native-material-action span:first-child');
      if(tag)tag.textContent=st.done===st.total&&st.total?'✓ Concluído':st.chapterDone+'/'+st.chapterTotal+' capítulos';
    });
  });
}

function close(){
  document.getElementById(OVERLAY_ID)?.remove();
  document.body.style.overflow='';
  current=null;
}
function buildChapterMap(){
  if(!current)return [];
  return modeChapters(source(),current.mode).map(ch=>({chapter:ch,heading:findHeadingForChapter(ch)})).filter(x=>x.heading);
}
function autoMarkViewedChapters(){
  if(!current||!current.chapterMap?.length)return;
  const sc=current.scroll;
  const viewportBottom=sc.scrollTop+sc.clientHeight;
  let changed=false;
  current.chapterMap.forEach((item,index)=>{
    if(chapterDone(current.mode,item.chapter.id))return;
    const start=item.heading.offsetTop;
    const next=current.chapterMap[index+1]?.heading?.offsetTop ?? current.article.scrollHeight;
    const target=start+Math.max(80,(next-start)*0.72);
    if(viewportBottom>=target){
      setChapterDone(current.mode,item.chapter.id,true);
      changed=true;
    }
  });
  if(changed)refreshReaderStudyUI();
}
function updateScrollProgress(){
  if(!current)return;
  const sc=current.scroll;
  const max=Math.max(1,sc.scrollHeight-sc.clientHeight);
  const pct=Math.max(0,Math.min(100,sc.scrollTop/max*100));
  const bar=current.overlay.querySelector('.bc-native-reader-progress');
  if(bar)bar.style.width=pct+'%';
  localStorage.setItem(storageKey(current.mode+':scroll'),String(sc.scrollTop));
  autoMarkViewedChapters();
}
function restoreScroll(){
  if(!current)return;
  const v=Number(localStorage.getItem(storageKey(current.mode+':scroll'))||0);
  if(v>0)current.scroll.scrollTop=v;
}
function setFont(delta){
  if(!current)return;
  current.font=Math.max(14,Math.min(21,current.font+delta));
  current.article.style.fontSize=current.font+'px';
  localStorage.setItem(storageKey('font'),String(current.font));
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
      frag.append(raw.slice(pos,idx));
      const mk=document.createElement('mark');mk.className='bc-native-search-hit';mk.textContent=raw.slice(idx,idx+term.length);frag.append(mk);
      n++;pos=idx+term.length;
    }
    frag.append(raw.slice(pos));node.replaceWith(frag);
  }
  root.querySelector('mark.bc-native-search-hit')?.scrollIntoView({block:'center'});
  return n;
}
function findHeadingForChapter(chapter){
  if(!current)return null;
  const target=normKey(chapter.title).replace(/^\d+\s+/,'');
  const words=target.split(' ').filter(w=>w.length>3);
  const headings=Array.from(current.article.querySelectorAll('h2,h3'));
  let best=null,bestScore=0;
  for(const h of headings){
    const hk=normKey(h.textContent);
    let score=0;
    words.forEach(w=>{if(hk.includes(w))score++});
    if(score>bestScore){bestScore=score;best=h}
  }
  return bestScore>=Math.max(1,Math.min(2,words.length))?best:null;
}
function refreshReaderStudyUI(){
  if(!current)return;
  const data=source(),st=modeStudyStats(data,current.mode);
  const value=current.overlay.querySelector('[data-reader-study-value]');
  const bar=current.overlay.querySelector('[data-reader-study-bar]');
  const qscore=current.overlay.querySelector('[data-reader-internal-score]');
  if(value)value.textContent=st.done+' / '+st.total+' pontos';
  if(bar)bar.style.width=(st.total?Math.round(st.done/st.total*100):0)+'%';
  if(qscore)qscore.textContent=st.answered
    ? st.correct+' acertos em '+st.answered+' respondidas'
    : 'Nenhuma questão interna respondida';

  current.overlay.querySelectorAll('[data-chapter-check]').forEach(btn=>{
    const done=chapterDone(current.mode,btn.dataset.chapterCheck);
    btn.classList.toggle('done',done);
    btn.setAttribute('aria-pressed',String(done));
    btn.textContent=done?'✓':'';
  });
  refreshModuleMetrics();
}
function chapterTocHtml(data,mode){
  return modeChapters(data,mode).map((ch,i)=>{
    const done=chapterDone(mode,ch.id);
    return '<div class="bc-native-toc-row">'+
      '<button type="button" class="bc-native-chapter-check '+(done?'done':'')+'" data-chapter-check="'+esc(ch.id)+'" aria-pressed="'+done+'" title="Marcar capítulo">'+(done?'✓':'')+'</button>'+
      '<button type="button" class="bc-native-chapter-jump" data-chapter-jump="'+esc(ch.id)+'"><span>'+(i+1)+'.</span>'+esc(ch.title)+'</button>'+
    '</div>';
  }).join('');
}
function quizHtml(data,mode){
  const qs=modeQuestions(data,mode);
  if(!qs.length)return '';
  const cards=qs.map((q,i)=>{
    const a=internalAnswer(mode,q.id);
    const options=q.options.map((op,idx)=>{
      let cls='';
      if(a){
        if(idx===q.answer)cls+=' correct';
        if(idx===a.selected&&idx!==q.answer)cls+=' wrong';
      }
      return '<button type="button" class="bc-native-quiz-option'+cls+'" data-internal-q="'+esc(q.id)+'" data-option="'+idx+'" '+(a?'disabled':'')+'><span>'+String.fromCharCode(65+idx)+'</span>'+esc(op)+'</button>';
    }).join('');
    return '<article class="bc-native-quiz-card" data-quiz-card="'+esc(q.id)+'">'+
      '<div class="bc-native-quiz-number">Questão '+(i+1)+' de '+qs.length+'</div>'+
      '<h3>'+esc(q.q)+'</h3>'+
      '<div class="bc-native-quiz-options">'+options+'</div>'+
      '<div class="bc-native-quiz-feedback '+(a?(a.correct?'ok':'bad'):'')+'" data-quiz-feedback>'+
        (a?'<b>'+(a.correct?'✓ Correto':'✕ Incorreto')+'</b><span>'+esc(q.explanation)+'</span><button type="button" data-internal-retry="'+esc(q.id)+'">Refazer</button>':'<span>Escolha uma alternativa para receber o feedback.</span>')+
      '</div>'+
    '</article>';
  }).join('');
  return '<section class="bc-native-internal-review">'+
    '<div class="bc-native-internal-review-head"><div><span class="bc-native-kicker">REVISÃO ATIVA INTERNA</span><h2>'+qs.length+' questões de assimilação</h2><p>Estas questões contam na <b>cobertura da teoria</b>. Elas não entram no gráfico de questões externas.</p></div><div class="bc-native-internal-score" data-reader-internal-score></div></div>'+
    cards+
  '</section>';
}
function bindQuiz(){
  if(!current)return;
  const data=source();
  current.overlay.querySelectorAll('[data-internal-q]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const q=modeQuestions(data,current.mode).find(x=>x.id===btn.dataset.internalQ);
      if(!q)return;
      saveInternalAnswer(current.mode,q,Number(btn.dataset.option));
      rerenderQuizCard(q.id);
      refreshReaderStudyUI();
    });
  });
  current.overlay.querySelectorAll('[data-internal-retry]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      resetInternalAnswer(current.mode,btn.dataset.internalRetry);
      rerenderQuizCard(btn.dataset.internalRetry);
      refreshReaderStudyUI();
    });
  });
}
function rerenderQuizCard(id){
  if(!current)return;
  const data=source(),q=modeQuestions(data,current.mode).find(x=>x.id===id);
  const old=current.overlay.querySelector('[data-quiz-card="'+CSS.escape(id)+'"]');
  if(!q||!old)return;
  const i=modeQuestions(data,current.mode).findIndex(x=>x.id===id);
  const a=internalAnswer(current.mode,id);
  const options=q.options.map((op,idx)=>{
    let cls='';
    if(a){
      if(idx===q.answer)cls+=' correct';
      if(idx===a.selected&&idx!==q.answer)cls+=' wrong';
    }
    return '<button type="button" class="bc-native-quiz-option'+cls+'" data-internal-q="'+esc(q.id)+'" data-option="'+idx+'" '+(a?'disabled':'')+'><span>'+String.fromCharCode(65+idx)+'</span>'+esc(op)+'</button>';
  }).join('');
  old.innerHTML='<div class="bc-native-quiz-number">Questão '+(i+1)+' de '+modeQuestions(data,current.mode).length+'</div>'+
    '<h3>'+esc(q.q)+'</h3><div class="bc-native-quiz-options">'+options+'</div>'+
    '<div class="bc-native-quiz-feedback '+(a?(a.correct?'ok':'bad'):'')+'" data-quiz-feedback>'+
      (a?'<b>'+(a.correct?'✓ Correto':'✕ Incorreto')+'</b><span>'+esc(q.explanation)+'</span><button type="button" data-internal-retry="'+esc(q.id)+'">Refazer</button>':'<span>Escolha uma alternativa para receber o feedback.</span>')+
    '</div>';
  bindQuiz();
}
function open(mode){
  const data=source();if(!data){alert('Conteúdo nativo do M01 ainda não foi carregado.');return}
  close();
  const parsed=buildHtml(data,mode);
  const label=mode==='summary'?'Conteúdo resumido':'Conteúdo completo';
  const chapters=modeChapters(data,mode),questions=modeQuestions(data,mode);
  const ov=document.createElement('div');
  ov.id=OVERLAY_ID;ov.className='bc-native-reader-overlay';
  ov.innerHTML='<section class="bc-native-reader" role="dialog" aria-modal="true" aria-label="'+esc(label)+'">'+
    '<header class="bc-native-reader-head"><div class="bc-native-reader-title"><b>PEN M02 — '+esc(data.title)+'</b><small>'+label+' • experiência nativa da Base Completa</small></div><span class="bc-native-reader-meta">'+parsed.words.toLocaleString('pt-BR')+' palavras • ~'+parsed.mins+' min</span><button class="bc-native-reader-close" data-native-action="close" aria-label="Fechar">×</button><div class="bc-native-reader-progress-track"><div class="bc-native-reader-progress"></div></div></header>'+
    '<div class="bc-native-reader-tools"><input type="search" placeholder="Buscar neste material…" aria-label="Buscar"><button data-native-action="smaller">A−</button><button data-native-action="larger">A+</button><button class="primary" data-native-action="top">Ir ao topo</button></div>'+
    '<div class="bc-native-reader-body">'+
      '<nav class="bc-native-toc"><div class="bc-native-toc-label">Capítulos para concluir</div>'+chapterTocHtml(data,mode)+'</nav>'+
      '<main class="bc-native-scroll"><article class="bc-native-article">'+
        '<div class="bc-native-kicker">'+(mode==='summary'?'PRIMEIRA LEITURA + REVISÃO':'TEORIA INTEGRAL')+'</div>'+
        '<h1>'+esc(data.title)+'</h1>'+
        '<p class="lead">'+(mode==='summary'?'Versão condensada para compreender o módulo e revisar os pontos de maior rendimento.':'Conteúdo integral convertido para leitura nativa, sem leitor de PDF.')+'</p>'+
        '<section class="bc-native-study-progress"><div><b>Progresso neste material</b><span data-reader-study-value>0 / '+(chapters.length+questions.length)+' pontos</span></div><div class="bc-native-study-progress-track"><span data-reader-study-bar></span></div><small>'+chapters.length+' capítulos + '+questions.length+' questões internas. Os capítulos recebem check automaticamente conforme você avança; as questões internas também entram na cobertura da teoria.</small></section>'+
        parsed.body+
        quizHtml(data,mode)+
      '</article></main>'+
    '</div></section>';
  document.body.appendChild(ov);document.body.style.overflow='hidden';

  current={
    mode,overlay:ov,scroll:ov.querySelector('.bc-native-scroll'),article:ov.querySelector('.bc-native-article'),
    font:Number(localStorage.getItem(storageKey('font'))||16),chapterMap:[]
  };
  current.article.style.fontSize=current.font+'px';
  current.scroll.addEventListener('scroll',updateScrollProgress,{passive:true});
  ov.querySelector('[data-native-action="close"]').onclick=close;
  ov.querySelector('[data-native-action="smaller"]').onclick=()=>setFont(-1);
  ov.querySelector('[data-native-action="larger"]').onclick=()=>setFont(1);
  ov.querySelector('[data-native-action="top"]').onclick=()=>current.scroll.scrollTo({top:0,behavior:'smooth'});
  ov.querySelector('.bc-native-reader-tools input').addEventListener('input',e=>search(e.target.value));

  ov.querySelectorAll('[data-chapter-check]').forEach(btn=>{
    btn.onclick=()=>{
      const id=btn.dataset.chapterCheck;
      setChapterDone(mode,id,!chapterDone(mode,id));
      refreshReaderStudyUI();
    };
  });
  ov.querySelectorAll('[data-chapter-jump]').forEach(btn=>{
    btn.onclick=()=>{
      const ch=modeChapters(data,mode).find(x=>x.id===btn.dataset.chapterJump);
      findHeadingForChapter(ch)?.scrollIntoView({behavior:'smooth',block:'start'});
    };
  });

  bindQuiz();
  ov.addEventListener('click',e=>{if(e.target===ov)close()});
  requestAnimationFrame(()=>{
    current.chapterMap=buildChapterMap();
    restoreScroll();updateScrollProgress();refreshReaderStudyUI();autoMarkViewedChapters();
  });
}
function openMap(){
  if(global.BaseMindMap?.open)global.BaseMindMap.open('penal','p2');
  else alert('O mapa mental interativo ainda está carregando. Tente novamente em alguns segundos.');
}
function removeLegacyM01Content(){
  const module=document.querySelector(M1_SELECTOR);
  if(!module)return;
  module.querySelectorAll('.bc-session-nav,.bc-session-pager').forEach(el=>el.remove());
}
function inject(){
  const module=document.querySelector(M1_SELECTOR);if(!module)return;
  removeLegacyM01Content();
  const body=module.querySelector('.cf-module-body');if(!body)return;

  // Fallback: a renderização principal já entrega os cards diretamente.
  if(!body.querySelector('.bc-native-materials')){
    const host=document.createElement('section');host.className='bc-native-materials';
    host.innerHTML='<div class="bc-native-materials-head"><div><b>Materiais do módulo</b><small>Escolha como estudar</small></div><small>Piloto M02 • conteúdo nativo</small></div>'+
      '<div class="bc-native-material-grid">'+
        '<button class="bc-native-material-card" data-native-kind="summary"><span class="bc-native-material-icon">⚡</span><span><strong>Conteúdo resumido</strong><small>Primeira leitura, revisão rápida, artigos, pegadinhas e revisão ativa.</small></span><span class="bc-native-material-action"><span>Abrir</span><span>→</span></span></button>'+
        '<button class="bc-native-material-card" data-native-kind="complete"><span class="bc-native-material-icon">📚</span><span><strong>Conteúdo completo</strong><small>Teoria integral do M02 em formato de site, com índice, busca e progresso de leitura.</small></span><span class="bc-native-material-action"><span>Abrir</span><span>→</span></span></button>'+
        '<button class="bc-native-material-card" data-native-kind="mindmap"><span class="bc-native-material-icon">🧠</span><span><strong>Mapa mental</strong><small>Mapa interativo com abrir/recolher ramos, zoom, arrastar e tela cheia.</small></span><span class="bc-native-material-action"><span>Abrir</span><span>→</span></span></button>'+
      '</div>';
    host.querySelector('[data-native-kind="summary"]').onclick=()=>open('summary');
    host.querySelector('[data-native-kind="complete"]').onclick=()=>open('complete');
    host.querySelector('[data-native-kind="mindmap"]').onclick=openMap;
    const subtitle=body.querySelector('.cf-subtitle');
    if(subtitle)subtitle.insertAdjacentElement('afterend',host);else body.insertAdjacentElement('afterbegin',host);
  }
  refreshModuleMetrics();
}
function install(){
  inject();
  observer=new MutationObserver(()=>{
    clearTimeout(install._t);
    install._t=setTimeout(()=>{removeLegacyM01Content();inject();refreshModuleMetrics()},60);
  });
  observer.observe(document.documentElement,{subtree:true,childList:true});
  global.addEventListener('focus',refreshModuleMetrics);
}
global.BaseNativeReaderM02={
  open,close,refreshMetrics:refreshModuleMetrics,theoryStats,externalStats,
  version:'2026.10.02-m02-pilot1'
};
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.getElementById(OVERLAY_ID))close()});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})(window);
/* M03 preview handoff */

/* M03 preview bundled */
(function(global){
'use strict';
global.BASE_NATIVE_CONTENT=global.BASE_NATIVE_CONTENT||{};
global.BASE_NATIVE_CONTENT.penal=global.BASE_NATIVE_CONTENT.penal||{};
global.BASE_NATIVE_CONTENT.penal.m03={"moduleId":"p3","number":3,"title":"Teoria do Crime","updatedAt":"2026-10-02","sources":{"completeDriveId":"1sw3Ej6Qkj5QUCJ2p6JPb7mfyqAbY8X8e","completeTheoryKey":"p3","summaryDriveId":"18BcsebL1U1RrXn0yFQfP5zZM4bxR77Fv","mindMapDriveId":"1kav9wOIBkNWHSBl8Yjawl8W8m3CGng7D"},"summary":"BASE COMPLETA | DIREITO PENAL | PEN M3 Teoria do Crime - primeira leitura + revisão\r\nBase: PEN M3 auditado; arts. 13-19 conferidos no Código Penal compilado em 01/10/2026. 1\r\nPEN M3 - TEORIA DO CRIME\r\nResumo de poucas páginas para primeira leitura e revisão dos pontos de maior rendimento.\r\nCOMO USAR\r\nPrimeira leitura: leia as páginas 1 a 5 em sequência e marque apenas as diferenças entre institutos. Revisão: volte aos\r\nquadros, aos arts. 13 a 19, às pegadinhas e à revisão ativa da última página.\r\n1. Visão geral\r\nConceito analítico (estrutura tripartida): crime = fato típico + ilicitude + culpabilidade. Neste módulo, o foco é o fato\r\ntípico; ilicitude e culpabilidade são aprofundadas nos módulos seguintes.\r\nMAPA DE 30 SEGUNDOS\r\nConduta -> resultado naturalístico (quando exigido) -> nexo causal (quando necessário) -> tipicidade.\r\nDepois: ilicitude -> culpabilidade.\r\nConceito de crime O que pergunta Chave de prova\r\nFormal A lei descreve a conduta como crime e prevê\r\nsanção?\r\nLegalidade e enquadramento normativo.\r\nMaterial Há lesão ou perigo relevante ao bem jurídico? Relevância penal da ofensa.\r\nAnalítico Quais substratos do crime estão presentes? Fato típico -> ilicitude -> culpabilidade.\r\nFato típico: o núcleo do M3\r\n• Conduta: comportamento humano penalmente relevante, por ação ou omissão.\r\n• Resultado naturalístico: modificação no mundo exterior; não é exigido em todos os crimes.\r\n• Nexo causal: liga a conduta ao resultado nos delitos em que o resultado importa para a estrutura típica.\r\n• Tipicidade: adequação do fato ao tipo, com dimensão formal e material.\r\n• Dolo e culpa: no finalismo, integram o fato típico.\r\nRESULTADO JURÍDICO\r\nLesão ou perigo de lesão ao bem jurídico. Está presente na\r\ninfração penal em sentido jurídico.\r\nRESULTADO NATURALÍSTICO\r\nAlteração perceptível no mundo exterior. Pode ser exigido,\r\ndispensável para consumação ou não destacado pelo tipo.BASE COMPLETA | DIREITO PENAL | PEN M3 Teoria do Crime - primeira leitura + revisão\r\nBase: PEN M3 auditado; arts. 13-19 conferidos no Código Penal compilado em 01/10/2026. 2\r\n2. Teoria - conduta, resultado, omissão e classificações\r\nTeorias da conduta\r\nTeoria Ideia central Dolo e culpa\r\nCausalismo Conduta como movimento voluntário causal; tipo predominantemente\r\nobjetivo.\r\nNa culpabilidade.\r\nNeokantismo Mantém base causal, mas introduz valorações jurídico-penais. Em regra, na culpabilidade.\r\nFinalismo Ação orientada a uma finalidade; o tipo ganha dimensão subjetiva. Migra para o fato típico.\r\nFuncionalismo Relê categorias por funções do Direito Penal e critérios normativos. Não retorna simplesmente ao\r\ncausalismo.\r\nCrimes materiais, formais e de mera conduta\r\nCategoria Resultado naturalístico Consumação\r\nMaterial Previsto e exigido. Só com a produção do resultado.\r\nFormal Previsto, mas dispensável para consumação. Consuma-se antes do resultado ulterior.\r\nMera conduta Não há resultado naturalístico destacado no\r\ntipo.\r\nCom a própria conduta típica.\r\nCrimes omissivos e posição de garantidor\r\nOmissivo próprio: o tipo pune diretamente a abstenção. Em regra, não se imputa ao omitente um resultado naturalístico\r\nexterno como elemento necessário do tipo.\r\nOmissivo impróprio (comissivo por omissão): o garantidor responde pelo crime de resultado que devia e podia evitar. A\r\nposição de garantidor vem do art. 13, § 2º.\r\nGARANTIDOR - DECORE AS 3 FONTES\r\n1) Lei: obrigação de cuidado, proteção ou vigilância.\r\n2) Assunção: assumiu a responsabilidade de impedir o resultado.\r\n3) Ingerência: comportamento anterior criou o risco da ocorrência do resultado.\r\nMais: não basta ter dever; era necessário poder agir concretamente.\r\nClassificações essenciais\r\nPar Distinção que resolve a questão\r\nComum x próprio Qualquer pessoa pode praticar x exige qualidade especial do sujeito ativo.\r\nPróprio x mão própria Qualidade especial x execução pessoal da conduta nuclear.\r\nInstantâneo x permanente Consumação pontual x situação típica se prolonga por vontade do agente.\r\nInstantâneo de efeitos permanentes Consumação pontual; os efeitos permanecem sem manutenção da situação típica.\r\nDano x perigo Lesão efetiva x exposição do bem jurídico a risco.\r\nUnissubsistente x plurissubsistente Execução não fracionável x execução divisível em atos; a tentativa depende desse\r\nfracionamento.\r\nUnissubjetivo x plurissubjetivo Pode ser praticado por um só agente x o tipo exige pluralidade de agentes.\r\nSimples x complexo Estrutura unitária x reunião de elementos que isoladamente podem corresponder a outros\r\ndelitos.BASE COMPLETA | DIREITO PENAL | PEN M3 Teoria do Crime - primeira leitura + revisão\r\nBase: PEN M3 auditado; arts. 13-19 conferidos no Código Penal compilado em 01/10/2026. 3\r\n2. Teoria - causalidade, concausas e imputação objetiva\r\nREGRA DO ART. 13\r\nConduta -> nexo causal -> resultado. O Código Penal parte da equivalência dos antecedentes: causa é a ação ou omissão\r\nsem a qual o resultado não teria ocorrido. Use o processo hipotético de eliminação: retire mentalmente a conduta; se o\r\nresultado, tal como ocorreu, desaparece ou muda relevantemente, há causalidade fática.\r\nConcausas: o que realmente importa\r\nConcausa Relação com a conduta Efeito\r\nAbsolutamente independente Não integra o curso causal da conduta analisada. Se ela produziu o resultado, não há nexo\r\nentre a conduta e esse resultado.\r\nRelativa preexistente Já existia e interage com a conduta. Em regra, mantém o nexo se a conduta\r\ncontribuiu.\r\nRelativa concomitante Surge no mesmo período e interage com a conduta. Em regra, mantém o nexo.\r\nRelativa superveniente - não produz\r\npor si só\r\nSurge depois, mas apenas participa do curso\r\niniciado.\r\nMantém a imputação do resultado.\r\nRelativa superveniente - por si só\r\nproduz o resultado\r\nNovo curso causal torna-se suficiente para o\r\nresultado final.\r\nArt. 13, § 1º: exclui a imputação do\r\nresultado final; fatos anteriores\r\npermanecem imputáveis.\r\nPERGUNTA-CHAVE PARA A CAUSA SUPERVENIENTE\r\nA causa superveniente relativamente independente, por si só, produziu o resultado?\r\nSIM: rompe a imputação do resultado final.\r\nNÃO: o nexo permanece.\r\nImputação objetiva: filtro depois da causalidade\r\nA causalidade física não encerra a análise. A imputação objetiva funciona como filtro normativo. Em síntese, pergunte:\r\n• Risco: a conduta criou ou incrementou risco juridicamente desaprovado?\r\n• Realização: foi justamente esse risco que se concretizou no resultado?\r\n• Âmbito de proteção: o resultado é daquele tipo que a norma buscava evitar?\r\n• Princípio da confiança: em atividades reguladas, quem atua corretamente pode, em princípio, confiar na atuação correta\r\ndos demais, salvo sinais concretos em sentido contrário.\r\nCAUSALIDADE FÁTICA\r\nPergunta se a conduta é condição do resultado. Base: art. 13 e\r\neliminação hipotética.\r\nIMPUTAÇÃO JURÍDICA\r\nPergunta se o resultado, além de causado, pode ser\r\nnormativamente atribuído ao agente.\r\nEsquema de resolução de caso causal\r\nPASSO A PASSO\r\n1. Há resultado naturalístico relevante? 2. A conduta foi condição do resultado? 3. Existe concausa? 4. Ela é absoluta ou\r\nrelativa? 5. Se relativa e superveniente, produziu o resultado por si só? 6. O risco criado é juridicamente imputável?BASE COMPLETA | DIREITO PENAL | PEN M3 Teoria do Crime - primeira leitura + revisão\r\nBase: PEN M3 auditado; arts. 13-19 conferidos no Código Penal compilado em 01/10/2026. 4\r\n2. Teoria - iter criminis, tentativa e arrependimentos\r\nLINHA DO CRIME DOLOSO\r\nCogitação -> preparação -> execução -> consumação -> exaurimento.\r\nCogitação não é punível. Preparação, em regra, não é punida como tentativa, mas pode constituir crime autônomo. A\r\npartir da execução pode existir tentativa.\r\nConsumação x exaurimento\r\nCONSUMAÇÃO\r\nReúnem-se todos os elementos da definição legal. É o marco do\r\ncrime consumado.\r\nEXAURIMENTO\r\nEtapa posterior: efeitos ou finalidade adicional depois de o crime\r\njá estar consumado.\r\nTentativa - art. 14, II\r\nHá tentativa quando a execução começou e o crime não se consumou por circunstâncias alheias à vontade do agente.\r\nRequisitos: dolo de consumação, início da execução, não consumação e fator externo à vontade. Pena: a do consumado,\r\nreduzida de 1/3 a 2/3, salvo regra especial.\r\nEspécie Critério\r\nImperfeita / inacabada O agente é interrompido antes de esgotar os atos executórios.\r\nPerfeita / acabada Esgota os atos executórios pretendidos, mas o resultado não ocorre.\r\nBranca / incruenta A vítima ou objeto material não é atingido.\r\nVermelha / cruenta A vítima ou objeto é atingido, mas não há consumação.\r\nInfrações que normalmente não admitem tentativa\r\nCulposos; preterdolosos quanto ao resultado agravador; unissubsistentes; omissivos próprios; habituais; contravenções\r\n(tentativa não punível); crimes de atentado/empreendimento, porque a lei equipara tentativa e consumação para a\r\npena. Crime formal, por si só, pode admitir tentativa se a execução for fracionável.\r\nPor que o resultado não ocorreu? - quadro decisório\r\nSituação Instituto Efeito\r\nFator alheio impede a consumação. Tentativa Responde pelo crime tentado;\r\nredução legal.\r\nAgente podia continuar, mas para voluntariamente. Desistência voluntária Responde apenas pelos atos já\r\npraticados.\r\nEsgota os atos e depois impede eficazmente o\r\nresultado.\r\nArrependimento eficaz Responde apenas pelos atos já\r\npraticados.\r\nCrime se consumou; depois repara/restitui nos\r\nrequisitos legais.\r\nArrependimento posterior Crime continua consumado; pena\r\nreduzida de 1/3 a 2/3.\r\nFÓRMULA DE FRANK\r\nQuero prosseguir, mas não posso = tentativa.\r\nPosso prosseguir, mas não quero = desistência voluntária.\r\nVoluntariedade não exige espontaneidade absoluta.\r\nArrependimento posterior - art. 16\r\nPressupõe crime já consumado. Requisitos: crime sem violência ou grave ameaça à pessoa; reparação do dano ou\r\nrestituição da coisa; ato voluntário; conclusão até o recebimento da denúncia ou queixa. Preenchidos os requisitos, a\r\npena é reduzida de 1/3 a 2/3.\r\nCrime impossível - art. 17\r\nNão se pune a tentativa quando a consumação é absolutamente impossível por ineficácia absoluta do meio ou\r\nimpropriedade absoluta do objeto. Se a ineficácia ou impropriedade for apenas relativa, pode haver tentativa punível.BASE COMPLETA | DIREITO PENAL | PEN M3 Teoria do Crime - primeira leitura + revisão\r\nBase: PEN M3 auditado; arts. 13-19 conferidos no Código Penal compilado em 01/10/2026. 5\r\n2. Teoria - tipicidade, dolo, culpa e preterdolo\r\nTipo penal e tipicidade\r\nTipo penal é o modelo legal da conduta proibida ou mandada. Seus elementos podem ser: objetivos (dados descritivos),\r\nnormativos (exigem valoração) e subjetivos especiais (finalidade adicional prevista pelo tipo).\r\nTIPICIDADE FORMAL\r\nSubsunção: o fato concreto corresponde à descrição legal.\r\nTIPICIDADE MATERIAL\r\nRelevância da lesão ou perigo ao bem jurídico. A adequação\r\nliteral pode não ser suficiente.\r\nDolo - art. 18, I\r\nO agente quis o resultado ou assumiu o risco de produzi-lo. O dolo envolve conhecimento das circunstâncias relevantes e\r\nvontade/assunção do risco.\r\nModalidade Conteúdo\r\nDolo direto de 1º grau O resultado típico é finalidade diretamente visada.\r\nDolo direto de 2º grau O agente busca um fim e sabe que outro resultado típico é consequência necessária do meio\r\nescolhido.\r\nDolo eventual Prevê o resultado como possível e, mesmo assim, assume o risco de produzi-lo.\r\nCulpa - art. 18, II\r\nO resultado não é querido. Ele decorre de violação do dever objetivo de cuidado. A lei aponta três formas: imprudência\r\n(agir arriscadamente), negligência (deixar de adotar cautela) e imperícia (falha técnica evitável em atividade que exige\r\naptidão). A punição culposa depende de previsão legal expressa.\r\nCulpa inconsciente Culpa consciente\r\nNão prevê concretamente o resultado, embora ele fosse\r\nobjetivamente previsível dentro do dever de cuidado.\r\nPrevê concretamente o resultado, mas confia seriamente que ele\r\nnão ocorrerá.\r\nDOLO EVENTUAL X CULPA CONSCIENTE\r\nNos dois há previsão.\r\nDolo eventual: o agente assume o risco de produzir o resultado.\r\nCulpa consciente: o agente prevê, mas confia efetivamente na não ocorrência.\r\nNão resolva por uma palavra isolada: examine a atitude concreta diante do risco.\r\nPreterdolo - art. 19 como controle do resultado agravador\r\nFÓRMULA\r\nDOLO no antecedente + CULPA no resultado agravador = crime preterdoloso.\r\nO resultado mais grave não pode ser imputado objetivamente: o agente deve tê-lo causado ao menos culposamente.\r\nMapa comparativo final\r\nTema Chave de separação\r\nDolo direto x eventual Querer diretamente x assumir o risco.\r\nDolo eventual x culpa consciente Assunção do risco x confiança séria de que não ocorrerá.\r\nDolo x culpa x preterdolo Querer/assumir x violar dever de cuidado x dolo antecedente + culpa agravadora.\r\nCrime impossível x tentativa Impossibilidade absoluta x consumação possível, mas frustrada.\r\nDesistência x arrependimento eficaz Para antes de esgotar os atos x esgota e depois impede o resultado.BASE COMPLETA | DIREITO PENAL | PEN M3 Teoria do Crime - primeira leitura + revisão\r\nBase: PEN M3 auditado; arts. 13-19 conferidos no Código Penal compilado em 01/10/2026. 6\r\n3. Artigos para decorar\r\nArt. 13 Causalidade: causa é a ação ou omissão sem a qual o resultado não teria ocorrido. § 1º: causa superveniente\r\nrelativamente independente que, por si só, produz o resultado exclui a imputação do resultado final. § 2º:\r\nomissão relevante = devia + podia agir; garantidor por lei, assunção ou criação anterior do risco.\r\nArt. 14 Consumado: reúne todos os elementos da definição legal. Tentado: execução iniciada + não consumação por\r\ncircunstância alheia. Regra: redução de 1/3 a 2/3.\r\nArt. 15 Desistência voluntária + arrependimento eficaz: o agente só responde pelos atos já praticados.\r\nArt. 16 Arrependimento posterior: crime sem violência ou grave ameaça à pessoa + reparação/restituição + ato\r\nvoluntário + até o recebimento da denúncia/queixa = redução de 1/3 a 2/3.\r\nArt. 17 Crime impossível: ineficácia absoluta do meio ou impropriedade absoluta do objeto.\r\nArt. 18 Dolo: quis o resultado ou assumiu o risco. Culpa: imprudência, negligência ou imperícia. Salvo previsão\r\nexpressa, a punição é dolosa.\r\nArt. 19 Resultado agravador: só é imputado se o agente o causou ao menos culposamente.\r\n4. Pegadinhas de prova\r\n• Conceito material não substitui a legalidade: reprovação\r\nsocial, sozinha, não cria crime.\r\n• Finalismo: dolo e culpa saem da culpabilidade e passam ao\r\nfato típico.\r\n• Crime formal pode admitir tentativa; formal não é sinônimo\r\nde unissubsistente.\r\n• Crime próprio não é o mesmo que crime de mão própria.\r\n• Efeitos permanentes não transformam crime instantâneo\r\nem crime permanente.\r\n• Garantidor: dever moral não basta; exige fonte do art. 13, §\r\n2º e possibilidade concreta de agir.\r\n• Concausa superveniente relativa só rompe a imputação do\r\nresultado quando, por si só, o produz.\r\n• Atos preparatórios são em regra impuníveis como\r\ntentativa, mas podem constituir delito autônomo.\r\n• Tentativa: a não consumação decorre de circunstância\r\nalheia à vontade do agente.\r\n• Desistência voluntária exige voluntariedade, não\r\nespontaneidade absoluta.\r\n• Arrependimento eficaz precisa realmente impedir o\r\nresultado.\r\n• Arrependimento posterior ocorre depois da consumação e\r\nnão apaga o crime.\r\n• Crime impossível: só a ineficácia/impropriedade absoluta\r\nafasta a tentativa; a relativa pode gerar tentativa punível.\r\n• Dolo eventual x culpa consciente: ambos têm previsão do\r\nresultado; a diferença está na atitude diante do risco.\r\n• Preterdolo: não é dolo eventual no resultado mais grave; é\r\ndolo antecedente + culpa no resultado agravador.\r\n5. Revisão ativa\r\nFeche o PDF e tente responder em voz alta, em uma frase por item.\r\n1. Monte a estrutura tripartida do crime e diga qual é o foco\r\ndo fato típico.\r\n2. Qual foi a mudança central do finalismo quanto a dolo e\r\nculpa?\r\n3. Diferencie crime material, formal e de mera conduta.\r\n4. Quais são as três fontes da posição de garantidor do art.\r\n13, § 2º?\r\n5. Quando a causa superveniente relativamente\r\nindependente rompe a imputação do resultado?\r\n6. Recite o iter criminis na ordem correta.\r\n7. Explique a diferença entre tentativa, desistência voluntária\r\ne arrependimento eficaz a partir da pergunta: por que o\r\nresultado não ocorreu?\r\n8. Quais são os requisitos centrais do arrependimento\r\nposterior?\r\n9. Quais são as duas hipóteses do crime impossível?\r\n10. Diferencie dolo eventual de culpa consciente sem usar\r\napenas “aceitou” x “acreditou”.\r\n11. Quais são as três modalidades legais de culpa?\r\n12. Complete: preterdolo = ______ no antecedente + ______\r\nno resultado agravador.\r\nMemória final: art. 13 = causalidade/garantidor; 14 = consumação/tentativa; 15 =\r\ndesistência/arrependimento eficaz; 16 = arrependimento posterior; 17 = crime impossível; 18 =\r\ndolo/culpa; 19 = resultado agravador.","chapters":{"summary":[{"id":"s01","title":"Visão geral"},{"id":"s02","title":"Teoria - conduta, resultado, omissão e classificações"},{"id":"s03","title":"Teoria - causalidade, concausas e imputação objetiva"},{"id":"s04","title":"Teoria - iter criminis, tentativa e arrependimentos"},{"id":"s05","title":"Teoria - tipicidade, dolo, culpa e preterdolo"},{"id":"s06","title":"Artigos para decorar"},{"id":"s07","title":"Pegadinhas de prova"}],"complete":[{"id":"c01","title":"Conceitos formal, material e analítico de crime"},{"id":"c02","title":"Conceito analítico e estrutura tripartida"},{"id":"c03","title":"Estrutura do crime: ordem de análise"},{"id":"c04","title":"Fato típico: mapa operacional"},{"id":"c05","title":"Conduta: ação, omissão e voluntariedade"},{"id":"c06","title":"Causalismo, neokantismo, finalismo e funcionalismo"},{"id":"c07","title":"Resultado naturalístico, resultado jurídico e categorias de resultado"},{"id":"c08","title":"Crimes omissivos próprios e impróprios; garantidor"},{"id":"c09","title":"Classificações essenciais FCC"},{"id":"c10","title":"Classificações complementares de consulta"},{"id":"c11","title":"Relação de causalidade e art. 13 do Código Penal"},{"id":"c12","title":"Equivalência dos antecedentes e eliminação hipotética"},{"id":"c13","title":"Concausas absolutamente independentes"},{"id":"c14","title":"Concausas relativamente independentes e art. 13, §1º"},{"id":"c15","title":"Imputação objetiva e princípio da confiança"},{"id":"c16","title":"Iter criminis: visão geral"},{"id":"c17","title":"Cogitação e atos preparatórios"},{"id":"c18","title":"Atos executórios e teorias sobre o início da execução"},{"id":"c19","title":"Consumação × exaurimento"},{"id":"c20","title":"Tentativa: conceito, requisitos e pena"},{"id":"c21","title":"Espécies de tentativa"},{"id":"c22","title":"Infrações que não admitem tentativa"},{"id":"c23","title":"Tentativa em omissivos impróprios e tentativa com dolo eventual"},{"id":"c24","title":"Desistência voluntária e Fórmula de Frank"},{"id":"c25","title":"Arrependimento eficaz"},{"id":"c26","title":"Fluxo decisório: tentativa × desistência × arrependimentos"},{"id":"c27","title":"Arrependimento posterior — art. 16"},{"id":"c28","title":"Crime impossível, delito putativo e flagrante preparado"},{"id":"c29","title":"Tipo penal, funções do tipo e tipicidade"},{"id":"c30","title":"Tipicidade formal × material"},{"id":"c31","title":"Elementos objetivos, normativos e subjetivos do tipo"},{"id":"c32","title":"Dolo: elementos e espécies"},{"id":"c33","title":"Culpa: estrutura, modalidades e espécies"},{"id":"c34","title":"Dolo eventual × culpa consciente"},{"id":"c35","title":"Crime preterdoloso"},{"id":"c36","title":"Tipicidade conglobante, antinormatividade e elementos negativos do tipo"},{"id":"c37","title":"Quadros comparativos FCC — mapa-mestre"},{"id":"c38","title":"O que decorar"},{"id":"c39","title":"Pegadinhas de alta incidência"}]},"internalQuestions":{"summary":[{"id":"sq01","q":"Na estrutura analítica tripartida adotada no M03, crime é formado por:","options":["Fato típico + ilicitude + culpabilidade.","Conduta + resultado + pena.","Tipicidade + punibilidade + processo.","Dolo + culpa + resultado."],"answer":0,"explanation":"O resumo trabalha com a estrutura tripartida: fato típico, ilicitude e culpabilidade; o foco do M03 é o fato típico."},{"id":"sq02","q":"Qual foi a mudança central do finalismo quanto a dolo e culpa?","options":["Passaram a integrar exclusivamente a ilicitude.","Foram deslocados da culpabilidade para o fato típico.","Deixaram de ter relevância dogmática.","Passaram a existir apenas nos crimes materiais."],"answer":1,"explanation":"O material destaca que o finalismo desloca dolo e culpa da culpabilidade para o fato típico."},{"id":"sq03","q":"No art. 13, §2º, a posição de garantidor pode decorrer de:","options":["Somente de parentesco.","Lei, assunção de responsabilidade ou criação prévia do risco.","Apenas de contrato escrito.","Qualquer dever moral genérico."],"answer":1,"explanation":"As três fontes são obrigação legal de cuidado/proteção/vigilância, assunção da responsabilidade e comportamento anterior que criou o risco."},{"id":"sq04","q":"Crime impossível, segundo o art. 17, exige:","options":["Ineficácia relativa do meio ou objeto momentaneamente protegido.","Ausência de dolo em qualquer hipótese.","Ineficácia absoluta do meio ou impropriedade absoluta do objeto.","Interrupção voluntária da execução."],"answer":2,"explanation":"A tentativa não é punida quando a consumação é impossível por ineficácia absoluta do meio ou impropriedade absoluta do objeto."},{"id":"sq05","q":"A diferença essencial entre dolo eventual e culpa consciente está em que:","options":["No dolo eventual o resultado não é previsto.","Na culpa consciente o agente assume o risco.","No dolo eventual há assunção do risco; na culpa consciente há confiança de que o resultado não ocorrerá.","Na culpa consciente não existe violação do dever de cuidado."],"answer":2,"explanation":"Ambos podem envolver previsão concreta; divergem na atitude diante do risco: assunção versus confiança séria na não ocorrência."}],"complete":[{"id":"cq01","q":"Pelo processo hipotético de eliminação, uma conduta é causal quando:","options":["Sua supressão mental faria o resultado desaparecer ou se alterar relevantemente.","Ela for moralmente reprovável.","Houver sempre dolo direto.","O resultado ocorrer apenas muito tempo depois."],"answer":0,"explanation":"A eliminação hipotética testa a conditio sine qua non: suprime-se mentalmente a conduta e observa-se se o resultado mudaria."},{"id":"cq02","q":"A causa superveniente relativamente independente rompe a imputação do resultado final quando:","options":["For apenas cronologicamente posterior.","Por si só produzir o resultado.","For previsível pelo agente.","Ocorrer depois da denúncia."],"answer":1,"explanation":"O art. 13, §1º, exclui a imputação do resultado quando a causa superveniente relativamente independente, por si só, o produz."},{"id":"cq03","q":"Há tentativa quando:","options":["O agente apenas cogita o crime.","A execução começa e o crime não se consuma por circunstância alheia à vontade do agente.","O agente desiste voluntariamente podendo continuar.","O resultado já ocorreu integralmente."],"answer":1,"explanation":"O art. 14, II, exige início de execução, não consumação e circunstância alheia à vontade do agente."},{"id":"cq04","q":"Pela Fórmula de Frank, qual situação caracteriza desistência voluntária?","options":["Quero prosseguir, mas não posso.","Posso prosseguir, mas não quero.","Terminei a execução e o resultado ocorreu.","Nunca iniciei a execução."],"answer":1,"explanation":"O material resume: quer e não pode = tentativa; pode e não quer = desistência voluntária."},{"id":"cq05","q":"No arrependimento eficaz, o agente:","options":["Ainda não iniciou atos executórios.","Já esgotou os atos executórios, mas impede efetivamente o resultado antes da consumação.","Repara o dano depois da consumação e sempre extingue o crime.","Só responde se houver grave ameaça."],"answer":1,"explanation":"No arrependimento eficaz, a execução já foi esgotada, mas o agente atua e efetivamente impede o resultado."},{"id":"cq06","q":"O arrependimento posterior do art. 16 exige, entre outros requisitos:","options":["Crime sem violência ou grave ameaça à pessoa e reparação/restituição até o recebimento da denúncia ou queixa.","Qualquer crime, inclusive com grave ameaça, desde que haja confissão.","Impedimento do resultado antes da consumação.","Ineficácia absoluta do meio."],"answer":0,"explanation":"O art. 16 pressupõe crime consumado sem violência ou grave ameaça à pessoa, reparação/restituição voluntária e tempestiva e redução de pena."},{"id":"cq07","q":"Sobre tentativa em crime formal, o material afirma que:","options":["Crime formal nunca admite tentativa.","Crime formal pode admitir tentativa se a execução for plurissubsistente e puder ser interrompida.","Crime formal é sempre unissubsistente.","Tentativa depende apenas da pena prevista."],"answer":1,"explanation":"O M03 alerta que 'crime formal não admite tentativa' é generalização falsa; a estrutura executória é que importa."},{"id":"cq08","q":"A teoria objetiva temperada do crime impossível significa que:","options":["Qualquer inadequação do meio afasta a tentativa.","Somente a inidoneidade absoluta do meio ou do objeto afasta a tentativa punível.","A intenção do agente basta para punir sempre.","O objeto relativamente impróprio sempre gera crime impossível."],"answer":1,"explanation":"A opção do art. 17 exige impossibilidade absoluta; ineficácia ou impropriedade apenas relativa pode manter a tentativa punível."},{"id":"cq09","q":"Quais são as modalidades legais de culpa destacadas no M03?","options":["Erro, coação e caso fortuito.","Imprudência, negligência e imperícia.","Dolo direto, eventual e alternativo.","Previsão, aceitação e resultado."],"answer":1,"explanation":"O art. 18, II, e o material trabalham com imprudência, negligência e imperícia."},{"id":"cq10","q":"Preterdolo é a combinação de:","options":["Culpa no antecedente + dolo no resultado agravador.","Dolo no antecedente + culpa no resultado agravador.","Dolo eventual + culpa consciente no mesmo resultado.","Ausência de dolo e de culpa."],"answer":1,"explanation":"O crime preterdoloso combina dolo no fato antecedente e culpa no resultado mais grave, conforme a lógica do art. 19."}]}};
})(window);

(function(global){
'use strict';

const OVERLAY_ID='bcNativeReaderOverlayM03';
const M1_SELECTOR='#subjects .subject[data-id="penal"] .cf-module[data-cf="p3"]';
const STORAGE_PREFIX='central-v6:native-reader:penal:p3';
let current=null;
let observer=null;

function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function norm(s){return String(s||'').replace(/\u00a0/g,' ').replace(/[ \t]+/g,' ').trim()}
function normKey(s){return norm(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
function slug(s){return normKey(s).replace(/\s+/g,'-').slice(0,70)}
function source(){return global.BASE_NATIVE_CONTENT?.penal?.m03||null}
function storageKey(part){return STORAGE_PREFIX+':'+part}

function cleanLines(raw,mode){
  const lines=String(raw||'').replace(/\r/g,'').split('\n').map(norm);
  const out=[];
  let skipOldSummaryReview=false;
  for(let line of lines){
    if(mode==='summary' && /^5\.\s*REVIS(?:A|Ã)O ATIVA/i.test(line)){skipOldSummaryReview=true;continue}
    if(skipOldSummaryReview && /^ESQUELETO DE MEM(?:O|Ó)RIA/i.test(line)){skipOldSummaryReview=false;continue}
    if(skipOldSummaryReview)continue;
    if(!line){out.push('');continue}
    if(/^BASE COMPLETA(?:\s*[|•-]|$)/i.test(line))continue;
    if(/^D\s*IRE\s*ITO PENAL\s*•\s*M0?1$/i.test(line))continue;
    if(/^\d+\s*\/\s*\d+$/.test(line))continue;
    if(/^P[aá]gina\s+\d+$/i.test(line))continue;
    if(/^Conteudo restrito ao PEN M1/i.test(line))continue;
    out.push(line);
  }
  return out;
}
function headingInfo(line){
  const l=norm(line);
  if(!l)return null;
  let m=l.match(/^(\d+)\.(\d+)\s+(.{3,140})$/);
  if(m)return {level:3,text:l};
  m=l.match(/^(\d+)\.?\s+(.{3,140})$/);
  if(m && !/^\d+\s*\/\s*\d+/.test(l) && !/^\d+\s+(Quais|Qual|A |O |Como |Quando |Pequeno|Pessoalidade|Na )/i.test(l)){
    return {level:2,text:l};
  }
  if(/^(VISÃO GERAL|VISAO GERAL|REVISÃO ATIVA|REVISAO ATIVA|ARTIGOS PARA DECORAR|PEGADINHAS DE PROVA|MAPA DO MÓDULO|MAPA DO MODULO|TEORIA ESSENCIAL)$/i.test(l)){
    return {level:2,text:l};
  }
  return null;
}
function calloutType(line){
  const l=norm(line).toUpperCase();
  if(/^(✅\s*)?EXEMPLO/.test(l))return ['example','Exemplo'];
  if(/PEGADINHA/.test(l))return ['trap','Pegadinha'];
  if(/^(⚖️\s*)?LEI SECA/.test(l))return ['law','Lei seca'];
  if(/^(DECORE|MEMÓRIA|MEMORIA|MNEMÔNICO|MNEMONICO|REGRA DE OURO|IDEIA-CENTRAL|IDEIA CENTRAL|FÓRMULA|FORMULA|MEMORIZACAO RAPIDA)/.test(l))return ['memory',norm(line)];
  if(/^(STF|STJ|JURISPRUDÊNCIA|JURISPRUDENCIA|ATUALIZAÇÃO|ATUALIZACAO)/.test(l))return ['case',norm(line)];
  if(/^(COMPARAÇÃO|COMPARACAO|ATENÇÃO|ATENCAO|PROVA|CUIDADO|FRONTEIRA DO MÓDULO|FRONTEIRA DO MODULO)/.test(l))return ['case',norm(line)];
  return null;
}
function isBullet(line){return /^[•●▪◦*-]\s+/.test(line)}
function looksTitle(line){
  const l=norm(line);
  if(l.length<3||l.length>105)return false;
  if(/[.!?]$/.test(l))return false;
  if(/^[A-ZÁÉÍÓÚÂÊÔÃÕÇ0-9][A-ZÁÉÍÓÚÂÊÔÃÕÇ0-9\s:–—()/%ºª,.-]+$/.test(l)&&l.split(/\s+/).length<=12)return true;
  return false;
}
function parse(raw,mode){
  const lines=cleanLines(raw,mode);
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
        if(!next){if(body.length)break;else continue}
        if(headingInfo(next)||calloutType(next)||looksTitle(next))break;
        body.push(next);i=j;
      }
      blocks.push({type:'callout',kind:co[0],label:co[1],text:body.join(' ')});
      continue;
    }
    if(isBullet(line)){
      flush();
      const items=[line.replace(/^[•●▪◦*-]\s+/,'')];
      while(i+1<lines.length&&isBullet(lines[i+1]))items.push(lines[++i].replace(/^[•●▪◦*-]\s+/,''));
      blocks.push({type:'ul',items});
      continue;
    }
    if(looksTitle(line)&&mode==='summary'){flush();blocks.push({type:'h',level:3,text:line});continue}
    para.push(line);
  }
  flush();
  const firstH=blocks.findIndex(b=>b.type==='h');
  if(firstH>2){
    const lead=blocks.slice(0,firstH).filter(b=>b.type==='p').map(b=>b.text).join(' ');
    blocks.splice(0,firstH,{type:'lead',text:lead});
  }
  return blocks;
}
function buildHtml(data,mode){
  if(mode==='complete'){
    const host=document.createElement('div');
    host.innerHTML=global.PENAL_FULL_THEORY?.p3?.html||'';
    host.querySelector('.pen-m3-cover')?.remove();
    host.querySelector('.pen-m3-toc')?.remove();
    host.querySelector('.pen-m3-orientacao')?.remove();
    host.querySelector('#pen-m3-s25')?.remove();

    const headings=[];
    host.querySelectorAll('article.pen-m3-session').forEach((section,index)=>{
      const h=section.querySelector('h3');
      if(!h)return;
      if(!h.id)h.id='bcsec-complete-'+(index+1)+'-'+slug(h.textContent);
      headings.push({id:h.id,text:norm(h.textContent),level:2,key:normKey(h.textContent)});
    });

    // Normalize native M2 blocks to the reader's component vocabulary.
    host.querySelectorAll('.pen-m3-callout').forEach(el=>el.classList.add('bc-native-callout'));
    host.querySelectorAll('.pen-m3-table-wrap').forEach(el=>el.classList.add('bc-native-table-wrap'));
    const text=norm(host.textContent);
    const words=text.split(/\s+/).filter(Boolean).length;
    const mins=Math.max(1,Math.round(words/190));
    return {body:host.innerHTML,headings,words,mins};
  }

  const raw=mode==='summary'?data.summary:data.complete;
  const blocks=parse(raw,mode);
  const headings=[];
  let hCount=0;
  const body=blocks.map(b=>{
    if(b.type==='h'){
      const id='bcsec-'+(++hCount)+'-'+slug(b.text);
      headings.push({id,text:b.text,level:b.level,key:normKey(b.text)});
      return '<h'+b.level+' id="'+id+'">'+esc(b.text)+'</h'+b.level+'>';
    }
    if(b.type==='lead')return '<p class="lead">'+esc(b.text)+'</p>';
    if(b.type==='p')return '<p>'+esc(b.text)+'</p>';
    if(b.type==='ul')return '<ul>'+b.items.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>';
    if(b.type==='callout')return '<aside class="bc-native-callout '+b.kind+'"><b>'+esc(b.label)+'</b><div>'+esc(b.text)+'</div></aside>';
    return '';
  }).join('');
  const words=norm(raw).split(/\s+/).filter(Boolean).length;
  const mins=Math.max(1,Math.round(words/(mode==='summary'?220:190)));
  return {body,headings,words,mins};
}
function modeChapters(data,mode){return Array.isArray(data?.chapters?.[mode])?data.chapters[mode]:[]}
function modeQuestions(data,mode){return Array.isArray(data?.internalQuestions?.[mode])?data.internalQuestions[mode]:[]}
function chapterDone(mode,id){return localStorage.getItem(storageKey('chapter:'+mode+':'+id))==='1'}
function setChapterDone(mode,id,done){
  localStorage.setItem(storageKey('chapter:'+mode+':'+id),done?'1':'0');
}
function internalAnswer(mode,id){
  try{return JSON.parse(localStorage.getItem(storageKey('internal:'+mode+':'+id))||'null')}catch(_){return null}
}
function saveInternalAnswer(mode,q,selected){
  const prev=internalAnswer(mode,q.id)||{attempts:0};
  const state={
    selected:Number(selected),
    correct:Number(selected)===Number(q.answer),
    attempts:(prev.attempts||0)+1,
    updatedAt:new Date().toISOString()
  };
  localStorage.setItem(storageKey('internal:'+mode+':'+q.id),JSON.stringify(state));
  return state;
}
function resetInternalAnswer(mode,id){localStorage.removeItem(storageKey('internal:'+mode+':'+id))}

function modeStudyStats(data,mode){
  const chapters=modeChapters(data,mode);
  const questions=modeQuestions(data,mode);
  const chapterDoneCount=chapters.filter(ch=>chapterDone(mode,ch.id)).length;
  const answered=questions.filter(q=>!!internalAnswer(mode,q.id)).length;
  const correct=questions.filter(q=>internalAnswer(mode,q.id)?.correct).length;
  return {
    chapterDone:chapterDoneCount,
    chapterTotal:chapters.length,
    answered,
    questionTotal:questions.length,
    correct,
    done:chapterDoneCount+answered,
    total:chapters.length+questions.length
  };
}
function theoryStats(){
  const data=source();
  if(!data)return {done:0,total:0,pct:0};
  const s=modeStudyStats(data,'summary');
  const c=modeStudyStats(data,'complete');
  const done=s.done+c.done,total=s.total+c.total;
  return {done,total,pct:total?Math.round(done/total*100):0,summary:s,complete:c};
}
function externalStats(){
  try{
    const rows=JSON.parse(localStorage.getItem('central-v6:module-rounds:penal:p3')||'[]');
    const valid=(Array.isArray(rows)?rows:[]).map(r=>({
      done:Math.max(0,Number(r.valid ?? r.done)||0),
      correct:Math.max(0,Number(r.correct)||0)
    })).filter(r=>r.done>0);
    const answered=valid.reduce((n,r)=>n+r.done,0);
    const correct=valid.reduce((n,r)=>n+Math.min(r.correct,r.done),0);
    return {answered,correct,rounds:valid.length,accuracy:answered?Math.round(correct/answered*100):null};
  }catch(_){
    return {answered:0,correct:0,rounds:0,accuracy:null};
  }
}
function setRing(el,pct,label){
  if(!el)return;
  const safe=Math.max(0,Math.min(100,Number(pct)||0));
  el.style.setProperty('--pct',String(safe));
  const value=el.querySelector('[data-ring-value]');
  if(value)value.textContent=label??(safe+'%');
}
function refreshModuleMetrics(){
  const module=document.querySelector(M1_SELECTOR);
  if(!module)return;
  const theory=theoryStats(),external=externalStats();

  setRing(module.querySelector('[data-native-ring="theory"]'),theory.pct,theory.pct+'%');
  const theoryDetail=module.querySelector('[data-native-metric-detail="theory"]');
  if(theoryDetail)theoryDetail.textContent=theory.done+' de '+theory.total+' pontos concluídos';

  setRing(module.querySelector('[data-native-ring="external"]'),external.accuracy??0,external.accuracy==null?'—':external.accuracy+'%');
  const extDetail=module.querySelector('[data-native-metric-detail="external"]');
  if(extDetail){
    extDetail.textContent=external.answered
      ? external.correct+' acertos em '+external.answered+' questões externas'
      : 'Nenhuma questão externa respondida';
  }
  const extMeta=module.querySelector('[data-native-metric-meta="external"]');
  if(extMeta)extMeta.textContent=external.answered
    ? external.rounds+' rodada(s) registrada(s) no final do módulo'
    : 'Registre questões externas no final do módulo';

  const headerStat=module.querySelector('.cf-module-stat');
  if(headerStat)headerStat.textContent='Cobertura '+theory.pct+'% • teoria + revisão interna';
  const legacyBar=module.querySelector('.cf-module-bar span');
  if(legacyBar)legacyBar.style.width=theory.pct+'%';
  refreshCardState();
}
function refreshCardState(){
  const data=source();if(!data)return;
  ['summary','complete'].forEach(kind=>{
    const st=modeStudyStats(data,kind);
    document.querySelectorAll(M1_SELECTOR+' [data-native-kind="'+kind+'"]').forEach(card=>{
      const tag=card.querySelector('.bc-native-material-action span:first-child');
      if(tag)tag.textContent=st.done===st.total&&st.total?'✓ Concluído':st.chapterDone+'/'+st.chapterTotal+' capítulos';
    });
  });
}

function close(){
  document.getElementById(OVERLAY_ID)?.remove();
  document.body.style.overflow='';
  current=null;
}
function buildChapterMap(){
  if(!current)return [];
  return modeChapters(source(),current.mode).map(ch=>({chapter:ch,heading:findHeadingForChapter(ch)})).filter(x=>x.heading);
}
function autoMarkViewedChapters(){
  if(!current||!current.chapterMap?.length)return;
  const sc=current.scroll;
  const viewportBottom=sc.scrollTop+sc.clientHeight;
  let changed=false;
  current.chapterMap.forEach((item,index)=>{
    if(chapterDone(current.mode,item.chapter.id))return;
    const start=item.heading.offsetTop;
    const next=current.chapterMap[index+1]?.heading?.offsetTop ?? current.article.scrollHeight;
    const target=start+Math.max(80,(next-start)*0.72);
    if(viewportBottom>=target){
      setChapterDone(current.mode,item.chapter.id,true);
      changed=true;
    }
  });
  if(changed)refreshReaderStudyUI();
}
function updateScrollProgress(){
  if(!current)return;
  const sc=current.scroll;
  const max=Math.max(1,sc.scrollHeight-sc.clientHeight);
  const pct=Math.max(0,Math.min(100,sc.scrollTop/max*100));
  const bar=current.overlay.querySelector('.bc-native-reader-progress');
  if(bar)bar.style.width=pct+'%';
  localStorage.setItem(storageKey(current.mode+':scroll'),String(sc.scrollTop));
  autoMarkViewedChapters();
}
function restoreScroll(){
  if(!current)return;
  const v=Number(localStorage.getItem(storageKey(current.mode+':scroll'))||0);
  if(v>0)current.scroll.scrollTop=v;
}
function setFont(delta){
  if(!current)return;
  current.font=Math.max(14,Math.min(21,current.font+delta));
  current.article.style.fontSize=current.font+'px';
  localStorage.setItem(storageKey('font'),String(current.font));
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
      frag.append(raw.slice(pos,idx));
      const mk=document.createElement('mark');mk.className='bc-native-search-hit';mk.textContent=raw.slice(idx,idx+term.length);frag.append(mk);
      n++;pos=idx+term.length;
    }
    frag.append(raw.slice(pos));node.replaceWith(frag);
  }
  root.querySelector('mark.bc-native-search-hit')?.scrollIntoView({block:'center'});
  return n;
}
function findHeadingForChapter(chapter){
  if(!current)return null;
  const target=normKey(chapter.title).replace(/^\d+\s+/,'');
  const words=target.split(' ').filter(w=>w.length>3);
  const headings=Array.from(current.article.querySelectorAll('h2,h3'));
  let best=null,bestScore=0;
  for(const h of headings){
    const hk=normKey(h.textContent);
    let score=0;
    words.forEach(w=>{if(hk.includes(w))score++});
    if(score>bestScore){bestScore=score;best=h}
  }
  return bestScore>=Math.max(1,Math.min(2,words.length))?best:null;
}
function refreshReaderStudyUI(){
  if(!current)return;
  const data=source(),st=modeStudyStats(data,current.mode);
  const value=current.overlay.querySelector('[data-reader-study-value]');
  const bar=current.overlay.querySelector('[data-reader-study-bar]');
  const qscore=current.overlay.querySelector('[data-reader-internal-score]');
  if(value)value.textContent=st.done+' / '+st.total+' pontos';
  if(bar)bar.style.width=(st.total?Math.round(st.done/st.total*100):0)+'%';
  if(qscore)qscore.textContent=st.answered
    ? st.correct+' acertos em '+st.answered+' respondidas'
    : 'Nenhuma questão interna respondida';

  current.overlay.querySelectorAll('[data-chapter-check]').forEach(btn=>{
    const done=chapterDone(current.mode,btn.dataset.chapterCheck);
    btn.classList.toggle('done',done);
    btn.setAttribute('aria-pressed',String(done));
    btn.textContent=done?'✓':'';
  });
  refreshModuleMetrics();
}
function chapterTocHtml(data,mode){
  return modeChapters(data,mode).map((ch,i)=>{
    const done=chapterDone(mode,ch.id);
    return '<div class="bc-native-toc-row">'+
      '<button type="button" class="bc-native-chapter-check '+(done?'done':'')+'" data-chapter-check="'+esc(ch.id)+'" aria-pressed="'+done+'" title="Marcar capítulo">'+(done?'✓':'')+'</button>'+
      '<button type="button" class="bc-native-chapter-jump" data-chapter-jump="'+esc(ch.id)+'"><span>'+(i+1)+'.</span>'+esc(ch.title)+'</button>'+
    '</div>';
  }).join('');
}
function quizHtml(data,mode){
  const qs=modeQuestions(data,mode);
  if(!qs.length)return '';
  const cards=qs.map((q,i)=>{
    const a=internalAnswer(mode,q.id);
    const options=q.options.map((op,idx)=>{
      let cls='';
      if(a){
        if(idx===q.answer)cls+=' correct';
        if(idx===a.selected&&idx!==q.answer)cls+=' wrong';
      }
      return '<button type="button" class="bc-native-quiz-option'+cls+'" data-internal-q="'+esc(q.id)+'" data-option="'+idx+'" '+(a?'disabled':'')+'><span>'+String.fromCharCode(65+idx)+'</span>'+esc(op)+'</button>';
    }).join('');
    return '<article class="bc-native-quiz-card" data-quiz-card="'+esc(q.id)+'">'+
      '<div class="bc-native-quiz-number">Questão '+(i+1)+' de '+qs.length+'</div>'+
      '<h3>'+esc(q.q)+'</h3>'+
      '<div class="bc-native-quiz-options">'+options+'</div>'+
      '<div class="bc-native-quiz-feedback '+(a?(a.correct?'ok':'bad'):'')+'" data-quiz-feedback>'+
        (a?'<b>'+(a.correct?'✓ Correto':'✕ Incorreto')+'</b><span>'+esc(q.explanation)+'</span><button type="button" data-internal-retry="'+esc(q.id)+'">Refazer</button>':'<span>Escolha uma alternativa para receber o feedback.</span>')+
      '</div>'+
    '</article>';
  }).join('');
  return '<section class="bc-native-internal-review">'+
    '<div class="bc-native-internal-review-head"><div><span class="bc-native-kicker">REVISÃO ATIVA INTERNA</span><h2>'+qs.length+' questões de assimilação</h2><p>Estas questões contam na <b>cobertura da teoria</b>. Elas não entram no gráfico de questões externas.</p></div><div class="bc-native-internal-score" data-reader-internal-score></div></div>'+
    cards+
  '</section>';
}
function bindQuiz(){
  if(!current)return;
  const data=source();
  current.overlay.querySelectorAll('[data-internal-q]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const q=modeQuestions(data,current.mode).find(x=>x.id===btn.dataset.internalQ);
      if(!q)return;
      saveInternalAnswer(current.mode,q,Number(btn.dataset.option));
      rerenderQuizCard(q.id);
      refreshReaderStudyUI();
    });
  });
  current.overlay.querySelectorAll('[data-internal-retry]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      resetInternalAnswer(current.mode,btn.dataset.internalRetry);
      rerenderQuizCard(btn.dataset.internalRetry);
      refreshReaderStudyUI();
    });
  });
}
function rerenderQuizCard(id){
  if(!current)return;
  const data=source(),q=modeQuestions(data,current.mode).find(x=>x.id===id);
  const old=current.overlay.querySelector('[data-quiz-card="'+CSS.escape(id)+'"]');
  if(!q||!old)return;
  const i=modeQuestions(data,current.mode).findIndex(x=>x.id===id);
  const a=internalAnswer(current.mode,id);
  const options=q.options.map((op,idx)=>{
    let cls='';
    if(a){
      if(idx===q.answer)cls+=' correct';
      if(idx===a.selected&&idx!==q.answer)cls+=' wrong';
    }
    return '<button type="button" class="bc-native-quiz-option'+cls+'" data-internal-q="'+esc(q.id)+'" data-option="'+idx+'" '+(a?'disabled':'')+'><span>'+String.fromCharCode(65+idx)+'</span>'+esc(op)+'</button>';
  }).join('');
  old.innerHTML='<div class="bc-native-quiz-number">Questão '+(i+1)+' de '+modeQuestions(data,current.mode).length+'</div>'+
    '<h3>'+esc(q.q)+'</h3><div class="bc-native-quiz-options">'+options+'</div>'+
    '<div class="bc-native-quiz-feedback '+(a?(a.correct?'ok':'bad'):'')+'" data-quiz-feedback>'+
      (a?'<b>'+(a.correct?'✓ Correto':'✕ Incorreto')+'</b><span>'+esc(q.explanation)+'</span><button type="button" data-internal-retry="'+esc(q.id)+'">Refazer</button>':'<span>Escolha uma alternativa para receber o feedback.</span>')+
    '</div>';
  bindQuiz();
}
function open(mode){
  const data=source();if(!data){alert('Conteúdo nativo do M01 ainda não foi carregado.');return}
  close();
  const parsed=buildHtml(data,mode);
  const label=mode==='summary'?'Conteúdo resumido':'Conteúdo completo';
  const chapters=modeChapters(data,mode),questions=modeQuestions(data,mode);
  const ov=document.createElement('div');
  ov.id=OVERLAY_ID;ov.className='bc-native-reader-overlay';
  ov.innerHTML='<section class="bc-native-reader" role="dialog" aria-modal="true" aria-label="'+esc(label)+'">'+
    '<header class="bc-native-reader-head"><div class="bc-native-reader-title"><b>PEN M03 — '+esc(data.title)+'</b><small>'+label+' • experiência nativa da Base Completa</small></div><span class="bc-native-reader-meta">'+parsed.words.toLocaleString('pt-BR')+' palavras • ~'+parsed.mins+' min</span><button class="bc-native-reader-close" data-native-action="close" aria-label="Fechar">×</button><div class="bc-native-reader-progress-track"><div class="bc-native-reader-progress"></div></div></header>'+
    '<div class="bc-native-reader-tools"><input type="search" placeholder="Buscar neste material…" aria-label="Buscar"><button data-native-action="smaller">A−</button><button data-native-action="larger">A+</button><button class="primary" data-native-action="top">Ir ao topo</button></div>'+
    '<div class="bc-native-reader-body">'+
      '<nav class="bc-native-toc"><div class="bc-native-toc-label">Capítulos para concluir</div>'+chapterTocHtml(data,mode)+'</nav>'+
      '<main class="bc-native-scroll"><article class="bc-native-article">'+
        '<div class="bc-native-kicker">'+(mode==='summary'?'PRIMEIRA LEITURA + REVISÃO':'TEORIA INTEGRAL')+'</div>'+
        '<h1>'+esc(data.title)+'</h1>'+
        '<p class="lead">'+(mode==='summary'?'Versão condensada para compreender o módulo e revisar os pontos de maior rendimento.':'Conteúdo integral convertido para leitura nativa, sem leitor de PDF.')+'</p>'+
        '<section class="bc-native-study-progress"><div><b>Progresso neste material</b><span data-reader-study-value>0 / '+(chapters.length+questions.length)+' pontos</span></div><div class="bc-native-study-progress-track"><span data-reader-study-bar></span></div><small>'+chapters.length+' capítulos + '+questions.length+' questões internas. Os capítulos recebem check automaticamente conforme você avança; as questões internas também entram na cobertura da teoria.</small></section>'+
        parsed.body+
        quizHtml(data,mode)+
      '</article></main>'+
    '</div></section>';
  document.body.appendChild(ov);document.body.style.overflow='hidden';

  current={
    mode,overlay:ov,scroll:ov.querySelector('.bc-native-scroll'),article:ov.querySelector('.bc-native-article'),
    font:Number(localStorage.getItem(storageKey('font'))||16),chapterMap:[]
  };
  current.article.style.fontSize=current.font+'px';
  current.scroll.addEventListener('scroll',updateScrollProgress,{passive:true});
  ov.querySelector('[data-native-action="close"]').onclick=close;
  ov.querySelector('[data-native-action="smaller"]').onclick=()=>setFont(-1);
  ov.querySelector('[data-native-action="larger"]').onclick=()=>setFont(1);
  ov.querySelector('[data-native-action="top"]').onclick=()=>current.scroll.scrollTo({top:0,behavior:'smooth'});
  ov.querySelector('.bc-native-reader-tools input').addEventListener('input',e=>search(e.target.value));

  ov.querySelectorAll('[data-chapter-check]').forEach(btn=>{
    btn.onclick=()=>{
      const id=btn.dataset.chapterCheck;
      setChapterDone(mode,id,!chapterDone(mode,id));
      refreshReaderStudyUI();
    };
  });
  ov.querySelectorAll('[data-chapter-jump]').forEach(btn=>{
    btn.onclick=()=>{
      const ch=modeChapters(data,mode).find(x=>x.id===btn.dataset.chapterJump);
      findHeadingForChapter(ch)?.scrollIntoView({behavior:'smooth',block:'start'});
    };
  });

  bindQuiz();
  ov.addEventListener('click',e=>{if(e.target===ov)close()});
  requestAnimationFrame(()=>{
    current.chapterMap=buildChapterMap();
    restoreScroll();updateScrollProgress();refreshReaderStudyUI();autoMarkViewedChapters();
  });
}
function openMap(){
  if(global.BaseMindMap?.open)global.BaseMindMap.open('penal','p3');
  else alert('O mapa mental interativo ainda está carregando. Tente novamente em alguns segundos.');
}
function removeLegacyM01Content(){
  const module=document.querySelector(M1_SELECTOR);
  if(!module)return;
  module.querySelectorAll('.bc-session-nav,.bc-session-pager').forEach(el=>el.remove());
}
function inject(){
  const module=document.querySelector(M1_SELECTOR);if(!module)return;
  removeLegacyM01Content();
  const body=module.querySelector('.cf-module-body');if(!body)return;

  // Fallback: a renderização principal já entrega os cards diretamente.
  if(!body.querySelector('.bc-native-materials')){
    const host=document.createElement('section');host.className='bc-native-materials';
    host.innerHTML='<div class="bc-native-materials-head"><div><b>Materiais do módulo</b><small>Escolha como estudar</small></div><small>Piloto M03 • conteúdo nativo</small></div>'+
      '<div class="bc-native-material-grid">'+
        '<button class="bc-native-material-card" data-native-kind="summary"><span class="bc-native-material-icon">⚡</span><span><strong>Conteúdo resumido</strong><small>Primeira leitura, revisão rápida, artigos, pegadinhas e revisão ativa.</small></span><span class="bc-native-material-action"><span>Abrir</span><span>→</span></span></button>'+
        '<button class="bc-native-material-card" data-native-kind="complete"><span class="bc-native-material-icon">📚</span><span><strong>Conteúdo completo</strong><small>Teoria integral do M03 em formato de site, com índice, busca e progresso de leitura.</small></span><span class="bc-native-material-action"><span>Abrir</span><span>→</span></span></button>'+
        '<button class="bc-native-material-card" data-native-kind="mindmap"><span class="bc-native-material-icon">🧠</span><span><strong>Mapa mental</strong><small>Mapa interativo com abrir/recolher ramos, zoom, arrastar e tela cheia.</small></span><span class="bc-native-material-action"><span>Abrir</span><span>→</span></span></button>'+
      '</div>';
    host.querySelector('[data-native-kind="summary"]').onclick=()=>open('summary');
    host.querySelector('[data-native-kind="complete"]').onclick=()=>open('complete');
    host.querySelector('[data-native-kind="mindmap"]').onclick=openMap;
    const subtitle=body.querySelector('.cf-subtitle');
    if(subtitle)subtitle.insertAdjacentElement('afterend',host);else body.insertAdjacentElement('afterbegin',host);
  }
  refreshModuleMetrics();
}
function install(){
  inject();
  observer=new MutationObserver(()=>{
    clearTimeout(install._t);
    install._t=setTimeout(()=>{removeLegacyM01Content();inject();refreshModuleMetrics()},60);
  });
  observer.observe(document.documentElement,{subtree:true,childList:true});
  global.addEventListener('focus',refreshModuleMetrics);
}
global.BaseNativeReaderM03={
  open,close,refreshMetrics:refreshModuleMetrics,theoryStats,externalStats,
  version:'2026.10.02-m03-pilot1'
};
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.getElementById(OVERLAY_ID))close()});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})(window);
(function(global){
'use strict';
const SEL='#subjects .subject[data-id="penal"] .cf-module[data-cf="p3"]';

function inject(){
  const module=document.querySelector(SEL);
  if(!module) return;
  const body=module.querySelector('.cf-module-body');
  if(!body || body.querySelector('[data-bc-native-m03]')) return;

  const host=document.createElement('section');
  host.className='bc-native-materials bc-native-materials-static';
  host.setAttribute('data-bc-native-m03','');
  host.innerHTML=
    '<section class="bc-native-metrics" aria-label="Indicadores do módulo">'+
      '<article class="bc-native-metric-card">'+
        '<div class="bc-native-ring" data-native-ring="theory"><div class="bc-native-ring-inner"><b data-ring-value>0%</b><span>teoria</span></div></div>'+
        '<div class="bc-native-metric-copy"><small>COBERTURA DA TEORIA</small><strong data-native-metric-detail="theory">0 de 61 pontos concluídos</strong><span>Checks dos capítulos + questões internas.</span></div>'+
      '</article>'+
      '<article class="bc-native-metric-card">'+
        '<div class="bc-native-ring" data-native-ring="external"><div class="bc-native-ring-inner"><b data-ring-value>—</b><span>externas</span></div></div>'+
        '<div class="bc-native-metric-copy"><small>ACERTO EM QUESTÕES EXTERNAS</small><strong data-native-metric-detail="external">Nenhuma questão externa respondida</strong><span data-native-metric-meta="external">Registre questões externas no final do módulo</span></div>'+
      '</article>'+
    '</section>'+
    '<div class="bc-native-materials-head"><div><b>Materiais do módulo</b><small>Escolha como estudar</small></div><small>M03 • conteúdo nativo</small></div>'+
    '<div class="bc-native-material-grid">'+
      '<button type="button" class="bc-native-material-card" data-native-kind="summary"><span class="bc-native-material-icon">⚡</span><span><strong>Conteúdo resumido</strong><small>Primeira leitura, revisão rápida, artigos, pegadinhas e revisão ativa.</small></span><span class="bc-native-material-action"><span>Abrir</span><span>→</span></span></button>'+
      '<button type="button" class="bc-native-material-card" data-native-kind="complete"><span class="bc-native-material-icon">📚</span><span><strong>Conteúdo completo</strong><small>Teoria integral do M03 em formato de site, com índice, busca e progresso de leitura.</small></span><span class="bc-native-material-action"><span>Abrir</span><span>→</span></span></button>'+
      '<button type="button" class="bc-native-material-card" data-native-kind="mindmap"><span class="bc-native-material-icon">🧠</span><span><strong>Mapa mental</strong><small>Mapa interativo com abrir/recolher ramos, zoom, arrastar e tela cheia.</small></span><span class="bc-native-material-action"><span>Abrir</span><span>→</span></span></button>'+
    '</div>'+
    '<section class="bc-native-quick-summary" aria-label="Resumo do módulo">'+
      '<div class="bc-native-quick-summary-head"><span class="bc-native-quick-summary-no">3</span><div><b>Resumo do módulo</b><small>O M03 em poucas palavras.</small></div></div>'+
      '<div class="bc-native-quick-summary-body">Estrutura do crime e fato típico • conduta e omissão • causalidade e concausas • iter criminis e tentativa • tipicidade, dolo, culpa e preterdolo.</div>'+
    '</section>';

  host.querySelector('[data-native-kind="summary"]').onclick=function(){global.BaseNativeReaderM03?.open('summary')};
  host.querySelector('[data-native-kind="complete"]').onclick=function(){global.BaseNativeReaderM03?.open('complete')};
  host.querySelector('[data-native-kind="mindmap"]').onclick=function(){global.BaseMindMap?.open('penal','p3')};

  const subtitle=body.querySelector('.cf-subtitle');
  if(subtitle) subtitle.insertAdjacentElement('afterend',host);
  else body.insertAdjacentElement('afterbegin',host);
  global.BaseNativeReaderM03?.refreshMetrics?.();
}

function install(){
  inject();
  const obs=new MutationObserver(function(){
    clearTimeout(install._t);
    install._t=setTimeout(inject,60);
  });
  obs.observe(document.documentElement,{subtree:true,childList:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})(window);


/* M03 corrected reader override */
(function(global){
'use strict';

const OVERLAY_ID='bcNativeReaderOverlayM03';
const M1_SELECTOR='#subjects .subject[data-id="penal"] .cf-module[data-cf="p3"]';
const STORAGE_PREFIX='central-v6:native-reader:penal:p3';
let current=null;
let observer=null;

function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function norm(s){return String(s||'').replace(/\u00a0/g,' ').replace(/[ \t]+/g,' ').trim()}
function normKey(s){return norm(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
function slug(s){return normKey(s).replace(/\s+/g,'-').slice(0,70)}
function source(){return global.BASE_NATIVE_CONTENT?.penal?.m03||null}
function storageKey(part){return STORAGE_PREFIX+':'+part}

function cleanLines(raw,mode){
  const lines=String(raw||'').replace(/\r/g,'').split('\n').map(norm);
  const out=[];
  let skipOldSummaryReview=false;
  for(let line of lines){
    if(mode==='summary' && /^5\.\s*REVIS(?:A|Ã)O ATIVA/i.test(line)){skipOldSummaryReview=true;continue}
    if(skipOldSummaryReview && /^ESQUELETO DE MEM(?:O|Ó)RIA/i.test(line)){skipOldSummaryReview=false;continue}
    if(skipOldSummaryReview)continue;
    if(!line){out.push('');continue}
    if(/^BASE COMPLETA(?:\s*[|•-]|$)/i.test(line))continue;
    if(/^D\s*IRE\s*ITO PENAL\s*•\s*M0?1$/i.test(line))continue;
    if(/^\d+\s*\/\s*\d+$/.test(line))continue;
    if(/^P[aá]gina\s+\d+$/i.test(line))continue;
    if(/^Conteudo restrito ao PEN M1/i.test(line))continue;
    out.push(line);
  }
  return out;
}
function headingInfo(line){
  const l=norm(line);
  if(!l)return null;
  let m=l.match(/^(\d+)\.(\d+)\s+(.{3,140})$/);
  if(m)return {level:3,text:l};
  m=l.match(/^(\d+)\.?\s+(.{3,140})$/);
  if(m && !/^\d+\s*\/\s*\d+/.test(l) && !/^\d+\s+(Quais|Qual|A |O |Como |Quando |Pequeno|Pessoalidade|Na )/i.test(l)){
    return {level:2,text:l};
  }
  if(/^(VISÃO GERAL|VISAO GERAL|REVISÃO ATIVA|REVISAO ATIVA|ARTIGOS PARA DECORAR|PEGADINHAS DE PROVA|MAPA DO MÓDULO|MAPA DO MODULO|TEORIA ESSENCIAL)$/i.test(l)){
    return {level:2,text:l};
  }
  return null;
}
function calloutType(line){
  const l=norm(line).toUpperCase();
  if(/^(✅\s*)?EXEMPLO/.test(l))return ['example','Exemplo'];
  if(/PEGADINHA/.test(l))return ['trap','Pegadinha'];
  if(/^(⚖️\s*)?LEI SECA/.test(l))return ['law','Lei seca'];
  if(/^(DECORE|MEMÓRIA|MEMORIA|MNEMÔNICO|MNEMONICO|REGRA DE OURO|IDEIA-CENTRAL|IDEIA CENTRAL|FÓRMULA|FORMULA|MEMORIZACAO RAPIDA)/.test(l))return ['memory',norm(line)];
  if(/^(STF|STJ|JURISPRUDÊNCIA|JURISPRUDENCIA|ATUALIZAÇÃO|ATUALIZACAO)/.test(l))return ['case',norm(line)];
  if(/^(COMPARAÇÃO|COMPARACAO|ATENÇÃO|ATENCAO|PROVA|CUIDADO|FRONTEIRA DO MÓDULO|FRONTEIRA DO MODULO)/.test(l))return ['case',norm(line)];
  return null;
}
function isBullet(line){return /^[•●▪◦*-]\s+/.test(line)}
function looksTitle(line){
  const l=norm(line);
  if(l.length<3||l.length>105)return false;
  if(/[.!?]$/.test(l))return false;
  if(/^[A-ZÁÉÍÓÚÂÊÔÃÕÇ0-9][A-ZÁÉÍÓÚÂÊÔÃÕÇ0-9\s:–—()/%ºª,.-]+$/.test(l)&&l.split(/\s+/).length<=12)return true;
  return false;
}
function parse(raw,mode){
  const lines=cleanLines(raw,mode);
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
        if(!next){if(body.length)break;else continue}
        if(headingInfo(next)||calloutType(next)||looksTitle(next))break;
        body.push(next);i=j;
      }
      blocks.push({type:'callout',kind:co[0],label:co[1],text:body.join(' ')});
      continue;
    }
    if(isBullet(line)){
      flush();
      const items=[line.replace(/^[•●▪◦*-]\s+/,'')];
      while(i+1<lines.length&&isBullet(lines[i+1]))items.push(lines[++i].replace(/^[•●▪◦*-]\s+/,''));
      blocks.push({type:'ul',items});
      continue;
    }
    if(looksTitle(line)&&mode==='summary'){flush();blocks.push({type:'h',level:3,text:line});continue}
    para.push(line);
  }
  flush();
  const firstH=blocks.findIndex(b=>b.type==='h');
  if(firstH>2){
    const lead=blocks.slice(0,firstH).filter(b=>b.type==='p').map(b=>b.text).join(' ');
    blocks.splice(0,firstH,{type:'lead',text:lead});
  }
  return blocks;
}
function buildHtml(data,mode){
  if(mode==='complete'){
    const host=document.createElement('div');
    host.innerHTML=global.PENAL_FULL_THEORY?.p3?.html||'';
    host.querySelector('.pen-m3-cover')?.remove();
    host.querySelector('.pen-m3-toc')?.remove();
    host.querySelector('.pen-m3-orientacao')?.remove();
    host.querySelector('#pen-m3-s40')?.remove();

    const headings=[];
    host.querySelectorAll('section.pen-m3-session').forEach((section,index)=>{
      const h=section.querySelector('h3');
      if(!h)return;
      if(!h.id)h.id='bcsec-complete-'+(index+1)+'-'+slug(h.textContent);
      headings.push({id:h.id,text:norm(h.textContent),level:2,key:normKey(h.textContent)});
    });

    // Normalize native M3 blocks to the reader's component vocabulary.
    host.querySelectorAll('.pen-m3-callout').forEach(el=>el.classList.add('bc-native-callout'));
    host.querySelectorAll('.pen-m3-table').forEach(el=>el.classList.add('bc-native-table-wrap'));
    const text=norm(host.textContent);
    const words=text.split(/\s+/).filter(Boolean).length;
    const mins=Math.max(1,Math.round(words/190));
    return {body:host.innerHTML,headings,words,mins};
  }

  const raw=mode==='summary'?data.summary:data.complete;
  const blocks=parse(raw,mode);
  const headings=[];
  let hCount=0;
  const body=blocks.map(b=>{
    if(b.type==='h'){
      const id='bcsec-'+(++hCount)+'-'+slug(b.text);
      headings.push({id,text:b.text,level:b.level,key:normKey(b.text)});
      return '<h'+b.level+' id="'+id+'">'+esc(b.text)+'</h'+b.level+'>';
    }
    if(b.type==='lead')return '<p class="lead">'+esc(b.text)+'</p>';
    if(b.type==='p')return '<p>'+esc(b.text)+'</p>';
    if(b.type==='ul')return '<ul>'+b.items.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>';
    if(b.type==='callout')return '<aside class="bc-native-callout '+b.kind+'"><b>'+esc(b.label)+'</b><div>'+esc(b.text)+'</div></aside>';
    return '';
  }).join('');
  const words=norm(raw).split(/\s+/).filter(Boolean).length;
  const mins=Math.max(1,Math.round(words/(mode==='summary'?220:190)));
  return {body,headings,words,mins};
}
function modeChapters(data,mode){return Array.isArray(data?.chapters?.[mode])?data.chapters[mode]:[]}
function modeQuestions(data,mode){return Array.isArray(data?.internalQuestions?.[mode])?data.internalQuestions[mode]:[]}
function chapterDone(mode,id){return localStorage.getItem(storageKey('chapter:'+mode+':'+id))==='1'}
function setChapterDone(mode,id,done){
  localStorage.setItem(storageKey('chapter:'+mode+':'+id),done?'1':'0');
}
function internalAnswer(mode,id){
  try{return JSON.parse(localStorage.getItem(storageKey('internal:'+mode+':'+id))||'null')}catch(_){return null}
}
function saveInternalAnswer(mode,q,selected){
  const prev=internalAnswer(mode,q.id)||{attempts:0};
  const state={
    selected:Number(selected),
    correct:Number(selected)===Number(q.answer),
    attempts:(prev.attempts||0)+1,
    updatedAt:new Date().toISOString()
  };
  localStorage.setItem(storageKey('internal:'+mode+':'+q.id),JSON.stringify(state));
  return state;
}
function resetInternalAnswer(mode,id){localStorage.removeItem(storageKey('internal:'+mode+':'+id))}

function modeStudyStats(data,mode){
  const chapters=modeChapters(data,mode);
  const questions=modeQuestions(data,mode);
  const chapterDoneCount=chapters.filter(ch=>chapterDone(mode,ch.id)).length;
  const answered=questions.filter(q=>!!internalAnswer(mode,q.id)).length;
  const correct=questions.filter(q=>internalAnswer(mode,q.id)?.correct).length;
  return {
    chapterDone:chapterDoneCount,
    chapterTotal:chapters.length,
    answered,
    questionTotal:questions.length,
    correct,
    done:chapterDoneCount+answered,
    total:chapters.length+questions.length
  };
}
function theoryStats(){
  const data=source();
  if(!data)return {done:0,total:0,pct:0};
  const s=modeStudyStats(data,'summary');
  const c=modeStudyStats(data,'complete');
  const done=s.done+c.done,total=s.total+c.total;
  return {done,total,pct:total?Math.round(done/total*100):0,summary:s,complete:c};
}
function externalStats(){
  try{
    const rows=JSON.parse(localStorage.getItem('central-v6:module-rounds:penal:p3')||'[]');
    const valid=(Array.isArray(rows)?rows:[]).map(r=>({
      done:Math.max(0,Number(r.valid ?? r.done)||0),
      correct:Math.max(0,Number(r.correct)||0)
    })).filter(r=>r.done>0);
    const answered=valid.reduce((n,r)=>n+r.done,0);
    const correct=valid.reduce((n,r)=>n+Math.min(r.correct,r.done),0);
    return {answered,correct,rounds:valid.length,accuracy:answered?Math.round(correct/answered*100):null};
  }catch(_){
    return {answered:0,correct:0,rounds:0,accuracy:null};
  }
}
function setRing(el,pct,label){
  if(!el)return;
  const safe=Math.max(0,Math.min(100,Number(pct)||0));
  el.style.setProperty('--pct',String(safe));
  const value=el.querySelector('[data-ring-value]');
  if(value)value.textContent=label??(safe+'%');
}
function refreshModuleMetrics(){
  const module=document.querySelector(M1_SELECTOR);
  if(!module)return;
  const theory=theoryStats(),external=externalStats();

  setRing(module.querySelector('[data-native-ring="theory"]'),theory.pct,theory.pct+'%');
  const theoryDetail=module.querySelector('[data-native-metric-detail="theory"]');
  if(theoryDetail)theoryDetail.textContent=theory.done+' de '+theory.total+' pontos concluídos';

  setRing(module.querySelector('[data-native-ring="external"]'),external.accuracy??0,external.accuracy==null?'—':external.accuracy+'%');
  const extDetail=module.querySelector('[data-native-metric-detail="external"]');
  if(extDetail){
    extDetail.textContent=external.answered
      ? external.correct+' acertos em '+external.answered+' questões externas'
      : 'Nenhuma questão externa respondida';
  }
  const extMeta=module.querySelector('[data-native-metric-meta="external"]');
  if(extMeta)extMeta.textContent=external.answered
    ? external.rounds+' rodada(s) registrada(s) no final do módulo'
    : 'Registre questões externas no final do módulo';

  const headerStat=module.querySelector('.cf-module-stat');
  if(headerStat)headerStat.textContent='Cobertura '+theory.pct+'% • teoria + revisão interna';
  const legacyBar=module.querySelector('.cf-module-bar span');
  if(legacyBar)legacyBar.style.width=theory.pct+'%';
  refreshCardState();
}
function refreshCardState(){
  const data=source();if(!data)return;
  ['summary','complete'].forEach(kind=>{
    const st=modeStudyStats(data,kind);
    document.querySelectorAll(M1_SELECTOR+' [data-native-kind="'+kind+'"]').forEach(card=>{
      const tag=card.querySelector('.bc-native-material-action span:first-child');
      if(tag)tag.textContent=st.done===st.total&&st.total?'✓ Concluído':st.chapterDone+'/'+st.chapterTotal+' capítulos';
    });
  });
}

function close(){
  document.getElementById(OVERLAY_ID)?.remove();
  document.body.style.overflow='';
  current=null;
}
function buildChapterMap(){
  if(!current)return [];
  return modeChapters(source(),current.mode).map(ch=>({chapter:ch,heading:findHeadingForChapter(ch)})).filter(x=>x.heading);
}
function autoMarkViewedChapters(){
  if(!current||!current.chapterMap?.length)return;
  const sc=current.scroll;
  const viewportBottom=sc.scrollTop+sc.clientHeight;
  let changed=false;
  current.chapterMap.forEach((item,index)=>{
    if(chapterDone(current.mode,item.chapter.id))return;
    const start=item.heading.offsetTop;
    const next=current.chapterMap[index+1]?.heading?.offsetTop ?? current.article.scrollHeight;
    const target=start+Math.max(80,(next-start)*0.72);
    if(viewportBottom>=target){
      setChapterDone(current.mode,item.chapter.id,true);
      changed=true;
    }
  });
  if(changed)refreshReaderStudyUI();
}
function updateScrollProgress(){
  if(!current)return;
  const sc=current.scroll;
  const max=Math.max(1,sc.scrollHeight-sc.clientHeight);
  const pct=Math.max(0,Math.min(100,sc.scrollTop/max*100));
  const bar=current.overlay.querySelector('.bc-native-reader-progress');
  if(bar)bar.style.width=pct+'%';
  localStorage.setItem(storageKey(current.mode+':scroll'),String(sc.scrollTop));
  autoMarkViewedChapters();
}
function restoreScroll(){
  if(!current)return;
  const v=Number(localStorage.getItem(storageKey(current.mode+':scroll'))||0);
  if(v>0)current.scroll.scrollTop=v;
}
function setFont(delta){
  if(!current)return;
  current.font=Math.max(14,Math.min(21,current.font+delta));
  current.article.style.fontSize=current.font+'px';
  localStorage.setItem(storageKey('font'),String(current.font));
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
      frag.append(raw.slice(pos,idx));
      const mk=document.createElement('mark');mk.className='bc-native-search-hit';mk.textContent=raw.slice(idx,idx+term.length);frag.append(mk);
      n++;pos=idx+term.length;
    }
    frag.append(raw.slice(pos));node.replaceWith(frag);
  }
  root.querySelector('mark.bc-native-search-hit')?.scrollIntoView({block:'center'});
  return n;
}
function findHeadingForChapter(chapter){
  if(!current)return null;
  const target=normKey(chapter.title).replace(/^\d+\s+/,'');
  const words=target.split(' ').filter(w=>w.length>3);
  const headings=Array.from(current.article.querySelectorAll('h2,h3'));
  let best=null,bestScore=0;
  for(const h of headings){
    const hk=normKey(h.textContent);
    let score=0;
    words.forEach(w=>{if(hk.includes(w))score++});
    if(score>bestScore){bestScore=score;best=h}
  }
  return bestScore>=Math.max(1,Math.min(2,words.length))?best:null;
}
function refreshReaderStudyUI(){
  if(!current)return;
  const data=source(),st=modeStudyStats(data,current.mode);
  const value=current.overlay.querySelector('[data-reader-study-value]');
  const bar=current.overlay.querySelector('[data-reader-study-bar]');
  const qscore=current.overlay.querySelector('[data-reader-internal-score]');
  if(value)value.textContent=st.done+' / '+st.total+' pontos';
  if(bar)bar.style.width=(st.total?Math.round(st.done/st.total*100):0)+'%';
  if(qscore)qscore.textContent=st.answered
    ? st.correct+' acertos em '+st.answered+' respondidas'
    : 'Nenhuma questão interna respondida';

  current.overlay.querySelectorAll('[data-chapter-check]').forEach(btn=>{
    const done=chapterDone(current.mode,btn.dataset.chapterCheck);
    btn.classList.toggle('done',done);
    btn.setAttribute('aria-pressed',String(done));
    btn.textContent=done?'✓':'';
  });
  refreshModuleMetrics();
}
function chapterTocHtml(data,mode){
  return modeChapters(data,mode).map((ch,i)=>{
    const done=chapterDone(mode,ch.id);
    return '<div class="bc-native-toc-row">'+
      '<button type="button" class="bc-native-chapter-check '+(done?'done':'')+'" data-chapter-check="'+esc(ch.id)+'" aria-pressed="'+done+'" title="Marcar capítulo">'+(done?'✓':'')+'</button>'+
      '<button type="button" class="bc-native-chapter-jump" data-chapter-jump="'+esc(ch.id)+'"><span>'+(i+1)+'.</span>'+esc(ch.title)+'</button>'+
    '</div>';
  }).join('');
}
function quizHtml(data,mode){
  const qs=modeQuestions(data,mode);
  if(!qs.length)return '';
  const cards=qs.map((q,i)=>{
    const a=internalAnswer(mode,q.id);
    const options=q.options.map((op,idx)=>{
      let cls='';
      if(a){
        if(idx===q.answer)cls+=' correct';
        if(idx===a.selected&&idx!==q.answer)cls+=' wrong';
      }
      return '<button type="button" class="bc-native-quiz-option'+cls+'" data-internal-q="'+esc(q.id)+'" data-option="'+idx+'" '+(a?'disabled':'')+'><span>'+String.fromCharCode(65+idx)+'</span>'+esc(op)+'</button>';
    }).join('');
    return '<article class="bc-native-quiz-card" data-quiz-card="'+esc(q.id)+'">'+
      '<div class="bc-native-quiz-number">Questão '+(i+1)+' de '+qs.length+'</div>'+
      '<h3>'+esc(q.q)+'</h3>'+
      '<div class="bc-native-quiz-options">'+options+'</div>'+
      '<div class="bc-native-quiz-feedback '+(a?(a.correct?'ok':'bad'):'')+'" data-quiz-feedback>'+
        (a?'<b>'+(a.correct?'✓ Correto':'✕ Incorreto')+'</b><span>'+esc(q.explanation)+'</span><button type="button" data-internal-retry="'+esc(q.id)+'">Refazer</button>':'<span>Escolha uma alternativa para receber o feedback.</span>')+
      '</div>'+
    '</article>';
  }).join('');
  return '<section class="bc-native-internal-review">'+
    '<div class="bc-native-internal-review-head"><div><span class="bc-native-kicker">REVISÃO ATIVA INTERNA</span><h2>'+qs.length+' questões de assimilação</h2><p>Estas questões contam na <b>cobertura da teoria</b>. Elas não entram no gráfico de questões externas.</p></div><div class="bc-native-internal-score" data-reader-internal-score></div></div>'+
    cards+
  '</section>';
}
function bindQuiz(){
  if(!current)return;
  const data=source();
  current.overlay.querySelectorAll('[data-internal-q]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const q=modeQuestions(data,current.mode).find(x=>x.id===btn.dataset.internalQ);
      if(!q)return;
      saveInternalAnswer(current.mode,q,Number(btn.dataset.option));
      rerenderQuizCard(q.id);
      refreshReaderStudyUI();
    });
  });
  current.overlay.querySelectorAll('[data-internal-retry]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      resetInternalAnswer(current.mode,btn.dataset.internalRetry);
      rerenderQuizCard(btn.dataset.internalRetry);
      refreshReaderStudyUI();
    });
  });
}
function rerenderQuizCard(id){
  if(!current)return;
  const data=source(),q=modeQuestions(data,current.mode).find(x=>x.id===id);
  const old=current.overlay.querySelector('[data-quiz-card="'+CSS.escape(id)+'"]');
  if(!q||!old)return;
  const i=modeQuestions(data,current.mode).findIndex(x=>x.id===id);
  const a=internalAnswer(current.mode,id);
  const options=q.options.map((op,idx)=>{
    let cls='';
    if(a){
      if(idx===q.answer)cls+=' correct';
      if(idx===a.selected&&idx!==q.answer)cls+=' wrong';
    }
    return '<button type="button" class="bc-native-quiz-option'+cls+'" data-internal-q="'+esc(q.id)+'" data-option="'+idx+'" '+(a?'disabled':'')+'><span>'+String.fromCharCode(65+idx)+'</span>'+esc(op)+'</button>';
  }).join('');
  old.innerHTML='<div class="bc-native-quiz-number">Questão '+(i+1)+' de '+modeQuestions(data,current.mode).length+'</div>'+
    '<h3>'+esc(q.q)+'</h3><div class="bc-native-quiz-options">'+options+'</div>'+
    '<div class="bc-native-quiz-feedback '+(a?(a.correct?'ok':'bad'):'')+'" data-quiz-feedback>'+
      (a?'<b>'+(a.correct?'✓ Correto':'✕ Incorreto')+'</b><span>'+esc(q.explanation)+'</span><button type="button" data-internal-retry="'+esc(q.id)+'">Refazer</button>':'<span>Escolha uma alternativa para receber o feedback.</span>')+
    '</div>';
  bindQuiz();
}
function open(mode){
  const data=source();if(!data){alert('Conteúdo nativo do M01 ainda não foi carregado.');return}
  close();
  const parsed=buildHtml(data,mode);
  const label=mode==='summary'?'Conteúdo resumido':'Conteúdo completo';
  const chapters=modeChapters(data,mode),questions=modeQuestions(data,mode);
  const ov=document.createElement('div');
  ov.id=OVERLAY_ID;ov.className='bc-native-reader-overlay';
  ov.innerHTML='<section class="bc-native-reader" role="dialog" aria-modal="true" aria-label="'+esc(label)+'">'+
    '<header class="bc-native-reader-head"><div class="bc-native-reader-title"><b>PEN M03 — '+esc(data.title)+'</b><small>'+label+' • experiência nativa da Base Completa</small></div><span class="bc-native-reader-meta">'+parsed.words.toLocaleString('pt-BR')+' palavras • ~'+parsed.mins+' min</span><button class="bc-native-reader-close" data-native-action="close" aria-label="Fechar">×</button><div class="bc-native-reader-progress-track"><div class="bc-native-reader-progress"></div></div></header>'+
    '<div class="bc-native-reader-tools"><input type="search" placeholder="Buscar neste material…" aria-label="Buscar"><button data-native-action="smaller">A−</button><button data-native-action="larger">A+</button><button class="primary" data-native-action="top">Ir ao topo</button></div>'+
    '<div class="bc-native-reader-body">'+
      '<nav class="bc-native-toc"><div class="bc-native-toc-label">Capítulos para concluir</div>'+chapterTocHtml(data,mode)+'</nav>'+
      '<main class="bc-native-scroll"><article class="bc-native-article">'+
        '<div class="bc-native-kicker">'+(mode==='summary'?'PRIMEIRA LEITURA + REVISÃO':'TEORIA INTEGRAL')+'</div>'+
        '<h1>'+esc(data.title)+'</h1>'+
        '<p class="lead">'+(mode==='summary'?'Versão condensada para compreender o módulo e revisar os pontos de maior rendimento.':'Conteúdo integral convertido para leitura nativa, sem leitor de PDF.')+'</p>'+
        '<section class="bc-native-study-progress"><div><b>Progresso neste material</b><span data-reader-study-value>0 / '+(chapters.length+questions.length)+' pontos</span></div><div class="bc-native-study-progress-track"><span data-reader-study-bar></span></div><small>'+chapters.length+' capítulos + '+questions.length+' questões internas. Os capítulos recebem check automaticamente conforme você avança; as questões internas também entram na cobertura da teoria.</small></section>'+
        parsed.body+
        quizHtml(data,mode)+
      '</article></main>'+
    '</div></section>';
  document.body.appendChild(ov);document.body.style.overflow='hidden';

  current={
    mode,overlay:ov,scroll:ov.querySelector('.bc-native-scroll'),article:ov.querySelector('.bc-native-article'),
    font:Number(localStorage.getItem(storageKey('font'))||16),chapterMap:[]
  };
  current.article.style.fontSize=current.font+'px';
  current.scroll.addEventListener('scroll',updateScrollProgress,{passive:true});
  ov.querySelector('[data-native-action="close"]').onclick=close;
  ov.querySelector('[data-native-action="smaller"]').onclick=()=>setFont(-1);
  ov.querySelector('[data-native-action="larger"]').onclick=()=>setFont(1);
  ov.querySelector('[data-native-action="top"]').onclick=()=>current.scroll.scrollTo({top:0,behavior:'smooth'});
  ov.querySelector('.bc-native-reader-tools input').addEventListener('input',e=>search(e.target.value));

  ov.querySelectorAll('[data-chapter-check]').forEach(btn=>{
    btn.onclick=()=>{
      const id=btn.dataset.chapterCheck;
      setChapterDone(mode,id,!chapterDone(mode,id));
      refreshReaderStudyUI();
    };
  });
  ov.querySelectorAll('[data-chapter-jump]').forEach(btn=>{
    btn.onclick=()=>{
      const ch=modeChapters(data,mode).find(x=>x.id===btn.dataset.chapterJump);
      findHeadingForChapter(ch)?.scrollIntoView({behavior:'smooth',block:'start'});
    };
  });

  bindQuiz();
  ov.addEventListener('click',e=>{if(e.target===ov)close()});
  requestAnimationFrame(()=>{
    current.chapterMap=buildChapterMap();
    restoreScroll();updateScrollProgress();refreshReaderStudyUI();autoMarkViewedChapters();
  });
}
function openMap(){
  if(global.BaseMindMap?.open)global.BaseMindMap.open('penal','p3');
  else alert('O mapa mental interativo ainda está carregando. Tente novamente em alguns segundos.');
}
function removeLegacyM01Content(){
  const module=document.querySelector(M1_SELECTOR);
  if(!module)return;
  module.querySelectorAll('.bc-session-nav,.bc-session-pager').forEach(el=>el.remove());
}
function inject(){
  const module=document.querySelector(M1_SELECTOR);if(!module)return;
  removeLegacyM01Content();
  const body=module.querySelector('.cf-module-body');if(!body)return;

  // Fallback: a renderização principal já entrega os cards diretamente.
  if(!body.querySelector('.bc-native-materials')){
    const host=document.createElement('section');host.className='bc-native-materials';
    host.innerHTML='<div class="bc-native-materials-head"><div><b>Materiais do módulo</b><small>Escolha como estudar</small></div><small>Piloto M03 • conteúdo nativo</small></div>'+
      '<div class="bc-native-material-grid">'+
        '<button class="bc-native-material-card" data-native-kind="summary"><span class="bc-native-material-icon">⚡</span><span><strong>Conteúdo resumido</strong><small>Primeira leitura, revisão rápida, artigos, pegadinhas e revisão ativa.</small></span><span class="bc-native-material-action"><span>Abrir</span><span>→</span></span></button>'+
        '<button class="bc-native-material-card" data-native-kind="complete"><span class="bc-native-material-icon">📚</span><span><strong>Conteúdo completo</strong><small>Teoria integral do M03 em formato de site, com índice, busca e progresso de leitura.</small></span><span class="bc-native-material-action"><span>Abrir</span><span>→</span></span></button>'+
        '<button class="bc-native-material-card" data-native-kind="mindmap"><span class="bc-native-material-icon">🧠</span><span><strong>Mapa mental</strong><small>Mapa interativo com abrir/recolher ramos, zoom, arrastar e tela cheia.</small></span><span class="bc-native-material-action"><span>Abrir</span><span>→</span></span></button>'+
      '</div>';
    host.querySelector('[data-native-kind="summary"]').onclick=()=>open('summary');
    host.querySelector('[data-native-kind="complete"]').onclick=()=>open('complete');
    host.querySelector('[data-native-kind="mindmap"]').onclick=openMap;
    const subtitle=body.querySelector('.cf-subtitle');
    if(subtitle)subtitle.insertAdjacentElement('afterend',host);else body.insertAdjacentElement('afterbegin',host);
  }
  refreshModuleMetrics();
}
function install(){
  inject();
  observer=new MutationObserver(()=>{
    clearTimeout(install._t);
    install._t=setTimeout(()=>{removeLegacyM01Content();inject();refreshModuleMetrics()},60);
  });
  observer.observe(document.documentElement,{subtree:true,childList:true});
  global.addEventListener('focus',refreshModuleMetrics);
}
global.BaseNativeReaderM03={
  open,close,refreshMetrics:refreshModuleMetrics,theoryStats,externalStats,
  version:'2026.10.02-m03-pilot1'
};
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.getElementById(OVERLAY_ID))close()});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})(window);

/* M04 preview bundled */
(function(global){
'use strict';
global.BASE_NATIVE_CONTENT=global.BASE_NATIVE_CONTENT||{};
global.BASE_NATIVE_CONTENT.penal=global.BASE_NATIVE_CONTENT.penal||{};
global.BASE_NATIVE_CONTENT.penal.m04={"moduleId":"p4","number":4,"title":"Ilicitude","updatedAt":"2026-10-02","sources":{"completeDriveId":"1y1dWypnyGxSXCpmKw_OYqqxkeqxWZeZ-","completeTheoryKey":"p4","summaryDriveId":"1cSf6kEjbQTDomkyGYPUN-BQqva1wyJqv","mindMapDriveId":"1ASb1AqR5YgOJrtVDiZeqEREIki9UY4HD"},"summary":"BASE COMPLETA - Direito Penal | PEN M4 - Ilicitude 1\r\nPEN M4 - ILICITUDE\r\nResumo para primeira leitura e revisão rápida | foco em conceitos, requisitos, comparações e armadilhas de prova.\r\n1. Visão geral\r\nIlicitude (ou antijuridicidade) é a contrariedade do fato típico ao Direito. No modelo tradicional, a tipicidade indica inicialmente\r\nilicitude, mas esse indício cai quando existe uma causa de justificação. Assim, um fato pode continuar típico e, ao mesmo tempo,\r\nser lícito.\r\nIDEIA-CENTRAL Primeiro pergunte: o fato é típico? Depois: existe uma justificante que autoriza essa conduta? Se sim, exclui-se a\r\nilicitude.\r\nCausas gerais do art. 23 do Código Penal\r\n• Estado de necessidade (EN) - conflito diante de perigo atual.\r\n• Legítima defesa (LD) - reação contra agressão humana injusta, atual ou iminente.\r\n• Estrito cumprimento do dever legal (ECDL) - atuação exigida por dever jurídico, dentro dos limites.\r\n• Exercício regular de direito (ERD) - atuação permitida como direito/faculdade, sem abuso.\r\n• Consentimento do ofendido - pode atuar como causa supralegal quando o bem for disponível e a manifestação for válida.\r\nTIPICIDADE ILICITUDE\r\nA conduta se encaixa no tipo penal? A conduta típica é contrária ao Direito ou está justificada?\r\nÉ analisada antes. É analisada depois, no modelo tradicional.\r\nSua presença é indício de ilicitude. Uma justificante rompe esse indício.\r\n2. Teoria - Estado de necessidade\r\nO estado de necessidade permite sacrificar um interesse para salvar outro diante de perigo atual, quando não era razoável exigir a\r\nperda do bem ameaçado. A fonte do perigo pode ser natural, animal ou humana; o essencial é que a estrutura seja de perigo, não\r\nnecessariamente de agressão injusta.\r\nDECORE EN = PERIGO ATUAL + inevitabilidade por outro meio + direito próprio/alheio + sacrifício inexigível + não\r\nprovocação voluntária + ausência de dever legal de enfrentar o perigo.\r\nRequisitos essenciais\r\n• Perigo atual: já existente no momento da ação salvadora. Não confundir com a fórmula “atual ou iminente” da LD.\r\n• Não provocação voluntária: quem cria deliberadamente o perigo não pode usá-lo como justificativa para sacrificar bem alheio.\r\n• Inevitabilidade por outro meio: se havia alternativa concreta, segura e razoável, a justificante não se completa.\r\n• Direito próprio ou alheio: também se pode agir para proteger terceiro.\r\n• Sacrifício inexigível: deve ser irrazoável exigir a perda do bem ameaçado. Se o sacrifício era razoavelmente exigível, não há\r\njustificante, embora o art. 24, §2º, admita redução de pena de 1/3 a 2/3.\r\n• Dever legal de enfrentar o perigo: impede a invocação do EN nos limites desse dever; não significa dever de suicídio ou atuação\r\nimpossível.\r\nClassificações úteis\r\nDefensivo: recai sobre a própria fonte do perigo. Agressivo: sacrifica bem de terceiro estranho à fonte do perigo. Real: o perigo existe.\r\nPutativo: o agente apenas imagina a situação; os efeitos do erro pertencem ao PEN M5.BASE COMPLETA - Direito Penal | PEN M4 - Ilicitude 2\r\n3. Teoria - Legítima defesa\r\nA legítima defesa autoriza repelir agressão humana injusta, atual ou iminente, contra direito próprio ou de terceiro, mediante\r\nmeios necessários usados moderadamente. A agressão deve ser objetivamente injusta; por isso, pode haver defesa contra\r\ninimputável.\r\nFÓRMULA LD = AGRESSÃO INJUSTA + atual ou iminente + direito próprio/alheio + meio necessário + uso moderado.\r\nNecessidade e moderação não são a mesma coisa\r\nMEIO NECESSÁRIO USO MODERADO\r\nPergunta: era necessário recorrer a esse meio? Pergunta: como e por quanto tempo o meio foi usado?\r\nCompara os meios eficazes e realmente disponíveis. Examina intensidade, duração e modo de emprego.\r\nNão exige igualdade de armas. Não existe número abstrato de golpes/disparos permitido.\r\nÉ um juízo concreto, feito à luz da situação vivida. Mesmo meio necessário pode tornar-se excessivo após cessar a\r\nagressão.\r\n• Atual: agressão em curso. Iminente: prestes a começar de forma concreta e imediata.\r\n• Agressão passada: não autoriza vingança. Ameaça remota: não autoriza defesa antecipada.\r\n• Não há dever geral de fuga como requisito da legítima defesa, mas necessidade e moderação continuam obrigatórias.\r\nSituações especiais\r\n• Própria x de terceiro: muda o titular do direito protegido; os demais requisitos são os mesmos.\r\n• Sucessiva: cabe contra o excesso de quem inicialmente se defendia legitimamente.\r\n• Recíproca real: não existe; se uma reação está juridicamente justificada, ela não é agressão injusta apta a gerar LD real do outro\r\nlado.\r\n• Contra inimputável: é possível, porque inimputabilidade afeta culpabilidade, não necessariamente a injustiça objetiva da agressão.\r\n• Putativa: a agressão é imaginada; não há justificante objetiva. O tratamento do erro fica para o PEN M5.\r\n• Agressão por omissão: pode ser admitida em situações juridicamente relevantes, mas não é qualquer omissão que autoriza reação\r\ndefensiva.\r\nHonra e atuação de agentes de segurança\r\nA chamada “legítima defesa da honra” não é juridicamente admitida: ciúme, traição ou sentimento de desonra não constituem\r\nagressão injusta capaz de justificar violência. Quanto ao agente de segurança pública, o art. 25, parágrafo único, abrange a reação\r\npara proteger vítima mantida refém, mas mantém os requisitos do caput, inclusive necessidade e moderação.\r\nPROVA Se a alternativa disser que a regra especial do agente de segurança dispensa os requisitos gerais da legítima\r\ndefesa, está errada.\r\n4. Estado de necessidade x legítima defesa\r\nCRITÉRIO ESTADO DE NECESSIDADE LEGÍTIMA DEFESA\r\nNúcleo Perigo Agressão humana injusta\r\nTempo Perigo atual Agressão atual ou iminente\r\nOutro meio Perigo não podia ser evitado de outro modo Meio defensivo deve ser necessário\r\nModeração Não é expressão literal do art. 24; há ponderação do\r\nsacrifício\r\nExigência expressa de uso moderado\r\nDever de enfrentar Pode impedir o EN Não há cláusula equivalente no art. 25\r\nTerceiro Pode proteger direito alheio Pode proteger direito alheioBASE COMPLETA - Direito Penal | PEN M4 - Ilicitude 3\r\n5. Outras justificantes\r\nEstrito cumprimento do dever legal\r\nIncide quando o Direito impõe um dever de agir e a conduta típica permanece estritamente dentro desse dever. Exige norma\r\nválida, competência, respeito aos limites e ausência de excesso. Não se trata de “licença” geral para agentes públicos: abuso,\r\ndesvio ou ordem manifestamente ilegal não se tornam lícitos apenas por terem origem funcional.\r\nCHAVE ECDL = DEVER. A palavra decisiva é “estrito”: passou do limite, surge excesso.\r\nExercício regular de direito\r\nIncide quando o ordenamento reconhece um direito, faculdade ou liberdade e o agente atua regularmente. Exemplos clássicos:\r\nriscos permitidos em esportes praticados segundo as regras, intervenções médicas lícitas e consentidas e certas faculdades de\r\nproteção patrimonial. O abuso rompe a justificante.\r\nESTRITO CUMPRIMENTO EXERCÍCIO REGULAR\r\nHá dever jurídico de atuar. Há direito/faculdade de atuar.\r\nA conduta é imposta pelo ordenamento. A conduta é permitida pelo ordenamento.\r\nLimite: estrita conformidade com o dever. Limite: exercício regular, sem abuso.\r\nConsentimento do ofendido\r\nO consentimento pode atuar em dois planos. Se a falta de autorização integra o próprio tipo, o consentimento válido pode afastar a\r\ntipicidade (alguns autores chamam de “acordo”). Se o tipo se completa mesmo com a vontade da vítima, o consentimento pode ser\r\ndiscutido como causa supralegal de exclusão da ilicitude.\r\n• Bem disponível: o titular precisa poder dispor juridicamente daquele interesse.\r\n• Titular apto: capacidade para compreender e decidir conforme a natureza do bem e a legislação aplicável.\r\n• Manifestação livre e consciente: sem coação ou fraude relevante.\r\n• Momento: anterior ou concomitante ao fato; consentimento posterior não retroage.\r\n• Limites: o agente deve permanecer dentro do que foi efetivamente autorizado.\r\nATENÇÃO A vida não se torna disponível para fins penais apenas por manifestação de vontade. Em outros bens, a\r\ndisponibilidade pode ser parcial e depender do caso concreto.\r\n6. Excesso nas excludentes\r\nA justificante protege apenas a conduta dentro de seus limites. A sequência é: situação inicialmente justificada -> ultrapassagem\r\n-> excesso. O art. 23, parágrafo único, prevê responsabilidade pelo excesso doloso ou culposo.\r\nEXCESSO DOLOSO EXCESSO CULPOSO\r\nO agente conscientemente ultrapassa os limites. Ultrapassa por imprudência, negligência ou imperícia, sem dolo no\r\nexcesso.\r\nResponde pelo fato doloso correspondente, se presentes os requisitos. Só há punição se existir modalidade culposa legalmente prevista.\r\nEx.: agressor neutralizado; vítima continua por vingança. Ex.: reação defensiva permitida executada de modo imprudente e\r\nexcessivo.\r\nEXCESSO INTENSIVO EXCESSO EXTENSIVO\r\nOcorre durante a situação justificante, mas com intensidade/meio além\r\ndo permitido.\r\nUltrapassa o limite temporal, continuando depois de cessar perigo ou\r\nagressão.\r\nExcesso no modo ou intensidade. Excesso na duração da reação.\r\n“Excesso exculpante” é construção doutrinária ligada à culpabilidade e não constitui nova justificante do art. 23; seu aprofundamento pertence\r\nao PEN M5.BASE COMPLETA - Direito Penal | PEN M4 - Ilicitude 4\r\n7. Artigos para decorar\r\nArt. 23 - mapa das justificantes\r\nMemorize as quatro causas gerais: estado de necessidade; legítima defesa; estrito cumprimento de dever legal; exercício\r\nregular de direito. O parágrafo único determina que o agente responde pelo excesso doloso ou culposo.\r\nArt. 24 - estado de necessidade\r\nGatilho: perigo atual. Estrutura mental: perigo atual + não provocação voluntária + inevitabilidade por outro meio + direito\r\npróprio/alheio + sacrifício que não era razoável exigir. §1º: não pode alegar EN quem tinha dever legal de enfrentar o perigo, nos\r\nlimites desse dever. §2º: se era razoável exigir o sacrifício, não há justificante, mas a pena pode ser reduzida de 1/3 a 2/3.\r\nArt. 25 - legítima defesa\r\nGatilho: agressão injusta atual ou iminente. Estrutura mental: direito próprio/alheio + meios necessários + uso moderado.\r\nParágrafo único: situação do agente de segurança em defesa de vítima mantida refém, sempre observados os requisitos do caput.\r\nMNEMÔNICO NECESSIDADE = PERIGO. DEFESA = AGRESSÃO.\r\n8. Pegadinhas de prova\r\nPEGADINHA CORREÇÃO\r\n“Estado de necessidade exige perigo atual ou iminente.” Errado. O art. 24 usa perigo atual.\r\n“Legítima defesa só protege direito próprio.” Errado. Pode proteger direito próprio ou alheio.\r\n“Contra inimputável não cabe legítima defesa.” Errado. Agressão pode ser objetivamente injusta mesmo sem culpabilidade do\r\nagressor.\r\n“Se o meio era necessário, a reação está automaticamente\r\njustificada.”\r\nErrado. Além da necessidade, exige-se moderação.\r\n“Legítima defesa exige armas equivalentes.” Errado. Não há simetria mecânica; o juízo é concreto.\r\n“Agressão passada ainda permite legítima defesa.” Errado. Depois de cessada a agressão, reação vingativa pode configurar\r\nexcesso ou novo ilícito.\r\n“Há legítima defesa real recíproca.” Errado. Se uma reação é lícita, ela não é agressão injusta para gerar LD real do\r\noutro lado.\r\n“Consentimento posterior torna lícita a conduta anterior.” Errado. Deve ser anterior ou concomitante, além de válido e referente a bem\r\ndisponível.\r\n“Excesso culposo só existe na legítima defesa.” Errado. O art. 23, parágrafo único, refere-se às hipóteses do artigo.\r\n“Agente de segurança em situação de refém não precisa observar\r\nnecessidade e moderação.”\r\nErrado. O art. 25, parágrafo único, remete aos requisitos do caput.\r\n“Legítima defesa da honra é justificante penal.” Errado. A tese não é juridicamente admitida.\r\n“Estrito cumprimento e exercício regular são a mesma ideia.” Errado. Um decorre de dever; o outro, de direito/faculdade.BASE COMPLETA - Direito Penal | PEN M4 - Ilicitude 5\r\n9. Revisão ativa\r\nLeia a pergunta, tente responder mentalmente e só depois confira a linha seguinte.\r\n1. Qual é a diferença nuclear entre estado de necessidade e legítima defesa?\r\nResposta: EN gira em torno de perigo; LD exige agressão humana injusta.\r\n2. Qual é a expressão temporal do art. 24?\r\nResposta: Perigo atual.\r\n3. Qual é a expressão temporal do art. 25?\r\nResposta: Agressão atual ou iminente.\r\n4. Quais são as quatro justificantes gerais do art. 23?\r\nResposta: Estado de necessidade, legítima defesa, estrito cumprimento de dever legal e exercício regular de direito.\r\n5. No estado de necessidade, qual requisito demonstra sua subsidiariedade?\r\nResposta: O perigo não podia ser evitado de outro modo.\r\n6. Quem tem dever legal de enfrentar o perigo pode invocar EN livremente?\r\nResposta: Não. O art. 24, §1º, impede a justificante nos limites do dever legal.\r\n7. Meio necessário e moderação são sinônimos?\r\nResposta: Não. Necessidade trata da escolha do meio; moderação trata do modo, intensidade e duração do uso.\r\n8. É possível legítima defesa de terceiro?\r\nResposta: Sim. O art. 25 protege direito seu ou de outrem.\r\n9. É possível legítima defesa contra inimputável?\r\nResposta: Sim, se houver agressão objetivamente injusta e os demais requisitos.\r\n10. O que é legítima defesa sucessiva?\r\nResposta: Defesa contra o excesso de quem inicialmente estava em legítima defesa.\r\n11. Qual a diferença entre LD real e putativa?\r\nResposta: Na real, a agressão existe; na putativa, ela é apenas imaginada. O erro é aprofundado no PEN M5.\r\n12. Qual a palavra-chave do estrito cumprimento?\r\nResposta: Dever.\r\n13. Qual a palavra-chave do exercício regular?\r\nResposta: Direito/faculdade.\r\n14. Quais os requisitos-base do consentimento justificante?\r\nResposta: Bem disponível, titular apto, manifestação livre, anterior/concomitante e respeito aos limites.\r\n15. Como distinguir excesso intensivo e extensivo?\r\nResposta: Intensivo = excesso na intensidade/manejo; extensivo = excesso no tempo, após cessar a situação justificante.\r\n16. Qual é a regra do excesso culposo?\r\nResposta: Só haverá punição se o resultado admitir modalidade culposa prevista em lei.\r\nCHECK FINAL Ao resolver um caso, marque quatro pontos: fonte (perigo ou agressão), tempo (atual ou iminente), alternativa\r\n(outro meio/meio necessário) e limite (sacrifício ou moderação).\r\nResumo editorial baseado no PEN M4 offline auditado em 18/09/2026. Escopo propositalmente enxuto: primeira leitura + revisão, sem\r\naprofundar teoria do erro ou culpabilidade (PEN M5).","chapters":{"summary":[{"id":"s01","title":"Visão geral"},{"id":"s02","title":"Teoria - Estado de necessidade"},{"id":"s03","title":"Teoria - Legítima defesa"},{"id":"s04","title":"Estado de necessidade x legítima defesa"},{"id":"s05","title":"Outras justificantes"},{"id":"s06","title":"Excesso nas excludentes"},{"id":"s07","title":"Artigos para decorar"},{"id":"s08","title":"Pegadinhas de prova"}],"complete":[{"id":"c01","title":"Conceito de ilicitude e antijuridicidade"},{"id":"c02","title":"Antijuridicidade e relação com a tipicidade"},{"id":"c03","title":"Causas de exclusão da ilicitude"},{"id":"c04","title":"Estado de necessidade: conceito e fundamento"},{"id":"c05","title":"Requisitos do estado de necessidade"},{"id":"c06","title":"Espécies e classificações do estado de necessidade"},{"id":"c07","title":"Legítima defesa: conceito, fundamento e agressão"},{"id":"c08","title":"Requisitos da legítima defesa: direito protegido, necessidade e moderação"},{"id":"c09","title":"Espécies e situações especiais de legítima defesa"},{"id":"c10","title":"Legítima defesa putativa — introdução"},{"id":"c11","title":"Legítima defesa da honra e atuação de agentes de segurança"},{"id":"c12","title":"Estrito cumprimento do dever legal"},{"id":"c13","title":"Exercício regular de direito"},{"id":"c14","title":"Consentimento do ofendido"},{"id":"c15","title":"Excesso nas excludentes"},{"id":"c16","title":"Estado de necessidade × legítima defesa"},{"id":"c17","title":"Quadros comparativos FCC"},{"id":"c18","title":"O que decorar e pegadinhas FCC"}]},"internalQuestions":{"summary":[{"id":"sq01","q":"Qual é a diferença nuclear entre estado de necessidade e legítima defesa?","options":["Estado de necessidade parte de perigo; legítima defesa parte de agressão humana injusta.","Ambos exigem agressão humana injusta.","Estado de necessidade exige agressão iminente; legítima defesa exige apenas perigo atual.","Não há diferença estrutural entre eles."],"answer":0,"explanation":"O material usa a chave: necessidade = perigo; defesa = agressão humana injusta."},{"id":"sq02","q":"Qual é a expressão temporal correta do art. 24 para o estado de necessidade?","options":["Perigo atual ou iminente.","Perigo futuro provável.","Perigo atual.","Agressão atual."],"answer":2,"explanation":"O resumo enfatiza a literalidade do art. 24: perigo atual."},{"id":"sq03","q":"Na legítima defesa, meios necessários e moderação:","options":["São sinônimos.","São requisitos distintos e cumulativos.","Só importam para agentes de segurança.","Podem ser ignorados quando o agressor é inimputável."],"answer":1,"explanation":"Necessidade diz respeito à escolha do meio; moderação, ao modo, intensidade e duração de seu uso."},{"id":"sq04","q":"O consentimento do ofendido pode funcionar como justificante supralegal quando:","options":["O bem é disponível e a manifestação é válida.","É dado apenas depois do fato.","Recai sobre qualquer bem, inclusive indisponível.","É obtido por coação."],"answer":0,"explanation":"O material exige disponibilidade do bem e consentimento válido, livre e anterior ou concomitante."},{"id":"sq05","q":"No excesso culposo previsto no art. 23, parágrafo único, o agente:","options":["Sempre fica isento de pena.","Só pode responder se houver modalidade culposa legalmente prevista para o resultado.","Responde necessariamente por crime doloso.","Só pode responder em legítima defesa."],"answer":1,"explanation":"O excesso culposo só é punível quando o resultado admite forma culposa prevista em lei."}],"complete":[{"id":"cq01","q":"No modelo tradicional, qual é a relação entre tipicidade e ilicitude?","options":["A tipicidade funciona como indício de ilicitude, afastável por justificante.","Tipicidade e ilicitude são o mesmo juízo.","A ilicitude é examinada antes da tipicidade.","Uma causa de justificação elimina sempre a tipicidade."],"answer":0,"explanation":"O material adota a ideia de ratio cognoscendi: a tipicidade indica inicialmente ilicitude, salvo causa de justificação."},{"id":"cq02","q":"Quais são as quatro causas gerais expressas do art. 23 do Código Penal?","options":["Estado de necessidade, legítima defesa, estrito cumprimento do dever legal e exercício regular de direito.","Erro de tipo, erro de proibição, coação e obediência hierárquica.","Consentimento, insignificância, adequação social e inexigibilidade.","Necessidade, culpabilidade, tipicidade e punibilidade."],"answer":0,"explanation":"São as quatro justificantes gerais expressas previstas no art. 23."},{"id":"cq03","q":"O estado de necessidade revela sua natureza subsidiária principalmente pela exigência de:","options":["Agressão humana injusta.","Inevitabilidade do perigo por outro meio.","Uso moderado dos meios necessários.","Consentimento do titular do bem sacrificado."],"answer":1,"explanation":"Se havia alternativa concreta, segura e razoável, a justificante não se completa."},{"id":"cq04","q":"Sobre legítima defesa contra inimputável, o material afirma que:","options":["É impossível porque o agressor não é culpável.","É possível, porque a injustiça da agressão não depende da culpabilidade do agressor.","Só é possível para proteger terceiro.","Só é possível com autorização judicial."],"answer":1,"explanation":"A inimputabilidade afeta a culpabilidade do agressor, não necessariamente a injustiça objetiva da agressão."},{"id":"cq05","q":"Legítima defesa sucessiva ocorre quando:","options":["Duas pessoas atuam simultaneamente em legítima defesa real.","Há reação contra o excesso de quem inicialmente estava em legítima defesa.","A vítima reage a uma ameaça futura e remota.","O agente imagina uma agressão inexistente."],"answer":1,"explanation":"Quando a reação inicial ultrapassa os limites da justificante, o excesso pode se tornar nova agressão injusta."},{"id":"cq06","q":"No estrito cumprimento do dever legal, a palavra decisiva destacada pelo material é:","options":["Estrito.","Voluntário.","Supralegal.","Putativo."],"answer":0,"explanation":"O dever não justifica abuso, desvio de finalidade ou violência desnecessária; a atuação deve permanecer estritamente nos limites jurídicos."},{"id":"cq07","q":"A diferença central entre estrito cumprimento do dever legal e exercício regular de direito é:","options":["No primeiro há dever jurídico de atuar; no segundo há direito ou faculdade juridicamente reconhecido.","O primeiro exclui tipicidade; o segundo exclui culpabilidade.","O primeiro só vale para policiais; o segundo só para particulares.","Não existe diferença entre as duas justificantes."],"answer":0,"explanation":"O material resume: dever legal = atuação imposta; exercício regular = atuação facultada."},{"id":"cq08","q":"Consentimento posterior ao fato:","options":["Retroage e torna a conduta lícita.","Só produz efeito se houver homologação judicial.","Não converte retroativamente a conduta em lícita.","Sempre exclui a tipicidade."],"answer":2,"explanation":"A autorização precisa ser anterior ou concomitante, além de válida e relativa a bem juridicamente disponível."},{"id":"cq09","q":"Excesso intensivo e excesso extensivo correspondem, respectivamente, a:","options":["Excesso na intensidade/modo durante a situação justificante e prolongamento temporal após seu limite.","Erro sobre a existência da justificante e erro sobre a culpabilidade.","Ato preparatório e ato executório.","Dolo direto e dolo eventual."],"answer":0,"explanation":"Intensivo é excesso no modo ou intensidade; extensivo é ultrapassagem temporal da justificante."},{"id":"cq10","q":"Na comparação entre estado de necessidade e legítima defesa, qual afirmação está correta?","options":["Ambos exigem agressão humana injusta.","O estado de necessidade exige uso moderado dos meios necessários.","A legítima defesa exige agressão injusta atual ou iminente; o estado de necessidade trabalha com perigo atual.","Quem tem dever legal de enfrentar o perigo nunca pode agir em legítima defesa."],"answer":2,"explanation":"A distinção temporal e estrutural do material é: EN = perigo atual; LD = agressão injusta atual ou iminente."}]}};
})(window);

(function(global){
'use strict';
const SEL='#subjects .subject[data-id="penal"] .cf-module[data-cf="p4"]';

function inject(){
  const module=document.querySelector(SEL);
  if(!module) return;
  const body=module.querySelector('.cf-module-body');
  if(!body || body.querySelector('[data-bc-native-m04]')) return;

  const host=document.createElement('section');
  host.className='bc-native-materials bc-native-materials-static';
  host.setAttribute('data-bc-native-m04','');
  host.innerHTML=
    '<section class="bc-native-metrics" aria-label="Indicadores do módulo">'+
      '<article class="bc-native-metric-card">'+
        '<div class="bc-native-ring" data-native-ring="theory"><div class="bc-native-ring-inner"><b data-ring-value>0%</b><span>teoria</span></div></div>'+
        '<div class="bc-native-metric-copy"><small>COBERTURA DA TEORIA</small><strong data-native-metric-detail="theory">0 de 41 pontos concluídos</strong><span>Checks dos capítulos + questões internas.</span></div>'+
      '</article>'+
      '<article class="bc-native-metric-card">'+
        '<div class="bc-native-ring" data-native-ring="external"><div class="bc-native-ring-inner"><b data-ring-value>—</b><span>externas</span></div></div>'+
        '<div class="bc-native-metric-copy"><small>ACERTO EM QUESTÕES EXTERNAS</small><strong data-native-metric-detail="external">Nenhuma questão externa respondida</strong><span data-native-metric-meta="external">Registre questões externas no final do módulo</span></div>'+
      '</article>'+
    '</section>'+
    '<div class="bc-native-materials-head"><div><b>Materiais do módulo</b><small>Escolha como estudar</small></div><small>M04 • conteúdo nativo</small></div>'+
    '<div class="bc-native-material-grid">'+
      '<button type="button" class="bc-native-material-card" data-native-kind="summary"><span class="bc-native-material-icon">⚡</span><span><strong>Conteúdo resumido</strong><small>Primeira leitura, revisão rápida, artigos, pegadinhas e revisão ativa.</small></span><span class="bc-native-material-action"><span>Abrir</span><span>→</span></span></button>'+
      '<button type="button" class="bc-native-material-card" data-native-kind="complete"><span class="bc-native-material-icon">📚</span><span><strong>Conteúdo completo</strong><small>Teoria integral do M04 em formato de site, com índice, busca e progresso de leitura.</small></span><span class="bc-native-material-action"><span>Abrir</span><span>→</span></span></button>'+
      '<button type="button" class="bc-native-material-card" data-native-kind="mindmap"><span class="bc-native-material-icon">🧠</span><span><strong>Mapa mental</strong><small>Mapa interativo com abrir/recolher ramos, zoom, arrastar e tela cheia.</small></span><span class="bc-native-material-action"><span>Abrir</span><span>→</span></span></button>'+
    '</div>'+
    '<section class="bc-native-quick-summary" aria-label="Resumo do módulo">'+
      '<div class="bc-native-quick-summary-head"><span class="bc-native-quick-summary-no">4</span><div><b>Resumo do módulo</b><small>O M04 em poucas palavras.</small></div></div>'+
      '<div class="bc-native-quick-summary-body">Ilicitude e causas de justificação • estado de necessidade • legítima defesa • estrito cumprimento e exercício regular • consentimento do ofendido • excesso nas excludentes.</div>'+
    '</section>';

  host.querySelector('[data-native-kind="summary"]').onclick=function(){global.BaseNativeReaderM04?.open('summary')};
  host.querySelector('[data-native-kind="complete"]').onclick=function(){global.BaseNativeReaderM04?.open('complete')};
  host.querySelector('[data-native-kind="mindmap"]').onclick=function(){global.BaseMindMap?.open('penal','p4')};

  const subtitle=body.querySelector('.cf-subtitle');
  if(subtitle) subtitle.insertAdjacentElement('afterend',host);
  else body.insertAdjacentElement('afterbegin',host);
  global.BaseNativeReaderM04?.refreshMetrics?.();
}
function install(){
  inject();
  const obs=new MutationObserver(function(){
    clearTimeout(install._t);
    install._t=setTimeout(inject,60);
  });
  obs.observe(document.documentElement,{subtree:true,childList:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})(window);

(function(global){
'use strict';

const OVERLAY_ID='bcNativeReaderOverlayM04';
const M1_SELECTOR='#subjects .subject[data-id="penal"] .cf-module[data-cf="p4"]';
const STORAGE_PREFIX='central-v6:native-reader:penal:p4';
let current=null;
let observer=null;

function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function norm(s){return String(s||'').replace(/\u00a0/g,' ').replace(/[ \t]+/g,' ').trim()}
function normKey(s){return norm(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
function slug(s){return normKey(s).replace(/\s+/g,'-').slice(0,70)}
function source(){return global.BASE_NATIVE_CONTENT?.penal?.m04||null}
function storageKey(part){return STORAGE_PREFIX+':'+part}

function cleanLines(raw,mode){
  const lines=String(raw||'').replace(/\r/g,'').split('\n').map(norm);
  const out=[];
  let skipOldSummaryReview=false;
  for(let line of lines){
    if(mode==='summary' && /^9\.\s*REVIS(?:A|Ã)O ATIVA/i.test(line)){skipOldSummaryReview=true;continue}
    if(skipOldSummaryReview)continue;
    if(!line){out.push('');continue}
    if(/^BASE COMPLETA(?:\s*[|•-]|$)/i.test(line))continue;
    if(/^D\s*IRE\s*ITO PENAL\s*•\s*M0?1$/i.test(line))continue;
    if(/^\d+\s*\/\s*\d+$/.test(line))continue;
    if(/^P[aá]gina\s+\d+$/i.test(line))continue;
    if(/^Conteudo restrito ao PEN M1/i.test(line))continue;
    out.push(line);
  }
  return out;
}
function headingInfo(line){
  const l=norm(line);
  if(!l)return null;
  let m=l.match(/^(\d+)\.(\d+)\s+(.{3,140})$/);
  if(m)return {level:3,text:l};
  m=l.match(/^(\d+)\.?\s+(.{3,140})$/);
  if(m && !/^\d+\s*\/\s*\d+/.test(l) && !/^\d+\s+(Quais|Qual|A |O |Como |Quando |Pequeno|Pessoalidade|Na )/i.test(l)){
    return {level:2,text:l};
  }
  if(/^(VISÃO GERAL|VISAO GERAL|REVISÃO ATIVA|REVISAO ATIVA|ARTIGOS PARA DECORAR|PEGADINHAS DE PROVA|MAPA DO MÓDULO|MAPA DO MODULO|TEORIA ESSENCIAL)$/i.test(l)){
    return {level:2,text:l};
  }
  return null;
}
function calloutType(line){
  const l=norm(line).toUpperCase();
  if(/^(✅\s*)?EXEMPLO/.test(l))return ['example','Exemplo'];
  if(/PEGADINHA/.test(l))return ['trap','Pegadinha'];
  if(/^(⚖️\s*)?LEI SECA/.test(l))return ['law','Lei seca'];
  if(/^(DECORE|MEMÓRIA|MEMORIA|MNEMÔNICO|MNEMONICO|REGRA DE OURO|IDEIA-CENTRAL|IDEIA CENTRAL|FÓRMULA|FORMULA|MEMORIZACAO RAPIDA)/.test(l))return ['memory',norm(line)];
  if(/^(STF|STJ|JURISPRUDÊNCIA|JURISPRUDENCIA|ATUALIZAÇÃO|ATUALIZACAO)/.test(l))return ['case',norm(line)];
  if(/^(COMPARAÇÃO|COMPARACAO|ATENÇÃO|ATENCAO|PROVA|CUIDADO|FRONTEIRA DO MÓDULO|FRONTEIRA DO MODULO)/.test(l))return ['case',norm(line)];
  return null;
}
function isBullet(line){return /^[•●▪◦*-]\s+/.test(line)}
function looksTitle(line){
  const l=norm(line);
  if(l.length<3||l.length>105)return false;
  if(/[.!?]$/.test(l))return false;
  if(/^[A-ZÁÉÍÓÚÂÊÔÃÕÇ0-9][A-ZÁÉÍÓÚÂÊÔÃÕÇ0-9\s:–—()/%ºª,.-]+$/.test(l)&&l.split(/\s+/).length<=12)return true;
  return false;
}
function parse(raw,mode){
  const lines=cleanLines(raw,mode);
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
        if(!next){if(body.length)break;else continue}
        if(headingInfo(next)||calloutType(next)||looksTitle(next))break;
        body.push(next);i=j;
      }
      blocks.push({type:'callout',kind:co[0],label:co[1],text:body.join(' ')});
      continue;
    }
    if(isBullet(line)){
      flush();
      const items=[line.replace(/^[•●▪◦*-]\s+/,'')];
      while(i+1<lines.length&&isBullet(lines[i+1]))items.push(lines[++i].replace(/^[•●▪◦*-]\s+/,''));
      blocks.push({type:'ul',items});
      continue;
    }
    if(looksTitle(line)&&mode==='summary'){flush();blocks.push({type:'h',level:3,text:line});continue}
    para.push(line);
  }
  flush();
  const firstH=blocks.findIndex(b=>b.type==='h');
  if(firstH>2){
    const lead=blocks.slice(0,firstH).filter(b=>b.type==='p').map(b=>b.text).join(' ');
    blocks.splice(0,firstH,{type:'lead',text:lead});
  }
  return blocks;
}
function buildHtml(data,mode){
  if(mode==='complete'){
    const host=document.createElement('div');
    host.innerHTML=global.PENAL_FULL_THEORY?.p4?.html||'';
    host.querySelector('.pen-m3-cover')?.remove();
    host.querySelector('.pen-m3-toc')?.remove();
    host.querySelector('.pen-m3-orientacao')?.remove();
    host.querySelector('#pen-m3-s40')?.remove();

    const headings=[];
    host.querySelectorAll('section.pen-m3-session').forEach((section,index)=>{
      const h=section.querySelector('h3');
      if(!h)return;
      if(!h.id)h.id='bcsec-complete-'+(index+1)+'-'+slug(h.textContent);
      headings.push({id:h.id,text:norm(h.textContent),level:2,key:normKey(h.textContent)});
    });

    // Normalize native M3 blocks to the reader's component vocabulary.
    host.querySelectorAll('.pen-m3-callout').forEach(el=>el.classList.add('bc-native-callout'));
    host.querySelectorAll('.pen-m3-table').forEach(el=>el.classList.add('bc-native-table-wrap'));
    const text=norm(host.textContent);
    const words=text.split(/\s+/).filter(Boolean).length;
    const mins=Math.max(1,Math.round(words/190));
    return {body:host.innerHTML,headings,words,mins};
  }

  const raw=mode==='summary'?data.summary:data.complete;
  const blocks=parse(raw,mode);
  const headings=[];
  let hCount=0;
  const body=blocks.map(b=>{
    if(b.type==='h'){
      const id='bcsec-'+(++hCount)+'-'+slug(b.text);
      headings.push({id,text:b.text,level:b.level,key:normKey(b.text)});
      return '<h'+b.level+' id="'+id+'">'+esc(b.text)+'</h'+b.level+'>';
    }
    if(b.type==='lead')return '<p class="lead">'+esc(b.text)+'</p>';
    if(b.type==='p')return '<p>'+esc(b.text)+'</p>';
    if(b.type==='ul')return '<ul>'+b.items.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>';
    if(b.type==='callout')return '<aside class="bc-native-callout '+b.kind+'"><b>'+esc(b.label)+'</b><div>'+esc(b.text)+'</div></aside>';
    return '';
  }).join('');
  const words=norm(raw).split(/\s+/).filter(Boolean).length;
  const mins=Math.max(1,Math.round(words/(mode==='summary'?220:190)));
  return {body,headings,words,mins};
}
function modeChapters(data,mode){return Array.isArray(data?.chapters?.[mode])?data.chapters[mode]:[]}
function modeQuestions(data,mode){return Array.isArray(data?.internalQuestions?.[mode])?data.internalQuestions[mode]:[]}
function chapterDone(mode,id){return localStorage.getItem(storageKey('chapter:'+mode+':'+id))==='1'}
function setChapterDone(mode,id,done){
  localStorage.setItem(storageKey('chapter:'+mode+':'+id),done?'1':'0');
}
function internalAnswer(mode,id){
  try{return JSON.parse(localStorage.getItem(storageKey('internal:'+mode+':'+id))||'null')}catch(_){return null}
}
function saveInternalAnswer(mode,q,selected){
  const prev=internalAnswer(mode,q.id)||{attempts:0};
  const state={
    selected:Number(selected),
    correct:Number(selected)===Number(q.answer),
    attempts:(prev.attempts||0)+1,
    updatedAt:new Date().toISOString()
  };
  localStorage.setItem(storageKey('internal:'+mode+':'+q.id),JSON.stringify(state));
  return state;
}
function resetInternalAnswer(mode,id){localStorage.removeItem(storageKey('internal:'+mode+':'+id))}

function modeStudyStats(data,mode){
  const chapters=modeChapters(data,mode);
  const questions=modeQuestions(data,mode);
  const chapterDoneCount=chapters.filter(ch=>chapterDone(mode,ch.id)).length;
  const answered=questions.filter(q=>!!internalAnswer(mode,q.id)).length;
  const correct=questions.filter(q=>internalAnswer(mode,q.id)?.correct).length;
  return {
    chapterDone:chapterDoneCount,
    chapterTotal:chapters.length,
    answered,
    questionTotal:questions.length,
    correct,
    done:chapterDoneCount+answered,
    total:chapters.length+questions.length
  };
}
function theoryStats(){
  const data=source();
  if(!data)return {done:0,total:0,pct:0};
  const s=modeStudyStats(data,'summary');
  const c=modeStudyStats(data,'complete');
  const done=s.done+c.done,total=s.total+c.total;
  return {done,total,pct:total?Math.round(done/total*100):0,summary:s,complete:c};
}
function externalStats(){
  try{
    const rows=JSON.parse(localStorage.getItem('central-v6:module-rounds:penal:p4')||'[]');
    const valid=(Array.isArray(rows)?rows:[]).map(r=>({
      done:Math.max(0,Number(r.valid ?? r.done)||0),
      correct:Math.max(0,Number(r.correct)||0)
    })).filter(r=>r.done>0);
    const answered=valid.reduce((n,r)=>n+r.done,0);
    const correct=valid.reduce((n,r)=>n+Math.min(r.correct,r.done),0);
    return {answered,correct,rounds:valid.length,accuracy:answered?Math.round(correct/answered*100):null};
  }catch(_){
    return {answered:0,correct:0,rounds:0,accuracy:null};
  }
}
function setRing(el,pct,label){
  if(!el)return;
  const safe=Math.max(0,Math.min(100,Number(pct)||0));
  el.style.setProperty('--pct',String(safe));
  const value=el.querySelector('[data-ring-value]');
  if(value)value.textContent=label??(safe+'%');
}
function refreshModuleMetrics(){
  const module=document.querySelector(M1_SELECTOR);
  if(!module)return;
  const theory=theoryStats(),external=externalStats();

  setRing(module.querySelector('[data-native-ring="theory"]'),theory.pct,theory.pct+'%');
  const theoryDetail=module.querySelector('[data-native-metric-detail="theory"]');
  if(theoryDetail)theoryDetail.textContent=theory.done+' de '+theory.total+' pontos concluídos';

  setRing(module.querySelector('[data-native-ring="external"]'),external.accuracy??0,external.accuracy==null?'—':external.accuracy+'%');
  const extDetail=module.querySelector('[data-native-metric-detail="external"]');
  if(extDetail){
    extDetail.textContent=external.answered
      ? external.correct+' acertos em '+external.answered+' questões externas'
      : 'Nenhuma questão externa respondida';
  }
  const extMeta=module.querySelector('[data-native-metric-meta="external"]');
  if(extMeta)extMeta.textContent=external.answered
    ? external.rounds+' rodada(s) registrada(s) no final do módulo'
    : 'Registre questões externas no final do módulo';

  const headerStat=module.querySelector('.cf-module-stat');
  if(headerStat)headerStat.textContent='Cobertura '+theory.pct+'% • teoria + revisão interna';
  const legacyBar=module.querySelector('.cf-module-bar span');
  if(legacyBar)legacyBar.style.width=theory.pct+'%';
  refreshCardState();
}
function refreshCardState(){
  const data=source();if(!data)return;
  ['summary','complete'].forEach(kind=>{
    const st=modeStudyStats(data,kind);
    document.querySelectorAll(M1_SELECTOR+' [data-native-kind="'+kind+'"]').forEach(card=>{
      const tag=card.querySelector('.bc-native-material-action span:first-child');
      if(tag)tag.textContent=st.done===st.total&&st.total?'✓ Concluído':st.chapterDone+'/'+st.chapterTotal+' capítulos';
    });
  });
}

function close(){
  document.getElementById(OVERLAY_ID)?.remove();
  document.body.style.overflow='';
  current=null;
}
function buildChapterMap(){
  if(!current)return [];
  return modeChapters(source(),current.mode).map(ch=>({chapter:ch,heading:findHeadingForChapter(ch)})).filter(x=>x.heading);
}
function autoMarkViewedChapters(){
  if(!current||!current.chapterMap?.length)return;
  const sc=current.scroll;
  const viewportBottom=sc.scrollTop+sc.clientHeight;
  let changed=false;
  current.chapterMap.forEach((item,index)=>{
    if(chapterDone(current.mode,item.chapter.id))return;
    const start=item.heading.offsetTop;
    const next=current.chapterMap[index+1]?.heading?.offsetTop ?? current.article.scrollHeight;
    const target=start+Math.max(80,(next-start)*0.72);
    if(viewportBottom>=target){
      setChapterDone(current.mode,item.chapter.id,true);
      changed=true;
    }
  });
  if(changed)refreshReaderStudyUI();
}
function updateScrollProgress(){
  if(!current)return;
  const sc=current.scroll;
  const max=Math.max(1,sc.scrollHeight-sc.clientHeight);
  const pct=Math.max(0,Math.min(100,sc.scrollTop/max*100));
  const bar=current.overlay.querySelector('.bc-native-reader-progress');
  if(bar)bar.style.width=pct+'%';
  localStorage.setItem(storageKey(current.mode+':scroll'),String(sc.scrollTop));
  autoMarkViewedChapters();
}
function restoreScroll(){
  if(!current)return;
  const v=Number(localStorage.getItem(storageKey(current.mode+':scroll'))||0);
  if(v>0)current.scroll.scrollTop=v;
}
function setFont(delta){
  if(!current)return;
  current.font=Math.max(14,Math.min(21,current.font+delta));
  current.article.style.fontSize=current.font+'px';
  localStorage.setItem(storageKey('font'),String(current.font));
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
      frag.append(raw.slice(pos,idx));
      const mk=document.createElement('mark');mk.className='bc-native-search-hit';mk.textContent=raw.slice(idx,idx+term.length);frag.append(mk);
      n++;pos=idx+term.length;
    }
    frag.append(raw.slice(pos));node.replaceWith(frag);
  }
  root.querySelector('mark.bc-native-search-hit')?.scrollIntoView({block:'center'});
  return n;
}
function findHeadingForChapter(chapter){
  if(!current)return null;
  const target=normKey(chapter.title).replace(/^\d+\s+/,'');
  const words=target.split(' ').filter(w=>w.length>3);
  const headings=Array.from(current.article.querySelectorAll('h2,h3'));
  let best=null,bestScore=0;
  for(const h of headings){
    const hk=normKey(h.textContent);
    let score=0;
    words.forEach(w=>{if(hk.includes(w))score++});
    if(score>bestScore){bestScore=score;best=h}
  }
  return bestScore>=Math.max(1,Math.min(2,words.length))?best:null;
}
function refreshReaderStudyUI(){
  if(!current)return;
  const data=source(),st=modeStudyStats(data,current.mode);
  const value=current.overlay.querySelector('[data-reader-study-value]');
  const bar=current.overlay.querySelector('[data-reader-study-bar]');
  const qscore=current.overlay.querySelector('[data-reader-internal-score]');
  if(value)value.textContent=st.done+' / '+st.total+' pontos';
  if(bar)bar.style.width=(st.total?Math.round(st.done/st.total*100):0)+'%';
  if(qscore)qscore.textContent=st.answered
    ? st.correct+' acertos em '+st.answered+' respondidas'
    : 'Nenhuma questão interna respondida';

  current.overlay.querySelectorAll('[data-chapter-check]').forEach(btn=>{
    const done=chapterDone(current.mode,btn.dataset.chapterCheck);
    btn.classList.toggle('done',done);
    btn.setAttribute('aria-pressed',String(done));
    btn.textContent=done?'✓':'';
  });
  refreshModuleMetrics();
}
function chapterTocHtml(data,mode){
  return modeChapters(data,mode).map((ch,i)=>{
    const done=chapterDone(mode,ch.id);
    return '<div class="bc-native-toc-row">'+
      '<button type="button" class="bc-native-chapter-check '+(done?'done':'')+'" data-chapter-check="'+esc(ch.id)+'" aria-pressed="'+done+'" title="Marcar capítulo">'+(done?'✓':'')+'</button>'+
      '<button type="button" class="bc-native-chapter-jump" data-chapter-jump="'+esc(ch.id)+'"><span>'+(i+1)+'.</span>'+esc(ch.title)+'</button>'+
    '</div>';
  }).join('');
}
function quizHtml(data,mode){
  const qs=modeQuestions(data,mode);
  if(!qs.length)return '';
  const cards=qs.map((q,i)=>{
    const a=internalAnswer(mode,q.id);
    const options=q.options.map((op,idx)=>{
      let cls='';
      if(a){
        if(idx===q.answer)cls+=' correct';
        if(idx===a.selected&&idx!==q.answer)cls+=' wrong';
      }
      return '<button type="button" class="bc-native-quiz-option'+cls+'" data-internal-q="'+esc(q.id)+'" data-option="'+idx+'" '+(a?'disabled':'')+'><span>'+String.fromCharCode(65+idx)+'</span>'+esc(op)+'</button>';
    }).join('');
    return '<article class="bc-native-quiz-card" data-quiz-card="'+esc(q.id)+'">'+
      '<div class="bc-native-quiz-number">Questão '+(i+1)+' de '+qs.length+'</div>'+
      '<h3>'+esc(q.q)+'</h3>'+
      '<div class="bc-native-quiz-options">'+options+'</div>'+
      '<div class="bc-native-quiz-feedback '+(a?(a.correct?'ok':'bad'):'')+'" data-quiz-feedback>'+
        (a?'<b>'+(a.correct?'✓ Correto':'✕ Incorreto')+'</b><span>'+esc(q.explanation)+'</span><button type="button" data-internal-retry="'+esc(q.id)+'">Refazer</button>':'<span>Escolha uma alternativa para receber o feedback.</span>')+
      '</div>'+
    '</article>';
  }).join('');
  return '<section class="bc-native-internal-review">'+
    '<div class="bc-native-internal-review-head"><div><span class="bc-native-kicker">REVISÃO ATIVA INTERNA</span><h2>'+qs.length+' questões de assimilação</h2><p>Estas questões contam na <b>cobertura da teoria</b>. Elas não entram no gráfico de questões externas.</p></div><div class="bc-native-internal-score" data-reader-internal-score></div></div>'+
    cards+
  '</section>';
}
function bindQuiz(){
  if(!current)return;
  const data=source();
  current.overlay.querySelectorAll('[data-internal-q]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const q=modeQuestions(data,current.mode).find(x=>x.id===btn.dataset.internalQ);
      if(!q)return;
      saveInternalAnswer(current.mode,q,Number(btn.dataset.option));
      rerenderQuizCard(q.id);
      refreshReaderStudyUI();
    });
  });
  current.overlay.querySelectorAll('[data-internal-retry]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      resetInternalAnswer(current.mode,btn.dataset.internalRetry);
      rerenderQuizCard(btn.dataset.internalRetry);
      refreshReaderStudyUI();
    });
  });
}
function rerenderQuizCard(id){
  if(!current)return;
  const data=source(),q=modeQuestions(data,current.mode).find(x=>x.id===id);
  const old=current.overlay.querySelector('[data-quiz-card="'+CSS.escape(id)+'"]');
  if(!q||!old)return;
  const i=modeQuestions(data,current.mode).findIndex(x=>x.id===id);
  const a=internalAnswer(current.mode,id);
  const options=q.options.map((op,idx)=>{
    let cls='';
    if(a){
      if(idx===q.answer)cls+=' correct';
      if(idx===a.selected&&idx!==q.answer)cls+=' wrong';
    }
    return '<button type="button" class="bc-native-quiz-option'+cls+'" data-internal-q="'+esc(q.id)+'" data-option="'+idx+'" '+(a?'disabled':'')+'><span>'+String.fromCharCode(65+idx)+'</span>'+esc(op)+'</button>';
  }).join('');
  old.innerHTML='<div class="bc-native-quiz-number">Questão '+(i+1)+' de '+modeQuestions(data,current.mode).length+'</div>'+
    '<h3>'+esc(q.q)+'</h3><div class="bc-native-quiz-options">'+options+'</div>'+
    '<div class="bc-native-quiz-feedback '+(a?(a.correct?'ok':'bad'):'')+'" data-quiz-feedback>'+
      (a?'<b>'+(a.correct?'✓ Correto':'✕ Incorreto')+'</b><span>'+esc(q.explanation)+'</span><button type="button" data-internal-retry="'+esc(q.id)+'">Refazer</button>':'<span>Escolha uma alternativa para receber o feedback.</span>')+
    '</div>';
  bindQuiz();
}
function open(mode){
  const data=source();if(!data){alert('Conteúdo nativo do M01 ainda não foi carregado.');return}
  close();
  const parsed=buildHtml(data,mode);
  const label=mode==='summary'?'Conteúdo resumido':'Conteúdo completo';
  const chapters=modeChapters(data,mode),questions=modeQuestions(data,mode);
  const ov=document.createElement('div');
  ov.id=OVERLAY_ID;ov.className='bc-native-reader-overlay';
  ov.innerHTML='<section class="bc-native-reader" role="dialog" aria-modal="true" aria-label="'+esc(label)+'">'+
    '<header class="bc-native-reader-head"><div class="bc-native-reader-title"><b>PEN M04 — '+esc(data.title)+'</b><small>'+label+' • experiência nativa da Base Completa</small></div><span class="bc-native-reader-meta">'+parsed.words.toLocaleString('pt-BR')+' palavras • ~'+parsed.mins+' min</span><button class="bc-native-reader-close" data-native-action="close" aria-label="Fechar">×</button><div class="bc-native-reader-progress-track"><div class="bc-native-reader-progress"></div></div></header>'+
    '<div class="bc-native-reader-tools"><input type="search" placeholder="Buscar neste material…" aria-label="Buscar"><button data-native-action="smaller">A−</button><button data-native-action="larger">A+</button><button class="primary" data-native-action="top">Ir ao topo</button></div>'+
    '<div class="bc-native-reader-body">'+
      '<nav class="bc-native-toc"><div class="bc-native-toc-label">Capítulos para concluir</div>'+chapterTocHtml(data,mode)+'</nav>'+
      '<main class="bc-native-scroll"><article class="bc-native-article">'+
        '<div class="bc-native-kicker">'+(mode==='summary'?'PRIMEIRA LEITURA + REVISÃO':'TEORIA INTEGRAL')+'</div>'+
        '<h1>'+esc(data.title)+'</h1>'+
        '<p class="lead">'+(mode==='summary'?'Versão condensada para compreender o módulo e revisar os pontos de maior rendimento.':'Conteúdo integral convertido para leitura nativa, sem leitor de PDF.')+'</p>'+
        '<section class="bc-native-study-progress"><div><b>Progresso neste material</b><span data-reader-study-value>0 / '+(chapters.length+questions.length)+' pontos</span></div><div class="bc-native-study-progress-track"><span data-reader-study-bar></span></div><small>'+chapters.length+' capítulos + '+questions.length+' questões internas. Os capítulos recebem check automaticamente conforme você avança; as questões internas também entram na cobertura da teoria.</small></section>'+
        parsed.body+
        quizHtml(data,mode)+
      '</article></main>'+
    '</div></section>';
  document.body.appendChild(ov);document.body.style.overflow='hidden';

  current={
    mode,overlay:ov,scroll:ov.querySelector('.bc-native-scroll'),article:ov.querySelector('.bc-native-article'),
    font:Number(localStorage.getItem(storageKey('font'))||16),chapterMap:[]
  };
  current.article.style.fontSize=current.font+'px';
  current.scroll.addEventListener('scroll',updateScrollProgress,{passive:true});
  ov.querySelector('[data-native-action="close"]').onclick=close;
  ov.querySelector('[data-native-action="smaller"]').onclick=()=>setFont(-1);
  ov.querySelector('[data-native-action="larger"]').onclick=()=>setFont(1);
  ov.querySelector('[data-native-action="top"]').onclick=()=>current.scroll.scrollTo({top:0,behavior:'smooth'});
  ov.querySelector('.bc-native-reader-tools input').addEventListener('input',e=>search(e.target.value));

  ov.querySelectorAll('[data-chapter-check]').forEach(btn=>{
    btn.onclick=()=>{
      const id=btn.dataset.chapterCheck;
      setChapterDone(mode,id,!chapterDone(mode,id));
      refreshReaderStudyUI();
    };
  });
  ov.querySelectorAll('[data-chapter-jump]').forEach(btn=>{
    btn.onclick=()=>{
      const ch=modeChapters(data,mode).find(x=>x.id===btn.dataset.chapterJump);
      findHeadingForChapter(ch)?.scrollIntoView({behavior:'smooth',block:'start'});
    };
  });

  bindQuiz();
  ov.addEventListener('click',e=>{if(e.target===ov)close()});
  requestAnimationFrame(()=>{
    current.chapterMap=buildChapterMap();
    restoreScroll();updateScrollProgress();refreshReaderStudyUI();autoMarkViewedChapters();
  });
}
function openMap(){
  if(global.BaseMindMap?.open)global.BaseMindMap.open('penal','p4');
  else alert('O mapa mental interativo ainda está carregando. Tente novamente em alguns segundos.');
}
function removeLegacyM01Content(){
  const module=document.querySelector(M1_SELECTOR);
  if(!module)return;
  module.querySelectorAll('.bc-session-nav,.bc-session-pager').forEach(el=>el.remove());
}
function inject(){
  const module=document.querySelector(M1_SELECTOR);if(!module)return;
  removeLegacyM01Content();
  const body=module.querySelector('.cf-module-body');if(!body)return;

  // Fallback: a renderização principal já entrega os cards diretamente.
  if(!body.querySelector('.bc-native-materials')){
    const host=document.createElement('section');host.className='bc-native-materials';
    host.innerHTML='<div class="bc-native-materials-head"><div><b>Materiais do módulo</b><small>Escolha como estudar</small></div><small>Piloto M04 • conteúdo nativo</small></div>'+
      '<div class="bc-native-material-grid">'+
        '<button class="bc-native-material-card" data-native-kind="summary"><span class="bc-native-material-icon">⚡</span><span><strong>Conteúdo resumido</strong><small>Primeira leitura, revisão rápida, artigos, pegadinhas e revisão ativa.</small></span><span class="bc-native-material-action"><span>Abrir</span><span>→</span></span></button>'+
        '<button class="bc-native-material-card" data-native-kind="complete"><span class="bc-native-material-icon">📚</span><span><strong>Conteúdo completo</strong><small>Teoria integral do M04 em formato de site, com índice, busca e progresso de leitura.</small></span><span class="bc-native-material-action"><span>Abrir</span><span>→</span></span></button>'+
        '<button class="bc-native-material-card" data-native-kind="mindmap"><span class="bc-native-material-icon">🧠</span><span><strong>Mapa mental</strong><small>Mapa interativo com abrir/recolher ramos, zoom, arrastar e tela cheia.</small></span><span class="bc-native-material-action"><span>Abrir</span><span>→</span></span></button>'+
      '</div>';
    host.querySelector('[data-native-kind="summary"]').onclick=()=>open('summary');
    host.querySelector('[data-native-kind="complete"]').onclick=()=>open('complete');
    host.querySelector('[data-native-kind="mindmap"]').onclick=openMap;
    const subtitle=body.querySelector('.cf-subtitle');
    if(subtitle)subtitle.insertAdjacentElement('afterend',host);else body.insertAdjacentElement('afterbegin',host);
  }
  refreshModuleMetrics();
}
function install(){
  inject();
  observer=new MutationObserver(()=>{
    clearTimeout(install._t);
    install._t=setTimeout(()=>{removeLegacyM01Content();inject();refreshModuleMetrics()},60);
  });
  observer.observe(document.documentElement,{subtree:true,childList:true});
  global.addEventListener('focus',refreshModuleMetrics);
}
global.BaseNativeReaderM04={
  open,close,refreshMetrics:refreshModuleMetrics,theoryStats,externalStats,
  version:'2026.10.02-m04-pilot1'
};
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.getElementById(OVERLAY_ID))close()});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})(window);

/* M04 corrected reader override */
(function(global){
'use strict';

const OVERLAY_ID='bcNativeReaderOverlayM04';
const M1_SELECTOR='#subjects .subject[data-id="penal"] .cf-module[data-cf="p4"]';
const STORAGE_PREFIX='central-v6:native-reader:penal:p4';
let current=null;
let observer=null;

function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function norm(s){return String(s||'').replace(/\u00a0/g,' ').replace(/[ \t]+/g,' ').trim()}
function normKey(s){return norm(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
function slug(s){return normKey(s).replace(/\s+/g,'-').slice(0,70)}
function source(){return global.BASE_NATIVE_CONTENT?.penal?.m04||null}
function storageKey(part){return STORAGE_PREFIX+':'+part}

function cleanLines(raw,mode){
  const lines=String(raw||'').replace(/\r/g,'').split('\n').map(norm);
  const out=[];
  let skipOldSummaryReview=false;
  for(let line of lines){
    if(mode==='summary' && /^9\.\s*REVIS(?:A|Ã)O ATIVA/i.test(line)){skipOldSummaryReview=true;continue}
    if(skipOldSummaryReview)continue;
    if(!line){out.push('');continue}
    if(/^BASE COMPLETA(?:\s*[|•-]|$)/i.test(line))continue;
    if(/^D\s*IRE\s*ITO PENAL\s*•\s*M0?1$/i.test(line))continue;
    if(/^\d+\s*\/\s*\d+$/.test(line))continue;
    if(/^P[aá]gina\s+\d+$/i.test(line))continue;
    if(/^Conteudo restrito ao PEN M1/i.test(line))continue;
    out.push(line);
  }
  return out;
}
function headingInfo(line){
  const l=norm(line);
  if(!l)return null;
  let m=l.match(/^(\d+)\.(\d+)\s+(.{3,140})$/);
  if(m)return {level:3,text:l};
  m=l.match(/^(\d+)\.?\s+(.{3,140})$/);
  if(m && !/^\d+\s*\/\s*\d+/.test(l) && !/^\d+\s+(Quais|Qual|A |O |Como |Quando |Pequeno|Pessoalidade|Na )/i.test(l)){
    return {level:2,text:l};
  }
  if(/^(VISÃO GERAL|VISAO GERAL|REVISÃO ATIVA|REVISAO ATIVA|ARTIGOS PARA DECORAR|PEGADINHAS DE PROVA|MAPA DO MÓDULO|MAPA DO MODULO|TEORIA ESSENCIAL)$/i.test(l)){
    return {level:2,text:l};
  }
  return null;
}
function calloutType(line){
  const l=norm(line).toUpperCase();
  if(/^(✅\s*)?EXEMPLO/.test(l))return ['example','Exemplo'];
  if(/PEGADINHA/.test(l))return ['trap','Pegadinha'];
  if(/^(⚖️\s*)?LEI SECA/.test(l))return ['law','Lei seca'];
  if(/^(DECORE|MEMÓRIA|MEMORIA|MNEMÔNICO|MNEMONICO|REGRA DE OURO|IDEIA-CENTRAL|IDEIA CENTRAL|FÓRMULA|FORMULA|MEMORIZACAO RAPIDA)/.test(l))return ['memory',norm(line)];
  if(/^(STF|STJ|JURISPRUDÊNCIA|JURISPRUDENCIA|ATUALIZAÇÃO|ATUALIZACAO)/.test(l))return ['case',norm(line)];
  if(/^(COMPARAÇÃO|COMPARACAO|ATENÇÃO|ATENCAO|PROVA|CUIDADO|FRONTEIRA DO MÓDULO|FRONTEIRA DO MODULO)/.test(l))return ['case',norm(line)];
  return null;
}
function isBullet(line){return /^[•●▪◦*-]\s+/.test(line)}
function looksTitle(line){
  const l=norm(line);
  if(l.length<3||l.length>105)return false;
  if(/[.!?]$/.test(l))return false;
  if(/^[A-ZÁÉÍÓÚÂÊÔÃÕÇ0-9][A-ZÁÉÍÓÚÂÊÔÃÕÇ0-9\s:–—()/%ºª,.-]+$/.test(l)&&l.split(/\s+/).length<=12)return true;
  return false;
}
function parse(raw,mode){
  const lines=cleanLines(raw,mode);
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
        if(!next){if(body.length)break;else continue}
        if(headingInfo(next)||calloutType(next)||looksTitle(next))break;
        body.push(next);i=j;
      }
      blocks.push({type:'callout',kind:co[0],label:co[1],text:body.join(' ')});
      continue;
    }
    if(isBullet(line)){
      flush();
      const items=[line.replace(/^[•●▪◦*-]\s+/,'')];
      while(i+1<lines.length&&isBullet(lines[i+1]))items.push(lines[++i].replace(/^[•●▪◦*-]\s+/,''));
      blocks.push({type:'ul',items});
      continue;
    }
    if(looksTitle(line)&&mode==='summary'){flush();blocks.push({type:'h',level:3,text:line});continue}
    para.push(line);
  }
  flush();
  const firstH=blocks.findIndex(b=>b.type==='h');
  if(firstH>2){
    const lead=blocks.slice(0,firstH).filter(b=>b.type==='p').map(b=>b.text).join(' ');
    blocks.splice(0,firstH,{type:'lead',text:lead});
  }
  return blocks;
}
function buildHtml(data,mode){
  if(mode==='complete'){
    const host=document.createElement('div');
    host.innerHTML=global.PENAL_FULL_THEORY?.p4?.html||'';
    host.querySelector('header.pen-cover')?.remove();
    host.querySelector('nav.pen-toc')?.remove();
    
    host.querySelector('#pen-m04-revisao')?.remove();

    const headings=[];
    host.querySelectorAll('section.pen-section').forEach((section,index)=>{
      const h=section.querySelector('h2');
      if(!h)return;
      if(!h.id)h.id='bcsec-complete-'+(index+1)+'-'+slug(h.textContent);
      headings.push({id:h.id,text:norm(h.textContent),level:2,key:normKey(h.textContent)});
    });

    // Normalize native M4 blocks to the reader's component vocabulary.
    host.querySelectorAll('.pen-box').forEach(el=>el.classList.add('bc-native-callout'));
    host.querySelectorAll('.table-wrap').forEach(el=>el.classList.add('bc-native-table-wrap'));
    const text=norm(host.textContent);
    const words=text.split(/\s+/).filter(Boolean).length;
    const mins=Math.max(1,Math.round(words/190));
    return {body:host.innerHTML,headings,words,mins};
  }

  const raw=mode==='summary'?data.summary:data.complete;
  const blocks=parse(raw,mode);
  const headings=[];
  let hCount=0;
  const body=blocks.map(b=>{
    if(b.type==='h'){
      const id='bcsec-'+(++hCount)+'-'+slug(b.text);
      headings.push({id,text:b.text,level:b.level,key:normKey(b.text)});
      return '<h'+b.level+' id="'+id+'">'+esc(b.text)+'</h'+b.level+'>';
    }
    if(b.type==='lead')return '<p class="lead">'+esc(b.text)+'</p>';
    if(b.type==='p')return '<p>'+esc(b.text)+'</p>';
    if(b.type==='ul')return '<ul>'+b.items.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>';
    if(b.type==='callout')return '<aside class="bc-native-callout '+b.kind+'"><b>'+esc(b.label)+'</b><div>'+esc(b.text)+'</div></aside>';
    return '';
  }).join('');
  const words=norm(raw).split(/\s+/).filter(Boolean).length;
  const mins=Math.max(1,Math.round(words/(mode==='summary'?220:190)));
  return {body,headings,words,mins};
}
function modeChapters(data,mode){return Array.isArray(data?.chapters?.[mode])?data.chapters[mode]:[]}
function modeQuestions(data,mode){return Array.isArray(data?.internalQuestions?.[mode])?data.internalQuestions[mode]:[]}
function chapterDone(mode,id){return localStorage.getItem(storageKey('chapter:'+mode+':'+id))==='1'}
function setChapterDone(mode,id,done){
  localStorage.setItem(storageKey('chapter:'+mode+':'+id),done?'1':'0');
}
function internalAnswer(mode,id){
  try{return JSON.parse(localStorage.getItem(storageKey('internal:'+mode+':'+id))||'null')}catch(_){return null}
}
function saveInternalAnswer(mode,q,selected){
  const prev=internalAnswer(mode,q.id)||{attempts:0};
  const state={
    selected:Number(selected),
    correct:Number(selected)===Number(q.answer),
    attempts:(prev.attempts||0)+1,
    updatedAt:new Date().toISOString()
  };
  localStorage.setItem(storageKey('internal:'+mode+':'+q.id),JSON.stringify(state));
  return state;
}
function resetInternalAnswer(mode,id){localStorage.removeItem(storageKey('internal:'+mode+':'+id))}

function modeStudyStats(data,mode){
  const chapters=modeChapters(data,mode);
  const questions=modeQuestions(data,mode);
  const chapterDoneCount=chapters.filter(ch=>chapterDone(mode,ch.id)).length;
  const answered=questions.filter(q=>!!internalAnswer(mode,q.id)).length;
  const correct=questions.filter(q=>internalAnswer(mode,q.id)?.correct).length;
  return {
    chapterDone:chapterDoneCount,
    chapterTotal:chapters.length,
    answered,
    questionTotal:questions.length,
    correct,
    done:chapterDoneCount+answered,
    total:chapters.length+questions.length
  };
}
function theoryStats(){
  const data=source();
  if(!data)return {done:0,total:0,pct:0};
  const s=modeStudyStats(data,'summary');
  const c=modeStudyStats(data,'complete');
  const done=s.done+c.done,total=s.total+c.total;
  return {done,total,pct:total?Math.round(done/total*100):0,summary:s,complete:c};
}
function externalStats(){
  try{
    const rows=JSON.parse(localStorage.getItem('central-v6:module-rounds:penal:p4')||'[]');
    const valid=(Array.isArray(rows)?rows:[]).map(r=>({
      done:Math.max(0,Number(r.valid ?? r.done)||0),
      correct:Math.max(0,Number(r.correct)||0)
    })).filter(r=>r.done>0);
    const answered=valid.reduce((n,r)=>n+r.done,0);
    const correct=valid.reduce((n,r)=>n+Math.min(r.correct,r.done),0);
    return {answered,correct,rounds:valid.length,accuracy:answered?Math.round(correct/answered*100):null};
  }catch(_){
    return {answered:0,correct:0,rounds:0,accuracy:null};
  }
}
function setRing(el,pct,label){
  if(!el)return;
  const safe=Math.max(0,Math.min(100,Number(pct)||0));
  el.style.setProperty('--pct',String(safe));
  const value=el.querySelector('[data-ring-value]');
  if(value)value.textContent=label??(safe+'%');
}
function refreshModuleMetrics(){
  const module=document.querySelector(M1_SELECTOR);
  if(!module)return;
  const theory=theoryStats(),external=externalStats();

  setRing(module.querySelector('[data-native-ring="theory"]'),theory.pct,theory.pct+'%');
  const theoryDetail=module.querySelector('[data-native-metric-detail="theory"]');
  if(theoryDetail)theoryDetail.textContent=theory.done+' de '+theory.total+' pontos concluídos';

  setRing(module.querySelector('[data-native-ring="external"]'),external.accuracy??0,external.accuracy==null?'—':external.accuracy+'%');
  const extDetail=module.querySelector('[data-native-metric-detail="external"]');
  if(extDetail){
    extDetail.textContent=external.answered
      ? external.correct+' acertos em '+external.answered+' questões externas'
      : 'Nenhuma questão externa respondida';
  }
  const extMeta=module.querySelector('[data-native-metric-meta="external"]');
  if(extMeta)extMeta.textContent=external.answered
    ? external.rounds+' rodada(s) registrada(s) no final do módulo'
    : 'Registre questões externas no final do módulo';

  const headerStat=module.querySelector('.cf-module-stat');
  if(headerStat)headerStat.textContent='Cobertura '+theory.pct+'% • teoria + revisão interna';
  const legacyBar=module.querySelector('.cf-module-bar span');
  if(legacyBar)legacyBar.style.width=theory.pct+'%';
  refreshCardState();
}
function refreshCardState(){
  const data=source();if(!data)return;
  ['summary','complete'].forEach(kind=>{
    const st=modeStudyStats(data,kind);
    document.querySelectorAll(M1_SELECTOR+' [data-native-kind="'+kind+'"]').forEach(card=>{
      const tag=card.querySelector('.bc-native-material-action span:first-child');
      if(tag)tag.textContent=st.done===st.total&&st.total?'✓ Concluído':st.chapterDone+'/'+st.chapterTotal+' capítulos';
    });
  });
}

function close(){
  document.getElementById(OVERLAY_ID)?.remove();
  document.body.style.overflow='';
  current=null;
}
function buildChapterMap(){
  if(!current)return [];
  return modeChapters(source(),current.mode).map(ch=>({chapter:ch,heading:findHeadingForChapter(ch)})).filter(x=>x.heading);
}
function autoMarkViewedChapters(){
  if(!current||!current.chapterMap?.length)return;
  const sc=current.scroll;
  const viewportBottom=sc.scrollTop+sc.clientHeight;
  let changed=false;
  current.chapterMap.forEach((item,index)=>{
    if(chapterDone(current.mode,item.chapter.id))return;
    const start=item.heading.offsetTop;
    const next=current.chapterMap[index+1]?.heading?.offsetTop ?? current.article.scrollHeight;
    const target=start+Math.max(80,(next-start)*0.72);
    if(viewportBottom>=target){
      setChapterDone(current.mode,item.chapter.id,true);
      changed=true;
    }
  });
  if(changed)refreshReaderStudyUI();
}
function updateScrollProgress(){
  if(!current)return;
  const sc=current.scroll;
  const max=Math.max(1,sc.scrollHeight-sc.clientHeight);
  const pct=Math.max(0,Math.min(100,sc.scrollTop/max*100));
  const bar=current.overlay.querySelector('.bc-native-reader-progress');
  if(bar)bar.style.width=pct+'%';
  localStorage.setItem(storageKey(current.mode+':scroll'),String(sc.scrollTop));
  autoMarkViewedChapters();
}
function restoreScroll(){
  if(!current)return;
  const v=Number(localStorage.getItem(storageKey(current.mode+':scroll'))||0);
  if(v>0)current.scroll.scrollTop=v;
}
function setFont(delta){
  if(!current)return;
  current.font=Math.max(14,Math.min(21,current.font+delta));
  current.article.style.fontSize=current.font+'px';
  localStorage.setItem(storageKey('font'),String(current.font));
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
      frag.append(raw.slice(pos,idx));
      const mk=document.createElement('mark');mk.className='bc-native-search-hit';mk.textContent=raw.slice(idx,idx+term.length);frag.append(mk);
      n++;pos=idx+term.length;
    }
    frag.append(raw.slice(pos));node.replaceWith(frag);
  }
  root.querySelector('mark.bc-native-search-hit')?.scrollIntoView({block:'center'});
  return n;
}
function findHeadingForChapter(chapter){
  if(!current)return null;
  const target=normKey(chapter.title).replace(/^\d+\s+/,'');
  const words=target.split(' ').filter(w=>w.length>3);
  const headings=Array.from(current.article.querySelectorAll('h2,h3'));
  let best=null,bestScore=0;
  for(const h of headings){
    const hk=normKey(h.textContent);
    let score=0;
    words.forEach(w=>{if(hk.includes(w))score++});
    if(score>bestScore){bestScore=score;best=h}
  }
  return bestScore>=Math.max(1,Math.min(2,words.length))?best:null;
}
function refreshReaderStudyUI(){
  if(!current)return;
  const data=source(),st=modeStudyStats(data,current.mode);
  const value=current.overlay.querySelector('[data-reader-study-value]');
  const bar=current.overlay.querySelector('[data-reader-study-bar]');
  const qscore=current.overlay.querySelector('[data-reader-internal-score]');
  if(value)value.textContent=st.done+' / '+st.total+' pontos';
  if(bar)bar.style.width=(st.total?Math.round(st.done/st.total*100):0)+'%';
  if(qscore)qscore.textContent=st.answered
    ? st.correct+' acertos em '+st.answered+' respondidas'
    : 'Nenhuma questão interna respondida';

  current.overlay.querySelectorAll('[data-chapter-check]').forEach(btn=>{
    const done=chapterDone(current.mode,btn.dataset.chapterCheck);
    btn.classList.toggle('done',done);
    btn.setAttribute('aria-pressed',String(done));
    btn.textContent=done?'✓':'';
  });
  refreshModuleMetrics();
}
function chapterTocHtml(data,mode){
  return modeChapters(data,mode).map((ch,i)=>{
    const done=chapterDone(mode,ch.id);
    return '<div class="bc-native-toc-row">'+
      '<button type="button" class="bc-native-chapter-check '+(done?'done':'')+'" data-chapter-check="'+esc(ch.id)+'" aria-pressed="'+done+'" title="Marcar capítulo">'+(done?'✓':'')+'</button>'+
      '<button type="button" class="bc-native-chapter-jump" data-chapter-jump="'+esc(ch.id)+'"><span>'+(i+1)+'.</span>'+esc(ch.title)+'</button>'+
    '</div>';
  }).join('');
}
function quizHtml(data,mode){
  const qs=modeQuestions(data,mode);
  if(!qs.length)return '';
  const cards=qs.map((q,i)=>{
    const a=internalAnswer(mode,q.id);
    const options=q.options.map((op,idx)=>{
      let cls='';
      if(a){
        if(idx===q.answer)cls+=' correct';
        if(idx===a.selected&&idx!==q.answer)cls+=' wrong';
      }
      return '<button type="button" class="bc-native-quiz-option'+cls+'" data-internal-q="'+esc(q.id)+'" data-option="'+idx+'" '+(a?'disabled':'')+'><span>'+String.fromCharCode(65+idx)+'</span>'+esc(op)+'</button>';
    }).join('');
    return '<article class="bc-native-quiz-card" data-quiz-card="'+esc(q.id)+'">'+
      '<div class="bc-native-quiz-number">Questão '+(i+1)+' de '+qs.length+'</div>'+
      '<h3>'+esc(q.q)+'</h3>'+
      '<div class="bc-native-quiz-options">'+options+'</div>'+
      '<div class="bc-native-quiz-feedback '+(a?(a.correct?'ok':'bad'):'')+'" data-quiz-feedback>'+
        (a?'<b>'+(a.correct?'✓ Correto':'✕ Incorreto')+'</b><span>'+esc(q.explanation)+'</span><button type="button" data-internal-retry="'+esc(q.id)+'">Refazer</button>':'<span>Escolha uma alternativa para receber o feedback.</span>')+
      '</div>'+
    '</article>';
  }).join('');
  return '<section class="bc-native-internal-review">'+
    '<div class="bc-native-internal-review-head"><div><span class="bc-native-kicker">REVISÃO ATIVA INTERNA</span><h2>'+qs.length+' questões de assimilação</h2><p>Estas questões contam na <b>cobertura da teoria</b>. Elas não entram no gráfico de questões externas.</p></div><div class="bc-native-internal-score" data-reader-internal-score></div></div>'+
    cards+
  '</section>';
}
function bindQuiz(){
  if(!current)return;
  const data=source();
  current.overlay.querySelectorAll('[data-internal-q]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const q=modeQuestions(data,current.mode).find(x=>x.id===btn.dataset.internalQ);
      if(!q)return;
      saveInternalAnswer(current.mode,q,Number(btn.dataset.option));
      rerenderQuizCard(q.id);
      refreshReaderStudyUI();
    });
  });
  current.overlay.querySelectorAll('[data-internal-retry]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      resetInternalAnswer(current.mode,btn.dataset.internalRetry);
      rerenderQuizCard(btn.dataset.internalRetry);
      refreshReaderStudyUI();
    });
  });
}
function rerenderQuizCard(id){
  if(!current)return;
  const data=source(),q=modeQuestions(data,current.mode).find(x=>x.id===id);
  const old=current.overlay.querySelector('[data-quiz-card="'+CSS.escape(id)+'"]');
  if(!q||!old)return;
  const i=modeQuestions(data,current.mode).findIndex(x=>x.id===id);
  const a=internalAnswer(current.mode,id);
  const options=q.options.map((op,idx)=>{
    let cls='';
    if(a){
      if(idx===q.answer)cls+=' correct';
      if(idx===a.selected&&idx!==q.answer)cls+=' wrong';
    }
    return '<button type="button" class="bc-native-quiz-option'+cls+'" data-internal-q="'+esc(q.id)+'" data-option="'+idx+'" '+(a?'disabled':'')+'><span>'+String.fromCharCode(65+idx)+'</span>'+esc(op)+'</button>';
  }).join('');
  old.innerHTML='<div class="bc-native-quiz-number">Questão '+(i+1)+' de '+modeQuestions(data,current.mode).length+'</div>'+
    '<h3>'+esc(q.q)+'</h3><div class="bc-native-quiz-options">'+options+'</div>'+
    '<div class="bc-native-quiz-feedback '+(a?(a.correct?'ok':'bad'):'')+'" data-quiz-feedback>'+
      (a?'<b>'+(a.correct?'✓ Correto':'✕ Incorreto')+'</b><span>'+esc(q.explanation)+'</span><button type="button" data-internal-retry="'+esc(q.id)+'">Refazer</button>':'<span>Escolha uma alternativa para receber o feedback.</span>')+
    '</div>';
  bindQuiz();
}
function open(mode){
  const data=source();if(!data){alert('Conteúdo nativo do M01 ainda não foi carregado.');return}
  close();
  const parsed=buildHtml(data,mode);
  const label=mode==='summary'?'Conteúdo resumido':'Conteúdo completo';
  const chapters=modeChapters(data,mode),questions=modeQuestions(data,mode);
  const ov=document.createElement('div');
  ov.id=OVERLAY_ID;ov.className='bc-native-reader-overlay';
  ov.innerHTML='<section class="bc-native-reader" role="dialog" aria-modal="true" aria-label="'+esc(label)+'">'+
    '<header class="bc-native-reader-head"><div class="bc-native-reader-title"><b>PEN M04 — '+esc(data.title)+'</b><small>'+label+' • experiência nativa da Base Completa</small></div><span class="bc-native-reader-meta">'+parsed.words.toLocaleString('pt-BR')+' palavras • ~'+parsed.mins+' min</span><button class="bc-native-reader-close" data-native-action="close" aria-label="Fechar">×</button><div class="bc-native-reader-progress-track"><div class="bc-native-reader-progress"></div></div></header>'+
    '<div class="bc-native-reader-tools"><input type="search" placeholder="Buscar neste material…" aria-label="Buscar"><button data-native-action="smaller">A−</button><button data-native-action="larger">A+</button><button class="primary" data-native-action="top">Ir ao topo</button></div>'+
    '<div class="bc-native-reader-body">'+
      '<nav class="bc-native-toc"><div class="bc-native-toc-label">Capítulos para concluir</div>'+chapterTocHtml(data,mode)+'</nav>'+
      '<main class="bc-native-scroll"><article class="bc-native-article">'+
        '<div class="bc-native-kicker">'+(mode==='summary'?'PRIMEIRA LEITURA + REVISÃO':'TEORIA INTEGRAL')+'</div>'+
        '<h1>'+esc(data.title)+'</h1>'+
        '<p class="lead">'+(mode==='summary'?'Versão condensada para compreender o módulo e revisar os pontos de maior rendimento.':'Conteúdo integral convertido para leitura nativa, sem leitor de PDF.')+'</p>'+
        '<section class="bc-native-study-progress"><div><b>Progresso neste material</b><span data-reader-study-value>0 / '+(chapters.length+questions.length)+' pontos</span></div><div class="bc-native-study-progress-track"><span data-reader-study-bar></span></div><small>'+chapters.length+' capítulos + '+questions.length+' questões internas. Os capítulos recebem check automaticamente conforme você avança; as questões internas também entram na cobertura da teoria.</small></section>'+
        parsed.body+
        quizHtml(data,mode)+
      '</article></main>'+
    '</div></section>';
  document.body.appendChild(ov);document.body.style.overflow='hidden';

  current={
    mode,overlay:ov,scroll:ov.querySelector('.bc-native-scroll'),article:ov.querySelector('.bc-native-article'),
    font:Number(localStorage.getItem(storageKey('font'))||16),chapterMap:[]
  };
  current.article.style.fontSize=current.font+'px';
  current.scroll.addEventListener('scroll',updateScrollProgress,{passive:true});
  ov.querySelector('[data-native-action="close"]').onclick=close;
  ov.querySelector('[data-native-action="smaller"]').onclick=()=>setFont(-1);
  ov.querySelector('[data-native-action="larger"]').onclick=()=>setFont(1);
  ov.querySelector('[data-native-action="top"]').onclick=()=>current.scroll.scrollTo({top:0,behavior:'smooth'});
  ov.querySelector('.bc-native-reader-tools input').addEventListener('input',e=>search(e.target.value));

  ov.querySelectorAll('[data-chapter-check]').forEach(btn=>{
    btn.onclick=()=>{
      const id=btn.dataset.chapterCheck;
      setChapterDone(mode,id,!chapterDone(mode,id));
      refreshReaderStudyUI();
    };
  });
  ov.querySelectorAll('[data-chapter-jump]').forEach(btn=>{
    btn.onclick=()=>{
      const ch=modeChapters(data,mode).find(x=>x.id===btn.dataset.chapterJump);
      findHeadingForChapter(ch)?.scrollIntoView({behavior:'smooth',block:'start'});
    };
  });

  bindQuiz();
  ov.addEventListener('click',e=>{if(e.target===ov)close()});
  requestAnimationFrame(()=>{
    current.chapterMap=buildChapterMap();
    restoreScroll();updateScrollProgress();refreshReaderStudyUI();autoMarkViewedChapters();
  });
}
function openMap(){
  if(global.BaseMindMap?.open)global.BaseMindMap.open('penal','p4');
  else alert('O mapa mental interativo ainda está carregando. Tente novamente em alguns segundos.');
}
function removeLegacyM01Content(){
  const module=document.querySelector(M1_SELECTOR);
  if(!module)return;
  module.querySelectorAll('.bc-session-nav,.bc-session-pager').forEach(el=>el.remove());
}
function inject(){
  const module=document.querySelector(M1_SELECTOR);if(!module)return;
  removeLegacyM01Content();
  const body=module.querySelector('.cf-module-body');if(!body)return;

  // Fallback: a renderização principal já entrega os cards diretamente.
  if(!body.querySelector('.bc-native-materials')){
    const host=document.createElement('section');host.className='bc-native-materials';
    host.innerHTML='<div class="bc-native-materials-head"><div><b>Materiais do módulo</b><small>Escolha como estudar</small></div><small>Piloto M04 • conteúdo nativo</small></div>'+
      '<div class="bc-native-material-grid">'+
        '<button class="bc-native-material-card" data-native-kind="summary"><span class="bc-native-material-icon">⚡</span><span><strong>Conteúdo resumido</strong><small>Primeira leitura, revisão rápida, artigos, pegadinhas e revisão ativa.</small></span><span class="bc-native-material-action"><span>Abrir</span><span>→</span></span></button>'+
        '<button class="bc-native-material-card" data-native-kind="complete"><span class="bc-native-material-icon">📚</span><span><strong>Conteúdo completo</strong><small>Teoria integral do M04 em formato de site, com índice, busca e progresso de leitura.</small></span><span class="bc-native-material-action"><span>Abrir</span><span>→</span></span></button>'+
        '<button class="bc-native-material-card" data-native-kind="mindmap"><span class="bc-native-material-icon">🧠</span><span><strong>Mapa mental</strong><small>Mapa interativo com abrir/recolher ramos, zoom, arrastar e tela cheia.</small></span><span class="bc-native-material-action"><span>Abrir</span><span>→</span></span></button>'+
      '</div>';
    host.querySelector('[data-native-kind="summary"]').onclick=()=>open('summary');
    host.querySelector('[data-native-kind="complete"]').onclick=()=>open('complete');
    host.querySelector('[data-native-kind="mindmap"]').onclick=openMap;
    const subtitle=body.querySelector('.cf-subtitle');
    if(subtitle)subtitle.insertAdjacentElement('afterend',host);else body.insertAdjacentElement('afterbegin',host);
  }
  refreshModuleMetrics();
}
function install(){
  inject();
  observer=new MutationObserver(()=>{
    clearTimeout(install._t);
    install._t=setTimeout(()=>{removeLegacyM01Content();inject();refreshModuleMetrics()},60);
  });
  observer.observe(document.documentElement,{subtree:true,childList:true});
  global.addEventListener('focus',refreshModuleMetrics);
}
global.BaseNativeReaderM04={
  open,close,refreshMetrics:refreshModuleMetrics,theoryStats,externalStats,
  version:'2026.10.02-m04-pilot1'
};
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.getElementById(OVERLAY_ID))close()});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})(window);

/* M05 preview bundled */
(function(global){
'use strict';
global.BASE_NATIVE_CONTENT=global.BASE_NATIVE_CONTENT||{};
global.BASE_NATIVE_CONTENT.penal=global.BASE_NATIVE_CONTENT.penal||{};
global.BASE_NATIVE_CONTENT.penal.m05={"moduleId":"p5","number":5,"title":"Culpabilidade e Teoria do Erro","updatedAt":"2026-10-02","sources":{"completeDriveId":"1vGhyrk6t9n5zhDFmB7dyhajL5dq2FSZq","completeTheoryKey":"p5","summaryDriveId":"1-8A9jxV6LMZCXqis4ILuhfECJp1qUjIt","mindMapDriveId":"1wtAoXtQekL_YvKmhxSFApky9enDQ4ME4"},"summary":"BASE COMPLETA | DIREITO PENAL | PEN M5 Culpabilidade e Teoria do Erro\r\nResumo para primeira leitura e revisão | Base normativa conferida em 01/10/2026 1\r\nPEN M5\r\nCulpabilidade e Teoria do Erro\r\nLeitura curta para quem está vendo o tema pela primeira vez e material de revisão rápida para\r\nquem já estudou.\r\n1ª leitura\r\nPáginas 1 a 4: compreenda o mapa e as diferenças.\r\nRevisão\r\nPáginas 5 e 6: lei seca, pegadinhas e recuperação ativa.\r\nVisão geral\r\nMapa-mestre: FATO TÍPICO -> ILICITUDE -> CULPABILIDADE. Para fins didáticos, o módulo usa a concepção\r\ntripartida: a culpabilidade é o terceiro substrato do crime e representa o juízo de reprovação pessoal dirigido ao\r\nautor de um fato típico e ilícito.\r\nFórmula central\r\nCULPABILIDADE = IMPUTABILIDADE + POTENCIAL CONSCIÊNCIA DA ILICITUDE + EXIGIBILIDADE DE CONDUTA DIVERSA\r\nPlano Pergunta Exemplo de instituto\r\nFato típico O comportamento realiza o tipo penal? Erro de tipo essencial pode excluir o dolo.\r\nIlicitude O fato típico é contrário ao Direito ou está justificado? Legítima defesa real exclui a ilicitude.\r\nCulpabilidade É possível censurar pessoalmente o agente? Erro de proibição inevitável exclui a culpabilidade.\r\nAtalhos de localização:\r\n- Erro de tipo essencial -> atinge o dolo/tipicidade subjetiva.\r\n- Excludente real -> atinge a ilicitude.\r\n- Erro de proibição inevitável -> atinge a culpabilidade.\r\n- Coação física irresistível -> elimina a própria conduta voluntária.\r\n- Coação moral irresistível -> elimina a exigibilidade de conduta diversa.\r\nAtenção\r\nInimputabilidade não significa ausência de fato típico ou de ilicitude. Em regra, ela impede a formação da\r\nculpabilidade.BASE COMPLETA | DIREITO PENAL | PEN M5 Culpabilidade e Teoria do Erro\r\nResumo para primeira leitura e revisão | Base normativa conferida em 01/10/2026 2\r\nTeoria - 1. Culpabilidade e imputabilidade\r\nEvolução resumida: na teoria psicológica, dolo e culpa formavam o vínculo psíquico da culpabilidade. A teoria\r\npsicológico-normativa acrescentou o juízo de reprovação. No finalismo, dolo e culpa migram para o fato típico, e\r\na culpabilidade assume estrutura normativa: imputabilidade + potencial consciência da ilicitude + exigibilidade.\r\nPonto de prova\r\nNo finalismo, dolo e culpa pertencem ao fato típico, não à culpabilidade.\r\nImputabilidade\r\nÉ a capacidade de entender o caráter ilícito do fato e de determinar-se de acordo com esse entendimento. É\r\napenas um elemento da culpabilidade, e não seu sinônimo.\r\nDoença mental e desenvolvimento mental\r\nO art. 26, caput, adota estrutura biopsicológica: deve existir a causa mental prevista e, ao tempo da ação ou\r\nomissão, incapacidade inteira de compreender a ilicitude ou de se autodeterminar. O diagnóstico, sozinho, não\r\nbasta.\r\nSemi-imputabilidade\r\nNo art. 26, parágrafo único, a capacidade não está eliminada, mas reduzida. A culpabilidade subsiste em grau\r\ndiminuído, com consequência legal própria.\r\nMenoridade penal\r\nMenor de 18 anos é penalmente inimputável (art. 27 CP e art. 228 CF). Aqui prevalece o critério biológico: não\r\nse investiga maturidade concreta para afastar a regra. A idade relevante é a do momento da ação ou omissão.\r\nSituação Capacidade Efeito principal\r\nInimputável - art. 26 caput Inteiramente ausente Exclui imputabilidade.\r\nSemi-imputável Reduzida Não exclui totalmente; há redução legal.\r\nImputável Preservada Segue análise dos demais elementos da culpabilidade.\r\nEmoção, paixão e embriaguez\r\nEmoção e paixão, por si, não excluem imputabilidade. Na embriaguez, é preciso separar a origem e a\r\nintensidade: voluntária e culposa não excluem; a acidental por caso fortuito ou força maior pode produzir\r\nisenção se completa e houver incapacidade total, ou redução se a capacidade estiver apenas diminuída.\r\nEmbriaguez Regra\r\nVoluntária ou culposa Não exclui imputabilidade.\r\nAcidental completa Pode isentar se decorre de caso fortuito/força maior e causa incapacidade total.\r\nAcidental incompleta Pode gerar redução quando há diminuição de capacidade.\r\nPatológica Pode exigir análise pelo art. 26, conforme natureza do quadro e capacidade concreta.\r\nActio libera in causa\r\nO olhar pode voltar ao momento anterior em que o agente era livre e criou o estado posterior de incapacidade. A teoria\r\nnão autoriza responsabilidade objetiva.BASE COMPLETA | DIREITO PENAL | PEN M5 Culpabilidade e Teoria do Erro\r\nResumo para primeira leitura e revisão | Base normativa conferida em 01/10/2026 3\r\nTeoria - 2. Consciência da ilicitude e exigibilidade\r\nPotencial consciência da ilicitude\r\nNão se exige conhecimento técnico, número de artigo ou domínio jurídico. Basta que, nas circunstâncias, o\r\nagente pudesse alcançar a consciência de que o comportamento era ilícito. É potencial, e não necessariamente\r\natual.\r\nExigibilidade de conduta diversa\r\nMesmo imputável e capaz de perceber a ilicitude, o agente só é culpável quando o Direito podia exigir\r\ncomportamento diferente. O art. 22 traz duas hipóteses clássicas: coação moral irresistível e estrita obediência\r\na ordem não manifestamente ilegal de superior hierárquico.\r\nInstituto O que ocorre Plano afetado\r\nCoação física irresistível Força elimina a voluntariedade corporal. Conduta / fato típico\r\nCoação moral irresistível Há ação física, mas a grave ameaça torna inexigível conduta\r\ndiversa.\r\nCulpabilidade\r\nCoação moral resistível Havia alternativa juridicamente exigível. Não exclui culpabilidade\r\nRegra para memorizar\r\nFÍSICA = sem conduta voluntária. MORAL = sem exigibilidade.\r\nObediência hierárquica\r\nA exculpação exige relação hierárquica juridicamente relevante, ordem de superior, cumprimento estrito e\r\nordem não manifestamente ilegal. Se a ilegalidade é ostensiva e perceptível, o subordinado não se beneficia do\r\nart. 22.\r\nOrdem Consequência para o subordinado\r\nNão manifestamente ilegal + estrita obediência Pode haver exclusão da culpabilidade.\r\nManifestamente ilegal Deve ser recusada; o art. 22 não exculpa.\r\nCausas supralegais de inexigibilidade\r\nA doutrina admite discussão em situações excepcionalíssimas não previstas expressamente, desde que\r\ncomprovada a impossibilidade concreta de exigir outra conduta. Não é cláusula aberta para mera conveniência,\r\nreceio comum ou dificuldade ordinária.\r\nComparação decisiva\r\nImputabilidade = capacidade do agente.\r\nPotencial consciência = possibilidade de perceber a ilicitude.\r\nExigibilidade = possibilidade de exigir atuação diferente.BASE COMPLETA | DIREITO PENAL | PEN M5 Culpabilidade e Teoria do Erro\r\nResumo para primeira leitura e revisão | Base normativa conferida em 01/10/2026 4\r\nTeoria - 3. Teoria do erro\r\nA pergunta certa é: sobre o que o agente se enganou? O erro pode recair sobre um elemento do tipo, sobre a\r\nilicitude, sobre uma situação fática justificante, sobre a identidade da vítima, sobre a execução ou sobre o\r\nresultado.\r\nInstituto O agente erra sobre... Efeito central\r\nErro de tipo Elemento constitutivo do tipo Exclui o dolo; culpa pode subsistir se prevista e o erro\r\nfor evitável.\r\nErro de proibição Ilicitude do comportamento Afeta a culpabilidade; inevitável isenta, evitável pode\r\nreduzir a pena.\r\nErro de tipo essencial\r\nInevitável: exclui dolo e culpa. Evitável: exclui dolo, mas pode haver punição culposa se o delito admitir\r\nmodalidade culposa.\r\nErro de proibição\r\nO agente conhece os fatos, porém acredita que sua conduta é permitida. Inevitável: exclui culpabilidade.\r\nEvitável: a culpabilidade subsiste e o art. 21 prevê redução de 1/6 a 1/3.\r\nDescriminantes putativas\r\nSe o agente imagina fatos que, se existissem, tornariam sua ação legítima, a teoria limitada trata a hipótese\r\ncomo erro de tipo permissivo (art. 20, §1º). Se conhece os fatos, mas erra sobre a existência ou os limites\r\njurídicos da justificante, há erro de proibição indireto.\r\nSituação Teoria limitada\r\nErro sobre pressuposto fático de justificante Erro de tipo permissivo - art. 20, §1º.\r\nErro sobre existência/limite jurídico da justificante Erro de proibição indireto - art. 21.\r\nErro determinado por terceiro\r\nO art. 20, §2º, atribui responsabilidade ao terceiro que determina o erro. O executor continua sendo analisado\r\nconforme a natureza e a evitabilidade do próprio erro.\r\nErros acidentais\r\nInstituto Chave de identificação\r\nErro sobre a pessoa - art. 20, §3º O agente acerta a pessoa fisicamente escolhida, mas erra sua identidade. Consideram-se as\r\nqualidades da pessoa visada.\r\nAberratio ictus - art. 73 O agente sabe quem quer atingir, mas erra a execução e atinge pessoa diversa.\r\nAberratio criminis - art. 74 Por erro/acidente na execução, sobrevém resultado de natureza diversa do pretendido.\r\nDelito putativo O agente imagina estar praticando crime, mas a conduta não é penalmente proibida na forma\r\nimaginada.BASE COMPLETA | DIREITO PENAL | PEN M5 Culpabilidade e Teoria do Erro\r\nResumo para primeira leitura e revisão | Base normativa conferida em 01/10/2026 5\r\nArtigos para decorar\r\nArt. 20 caput\r\nErro de tipo: exclui dolo; permite punição por culpa se\r\nhouver previsão.\r\nArt. 20, §1º\r\nDescriminante putativa por situação de fato. Erro\r\nplenamente justificado pode isentar; se derivar de culpa\r\ne houver tipo culposo, não há isenção.\r\nArt. 20, §2º\r\nResponde pelo crime o terceiro que determina o erro.\r\nArt. 20, §3º\r\nErro sobre a pessoa não isenta; consideram-se as\r\ncondições/qualidades da pessoa que o agente queria\r\natingir.\r\nArt. 21\r\nDesconhecimento da lei é inescusável. Erro de proibição\r\ninevitável isenta; evitável pode reduzir de 1/6 a 1/3.\r\nArt. 22\r\nCoação irresistível e estrita obediência a ordem não\r\nmanifestamente ilegal.\r\nArt. 26\r\nInimputabilidade por incapacidade inteira; parágrafo\r\núnico trata da capacidade reduzida.\r\nArt. 27 + CF art. 228\r\nMenor de 18 anos é penalmente inimputável.\r\nArt. 28\r\nEmoção/paixão e embriaguez voluntária/culposa não\r\nexcluem imputabilidade; §§1º e 2º tratam da embriaguez\r\nacidental.\r\nArt. 73\r\nAberratio ictus: pessoa diversa atingida por erro na\r\nexecução.\r\nArt. 74\r\nAberratio criminis: resultado diverso do pretendido.\r\nPegadinhas de provas\r\n1. Doença mental não gera inimputabilidade automática: é\r\nnecessária incapacidade inteira ao tempo do fato.\r\n7. Erro de tipo inevitável exclui dolo e culpa; o evitável\r\nexclui o dolo e pode deixar culpa prevista.\r\n2. No finalismo, dolo e culpa estão no fato típico, não na\r\nculpabilidade.\r\n8. Erro de proibição não exclui dolo; ele atinge a\r\nculpabilidade.\r\n3. Menoridade penal usa critério biológico; o corte é 18\r\nanos.\r\n9. Desconhecimento da lei não é sinônimo de erro de\r\nproibição.\r\n4. Embriaguez voluntária ou culposa não exclui\r\nimputabilidade, mesmo quando intensa.\r\n10. Descriminante putativa fática e excludente real são\r\ninstitutos diferentes.\r\n5. Coação física irresistível elimina conduta; coação moral\r\nirresistível exclui exigibilidade.\r\n11. Erro sobre a pessoa ≠ aberratio ictus: identidade ≠\r\nexecução.\r\n6. Obediência hierárquica só exculpa diante de ordem não\r\nmanifestamente ilegal e estritamente cumprida.\r\n12. Aberratio ictus = pessoa diversa; aberratio criminis =\r\nresultado diverso.BASE COMPLETA | DIREITO PENAL | PEN M5 Culpabilidade e Teoria do Erro\r\nResumo para primeira leitura e revisão | Base normativa conferida em 01/10/2026 6\r\nRevisão ativa\r\nTente responder mentalmente antes de ler a linha seguinte. Se hesitar, volte à página indicada pelo tema.\r\n1. Quais são os três elementos da culpabilidade?\r\nImputabilidade + potencial consciência da ilicitude +\r\nexigibilidade de conduta diversa.\r\n2. No finalismo, onde ficam dolo e culpa?\r\nNo fato típico.\r\n3. Qual critério é usado no art. 26?\r\nBiopsicológico: causa mental + incapacidade concreta\r\ntotal.\r\n4. Qual critério vale para menoridade penal?\r\nBiológico: menor de 18 anos.\r\n5. Emoção e paixão excluem imputabilidade?\r\nNão.\r\n6. Embriaguez voluntária ou culposa exclui\r\nimputabilidade?\r\nNão.\r\n7. Quando a embriaguez acidental pode isentar?\r\nQuando completa, por caso fortuito/força maior, com\r\nincapacidade total.\r\n8. Coação física e moral irresistíveis produzem o\r\nmesmo efeito?\r\nNão. Física elimina conduta; moral exclui exigibilidade.\r\n9. Qual é a exigência central da obediência\r\nhierárquica?\r\nOrdem não manifestamente ilegal, de superior,\r\nestritamente cumprida.\r\n10. Erro de tipo essencial inevitável exclui o quê?\r\nDolo e culpa.\r\n11. Erro de tipo essencial evitável exclui o quê?\r\nDolo; pode restar culpa se houver modalidade culposa.\r\n12. Erro de proibição inevitável exclui dolo?\r\nNão. Exclui a culpabilidade.\r\n13. E o erro de proibição evitável?\r\nMantém culpabilidade e pode reduzir a pena de 1/6 a 1/3.\r\n14. Erro fático sobre uma justificante, na teoria\r\nlimitada, é o quê?\r\nErro de tipo permissivo.\r\n15. Erro sobre existência/limites jurídicos de\r\njustificante é o quê?\r\nErro de proibição indireto.\r\n16. Erro determinado por terceiro: quem\r\nresponde?\r\nO terceiro provocador responde; o executor é analisado\r\nconforme seu próprio erro.\r\n17. Erro sobre a pessoa x aberratio ictus?\r\nIdentidade da vítima x desvio na execução.\r\n18. Aberratio ictus x aberratio criminis?\r\nPessoa diversa atingida x resultado de natureza diversa.\r\n19. Delito putativo x erro de proibição?\r\nNo delito putativo, o agente imagina crime inexistente; no\r\nerro de proibição, existe proibição e ele pensa estar\r\nautorizado.\r\n20. Qual é o mapa de decisão para um caso de\r\nerro?\r\nPergunte: errou o fato, a ilicitude, a justificante, a\r\nidentidade, a execução ou o resultado?\r\nFechamento em 30 segundos\r\nTIPO -> erro de tipo mexe no dolo. PROIBIÇÃO -> erro de proibição mexe na culpabilidade.\r\nFÍSICA -> sem conduta. MORAL -> sem exigibilidade.\r\nPESSOA -> art. 20, §3º. EXECUÇÃO -> art. 73. RESULTADO -> art. 74.\r\nBase normativa principal: Código Penal, arts. 20 a 22, 26 a 28, 73 e 74; Constituição Federal, art. 228. Conteúdo resumido do PEN M5\r\ncompleto.","chapters":{"summary":[{"id":"s01","title":"Visão geral"},{"id":"s02","title":"Teoria - 1. Culpabilidade e imputabilidade"},{"id":"s03","title":"Teoria - 2. Consciência da ilicitude e exigibilidade"},{"id":"s04","title":"Teoria - 3. Teoria do erro"},{"id":"s05","title":"Artigos para decorar"},{"id":"s06","title":"Pegadinhas de provas"}],"complete":[{"id":"c01","title":"1. Conceito de culpabilidade"},{"id":"c02","title":"2. Culpabilidade como terceiro substrato do crime"},{"id":"c03","title":"3. Evolução das teorias da culpabilidade"},{"id":"c04","title":"4. Elementos da culpabilidade"},{"id":"c05","title":"5. Imputabilidade"},{"id":"c06","title":"6. Inimputabilidade por doença mental ou desenvolvimento mental incompleto/retardado"},{"id":"c07","title":"7. Semi-imputabilidade"},{"id":"c08","title":"8. Menoridade penal"},{"id":"c09","title":"9. Emoção e paixão"},{"id":"c10","title":"10. Embriaguez"},{"id":"c11","title":"11. Actio libera in causa"},{"id":"c12","title":"12. Potencial consciência da ilicitude"},{"id":"c13","title":"13. Exigibilidade de conduta diversa"},{"id":"c14","title":"14. Coação física × coação moral"},{"id":"c15","title":"15. Coação moral irresistível × resistível"},{"id":"c16","title":"16. Obediência hierárquica"},{"id":"c17","title":"17. Introdução à teoria do erro"},{"id":"c18","title":"18. Erro de tipo"},{"id":"c19","title":"19. Erro de tipo essencial inevitável × evitável"},{"id":"c20","title":"20. Erro de proibição"},{"id":"c21","title":"21. Erro de proibição inevitável × evitável"},{"id":"c22","title":"22. Descriminantes putativas"},{"id":"c23","title":"23. Art. 20, §1º — erro de tipo permissivo"},{"id":"c24","title":"24. Teoria limitada × teoria extremada da culpabilidade"},{"id":"c25","title":"25. Erro determinado por terceiro"},{"id":"c26","title":"26. Erro de tipo acidental"},{"id":"c27","title":"27. Erro sobre a pessoa"},{"id":"c28","title":"28. Aberratio ictus — erro na execução"},{"id":"c29","title":"29. Aberratio criminis — resultado diverso do pretendido"},{"id":"c30","title":"30. Institutos complementares: erro mandamental, erro de subsunção e delito putativo"},{"id":"c31","title":"31.1 Mapa de localização dogmática"},{"id":"c32","title":"31.2 O quadro mais cobrado"},{"id":"c33","title":"31.3 Descriminantes"}]},"internalQuestions":{"summary":[{"id":"sq01","q":"No modelo tripartido usado no M05, quais são os três elementos da culpabilidade?","options":["Imputabilidade, potencial consciência da ilicitude e exigibilidade de conduta diversa.","Tipicidade, antijuridicidade e punibilidade.","Dolo, culpa e resultado.","Imputabilidade, tipicidade e nexo causal."],"answer":0,"explanation":"O material usa a fórmula: culpabilidade = imputabilidade + potencial consciência da ilicitude + exigibilidade de conduta diversa."},{"id":"sq02","q":"No finalismo, onde ficam dolo e culpa?","options":["Na culpabilidade.","No fato típico.","Na ilicitude.","Na punibilidade."],"answer":1,"explanation":"O resumo destaca que, no finalismo, dolo e culpa migram para o fato típico e deixam a culpabilidade."},{"id":"sq03","q":"Qual critério o art. 26 utiliza para a inimputabilidade por doença mental ou desenvolvimento mental?","options":["Somente biológico.","Somente psicológico.","Biopsicológico.","Etário absoluto."],"answer":2,"explanation":"O art. 26 exige causa mental relevante e incapacidade concreta total ao tempo da ação ou omissão."},{"id":"sq04","q":"Qual é a diferença central entre coação física irresistível e coação moral irresistível?","options":["A física elimina a conduta voluntária; a moral afeta a exigibilidade de conduta diversa.","A física exclui a ilicitude; a moral exclui a tipicidade.","Ambas excluem sempre a imputabilidade.","A moral elimina a conduta e a física apenas reduz a pena."],"answer":0,"explanation":"O material localiza a coação física irresistível antes da culpabilidade, por eliminar voluntariedade; a moral irresistível atua na exigibilidade."},{"id":"sq05","q":"O erro de proibição inevitável produz qual efeito principal?","options":["Exclui o dolo.","Exclui a culpabilidade.","Exclui a tipicidade objetiva.","Transforma o crime doloso em culposo."],"answer":1,"explanation":"O erro de proibição atua sobre a potencial consciência da ilicitude; sendo inevitável, exclui a culpabilidade."}],"complete":[{"id":"cq01","q":"Imputabilidade e culpabilidade se relacionam de que forma?","options":["São sinônimos perfeitos.","Imputabilidade é um dos elementos da culpabilidade.","Culpabilidade é um elemento da imputabilidade.","Imputabilidade pertence exclusivamente à ilicitude."],"answer":1,"explanation":"O material enfatiza que imputabilidade é elemento da culpabilidade, e não seu sinônimo."},{"id":"cq02","q":"Na semi-imputabilidade do art. 26, parágrafo único:","options":["A capacidade está inteiramente ausente.","A capacidade está reduzida, e a culpabilidade não é totalmente excluída.","O agente é menor de 18 anos.","A consequência é sempre absolvição sem qualquer efeito penal."],"answer":1,"explanation":"A semi-imputabilidade pressupõe capacidade reduzida, não eliminada, com consequência legal própria."},{"id":"cq03","q":"Quanto à menoridade penal, o material trabalha com qual critério?","options":["Biopsicológico.","Psicológico.","Biológico, com corte em 18 anos.","Misto, com corte em 21 anos."],"answer":2,"explanation":"Menor de 18 anos é penalmente inimputável; o critério destacado é biológico."},{"id":"cq04","q":"Sobre emoção e paixão, o art. 28, I, conforme o material, estabelece que:","options":["Excluem sempre a imputabilidade.","Não excluem, por si só, a imputabilidade penal.","Excluem a tipicidade subjetiva.","Transformam dolo em culpa."],"answer":1,"explanation":"Emoção e paixão não excluem a imputabilidade por si mesmas."},{"id":"cq05","q":"A embriaguez voluntária ou culposa:","options":["Exclui a imputabilidade se completa.","Não exclui a imputabilidade penal.","Sempre reduz a pena.","É tratada como erro de proibição."],"answer":1,"explanation":"O art. 28, II, mantém a imputabilidade na embriaguez voluntária ou culposa."},{"id":"cq06","q":"A embriaguez acidental completa pode isentar quando:","options":["Decorre de caso fortuito ou força maior e elimina totalmente a capacidade de compreensão ou autodeterminação.","Foi voluntariamente buscada para facilitar o crime.","É apenas incompleta.","Decorre de emoção intensa."],"answer":0,"explanation":"O material exige origem acidental — caso fortuito ou força maior — e incapacidade total."},{"id":"cq07","q":"A actio libera in causa permite olhar para:","options":["O momento anterior em que o agente era livre e imputável e criou a situação posterior de incapacidade.","Somente o resultado naturalístico.","Apenas a fase processual da sentença.","Qualquer embriaguez como responsabilidade objetiva."],"answer":0,"explanation":"A teoria desloca o exame para o momento anterior de liberdade, sem autorizar responsabilidade objetiva."},{"id":"cq08","q":"Erro de tipo essencial inevitável e evitável produzem, respectivamente:","options":["Exclusão de dolo e culpa; exclusão de dolo com possibilidade de punição culposa se prevista.","Exclusão da culpabilidade; redução obrigatória da pena.","Exclusão da ilicitude; exclusão da tipicidade objetiva.","Nenhum efeito; redução de pena."],"answer":0,"explanation":"O erro inevitável exclui dolo e culpa; o evitável exclui o dolo, mas pode subsistir culpa se houver previsão legal."},{"id":"cq09","q":"Na obediência hierárquica, a exculpação exige que a ordem seja:","options":["Manifestamente ilegal.","Não manifestamente ilegal, dentro da relação hierárquica pertinente.","Sempre escrita.","Proferida por qualquer pessoa mais velha."],"answer":1,"explanation":"O material vincula a exculpação à estrita observância de ordem não manifestamente ilegal."},{"id":"cq10","q":"Qual associação está correta?","options":["Erro de tipo essencial → culpabilidade; erro de proibição → dolo.","Erro de tipo essencial → tipo/dolo; erro de proibição → potencial consciência da ilicitude.","Excludente real → imputabilidade; coação moral → ilicitude.","Erro sobre a pessoa → ausência de conduta."],"answer":1,"explanation":"O mapa do módulo localiza o erro de tipo no fato típico e o erro de proibição na culpabilidade."}]}};
})(window);

(function(global){
'use strict';
const SEL='#subjects .subject[data-id="penal"] .cf-module[data-cf="p5"]';

function inject(){
  const module=document.querySelector(SEL);
  if(!module) return;
  const body=module.querySelector('.cf-module-body');
  if(!body || body.querySelector('[data-bc-native-m05]')) return;

  const host=document.createElement('section');
  host.className='bc-native-materials bc-native-materials-static';
  host.setAttribute('data-bc-native-m05','');
  host.innerHTML=
    '<section class="bc-native-metrics" aria-label="Indicadores do módulo">'+
      '<article class="bc-native-metric-card">'+
        '<div class="bc-native-ring" data-native-ring="theory"><div class="bc-native-ring-inner"><b data-ring-value>0%</b><span>teoria</span></div></div>'+
        '<div class="bc-native-metric-copy"><small>COBERTURA DA TEORIA</small><strong data-native-metric-detail="theory">0 de 54 pontos concluídos</strong><span>Checks dos capítulos + questões internas.</span></div>'+
      '</article>'+
      '<article class="bc-native-metric-card">'+
        '<div class="bc-native-ring" data-native-ring="external"><div class="bc-native-ring-inner"><b data-ring-value>—</b><span>externas</span></div></div>'+
        '<div class="bc-native-metric-copy"><small>ACERTO EM QUESTÕES EXTERNAS</small><strong data-native-metric-detail="external">Nenhuma questão externa respondida</strong><span data-native-metric-meta="external">Registre questões externas no final do módulo</span></div>'+
      '</article>'+
    '</section>'+
    '<div class="bc-native-materials-head"><div><b>Materiais do módulo</b><small>Escolha como estudar</small></div><small>M05 • conteúdo nativo</small></div>'+
    '<div class="bc-native-material-grid">'+
      '<button type="button" class="bc-native-material-card" data-native-kind="summary"><span class="bc-native-material-icon">⚡</span><span><strong>Conteúdo resumido</strong><small>Primeira leitura, revisão rápida, artigos, pegadinhas e revisão ativa.</small></span><span class="bc-native-material-action"><span>Abrir</span><span>→</span></span></button>'+
      '<button type="button" class="bc-native-material-card" data-native-kind="complete"><span class="bc-native-material-icon">📚</span><span><strong>Conteúdo completo</strong><small>Teoria integral do M05 em formato de site, com índice, busca e progresso de leitura.</small></span><span class="bc-native-material-action"><span>Abrir</span><span>→</span></span></button>'+
      '<button type="button" class="bc-native-material-card" data-native-kind="mindmap"><span class="bc-native-material-icon">🧠</span><span><strong>Mapa mental</strong><small>Mapa interativo com abrir/recolher ramos, zoom, arrastar e tela cheia.</small></span><span class="bc-native-material-action"><span>Abrir</span><span>→</span></span></button>'+
    '</div>'+
    '<section class="bc-native-quick-summary" aria-label="Resumo do módulo">'+
      '<div class="bc-native-quick-summary-head"><span class="bc-native-quick-summary-no">5</span><div><b>Resumo do módulo</b><small>O M05 em poucas palavras.</small></div></div>'+
      '<div class="bc-native-quick-summary-body">Culpabilidade e imputabilidade • consciência da ilicitude • exigibilidade de conduta diversa • embriaguez e actio libera in causa • erro de tipo e erro de proibição • descriminantes putativas e erros acidentais.</div>'+
    '</section>';

  host.querySelector('[data-native-kind="summary"]').onclick=function(){global.BaseNativeReaderM05?.open('summary')};
  host.querySelector('[data-native-kind="complete"]').onclick=function(){global.BaseNativeReaderM05?.open('complete')};
  host.querySelector('[data-native-kind="mindmap"]').onclick=function(){global.BaseMindMap?.open('penal','p5')};

  const subtitle=body.querySelector('.cf-subtitle');
  if(subtitle) subtitle.insertAdjacentElement('afterend',host);
  else body.insertAdjacentElement('afterbegin',host);
  global.BaseNativeReaderM05?.refreshMetrics?.();
}
function install(){
  inject();
  const obs=new MutationObserver(function(){
    clearTimeout(install._t);
    install._t=setTimeout(inject,60);
  });
  obs.observe(document.documentElement,{subtree:true,childList:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})(window);

(function(global){
'use strict';

const OVERLAY_ID='bcNativeReaderOverlayM05';
const M1_SELECTOR='#subjects .subject[data-id="penal"] .cf-module[data-cf="p5"]';
const STORAGE_PREFIX='central-v6:native-reader:penal:p5';
let current=null;
let observer=null;

function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function norm(s){return String(s||'').replace(/\u00a0/g,' ').replace(/[ \t]+/g,' ').trim()}
function normKey(s){return norm(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
function slug(s){return normKey(s).replace(/\s+/g,'-').slice(0,70)}
function source(){return global.BASE_NATIVE_CONTENT?.penal?.m05||null}
function storageKey(part){return STORAGE_PREFIX+':'+part}

function cleanLines(raw,mode){
  const lines=String(raw||'').replace(/\r/g,'').split('\n').map(norm);
  const out=[];
  let skipOldSummaryReview=false;
  for(let line of lines){
    if(mode==='summary' && /^REVIS(?:A|Ã)O ATIVA$/i.test(line)){skipOldSummaryReview=true;continue}
    if(skipOldSummaryReview)continue;
    if(!line){out.push('');continue}
    if(/^BASE COMPLETA(?:\s*[|•-]|$)/i.test(line))continue;
    if(/^D\s*IRE\s*ITO PENAL\s*•\s*M0?1$/i.test(line))continue;
    if(/^\d+\s*\/\s*\d+$/.test(line))continue;
    if(/^P[aá]gina\s+\d+$/i.test(line))continue;
    if(/^Conteudo restrito ao PEN M1/i.test(line))continue;
    out.push(line);
  }
  return out;
}
function headingInfo(line){
  const l=norm(line);
  if(!l)return null;
  let m=l.match(/^(\d+)\.(\d+)\s+(.{3,140})$/);
  if(m)return {level:3,text:l};
  m=l.match(/^(\d+)\.?\s+(.{3,140})$/);
  if(m && !/^\d+\s*\/\s*\d+/.test(l) && !/^\d+\s+(Quais|Qual|A |O |Como |Quando |Pequeno|Pessoalidade|Na )/i.test(l)){
    return {level:2,text:l};
  }
  if(/^(VISÃO GERAL|VISAO GERAL|REVISÃO ATIVA|REVISAO ATIVA|ARTIGOS PARA DECORAR|PEGADINHAS DE PROVA|PEGADINHAS DE PROVAS|MAPA DO MÓDULO|MAPA DO MODULO|TEORIA ESSENCIAL)$/i.test(l)){
    return {level:2,text:l};
  }
  if(/^TEORIA\s*-\s*[123]\./i.test(l)){
    return {level:2,text:l};
  }
  return null;
}
function calloutType(line){
  const l=norm(line).toUpperCase();
  if(/^(✅\s*)?EXEMPLO/.test(l))return ['example','Exemplo'];
  if(/PEGADINHA/.test(l))return ['trap','Pegadinha'];
  if(/^(⚖️\s*)?LEI SECA/.test(l))return ['law','Lei seca'];
  if(/^(DECORE|MEMÓRIA|MEMORIA|MNEMÔNICO|MNEMONICO|REGRA DE OURO|IDEIA-CENTRAL|IDEIA CENTRAL|FÓRMULA|FORMULA|MEMORIZACAO RAPIDA)/.test(l))return ['memory',norm(line)];
  if(/^(STF|STJ|JURISPRUDÊNCIA|JURISPRUDENCIA|ATUALIZAÇÃO|ATUALIZACAO)/.test(l))return ['case',norm(line)];
  if(/^(COMPARAÇÃO|COMPARACAO|ATENÇÃO|ATENCAO|PROVA|CUIDADO|FRONTEIRA DO MÓDULO|FRONTEIRA DO MODULO)/.test(l))return ['case',norm(line)];
  return null;
}
function isBullet(line){return /^[•●▪◦*-]\s+/.test(line)}
function looksTitle(line){
  const l=norm(line);
  if(l.length<3||l.length>105)return false;
  if(/[.!?]$/.test(l))return false;
  if(/^[A-ZÁÉÍÓÚÂÊÔÃÕÇ0-9][A-ZÁÉÍÓÚÂÊÔÃÕÇ0-9\s:–—()/%ºª,.-]+$/.test(l)&&l.split(/\s+/).length<=12)return true;
  return false;
}
function parse(raw,mode){
  const lines=cleanLines(raw,mode);
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
        if(!next){if(body.length)break;else continue}
        if(headingInfo(next)||calloutType(next)||looksTitle(next))break;
        body.push(next);i=j;
      }
      blocks.push({type:'callout',kind:co[0],label:co[1],text:body.join(' ')});
      continue;
    }
    if(isBullet(line)){
      flush();
      const items=[line.replace(/^[•●▪◦*-]\s+/,'')];
      while(i+1<lines.length&&isBullet(lines[i+1]))items.push(lines[++i].replace(/^[•●▪◦*-]\s+/,''));
      blocks.push({type:'ul',items});
      continue;
    }
    if(looksTitle(line)&&mode==='summary'){flush();blocks.push({type:'h',level:3,text:line});continue}
    para.push(line);
  }
  flush();
  const firstH=blocks.findIndex(b=>b.type==='h');
  if(firstH>2){
    const lead=blocks.slice(0,firstH).filter(b=>b.type==='p').map(b=>b.text).join(' ');
    blocks.splice(0,firstH,{type:'lead',text:lead});
  }
  return blocks;
}
function buildHtml(data,mode){
  if(mode==='complete'){
    const host=document.createElement('div');
    host.innerHTML=global.PENAL_FULL_THEORY?.p5?.html||'';

    // O leitor já possui título/cabeçalho próprio: remove a capa textual antes da primeira seção.
    const firstH2=host.querySelector('h2');
    if(firstH2){
      let node=host.firstChild;
      while(node && node!==firstH2){
        const next=node.nextSibling;
        node.remove();
        node=next;
      }
    }

    const headings=[];
    host.querySelectorAll('h2').forEach((h,index)=>{
      if(!h.id)h.id='bcsec-complete-'+(index+1)+'-'+slug(h.textContent);
      headings.push({id:h.id,text:norm(h.textContent),level:2,key:normKey(h.textContent)});
    });

    host.querySelectorAll('blockquote').forEach(el=>el.classList.add('bc-native-callout','theory'));
    host.querySelectorAll('table').forEach(el=>el.classList.add('bc-native-m05-table'));
    host.querySelectorAll('h3').forEach(el=>el.classList.add('bc-native-m05-subhead'));
    host.querySelectorAll('hr').forEach(el=>el.classList.add('bc-native-m05-separator'));

    const text=norm(host.textContent);
    const words=text.split(/\s+/).filter(Boolean).length;
    const mins=Math.max(1,Math.round(words/190));
    return {body:host.innerHTML,headings,words,mins};
  }

  const raw=mode==='summary'?data.summary:data.complete;
  const blocks=parse(raw,mode);
  const headings=[];
  let hCount=0;
  const body=blocks.map(b=>{
    if(b.type==='h'){
      const id='bcsec-'+(++hCount)+'-'+slug(b.text);
      headings.push({id,text:b.text,level:b.level,key:normKey(b.text)});
      return '<h'+b.level+' id="'+id+'">'+esc(b.text)+'</h'+b.level+'>';
    }
    if(b.type==='lead')return '<p class="lead">'+esc(b.text)+'</p>';
    if(b.type==='p')return '<p>'+esc(b.text)+'</p>';
    if(b.type==='ul')return '<ul>'+b.items.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>';
    if(b.type==='callout')return '<aside class="bc-native-callout '+b.kind+'"><b>'+esc(b.label)+'</b><div>'+esc(b.text)+'</div></aside>';
    return '';
  }).join('');
  const words=norm(raw).split(/\s+/).filter(Boolean).length;
  const mins=Math.max(1,Math.round(words/(mode==='summary'?220:190)));
  return {body,headings,words,mins};
}
function modeChapters(data,mode){return Array.isArray(data?.chapters?.[mode])?data.chapters[mode]:[]}
function modeQuestions(data,mode){return Array.isArray(data?.internalQuestions?.[mode])?data.internalQuestions[mode]:[]}
function chapterDone(mode,id){return localStorage.getItem(storageKey('chapter:'+mode+':'+id))==='1'}
function setChapterDone(mode,id,done){
  localStorage.setItem(storageKey('chapter:'+mode+':'+id),done?'1':'0');
}
function internalAnswer(mode,id){
  try{return JSON.parse(localStorage.getItem(storageKey('internal:'+mode+':'+id))||'null')}catch(_){return null}
}
function saveInternalAnswer(mode,q,selected){
  const prev=internalAnswer(mode,q.id)||{attempts:0};
  const state={
    selected:Number(selected),
    correct:Number(selected)===Number(q.answer),
    attempts:(prev.attempts||0)+1,
    updatedAt:new Date().toISOString()
  };
  localStorage.setItem(storageKey('internal:'+mode+':'+q.id),JSON.stringify(state));
  return state;
}
function resetInternalAnswer(mode,id){localStorage.removeItem(storageKey('internal:'+mode+':'+id))}

function modeStudyStats(data,mode){
  const chapters=modeChapters(data,mode);
  const questions=modeQuestions(data,mode);
  const chapterDoneCount=chapters.filter(ch=>chapterDone(mode,ch.id)).length;
  const answered=questions.filter(q=>!!internalAnswer(mode,q.id)).length;
  const correct=questions.filter(q=>internalAnswer(mode,q.id)?.correct).length;
  return {
    chapterDone:chapterDoneCount,
    chapterTotal:chapters.length,
    answered,
    questionTotal:questions.length,
    correct,
    done:chapterDoneCount+answered,
    total:chapters.length+questions.length
  };
}
function theoryStats(){
  const data=source();
  if(!data)return {done:0,total:0,pct:0};
  const s=modeStudyStats(data,'summary');
  const c=modeStudyStats(data,'complete');
  const done=s.done+c.done,total=s.total+c.total;
  return {done,total,pct:total?Math.round(done/total*100):0,summary:s,complete:c};
}
function externalStats(){
  try{
    const rows=JSON.parse(localStorage.getItem('central-v6:module-rounds:penal:p5')||'[]');
    const valid=(Array.isArray(rows)?rows:[]).map(r=>({
      done:Math.max(0,Number(r.valid ?? r.done)||0),
      correct:Math.max(0,Number(r.correct)||0)
    })).filter(r=>r.done>0);
    const answered=valid.reduce((n,r)=>n+r.done,0);
    const correct=valid.reduce((n,r)=>n+Math.min(r.correct,r.done),0);
    return {answered,correct,rounds:valid.length,accuracy:answered?Math.round(correct/answered*100):null};
  }catch(_){
    return {answered:0,correct:0,rounds:0,accuracy:null};
  }
}
function setRing(el,pct,label){
  if(!el)return;
  const safe=Math.max(0,Math.min(100,Number(pct)||0));
  el.style.setProperty('--pct',String(safe));
  const value=el.querySelector('[data-ring-value]');
  if(value)value.textContent=label??(safe+'%');
}
function refreshModuleMetrics(){
  const module=document.querySelector(M1_SELECTOR);
  if(!module)return;
  const theory=theoryStats(),external=externalStats();

  setRing(module.querySelector('[data-native-ring="theory"]'),theory.pct,theory.pct+'%');
  const theoryDetail=module.querySelector('[data-native-metric-detail="theory"]');
  if(theoryDetail)theoryDetail.textContent=theory.done+' de '+theory.total+' pontos concluídos';

  setRing(module.querySelector('[data-native-ring="external"]'),external.accuracy??0,external.accuracy==null?'—':external.accuracy+'%');
  const extDetail=module.querySelector('[data-native-metric-detail="external"]');
  if(extDetail){
    extDetail.textContent=external.answered
      ? external.correct+' acertos em '+external.answered+' questões externas'
      : 'Nenhuma questão externa respondida';
  }
  const extMeta=module.querySelector('[data-native-metric-meta="external"]');
  if(extMeta)extMeta.textContent=external.answered
    ? external.rounds+' rodada(s) registrada(s) no final do módulo'
    : 'Registre questões externas no final do módulo';

  const headerStat=module.querySelector('.cf-module-stat');
  if(headerStat)headerStat.textContent='Cobertura '+theory.pct+'% • teoria + revisão interna';
  const legacyBar=module.querySelector('.cf-module-bar span');
  if(legacyBar)legacyBar.style.width=theory.pct+'%';
  refreshCardState();
}
function refreshCardState(){
  const data=source();if(!data)return;
  ['summary','complete'].forEach(kind=>{
    const st=modeStudyStats(data,kind);
    document.querySelectorAll(M1_SELECTOR+' [data-native-kind="'+kind+'"]').forEach(card=>{
      const tag=card.querySelector('.bc-native-material-action span:first-child');
      if(tag)tag.textContent=st.done===st.total&&st.total?'✓ Concluído':st.chapterDone+'/'+st.chapterTotal+' capítulos';
    });
  });
}

function close(){
  document.getElementById(OVERLAY_ID)?.remove();
  document.body.style.overflow='';
  current=null;
}
function buildChapterMap(){
  if(!current)return [];
  return modeChapters(source(),current.mode).map(ch=>({chapter:ch,heading:findHeadingForChapter(ch)})).filter(x=>x.heading);
}
function autoMarkViewedChapters(){
  if(!current||!current.chapterMap?.length)return;
  const sc=current.scroll;
  const viewportBottom=sc.scrollTop+sc.clientHeight;
  let changed=false;
  current.chapterMap.forEach((item,index)=>{
    if(chapterDone(current.mode,item.chapter.id))return;
    const start=item.heading.offsetTop;
    const next=current.chapterMap[index+1]?.heading?.offsetTop ?? current.article.scrollHeight;
    const target=start+Math.max(80,(next-start)*0.72);
    if(viewportBottom>=target){
      setChapterDone(current.mode,item.chapter.id,true);
      changed=true;
    }
  });
  if(changed)refreshReaderStudyUI();
}
function updateScrollProgress(){
  if(!current)return;
  const sc=current.scroll;
  const max=Math.max(1,sc.scrollHeight-sc.clientHeight);
  const pct=Math.max(0,Math.min(100,sc.scrollTop/max*100));
  const bar=current.overlay.querySelector('.bc-native-reader-progress');
  if(bar)bar.style.width=pct+'%';
  localStorage.setItem(storageKey(current.mode+':scroll'),String(sc.scrollTop));
  autoMarkViewedChapters();
}
function restoreScroll(){
  if(!current)return;
  const v=Number(localStorage.getItem(storageKey(current.mode+':scroll'))||0);
  if(v>0)current.scroll.scrollTop=v;
}
function setFont(delta){
  if(!current)return;
  current.font=Math.max(14,Math.min(21,current.font+delta));
  current.article.style.fontSize=current.font+'px';
  localStorage.setItem(storageKey('font'),String(current.font));
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
      frag.append(raw.slice(pos,idx));
      const mk=document.createElement('mark');mk.className='bc-native-search-hit';mk.textContent=raw.slice(idx,idx+term.length);frag.append(mk);
      n++;pos=idx+term.length;
    }
    frag.append(raw.slice(pos));node.replaceWith(frag);
  }
  root.querySelector('mark.bc-native-search-hit')?.scrollIntoView({block:'center'});
  return n;
}
function findHeadingForChapter(chapter){
  if(!current)return null;
  const target=normKey(chapter.title).replace(/^\d+\s+/,'');
  const words=target.split(' ').filter(w=>w.length>3);
  const headings=Array.from(current.article.querySelectorAll('h2,h3'));
  let best=null,bestScore=0;
  for(const h of headings){
    const hk=normKey(h.textContent);
    let score=0;
    words.forEach(w=>{if(hk.includes(w))score++});
    if(score>bestScore){bestScore=score;best=h}
  }
  return bestScore>=Math.max(1,Math.min(2,words.length))?best:null;
}
function refreshReaderStudyUI(){
  if(!current)return;
  const data=source(),st=modeStudyStats(data,current.mode);
  const value=current.overlay.querySelector('[data-reader-study-value]');
  const bar=current.overlay.querySelector('[data-reader-study-bar]');
  const qscore=current.overlay.querySelector('[data-reader-internal-score]');
  if(value)value.textContent=st.done+' / '+st.total+' pontos';
  if(bar)bar.style.width=(st.total?Math.round(st.done/st.total*100):0)+'%';
  if(qscore)qscore.textContent=st.answered
    ? st.correct+' acertos em '+st.answered+' respondidas'
    : 'Nenhuma questão interna respondida';

  current.overlay.querySelectorAll('[data-chapter-check]').forEach(btn=>{
    const done=chapterDone(current.mode,btn.dataset.chapterCheck);
    btn.classList.toggle('done',done);
    btn.setAttribute('aria-pressed',String(done));
    btn.textContent=done?'✓':'';
  });
  refreshModuleMetrics();
}
function chapterTocHtml(data,mode){
  return modeChapters(data,mode).map((ch,i)=>{
    const done=chapterDone(mode,ch.id);
    return '<div class="bc-native-toc-row">'+
      '<button type="button" class="bc-native-chapter-check '+(done?'done':'')+'" data-chapter-check="'+esc(ch.id)+'" aria-pressed="'+done+'" title="Marcar capítulo">'+(done?'✓':'')+'</button>'+
      '<button type="button" class="bc-native-chapter-jump" data-chapter-jump="'+esc(ch.id)+'"><span>'+(i+1)+'.</span>'+esc(ch.title)+'</button>'+
    '</div>';
  }).join('');
}
function quizHtml(data,mode){
  const qs=modeQuestions(data,mode);
  if(!qs.length)return '';
  const cards=qs.map((q,i)=>{
    const a=internalAnswer(mode,q.id);
    const options=q.options.map((op,idx)=>{
      let cls='';
      if(a){
        if(idx===q.answer)cls+=' correct';
        if(idx===a.selected&&idx!==q.answer)cls+=' wrong';
      }
      return '<button type="button" class="bc-native-quiz-option'+cls+'" data-internal-q="'+esc(q.id)+'" data-option="'+idx+'" '+(a?'disabled':'')+'><span>'+String.fromCharCode(65+idx)+'</span>'+esc(op)+'</button>';
    }).join('');
    return '<article class="bc-native-quiz-card" data-quiz-card="'+esc(q.id)+'">'+
      '<div class="bc-native-quiz-number">Questão '+(i+1)+' de '+qs.length+'</div>'+
      '<h3>'+esc(q.q)+'</h3>'+
      '<div class="bc-native-quiz-options">'+options+'</div>'+
      '<div class="bc-native-quiz-feedback '+(a?(a.correct?'ok':'bad'):'')+'" data-quiz-feedback>'+
        (a?'<b>'+(a.correct?'✓ Correto':'✕ Incorreto')+'</b><span>'+esc(q.explanation)+'</span><button type="button" data-internal-retry="'+esc(q.id)+'">Refazer</button>':'<span>Escolha uma alternativa para receber o feedback.</span>')+
      '</div>'+
    '</article>';
  }).join('');
  return '<section class="bc-native-internal-review">'+
    '<div class="bc-native-internal-review-head"><div><span class="bc-native-kicker">REVISÃO ATIVA INTERNA</span><h2>'+qs.length+' questões de assimilação</h2><p>Estas questões contam na <b>cobertura da teoria</b>. Elas não entram no gráfico de questões externas.</p></div><div class="bc-native-internal-score" data-reader-internal-score></div></div>'+
    cards+
  '</section>';
}
function bindQuiz(){
  if(!current)return;
  const data=source();
  current.overlay.querySelectorAll('[data-internal-q]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const q=modeQuestions(data,current.mode).find(x=>x.id===btn.dataset.internalQ);
      if(!q)return;
      saveInternalAnswer(current.mode,q,Number(btn.dataset.option));
      rerenderQuizCard(q.id);
      refreshReaderStudyUI();
    });
  });
  current.overlay.querySelectorAll('[data-internal-retry]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      resetInternalAnswer(current.mode,btn.dataset.internalRetry);
      rerenderQuizCard(btn.dataset.internalRetry);
      refreshReaderStudyUI();
    });
  });
}
function rerenderQuizCard(id){
  if(!current)return;
  const data=source(),q=modeQuestions(data,current.mode).find(x=>x.id===id);
  const old=current.overlay.querySelector('[data-quiz-card="'+CSS.escape(id)+'"]');
  if(!q||!old)return;
  const i=modeQuestions(data,current.mode).findIndex(x=>x.id===id);
  const a=internalAnswer(current.mode,id);
  const options=q.options.map((op,idx)=>{
    let cls='';
    if(a){
      if(idx===q.answer)cls+=' correct';
      if(idx===a.selected&&idx!==q.answer)cls+=' wrong';
    }
    return '<button type="button" class="bc-native-quiz-option'+cls+'" data-internal-q="'+esc(q.id)+'" data-option="'+idx+'" '+(a?'disabled':'')+'><span>'+String.fromCharCode(65+idx)+'</span>'+esc(op)+'</button>';
  }).join('');
  old.innerHTML='<div class="bc-native-quiz-number">Questão '+(i+1)+' de '+modeQuestions(data,current.mode).length+'</div>'+
    '<h3>'+esc(q.q)+'</h3><div class="bc-native-quiz-options">'+options+'</div>'+
    '<div class="bc-native-quiz-feedback '+(a?(a.correct?'ok':'bad'):'')+'" data-quiz-feedback>'+
      (a?'<b>'+(a.correct?'✓ Correto':'✕ Incorreto')+'</b><span>'+esc(q.explanation)+'</span><button type="button" data-internal-retry="'+esc(q.id)+'">Refazer</button>':'<span>Escolha uma alternativa para receber o feedback.</span>')+
    '</div>';
  bindQuiz();
}
function open(mode){
  const data=source();if(!data){alert('Conteúdo nativo do M01 ainda não foi carregado.');return}
  close();
  const parsed=buildHtml(data,mode);
  const label=mode==='summary'?'Conteúdo resumido':'Conteúdo completo';
  const chapters=modeChapters(data,mode),questions=modeQuestions(data,mode);
  const ov=document.createElement('div');
  ov.id=OVERLAY_ID;ov.className='bc-native-reader-overlay';
  ov.innerHTML='<section class="bc-native-reader" role="dialog" aria-modal="true" aria-label="'+esc(label)+'">'+
    '<header class="bc-native-reader-head"><div class="bc-native-reader-title"><b>PEN M05 — '+esc(data.title)+'</b><small>'+label+' • experiência nativa da Base Completa</small></div><span class="bc-native-reader-meta">'+parsed.words.toLocaleString('pt-BR')+' palavras • ~'+parsed.mins+' min</span><button class="bc-native-reader-close" data-native-action="close" aria-label="Fechar">×</button><div class="bc-native-reader-progress-track"><div class="bc-native-reader-progress"></div></div></header>'+
    '<div class="bc-native-reader-tools"><input type="search" placeholder="Buscar neste material…" aria-label="Buscar"><button data-native-action="smaller">A−</button><button data-native-action="larger">A+</button><button class="primary" data-native-action="top">Ir ao topo</button></div>'+
    '<div class="bc-native-reader-body">'+
      '<nav class="bc-native-toc"><div class="bc-native-toc-label">Capítulos para concluir</div>'+chapterTocHtml(data,mode)+'</nav>'+
      '<main class="bc-native-scroll"><article class="bc-native-article">'+
        '<div class="bc-native-kicker">'+(mode==='summary'?'PRIMEIRA LEITURA + REVISÃO':'TEORIA INTEGRAL')+'</div>'+
        '<h1>'+esc(data.title)+'</h1>'+
        '<p class="lead">'+(mode==='summary'?'Versão condensada para compreender o módulo e revisar os pontos de maior rendimento.':'Conteúdo integral convertido para leitura nativa, sem leitor de PDF.')+'</p>'+
        '<section class="bc-native-study-progress"><div><b>Progresso neste material</b><span data-reader-study-value>0 / '+(chapters.length+questions.length)+' pontos</span></div><div class="bc-native-study-progress-track"><span data-reader-study-bar></span></div><small>'+chapters.length+' capítulos + '+questions.length+' questões internas. Os capítulos recebem check automaticamente conforme você avança; as questões internas também entram na cobertura da teoria.</small></section>'+
        parsed.body+
        quizHtml(data,mode)+
      '</article></main>'+
    '</div></section>';
  document.body.appendChild(ov);document.body.style.overflow='hidden';

  current={
    mode,overlay:ov,scroll:ov.querySelector('.bc-native-scroll'),article:ov.querySelector('.bc-native-article'),
    font:Number(localStorage.getItem(storageKey('font'))||16),chapterMap:[]
  };
  current.article.style.fontSize=current.font+'px';
  current.scroll.addEventListener('scroll',updateScrollProgress,{passive:true});
  ov.querySelector('[data-native-action="close"]').onclick=close;
  ov.querySelector('[data-native-action="smaller"]').onclick=()=>setFont(-1);
  ov.querySelector('[data-native-action="larger"]').onclick=()=>setFont(1);
  ov.querySelector('[data-native-action="top"]').onclick=()=>current.scroll.scrollTo({top:0,behavior:'smooth'});
  ov.querySelector('.bc-native-reader-tools input').addEventListener('input',e=>search(e.target.value));

  ov.querySelectorAll('[data-chapter-check]').forEach(btn=>{
    btn.onclick=()=>{
      const id=btn.dataset.chapterCheck;
      setChapterDone(mode,id,!chapterDone(mode,id));
      refreshReaderStudyUI();
    };
  });
  ov.querySelectorAll('[data-chapter-jump]').forEach(btn=>{
    btn.onclick=()=>{
      const ch=modeChapters(data,mode).find(x=>x.id===btn.dataset.chapterJump);
      findHeadingForChapter(ch)?.scrollIntoView({behavior:'smooth',block:'start'});
    };
  });

  bindQuiz();
  ov.addEventListener('click',e=>{if(e.target===ov)close()});
  requestAnimationFrame(()=>{
    current.chapterMap=buildChapterMap();
    restoreScroll();updateScrollProgress();refreshReaderStudyUI();autoMarkViewedChapters();
  });
}
function openMap(){
  if(global.BaseMindMap?.open)global.BaseMindMap.open('penal','p5');
  else alert('O mapa mental interativo ainda está carregando. Tente novamente em alguns segundos.');
}
function removeLegacyM01Content(){
  const module=document.querySelector(M1_SELECTOR);
  if(!module)return;
  module.querySelectorAll('.bc-session-nav,.bc-session-pager').forEach(el=>el.remove());
}
function inject(){
  const module=document.querySelector(M1_SELECTOR);if(!module)return;
  removeLegacyM01Content();
  const body=module.querySelector('.cf-module-body');if(!body)return;

  // Fallback: a renderização principal já entrega os cards diretamente.
  if(!body.querySelector('.bc-native-materials')){
    const host=document.createElement('section');host.className='bc-native-materials';
    host.innerHTML='<div class="bc-native-materials-head"><div><b>Materiais do módulo</b><small>Escolha como estudar</small></div><small>Piloto M05 • conteúdo nativo</small></div>'+
      '<div class="bc-native-material-grid">'+
        '<button class="bc-native-material-card" data-native-kind="summary"><span class="bc-native-material-icon">⚡</span><span><strong>Conteúdo resumido</strong><small>Primeira leitura, revisão rápida, artigos, pegadinhas e revisão ativa.</small></span><span class="bc-native-material-action"><span>Abrir</span><span>→</span></span></button>'+
        '<button class="bc-native-material-card" data-native-kind="complete"><span class="bc-native-material-icon">📚</span><span><strong>Conteúdo completo</strong><small>Teoria integral do M05 em formato de site, com índice, busca e progresso de leitura.</small></span><span class="bc-native-material-action"><span>Abrir</span><span>→</span></span></button>'+
        '<button class="bc-native-material-card" data-native-kind="mindmap"><span class="bc-native-material-icon">🧠</span><span><strong>Mapa mental</strong><small>Mapa interativo com abrir/recolher ramos, zoom, arrastar e tela cheia.</small></span><span class="bc-native-material-action"><span>Abrir</span><span>→</span></span></button>'+
      '</div>';
    host.querySelector('[data-native-kind="summary"]').onclick=()=>open('summary');
    host.querySelector('[data-native-kind="complete"]').onclick=()=>open('complete');
    host.querySelector('[data-native-kind="mindmap"]').onclick=openMap;
    const subtitle=body.querySelector('.cf-subtitle');
    if(subtitle)subtitle.insertAdjacentElement('afterend',host);else body.insertAdjacentElement('afterbegin',host);
  }
  refreshModuleMetrics();
}
function install(){
  inject();
  observer=new MutationObserver(()=>{
    clearTimeout(install._t);
    install._t=setTimeout(()=>{removeLegacyM01Content();inject();refreshModuleMetrics()},60);
  });
  observer.observe(document.documentElement,{subtree:true,childList:true});
  global.addEventListener('focus',refreshModuleMetrics);
}
global.BaseNativeReaderM05={
  open,close,refreshMetrics:refreshModuleMetrics,theoryStats,externalStats,
  version:'2026.10.02-m05-pilot1'
};
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.getElementById(OVERLAY_ID))close()});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})(window);

/* M06 preview bundled */
(function(global){
'use strict';
global.BASE_NATIVE_CONTENT=global.BASE_NATIVE_CONTENT||{};
global.BASE_NATIVE_CONTENT.penal=global.BASE_NATIVE_CONTENT.penal||{};
global.BASE_NATIVE_CONTENT.penal.m06={"moduleId":"p6","number":6,"title":"Concurso de Pessoas","updatedAt":"2026-10-02","sources":{"completeDriveId":"1YrV-UwF_k-Ks3WJ0KjXpNwEUNzPhNkhd","completeTheoryKey":"p6","summaryDriveId":"1R1D4anytd5zTJDGw_7ZXSS4-huers1WR","mindMapDriveId":"142bCrNsumig3tM4JuAW2TeCie5NUd5iL"},"summary":"PEN M6 - Concurso de Pessoas 1 / 4\r\nBASE COMPLETA - DIREITO PENAL\r\nPEN M6 - Concurso de Pessoas\r\nResumo para primeira leitura e revisão rápida\r\n1. Visão geral\r\nIdeia central: concurso de pessoas ocorre quando duas ou mais pessoas contribuem para a mesma infração penal. A prova\r\ncostuma exigir: quem é autor, coautor ou partícipe, qual foi a contribuição de cada um e se incide alguma regra especial dos\r\narts. 29 a 31 do Código Penal.\r\nConcurso eventual\r\nO crime pode ser praticado por uma pessoa, mas admite pluralidade.\r\nSão os crimes monossubjetivos.\r\nConcurso necessário\r\nO próprio tipo exige pluralidade de agentes. São os crimes\r\nplurissubjetivos.\r\nRequisitos do concurso de pessoas\r\nRequisito O que significa\r\nPluralidade de agentes e condutas Duas ou mais pessoas contribuem para o fato.\r\nRelevância da contribuição A conduta deve efetivamente colaborar para o crime; mera presença ou conhecimento não\r\nbastam.\r\nLiame subjetivo Consciência e vontade de cooperar com a realização do fato comum. Não exige ajuste\r\nprévio formal.\r\nIdentidade de infração Como regra, os concorrentes respondem pelo mesmo fato, com responsabilidade\r\nindividualizada.\r\nMEMÓRIA: P-R-L-I = Pluralidade - Relevância - Liame - Identidade.\r\n2. Teoria - autoria, coautoria e participação\r\nAutor\r\nOcupa posição autoral na realização do fato.\r\nNão é apenas quem executa materialmente\r\no verbo do tipo.\r\nCoautor\r\nRealiza o fato em conjunto, com divisão\r\nfuncional de tarefas e vínculo subjetivo.\r\nPartícipe\r\nContribui de forma acessória para fato\r\nalheio, sem assumir posição de autor.\r\nPrincipais teorias da autoria\r\nTeoria Essência Atenção\r\nObjetivo-formal Autor é quem pratica o núcleo do tipo. É clara, mas não explica bem todas as hipóteses de autoria\r\nmediata e coautoria funcional.\r\nObjetivo-material Autor é quem presta a contribuição mais\r\nrelevante ao resultado.\r\nHá dificuldade em medir qual contribuição é \"mais importante\".\r\nDomínio do fato Em crimes dolosos, identifica quem detém\r\ncontrole relevante da realização.\r\nNão dispensa prova e não transforma chefia, cargo ou influência\r\nem autoria automática.PEN M6 - Concurso de Pessoas 2 / 4\r\nBASE COMPLETA - DIREITO PENAL\r\nTeoria essencial\r\nAutoria, participação, acessoriedade e regras especiais\r\n3. Formas de autoria e participação\r\nAutoria direta\r\nO agente realiza diretamente a conduta típica.\r\nAutoria mediata\r\nO autor utiliza outra pessoa como instrumento. Pode ocorrer,\r\nconforme o caso, em erro provocado, coação, obediência hierárquica\r\nou inimputabilidade instrumentalizada.\r\nCoautoria sucessiva\r\nO agente adere depois do início da execução e passa a\r\ndesempenhar função autoral enquanto o fato ainda está em curso.\r\nAutoria de escritório\r\nConstrução doutrinária ligada a aparatos organizados de poder. Não\r\nse presume por mera posição de chefia.\r\nCoautoria x autoria colateral\r\nCoautoria Autoria colateral\r\nHá liame subjetivo e atuação conjunta. Agentes atuam paralelamente sem saber um do outro.\r\nEx.: um rende a vítima e outro recolhe os bens dentro do plano\r\ncomum.\r\nEx.: dois atiradores independentes disparam contra a mesma vítima.\r\n- Incerta: não se sabe qual conduta causou o resultado; não se pode\r\npresumir o nexo causal.\r\nParticipação\r\nForma Como reconhecer\r\nInduzimento Cria a ideia criminosa que antes não existia.\r\nInstigação Reforça uma decisão criminosa já existente.\r\nAuxílio Facilita materialmente a execução: instrumento, chave, informação, transporte acessório etc.\r\nAjuda posterior: depois de consumado e encerrado o crime, em regra não há participação no fato anterior. Pode surgir crime autônomo. Se a\r\najuda posterior foi prometida antes e influenciou a execução, a análise muda.\r\n4. Acessoriedade da participação\r\nTeoria Fato principal necessário\r\nMínima Típico\r\nLimitada Típico + ilícito - posição predominante para prova.\r\nMáxima Típico + ilícito + culpável\r\nHiperacessória Crime completo, inclusive punibilidade.\r\n5. Duas regras muito cobradas\r\nParticipação de menor importância - art. 29, §1º\r\nContribuição acessória de pequena relevância. Pena pode ser\r\ndiminuída de 1/6 a 1/3. Não decorre do simples fato de o agente estar\r\nlonge do local ou executar tarefa secundária.\r\nCooperação dolosamente distinta - art. 29, §2º\r\nO agente quis participar de crime menos grave, mas outro pratica\r\ncrime mais grave. Responde pelo crime menos grave; se o resultado\r\nmais grave era previsível, a pena pode aumentar até metade.\r\nNão confunda: menor importância analisa a relevância da contribuição; cooperação dolosamente distinta analisa o limite do dolo do\r\nconcorrente.PEN M6 - Concurso de Pessoas 3 / 4\r\nBASE COMPLETA - DIREITO PENAL\r\nComunicabilidade e situações especiais\r\nArt. 30, crimes próprios, mão própria, culposos e omissivos\r\n6. Art. 30 - o que comunica?\r\nRegra: circunstâncias e condições de caráter pessoal não se comunicam, salvo quando forem elementares do crime.\r\nElemento Regra Exemplo mental\r\nElementar Integra a própria definição do crime. Pode comunicar-se quando\r\nconhecida pelo concorrente.\r\nCondição de funcionário público no\r\npeculato.\r\nCircunstância pessoal Em regra, não se comunica. Motivo estritamente pessoal de um dos\r\nagentes.\r\nCondição pessoal Em regra, não se comunica; se for elementar, aplica-se a exceção. Qualidade exigida pelo tipo próprio.\r\n7. Crimes próprios, de mão própria, culposos e omissivos\r\nSituação Regra resumida\r\nCrime próprio Exige qualidade especial do sujeito ativo. Em regra, admite coautoria e participação; a elementar pessoal pode\r\nalcançar o terceiro que a conhece.\r\nCrime de mão própria Execução personalíssima. Na formulação tradicional, não admite coautoria executória, mas admite\r\nparticipação em tese. Há debate doutrinário em hipóteses específicas.\r\nCrime culposo Predomina a admissibilidade de coautoria culposa. A participação stricto sensu é controvertida e\r\nmajoritariamente negada.\r\nCrime omissivo Verifique quem tinha dever jurídico de agir. A omissão pode ter papel autoral ou participativo, conforme a\r\nposição de garantidor e o caso concreto.\r\nParticipação por omissão: exige dever jurídico de agir, possibilidade de atuação e dolo de favorecer o crime. Mera passividade moralmente\r\nreprovável não basta.\r\n8. Artigos para decorar\r\nArt. 29, caput - Quem concorre para o crime incide nas penas a ele cominadas, na medida de sua culpabilidade.\r\nArt. 29, §1º - Participação de menor importância: redução de 1/6 a 1/3.\r\nArt. 29, §2º - Quis participar de crime menos grave: aplica-se a pena deste; se era previsível o resultado mais grave, aumento até metade.\r\nArt. 30 - Circunstâncias e condições pessoais não se comunicam, salvo quando elementares do crime.\r\nArt. 31 - Ajuste, determinação/instigação e auxílio, salvo disposição expressa em contrário, não são puníveis se o crime não chega, pelo\r\nmenos, a ser tentado.\r\nMapa: 29 = quem responde | 30 = o que comunica | 31 = quando a participação começa a ser punível.PEN M6 - Concurso de Pessoas 4 / 4\r\nBASE COMPLETA - DIREITO PENAL\r\nPegadinhas + revisão ativa\r\nFechamento rápido do PEN M6\r\n9. Pegadinhas de prova\r\n1. Liame subjetivo\r\nNão exige acordo prévio formal. Basta consciência e vontade de\r\ncooperar.\r\n2. Teoria monista\r\nMesmo crime não significa mesma pena para todos.\r\n3. Domínio do fato\r\nNão é presunção de autoria e não dispensa prova.\r\n4. Coautoria x colateral\r\nO ponto decisivo é o vínculo subjetivo.\r\n5. Induzir x instigar\r\nInduzir cria a ideia; instigar reforça ideia já existente.\r\n6. Menor importância\r\nNão basta ter função simples; a contribuição precisa ser realmente\r\npouco relevante.\r\n7. Art. 29, §2º\r\nPrevisibilidade não faz o agente responder automaticamente pelo\r\ncrime mais grave: autoriza aumento da pena do crime menos grave.\r\n8. Art. 30\r\n\"Pessoal não comunica\" tem exceção: se for elementar do crime.\r\n9. Próprio x mão própria\r\nNão são sinônimos. Crime próprio exige qualidade; mão própria\r\nexige execução pessoal.\r\n10. Crime culposo\r\nÉ errado afirmar que nunca admite concurso: a coautoria culposa é\r\namplamente admitida.\r\n11. Art. 31\r\nEm regra, sem ao menos tentativa, ajuste/instigação/auxílio não são\r\npuníveis como participação.\r\n12. Omissão\r\nSem dever jurídico de agir, a simples inércia não vira participação\r\npenal.\r\n10. Revisão ativa\r\n1. Quais são os quatro requisitos do concurso de pessoas?\r\nResposta: Pluralidade, relevância, liame subjetivo e identidade de infração.\r\n2. Qual é a diferença central entre coautoria e autoria colateral?\r\nResposta: Na coautoria existe vínculo subjetivo; na autoria colateral, não.\r\n3. Induzimento, instigação e auxílio: como diferenciar?\r\nResposta: Cria a ideia; reforça a ideia; facilita materialmente.\r\n4. O que a acessoriedade limitada exige?\r\nResposta: Fato principal típico e ilícito.\r\n5. Qual a redução da participação de menor importância?\r\nResposta: De 1/6 a 1/3.\r\n6. No art. 29, §2º, o que ocorre se o resultado mais grave era previsível?\r\nResposta: Aplica-se a pena do crime menos grave, com possível aumento de até metade.\r\n7. Qual a regra do art. 30?\r\nResposta: Condições e circunstâncias pessoais não se comunicam, salvo quando elementares.\r\n8. Qual a regra tradicional para crime de mão própria?\r\nResposta: Execução personalíssima; em regra não há coautoria executória, mas participação é possível em tese.\r\n9. Coautoria em crime culposo é possível?\r\nResposta: Sim, predominantemente. Participação stricto sensu é controvertida.\r\n10. Quando ajuste, instigação e auxílio passam a ser puníveis como participação?\r\nResposta: Em regra, quando o crime chega pelo menos à tentativa, salvo previsão expressa em contrário.\r\nMapa final de prova: fato principal -> liame subjetivo -> papel de cada agente -> art. 29, §§1º e 2º -> art. 30 -> art. 31.","chapters":{"summary":[{"id":"s01","title":"1. Visão geral"},{"id":"s02","title":"2. Teoria - autoria, coautoria e participação"},{"id":"s03","title":"3. Formas de autoria e participação"},{"id":"s04","title":"4. Acessoriedade da participação"},{"id":"s05","title":"5. Duas regras muito cobradas"},{"id":"s06","title":"6. Art. 30 - o que comunica?"},{"id":"s07","title":"7. Crimes próprios, de mão própria, culposos e omissivos"},{"id":"s08","title":"8. Artigos para decorar"},{"id":"s09","title":"9. Pegadinhas de prova"}],"complete":[{"id":"c01","title":"Conceito, concurso eventual/necessário e requisitos"},{"id":"c02","title":"Teoria monista e suas exceções/temperamentos"},{"id":"c03","title":"Autoria: teorias e limites do domínio do fato"},{"id":"c04","title":"Autor direto, autoria intelectual e autoria mediata"},{"id":"c05","title":"Coautoria, coautoria sucessiva e autoria colateral"},{"id":"c06","title":"Participação: induzimento, instigação, auxílio, cadeia e omissão"},{"id":"c07","title":"Teorias da acessoriedade e art. 31"},{"id":"c08","title":"Participação de menor importância"},{"id":"c09","title":"Cooperação dolosamente distinta"},{"id":"c10","title":"Comunicabilidade — art. 30"},{"id":"c11","title":"Crimes próprios e crimes de mão própria"},{"id":"c12","title":"Concurso de pessoas em crimes culposos"},{"id":"c13","title":"Concurso de pessoas em crimes omissivos"},{"id":"c14","title":"Quadros comparativos FCC"},{"id":"c15","title":"O que decorar e pegadinhas"}]},"internalQuestions":{"summary":[{"id":"sq01","q":"Quais são os quatro requisitos estruturais do concurso de pessoas destacados no M06?","options":["Pluralidade, relevância, liame subjetivo e identidade de infração.","Tipicidade, ilicitude, culpabilidade e punibilidade.","Autoria, coautoria, participação e tentativa.","Dolo, culpa, resultado e nexo causal."],"answer":0,"explanation":"O resumo usa o mnemônico P-R-L-I: pluralidade, relevância da contribuição, liame subjetivo e identidade de infração."},{"id":"sq02","q":"Qual é a diferença decisiva entre coautoria e autoria colateral?","options":["Na coautoria existe liame subjetivo; na autoria colateral, não.","Na autoria colateral todos executam o mesmo verbo do tipo.","Na coautoria não pode haver divisão de tarefas.","Na autoria colateral sempre se identifica o causador do resultado."],"answer":0,"explanation":"O ponto divisor indicado no material é o vínculo subjetivo entre os agentes."},{"id":"sq03","q":"Induzimento, instigação e auxílio significam, respectivamente:","options":["Criar a ideia criminosa; reforçar ideia já existente; facilitar materialmente a execução.","Executar o núcleo; criar a ideia; desistir da execução.","Reforçar a ideia; criar a ideia; praticar o verbo do tipo.","Facilitar materialmente; executar o crime; criar a ideia."],"answer":0,"explanation":"O resumo diferencia: induzir cria a resolução, instigar reforça a resolução já existente e auxiliar presta facilitação material acessória."},{"id":"sq04","q":"Na participação de menor importância do art. 29, §1º, a redução prevista é de:","options":["1/6 a 1/3.","1/3 a 2/3.","Metade obrigatoriamente.","Até metade, sem mínimo."],"answer":0,"explanation":"O material registra a redução de um sexto a um terço para participação de menor importância."},{"id":"sq05","q":"Qual é a regra central do art. 30 do Código Penal, conforme o M06?","options":["Condições e circunstâncias pessoais não se comunicam, salvo quando elementares do crime.","Toda circunstância pessoal se comunica aos concorrentes.","Elementares nunca se comunicam.","Somente motivos pessoais se comunicam."],"answer":0,"explanation":"O art. 30 é resumido no material pela incomunicabilidade das condições e circunstâncias pessoais, com exceção das elementares do crime."}],"complete":[{"id":"cq01","q":"A teoria monista do art. 29 significa que:","options":["O fato criminoso é juridicamente uno para os concorrentes, sem exigir penas idênticas.","Todos os concorrentes recebem obrigatoriamente a mesma pena.","Cada concorrente responde sempre por crime autônomo.","Só autores, nunca partícipes, respondem pelo fato."],"answer":0,"explanation":"O material enfatiza: unidade do fato não significa identidade de pena; a responsabilidade é individualizada na medida da culpabilidade."},{"id":"cq02","q":"Sobre a teoria do domínio do fato, o M06 alerta que:","options":["Ela dispensa prova concreta de autoria.","A posição de chefia basta para presumir autoria.","É critério de delimitação e não presunção automática de responsabilidade.","Só pode ser usada em crimes culposos."],"answer":2,"explanation":"O módulo afirma que domínio do fato não substitui tipicidade nem prova e não autoriza condenação automática por cargo ou posição."},{"id":"cq03","q":"Na autoria mediata, em termos gerais:","options":["O agente atua por intermédio de outra pessoa utilizada como instrumento da execução.","Dois agentes atuam sem saber um do outro.","O partícipe apenas reforça ideia criminosa alheia.","O autor chega depois da consumação."],"answer":0,"explanation":"A autoria mediata é apresentada como utilização de outra pessoa como instrumento, com domínio da situação pelo autor de trás."},{"id":"cq04","q":"Coautoria sucessiva é a hipótese em que:","options":["O agente adere ao fato depois do início da execução e assume função autoral enquanto o fato ainda está em curso.","O agente só promete ajuda após a consumação.","Dois agentes atuam paralelamente sem liame subjetivo.","O partícipe cria a ideia criminosa antes da execução."],"answer":0,"explanation":"O material admite adesão posterior ao início da execução, desde que ainda haja realização em curso e função autoral assumida."},{"id":"cq05","q":"Segundo a acessoriedade limitada indicada no módulo, a participação exige fato principal:","options":["Típico e ilícito.","Típico, ilícito e culpável em qualquer caso.","Apenas culpável.","Somente consumado."],"answer":0,"explanation":"A revisão do M06 resume a acessoriedade limitada como exigência de fato principal típico e ilícito."},{"id":"cq06","q":"No art. 29, §2º, se o concorrente quis participar de crime menos grave e o resultado mais grave era previsível:","options":["Ele responde automaticamente pelo crime mais grave.","Aplica-se a pena do crime menos grave, com possível aumento até metade.","O fato torna-se atípico para ele.","Aplica-se obrigatoriamente a redução de 1/6 a 1/3."],"answer":1,"explanation":"O material destaca que a previsibilidade não transfere automaticamente o crime mais grave; autoriza aumento até metade da pena do crime menos grave."},{"id":"cq07","q":"Nos crimes de mão própria, a formulação tradicional do material é:","options":["Admite sempre coautoria executória.","Não admite participação em hipótese alguma.","Execução é personalíssima; em regra não há coautoria executória, mas participação é possível em tese.","É sinônimo de crime próprio."],"answer":2,"explanation":"O M06 separa crime próprio de crime de mão própria e registra a regra tradicional de execução personalíssima."},{"id":"cq08","q":"Sobre concurso de pessoas em crime culposo, o resumo afirma que:","options":["Coautoria culposa é predominantemente admitida; participação stricto sensu é controvertida e majoritariamente negada.","Nenhuma forma de concurso é possível.","Somente participação stricto sensu é admitida.","Coautoria depende de ajuste prévio expresso."],"answer":0,"explanation":"Essa é exatamente a síntese apresentada no quadro do material."},{"id":"cq09","q":"A participação por omissão exige, conforme o M06:","options":["Dever jurídico de agir, possibilidade de atuação e dolo de favorecer o crime.","Apenas reprovação moral pela inércia.","Somente vínculo familiar com o autor.","Resultado consumado e confissão."],"answer":0,"explanation":"O material afasta a mera passividade moral: exige dever jurídico, possibilidade concreta de agir e dolo de favorecer o fato alheio."},{"id":"cq10","q":"Segundo o art. 31, ajuste, determinação/instigação e auxílio, em regra, não são puníveis como participação quando:","options":["O crime não chega pelo menos à tentativa, salvo disposição expressa em contrário.","O crime é consumado.","Há liame subjetivo.","O partícipe presta auxílio material."],"answer":0,"explanation":"O M06 resume o art. 31 exatamente assim: sem ao menos tentativa, esses atos não são puníveis, salvo previsão expressa em contrário."}]}};
})(window);

(function(global){
'use strict';
const SEL='#subjects .subject[data-id="penal"] .cf-module[data-cf="p6"]';

function inject(){
  const module=document.querySelector(SEL);
  if(!module) return;
  const body=module.querySelector('.cf-module-body');
  if(!body || body.querySelector('[data-bc-native-m06]')) return;

  const host=document.createElement('section');
  host.className='bc-native-materials bc-native-materials-static';
  host.setAttribute('data-bc-native-m06','');
  host.innerHTML=
    '<section class="bc-native-metrics" aria-label="Indicadores do módulo">'+
      '<article class="bc-native-metric-card">'+
        '<div class="bc-native-ring" data-native-ring="theory"><div class="bc-native-ring-inner"><b data-ring-value>0%</b><span>teoria</span></div></div>'+
        '<div class="bc-native-metric-copy"><small>COBERTURA DA TEORIA</small><strong data-native-metric-detail="theory">0 de 39 pontos concluídos</strong><span>Checks dos capítulos + questões internas.</span></div>'+
      '</article>'+
      '<article class="bc-native-metric-card">'+
        '<div class="bc-native-ring" data-native-ring="external"><div class="bc-native-ring-inner"><b data-ring-value>—</b><span>externas</span></div></div>'+
        '<div class="bc-native-metric-copy"><small>ACERTO EM QUESTÕES EXTERNAS</small><strong data-native-metric-detail="external">Nenhuma questão externa respondida</strong><span data-native-metric-meta="external">Registre questões externas no final do módulo</span></div>'+
      '</article>'+
    '</section>'+
    '<div class="bc-native-materials-head"><div><b>Materiais do módulo</b><small>Escolha como estudar</small></div><small>M06 • conteúdo nativo</small></div>'+
    '<div class="bc-native-material-grid">'+
      '<button type="button" class="bc-native-material-card" data-native-kind="summary"><span class="bc-native-material-icon">⚡</span><span><strong>Conteúdo resumido</strong><small>Primeira leitura, revisão rápida, artigos, pegadinhas e revisão ativa.</small></span><span class="bc-native-material-action"><span>Abrir</span><span>→</span></span></button>'+
      '<button type="button" class="bc-native-material-card" data-native-kind="complete"><span class="bc-native-material-icon">📚</span><span><strong>Conteúdo completo</strong><small>Teoria integral do M06 em formato de site, com índice, busca e progresso de leitura.</small></span><span class="bc-native-material-action"><span>Abrir</span><span>→</span></span></button>'+
      '<button type="button" class="bc-native-material-card" data-native-kind="mindmap"><span class="bc-native-material-icon">🧠</span><span><strong>Mapa mental</strong><small>Mapa interativo com abrir/recolher ramos, zoom, arrastar e tela cheia.</small></span><span class="bc-native-material-action"><span>Abrir</span><span>→</span></span></button>'+
    '</div>'+
    '<section class="bc-native-quick-summary" aria-label="Resumo do módulo">'+
      '<div class="bc-native-quick-summary-head"><span class="bc-native-quick-summary-no">6</span><div><b>Resumo do módulo</b><small>O M06 em poucas palavras.</small></div></div>'+
      '<div class="bc-native-quick-summary-body">Concurso de pessoas • autoria, coautoria e participação • acessoriedade • participação de menor importância • cooperação dolosamente distinta • comunicabilidade do art. 30 • crimes próprios, de mão própria, culposos e omissivos.</div>'+
    '</section>';

  host.querySelector('[data-native-kind="summary"]').onclick=function(){global.BaseNativeReaderM06?.open('summary')};
  host.querySelector('[data-native-kind="complete"]').onclick=function(){global.BaseNativeReaderM06?.open('complete')};
  host.querySelector('[data-native-kind="mindmap"]').onclick=function(){global.BaseMindMap?.open('penal','p6')};

  const subtitle=body.querySelector('.cf-subtitle');
  if(subtitle) subtitle.insertAdjacentElement('afterend',host);
  else body.insertAdjacentElement('afterbegin',host);
  global.BaseNativeReaderM06?.refreshMetrics?.();
}
function install(){
  inject();
  const obs=new MutationObserver(function(){
    clearTimeout(install._t);
    install._t=setTimeout(inject,60);
  });
  obs.observe(document.documentElement,{subtree:true,childList:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})(window);

(function(global){
'use strict';

const OVERLAY_ID='bcNativeReaderOverlayM06';
const M1_SELECTOR='#subjects .subject[data-id="penal"] .cf-module[data-cf="p6"]';
const STORAGE_PREFIX='central-v6:native-reader:penal:p6';
let current=null;
let observer=null;

function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function norm(s){return String(s||'').replace(/\u00a0/g,' ').replace(/[ \t]+/g,' ').trim()}
function normKey(s){return norm(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
function slug(s){return normKey(s).replace(/\s+/g,'-').slice(0,70)}
function source(){return global.BASE_NATIVE_CONTENT?.penal?.m06||null}
function storageKey(part){return STORAGE_PREFIX+':'+part}

function cleanLines(raw,mode){
  const lines=String(raw||'').replace(/\r/g,'').split('\n').map(norm);
  const out=[];
  let skipOldSummaryReview=false;
  for(let line of lines){
    if(mode==='summary' && /^10\.\s*REVIS(?:A|Ã)O ATIVA/i.test(line)){skipOldSummaryReview=true;continue}
    if(skipOldSummaryReview)continue;
    if(!line){out.push('');continue}
    if(/^BASE COMPLETA(?:\s*[|•-]|$)/i.test(line))continue;
    if(/^D\s*IRE\s*ITO PENAL\s*•\s*M0?1$/i.test(line))continue;
    if(/^\d+\s*\/\s*\d+$/.test(line))continue;
    if(/^P[aá]gina\s+\d+$/i.test(line))continue;
    if(/^Conteudo restrito ao PEN M1/i.test(line))continue;
    out.push(line);
  }
  return out;
}
function headingInfo(line){
  const l=norm(line);
  if(!l)return null;
  let m=l.match(/^(\d+)\.(\d+)\s+(.{3,140})$/);
  if(m)return {level:3,text:l};
  m=l.match(/^(\d+)\.?\s+(.{3,140})$/);
  if(m && !/^\d+\s*\/\s*\d+/.test(l) && !/^\d+\s+(Quais|Qual|A |O |Como |Quando |Pequeno|Pessoalidade|Na )/i.test(l)){
    return {level:2,text:l};
  }
  if(/^(VISÃO GERAL|VISAO GERAL|REVISÃO ATIVA|REVISAO ATIVA|ARTIGOS PARA DECORAR|PEGADINHAS DE PROVA|PEGADINHAS DE PROVAS|MAPA DO MÓDULO|MAPA DO MODULO|TEORIA ESSENCIAL)$/i.test(l)){
    return {level:2,text:l};
  }
  if(/^TEORIA\s*-\s*[123]\./i.test(l)){
    return {level:2,text:l};
  }
  return null;
}
function calloutType(line){
  const l=norm(line).toUpperCase();
  if(/^(✅\s*)?EXEMPLO/.test(l))return ['example','Exemplo'];
  if(/PEGADINHA/.test(l))return ['trap','Pegadinha'];
  if(/^(⚖️\s*)?LEI SECA/.test(l))return ['law','Lei seca'];
  if(/^(DECORE|MEMÓRIA|MEMORIA|MNEMÔNICO|MNEMONICO|REGRA DE OURO|IDEIA-CENTRAL|IDEIA CENTRAL|FÓRMULA|FORMULA|MEMORIZACAO RAPIDA)/.test(l))return ['memory',norm(line)];
  if(/^(STF|STJ|JURISPRUDÊNCIA|JURISPRUDENCIA|ATUALIZAÇÃO|ATUALIZACAO)/.test(l))return ['case',norm(line)];
  if(/^(COMPARAÇÃO|COMPARACAO|ATENÇÃO|ATENCAO|PROVA|CUIDADO|FRONTEIRA DO MÓDULO|FRONTEIRA DO MODULO)/.test(l))return ['case',norm(line)];
  return null;
}
function isBullet(line){return /^[•●▪◦*-]\s+/.test(line)}
function looksTitle(line){
  const l=norm(line);
  if(l.length<3||l.length>105)return false;
  if(/[.!?]$/.test(l))return false;
  if(/^[A-ZÁÉÍÓÚÂÊÔÃÕÇ0-9][A-ZÁÉÍÓÚÂÊÔÃÕÇ0-9\s:–—()/%ºª,.-]+$/.test(l)&&l.split(/\s+/).length<=12)return true;
  return false;
}
function parse(raw,mode){
  const lines=cleanLines(raw,mode);
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
        if(!next){if(body.length)break;else continue}
        if(headingInfo(next)||calloutType(next)||looksTitle(next))break;
        body.push(next);i=j;
      }
      blocks.push({type:'callout',kind:co[0],label:co[1],text:body.join(' ')});
      continue;
    }
    if(isBullet(line)){
      flush();
      const items=[line.replace(/^[•●▪◦*-]\s+/,'')];
      while(i+1<lines.length&&isBullet(lines[i+1]))items.push(lines[++i].replace(/^[•●▪◦*-]\s+/,''));
      blocks.push({type:'ul',items});
      continue;
    }
    if(looksTitle(line)&&mode==='summary'){flush();blocks.push({type:'h',level:3,text:line});continue}
    para.push(line);
  }
  flush();
  const firstH=blocks.findIndex(b=>b.type==='h');
  if(firstH>2){
    const lead=blocks.slice(0,firstH).filter(b=>b.type==='p').map(b=>b.text).join(' ');
    blocks.splice(0,firstH,{type:'lead',text:lead});
  }
  return blocks;
}
function buildHtml(data,mode){
  if(mode==='complete'){
    const host=document.createElement('div');
    host.innerHTML=global.PENAL_FULL_THEORY?.p6?.html||'';
    host.querySelector('.pen-m6-cover')?.remove();
    host.querySelector('.pen-m6-toc')?.remove();
    host.querySelector('.pen-m6-orientacao')?.remove();
    host.querySelector('#pen-m6-revisao')?.remove();

    const headings=[];
    host.querySelectorAll('section.pen-m6-session').forEach((section,index)=>{
      const h=section.querySelector('.pen-m6-session-head h3');
      if(!h)return;
      if(!h.id)h.id='bcsec-complete-'+(index+1)+'-'+slug(h.textContent);
      headings.push({id:h.id,text:norm(h.textContent),level:2,key:normKey(h.textContent)});
    });

    host.querySelectorAll('.pen-m6-box').forEach(el=>el.classList.add('bc-native-callout'));
    host.querySelectorAll('.pen-m6-table-wrap').forEach(el=>el.classList.add('bc-native-table-wrap'));

    const text=norm(host.textContent);
    const words=text.split(/\s+/).filter(Boolean).length;
    const mins=Math.max(1,Math.round(words/190));
    return {body:host.innerHTML,headings,words,mins};
  }

  const raw=mode==='summary'?data.summary:data.complete;
  const blocks=parse(raw,mode);
  const headings=[];
  let hCount=0;
  const body=blocks.map(b=>{
    if(b.type==='h'){
      const id='bcsec-'+(++hCount)+'-'+slug(b.text);
      headings.push({id,text:b.text,level:b.level,key:normKey(b.text)});
      return '<h'+b.level+' id="'+id+'">'+esc(b.text)+'</h'+b.level+'>';
    }
    if(b.type==='lead')return '<p class="lead">'+esc(b.text)+'</p>';
    if(b.type==='p')return '<p>'+esc(b.text)+'</p>';
    if(b.type==='ul')return '<ul>'+b.items.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>';
    if(b.type==='callout')return '<aside class="bc-native-callout '+b.kind+'"><b>'+esc(b.label)+'</b><div>'+esc(b.text)+'</div></aside>';
    return '';
  }).join('');
  const words=norm(raw).split(/\s+/).filter(Boolean).length;
  const mins=Math.max(1,Math.round(words/(mode==='summary'?220:190)));
  return {body,headings,words,mins};
}
function modeChapters(data,mode){return Array.isArray(data?.chapters?.[mode])?data.chapters[mode]:[]}
function modeQuestions(data,mode){return Array.isArray(data?.internalQuestions?.[mode])?data.internalQuestions[mode]:[]}
function chapterDone(mode,id){return localStorage.getItem(storageKey('chapter:'+mode+':'+id))==='1'}
function setChapterDone(mode,id,done){
  localStorage.setItem(storageKey('chapter:'+mode+':'+id),done?'1':'0');
}
function internalAnswer(mode,id){
  try{return JSON.parse(localStorage.getItem(storageKey('internal:'+mode+':'+id))||'null')}catch(_){return null}
}
function saveInternalAnswer(mode,q,selected){
  const prev=internalAnswer(mode,q.id)||{attempts:0};
  const state={
    selected:Number(selected),
    correct:Number(selected)===Number(q.answer),
    attempts:(prev.attempts||0)+1,
    updatedAt:new Date().toISOString()
  };
  localStorage.setItem(storageKey('internal:'+mode+':'+q.id),JSON.stringify(state));
  return state;
}
function resetInternalAnswer(mode,id){localStorage.removeItem(storageKey('internal:'+mode+':'+id))}

function modeStudyStats(data,mode){
  const chapters=modeChapters(data,mode);
  const questions=modeQuestions(data,mode);
  const chapterDoneCount=chapters.filter(ch=>chapterDone(mode,ch.id)).length;
  const answered=questions.filter(q=>!!internalAnswer(mode,q.id)).length;
  const correct=questions.filter(q=>internalAnswer(mode,q.id)?.correct).length;
  return {
    chapterDone:chapterDoneCount,
    chapterTotal:chapters.length,
    answered,
    questionTotal:questions.length,
    correct,
    done:chapterDoneCount+answered,
    total:chapters.length+questions.length
  };
}
function theoryStats(){
  const data=source();
  if(!data)return {done:0,total:0,pct:0};
  const s=modeStudyStats(data,'summary');
  const c=modeStudyStats(data,'complete');
  const done=s.done+c.done,total=s.total+c.total;
  return {done,total,pct:total?Math.round(done/total*100):0,summary:s,complete:c};
}
function externalStats(){
  try{
    const rows=JSON.parse(localStorage.getItem('central-v6:module-rounds:penal:p6')||'[]');
    const valid=(Array.isArray(rows)?rows:[]).map(r=>({
      done:Math.max(0,Number(r.valid ?? r.done)||0),
      correct:Math.max(0,Number(r.correct)||0)
    })).filter(r=>r.done>0);
    const answered=valid.reduce((n,r)=>n+r.done,0);
    const correct=valid.reduce((n,r)=>n+Math.min(r.correct,r.done),0);
    return {answered,correct,rounds:valid.length,accuracy:answered?Math.round(correct/answered*100):null};
  }catch(_){
    return {answered:0,correct:0,rounds:0,accuracy:null};
  }
}
function setRing(el,pct,label){
  if(!el)return;
  const safe=Math.max(0,Math.min(100,Number(pct)||0));
  el.style.setProperty('--pct',String(safe));
  const value=el.querySelector('[data-ring-value]');
  if(value)value.textContent=label??(safe+'%');
}
function refreshModuleMetrics(){
  const module=document.querySelector(M1_SELECTOR);
  if(!module)return;
  const theory=theoryStats(),external=externalStats();

  setRing(module.querySelector('[data-native-ring="theory"]'),theory.pct,theory.pct+'%');
  const theoryDetail=module.querySelector('[data-native-metric-detail="theory"]');
  if(theoryDetail)theoryDetail.textContent=theory.done+' de '+theory.total+' pontos concluídos';

  setRing(module.querySelector('[data-native-ring="external"]'),external.accuracy??0,external.accuracy==null?'—':external.accuracy+'%');
  const extDetail=module.querySelector('[data-native-metric-detail="external"]');
  if(extDetail){
    extDetail.textContent=external.answered
      ? external.correct+' acertos em '+external.answered+' questões externas'
      : 'Nenhuma questão externa respondida';
  }
  const extMeta=module.querySelector('[data-native-metric-meta="external"]');
  if(extMeta)extMeta.textContent=external.answered
    ? external.rounds+' rodada(s) registrada(s) no final do módulo'
    : 'Registre questões externas no final do módulo';

  const headerStat=module.querySelector('.cf-module-stat');
  if(headerStat)headerStat.textContent='Cobertura '+theory.pct+'% • teoria + revisão interna';
  const legacyBar=module.querySelector('.cf-module-bar span');
  if(legacyBar)legacyBar.style.width=theory.pct+'%';
  refreshCardState();
}
function refreshCardState(){
  const data=source();if(!data)return;
  ['summary','complete'].forEach(kind=>{
    const st=modeStudyStats(data,kind);
    document.querySelectorAll(M1_SELECTOR+' [data-native-kind="'+kind+'"]').forEach(card=>{
      const tag=card.querySelector('.bc-native-material-action span:first-child');
      if(tag)tag.textContent=st.done===st.total&&st.total?'✓ Concluído':st.chapterDone+'/'+st.chapterTotal+' capítulos';
    });
  });
}

function close(){
  document.getElementById(OVERLAY_ID)?.remove();
  document.body.style.overflow='';
  current=null;
}
function buildChapterMap(){
  if(!current)return [];
  return modeChapters(source(),current.mode).map(ch=>({chapter:ch,heading:findHeadingForChapter(ch)})).filter(x=>x.heading);
}
function autoMarkViewedChapters(){
  if(!current||!current.chapterMap?.length)return;
  const sc=current.scroll;
  const viewportBottom=sc.scrollTop+sc.clientHeight;
  let changed=false;
  current.chapterMap.forEach((item,index)=>{
    if(chapterDone(current.mode,item.chapter.id))return;
    const start=item.heading.offsetTop;
    const next=current.chapterMap[index+1]?.heading?.offsetTop ?? current.article.scrollHeight;
    const target=start+Math.max(80,(next-start)*0.72);
    if(viewportBottom>=target){
      setChapterDone(current.mode,item.chapter.id,true);
      changed=true;
    }
  });
  if(changed)refreshReaderStudyUI();
}
function updateScrollProgress(){
  if(!current)return;
  const sc=current.scroll;
  const max=Math.max(1,sc.scrollHeight-sc.clientHeight);
  const pct=Math.max(0,Math.min(100,sc.scrollTop/max*100));
  const bar=current.overlay.querySelector('.bc-native-reader-progress');
  if(bar)bar.style.width=pct+'%';
  localStorage.setItem(storageKey(current.mode+':scroll'),String(sc.scrollTop));
  autoMarkViewedChapters();
}
function restoreScroll(){
  if(!current)return;
  const v=Number(localStorage.getItem(storageKey(current.mode+':scroll'))||0);
  if(v>0)current.scroll.scrollTop=v;
}
function setFont(delta){
  if(!current)return;
  current.font=Math.max(14,Math.min(21,current.font+delta));
  current.article.style.fontSize=current.font+'px';
  localStorage.setItem(storageKey('font'),String(current.font));
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
      frag.append(raw.slice(pos,idx));
      const mk=document.createElement('mark');mk.className='bc-native-search-hit';mk.textContent=raw.slice(idx,idx+term.length);frag.append(mk);
      n++;pos=idx+term.length;
    }
    frag.append(raw.slice(pos));node.replaceWith(frag);
  }
  root.querySelector('mark.bc-native-search-hit')?.scrollIntoView({block:'center'});
  return n;
}
function findHeadingForChapter(chapter){
  if(!current)return null;
  const target=normKey(chapter.title).replace(/^\d+\s+/,'');
  const words=target.split(' ').filter(w=>w.length>3);
  const headings=Array.from(current.article.querySelectorAll('h2,h3'));
  let best=null,bestScore=0;
  for(const h of headings){
    const hk=normKey(h.textContent);
    let score=0;
    words.forEach(w=>{if(hk.includes(w))score++});
    if(score>bestScore){bestScore=score;best=h}
  }
  return bestScore>=Math.max(1,Math.min(2,words.length))?best:null;
}
function refreshReaderStudyUI(){
  if(!current)return;
  const data=source(),st=modeStudyStats(data,current.mode);
  const value=current.overlay.querySelector('[data-reader-study-value]');
  const bar=current.overlay.querySelector('[data-reader-study-bar]');
  const qscore=current.overlay.querySelector('[data-reader-internal-score]');
  if(value)value.textContent=st.done+' / '+st.total+' pontos';
  if(bar)bar.style.width=(st.total?Math.round(st.done/st.total*100):0)+'%';
  if(qscore)qscore.textContent=st.answered
    ? st.correct+' acertos em '+st.answered+' respondidas'
    : 'Nenhuma questão interna respondida';

  current.overlay.querySelectorAll('[data-chapter-check]').forEach(btn=>{
    const done=chapterDone(current.mode,btn.dataset.chapterCheck);
    btn.classList.toggle('done',done);
    btn.setAttribute('aria-pressed',String(done));
    btn.textContent=done?'✓':'';
  });
  refreshModuleMetrics();
}
function chapterTocHtml(data,mode){
  return modeChapters(data,mode).map((ch,i)=>{
    const done=chapterDone(mode,ch.id);
    return '<div class="bc-native-toc-row">'+
      '<button type="button" class="bc-native-chapter-check '+(done?'done':'')+'" data-chapter-check="'+esc(ch.id)+'" aria-pressed="'+done+'" title="Marcar capítulo">'+(done?'✓':'')+'</button>'+
      '<button type="button" class="bc-native-chapter-jump" data-chapter-jump="'+esc(ch.id)+'"><span>'+(i+1)+'.</span>'+esc(ch.title)+'</button>'+
    '</div>';
  }).join('');
}
function quizHtml(data,mode){
  const qs=modeQuestions(data,mode);
  if(!qs.length)return '';
  const cards=qs.map((q,i)=>{
    const a=internalAnswer(mode,q.id);
    const options=q.options.map((op,idx)=>{
      let cls='';
      if(a){
        if(idx===q.answer)cls+=' correct';
        if(idx===a.selected&&idx!==q.answer)cls+=' wrong';
      }
      return '<button type="button" class="bc-native-quiz-option'+cls+'" data-internal-q="'+esc(q.id)+'" data-option="'+idx+'" '+(a?'disabled':'')+'><span>'+String.fromCharCode(65+idx)+'</span>'+esc(op)+'</button>';
    }).join('');
    return '<article class="bc-native-quiz-card" data-quiz-card="'+esc(q.id)+'">'+
      '<div class="bc-native-quiz-number">Questão '+(i+1)+' de '+qs.length+'</div>'+
      '<h3>'+esc(q.q)+'</h3>'+
      '<div class="bc-native-quiz-options">'+options+'</div>'+
      '<div class="bc-native-quiz-feedback '+(a?(a.correct?'ok':'bad'):'')+'" data-quiz-feedback>'+
        (a?'<b>'+(a.correct?'✓ Correto':'✕ Incorreto')+'</b><span>'+esc(q.explanation)+'</span><button type="button" data-internal-retry="'+esc(q.id)+'">Refazer</button>':'<span>Escolha uma alternativa para receber o feedback.</span>')+
      '</div>'+
    '</article>';
  }).join('');
  return '<section class="bc-native-internal-review">'+
    '<div class="bc-native-internal-review-head"><div><span class="bc-native-kicker">REVISÃO ATIVA INTERNA</span><h2>'+qs.length+' questões de assimilação</h2><p>Estas questões contam na <b>cobertura da teoria</b>. Elas não entram no gráfico de questões externas.</p></div><div class="bc-native-internal-score" data-reader-internal-score></div></div>'+
    cards+
  '</section>';
}
function bindQuiz(){
  if(!current)return;
  const data=source();
  current.overlay.querySelectorAll('[data-internal-q]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const q=modeQuestions(data,current.mode).find(x=>x.id===btn.dataset.internalQ);
      if(!q)return;
      saveInternalAnswer(current.mode,q,Number(btn.dataset.option));
      rerenderQuizCard(q.id);
      refreshReaderStudyUI();
    });
  });
  current.overlay.querySelectorAll('[data-internal-retry]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      resetInternalAnswer(current.mode,btn.dataset.internalRetry);
      rerenderQuizCard(btn.dataset.internalRetry);
      refreshReaderStudyUI();
    });
  });
}
function rerenderQuizCard(id){
  if(!current)return;
  const data=source(),q=modeQuestions(data,current.mode).find(x=>x.id===id);
  const old=current.overlay.querySelector('[data-quiz-card="'+CSS.escape(id)+'"]');
  if(!q||!old)return;
  const i=modeQuestions(data,current.mode).findIndex(x=>x.id===id);
  const a=internalAnswer(current.mode,id);
  const options=q.options.map((op,idx)=>{
    let cls='';
    if(a){
      if(idx===q.answer)cls+=' correct';
      if(idx===a.selected&&idx!==q.answer)cls+=' wrong';
    }
    return '<button type="button" class="bc-native-quiz-option'+cls+'" data-internal-q="'+esc(q.id)+'" data-option="'+idx+'" '+(a?'disabled':'')+'><span>'+String.fromCharCode(65+idx)+'</span>'+esc(op)+'</button>';
  }).join('');
  old.innerHTML='<div class="bc-native-quiz-number">Questão '+(i+1)+' de '+modeQuestions(data,current.mode).length+'</div>'+
    '<h3>'+esc(q.q)+'</h3><div class="bc-native-quiz-options">'+options+'</div>'+
    '<div class="bc-native-quiz-feedback '+(a?(a.correct?'ok':'bad'):'')+'" data-quiz-feedback>'+
      (a?'<b>'+(a.correct?'✓ Correto':'✕ Incorreto')+'</b><span>'+esc(q.explanation)+'</span><button type="button" data-internal-retry="'+esc(q.id)+'">Refazer</button>':'<span>Escolha uma alternativa para receber o feedback.</span>')+
    '</div>';
  bindQuiz();
}
function open(mode){
  const data=source();if(!data){alert('Conteúdo nativo do M01 ainda não foi carregado.');return}
  close();
  const parsed=buildHtml(data,mode);
  const label=mode==='summary'?'Conteúdo resumido':'Conteúdo completo';
  const chapters=modeChapters(data,mode),questions=modeQuestions(data,mode);
  const ov=document.createElement('div');
  ov.id=OVERLAY_ID;ov.className='bc-native-reader-overlay';
  ov.innerHTML='<section class="bc-native-reader" role="dialog" aria-modal="true" aria-label="'+esc(label)+'">'+
    '<header class="bc-native-reader-head"><div class="bc-native-reader-title"><b>PEN M06 — '+esc(data.title)+'</b><small>'+label+' • experiência nativa da Base Completa</small></div><span class="bc-native-reader-meta">'+parsed.words.toLocaleString('pt-BR')+' palavras • ~'+parsed.mins+' min</span><button class="bc-native-reader-close" data-native-action="close" aria-label="Fechar">×</button><div class="bc-native-reader-progress-track"><div class="bc-native-reader-progress"></div></div></header>'+
    '<div class="bc-native-reader-tools"><input type="search" placeholder="Buscar neste material…" aria-label="Buscar"><button data-native-action="smaller">A−</button><button data-native-action="larger">A+</button><button class="primary" data-native-action="top">Ir ao topo</button></div>'+
    '<div class="bc-native-reader-body">'+
      '<nav class="bc-native-toc"><div class="bc-native-toc-label">Capítulos para concluir</div>'+chapterTocHtml(data,mode)+'</nav>'+
      '<main class="bc-native-scroll"><article class="bc-native-article">'+
        '<div class="bc-native-kicker">'+(mode==='summary'?'PRIMEIRA LEITURA + REVISÃO':'TEORIA INTEGRAL')+'</div>'+
        '<h1>'+esc(data.title)+'</h1>'+
        '<p class="lead">'+(mode==='summary'?'Versão condensada para compreender o módulo e revisar os pontos de maior rendimento.':'Conteúdo integral convertido para leitura nativa, sem leitor de PDF.')+'</p>'+
        '<section class="bc-native-study-progress"><div><b>Progresso neste material</b><span data-reader-study-value>0 / '+(chapters.length+questions.length)+' pontos</span></div><div class="bc-native-study-progress-track"><span data-reader-study-bar></span></div><small>'+chapters.length+' capítulos + '+questions.length+' questões internas. Os capítulos recebem check automaticamente conforme você avança; as questões internas também entram na cobertura da teoria.</small></section>'+
        parsed.body+
        quizHtml(data,mode)+
      '</article></main>'+
    '</div></section>';
  document.body.appendChild(ov);document.body.style.overflow='hidden';

  current={
    mode,overlay:ov,scroll:ov.querySelector('.bc-native-scroll'),article:ov.querySelector('.bc-native-article'),
    font:Number(localStorage.getItem(storageKey('font'))||16),chapterMap:[]
  };
  current.article.style.fontSize=current.font+'px';
  current.scroll.addEventListener('scroll',updateScrollProgress,{passive:true});
  ov.querySelector('[data-native-action="close"]').onclick=close;
  ov.querySelector('[data-native-action="smaller"]').onclick=()=>setFont(-1);
  ov.querySelector('[data-native-action="larger"]').onclick=()=>setFont(1);
  ov.querySelector('[data-native-action="top"]').onclick=()=>current.scroll.scrollTo({top:0,behavior:'smooth'});
  ov.querySelector('.bc-native-reader-tools input').addEventListener('input',e=>search(e.target.value));

  ov.querySelectorAll('[data-chapter-check]').forEach(btn=>{
    btn.onclick=()=>{
      const id=btn.dataset.chapterCheck;
      setChapterDone(mode,id,!chapterDone(mode,id));
      refreshReaderStudyUI();
    };
  });
  ov.querySelectorAll('[data-chapter-jump]').forEach(btn=>{
    btn.onclick=()=>{
      const ch=modeChapters(data,mode).find(x=>x.id===btn.dataset.chapterJump);
      findHeadingForChapter(ch)?.scrollIntoView({behavior:'smooth',block:'start'});
    };
  });

  bindQuiz();
  ov.addEventListener('click',e=>{if(e.target===ov)close()});
  requestAnimationFrame(()=>{
    current.chapterMap=buildChapterMap();
    restoreScroll();updateScrollProgress();refreshReaderStudyUI();autoMarkViewedChapters();
  });
}
function openMap(){
  if(global.BaseMindMap?.open)global.BaseMindMap.open('penal','p6');
  else alert('O mapa mental interativo ainda está carregando. Tente novamente em alguns segundos.');
}
function removeLegacyM01Content(){
  const module=document.querySelector(M1_SELECTOR);
  if(!module)return;
  module.querySelectorAll('.bc-session-nav,.bc-session-pager').forEach(el=>el.remove());
}
function inject(){
  const module=document.querySelector(M1_SELECTOR);if(!module)return;
  removeLegacyM01Content();
  const body=module.querySelector('.cf-module-body');if(!body)return;

  // Fallback: a renderização principal já entrega os cards diretamente.
  if(!body.querySelector('.bc-native-materials')){
    const host=document.createElement('section');host.className='bc-native-materials';
    host.innerHTML='<div class="bc-native-materials-head"><div><b>Materiais do módulo</b><small>Escolha como estudar</small></div><small>Piloto M06 • conteúdo nativo</small></div>'+
      '<div class="bc-native-material-grid">'+
        '<button class="bc-native-material-card" data-native-kind="summary"><span class="bc-native-material-icon">⚡</span><span><strong>Conteúdo resumido</strong><small>Primeira leitura, revisão rápida, artigos, pegadinhas e revisão ativa.</small></span><span class="bc-native-material-action"><span>Abrir</span><span>→</span></span></button>'+
        '<button class="bc-native-material-card" data-native-kind="complete"><span class="bc-native-material-icon">📚</span><span><strong>Conteúdo completo</strong><small>Teoria integral do M06 em formato de site, com índice, busca e progresso de leitura.</small></span><span class="bc-native-material-action"><span>Abrir</span><span>→</span></span></button>'+
        '<button class="bc-native-material-card" data-native-kind="mindmap"><span class="bc-native-material-icon">🧠</span><span><strong>Mapa mental</strong><small>Mapa interativo com abrir/recolher ramos, zoom, arrastar e tela cheia.</small></span><span class="bc-native-material-action"><span>Abrir</span><span>→</span></span></button>'+
      '</div>';
    host.querySelector('[data-native-kind="summary"]').onclick=()=>open('summary');
    host.querySelector('[data-native-kind="complete"]').onclick=()=>open('complete');
    host.querySelector('[data-native-kind="mindmap"]').onclick=openMap;
    const subtitle=body.querySelector('.cf-subtitle');
    if(subtitle)subtitle.insertAdjacentElement('afterend',host);else body.insertAdjacentElement('afterbegin',host);
  }
  refreshModuleMetrics();
}
function install(){
  inject();
  observer=new MutationObserver(()=>{
    clearTimeout(install._t);
    install._t=setTimeout(()=>{removeLegacyM01Content();inject();refreshModuleMetrics()},60);
  });
  observer.observe(document.documentElement,{subtree:true,childList:true});
  global.addEventListener('focus',refreshModuleMetrics);
}
global.BaseNativeReaderM06={
  open,close,refreshMetrics:refreshModuleMetrics,theoryStats,externalStats,
  version:'2026.10.02-m06-pilot1'
};
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.getElementById(OVERLAY_ID))close()});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})(window);
