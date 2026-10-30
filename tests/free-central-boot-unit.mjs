import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const boot = await readFile(new URL('../central-v119.html', import.meta.url), 'utf8');

test('free central boot omits paid legacy scripts and installs empty compatibility data', () => {
  assert.match(boot, /\/api\/plans\?action=me/);
  assert.match(boot, /hasPremiumAccess=planState\?\.isStaff===true\|\|planState\?\.plan==='premium'/);
  assert.match(boot, /freeBlockedScript\(src\)/);
  assert.match(boot, /CF_QUESTIONS=\[\]/);
  assert.match(boot, /PENAL_QUESTIONS=\[\]/);
  assert.match(boot, /CPC_QUESTIONS=\[\]/);
  assert.match(boot, /CIVIL_COURSE=/);
  assert.match(boot, /civil-course-\(\?:000-init\|00\[1-5\]\|006-final\)/);
  assert.match(boot, /penal-full-theory-data-/);
  assert.match(boot, /content\\\/rlm-tjce-2026/);
});

test('premium and staff retain the original script path', () => {
  assert.match(boot, /if\(!hasPremiumAccess&&freeBlockedScript\(src\)\)return '';return '<scr'/);
  assert.match(boot, /planState\?\.isStaff===true/);
});
