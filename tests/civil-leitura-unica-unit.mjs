import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {JSDOM} from 'jsdom';

const code=fs.readFileSync('content/civil/civil-teoria-guiada-reader-v1.js','utf8');
const topic=['Pessoa jurídica: entidade distinta das pessoas que a formam','A pessoa jurídica tem personalidade própria e responde pelas obrigações que assume.','Exemplo da associação que contrata serviços.','Código Civil, arts. 40 a 44.','A responsabilidade patrimonial é examinada conforme o regime legal.','Pegadinha: pessoa jurídica não se confunde com seus associados.','Recorde o conceito e a classificação.','Consigo explicar a diferença entre pessoa jurídica e associados.'];

test('Direito Civil M01–M15: leitor de um único fluxo sem abas de revisão, preservando conteúdo e progresso',()=>{
 const dom=new JSDOM('<!doctype html><html><head></head><body></body></html>',{url:'https://preview.local',runScripts:'outside-only',pretendToBeVisual:true});
 const w=dom.window;
 w.BC_CIV_GUIDED_MODULES={4:{topics:[topic]}};
 w.BC_CIV_GUIDED_LAW={4:{0:[['CC, art. 40',['Art. 40. As pessoas jurídicas são de direito público, interno ou externo, e de direito privado.']]]}};
 let progress=0;
 w.CivilNative={markGuidedRead:n=>{assert.equal(n,4);progress++;}};
 w.eval(code);
 assert.equal(w.BcCivilGuidedReader.open(4),true);
 const d=w.document,overlay=d.querySelector('.civil-guided-reading');
 assert(overlay);
 assert.equal(overlay.querySelectorAll('.bc-m01-toolbar button').length,1,'apenas Voltar no cabeçalho');
 assert(!overlay.querySelector('[data-bc-guided-mode]'),'sem botões de modos');
 assert(!overlay.textContent.includes('Revisão rápida'),'sem aba de revisão rápida');
 assert(!overlay.querySelector('[data-view="review"]'),'sem modo que oculte a teoria');
 assert(overlay.querySelector('.bc-apostila-v20261111'),'leitor unificado ativo');
 const topicView=overlay.querySelector('.bc-apostila-topic');
 for(const cls of ['prose','example','law']){
   const el=topicView?.querySelector('.bc-apostila-'+cls);
   assert(el&&el.textContent.trim().length>0,cls+' preservado');
 }
 assert(overlay.querySelector('.bc-apostila-sintese'),'síntese mantida');
 assert(overlay.querySelector('.bc-m01-lei-seca summary'),'lei seca preservada');
 const check=overlay.querySelector('[data-bc-guided-check="0"]');
 assert(check);
 check.checked=true;check.dispatchEvent(new w.Event('change',{bubbles:true}));
 assert(JSON.parse(w.localStorage.getItem('bc:civil:m04:teoria-guiada:checklist:v1'))['0']);
 const scroller=overlay.querySelector('.bc-m01-scroll');
 Object.defineProperty(scroller,'scrollHeight',{configurable:true,value:1000});
 Object.defineProperty(scroller,'clientHeight',{configurable:true,value:400});
 scroller.scrollTop=560;scroller.dispatchEvent(new w.Event('scroll'));
 scroller.scrollTop=590;scroller.dispatchEvent(new w.Event('scroll'));
 assert.equal(progress,1,'progresso registrado somente uma vez');
 w.BcCivilGuidedReader.close();
 assert.equal(d.querySelector('.civil-guided-reading'),null);
 dom.window.close();
});
