import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// Regressão: um texto de ferramenta ("Warning: truncated output…") foi parar na primeira linha do index.html
// e apareceu no topo da Central em produção. Páginas públicas devem começar com a declaração HTML.
for (const file of ['index.html', 'central-v119.html', 'login.html']) {
  test(`${file} começa com <!doctype html> e não contém texto de ferramenta`, () => {
    const text = readFileSync(file, 'utf8');
    assert.match(text.trimStart().slice(0, 30), /^<!doctype html>/i, 'primeira linha');
    assert.doesNotMatch(text, /^Warning: truncated output/m);
    assert.doesNotMatch(text, /^Total output lines: \d+/m);
  });
}

test('index.html preserva a estrutura da Central e não contém saída truncada', () => {
  const html = readFileSync('index.html', 'utf8');
  for (const required of [
    /<head\b/i, /<\/head>/i, /<body\b/i, /<\/body>/i,
    /id="appRoot"/, /id="homeView"/, /id="centralSidebar"/
  ]) assert.match(html, required, 'estrutura principal deve permanecer no HTML');
  assert.doesNotMatch(html, /tokens truncated|Warning: truncated output|Total output lines:/i);
  assert.ok((html.match(/<script\b/gi) || []).length > 90, 'scripts da estrutura devem existir');
});
