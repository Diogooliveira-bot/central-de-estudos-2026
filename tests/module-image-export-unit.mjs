import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';
const script=await readFile(new URL('../ui/module-image-export-v1.js',import.meta.url),'utf8');
function initialize(role){
 const w={BASE_COMPLETA_USER:{role}};
 const document={readyState:'loading',head:{append(){}},createElement(){return {textContent:''}},addEventListener(){}};
 runInNewContext(script,{window:w,document,Blob,TextEncoder,Uint8Array,DataView,console,setTimeout});
 return w;
}
test('somente administrador recebe o exportador',()=>{
 assert.equal(initialize('aluno').BaseCompletaImageExport,undefined);
 assert.equal(initialize('admin').BaseCompletaImageExport.imageFor instanceof Function,true);
});
test('ZIP inclui bytes originais da imagem, nome UTF-8 e estrutura central',async()=>{
 const w=initialize('admin');
 const image=new Uint8Array([0,255,1,128,12,99]);
 const out=await w.BaseCompletaImageExport.zip([{name:'Infográfico.png',blob:new Blob([image],{type:'image/png'})}]);
 const b=Buffer.from(await out.arrayBuffer());
 assert.equal(b.readUInt32LE(0),0x04034b50);
 const nameLength=b.readUInt16LE(26),size=b.readUInt32LE(18);
 assert.equal(b.subarray(30,30+nameLength).toString(),'Infográfico.png');
 assert.deepEqual(b.subarray(30+nameLength,30+nameLength+size),Buffer.from(image));
 assert.equal(b.readUInt32LE(b.length-22),0x06054b50);
});
