function civilAnkiStep(){
 const id='anki',m=civilModuleState('m1'),done=!!m.anki,open=localStorage.getItem(civilStepOpenKey(id))==='1';
 const deck='04 DIREITO CIVIL::02 PESSOAS NATURAIS E DIREITOS DA PERSONALIDADE';
 return `<section class="civil-step ${done?'done':''} ${open?'open':''}" data-step="anki"><button class="civil-step-head" onclick="toggleCivilStep('anki')"><span class="civil-step-n">${done?'✓':'8'}</span><span class="civil-step-title"><b>Anki seletivo</b><small>Consolide os conceitos que realmente precisam de memória.</small></span><span class="civil-step-status">${done?'Concluído':'Pendente'}</span><span>⌄</span></button>
 <div class="civil-step-body"><p class="civil-anki-note"><b>Baralho já existente:</b> Pessoas Naturais e Direitos da Personalidade. Para este Módulo 1, concentre-se nos cards de personalidade, capacidade, emancipação, morte, comoriência e ausência. Os cards específicos de Direitos da Personalidade serão retomados no Módulo 2.</p>
 <div class="civil-stage-actions" style="margin-top:9px"><button class="civil-btn primary" onclick="saveLast({civilModule:'m1',title:'Direito Civil • Módulo 1 • Anki',at:Date.now()});window.openAnkiDeck('${escJs(deck)}')">🧠 Abrir baralho no Anki</button></div>
 <label class="civil-manual-done"><input type="checkbox" ${done?'checked':''} onchange="civilSetModule('m1',{anki:this.checked})"> Marcar revisão no Anki como concluída</label></div></section>`
}
function renderCivilModule1(){
 const pct=civilModulePct('m1');
 return `<div class="civil-overall"><span style="width:${pct}%"></span></div><div class="civil-scope-note"><span class="civil-scope-badge mix">EDITAL + COMPLEMENTAR</span><b>Escopo fechado do Módulo 1:</b> personalidade e capacidade da pessoa natural; incapacidade; emancipação; morte e morte presumida; comoriência; registros essenciais; ausência. <b>Direitos da Personalidade serão estudados no Módulo 2.</b></div>
 <div class="civil-steps">
 ${civilQuestionStep('diagnostic','Diagnóstico FCC','10 questões reais antes da teoria.',1)}
 ${civilManualStep('reading','Leitura orientada','Código Civil + LBI, com roteiro objetivo.',2,civilReadingBody(),'reading')}
 ${civilManualStep('theory','Teoria nuclear','Base completa para resolver questões de nível superior.',3,civilTheoryBody(),'theory')}
 ${civilManualStep('deep','Aprofundamento e jurisprudência','STJ, LBI e pegadinhas de prova.',4,civilDeepBody(),'deep')}
 ${civilQuestionStep('cases','Casos práticos','5 casos autorais claramente identificados.',5)}
 ${civilQuestionStep('final','Bateria final FCC','15 questões reais após a teoria.',6)}
 ${civilErrorStep()}
 ${civilAnkiStep()}
 </div>`
}

let civil2Ui={stage:null,index:0};
function civil2StepOpenKey(id){return `central-v6:civil-step:m2:${id}`}
function civil2StageQuestions(stage){
 if(stage==='diagnostic2')return CIVIL_COURSE.diagnostic2||[];
 if(stage==='final2')return CIVIL_COURSE.final2||[];
 if(stage==='cases2')return CIVIL_COURSE.cases2||[];
 if(stage==='errors2'){
   const all=[...(CIVIL_COURSE.diagnostic2||[]),...(CIVIL_COURSE.cases2||[]),...(CIVIL_COURSE.final2||[])];
   return all.filter(q=>civilAnswer(q.id)?.everWrong);
 }
 return[];
}
function civil2StageDone(stage){
 const qs=civil2StageQuestions(stage);return qs.length>0&&qs.every(q=>(civilAnswer(q.id)?.attempts||0)>0)
}
function civil2Steps(){
 const m=civilModuleState('m2');
 return [
  {id:'diagnostic2',done:civil2StageDone('diagnostic2')},
  {id:'reading2',done:!!m.reading},
  {id:'theory2',done:!!m.theory},
  {id:'deep2',done:!!m.deep},
  {id:'cases2',done:civil2StageDone('cases2')},
  {id:'final2',done:civil2StageDone('final2')},
  {id:'errors2',done:!!m.errorsReviewed},
  {id:'anki2',done:!!m.anki}
 ]
}
function toggleCivil2Step(id){
 const el=document.querySelector(`.civil-module[data-civil="m2"] .civil-step[data-step="${id}"]`);if(!el)return;
 const open=!el.classList.contains('open');el.classList.toggle('open',open);localStorage.setItem(civil2StepOpenKey(id),open?'1':'0')
}
function civil2OpenStage(stage){
 const qs=civil2StageQuestions(stage);if(!qs.length){civil2Ui={stage,index:0};renderSubjects();return}
 let idx=qs.findIndex(q=>(civilAnswer(q.id)?.attempts||0)===0);if(idx<0)idx=0;
 civil2Ui={stage,index:idx};localStorage.setItem(civil2StepOpenKey(stage),'1');renderSubjects();
 setTimeout(()=>document.querySelector(`.civil-module[data-civil="m2"] .civil-step[data-step="${stage}"]`)?.scrollIntoView({behavior:'smooth',block:'center'}),20)
}
function civil2Select(id,letter){
 const st=civilState(),a=st.answers[id]||{attempts:0,history:[],everWrong:false};
 if(a.submitted)return;a.selected=letter;a.submitted=false;st.answers[id]=a;civilSave(st);renderSubjects()
}
function civil2Submit(id,stage){
 const q=[...(CIVIL_COURSE.diagnostic2||[]),...(CIVIL_COURSE.cases2||[]),...(CIVIL_COURSE.final2||[])].find(x=>x.id===id);
 if(!q)return;const st=civilState(),a=st.answers[id]||{attempts:0,history:[],everWrong:false};
 if(!a.selected){alert('Escolha uma alternativa primeiro.');return}
 const correct=a.selected===q.answer;
 a.attempts=(a.attempts||0)+1;a.submitted=true;a.lastCorrect=correct;a.everWrong=!!a.everWrong||!correct;
 a.history=[...(a.history||[]),{at:new Date().toISOString(),selected:a.selected,correct,stage,module:'m2'}];
 st.answers[id]=a;civilSave(st);renderAll()
}
function civil2Retry(id){const st=civilState(),a=st.answers[id];if(!a)return;a.selected=null;a.submitted=false;st.answers[id]=a;civilSave(st);renderSubjects()}
function civil2Move(stage,delta){
 const qs=civil2StageQuestions(stage);if(!qs.length)return;
 civil2Ui.stage=stage;civil2Ui.index=Math.max(0,Math.min(qs.length-1,civil2Ui.index+delta));renderSubjects()
}
function civil2Accuracy(stage){
 const qs=civil2StageQuestions(stage),answered=qs.map(q=>civilAnswer(q.id)).filter(a=>a?.attempts);
 const correct=answered.filter(a=>a.lastCorrect).length;return {answered:answered.length,total:qs.length,correct,pct:answered.length?Math.round(correct/answered.length*100):0}
}
function civil2QuestionCard(q,stage,index,total){
 const a=civilAnswer(q.id)||{selected:null,submitted:false,attempts:0,history:[]},locked=!!a.submitted;
 const opts=Object.entries(q.options).map(([letter,text])=>{
  let cls='civil-option';if(a.selected===letter)cls+=' selected';
  if(locked&&letter===q.answer)cls+=' correct';else if(locked&&a.selected===letter&&letter!==q.answer)cls+=' wrong';
  return `<button class="${cls}" ${locked?'disabled':''} onclick="civil2Select('${escJs(q.id)}','${letter}')"><span class="civil-letter">${letter}</span><span>${esc(text)}</span></button>`
 }).join('');
 const feedback=locked?`<div class="civil-feedback ${a.lastCorrect?'good':'bad'}"><b>${a.lastCorrect?'✓ Resposta correta':'✕ Resposta incorreta — gabarito '+q.answer}</b>${esc(q.explanation)}<span class="basis">Fundamento: ${esc(q.basis)}${a.attempts>1?' · '+a.attempts+' tentativas':''}</span></div>`:'';
 return `<article class="civil-qcard">${civilQuestionMeta(q)}<h4>${esc(q.prompt)}</h4><div class="civil-options">${opts}</div>
 <div class="civil-submit-row"><div>${q.kind==='real'?`<a class="civil-source-link" href="${escAttr(q.url)}" target="_blank" rel="noopener">Fonte da questão no TEC ↗</a>`:'<span class="muted small">Caso criado para aplicação da regra.</span>'}</div>
 <div class="civil-qnav"><button class="civil-btn" onclick="civil2Move('${stage}',-1)" ${index===0?'disabled':''}>←</button><span>${index+1} / ${total}</span><button class="civil-btn" onclick="civil2Move('${stage}',1)" ${index===total-1?'disabled':''}>→</button></div>
 ${locked?`<button class="civil-btn" onclick="civil2Retry('${escJs(q.id)}')">Refazer</button>`:`<button class="civil-btn primary" onclick="civil2Submit('${escJs(q.id)}','${stage}')">Responder</button>`}
 </div>${feedback}</article>`
}
function civil2StageSession(stage){
 const qs=civil2StageQuestions(stage);if(!qs.length)return '<div class="muted small">Nenhuma questão disponível.</div>';
 if(civil2Ui.stage!==stage)civil2Ui={stage,index:Math.max(0,qs.findIndex(q=>(civilAnswer(q.id)?.attempts||0)===0))};
 civil2Ui.index=Math.max(0,Math.min(qs.length-1,civil2Ui.index));
 return civil2QuestionCard(qs[civil2Ui.index],stage,civil2Ui.index,qs.length)
}
function civil2QuestionStep(stage,title,subtitle,num){
 const stats=civil2Accuracy(stage),done=civil2StageDone(stage),open=localStorage.getItem(civil2StepOpenKey(stage))==='1',active=civil2Ui.stage===stage;
 return `<section class="civil-step ${done?'done':''} ${open?'open':''}" data-step="${stage}">
 <button class="civil-step-head" onclick="toggleCivil2Step('${stage}')"><span class="civil-step-n">${done?'✓':num}</span><span class="civil-step-title"><b>${esc(title)}</b><small>${esc(subtitle)}</small></span><span class="civil-step-status">${stats.answered}/${stats.total} respondidas${stats.answered?' · '+stats.pct+'%':''}</span><span>⌄</span></button>
 <div class="civil-step-body"><div class="civil-stage-toolbar"><p>${stage==='diagnostic2'?'Resolva antes da teoria para medir sua base real.':stage==='final2'?'Bateria posterior à teoria, com questões reais FCC de personalidade e pessoas jurídicas.':'Casos atuais para aplicar Código Civil e jurisprudência.'}</p><div class="civil-stage-actions"><button class="civil-btn primary" onclick="civil2OpenStage('${stage}')">${stats.answered?'Continuar':'Iniciar'}</button></div></div>${active?civil2StageSession(stage):''}</div></section>`
}
function civil2ManualStep(id,title,subtitle,num,body,field){
 const st=civilModuleState('m2'),done=!!st[field],open=localStorage.getItem(civil2StepOpenKey(id))==='1';
 return `<section class="civil-step ${done?'done':''} ${open?'open':''}" data-step="${id}">
 <button class="civil-step-head" onclick="toggleCivil2Step('${id}')"><span class="civil-step-n">${done?'✓':num}</span><span class="civil-step-title"><b>${esc(title)}</b><small>${esc(subtitle)}</small></span><span class="civil-step-status">${done?'Concluído':'Pendente'}</span><span>⌄</span></button>
 <div class="civil-step-body">${body}<label class="civil-manual-done"><input type="checkbox" ${done?'checked':''} onchange="civilSetModule('m2',{${field}:this.checked})"> Marcar esta etapa como concluída</label></div></section>`
}
function civil2ReadingBody(){
 return `<div class="civil-theory"><section><h4>Leitura orientada — Módulo 2</h4><div class="civil-law-grid">
 <div class="civil-law-card"><b>CC, arts. 11 a 21</b><span>Direitos da personalidade: corpo, nome, pseudônimo, imagem, honra e vida privada.</span></div>
 <div class="civil-law-card"><b>CC, arts. 40 a 52</b><span>Pessoas jurídicas: classificação, registro, autonomia patrimonial, desconsideração e proteção da personalidade.</span></div>
 <div class="civil-law-card"><b>CC, arts. 53 a 69</b><span>Associações e fundações.</span></div>
 </div><p><strong>Complementos atuais:</strong> Lei de Registros Públicos, art. 56 (alteração imotivada do prenome); STF Temas 786, 952 e 1103; STJ Súmulas 227 e 403.</p>
 <div class="civil-stage-actions"><button class="civil-btn primary" onclick="saveLast({civilModule:'m2',title:'Direito Civil • Módulo 2 • Leitura no Vade Mecum',at:Date.now()});openVadeMecum(null,'cc')">📖 Abrir Código Civil no Vade Mecum</button></div>
 <div class="civil-alert"><b>Não avance ao domicílio.</b> O art. 70 em diante pertence ao Módulo 3. Aqui a leitura termina no art. 69.</div></section></div>`
}
function civil2TheoryBody(){
 return `<div class="civil-theory">
 <section><h4>1. Direitos da personalidade — estrutura</h4><p>São posições jurídicas ligadas aos atributos essenciais da pessoa. O Código não oferece lista fechada; disciplina um núcleo nos arts. 11 a 21. Como regra, são <strong>intransmissíveis e irrenunciáveis</strong> e o exercício não pode sofrer limitação voluntária, ressalvados os casos previstos em lei.</p><p>A tutela pode ser preventiva e reparatória: é possível exigir cessação da ameaça ou lesão e reclamar perdas e danos.</p></section>
 <section><h4>2. Proteção depois da morte</h4><table class="civil-compare"><tr><th>Art. 12</th><th>Art. 20, parágrafo único</th></tr><tr><td>Cessação de ameaça/lesão em geral: cônjuge sobrevivente, parentes em linha reta e colaterais até o 4º grau.</td><td>Proteção específica de escritos, palavra e imagem do morto ou ausente: cônjuge, ascendentes ou descendentes.</td></tr></table><div class="civil-alert">A FCC gosta de trocar os legitimados do art. 12 pelos do art. 20.</div></section>
 <section><h4>3. Corpo e autonomia</h4><ul><li><strong>Art. 13:</strong> salvo exigência médica, é vedada a disposição do corpo que implique diminuição permanente da integridade física ou contrarie os bons costumes; transplantes seguem lei especial.</li><li><strong>Art. 14:</strong> é válida a disposição <strong>gratuita</strong> do corpo, após a morte, com objetivo científico ou altruístico; pode ser revogada a qualquer tempo.</li><li><strong>Art. 15:</strong> ninguém pode ser constrangido a tratamento médico ou intervenção cirúrgica com risco de vida.</li></ul></section>
 <section><h4>4. Nome, pseudônimo, imagem e vida privada</h4><ul><li>Nome compreende prenome e sobrenome.</li><li>Nome não pode ser usado para expor a pessoa ao desprezo público, mesmo sem intenção difamatória.</li><li>Sem autorização, não se usa nome alheio em propaganda comercial.</li><li>Pseudônimo lícito recebe a proteção do nome.</li><li>Imagem, escritos e palavra recebem tutela contra usos lesivos ou comerciais, observadas as exceções legais e constitucionais.</li><li>A vida privada é inviolável.</li></ul><p><strong>Atualização registral:</strong> depois da maioridade, é possível requerer imotivadamente alteração do prenome pela via extrajudicial uma única vez, independentemente de decisão judicial.</p></section>
 <section><h4>5. Pessoas jurídicas — classificação atual</h4><table class="civil-compare"><tr><th>Direito público interno</th><th>Direito público externo</th><th>Direito privado</th></tr><tr><td>União; Estados, DF e Territórios; Municípios; autarquias, inclusive associações públicas; demais entidades públicas criadas por lei.</td><td>Estados estrangeiros e pessoas regidas pelo direito internacional público.</td><td>Associações; sociedades; fundações; organizações religiosas; partidos políticos; <strong>empreendimentos de economia solidária</strong>.</td></tr></table></section>
 <section><h4>6. Nascimento, registro e atuação</h4><ul><li>A existência legal da pessoa jurídica privada começa com a inscrição do ato constitutivo no registro competente.</li><li>O direito de anular sua constituição por defeito do ato decai em <strong>3 anos</strong> da publicação da inscrição.</li><li>O registro deve trazer os elementos do art. 46, inclusive administração, representação e condições de extinção.</li><li>Atos dos administradores obrigam a pessoa jurídica quando exercidos nos limites de seus poderes.</li><li>Administração coletiva: maioria dos presentes, salvo regra diferente no ato constitutivo.</li><li>Assembleias gerais podem ocorrer eletronicamente, preservados participação e manifestação.</li></ul></section>
 <section><h4>7. Autonomia patrimonial e desconsideração</h4><p>O art. 49-A afirma que a pessoa jurídica não se confunde com sócios, associados, instituidores ou administradores. A autonomia patrimonial é instrumento lícito de segregação de riscos.</p><p>A desconsideração exige <strong>abuso da personalidade</strong>, caracterizado por desvio de finalidade ou confusão patrimonial. A extensão alcança administradores ou sócios beneficiados direta ou indiretamente pelo abuso.</p><table class="civil-compare"><tr><th>Desvio de finalidade</th><th>Confusão patrimonial</th></tr><tr><td>Uso da pessoa jurídica com propósito de lesar credores e praticar atos ilícitos.</td><td>Ausência de separação fática entre patrimônios, demonstrada pelas hipóteses do §2º do art. 50.</td></tr></table><div class="civil-alert">Mera existência de grupo econômico não basta. Mera expansão ou alteração da finalidade econômica original também não constitui, por si só, desvio de finalidade.</div></section>
 <section><h4>8. Pessoas jurídicas e direitos da personalidade</h4><p>O art. 52 estende às pessoas jurídicas, <strong>no que couber</strong>, a proteção dos direitos da personalidade. Isso explica a tutela de honra objetiva, nome e reputação institucional e se conecta à possibilidade de dano moral da pessoa jurídica.</p></section>
 <section><h4>9. Associações</h4><ul><li>União de pessoas organizada para fins não econômicos.</li><li>Associados têm iguais direitos, mas estatuto pode criar categorias com vantagens especiais.</li><li>A qualidade de associado é intransmissível, salvo disposição estatutária em contrário.</li><li>Exclusão: justa causa + procedimento com defesa e recurso.</li><li>Compete privativamente à assembleia geral destituir administradores e alterar estatuto.</li><li>Um quinto dos associados tem direito de promover convocação dos órgãos deliberativos.</li></ul></section>
 <section><h4>10. Fundações</h4><p>A fundação nasce de dotação especial de bens livres, por escritura pública ou testamento, para uma das finalidades legalmente previstas. Se os bens forem insuficientes e o instituidor não dispuser de outra forma, incorporam-se a outra fundação de fim igual ou semelhante.</p><p>O Ministério Público vela pelas fundações. A reforma estatutária exige deliberação de dois terços, respeito à finalidade e aprovação do MP em até 45 dias, com possibilidade de suprimento judicial.</p></section>
 </div>`
}
function civil2DeepBody(){
 return `<div class="civil-theory">
 <section class="civil-juris"><h4>Jurisprudência 1 — direito ao esquecimento</h4><p>No <strong>Tema 786</strong>, o STF rejeitou um direito ao esquecimento entendido como poder de impedir, apenas pela passagem do tempo, divulgação de fatos verídicos e licitamente obtidos. Isso não libera abusos: honra, imagem, privacidade e personalidade continuam protegidas e os excessos são examinados caso a caso.</p></section>
 <section class="civil-juris"><h4>Jurisprudência 2 — recusa de transfusão por Testemunha de Jeová</h4><p>No <strong>Tema 952</strong>, o STF reconheceu que Testemunhas de Jeová maiores e capazes podem recusar transfusão de sangue com base na autonomia e liberdade religiosa. Também reconheceu o acesso a procedimentos alternativos disponíveis no SUS.</p></section>
 <section class="civil-juris"><h4>Jurisprudência 3 — vacinação de menores</h4><p>No <strong>Tema 1103</strong>, o STF considerou constitucional a vacinação obrigatória nas hipóteses fixadas pela tese, não prevalecendo convicções filosóficas, religiosas ou existenciais dos pais contra a imunização obrigatória que atenda aos requisitos definidos.</p></section>
 <section class="civil-juris"><h4>Jurisprudência 4 — imagem e dano moral</h4><p><strong>STJ Súmula 403:</strong> na publicação não autorizada da imagem para fins econômicos ou comerciais, a indenização independe da prova concreta do prejuízo.</p><p><strong>STJ Súmula 227:</strong> a pessoa jurídica pode sofrer dano moral, compatibilizando-se com o art. 52 do Código Civil.</p></section>
 <section><h4>Pegadinhas de nível superior</h4><table class="civil-compare"><tr><th>Pegadinha</th><th>Regra correta</th></tr>
 <tr><td>Direitos da personalidade são sempre, sem exceção, intransmissíveis e irrenunciáveis.</td><td>O próprio art. 11 começa com a ressalva dos casos previstos em lei.</td></tr>
 <tr><td>Direito ao esquecimento é direito fundamental autônomo reconhecido pelo STF.</td><td>O Tema 786 rejeitou essa formulação.</td></tr>
 <tr><td>Pessoa jurídica não sofre dano moral.</td><td>Art. 52 + Súmula 227/STJ.</td></tr>
 <tr><td>CNPJ cria a personalidade jurídica.</td><td>O marco é a inscrição do ato constitutivo no registro competente.</td></tr>
 <tr><td>Organização religiosa e partido político são pessoas de direito público.</td><td>São pessoas jurídicas de direito privado.</td></tr>
 <tr><td>Grupo econômico autoriza automaticamente desconsideração.</td><td>Sem desvio de finalidade ou confusão patrimonial, não autoriza.</td></tr>
 <tr><td>Associação pode excluir associado livremente se o estatuto autorizar.</td><td>Exige justa causa, defesa e recurso.</td></tr>
 <tr><td>Fundação pode ter qualquer finalidade lícita.</td><td>O art. 62 traz finalidades legalmente delimitadas.</td></tr></table></section>
 </div>`
}
function civil2ErrorStep(){
 const id='errors2',m=civilModuleState('m2'),done=!!m.errorsReviewed,open=localStorage.getItem(civil2StepOpenKey(id))==='1';
 const qs=civil2StageQuestions('errors2'),unresolved=qs.filter(q=>civilAnswer(q.id)?.lastCorrect===false);
 const rows=qs.map((q,i)=>{const a=civilAnswer(q.id);return `<div class="civil-error-row"><div><b>${q.kind==='real'?'FCC':'Autoral'} • ${esc(q.subject)}</b><small>${a?.lastCorrect?'Corrigida na última tentativa':'Ainda errada na última tentativa'} · ${a?.attempts||0} tentativa(s)</small></div><button class="civil-btn" onclick="civil2Ui={stage:'errors2',index:${i}};localStorage.setItem(civil2StepOpenKey('errors2'),'1');renderSubjects()">Revisar</button></div>`}).join('');
 return `<section class="civil-step ${done?'done':''} ${open?'open':''}" data-step="errors2"><button class="civil-step-head" onclick="toggleCivil2Step('errors2')"><span class="civil-step-n">${done?'✓':'7'}</span><span class="civil-step-title"><b>Revisão de erros</b><small>Reveja apenas o que já errou neste módulo.</small></span><span class="civil-step-status">${qs.length} no histórico · ${unresolved.length} ainda erradas</span><span>⌄</span></button>
 <div class="civil-step-body">${qs.length?`<div class="civil-error-list">${rows}</div>${civil2Ui.stage==='errors2'?`<div style="margin-top:9px">${civil2StageSession('errors2')}</div>`:''}`:'<div class="muted small">Nenhum erro registrado neste módulo ainda.</div>'}
 <label class="civil-manual-done"><input type="checkbox" ${done?'checked':''} onchange="civilSetModule('m2',{errorsReviewed:this.checked})"> Marcar minha revisão de erros como concluída</label></div></section>`
}
function civil2AnkiStep(){
 const id='anki2',m=civilModuleState('m2'),done=!!m.anki,open=localStorage.getItem(civil2StepOpenKey(id))==='1';
 const deck1='04 DIREITO CIVIL::02 PESSOAS NATURAIS E DIREITOS DA PERSONALIDADE';
 const deck2='04 DIREITO CIVIL::03 PESSOAS JURÍDICAS E DOMICÍLIO';
 return `<section class="civil-step ${done?'done':''} ${open?'open':''}" data-step="anki2"><button class="civil-step-head" onclick="toggleCivil2Step('anki2')"><span class="civil-step-n">${done?'✓':'8'}</span><span class="civil-step-title"><b>Anki seletivo</b><small>Dois baralhos reais já existentes na sua coleção.</small></span><span class="civil-step-status">${done?'Concluído':'Pendente'}</span><span>⌄</span></button>
 <div class="civil-step-body"><p class="civil-anki-note">Para este módulo, use <b>Pessoas Naturais e Direitos da Personalidade</b> somente nos cards dos arts. 11 a 21 e <b>Pessoas Jurídicas e Domicílio</b> somente nos cards de pessoas jurídicas. Domicílio ficará para o Módulo 3.</p>
 <div class="civil-stage-actions" style="margin-top:9px"><button class="civil-btn primary" onclick="window.openAnkiDeck('${escJs(deck1)}')">🧠 Direitos da Personalidade</button><button class="civil-btn primary" onclick="window.openAnkiDeck('${escJs(deck2)}')">🧠 Pessoas Jurídicas</button></div>
 <label class="civil-manual-done"><input type="checkbox" ${done?'checked':''} onchange="civilSetModule('m2',{anki:this.checked})"> Marcar revisão no Anki como concluída</label></div></section>`
}
function renderCivilModule2(){
 const pct=civilModulePct('m2');
 return `<div class="civil-overall"><span style="width:${pct}%"></span></div><div class="civil-scope-note"><span class="civil-scope-badge edital">EDITAL</span><b>Escopo fechado do Módulo 2:</b> direitos da personalidade (CC 11-21) e pessoas jurídicas (CC 40-69), incluindo associações, fundações, autonomia patrimonial e desconsideração. <b>Domicílio começa apenas no Módulo 3.</b></div>
 <div class="civil-steps">
 ${civil2QuestionStep('diagnostic2','Diagnóstico FCC','10 questões reais antes da teoria.',1)}
 ${civil2ManualStep('reading2','Leitura orientada','CC 11-21 e 40-69 + complementos atuais.',2,civil2ReadingBody(),'reading')}
 ${civil2ManualStep('theory2','Teoria nuclear','Base completa e atualizada para nível superior.',3,civil2TheoryBody(),'theory')}
 ${civil2ManualStep('deep2','Aprofundamento e jurisprudência','STF, STJ e pegadinhas de prova.',4,civil2DeepBody(),'deep')}
 ${civil2QuestionStep('cases2','Casos práticos','5 casos autorais identificados.',5)}
 ${civil2QuestionStep('final2','Bateria final FCC','15 questões reais após a teoria.',6)}
 ${civil2ErrorStep()}
 ${civil2AnkiStep()}
 </div>`
}


