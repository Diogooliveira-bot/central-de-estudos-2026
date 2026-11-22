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
const pack=(number,mode)=>packed(`content/adm/m${String(number).padStart(2,'0')}-apostila-${mode}.js`,new RegExp(`\\["${number}:${mode}"\\]="([^"]+)"`));
const submitted=number=>packed(`content/adm/autor-20261110/adm-m${String(number).padStart(2,'0')}-submitted-review.js`,new RegExp(`ADM_SUBMITTED_REVIEW\\[${number}\\]="([^"]+)"`));
async function load(number,mode){
 const dom=new JSDOM('<!doctype html><html><head></head><body></body></html>',{runScripts:'outside-only'}),win=dom.window;
 win.ADM_APOSTILA_PACKED={[`${number}:${mode}`]:pack(number,mode)};
 win.ADM_SUBMITTED_REVIEW={[number]:submitted(number)};
 win.DecompressionStream=DecompressionStream;win.Blob=Blob;win.Response=Response;win.atob=atob;
 win.eval(read('ui/adm-apostila-reading-v1.js'));
 try{return {dom,html:await win.AdmApostilaReading.load(number,mode)}}
 catch(error){dom.window.close();throw error}
}

test('ADM M04: cada arte entra ao final do capítulo certo da Revisão Guiada',async()=>{
 const {dom,html}=await load(4,'summary');
 try{
  const doc=new JSDOM(`<main>${html}</main>`).window.document;
  const expected=['A ideia de poder-dever e seus limites','Poder hierárquico: organizar e coordenar','Delegação, avocação e distribuição de competências','Poder disciplinar: apurar e responsabilizar','Poder regulamentar e poder normativo','Poder de polícia administrativa','Discricionariedade, vinculação e controle','Abuso de poder: excesso e desvio','Como identificar o poder em situações concretas'];
  const chapters=[...doc.querySelectorAll('h2')].filter(h=>/^\d{2}\s+/.test(h.textContent.trim())),figures=[...doc.querySelectorAll('[data-adm-review-art]')];
  assert.equal(chapters.length,9);assert.equal(figures.length,9);
  for(let i=0;i<9;i++){
   const n=String(i+1).padStart(2,'0'),figure=figures[i],img=figure.querySelector('img');
   assert.equal(chapters[i].textContent.trim(),`${n} ${expected[i]}`);
   assert.equal(figure.dataset.admReviewArt,`04-${n}`);
   assert.equal(img.getAttribute('src'),`/assets/adm/revisao-guiada/m04/ADM-M04-C${n}.webp`);
   assert.equal(img.getAttribute('loading'),'lazy');
   assert.ok(existsSync(`assets/adm/revisao-guiada/m04/ADM-M04-C${n}.webp`));
   assert.ok(chapters[i].compareDocumentPosition(figure)&dom.window.Node.DOCUMENT_POSITION_FOLLOWING);
   if(i<8)assert.ok(figure.compareDocumentPosition(chapters[i+1])&dom.window.Node.DOCUMENT_POSITION_FOLLOWING);
  }
  assert.match(html,/5 Questões Internas/);
  assert.equal(doc.querySelectorAll('[data-adm-review-art^="03-"]').length,0);
 }finally{dom.window.close()}
});

test('ADM M04: Conteúdo Completo não recebe artes de revisão',async()=>{
 const {dom,html}=await load(4,'complete');
 try{
  assert.doesNotMatch(html,/data-adm-review-art|ADM-M04-C\d{2}\.(?:webp|png)/);
  assert.equal(dom.window.document.querySelectorAll('[data-adm-review-art]').length,0);
 }finally{dom.window.close()}
});
