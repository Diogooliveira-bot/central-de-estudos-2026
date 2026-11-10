import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {weeklyEmailEnabled,weeklyStudyMessage,runWeeklyEmailAutomation} from '../lib/email-weekly-automation.js';
import {weeklyDelta} from '../lib/email-study-snapshots.js';
import {renderApprovedEmail} from '../lib/approved-email-packs.js';

test('relatório semanal desligado por padrão e em Preview',async()=>{
  assert.equal(weeklyEmailEnabled({VERCEL_ENV:'production'}),false);
  assert.equal(weeklyEmailEnabled({VERCEL_ENV:'preview',BC_WEEKLY_STUDY_EMAIL_ENABLED:'YES',BC_STUDY_EMAIL_SNAPSHOTS_ENABLED:'YES'}),false);
  const result=await runWeeklyEmailAutomation({env:{VERCEL_ENV:'production'},sqlProvider:()=>{throw Error('não acessa DB')}});
  assert.equal(result.disabled,true);
});
test('relatório semanal só é elegível na segunda-feira, sem consulta no domingo',async()=>{
 const env={VERCEL_ENV:'production',BC_WEEKLY_STUDY_EMAIL_ENABLED:'YES',BC_STUDY_EMAIL_SNAPSHOTS_ENABLED:'YES'};
 const result=await runWeeklyEmailAutomation({env,now:new Date('2026-11-10T12:00:00Z'),sqlProvider:()=>{throw Error('não acessa DB')}});
 assert.equal(result.skipped,'not-monday');
});
test('relatório semanal só inclui dados comprováveis sem módulos ou aproveitamento inventados',()=>{
 const delta=weeklyDelta({questions:25,study_seconds:1800,disciplines:[{id:'adm',name:'Administrativo',pct:10}]},
  {questions:40,study_seconds:3600,disciplines:[{id:'adm',name:'Administrativo',pct:25}]});
 assert.deepEqual(delta,{questions:15,studySeconds:1800,disciplines:['Administrativo']});
 const m=weeklyStudyMessage({name:'Maria',...delta});
 assert.match(m.subject,/resumo semanal/);
 assert.match(m.text,/Questões registradas: 15/);
 assert.match(m.text,/30min/);
 assert.match(m.text,/Administrativo/);
 assert.doesNotMatch(m.text,/módulos concluídos|aproveitamento/i);
 assert.match(m.html,/BASE COMPLETA/);
});
test('relatório semanal protege HTML contra nome injetado e dados falsos',()=>{
 const mail=weeklyStudyMessage({name:'<script>alert(1)</script>',questions:12,studySeconds:600,disciplines:['<img src=x onerror=alert(1)>']});
 assert.doesNotMatch(mail.html,/<script>/);
 assert.doesNotMatch(mail.html,/<img src=x/);
 assert.match(mail.html,/&lt;script&gt;/);
 assert.throws(()=>weeklyStudyMessage({questions:-1,studySeconds:0}),/inválidos/);
});
test('cron só executa relatórios após capturar snapshots e exige opt-in explícito',()=>{
 const cron=readFileSync(new URL('../api/admin-dashboard.js',import.meta.url),'utf8');
 const snapshots=readFileSync(new URL('../lib/email-study-snapshots.js',import.meta.url),'utf8');
 const weekly=readFileSync(new URL('../lib/email-weekly-automation.js',import.meta.url),'utf8');
 assert.ok(cron.indexOf('await captureStudyEmailSnapshots()')<cron.indexOf('await runWeeklyEmailAutomation()'));
 assert.match(weekly,/consent\.email_marketing_opt_in=TRUE/);
 assert.match(weekly,/consent\.email_marketing_revoked_at IS NULL/);
 assert.match(snapshots,/NOT EXISTS \(/);
 assert.match(weekly,/ON CONFLICT\(event_key\)/);
});
test('modelo semanal aprovado continua preservado em catálogo',()=>{
 assert.throws(()=>renderApprovedEmail('resumo-semanal',{PRIMEIRO_NOME:'João'}),/obrigatório/);
});
