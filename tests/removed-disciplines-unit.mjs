import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {gunzipSync} from 'node:zlib';
import {JSDOM} from 'jsdom';

const read = file => fs.readFileSync(new URL('../'+file,import.meta.url),'utf8');
const retired = new Set(['trab','ptra','trabalho','ptrabalho','processual-trabalho','processo-trabalho','trabalhista']);
const jsonVariable = (file,name) => {
  const code = read(file);
  const start = code.indexOf(name+'=') + name.length + 1;
  assert.ok(start > name.length, name);
  return JSON.parse(code.slice(start).split(/;\s*(?:\n|<\/script>)/)[0]);
};
function evaluate(file,expression) {
  const context = vm.createContext({window:{}});
  vm.runInContext(read(file),context);
  return vm.runInContext(expression,context);
}

test('catálogo principal e objetivos mantêm as oito disciplinas atuais',()=>{
  const subjects = jsonVariable('central-structural-v66119/runtime.js','const SUBJECTS');
  assert.deepEqual(subjects.map(s=>s.id),['cf','adm','civil','cpc','penal','cpp','rlm']);
  assert.deepEqual(subjects.map(s=>s.topics.length),[15,20,15,20,17,16,16]);
  const catalog = evaluate('ui/study-objectives-catalog-v1.js','window.CentralStudyObjectiveCatalog');
  assert.equal(Object.keys(catalog.subjects).length,8);
  for(const goal of Object.values(catalog.goals)) {
    assert.ok(goal.subjectIds.every(id=>!retired.has(id)));
    assert.ok((goal.examSubjects||[]).every(s=>!retired.has(s.subjectId)));
  }
  const index = read('index.html');
  const tec = index.match(/<script id="tec-cadernos-data-v6655">([\s\S]*?)<\/script>/)[1];
  const data = vm.runInNewContext(tec+';window.TEC_CADERNOS_DATA',{window:{}});
  assert.ok(data.cadernos.length > 100);
  assert.ok(data.cadernos.every(item=>!retired.has(item.grupo)));
  assert.equal(data.vinculados,data.cadernos.length);
});

test('QC deixa de entregar cadernos das disciplinas removidas e conserva os totais',()=>{
  const map = JSON.parse(read('content/qc-sharing-links.json'));
  const js = evaluate('content/qc-sharing-links.js','window.QC_CENTRAL_SHARING_LINKS');
  assert.deepEqual(JSON.parse(JSON.stringify(js)),map);
  assert.ok(map.items.every(item=>!retired.has(item.disciplineKey)));
  assert.equal(map.counts.totalItems,map.items.length);
  const inventory = evaluate('content/qc-notebook-catalog.js','window.QC_NOTEBOOK_CATALOG');
  assert.ok(inventory.items.every(item=>!retired.has(item.candidateDisciplineKey)));
  assert.equal(inventory.total,inventory.items.length);
  assert.equal(new Set(inventory.items.map(item=>item.id)).size,inventory.total);
});

test('Lei em Dia retém os itens e os módulos das matérias restantes',()=>{
  const context = vm.createContext({});
  vm.runInContext(read('tools/decorando-data-restantes.js'),context);
  const rows = vm.runInContext('DATA_RESTANTES',context);
  assert.equal(rows.length,214);
  assert.ok(rows.every(q=>!retired.has(q.discipline)));
  assert.deepEqual(Object.keys(vm.runInContext('TOPICS_RESTANTES',context)).sort(),['cpc','cpp','penal']);
  assert.ok(rows.every(q=>typeof q.question.answer==='boolean' && q.question.statement && q.parts.length));
  const index = evaluate('tools/decorando-data-modulos.js','CENTRAL_LAW_MODULES');
  assert.equal(index.modules.length,109);
  assert.ok(index.modules.concat(index.complement).every(m=>!retired.has(m.discipline)));
  assert.equal(Object.keys(index.disciplineAliases).length,0);
});

test('Vade Mecum remove CLT da busca, dos favoritos padrão e da base offline',()=>{
  const source = read('tools/vade.html');
  const data = JSON.parse(gunzipSync(Buffer.from(source.match(/id="vm-offline-law-data"[^>]*>([^<]+)/)[1],'base64')));
  assert.equal(data.clt,undefined);
  for(const law of ['cf','cc','cp','cpp','cpc','l9784','l14133'])assert.ok(data[law]);
  const groups = evaluate('tools/vade-pdf-catalog.js','window.VADE_PDF_GROUPS');
  assert.ok(groups.every(g=>!retired.has(g.id)));
  assert.ok(groups.every(g=>g.laws.every(l=>l.id!=='clt')));
  assert.doesNotMatch(source,/VM_MAIN_DEFAULT=[^;]*'clt'/);
});

