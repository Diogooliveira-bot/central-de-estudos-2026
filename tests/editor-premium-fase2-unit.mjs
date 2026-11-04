import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const premium=readFileSync(new URL('../ui/editor-premium-v1.js',import.meta.url),'utf8');
const wait=(ms=25)=>new Promise(r=>setTimeout(r,ms));

async function setup(article,{role='admin'}={}){
 const dom=new JSDOM('<!doctype html><html><body><div class="bc-native-reader-overlay">'+
  '<div class="bc-native-reader-title"><b>Direito Civil</b><small>Módulo 4</small></div>'+
  '<div class="bc-native-reader-tools"></div><article class="bc-native-article">'+article+'</article></div></body></html>',
  {url:'https://example.test/central-v119.html',runScripts:'outside-only',pretendToBeVisual:true});
 const w=dom.window;const posts=[];
 w.MutationObserver=class{observe(){}disconnect(){}};
 w.confirm=()=>true;w.prompt=()=>null;
 w.fetch=async(uri,options={})=>{
  if(String(uri).startsWith('/api/auth'))return{ok:true,json:async()=>({authenticated:true,user:{role}})};
  if(options.method==='POST'){posts.push(JSON.parse(options.body));return{ok:true,json:async()=>({ok:true,revision:posts.length})}}
  return{ok:true,json:async()=>({exists:false})};
 };
 w.eval(premium);await wait();
 const d=w.document;d.querySelector('.bcpe-launch').click();await wait();
 return{w,d,posts,ws:d.querySelector('.bcpe-workspace'),close(){w.close()}};
}
function span(app,startNode,startOffset,endNode,endOffset){
 const r=app.d.createRange();r.setStart(startNode,startOffset);r.setEnd(endNode,endOffset);
 const s=app.w.getSelection();s.removeAllRanges();s.addRange(r);
 app.d.dispatchEvent(new app.w.Event('selectionchange'));
}
function key(app,k,extra={}){
 app.ws.dispatchEvent(new app.w.KeyboardEvent('keydown',Object.assign({key:k,bubbles:true,cancelable:true},extra)));
}
const texts=app=>[...app.ws.querySelectorAll('.bcpe-node')].map(n=>n.textContent);

