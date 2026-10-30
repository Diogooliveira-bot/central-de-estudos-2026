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
  localStorage:{getItem(){return null},setItem(){},removeItem(){}},
  requestAnimationFrame(fn){fn()},
  console:{warn(){},error(){}},
 },{timeout:1500});
 await new Promise(setImmediate);
 return {window,loader,requests,original};
}

test('gratuito apresenta os mesmos invólucros de módulos de Português e mantém 3 abas seguras',async()=>{
 const h=await harness('free');
 h.loader.open('cf');
 await new Promise(setImmediate);
 const topics=Array.from({length:15},(_,i)=>({title:String(i+1).padStart(2,'0')+' TÍTULO DO MÓDULO'}));
 let markup=h.loader.placeholder({id:'cf',topics});
 assert.equal((markup.match(/class="cf-module bc-free-module/g)||[]).length,15);
 assert.match(markup,/class="cf-module-head bc-free-module-head"/);
 assert.match(markup,/class="cf-modules bc-free-list"/);
 assert.match(markup,/class="cf-module-no">MÓDULO 01/);
 assert.doesNotMatch(markup,/class="ds-module /);
 assert.doesNotMatch(markup,/class="bc-free-heading"/);
 assert.doesNotMatch(markup,/MÓDULO 01.*01 TÍTULO DO MÓDULO/);
 assert.doesNotMatch(markup,/bc-free-tab-cf-summary/,'nenhum módulo inicia expandido sem escolha');
 assert.deepEqual(h.original,[]);
 assert.deepEqual(h.requests,['/api/plans?action=me'],'o cadastro gratuito não baixa teoria só por abrir disciplina');
 await h.window.CentralFreeReader.module('cf',1);
 markup=h.loader.placeholder({id:'cf',topics});
 assert.match(markup,/role="tablist"/);
 assert.match(markup,/bc-free-tab-cf-summary/);
 assert.match(markup,/bc-free-tab-cf-complete/);
 assert.match(markup,/bc-free-tab-cf-infographic/);
 assert.match(markup,/class="ptn-tabs bc-free-tabs"/);
 assert.match(markup,/class="ptn-tab bc-free-tab"/);
 assert.equal(h.requests.filter(url=>url==='/content/cf/m01-native-data.js').length,1);
 h.window.CentralFreeReader.tab('cf','complete');
 assert.match(h.loader.placeholder({id:'cf',topics}),/Teoria completa — Premium/);
 h.window.CentralFreeReader.tab('cf','infographic');
 assert.match(h.loader.placeholder({id:'cf',topics}),/Infográfico indisponível no Gratuito/);
 assert.equal(h.requests.filter(url=>url.startsWith('/content/')).length,1,'abas bloqueadas não baixam dados Premium');
 await h.window.CentralFreeReader.module('cf',1);
 assert.doesNotMatch(h.loader.placeholder({id:'cf',topics}),/bc-free-tab-cf-summary/,'mesmo módulo recolhe como no Português');
 const before=h.requests.length;
 await h.window.CentralFreeReader.module('cf',999);
 assert.equal(h.requests.length,before);
});

test('contador de módulos contempla 6 disciplinas sem gerar links Premium',async()=>{
 const h=await harness('free');
 const counts={cf:15,penal:17,cpc:20,adm:20,civil:15,cpp:22};
 for(const [id,count] of Object.entries(counts)){
  h.loader.open(id);
  await new Promise(setImmediate);
  const html=h.loader.placeholder({id,topics:[]});
  assert.equal((html.match(/class="cf-module bc-free-module/g)||[]).length,count,id);
  assert.doesNotMatch(html,/<a[^>]+(?:tecconcursos|qconcursos|complete\.pdf)/i);
 }
 assert.equal(h.requests.filter(url=>url.startsWith('/content/')).length,0);
});

test('Premium usa exclusivamente leitor original e não recebe a projeção do Gratuito',async()=>{
 const h=await harness('premium');
 h.loader.open('cf');
 assert.deepEqual(h.original,['cf']);
 assert.equal(h.loader.placeholder({id:'cf'}),'original-placeholder-cf');
 assert.equal(h.requests.filter(url=>url.startsWith('/content/')).length,0);
});
