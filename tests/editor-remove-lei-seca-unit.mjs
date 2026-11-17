import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const source=readFileSync(new URL('../ui/editor-premium-v1.js',import.meta.url),'utf8');
const wait=(ms=30)=>new Promise(r=>setTimeout(r,ms));
async function setup(html,{role='admin',allow=true}={}){
 const dom=new JSDOM('<!doctype html><html><body><div class="bc-native-reader-overlay">'+
  '<div class="bc-native-reader-title"><b>Direito Processual Civil</b><small>Módulo 01</small></div>'+
  '<div class="bc-native-reader-tools"></div><article class="bc-native-article">'+html+
  '</article></div></body></html>',{url:'https://app.basecompleta.com.br/central-v119.html',pretendToBeVisual:true,runScripts:'outside-only'});
 const w=dom.window,posts=[],confirmCalls=[];
 w.MutationObserver=class{observe(){}disconnect(){}};
 w.confirm=text=>{confirmCalls.push(text);return allow};
 w.fetch=async(uri,options={})=>{
  if(String(uri).includes('/api/auth'))return{ok:true,json:async()=>({authenticated:true,user:{role}})};
  if(options.method==='POST'){posts.push(JSON.parse(options.body));return{ok:true,json:async()=>({revision:posts.length,ok:true})}}
  return{ok:true,json:async()=>({exists:false})};
 };
 w.eval(source);await wait();
 const d=w.document;if(role!=='aluno'){d.querySelector('.bcpe-launch').click();await wait()}
 return{dom,w,d,posts,confirmCalls,workspace:()=>d.querySelector('.bcpe-workspace'),close:()=>w.close()};
}

function openLawPicker(app){
 app.d.querySelector('[data-action="remove-law"]').click();
 return app.d.querySelector('.bcpe-law-panel');
}
function selectLawItems(app,indices='all'){
 const panel=openLawPicker(app);
 assert.ok(panel,'Seletor de trechos não apareceu');
 const boxes=[...panel.querySelectorAll('.bcpe-law-item input[type="checkbox"]')];
 if(indices==='all'){
  const all=panel.querySelector('.bcpe-law-all input');
  all.click();
 }else{
  for(const index of indices){assert.ok(boxes[index],'Trecho não disponível');boxes[index].click()}
 }
 const button=panel.querySelector('.bcpe-law-danger');
 assert.equal(button.disabled,false);
 button.click();
 return boxes.length;
}

test('editor remove todos os detalhes de lei seca do CPC, sem apagar teoria e outros detalhes',async()=>{
 const app=await setup('<section class="capitulo"><h2>Teoria essencial</h2><p>Preserve a explicação jurídica.</p>'+
  '<details class="lei-seca"><summary>Ver lei seca — CPC</summary><p>Art. 1º</p></details>'+
  '<p>Aprofundamento mantido.</p><details><summary>Ver exemplos</summary><p>Caso prático</p></details>'+
  '<details class="lei-seca"><summary>Ver lei seca — CF/88</summary><p>Art. 5º</p></details></section>');
 const d=app.d,article=d.querySelector('.bc-native-article'),ws=app.workspace();
 assert.equal(ws.querySelectorAll('details.lei-seca').length,2);
 assert.ok(d.querySelector('[data-action="remove-law"]'));
 selectLawItems(app);
 assert.equal(ws.querySelector('details.lei-seca'),null);
 assert.ok(ws.textContent.includes('Preserve a explicação jurídica.'));
 assert.ok(ws.textContent.includes('Aprofundamento mantido.'));
 assert.ok(ws.querySelector('details:not(.lei-seca)'));
 assert.equal(article.querySelectorAll('details.lei-seca').length,2,'até Publicar conteúdo, o aluno não é afetado');
 assert.equal(app.posts.length,0);
 assert.match(app.confirmCalls[0],/trecho\(s\) selecionado/);
 d.querySelector('[data-action="publish"]').click();await wait();
 assert.equal(app.posts.length,1);
 assert.doesNotMatch(app.posts[0].html,/lei-seca|Art\. 1º|Art\. 5º/);
 assert.match(app.posts[0].html,/Aprofundamento mantido/);
 assert.equal(article.querySelector('details.lei-seca'),null);
 app.close();
});
test('Lei Seca do Penal criada dinamicamente também é removível, sem eliminar os capítulos',async()=>{
 const app=await setup('<h2>Teoria</h2><p>Texto principal.</p>'+
  '<section class="penv-law-library"><div class="penv-law-title">Lei seca — redação literal</div>'+
  '<section class="penv-law-group"><details class="penv-literal-law"><summary>LEI SECA · Art. 1º</summary><p>Lei</p></details></section></section>'+
  '<p>Explicação do artigo na teoria.</p>'+
  '<section class="penv-law-group"><details class="penv-literal-law"><summary>LEI SECA · Art. 2º</summary></details></section>'+
  '<aside class="bc-native-callout law"><b>Lei seca</b><div>Citação literal</div></aside>');
 selectLawItems(app);
 assert.equal(app.workspace().querySelector('.penv-law-library'),null);
 assert.equal(app.workspace().querySelector('.penv-law-group'),null);
 assert.equal(app.workspace().querySelector('.bc-native-callout.law'),null);
 assert.match(app.workspace().textContent,/Texto principal/);
 assert.match(app.workspace().textContent,/Explicação do artigo na teoria/);
 app.close();
});
test('detalhes de Lei Seca sem class e dois níveis de blocos são reconhecidos',async()=>{
 const app=await setup('<section><h2>Conteúdo</h2><details><summary>Ver Lei Seca — art. 3º</summary><p>Dispositivo</p></details>'+
 '<details><summary>Ver jurisprudência</summary><p>STF</p></details></section>');
 selectLawItems(app);
 assert.equal(app.workspace().querySelectorAll('details').length,1);
 assert.match(app.workspace().textContent,/STF/);
 app.close();
});
test('desfazer restaura Lei Seca apagada antes da publicação',async()=>{
 const app=await setup('<p>Teoria.</p><details class="lei-seca"><summary>Lei seca</summary><p>Artigo</p></details>');
 selectLawItems(app);
 assert.equal(app.workspace().querySelector('.lei-seca'),null);
 app.d.querySelector('[data-action="undo"]').click();
 assert.ok(app.workspace().querySelector('.lei-seca'));
 assert.equal(app.posts.length,0);
 app.close();
});
test('cancelar confirmação não apaga conteúdo; alunos não recebem controle',async()=>{
 const admin=await setup('<p>Teoria.</p><details class="lei-seca"><summary>Lei seca</summary></details>',{allow:false});
 selectLawItems(admin);
 assert.ok(admin.workspace().querySelector('.lei-seca'));
 admin.close();
 const student=await setup('<p>Teoria.</p><details class="lei-seca"><summary>Lei seca</summary></details>',{role:'aluno'});
 assert.equal(student.d.querySelector('.bcpe-launch'),null);
 assert.equal(student.d.querySelector('[data-action="remove-law"]'),null);
 student.close();
});

