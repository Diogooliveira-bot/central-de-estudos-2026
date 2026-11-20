import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repo=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const chapterSource=fs.readFileSync(path.join(repo,'content/cf/m07-teoria-guiada-data.js'),'utf8');
const parsed=chapterSource.match(/g\.BC_CF_GUIDED_MODULES\[7\]=(\{[\s\S]*\});\}\)\(window\);?/);
assert.ok(parsed,'M07 source object is present');
const original=JSON.parse(parsed[1]);
const data=JSON.parse(fs.readFileSync(path.join(repo,'artes/cf-m07/data.json'),'utf8'));
const assetDir=path.join(repo,'assets/cf/revisao-guiada/m07');
const pngDir=path.join(repo,'artes/cf-m07/png');
const reader=fs.readFileSync(path.join(repo,'content/cf/cf-teoria-guiada-reader-v1.js'),'utf8');

test('M07 map contains the real 16 chapter titles and complete source text',()=>{
  assert.equal(original.topics.length,16);
  assert.equal(data.module,7);
  assert.equal(data.chapters.length,16);
  for(let i=0;i<16;i++){
    assert.equal(data.chapters[i].title,original.topics[i][0]);
    assert.equal(data.chapters[i].review,original.topics[i][1]);
    assert.equal(data.chapters[i].chapter,i+1);
  }
});

test('all 16 chapter PNGs and responsive WebP assets exist with expected dimensions',()=>{
  for(let i=1;i<=16;i++){
    const id=String(i).padStart(2,'0');
    const png=fs.readFileSync(path.join(pngDir,`CF-M07-C${id}.png`));
    assert.equal(png.readUInt32BE(16),1229,`PNG width, chapter ${id}`);
    assert.equal(png.readUInt32BE(20),1536,`PNG height, chapter ${id}`);
    const webp=fs.readFileSync(path.join(assetDir,`CF-M07-C${id}.webp`));
    assert.equal(webp.toString('ascii',0,4),'RIFF');
    assert.equal(webp.toString('ascii',8,12),'WEBP');
    assert.ok(webp.length>10000);
  }
});

test('M07 alone is added to the guided-review image condition',()=>{
  assert.match(reader,/const infographic=\(n===4\|\|n===5\|\|n===6\|\|n===7\)\?/);
  assert.match(reader,/data-bc-chapter/);
  assert.match(reader,/revisao-guiada\/m'/);
  assert.match(reader,/loading="lazy" decoding="async" width="1229" height="1536"/);
});

test('four M6-style numbered markers remain aligned as a neutral sequence',()=>{
  const icons=path.join(repo,'artes/cf-m07/template-assets');
  for(let i=1;i<=4;i++)assert.ok(fs.existsSync(path.join(icons,`icon${i}.svg`)));
  assert.match(fs.readFileSync(path.join(icons,'icon1.svg'),'utf8'),/>1</);
  assert.match(fs.readFileSync(path.join(icons,'icon2.svg'),'utf8'),/>2</);
  assert.match(fs.readFileSync(path.join(icons,'icon3.svg'),'utf8'),/>3</);
  assert.match(fs.readFileSync(path.join(icons,'icon4.svg'),'utf8'),/>!</);
});
