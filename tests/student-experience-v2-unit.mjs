import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('a experiência v2 é carregada por último e participa do modo offline', async () => {
  const [boot, offline, serviceWorker, pkg] = await Promise.all([
    read('central-v119.html'),
    read('central-offline-files-v66172.json'),
    read('sw.js'),
    read('package.json'),
  ]);
  assert.match(boot, /var APP_VERSION='6\.6\.123'/);
  assert.match(boot, /var BUILD='20261015-student-experience-v2'/);
  assert.match(boot, /student-experience-v2\.css\?v='\+BUILD/);
  assert.match(boot, /tags\+=tag\('ui\/student-experience-v2\.js\?v='\+BUILD\)/);
  assert.match(offline, /student-experience-v2\.css\?v=20261015-student-experience-v2/);
  assert.match(offline, /student-experience-v2\.js\?v=20261015-student-experience-v2/);
  assert.match(serviceWorker, /central-20261015-student-experience-v2/);
  assert.equal(JSON.parse(pkg).version, '6.6.123');
});

test('a home mantém todas as disciplinas e a camada não altera RLM', async () => {
  const [runtime, index, script, styles] = await Promise.all([
    read('central-structural-v66119/runtime.js'),
    read('index.html'),
    read('ui/student-experience-v2.js'),
    read('ui/student-experience-v2.css'),
  ]);
  assert.match(runtime, /\{id:'pt',name:'Português'\},\.\.\.SUBJECTS/);
  assert.match(index, /var ORDEM=\['pt','cf','adm','civil','cpc','penal','cpp','trab','ptra','rlm'\]/);
  assert.match(script, /if \(subject\.id === 'rlm'\) return/);
  assert.match(script, /subject\.open:not\(\[data-id="rlm"\]\)/);
  assert.match(script, /bc-native-reader-overlay:not\(\.bc-rlm-overlay\)/);
  assert.match(styles, /student-reader-shell:not\(\.bc-rlm-overlay\)/);
});

test('o aluno recebe navegação curta, próximo passo, plano semanal e progresso limpo', async () => {
  const [script, styles] = await Promise.all([
    read('ui/student-experience-v2.js'),
    read('ui/student-experience-v2.css'),
  ]);
  for (const label of ['Hoje', 'Plano', 'Disciplinas', 'Progresso', 'Mais']) assert.match(script, new RegExp(label));
  assert.match(script, /id = 'studentNextStep'/);
  assert.match(script, /id = 'studentAgendaWeek'/);
  assert.match(script, /formCard\.hidden = true/);
  assert.match(script, /student-duplicate-map/);
  assert.match(script, /canonicalProgress/);
  assert.match(styles, /grid-template-columns:repeat\(5,minmax\(0,1fr\)\)/);
  assert.match(styles, /#homeView \.home-continue-card \{display:none!important;\}/);
  assert.match(styles, /\.student-duplicate-map \{display:none!important;\}/);
});
