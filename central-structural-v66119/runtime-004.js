function civil12AnkiStep(){
 const id='anki12',m=civilModuleState('m12'),done=!!m.anki,open=localStorage.getItem(civil12StepOpenKey(id))==='1';
 const deck='04 DIREITO CIVIL::12 POSSE, PROPRIEDADE E DIREITOS REAIS';
 return `<section class="civil-step ${done?'done':''} ${open?'open':''}" data-step="anki12"><button class="civil-step-head" onclick="toggleCivil12Step('anki12')"><span class="civil-step-n">${done?'✓':'8'}</span><span class="civil-step-title"><b>Anki seletivo</b><small>Use o baralho existente de Posse, Propriedade e Direitos Reais.</small></span><span class="civil-step-status">${done?'Concluído':'Pendente'}</span><span>⌄</span></button>
 <div class="civil-step-body"><p class="civil-anki-note">Abra o baralho <b>12 POSSE, PROPRIEDADE E DIREITOS REAIS</b> e revise nesta rodada somente os cartões de <b>Posse — arts. 1.196 a 1.224</b>. Deixe propriedade e demais direitos reais para os Módulos 13 e 14.</p>
 <div class="civil-stage-actions" style="margin-top:9px"><button class="civil-btn primary" onclick="window.openAnkiDeck('${escJs(deck)}')">🧠 Abrir baralho existente</button></div>
 <label class="civil-manual-done"><input type="checkbox" ${done?'checked':''} onchange="civilSetModule('m12',{anki:this.checked})"> Marcar revisão no Anki como concluída</label></div></section>`
}
function renderCivilModule12(){
 const pct=civilModulePct('m12');
 return `<div class="civil-overall"><span style="width:${pct}%"></span></div><div class="civil-scope-note"><span class="civil-scope-badge edital">EDITAL</span><b>Escopo fechado do Módulo 12:</b> Posse do art. 1.196 ao 1.224, incluindo teorias, classificação, detenção, aquisição/transmissão, proteção, efeitos, função social/socioambiental e perda. <b>Usucapião detalhada e propriedade ficam para o Módulo 13.</b></div>
 <div class="civil-steps">
 ${civil12QuestionStep('diagnostic12','Diagnóstico FCC','10 questões reais, com prioridade para 2020-2026.',1)}
 ${civil12ManualStep('reading12','Leitura orientada','CC 1.196-1.224, sem avançar para propriedade.',2,civil12ReadingBody(),'reading')}
 ${civil12ManualStep('theory12','Teoria nuclear','Teorias, classificações, aquisição, proteção, efeitos e perda.',3,civil12TheoryBody(),'theory')}
 ${civil12ManualStep('deep12','Aprofundamento e jurisprudência','STJ 2020-2026, interversão, detenção e efeitos da boa/má-fé.',4,civil12DeepBody(),'deep')}
 ${civil12QuestionStep('cases12','Casos práticos','5 casos autorais identificados.',5)}
 ${civil12QuestionStep('final12','Bateria final FCC','15 questões FCC reais após a teoria.',6)}
 ${civil12ErrorStep()}
 ${civil12AnkiStep()}
 </div>`
}


