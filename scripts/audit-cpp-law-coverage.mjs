import {readFileSync,writeFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import vm from 'node:vm';
import {JSDOM} from 'jsdom';
const root=new URL('../',import.meta.url),read=p=>readFileSync(new URL(p,root),'utf8');
const ctx={window:{}};vm.runInNewContext(read('content/cpp/cpp-native-content-packed.js'),ctx);
const modules=JSON.parse(gunzipSync(Buffer.from(ctx.window.CPP_NATIVE_PACKED_B64,'base64')));
vm.runInNewContext(read('content/cpp/cpp-visual-law.js'),ctx);
const old=ctx.window.CPP_VISUAL_LAW;
const lawOf=(text,fallback='cpp')=>{
 const named=[...text.matchAll(/\b(CPPM|CPM|CPP|CPC|CF|CP|CC|CADH|ECA)\b|Constitui[çc][aã]o(?: Federal)?|C[oó]digo Penal|C[oó]digo Civil|Lei\s*(?:n[º°.o]?\s*)?([\d.]+)(?:\s*\/\s*\d+)?/gi)];
 if(!named.length)return fallback;
 const m=named[0];if(m[2]){const id='l'+m[2].replace(/\./g,'');return ['l15358','l15397','l13964','l15438','l11689','l11719','l15295','l15487','l15272','l15280','l9268','l14836'].includes(id)?fallback:id;}
 if(/Constitui/i.test(m[0]))return 'cf';if(/Código Penal/i.test(m[0]))return 'cp';if(/Código Civil/i.test(m[0]))return 'cc';
 return m[1].toLowerCase();
};
 const report={modules:{},excluded:[]};
for(const d of Object.values(modules)){
 const dom=new JSDOM(d.completeHtml),doc=dom.window.document,refs=[],seen=new Set();
 let context=d.number===21?'l9099':'cpp',section='';
 for(const el of doc.querySelectorAll('h1,h2,h3,h4,h5,h6,p,li,td')){
  const text=el.textContent.replace(/\s+/g,' ').trim();
  if(/^H/.test(el.tagName)&&/quest[aã]o\s+\d+|questões internas.*fixação/i.test(text))break;
  if(el.querySelector('p,li,table'))continue;
  if(/^H/.test(el.tagName)){
   section=text;if(/^\d+[. ]/.test(text))context=d.number===21?'l9099':'cpp';
   if(/^[^\p{L}\p{N}]*(?:LEI\s+(?:n[º°.o]?\s*)?[\d.]|CF\b|CPP\b|CP\b|CONSTITUIÇÃO|CÓDIGO PENAL)/iu.test(text))context=lawOf(text,context);
  }
  const matches=[...text.matchAll(/\b(?:arts?\.?|artigos?)\s+(\d+[º°]?(?:\s*[-–]\s*[A-Z]\b)?(?:(?:\s*(?:,|e|a|ao|até|[-–])\s*)\d+[º°]?(?:\s*[-–]\s*[A-Z]\b)?)*)/gi)];
  for(let i=0;i<matches.length;i++){
   const m=matches[i],from=i?matches[i-1].index+matches[i-1][0].length:0,to=matches[i+1]?.index??text.length;
   const nearby=text.slice(Math.max(from,m.index-65),Math.min(to,m.index+m[0].length+100));
   const explicitAfter=/^\s*(?:,\s*(?:§\s*\d+[º°]?|parágrafo único|[IVXLCDM]+)\s*)*(?:d[ao]\s+)(CF\b|CPPM\b|CPM\b|CPP\b|CPC\b|CP\b|Constituição Federal|Código Penal|Lei\s*(?:n[º°.o]?\s*)?[\d.]+(?:\s*\/\s*\d+)?)/i.exec(text.slice(m.index+m[0].length));
   const explicitBefore=/\b(CF|CPP|CPC|CP|CPM|CPPM|CADH|ECA|Constituição Federal|Código Penal|Lei\s*(?:n[º°.o]?\s*)?[\d.]+\s*\/\s*\d+)\s*[,;:—–-]?\s*$/i.exec(text.slice(from,m.index));
   let law=lawOf(explicitAfter?.[1]||explicitBefore?.[1]||'',d.number===21?'l9099':'cpp');
   const nums=[...m[1].matchAll(/(\d+)[º°]?(?:\s*[-–]\s*([A-Z])\b)?/g)];
   const thousands=/^\.(\d{3})/.exec(text.slice(m.index+m[0].length));if(thousands&&nums.length===1)nums[0][1]+=thousands[1];
   const refsInMatch=[];
   for(let j=0;j<nums.length;j++){
    const num=nums[j],ref=num[1]+(num[2]?'-'+num[2].toUpperCase():'');
    if(j&&/\b(?:a|ao|até)\b|^[\s–-]+$/i.test(m[1].slice(nums[j-1].index+nums[j-1][0].length,num.index))&&+num[1]>=+nums[j-1][1]&&+num[1]-nums[j-1][1]<=100){
     if(!nums[j-1][2])for(let n=+nums[j-1][1]+1;n<=+num[1];n++)refsInMatch.push(String(n));
     if(num[2])for(let c=nums[j-1][2]&&num[1]===nums[j-1][1]?nums[j-1][2].charCodeAt(0)+1:65;c<=num[2].charCodeAt(0);c++)refsInMatch.push(num[1]+'-'+String.fromCharCode(c));
    }
    else refsInMatch.push(ref);
   }
   for(const ref of refsInMatch){
    let resolved=law;
    const tail=text.slice(m.index+m[0].length,to),suffix=/^(.{0,80}?)\b(?:do|da)\s+(CPPM\b|CPM\b|CPP\b|CPC\b|CP\b|CF\b|ECA\b|Constituição\b|Código Penal\b|Código Civil\b|Lei\s*[\d.]+(?:\/\d+)?)/i.exec(tail);
    if(suffix&&!/[a-záéíóúãõç]{3}/i.test(suffix[1].replace(/parágrafo único|incisos?|caput/gi,'')))resolved=lawOf(suffix[2],law);
    if(d.number===2&&['86','89','122'].includes(ref)&&/Constituição/.test(text)){report.excluded.push({module:d.number,ref,context:text,reason:'Remissão histórica à Constituição de 1937 dentro da redação do art. 1º do CPP, preservada nesse artigo; não corresponde à CF/1988.'});continue;}
    // Editorial disambiguation for references whose diploma is separated by prose.
    if(law==='cpp'&&ref==='5'&&/Constituição|\bCF\b|constitucional/i.test(text)&&!/(?:CPP|inquérito|§\s*3)/i.test(text))resolved='cf';
    if(d.number===2&&ref==='171')resolved='cp';
    if(d.number===1&&ref==='93'&&/CF/.test(text))resolved='cf';
    if(d.number===1&&ref==='8')resolved='cadh';
    if(d.number===3&&['148','149','149-A','158','159'].includes(ref)&&/13-A.*arts\./.test(text))resolved='cp';
    if(d.number===3&&ref==='239')resolved='eca';
    if(d.number===3&&ref==='2'&&/12\.830/.test(text))resolved='l12830';
    if(d.number===4&&ref==='16-A')resolved='l11340';
    if(d.number===4&&['929','930'].includes(ref))resolved='cc';
    if(d.number===6&&['5','93','98','102','105','108','109','121','144'].includes(ref)&&/constitucional|LEI SECA ESSENCIAL/.test(section))resolved='cf';
    if(d.number===6&&ref==='2'&&/marco legal/.test(text))resolved='l15358';
    if([6,16].includes(d.number)&&ref==='121-A')resolved='cp';
    if(d.number===7&&ref==='91-A')resolved='cp';
    if(d.number===7&&ref==='26'&&/Código Penal/.test(text))resolved='cp';
    if(d.number===7&&ref==='91'&&/CP\b/.test(text))resolved='cp';
    if((d.number===5&&ref==='69')||(d.number===6&&ref==='51')||(d.number===19&&resolved==='cp'&&ref==='25')){report.excluded.push({module:d.number,ref,context:text,reason:'Numeração histórica anterior à reforma penal de 1984; remissão conservada no artigo do CPP, sem substituir pelo artigo atual de igual número.'});continue;}
    if(d.number===6&&ref==='124'&&/Justiça Militar/.test(text))resolved='cf';
    if(d.number===8&&ref==='7')resolved='l8906';
    if(d.number===9&&['44','89','128'].includes(ref))resolved='lc80';
    if(d.number===9&&ref==='5'&&/10 dias/.test(text))resolved='l11419';
    if(d.number===9&&ref==='218')resolved='cpc';
    if(d.number===10&&['252','253','254'].includes(ref))resolved='cpc';
    if(d.number===10&&ref==='44')resolved='lc80';
    if(d.number===10&&ref==='7')resolved='l11419';
    if(d.number===14&&ref==='93')resolved='cf';
    if(d.number===14&&ref==='23')resolved='cp';
    if([14,16].includes(d.number)&&ref==='2')resolved='l15358';
    if(d.number===17&&['139','140','145'].includes(ref))resolved='cp';
    if(d.number===18&&+ref>=312&&+ref<=326)resolved='cp';
    if(d.number===19&&ref==='93')resolved='cf';
    if(d.number===20&&['179','197'].includes(ref))resolved='lep';
    if(d.number===10&&ref==='6'&&/11\.419/.test(text))resolved='l11419';
    if(d.number===12&&ref==='9-A')resolved='lep';
    if(d.number===14&&['240','241-D','244-A'].includes(ref)&&/ECA/.test(text))resolved='eca';
    if(d.number===9&&['4','5'].includes(ref)&&/Diário da Justiça|Portal próprio/.test(section))resolved='l11419';
    if(d.number===10&&['227','228','229'].includes(ref)&&law==='cpc')resolved='cpc1973';
    if(d.number===16&&ref==='2'&&/15\.358/.test(text))resolved='l15358';
    if(d.number===16&&ref==='2'&&/mesma lei/.test(text))resolved='l15358';
    if(d.number===21){if(ref==='98')resolved='cf';if(ref==='94')resolved='l10741';if(ref==='41')resolved='l11340';if(ref==='14')resolved='cp';if(ref==='798'||ref==='798-A')resolved='cpp';if(ref==='77'&&/do CP/.test(text))resolved='cp';}
    if(d.number===22&&['5','6','7','12','14','23'].includes(ref)&&/MANDADO DE SEGURANÇA|mandado de segurança|Autoridade coatora/i.test(section))resolved='l12016';
    if(d.number===19&&ref==='312-A')resolved='ctb';
    if(d.number===19&&ref==='8'&&/Convenção Americana/.test(text))resolved='cadh';
    if(d.number===22&&ref==='41-A')resolved='l8038';
    if(d.number===22&&['142','109','105','102'].includes(ref))resolved='cf';
    if(d.number===22&&['5','6','7','23'].includes(ref))resolved=/^CF,/.test(text)?'cf':'l12016';
    const key=resolved+':'+ref;if(seen.has(key))continue;seen.add(key);refs.push({law:resolved,ref,section,context:text.slice(0,500)});
   }
  }
 }
 const supplements={6:{cf:['5','93','98','102','105','108','109','121','144']},9:{l11419:['4','5']},10:{cpc:['1046']},12:{eca:['239','240','241','241-A','241-B','241-C','241-D','244-A']},16:{l15358:['2']},19:{cf:['5','93']},21:{cf:['98'],cp:['14','77']},22:{cf:['102','105'],l12016:['5','6','7','12','14','23']}};
 for(const [law,ids] of Object.entries(supplements[d.number]||{}))for(const ref of ids)if(!refs.some(x=>x.law===law&&x.ref===ref))refs.push({law,ref,section:'Leitura complementar',context:''});
 report.modules[d.number]={title:d.title,references:refs};dom.window.close();
}
writeFileSync(new URL('audits/cpp-law-coverage.json',root),JSON.stringify(report,null,2)+'\n');
const counts={};for(const module of Object.values(report.modules))for(const r of module.references)counts[r.law]=(counts[r.law]||0)+1;
console.log(JSON.stringify(counts));
console.log('Referências por módulo:',Object.entries(report.modules).map(([n,m])=>n+':'+m.references.length).join(' '));
