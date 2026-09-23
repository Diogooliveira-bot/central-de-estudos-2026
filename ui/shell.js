/* BASE COMPLETA — adaptação progressiva do DOM legado para componentes V1 */
(function(){
  'use strict';
  if(window.__bcShellV1)return;window.__bcShellV1=true;
  var scheduled=false,observer=null;

  function addAll(root,selector,classes){
    if(!root.querySelectorAll)return;
    root.querySelectorAll(selector).forEach(function(el){classes.forEach(function(c){el.classList.add(c)})});
  }
  function mapComponents(root){
    addAll(root,'.btn',['bc-button']);
    addAll(root,'.btn.primary',['bc-button--primary']);
    addAll(root,'.btn.red',['bc-button--danger']);
    addAll(root,'.btn:not(.primary):not(.red)',['bc-button--secondary']);
    addAll(root,'.card',['bc-card']);
    addAll(root,'.disc-card',['bc-card','bc-card--interactive','bc-subject-card']);
    addAll(root,'.subject,.cf-module',['bc-accordion']);
    addAll(root,'.subject-head,.cf-module-head',['bc-accordion-header']);
    addAll(root,'.progress-line,.subject-bar,.cf-module-bar,.cf-qbar,.anki-duo-progress,.ct-meter',['bc-progress']);
    addAll(root,'.field label',['bc-field-label']);
    addAll(root,'.field input,.field select,.field textarea',['bc-input']);
    addAll(root,'.chip,.type',['bc-badge']);
    addAll(root,'.hero',['bc-page-header']);
    var crumb=document.getElementById('crumb');if(crumb)crumb.classList.add('bc-breadcrumb');
    document.querySelectorAll('.nav button').forEach(function(btn){
      if(btn.classList.contains('active'))btn.setAttribute('aria-current','page');else btn.removeAttribute('aria-current');
    });
    document.querySelectorAll('.subject,.cf-module').forEach(function(item){
      var head=item.querySelector('.subject-head,.cf-module-head');if(head)head.setAttribute('aria-expanded',item.classList.contains('open')?'true':'false');
    });
  }
  function enhanceBrand(){
    var icon=document.querySelector('.brand-icon'),name=document.querySelector('.brand b'),sub=document.querySelector('.brand small');
    if(icon){if(icon.textContent!=='BC')icon.textContent='BC';icon.setAttribute('aria-label','Base Completa')}
    if(name&&name.textContent!=='BASE COMPLETA')name.textContent='BASE COMPLETA';
    if(sub&&sub.textContent!=='Estude. Revise. Evolua.')sub.textContent='Estude. Revise. Evolua.';
  }
  function enhanceHome(){
    var home=document.getElementById('homeView');if(!home)return;
    var grid=home.querySelector('.home-grid'),continueBox=document.getElementById('continueBox');
    var card=continueBox&&continueBox.closest('.card');
    if(grid&&card&&!card.classList.contains('bc-home-continue')){
      card.classList.add('bc-home-continue');
      grid.parentNode.insertBefore(card,grid);
    }
    var agenda=home.querySelector('.home-grid>div:first-child>.card');
    if(agenda)agenda.classList.add('bc-home-agenda');
    var schedule=home.querySelector('.schedule-intro');if(schedule)schedule.classList.add('bc-section');
    var subjects=home.querySelector('.subjects');if(subjects)subjects.classList.add('bc-section');
  }
  function improveLabels(){
    document.querySelectorAll('.central-view-back').forEach(function(btn){
      var txt=(btn.textContent||'').trim();
      if(txt==='‹ Central'||txt==='← Central'||txt==='⌂ Início')btn.textContent='Voltar';
    });
    var empty=document.querySelector('#agendaEditor .muted.small');
    if(empty&&/Nenhuma tarefa neste dia/i.test(empty.textContent||''))empty.textContent='Nenhuma tarefa planejada para esta data.';
  }
  function refresh(){
    scheduled=false;
    document.documentElement.classList.add('bc-ui-v1');
    if(document.body)document.body.classList.add('bc-ui-v1');
    enhanceBrand();mapComponents(document);enhanceHome();improveLabels();
  }
  function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(refresh)}
  function init(){
    refresh();
    observer=new MutationObserver(schedule);
    observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
    document.addEventListener('click',function(){setTimeout(schedule,0)},true);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();