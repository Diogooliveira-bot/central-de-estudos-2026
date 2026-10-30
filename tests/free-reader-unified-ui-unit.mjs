import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const source=readFileSync(new URL('../central-free-disciplines.js',import.meta.url),'utf8');

async function harness(plan){
 const requests=[],original=[];
 const loader={
  open(id){original.push(id);return false;},
  placeholder(s){return 'original-placeholder-'+s.id;},
 };
 const fakeDocument={
  head:{appendChild(){}},
  createElement(){return {textContent:'',remove(){},innerHTML:''}},
  addEventListener(){},
  querySelector(){return null},
  getElementById(){return null},
 };
 const window={
  CentralDisciplineLoader:loader,
  openHome(){},
  renderSubjects(){},
  renderDisciplineGrid(){},
 };
 const fetch=async url=>{
  requests.push(url);
  if(url==='/api/plans?action=me')return {ok:true,json:async()=>({plan,isStaff:false})};
  return {ok:false,status:403};
 };
 vm.runInNewContext(source,{
  window,document:fakeDocument,fetch,
  localStorage:{setItem(){}},
  requestAnimationFrame(fn){fn()},
  console:{warn(){},error(){}},
 },{timeout:1500});
 await new Promise(setImmediate);
 return {window,loader,requests,original};
}

test('gratuito mostra os módulos padronizados e as três abas sem carregar teoria Premium',async()=>{
 const h=await harness('free');
 h.loader.open('cf');
 await new Promise(setImmediate);
 const topics=Array.from({length:15},(_,i)=>({title:String(i+1).padStart(2,'0')+' TÍTULO DO MÓDULO'}));
 const markup=h.loader.placeholder({id:'cf',topics});
 assert.equal((markup.match(/class="ds-module bc-free-module/g)||[]).length,15);
 assert.match(markup,/class="ds-module-head bc-free-module-head"/);
 assert.match(markup,/role="tablist"/);
 assert.match(markup,/bc-free-tab-cf-summary/);
 assert.match(markup,/bc-free-tab-cf-complete/);
 assert.match(markup,/bc-free-tab-cf-infographic/);
 assert.match(markup,/PLANO GRATUITO/);
 assert.doesNotMatch(markup,/M01 · 01 TÍTULO DO MÓDULO/);
 assert.deepEqual(h.original,[]);
 assert.ok(h.requests.every(url=>url==='/api/plans?action=me'||url==='/content/cf/m01-native-data.js'));
 h.window.CentralFreeReader.tab('cf','complete');
 assert.match(h.loader.placeholder({id:'cf',topics}),/Teoria completa — Premium/);
 h.window.CentralFreeReader.tab('cf','infographic');
 assert.match(h.loader.placeholder({id:'cf',topics}),/Infográfico indisponível no Gratuito/);
 const before=h.requests.length;
 h.window.CentralFreeReader.module('cf',999);
 assert.equal(h.requests.length,before);
});

test('Premium usa exclusivamente leitor original e não recebe a projeção do Gratuito',async()=>{
 const h=await harness('premium');
 h.loader.open('cf');
 assert.deepEqual(h.original,['cf']);
 assert.equal(h.loader.placeholder({id:'cf'}),'original-placeholder-cf');
 assert.equal(h.requests.filter(url=>url.startsWith('/content/')).length,0);
});
