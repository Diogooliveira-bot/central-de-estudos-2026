import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { adminSummaryScript, cppSummaryScript, projectFreeSummary, projectPackedSummary, protectedAsset } from '../lib/protected-content.js';

test('protects premium static assets and preserves free Vade Mecum', async () => {
  for (const path of [
    '/adm-m9-m20-bundle-v66160.js',
    '/content/civil/m01-native-data.js',
    '/content/cpc/m08-native-data-part1.js',
    '/content/penal/m01-teoria-guiada-data.js',
    '/penal-full-theory-data-01.js',
    '/content/qc-notebook-catalog.js',
    '/content/qc-sharing-links.json',
    '/content/penal-cpp-tec-links.js',
    '/content/tec-cadernos-data.js',
    '/content/adm/adm-sharing-links.js',
    '/content/civil/civil-sharing-links.js',
    '/content/cpp/cpp-native-index.js',
    '/content/civil/civil-native-content-packed.js',
    '/content/cpp/cpp-native-content-packed.js',
    '/content/cf/editorial/m01-apostila.txt',
    '/content/rlm-tjce-2026/aulas-logica.js',
    '/cpp-course-core-v1.js',
    '/Central_de_Estudos_v6.6.75_PLANO_6_MESES.zip',
    '/Central_de_Estudos_OFFLINE_FUNCIONAL/modules/trabalho/AJAJ_DIREITO_TRABALHO.pdf',
    '/assets/revisao-premium.pdf',
  ]) assert.ok(protectedAsset(path), `${path} must be protected`);
  assert.equal(protectedAsset('/assets/vademecum-pdf/cf.pdf'), null);
  assert.equal(protectedAsset('/content/ptra/m01-native-data.js'), null);
  const mainHtml = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.doesNotMatch(mainHtml, /https?:\/\/(?:www\.)?(?:tecconcursos|qconcursos)\.com/i);
  assert.match(mainHtml, /Conhecer o Premium/);
});

test('free theory projection drops paid content and keeps the summary', () => {
  const projected = projectFreeSummary({
    moduleId: 'm01', title: 'Módulo', summary: 'Resumo grátis', complete: 'teoria integral',
    questions: [{ secret: 'gabarito' }], internalQuestions: ['privado'], chapters: ['premium'],
  });
  assert.equal(projected.summary, 'Resumo grátis');
  assert.match(projected.complete, /exclusivo do Base Completa Premium/);
  assert.equal('questions' in projected, false);
  assert.equal('internalQuestions' in projected, false);
  assert.equal('chapters' in projected, false);
});

test('ADM and CPP summary projections omit full theory and question links', () => {
  const adm = adminSummaryScript({ m01: { uid: 'm01', title: 'A', number: 1, summaryHtml: '<p>Resumo</p>', completeAppendHtml: 'integral', completeSource: 'private.js' } });
  assert.match(adm, /Resumo/);
  assert.doesNotMatch(adm, /integral|private\.js/);
  const cpp = cppSummaryScript([{ num: 1, title: 'CPP', summary: 'Resumo', sections: ['privado'], tecUrl: 'https://example.test' }]);
  assert.match(cpp, /Resumo/);
  assert.doesNotMatch(cpp, /privado|example\.test/);
});

test('packed Civil/CPP free projection retains summary only, without question banks', () => {
  const projected = projectPackedSummary({ module: { uid: 'm01', title: 'Civil', summaryHtml: '<p>Resumo</p>', completeHtml: 'Completo', summaryQuestions: [{ answer: 'A' }], tec: ['url'] } });
  assert.equal(projected.module.summaryHtml, '<p>Resumo</p>');
  assert.match(projected.module.completeHtml, /exclusivo do Base Completa Premium/);
  assert.deepEqual(projected.module.summaryQuestions, []);
  assert.deepEqual(projected.module.completeQuestions, []);
  assert.equal('tec' in projected.module, false);
});

test('public offline manifest has no premium assets', async () => {
  const manifest = JSON.parse(await readFile(new URL('../central-offline-files-v66172.json', import.meta.url), 'utf8'));
  const worker = await readFile(new URL('../sw.js', import.meta.url), 'utf8');
  const boot = await readFile(new URL('../central-v119.html', import.meta.url), 'utf8');
  assert.match(worker, new RegExp(`var CACHE='central-${manifest.build}'`));
  assert.match(boot, new RegExp(`var BUILD='${manifest.build}'`));
  const protectedFiles = (manifest.files || []).map(file => String(file).split(/[?#]/)[0]).filter(file => protectedAsset(file));
  assert.deepEqual(protectedFiles, []);
});

test('service worker recognizes protected resources and keeps logout purge scoped', async () => {
  const source = await readFile(new URL('../sw.js', import.meta.url), 'utf8');
  const context = { URL, Response, caches: {}, self: { location: { origin: 'https://unit.test' }, addEventListener() {} } };
  vm.runInNewContext(source, context, { timeout: 500 });
  assert.equal(context.protectedContentPath('/content/civil/m01-native-data.js'), true);
  assert.equal(context.protectedContentPath('/content/cpc/m08-native-data-part1.js'), true);
  assert.equal(context.protectedContentPath('/content/penal/m01-teoria-guiada-data.js'), true);
  assert.equal(context.protectedContentPath('/content/civil/civil-native-content-packed.js'), true);
  assert.equal(context.protectedContentPath('/Central_de_Estudos_v6.6.75_PLANO_6_MESES.zip'), true);
  assert.equal(context.protectedContentPath('/assets/vademecum-pdf/cf.pdf'), false);
  assert.equal(context.protectedContentPath('/assets/revisao.pdf'), true);
  assert.match(source, /purgeProtectedOfflineContent/);
  assert.doesNotMatch(source, /localStorage\.clear\(\)|indexedDB\.deleteDatabase/);
});
