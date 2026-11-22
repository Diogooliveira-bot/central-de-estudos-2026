import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {protectedAsset} from '../lib/protected-content.js';
import {validarModulo, DISCIPLINAS, MODULOS} from '../tools/questoes-lib.mjs';
import {loadModule, projectStatement, GMF_QUESTIONS_ENABLED} from '../lib/questoes-handler.js';

const root = new URL('../', import.meta.url);
const read = name => readFileSync(new URL(name, root), 'utf8');
function execFile(name) {
  const sandbox = {window:{}};
  vm.runInNewContext(read(name), sandbox, {timeout:1000});
  return sandbox.window;
}
const ids=['atual','fortaleza','legesp','dh'];

test('M01: revisão autenticada e teoria premium nunca compõem arquivos públicos', () => {
  assert.deepEqual(protectedAsset('/content/gmf/m01-review-v1.js'),
    {kind:'file',feature:'theory.summary'});
  assert.deepEqual(protectedAsset('/content/gmf/m01-full-v1.js'),
    {kind:'file',feature:'theory.complete'});
  for (const disc of ids) assert.ok(MODULOS[disc]>=4&&DISCIPLINAS[disc]);
  assert.match(read('scripts/build-vercel-output.mjs'), /protectedAsset/);
});

test('M01: 4 teorias e 4 revisões com fontes e capítulos em todos os casos', () => {
  const full=execFile('content/gmf/m01-full-v1.js').GMF_M01_FULL;
  const review=execFile('content/gmf/m01-review-v1.js').GMF_M01_REVIEW;
  assert.deepEqual(Object.keys(full).sort(),ids.slice().sort());
  assert.deepEqual(Object.keys(review).sort(),ids.slice().sort());
  for(const disc of ids){
    assert.ok(full[disc].chapters.length>=4);
    assert.ok(review[disc].chapters.length>=3);
    assert.ok(full[disc].resources.length>0);
    for(const c of full[disc].chapters.concat(review[disc].chapters)){
      assert.ok(c.title.length>=8);
      assert.ok(c.html.length>=160);
      assert.match(c.html, /<p>/);
      assert.doesNotMatch(c.html, /<script|onerror=|javascript:/i);
    }
    assert.ok(full[disc].resources.every(r=>r.url.startsWith('https://')));
  }
});

test('Atualidades M02-M06: materiais separados e assets protegidos por modalidade', () => {
  const moduleIds=['m02','m03','m04','m05','m06'];
  for(const module of moduleIds){
    const full=execFile('content/gmf/atual/'+module+'-full-v1.js').GMF_MODULE_FULL;
    const review=execFile('content/gmf/atual/'+module+'-review-v1.js').GMF_MODULE_REVIEW;
    assert.equal(full.subject,'atual');assert.equal(full.module,module);
    assert.equal(review.subject,'atual');assert.equal(review.module,module);
    assert.ok(full.chapters.length>=4);assert.ok(review.chapters.length>=3);
    assert.ok(full.resources.length>=3);assert.ok(review.resources.length>=3);
    for(const chapter of [...full.chapters,...review.chapters]){
      assert.ok(chapter.html.length>=160);
      assert.match(chapter.html,/<p>/);
      assert.doesNotMatch(chapter.html,/<script|onerror=|javascript:/i);
    }
    assert.deepEqual(protectedAsset('/content/gmf/atual/'+module+'-full-v1.js'),{kind:'file',feature:'theory.complete'});
    assert.deepEqual(protectedAsset('/content/gmf/atual/'+module+'-review-v1.js'),{kind:'file',feature:'theory.summary'});
  }
});
test('Fortaleza M02-M09: teoria, revisão, fontes e política privada', () => {
  for(let n=2;n<=9;n++){
    const module='m'+String(n).padStart(2,'0');
    const full=execFile('content/gmf/fortaleza/'+module+'-full-v1.js').GMF_MODULE_FULL;
    const review=execFile('content/gmf/fortaleza/'+module+'-review-v1.js').GMF_MODULE_REVIEW;
    assert.equal(full.subject,'fortaleza');assert.equal(full.module,module);
    assert.equal(review.subject,'fortaleza');assert.equal(review.module,module);
    assert.ok(full.chapters.length>=4);assert.ok(review.chapters.length>=3);
    assert.ok(full.resources.length>=2);assert.ok(review.resources.length>=2);
    for(const c of [...full.chapters,...review.chapters]){
      assert.ok(c.html.length>=160);assert.match(c.html,/<p>/);
      assert.doesNotMatch(c.html,/<script|onerror=|javascript:/i);
    }
    assert.deepEqual(protectedAsset('/content/gmf/fortaleza/'+module+'-full-v1.js'),{kind:'file',feature:'theory.complete'});
    assert.deepEqual(protectedAsset('/content/gmf/fortaleza/'+module+'-review-v1.js'),{kind:'file',feature:'theory.summary'});
  }
});
test('Legislação Extravagante M02-M11: materiais e permissões protegidas', () => {
  for(let n=2;n<=11;n++){
    const module='m'+String(n).padStart(2,'0');
    const full=execFile('content/gmf/legesp/'+module+'-full-v1.js').GMF_MODULE_FULL;
    const review=execFile('content/gmf/legesp/'+module+'-review-v1.js').GMF_MODULE_REVIEW;
    assert.equal(full.subject,'legesp');assert.equal(full.module,module);
    assert.equal(review.subject,'legesp');assert.equal(review.module,module);
    assert.ok(full.chapters.length>=4);assert.ok(review.chapters.length>=3);
    assert.ok(full.resources.length>=1);assert.ok(review.resources.length>=1);
    for(const c of [...full.chapters,...review.chapters]){
      assert.ok(c.html.length>=160);assert.match(c.html,/<p>/);
      assert.doesNotMatch(c.html,/<script|onerror=|javascript:/i);
    }
    assert.deepEqual(protectedAsset('/content/gmf/legesp/'+module+'-full-v1.js'),{kind:'file',feature:'theory.complete'});
    assert.deepEqual(protectedAsset('/content/gmf/legesp/'+module+'-review-v1.js'),{kind:'file',feature:'theory.summary'});
  }
});
test('Direitos Humanos M02-M04: teoria completa, revisão própria e acesso protegido', () => {
  for(let n=2;n<=4;n++){
    const module='m'+String(n).padStart(2,'0');
    const full=execFile('content/gmf/dh/'+module+'-full-v1.js').GMF_MODULE_FULL;
    const review=execFile('content/gmf/dh/'+module+'-review-v1.js').GMF_MODULE_REVIEW;
    assert.equal(full.subject,'dh');assert.equal(full.module,module);
    assert.equal(review.subject,'dh');assert.equal(review.module,module);
    assert.ok(full.chapters.length>=4);assert.ok(review.chapters.length>=3);
    assert.ok(full.resources.length>=1);assert.ok(review.resources.length>=1);
    for(const c of [...full.chapters,...review.chapters]){
      assert.ok(c.html.length>=160);assert.match(c.html,/<p>/);
      assert.doesNotMatch(c.html,/<script|onerror=|javascript:/i);
    }
    assert.deepEqual(protectedAsset('/content/gmf/dh/'+module+'-full-v1.js'),{kind:'file',feature:'theory.complete'});
    assert.deepEqual(protectedAsset('/content/gmf/dh/'+module+'-review-v1.js'),{kind:'file',feature:'theory.summary'});
  }
  const catalog=execFile('content/gmf/course-catalog-v1.js').GmfCourseCatalog;
  assert.deepEqual(Array.from(catalog.availableModules.dh),['m01','m02','m03','m04']);
});

