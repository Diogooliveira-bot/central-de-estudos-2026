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
 for(const id of ['pt','cf','penal','cpc','cpp','civil','adm'])assert.ok(a.hidden(id),id+' deveria estar oculto');
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
test('administrador e editor continuam vendo para revisar',async()=>{
 for(const role of ['admin','editor']){
  const a=await setup(role);
  assert.equal(a.d.documentElement.classList.contains('bc-infographics-hidden'),false);
  assert.equal(a.hidden('pt'),false);
  a.d.querySelector('#pt button').click();assert.equal(a.w.opened,1);
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
