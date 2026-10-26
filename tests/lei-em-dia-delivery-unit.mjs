import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { claimQuestion, projectCatalogQuestion, questionById } from '../lib/lei-em-dia-questions-handler.js';

function fakeSession(limit = 20) {
  const used = new Set();
  const sql = async (strings, ...values) => {
    const query = strings.join('?');
    if (query.includes('central_claim_lei_em_dia_question')) {
      const id = String(values[1]);
      if (used.has(id)) return [{ allowed: true, already_counted: true, used_count: used.size, daily_limit: limit }];
      if (used.size >= limit) return [{ allowed: false, already_counted: false, used_count: used.size, daily_limit: limit }];
      used.add(id);
      return [{ allowed: true, already_counted: false, used_count: used.size, daily_limit: limit }];
    }
    throw new Error(`Unexpected SQL: ${query}`);
  };
  return { user: { id: 'fictional-free-user' }, sql, used };
}

test('catalog exposes filtering metadata only, never prompt, answer, explanation or legal text', () => {
  const projected = projectCatalogQuestion({
    id: 'q-1', discipline: 'cf', topicId: 't', subtopic: 'Art. 1', number: 'Art. 1', title: 'Constituição',
    source: 'https://example.test', parts: ['LEI PRIVADA'],
    question: { statement: 'ENUNCIADO SECRETO', options: ['ALTERNATIVA'], answer: true, explanation: 'GABARITO SECRETO', bank: 'CESPE', year: 2020, role: 'Analista' },
  });
  const text = JSON.stringify(projected);
  for (const secret of ['ENUNCIADO SECRETO', 'ALTERNATIVA', 'GABARITO SECRETO', 'LEI PRIVADA', 'example.test']) assert.equal(text.includes(secret), false);
  assert.equal(projected.question.bank, 'CESPE');
  assert.equal(projected.id, 'q-1');
});

test('free quota claim is atomic/idempotent for concurrent unique question requests', async () => {
  const session = fakeSession();
  const results = await Promise.all(Array.from({ length: 80 }, (_, i) => claimQuestion(session, `q-${i}`)));
  assert.equal(results.filter(row => row.allowed === true).length, 20);
  assert.equal(session.used.size, 20);
  const reopened = await Promise.all(Array.from({ length: 20 }, () => claimQuestion(session, 'q-0')));
  assert.ok(reopened.every(row => row.allowed === true && row.already_counted === true));
  assert.equal(session.used.size, 20);
  assert.equal((await claimQuestion(session, 'q-21')).allowed, false);
});

test('requesting an already used question again does not consume another daily slot', async () => {
  const session = fakeSession(2);
  assert.equal((await claimQuestion(session, 'q-1')).allowed, true);
  assert.equal((await claimQuestion(session, 'q-1')).already_counted, true);
  assert.equal((await claimQuestion(session, 'q-2')).allowed, true);
  assert.equal((await claimQuestion(session, 'q-3')).allowed, false);
  assert.equal(questionById([{ id: 'q-1' }], 'q-1').id, 'q-1');
  assert.equal(questionById([{ id: 'q-1' }], 'not-in-bank'), null);
});

test('legacy batch mode is disabled and premium delivery remains one question per request', async () => {
  const api = await readFile(new URL('../lib/lei-em-dia-questions-handler.js', import.meta.url), 'utf8');
  const ui = await readFile(new URL('../tools/decorando.html', import.meta.url), 'utf8');
  const middleware = await readFile(new URL('../middleware.js', import.meta.url), 'utf8');
  assert.match(api, /isLegacy\) return send\(res, 410/);
  assert.doesNotMatch(api, /JSON\.stringify\(questions\)/);
  assert.match(api, /bank\.map\(projectCatalogQuestion\)/);
  assert.match(api, /return send\(res, 200, \{ question, plan:/);
  assert.match(ui, /mode=catalog/);
  assert.match(ui, /action=question/);
  assert.match(middleware, /mode=catalog/);
  assert.doesNotMatch(ui, /decorando-data-led-aprovadas\.js/);
});

test('the progressive catalog rebuilds its topic index without reintroducing question content', async () => {
  const ui = await readFile(new URL('../tools/decorando.html', import.meta.url), 'utf8');
  assert.match(ui, /function buildLedTopics\(catalog\)/);
  assert.match(ui, /const TOPICS_LED_APPROVED=buildLedTopics\(DATA_LED_APPROVED\)/);
  assert.match(ui, /let LAW_MODULE_LIST=\[\]/);
  assert.doesNotMatch(ui, /src="\.\/decorando-data-led-aprovadas\.js/);
});
