import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repo=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=fs.readFileSync(path.join(repo,'content/cf/m08-teoria-guiada-data.js'),'utf8');
const parsed=source.match(/g\.BC_CF_GUIDED_MODULES\[8\]=(\{[\s\S]*\});\}\)\(window\);?/);
assert.ok(parsed,'M08 source object is present');
const original=JSON.parse(parsed[1]);
const data=JSON.parse(fs.readFileSync(path.join(repo,'artes/cf-m08/data.json'),'utf8'));
const reader=fs.readFileSync(path.join(repo,'content/cf/cf-teoria-guiada-reader-v1.js'),'utf8');
const assetDir=path.join(repo,'assets/cf/revisao-guiada/m08');

test('M08 map has the exact 11 source chapter titles and complete original text',()=>{
  assert.equal(original.title,'Poder Executivo: atribuições e responsabilidade presidencial');
  assert.equal(original.topics.length,11);
  assert.equal(data.module,8);
  assert.equal(data.chapters.length,11);
  for(let i=0;i<11;i++){
    assert.equal(data.chapters[i].chapter,i+1);
    assert.equal(data.chapters[i].title,original.topics[i][0]);
    assert.equal(data.chapters[i].review,original.topics[i][1]);
    assert.equal(data.chapters[i].example,original.topics[i][2]);
    assert.equal(data.chapters[i].constitutional_reference,original.topics[i][3]);
    assert.equal(data.chapters[i].exam_trap,original.topics[i][4]);
  }
});

test('all 11 responsive WebP assets exist in chapter order',()=>{
  for(let i=1;i<=11;i++){
    const id=String(i).padStart(2,'0');
    const webp=fs.readFileSync(path.join(assetDir,`CF-M08-C${id}.webp`));
    assert.equal(webp.toString('ascii',0,4),'RIFF');
    assert.equal(webp.toString('ascii',8,12),'WEBP');
    assert.ok(webp.length>10000);
  }
});

test('reader appends the M8 image inside each matching chapter',()=>{
  assert.match(reader,/const infographic=\(n===4\|\|n===5\|\|n===6\|\|n===7\|\|n===8\)\?/);
  assert.match(reader,/data-bc-chapter/);
  assert.match(reader,/loading="lazy" decoding="async" width="1229" height="1536"/);
});

test('the four card figures use the M6 neutral markers in order',()=>{
  const icons=path.join(repo,'artes/cf-m08/template-assets');
  for(let i=1;i<=4;i++)assert.ok(fs.existsSync(path.join(icons,`icon${i}.svg`)));
  for(const [file,marker] of [['icon1.svg','1'],['icon2.svg','2'],['icon3.svg','3'],['icon4.svg','!']]){
    assert.match(fs.readFileSync(path.join(icons,file),'utf8'),new RegExp(`>${marker.replace('!','\\!')}<`));
  }
});
