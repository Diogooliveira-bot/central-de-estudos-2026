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
