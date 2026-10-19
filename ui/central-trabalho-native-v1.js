/* Direito do Trabalho — integração com o Leitor Universal da Base Completa.
   Mantém os JSONs, perguntas, gabaritos e chaves individuais de armazenamento. */
(function(g){
'use strict';
if(g.CentralTrabalhoUniversal)return;
const BASE='/modules/trabalho/native/';
let active=null,mode='resumida';
const cache=new Map();
function el(tag,cls,txt){const n=document.createElement(tag);if(cls)n.className=cls;if(txt!==undefined)n.textContent=String(txt);return n}
function esc(s){return String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
function appendStructuredContent(target,raw){
  const chunks=String(raw??'').replace(/\r/g,'').replace(/\f/g,'').split(/\n[ \t]*\n+/).map(v=>v.trim()).filter(Boolean);
  const ignored=/^(?:BASE COMPLETA(?:\s*[|·•]\s*DIREITO DO TRABALHO(?:\s*[|·•]\s*M\d+)?)?|DIREITO DO TRABALHO|TEORIA RESUMIDA|TEORIA COMPLETA|REVISÃO INTEGRADA\s*-\s*NÃO HOMOLOGADO PARA PUBLICAÇÃO|PÁGINA\s+\d+(?:\s+DE\s+\d+)?)$/i;
  const bullet=/^(?:[•●▪◦\uF0B7]|[-–](?=\s)|[✅❌])\s*/u;
  for(const rawBlock of chunks){
    const lines=rawBlock.split('\n').map(v=>v.trim()).filter(Boolean);
    if(!lines.length)continue;
    const flat=lines.join(' ').replace(/[ \t]{2,}/g,' ').trim();
    if(!flat||ignored.test(flat))continue;
    const numbered=flat.match(/^(\d{1,2}(?:\.\d{1,2}){0,3})[.)]?\s+(.+)$/);
    const letters=flat.match(/[A-Za-zÀ-ÿ]/gu)||[];
    const uppers=flat.match(/[A-ZÀ-Ý]/gu)||[];
    const uppercase=letters.length>3 && uppers.length/letters.length>.86;
    const label=/^(?:REGRA|ATENÇÃO|PEGADINHA|FUNDAMENTO|EXCEÇÃO|CONSEQUÊNCIA|ALERTA|ARTIGOS|BASE LEGAL|INTERPRETAÇÃO NO M\d+|DICA DE PROVA|NÃO CONFUNDIR|CHECKLIST|PONTO DE ATENÇÃO|CONTROLE DE PUBLICAÇÃO)$/i.test(flat);
    if(label&&flat.length<58){
      const h=el('h3','reader-label',flat);target.appendChild(h);continue;
    }
    if(numbered&&flat.length<165&&lines.length<=4&&!/^\d+(?:[.,]\d+)?\s*(?:%|anos|horas|minutos|dias|meses)\b/i.test(flat)){
      const heading=el(numbered[1].includes('.')?'h3':'h2','reader-section-heading',flat);
      target.appendChild(heading);continue;
    }
    if(uppercase&&flat.length<105&&lines.length<=3&&!/[.!?]$/.test(flat)){
      target.appendChild(el('h2','reader-section-heading',flat));continue;
    }
    const spaced=lines.filter(line=>/\S[ \t]{4,}\S/.test(line)).length;
    if(lines.length>=3&&spaced>=2&&spaced>=Math.ceil(lines.length/2)){
      const wrap=el('div','reader-table-wrap'),table=el('table','reader-table'),body=el('tbody');
      for(const line of lines){
        const tr=el('tr');
        for(const cell of line.split(/[ \t]{4,}/).filter(Boolean))tr.appendChild(el('td','',cell.trim()));
        body.appendChild(tr);
      }
      table.appendChild(body);wrap.appendChild(table);target.appendChild(wrap);continue;
    }
    if(lines.some(line=>bullet.test(line))){
      let list=null,last=null,buffer=[];
      function flush(){
        if(buffer.length){target.appendChild(el('p','reader-paragraph',buffer.join(' ')));buffer=[];}
      }
      for(const line of lines){
        if(bullet.test(line)){
          flush();
          if(!list){list=el('ul','reader-list');target.appendChild(list);}
          last=el('li',line.startsWith('❌')?'reader-wrong':line.startsWith('✅')?'reader-right':'',line.replace(bullet,''));
          list.appendChild(last);
        }else if(last){last.textContent+=' '+line;}else buffer.push(line);
      }
      flush();continue;
    }
    if(/^(?:NOTA DE ATUALIZAÇÃO JURISPRUDENCIAL|ATENÇÃO DE AUDITORIA|NOTA DE INTEGRIDADE|CONTROLE DE PUBLICAÇÃO)\b/i.test(flat)){
      target.appendChild(el('aside','reader-legal-note',flat));continue;
    }
    if(/^M\d{1,2}\s*[-—–]\s*/i.test(flat)&&flat.length<200){
      target.appendChild(el('h2','reader-section-heading',flat));continue;
    }
    if(lines.length<=2&&flat.length<100&&/^(?:[A-ZÀ-Ý][a-zà-ÿ].*)(?:\s[-—–]\s.+)?$/.test(flat)&&!/[.:;!?]$/.test(flat)&&!/\b(?:art|arts|lei|súmula|tema)\.?\s*\d/i.test(flat)){
      // Títulos temáticos de aparência editorial; não altera a redação.
      target.appendChild(el('h3','reader-topic-heading',flat));continue;
    }
    target.appendChild(el('p','reader-paragraph',flat));
  }
}
function theoryPagesWithoutPrintedQuestions(pages){
  // Os PDFs originais contêm perguntas e gabaritos impressos.
  // Retiramos apenas a duplicação VISUAL, mantendo o JSON intacto;
  // as questões estruturadas e atualizadas são exibidas ao final da apostila.
  const questionHeading=/(?:^|\n)[ \t]*(?:#{1,3}[ \t]*)?(?:(?:\d{1,2})[.)]?[ \t]+|M\d{1,2}[ \t]*[—-][ \t]*)?(?:(?:5|10)[ \t]+)?quest[õo]es?(?:[ \t]+de)?[ \t]+fixa[çc][ãa]o\b/i;
  let endPage=pages.length,endIndex=0,cut=false;
  const start=Math.floor(pages.length*.59);
  for(let i=start;i<pages.length;i++){
    const match=questionHeading.exec(pages[i]);
    if(match){endPage=i;endIndex=match.index;cut=true;break;}
  }
  const items=[];
  for(let i=0;i<pages.length;i++){
    if(cut&&i>endPage)break;
    let part=cut&&i===endPage?pages[i].slice(0,endIndex):pages[i];
    if(i===0){
      const section=/\n[ \t]*(?:VISÃO GERAL|CONCEITOS ESSENCIAIS|FUNDAMENTO LEGAL PRINCIPAL)[ \t]*\n/i.exec(part);
      if(section)part=part.slice(section.index);
      else {
        continue; // Evita repetir a capa do PDF; não omite páginas de teoria.
      }
    }
    if(part.trim())items.push({index:i,text:part});
  }
  return items;
}

function documentHtml(d,kind){
 mode=kind;
 const root=el('div','bc-trabalho-book');
 const head=el('header','bc-trabalho-book-head');
 head.append(el('p','bc-native-kicker','BASE COMPLETA · DIREITO DO TRABALHO · M'+d.numero),
   el('h1','',d.titulo),el('p','lead',kind==='completa'?'Teoria Completa':'Teoria Resumida'));
 root.append(head);
 if(kind==='infografico'){
   const fig=el('figure','bc-trabalho-infografico'),img=el('img');
   img.alt='Infográfico do módulo '+d.numero;
   img.src=new URL(d.infografico,new URL(BASE+'modules/',location.origin)).href;
   fig.append(img);root.append(fig);return root.innerHTML;
 }
 const pages=theoryPagesWithoutPrintedQuestions(d.tipos[kind].paginas);
 for(const part of pages){
   const page=el('section','bc-trabalho-page');
   page.dataset.readerPage=String(part.index);
   appendStructuredContent(page,part.text);
   root.append(page);
 }
 const quiz=el('section','bc-trabalho-questions bc-native-internal-review');
 quiz.id='bc-trabalho-questoes';
 quiz.append(el('h2','','Questões de fixação'),el('p','','Responda e confira os comentários após estudar a teoria.'));
 for(const q of d.questoes[kind]){
   const card=el('section','question bc-trabalho-question');card.dataset.questionId=q.id;
   card.append(el('h3','bc-trabalho-question-title',String(q.numero)+'. '+q.enunciado));
   const opts=el('div','bc-trabalho-options');opts.setAttribute('role','radiogroup');opts.setAttribute('aria-label','Questão '+q.numero);
   for(const [letter,text] of Object.entries(q.alternativas)){
     const label=el('label','bc-trabalho-option'),input=el('input'),span=el('span','',letter+') '+text);
     input.type='radio';input.value=letter;input.name='dt-'+q.id;
     label.append(input,span);opts.append(label);
   }
   const check=el('button','bc-trabalho-check','Conferir resposta');check.type='button';
   const feedback=el('div','bc-trabalho-feedback');feedback.hidden=true;feedback.setAttribute('role','status');
   card.append(opts,check,feedback);quiz.append(card);
 }
 root.append(quiz);return root.innerHTML;
}
function toc(body){
 const nodes=Array.from(body.querySelectorAll('.bc-trabalho-book h2,.bc-trabalho-book h3')).filter(h=>!h.closest('.bc-trabalho-questions')).slice(0,70);
 return '<div class="bc-native-toc-label">Assuntos</div>'+nodes.map((node,i)=>{node.id='dt-toc-'+i;return '<button type="button" data-dt-toc="'+i+'">'+esc(node.textContent)+'</button>'}).join('');
}
async function accountStore(m){
 let store=g.sessionStorage,scope='preview-session:';
 try{const r=await fetch('/api/auth?action=me',{credentials:'same-origin',cache:'no-store'});if(r.ok){
 const b=await r.json(),uid=String(b?.authenticated&&b?.user?.id||'').trim();
 if(/^[a-zA-Z0-9_-]{1,120}$/.test(uid)){store=g.localStorage;scope='user:'+uid+':';}
 }}catch(_){}
 const prefix=scope+'base-completa:dt-reader:prehomologacao:m'+String(m).padStart(2,'0')+':';
 return {get(key,fallback){try{const value=store.getItem(prefix+key);return value===null?fallback:JSON.parse(value)}catch(_){return fallback}},
 put(key,value){try{store.setItem(prefix+key,JSON.stringify(value))}catch(e){console.warn('Falha ao salvar leitura',e)}}};
}
async function stats(n){
 n=Number(n);const [data,store]=await Promise.all([getModule(n),accountStore(n)]),pages=store.get('read-pages',{});
 const percent=kind=>{const total=data.tipos?.[kind]?.paginas?.length||0,done=Object.values(pages?.[kind]||{}).filter(Boolean).length;return total?Math.min(100,Math.round(done*100/total)):0};
 const answers=store.get('answers',{}),result=kind=>{const qs=data.questoes?.[kind]||[],chosen=qs.filter(q=>/^[A-E]$/.test(answers?.[q.id]||'')),correct=chosen.filter(q=>answers[q.id]===q.gabarito).length;return {total:qs.length,answered:chosen.length,correct}};
 const summaryPct=percent('resumida'),completePct=percent('completa');
 return {title:data.titulo,summaryPct,completePct,theoryPct:Math.round((summaryPct+completePct)/2),summaryQuestions:data.questoes.resumida.length,completeQuestions:data.questoes.completa.length,summaryResults:result('resumida'),completeResults:result('completa'),hasInfographic:!!data.infografico,infographic:data.infografico};
}
function openQuestions(n,kind){return open(n,kind==='resumida'?'resumida':'completa',true)}
function bindImageControls(state,body,data){
 const img=body.querySelector('.bc-trabalho-infografico img');if(!img)return;
 const controls=el('div','bc-trabalho-image-controls'),label=el('span','','Visualização integral do infográfico');
 let zoom=1;const apply=()=>{img.style.width=(zoom*100)+'%';img.style.maxWidth=zoom===1?'min(100%,1050px)':'none';img.style.height='auto';img.style.objectFit='contain'};
 const minus=el('button','','−');minus.type='button';minus.setAttribute('aria-label','Diminuir infográfico');minus.onclick=()=>{zoom=Math.max(.5,zoom-.25);apply()};
 const plus=el('button','','+');plus.type='button';plus.setAttribute('aria-label','Ampliar infográfico');plus.onclick=()=>{zoom=Math.min(3,zoom+.25);apply()};
 const fit=el('button','','Ajustar');fit.type='button';fit.onclick=()=>{zoom=1;apply()};
 const download=el('a','','Baixar infográfico');download.href=img.src;download.download='direito-do-trabalho-m'+String(state.n).padStart(2,'0')+'-infografico.webp';download.rel='noopener';
 controls.append(label,minus,plus,fit,download);body.prepend(controls);apply();
}
async function getModule(n){
 const id=String(n).padStart(2,'0');
 if(!cache.has(id)){
  cache.set(id,fetch(BASE+'modules/m'+id+'.json',{cache:'no-cache',credentials:'same-origin'}).then(async r=>{
    if(!r.ok)throw Error('HTTP '+r.status);
    const d=await r.json();
    if(Number(d.numero)!==n||d.questoes?.resumida?.length!==5||d.questoes?.completa?.length!==10||!d.tipos?.resumida?.paginas?.length||!d.tipos?.completa?.paginas?.length)throw Error('Dados incompletos do módulo');
    return d;
  }).catch(e=>{cache.delete(id);throw e}));
 }
 return cache.get(id);
}
function close(){
 if(!active)return;
 const finished=active;
 finished.observer?.disconnect();
 finished.overlay?.remove();
 active=null;
 try{document.dispatchEvent(new CustomEvent('bc-trabalho-reader-change',{detail:{module:finished.n,kind:finished.kind}}))}catch(_){}
 setTimeout(()=>g.CentralDisciplineStandard?.refresh?.(),0);
}
function percent(state){
 if(active!==state||state.kind==='infografico')return;
 const parts=Array.from(state.overlay.querySelectorAll('.bc-trabalho-page'));
 const count=parts.filter(p=>state.allRead[state.kind][p.dataset.readerPage]).length;
 const pct=parts.length?Math.round(count*100/parts.length):0;
 g.CentralNativeReadingSession.percent(state.overlay,pct);
}
function finish(){
 const state=active;
 if(!state||!state.store||state.kind==='infografico')return;
 for(const page of state.overlay.querySelectorAll('.bc-trabalho-page'))state.allRead[state.kind][page.dataset.readerPage]=true;
 state.store.put('read-pages',state.allRead);percent(state);
}
function track(state,body){
 if(state.kind==='infografico')return;
 const segments=Array.from(body.querySelectorAll('.bc-trabalho-page'));
 if(!('IntersectionObserver' in g))return;
 state.observer=new IntersectionObserver(entries=>{
   if(active!==state)return;
   let changed=false;
   for(const entry of entries){
     const key=entry.target.dataset.readerPage;
     if(entry.isIntersecting&&!state.allRead[state.kind][key]){state.allRead[state.kind][key]=true;changed=true;}
   }
   if(changed){state.store.put('read-pages',state.allRead);percent(state);}
 },{root:body,threshold:0,rootMargin:'0px 0px -5% 0px'});
 segments.forEach(s=>state.observer.observe(s));
}
function bindQuestions(state,body){
 if(state.kind==='infografico')return;
 const answers=state.store.get('answers',{}),index=new Map(state.data.questoes[state.kind].map(q=>[q.id,q]));
 body.querySelectorAll('.bc-trabalho-question').forEach(card=>{
   const answer=answers[card.dataset.questionId];
   if(/^[A-E]$/.test(answer||'')){const input=card.querySelector('input[value="'+answer+'"]');if(input)input.checked=true;}
 });
 body.addEventListener('click',event=>{
   const button=event.target.closest('.bc-trabalho-check');
   if(!button||active!==state)return;
   const card=button.closest('.bc-trabalho-question'),q=index.get(card.dataset.questionId);
   if(!q)return;
   const feedback=card.querySelector('.bc-trabalho-feedback'),choice=card.querySelector('input:checked');
   feedback.hidden=false;
   if(!choice){feedback.textContent='Selecione uma alternativa antes de conferir.';return;}
   answers[q.id]=choice.value;state.store.put('answers',answers);
   feedback.classList.toggle('wrong',choice.value!==q.gabarito);
   feedback.replaceChildren(el('strong','',choice.value===q.gabarito?'Resposta correta.':'Confira o gabarito.'),
     el('p','','Gabarito: '+q.gabarito),el('p','',q.comentario));
 });
}
function bindNotes(state,body){
 if(state.kind==='infografico')return;
 const notes=el('details','bc-trabalho-notes'),area=el('textarea'),save=el('button','','Salvar anotação'),msg=el('small','','');
 notes.append(el('summary','','Anotações pessoais deste módulo'));
 area.value=state.store.get('notes','');area.setAttribute('aria-label','Anotações pessoais');
 area.placeholder='Registre pontos para revisar.';save.type='button';
 save.onclick=()=>{state.store.put('notes',area.value);msg.textContent='Anotação salva.'};
 notes.append(area,save,msg);body.append(notes);
}
function bindTools(state,body){
 const tools=state.overlay.querySelector('.bc-native-reader-tools');
 const back=el('button','bc-trabalho-back','← Voltar');back.type='button';back.onclick=close;
 const input=el('input');input.type='search';input.placeholder='Buscar no material…';input.setAttribute('aria-label','Buscar no material');
 const top=el('button','bc-trabalho-top','Topo');top.type='button';top.onclick=()=>body.scrollTo({top:0,behavior:'smooth'});
 const next=el('button','','Próximo');next.type='button';next.hidden=true;
 const count=el('output','bc-trabalho-search-count','');
 tools.insertBefore(back,tools.firstChild);back.after(input,next,count,top);
 const article=body.querySelector('.bc-native-article');
 let hits=[],selected=-1;
 function reset(){article.querySelectorAll('mark.dt-reader-match').forEach(m=>m.replaceWith(document.createTextNode(m.textContent)));article.normalize();hits=[];selected=-1;}
 function jump(){
   if(!hits.length)return;
   selected=(selected+1)%hits.length;
   hits.forEach((m,i)=>m.classList.toggle('current',i===selected));
   hits[selected].scrollIntoView({block:'center',behavior:'smooth'});
   count.textContent=(selected+1)+'/'+hits.length;
 }
 function search(){
   reset();const term=input.value.trim().toLocaleLowerCase('pt-BR');
   if(term.length<2){next.hidden=true;count.textContent='';return;}
   const walker=document.createTreeWalker(article,NodeFilter.SHOW_TEXT),texts=[];
   while(walker.nextNode()){
     const n=walker.currentNode;
     if(n.parentElement&&!n.parentElement.closest('script,style,textarea,.bc-trabalho-feedback,[contenteditable]'))texts.push(n);
   }
   for(let node of texts){
     let low=node.textContent.toLocaleLowerCase('pt-BR'),pos=low.indexOf(term);
     while(pos>=0&&hits.length<180){
       const middle=node.splitText(pos),tail=middle.splitText(term.length),mark=el('mark','dt-reader-match',middle.textContent);
       middle.replaceWith(mark);hits.push(mark);node=tail;low=node.textContent.toLocaleLowerCase('pt-BR');pos=low.indexOf(term);
     }
     if(hits.length>=180)break;
   }
   count.textContent=hits.length+' ocorrência(s)';next.hidden=hits.length<2;
   if(hits.length)jump();
 }
 input.addEventListener('input',()=>{clearTimeout(input._searchTimer);input._searchTimer=setTimeout(search,180)});
 input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();hits.length?jump():search()}});
 next.onclick=jump;
}
function open(n,kind,focusQuestions){
 n=Number(n);kind=['resumida','completa','infografico'].includes(kind)?kind:'resumida';
 if(!Number.isInteger(n)||n<1||n>18||!g.CentralNativeReadingSession)return false;
 close();
 const state={n,kind,overlay:null,observer:null,store:null,data:null,allRead:{},focusQuestions:!!focusQuestions};
 active=state;
 const reader=g.CentralNativeReadingSession;
 state.overlay=reader.create({id:'trab-native-reader',subject:'trab',title:'M'+String(n).padStart(2,'0')+' — Direito do Trabalho',
 eyebrow:(kind==='resumida'?'TEORIA RESUMIDA':kind==='completa'?'TEORIA COMPLETA':'INFOGRÁFICO')+' · PRÉ-HOMOLOGAÇÃO',close,finish});
 Promise.all([getModule(n),accountStore(n)]).then(([data,store])=>{
   if(active!==state)return;
   state.data=data;state.store=store;
   state.allRead=store.get('read-pages',{});state.allRead[kind]??={};
   state.overlay.querySelector('.bc-native-reader-title b').textContent='M'+String(n).padStart(2,'0')+' — '+data.titulo;
   const body=reader.show(state.overlay,documentHtml(data,kind),toc,Number(store.get('scroll:'+kind,0))||0,()=>{
     if(active!==state)return;
     const b=state.overlay.querySelector('.bc-native-scroll');
     if(reader.canTrack(state.overlay,b))store.put('scroll:'+kind,Math.round(b.scrollTop));
   });
   body.querySelector('.bc-native-article').classList.add('bc-trabalho-universal-content');
   if(kind==='infografico')state.overlay.querySelector('[data-finish-reading]').hidden=true;
   else{bindQuestions(state,body);bindNotes(state,body);track(state,body);percent(state);}
   state.overlay.querySelector('.bc-native-toc').addEventListener('click',e=>{
     const b=e.target.closest('[data-dt-toc]');if(!b)return;
     body.querySelectorAll('.bc-trabalho-book h2,.bc-trabalho-book h3')[Number(b.dataset.dtToc)]?.scrollIntoView({block:'start',behavior:'smooth'});
   });
   bindTools(state,body);
   if(kind==='infografico')bindImageControls(state,body,data);
   if(state.focusQuestions)requestAnimationFrame(()=>{const q=body.querySelector('#bc-trabalho-questoes');if(q)body.scrollTo({top:q.offsetTop,behavior:'smooth'})});
   g.CentralUniversalReader?.scan(state.overlay);
 }).catch(error=>{
   if(active!==state)return;
   console.error('Falha no leitor universal de Direito do Trabalho',error);
   reader.fail(state.overlay,()=>open(n,kind));
 });
 return true;
}
g.CentralTrabalhoUniversal=Object.freeze({open,openQuestions,stats,close});
g.CentralTrabalhoNative=g.CentralTrabalhoUniversal;
})(window);
