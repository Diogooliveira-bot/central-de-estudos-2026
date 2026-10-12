(()=>{'use strict';const $=id=>document.getElementById(id),query=new URLSearchParams(location.search);const n=Number(query.get('modulo')||1),mod=Number.isInteger(n)&&n>=1&&n<=18?String(n).padStart(2,'0'):'01';let data=null,mode='resumida',page=0,size=17;const answered=new Map(),localKey='base-completa:dt-reader:prehomologacao:'+mod+':';let savedNotes='',readPages={};
// Identificação apenas por sessão autenticada e verificada no servidor.
// Se não houver autenticação confirmada, dados temporários ficam na sessão e
// jamais reutilizam chaves de outros usuários ou do sistema legado.
let store=sessionStorage,scope='preview-session:';
async function initAccount(){try{const response=await fetch('/api/auth?action=me',{credentials:'same-origin',cache:'no-store'});if(!response.ok)return;const body=await response.json();const uid=String(body?.authenticated&&body?.user?.id||'').trim();if(uid&&/^[a-zA-Z0-9_-]{1,120}$/.test(uid)){store=localStorage;scope='user:'+uid+':';}}catch(e){console.warn('Identidade indisponível; mantendo armazenamento temporário isolado',e)}}
const storageKey=k=>scope+localKey+k;
function persist(key,value){try{store.setItem(storageKey(key),JSON.stringify(value))}catch(e){console.warn('Sem armazenamento',e)}}
function load(key,fallback){try{const s=store.getItem(storageKey(key));return s?JSON.parse(s):fallback}catch(_){return fallback}}
function el(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e}
function clear(target){target.replaceChildren()}

function progress(){
  if(!data)return;
  const root=$('studyFooter'),summary=$('progressText'),track=$('progress')?.querySelector('span');
  if(mode==='infografico'){
    root.querySelector('.reader-study-progress').hidden=true;
    return;
  }
  root.querySelector('.reader-study-progress').hidden=false;
  const displayed=Array.from(document.querySelectorAll('.reader-source-page'));
  const total=displayed.length;
  const visited=readPages[mode]||{};
  const count=displayed.filter(section=>visited[section.dataset.readerPage]).length;
  const pct=total?Math.min(100,Math.round(100*count/total)):0;
  if(track)track.style.width=pct+'%';
  if(summary)summary.textContent=count+' de '+total+' trechos de teoria visitados · '+pct+'%';
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
        readPages[mode]??={};
        if(!readPages[mode]['0']){readPages[mode]['0']=true;persist('read-pages',readPages);}
        continue; // Evita repetir a capa do PDF; não omite páginas de teoria.
      }
    }
    if(part.trim())items.push({index:i,text:part});
  }
  return items;
}
function renderTheory(){
  const pages=data.tipos[mode].paginas,content=$('content');
  clear(content);
  if(window.__dtPageObserver){window.__dtPageObserver.disconnect();window.__dtPageObserver=null;}
  const article=el('article','textpage reader-document');
  article.style.setProperty('--reader-font',size+'px');
  const header=el('header','reader-document-heading');
  header.append(
    el('small','reader-eyebrow','BASE COMPLETA · DIREITO DO TRABALHO · M'+data.numero),
    el('h1','',data.titulo),
    el('p','reader-deck',mode==='completa'?'Teoria Completa':'Teoria Resumida'),
    el('small','reader-document-status','Material em pré-homologação jurídica.'),
  );
  article.appendChild(header);
  const segments=theoryPagesWithoutPrintedQuestions(pages);
  for(const item of segments){
    const section=el('section','reader-source-page');
    section.dataset.readerPage=String(item.index);
    section.id='dt-'+mod+'-'+mode+'-p'+(item.index+1);
    appendStructuredContent(section,item.text);
    article.appendChild(section);
  }
  const headings=Array.from(article.querySelectorAll('.reader-source-page h2')).filter(h=>h.textContent.length<125).slice(0,42);
  if(headings.length>=3){
    const toc=el('details','reader-toc'),summary=el('summary','','Navegar pelos assuntos desta apostila'),list=el('ol');
    headings.forEach((h,i)=>{h.id='dt-'+mod+'-'+mode+'-sec'+(i+1);const li=el('li'),a=el('a','',h.textContent);a.href='#'+h.id;li.appendChild(a);list.appendChild(li);});
    toc.append(summary,list);
    article.insertBefore(toc,header.nextSibling);
  }
  const quiz=el('section','reader-questions');quiz.id='questoes';
  quiz.append(
    el('h2','reader-question-heading','Questões de fixação'),
    el('p','reader-question-intro',mode==='completa'?'10 questões comentadas para fixar a teoria.':'5 questões comentadas para fixar a teoria.')
  );
  for(const q of data.questoes[mode])renderQuestion(q,quiz);
  article.appendChild(quiz);
  content.appendChild(article);
  progress();
  requestAnimationFrame(()=>{
    observeReadingPages();
    if(query.get('questoes')==='1')quiz.scrollIntoView({block:'start',behavior:'instant'});
  });
}
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
function observeReadingPages(){
  if(window.__dtPageObserver){window.__dtPageObserver.disconnect();window.__dtPageObserver=null;}
  const sections=Array.from(document.querySelectorAll('.reader-source-page'));
  if(!sections.length)return;
  function visited(index){
    const k=String(index);readPages[mode]??={};
    if(readPages[mode][k])return;
    readPages[mode][k]=true;persist('read-pages',readPages);progress();
  }
  if(!('IntersectionObserver' in window)){visited(0);return;}
  const observer=new IntersectionObserver(entries=>{
    for(const entry of entries){
      if(entry.isIntersecting)visited(entry.target.dataset.readerPage);
    }
  },{root:null,rootMargin:'0px 0px -8% 0px',threshold:0});
  sections.forEach(section=>observer.observe(section));
  window.__dtPageObserver=observer;
}
function renderQuestion(q,root){const block=el('section','question'),title=el('div','q-title',`${q.numero}. ${q.enunciado}`);block.appendChild(title);const field=el('div');field.setAttribute('role','radiogroup');field.setAttribute('aria-label','Alternativas da questão '+q.numero);const key=q.id;for(const [letter,text] of Object.entries(q.alternativas)){const lab=el('label','choice');const radio=document.createElement('input');radio.type='radio';radio.name='q-'+key;radio.value=letter;radio.checked=answered.get(key)===letter;lab.append(radio,el('span','',`${letter}) ${text}`));field.appendChild(lab)}block.appendChild(field);const button=el('button','','Conferir resposta');button.type='button';const feedback=el('div','feedback hidden');feedback.setAttribute('role','status');button.onclick=()=>{const c=field.querySelector('input:checked');if(!c){feedback.className='feedback wrong';feedback.textContent='Selecione uma alternativa antes de conferir.';return}answered.set(key,c.value);persist('answers',Object.fromEntries(answered));const correct=c.value===q.gabarito;feedback.className=correct?'feedback':'feedback wrong';clear(feedback);feedback.append(el('strong','',correct?'Resposta correta conforme o gabarito do módulo.':'Resposta diferente do gabarito do módulo.'),el('div','',`Gabarito: ${q.gabarito}\n\n${q.comentario}`),el('small','muted','Revisão jurídica de mérito pendente.'));};block.append(button,feedback);root.appendChild(block)}

