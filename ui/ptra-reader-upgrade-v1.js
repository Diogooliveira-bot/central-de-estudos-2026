/* Base Completa — Processo do Trabalho: apostila contínua e revisão interativa.
   Camada apenas de apresentação; o pacote jurídico original permanece intacto. */
(function (global) {
  'use strict';
  if (global.PtraReaderUpgrade) return;
  const NS='base-completa:ptra:v2:';
  const esc=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[ch]));
  const pad=n=>String(n).padStart(2,'0');
  const safeNumber=n=>Math.max(0,Number(n)||0);
  const sourceLines=text=>String(text||'').replace(/\r\n?/g,'\n').split('\n');
  const normalize=text=>String(text||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,' ').trim().toLowerCase();
  function heading(line) {
    const s=line.trim();
    if (!s || s.length>125) return 0;
    if (/^\d{1,2}(?:\.\d{1,2}){0,3}[.)]?\s+\S/.test(s))
      return (s.match(/\./g)||[]).length>=2?3:2;
    if (/^(?:INTRODU[CÇ][AÃ]O|CONCEITO|FUNDAMENTOS|RESUMO|S[IÍ]NTESE|TEORIA|REVIS[AÃ]O|JURISPRUD[EÊ]NCIA|COMPET[EÊ]NCIA|CONCLUS[AÃ]O|QUEST[OÕ]ES|PEGADINHAS|VIS[AÃ]O GERAL|ATEN[CÇ][AÃ]O)(?:\s|:|$)/i.test(s) && s.length<86) return 2;
    if (s.length>=6 && s.length<90 && s===s.toLocaleUpperCase('pt-BR') && /[A-ZÁÉÍÓÚÃÕÇ]/.test(s) && !/[.!?;]$/.test(s)) return 3;
    return 0;
  }
  function marker(line) {
    const s=line.trim();
    if (/^(?:[•●▪◦*–-]\s+|[a-eA-E]\)\s+|(?:I|II|III|IV|V|VI|VII|VIII|IX|X)[.)]\s+)/.test(s)) return 'bullet';
    if (/^(?:Art\.\s*\d|§\s*\d|S[uú]mula\s*\d|OJ\s*\d|Tema\s*\d|(?:STF|STJ|TST)\s*[:—–-]|(?:ATEN[CÇ][AÃ]O|IMPORTANTE|PEGADINHA|LEI SECA)\s*[:—–-])/i.test(s)) return 'legal';
    return null;
  }
  function splitTheory(pages,questions) {
    const all=pages.map(p=>String(p||'')).join('\n\n');
    if (!questions.length) return {theory:all,questionsText:''};
    const lines=sourceLines(all);
    const headingAt=lines.findIndex((line,index)=>{
      if(index<lines.length*.35)return false;
      return /^(?:\s*(?:\d+[.)]\s*)?)?(?:(?:QUEST[OÕ]ES?\s+(?:DE\s+)?(?:FIXA[CÇ][AÃ]O|ASSIMILA[CÇ][AÃ]O|REVIS[AÃ]O|M[UÚ]LTIPLA\s+ESCOLHA|TREINAMENTO|COMENTADAS))|(?:EXERC[IÍ]CIOS\s+DE\s+FIXA[CÇ][AÃ]O))\s*[:\-–—]?\s*$/i.test(line.trim());
    });
    if (headingAt<0) return {theory:all,questionsText:''};
    return {theory:lines.slice(0,headingAt).join('\n'),questionsText:lines.slice(headingAt).join('\n')};
  }
  function formatTheory(text) {
    const out=[],chapters=[];let para=[],list=[];
    const finishList=()=>{
      if(list.length){out.push('<ul class="ptra-book-list">'+list.map(item=>'<li>'+esc(item)+'</li>').join('')+'</ul>');list=[];}
    };
    const finishPara=()=>{
      if(para.length){out.push('<p>'+esc(para.join(' '))+'</p>');para=[];}
    };
    for(const raw of sourceLines(text)) {
      const line=raw.trim();
      if(!line){finishPara();finishList();continue;}
      const level=heading(line);
      if(level) {
        finishPara();finishList();
        const id='ptra-chapter-'+chapters.length;
        chapters.push({id,title:line,level});
        out.push('<h'+level+' id="'+id+'">'+esc(line)+'</h'+level+'>');
        continue;
      }
      const type=marker(line);
      if(type==='bullet'){
        finishPara();
        list.push(line);
        continue;
      }
      if(type==='legal'){
        finishPara();finishList();
        out.push('<aside class="ptra-book-law">'+esc(line)+'</aside>');
        continue;
      }
      finishList();
      para.push(line);
      // Limita blocos extensos quando a extração do PDF não contém linhas em branco.
      if(para.join(' ').length>850)finishPara();
    }
    finishPara();finishList();
    return {html:out.join('\n'),chapters};
  }
  const validQuestions=questions=>Array.isArray(questions)?questions.filter(q=>q&&Array.isArray(q.options)&&q.options.length>0):[];
  function card(q,index) {
    const options=q.options.map((o,i)=>'<button class="ptra-book-option" type="button" data-ptra-option="'+index+'" data-letter="'+esc(o.letter||String.fromCharCode(65+i))+'" aria-pressed="false"><b>'+esc(o.letter||String.fromCharCode(65+i))+'</b><span>'+esc(o.text||'')+'</span></button>').join('');
    return '<article class="ptra-book-qcard" data-ptra-question="'+index+'">'+
      '<div class="ptra-book-qnumber">QUESTÃO '+(index+1)+'</div>'+
      '<h3>'+esc(q.stem||'')+'</h3>'+
      '<div class="ptra-book-options" role="group" aria-label="Alternativas da questão '+(index+1)+'">'+options+'</div>'+
      '<div class="ptra-book-qactions"><button type="button" data-ptra-check="'+index+'" disabled>CONFERIR RESPOSTA</button></div>'+
      '<div class="ptra-book-feedback" data-ptra-feedback="'+index+'" hidden aria-live="polite"></div>'+
    '</article>';
  }
  function render(meta,mat,kind) {
    const pages=Array.isArray(mat?.pages)?mat.pages:[];
    const questions=validQuestions(mat?.questions);
    const split=splitTheory(pages,questions);
    const formatted=formatTheory(split.theory);
    const nav=formatted.chapters.length>1?
      '<details class="ptra-book-toc"><summary>☰ Sumário da apostila</summary><nav aria-label="Sumário do módulo">'+
      formatted.chapters.map(x=>'<a href="#'+x.id+'" data-ptra-jump="'+x.id+'">'+esc(x.title)+'</a>').join('')+'</nav></details>':'';
    const original=pages.join('\n\n');
    const review='<section class="ptra-book-review" data-ptra-inline-review>'+
      '<header><span>REVISÃO ATIVA</span><h2>Questões de fixação</h2><p>Responda diretamente na apostila. As alternativas mostram o resultado após a confirmação.</p></header>'+
      (questions.length?
        '<div class="ptra-book-score" role="status" aria-live="polite" data-ptra-score>0 de '+questions.length+' questões conferidas</div>'+
        questions.map(card).join('')+
        '<div class="ptra-book-round-actions"><button type="button" data-ptra-finish disabled>FINALIZAR RODADA</button><button type="button" data-ptra-reset>RECOMEÇAR QUESTÕES</button></div>'+
        '<div class="ptra-book-round-result" data-ptra-result aria-live="polite" hidden></div>':
        '<p>Não há questões estruturadas disponíveis neste material.</p>')+
      '</section>';
    return '<article class="ptra-native-reader-article bc-universal-sheet ptra-book" data-ptra-book="'+safeNumber(meta.number)+'" data-ptra-mode="'+esc(kind)+'">'+
      '<header class="ptra-book-cover"><span>BASE COMPLETA • DIREITO PROCESSUAL DO TRABALHO</span>'+
      '<h1>'+esc(meta.title)+'</h1><p>'+(kind==='resumido'?'TEORIA RESUMIDA • PRIMEIRA LEITURA E REVISÃO':'TEORIA COMPLETA • ESTUDO INTEGRAL')+'</p></header>'+
      nav+'<div class="ptra-book-flow">'+formatted.html+'</div>'+
      '<details class="ptra-book-source"><summary>Conferir transcrição integral do PDF original</summary>'+
      '<p>Transcrição preservada para conferência de fidelidade, inclusive os enunciados, gabaritos e eventuais seções não identificadas automaticamente.</p>'+
      '<pre>'+esc(original)+'</pre></details>'+
      review+'</article>';
  }
  const draftKey=(n,kind)=>NS+'m'+pad(n)+':questions:'+kind+':draft';
  const historyKey=(n,kind)=>NS+'m'+pad(n)+':questions:'+kind;
  function getJSON(key,fallback){
    try{return JSON.parse(global.localStorage.getItem(key)||'null')||fallback;}catch(_){return fallback;}
  }
  function putJSON(key,obj){try{global.localStorage.setItem(key,JSON.stringify(obj));}catch(_){}}
  function mount(container,n,kind,mat) {
    const questions=validQuestions(mat?.questions);
    if(!container||!questions.length)return;
    const last=getJSON(draftKey(n,kind),{});
    const state={selected:last.selected||{},confirmed:last.confirmed||{},completed:!!last.completed};
    const rows=[...container.querySelectorAll('[data-ptra-question]')];
    function save(){putJSON(draftKey(n,kind),state);}
    function refresh() {
      let done=0,correct=0;
      rows.forEach((row,i)=>{
        const q=questions[i],selection=state.selected[i],confirmed=!!state.confirmed[i];
        const chosen=String(selection||'').toUpperCase(),answer=String(q.answer||'').toUpperCase();
        if(confirmed){done++;if(chosen===answer)correct++;}
        row.querySelectorAll('[data-ptra-option]').forEach(btn=>{
          const letter=String(btn.dataset.letter||'').toUpperCase();
          btn.classList.toggle('selected',letter===chosen);
          btn.classList.toggle('correct',confirmed&&letter===answer);
          btn.classList.toggle('wrong',confirmed&&letter===chosen&&chosen!==answer);
          btn.setAttribute('aria-pressed',String(letter===chosen));
          btn.disabled=confirmed||state.completed;
        });
        const check=row.querySelector('[data-ptra-check]');
        if(check){check.disabled=!chosen||confirmed||state.completed;check.textContent=confirmed?'RESPOSTA CONFERIDA':'CONFERIR RESPOSTA';}
        const feedback=row.querySelector('[data-ptra-feedback]');
        if(feedback){
          feedback.hidden=!confirmed;
          feedback.classList.toggle('right',confirmed&&chosen===answer);
          feedback.classList.toggle('wrong',confirmed&&chosen!==answer);
          feedback.innerHTML=confirmed?
            '<strong>'+(chosen===answer?'✓ Resposta correta':'✕ Resposta incorreta')+'</strong>'+
            '<p>Gabarito: '+esc(q.answer||'')+'</p>'+
            (q.comment?'<p>'+esc(q.comment)+'</p>':''):'';}
      });
      const score=container.querySelector('[data-ptra-score]');
      if(score)score.textContent=done+' de '+questions.length+' questões conferidas • '+correct+' acertos';
      const finish=container.querySelector('[data-ptra-finish]');
      if(finish){finish.disabled=done===0||state.completed;finish.textContent=state.completed?'RODADA REGISTRADA':'FINALIZAR RODADA';}
      const result=container.querySelector('[data-ptra-result]');
      if(result){
        result.hidden=!state.completed;
        result.innerHTML=state.completed?'<strong>Rodada registrada • '+correct+' acertos em '+done+' questões ('+(done?Math.round(correct/done*100):0)+'%)</strong><p>Seu histórico anterior foi preservado. Use “Recomeçar questões” para outra tentativa.</p>':'';
      }
    }
    container.onclick=event=>{
      const link=event.target.closest('[data-ptra-jump]');
      if(link){event.preventDefault();container.querySelector('#'+link.dataset.ptraJump)?.scrollIntoView({block:'start',behavior:'smooth'});return;}
      const option=event.target.closest('[data-ptra-option]');
      if(option&&container.contains(option)) {
        const i=Number(option.dataset.ptraOption);if(state.confirmed[i]||state.completed)return;
        state.selected[i]=option.dataset.letter;save();refresh();return;
      }
      const check=event.target.closest('[data-ptra-check]');
      if(check&&container.contains(check)) {
        const i=Number(check.dataset.ptraCheck);
        if(!state.selected[i]||state.confirmed[i]||state.completed)return;
        state.confirmed[i]=true;save();refresh();return;
      }
      if(event.target.closest('[data-ptra-finish]')) {
        if(state.completed)return;
        const confirmed=questions.map((q,i)=>({q,i})).filter(x=>state.confirmed[x.i]);
        if(!confirmed.length)return;
        const correct=confirmed.filter(({q,i})=>String(q.answer||'').toUpperCase()===String(state.selected[i]||'').toUpperCase());
        const wrong=confirmed.filter(({q,i})=>String(q.answer||'').toUpperCase()!==String(state.selected[i]||'').toUpperCase()).map(({q,i})=>q.n??i+1);
        const hist=getJSON(historyKey(n,kind),[]);
        const rows=Array.isArray(hist)?hist:[];
        rows.push({at:Date.now(),answered:confirmed.length,correct:correct.length,wrong,pct:Math.round(correct.length/confirmed.length*100),review:false,source:'reader-inline'});
        putJSON(historyKey(n,kind),rows);
        state.completed=true;save();refresh();container.querySelector('[data-ptra-result]')?.scrollIntoView({block:'nearest',behavior:'smooth'});return;
      }
      if(event.target.closest('[data-ptra-reset]')) {
        state.selected={};state.confirmed={};state.completed=false;
        save();refresh();container.querySelector('.ptra-book-review')?.scrollIntoView({block:'start',behavior:'smooth'});
      }
    };
    refresh();
  }
  global.PtraReaderUpgrade={render,mount,formatTheory,splitTheory,validQuestions};
})(window);