let civil3Ui={stage:null,index:0};
function civil3StepOpenKey(id){return `central-v6:civil-step:m3:${id}`}
function civil3StageQuestions(stage){
 if(stage==='diagnostic3')return CIVIL_COURSE.diagnostic3||[];
 if(stage==='final3')return CIVIL_COURSE.final3||[];
 if(stage==='cases3')return CIVIL_COURSE.cases3||[];
 if(stage==='errors3'){
   const all=[...(CIVIL_COURSE.diagnostic3||[]),...(CIVIL_COURSE.cases3||[]),...(CIVIL_COURSE.final3||[])];
   return all.filter(q=>civilAnswer(q.id)?.everWrong);
 }
 return[];
}
function civil3StageDone(stage){
 const qs=civil3StageQuestions(stage);return qs.length>0&&qs.every(q=>(civilAnswer(q.id)?.attempts||0)>0)
}
function civil3Steps(){
 const m=civilModuleState('m3');
 return [
  {id:'diagnostic3',done:civil3StageDone('diagnostic3')},
  {id:'reading3',done:!!m.reading},
  {id:'theory3',done:!!m.theory},
  {id:'deep3',done:!!m.deep},
  {id:'cases3',done:civil3StageDone('cases3')},
  {id:'final3',done:civil3StageDone('final3')},
  {id:'errors3',done:!!m.errorsReviewed},
  {id:'anki3',done:!!m.anki}
 ]
}
function toggleCivil3Step(id){
 const el=document.querySelector(`.civil-module[data-civil="m3"] .civil-step[data-step="${id}"]`);if(!el)return;
 const open=!el.classList.contains('open');el.classList.toggle('open',open);localStorage.setItem(civil3StepOpenKey(id),open?'1':'0')
}
function civil3OpenStage(stage){
 const qs=civil3StageQuestions(stage);if(!qs.length){civil3Ui={stage,index:0};renderSubjects();return}
 let idx=qs.findIndex(q=>(civilAnswer(q.id)?.attempts||0)===0);if(idx<0)idx=0;
 civil3Ui={stage,index:idx};localStorage.setItem(civil3StepOpenKey(stage),'1');renderSubjects();
 setTimeout(()=>document.querySelector(`.civil-module[data-civil="m3"] .civil-step[data-step="${stage}"]`)?.scrollIntoView({behavior:'smooth',block:'center'}),20)
}
function civil3Select(id,letter){
 const st=civilState(),a=st.answers[id]||{attempts:0,history:[],everWrong:false};
 if(a.submitted)return;a.selected=letter;a.submitted=false;st.answers[id]=a;civilSave(st);renderSubjects()
}
function civil3Submit(id,stage){
 const q=[...(CIVIL_COURSE.diagnostic3||[]),...(CIVIL_COURSE.cases3||[]),...(CIVIL_COURSE.final3||[])].find(x=>x.id===id);
 if(!q)return;const st=civilState(),a=st.answers[id]||{attempts:0,history:[],everWrong:false};
 if(!a.selected){alert('Escolha uma alternativa primeiro.');return}
 const correct=a.selected===q.answer;
 a.attempts=(a.attempts||0)+1;a.submitted=true;a.lastCorrect=correct;a.everWrong=!!a.everWrong||!correct;
 a.history=[...(a.history||[]),{at:new Date().toISOString(),selected:a.selected,correct,stage,module:'m3'}];
 st.answers[id]=a;civilSave(st);renderAll()
}
function civil3Retry(id){const st=civilState(),a=st.answers[id];if(!a)return;a.selected=null;a.submitted=false;st.answers[id]=a;civilSave(st);renderSubjects()}
function civil3Move(stage,delta){
 const qs=civil3StageQuestions(stage);if(!qs.length)return;
 civil3Ui.stage=stage;civil3Ui.index=Math.max(0,Math.min(qs.length-1,civil3Ui.index+delta));renderSubjects()
}
function civil3Accuracy(stage){
 const qs=civil3StageQuestions(stage),answered=qs.map(q=>civilAnswer(q.id)).filter(a=>a?.attempts);
 const correct=answered.filter(a=>a.lastCorrect).length;return {answered:answered.length,total:qs.length,correct,pct:answered.length?Math.round(correct/answered.length*100):0}
}
function civil3QuestionCard(q,stage,index,total){
 const a=civilAnswer(q.id)||{selected:null,submitted:false,attempts:0,history:[]},locked=!!a.submitted;
 const opts=Object.entries(q.options).map(([letter,text])=>{
  let cls='civil-option';if(a.selected===letter)cls+=' selected';
  if(locked&&letter===q.answer)cls+=' correct';else if(locked&&a.selected===letter&&letter!==q.answer)cls+=' wrong';
  return `<button class="${cls}" ${locked?'disabled':''} onclick="civil3Select('${escJs(q.id)}','${letter}')"><span class="civil-letter">${letter}</span><span>${esc(text)}</span></button>`
 }).join('');
 const feedback=locked?`<div class="civil-feedback ${a.lastCorrect?'good':'bad'}"><b>${a.lastCorrect?'✓ Resposta correta':'✕ Resposta incorreta — gabarito '+q.answer}</b>${esc(q.explanation)}<span class="basis">Fundamento: ${esc(q.basis)}${a.attempts>1?' · '+a.attempts+' tentativas':''}</span></div>`:'';
 return `<article class="civil-qcard">${civilQuestionMeta(q)}<h4>${esc(q.prompt)}</h4><div class="civil-options">${opts}</div>
 <div class="civil-submit-row"><div>${q.kind==='real'?`<a class="civil-source-link" href="${escAttr(q.url)}" target="_blank" rel="noopener">Fonte da questão no TEC ↗</a>`:'<span class="muted small">Caso criado para aplicação da regra.</span>'}</div>
 <div class="civil-qnav"><button class="civil-btn" onclick="civil3Move('${stage}',-1)" ${index===0?'disabled':''}>←</button><span>${index+1} / ${total}</span><button class="civil-btn" onclick="civil3Move('${stage}',1)" ${index===total-1?'disabled':''}>→</button></div>
 ${locked?`<button class="civil-btn" onclick="civil3Retry('${escJs(q.id)}')">Refazer</button>`:`<button class="civil-btn primary" onclick="civil3Submit('${escJs(q.id)}','${stage}')">Responder</button>`}
 </div>${feedback}</article>`
}
function civil3StageSession(stage){
 const qs=civil3StageQuestions(stage);if(!qs.length)return '<div class="muted small">Nenhuma questão disponível.</div>';
 if(civil3Ui.stage!==stage)civil3Ui={stage,index:Math.max(0,qs.findIndex(q=>(civilAnswer(q.id)?.attempts||0)===0))};
 civil3Ui.index=Math.max(0,Math.min(qs.length-1,civil3Ui.index));
 return civil3QuestionCard(qs[civil3Ui.index],stage,civil3Ui.index,qs.length)
}
function civil3QuestionStep(stage,title,subtitle,num){
 const stats=civil3Accuracy(stage),done=civil3StageDone(stage),open=localStorage.getItem(civil3StepOpenKey(stage))==='1',active=civil3Ui.stage===stage;
 return `<section class="civil-step ${done?'done':''} ${open?'open':''}" data-step="${stage}">
 <button class="civil-step-head" onclick="toggleCivil3Step('${stage}')"><span class="civil-step-n">${done?'✓':num}</span><span class="civil-step-title"><b>${esc(title)}</b><small>${esc(subtitle)}</small></span><span class="civil-step-status">${stats.answered}/${stats.total} respondidas${stats.answered?' · '+stats.pct+'%':''}</span><span>⌄</span></button>
 <div class="civil-step-body"><div class="civil-stage-toolbar"><p>${stage==='diagnostic3'?'Resolva sem consultar o Código para medir sua base em domicílio e bens.':stage==='final3'?'Bateria posterior à teoria com peso forte em Analista e Oficial de Justiça.':'Casos para aplicar classificação de bens, pertenças e afetação/desafetação.'}</p><div class="civil-stage-actions"><button class="civil-btn primary" onclick="civil3OpenStage('${stage}')">${stats.answered?'Continuar':'Iniciar'}</button></div></div>${active?civil3StageSession(stage):''}</div></section>`
}
function civil3ManualStep(id,title,subtitle,num,body,field){
 const st=civilModuleState('m3'),done=!!st[field],open=localStorage.getItem(civil3StepOpenKey(id))==='1';
 return `<section class="civil-step ${done?'done':''} ${open?'open':''}" data-step="${id}">
 <button class="civil-step-head" onclick="toggleCivil3Step('${id}')"><span class="civil-step-n">${done?'✓':num}</span><span class="civil-step-title"><b>${esc(title)}</b><small>${esc(subtitle)}</small></span><span class="civil-step-status">${done?'Concluído':'Pendente'}</span><span>⌄</span></button>
 <div class="civil-step-body">${body}<label class="civil-manual-done"><input type="checkbox" ${done?'checked':''} onchange="civilSetModule('m3',{${field}:this.checked})"> Marcar esta etapa como concluída</label></div></section>`
}
function civil3ReadingBody(){
 return `<div class="civil-theory"><section><h4>Leitura orientada — Módulo 3</h4><div class="civil-law-grid">
 <div class="civil-law-card"><b>CC, arts. 70 a 78</b><span>Domicílio da pessoa natural e jurídica, domicílio necessário e domicílio contratual.</span></div>
 <div class="civil-law-card"><b>CC, arts. 79 a 97</b><span>Imóveis/móveis, fungíveis/infungíveis, consumíveis, divisíveis, singulares/coletivos, pertenças e benfeitorias.</span></div>
 <div class="civil-law-card"><b>CC, arts. 98 a 103</b><span>Bens públicos: uso comum, uso especial, dominicais, alienação, usucapião e uso.</span></div>
 </div><div class="civil-stage-actions"><button class="civil-btn primary" onclick="saveLast({civilModule:'m3',title:'Direito Civil • Módulo 3 • Leitura no Vade Mecum',at:Date.now()});openVadeMecum(null,'cc')">📖 Abrir Código Civil no Vade Mecum</button></div>
 <div class="civil-alert"><b>Pare no art. 103.</b> O art. 104 já inicia Negócio Jurídico, que pertence ao Módulo 4.</div></section></div>`
}
function civil3TheoryBody(){
 return `<div class="civil-theory">
 <section><h4>1. Domicílio: residência + intenção</h4><p>O domicílio da pessoa natural é o local em que estabelece residência com <strong>ânimo definitivo</strong>. Residência é elemento fático; domicílio adiciona relevância jurídica e intenção de permanência.</p><ul><li>Várias residências alternadas → qualquer delas é domicílio.</li><li>Sem residência habitual → domicílio é o lugar onde a pessoa for encontrada.</li><li>Mudança de domicílio exige transferência da residência com intenção manifesta de mudar.</li></ul></section>
 <section><h4>2. Domicílio profissional</h4><p>O lugar em que a profissão é exercida também é domicílio, <strong>somente para as relações concernentes à profissão</strong>. Se houver atividade profissional em vários lugares, cada local é domicílio para as relações correspondentes.</p><div class="civil-alert">A FCC explora muito a coexistência de domicílio residencial e profissional.</div></section>
 <section><h4>3. Pessoa jurídica e pluralidade</h4><p>União → DF; Estados/Territórios → capitais; Município → sede da administração; demais pessoas jurídicas → local da diretoria/administração ou domicílio especial eleito no estatuto/ato constitutivo.</p><p>Se a pessoa jurídica tiver estabelecimentos em lugares diferentes, <strong>cada estabelecimento é domicílio para os atos nele praticados</strong>.</p></section>
 <section><h4>4. Domicílio necessário e especial</h4><table class="civil-compare"><tr><th>Pessoa</th><th>Domicílio necessário</th></tr>
 <tr><td>Incapaz</td><td>Do representante ou assistente.</td></tr>
 <tr><td>Servidor público</td><td>Onde exerce permanentemente suas funções.</td></tr>
 <tr><td>Militar</td><td>Onde serve; Marinha/Aeronáutica: sede do comando imediato.</td></tr>
 <tr><td>Marítimo</td><td>Onde o navio estiver matriculado.</td></tr>
 <tr><td>Preso</td><td>Onde cumpre a sentença.</td></tr></table>
 <p>Nos contratos escritos, as partes podem especificar domicílio para exercício e cumprimento dos direitos e obrigações resultantes do negócio.</p></section>

 <section><h4>5. Imóveis e móveis</h4><table class="civil-compare"><tr><th>Imóveis</th><th>Móveis</th></tr>
 <tr><td>Solo e incorporações naturais/artificiais.</td><td>Bens suscetíveis de movimento próprio ou remoção sem alteração da substância/destinação.</td></tr>
 <tr><td>Direitos reais sobre imóveis e ações que os asseguram.</td><td>Energias com valor econômico.</td></tr>
 <tr><td><strong>Direito à sucessão aberta.</strong></td><td>Direitos reais sobre objetos móveis e ações correspondentes.</td></tr>
 <tr><td>Edificação removida, conservando unidade; material separado provisoriamente para reemprego.</td><td>Direitos pessoais patrimoniais e ações; materiais de demolição.</td></tr></table></section>

 <section><h4>6. Fungível, consumível e divisível — não confundir</h4><ul><li><strong>Fungível:</strong> somente móvel; pode ser substituído por outro da mesma espécie, qualidade e quantidade.</li><li><strong>Consumível:</strong> móvel cujo uso destrói imediatamente a substância; também o destinado à alienação.</li><li><strong>Divisível:</strong> pode fracionar-se sem alteração da substância, diminuição considerável de valor ou prejuízo ao uso.</li><li>Bens naturalmente divisíveis podem tornar-se indivisíveis por lei ou vontade das partes.</li></ul></section>

 <section><h4>7. Singulares e coletivos</h4><table class="civil-compare"><tr><th>Universalidade de fato</th><th>Universalidade de direito</th></tr>
 <tr><td>Pluralidade de bens singulares da mesma pessoa, com destinação unitária.</td><td>Complexo de relações jurídicas de uma pessoa, dotadas de valor econômico.</td></tr></table></section>

 <section><h4>8. Principal, acessório e pertença</h4><p>Principal existe sobre si; acessório supõe o principal. <strong>Pertença</strong> não é parte integrante: destina-se duradouramente ao uso, serviço ou aformoseamento de outro bem.</p><p>Regra do art. 94: negócio do principal <strong>não abrange automaticamente a pertença</strong>, salvo lei, vontade ou circunstâncias do caso.</p></section>

 <section><h4>9. Benfeitorias</h4><table class="civil-compare"><tr><th>Voluptuária</th><th>Útil</th><th>Necessária</th></tr>
 <tr><td>Mero deleite/recreio, sem aumentar uso habitual, ainda que torne o bem agradável ou tenha alto valor.</td><td>Aumenta ou facilita o uso do bem.</td><td>Conserva o bem ou evita deterioração.</td></tr></table>
 <p>Melhoramentos ou acréscimos que surgem <strong>sem intervenção</strong> do proprietário, possuidor ou detentor não são benfeitorias.</p></section>

 <section><h4>10. Bens públicos</h4><table class="civil-compare"><tr><th>Uso comum do povo</th><th>Uso especial</th><th>Dominicais</th></tr>
 <tr><td>Rios, mares, estradas, ruas, praças.</td><td>Edifícios/terrenos destinados a serviço ou estabelecimento público.</td><td>Patrimônio disponível da pessoa jurídica de direito público, como objeto de direito pessoal ou real.</td></tr></table>
 <ul><li>Uso comum + uso especial: inalienáveis enquanto conservarem a qualificação.</li><li>Dominicais: podem ser alienados conforme a lei.</li><li><strong>Nenhum bem público está sujeito a usucapião.</strong></li><li>Uso comum pode ser gratuito ou retribuído.</li></ul></section>
 </div>`
}
function civil3DeepBody(){
 return `<div class="civil-theory">
 <section class="civil-juris"><h4>Aprofundamento 1 — afetação e desafetação</h4><p><strong>Afetação</strong> é a vinculação do bem público a uma finalidade pública. Em linguagem prática, bens de uso comum e de uso especial estão afetados.</p><p><strong>Desafetação</strong> é a retirada dessa destinação. Um bem antes de uso comum ou especial pode passar à categoria dominical, observada a forma juridicamente adequada.</p><div class="civil-alert">A desafetação <b>não transforma o bem em particular</b>. Ele continua público; o efeito central é permitir que, como dominical, possa ser alienado se cumpridas as exigências legais.</div></section>

 <section class="civil-juris"><h4>Aprofundamento 2 — alienabilidade × usucapião</h4><p>Não confunda os dois planos. O bem dominical pode ser <strong>alienável</strong>, mas continua <strong>insuscetível de usucapião</strong>. O art. 102 não distingue a categoria do bem público.</p></section>

 <section class="civil-juris"><h4>Aprofundamento 3 — imóvel por determinação legal</h4><p>O direito à sucessão aberta é tratado como imóvel independentemente da composição concreta da herança. É uma ficção legal que aparece repetidamente nas questões FCC de Analista e Oficial.</p></section>

 <section class="civil-juris"><h4>Aprofundamento 4 — bens que mudam de classificação física sem mudar juridicamente</h4><p>Edificação removida do solo sem perda de unidade continua imóvel. Da mesma forma, material separado provisoriamente de prédio para nele ser reempregado não perde o caráter imobiliário. Já material proveniente de demolição é móvel.</p></section>

 <section><h4>Mapa de pegadinhas</h4><table class="civil-compare"><tr><th>Pegadinha</th><th>Regra correta</th></tr>
 <tr><td>Várias residências obrigam escolher uma só como domicílio.</td><td>Qualquer residência em que viva alternadamente pode ser domicílio.</td></tr>
 <tr><td>Estabelecimento de pessoa jurídica nunca cria domicílio próprio.</td><td>Cada estabelecimento é domicílio para os atos nele praticados.</td></tr>
 <tr><td>Energia com valor econômico é imóvel.</td><td>É móvel por determinação legal.</td></tr>
 <tr><td>Direito à sucessão aberta é móvel porque pode envolver dinheiro.</td><td>É imóvel por determinação legal.</td></tr>
 <tr><td>Fungibilidade e consumibilidade são a mesma coisa.</td><td>São classificações diferentes.</td></tr>
 <tr><td>Pertença acompanha sempre o principal.</td><td>Regra: não acompanha automaticamente.</td></tr>
 <tr><td>Todo acréscimo no bem é benfeitoria.</td><td>Sem intervenção humana indicada no art. 97, não é benfeitoria.</td></tr>
 <tr><td>Bem dominical pode ser usucapido porque é disponível.</td><td>Nenhum bem público pode ser usucapido.</td></tr>
 <tr><td>Desafetação torna o bem particular.</td><td>Ele continua público, agora sem destinação específica.</td></tr></table></section>
 </div>`
}
function civil3ErrorStep(){
 const id='errors3',m=civilModuleState('m3'),done=!!m.errorsReviewed,open=localStorage.getItem(civil3StepOpenKey(id))==='1';
 const qs=civil3StageQuestions('errors3'),unresolved=qs.filter(q=>civilAnswer(q.id)?.lastCorrect===false);
 const rows=qs.map((q,i)=>{const a=civilAnswer(q.id);return `<div class="civil-error-row"><div><b>${q.kind==='real'?'FCC':'Autoral'} • ${esc(q.subject)}</b><small>${a?.lastCorrect?'Corrigida na última tentativa':'Ainda errada na última tentativa'} · ${a?.attempts||0} tentativa(s)</small></div><button class="civil-btn" onclick="civil3Ui={stage:'errors3',index:${i}};localStorage.setItem(civil3StepOpenKey('errors3'),'1');renderSubjects()">Revisar</button></div>`}).join('');
 return `<section class="civil-step ${done?'done':''} ${open?'open':''}" data-step="errors3"><button class="civil-step-head" onclick="toggleCivil3Step('errors3')"><span class="civil-step-n">${done?'✓':'7'}</span><span class="civil-step-title"><b>Revisão de erros</b><small>Somente erros deste módulo.</small></span><span class="civil-step-status">${qs.length} no histórico · ${unresolved.length} ainda erradas</span><span>⌄</span></button>
 <div class="civil-step-body">${qs.length?`<div class="civil-error-list">${rows}</div>${civil3Ui.stage==='errors3'?`<div style="margin-top:9px">${civil3StageSession('errors3')}</div>`:''}`:'<div class="muted small">Nenhum erro registrado neste módulo ainda.</div>'}
 <label class="civil-manual-done"><input type="checkbox" ${done?'checked':''} onchange="civilSetModule('m3',{errorsReviewed:this.checked})"> Marcar minha revisão de erros como concluída</label></div></section>`
}
function civil3AnkiStep(){
 const id='anki3',m=civilModuleState('m3'),done=!!m.anki,open=localStorage.getItem(civil3StepOpenKey(id))==='1';
 const deck1='04 DIREITO CIVIL::03 PESSOAS JURÍDICAS E DOMICÍLIO';
 const deck2='04 DIREITO CIVIL::04 BENS';
 return `<section class="civil-step ${done?'done':''} ${open?'open':''}" data-step="anki3"><button class="civil-step-head" onclick="toggleCivil3Step('anki3')"><span class="civil-step-n">${done?'✓':'8'}</span><span class="civil-step-title"><b>Anki seletivo</b><small>Use os dois baralhos já existentes.</small></span><span class="civil-step-status">${done?'Concluído':'Pendente'}</span><span>⌄</span></button>
 <div class="civil-step-body"><p class="civil-anki-note">No primeiro baralho, filtre mentalmente somente <b>Domicílio</b>; Pessoas Jurídicas já foi estudado no Módulo 2. No segundo, revise classificação de bens e bens públicos.</p>
 <div class="civil-stage-actions" style="margin-top:9px"><button class="civil-btn primary" onclick="window.openAnkiDeck('${escJs(deck1)}')">🧠 Domicílio</button><button class="civil-btn primary" onclick="window.openAnkiDeck('${escJs(deck2)}')">🧠 Bens</button></div>
 <label class="civil-manual-done"><input type="checkbox" ${done?'checked':''} onchange="civilSetModule('m3',{anki:this.checked})"> Marcar revisão no Anki como concluída</label></div></section>`
}
function renderCivilModule3(){
 const pct=civilModulePct('m3');
 return `<div class="civil-overall"><span style="width:${pct}%"></span></div><div class="civil-scope-note"><span class="civil-scope-badge edital">EDITAL</span><b>Escopo fechado do Módulo 3:</b> domicílio (CC 70-78), classificação dos bens (79-97), bens públicos (98-103), com afetação/desafetação como aprofundamento. <b>Negócio Jurídico começa apenas no Módulo 4.</b></div>
 <div class="civil-steps">
 ${civil3QuestionStep('diagnostic3','Diagnóstico FCC','10 questões reais antes da teoria.',1)}
 ${civil3ManualStep('reading3','Leitura orientada','CC 70 a 103, sem avançar ao art. 104.',2,civil3ReadingBody(),'reading')}
 ${civil3ManualStep('theory3','Teoria nuclear','Domicílio, classificações, pertenças, benfeitorias e bens públicos.',3,civil3TheoryBody(),'theory')}
 ${civil3ManualStep('deep3','Aprofundamento e aplicação','Afetação, desafetação e pegadinhas de nível superior.',4,civil3DeepBody(),'deep')}
 ${civil3QuestionStep('cases3','Casos práticos','5 casos autorais identificados.',5)}
 ${civil3QuestionStep('final3','Bateria final FCC','15 questões reais após a teoria.',6)}
 ${civil3ErrorStep()}
 ${civil3AnkiStep()}
 </div>`
}


