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

test('quatro disciplinas, 30 módulos e disponibilidade íntegra de teoria e revisão', () => {
  const catalog = getCatalog();
  assert.equal(catalog.subjects.length, 4);
  assert.deepEqual(Array.from(catalog.subjects, item => item.id), ['atual', 'fortaleza', 'legesp', 'dh']);
  assert.deepEqual(Array.from(catalog.subjects, item => item.modules.length), [6, 9, 11, 4]);
  assert.equal(catalog.subjects.reduce((sum, item) => sum + item.modules.length, 0), 30);
  assert.equal(catalog.theoryComplete, true);
  assert.equal(catalog.newNoticePublished, false);
  assert.deepEqual(JSON.parse(JSON.stringify(catalog.availableModules)), {
    atual:['m01','m02','m03','m04','m05','m06'],
    fortaleza:['m01','m02','m03','m04','m05','m06','m07','m08','m09'],
    legesp:['m01','m02','m03','m04','m05','m06','m07','m08','m09','m10','m11'],
    dh:['m01','m02','m03','m04']
  });
  for (const course of catalog.subjects) {
    assert.ok(course.reference.includes('2023'));
    assert.equal(new Set(course.modules.map(m => m.id)).size, course.modules.length);
    for (const module of course.modules) {
      assert.ok(module.title.length > 5);
      assert.ok(module.focus.length >= 2);
      assert.ok(catalog.availableModules[course.id].includes(module.id), course.id + '/' + module.id);
      if (module.id !== 'm01') {
        for (const mode of ['full','review']) {
          const path = 'content/gmf/' + course.id + '/' + module.id + '-' + mode + '-v1.js';
          const context = {window:{}};
          vm.runInNewContext(read(path), context, {timeout:1000});
          const record = context.window[mode === 'full' ? 'GMF_MODULE_FULL' : 'GMF_MODULE_REVIEW'];
          assert.equal(record.subject, course.id, path);
          assert.equal(record.module, module.id, path);
          assert.ok(record.chapters.length >= (mode === 'full' ? 4 : 3), path);
          assert.ok(record.resources.length > 0, path);
          assert.ok(record.resources.every(resource => /^https:\/\//.test(resource.url)), path);
          assert.ok(record.chapters.every(chapter =>
            chapter.title.length >= 8 && chapter.html.length >= 160 &&
            /<p>/.test(chapter.html) && !/<script|onerror=|javascript:/i.test(chapter.html)), path);
        }
        const fullContext = {window:{}}, reviewContext = {window:{}};
        vm.runInNewContext(read('content/gmf/' + course.id + '/' + module.id + '-full-v1.js'), fullContext);
        vm.runInNewContext(read('content/gmf/' + course.id + '/' + module.id + '-review-v1.js'), reviewContext);
        assert.notEqual(
          fullContext.window.GMF_MODULE_FULL.chapters[0].html,
          reviewContext.window.GMF_MODULE_REVIEW.chapters[0].html,
          course.id + '/' + module.id + ' revisão deve ter redação própria');
      }
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
    addEventListener() {},
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
