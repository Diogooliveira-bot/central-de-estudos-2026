import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const source = read('content/gmf/course-catalog-v1.js');
const script = read('ui/gmf-disciplines-v1.js');
const reader = read('ui/gmf-course-reader-v2.js');
const index = read('index.html');

function getCatalog() {
  const context = {window: {}};
  vm.runInNewContext(source, context);
  return context.window.GmfCourseCatalog;
}

test('GMF usa a navegação padrão da Central (sem janela flutuante) e a estrutura de módulo das demais disciplinas', () => {
  assert.doesNotMatch(script, /gmf-course-browser|openCourse|closeCourse|stopImmediatePropagation/);
  assert.match(script, /class="cf-module bc-accordion ds-module gmf-std-module" data-std-module="1"/);
  assert.match(script, /cf-module-head bc-accordion-header ds-module-head/);
  assert.match(script, /cf-module-no">MÓDULO /);
  assert.match(script, /cf-study-card cf-study-review/);
  assert.match(script, /cf-study-card cf-study-primary/);
  assert.match(script, /global\.GmfDisciplines = Object\.freeze\(\{installed:true,[\s\S]*?renderMaster:\(id\)=>/);
  assert.ok(read('ui/module-page-standard-v1.css').includes('.cf-module[data-std-module] .cf-study-card'));
  assert.ok(index.includes('/ui/module-page-standard-v1.css?v='));
});

test('leitor GMF atualiza a contagem de seções junto ao percentual', () => {
  assert.ok(reader.includes("<span data-done>'+done+'</span>"));
  assert.ok(reader.includes("querySelector('[data-done]')"));
});

test('disciplinas do GMF: as quatro originais íntegras e toda disciplina publicada com teoria e revisão de qualidade', () => {
  const catalog = getCatalog();
  const original = {atual:6, fortaleza:9, legesp:11, dh:4};
  for (const [id, count] of Object.entries(original)) {
    const course = catalog.subjects.find(item => item.id === id);
    assert.ok(course, id + ' deve existir');
    assert.equal(course.modules.length, count, id);
    assert.deepEqual(Array.from(catalog.availableModules[id]), Array.from(course.modules, m => m.id), id + ' publicado por inteiro');
  }
  assert.ok(catalog.subjects.length >= 4);
  assert.equal(new Set(catalog.subjects.map(item => item.id)).size, catalog.subjects.length);
  assert.equal(catalog.theoryComplete, true);
  assert.equal(catalog.newNoticePublished, false);
  for (const course of catalog.subjects) {
    assert.ok(course.reference.includes('2023'));
    assert.equal(new Set(course.modules.map(m => m.id)).size, course.modules.length);
    for (const module of course.modules) {
      assert.ok(module.title.length > 5);
      assert.ok(module.focus.length >= 2);
      // Só módulos publicados precisam ter conteúdo pronto; os "em preparação" (disciplina nova) são validados pelo comando nova-disciplina.
      if (!catalog.availableModules[course.id].includes(module.id)) continue;
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
          assert.ok(record.chapters.every(chapter => {
            const wordCount = chapter.html.replace(/<[^>]*>/g,' ').trim().split(/\s+/).length;
            const minimumWords = mode === 'full' ? 100 : 45;
            return chapter.title.trim().length > 0 && !/^(?:TODO|placeholder|em construção)$/i.test(chapter.title.trim()) && chapter.html.length >= 160 &&
              wordCount >= minimumWords && /<p>/.test(chapter.html) &&
              !/<script|onerror=|javascript:/i.test(chapter.html);
          }), path);
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
  assert.match(index, /\/content\/gmf\/course-catalog-v1\.js\?v=[A-Za-z0-9_.-]+/);
  assert.match(index, /\/ui\/gmf-disciplines-v1\.js\?v=[A-Za-z0-9_.-]+/);
  assert.ok(index.indexOf('central-structural-v66119/runtime.js') < index.indexOf('/ui/gmf-disciplines-v1.js'));
  assert.ok(index.indexOf('/content/gmf/course-catalog-v1.js') < index.indexOf('/ui/gmf-disciplines-v1.js'));
  assert.doesNotThrow(() => new vm.Script(script));
  assert.doesNotMatch(script, /onclick=\"return GmfReader\.open/);
  assert.match(script, /data-gmf-action=\"' \+ kind/);
  assert.match(script, /action\('review'\)/);
  assert.match(script, /action\('complete'\)/);
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
