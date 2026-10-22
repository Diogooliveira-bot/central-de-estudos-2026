import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import { JSDOM } from 'jsdom';

const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

function fixture() {
  const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', {url:'https://cf-m07.example/'});
  const w = dom.window;
  w.CF_WEEKS = [2,7].map(n => ({id:`w${n}`,num:n,title:`M${n}`,read:'Leitura',read_focus:[]}));
  w.renderSubjects = () => {};
  w.renderAll = () => {};
  const ctx = vm.createContext(w);
  for (const n of [2,7]) vm.runInContext(read(`content/cf/m${String(n).padStart(2,'0')}-native-data.js`),ctx);
  vm.runInContext(read('ui/cf-native-study-v2.js'),ctx);
  return dom;
}

test('M07 preserva identidade e oferece material didático sem tabelas partidas', () => {
  const dom=fixture(),w=dom.window,d=w.BASE_NATIVE_CONTENT.cf.m07;
  assert.equal(d.number,7);
  assert.equal(d.moduleId,'w7');
  assert.equal(d.lawTopicId,'cf-m07');
  assert.match(d.mapUrl,/m07-infografico/);
  assert.ok(d.complete.length>50000);
  assert.doesNotMatch(d.complete,/\{\{(?:QUESTIONS|REVIEW_QUESTIONS)\}\}|Warning: truncated output/);
  w.CfNativeStudy.openReader(7,'complete');
  const tables=w.document.querySelectorAll('.cf-native-table');
  assert.equal(tables.length,9);
  for(const table of tables){
    const head=table.querySelectorAll('th');
    for(const row of table.querySelectorAll('tbody tr')){
      assert.equal(row.children.length,head.length);
      for(const cell of row.children) assert.notEqual(cell.textContent,'—');
    }
  }
  dom.window.close();
});

test('checklist do M07 persiste sem alterar checklist ou progresso do M02', () => {
  const dom=fixture(),w=dom.window;
  w.localStorage.setItem('central-v6:cf-reader-checks:2:complete','{"unrelated":true}');
  w.CfNativeStudy.openReader(7,'complete');
  let inputs=w.document.querySelectorAll('[data-cf-check]');
  assert.equal(inputs.length,18);
  assert.equal(w.document.querySelectorAll('[data-checklist]').length,1);
  inputs[0].click();inputs[17].click();
  assert.equal(w.document.querySelector('[data-check-progress]').textContent,'2/18 concluídos');
  w.CfNativeStudy.close();w.CfNativeStudy.openReader(7,'complete');
  inputs=w.document.querySelectorAll('[data-cf-check]');
  assert.equal(inputs[0].checked,true);assert.equal(inputs[17].checked,true);assert.equal(inputs[1].checked,false);
  assert.equal(w.localStorage.getItem('central-v6:cf-reader-checks:2:complete'),'{"unrelated":true}');
  inputs[0].click();
  assert.equal(w.document.querySelector('[data-check-progress]').textContent,'1/18 concluídos');
  let law;
  w.openLeiSecaEnxuta=(...args)=>law=args;
  w.CfNativeStudy.openDecorando(7);
  assert.deepEqual(law,[null,'cf','cf-m07']);
  dom.window.close();
});

test('15 questões do M07 mantêm distribuição e pontuação mesmo com alternativas embaralhadas', () => {
  const dom=fixture(),w=dom.window,qs=w.BASE_NATIVE_CONTENT.cf.m07.questions;
  assert.deepEqual(Array.from(qs.complete,q=>q.difficulty),['Fácil','Fácil','Fácil','Fácil','Média','Média','Média','Média','Difícil','Difícil']);
  assert.deepEqual(Array.from(qs.summary,q=>q.difficulty),['Fácil','Fácil','Média','Média','Difícil']);
  for(const mode of ['complete','summary']){
    w.CfNativeStudy.openQuiz(7,mode);
    for(const q of qs[mode]){
      assert.equal(q.options.length,4);
      assert.equal(new Set(q.options).size,4);
      assert.ok(q.options.every(option=>option.length>25));
      assert.ok(q.explanation.length>100);
      const button=w.document.querySelector(`[data-opt="${q.answer}"]`);
      assert.ok(button.textContent.includes(q.options[q.answer]));
      button.click();
      assert.match(w.document.querySelector('[data-feed]').textContent,/Correto/);
      w.document.querySelector('[data-next]').click();
    }
    assert.match(w.document.querySelector('[data-host]').textContent,new RegExp(`${qs[mode].length} / ${qs[mode].length}`));
  }
  const state=JSON.parse(w.localStorage.getItem('central-v6:cf-native-v2'));
  assert.equal(state.modules[7].completeScore,10);
  assert.equal(state.modules[7].summaryScore,5);
  assert.equal(state.modules[2],undefined);
  dom.window.close();
});

test('M07 tem fonte editorial reproduzível e a mesma versão no pacote offline', () => {
  const asset='/content/cf/m07-native-data.js?v=20261022cfm07apostila1';
  assert.ok(read('index.html').includes(`src="${asset}"`));
  assert.ok(JSON.parse(read('central-offline-files-v66172.json')).files.includes(asset));
  const ctx={window:{}};
  vm.runInNewContext(read('tools/decorando-data-modulos.js')+';globalThis.modules=CENTRAL_LAW_MODULES.modules;',ctx);
  const law=ctx.modules.find(m=>m.id==='cf-m07');
  assert.ok(law && law.questionIds.length>0);
});
