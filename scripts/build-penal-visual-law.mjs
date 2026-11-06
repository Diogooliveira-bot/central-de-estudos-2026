import {readFileSync,writeFileSync} from 'node:fs';
import vm from 'node:vm';
import {JSDOM} from 'jsdom';
import {references} from './penal-law-references.mjs';
const root=new URL('../',import.meta.url),read=p=>readFileSync(new URL(p,root),'utf8');
const old=JSON.parse(read('audits/cpp-official-source-lines.json')),fresh=JSON.parse(read('audits/penal-official-source-lines.json'));
const supplements=JSON.parse(read('audits/penal-supplemental-source-lines.json'));
const sources={...old,...fresh,...supplements};
sources.cf={...old.cf,lines:{...old.cf.lines,...fresh.cf.lines}};
const names={lcp:'Lei das Contravenções Penais',l3914:'Decreto-Lei 3.914/1941',l9472:'Lei 9.472/1997',l7716:'Lei 7.716/1989',l8072:'Lei 8.072/1990',l8137:'Lei 8.137/1990',l8666:'Lei 8.666/1993 — redação histórica, revogada',cp:'Código Penal',cpp:'CPP',cf:'Constituição Federal',l13869:'Lei 13.869/2019',l9613:'Lei 9.613/1998',l9605:'Lei 9.605/1998'};
const clean=t=>t.replace(/【\d+†([^†】]+)(?:†[^】]*)?】/g,'$1').replace(/^#+\s*/,'').trim();
const all={};
for(const [law,s]of Object.entries(sources)){
 const lines=Object.entries(s.lines).map(([n,t])=>[+n,clean(t)]).sort((a,b)=>a[0]-b[0]);
 const starts=lines.flatMap(([n,t])=>{const m=/^Art\.?\s*(\d+)[º°o]?(?:\s*[-–]\s*([A-Z]))?(?:\.|\s|$)/i.exec(t);return m?[[n,m[1]+(m[2]?'-'+m[2].toUpperCase():'')]]:[]});
 all[law]={};
 for(let i=0;i<starts.length;i++){
  const[from,ref]=starts[i],to=starts[i+1]?.[0]??lines.at(-1)[0]+1;if(all[law][ref]||(law==='cf'&&from>4550))continue;
  const gaps=[];for(let n=from;n<to;n++)if(!(n in s.lines))gaps.push(n);
  let paragraphs=lines.filter(([n])=>n>=from&&n<to).map(([,t])=>t).filter(Boolean);
  const stop=paragraphs.findIndex((t,j)=>j>0&&/^(?:CAPÍTULO|TÍTULO|LIVRO|Seção|Subseção|Brasília,|Rio de Janeiro,|Este texto)/i.test(t));if(stop>=0)paragraphs=paragraphs.slice(0,stop);
  while(paragraphs.length>1&&!/[.;:!?\)\]”]$/.test(paragraphs.at(-1))&&!/^(?:§|Parágrafo|[IVXLCDM]+\s*[-–]|[a-z]\))/.test(paragraphs.at(-1)))paragraphs.pop();
  all[law][ref]={label:(names[law]||'Lei '+law.replace(/^l/,''))+' — art. '+ref,law,ref,paragraphs,officialUrl:s.url,sourceLines:[from,to-1],...(gaps.length?{gaps}:{})};
 }
}
const ranges={1:{cp:[[1,1],[12,12]],cf:[[5,5]]},2:{cp:[[1,12]],cf:[[5,5]]},3:{cp:[[13,22]]},4:{cp:[[23,25]]},5:{cp:[[20,22],[26,28]]},6:{cp:[[29,31]]},7:{cp:[[32,99]]},8:{cp:[[100,120]]},9:{cp:[[121,154]]},10:{cp:[[155,183]]},11:{cp:[[289,311]]},12:{cp:[[213,234]]},13:{cp:[[312,359]]},14:{l13869:[[1,45]],cp:[[327,327]]},15:{l9613:[[1,18]]},16:{cp:[[337,337]]},17:{cf:[[5,5],[225,225]],l9605:[[1,28]]}};
const ctx={window:{}};for(let i=1;i<=4;i++)vm.runInNewContext(read('penal-full-theory-data-0'+i+'.js'),ctx);
const modules={},articles={},report={modules:{},missing:[],unresolved:[]};
for(let n=1;n<=17;n++){
 const book=ctx.window.PENAL_FULL_THEORY['p'+n],doc=new JSDOM(book.html).window.document;
 const nodes=[...doc.querySelectorAll('h1,h2,h3,h4,h5,h6,p,li,td,th,div')].filter(x=>!x.querySelector('p,li,table,div,h1,h2,h3,h4,h5,h6'));
 const wanted=new Set();
 for(const[law,spans]of Object.entries(ranges[n]))for(const ref of Object.keys(all[law]||{}))if(spans.some(([a,b])=>parseInt(ref)>=a&&parseInt(ref)<=b))wanted.add(law+':'+ref);
 if(n===16){wanted.clear();for(const ref of Object.keys(all.cp))if(/^337-[E-P]$/.test(ref))wanted.add('cp:'+ref);}
 const explicit=new Map();
 for(const node of nodes){const text=node.textContent.replace(/\s+/g,' ').trim();
  for(const r of references(text,n)){
   wanted.add(r.key);
   if(!explicit.has(r.key))explicit.set(r.key,[]);
   if(!explicit.get(r.key).includes(text))explicit.get(r.key).push(text);
  }
 }
 modules[n]=[];
 for(const key of wanted){const[law,ref]=key.split(':'),article=all[law]?.[ref];if(!article||article.gaps){report.missing.push({module:n,key,gaps:article?.gaps,contexts:explicit.get(key)});continue;}articles[key]=article;modules[n].push({key,anchor:explicit.get(key)?.[0]||'',anchors:explicit.get(key)||[]});}
 report.modules[n]={title:book.title,articles:modules[n].map(x=>x.key)};doc.defaultView.close();
}
writeFileSync(new URL('audits/penal-visual-law-coverage.json',root),JSON.stringify(report,null,2)+'\n');
console.log('Missing',JSON.stringify(report.missing));
if(report.missing.length)throw new Error('Fontes com lacunas');
const data={verifiedAt:'2026-11-06',articles,modules};
writeFileSync(new URL('content/penal/penal-visual-law.js',root),'/* Literal statutory text from official sources. See scripts/build-penal-visual-law.mjs. */\nwindow.PENAL_VISUAL_LAW='+JSON.stringify(data)+';\n');
console.log(Object.keys(articles).length+' articles; '+Object.values(modules).reduce((n,x)=>n+x.length,0)+' module references');
