(function(global){
'use strict';
const SEL='#subjects .subject[data-id="penal"] .cf-module[data-cf="p11"]';
function inject(){
  const module=document.querySelector(SEL); if(!module)return;
  const body=module.querySelector('.cf-module-body'); if(!body||body.querySelector('[data-bc-native-m11]'))return;
  const host=document.createElement('section');
  host.className='bc-native-materials bc-native-materials-static';
  host.setAttribute('data-bc-native-m11','');
  host.innerHTML=
    '<section class="bc-native-metrics" aria-label="Indicadores do módulo">'+
      '<article class="bc-native-metric-card"><div class="bc-native-ring" data-native-ring="theory"><div class="bc-native-ring-inner"><b data-ring-value>0%</b><span>teoria</span></div></div><div class="bc-native-metric-copy"><small>COBERTURA DA TEORIA</small><strong data-native-metric-detail="theory">0 de 59 pontos concluídos</strong><span>Checks dos capítulos + questões internas.</span></div></article>'+
      '<article class="bc-native-metric-card"><div class="bc-native-ring" data-native-ring="external"><div class="bc-native-ring-inner"><b data-ring-value>—</b><span>externas</span></div></div><div class="bc-native-metric-copy"><small>ACERTO EM QUESTÕES EXTERNAS</small><strong data-native-metric-detail="external">Nenhuma questão externa respondida</strong><span data-native-metric-meta="external">Registre questões externas no final do módulo</span></div></article>'+
    '</section>'+
    '<div class="bc-native-materials-head"><div><b>Materiais do módulo</b><small>Escolha como estudar</small></div><small>M11 • conteúdo nativo</small></div>'+
    '<div class="bc-native-material-grid">'+
      '<button type="button" class="bc-native-material-card" data-native-kind="summary"><span class="bc-native-material-icon">⚡</span><span><strong>Conteúdo resumido</strong><small>Primeira leitura, revisão rápida, artigos, pegadinhas e revisão ativa.</small></span><span class="bc-native-material-action"><span>Abrir</span><span>→</span></span></button>'+
      '<button type="button" class="bc-native-material-card" data-native-kind="complete"><span class="bc-native-material-icon">📚</span><span><strong>Conteúdo completo</strong><small>Teoria integral do M11 em formato de site, com índice, busca e progresso de leitura.</small></span><span class="bc-native-material-action"><span>Abrir</span><span>→</span></span></button>'+
      '<button type="button" class="bc-native-material-card" data-native-kind="mindmap"><span class="bc-native-material-icon">🧠</span><span><strong>Mapa mental</strong><small>Mapa interativo com abrir/recolher ramos, zoom, arrastar e tela cheia.</small></span><span class="bc-native-material-action"><span>Abrir</span><span>→</span></span></button>'+
    '</div>'+
    '<section class="bc-native-quick-summary" aria-label="Resumo do módulo"><div class="bc-native-quick-summary-head"><span class="bc-native-quick-summary-no">11</span><div><b>Resumo do módulo</b><small>O M11 em poucas palavras.</small></div></div><div class="bc-native-quick-summary-body">Moeda falsa • documentos públicos e particulares • falsidade ideológica • uso e supressão de documento • falsa identidade • sinais de veículos • fraudes em certames.</div></section>';
  host.querySelector('[data-native-kind="summary"]').onclick=()=>global.BaseNativeReaderM11?.open('summary');
  host.querySelector('[data-native-kind="complete"]').onclick=()=>global.BaseNativeReaderM11?.open('complete');
  host.querySelector('[data-native-kind="mindmap"]').onclick=()=>global.BaseMindMap?.open('penal','p11');
  const subtitle=body.querySelector('.cf-subtitle');
  if(subtitle)subtitle.insertAdjacentElement('afterend',host); else body.insertAdjacentElement('afterbegin',host);
  global.BaseNativeReaderM11?.refreshMetrics?.();
}
function install(){
  inject();
  const obs=new MutationObserver(()=>{clearTimeout(install._t);install._t=setTimeout(inject,60)});
  obs.observe(document.documentElement,{subtree:true,childList:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})(window);

