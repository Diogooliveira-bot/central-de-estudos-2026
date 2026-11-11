(function(global){
'use strict';
const OVERLAY_ID='cpcM07NativeReaderOverlay';
const STORAGE='central-v6:native-reader:cpc:cpc7';
let current=null;

function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function norm(s){return String(s||'').replace(/\u00a0/g,' ').replace(/[ \t]+/g,' ').trim()}
function normKey(s){return norm(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
function source(){return global.BASE_NATIVE_CONTENT?.cpc?.m07||null}
function key(part){return STORAGE+':'+part}
function chapterDone(mode,id){return localStorage.getItem(key('chapter:'+mode+':'+id))==='1'}
function setChapterDone(mode,id,v){localStorage.setItem(key('chapter:'+mode+':'+id),v?'1':'0')}

function prepareCpcLines(raw){
 const stripped=String(raw||'').replace(/BASE COMPLETA\s*[·•|]\s*CPC\s*[·•|]\s*M\d{2}\s+\d+\s*\/\s*\d{1,2}(?=\d+\.\s)/gi,'\n');
 const lines=stripped.replace(/\r/g,'').split('\n');
 const result=[];
 for(let i=0;i<lines.length;i++){
  let line=norm(lines[i]);
  if(/^\d+(?:\.\d+)*\.?(?:\s|$)/.test(line)){
   const letters=line.replace(/\bx\b/g,'').replace(/[^A-Za-zÀ-ÿ]/g,'');
   if(letters.length&&letters.replace(/[a-zà-ÿ]/g,'').length/letters.length>=.72)while(i+1<lines.length){
    const next=norm(lines[i+1]),chars=next.replace(/[^A-Za-zÀ-ÿ]/g,'');
    if(!next||/^\d+(?:\.\d+)*\.?\s/.test(next)||next.length>110||!((chars.length&&chars===chars.toUpperCase())||/^\d+[ºo]?$/.test(next)))break;
    if(/^(?:BASE|COMPLETA|M\d{2})$/.test(next))break;
    line+=' '+next;i++;
   }
  }
  result.push(line);
 }
 return result.join('\n');
}
function cleanLines(raw){
 return prepareCpcLines(raw).replace(/\r/g,'').split('\n').map(norm).filter((line,i)=>{
   if(!line)return true;
   if(/^BASE COMPLETA(?:\s*[|•·-]|$)/i.test(line))return false;
   if(/^Resumo para primeira leitura/i.test(line))return false;
   if(/^Versão final auditada/i.test(line))return false;
   if(/^Foco:/i.test(line))return false;
   if(/^Núcleo legal:/i.test(line))return false;
   if(/^BASE COMPLETA · CPC · M01 \d+ \/ \d+/i.test(line))return false;
   if(/^M01$/i.test(line))return false;
   return true;
 });
}
function headingInfo(line){
 const l=norm(line); if(!l)return null;
 let m=l.match(/^(\d+)\.\s+(.{3,180})$/); if(m){const chars=m[2].replace(/\bx\b/g,'').replace(/[^A-Za-zÀ-ÿ]/g,'');if(chars.length&&chars.replace(/[a-zà-ÿ]/g,'').length/chars.length<.72&&!(m[2].length<80&&!/[:;]|[,?.!]$/.test(m[2])))return null;return {level:2,text:l};}
 // "2.1 Conceito" e "2.1. Conceito" (com ponto, como no material de origem).
 m=l.match(/^(\d+)\.(\d+)(?:\.\d+)?\.?\s+(.{3,120})$/); if(m&&!/[;,]$/.test(l))return {level:3,text:l};
 // Subtítulo de enumeração: "b) Substitutividade" (curto e sem pontuação final).
 if(/^[a-z]\)\s+[A-ZÀ-Ý][^.;:!?]{2,70}$/.test(l))return {level:4,text:l};
 if(/^(VISÃO GERAL|TEORIA ESSENCIAL|ARTIGOS PARA DECORAR|PEGADINHAS DE PROVA|REVISÃO ATIVA)$/i.test(l))return {level:2,text:l};
 return null;
}
function isBullet(line){return /^[•●▪◦*-]\s+/.test(line)}
function calloutType(line){
 const l=norm(line).toUpperCase();
 if(/^(ATENÇÃO|ATUALIZAÇÃO|DISTINÇÃO|REGRA-CHAVE|DECORAÇÃO INTELIGENTE|FÓRMULAS DE REVISÃO|MAPA MENTAL|NÚCLEO DE PROVA)/.test(l))return ['case',norm(line)];
 if(/PEGADINHA/.test(l))return ['trap',norm(line)];
 if(/^REGRA DE BOLSO/.test(l))return ['memory','Regra de bolso'];
 return null;
}
/* Material importado de PDF: não há linha em branco entre parágrafos e os marcadores
   "•" às vezes saem em linhas próprias, separados dos itens. Nenhuma palavra muda:
   - marcador sozinho na linha é descartado;
   - linhas terminadas em ";" depois de uma linha terminada em ":" formam uma lista;
   - linha curta que termina frase encerra o parágrafo (quebra real do material). */
function lineWidth(lines){const ls=lines.filter(Boolean).map(l=>l.length).sort((a,b)=>a-b);return ls.length?ls[Math.floor(ls.length*0.9)]:0}
function listRun(lines,i){
 const items=[];
 for(let j=i;j<lines.length;j++){
   const l=lines[j];if(!l)break;if(/^(?:[•●▪◦]|\d{1,2}\.|[a-z]\))$/.test(l))continue;
   const t=l.replace(/^[•●▪◦*-]\s+/,'');
   if(t.length>160||headingInfo(t)||calloutType(t))break;
   if(/;$/.test(t)){items.push(t);continue}
   if(items.length&&/[.]$/.test(t)){items.push(t);j++;return items.length>=3?{items,next:j}:null}
   break;
 }
 return items.length>=3?{items,next:i+items.length}:null;
}
function parse(raw){
 // Título grudado no fim da frase anterior ("…absoluta.3. ARBITRAGEM") volta para a própria linha.
 const lines=[];cleanLines(raw).forEach(l=>{const m=l.match(/^(.*[.!?:;)])(\d{1,2}\.\s+[A-ZÀ-Ý][A-ZÀ-Ý0-9 ,/—–-]{3,})$/);if(m&&headingInfo(m[2]))lines.push(m[1],m[2]);else lines.push(l)});
 const blocks=[];let para=[];
 const width=lineWidth(lines);
 const flush=()=>{if(para.length){blocks.push({type:'p',text:para.join(' ')});para=[]}};
 for(let i=0;i<lines.length;i++){
   const line=lines[i];
   if(!line){flush();continue}
   if(/^(?:[•●▪◦]|\d{1,2}\.|[a-z]\))$/.test(line))continue;
   // Marcador grudado num título ("• 10. CONFLITO DE COMPETÊNCIA").
   if(/^(?:[•●▪◦]|\d{1,2}\.)\s+\d/.test(line)&&headingInfo(line.replace(/^(?:[•●▪◦]|\d{1,2}\.)\s+/,''))&&/^(?:[•●▪◦]|\d{1,2}\.\s+\d{1,2}\.\s)/.test(line)){lines[i]=line.replace(/^(?:[•●▪◦]|\d{1,2}\.)\s+/,'');i--;continue}
   // Lista logo depois de um título, sem linha introdutória terminada em ":".
   if(!para.length&&/;$/.test(line)){const run=listRun(lines,i);if(run){blocks.push({type:'ul',items:run.items});
     let used=0,j=i;while(used<run.items.length&&j<lines.length){if(!/^(?:[•●▪◦]|\d{1,2}\.|[a-z]\))$/.test(lines[j]))used++;j++}
     i=j-1;continue}}
   if(/:$/.test(line)){
     let k=i+1;while(k<lines.length&&/^(?:[•●▪◦]|\d{1,2}\.|[a-z]\))$/.test(lines[k]))k++;
     const run=listRun(lines,k);
     if(run){para.push(line);flush();blocks.push({type:'ul',items:run.items});
       let used=0,j=k;while(used<run.items.length&&j<lines.length){if(!/^(?:[•●▪◦]|\d{1,2}\.|[a-z]\))$/.test(lines[j]))used++;j++}
       i=j-1;continue}
   }
   const hi=headingInfo(line);
   if(hi){flush();blocks.push({type:'h',level:hi.level,text:hi.text});continue}
   const co=calloutType(line);
   if(co){flush();const body=[];for(let j=i+1;j<lines.length;j++){const n=lines[j];if(!n){if(body.length)break;else continue}if(/^(?:[•●▪◦]|\d{1,2}\.|[a-z]\))$/.test(n)){i=j;continue}if(headingInfo(n)||headingInfo(n.replace(/^[•●▪◦]\s+/,''))||calloutType(n))break;body.push(n);i=j}blocks.push({type:'callout',kind:co[0],label:co[1],text:body.join(' ')});continue}
   if(isBullet(line)){flush();const items=[line.replace(/^[•●▪◦*-]\s+/,'')];while(i+1<lines.length&&isBullet(lines[i+1]))items.push(lines[++i].replace(/^[•●▪◦*-]\s+/,''));blocks.push({type:'ul',items});continue}
   para.push(line);
   if(width&&/[.!?]["”»)]?$/.test(line)&&line.length<width*0.8)flush();
 }
 flush(); return blocks;
}
function build(raw){
 let h=0; const blocks=parse(raw);
 const body=blocks.map(b=>{
   if(b.type==='h'&&b.level===4)return '<h4>'+esc(b.text)+'</h4>';
   if(b.type==='h'){const id='cpcsec-'+(++h)+'-'+normKey(b.text).replace(/\s+/g,'-').slice(0,60);return '<h'+b.level+' id="'+id+'">'+esc(b.text)+'</h'+b.level+'>'}
   if(b.type==='p')return '<p>'+esc(b.text)+'</p>';
   if(b.type==='ul')return '<ul>'+b.items.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>';
   if(b.type==='callout')return '<aside class="bc-native-callout '+b.kind+'"><b>'+esc(b.label)+'</b><div>'+esc(b.text)+'</div></aside>';
   return '';
 }).join('');
 const words=norm(raw).split(/\s+/).filter(Boolean).length;
 return {body,words,mins:Math.max(1,Math.round(words/205))};
}
function buildFromHtml(html,raw){let h=0;const body=String(html).replace(/<h([23])>([\s\S]*?)<\/h\1>/g,(m,l,t)=>{const txt=t.replace(/<[^>]+>/g,'').replace(/&amp;/g,'&');return '<h'+l+' id="cpcsec-'+(++h)+'-'+normKey(txt).replace(/\s+/g,'-').slice(0,60)+'">'+t+'</h'+l+'>'});const words=norm(raw).split(/\s+/).filter(Boolean).length;return {body,words,mins:Math.max(1,Math.round(words/205))}}
function chapters(mode){return source()?.chapters?.[mode]||[]}
function findHeading(ch){
 if(!current||!ch)return null;
 const ordered=Array.from(current.article.querySelectorAll('h2,h3')).filter(el=>!el.closest('.cpc-overview,.cpc-synthesis'));
 if(!ordered.length)return null;
 // Primeiro pelo título do capítulo: a posição muda quando há subtítulos.
 const target=normKey(ch.match||ch.title);
 const exact=ordered.find(el=>{const key=normKey(el.textContent);return key===target||key.startsWith(target)||target.startsWith(key)});
 if(exact)return exact;
 const majors=ordered.filter(el=>el.tagName==='H2');
 // Nome do capítulo diferente do título ("Atos eletrônicos" x "7. PRÁTICA ELETRÔNICA"):
 // título principal com mais palavras em comum, comparando o início de cada palavra.
 const stem=w=>w.slice(0,6),wanted=[...new Set(normKey((ch.title||'')+' '+(ch.match||'')).split(' ').filter(w=>w.length>3).map(stem))];
 let near=null,nearScore=0;
 // Palavra rara pesa mais que palavra presente em muitos títulos ("atos", "processual").
 const stems=majors.map(el=>normKey(el.textContent).split(' ').map(stem));
 const weight=w=>1/Math.max(1,stems.filter(s=>s.includes(w)).length);
 majors.forEach((el,i)=>{const v=wanted.filter(w=>stems[i].includes(w)).reduce((t,w)=>t+weight(w),0);if(v>nearScore){nearScore=v;near=el}});
 if(near)return near;
 const pos=String(ch.id||'').match(/^[sc](\d+)$/);
 if(pos){const index=Math.max(0,Number(pos[1])-1),direct=majors[Math.min(index,majors.length-1)];if(direct)return direct}
 const words=target.split(' ').filter(Boolean);let best=null,score=0;
 ordered.forEach(el=>{const key=normKey(el.textContent);let value=0;words.forEach(word=>{if(key.includes(word))value++});if(value>score){score=value;best=el}});
 return best||ordered[0];
}
function stats(mode){const cs=chapters(mode);const done=cs.filter(c=>chapterDone(mode,c.id)).length;return {done,total:cs.length,pct:cs.length?Math.round(done/cs.length*100):0}}
function refresh(){
 if(!current)return;
 const st=stats(current.mode);
 const val=current.overlay.querySelector('[data-cpc-reader-value]'); if(val)val.textContent=st.done+' / '+st.total+' capítulos';
 const bar=current.overlay.querySelector('[data-cpc-reader-studybar]'); if(bar)bar.style.width=st.pct+'%';
 current.overlay.querySelectorAll('[data-cpc-chapter-check]').forEach(b=>{const d=chapterDone(current.mode,b.dataset.cpcChapterCheck);b.classList.toggle('done',d);b.textContent=d?'✓':'';});
 try{global.CpcStudyV1?.refresh?.()}catch(_){}
}
function toc(mode){
 return chapters(mode).map((c,i)=>'<div class="bc-native-toc-row"><button type="button" class="bc-native-chapter-check '+(chapterDone(mode,c.id)?'done':'')+'" data-cpc-chapter-check="'+esc(c.id)+'">'+(chapterDone(mode,c.id)?'✓':'')+'</button><button type="button" class="bc-native-chapter-jump" data-cpc-chapter-jump="'+esc(c.id)+'"><span>'+(i+1)+'.</span>'+esc(c.title)+'</button></div>').join('');
}
function autoCheck(){
 if(!current)return;
 if(current.mode==='summary' && current.article.querySelector('.cpc-original-reference:not([open])'))return;
 const sc=current.scroll,bottom=sc.scrollTop+sc.clientHeight; let changed=false;
 current.map.forEach((x,i)=>{
   if(chapterDone(current.mode,x.chapter.id)||!x.heading)return;
   const start=x.heading.offsetTop,next=current.map[i+1]?.heading?.offsetTop||current.article.scrollHeight;
   if(bottom>=start+Math.max(90,(next-start)*.72)){setChapterDone(current.mode,x.chapter.id,true);changed=true}
 });
 if(changed)refresh();
}
function close(){
 global.__CPC_VISUAL_REQUEST=(global.__CPC_VISUAL_REQUEST||0)+1;
 const ov=document.getElementById(OVERLAY_ID); if(ov)ov.remove();
 document.body.style.overflow='';
 current=null;
 const mod=document.querySelector('#subjects .subject[data-id="cpc"] .cf-module[data-cf="cpc7"]');
 if(mod)mod.scrollIntoView({behavior:'smooth',block:'start'});
}
async function open(mode){
 const data=source(); if(!data){alert('Conteúdo do CPC M07 ainda está carregando.');return}
 close();
 const raw=mode==='summary'?data.summary:data.complete,parsed=(mode==='summary'&&data.summaryHtml)?buildFromHtml(data.summaryHtml,raw):build(raw),label=mode==='summary'?'Conteúdo resumido':'Conteúdo completo';
 const request=global.__CPC_VISUAL_REQUEST=(global.__CPC_VISUAL_REQUEST||0)+1;
 try{if(!global.CpcApostilaReading)await import('/ui/cpc-apostila-reading-v1.js?v=20261111cpcpdf1');parsed.body=await global.CpcApostilaReading.transform(parsed.body,7,mode);if(request!==global.__CPC_VISUAL_REQUEST)return;}catch(error){console.warn('[CPC apostila]',error);alert('Não foi possível preparar a leitura. Confira sua conexão e tente novamente.');return;}
 const ov=document.createElement('div');ov.id=OVERLAY_ID;ov.className='bc-native-reader-overlay';
 ov.innerHTML='<section class="bc-native-reader" role="dialog" aria-modal="true">'+
 '<header class="bc-native-reader-head"><div class="bc-native-reader-title"><b>CPC M07 — '+esc(data.title)+'</b><small>'+label+' • leitura incorporada à Base Completa</small></div><span class="bc-native-reader-meta">'+parsed.words.toLocaleString('pt-BR')+' palavras • ~'+parsed.mins+' min</span><button class="bc-native-reader-close" data-cpc-close>×</button><div class="bc-native-reader-progress-track"><div class="bc-native-reader-progress"></div></div></header>'+
 '<div class="bc-native-reader-tools"><button class="primary" data-cpc-back>← Voltar ao M07</button><input type="search" placeholder="Buscar neste material…"><button data-cpc-font="-1">A−</button><button data-cpc-font="1">A+</button><button data-cpc-top>Topo</button></div>'+
 '<div class="bc-native-reader-body"><nav class="bc-native-toc"><div class="bc-native-toc-label">Capítulos</div>'+toc(mode)+'</nav>'+
 '<main class="bc-native-scroll"><article class="bc-native-article"><div class="bc-native-kicker">'+(mode==='summary'?'PRIMEIRA LEITURA + REVISÃO':'TEORIA INTEGRAL')+'</div><h1>'+esc(data.title)+'</h1><p class="lead">'+(mode==='summary'?'Versão condensada para compreender e revisar o módulo.':'Teoria completa do módulo, com exemplos e legislação para consulta.')+'</p>'+
 '<section class="bc-native-study-progress"><div><b>Progresso de leitura</b><span data-cpc-reader-value></span></div><div class="bc-native-study-progress-track"><span data-cpc-reader-studybar></span></div><small>Os capítulos recebem check conforme você avança. Você também pode marcar manualmente no índice.</small></section>'+parsed.body+'</article></main></div></section>';
 document.body.appendChild(ov);document.body.style.overflow='hidden';
 current={mode,overlay:ov,scroll:ov.querySelector('.bc-native-scroll'),article:ov.querySelector('.bc-native-article'),font:Number(localStorage.getItem(key('font'))||16),map:[]};
 current.article.style.fontSize=current.font+'px';
 current.map=chapters(mode).map(ch=>({chapter:ch,heading:findHeading(ch)}));
 const sc=current.scroll,bar=ov.querySelector('.bc-native-reader-progress');
 sc.addEventListener('scroll',()=>{const max=Math.max(1,sc.scrollHeight-sc.clientHeight);bar.style.width=(sc.scrollTop/max*100)+'%';localStorage.setItem(key(mode+':scroll'),String(sc.scrollTop));autoCheck()},{passive:true});
 ov.querySelector('[data-cpc-close]').onclick=close;ov.querySelector('[data-cpc-back]').onclick=close;ov.querySelector('[data-cpc-top]').onclick=()=>sc.scrollTo({top:0,behavior:'smooth'});
 ov.querySelectorAll('[data-cpc-font]').forEach(b=>b.onclick=()=>{current.font=Math.max(14,Math.min(21,current.font+Number(b.dataset.cpcFont)));current.article.style.fontSize=current.font+'px';localStorage.setItem(key('font'),current.font)});
 ov.querySelectorAll('[data-cpc-chapter-check]').forEach(b=>b.onclick=()=>{const id=b.dataset.cpcChapterCheck;setChapterDone(mode,id,!chapterDone(mode,id));refresh()});
 ov.querySelectorAll('[data-cpc-chapter-jump]').forEach(b=>b.onclick=()=>{const ch=chapters(mode).find(x=>x.id===b.dataset.cpcChapterJump);findHeading(ch)?.scrollIntoView({behavior:'smooth',block:'start'})});
 const search=ov.querySelector('input[type=search]');search.addEventListener('input',()=>{const q=norm(search.value).toLowerCase();current.article.querySelectorAll('mark.cpc-hit').forEach(m=>m.replaceWith(document.createTextNode(m.textContent)));current.article.normalize();if(q.length<2)return;const walker=document.createTreeWalker(current.article,NodeFilter.SHOW_TEXT);let node;while((node=walker.nextNode())){if(node.parentElement.closest('mark'))continue;const raw=node.nodeValue,idx=raw.toLowerCase().indexOf(q);if(idx>=0){const frag=document.createDocumentFragment();frag.append(raw.slice(0,idx));const mk=document.createElement('mark');mk.className='cpc-hit';mk.textContent=raw.slice(idx,idx+q.length);frag.append(mk,raw.slice(idx+q.length));node.replaceWith(frag);mk.scrollIntoView({block:'center'});break}}});
 requestAnimationFrame(()=>{const saved=Number(localStorage.getItem(key(mode+':scroll'))||0);if(saved>0)sc.scrollTop=saved;refresh();autoCheck()});
}
global.CpcM07NativeReader={open,close,stats,chapterDone};
})(window);