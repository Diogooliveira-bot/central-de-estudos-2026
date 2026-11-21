import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {JSDOM} from 'jsdom';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const data=JSON.parse(fs.readFileSync(path.join(root,'artes/cf-m15/data.json'),'utf8'));
const source=fs.readFileSync(path.join(root,'content/cf/m15-teoria-guiada-data.js'),'utf8');
const reader=fs.readFileSync(path.join(root,'content/cf/cf-teoria-guiada-reader-v1.js'),'utf8');
const real=JSON.parse(source.match(/g\.BC_CF_GUIDED_MODULES\[15\]=(.*);\}\)\(window\);/s)[1]);

test('M15 mantém os 13 capítulos e seus títulos originais',()=>{
  assert.equal(data.module,15);
  assert.equal(data.chapters.length,13);
  assert.deepEqual(data.chapters.map(x=>x.title),real.topics.map(x=>x[0]));
  for(const item of data.chapters){
    assert.equal(item.cards.length,4);
    assert.equal(item.tips.length,2);
    assert.equal(item.icons.length,4);
    assert.equal(new Set(item.icons).size,4);
    assert.match(item.cards[3][0],/pegadinha/i);
  }
});

test('13 PNGs e WebPs têm formato e dimensões corretos',()=>{
  for(let i=1;i<=13;i++){
    const n=String(i).padStart(2,'0');
    const png=fs.readFileSync(path.join(root,`artes/cf-m15/png/CF-M15-C${n}.png`));
    assert.equal(png.subarray(1,4).toString(),'PNG');
    assert.equal(png.readUInt32BE(16),1229);
    assert.equal(png.readUInt32BE(20),1536);
    const webp=fs.readFileSync(path.join(root,`assets/cf/revisao-guiada/m15/CF-M15-C${n}.webp`));
    assert.equal(webp.subarray(0,4).toString(),'RIFF');
    assert.equal(webp.subarray(8,12).toString(),'WEBP');
  }
});

test('cada arte M15 aparece no fim do capítulo correto e o M14 mantém a sua própria arte',()=>{
  const cardMatch=reader.match(/function card\(topic,index,n\)\{[\s\S]*?\n\}/);
  assert.ok(cardMatch,'renderer de capítulo existe');
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const renderCard=new Function('esc','p','lawBox',cardMatch[0]+'; return card;')(esc,v=>'<p>'+v+'</p>',()=>'');
  for(let i=0;i<13;i++){
    const html=renderCard(real.topics[i],i,15);
    assert.ok(html.includes(`/assets/cf/revisao-guiada/m15/CF-M15-C${String(i+1).padStart(2,'0')}.webp`));
    assert.ok(html.endsWith('</figure></section>'));
  }
  assert.ok(!renderCard(real.topics[0],0,14).includes('/assets/cf/revisao-guiada/m15/'));
  assert.ok(renderCard(real.topics[0],0,14).includes('/assets/cf/revisao-guiada/m14/'));
  assert.match(reader,/n>=4&&n<=15/);
});

test('o leitor real insere cada imagem dentro do capítulo correspondente',()=>{
  const dom=new JSDOM('<!doctype html><html><body></body></html>',{url:'https://example.test',runScripts:'outside-only'});
  const w=dom.window;
  w.eval(source); w.eval(reader);
  assert.equal(w.BcCfGuidedReader.open(15),true);
  const chapters=w.document.querySelectorAll('.bc-m01-topic.bc-apostila-topic');
  const figures=w.document.querySelectorAll('.bc-review-infographic');
  assert.equal(chapters.length,13); assert.equal(figures.length,13);
  figures.forEach((figure,index)=>{
    const img=figure.querySelector('img');
    assert.equal(img.getAttribute('src'),`/assets/cf/revisao-guiada/m15/CF-M15-C${String(index+1).padStart(2,'0')}.webp`);
    assert.equal(figure.parentElement,chapters[index]);
    assert.equal(chapters[index].lastElementChild,figure);
  });
  w.close();
});

test('cada um dos quatro ícones por capítulo existe no conjunto M15',()=>{
  const icons=fs.readFileSync(path.join(root,'artes/cf-m15/icons_m15.py'),'utf8');
  for(const item of data.chapters)for(const icon of item.icons)
    assert.ok(icons.includes(`"${icon}":`),`ícone sem desenho: ${icon}`);
});
