import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const data=JSON.parse(fs.readFileSync(path.join(root,'artes/cf-m12/data.json'),'utf8'));
const source=fs.readFileSync(path.join(root,'content/cf/m12-teoria-guiada-data.js'),'utf8');
const reader=fs.readFileSync(path.join(root,'content/cf/cf-teoria-guiada-reader-v1.js'),'utf8');
const real=JSON.parse(source.match(/g\.BC_CF_GUIDED_MODULES\[12\]=(.*);\}\)\(window\);/s)[1]);

test('M12 tem 13 artes e mantém todos os títulos originais da Revisão Guiada',()=>{
  assert.equal(data.module,12);
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

test('13 PNGs e WebPs têm formato, tamanho e dimensões esperados',()=>{
  for(let i=1;i<=13;i++){
    const n=String(i).padStart(2,'0');
    const png=fs.readFileSync(path.join(root,`artes/cf-m12/png/CF-M12-C${n}.png`));
    assert.equal(png.subarray(1,4).toString(),'PNG');
    assert.equal(png.readUInt32BE(16),1229);
    assert.equal(png.readUInt32BE(20),1536);
    const webp=fs.readFileSync(path.join(root,`assets/cf/revisao-guiada/m12/CF-M12-C${n}.webp`));
    assert.equal(webp.subarray(0,4).toString(),'RIFF');
    assert.equal(webp.subarray(8,12).toString(),'WEBP');
  }
});

test('o leitor coloca a arte M12 no fim de cada capítulo, sem habilitá-la nos demais módulos',()=>{
  assert.match(reader,/n>=4&&n<=15/);
  assert.match(reader,/CF-M'\+String\(n\)\.padStart\(2,'0'\)\+'-C'\+num\+'\.webp/);
  assert.match(reader,/\+lawBox\(n,index\)\+warning\+infographic\+'<\/section>'/);
  assert.match(reader,/n<=15/);
});

test('os quatro pictogramas por capítulo têm desenho vetorial no renderer',()=>{
  const render=fs.readFileSync(path.join(root,'artes/cf-m12/render.py'),'utf8');
  for(const item of data.chapters)for(const icon of item.icons)
    assert.ok(render.includes(`'${icon}':`)||render.includes(`['${icon}']`),`ícone sem desenho: ${icon}`);
});
