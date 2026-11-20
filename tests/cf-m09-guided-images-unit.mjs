import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repo=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=fs.readFileSync(path.join(repo,'artes/cf-m09/source-m09.js'),'utf8');
const match=source.match(/g\.BC_CF_GUIDED_MODULES\[9\]=(.*);\}\)\(window\);/s);
assert.ok(match,'M09 source is present');
const original=JSON.parse(match[1]);
const data=JSON.parse(fs.readFileSync(path.join(repo,'artes/cf-m09/data.json'),'utf8'));
const reader=fs.readFileSync(path.join(repo,'content/cf/cf-teoria-guiada-reader-v1.js'),'utf8');
const html=fs.readFileSync(path.join(repo,'index.html'),'utf8');

test('map preserves all 11 source titles and review text',()=>{
  assert.equal(data.module,9);
  assert.equal(data.module_title,original.title);
  assert.equal(data.chapters.length,11);
  assert.equal(original.topics.length,11);
  for(let i=0;i<11;i++){
    const chapter=data.chapters[i],topic=original.topics[i];
    assert.equal(chapter.chapter,i+1);
    for(let field=0;field<5;field++){
      assert.equal([chapter.title,chapter.review,chapter.example,chapter.constitutional_reference,chapter.exam_trap][field],topic[field]);
    }
    assert.deepEqual(chapter.memorization,[topic[5],topic[6]]);
    assert.equal(chapter.cards.length,4);
    assert.equal(chapter.tips.length,2);
  }
});

test('all 11 images are correctly named, sized and optimized',async()=>{
  for(let i=1;i<=11;i++){
    const id=String(i).padStart(2,'0');
    const png=path.join(repo,`artes/cf-m09/png/CF-M09-C${id}.png`);
    const webp=path.join(repo,`assets/cf/revisao-guiada/m09/CF-M09-C${id}.webp`);
    assert.ok(fs.existsSync(png));
    assert.ok(fs.existsSync(webp));
    const {stdout}=await import('node:child_process').then(({execFileSync})=>({stdout:execFileSync('python3',['-c',`from PIL import Image;import sys;im=Image.open(sys.argv[1]);print(f'{im.format}:{im.width}x{im.height}')`,png],{encoding:'utf8'}).trim()}));
    assert.equal(stdout,'PNG:1229x1536');
    const bytes=fs.readFileSync(webp);
    assert.equal(bytes.toString('ascii',0,4),'RIFF');
    assert.equal(bytes.toString('ascii',8,12),'WEBP');
    assert.ok(bytes.length>10000&&bytes.length<300000);
  }
});

test('reader places the M09 art after each chapter and cache tag changed',()=>{
  assert.match(reader,/n===8\|\|n===9/);
  assert.match(reader,/data-bc-chapter/);
  assert.match(reader,/loading="lazy" decoding="async" width="1229" height="1536"/);
  assert.match(reader,/warning\+infographic/);
  assert.match(html,/cf-teoria-guiada-reader-v1\.js\?v=20261120m09artes1/);
});

test('the four symbolic figures use legal-study concepts',()=>{
  const render=fs.readFileSync(path.join(repo,'artes/cf-m09/render.py'),'utf8');
  for(const term of ['tribunal','balança','texto constitucional','alerta de prova'])assert.match(render,new RegExp(term,'i'));
});
