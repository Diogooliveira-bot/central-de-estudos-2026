import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('implementação não contém limpeza global de dados persistentes', () => {
  const sources = [
    'central-agenda-core-v1.js',
    'central-agenda-simple-v1.js',
    'central-structural-v66119/runtime.js',
    'index.html',
    'sw.js'
  ].map(read).join('\n');
  assert.doesNotMatch(sources, /localStorage\s*\.\s*clear\s*\(/);
  assert.doesNotMatch(sources, /indexedDB\s*\.\s*deleteDatabase\s*\(/);
});

test('leitores antigos da Agenda não removem registro inválido nem criam exemplos', () => {
  const runtime = read('central-structural-v66119/runtime.js');
  const block = runtime.slice(runtime.indexOf('function getAgenda(d)'), runtime.indexOf('function saveAgenda(d,a)'));
  assert.doesNotMatch(block, /removeItem/);
  assert.doesNotMatch(block, /Continuar módulo atual|Revisar baralhos pendentes/);

  const html = read('index.html');
  const standalone = html.slice(html.indexOf('function read(date)'), html.indexOf('function write(date, tasks)'));
  assert.doesNotMatch(standalone, /removeItem\(key\(date\)\)/);
  assert.match(standalone, /agenda-corrompida/);
});

test('entrada e service worker incluem a Agenda simples no cache offline', () => {
  const entry = read('central-v119.html');
  const worker = read('sw.js');
  for (const asset of ['central-agenda-core-v1.js', 'central-agenda-simple-v1.js', 'central-agenda-simple-v1.css']) {
    assert.match(entry, new RegExp(asset.replaceAll('.', '\\.'), 'u'));
    assert.match(worker, new RegExp(asset.replaceAll('.', '\\.'), 'u'));
  }
  assert.match(worker, /central-v66169-cpc-editorial-v3/);
});

test('camada visual vence regras legadas ao ocultar Home e navegação antigas', () => {
  const css = read('central-agenda-simple-v1.css');
  assert.match(css, /#homeView \.agenda-simple-home-legacy\{display:none!important\}/);
  assert.match(css, /#homeView>\.bc-home-continue\{display:none!important\}/);
  assert.match(css, /#centralSidebar \.nav>button\[hidden\]/);
});

test('Agenda móvel mantém calendário e alvos de toque acessíveis', () => {
  const css = read('central-agenda-simple-v1.css');
  assert.match(css, /\.agenda-calendar-card\{display:block!important\}/);
  assert.match(css, /\.agenda-more-fields-button\{min-height:44px\}/);
  assert.match(css, /\.agenda-task-more\{width:44px;height:44px\}/);
});

test('Home reúne hoje, pendências e disciplinas; Decorando permanece acessível', () => {
  const script = read('central-agenda-simple-v1.js');
  assert.match(script, /<h2>Hoje<\/h2>/);
  assert.match(script, /<h2>Pendências<\/h2>/);
  assert.match(script, /<h2>Disciplinas<\/h2>/);
  assert.match(script, /var decorando = byLabel\(\/\^Decorando a Lei Seca\$\/i\)/);
  assert.doesNotMatch(script, /makeNavButton\('Caderno de Erros'/);
});


test('cards de disciplinas revelam o curso legado sem esconder a Agenda simples', () => {
  const script = read('central-agenda-simple-v1.js');
  assert.match(script, /function openDiscipline\(id, button\)/);
  assert.match(script, /setHomeMode\('study'\)/);
  assert.match(script, /window\.jumpSubject = openDiscipline/);
  assert.match(script, /window\.centralHardSubject = openDiscipline/);
});
