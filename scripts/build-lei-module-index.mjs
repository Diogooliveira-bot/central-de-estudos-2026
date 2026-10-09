import fs from 'node:fs';
import vm from 'node:vm';
import {leiRuntime} from './lei-em-dia-runtime.mjs';
const root=new URL('../',import.meta.url),read=p=>fs.readFileSync(new URL(p,root),'utf8');
const runtime=read('central-structural-v66119/runtime.js');
function literal(name){const m=runtime.match(new RegExp('(?:const|let|var) '+name+'\\s*='));const start=m.index+m[0].length;return JSON.parse(runtime.slice(start,runtime.indexOf(';\n',start)));}
const subjects=literal('SUBJECTS');
const native=kind=>JSON.parse(read(`content/${kind}/${kind}-native-index.js`).split('=').slice(1).join('=').trim().replace(/;$/,''));
const c=leiRuntime(root);const data=vm.runInContext('DATA',c),topics=vm.runInContext('TOPICS_BY_DISCIPLINE',c);
const modules=[],aliases={};
function add(d,number,id,title,source,other=[]){const m={id,discipline:d,number,title:title.replace(/^\d+\s+/,''),source,questionIds:[]};modules.push(m);for(const key of [id,...other])aliases[d+'|'+key]=id;return m;}
for(const d of ['cf','cpc','trabalho','ptrabalho']){
 const central={trabalho:'trab',ptrabalho:'ptra'}[d]||d;
 for(const [i,t] of subjects.find(s=>s.id===central).topics.entries()){
  const n=i+1,id=d==='cf'||d==='cpc'?d+'-m'+String(n).padStart(2,'0'):t.uid;
  add(d,n,id,t.title,'central-structural-v66119/runtime.js#SUBJECTS',[t.uid,d==='cf'?'w'+n:d==='cpc'?'cpc'+n:t.uid]);
 }
}
for(const d of ['civil','cpp','adm']){
 const source=`content/${d}/${d}-native-index.js`,items=native(d).modules;
 for(const m of Array.isArray(items)?items:Object.values(items))add(d,m.number,m.uid,m.title,source,[m.id].filter(Boolean));
}
const pen=read('ui/penal-m01-m17-runtime-remap.js');const start=pen.indexOf('const meta=')+11,end=pen.indexOf(';\n',start);const meta=vm.runInNewContext('('+pen.slice(start,end)+')');
for(const [key,m] of Object.entries(meta))add('penal',m.num,'pen-m'+String(m.num).padStart(2,'0'),m.title,'ui/penal-m01-m17-runtime-remap.js',[key,'pen-m'+String(m.num).padStart(2,'0')+'-analista']);
const mid=(d,n)=>modules.find(m=>m.discipline===d&&m.number===n)?.id;
const arts=(q)=>{const s=String(q.number||'').replace(/[º°ª]/g,'');return [...s.matchAll(/\bArts?\.?\s*(\d+)(?:-([A-Z]))?/g)].map(m=>({n:Number(m[1]),suffix:m[2]||''}));};
const ranges=(a,rs)=>rs.filter(([lo,hi])=>a>=lo&&a<=hi).map(([, ,n])=>n);
const code=q=>q.topicId.includes('-lei-')?q.topicId.split('-lei-')[1]:null;
const baseLaw=q=>String(q.number||'').match(/\bLei\s*(?:n[ºo.]*)?\s*(\d[\d.]*)/i)?.[1]?.replace(/\./g,'');
const oldPen={1:1,2:2,3:4,4:5,5:6,6:7,7:8,8:9,9:10,10:11,11:12,12:13,13:14,14:15,15:17,16:16,18:3};
function classify(q){
 const d=q.discipline,k=code(q)||baseLaw(q),aa=arts(q),a=aa[0]?.n,letter=aa[0]?.suffix;
 if(d==='civil'){
  const old=modules.find(m=>m.discipline===d&&aliases[d+'|'+q.topicId]===m.id);if(old)return [old.number];
  return {13146:[1],8245:[8],6015:[12],8009:[14],5478:[14],11804:[14],6404:[10],13465:[12],14711:[13],9307:[8]}[k]||[];
 }
 if(d==='cf'){
  if(code(q))return {12016:[2],13300:[2],4717:[2],9507:[2],11417:[9,12],1079:[8],9868:[12],9882:[12]}[k]||[];
  if(a!==undefined)return ranges(a,[[1,4,1],[5,5,2],[6,17,3],[18,36,4],[37,43,5],[44,58,6],[59,75,7],[163,169,7],[76,91,8],[92,103,9],[104,126,10],[127,135,11],[170,192,13],[193,224,14],[225,232,15]]).concat(a===103&&letter==='B'?[10]:[]).filter(n=>!(a===103&&letter==='B'&&n===9));
  const legacy=Number(q.topicId.match(/^cf-m(\d+)/)?.[1]);return legacy>=1&&legacy<=12?[legacy]:[];
 }
 if(d==='cpc'){
  if(k==='11419')return [4,5,7,9].includes(a)?[8]:[7];
  if(k)return {9307:[2],12016:[19],4717:[19],7347:[19],13300:[19],9507:[19],9868:[19],9882:[19],9099:[18]}[k]||[];
  const n=Number(q.topicId.match(/^cpc-m(\d+)/)?.[1]);return n?[n]:[];
 }
 if(d==='penal'){
  if(k)return {13869:[14],9613:[15],9605:[17],7716:[9]}[k]||[];
  const old=Number(q.topicId.match(/^pen-m(\d+)/)?.[1]);
  if(/\bCP\b/.test(q.number)&&a!==undefined){
   if(a===337&&letter)return [16];
   return ranges(a,[[1,12,2],[13,19,3],[20,22,5],[23,25,4],[26,28,5],[29,31,6],[32,99,7],[100,120,8],[121,154,9],[155,183,10],[213,234,12],[289,311,11],[312,359,13]]);
  }
  return oldPen[old]?[oldPen[old]]:[];
 }
 if(d==='cpp'){
  if(k)return k==='12830'?[3]:[]; // Initial/general provisions of the other PDFs are complementary, not procedural coverage.
  if(a!==undefined)return ranges(a,[[1,3,1],[1,3,2],[4,23,3],[24,62,4],[63,68,4],[69,91,6],[92,154,7],[155,250,12],[251,281,5],[282,350,13],[311,350,14],[351,372,10],[381,393,11],[394,405,15],[406,497,16],[513,518,18],[519,530,17],[531,538,15],[541,555,17],[563,573,8],[574,580,19],[581,638,20],[647,667,22],[621,631,22],[791,802,9]]);
  return [];
 }
 if(d==='adm'){
  if(k==='9784')return [6,...(a===2?[1]:[]),...([11,12,13,14,15,50,53,54,55].includes(a)?[3]:[]),...([11,12,13,14,15].includes(a)?[4]:[])];
  if(k==='8112')return [5,...(a>=127&&a<=142?[4]:[])];
  if(k==='14133')return a===undefined?[]:ranges(a,[[1,11,14],[12,27,15],[28,71,16],[72,75,17],[76,90,16],[91,163,18],[164,173,16],[174,195,14]]);
  return {9784:[6],8112:[5],8429:[13],12527:[19],13709:[20],dl200:[2],8987:[9],12846:[8],13019:[11],11107:[12],11079:[10],13303:[2],13848:[2],8443:[8],d11462:[16],lindb20:[7],9637:[12],9790:[12],13460:[9],14129:[6],8745:[5],12813:[5],4717:[8],7347:[8]}[k]||[];
 }
 if(d==='trabalho'){
  if(k==='5889')return [13];
  if(k==='6019')return a>=4&&a<=5||a===18?[8]:a===12?[12]:a===13?[16]:[6];
  if(k==='8036')return a===18||a===20?[15,16]:[13];
  if(k==='7783')return [18];
  if(k==='11788')return [4];
  if(k==='9029')return a===4?[16]:[4,16];
  if(k==='4090'||k==='14611')return [13];
  if(k==='14457')return [3,5].includes(a)?[12]:[10].includes(a)?[5]:[15,17].includes(a)?[7]:[23,27].includes(a)?[14]:[];
  if(k==='lc150')return a===1?[4]:a===4?[6]:[2,3,5,10].includes(a)?[9]:[11,14,17,18].includes(a)?[11]:a===13?[12]:[];
  return [];
 }
 if(d==='ptrabalho')return k==='6830'?[8]:k==='12016'||k==='7347'?[9]:k==='5584'?a===2?[6,7]:[3,4,5,8,9].includes(a)?[6]:[10,13].includes(a)?[7]:[3]:[];
 return [];
}
const unmatched=[];
for(const q of data){const ids=[...new Set(classify(q).map(n=>mid(q.discipline,n)).filter(Boolean))];if(!ids.length){unmatched.push(q.id);continue;}for(const id of ids)modules.find(m=>m.id===id).questionIds.push(q.id);}
const complement=[];for(const d of Object.keys(topics)){const ids=data.filter(q=>q.discipline===d&&unmatched.includes(q.id)).map(q=>q.id);if(ids.length)complement.push({id:d+'-complementar',discipline:d,number:null,title:'Leis e assuntos complementares',source:'Questões preservadas sem encaixe seguro em um módulo da matriz atual',questionIds:ids});}
const questionById=new Map(data.map(q=>[q.id,q]));
const baseNames={cf:'CF/88 e fundamentos associados',civil:'Código Civil e fundamentos associados',cpc:'CPC e fundamentos associados',cpp:'CPP e fundamentos associados',penal:'Código Penal e fundamentos associados'};
for(const m of modules){const laws=new Map();for(const id of m.questionIds){const q=questionById.get(id);const name=q.topicId.includes('-lei-')?q.title.split(' — ')[0]:baseNames[q.discipline]||q.title;laws.set(name,(laws.get(name)||0)+1);}m.laws=[...laws].map(([label,questions])=>({label,questions}));}
const result={version:'20261009sync1',disciplineAliases:{trab:'trabalho',ptra:'ptrabalho',ptrab:'ptrabalho'},modules,complement,aliases};
fs.writeFileSync(new URL('tools/decorando-data-modulos.js',root),'/* Gerado por scripts/build-lei-module-index.mjs. IDs e gabaritos preservados. */\nconst CENTRAL_LAW_MODULES = '+JSON.stringify(result)+';\n');
const report={version:result.version,totalQuestions:data.length,centralModules:modules.length,disciplines:Object.keys(topics).map(d=>({id:d,totalQuestions:data.filter(q=>q.discipline===d).length,modules:modules.filter(m=>m.discipline===d).length,withoutQuestions:modules.filter(m=>m.discipline===d&&!m.questionIds.length).map(m=>m.id),complementaryQuestions:complement.find(m=>m.discipline===d)?.questionIds.length||0})),modules:modules.map(m=>({...m,questionIds:undefined,questions:m.questionIds.length})),complement:complement.map(m=>({...m,questions:m.questionIds.length})),rule:'Vínculo editorial pela matriz vigente da Central, dispositivo e tema; questões sem encaixe seguro permanecem complementares. Mais de um módulo pode estudar a mesma questão sem duplicar o registro ou o progresso.',scope:'Conferência estrutural completa do banco e do catálogo de módulos, não revisão jurídica integral da teoria ou dos gabaritos.',findings:['Civil enviava module ignorado pela rota.','Administrativo e CPP abriam banco geral sem módulo.','Penal ainda listava agrupamentos antigos de 24 módulos; matriz atual tem 17.','CPP usava 17 agrupamentos legados; matriz nativa atual tem 22.','CF tinha 12 agrupamentos legados, com ordem econômica/social/família sem módulos 13–15 próprios.','Trabalho e Processo do Trabalho usam IDs centrais trab/ptra, diferentes de trabalho/ptrabalho no banco.']};
fs.writeFileSync(new URL('audits/lei-em-dia-sincronizacao-20261009.json',root),JSON.stringify(report,null,2)+'\n');
const civIndex={};for(const m of modules.filter(m=>m.discipline==='civil')){const key=native('civil').modules.find(x=>x.uid===m.id).id;civIndex[key]=m.questionIds;}
fs.writeFileSync(new URL('civil-decorando-index-v1.js',root),'/* Gerado pelo catálogo vigente; inclui leis complementares vinculadas ao módulo. */\nwindow.CIVIL_DECORANDO_IDS_V1='+JSON.stringify(civIndex)+';\n');
console.log(JSON.stringify({questions:data.length,modules:modules.length,disciplines:report.disciplines},null,2));