test('40 exercícios preliminares preservados, mas bloqueados pela API da GMF', () => {
  assert.equal(GMF_QUESTIONS_ENABLED,false);
  const handler=read('lib/questoes-handler.js');
  assert.equal((handler.match(/GMF_DISCIPLINES\.has\(mod\.disc\) && !GMF_QUESTIONS_ENABLED/g)||[]).length,2);
});

test('40 questões inéditas validadas pela rotina oficial e índices consistentes', () => {
  const index=execFile('content/questoes/index.js');
  const titles=execFile('content/questoes/titulos.js');
  const allIds=new Set();
  for(const disc of ids){
    const qs=execFile('content/questoes/'+disc+'/m01.js').BC_QUESTOES[disc][1];
    assert.equal(qs.length,10,disc);
    assert.deepEqual(validarModulo(disc,1,qs),[],disc);
    for(const item of qs){assert.equal(allIds.has(item.id),false,item.id);allIds.add(item.id)}
    assert.deepEqual(Array.from(index.BC_QUESTOES_INDICE[disc]),[1],disc);
    assert.equal(index.BC_QUESTOES_QTD[disc][1],10,disc);
    assert.ok(titles.BC_QUESTOES_TITULOS[disc][1],disc);
  }
  assert.equal(allIds.size,40);
});

test('API nunca entrega gabarito ou comentário na consulta pública', async () => {
  for(const disc of ids){
    const q=await loadModule(disc,1,new URL('../',import.meta.url).pathname.replace(/\/$/,''));
    assert.equal(q.length,10,disc);
    const publicView=projectStatement(q[0]);
    assert.equal(Object.hasOwn(publicView,'answer'),false);
    assert.equal(Object.hasOwn(publicView,'explanation'),false);
    assert.equal(Object.hasOwn(publicView,'lawRef'),false);
  }
  assert.match(read('lib/questoes-handler.js'), /\{2,12\}/);
});

test('Integração lista os 30 módulos e carrega teoria pela API privada', () => {
  const client=read('ui/gmf-disciplines-v1.js');
  const reader=read('ui/gmf-course-reader-v2.js');
  const html=read('index.html');
  const catalog=execFile('content/gmf/course-catalog-v1.js').GmfCourseCatalog;
  const counts={atual:6,fortaleza:9,legesp:11,dh:4};
  for(const [id,count] of Object.entries(counts)){
    assert.equal(catalog.subjects.find(x=>x.id===id).modules.length,count);
    assert.equal(catalog.availableModules[id].length,count);
  }
  assert.match(client,/availableModules/);
  assert.ok(!client.includes('data-gmf-action="questions"'));
  assert.ok(!client.includes('BCQuestoesArea?.openModule'));
  assert.match(client,/Questões do módulo — Em preparação/);
  assert.ok(reader.includes('/api/private-content?asset='));
  assert.match(reader,/CentralPlanAccess/);
  assert.match(reader,/localStorage/);
  assert.match(reader,/data-mark/);
  assert.ok(html.includes('gmf-course-reader-v2.js'));
});
