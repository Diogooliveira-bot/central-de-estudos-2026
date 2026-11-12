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
function lawList(n){
 const groups=g.BC_CF_GUIDED_LAW?.[String(n)]||g.BC_CF_GUIDED_LAW?.[n]||{};
 const unique=new Map();
 for(const values of Object.values(groups)){
  if(!Array.isArray(values))continue;
  for(const record of values){
   if(!Array.isArray(record)||!Array.isArray(record[1]))continue;
   const title=String(record[0]||'').trim(),lines=record[1].map(x=>String(x||'').trim()).filter(Boolean);
   if(!title||!lines.length)continue;
   const key=simple(title);
   if(!unique.has(key)||lines.join('').length>unique.get(key).lines.join('').length)unique.set(key,{title,lines});
  }
 }
 if(!unique.size)return '';
 return '<section class="cf-apostila-laws" aria-label="Lei seca do módulo"><h2>Lei seca do módulo</h2><p>Abra apenas os dispositivos que desejar consultar durante a leitura.</p>'+
 [...unique.values()].map(item=>'<details class="cf-apostila-law"><summary>'+escape(item.title)+'</summary><div class="cf-apostila-law-body">'+item.lines.map(line=>'<p>'+escape(line)+'</p>').join('')+'</div></details>').join('')+
 '</section>';
}
function render(raw,n){
 const lines=String(raw||'').replace(/\r/g,'').split('\n');
 let output='',buffer=[],rows=[],list=[],started=false,outline=false,seenParts=new Set();
 const flushText=()=>{if(!buffer.length)return;const s=buffer.join(' ').replace(/\s+/g,' ').trim();buffer=[];if(!s)return;
  if(n>=8&&!started&&/^Esta apostila reescreve o texto original do m[óo]dulo CF M\d+/i.test(s)){started=true;return}
  started=true;output+=paragraph(s);
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
  if(level){flushText();output+='<h'+level+'>'+escape(s)+'</h'+level+'>';continue;}
  buffer.push(s);
 }
 flush();
 return '<div class="cf-apostila" data-cf-editorial-module="'+Number(n)+'">'+output+lawList(n)+'</div>';
}
function styles(){
 if(typeof document==='undefined'||document.getElementById('cf-apostila-reading-v1-style'))return;
 const link=document.createElement('link');link.id='cf-apostila-reading-v1-style';link.rel='stylesheet';link.href='/ui/cf-apostila-reading-v1.css?v=20261109cf15a';document.head.appendChild(link);
}
g.CfApostilaReading=Object.freeze({render,styles,lawList});
styles();
})(window);
