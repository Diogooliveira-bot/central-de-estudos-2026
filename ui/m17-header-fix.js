(function(){
  function fix(){
    var m=document.querySelector('#subjects .subject[data-id="penal"] .cf-module[data-cf="p17"]');
    if(!m)return;
    var t=m.querySelector('.cf-module-title'); if(t)t.textContent='Constituição Penal, Responsabilidade Penal da Pessoa Jurídica, Súmulas e Consolidação';
    var s=m.querySelector('.cf-module-subtitle'); if(s)s.textContent='CF, art. 5º; CF, art. 225, §3º; Lei 9.605/1998; súmulas STF/STJ';
  }
  fix(); setTimeout(fix,120);
})();

/* Base Completa — Penal M1–M17: substitui o antigo mapa mental interativo
   pelos infográficos visuais armazenados nos mesmos arquivos do Google Drive. */
(function(global){
  'use strict';

  var SUBJECT='#subjects .subject[data-id="penal"]';
  var OVERLAY_ID='bcPenalInfographicOverlay';
  var observer=null;
  var currentScale=1;

  function esc(value){
    return String(value==null?'':value).replace(/[&<>"']/g,function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  function moduleNumber(module){
    var raw=String(module&&module.dataset&&module.dataset.cf||'');
    var n=parseInt(raw.replace(/\D+/g,''),10);
    return Number.isFinite(n)?n:0;
  }

  function moduleData(module){
    var n=moduleNumber(module);
    if(!n)return null;
    var key='m'+String(n).padStart(2,'0');
    return global.BASE_NATIVE_CONTENT&&global.BASE_NATIVE_CONTENT.penal
      ? global.BASE_NATIVE_CONTENT.penal[key]||null
      : null;
  }

  function imageUrl(fileId){\n    return 'https://drive.google.com/file/d/'+encodeURIComponent(fileId)+'/preview';\n  }

  function close(){
    var ov=document.getElementById(OVERLAY_ID);
    if(ov)ov.remove();
    document.body.style.overflow='';
  }

  function setScale(value){ currentScale=1; }\n\n  function fit(){ currentScale=1; }

  function injectStyle(){
    if(document.getElementById('bcPenalInfographicStyle'))return;
    var style=document.createElement('style');
    style.id='bcPenalInfographicStyle';
    style.textContent='\n'+
      '#'+OVERLAY_ID+'{position:fixed;inset:0;z-index:2147483200;background:rgba(4,13,27,.94);display:grid;place-items:center;padding:18px;box-sizing:border-box}\n'+
      '#'+OVERLAY_ID+' .bc-pen-infographic-shell{width:min(1180px,100%);height:min(94vh,1100px);background:#08182b;border:1px solid rgba(43,217,230,.42);border-radius:18px;overflow:hidden;display:grid;grid-template-rows:auto auto minmax(0,1fr);box-shadow:0 28px 90px rgba(0,0,0,.45)}\n'+
      '#'+OVERLAY_ID+' .bc-pen-infographic-head{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:15px 18px;background:linear-gradient(135deg,#0a2542,#06385a);color:#fff;border-bottom:1px solid rgba(255,255,255,.1)}\n'+
      '#'+OVERLAY_ID+' .bc-pen-infographic-head b{font-size:15px}.bc-pen-infographic-head small{display:block;margin-top:3px;color:#9edfe8;font-size:11px}\n'+
      '#'+OVERLAY_ID+' .bc-pen-infographic-close{border:0;background:rgba(255,255,255,.1);color:#fff;width:38px;height:38px;border-radius:10px;font-size:24px;line-height:1}\n'+
      '#'+OVERLAY_ID+' .bc-pen-infographic-tools{display:none;align-items:center;gap:8px;padding:9px 12px;background:#0b1e34;border-bottom:1px solid rgba(255,255,255,.08);overflow-x:auto}\n'+
      '#'+OVERLAY_ID+' .bc-pen-infographic-tools button{border:1px solid #244664;background:#102a45;color:#eefbff;border-radius:8px;padding:8px 11px;font-weight:700;white-space:nowrap}\n'+
      '#'+OVERLAY_ID+' .bc-pen-infographic-tools button:hover{background:#173a5d}.bc-pen-infographic-zoom{min-width:54px;text-align:center;color:#aeeaf0;font-weight:800;font-size:12px}\n'+
      '#'+OVERLAY_ID+' .bc-pen-infographic-stage{overflow:auto;background:#071322;padding:16px;display:block;text-align:center;overscroll-behavior:contain}\n'+
      '#'+OVERLAY_ID+' .bc-pen-infographic-image{display:block;margin:0 auto;max-width:none;border-radius:8px;box-shadow:0 8px 34px rgba(0,0,0,.32);background:#fff}\n'+
      SUBJECT+' [data-native-kind="mindmap"] .bc-native-material-icon{font-size:0}\n'+
      SUBJECT+' [data-native-kind="mindmap"] .bc-native-material-icon:after{content:"▣";font-size:22px}\n'+
      '@media(max-width:700px){#'+OVERLAY_ID+'{padding:0}#'+OVERLAY_ID+' .bc-pen-infographic-shell{width:100%;height:100dvh;border-radius:0;border:0}#'+OVERLAY_ID+' .bc-pen-infographic-head{padding:12px 14px}#'+OVERLAY_ID+' .bc-pen-infographic-stage{padding:10px}}';
    document.head.appendChild(style);
  }

  function openInfographic(module){
    var data=moduleData(module);
    var fileId=data&&data.sources&&data.sources.mindMapDriveId;
    if(!fileId)return;
    close();
    injectStyle();
    var n=moduleNumber(module);
    var title=(data&&data.title)||('PEN M'+n);
    var ov=document.createElement('div');
    ov.id=OVERLAY_ID;
    ov.setAttribute('role','dialog');
    ov.setAttribute('aria-modal','true');
    ov.setAttribute('aria-label','Infográfico de revisão do PEN M'+n);
    ov.innerHTML=''+
      '<section class="bc-pen-infographic-shell">'+
        '<header class="bc-pen-infographic-head">'+
          '<div><b>▣ PEN M'+n+' — '+esc(title)+'</b><small>Infográfico de revisão • visualização segura pelo Google Drive</small></div>'+
          '<button type="button" class="bc-pen-infographic-close" data-pen-info-action="close" aria-label="Fechar">×</button>'+
        '</header>'+
        '<div class="bc-pen-infographic-tools">'+
          '<button type="button" data-pen-info-action="out">−</button>'+
          '<span class="bc-pen-infographic-zoom" data-pen-info-zoom>100%</span>'+
          '<button type="button" data-pen-info-action="in">+</button>'+
          '<button type="button" data-pen-info-action="fit">Ajustar</button>'+
          '<button type="button" data-pen-info-action="actual">100%</button>'+
        '</div>'+
        '<div class="bc-pen-infographic-stage">'+
          '<iframe class="bc-pen-infographic-image" src="'+imageUrl(fileId)+'" title="Infográfico PEN M'+n+' — '+esc(title)+'" loading="eager" allow="autoplay"></iframe>'+
        '</div>'+
      '</section>';
    document.body.appendChild(ov);
    document.body.style.overflow='hidden';
    currentScale=1;

    var img=ov.querySelector('.bc-pen-infographic-image');
    img.addEventListener('load',function(){fit();},{once:true});
    img.addEventListener('error',function(){
      var stage=ov.querySelector('.bc-pen-infographic-stage');
      stage.innerHTML='<div style="color:#fff;padding:32px">Não foi possível carregar o infográfico. Verifique a conexão e tente novamente.</div>';
    },{once:true});

    ov.querySelectorAll('[data-pen-info-action]').forEach(function(btn){
      btn.addEventListener('click',function(){
        var action=btn.dataset.penInfoAction;
        if(action==='close')close();
        else if(action==='in')setScale(currentScale+.15);
        else if(action==='out')setScale(currentScale-.15);
        else if(action==='fit')fit();
        else if(action==='actual')setScale(1);
      });
    });
    ov.addEventListener('click',function(ev){if(ev.target===ov)close();});
  }

  function convertCard(module){
    var card=module.querySelector('[data-native-kind="mindmap"]');
    if(!card)return;
    var data=moduleData(module);
    if(!data||!data.sources||!data.sources.mindMapDriveId)return;

    var strong=card.querySelector('strong');
    var small=strong&&strong.parentElement?strong.parentElement.querySelector('small'):null;
    var action=card.querySelector('.bc-native-material-action span:first-child');
    if(strong)strong.textContent='Infográfico de revisão';
    if(small)small.textContent='Resumo visual completo do módulo, com pontos-chave, regras, pegadinhas e revisão expressa.';
    if(action)action.textContent='Abrir';
    card.setAttribute('aria-label','Abrir infográfico de revisão');
    card.onclick=function(ev){
      ev.preventDefault();
      ev.stopPropagation();
      openInfographic(module);
    };
  }

  function scan(){
    var subject=document.querySelector(SUBJECT);
    if(!subject)return;
    injectStyle();
    subject.querySelectorAll('.cf-module[data-cf]').forEach(convertCard);
  }

  function install(){
    scan();
    var root=document.getElementById('subjects');
    if(!root)return;
    observer=new MutationObserver(function(){
      clearTimeout(install._t);
      install._t=setTimeout(scan,70);
    });
    observer.observe(root,{childList:true,subtree:true});
  }

  // Intercepta o clique ANTES dos handlers antigos dos shells de cada módulo.
  // Isso evita que um onclick tardio volte a abrir o mapa mental legado.
  document.addEventListener('click',function(ev){
    var card=ev.target&&ev.target.closest?ev.target.closest('#subjects .subject[data-id="penal"] .cf-module[data-cf] [data-native-kind="mindmap"]'):null;
    if(!card)return;
    var module=card.closest('.cf-module[data-cf]');
    if(!module)return;
    ev.preventDefault();
    ev.stopPropagation();
    if(ev.stopImmediatePropagation)ev.stopImmediatePropagation();
    openInfographic(module);
  },true);

  // Fallback adicional: qualquer chamada legada BaseMindMap.open('penal','pN')
  // é redirecionada para o infográfico correspondente.
  function patchLegacyMindMap(){
    if(!global.BaseMindMap||global.BaseMindMap.__penalInfographicRedirect)return;
    var originalOpen=global.BaseMindMap.open;
    global.BaseMindMap.open=function(subject,moduleId){
      if(subject==='penal'&&/^p(?:[1-9]|1[0-7])$/.test(String(moduleId||''))){
        var module=document.querySelector('#subjects .subject[data-id="penal"] .cf-module[data-cf="'+moduleId+'"]');
        if(module){openInfographic(module);return;}
      }
      return originalOpen&&originalOpen.apply(this,arguments);
    };
    global.BaseMindMap.__penalInfographicRedirect=true;
  }
  patchLegacyMindMap();
  setTimeout(patchLegacyMindMap,250);
  setTimeout(patchLegacyMindMap,1000);
  setTimeout(patchLegacyMindMap,3000);

  document.addEventListener('keydown',function(ev){
    if(ev.key==='Escape'&&document.getElementById(OVERLAY_ID))close();
  });

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);
  else install();
})(window);
