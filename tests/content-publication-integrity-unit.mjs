import test from 'node:test';
import assert from 'node:assert/strict';
import {access,readFile} from 'node:fs/promises';
import vm from 'node:vm';

const root=new URL('../',import.meta.url);
const read=path=>readFile(new URL(path,root),'utf8');

test('CPC M08 instala o conteúdo integral e encerra o carregamento',async()=>{
 const source=await read('content/cpc/m08-native-data.js');
 assert.match(source,/g\.BASE_NATIVE_CONTENT\.cpc\.m08=/);
 assert.match(source,/g\.__M08Installed=true/);
 assert.ok(source.length>20000,'o arquivo integral do M08 não pode ser substituído pelo fragmento curto');
 const boot=await read('central-v119.html');
 assert.match(boot,/content\/cpc\/m08-native-data\.js\?v=20261010auditfix1/);
 assert.doesNotMatch(boot,/m08-native-data-part1\.js/);
});

test('bateria interna do CPC tem 15 questões válidas em cada módulo M07-M17',async()=>{
 const init=await read('central-structural-v66119/cpc-questions-000-init.js');
 const bank=await read('content/cpc/cpc-fixation-questions-v1.js');
 const context={window:{}};
 vm.createContext(context);
 vm.runInContext(init+'\n'+bank+'\nglobalThis.__questions=CPC_QUESTIONS;',context);
 const questions=context.__questions;
 assert.equal(questions.length,165);
 for(let n=7;n<=17;n++){
  const id=`cpc-m${String(n).padStart(2,'0')}`;
  const rows=questions.filter(q=>q.moduleId===id);
  assert.equal(rows.length,15,id);
  for(const q of rows){
   assert.equal(q.o.length,5,q.id);
   assert.ok(Number.isInteger(q.a)&&q.a>=0&&q.a<q.o.length,q.id);
   assert.ok(q.q.trim().length>0,q.id);
  }
 }
});

test('índice de Processo Penal e registro da Central usam os 22 módulos',async()=>{
 const indexSource=await read('content/cpp/cpp-native-index.js');
 const context={window:{}};
 vm.createContext(context);
 vm.runInContext(indexSource,context);
 assert.equal(context.window.CPP_NATIVE_INDEX.moduleCount,22);
 assert.equal(context.window.CPP_NATIVE_INDEX.modules.length,22);
 const runtime=await read('ui/cpp-native-study-v1.js');
 assert.match(runtime,/function syncSubjectRegistry\(\)/);
 assert.match(runtime,/syncSubjectRegistry\(\);patchSubjStats\(\)/);
});

test('metadados de Português refletem as unidades existentes em M01 e M13',async()=>{
 const source=await read('portugues-site.js');
 assert.match(source,/"id":"m01"[^\n]+"lessons":29/);
 assert.match(source,/"id":"m13"[^\n]+"lessons":35/);
});

test('manifesto offline só referencia arquivos publicados',async()=>{
 const manifest=JSON.parse(await read('central-offline-files-v66172.json'));
 assert.equal(manifest.build,'20261010-auditfix1');
 for(const entry of manifest.files){
  if(!entry.startsWith('/')||entry.startsWith('//'))continue;
  const path=entry.slice(1).split(/[?#]/,1)[0];
  await access(new URL(path,root));
 }
});