let civil13Ui={stage:null,index:0};
function civil13StepOpenKey(id){return `central-v6:civil-step:m13:${id}`}
function civil13StageQuestions(stage){
 if(stage==='diagnostic13')return CIVIL_COURSE.diagnostic13||[];
 if(stage==='final13')return CIVIL_COURSE.final13||[];
 if(stage==='cases13')return CIVIL_COURSE.cases13||[];
 if(stage==='errors13'){
  const all=[...(CIVIL_COURSE.diagnostic13||[]),...(CIVIL_COURSE.cases13||[]),...(CIVIL_COURSE.final13||[])];
  return all.filter(q=>civilAnswer(q.id)?.everWrong);
 }
 return[];
}
function civil13StageDone(stage){
 const qs=civil13StageQuestions(stage);return qs.length>0&&qs.every(q=>(civilAnswer(q.id)?.attempts||0)>0)
}
function civil13Steps(){
 const m=civilModuleState('m13');
 return [
  {id:'diagnostic13',done:civil13StageDone('diagnostic13')},
  {id:'reading13',done:!!m.reading},
  {id:'theory13',done:!!m.theory},
  {id:'deep13',done:!!m.deep},
  {id:'cases13',done:civil13StageDone('cases13')},
  {id:'final13',done:civil13StageDone('final13')},
  {id:'errors13',done:!!m.errorsReviewed},
  {id:'anki13',done:!!m.anki}
 ]
}
function toggleCivil13Step(id){
 const el=document.querySelector(`.civil-module[data-civil="m13"] .civil-step[data-step="${id}"]`);if(!el)return;
 const open=!el.classList.contains('open');el.classList.toggle('open',open);localStorage.setItem(civil13StepOpenKey(id),open?'1':'0')
}
function civil13OpenStage(stage){
 const qs=civil13StageQuestions(stage);if(!qs.length){civil13Ui={stage,index:0};renderSubjects();return}
 let idx=qs.findIndex(q=>(civilAnswer(q.id)?.attempts||0)===0);if(idx<0)idx=0;
 civil13Ui={stage,index:idx};localStorage.setItem(civil13StepOpenKey(stage),'1');renderSubjects();
 setTimeout(()=>document.querySelector(`.civil-module[data-civil="m13"] .civil-step[data-step="${stage}"]`)?.scrollIntoView({behavior:'smooth',block:'center'}),20)
}
function civil13Select(id,letter){
 const st=civilState(),a=st.answers[id]||{attempts:0,history:[],everWrong:false};
 if(a.submitted)return;a.selected=letter;a.submitted=false;st.answers[id]=a;civilSave(st);renderSubjects()
}
function civil13Submit(id,stage){
 const q=[...(CIVIL_COURSE.diagnostic13||[]),...(CIVIL_COURSE.cases13||[]),...(CIVIL_COURSE.final13||[])].find(x=>x.id===id);
 if(!q)return;const st=civilState(),a=st.answers[id]||{attempts:0,history:[],everWrong:false};
 if(!a.selected){alert('Escolha uma alternativa primeiro.');return}
 const correct=a.selected===q.answer;
 a.attempts=(a.attempts||0)+1;a.submitted=true;a.lastCorrect=correct;a.everWrong=!!a.everWrong||!correct;
 a.history=[...(a.history||[]),{at:new Date().toISOString(),selected:a.selected,correct,stage,module:'m13'}];
 st.answers[id]=a;civilSave(st);renderAll()
}
function civil13Retry(id){const st=civilState(),a=st.answers[id];if(!a)return;a.selected=null;a.submitted=false;st.answers[id]=a;civilSave(st);renderSubjects()}
function civil13Move(stage,delta){
 const qs=civil13StageQuestions(stage);if(!qs.length)return;
 civil13Ui.stage=stage;civil13Ui.index=Math.max(0,Math.min(qs.length-1,civil13Ui.index+delta));renderSubjects()
}
function civil13Accuracy(stage){
 const qs=civil13StageQuestions(stage),answered=qs.map(q=>civilAnswer(q.id)).filter(a=>a?.attempts);
 const correct=answered.filter(a=>a.lastCorrect).length;
 return {answered:answered.length,total:qs.length,correct,pct:answered.length?Math.round(correct/answered.length*100):0}
}
function civil13QuestionMeta(q){
 const role=/Oficial de Justiça/i.test(q.source)?'Oficial de Justiça':/Analista|Defensor|Juiz|Procurador|Promotor|Auditor|AFRE|AFFE/i.test(q.source)?'Nível superior / carreira jurídica':'Carreira jurídica';
 return `<div class="civil-qmeta"><span class="civil-chip real">${esc(q.bankLabel||'QUESTÃO REAL FCC')}</span><span class="civil-chip role">${esc(role)}</span><span class="civil-chip">${esc(q.basis)}</span><span class="civil-qsource">${esc(q.source)}</span></div>`
}
function civil13QuestionCard(q,stage,index,total){
 const a=civilAnswer(q.id)||{selected:null,submitted:false,attempts:0,history:[]},locked=!!a.submitted;
 const opts=Object.entries(q.options).map(([letter,text])=>{
  let cls='civil-option';if(a.selected===letter)cls+=' selected';
  if(locked&&letter===q.answer)cls+=' correct';else if(locked&&a.selected===letter&&letter!==q.answer)cls+=' wrong';
  return `<button class="${cls}" ${locked?'disabled':''} onclick="civil13Select('${escJs(q.id)}','${letter}')"><span class="civil-letter">${letter}</span><span>${esc(text)}</span></button>`
 }).join('');
 const meta=q.kind==='real'?civil13QuestionMeta(q):`<div class="civil-qmeta"><span class="civil-chip authorial">AUTORAL</span><span class="civil-chip role">Nível Analista/Oficial</span><span class="civil-chip">${esc(q.basis)}</span><span class="civil-qsource">${esc(q.source)}</span></div>`;
 const feedback=locked?`<div class="civil-feedback ${a.lastCorrect?'good':'bad'}"><b>${a.lastCorrect?'✓ Resposta correta':'✕ Resposta incorreta — gabarito '+q.answer}</b>${esc(q.explanation)}<span class="basis">Fundamento: ${esc(q.basis)}${a.attempts>1?' · '+a.attempts+' tentativas':''}</span></div>`:'';
 const source=q.kind==='real'?(q.url?`<a class="civil-source-link" href="${escAttr(q.url)}" target="_blank" rel="noopener">Fonte da questão no TEC ↗</a>`:'<span class="muted small">Questão real FCC recuperada dos PDFs enviados.</span>'):'<span class="muted small">Caso criado para aplicação da regra.</span>';
 return `<article class="civil-qcard">${meta}<h4>${esc(q.prompt)}</h4><div class="civil-options">${opts}</div>
 <div class="civil-submit-row"><div>${source}</div>
 <div class="civil-qnav"><button class="civil-btn" onclick="civil13Move('${stage}',-1)" ${index===0?'disabled':''}>←</button><span>${index+1} / ${total}</span><button class="civil-btn" onclick="civil13Move('${stage}',1)" ${index===total-1?'disabled':''}>→</button></div>
 ${locked?`<button class="civil-btn" onclick="civil13Retry('${escJs(q.id)}')">Refazer</button>`:`<button class="civil-btn primary" onclick="civil13Submit('${escJs(q.id)}','${stage}')">Responder</button>`}
 </div>${feedback}</article>`
}
function civil13StageSession(stage){
 const qs=civil13StageQuestions(stage);if(!qs.length)return '<div class="muted small">Nenhuma questão disponível.</div>';
 if(civil13Ui.stage!==stage)civil13Ui={stage,index:Math.max(0,qs.findIndex(q=>(civilAnswer(q.id)?.attempts||0)===0))};
 civil13Ui.index=Math.max(0,Math.min(qs.length-1,civil13Ui.index));
 return civil13QuestionCard(qs[civil13Ui.index],stage,civil13Ui.index,qs.length)
}
function civil13QuestionStep(stage,title,subtitle,num){
 const stats=civil13Accuracy(stage),done=civil13StageDone(stage),open=localStorage.getItem(civil13StepOpenKey(stage))==='1',active=civil13Ui.stage===stage;
 return `<section class="civil-step ${done?'done':''} ${open?'open':''}" data-step="${stage}">
 <button class="civil-step-head" onclick="toggleCivil13Step('${stage}')"><span class="civil-step-n">${done?'✓':num}</span><span class="civil-step-title"><b>${esc(title)}</b><small>${esc(subtitle)}</small></span><span class="civil-step-status">${stats.answered}/${stats.total} respondidas${stats.answered?' · '+stats.pct+'%':''}</span><span>⌄</span></button>
 <div class="civil-step-body"><div class="civil-stage-toolbar"><p>${stage==='diagnostic13'?'Dez questões FCC reais, com foco em propriedade, usucapião, registro e perda. Resolva antes da teoria.':stage==='final13'?'Quinze questões FCC reais, acrescentando vizinhança, condomínio e propriedade resolúvel/fiduciária.':'Casos autorais de nível superior para consolidar jurisprudência recente, registro, vizinhança e condomínio.'}</p><div class="civil-stage-actions"><button class="civil-btn primary" onclick="civil13OpenStage('${stage}')">${stats.answered?'Continuar':'Iniciar'}</button></div></div>${active?civil13StageSession(stage):''}</div></section>`
}
function civil13ManualStep(id,title,subtitle,num,body,field){
 const st=civilModuleState('m13'),done=!!st[field],open=localStorage.getItem(civil13StepOpenKey(id))==='1';
 return `<section class="civil-step ${done?'done':''} ${open?'open':''}" data-step="${id}">
 <button class="civil-step-head" onclick="toggleCivil13Step('${id}')"><span class="civil-step-n">${done?'✓':num}</span><span class="civil-step-title"><b>${esc(title)}</b><small>${esc(subtitle)}</small></span><span class="civil-step-status">${done?'Concluído':'Pendente'}</span><span>⌄</span></button>
 <div class="civil-step-body">${body}<label class="civil-manual-done"><input type="checkbox" ${done?'checked':''} onchange="civilSetModule('m13',{${field}:this.checked})"> Marcar esta etapa como concluída</label></div></section>`
}
function civil13ReadingBody(){
 return `<div class="civil-theory"><section><h4>Leitura orientada — Módulo 13</h4><div class="civil-law-grid">
 <div class="civil-law-card"><b>CC, arts. 1.225 a 1.237</b><span>Direitos reais e propriedade em geral: poderes, função social/socioambiental, limites e descoberta.</span></div>
 <div class="civil-law-card"><b>CC, arts. 1.238 a 1.276</b><span>Aquisição e perda: usucapião, registro, acessão, propriedade móvel e perda.</span></div>
 <div class="civil-law-card"><b>CC, arts. 1.277 a 1.313</b><span>Direitos de vizinhança: uso anormal, árvores, passagem, águas, limites e direito de construir.</span></div>
 <div class="civil-law-card"><b>CC, arts. 1.314 a 1.358-A</b><span>Condomínio geral, condomínio edilício e condomínio de lotes.</span></div>
 <div class="civil-law-card"><b>CC, arts. 1.358-B a 1.358-U</b><span>Multipropriedade — leitura complementar de menor prioridade.</span></div>
 <div class="civil-law-card"><b>CC, arts. 1.359 a 1.368-B</b><span>Propriedade resolúvel e propriedade fiduciária.</span></div>
 </div>
 <div class="civil-alert"><b>Fronteira do módulo:</b> superfície, servidões, usufruto, uso, habitação, laje, promitente comprador e garantias reais em espécie ficam no Módulo 14.</div>
 <div class="civil-stage-actions"><button class="civil-btn primary" onclick="saveLast({civilModule:'m13',title:'Direito Civil • Módulo 13 • Propriedade no Vade Mecum',at:Date.now()});openVadeMecum(null,'cc')">📖 Abrir Código Civil no Vade Mecum</button></div></section></div>`
}
function civil13TheoryBody(){
 return `<div class="civil-theory">
 <section><h4>1. Propriedade como direito real</h4><p>A propriedade integra o rol do art. 1.225. O proprietário pode <strong>usar, gozar, dispor e reaver</strong> a coisa de quem injustamente a possua ou detenha.</p><p>Para atos inter vivos, direitos reais móveis se adquirem, em regra, com <strong>tradição</strong>; direitos reais imobiliários, com <strong>registro</strong>, ressalvadas as hipóteses legais de aquisição originária.</p></section>

 <section><h4>2. Função social e socioambiental — art. 1.228</h4><p>O domínio não é poder absoluto. Seu exercício deve atender finalidades econômicas e sociais e preservar flora, fauna, belezas naturais, equilíbrio ecológico e patrimônio histórico/artístico, evitando poluição.</p><div class="civil-alert">A função social não elimina a propriedade; ela conforma o exercício do direito e opera junto com a vedação do abuso.</div></section>

 <section><h4>3. Ato emulativo e abuso</h4><p>É vedado praticar ato que não traga qualquer comodidade ou utilidade ao proprietário e seja animado pela intenção de prejudicar terceiro. A regra do art. 1.228, §2º, dialoga diretamente com o abuso de direito do art. 187.</p></section>

 <section><h4>4. Posse-trabalho — art. 1.228, §§4º-5º</h4><p>Em extensa área reivindicada, posse ininterrupta e de boa-fé por mais de cinco anos, exercida por considerável número de pessoas com obras/serviços de relevante interesse social e econômico, pode levar à privação do proprietário mediante <strong>justa indenização</strong>.</p><div class="civil-alert">Não confunda com usucapião: o Código prevê indenização e sentença como título após pagamento.</div></section>

 <section><h4>5. Extensão vertical e recursos minerais</h4><p>Solo, espaço aéreo e subsolo integram o domínio apenas na altura/profundidade úteis ao seu exercício. Jazidas, minas, recursos minerais, potenciais hidráulicos e monumentos arqueológicos ficam fora do domínio do solo, ressalvadas regras legais específicas.</p></section>

 <section><h4>6. Propriedade plena/exclusiva e frutos</h4><p>A propriedade presume-se <strong>plena e exclusiva até prova em contrário</strong>. Em regra, frutos e demais produtos pertencem ao proprietário mesmo separados, observadas as exceções jurídicas.</p></section>

 <section><h4>7. Usucapião: natureza</h4><p>É modo <strong>originário</strong> de aquisição. Preenchidos os requisitos, a sentença é declaratória e serve de título para registro. O registro não cria a aquisição originária; publiciza e regulariza o domínio reconhecido.</p><div class="civil-alert">Bens públicos não se submetem à usucapião, inclusive dominicais.</div></section>

 <section><h4>8. Quadro das principais usucapiões do Código</h4><table class="civil-compare"><tr><th>Modalidade</th><th>Prazo</th><th>Requisitos-chave</th></tr>
 <tr><td>Extraordinária — 1.238</td><td>15 anos</td><td>Posse como dono, contínua, sem oposição; dispensa título e boa-fé.</td></tr>
 <tr><td>Extraordinária reduzida</td><td>10 anos</td><td>Moradia habitual ou obras/serviços produtivos.</td></tr>
 <tr><td>Rural especial — 1.239</td><td>5 anos</td><td>≤50 ha, produtividade + moradia, sem outro imóvel.</td></tr>
 <tr><td>Urbana especial — 1.240</td><td>5 anos</td><td>≤250 m², moradia, sem outro imóvel; uma única vez.</td></tr>
 <tr><td>Familiar — 1.240-A</td><td>2 anos</td><td>Posse direta/exclusiva, imóvel urbano ≤250 m² dividido com ex que abandonou o lar, moradia, sem outro imóvel.</td></tr>
 <tr><td>Ordinária — 1.242</td><td>10 anos</td><td>Justo título + boa-fé.</td></tr>
 <tr><td>Ordinária reduzida/tabular</td><td>5 anos</td><td>Aquisição onerosa com registro cancelado depois + moradia ou investimento social/econômico.</td></tr></table></section>

 <section><h4>9. Accessio possessionis e causas da prescrição</h4><p>O possuidor pode, para contar o prazo, acrescentar a posse dos antecessores quando todas forem contínuas e pacíficas e, na ordinária, com justo título e boa-fé. Aplicam-se à usucapião as causas que obstam, suspendem ou interrompem a prescrição.</p></section>

 <section><h4>10. Registro do título — arts. 1.245 a 1.247</h4><ul><li>Propriedade imóvel inter vivos se transfere com o <strong>registro</strong>.</li><li>Até o registro, o alienante continua havido como dono.</li><li>Registro produz efeitos desde a prenotação.</li><li>Registro inexato pode ser retificado/anulado; cancelado, o proprietário pode reivindicar nas condições do art. 1.247.</li></ul></section>

 <section><h4>11. Acessão — arts. 1.248 a 1.259</h4><table class="civil-compare"><tr><th>Instituto</th><th>Essência</th></tr>
 <tr><td>Ilhas</td><td>Distribuição segundo posição no curso d'água e testadas.</td></tr>
 <tr><td>Aluvião</td><td>Acréscimo sucessivo e imperceptível; sem indenização.</td></tr>
 <tr><td>Avulsão</td><td>Porção arrancada por força natural violenta; indenização ou consolidação após prazo legal sem reclamação.</td></tr>
 <tr><td>Álveo abandonado</td><td>Antigo leito pertence aos ribeirinhos até a mediania, sem indenização aos terrenos do novo curso.</td></tr>
 <tr><td>Construções/plantações</td><td>Regime varia conforme titularidade do solo/material e boa ou má-fé.</td></tr></table></section>

 <section><h4>12. Propriedade móvel — arts. 1.260 a 1.274</h4><p>Usucapião móvel: <strong>3 anos com justo título e boa-fé</strong>; <strong>5 anos independentemente de título e boa-fé</strong>. Também são modos aquisitivos ocupação, achado de tesouro, tradição, especificação, confusão, comissão e adjunção.</p><p>A tradição vinculada a negócio nulo não transfere a propriedade. O Código disciplina tradição real, simbólica e situações equivalentes.</p></section>

 <section><h4>13. Perda da propriedade — arts. 1.275-1.276</h4><p>Rol expresso: alienação, renúncia, abandono, perecimento e desapropriação, sem excluir outras causas previstas no Código.</p><p>Imóvel urbano abandonado, sem posse de terceiro, pode ser arrecadado como vago e, após 3 anos, passar ao Município/DF; rural, à União. Cessada a posse e não pagos os ônus fiscais, a intenção de abandono é presumida de modo absoluto pelo §2º.</p></section>

 <section><h4>14. Uso anormal da propriedade — arts. 1.277-1.281</h4><p>Proprietário ou possuidor pode fazer cessar interferências prejudiciais à <strong>segurança, sossego e saúde</strong>, avaliadas segundo natureza do uso, localização, zoneamento e tolerância ordinária.</p><p>Se justificadas por interesse público, pode haver dever de tolerar + indenização cabal; se depois for possível reduzir/eliminar, o vizinho pode exigir.</p></section>

 <section><h4>15. Passagem forçada e passagem de cabos/tubulações</h4><p>Prédio sem acesso a via pública, nascente ou porto pode impor passagem ao vizinho mais natural e facilmente adequado, mediante indenização. O Código também disciplina passagem subterrânea de cabos, tubulações e condutos indispensáveis, com indenização e cautelas.</p></section>

 <section><h4>16. Águas, limites e direito de construir</h4><ul><li>Árvore na linha divisória presume-se comum.</li><li>Raízes/ramos que ultrapassam o limite podem ser cortados no plano divisório.</li><li>Há regras para águas naturais e artificiais, aquedutos e nascentes.</li><li>Confinante pode exigir demarcação; despesas comuns são repartidas, com regra própria para tapumes especiais.</li><li>Em regra, é vedado abrir janela/eirado/terraço/varanda a menos de <strong>1,5 m</strong> do terreno vizinho.</li><li>Entrada no imóvel vizinho para reparação/limpeza indispensável exige prévio aviso.</li></ul></section>

 <section><h4>17. Condomínio geral — arts. 1.314 a 1.330</h4><ul><li>Cada condômino usa a coisa conforme sua destinação e pode alienar/gravar sua fração ideal.</li><li>Não pode alterar a destinação ou dar posse/uso/gozo a estranho sem consenso dos demais.</li><li>Despesas e ônus seguem a proporção do quinhão; partes ideais presumem-se iguais.</li><li>Todo condômino pode exigir divisão a qualquer tempo; indivisão convencional/testamentária tem limites temporais.</li><li>Coisa indivisível e sem adjudicação a um condômino pode ser vendida, com preferência entre condôminos nas condições legais.</li></ul></section>

 <section><h4>18. Condomínio edilício — estrutura</h4><p>Há unidades de propriedade exclusiva e partes comuns inseparáveis. Cada unidade leva fração ideal no solo e áreas comuns. Nenhuma unidade pode ser privada de acesso ao logradouro público.</p><p>Instituição: ato entre vivos ou testamento + registro. Convenção: subscrição de titulares de no mínimo <strong>2/3 das frações ideais</strong>; para oponibilidade a terceiros, registro no RI.</p></section>

 <section><h4>19. Direitos, deveres e multas no edilício</h4><p>Condômino pode usar/fruir/dispor da unidade e usar partes comuns sem excluir os demais. Deve contribuir para despesas, preservar segurança/fachada e respeitar a destinação, sossego, salubridade, segurança e bons costumes.</p><div class="civil-alert"><b>Atualização 2024:</b> art. 1.336, §1º: inadimplente sofre correção monetária + juros convencionados ou, na falta, juros do art. 406 + multa de até 2%.</div></section>

 <section><h4>20. Assembleias e quóruns atuais</h4><ul><li>Alteração da convenção e mudança de destinação do edifício/unidade: <strong>2/3 dos votos dos condôminos</strong> — Lei 14.405/2022.</li><li>Segunda convocação: maioria dos presentes, salvo quórum especial.</li><li>Quórum especial não atingido pode permitir sessão permanente nos requisitos do art. 1.353.</li><li>Assembleias podem ocorrer eletronicamente, observados os requisitos do art. 1.354-A — Lei 14.309/2022.</li></ul></section>

 <section><h4>21. Condomínio de lotes e multipropriedade</h4><p>O art. 1.358-A disciplina condomínio de lotes. A multipropriedade (1.358-B a 1.358-U) é condomínio por <strong>frações de tempo</strong>; cada titular usa e goza exclusivamente a totalidade do imóvel em períodos alternados. É bloco de menor prioridade, mas atual.</p></section>

 <section><h4>22. Propriedade resolúvel — arts. 1.359-1.360</h4><p>Se a resolução decorre do implemento de condição ou advento de termo do título, resolvem-se também direitos reais concedidos durante sua pendência. Se decorre de outra causa superveniente, protege-se o adquirente por título anterior nos termos do art. 1.360, restando ação contra quem teve a propriedade resolvida.</p></section>

 <section><h4>23. Propriedade fiduciária — arts. 1.361-1.368-B</h4><p>No regime-base do Código, é propriedade resolúvel de <strong>coisa móvel infungível</strong> transferida pelo devedor ao credor em garantia. Constitui-se com o registro do contrato; o devedor fica com a <strong>posse direta</strong>.</p><ul><li>Antes do vencimento, devedor pode usar a coisa segundo a destinação, às próprias expensas e risco.</li><li>Não paga a dívida, o credor é obrigado a vender a coisa a terceiro e aplicar o preço na dívida/despesas, entregando eventual saldo.</li><li>É nula cláusula que permita ao credor ficar com a coisa pelo simples inadimplemento.</li><li>Outras espécies fiduciárias submetem-se prioritariamente às leis especiais; o Código atua de forma compatível/supletiva.</li></ul></section>
 </div>`
}
function civil13DeepBody(){
 return `<div class="civil-theory">
 <section class="civil-juris"><h4>STJ — Tema 985: lote mínimo municipal não impede usucapião extraordinária</h4><p>Preenchidos os requisitos do art. 1.238, a usucapião extraordinária não pode ser negada apenas porque a área é inferior ao módulo mínimo previsto em lei municipal. É precedente qualificado e transitado em julgado.</p></section>

 <section class="civil-juris"><h4>STJ 2026 — usucapião familiar: 250 m² é limite do imóvel inteiro</h4><p>No Informativo 892/2026, a Quarta Turma decidiu que a metragem de 250 m² do art. 1.240-A incide sobre a área total do imóvel urbano. Não é possível pedir apenas uma fração de até 250 m² de imóvel maior para contornar o requisito.</p></section>

 <section class="civil-juris"><h4>STJ 2026 — curta estadia e destinação residencial</h4><p>No REsp 2.121.055/MG, Informativo 889/2026, a Segunda Seção entendeu que contratos atípicos de curtíssima estadia com exploração econômica reiterada/profissional podem descaracterizar a destinação residencial e exigem aprovação de <strong>2/3</strong> para alteração da destinação, conforme o art. 1.351 atual.</p><div class="civil-alert"><b>Atualidade:</b> o Tema Repetitivo 1.443 foi afetado em junho de 2026 para questão correlata — se a mera cláusula de destinação residencial basta para impedir locações de curto período por plataformas. O tema segue afetado; não trate essa formulação mais ampla como tese repetitiva já julgada.</div></section>

 <section class="civil-juris"><h4>Súmula 260/STJ — convenção sem registro</h4><p>A convenção de condomínio aprovada, mesmo sem registro, é eficaz para regular as relações entre os condôminos. O registro é necessário para oponibilidade a terceiros, em harmonia com o art. 1.333, parágrafo único.</p></section>

 <section><h4>Mapa de pegadinhas</h4><table class="civil-compare"><tr><th>Pegadinha</th><th>Regra correta</th></tr>
 <tr><td>Propriedade é absoluta.</td><td>É direito real submetido à função social, ambiental, boa-fé e vedação ao abuso.</td></tr>
 <tr><td>Jazidas pertencem ao proprietário do solo.</td><td>Não, art. 1.230.</td></tr>
 <tr><td>Usucapião é aquisição derivada.</td><td>Originária.</td></tr>
 <tr><td>Sentença de usucapião é constitutiva.</td><td>Declaratória.</td></tr>
 <tr><td>Bens públicos dominicais podem ser usucapidos.</td><td>Não.</td></tr>
 <tr><td>Extraordinária exige justo título e boa-fé.</td><td>Dispensa ambos.</td></tr>
 <tr><td>Área menor que lote mínimo municipal impede extraordinária.</td><td>Não, Tema 985/STJ.</td></tr>
 <tr><td>Familiar permite destacar 250 m² de imóvel maior.</td><td>Não, STJ 2026.</td></tr>
 <tr><td>Escritura transfere imóvel.</td><td>Inter vivos, é necessário registro.</td></tr>
 <tr><td>Tradição baseada em negócio nulo transfere móvel.</td><td>Não.</td></tr>
 <tr><td>Alienação e renúncia de imóvel independem de registro para perda real.</td><td>Art. 1.275, parágrafo único, condiciona seus efeitos registrais.</td></tr>
 <tr><td>Interferência de interesse público nunca gera indenização.</td><td>Pode gerar indenização cabal, art. 1.278.</td></tr>
 <tr><td>Passagem forçada é gratuita.</td><td>Exige indenização cabal.</td></tr>
 <tr><td>Condômino pode mudar sozinho a destinação da coisa comum.</td><td>Não.</td></tr>
 <tr><td>Convenção edilícia nasce com 1/4 das frações.</td><td>2/3 das frações ideais.</td></tr>
 <tr><td>Mudar destinação do edifício/unidade exige unanimidade.</td><td>Hoje, 2/3 — Lei 14.405/2022.</td></tr>
 <tr><td>Assembleia eletrônica é vedada.</td><td>Admitida pelo art. 1.354-A.</td></tr>
 <tr><td>Na fiduciária, devedor fica com posse indireta.</td><td>Fica com posse direta.</td></tr>
 <tr><td>Credor fiduciário pode ficar automaticamente com o bem não pago.</td><td>Pacto comissório é nulo; art. 1.365.</td></tr></table></section>
 </div>`
}
function civil13ErrorStep(){
 const id='errors13',m=civilModuleState('m13'),done=!!m.errorsReviewed,open=localStorage.getItem(civil13StepOpenKey(id))==='1';
 const qs=civil13StageQuestions('errors13'),unresolved=qs.filter(q=>civilAnswer(q.id)?.lastCorrect===false);
 const rows=qs.map((q,i)=>{const a=civilAnswer(q.id);return `<div class="civil-error-row"><div><b>${q.kind==='real'?'FCC':'Autoral'} • ${esc(q.subject)}</b><small>${a?.lastCorrect?'Corrigida na última tentativa':'Ainda errada na última tentativa'} · ${a?.attempts||0} tentativa(s)</small></div><button class="civil-btn" onclick="civil13Ui={stage:'errors13',index:${i}};localStorage.setItem(civil13StepOpenKey('errors13'),'1');renderSubjects()">Revisar</button></div>`}).join('');
 return `<section class="civil-step ${done?'done':''} ${open?'open':''}" data-step="errors13"><button class="civil-step-head" onclick="toggleCivil13Step('errors13')"><span class="civil-step-n">${done?'✓':'7'}</span><span class="civil-step-title"><b>Revisão de erros</b><small>Somente erros do Módulo 13.</small></span><span class="civil-step-status">${qs.length} no histórico · ${unresolved.length} ainda erradas</span><span>⌄</span></button>
 <div class="civil-step-body">${qs.length?`<div class="civil-error-list">${rows}</div>${civil13Ui.stage==='errors13'?`<div style="margin-top:9px">${civil13StageSession('errors13')}</div>`:''}`:'<div class="muted small">Nenhum erro registrado neste módulo ainda.</div>'}
 <label class="civil-manual-done"><input type="checkbox" ${done?'checked':''} onchange="civilSetModule('m13',{errorsReviewed:this.checked})"> Marcar minha revisão de erros como concluída</label></div></section>`
}
function civil13AnkiStep(){
 const id='anki13',m=civilModuleState('m13'),done=!!m.anki,open=localStorage.getItem(civil13StepOpenKey(id))==='1';
 const deck='04 DIREITO CIVIL::12 POSSE, PROPRIEDADE E DIREITOS REAIS';
 return `<section class="civil-step ${done?'done':''} ${open?'open':''}" data-step="anki13"><button class="civil-step-head" onclick="toggleCivil13Step('anki13')"><span class="civil-step-n">${done?'✓':'8'}</span><span class="civil-step-title"><b>Anki seletivo</b><small>Mesmo baralho, agora somente Propriedade e Condomínio.</small></span><span class="civil-step-status">${done?'Concluído':'Pendente'}</span><span>⌄</span></button>
 <div class="civil-step-body"><p class="civil-anki-note">Abra <b>12 POSSE, PROPRIEDADE E DIREITOS REAIS</b> e revise nesta rodada apenas os cartões de <b>Propriedade, Usucapião, Vizinhança, Condomínio e Propriedade Resolúvel/Fiduciária</b>. Ignore os cartões de superfície, servidão, usufruto, uso, habitação, laje e garantias reais: entram no Módulo 14.</p>
 <div class="civil-stage-actions" style="margin-top:9px"><button class="civil-btn primary" onclick="window.openAnkiDeck('${escJs(deck)}')">🧠 Abrir baralho existente</button></div>
 <label class="civil-manual-done"><input type="checkbox" ${done?'checked':''} onchange="civilSetModule('m13',{anki:this.checked})"> Marcar revisão no Anki como concluída</label></div></section>`
}
function renderCivilModule13(){
 const pct=civilModulePct('m13');
 return `<div class="civil-overall"><span style="width:${pct}%"></span></div><div class="civil-scope-note"><span class="civil-scope-badge mix">EDITAL + COMPLEMENTAR</span><b>Escopo fechado do Módulo 13:</b> Propriedade, aquisição e perda, usucapião, direitos de vizinhança, condomínio geral/edilício, multipropriedade em baixa prioridade e propriedade resolúvel/fiduciária. <b>Direitos reais sobre coisa alheia ficam para o Módulo 14.</b></div>
 <div class="civil-steps">
 ${civil13QuestionStep('diagnostic13','Diagnóstico FCC','10 questões reais antes da teoria.',1)}
 ${civil13ManualStep('reading13','Leitura orientada','CC 1.225-1.368-B, com fronteiras do módulo sinalizadas.',2,civil13ReadingBody(),'reading')}
 ${civil13ManualStep('theory13','Teoria nuclear','Propriedade, usucapião, vizinhança, condomínio e fiduciária.',3,civil13TheoryBody(),'theory')}
 ${civil13ManualStep('deep13','Aprofundamento e jurisprudência','Tema 985, STJ 2026 e atualizações legislativas de condomínio.',4,civil13DeepBody(),'deep')}
 ${civil13QuestionStep('cases13','Casos práticos','5 casos autorais de nível Analista/Oficial.',5)}
 ${civil13QuestionStep('final13','Bateria final FCC','15 questões FCC reais após a teoria.',6)}
 ${civil13ErrorStep()}
 ${civil13AnkiStep()}
 </div>`
}