let civil4Ui={stage:null,index:0};
function civil4StepOpenKey(id){return `central-v6:civil-step:m4:${id}`}
function civil4StageQuestions(stage){
 if(stage==='diagnostic4')return CIVIL_COURSE.diagnostic4||[];
 if(stage==='final4')return CIVIL_COURSE.final4||[];
 if(stage==='cases4')return CIVIL_COURSE.cases4||[];
 if(stage==='errors4'){
  const all=[...(CIVIL_COURSE.diagnostic4||[]),...(CIVIL_COURSE.cases4||[]),...(CIVIL_COURSE.final4||[])];
  return all.filter(q=>civilAnswer(q.id)?.everWrong);
 }
 return[];
}
function civil4StageDone(stage){
 const qs=civil4StageQuestions(stage);return qs.length>0&&qs.every(q=>(civilAnswer(q.id)?.attempts||0)>0)
}
function civil4Steps(){
 const m=civilModuleState('m4');
 return [
  {id:'diagnostic4',done:civil4StageDone('diagnostic4')},
  {id:'reading4',done:!!m.reading},
  {id:'theory4',done:!!m.theory},
  {id:'deep4',done:!!m.deep},
  {id:'cases4',done:civil4StageDone('cases4')},
  {id:'final4',done:civil4StageDone('final4')},
  {id:'errors4',done:!!m.errorsReviewed},
  {id:'anki4',done:!!m.anki}
 ]
}
function toggleCivil4Step(id){
 const el=document.querySelector(`.civil-module[data-civil="m4"] .civil-step[data-step="${id}"]`);if(!el)return;
 const open=!el.classList.contains('open');el.classList.toggle('open',open);localStorage.setItem(civil4StepOpenKey(id),open?'1':'0')
}
function civil4OpenStage(stage){
 const qs=civil4StageQuestions(stage);if(!qs.length){civil4Ui={stage,index:0};renderSubjects();return}
 let idx=qs.findIndex(q=>(civilAnswer(q.id)?.attempts||0)===0);if(idx<0)idx=0;
 civil4Ui={stage,index:idx};localStorage.setItem(civil4StepOpenKey(stage),'1');renderSubjects();
 setTimeout(()=>document.querySelector(`.civil-module[data-civil="m4"] .civil-step[data-step="${stage}"]`)?.scrollIntoView({behavior:'smooth',block:'center'}),20)
}
function civil4Select(id,letter){
 const st=civilState(),a=st.answers[id]||{attempts:0,history:[],everWrong:false};
 if(a.submitted)return;a.selected=letter;a.submitted=false;st.answers[id]=a;civilSave(st);renderSubjects()
}
function civil4Submit(id,stage){
 const q=[...(CIVIL_COURSE.diagnostic4||[]),...(CIVIL_COURSE.cases4||[]),...(CIVIL_COURSE.final4||[])].find(x=>x.id===id);
 if(!q)return;const st=civilState(),a=st.answers[id]||{attempts:0,history:[],everWrong:false};
 if(!a.selected){alert('Escolha uma alternativa primeiro.');return}
 const correct=a.selected===q.answer;
 a.attempts=(a.attempts||0)+1;a.submitted=true;a.lastCorrect=correct;a.everWrong=!!a.everWrong||!correct;
 a.history=[...(a.history||[]),{at:new Date().toISOString(),selected:a.selected,correct,stage,module:'m4'}];
 st.answers[id]=a;civilSave(st);renderAll()
}
function civil4Retry(id){const st=civilState(),a=st.answers[id];if(!a)return;a.selected=null;a.submitted=false;st.answers[id]=a;civilSave(st);renderSubjects()}
function civil4Move(stage,delta){
 const qs=civil4StageQuestions(stage);if(!qs.length)return;
 civil4Ui.stage=stage;civil4Ui.index=Math.max(0,Math.min(qs.length-1,civil4Ui.index+delta));renderSubjects()
}
function civil4Accuracy(stage){
 const qs=civil4StageQuestions(stage),answered=qs.map(q=>civilAnswer(q.id)).filter(a=>a?.attempts);
 const correct=answered.filter(a=>a.lastCorrect).length;return {answered:answered.length,total:qs.length,correct,pct:answered.length?Math.round(correct/answered.length*100):0}
}
function civil4QuestionCard(q,stage,index,total){
 const a=civilAnswer(q.id)||{selected:null,submitted:false,attempts:0,history:[]},locked=!!a.submitted;
 const opts=Object.entries(q.options).map(([letter,text])=>{
  let cls='civil-option';if(a.selected===letter)cls+=' selected';
  if(locked&&letter===q.answer)cls+=' correct';else if(locked&&a.selected===letter&&letter!==q.answer)cls+=' wrong';
  return `<button class="${cls}" ${locked?'disabled':''} onclick="civil4Select('${escJs(q.id)}','${letter}')"><span class="civil-letter">${letter}</span><span>${esc(text)}</span></button>`
 }).join('');
 const feedback=locked?`<div class="civil-feedback ${a.lastCorrect?'good':'bad'}"><b>${a.lastCorrect?'✓ Resposta correta':'✕ Resposta incorreta — gabarito '+q.answer}</b>${esc(q.explanation)}<span class="basis">Fundamento: ${esc(q.basis)}${a.attempts>1?' · '+a.attempts+' tentativas':''}</span></div>`:'';
 return `<article class="civil-qcard">${civilQuestionMeta(q)}<h4>${esc(q.prompt)}</h4><div class="civil-options">${opts}</div>
 <div class="civil-submit-row"><div>${q.kind==='real'?`<a class="civil-source-link" href="${escAttr(q.url)}" target="_blank" rel="noopener">Fonte da questão no TEC ↗</a>`:'<span class="muted small">Caso criado para aplicação da regra.</span>'}</div>
 <div class="civil-qnav"><button class="civil-btn" onclick="civil4Move('${stage}',-1)" ${index===0?'disabled':''}>←</button><span>${index+1} / ${total}</span><button class="civil-btn" onclick="civil4Move('${stage}',1)" ${index===total-1?'disabled':''}>→</button></div>
 ${locked?`<button class="civil-btn" onclick="civil4Retry('${escJs(q.id)}')">Refazer</button>`:`<button class="civil-btn primary" onclick="civil4Submit('${escJs(q.id)}','${stage}')">Responder</button>`}
 </div>${feedback}</article>`
}
function civil4StageSession(stage){
 const qs=civil4StageQuestions(stage);if(!qs.length)return '<div class="muted small">Nenhuma questão disponível.</div>';
 if(civil4Ui.stage!==stage)civil4Ui={stage,index:Math.max(0,qs.findIndex(q=>(civilAnswer(q.id)?.attempts||0)===0))};
 civil4Ui.index=Math.max(0,Math.min(qs.length-1,civil4Ui.index));
 return civil4QuestionCard(qs[civil4Ui.index],stage,civil4Ui.index,qs.length)
}
function civil4QuestionStep(stage,title,subtitle,num){
 const stats=civil4Accuracy(stage),done=civil4StageDone(stage),open=localStorage.getItem(civil4StepOpenKey(stage))==='1',active=civil4Ui.stage===stage;
 return `<section class="civil-step ${done?'done':''} ${open?'open':''}" data-step="${stage}">
 <button class="civil-step-head" onclick="toggleCivil4Step('${stage}')"><span class="civil-step-n">${done?'✓':num}</span><span class="civil-step-title"><b>${esc(title)}</b><small>${esc(subtitle)}</small></span><span class="civil-step-status">${stats.answered}/${stats.total} respondidas${stats.answered?' · '+stats.pct+'%':''}</span><span>⌄</span></button>
 <div class="civil-step-body"><div class="civil-stage-toolbar"><p>${stage==='diagnostic4'?'Resolva primeiro sem consulta: o diagnóstico mistura validade, interpretação e elementos acidentais.':stage==='final4'?'Bateria posterior à teoria, priorizando questões reais de Analista e Oficial de Justiça.':'Casos para aplicar representação, interpretação e os planos de validade/eficácia.'}</p><div class="civil-stage-actions"><button class="civil-btn primary" onclick="civil4OpenStage('${stage}')">${stats.answered?'Continuar':'Iniciar'}</button></div></div>${active?civil4StageSession(stage):''}</div></section>`
}
function civil4ManualStep(id,title,subtitle,num,body,field){
 const st=civilModuleState('m4'),done=!!st[field],open=localStorage.getItem(civil4StepOpenKey(id))==='1';
 return `<section class="civil-step ${done?'done':''} ${open?'open':''}" data-step="${id}">
 <button class="civil-step-head" onclick="toggleCivil4Step('${id}')"><span class="civil-step-n">${done?'✓':num}</span><span class="civil-step-title"><b>${esc(title)}</b><small>${esc(subtitle)}</small></span><span class="civil-step-status">${done?'Concluído':'Pendente'}</span><span>⌄</span></button>
 <div class="civil-step-body">${body}<label class="civil-manual-done"><input type="checkbox" ${done?'checked':''} onchange="civilSetModule('m4',{${field}:this.checked})"> Marcar esta etapa como concluída</label></div></section>`
}
function civil4ReadingBody(){
 return `<div class="civil-theory"><section><h4>Leitura orientada — Módulo 4</h4><div class="civil-law-grid">
 <div class="civil-law-card"><b>CC, arts. 104 a 114</b><span>Validade, objeto, forma, vontade, silêncio e interpretação.</span></div>
 <div class="civil-law-card"><b>CC, arts. 115 a 120</b><span>Representação legal e voluntária, negócio consigo mesmo e conflito de interesses.</span></div>
 <div class="civil-law-card"><b>CC, arts. 121 a 137</b><span>Condição, termo, encargo e seus efeitos.</span></div>
 </div><div class="civil-stage-actions"><button class="civil-btn primary" onclick="saveLast({civilModule:'m4',title:'Direito Civil • Módulo 4 • Leitura no Vade Mecum',at:Date.now()});openVadeMecum(null,'cc')">📖 Abrir Código Civil no Vade Mecum</button></div>
 <div class="civil-alert"><b>Pare no art. 137.</b> O art. 138 inicia Erro ou Ignorância e, portanto, os defeitos do negócio jurídico do Módulo 5.</div></section></div>`
}
function civil4TheoryBody(){
 return `<div class="civil-theory">
 <section><h4>1. Negócio jurídico: conceito e função</h4><p>Negócio jurídico é fato jurídico em que a manifestação de vontade é juridicamente relevante para a criação, modificação, conservação ou extinção de relações jurídicas, dentro dos limites do ordenamento.</p><p><strong>Classificações úteis para prova:</strong> unilateral, bilateral e plurilateral; gratuito ou oneroso; inter vivos ou mortis causa; solene/formal ou não solene; principal ou acessório.</p><div class="civil-alert">O Código não traz um artigo com uma lista fechada dessas classificações; elas são construções doutrinárias usadas para organizar os negócios jurídicos.</div></section>

 <section><h4>2. Três planos — ferramenta doutrinária</h4><table class="civil-compare"><tr><th>Existência</th><th>Validade</th><th>Eficácia</th></tr>
 <tr><td>Investiga se há suporte mínimo para reconhecer juridicamente o negócio.</td><td>Verifica a conformidade do negócio existente com os requisitos jurídicos. O art. 104 disciplina diretamente esse plano.</td><td>Examina se o negócio está apto a produzir os efeitos pretendidos, imediatamente ou após condição/termo.</td></tr></table>
 <p>Esse esquema é <strong>doutrinário</strong>. Em prova, o ponto mais seguro é não confundir negócio inválido com negócio válido cuja eficácia esteja suspensa.</p></section>

 <section><h4>3. Requisitos de validade — art. 104</h4><ul><li><strong>Agente capaz.</strong></li><li><strong>Objeto lícito, possível, determinado ou determinável.</strong></li><li><strong>Forma prescrita ou não defesa em lei.</strong></li></ul>
 <p>A incapacidade relativa de uma parte não pode ser invocada pela outra em benefício próprio. A impossibilidade inicial do objeto não invalida o negócio se for relativa ou se cessar antes da condição a que ele estiver subordinado.</p></section>

 <section><h4>4. Forma: liberdade como regra</h4><p>A declaração de vontade não depende de forma especial, salvo exigência expressa da lei. Exemplo clássico: em regra, negócios sobre direitos reais imobiliários acima do limite do art. 108 exigem escritura pública.</p><p>Se as próprias partes convencionam que o negócio não valerá sem instrumento público, esse instrumento passa a ser da substância do ato.</p></section>

 <section><h4>5. Manifestação de vontade</h4><ul><li><strong>Reserva mental:</strong> a manifestação subsiste, salvo se o destinatário conhecia a reserva.</li><li><strong>Silêncio:</strong> pode importar anuência quando circunstâncias/usos autorizarem e não for exigida manifestação expressa.</li><li><strong>Intenção × literalidade:</strong> atende-se mais à intenção consubstanciada do que ao sentido literal.</li><li><strong>Negócios benéficos e renúncia:</strong> interpretação estrita.</li></ul></section>

 <section><h4>6. Art. 113 atualizado — ponto obrigatório</h4><p>Além da boa-fé e dos usos do lugar de celebração, o §1º determina critérios concretos. A interpretação deve atribuir sentido que:</p><ol><li>seja confirmado pelo comportamento posterior das partes;</li><li>corresponda aos usos, costumes e práticas do mercado;</li><li>corresponda à boa-fé;</li><li>seja mais benéfico à parte que não redigiu o dispositivo, se identificável;</li><li>corresponda à negociação razoável das partes, inferida do negócio e da racionalidade econômica.</li></ol><p>O §2º permite que as próprias partes pactuem regras de interpretação, integração e preenchimento de lacunas diferentes das regras legais.</p></section>

 <section><h4>7. Representação — arts. 115 a 120</h4><ul><li>Poderes de representação decorrem da lei ou do interessado.</li><li>A vontade do representante, dentro dos poderes, produz efeitos para o representado.</li><li><strong>Negócio consigo mesmo:</strong> anulável, salvo permissão da lei ou do representado.</li><li>O representante deve provar sua qualidade e extensão dos poderes; se exceder, pode responder pelos atos.</li><li><strong>Conflito de interesses:</strong> negócio anulável se o conflito era ou devia ser conhecido pela contraparte.</li><li>Prazo específico do art. 119: <strong>180 dias</strong> da conclusão do negócio ou cessação da incapacidade.</li></ul></section>

 <section><h4>8. Condição</h4><p>Condição é cláusula voluntária que subordina o efeito do negócio a evento <strong>futuro e incerto</strong>.</p><table class="civil-compare"><tr><th>Suspensiva</th><th>Resolutiva</th></tr><tr><td>Enquanto não ocorre, não se adquire o direito visado.</td><td>Enquanto não ocorre, o negócio vigora e o direito pode ser exercido.</td></tr></table>
 <p>São vedadas condições contrárias à lei, ordem pública ou bons costumes e as puramente potestativas que sujeitem o negócio ao puro arbítrio de uma parte.</p></section>

 <section><h4>9. Condições impossíveis, ilícitas e contraditórias</h4><ul><li>Condição física ou juridicamente impossível <strong>suspensiva</strong> invalida o negócio.</li><li>Condição ilícita ou de fazer coisa ilícita invalida o negócio.</li><li>Condição incompreensível ou contraditória invalida o negócio.</li><li>Condição impossível <strong>resolutiva</strong> e condição de não fazer coisa impossível são tidas por inexistentes.</li></ul>
 <p>Se o implemento da condição for maliciosamente impedido por quem seria prejudicado por ela, considera-se verificada; se for maliciosamente provocado por quem se beneficiaria, considera-se não verificada.</p></section>

 <section><h4>10. Termo</h4><p>Termo liga os efeitos do negócio a evento <strong>futuro e certo</strong>. O termo inicial suspende o exercício, mas não a aquisição do direito.</p><p>Exemplo clássico: morte de determinada pessoa é evento de ocorrência certa, embora a data possa ser incerta — por isso pode funcionar como termo.</p></section>

 <section><h4>11. Encargo</h4><p>Encargo é uma obrigação imposta ao beneficiário de uma liberalidade. Em regra, <strong>não suspende a aquisição nem o exercício do direito</strong>, salvo quando expressamente imposto como condição suspensiva.</p><p>Encargo ilícito ou impossível é considerado não escrito; se, porém, for o motivo determinante da liberalidade, invalida o negócio.</p></section>
 
 <section><h4>EDITAL — teoria geral dos fatos jurídicos</h4><p>Antes do negócio jurídico, fixe o gênero: <strong>fato jurídico natural</strong>, <strong>fato humano</strong>, <strong>ato-fato</strong>, <strong>ato jurídico em sentido estrito</strong>, <strong>negócio jurídico</strong> e <strong>ato ilícito</strong>. O Módulo 11 traz questões FCC específicas desse ponto.</p></section>
</div>`
}
function civil4DeepBody(){
 return `<div class="civil-theory">
 <section class="civil-juris"><h4>Aprofundamento 1 — Lei da Liberdade Econômica e art. 113</h4><p>A Lei 13.874/2019 tornou a interpretação do negócio muito mais objetiva e estruturada. Não basta decorar “boa-fé e usos”: a FCC já cobra comportamento posterior, práticas do mercado, critério contra o redator e negociação razoável.</p></section>

 <section class="civil-juris"><h4>Aprofundamento 2 — existência, validade e eficácia</h4><p>O Código disciplina expressamente requisitos de validade e regras de eficácia, mas a divisão em três planos é uma construção doutrinária. Ela é útil para perceber por que uma condição suspensiva não torna o negócio inválido: ela atua sobre a produção dos efeitos.</p></section>

 <section class="civil-juris"><h4>Aprofundamento 3 — condição × termo × encargo</h4><table class="civil-compare"><tr><th>Instituto</th><th>Evento / efeito</th></tr>
 <tr><td>Condição</td><td>Futuro + incerto. Pode suspender a aquisição do direito ou resolver efeitos.</td></tr>
 <tr><td>Termo</td><td>Futuro + certo. Termo inicial suspende exercício, não aquisição.</td></tr>
 <tr><td>Encargo</td><td>Ônus imposto ao beneficiário. Regra: não suspende aquisição nem exercício.</td></tr></table></section>

 <section class="civil-juris"><h4>Aprofundamento 4 — representação e autocontrato</h4><p>Ter poderes para representar não significa liberdade para contratar consigo mesmo. O art. 117 cria regra específica de anulabilidade. Já o art. 119 cuida do conflito de interesses perceptível à contraparte e prevê prazo decadencial próprio de 180 dias.</p></section>

 <section><h4>Mapa de pegadinhas</h4><table class="civil-compare"><tr><th>Pegadinha</th><th>Regra correta</th></tr>
 <tr><td>Todo negócio precisa ser escrito.</td><td>Forma é livre, salvo exigência legal ou convencional válida.</td></tr>
 <tr><td>Impossibilidade inicial sempre gera nulidade.</td><td>Art. 106 traz duas exceções expressas.</td></tr>
 <tr><td>Silêncio nunca vale como vontade.</td><td>Pode valer nas hipóteses do art. 111.</td></tr>
 <tr><td>Reserva mental sempre elimina a manifestação.</td><td>Não, salvo conhecimento do destinatário.</td></tr>
 <tr><td>Interpretação olha apenas o momento da assinatura.</td><td>Comportamento posterior é critério legal expresso.</td></tr>
 <tr><td>Representante pode contratar consigo mesmo livremente.</td><td>Regra: anulável, salvo autorização legal ou do representado.</td></tr>
 <tr><td>Condição é evento futuro e certo.</td><td>Condição = futuro e incerto; termo = futuro e certo.</td></tr>
 <tr><td>Condição suspensiva permite aquisição imediata do direito.</td><td>Enquanto pendente, não se adquire o direito visado.</td></tr>
 <tr><td>Termo inicial impede aquisição do direito.</td><td>Suspende somente o exercício.</td></tr>
 <tr><td>Encargo sempre suspende aquisição e exercício.</td><td>Regra é o contrário; há exceção expressa no art. 136.</td></tr></table></section>
 </div>`
}
function civil4ErrorStep(){
 const id='errors4',m=civilModuleState('m4'),done=!!m.errorsReviewed,open=localStorage.getItem(civil4StepOpenKey(id))==='1';
 const qs=civil4StageQuestions('errors4'),unresolved=qs.filter(q=>civilAnswer(q.id)?.lastCorrect===false);
 const rows=qs.map((q,i)=>{const a=civilAnswer(q.id);return `<div class="civil-error-row"><div><b>${q.kind==='real'?'FCC':'Autoral'} • ${esc(q.subject)}</b><small>${a?.lastCorrect?'Corrigida na última tentativa':'Ainda errada na última tentativa'} · ${a?.attempts||0} tentativa(s)</small></div><button class="civil-btn" onclick="civil4Ui={stage:'errors4',index:${i}};localStorage.setItem(civil4StepOpenKey('errors4'),'1');renderSubjects()">Revisar</button></div>`}).join('');
 return `<section class="civil-step ${done?'done':''} ${open?'open':''}" data-step="errors4"><button class="civil-step-head" onclick="toggleCivil4Step('errors4')"><span class="civil-step-n">${done?'✓':'7'}</span><span class="civil-step-title"><b>Revisão de erros</b><small>Somente erros deste módulo.</small></span><span class="civil-step-status">${qs.length} no histórico · ${unresolved.length} ainda erradas</span><span>⌄</span></button>
 <div class="civil-step-body">${qs.length?`<div class="civil-error-list">${rows}</div>${civil4Ui.stage==='errors4'?`<div style="margin-top:9px">${civil4StageSession('errors4')}</div>`:''}`:'<div class="muted small">Nenhum erro registrado neste módulo ainda.</div>'}
 <label class="civil-manual-done"><input type="checkbox" ${done?'checked':''} onchange="civilSetModule('m4',{errorsReviewed:this.checked})"> Marcar minha revisão de erros como concluída</label></div></section>`
}
function civil4AnkiStep(){
 const id='anki4',m=civilModuleState('m4'),done=!!m.anki,open=localStorage.getItem(civil4StepOpenKey(id))==='1';
 const deck='04 DIREITO CIVIL::05 FATOS E NEGÓCIOS JURÍDICOS';
 return `<section class="civil-step ${done?'done':''} ${open?'open':''}" data-step="anki4"><button class="civil-step-head" onclick="toggleCivil4Step('anki4')"><span class="civil-step-n">${done?'✓':'8'}</span><span class="civil-step-title"><b>Anki seletivo</b><small>Baralho de Fatos e Negócios Jurídicos.</small></span><span class="civil-step-status">${done?'Concluído':'Pendente'}</span><span>⌄</span></button>
 <div class="civil-step-body"><p class="civil-anki-note">Neste módulo, revise somente os cards de <b>disposições gerais, representação, condição, termo e encargo</b>. Defeitos, invalidade, prescrição e decadência serão tratados nos módulos seguintes.</p>
 <div class="civil-stage-actions" style="margin-top:9px"><button class="civil-btn primary" onclick="window.openAnkiDeck('${escJs(deck)}')">🧠 Abrir Fatos e Negócios Jurídicos</button></div>
 <label class="civil-manual-done"><input type="checkbox" ${done?'checked':''} onchange="civilSetModule('m4',{anki:this.checked})"> Marcar revisão no Anki como concluída</label></div></section>`
}
function renderCivilModule4(){
 const pct=civilModulePct('m4');
 return `<div class="civil-overall"><span style="width:${pct}%"></span></div><div class="civil-scope-note"><span class="civil-scope-badge edital">EDITAL</span><b>Escopo fechado do Módulo 4:</b> disposições gerais do negócio jurídico (CC 104-114), representação (115-120), condição, termo e encargo (121-137), além das classificações e dos planos existência/validade/eficácia como ferramentas doutrinárias. <b>Defeitos começam apenas no art. 138 e ficam para o Módulo 5.</b></div>
 <div class="civil-steps">
 ${civil4QuestionStep('diagnostic4','Diagnóstico FCC','10 questões reais antes da teoria.',1)}
 ${civil4ManualStep('reading4','Leitura orientada','CC 104 a 137, sem avançar aos defeitos.',2,civil4ReadingBody(),'reading')}
 ${civil4ManualStep('theory4','Teoria nuclear','Validade, forma, vontade, interpretação, representação e elementos acidentais.',3,civil4TheoryBody(),'theory')}
 ${civil4ManualStep('deep4','Aprofundamento e atualização','Art. 113 atual, planos do negócio e diferenças decisivas.',4,civil4DeepBody(),'deep')}
 ${civil4QuestionStep('cases4','Casos práticos','5 casos autorais identificados.',5)}
 ${civil4QuestionStep('final4','Bateria final FCC','15 questões reais após a teoria.',6)}
 ${civil4ErrorStep()}
 ${civil4AnkiStep()}
 </div>`
}


