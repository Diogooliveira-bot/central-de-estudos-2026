import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const data=JSON.parse(fs.readFileSync(path.join(root,'artes/cf-m13/data.json'),'utf8'));
const source=fs.readFileSync(path.join(root,'content/cf/m13-teoria-guiada-data.js'),'utf8');
const reader=fs.readFileSync(path.join(root,'content/cf/cf-teoria-guiada-reader-v1.js'),'utf8');
const real=JSON.parse(source.match(/g\.BC_CF_GUIDED_MODULES\[13\]=(.*);\}\)\(window\);/s)[1]);

test('M13 tem doze artes e conserva os títulos originais da Revisão Guiada',()=>{
  assert.equal(data.module,13);
  assert.equal(data.chapters.length,12);
  assert.deepEqual(data.chapters.map(x=>x.title),real.topics.map(x=>x[0]));
  for(const chapter of data.chapters){
    assert.equal(chapter.cards.length,4);
    assert.equal(chapter.tips.length,2);
    assert.equal(chapter.icons.length,4);
    assert.equal(new Set(chapter.icons).size,4);
    assert.match(chapter.cards[3][0],/pegadinha/i);
  }
});

test('PNGs e WebPs do M13 estão no formato e nas dimensões esperadas',()=>{
  for(let i=1;i<=12;i++){
    const n=String(i).padStart(2,'0');
    const png=fs.readFileSync(path.join(root,`artes/cf-m13/png/CF-M13-C${n}.png`));
    assert.equal(png.subarray(1,4).toString(),'PNG');
    assert.equal(png.readUInt32BE(16),1229);
    assert.equal(png.readUInt32BE(20),1536);
    const webp=fs.readFileSync(path.join(root,`assets/cf/revisao-guiada/m13/CF-M13-C${n}.webp`));
    assert.equal(webp.subarray(0,4).toString(),'RIFF');
    assert.equal(webp.subarray(8,12).toString(),'WEBP');
  }
});

test('o leitor insere somente a arte M13 do capítulo correspondente',()=>{
  assert.match(reader,/n>=4&&n<=14/);
  assert.match(reader,/CF-M'\+String\(n\)\.padStart\(2,'0'\)\+'-C'\+num\+'\.webp/);
  assert.match(reader,/\+lawBox\(n,index\)\+warning\+infographic\+'<\/section>'/);
});

test('cada arte usa quatro pictogramas vetoriais distintos e disponíveis',()=>{
  const render=fs.readFileSync(path.join(root,'artes/cf-m13/render.py'),'utf8');
  const names=[...render.matchAll(/'([^']+)':/g)].map(x=>x[1]);
  for(const chapter of data.chapters)for(const icon of chapter.icons)
    assert.ok(names.includes(icon),`ícone sem desenho: ${icon}`);
});
