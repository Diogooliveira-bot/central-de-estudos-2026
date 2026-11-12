(function(g){
'use strict';
const K='central-v6:cpc-study-v1',ID='cpc19',SID='w19';
const QUIZ_KEY='central-v6:cpc-m19-fixacao-v1';
let quiz=null;

const QUESTIONS={
 summary:[
  {d:'Fácil',q:'Qual alternativa descreve corretamente os direitos difusos?',o:['Direitos divisíveis de titulares determinados, ligados por contrato.','Direitos indivisíveis de titulares indeterminados, ligados por circunstâncias de fato.','Direitos indivisíveis de grupo determinado, ligados por relação jurídica-base.','Direitos individuais que jamais admitem tutela coletiva.'],a:1,e:'Direitos difusos são indivisíveis, têm titulares indeterminados e vínculo decorrente de circunstâncias de fato.'},
  {d:'Fácil',q:'Quem possui legitimidade ativa para propor ação popular?',o:['Qualquer associação civil.','Somente o Ministério Público.','O cidadão.','Qualquer pessoa jurídica lesada.'],a:2,e:'A ação popular é remédio constitucional atribuído ao cidadão. A Súmula 365/STF afasta a legitimidade da pessoa jurídica.'},
  {d:'Média',q:'No mandado de segurança repressivo, qual combinação está correta?',o:['Prova pré-constituída e prazo decadencial de 120 dias.','Dilação probatória ampla e prazo prescricional de 5 anos.','Prova exclusivamente testemunhal e prazo de 30 dias.','Prova pré-constituída e ausência de prazo decadencial.'],a:0,e:'O MS exige prova pré-constituída e, no repressivo, o prazo é decadencial de 120 dias contados da ciência do ato.'},
  {d:'Média',q:'Sobre o habeas data, assinale a correta.',o:['Serve para obter qualquer informação pública, ainda que não diga respeito ao impetrante.','Dispensa resistência administrativa prévia.','Protege dados relativos ao próprio impetrante e exige resistência administrativa nas hipóteses legais.','Não pode ser usado para retificação de dados.'],a:2,e:'O habeas data protege dados pessoais do impetrante; a Súmula 2/STJ exige recusa administrativa para o acesso.'},
  {d:'Difícil',q:'Qual sequência resume corretamente os principais quóruns de ADI/ADC e modulação?',o:['6 presentes, 8 votos, 3/5 para modular.','8 presentes, 6 votos para proclamar o resultado e 2/3 para modular.','Maioria simples para tudo.','11 presentes, 6 votos e maioria absoluta para modular.'],a:1,e:'Mnemônico do módulo: 8 presentes, 6 votos para proclamar constitucionalidade/inconstitucionalidade e 2/3 para modulação.'}
 ],
 complete:[
  {d:'Fácil',q:'Qual é o prazo prescricional indicado no módulo para a ação popular?',o:['120 dias.','1 ano.','2 anos.','5 anos.'],a:3,e:'A Lei 4.717/1965 estabelece prazo prescricional de 5 anos.'},
  {d:'Fácil',q:'O inquérito civil é condição de procedibilidade da ação civil pública?',o:['Sim, sempre.','Não. É instrumento do Ministério Público, mas não condição geral da ACP.','Somente nas ações ambientais.','Somente quando a associação é autora.'],a:1,e:'O inquérito civil pode anteceder a ACP, mas não é requisito geral para seu ajuizamento.'},
  {d:'Fácil',q:'O mandado de injunção exige omissão normativa absolutamente total?',o:['Sim.','Não. A Lei 13.300/2016 admite omissão total ou parcial.','Somente se houver decreto pendente.','Somente em matéria eleitoral.'],a:1,e:'Regulamentação insuficiente pode caracterizar omissão parcial apta a justificar MI.'},
  {d:'Fácil',q:'No controle concentrado federal perante o STF, a ADC pode ter como objeto:',o:['Lei ou ato normativo federal.','Lei estadual ou municipal.','Somente lei municipal.','Norma pré-constitucional de qualquer ente.'],a:0,e:'A ADC federal tem por objeto lei ou ato normativo federal.'},
  {d:'Média',q:'O Tema 1.075/STF, conforme o módulo, estabelece que:',o:['A coisa julgada da ACP fica sempre limitada ao território do órgão prolator.','É constitucional a limitação territorial do art. 16 da LACP.','É inconstitucional a limitação territorial do art. 16 da LACP.','Toda ACP nacional é de competência exclusiva do STF.'],a:2,e:'O STF afastou a limitação territorial do art. 16 da LACP e tratou da competência das ações de alcance nacional/regional.'},
  {d:'Média',q:'Na ADI 4.296/STF, quais dispositivos da Lei 12.016/2009 foram declarados inconstitucionais no recorte do módulo?',o:['Art. 23 e art. 25.','Art. 7º, §2º, e art. 22, §2º.','Art. 1º, §2º, e art. 23.','Somente o art. 25.'],a:1,e:'O módulo destaca a inconstitucionalidade do art. 7º, §2º, e do art. 22, §2º.'},
  {d:'Média',q:'Segundo o Tema 1.119/STF, na cobrança de valores pretéritos decorrentes de título formado em MS coletivo associativo:',o:['Exige-se autorização expressa de cada associado e lista nominal prévia.','Exige-se filiação anterior ao ajuizamento em todos os casos.','Dispensam-se autorização expressa, relação nominal e comprovação de filiação prévia.','Somente sindicato pode executar o título.'],a:2,e:'O Tema 1.119 afasta essas exigências para a cobrança do título de MS coletivo associativo.'},
  {d:'Média',q:'A Súmula Vinculante 10 busca impedir que:',o:['Juiz singular exerça controle incidental.','Órgão fracionário afaste lei por fundamento constitucional sem observar a reserva de plenário.','O STF module efeitos.','A Administração aplique decisão vinculante.'],a:1,e:'A SV 10 protege a cláusula de reserva de plenário do art. 97 da CF.'},
  {d:'Difícil',q:'Qual alternativa associa corretamente a coisa julgada coletiva à categoria do direito?',o:['Difusos: sempre inter partes; coletivos: sempre erga omnes nacional; individuais homogêneos: nunca coletivos.','Difusos: erga omnes, salvo insuficiência de prova; coletivos stricto sensu: ultra partes limitada ao grupo, salvo insuficiência de prova; individuais homogêneos: erga omnes na procedência para beneficiar vítimas/sucessores.','Todas as categorias seguem regra idêntica.','Individuais homogêneos formam coisa julgada erga omnes mesmo na improcedência contra vítimas ausentes.'],a:1,e:'A extensão da coisa julgada varia conforme a categoria do direito e o resultado, nos termos do CDC.'},
  {d:'Difícil',q:'Assinale a distinção correta entre ADI e ADPF no recorte do módulo.',o:['ADI federal alcança lei municipal diretamente; ADPF nunca alcança norma pré-CF.','ADI e ADPF têm exatamente o mesmo objeto e não há subsidiariedade.','ADI federal recai sobre lei/ato federal ou estadual; ADPF é subsidiária e pode alcançar ato municipal ou norma pré-constitucional, se presentes seus pressupostos.','ADPF só pode ser proposta por cidadão.'],a:2,e:'A ADPF tem objeto mais flexível, mas é subsidiária; a ADI federal não é via direta para lei municipal.'}
 ]
};

function J(k){try{return JSON.parse(localStorage.getItem(k)||'{}')}catch(_){return {}}}
function S(){return Object.assign({modules:{},external:{}},J(K))}
function M(){const s=S();return Object.assign({map:false,decorando:false},s.modules?.[SID]||{})}
function setM(p){const s=S();s.modules=s.modules||{};s.modules[SID]=Object.assign({},s.modules[SID]||{},p);localStorage.setItem(K,JSON.stringify(s));R()}
function X(){const x=S().external?.[SID]||{};return {done:+x.done||0,correct:+x.correct||0}}
function saveX(){const s=S(),d=Math.max(0,+document.getElementById('cpc-ext-done-w19')?.value||0),c=Math.min(d,Math.max(0,+document.getElementById('cpc-ext-correct-w19')?.value||0));s.external=s.external||{};s.external[SID]={done:d,correct:c};localStorage.setItem(K,JSON.stringify(s));R()}
function QS(){return Object.assign({summary:{done:false,score:0},complete:{done:false,score:0}},J(QUIZ_KEY))}
function saveQS(mode,score){const s=QS();s[mode]={done:true,score};localStorage.setItem(QUIZ_KEY,JSON.stringify(s));R()}
function qDone(mode){return !!QS()[mode]?.done}
function rd(mode){return g.CpcM19NativeReader?.stats?g.CpcM19NativeReader.stats(mode):{done:0,total:mode==='summary'?5:44}}
function P(){const m=M(),a=rd('summary'),b=rd('complete');return Math.round(((m.map?1:0)+a.done+(qDone('summary')?5:0)+b.done+(qDone('complete')?10:0)+(m.decorando?1:0))/(1+a.total+5+b.total+10+1)*100)}
function E(s){return String(s||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}

function map(){if(document.getElementById('m19map'))return;const o=document.createElement('div');o.id='m19map';o.className='bc-cpc-map-overlay';o.innerHTML='<div class="bc-cpc-map-overlay-head"><div><b>CPC M19 — Mapa Mental</b><span>Revisão rápida</span></div><button class="bc-cpc-map-close" onclick="cpcM19CloseMap()">← Voltar ao M19</button></div><iframe class="bc-cpc-map-frame" src="tools/cpc-m19-mapa.html"></iframe>';document.body.appendChild(o);document.documentElement.style.overflow='hidden';document.body.style.overflow='hidden'}
function closeMap(){document.getElementById('m19map')?.remove();document.documentElement.style.overflow='';document.body.style.overflow=''}

function openLaw(){
 if(document.getElementById('cpcM19Law'))return;
 const m=M(),o=document.createElement('div');o.id='cpcM19Law';o.className='bc-native-reader-overlay';
 o.innerHTML='<section class="bc-native-reader" role="dialog" aria-modal="true"><header class="bc-native-reader-head"><div class="bc-native-reader-title"><b>CPC M19 — Lei em Dia</b><small>Lei seca prioritária do módulo</small></div><button class="bc-native-reader-close" onclick="cpcM19CloseLaw()">×</button></header><div class="bc-native-reader-body"><main class="bc-native-scroll"><article class="bc-native-article"><div class="bc-native-kicker">LEITURA PRIORITÁRIA</div><h1>Artigos para decorar</h1><h2>Constituição Federal</h2><p>Art. 5º, XXI, LXIX, LXX, LXXI, LXXII, LXXIII e LXXVII; arts. 97, 102 e 103.</p><h2>Ação Popular</h2><p>Lei 4.717/1965: arts. 1º; 5º a 7º; 9º; 11 a 13; 18 a 21.</p><h2>Ação Civil Pública + CDC</h2><p>Lei 7.347/1985: arts. 1º a 5º; 8º e 9º; 11 a 13; 15 a 21. CDC: arts. 81, 82, 93, 103 e 104.</p><h2>Mandado de Segurança</h2><p>Lei 12.016/2009: arts. 1º a 7º; 14; 19 a 25. Atenção à ADI 4.296/STF.</p><h2>Mandado de Injunção e Habeas Data</h2><p>Lei 13.300/2016: arts. 1º a 14. Lei 9.507/1997: arts. 7º a 21.</p><h2>Controle concentrado</h2><p>Lei 9.868/1999: arts. 2º a 12-H e 13 a 28. Lei 9.882/1999: arts. 1º a 13.</p><aside class="bc-native-callout memory"><b>Mnemônico</b><div>Popular 5 anos • MS 120 • MI 10+10 • HD 10/15 • Controle 8/6/2-3.</div></aside><p><button class="cf-btn primary" onclick="cpcM19FinishLaw()">'+(m.decorando?'✓ Leitura concluída':'Marcar Lei em Dia como concluído')+'</button></p></article></main></div></section>';
 document.body.appendChild(o);document.body.style.overflow='hidden'
}
function closeLaw(){document.getElementById('cpcM19Law')?.remove();document.body.style.overflow=''}
function finishLaw(){setM({decorando:true});closeLaw()}

function closeQuiz(){document.getElementById('cpcM19Quiz')?.remove();document.body.style.overflow='';quiz=null}
function openQuiz(mode){
 closeQuiz();
 const list=QUESTIONS[mode],o=document.createElement('div');o.id='cpcM19Quiz';o.className='bc-native-reader-overlay';
 o.innerHTML='<section class="bc-native-reader" role="dialog" aria-modal="true"><header class="bc-native-reader-head"><div class="bc-native-reader-title"><b>CPC M19 — Fixação '+(mode==='summary'?'do resumido':'do completo')+'</b><small>'+(mode==='summary'?'2 fáceis • 2 médias • 1 difícil':'4 fáceis • 4 médias • 2 difíceis')+'</small></div><button class="bc-native-reader-close" data-q-close>×</button></header><div class="bc-native-reader-body"><main class="bc-native-scroll"><article class="bc-native-article" data-q-host></article></main></div></section>';
 document.body.appendChild(o);document.body.style.overflow='hidden';quiz={mode,list,i:0,score:0,answered:false,host:o.querySelector('[data-q-host]')};o.querySelector('[data-q-close]').onclick=closeQuiz;renderQuiz()
}
function renderQuiz(){
 if(!quiz)return;const q=quiz.list[quiz.i],n=quiz.i+1,total=quiz.list.length;
 quiz.answered=false;
 quiz.host.innerHTML='<div class="bc-native-kicker">QUESTÃO '+n+' DE '+total+' • '+E(q.d)+'</div><h1 style="font-size:1.55em">'+E(q.q)+'</h1><div data-options>'+q.o.map((x,i)=>'<button class="cf-btn" data-opt="'+i+'" style="display:block;width:100%;text-align:left;margin:8px 0;padding:13px">'+String.fromCharCode(65+i)+') '+E(x)+'</button>').join('')+'</div><div data-feedback style="margin-top:16px"></div><p><button class="cf-btn primary" data-next style="display:none">'+(n===total?'Finalizar':'Próxima questão →')+'</button></p>';
 quiz.host.querySelectorAll('[data-opt]').forEach(b=>b.onclick=()=>answerQuiz(+b.dataset.opt));
}
function answerQuiz(sel){
 if(!quiz||quiz.answered)return;quiz.answered=true;const q=quiz.list[quiz.i],ok=sel===q.a;if(ok)quiz.score++;
 quiz.host.querySelectorAll('[data-opt]').forEach((b,i)=>{b.disabled=true;if(i===q.a)b.classList.add('good')});
 const f=quiz.host.querySelector('[data-feedback]');f.innerHTML='<aside class="bc-native-callout '+(ok?'case':'trap')+'"><b>'+(ok?'✓ Correto':'✗ Incorreto')+'</b><div>'+E(q.e)+'</div></aside>';
 const nx=quiz.host.querySelector('[data-next]');nx.style.display='inline-flex';nx.onclick=()=>{if(quiz.i+1<quiz.list.length){quiz.i++;renderQuiz()}else finishQuiz()}
}
function finishQuiz(){
 if(!quiz)return;const mode=quiz.mode,score=quiz.score,total=quiz.list.length;saveQS(mode,score);
 quiz.host.innerHTML='<div class="bc-native-kicker">FIXAÇÃO CONCLUÍDA</div><h1>'+score+' / '+total+'</h1><p>Seu resultado foi salvo e esta tarefa passou a contar no progresso do M19.</p><p><button class="cf-btn primary" data-done>Voltar ao M19</button></p>';quiz.host.querySelector('[data-done]').onclick=closeQuiz
}

function H(w){
 const m=M(),a=rd('summary'),b=rd('complete'),x=X(),p=P(),acc=x.done?Math.round(x.correct/x.done*1000)/10:0,qs=QS();
 return '<section class="cf-module" data-cf="cpc19"><button class="cf-module-head" onclick="toggleCpcModule(\'cpc19\')"><span class="cf-module-no">MÓDULO 19</span><span class="cf-module-title">'+E(w?.title||'Ações coletivas, constitucionais e controle de constitucionalidade')+'</span><span class="cf-module-stat">Cobertura '+p+'%</span><span class="chev">⌄</span></button><div class="cf-module-body"><div class="cf-module-bar"><span style="width:'+p+'%"></span></div><section class="bc-native-materials bc-native-materials-static"><div class="bc-native-material-grid"><button class="bc-native-material-card" onclick="CpcM19NativeReader.open(\'summary\')"><span class="bc-native-material-icon">⚡</span><span><strong>Conteúdo resumido</strong><small>'+a.total+' capítulos</small></span><span class="bc-native-material-action"><span>'+a.done+'/'+a.total+'</span><span>→</span></span></button><button class="bc-native-material-card" onclick="CpcM19NativeReader.open(\'complete\')"><span class="bc-native-material-icon">📚</span><span><strong>Conteúdo completo</strong><small>'+b.total+' blocos</small></span><span class="bc-native-material-action"><span>'+b.done+'/'+b.total+'</span><span>→</span></span></button><button class="bc-native-material-card" onclick="cpcM19OpenMap()"><span class="bc-native-material-icon">🧠</span><span><strong>Mapa mental</strong><small>Consulta rápida</small></span><span class="bc-native-material-action"><span>'+(m.map?'✓':'Abrir')+'</span><span>→</span></span></button></div></section><section class="cpc-study-intro" style="margin-top:12px"><div><h3>Fixação interna</h3><p>Questões autorais calibradas ao conteúdo auditado do M19.</p></div><div class="cpc-study-actions"><button class="cf-btn '+(qs.summary.done?'good':'')+'" onclick="cpcM19OpenQuiz(\'summary\')">'+(qs.summary.done?'✓ ':'')+'5 do resumido'+(qs.summary.done?' • '+qs.summary.score+'/5':'')+'</button><button class="cf-btn '+(qs.complete.done?'good':'')+'" onclick="cpcM19OpenQuiz(\'complete\')">'+(qs.complete.done?'✓ ':'')+'10 do completo'+(qs.complete.done?' • '+qs.complete.score+'/10':'')+'</button></div></section><div class="cpc-bottom-grid"><section class="cpc-mini-panel"><h4>⚖️ Lei em Dia</h4><button class="cf-btn primary" onclick="cpcM19OpenLaw()">Abrir artigos</button> <button class="cf-btn '+(m.decorando?'good':'')+'" onclick="cpcM19Set({decorando:'+(!m.decorando)+'})">'+(m.decorando?'✓ Concluído':'Marcar concluído')+'</button></section><section class="cpc-mini-panel"><h4>🎯 Questões externas</h4><div class="cpc-external-form"><label>Feitas<input id="cpc-ext-done-w19" type="number" value="'+x.done+'"></label><label>Acertos<input id="cpc-ext-correct-w19" type="number" value="'+x.correct+'"></label><button class="cf-btn" onclick="cpcM19SaveExternal()">Salvar</button></div><div class="cpc-ext-score">'+(x.done?acc+'%':'—')+'</div></section></div></div></section>'
}
function R(){try{renderAll()}catch(_){}}
function install(){if(!g.CpcStudyV1||!g.__CPC_WEEKS){setTimeout(install,100);return}if(g.CpcStudyM19)return;const prev=g.CpcStudyV1.renderMaster,pp=g.CpcStudyV1.progress;g.CpcStudyV1.progress=id=>(id===ID||id===SID)?P():pp(id);g.CpcStudyV1.renderMaster=function(){const b=prev(),w=g.__CPC_WEEKS.find(x=>x.id===ID),i=b.lastIndexOf('</div>');return w?b.slice(0,i)+H(w)+b.slice(i):b};g.CpcStudyM19=true;R()}

g.cpcM19OpenMap=map;g.cpcM19CloseMap=closeMap;g.cpcM19Set=setM;g.cpcM19SaveExternal=saveX;
g.cpcM19OpenLaw=openLaw;g.cpcM19CloseLaw=closeLaw;g.cpcM19FinishLaw=finishLaw;
g.cpcM19OpenQuiz=openQuiz;g.cpcM19CloseQuiz=closeQuiz;
g.addEventListener('message',e=>{if(e.origin===location.origin&&e.data?.type==='cpc-map-complete'&&e.data?.module==='w19')setM({map:true})});
setTimeout(install,0);
})(window);