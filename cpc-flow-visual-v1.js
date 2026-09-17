(function(){
'use strict';
if(window.__cpcFlowVisualV1)return;window.__cpcFlowVisualV1=true;

function text(el){return (el&&el.textContent||'').replace(/\s+/g,' ').trim()}
function subject(){return document.querySelector('.subject[data-id="cpc"]')}
function topics(root){return [].slice.call((root||document).querySelectorAll('.cpc-apostila-topic'))}
function closeSiblings(current){var root=current.closest('.cf-step-body,.cf-module-body')||current.parentElement;topics(root).forEach(function(t){if(t!==current&&t.open)t.open=false})}
function addReadButton(topic){var summary=topic.querySelector(':scope > summary');if(!summary||summary.querySelector('[data-cpc-reading-mode]'))return;var b=document.createElement('button');b.type='button';b.className='cpc-reading-button';b.setAttribute('data-cpc-reading-mode','1');b.setAttribute('aria-label','Abrir este tópico em modo leitura');b.textContent='Modo leitura';summary.appendChild(b)}
function buildModuleNav(mod){if(mod.querySelector(':scope > .cf-module-body > .cpc-flow-nav'))return;var body=mod.querySelector(':scope > .cf-module-body');if(!body)return;var sections=[].slice.call(body.querySelectorAll('.cpc-apostila-section')).filter(function(x){return x.offsetParent!==null||!x.hasAttribute('data-cpc-apostila-hidden')});if(!sections.length)return;var nav=document.createElement('nav');nav.className='cpc-flow-nav';nav.setAttribute('aria-label','Navegação do módulo');nav.innerHTML='<span class="cpc-flow-nav-label">NAVEGAR</span>'+sections.map(function(sec,i){var id=sec.id||('cpc-section-'+i);sec.id=id;var head=sec.querySelector(':scope > .cf-step-head');var label=(head&&text(head))||sec.getAttribute('data-apostila-eyebrow')||('Etapa '+(i+1));label=label.replace(/\s*\d+%\s*$/,'').trim();return '<button type="button" data-target="'+id+'"><b>'+String(i+1).padStart(2,'0')+'</b><span>'+label+'</span></button>'}).join('')+'<button type="button" data-target="cpc-m1-recursos"><b>+</b><span>Recursos</span></button>';
 nav.addEventListener('click',function(e){var b=e.target.closest('button[data-target]');if(!b)return;var target=body.querySelector('#'+CSS.escape(b.getAttribute('data-target')));if(!target)return;e.preventDefault();target.scrollIntoView({behavior:'smooth',block:'start'})});
 var cover=body.querySelector(':scope > .cpc-apostila-cover');if(cover)cover.insertAdjacentElement('afterend',nav);else body.insertBefore(nav,body.firstChild)}
function simplifyStudyPanel(mod){var panel=mod.querySelector('.cpc-apostila-study');if(!panel)return;panel.classList.add('cpc-flow-study');var old=panel.querySelector('.cpc-apostila-tools');if(old)old.textContent='Fluxo recomendado: lei → teoria → aprofundamento → Anki / Decorando / TEC.'}
function markModules(s){[].slice.call(s.querySelectorAll('.cf-module')).forEach(function(mod,i){mod.classList.add('cpc-flow-module');mod.setAttribute('data-cpc-flow-index',String(i+1));var head=mod.querySelector(':scope > .cf-module-head');if(head&&!head.querySelector('.cpc-flow-module-kicker')){var k=document.createElement('span');k.className='cpc-flow-module-kicker';k.textContent='CPC · MÓDULO '+String(i+1).padStart(2,'0');head.insertBefore(k,head.firstChild)}if(mod.classList.contains('cpc-m1-apostila')){buildModuleNav(mod);simplifyStudyPanel(mod)}})}
function apply(){var s=subject();if(!s)return false;s.classList.add('cpc-flow-subject');markModules(s);topics(s).forEach(addReadButton);return true}

document.addEventListener('toggle',function(e){var t=e.target;if(!t||!t.classList||!t.classList.contains('cpc-apostila-topic'))return;if(t.open){closeSiblings(t);setTimeout(function(){t.scrollIntoView({block:'nearest'})},20)}},true);
document.addEventListener('click',function(e){var summary=e.target.closest('.cpc-apostila-topic>summary');if(summary&&e.target.closest('[data-cpc-reading-mode]'))return},true);

function schedule(){setTimeout(apply,80);setTimeout(apply,400);setTimeout(apply,1400)}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
var obs=new MutationObserver(function(){requestAnimationFrame(apply)});obs.observe(document.documentElement,{subtree:true,childList:true});

var style=document.createElement('style');style.id='cpc-flow-visual-v1-style';style.textContent=`
html.central-minimal-v66119 .cpc-flow-subject>.subject-head{position:sticky;top:0;z-index:12;background:color-mix(in srgb,var(--cm-paper,#fffefb) 96%,transparent);backdrop-filter:blur(12px)}
html.central-minimal-v66119 .cpc-flow-subject>.subject-body{overflow:visible!important}
html.central-minimal-v66119 .cpc-flow-module{scroll-margin-top:70px}
html.central-minimal-v66119 .cpc-flow-module>.cf-module-head{min-height:58px!important;align-items:center!important}
html.central-minimal-v66119 .cpc-flow-module-kicker{display:none;color:var(--cm-muted);font:800 9px/1.2 Inter,system-ui,sans-serif;letter-spacing:.1em;text-transform:uppercase}
html.central-minimal-v66119 .cpc-flow-module.open>.cf-module-head .cpc-flow-module-kicker{display:block;grid-column:1/-1;margin-bottom:-4px}
html.central-minimal-v66119 .cpc-flow-nav{position:sticky;top:8px;z-index:20;max-width:920px;margin:16px auto 22px;padding:7px;display:flex;align-items:center;gap:4px;border:1px solid var(--cpc-rule,#ded7c7);border-radius:10px;background:color-mix(in srgb,var(--cpc-paper,#fffdf7) 95%,transparent);backdrop-filter:blur(14px);box-shadow:0 8px 24px rgba(48,55,50,.06);overflow-x:auto;scrollbar-width:none}
html.central-minimal-v66119 .cpc-flow-nav::-webkit-scrollbar{display:none}.cpc-flow-nav-label{padding:0 8px;color:var(--cpc-muted,#6f766f);font:800 8px/1 Inter,system-ui,sans-serif;letter-spacing:.12em;white-space:nowrap}
html.central-minimal-v66119 .cpc-flow-nav button{display:flex!important;align-items:center!important;gap:6px!important;min-height:36px!important;padding:7px 9px!important;border:0!important;border-radius:7px!important;background:transparent!important;color:var(--cpc-ink,#25302b)!important;font:700 9px/1.2 Inter,system-ui,sans-serif!important;white-space:nowrap!important;cursor:pointer!important}
html.central-minimal-v66119 .cpc-flow-nav button:hover{background:var(--cpc-green-soft,#e8f0eb)!important;color:var(--cpc-green,#315f50)!important}.cpc-flow-nav button b{color:var(--cpc-rust,#9a5642);font-size:8px}
html.central-minimal-v66119 .cpc-flow-study{margin-top:10px!important;margin-bottom:20px!important;border-radius:10px!important;border:1px solid var(--cpc-rule,#ded7c7)!important;background:#faf7ef!important}
html.central-minimal-v66119 .cpc-apostila-section{scroll-margin-top:64px!important}
html.central-minimal-v66119 .cpc-apostila-topic{border:1px solid var(--cpc-rule,#ded7c7)!important;border-radius:10px!important;background:#fffef9!important;margin:8px 0!important;overflow:clip!important;box-shadow:none!important}
html.central-minimal-v66119 .cpc-apostila-topic>summary{display:grid!important;grid-template-columns:auto minmax(0,1fr) auto!important;align-items:center!important;gap:10px!important;min-height:58px!important;padding:12px 14px!important;background:#fffef9!important;cursor:pointer!important}
html.central-minimal-v66119 .cpc-apostila-topic[open]>summary{border-bottom:1px solid var(--cpc-rule,#ded7c7)!important;background:#faf7ef!important}
html.central-minimal-v66119 .cpc-apostila-topic .cf-theory-text{max-width:760px!important;margin:0 auto!important;padding:24px 24px 30px!important;font-size:16px!important;line-height:1.72!important}
html.central-minimal-v66119 .cpc-reading-button{display:none!important;min-height:30px!important;padding:6px 9px!important;border:1px solid #b8c9c0!important;border-radius:7px!important;background:#eef4f0!important;color:#315f50!important;font:800 9px/1 Inter,system-ui,sans-serif!important;letter-spacing:.02em!important;cursor:pointer!important}
html.central-minimal-v66119 .cpc-apostila-topic[open] .cpc-reading-button{display:inline-flex!important;align-items:center!important}
html.central-minimal-v66119 .cpc-apostila-topic[open] .cpc-reading-button:hover{background:#e2ece6!important}
html.central-minimal-v66119 .cpc-m1-apostila .cf-steps{padding-bottom:8px!important}
html.central-minimal-v66119 .cpc-m1-apostila .cpc-apostila-resources{margin-top:24px!important;border-top:1px solid var(--cpc-rule,#ded7c7)!important;padding-top:18px!important}
@media(max-width:760px){html.central-minimal-v66119 .cpc-flow-nav{top:5px;margin:10px 8px 16px;padding:5px}.cpc-flow-nav-label{display:none}html.central-minimal-v66119 .cpc-flow-nav button{min-height:34px!important;padding:6px 8px!important}html.central-minimal-v66119 .cpc-apostila-topic>summary{grid-template-columns:auto minmax(0,1fr)!important;padding:11px 10px!important}.cpc-reading-button{grid-column:2;margin-top:2px;justify-self:start}html.central-minimal-v66119 .cpc-apostila-topic .cf-theory-text{padding:18px 14px 24px!important;font-size:15.5px!important;line-height:1.68!important}}
`;document.head.appendChild(style);
})();