let civil14Ui={stage:null,index:0};
function civil14StepOpenKey(id){return `central-v6:civil-step:m14:${id}`}
function civil14StageQuestions(stage){
 if(stage==='diagnostic14')return CIVIL_COURSE.diagnostic14||[];
 if(stage==='final14')return CIVIL_COURSE.final14||[];
 if(stage==='cases14')return CIVIL_COURSE.cases14||[];
 if(stage==='errors14'){
  const all=[...(CIVIL_COURSE.diagnostic14||[]),...(CIVIL_COURSE.cases14||[]),...(CIVIL_COURSE.final14||[])];
  return all.filter(q=>civilAnswer(q.id)?.everWrong);
 }
 return[];
}
function civil14StageDone(stage){
 const qs=civil14StageQuestions(stage);return qs.length>0&&qs.every(q=>(civilAnswer(q.id)?.attempts||0)>0)
}
function civil14Steps(){
 const m=civilModuleState('m14');
 return [
  {id:'diagnostic14',done:civil14StageDone('diagnostic14')},
  {id:'reading14',done:!!m.reading},
  {id:'theory14',done:!!m.theory},
  {id:'deep14',done:!!m.deep},
  {id:'cases14',done:civil14StageDone('cases14')},
  {id:'final14',done:civil14StageDone('final14')},
  {id:'errors14',done:!!m.errorsReviewed},
  {id:'anki14',done:!!m.anki}
 ]
}
function toggleCivil14Step(id){
 const el=document.querySelector(`.civil-module[data-civil="m14"] .civil-step[data-step="${id}"]`);if(!el)return;
 const open=!el.classList.contains('open');el.classList.toggle('open',open);localStorage.setItem(civil14StepOpenKey(id),open?'1':'0')
}
function civil14OpenStage(stage){
 const qs=civil14StageQuestions(stage);if(!qs.length){civil14Ui={stage,index:0};renderSubjects();return}
 let idx=qs.findIndex(q=>(civilAnswer(q.id)?.attempts||0)===0);if(idx<0)idx=0;
 civil14Ui={stage,index:idx};localStorage.setItem(civil14StepOpenKey(stage),'1');renderSubjects();
 setTimeout(()=>document.querySelector(`.civil-module[data-civil="m14"] .civil-step[data-step="${stage}"]`)?.scrollIntoView({behavior:'smooth',block:'center'}),20)
}
function civil14Select(id,letter){
 const st=civilState(),a=st.answers[id]||{attempts:0,history:[],everWrong:false};
 if(a.submitted)return;a.selected=letter;a.submitted=false;st.answers[id]=a;civilSave(st);renderSubjects()
}
function civil14Submit(id,stage){
 const q=[...(CIVIL_COURSE.diagnostic14||[]),...(CIVIL_COURSE.cases14||[]),...(CIVIL_COURSE.final14||[])].find(x=>x.id===id);
 if(!q)return;const st=civilState(),a=st.answers[id]||{attempts:0,history:[],everWrong:false};
 if(!a.selected){alert('Escolha uma alternativa primeiro.');return}
 const correct=a.selected===q.answer;
 a.attempts=(a.attempts||0)+1;a.submitted=true;a.lastCorrect=correct;a.everWrong=!!a.everWrong||!correct;
 a.history=[...(a.history||[]),{at:new Date().toISOString(),selected:a.selected,correct,stage,module:'m14'}];
 st.answers[id]=a;civilSave(st);renderAll()
}
function civil14Retry(id){const st=civilState(),a=st.answers[id];if(!a)return;a.selected=null;a.submitted=false;st.answers[id]=a;civilSave(st);renderSubjects()}
function civil14Move(stage,delta){
 const qs=civil14StageQuestions(stage);if(!qs.length)return;
 civil14Ui.stage=stage;civil14Ui.index=Math.max(0,Math.min(qs.length-1,civil14Ui.index+delta));renderSubjects()
}
function civil14Accuracy(stage){
 const qs=civil14StageQuestions(stage),answered=qs.map(q=>civilAnswer(q.id)).filter(a=>a?.attempts);
 const correct=answered.filter(a=>a.lastCorrect).length;
 return {answered:answered.length,total:qs.length,correct,pct:answered.length?Math.round(correct/answered.length*100):0}
}
function civil14QuestionMeta(q){
 const role=/Oficial de Justiça/i.test(q.source)?'Oficial de Justiça':/Analista|Defensor|Juiz|Procurador|Promotor|Tabelião|Registrador|AFFE/i.test(q.source)?'Nível superior / carreira jurídica':'Carreira jurídica';
 return `<div class="civil-qmeta"><span class="civil-chip real">${esc(q.bankLabel||'QUESTÃO REAL')}</span><span class="civil-chip role">${esc(role)}</span><span class="civil-chip">${esc(q.basis)}</span><span class="civil-qsource">${esc(q.source)}</span></div>`
}
function civil14QuestionCard(q,stage,index,total){
 const a=civilAnswer(q.id)||{selected:null,submitted:false,attempts:0,history:[]},locked=!!a.submitted;
 const opts=Object.entries(q.options).map(([letter,text])=>{
  let cls='civil-option';if(a.selected===letter)cls+=' selected';
  if(locked&&letter===q.answer)cls+=' correct';else if(locked&&a.selected===letter&&letter!==q.answer)cls+=' wrong';
  return `<button class="${cls}" ${locked?'disabled':''} onclick="civil14Select('${escJs(q.id)}','${letter}')"><span class="civil-letter">${letter}</span><span>${esc(text)}</span></button>`
 }).join('');
 const meta=q.kind==='real'?civil14QuestionMeta(q):`<div class="civil-qmeta"><span class="civil-chip authorial">AUTORAL</span><span class="civil-chip role">Nível Analista/Oficial</span><span class="civil-chip">${esc(q.basis)}</span><span class="civil-qsource">${esc(q.source)}</span></div>`;
 const feedback=locked?`<div class="civil-feedback ${a.lastCorrect?'good':'bad'}"><b>${a.lastCorrect?'✓ Resposta correta':'✕ Resposta incorreta — gabarito '+q.answer}</b>${esc(q.explanation)}<span class="basis">Fundamento: ${esc(q.basis)}${a.attempts>1?' · '+a.attempts+' tentativas':''}</span></div>`:'';
 const source=q.kind==='real'?(q.url?`<a class="civil-source-link" href="${escAttr(q.url)}" target="_blank" rel="noopener">Fonte da questão no TEC ↗</a>`:'<span class="muted small">Questão real recuperada dos PDFs enviados; origem identificada acima.</span>'):'<span class="muted small">Caso criado para aplicação da regra.</span>';
 return `<article class="civil-qcard">${meta}<h4>${esc(q.prompt)}</h4><div class="civil-options">${opts}</div>
 <div class="civil-submit-row"><div>${source}</div>
 <div class="civil-qnav"><button class="civil-btn" onclick="civil14Move('${stage}',-1)" ${index===0?'disabled':''}>←</button><span>${index+1} / ${total}</span><button class="civil-btn" onclick="civil14Move('${stage}',1)" ${index===total-1?'disabled':''}>→</button></div>
 ${locked?`<button class="civil-btn" onclick="civil14Retry('${escJs(q.id)}')">Refazer</button>`:`<button class="civil-btn primary" onclick="civil14Submit('${escJs(q.id)}','${stage}')">Responder</button>`}
 </div>${feedback}</article>`
}
function civil14StageSession(stage){
 const qs=civil14StageQuestions(stage);if(!qs.length)return '<div class="muted small">Nenhuma questão disponível.</div>';
 if(civil14Ui.stage!==stage)civil14Ui={stage,index:Math.max(0,qs.findIndex(q=>(civilAnswer(q.id)?.attempts||0)===0))};
 civil14Ui.index=Math.max(0,Math.min(qs.length-1,civil14Ui.index));
 return civil14QuestionCard(qs[civil14Ui.index],stage,civil14Ui.index,qs.length)
}
function civil14QuestionStep(stage,title,subtitle,num){
 const stats=civil14Accuracy(stage),done=civil14StageDone(stage),open=localStorage.getItem(civil14StepOpenKey(stage))==='1',active=civil14Ui.stage===stage;
 return `<section class="civil-step ${done?'done':''} ${open?'open':''}" data-step="${stage}">
 <button class="civil-step-head" onclick="toggleCivil14Step('${stage}')"><span class="civil-step-n">${done?'✓':num}</span><span class="civil-step-title"><b>${esc(title)}</b><small>${esc(subtitle)}</small></span><span class="civil-step-status">${stats.answered}/${stats.total} respondidas${stats.answered?' · '+stats.pct+'%':''}</span><span>⌄</span></button>
 <div class="civil-step-body"><div class="civil-stage-toolbar"><p>${stage==='diagnostic14'?'Dez questões reais, priorizando FCC e cargos de Analista/Oficial. Resolva antes da teoria.':stage==='final14'?'Quinze questões reais para fechar superfície, servidão, usufruto, habitação, laje, promessa e garantias reais.':'Casos autorais para as distinções mais cobradas em nível superior.'}</p><div class="civil-stage-actions"><button class="civil-btn primary" onclick="civil14OpenStage('${stage}')">${stats.answered?'Continuar':'Iniciar'}</button></div></div>${active?civil14StageSession(stage):''}</div></section>`
}
function civil14ManualStep(id,title,subtitle,num,body,field){
 const st=civilModuleState('m14'),done=!!st[field],open=localStorage.getItem(civil14StepOpenKey(id))==='1';
 return `<section class="civil-step ${done?'done':''} ${open?'open':''}" data-step="${id}">
 <button class="civil-step-head" onclick="toggleCivil14Step('${id}')"><span class="civil-step-n">${done?'✓':num}</span><span class="civil-step-title"><b>${esc(title)}</b><small>${esc(subtitle)}</small></span><span class="civil-step-status">${done?'Concluído':'Pendente'}</span><span>⌄</span></button>
 <div class="civil-step-body">${body}<label class="civil-manual-done"><input type="checkbox" ${done?'checked':''} onchange="civilSetModule('m14',{${field}:this.checked})"> Marcar esta etapa como concluída</label></div></section>`
}
function civil14ComplementReadingBody(){
 return `<div class="civil-theory"><section><h4>Leitura orientada — Módulo 14</h4><div class="civil-law-grid">
 <div class="civil-law-card"><b>CC, arts. 1.369 a 1.377</b><span>Direito de superfície.</span></div>
 <div class="civil-law-card"><b>CC, arts. 1.378 a 1.389</b><span>Servidões: constituição, exercício e extinção.</span></div>
 <div class="civil-law-card"><b>CC, arts. 1.390 a 1.411</b><span>Usufruto.</span></div>
 <div class="civil-law-card"><b>CC, arts. 1.412 a 1.416</b><span>Uso e habitação.</span></div>
 <div class="civil-law-card"><b>CC, arts. 1.417 a 1.418</b><span>Direito do promitente comprador.</span></div>
 <div class="civil-law-card"><b>CC, arts. 1.419 a 1.472</b><span>Garantias reais e penhor.</span></div>
 <div class="civil-law-card"><b>CC, arts. 1.473 a 1.505</b><span>Hipoteca.</span></div>
 <div class="civil-law-card"><b>CC, arts. 1.510-A a 1.510-E</b><span>Direito real de laje.</span></div>
 </div>
 <div class="civil-alert"><b>Complementos obrigatórios:</b> MP 2.220/2001 para concessão de uso especial para fins de moradia; Estatuto da Cidade, arts. 21-24, para superfície urbana; Lei de Registros Públicos, art. 216-B, para adjudicação compulsória extrajudicial.</div>
 <div class="civil-stage-actions"><button class="civil-btn primary" onclick="saveLast({civilModule:'m14',title:'Direito Civil • Módulo 14 • Direitos Reais',at:Date.now()});openVadeMecum(null,'cc')">📖 Abrir Código Civil no Vade Mecum</button></div></section></div>`
}
function civil14ComplementTheoryBody(){
 return `<div class="civil-theory">
 <section><h4>1. Direitos reais sobre coisa alheia — mapa</h4><p>O art. 1.225 apresenta rol legal de direitos reais. Neste módulo, o foco é separar <strong>gozo/fruição</strong>, <strong>aquisição</strong> e <strong>garantia</strong>.</p>
 <table class="civil-compare"><tr><th>Grupo</th><th>Exemplos</th></tr>
 <tr><td>Gozo / fruição</td><td>Superfície, servidões, usufruto, uso, habitação, laje e concessões reais.</td></tr>
 <tr><td>Aquisição</td><td>Direito do promitente comprador do imóvel.</td></tr>
 <tr><td>Garantia</td><td>Penhor e hipoteca.</td></tr></table></section>

 <section><h4>2. Superfície — Código Civil</h4><p>O proprietário pode conceder a outrem o direito de construir ou plantar em seu terreno, por <strong>tempo determinado</strong>, mediante escritura pública registrada.</p><ul><li>Subsolo: não autorizado, salvo se inerente ao objeto da concessão.</li><li>Pode ser gratuita ou onerosa.</li><li>Superficiário responde pelos encargos e tributos incidentes.</li><li>Direito pode transferir-se a terceiros e aos herdeiros.</li><li>Há preferência recíproca na alienação do imóvel ou do direito de superfície.</li><li>Extinta a superfície, o proprietário recupera a plenitude sobre terreno e construção/plantação, salvo estipulação indenizatória contrária.</li></ul></section>

 <section><h4>3. Superfície — Código Civil × Estatuto da Cidade</h4><table class="civil-compare"><tr><th>Código Civil</th><th>Estatuto da Cidade</th></tr>
 <tr><td>Tempo determinado.</td><td>Superfície urbana por tempo determinado ou indeterminado.</td></tr>
 <tr><td>Subsolo só se inerente ao objeto.</td><td>Pode abranger solo, subsolo e espaço aéreo conforme contrato e legislação urbanística.</td></tr>
 <tr><td>Escritura pública + registro.</td><td>Escritura pública + registro.</td></tr></table>
 <div class="civil-alert">Questão avançada costuma explorar a coexistência dos dois regimes; não transplante uma regra de um diploma para o outro sem observar o contexto.</div></section>

 <section><h4>4. Servidão predial</h4><p>A servidão proporciona utilidade ao <strong>prédio dominante</strong> e grava o <strong>prédio serviente</strong>, pertencente a outro dono. Constitui-se por declaração expressa dos proprietários ou testamento + registro.</p><div class="civil-alert">Passagem forçada é direito de vizinhança legal; servidão de passagem é direito real sobre coisa alheia. Não são sinônimos.</div></section>

 <section><h4>5. Usucapião de servidão</h4><p>Servidão <strong>aparente</strong> exercida de forma contínua e incontestada pode ser usucapida: 10 anos nas condições do art. 1.242; sem título, o art. 1.379 prevê 20 anos. Servidão não aparente não se adquire pela prescrição aquisitiva.</p></section>

 <section><h4>6. Exercício e indivisibilidade da servidão</h4><ul><li>O dono do prédio dominante pode realizar obras necessárias à conservação/uso.</li><li>A servidão deve ser exercida civiliter, sem agravar inutilmente o prédio serviente.</li><li>Constituída para certo fim, não pode ampliar-se para outro.</li><li>Necessidade de maior largueza por cultura/indústria pode ser imposta com indenização pelo excesso.</li><li>É indivisível e acompanha a divisão dos prédios, salvo restrição natural/destinacional.</li></ul></section>

 <section><h4>7. Extinção da servidão</h4><p>Entre as causas: renúncia, cessação da utilidade, resgate, reunião dos prédios na mesma pessoa, supressão das obras por título expresso e <strong>não uso por 10 anos contínuos</strong>. Em regra, perante terceiros, o cancelamento registral é central.</p></section>

 <section><h4>8. Usufruto — conteúdo</h4><p>Pode recair sobre bens móveis/imóveis, patrimônio ou quota, abrangendo frutos e utilidades. Usufrutuário possui <strong>posse, uso, administração e percepção dos frutos</strong>.</p><p>Usufruto imobiliário, quando não decorre de usucapião, constitui-se pelo registro no RI.</p></section>

 <section><h4>9. Inalienabilidade do usufruto</h4><p>O <strong>direito de usufruto não pode ser alienado</strong>, mas seu exercício pode ser cedido gratuita ou onerosamente. É distinção clássica de prova.</p></section>

 <section><h4>10. Direitos e deveres do usufrutuário</h4><ul><li>Pode fruir pessoalmente ou arrendar, sem alterar destinação econômica sem autorização.</li><li>Inventaria os bens e presta caução se exigida, ressalvada a hipótese legal do doador que reserva usufruto.</li><li>Suporta despesas ordinárias de conservação e tributos ligados à posse/rendimento.</li><li>Reparações extraordinárias incumbem ao proprietário nos termos legais.</li></ul></section>

 <section><h4>11. Extinção do usufruto e direito de acrescer</h4><p>Extingue-se, entre outras hipóteses, por renúncia, morte do usufrutuário, termo, cessação do motivo, destruição e não uso/não fruição. Havendo dois usufrutuários, a parte do falecido se extingue, <strong>salvo estipulação expressa de acrescer</strong> ao sobrevivente.</p></section>

 <section><h4>12. Uso</h4><p>O usuário usa a coisa e percebe seus frutos apenas na medida das necessidades próprias e da família. Aplicam-se subsidiariamente as regras do usufruto no que forem compatíveis.</p></section>

 <section><h4>13. Habitação</h4><p>É o direito de <strong>habitar gratuitamente casa alheia</strong>. O titular não pode alugá-la nem emprestá-la; ocupa-a com sua família. Se conferido a várias pessoas, quem habita sozinho não paga aluguel às demais, mas não pode impedir que também exerçam o direito.</p></section>

 <section><h4>14. Concessão de uso especial para fins de moradia — CUEM</h4><p>É direito real do art. 1.225, XI, disciplinado materialmente pela MP 2.220/2001. Não é usucapião de bem público.</p><ul><li>Requisito temporal histórico: posse qualificada por 5 anos preenchida até 22/12/2016.</li><li>Até 250 m², imóvel público com características/finalidade urbanas, moradia própria/familiar.</li><li>Não ser proprietário ou concessionário de outro imóvel urbano ou rural.</li><li>Título administrativo ou judicial é registrável.</li><li>É transferível inter vivos e causa mortis.</li><li>Extingue-se, entre outras hipóteses, por destinação diversa da moradia ou aquisição de outro imóvel/concessão.</li></ul></section>

 <section><h4>15. Laje</h4><p>O proprietário da construção-base pode ceder sua superfície superior ou inferior para unidade distinta. A laje é <strong>unidade imobiliária autônoma, com matrícula própria</strong>.</p><ul><li>Não atribui fração ideal do terreno.</li><li>Titular pode usar, gozar e dispor.</li><li>Há rateio legal de despesas das partes que sirvam a todo o edifício.</li><li>Alienação de unidade sobreposta aciona direito de preferência na ordem do art. 1.510-D.</li><li>Admite laje sucessiva com autorizações legais.</li></ul></section>

 <section><h4>16. Superfície × laje</h4><table class="civil-compare"><tr><th>Superfície</th><th>Laje</th></tr>
 <tr><td>Direito de construir/plantar no terreno alheio.</td><td>Unidade autônoma sobre/sub construção-base.</td></tr>
 <tr><td>Concessão temporária no CC.</td><td>Nova unidade imobiliária autônoma.</td></tr>
 <tr><td>Não é fração ideal do terreno.</td><td>Também não atribui fração ideal do terreno.</td></tr></table></section>

 <section><h4>17. Promessa de compra e venda: três planos</h4><table class="civil-compare"><tr><th>Plano</th><th>Regra</th></tr>
 <tr><td>Contrato obrigacional</td><td>Pode existir e ser válido sem registro.</td></tr>
 <tr><td>Direito real de aquisição</td><td>Promessa sem arrependimento + instrumento público/particular + registro — art. 1.417.</td></tr>
 <tr><td>Adjudicação compulsória</td><td>Não depende do registro do compromisso — Súmula 239/STJ — mas exige os demais pressupostos, especialmente quitação.</td></tr></table></section>

 <section><h4>18. Adjudicação compulsória judicial e extrajudicial</h4><p>Judicialmente, a sentença supre a declaração de vontade do vendedor. Desde a Lei 14.382/2022, a Lei de Registros Públicos também admite <strong>adjudicação compulsória extrajudicial</strong> no Registro de Imóveis, art. 216-B.</p><div class="civil-alert">O próprio art. 216-B prevê que o deferimento extrajudicial independe de prévio registro da promessa/cessão.</div></section>

 <section><h4>19. Garantias reais — princípios</h4><ul><li>O bem fica vinculado ao cumprimento da obrigação.</li><li>Somente quem pode alienar pode empenhar/hipotecar; propriedade superveniente pode tornar eficaz a garantia desde o registro.</li><li>Garantia é, em regra, indivisível: pagamento parcial não libera proporcionalmente o bem salvo previsão no título/quitação.</li><li>Credor real possui preferência conforme as regras legais.</li><li>É nula cláusula que autoriza o credor a ficar automaticamente com o bem por inadimplemento; depois do vencimento, pode haver dação em pagamento voluntária.</li></ul></section>

 <section><h4>20. Penhor</h4><p>Em regra, constitui-se pela <strong>transferência efetiva da posse</strong> de coisa móvel alienável ao credor ou representante. No penhor rural, industrial, mercantil e de veículos, a coisa permanece com o devedor.</p><p>O instrumento deve ser registrado. O Código disciplina penhor comum, rural, industrial/mercantil, direitos e títulos de crédito, veículos e penhor legal.</p></section>

 <section><h4>21. Credor pignoratício</h4><p>Tem, entre outros direitos, posse da coisa, retenção por despesas justificadas, execução/venda nas hipóteses legais e apropriação dos frutos para imputação. Como depositário, responde por perda/deterioração culposa e deve restituir a coisa após o pagamento.</p></section>

 <section><h4>22. Hipoteca não é “só imóvel”</h4><p>O art. 1.473 permite hipotecar imóveis e acessórios, domínio direto/útil, estradas de ferro, certos recursos naturais, navios, aeronaves, CUEM, direito real de uso, propriedade superficiária e outros direitos previstos na redação atual.</p><div class="civil-alert">Pegadinha: navios e aeronaves podem ser hipotecados, apesar de serem bens móveis para vários efeitos.</div></section>

 <section><h4>23. Hipoteca: extensão e alienação</h4><ul><li>Abrange acessões, melhoramentos e construções.</li><li>É nula cláusula que proíbe alienar imóvel hipotecado, embora se possa convencionar vencimento do crédito se alienado.</li><li>O dono pode constituir outra hipoteca sobre o mesmo imóvel.</li></ul></section>

 <section><h4>24. Hipotecas sucessivas — atualização</h4><p>A Lei 14.711/2023 atualizou arts. 1.477 e 1.478: mantém a possibilidade de hipotecas posteriores e introduz disciplina atual sobre vencimento de obrigações garantidas pelo mesmo imóvel e sub-rogação do credor hipotecário que paga garantias anteriores.</p></section>

 <section><h4>25. Saldo após excussão</h4><p>Se o produto da excussão do penhor ou execução da hipoteca for insuficiente para dívida e despesas judiciais, o devedor continua <strong>pessoalmente obrigado</strong> pelo restante.</p></section>
 </div>`
}
function civil14ComplementDeepBody(){
 return `<div class="civil-theory">
 <section class="civil-juris"><h4>Súmula 239/STJ — registro × adjudicação</h4><p>O direito à adjudicação compulsória <strong>não se condiciona ao registro</strong> do compromisso de compra e venda. Isso não elimina a exigência de registro para constituir o direito real de aquisição previsto no art. 1.417.</p></section>

 <section class="civil-juris"><h4>STJ 2025 — adjudicação exige quitação integral</h4><p>No REsp 2.207.433/SP, o STJ afastou a teoria do adimplemento substancial na adjudicação compulsória. Mesmo que poucas parcelas estejam pendentes e a pretensão de cobrá-las tenha prescrito, isso não equivale à quitação integral do preço.</p></section>

 <section class="civil-juris"><h4>STJ 2026 — adjudicação e perdas e danos</h4><p>No Informativo 893/2026, o STJ reafirmou a imprescritibilidade da pretensão de adjudicação compulsória e estendeu essa característica à pretensão de perdas e danos quando a tutela específica se tornar impossível.</p></section>

 <section class="civil-juris"><h4>STJ 2025 — direito real de habitação</h4><p>Em 2025, a Terceira Turma reafirmou que o direito real de habitação do cônjuge/companheiro sobrevivente, enquanto perdurar, impede extinção do condomínio e alienação judicial do imóvel atingido. O direito é gratuito, vitalício e personalíssimo no contexto sucessório.</p><div class="civil-alert">Essa jurisprudência dialoga com o instituto geral da habitação, mas o direito sucessório do cônjuge será retomado no Módulo 16.</div></section>

 <section class="civil-juris"><h4>Tema 1.261/STJ — hipoteca e bem de família</h4><p>O STJ fixou em 2025 critérios para a exceção à impenhorabilidade do bem de família oferecido em hipoteca por sócio em dívida de pessoa jurídica, com foco no benefício revertido à entidade familiar e distribuição do ônus probatório.</p></section>

 <section><h4>Mapa de pegadinhas</h4><table class="civil-compare"><tr><th>Pegadinha</th><th>Regra correta</th></tr>
 <tr><td>Superfície sempre autoriza subsolo.</td><td>No CC, só se inerente ao objeto.</td></tr>
 <tr><td>Superfície só pode ser onerosa.</td><td>Pode ser gratuita ou onerosa.</td></tr>
 <tr><td>Servidão = passagem forçada.</td><td>Institutos distintos.</td></tr>
 <tr><td>Servidão é divisível.</td><td>É indivisível, art. 1.386.</td></tr>
 <tr><td>Servidão não pode nascer por testamento.</td><td>Pode, com registro.</td></tr>
 <tr><td>Qualquer servidão é usucapível.</td><td>O CC trata da servidão aparente.</td></tr>
 <tr><td>Usufruto pode ser vendido.</td><td>Não; seu exercício pode ser cedido.</td></tr>
 <tr><td>Uso não permite colher frutos.</td><td>Permite na medida das necessidades do usuário/família.</td></tr>
 <tr><td>Habitação permite aluguel.</td><td>Não.</td></tr>
 <tr><td>CUEM é usucapião de bem público.</td><td>Não; é concessão real especial.</td></tr>
 <tr><td>Laje só existe acima da construção.</td><td>Pode ser superior ou inferior.</td></tr>
 <tr><td>Laje dá fração ideal do terreno.</td><td>Não.</td></tr>
 <tr><td>Sem registro, promessa gera direito real do art. 1.417.</td><td>Não.</td></tr>
 <tr><td>Sem registro, adjudicação é impossível.</td><td>Não; Súmula 239/STJ.</td></tr>
 <tr><td>Adimplemento substancial basta à adjudicação.</td><td>Não; exige quitação integral.</td></tr>
 <tr><td>Adjudicação só pode ser judicial.</td><td>Existe via extrajudicial, LRP 216-B.</td></tr>
 <tr><td>Penhor transfere propriedade.</td><td>Não; em regra, transfere posse.</td></tr>
 <tr><td>Todo penhor exige perda da posse do devedor.</td><td>Há exceções legais.</td></tr>
 <tr><td>Hipoteca só recai sobre imóvel.</td><td>Navios e aeronaves também podem ser objeto.</td></tr>
 <tr><td>Imóvel hipotecado não pode receber nova hipoteca.</td><td>Pode.</td></tr>
 <tr><td>Pagamento parcial libera parte proporcional da garantia.</td><td>Não em regra.</td></tr>
 <tr><td>Excussão insuficiente extingue o saldo.</td><td>Devedor continua pessoalmente obrigado.</td></tr></table></section>
 </div>`
}

