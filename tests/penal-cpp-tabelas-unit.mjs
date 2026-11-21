import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const read=p=>fs.readFileSync(p,'utf8');
function load(dir,filter){
 const g={};g.window=g;g.global=g;vm.createContext(g);
 for(const f of fs.readdirSync(dir).filter(filter).sort())vm.runInContext(read(dir+'/'+f),g,{filename:f});
 return g;
}

test('Penal M01: tabelas do resumo vêm em células (sem colunas alinhadas por espaços)',()=>{
 // leituras depende dos dados base: carrega na ordem certa
 const h=load('content/penal',f=>f==='m01-native-data.js');
 vm.runInContext(read('content/penal/leituras-20261111-01-04.js'),h);
 const text=h.BASE_NATIVE_CONTENT.penal.m01.summary.replace(/\r/g,'');
 const lines=text.split('\n');
 assert.equal(lines.filter(l=>/\S {3,}\S/.test(l)&&!/^\t/.test(l)).length,0,'sobrou tabela alinhada por espaços');
 const cells=lines.filter(l=>/^\t\S/.test(l));
 assert.ok(cells.length>=3*3*4,'esperadas 3 tabelas de 3 colunas');
 assert.ok(text.includes('\tExigência')&&text.includes('\tOperação')&&text.includes('\tCritério'));
});

test('Penal M01: o leitor monta a tabela a partir das células',()=>{
 const src=read('ui/native-study-reader.js');
 assert.match(src,/function bcPenTables\(raw\)/);
 assert.match(src,/b\.type==='table'/);
});

test('Processo Penal: quadro comparativo de todos os módulos é tabela real',()=>{
 const g=load('content/cpp',f=>/^leituras.*\.js$/.test(f));
 const all=g.BASE_CPP_APOSTILAS_20261111;
 assert.equal(Object.keys(all).length,22);
 for(const [k,h] of Object.entries(all)){
  const i=h.indexOf('Quadro comparativo');
  assert.ok(i>0,k+' sem quadro');
  const after=h.slice(i);
  assert.match(after,/^[^<]*<\/h2>\n<table class="bc-cpp-quadro">/,k+' quadro sem tabela');
  const rows=(after.match(/<tr><td>/g)||[]).length;
  assert.ok(rows>=4&&rows<=5,k+' linhas do quadro: '+rows);
 }
});
