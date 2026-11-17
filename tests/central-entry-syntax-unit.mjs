import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Script } from 'node:vm';

for (const file of ['index.html', 'central-v119.html']) {
  test(file + ': todo JavaScript inline deve ter sintaxe valida', () => {
    const html = readFileSync(file, 'utf8');
    const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)];
    let checked = 0;
    for (const match of scripts) {
      const attrs = match[1] || '';
      const code = match[2] || '';
      if (/\bsrc\s*=/.test(attrs) || !code.trim()) continue;
      if (/\btype\s*=\s*["'](?:application\/json|application\/ld\+json|importmap)["']/.test(attrs)) continue;
      const line = html.slice(0, match.index).split('\n').length;
      try { new Script(code, { filename: file + ':' + line }); }
      catch (error) { assert.fail('JavaScript invalido em ' + file + ', linha ' + line + ': ' + error.message); }
      checked++;
    }
    assert.ok(checked > 0, 'Nenhum JavaScript inline encontrado em ' + file);
  });
}