function civil14ReadingBody(){
 return `<div class="civil-theory">
 <section><h4>Leitura orientada — Fechamento II</h4><div class="civil-law-grid">
  <div class="civil-law-card"><b>CDC — Lei 8.078/1990</b><span>Princípios, responsabilidade por fato/vício, prazos, desconsideração, práticas, contratos, superendividamento e tutela coletiva.</span></div>
  <div class="civil-law-card"><b>Lei 6.015/1973</b><span>Estrutura dos registros públicos, registro civil, retificação e noções de registro de imóveis.</span></div>
  <div class="civil-law-card"><b>Lei 10.741/2003</b><span>Estatuto da Pessoa Idosa: proteção integral, saúde, alimentos, transporte, medidas e acesso à justiça.</span></div>
  <div class="civil-law-card"><b>CC, arts. 1.728 a 1.783-A</b><span>Tutela, curatela e tomada de decisão apoiada.</span></div>
  <div class="civil-law-card"><b>STF/STJ — painel de precedentes</b><span>Repercussão geral e repetitivos civis tratados no curso, com status consolidado.</span></div>
 </div>
 <div class="civil-alert"><b>Prioridade EDITAL:</b> este módulo substitui como trilha principal o antigo bloco de direitos reais sobre coisa alheia, que foi mantido apenas como aprofundamento.</div></section>
 </div>`
}
function civil14TheoryBody(){
 return `<div class="civil-theory">
 <section><h4>1. CDC — mapa de prova</h4><p>O item de legislação especial exige visão sistemática. Priorize consumidor/fornecedor, direitos básicos, responsabilidade, práticas e contratos.</p></section>
 <section><h4>2. Fato × vício</h4><table class="civil-compare"><tr><th>Fato do produto/serviço</th><th>Vício do produto/serviço</th></tr>
 <tr><td>Acidente de consumo: defeito extrapola a coisa/serviço e causa dano.</td><td>Inadequação de qualidade/quantidade que torna produto/serviço impróprio ou diminui valor.</td></tr>
 <tr><td>Responsabilidade nos arts. 12 a 17.</td><td>Responsabilidade nos arts. 18 a 25.</td></tr></table></section>
 <section><h4>3. Vício — regra dos 30 dias</h4><p>Em regra, o fornecedor tem 30 dias para sanar o vício. Não sanado, o consumidor pode escolher as soluções legais. O prazo pode ser ajustado dentro dos limites do CDC nas hipóteses permitidas.</p></section>
 <section><h4>4. Decadência × prescrição</h4><p>Vícios aparentes/de fácil constatação: decadência do art. 26; vício oculto inicia a contagem quando fica evidenciado. Reparação por danos decorrentes de fato do produto/serviço: prescrição de 5 anos do art. 27.</p></section>
 <section><h4>5. Práticas e proteção contratual</h4><p>Estude oferta vinculante, publicidade enganosa/abusiva, cobrança, cadastros, práticas abusivas, interpretação favorável ao consumidor e nulidade das cláusulas abusivas.</p></section>
 <section><h4>6. Superendividamento</h4><p>A Lei 14.181/2021 introduziu crédito responsável, prevenção do superendividamento, proteção do mínimo existencial e mecanismos de conciliação.</p></section>
 <section><h4>7. Tutela coletiva no CDC</h4><p>Diferencie interesses <strong>difusos, coletivos em sentido estrito e individuais homogêneos</strong>, além de legitimação, competência e efeitos da coisa julgada coletiva.</p></section>

 <section><h4>8. Lei de Registros Públicos — arquitetura</h4><p>A LRP disciplina registros destinados à autenticidade, segurança e eficácia dos atos jurídicos. Para este edital, priorize:</p><ul><li>registro civil de pessoas naturais: nascimento, casamento, óbito e alterações;</li><li>retificações, restaurações e suprimentos;</li><li>princípios básicos do registro imobiliário: prioridade, continuidade, especialidade e publicidade;</li><li>procedimentos administrativos incorporados por reformas recentes.</li></ul></section>

 <section><h4>9. Estatuto da Pessoa Idosa</h4><p>Pessoa idosa é quem tem <strong>60 anos ou mais</strong>. O Estatuto adota proteção integral e prioridade, com capítulos sobre vida, saúde, alimentos, educação/cultura, trabalho, assistência, habitação, transporte, medidas de proteção, política de atendimento e acesso à justiça.</p></section>

 <section><h4>10. Tutela</h4><p>Destina-se ao menor que não esteja sob poder familiar nas hipóteses legais. O Código disciplina ordem de nomeação, escusa, exercício, prestação de contas, responsabilidade e atos dependentes de autorização judicial.</p></section>
 <section><h4>11. Curatela</h4><p>No regime pós-LBI, a curatela é <strong>medida extraordinária e proporcional</strong>. A deficiência não implica incapacidade civil automática; a sentença deve definir limites concretos e, como regra, a curatela incide sobre atos patrimoniais e negociais.</p></section>
 <section><h4>12. Tomada de decisão apoiada</h4><p>A pessoa com deficiência escolhe pelo menos <strong>duas pessoas idôneas</strong> de sua confiança. O apoio fornece elementos para a decisão, mas não substitui a vontade da pessoa apoiada.</p></section>

 <section><h4>13. Painel STF — repercussão geral civil</h4><table class="civil-compare">
 <tr><th>Tema</th><th>Núcleo</th></tr>
 <tr><td>622</td><td>Paternidade socioafetiva não impede vínculo biológico concomitante com efeitos próprios.</td></tr>
 <tr><td>809</td><td>Regime sucessório do art. 1.829 também se aplica à união estável.</td></tr>
 <tr><td>1.053</td><td>Separação judicial não é requisito do divórcio nem subsiste como figura autônoma após EC 66/2010.</td></tr>
 <tr><td>1.236</td><td>Maiores de 70 anos podem afastar a separação legal mediante manifestação expressa.</td></tr>
 <tr><td>529</td><td>Preexistência de casamento/união estável impede novo vínculo concomitante no mesmo período, ressalvada a exceção legal.</td></tr>
 </table></section>
 <section><h4>14. Painel STJ — repetitivos civis</h4><table class="civil-compare">
 <tr><th>Tema</th><th>Núcleo</th></tr>
 <tr><td>985</td><td>Lote mínimo municipal não impede usucapião extraordinária se preenchidos seus requisitos.</td></tr>
 <tr><td>1.200</td><td>Petição de herança: prescrição conta da abertura da sucessão; ação de filiação não suspende/interrompe.</td></tr>
 <tr><td>1.261</td><td>Hipoteca de bem de família por dívida de pessoa jurídica: critérios de benefício familiar e distribuição do ônus da prova.</td></tr>
 </table><div class="civil-alert"><b>Atualização jurisprudencial:</b> painel conferido em 17/08/2026. Como o edital cobra jurisprudência de forma aberta, este bloco deve ser revisitado perto da prova.</div></section>
 </div>`
}
function civil14DeepBody(){
 return `<div class="civil-theory">
 <section><h4>Checklist final de legislação especial</h4><table class="civil-compare">
 <tr><th>Diploma</th><th>O que não pode faltar</th></tr>
 <tr><td>CDC</td><td>Fato/vício, prazos, desconsideração, oferta/publicidade, cláusulas abusivas, superendividamento e tutela coletiva.</td></tr>
 <tr><td>LRP</td><td>Nascimento/casamento/óbito, retificações e princípios do registro imobiliário.</td></tr>
 <tr><td>Pessoa Idosa</td><td>Conceito 60+, prioridades, saúde, alimentos, transporte, medidas protetivas e acesso à justiça.</td></tr>
 <tr><td>Família residual</td><td>Tutela, curatela e tomada de decisão apoiada.</td></tr>
 <tr><td>Jurisprudência</td><td>Temas STF/STJ já mapeados no curso + atualização próxima à prova.</td></tr>
 </table></section>
 <details class="civil-complement"><summary><b>COMPLEMENTAR — antigo Módulo 14: direitos reais sobre coisa alheia</b></summary>
 <div class="civil-alert">Superfície, servidões, usufruto, uso, habitação, laje, promitente comprador, penhor e hipoteca foram mantidos para preparação ampla de Analista/Oficial, mas não são prioridade no edital verticalizado usado no mapa de cobertura.</div>
 ${civil14ComplementReadingBody()}
 ${civil14ComplementTheoryBody()}
 ${civil14ComplementDeepBody()}
 </details>
 </div>`
}
function civil14AnkiStep(){
 const id='anki14',m=civilModuleState('m14'),done=!!m.anki,open=localStorage.getItem(civil14StepOpenKey(id))==='1';
 const deck='04 DIREITO CIVIL::15 LEGISLAÇÃO CIVIL ESPECIAL E ATUALIZAÇÕES';
 return `<section class="civil-step ${done?'done':''} ${open?'open':''}" data-step="anki14"><button class="civil-step-head" onclick="toggleCivil14Step('anki14')"><span class="civil-step-n">${done?'✓':'8'}</span><span class="civil-step-title"><b>Anki seletivo</b><small>Legislação civil especial e atualização.</small></span><span class="civil-step-status">${done?'Concluído':'Pendente'}</span><span>⌄</span></button>
 <div class="civil-step-body"><p class="civil-anki-note">Priorize CDC, LRP, Estatuto da Pessoa Idosa e jurisprudência civil. Para tutela/curatela/TDA, use também os cartões de Direito de Família já existentes.</p>
 <div class="civil-stage-actions"><button class="civil-btn primary" onclick="window.openAnkiDeck('${escJs(deck)}')">🧠 Abrir legislação especial</button></div>
 <label class="civil-manual-done"><input type="checkbox" ${done?'checked':''} onchange="civilSetModule('m14',{anki:this.checked})"> Marcar revisão no Anki como concluída</label></div></section>`
}

function civil14ErrorStep(){
 const id='errors14',m=civilModuleState('m14'),done=!!m.errorsReviewed,open=localStorage.getItem(civil14StepOpenKey(id))==='1';
 const qs=civil14StageQuestions('errors14'),unresolved=qs.filter(q=>civilAnswer(q.id)?.lastCorrect===false);
 const rows=qs.map((q,i)=>{const a=civilAnswer(q.id);return `<div class="civil-error-row"><div><b>${q.kind==='real'?'Real':'Autoral'} • ${esc(q.subject)}</b><small>${a?.lastCorrect?'Corrigida na última tentativa':'Ainda errada na última tentativa'} · ${a?.attempts||0} tentativa(s)</small></div><button class="civil-btn" onclick="civil14Ui={stage:'errors14',index:${i}};localStorage.setItem(civil14StepOpenKey('errors14'),'1');renderSubjects()">Revisar</button></div>`}).join('');
 return `<section class="civil-step ${done?'done':''} ${open?'open':''}" data-step="errors14"><button class="civil-step-head" onclick="toggleCivil14Step('errors14')"><span class="civil-step-n">${done?'✓':'7'}</span><span class="civil-step-title"><b>Revisão de erros</b><small>Somente erros do Módulo 14.</small></span><span class="civil-step-status">${qs.length} no histórico · ${unresolved.length} ainda erradas</span><span>⌄</span></button>
 <div class="civil-step-body">${qs.length?`<div class="civil-error-list">${rows}</div>${civil14Ui.stage==='errors14'?`<div style="margin-top:9px">${civil14StageSession('errors14')}</div>`:''}`:'<div class="muted small">Nenhum erro registrado neste módulo ainda.</div>'}
 <label class="civil-manual-done"><input type="checkbox" ${done?'checked':''} onchange="civilSetModule('m14',{errorsReviewed:this.checked})"> Marcar minha revisão de erros como concluída</label></div></section>`
}
function civil14ComplementAnkiStep(){
 const id='anki14',m=civilModuleState('m14'),done=!!m.anki,open=localStorage.getItem(civil14StepOpenKey(id))==='1';
 const deck='04 DIREITO CIVIL::12 POSSE, PROPRIEDADE E DIREITOS REAIS';
 return `<section class="civil-step ${done?'done':''} ${open?'open':''}" data-step="anki14"><button class="civil-step-head" onclick="toggleCivil14Step('anki14')"><span class="civil-step-n">${done?'✓':'8'}</span><span class="civil-step-title"><b>Anki seletivo</b><small>Última rodada do baralho de Direitos Reais.</small></span><span class="civil-step-status">${done?'Concluído':'Pendente'}</span><span>⌄</span></button>
 <div class="civil-step-body"><p class="civil-anki-note">Abra <b>12 POSSE, PROPRIEDADE E DIREITOS REAIS</b> e revise somente cartões de <b>superfície, servidão, usufruto, uso, habitação, laje, promitente comprador, penhor e hipoteca</b>. Posse e propriedade já foram trabalhadas nos Módulos 12 e 13.</p>
 <div class="civil-stage-actions" style="margin-top:9px"><button class="civil-btn primary" onclick="window.openAnkiDeck('${escJs(deck)}')">🧠 Abrir baralho existente</button></div>
 <label class="civil-manual-done"><input type="checkbox" ${done?'checked':''} onchange="civilSetModule('m14',{anki:this.checked})"> Marcar revisão no Anki como concluída</label></div></section>`
}
function renderCivilModule14(){
 const pct=civilModulePct('m14');
 return `<div class="civil-overall"><span style="width:${pct}%"></span></div><div class="civil-scope-note"><span class="civil-scope-badge edital">EDITAL</span><b>Fechamento do Edital II:</b> Código de Defesa do Consumidor, Lei de Registros Públicos, Estatuto da Pessoa Idosa, tutela/curatela/tomada de decisão apoiada e painel de jurisprudência civil STF/STJ. <b>O antigo conteúdo de direitos reais permanece como complementar.</b></div>
 <div class="civil-steps">
 ${civil14QuestionStep('diagnostic14','Diagnóstico FCC — legislação especial','10 questões reais FCC de CDC, LRP e Pessoa Idosa.',1)}
 ${civil14ManualStep('reading14','Leitura orientada','CDC + LRP + Pessoa Idosa + família residual + jurisprudência.',2,civil14ReadingBody(),'reading')}
 ${civil14ManualStep('theory14','Teoria nuclear','Fechamento sistemático dos itens especiais do edital.',3,civil14TheoryBody(),'theory')}
 ${civil14ManualStep('deep14','Aprofundamento e complementar','Checklist final + antigo conteúdo de direitos reais preservado.',4,civil14DeepBody(),'deep')}
 ${civil14QuestionStep('cases14','Casos práticos','5 casos autorais orientados ao edital.',5)}
 ${civil14QuestionStep('final14','Bateria final FCC','15 questões reais FCC, incluindo curatela/TDA.',6)}
 ${civil14ErrorStep()}
 ${civil14AnkiStep()}
 </div>`
}


