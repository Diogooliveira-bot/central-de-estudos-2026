import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const read = path => readFileSync(new URL('../'+path,import.meta.url),'utf8');

test('relatório reúne os módulos concluídos, em andamento e sem registro',()=>{
  const ctx={
    window:{
      BASE_COMPLETA_USER:{name:'Aluno Teste'},
      CentralDisciplineLoader:{percentages:()=>[100,35,0]},
      BaseCompletaProgressReportSnapshot:()=>({questions:29,studySeconds:3700})
    },
    document:{readyState:'loading',addEventListener(){}},
    SUBJECTS:[{id:'civil',name:'Direito Civil',topics:[
      {title:'Pessoas naturais'},{title:'Bens'},{title:'Contratos'}
    ]}]
  };
  vm.runInNewContext(read('ui/study-communication-v1.js'),ctx);
  const report=ctx.window.BCStudyCommunication.buildReport();
  assert.equal(report.done,1);
  assert.equal(report.underway,1);
  assert.equal(report.pending,1);
  assert.equal(report.questions,29);
  assert.equal(report.disciplines[0].modules[2].pct,0);
  assert.match(ctx.window.BCStudyCommunication.compactText(report),/Sem progresso registrado/);
  assert.match(ctx.window.BCStudyCommunication.compactText(report),/\nMódulos/);
});

test('o resumo automático de progresso inclui os módulos existentes',()=>{
  const ctx={
    window:{CentralDisciplineLoader:{percentages:()=>[50,100]}},
    document:{readyState:'loading',addEventListener(){},querySelectorAll(){return []}},
    SUBJECTS:[{id:'cf',name:'Direito Constitucional',topics:[{title:'Constituição'},{title:'Direitos fundamentais'}]}],
    localStorage:{getItem(){return null},setItem(){},length:0,key(){return null}},
    navigator:{onLine:false},
    addEventListener(){}
  };
  vm.runInNewContext(read('ui/progress-report-v1.js'),ctx);
  const snap=ctx.window.BaseCompletaProgressReportSnapshot();
  assert.equal(snap.modules.length,2);
  assert.equal(snap.modules[0].subjectId,'cf');
  assert.equal(snap.modules[0].pct,50);
  assert.equal(snap.modules[1].pct,100);
});

test('WhatsApp oficial exige DDI + DDD + número brasileiro',()=>{
  const backend=read('api/study-communication.js')
    .replace(/^import[\s\S]*?;\s*$/gm,'')
    .replace('export default async function handler','async function handler');
  const ctx={process:{env:{}},console};
  vm.runInNewContext(backend,ctx);
  assert.equal(ctx.supportWhatsapp('5585999999999'),'https://wa.me/5585999999999');
  assert.equal(ctx.supportWhatsapp('85999999999'),null);
  assert.equal(ctx.supportWhatsapp(''),null);
  assert.equal(ctx.supportWhatsapp('551234'),null);
});

test('envio por e-mail não aceita destinatário arbitrário',()=>{
  const backend=read('api/study-communication.js');
  assert.match(backend,/requireSession\(req,/);
  assert.match(backend,/!sameOriginRequest\(req\)/);
  assert.match(backend,/to:session\.user\.email/);
  assert.match(backend,/to:row\.email/);
  assert.doesNotMatch(backend,/to:body\.(email|to|recipient)/);
  assert.match(backend,/action==='admin-report-email'/);
});
