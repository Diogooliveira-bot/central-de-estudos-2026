/* Base Completa — extrator conservador de questões autorais existentes do Administrativo.
 * Não cria respostas ou gabaritos; sem resposta inequívoca a questão é descartada.
 * Apenas conteúdo de ADM_NATIVE_CONTENT (banco interno); não usa links de bancas.
 */
(function(g){
'use strict';
if(g.BcAdmAuthorialSource)return;
function plain(el){
 const n=el.cloneNode(true);
 n.querySelectorAll('br').forEach(x=>x.replaceWith(document.createTextNode('\n')));
 n.querySelectorAll('li').forEach(x=>{x.prepend(document.createTextNode('\n'));x.append(document.createTextNode('\n'))});
 n.querySelectorAll('p,h1,h2,h3,h4').forEach(x=>x.append(document.createTextNode('\n')));
 return n.textContent.replace(/\u00a0/g,' ').replace(/\r/g,'').replace(/[ \t]+/g,' ').replace(/\n{3,}/g,'\n\n').trim();
}
function tidy(s){return String(s||'').replace(/^[\s:—–.-]+|[\s]+$/g,'').replace(/^Enunciado\s*[.:]\s*/i,'').trim()}
function key(q){return tidy(q.q).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ')}
function itemFromText(input,label,source,answerFallback){
 const text=String(input||''),qStart=text.search(/(?:Questão\s*\d+\s*[—–-]\s*(?:FÁCIL|MÉDIA|DIFÍCIL)|Q\d+\s*[—–-])/i);
 const value=qStart>=0?text.slice(qStart).replace(/^(?:Questão\s*\d+|Q\d+)\s*[\s—–:-]*(?:FÁCIL|MÉDIA|DIFÍCIL)?\s*/i,''):text;
 const gabarito=/\bGabarito\s*:\s*([A-E])\b/i.exec(value);
 const explanation=/\bExplica[çc][aã]o\s*:\s*([\s\S]*)/i.exec(value);
 const limit=(gabarito?.index??value.length),head=value.slice(0,limit).replace(/\b(?:Resposta comentada|Gabarito e explica[çc][aã]o)\b/gi,'').trim();
 const parts=[...head.matchAll(/(?:^|\s|\n)([A-E])\)\s*/g)].filter(x=>x.index!=null);
 if(gabarito&&parts.length>=2&&parts.length<=5&&parts.every((x,i)=>x[1]===String.fromCharCode(65+i))){
  const prompt=tidy(head.slice(0,parts[0].index)),options=parts.map((m,i)=>tidy(head.slice(m.index+m[0].length,parts[i+1]?.index??head.length)));
  const answer=gabarito[1].toUpperCase().charCodeAt(0)-65,expl=tidy(explanation?.[1]||answerFallback||'');
  if(prompt.length>8&&options.every(x=>x.length>0)&&answer<options.length&&expl.length>5){
   return {id:source+'-'+label,q:prompt,options,answer,explanation:expl};
  }
 }
 if(answerFallback){
  const prompt=tidy(head.replace(/\b(?:FÁCIL|MÉDIA|DIFÍCIL)\b$/,''));
  const answerText=tidy(answerFallback);
  if(prompt.length>8&&answerText.length>4)return {id:source+'-'+label,q:prompt,type:'open',answerText,explanation:answerText};
 }
 return null;
}
function extract(markup,source){
 const root=document.createElement('div');root.innerHTML=String(markup||'');
 const out=[],seen=new Set();
 function add(item){if(item&&!seen.has(key(item))){out.push(item);seen.add(key(item))}}
 root.querySelectorAll('details.question').forEach((el,i)=>{
  const sum=el.querySelector(':scope > summary');if(!sum)return;
  const title=plain(sum).replace(/\bQuestão\s*\d+\b/i,'').replace(/\b(?:FÁCIL|MÉDIA|DIFÍCIL)\b/i,'').replace(/^[\s—–:-]+/,'');
  const options=[...el.querySelectorAll(':scope > ol > li')].map(x=>tidy(plain(x).replace(/^[A-E]\)\s*/i,'')));
  const match=/Gabarito\s*:\s*([A-E])\b/i.exec(plain(el));
  const explNode=el.querySelector('.answer p')||el.querySelector('.answer');
  if(options.length>=2&&options.length<=5&&match&&options.every(Boolean)&&title.length>8&&explNode){
   const answer=match[1].toUpperCase().charCodeAt(0)-65;
   if(answer<options.length)add({id:source+'-details-'+i,q:title,options,answer,explanation:plain(explNode)});
  }
 });
 root.querySelectorAll('article.q').forEach((el,i)=>{
  const heading=el.querySelector('h3'),prompt=el.querySelector('p:not(details p)'),details=el.querySelector('details');
  if(!heading||!prompt||!details)return;
  const answer=details.querySelector('p');
  const text=plain(answer||details);
  add(itemFromText(plain(prompt),i+1,source,text));
 });
 // Blocos de questões em listas: uma questão, um item com gabarito próprio.
 root.querySelectorAll('ol > li').forEach((el,i)=>{
  if(el.closest('details.question'))return;
  const t=plain(el);
  if(!/Gabarito\s*:/i.test(t))return;
  add(itemFromText(t,i+1,source));
 });
 // Questões identificadas por títulos: reunidas até a próxima questão/seção.
 const heads=[...root.querySelectorAll('h2,h3,h4,h5')].filter(h=>/^(?:Quest[aã]o\s*\d+|Q\d+)\b/i.test(h.textContent.trim()));
 heads.forEach((h,i)=>{
  const nodes=[],stop=heads[i+1];
  for(let n=h.nextElementSibling;n&&n!==stop;n=n.nextElementSibling){
   if(/^H[1-4]$/.test(n.tagName)&&!/^(?:Quest[aã]o\s*\d+|Q\d+)\b/i.test(n.textContent.trim()))break;
   nodes.push(n);
  }
  const raw=[h,...nodes].map(plain).join('\n');
  const inner=nodes.find(n=>n.matches('details'))||null;
  const answerText=inner?plain(inner).replace(/^Gabarito e explicação\s*/i,''):null;
  add(itemFromText(raw,i+1,source,answerText));
 });
 return out;
}
function select(summary,complete){
 const a=extract(summary,'summary'),b=extract(complete,'complete');
 const result=g.CentralInternalQuestionPolicy?.authorial(a,b)||[];
 return {items:result,summary:a.length,complete:b.length,ready:result.length===10&&result.every(g.CentralAuthorialQuiz?.valid||(()=>false))};
}
function strip(root){
 if(!root)return 0;
 // Remove apenas o bloco inteiro iniciado pelo título explícito "Questões Internas".
 // O próximo título de capítulo encerra a remoção; demais seções permanecem.
 let removed=0;
 root.querySelectorAll('details.question').forEach(d=>{d.remove();removed++});
 [...root.querySelectorAll('h1,h2,h3')].filter(h=>/^\s*(?:(?:\d+\.)\s*)?(?:5|10)\s+quest[õo]es\s+internas\b|^\s*quest[õo]es\s+internas\b/i.test(h.textContent)).forEach(h=>{
  if(!h.isConnected)return;
  let cur=h;while(cur){const next=cur.nextElementSibling;
   if(cur!==h&&/^H[12]$/.test(cur.tagName)&&!/^Quest[aã]o\s*\d+/i.test(cur.textContent))break;
   cur.remove();removed++;cur=next;
  }
 });
 return removed;
}
g.BcAdmAuthorialSource=Object.freeze({extract,select,strip});
})(window);
