import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import zlib from 'node:zlib';
import vm from 'node:vm';
import crypto from 'node:crypto';
import {JSDOM} from 'jsdom';

const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const data=JSON.parse(zlib.gunzipSync(Buffer.concat(Array.from({length:12},(_,i)=>fs.readFileSync(new URL('../content/ptra/packed/ptra-pack-'+String(i+1).padStart(2,'0')+'.bin',import.meta.url))))));
const module=n=>data.modules.find(m=>m.number===n);
const text=(n,kind)=>module(n)[kind].pages.join('\n');
const native=(subject,n)=>{const ctx={window:{}};vm.runInNewContext(read('content/'+subject+'/m'+String(n).padStart(2,'0')+'-native-data.js'),ctx);return ctx.window.BASE_NATIVE_CONTENT[subject]['m'+String(n).padStart(2,'0')];};

test('PTRA: gabaritos interativos coincidem com os 300 gabaritos escritos identificáveis',()=>{
 let compared=0,total=0;
 for(const m of data.modules)for(const kind of ['resumido','completo']){
  const part=m[kind];total+=part.questions.length;
  const keys=new Map([...part.pages.join('\n').matchAll(/Quest[ãa]o\s+(\d+)\s*[-—–]\s*(?:alternativa\s+)?([A-E])\b/g)].map(x=>[Number(x[1]),x[2]]));
  assert.equal(keys.size,m.number===1?0:part.questions.length,'M'+m.number+' '+kind);
  for(const q of part.questions){
   assert.equal(q.options.length,5);
   if(keys.has(q.n)){assert.equal(q.answer,keys.get(q.n),'M'+m.number+' '+kind+' Q'+q.n);compared++;}
  }
 }
 assert.equal(total,315);assert.equal(compared,300);
});

test('PTRA: três respostas corrigidas correspondem ao conteúdo e às explicações',()=>{
 for(const [n,qnum,letter,rule] of [[10,1,'B',/impeditivo, modificativo ou extintivo/],[10,4,'C',/^3\./],[15,1,'B',/extraordinário de fundamentação vinculada/]]){
  const q=module(n).completo.questions[qnum-1];assert.equal(q.answer,letter);assert.match(q.options.find(o=>o.letter===q.answer).text,rule);
 }
});

test('PTRA: prazos do sumaríssimo e limites dos honorários têm atos e exceções distintos',()=>{
 for(const kind of ['resumido','completo']){
  const t=text(10,kind);
  assert.match(t,/5 dias[\s\S]*852-H, § 6º|852-H, § 6º[\s\S]*5 dias/);
  assert.match(t,/30 dias[\s\S]*852-H, § 7º|852-H, § 7º[\s\S]*30 dias/);
  assert.match(t,/R\$ 1\.500,00/);assert.match(t,/pagas pelas partes/);assert.match(t,/saúde[\s\S]*até 30%/);
  assert.doesNotMatch(t,/20 dias\s+Prazo comum|prazo comum de 20 dias/);
 }
});

test('Gratuidade: ADC 80 e sua modulação constam nas duas versões de PTRA e CPC',()=>{
 const cpc=native('cpc',4);
 for(const t of [text(4,'resumido'),text(4,'completo'),cpc.summary,cpc.complete]){
  for(const pattern of [/ADC 80/,/16\/9\/2026/,/5\.000,00/,/presunção relativa/,/Defensoria Pública/,/primeiro grau dos Juizados Especiais/])assert.match(t,pattern);
  assert.match(t,/acima|Acima/);assert.match(t,/concretamente/);
 }
 for(const kind of ['resumido','completo']){
  const t=text(4,kind);assert.match(t,/dois anos/);assert.match(t,/credor/);assert.match(t,/844, § 2º/);
 }
});

test('IN 40: distinção entre TST, STF e capítulos mistos permanece nas quatro trilhas',()=>{
 for(const n of [14,15,16])for(const kind of ['resumido','completo']){
  const t=text(n,kind);assert.match(t,/1º-A/);assert.match(t,/1º-B/);assert.match(t,/IRDR/);assert.match(t,/simultaneamente/);
  assert.equal(module(n)[kind].legalReview.scope,'targeted');
 }
 const cf=native('cf',7);for(const t of [cf.summary,cf.complete]){assert.match(t,/EC 139\/2026/);assert.match(t,/permanentes e essenciais/);assert.match(t,/extinção, criação ou instalação/);}
});

test('Pacote: módulos fora da revisão e identificadores de progresso foram preservados',()=>{
 const baseline=JSON.parse(read('audits/teorias-20261016/integridade-base.json'));
 assert.equal(data.modules.length,21);
 for(const m of data.modules){
  const old=baseline.modules.find(b=>b.number===m.number);
  assert.equal(m.uid,old.uid);
  for(const kind of ['resumido','completo']){
   assert.equal(m[kind].pdf,old[kind].pdf);
   assert.equal(m[kind].pages.length,old[kind].pageCount);
   assert.deepEqual(m[kind].questions.map(q=>q.n),old[kind].questionNumbers);
  }
  if(![4,10,14,15,16].includes(m.number))assert.equal(crypto.createHash('sha256').update(JSON.stringify(m)).digest('hex'),old.sha256,'M'+m.number+' alterado fora do escopo');
 }
});

test('Leitor: resposta corrigida é reconhecida e histórico anterior permanece intacto',()=>{
 const dom=new JSDOM('<main id="reader"></main>',{runScripts:'outside-only',url:'https://central.test/'});
 try{
  const w=dom.window;w.eval(read('ui/ptra-reader-upgrade-v1.js'));
  for(const n of [10,15]){
   const key='base-completa:ptra:v2:m'+String(n).padStart(2,'0')+':questions:completo';
   const old=JSON.stringify([{at:1,correct:4,answered:10,pct:40}]);w.localStorage.setItem(key,old);
   const mat=module(n).completo,el=w.document.getElementById('reader');
   el.innerHTML=w.PtraReaderUpgrade.render({number:n,title:module(n).title},mat,'completo');
   w.PtraReaderUpgrade.mount(el,n,'completo',mat);
   const q=el.querySelector('[data-ptra-question="0"]');
   q.querySelector('[data-letter="B"]').click();q.querySelector('[data-ptra-check]').click();
   assert.ok(q.querySelector('[data-letter="B"]').classList.contains('correct'));
   assert.equal(w.localStorage.getItem(key),old);
   assert.equal(el.querySelector('.ptra-book-source summary').textContent,'Conferir texto integral com as revisões indicadas');
  }
 }finally{dom.window.close();}
});
