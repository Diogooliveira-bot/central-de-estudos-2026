import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const config = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));

test('toda tarefa agendada da Vercel aponta para uma função existente', () => {
  assert.ok(Array.isArray(config.crons) && config.crons.length > 0);
  const sources = new Set((config.rewrites || []).map((rule) => rule.source));
  for (const cron of config.crons) {
    const path = String(cron.path).split('?')[0];
    const file = new URL(`..${path}.js`, import.meta.url);
    // Rotas de função são servidas antes das reescritas; sem arquivo e sem reescrita, a Vercel responde 404.
    assert.ok(existsSync(file) || sources.has(path), `${path} não tem função nem reescrita`);
  }
});

test('rotina diária de e-mails usa a função admin-dashboard protegida por CRON_SECRET', () => {
  assert.deepEqual(config.crons.map((cron) => cron.path), ['/api/admin-dashboard']);
  const handler = readFileSync(new URL('../api/admin-dashboard.js', import.meta.url), 'utf8');
  assert.match(handler, /safeSecretEqual\(auth,'Bearer '\+secret\)/);
  assert.match(handler, /runPremiumEmailAutomation\(\)/);
  assert.match(handler, /runWeeklyEmailAutomation\(\)/);
});