test('permite escolher apenas um artigo e preservar os demais, sem publicação automática',async()=>{
 const app=await setup('<h2>Regras</h2><p>Explicação da teoria.</p>'+
  '<details class="lei-seca"><summary>Art. 1º — Disposições iniciais</summary><p>Redação do artigo 1</p></details>'+
  '<details class="lei-seca"><summary>Art. 2º — Prazos</summary><p>Redação do artigo 2</p></details>'+
  '<details><summary>Jurisprudência</summary><p>STF e STJ</p></details>');
 const panel=openLawPicker(app);
 assert.equal(panel.querySelectorAll('.bcpe-law-item input').length,2);
 assert.equal(panel.querySelector('.bcpe-law-danger').disabled,true);
 const first=panel.querySelectorAll('.bcpe-law-item input')[0];first.click();
 assert.equal(panel.querySelector('.bcpe-law-danger').disabled,false);
 panel.querySelector('.bcpe-law-danger').click();
 const ws=app.workspace();
 assert.equal(ws.querySelectorAll('details.lei-seca').length,1);
 assert.match(ws.querySelector('details.lei-seca').textContent,/Redação do artigo 2/);
 assert.ok(ws.textContent.includes('Explicação da teoria.'));
 assert.ok(ws.textContent.includes('STF e STJ'));
 assert.equal(app.posts.length,0,'sem publicação, nada deve ir ao servidor');
 app.d.querySelector('[data-action="undo"]').click();
 assert.equal(ws.querySelectorAll('details.lei-seca').length,2);
 app.close();
});
test('remover só um dos artigos da biblioteca Penal mantém os outros e o título da biblioteca',async()=>{
 const app=await setup('<p>Teoria</p><div class="penv-law-library">'+
  '<h3>Lei Seca — Código Penal</h3><div class="penv-law-group">'+
  '<details class="penv-literal-law"><summary>Art. 1º — Legalidade</summary><p>Redação 1</p></details>'+
  '<details class="penv-literal-law"><summary>Art. 2º — Tempo</summary><p>Redação 2</p></details>'+
  '</div></div>');
 assert.equal(selectLawItems(app,[0]),2);
 const ws=app.workspace();
 assert.equal(ws.querySelectorAll('.penv-literal-law').length,1);
 assert.match(ws.textContent,/Art. 2º/);
 assert.ok(ws.querySelector('.penv-law-library'));
 app.close();
});
test('parágrafos de artigos em Lei Seca sem details também podem ser escolhidos individualmente',async()=>{
 const app=await setup('<div class="lei-seca"><h3>Lei Seca</h3>'+
  '<p>Art. 1º — Regra A.</p><p>Art. 2º — Regra B.</p>'+
  '</div><p>Teoria preservada.</p>');
 assert.equal(selectLawItems(app,[1]),2);
 assert.match(app.workspace().textContent,/Art. 1º — Regra A/);
 assert.doesNotMatch(app.workspace().textContent,/Art. 2º — Regra B/);
 assert.match(app.workspace().textContent,/Teoria preservada/);
 app.close();
});
test('fechar seletor ou deixar tudo desmarcado não altera o conteúdo',async()=>{
 const app=await setup('<details class="lei-seca"><summary>Lei seca</summary><p>Artigo</p></details>');
 const panel=openLawPicker(app);
 assert.equal(panel.querySelector('.bcpe-law-danger').disabled,true);
 panel.querySelector('.bcpe-law-actions button').click();
 assert.equal(app.d.querySelector('.bcpe-law-panel'),null);
 assert.ok(app.workspace().querySelector('.lei-seca'));
 assert.equal(app.posts.length,0);
 app.close();
});

test('botão de remoção fica no mesmo Editor Premium que publica com histórico versionado',()=>{
 assert.match(source,/data-action="remove-law"/);
 assert.match(source,/Escolher trechos da Lei Seca/);
 assert.match(source,/Remover selecionados/);
 assert.match(source,/function removeLawSections\(state\)/);
 assert.match(source,/checkpoint\(state\)/);
 assert.match(source,/historyPush\(state\)/);
 assert.match(source,/async function publish\(state,button\)/);
 assert.match(source,/expectedRevision:state\.revision/);
 assert.match(readFileSync(new URL('../api/content-editor.js',import.meta.url),'utf8'),/central_content_override_history/);
});
