/* Accessible native law disclosures. Content and article anchors stay intact.
 * Lei seca ao lado da explicação: cada parágrafo que cita um artigo do Código Civil
 * ganha logo abaixo uma caixa recolhível com o texto do artigo (mesmo modelo do Direito
 * Constitucional). Os blocos agrupados antigos ficam só com o que não foi citado no parágrafo. */
(function(g){
 'use strict';
 const OFFICIAL='https://www2.camara.leg.br/legin/fed/lei/2002/lei-10406-10-janeiro-2002-432893-normaatualizada-pl.html';
 const OTHER_AFTER=/^\s*[,;:]?\s*(?:do|da|dos|das|no|na)\s+(CPC|C[óo]digo de Processo|CF|Constitui[çc][ãa]o|CDC|C[óo]digo de Defesa|LINDB|Lei\b|CLT|CTN|C[óo]digo (?:Penal|Tribut)|Estatuto|Decreto|Medida)/i;
 const OTHER_BEFORE=/(?:\b(?:CPC|CF(?:\/88)?|CDC|LINDB|CLT|CTN|CP|CPP)|Lei\s*(?:n[ºo°.]?\s*)?[\d.]+(?:\/\d+)?|C[óo]digo de Processo Civil)\s*[,—–:-]?\s*$/;
 const ordinal=n=>(Number(n)<=9&&/^\d+$/.test(String(n)))?n+'º':n;
 function lawOf(text,ref){
  const after=OTHER_AFTER.exec(text.slice(ref.end,ref.end+60));
  if(after)return /^(CPC|C[óo]digo de Processo)/i.test(after[1])?'cpc':/^(CF|Constitui)/i.test(after[1])?'cf':null;
  const before=text.slice(Math.max(0,ref.index-60),ref.index);
  if(OTHER_BEFORE.test(before)){return /CPC|Processo Civil/i.test(before.slice(-30))?'cpc':/CF/i.test(before.slice(-12))?'cf':null;}
  return 'cc';
 }
 function registry(root){
  const reg=new Map();
  for(const art of root.querySelectorAll('.law-article[data-law-key]')){
   const key=art.getAttribute('data-law-key');
   const lines=[...art.querySelectorAll(':scope > p')].map(p=>p.textContent.trim()).filter(Boolean);
   if(!lines.length)continue;
   const prev=reg.get(key);if(prev&&prev.lines.join('').length>=lines.join('').length)continue;
   reg.set(key,{label:(art.querySelector('.law-source')?.textContent||key).trim(),lines,url:art.querySelector('a.law-official')?.getAttribute('href')||''});
  }
  const guided=g.BC_CIV_GUIDED_LAW;
  if(guided&&typeof guided==='object'){
   for(const mod of Object.values(guided)){
    if(!mod||typeof mod!=='object')continue;
    for(const group of Object.values(mod)){
     if(!Array.isArray(group))continue;
     for(const row of group){
      const m=Array.isArray(row)&&String(row[0]).match(/^CC,\s*art\.\s*(\d{1,4}(?:\.\d{3})?(?:-[A-Z])?)/i);
      if(!m||!Array.isArray(row[1]))continue;
      const id=g.BCLawInline.id(m[1]),key='cc:'+id,lines=row[1].filter(t=>typeof t==='string'&&t.trim()&&!/^\s*(?:\[…\]|\[\.\.\.\]|…|\.\.\.)\s*$/.test(t));
      if(!lines.length)continue;
      const prev=reg.get(key);if(prev&&prev.lines.join('').length>=lines.join('').length)continue;
      reg.set(key,{label:'CC · Art. '+ordinal(id),lines,url:OFFICIAL});
     }
    }
   }
  }
  return reg;
 }
 function shortLabel(entry,ref){
  const base=entry.label.replace(/\s*·\s*/,', ').replace(/\bArt\./,'art.');
  const suffix=(ref.para?', § '+ref.para+'º':'')+(ref.incs&&ref.incs.length?', '+ref.incs.join(', '):'');
  return base+suffix;
 }
 function build(doc,items){
  const details=doc.createElement('details');
  details.className='law law-inline';details.setAttribute('aria-label','Lei seca relacionada à explicação');
  details.setAttribute('data-law-inline',items.map(i=>i.key).join(' '));
  const summary=doc.createElement('summary');
  summary.textContent='Lei seca — '+items.map(i=>i.title).join('; ');
  details.append(summary);
  let total=0;
  for(const item of items){
   const box=doc.createElement('div');box.className='law-article';box.setAttribute('data-law-key',item.key);
   if(items.length>1){const source=doc.createElement('div');source.className='law-source';source.textContent=item.entry.label;box.append(source);}
   for(const line of item.lines){const p=doc.createElement('p');p.textContent=line;box.append(p);total++;}
   if(item.entry.url){const a=doc.createElement('a');a.className='law-official';a.setAttribute('href',item.entry.url);a.setAttribute('target','_blank');a.setAttribute('rel','noopener noreferrer');a.textContent='Fonte oficial';box.append(a);}
   details.append(box);
  }
  if(total<=3)details.setAttribute('open','');
  return details;
 }
 const BLOCKS='p,div,ul,ol,table,h1,h2,h3,h4,details,aside,li,blockquote';
 function isLeaf(el){return !el.querySelector(BLOCKS);}
 function inline(root){
  const lib=g.BCLawInline;if(!lib||!root||typeof root.querySelectorAll!=='function')return 0;
  const reg=registry(root),doc=root.ownerDocument||document;
  let section=0,inserted=0;const shown=new Map(),asides=[];
  const mark=(idx,key)=>{if(!shown.has(idx))shown.set(idx,new Set());shown.get(idx).add(key);};
  const nodes=[...root.querySelectorAll('h1,h2,h3,h4,p,div,ul,ol,table,aside.law,details.law-inline')];
  for(const el of nodes){
   if(/^H[1-4]$/.test(el.tagName)){section++;continue;}
   if(el.matches('details.law-inline')){for(const k of (el.getAttribute('data-law-inline')||'').split(/\s+/))if(k)mark(section,k);continue;}
   if(el.matches('aside.law')){asides.push({el,section});continue;}
   if(el.closest('aside.law,details,.law-article'))continue;
   const isList=/^(UL|OL)$/.test(el.tagName),isTable=el.tagName==='TABLE';
   // Itens de lista e células de tabela entram junto com a lista/tabela; parágrafos e quadros soltos entram sozinhos.
   if(isList||isTable){if(el.parentElement&&el.parentElement.closest('ul,ol,table'))continue;}
   else{if(el.closest('ul,ol,table'))continue;if(!isLeaf(el))continue;}
   const text=(el.textContent||'').replace(/\s+/g,' ').trim();
   if(text.length<12||!/\bart/i.test(text))continue;
   let anchor=el;
   if(isTable){const wrap=el.parentElement;if(wrap&&wrap.children.length===1&&wrap!==root&&!wrap.matches('article,section,main'))anchor=wrap;}
   // Já tem a caixa logo abaixo (conteúdo reaberto ou salvo): não repete.
   if(anchor.nextElementSibling&&anchor.nextElementSibling.matches('details.law-inline'))continue;
   const cap=(isList||isTable)?4:3,seen=new Set(),got=[];
   const have=shown.get(section)||new Set();
   const sources=(isList||isTable)?[...el.querySelectorAll(isList?'li':'td,th')].filter(x=>isLeaf(x)||x.tagName==='LI').map(x=>(x.textContent||'').replace(/\s+/g,' ').trim()):[text];
   for(const src of sources){
    if(got.length>=cap)break;
    for(const ref of lib.scan(src)){
     const law=lawOf(src,ref);if(!law)continue;
     const key=law+':'+ref.article;
     if(seen.has(key)||have.has(key)||!reg.has(key))continue;
     const entry=reg.get(key),lines=lib.excerpt(entry.lines,ref);
     if(!lines.length)continue;
     seen.add(key);got.push({key,entry,lines,title:shortLabel(entry,ref)});
     if(got.length>=cap)break;
    }
   }
   if(!got.length)continue;
   const details=build(doc,got);
   if(!anchor.parentNode)continue;
   anchor.after(details);
   for(const i of got)mark(section,i.key);
   inserted++;
  }
  // Os blocos agrupados ficam só com o que não foi mostrado ao lado da explicação da mesma seção.
  for(const {el,section:sec} of asides){
   const have=shown.get(sec);if(!have)continue;
   for(const art of [...el.querySelectorAll('.law-article[data-law-key]')])if(have.has(art.getAttribute('data-law-key')))art.remove();
   if(!el.querySelector('.law-article'))el.remove();
  }
  return inserted;
 }
 function enhance(root){
  inline(root);
  for(const block of root.querySelectorAll('.law')){
   if(block.tagName==='DETAILS')continue;
   const details=document.createElement('details');
   for(const attr of block.attributes)details.setAttribute(attr.name,attr.value);
   const summary=document.createElement('summary');
   const count=block.querySelectorAll('.law-article').length;
   summary.textContent='Lei seca'+(count?' · '+count+(count===1?' artigo':' artigos'):'');
   block.querySelector('.law-label')?.remove();
   details.append(summary);while(block.firstChild)details.append(block.firstChild);
   block.replaceWith(details);
  }
 }
 g.CivilLawDisclosure=Object.freeze({enhance,inline});
})(window);
