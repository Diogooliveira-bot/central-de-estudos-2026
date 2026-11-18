import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';

// A abertura remove alguns <script src> do index.html. Antes era uma cadeia de regex (CodeQL: "incomplete
// multi-character sanitization"); agora é varredura por posição. Este teste garante o MESMO resultado nas
// páginas reais e que marcação aninhada/disfarçada não deixa "<script" removível para trás.
const boot = readFileSync('central-v119.html', 'utf8');
const helperSource = boot.match(/function removeScripts\(markup,pattern\)\{[\s\S]*?\n \}\n/)[0];
const removeScripts = vm.runInNewContext('(' + helperSource.replace(/^function removeScripts/, 'function') + ')');
const patterns = [...boot.matchAll(/removeScripts\(html,\/(\\bsrc=\["'\].*?)\["'\]\/i\)/g)].map((m) => m[1]);

test('o boot usa removeScripts (sem regex de remoção de <script>)', () => {
  assert.ok(patterns.length >= 10, 'padrões encontrados: ' + patterns.length);
  assert.ok(!boot.includes("<\\/script>/gi,'')"), 'sobrou regex de remoção de <script>');
});

test('mesmo resultado que a regex antiga em index.html real', () => {
  const html = readFileSync('index.html', 'utf8');
  for (const inner of patterns) {
    const body = inner.replace(/^\\bsrc=\["'\]/, '').replace(/\[\^"'\]\*$/, '');
    const oldRe = new RegExp('<script\\b[^>]*\\bsrc=["\']' + body + '[^"\']*["\'][^>]*>\\s*<\\/script>', 'gi');
    const pattern = new RegExp(inner + '["\']', 'i');
    assert.equal(removeScripts(html, pattern), html.replace(oldRe, ''), 'divergiu em: ' + body);
  }
});

test('remove só o que casa e não deixa <script> aninhado para trás', () => {
  const pattern = /\bsrc=["']\/?content\/qc-notebook-catalog\.js[^"']*["']/i;
  const alvo = '<script src="/content/qc-notebook-catalog.js?v=1"></script>';
  assert.equal(removeScripts('a' + alvo + 'b', pattern), 'ab');
  assert.equal(removeScripts('<script src="/outro.js"></script>' + alvo, pattern), '<script src="/outro.js"></script>');
  assert.equal(removeScripts('<scr' + alvo + 'ipt src="/content/qc-notebook-catalog.js"></script>', pattern).includes('qc-notebook-catalog'), false);
  assert.equal(removeScripts('<script src="/content/qc-notebook-catalog.js">alert(1)</script>', pattern), '<script src="/content/qc-notebook-catalog.js">alert(1)</script>', 'script com corpo não é tocado');
  assert.equal(removeScripts('<SCRIPT SRC="/content/qc-notebook-catalog.js"></SCRIPT>x', pattern), 'x');
  assert.equal(removeScripts('sem scripts', pattern), 'sem scripts');
  assert.equal(removeScripts('<script src="/content/qc-notebook-catalog.js">', pattern), '<script src="/content/qc-notebook-catalog.js">', 'tag sem fechamento fica como está');
});

test('os <script> inline de central-v119.html continuam válidos (nenhum "fecha-script" solto dentro deles)', () => {
  const blocks = [...boot.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]).filter((code) => code.trim());
  assert.ok(blocks.length >= 1);
  for (const code of blocks) assert.doesNotThrow(() => new Function(code), 'bloco inline com erro de sintaxe: ' + code.slice(0, 60));
});
