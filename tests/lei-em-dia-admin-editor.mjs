import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {leiRuntime} from '../scripts/lei-em-dia-runtime.mjs';
import {validateEditPayload,default as handler} from '../api/lei-em-dia-edits.js';

const root=new URL('../',import.meta.url);
const read=p=>readFileSync(new URL(p,root),'utf8');
const newContext=()=>leiRuntime(root);
const payload={id:'decorando-penal-pdf-003',revision:0,data:{
 statement:'O enunciado possui texto juridicamente válido.',
 explanation:'Comentário da questão.',answer:true
}};
test('API aceita campos jurídicos válidos e bloqueia payloads perigosos',()=>{
 assert.equal(validateEditPayload(payload),'');
 const classified={...payload,data:{...payload.data,discipline:'penal',topicId:'pen-m03',subtopic:'Tema penal',moduleId:'pen-m03'}};
 assert.equal(validateEditPayload(classified),'');
 for(const body of [
  {...payload,revision:-1},{...payload,revision:0.5},
  {...payload,id:'<script>'},{...payload,data:{...payload.data,answer:'true'}},
  {...payload,data:{...payload.data,privilege:'admin'}},
  {...payload,data:{...payload.data,statement:'curto'}},
  {...payload,data:{...payload.data,discipline:'penal'}},
  {...payload,data:{...classified.data,discipline:'admin'}}
 ])assert.notEqual(validateEditPayload(body),'',JSON.stringify(body));
});
test('API impede escrita sem credencial ou de origem diferente antes de gravar',async()=>{
 const result=async headers=>{
  const res={statusCode:0,headers:{},setHeader(k,v){this.headers[k]=v},end(v){this.body=JSON.parse(v)}};
  await handler({method:'PUT',headers,query:{},body:payload},res);
  return res;
 };
 const csrf=await result({host:'example.test',origin:'https://evil.test','sec-fetch-site':'cross-site'});
 assert.equal(csrf.statusCode,403);
 const anon=await result({host:'example.test',origin:'https://example.test','sec-fetch-site':'same-origin'});
 assert.equal(anon.statusCode,401);
});
test('botão Editar só aparece quando editor confirma perfil de administrador',()=>{
 const ctx=newContext();
 vm.runInContext("chooseDiscipline('civil');ui.screen='study';",ctx);
 assert.ok(!vm.runInContext('renderFocus()',ctx).includes('class="admin-edit-button"'));
 vm.runInContext('adminEditor.canEdit=true',ctx);
 const html=vm.runInContext('renderFocus()',ctx);
 assert.match(html,/class="admin-edit-button"/);
 vm.runInContext('editQuestion(visible()[ui.articleIndex].id)',ctx);
 const edit=vm.runInContext('renderFocus()',ctx);
 for(const label of ['Enunciado','Gabarito','Comentário / explicação','Disciplina','Lei ou assunto','Subassunto','Módulo da Central','Salvar alterações'])assert.ok(edit.includes(label),label);
 const scroll=vm.runInContext('renderScroll()',ctx);
 assert.match(scroll,/class="admin-edit-button"/);
});
test('edição preserva ID, tentativas e vínculos originais da questão',()=>{
 const ctx=newContext();
 const q=vm.runInContext('DATA.find(a=>a.discipline==="civil")',ctx);
 const id=q.id,original=q.question.statement,answer=q.question.answer;
 const originalModuleIds=vm.runInContext('LAW_MODULE_LIST.filter(m=>LAW_MODULE_QUESTIONS.get(m.id).has('+JSON.stringify(id)+')).map(m=>m.id)',ctx);
 vm.runInContext('saved.attempts['+JSON.stringify(id)+']=[{date:"2026-10-14T00:00:00Z",choice:true,correct:true}]',ctx);
 ctx.questionId=id;
 vm.runInContext('applyQuestionEdit(DATA.find(a=>a.id===questionId),{statement:"Questão reformulada em teste de regressão.",explanation:"Explicação atualizada",answer:'+String(!answer)+',discipline:"civil",topicId:'+JSON.stringify(q.topicId)+',subtopic:'+JSON.stringify(q.subtopic)+',moduleId:""})',ctx);
 assert.equal(q.id,id);
 assert.notEqual(q.question.statement,original);
 assert.equal(q.question.answer,!answer);
 assert.equal(vm.runInContext('saved.attempts[questionId].length',ctx),1);
 const after=vm.runInContext('LAW_MODULE_LIST.filter(m=>LAW_MODULE_QUESTIONS.get(m.id).has(questionId)).map(m=>m.id)',ctx);
 assert.deepEqual([...after],[...originalModuleIds]);
});
test('mudar disciplina reatribui questão ao módulo escolhido e mantém ID',()=>{
 const ctx=newContext(),q=vm.runInContext('DATA.find(a=>a.discipline==="civil")',ctx);
 const target=vm.runInContext('LAW_MODULE_LIST.find(m=>m.discipline==="penal")',ctx);
 const topic=vm.runInContext('TOPICS_BY_DISCIPLINE.penal[0]',ctx);
 ctx.questionId=q.id;
 vm.runInContext('applyQuestionEdit(DATA.find(a=>a.id===questionId),'+JSON.stringify({
  statement:q.question.statement,explanation:q.question.explanation||'',answer:q.question.answer,
  discipline:'penal',topicId:topic.id,subtopic:topic.subtopics[0],moduleId:target.id
 })+')',ctx);
 assert.equal(q.discipline,'penal');
 assert.equal(q.id,ctx.questionId);
 assert.ok(vm.runInContext('LAW_MODULE_QUESTIONS.get('+JSON.stringify(target.id)+').has(questionId)',ctx));
 const old=vm.runInContext('LAW_MODULE_LIST.filter(m=>m.discipline==="civil").some(m=>LAW_MODULE_QUESTIONS.get(m.id).has(questionId))',ctx);
 assert.equal(old,false);
});
test('interface preserva filtro acessível e inclui novos recursos no pacote offline',()=>{
 const html=read('tools/decorando.html');
 const css=read('ui/lei-em-dia-v1.css');
 const manifest=JSON.parse(read('central-offline-files-v66172.json'));
 assert.ok(html.includes('Filtrar questões'));
 assert.ok(html.includes('typeof loadAdminEdits'));
 assert.match(css,/\.app-shell \.topbar>\.menu-button\{display:inline-flex!important/);
 assert.ok(manifest.files.includes('/tools/lei-em-dia-admin-editor.js?v=20261014edit3'));
});
