import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const script=readFileSync(new URL('../ui/hide-infographics-v1.js',import.meta.url),'utf8');
const central=readFileSync(new URL('../central-v119.html',import.meta.url),'utf8');
const wait=(ms=25)=>new Promise(r=>setTimeout(r,ms));
const CARDS='<section class="subject">'+
 '<article class="pt-cf-card pt-cf-card-complete"><button>Estudar conteúdo</button></article>'+
 '<article class="pt-cf-card pt-cf-card-map" id="pt"><button>Visualizar infográfico</button></article>'+
 '<article class="cf-study-card cf-study-map" id="cf"></article>'+
 '<div data-native-kind="mindmap" id="penal"></div>'+
 '<article class="cpc-approved-card" data-cpc-approved-card="map" id="cpc"></article>'+
 '<article class="adm-native-card adm-native-visual" data-kind="infographic" id="cpp"></article>'+
 '<article class="cv-standard-card cv-card-infographic" id="civil"></article>'+
 '<article class="adm-cf-card adm-cf-card-map" id="adm"></article>'+ 
 '<article class="bc-rlm-study-card bc-rlm-study-map" id="rlm"><button>Visualizar mapa</button></article>'+ 
 '</section>';

async function setup(role,{guest=false}={}){
 const dom=new JSDOM('<!doctype html><html><head></head><body>'+CARDS+'</body></html>',{runScripts:'outside-only',pretendToBeVisual:true});
 const w=dom.window;
 w.BASE_COMPLETA_USER={role};w.__BASE_COMPLETA_USER_ROLE__=role;w.__BASE_COMPLETA_PREVIEW_GUEST__=guest;
 w.eval(script);await wait();
 const close=w.close.bind(w);w.close=()=>{w.requestAnimationFrame=()=>0;close()};
 w.document.querySelector('#pt button').addEventListener('click',()=>{w.opened=1});
 return{w,d:w.document,hidden:id=>w.getComputedStyle(w.document.getElementById(id)).display==='none'};
}

test('aluno não vê infográficos nem mapas mentais em nenhuma disciplina',async()=>{
 const a=await setup('aluno');
 for(const id of ['pt','cf','penal','cpc','cpp','civil','adm','rlm'])assert.ok(a.hidden(id),id+' deveria estar oculto');
 assert.notEqual(a.w.getComputedStyle(a.d.querySelector('.pt-cf-card-complete')).display,'none');
 a.w.close();
});
test('cartão com outro formato é ocultado pelo rótulo do botão, inclusive se aparecer depois',async()=>{
 const a=await setup('aluno');
 const late=a.d.createElement('article');late.id='late';late.innerHTML='<button>Visualizar mapa mental</button>';
 a.d.querySelector('.subject').append(late);await wait(60);
 assert.ok(a.hidden('late'));
 a.w.close();
});
test('clique que chegue ao cartão não abre a imagem',async()=>{
 const a=await setup('aluno');
 a.d.querySelector('#pt button').click();
 assert.equal(a.w.opened,undefined);
 a.w.close();
});
test('infográficos removidos também para administrador e editor',async()=>{
 for(const role of ['admin','editor']){
  const a=await setup(role);
  assert.equal(a.d.documentElement.classList.contains('bc-infographics-hidden'),true);
  for(const id of ['pt','cf','penal','cpc','cpp','civil','adm','rlm'])assert.ok(a.hidden(id),id+' deve ficar oculto para '+role);
  a.d.querySelector('#pt button').click();assert.equal(a.w.opened,undefined);
  a.w.close();
 }
});
test('convidado da prévia é tratado como aluno',async()=>{
 const a=await setup('admin',{guest:true});
 assert.ok(a.hidden('pt'));
 a.w.close();
});
test('a Central carrega o script de ocultação',()=>{
 assert.match(central,/'ui\/hide-infographics-v1\.js\?v=[^']+'/);
});


test('remoção visual cobre 8 disciplinas, sem retirar conteúdos ou deixar CF incompletable',()=>{
 const css=readFileSync(new URL('../ui/module-clean-v1.css',import.meta.url),'utf8');
 const cf=readFileSync(new URL('../ui/cf-native-study-v2.js',import.meta.url),'utf8');
 const rlm=readFileSync(new URL('../ui/rlm-native-v1.js',import.meta.url),'utf8');
 const index=readFileSync(new URL('../index.html',import.meta.url),'utf8');
 const offline=JSON.parse(readFileSync(new URL('../central-offline-files-v66172.json',import.meta.url),'utf8')).files;
 const selectors=[
  '.cv-standard-card.cv-card-infographic',
  '.adm-cf-card.adm-cf-card-map',
  '.adm-native-card.adm-native-visual[data-kind="infographic"]',
  '.cf-study-card.cf-study-map',
  '.pt-cf-card.pt-cf-card-map',
  '.bc-native-material-card[data-native-kind="mindmap"]',
  '.cpc-approved-card.cpc-approved-map',
  '.bc-mindmap-entry',
  '.bc-rlm-study-card.bc-rlm-study-map'
 ];
 for(const sel of selectors)assert.ok(css.includes(sel),sel);
 assert.match(css,/\[data-bc-image-export\]/);
 assert.match(cf,/const done=\[legacyReadingDone\(n\),x\.summaryRead,x\.summaryQuiz,x\.completeRead,x\.completeQuiz,x\.decorando\]/);
 assert.match(cf,/Math\.round\(done\/6\*100\)/);
 assert.match(rlm,/const order=\['theory','recap','quiz'\]/);
 assert.doesNotMatch(rlm,/\['map','Mapa mental'\]/);
 assert.ok(index.includes('/ui/cf-native-study-v2.js?v=20261112nomaps1'));
 assert.ok(index.includes('/ui/rlm-native-v1.js?v=20261112nomaps1'));
 for(const entry of [
  '/ui/cf-native-study-v2.js?v=20261112nomaps1',
  '/ui/hide-infographics-v1.js?v=20261112all1',
  '/ui/module-clean-v1.css?v=20261112noinfographics1'
 ])assert.ok(offline.includes(entry),entry);
 assert.match(central,/hide-infographics-v1\.js\?v=20261112all1/);
 assert.match(central,/module-clean-v1\.css\?v=20261112noinfographics1/);
});
