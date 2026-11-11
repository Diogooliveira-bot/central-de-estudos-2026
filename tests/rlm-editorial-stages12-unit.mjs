import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import vm from 'node:vm';
const root=new URL('../',import.meta.url);
const read=p=>fs.readFileSync(new URL(p,root),'utf8');

function fixture(){
 const storage=new Map(),nodes=new Map();
 const localStorage={
  getItem(k){return storage.has(k)?storage.get(k):null;},
  setItem(k,v){storage.set(k,String(v));},
  removeItem(k){storage.delete(k);}
 };
 const classSet=()=>({values:new Set(),add(x){this.values.add(x);},remove(x){this.values.delete(x);},toggle(x,on){if(on===undefined)on=!this.values.has(x);on?this.values.add(x):this.values.delete(x);return on;},contains(x){return this.values.has(x)}});
 const make=id=>({id,style:{},dataset:{},classList:classSet(),innerHTML:'',scrollHeight:500,clientHeight:150,scrollTop:0,isConnected:true,
  setAttribute(k,v){this[k]=v;},addEventListener(){},querySelector(){return null;},querySelectorAll(){return []},remove(){nodes.delete(id)},focus(){}});
 const body={classList:classSet(),appendChild(el){nodes.set(el.id,el);}};
 const doc={body,activeElement:{isConnected:true,focus(){}},readyState:'loading',addEventListener(){},
  getElementById(id){if(nodes.has(id))return nodes.get(id);if(id.startsWith('bcRlm')){const n=make(id);nodes.set(id,n);return n;}return null;},
  createElement(name){return make(name)}
 };
 const g={},c={window:g,document:doc,localStorage,URL,console,requestAnimationFrame(){},setTimeout(){}};
 vm.createContext(c);
 for(const name of ['estrutura','aulas-logica','aulas-raciocinio','aulas-matematica','aulas-estatistica','complementos-teoria']){
  new vm.Script(read('content/rlm-tjce-2026/'+name+'.js'),{filename:name}).runInContext(c);
 }
 new vm.Script(read('ui/rlm-theory-resources.js'),{filename:'resources'}).runInContext(c);
 new vm.Script(read('ui/rlm-native-v1.js'),{filename:'reader'}).runInContext(c);
 return {g,doc,storage,nodes,localStorage};
}

test('Etapas 1 e 2: todos os 14 módulos mantêm as teorias e os exemplos resolvidos',()=>{
 const {g}=fixture(),lessons=Object.entries(g.RLM_CURSO_AULAS);
 assert.equal(lessons.length,14);
 const before=JSON.stringify(g.RLM_CURSO_AULAS);
 let chapters=0;
 for(const [id,d] of lessons){
  assert.equal(d.theory.length,5,id);
  assert.equal(d.questions.length,10,id);
  assert.ok(d.summary.length>=5,id);
  for(const ch of d.theory){
   const html=g.RlmTheoryResources.chapter(ch);
   assert.match(html,/class="bc-rlm-worked-solution"/,id);
   assert.match(html,/Exemplo guiado:/,id);
   assert.match(html,/Respostas?|Resposta:/,id);
   assert.match(html,/class="bc-rlm-example-primary"/,id);
   assert.match(html,/class="bc-rlm-method"/,id);
   assert.match(html,/class="bc-rlm-pitfall"/,id);
   chapters++;
  }
 }
 assert.equal(chapters,70);
 assert.equal(JSON.stringify(g.RLM_CURSO_AULAS),before,'o renderizador não altera os dados originais');
});

test('Notação matemática conserva o texto, sem fragmentar palavras ou datas',()=>{
 const {g}=fixture(),render=g.RlmTheoryResources.mathText;
 assert.equal(render('1/2 + 1/4 = 3/4'),'1/2 + 1/4 = 3/4');
 assert.equal(render('Data: 10/11/2026; taxa 25/100.'),'Data: 10/11/2026; taxa 25/100.');
 assert.equal(render('3/4 do total'),'3/4 do total');
 assert.match(render('2^3'),/<sup>3<\/sup>/);
 assert.match(render('a^n'),/<sup>n<\/sup>/);
 assert.match(render('P → Q'),/P → Q/);
 assert.doesNotMatch(render('<img src=x onerror=alert(1)>'),/<img/);
 assert.equal(render('<img src=x>'),'&lt;img src=x&gt;');
 assert.doesNotMatch(render('2^3'),/<math|<mfrac/);
});