let civil5Ui={stage:null,index:0};
function civil5StepOpenKey(id){return `central-v6:civil-step:m5:${id}`}
function civil5StageQuestions(stage){
 if(stage==='diagnostic5')return CIVIL_COURSE.diagnostic5||[];
 if(stage==='final5')return CIVIL_COURSE.final5||[];
 if(stage==='cases5')return CIVIL_COURSE.cases5||[];
 if(stage==='errors5'){
  const all=[...(CIVIL_COURSE.diagnostic5||[]),...(CIVIL_COURSE.cases5||[]),...(CIVIL_COURSE.final5||[])];
  return all.filter(q=>civilAnswer(q.id)?.everWrong);
 }
 return[];
}
function civil5StageDone(stage){
 const qs=civil5StageQuestions(stage);return qs.length>0&&qs.every(q=>(civilAnswer(q.id)?.attempts||0)>0)
}
function civil5Steps(){
 const m=civilModuleState('m5');
 return [
  {id:'diagnostic5',done:civil5StageDone('diagnostic5')},
  {id:'reading5',done:!!m.reading},
  {id:'theory5',done:!!m.theory},
  {id:'deep5',done:!!m.deep},
  {id:'cases5',done:civil5StageDone('cases5')},
  {id:'final5',done:civil5StageDone('final5')},
  {id:'errors5',done:!!m.errorsReviewed},
  {id:'anki5',done:!!m.anki}
 ]
}
function toggleCivil5Step(id){
 const el=document.querySelector(`.civil-module[data-civil="m5"] .civil-step[data-step="${id}"]`);if(!el)return;
 const open=!el.classList.contains('open');el.classList.toggle('open',open);localStorage.setItem(civil5StepOpenKey(id),open?'1':'0')
}
function civil5OpenStage(stage){
 const qs=civil5StageQuestions(stage);if(!qs.length){civil5Ui={stage,index:0};renderSubjects();return}
 let idx=qs.findIndex(q=>(civilAnswer(q.id)?.attempts||0)===0);if(idx<0)idx=0;
 civil5Ui={stage,index:idx};localStorage.setItem(civil5StepOpenKey(stage),'1');renderSubjects();
 setTimeout(()=>document.querySelector(`.civil-module[data-civil="m5"] .civil-step[data-step="${stage}"]`)?.scrollIntoView({behavior:'smooth',block:'center'}),20)
}
function civil5Select(id,letter){
 const st=civilState(),a=st.answers[id]||{attempts:0,history:[],everWrong:false};
 if(a.submitted)return;a.selected=letter;a.submitted=false;st.answers[id]=a;civilSave(st);renderSubjects()
}
function civil5Submit(id,stage){
 const q=[...(CIVIL_COURSE.diagnostic5||[]),...(CIVIL_COURSE.cases5||[]),...(CIVIL_COURSE.final5||[])].find(x=>x.id===id);
 if(!q)return;const st=civilState(),a=st.answers[id]||{attempts:0,history:[],everWrong:false};
 if(!a.selected){alert('Escolha uma alternativa primeiro.');return}
 const correct=a.selected===q.answer;
 a.attempts=(a.attempts||0)+1;a.submitted=true;a.lastCorrect=correct;a.everWrong=!!a.everWrong||!correct;
 a.history=[...(a.history||[]),{at:new Date().toISOString(),selected:a.selected,correct,stage,module:'m5'}];
 st.answers[id]=a;civilSave(st);renderAll()
}
function civil5Retry(id){const st=civilState(),a=st.answers[id];if(!a)return;a.selected=null;a.submitted=false;st.answers[id]=a;civilSave(st);renderSubjects()}
function civil5Move(stage,delta){
 const qs=civil5StageQuestions(stage);if(!qs.length)return;
 civil5Ui.stage=stage;civil5Ui.index=Math.max(0,Math.min(qs.length-1,civil5Ui.index+delta));renderSubjects()
}
function civil5Accuracy(stage){
 const qs=civil5StageQuestions(stage),answered=qs.map(q=>civilAnswer(q.id)).filter(a=>a?.attempts);
 const correct=answered.filter(a=>a.lastCorrect).length;return {answered:answered.length,total:qs.length,correct,pct:answered.length?Math.round(correct/answered.length*100):0}
}
function civil5QuestionCard(q,stage,index,total){
 const a=civilAnswer(q.id)||{selected:null,submitted:false,attempts:0,history:[]},locked=!!a.submitted;
 const opts=Object.entries(q.options).map(([letter,text])=>{
  let cls='civil-option';if(a.selected===letter)cls+=' selected';
  if(locked&&letter===q.answer)cls+=' correct';else if(locked&&a.selected===letter&&letter!==q.answer)cls+=' wrong';
  return `<button class="${cls}" ${locked?'disabled':''} onclick="civil5Select('${escJs(q.id)}','${letter}')"><span class="civil-letter">${letter}</span><span>${esc(text)}</span></button>`
 }).join('');
 const feedback=locked?`<div class="civil-feedback ${a.lastCorrect?'good':'bad'}"><b>${a.lastCorrect?'✓ Resposta correta':'✕ Resposta incorreta — gabarito '+q.answer}</b>${esc(q.explanation)}<span class="basis">Fundamento: ${esc(q.basis)}${a.attempts>1?' · '+a.attempts+' tentativas':''}</span></div>`:'';
 return `<article class="civil-qcard">${civilQuestionMeta(q)}<h4>${esc(q.prompt)}</h4><div class="civil-options">${opts}</div>
 <div class="civil-submit-row"><div>${q.kind==='real'?`<a class="civil-source-link" href="${escAttr(q.url)}" target="_blank" rel="noopener">Fonte da questão no TEC ↗</a>`:'<span class="muted small">Caso criado para aplicação da regra.</span>'}</div>
 <div class="civil-qnav"><button class="civil-btn" onclick="civil5Move('${stage}',-1)" ${index===0?'disabled':''}>←</button><span>${index+1} / ${total}</span><button class="civil-btn" onclick="civil5Move('${stage}',1)" ${index===total-1?'disabled':''}>→</button></div>
 ${locked?`<button class="civil-btn" onclick="civil5Retry('${escJs(q.id)}')">Refazer</button>`:`<button class="civil-btn primary" onclick="civil5Submit('${escJs(q.id)}','${stage}')">Responder</button>`}
 </div>${feedback}</article>`
}
function civil5StageSession(stage){
 const qs=civil5StageQuestions(stage);if(!qs.length)return '<div class="muted small">Nenhuma questão disponível.</div>';
 if(civil5Ui.stage!==stage)civil5Ui={stage,index:Math.max(0,qs.findIndex(q=>(civilAnswer(q.id)?.attempts||0)===0))};
 civil5Ui.index=Math.max(0,Math.min(qs.length-1,civil5Ui.index));
 return civil5QuestionCard(qs[civil5Ui.index],stage,civil5Ui.index,qs.length)
}
function civil5QuestionStep(stage,title,subtitle,num){
 const stats=civil5Accuracy(stage),done=civil5StageDone(stage),open=localStorage.getItem(civil5StepOpenKey(stage))==='1',active=civil5Ui.stage===stage;
 return `<section class="civil-step ${done?'done':''} ${open?'open':''}" data-step="${stage}">
 <button class="civil-step-head" onclick="toggleCivil5Step('${stage}')"><span class="civil-step-n">${done?'✓':num}</span><span class="civil-step-title"><b>${esc(title)}</b><small>${esc(subtitle)}</small></span><span class="civil-step-status">${stats.answered}/${stats.total} respondidas${stats.answered?' · '+stats.pct+'%':''}</span><span>⌄</span></button>
 <div class="civil-step-body"><div class="civil-stage-toolbar"><p>${stage==='diagnostic5'?'Resolva sem consulta: a FCC mistura conceitos próximos para testar identificação do vício.':stage==='final5'?'Bateria posterior à teoria com erro, dolo, coação, estado de perigo, lesão e fraude contra credores.':'Casos para separar vícios muito parecidos e aplicar a regra correta.'}</p><div class="civil-stage-actions"><button class="civil-btn primary" onclick="civil5OpenStage('${stage}')">${stats.answered?'Continuar':'Iniciar'}</button></div></div>${active?civil5StageSession(stage):''}</div></section>`
}
function civil5ManualStep(id,title,subtitle,num,body,field){
 const st=civilModuleState('m5'),done=!!st[field],open=localStorage.getItem(civil5StepOpenKey(id))==='1';
 return `<section class="civil-step ${done?'done':''} ${open?'open':''}" data-step="${id}">
 <button class="civil-step-head" onclick="toggleCivil5Step('${id}')"><span class="civil-step-n">${done?'✓':num}</span><span class="civil-step-title"><b>${esc(title)}</b><small>${esc(subtitle)}</small></span><span class="civil-step-status">${done?'Concluído':'Pendente'}</span><span>⌄</span></button>
 <div class="civil-step-body">${body}<label class="civil-manual-done"><input type="checkbox" ${done?'checked':''} onchange="civilSetModule('m5',{${field}:this.checked})"> Marcar esta etapa como concluída</label></div></section>`
}
function civil5ReadingBody(){
 return `<div class="civil-theory"><section><h4>Leitura orientada — Módulo 5</h4><div class="civil-law-grid">
 <div class="civil-law-card"><b>CC, arts. 138 a 144</b><span>Erro ou ignorância.</span></div>
 <div class="civil-law-card"><b>CC, arts. 145 a 150</b><span>Dolo principal, acidental, omissivo, de terceiro e bilateral.</span></div>
 <div class="civil-law-card"><b>CC, arts. 151 a 155</b><span>Coação e coação exercida por terceiro.</span></div>
 <div class="civil-law-card"><b>CC, art. 156</b><span>Estado de perigo.</span></div>
 <div class="civil-law-card"><b>CC, art. 157</b><span>Lesão e conservação do negócio.</span></div>
 <div class="civil-law-card"><b>CC, arts. 158 a 165</b><span>Fraude contra credores.</span></div>
 </div><div class="civil-stage-actions"><button class="civil-btn primary" onclick="saveLast({civilModule:'m5',title:'Direito Civil • Módulo 5 • Leitura no Vade Mecum',at:Date.now()});openVadeMecum(null,'cc')">📖 Abrir Código Civil no Vade Mecum</button></div>
 <div class="civil-alert"><b>Pare no art. 165.</b> O art. 166 inicia a Invalidade do Negócio Jurídico. Nulidade, anulabilidade, simulação, confirmação e efeitos serão aprofundados no Módulo 6.</div></section></div>`
}
function civil5TheoryBody(){
 return `<div class="civil-theory">
 <section><h4>1. Mapa geral dos defeitos</h4><table class="civil-compare"><tr><th>Defeito</th><th>Núcleo que você deve reconhecer</th></tr>
 <tr><td>Erro</td><td>Falsa percepção espontânea da realidade, sem artifício necessariamente provocado pela outra parte.</td></tr>
 <tr><td>Dolo</td><td>Conduta intencional que induz ou mantém a outra parte em erro.</td></tr>
 <tr><td>Coação</td><td>Pressão por ameaça capaz de gerar temor fundado de dano iminente e considerável.</td></tr>
 <tr><td>Estado de perigo</td><td>Necessidade de salvar pessoa de grave dano conhecido pela outra parte + obrigação excessivamente onerosa.</td></tr>
 <tr><td>Lesão</td><td>Premente necessidade ou inexperiência + prestação manifestamente desproporcional.</td></tr>
 <tr><td>Fraude contra credores</td><td>Atos patrimoniais do devedor insolvente que prejudicam a garantia patrimonial de credores anteriores.</td></tr></table></section>

 <section><h4>2. Erro ou ignorância — arts. 138 a 144</h4><p>O erro capaz de atingir o negócio deve ser <strong>substancial</strong> e perceptível por pessoa de diligência normal diante das circunstâncias.</p><p>É substancial quando recai sobre:</p><ul><li>natureza do negócio, objeto principal ou qualidade essencial;</li><li>identidade ou qualidade essencial da pessoa, quando relevante para a vontade;</li><li>direito, sem implicar recusa à aplicação da lei, se for motivo único ou principal.</li></ul>
 <p><strong>Falso motivo:</strong> só vicia se estiver expresso como razão determinante. <strong>Erro de cálculo:</strong> apenas retifica. <strong>Erro de indicação:</strong> não vicia se o contexto permitir identificar a pessoa/coisa. <strong>Transmissão errônea por terceiro:</strong> segue o regime da declaração direta.</p>
 <div class="civil-alert">Regra de conservação do art. 144: se o destinatário se oferece para executar conforme a vontade real do manifestante, o erro não prejudica a validade.</div></section>

 <section><h4>3. Dolo — arts. 145 a 150</h4><table class="civil-compare"><tr><th>Dolo principal</th><th>Dolo acidental</th></tr><tr><td>É causa determinante do negócio. Pode conduzir à anulação.</td><td>Mesmo sem ele o negócio seria feito, embora de outro modo. Gera apenas perdas e danos.</td></tr></table>
 <ul><li><strong>Omissão dolosa:</strong> silêncio intencional em negócio bilateral sobre fato/qualidade ignorada, se sem ele o negócio não seria celebrado.</li><li><strong>Dolo de terceiro:</strong> anula se a parte beneficiada sabia ou devia saber; caso contrário, o negócio subsiste e o terceiro indeniza.</li><li><strong>Dolo do representante legal:</strong> representado responde até o proveito obtido.</li><li><strong>Dolo do representante convencional:</strong> representado responde solidariamente com o representante.</li><li><strong>Dolo bilateral:</strong> nenhuma parte pode alegar o dolo da outra para anular ou pedir indenização.</li></ul></section>

 <section><h4>4. Coação — arts. 151 a 155</h4><p>Para viciar a vontade, deve incutir <strong>fundado temor de dano iminente e considerável</strong> à pessoa, família ou bens. Se atingir pessoa fora da família, o juiz decide segundo as circunstâncias.</p><p>A gravidade é concreta: idade, condição, saúde, temperamento e demais circunstâncias devem ser consideradas.</p><div class="civil-alert">Não é coação: ameaça do exercício normal de um direito nem simples temor reverencial.</div>
 <table class="civil-compare"><tr><th>Coação por terceiro + beneficiário sabia/devia saber</th><th>Beneficiário não sabia nem devia saber</th></tr>
 <tr><td>O vício atinge o negócio; beneficiário responde solidariamente com o coator por perdas e danos.</td><td>O negócio subsiste; o terceiro coator responde pelos danos.</td></tr></table></section>

 <section><h4>5. Estado de perigo — art. 156</h4><p>Elementos cumulativos:</p><ol><li>necessidade de salvar a si ou pessoa da família de <strong>grave dano</strong>;</li><li>essa situação é <strong>conhecida pela outra parte</strong>;</li><li>assunção de <strong>obrigação excessivamente onerosa</strong>.</li></ol>
 <p>Se o dano envolver pessoa que não pertence à família, o juiz decide conforme as circunstâncias.</p></section>

 <section><h4>6. Lesão — art. 157</h4><p>Exige um componente subjetivo e um objetivo:</p><table class="civil-compare"><tr><th>Subjetivo</th><th>Objetivo</th></tr><tr><td>Premente necessidade <strong>ou</strong> inexperiência.</td><td>Prestação manifestamente desproporcional à contraprestação.</td></tr></table>
 <p>A desproporção é aferida <strong>pelos valores existentes no momento da celebração</strong>, não por fato econômico posterior.</p>
 <p><strong>Conservação:</strong> não se decreta a anulação se houver suplemento suficiente ou se a parte favorecida concordar em reduzir o proveito.</p></section>

 <section><h4>7. Estado de perigo × lesão</h4><table class="civil-compare"><tr><th>Estado de perigo</th><th>Lesão</th></tr>
 <tr><td>Centro do problema: salvar pessoa de grave dano.</td><td>Centro do problema: necessidade econômica/inexperiência e desproporção.</td></tr>
 <tr><td>Exige conhecimento do grave dano pela outra parte.</td><td>Art. 157 não formula igual requisito textual de conhecimento da vulnerabilidade.</td></tr>
 <tr><td>Obrigação excessivamente onerosa.</td><td>Prestação manifestamente desproporcional.</td></tr></table></section>

 <section><h4>8. Fraude contra credores — arts. 158 a 165</h4><p>A fraude contra credores protege a <strong>garantia patrimonial</strong> do credor contra atos do devedor insolvente.</p><ul>
 <li><strong>Transmissão gratuita/remissão:</strong> pode ser atacada se o devedor já era insolvente ou se o ato o reduziu à insolvência, mesmo que ele a ignore.</li>
 <li>Também pode agir o credor cuja garantia se tornou insuficiente.</li>
 <li><strong>Anterioridade:</strong> em regra, só credores que já existiam no momento do ato podem pleitear sua desconstituição.</li>
 <li><strong>Contrato oneroso:</strong> exige insolvência notória ou motivo para que fosse conhecida pelo outro contratante.</li>
 <li>A ação pode alcançar devedor, contraparte e terceiro adquirente de má-fé nas hipóteses legais.</li>
 <li>Pagamento antecipado a credor quirografário e concessão de preferência pelo insolvente têm disciplina específica.</li>
 <li>Negócios ordinários indispensáveis à manutenção da atividade ou subsistência do devedor/família presumem-se de boa-fé.</li></ul></section>

 <section><h4>9. Consequência mínima que você precisa saber agora</h4><p>Os vícios deste módulo integram o campo da <strong>anulabilidade</strong>. Para responder às questões, memorize também a ponte do art. 178: em regra, prazo decadencial de <strong>4 anos</strong>; na coação, conta-se da cessação; em erro, dolo, fraude contra credores, estado de perigo e lesão, da realização do negócio.</p>
 <div class="civil-alert">A teoria completa de nulidade × anulabilidade, confirmação, pronúncia judicial e efeitos fica para o Módulo 6.</div></section>
 </div>`
}
function civil5DeepBody(){
 return `<div class="civil-theory">
 <section class="civil-juris"><h4>STJ — lesão e estado de perigo não são presumidos</h4><p>No REsp 1.723.690/DF, a Terceira Turma destacou que estado de perigo e lesão precisam ser comprovados. Para lesão, devem coexistir <strong>desproporção objetiva</strong> e <strong>premente necessidade ou inexperiência</strong>. O Código não fixa percentual matemático para a desproporção: a aferição depende do caso concreto.</p></section>

 <section class="civil-juris"><h4>STJ — fraude contra credores e ação pauliana</h4><p>Em precedente destacado no Informativo 847/2025, o STJ reafirmou como requisitos relevantes da fraude contra credores o <strong>eventus damni</strong>, o <strong>consilium/scientia fraudis</strong> e a <strong>anterioridade da dívida</strong>, esta última ligada ao art. 158, §2º.</p><p>Para prova, não confunda fraude contra credores com desconsideração da personalidade jurídica ou fraude à execução: são técnicas jurídicas distintas.</p></section>

 <section class="civil-juris"><h4>Aprofundamento — erro × dolo</h4><p>No erro, a falsa percepção pode nascer sem manipulação intencional da contraparte. No dolo, há atuação intencional — inclusive silêncio doloso — voltada a provocar ou manter a falsa percepção. A FCC frequentemente narra o mesmo erro fático, mudando apenas a origem da falsa percepção para trocar a resposta.</p></section>

 <section class="civil-juris"><h4>Aprofundamento — coação × estado de perigo</h4><p>Na coação, a pressão decorre de <strong>ameaça</strong>. No estado de perigo, o dano grave pode decorrer das próprias circunstâncias; a contraparte se aproveita da situação conhecida para obter obrigação excessivamente onerosa.</p></section>

 <section><h4>Mapa de pegadinhas</h4><table class="civil-compare"><tr><th>Pegadinha</th><th>Regra correta</th></tr>
 <tr><td>Todo erro anula.</td><td>Precisa ser substancial e cumprir o art. 138; erro de cálculo apenas retifica.</td></tr>
 <tr><td>Dolo acidental anula o negócio.</td><td>Não; gera perdas e danos.</td></tr>
 <tr><td>Dolo bilateral permite que a parte menos culpada anule.</td><td>Nenhuma das partes pode invocar o dolo da outra.</td></tr>
 <tr><td>Temor reverencial é coação.</td><td>Não é.</td></tr>
 <tr><td>Coação de terceiro sempre anula.</td><td>Depende do conhecimento da parte beneficiada.</td></tr>
 <tr><td>Toda necessidade econômica é estado de perigo.</td><td>Estado de perigo gira em torno de grave dano à pessoa; necessidade/inexperiência + desproporção aponta para lesão.</td></tr>
 <tr><td>Lesão exige percentual fixo de desproporção.</td><td>Não há tarifa legal.</td></tr>
 <tr><td>Desproporção surgida anos depois caracteriza lesão.</td><td>A aferição é no momento da celebração.</td></tr>
 <tr><td>Fraude contra credores só ocorre em negócio gratuito.</td><td>Também alcança contratos onerosos nas condições do art. 159.</td></tr>
 <tr><td>Credor posterior pode sempre propor pauliana.</td><td>A anterioridade do crédito é regra expressa do art. 158, §2º.</td></tr>
 <tr><td>Simulação é um dos defeitos dos arts. 138-165.</td><td>No CC atual, simulação está no art. 167 e é causa de nulidade; fica para o Módulo 6.</td></tr></table></section>
 </div>`
}
function civil5ErrorStep(){
 const id='errors5',m=civilModuleState('m5'),done=!!m.errorsReviewed,open=localStorage.getItem(civil5StepOpenKey(id))==='1';
 const qs=civil5StageQuestions('errors5'),unresolved=qs.filter(q=>civilAnswer(q.id)?.lastCorrect===false);
 const rows=qs.map((q,i)=>{const a=civilAnswer(q.id);return `<div class="civil-error-row"><div><b>${q.kind==='real'?'FCC':'Autoral'} • ${esc(q.subject)}</b><small>${a?.lastCorrect?'Corrigida na última tentativa':'Ainda errada na última tentativa'} · ${a?.attempts||0} tentativa(s)</small></div><button class="civil-btn" onclick="civil5Ui={stage:'errors5',index:${i}};localStorage.setItem(civil5StepOpenKey('errors5'),'1');renderSubjects()">Revisar</button></div>`}).join('');
 return `<section class="civil-step ${done?'done':''} ${open?'open':''}" data-step="errors5"><button class="civil-step-head" onclick="toggleCivil5Step('errors5')"><span class="civil-step-n">${done?'✓':'7'}</span><span class="civil-step-title"><b>Revisão de erros</b><small>Somente erros deste módulo.</small></span><span class="civil-step-status">${qs.length} no histórico · ${unresolved.length} ainda erradas</span><span>⌄</span></button>
 <div class="civil-step-body">${qs.length?`<div class="civil-error-list">${rows}</div>${civil5Ui.stage==='errors5'?`<div style="margin-top:9px">${civil5StageSession('errors5')}</div>`:''}`:'<div class="muted small">Nenhum erro registrado neste módulo ainda.</div>'}
 <label class="civil-manual-done"><input type="checkbox" ${done?'checked':''} onchange="civilSetModule('m5',{errorsReviewed:this.checked})"> Marcar minha revisão de erros como concluída</label></div></section>`
}
function civil5AnkiStep(){
 const id='anki5',m=civilModuleState('m5'),done=!!m.anki,open=localStorage.getItem(civil5StepOpenKey(id))==='1';
 const deck='04 DIREITO CIVIL::05 FATOS E NEGÓCIOS JURÍDICOS';
 return `<section class="civil-step ${done?'done':''} ${open?'open':''}" data-step="anki5"><button class="civil-step-head" onclick="toggleCivil5Step('anki5')"><span class="civil-step-n">${done?'✓':'8'}</span><span class="civil-step-title"><b>Anki seletivo</b><small>Revisão dos defeitos no baralho já existente.</small></span><span class="civil-step-status">${done?'Concluído':'Pendente'}</span><span>⌄</span></button>
 <div class="civil-step-body"><p class="civil-anki-note">Use o baralho <b>Fatos e Negócios Jurídicos</b>, concentrando-se agora em erro, dolo, coação, estado de perigo, lesão e fraude contra credores. Simulação e invalidade geral ficam para o próximo módulo.</p>
 <div class="civil-stage-actions" style="margin-top:9px"><button class="civil-btn primary" onclick="window.openAnkiDeck('${escJs(deck)}')">🧠 Abrir Fatos e Negócios Jurídicos</button></div>
 <label class="civil-manual-done"><input type="checkbox" ${done?'checked':''} onchange="civilSetModule('m5',{anki:this.checked})"> Marcar revisão no Anki como concluída</label></div></section>`
}
function renderCivilModule5(){
 const pct=civilModulePct('m5');
 return `<div class="civil-overall"><span style="width:${pct}%"></span></div><div class="civil-scope-note"><span class="civil-scope-badge edital">EDITAL</span><b>Escopo fechado do Módulo 5:</b> Erro ou Ignorância (138-144), Dolo (145-150), Coação (151-155), Estado de Perigo (156), Lesão (157) e Fraude contra Credores (158-165). <b>Invalidade e simulação começam no art. 166/167 e ficam para o Módulo 6.</b></div>
 <div class="civil-steps">
 ${civil5QuestionStep('diagnostic5','Diagnóstico FCC','10 questões reais antes da teoria.',1)}
 ${civil5ManualStep('reading5','Leitura orientada','CC 138 a 165, sem avançar à invalidade.',2,civil5ReadingBody(),'reading')}
 ${civil5ManualStep('theory5','Teoria nuclear','Identificação precisa dos seis defeitos e suas diferenças.',3,civil5TheoryBody(),'theory')}
 ${civil5ManualStep('deep5','Aprofundamento e jurisprudência','STJ, ação pauliana e pegadinhas de nível superior.',4,civil5DeepBody(),'deep')}
 ${civil5QuestionStep('cases5','Casos práticos','5 casos autorais identificados.',5)}
 ${civil5QuestionStep('final5','Bateria final FCC','15 questões reais após a teoria.',6)}
 ${civil5ErrorStep()}
 ${civil5AnkiStep()}
 </div>`
}


