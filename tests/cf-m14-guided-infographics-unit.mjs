import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const local=path.resolve(here,'..');
const repo=path.resolve(here,'../..');
const root=fs.existsSync(path.join(repo,'artes/cf-m14/data.json'))?repo:local;
const art=path.join(root,'artes/cf-m14');
const dataPath=fs.existsSync(path.join(art,'data.json'))?path.join(art,'data.json'):path.join(root,'data.json');
const pngDir=fs.existsSync(path.join(art,'png'))?path.join(art,'png'):path.join(root,'png');
const assetRoot=fs.existsSync(path.join(root,'assets/cf/revisao-guiada/m14'))?root:path.resolve(root,'..');
const webpDir=path.join(assetRoot,'assets/cf/revisao-guiada/m14');
const data=JSON.parse(fs.readFileSync(dataPath,'utf8'));
const pngs=fs.readdirSync(pngDir).filter(x=>/^CF-M14-C\d{2}\.png$/.test(x)).sort();
test('M14 source has 14 chapters with consecutive art names',()=>{
 assert.equal(data.length,14);
 assert.deepEqual(pngs,Array.from({length:14},(_,i)=>`CF-M14-C${String(i+1).padStart(2,'0')}.png`));
});
test('all M14 PNGs and WebPs have valid headers and expected PNG dimensions',()=>{
 for(let i=1;i<=14;i++){
  const name=`CF-M14-C${String(i).padStart(2,'0')}`;
  const png=fs.readFileSync(path.join(pngDir,`${name}.png`));
  assert.equal(png.subarray(0,8).toString('hex'),'89504e470d0a1a0a',name);
  assert.equal(png.readUInt32BE(16),1229,name); assert.equal(png.readUInt32BE(20),1536,name);
  const webp=fs.readFileSync(path.join(webpDir,`${name}.webp`));
  assert.equal(webp.subarray(0,4).toString('ascii'),'RIFF',name); assert.equal(webp.subarray(8,12).toString('ascii'),'WEBP',name);
 }
});
test('the shared CF reader enables M14 infographic output',()=>{
 const reader=path.join(root,'content/cf/cf-teoria-guiada-reader-v1.js');
 if(!fs.existsSync(reader))return;
 const text=fs.readFileSync(reader,'utf8'); assert.match(text,/n>=4\s*&&\s*n<=15/);
});
