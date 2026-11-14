import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';

const FILES = ['ui/mascote-v1.css', 'ui/study-objectives-v1.js', 'ui/questoes-area-v1.js', 'tools/vade.html', 'tools/decorando.html'];

test('todo mascote referenciado existe, é WebP pequeno e é decorativo', () => {
  const used = new Set();
  for (const f of FILES) {
    const src = readFileSync(f, 'utf8');
    for (const m of src.matchAll(/\/assets\/mascote\/mascote-([a-z0-9-]+)(?:\.webp|'\s*\+)/g)) used.add(m[1]);
    for (const m of src.matchAll(/mascote\('([a-z0-9-]+)'\)|'(comemorando-2|joinha|erros)'/g)) used.add(m[1] || m[2]);
  }
  assert.ok(used.size >= 8, 'mascote usado em vários pontos');
  for (const pose of used) {
    const file = `assets/mascote/mascote-${pose}.webp`;
    assert.ok(existsSync(file), `${file} existe`);
    assert.ok(statSync(file).size < 90 * 1024, `${file} leve`);
    assert.equal(readFileSync(file).subarray(0, 4).toString(), 'RIFF');
  }
  const all = readdirSync('assets/mascote').filter(n => n.endsWith('.webp'));
  assert.equal(all.length, 18);
  for (const f of ['ui/study-objectives-v1.js', 'ui/questoes-area-v1.js', 'tools/vade.html', 'tools/decorando.html']) {
    const src = readFileSync(f, 'utf8');
    for (const m of src.matchAll(/<img[^>]*mascote[^>]*>/g)) {
      assert.match(m[0], /alt=""/, `${f}: mascote sem texto alternativo (decorativo)`);
      assert.match(m[0], /aria-hidden="true"/);
    }
  }
});

test('mascote é carregado no bootstrap e no pacote offline, sem capturar cliques', () => {
  const boot = readFileSync('central-v119.html', 'utf8');
  const offline = JSON.parse(readFileSync('central-offline-files-v66172.json', 'utf8')).files;
  assert.ok(boot.includes('/ui/mascote-v1.css?v=20261114mascote1'));
  assert.ok(offline.includes('/ui/mascote-v1.css?v=20261114mascote1'));
  for (const pose of ['sentado-lendo', 'checklist', 'livros', 'apontando', 'boas-vindas']) {
    assert.ok(offline.includes(`/assets/mascote/mascote-${pose}.webp`), pose);
  }
  const css = readFileSync('ui/mascote-v1.css', 'utf8');
  for (const m of css.matchAll(/([^{}]+)::after\{([^}]*)\}/g)) {
    if (/url\(/.test(m[2])) assert.match(m[2], /pointer-events:none/, `${m[1].trim()} deve ter pointer-events:none`);
  }
});
