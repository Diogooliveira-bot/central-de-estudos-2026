(function(){
'use strict';
if(window.__PT_CONTROLLER_V2__)return;
window.__PT_CONTROLLER_V2__=true;
var names=['Ortografia e Acentuação','Classes Nominais','Conectivos','Pronomes','Colocação Pronominal','Verbos','Correlação Verbal e Vozes Verbais','Sintaxe da Oração','Sintaxe do Período','Pontuação','Concordância','Regência Verbal e Nominal','Crase','Coesão e Coerência','Semântica Geral','Interpretação de Textos','Tipologia Textual'];
var modules=names.map(function(name,i){var n=i+1;return {id:'m'+n,name:name,src:n>2?'portugues-m'+n+(n<6?'-preview-v1.html':'-v1.html'):null}});
var active='hub',pending={},errors={};
function get(id){return modules.find(function(m){return m.id===id})}
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function contentRenderer(id){return id==='m1'?window.__PT_M1_ENHANCED_RENDER__:window.__PT_M2_ENHANCED_RENDER__}
function style(){
 if(document.getElementById('pt-controller-v2-style'))return;
 var e=document.createElement('style');e.id='pt-controller-v2-style';
 e.textContent=`
 .ptc{color:var(--text);min-width:0}.ptc-head{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;padding:12px 0;position:sticky;top:0;z-index:2;background:var(--panel,#fff)}
 .ptc button{cursor:pointer}.ptc-back,.ptc-retry{padding:10px 14px;border:1px solid var(--line);border-radius:8px;background:var(--panel);color:var(--text)}
 .ptc-list{display:grid;gap:8px}.ptc-module{display:flex;gap:14px;align-items:center;width:100%;padding:15px 12px;text-align:left;border:1px solid var(--line);border-radius:8px;background:var(--panel);color:var(--text)}
 .ptc-module span{font-size:12px;flex:none;color:var(--muted)}.ptc-module b{font-size:14px;overflow-wrap:anywhere}.ptc-module:focus-visible,.ptc-back:focus-visible{outline:2px solid var(--blue);outline-offset:2px}
 .ptc-content{min-width:0;overflow-wrap:anywhere}.ptc-content .ptm1-body{display:none}.ptc-content .ptm1-section.open>.ptm1-body{display:block}
 .ptc-content .ptm1-section{border:1px solid var(--line);border-radius:8px;margin:8px 0;overflow:hidden;background:var(--panel)}
 .ptc-content .ptm1-head{width:100%;display:flex;align-items:center;gap:12px;padding:14px;border:0;text-align:left;background:var(--panel);color:var(--text)}
 .ptc-content .ptm1-head>span:nth-child(2){flex:1}.ptc-content .ptm1-head small{display:block;color:var(--muted)}.ptc-content .ptm1-body{padding:16px;color:var(--text);background:var(--panel)}
 .ptc-content .ptm1-top,.ptc-content .ptm1-grid,.ptc-content .ptm1-revs{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,180px),1fr));gap:10px}
 .ptc-content .ptm1-card{padding:14px;border:1px solid var(--line);border-radius:8px}.ptc-content input,.ptc-content textarea,.ptc-content select{max-width:100%;background:var(--panel);color:var(--text);border:1px solid var(--line)}
 .ptc-content table{display:block;max-width:100%;overflow:auto}.ptc-frame{display:block;width:100%;height:75vh;min-height:400px;border:0;background:var(--panel)}
 .ptc-status{padding:16px;color:var(--muted)}@media(max-width:600px){.ptc-head strong{font-size:14px}.ptc-content .ptm1-done{display:none}.ptc-content .ptm1-body{padding:12px}}
 `;document.head.appendChild(e);
}
function status(message){return '<div class="ptc-status" role="status">'+message+'</div>'}
function begin(id){
 if(pending[id])return;
 pending[id]=true;
 window.ensurePortugueseLoaded(id).then(function(){delete pending[id];delete errors[id];if(active===id)refresh(id)}).catch(function(error){
  delete pending[id];errors[id]=error.message;if(active===id)refresh(id);
 });
}
function legacy(id){
 if(errors[id])return status('Não foi possível carregar o módulo. <button class="ptc-retry" onclick="PtControllerV1.retry()">Tentar novamente</button>');
 var render=contentRenderer(id);
 if(typeof render==='function')return render();
 setTimeout(function(){begin(id)},0);
 return status('Carregando módulo…');
}
function render(){
 style();
 if(active==='hub')return '<div class="ptc" data-pt-view="hub"><div class="ptc-head"><strong>Língua Portuguesa</strong><span>17 módulos</span></div><div class="ptc-list">'+modules.map(function(m){return '<button type="button" class="ptc-module" onclick="PtControllerV1.open(\''+m.id+'\')"><span>'+m.id.toUpperCase()+'</span><b>'+esc(m.name)+'</b></button>'}).join('')+'</div></div>';
 var m=get(active);
 var body=m.src?status('Carregando conteúdo…')+'<iframe class="ptc-frame" src="/'+m.src+'" title="Português '+m.id.toUpperCase()+' — '+esc(m.name)+'" onload="PtControllerV1.loaded(this)" onerror="PtControllerV1.frameError(this)"></iframe>':legacy(m.id);
 return '<div class="ptc" data-pt-view="'+m.id+'"><div class="ptc-head"><button type="button" class="ptc-back" onclick="PtControllerV1.back()">Voltar aos módulos</button><strong>'+m.id.toUpperCase()+' · '+esc(m.name)+'</strong></div><div class="ptc-content">'+body+'</div></div>';
}
function redraw(){
 var root=document.querySelector('.subject[data-id="pt"] .ptc');
 if(root){root.outerHTML=render();return}
 if(typeof window.renderSubjects==='function')window.renderSubjects();
}
function refresh(id){
 if(active!==id)return;
 var host=document.querySelector('.ptc[data-pt-view="'+id+'"] .ptc-content');
 if(host&&!get(id).src)host.innerHTML=legacy(id);
}
function open(id){
 if(!get(id))return;
 active=id;
 try{localStorage.setItem('central-v6:pt:active-module',id)}catch(_){}
 redraw();
}
function back(){active='hub';redraw()}
function frameError(frame){
 var host=frame.parentNode;if(!host)return;
 var msg=host.querySelector('.ptc-status');
 if(msg)msg.innerHTML='Não foi possível carregar o conteúdo. <button class="ptc-retry" onclick="PtControllerV1.retry()">Tentar novamente</button>';
}
function loaded(frame){
 try{
  var doc=frame.contentDocument;
  if(!doc||!doc.body||!doc.body.textContent.trim()){frameError(frame);return}
  var notice=frame.parentNode.querySelector('.ptc-status');if(notice)notice.remove();
  // Keep child navigation from loading an entire Central inside its iframe.
  doc.addEventListener('click',function(event){
   var a=event.target.closest('a');if(!a)return;
   var url=new URL(a.href,location.href);
   if(url.origin===location.origin&&(/\/(?:index.html|central-v119.html)?$/).test(url.pathname)){event.preventDefault();back()}
  });
  var css=doc.createElement('style');
  css.textContent='html,body{max-width:100%;overflow-x:hidden}h1{letter-spacing:0}.wrap{max-width:100%;box-sizing:border-box}table{display:block;max-width:100%;overflow:auto}.tabs{flex-wrap:wrap}';
  doc.head.appendChild(css);
 }catch(error){frameError(frame)}
}
window.PtControllerV1={render:render,open:open,back:back,loaded:loaded,frameError:frameError,retry:function(){delete errors[active];if(get(active)&&!get(active).src)begin(active);redraw()},audit:function(){return {registered:modules.map(function(m){return m.id}),active:active}}};
window.renderPortugueseMaster=render;
window.__PT_CANONICAL_RENDER__=render;
window.ptCanonicalRefreshModule=refresh;
window.ptCanonicalMount=function(id){open(id)};
window.togglePtCanonicalModule=open;
})();