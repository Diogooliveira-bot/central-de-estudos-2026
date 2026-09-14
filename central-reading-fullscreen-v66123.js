(function(){
'use strict';
if(window.__centralReadingFullscreen66123)return;
window.__centralReadingFullscreen66123=true;

var ROOT_CLASS='central-reading-fullscreen-v66123';
var ACTIVE_SUBJECT='central-reading-active-subject';
var ACTIVE_MODULE='central-reading-active-module';
var ACTIVE_STAGE='central-reading-active-stage';
var dismissed=false;

function visible(el){
 if(!el)return false;
 var view=el.closest('.view');
 if(view&&view.classList.contains('hidden'))return false;
 return !!(el.offsetWidth||el.offsetHeight||el.getClientRects().length);
}
function candidate(){
 var topics=document.querySelectorAll('.ct-topic[open],.cpc-apostila-topic[open]');
 for(var t=0;t<topics.length;t++)if(visible(topics[t]))return topics[t];
 var stages=document.querySelectorAll('.civil-step.open');
 for(var i=0;i<stages.length;i++)if(visible(stages[i]))return stages[i];
 return null;
}
function clearMarks(){
 document.querySelectorAll('.'+ACTIVE_SUBJECT+',.'+ACTIVE_MODULE+',.'+ACTIVE_STAGE).forEach(function(el){
  el.classList.remove(ACTIVE_SUBJECT,ACTIVE_MODULE,ACTIVE_STAGE);
 });
}
function ensureButton(){
 var button=document.getElementById('central-reading-exit');
 if(button)return button;
 button=document.createElement('button');
 button.id='central-reading-exit';
 button.type='button';
 button.setAttribute('aria-label','Sair da leitura em tela cheia');
 button.innerHTML='<span aria-hidden="true">↙</span> Sair da leitura';
 button.addEventListener('click',function(){leave(true)});
 document.body.appendChild(button);
 return button;
}
function enter(target){
 if(!target||dismissed)return;
 clearMarks();
 var subject=target.closest('.subject');
 var module=target.closest('.civil-module,.cf-module')||target;
 var stage=target.closest('.civil-step,.cf-step');
 if(subject)subject.classList.add(ACTIVE_SUBJECT);
 if(module)module.classList.add(ACTIVE_MODULE);
 if(stage)stage.classList.add(ACTIVE_STAGE);
 document.documentElement.classList.add(ROOT_CLASS);
 document.body.classList.add(ROOT_CLASS);
 ensureButton();
}
function leave(byUser){
 if(byUser)dismissed=true;
 document.documentElement.classList.remove(ROOT_CLASS);
 if(document.body)document.body.classList.remove(ROOT_CLASS);
 clearMarks();
}
function sync(force){
 var target=candidate();
 if(!target){dismissed=false;leave(false);return}
 if(force)dismissed=false;
 if(!dismissed)enter(target);
}

document.addEventListener('click',function(event){
 var toggle=event.target.closest('.civil-step-head,.ct-topic summary,.cpc-apostila-topic summary');
 if(toggle)setTimeout(function(){sync(true)},80);
},true);
document.addEventListener('keydown',function(event){if(event.key==='Escape'&&document.documentElement.classList.contains(ROOT_CLASS))leave(true)});

function start(){sync(false);setTimeout(function(){sync(false)},500);setTimeout(function(){sync(false)},1600)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
var observer=new MutationObserver(function(){setTimeout(function(){sync(false)},40)});
observer.observe(document.documentElement,{subtree:true,childList:true});

var style=document.createElement('style');
style.id='central-reading-fullscreen-style-v66123';
style.textContent=`
html.${ROOT_CLASS},html.${ROOT_CLASS} body{height:100%!important;overflow:hidden!important;background:var(--cm-paper,#fffefb)!important}
html.${ROOT_CLASS} #appRoot{height:100dvh!important;width:100%!important;display:grid!important;grid-template-columns:minmax(0,1fr)!important;background:var(--cm-paper,#fffefb)!important}
html.${ROOT_CLASS} #centralSidebar,
html.${ROOT_CLASS} #mobileSidebarBackdrop,
html.${ROOT_CLASS} .topbar{display:none!important}
html.${ROOT_CLASS} .shell{height:100dvh!important;min-width:0!important}
html.${ROOT_CLASS} .workspace{height:100%!important;min-height:0!important}
html.${ROOT_CLASS} #homeView.view{height:100%!important;padding:0!important;overflow:auto!important;background:var(--cm-paper,#fffefb)!important;scrollbar-gutter:stable}
html.${ROOT_CLASS} #homeView>.hero{display:none!important}
html.${ROOT_CLASS} #homeView .home-grid{display:block!important;width:100%!important;max-width:none!important}
html.${ROOT_CLASS} #homeView .home-grid>div:first-child{width:100%!important;max-width:none!important}
html.${ROOT_CLASS} #homeView .side-col{display:none!important}
html.${ROOT_CLASS} #homeView .subjects{width:100%!important;max-width:none!important;gap:0!important}
html.${ROOT_CLASS} #homeView .subject:not(.${ACTIVE_SUBJECT}){display:none!important}
html.${ROOT_CLASS} #homeView .subject.${ACTIVE_SUBJECT}{width:100%!important;margin:0!important;border:0!important;border-radius:0!important;background:var(--cm-paper,#fffefb)!important;overflow:visible!important}
html.${ROOT_CLASS} #homeView .subject.${ACTIVE_SUBJECT}>.subject-head,
html.${ROOT_CLASS} #homeView .subject.${ACTIVE_SUBJECT}>.subject-body>.subject-bar,
html.${ROOT_CLASS} #homeView .civil-master-intro,
html.${ROOT_CLASS} #homeView .civil-edital-coverage{display:none!important}
html.${ROOT_CLASS} #homeView .subject.${ACTIVE_SUBJECT}>.subject-body{display:block!important;padding:0!important}
html.${ROOT_CLASS} #homeView .civil-master{width:100%!important;max-width:none!important}
html.${ROOT_CLASS} #homeView .civil-module:not(.${ACTIVE_MODULE}),
html.${ROOT_CLASS} #homeView .cf-module:not(.${ACTIVE_MODULE}){display:none!important}
html.${ROOT_CLASS} #homeView .civil-module.${ACTIVE_MODULE},
html.${ROOT_CLASS} #homeView .cf-module.${ACTIVE_MODULE}{width:100%!important;max-width:none!important;margin:0!important;border:0!important;border-radius:0!important;box-shadow:none!important;background:var(--cm-paper,#fffefb)!important;overflow:visible!important}
html.${ROOT_CLASS} #homeView .civil-module.${ACTIVE_MODULE}>.civil-module-head,
html.${ROOT_CLASS} #homeView .cf-module.${ACTIVE_MODULE}>.cf-module-head{position:sticky!important;top:0!important;z-index:20!important;min-height:48px!important;margin:0!important;border-radius:0!important;box-shadow:0 1px 0 var(--cm-line,#e7e8e3)!important}
html.${ROOT_CLASS} #homeView .civil-module.${ACTIVE_MODULE}>.civil-module-body,
html.${ROOT_CLASS} #homeView .cf-module.${ACTIVE_MODULE}>.cf-module-body{display:block!important;width:100%!important;max-width:none!important;padding-left:0!important;padding-right:0!important}
html.${ROOT_CLASS} #homeView .civil-step:not(.${ACTIVE_STAGE}){display:none!important}
html.${ROOT_CLASS} #homeView .civil-step.${ACTIVE_STAGE}{width:min(1320px,100%)!important;margin:0 auto!important;border:0!important;border-radius:0!important;box-shadow:none!important}
html.${ROOT_CLASS} #homeView .civil-step.${ACTIVE_STAGE}>.civil-step-head{position:sticky!important;top:48px!important;z-index:15!important;border-radius:0!important}
html.${ROOT_CLASS} #homeView .civil-step.${ACTIVE_STAGE}>.civil-step-body{display:block!important;padding-left:clamp(18px,3vw,46px)!important;padding-right:clamp(18px,3vw,46px)!important}
html.${ROOT_CLASS} #homeView .ct-shell{width:100%!important;max-width:1320px!important;margin:0 auto!important;padding:clamp(16px,2.8vw,42px)!important;border:0!important;border-radius:0!important;background:var(--cm-paper,#fffefb)!important}
html.${ROOT_CLASS} #homeView .ct-rich .ct-body{width:100%!important;max-width:1120px!important;margin:0 auto!important;padding:clamp(22px,3vw,42px) clamp(20px,4vw,64px) clamp(34px,5vw,72px)!important}
html.${ROOT_CLASS} #homeView .cpc-apostila-study,
html.${ROOT_CLASS} #homeView .cpc-apostila-cover,
html.${ROOT_CLASS} #homeView .cpc-m1-apostila .cf-steps,
html.${ROOT_CLASS} #homeView .cpc-m1-apostila .cpc-apostila-resources{max-width:1320px!important}
html.${ROOT_CLASS} #homeView .cpc-m1-apostila .cf-steps{padding-left:clamp(18px,3vw,46px)!important;padding-right:clamp(18px,3vw,46px)!important}
html.${ROOT_CLASS} #central-update-btn,
html.${ROOT_CLASS} #central-progress-button,
html.${ROOT_CLASS} .central-progress-floating{display:none!important}
#central-reading-exit{display:none;position:fixed;z-index:99999;right:14px;top:10px;min-height:38px;padding:8px 13px;border:1px solid var(--cm-line2,#d9ddd8);border-radius:9px;background:var(--cm-paper,#fffefb);color:var(--cm-text,#1f2933);font:700 12px/1 Inter,system-ui,sans-serif;box-shadow:0 8px 24px rgba(31,41,51,.12);cursor:pointer}
html.${ROOT_CLASS} #central-reading-exit{display:inline-flex;align-items:center;gap:7px}
@media(max-width:760px){
 html.${ROOT_CLASS} #homeView .civil-module.${ACTIVE_MODULE}>.civil-module-head,
 html.${ROOT_CLASS} #homeView .cf-module.${ACTIVE_MODULE}>.cf-module-head{padding-right:132px!important}
 html.${ROOT_CLASS} #homeView .civil-step.${ACTIVE_STAGE}>.civil-step-head{top:46px!important}
 html.${ROOT_CLASS} #homeView .civil-step.${ACTIVE_STAGE}>.civil-step-body{padding-left:12px!important;padding-right:12px!important}
 html.${ROOT_CLASS} #homeView .ct-shell{padding:12px!important}
 html.${ROOT_CLASS} #homeView .ct-rich .ct-body{padding:18px 16px 34px!important}
 #central-reading-exit{right:8px;top:7px;min-height:34px;padding:7px 10px;font-size:11px}
}
`;
document.head.appendChild(style);
})();
