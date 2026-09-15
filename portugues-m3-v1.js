(function(){
'use strict';
if(window.__PORTUGUES_M3_V1__)return;
window.__PORTUGUES_M3_V1__=true;
var TAB_KEY='central-v6:pt:active-module';
var oldRender=window.renderPortugueseMaster;
if(typeof oldRender!=='function')return;
function style(){
  if(document.getElementById('pt-m3-v2-style'))return;
  var e=document.createElement('style');
  e.id='pt-m3-v2-style';
  e.textContent='\
  .ptm3-shell{margin-top:14px;background:transparent}\
  .ptm3-frame-wrap{overflow:visible;border:0;border-radius:0;background:transparent}\
  .ptm3-frame{width:100%;min-height:1500px;border:0;display:block;background:transparent}\
  @media(max-width:720px){.ptm3-shell{margin-top:10px}.ptm3-frame{min-height:1800px}}';
  document.head.appendChild(e);
}
function restyleFrame(frame){
  try{
    var doc=frame.contentDocument||frame.contentWindow.document;
    if(!doc)return;
    var old=doc.getElementById('ptm3-central-light-v2');
    if(!old){
      var s=doc.createElement('style');
      s.id='ptm3-central-light-v2';
      s.textContent=`
      :root{--bg:#f7f7f3!important;--panel:#fffefb!important;--panel2:#fbfaf6!important;--line:#e2e4df!important;--text:#24282f!important;--muted:#7d8796!important;--purple:#6f5cf5!important;--green:#3c9d72!important;--yellow:#c99520!important;--red:#c45258!important;--blue:#3568d4!important}
      html,body{background:transparent!important;color:#24282f!important}
      body{font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif!important}
      .wrap{max-width:none!important;padding:0 0 34px!important;margin:0!important}
      .top{margin:0 0 14px!important;padding:20px 22px!important;border:1px solid #e1e3de!important;border-radius:14px!important;background:#fffefb!important;display:block!important}
      .eyebrow,.badge{display:none!important}
      .top h1{margin:0 0 7px!important;font-size:23px!important;line-height:1.2!important;color:#24282f!important;font-weight:750!important}
      .top p{margin:0!important;color:#7d8796!important;font-size:13px!important}
      .summary{grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:10px!important;margin:0 0 12px!important}
      .sum{background:#fffefb!important;border:1px solid #e1e3de!important;border-radius:12px!important;padding:14px 16px!important}
      .sum small{color:#7d8796!important;font-size:10px!important}
      .sum b{color:#24282f!important;font-size:22px!important}
      .progress{height:7px!important;background:#ebece8!important;margin:0 0 18px!important}
      .progress span{background:#3568d4!important}
      .tabs{gap:8px!important;margin:0 0 16px!important}
      .tab{background:#fffefb!important;border:1px solid #e1e3de!important;color:#667085!important;border-radius:11px!important;padding:12px 14px!important;font-size:14px!important;font-weight:650!important}
      .tab:hover{background:#f7f8fb!important}
      .tab.active{background:#3568d4!important;border-color:#3568d4!important;color:#fff!important}
      .session,.card{background:#fffefb!important;border:1px solid #e1e3de!important;border-radius:12px!important;box-shadow:none!important}
      .session{margin:8px 0!important}
      .session summary{padding:15px 16px!important;color:#24282f!important}
      .session summary b{font-size:14px!important;font-weight:700!important}
      .session summary span{color:#8993a3!important;font-size:10px!important}
      .session .body{border-top:1px solid #ecece8!important;color:#363b43!important;background:#fffefb!important;font-size:14px!important;padding:2px 16px 18px!important}
      .session h3,.card h2,.card h3{color:#24282f!important}
      .session p,.card p,.session li,.card li{color:#434a55!important}
      .trap,.exam,.remember{background:#f8f8f5!important;border-radius:0 8px 8px 0!important;color:#343a43!important}
      .trap{border-left-color:#c99520!important}.exam{border-left-color:#3568d4!important}.remember{border-left-color:#3c9d72!important}
      .check{border-top-color:#e3e4df!important;color:#343a43!important}
      .field label{color:#7d8796!important}
      .field input,.field select,.field textarea{background:#fff!important;color:#24282f!important;border-color:#d9dcd6!important}
      .btn{background:#fff!important;color:#394150!important;border-color:#d8dbd5!important}
      .btn.primary{background:#3568d4!important;color:#fff!important;border-color:#3568d4!important}
      .btn.danger{background:#fff5f5!important;color:#a83e45!important;border-color:#edc9cb!important}
      .tec{background:#f8f9fb!important;border-color:#dfe3ea!important}
      .tec a{color:#3568d4!important}
      .error-item{background:#fafaf7!important;border-color:#e1e3de!important;color:#343a43!important}
      .error-item small{color:#7d8796!important}
      table{color:#343a43!important}th,td{border-bottom-color:#e5e6e2!important}th{color:#7d8796!important}
      code{background:#f0f1ed!important;color:#343a43!important;border-radius:4px!important;padding:1px 4px!important}
      @media(max-width:720px){.summary{grid-template-columns:1fr 1fr!important}.top{padding:16px!important}.top h1{font-size:20px!important}}
      `;
      doc.head.appendChild(s);
    }
    function resize(){try{frame.style.height=Math.max(1400,doc.documentElement.scrollHeight,doc.body?doc.body.scrollHeight:0)+'px'}catch(_){}}
    resize();setTimeout(resize,80);setTimeout(resize,350);setTimeout(resize,900);
    if(frame.contentWindow&&frame.contentWindow.MutationObserver){var obs=new frame.contentWindow.MutationObserver(function(){resize()});obs.observe(doc.body,{subtree:true,childList:true,attributes:true});}
  }catch(e){console.warn('[PT M3 V2 theme]',e)}
}
function tabs(){
  style();
  var active=localStorage.getItem(TAB_KEY)||'m1';
  if(active==='m3'){
    setTimeout(function(){var f=document.getElementById('ptm3-native-frame');if(f)restyleFrame(f)},50);
    return '<div class="ptm2-tabs"><button class="ptm2-tab" onclick="PtM3V1.switchTab(\'m1\')">M1 · Ortografia</button><button class="ptm2-tab" onclick="PtM3V1.switchTab(\'m2\')">M2 · Classes Nominais</button><button class="ptm2-tab active" onclick="PtM3V1.switchTab(\'m3\')">M3 · Conectivos</button></div><div class="ptm3-shell"><div class="ptm3-frame-wrap"><iframe id="ptm3-native-frame" class="ptm3-frame" src="portugues-m3-preview-v1.html" title="Português M3 — Conectivos" onload="PtM3V1.restyle(this)"></iframe></div></div>';
  }
  var html=oldRender.apply(this,arguments);if(typeof html!=='string')return html;
  return html.replace('</div>','<button class="ptm2-tab" onclick="PtM3V1.switchTab(\'m3\')">M3 · Conectivos</button></div>');
}
window.PtM3V1={switchTab:function(v){localStorage.setItem(TAB_KEY,v);try{if(typeof window.renderAll==='function')window.renderAll();else if(typeof window.renderSubjects==='function')window.renderSubjects()}catch(e){console.warn('[PT M3 V2]',e)}},restyle:restyleFrame};
window.renderPortugueseMaster=function(){return tabs.apply(this,arguments)};
function loadM4(){
  if(window.__PORTUGUES_M4_V1__||document.getElementById('portugues-m4-v1-script'))return;
  var s=document.createElement('script');s.id='portugues-m4-v1-script';s.src='portugues-m4-v1.js';s.async=false;document.head.appendChild(s);
}
try{if(typeof window.renderAll==='function')window.renderAll();else if(typeof window.renderSubjects==='function')window.renderSubjects()}catch(e){console.warn('[PT M3 V2]',e)}
loadM4();
})();