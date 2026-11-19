import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const data=JSON.parse(fs.readFileSync(path.join(root,'artes/cf-m03/data.json'),'utf8'));
const review=fs.readFileSync(path.join(root,'content/cf/m03-teoria-guiada-data.js'),'utf8');
const migration=fs.readFileSync(path.join(root,'migrations/cf-m03-guided-infographics-20261118.sql'),'utf8');
function assignedJson(source){
 const start=source.indexOf('={')+1;assert.ok(start>0,'assignment found');let depth=0,inString=false,escape=false;
 for(let i=start;i<source.length;i++){const c=source[i];if(inString){if(escape)escape=false;else if(c==='\\')escape=true;else if(c==='"')inString=false;}else{if(c==='"')inString=true;else if(c==='{')depth++;else if(c==='}'&&--depth===0)return JSON.parse(source.slice(start,i+1));}}
 throw new Error('could not parse module data');
}
const sourceData=assignedJson(review).topics;
test('CF M03 tem uma arte por capítulo real, preservando os títulos',()=>{
 assert.equal(sourceData.length,12);assert.equal(data.length,sourceData.length);
 for(let i=0;i<sourceData.length;i++)assert.equal(data[i].title,sourceData[i][0],`chapter ${i+1}`);
});
test('cada PNG tem 1229 x 1536 pixels e um WebP de implantação correspondente',()=>{
 for(let i=1;i<=12;i++){
  const n=String(i).padStart(2,'0');
  const png=fs.readFileSync(path.join(root,`artes/cf-m03/png/CF-M03-C${n}.png`));
  assert.equal(png.subarray(1,4).toString(),'PNG');
  assert.equal(png.readUInt32BE(16),1229);assert.equal(png.readUInt32BE(20),1536);
  const webp=fs.readFileSync(path.join(root,`assets/cf/revisao-guiada/m03/CF-M03-C${n}.webp`));
  assert.equal(webp.subarray(0,4).toString(),'RIFF');assert.equal(webp.subarray(8,12).toString(),'WEBP');
 }
});
test('migration insere a arte depois do capítulo anterior e não sobrescreve o texto original',()=>{
 assert.match(migration,/content_id='reader:19pwkh3' AND revision=5/);
 assert.match(migration,/position\('<figure' in html\)=0/);
 assert.match(migration,/regexp_count\(html, '<section class="bc-m01-topic bc-apostila-topic"'\)=12/);
 for(let i=1;i<=12;i++){
  const n=String(i).padStart(2,'0');
  assert.match(migration,new RegExp(`data-bc-chapter="${i}"`));
  assert.ok(migration.includes(`/assets/cf/revisao-guiada/m03/CF-M03-C${n}.webp`));
  if(i<12)assert.ok(migration.includes(`aria-labelledby="bc-guided-title-3-${i}"`));
 }
 assert.ok(migration.includes('<section class="bc-apostila-sintese"'));
});
