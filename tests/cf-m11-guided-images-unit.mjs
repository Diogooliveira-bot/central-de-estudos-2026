import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const data=JSON.parse(fs.readFileSync(path.join(root,'artes/cf-m11/data.json'),'utf8'));
const source=fs.readFileSync(path.join(root,'content/cf/m11-teoria-guiada-data.js'),'utf8');
const reader=fs.readFileSync(path.join(root,'content/cf/cf-teoria-guiada-reader-v1.js'),'utf8');
const real=JSON.parse(source.match(/g\.BC_CF_GUIDED_MODULES\[11\]=(.*);\}\)\(window\);/s)[1]);

test('M11 tem 12 capítulos e mantém todos os títulos da Revisão Guiada',()=>{
  assert.equal(data.module,11);
  assert.equal(data.chapters.length,12);
  assert.deepEqual(data.chapters.map(x=>x.title),real.topics.map(x=>x[0]));
  for(const item of data.chapters){
    assert.equal(item.cards.length,4);
    assert.equal(item.tips.length,2);
    assert.equal(item.icons.length,4);
    assert.equal(new Set(item.icons).size,4);
    assert.match(item.cards[3][0],/pegadinha/i);
  }
});

test('12 PNGs e WebPs têm as dimensões e o formato esperados',()=>{
  for(let i=1;i<=12;i++){
    const n=String(i).padStart(2,'0');
    const png=fs.readFileSync(path.join(root,`artes/cf-m11/png/CF-M11-C${n}.png`));
    assert.equal(png.subarray(1,4).toString(),'PNG');
    assert.equal(png.readUInt32BE(16),1229);
    assert.equal(png.readUInt32BE(20),1536);
    const webp=fs.readFileSync(path.join(root,`assets/cf/revisao-guiada/m11/CF-M11-C${n}.webp`));
    assert.equal(webp.subarray(0,4).toString(),'RIFF');
    assert.equal(webp.subarray(8,12).toString(),'WEBP');
  }
});

test('o leitor anexa a arte M11 depois do conteúdo do capítulo, sem mudar outros módulos',()=>{
  assert.match(reader,/n>=4&&n<=11/);
  assert.match(reader,/CF-M'\+String\(n\)\.padStart\(2,'0'\)\+'-C'\+num\+'\.webp/);
  assert.match(reader,/\+lawBox\(n,index\)\+warning\+infographic\+'<\/section>'/);
  assert.match(reader,/n<=11/);
});
