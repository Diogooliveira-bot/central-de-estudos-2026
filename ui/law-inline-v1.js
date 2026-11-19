/* Base Completa — lei seca ao lado da explicação (Civil e Processo Civil).
 * Funções puras, sem acesso a rede, DOM ou armazenamento do aluno:
 *  - scan(texto): acha "art. N", "arts. N e M", "arts. N a M" e lê § e incisos citados;
 *  - excerpt(linhas, ref): escolhe do artigo só o que o parágrafo cita (caput, § ou incisos).
 * Mesmo critério usado no Direito Constitucional (cf-apostila-reading-v1.js). */
(function(g){
'use strict';
if(g.BCLawInline)return;
const NUM='\\d{1,4}(?:\\.\\d{3})?(?:\\s*-\\s*[A-Z])?';
const ROMAN='[IVXLCM]{1,8}';
const id=s=>String(s).replace(/\s+/g,'').replace(/\./g,'').toUpperCase();
function spec(text,end){
 const after=text.slice(end,end+86).split(/\barts?\.?\s*\d/i)[0].split(/[.!?;:]/)[0];
 const para=(after.match(/§\s*(\d+)\s*[ºo°]?/i)||[])[1]||'';
 const tail=after.replace(/^\s*,?\s*(?:§\s*\d+\s*[ºo°]?\s*)?[,;]?\s*/,'');
 const roman=tail.match(new RegExp('^(?:(?:[Ii]ncisos?|inc\\.)\\s*)?('+ROMAN+'(?:\\s*(?:,|e|ou)\\s*'+ROMAN+')*)(?![A-Za-zÀ-ÿ])'));
 let incs=roman?roman[1].split(/\s*(?:,|e|ou)\s*/).filter(Boolean):[];
 if(!incs.length){
  const before=text.slice(Math.max(0,end-40),end);
  const back=before.match(/inciso\s+([IVXLCM]{1,8})\s+(?:do|no)\s+art[^]*$/i);
  if(back)incs=[back[1].toUpperCase()];
 }
 return {para,incs,caput:/\bcaput\b/i.test(after)};
}
/* Cada item: {article, para, incs, caput, index, end}. Intervalos longos (mais de 5 artigos) são ignorados. */
function scan(text){
 const out=[],re=new RegExp('\\b(?:arts?\\.?|artigos?)\\s*('+NUM+')\\s*[ºo°]?','gi');let m;
 while((m=re.exec(text))){
  const first=id(m[1]),s=spec(text,re.lastIndex),base={para:s.para,incs:s.incs,caput:s.caput,index:m.index};
  let end=re.lastIndex;
  const range=text.slice(end,end+30).match(new RegExp('^\\s*(?:a|ao|até|–|—)\\s*('+NUM+')\\s*[ºo°]?','i'));
  if(range){
   const a=Number(first),b=Number(id(range[1]));
   end+=range[0].length;
   if(Number.isInteger(a)&&Number.isInteger(b)&&b>a&&b-a<=4){for(let n=a;n<=b;n++)out.push({article:String(n),para:'',incs:[],caput:false,index:m.index,end});}
   re.lastIndex=end;continue;
  }
  out.push(Object.assign({article:first,end},base));
  // lista curta: "arts. 233 e 234", "arts. 233, 234 e 235"
  for(let k=0;k<4;k++){
   const more=text.slice(end,end+30).match(new RegExp('^\\s*(?:,|e|ou)\\s*('+NUM+')(?!\\d)\\s*[ºo°]?','i'));
   if(!more||/§/.test(text.slice(end,end+more[0].length)))break;
   end+=more[0].length;out.push({article:id(more[1]),para:'',incs:[],caput:false,index:m.index,end});re.lastIndex=end;
  }
 }
 return out;
}
function excerpt(lines,ref){
 const label=/^§\s*(\d+)\s*[ºo°]?/i,unique=/^Par[áa]grafo [úu]nico/i;
 const all=(lines||[]).filter(t=>typeof t==='string'&&t.trim());
 if(!all.length)return [];
 const isPara=line=>label.test(line)||unique.test(line);
 const number=ref&&ref.para,incisos=(ref&&ref.incs)||[];
 let block=all;
 if(number){
  const pos=all.findIndex(line=>{const m=label.exec(line);return m&&m[1]===number});
  if(pos<0)return all.length<=8?all:[all[0]];
  let end=pos+1;while(end<all.length&&!isPara(all[end]))end++;
  block=all.slice(pos,end);
 }else if(incisos.length){
  const end=all.findIndex((line,i)=>i>0&&isPara(line));
  block=end<0?all:all.slice(0,end);
 }
 if(incisos.length){
  const picked=incisos.map(inc=>block.find(line=>new RegExp('^'+inc+'\\s*[-–—.]').test(line))).filter(Boolean);
  if(!picked.length)return all.length<=8?all:[all[0]];
  return number?[block[0],...picked]:[all[0],...picked];
 }
 if(ref&&ref.caput)return [all[0]];
 if(number)return block.length<=8?block:[block[0]];
 // Artigo longo: mostra o começo e indica que há mais (o link oficial traz o texto inteiro).
 return block.length<=14?block:[...block.slice(0,8),'[…]'];
}
g.BCLawInline=Object.freeze({scan,excerpt,id});
})(window);
