import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('a experiência v3 modular é carregada em ordem e participa do modo offline', async () => {
  const [boot, offline, serviceWorker, pkg] = await Promise.all([
    read('central-v119.html'), read('central-offline-files-v66172.json'), read('sw.js'), read('package.json'),
  ]);
  const build = JSON.parse(offline).build;
  assert.match(boot, /var APP_VERSION='6\.7\.0'/);
  assert.ok(boot.includes(`var BUILD='${build}'`));
  const ordered = [
    'ui/study-objectives-catalog-v1.js', 'ui/external-question-filters-v1.js',
    'ui/student-ux-core-v3.js', 'ui/student-shell-v3.js',
    'ui/student-dashboard-v3.js', 'ui/student-plan-v3.js', 'ui/study-objectives-v1.js',
  ];
  let previous = -1;
  for (const file of ordered) {
    const index = boot.indexOf(file);
    assert.ok(index > previous, `${file} deve carregar depois do módulo anterior`);
    previous = index;
    const fileVersion = file.includes('study-objectives-catalog') ? '20261114trilha1' : file.includes('study-objectives') ? '20261114trilha1'
      : file.includes('student-plan') ? '20261019-qc-catalog1'
        : file.includes('student-shell') ? '20261105nav1' : file.includes('auth-shell') ? '20261020studyobj1'
          : file.includes('student-dashboard') ? '20261105resume1'
          : file.includes('external-question-filters') ? `${build}-min20-titles1` : file.includes('student-ux-core') ? '20261114trilha1' : '';
    assert.ok(offline.includes(`/${file}?v=${fileVersion}`), `${file} deve estar no manifesto offline`);
  }
  assert.match(boot, /student-experience-v3\.css\?v='\+BUILD/);
  assert.ok(JSON.parse(offline).files.some(file => /^\/ui\/student-experience-v3\.css\?v=/.test(file)));
  assert.doesNotMatch(boot, /student-polish-v1|student-experience-v2\.js/);
  assert.doesNotMatch(offline, /student-polish-v1|student-experience-v2/);
  assert.ok(serviceWorker.includes(`var CACHE='central-${build}'`));
  assert.equal(JSON.parse(pkg).version, '6.7.0');
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
  assert.match(index, /var ORDEM=\['pt','cf','adm','civil','cpc','penal','cpp','rlm'\]/);
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


test('home minimalista utiliza o mascote oficial hospedado na Central', async () => {
  const [boot, css, offline, mascot] = await Promise.all([
    read('central-v119.html'),
    read('ui/home-minimal-a-v1.css'),
    read('central-offline-files-v66172.json'),
    readFile(new URL('../assets/mascote-oficial-estudando.png', import.meta.url)),
  ]);
  assert.match(boot, /home-minimal-a-v1\.css\?v=20261101oficial1/);
  assert.match(css, /\/assets\/mascote-oficial-estudando\.png\?v=20261101-oficial1/);
  assert.doesNotMatch(css, /basecompleta\.com\.br\/img\/mascote-estudando\.webp/);
  assert.ok(JSON.parse(offline).files.includes('/ui/home-minimal-a-v1.css?v=20261101oficial1'));
  assert.ok(JSON.parse(offline).files.includes('/assets/mascote-oficial-estudando.png?v=20261101-oficial1'));
  assert.ok(mascot.byteLength > 1000);
  assert.equal(mascot.subarray(0,8).toString('hex'), '89504e470d0a1a0a');
  assert.match(css, /#homeView/);
  assert.doesNotMatch(css, /#studentMorePanel/);
});


test('fluxo progressivo usa módulos reais e não altera o conteúdo ou o acesso', async () => {
  const [boot, css, script, offline]=await Promise.all([
    read('central-v119.html'),read('ui/disciplinas-foco-v1.css'),
    read('ui/disciplinas-foco-v1.js'),read('central-offline-files-v66172.json'),
  ]);
  assert.match(boot,/disciplinas-foco-v1\.js\?v=20261107cpclist3/);
  assert.match(boot,/disciplinas-foco-v1\.css\?v=20261107modulelist2/);
  assert.ok(JSON.parse(offline).files.includes('/ui/disciplinas-foco-v1.js?v=20261107cpclist3'));
  assert.ok(JSON.parse(offline).files.includes('/ui/disciplinas-foco-v1.css?v=20261107modulelist2'));
  assert.match(script,/BaseCompletaFocusNavigation/);
  assert.match(script,/moduleNodes\(subject\)/);
  assert.match(script,/m\.head\.click\(\)/);
  assert.match(script,/external\.dataset\.studyOpenSubject/);
  assert.doesNotMatch(script,/__BASE_COMPLETA_PREVIEW_GUEST__ !== true/);
  assert.doesNotMatch(css,/#studentMorePanel/);
  assert.match(css,/#homeView\.bc-focus-choice/);
});