let civil6Ui={stage:null,index:0};
function civil6StepOpenKey(id){return `central-v6:civil-step:m6:${id}`}
function civil6StageQuestions(stage){
 if(stage==='diagnostic6')return CIVIL_COURSE.diagnostic6||[];
 if(stage==='final6')return CIVIL_COURSE.final6||[];
 if(stage==='cases6')return CIVIL_COURSE.cases6||[];
 if(stage==='errors6'){
  const all=[...(CIVIL_COURSE.diagnostic6||[]),...(CIVIL_COURSE.cases6||[]),...(CIVIL_COURSE.final6||[])];
  return all.filter(q=>civilAnswer(q.id)?.everWrong);
 }
 return[];
}
function civil6StageDone(stage){
 const qs=civil6StageQuestions(stage);return qs.length>0&&qs.every(q=>(civilAnswer(q.id)?.attempts||0)>0)
}
function civil6Steps(){
 const m=civilModuleState('m6');
 return [
  {id:'diagnostic6',done:civil6StageDone('diagnostic6')},
  {id:'reading6',done:!!m.reading},
  {id:'theory6',done:!!m.theory},
  {id:'deep6',done:!!m.deep},
  {id:'cases6',done:civil6StageDone('cases6')},
  {id:'final6',done:civil6StageDone('final6')},
  {id:'errors6',done:!!m.errorsReviewed},
  {id:'anki6',done:!!m.anki}
 ]
}
function toggleCivil6Step(id){
 const el=document.querySelector(`.civil-module[data-civil="m6"] .civil-step[data-step="${id}"]`);if(!el)return;
 const open=!el.classList.contains('open');el.classList.toggle('open',open);localStorage.setItem(civil6StepOpenKey(id),open?'1':'0')
}
function civil6OpenStage(stage){
 const qs=civil6StageQuestions(stage);if(!qs.length){civil6Ui={stage,index:0};renderSubjects();return}
 let idx=qs.findIndex(q=>(civilAnswer(q.id)?.attempts||0)===0);if(idx<0)idx=0;
 civil6Ui={stage,index:idx};localStorage.setItem(civil6StepOpenKey(stage),'1');renderSubjects();
 setTimeout(()=>document.querySelector(`.civil-module[data-civil="m6"] .civil-step[data-step="${stage}"]`)?.scrollIntoView({behavior:'smooth',block:'center'}),20)
}
function civil6Select(id,letter){
 const st=civilState(),a=st.answers[id]||{attempts:0,history:[],everWrong:false};
 if(a.submitted)return;a.selected=letter;a.submitted=false;st.answers[id]=a;civilSave(st);renderSubjects()
}
function civil6Submit(id,stage){
 const q=[...(CIVIL_COURSE.diagnostic6||[]),...(CIVIL_COURSE.cases6||[]),...(CIVIL_COURSE.final6||[])].find(x=>x.id===id);
 if(!q)return;const st=civilState(),a=st.answers[id]||{attempts:0,history:[],everWrong:false};
 if(!a.selected){alert('Escolha uma alternativa primeiro.');return}
 const correct=a.selected===q.answer;
 a.attempts=(a.attempts||0)+1;a.submitted=true;a.lastCorrect=correct;a.everWrong=!!a.everWrong||!correct;
 a.history=[...(a.history||[]),{at:new Date().toISOString(),selected:a.selected,correct,stage,module:'m6'}];
 st.answers[id]=a;civilSave(st);renderAll()
}
function civil6Retry(id){const st=civilState(),a=st.answers[id];if(!a)return;a.selected=null;a.submitted=false;st.answers[id]=a;civilSave(st);renderSubjects()}
function civil6Move(stage,delta){
 const qs=civil6StageQuestions(stage);if(!qs.length)return;
 civil6Ui.stage=stage;civil6Ui.index=Math.max(0,Math.min(qs.length-1,civil6Ui.index+delta));renderSubjects()
}
function civil6Accuracy(stage){
 const qs=civil6StageQuestions(stage),answered=qs.map(q=>civilAnswer(q.id)).filter(a=>a?.attempts);
 const correct=answered.filter(a=>a.lastCorrect).length;
 return {answered:answered.length,total:qs.length,correct,pct:answered.length?Math.round(correct/answered.length*100):0}
}
function civil6QuestionCard(q,stage,index,total){
 const a=civilAnswer(q.id)||{selected:null,submitted:false,attempts:0,history:[]},locked=!!a.submitted;
 const opts=Object.entries(q.options).map(([letter,text])=>{
  let cls='civil-option';if(a.selected===letter)cls+=' selected';
  if(locked&&letter===q.answer)cls+=' correct';else if(locked&&a.selected===letter&&letter!==q.answer)cls+=' wrong';
  return `<button class="${cls}" ${locked?'disabled':''} onclick="civil6Select('${escJs(q.id)}','${letter}')"><span class="civil-letter">${letter}</span><span>${esc(text)}</span></button>`
 }).join('');
 const feedback=locked?`<div class="civil-feedback ${a.lastCorrect?'good':'bad'}"><b>${a.lastCorrect?'✓ Resposta correta':'✕ Resposta incorreta — gabarito '+q.answer}</b>${esc(q.explanation)}<span class="basis">Fundamento: ${esc(q.basis)}${a.attempts>1?' · '+a.attempts+' tentativas':''}</span></div>`:'';
 return `<article class="civil-qcard">${civilQuestionMeta(q)}<h4>${esc(q.prompt)}</h4><div class="civil-options">${opts}</div>
 <div class="civil-submit-row"><div>${q.kind==='real'?`<a class="civil-source-link" href="${escAttr(q.url)}" target="_blank" rel="noopener">Fonte da questão no TEC ↗</a>`:'<span class="muted small">Caso criado para aplicação da regra.</span>'}</div>
 <div class="civil-qnav"><button class="civil-btn" onclick="civil6Move('${stage}',-1)" ${index===0?'disabled':''}>←</button><span>${index+1} / ${total}</span><button class="civil-btn" onclick="civil6Move('${stage}',1)" ${index===total-1?'disabled':''}>→</button></div>
 ${locked?`<button class="civil-btn" onclick="civil6Retry('${escJs(q.id)}')">Refazer</button>`:`<button class="civil-btn primary" onclick="civil6Submit('${escJs(q.id)}','${stage}')">Responder</button>`}
 </div>${feedback}</article>`
}
function civil6StageSession(stage){
 const qs=civil6StageQuestions(stage);if(!qs.length)return '<div class="muted small">Nenhuma questão disponível.</div>';
 if(civil6Ui.stage!==stage)civil6Ui={stage,index:Math.max(0,qs.findIndex(q=>(civilAnswer(q.id)?.attempts||0)===0))};
 civil6Ui.index=Math.max(0,Math.min(qs.length-1,civil6Ui.index));
 return civil6QuestionCard(qs[civil6Ui.index],stage,civil6Ui.index,qs.length)
}
function civil6QuestionStep(stage,title,subtitle,num){
 const stats=civil6Accuracy(stage),done=civil6StageDone(stage),open=localStorage.getItem(civil6StepOpenKey(stage))==='1',active=civil6Ui.stage===stage;
 return `<section class="civil-step ${done?'done':''} ${open?'open':''}" data-step="${stage}">
 <button class="civil-step-head" onclick="toggleCivil6Step('${stage}')"><span class="civil-step-n">${done?'✓':num}</span><span class="civil-step-title"><b>${esc(title)}</b><small>${esc(subtitle)}</small></span><span class="civil-step-status">${stats.answered}/${stats.total} respondidas${stats.answered?' · '+stats.pct+'%':''}</span><span>⌄</span></button>
 <div class="civil-step-body"><div class="civil-stage-toolbar"><p>${stage==='diagnostic6'?'Diagnóstico misto: invalidade, prescrição/decadência e prova. Resolva antes de abrir a teoria.':stage==='final6'?'Bateria posterior à teoria, com questões reais selecionadas de carreiras jurídicas e tribunais.':'Casos para testar conversão, simulação, prescrição, decadência e prova.'}</p><div class="civil-stage-actions"><button class="civil-btn primary" onclick="civil6OpenStage('${stage}')">${stats.answered?'Continuar':'Iniciar'}</button></div></div>${active?civil6StageSession(stage):''}</div></section>`
}
function civil6ManualStep(id,title,subtitle,num,body,field){
 const st=civilModuleState('m6'),done=!!st[field],open=localStorage.getItem(civil6StepOpenKey(id))==='1';
 return `<section class="civil-step ${done?'done':''} ${open?'open':''}" data-step="${id}">
 <button class="civil-step-head" onclick="toggleCivil6Step('${id}')"><span class="civil-step-n">${done?'✓':num}</span><span class="civil-step-title"><b>${esc(title)}</b><small>${esc(subtitle)}</small></span><span class="civil-step-status">${done?'Concluído':'Pendente'}</span><span>⌄</span></button>
 <div class="civil-step-body">${body}<label class="civil-manual-done"><input type="checkbox" ${done?'checked':''} onchange="civilSetModule('m6',{${field}:this.checked})"> Marcar esta etapa como concluída</label></div></section>`
}
function civil6ReadingBody(){
 return `<div class="civil-theory"><section><h4>Leitura orientada — fechamento da Parte Geral</h4><div class="civil-law-grid">
 <div class="civil-law-card"><b>CC, arts. 166 a 184</b><span>Nulidade, anulabilidade, simulação, confirmação, conversão e efeitos.</span></div>
 <div class="civil-law-card"><b>CC, arts. 185 a 188</b><span>Ponte: atos jurídicos lícitos e atos ilícitos. Responsabilidade Civil será aprofundada no Módulo 10.</span></div>
 <div class="civil-law-card"><b>CC, arts. 189 a 206-A</b><span>Prescrição, impedimento/suspensão, interrupção, prazos e prescrição intercorrente.</span></div>
 <div class="civil-law-card"><b>CC, arts. 207 a 211</b><span>Decadência legal e convencional.</span></div>
 <div class="civil-law-card"><b>CC, arts. 212 a 232</b><span>Prova: confissão, documentos, testemunhas, presunção, perícia e exame médico.</span></div>
 </div><div class="civil-stage-actions"><button class="civil-btn primary" onclick="saveLast({civilModule:'m6',title:'Direito Civil • Módulo 6 • Leitura no Vade Mecum',at:Date.now()});openVadeMecum(null,'cc')">📖 Abrir Código Civil no Vade Mecum</button></div>
 <div class="civil-alert"><b>Pare no art. 232.</b> O art. 233 inicia a Parte Especial, com Obrigações de Dar. O Módulo 7 começa exatamente dali.</div></section></div>`
}
function civil6TheoryBody(){
 return `<div class="civil-theory">
 <section><h4>1. Nulidade × anulabilidade</h4><table class="civil-compare"><tr><th>Nulidade</th><th>Anulabilidade</th></tr>
 <tr><td>Interesse público mais intenso; hipóteses dos arts. 166 e 167.</td><td>Proteção de interesse predominantemente particular; art. 171 e hipóteses legais específicas.</td></tr>
 <tr><td>Pode ser alegada por qualquer interessado e pelo MP quando couber.</td><td>Só interessados podem alegar; não se pronuncia de ofício.</td></tr>
 <tr><td>Juiz deve pronunciar se a encontrar provada ao conhecer do negócio/efeitos.</td><td>Depende de iniciativa do interessado.</td></tr>
 <tr><td>Não admite confirmação nem convalesce pelo tempo.</td><td>Pode ser confirmada, salvo direito de terceiro.</td></tr></table></section>

 <section><h4>2. Causas de nulidade — art. 166</h4><ul><li>agente absolutamente incapaz;</li><li>objeto ilícito, impossível ou indeterminável;</li><li>motivo determinante ilícito <strong>comum a ambas as partes</strong>;</li><li>falta da forma prescrita;</li><li>preterição de solenidade essencial;</li><li>objetivo de fraudar lei imperativa;</li><li>lei declarar nulo ou proibir o ato sem outra sanção.</li></ul></section>

 <section><h4>3. Simulação — art. 167</h4><p>Negócio simulado é <strong>nulo</strong>. Se houver negócio dissimulado e este for válido na substância e na forma, ele subsiste.</p><p>Há simulação quando, entre outras hipóteses, o negócio aparenta conferir direitos a pessoa diversa da real, contém declaração/cláusula não verdadeira ou usa instrumento antedatado/pós-datado.</p><div class="civil-alert">Direitos de terceiros de boa-fé são ressalvados. No CC/2002, a simulação pode ser alegada até por um simulador contra o outro.</div></section>

 <section><h4>4. Nulidade: pronúncia, conversão e tempo</h4><ul><li><strong>Art. 168:</strong> juiz pronuncia a nulidade quando a encontrar provada; não pode suprir o vício.</li><li><strong>Art. 169:</strong> nulo não confirma nem convalesce pelo tempo.</li><li><strong>Art. 170:</strong> conversão substancial — o negócio nulo pode subsistir como outro se contiver seus requisitos e for razoável supor que as partes o teriam querido.</li></ul></section>

 <section><h4>5. Anulabilidade — arts. 171 a 179</h4><p>São anuláveis, além das hipóteses especiais, negócios praticados por relativamente incapaz e os viciados por erro, dolo, coação, estado de perigo, lesão ou fraude contra credores.</p><ul><li>Pode haver confirmação expressa ou pela execução voluntária ciente do vício.</li><li>Falta de autorização de terceiro pode ser suprida posteriormente.</li><li>O negócio anulável produz efeitos até ser anulado por sentença.</li><li><strong>Art. 178:</strong> quatro anos para os vícios ali listados, com termos iniciais diferentes.</li><li><strong>Art. 179:</strong> se a lei apenas diz 'anulável' e não fixa prazo → dois anos da conclusão do ato.</li></ul></section>

 <section><h4>6. Efeitos da invalidade — arts. 180 a 184</h4><ul><li>Menor de 16 a 18 que dolosamente oculta a idade ou se declara maior não pode usar a idade para se eximir da obrigação.</li><li>Pagamento a incapaz após anulação só é reclamável se provado que reverteu em proveito dele.</li><li>Anulado o negócio, busca-se retorno ao estado anterior; se impossível, equivalente indenizatório.</li><li>Invalidade do instrumento não contamina o negócio se ele puder ser provado por outro meio.</li><li>Invalidade parcial não atinge a parte válida separável.</li></ul></section>

 <section><h4>7. Ponte — atos lícitos e ilícitos (185 a 188)</h4><p>O art. 185 manda aplicar, no que couber, as regras dos negócios jurídicos aos atos lícitos que não sejam negócios jurídicos. Os arts. 186 e 187 definem ato ilícito por violação culposa/dolosa com dano e por abuso de direito. O art. 188 traz excludentes como legítima defesa, exercício regular e estado de necessidade nos limites legais.</p><div class="civil-alert">Aqui é só a ponte. Responsabilidade Civil será estudada com profundidade no Módulo 10.</div></section>

 <section><h4>8. Prescrição: o que se extingue?</h4><p>Violado o direito, nasce a <strong>pretensão</strong>; é a pretensão que se extingue pela prescrição nos prazos dos arts. 205 e 206. A exceção prescreve no mesmo prazo.</p><ul><li>Renúncia só depois de consumada e sem prejuízo de terceiro.</li><li>Prazos prescricionais não podem ser alterados por acordo.</li><li>Pode ser alegada em qualquer grau pela parte a quem aproveita.</li><li>Prescrição iniciada continua contra o sucessor.</li></ul></section>

 <section><h4>9. Impedimento e suspensão — arts. 197 a 201</h4><p>Não corre prescrição, entre outras hipóteses, entre cônjuges na sociedade conjugal; ascendentes e descendentes durante poder familiar; tutelados/curatelados e tutores/curadores; contra absolutamente incapazes; contra ausentes do país em serviço público; e durante algumas situações objetivas como condição suspensiva e ação de evicção.</p><p>Suspensão em favor de um credor solidário só aproveita aos demais se a obrigação for indivisível.</p></section>

 <section><h4>10. Interrupção — arts. 202 a 204</h4><p>A interrupção <strong>só pode ocorrer uma vez</strong>. Entre os fatos interruptivos estão despacho que ordena citação — mesmo de juiz incompetente —, protesto, protesto cambial, ato judicial que constitua em mora e reconhecimento inequívoco do direito pelo devedor.</p><ul><li>Pode ser provocada por qualquer interessado.</li><li>Regra: efeito é pessoal.</li><li>Solidariedade cria exceções.</li><li>Interrupção contra o devedor principal <strong>prejudica o fiador</strong>.</li></ul></section>

 <section><h4>11. Prazos que mais caem — versão atual</h4><table class="civil-compare"><tr><th>Prazo</th><th>Exemplos centrais</th></tr>
 <tr><td>10 anos</td><td>Prazo residual quando a lei não fixa menor.</td></tr>
 <tr><td>5 anos</td><td>Dívida líquida constante de instrumento público ou particular; honorários de profissionais liberais; despesas do vencedor em juízo.</td></tr>
 <tr><td>3 anos</td><td>Aluguéis, enriquecimento sem causa, reparação civil e outras hipóteses do §3º.</td></tr>
 <tr><td>2 anos</td><td>Prestações alimentares a partir de cada vencimento.</td></tr>
 <tr><td>1 ano</td><td>Hipóteses específicas do §1º.</td></tr></table>
 <div class="civil-alert"><b>Atualização:</b> o antigo art. 206, §1º, II, relativo à pretensão do segurado contra segurador/vice-versa, foi revogado pela Lei 15.040/2024. Não estude por tabela antiga.</div>
 <p><strong>Art. 206-A:</strong> a prescrição intercorrente observa o mesmo prazo da pretensão, com as causas de impedimento, suspensão e interrupção e o art. 921 do CPC.</p></section>

 <section><h4>12. Decadência — arts. 207 a 211</h4><table class="civil-compare"><tr><th>Decadência legal</th><th>Decadência convencional</th></tr>
 <tr><td>Renúncia é nula.</td><td>Pode ser alegada pela parte a quem aproveita em qualquer grau.</td></tr>
 <tr><td>Juiz deve conhecê-la de ofício.</td><td>Juiz não pode suprir a alegação.</td></tr></table>
 <p>Regra: causas de impedimento, suspensão e interrupção da prescrição não se aplicam à decadência, salvo disposição legal em contrário. Aplicam-se os arts. 195 e 198, I.</p></section>

 <section><h4>13. Prova — arts. 212 a 232</h4><p>Salvo negócio sujeito a forma especial, os meios expressamente listados são <strong>confissão, documento, testemunha, presunção e perícia</strong>.</p><ul>
 <li><strong>Confissão:</strong> precisa partir de quem possa dispor do direito; é irrevogável, mas anulável por erro de fato ou coação.</li>
 <li><strong>Escritura pública:</strong> fé pública e prova plena; requisitos do art. 215.</li>
 <li><strong>Instrumento particular:</strong> prova obrigações convencionais de qualquer valor; efeitos perante terceiros dependem do registro nas hipóteses legais.</li>
 <li><strong>Reproduções mecânicas/eletrônicas:</strong> fazem prova plena se não impugnada a exatidão.</li>
 <li><strong>Testemunha:</strong> art. 228 mantém impedimentos específicos, mas permite depoimento em situações excepcionais e assegura igualdade à pessoa com deficiência com tecnologia assistiva.</li>
 <li><strong>Exame médico:</strong> ninguém pode aproveitar-se da própria recusa; a recusa à perícia ordenada pode suprir a prova buscada.</li></ul>
 <div class="civil-alert">Arts. 227, 229 e 230 tiveram dispositivos revogados pelo CPC/2015. Use o texto compilado atual.</div></section>
 </div>`
}
function civil6DeepBody(){
 return `<div class="civil-theory">
 <section class="civil-juris"><h4>STJ 2026 — simulador pode alegar a própria simulação</h4><p>No Informativo 885/2026, a Terceira Turma reafirmou que o CC/2002 superou a antiga regra do CC/1916 que impedia os simuladores de alegarem o vício entre si. Como a simulação é nulidade absoluta, pode ser alegada por uma das partes contra a outra.</p></section>

 <section class="civil-juris"><h4>STJ — actio nata: regra objetiva e exceção subjetiva</h4><p>O art. 189 liga o nascimento da pretensão à violação do direito. O STJ trabalha, como regra, com a vertente objetiva da <em>actio nata</em>. A vertente subjetiva — ciência inequívoca do dano/efeitos — é excepcional e depende do tipo de pretensão e das circunstâncias.</p></section>

 <section class="civil-juris"><h4>Prescrição intercorrente — atualização legislativa</h4><p>O art. 206-A, na redação da Lei 14.382/2022, determina que a prescrição intercorrente siga o mesmo prazo prescricional da pretensão material, observadas as causas do Código e o art. 921 do CPC. É um ponto que não existia com essa redação em materiais antigos.</p></section>

 <section class="civil-juris"><h4>Prova e inclusão</h4><p>Após a Lei Brasileira de Inclusão, pessoa com deficiência pode testemunhar em igualdade de condições e tem direito aos recursos de tecnologia assistiva. A deficiência, por si, não aparece mais como impedimento testemunhal.</p></section>

 <section><h4>Mapa de pegadinhas</h4><table class="civil-compare"><tr><th>Pegadinha</th><th>Regra correta</th></tr>
 <tr><td>Simulação é anulável em quatro anos.</td><td>É nula; art. 167.</td></tr>
 <tr><td>Nulidade pode ser confirmada pelas partes.</td><td>Não; art. 169.</td></tr>
 <tr><td>Anulabilidade pode ser pronunciada de ofício.</td><td>Não; art. 177.</td></tr>
 <tr><td>Todo ato anulável tem prazo de quatro anos.</td><td>Se não houver prazo específico, art. 179 prevê dois anos.</td></tr>
 <tr><td>Prescrição extingue o direito subjetivo em si.</td><td>O art. 189 fala em extinção da pretensão.</td></tr>
 <tr><td>Prazos de prescrição podem ser negociados.</td><td>Não podem; art. 192.</td></tr>
 <tr><td>Interrupção pode ocorrer quantas vezes forem necessárias.</td><td>Só uma vez.</td></tr>
 <tr><td>Prescrição iniciada zera com a morte do devedor.</td><td>Continua contra o sucessor.</td></tr>
 <tr><td>Decadência convencional é conhecida de ofício.</td><td>Não; art. 211.</td></tr>
 <tr><td>Confissão nunca pode ser anulada.</td><td>É irrevogável, mas pode ser anulada por erro de fato ou coação.</td></tr>
 <tr><td>Pessoa com deficiência não pode testemunhar.</td><td>Pode, em igualdade, com tecnologia assistiva.</td></tr>
 <tr><td>Recusa à perícia médica é neutra.</td><td>Pode suprir a prova pretendida.</td></tr></table></section>
 </div>`
}
function civil6ErrorStep(){
 const id='errors6',m=civilModuleState('m6'),done=!!m.errorsReviewed,open=localStorage.getItem(civil6StepOpenKey(id))==='1';
 const qs=civil6StageQuestions('errors6'),unresolved=qs.filter(q=>civilAnswer(q.id)?.lastCorrect===false);
 const rows=qs.map((q,i)=>{const a=civilAnswer(q.id);return `<div class="civil-error-row"><div><b>${q.kind==='real'?'FCC':'Autoral'} • ${esc(q.subject)}</b><small>${a?.lastCorrect?'Corrigida na última tentativa':'Ainda errada na última tentativa'} · ${a?.attempts||0} tentativa(s)</small></div><button class="civil-btn" onclick="civil6Ui={stage:'errors6',index:${i}};localStorage.setItem(civil6StepOpenKey('errors6'),'1');renderSubjects()">Revisar</button></div>`}).join('');
 return `<section class="civil-step ${done?'done':''} ${open?'open':''}" data-step="errors6"><button class="civil-step-head" onclick="toggleCivil6Step('errors6')"><span class="civil-step-n">${done?'✓':'7'}</span><span class="civil-step-title"><b>Revisão de erros</b><small>Somente erros deste módulo.</small></span><span class="civil-step-status">${qs.length} no histórico · ${unresolved.length} ainda erradas</span><span>⌄</span></button>
 <div class="civil-step-body">${qs.length?`<div class="civil-error-list">${rows}</div>${civil6Ui.stage==='errors6'?`<div style="margin-top:9px">${civil6StageSession('errors6')}</div>`:''}`:'<div class="muted small">Nenhum erro registrado neste módulo ainda.</div>'}
 <label class="civil-manual-done"><input type="checkbox" ${done?'checked':''} onchange="civilSetModule('m6',{errorsReviewed:this.checked})"> Marcar minha revisão de erros como concluída</label></div></section>`
}
function civil6AnkiStep(){
 const id='anki6',m=civilModuleState('m6'),done=!!m.anki,open=localStorage.getItem(civil6StepOpenKey(id))==='1';
 const deck1='04 DIREITO CIVIL::05 FATOS E NEGÓCIOS JURÍDICOS';
 const deck2='04 DIREITO CIVIL::06 PRESCRIÇÃO E DECADÊNCIA';
 return `<section class="civil-step ${done?'done':''} ${open?'open':''}" data-step="anki6"><button class="civil-step-head" onclick="toggleCivil6Step('anki6')"><span class="civil-step-n">${done?'✓':'8'}</span><span class="civil-step-title"><b>Anki seletivo</b><small>Invalidade + Prescrição/Decadência.</small></span><span class="civil-step-status">${done?'Concluído':'Pendente'}</span><span>⌄</span></button>
 <div class="civil-step-body"><p class="civil-anki-note">Use <b>Fatos e Negócios Jurídicos</b> para nulidade/anulabilidade/simulação e <b>Prescrição e Decadência</b> para prazos e causas. A coleção atual não possui um subbaralho específico de Prova; por isso essa parte fica consolidada pelas questões e revisão de erros do próprio módulo.</p>
 <div class="civil-stage-actions" style="margin-top:9px"><button class="civil-btn primary" onclick="window.openAnkiDeck('${escJs(deck1)}')">🧠 Invalidade</button><button class="civil-btn primary" onclick="window.openAnkiDeck('${escJs(deck2)}')">🧠 Prescrição e Decadência</button></div>
 <label class="civil-manual-done"><input type="checkbox" ${done?'checked':''} onchange="civilSetModule('m6',{anki:this.checked})"> Marcar revisão no Anki como concluída</label></div></section>`
}
function renderCivilModule6(){
 const pct=civilModulePct('m6');
 return `<div class="civil-overall"><span style="width:${pct}%"></span></div><div class="civil-scope-note"><span class="civil-scope-badge mix">EDITAL + COMPLEMENTAR</span><b>Escopo fechado do Módulo 6:</b> Invalidade (166-184), ponte dos atos jurídicos (185-188), Prescrição (189-206-A), Decadência (207-211) e Prova (212-232). <b>Com isso, a Parte Geral fica fechada; Obrigações começam no Módulo 7, art. 233.</b></div>
 <div class="civil-steps">
 ${civil6QuestionStep('diagnostic6','Diagnóstico FCC','10 questões reais antes da teoria.',1)}
 ${civil6ManualStep('reading6','Leitura orientada','CC 166 a 232, fechando a Parte Geral.',2,civil6ReadingBody(),'reading')}
 ${civil6ManualStep('theory6','Teoria nuclear','Invalidade, prazos e regras probatórias com texto atualizado.',3,civil6TheoryBody(),'theory')}
 ${civil6ManualStep('deep6','Aprofundamento e jurisprudência','STJ 2026, actio nata e atualizações legislativas.',4,civil6DeepBody(),'deep')}
 ${civil6QuestionStep('cases6','Casos práticos','5 casos autorais identificados.',5)}
 ${civil6QuestionStep('final6','Bateria final FCC','15 questões reais após a teoria.',6)}
 ${civil6ErrorStep()}
 ${civil6AnkiStep()}
 </div>`
}


