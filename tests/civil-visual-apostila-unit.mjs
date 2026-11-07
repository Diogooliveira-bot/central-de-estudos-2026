import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import zlib from 'node:zlib';
import crypto from 'node:crypto';
import { JSDOM } from 'jsdom';
import { protectedAsset } from '../lib/protected-content.js';
const decode=(file,key)=>{const w={};vm.runInNewContext(fs.readFileSync(file,'utf8'),{window:w});return JSON.parse(zlib.gunzipSync(Buffer.from(w[key],'base64')));};
const original=decode('content/civil/civil-native-content-packed.js','CIVIL_NATIVE_PACKED_B64');
const visual=decode('content/civil/civil-visual-apostila-packed.js','CIVIL_APOSTILA_PACKED_B64');
const audit=JSON.parse(fs.readFileSync('audits/civil-visual-apostila-20261106.json'));
test('15 complete modules retain their source corpus and have navigable headings and visible law',()=>{
 assert.equal(Object.keys(visual).length,15);
 for(let n=1;n<=15;n++){
  const old=original['civil-m'+String(n).padStart(2,'0')],m=visual[n],row=audit.find(x=>x.module===n);
  assert.equal(row.sourceHash,crypto.createHash('sha256').update(old.completeHtml).digest('hex'));
  assert.equal(m.title,old.title);
  const dom=new JSDOM(m.html),d=dom.window.document;
  assert.equal(d.querySelectorAll('.cv-apostila').length,1);
  assert.equal(d.querySelectorAll('pre').length,0,'unformatted pre M'+n);
  assert.ok(d.querySelector('.overview'));
  assert.ok(d.querySelector('.synthesis'));
  assert.ok(d.querySelectorAll('.law-article').length>=20);
  const ids=[...d.querySelectorAll('[id]')].map(e=>e.id);assert.equal(new Set(ids).size,ids.length);
  assert.equal(d.querySelectorAll('.bc-m01-card').length,0);
  assert.ok(![...d.querySelectorAll('h2,h3')].some(h=>/^\s*\d+\)\s/.test(h.textContent)));
  d.querySelectorAll('.law,.overview,.synthesis').forEach(x=>x.remove());
  const plain=d.body.textContent.replace(/\s+/g,' ').split(' ').length;
  assert.ok(plain>=row.sourceWords*.84,'theory coverage M'+n+' '+plain+'/'+row.sourceWords);
  dom.window.close();
 }
});
test('M04 approved pilot includes all articles 104–184 and full subdivisions',()=>{
 const dom=new JSDOM(visual[4].html),d=dom.window.document;
 for(let n=104;n<=184;n++)assert.match(d.querySelector('.cv-apostila').textContent,new RegExp('Art\\. '+n+'\\.'));
 assert.match(d.body.textContent,/III - forma prescrita ou não defesa em lei/);
 assert.match(d.body.textContent,/§ 2º As partes poderão livremente pactuar/);
 dom.window.close();
});
test('source protection and service worker deny offline premium corpus',()=>{
 const asset='/content/civil/civil-visual-apostila-packed.js';
 assert.deepEqual(protectedAsset(asset),{kind:'file',feature:'theory.complete'});
 assert.match(fs.readFileSync('sw.js','utf8'),/civil-visual-apostila-packed\.js/);
});
test('M03 formatted complete content avoids legacy formatter and preserves reader session guard',()=>{
 const src=fs.readFileSync('ui/civil-native-study-v1.js','utf8');
 assert.match(src,/if\(n===3&&kind!=='complete'\)/);
 assert.match(src,/html=await g\.CivilVisualApostila\.html\(n\);\s*if\(activeReader!==session\)return/);
});
test('standalone selector renders all 15 modules and keeps every TOC target valid',()=>{
 const dom=new JSDOM('<select id="module">'+Object.keys(visual).map(n=>'<option>'+n+'</option>').join('')+'</select><button id="menu"></button><button id="plus"></button><button id="minus"></button><nav></nav><main></main><script type="application/json" id="data"></script>',{runScripts:'outside-only'});
 const w=dom.window,d=w.document;w.scrollTo=()=>{};d.getElementById('data').textContent=JSON.stringify(visual);
 w.eval(fs.readFileSync('scripts/civil-standalone-preview-runtime.js','utf8'));
 for(let n=1;n<=15;n++){
  d.getElementById('module').value=String(n);d.getElementById('module').dispatchEvent(new w.Event('change'));
  assert.equal(d.querySelector('main h1').textContent,visual[n].title);
  assert.ok(d.querySelector('main .law'));
  for(const a of d.querySelectorAll('nav a'))assert.ok(d.getElementById(a.hash.slice(1)),'invalid TOC M'+n);
 }
 d.getElementById('plus').click();assert.equal(d.documentElement.style.getPropertyValue('--size'),'19px');
 dom.window.close();
});