test('o capítulo vira um documento único editável, com etiquetas de bloco fora da edição',async()=>{
 const a=await setup('<p>Um.</p><p>Dois.</p>');
 assert.equal(a.ws.getAttribute('contenteditable'),'true');
 assert.equal(a.ws.querySelector('.bcpe-block-head').getAttribute('contenteditable'),'false');
 a.close();
});
test('Backspace numa seleção de três parágrafos junta o início e o fim e remove o meio',async()=>{
 const a=await setup('<p>Primeiro parágrafo.</p><p>Segundo.</p><p>Terceiro parágrafo.</p>');
 const [p1,,p3]=a.ws.querySelectorAll('p');
 span(a,p1.firstChild,8,p3.firstChild,8);
 key(a,'Backspace');
 assert.deepEqual(texts(a),['Primeiro parágrafo.']);
 a.close();
});
test('digitar sobre uma seleção de vários parágrafos substitui o trecho',async()=>{
 const a=await setup('<p>Alfa beta.</p><p>Gama delta.</p>');
 const [p1,p2]=a.ws.querySelectorAll('p');
 span(a,p1.firstChild,5,p2.firstChild,5);
 key(a,'X');
 assert.deepEqual(texts(a),['Alfa Xdelta.']);
 a.close();
});
test('Enter sobre seleção de vários parágrafos apaga e divide no ponto',async()=>{
 const a=await setup('<p>Alfa beta.</p><p>Gama delta.</p><p>Fim.</p>');
 const [p1,p2]=a.ws.querySelectorAll('p');
 span(a,p1.firstChild,5,p2.firstChild,5);
 key(a,'Enter');
 assert.deepEqual(texts(a),['Alfa ','delta.','Fim.']);
 a.close();
});
test('negrito em vários parágrafos liga e desliga em todos',async()=>{
 const a=await setup('<p>Alfa beta.</p><p>Gama delta.</p>');
 const [p1,p2]=a.ws.querySelectorAll('p');
 span(a,p1.firstChild,5,p2.firstChild,4);
 const bold=a.d.querySelector('[data-format="strong"]');
 bold.click();
 assert.equal(p1.querySelector('strong')?.textContent,'beta.');
 assert.equal(p2.querySelector('strong')?.textContent,'Gama');
 assert.equal(bold.getAttribute('aria-pressed'),'true');
 bold.click();
 assert.equal(a.ws.querySelector('strong'),null);
 assert.deepEqual(texts(a),['Alfa beta.','Gama delta.']);
 a.close();
});
test('alinhamento e estilo valem para todos os parágrafos selecionados',async()=>{
 const a=await setup('<p>Um.</p><p>Dois.</p><p>Três.</p>');
 const [p1,p2]=a.ws.querySelectorAll('p');
 span(a,p1.firstChild,1,p2.firstChild,2);
 const align=a.d.querySelector('[data-align]');
 align.value='justify';align.dispatchEvent(new a.w.Event('change',{bubbles:true}));
 const now=a.ws.querySelectorAll('p');
 assert.equal(now[0].style.textAlign,'justify');assert.equal(now[1].style.textAlign,'justify');assert.equal(now[2].style.textAlign,'');
 const style=a.d.querySelector('[data-style]');
 style.value='h3';style.dispatchEvent(new a.w.Event('change',{bubbles:true}));
 assert.equal(a.ws.querySelectorAll('h3.bcpe-node').length,2);
 assert.equal(a.ws.querySelectorAll('p.bcpe-node').length,1);
 a.close();
});
test('apagar seleção larga mantém componentes protegidos',async()=>{
 const a=await setup('<p>Antes.</p><div class="bc-native-study-progress">Progresso</div><p>Depois.</p>');
 const ps=a.ws.querySelectorAll('p');
 span(a,ps[0].firstChild,2,ps[1].firstChild,3);
 key(a,'Delete');
 assert.ok(a.ws.querySelector('[data-bc-editor-preserve]'),'componente protegido continua');
 assert.equal(ps[0].textContent,'Anois.');
 a.close();
});
test('copiar vários blocos leva o texto sem etiquetas do editor',async()=>{
 const a=await setup('<h2>Título</h2><p>Corpo do texto.</p>');
 const h=a.ws.querySelector('h2'),p=a.ws.querySelector('p');
 span(a,h.firstChild,0,p.firstChild,5);
 const data={};
 const ev=new a.w.Event('copy',{bubbles:true,cancelable:true});
 ev.clipboardData={setData:(t,v)=>{data[t]=v}};
 a.ws.dispatchEvent(ev);
 assert.equal(ev.defaultPrevented,true);
 assert.match(data['text/html'],/<h2>Título<\/h2>/);
 assert.doesNotMatch(data['text/html'],/PARÁGRAFO|Título 2|bcpe-|contenteditable/i);
 assert.equal(data['text/plain'],'Título\nCorpo');
 a.close();
});
test('digitar com o cursor fora de um parágrafo não escreve entre os blocos',async()=>{
 const a=await setup('<p>Um.</p><p>Dois.</p>');
 const box=a.ws.querySelector('.bcpe-block');
 const r=a.d.createRange();r.setStart(box,0);r.collapse(true);
 const s=a.w.getSelection();s.removeAllRanges();s.addRange(r);
 key(a,'x');
 assert.deepEqual(texts(a),['Um.','Dois.']);
 assert.ok(a.ws.querySelector('p').contains(a.w.getSelection().anchorNode));
 a.close();
});
test('buscar conta ocorrências, inclusive com negrito no meio, e substitui tudo',async()=>{
 const a=await setup('<p>O contrato e o <strong>contra</strong>to social.</p><p>Contrato verbal.</p>');
 key(a,'h',{ctrlKey:true});
 const panel=a.d.querySelector('.bcpe-find');
 assert.ok(panel&&!panel.hidden);
 const input=panel.querySelector('[data-find-input]');
 input.value='contrato';input.dispatchEvent(new a.w.Event('input'));
 assert.equal(panel.querySelector('[data-find-count]').textContent,'1 de 3');
 panel.querySelector('[data-find-case]').checked=true;panel.querySelector('[data-find-case]').dispatchEvent(new a.w.Event('change'));
 assert.equal(panel.querySelector('[data-find-count]').textContent,'1 de 2');
 panel.querySelector('[data-find-case]').checked=false;panel.querySelector('[data-find-case]').dispatchEvent(new a.w.Event('change'));
 panel.querySelector('[data-replace-input]').value='acordo';
 panel.querySelector('[data-find="all"]').click();
 assert.deepEqual(texts(a),['O acordo e o acordo social.','acordo verbal.']);
 assert.equal(panel.querySelector('[data-find-count]').textContent,'Nenhum resultado');
 key(a,'z',{ctrlKey:true});
 assert.match(texts(a)[0],/contrato/);
 a.close();
});
test('substituir um de cada vez troca só a ocorrência atual',async()=>{
 const a=await setup('<p>ano a ano</p>');
 key(a,'h',{ctrlKey:true});
 const panel=a.d.querySelector('.bcpe-find');
 const input=panel.querySelector('[data-find-input]');input.value='ano';input.dispatchEvent(new a.w.Event('input'));
 panel.querySelector('[data-replace-input]').value='mês';
 panel.querySelector('[data-find="replace"]').click();
 assert.deepEqual(texts(a),['mês a ano']);
 assert.equal(panel.querySelector('[data-find-count]').textContent,'1 de 1');
 a.close();
});
test('Esc fecha a busca sem fechar o editor',async()=>{
 const a=await setup('<p>Texto.</p>');
 key(a,'f',{ctrlKey:true});
 const panel=a.d.querySelector('.bcpe-find');
 panel.querySelector('[data-find-input]').dispatchEvent(new a.w.KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true}));
 assert.equal(panel.hidden,true);
 assert.ok(a.d.querySelector('.bcpe-screen'));
 a.close();
});
test('contador mostra total de palavras e as selecionadas',async()=>{
 const a=await setup('<p>Uma frase com cinco palavras.</p><p>Mais duas.</p>');
 const words=a.d.querySelector('[data-words]');
 assert.equal(words.textContent,'7 palavras');
 const p=a.ws.querySelector('p');
 span(a,p.firstChild,0,p.firstChild,9);
 await wait(40);
 assert.equal(words.textContent,'2 de 7 palavras');
 a.close();
});
test('Enter na caixa de busca vai ao próximo resultado sem alterar o texto',async()=>{
 const a=await setup('<p>O contrato.</p><p>Outro contrato.</p>');
 key(a,'f',{ctrlKey:true});
 const panel=a.d.querySelector('.bcpe-find'),input=panel.querySelector('[data-find-input]');
 input.value='contrato';input.dispatchEvent(new a.w.Event('input'));
 input.dispatchEvent(new a.w.KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true}));
 assert.equal(panel.querySelector('[data-find-count]').textContent,'2 de 2');
 assert.deepEqual(texts(a),['O contrato.','Outro contrato.']);
 a.close();
});