let civil15Ui={stage:null,index:0};
function civil15StepOpenKey(id){return `central-v6:civil-step:m15:${id}`}
function civil15StageQuestions(stage){
 if(stage==='diagnostic15')return CIVIL_COURSE.diagnostic15||[];
 if(stage==='final15')return CIVIL_COURSE.final15||[];
 if(stage==='cases15')return CIVIL_COURSE.cases15||[];
 if(stage==='errors15'){
  const all=[...(CIVIL_COURSE.diagnostic15||[]),...(CIVIL_COURSE.cases15||[]),...(CIVIL_COURSE.final15||[])];
  return all.filter(q=>civilAnswer(q.id)?.everWrong);
 }
 return[];
}
function civil15StageDone(stage){
 const qs=civil15StageQuestions(stage);return qs.length>0&&qs.every(q=>(civilAnswer(q.id)?.attempts||0)>0)
}
function civil15Steps(){
 const m=civilModuleState('m15');
 return [
  {id:'diagnostic15',done:civil15StageDone('diagnostic15')},
  {id:'reading15',done:!!m.reading},
  {id:'theory15',done:!!m.theory},
  {id:'deep15',done:!!m.deep},
  {id:'cases15',done:civil15StageDone('cases15')},
  {id:'final15',done:civil15StageDone('final15')},
  {id:'errors15',done:!!m.errorsReviewed},
  {id:'anki15',done:!!m.anki}
 ]
}
function toggleCivil15Step(id){
 const el=document.querySelector(`.civil-module[data-civil="m15"] .civil-step[data-step="${id}"]`);if(!el)return;
 const open=!el.classList.contains('open');el.classList.toggle('open',open);localStorage.setItem(civil15StepOpenKey(id),open?'1':'0')
}
function civil15OpenStage(stage){
 const qs=civil15StageQuestions(stage);if(!qs.length){civil15Ui={stage,index:0};renderSubjects();return}
 let idx=qs.findIndex(q=>(civilAnswer(q.id)?.attempts||0)===0);if(idx<0)idx=0;
 civil15Ui={stage,index:idx};localStorage.setItem(civil15StepOpenKey(stage),'1');renderSubjects();
 setTimeout(()=>document.querySelector(`.civil-module[data-civil="m15"] .civil-step[data-step="${stage}"]`)?.scrollIntoView({behavior:'smooth',block:'center'}),20)
}
function civil15Select(id,letter){
 const st=civilState(),a=st.answers[id]||{attempts:0,history:[],everWrong:false};
 if(a.submitted)return;a.selected=letter;a.submitted=false;st.answers[id]=a;civilSave(st);renderSubjects()
}
function civil15Submit(id,stage){
 const q=[...(CIVIL_COURSE.diagnostic15||[]),...(CIVIL_COURSE.cases15||[]),...(CIVIL_COURSE.final15||[])].find(x=>x.id===id);
 if(!q)return;const st=civilState(),a=st.answers[id]||{attempts:0,history:[],everWrong:false};
 if(!a.selected){alert('Escolha uma alternativa primeiro.');return}
 const correct=a.selected===q.answer;
 a.attempts=(a.attempts||0)+1;a.submitted=true;a.lastCorrect=correct;a.everWrong=!!a.everWrong||!correct;
 a.history=[...(a.history||[]),{at:new Date().toISOString(),selected:a.selected,correct,stage,module:'m15'}];
 st.answers[id]=a;civilSave(st);renderAll()
}
function civil15Retry(id){const st=civilState(),a=st.answers[id];if(!a)return;a.selected=null;a.submitted=false;st.answers[id]=a;civilSave(st);renderSubjects()}
function civil15Move(stage,delta){
 const qs=civil15StageQuestions(stage);if(!qs.length)return;
 civil15Ui.stage=stage;civil15Ui.index=Math.max(0,Math.min(qs.length-1,civil15Ui.index+delta));renderSubjects()
}
function civil15Accuracy(stage){
 const qs=civil15StageQuestions(stage),answered=qs.map(q=>civilAnswer(q.id)).filter(a=>a?.attempts);
 const correct=answered.filter(a=>a.lastCorrect).length;
 return {answered:answered.length,total:qs.length,correct,pct:answered.length?Math.round(correct/answered.length*100):0}
}
function civil15QuestionMeta(q){
 const role=/Oficial de Justiça/i.test(q.source)?'Oficial de Justiça':/Analista|Defensor|Juiz|Procurador|Promotor|Adv|AFFE/i.test(q.source)?'Nível superior / carreira jurídica':'Carreira jurídica';
 return `<div class="civil-qmeta"><span class="civil-chip real">${esc(q.bankLabel||'QUESTÃO REAL FCC')}</span><span class="civil-chip role">${esc(role)}</span><span class="civil-chip">${esc(q.basis)}</span><span class="civil-qsource">${esc(q.source)}</span></div>`
}
function civil15QuestionCard(q,stage,index,total){
 const a=civilAnswer(q.id)||{selected:null,submitted:false,attempts:0,history:[]},locked=!!a.submitted;
 const opts=Object.entries(q.options).map(([letter,text])=>{
  let cls='civil-option';if(a.selected===letter)cls+=' selected';
  if(locked&&letter===q.answer)cls+=' correct';else if(locked&&a.selected===letter&&letter!==q.answer)cls+=' wrong';
  return `<button class="${cls}" ${locked?'disabled':''} onclick="civil15Select('${escJs(q.id)}','${letter}')"><span class="civil-letter">${letter}</span><span>${esc(text)}</span></button>`
 }).join('');
 const meta=q.kind==='real'?civil15QuestionMeta(q):`<div class="civil-qmeta"><span class="civil-chip authorial">AUTORAL</span><span class="civil-chip role">Nível Analista/Oficial</span><span class="civil-chip">${esc(q.basis)}</span><span class="civil-qsource">${esc(q.source)}</span></div>`;
 const feedback=locked?`<div class="civil-feedback ${a.lastCorrect?'good':'bad'}"><b>${a.lastCorrect?'✓ Resposta correta':'✕ Resposta incorreta — gabarito '+q.answer}</b>${esc(q.explanation)}<span class="basis">Fundamento: ${esc(q.basis)}${a.attempts>1?' · '+a.attempts+' tentativas':''}</span></div>`:'';
 const source=q.kind==='real'?`<a class="civil-source-link" href="${escAttr(q.url)}" target="_blank" rel="noopener">Fonte da questão no TEC ↗</a>`:'<span class="muted small">Caso autoral criado para aplicação da regra.</span>';
 return `<article class="civil-qcard">${meta}<h4>${esc(q.prompt)}</h4><div class="civil-options">${opts}</div>
 <div class="civil-submit-row"><div>${source}</div>
 <div class="civil-qnav"><button class="civil-btn" onclick="civil15Move('${stage}',-1)" ${index===0?'disabled':''}>←</button><span>${index+1} / ${total}</span><button class="civil-btn" onclick="civil15Move('${stage}',1)" ${index===total-1?'disabled':''}>→</button></div>
 ${locked?`<button class="civil-btn" onclick="civil15Retry('${escJs(q.id)}')">Refazer</button>`:`<button class="civil-btn primary" onclick="civil15Submit('${escJs(q.id)}','${stage}')">Responder</button>`}
 </div>${feedback}</article>`
}
function civil15StageSession(stage){
 const qs=civil15StageQuestions(stage);if(!qs.length)return '<div class="muted small">Nenhuma questão disponível.</div>';
 if(civil15Ui.stage!==stage)civil15Ui={stage,index:Math.max(0,qs.findIndex(q=>(civilAnswer(q.id)?.attempts||0)===0))};
 civil15Ui.index=Math.max(0,Math.min(qs.length-1,civil15Ui.index));
 return civil15QuestionCard(qs[civil15Ui.index],stage,civil15Ui.index,qs.length)
}
function civil15QuestionStep(stage,title,subtitle,num){
 const stats=civil15Accuracy(stage),done=civil15StageDone(stage),open=localStorage.getItem(civil15StepOpenKey(stage))==='1',active=civil15Ui.stage===stage;
 return `<section class="civil-step ${done?'done':''} ${open?'open':''}" data-step="${stage}">
 <button class="civil-step-head" onclick="toggleCivil15Step('${stage}')"><span class="civil-step-n">${done?'✓':num}</span><span class="civil-step-title"><b>${esc(title)}</b><small>${esc(subtitle)}</small></span><span class="civil-step-status">${stats.answered}/${stats.total} respondidas${stats.answered?' · '+stats.pct+'%':''}</span><span>⌄</span></button>
 <div class="civil-step-body"><div class="civil-stage-toolbar"><p>${stage==='diagnostic15'?'Dez questões FCC reais, com prioridade para 2021-2026 e cargos jurídicos/Oficial de Justiça. Faça antes de consultar a teoria.':stage==='final15'?'Quinze questões FCC reais sobre casamento, filiação, poder familiar, regimes de bens e união estável.':'Cinco casos autorais para pontos atuais que a literalidade isolada não resolve bem.'}</p><div class="civil-stage-actions"><button class="civil-btn primary" onclick="civil15OpenStage('${stage}')">${stats.answered?'Continuar':'Iniciar'}</button></div></div>${active?civil15StageSession(stage):''}</div></section>`
}
function civil15ManualStep(id,title,subtitle,num,body,field){
 const st=civilModuleState('m15'),done=!!st[field],open=localStorage.getItem(civil15StepOpenKey(id))==='1';
 return `<section class="civil-step ${done?'done':''} ${open?'open':''}" data-step="${id}">
 <button class="civil-step-head" onclick="toggleCivil15Step('${id}')"><span class="civil-step-n">${done?'✓':num}</span><span class="civil-step-title"><b>${esc(title)}</b><small>${esc(subtitle)}</small></span><span class="civil-step-status">${done?'Concluído':'Pendente'}</span><span>⌄</span></button>
 <div class="civil-step-body">${body}<label class="civil-manual-done"><input type="checkbox" ${done?'checked':''} onchange="civilSetModule('m15',{${field}:this.checked})"> Marcar esta etapa como concluída</label></div></section>`
}
function civil15ReadingBody(){
 return `<div class="civil-theory"><section><h4>Leitura orientada — Módulo 15</h4><div class="civil-law-grid">
 <div class="civil-law-card"><b>CC, arts. 1.511 a 1.582</b><span>Casamento: capacidade, impedimentos, causas suspensivas, habilitação, celebração, invalidade, efeitos e divórcio.</span></div>
 <div class="civil-law-card"><b>CC, arts. 1.583 a 1.590</b><span>Proteção da pessoa dos filhos e guarda.</span></div>
 <div class="civil-law-card"><b>CC, arts. 1.591 a 1.638</b><span>Parentesco, filiação, reconhecimento e poder familiar.</span></div>
 <div class="civil-law-card"><b>CC, arts. 1.639 a 1.688</b><span>Regime de bens, outorga conjugal e pacto antenupcial.</span></div>
 <div class="civil-law-card"><b>CC, arts. 1.689 a 1.693</b><span>Usufruto e administração dos bens dos filhos menores.</span></div>
 <div class="civil-law-card"><b>CC, arts. 1.694 a 1.710</b><span>Alimentos — núcleo do Direito de Família.</span></div>
 <div class="civil-law-card"><b>CC, arts. 1.711 a 1.722</b><span>Bem de família voluntário.</span></div>
 <div class="civil-law-card"><b>CC, arts. 1.723 a 1.727</b><span>União estável e concubinato.</span></div>
 </div>
 <div class="civil-alert"><b>Não leia o Código isoladamente:</b> a parte de Família foi profundamente constitucionalizada. Neste módulo, a leitura deve ser corrigida/complementada por STF Tema 1.053, Tema 1.236, Tema 622, Tema 529, ADI 4.277/ADPF 132, além das Leis 13.811/2019 e 14.713/2023.</div>
 <div class="civil-stage-actions"><button class="civil-btn primary" onclick="saveLast({civilModule:'m15',title:'Direito Civil • Módulo 15 • Família no Vade Mecum',at:Date.now()});openVadeMecum(null,'cc')">📖 Abrir Código Civil no Vade Mecum</button></div></section></div>`
}
function civil15TheoryBody(){
 return `<div class="civil-theory">
 <section><h4>1. Direito de Família constitucionalizado</h4><p>A família é protegida como realidade plural. Igualdade entre cônjuges/companheiros, igualdade entre filhos, dignidade, liberdade familiar, melhor interesse da criança e proibição de discriminação orientam a leitura do Código.</p></section>

 <section><h4>2. Esponsais</h4><p>O noivado não cria direito de exigir casamento nem execução específica. A ruptura, por si só, não gera automaticamente indenização. Responsabilidade civil pode surgir apenas quando a conduta concreta exceder o exercício regular da liberdade matrimonial e preencher os pressupostos gerais dos arts. 186, 187 e 927.</p><div class="civil-alert">Esponsais são tema doutrinário: não há no Código Civil atual um contrato típico de noivado com obrigação de casar.</div></section>

 <section><h4>3. Casamento: estrutura essencial</h4><p>O casamento estabelece comunhão plena de vida, com igualdade de direitos e deveres. A habilitação verifica capacidade e obstáculos; a celebração exige manifestação dos nubentes perante autoridade competente; o casamento religioso pode produzir efeitos civis nos requisitos legais.</p></section>

 <section><h4>4. Idade núbil</h4><p>Homem e mulher — lido constitucionalmente sem discriminação por sexo/orientação — podem casar a partir de <strong>16 anos</strong>, com autorização enquanto não atingida a maioridade civil. Desde a Lei 13.811/2019, <strong>não é permitido em qualquer caso o casamento de quem não atingiu 16 anos</strong>.</p></section>

 <section><h4>5. Impedimentos × causas suspensivas</h4><table class="civil-compare"><tr><th>Impedimento — art. 1.521</th><th>Causa suspensiva — art. 1.523</th></tr>
 <tr><td>Obsta validamente o casamento.</td><td>Recomendação legal de não casar em determinada circunstância patrimonial/familiar.</td></tr>
 <tr><td>Violação → nulidade, art. 1.548, II.</td><td>Não gera nulidade; pode atrair separação obrigatória de bens, art. 1.641, I.</td></tr>
 <tr><td>Pode ser oposto até a celebração por qualquer pessoa capaz.</td><td>Legitimação de oposição é restrita pelo art. 1.524.</td></tr></table></section>

 <section><h4>6. Habilitação e celebração</h4><p>O procedimento de habilitação é pessoal e registral. Os nubentes demonstram inexistência de impedimentos e apresentam documentação. Na celebração, a manifestação livre e atual perante a autoridade competente é elemento estrutural.</p></section>

 <section><h4>7. Nulidade, anulabilidade e casamento putativo</h4><ul><li><strong>Nulo:</strong> infringência de impedimento, art. 1.548, II.</li><li><strong>Anulável:</strong> hipóteses do art. 1.550 e vícios de vontade dos arts. 1.556-1.558.</li><li><strong>Putativo:</strong> mesmo casamento inválido pode produzir efeitos até a sentença para cônjuge de boa-fé; os filhos são protegidos.</li></ul></section>

 <section><h4>8. Efeitos pessoais do casamento</h4><p>Os cônjuges assumem deveres de fidelidade, vida em comum, mútua assistência e sustento, guarda e educação dos filhos, dentro de uma relação de igualdade. Qualquer nubente pode acrescer ao seu nome o sobrenome do outro nos termos legais.</p></section>

 <section><h4>9. Casamento entre pessoas do mesmo sexo</h4><p>A literalidade histórica de alguns dispositivos deve ser lida à luz da ADI 4.277/ADPF 132 e da Resolução CNJ 175/2013. Autoridades não podem recusar habilitação, celebração ou conversão de união estável em casamento por se tratar de casal do mesmo sexo.</p></section>

 <section><h4>10. Divórcio após a EC 66/2010</h4><p>O divórcio é direito potestativo e não exige prazo, causa, culpa ou separação prévia. O STF, no Tema 1.053, fixou que a <strong>separação judicial não subsiste como figura autônoma</strong>, preservados os estados civis já constituídos por ato jurídico perfeito.</p><p>O divórcio pode ser concedido <strong>sem prévia partilha de bens</strong>, art. 1.581.</p></section>

 <section><h4>11. Guarda unilateral × compartilhada</h4><p>A guarda compartilhada busca responsabilização conjunta e equilíbrio no exercício de direitos/deveres parentais; não significa divisão matemática de tempo nem elimina alimentos. Desde a Lei 14.713/2023, risco de violência doméstica ou familiar impede sua imposição obrigatória.</p></section>

 <section><h4>12. Parentesco</h4><ul><li>Linha reta: ascendentes e descendentes, sem limite de grau.</li><li>Colateral: pessoas provenientes de tronco comum sem descenderem umas das outras; o Código reconhece até o quarto grau.</li><li>Afinidade: vínculo com ascendentes, descendentes e irmãos do cônjuge/companheiro; em linha reta não se extingue com dissolução do casamento/união.</li></ul></section>

 <section><h4>13. Filiação: igualdade absoluta</h4><p>Filhos havidos ou não do casamento, ou por adoção, possuem os mesmos direitos e qualificações. São proibidas designações discriminatórias relativas à filiação.</p></section>

 <section><h4>14. Presunções de filiação — art. 1.597</h4><p>Além da presunção temporal clássica, o Código trata de reprodução assistida: fecundação artificial homóloga mesmo após a morte do marido; embriões excedentários de concepção homóloga; e inseminação heteróloga com prévia autorização do marido.</p></section>

 <section><h4>15. Reconhecimento de filiação</h4><p>O reconhecimento é irrevogável e pode ocorrer no registro de nascimento, escritura pública/escrito particular arquivado, testamento ou manifestação perante juiz. Filho maior depende de consentimento; o menor pode impugnar nos quatro anos seguintes à maioridade ou emancipação.</p></section>

 <section><h4>16. Multiparentalidade — Tema 622/STF</h4><p>A paternidade socioafetiva, registrada ou não, <strong>não impede</strong> o reconhecimento concomitante da filiação biológica, com efeitos jurídicos próprios. A prova pode, portanto, envolver coexistência de vínculos parentais.</p></section>

 <section><h4>17. Poder familiar</h4><p>É exercido em igualdade pelos pais. Abrange direção da criação/educação, guarda, representação/assistência, consentimentos legais e proteção integral dos filhos.</p><table class="civil-compare"><tr><th>Suspensão</th><th>Perda</th><th>Extinção</th></tr>
 <tr><td>Medida temporária nas hipóteses legais.</td><td>Sanção judicial grave, art. 1.638.</td><td>Morte, emancipação, maioridade, adoção e decisão judicial nas hipóteses legais, art. 1.635.</td></tr></table></section>

 <section><h4>18. Regime de bens: princípios</h4><p>Regime patrimonial começa com o casamento. Na falta de convenção válida, aplica-se comunhão parcial. Nubentes podem estipular regime e até combinar regras lícitas, respeitados limites legais. Alteração posterior exige pedido motivado de ambos e autorização judicial, preservados terceiros.</p></section>

 <section><h4>19. Pacto antenupcial</h4><ul><li>Forma: escritura pública, sob pena de nulidade.</li><li>Se o casamento não ocorre: pacto é ineficaz.</li><li>Para produzir efeitos perante terceiros: registro no RI do domicílio dos cônjuges.</li><li>Comunhão parcial legal não precisa de pacto; regime diverso, em regra, sim.</li></ul></section>

 <section><h4>20. Comunhão parcial</h4><p>Regra central: comunicam-se os bens adquiridos <strong>onerosamente</strong> na constância do casamento, inclusive por fato eventual; ficam fora, entre outros, bens anteriores e recebidos por doação ou sucessão, além das demais exclusões do art. 1.659.</p></section>

 <section><h4>21. Comunhão universal, participação final e separação</h4><p><strong>Universal:</strong> comunicação ampla com exceções legais. <strong>Participação final nos aquestos:</strong> patrimônios permanecem próprios durante o casamento, com apuração dos aquestos na dissolução. <strong>Separação convencional:</strong> independência patrimonial segundo pacto. <strong>Separação legal:</strong> imposta nas hipóteses do art. 1.641, com a releitura constitucional/jurisprudencial pertinente.</p></section>

 <section><h4>22. Maiores de 70 anos — Tema 1.236/STF</h4><p>A regra do art. 1.641, II, pode ser afastada em casamento ou união estável por <strong>manifestação expressa mediante escritura pública</strong>. Em vínculos já existentes, mudança de regime respeita os mecanismos próprios e produz efeitos prospectivos.</p><div class="civil-alert">Se a separação legal continuar aplicável, a jurisprudência do STJ exige prova do esforço comum para comunicação de bens adquiridos onerosamente — não presuma automaticamente meação.</div></section>

 <section><h4>23. Outorga conjugal</h4><p>Salvo no regime de separação absoluta, exige-se autorização do outro cônjuge para alienar/gravar imóvel, litigar sobre imóvel, prestar fiança/aval e fazer doações não remuneratórias de bens comuns ou que possam integrar futura meação, ressalvadas exceções legais.</p></section>

 <section><h4>24. Meação × herança</h4><p><strong>Meação</strong> decorre do regime de bens e apura patrimônio próprio/comum. <strong>Herança</strong> nasce da sucessão. Um cônjuge pode ser meeiro e herdeiro, apenas meeiro, apenas herdeiro ou nenhum, conforme regime, composição patrimonial e parentes sucessíveis.</p><div class="civil-alert">Aqui fica só a ponte conceitual. Ordem de vocação, concorrência, legítima e cálculos ficam para o Módulo 16.</div></section>

 <section><h4>25. Bens dos filhos menores</h4><p>Pais têm usufruto e administração dos bens dos filhos menores enquanto no poder familiar, com exclusões legais. Não podem alienar nem gravar imóveis dos filhos ou contrair obrigações que ultrapassem a simples administração sem necessidade/evidente interesse e <strong>prévia autorização judicial</strong>.</p></section>

 <section><h4>26. Alimentos</h4><p>Parentes, cônjuges ou companheiros podem pedir alimentos conforme necessidade do reclamante e recursos da pessoa obrigada, observada proporcionalidade. O dever familiar é recíproco e possui ordem/limites próprios. Novo casamento do devedor não extingue, por si só, obrigação alimentar anterior.</p></section>

 <section><h4>27. Bem de família: dois regimes</h4><table class="civil-compare"><tr><th>Voluntário — CC 1.711-1.722</th><th>Legal — Lei 8.009/1990</th></tr>
 <tr><td>Instituição por escritura pública ou testamento, até 1/3 do patrimônio líquido existente ao tempo do ato.</td><td>Impenhorabilidade residencial decorre da própria lei, sem necessidade de instituição voluntária.</td></tr>
 <tr><td>Tem regras próprias de registro, duração e administração.</td><td>Possui exceções legais expressas de penhorabilidade.</td></tr></table></section>

 <section><h4>28. União estável: requisitos</h4><p>Convivência <strong>pública, contínua, duradoura e estabelecida com objetivo de constituição de família</strong>. Não há prazo mínimo legal, filhos obrigatórios, coabitação indispensável ou escritura constitutiva.</p></section>

 <section><h4>29. União estável homoafetiva</h4><p>ADI 4.277 e ADPF 132 afastaram interpretação discriminatória. União estável entre pessoas do mesmo sexo é entidade familiar com o mesmo regime protetivo; a Resolução CNJ 175 assegura casamento e conversão.</p></section>

 <section><h4>30. Regime patrimonial na união estável</h4><p>Salvo contrato escrito, aplica-se <strong>comunhão parcial</strong>, no que couber. Bens particulares excluídos no casamento também orientam a partilha da união estável.</p></section>

 <section><h4>31. Pessoa casada, separação de fato e concubinato</h4><p>Impedimentos do art. 1.521 obstam união estável, <strong>exceto</strong> pessoa casada que esteja separada de fato ou judicialmente, nos termos do art. 1.723, §1º. Relações não eventuais entre pessoas impedidas de casar configuram concubinato no art. 1.727.</p></section>

 <section><h4>32. Uniões concomitantes — Tema 529/STF</h4><p>A preexistência de casamento ou união estável impede o reconhecimento de novo vínculo familiar concomitante referente ao mesmo período, ressalvada a exceção legal da pessoa casada separada de fato/judicialmente.</p></section>

 <section><h4>33. Companheiro e sucessão — ponte para M16</h4><p>O STF afastou a distinção sucessória entre cônjuges e companheiros: o art. 1.790 é inconstitucional, aplicando-se o regime do art. 1.829 também à união estável. O cálculo concreto será feito no Módulo 16.</p></section>
 
 <section><h4>EDITAL — tutela, curatela e tomada de decisão apoiada</h4><p><strong>Tutela</strong> protege menor sem poder familiar; <strong>curatela</strong> é medida extraordinária, proporcional e limitada; <strong>tomada de decisão apoiada</strong> preserva a capacidade e permite que a pessoa escolha pelo menos dois apoiadores de confiança. O Módulo 14 fecha este item com questões FCC.</p></section>
</div>`
}
function civil15DeepBody(){
 return `<div class="civil-theory">
 <section class="civil-juris"><h4>STF Tema 1.053 — separação judicial</h4><p>Após a EC 66/2010, separação judicial não é requisito para divórcio e não subsiste como figura autônoma. Estados civis de separação já constituídos permanecem preservados como ato jurídico perfeito.</p></section>

 <section class="civil-juris"><h4>STF Tema 1.236 — maiores de 70 anos</h4><p>A separação obrigatória do art. 1.641, II, pode ser afastada por manifestação expressa mediante escritura pública tanto no casamento quanto na união estável.</p></section>

 <section class="civil-juris"><h4>STF Tema 622 — multiparentalidade</h4><p>Filiação socioafetiva não bloqueia a filiação biológica concomitante. Os vínculos podem coexistir com efeitos jurídicos próprios.</p></section>

 <section class="civil-juris"><h4>ADI 4.277 / ADPF 132 + Resolução CNJ 175</h4><p>Uniões estáveis homoafetivas recebem proteção familiar sem discriminação, e cartórios não podem recusar habilitação, casamento civil ou conversão em casamento entre pessoas do mesmo sexo.</p></section>

 <section class="civil-juris"><h4>STF Tema 529 — simultaneidade</h4><p>Casamento ou união estável preexistente impede novo vínculo familiar no mesmo período, inclusive para efeitos previdenciários, ressalvada a pessoa casada efetivamente separada, nos termos do art. 1.723, §1º.</p></section>

 <section class="civil-juris"><h4>STF Temas 498/809 — companheiro na sucessão</h4><p>É inconstitucional o regime sucessório inferior do antigo art. 1.790. Para casamento e união estável aplica-se o regime sucessório do art. 1.829. A matéria será operacionalizada no Módulo 16.</p></section>

 <section class="civil-juris"><h4>Lei 14.713/2023 — guarda e violência</h4><p>A guarda compartilhada continua sendo regra quando ambos são aptos e não há acordo, mas deixou de ser impositiva quando existirem elementos que evidenciem probabilidade de risco de violência doméstica ou familiar.</p></section>

 <section class="civil-juris"><h4>STJ — separação legal e esforço comum</h4><p>Na leitura moderna da Súmula 377/STF, o STJ exige prova do esforço comum para comunicação de bens adquiridos onerosamente sob separação legal. Já a separação <strong>convencional</strong> não recebe automaticamente essa regra.</p></section>

 <section><h4>Mapa de pegadinhas</h4><table class="civil-compare"><tr><th>Pegadinha</th><th>Regra correta</th></tr>
 <tr><td>Gravidez permite casamento antes dos 16.</td><td>Não, desde a Lei 13.811/2019.</td></tr>
 <tr><td>Causa suspensiva torna casamento nulo.</td><td>Não; impedimento é que conduz à nulidade.</td></tr>
 <tr><td>Separação judicial ainda é etapa prévia.</td><td>Não, Tema 1.053/STF.</td></tr>
 <tr><td>Divórcio exige partilha anterior.</td><td>Não, art. 1.581.</td></tr>
 <tr><td>Guarda compartilhada é absoluta.</td><td>Não diante de risco de violência, Lei 14.713/2023.</td></tr>
 <tr><td>Filiação socioafetiva exclui biológica.</td><td>Não, Tema 622/STF.</td></tr>
 <tr><td>Primos são 3º grau.</td><td>São colaterais de 4º grau.</td></tr>
 <tr><td>Pacto antenupcial particular é apenas anulável.</td><td>Sem escritura pública, é nulo.</td></tr>
 <tr><td>Alteração do regime depende só de escritura.</td><td>No casamento vigente, exige autorização judicial nos termos do art. 1.639, §2º.</td></tr>
 <tr><td>Maior de 70 nunca pode escolher regime.</td><td>Pode afastar a separação por escritura pública, Tema 1.236.</td></tr>
 <tr><td>Meação e herança são a mesma coisa.</td><td>Institutos distintos.</td></tr>
 <tr><td>Bem de família só existe se registrado voluntariamente.</td><td>Lei 8.009 cria proteção legal independente.</td></tr>
 <tr><td>União estável exige 5 anos.</td><td>Não há prazo mínimo legal.</td></tr>
 <tr><td>União estável exige morar na mesma casa.</td><td>Coabitação não é requisito legal indispensável.</td></tr>
 <tr><td>União homoafetiva tem regime inferior.</td><td>Não.</td></tr>
 <tr><td>Pessoa formalmente casada nunca pode ter união estável.</td><td>Pode se estiver separada de fato/judicialmente.</td></tr>
 <tr><td>Duas uniões estáveis simultâneas são reconhecidas.</td><td>Regra do Tema 529 é negativa, ressalvada a exceção legal.</td></tr>
 <tr><td>Companheiro segue art. 1.790 na sucessão.</td><td>Não; art. 1.790 é inconstitucional, aplicando-se art. 1.829.</td></tr></table></section>
 </div>`
}
function civil15ErrorStep(){
 const id='errors15',m=civilModuleState('m15'),done=!!m.errorsReviewed,open=localStorage.getItem(civil15StepOpenKey(id))==='1';
 const qs=civil15StageQuestions('errors15'),unresolved=qs.filter(q=>civilAnswer(q.id)?.lastCorrect===false);
 const rows=qs.map((q,i)=>{const a=civilAnswer(q.id);return `<div class="civil-error-row"><div><b>${q.kind==='real'?'FCC':'Autoral'} • ${esc(q.subject)}</b><small>${a?.lastCorrect?'Corrigida na última tentativa':'Ainda errada na última tentativa'} · ${a?.attempts||0} tentativa(s)</small></div><button class="civil-btn" onclick="civil15Ui={stage:'errors15',index:${i}};localStorage.setItem(civil15StepOpenKey('errors15'),'1');renderSubjects()">Revisar</button></div>`}).join('');
 return `<section class="civil-step ${done?'done':''} ${open?'open':''}" data-step="errors15"><button class="civil-step-head" onclick="toggleCivil15Step('errors15')"><span class="civil-step-n">${done?'✓':'7'}</span><span class="civil-step-title"><b>Revisão de erros</b><small>Somente erros do Módulo 15.</small></span><span class="civil-step-status">${qs.length} no histórico · ${unresolved.length} ainda erradas</span><span>⌄</span></button>
 <div class="civil-step-body">${qs.length?`<div class="civil-error-list">${rows}</div>${civil15Ui.stage==='errors15'?`<div style="margin-top:9px">${civil15StageSession('errors15')}</div>`:''}`:'<div class="muted small">Nenhum erro registrado neste módulo ainda.</div>'}
 <label class="civil-manual-done"><input type="checkbox" ${done?'checked':''} onchange="civilSetModule('m15',{errorsReviewed:this.checked})"> Marcar minha revisão de erros como concluída</label></div></section>`
}
function civil15AnkiStep(){
 const id='anki15',m=civilModuleState('m15'),done=!!m.anki,open=localStorage.getItem(civil15StepOpenKey(id))==='1';
 const deck='04 DIREITO CIVIL::13 DIREITO DE FAMÍLIA';
 return `<section class="civil-step ${done?'done':''} ${open?'open':''}" data-step="anki15"><button class="civil-step-head" onclick="toggleCivil15Step('anki15')"><span class="civil-step-n">${done?'✓':'8'}</span><span class="civil-step-title"><b>Anki seletivo</b><small>Baralho existente de Direito de Família.</small></span><span class="civil-step-status">${done?'Concluído':'Pendente'}</span><span>⌄</span></button>
 <div class="civil-step-body"><p class="civil-anki-note">Abra <b>13 DIREITO DE FAMÍLIA</b>. Priorize: impedimentos × suspensivas, invalidade/putatividade, Tema 1.053, guarda e violência, filiação/multiparentalidade, poder familiar, regimes e pacto, Tema 1.236, bem de família e união estável. Deixe os cartões essencialmente sucessórios para o Módulo 16.</p>
 <div class="civil-stage-actions" style="margin-top:9px"><button class="civil-btn primary" onclick="window.openAnkiDeck('${escJs(deck)}')">🧠 Abrir baralho existente</button></div>
 <label class="civil-manual-done"><input type="checkbox" ${done?'checked':''} onchange="civilSetModule('m15',{anki:this.checked})"> Marcar revisão no Anki como concluída</label></div></section>`
}
function renderCivilModule15(){
 const pct=civilModulePct('m15');
 return `<div class="civil-overall"><span style="width:${pct}%"></span></div><div class="civil-scope-note"><span class="civil-scope-badge edital">EDITAL</span><b>Escopo fechado do Módulo 15:</b> casamento, guarda, parentesco, filiação, poder familiar, regimes de bens, pacto antenupcial, bens dos filhos, alimentos, bem de família, união estável, união homoafetiva e concubinato. <b>Sucessões em profundidade ficam exclusivamente para o Módulo 16.</b></div>
 <div class="civil-steps">
 ${civil15QuestionStep('diagnostic15','Diagnóstico FCC','10 questões reais antes da teoria.',1)}
 ${civil15ManualStep('reading15','Leitura orientada','CC 1.511-1.727 + atualização constitucional e legislativa.',2,civil15ReadingBody(),'reading')}
 ${civil15ManualStep('theory15','Teoria nuclear','Família completa dentro do recorte do edital.',3,civil15TheoryBody(),'theory')}
 ${civil15ManualStep('deep15','Aprofundamento e jurisprudência','STF/STJ e alterações legislativas que mudam a leitura do Código.',4,civil15DeepBody(),'deep')}
 ${civil15QuestionStep('cases15','Casos práticos','5 casos autorais de nível Analista/Oficial.',5)}
 ${civil15QuestionStep('final15','Bateria final FCC','15 questões FCC reais após a teoria.',6)}
 ${civil15ErrorStep()}
 ${civil15AnkiStep()}
 </div>`
}


