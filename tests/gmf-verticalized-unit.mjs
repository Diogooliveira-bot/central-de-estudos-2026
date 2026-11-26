import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {JSDOM} from 'jsdom';
import {EXAM_TOPIC_IDS} from '../lib/exam-progress-topic-ids.js';
const script=fs.readFileSync(new URL('../ui/exam-verticalized-v1.js',import.meta.url),'utf8');
const goal='exam-catalog-gmf-fortaleza-monitoramento-cargo-1';
function setup({user='gmf-test',guest=true,online=false,fetcher,seed={}}={}){
 const dom=new JSDOM('<html><body><div id="disciplineGrid"></div><div id="gmfGoalGrid"></div></body></html>',{url:'https://example.test/',runScripts:'outside-only'});
 const w=dom.window; w.__BASE_COMPLETA_USER_ID__=user;w.__BASE_COMPLETA_PREVIEW_GUEST__=guest;
 Object.defineProperty(w.navigator,'onLine',{value:online});
 w.CentralStudyObjectives={getActive:()=>goal};w.GmfStudyObjective={current:()=> 'gmf-fortaleza'};
 w.CentralStudyNavigation={openContext(){}};w.fetch=fetcher||(()=>{throw Error('unexpected API')});
 for(const [k,v] of Object.entries(seed))w.localStorage.setItem(k,v);
 w.eval(script);return {dom,w,screen:w.CentralGMFVerticalized};
}
test('GMF: IDs únicos, 92 assuntos, 11 disciplinas, 90 destinos relacionados e allowlist correspondente',()=>{
 const {dom,screen}=setup();const items=screen.data.subjects.flatMap(s=>s.items);
 assert.equal(screen.data.subjects.length,11);assert.equal(items.length,92);assert.equal(new Set(items.map(i=>i.id)).size,92);
 assert.deepEqual([...EXAM_TOPIC_IDS[screen.data.examId]],Array.from(items,i=>i.id));assert.equal(items.filter(i=>i.moduleIds.length).length,90);dom.window.close();
});
test('GMF: um check por assunto, progresso, persistência após fechar e reabrir, desmarcação',()=>{
 const {dom,w,screen}=setup();assert.equal(screen.open(),true);
 const inputs=w.document.querySelectorAll('[data-exam-topic]');assert.equal(inputs.length,92);
 inputs[0].click();assert.equal(screen.overall(),1.1);
 const key='central-v6:exam-progress:gmf-2023-guarda-municipal:gmf-test';
 assert.equal(JSON.parse(w.localStorage.getItem(key))['gmf23-pt-01'].studied.value,true);
 screen.close();screen.open();assert.equal(w.document.querySelector('[data-exam-topic]').checked,true);
 w.document.querySelector('[data-exam-topic]').click();assert.equal(screen.overall(),0);dom.window.close();
});
test('GMF: sincronização mescla progresso remoto e local e envia somente mudanças necessárias',async()=>{
 const key='central-v6:exam-progress:gmf-2023-guarda-municipal:gmf-test',older='2026-11-25T00:00:00Z',newer='2026-11-26T00:00:00Z';
 const calls=[];
 const {dom,screen}=setup({guest:false,online:true,seed:{[key]:JSON.stringify({'gmf23-pt-01':{studied:{value:true,at:newer}}})},fetcher:async(url,opts)=>{
 calls.push({url,opts});return {ok:true,json:async()=>({progress:{'gmf23-pt-01':{studied:{value:false,at:older}},'gmf23-pt-02':{studied:{value:true,at:older}}}})};
 }});
 screen.open();await new Promise(r=>setTimeout(r,50));assert.equal(screen.overall(),2.2);assert.equal(calls.length,2);
 assert.equal(JSON.parse(calls[1].opts.body).changes.length,1);dom.window.close();
});
test('GMF: botão abre exatamente o destino solicitado na navegação de foco',async()=>{
 const {dom,w,screen}=setup();const calls=[];w.BaseCompletaFocusNavigation={openByModuleId:async(...args)=>{calls.push(args);return true}};
 screen.open();w.document.querySelector('[data-exam-module="pt-24"]').click();await Promise.resolve();
 assert.deepEqual(calls,[['pt','pt-24']]);dom.window.close();
});
