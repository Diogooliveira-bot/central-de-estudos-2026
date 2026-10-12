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
function setTabs(){const quiz=mode!=='infografico'&&data&&page>=data.tipos[mode].paginas.length;$('btnQuizTop').textContent=quiz?'Voltar à leitura':mode==='completa'?'Ir às 10 questões':'Ir às 5 questões';$('btnQuizTop').hidden=mode==='infografico';for(const b of document.querySelectorAll('[data-tab]'))b.setAttribute('aria-selected',String(b.dataset.tab===mode));$('pdfLink').hidden=true;$('pageLabel').hidden=mode==='infografico';$('prev').hidden=$('next').hidden=$('prevBottom').hidden=$('nextBottom').hidden=true;}
function progress(){const total=data.tipos[mode]?.numero_paginas||0,v=Object.keys(readPages[mode]||{}).filter(k=>(readPages[mode]||{})[k]).length;const pct=total?Math.round(100*v/total):0;$('progress').querySelector('span').style.width=pct+'%';$('progressText').textContent=total?`${v}/${total} páginas visitadas (${pct}%)`:'Visualização do infográfico';}
function renderSide(){clear($('sideNav'));for(const [key,name] of [['resumida','Teoria resumida'],['completa','Teoria completa'],['infografico','Infográfico']]){const b=el('button',mode===key?'active':'',name);b.type='button';b.onclick=()=>change(key);$('sideNav').appendChild(b)}if(mode!=='infografico'){const b=el('button','','Questões de fixação ('+data.questoes[mode].length+')');b.onclick=()=>{page=data.tipos[mode].paginas.length;render()};$('sideNav').appendChild(b)}}
function change(next){if(!data)return;mode=next;page=0;render()}
function markRead(){if(mode==='infografico'||page>=data.tipos[mode].numero_paginas)return;readPages[mode]??={};readPages[mode][String(page)]=true;persist('read-pages',readPages)}
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
      if(entry.isIntersecting&&entry.intersectionRatio>=.05)visited(entry.target.dataset.readerPage);
    }
  },{root:null,rootMargin:'0px 0px -8% 0px',threshold:[0,.05,.2]});
  sections.forEach(section=>observer.observe(section));
  window.__dtPageObserver=observer;
}
function textSection(){
  const pages=data.tipos[mode].paginas,length=pages.length,content=$('content');
  if(window.__dtPageObserver){window.__dtPageObserver.disconnect();window.__dtPageObserver=null;}
  clear(content);
  $('pdfLink').href=data.tipos[mode].pdf;
  if(page<length){
    const article=el('article','textpage reader-document');
    article.style.setProperty('--reader-font',size+'px');
    const header=el('header','reader-document-heading');
    header.appendChild(el('small','reader-eyebrow',`BASE COMPLETA · DIREITO DO TRABALHO · M${data.numero}`));
    header.appendChild(el('h1','',data.titulo));
    header.appendChild(el('p','reader-deck',mode==='completa'?'Teoria Completa · Leitura contínua':'Teoria Resumida · Revisão estratégica'));
    header.appendChild(el('small','reader-document-status','Conteúdo em pré-homologação jurídica · Referências e erratas estão sinalizadas no material.'));
    article.appendChild(header);
    for(let i=0;i<length;i++){
      const section=el('section','reader-source-page');
      section.dataset.readerPage=String(i);
      section.id=`dt-${mod}-${mode}-p${i+1}`;
      appendStructuredContent(section,pages[i]);
      article.appendChild(section);
    }
    const headings=Array.from(article.querySelectorAll('.reader-source-page h2')).filter(h=>h.textContent.length<125).slice(0,42);
    if(headings.length>=3){
      const toc=el('details','reader-toc'),summary=el('summary','','Navegar pelos assuntos desta apostila'),list=el('ol');
      headings.forEach((h,index)=>{h.id=`dt-${mod}-${mode}-sec${index+1}`;const li=el('li'),a=el('a','',h.textContent);a.href='#'+h.id;li.appendChild(a);list.appendChild(li);});
      toc.append(summary,list);article.insertBefore(toc,header.nextSibling);
    }
    content.appendChild(article);
    $('pageLabel').textContent=`Leitura contínua · ${length} páginas de origem`;
    requestAnimationFrame(observeReadingPages);
  }else{
    content.appendChild(el('h2','reader-question-heading',`Questões de fixação — ${mode==='completa'?10:5} itens`));
    content.appendChild(el('p','muted','Selecione uma alternativa e clique em Conferir para visualizar o gabarito e o comentário.'));
    data.questoes[mode].forEach(q=>renderQuestion(q,content));
    $('pageLabel').textContent='Questões de fixação';
  }
  $('prev').disabled=$('prevBottom').disabled=true;
  $('next').disabled=$('nextBottom').disabled=true;
  progress();
}
function renderQuestion(q,root){const block=el('section','question'),title=el('div','q-title',`${q.numero}. ${q.enunciado}`);block.appendChild(title);const field=el('div');field.setAttribute('role','radiogroup');field.setAttribute('aria-label','Alternativas da questão '+q.numero);const key=q.id;for(const [letter,text] of Object.entries(q.alternativas)){const lab=el('label','choice');const radio=document.createElement('input');radio.type='radio';radio.name='q-'+key;radio.value=letter;radio.checked=answered.get(key)===letter;lab.append(radio,el('span','',`${letter}) ${text}`));field.appendChild(lab)}block.appendChild(field);const button=el('button','','Conferir resposta');button.type='button';const feedback=el('div','feedback hidden');feedback.setAttribute('role','status');button.onclick=()=>{const c=field.querySelector('input:checked');if(!c){feedback.className='feedback wrong';feedback.textContent='Selecione uma alternativa antes de conferir.';return}answered.set(key,c.value);persist('answers',Object.fromEntries(answered));const correct=c.value===q.gabarito;feedback.className=correct?'feedback':'feedback wrong';clear(feedback);feedback.append(el('strong','',correct?'Resposta conforme o gabarito original.':'Resposta diferente do gabarito original.'),el('div','',`Gabarito: ${q.gabarito}\n\n${q.comentario}`),el('small','muted','Revisão jurídica de mérito pendente.'));};block.append(button,feedback);root.appendChild(block)}
function renderImage(){const content=$('content');clear(content);content.append(el('h2','','Infográfico de revisão — M'+data.numero),el('p','muted','Imagem preparada para revisão, ainda não homologada juridicamente.'));const wrap=el('div','image-wrap'),img=document.createElement('img');img.alt='Infográfico do módulo '+data.numero;img.src=new URL(data.infografico,new URL('modules/',location.href)).href;img.loading='eager';wrap.appendChild(img);content.appendChild(wrap);progress()}
function render(){if(!data)return;setTabs();renderSide();if(mode==='infografico'){renderImage();return}textSection()}
$('btnQuizTop').onclick=()=>{if(!data||mode==='infografico')return;page=page>=data.tipos[mode].paginas.length?0:data.tipos[mode].paginas.length;render();window.scrollTo({top:0,behavior:'instant'})};const step=delta=>{if(mode==='infografico')return;page=Math.max(0,Math.min(data.tipos[mode].paginas.length,page+delta));render();window.scrollTo({top:0,behavior:'instant'})};$('prev').onclick=$('prevBottom').onclick=()=>step(-1);$('next').onclick=$('nextBottom').onclick=()=>step(1);for(const b of document.querySelectorAll('[data-tab]'))b.onclick=()=>change(b.dataset.tab);$('minus').onclick=()=>{size=Math.max(13,size-2);const doc=document.querySelector('.reader-document');if(doc)doc.style.setProperty('--reader-font',size+'px');else render()};$('plus').onclick=()=>{size=Math.min(26,size+2);const doc=document.querySelector('.reader-document');if(doc)doc.style.setProperty('--reader-font',size+'px');else render()};$('saveNotes').onclick=()=>{persist('notes',$('notes').value);$('notesStatus').textContent='Anotação salva nesta sessão/conta.'};$('btnClose').onclick=()=>{if(window.parent!==window){window.parent.postMessage({type:'BC_TRABALHO_CLOSE_READER'},location.origin)}else location.href='index.html'};if(window.parent!==window)$('btnClose').classList.remove('hidden');
if(window.parent!==window)document.documentElement.classList.add('reader-embedded');
(async()=>{try{await initAccount();const response=await fetch('modules/m'+mod+'.json',{cache:'no-cache'});if(!response.ok)throw new Error('HTTP '+response.status);data=await response.json();$('title').textContent=`M${data.numero} — ${data.titulo}`;$('notes').value=load('notes','');readPages=load('read-pages',{});for(const [id,letter] of Object.entries(load('answers',{})))answered.set(id,letter);if(query.get('material')==='completa')mode='completa';else if(query.get('material')==='infografico')mode='infografico';if(query.get('questoes')==='1'&&mode!=='infografico')page=data.tipos[mode].paginas.length;render()}catch(e){$('title').textContent='Erro ao abrir módulo';$('content').textContent='Não foi possível carregar o material: '+e.message}})();})();