let civil7Ui={stage:null,index:0};
function civil7StepOpenKey(id){return `central-v6:civil-step:m7:${id}`}
function civil7StageQuestions(stage){
 if(stage==='diagnostic7')return CIVIL_COURSE.diagnostic7||[];
 if(stage==='final7')return CIVIL_COURSE.final7||[];
 if(stage==='cases7')return CIVIL_COURSE.cases7||[];
 if(stage==='errors7'){
  const all=[...(CIVIL_COURSE.diagnostic7||[]),...(CIVIL_COURSE.cases7||[]),...(CIVIL_COURSE.final7||[])];
  return all.filter(q=>civilAnswer(q.id)?.everWrong);
 }
 return[];
}
function civil7StageDone(stage){
 const qs=civil7StageQuestions(stage);return qs.length>0&&qs.every(q=>(civilAnswer(q.id)?.attempts||0)>0)
}
function civil7Steps(){
 const m=civilModuleState('m7');
 return [
  {id:'diagnostic7',done:civil7StageDone('diagnostic7')},
  {id:'reading7',done:!!m.reading},
  {id:'theory7',done:!!m.theory},
  {id:'deep7',done:!!m.deep},
  {id:'cases7',done:civil7StageDone('cases7')},
  {id:'final7',done:civil7StageDone('final7')},
  {id:'errors7',done:!!m.errorsReviewed},
  {id:'anki7',done:!!m.anki}
 ]
}
function toggleCivil7Step(id){
 const el=document.querySelector(`.civil-module[data-civil="m7"] .civil-step[data-step="${id}"]`);if(!el)return;
 const open=!el.classList.contains('open');el.classList.toggle('open',open);localStorage.setItem(civil7StepOpenKey(id),open?'1':'0')
}
function civil7OpenStage(stage){
 const qs=civil7StageQuestions(stage);if(!qs.length){civil7Ui={stage,index:0};renderSubjects();return}
 let idx=qs.findIndex(q=>(civilAnswer(q.id)?.attempts||0)===0);if(idx<0)idx=0;
 civil7Ui={stage,index:idx};localStorage.setItem(civil7StepOpenKey(stage),'1');renderSubjects();
 setTimeout(()=>document.querySelector(`.civil-module[data-civil="m7"] .civil-step[data-step="${stage}"]`)?.scrollIntoView({behavior:'smooth',block:'center'}),20)
}
function civil7Select(id,letter){
 const st=civilState(),a=st.answers[id]||{attempts:0,history:[],everWrong:false};
 if(a.submitted)return;a.selected=letter;a.submitted=false;st.answers[id]=a;civilSave(st);renderSubjects()
}
function civil7Submit(id,stage){
 const q=[...(CIVIL_COURSE.diagnostic7||[]),...(CIVIL_COURSE.cases7||[]),...(CIVIL_COURSE.final7||[])].find(x=>x.id===id);
 if(!q)return;const st=civilState(),a=st.answers[id]||{attempts:0,history:[],everWrong:false};
 if(!a.selected){alert('Escolha uma alternativa primeiro.');return}
 const correct=a.selected===q.answer;
 a.attempts=(a.attempts||0)+1;a.submitted=true;a.lastCorrect=correct;a.everWrong=!!a.everWrong||!correct;
 a.history=[...(a.history||[]),{at:new Date().toISOString(),selected:a.selected,correct,stage,module:'m7'}];
 st.answers[id]=a;civilSave(st);renderAll()
}
function civil7Retry(id){const st=civilState(),a=st.answers[id];if(!a)return;a.selected=null;a.submitted=false;st.answers[id]=a;civilSave(st);renderSubjects()}
function civil7Move(stage,delta){
 const qs=civil7StageQuestions(stage);if(!qs.length)return;
 civil7Ui.stage=stage;civil7Ui.index=Math.max(0,Math.min(qs.length-1,civil7Ui.index+delta));renderSubjects()
}
function civil7Accuracy(stage){
 const qs=civil7StageQuestions(stage),answered=qs.map(q=>civilAnswer(q.id)).filter(a=>a?.attempts);
 const correct=answered.filter(a=>a.lastCorrect).length;
 return {answered:answered.length,total:qs.length,correct,pct:answered.length?Math.round(correct/answered.length*100):0}
}
function civil7QuestionCard(q,stage,index,total){
 const a=civilAnswer(q.id)||{selected:null,submitted:false,attempts:0,history:[]},locked=!!a.submitted;
 const opts=Object.entries(q.options).map(([letter,text])=>{
  let cls='civil-option';if(a.selected===letter)cls+=' selected';
  if(locked&&letter===q.answer)cls+=' correct';else if(locked&&a.selected===letter&&letter!==q.answer)cls+=' wrong';
  return `<button class="${cls}" ${locked?'disabled':''} onclick="civil7Select('${escJs(q.id)}','${letter}')"><span class="civil-letter">${letter}</span><span>${esc(text)}</span></button>`
 }).join('');
 const feedback=locked?`<div class="civil-feedback ${a.lastCorrect?'good':'bad'}"><b>${a.lastCorrect?'✓ Resposta correta':'✕ Resposta incorreta — gabarito '+q.answer}</b>${esc(q.explanation)}<span class="basis">Fundamento: ${esc(q.basis)}${a.attempts>1?' · '+a.attempts+' tentativas':''}</span></div>`:'';
 return `<article class="civil-qcard">${civilQuestionMeta(q)}<h4>${esc(q.prompt)}</h4><div class="civil-options">${opts}</div>
 <div class="civil-submit-row"><div>${q.kind==='real'?`<a class="civil-source-link" href="${escAttr(q.url)}" target="_blank" rel="noopener">Fonte da questão no TEC ↗</a>`:'<span class="muted small">Caso criado para aplicação da regra.</span>'}</div>
 <div class="civil-qnav"><button class="civil-btn" onclick="civil7Move('${stage}',-1)" ${index===0?'disabled':''}>←</button><span>${index+1} / ${total}</span><button class="civil-btn" onclick="civil7Move('${stage}',1)" ${index===total-1?'disabled':''}>→</button></div>
 ${locked?`<button class="civil-btn" onclick="civil7Retry('${escJs(q.id)}')">Refazer</button>`:`<button class="civil-btn primary" onclick="civil7Submit('${escJs(q.id)}','${stage}')">Responder</button>`}
 </div>${feedback}</article>`
}
function civil7StageSession(stage){
 const qs=civil7StageQuestions(stage);if(!qs.length)return '<div class="muted small">Nenhuma questão disponível.</div>';
 if(civil7Ui.stage!==stage)civil7Ui={stage,index:Math.max(0,qs.findIndex(q=>(civilAnswer(q.id)?.attempts||0)===0))};
 civil7Ui.index=Math.max(0,Math.min(qs.length-1,civil7Ui.index));
 return civil7QuestionCard(qs[civil7Ui.index],stage,civil7Ui.index,qs.length)
}
function civil7QuestionStep(stage,title,subtitle,num){
 const stats=civil7Accuracy(stage),done=civil7StageDone(stage),open=localStorage.getItem(civil7StepOpenKey(stage))==='1',active=civil7Ui.stage===stage;
 return `<section class="civil-step ${done?'done':''} ${open?'open':''}" data-step="${stage}">
 <button class="civil-step-head" onclick="toggleCivil7Step('${stage}')"><span class="civil-step-n">${done?'✓':num}</span><span class="civil-step-title"><b>${esc(title)}</b><small>${esc(subtitle)}</small></span><span class="civil-step-status">${stats.answered}/${stats.total} respondidas${stats.answered?' · '+stats.pct+'%':''}</span><span>⌄</span></button>
 <div class="civil-step-body"><div class="civil-stage-toolbar"><p>${stage==='diagnostic7'?'Resolva sem consultar o Código: o diagnóstico mistura as modalidades para testar reconhecimento da regra aplicável.':stage==='final7'?'Bateria posterior à teoria, com questões reais FCC de dar, não fazer, alternativas, indivisibilidade e solidariedade.':'Casos para consolidar fazer, alternativas, indivisibilidade e solidariedade.'}</p><div class="civil-stage-actions"><button class="civil-btn primary" onclick="civil7OpenStage('${stage}')">${stats.answered?'Continuar':'Iniciar'}</button></div></div>${active?civil7StageSession(stage):''}</div></section>`
}
function civil7ManualStep(id,title,subtitle,num,body,field){
 const st=civilModuleState('m7'),done=!!st[field],open=localStorage.getItem(civil7StepOpenKey(id))==='1';
 return `<section class="civil-step ${done?'done':''} ${open?'open':''}" data-step="${id}">
 <button class="civil-step-head" onclick="toggleCivil7Step('${id}')"><span class="civil-step-n">${done?'✓':num}</span><span class="civil-step-title"><b>${esc(title)}</b><small>${esc(subtitle)}</small></span><span class="civil-step-status">${done?'Concluído':'Pendente'}</span><span>⌄</span></button>
 <div class="civil-step-body">${body}<label class="civil-manual-done"><input type="checkbox" ${done?'checked':''} onchange="civilSetModule('m7',{${field}:this.checked})"> Marcar esta etapa como concluída</label></div></section>`
}
function civil7ReadingBody(){
 return `<div class="civil-theory"><section><h4>Leitura orientada — Módulo 7</h4><div class="civil-law-grid">
 <div class="civil-law-card"><b>CC, arts. 233 a 246</b><span>Dar coisa certa, restituir coisa certa e dar coisa incerta.</span></div>
 <div class="civil-law-card"><b>CC, arts. 247 a 249</b><span>Obrigações de fazer: personalíssima, impossibilidade e execução por terceiro.</span></div>
 <div class="civil-law-card"><b>CC, arts. 250 e 251</b><span>Obrigações de não fazer.</span></div>
 <div class="civil-law-card"><b>CC, arts. 252 a 256</b><span>Obrigações alternativas e impossibilidade das prestações.</span></div>
 <div class="civil-law-card"><b>CC, arts. 257 a 263</b><span>Divisibilidade e indivisibilidade.</span></div>
 <div class="civil-law-card"><b>CC, arts. 264 a 285</b><span>Solidariedade ativa e passiva.</span></div>
 </div><div class="civil-stage-actions"><button class="civil-btn primary" onclick="saveLast({civilModule:'m7',title:'Direito Civil • Módulo 7 • Leitura no Vade Mecum',at:Date.now()});openVadeMecum(null,'cc')">📖 Abrir Código Civil no Vade Mecum</button></div>
 <div class="civil-alert"><b>Pare no art. 285.</b> O art. 286 inicia a cessão de crédito e a Transmissão das Obrigações, que abre o Módulo 8.</div></section></div>`
}
function civil7TheoryBody(){
 return `<div class="civil-theory">
 <section><h4>1. Estrutura mínima da obrigação</h4><p>A obrigação é relação jurídica em que um sujeito ativo pode exigir de um sujeito passivo uma prestação juridicamente devida. Para este módulo, o essencial é identificar <strong>quem deve, o que deve e qual modalidade governa o objeto</strong>.</p><div class="civil-alert">A FCC costuma mudar apenas um detalhe — culpa, tradição, escolha ou pluralidade de sujeitos — para alterar toda a consequência jurídica.</div></section>

 <section><h4>2. Dar coisa certa — arts. 233 a 237</h4><p>A obrigação de dar coisa certa abrange os <strong>acessórios</strong>, mesmo não mencionados, salvo se o título ou as circunstâncias indicarem o contrário.</p>
 <table class="civil-compare"><tr><th>Situação antes da tradição</th><th>Consequência</th></tr>
 <tr><td>Perda sem culpa do devedor</td><td>Resolve-se a obrigação para ambas as partes.</td></tr>
 <tr><td>Perda com culpa</td><td>Devedor paga equivalente + perdas e danos.</td></tr>
 <tr><td>Deterioração sem culpa</td><td>Credor resolve ou aceita com abatimento proporcional.</td></tr>
 <tr><td>Deterioração com culpa</td><td>Credor exige equivalente ou aceita no estado; em ambos, perdas e danos.</td></tr></table>
 <p>Até a tradição, a coisa pertence ao devedor com seus melhoramentos e acrescidos; ele pode pedir aumento do preço. Frutos percebidos ficam com o devedor e os pendentes com o credor.</p></section>

 <section><h4>3. Restituir coisa certa — arts. 238 a 242</h4><p>A lógica muda porque a coisa já pertence ao credor.</p><table class="civil-compare"><tr><th>Evento</th><th>Regra</th></tr>
 <tr><td>Perda sem culpa</td><td>O credor sofre a perda; obrigação resolve-se, preservados direitos até o dia da perda.</td></tr>
 <tr><td>Perda por culpa</td><td>Equivalente + perdas e danos.</td></tr>
 <tr><td>Deterioração sem culpa</td><td>Credor recebe tal como se acha, sem indenização.</td></tr>
 <tr><td>Deterioração por culpa</td><td>Aplica-se a responsabilidade equivalente à perda culposa.</td></tr></table></section>

 <section><h4>4. Dar coisa incerta — arts. 243 a 246</h4><p>A coisa incerta é indicada ao menos por <strong>gênero e quantidade</strong>. Regra: a escolha cabe ao devedor, se o título não disser diferente.</p><ul><li>Não pode entregar a pior qualidade.</li><li>Não pode ser compelido à melhor.</li><li>Feita a escolha e cientificado o credor, aplicam-se as regras da coisa certa.</li><li><strong>Antes da escolha, o devedor não pode alegar perda ou deterioração, nem mesmo por força maior ou caso fortuito.</strong></li></ul></section>

 <section><h4>5. Fazer — arts. 247 a 249</h4><table class="civil-compare"><tr><th>Prestação personalíssima</th><th>Prestação fungível</th></tr>
 <tr><td>Se o devedor recusa prestação só a ele imposta ou só por ele exequível → perdas e danos.</td><td>Se terceiro puder executar e houver recusa/mora, credor pode mandar executar às custas do devedor + indenização.</td></tr></table>
 <p>Impossibilidade sem culpa resolve a obrigação; se houver culpa, o devedor responde por perdas e danos. Em urgência, a prestação fungível pode ser executada ou mandada executar sem autorização judicial, com ressarcimento posterior.</p></section>

 <section><h4>6. Não fazer — arts. 250 e 251</h4><p>Se, sem culpa, torna-se impossível ao devedor abster-se do ato, a obrigação se extingue. Se ele pratica o ato que prometeu não praticar, o credor pode exigir o desfazimento e perdas e danos.</p><p><strong>Urgência:</strong> o credor pode desfazer ou mandar desfazer independentemente de autorização judicial e depois ser ressarcido.</p></section>

 <section><h4>7. Alternativas — arts. 252 a 256</h4><p>Há duas ou mais prestações previstas, mas o adimplemento ocorre pela escolhida.</p><ul><li>Regra: escolha do <strong>devedor</strong>.</li><li>Não pode impor parte de uma prestação e parte de outra.</li><li>Prestações periódicas: opção pode ser exercida em cada período.</li><li>Pluralidade de optantes sem unanimidade: juiz decide após o prazo de deliberação.</li><li>Opção dada a terceiro que não queira/não possa exercê-la: juiz escolhe se não houver acordo.</li></ul>
 <table class="civil-compare"><tr><th>Impossibilidade</th><th>Efeito</th></tr>
 <tr><td>Uma prestação impossível</td><td>Subsiste a outra.</td></tr>
 <tr><td>Todas impossíveis sem culpa</td><td>Extingue-se a obrigação.</td></tr>
 <tr><td>Todas impossíveis por culpa, escolha do devedor</td><td>Valor da última que se impossibilitou + perdas e danos.</td></tr>
 <tr><td>Escolha do credor + culpa do devedor</td><td>Aplicam-se as opções amplas do art. 255.</td></tr></table></section>

 <section><h4>8. Divisíveis e indivisíveis — arts. 257 a 263</h4><p>Pluralidade de credores/devedores em obrigação divisível gera, por presunção, tantas obrigações iguais e distintas quantos forem os sujeitos.</p><p>É indivisível a prestação que não comporta divisão por sua <strong>natureza, motivo econômico ou razão determinante do negócio</strong>.</p><ul><li>Pluralidade de devedores: cada um pode ser obrigado pela dívida toda; quem paga sub-roga-se contra os demais.</li><li>Pluralidade de credores: cada um pode exigir a dívida inteira, mas o devedor se libera pagando a todos conjuntamente ou a um com caução de ratificação dos outros.</li><li>Remissão por um credor: os demais exigem a prestação descontando a quota dele.</li><li><strong>Conversão em perdas e danos elimina a indivisibilidade.</strong></li></ul></section>

 <section><h4>9. Indivisibilidade × solidariedade</h4><table class="civil-compare"><tr><th>Indivisibilidade</th><th>Solidariedade</th></tr>
 <tr><td>Decorre da prestação/objeto.</td><td>Decorre da lei ou vontade das partes.</td></tr>
 <tr><td>Pode existir sem solidariedade.</td><td>Não se presume.</td></tr>
 <tr><td>Convertida em perdas e danos, perde a indivisibilidade.</td><td>Convertida em perdas e danos, a solidariedade subsiste.</td></tr></table>
 <div class="civil-alert">Essa diferença é uma das pegadinhas mais recorrentes do bloco.</div></section>

 <section><h4>10. Solidariedade — arts. 264 a 266</h4><p>Há solidariedade quando há pluralidade de credores ou devedores e cada um tem direito ou está obrigado à <strong>dívida toda</strong>.</p><p><strong>Não se presume:</strong> resulta da lei ou da vontade das partes. A obrigação pode ter condição, termo ou local de pagamento diferentes para cada cocredor/codevedor.</p></section>

 <section><h4>11. Solidariedade ativa — arts. 267 a 274</h4><ul><li>Cada credor pode exigir a prestação por inteiro.</li><li>Enquanto nenhum demandar o devedor, este pode pagar a qualquer credor solidário.</li><li>Pagamento a um extingue a dívida até o montante pago.</li><li>Morte de credor: cada herdeiro recebe sua quota hereditária, salvo indivisibilidade.</li><li>Convertida em perdas e danos, a solidariedade subsiste.</li><li>Credor que recebe ou remite responde aos demais pelas respectivas quotas.</li><li>Exceção pessoal de um credor não pode ser oposta aos outros.</li><li>Julgamento contrário a um não atinge os demais; favorável aproveita, ressalvada exceção pessoal.</li></ul></section>

 <section><h4>12. Solidariedade passiva — arts. 275 a 285</h4><ul><li>Credor escolhe um, alguns ou todos e pode exigir parcial ou totalmente a dívida.</li><li>Ação contra apenas um ou alguns <strong>não</strong> renuncia à solidariedade.</li><li>Pagamento parcial reduz o débito, mantendo solidariedade pelo saldo.</li><li>Condição adicional pactuada com um codevedor não pode agravar os demais sem consentimento.</li><li>Impossibilidade culposa por um: todos respondem pelo equivalente; só o culpado responde pelas perdas e danos adicionais.</li><li>Todos respondem pelos juros de mora, com regresso contra o culpado pelo acréscimo.</li><li>Devedor pode opor exceções pessoais próprias e comuns, mas não as pessoais de outro codevedor.</li><li>Credor pode renunciar à solidariedade em favor de um, alguns ou todos.</li></ul></section>

 <section><h4>13. Regresso entre codevedores — arts. 283 a 285</h4><p>Quem satisfaz a dívida <strong>por inteiro</strong> pode exigir de cada codevedor sua quota. A quota do insolvente é repartida entre os demais. Até os exonerados da solidariedade participam do rateio da parcela do insolvente na proporção legal.</p><p>Se a dívida interessava exclusivamente a um devedor, ele responde integralmente perante aquele que pagou.</p></section>
 </div>`
}
function civil7DeepBody(){
 return `<div class="civil-theory">
 <section class="civil-juris"><h4>STJ 2026 — pagamento parcial não abre regresso imediato</h4><p>No REsp 2.232.326/RJ, Informativo 892/2026, a Terceira Turma distinguiu a <strong>fase externa</strong> da solidariedade — relação credor/codevedores — da <strong>fase interna</strong> de acerto entre codevedores.</p><p>O pagamento parcial reduz a dívida comum, mas o direito de regresso do art. 283 somente se torna exigível depois da <strong>quitação integral</strong> perante o credor.</p></section>

 <section class="civil-juris"><h4>STJ — cobrar um devedor não renuncia aos demais</h4><p>A jurisprudência aplica o art. 275 literalmente: cabe ao credor escolher contra qual ou quais devedores solidários dirigir a cobrança. Demandar apenas um deles não significa renunciar à solidariedade dos outros.</p></section>

 <section><h4>Mapa de pegadinhas</h4><table class="civil-compare"><tr><th>Pegadinha</th><th>Regra correta</th></tr>
 <tr><td>Coisa certa não abrange acessórios não mencionados.</td><td>Abrange, salvo título/circunstâncias em contrário.</td></tr>
 <tr><td>Na coisa incerta o credor escolhe.</td><td>Regra: devedor escolhe.</td></tr>
 <tr><td>Antes da escolha, força maior libera o devedor da coisa incerta.</td><td>Não pode alegar perda/deterioração nem por força maior.</td></tr>
 <tr><td>Obrigação de fazer sempre pode ser executada por terceiro.</td><td>Não se a prestação for personalíssima.</td></tr>
 <tr><td>Urgência em fazer/não fazer sempre exige ordem judicial.</td><td>Há autorização legal para atuação imediata com ressarcimento posterior.</td></tr>
 <tr><td>Obrigação alternativa permite metade de cada prestação.</td><td>Não, salvo estrutura contratual diversa; art. 252, §1º.</td></tr>
 <tr><td>Indivisibilidade = solidariedade.</td><td>São institutos distintos.</td></tr>
 <tr><td>Perdas e danos preservam indivisibilidade.</td><td>Não; art. 263.</td></tr>
 <tr><td>Solidariedade é presumida quando há vários devedores.</td><td>Não; resulta da lei ou vontade.</td></tr>
 <tr><td>Ação contra um devedor renuncia aos outros.</td><td>Não; art. 275, parágrafo único.</td></tr>
 <tr><td>Pagamento parcial libera quem pagou do saldo.</td><td>Não necessariamente; a solidariedade persiste pelo remanescente.</td></tr>
 <tr><td>Pagamento parcial já autoriza regresso imediato.</td><td>STJ 2026: regresso exige quitação integral da dívida comum.</td></tr></table></section>
 </div>`
}
function civil7ErrorStep(){
 const id='errors7',m=civilModuleState('m7'),done=!!m.errorsReviewed,open=localStorage.getItem(civil7StepOpenKey(id))==='1';
 const qs=civil7StageQuestions('errors7'),unresolved=qs.filter(q=>civilAnswer(q.id)?.lastCorrect===false);
 const rows=qs.map((q,i)=>{const a=civilAnswer(q.id);return `<div class="civil-error-row"><div><b>${q.kind==='real'?'FCC':'Autoral'} • ${esc(q.subject)}</b><small>${a?.lastCorrect?'Corrigida na última tentativa':'Ainda errada na última tentativa'} · ${a?.attempts||0} tentativa(s)</small></div><button class="civil-btn" onclick="civil7Ui={stage:'errors7',index:${i}};localStorage.setItem(civil7StepOpenKey('errors7'),'1');renderSubjects()">Revisar</button></div>`}).join('');
 return `<section class="civil-step ${done?'done':''} ${open?'open':''}" data-step="errors7"><button class="civil-step-head" onclick="toggleCivil7Step('errors7')"><span class="civil-step-n">${done?'✓':'7'}</span><span class="civil-step-title"><b>Revisão de erros</b><small>Somente erros deste módulo.</small></span><span class="civil-step-status">${qs.length} no histórico · ${unresolved.length} ainda erradas</span><span>⌄</span></button>
 <div class="civil-step-body">${qs.length?`<div class="civil-error-list">${rows}</div>${civil7Ui.stage==='errors7'?`<div style="margin-top:9px">${civil7StageSession('errors7')}</div>`:''}`:'<div class="muted small">Nenhum erro registrado neste módulo ainda.</div>'}
 <label class="civil-manual-done"><input type="checkbox" ${done?'checked':''} onchange="civilSetModule('m7',{errorsReviewed:this.checked})"> Marcar minha revisão de erros como concluída</label></div></section>`
}
