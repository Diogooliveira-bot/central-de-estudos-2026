import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { JSDOM } from 'jsdom';

const read=path=>readFileSync(path,'utf8');
const packed=(path,pattern)=>{
 const match=read(path).match(pattern);
 assert.ok(match,'conteúdo compactado localizado: '+path);
 return match[1];
};
const summaryPacked=number=>packed(`content/adm/m${String(number).padStart(2,'0')}-apostila-summary.js`,new RegExp(`\\["${number}:summary"\\]="([^"]+)"`));
const submittedPacked=number=>packed(`content/adm/autor-20261110/adm-m${String(number).padStart(2,'0')}-submitted-review.js`,new RegExp(`ADM_SUBMITTED_REVIEW\\[${number}\\]="([^"]+)"`));
async function loadReview(number){
 const dom=new JSDOM('<!doctype html><html><head></head><body></body></html>',{runScripts:'outside-only'});
 const win=dom.window;
 win.ADM_APOSTILA_PACKED={[`${number}:summary`]:summaryPacked(number)};
 win.ADM_SUBMITTED_REVIEW={[number]:submittedPacked(number)};
 win.DecompressionStream=DecompressionStream;win.Blob=Blob;win.Response=Response;win.atob=atob;
 win.eval(read('ui/adm-apostila-reading-v1.js'));
 try{return {dom,html:await win.AdmApostilaReading.load(number,'summary')}}
 catch(error){dom.window.close();throw error}
}

test('ADM M03: cada arte entra ao final do capítulo correto e preserva a revisão e as questões',async()=>{
 const {dom,html}=await loadReview(3);
 try{
  const doc=new JSDOM(`<main>${html}</main>`).window.document;
  const chapters=[...doc.querySelectorAll('h2')].filter(h=>/^\d{2}\s+/.test(h.textContent.trim()));
  const expected=['O que é um ato administrativo?','Os cinco elementos de validade','Motivo, motivação e teoria dos motivos determinantes','Atributos dos atos administrativos','Atos vinculados, discricionários e mérito','Principais classificações dos atos','Perfeição, validade, eficácia e efeitos','Anulação, revogação e convalidação','Um caso completo: da decisão à revisão'];
  const figures=[...doc.querySelectorAll('[data-adm-review-art]')];
  assert.equal(chapters.length,9);assert.equal(figures.length,9);
  for(let i=0;i<9;i++){
   const n=String(i+1).padStart(2,'0'),figure=figures[i],img=figure.querySelector('img');
   assert.equal(chapters[i].textContent.trim(),`${n} ${expected[i]}`);
   assert.equal(figure.dataset.admReviewArt,`03-${n}`);
   assert.equal(img.getAttribute('src'),`/assets/adm/revisao-guiada/m03/ADM-M03-C${n}.webp`);
   assert.equal(img.getAttribute('loading'),'lazy');
   assert.ok(existsSync(`assets/adm/revisao-guiada/m03/ADM-M03-C${n}.webp`));
   assert.ok(chapters[i].compareDocumentPosition(figure)&dom.window.Node.DOCUMENT_POSITION_FOLLOWING);
   if(i<8)assert.ok(figure.compareDocumentPosition(chapters[i+1])&dom.window.Node.DOCUMENT_POSITION_FOLLOWING);
  }
  assert.match(html,/5 Questões Internas/);
  assert.equal(doc.querySelectorAll('[data-adm-review-art^="02-"]').length,0);
 }finally{dom.window.close()}
});

test('ADM M02 continua associando suas nove imagens à própria revisão',async()=>{
 const {dom,html}=await loadReview(2);
 try{
  const doc=new JSDOM(`<main>${html}</main>`).window.document;
  const figures=[...doc.querySelectorAll('[data-adm-review-art]')];assert.equal(figures.length,9);
  figures.forEach((figure,i)=>{const n=String(i+1).padStart(2,'0');assert.equal(figure.dataset.admReviewArt,`02-${n}`);assert.equal(figure.querySelector('img').getAttribute('src'),`/assets/adm/revisao-guiada/m02/ADM-M02-C${n}.webp`)});
 }finally{dom.window.close()}
});
