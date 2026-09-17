(function(){
'use strict';
if(window.__admM2RuntimeV66143)return;
window.__admM2RuntimeV66143=true;
var UID='adm-02-02-organizacao-administrativa';
var MARKER='<div class="resource"><div class="resource-label">O que já existe neste tópico</div>';
var PRELUDE=String.raw`
<section class="adm-m2-book" aria-label="Teoria completa do Módulo 2 de Direito Administrativo">
 <header class="adm-m2-cover">
  <div class="adm-m2-kicker"><span>DIREITO ADMINISTRATIVO</span><span>MÓDULO 02</span></div>
  <p class="adm-m2-type">Apostila de estudo · nível Analista</p>
  <h2>Organização Administrativa</h2>
  <p class="adm-m2-sub">Da arquitetura básica da Administração à Administração Indireta, autarquias, fundações, empresas estatais, agências e conselhos profissionais.</p>
  <div class="adm-m2-source-note"><b>Base jurídica vigente:</b> Constituição Federal · Decreto-Lei 200/67 · Lei 13.303/16 · Lei 13.848/19 · Lei 9.986/00 · Lei 9.649/98 · Decreto 2.487/98 · jurisprudência oficial selecionada do STF/STJ. Conferência realizada em fontes oficiais.</div>
 </header>

 <nav class="adm-m2-toc" aria-label="Sumário do Módulo 2">
  <a href="#adm-m2-s1"><b>01</b><span>Mapa da Administração</span></a>
  <a href="#adm-m2-s2"><b>02</b><span>Distribuição de competências</span></a>
  <a href="#adm-m2-s3"><b>03</b><span>Órgãos públicos</span></a>
  <a href="#adm-m2-s4"><b>04</b><span>Direta e Indireta</span></a>
  <a href="#adm-m2-s5"><b>05</b><span>Autarquias</span></a>
  <a href="#adm-m2-s6"><b>06</b><span>Fundações públicas</span></a>
  <a href="#adm-m2-s7"><b>07</b><span>EP e SEM</span></a>
  <a href="#adm-m2-s8"><b>08</b><span>Lei 13.303 e estatais</span></a>
  <a href="#adm-m2-s9"><b>09</b><span>Agências</span></a>
  <a href="#adm-m2-s10"><b>10</b><span>Conselhos e OAB</span></a>
  <a href="#adm-m2-revisao"><b>R</b><span>Revisão 5–10 min</span></a>
 </nav>

 <section class="adm-m2-orientacao">
  <h3>Como estudar este módulo</h3>
  <p>Organização Administrativa fica fácil quando você responde sempre às mesmas quatro perguntas: <b>quem tem personalidade jurídica?</b> <b>houve criação de uma nova pessoa?</b> <b>existe hierarquia?</b> <b>qual é o regime jurídico predominante?</b> A FCC costuma trocar uma dessas respostas e manter o restante da frase correto.</p>
  <div class="adm-m2-flow"><span>pessoa</span><i>→</i><span>estrutura</span><i>→</i><span>vínculo</span><i>→</i><span>regime</span><i>→</i><span>controle</span><i>→</i><span>pegadinha</span></div>
  <div class="adm-m2-callout exam"><b>Regra de ouro:</b> órgão é centro de competências <b>sem personalidade jurídica própria</b>; entidade é pessoa jurídica. Administração Indireta é composta por entidades; ministérios, secretarias, tribunais e delegacias são órgãos das respectivas pessoas políticas.</div>
 </section>

`;
function theoryHtml(){var c=window.__admM2ContentV66143||{};return PRELUDE+(c.p1||'')+(c.p2||'')+(c.p3||'')+(c.p4||'');}
function install(){
 if(window.__admM2TheoryInstalledV66143)return true;
 if(typeof window.renderDetail!=='function')return false;
 var base=window.renderDetail;
 window.renderDetail=function(s,t,r){
  var html=base.apply(this,arguments);
  if(!t||t.uid!==UID||!s||s.id!=='adm')return html;
  if(String(html).indexOf('adm-m2-book')>=0)return html;
  if(String(html).indexOf(MARKER)>=0)return String(html).replace(MARKER,theoryHtml()+MARKER);
  return theoryHtml()+String(html);
 };
 window.__admM2TheoryInstalledV66143=true;
 try{if(typeof window.renderAll==='function')window.renderAll()}catch(error){console.warn('[ADM M2] renderização após instalação',error)}
 return true;
}
function schedule(){if(install())return;var tries=0,timer=setInterval(function(){tries+=1;if(install()||tries>80)clearInterval(timer)},50);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
var style=document.createElement('style');
style.id='adm-m2-theory-style-v66143';
style.textContent=`
.adm-m2-book{--adm-ink:var(--text,#e9eef6);--adm-muted:var(--muted,#91a3b9);--adm-rule:var(--line,#26364f);--adm-panel:var(--panel,#0d1727);--adm-panel2:var(--panel2,#111d2f);--adm-accent:#8fa6c7;--adm-warm:#d7b67b;margin:18px 0 8px;border-top:1px solid var(--adm-rule);color:var(--adm-ink);font-size:14px;line-height:1.72}
.adm-m2-book *{box-sizing:border-box}.adm-m2-book p{margin:9px 0}.adm-m2-book b{font-weight:800}.adm-m2-cover{padding:28px 0 24px;border-bottom:1px solid var(--adm-rule)}
.adm-m2-kicker{display:flex;justify-content:space-between;gap:12px;color:var(--adm-muted);font-size:9px;font-weight:850;letter-spacing:.12em}.adm-m2-type{margin:20px 0 5px!important;color:var(--adm-warm);font-size:10px;font-weight:850;letter-spacing:.1em;text-transform:uppercase}.adm-m2-cover h2{max-width:820px;margin:0;font:650 clamp(25px,4vw,38px)/1.08 Georgia,"Times New Roman",serif;letter-spacing:-.025em;color:var(--adm-ink)}.adm-m2-sub{max-width:800px;margin:12px 0 0!important;color:var(--adm-muted);font:italic 14px/1.55 Georgia,"Times New Roman",serif}.adm-m2-source-note{margin-top:18px;padding-top:13px;border-top:1px solid var(--adm-rule);color:var(--adm-muted);font-size:10px}
.adm-m2-toc{position:sticky;top:8px;z-index:4;margin:14px 0 24px;padding:6px;display:flex;gap:4px;overflow:auto;border:1px solid var(--adm-rule);border-radius:10px;background:color-mix(in srgb,var(--adm-panel) 94%,transparent);backdrop-filter:blur(10px)}.adm-m2-toc a{display:flex;gap:7px;align-items:center;min-width:max-content;padding:8px 9px;border-radius:7px;color:var(--adm-muted)!important;text-decoration:none!important;font-size:10px;font-weight:700}.adm-m2-toc a:hover{background:var(--adm-panel2);color:var(--adm-ink)!important}.adm-m2-toc b{color:var(--adm-warm)}
.adm-m2-orientacao{margin:0 0 30px;padding:18px 0 20px;border-bottom:1px solid var(--adm-rule)}.adm-m2-orientacao h3,.adm-m2-decorar h3,.adm-m2-articles h3,.adm-m2-review h3,.adm-m2-questions h3{margin:0 0 10px;font:650 22px/1.2 Georgia,"Times New Roman",serif}.adm-m2-flow{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:13px}.adm-m2-flow span{padding:5px 8px;border:1px solid var(--adm-rule);border-radius:999px;font-size:9px;font-weight:800;color:var(--adm-muted)}.adm-m2-flow i{color:var(--adm-muted);font-style:normal}
.adm-m2-session{scroll-margin-top:70px;padding:30px 0;border-bottom:1px solid var(--adm-rule)}.adm-m2-session-head{margin-bottom:20px}.adm-m2-session-head small,.adm-m2-review>small{display:block;margin-bottom:7px;color:var(--adm-warm);font-size:9px;font-weight:900;letter-spacing:.14em}.adm-m2-session-head h3{max-width:850px;margin:0;font:650 clamp(22px,3vw,29px)/1.17 Georgia,"Times New Roman",serif;letter-spacing:-.015em}.adm-m2-session h4{margin:22px 0 8px;padding-top:2px;color:var(--adm-accent);font-size:11px;font-weight:900;letter-spacing:.06em;text-transform:uppercase}.adm-m2-session ul,.adm-m2-session ol{margin:8px 0;padding-left:20px}.adm-m2-session li{margin:7px 0}.adm-m2-check{list-style:none;padding-left:0!important;color:var(--adm-muted)}
.adm-m2-callout{margin:16px 0;padding:13px 15px;border-left:3px solid var(--adm-accent);background:color-mix(in srgb,var(--adm-panel2) 80%,transparent);border-radius:0 8px 8px 0}.adm-m2-callout.exam{border-left-color:var(--adm-warm)}.adm-m2-equation{display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;margin:18px 0;padding:16px;border-top:1px solid var(--adm-rule);border-bottom:1px solid var(--adm-rule);font-weight:800}.adm-m2-equation span{font-family:Georgia,"Times New Roman",serif;font-size:15px}.adm-m2-equation b{color:var(--adm-warm)}
.adm-m2-table-wrap{margin:15px 0;overflow:auto;border:1px solid var(--adm-rule);border-radius:9px}.adm-m2-table-wrap table{width:100%;border-collapse:collapse;min-width:590px;background:transparent}.adm-m2-table-wrap.wide table{min-width:900px}.adm-m2-table-wrap th{padding:10px 12px;text-align:left;background:var(--adm-panel2);color:var(--adm-ink);font-size:10px;letter-spacing:.04em}.adm-m2-table-wrap td{padding:11px 12px;vertical-align:top;border-top:1px solid var(--adm-rule);color:var(--adm-muted);font-size:12px;line-height:1.55}.adm-m2-table-wrap td+td,.adm-m2-table-wrap th+th{border-left:1px solid var(--adm-rule)}
.adm-m2-grid4{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1px;margin:15px 0;background:var(--adm-rule);border:1px solid var(--adm-rule);border-radius:9px;overflow:hidden}.adm-m2-grid4>div{display:grid;gap:4px;padding:13px;background:var(--adm-panel)}.adm-m2-grid4 b{font-size:11px}.adm-m2-grid4 span{color:var(--adm-muted);font-size:11px;line-height:1.5}
.adm-m2-decorar,.adm-m2-articles,.adm-m2-review,.adm-m2-questions{scroll-margin-top:70px;padding:30px 0;border-bottom:1px solid var(--adm-rule)}.adm-m2-memory{display:grid;gap:0;border-top:1px solid var(--adm-rule)}.adm-m2-memory p{margin:0!important;padding:10px 0;border-bottom:1px solid var(--adm-rule)}.adm-m2-lawlinks{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:15px}.adm-m2-lawlinks a{display:grid;gap:4px;padding:12px;border:1px solid var(--adm-rule);border-radius:8px;color:var(--adm-ink)!important;text-decoration:none!important}.adm-m2-lawlinks a:hover{background:var(--adm-panel2)}.adm-m2-lawlinks b{font-size:11px}.adm-m2-lawlinks span{color:var(--adm-muted);font-size:10px;line-height:1.45}.adm-m2-review ol{margin:16px 0;padding-left:23px}.adm-m2-review li{margin:9px 0}.adm-m2-final-alert{margin-top:17px;padding:14px;border-top:1px solid var(--adm-rule);border-bottom:1px solid var(--adm-rule);color:var(--adm-muted)}.adm-m2-rapid{display:grid;gap:0;border-top:1px solid var(--adm-rule)}.adm-m2-rapid p{margin:0!important;padding:11px 0;border-bottom:1px solid var(--adm-rule)}.adm-m2-rapid span{display:block;margin-top:3px;color:var(--adm-muted);font-size:11px}
@media(max-width:700px){.adm-m2-book{font-size:13px;line-height:1.68}.adm-m2-cover{padding-top:22px}.adm-m2-kicker{font-size:8px}.adm-m2-toc{top:4px}.adm-m2-grid4,.adm-m2-lawlinks{grid-template-columns:1fr}.adm-m2-table-wrap table{min-width:540px}.adm-m2-table-wrap.wide table{min-width:850px}.adm-m2-session{padding:25px 0}.adm-m2-session-head h3{font-size:22px}}
@media(prefers-reduced-motion:reduce){.adm-m2-book *{scroll-behavior:auto!important}}
`;
document.head.appendChild(style);
})();
