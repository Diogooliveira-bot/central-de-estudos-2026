import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Script } from 'node:vm';

for (const file of ['index.html', 'central-v119.html']) {
  test(file + ': todo JavaScript inline deve ter sintaxe valida', () => {
    const html = readFileSync(file, 'utf8');
    const lower = html.toLowerCase();
    let cursor = 0, checked = 0;
    while (cursor < html.length) {
      const start = lower.indexOf('<script', cursor);
      if (start < 0) break;
      const boundary = lower.charAt(start + 7);
      if (boundary && !/\s|>/.test(boundary)) { cursor = start + 7; continue; }
      const tagEnd = lower.indexOf('>', start + 7);
      assert.ok(tagEnd >= 0, file + ': tag script sem fechamento');
      const closeStart = lower.indexOf('</script', tagEnd + 1);
      assert.ok(closeStart >= 0, file + ': script sem tag final');
      const closeEnd = lower.indexOf('>', closeStart + 8);
      assert.ok(closeEnd >= 0, file + ': fechamento de script incompleto');
      const attrs = html.slice(start + 7, tagEnd);
      const code = html.slice(tagEnd + 1, closeStart);
      cursor = closeEnd + 1;
      if (/\bsrc\s*=/.test(attrs) || !code.trim()) continue;
      if (/\btype\s*=\s*["'](?:application\/json|application\/ld\+json|importmap)["']/.test(attrs)) continue;
      const line = html.slice(0, start).split('\n').length;
      try { new Script(code, { filename: file + ':' + line }); }
      catch (error) { assert.fail('JavaScript invalido em ' + file + ', linha ' + line + ': ' + error.message); }
      checked++;
    }
    assert.ok(checked > 0, 'Nenhum JavaScript inline encontrado em ' + file);
  });
}
