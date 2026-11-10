import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { JSDOM } from 'jsdom';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const num = n => String(n).padStart(2,'0');

test('Revisões didáticas ADM M01–M10 são completas, acessíveis e têm fonte legal', () => {
  const dom=new JSDOM('<!doctype html><html><head></head><body></body></html>',{
    url:'https://example.org/',runScripts:'outside-only'
  });
  const {window}=dom;
  window.eval(read('content/adm/adm-review-didactic-m01-m05.js'));
  window.eval(read('content/adm/adm-review-didactic-m06-m10.js'));
  const data=window.ADM_REVIEW_V2_DATA;
  assert.equal(Object.keys(data).length,10);
  for(let n=1;n<=10;n++){
    const entry=data[n];
    assert.ok(entry?.title && entry.intro, 'M'+n+' precisa de introdução');
    assert.ok(entry.sections.length>=4, 'M'+n+' precisa de desenvolvimento');
    assert.ok(entry.sections.every(s=>s[1].length>=2&&s[2]), 'M'+n+' exige parágrafos e exemplos');
    assert.ok(entry.remember.length>=4);
    assert.ok(entry.laws.length>=1);
    assert.ok(entry.laws.every(([,url])=>/^https:\/\//.test(url)));
    const body=[entry.intro,...entry.sections.flatMap(s=>[s[0],...s[1],s[2]]),...entry.remember].join(' ');
    assert.ok(body.split(/\s+/).length>=550, 'M'+n+' está excessivamente breve');
    assert.doesNotMatch(body, /<script|<iframe/i);
  }
  dom.window.close();
});

test('Leitor substitui somente a teoria resumida e preserva questões e completos', async () => {
  const dom=new JSDOM('<!doctype html><html><head></head><body></body></html>',{
    url:'https://example.org/',runScripts:'outside-only'
  });
  const {window}=dom;
  window.Response=globalThis.Response;
  window.Blob=globalThis.Blob;
  window.DecompressionStream=globalThis.DecompressionStream;
  window.eval(read('content/adm/adm-review-didactic-m01-m05.js'));
  window.eval(read('content/adm/adm-review-didactic-m06-m10.js'));
  for(let n=1;n<=10;n++){window.eval(read('content/adm/m'+num(n)+'-apostila-summary.js'));window.eval(read('content/adm/autor-20261110/adm-m'+num(n)+'-submitted-review.js'));}
  window.eval(read('content/adm/m01-apostila-complete.js'));
  window.eval(read('ui/adm-apostila-reading-v1.js'));
  for(let n=1;n<=10;n++){
    const raw=gunzipSync(Buffer.from(window.ADM_APOSTILA_PACKED[n+':summary'],'base64')).toString('utf8');
    const marker=/<h2\b[^>]*>\s*5\s+Questões Internas[^<]*<\/h2>/i;
    const originalQuestionPos=raw.search(marker);
    assert.ok(originalQuestionPos>=0, 'M'+n+' deve preservar questões existentes');
    const result=await window.AdmApostilaReading.load(n,'summary');
    const resultQuestionPos=result.search(marker);
    assert.ok(resultQuestionPos>=0, 'M'+n+' perdeu questões');
    assert.equal(result.slice(resultQuestionPos),raw.slice(originalQuestionPos));
    const doc=new JSDOM('<main>'+result+'</main>').window.document;
    const headers=[...doc.querySelectorAll('main h2')].map(h=>h.textContent);
    assert.ok(doc.querySelector('.adm-author-reading'), 'M'+n+' apostila autoral ausente');
    assert.ok(doc.querySelectorAll('p').length>=12, 'M'+n+' precisa de explicações em parágrafos');
    assert.ok(doc.querySelectorAll('.adm-author-reading table').length>=1, 'M'+n+' deve preservar as tabelas explicativas');
  }
  const oldComplete=gunzipSync(Buffer.from(window.ADM_APOSTILA_PACKED['1:complete'],'base64')).toString('utf8');
  assert.equal(await window.AdmApostilaReading.load(1,'complete'),oldComplete,'Teoria completa deve permanecer intocada');
  assert.doesNotMatch(await window.AdmApostilaReading.load(1,'summary'),/data-law-key="cf:54"/,'M01 não pode exibir art. 54 da CF por engano');
  dom.window.close();
});
