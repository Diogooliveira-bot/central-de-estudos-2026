(function(){
'use strict';
if(window.__PORTUGUES_M1_V3__)return;window.__PORTUGUES_M1_V3__=true;

var STORAGE_KEY='central-v6:pt:m1:v3';
var OPEN_KEY='central-v6:pt:m1:v3:open:';
var ERROR_TYPES=['Teoria','Exceção esquecida','Confusão entre regras','Interpretação','Distração','Vocabulário','Conteúdo ainda não estudado'];
var ERROR_STATUS=['novo','recorrente','crítico','em recuperação','superado'];

var SESSIONS=[
 {id:'s1',title:'Fundamentos de fonologia',pages:'aprox. p. 3–8',anki:5,items:['acento tônico × acento gráfico','monossílabo tônico/átono','letra × fonema','dígrafo','encontro consonantal','QU/GU conforme realização sonora','dígrafos vocálicos'],priority:'Prioridade: letra/fonema, dígrafo e encontro consonantal.'},
 {id:'s2',title:'Encontros vocálicos',pages:'aprox. p. 9–20',anki:7,mini:{total:5,reference:'Referência de avanço: 4/5.'},items:['vogal × semivogal','ditongo crescente/decrescente','tritongo','hiato','classificação por número de sílabas','distinção pais × país','AM/EM/ENS finais em certos casos como ditongos nasais','falso hiato/glide em baixa prioridade']},
 {id:'s3',title:'Regras gerais de acentuação',pages:'aprox. p. 21–35',anki:10,mini:{total:5,reference:'Referência de avanço: 4/5.'},items:['classificação tônica','monossílabos tônicos: A/E/O + ÉU/ÉI/ÓI','oxítonas: A/E/O/EM/ENS + ÉU/ÉI/ÓI','paroxítonas: regra residual (exceto A/E/O/EM/ENS)','paroxítonas terminadas em ditongo oral','proparoxítonas: todas acentuadas','Novo Acordo: ideia/heroico sem acento; papéis/herói mantêm','hífen × hifens','proparoxítonas aparentes/eventuais em baixa prioridade; para prova, priorizar análise tradicional de paroxítona terminada em ditongo crescente']},
 {id:'s4',title:'Regra do hiato + FCC',pages:'',anki:7,mini:{total:7,reference:'6–7 segue normalmente; 5 segue com revisão; 3–4 revisão dirigida; 0–2 revisar S2 + S4.'},items:['I/U tônico em hiato, sozinho ou com S → acento','seguido de NH → sem acento','após ditongo decrescente em paroxítona → sem acento (feiura)','após ditongo decrescente em oxítona → acento (Piauí)','após ditongo crescente em paroxítona → acento (Guaíba/Guaíra)','OO/EEM sem acento: voo, veem etc.','II/UU em regra sem acento, ressalvada regra das proparoxítonas']},
 {id:'s5',title:'Acentos diferenciais',pages:'',anki:6,mini:{total:6,reference:'Miniavaliação: 6 questões.'},items:['pôde × pode','pôr × por','tem × têm','vem × vêm','mantém × mantêm','intervém × intervêm','formas antigas que perderam acento diferencial: pela/pelo/polo/pera','fôrma/dêmos como observações facultativas de baixa prioridade']},
 {id:'s6',title:'Hífen',pages:'aprox. p. 81–115',anki:9,mini:{total:8,reference:'Miniavaliação: 8 questões.'},priority:'Organizar por padrões de decisão, não por lista enorme.',items:['vogais diferentes → sem hífen','vogais iguais → hífen','consoantes diferentes → sem hífen','consoantes iguais → hífen','prefixo terminado em vogal + R/S → sem hífen e dobra RR/SS','antes de H → geralmente hífen','CO/RE → sem hífen','BEM → geralmente hífen','MAL + vogal/H → hífen','PRÉ/PRÓ/PÓS tônicos → hífen','recém/além/aquém/sem/ex/vice → hífen','circum/pan + vogal/M/N → hífen','sub/sob + casos específicos de R/B conforme material','compostos e exceções lexicalizadas: tratar por grupo e questões']},
 {id:'s7',title:'Emprego das letras',pages:'aprox. p. 116–137',anki:8,mini:{total:8,reference:'Miniavaliação: 8 questões.'},priority:'Princípio central: procurar palavra primitiva/família lexical sempre que possível.',items:['-ês/-esa × -ez/-eza','-isar × -izar','S/Z em diminutivos conforme palavra-base','-ceder → -cess-','-primir → -press-','-gredir → -gress-','-meter → -miss-/-mess-','verbos em -jar mantêm J','viagem × viajem','terminações -ágio/-égio/-ígio/-ógio/-úgio/-gem','mex-/enx- geralmente X','após ditongo, X é frequente','famílias com CH mantêm CH','grafias de atenção: exceção, ascensão, subsídio, empecilho, privilégio, enxergar, ojeriza']},
 {id:'s8',title:'Siglas, maiúsculas/minúsculas e regras complementares',pages:'aprox. p. 138–144',anki:5,mini:{total:5,reference:'Miniavaliação: 5 questões.'},items:['siglas e plural com s minúsculo','abreviações','maiúscula como marca de individualização/notoriedade','nomes próprios, instituições, logradouros, acontecimentos e títulos','pontos cardeais: grande região = maiúscula; direção/localização = minúscula','trema eliminado, salvo nomes próprios estrangeiros e derivados','argui/arguem sem trema e sem acento no U']},
 {id:'s9',title:'Expressões problemáticas',pages:'aprox. p. 145–165',anki:10,mini:{total:10,reference:'Miniavaliação: 10 questões.'},priority:'Prioridade alta primeiro; itens de prioridade média entram conforme incidência/erros.',items:['mal × mau','há × a','por que / por quê / porque / porquê','onde × aonde','a fim de × afim','cessão × sessão × seção','eminente × iminente','de encontro a × ao encontro de','senão × se não','traz × trás','acerca de / a cerca de / há cerca de','tampouco / tão pouco','demais / de mais','ao invés de / em vez de','a par / ao par','consertar/concertar, coser/cozer conforme questões']},
 {id:'s10',title:'Questões finais FCC / teste de saída do PDF',pages:'aprox. p. 166–176',anki:0,exit:true,priority:'As páginas finais são questões comentadas da FCC, não uma nova aula teórica.',items:['resolver primeiro sem ler os comentários','marcar resposta e justificativa curta','só depois abrir a solução do PDF','para cada erro, classificar subtópico + causa','não criar teoria nova automaticamente; voltar ao trecho correspondente da S1–S9','criar/ajustar Anki somente se o erro revelar regra esquecida ou recorrente','referência de saída: 80% ou mais, sem erro crítico repetido']}
];

var ROUNDS=[
 {id:'r1',title:'Rodada diagnóstica 1 — TEC PORT 04',planned:20,note:'Sem consulta. Objetivo: descobrir lacunas, não medir domínio final. Conteúdo ainda não estudado fica como “não estudado” e não entra no domínio válido.'},
 {id:'r2',title:'Rodada TEC 2 — Consolidação',planned:25,note:'Sem consulta. Compare com a Rodada 1 e registre tempo, erros que desapareceram, recorrências e subtópicos fortes/fracos.'},
 {id:'final',title:'Rodada TEC final — PORT 04',planned:30,note:'30 questões novas, sem consulta. Esta rodada alimenta o domínio final do M1.'}
];

function blank(){
 var sessions={},minis={};
 SESSIONS.forEach(function(s){sessions[s.id]={done:false};if(s.mini)minis[s.id]={done:false,correct:'',total:s.mini.total}});
 return {schemaVersion:3,sessions:sessions,minis:minis,rounds:{r1:{done:false,total:20,valid:'',correct:'',time:'',notes:''},r2:{done:false,total:25,valid:'',correct:'',time:'',notes:''},final:{done:false,total:30,valid:'',correct:'',time:'',notes:''}},s10Score:'',errors:[],errorReviewDone:false,errorNotebookReviewed:false,revisions:{r1:{date:'',done:false},r2:{date:'',done:false},r3:{date:'',done:false}},finalSubtopics:[],updatedAt:null};
}
function state(){
 var b=blank(),raw=null;try{raw=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null')}catch(_){raw=null}
 if(!raw||typeof raw!=='object')return b;
 b.sessions=Object.assign(b.sessions,raw.sessions||{});b.minis=Object.assign(b.minis,raw.minis||{});b.rounds=Object.assign(b.rounds,raw.rounds||{});b.revisions=Object.assign(b.revisions,raw.revisions||{});
 b.s10Score=raw.s10Score==null?'':raw.s10Score;b.errors=Array.isArray(raw.errors)?raw.errors:[];b.errorReviewDone=!!raw.errorReviewDone;b.errorNotebookReviewed=!!raw.errorNotebookReviewed;b.finalSubtopics=Array.isArray(raw.finalSubtopics)?raw.finalSubtopics:[];b.updatedAt=raw.updatedAt||null;return b;
}
function save(s){s.updatedAt=new Date().toISOString();localStorage.setItem(STORAGE_KEY,JSON.stringify(s));try{window.dispatchEvent(new Event('central-progress-changed'))}catch(_){};rerender()}
function num(v){var n=Number(v);return Number.isFinite(n)?n:0}
function pct(correct,valid){valid=num(valid);correct=num(correct);return valid>0?Math.round((correct/valid)*100):null}
function esc(v){return String(v==null?'':v).replace(/[&<>\"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]})}
function attr(v){return esc(v).replace(/`/g,'&#96;')}
function allMiniIds(){return SESSIONS.filter(function(x){return !!x.mini}).map(function(x){return x.id})}
function stats(){
 var s=state(),total=0,done=0;
 SESSIONS.forEach(function(x){total++;if(s.sessions[x.id]&&s.sessions[x.id].done)done++});
 allMiniIds().forEach(function(id){total++;if(s.minis[id]&&s.minis[id].done)done++});
 ROUNDS.forEach(function(r){total++;if(s.rounds[r.id]&&s.rounds[r.id].done)done++});
 total+=2;if(s.errorReviewDone)done++;if(s.errorNotebookReviewed)done++;
 total+=1;var revScheduled=['r1','r2','r3'].every(function(id){return !!(s.revisions[id]&&s.revisions[id].date)});if(revScheduled)done++;
 return {total:total,done:done,pct:total?Math.round(done/total*100):0,revisionsScheduled:revScheduled};
}
function finalDomain(){var s=state(),r=s.rounds.final,p=pct(r.correct,r.valid);return r.done&&p!==null?p:null}
function domainLabel(p){if(p===null)return 'Ainda não medido';if(p<60)return 'Fraco';if(p<70)return 'Em construção';if(p<80)return 'Funcional';if(p<90)return 'Dominado';return 'Domínio forte'}
function weakSubtopics(){return state().finalSubtopics.filter(function(x){var p=pct(x.correct,x.valid);return p!==null&&p<60})}
function criticalOpen(){return state().errors.filter(function(e){return e.status==='crítico'}).length}
function conclusion(){
 var s=state(),st=stats();
 var sessionsOk=SESSIONS.every(function(x){return !!(s.sessions[x.id]&&s.sessions[x.id].done)}),minisOk=allMiniIds().every(function(id){return !!(s.minis[id]&&s.minis[id].done)}),roundsOk=ROUNDS.every(function(r){return !!(s.rounds[r.id]&&s.rounds[r.id].done)});
 var concluded=sessionsOk&&minisOk&&roundsOk&&s.errorReviewDone&&s.errorNotebookReviewed&&st.revisionsScheduled;
 var d=finalDomain(),weak=weakSubtopics().length,critical=criticalOpen();
 if(!st.done)return {label:'Não iniciado',kind:'idle',concluded:false};
 if(!concluded)return {label:'Em andamento',kind:'progress',concluded:false};
 if(d!==null&&d>=80&&!weak&&!critical)return {label:'Dominado',kind:'strong',concluded:true};
 return {label:'Concluído — em revisão',kind:'review',concluded:true};
}
function tecUrl(){try{var d=window.TEC_CADERNOS_DATA&&window.TEC_CADERNOS_DATA.cadernos;var x=Array.isArray(d)&&d.find(function(c){return c.id==='port-04'});return x&&x.url?x.url:''}catch(_){return ''}}
function openState(id){return localStorage.getItem(OPEN_KEY+id)==='1'}
function toggleOpen(id){localStorage.setItem(OPEN_KEY+id,openState(id)?'0':'1');rerender(false)}

function style(){
 if(document.getElementById('pt-m1-v3-style'))return;
 var e=document.createElement('style');e.id='pt-m1-v3-style';e.textContent=`
 .ptm1{display:grid;gap:12px}.ptm1-top{display:grid;grid-template-columns:minmax(0,1fr) 160px 160px;gap:10px}.ptm1-card,.ptm1-section{border:1px solid var(--line);background:var(--panel);border-radius:12px}.ptm1-card{padding:14px}.ptm1-kicker{font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);font-weight:850}.ptm1-title{font-size:18px;margin:4px 0 5px}.ptm1-card p{margin:0;color:var(--muted);font-size:11px;line-height:1.5}.ptm1-metric b{display:block;font-size:24px;margin-top:5px}.ptm1-metric small{color:var(--muted);font-size:10px}.ptm1-status{font-weight:850;font-size:13px;margin-top:8px}.ptm1-status.strong{color:var(--green)}.ptm1-status.review{color:var(--yellow)}.ptm1-status.progress{color:var(--blue)}.ptm1-status.idle{color:var(--muted)}
 .ptm1-progress{height:6px;background:var(--panel2);border-radius:99px;overflow:hidden;margin-top:10px}.ptm1-progress span{display:block;height:100%;background:var(--purple);transition:width .2s ease}.ptm1-head{width:100%;border:0;background:transparent;color:var(--text);display:grid;grid-template-columns:38px minmax(0,1fr) auto 28px;gap:9px;align-items:center;padding:12px 14px;text-align:left}.ptm1-head:hover{background:var(--surface-hover)}.ptm1-n{width:28px;height:28px;border:1px solid var(--line2);border-radius:8px;display:grid;place-items:center;font-size:10px;font-weight:900}.ptm1-head b{display:block;font-size:12px}.ptm1-head small{display:block;color:var(--muted);font-size:10px;margin-top:2px}.ptm1-done{font-size:10px;color:var(--muted)}.ptm1-section.open .ptm1-head{border-bottom:1px solid var(--line)}.ptm1-body{display:none;padding:13px 14px}.ptm1-section.open .ptm1-body{display:block}.ptm1-list{margin:0;padding-left:19px;color:var(--text)}.ptm1-list li{margin:6px 0;font-size:11px;line-height:1.45}.ptm1-note{margin:10px 0;padding:9px 10px;border-left:3px solid var(--purple);background:var(--panel2);border-radius:6px;color:var(--muted);font-size:10px;line-height:1.5}.ptm1-actions{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:10px}.ptm1-check{display:flex;align-items:center;gap:7px;font-size:11px;font-weight:750}.ptm1-check input{width:17px;height:17px;accent-color:var(--green)}.ptm1-mini{display:grid;grid-template-columns:auto 86px auto;gap:8px;align-items:end;margin-top:11px;padding-top:10px;border-top:1px solid var(--line)}.ptm1-mini input,.ptm1-input,.ptm1-select,.ptm1-textarea{border:1px solid var(--line2);background:var(--bg);color:var(--text);border-radius:7px;padding:7px 8px;font:inherit}.ptm1-mini input{width:78px}.ptm1-textarea{width:100%;min-height:64px;resize:vertical}.ptm1-grid{display:grid;grid-template-columns:repeat(4,minmax(90px,1fr));gap:8px}.ptm1-field{display:grid;gap:4px}.ptm1-field label{font-size:9px;color:var(--muted)}.ptm1-round-result{margin-top:10px;font-size:11px}.ptm1-badge{display:inline-block;border:1px solid var(--line2);border-radius:999px;padding:4px 7px;font-size:9px;color:var(--muted)}
 .ptm1-errors{display:grid;gap:7px;margin-top:10px}.ptm1-error{border:1px solid var(--line);border-radius:9px;padding:10px;background:var(--panel2);display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px}.ptm1-error b{font-size:11px}.ptm1-error small{display:block;color:var(--muted);font-size:9px;margin-top:3px;line-height:1.4}.ptm1-error-actions{display:flex;gap:5px;align-items:center}.ptm1-btn{border:1px solid var(--line2);background:var(--panel2);color:var(--text);border-radius:7px;padding:7px 9px;font-size:10px;font-weight:750}.ptm1-btn.primary{background:var(--purple);border-color:var(--purple);color:#fff}.ptm1-btn.danger{color:#ffb4b4}.ptm1-form{display:grid;grid-template-columns:1.2fr 1.2fr 1fr 1fr;gap:8px}.ptm1-form .wide{grid-column:1/-1}.ptm1-revs{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.ptm1-rev{border:1px solid var(--line);border-radius:9px;padding:10px;background:var(--panel2)}.ptm1-rev b{font-size:11px}.ptm1-rev small{display:block;color:var(--muted);font-size:9px;margin:3px 0 8px}.ptm1-subrow{display:grid;grid-template-columns:minmax(0,1fr) 80px 80px 70px auto;gap:7px;align-items:center;padding:7px 0;border-bottom:1px solid var(--line)}.ptm1-subrow:last-child{border-bottom:0}.ptm1-source{display:flex;gap:7px;flex-wrap:wrap;margin-top:10px}.ptm1-source span,.ptm1-source a{font-size:9px;border:1px solid var(--line2);border-radius:6px;padding:5px 7px;color:var(--muted);text-decoration:none}.ptm1-warning{font-size:10px;color:var(--muted);padding:9px 10px;border:1px dashed var(--line2);border-radius:8px}
 @media(max-width:850px){.ptm1-top{grid-template-columns:1fr 1fr}.ptm1-top .ptm1-card:first-child{grid-column:1/-1}.ptm1-grid{grid-template-columns:1fr 1fr}.ptm1-form{grid-template-columns:1fr 1fr}.ptm1-revs{grid-template-columns:1fr}.ptm1-subrow{grid-template-columns:1fr 70px 70px}.ptm1-subrow>*:nth-child(4),.ptm1-subrow>*:nth-child(5){grid-column:auto}.ptm1-mini{grid-template-columns:1fr 90px}}
 @media(max-width:560px){.ptm1-top,.ptm1-grid,.ptm1-form{grid-template-columns:1fr}.ptm1-top .ptm1-card:first-child{grid-column:auto}.ptm1-head{grid-template-columns:34px minmax(0,1fr) 24px}.ptm1-done{display:none}.ptm1-subrow{grid-template-columns:1fr 1fr}.ptm1-subrow>*:first-child{grid-column:1/-1}}
 `;document.head.appendChild(e);
}

function sessionHtml(x){
 var s=state(),done=!!(s.sessions[x.id]&&s.sessions[x.id].done),open=openState(x.id),mini=x.mini?s.minis[x.id]:null;
 return `<section class="ptm1-section ${open?'open':''}" data-ptm1="${x.id}"><button class="ptm1-head" type="button" onclick="PtM1V3.toggleOpen('${x.id}')"><span class="ptm1-n">${x.id.toUpperCase()}</span><span><b>${esc(x.title)}</b><small>${esc(x.pages||'PDF 1')} · Anki-base: ${x.anki||'seletivo'}</small></span><span class="ptm1-done">${done?'Concluída':'Não estudada'}</span><span>⌄</span></button><div class="ptm1-body">
 ${x.priority?`<div class="ptm1-note">${esc(x.priority)}</div>`:''}<ul class="ptm1-list">${x.items.map(function(i){return `<li>${esc(i)}</li>`}).join('')}</ul>
 ${x.exit?`<div class="ptm1-mini"><label class="ptm1-check"><input type="checkbox" ${done?'checked':''} onchange="PtM1V3.setSession('${x.id}',this.checked)"> Eu realmente concluí esta sessão</label><div class="ptm1-field"><label>% no teste de saída</label><input class="ptm1-input" type="number" min="0" max="100" value="${attr(s.s10Score)}" onchange="PtM1V3.setS10(this.value)"></div><span class="ptm1-badge">Referência: ≥80%</span></div>`:
 `<div class="ptm1-actions"><label class="ptm1-check"><input type="checkbox" ${done?'checked':''} onchange="PtM1V3.setSession('${x.id}',this.checked)"> Eu realmente concluí esta sessão</label></div>`}
 ${x.mini?`<div class="ptm1-mini"><label class="ptm1-check"><input type="checkbox" ${mini&&mini.done?'checked':''} onchange="PtM1V3.setMiniDone('${x.id}',this.checked)"> Miniavaliação feita</label><div class="ptm1-field"><label>Acertos / ${x.mini.total}</label><input type="number" min="0" max="${x.mini.total}" value="${attr(mini&&mini.correct)}" onchange="PtM1V3.setMiniScore('${x.id}',this.value)"></div><span class="ptm1-badge">${esc(x.mini.reference)}</span></div>`:''}
 </div></section>`;
}

function roundHtml(r){
 var s=state(),x=s.rounds[r.id]||{},open=openState('round-'+r.id),p=pct(x.correct,x.valid),label=p===null?'—':p+'% · '+domainLabel(p);
 var evolution='';if(r.id==='r2'){var p1=pct(s.rounds.r1.correct,s.rounds.r1.valid);if(p!==null&&p1!==null){var d=p-p1;evolution=`<span class="ptm1-badge">R1→R2: ${d>0?'+':''}${d} p.p. · ${d>=5?'evoluindo':d<=-5?'regressão':'estável'}</span>`}}
 return `<section class="ptm1-section ${open?'open':''}"><button class="ptm1-head" type="button" onclick="PtM1V3.toggleOpen('round-${r.id}')"><span class="ptm1-n">TEC</span><span><b>${esc(r.title)}</b><small>${r.planned} questões planejadas</small></span><span class="ptm1-done">${x.done?'Realizada':'Pendente'}</span><span>⌄</span></button><div class="ptm1-body"><div class="ptm1-note">${esc(r.note)}</div><div class="ptm1-grid">
 <div class="ptm1-field"><label>Questões feitas</label><input class="ptm1-input" type="number" min="0" value="${attr(x.total)}" onchange="PtM1V3.setRound('${r.id}','total',this.value)"></div>
 <div class="ptm1-field"><label>Conteúdo válido</label><input class="ptm1-input" type="number" min="0" value="${attr(x.valid)}" onchange="PtM1V3.setRound('${r.id}','valid',this.value)"></div>
 <div class="ptm1-field"><label>Acertos válidos</label><input class="ptm1-input" type="number" min="0" value="${attr(x.correct)}" onchange="PtM1V3.setRound('${r.id}','correct',this.value)"></div>
 <div class="ptm1-field"><label>Tempo total</label><input class="ptm1-input" type="text" placeholder="ex.: 28 min" value="${attr(x.time)}" onchange="PtM1V3.setRound('${r.id}','time',this.value)"></div></div>
 <div class="ptm1-field" style="margin-top:8px"><label>Observações / subtópicos fortes e fracos</label><textarea class="ptm1-textarea" onchange="PtM1V3.setRound('${r.id}','notes',this.value)">${esc(x.notes||'')}</textarea></div>
 <div class="ptm1-actions"><label class="ptm1-check"><input type="checkbox" ${x.done?'checked':''} onchange="PtM1V3.setRound('${r.id}','done',this.checked)"> Eu realmente realizei esta rodada</label><span class="ptm1-badge">Aproveitamento válido: ${label}</span>${evolution}</div>
 ${r.id==='final'?finalSubtopicsHtml():''}</div></section>`;
}
function finalSubtopicsHtml(){
 var rows=state().finalSubtopics;return `<div style="margin-top:13px;padding-top:11px;border-top:1px solid var(--line)"><b style="font-size:11px">Desempenho final por subtópico</b><div class="muted small" style="margin-top:3px">Qualquer subtópico abaixo de 60% permanece em revisão, mesmo com média geral alta.</div><div style="margin-top:8px">${rows.length?rows.map(function(x,i){var p=pct(x.correct,x.valid);return `<div class="ptm1-subrow"><input class="ptm1-input" value="${attr(x.name)}" onchange="PtM1V3.setSub(${i},'name',this.value)"><input class="ptm1-input" type="number" min="0" placeholder="Válidas" value="${attr(x.valid)}" onchange="PtM1V3.setSub(${i},'valid',this.value)"><input class="ptm1-input" type="number" min="0" placeholder="Acertos" value="${attr(x.correct)}" onchange="PtM1V3.setSub(${i},'correct',this.value)"><span class="ptm1-badge">${p===null?'—':p+'%'}</span><button class="ptm1-btn danger" onclick="PtM1V3.delSub(${i})">×</button></div>`}).join(''):'<div class="ptm1-warning">Nenhum subtópico registrado ainda.</div>'}</div><div class="ptm1-actions"><button class="ptm1-btn" onclick="PtM1V3.addSub()">+ Adicionar subtópico</button></div></div>`;
}

function errorsHtml(){
 var s=state(),open=openState('errors');
 var rows=s.errors.map(function(e,i){return `<div class="ptm1-error"><div><b>${esc(e.subtopic||'Subtópico não informado')} · ${esc(e.status)}</b><small>${esc(e.origin||'Origem não informada')} · ${esc(e.type||'Tipo não informado')} · ${e.occurrences||1} ocorrência(s)</small><small>${e.rule?'<b>Regra:</b> '+esc(e.rule):''}</small></div><div class="ptm1-error-actions"><button class="ptm1-btn" onclick="PtM1V3.bumpError(${i})">+1</button>${e.status!=='superado'?`<button class="ptm1-btn" onclick="PtM1V3.superate(${i})">Superado</button>`:''}<button class="ptm1-btn danger" onclick="PtM1V3.delError(${i})">×</button></div></div>`}).join('');
 return `<section class="ptm1-section ${open?'open':''}"><button class="ptm1-head" type="button" onclick="PtM1V3.toggleOpen('errors')"><span class="ptm1-n">ER</span><span><b>Caderno de erros</b><small>causa · regra correta · recorrência · status</small></span><span class="ptm1-done">${s.errors.length} registro(s)</span><span>⌄</span></button><div class="ptm1-body"><div class="ptm1-form">
 <div class="ptm1-field"><label>Origem</label><select id="ptm1-e-origin" class="ptm1-select"><option>TEC R1</option><option>TEC R2</option><option>TEC Final</option><option>S10 — FCC</option><option>Miniavaliação</option></select></div>
 <div class="ptm1-field"><label>Subtópico</label><input id="ptm1-e-sub" class="ptm1-input" placeholder="ex.: regra do hiato"></div>
 <div class="ptm1-field"><label>Resposta marcada</label><input id="ptm1-e-marked" class="ptm1-input" placeholder="ex.: B"></div>
 <div class="ptm1-field"><label>Tipo do erro</label><select id="ptm1-e-type" class="ptm1-select">${ERROR_TYPES.map(function(x){return `<option>${esc(x)}</option>`}).join('')}</select></div>
 <div class="ptm1-field wide"><label>Regra correta / motivo</label><textarea id="ptm1-e-rule" class="ptm1-textarea" placeholder="Registre a regra correta de forma curta."></textarea></div></div>
 <div class="ptm1-actions"><button class="ptm1-btn primary" onclick="PtM1V3.addError()">Adicionar erro</button><label class="ptm1-check"><input type="checkbox" ${s.errorReviewDone?'checked':''} onchange="PtM1V3.setFlag('errorReviewDone',this.checked)"> Corrigi/revisei os erros deste módulo</label><label class="ptm1-check"><input type="checkbox" ${s.errorNotebookReviewed?'checked':''} onchange="PtM1V3.setFlag('errorNotebookReviewed',this.checked)"> Caderno conferido</label></div><div class="ptm1-errors">${rows||'<div class="ptm1-warning">Nenhum erro registrado. O caderno começa vazio e só recebe erros reais.</div>'}</div></div></section>`;
}

function revisionsHtml(){
 var s=state(),open=openState('revisions'),defs=[['r1','R1 — 24 horas','5–10 min, pontos marcados + Anki.'],['r2','R2 — 7 dias','Anki + caderno de erros + ~10 questões.'],['r3','R3 — 30 dias','15–20 questões novas, sem reler toda a teoria.']];
 return `<section class="ptm1-section ${open?'open':''}"><button class="ptm1-head" type="button" onclick="PtM1V3.toggleOpen('revisions')"><span class="ptm1-n">REV</span><span><b>Revisões</b><small>24h · 7d · 30d, sempre cirúrgicas</small></span><span class="ptm1-done">${stats().revisionsScheduled?'Agendadas':'Sem agenda completa'}</span><span>⌄</span></button><div class="ptm1-body"><div class="ptm1-revs">${defs.map(function(d){var x=s.revisions[d[0]]||{};return `<div class="ptm1-rev"><b>${esc(d[1])}</b><small>${esc(d[2])}</small><div class="ptm1-field"><label>Data agendada</label><input class="ptm1-input" type="date" value="${attr(x.date)}" onchange="PtM1V3.setRevision('${d[0]}','date',this.value)"></div><label class="ptm1-check" style="margin-top:8px"><input type="checkbox" ${x.done?'checked':''} onchange="PtM1V3.setRevision('${d[0]}','done',this.checked)"> Realizada</label></div>`}).join('')}</div></div></section>`;
}

function ankiHtml(){var open=openState('anki');return `<section class="ptm1-section ${open?'open':''}"><button class="ptm1-head" type="button" onclick="PtM1V3.toggleOpen('anki')"><span class="ptm1-n">A</span><span><b>Anki seletivo</b><small>aprox. 67 cartões-base planejados em S1–S9</small></span><span class="ptm1-done">Não conta como estudado automaticamente</span><span>⌄</span></button><div class="ptm1-body"><div class="ptm1-note">67 é teto provisório, não obrigação. Antes de criar cartão novo após questões, verifique se a regra já possui cartão; novos cartões devem nascer principalmente de erros reais.</div><button class="ptm1-btn" onclick="if(typeof openAnki==='function')openAnki();else if(typeof openInternal==='function')openInternal('/tools/anki.html','Anki')">Abrir Anki</button></div></section>`}

function render(){
 style();var st=stats(),d=finalDomain(),c=conclusion(),u=tecUrl();
 return `<div class="ptm1"><div class="ptm1-top"><div class="ptm1-card"><div class="ptm1-kicker">Português · Módulo 1</div><div class="ptm1-title">Ortografia e Acentuação</div><p>PDF 1 é a fonte teórica oficial. TEC PORT 04 é a base prática. Estrutura pronta não significa estudo realizado.</p><div class="ptm1-source"><span>Fonte: PDF 1 — 176 páginas</span><span>TEC: PORT 04</span>${u?`<a href="${attr(u)}" target="_blank" rel="noopener">Abrir caderno TEC cadastrado ↗</a>`:''}</div></div><div class="ptm1-card ptm1-metric"><div class="ptm1-kicker">Progresso</div><b>${st.pct}%</b><small>${st.done}/${st.total} marcos efetivamente concluídos</small><div class="ptm1-progress"><span style="width:${st.pct}%"></span></div></div><div class="ptm1-card ptm1-metric"><div class="ptm1-kicker">Domínio</div><b>${d===null?'—':d+'%'}</b><small>${esc(domainLabel(d))}</small><div class="ptm1-status ${c.kind}">${esc(c.label)}</div></div></div>
 <div class="ptm1-warning">Checks começam vazios. Marque apenas depois de realmente executar a etapa. Questões de conteúdo ainda não estudado devem ser classificadas como “Conteúdo ainda não estudado” e não entram no aproveitamento válido.</div>
 ${SESSIONS.slice(0,3).map(sessionHtml).join('')}${roundHtml(ROUNDS[0])}${SESSIONS.slice(3,6).map(sessionHtml).join('')}${roundHtml(ROUNDS[1])}${SESSIONS.slice(6).map(sessionHtml).join('')}${roundHtml(ROUNDS[2])}${errorsHtml()}${ankiHtml()}${revisionsHtml()}
 </div>`;
}

function getVal(id){var e=document.getElementById(id);return e?e.value:''}
var api={
 toggleOpen:toggleOpen,
 setSession:function(id,v){var s=state();s.sessions[id]=Object.assign({},s.sessions[id]||{}, {done:!!v});save(s)},
 setMiniDone:function(id,v){var s=state();s.minis[id]=Object.assign({},s.minis[id]||{}, {done:!!v});save(s)},
 setMiniScore:function(id,v){var s=state();s.minis[id]=Object.assign({},s.minis[id]||{}, {correct:v});save(s)},
 setS10:function(v){var s=state();s.s10Score=v;save(s)},
 setRound:function(id,k,v){var s=state();s.rounds[id]=Object.assign({},s.rounds[id]||{});s.rounds[id][k]=k==='done'?!!v:v;save(s)},
 setFlag:function(k,v){var s=state();s[k]=!!v;save(s)},
 setRevision:function(id,k,v){var s=state();s.revisions[id]=Object.assign({},s.revisions[id]||{});s.revisions[id][k]=k==='done'?!!v:v;save(s)},
 addError:function(){var sub=getVal('ptm1-e-sub').trim(),rule=getVal('ptm1-e-rule').trim();if(!sub&&!rule){alert('Informe pelo menos o subtópico ou a regra correta.');return}var s=state();s.errors.push({id:'e'+Date.now().toString(36),origin:getVal('ptm1-e-origin'),subtopic:sub,marked:getVal('ptm1-e-marked'),type:getVal('ptm1-e-type'),rule:rule,occurrences:1,status:'novo',createdAt:new Date().toISOString()});save(s)},
 bumpError:function(i){var s=state(),e=s.errors[i];if(!e)return;e.occurrences=(Number(e.occurrences)||1)+1;if(e.occurrences>=3)e.status='crítico';else if(e.occurrences===2)e.status='recorrente';save(s)},
 superate:function(i){var s=state(),e=s.errors[i];if(!e)return;e.status='superado';save(s)},
 delError:function(i){if(!confirm('Excluir este registro do caderno de erros?'))return;var s=state();s.errors.splice(i,1);save(s)},
 addSub:function(){var s=state();s.finalSubtopics.push({name:'',valid:'',correct:''});save(s)},
 setSub:function(i,k,v){var s=state();if(!s.finalSubtopics[i])return;s.finalSubtopics[i][k]=v;save(s)},
 delSub:function(i){var s=state();s.finalSubtopics.splice(i,1);save(s)},
 state:state,stats:stats,conclusion:conclusion,render:render
};
window.PtM1V3=api;

var oldSubjStats=window.subjStats;
if(!window.__PT_CANONICAL_HOST__&&typeof oldSubjStats==='function')window.subjStats=function(s){if(s&&s.id==='pt'){var x=stats();return {total:x.total,done:x.done,pct:x.pct,unit:'marcos'}}return oldSubjStats.apply(this,arguments)};
if(!window.__PT_CANONICAL_HOST__)window.renderPortugueseMaster=function(){return render()};

var oldGrid=window.renderDisciplineGrid;
if(typeof oldGrid==='function')window.renderDisciplineGrid=function(){var r=oldGrid.apply(this,arguments);setTimeout(patchLabels,0);return r};
function patchLabels(){
 if(window.__PT_CANONICAL_HOST__)return;
 try{var card=document.querySelector('.disc-card[data-id="pt"]');if(card){var small=card.querySelector('small');if(small)small.textContent='M1 • Ortografia e Acentuação • fluxo validado';var meta=card.querySelector('.disc-meta'),st=stats();if(meta)meta.textContent=st.done+'/'+st.total+' marcos · '+st.pct+'%'}}catch(_){ }
 try{var s=document.querySelector('.subject[data-id="pt"]');if(s){var count=s.querySelector('.subject-count'),p=s.querySelector('.subject-pct'),st2=stats();if(count)count.textContent=st2.done+'/'+st2.total+' marcos';if(p)p.textContent=st2.pct+'%'}}catch(_){ }
}
function rerender(full){try{if(window.__PT_CANONICAL_HOST__&&typeof window.ptCanonicalRefreshModule==='function'){window.ptCanonicalRefreshModule('m1');return}if(full!==false&&typeof window.renderAll==='function')window.renderAll();else if(typeof window.renderSubjects==='function')window.renderSubjects();patchLabels()}catch(e){console.warn('[PT M1 V3] render',e)}}

window.addEventListener('central-cloud-applied',function(){setTimeout(function(){rerender()},50)});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(function(){rerender()},60)},{once:true});else setTimeout(function(){rerender()},60);
})();
