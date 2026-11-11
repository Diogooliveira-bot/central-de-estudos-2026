import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {JSDOM} from 'jsdom';
import {protectedAsset} from '../lib/protected-content.js';
import {freePlanAsset} from './helpers/free-plan-content.mjs';

const root=resolve('.'),p=n=>String(n).padStart(2,'0');
const locked=/exclusivo do Base Completa Premium/i;

test('ADM M01–M20: 20 revisões autorais e apostilas resumo entregáveis sem premium',async()=>{
 for(let n=1;n<=20;n++){
  const authored='/content/adm/autor-20261110/adm-m'+p(n)+'-submitted-review.js';
  const summary='/content/adm/m'+p(n)+'-apostila-summary.js';
  const complete='/content/adm/m'+p(n)+'-apostila-complete.js';
  assert.equal(protectedAsset(authored),null,authored+' deve ser resumo acessível');
  assert.equal(protectedAsset(summary),null,summary+' deve ser resumo acessível');
  assert.equal(protectedAsset(complete)?.feature,'theory.complete',complete+' permanece Premium');
  const [a,b]=await Promise.all([readFile(resolve(root,'.'+authored),'utf8'),readFile(resolve(root,'.'+summary),'utf8')]);
  assert(a.includes('ADM_SUBMITTED_REVIEW')&&a.length>2000,authored+' possui apostila nova');
  assert(b.includes('ADM_APOSTILA_PACKED')&&b.length>1000,summary+' preserva bloco de questões');
 }
});

test('Processo Civil M01–M15: versão PDF substitui o resumo projetado ao aluno grátis',async()=>{
 const dom=new JSDOM('<!doctype html><body></body>',{url:'https://preview.local',runScripts:'outside-only'});
 const w=dom.window;
 for(let n=1;n<=15;n++){
  const f='/content/cpc/m'+p(n)+'-native-data.js';
  const a=await freePlanAsset(root,f);
  assert.equal(a?.status,200,f+' projeção do resumo gratuito');
  w.eval(a.body);
  assert.match(w.BASE_NATIVE_CONTENT?.cpc?.['m'+p(n)]?.complete||'',locked,'teoria completa bloqueada '+n);
 }
 for(const [a,b] of [[1,5],[6,10],[11,15]]){
  const name='content/cpc/cpc-resumos-pdf-m'+p(a)+'-m'+p(b)+'-20261110.js';
  assert.equal(protectedAsset('/'+name),null,name+' pode ser entregue ao aluno');
  w.eval(await readFile(resolve(root,name),'utf8'));
 }
 await Promise.resolve();
 for(let n=1;n<=15;n++){
  const rec=w.BASE_NATIVE_CONTENT.cpc['m'+p(n)];
  assert.equal(rec.summaryOrigin,'PDF teórico M01-M15 (10/11/2026)','material novo CPC M'+n);
  assert.match(rec.summaryHtml,/<h2>Antes de começar:/,'abertura didática M'+n);
  assert.match(rec.complete,locked,'Premium continua bloqueado M'+n);
 }
 dom.window.close();
});
