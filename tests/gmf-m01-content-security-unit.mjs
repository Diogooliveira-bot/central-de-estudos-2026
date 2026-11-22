import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {protectedAsset} from '../lib/protected-content.js';
import {validarModulo, DISCIPLINAS, MODULOS} from '../tools/questoes-lib.mjs';
import {loadModule, projectStatement} from '../lib/questoes-handler.js';

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

test('Integração não oferece aula M02-MXX inexistente nem expõe material premium pelo cliente', () => {
  const client=read('ui/gmf-disciplines-v1.js');
  const reader=read('ui/gmf-reader-v1.js');
  const html=read('index.html');
  assert.match(client, /module\.id === 'm01'/);
  assert.match(client, /BCQuestoesArea\?\.openModule/);
  assert.match(reader,/\/api\/private-content\?asset=/);
  assert.doesNotMatch(reader,/\/content\/gmf\/m01-full-v1\.js\?v=/);
  assert.ok(html.includes('/ui/gmf-reader-v1.js?v=20261121gmfM01'));
});
