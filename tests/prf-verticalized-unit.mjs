import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {JSDOM} from 'jsdom';
import {EXAM_TOPIC_IDS} from '../lib/exam-progress-topic-ids.js';
const script=fs.readFileSync(new URL('../ui/exam-verticalized-v1.js',import.meta.url),'utf8');
const goal='exam-catalog-prf-2021-policial-rodoviario-federal-cargo-1';
function setup(){
 const dom=new JSDOM('<html><body><div id="disciplineGrid"></div><div id="gmfGoalGrid"></div></body></html>',{url:'https://example.test/',runScripts:'outside-only'});
 const w=dom.window;let active=goal;w.__BASE_COMPLETA_USER_ID__='student-prf';w.__BASE_COMPLETA_PREVIEW_GUEST__=true;
 Object.defineProperty(w.navigator,'onLine',{value:false});
 w.CentralStudyObjectives={getActive:()=>active};w.GmfStudyObjective={current:()=>active===goal?'general':'gmf-fortaleza'};
 w.CentralStudyNavigation={openContext(){}};w.fetch=()=>{throw Error('Guest must not contact API')};
 w.eval(script);return {dom,w,screen:w.CentralPRFVerticalized,select:id=>{active=id;w.document.dispatchEvent(new w.CustomEvent('central:study-objective-changed'));}};
}
test('PRF: 14 disciplinas, 232 IDs estáveis, 39 resoluções e seis vínculos previamente conferidos',()=>{
 const {dom,screen}=setup();const items=screen.data.subjects.flatMap(s=>s.items);
 assert.equal(screen.data.subjects.length,14);assert.equal(items.length,232);assert.equal(new Set(items.map(i=>i.id)).size,232);
 assert.deepEqual([...EXAM_TOPIC_IDS[screen.data.examId]],Array.from(items,i=>i.id));
 assert.equal(items.filter(i=>i.verified).length,6);assert.equal(items.filter(i=>i.targets.length).length,123);
 assert.equal(screen.data.subjects.find(s=>s.id==='prf21-v-transito').items.length,41);
 dom.window.close();
});
test('PRF: checklist individual persistido, acesso exclusivo por objetivo e sem misturar GMF',()=>{
 const {dom,w,screen,select}=setup();assert.equal(screen.open(),true);
 const host=w.document.getElementById('prfVerticalizedDialog');
 assert.equal(host.querySelectorAll('[data-exam-topic]').length,232);
 host.querySelector('[data-exam-topic]').click();assert.ok(screen.overall()>0);
 const key='central-v6:exam-progress:prf-2021-policial-rodoviario-federal:student-prf';
 assert.equal(JSON.parse(w.localStorage.getItem(key))['prf21-v-pt-1'].studied.value,true);
 select('exam-catalog-gmf-fortaleza-monitoramento-cargo-1');
 assert.equal(screen.open(),false);assert.equal(w.CentralGMFVerticalized.open(),true);assert.equal(w.CentralGMFVerticalized.overall(),0);
 select(goal);assert.equal(screen.open(),true);assert.equal(host.querySelector('[data-exam-topic]').checked,true);
 dom.window.close();
});
test('PRF: destino de módulo é exato e matéria sem cobertura não recebe atalho',async()=>{
 const {dom,w,screen}=setup();const calls=[];w.BaseCompletaFocusNavigation={openByModuleId:async(...args)=>{calls.push(args);return true}};
 screen.open();const host=w.document.getElementById('prfVerticalizedDialog');
 assert.equal(host.querySelector('[data-exam-subject="prf21-v-fis"] [data-exam-module]'),null);
 host.querySelector('[data-exam-module="pt-24"]').click();await Promise.resolve();
 assert.deepEqual(calls,[['pt','pt-24']]);dom.window.close();
});
