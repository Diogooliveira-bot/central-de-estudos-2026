import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {Script} from 'node:vm';

test('interface de planos é um HTML válido quanto à sintaxe do JavaScript inline',()=>{
 const html=readFileSync('tools/meus-planos.html','utf8');
 assert.match(html,/<h1>Meus Planos de Estudo<\/h1>/);
 const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)];
 assert.equal(scripts.length,1);
 assert.doesNotThrow(()=>new Script(scripts[0][1]));
 assert.match(html,/data-plan/);
 assert.match(html,/api\/study-plans/);
});

test('nova funcionalidade reaproveita a função de autenticação existente',()=>{
 const vercel=JSON.parse(readFileSync('vercel.json','utf8'));
 assert.ok(vercel.rewrites.some(r=>r.source==='/api/study-plans'&&r.destination==='/api/auth?bc_api=study-plans'));
 const auth=readFileSync('api/auth.js','utf8');
 assert.match(auth,/handleStudyPlans/);
 assert.ok(!readFileSync('index.html','utf8').includes('BC_PREVIEW_GUEST_TOKEN'));
});

test('Agenda existente oferece acesso à área de planos sem substituir seus controles',()=>{
 const home=readFileSync('index.html','utf8');
 assert.match(home,/Meus Planos de Estudo/);
 assert.match(home,/id="agendaDate"/);
 assert.match(home,/id="agendaEditor"/);
 const cronograma=readFileSync('tools/cronograma.html','utf8');
 assert.match(cronograma,/CENTRAL_CRONOGRAMA_6M_V2/);
 assert.match(cronograma,/meus-planos.html/);
});

test('as tabelas dos planos não compartilham colunas com progresso das disciplinas',()=>{
 const handler=readFileSync('lib/study-plan-handler.js','utf8');
 assert.match(handler,/central_study_plan_task_state/);
 assert.match(handler,/user_id=/);
 assert.ok(!/UPDATE\s+central_user_sync_state/i.test(handler));
 assert.ok(!/UPDATE\s+central_user_progress_summary/i.test(handler));
});
