(function(){
'use strict';
if(window.__centralReadingFullscreen66140)return;
window.__centralReadingFullscreen66140=true;

var ROOT='central-reading-fullscreen-v66124';
var AS='central-reading-active-subject';
var AM='central-reading-active-module';
var AG='central-reading-active-stage';
var AT='central-reading-active-topic';
var AC='central-reading-active-container';
var dismissed=false;

function visible(el){if(!el)return false;var view=el.closest('.view');if(view&&view.classList.contains('hidden'))return false;return !!(el.offsetWidth||el.offsetHeight||el.getClientRects().length)}
function autoCandidate(){var list=document.querySelectorAll('.ct-topic[open]');for(var i=0;i<list.length;i++)if(visible(list[i]))return list[i];return null}
function clear(){document.querySelectorAll('.'+AS+',.'+AM+',.'+AG+',.'+AT+',.'+AC).forEach(function(el){el.classList.remove(AS,AM,AG,AT,AC)})}
function exitButton(){var b=document.getElementById('central-reading-exit');if(b)return b;b=document.createElement('button');b.id='central-reading-exit';b.type='button';b.innerHTML='<span aria-hidden="true">←</span> Voltar ao módulo';b.setAttribute('aria-label','Voltar ao módulo');b.addEventListener('click',function(){leave(true)});document.body.appendChild(b);return b}
function enter(target,explicit){if(!target)return false;if(!explicit&&dismissed)return false;clear();var subject=target.closest('.subject');var module=target.closest('.civil-module,.cf-module')||target;var stage=target.closest('.civil-step,.cf-step');var container=target.closest('.civil-a-section,.civil-step,.cf-step');if(subject)subject.classList.add(AS);if(module)module.classList.add(AM);if(stage)stage.classList.add(AG);target.classList.add(AT);if(container)container.classList.add(AC);document.documentElement.classList.add(ROOT);document.body.classList.add(ROOT);dismissed=false;exitButton();requestAnimationFrame(function(){var v=document.getElementById('homeView');if(v)v.scrollTop=0});return true}
function leave(byUser){var topic=document.querySelector('.'+AT);if(byUser)dismissed=true;document.documentElement.classList.remove(ROOT);if(document.body)document.body.classList.remove(ROOT);clear();if(byUser&&topic)setTimeout(function(){topic.scrollIntoView({block:'center',behavior:'smooth'})},40)}
function sync(){var t=autoCandidate();if(!t){if(!document.querySelector('.cpc-apostila-topic.'+AT)){dismissed=false;leave(false)}return}if(!dismissed)enter(t,false)}

// Civil mantém o comportamento anterior. CPC não entra mais automaticamente em tela cheia.
document.addEventListener('click',function(event){
 var cpcButton=event.target.closest('[data-cpc-reading-mode]');
 if(cpcButton){event.preventDefault();event.stopPropagation();var cpcTopic=cpcButton.closest('.cpc-apostila-topic');if(cpcTopic)enter(cpcTopic,true);return}
 var toggle=event.target.closest('.ct-topic summary');
 if(toggle){var details=toggle.closest('.ct-topic');setTimeout(function(){if(details&&details.open){dismissed=false;enter(details,false)}else sync()},80)}
},true);
document.addEventListener('keydown',function(event){if(event.key==='Escape'&&document.documentElement.classList.contains(ROOT))leave(true)});

window.CentralReadingFullscreen={enter:function(target){return enter(target,true)},leave:function(){leave(true)},active:function(){return document.documentElement.classList.contains(ROOT)}};

function start(){sync();setTimeout(sync,500);setTimeout(sync,1600)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
var observer=new MutationObserver(function(){setTimeout(sync,40)});observer.observe(document.documentElement,{subtree:true,childList:true});

var style=document.createElement('style');style.id='central-reading-fullscreen-style-v66140';style.textContent=`
html.${ROOT},html.${ROOT} body{height:100%!important;overflow:hidden!important;background:var(--cm-paper,#fffefb)!important}
html.${ROOT} #appRoot{height:100dvh!important;width:100%!important;display:grid!important;grid-template-columns:minmax(0,1fr)!important;background:var(--cm-paper,#fffefb)!important}
html.${ROOT} #centralSidebar,html.${ROOT} #mobileSidebarBackdrop,html.${ROOT} .topbar{display:none!important}
html.${ROOT} .shell,html.${ROOT} .workspace{height:100%!important;min-height:0!important;min-width:0!important}
html.${ROOT} #homeView.view{position:fixed!important;inset:0!important;z-index:9990!important;width:100vw!important;height:100dvh!important;margin:0!important;padding:0!important;overflow:auto!important;background:var(--cm-paper,#fffefb)!important}
html.${ROOT} #homeView>.hero,html.${ROOT} #homeView .side-col{display:none!important}
html.${ROOT} #homeView .home-grid,html.${ROOT} #homeView .home-grid>div:first-child,html.${ROOT} #homeView .subjects{display:block!important;width:100%!important;max-width:none!important}
html.${ROOT} #homeView .subject:not(.${AS}){display:none!important}
html.${ROOT} #homeView .subject.${AS}{width:100%!important;margin:0!important;border:0!important;border-radius:0!important;background:var(--cm-paper,#fffefb)!important;overflow:visible!important}
html.${ROOT} #homeView .subject.${AS}>.subject-head,html.${ROOT} #homeView .subject.${AS}>.subject-body>.subject-bar{display:none!important}
html.${ROOT} #homeView .subject.${AS}>.subject-body{display:block!important;padding:0!important}
html.${ROOT} #homeView .civil-module:not(.${AM}),html.${ROOT} #homeView .cf-module:not(.${AM}){display:none!important}
html.${ROOT} #homeView .civil-module.${AM},html.${ROOT} #homeView .cf-module.${AM}{width:100%!important;max-width:none!important;margin:0!important;border:0!important;border-radius:0!important;box-shadow:none!important;background:var(--cm-paper,#fffefb)!important;overflow:visible!important}
html.${ROOT} #homeView .civil-module.${AM}>.civil-module-head,html.${ROOT} #homeView .cf-module.${AM}>.cf-module-head{display:none!important}
html.${ROOT} #homeView .civil-module.${AM}>.civil-module-body,html.${ROOT} #homeView .cf-module.${AM}>.cf-module-body{display:block!important;width:100%!important;max-width:none!important;padding:0!important}
html.${ROOT} #homeView .civil-step:not(.${AG}),html.${ROOT} #homeView .cf-step:not(.${AG}){display:none!important}
html.${ROOT} #homeView .civil-step.${AG},html.${ROOT} #homeView .cf-step.${AG}{width:100%!important;max-width:none!important;margin:0!important;border:0!important;border-radius:0!important}
html.${ROOT} #homeView .civil-step.${AG}>.civil-step-head,html.${ROOT} #homeView .cf-step.${AG}>.cf-step-head{display:none!important}
html.${ROOT} #homeView .civil-step.${AG}>.civil-step-body,html.${ROOT} #homeView .cf-step.${AG}>.cf-step-body{display:block!important;width:100%!important;max-width:none!important;padding:58px clamp(18px,4vw,64px) 48px!important}
html.${ROOT} #homeView .ct-list>.ct-topic:not(.${AT}),html.${ROOT} #homeView .cpc-apostila-topic:not(.${AT}){display:none!important}
html.${ROOT} #homeView .ct-topic.${AT},html.${ROOT} #homeView .cpc-apostila-topic.${AT}{width:100%!important;max-width:980px!important;margin:0 auto!important;border:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important}
html.${ROOT} #homeView .ct-topic.${AT}>summary,html.${ROOT} #homeView .cpc-apostila-topic.${AT}>summary{position:sticky!important;top:48px!important;z-index:30!important;min-height:56px!important;border-bottom:1px solid var(--cm-line,#e7e8e3)!important;background:color-mix(in srgb,var(--cm-paper,#fffefb) 96%,transparent)!important;backdrop-filter:blur(12px)}
html.${ROOT} #homeView .ct-rich.${AT} .ct-body,html.${ROOT} #homeView .cpc-apostila-topic.${AT} .cf-theory-text{width:100%!important;max-width:900px!important;margin:0 auto!important;padding:28px 24px 64px!important}
html.${ROOT} #central-update-btn,html.${ROOT} #central-progress-button,html.${ROOT} #central-progress-entry-v1,html.${ROOT} .central-progress-floating{display:none!important}
#central-reading-exit{display:none;position:fixed;z-index:99999;left:14px;top:10px;min-height:36px;padding:8px 12px;border:1px solid var(--cm-line2,#d9ddd8);border-radius:8px;background:var(--cm-paper,#fffefb);color:var(--cm-text,#1f2933);font:700 12px/1 Inter,system-ui,sans-serif;cursor:pointer}
html.${ROOT} #central-reading-exit{display:inline-flex;align-items:center;gap:7px}
@media(max-width:760px){html.${ROOT} #homeView .civil-step.${AG}>.civil-step-body,html.${ROOT} #homeView .cf-step.${AG}>.cf-step-body{padding:52px 10px 30px!important}html.${ROOT} #homeView .ct-rich.${AT} .ct-body,html.${ROOT} #homeView .cpc-apostila-topic.${AT} .cf-theory-text{padding:22px 14px 42px!important}#central-reading-exit{left:8px;top:7px;min-height:34px;padding:7px 10px;font-size:11px}}
`;document.head.appendChild(style);
})();
