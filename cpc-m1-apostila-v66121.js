(function(){
'use strict';
if(window.__cpcM1ApostilaV66121)return;
window.__cpcM1ApostilaV66121=true;

function text(el){return (el&&el.textContent||'').replace(/\s+/g,' ').trim()}
function root(){
 return document.querySelector('.cf-module[data-cf="cpc1"]')||
  [].slice.call(document.querySelectorAll('.cf-module')).find(function(el){
   return /M[oó]dulo\s*1\b/i.test(text(el))&&/Normas fundamentais/i.test(text(el));
  })||null;
}
function hideQuestionBlocks(el){
 var steps=el.querySelectorAll(':scope > .cf-module-body > .cf-steps > .cf-step');
 [0,3,5,6].forEach(function(i){if(steps[i])steps[i].setAttribute('data-cpc-apostila-hidden','questions')});
}
function markSections(el){
 var steps=el.querySelectorAll(':scope > .cf-module-body > .cf-steps > .cf-step');
 var map=[
  {i:1,id:'cpc-m1-leitura',label:'01',eyebrow:'Leitura da lei'},
  {i:2,id:'cpc-m1-teoria',label:'02',eyebrow:'Teoria essencial'},
  {i:4,id:'cpc-m1-aprofundamento',label:'03',eyebrow:'Aprofundamento FCC'}
 ];
 map.forEach(function(item){
  var step=steps[item.i];if(!step)return;
  step.id=item.id;step.classList.add('cpc-apostila-section');
  step.setAttribute('data-apostila-number',item.label);
  step.setAttribute('data-apostila-eyebrow',item.eyebrow);
  var head=step.querySelector(':scope > .cf-step-head');
  if(head){head.setAttribute('data-apostila-number',item.label);head.setAttribute('data-apostila-eyebrow',item.eyebrow)}
 });
 var resources=el.querySelector(':scope > .cf-module-body > .cf-resources');
 if(resources){resources.id='cpc-m1-recursos';resources.classList.add('cpc-apostila-resources')}
 [].forEach.call(el.querySelectorAll('.cf-theory'),function(topic,i){
  topic.classList.add('cpc-apostila-topic');
  topic.setAttribute('data-topic-number',String(i+1).padStart(2,'0'));
  var summary=topic.querySelector(':scope > summary');
  if(summary)summary.setAttribute('data-topic-number',String(i+1).padStart(2,'0'));
 });
 [].forEach.call(el.querySelectorAll('.cpc-law-card'),function(card,i){card.setAttribute('data-law-number',String(i+1).padStart(2,'0'))});
}
function insertIntro(el){
 var body=el.querySelector(':scope > .cf-module-body');
 if(!body||body.querySelector(':scope > .cpc-apostila-cover'))return;
 var cover=document.createElement('header');
 cover.className='cpc-apostila-cover';
 var topics=el.querySelectorAll('.cf-theory').length||6;
 var law=el.querySelectorAll('.cpc-law-card').length||4;
 cover.innerHTML='<div class="cpc-apostila-cover-top"><span class="cpc-apostila-edition">APOSTILA DIGITAL</span><span class="cpc-apostila-code">CPC · MÓDULO 01</span></div><div class="cpc-apostila-rule"></div><p class="cpc-apostila-area">Direito Processual Civil</p><h2>Normas fundamentais, fontes, aplicação e direito intertemporal</h2><p class="cpc-apostila-basis">CPC, arts. 1º a 15 · Constituição Federal · LINDB</p><div class="cpc-apostila-cover-foot"><span><b>3</b> capítulos de estudo</span><span><b>'+topics+'</b> tópicos essenciais</span><span><b>'+law+'</b> blocos de lei seca</span></div>';
 var bar=body.querySelector(':scope > .cf-module-bar');
 if(bar)bar.insertAdjacentElement('afterend',cover);else body.insertBefore(cover,body.firstChild);
}
function insertNav(el){
 var body=el.querySelector(':scope > .cf-module-body');
 var steps=body&&body.querySelector(':scope > .cf-steps');
 if(!body||!steps||body.querySelector(':scope > .cpc-apostila-nav'))return;
 var nav=document.createElement('nav');
 nav.className='cpc-apostila-nav';nav.setAttribute('aria-label','Sumário da apostila');
 nav.innerHTML='<span>SUMÁRIO</span><a href="#cpc-m1-leitura"><b>01</b> Leitura da lei</a><a href="#cpc-m1-teoria"><b>02</b> Teoria essencial</a><a href="#cpc-m1-aprofundamento"><b>03</b> Aprofundamento FCC</a><a href="#cpc-m1-recursos"><b>+</b> Recursos e anotações</a>';
 nav.addEventListener('click',function(event){
  var link=event.target.closest('a');if(!link)return;
  var target=body.querySelector(link.getAttribute('href'));if(!target)return;
  event.preventDefault();target.scrollIntoView({behavior:'smooth',block:'start'});
 });
 steps.insertAdjacentElement('beforebegin',nav);
}
function apply(){
 var el=root();if(!el)return false;
 el.classList.add('cpc-m1-apostila');
 hideQuestionBlocks(el);markSections(el);insertIntro(el);insertNav(el);
 return true;
}
function schedule(){setTimeout(apply,50);setTimeout(apply,350);setTimeout(apply,1200)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
var observer=new MutationObserver(function(){
 if(window.__cpcM1ApostilaApplying)return;
 window.__cpcM1ApostilaApplying=true;
 requestAnimationFrame(function(){try{apply()}finally{window.__cpcM1ApostilaApplying=false}});
});
observer.observe(document.documentElement,{subtree:true,childList:true});

var style=document.createElement('style');
style.id='cpc-m1-apostila-style-v66121';
style.textContent=`
html.central-minimal-v66119 .cpc-m1-apostila{
 --cpc-ink:#25302b;--cpc-muted:#6f766f;--cpc-paper:#fffdf7;--cpc-paper-deep:#f5f0e4;
 --cpc-rule:#d9d1bf;--cpc-green:#315f50;--cpc-green-soft:#e8f0eb;--cpc-rust:#9a5642;
 border-color:var(--cpc-rule)!important;background:var(--cpc-paper)!important;overflow:hidden!important;
 box-shadow:0 18px 50px rgba(67,59,43,.08)!important;
}
html.central-minimal-v66119 .cpc-m1-apostila.open>.cf-module-head{
 padding:18px 24px!important;background:#23352f!important;border:0!important;border-radius:0!important;
 display:grid!important;grid-template-columns:auto 1fr auto auto!important;gap:10px 16px!important;color:#f8f5ec!important;
}
html.central-minimal-v66119 .cpc-m1-apostila.open>.cf-module-head .cf-module-no{color:#d5dfd8!important;font-size:10px!important;letter-spacing:.13em!important}
html.central-minimal-v66119 .cpc-m1-apostila.open>.cf-module-head .cf-module-title{color:#fffdf7!important;font-family:Georgia,"Times New Roman",serif!important;font-size:17px!important;text-transform:none!important;font-weight:600!important}
html.central-minimal-v66119 .cpc-m1-apostila.open>.cf-module-head .cf-module-stat{color:#c7d2cb!important;font-size:10px!important}
html.central-minimal-v66119 .cpc-m1-apostila.open>.cf-module-head .chev{color:#d5dfd8!important}
html.central-minimal-v66119 .cpc-m1-apostila>.cf-module-body{padding:0 0 30px!important;background:var(--cpc-paper)!important;color:var(--cpc-ink)!important}
html.central-minimal-v66119 .cpc-m1-apostila .cf-module-bar{height:4px!important;margin:0!important;border-radius:0!important;background:#dfe5df!important}
html.central-minimal-v66119 .cpc-m1-apostila .cf-module-bar>span{background:#8eaa9b!important}
html.central-minimal-v66119 .cpc-m1-apostila .cf-subtitle,
html.central-minimal-v66119 .cpc-m1-apostila .cf-syllabus,
html.central-minimal-v66119 .cpc-m1-apostila .cpc-coverage-warning{max-width:920px!important;margin-left:auto!important;margin-right:auto!important}
html.central-minimal-v66119 .cpc-m1-apostila .cf-subtitle{display:none!important}
html.central-minimal-v66119 .cpc-m1-apostila .cf-syllabus{margin-top:20px!important;border:1px solid var(--cpc-rule)!important;border-radius:8px!important;background:#faf7ef!important}
html.central-minimal-v66119 .cpc-m1-apostila .cf-syllabus summary{padding:12px 14px!important;color:var(--cpc-green)!important;font-size:10px!important;letter-spacing:.05em!important;text-transform:uppercase!important}
html.central-minimal-v66119 .cpc-m1-apostila .cf-micro{border-color:var(--cpc-rule)!important;background:transparent!important;color:var(--cpc-muted)!important}
html.central-minimal-v66119 .cpc-m1-apostila .cpc-coverage-warning{margin-top:14px!important;border:1px solid #e0c9bd!important;border-left:3px solid var(--cpc-rust)!important;border-radius:8px!important;background:#fbf3ee!important;color:var(--cpc-ink)!important}
html.central-minimal-v66119 .cpc-m1-apostila [data-cpc-apostila-hidden="questions"]{display:none!important}

html.central-minimal-v66119 .cpc-apostila-cover{max-width:920px;margin:0 auto;padding:48px 58px 42px;background:linear-gradient(180deg,#fffdf7 0%,#fbf7ec 100%);border-bottom:1px solid var(--cpc-rule)}
html.central-minimal-v66119 .cpc-apostila-cover-top{display:flex;justify-content:space-between;gap:14px;color:var(--cpc-green);font:700 10px/1.3 Inter,system-ui,sans-serif;letter-spacing:.12em}
html.central-minimal-v66119 .cpc-apostila-rule{height:1px;margin:17px 0 34px;background:var(--cpc-rule)}
html.central-minimal-v66119 .cpc-apostila-area{margin:0 0 10px;color:var(--cpc-rust);font:700 11px/1.4 Inter,system-ui,sans-serif;letter-spacing:.1em;text-transform:uppercase}
html.central-minimal-v66119 .cpc-apostila-cover h2{max-width:760px;margin:0;color:var(--cpc-ink);font:600 clamp(29px,4vw,46px)/1.08 Georgia,"Times New Roman",serif;letter-spacing:-.025em;text-wrap:balance}
html.central-minimal-v66119 .cpc-apostila-basis{margin:18px 0 0;color:var(--cpc-muted);font:italic 16px/1.5 Georgia,"Times New Roman",serif}
html.central-minimal-v66119 .cpc-apostila-cover-foot{display:flex;gap:10px 28px;flex-wrap:wrap;margin-top:34px;padding-top:18px;border-top:1px solid var(--cpc-rule);color:var(--cpc-muted);font-size:11px}
html.central-minimal-v66119 .cpc-apostila-cover-foot b{color:var(--cpc-green);font-size:13px}

html.central-minimal-v66119 .cpc-apostila-nav{position:sticky;top:8px;z-index:5;max-width:920px;margin:18px auto 26px;padding:9px 12px;display:flex;align-items:center;gap:5px;border:1px solid var(--cpc-rule);border-radius:9px;background:color-mix(in srgb,var(--cpc-paper) 94%,transparent);backdrop-filter:blur(12px);box-shadow:0 7px 22px rgba(65,58,43,.06)}
html.central-minimal-v66119 .cpc-apostila-nav>span{margin:0 8px 0 2px;color:var(--cpc-muted);font-size:9px;font-weight:800;letter-spacing:.12em}
html.central-minimal-v66119 .cpc-apostila-nav a{padding:8px 10px;border-radius:7px;color:var(--cpc-ink)!important;text-decoration:none!important;font-size:10px!important;font-weight:650!important;white-space:nowrap}
html.central-minimal-v66119 .cpc-apostila-nav a:hover{background:var(--cpc-green-soft)!important;color:var(--cpc-green)!important}
html.central-minimal-v66119 .cpc-apostila-nav a b{margin-right:5px;color:var(--cpc-rust)}

html.central-minimal-v66119 .cpc-m1-apostila .cf-steps{max-width:920px!important;margin:0 auto!important;display:block!important}
html.central-minimal-v66119 .cpc-m1-apostila .cpc-apostila-section{position:relative!important;margin:0 0 22px!important;padding:0!important;border:1px solid var(--cpc-rule)!important;border-radius:10px!important;background:var(--cpc-paper)!important;box-shadow:none!important;scroll-margin-top:82px}
html.central-minimal-v66119 .cpc-m1-apostila .cpc-apostila-section>.cf-step-head{position:relative!important;padding:25px 30px 19px 88px!important;border-bottom:1px solid var(--cpc-rule)!important;background:#faf7ef!important;align-items:flex-start!important}
html.central-minimal-v66119 .cpc-m1-apostila .cpc-apostila-section>.cf-step-head{display:grid!important;grid-template-columns:minmax(0,1fr)!important}
html.central-minimal-v66119 .cpc-m1-apostila .cpc-apostila-section>.cf-step-head>.cf-step-copy{grid-column:1!important;width:auto!important;min-width:0!important}
html.central-minimal-v66119 .cpc-m1-apostila .cpc-apostila-section>.cf-step-head:before{content:attr(data-apostila-number);position:absolute;left:28px;top:23px;color:var(--cpc-rust);font:600 25px/1 Georgia,"Times New Roman",serif}
html.central-minimal-v66119 .cpc-m1-apostila .cpc-apostila-section>.cf-step-head:after{content:attr(data-apostila-eyebrow);position:absolute;left:88px;top:13px;color:var(--cpc-green);font:750 8px/1 Inter,system-ui,sans-serif;letter-spacing:.12em;text-transform:uppercase}
html.central-minimal-v66119 .cpc-m1-apostila .cpc-apostila-section .cf-step-no{display:none!important}
html.central-minimal-v66119 .cpc-m1-apostila .cpc-apostila-section .cf-step-copy b{color:var(--cpc-ink)!important;font:600 25px/1.25 Georgia,"Times New Roman",serif!important}
html.central-minimal-v66119 .cpc-m1-apostila .cpc-apostila-section .cf-step-copy small{margin-top:5px!important;color:var(--cpc-muted)!important;font-size:11px!important}
html.central-minimal-v66119 .cpc-m1-apostila .cpc-apostila-section>.cf-step-body{padding:28px 34px 32px!important;color:var(--cpc-ink)!important}
html.central-minimal-v66119 .cpc-m1-apostila .cf-reading strong,
html.central-minimal-v66119 .cpc-m1-apostila .cf-reading li,
html.central-minimal-v66119 .cpc-m1-apostila .cf-theory-text,
html.central-minimal-v66119 .cpc-m1-apostila .cf-advanced div,
html.central-minimal-v66119 .cpc-m1-apostila .cpc-law-card li{font-family:Georgia,"Times New Roman",serif!important;font-size:16px!important;line-height:1.72!important;color:var(--cpc-ink)!important}
html.central-minimal-v66119 .cpc-m1-apostila .cf-reading{padding:0 0 22px!important;border-bottom:1px solid var(--cpc-rule)!important;background:transparent!important}
html.central-minimal-v66119 .cpc-m1-apostila .cf-reading strong{display:block!important;color:var(--cpc-green)!important;font-size:17px!important}
html.central-minimal-v66119 .cpc-m1-apostila .cf-reading ul{padding-left:22px!important}
html.central-minimal-v66119 .cpc-m1-apostila .cf-reading li+li{margin-top:8px!important}
html.central-minimal-v66119 .cpc-m1-apostila .cpc-law-heading{margin:26px 0 13px!important;color:var(--cpc-ink)!important}
html.central-minimal-v66119 .cpc-m1-apostila .cpc-law-heading b{font:600 20px/1.3 Georgia,"Times New Roman",serif!important}
html.central-minimal-v66119 .cpc-m1-apostila .cpc-law-heading span{color:var(--cpc-muted)!important;font-size:10px!important}
html.central-minimal-v66119 .cpc-m1-apostila .cpc-law-grid{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:12px!important}
html.central-minimal-v66119 .cpc-m1-apostila .cpc-law-card{position:relative!important;padding:20px 20px 18px!important;border:1px solid var(--cpc-rule)!important;border-radius:8px!important;background:#fbf8f0!important}
html.central-minimal-v66119 .cpc-m1-apostila .cpc-law-card:after{content:attr(data-law-number);position:absolute;right:15px;top:13px;color:#c8bda9;font:600 22px/1 Georgia,serif}
html.central-minimal-v66119 .cpc-m1-apostila .cpc-law-kicker{color:var(--cpc-rust)!important;font-size:8px!important;letter-spacing:.12em!important}
html.central-minimal-v66119 .cpc-m1-apostila .cpc-law-card h4{margin:8px 28px 5px 0!important;color:var(--cpc-ink)!important;font:600 18px/1.3 Georgia,"Times New Roman",serif!important}
html.central-minimal-v66119 .cpc-m1-apostila .cpc-law-card>strong{color:var(--cpc-green)!important;font-size:11px!important}

html.central-minimal-v66119 .cpc-m1-apostila .cf-theory-grid{display:block!important}
html.central-minimal-v66119 .cpc-m1-apostila .cpc-apostila-topic{position:relative!important;margin:0!important;border:0!important;border-bottom:1px solid var(--cpc-rule)!important;border-radius:0!important;background:transparent!important}
html.central-minimal-v66119 .cpc-m1-apostila .cpc-apostila-topic:first-child{border-top:1px solid var(--cpc-rule)!important}
html.central-minimal-v66119 .cpc-m1-apostila .cpc-apostila-topic summary{position:relative!important;padding:17px 45px 17px 48px!important;color:var(--cpc-ink)!important;font:600 18px/1.35 Georgia,"Times New Roman",serif!important;list-style:none!important;cursor:pointer!important}
html.central-minimal-v66119 .cpc-m1-apostila .cpc-apostila-topic summary:before{content:attr(data-topic-number);position:absolute;left:4px;top:19px;color:var(--cpc-rust);font:700 10px/1 Inter,system-ui,sans-serif;letter-spacing:.08em}
html.central-minimal-v66119 .cpc-m1-apostila .cpc-apostila-topic summary:after{content:'+';position:absolute;right:8px;top:15px;color:var(--cpc-green);font:400 22px/1 Georgia,serif}
html.central-minimal-v66119 .cpc-m1-apostila .cpc-apostila-topic[open] summary:after{content:'–'}
html.central-minimal-v66119 .cpc-m1-apostila .cpc-apostila-topic summary::-webkit-details-marker{display:none}
html.central-minimal-v66119 .cpc-m1-apostila .cpc-apostila-topic[open] summary{color:var(--cpc-green)!important;background:#fbf8f0!important}
html.central-minimal-v66119 .cpc-m1-apostila .cf-theory-text{padding:20px 48px 24px!important;background:#fffefb!important;border:0!important}
html.central-minimal-v66119 .cpc-m1-apostila .cf-advanced-grid{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:13px!important}
html.central-minimal-v66119 .cpc-m1-apostila .cf-advanced{padding:22px!important;border:1px solid var(--cpc-rule)!important;border-left:3px solid var(--cpc-rust)!important;border-radius:8px!important;background:#fbf8f0!important}
html.central-minimal-v66119 .cpc-m1-apostila .cf-advanced>b{display:block!important;margin-bottom:8px!important;color:var(--cpc-rust)!important;font:700 10px/1.35 Inter,system-ui,sans-serif!important;letter-spacing:.05em!important;text-transform:uppercase!important}
html.central-minimal-v66119 .cpc-m1-apostila .cf-actions{margin-top:22px!important;padding-top:16px!important;border-top:1px solid var(--cpc-rule)!important}
html.central-minimal-v66119 .cpc-m1-apostila .cf-btn{border-color:var(--cpc-rule)!important;background:transparent!important;color:var(--cpc-green)!important}
html.central-minimal-v66119 .cpc-m1-apostila .cf-btn.primary{background:var(--cpc-green)!important;color:#fff!important;border-color:var(--cpc-green)!important}
html.central-minimal-v66119 .cpc-m1-apostila .cf-btn.good{border-color:#7da28e!important;color:var(--cpc-green)!important;background:var(--cpc-green-soft)!important}
html.central-minimal-v66119 .cpc-m1-apostila .cpc-apostila-resources{max-width:920px!important;margin:0 auto!important;padding:0!important;border:1px solid var(--cpc-rule)!important;border-radius:10px!important;background:#faf7ef!important;scroll-margin-top:82px}
html.central-minimal-v66119 .cpc-m1-apostila .cpc-apostila-resources>summary{padding:16px 18px!important;color:var(--cpc-green)!important;font-weight:700!important;text-transform:uppercase!important;letter-spacing:.06em!important}
html.central-minimal-v66119 .cpc-m1-apostila .cf-resource-grid{padding:0 18px 18px!important}
html.central-minimal-v66119 .cpc-m1-apostila .cf-resource-box{border-color:var(--cpc-rule)!important;background:var(--cpc-paper)!important}
html.central-minimal-v66119 .cpc-m1-apostila .cf-notes{background:#fffefb!important;border-color:var(--cpc-rule)!important;font-family:Georgia,"Times New Roman",serif!important;font-size:15px!important;line-height:1.6!important}

@media(max-width:760px){
 html.central-minimal-v66119 .cpc-m1-apostila.open>.cf-module-head{padding:14px!important;grid-template-columns:1fr auto!important}
 html.central-minimal-v66119 .cpc-m1-apostila.open>.cf-module-head .cf-module-title{grid-column:1/-1!important;grid-row:2!important;font-size:15px!important}
 html.central-minimal-v66119 .cpc-m1-apostila.open>.cf-module-head .cf-module-stat{display:none!important}
 html.central-minimal-v66119 .cpc-apostila-cover{padding:34px 20px 30px!important}
 html.central-minimal-v66119 .cpc-apostila-cover h2{font-size:31px!important}
 html.central-minimal-v66119 .cpc-apostila-cover-top{font-size:8px!important}
 html.central-minimal-v66119 .cpc-apostila-cover-foot{display:grid!important;grid-template-columns:1fr 1fr!important;gap:9px!important}
 html.central-minimal-v66119 .cpc-m1-apostila .cf-syllabus,
 html.central-minimal-v66119 .cpc-m1-apostila .cpc-coverage-warning,
 html.central-minimal-v66119 .cpc-apostila-nav,
 html.central-minimal-v66119 .cpc-m1-apostila .cf-steps,
 html.central-minimal-v66119 .cpc-m1-apostila .cpc-apostila-resources{margin-left:12px!important;margin-right:12px!important}
 html.central-minimal-v66119 .cpc-apostila-nav{position:static!important;overflow-x:auto!important;justify-content:flex-start!important}
 html.central-minimal-v66119 .cpc-apostila-nav>span{display:none!important}
 html.central-minimal-v66119 .cpc-apostila-nav a{flex:0 0 auto!important}
 html.central-minimal-v66119 .cpc-m1-apostila .cpc-apostila-section>.cf-step-head{padding:24px 18px 17px 62px!important}
 html.central-minimal-v66119 .cpc-m1-apostila .cpc-apostila-section>.cf-step-head:before{left:18px!important;font-size:21px!important}
 html.central-minimal-v66119 .cpc-m1-apostila .cpc-apostila-section>.cf-step-head:after{left:62px!important}
 html.central-minimal-v66119 .cpc-m1-apostila .cpc-apostila-section .cf-step-copy b{font-size:21px!important}
 html.central-minimal-v66119 .cpc-m1-apostila .cpc-apostila-section>.cf-step-body{padding:22px 18px 25px!important}
 html.central-minimal-v66119 .cpc-m1-apostila .cpc-law-grid,
 html.central-minimal-v66119 .cpc-m1-apostila .cf-advanced-grid{grid-template-columns:1fr!important}
 html.central-minimal-v66119 .cpc-m1-apostila .cf-reading strong,
 html.central-minimal-v66119 .cpc-m1-apostila .cf-reading li,
 html.central-minimal-v66119 .cpc-m1-apostila .cf-theory-text,
 html.central-minimal-v66119 .cpc-m1-apostila .cf-advanced div,
 html.central-minimal-v66119 .cpc-m1-apostila .cpc-law-card li{font-size:15px!important;line-height:1.68!important}
 html.central-minimal-v66119 .cpc-m1-apostila .cpc-apostila-topic summary{padding:15px 38px 15px 38px!important;font-size:17px!important}
 html.central-minimal-v66119 .cpc-m1-apostila .cf-theory-text{padding:17px 12px 20px 38px!important}
}
`;
document.head.appendChild(style);
})();
