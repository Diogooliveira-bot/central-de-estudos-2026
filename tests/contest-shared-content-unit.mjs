import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeSyllabus, subjectCoverage, topicCoverage } from '../lib/contest-coverage.js';
import { normalizeContest, coverage } from '../lib/concursos-handler.js';
import { CONCURSOS_2026_SEED } from '../lib/concursos-seed.js';
import { validSelectedContestIds } from '../api/objective.js';

test('vínculo aprovado reaproveita a mesma referência em mais de um edital', () => {
  const approved = {subjectId:'cf',moduleId:'cf-02',chapterId:'direitos-fundamentais',status:'approved',scope:'full',evidence:'Capítulo conferido frente ao subitem 1.1 do edital.'};
  const first = normalizeSyllabus([{id:'a',title:'Direitos fundamentais',links:[approved]}]);
  const second = normalizeSyllabus([{id:'b',title:'Direitos fundamentais',links:[approved]}]);
  assert.equal(first[0].links[0].moduleId,second[0].links[0].moduleId);
  assert.equal(subjectCoverage({syllabus:first}),'complete');
  assert.equal(subjectCoverage({syllabus:second}),'complete');
});

test('sugestões, rejeições e capítulos pendentes não concluem edital', () => {
  const suggested = {subjectId:'cf',moduleId:'cf-02',status:'suggested',scope:'full'};
  const approved = {...suggested,status:'approved',evidence:'Conferência parcial do subitem 1.1.'};
  assert.equal(topicCoverage({links:[suggested]}),'missing');
  assert.equal(subjectCoverage({syllabus:[{links:[approved]},{links:[]}]}),'partial');
  assert.equal(topicCoverage({links:[approved],supplement:{title:'Norma especial',status:'pending'}}),'partial');
  assert.equal(topicCoverage({links:[approved],supplement:{title:'Norma especial',status:'approved'}}),'partial');
  assert.equal(topicCoverage({links:[approved],supplement:{title:'Norma especial',status:'approved',contentRef:'/content/especial/norma.js'}}),'complete');
  assert.throws(()=>normalizeSyllabus([{title:'A',links:[{...approved,evidence:''}]}]),/conferência/);
});

test('verticalização tem precedência sobre percentual legado', () => {
  const subject={coverage:'complete',weight:4,syllabus:[{id:'a',title:'Assunto',links:[]}]};
  assert.equal(coverage({subjects:[subject]}).percent,0);
  assert.equal(subjectCoverage(subject),'missing');
});

test('PRF separa assuntos e mantém todos sem cobertura validada', () => {
  const prf=CONCURSOS_2026_SEED.find((contest)=>contest.id.startsWith('prf-2021'));
  assert.equal(prf.subjects.length,14);
  assert.ok(prf.subjects.reduce((sum,s)=>sum+s.syllabus.length,0)>50);
  assert.equal(coverage(prf).percent,0);
  const data=normalizeContest(prf);
  assert.ok(data.subjects.every((subject)=>subjectCoverage(subject)==='missing'));
});
test('seleção simultânea de editais não aceita duplicatas nem tipos inválidos', () => {
  assert.ok(validSelectedContestIds(['exam-tjpb-2026-analista-judiciaria','exam-trt8-2026-analista-judiciaria']));
  assert.equal(validSelectedContestIds(['exam-tjpb-2026-analista-judiciaria','exam-tjpb-2026-analista-judiciaria']),false);
  assert.equal(validSelectedContestIds(['career-area-policial']),false);
  assert.equal(validSelectedContestIds(['exam-abc',42]),false);
});
