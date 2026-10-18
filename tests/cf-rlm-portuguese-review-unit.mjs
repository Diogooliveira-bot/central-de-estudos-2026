import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';
import zlib from 'node:zlib';

const root = path.resolve(import.meta.dirname, '..');
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');

function constitutionalCourse() {
  const window = { BASE_NATIVE_CONTENT: { cf: {} } };
  const context = vm.createContext({ window });
  for (let number = 1; number <= 15; number += 1) {
    const id = `m${String(number).padStart(2, '0')}`;
    vm.runInContext(read(`content/cf/${id}-native-data.js`), context);
  }
  return window.BASE_NATIVE_CONTENT.cf;
}

function rlmCourse() {
  const window = {};
  const context = vm.createContext({ window, URL });
  for (const name of ['estrutura', 'aulas-logica', 'aulas-raciocinio', 'aulas-matematica', 'aulas-estatistica', 'complementos-teoria']) {
    vm.runInContext(read(`content/rlm-tjce-2026/${name}.js`), context);
  }
  return window.RLM_CURSO_AULAS;
}

test('CF mantém os 15 módulos e incorpora as ECs 138 a 141 nos pontos afetados', () => {
  const course = constitutionalCourse();
  assert.deepEqual(Object.keys(course), Array.from({ length: 15 }, (_, index) => `m${String(index + 1).padStart(2, '0')}`));
  for (const [id, module] of Object.entries(course)) {
    assert.ok(module.summary.length > 4000, `${id} precisa manter a teoria resumida`);
    assert.ok(module.complete.length > 7000, `${id} precisa manter a teoria completa`);
  }

  const m03 = `${course.m03.summary}\n${course.m03.complete}`;
  assert.match(m03, /EC 141\/2026/);
  assert.match(m03, /8h\/40h/);
  assert.match(m03, /44→42→40/);
  assert.doesNotMatch(m03, /jornada 8h\/44h|até 8h diárias e 44h semanais/);

  const m05 = `${course.m05.summary}\n${course.m05.complete}`;
  assert.match(m05, /EC 138\/2025/);
  assert.match(m05, /outro (?:cargo )?de qualquer natureza/);
  assert.match(m05, /EC 140\/2026/);
  assert.doesNotMatch(m05, /professor \+ técnico\/científico|professor com outro técnico ou científico/);

  const m07 = `${course.m07.summary}\n${course.m07.complete}`;
  assert.match(m07, /EC 139\/2026/);
  assert.match(m07, /permanentes e essenciais/);
  assert.match(m07, /veda(?:da)? (?:a )?extinção, (?:a )?criação ou (?:a )?instalação/);

  const m14 = `${course.m14.summary}\n${course.m14.complete}`;
  assert.match(m14, /EC 140\/2026/);
  assert.match(m14, /57 anos para mulheres e 60 para homens/);
  assert.match(m14, /25 anos de contribuição e de efetivo exercício/);
});

test('correções ortográficas confirmadas de CF e RLM permanecem aplicadas', () => {
  const course = constitutionalCourse();
  assert.doesNotMatch(course.m04.complete, /superveniente\s+superveniente/);
  assert.doesNotMatch(course.m09.complete, /Maioria absoluta absoluta/);
  assert.doesNotMatch(read('content/rlm-tjce-2026/aulas-raciocinio.js'), /\.\.\. \./);
});

test('RLM preserva M02–M15, teoria, resumo e questões', () => {
  const course = rlmCourse();
  assert.deepEqual(Object.keys(course), Array.from({ length: 14 }, (_, index) => `M${String(index + 2).padStart(2, '0')}`));
  for (const [id, module] of Object.entries(course)) {
    assert.equal(module.theory.length, 5, `${id} precisa manter cinco capítulos`);
    assert.ok(module.summary.length >= 5, `${id} precisa manter o resumo`);
    assert.equal(module.questions.length, 10, `${id} precisa manter as dez questões autorais`);
  }
});

test('Português preserva M01–M24 e revisão sem corrupção de caracteres', () => {
  const encoded = read('portugues-autodidata-data.txt').trim();
  const modules = JSON.parse(zlib.gunzipSync(Buffer.from(encoded, 'base64')).toString('utf8'));
  assert.deepEqual(Object.keys(modules), [...Array.from({ length: 24 }, (_, index) => `m${String(index + 1).padStart(2, '0')}`), 'review']);
  for (const [id, markup] of Object.entries(modules)) {
    assert.ok(markup.length > 20000, `${id} não pode perder o conteúdo atual`);
    assert.doesNotMatch(markup, /�|Ã[\u0080-\u00bf]|Â[\u0080-\u00bf]|â€|ðŸ/);
  }
});

test('carregadores ativos apontam para a revisão e o manifesto offline acompanha CF', () => {
  const index = read('index.html');
  const manifest = JSON.parse(read('central-offline-files-v66172.json'));
  for (const id of ['m03', 'm04', 'm05', 'm07', 'm09', 'm14']) {
    const asset = `/content/cf/${id}-native-data.js?v=20261018cfjur1`;
    assert.ok(index.includes(`src="${asset}"`), id);
    assert.ok(manifest.files.includes(asset), id);
  }
  assert.ok(index.includes('/content/rlm-tjce-2026/aulas-raciocinio.js?v=20261018ort1'));
});
