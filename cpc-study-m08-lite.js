(function(g){
'use strict';
const K='central-v6:cpc-study-v1',Q='cpc_tjce_fcc_guided_v34',ID='cpc8',SID='w8';
function J(k){try{return JSON.parse(localStorage.getItem(k)||'{}')}catch(_){return {}}}
function S(){return Object.assign({modules:{},external:{}},J(K))}
function M(){const s=S();return Object.assign({decorando:false},s.modules?.[SID]||{})}
function setM(p){const s=S();s.modules=s.modules||{};s.modules[SID]=Object.assign({},s.modules[SID]||{},p);localStorage.setItem(K,JSON.stringify(s));R()}
function X(){const x=S().external?.[SID]||{};return {done:+x.done||0,correct:+x.correct||0}}
function saveX(){const s=S(),d=Math.max(0,+document.getElementById('cpc-ext-done-w8')?.value||0),c=Math.min(d,Math.max(0,+document.getElementById('cpc-ext-correct-w8')?.value||0));s.external=s.external||{};s.external[SID]={done:d,correct:c};localStorage.setItem(K,JSON.stringify(s));R()}
function q(m){return !!J(Q).weeks?.[ID]?.[m]}
function rd(m){return g.CpcM08NativeReader?.stats?g.CpcM08NativeReader.stats(m):{done:0,total:m==='summary'?5:15}}
function P(){const m=M(),a=rd('summary'),b=rd('complete');return Math.round((a.done+(q('intermediate')?5:0)+b.done+(q('fixation')?10:0)+(m.decorando?1:0))/(a.total+5+b.total+10+1)*100)}
function E(s){return String(s||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
function H(w){
 const m=M(),a=rd('summary'),b=rd('complete'),x=X(),p=P(),acc=x.done?Math.round(x.correct/x.done*1000)/10:0;
 return '<section class="cf-module" data-cf="cpc8"><button class="cf-module-head" onclick="toggleCpcModule(\'cpc8\')"><span class="cf-module-no">MÓDULO 8</span><span class="cf-module-title">'+E(w?.title||'Comunicação dos atos processuais e nulidades')+'</span><span class="cf-module-stat">Cobertura '+p+'%</span><span class="chev">⌄</span></button><div class="cf-module-body"><div class="cf-module-bar"><span style="width:'+p+'%"></span></div>'+
 '<section class="bc-native-materials bc-native-materials-static"><div class="bc-native-material-grid">'+
 '<button class="bc-native-material-card" onclick="CpcM08NativeReader.open(\'summary\')"><span class="bc-native-material-icon">⚡</span><span><strong>Conteúdo resumido</strong><small>5 capítulos</small></span><span class="bc-native-material-action"><span>'+a.done+'/'+a.total+'</span><span>→</span></span></button>'+
 '<button class="bc-native-material-card" onclick="CpcM08NativeReader.open(\'complete\')"><span class="bc-native-material-icon">📚</span><span><strong>Conteúdo completo</strong><small>15 blocos</small></span><span class="bc-native-material-action"><span>'+b.done+'/'+b.total+'</span><span>→</span></span></button>'+
 '</div></section>'+
 '<section class="cpc-study-intro" style="margin-top:12px"><div><h3>Fixação interna</h3><p>Questões do M08.</p></div><div class="cpc-study-actions"><button class="cf-btn '+(q('intermediate')?'good':'')+'" onclick="startCpcQuiz(\'cpc8\',\'intermediate\',5)">5 do resumido</button><button class="cf-btn '+(q('fixation')?'good':'')+'" onclick="startCpcQuiz(\'cpc8\',\'fixation\',10)">10 do completo</button></div></section>'+
 '<div class="cpc-bottom-grid"><section class="cpc-mini-panel"><h4>⚖️ Lei em Dia</h4><button class="cf-btn primary" onclick="openLeiSecaEnxuta(null,\'cpc\',\'cpc-m08\')">Abrir</button> <button class="cf-btn '+(m.decorando?'good':'')+'" onclick="cpcM08Set({decorando:'+(!m.decorando)+'})">'+(m.decorando?'✓ Concluído':'Marcar concluído')+'</button></section>'+
 '<section class="cpc-mini-panel"><h4>🎯 Questões externas</h4><div class="cpc-external-form"><label>Feitas<input id="cpc-ext-done-w8" type="number" value="'+x.done+'"></label><label>Acertos<input id="cpc-ext-correct-w8" type="number" value="'+x.correct+'"></label><button class="cf-btn" onclick="cpcM08SaveExternal()">Salvar</button></div><div class="cpc-ext-score">'+(x.done?acc+'%':'—')+'</div></section></div></div></section>'
}
function R(){try{renderAll()}catch(_){}}
function install(){
 if(!g.CpcStudyV1||!g.__CPC_WEEKS){setTimeout(install,100);return}
 if(g.CpcStudyM08)return;
 const prev=g.CpcStudyV1.renderMaster,pp=g.CpcStudyV1.progress;
 g.CpcStudyV1.progress=id=>(id===ID||id===SID)?P():pp(id);
 g.CpcStudyV1.renderMaster=function(){const b=prev(),w=g.__CPC_WEEKS.find(x=>x.id===ID),i=b.lastIndexOf('</div>');return w?b.slice(0,i)+H(w)+b.slice(i):b};
 g.CpcStudyM08=true;R()
}
g.cpcM08Set=setM;g.cpcM08SaveExternal=saveX;setTimeout(install,0);
})(window);