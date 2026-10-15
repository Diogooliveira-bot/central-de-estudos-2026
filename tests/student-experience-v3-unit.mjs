import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('a experiência v3 modular é carregada em ordem e participa do modo offline', async () => {
  const [boot, offline, serviceWorker, pkg] = await Promise.all([
    read('central-v119.html'), read('central-offline-files-v66172.json'), read('sw.js'), read('package.json'),
  ]);
  assert.match(boot, /var APP_VERSION='6\.6\.124'/);
  assert.match(boot, /var BUILD='20261015-student-ux-v3'/);
  const ordered = [
    'ui/student-ux-core-v3.js', 'ui/student-shell-v3.js',
    'ui/student-dashboard-v3.js', 'ui/student-plan-v3.js',
  ];
  let previous = -1;
  for (const file of ordered) {
    const index = boot.indexOf(file);
    assert.ok(index > previous, `${file} deve carregar depois do módulo anterior`);
    previous = index;
    assert.ok(offline.includes(`/${file}?v=20261015-student-ux-v3`));
  }
  assert.match(boot, /student-experience-v3\.css\?v='\+BUILD/);
  assert.match(offline, /student-experience-v3\.css\?v=20261015-student-ux-v3/);
  assert.doesNotMatch(boot, /student-polish-v1|student-experience-v2\.js/);
  assert.doesNotMatch(offline, /student-polish-v1|student-experience-v2/);
  assert.match(serviceWorker, /central-20261015-student-ux-v3/);
  assert.equal(JSON.parse(pkg).version, '6.6.124');
});

test('núcleo separa execução, armazenamento e falhas das interfaces', async () => {
  const core = await read('ui/student-ux-core-v3.js');
  assert.match(core, /const enhancers = new Map\(\)/);
  assert.match(core, /function register\(name, enhance\)/);
  assert.match(core, /function readJSON\(key, fallback = null\)/);
  assert.match(core, /function subjectProgress\(subject\)/);
  assert.match(core, /central:student-ux-error/);
  assert.match(core, /mutations\.some\(relevantMutation\)/);
});

test('a home mantém todas as disciplinas e a camada não altera RLM', async () => {
  const [runtime, index, dashboard, plan, styles] = await Promise.all([
    read('central-structural-v66119/runtime.js'), read('index.html'),
    read('ui/student-dashboard-v3.js'), read('ui/student-plan-v3.js'), read('ui/student-experience-v3.css'),
  ]);
  assert.match(runtime, /\{id:'pt',name:'Português'\},\.\.\.SUBJECTS/);
  assert.match(index, /var ORDEM=\['pt','cf','adm','civil','cpc','penal','cpp','trab','ptra','rlm'\]/);
  assert.match(dashboard, /if \(subject\.id === 'rlm'\) continue/);
  assert.match(plan, /subject\.open:not\(\[data-id="rlm"\]\)/);
  assert.match(styles, /subject:not\(\[data-id="rlm"\]\)/);
});

test('jornada inclui próximo passo, cartões orientados e progresso semanal', async () => {
  const [dashboard, plan, styles] = await Promise.all([
    read('ui/student-dashboard-v3.js'), read('ui/student-plan-v3.js'), read('ui/student-experience-v3.css'),
  ]);
  assert.match(dashboard, /id = 'studentNextStep'/);
  assert.match(dashboard, /student-subject-summary/);
  assert.match(dashboard, /student-discipline-details/);
  assert.match(dashboard, /id = 'studentProgressWeek'/);
  assert.match(dashboard, /Faça seu primeiro bloco de questões/);
  assert.match(plan, /id = 'studentAgendaWeek'/);
  assert.match(plan, /student-agenda-empty/);
  assert.match(styles, /student-week-chart/);
});

test('primeiro acesso cria perfil e plano sem sobrescrever tarefas existentes', async () => {
  const dashboard = await read('ui/student-dashboard-v3.js');
  assert.match(dashboard, /central-v6:student-profile-v1/);
  assert.match(dashboard, /Vamos organizar seus estudos/);
  assert.match(dashboard, /if \(Array\.isArray\(current\) && current\.length\) continue/);
  assert.match(dashboard, /priorities:data\.getAll\('priorities'\)\.slice\(0, 3\)/);
  assert.match(dashboard, /disciplineId:id/);
});

test('acessibilidade e sincronização possuem retorno visível', async () => {
  const [shell, sync, runtime, styles] = await Promise.all([
    read('ui/student-shell-v3.js'), read('sync-client.js'), read('central-structural-v66119/runtime.js'), read('ui/student-experience-v3.css'),
  ]);
  assert.match(shell, /Pular para o conteúdo/);
  assert.match(shell, /aria-current/);
  assert.match(shell, /aria-controls/);
  assert.match(shell, /Sem internet · seu progresso fica salvo neste aparelho/);
  assert.match(sync, /central:sync-status/);
  assert.match(runtime, /disciplineId,task,done:false/);
  assert.match(styles, /:focus-visible/);
  assert.match(styles, /prefers-reduced-motion:reduce/);
});
