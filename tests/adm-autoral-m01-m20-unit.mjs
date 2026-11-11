import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {JSDOM} from 'jsdom';

const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const pad=n=>String(n).padStart(2,'0');
const questions=/<h2\b[^>]*>\s*5\s+Questões Internas[^<]*<\/h2>/i;

function create(){
 const dom=new JSDOM('<!doctype html><html><head></head><body></body></html>',{url:'https://central.test/',runScripts:'outside-only'});
 const w=dom.window;
 w.Response=Response;w.Blob=Blob;w.DecompressionStream=DecompressionStream;
 w.eval(read('ui/adm-apostila-reading-v1.js'));
 return {dom,w};
}

test('ADM M01–M20: 20 apostilas autorais, 43 tabelas e questões preservadas integralmente',async()=>{
 const {dom,w}=create();
 let tables=0,words=0;
 for(let n=1;n<=20;n++){
  const code='m'+pad(n);
  w.eval(read('content/adm/'+code+'-apostila-summary.js'));
  w.eval(read('content/adm/autor-20261110/adm-'+code+'-submitted-review.js'));
  assert.ok(w.ADM_SUBMITTED_REVIEW[n],'M'+n+' material autoral carregado');
  const html=await w.AdmApostilaReading.load(n,'summary');
  const original=gunzipSync(Buffer.from(w.ADM_APOSTILA_PACKED[n+':summary'],'base64')).toString('utf8');
  const posO=original.search(questions),posN=html.search(questions);
  assert.ok(posO>=0&&posN>=0,'M'+n+' bloco de questões intacto');
  assert.equal(html.slice(posN),original.slice(posO),'M'+n+' perguntas e gabarito inalterados');
  const d=new JSDOM('<main>'+html+'</main>').window.document;
  const material=d.querySelector('section.adm-author-reading');
  assert.ok(material,'M'+n+' revisão autoral');
  assert.ok(material.querySelectorAll('h2').length>=8,'M'+n+' capítulos');
  assert.ok(material.querySelectorAll('h3').length>=12,'M'+n+' seções');
  assert.ok(material.querySelectorAll('p').length>=30,'M'+n+' explicações');
  assert.equal(material.querySelectorAll('script,iframe,form').length,0,'M'+n+' sem conteúdo executável');
  const count=material.textContent.split(/\s+/).filter(Boolean).length;
  assert.ok(count>=1700,'M'+n+' não pode ser uma lista de resumos curtos: '+count);
  words+=count;
  tables+=material.querySelectorAll('table.adm-author-table').length;
  assert.ok(material.querySelector('table.adm-author-table'),'M'+n+' mantém pelo menos uma tabela');
 }
 assert.equal(tables,43,'preservar as 43 tabelas');
 assert.ok(words>60000,'material completo de estudo, não apenas tópicos: '+words);
 dom.window.close();
});

test('ADM: teoria completa original permanece bit a bit idêntica e não carrega arquivos de revisão',async()=>{
 const {dom,w}=create();
 for(let n=1;n<=20;n++){
  w.eval(read('content/adm/m'+pad(n)+'-apostila-complete.js'));
  const original=gunzipSync(Buffer.from(w.ADM_APOSTILA_PACKED[n+':complete'],'base64')).toString('utf8');
  const html=await w.AdmApostilaReading.load(n,'complete');
  assert.equal(html,original,'M'+n+' teoria completa não alterada');
 }
 assert.equal(w.ADM_SUBMITTED_REVIEW,undefined,'modo completo não utiliza material autoral');
 dom.window.close();
});

test('ADM: leitor mantém isolamento e parâmetros de cache para revisão autoral',()=>{
 const js=read('ui/adm-apostila-reading-v1.js'),loader=read('ui/adm-native-layer.js');
 assert.match(js,/if\(mode==='complete'\)return originalHtml/);
 assert.match(js,/adm-m'\+String\(number\)\.padStart\(2,'0'\)\+'-submitted-review\.js/);
 assert.ok(loader.includes('/ui/adm-apostila-reading-v1.js?v=20261110admautor1'));
 assert.doesNotMatch(js,/localStorage|sessionStorage|\.setItem\(|fetch\(['"]\/api/);
});
