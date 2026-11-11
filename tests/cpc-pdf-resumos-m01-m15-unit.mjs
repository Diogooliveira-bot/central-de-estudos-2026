import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {JSDOM} from 'jsdom';

const read=p=>fs.readFileSync(p,'utf8');
const bundles=[1,6,11].map(n=>'content/cpc/cpc-resumos-pdf-m'+String(n).padStart(2,'0')+'-m'+String(n+4).padStart(2,'0')+'-20261110.js');
const source=n=>'content/cpc/m'+String(n).padStart(2,'0')+'-native-data.js';
const key=n=>'m'+String(n).padStart(2,'0');
const setup=()=>{
  const dom=new JSDOM('<!doctype html><body></body>',{runScripts:'outside-only',url:'https://preview.local',pretendToBeVisual:true});
  return {dom,w:dom.window};
};
const counts=value=>(String(value||'').match(/<h[23]>/g)||[]).length;

test('substitui apenas M01–M15 na versão resumida, sem alterar teoria completa e M16–M20',async()=>{
  const {dom,w}=setup();
  for(let n=1;n<=20;n++)w.eval(read(source(n)));
  const before=Array.from({length:20},(_,i)=>{
    const v=w.BASE_NATIVE_CONTENT.cpc[key(i+1)];
    return {summary:v.summary,complete:v.complete,completeChapters:JSON.stringify(v.chapters?.complete||[]),ids:(v.chapters?.summary||[]).map(c=>c.id)};
  });
  for(const f of bundles)w.eval(read(f));
  await Promise.resolve();
  for(let n=1;n<=20;n++){
    const v=w.BASE_NATIVE_CONTENT.cpc[key(n)],old=before[n-1];
    assert.equal(v.complete,old.complete,'teoria completa M'+n);
    assert.equal(JSON.stringify(v.chapters?.complete||[]),old.completeChapters,'capítulos completos M'+n);
    assert.deepEqual((v.chapters?.summary||[]).map(c=>c.id),old.ids,'IDs de progresso M'+n);
    if(n<=15){
      assert.notEqual(v.summary,old.summary,'resumo substituído M'+n);
      assert(v.summary.length>3000,'densidade didática M'+n);
      assert(counts(v.summaryHtml)>=8,'hierarquia de títulos M'+n);
      assert.match(v.summaryHtml,/<h2>Antes de começar:/,'abertura didática M'+n);
      assert.equal(v.summaryOrigin,'PDF teórico M01-M15 (10/11/2026)');
      assert((v.chapters?.summary||[]).every(c=>v.summaryHtml.includes(c.match.replaceAll('&','&amp;'))),'sumário apontando para seções M'+n);
    } else {
      assert.equal(v.summary,old.summary,'resumo não solicitado M'+n);
    }
  }
  dom.window.close();
});

test('sobrescreve HTML antigo mesmo se scripts de conteúdo carregarem depois',async()=>{
  const {dom,w}=setup();
  for(const f of bundles)w.eval(read(f));
  for(const n of [1,6,8,11,15]){
    w.eval(read(source(n)));
  }
  await Promise.resolve();
  for(const n of [1,6,8,11,15]){
    const v=w.BASE_NATIVE_CONTENT.cpc[key(n)];
    assert.equal(v.summaryOrigin,'PDF teórico M01-M15 (10/11/2026)');
    assert.match(v.summaryHtml,/<h2>Antes de começar:/);
    assert(counts(v.summaryHtml)>=8,'títulos preservados M'+n);
  }
  dom.window.close();
});
