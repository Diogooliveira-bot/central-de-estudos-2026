import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { CONCURSOS_2026_SEED } from '../lib/concursos-seed.js';
import { coverage, normalizeContest } from '../lib/concursos-handler.js';

const prfId = 'prf-2021-policial-rodoviario-federal';

test('PRF 2021 usa fonte oficial e mantém os 14 blocos do programa', () => {
  const prf = CONCURSOS_2026_SEED.find((item) => item.id === prfId);
  assert.ok(prf);
  assert.equal(prf.year, 2021);
  assert.equal(prf.status, 'publicado');
  assert.equal(prf.board, 'Cebraspe');
  assert.equal(prf.vacancies, 1500);
  assert.ok(prf.sources.some((source) => source.url === 'https://cdn.cebraspe.org.br/concursos/prf_21/arquivos/ED_1_PRF_2021_ABERTURA.PDF'));
  assert.equal(prf.subjects.length, 14);
  assert.equal(new Set(prf.subjects.map((subject) => subject.id)).size, 14);
});

test('PRF não declara cobertura antes de auditoria por capítulo', () => {
  const prf = CONCURSOS_2026_SEED.find((item) => item.id === prfId);
  assert.ok(prf.subjects.every((subject) => subject.coverage === 'missing'));
  assert.ok(prf.subjects.every((subject) => subject.moduleIds.length === 0));
  assert.equal(coverage(prf).percent, 0);
  assert.deepEqual(
    prf.subjects.filter((subject) => subject.centralId).map((subject) => subject.centralId).sort(),
    ['adm','cf','cpp','info','penal','pt','rlm']
  );
});

test('cadastro administrativo aceita concurso histórico sem afrouxar requisitos de fonte', () => {
  const prf = CONCURSOS_2026_SEED.find((item) => item.id === prfId);
  const normalized = normalizeContest(prf);
  assert.equal(normalized.year, 2021);
  assert.equal(normalized.subjects.length, 14);
  assert.throws(() => normalizeContest({...prf, sources: []}), /fonte oficial/);
});

test('prévia sem banco isolado falha antes da criação de tabelas ou seed', () => {
  const source = readFileSync(new URL('../lib/concursos-handler.js', import.meta.url), 'utf8');
  const guard = source.indexOf("CONTESTS_PREVIEW_DB_ISOLATED !== 'true'");
  const ensure = source.indexOf('await ensureTables(session.sql)');
  assert.ok(guard >= 0 && ensure > guard);
});
