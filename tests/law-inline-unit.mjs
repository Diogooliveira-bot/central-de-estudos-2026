import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import zlib from 'node:zlib';
import {JSDOM} from 'jsdom';
import {loadModules} from '../scripts/audit-civil-law-references.mjs';

const read=p=>fs.readFileSync(p,'utf8');
const plain=x=>JSON.parse(JSON.stringify(x));
function win(){
 const dom=new JSDOM('<!doctype html><body></body>',{runScripts:'outside-only'});
 dom.window.eval(read('ui/law-inline-v1.js'));
 return dom;
}

test('law-inline: reconhece artigo, parágrafo, incisos, lista e intervalo curto',()=>{
 const {window:w}=win(),lib=w.BCLawInline;
 const one=plain(lib.scan('Conforme o art. 50, § 1º, do Código Civil, o desvio de finalidade exige prova.'));
 assert.equal(one.length,1);assert.equal(one[0].article,'50');assert.equal(one[0].para,'1');
 const inc=plain(lib.scan('O art. 489, § 1º, IV, impõe enfrentar os argumentos.'));
 assert.equal(inc[0].article,'489');assert.equal(inc[0].para,'1');assert.deepEqual(inc[0].incs,['IV']);
 const dotted=plain(lib.scan('Veja o art. 1.228 e o art. 1.035-A.').map(x=>x.article));
 assert.deepEqual(dotted,['1228','1035-A']);
 assert.deepEqual(plain(lib.scan('Os arts. 233 e 234 tratam da obrigação.').map(x=>x.article)),['233','234']);
 assert.deepEqual(plain(lib.scan('Os arts. 85 a 87 definem os bens.').map(x=>x.article)),['85','86','87']);
 // intervalo longo não vira dezenas de caixas
 assert.deepEqual(plain(lib.scan('Faixa normativa: arts. 40 a 78').map(x=>x.article)),[]);
 // palavra comum não vira inciso
 assert.deepEqual(plain(lib.scan('O art. 50 Civil dispõe')[0].incs),[]);
});

test('law-inline: escolhe do artigo só o que o parágrafo cita',()=>{
 const {window:w}=win(),lib=w.BCLawInline;
 const lines=['Art. 10. Caput do artigo:','I - primeiro;','II - segundo;','III - terceiro;','§ 1º Primeiro parágrafo.','I - inciso do parágrafo;','§ 2º Segundo parágrafo.','Parágrafo único. Não existe aqui.'];
 assert.deepEqual(plain(lib.excerpt(lines,{para:'2',incs:[],caput:false})),['§ 2º Segundo parágrafo.']);
 assert.deepEqual(plain(lib.excerpt(lines,{para:'',incs:['II','III'],caput:false})),[lines[0],lines[2],lines[3]]);
 assert.deepEqual(plain(lib.excerpt(lines,{para:'',incs:[],caput:true})),[lines[0]]);
 assert.deepEqual(plain(lib.excerpt(lines,{para:'',incs:[],caput:false})),lines);
 const long=['Art. 1. Muito longo:',...Array.from({length:20},(_,i)=>`${i+1} - item ${i+1};`)];
 const cut=lib.excerpt(long,{para:'',incs:[],caput:false});
 assert.equal(cut.length,9);assert.equal(cut.at(-1),'[…]');assert.equal(cut[0],long[0]);
});

