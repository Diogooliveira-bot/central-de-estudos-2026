import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {JSDOM} from 'jsdom';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const data=JSON.parse(fs.readFileSync(path.join(root,'artes/cf-m10/data.json'),'utf8'));
const reader=fs.readFileSync(path.join(root,'content/cf/cf-teoria-guiada-reader-v1.js'),'utf8');
const titles=[
 'CNJ: função administrativa, não recursal','STJ: composição e missão constitucional',
 'Recurso especial: três hipóteses e lei federal','Relevância do recurso especial após Lei 15.484/2026',
 'Justiça do Trabalho: TST, TRTs e juízes','Competência da Justiça do Trabalho: art. 114',
 'CSJT e supervisão administrativa trabalhista','Justiça Federal: TRFs e juízes federais',
 'Competências de TRF e juiz federal','Seções judiciárias e organização federal',
 'Justiça Estadual: organização e controle constitucional','Justiça Militar estadual e conflitos fundiários'
];
const cardMatch=reader.match(/function card\(topic,index,n\)\{[\s\S]*?\n\}/);
assert.ok(cardMatch,'card renderer exists');
const renderCard=new Function('esc','p','lawBox',cardMatch[0]+'; return card;')(
 v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),
 v=>'<p>'+String(v??'')+'</p>',()=>''
);
test('M10 corresponde aos 12 capítulos reais, na ordem e com títulos originais',()=>{
 assert.equal(data.module,10); assert.equal(data.chapters.length,12);
 assert.deepEqual(data.chapters.map(x=>x.title),titles);
 for(const item of data.chapters){assert.equal(item.cards.length,4);assert.equal(item.tips.length,2);assert.equal(item.icons.length,4);}
});
test('as 12 imagens PNG medem 1229 × 1536 e possuem WebP otimizado',()=>{
 for(let i=1;i<=12;i++){
  const n=String(i).padStart(2,'0');
  const png=fs.readFileSync(path.join(root,'artes/cf-m10/png/CF-M10-C'+n+'.png'));
  assert.equal(png.subarray(1,4).toString(),'PNG');assert.equal(png.readUInt32BE(16),1229);assert.equal(png.readUInt32BE(20),1536);
  const webp=fs.readFileSync(path.join(root,'assets/cf/revisao-guiada/m10/CF-M10-C'+n+'.webp'));
  assert.equal(webp.subarray(0,4).toString(),'RIFF');assert.equal(webp.subarray(8,12).toString(),'WEBP');
 }
});
test('somente M10 recebe arte no final de cada capítulo e outros módulos mantêm seus próprios arquivos',()=>{
 for(let i=0;i<12;i++){
  const html=renderCard([titles[i],'texto'],i,10);
  assert.equal((html.match(/<figure class="bc-review-infographic"/g)||[]).length,1);
  assert.ok(html.includes('/assets/cf/revisao-guiada/m10/CF-M10-C'+String(i+1).padStart(2,'0')+'.webp'));
  assert.ok(html.endsWith('</figure></section>'));
 }
 assert.ok(!renderCard([titles[0],'texto'],0,3).includes('/assets/cf/revisao-guiada/m10/'));
 assert.ok(renderCard([titles[0],'texto'],0,9).includes('/assets/cf/revisao-guiada/m09/CF-M09-C01.webp'));
});
test('leitor real associa cada imagem ao capítulo certo do M10',()=>{
 const dom=new JSDOM('<!doctype html><html><body></body></html>',{url:'https://example.test',runScripts:'outside-only'});const w=dom.window;
 w.eval(fs.readFileSync(path.join(root,'content/cf/m10-teoria-guiada-data.js'),'utf8'));w.eval(reader);
 assert.equal(w.BcCfGuidedReader.open(10),true);
 const chapters=w.document.querySelectorAll('.bc-m01-topic.bc-apostila-topic'),figures=w.document.querySelectorAll('.bc-review-infographic');
 assert.equal(chapters.length,12);assert.equal(figures.length,12);
 figures.forEach((figure,index)=>{const img=figure.querySelector('img');assert.equal(img.getAttribute('src'),'/assets/cf/revisao-guiada/m10/CF-M10-C'+String(index+1).padStart(2,'0')+'.webp');assert.equal(figure.parentElement,chapters[index]);assert.equal(chapters[index].lastElementChild,figure);});
 w.close();
});
test('as quatro figuras visuais de cada capítulo têm símbolo contextual',()=>{
 for(const item of data.chapters)assert.equal(new Set(item.icons).size,4,`ícones repetidos no capítulo ${item.chapter}`);
 const art=fs.readFileSync(path.join(root,'artes/cf-m10/render.py'),'utf8');
 for(const item of data.chapters)for(const icon of item.icons)assert.ok(art.includes(`'${icon}':`)||art.includes(`['${icon}']`),`ícone sem desenho: ${icon}`);
});
