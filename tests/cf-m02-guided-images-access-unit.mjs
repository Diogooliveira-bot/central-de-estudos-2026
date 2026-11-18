import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { contentEditorReadFeature } from '../lib/content-editor-access.js';

test('revisão guiada M02 de Constitucional no endereço principal é gratuita', () => {
  assert.equal(contentEditorReadFeature('reader:19fwys4'), 'theory.summary');
});

test('revisões guiadas com URL histórica também são gratuitas', () => {
  assert.equal(contentEditorReadFeature('reader:hvcy9i'), 'theory.summary');
});

test('teoria completa e IDs fora do catálogo continuam Premium', () => {
  assert.equal(contentEditorReadFeature('reader:1pljajr'), 'theory.complete');
  assert.equal(contentEditorReadFeature('reader:outroconteudo'), 'theory.complete');
});

test('GET de imagem aplica a mesma classificação de acesso do módulo', () => {
  const source = readFileSync(new URL('../lib/content-image-handler.js', import.meta.url), 'utf8');
  assert.match(source, /contentEditorReadFeature\(rows\[0\]\.content_id\)/);
  assert.match(source, /await requireSession\(req, \['admin', 'editor', 'aluno'\]\)/);
  assert.doesNotMatch(source, /requirePlanFeature\(req, 'theory.complete'/);
});