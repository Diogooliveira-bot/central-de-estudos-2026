import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const source=readFileSync(new URL('../ui/editor-premium-v1.js',import.meta.url),'utf8');
const wait=(ms=20)=>new Promise(r=>setTimeout(r,ms));

async function setup(){
 const dom=new JSDOM('<!doctype html><html><body><div class="bc-native-reader-overlay">'+
 '<div class="bc-native-reader-title"><b>Constitucional</b><small>Módulo 03</small></div>'+
 '<div class="bc-native-reader-tools"></div><article class="bc-native-article">'+
 '<h2>CAPÍTULO 3</h2>'+
 '<figure class="bc-editor-image">'+
 '<img alt="Infográfico" src="/assets/example.png">'+
 '<p class="mono" style="font-family:monospace">Os <code>tribunais</code> possuem autonomia.</p>'+
 '<p class="following">Outro parágrafo no mesmo bloco.</p>'+
 '<div class="bc-editor-table-wrap"><table><tbody><tr><td>Dados</td><td>Valor</td></tr></tbody></table></div>'+
 '</figure></article></div></body></html>',{
 url:'https://example.test/central-v119.html',runScripts:'outside-only',pretendToBeVisual:true
 });
 const w=dom.window;let posted=null;
 w.MutationObserver=class{observe(){}disconnect(){}};
 w.confirm=()=>true;w.prompt=()=>null;
 w.fetch=async(uri,options={})=>{
  if(String(uri).startsWith('/api/auth'))return{ok:true,json:async()=>({authenticated:true,user:{role:'admin'}})};
  if(options.method==='POST'){posted=JSON.parse(options.body);return{ok:true,json:async()=>({ok:true,revision:1})}};
  return{ok:true,json:async()=>({exists:false})};
 };
 w.eval(source);await wait();
 w.document.querySelector('.bcpe-launch').click();await wait();
 const doc=w.document,fig=doc.querySelector('.bcpe-workspace figure');
 const p=fig.querySelector('.mono'),other=fig.querySelector('.following');
 return {dom,w,doc,fig,p,other,get posted(){return posted},close(){dom.window.close()}};
}
function change(app,selector,value){
 const el=app.doc.querySelector(selector);el.value=value;el.dispatchEvent(new app.w.Event('change',{bubbles:true}));return el;
}
test('seções antigas com imagem e tabela possuem identificação de conteúdo composto e campos independentes',async()=>{
 const a=await setup();
 assert.match(a.doc.querySelector('.bcpe-block-composite .bcpe-block-name').textContent,/Seção ilustrada/);
 assert.equal(a.p.getAttribute('contenteditable'),'true');
 assert.equal(a.other.getAttribute('contenteditable'),'true');
 assert.ok(a.doc.querySelector('.bcpe-block-composite img'));
 assert.ok(a.doc.querySelector('.bcpe-block-composite table'));
 a.close();
});
test('alteração de estilo funciona em parágrafo interno de figura composta sem converter a figura inteira',async()=>{
 const a=await setup();a.p.focus();
 change(a,'[data-style]','h1');
 const h=a.fig.querySelector('h1');
 assert.ok(h,'texto interno convertido em título 1');
 assert.match(h.textContent,/tribunais/);
 assert.ok(a.fig.querySelector('img'),'imagem preservada');
 assert.ok(a.fig.querySelector('table'),'tabela preservada');
 assert.ok(a.fig.querySelector('p.following'),'segundo parágrafo preservado');
 assert.match(a.doc.querySelector('[data-context]').textContent,/Título 1/);
 a.close();
});
test('alinhamento afeta somente parágrafo ativo e não figura, tabela nem outro parágrafo',async()=>{
 const a=await setup();a.other.focus();
 change(a,'[data-align]','right');
 assert.equal(a.other.style.textAlign,'right');
 assert.equal(a.p.style.textAlign,'');
 assert.equal(a.fig.style.textAlign,'');
 assert.match(a.doc.querySelector('[data-context]').textContent,/Parágrafo/);
 a.close();
});
test('alterar fonte sem seleção altera somente parágrafo atual',async()=>{
 const a=await setup();a.p.focus();
 change(a,'[data-font]','Arial');change(a,'[data-size]','18');
 assert.equal(a.p.style.fontFamily,'Arial');
 assert.equal(a.p.style.fontSize,'18px');
 assert.equal(a.other.style.fontFamily,'');
 a.close();
});
test('seleção é preservada quando menu de fonte rouba foco',async()=>{
 const a=await setup(),text=a.other.firstChild;
 a.other.focus();
 const range=a.doc.createRange();range.setStart(text,0);range.setEnd(text,5);
 const selection=a.w.getSelection();selection.removeAllRanges();selection.addRange(range);
 const dropdown=a.doc.querySelector('[data-font]');
 dropdown.dispatchEvent(new a.w.Event('pointerdown',{bubbles:true}));
 selection.removeAllRanges();
 change(a,'[data-font]','Verdana');
 assert.equal(a.other.querySelector('span')?.style.fontFamily,'Verdana');
 assert.match(a.other.textContent,/Outro parágrafo/);
 a.close();
});
test('limpar formatação corrige parágrafo monoespaçado e mantém elementos vizinhos',async()=>{
 const a=await setup();a.p.focus();
 a.doc.querySelector('[data-action="clear-format"]').click();
 assert.equal(a.p.querySelector('code'),null);
 assert.equal(a.p.getAttribute('style'),null);
 assert.equal(a.other.textContent,'Outro parágrafo no mesmo bloco.');
 a.close();
});
test('publicação elimina marcadores de seleção, preserva imagem e tabela e não inclui controles',async()=>{
 const a=await setup();a.p.focus();
 change(a,'[data-align]','center');
 a.doc.querySelector('[data-action="publish"]').click();await wait();
 assert.ok(a.posted);
 assert.match(a.posted.html,/example.png/);
 assert.match(a.posted.html,/<table/);
 assert.match(a.posted.html,/text-align: center/);
 assert.doesNotMatch(a.posted.html,/bcpe-field-selected|contenteditable|data-bcpe-edit|bcpe-block-actions/);
 a.close();
});
