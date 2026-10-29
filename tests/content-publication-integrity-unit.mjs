import test from 'node:test';
import assert from 'node:assert/strict';
import {access,readFile} from 'node:fs/promises';
import vm from 'node:vm';
import zlib from 'node:zlib';

const root=new URL('../',import.meta.url);
const read=path=>readFile(new URL(path,root),'utf8');

test('CPC M08 instala o conteúdo integral e encerra o carregamento',async()=>{
 const source=await read('content/cpc/m08-native-data.js');
 assert.match(source,/g\.BASE_NATIVE_CONTENT\.cpc\.m08=/);
 assert.match(source,/g\.__M08Installed=true/);
 assert.ok(source.length>20000,'o arquivo integral do M08 não pode ser substituído pelo fragmento curto');
 const boot=await read('central-v119.html');
 assert.match(boot,/content\/cpc\/m08-native-data\.js\?v=20261018cpcjur1/);
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

test('CPC M18-M20 preserva cinco questões resumidas, dez completas e mapa acessível',async()=>{
 for(let n=18;n<=20;n++){
  const source=await read(`cpc-study-m${n}-lite.js`);
  const window={addEventListener(){}};
  const context={window,document:{readyState:'loading',addEventListener(){}},localStorage:{getItem(){return null}},setTimeout(){},console};
  vm.runInNewContext(source.replace('function J(k)','window.__auditQuestions=QUESTIONS;function J(k)'),context);
  const questions=window.__auditQuestions;
  assert.equal(questions?.summary.length,5,`CPC M${n} resumo`);
  assert.equal(questions?.complete.length,10,`CPC M${n} completo`);
  for(const q of [...questions.summary,...questions.complete]){
   assert.equal(q.o.length,4,`CPC M${n}: ${q.q}`);
   assert.ok(Number.isInteger(q.a)&&q.a>=0&&q.a<q.o.length,`CPC M${n}: ${q.q}`);
   assert.ok(q.e?.trim(),`CPC M${n}: explicação ausente`);
  }
  assert.match(source,new RegExp(`tools/cpc-m${n}-mapa\\.html`));
  await access(new URL(`tools/cpc-m${n}-mapa.html`,root));
 }
});

test('gerador de progresso localiza a declaraÃ§Ã£o CPC_WEEKS e carrega sua fonte de questÃµes',async()=>{
 const builder=await read('scripts/build-home-progress.mjs');
 assert.match(builder,/lastIndexOf\('const CPC_WEEKS='\)/);
 assert.match(builder,/run\('content\/cpc\/cpc-fixation-questions-v1\.js'\)/);
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

test('pacote CPP contém 22 pares de teoria com 5 e 10 exercícios reais',async()=>{
 const source=await read('content/cpp/cpp-native-content-packed.js');
 const packed=source.match(/"([A-Za-z0-9+/=]{100,})"/);
 assert.ok(packed,'pacote comprimido CPP ausente');
 const modules=JSON.parse(zlib.gunzipSync(Buffer.from(packed[1],'base64')).toString('utf8'));
 assert.equal(Object.keys(modules).length,22);
 for(let n=1;n<=22;n++){
  const id=`cpp-m${String(n).padStart(2,'0')}`,m=modules[id];
  assert.ok(m?.summaryHtml?.length>1000&&m?.completeHtml?.length>1000,id);
  assert.equal((m.summaryHtml.match(/Ver gabarito e explicação/g)||[]).length,5,`${id} resumo`);
  assert.equal((m.completeHtml.match(/Gabarito:/g)||[]).length,10,`${id} completo`);
 }
 await access(new URL('assets/cpp/infograficos.webp',root));
});

test('metadados de Português refletem as unidades existentes em M01 e M13',async()=>{
 const source=await read('portugues-site.js');
 assert.match(source,/"id":"m01"[^\n]+"lessons":29/);
 assert.match(source,/"id":"m13"[^\n]+"lessons":35/);
});

test('manifesto offline só referencia arquivos publicados',async()=>{
 const manifest=JSON.parse(await read('central-offline-files-v66172.json'));
 assert.match(manifest.build,/^20\d{6}-[a-z0-9-]+$/,'manifesto precisa informar uma versão de build válida');
 const central=await read('central-v119.html');
 const worker=await read('sw.js');
 assert.ok(central.includes(`var BUILD='${manifest.build}'`));
 assert.ok(worker.includes(`var CACHE='central-${manifest.build}'`));
 for(const asset of ["/content/cpc/cpc-sharing-links.js?v=20261010cpcsharing1","/ui/cpc-sharing-links.js?v=20261010cpcsharing1","/content/qc-sharing-links.json?v=20261023-remove-labor-disciplines-v1","/content/qc-sharing-links.js?v=20261023-remove-labor-disciplines-v1","/content/qc-notebook-catalog.js?v=20261023-remove-labor-disciplines-v1","/ui/qc-sharing-links.js?v=20261020qcm173p1"]) assert.ok(!manifest.files.includes(asset),`conteúdo premium não pode ser pré-carregado: ${asset}`);
 for(const entry of manifest.files){
  if(!entry.startsWith('/')||entry.startsWith('//'))continue;
  const path=entry.slice(1).split(/[?#]/,1)[0];
  await access(new URL(path,root));
 }
});

