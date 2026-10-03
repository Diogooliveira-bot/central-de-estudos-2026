/* Base Completa — Português Autodidata M01–M24. */
(function(){
'use strict';
if(window.__PT_AUTO24__) return;
window.__PT_AUTO24__=true;
var VERSION='20261003ptauto24';
var MODULES=[{"id":"m01","num":1,"title":"Como a língua se organiza","lessons":0,"path":"portugues-autodidata/m01.html"},{"id":"m02","num":2,"title":"Sons, letras e sílabas","lessons":11,"path":"portugues-autodidata/m02.html"},{"id":"m03","num":3,"title":"Acentuação","lessons":23,"path":"portugues-autodidata/m03.html"},{"id":"m04","num":4,"title":"Estrutura da palavra e ortografia","lessons":43,"path":"portugues-autodidata/m04.html"},{"id":"m05","num":5,"title":"Substantivo, artigo e numeral","lessons":44,"path":"portugues-autodidata/m05.html"},{"id":"m06","num":6,"title":"Adjetivo","lessons":29,"path":"portugues-autodidata/m06.html"},{"id":"m07","num":7,"title":"Pronomes: fundamentos","lessons":35,"path":"portugues-autodidata/m07.html"},{"id":"m08","num":8,"title":"Verbos: fundamentos","lessons":45,"path":"portugues-autodidata/m08.html"},{"id":"m09","num":9,"title":"Classes invariáveis e conectivos","lessons":47,"path":"portugues-autodidata/m09.html"},{"id":"m10","num":10,"title":"Sintaxe I: sujeito e arquitetura da oração","lessons":43,"path":"portugues-autodidata/m10.html"},{"id":"m11","num":11,"title":"Sintaxe II: verbo e complementos","lessons":33,"path":"portugues-autodidata/m11.html"},{"id":"m12","num":12,"title":"Sintaxe III: relações nominais e termos acessórios","lessons":29,"path":"portugues-autodidata/m12.html"},{"id":"m13","num":13,"title":"Sistema verbal avançado e vozes","lessons":0,"path":"portugues-autodidata/m13.html"},{"id":"m14","num":14,"title":"Período composto","lessons":85,"path":"portugues-autodidata/m14.html"},{"id":"m15","num":15,"title":"Colocação pronominal","lessons":48,"path":"portugues-autodidata/m15.html"},{"id":"m16","num":16,"title":"Pontuação pela estrutura","lessons":52,"path":"portugues-autodidata/m16.html"},{"id":"m17","num":17,"title":"Concordância verbal","lessons":66,"path":"portugues-autodidata/m17.html"},{"id":"m18","num":18,"title":"Concordância nominal","lessons":59,"path":"portugues-autodidata/m18.html"},{"id":"m19","num":19,"title":"Regência verbal e nominal","lessons":52,"path":"portugues-autodidata/m19.html"},{"id":"m20","num":20,"title":"Crase","lessons":50,"path":"portugues-autodidata/m20.html"},{"id":"m21","num":21,"title":"Semântica","lessons":50,"path":"portugues-autodidata/m21.html"},{"id":"m22","num":22,"title":"Coesão e coerência","lessons":51,"path":"portugues-autodidata/m22.html"},{"id":"m23","num":23,"title":"Tipologia, gênero e funções da linguagem","lessons":50,"path":"portugues-autodidata/m23.html"},{"id":"m24","num":24,"title":"Interpretação de textos para prova","lessons":70,"path":"portugues-autodidata/m24.html"}];
var REVIEW={id:'review',num:25,title:'Revisão Cumulativa Final M01–M24',lessons:0,path:'portugues-autodidata/review.html',review:true};
var ITEMS=MODULES.concat([REVIEW]);
var OPEN_KEY='central-v6:pt:auto24:open';
var DONE_PREFIX='central-v6:pt:auto24:done:';
var FONT_KEY='central-v6:reading-font-size';
var cache=Object.create(null);
var DATA_PROMISE=null;
function loadData(){
 if(DATA_PROMISE)return DATA_PROMISE;
 DATA_PROMISE=fetch('/portugues-autodidata-data.txt?v='+VERSION,{cache:'no-store',credentials:'same-origin'}).then(function(r){if(!r.ok)throw new Error('HTTP '+r.status+' ao carregar dados');return r.text()}).then(function(b64){
  var bin=atob(b64.trim()), bytes=new Uint8Array(bin.length);for(var i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);
  if(typeof DecompressionStream==='undefined')throw new Error('Navegador sem suporte à descompressão do material');
  var stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
  return new Response(stream).text();
 }).then(function(text){return JSON.parse(text)});
 return DATA_PROMISE;
}
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function read(k,d){try{var v=localStorage.getItem(k);return v==null?d:v}catch(_){return d}}
function write(k,v){try{localStorage.setItem(k,v)}catch(_){}}
function done(id){return read(DONE_PREFIX+id,'0')==='1'}
function setDone(id,v){write(DONE_PREFIX+id,v?'1':'0');updateSummary();updateCardState(id)}
function currentFont(){var n=Number(read(FONT_KEY,'100'));return Math.max(85,Math.min(180,Math.round((n||100)/5)*5))}
function setFont(n){n=Math.max(85,Math.min(180,Math.round(Number(n||100)/5)*5));write(FONT_KEY,String(n));document.documentElement.style.setProperty('--reader-scale',String(n/100));var o=document.getElementById('pt-font-value');if(o)o.value=n+'%';return n}
function updateSummary(){
 var completed=MODULES.filter(function(m){return done(m.id)}).length;
 var pct=Math.round(completed/MODULES.length*100);
 var count=document.getElementById('pt-done-count'); if(count)count.textContent=completed;
 var pctEl=document.getElementById('pt-done-pct'); if(pctEl)pctEl.textContent=pct+'%';
 var bar=document.getElementById('pt-progress-fill'); if(bar)bar.style.width=pct+'%';
 var review=document.getElementById('pt-review-state'); if(review)review.textContent=done('review')?'CONCLUÍDA':'PENDENTE';
}
function updateCardState(id){
 var card=document.querySelector('[data-module-card="'+id+'"]');if(!card)return;
 var state=card.querySelector('.pt-module-state');if(state)state.textContent=done(id)?'CONCLUÍDO':'PENDENTE';
 card.classList.toggle('is-done',done(id));
 var cb=card.querySelector('[data-pt-complete="'+id+'"]');if(cb)cb.checked=done(id);
}
function card(item){
 var isReview=!!item.review;
 return '<section class="pt-module-card'+(isReview?' pt-review-card':'')+(done(item.id)?' is-done':'')+'" data-module-card="'+item.id+'">'+
  '<button class="pt-module-head" type="button" data-open="'+item.id+'" aria-expanded="false">'+
   '<span class="pt-module-no">'+(isReview?'FINAL':'M'+String(item.num).padStart(2,'0'))+'</span>'+
   '<span class="pt-module-title">'+esc(item.title)+'</span>'+
   '<span class="pt-module-meta">'+(item.lessons?item.lessons+' aulas':'revisão geral')+'</span>'+
   '<span class="pt-module-state">'+(done(item.id)?'CONCLUÍDO':'PENDENTE')+'</span>'+
   '<span class="pt-chev">⌄</span></button>'+
  '<div class="pt-module-body" id="pt-body-'+item.id+'"></div></section>';
}
function render(){
 var root=document.getElementById('pt-standalone-app');if(!root)return;
 root.innerHTML='<section class="pt-hero"><div><p class="eyebrow">BASE COMPLETA • PORTUGUÊS</p><h1>Português Autodidata</h1><p class="pt-lead">M01–M24 em sequência progressiva: entender, consolidar e dominar para prova.</p></div><div class="pt-summary"><div><strong id="pt-done-count">0</strong><span>/24 módulos</span></div><b id="pt-done-pct">0%</b></div><div class="pt-progress"><span id="pt-progress-fill"></span></div></section>'+
 '<section class="pt-section"><div class="pt-section-title"><div><p class="eyebrow">CURSO COMPLETO</p><h2>24 módulos</h2></div><p>Abra apenas o módulo que vai estudar. O conteúdo é carregado sob demanda.</p></div><div class="pt-modules">'+MODULES.map(card).join('')+'</div></section>'+
 '<section class="pt-section"><div class="pt-section-title"><div><p class="eyebrow">FECHAMENTO</p><h2>Revisão cumulativa final</h2></div><p>84 itens: cobertura M01–M24 + questões integradas.</p></div><div class="pt-modules">'+card(REVIEW)+'</div></section>';
 root.querySelectorAll('[data-open]').forEach(function(btn){btn.addEventListener('click',function(){toggle(btn.dataset.open)})});
 updateSummary();
 var open=read(OPEN_KEY,''); if(open && document.querySelector('[data-module-card="'+open+'"]')) toggle(open,true);
}
function toggle(id,forceOpen){
 var card=document.querySelector('[data-module-card="'+id+'"]');if(!card)return;
 var open=forceOpen===true?!card.classList.contains('open'):!card.classList.contains('open');
 document.querySelectorAll('.pt-module-card.open').forEach(function(other){if(other!==card){other.classList.remove('open');var b=other.querySelector('[data-open]');if(b)b.setAttribute('aria-expanded','false')}});
 card.classList.toggle('open',open);var btn=card.querySelector('[data-open]');if(btn)btn.setAttribute('aria-expanded',open?'true':'false');
 if(open){write(OPEN_KEY,id);load(id);setTimeout(function(){card.scrollIntoView({behavior:'smooth',block:'start'})},30)} else write(OPEN_KEY,'');
}
function load(id){
 var item=ITEMS.find(function(x){return x.id===id});var host=document.getElementById('pt-body-'+id);if(!item||!host)return;
 if(host.dataset.loaded==='1'){bindCompletion(host,id);return}
 host.innerHTML='<div class="pt-loading">Carregando conteúdo…</div>';
 loadData().then(function(data){var markup=data[id];if(!markup)throw new Error('Conteúdo '+id+' não encontrado');host.innerHTML=markup;host.dataset.loaded='1';bindCompletion(host,id);applyEnhancements(host)}).catch(function(err){host.innerHTML='<div class="pt-error"><b>Não foi possível carregar este conteúdo.</b><span>'+esc(err.message||err)+'</span><button type="button" data-retry="'+id+'">Tentar novamente</button></div>';var b=host.querySelector('[data-retry]');if(b)b.onclick=function(){host.dataset.loaded='0';DATA_PROMISE=null;load(id)}})
}
function bindCompletion(host,id){var cb=host.querySelector('[data-pt-complete="'+id+'"]');if(!cb)return;cb.checked=done(id);cb.onchange=function(){setDone(id,cb.checked)}}
function applyEnhancements(host){
 host.querySelectorAll('table').forEach(function(t){if(!t.parentElement.classList.contains('pt-table-wrap')){var w=document.createElement('div');w.className='pt-table-wrap';t.parentNode.insertBefore(w,t);w.appendChild(t)}});
 host.querySelectorAll('a').forEach(function(a){if(/^https?:/i.test(a.href)){a.target='_blank';a.rel='noopener noreferrer'}});
}
function initFont(){var input=document.getElementById('pt-font-size');var n=setFont(currentFont());if(input){input.value=n;input.addEventListener('input',function(){setFont(input.value)})}}
render();initFont();
window.__PT_AUTO24_AUDIT__=function(){return {version:VERSION,moduleCount:MODULES.length,review:true,modules:MODULES.map(function(m){return m.id}),completed:MODULES.filter(function(m){return done(m.id)}).length}};
})();
