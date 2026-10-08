import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';
const script=await readFile(new URL('../ui/module-text-export-v1.js',import.meta.url),'utf8');

function start(role='admin'){
 const window={BASE_COMPLETA_USER:{role}};
 const document={
  readyState:'loading',
  createElement(){return {textContent:''}},
  head:{appendChild(){}},
  addEventListener(){}
 };
 runInNewContext(script,{window,document,Blob,TextEncoder,Uint8Array,DataView,URL,console,setTimeout});
 return window;
}
test('o exportador nao e montado para aluno',()=>{
 const w=start('aluno');assert.equal(w.BaseCompletaTextExport,undefined);
});
test('fontes canonicas preservam resumo, integral e titulo',async()=>{
 const w=start();
 w.BASE_NATIVE_CONTENT={penal:{m01:{number:1,title:'Princípios',summary:'Texto resumido',complete:'Texto completo'}}};
 const rows=await w.BaseCompletaTextExport.readDiscipline('penal');
 assert.equal(rows.length,1);
 assert.equal(rows[0].title,'Princípios');
 assert.equal(rows[0].summary,'Texto resumido');
 assert.equal(rows[0].complete,'Texto completo');
});
test('ZIP armazena TXT UTF-8, nomes e indice central validos',async()=>{
 const w=start(),name='Direito_Civil_M01_RESUMIDA.txt',sample='Lei nº 10.406 — ação';
 const zip=w.BaseCompletaTextExport.zip([{name,text:sample}]),buf=Buffer.from(await zip.arrayBuffer());
 assert.equal(buf.readUInt32LE(0),0x04034b50);
 assert.equal(buf.readUInt16LE(6),0x0800);
 const filenameSize=buf.readUInt16LE(26),fileSize=buf.readUInt32LE(18);
 assert.equal(buf.subarray(30,30+filenameSize).toString('utf8'),name);
 assert.equal(buf.subarray(30+filenameSize,30+filenameSize+fileSize).toString('utf8'),'\uFEFF'+sample);
 const central=30+filenameSize+fileSize;
 assert.equal(buf.readUInt32LE(central),0x02014b50);
 assert.equal(buf.readUInt32LE(buf.length-22),0x06054b50);
 assert.equal(buf.readUInt16LE(buf.length-14),1);
});
