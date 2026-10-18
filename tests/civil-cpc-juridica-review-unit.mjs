import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { gunzipSync } from 'node:zlib';
import test from 'node:test';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

async function loadCivil() {
  const source = await read('content/civil/civil-native-content-packed.js');
  const match = source.match(/["']([A-Za-z0-9+/=]+)["']/);
  assert(match, 'payload compactado de Civil não encontrado');
  return JSON.parse(gunzipSync(Buffer.from(match[1], 'base64')).toString('utf8'));
}

async function loadCpc(moduleNumber) {
  const id = String(moduleNumber).padStart(2, '0');
  const source = await read(`content/cpc/m${id}-native-data.js`);
  const context = { window: {} };
  vm.runInNewContext(source, context);
  return context.window.BASE_NATIVE_CONTENT.cpc[`m${id}`];
}

test('revisão cobre os 15 módulos de Civil e os 20 módulos de Processo Civil', async () => {
  const civil = await loadCivil();
  assert.equal(Object.keys(civil).length, 15);

  for (let number = 1; number <= 15; number += 1) {
    const module = civil[`civil-m${String(number).padStart(2, '0')}`];
    assert(module?.summaryHtml?.length > 500, `resumo Civil M${number} ausente`);
    assert(module?.completeHtml?.length > 1_000, `teoria completa Civil M${number} ausente`);
    assert.equal(module.summaryQuestions.length, 5, `questões resumidas Civil M${number}`);
    assert.equal(module.completeQuestions.length, 10, `questões completas Civil M${number}`);
  }

  for (let number = 1; number <= 20; number += 1) {
    const module = await loadCpc(number);
    assert(module?.summary?.length > 1_000, `resumo CPC M${number} ausente`);
    assert(module?.complete?.length > 2_000, `teoria completa CPC M${number} ausente`);
  }
});

test('textos visíveis não contêm caracteres de controle que quebrem palavras', async () => {
  const civil = await loadCivil();
  const texts = Object.values(civil).flatMap((module) => [module.summaryHtml, module.completeHtml]);

  for (let number = 1; number <= 20; number += 1) {
    const module = await loadCpc(number);
    texts.push(module.summary, module.complete);
  }

  for (const text of texts) {
    assert.doesNotMatch(text, /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/);
    assert.doesNotMatch(text, /\uFFFD/);
  }
});

test('Civil apresenta com precisão o Tema 1.236/STF e a atualização do Tema 1.349/STJ', async () => {
  const civil = await loadCivil();
  const family = `${civil['civil-m14'].summaryHtml}\n${civil['civil-m14'].completeHtml}`;
  const property = `${civil['civil-m12'].summaryHtml}\n${civil['civil-m12'].completeHtml}`;

  assert.match(family, /autorização judicial no casamento/);
  assert.match(family, /escritura pública na união estável/);
  assert.match(family, /efeitos patrimoniais para o futuro/);
  assert.match(property, /Tema 1349\/STJ está afetado/);
  assert.match(property, /sem tese\s+final publicada/);
});

test('CPC contém o regime atual da ADC 80 e a vigência correta da Lei 15.479/2026', async () => {
  const gratuity = await loadCpc(4);
  const enforcement = await loadCpc(16);
  const gratuityText = `${gratuity.summary}\n${gratuity.complete}`;
  const enforcementText = `${enforcement.summary}\n${enforcement.complete}`;

  assert.match(gratuityText, /ADC 80/);
  assert.match(gratuityText, /R\$ 5\.000,00/);
  assert.match(gratuityText, /processos ajuizados desde 16\/9\/2026/);
  assert.match(gratuityText, /primeiro grau dos Juizados Especiais/);
  assert.match(enforcementText, /30\/07\/2027/);
  assert.doesNotMatch(enforcementText, /31\/07\/2027/);
});

test('carregadores e pacote offline apontam para a revisão jurídica atual', async () => {
  const [boot, shell, lazy, manifest, civilReader, exporter] = await Promise.all([
    read('central-v119.html'),
    read('index.html'),
    read('central-lazy-theory-v66119.js'),
    read('central-offline-files-v66172.json'),
    read('ui/civil-native-study-v1.js'),
    read('ui/module-text-export-v1.js'),
  ]);

  for (let number = 1; number <= 20; number += 1) {
    const id = String(number).padStart(2, '0');
    const reference = `content/cpc/m${id}-native-data.js?v=20261018cpcjur1`;
    assert(shell.includes(reference) || boot.includes(reference), `${reference}: fora do carregamento ativo`);
    assert(manifest.includes(`/${reference}`), `${reference}: fora do pacote offline`);
  }

  assert(lazy.includes('content/civil/civil-native-index.js?v=20261018civiljur1'));
  assert(lazy.includes('ui/civil-native-study-v1.js?v=20261018civiljur1'));
  assert(manifest.includes('/content/civil/civil-native-content-packed.js?v=20261018civiljur1'));
  assert(civilReader.includes('/content/civil/civil-native-content-packed.js?v=20261018civiljur1'));
  assert(exporter.includes('/content/civil/civil-native-content-packed.js?v=20261018civiljur1'));
});

