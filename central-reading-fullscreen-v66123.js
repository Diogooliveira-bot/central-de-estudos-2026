(function(){
'use strict';
if(window.__centralReadingFullscreen66124)return;
window.__centralReadingFullscreen66124=true;

var ROOT_CLASS='central-reading-fullscreen-v66124';
var ACTIVE_SUBJECT='central-reading-active-subject';
var ACTIVE_MODULE='central-reading-active-module';
var ACTIVE_STAGE='central-reading-active-stage';
var ACTIVE_TOPIC='central-reading-active-topic';
var ACTIVE_CONTAINER='central-reading-active-container';
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
 return null;
}
function clearMarks(){
 document.querySelectorAll('.'+ACTIVE_SUBJECT+',.'+ACTIVE_MODULE+',.'+ACTIVE_STAGE+',.'+ACTIVE_TOPIC+',.'+ACTIVE_CONTAINER).forEach(function(el){
  el.classList.remove(ACTIVE_SUBJECT,ACTIVE_MODULE,ACTIVE_STAGE,ACTIVE_TOPIC,ACTIVE_CONTAINER);
 });
}
function ensureButton(){
 var button=document.getElementById('central-reading-exit');
 if(button)return button;
 button=document.createElement('button');
 button.id='central-reading-exit';
 button.type='button';
 button.setAttribute('aria-label','Sair da leitura em tela cheia');
 button.innerHTML='<span aria-hidden="true">←</span> Voltar ao módulo';
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
 var container=target.closest('.civil-a-section,.civil-step,.cf-step');
 if(subject)subject.classList.add(ACTIVE_SUBJECT);
 if(module)module.classList.add(ACTIVE_MODULE);
 if(stage)stage.classList.add(ACTIVE_STAGE);
 target.classList.add(ACTIVE_TOPIC);
 if(container)container.classList.add(ACTIVE_CONTAINER);
 document.documentElement.classList.add(ROOT_CLASS);
 document.body.classList.add(ROOT_CLASS);
 ensureButton();
 requestAnimationFrame(function(){var view=document.getElementById('homeView');if(view)view.scrollTop=0});
}
function leave(byUser){
 var topic=document.querySelector('.'+ACTIVE_TOPIC);
 if(byUser)dismissed=true;
 document.documentElement.classList.remove(ROOT_CLASS);
 if(document.body)document.body.classList.remove(ROOT_CLASS);
 clearMarks();
 if(byUser&&topic)setTimeout(function(){topic.scrollIntoView({block:'center'})},40);
}
function sync(force){
 var target=candidate();
 if(!target){dismissed=false;leave(false);return}
 if(force)dismissed=false;
 if(!dismissed)enter(target);
}

document.addEventListener('click',function(event){
 var toggle=event.target.closest('.ct-topic summary,.cpc-apostila-topic summary');
 if(toggle){
  var details=toggle.closest('.ct-topic,.cpc-apostila-topic');
  setTimeout(function(){if(details&&details.open){dismissed=false;enter(details)}else sync(true)},80);
 }
},true);
document.addEventListener('keydown',function(event){if(event.key==='Escape'&&document.documentElement.classList.contains(ROOT_CLASS))leave(true)});

function start(){sync(false);setTimeout(function(){sync(false)},500);setTimeout(function(){sync(false)},1600)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
var observer=new MutationObserver(function(){setTimeout(function(){sync(false)},40)});
observer.observe(document.documentElement,{subtree:true,childList:true});

var style=document.createElement('style');
style.id='central-reading-fullscreen-style-v66124';
style.textContent=`
html.${ROOT_CLASS},html.${ROOT_CLASS} body{height:100%!important;overflow:hidden!important;background:var(--cm-paper,#fffefb)!important}
html.${ROOT_CLASS} #appRoot{height:100dvh!important;width:100%!important;display:grid!important;grid-template-columns:minmax(0,1fr)!important;background:var(--cm-paper,#fffefb)!important}
html.${ROOT_CLASS} #centralSidebar,
html.${ROOT_CLASS} #mobileSidebarBackdrop,
html.${ROOT_CLASS} .topbar{display:none!important}
html.${ROOT_CLASS} .shell{height:100dvh!important;min-width:0!important}
html.${ROOT_CLASS} .workspace{height:100%!important;min-height:0!important}
html.${ROOT_CLASS} #homeView.view{position:fixed!important;inset:0!important;z-index:9990!important;width:100vw!important;height:100dvh!important;margin:0!important;padding:0!important;overflow:auto!important;background:var(--cm-paper,#fffefb)!important;scrollbar-gutter:stable}
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
html.${ROOT_CLASS} #homeView .cf-module.${ACTIVE_MODULE}>.cf-module-head{display:none!important}
html.${ROOT_CLASS} #homeView .civil-module.${ACTIVE_MODULE}>.civil-module-body,
html.${ROOT_CLASS} #homeView .cf-module.${ACTIVE_MODULE}>.cf-module-body{display:block!important;width:100%!important;max-width:none!important;padding-left:0!important;padding-right:0!important}
html.${ROOT_CLASS} #homeView .civil-step:not(.${ACTIVE_STAGE}){display:none!important}
html.${ROOT_CLASS} #homeView .civil-step.${ACTIVE_STAGE}{width:min(1320px,100%)!important;margin:0 auto!important;border:0!important;border-radius:0!important;box-shadow:none!important}
html.${ROOT_CLASS} #homeView .civil-step.${ACTIVE_STAGE}>.civil-step-head{display:none!important}
html.${ROOT_CLASS} #homeView .civil-step.${ACTIVE_STAGE}>.civil-step-body{display:block!important;padding-left:clamp(18px,3vw,46px)!important;padding-right:clamp(18px,3vw,46px)!important}
html.${ROOT_CLASS} #homeView .civil-module-body>.csp-panel,
html.${ROOT_CLASS} #homeView .civil-module-body>.civil-overall,
html.${ROOT_CLASS} #homeView .civil-module-body>.civil-scope-note,
html.${ROOT_CLASS} #homeView .civil-module-body .civil-a-section:not(.${ACTIVE_CONTAINER}){display:none!important}
html.${ROOT_CLASS} #homeView .ct-shell{width:100%!important;max-width:none!important;min-height:100dvh!important;margin:0!important;padding:58px clamp(18px,4vw,64px) 48px!important;border:0!important;border-radius:0!important;background:var(--cm-paper,#fffefb)!important}
html.${ROOT_CLASS} #homeView .ct-shell>.ct-head,
html.${ROOT_CLASS} #homeView .ct-shell>.ct-meter{display:none!important}
html.${ROOT_CLASS} #homeView .ct-list{width:100%!important;max-width:980px!important;margin:0 auto!important;gap:0!important}
html.${ROOT_CLASS} #homeView .ct-list>.ct-topic:not(.${ACTIVE_TOPIC}){display:none!important}
html.${ROOT_CLASS} #homeView .ct-topic.${ACTIVE_TOPIC}{width:100%!important;margin:0!important;border:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important}
html.${ROOT_CLASS} #homeView .ct-topic.${ACTIVE_TOPIC}>summary{position:sticky!important;top:52px!important;z-index:30!important;min-height:56px!important;padding:13px 12px!important;border-bottom:1px solid var(--cm-line,#e7e8e3)!important;border-radius:0!important;background:color-mix(in srgb,var(--cm-paper,#fffefb) 96%,transparent)!important;backdrop-filter:blur(12px)}
html.${ROOT_CLASS} #homeView .ct-rich.${ACTIVE_TOPIC} .ct-body{width:100%!important;max-width:900px!important;margin:0 auto!important;padding:32px 24px 64px!important}
html.${ROOT_CLASS} #homeView .cf-step:not(.${ACTIVE_STAGE}){display:none!important}
html.${ROOT_CLASS} #homeView .cf-step.${ACTIVE_STAGE}>.cf-step-head{display:none!important}
html.${ROOT_CLASS} #homeView .cf-step.${ACTIVE_STAGE}>.cf-step-body{display:block!important;width:100%!important;max-width:none!important;padding:58px clamp(18px,4vw,64px) 48px!important}
html.${ROOT_CLASS} #homeView .cpc-apostila-topic:not(.${ACTIVE_TOPIC}){display:none!important}
html.${ROOT_CLASS} #homeView .cpc-apostila-topic.${ACTIVE_TOPIC}{width:100%!important;max-width:980px!important;margin:0 auto!important;border:0!important;border-radius:0!important;background:transparent!important}
html.${ROOT_CLASS} #homeView .cpc-apostila-topic.${ACTIVE_TOPIC}>summary{position:sticky!important;top:52px!important;z-index:30!important;border-bottom:1px solid var(--cpc-rule,#e7e8e3)!important}
html.${ROOT_CLASS} #homeView .cpc-apostila-topic.${ACTIVE_TOPIC} .cf-theory-text{max-width:900px!important;margin:0 auto!important;padding:32px 24px 64px!important}
html.${ROOT_CLASS} #central-update-btn,
html.${ROOT_CLASS} #central-progress-button,
html.${ROOT_CLASS} #central-progress-entry-v1,
html.${ROOT_CLASS} .central-progress-floating{display:none!important}
#central-reading-exit{display:none;position:fixed;z-index:99999;left:16px;top:11px;min-height:36px;padding:8px 12px;border:1px solid var(--cm-line2,#d9ddd8);border-radius:8px;background:var(--cm-paper,#fffefb);color:var(--cm-text,#1f2933);font:700 12px/1 Inter,system-ui,sans-serif;box-shadow:none;cursor:pointer}
html.${ROOT_CLASS} #central-reading-exit{display:inline-flex;align-items:center;gap:7px}
@media(max-width:760px){
 html.${ROOT_CLASS} #homeView .civil-step.${ACTIVE_STAGE}>.civil-step-body{padding-left:12px!important;padding-right:12px!important}
 html.${ROOT_CLASS} #homeView .ct-shell{padding:52px 10px 30px!important}
 html.${ROOT_CLASS} #homeView .ct-topic.${ACTIVE_TOPIC}>summary{padding:12px 10px!important}
 html.${ROOT_CLASS} #homeView .ct-topic.${ACTIVE_TOPIC}>summary .ct-status{display:none!important}
 html.${ROOT_CLASS} #homeView .ct-rich.${ACTIVE_TOPIC} .ct-body{padding:22px 14px 42px!important}
 html.${ROOT_CLASS} #homeView .cf-step.${ACTIVE_STAGE}>.cf-step-body{padding:52px 10px 30px!important}
 html.${ROOT_CLASS} #homeView .cpc-apostila-topic.${ACTIVE_TOPIC}>summary{padding-right:10px!important}
 #central-reading-exit{left:8px;top:7px;min-height:34px;padding:7px 10px;font-size:11px}
}
`;
document.head.appendChild(style);
})();
