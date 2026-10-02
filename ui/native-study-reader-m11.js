(function(global){
'use strict';

const OVERLAY_ID='bcNativeReaderOverlayM11';
const M1_SELECTOR='#subjects .subject[data-id="penal"] .cf-module[data-cf="p11"]';
const STORAGE_PREFIX='central-v6:native-reader:penal:p11';
let current=null;
let observer=null;

function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function norm(s){return String(s||'').replace(/\u00a0/g,' ').replace(/[ \t]+/g,' ').trim()}
function normKey(s){return norm(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
function slug(s){return normKey(s).replace(/\s+/g,'-').slice(0,70)}
function source(){return global.BASE_NATIVE_CONTENT?.penal?.m11||null}
function storageKey(part){return STORAGE_PREFIX+':'+part}

function cleanLines(raw,mode){
  const lines=String(raw||'').replace(/\r/g,'').split('\n').map(norm);
  const out=[];
  let skipOldSummaryReview=false;
  for(let line of lines){
    if(mode==='summary' && /^5\.\s*REVIS(?:A|Ã)O ATIVA/i.test(line)){skipOldSummaryReview=true;continue}
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
  if(/^(Crimes contra a vida|Aborto|Lesões corporais|Periclitação da vida e da saúde|Rixa|Crimes contra a honra|Liberdade individual|Domicílio, segredos e dispositivos)$/i.test(l)){
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
    host.innerHTML=global.PENAL_FULL_THEORY?.p11?.html||'';

    const review=Array.from(host.querySelectorAll('h2')).find(h=>/^41\\.\\s/.test(norm(h.textContent)));
    if(review){
      let n=review;
      while(n){const next=n.nextSibling;n.remove();n=next;}
    }
    const first=Array.from(host.querySelectorAll('h2')).find(h=>/^01\\.\\s/.test(norm(h.textContent)));
    if(first){
      let n=host.firstChild;
      while(n&&n!==first){const next=n.nextSibling;n.remove();n=next;}
    }

    const headings=[];
    host.querySelectorAll('h2').forEach((h,index)=>{
      const title=norm(h.textContent);
      if(!/^(?:0[1-9]|[12][0-9]|3[0-9]|40)\\.\\s/.test(title))return;
      if(!h.id)h.id='bcsec-complete-'+(index+1)+'-'+slug(title);
      headings.push({id:h.id,text:title,level:2,key:normKey(title)});
    });

    host.querySelectorAll('blockquote').forEach(el=>el.classList.add('bc-native-callout','theory'));
    host.querySelectorAll('table').forEach(el=>el.classList.add('bc-native-m11-table'));
    host.querySelectorAll('h3').forEach(el=>el.classList.add('bc-native-m11-subhead'));
    host.querySelectorAll('hr').forEach(el=>el.classList.add('bc-native-m11-separator'));

    const text=norm(host.textContent);
    const words=text.split(/\\s+/).filter(Boolean).length;
    return {body:host.innerHTML,headings,words,mins:Math.max(1,Math.round(words/190))};
  }

  const raw=mode==='summary'?data.summary:data.complete;
  const blocks=parse(raw,mode);
  const headings=[];let hCount=0;
  const body=blocks.map(b=>{
    if(b.type==='h'){const id='bcsec-'+(++hCount)+'-'+slug(b.text);headings.push({id,text:b.text,level:b.level,key:normKey(b.text)});return '<h'+b.level+' id="'+id+'">'+esc(b.text)+'</h'+b.level+'>';}
    if(b.type==='lead')return '<p class="lead">'+esc(b.text)+'</p>';
    if(b.type==='p')return '<p>'+esc(b.text)+'</p>';
    if(b.type==='ul')return '<ul>'+b.items.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>';
    if(b.type==='callout')return '<aside class="bc-native-callout '+b.kind+'"><b>'+esc(b.label)+'</b><div>'+esc(b.text)+'</div></aside>';
    return '';
  }).join('');
  const words=norm(raw).split(/\\s+/).filter(Boolean).length;
  return {body,headings,words,mins:Math.max(1,Math.round(words/(mode==='summary'?220:190)))};
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
    const rows=JSON.parse(localStorage.getItem('central-v6:module-rounds:penal:p11')||'[]');
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
  const data=source();if(!data){alert('Conteúdo nativo do M11 ainda não foi carregado.');return}
  close();
  const parsed=buildHtml(data,mode);
  const label=mode==='summary'?'Conteúdo resumido':'Conteúdo completo';
  const chapters=modeChapters(data,mode),questions=modeQuestions(data,mode);
  const ov=document.createElement('div');
  ov.id=OVERLAY_ID;ov.className='bc-native-reader-overlay';
  ov.innerHTML='<section class="bc-native-reader" role="dialog" aria-modal="true" aria-label="'+esc(label)+'">'+
    '<header class="bc-native-reader-head"><div class="bc-native-reader-title"><b>PEN M11 — '+esc(data.title)+'</b><small>'+label+' • experiência nativa da Base Completa</small></div><span class="bc-native-reader-meta">'+parsed.words.toLocaleString('pt-BR')+' palavras • ~'+parsed.mins+' min</span><button class="bc-native-reader-close" data-native-action="close" aria-label="Fechar">×</button><div class="bc-native-reader-progress-track"><div class="bc-native-reader-progress"></div></div></header>'+
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
  if(global.BaseMindMap?.open)global.BaseMindMap.open('penal','p11');
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
    host.innerHTML='<div class="bc-native-materials-head"><div><b>Materiais do módulo</b><small>Escolha como estudar</small></div><small>Piloto M11 • conteúdo nativo</small></div>'+
      '<div class="bc-native-material-grid">'+
        '<button class="bc-native-material-card" data-native-kind="summary"><span class="bc-native-material-icon">⚡</span><span><strong>Conteúdo resumido</strong><small>Primeira leitura, revisão rápida, artigos, pegadinhas e revisão ativa.</small></span><span class="bc-native-material-action"><span>Abrir</span><span>→</span></span></button>'+
        '<button class="bc-native-material-card" data-native-kind="complete"><span class="bc-native-material-icon">📚</span><span><strong>Conteúdo completo</strong><small>Teoria integral do M11 em formato de site, com índice, busca e progresso de leitura.</small></span><span class="bc-native-material-action"><span>Abrir</span><span>→</span></span></button>'+
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
global.BaseNativeReaderM11={
  open,close,refreshMetrics:refreshModuleMetrics,theoryStats,externalStats,
  version:'2026.10.02-m11-pilot1'
};
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.getElementById(OVERLAY_ID))close()});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})(window);