test('Civil: lei seca contextual nos 15 módulos mantém o texto literal e não perde artigo',()=>{
 const modules=loadModules();let inline=0;
 for(const [n,m] of Object.entries(modules)){
  const dom=new JSDOM(m.html,{runScripts:'outside-only'}),w=dom.window,d=w.document;
  w.eval(read('content/civil/civil-teoria-guiada-lei-seca.js'));w.eval(read('ui/law-inline-v1.js'));w.eval(read('ui/civil-law-disclosure-v1.js'));
  const before=new Map([...d.querySelectorAll('.law-article[data-law-key]')].map(x=>[x.getAttribute('data-law-key'),[...x.querySelectorAll(':scope > p')].map(p=>p.textContent)]));
  // o texto literal pode vir do bloco agrupado ou do catálogo guiado (o mais completo prevalece)
  for(const mod of Object.values(w.BC_CIV_GUIDED_LAW||{}))for(const grp of Object.values(mod))for(const row of grp){
   const mm=/^CC,\s*art\.\s*(\d[\d.]*(?:-[A-Z])?)/i.exec(String(row[0]));if(!mm)continue;
   const k='cc:'+mm[1].replace(/\./g,'');before.set(k,[...(before.get(k)||[]),...row[1]]);
  }
  const keysBefore=new Set([...d.querySelectorAll('.law-article[data-law-key]')].map(x=>x.getAttribute('data-law-key')));
  w.CivilLawDisclosure.enhance(d.body);
  const boxes=[...d.querySelectorAll('details.law-inline')];inline+=boxes.length;
  // cada caixa de lei seca contextual vem logo depois do trecho que cita o artigo
  for(const box of boxes){
   assert.equal(box.firstElementChild.tagName,'SUMMARY');assert.match(box.firstElementChild.textContent,/^Lei seca — /);
   const prev=box.previousElementSibling;assert.ok(prev,'M'+n+': caixa sem trecho anterior');
   for(const art of box.querySelectorAll('.law-article[data-law-key]')){
    const key=art.getAttribute('data-law-key'),id=key.split(':')[1];
    const lines=[...art.querySelectorAll(':scope > p')].map(p=>p.textContent).filter(t=>t!=='[…]');
    assert.ok(lines.length>0);
    const source=before.get(key);
    if(source)for(const line of lines)assert.ok(source.includes(line),`M${n} ${key}: linha fora do texto da lei`);
   }
  }
  // nada some: todo artigo de antes está numa caixa contextual ou no bloco agrupado
  const keysAfter=new Set([...d.querySelectorAll('.law-article[data-law-key]')].map(x=>x.getAttribute('data-law-key')));
  for(const k of keysBefore)assert.ok(keysAfter.has(k),`M${n}: ${k} sumiu`);
  assert.equal(d.querySelectorAll('details.law details.law').length,0);
  const count=d.querySelectorAll('details.law-inline').length;
  w.CivilLawDisclosure.enhance(d.body);assert.equal(d.querySelectorAll('details.law-inline').length,count,'idempotente');
  dom.window.close();
 }
 assert.ok(inline>150,'esperado ao menos 150 caixas contextuais, achei '+inline);
});

test('CPC: caixa de lei seca logo abaixo do parágrafo que cita e grupo só com o que sobra',()=>{
 const dom=new JSDOM('<!doctype html><body></body>',{runScripts:'outside-only'}),w=dom.window;
 w.eval(read('ui/law-inline-v1.js'));w.eval(read('ui/cpc-apostila-reading-v1.js'));
 const registry={
  'cpc:489':{label:'CPC · Art. 489',url:'https://www2.camara.leg.br/x',paragraphs:['Art. 489. São elementos essenciais da sentença:','I - o relatório;','II - os fundamentos;','III - o dispositivo.','§ 1º Não se considera fundamentada a decisão que:','I - se limitar à indicação;','IV - não enfrentar todos os argumentos.']},
  'cpc:490':{label:'CPC · Art. 490',url:'https://www2.camara.leg.br/y',paragraphs:['Art. 490. O juiz resolverá o mérito acolhendo ou rejeitando os pedidos.']}
 };
 const build=mode=>{const a=w.document.createElement('article');a.innerHTML='<h2>1. Sentença</h2><p>Segundo o art. 489, § 1º, IV, do CPC, a decisão deve enfrentar os argumentos.</p><p>Outro parágrafo sem citação.</p><p>O juiz decide o mérito conforme o art. 490 do CPC e novamente cita o art. 489.</p>';w.CpcApostilaReading.enhance(a,1,mode,registry);return a;};
 const complete=build('complete');
 const first=complete.querySelector(':scope > p').nextElementSibling;
 assert.ok(first.matches('details.cpc-law-inline'),'caixa logo após o parágrafo');
 assert.match(first.querySelector('summary').textContent,/^Lei seca — CPC, art\. 489, § 1º, IV$/);
 const lines=[...first.querySelectorAll('.cpc-law-article p')].map(p=>p.textContent);
 assert.deepEqual(plain(lines),['§ 1º Não se considera fundamentada a decisão que:','IV - não enfrentar todos os argumentos.']);
 const all=[...complete.querySelectorAll('details.cpc-law-inline')];
 assert.equal(all.length,2,'segunda citação do art. 489 na mesma seção não repete');
 const keysShown=all.flatMap(x=>x.dataset.lawInline.split(' '));
 assert.deepEqual(plain(keysShown.sort()),['cpc:489','cpc:490']);
 // nada fica no grupo agrupado quando tudo já foi mostrado ao lado do texto
 assert.equal(complete.querySelectorAll('details.cpc-law:not(.cpc-law-inline)').length,0);
 // revisão (resumo) não muda
 const summary=build('summary');
 assert.equal(summary.querySelectorAll('details.cpc-law-inline').length,0);
 dom.window.close();
});
