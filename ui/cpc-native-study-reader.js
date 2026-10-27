(function(global){
'use strict';
const OVERLAY_ID='cpcNativeReaderOverlay';
const STORAGE='central-v6:native-reader:cpc:cpc1';
let current=null;

function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function norm(s){return String(s||'').replace(/\u00a0/g,' ').replace(/[ \t]+/g,' ').trim()}
function normKey(s){return norm(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
function source(){return global.BASE_NATIVE_CONTENT?.cpc?.m01||null}
function key(part){return STORAGE+':'+part}
function chapterDone(mode,id){return localStorage.getItem(key('chapter:'+mode+':'+id))==='1'}
function setChapterDone(mode,id,v){localStorage.setItem(key('chapter:'+mode+':'+id),v?'1':'0')}

function cleanLines(raw,mode){
 const complete=mode==='complete';
 return String(raw||'').replace(/\r/g,'').split('\n').map(line=>{
   // O texto da apostila foi exportado com rodapés de PDF colados ao começo
   // de linhas válidas. Retirar apenas o carimbo, preservando o restante.
   if(complete)line=line.replace(/^BASE COMPLETA\s*·\s*CPC\s*·\s*M01\s*\d+\s*\/\s*23/,'');
   return norm(line);
 }).filter(line=>{
   if(!line)return true;
   if(/^BASE COMPLETA(?:\s*[|•·-]|$)/i.test(line))return false;
   if(/^Resumo para primeira leitura/i.test(line))return false;
   if(/^Versão final auditada/i.test(line))return false;
   if(/^Foco:/i.test(line))return false;
   if(/^Núcleo legal:/i.test(line))return false;
   if(/^M01$/i.test(line))return false;
   return true;
 });
}
function reflowCpcComplete(lines){
 // Somente títulos comprovadamente divididos no CPC M01 aprovado.
 // O conteúdo de origem, índices persistidos e resumo não são alterados.
 const continuations=[
   [/^1\. Normas fundamentais — arts\. 1º a 12:/,2],
   [/^2\. Fontes, interpretação e integração:/,2],
   [/^3\. Aplicação das normas — arts\. 13 a 15:/,1],
   [/^4\. Ponte para M02 — arts\. 16 a 41:/,1],
   [/^9\. SISTEMA MULTIPORTAS E SOLUÇÃO CONSENSUAL/,1],
   [/^10\. DURAÇÃO RAZOÁVEL, SOLUÇÃO INTEGRAL E PRIMAZIA/,1],
   [/^18\. PUBLICIDADE, SEGREDO DE JUSTIÇA E FUNDAMENTAÇÃO/,1],
   [/^25\. PONTE PARA O M02 — JURISDIÇÃO E AÇÃO/,1],
   [/^27\. PONTE PARA O M02 — LIMITES DA JURISDIÇÃO/,1],
   [/^28\. PONTE PARA O M02 — COOPERAÇÃO JURÍDICA/,1],
   [/^29\. JURISPRUDÊNCIA ATUALIZADA PARA PROVA/,1],
   [/^37\. FONTES NORMATIVAS E JURISPRUDENCIAIS UTILIZADAS/,1]
 ];
 const out=[];
 for(let i=0;i<lines.length;i++){
   const line=lines[i];
   const match=continuations.find(([start])=>start.test(line));
   if(!match){out.push(line);continue}
   const extra=lines.slice(i+1,i+1+match[1]);
   // Não anexar outro título caso a fonte seja alterada no futuro.
   if(extra.length!==match[1]||extra.some(l=>!l||/^\d+\.\s+[A-ZÁÉÍÓÚÃÕÇ]/.test(l))){
     out.push(line);continue;
   }
   out.push([line,...extra].join(' '));i+=match[1];
 }
 return out;
}
function headingInfo(line){
 const l=norm(line); if(!l)return null;
 let m=l.match(/^(\d+)\.\s+(.{3,450})$/); if(m)return {level:2,text:l};
 m=l.match(/^(\d+)\.(\d+)\s+(.{3,180})$/); if(m)return {level:3,text:l};
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
function cpcM01LawTable(lines,start){
 if(lines[start]!=='Bloco Dispositivos Ponto de atenção')return null;
 let end=start+1;
 while(end<lines.length&&!/^5\. CONSTITUCIONALIZAÇÃO DO PROCESSO CIVIL/.test(lines[end]))end++;
 if(end>=lines.length)return null;
 const rows=[];
 for(const line of lines.slice(start+1,end)){
   if(!line||line==='Bloco Dispositivos Ponto de atenção')continue;
   const cell=line.match(/^(.*?)\s+(CPC,\s+arts?\.\s*\d+º?(?:\s+e\s+\d+º?)?)\s+(.+)$/);
   if(cell)rows.push({topic:cell[1],law:cell[2],note:cell[3]});
   else if(rows.length)rows[rows.length-1].note+=' '+line;
   else return null;
 }
 // Se a apostila mudar, conservamos o texto corrido em vez de perder células.
 return rows.length===15?{rows,end}:null;
}
function parse(raw,mode){
 const clean=cleanLines(raw,mode);
 const lines=mode==='complete'?reflowCpcComplete(clean):clean;
 const blocks=[];let para=[];
 const flush=()=>{if(para.length){blocks.push({type:'p',text:para.join(' ')});para=[]}};
 for(let i=0;i<lines.length;i++){
   const line=lines[i];
   if(!line){flush();continue}
   if(mode==='complete'){
     const table=cpcM01LawTable(lines,i);
     if(table){flush();blocks.push({type:'lawTable',rows:table.rows});i=table.end-1;continue}
   }
   const hi=headingInfo(line);
   if(hi){flush();blocks.push({type:'h',level:hi.level,text:hi.text});continue}
   const co=calloutType(line);
   if(co){
     flush();
     const body=[];
     // A frase após "Pegadinha:" ou "Atenção:" integra a explicação.
     // Antes, o leitor a transformava em uma legenda gigante e separava
     // a palavra final do restante da frase.
     const colon=line.indexOf(':');
     if(colon>=0&&colon<45){
       co[1]=line.slice(0,colon+1);
       const lead=line.slice(colon+1).trim();
       if(lead)body.push(lead);
     }
     for(let j=i+1;j<lines.length;j++){
       const n=lines[j];if(!n){if(body.length)break;else continue}
       if(headingInfo(n)||calloutType(n))break;
       body.push(n);i=j;
     }
     blocks.push({type:'callout',kind:co[0],label:co[1],text:body.join(' ')});
     continue;
   }
   if(isBullet(line)){flush();const items=[line.replace(/^[•●▪◦*-]\s+/,'')];while(i+1<lines.length&&isBullet(lines[i+1]))items.push(lines[++i].replace(/^[•●▪◦*-]\s+/,'')];blocks.push({type:'ul',items});continue}
   para.push(line);
 }
 flush();return blocks;
}
function build(raw,mode){
 let h=0; const blocks=parse(raw,mode);
 const body=blocks.map(b=>{
   if(b.type==='h'){const id='cpcsec-'+(++h)+'-'+normKey(b.text).replace(/\s+/g,'-').slice(0,60);return '<h'+b.level+' id="'+id+'">'+esc(b.text)+'</h'+b.level+'>'}
   if(b.type==='p')return '<p>'+esc(b.text)+'</p>';
   if(b.type==='ul')return '<ul>'+b.items.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>';
   if(b.type==='callout')return '<aside class="bc-native-callout '+b.kind+'"><b>'+esc(b.label)+'</b><div>'+esc(b.text)+'</div></aside>';
   if(b.type==='lawTable')return '<div class="bc-cpc-m01-table-scroll" tabindex="0" role="region" aria-label="Lei seca esquematizada: deslize para visualizar as colunas"><table class="bc-cpc-m01-reading-table"><thead><tr><th scope="col">Bloco</th><th scope="col">Dispositivos</th><th scope="col">Ponto de atenção</th></tr></thead><tbody>'+b.rows.map(r=>'<tr><th scope="row">'+esc(r.topic)+'</th><td>'+esc(r.law)+'</td><td>'+esc(r.note)+'</td></tr>').join('')+'</tbody></table></div>';
   return '';
 }).join('');
 const words=norm(raw).split(/\s+/).filter(Boolean).length;
 return {body,words,mins:Math.max(1,Math.round(words/205))};
}
function buildFromHtml(html,raw){let h=0;const body=String(html).replace(/<h([23])>([\s\S]*?)<\/h\1>/g,(m,l,t)=>{const txt=t.replace(/<[^>]+>/g,'').replace(/&amp;/g,'&');return '<h'+l+' id="cpcsec-'+(++h)+'-'+normKey(txt).replace(/\s+/g,'-').slice(0,60)+'">'+t+'</h'+l+'>'});const words=norm(raw).split(/\s+/).filter(Boolean).length;return {body,words,mins:Math.max(1,Math.round(words/205))}}
function chapters(mode){return source()?.chapters?.[mode]||[]}
function findHeading(ch){
 if(!current||!ch)return null;
 const ordered=Array.from(current.article.querySelectorAll('h2,h3'));
 if(!ordered.length)return null;
 const pos=String(ch.id||'').match(/^[sc](\d+)$/);
 if(pos){const index=Math.max(0,Number(pos[1])-1),direct=ordered[Math.min(index,ordered.length-1)];if(direct)return direct}
 const target=normKey(ch.match||ch.title);
 const exact=ordered.find(el=>{const key=normKey(el.textContent);return key===target||key.startsWith(target)||target.startsWith(key)});
 if(exact)return exact;
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
 const sc=current.scroll,bottom=sc.scrollTop+sc.clientHeight; let changed=false;
 current.map.forEach((x,i)=>{
   if(chapterDone(current.mode,x.chapter.id)||!x.heading)return;
   const start=x.heading.offsetTop,next=current.map[i+1]?.heading?.offsetTop||current.article.scrollHeight;
   if(bottom>=start+Math.max(90,(next-start)*.72)){setChapterDone(current.mode,x.chapter.id,true);changed=true}
 });
 if(changed)refresh();
}
function close(){
 const ov=document.getElementById(OVERLAY_ID); if(ov)ov.remove();
 document.body.style.overflow='';
 current=null;
 const mod=document.querySelector('#subjects .subject[data-id="cpc"] .cf-module[data-cf="cpc1"]');
 if(mod)mod.scrollIntoView({behavior:'smooth',block:'start'});
}
function open(mode){
 const data=source(); if(!data){alert('Conteúdo do CPC M01 ainda está carregando.');return}
 close();
 const raw=mode==='summary'?data.summary:data.complete,parsed=(mode==='summary'&&data.summaryHtml)?buildFromHtml(data.summaryHtml,raw):build(raw,mode),label=mode==='summary'?'Conteúdo resumido':'Conteúdo completo';
 const ov=document.createElement('div');ov.id=OVERLAY_ID;ov.className='bc-native-reader-overlay';
 ov.innerHTML='<section class="bc-native-reader" role="dialog" aria-modal="true">'+
 '<header class="bc-native-reader-head"><div class="bc-native-reader-title"><b>CPC M01 — '+esc(data.title)+'</b><small>'+label+' • leitura incorporada à Base Completa</small></div><span class="bc-native-reader-meta">'+parsed.words.toLocaleString('pt-BR')+' palavras • ~'+parsed.mins+' min</span><button class="bc-native-reader-close" data-cpc-close>×</button><div class="bc-native-reader-progress-track"><div class="bc-native-reader-progress"></div></div></header>'+
 '<div class="bc-native-reader-tools"><button class="primary" data-cpc-back>← Voltar ao M01</button><input type="search" placeholder="Buscar neste material…"><button data-cpc-font="-1">A−</button><button data-cpc-font="1">A+</button><button data-cpc-top>Topo</button></div>'+
 '<div class="bc-native-reader-body"><nav class="bc-native-toc"><div class="bc-native-toc-label">Capítulos</div>'+toc(mode)+'</nav>'+
 '<main class="bc-native-scroll"><article class="bc-native-article"><div class="bc-native-kicker">'+(mode==='summary'?'PRIMEIRA LEITURA + REVISÃO':'TEORIA INTEGRAL')+'</div><h1>'+esc(data.title)+'</h1><p class="lead">'+(mode==='summary'?'Versão condensada para compreender e revisar o módulo.':'Apostila completa convertida para leitura nativa dentro da Central.')+'</p>'+
 '<section class="bc-native-study-progress"><div><b>Progresso de leitura</b><span data-cpc-reader-value></span></div><div class="bc-native-study-progress-track"><span data-cpc-reader-studybar></span></div><small>Os capítulos recebem check conforme você avança. Você também pode marcar manualmente no índice.</small></section>'+parsed.body+'</article></main></div></section>';
 if(mode==='complete')ov.dataset.bcPremiumPilot='cpc-m01';
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
global.CpcNativeReader={open,close,stats,chapterDone};
})(window);