test('cronograma e manifesto não apontam para os materiais excluídos',()=>{
  const plan = jsonVariable('tools/cronograma.html','const PLAN_DATA');
  assert.ok(Object.values(plan.catalog).every(t=>!retired.has(t.subjectId)));
  assert.ok(plan.tasks.every(t=>!retired.has(t.subjectId) && (!t.topicUid || plan.catalog[t.topicUid])));
  const manifest = JSON.parse(read('central-offline-files-v66172.json'));
  assert.ok(manifest.files.every(p=>!/(?:modules\/trabalho|content\/ptra|assets\/ptra|ui\/(?:central-trabalho|ptra-|trabalho-universal))/.test(p)));
  assert.ok(manifest.files.some(p=>p.includes('/ui/available-disciplines-v1.js')));
  assert.ok(read('sw.js').includes("var CACHE='central-"+manifest.build+"'"));
  assert.doesNotMatch(read('central-v119.html'), /content\/ptra|ui\/ptra-|modules\/trabalho/);
  for(const file of ['index.html','central-v119.html'])assert.doesNotMatch(read(file),/(?:src|href)=["'][^"']*(?:central-trabalho|ptra-native|ptra-reader|trabalho-universal)/);
});

test('destinos antigos são reconhecidos sem excluir dados das outras disciplinas',()=>{
  const api = evaluate('ui/available-disciplines-v1.js','window.CentralDisciplineAvailability');
  for(const value of ['trab','ptra','trab-m18','t:proc-trab-07','/modules/trabalho/native/reader.html?modulo=01','Direito do Trabalho • Módulo 1','Direito Processual do Trabalho'])assert.equal(api.isRemoved(value),true,value);
  for(const value of ['cf','civil','cpc-m03','Direitos sociais e trabalho','Direito Civil • Prestação de serviço'])assert.equal(api.isRemoved(value),false,value);
  assert.equal(api.isRemovedRecord({url:'folder:decorando',opts:{discipline:'ptra'}}),true);
  assert.equal(api.isRemovedRecord({subject:'cf',module:'cf-m03'}),false);
});

test('Central de Questões ignora inclusive mapas antigos carregados no navegador',async()=>{
  const dom = new JSDOM('<div class="workspace"><section id="homeView" class="view"></section></div><span id="crumb"></span>',{url:'https://preview.example.test/central-de-questoes',runScripts:'outside-only',pretendToBeVisual:true});
  const w=dom.window;
  w.scrollTo=()=>{};
  w.BASE_COMPLETA_USER={id:'ficticio',role:'aluno'};
  w.fetch=async()=>({ok:true,json:async()=>({canManage:false,overrides:[]})});
  w.QC_CENTRAL_SHARING_LINKS={items:[
    {status:'VALIDADO',public:true,id:'old-labor',quantity:10,link:'https://www.qconcursos.com/questoes?notebook_ids%5B%5D=old-labor',disciplineKey:'trabalho',code:'M01',title:'Antigo'},
    {status:'VALIDADO',public:true,id:'keep-civil',quantity:10,link:'https://www.qconcursos.com/questoes?notebook_ids%5B%5D=keep-civil',disciplineKey:'civil',code:'M01',title:'Pessoa natural'}
  ]};
  w.document.addEventListener=()=>{};
  w.eval(read('ui/external-question-filters-v1.js'));
  const filters=w.ExternalQuestionFilters.buildRegistry();
  assert.ok(filters.some(f=>f.id==='keep-civil'));
  assert.ok(filters.every(f=>!retired.has(f.disciplineKey)));
  dom.window.close();
});

test('o edital oficial do TRT8 continua completo e a interface mostra as matérias atuais',()=>{
  const official = JSON.parse(read('content/trt8-2026-verticalized.json'));
  assert.equal(official.subjects.length,12);
  assert.ok(official.subjects.some(s=>s.disciplineId==='trab'));
  assert.ok(official.subjects.some(s=>s.disciplineId==='ptra'));
  assert.match(read('ui/exam-verticalized-v1.js'),/visibleSubjects\(\)\.map/);
  assert.match(read('ui/exam-verticalized-v1.js'),/Visualização parcial/);
});