function renderImage(){
  const content=$('content');clear(content);
  if(window.__dtPageObserver){window.__dtPageObserver.disconnect();window.__dtPageObserver=null;}
  const article=el('article','reader-infographic');
  article.appendChild(el('h1','',data.titulo));
  const wrap=el('div','image-wrap'),img=document.createElement('img');
  img.alt='Infográfico de revisão do módulo '+data.numero;
  img.src=new URL(data.infografico,new URL('modules/',location.href)).href;
  img.loading='eager';
  wrap.appendChild(img);article.appendChild(wrap);content.appendChild(article);
  progress();
}
function render(){
  if(!data)return;
  if(mode==='infografico')renderImage();else renderTheory();
}
function changeFont(delta){
  size=Math.max(13,Math.min(26,size+delta));
  const doc=document.querySelector('.reader-document');
  if(doc)doc.style.setProperty('--reader-font',size+'px');
}
$('minus').onclick=()=>changeFont(-2);
$('plus').onclick=()=>changeFont(2);
$('saveNotes').onclick=()=>{persist('notes',$('notes').value);$('notesStatus').textContent='Anotação salva.';};
if(window.parent!==window)document.documentElement.classList.add('reader-embedded');
(async()=>{
  try{
    await initAccount();
    const response=await fetch('modules/m'+mod+'.json',{cache:'no-cache'});
    if(!response.ok)throw new Error('HTTP '+response.status);
    data=await response.json();
    if(!data.tipos?.resumida?.paginas||!data.tipos?.completa?.paginas)throw new Error('Conteúdo incompleto no módulo.');
    $('notes').value=load('notes','');
    readPages=load('read-pages',{});
    for(const [id,letter] of Object.entries(load('answers',{})))answered.set(id,letter);
    mode=query.get('material')==='completa'?'completa':query.get('material')==='infografico'?'infografico':'resumida';
    document.title='M'+data.numero+' — '+data.titulo+' | Base Completa';
    render();
  }catch(e){
    console.error('Não foi possível carregar o módulo',e);
    const host=$('content');clear(host);
    const error=el('p','reader-load-error','Não foi possível carregar o material: '+e.message);
    host.appendChild(error);
    $('studyFooter').hidden=true;
  }
})();
})();
