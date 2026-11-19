import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {JSDOM} from 'jsdom';

const read=p=>fs.readFileSync(p,'utf8');
const chars=s=>String(s).replace(/\s+/g,'');
function setup(n){
 const dom=new JSDOM('<!doctype html><body></body>',{runScripts:'outside-only',url:'https://preview.local',pretendToBeVisual:true}),w=dom.window;
 w.HTMLElement.prototype.scrollIntoView=()=>{};w.Response=Response;w.Blob=Blob;w.DecompressionStream=DecompressionStream;w.alert=msg=>{throw Error(msg)};
 const id=String(n).padStart(2,'0');
 w.eval(read('content/cpc/m'+id+'-native-data.js'));
 w.eval(read('content/cpc/cpc-review-didactic-'+(n<=4?'m01-m04':'m05-m08')+'.js'));
 w.eval(read('content/cpc/cpc-reading-laws-v1.js'));
 w.eval(read('content/cpc/cpc-complete-tables-v1.js'));
 w.eval(read('ui/cpc-apostila-reading-v1.js'));
 w.eval(read(n===1?'ui/cpc-native-study-reader.js':'ui/cpc-m'+id+'-native-study-reader.js'));
 return {dom,w,api:n===1?w.CpcNativeReader:w['CpcM'+id+'NativeReader']};
}

test('CPC teoria completa M01–M08: quadros reconstruídos usam só palavras do trecho original',()=>{
 const {w,dom}=setup(1);let total=0;
 for(let n=1;n<=8;n++){
  const id='m'+String(n).padStart(2,'0');
  const {w:wn,dom:dn}=setup(n);
  const source=wn.BASE_NATIVE_CONTENT.cpc[id].complete,lines=source.split(/\r?\n/);
  const tables=JSON.parse(JSON.stringify(wn.BASE_CPC_COMPLETE_TABLES[id]||[]));
  assert.ok(tables.length>0,id+' sem quadros');
  let prev=-1;
  for(const t of tables){
   assert.ok(t.from>prev&&t.to>=t.from&&t.to<lines.length,id+' intervalo inválido '+t.from+'-'+t.to);prev=t.to;
   assert.ok(t.header.length>=2&&t.rows.length>=1);
   for(const r of t.rows){assert.equal(r.length,t.header.length,id+' linha com número errado de células');for(const c of r)assert.ok(c.trim(),id+' célula vazia');}
   // nenhuma palavra nova: cada letra das células existe no trecho original
   const original=chars(lines.slice(t.from,t.to+1).join(' '));
   const mine=chars([...t.header,...t.rows.flat(),t.lead||'',t.trail||''].join(' '));
   const bag=new Map();for(const ch of original)bag.set(ch,(bag.get(ch)||0)+1);
   for(const ch of mine){const c=bag.get(ch)||0;assert.ok(c>0,id+' letra a mais "'+ch+'" no quadro '+t.from+'-'+t.to);bag.set(ch,c-1);}
  }
  total+=tables.length;dn.window.close();
 }
 assert.ok(total>=40,'esperado ao menos 40 quadros, achei '+total);
 dom.window.close();
});

test('CPC teoria completa: leitor desenha os quadros como tabelas e o resumo não muda',async()=>{
 for(const n of [1,2,4,5,6,7,8]){
  const {w,dom,api}=setup(n),id='m'+String(n).padStart(2,'0');
  const expected=w.BASE_CPC_COMPLETE_TABLES[id].length;
  await api.open('complete');
  const article=w.document.querySelector('.bc-native-article');
  const mine=[...article.querySelectorAll('.cpc-comparison table')].filter(t=>t.querySelector('thead th'));
  const rendered=mine.length;
  assert.equal(rendered,expected,id+': tabelas na tela');
  for(const table of mine){assert.ok(table.querySelector('thead th'));assert.ok(table.querySelectorAll('tbody tr').length>=1);}
  assert.equal(article.querySelectorAll('[class*="cpctab"]').length,0);
  assert.ok(!article.textContent.includes('\u0001'),id+': marcador interno vazou para a tela');
  api.close();
  await api.open('summary');
  const sum=w.document.querySelector('.bc-native-article');
  assert.ok(!sum.textContent.includes('\u0001'));
  api.close();dom.window.close();
 }
});

test('CPC: arquivo dos quadros da teoria completa é protegido como conteúdo completo',async()=>{
 const {protectedAsset}=await import('../lib/protected-content.js');
 assert.equal(protectedAsset('/content/cpc/cpc-complete-tables-v1.js')?.feature,'theory.complete');
 assert.equal(protectedAsset('/content/cpc/cpc-complete-tables-v1.js?v=20261120tabelas1')?.feature,'theory.complete');
});
