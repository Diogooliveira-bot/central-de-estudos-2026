import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {JSDOM} from 'jsdom';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const data=JSON.parse(fs.readFileSync(path.join(root,'artes/cf-m06/data.json'),'utf8'));
const reader=fs.readFileSync(path.join(root,'content/cf/cf-teoria-guiada-reader-v1.js'),'utf8');
const titles=[
 'O que é Congresso Nacional e bicameralismo',
 'Câmara dos Deputados: composição e eleição',
 'Senado Federal: composição, eleição e renovação',
 'Como funciona o quórum de deliberação',
 'Competências do Congresso: arts. 48 e 49',
 'Câmara autoriza e Senado julga: arts. 51 e 52',
 'Sessões legislativas e reuniões do Congresso',
 'Comissões parlamentares e CPI',
 'Imunidade material parlamentar',
 'Imunidade formal: prisão e processo',
 'Incompatibilidades parlamentares: art. 54',
 'Perda, manutenção e licença do mandato'
];
const cardMatch=reader.match(/function card\(topic,index,n\)\{[\s\S]*?\n\}/);
assert.ok(cardMatch,'card renderer exists');
const renderCard=new Function('esc','p','lawBox',cardMatch[0]+'; return card;')(
 v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),
 v=>'<p>'+String(v??'')+'</p>',
 ()=>''
);

test('M06 reproduz os 12 capítulos reais, em ordem, sem trocar títulos',()=>{
 assert.equal(data.length,12);assert.deepEqual(data.map(x=>x.title),titles);
 for(const item of data){
  assert.equal(item.cards.length,4);assert.equal(item.tips.length,2);
  for(const card of item.cards)assert.equal(card.length,2);
 }
});

test('cada arte M06 existe em PNG 1229 × 1536 e WebP otimizado',()=>{
 for(let i=1;i<=12;i++){
  const n=String(i).padStart(2,'0');
  const png=fs.readFileSync(path.join(root,'artes/cf-m06/png/CF-M06-C'+n+'.png'));
  assert.equal(png.subarray(1,4).toString(),'PNG');
  assert.equal(png.readUInt32BE(16),1229);assert.equal(png.readUInt32BE(20),1536);
  const webp=fs.readFileSync(path.join(root,'assets/cf/revisao-guiada/m06/CF-M06-C'+n+'.webp'));
  assert.equal(webp.subarray(0,4).toString(),'RIFF');assert.equal(webp.subarray(8,12).toString(),'WEBP');
 }
});

test('cada arte M06 é inserida ao fim do capítulo correspondente, sem tocar outros módulos',()=>{
 for(let i=0;i<12;i++){
  const html=renderCard([titles[i],'texto'],i,6);
  assert.equal((html.match(/<figure class="bc-review-infographic"/g)||[]).length,1);
  assert.ok(html.indexOf('<figure')>html.indexOf('<h2'));
  assert.ok(html.includes('/assets/cf/revisao-guiada/m06/CF-M06-C'+String(i+1).padStart(2,'0')+'.webp'));
  assert.ok(html.endsWith('</figure></section>'));
 }
 assert.ok(!renderCard([titles[0],'texto'],0,5).includes('/m06/'));
 assert.ok(!renderCard([titles[0],'texto'],0,7).includes('bc-review-infographic'));
});

test('leitor real abre os 12 capítulos M06 com a arte certa no final',()=>{
 const dom=new JSDOM('<!doctype html><html><body></body></html>',{url:'https://example.test',runScripts:'outside-only'});
 const w=dom.window;
 w.eval(fs.readFileSync(path.join(root,'content/cf/m06-teoria-guiada-data.js'),'utf8'));
 w.eval(reader);
 assert.equal(w.BcCfGuidedReader.open(6),true);
 const chapters=w.document.querySelectorAll('.bc-m01-topic.bc-apostila-topic');
 const figures=w.document.querySelectorAll('.bc-review-infographic');
 assert.equal(chapters.length,12);assert.equal(figures.length,12);
 figures.forEach((figure,index)=>{
  const img=figure.querySelector('img');
  assert.equal(img.getAttribute('src'),'/assets/cf/revisao-guiada/m06/CF-M06-C'+String(index+1).padStart(2,'0')+'.webp');
  assert.equal(chapters[index].lastElementChild,figure);
 });
 w.close();
});
