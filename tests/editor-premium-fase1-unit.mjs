import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const premium=readFileSync(new URL('../ui/editor-premium-v1.js',import.meta.url),'utf8');
const legacy=readFileSync(new URL('../ui/visual-editor-v1.js',import.meta.url),'utf8');
const wait=(ms=25)=>new Promise(r=>setTimeout(r,ms));

async function setup(article,{role='admin',withLegacy=false}={}){
 const dom=new JSDOM('<!doctype html><html><body><div class="bc-native-reader-overlay">'+
  '<div class="bc-native-reader-title"><b>Direito Penal</b><small>Módulo 2</small></div>'+
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
 if(withLegacy)w.eval(legacy);
 w.eval(premium);await wait();
 const d=w.document;d.querySelector('.bcpe-launch').click();await wait();
 return{w,d,posts,ws:d.querySelector('.bcpe-workspace'),close(){w.close()}};
}
function caret(app,node,offset){
 const r=app.d.createRange();r.setStart(node,offset);r.collapse(true);
 const s=app.w.getSelection();s.removeAllRanges();s.addRange(r);
}
function select(app,node,start,end){
 const r=app.d.createRange();r.setStart(node,start);r.setEnd(node,end);
 const s=app.w.getSelection();s.removeAllRanges();s.addRange(r);
}
function key(app,target,k,extra={}){
 target.dispatchEvent(new app.w.KeyboardEvent('keydown',Object.assign({key:k,bubbles:true,cancelable:true},extra)));
}
function focusCell(app,cell){cell.focus();cell.dispatchEvent(new app.w.Event('focusin',{bubbles:true}))}
const plain=html=>html.replace(/ (class|contenteditable|data-bcpe-edit)="[^"]*"/g,'');

test('Enter no fim de um item cria novo item na lista',async()=>{
 const a=await setup('<ul><li>Item A</li><li>Item B</li></ul>');
 const li=a.ws.querySelectorAll('li')[1];li.focus();caret(a,li.firstChild,6);
 key(a,li,'Enter');
 const items=a.ws.querySelectorAll('li');
 assert.equal(items.length,3);
 assert.equal(items[2].getAttribute('contenteditable'),'true');
 assert.equal(a.ws.querySelector('li div'),null);
 a.close();
});
test('Enter num item vazio sai da lista e cria parágrafo',async()=>{
 const a=await setup('<ul><li>Item A</li><li></li></ul>');
 const li=a.ws.querySelectorAll('li')[1];li.focus();caret(a,li,0);
 key(a,li,'Enter');
 assert.equal(a.ws.querySelectorAll('li').length,1);
 assert.ok(a.ws.querySelector('.bcpe-block p.bcpe-node'),'parágrafo criado depois da lista');
 a.close();
});
test('Enter no meio do parágrafo divide em dois blocos; depois de título vem texto normal',async()=>{
 const a=await setup('<h2>Título</h2><p>Primeira parte segunda parte</p>');
 const p=a.ws.querySelector('p');p.focus();caret(a,p.firstChild,15);
 key(a,p,'Enter');
 const ps=a.ws.querySelectorAll('p.bcpe-node');
 assert.equal(ps.length,2);
 assert.equal(ps[0].textContent,'Primeira parte ');
 assert.equal(ps[1].textContent,'segunda parte');
 assert.equal(a.ws.querySelector('p div'),null);
 const h=a.ws.querySelector('h2');h.focus();caret(a,h.firstChild,6);
 key(a,h,'Enter');
 assert.equal(h.closest('.bcpe-block').nextElementSibling.querySelector('.bcpe-node').tagName,'P');
 a.close();
});
test('Shift+Enter quebra a linha dentro do mesmo parágrafo',async()=>{
 const a=await setup('<p>Linha um linha dois</p>');
 const p=a.ws.querySelector('p');p.focus();caret(a,p.firstChild,9);
 key(a,p,'Enter',{shiftKey:true});
 assert.equal(a.ws.querySelectorAll('p').length,1);
 assert.ok(p.querySelector('br'));
 a.close();
});
test('Backspace no início junta com o parágrafo de cima',async()=>{
 const a=await setup('<p>Antes.</p><p>Depois.</p>');
 const second=a.ws.querySelectorAll('p')[1];second.focus();caret(a,second.firstChild,0);
 key(a,second,'Backspace');
 const ps=a.ws.querySelectorAll('p');
 assert.equal(ps.length,1);
 assert.equal(ps[0].textContent,'Antes.Depois.');
 a.close();
});
test('Negrito liga e desliga no mesmo trecho, sem negrito duplicado',async()=>{
 const a=await setup('<p>Texto importante aqui.</p>');
 const p=a.ws.querySelector('p');p.focus();select(a,p.firstChild,6,16);
 const bold=a.d.querySelector('[data-format="strong"]');
 bold.click();
 assert.equal(p.querySelector('strong')?.textContent,'importante');
 assert.equal(bold.getAttribute('aria-pressed'),'true');
 bold.click();
 assert.equal(p.querySelector('strong'),null);
 assert.equal(p.textContent,'Texto importante aqui.');
 a.close();
});
test('Desligar negrito em parte do trecho mantém o resto em negrito',async()=>{
 const a=await setup('<p><strong>abcdef</strong></p>');
 const p=a.ws.querySelector('p'),t=p.querySelector('strong').firstChild;p.focus();select(a,t,2,4);
 a.d.querySelector('[data-format="strong"]').click();
 assert.equal(plain(p.innerHTML),'<strong>ab</strong>cd<strong>ef</strong>');
 a.close();
});
test('Ctrl+B sem seleção formata a palavra do cursor',async()=>{
 const a=await setup('<p>uma palavra só</p>');
 const p=a.ws.querySelector('p');p.focus();caret(a,p.firstChild,6);
 key(a,p,'b',{ctrlKey:true});
 assert.equal(p.querySelector('strong')?.textContent,'palavra');
 a.close();
});
test('menus de alinhamento voltam ao rótulo e podem repetir a mesma opção',async()=>{
 const a=await setup('<p>Um.</p><p>Dois.</p>');
 const [p1,p2]=a.ws.querySelectorAll('p'),align=a.d.querySelector('[data-align]');
 p1.focus();align.value='center';align.dispatchEvent(new a.w.Event('change',{bubbles:true}));
 assert.equal(align.value,'');
 p2.focus();align.value='center';align.dispatchEvent(new a.w.Event('change',{bubbles:true}));
 assert.equal(p1.style.textAlign,'center');assert.equal(p2.style.textAlign,'center');
 a.close();
});
test('Desfazer volta só o último passo, Refazer recupera e o cursor fica no texto',async()=>{
 const a=await setup('<p>Um.</p><p>Dois.</p>');
 const p2=a.ws.querySelectorAll('p')[1],align=a.d.querySelector('[data-align]');
 p2.focus();align.value='right';align.dispatchEvent(new a.w.Event('change',{bubbles:true}));
 p2.focus();align.value='center';align.dispatchEvent(new a.w.Event('change',{bubbles:true}));
 key(a,p2,'z',{ctrlKey:true});
 const after=a.ws.querySelectorAll('p')[1];
 assert.equal(after.style.textAlign,'right');
 assert.equal(a.d.activeElement,after);
 key(a,after,'y',{ctrlKey:true});
 assert.equal(a.ws.querySelectorAll('p')[1].style.textAlign,'center');
 a.close();
});
test('ícones SVG do material continuam após publicar, sem animações',async()=>{
 const a=await setup('<p><svg width="10" height="10"><circle r="5"></circle><animate attributeName="href"></animate></svg> Com ícone.</p>');
 a.d.querySelector('[data-action="publish"]').click();await wait();
 assert.equal(a.posts.length,1);
 assert.match(a.posts[0].html,/<svg/);
 assert.doesNotMatch(a.posts[0].html,/<animate/);
 a.close();
});
test('texto solto dentro de caixa passa a ser editável',async()=>{
 const a=await setup('<div class="caixa">Texto solto na caixa.</div>');
 assert.equal(a.ws.querySelector('.caixa').getAttribute('contenteditable'),'true');
 a.close();
});
test('Esc não fecha o editor e Ctrl+S só guarda o rascunho',async()=>{
 const a=await setup('<p>Texto.</p>');
 const p=a.ws.querySelector('p');
 key(a,p,'Escape');
 assert.ok(a.d.querySelector('.bcpe-screen'));
 key(a,p,'s',{ctrlKey:true});await wait();
 assert.equal(a.posts.length,0);
 const id=a.w.BCPremiumEditor.contentId(a.d.querySelector('.bc-native-reader-overlay'));
 assert.ok(a.w.localStorage.getItem('bcpe:draft:v1:'+id));
 a.close();
});
test('publicar pede confirmação',async()=>{
 const a=await setup('<p>Texto.</p>');a.w.confirm=()=>false;
 a.d.querySelector('[data-action="publish"]').click();await wait();
 assert.equal(a.posts.length,0);
 a.close();
});
test('tabela permite excluir linha e coluna da célula atual',async()=>{
 const a=await setup('<div class="bc-editor-table-wrap"><table><thead><tr><th>A</th><th>B</th><th>C</th></tr></thead><tbody><tr><td>1</td><td>2</td><td>3</td></tr><tr><td>4</td><td>5</td><td>6</td></tr></tbody></table></div>');
 focusCell(a,[...a.ws.querySelectorAll('td')].find(c=>c.textContent==='5'));
 a.ws.querySelector('[data-action="table-col-remove"]').click();
 assert.equal(a.ws.querySelector('thead tr').cells.length,2);
 assert.doesNotMatch(a.ws.querySelector('table').textContent,/B|5/);
 focusCell(a,[...a.ws.querySelectorAll('td')].find(c=>c.textContent==='4'));
 a.ws.querySelector('[data-action="table-row-remove"]').click();
 assert.equal(a.ws.querySelector('tbody').rows.length,1);
 a.close();
});
test('com o Editor Premium carregado, o botão antigo Editar não aparece',async()=>{
 const a=await setup('<p>Texto.</p>',{withLegacy:true});
 assert.equal(a.d.querySelector('.bc-editor-trigger'),null);
 assert.ok(a.d.querySelector('.bcpe-launch'));
 a.close();
});
