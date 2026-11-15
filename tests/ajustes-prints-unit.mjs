import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = f => readFileSync(f, 'utf8');

test('Anotações: caixa acompanha o texto e o arquivo é carregado e entra no pacote offline', () => {
  const js = read('ui/notes-autosize-v1.js');
  assert.match(js, /scrollHeight/);
  assert.match(js, /\.ds-notes textarea/);
  const offline = JSON.parse(read('central-offline-files-v66172.json')).files;
  assert.ok(offline.includes('/ui/notes-autosize-v1.js?v=20261115notes1'));
  assert.ok(read('central-v119.html').includes("ui/notes-autosize-v1.js?v=20261115notes1"));
});

test('Mais opções não repete o que já está no menu do topo', () => {
  assert.ok(!read('ui/student-shell-v3.js').includes('Meu perfil e plano'));
  const area = read('ui/questoes-area-v1.js');
  assert.ok(!/data-student-more-action', 'questoes'/.test(area));
  assert.match(area, /\[data-bcqa-more\]'\)\.forEach\(el => el\.remove\(\)\)/);
});

test('Questões abre em janela própria (sob o menu, sem fundo escurecido) e marca o item do menu', () => {
  const css = read('ui/questoes-area-v1.css');
  assert.match(css, /bc-topnav \.bcqa-overlay\{top:var\(--bc-nav-height/);
  const js = read('ui/questoes-area-v1.js');
  assert.match(js, /nav\.classList\.add\('active'\)/);
  assert.match(js, /nav\.classList\.remove\('active'\)/);
});

test('Central de Questões: só Disciplinas, tudo recolhido e sem laço de redesenho', () => {
  const js = read('ui/external-question-filters-v1.js');
  assert.match(js, /let activeTab = 'disciplines'/);
  assert.match(js, /aria-label="Seções da Central de Questões" hidden/);
  assert.ok(!/: index === 0\)/.test(js), 'nenhuma disciplina abre sozinha');
  assert.match(js, /!target\.isConnected\) return false/, 'nós descartados pela própria renderização não disparam novo redesenho');
  assert.ok(!/querySelector\('\[data-bcq-discipline\]'\)/.test(js), 'o <select> é escolhido pelo nome da tag (os <details> também usam o atributo)');
});

test('Progresso mostra três cartões: teoria lida, questões internas e externas (só com a tela aberta)', () => {
  const js = read('ui/student-dashboard-v3.js');
  for (const label of ['Teoria lida', 'Questões internas', 'Questões externas']) assert.ok(js.includes(label), label);
  assert.match(js, /if \(!view\.classList\.contains\('hidden'\)\) renderProgressCards/);
  assert.match(read('ui/mascote-v1.css'), /\.bc-progress-legacy\{display:none!important\}/);
});
