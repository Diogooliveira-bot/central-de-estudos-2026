import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

async function syncHarness() {
  const source = await read('sync-client.js');
  const instrumented = source.replace(/\}\)\(\);\s*$/, `
    window.__syncTest = {
      mergeAgendaValue,
      mergeCronogramaValue,
      mergePayload,
      sync,
      configure(options) {
        localState = options.localState;
        localReady = true;
        meta = options.meta;
        if (options.request) request = options.request;
        if (options.saveMeta) saveMeta = options.saveMeta;
      }
    };
  })();`);
  const scheduled = [];
  const window = {
    BASE_COMPLETA_USER: { id: 'student-test' },
    __BASE_COMPLETA_USER_ID__: 'student-test',
    addEventListener() {},
    dispatchEvent() {},
  };
  const context = vm.createContext({
    window,
    document: { readyState: 'loading', addEventListener() {}, getElementById() { return null; } },
    navigator: { onLine: true },
    location: { pathname: '/', search: '', replace() {} },
    localStorage: { getItem() { return null; }, setItem() {}, removeItem() {} },
    indexedDB: {},
    Event: class Event {},
    URLSearchParams,
    Date,
    Math,
    JSON,
    Promise,
    setInterval() { return 0; },
    setTimeout(fn) { scheduled.push(fn); return scheduled.length; },
    clearTimeout() {},
    fetch: async () => { throw new Error('fetch inesperado'); },
    console,
  });
  vm.runInContext(instrumented, context, { filename: 'sync-client.js' });
  return { api: window.__syncTest, scheduled };
}

test('sincronização respeita a nuvem quando não há alteração local', async () => {
  const { api } = await syncHarness();
  const local = JSON.stringify([{ id: 'local', task: 'antiga' }]);
  const cloud = JSON.stringify([{ id: 'cloud', task: 'nova' }]);
  assert.equal(api.mergeAgendaValue(local, cloud, false), cloud);
  assert.equal(api.mergeAgendaValue(local, cloud, true), local);
  assert.equal(api.mergeCronogramaValue('{"version":2,"selected":"local"}', '{"version":2,"selected":"cloud"}', false), '{"version":2,"selected":"cloud"}');

  api.configure({
    localState: { isSyncKey: () => true, collectSyncStorage: () => ({ agenda: local }), applySnapshot() {} },
    meta: { device: 'test', revision: 1, hash: 'previous' },
    saveMeta: async () => {},
  });
  assert.equal(api.mergePayload({ agenda: local }, { agenda: cloud }, false).agenda, cloud);
});

test('conflito 409 agenda nova tentativa depois de liberar o bloqueio', async () => {
  const { api, scheduled } = await syncHarness();
  let gets = 0;
  let applied = null;
  api.configure({
    localState: {
      isSyncKey: () => true,
      collectSyncStorage: () => ({ progress: 'local' }),
      applySnapshot(value) { applied = value; },
    },
    meta: { device: 'test', revision: 1, hash: 'outdated' },
    saveMeta: async () => {},
    request: async (_path, options) => {
      if (!options) {
        gets++;
        return gets === 1
          ? { exists: true, revision: 1, payload: { progress: 'old-cloud' } }
          : { exists: true, revision: 2, payload: { progress: 'new-cloud' } };
      }
      const error = new Error('conflict');
      error.status = 409;
      throw error;
    },
  });

  await api.sync('manual');
  assert.equal(scheduled.length, 1, 'o retry deve ser agendado após o finally liberar busy');
  scheduled.shift()();
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(gets, 2);
  assert.equal(JSON.stringify(applied), JSON.stringify({ progress: 'new-cloud' }));
});

test('contratos de acabamento permanecem ligados à experiência do aluno', async () => {
  const [runtime, index, vade, decorando, boot, dashboard, offline] = await Promise.all([
    read('central-structural-v66119/runtime.js'),
    read('index.html'),
    read('tools/vade.html'),
    read('tools/decorando.html'),
    read('central-v119.html'),
    read('ui/student-dashboard-v3.js'),
    read('central-offline-files-v66172.json'),
  ]);
  assert.match(runtime, /\{id:'pt',name:'Português'\},\.\.\.SUBJECTS/);
  assert.match(runtime, /<option value="\$\{escAttr\(s\.id\)\}">/);
  assert.match(runtime, /decorando:'Lei em Dia',vade:'Vade Mecum'/);
  assert.match(runtime, /CENTRAL_VIEW_ROUTES=\{homeView:'home',disciplinesView:'disciplines',agendaView:'agenda',performanceView:'performance'/);
  assert.match(index, /hostId==='mapaEstudosDisc'\?' collapsed'/);
  assert.match(vade, /onclick="vmGoCentral\(\)" aria-label="Voltar à Central de Estudos"/);
  assert.doesNotMatch(vade, /class="vm-sync-status ok">Offline</);
  assert.match(decorando, /856 questões de estudo ativo/);
  assert.match(decorando, /535 exercícios autorais/);
  assert.match(boot, /var APP_VERSION='6\.7\.0'/);
  assert.match(dashboard, /function canonicalProgress\(\)/);
  assert.match(offline, /student-dashboard-v3\.js\?v=20261023-remove-labor-disciplines-v1/);
});

