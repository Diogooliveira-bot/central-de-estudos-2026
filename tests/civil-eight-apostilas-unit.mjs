import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {gunzipSync} from 'node:zlib';
import {runInNewContext} from 'node:vm';

const read=path=>readFile(new URL('../'+path,import.meta.url),'utf8');
const priority=[1,2,5,6,7,10,12,14];
test('oito módulos: nenhuma teoria perde caracteres na segmentação',async()=>{
 const src=await read('content/civil/civil-native-content-packed.js');
 const b64=src.match(/CIVIL_NATIVE_PACKED_B64="([^"]+)"/)?.[1];
 assert.ok(b64);
 const packed=JSON.parse(gunzipSync(Buffer.from(b64,'base64')).toString('utf8'));
 const scope={window:{},document:{readyState:'loading',addEventListener(){}}};
 runInNewContext(await read('ui/civil-eight-apostilas-v1.js'),scope);
 const format=scope.window.CivilEightApostilas;
 assert.equal(typeof format.enhance,'function');
 for(const n of priority){
  const key='civil-m'+String(n).padStart(2,'0'),item=packed[key];
  assert.ok(item,key);
  for(const variant of ['summaryHtml','completeHtml']){
   const html=item[variant];
   const pres=[...html.matchAll(/<pre\b[^>]*>([\s\S]*?)<\/pre>/gi)];
   assert.ok(pres.length,key+':'+variant+' sem blocos originais');
   for(const [i,match] of pres.entries()){
    const source=match[1],{lines,groups}=format.splitGroups(source);
    const copy=groups.map(group=>lines.slice(group.start,group.end+1).join('\n')).join('\n');
    assert.equal(copy,source,key+':'+variant+':pre'+i);
   }
  }
  assert.equal(item.summaryQuestions.length,5,key+' resumo');
  assert.equal(item.completeQuestions.length,10,key+' completa');
 }
});
test('mudança de apresentação não escreve progresso nem altera o pacote fonte',async()=>{
 const js=await read('ui/civil-eight-apostilas-v1.js');
 const boot=await read('central-v119.html');
 assert.match(js,/result\.textContent!==original/);
 assert.match(js,/MODULES=new Set\(\[1,2,5,6,7,10,12,14\]\)/);
 assert.doesNotMatch(js,/localStorage|indexedDB|sessionStorage/);
 assert.match(boot,/ui\/civil-eight-apostilas-v1\.js/);
});
