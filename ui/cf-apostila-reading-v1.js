/* Base Completa | Direito Constitucional M01–M15 — apresentação editorial.
 * Preserva os dados autorais, os gabaritos e o progresso. Nenhuma fonte é alterada.
 */
(function(g){
'use strict';
if(g.CfApostilaReading)return;
const escape=v=>String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const simple=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
const isRow=s=>/\S(?: {3,}|\t{2,})\S/.test(s);
const isList=s=>/^[•▪]\s+/.test(s);
function heading(s){
 if(/^\d+\.\d+(?:\.\d+)*\.?\s+\S/.test(s))return 3;
 if(/^(?:CAP[ÍI]TULO\s+\d+\b|PARTE\s+[IVX]+\b|\d+[.)]\s+\S)/i.test(s))return 2;
 if(/^\d+\s+[A-ZÁÉÍÓÚÂÊÔÃÕÇ][A-ZÁÉÍÓÚÂÊÔÃÕÇ ]{3,}/.test(s))return 2;
 if(/^(?:LEITURA ORIENTADA|PERCURSO DO M[ÓO]DULO|TR[ÊE]S SITUA[ÇC][ÕO]ES-PROBLEMA|CAMINHO DO INICIANTE E CAMINHO DO AVAN[ÇC]ADO|ROTEIRO DE ESTUDO|VIS[ÃA]O GERAL DO M[ÓO]DULO)$/i.test(s))return 2;
 if(s.length>6&&s.length<110&&/^[A-ZÁÉÍÓÚÂÊÔÃÕÇ0-9]/.test(s)&&s===s.toUpperCase()&&!/[.!?]$/.test(s))return 3;
 return 0;
}
const note=/^(Teste de compreens[ãa]o|Resposta comentada|Exemplo explicado|Caso explicado|Caso de compara[çc][ãa]o|Aprofundamento|Jurisprud[êe]ncia|Uso de jurisprud[êe]ncia|Aten[çc][ãa]o (?:[àa] atualiza[çc][ãa]o|[àa] desatualiza[çc][ãa]o)|Atualiza[çc][ãa]o importante|Erro comum|Pegadinha|Risco de erro|N[ãa]o confundir|Regra de bolso|Guarde o essencial|Memoriza[çc][ãa]o|Cai muito|Como estudar|Artigos para lembrar|Legitimados especiais|Exce[çc][ãa]o importante|Decreto aut[ôo]nomo|Qu[óo]runs|Aten[çc][ãa]o)\.\s*/i;
function paragraph(s){
 const found=note.exec(s);
 if(!found)return '<p>'+escape(s)+'</p>';
 const label=found[1],body=s.slice(found[0].length);
 const emphasis=/^(?:Erro comum|Pegadinha|Risco de erro|N[ãa]o confundir|Guarde o essencial|Qu[óo]runs)$/i.test(label);
 return '<p class="cf-apostila-note'+(emphasis?' cf-apostila-alert':'')+'"><strong>'+escape(label)+'.</strong> '+escape(body)+'</p>';
}
/* Catálogo de dispositivos da própria CF/88, compartilhado entre M01–M15.
 * Não injeta leis externas, não completa texto por inferência e não repete a lei no fim. */
let _cfLawSource=null,_cfLawCatalog=null;
function lawCatalog(){
 const src=g.BC_CF_GUIDED_LAW||{};
 if(_cfLawCatalog&&_cfLawSource===src)return _cfLawCatalog;
 const catalog=new Map();
 for(const module of Object.values(src)){
  if(!module||typeof module!=='object')continue;
  for(const group of Object.values(module)){
   if(!Array.isArray(group))continue;
   for(const row of group){
    if(!Array.isArray(row)||!Array.isArray(row[1]))continue;
    const label=String(row[0]||''),m=label.match(/^CF\/88,\s*art\.\s*(\d{1,4}(?:-[A-Z])?)/i);
    if(!m)continue;
    const key=m[1].toUpperCase(),lines=row[1].filter(t=>typeof t==='string'&&t.trim()&&!/^\s*(?:\[…\]|\[\.\.\.\]|…|\.\.\.)\s*$/.test(t));
    if(!lines.length)continue;
    // A versão mais extensa costuma reunir caput, parágrafos e incisos de uma mesma fonte.
    const score=lines.join('').length;
    const prev=catalog.get(key);
    if(!prev||score>prev.score)catalog.set(key,{label:'CF/88, art. '+key+(Number(key)<=9?'º':''),lines,score});
   }
  }
 }
 // Fontes atuais prevalecem sobre as transcrições antigas do catálogo didático.
 const official=g.BC_CF_OFFICIAL_EXCERPTS||{};
 for(const [key,lines] of Object.entries(official)){
  if(!Array.isArray(lines)||!lines.length)continue;
  const id=key.toUpperCase();
  catalog.set(id,{label:'CF/88, art. '+id+(Number(id)<=9?'º':''),lines:lines.filter(x=>typeof x==='string'&&x.trim()),score:Infinity});
 }
 _cfLawSource=src;_cfLawCatalog=catalog;return catalog;
}
function isOtherLaw(text,before,end){
 const prior=text.slice(Math.max(0,before-55),before);
 const after=text.slice(end,end+70);
 return /(?:\bLINDB|\bCPC|\bCPP|\bCTN|\bCLT|\bC[CP]\b|c[óo]digo (?:penal|civil|de processo|tribut[áa]rio)|\blei\s*(?:n[ºo°.]\s*)?\d[\d.\/-]*)\s*[,—–-]?\s*$/i.test(prior)||
 /^\s*(?:da|do|de|na|no)\s+(?:LINDB|CPC|CPP|CTN|CLT|CP|CC|C[óo]digo|Lei\s*(?:n[ºo°.]\s*)?\d|Estatuto)\b/i.test(after);
}
function citedConstitution(text){
 const found=[],re=/\barts?\.?\s*(\d{1,4}(?:\s*-\s*[A-Z])?)\s*[ºo°]?/gi;let m;
 while((m=re.exec(text))){
  if(isOtherLaw(text,m.index,re.lastIndex))continue;
  const article=m[1].replace(/\s+/g,'').toUpperCase();
  let after=text.slice(re.lastIndex,re.lastIndex+86).split(/\barts?\.?\s*\d/i)[0].split(/[.!?;:]/)[0];
  const para=after.match(/§\s*(\d+)\s*[ºo°]?/i)?.[1]||'';
  let tail=after.replace(/^\s*,?\s*(?:§\s*\d+\s*[ºo°]?\s*)?[,;]?\s*/,'');
  const roman=tail.match(/^(?:incisos?\s+|inc\.\s*)?([IVXLCM]{1,8}(?:\s*(?:,|e|ou)\s*[IVXLCM]{1,8})*)\b/i);
  let incs=roman?roman[1].split(/\s*(?:,|e|ou)\s*/i).filter(Boolean).map(v=>v.toUpperCase()):[];
  if(!incs.length){
   const before=text.slice(Math.max(0,m.index-40),m.index);
   const backwards=before.match(/inciso\s+([IVXLCM]{1,8})\s+(?:do|no)\s*$/i);
   if(backwards)incs=[backwards[1].toUpperCase()];
  }
  const range=after.match(/^\s*(?:a|ao|at[ée]|–|—)\s*(\d{1,4})\s*[ºo°]?/i);
  const a=Number(article),b=range?Number(range[1]):a;
  const articles=range&&Number.isInteger(a)&&Number.isInteger(b)&&b>a&&b-a<=4?Array.from({length:b-a+1},(_,i)=>String(a+i)):[article];
  for(const ref of articles)found.push({article:ref,para,incs,caput:/\bcaput\b/i.test(after)});
 }
 return found;
}
function lawExcerpt(entry,ref){
 const lines=entry.lines,number=ref.para,incisos=ref.incs;
 const label=/^§\s*(\d+)\s*[ºo°]?/i;
 let block=lines;
 if(number){
  const pos=lines.findIndex(line=>{const m=label.exec(line);return m&&m[1]===number});
  if(pos<0)return [];
  let end=pos+1;
  while(end<lines.length&&!label.test(lines[end]))end++;
  block=lines.slice(pos,end);
 }else if(incisos.length){
  const end=lines.findIndex(line=>label.test(line));
  block=end<0?lines:lines.slice(0,end);
 }
 if(incisos.length){
  const picked=incisos.map(inc=>block.find(line=>new RegExp('^'+inc+'\\s*[-–—]').test(line))).filter(Boolean);
  if(!picked.length)return [];
  return number?[block[0],...picked]:picked;
 }
 if(ref.caput)return lines[0]?[lines[0]]:[];
 if(number)return block.length<=8?block:[block[0]];
 // Um artigo longo (como o art. 5º) não deve despejar dezenas de incisos.
 return block.length<=10?block:(block[0]?[block[0]]:[]);
}
function lawInline(text,seen){
 const catalog=lawCatalog(),out=[];
 for(const ref of citedConstitution(text)){
  const key=[ref.article,ref.para,ref.incs.join(',')].join(':');
  if(seen.has(key))continue;
  const entry=catalog.get(ref.article);
  if(!entry)continue;
  const lines=lawExcerpt(entry,ref);
  if(!lines.length)continue;
  seen.add(key);
  const suffix=(ref.para?', § '+ref.para+'º':'')+(ref.incs.length?', '+ref.incs.join(', '):'')+
   (!ref.para&&!ref.incs.length&&lines.length===1&&entry.lines.length>1?' (caput)':'');
  const title=entry.label+suffix;
  out.push('<details class="cf-apostila-law cf-apostila-law-inline"'+(lines.length<=3?' open':'')+'><summary>'+escape(title)+'</summary><div class="cf-apostila-law-body">'+lines.map(line=>'<p>'+escape(line)+'</p>').join('')+'</div></details>');
 }
 return out.join('');
}
// API antiga preservada para chamadas legadas. A seção geral do final não é mais exibida.
function lawList(){return '';}
function render(raw,n){
 const lines=String(raw||'').replace(/\r/g,'').split('\n');
 let output='',buffer=[],rows=[],list=[],started=false,outline=false,seenParts=new Set(),seenLegal=new Set();
 const flushText=()=>{if(!buffer.length)return;const s=buffer.join(' ').replace(/\s+/g,' ').trim();buffer=[];if(!s)return;
  if(n>=8&&!started&&/^Esta apostila reescreve o texto original do m[óo]dulo CF M\d+/i.test(s)){started=true;return}
  started=true;output+=paragraph(s)+lawInline(s,seenLegal);
 };
 const flushList=()=>{if(!list.length)return;output+='<ul>'+list.map(s=>'<li>'+escape(s)+'</li>').join('')+'</ul>';list=[];};
 const flushRows=()=>{if(!rows.length)return;
  if(rows.length<2){output+=rows.map(row=>'<p class="cf-apostila-tableline">'+escape(row.join(' — '))+'</p>').join('');rows=[];return}
  const head=rows.shift(),width=Math.max(1,head.length);
  output+='<div class="cf-apostila-table-scroll" role="region" aria-label="Tabela comparativa" tabindex="0"><table><thead><tr>'+head.map(s=>'<th scope="col">'+escape(s)+'</th>').join('')+'</tr></thead><tbody>'+
   rows.map(row=>'<tr>'+Array.from({length:width},(_,i)=>'<td>'+escape(i===width-1?row.slice(i).join(' · '):(row[i]||''))+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>';
  rows=[];
 };
 const flush=()=>{flushText();flushRows();flushList();};
 for(const line of lines){
  const s=line.trim();
  if(!s){flush();continue;}
  // Identify tables before numbered headings, e.g. "1   Assunto   Artigo".
  if(isRow(line)){flushText();flushList();rows.push(s.split(/\s{3,}|\t{2,}/).map(x=>x.trim()));continue;}
  flushRows();
  if(isList(s)){flushText();list.push(s.replace(/^[•▪]\s+/,''));continue;}
  flushList();
  if(/^PERCURSO DO M[ÓO]DULO$/i.test(s))outline=true;
  if(outline&&/^\d+[.)]\s+[A-ZÁÀÂÃÉÊÍÓÔÕÚÇ][a-zàâãéêíóôõúç]/.test(s)){
   flushText();output+='<p class="cf-apostila-outline">'+escape(s)+'</p>';continue;
  }
  if(/^CAP[ÍI]TULO\s+\d+\b/i.test(s)||/^\d+[.)]\s+[A-ZÁÉÍÓÚÂÊÔÃÕÇ]{3}/.test(s))outline=false;
  if(/^PARTE\s+[IVX]+\b/i.test(s)){
   flushText();const key=simple(s);if(seenParts.has(key))continue;seenParts.add(key);
  }
  const level=heading(s);
  if(level){flushText();seenLegal.clear();output+='<h'+level+'>'+escape(s)+'</h'+level+'>';continue;}
  buffer.push(s);
 }
 flush();
 return '<div class="cf-apostila" data-cf-editorial-module="'+Number(n)+'">'+output+'</div>';
}
function styles(){
 if(typeof document==='undefined'||document.getElementById('cf-apostila-reading-v1-style'))return;
 const link=document.createElement('link');link.id='cf-apostila-reading-v1-style';link.rel='stylesheet';link.href='/ui/cf-apostila-reading-v1.css?v=20261118cfleiinline1';document.head.appendChild(link);
}
g.CfApostilaReading=Object.freeze({render,styles,lawList,citedConstitution,lawCatalog});
styles();
})(window);
