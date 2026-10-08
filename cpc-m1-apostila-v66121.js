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
 cover.innerHTML='<div class="cpc-apostila-cover-top"><span>DIREITO PROCESSUAL CIVIL</span><span>CPC · MÓDULO 01</span></div><p class="cpc-apostila-area">Apostila de estudo</p><h2>Normas fundamentais, fontes, aplicação e direito intertemporal</h2><p class="cpc-apostila-basis">CPC, arts. 1º a 15 · Constituição Federal · LINDB</p>';
 var bar=body.querySelector(':scope > .cf-module-bar');
 if(bar)bar.insertAdjacentElement('afterend',cover);else body.insertBefore(cover,body.firstChild);
}
function removeHighlights(el){
 var matrix=el.querySelector(':scope > .cf-module-body > .cf-syllabus');
 var warning=el.querySelector(':scope > .cf-module-body > .cpc-coverage-warning');
 if(matrix)matrix.setAttribute('data-cpc-apostila-removed','matrix');
 if(warning)warning.setAttribute('data-cpc-apostila-removed','coverage-warning');
}
function insertStudyPanel(el){
 var body=el.querySelector(':scope > .cf-module-body');
 var steps=body&&body.querySelector(':scope > .cf-steps');
 if(!body||!steps||body.querySelector(':scope > .cpc-apostila-study'))return;
 var stat=el.querySelector(':scope > .cf-module-head .cf-module-stat');
 var match=(stat&&stat.textContent||'').match(/(\d+)%/);
 var percent=match?Math.max(0,Math.min(100,Number(match[1]))):0;
 var stages=[
  ['01','Leitura da lei','#cpc-m1-leitura'],
  ['02','Teoria essencial','#cpc-m1-teoria'],
  ['03','Aprofundamento FCC','#cpc-m1-aprofundamento'],
  ['04','Ferramentas','#cpc-m1-recursos']
 ];
 var panel=document.createElement('section');
 panel.className='cpc-apostila-study';
 panel.innerHTML='<div class="cpc-apostila-study-head"><div><span>PROGRESSO DE ESTUDO</span><strong>'+percent+'% concluído</strong></div><b>'+percent+'%</b></div><div class="cpc-apostila-progress"><i style="width:'+percent+'%"></i></div><nav aria-label="Etapas de estudo">'+stages.map(function(stage){
  var target=body.querySelector(stage[2]);
  var done=target&&target.classList.contains('done');
  return '<a href="'+stage[2]+'"'+(done?' class="done"':'')+'><small>'+stage[0]+'</small><span>'+stage[1]+'</span><em>'+(done?'Concluído':'Abrir')+'</em></a>';
 }).join('')+'</nav><p class="cpc-apostila-tools">Anki · Lei em Dia · TEC ficam disponíveis no final da apostila.</p>';
 panel.addEventListener('click',function(event){
  var link=event.target.closest('a');if(!link)return;
  var target=body.querySelector(link.getAttribute('href'));if(!target)return;
  event.preventDefault();target.scrollIntoView({behavior:'smooth',block:'start'});
 });
 steps.insertAdjacentElement('beforebegin',panel);
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
 hideQuestionBlocks(el);markSections(el);removeHighlights(el);insertIntro(el);insertStudyPanel(el);
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
 padding:13px 20px!important;background:#23352f!important;border:0!important;border-radius:0!important;
 display:grid!important;grid-template-columns:auto 1fr auto!important;gap:10px 16px!important;color:#f8f5ec!important;
}
html.central-minimal-v66119 .cpc-m1-apostila.open>.cf-module-head .cf-module-no{color:#d5dfd8!important;font-size:10px!important;letter-spacing:.13em!important}
html.central-minimal-v66119 .cpc-m1-apostila.open>.cf-module-head .cf-module-title{display:none!important}
html.central-minimal-v66119 .cpc-m1-apostila.open>.cf-module-head .cf-module-stat{color:#c7d2cb!important;font-size:10px!important}
html.central-minimal-v66119 .cpc-m1-apostila.open>.cf-module-head .chev{color:#d5dfd8!important}
html.central-minimal-v66119 .cpc-m1-apostila>.cf-module-body{padding:0 0 30px!important;background:var(--cpc-paper)!important;color:var(--cpc-ink)!important}
html.central-minimal-v66119 .cpc-m1-apostila .cf-module-bar{height:4px!important;margin:0!important;border-radius:0!important;background:#dfe5df!important}
html.central-minimal-v66119 .cpc-m1-apostila .cf-module-bar>span{background:#8eaa9b!important}
html.central-minimal-v66119 .cpc-m1-apostila .cf-subtitle{display:none!important}
html.central-minimal-v66119 .cpc-m1-apostila [data-cpc-apostila-removed]{display:none!important}
html.central-minimal-v66119 .cpc-m1-apostila [data-cpc-apostila-hidden="questions"]{display:none!important}

html.central-minimal-v66119 .cpc-apostila-cover{max-width:920px;margin:0 auto;padding:29px 42px 27px;background:linear-gradient(180deg,#fffdf7 0%,#fbf7ec 100%);border-bottom:1px solid var(--cpc-rule)}
html.central-minimal-v66119 .cpc-apostila-cover-top{display:flex;justify-content:space-between;gap:14px;color:var(--cpc-green);font:750 9px/1.3 Inter,system-ui,sans-serif;letter-spacing:.11em}
html.central-minimal-v66119 .cpc-apostila-area{margin:22px 0 7px;color:var(--cpc-rust);font:750 9px/1.4 Inter,system-ui,sans-serif;letter-spacing:.1em;text-transform:uppercase}
html.central-minimal-v66119 .cpc-apostila-cover h2{max-width:790px;margin:0;color:var(--cpc-ink);font:600 clamp(25px,3.2vw,38px)/1.1 Georgia,"Times New Roman",serif;letter-spacing:-.022em;text-wrap:balance}
html.central-minimal-v66119 .cpc-apostila-basis{margin:12px 0 0;color:var(--cpc-muted);font:italic 14px/1.45 Georgia,"Times New Roman",serif}
html.central-minimal-v66119 .cpc-apostila-cover-foot{display:none!important}

html.central-minimal-v66119 .cpc-apostila-study{max-width:920px;margin:20px auto 26px;padding:22px 28px 18px;border-top:1px solid var(--cpc-rule);border-bottom:1px solid var(--cpc-rule);background:#faf7ef}
html.central-minimal-v66119 .cpc-apostila-study-head{display:flex;justify-content:space-between;gap:16px;align-items:end}
html.central-minimal-v66119 .cpc-apostila-study-head>div{display:grid;gap:4px}
html.central-minimal-v66119 .cpc-apostila-study-head span{color:var(--cpc-green);font-size:9px;font-weight:800;letter-spacing:.12em}
html.central-minimal-v66119 .cpc-apostila-study-head strong{color:var(--cpc-ink);font:600 19px/1.25 Georgia,"Times New Roman",serif}
html.central-minimal-v66119 .cpc-apostila-study-head>b{color:var(--cpc-green);font:700 16px/1 Inter,system-ui,sans-serif}
html.central-minimal-v66119 .cpc-apostila-progress{height:4px;margin:14px 0 18px;overflow:hidden;background:#dfe5df}
html.central-minimal-v66119 .cpc-apostila-progress>i{display:block;height:100%;background:var(--cpc-green)}
html.central-minimal-v66119 .cpc-apostila-study nav{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:0;border-top:1px solid var(--cpc-rule)}
html.central-minimal-v66119 .cpc-apostila-study nav a{display:grid;grid-template-columns:auto 1fr;gap:2px 9px;padding:14px 12px 10px;border-right:1px solid var(--cpc-rule);color:var(--cpc-ink)!important;text-decoration:none!important}
html.central-minimal-v66119 .cpc-apostila-study nav a:last-child{border-right:0}
html.central-minimal-v66119 .cpc-apostila-study nav small{grid-row:1/3;color:var(--cpc-rust);font-weight:800}
html.central-minimal-v66119 .cpc-apostila-study nav span{font-size:11px;font-weight:750}
html.central-minimal-v66119 .cpc-apostila-study nav em{color:var(--cpc-muted);font-size:9px;font-style:normal}
html.central-minimal-v66119 .cpc-apostila-study nav a.done em{color:var(--cpc-green);font-weight:750}
html.central-minimal-v66119 .cpc-apostila-tools{margin:12px 0 0;color:var(--cpc-muted);font-size:9px}

html.central-minimal-v66119 .cpc-apostila-nav{position:sticky;top:8px;z-index:5;max-width:920px;margin:18px auto 26px;padding:9px 12px;display:flex;align-items:center;gap:5px;border:1px solid var(--cpc-rule);border-radius:9px;background:color-mix(in srgb,var(--cpc-paper) 94%,transparent);backdrop-filter:blur(12px);box-shadow:0 7px 22px rgba(65,58,43,.06)}
html.central-minimal-v66119 .cpc-apostila-nav>span{margin:0 8px 0 2px;color:var(--cpc-muted);font-size:9px;font-weight:800;letter-spacing:.12em}
html.central-minimal-v66119 .cpc-apostila-nav a{padding:8px 10px;border-radius:7px;color:var(--cpc-ink)!important;text-decoration:none!important;font-size:10px!important;font-weight:650!important;white-space:nowrap}
html.central-minimal-v66119 .cpc-apostila-nav a:hover{background:var(--cpc-green-soft)!important;color:var(--cpc-green)!important}
html.central-minimal-v66119 .cpc-apostila-nav a b{margin-right:5px;color:var(--cpc-rust)}

html.central-minimal-v66119 .cpc-m1-apostila .cf-steps{max-width:920px!important;margin:0 auto!important;padding:0 34px!important;display:block!important}
html.central-minimal-v66119 .cpc-m1-apostila .cpc-apostila-section{position:relative!important;margin:0!important;padding:0!important;border:0!important;border-top:1px solid var(--cpc-rule)!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;scroll-margin-top:82px}
html.central-minimal-v66119 .cpc-m1-apostila .cpc-apostila-section>.cf-step-head{position:relative!important;padding:29px 0 17px 60px!important;border:0!important;background:transparent!important;align-items:flex-start!important}
html.central-minimal-v66119 .cpc-m1-apostila .cpc-apostila-section>.cf-step-head{display:grid!important;grid-template-columns:minmax(0,1fr)!important}
html.central-minimal-v66119 .cpc-m1-apostila .cpc-apostila-section>.cf-step-head>.cf-step-copy{grid-column:1!important;width:auto!important;min-width:0!important}
html.central-minimal-v66119 .cpc-m1-apostila .cpc-apostila-section>.cf-step-head:before{content:attr(data-apostila-number);position:absolute;left:0;top:27px;color:var(--cpc-rust);font:600 25px/1 Georgia,"Times New Roman",serif}
html.central-minimal-v66119 .cpc-m1-apostila .cpc-apostila-section>.cf-step-head:after{content:attr(data-apostila-eyebrow);position:absolute;left:60px;top:17px;color:var(--cpc-green);font:750 8px/1 Inter,system-ui,sans-serif;letter-spacing:.12em;text-transform:uppercase}
html.central-minimal-v66119 .cpc-m1-apostila .cpc-apostila-section .cf-step-no{display:none!important}
html.central-minimal-v66119 .cpc-m1-apostila .cpc-apostila-section .cf-step-copy b{color:var(--cpc-ink)!important;font:600 25px/1.25 Georgia,"Times New Roman",serif!important}
html.central-minimal-v66119 .cpc-m1-apostila .cpc-apostila-section .cf-step-copy small{margin-top:5px!important;color:var(--cpc-muted)!important;font-size:11px!important}
html.central-minimal-v66119 .cpc-m1-apostila .cpc-apostila-section>.cf-step-body{padding:0 0 34px 60px!important;color:var(--cpc-ink)!important}
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
 html.central-minimal-v66119 .cpc-m1-apostila.open>.cf-module-head{padding:12px 14px!important;grid-template-columns:auto 1fr auto!important}
 html.central-minimal-v66119 .cpc-m1-apostila.open>.cf-module-head .cf-module-title{display:none!important}
 html.central-minimal-v66119 .cpc-m1-apostila.open>.cf-module-head .cf-module-stat{display:none!important}
 html.central-minimal-v66119 .cpc-apostila-cover{padding:24px 18px 22px!important}
 html.central-minimal-v66119 .cpc-apostila-cover h2{font-size:27px!important}
 html.central-minimal-v66119 .cpc-apostila-cover-top{font-size:8px!important}
 html.central-minimal-v66119 .cpc-apostila-study{margin:14px 12px 20px!important;padding:18px 16px 14px!important}
 html.central-minimal-v66119 .cpc-apostila-study nav{grid-template-columns:1fr 1fr!important}
 html.central-minimal-v66119 .cpc-apostila-study nav a:nth-child(2){border-right:0!important}
 html.central-minimal-v66119 .cpc-apostila-study nav a:nth-child(n+3){border-top:1px solid var(--cpc-rule)!important}
 html.central-minimal-v66119 .cpc-apostila-nav,
 html.central-minimal-v66119 .cpc-m1-apostila .cf-steps,
 html.central-minimal-v66119 .cpc-m1-apostila .cpc-apostila-resources{margin-left:12px!important;margin-right:12px!important}
 html.central-minimal-v66119 .cpc-apostila-nav{position:static!important;overflow-x:auto!important;justify-content:flex-start!important}
 html.central-minimal-v66119 .cpc-apostila-nav>span{display:none!important}
 html.central-minimal-v66119 .cpc-apostila-nav a{flex:0 0 auto!important}
 html.central-minimal-v66119 .cpc-m1-apostila .cf-steps{padding:0 18px!important}
 html.central-minimal-v66119 .cpc-m1-apostila .cpc-apostila-section>.cf-step-head{padding:25px 0 15px 45px!important}
 html.central-minimal-v66119 .cpc-m1-apostila .cpc-apostila-section>.cf-step-head:before{left:0!important;font-size:21px!important}
 html.central-minimal-v66119 .cpc-m1-apostila .cpc-apostila-section>.cf-step-head:after{left:45px!important}
 html.central-minimal-v66119 .cpc-m1-apostila .cpc-apostila-section .cf-step-copy b{font-size:21px!important}
 html.central-minimal-v66119 .cpc-m1-apostila .cpc-apostila-section>.cf-step-body{padding:0 0 28px 45px!important}
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