let civil16Ui={stage:null,index:0};
function civil16StepOpenKey(id){return `central-v6:civil-step:m16:${id}`}
function civil16StageQuestions(stage){
 if(stage==='diagnostic16')return CIVIL_COURSE.diagnostic16||[];
 if(stage==='final16')return CIVIL_COURSE.final16||[];
 if(stage==='cases16')return CIVIL_COURSE.cases16||[];
 if(stage==='errors16'){
  const all=[...(CIVIL_COURSE.diagnostic16||[]),...(CIVIL_COURSE.cases16||[]),...(CIVIL_COURSE.final16||[])];
  return all.filter(q=>civilAnswer(q.id)?.everWrong);
 }
 return[];
}
function civil16StageDone(stage){
 const qs=civil16StageQuestions(stage);return qs.length>0&&qs.every(q=>(civilAnswer(q.id)?.attempts||0)>0)
}
function civil16Steps(){
 const m=civilModuleState('m16');
 return [
  {id:'diagnostic16',done:civil16StageDone('diagnostic16')},
  {id:'reading16',done:!!m.reading},
  {id:'theory16',done:!!m.theory},
  {id:'deep16',done:!!m.deep},
  {id:'cases16',done:civil16StageDone('cases16')},
  {id:'final16',done:civil16StageDone('final16')},
  {id:'errors16',done:!!m.errorsReviewed},
  {id:'anki16',done:!!m.anki}
 ]
}
function toggleCivil16Step(id){
 const el=document.querySelector(`.civil-module[data-civil="m16"] .civil-step[data-step="${id}"]`);if(!el)return;
 const open=!el.classList.contains('open');el.classList.toggle('open',open);localStorage.setItem(civil16StepOpenKey(id),open?'1':'0')
}
function civil16OpenStage(stage){
 const qs=civil16StageQuestions(stage);if(!qs.length){civil16Ui={stage,index:0};renderSubjects();return}
 let idx=qs.findIndex(q=>(civilAnswer(q.id)?.attempts||0)===0);if(idx<0)idx=0;
 civil16Ui={stage,index:idx};localStorage.setItem(civil16StepOpenKey(stage),'1');renderSubjects();
 setTimeout(()=>document.querySelector(`.civil-module[data-civil="m16"] .civil-step[data-step="${stage}"]`)?.scrollIntoView({behavior:'smooth',block:'center'}),20)
}
function civil16Select(id,letter){
 const st=civilState(),a=st.answers[id]||{attempts:0,history:[],everWrong:false};
 if(a.submitted)return;a.selected=letter;a.submitted=false;st.answers[id]=a;civilSave(st);renderSubjects()
}
function civil16Submit(id,stage){
 const q=[...(CIVIL_COURSE.diagnostic16||[]),...(CIVIL_COURSE.cases16||[]),...(CIVIL_COURSE.final16||[])].find(x=>x.id===id);
 if(!q)return;const st=civilState(),a=st.answers[id]||{attempts:0,history:[],everWrong:false};
 if(!a.selected){alert('Escolha uma alternativa primeiro.');return}
 const correct=a.selected===q.answer;
 a.attempts=(a.attempts||0)+1;a.submitted=true;a.lastCorrect=correct;a.everWrong=!!a.everWrong||!correct;
 a.history=[...(a.history||[]),{at:new Date().toISOString(),selected:a.selected,correct,stage,module:'m16'}];
 st.answers[id]=a;civilSave(st);renderAll()
}
function civil16Retry(id){const st=civilState(),a=st.answers[id];if(!a)return;a.selected=null;a.submitted=false;st.answers[id]=a;civilSave(st);renderSubjects()}
function civil16Move(stage,delta){
 const qs=civil16StageQuestions(stage);if(!qs.length)return;
 civil16Ui.stage=stage;civil16Ui.index=Math.max(0,Math.min(qs.length-1,civil16Ui.index+delta));renderSubjects()
}
function civil16Accuracy(stage){
 const qs=civil16StageQuestions(stage),answered=qs.map(q=>civilAnswer(q.id)).filter(a=>a?.attempts);
 const correct=answered.filter(a=>a.lastCorrect).length;
 return {answered:answered.length,total:qs.length,correct,pct:answered.length?Math.round(correct/answered.length*100):0}
}
function civil16QuestionMeta(q){
 const role=/Oficial de Justiça/i.test(q.source)?'Oficial de Justiça':/Analista|Defensor|Juiz|Promotor|Procurador|AFRE|AFFE/i.test(q.source)?'Nível superior / carreira jurídica':'Carreira jurídica';
 return `<div class="civil-qmeta"><span class="civil-chip real">${esc(q.bankLabel||'QUESTÃO REAL FCC')}</span><span class="civil-chip role">${esc(role)}</span><span class="civil-chip">${esc(q.basis)}</span><span class="civil-qsource">${esc(q.source)}</span></div>`
}
function civil16QuestionCard(q,stage,index,total){
 const a=civilAnswer(q.id)||{selected:null,submitted:false,attempts:0,history:[]},locked=!!a.submitted;
 const opts=Object.entries(q.options).map(([letter,text])=>{
  let cls='civil-option';if(a.selected===letter)cls+=' selected';
  if(locked&&letter===q.answer)cls+=' correct';else if(locked&&a.selected===letter&&letter!==q.answer)cls+=' wrong';
  return `<button class="${cls}" ${locked?'disabled':''} onclick="civil16Select('${escJs(q.id)}','${letter}')"><span class="civil-letter">${letter}</span><span>${esc(text)}</span></button>`
 }).join('');
 const meta=q.kind==='real'?civil16QuestionMeta(q):`<div class="civil-qmeta"><span class="civil-chip authorial">AUTORAL</span><span class="civil-chip role">Nível Analista/Oficial</span><span class="civil-chip">${esc(q.basis)}</span><span class="civil-qsource">${esc(q.source)}</span></div>`;
 const feedback=locked?`<div class="civil-feedback ${a.lastCorrect?'good':'bad'}"><b>${a.lastCorrect?'✓ Resposta correta':'✕ Resposta incorreta — gabarito '+q.answer}</b>${esc(q.explanation)}<span class="basis">Fundamento: ${esc(q.basis)}${a.attempts>1?' · '+a.attempts+' tentativas':''}</span></div>`:'';
 const source=q.kind==='real'?`<a class="civil-source-link" href="${escAttr(q.url)}" target="_blank" rel="noopener">Fonte da questão no TEC ↗</a>`:'<span class="muted small">Caso autoral criado para aplicação da regra.</span>';
 return `<article class="civil-qcard">${meta}<h4>${esc(q.prompt)}</h4><div class="civil-options">${opts}</div>
 <div class="civil-submit-row"><div>${source}</div>
 <div class="civil-qnav"><button class="civil-btn" onclick="civil16Move('${stage}',-1)" ${index===0?'disabled':''}>←</button><span>${index+1} / ${total}</span><button class="civil-btn" onclick="civil16Move('${stage}',1)" ${index===total-1?'disabled':''}>→</button></div>
 ${locked?`<button class="civil-btn" onclick="civil16Retry('${escJs(q.id)}')">Refazer</button>`:`<button class="civil-btn primary" onclick="civil16Submit('${escJs(q.id)}','${stage}')">Responder</button>`}
 </div>${feedback}</article>`
}
function civil16StageSession(stage){
 const qs=civil16StageQuestions(stage);if(!qs.length)return '<div class="muted small">Nenhuma questão disponível.</div>';
 if(civil16Ui.stage!==stage)civil16Ui={stage,index:Math.max(0,qs.findIndex(q=>(civilAnswer(q.id)?.attempts||0)===0))};
 civil16Ui.index=Math.max(0,Math.min(qs.length-1,civil16Ui.index));
 return civil16QuestionCard(qs[civil16Ui.index],stage,civil16Ui.index,qs.length)
}
function civil16QuestionStep(stage,title,subtitle,num){
 const stats=civil16Accuracy(stage),done=civil16StageDone(stage),open=localStorage.getItem(civil16StepOpenKey(stage))==='1',active=civil16Ui.stage===stage;
 return `<section class="civil-step ${done?'done':''} ${open?'open':''}" data-step="${stage}">
 <button class="civil-step-head" onclick="toggleCivil16Step('${stage}')"><span class="civil-step-n">${done?'✓':num}</span><span class="civil-step-title"><b>${esc(title)}</b><small>${esc(subtitle)}</small></span><span class="civil-step-status">${stats.answered}/${stats.total} respondidas${stats.answered?' · '+stats.pct+'%':''}</span><span>⌄</span></button>
 <div class="civil-step-body"><div class="civil-stage-toolbar"><p>${stage==='diagnostic16'?'Dez questões FCC reais, priorizando questões recentes e cargos de nível superior/Oficial. Resolva antes da teoria.':stage==='final16'?'Quinze questões FCC reais cobrindo sucessão legítima, testamentária e inventário/partilha.':'Casos autorais para jurisprudência e atualização notarial recente.'}</p><div class="civil-stage-actions"><button class="civil-btn primary" onclick="civil16OpenStage('${stage}')">${stats.answered?'Continuar':'Iniciar'}</button></div></div>${active?civil16StageSession(stage):''}</div></section>`
}
function civil16ManualStep(id,title,subtitle,num,body,field){
 const st=civilModuleState('m16'),done=!!st[field],open=localStorage.getItem(civil16StepOpenKey(id))==='1';
 return `<section class="civil-step ${done?'done':''} ${open?'open':''}" data-step="${id}">
 <button class="civil-step-head" onclick="toggleCivil16Step('${id}')"><span class="civil-step-n">${done?'✓':num}</span><span class="civil-step-title"><b>${esc(title)}</b><small>${esc(subtitle)}</small></span><span class="civil-step-status">${done?'Concluído':'Pendente'}</span><span>⌄</span></button>
 <div class="civil-step-body">${body}<label class="civil-manual-done"><input type="checkbox" ${done?'checked':''} onchange="civilSetModule('m16',{${field}:this.checked})"> Marcar esta etapa como concluída</label></div></section>`
}
function civil16ReadingBody(){
 return `<div class="civil-theory"><section><h4>Leitura orientada — Módulo 16</h4><div class="civil-law-grid">
 <div class="civil-law-card"><b>CC, arts. 1.784 a 1.823</b><span>Abertura, herança, administração, vocação, aceitação/renúncia, indignidade, jacência e petição de herança.</span></div>
 <div class="civil-law-card"><b>CC, arts. 1.829 a 1.856</b><span>Sucessão legítima, cônjuge/companheiro, colaterais, necessários, legítima e representação.</span></div>
 <div class="civil-law-card"><b>CC, arts. 1.857 a 1.990</b><span>Sucessão testamentária: formas, disposições, legados, substituições, redução, deserdação, revogação e testamenteiro.</span></div>
 <div class="civil-law-card"><b>CC, arts. 1.991 a 2.027</b><span>Inventário civil, dívidas, colação, partilha, sobrepartilha e efeitos.</span></div>
 <div class="civil-law-card"><b>CPC, arts. 610 a 673</b><span>Inventário e partilha, arrolamentos, inventariante e procedimento.</span></div>
 <div class="civil-law-card"><b>Resolução CNJ 35 atual</b><span>Inventário extrajudicial, inclusive hipóteses atuais com menor/incapaz ou testamento.</span></div>
 </div>
 <div class="civil-alert"><b>Pegadinha de atualização:</b> o art. 1.796 do CC conserva a redação antiga de 30 dias; para o processo atual, o CPC/2015 determina abertura do inventário em <b>2 meses</b> e conclusão nos 12 meses subsequentes, prorrogáveis.</div>
 <div class="civil-stage-actions"><button class="civil-btn primary" onclick="saveLast({civilModule:'m16',title:'Direito Civil • Módulo 16 • Sucessões no Vade Mecum',at:Date.now()});openVadeMecum(null,'cc')">📖 Abrir Código Civil no Vade Mecum</button></div></section></div>`
}
function civil16TheoryBody(){
 return `<div class="civil-theory">
 <section><h4>1. Abertura da sucessão e saisine</h4><p>A sucessão se abre com a morte. Pelo art. 1.784, a herança transmite-se <strong>desde logo</strong> aos herdeiros legítimos e testamentários. O inventário não cria a transmissão: organiza, identifica, liquida e individualiza o acervo já transmitido.</p></section>

 <section><h4>2. Lugar e lei aplicável</h4><p>A sucessão abre-se no lugar do último domicílio do falecido. A legitimação para suceder é regulada pela lei vigente no momento da abertura da sucessão.</p></section>

 <section><h4>3. Herança como universalidade</h4><p>Até a partilha, o direito dos coerdeiros quanto à propriedade e à posse da herança é <strong>indivisível</strong> e rege-se pelas normas do condomínio. Mesmo com muitos bens e herdeiros, a herança é tratada como todo unitário.</p></section>

 <section><h4>4. Responsabilidade intra vires hereditatis</h4><p>O herdeiro não responde por encargos superiores às forças da herança. Cabe-lhe provar o excesso, salvo se inventário já demonstrar o valor dos bens herdados.</p></section>

 <section><h4>5. Cessão de direitos hereditários</h4><ul><li>Exige <strong>escritura pública</strong>.</li><li>Antes da partilha, o herdeiro pode ceder seu quinhão ideal.</li><li>É ineficaz a disposição, sem autorização do juiz da sucessão, de bem singular da herança pendente de indivisibilidade.</li><li>Coerdeiro tem preferência quando a quota é cedida a estranho; violada a preferência, pode haver adjudicação mediante depósito do preço no prazo legal.</li><li>Não existe contrato válido sobre herança de pessoa viva: pacto sucessório é vedado pelo art. 426.</li></ul></section>

 <section><h4>6. Administração da herança</h4><p>Até o compromisso do inventariante, a administração fica com o administrador provisório conforme a ordem legal. Depois, o inventariante representa o espólio e administra o acervo até a homologação da partilha.</p></section>

 <section><h4>7. Vocação hereditária</h4><p>Legitimam-se a suceder as pessoas nascidas ou já concebidas no momento da abertura. Na sucessão testamentária, a lei também admite hipóteses específicas, como filhos ainda não concebidos de pessoas indicadas pelo testador, pessoas jurídicas e fundação a ser criada.</p></section>

 <section><h4>8. Aceitação</h4><p>A aceitação torna definitiva a transmissão operada pela saisine e pode ser expressa, tácita ou, em situações legais, presumida. Atos meramente oficiosos, funeral e guarda provisória do acervo não significam necessariamente aceitação.</p></section>

 <section><h4>9. Renúncia</h4><ul><li>Forma solene: escritura pública ou termo judicial.</li><li>Não pode ser parcial, condicional ou a termo.</li><li>Aceitação e renúncia são irrevogáveis.</li><li>Renunciante é tratado como se nunca tivesse sido herdeiro daquela sucessão.</li><li>Em regra, ninguém representa herdeiro renunciante; a lei contém solução própria se ele for o único legítimo da classe ou se todos da mesma classe renunciarem.</li></ul></section>

 <section><h4>10. Credores do renunciante</h4><p>Se a renúncia prejudicar credores, estes podem, com autorização judicial, aceitar a herança em nome do renunciante até o limite necessário à satisfação dos créditos, observando o prazo legal de habilitação.</p></section>

 <section><h4>11. Indignidade</h4><p>É exclusão sucessória fundada em condutas gravíssimas previstas em lei. Os efeitos são pessoais: os descendentes do indigno sucedem como se ele fosse pré-morto, e o excluído não administra nem usufrui os bens que por representação caibam a seus descendentes.</p></section>

 <section><h4>12. Art. 1.815-A — atualização decisiva</h4><p>Desde a Lei 14.661/2023, o trânsito em julgado da condenação penal em qualquer hipótese de indignidade do art. 1.814 acarreta <strong>exclusão imediata</strong> do herdeiro ou legatário indigno, independentemente da sentença civil prevista no art. 1.815.</p></section>

 <section><h4>13. Indignidade × deserdação</h4><table class="civil-compare"><tr><th>Indignidade</th><th>Deserdação</th></tr>
 <tr><td>Incide sobre herdeiro ou legatário nas hipóteses legais.</td><td>Voltada à exclusão de herdeiro necessário.</td></tr>
 <tr><td>Pode decorrer do regime dos arts. 1.814-1.818.</td><td>Exige testamento com causa expressa prevista em lei.</td></tr>
 <tr><td>Lei 14.661/2023 criou efeito automático da condenação penal definitiva nas hipóteses do art. 1.814.</td><td>Exige demonstração da causa pelo interessado quando contestada.</td></tr></table></section>

 <section><h4>14. Herança jacente e vacante</h4><p>Sem testamento e sem herdeiro legítimo notoriamente conhecido, o acervo é arrecadado e fica sob curador, com busca/publicidade para habilitação. Decorrido o prazo legal, declara-se a vacância. A aquisição definitiva pelo Município/DF/União observa o prazo de <strong>5 anos da abertura da sucessão</strong>.</p></section>

 <section><h4>15. Petição de herança</h4><p>O herdeiro pode demandar reconhecimento de sua qualidade sucessória e restituição da herança, ou de parte dela, contra quem a possua como herdeiro ou mesmo sem título. A ação alcança a universalidade hereditária e dialoga com restituição, frutos e boa/má-fé.</p></section>

 <section><h4>16. Ordem da sucessão legítima</h4><ol><li>descendentes, em concorrência com o cônjuge/companheiro nas hipóteses legais;</li><li>ascendentes, em concorrência com cônjuge/companheiro;</li><li>cônjuge/companheiro sobrevivente;</li><li>colaterais até o quarto grau;</li><li>na ausência de sucessíveis, destino público conforme regime da vacância.</li></ol></section>

 <section><h4>17. Companheiro — Tema 809/STF</h4><p>O antigo art. 1.790 não pode ser usado para criar regime sucessório inferior à união estável. O STF determinou a aplicação do regime do art. 1.829 tanto ao casamento quanto à união estável.</p></section>

 <section><h4>18. Cônjuge/companheiro × descendentes</h4><p>A concorrência depende do regime de bens e da composição patrimonial. O art. 1.829, I, exclui a concorrência na comunhão universal, na separação obrigatória e, na comunhão parcial, quando o falecido não deixa bens particulares.</p><div class="civil-alert">Separação <b>convencional</b> não está entre essas exceções: a jurisprudência do STJ admite a concorrência com descendentes.</div></section>

 <section><h4>19. Quota do cônjuge com descendentes</h4><p>Concorrendo com descendentes, cabe ao cônjuge quinhão igual ao de cada filho que suceda por cabeça. Se for ascendente dos herdeiros com quem concorre, sua quota não pode ser inferior a 1/4 da herança sujeita à concorrência.</p></section>

 <section><h4>20. Concorrência com ascendentes</h4><p>Com pai e mãe do falecido, cônjuge/companheiro recebe 1/3. Se houver um só ascendente de primeiro grau ou ascendentes de grau maior, recebe 1/2.</p></section>

 <section><h4>21. Direito real de habitação</h4><p>Ao cônjuge sobrevivente é assegurado, qualquer que seja o regime, direito real de habitação sobre o imóvel destinado à residência da família, se for o único dessa natureza a inventariar, sem prejuízo da participação na herança.</p></section>

 <section><h4>22. Colaterais</h4><p>Na falta de descendentes, ascendentes e cônjuge/companheiro sucessível, chamam-se os colaterais até o quarto grau. O mais próximo exclui o mais remoto, com a exceção legal do direito de representação dos filhos de irmãos.</p><p>Irmão unilateral recebe metade do que recebe irmão bilateral quando concorrem entre si.</p></section>

 <section><h4>23. Herdeiros necessários e legítima</h4><p>O art. 1.845 enumera descendentes, ascendentes e cônjuge. Havendo herdeiros necessários, metade dos bens da herança constitui a <strong>legítima</strong>; a outra metade é, em regra, a parte disponível.</p></section>

 <section><h4>24. Direito de representação</h4><p>Representação faz os descendentes ingressarem no grau do representado e receberem o que ele receberia se vivo. Ocorre sempre na linha reta descendente; na colateral, somente em favor de filhos de irmãos do falecido quando com irmãos concorrerem.</p></section>

 <section><h4>25. Testamento — estrutura</h4><p>É ato personalíssimo e revogável, salvo efeitos que a lei torne irrevogáveis, e pode conter disposições patrimoniais e não patrimoniais. Maiores de 16 anos podem testar se tiverem discernimento no momento do ato.</p></section>

 <section><h4>26. Formas ordinárias</h4><table class="civil-compare"><tr><th>Público</th><th>Cerrado</th><th>Particular</th></tr>
 <tr><td>Lavrado pelo tabelião conforme declaração do testador e formalidades legais.</td><td>Escrito pelo testador ou a seu rogo, aprovado e cerrado pelo tabelião.</td><td>Escrito de próprio punho ou mecanicamente, com leitura/assinatura e testemunhas nos termos do art. 1.876.</td></tr></table>
 <p>Há ainda formas especiais — marítimo, aeronáutico e militar — e codicilo para disposições de menor expressão dentro do regime legal.</p></section>

 <section><h4>27. Testamento conjuntivo é proibido</h4><p>É vedado o testamento conjuntivo, seja simultâneo, recíproco ou correspectivo. Cada testador deve manifestar sua última vontade em ato próprio.</p></section>

 <section><h4>28. Disposições testamentárias</h4><p>Devem ser interpretadas buscando a vontade real do testador dentro dos limites legais. São válidas disposições não patrimoniais. A lei disciplina condições, encargos, indicação de beneficiários, erro, causas ilícitas, direito de acrescer e substituições.</p></section>

 <section><h4>29. Legados</h4><p>Legado é disposição testamentária singular. O Código disciplina coisa alheia, coisa genérica, alimentos, usufruto, imóvel, crédito, quitação, renda/pensão e regras de cumprimento.</p><p>Legado de alimentos abrange sustento, cura, vestuário e casa enquanto viver o legatário e educação, se menor.</p></section>

 <section><h4>30. Redução das disposições</h4><p>Se o testamento invadir a legítima, a regra é <strong>reduzir o excesso</strong>, e não destruir automaticamente toda a disposição. A redução opera até recompor a metade indisponível.</p></section>

 <section><h4>31. Deserdação, revogação e ruptura</h4><p>Deserdação exige causa legal expressa em testamento. Testamento pode ser revogado por outro testamento, total ou parcialmente. A ruptura ocorre nas hipóteses legais ligadas ao surgimento ou ignorância de herdeiro necessário, com efeitos próprios.</p></section>

 <section><h4>32. Testamenteiro</h4><p>Executa as disposições de última vontade e presta contas. Suas atribuições variam conforme o título e a existência de herdeiros necessários, inventariante e legados.</p></section>

 <section><h4>33. Inventário: prazo atual</h4><p>O CPC determina instauração em <strong>2 meses</strong> da abertura da sucessão e conclusão nos <strong>12 meses subsequentes</strong>, prazos prorrogáveis pelo juiz. O prazo de 30 dias ainda escrito no art. 1.796 do CC é texto anterior ao CPC atual.</p></section>

 <section><h4>34. Inventariante</h4><p>O CPC traz ordem de nomeação e deveres. Incumbe-lhe representar o espólio, administrar os bens, prestar declarações e contas e praticar certos atos apenas com oitiva dos interessados e autorização judicial.</p></section>

 <section><h4>35. Dívidas do espólio</h4><p>Antes da partilha, o patrimônio hereditário responde pelas dívidas. Feita a partilha, cada herdeiro responde proporcionalmente à parte recebida, sem responsabilidade além das forças da herança.</p></section>

 <section><h4>36. Colação</h4><p>Descendentes que concorrem à sucessão do ascendente comum devem conferir determinadas doações para igualar legítimas, salvo dispensa válida imputável à parte disponível. A análise da inoficiosidade da doação considera o patrimônio existente no momento da liberalidade.</p></section>

 <section><h4>37. Partilha e sobrepartilha</h4><p>Herdeiros capazes podem fazer partilha amigável nas formas admitidas; incapazes ou desacordo levam à disciplina judicial correspondente. Bens sonegados, litigiosos, descobertos depois ou de liquidação difícil podem ser objeto de sobrepartilha.</p></section>

 <section><h4>38. Arrolamento sumário</h4><p>Quando todos os herdeiros forem maiores e capazes e concordarem com a partilha, pode ser utilizado o arrolamento sumário, de rito simplificado, observadas as regras do CPC.</p></section>

 <section><h4>39. Arrolamento do art. 664</h4><p>O CPC prevê procedimento simplificado para espólio de valor igual ou inferior a <strong>1.000 salários mínimos</strong>. O art. 665 admite sua utilização mesmo com interessado incapaz, se todas as partes e o Ministério Público concordarem.</p></section>

 <section><h4>40. Alvarás sem inventário</h4><p>A Lei 6.858/1980 permite, em hipóteses específicas, levantamento por alvará de valores como verbas devidas por empregadores, FGTS/PIS-PASEP e outros valores abrangidos pela lei, independentemente de inventário ou arrolamento.</p></section>

 <section><h4>41. Inventário extrajudicial — quadro atual</h4><p>O CPC conserva a regra literal do art. 610, mas a regulamentação notarial nacional avançou. A Resolução CNJ 35, com a Resolução 571/2024, passou a admitir escritura pública:</p><ul><li>com menor/incapaz, sob as salvaguardas do art. 12-A;</li><li>mesmo com testamento, sob os requisitos do art. 12-B, inclusive autorização judicial após abertura e cumprimento do testamento;</li><li>sempre com assistência de advogado ou defensor público.</li></ul></section>

 <section><h4>42. Testamento com declaração irrevogável</h4><p>No regime extrajudicial do CNJ, se o testamento contiver reconhecimento de filho ou outra declaração irrevogável, a escritura pública de inventário e partilha fica vedada, exigindo-se a via judicial.</p></section>
 </div>`
}
function civil16DeepBody(){
 return `<div class="civil-theory">
 <section class="civil-juris"><h4>STF Tema 809 — união estável</h4><p>É inconstitucional distinguir o regime sucessório de cônjuge e companheiro pelo antigo art. 1.790. Aplica-se o regime do art. 1.829 às duas entidades familiares.</p></section>

 <section class="civil-juris"><h4>STJ Tema 1.200 — petição de herança</h4><p>O prazo prescricional começa na <strong>abertura da sucessão</strong>. A ação de reconhecimento de filiação, ainda que proposta depois, não suspende nem interrompe a prescrição da petição de herança. O STJ também reafirmou em 2026 que a pretensão patrimonial de petição de herança se submete ao prazo geral decenal.</p></section>

 <section class="civil-juris"><h4>Lei 14.661/2023 — indignidade</h4><p>O novo art. 1.815-A determina exclusão imediata do indigno quando houver sentença penal condenatória transitada em julgado nas hipóteses do art. 1.814, independentemente da ação civil de exclusão.</p></section>

 <section class="civil-juris"><h4>STJ 2026 — partilha desigual</h4><p>No REsp 2.225.451/SP, Informativo 891/2026, a Terceira Turma admitiu partilha amigável com quinhões desiguais entre herdeiros maiores e capazes quando houver consenso e cessão de direitos hereditários realizada após a abertura da sucessão e antes da partilha.</p></section>

 <section class="civil-juris"><h4>STJ 2026 — testamento por email</h4><p>Um email programado para envio após a morte, <strong>sem assinatura e sem testemunhas</strong>, não foi aceito como testamento particular. O STJ admite flexibilização excepcional de certas formalidades, mas não a eliminação de requisito essencial de autenticação/autoria.</p></section>

 <section class="civil-juris"><h4>STJ — testamento pode organizar 100% do patrimônio</h4><p>A legítima não pode ser reduzida, mas isso não impede o testador de mencionar e organizar também a metade indisponível no testamento. O limite é preservar integralmente o valor reservado aos herdeiros necessários.</p></section>

 <section class="civil-juris"><h4>STJ 2025 — legado de renda vitalícia</h4><p>O legado de renda vitalícia pode ser exigido antes do fim do inventário. Se o testador não fixar outro termo inicial, o STJ admitiu seu pagamento desde a abertura da sucessão no caso julgado.</p></section>

 <section class="civil-juris"><h4>STJ 2025 — direito real de habitação</h4><p>Enquanto perdurar, o direito real de habitação do cônjuge ou companheiro sobrevivente impede, em regra, a extinção do condomínio e a alienação judicial do imóvel protegido.</p></section>

 <section class="civil-juris"><h4>CNJ 571/2024 — extrajudicial com menor ou testamento</h4><p>A atualização da Resolução 35 ampliou as hipóteses notariais. Menor/incapaz exige quinhão ideal em cada bem, vedação de disposição e manifestação favorável do MP. Com testamento, há requisitos adicionais, inclusive autorização judicial após o procedimento de abertura/cumprimento.</p></section>

 <section><h4>Mapa de pegadinhas finais</h4><table class="civil-compare"><tr><th>Pegadinha</th><th>Regra correta</th></tr>
 <tr><td>Herança só se transmite com o inventário.</td><td>Transmite-se com a morte — saisine.</td></tr>
 <tr><td>Cessão de herança pode ser particular.</td><td>Escritura pública.</td></tr>
 <tr><td>Renúncia pode ser condicional.</td><td>Não.</td></tr>
 <tr><td>Filhos representam pai que renunciou.</td><td>Em regra, não representam renunciante.</td></tr>
 <tr><td>Indignidade sempre exige nova sentença civil.</td><td>Art. 1.815-A excepciona quando há condenação penal definitiva nas hipóteses legais.</td></tr>
 <tr><td>Herança vacante vira bem municipal imediatamente.</td><td>Há etapas e o prazo do art. 1.822.</td></tr>
 <tr><td>Petição de herança só prescreve após reconhecimento da paternidade.</td><td>Tema 1.200: termo inicial é a abertura da sucessão.</td></tr>
 <tr><td>Companheiro segue art. 1.790.</td><td>Não; Tema 809/STF.</td></tr>
 <tr><td>Separação convencional exclui cônjuge com descendentes.</td><td>Não.</td></tr>
 <tr><td>Irmão unilateral recebe igual ao bilateral.</td><td>Recebe metade quando concorrem.</td></tr>
 <tr><td>Representação ocorre na linha ascendente.</td><td>Não.</td></tr>
 <tr><td>Testamento conjuntivo é permitido.</td><td>Proibido.</td></tr>
 <tr><td>Menor de 18 nunca testa.</td><td>Maior de 16 pode testar, se capaz para o ato.</td></tr>
 <tr><td>Testamento só pode conter patrimônio.</td><td>Disposições não patrimoniais são válidas.</td></tr>
 <tr><td>Se invadir a legítima, todo testamento é nulo.</td><td>Reduz-se o excesso.</td></tr>
 <tr><td>Testamento não pode mencionar a legítima.</td><td>STJ admite organizar todo o acervo, preservando-a.</td></tr>
 <tr><td>Email informal basta como testamento particular.</td><td>Não sem requisitos mínimos de autoria/autenticação.</td></tr>
 <tr><td>Inventário atual deve abrir em 30 dias.</td><td>CPC: 2 meses.</td></tr>
 <tr><td>Depois da partilha, herdeiros respondem solidariamente por todas as dívidas.</td><td>Respondem proporcionalmente ao quinhão e dentro das forças herdadas.</td></tr>
 <tr><td>Partilha consensual sempre precisa ter quinhões legais matematicamente idênticos.</td><td>STJ 2026 admite desigualdade com cessão válida e consenso entre capazes.</td></tr>
 <tr><td>Menor torna extrajudicial absolutamente impossível.</td><td>CNJ 571/2024 prevê hipótese com salvaguardas.</td></tr>
 <tr><td>Qualquer testamento impede extrajudicial.</td><td>CNJ 571/2024 prevê hipótese autorizada com requisitos.</td></tr></table></section>
 </div>`
}
function civil16ErrorStep(){
 const id='errors16',m=civilModuleState('m16'),done=!!m.errorsReviewed,open=localStorage.getItem(civil16StepOpenKey(id))==='1';
 const qs=civil16StageQuestions('errors16'),unresolved=qs.filter(q=>civilAnswer(q.id)?.lastCorrect===false);
 const rows=qs.map((q,i)=>{const a=civilAnswer(q.id);return `<div class="civil-error-row"><div><b>${q.kind==='real'?'FCC':'Autoral'} • ${esc(q.subject)}</b><small>${a?.lastCorrect?'Corrigida na última tentativa':'Ainda errada na última tentativa'} · ${a?.attempts||0} tentativa(s)</small></div><button class="civil-btn" onclick="civil16Ui={stage:'errors16',index:${i}};localStorage.setItem(civil16StepOpenKey('errors16'),'1');renderSubjects()">Revisar</button></div>`}).join('');
 return `<section class="civil-step ${done?'done':''} ${open?'open':''}" data-step="errors16"><button class="civil-step-head" onclick="toggleCivil16Step('errors16')"><span class="civil-step-n">${done?'✓':'7'}</span><span class="civil-step-title"><b>Revisão de erros</b><small>Somente erros do Módulo 16.</small></span><span class="civil-step-status">${qs.length} no histórico · ${unresolved.length} ainda erradas</span><span>⌄</span></button>
 <div class="civil-step-body">${qs.length?`<div class="civil-error-list">${rows}</div>${civil16Ui.stage==='errors16'?`<div style="margin-top:9px">${civil16StageSession('errors16')}</div>`:''}`:'<div class="muted small">Nenhum erro registrado neste módulo ainda.</div>'}
 <label class="civil-manual-done"><input type="checkbox" ${done?'checked':''} onchange="civilSetModule('m16',{errorsReviewed:this.checked})"> Marcar minha revisão de erros como concluída</label></div></section>`
}
function civil16AnkiStep(){
 const id='anki16',m=civilModuleState('m16'),done=!!m.anki,open=localStorage.getItem(civil16StepOpenKey(id))==='1';
 const deck='04 DIREITO CIVIL::14 SUCESSÕES';
 return `<section class="civil-step ${done?'done':''} ${open?'open':''}" data-step="anki16"><button class="civil-step-head" onclick="toggleCivil16Step('anki16')"><span class="civil-step-n">${done?'✓':'8'}</span><span class="civil-step-title"><b>Anki seletivo</b><small>Baralho existente de Sucessões.</small></span><span class="civil-step-status">${done?'Concluído':'Pendente'}</span><span>⌄</span></button>
 <div class="civil-step-body"><p class="civil-anki-note">Abra <b>14 SUCESSÕES</b>. Priorize nesta rodada: saisine, cessão, renúncia, indignidade/deserdação, ordem da vocação, concorrência do cônjuge/companheiro, representação, legítima, testamento, redução, inventário, colação e partilha.</p>
 <div class="civil-stage-actions" style="margin-top:9px"><button class="civil-btn primary" onclick="window.openAnkiDeck('${escJs(deck)}')">🧠 Abrir baralho existente</button></div>
 <label class="civil-manual-done"><input type="checkbox" ${done?'checked':''} onchange="civilSetModule('m16',{anki:this.checked})"> Marcar revisão no Anki como concluída</label></div></section>`
}
function renderCivilModule16(){
 const pct=civilModulePct('m16');
 return `<div class="civil-overall"><span style="width:${pct}%"></span></div><div class="civil-scope-note"><span class="civil-scope-badge mix">EDITAL + COMPLEMENTAR</span><b>Escopo fechado do Módulo 16:</b> sucessão legítima e testamentária, herança, aceitação/renúncia, exclusão, jacência/vacância, petição de herança, inventário, arrolamentos, alvarás, colação, partilha e sobrepartilha. <b>Com este módulo, o curso de Direito Civil fecha os 16 módulos planejados.</b></div>
 <div class="civil-steps">
 ${civil16QuestionStep('diagnostic16','Diagnóstico FCC','10 questões reais antes da teoria.',1)}
 ${civil16ManualStep('reading16','Leitura orientada','CC Livro V + CPC do inventário + atualização CNJ.',2,civil16ReadingBody(),'reading')}
 ${civil16ManualStep('theory16','Teoria nuclear','Sucessões do início da saisine até a partilha.',3,civil16TheoryBody(),'theory')}
 ${civil16ManualStep('deep16','Aprofundamento e jurisprudência','STF/STJ, Lei 14.661/2023 e CNJ 571/2024.',4,civil16DeepBody(),'deep')}
 ${civil16QuestionStep('cases16','Casos práticos','5 casos autorais de nível Analista/Oficial.',5)}
 ${civil16QuestionStep('final16','Bateria final FCC','15 questões FCC reais após a teoria.',6)}
 ${civil16ErrorStep()}
 ${civil16AnkiStep()}
 </div>`
}

