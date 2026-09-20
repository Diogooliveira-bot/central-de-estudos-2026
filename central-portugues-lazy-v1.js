(function(){
'use strict';
if(window.__CENTRAL_PT_LAZY_V1__)return;
window.__CENTRAL_PT_LAZY_V1__=true;

var PT_SCRIPTS=[
 'portugues-m1-v3.js?v=20260914a',
 'portugues-m1-theory-v1.js?v=20260914a',
 'portugues-m1-theory-v2.js?v=20260914a',
 'portugues-m1-theory-v3.js?v=20260914a',
 'portugues-m1-no-anki-v1.js?v=20260914a',
 'portugues-m1-apostila-v2.js?v=20260914c',
 'portugues-m1-clean-slate-v1.js?v=20260915a',
 'portugues-m2-v1.js?v=20260915a',
 'portugues-m2-tec-link-v1.js?v=20260915a',
 'portugues-m2-vertical-tabs-v1.js?v=20260915a'
];
var loaded=false,loading=null;
var TAB_KEY='central-v6:pt:active-module';
var MODULES=[
 {id:'m1',title:'Ortografia e Acentuação',tec:'PORT 04',url:'https://www.tecconcursos.com.br/questoes/cadernos/101825291',ready:true},
 {id:'m2',title:'Classes Nominais',tec:'PORT 05',url:'https://www.tecconcursos.com.br/questoes/cadernos/101827083',ready:true},
 {id:'m3',title:'Verbos',tec:'PORT 06',url:'https://www.tecconcursos.com.br/questoes/cadernos/101828478'},
 {id:'m4',title:'Pronomes e Colocação Pronominal',tec:'PORT 07',url:'https://www.tecconcursos.com.br/questoes/cadernos/101829867'},
 {id:'m5',title:'Advérbio, Preposição, Conjunção e outras Classes',tec:'PORT 08',url:'https://www.tecconcursos.com.br/questoes/cadernos/101831187'},
 {id:'m6',title:'Semântica e Linguagem',tec:'PORT 09',url:'https://www.tecconcursos.com.br/questoes/cadernos/101832301'},
 {id:'m7',title:'Sintaxe e Funções Sintáticas',tec:'PORT 10',url:'https://www.tecconcursos.com.br/questoes/cadernos/101833365'},
 {id:'m8',title:'Orações Coordenadas e Subordinadas',tec:'PORT 11',url:'https://www.tecconcursos.com.br/questoes/cadernos/101834419'},
 {id:'m9',title:'Pontuação',tec:'PORT 12',url:'https://www.tecconcursos.com.br/questoes/cadernos/101886514'},
 {id:'m10',title:'Regência e Crase',tec:'PORT 13',url:'https://www.tecconcursos.com.br/questoes/cadernos/101887677'},
 {id:'m11',title:'Concordância e Vozes Verbais',tec:'PORT 14',url:'https://www.tecconcursos.com.br/questoes/cadernos/101888137'},
 {id:'m12',title:'Partícula SE e vocábulos QUE e COMO',tec:'PORT 15',url:'https://www.tecconcursos.com.br/questoes/cadernos/101888264'},
 {id:'m13',title:'Questões Mescladas de Português',tec:'PORT 16',url:'https://www.tecconcursos.com.br/questoes/cadernos/101888409'}
];

function addScript(src){
 return new Promise(function(resolve,reject){
  var s=document.createElement('script');
  s.src='/'+src;s.defer=true;
  s.onload=function(){resolve(src)};
  s.onerror=function(){reject(new Error('Falha ao carregar '+src))};
  document.head.appendChild(s);
 });
}
async function ensurePt(){
 if(loaded)return;
 if(loading)return loading;
 loading=(async function(){
  for(var i=0;i<PT_SCRIPTS.length;i++)await addScript(PT_SCRIPTS[i]);
  installIndex();
  loaded=true;
 })().catch(function(err){loading=null;console.error('[PT lazy]',err);throw err});
 return loading;
}
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function installStyle(){
 if(document.getElementById('pt-module-index-v1-style'))return;
 var st=document.createElement('style');st.id='pt-module-index-v1-style';
 st.textContent='.ptmod-tabs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;margin:0 0 12px}.ptmod-tab{border:1px solid var(--line2);background:var(--panel);color:var(--muted);border-radius:9px;padding:9px 10px;text-align:left;font-size:10px;font-weight:800}.ptmod-tab.active{background:var(--blue);border-color:var(--blue);color:#fff}.ptmod-tab small{display:block;font-weight:600;opacity:.78;margin-top:2px}.ptmod-planned{border:1px solid var(--line);background:var(--panel);border-radius:11px;padding:15px}.ptmod-planned h2{margin:0 0 6px;font-size:20px}.ptmod-planned p{color:var(--muted);line-height:1.55}.ptmod-meta{display:flex;gap:7px;flex-wrap:wrap;margin-top:10px}.ptmod-meta span,.ptmod-meta a{border:1px solid var(--line2);border-radius:7px;padding:7px 9px;font-size:10px;color:var(--muted);text-decoration:none}@media(max-width:680px){.ptmod-tabs{grid-template-columns:1fr 1fr}.ptmod-tab{padding:9px 8px}}';
 document.head.appendChild(st);
}
function renderPlanned(m){
 return '<div class="ptmod-planned"><div class="ptm1-kicker">Português · '+esc(m.id.toUpperCase())+'</div><h2>'+esc(m.title)+'</h2><p>O módulo já está no mapa da Central e no caderno TEC correspondente. A teoria detalhada ainda não foi incorporada a esta versão; ele permanece visível para manter a sequência completa sem criar progresso falso.</p><div class="ptmod-meta"><span>Status: aguardando integração da teoria</span><span>TEC: '+esc(m.tec)+'</span><a target="_blank" rel="noopener" href="'+esc(m.url)+'">Abrir caderno TEC ↗</a></div></div>';
}
function installIndex(){
 if(window.__PT_MODULE_INDEX_V1__)return;
 window.__PT_MODULE_INDEX_V1__=true;installStyle();
 var m1=window.PtM1V3&&window.PtM1V3.render;
 var m2=window.PtM2V1&&window.PtM2V1.render;
 window.PtModuleIndex={
  switchTab:function(id){localStorage.setItem(TAB_KEY,id);if(typeof window.renderAll==='function')window.renderAll();else if(typeof window.renderSubjects==='function')window.renderSubjects();}
 };
 window.renderPortugueseMaster=function(){
  var active=localStorage.getItem(TAB_KEY)||'m1';
  if(!MODULES.some(function(x){return x.id===active}))active='m1';
  var tabs='<div class="ptmod-tabs">'+MODULES.map(function(m){return '<button class="ptmod-tab '+(m.id===active?'active':'')+'" onclick="PtModuleIndex.switchTab(\''+m.id+'\')">'+esc(m.id.toUpperCase())+' · '+esc(m.title)+'<small>'+esc(m.tec)+'</small></button>'}).join('')+'</div>';
  var body='';
  if(active==='m1'&&typeof m1==='function')body=m1();
  else if(active==='m2'&&typeof m2==='function')body=m2();
  else body=renderPlanned(MODULES.find(function(x){return x.id===active})||MODULES[0]);
  return tabs+body;
 };
 try{if(typeof window.renderAll==='function')window.renderAll();}catch(_){}
}
function patchSubjectOpen(){
 if(window.__PT_LAZY_PATCHED__)return true;
 var old=window.centralHardSubject;
 if(typeof old!=='function')return false;
 window.__PT_LAZY_PATCHED__=true;
 window.centralHardSubject=function(id){
  var args=arguments,ctx=this;
  if(id!=='pt')return old.apply(ctx,args);
  var card=document.querySelector('.disc-card[data-id="pt"] .disc-meta');
  if(card)card.textContent='Carregando Português…';
  ensurePt().then(function(){old.apply(ctx,args)}).catch(function(){if(card)card.textContent='Falha ao carregar · toque novamente';});
  return false;
 };
 return true;
}
var tries=0,t=setInterval(function(){tries++;if(patchSubjectOpen()||tries>80)clearInterval(t)},50);
window.ensurePortugueseLoaded=ensurePt;
})();