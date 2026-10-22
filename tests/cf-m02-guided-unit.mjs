import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import test from 'node:test';
import {JSDOM} from 'jsdom';

const root = path.resolve(import.meta.dirname, '..');
const css = fs.readFileSync(path.join(root, 'content/cf/editorial/guided-m02.css'), 'utf8').replaceAll('CF M02', 'CF M02');

function built() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cf-m02-guided-'));
  execFileSync(process.execPath, ['scripts/build-cf-m02-guided.mjs'], {cwd:root, env:{...process.env, CF_M02_OUTPUT_DIR:dir}, stdio:'pipe'});
  return fs.readFileSync(path.join(dir, 'CF-M02-Apostila-didatica-interativa.html'), 'utf8');
}

test('CF M02 usa o mesmo padrão guiado final do M01', () => {
  const html = built();
  const dom = new JSDOM(html, {url:'https://preview.example/'});
  const d = dom.window.document;
  assert.ok(d.querySelector('style').textContent.startsWith(css));
  assert.equal(d.querySelectorAll('.chapter').length, 12);
  assert.equal(d.querySelectorAll('.chapter .box').length, 96);
  assert.equal(d.querySelectorAll('.chaptercheck').length, 12);
  assert.equal(d.querySelectorAll('.extraCheck').length, 10);
  assert.equal(d.querySelectorAll('[data-question]').length, 15);
  assert.equal(d.querySelectorAll('.comparecard').length >= 10, true);
  assert.equal(d.querySelectorAll('.chapter .test').length, 12);
  assert.equal(html.includes('CF M01'), false);
  assert.equal(html.includes('Direitos e deveres individuais e coletivos'), true);
});

test('CF M02 mantém as tabelas responsivas e a checklist funcional no HTML', () => {
  const html = built();
  const dom = new JSDOM(html, {url:'https://preview.example/'});
  const d = dom.window.document;
  assert.ok(d.querySelectorAll('.compare').length >= 8);
  assert.ok(d.querySelector('.finalcheck input[data-key="check-01"]'));
  assert.match(d.querySelector('.topbar').textContent, /Direitos e deveres/);
  assert.match(d.body.textContent, /CHECKLIST DE DOMÍNIO|Checklist final de domínio/i);
  assert.match(d.body.textContent, /habeas corpus/i);
  assert.match(d.body.textContent, /mandado de injunção/i);
});
