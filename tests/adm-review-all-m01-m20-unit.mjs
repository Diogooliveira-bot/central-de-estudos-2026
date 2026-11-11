import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {JSDOM} from 'jsdom';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const num=n=>String(n).padStart(2,'0');
test('Leitor ADM M01–M20 mantém o texto das questões e a teoria completa',async()=>{
 const dom=new JSDOM('<!doctype html><html><head></head><body></body></html>',{url:'https://example.org/',runScripts:'outside-only'});
 const g=dom.window;
 g.Response=globalThis.Response;g.Blob=globalThis.Blob;g.DecompressionStream=globalThis.DecompressionStream;
 for(let n=1;n<=20;n++)g.eval(read('content/adm/autor-20261110/adm-m'+num(n)+'-submitted-review.js'));
 assert.deepEqual(Object.keys(g.ADM_SUBMITTED_REVIEW).map(Number),Array.from({length:20},(_,i)=>i+1));
 for(let n=1;n<=20;n++)g.eval(read('content/adm/m'+num(n)+'-apostila-summary.js'));
 g.eval(read('content/adm/m01-apostila-complete.js'));
 g.eval(read('ui/adm-apostila-reading-v1.js'));
 const marker=/<h2\b[^>]*>\s*5\s+Questões Internas[^<]*<\/h2>/i;
 for(let n=1;n<=20;n++){
  const original=gunzipSync(Buffer.from(g.ADM_APOSTILA_PACKED[n+':summary'],'base64')).toString('utf8');
  const start=original.search(marker);assert.ok(start>=0,'M'+n+': questões não encontradas no original');
  const html=await g.AdmApostilaReading.load(n,'summary');
  const pivot=html.search(marker);assert.ok(pivot>=0,'M'+n+': questões não encontradas no novo resumo');
  assert.equal(html.slice(pivot),original.slice(start),'M'+n+': questões devem ser idênticas');
  const doc=new JSDOM('<main>'+html+'</main>').window.document;
  assert.ok(doc.querySelectorAll('main h2').length>=5,'M'+n+': faltam tópicos');
  assert.ok(doc.querySelectorAll('main p').length>=10,'M'+n+': faltam explicações');
  assert.ok(doc.querySelectorAll('.adm-author-reading table').length>=1,'M'+n+': tabelas autorais ausentes');
  assert.ok(html.includes('adm-author-reading'),'M'+n+': não carregou revisão autoral');
 }
 const complete=gunzipSync(Buffer.from(g.ADM_APOSTILA_PACKED['1:complete'],'base64')).toString('utf8');
 assert.equal(await g.AdmApostilaReading.load(1,'complete'),complete);
 assert.doesNotMatch(await g.AdmApostilaReading.load(1,'summary'),/data-law-key="cf:54"/);
 dom.window.close();
});
test('Somente ADM M01–M20 tem novo leitor; sem tocar armazenamento ou APIs',()=>{
 const src=read('ui/adm-apostila-reading-v1.js');
 assert.ok(src.includes('/content/adm/autor-20261110/'));
 assert.match(src,/if\(mode==='complete'\)return originalHtml/);
 assert.doesNotMatch(src,/localStorage|sessionStorage|\.setItem\(|fetch\(['"]\/api|git push|create_deployment/);
});