test('RLM possui navegação Teoria, Revisão, Questões e Mapa; M01 preserva o motor de velocidade',()=>{
 const {g,localStorage}=fixture();
 let html=g.RlmNative.renderMaster();
 assert.equal((html.match(/data-rlm-kind="recap"/g)||[]).length,14);
 assert.equal((html.match(/data-rlm-kind="theory"/g)||[]).length,14);
 assert.equal((html.match(/data-rlm-kind="quiz"/g)||[]).length,14);
 assert.equal((html.match(/data-rlm-kind="map"/g)||[]).length,14);
 assert.equal((html.match(/data-rlm-kind="speed"/g)||[]).length,1);
 assert.match(html,/Leitura 0%/);
 assert.doesNotMatch(html,/Analista Judiciário · TJCE 2026/);
 assert.ok(g.RlmNative.open.toString().includes('renderOverlay'));
 localStorage.setItem('central-v6:rlm-tjce2026:read:M03','65');
 html=g.RlmNative.renderMaster();
 assert.match(html,/Leitura 65%/);
});

test('M03, M12 e M13 abrem no leitor real com revisão independente',()=>{
 const {g,nodes}=fixture();
 for(const id of ['M03','M12','M13']){
  g.RlmNative.open(id,'theory');
  const overlay=nodes.get('bcRlmReaderOverlay');
  assert.ok(overlay,id);
  assert.match(overlay.innerHTML,/bc-rlm-worked-solution/,id);
  assert.match(overlay.innerHTML,/id="bcRlmIndexToggle"/,id);
  assert.match(overlay.innerHTML,/Revisão/,id);
  g.RlmNative.tab('recap');
  assert.match(overlay.innerHTML,/class="bc-rlm-recap"/,id);
  assert.match(overlay.innerHTML,/Método de resolução/,id);
  assert.doesNotMatch(overlay.innerHTML,/class="bc-rlm-quiz" id=/,id);
  g.RlmNative.tab('quiz');
  assert.match(overlay.innerHTML,/Questão 01/,id);
  g.RlmNative.close();
 }
});

test('Leitor mobile e CSS editorial estão ligados na Central original',()=>{
 const html=read('index.html'),script=read('ui/rlm-native-v1.js'),css=read('ui/rlm-editorial-v3.css');
 assert.ok(html.includes('ui/rlm-editorial-v3.css?v=20261109rlmfix1'));
 assert.ok(html.includes('ui/rlm-native-v1.js?v=20261111-apostilas-pt-rlm-v1'));
 assert.ok(script.includes('function toggleToc(force)'));
 assert.ok(script.includes("if(active?.stage==='theory')writeReadProgress(active.id,pct)"));
 assert.ok(css.includes('.bc-rlm-toc.open'));
 assert.ok(css.includes('bc-rlm-power'));
 assert.ok(css.includes('bc-rlm-study-grid'));
 assert.ok(script.includes("stage==='recap'"));
 assert.ok(script.includes("function speed()"));
});

test('Abertura de RLM acompanha Constitucional: leitura orientada, barra e cartões',()=>{
 const {g}=fixture(),html=g.RlmNative.renderMaster();
 assert.equal((html.match(/cf-native-oriented bc-rlm-orientation/g)||[]).length,16);
 assert.equal((html.match(/cf-native-cards bc-rlm-study-grid/g)||[]).length,16);
 assert.equal((html.match(/cf-module-bar/g)||[]).length,16);
 assert.equal((html.match(/Leitura orientada inicial/g)||[]).length,15);
 assert.equal((html.match(/data-rlm-kind="recap"/g)||[]).length,14);
 assert.ok(html.indexOf('Leitura orientada inicial')<html.indexOf('data-rlm-kind="recap"'));
 assert.match(html,/O que aprender neste módulo/);
 assert.match(html,/Revisão geral/);
});