function renderCivilMaster(){
 const cs=civilCourseStats();
 return `<div class="civil-master"><div class="civil-master-intro"><div><span class="eyebrow">Curso avançado • Direito Civil</span><h3>16 módulos, construídos um por vez</h3><p>Todos os 16 módulos estão completos. Banco do curso: <b>400 questões reais</b> + <b>80 casos autorais</b>, com revisão automática de erros por módulo.</p></div><div class="civil-target"><span>Foco de nível</span><b>Analista / Oficial de Justiça</b></div></div>
 <div class="civil-edital-coverage"><div class="coverage-number">100%</div><div class="coverage-text"><b>92/92 itens textuais do edital mapeados no curso</b><span class="muted small">A versão anterior tinha lacunas em LINDB, fatos jurídicos, atos unilaterais, preferências, tutela/curatela/TDA, legislação especial e fechamento jurisprudencial. Esses pontos agora estão integrados aos 16 módulos. Jurisprudência continua sendo matéria dinâmica e deve ser atualizada perto da prova.</span></div><div class="coverage-legend"><span class="civil-scope-badge edital">EDITAL</span><span class="civil-scope-badge mix">EDITAL + COMPLEMENTAR</span></div></div>
 ${CIVIL_COURSE.modules.map(m=>{const active=m.status==='active',pct=active?civilModulePct(m.id):0,open=active&&localStorage.getItem(civilModuleOpenKey(m.id))==='1';return `<section class="civil-module ${open?'open':''}" data-civil="${m.id}"><button class="civil-module-head" ${active?`onclick="toggleCivilModule('${m.id}')"`:'disabled'}><span class="civil-module-num">MÓD. ${String(m.num).padStart(2,'0')}</span><span class="civil-module-title"><b>${esc(m.title)}</b><small>${esc(m.subtitle)}</small></span><span class="civil-module-state">${active?`<span>8 etapas</span><b class="civil-pct">${pct}%</b>`:'<span class="civil-planned">PLANEJADO</span>'}</span><span>${active?'⌄':''}</span></button>${active?`<div class="civil-module-body">${m.id==='m1'?renderCivilModule1():m.id==='m2'?renderCivilModule2():m.id==='m3'?renderCivilModule3():m.id==='m4'?renderCivilModule4():m.id==='m5'?renderCivilModule5():m.id==='m6'?renderCivilModule6():m.id==='m7'?renderCivilModule7():m.id==='m8'?renderCivilModule8():m.id==='m9'?renderCivilModule9():m.id==='m10'?renderCivilModule10():m.id==='m11'?renderCivilModule11():m.id==='m12'?renderCivilModule12():m.id==='m13'?renderCivilModule13():m.id==='m14'?renderCivilModule14():m.id==='m15'?renderCivilModule15():m.id==='m16'?renderCivilModule16():''}</div>`:''}</section>`}).join('')}</div>`
}


