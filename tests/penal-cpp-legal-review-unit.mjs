import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import zlib from 'node:zlib';
import crypto from 'node:crypto';
import {JSDOM} from 'jsdom';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const evaljs=s=>{const context={window:{}};vm.runInNewContext(s,context);return context.window};
const full=evaljs([1,2,3,4].map(n=>read(`penal-full-theory-data-0${n}.js`)).join('\n')).PENAL_FULL_THEORY;
const penal=Object.fromEntries(Array.from({length:17},(_,i)=>{const n=i+1,key='m'+String(n).padStart(2,'0');return [n,evaljs(read(`content/penal/${key}-native-data.js`)).BASE_NATIVE_CONTENT.penal[key]]}));
const cpp=JSON.parse(zlib.gunzipSync(Buffer.from(read('content/cpp/cpp-native-content-packed.js').match(/"([A-Za-z0-9+/=]{100,})"/)[1],'base64')));
const hash=o=>crypto.createHash('sha256').update(JSON.stringify(o)).digest('hex');
const plain=html=>{const dom=new JSDOM(html);const text=dom.window.document.body.textContent;dom.window.close();return text};
const questionBlocks=html=>{
 const dom=new JSDOM(html),doc=dom.window.document;
 const questions=[...doc.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(h=>/\bQuest[ãa]o\s+R?\d+\b/i.test(h.textContent)).map(h=>{
  let body='',next=h.nextElementSibling;while(next&&!/^H[1-6]$/.test(next.tagName)){body+='\n'+next.innerHTML.replace(/<br\s*\/?\s*>/gi,'\n').replace(/<[^>]*>/g,'');next=next.nextElementSibling;}
  return {heading:h.textContent,text:body,answer:body.match(/Gabarito\s*:\s*([A-E])\b/i)?.[1],letters:[...body.matchAll(/(?:^|\s)([A-E])\)\s/g)].map(m=>m[1])};
 });dom.window.close();return questions;
};
test('Conteúdo: 17 módulos de Penal e 22 de CPP, com 585 questões estruturalmente válidas',()=>{
 assert.equal(Object.keys(penal).length,17);assert.equal(Object.keys(cpp).length,22);let total=0;
 for(const [number,d] of Object.entries(penal))for(const kind of ['summary','complete']){
  const qs=d.internalQuestions[kind];assert.equal(qs.length,kind==='summary'?5:10);
  const body=kind==='summary'?d.summary:d.completeHtml||d.complete||full['p'+number].html;
  assert.ok(body.trim().length>1000);assert.doesNotMatch(body,/[\x00-\x08\x0b\x0c\x0e-\x1f]|\bmellius\b/i);
  for(const q of qs){assert.ok(q.q.trim());assert.ok(q.options.length>=4);assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<q.options.length);assert.ok(q.explanation.trim());total++;}
 }
 for(const m of Object.values(cpp))for(const kind of ['summary','complete']){
  const body=m[kind+'Html'];assert.ok(body.trim().length>1000);assert.doesNotMatch(body,/\bmellius\b/i);
  const qs=questionBlocks(body);assert.equal(qs.length,kind==='summary'?5:10,'CPP '+m.number+' '+kind);
  for(const q of qs){const letters=[...new Set(q.letters)];assert.ok(letters.length>=4&&letters.length<=5);assert.ok(letters.includes(q.answer),'CPP '+m.number+' '+q.heading);total++;}
 }
 assert.equal(total,585);
});
test('Integridade: módulos fora das correções e todas as questões de Penal permanecem iguais à base',()=>{
 const baseline=JSON.parse(read('audits/penal-cpp-20261017/integridade-base.json'));
 for(const row of baseline.penal){const n=row.number;assert.equal(penal[n].moduleId,'p'+n);assert.equal(hash(penal[n].internalQuestions),row.questionSha256,'Questões Penal '+n);
  if(![1,2,3,4,5,6,7,8,10].includes(n))assert.equal(hash(penal[n]),row.nativeSha256,'Nativo Penal '+n);
  if(![2,7,10,17].includes(n))assert.equal(hash(full['p'+n]),row.fullSha256,'Completa Penal '+n);
 }
 for(const row of baseline.cpp){const m=cpp[row.uid];assert.equal(m.uid,row.uid);assert.equal(m.number,row.number);assert.equal(m.summaryQuestions,5);assert.equal(m.completeQuestions,10);
  if(![6,9,10,12,19].includes(row.number))assert.equal(hash(m),row.sha256,'CPP '+row.number);
 }
});
test('Penal: resumo inicial preserva páginas e conteúdo com ortografia restaurada',()=>{
 const s=penal[1].summary;
 for(const text of ['PRINCÍPIOS, INTERPRETAÇÃO','revisão','idônea','subsidiariedade','consunção','É necessário','critério é estrutural','de caráter perpétuo','checklist matemático'])assert.ok(s.includes(text),text);
 assert.equal((s.match(/Conteúdo restrito ao PEN M1/g)||[]).length,5);
 assert.match(penal[2].summary,/In melius/);assert.match(cpp['cpp-m19'].completeHtml,/REFORMATIO IN MELIUS/);
});
test('Penal: resumos separam o fim da página do cabeçalho seguinte',()=>{
 for(const [number,d] of Object.entries(penal)){
  assert.doesNotMatch(d.summary,/\.BASE COMPLETA|\.PEN M\d+/,'Penal '+number);
  assert.doesNotMatch(d.summary,/\bmatematico\b/i,'Penal '+number);
 }
});
test('Penal: modulação da confissão e novas regras de combustíveis estão no material completo',()=>{
 for(const t of [penal[7].summary,full.p7.html,full.p17.html]){assert.match(t,/16\/09\/2025/);assert.match(t,/desfavoráveis/);assert.match(t,/fatos posteriores/);}
 const t=plain(full.p10.html);for(const pattern of [/15\.517\/2026/,/§ 10/,/§ 11/,/§ 12/,/1\/3/,/2\/3/,/§ 2º-A, III/,/alínea correspondente foi vetada/,/introduzida pela Lei 15\.181\/2025/])assert.match(t,pattern);
 assert.match(penal[10].summary,/15\.517\/2026/);
});
test('CPP: foro de carreiras vitalícias, canais eletrônicos e confissão têm ressalvas expressas',()=>{
 for(const kind of ['summary','complete']){
  const foro=plain(cpp['cpp-m06'][kind+'Html']);assert.match(foro,/84\.738/);assert.match(foro,/1\.147/);assert.match(foro,/sem relação com o cargo/);assert.match(foro,/não.*automaticamente/i);
  for(const n of [9,10]){const t=plain(cpp['cpp-m'+String(n).padStart(2,'0')][kind+'Html']);assert.match(t,/DJEN/);assert.match(t,/Domicílio Judicial Eletrônico/);assert.match(t,/10 dias corridos/);assert.match(t,/citação criminal/);}
  const t=plain(cpp['cpp-m12'][kind+'Html']);assert.match(t,/2\.123\.334/);assert.match(t,/não deve integrar a fundamentação da condenação/);assert.match(t,/modulação temporal/);assert.match(t,/atenuante penal/);
 }
});
test('Leitores: aluno vê as correções e a abertura não apaga o histórico existente',async()=>{
 const dom=new JSDOM('<div id="subjects"></div>',{runScripts:'outside-only',url:'https://central.test/',pretendToBeVisual:true});
 try{const w=dom.window;w.HTMLElement.prototype.scrollIntoView=()=>{};w.CSS={escape:s=>s};w.requestAnimationFrame=()=>0;
  w.eval(read('content/penal/m07-native-data.js'));w.eval(read('penal-full-theory-data-01.js'));w.eval(read('penal-full-theory-data-02.js'));w.eval(read('ui/native-study-reader-m07.js'));
  const historyKey='central-v6:native-reader:penal:p7:history',saved='[{"correct":4,"answered":5}]';w.localStorage.setItem(historyKey,saved);
  w.BaseNativeReaderM07.open('complete');assert.match(w.document.querySelector('.bc-native-article').textContent,/16\/09\/2025/);w.BaseNativeReaderM07.close();assert.equal(w.localStorage.getItem(historyKey),saved);
  w.eval(read('content/cpp/cpp-native-index.js'));w.eval(read('ui/cpp-native-study-v1.js'));
  const key='central-v6:cpp-native:m09:summary:read';w.localStorage.setItem(key,'52');w.CppNative.openImage(9);
  const notes=w.document.querySelector('.cpp-native-image-notes');assert.equal(notes.querySelectorAll('li').length,2);assert.match(notes.textContent,/Defensoria Pública/);assert.match(notes.textContent,/DJEN/);assert.ok(w.document.querySelector('#cpp-native-image-host').classList.contains('has-corrections'));assert.ok(notes.compareDocumentPosition(w.document.querySelector('.cpp-native-infographic-svg')) & w.Node.DOCUMENT_POSITION_FOLLOWING);
  w.CppNative.openImage(10);assert.equal(w.document.querySelector('.cpp-native-image-notes'),null);assert.equal(w.localStorage.getItem(key),'52');
 }finally{dom.window.close();}
});
test('Cache: bootstrap, scripts de conteúdo e pacote offline apontam para a mesma revisão',()=>{
 const boot=read('central-v119.html'),index=read('index.html'),manifest=JSON.parse(read('central-offline-files-v66172.json'));
 for(const name of ['penal-full-theory-data-01.js','penal-full-theory-data-02.js']){const url=name+'?v=20261018penalcpp2';assert.ok(index.includes(url));assert.ok(manifest.files.includes('/'+url));}
 for(const path of ['content/penal/m01-native-data.js','content/penal/m02-native-data.js','content/penal/m03-native-data.js','content/penal/m04-native-data.js','content/penal/m05-native-data.js','content/penal/m06-native-data.js','content/penal/m07-native-data.js','content/penal/m08-native-data.js','content/penal/m10-native-data.js','content/cpp/cpp-native-index.js','ui/cpp-native-study-v1.js','ui/cpp-native-study-v1.css']){const url=path+'?v=20261018penalcpp2';assert.ok(boot.includes(url),path);assert.ok(manifest.files.includes('/'+url),path);}
 const packed='/content/cpp/cpp-native-content-packed.js?v=20261018penalcpp2';assert.ok(read('ui/cpp-native-study-v1.js').includes(packed));assert.ok(manifest.files.includes(packed));
 assert.ok(boot.includes("var BUILD='"+manifest.build+"'"));assert.ok(read('sw.js').includes("var CACHE='central-"+manifest.build+"'"));
});
