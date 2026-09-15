(function(){
'use strict';
if(window.__PORTUGUES_M3_V1__)return;
window.__PORTUGUES_M3_V1__=true;
var TAB_KEY='central-v6:pt:active-module';
var oldRender=window.renderPortugueseMaster;
if(typeof oldRender!=='function')return;
function style(){if(document.getElementById('pt-m3-v1-style'))return;var e=document.createElement('style');e.id='pt-m3-v1-style';e.textContent='.ptm3-shell{margin-top:10px}.ptm3-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;margin:12px 0}.ptm3-head h2{margin:0;font-size:19px}.ptm3-head p{margin:4px 0 0;color:#92a6c2;font-size:12px}.ptm3-tec{font-size:11px;color:#b8c9ff;text-decoration:none;border:1px solid #3b4c68;background:#0e1b2d;border-radius:8px;padding:7px 9px;white-space:nowrap}.ptm3-frame-wrap{height:1600px;overflow:hidden;border:1px solid #26364f;border-radius:11px;background:#0a111d}.ptm3-frame{width:100%;height:1730px;border:0;display:block;transform:translateY(-118px);background:#0a111d}@media(max-width:720px){.ptm3-head{display:block}.ptm3-tec{display:inline-block;margin-top:10px}.ptm3-frame-wrap{height:1750px}.ptm3-frame{height:1880px;transform:translateY(-112px)}}';document.head.appendChild(e)}
function tabs(){style();var active=localStorage.getItem(TAB_KEY)||'m1';if(active==='m3')return '<div class="ptm2-tabs"><button class="ptm2-tab" onclick="PtM3V1.switchTab(\'m1\')">M1 · Ortografia</button><button class="ptm2-tab" onclick="PtM3V1.switchTab(\'m2\')">M2 · Classes Nominais</button><button class="ptm2-tab active" onclick="PtM3V1.switchTab(\'m3\')">M3 · Conectivos</button></div><div class="ptm3-shell"><div class="ptm3-head"><div><h2>M3 · Classes de Palavras II — Conectivos</h2><p>Conjunções, relações semânticas e preposições · progresso independente.</p></div><a class="ptm3-tec" href="https://www.tecconcursos.com.br/questoes/cadernos/101831187" target="_blank" rel="noopener">TEC PORT 08 · 455 questões ↗</a></div><div class="ptm3-frame-wrap"><iframe class="ptm3-frame" src="portugues-m3-preview-v1.html" title="Português M3 — Conectivos"></iframe></div></div>';
var html=oldRender.apply(this,arguments);if(typeof html!=='string')return html;return html.replace('</div>','<button class="ptm2-tab" onclick="PtM3V1.switchTab(\'m3\')">M3 · Conectivos</button></div>')}
window.PtM3V1={switchTab:function(v){localStorage.setItem(TAB_KEY,v);try{if(typeof window.renderAll==='function')window.renderAll();else if(typeof window.renderSubjects==='function')window.renderSubjects()}catch(e){console.warn('[PT M3 V1]',e)}}};
window.renderPortugueseMaster=function(){return tabs.apply(this,arguments)};
try{if(typeof window.renderAll==='function')window.renderAll();else if(typeof window.renderSubjects==='function')window.renderSubjects()}catch(e){console.warn('[PT M3 V1]',e)}
})();
