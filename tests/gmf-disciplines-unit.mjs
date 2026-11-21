import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const source = read('content/gmf/course-catalog-v1.js');
const script = read('ui/gmf-disciplines-v1.js');
const index = read('index.html');

function getCatalog() {
  const context = {window: {}};
  vm.runInNewContext(source, context);
  return context.window.GmfCourseCatalog;
}

test('quatro disciplinas e 30 módulos únicos; roteiro não se apresenta como curso completo', () => {
  const catalog = getCatalog();
  assert.equal(catalog.subjects.length, 4);
  assert.deepEqual(Array.from(catalog.subjects, item => item.id), ['atual', 'fortaleza', 'legesp', 'dh']);
  assert.deepEqual(Array.from(catalog.subjects, item => item.modules.length), [6, 9, 11, 4]);
  assert.equal(catalog.subjects.reduce((sum, item) => sum + item.modules.length, 0), 30);
  assert.equal(catalog.theoryComplete, false);
  assert.equal(catalog.newNoticePublished, false);
  for (const course of catalog.subjects) {
    assert.ok(course.reference.includes('2023'));
    assert.equal(new Set(course.modules.map(m => m.id)).size, course.modules.length);
    for (const module of course.modules) {
      assert.ok(module.title.length > 5);
      assert.ok(module.focus.length >= 2);
    }
  }
});

test('Legislação Extravagante preserva as onze leis do edital e corrige ano da Lei de Drogas', () => {
  const catalog = getCatalog();
  const laws = catalog.subjects.find(s => s.id === 'legesp').modules;
  const combined = laws.map(item => item.title).join(' ');
  for (const law of ['13.022/2014','11.343/2006','7.716/1989','8.069/1990','9.605/1998','9.503/1997','10.826/2003','11.340/2006','13.869/2019','6.794/1990','Lei Orgânica']) {
    assert.ok(combined.includes(law), 'Faltando ' + law);
  }
  assert.match(laws[1].attention, /erro material/);
});

test('assuntos de Fortaleza e Direitos Humanos cobrem os pontos oficiais', () => {
  const courses = getCatalog().subjects;
  const local = courses.find(s => s.id === 'fortaleza').modules.map(m => m.title).join(' ');
  for (const title of ['Localização','Hidrografia','População','políticos','Economia','turísticos','Patrimônio','Clima','História']) {
    assert.match(local, new RegExp(title, 'i'));
  }
  const human = courses.find(s => s.id === 'dh').modules.map(m => m.title).join(' ');
  for (const title of ['Conceito','Características','Categorias','Gerações']) {
    assert.match(human, new RegExp(title, 'i'));
  }
});

test('integração registrada após runtime e não altera cadastro de módulos antigos', () => {
  assert.ok(index.includes('/content/gmf/course-catalog-v1.js?v=20261120gmf1'));
  assert.ok(index.includes('/ui/gmf-disciplines-v1.js?v=20261120gmf2'));
  assert.ok(index.indexOf('central-structural-v66119/runtime.js') < index.indexOf('/ui/gmf-disciplines-v1.js'));
  assert.ok(index.indexOf('/content/gmf/course-catalog-v1.js') < index.indexOf('/ui/gmf-disciplines-v1.js'));
  assert.doesNotThrow(() => new vm.Script(script));
  assert.doesNotMatch(script, /onclick=\"return GmfReader\.open/);
  assert.match(script, /data-gmf-action=\"review\"/);
  assert.match(script, /ids\.has\(id\)/);
});

test('cadastro na interface não duplica disciplinas e não simula progresso', () => {
  const catalog = getCatalog();
  const appended = [];
  const subjects = [{id:'cf',name:'Direito Constitucional',topics:[]}];
  const select = {options:[], add(option) {this.options.push(option)}};
  const document = {
    getElementById(id) {return id === 'agendaDisc' ? select : null},
    querySelector() {return null},
    head: {appendChild(node) {appended.push(node)}},
    createElement(tag) {return {tagName:tag,style:{},id:'',textContent:''}}
  };
  const win = {
    GmfCourseCatalog:catalog,
    CentralModuleCatalog:{cf:[{number:1,title:'Já existente'}]},
    subjStats() {return {total:0,done:0,pct:0}},
    renderSubjects() {},
    renderAll() {},
    renderDisciplineGrid() {}
  };
  const context = {window:win,SUBJECTS:subjects,document,Option:class {constructor(label,value){this.text=label;this.value=value}},console};
  vm.runInNewContext(script,context);
  assert.equal(subjects.length, 5);
  assert.ok(win.GmfDisciplines.installed);
  assert.equal(win.GmfDisciplines.moduleCount,30);
  for (const item of subjects.slice(1)) {
    const stats = win.subjStats(item);
    assert.equal(stats.done,0);
    assert.equal(stats.pct,0);
    assert.equal(stats.unit,'módulos');
    assert.equal(item.topics.length, catalog.subjects.find(s => s.id === item.id).modules.length);
    assert.ok(item.topics.every(topic => !topic.studyUrl));
  }
  assert.equal(select.options.length,4);
  assert.equal(win.CentralModuleCatalog.cf.length,1);
  assert.equal(appended.filter(node => node.tagName === 'style').length,1);
  vm.runInNewContext(script,context);
  assert.equal(subjects.length,5);
  assert.equal(select.options.length,4);
});
