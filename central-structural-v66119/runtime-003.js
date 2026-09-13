function civil7AnkiStep(){
 const id='anki7',m=civilModuleState('m7'),done=!!m.anki,open=localStorage.getItem(civil7StepOpenKey(id))==='1';
 const deck='04 DIREITO CIVIL::07 OBRIGAÇÕES - MODALIDADES E TRANSMISSÃO';
 return `<section class="civil-step ${done?'done':''} ${open?'open':''}" data-step="anki7"><button class="civil-step-head" onclick="toggleCivil7Step('anki7')"><span class="civil-step-n">${done?'✓':'8'}</span><span class="civil-step-title"><b>Anki seletivo</b><small>Modalidades das Obrigações.</small></span><span class="civil-step-status">${done?'Concluído':'Pendente'}</span><span>⌄</span></button>
 <div class="civil-step-body"><p class="civil-anki-note">O baralho existente reúne <b>Modalidades e Transmissão</b>. Neste módulo, revise somente os cards de arts. 233 a 285: dar, fazer, não fazer, alternativas, divisíveis/indivisíveis e solidariedade. <b>Cessão de crédito e assunção de dívida ficam para o Módulo 8.</b></p>
 <div class="civil-stage-actions" style="margin-top:9px"><button class="civil-btn primary" onclick="window.openAnkiDeck('${escJs(deck)}')">🧠 Abrir Modalidades e Transmissão</button></div>
 <label class="civil-manual-done"><input type="checkbox" ${done?'checked':''} onchange="civilSetModule('m7',{anki:this.checked})"> Marcar revisão no Anki como concluída</label></div></section>`
}
function renderCivilModule7(){
 const pct=civilModulePct('m7');
 return `<div class="civil-overall"><span style="width:${pct}%"></span></div><div class="civil-scope-note"><span class="civil-scope-badge edital">EDITAL</span><b>Escopo fechado do Módulo 7:</b> Modalidades das Obrigações — dar (233-246), fazer (247-249), não fazer (250-251), alternativas (252-256), divisíveis/indivisíveis (257-263) e solidariedade (264-285). <b>Transmissão das Obrigações começa no art. 286 e fica para o Módulo 8.</b></div>
 <div class="civil-steps">
 ${civil7QuestionStep('diagnostic7','Diagnóstico FCC','10 questões reais antes da teoria.',1)}
 ${civil7ManualStep('reading7','Leitura orientada','CC 233 a 285, sem avançar à cessão de crédito.',2,civil7ReadingBody(),'reading')}
 ${civil7ManualStep('theory7','Teoria nuclear','Todas as modalidades com diferenças e efeitos.',3,civil7TheoryBody(),'theory')}
 ${civil7ManualStep('deep7','Aprofundamento e jurisprudência','STJ 2026 e pegadinhas de solidariedade.',4,civil7DeepBody(),'deep')}
 ${civil7QuestionStep('cases7','Casos práticos','5 casos autorais identificados.',5)}
 ${civil7QuestionStep('final7','Bateria final FCC','15 questões reais após a teoria.',6)}
 ${civil7ErrorStep()}
 ${civil7AnkiStep()}
 </div>`
}


let civil8Ui={stage:null,index:0};
function civil8StepOpenKey(id){return `central-v6:civil-step:m8:${id}`}
function civil8StageQuestions(stage){
 if(stage==='diagnostic8')return CIVIL_COURSE.diagnostic8||[];
 if(stage==='final8')return CIVIL_COURSE.final8||[];
 if(stage==='cases8')return CIVIL_COURSE.cases8||[];
 if(stage==='errors8'){
  const all=[...(CIVIL_COURSE.diagnostic8||[]),...(CIVIL_COURSE.cases8||[]),...(CIVIL_COURSE.final8||[])];
  return all.filter(q=>civilAnswer(q.id)?.everWrong);
 }
 return[];
}
function civil8StageDone(stage){
 const qs=civil8StageQuestions(stage);return qs.length>0&&qs.every(q=>(civilAnswer(q.id)?.attempts||0)>0)
}
function civil8Steps(){
 const m=civilModuleState('m8');
 return [
  {id:'diagnostic8',done:civil8StageDone('diagnostic8')},
  {id:'reading8',done:!!m.reading},
  {id:'theory8',done:!!m.theory},
  {id:'deep8',done:!!m.deep},
  {id:'cases8',done:civil8StageDone('cases8')},
  {id:'final8',done:civil8StageDone('final8')},
  {id:'errors8',done:!!m.errorsReviewed},
  {id:'anki8',done:!!m.anki}
 ]
}
function toggleCivil8Step(id){
 const el=document.querySelector(`.civil-module[data-civil="m8"] .civil-step[data-step="${id}"]`);if(!el)return;
 const open=!el.classList.contains('open');el.classList.toggle('open',open);localStorage.setItem(civil8StepOpenKey(id),open?'1':'0')
}
function civil8OpenStage(stage){
 const qs=civil8StageQuestions(stage);if(!qs.length){civil8Ui={stage,index:0};renderSubjects();return}
 let idx=qs.findIndex(q=>(civilAnswer(q.id)?.attempts||0)===0);if(idx<0)idx=0;
 civil8Ui={stage,index:idx};localStorage.setItem(civil8StepOpenKey(stage),'1');renderSubjects();
 setTimeout(()=>document.querySelector(`.civil-module[data-civil="m8"] .civil-step[data-step="${stage}"]`)?.scrollIntoView({behavior:'smooth',block:'center'}),20)
}
function civil8Select(id,letter){
 const st=civilState(),a=st.answers[id]||{attempts:0,history:[],everWrong:false};
 if(a.submitted)return;a.selected=letter;a.submitted=false;st.answers[id]=a;civilSave(st);renderSubjects()
}
function civil8Submit(id,stage){
 const q=[...(CIVIL_COURSE.diagnostic8||[]),...(CIVIL_COURSE.cases8||[]),...(CIVIL_COURSE.final8||[])].find(x=>x.id===id);
 if(!q)return;const st=civilState(),a=st.answers[id]||{attempts:0,history:[],everWrong:false};
 if(!a.selected){alert('Escolha uma alternativa primeiro.');return}
 const correct=a.selected===q.answer;
 a.attempts=(a.attempts||0)+1;a.submitted=true;a.lastCorrect=correct;a.everWrong=!!a.everWrong||!correct;
 a.history=[...(a.history||[]),{at:new Date().toISOString(),selected:a.selected,correct,stage,module:'m8'}];
 st.answers[id]=a;civilSave(st);renderAll()
}
function civil8Retry(id){const st=civilState(),a=st.answers[id];if(!a)return;a.selected=null;a.submitted=false;st.answers[id]=a;civilSave(st);renderSubjects()}
function civil8Move(stage,delta){
 const qs=civil8StageQuestions(stage);if(!qs.length)return;
 civil8Ui.stage=stage;civil8Ui.index=Math.max(0,Math.min(qs.length-1,civil8Ui.index+delta));renderSubjects()
}
function civil8Accuracy(stage){
 const qs=civil8StageQuestions(stage),answered=qs.map(q=>civilAnswer(q.id)).filter(a=>a?.attempts);
 const correct=answered.filter(a=>a.lastCorrect).length;
 return {answered:answered.length,total:qs.length,correct,pct:answered.length?Math.round(correct/answered.length*100):0}
}
function civil8QuestionCard(q,stage,index,total){
 const a=civilAnswer(q.id)||{selected:null,submitted:false,attempts:0,history:[]},locked=!!a.submitted;
 const opts=Object.entries(q.options).map(([letter,text])=>{
  let cls='civil-option';if(a.selected===letter)cls+=' selected';
  if(locked&&letter===q.answer)cls+=' correct';else if(locked&&a.selected===letter&&letter!==q.answer)cls+=' wrong';
  return `<button class="${cls}" ${locked?'disabled':''} onclick="civil8Select('${escJs(q.id)}','${letter}')"><span class="civil-letter">${letter}</span><span>${esc(text)}</span></button>`
 }).join('');
 const feedback=locked?`<div class="civil-feedback ${a.lastCorrect?'good':'bad'}"><b>${a.lastCorrect?'✓ Resposta correta':'✕ Resposta incorreta — gabarito '+q.answer}</b>${esc(q.explanation)}<span class="basis">Fundamento: ${esc(q.basis)}${a.attempts>1?' · '+a.attempts+' tentativas':''}</span></div>`:'';
 return `<article class="civil-qcard">${civilQuestionMeta(q)}<h4>${esc(q.prompt)}</h4><div class="civil-options">${opts}</div>
 <div class="civil-submit-row"><div>${q.kind==='real'?`<a class="civil-source-link" href="${escAttr(q.url)}" target="_blank" rel="noopener">Fonte da questão no TEC ↗</a>`:'<span class="muted small">Caso criado para aplicação da regra.</span>'}</div>
 <div class="civil-qnav"><button class="civil-btn" onclick="civil8Move('${stage}',-1)" ${index===0?'disabled':''}>←</button><span>${index+1} / ${total}</span><button class="civil-btn" onclick="civil8Move('${stage}',1)" ${index===total-1?'disabled':''}>→</button></div>
 ${locked?`<button class="civil-btn" onclick="civil8Retry('${escJs(q.id)}')">Refazer</button>`:`<button class="civil-btn primary" onclick="civil8Submit('${escJs(q.id)}','${stage}')">Responder</button>`}
 </div>${feedback}</article>`
}
function civil8StageSession(stage){
 const qs=civil8StageQuestions(stage);if(!qs.length)return '<div class="muted small">Nenhuma questão disponível.</div>';
 if(civil8Ui.stage!==stage)civil8Ui={stage,index:Math.max(0,qs.findIndex(q=>(civilAnswer(q.id)?.attempts||0)===0))};
 civil8Ui.index=Math.max(0,Math.min(qs.length-1,civil8Ui.index));
 return civil8QuestionCard(qs[civil8Ui.index],stage,civil8Ui.index,qs.length)
}
function civil8QuestionStep(stage,title,subtitle,num){
 const stats=civil8Accuracy(stage),done=civil8StageDone(stage),open=localStorage.getItem(civil8StepOpenKey(stage))==='1',active=civil8Ui.stage===stage;
 return `<section class="civil-step ${done?'done':''} ${open?'open':''}" data-step="${stage}">
 <button class="civil-step-head" onclick="toggleCivil8Step('${stage}')"><span class="civil-step-n">${done?'✓':num}</span><span class="civil-step-title"><b>${esc(title)}</b><small>${esc(subtitle)}</small></span><span class="civil-step-status">${stats.answered}/${stats.total} respondidas${stats.answered?' · '+stats.pct+'%':''}</span><span>⌄</span></button>
 <div class="civil-step-body"><div class="civil-stage-toolbar"><p>${stage==='diagnostic8'?'Resolva antes da teoria. O bloco mistura transmissão, pagamento e inadimplemento para testar a consequência jurídica correta.':stage==='final8'?'Bateria posterior à teoria, com questões reais FCC e atenção às alterações de 2024.':'Casos para cobrir institutos menos explorados pelo banco real deste caderno.'}</p><div class="civil-stage-actions"><button class="civil-btn primary" onclick="civil8OpenStage('${stage}')">${stats.answered?'Continuar':'Iniciar'}</button></div></div>${active?civil8StageSession(stage):''}</div></section>`
}
function civil8ManualStep(id,title,subtitle,num,body,field){
 const st=civilModuleState('m8'),done=!!st[field],open=localStorage.getItem(civil8StepOpenKey(id))==='1';
 return `<section class="civil-step ${done?'done':''} ${open?'open':''}" data-step="${id}">
 <button class="civil-step-head" onclick="toggleCivil8Step('${id}')"><span class="civil-step-n">${done?'✓':num}</span><span class="civil-step-title"><b>${esc(title)}</b><small>${esc(subtitle)}</small></span><span class="civil-step-status">${done?'Concluído':'Pendente'}</span><span>⌄</span></button>
 <div class="civil-step-body">${body}<label class="civil-manual-done"><input type="checkbox" ${done?'checked':''} onchange="civilSetModule('m8',{${field}:this.checked})"> Marcar esta etapa como concluída</label></div></section>`
}
function civil8ReadingBody(){
 return `<div class="civil-theory"><section><h4>Leitura orientada — fechamento de Obrigações</h4><div class="civil-law-grid">
 <div class="civil-law-card"><b>CC, arts. 286 a 303</b><span>Cessão de crédito e assunção de dívida.</span></div>
 <div class="civil-law-card"><b>CC, arts. 304 a 333</b><span>Pagamento: sujeitos, objeto, prova, lugar e tempo.</span></div>
 <div class="civil-law-card"><b>CC, arts. 334 a 359</b><span>Consignação, sub-rogação, imputação e dação.</span></div>
 <div class="civil-law-card"><b>CC, arts. 360 a 388</b><span>Novação, compensação, confusão e remissão.</span></div>
 <div class="civil-law-card"><b>CC, arts. 389 a 407</b><span>Inadimplemento, mora, perdas e danos e juros legais.</span></div>
 <div class="civil-law-card"><b>CC, arts. 408 a 420</b><span>Cláusula penal e arras.</span></div>
 </div><div class="civil-stage-actions"><button class="civil-btn primary" onclick="saveLast({civilModule:'m8',title:'Direito Civil • Módulo 8 • Leitura no Vade Mecum',at:Date.now()});openVadeMecum(null,'cc')">📖 Abrir Código Civil no Vade Mecum</button></div>
 <div class="civil-alert"><b>Atenção especial aos arts. 389, 395, 404, 406 e 418:</b> houve alteração pela Lei 14.905/2024. <b>Pare no art. 420.</b> O art. 421 inicia Contratos em Geral, assunto do Módulo 9.</div></section></div>`
}
function civil8TheoryBody(){
 return `<div class="civil-theory">
 <section><h4>1. Cessão de crédito — arts. 286 a 298</h4><p>O credor pode ceder o crédito, salvo impedimento decorrente da natureza da obrigação, da lei ou de convenção com o devedor. A cláusula proibitiva não é oponível ao cessionário de boa-fé se não constar do instrumento.</p><ul><li>Regra: cessão abrange acessórios.</li><li>Perante terceiros, observar a forma do art. 288.</li><li>Perante o devedor, a cessão só produz eficácia após notificação ou ciência escrita.</li><li>Várias cessões: prevalece a completada pela tradição do título.</li><li>Antes de saber da cessão, pagamento ao credor primitivo exonera o devedor.</li><li>Devedor pode opor ao cessionário exceções próprias e as que tinha contra o cedente quando tomou ciência.</li><li>Cedente oneroso responde pela existência do crédito; pela solvência, somente se assumir essa responsabilidade.</li></ul></section>

 <section><h4>2. Assunção de dívida — arts. 299 a 303</h4><p>Terceiro pode assumir a obrigação com <strong>consentimento expresso do credor</strong>. O silêncio ao prazo assinado é recusa, salvo hipótese especial do adquirente de imóvel hipotecado do art. 303.</p><ul><li>Devedor primitivo é exonerado, salvo insolvência anterior do novo devedor ignorada pelo credor.</li><li>Garantias especiais dadas pelo devedor antigo se extinguem, salvo assentimento expresso dele.</li><li>Novo devedor não pode opor exceções pessoais do devedor primitivo.</li></ul></section>

 <section><h4>3. Pagamento — quem pode pagar e a quem</h4><ul><li>Qualquer interessado na extinção pode pagar e usar meios de exoneração.</li><li>Terceiro não interessado também pode pagar; em nome próprio tem direito a reembolso, mas não se sub-roga automaticamente.</li><li>Pagamento feito contra oposição/desconhecimento do devedor não gera reembolso se o devedor tinha meios para ilidir a ação.</li><li>Pagamento deve ser feito ao credor ou representante; pagamento de boa-fé ao credor putativo é válido.</li><li>Pagamento ao incapaz só vale na medida em que efetivamente reverteu em seu benefício.</li></ul></section>

 <section><h4>4. Objeto, prova, lugar e tempo — arts. 313 a 333</h4><p>Credor não é obrigado a receber prestação diversa, ainda que mais valiosa. Dívidas em dinheiro são pagas no vencimento pelo valor nominal, observadas as regras atuais de atualização.</p><ul><li>É lícito convencionar aumento progressivo de prestações sucessivas.</li><li>Quitação regular pode ser exigida e o devedor pode reter pagamento até recebê-la.</li><li>Entrega do título ao devedor presume pagamento, com possibilidade de prova em contrário no prazo legal.</li><li>Pagamento da última parcela presume pagas as anteriores, salvo prova em contrário.</li><li>Regra de lugar: domicílio do devedor, salvo convenção/natureza/circunstâncias.</li><li>Pagamento reiterado em outro local presume renúncia do credor ao local contratual.</li><li>Sem prazo ajustado, credor pode exigir imediatamente.</li></ul></section>

 <section><h4>5. Consignação — arts. 334 a 345</h4><p>O depósito judicial ou bancário da coisa devida, nos casos legais, considera-se pagamento e extingue a obrigação.</p><p>Hipóteses centrais: recusa injusta do credor; credor não comparece; incapacidade/desconhecimento/ausência/local incerto ou perigoso; dúvida sobre quem deve receber; litígio sobre o objeto.</p><div class="civil-alert">Para valer como pagamento, a consignação precisa reproduzir os requisitos pessoais, objetivos, modais e temporais do pagamento válido.</div></section>

 <section><h4>6. Sub-rogação — arts. 346 a 351</h4><p>Na sub-rogação, quem paga ocupa juridicamente a posição do credor nos limites legais.</p><table class="civil-compare"><tr><th>Legal</th><th>Convencional</th></tr><tr><td>Opera nas hipóteses do art. 346, como pagamento por credor interessado ou por terceiro interessado.</td><td>Decorre de declaração do credor ao receber pagamento de terceiro, ou de empréstimo destinado expressamente à quitação com sub-rogação.</td></tr></table><p>O novo credor recebe direitos, ações, privilégios e garantias do antigo, até o limite do desembolso quando aplicável.</p></section>

 <section><h4>7. Imputação, dação, novação</h4><p><strong>Imputação (352-355):</strong> devedor com várias dívidas líquidas e vencidas ao mesmo credor pode indicar qual paga; se não o faz e aceita quitação imputada, fica vinculado nas condições legais; sem indicação, aplica-se a ordem legal.</p>
 <p><strong>Dação (356-359):</strong> credor pode consentir receber prestação diversa. Se houver preço atribuído, aplicam-se regras de compra e venda; se o credor for evicto da coisa recebida, restaura-se a obrigação primitiva, ressalvados terceiros.</p>
 <p><strong>Novação (360-367):</strong> extingue obrigação anterior e cria nova. Exige ânimo de novar, expresso ou inequívoco. Sem isso, a segunda obrigação apenas confirma a primeira.</p></section>

 <section><h4>8. Compensação, confusão e remissão</h4><p><strong>Compensação (368-380):</strong> dívidas recíprocas se extinguem até onde se equivalem, em regra quando líquidas, vencidas e fungíveis. Há impedimentos legais e possibilidade de renúncia.</p>
 <p><strong>Confusão (381-384):</strong> mesma pessoa reúne qualidades de credor e devedor; pode ser total ou parcial. Cessada a confusão, restaura-se a obrigação com acessórios.</p>
 <p><strong>Remissão (385-388):</strong> perdão da dívida aceito pelo devedor extingue a obrigação sem prejuízo de terceiros. Devolver objeto empenhado significa renúncia à garantia, não extinção da dívida.</p></section>

 <section><h4>9. Inadimplemento — arts. 389 a 393</h4><p>Não cumprida a obrigação, o devedor responde por <strong>perdas e danos + juros + atualização monetária + honorários de advogado</strong>.</p><p>Se não houver índice de atualização convencionado nem lei específica, aplica-se o <strong>IPCA</strong>.</p><ul><li>Obrigação negativa: inadimplemento desde o ato proibido.</li><li>Todos os bens do devedor respondem pelo inadimplemento, nos limites processuais.</li><li>Contrato benéfico: culpa para beneficiado e dolo para não beneficiado; oneroso: culpa de ambas as partes, salvo exceções.</li><li>Caso fortuito/força maior exonera, salvo assunção expressa de responsabilidade.</li></ul></section>

 <section><h4>10. Mora — arts. 394 a 401</h4><table class="civil-compare"><tr><th>Mora ex re</th><th>Mora ex persona</th></tr><tr><td>Obrigação positiva, líquida e com termo: vencimento constitui mora de pleno direito.</td><td>Sem termo: interpelação judicial ou extrajudicial.</td></tr></table>
 <p>O devedor moroso responde pelos prejuízos, juros, atualização e honorários. Se a prestação se tornar inútil por causa da mora, o credor pode recusá-la e exigir perdas e danos.</p><p>Durante a mora, o devedor responde até por fortuito/força maior, salvo se provar isenção de culpa ou que o dano ocorreria mesmo com adimplemento pontual.</p><p><strong>Purgação da mora:</strong> arts. 401 e regras específicas.</p></section>

 <section><h4>11. Perdas e danos — arts. 402 a 405</h4><p>Incluem <strong>dano emergente + lucro cessante razoável</strong>, desde que consequência direta e imediata da inexecução, mesmo em caso de dolo.</p><p>Nas obrigações em dinheiro: atualização monetária, juros, custas e honorários, sem prejuízo da cláusula penal. Se os juros não cobrirem o prejuízo e não houver pena convencional, pode haver indenização suplementar.</p></section>

 <section><h4>12. Juros legais — arts. 406 e 407: regra atual</h4><p>Quando não houver taxa convencionada, ou quando a lei determinar juros sem fixar taxa, aplica-se a <strong>taxa legal</strong>.</p><div class="civil-alert"><b>Lei 14.905/2024:</b> taxa legal = Selic <strong>deduzido</strong> o índice de atualização monetária do art. 389. Metodologia é definida pelo CMN e divulgada pelo Banco Central. Se o resultado for negativo, considera-se zero.</div></section>

 <section><h4>13. Cláusula penal — arts. 408 a 416</h4><ul><li>Incide de pleno direito se, <strong>culposamente</strong>, devedor inadimplir ou entrar em mora.</li><li>Pode assegurar inadimplemento total, cláusula especial ou mora.</li><li>Inadimplemento total: pena vira alternativa em benefício do credor.</li><li>Mora: pena pode ser cumulada com cumprimento da obrigação.</li><li>Pena não pode exceder a obrigação principal.</li><li>Juiz deve reduzir equitativamente se houve cumprimento parcial ou excesso manifesto.</li><li>Para exigir a pena, não é necessário alegar prejuízo.</li><li>Indenização suplementar só se convencionada; a pena funciona como mínimo.</li></ul></section>

 <section><h4>14. Arras — arts. 417 a 420</h4><p>Arras são entregues na conclusão do contrato e, se houver execução, são restituídas ou imputadas na prestação.</p><table class="civil-compare"><tr><th>Confirmatórias</th><th>Penitenciais</th></tr><tr><td>Reforçam a conclusão. Inadimplemento permite efeitos dos arts. 418-419.</td><td>Existem quando foi pactuado direito de arrependimento; função apenas indenizatória, sem indenização suplementar.</td></tr></table>
 <div class="civil-alert"><b>Art. 418 atual:</b> se inadimplir quem deu as arras, a outra parte pode desfazer e retê-las; se inadimplir quem recebeu, quem deu pode desfazer e exigir devolução + equivalente, com atualização monetária, juros e honorários.</div></section>
 </div>`
}
function civil8DeepBody(){
 return `<div class="civil-theory">
 <section class="civil-juris"><h4>STJ 2026 — restrição contratual à cessão de crédito</h4><p>No REsp 2.155.476/SP, a Quarta Turma reconheceu a validade de cláusula contratual que condicionava cessão de crédito à anuência prévia, quando a restrição constava do instrumento e era conhecida pelo cessionário. A mera notificação da cessão não substituiu a anuência exigida.</p></section>

 <section class="civil-juris"><h4>Atualização legislativa — Lei 14.905/2024</h4><p>É um dos pontos mais importantes do módulo. Material anterior a 2024 pode estar desatualizado quanto a <strong>correção monetária, taxa legal de juros e arras</strong>.</p><ul><li>Art. 389: IPCA quando não houver índice convencionado ou legal específico.</li><li>Art. 395: mora inclui juros, atualização e honorários.</li><li>Art. 404: obrigação em dinheiro inclui atualização, juros, custas e honorários.</li><li>Art. 406: taxa legal vinculada à Selic menos índice do art. 389.</li><li>Art. 418: nova redação detalhando efeitos do inadimplemento nas arras.</li></ul></section>

 <section class="civil-juris"><h4>Mora × inadimplemento absoluto</h4><p>Mora pressupõe que a prestação ainda seja útil e possível, embora atrasada ou imperfeita. Se, em razão do atraso, a prestação se torna inútil ao credor, ele pode rejeitá-la e exigir perdas e danos, aproximando a situação do inadimplemento absoluto.</p></section>

 <section class="civil-juris"><h4>Cláusula penal: redução é dever judicial</h4><p>O art. 413 usa comando imperativo: a penalidade <strong>deve</strong> ser reduzida equitativamente se a obrigação foi cumprida em parte ou se o valor for manifestamente excessivo, considerando natureza e finalidade do negócio.</p></section>

 <section><h4>Mapa de pegadinhas</h4><table class="civil-compare"><tr><th>Pegadinha</th><th>Regra correta</th></tr>
 <tr><td>Cessão exige consentimento do devedor.</td><td>Regra: não; para eficácia perante ele, notificação. Convenção pode restringir cessão.</td></tr>
 <tr><td>Assunção depende só da ciência do credor.</td><td>Exige consentimento expresso, salvo regra especial do art. 303.</td></tr>
 <tr><td>Credor deve aceitar coisa mais valiosa.</td><td>Não; art. 313.</td></tr>
 <tr><td>Terceiro não interessado sempre se sub-roga.</td><td>Não; em nome próprio, regra é reembolso, sem sub-rogação automática.</td></tr>
 <tr><td>Dação pode ser imposta pelo devedor.</td><td>Depende do consentimento do credor.</td></tr>
 <tr><td>Novação é presumida.</td><td>Não; animus novandi deve ser expresso ou inequívoco.</td></tr>
 <tr><td>Compensação exige valores idênticos.</td><td>Extingue até onde se equivalerem.</td></tr>
 <tr><td>Devolução do penhor extingue a dívida.</td><td>Prova renúncia à garantia real, não à dívida.</td></tr>
 <tr><td>Sem termo nunca há mora.</td><td>Há após interpelação.</td></tr>
 <tr><td>Devedor em mora nunca responde por fortuito.</td><td>Art. 399 traz responsabilidade ampliada.</td></tr>
 <tr><td>Taxa legal civil continua fixa em 1% ao mês.</td><td>Não. Art. 406 foi alterado em 2024.</td></tr>
 <tr><td>Cláusula penal exige prova de prejuízo.</td><td>Não; art. 416.</td></tr>
 <tr><td>Cláusula penal nunca pode ser reduzida.</td><td>Art. 413 impõe redução nas hipóteses legais.</td></tr>
 <tr><td>Arras com arrependimento admitem indenização suplementar.</td><td>Não; nas penitenciais a função é unicamente indenizatória.</td></tr></table></section>
 </div>`
}
function civil8ErrorStep(){
 const id='errors8',m=civilModuleState('m8'),done=!!m.errorsReviewed,open=localStorage.getItem(civil8StepOpenKey(id))==='1';
 const qs=civil8StageQuestions('errors8'),unresolved=qs.filter(q=>civilAnswer(q.id)?.lastCorrect===false);
 const rows=qs.map((q,i)=>{const a=civilAnswer(q.id);return `<div class="civil-error-row"><div><b>${q.kind==='real'?'FCC':'Autoral'} • ${esc(q.subject)}</b><small>${a?.lastCorrect?'Corrigida na última tentativa':'Ainda errada na última tentativa'} · ${a?.attempts||0} tentativa(s)</small></div><button class="civil-btn" onclick="civil8Ui={stage:'errors8',index:${i}};localStorage.setItem(civil8StepOpenKey('errors8'),'1');renderSubjects()">Revisar</button></div>`}).join('');
 return `<section class="civil-step ${done?'done':''} ${open?'open':''}" data-step="errors8"><button class="civil-step-head" onclick="toggleCivil8Step('errors8')"><span class="civil-step-n">${done?'✓':'7'}</span><span class="civil-step-title"><b>Revisão de erros</b><small>Somente erros deste módulo.</small></span><span class="civil-step-status">${qs.length} no histórico · ${unresolved.length} ainda erradas</span><span>⌄</span></button>
 <div class="civil-step-body">${qs.length?`<div class="civil-error-list">${rows}</div>${civil8Ui.stage==='errors8'?`<div style="margin-top:9px">${civil8StageSession('errors8')}</div>`:''}`:'<div class="muted small">Nenhum erro registrado neste módulo ainda.</div>'}
 <label class="civil-manual-done"><input type="checkbox" ${done?'checked':''} onchange="civilSetModule('m8',{errorsReviewed:this.checked})"> Marcar minha revisão de erros como concluída</label></div></section>`
}
function civil8AnkiStep(){
 const id='anki8',m=civilModuleState('m8'),done=!!m.anki,open=localStorage.getItem(civil8StepOpenKey(id))==='1';
 const deck1='04 DIREITO CIVIL::07 OBRIGAÇÕES - MODALIDADES E TRANSMISSÃO';
 const deck2='04 DIREITO CIVIL::08 ADIMPLEMENTO, MORA E EXTINÇÃO DAS OBRIGAÇÕES';
 return `<section class="civil-step ${done?'done':''} ${open?'open':''}" data-step="anki8"><button class="civil-step-head" onclick="toggleCivil8Step('anki8')"><span class="civil-step-n">${done?'✓':'8'}</span><span class="civil-step-title"><b>Anki seletivo</b><small>Transmissão + Adimplemento/Mora/Extinção.</small></span><span class="civil-step-status">${done?'Concluído':'Pendente'}</span><span>⌄</span></button>
 <div class="civil-step-body"><p class="civil-anki-note">Use <b>Modalidades e Transmissão</b> apenas nos cards de cessão e assunção. Para pagamento, formas especiais de extinção, mora e inadimplemento, use <b>Adimplemento, Mora e Extinção das Obrigações</b>.</p>
 <div class="civil-stage-actions" style="margin-top:9px"><button class="civil-btn primary" onclick="window.openAnkiDeck('${escJs(deck1)}')">🧠 Transmissão</button><button class="civil-btn primary" onclick="window.openAnkiDeck('${escJs(deck2)}')">🧠 Adimplemento e Mora</button></div>
 <label class="civil-manual-done"><input type="checkbox" ${done?'checked':''} onchange="civilSetModule('m8',{anki:this.checked})"> Marcar revisão no Anki como concluída</label></div></section>`
}
function renderCivilModule8(){
 const pct=civilModulePct('m8');
 return `<div class="civil-overall"><span style="width:${pct}%"></span></div><div class="civil-scope-note"><span class="civil-scope-badge mix">EDITAL + COMPLEMENTAR</span><b>Escopo fechado do Módulo 8:</b> transmissão (286-303), adimplemento e extinção (304-388) e inadimplemento (389-420). <b>O art. 421 inicia Contratos em Geral e fica para o Módulo 9.</b></div>
 <div class="civil-steps">
 ${civil8QuestionStep('diagnostic8','Diagnóstico FCC','10 questões reais antes da teoria.',1)}
 ${civil8ManualStep('reading8','Leitura orientada','CC 286 a 420, com atenção às alterações de 2024.',2,civil8ReadingBody(),'reading')}
 ${civil8ManualStep('theory8','Teoria nuclear','Transmissão, pagamento, extinção, mora, penal e arras.',3,civil8TheoryBody(),'theory')}
 ${civil8ManualStep('deep8','Aprofundamento e atualização','STJ 2026 + Lei 14.905/2024.',4,civil8DeepBody(),'deep')}
 ${civil8QuestionStep('cases8','Casos práticos','5 casos autorais para cobrir lacunas do banco real.',5)}
 ${civil8QuestionStep('final8','Bateria final FCC','15 questões reais após a teoria.',6)}
 ${civil8ErrorStep()}
 ${civil8AnkiStep()}
 </div>`
}


let civil9Ui={stage:null,index:0};
function civil9StepOpenKey(id){return `central-v6:civil-step:m9:${id}`}
function civil9StageQuestions(stage){
 if(stage==='diagnostic9')return CIVIL_COURSE.diagnostic9||[];
 if(stage==='final9')return CIVIL_COURSE.final9||[];
 if(stage==='cases9')return CIVIL_COURSE.cases9||[];
 if(stage==='errors9'){
  const all=[...(CIVIL_COURSE.diagnostic9||[]),...(CIVIL_COURSE.cases9||[]),...(CIVIL_COURSE.final9||[])];
  return all.filter(q=>civilAnswer(q.id)?.everWrong);
 }
 return[];
}
function civil9StageDone(stage){
 const qs=civil9StageQuestions(stage);return qs.length>0&&qs.every(q=>(civilAnswer(q.id)?.attempts||0)>0)
}
function civil9Steps(){
 const m=civilModuleState('m9');
 return [
  {id:'diagnostic9',done:civil9StageDone('diagnostic9')},
  {id:'reading9',done:!!m.reading},
  {id:'theory9',done:!!m.theory},
  {id:'deep9',done:!!m.deep},
  {id:'cases9',done:civil9StageDone('cases9')},
  {id:'final9',done:civil9StageDone('final9')},
  {id:'errors9',done:!!m.errorsReviewed},
  {id:'anki9',done:!!m.anki}
 ]
}
function toggleCivil9Step(id){
 const el=document.querySelector(`.civil-module[data-civil="m9"] .civil-step[data-step="${id}"]`);if(!el)return;
 const open=!el.classList.contains('open');el.classList.toggle('open',open);localStorage.setItem(civil9StepOpenKey(id),open?'1':'0')
}
function civil9OpenStage(stage){
 const qs=civil9StageQuestions(stage);if(!qs.length){civil9Ui={stage,index:0};renderSubjects();return}
 let idx=qs.findIndex(q=>(civilAnswer(q.id)?.attempts||0)===0);if(idx<0)idx=0;
 civil9Ui={stage,index:idx};localStorage.setItem(civil9StepOpenKey(stage),'1');renderSubjects();
 setTimeout(()=>document.querySelector(`.civil-module[data-civil="m9"] .civil-step[data-step="${stage}"]`)?.scrollIntoView({behavior:'smooth',block:'center'}),20)
}
function civil9Select(id,letter){
 const st=civilState(),a=st.answers[id]||{attempts:0,history:[],everWrong:false};
 if(a.submitted)return;a.selected=letter;a.submitted=false;st.answers[id]=a;civilSave(st);renderSubjects()
}
function civil9Submit(id,stage){
 const q=[...(CIVIL_COURSE.diagnostic9||[]),...(CIVIL_COURSE.cases9||[]),...(CIVIL_COURSE.final9||[])].find(x=>x.id===id);
 if(!q)return;const st=civilState(),a=st.answers[id]||{attempts:0,history:[],everWrong:false};
 if(!a.selected){alert('Escolha uma alternativa primeiro.');return}
 const correct=a.selected===q.answer;
 a.attempts=(a.attempts||0)+1;a.submitted=true;a.lastCorrect=correct;a.everWrong=!!a.everWrong||!correct;
 a.history=[...(a.history||[]),{at:new Date().toISOString(),selected:a.selected,correct,stage,module:'m9'}];
 st.answers[id]=a;civilSave(st);renderAll()
}
function civil9Retry(id){const st=civilState(),a=st.answers[id];if(!a)return;a.selected=null;a.submitted=false;st.answers[id]=a;civilSave(st);renderSubjects()}
function civil9Move(stage,delta){
 const qs=civil9StageQuestions(stage);if(!qs.length)return;
 civil9Ui.stage=stage;civil9Ui.index=Math.max(0,Math.min(qs.length-1,civil9Ui.index+delta));renderSubjects()
}
function civil9Accuracy(stage){
 const qs=civil9StageQuestions(stage),answered=qs.map(q=>civilAnswer(q.id)).filter(a=>a?.attempts);
 const correct=answered.filter(a=>a.lastCorrect).length;
 return {answered:answered.length,total:qs.length,correct,pct:answered.length?Math.round(correct/answered.length*100):0}
}
function civil9QuestionCard(q,stage,index,total){
 const a=civilAnswer(q.id)||{selected:null,submitted:false,attempts:0,history:[]},locked=!!a.submitted;
 const opts=Object.entries(q.options).map(([letter,text])=>{
  let cls='civil-option';if(a.selected===letter)cls+=' selected';
  if(locked&&letter===q.answer)cls+=' correct';else if(locked&&a.selected===letter&&letter!==q.answer)cls+=' wrong';
  return `<button class="${cls}" ${locked?'disabled':''} onclick="civil9Select('${escJs(q.id)}','${letter}')"><span class="civil-letter">${letter}</span><span>${esc(text)}</span></button>`
 }).join('');
 const feedback=locked?`<div class="civil-feedback ${a.lastCorrect?'good':'bad'}"><b>${a.lastCorrect?'✓ Resposta correta':'✕ Resposta incorreta — gabarito '+q.answer}</b>${esc(q.explanation)}<span class="basis">Fundamento: ${esc(q.basis)}${a.attempts>1?' · '+a.attempts+' tentativas':''}</span></div>`:'';
 return `<article class="civil-qcard">${civilQuestionMeta(q)}<h4>${esc(q.prompt)}</h4><div class="civil-options">${opts}</div>
 <div class="civil-submit-row"><div>${q.kind==='real'?`<a class="civil-source-link" href="${escAttr(q.url)}" target="_blank" rel="noopener">Fonte da questão no TEC ↗</a>`:'<span class="muted small">Caso criado para aplicação da regra.</span>'}</div>
 <div class="civil-qnav"><button class="civil-btn" onclick="civil9Move('${stage}',-1)" ${index===0?'disabled':''}>←</button><span>${index+1} / ${total}</span><button class="civil-btn" onclick="civil9Move('${stage}',1)" ${index===total-1?'disabled':''}>→</button></div>
 ${locked?`<button class="civil-btn" onclick="civil9Retry('${escJs(q.id)}')">Refazer</button>`:`<button class="civil-btn primary" onclick="civil9Submit('${escJs(q.id)}','${stage}')">Responder</button>`}
 </div>${feedback}</article>`
}
function civil9StageSession(stage){
 const qs=civil9StageQuestions(stage);if(!qs.length)return '<div class="muted small">Nenhuma questão disponível.</div>';
 if(civil9Ui.stage!==stage)civil9Ui={stage,index:Math.max(0,qs.findIndex(q=>(civilAnswer(q.id)?.attempts||0)===0))};
 civil9Ui.index=Math.max(0,Math.min(qs.length-1,civil9Ui.index));
 return civil9QuestionCard(qs[civil9Ui.index],stage,civil9Ui.index,qs.length)
}
function civil9QuestionStep(stage,title,subtitle,num){
 const stats=civil9Accuracy(stage),done=civil9StageDone(stage),open=localStorage.getItem(civil9StepOpenKey(stage))==='1',active=civil9Ui.stage===stage;
 return `<section class="civil-step ${done?'done':''} ${open?'open':''}" data-step="${stage}">
 <button class="civil-step-head" onclick="toggleCivil9Step('${stage}')"><span class="civil-step-n">${done?'✓':num}</span><span class="civil-step-title"><b>${esc(title)}</b><small>${esc(subtitle)}</small></span><span class="civil-step-status">${stats.answered}/${stats.total} respondidas${stats.answered?' · '+stats.pct+'%':''}</span><span>⌄</span></button>
 <div class="civil-step-body"><div class="civil-stage-toolbar"><p>${stage==='diagnostic9'?'Diagnóstico misto: princípios, formação, extinção e contratos típicos. Resolva antes da teoria.':stage==='final9'?'Bateria final com questões reais FCC de teoria geral, compra e venda, doação e prestação de serviço.':'Casos autorais para cobrir contratos típicos pouco representados no caderno real.'}</p><div class="civil-stage-actions"><button class="civil-btn primary" onclick="civil9OpenStage('${stage}')">${stats.answered?'Continuar':'Iniciar'}</button></div></div>${active?civil9StageSession(stage):''}</div></section>`
}
function civil9ManualStep(id,title,subtitle,num,body,field){
 const st=civilModuleState('m9'),done=!!st[field],open=localStorage.getItem(civil9StepOpenKey(id))==='1';
 return `<section class="civil-step ${done?'done':''} ${open?'open':''}" data-step="${id}">
 <button class="civil-step-head" onclick="toggleCivil9Step('${id}')"><span class="civil-step-n">${done?'✓':num}</span><span class="civil-step-title"><b>${esc(title)}</b><small>${esc(subtitle)}</small></span><span class="civil-step-status">${done?'Concluído':'Pendente'}</span><span>⌄</span></button>
 <div class="civil-step-body">${body}<label class="civil-manual-done"><input type="checkbox" ${done?'checked':''} onchange="civilSetModule('m9',{${field}:this.checked})"> Marcar esta etapa como concluída</label></div></section>`
}
function civil9ReadingBody(){
 return `<div class="civil-theory"><section><h4>Leitura orientada — Módulo 9</h4><div class="civil-law-grid">
 <div class="civil-law-card"><b>CC, arts. 421 a 440</b><span>Princípios, contratos de adesão, formação, estipulação em favor de terceiro e promessa de fato de terceiro.</span></div>
 <div class="civil-law-card"><b>CC, arts. 458 a 480</b><span>Aleatórios, preliminar, pessoa a declarar e extinção dos contratos.</span></div>
 <div class="civil-law-card"><b>CC, arts. 481 a 756 e 803 a 853-A + Lei 15.040/2024</b><span>Contratos em espécie. Seguro hoje é regido pela lei especial; os antigos arts. 757-802 do CC estão revogados.</span></div>
 </div><div class="civil-alert"><b>Exceção deliberada:</b> não estude agora os arts. <b>441 a 457</b>. Vícios redibitórios e evicção ficam no Módulo 10 junto com Responsabilidade Civil.</div><div class="civil-alert"><b>Atualização obrigatória:</b> a Lei 15.040/2024 revogou os arts. <b>757 a 802</b> do Código Civil. Desde dezembro de 2025, o contrato de seguro deve ser estudado pela nova Lei de Contrato de Seguro, e não pela antiga redação do CC.</div>
 <div class="civil-stage-actions"><button class="civil-btn primary" onclick="saveLast({civilModule:'m9',title:'Direito Civil • Módulo 9 • Leitura no Vade Mecum',at:Date.now()});openVadeMecum(null,'cc')">📖 Abrir Código Civil no Vade Mecum</button></div></section></div>`
}
function civil9TheoryBody(){
 return `<div class="civil-theory">
 <section><h4>1. Princípios contratuais — arts. 421 a 426</h4><ul><li><strong>Função social:</strong> limita a liberdade contratual.</li><li><strong>Intervenção mínima:</strong> relações privadas privilegiam autonomia e estabilidade.</li><li><strong>Revisão excepcional:</strong> art. 421 e art. 421-A.</li><li><strong>Boa-fé objetiva:</strong> probidade, lealdade, cooperação e proteção da confiança.</li><li><strong>Paridade e simetria:</strong> contratos civis e empresariais são presumidos paritários até prova concreta em contrário.</li><li><strong>Alocação de riscos:</strong> deve ser respeitada.</li></ul>
 <p>Em contratos de adesão, ambiguidade/contradição interpreta-se em favor do aderente; é nula renúncia antecipada a direito resultante da natureza do negócio. Contratos atípicos são permitidos. É proibido contratar herança de pessoa viva.</p></section>

 <section><h4>2. Boa-fé objetiva — efeitos práticos</h4><table class="civil-compare"><tr><th>Figura</th><th>Ideia</th></tr>
 <tr><td>Venire contra factum proprium</td><td>Vedação ao comportamento contraditório que frustra confiança legítima.</td></tr>
 <tr><td>Supressio</td><td>Não exercício prolongado pode suprimir posição jurídica incompatível com a confiança criada.</td></tr>
 <tr><td>Surrectio</td><td>Comportamento reiterado pode gerar posição favorável correlata.</td></tr>
 <tr><td>Tu quoque</td><td>Quem viola a norma contratual não deve extrair vantagem da própria conduta contraditória.</td></tr></table></section>

 <section><h4>3. Formação — arts. 427 a 435</h4><ul><li>Proposta obriga o proponente, salvo termos, natureza ou circunstâncias.</li><li>Pessoa presente inclui telefone ou comunicação semelhante.</li><li>Aceitação tardia com adições/restrições/modificações = <strong>nova proposta</strong>.</li><li>Oferta ao público pode equivaler a proposta.</li><li>Contrato entre ausentes: regra da expedição, com exceções do art. 434.</li><li>Contrato considera-se celebrado no lugar em que foi <strong>proposto</strong>.</li></ul></section>

 <section><h4>4. Contratos com terceiro — arts. 436 a 440</h4><p><strong>Estipulação em favor de terceiro:</strong> estipulante e terceiro podem exigir o cumprimento. O estipulante pode substituir o terceiro nos termos do art. 438.</p><p><strong>Promessa de fato de terceiro:</strong> quem promete fato de terceiro responde por perdas e danos se o terceiro não executar, ressalvadas as exceções legais.</p></section>

 <section><h4>5. Contratos aleatórios — arts. 458 a 461</h4><p>Álea é risco incorporado ao próprio conteúdo do contrato. Diferencie:</p><ul><li><strong>Emptio spei:</strong> adquirente assume risco de nada existir; alienante conserva o preço se não houver dolo/culpa.</li><li><strong>Emptio rei speratae:</strong> risco recai sobre quantidade; se nada existir, alienante restitui.</li><li>Coisa existente exposta a risco: aplica-se o regime dos arts. 460-461.</li></ul></section>

 <section><h4>6. Contrato preliminar e pessoa a declarar</h4><p><strong>Preliminar (462-466):</strong> contém requisitos essenciais do definitivo, <strong>exceto a forma</strong>. Sem arrependimento, parte pode exigir a celebração definitiva. Admite promessa unilateral.</p><p><strong>Pessoa a declarar (467-471):</strong> uma parte reserva-se a faculdade de indicar quem assumirá direitos e obrigações, observados prazo, forma e aceitação.</p></section>

 <section><h4>7. Extinção — arts. 472 a 480</h4><table class="civil-compare"><tr><th>Instituto</th><th>Regra essencial</th></tr>
 <tr><td>Distrato</td><td>Mesma forma exigida para o contrato.</td></tr>
 <tr><td>Resilição unilateral</td><td>Opera por denúncia quando a lei ou o contrato o permitirem.</td></tr>
 <tr><td>Cláusula resolutiva expressa</td><td>Opera de pleno direito.</td></tr>
 <tr><td>Cláusula resolutiva tácita</td><td>Depende de interpelação judicial.</td></tr>
 <tr><td>Resolução por inadimplemento</td><td>Parte lesada pode pedir resolução ou cumprimento, com perdas e danos.</td></tr>
 <tr><td>Exceptio non adimpleti</td><td>Nos bilaterais, não se exige a prestação alheia sem cumprir a própria.</td></tr>
 <tr><td>Insegurança superveniente</td><td>Art. 477 permite suspender prestação até contraparte cumprir ou garantir.</td></tr></table></section>

 <section><h4>8. Onerosidade excessiva — arts. 478 a 480</h4><p>Em contratos de execução continuada ou diferida, acontecimento extraordinário e imprevisível que torne uma prestação excessivamente onerosa com extrema vantagem para outra pode justificar resolução. O réu pode evitá-la oferecendo modificação equitativa. Nos contratos unilaterais, admite-se redução ou alteração do modo de executar.</p>
 <div class="civil-alert">Não confunda com revisão automática: o Código e o art. 421-A reforçam excepcionalidade e respeito à alocação de riscos.</div></section>

 <section><h4>9. Compra e venda — arts. 481 a 532</h4><ul><li>Consensual: aperfeiçoa-se com acordo sobre coisa e preço.</li><li>Pode ter coisa atual ou futura.</li><li>Preço pode ser fixado por terceiro, taxa de mercado/bolsa ou índices objetivos.</li><li>É <strong>nulo</strong> deixar preço ao arbítrio exclusivo de uma parte.</li><li>Venda por amostra/modelo: prevalece amostra se houver divergência.</li><li>Venda de ascendente a descendente: <strong>anulável</strong> sem consentimentos legais.</li><li>Cônjuges podem comprar e vender bens excluídos da comunhão.</li><li>Cláusulas especiais: retrovenda, venda a contento/sujeita a prova, preempção, reserva de domínio e venda sobre documentos.</li></ul></section>

 <section><h4>10. Mapa dos contratos em espécie</h4><table class="civil-compare"><tr><th>Contrato</th><th>Artigos / núcleo</th></tr>
 <tr><td>Troca/permuta</td><td>533 — regras da compra e venda com adaptações.</td></tr>
 <tr><td>Estimatório</td><td>534-537 — consignatário recebe móveis para vender ou restituir.</td></tr>
 <tr><td>Doação</td><td>538-564 — liberalidade, forma, aceitação, limites e revogação.</td></tr>
 <tr><td>Locação de coisas</td><td>565-578 — uso e gozo temporário mediante retribuição.</td></tr>
 <tr><td>Comodato</td><td>579-585 — empréstimo gratuito de infungível.</td></tr>
 <tr><td>Mútuo</td><td>586-592 — empréstimo de fungível com transferência do domínio.</td></tr>
 <tr><td>Prestação de serviço</td><td>593-609 — serviço lícito material ou imaterial, retribuição e prazo.</td></tr>
 <tr><td>Empreitada</td><td>610-626 — obra por trabalho ou trabalho + materiais.</td></tr>
 <tr><td>Depósito</td><td>627-652 — guarda e restituição de móvel.</td></tr>
 <tr><td>Mandato</td><td>653-692 — agir em nome do mandante; poderes gerais/especiais.</td></tr>
 <tr><td>Comissão</td><td>693-709 — negócio em nome próprio à conta do comitente.</td></tr>
 <tr><td>Agência/distribuição</td><td>710-721 — promoção de negócios em zona determinada.</td></tr>
 <tr><td>Corretagem</td><td>722-729 — aproximação para obtenção de negócio, sem mandato/subordinação.</td></tr>
 <tr><td>Transporte</td><td>730-756 — pessoas ou coisas.</td></tr>
 <tr><td>Seguro</td><td>Lei 15.040/2024 — os antigos arts. 757-802 do CC estão revogados; estude o regime atual pela lei especial.</td></tr>
 <tr><td>Constituição de renda</td><td>803-813.</td></tr>
 <tr><td>Jogo e aposta</td><td>814-817 — regime de exigibilidade próprio.</td></tr>
 <tr><td>Fiança</td><td>818-839 — garantia pessoal escrita; interpretação restritiva.</td></tr>
 <tr><td>Transação</td><td>840-850 — concessões mútuas para prevenir/terminar litígio.</td></tr>
 <tr><td>Compromisso</td><td>851-853 — litígios patrimoniais e arbitragem.</td></tr>
 <tr><td>Administração fiduciária de garantias</td><td>853-A — agente de garantia, incluído pela Lei 14.711/2023.</td></tr></table></section>

 <section><h4>11. Doação — pontos de prova</h4><ul><li>Regra: instrumento público ou particular.</li><li>Exceção verbal: móveis de pequeno valor + tradição imediata.</li><li>Doação ao nascituro depende de aceitação pelo representante.</li><li>Doação pura ao absolutamente incapaz dispensa aceitação.</li><li>Doação universal sem reserva de subsistência é nula.</li><li>Doação inoficiosa é nula quanto ao excesso.</li><li>Ascendente a descendente ou cônjuge: adiantamento de herança.</li><li>Reversão só em favor do próprio doador.</li><li>Revogação: ingratidão ou inexecução do encargo, nas hipóteses legais.</li></ul></section>

 <section><h4>12. Prestação de serviço — pontos de prova</h4><ul><li>Qualquer serviço/trabalho <strong>lícito, material ou imaterial</strong> pode ser contratado.</li><li>Sem preço, arbitramento considera costume, tempo e qualidade.</li><li>Regra: remuneração após o serviço, salvo convenção/costume.</li><li>Prazo máximo: <strong>4 anos</strong>, ainda que ligado a dívida ou obra.</li><li>Sem prazo inferível: denúncia exige aviso prévio conforme periodicidade da remuneração.</li><li>Despedida sem justa causa: remuneração vencida integral + metade do que faltaria até o termo.</li></ul></section>
 </div>`
}
function civil9DeepBody(){
 return `<div class="civil-theory">
 <section class="civil-juris"><h4>STJ — revisão contratual não é automática</h4><p>O STJ exige fato superveniente capaz de alterar de modo significativo o equilíbrio econômico do contrato. Em relações civis paritárias, os arts. 421 e 421-A reforçam intervenção mínima, respeito à alocação de riscos e revisão excepcional.</p></section>

 <section class="civil-juris"><h4>STJ 2025 — adimplemento substancial tem limites</h4><p>A teoria do adimplemento substancial deriva da boa-fé e pode impedir resolução desproporcional quando a parcela inadimplida é realmente ínfima. Porém, o STJ reafirmou em 2025 que ela <strong>não substitui a quitação integral exigida para adjudicação compulsória</strong>.</p></section>

 <section class="civil-juris"><h4>STJ 2026 — doação exige forma</h4><p>Em edição extraordinária de 2026, o STJ reforçou que doação é contrato solene: deve ser escrita, salvo a exceção legal de bem móvel de pequeno valor seguida de tradição imediata. <em>Animus donandi</em> também é elemento essencial.</p></section>

 <section class="civil-juris"><h4>STJ 2026 — corretagem não se confunde com contrato principal</h4><p>O corretor, em regra, apenas intermedeia. Obtido o resultado previsto, a remuneração pode ser devida mesmo se as partes depois se arrependerem. Em incorporação imobiliária, a corretora não responde automaticamente por obrigações da incorporadora apenas por ter aproximado as partes.</p></section>

 <section><h4>Mapa de pegadinhas</h4><table class="civil-compare"><tr><th>Pegadinha</th><th>Regra correta</th></tr>
 <tr><td>Função social eliminou autonomia contratual.</td><td>Não; autonomia permanece, limitada e combinada com intervenção mínima.</td></tr>
 <tr><td>Boa-fé objetiva significa apenas ausência de intenção de prejudicar.</td><td>Não; é padrão objetivo de conduta.</td></tr>
 <tr><td>Contrato de adesão ambíguo interpreta-se contra o aderente.</td><td>Em favor do aderente.</td></tr>
 <tr><td>Aceitação tardia modificada continua sendo aceitação.</td><td>É nova proposta.</td></tr>
 <tr><td>Contrato é celebrado onde foi aceito.</td><td>Regra do art. 435: onde foi proposto.</td></tr>
 <tr><td>Contrato preliminar exige a mesma forma do definitivo.</td><td>Não; art. 462 exclui a forma.</td></tr>
 <tr><td>Cláusula resolutiva expressa exige ação judicial.</td><td>Opera de pleno direito.</td></tr>
 <tr><td>Exceptio vale para qualquer contrato.</td><td>É característica dos contratos bilaterais.</td></tr>
 <tr><td>Onerosidade excessiva gera resolução automática.</td><td>Não.</td></tr>
 <tr><td>Compra e venda transfere domínio pelo mero consenso.</td><td>Não; consenso aperfeiçoa o contrato, tradição/registro transfere domínio conforme o bem.</td></tr>
 <tr><td>Venda de ascendente a descendente é nula.</td><td>É anulável, salvo consentimentos legais.</td></tr>
 <tr><td>Doação pode ser sempre verbal.</td><td>Só na exceção de móvel de pequeno valor com tradição imediata.</td></tr>
 <tr><td>Comodato e mútuo são equivalentes.</td><td>Comodato: infungível e gratuito; mútuo: fungível e transfere domínio.</td></tr>
 <tr><td>Mandato geral permite alienar imóvel.</td><td>Alienação exige poderes especiais e expressos.</td></tr>
 <tr><td>Fiança pode ser presumida.</td><td>Deve ser escrita e não admite interpretação extensiva.</td></tr></table></section>
 </div>`
}
function civil9ErrorStep(){
 const id='errors9',m=civilModuleState('m9'),done=!!m.errorsReviewed,open=localStorage.getItem(civil9StepOpenKey(id))==='1';
 const qs=civil9StageQuestions('errors9'),unresolved=qs.filter(q=>civilAnswer(q.id)?.lastCorrect===false);
 const rows=qs.map((q,i)=>{const a=civilAnswer(q.id);return `<div class="civil-error-row"><div><b>${q.kind==='real'?'FCC':'Autoral'} • ${esc(q.subject)}</b><small>${a?.lastCorrect?'Corrigida na última tentativa':'Ainda errada na última tentativa'} · ${a?.attempts||0} tentativa(s)</small></div><button class="civil-btn" onclick="civil9Ui={stage:'errors9',index:${i}};localStorage.setItem(civil9StepOpenKey('errors9'),'1');renderSubjects()">Revisar</button></div>`}).join('');
 return `<section class="civil-step ${done?'done':''} ${open?'open':''}" data-step="errors9"><button class="civil-step-head" onclick="toggleCivil9Step('errors9')"><span class="civil-step-n">${done?'✓':'7'}</span><span class="civil-step-title"><b>Revisão de erros</b><small>Somente erros deste módulo.</small></span><span class="civil-step-status">${qs.length} no histórico · ${unresolved.length} ainda erradas</span><span>⌄</span></button>
 <div class="civil-step-body">${qs.length?`<div class="civil-error-list">${rows}</div>${civil9Ui.stage==='errors9'?`<div style="margin-top:9px">${civil9StageSession('errors9')}</div>`:''}`:'<div class="muted small">Nenhum erro registrado neste módulo ainda.</div>'}
 <label class="civil-manual-done"><input type="checkbox" ${done?'checked':''} onchange="civilSetModule('m9',{errorsReviewed:this.checked})"> Marcar minha revisão de erros como concluída</label></div></section>`
}
function civil9AnkiStep(){
 const id='anki9',m=civilModuleState('m9'),done=!!m.anki,open=localStorage.getItem(civil9StepOpenKey(id))==='1';
 const deck1='04 DIREITO CIVIL::09 CONTRATOS - TEORIA GERAL E EXTINÇÃO';
 const deck2='04 DIREITO CIVIL::10 CONTRATOS EM ESPÉCIE E ATOS UNILATERAIS';
 return `<section class="civil-step ${done?'done':''} ${open?'open':''}" data-step="anki9"><button class="civil-step-head" onclick="toggleCivil9Step('anki9')"><span class="civil-step-n">${done?'✓':'8'}</span><span class="civil-step-title"><b>Anki seletivo</b><small>Teoria Geral + Contratos em Espécie.</small></span><span class="civil-step-status">${done?'Concluído':'Pendente'}</span><span>⌄</span></button>
 <div class="civil-step-body"><p class="civil-anki-note">Use <b>Contratos — Teoria Geral e Extinção</b> para arts. 421-480, excluindo os cards específicos de vícios redibitórios/evicção nesta rodada. Depois use <b>Contratos em Espécie e Atos Unilaterais</b> apenas nos cards contratuais; atos unilaterais não integram o escopo deste módulo.</p>
 <div class="civil-stage-actions" style="margin-top:9px"><button class="civil-btn primary" onclick="window.openAnkiDeck('${escJs(deck1)}')">🧠 Teoria Geral</button><button class="civil-btn primary" onclick="window.openAnkiDeck('${escJs(deck2)}')">🧠 Contratos em Espécie</button></div>
 <label class="civil-manual-done"><input type="checkbox" ${done?'checked':''} onchange="civilSetModule('m9',{anki:this.checked})"> Marcar revisão no Anki como concluída</label></div></section>`
}
function renderCivilModule9(){
 const pct=civilModulePct('m9');
 return `<div class="civil-overall"><span style="width:${pct}%"></span></div><div class="civil-scope-note"><span class="civil-scope-badge mix">EDITAL + COMPLEMENTAR</span><b>Escopo fechado do Módulo 9:</b> teoria geral (421-440 e 458-480) + contratos em espécie (481-853-A). <b>Os arts. 441-457 — vícios redibitórios e evicção — foram deliberadamente reservados ao Módulo 10.</b></div>
 <div class="civil-steps">
 ${civil9QuestionStep('diagnostic9','Diagnóstico FCC','10 questões reais antes da teoria.',1)}
 ${civil9ManualStep('reading9','Leitura orientada','Teoria geral + mapa completo dos contratos típicos.',2,civil9ReadingBody(),'reading')}
 ${civil9ManualStep('theory9','Teoria nuclear','Princípios, formação, extinção e contratos em espécie.',3,civil9TheoryBody(),'theory')}
 ${civil9ManualStep('deep9','Aprofundamento e jurisprudência','STJ 2025/2026 e pegadinhas de prova.',4,civil9DeepBody(),'deep')}
 ${civil9QuestionStep('cases9','Casos práticos','5 casos autorais para contratos pouco cobrados no caderno.',5)}
 ${civil9QuestionStep('final9','Bateria final FCC','15 questões reais após a teoria.',6)}
 ${civil9ErrorStep()}
 ${civil9AnkiStep()}
 </div>`
}


let civil10Ui={stage:null,index:0};
function civil10StepOpenKey(id){return `central-v6:civil-step:m10:${id}`}
function civil10StageQuestions(stage){
 if(stage==='diagnostic10')return CIVIL_COURSE.diagnostic10||[];
 if(stage==='final10')return CIVIL_COURSE.final10||[];
 if(stage==='cases10')return CIVIL_COURSE.cases10||[];
 if(stage==='errors10'){
  const all=[...(CIVIL_COURSE.diagnostic10||[]),...(CIVIL_COURSE.cases10||[]),...(CIVIL_COURSE.final10||[])];
  return all.filter(q=>civilAnswer(q.id)?.everWrong);
 }
 return[];
}
function civil10StageDone(stage){
 const qs=civil10StageQuestions(stage);return qs.length>0&&qs.every(q=>(civilAnswer(q.id)?.attempts||0)>0)
}
function civil10Steps(){
 const m=civilModuleState('m10');
 return [
  {id:'diagnostic10',done:civil10StageDone('diagnostic10')},
  {id:'reading10',done:!!m.reading},
  {id:'theory10',done:!!m.theory},
  {id:'deep10',done:!!m.deep},
  {id:'cases10',done:civil10StageDone('cases10')},
  {id:'final10',done:civil10StageDone('final10')},
  {id:'errors10',done:!!m.errorsReviewed},
  {id:'anki10',done:!!m.anki}
 ]
}
function toggleCivil10Step(id){
 const el=document.querySelector(`.civil-module[data-civil="m10"] .civil-step[data-step="${id}"]`);if(!el)return;
 const open=!el.classList.contains('open');el.classList.toggle('open',open);localStorage.setItem(civil10StepOpenKey(id),open?'1':'0')
}
function civil10OpenStage(stage){
 const qs=civil10StageQuestions(stage);if(!qs.length){civil10Ui={stage,index:0};renderSubjects();return}
 let idx=qs.findIndex(q=>(civilAnswer(q.id)?.attempts||0)===0);if(idx<0)idx=0;
 civil10Ui={stage,index:idx};localStorage.setItem(civil10StepOpenKey(stage),'1');renderSubjects();
 setTimeout(()=>document.querySelector(`.civil-module[data-civil="m10"] .civil-step[data-step="${stage}"]`)?.scrollIntoView({behavior:'smooth',block:'center'}),20)
}
function civil10Select(id,letter){
 const st=civilState(),a=st.answers[id]||{attempts:0,history:[],everWrong:false};
 if(a.submitted)return;a.selected=letter;a.submitted=false;st.answers[id]=a;civilSave(st);renderSubjects()
}
function civil10Submit(id,stage){
 const q=[...(CIVIL_COURSE.diagnostic10||[]),...(CIVIL_COURSE.cases10||[]),...(CIVIL_COURSE.final10||[])].find(x=>x.id===id);
 if(!q)return;const st=civilState(),a=st.answers[id]||{attempts:0,history:[],everWrong:false};
 if(!a.selected){alert('Escolha uma alternativa primeiro.');return}
 const correct=a.selected===q.answer;
 a.attempts=(a.attempts||0)+1;a.submitted=true;a.lastCorrect=correct;a.everWrong=!!a.everWrong||!correct;
 a.history=[...(a.history||[]),{at:new Date().toISOString(),selected:a.selected,correct,stage,module:'m10'}];
 st.answers[id]=a;civilSave(st);renderAll()
}
function civil10Retry(id){const st=civilState(),a=st.answers[id];if(!a)return;a.selected=null;a.submitted=false;st.answers[id]=a;civilSave(st);renderSubjects()}
function civil10Move(stage,delta){
 const qs=civil10StageQuestions(stage);if(!qs.length)return;
 civil10Ui.stage=stage;civil10Ui.index=Math.max(0,Math.min(qs.length-1,civil10Ui.index+delta));renderSubjects()
}
function civil10Accuracy(stage){
 const qs=civil10StageQuestions(stage),answered=qs.map(q=>civilAnswer(q.id)).filter(a=>a?.attempts);
 const correct=answered.filter(a=>a.lastCorrect).length;
 return {answered:answered.length,total:qs.length,correct,pct:answered.length?Math.round(correct/answered.length*100):0}
}
function civil10QuestionCard(q,stage,index,total){
 const a=civilAnswer(q.id)||{selected:null,submitted:false,attempts:0,history:[]},locked=!!a.submitted;
 const opts=Object.entries(q.options).map(([letter,text])=>{
  let cls='civil-option';if(a.selected===letter)cls+=' selected';
  if(locked&&letter===q.answer)cls+=' correct';else if(locked&&a.selected===letter&&letter!==q.answer)cls+=' wrong';
  return `<button class="${cls}" ${locked?'disabled':''} onclick="civil10Select('${escJs(q.id)}','${letter}')"><span class="civil-letter">${letter}</span><span>${esc(text)}</span></button>`
 }).join('');
 const feedback=locked?`<div class="civil-feedback ${a.lastCorrect?'good':'bad'}"><b>${a.lastCorrect?'✓ Resposta correta':'✕ Resposta incorreta — gabarito '+q.answer}</b>${esc(q.explanation)}<span class="basis">Fundamento: ${esc(q.basis)}${a.attempts>1?' · '+a.attempts+' tentativas':''}</span></div>`:'';
 return `<article class="civil-qcard">${civilQuestionMeta(q)}<h4>${esc(q.prompt)}</h4><div class="civil-options">${opts}</div>
 <div class="civil-submit-row"><div>${q.kind==='real'?`<a class="civil-source-link" href="${escAttr(q.url)}" target="_blank" rel="noopener">Fonte da questão no TEC ↗</a>`:'<span class="muted small">Caso criado para aplicação da regra.</span>'}</div>
 <div class="civil-qnav"><button class="civil-btn" onclick="civil10Move('${stage}',-1)" ${index===0?'disabled':''}>←</button><span>${index+1} / ${total}</span><button class="civil-btn" onclick="civil10Move('${stage}',1)" ${index===total-1?'disabled':''}>→</button></div>
 ${locked?`<button class="civil-btn" onclick="civil10Retry('${escJs(q.id)}')">Refazer</button>`:`<button class="civil-btn primary" onclick="civil10Submit('${escJs(q.id)}','${stage}')">Responder</button>`}
 </div>${feedback}</article>`
}
function civil10StageSession(stage){
 const qs=civil10StageQuestions(stage);if(!qs.length)return '<div class="muted small">Nenhuma questão disponível.</div>';
 if(civil10Ui.stage!==stage)civil10Ui={stage,index:Math.max(0,qs.findIndex(q=>(civilAnswer(q.id)?.attempts||0)===0))};
 civil10Ui.index=Math.max(0,Math.min(qs.length-1,civil10Ui.index));
 return civil10QuestionCard(qs[civil10Ui.index],stage,civil10Ui.index,qs.length)
}
function civil10QuestionStep(stage,title,subtitle,num){
 const stats=civil10Accuracy(stage),done=civil10StageDone(stage),open=localStorage.getItem(civil10StepOpenKey(stage))==='1',active=civil10Ui.stage===stage;
 return `<section class="civil-step ${done?'done':''} ${open?'open':''}" data-step="${stage}">
 <button class="civil-step-head" onclick="toggleCivil10Step('${stage}')"><span class="civil-step-n">${done?'✓':num}</span><span class="civil-step-title"><b>${esc(title)}</b><small>${esc(subtitle)}</small></span><span class="civil-step-status">${stats.answered}/${stats.total} respondidas${stats.answered?' · '+stats.pct+'%':''}</span><span>⌄</span></button>
 <div class="civil-step-body"><div class="civil-stage-toolbar"><p>${stage==='diagnostic10'?'Mistura garantias contratuais e responsabilidade civil para testar identificação do regime correto. Resolva sem consulta.':stage==='final10'?'Bateria final com questões reais FCC de vícios, evicção, responsabilidade por terceiros, nexo e indenização.':'Casos para consolidar prazo de garantia, evicção parcial, responsabilidade objetiva e perda de uma chance.'}</p><div class="civil-stage-actions"><button class="civil-btn primary" onclick="civil10OpenStage('${stage}')">${stats.answered?'Continuar':'Iniciar'}</button></div></div>${active?civil10StageSession(stage):''}</div></section>`
}
function civil10ManualStep(id,title,subtitle,num,body,field){
 const st=civilModuleState('m10'),done=!!st[field],open=localStorage.getItem(civil10StepOpenKey(id))==='1';
 return `<section class="civil-step ${done?'done':''} ${open?'open':''}" data-step="${id}">
 <button class="civil-step-head" onclick="toggleCivil10Step('${id}')"><span class="civil-step-n">${done?'✓':num}</span><span class="civil-step-title"><b>${esc(title)}</b><small>${esc(subtitle)}</small></span><span class="civil-step-status">${done?'Concluído':'Pendente'}</span><span>⌄</span></button>
 <div class="civil-step-body">${body}<label class="civil-manual-done"><input type="checkbox" ${done?'checked':''} onchange="civilSetModule('m10',{${field}:this.checked})"> Marcar esta etapa como concluída</label></div></section>`
}
function civil10ReadingBody(){
 return `<div class="civil-theory"><section><h4>Leitura orientada — Módulo 10</h4><div class="civil-law-grid">
 <div class="civil-law-card"><b>CC, arts. 441 a 446</b><span>Vícios redibitórios: ações edilícias, conhecimento do alienante e decadência.</span></div>
 <div class="civil-law-card"><b>CC, arts. 447 a 457</b><span>Evicção: garantia, cláusulas, efeitos e evicção parcial.</span></div>
 <div class="civil-law-card"><b>CC, arts. 927 a 943</b><span>Obrigação de indenizar: objetiva/subjetiva, incapaz, terceiros, animal, edifício, solidariedade e herança.</span></div>
 <div class="civil-law-card"><b>CC, arts. 944 a 954</b><span>Indenização: extensão, culpa concorrente, morte, lesão, capacidade laboral e ofensas específicas.</span></div>
 </div><div class="civil-alert"><b>Atualização de prova:</b> o art. <b>456 está revogado</b> pelo CPC/2015. Não memorize a antiga denunciação da lide como regra do Código Civil atual.</div>
 <div class="civil-stage-actions"><button class="civil-btn primary" onclick="saveLast({civilModule:'m10',title:'Direito Civil • Módulo 10 • Leitura no Vade Mecum',at:Date.now()});openVadeMecum(null,'cc')">📖 Abrir Código Civil no Vade Mecum</button></div></section></div>`
}
function civil10TheoryBody(){
 return `<div class="civil-theory">
 <section><h4>1. Vício redibitório: o que é</h4><p>É <strong>defeito oculto preexistente</strong> na coisa recebida em contrato comutativo, capaz de torná-la imprópria ao uso a que se destina ou de diminuir-lhe o valor. As mesmas regras alcançam a <strong>doação onerosa</strong>.</p>
 <div class="civil-alert">Não confunda com erro substancial: no vício redibitório o problema está objetivamente na coisa; no erro, a falsa percepção está na formação da vontade.</div></section>

 <section><h4>2. Ações edilícias</h4><table class="civil-compare"><tr><th>Redibitória</th><th>Quanti minoris / estimatória</th></tr>
 <tr><td>Rejeita a coisa e desfaz o contrato.</td><td>Mantém a coisa e pede abatimento proporcional do preço.</td></tr></table>
 <p>Se o alienante <strong>conhecia</strong> o vício, restitui o que recebeu + perdas e danos. Se não conhecia, restitui o valor recebido + despesas do contrato.</p><p>A responsabilidade subsiste mesmo se a coisa perecer com o adquirente, desde que o perecimento decorra do vício oculto já existente ao tempo da tradição.</p></section>

 <section><h4>3. Decadência nos vícios — art. 445</h4><table class="civil-compare"><tr><th>Coisa móvel</th><th>Imóvel</th></tr>
 <tr><td>30 dias da entrega efetiva.</td><td>1 ano da entrega efetiva.</td></tr>
 <tr><td>Se já estava na posse: prazo conta da alienação e cai pela metade.</td><td>Mesma regra de redução pela metade se já estava na posse.</td></tr></table>
 <p>Se o vício só puder ser conhecido mais tarde, conta-se da ciência, observado o limite máximo de <strong>180 dias para móveis</strong> e <strong>1 ano para imóveis</strong>. Venda de animais segue lei especial ou usos locais.</p></section>

 <section><h4>4. Cláusula de garantia — art. 446</h4><p>Durante a garantia contratual não correm os prazos do art. 445. Mas o comprador deve <strong>denunciar o defeito em 30 dias da descoberta</strong>, sob pena de decadência.</p></section>

 <section><h4>5. Evicção: conceito funcional</h4><p>Evicção é a perda total ou parcial da coisa adquirida em razão de direito juridicamente prevalente de terceiro. Nos contratos onerosos, o alienante garante o adquirente.</p><ul><li>A garantia existe mesmo em <strong>hasta pública</strong>.</li><li>Pode ser reforçada, diminuída ou excluída por cláusula expressa.</li><li>Quem sabia que a coisa era alheia ou litigiosa não pode demandar pela evicção.</li></ul></section>

 <section><h4>6. Cláusula que exclui evicção — arts. 448 e 449</h4><p>A cláusula é válida. Porém, se a evicção ocorrer e o adquirente <strong>não sabia do risco</strong>, ou sabia mas <strong>não o assumiu</strong>, ele conserva o direito de receber o preço pago pela coisa evicta.</p></section>

 <section><h4>7. Efeitos da evicção — arts. 450 a 455</h4><p>Salvo estipulação em contrário, o evicto tem direito, além do preço:</p><ul><li>frutos que foi obrigado a restituir;</li><li>despesas do contrato e prejuízos diretamente resultantes;</li><li>custas judiciais e honorários do advogado constituído;</li><li>benfeitorias necessárias ou úteis não abonadas.</li></ul>
 <p>O valor da coisa é considerado na época em que ocorreu a evicção. Se parcial e <strong>considerável</strong>, o evicto pode optar entre rescisão e restituição proporcional; se não considerável, apenas indenização.</p><div class="civil-alert">Art. 456: revogado. Art. 457 permanece vigente.</div></section>

 <section><h4>8. Responsabilidade civil: estrutura</h4><table class="civil-compare"><tr><th>Subjetiva</th><th>Objetiva</th></tr>
 <tr><td>Conduta + culpa/dolo + dano + nexo causal.</td><td>Conduta/atividade + dano + nexo causal; dispensa culpa.</td></tr></table>
 <p>A regra do art. 927 liga o dever de indenizar aos atos ilícitos dos arts. 186 e 187. O parágrafo único cria cláusula geral de responsabilidade objetiva para hipóteses legais e atividades que, por sua natureza, impliquem risco para direitos alheios.</p></section>

 <section><h4>9. Culpa não é nexo</h4><p>Responsabilidade objetiva <strong>não é responsabilidade automática</strong>. Ela retira da vítima o ônus de demonstrar culpa, mas continua exigindo dano e nexo causal. Fato exclusivo da vítima ou de terceiro, caso fortuito externo ou outra causa suficiente podem romper o nexo conforme o regime aplicável.</p></section>

 <section><h4>10. Incapaz — art. 928</h4><p>O incapaz responde se seus responsáveis não tiverem obrigação de fazê-lo ou não tiverem meios suficientes. A indenização é <strong>equitativa e subsidiária</strong> e não pode privar do necessário o incapaz nem seus dependentes.</p></section>

 <section><h4>11. Responsabilidade por fato de terceiro — arts. 932 a 934</h4><ul><li><strong>Pais:</strong> filhos menores sob autoridade e companhia.</li><li><strong>Tutor/curador:</strong> pupilos/curatelados nas condições legais.</li><li><strong>Empregador/comitente:</strong> empregados, serviçais e prepostos no exercício do trabalho ou em razão dele.</li><li><strong>Hospedagem/educação onerosa:</strong> hipóteses do art. 932, IV.</li><li>Quem gratuitamente participa do produto do crime responde até o valor recebido.</li></ul>
 <p>O art. 933 torna objetiva a responsabilidade das pessoas indicadas no art. 932. Quem paga por outrem tem regresso, salvo a exceção do descendente absoluta ou relativamente incapaz.</p></section>

 <section><h4>12. Responsabilidade civil × criminal — art. 935</h4><p>As instâncias são independentes, mas há limite: se o juízo criminal decidiu definitivamente <strong>a existência do fato</strong> ou <strong>a autoria</strong>, essas questões não podem ser rediscutidas no cível.</p><div class="civil-alert">Absolvição por insuficiência de provas não equivale, automaticamente, a declaração definitiva de inexistência do fato ou negativa de autoria.</div></section>

 <section><h4>13. Casos especiais — arts. 936 a 943</h4><ul><li><strong>Animal:</strong> dono/detentor responde, salvo culpa da vítima ou força maior.</li><li><strong>Ruína de edifício:</strong> dono responde quando decorre de falta de reparos cuja necessidade era manifesta.</li><li><strong>Coisas lançadas/caídas:</strong> morador responde pelo dano proveniente do prédio.</li><li><strong>Cobrança indevida:</strong> arts. 939-941 trazem sanções específicas.</li><li><strong>Coautoria:</strong> responsabilidade solidária.</li><li><strong>Herança:</strong> direito de exigir reparação e obrigação de prestá-la transmitem-se.</li></ul></section>

 <section><h4>14. Indenização — regra central</h4><p><strong>Art. 944:</strong> a indenização mede-se pela extensão do dano. Se houver excessiva desproporção entre gravidade da culpa e dano, o juiz pode reduzir equitativamente.</p><p><strong>Art. 945:</strong> culpa concorrente da vítima reduz a indenização conforme comparação entre as culpas.</p></section>

 <section><h4>15. Danos reparáveis</h4><table class="civil-compare"><tr><th>Categoria</th><th>Núcleo</th></tr>
 <tr><td>Dano emergente</td><td>Perda patrimonial efetiva.</td></tr>
 <tr><td>Lucro cessante</td><td>O que razoavelmente deixou de ganhar.</td></tr>
 <tr><td>Dano moral</td><td>Lesão extrapatrimonial a direito da personalidade/interesse juridicamente protegido.</td></tr>
 <tr><td>Dano estético</td><td>Alteração morfológica/autônoma; pode cumular com dano moral.</td></tr>
 <tr><td>Perda de uma chance</td><td>Chance séria e real perdida — indeniza-se a oportunidade, não o resultado final como certo.</td></tr></table>
 <p>STJ: são cumuláveis dano material e moral (Súmula 37) e dano estético e moral (Súmula 387).</p></section>

 <section><h4>16. Morte, lesão e incapacidade laboral — arts. 948 a 951</h4><ul><li><strong>Morte:</strong> tratamento, funeral/luto e alimentos a quem a vítima os devia, sem excluir outras reparações.</li><li><strong>Lesão à saúde:</strong> tratamento + lucros cessantes até convalescença + outros prejuízos comprovados.</li><li><strong>Redução da capacidade de trabalho:</strong> inclui pensão correspondente à incapacidade/depreciação laboral; prejudicado pode preferir arbitramento de uma só vez.</li><li><strong>Profissional de saúde:</strong> negligência, imprudência ou imperícia que cause morte, agrave mal, cause lesão ou incapacidade atrai as regras dos arts. 948-950.</li></ul></section>

 <section><h4>17. Arts. 952 a 954</h4><p>O Código ainda traz critérios específicos para usurpação/esbulho, injúria/difamação/calúnia e ofensa à liberdade pessoal. Em prova literal, observe que esses artigos cuidam da <strong>quantificação/conteúdo da reparação</strong>, não da criação de um regime geral novo de responsabilidade.</p></section>
 
 <section><h4>EDITAL — atos unilaterais, pagamento indevido e enriquecimento</h4><p>Além da responsabilidade civil, o edital exige o bloco de atos unilaterais. Leia os arts. 854 a 886: promessa de recompensa, gestão de negócios, pagamento indevido e enriquecimento sem causa. O Módulo 11 concentra as questões reais de fechamento.</p></section>
 <section><h4>EDITAL — preferências e privilégios creditórios</h4><p>Feche os arts. 955 a 965: títulos legais de preferência, crédito real, crédito pessoal privilegiado, privilégios especiais e gerais e concurso entre credores.</p></section>
</div>`
}
function civil10DeepBody(){
 return `<div class="civil-theory">
 <section class="civil-juris"><h4>STJ 2026 — atividade de risco não elimina o nexo causal</h4><p>No Informativo 878/2026, ao examinar responsabilidade ligada a transporte aéreo, o STJ reafirmou a incidência do art. 927, parágrafo único, mas destacou que responsabilidade objetiva continua exigindo relação causal adequada entre a atividade e o dano. Causa estranha suficiente pode romper o nexo.</p></section>

 <section class="civil-juris"><h4>STJ 2026 — perda de uma chance</h4><p>No Informativo 891/2026, o STJ destacou que a chance séria de cura ou sobrevivência constitui interesse juridicamente reparável. O nexo exigido liga a conduta à <strong>chance perdida</strong>, não necessariamente ao dano final. Chance remota ou puramente hipotética não basta.</p></section>

 <section class="civil-juris"><h4>Súmulas essenciais do STJ</h4><ul><li><strong>Súmula 37:</strong> dano material e moral do mesmo fato podem ser cumulados.</li><li><strong>Súmula 387:</strong> dano estético e moral podem ser cumulados.</li><li><strong>Súmula 43:</strong> em ato ilícito, a correção monetária do dano material incide desde o efetivo prejuízo.</li></ul></section>

 <section class="civil-juris"><h4>Responsabilidade objetiva: risco criado × risco integral</h4><p>O art. 927, parágrafo único, trabalha com responsabilidade objetiva por risco da atividade, mas isso <strong>não equivale automaticamente a risco integral</strong>. Em regra, excludentes ligadas ao nexo causal continuam relevantes. Risco integral é excepcional e depende de fundamento jurídico específico.</p></section>

 <section><h4>Mapa de pegadinhas</h4><table class="civil-compare"><tr><th>Pegadinha</th><th>Regra correta</th></tr>
 <tr><td>Vício redibitório e erro são o mesmo vício da vontade.</td><td>Não: vício redibitório está na coisa; erro está na vontade.</td></tr>
 <tr><td>Alienante só responde por vício se conhecia o defeito.</td><td>Responsabilidade existe mesmo sem conhecimento; muda a extensão das verbas.</td></tr>
 <tr><td>Vício móvel sempre tem apenas 30 dias desde a entrega.</td><td>Vício cognoscível mais tarde tem disciplina do art. 445, §1º.</td></tr>
 <tr><td>Garantia contratual elimina o dever de denunciar defeito.</td><td>Art. 446 exige denúncia em 30 dias da descoberta.</td></tr>
 <tr><td>Evicção não existe em hasta pública.</td><td>Existe; art. 447.</td></tr>
 <tr><td>Cláusula de exclusão da evicção é nula.</td><td>É admitida, com a proteção residual do art. 449.</td></tr>
 <tr><td>Art. 456 ainda exige denunciação da lide.</td><td>Está revogado pelo CPC/2015.</td></tr>
 <tr><td>Responsabilidade objetiva dispensa dano e nexo.</td><td>Dispensa culpa, não dano/nexo.</td></tr>
 <tr><td>Empregador só responde se houver culpa in eligendo.</td><td>Arts. 932-933: responsabilidade objetiva.</td></tr>
 <tr><td>Responsabilidade civil depende da condenação criminal.</td><td>Não; art. 935 estabelece independência com limites.</td></tr>
 <tr><td>Coautores respondem apenas pelas suas quotas perante a vítima.</td><td>Responsabilidade solidária; art. 942.</td></tr>
 <tr><td>Dever de indenizar morre com o responsável.</td><td>Transmite-se com a herança; art. 943.</td></tr>
 <tr><td>Indenização é sempre igual à extensão do dano, sem exceção.</td><td>Art. 944, parágrafo único, admite redução equitativa.</td></tr>
 <tr><td>Culpa concorrente da vítima não interfere.</td><td>Interfere; art. 945.</td></tr>
 <tr><td>Dano moral e estético não podem cumular.</td><td>Podem; Súmula 387/STJ.</td></tr>
 <tr><td>Perda de uma chance indeniza qualquer esperança frustrada.</td><td>A chance deve ser séria, real e juridicamente demonstrável.</td></tr></table></section>
 </div>`
}
function civil10ErrorStep(){
 const id='errors10',m=civilModuleState('m10'),done=!!m.errorsReviewed,open=localStorage.getItem(civil10StepOpenKey(id))==='1';
 const qs=civil10StageQuestions('errors10'),unresolved=qs.filter(q=>civilAnswer(q.id)?.lastCorrect===false);
 const rows=qs.map((q,i)=>{const a=civilAnswer(q.id);return `<div class="civil-error-row"><div><b>${q.kind==='real'?'FCC':'Autoral'} • ${esc(q.subject)}</b><small>${a?.lastCorrect?'Corrigida na última tentativa':'Ainda errada na última tentativa'} · ${a?.attempts||0} tentativa(s)</small></div><button class="civil-btn" onclick="civil10Ui={stage:'errors10',index:${i}};localStorage.setItem(civil10StepOpenKey('errors10'),'1');renderSubjects()">Revisar</button></div>`}).join('');
 return `<section class="civil-step ${done?'done':''} ${open?'open':''}" data-step="errors10"><button class="civil-step-head" onclick="toggleCivil10Step('errors10')"><span class="civil-step-n">${done?'✓':'7'}</span><span class="civil-step-title"><b>Revisão de erros</b><small>Somente erros deste módulo.</small></span><span class="civil-step-status">${qs.length} no histórico · ${unresolved.length} ainda erradas</span><span>⌄</span></button>
 <div class="civil-step-body">${qs.length?`<div class="civil-error-list">${rows}</div>${civil10Ui.stage==='errors10'?`<div style="margin-top:9px">${civil10StageSession('errors10')}</div>`:''}`:'<div class="muted small">Nenhum erro registrado neste módulo ainda.</div>'}
 <label class="civil-manual-done"><input type="checkbox" ${done?'checked':''} onchange="civilSetModule('m10',{errorsReviewed:this.checked})"> Marcar minha revisão de erros como concluída</label></div></section>`
}
function civil10AnkiStep(){
 const id='anki10',m=civilModuleState('m10'),done=!!m.anki,open=localStorage.getItem(civil10StepOpenKey(id))==='1';
 const deckContracts='04 DIREITO CIVIL::09 CONTRATOS - TEORIA GERAL E EXTINÇÃO';
 const deckRC='04 DIREITO CIVIL::11 RESPONSABILIDADE CIVIL';
 return `<section class="civil-step ${done?'done':''} ${open?'open':''}" data-step="anki10"><button class="civil-step-head" onclick="toggleCivil10Step('anki10')"><span class="civil-step-n">${done?'✓':'8'}</span><span class="civil-step-title"><b>Anki seletivo</b><small>Vícios/Evicção + Responsabilidade Civil.</small></span><span class="civil-step-status">${done?'Concluído':'Pendente'}</span><span>⌄</span></button>
 <div class="civil-step-body"><p class="civil-anki-note">Para <b>vícios redibitórios e evicção</b>, use o baralho de Teoria Geral dos Contratos apenas nesses cards. Depois abra o baralho próprio de <b>Responsabilidade Civil</b> para arts. 927-954.</p>
 <div class="civil-stage-actions" style="margin-top:9px"><button class="civil-btn primary" onclick="window.openAnkiDeck('${escJs(deckContracts)}')">🧠 Vícios e Evicção</button><button class="civil-btn primary" onclick="window.openAnkiDeck('${escJs(deckRC)}')">🧠 Responsabilidade Civil</button></div>
 <label class="civil-manual-done"><input type="checkbox" ${done?'checked':''} onchange="civilSetModule('m10',{anki:this.checked})"> Marcar revisão no Anki como concluída</label></div></section>`
}
function renderCivilModule10(){
 const pct=civilModulePct('m10');
 return `<div class="civil-overall"><span style="width:${pct}%"></span></div><div class="civil-scope-note"><span class="civil-scope-badge edital">EDITAL</span><b>Escopo fechado do Módulo 10:</b> Vícios Redibitórios (441-446), Evicção (447-457) e Responsabilidade Civil (927-954). <b>O art. 456 está revogado.</b> O próximo módulo será Direito de Empresa.</div>
 <div class="civil-steps">
 ${civil10QuestionStep('diagnostic10','Diagnóstico FCC','10 questões reais antes da teoria.',1)}
 ${civil10ManualStep('reading10','Leitura orientada','CC 441-457 e 927-954, com artigo revogado sinalizado.',2,civil10ReadingBody(),'reading')}
 ${civil10ManualStep('theory10','Teoria nuclear','Garantias contratuais + sistema completo de responsabilidade civil.',3,civil10TheoryBody(),'theory')}
 ${civil10ManualStep('deep10','Aprofundamento e jurisprudência','STJ 2026, nexo causal, perda de chance e súmulas.',4,civil10DeepBody(),'deep')}
 ${civil10QuestionStep('cases10','Casos práticos','5 casos autorais identificados.',5)}
 ${civil10QuestionStep('final10','Bateria final FCC','15 questões reais após a teoria.',6)}
 ${civil10ErrorStep()}
 ${civil10AnkiStep()}
 </div>`
}


let civil11Ui={stage:null,index:0};
function civil11StepOpenKey(id){return `central-v6:civil-step:m11:${id}`}
function civil11StageQuestions(stage){
 if(stage==='diagnostic11')return CIVIL_COURSE.diagnostic11||[];
 if(stage==='final11')return CIVIL_COURSE.final11||[];
 if(stage==='cases11')return CIVIL_COURSE.cases11||[];
 if(stage==='errors11'){
  const all=[...(CIVIL_COURSE.diagnostic11||[]),...(CIVIL_COURSE.cases11||[]),...(CIVIL_COURSE.final11||[])];
  return all.filter(q=>civilAnswer(q.id)?.everWrong);
 }
 return[];
}
function civil11StageDone(stage){
 const qs=civil11StageQuestions(stage);return qs.length>0&&qs.every(q=>(civilAnswer(q.id)?.attempts||0)>0)
}
function civil11Steps(){
 const m=civilModuleState('m11');
 return [
  {id:'diagnostic11',done:civil11StageDone('diagnostic11')},
  {id:'reading11',done:!!m.reading},
  {id:'theory11',done:!!m.theory},
  {id:'deep11',done:!!m.deep},
  {id:'cases11',done:civil11StageDone('cases11')},
  {id:'final11',done:civil11StageDone('final11')},
  {id:'errors11',done:!!m.errorsReviewed},
  {id:'anki11',done:!!m.anki}
 ]
}
function toggleCivil11Step(id){
 const el=document.querySelector(`.civil-module[data-civil="m11"] .civil-step[data-step="${id}"]`);if(!el)return;
 const open=!el.classList.contains('open');el.classList.toggle('open',open);localStorage.setItem(civil11StepOpenKey(id),open?'1':'0')
}
function civil11OpenStage(stage){
 const qs=civil11StageQuestions(stage);if(!qs.length){civil11Ui={stage,index:0};renderSubjects();return}
 let idx=qs.findIndex(q=>(civilAnswer(q.id)?.attempts||0)===0);if(idx<0)idx=0;
 civil11Ui={stage,index:idx};localStorage.setItem(civil11StepOpenKey(stage),'1');renderSubjects();
 setTimeout(()=>document.querySelector(`.civil-module[data-civil="m11"] .civil-step[data-step="${stage}"]`)?.scrollIntoView({behavior:'smooth',block:'center'}),20)
}
function civil11Select(id,letter){
 const st=civilState(),a=st.answers[id]||{attempts:0,history:[],everWrong:false};
 if(a.submitted)return;a.selected=letter;a.submitted=false;st.answers[id]=a;civilSave(st);renderSubjects()
}
function civil11Submit(id,stage){
 const q=[...(CIVIL_COURSE.diagnostic11||[]),...(CIVIL_COURSE.cases11||[]),...(CIVIL_COURSE.final11||[])].find(x=>x.id===id);
 if(!q)return;const st=civilState(),a=st.answers[id]||{attempts:0,history:[],everWrong:false};
 if(!a.selected){alert('Escolha uma alternativa primeiro.');return}
 const correct=a.selected===q.answer;
 a.attempts=(a.attempts||0)+1;a.submitted=true;a.lastCorrect=correct;a.everWrong=!!a.everWrong||!correct;
 a.history=[...(a.history||[]),{at:new Date().toISOString(),selected:a.selected,correct,stage,module:'m11'}];
 st.answers[id]=a;civilSave(st);renderAll()
}
function civil11Retry(id){const st=civilState(),a=st.answers[id];if(!a)return;a.selected=null;a.submitted=false;st.answers[id]=a;civilSave(st);renderSubjects()}
function civil11Move(stage,delta){
 const qs=civil11StageQuestions(stage);if(!qs.length)return;
 civil11Ui.stage=stage;civil11Ui.index=Math.max(0,Math.min(qs.length-1,civil11Ui.index+delta));renderSubjects()
}
function civil11Accuracy(stage){
 const qs=civil11StageQuestions(stage),answered=qs.map(q=>civilAnswer(q.id)).filter(a=>a?.attempts);
 const correct=answered.filter(a=>a.lastCorrect).length;
 return {answered:answered.length,total:qs.length,correct,pct:answered.length?Math.round(correct/answered.length*100):0}
}
function civil11QuestionMeta(q){
 const role=/Oficial|Execução de Mandados/i.test(q.source)?'Oficial / carreira jurídica':/Analista|Procurador|Defensor|Juiz|Auditor/i.test(q.source)?'Nível superior / carreira jurídica':'Carreira jurídica';
 return `<div class="civil-qmeta"><span class="civil-chip real">${esc(q.bankLabel||'QUESTÃO REAL')}</span><span class="civil-chip role">${esc(role)}</span><span class="civil-chip">${esc(q.basis)}</span><span class="civil-qsource">${esc(q.source)}</span></div>`
}
function civil11QuestionCard(q,stage,index,total){
 const a=civilAnswer(q.id)||{selected:null,submitted:false,attempts:0,history:[]},locked=!!a.submitted;
 const opts=Object.entries(q.options).map(([letter,text])=>{
  let cls='civil-option';if(a.selected===letter)cls+=' selected';
  if(locked&&letter===q.answer)cls+=' correct';else if(locked&&a.selected===letter&&letter!==q.answer)cls+=' wrong';
  return `<button class="${cls}" ${locked?'disabled':''} onclick="civil11Select('${escJs(q.id)}','${letter}')"><span class="civil-letter">${letter}</span><span>${esc(text)}</span></button>`
 }).join('');
 const meta=q.kind==='real'?civil11QuestionMeta(q):`<div class="civil-qmeta"><span class="civil-chip authorial">AUTORAL</span><span class="civil-chip role">Nível Analista/Oficial</span><span class="civil-chip">${esc(q.basis)}</span><span class="civil-qsource">${esc(q.source)}</span></div>`;
 const feedback=locked?`<div class="civil-feedback ${a.lastCorrect?'good':'bad'}"><b>${a.lastCorrect?'✓ Resposta correta':'✕ Resposta incorreta — gabarito '+q.answer}</b>${esc(q.explanation)}<span class="basis">Fundamento: ${esc(q.basis)}${a.attempts>1?' · '+a.attempts+' tentativas':''}</span></div>`:'';
 return `<article class="civil-qcard">${meta}<h4>${esc(q.prompt)}</h4><div class="civil-options">${opts}</div>
 <div class="civil-submit-row"><div>${q.kind==='real'?'<span class="muted small">Questão recuperada dos PDFs que você enviou; mantido o formato C/E do material.</span>':'<span class="muted small">Caso criado para aplicação da regra.</span>'}</div>
 <div class="civil-qnav"><button class="civil-btn" onclick="civil11Move('${stage}',-1)" ${index===0?'disabled':''}>←</button><span>${index+1} / ${total}</span><button class="civil-btn" onclick="civil11Move('${stage}',1)" ${index===total-1?'disabled':''}>→</button></div>
 ${locked?`<button class="civil-btn" onclick="civil11Retry('${escJs(q.id)}')">Refazer</button>`:`<button class="civil-btn primary" onclick="civil11Submit('${escJs(q.id)}','${stage}')">Responder</button>`}
 </div>${feedback}</article>`
}
function civil11StageSession(stage){
 const qs=civil11StageQuestions(stage);if(!qs.length)return '<div class="muted small">Nenhuma questão disponível.</div>';
 if(civil11Ui.stage!==stage)civil11Ui={stage,index:Math.max(0,qs.findIndex(q=>(civilAnswer(q.id)?.attempts||0)===0))};
 civil11Ui.index=Math.max(0,Math.min(qs.length-1,civil11Ui.index));
 return civil11QuestionCard(qs[civil11Ui.index],stage,civil11Ui.index,qs.length)
}
function civil11QuestionStep(stage,title,subtitle,num){
 const stats=civil11Accuracy(stage),done=civil11StageDone(stage),open=localStorage.getItem(civil11StepOpenKey(stage))==='1',active=civil11Ui.stage===stage;
 return `<section class="civil-step ${done?'done':''} ${open?'open':''}" data-step="${stage}">
 <button class="civil-step-head" onclick="toggleCivil11Step('${stage}')"><span class="civil-step-n">${done?'✓':num}</span><span class="civil-step-title"><b>${esc(title)}</b><small>${esc(subtitle)}</small></span><span class="civil-step-status">${stats.answered}/${stats.total} respondidas${stats.answered?' · '+stats.pct+'%':''}</span><span>⌄</span></button>
 <div class="civil-step-body"><div class="civil-stage-toolbar"><p>${stage==='diagnostic11'?'Questões reais recuperadas do seu material, com forte presença FCC e carreiras jurídicas. Resolva antes da teoria.':stage==='final11'?'Bateria final mistura FCC e outras bancas reais apenas onde seu arquivo FCC não tinha cobertura suficiente de estabelecimento/nome empresarial.':'Casos autorais para aplicar elemento de empresa, produtor rural, trespasse e nome empresarial.'}</p><div class="civil-stage-actions"><button class="civil-btn primary" onclick="civil11OpenStage('${stage}')">${stats.answered?'Continuar':'Iniciar'}</button></div></div>${active?civil11StageSession(stage):''}</div></section>`
}
function civil11ManualStep(id,title,subtitle,num,body,field){
 const st=civilModuleState('m11'),done=!!st[field],open=localStorage.getItem(civil11StepOpenKey(id))==='1';
 return `<section class="civil-step ${done?'done':''} ${open?'open':''}" data-step="${id}">
 <button class="civil-step-head" onclick="toggleCivil11Step('${id}')"><span class="civil-step-n">${done?'✓':num}</span><span class="civil-step-title"><b>${esc(title)}</b><small>${esc(subtitle)}</small></span><span class="civil-step-status">${done?'Concluído':'Pendente'}</span><span>⌄</span></button>
 <div class="civil-step-body">${body}<label class="civil-manual-done"><input type="checkbox" ${done?'checked':''} onchange="civilSetModule('m11',{${field}:this.checked})"> Marcar esta etapa como concluída</label></div></section>`
}
function civil11ComplementReadingBody(){
 return `<div class="civil-theory"><section><h4>Leitura orientada — Módulo 11</h4><div class="civil-law-grid">
 <div class="civil-law-card"><b>CC, arts. 966 a 971</b><span>Conceito de empresário, profissão intelectual, registro, pequeno empresário e empresário rural.</span></div>
 <div class="civil-law-card"><b>CC, arts. 972 a 980</b><span>Capacidade, impedimentos, incapaz, sociedade entre cônjuges e empresário casado.</span></div>
 <div class="civil-law-card"><b>CC, arts. 1.142 a 1.149</b><span>Estabelecimento, trespasse, credores, dívidas, não concorrência, contratos e créditos.</span></div>
 <div class="civil-law-card"><b>CC, arts. 1.150 a 1.168</b><span>Registro empresarial e nome empresarial.</span></div>
 </div><div class="civil-alert"><b>Não estude o antigo art. 980-A como vigente:</b> a EIRELI foi revogada. Também observe que, desde 2022, o local da atividade empresarial pode ser físico ou virtual.</div>
 <div class="civil-stage-actions"><button class="civil-btn primary" onclick="saveLast({civilModule:'m11',title:'Direito Civil • Módulo 11 • Leitura no Vade Mecum',at:Date.now()});openVadeMecum(null,'cc')">📖 Abrir Código Civil no Vade Mecum</button></div></section></div>`
}
function civil11ComplementTheoryBody(){
 return `<div class="civil-theory">
 <section><h4>1. Empresa, empresário e estabelecimento — não confundir</h4><table class="civil-compare"><tr><th>Empresa</th><th>Empresário</th><th>Estabelecimento</th></tr>
 <tr><td>Atividade econômica organizada.</td><td>Sujeito que exerce profissionalmente a empresa.</td><td>Complexo organizado de bens empregado no exercício da empresa.</td></tr></table>
 <div class="civil-alert">Essa distinção doutrinária organiza praticamente todo o módulo: atividade ≠ sujeito ≠ complexo de bens.</div></section>

 <section><h4>2. Conceito de empresário — art. 966</h4><p>Empresário é quem exerce <strong>profissionalmente atividade econômica organizada para produção ou circulação de bens ou serviços</strong>.</p><ul><li><strong>Profissionalidade:</strong> exercício habitual/profissional, não ato isolado.</li><li><strong>Economicidade:</strong> atividade de produção/circulação de riqueza.</li><li><strong>Organização:</strong> coordenação dos fatores da atividade.</li><li><strong>Produção ou circulação:</strong> bens ou serviços.</li></ul></section>

 <section><h4>3. Profissional intelectual e elemento de empresa</h4><p>Profissão científica, literária ou artística não caracteriza empresário, mesmo com auxiliares ou colaboradores, <strong>salvo se a profissão constituir elemento de empresa</strong>.</p><p>O ponto de prova não é apenas a quantidade de empregados: é saber se a atuação intelectual pessoal foi absorvida por uma organização empresarial mais ampla.</p></section>

 <section><h4>4. Registro — arts. 967 a 969</h4><p>Para o empresário comum, a inscrição no Registro Público de Empresas Mercantis da sede é <strong>obrigatória antes do início da atividade</strong>.</p><p>O requerimento do art. 968 contém nome, nacionalidade, domicílio, estado civil/regime de bens, firma, capital, objeto e sede. Alterações são averbadas.</p><p>Sucursal, filial ou agência em jurisdição de outro registro exige inscrição também nesse registro e averbação na sede.</p></section>

 <section><h4>5. Empresário rural — arts. 970 e 971</h4><p>A lei assegura tratamento favorecido, diferenciado e simplificado ao empresário rural e ao pequeno empresário. Quem tem atividade rural como principal profissão <strong>pode</strong> requerer inscrição e, depois dela, fica equiparado ao empresário sujeito a registro.</p><p>O parágrafo único do art. 971 também disciplina associação que exerça atividade futebolística habitual e profissional.</p></section>

 <section><h4>6. Capacidade e impedimento — arts. 972 a 975</h4><ul><li>Exige pleno gozo da capacidade civil e ausência de impedimento legal.</li><li>Impedido que exerce atividade empresarial responde pelas obrigações contraídas.</li><li>Incapaz pode <strong>continuar</strong> empresa anteriormente exercida por ele enquanto capaz, por seus pais ou pelo autor da herança, mediante representação/assistência e autorização judicial.</li><li>Bens estranhos ao acervo empresarial que o incapaz já possuía não se sujeitam ao resultado da empresa, nos termos do alvará.</li></ul></section>

 <section><h4>7. Sócio incapaz — art. 974, §3º</h4><p>O Registro deve admitir contrato/alteração com sócio incapaz se, cumulativamente:</p><ol><li>o incapaz não exercer administração;</li><li>o capital social estiver totalmente integralizado;</li><li>o relativamente incapaz estiver assistido e o absolutamente incapaz representado.</li></ol></section>

 <section><h4>8. Empresário casado — arts. 977 a 980</h4><ul><li>Cônjuges podem contratar sociedade entre si ou com terceiros, salvo comunhão universal e separação obrigatória.</li><li>Empresário casado pode alienar ou gravar imóvel integrante do patrimônio da empresa <strong>sem outorga conjugal</strong>, qualquer que seja o regime.</li><li>Pactos/declarações antenupciais e bens clausulados relevantes devem ser arquivados/averbados também no registro empresarial.</li><li>Separação judicial e reconciliação só são oponíveis a terceiros depois de arquivadas e averbadas.</li></ul>
 <div class="civil-alert">O art. 980-A, que tratava da EIRELI, está revogado.</div></section>

 <section><h4>9. Estabelecimento — arts. 1.142 e 1.143</h4><p>Estabelecimento é o <strong>complexo de bens organizado</strong> para o exercício da empresa. Pode reunir bens corpóreos e incorpóreos.</p><p>Desde a Lei 14.382/2022, o Código deixa expresso que estabelecimento <strong>não se confunde com o local</strong> da atividade e que esse local pode ser físico ou virtual.</p><p>O estabelecimento pode ser objeto unitário de direitos e negócios translativos ou constitutivos compatíveis com sua natureza.</p></section>

 <section><h4>10. Trespasse — publicidade e proteção dos credores</h4><p><strong>Art. 1.144:</strong> alienação, usufruto ou arrendamento só produzem efeitos perante terceiros após averbação no Registro Público de Empresas Mercantis e publicação na imprensa oficial.</p><p><strong>Art. 1.145:</strong> se não restarem bens suficientes ao alienante, a eficácia da alienação depende do pagamento dos credores ou do consentimento expresso/tácito em 30 dias da notificação.</p></section>

 <section><h4>11. Dívidas e não concorrência — arts. 1.146 e 1.147</h4><ul><li>Adquirente responde pelos débitos anteriores <strong>regularmente contabilizados</strong>.</li><li>Alienante permanece solidariamente obrigado por 1 ano: vencidos, da publicação; vincendos, do vencimento.</li><li>Sem autorização expressa, alienante não pode concorrer com adquirente por <strong>5 anos</strong>.</li><li>Em arrendamento/usufruto, a vedação dura o prazo do contrato.</li></ul></section>

 <section><h4>12. Contratos e créditos no trespasse — arts. 1.148 e 1.149</h4><p>Salvo disposição contrária, contratos de exploração sem caráter pessoal sub-rogam-se ao adquirente. Terceiros podem rescindir em 90 dias da publicação se houver justa causa.</p><p>A cessão dos créditos relativos ao estabelecimento produz efeitos perante devedores <strong>desde a publicação</strong>; pagamento de boa-fé ao cedente exonera o devedor.</p></section>

 <section><h4>13. Registro empresarial — arts. 1.150 a 1.154</h4><ul><li>Empresário e sociedade empresária vinculam-se às Juntas Comerciais.</li><li>Atos devem ser apresentados, em regra, em 30 dias da lavratura para preservar efeitos desde a data do ato.</li><li>Registro tardio produz efeitos a partir de sua concessão.</li><li>Ato sujeito a registro não pode ser oposto a terceiro antes das formalidades, salvo prova de conhecimento.</li></ul></section>

 <section><h4>14. Nome empresarial — conceito</h4><p>Nome empresarial é a <strong>firma ou denominação</strong> adotada para exercício da empresa.</p><table class="civil-compare"><tr><th>Firma</th><th>Denominação</th></tr>
 <tr><td>Baseada no nome civil do empresário/sócios conforme o tipo.</td><td>Sinal nominativo formado conforme as regras do tipo societário.</td></tr></table>
 <p>Empresário individual opera sob firma formada por seu nome, completo ou abreviado, podendo acrescentar designação da pessoa ou atividade.</p></section>

 <section><h4>15. Nome nos tipos mais cobrados</h4><ul><li><strong>Limitada:</strong> pode adotar firma ou denominação + “limitada”/“Ltda.”.</li><li><strong>Cooperativa:</strong> denominação com “cooperativa”.</li><li><strong>Sociedade anônima:</strong> denominação + “sociedade anônima” ou “companhia”; a designação do objeto é facultativa na redação atual.</li><li><strong>Sociedade em conta de participação:</strong> não pode ter firma nem denominação.</li></ul></section>

 <section><h4>16. Proteção do nome — arts. 1.163 a 1.168</h4><ul><li>Nome deve distinguir-se de outro já inscrito no mesmo registro.</li><li>Nome empresarial <strong>não pode ser alienado</strong>.</li><li>Adquirente inter vivos pode, se autorizado no contrato, usar nome do alienante precedido do próprio + “sucessor”.</li><li>Nome de sócio falecido, excluído ou retirado não permanece na firma social.</li><li>Registro assegura exclusividade nos limites do Estado; extensão nacional depende da forma prevista em lei especial.</li><li>Ação contra inscrição ilegal pode ser proposta a qualquer tempo.</li><li>Cancelamento: cessação da atividade ou término da liquidação, a requerimento de interessado.</li></ul></section>
 </div>`
}
function civil11ComplementDeepBody(){
 return `<div class="civil-theory">
 <section class="civil-juris"><h4>Atualização 2022 — estabelecimento físico ou virtual</h4><p>A Lei 14.382/2022 incluiu os §§1º a 3º do art. 1.142. Para prova atual, é errado definir estabelecimento simplesmente como “o local onde funciona a empresa”. O local pode ser físico ou virtual; o estabelecimento é o complexo de bens organizado.</p></section>

 <section class="civil-juris"><h4>Atualização — EIRELI revogada</h4><p>O art. 980-A está revogado. Materiais antigos que ainda apresentam a Empresa Individual de Responsabilidade Limitada como instituto vigente do Código Civil estão desatualizados.</p></section>

 <section class="civil-juris"><h4>STJ — empresário rural e registro</h4><p>No Tema 1.145 e em precedentes da Segunda Seção, o STJ admite que o produtor rural registrado no momento do pedido de recuperação judicial compute período anterior de exercício empresarial rural para preencher o requisito temporal, desde que observadas as condições legais.</p><div class="civil-alert">Para a prova do Código: memorize primeiro o art. 971 — registro facultativo e equiparação depois de inscrito. A jurisprudência recuperacional é aprofundamento, não substitui a literalidade.</div></section>

 <section class="civil-juris"><h4>Nome empresarial × marca</h4><p>Nome empresarial identifica o empresário/sociedade no exercício da empresa e nasce do registro empresarial. Marca identifica produto ou serviço e se submete ao regime da propriedade industrial/INPI. O STJ considera, em conflitos, territorialidade e especialidade, além do risco de confusão.</p></section>

 <section class="civil-juris"><h4>Lei 8.934/1994 — nome empresarial pelo CNPJ</h4><p>Desde a Lei 14.195/2021, o art. 35-A da Lei de Registro Empresarial permite ao empresário ou à pessoa jurídica optar por utilizar o número do CNPJ como nome empresarial, seguido da partícula identificadora do tipo societário ou jurídico quando exigida.</p></section>

 <section><h4>Mapa de pegadinhas</h4><table class="civil-compare"><tr><th>Pegadinha</th><th>Regra correta</th></tr>
 <tr><td>Empresa é a pessoa jurídica.</td><td>Empresa é atividade; empresário é sujeito.</td></tr>
 <tr><td>Todo profissional intelectual é empresário.</td><td>Regra não; exceção: elemento de empresa.</td></tr>
 <tr><td>Ter empregados transforma automaticamente profissional intelectual em empresário.</td><td>Não.</td></tr>
 <tr><td>Registro do empresário comum é facultativo.</td><td>É obrigatório antes do início da atividade.</td></tr>
 <tr><td>Registro do empresário rural é obrigatório.</td><td>É facultativo no art. 971.</td></tr>
 <tr><td>Incapaz nunca pode participar de sociedade.</td><td>Pode, observados cumulativamente os requisitos do art. 974, §3º.</td></tr>
 <tr><td>Empresário casado sempre precisa de outorga para imóvel da empresa.</td><td>Art. 978 dispensa.</td></tr>
 <tr><td>EIRELI continua vigente no art. 980-A.</td><td>Artigo revogado.</td></tr>
 <tr><td>Estabelecimento é o endereço da empresa.</td><td>É o complexo de bens; o local pode ser físico ou virtual.</td></tr>
 <tr><td>Trespasse produz efeitos perante terceiros só com assinatura.</td><td>Exige averbação + publicação, art. 1.144.</td></tr>
 <tr><td>Adquirente responde por todo débito oculto do alienante.</td><td>Art. 1.146 fala em débitos regularmente contabilizados.</td></tr>
 <tr><td>Não concorrência no trespasse dura 10 anos.</td><td>5 anos, salvo autorização expressa.</td></tr>
 <tr><td>Nome empresarial pode ser vendido junto com o estabelecimento.</td><td>Não pode ser alienado; há apenas uso sucessório inter vivos na hipótese do parágrafo único.</td></tr>
 <tr><td>Nome empresarial e marca são sinônimos.</td><td>Institutos e registros diferentes.</td></tr></table></section>
 </div>`
}

function civil11ReadingBody(){
 return `<div class="civil-theory">
 <section><h4>Leitura orientada — Fechamento I</h4><div class="civil-law-grid">
  <div class="civil-law-card"><b>LINDB, arts. 1º a 6º</b><span>Vigência, revogação, obrigatoriedade, integração, fins sociais e direito intertemporal.</span></div>
  <div class="civil-law-card"><b>Fatos jurídicos</b><span>Classificação geral: fato natural, fato humano, ato-fato, ato jurídico, negócio jurídico e ilícito.</span></div>
  <div class="civil-law-card"><b>CC, arts. 854 a 886</b><span>Atos unilaterais: promessa de recompensa, gestão de negócios, pagamento indevido e enriquecimento sem causa.</span></div>
  <div class="civil-law-card"><b>CC, arts. 955 a 965</b><span>Preferências e privilégios creditórios.</span></div>
  <div class="civil-law-card"><b>CC, arts. 2.028 a 2.046</b><span>Disposições finais e transitórias.</span></div>
 </div>
 <div class="civil-alert"><b>Prioridade EDITAL:</b> estes pontos eram as principais lacunas da versão anterior. Faça esta leitura antes do conteúdo complementar de Direito de Empresa.</div>
 <div class="civil-stage-actions"><button class="civil-btn primary" onclick="saveLast({civilModule:'m11',title:'Direito Civil • Fechamento I • LINDB e lacunas do edital',at:Date.now()});openVadeMecum(null,'cc')">📖 Abrir Vade Mecum</button></div></section>
 </div>`
}
function civil11TheoryBody(){
 return `<div class="civil-theory">
 <section><h4>1. LINDB — vigência</h4><p>Salvo disposição contrária, a lei começa a vigorar no País <strong>45 dias</strong> depois da publicação oficial. No exterior, quando admitida a obrigatoriedade da lei brasileira, a regra geral é de <strong>3 meses</strong>. Nova publicação corretiva antes da vigência reinicia o prazo; correção de texto já vigente é lei nova.</p></section>
 <section><h4>2. Continuidade, revogação e repristinação</h4><p>Lei sem vigência temporária permanece em vigor até modificação ou revogação. A lei posterior revoga a anterior se o declarar expressamente, se for incompatível ou se disciplinar inteiramente a matéria. <strong>Não há repristinação automática.</strong></p></section>
 <section><h4>3. Obrigatoriedade, integração e interpretação</h4><ul><li>Ninguém se escusa de cumprir a lei alegando desconhecimento.</li><li>Omissão: analogia, costumes e princípios gerais de direito.</li><li>Aplicação: atender aos fins sociais da norma e às exigências do bem comum.</li></ul></section>
 <section><h4>4. Eficácia no tempo</h4><p>A lei em vigor tem efeito imediato e geral, respeitando <strong>ato jurídico perfeito, direito adquirido e coisa julgada</strong>. Esse é o núcleo do item de conflito de leis no tempo.</p></section>
 <section><h4>5. Formas de expressão do Direito</h4><p>Para a prova, diferencie <strong>lei</strong> como fonte formal primária, <strong>costume</strong>, <strong>princípios gerais</strong>, jurisprudência e doutrina. Na LINDB, analogia, costumes e princípios gerais aparecem expressamente como técnicas de integração quando houver lacuna.</p></section>
 <section><h4>6. Fatos jurídicos — mapa geral</h4><table class="civil-compare"><tr><th>Categoria</th><th>Ideia</th></tr>
 <tr><td>Fato jurídico natural</td><td>Evento da natureza com efeito jurídico: morte, nascimento, decurso do tempo.</td></tr>
 <tr><td>Ato-fato jurídico</td><td>Conduta humana cujos efeitos jurídicos independem da intenção específica de produzi-los.</td></tr>
 <tr><td>Ato jurídico em sentido estrito</td><td>Vontade atua, mas efeitos são predominantemente definidos pela lei.</td></tr>
 <tr><td>Negócio jurídico</td><td>Autonomia privada conforma efeitos dentro dos limites legais.</td></tr>
 <tr><td>Ato ilícito</td><td>Conduta contrária ao direito com consequências jurídicas próprias.</td></tr></table></section>
 <section><h4>7. Atos unilaterais — arts. 854 a 886</h4><p>O edital cobra o gênero. Priorize: <strong>promessa de recompensa</strong>, <strong>gestão de negócios</strong>, <strong>pagamento indevido</strong> e <strong>enriquecimento sem causa</strong>.</p>
 <ul><li>Promessa pública de recompensa vincula quem a fez nos termos legais.</li><li>Gestor de negócio alheio atua sem autorização e assume deveres de diligência/prestação de contas.</li><li>Quem recebe o que não era devido deve restituir nas hipóteses legais.</li><li>Enriquecimento sem causa é fonte autônoma de restituição e tem caráter subsidiário quando houver outro meio específico.</li></ul></section>
 <section><h4>8. Preferências e privilégios creditórios</h4><p>Os arts. 955 a 965 disciplinam a posição dos credores em concurso. <strong>Direitos reais e privilégios</strong> são títulos legais de preferência. Diferencie crédito real, pessoal privilegiado e quirografário; nos privilégios, distinga <strong>especial</strong> e <strong>geral</strong>.</p></section>
 <section><h4>9. Disposições finais e transitórias</h4><ul><li><strong>Art. 2.028:</strong> regra de transição dos prazos reduzidos pelo Código de 2002.</li><li><strong>Arts. 2.031 a 2.034:</strong> adaptação e disciplina transitória de pessoas jurídicas.</li><li><strong>Art. 2.035:</strong> validade do ato segue a lei do tempo da constituição; efeitos posteriores se subordinam em regra ao Código novo.</li><li><strong>Art. 2.038:</strong> proibição de novas enfiteuses e disciplina transitória das existentes.</li><li><strong>Art. 2.039:</strong> regime de bens de casamento celebrado sob o Código anterior permanece regido por ele.</li><li><strong>Art. 2.041:</strong> ordem de vocação hereditária atual não alcança sucessão aberta antes da vigência do Código de 2002.</li></ul></section>
 </div>`
}
function civil11DeepBody(){
 return `<div class="civil-theory">
 <section><h4>Pegadinhas de fechamento</h4><table class="civil-compare">
 <tr><th>Erro comum</th><th>Regra</th></tr>
 <tr><td>Lei posterior geral sempre revoga lei especial.</td><td>Não necessariamente; a mera coexistência de disposições gerais/especiais não implica revogação.</td></tr>
 <tr><td>Revogar a revogadora restaura a primeira lei.</td><td>Não sem disposição expressa.</td></tr>
 <tr><td>Costume só vale se previsto em lei.</td><td>A LINDB o usa como técnica de integração.</td></tr>
 <tr><td>Todo fato jurídico decorre da vontade humana.</td><td>Fatos naturais também podem produzir efeitos jurídicos.</td></tr>
 <tr><td>Dívida prescrita paga voluntariamente é repetível.</td><td>Não apenas por estar prescrita.</td></tr>
 <tr><td>Enriquecimento sem causa sempre concorre com ação específica.</td><td>O art. 886 consagra subsidiariedade.</td></tr>
 <tr><td>Privilégio e garantia real são a mesma coisa.</td><td>Ambos podem gerar preferência, mas têm estrutura distinta.</td></tr>
 </table></section>
 <details class="civil-complement"><summary><b>COMPLEMENTAR — antigo Módulo 11: Direito de Empresa</b></summary>
 <div class="civil-alert">O conteúdo anterior foi preservado como aprofundamento, mas não é prioridade para o edital verticalizado usado como referência.</div>
 ${civil11ComplementReadingBody()}
 ${civil11ComplementTheoryBody()}
 ${civil11ComplementDeepBody()}
 </details>
 </div>`
}
function civil11AnkiStep(){
 const id='anki11',m=civilModuleState('m11'),done=!!m.anki,open=localStorage.getItem(civil11StepOpenKey(id))==='1';
 const deck1='04 DIREITO CIVIL::01 LINDB',deck2='04 DIREITO CIVIL::10 CONTRATOS EM ESPÉCIE E ATOS UNILATERAIS';
 return `<section class="civil-step ${done?'done':''} ${open?'open':''}" data-step="anki11"><button class="civil-step-head" onclick="toggleCivil11Step('anki11')"><span class="civil-step-n">${done?'✓':'8'}</span><span class="civil-step-title"><b>Anki seletivo</b><small>LINDB + atos unilaterais.</small></span><span class="civil-step-status">${done?'Concluído':'Pendente'}</span><span>⌄</span></button>
 <div class="civil-step-body"><p class="civil-anki-note">Priorize LINDB e depois os cartões de atos unilaterais/pagamento indevido/enriquecimento. Preferências creditórias devem ser revistas pelo caderno de erros deste módulo.</p>
 <div class="civil-stage-actions"><button class="civil-btn primary" onclick="window.openAnkiDeck('${escJs(deck1)}')">🧠 Abrir LINDB</button><button class="civil-btn" onclick="window.openAnkiDeck('${escJs(deck2)}')">Atos unilaterais</button></div>
 <label class="civil-manual-done"><input type="checkbox" ${done?'checked':''} onchange="civilSetModule('m11',{anki:this.checked})"> Marcar revisão no Anki como concluída</label></div></section>`
}

function civil11ErrorStep(){
 const id='errors11',m=civilModuleState('m11'),done=!!m.errorsReviewed,open=localStorage.getItem(civil11StepOpenKey(id))==='1';
 const qs=civil11StageQuestions('errors11'),unresolved=qs.filter(q=>civilAnswer(q.id)?.lastCorrect===false);
 const rows=qs.map((q,i)=>{const a=civilAnswer(q.id);return `<div class="civil-error-row"><div><b>${q.kind==='real'?'Real':'Autoral'} • ${esc(q.subject)}</b><small>${a?.lastCorrect?'Corrigida na última tentativa':'Ainda errada na última tentativa'} · ${a?.attempts||0} tentativa(s)</small></div><button class="civil-btn" onclick="civil11Ui={stage:'errors11',index:${i}};localStorage.setItem(civil11StepOpenKey('errors11'),'1');renderSubjects()">Revisar</button></div>`}).join('');
 return `<section class="civil-step ${done?'done':''} ${open?'open':''}" data-step="errors11"><button class="civil-step-head" onclick="toggleCivil11Step('errors11')"><span class="civil-step-n">${done?'✓':'7'}</span><span class="civil-step-title"><b>Revisão de erros</b><small>Somente erros deste módulo.</small></span><span class="civil-step-status">${qs.length} no histórico · ${unresolved.length} ainda erradas</span><span>⌄</span></button>
 <div class="civil-step-body">${qs.length?`<div class="civil-error-list">${rows}</div>${civil11Ui.stage==='errors11'?`<div style="margin-top:9px">${civil11StageSession('errors11')}</div>`:''}`:'<div class="muted small">Nenhum erro registrado neste módulo ainda.</div>'}
 <label class="civil-manual-done"><input type="checkbox" ${done?'checked':''} onchange="civilSetModule('m11',{errorsReviewed:this.checked})"> Marcar minha revisão de erros como concluída</label></div></section>`
}
function civil11ComplementAnkiStep(){
 const id='anki11',m=civilModuleState('m11'),done=!!m.anki,open=localStorage.getItem(civil11StepOpenKey(id))==='1';
 return `<section class="civil-step ${done?'done':''} ${open?'open':''}" data-step="anki11"><button class="civil-step-head" onclick="toggleCivil11Step('anki11')"><span class="civil-step-n">${done?'✓':'8'}</span><span class="civil-step-title"><b>Anki seletivo</b><small>Revisão sem alterar seus baralhos existentes.</small></span><span class="civil-step-status">${done?'Concluído':'Pendente'}</span><span>⌄</span></button>
 <div class="civil-step-body"><p class="civil-anki-note">A coleção Anki integrada atualmente <b>não possui um subbaralho específico de Direito de Empresa</b>. Para não misturar matérias nem alterar seus cards sem pedido, não criei deck novo. Use o caderno de erros deste módulo e, ao revisar, priorize 5 cartões: <b>art. 966; art. 971; art. 978; arts. 1.142/1.147; arts. 1.155/1.164/1.166</b>.</p>
 <label class="civil-manual-done"><input type="checkbox" ${done?'checked':''} onchange="civilSetModule('m11',{anki:this.checked})"> Marcar minha revisão seletiva como concluída</label></div></section>`
}
function renderCivilModule11(){
 const pct=civilModulePct('m11');
 return `<div class="civil-overall"><span style="width:${pct}%"></span></div><div class="civil-scope-note"><span class="civil-scope-badge edital">EDITAL</span><b>Fechamento do Edital I:</b> LINDB, teoria geral dos fatos jurídicos, atos unilaterais, pagamento indevido, enriquecimento sem causa, preferências/privilégios creditórios e disposições finais/transitórias do Código Civil. <b>Direito de Empresa foi preservado apenas como conteúdo complementar.</b></div>
 <div class="civil-steps">
 ${civil11QuestionStep('diagnostic11','Diagnóstico FCC — lacunas do edital','10 questões reais FCC de LINDB, fatos, pagamento e preferências.',1)}
 ${civil11ManualStep('reading11','Leitura orientada','LINDB + CC 854-886, 955-965 e 2.028-2.046.',2,civil11ReadingBody(),'reading')}
 ${civil11ManualStep('theory11','Teoria nuclear','Preenchimento das lacunas identificadas na auditoria.',3,civil11TheoryBody(),'theory')}
 ${civil11ManualStep('deep11','Aprofundamento e complementar','Pegadinhas + antigo conteúdo de Empresa preservado.',4,civil11DeepBody(),'deep')}
 ${civil11QuestionStep('cases11','Casos práticos','5 casos autorais direcionados ao edital.',5)}
 ${civil11QuestionStep('final11','Bateria final FCC','15 questões reais FCC de fechamento.',6)}
 ${civil11ErrorStep()}
 ${civil11AnkiStep()}
 </div>`
}


let civil12Ui={stage:null,index:0};
function civil12StepOpenKey(id){return `central-v6:civil-step:m12:${id}`}
function civil12StageQuestions(stage){
 if(stage==='diagnostic12')return CIVIL_COURSE.diagnostic12||[];
 if(stage==='final12')return CIVIL_COURSE.final12||[];
 if(stage==='cases12')return CIVIL_COURSE.cases12||[];
 if(stage==='errors12'){
  const all=[...(CIVIL_COURSE.diagnostic12||[]),...(CIVIL_COURSE.cases12||[]),...(CIVIL_COURSE.final12||[])];
  return all.filter(q=>civilAnswer(q.id)?.everWrong);
 }
 return[];
}
function civil12StageDone(stage){
 const qs=civil12StageQuestions(stage);return qs.length>0&&qs.every(q=>(civilAnswer(q.id)?.attempts||0)>0)
}
function civil12Steps(){
 const m=civilModuleState('m12');
 return [
  {id:'diagnostic12',done:civil12StageDone('diagnostic12')},
  {id:'reading12',done:!!m.reading},
  {id:'theory12',done:!!m.theory},
  {id:'deep12',done:!!m.deep},
  {id:'cases12',done:civil12StageDone('cases12')},
  {id:'final12',done:civil12StageDone('final12')},
  {id:'errors12',done:!!m.errorsReviewed},
  {id:'anki12',done:!!m.anki}
 ]
}
function toggleCivil12Step(id){
 const el=document.querySelector(`.civil-module[data-civil="m12"] .civil-step[data-step="${id}"]`);if(!el)return;
 const open=!el.classList.contains('open');el.classList.toggle('open',open);localStorage.setItem(civil12StepOpenKey(id),open?'1':'0')
}
function civil12OpenStage(stage){
 const qs=civil12StageQuestions(stage);if(!qs.length){civil12Ui={stage,index:0};renderSubjects();return}
 let idx=qs.findIndex(q=>(civilAnswer(q.id)?.attempts||0)===0);if(idx<0)idx=0;
 civil12Ui={stage,index:idx};localStorage.setItem(civil12StepOpenKey(stage),'1');renderSubjects();
 setTimeout(()=>document.querySelector(`.civil-module[data-civil="m12"] .civil-step[data-step="${stage}"]`)?.scrollIntoView({behavior:'smooth',block:'center'}),20)
}
function civil12Select(id,letter){
 const st=civilState(),a=st.answers[id]||{attempts:0,history:[],everWrong:false};
 if(a.submitted)return;a.selected=letter;a.submitted=false;st.answers[id]=a;civilSave(st);renderSubjects()
}
function civil12Submit(id,stage){
 const q=[...(CIVIL_COURSE.diagnostic12||[]),...(CIVIL_COURSE.cases12||[]),...(CIVIL_COURSE.final12||[])].find(x=>x.id===id);
 if(!q)return;const st=civilState(),a=st.answers[id]||{attempts:0,history:[],everWrong:false};
 if(!a.selected){alert('Escolha uma alternativa primeiro.');return}
 const correct=a.selected===q.answer;
 a.attempts=(a.attempts||0)+1;a.submitted=true;a.lastCorrect=correct;a.everWrong=!!a.everWrong||!correct;
 a.history=[...(a.history||[]),{at:new Date().toISOString(),selected:a.selected,correct,stage,module:'m12'}];
 st.answers[id]=a;civilSave(st);renderAll()
}
function civil12Retry(id){const st=civilState(),a=st.answers[id];if(!a)return;a.selected=null;a.submitted=false;st.answers[id]=a;civilSave(st);renderSubjects()}
function civil12Move(stage,delta){
 const qs=civil12StageQuestions(stage);if(!qs.length)return;
 civil12Ui.stage=stage;civil12Ui.index=Math.max(0,Math.min(qs.length-1,civil12Ui.index+delta));renderSubjects()
}
function civil12Accuracy(stage){
 const qs=civil12StageQuestions(stage),answered=qs.map(q=>civilAnswer(q.id)).filter(a=>a?.attempts);
 const correct=answered.filter(a=>a.lastCorrect).length;
 return {answered:answered.length,total:qs.length,correct,pct:answered.length?Math.round(correct/answered.length*100):0}
}
function civil12QuestionMeta(q){
 const role=/Oficial de Justiça/i.test(q.source)?'Oficial de Justiça':/Analista|Defensor|Juiz|Procurador|Auditor|AFRE/i.test(q.source)?'Nível superior / carreira jurídica':'Carreira jurídica';
 return `<div class="civil-qmeta"><span class="civil-chip real">${esc(q.bankLabel||'QUESTÃO REAL FCC')}</span><span class="civil-chip role">${esc(role)}</span><span class="civil-chip">${esc(q.basis)}</span><span class="civil-qsource">${esc(q.source)}</span></div>`
}
function civil12QuestionCard(q,stage,index,total){
 const a=civilAnswer(q.id)||{selected:null,submitted:false,attempts:0,history:[]},locked=!!a.submitted;
 const opts=Object.entries(q.options).map(([letter,text])=>{
  let cls='civil-option';if(a.selected===letter)cls+=' selected';
  if(locked&&letter===q.answer)cls+=' correct';else if(locked&&a.selected===letter&&letter!==q.answer)cls+=' wrong';
  return `<button class="${cls}" ${locked?'disabled':''} onclick="civil12Select('${escJs(q.id)}','${letter}')"><span class="civil-letter">${letter}</span><span>${esc(text)}</span></button>`
 }).join('');
 const meta=q.kind==='real'?civil12QuestionMeta(q):`<div class="civil-qmeta"><span class="civil-chip authorial">AUTORAL</span><span class="civil-chip role">Nível Analista/Oficial</span><span class="civil-chip">${esc(q.basis)}</span><span class="civil-qsource">${esc(q.source)}</span></div>`;
 const feedback=locked?`<div class="civil-feedback ${a.lastCorrect?'good':'bad'}"><b>${a.lastCorrect?'✓ Resposta correta':'✕ Resposta incorreta — gabarito '+q.answer}</b>${esc(q.explanation)}<span class="basis">Fundamento: ${esc(q.basis)}${a.attempts>1?' · '+a.attempts+' tentativas':''}</span></div>`:'';
 const source=q.kind==='real'?(q.url?`<a class="civil-source-link" href="${escAttr(q.url)}" target="_blank" rel="noopener">Fonte da questão no TEC ↗</a>`:'<span class="muted small">Questão real FCC recuperada do PDF enviado.</span>'):'<span class="muted small">Caso criado para aplicação da regra.</span>';
 return `<article class="civil-qcard">${meta}<h4>${esc(q.prompt)}</h4><div class="civil-options">${opts}</div>
 <div class="civil-submit-row"><div>${source}</div>
 <div class="civil-qnav"><button class="civil-btn" onclick="civil12Move('${stage}',-1)" ${index===0?'disabled':''}>←</button><span>${index+1} / ${total}</span><button class="civil-btn" onclick="civil12Move('${stage}',1)" ${index===total-1?'disabled':''}>→</button></div>
 ${locked?`<button class="civil-btn" onclick="civil12Retry('${escJs(q.id)}')">Refazer</button>`:`<button class="civil-btn primary" onclick="civil12Submit('${escJs(q.id)}','${stage}')">Responder</button>`}
 </div>${feedback}</article>`
}
function civil12StageSession(stage){
 const qs=civil12StageQuestions(stage);if(!qs.length)return '<div class="muted small">Nenhuma questão disponível.</div>';
 if(civil12Ui.stage!==stage)civil12Ui={stage,index:Math.max(0,qs.findIndex(q=>(civilAnswer(q.id)?.attempts||0)===0))};
 civil12Ui.index=Math.max(0,Math.min(qs.length-1,civil12Ui.index));
 return civil12QuestionCard(qs[civil12Ui.index],stage,civil12Ui.index,qs.length)
}
function civil12QuestionStep(stage,title,subtitle,num){
 const stats=civil12Accuracy(stage),done=civil12StageDone(stage),open=localStorage.getItem(civil12StepOpenKey(stage))==='1',active=civil12Ui.stage===stage;
 return `<section class="civil-step ${done?'done':''} ${open?'open':''}" data-step="${stage}">
 <button class="civil-step-head" onclick="toggleCivil12Step('${stage}')"><span class="civil-step-n">${done?'✓':num}</span><span class="civil-step-title"><b>${esc(title)}</b><small>${esc(subtitle)}</small></span><span class="civil-step-status">${stats.answered}/${stats.total} respondidas${stats.answered?' · '+stats.pct+'%':''}</span><span>⌄</span></button>
 <div class="civil-step-body"><div class="civil-stage-toolbar"><p>${stage==='diagnostic12'?'Dez questões FCC, priorizando 2020-2026 e incluindo Oficial de Justiça. Resolva sem consultar a teoria.':stage==='final12'?'Quinze questões FCC reais, incluindo classificação, aquisição, proteção, frutos, deterioração e benfeitorias.':'Casos autorais para consolidar distinções que mais geram erro: posse/detenção, interversão, efeitos e desforço.'}</p><div class="civil-stage-actions"><button class="civil-btn primary" onclick="civil12OpenStage('${stage}')">${stats.answered?'Continuar':'Iniciar'}</button></div></div>${active?civil12StageSession(stage):''}</div></section>`
}
function civil12ManualStep(id,title,subtitle,num,body,field){
 const st=civilModuleState('m12'),done=!!st[field],open=localStorage.getItem(civil12StepOpenKey(id))==='1';
 return `<section class="civil-step ${done?'done':''} ${open?'open':''}" data-step="${id}">
 <button class="civil-step-head" onclick="toggleCivil12Step('${id}')"><span class="civil-step-n">${done?'✓':num}</span><span class="civil-step-title"><b>${esc(title)}</b><small>${esc(subtitle)}</small></span><span class="civil-step-status">${done?'Concluído':'Pendente'}</span><span>⌄</span></button>
 <div class="civil-step-body">${body}<label class="civil-manual-done"><input type="checkbox" ${done?'checked':''} onchange="civilSetModule('m12',{${field}:this.checked})"> Marcar esta etapa como concluída</label></div></section>`
}
function civil12ReadingBody(){
 return `<div class="civil-theory"><section><h4>Leitura orientada — Módulo 12</h4><div class="civil-law-grid">
 <div class="civil-law-card"><b>CC, arts. 1.196 a 1.203</b><span>Conceito, detenção, posse direta/indireta, composse, justiça e boa-fé.</span></div>
 <div class="civil-law-card"><b>CC, arts. 1.204 a 1.209</b><span>Aquisição, transmissão, sucessão, mera tolerância e vícios aquisitivos.</span></div>
 <div class="civil-law-card"><b>CC, arts. 1.210 a 1.222</b><span>Proteção possessória, frutos, perda/deterioração e benfeitorias.</span></div>
 <div class="civil-law-card"><b>CC, arts. 1.223 a 1.224</b><span>Perda da posse.</span></div>
 </div>
 <div class="civil-alert"><b>Leitura complementar estratégica:</b> função social e socioambiental da posse deve ser estudada como vetor constitucional e interpretativo. Ela não apaga os requisitos legais de posse, detenção, boa-fé ou usucapião.</div>
 <div class="civil-stage-actions"><button class="civil-btn primary" onclick="saveLast({civilModule:'m12',title:'Direito Civil • Módulo 12 • Posse no Vade Mecum',at:Date.now()});openVadeMecum(null,'cc')">📖 Abrir Código Civil no Vade Mecum</button></div></section></div>`
}
function civil12TheoryBody(){
 return `<div class="civil-theory">
 <section><h4>1. Teorias da posse: Savigny × Ihering</h4><table class="civil-compare"><tr><th>Savigny — subjetiva</th><th>Ihering — objetiva</th></tr>
 <tr><td>Corpus + animus domini como estrutura clássica.</td><td>A posse é exteriorização do exercício de poderes da propriedade; o animus domini não é requisito geral da posse.</td></tr></table>
 <p>O art. 1.196 reflete predominantemente a teoria objetiva de Ihering: possuidor é quem exerce de fato, plenamente ou não, algum poder inerente à propriedade.</p></section>

 <section><h4>2. Possuidor × detentor</h4><p><strong>Possuidor:</strong> exerce poder fático juridicamente reconhecido sobre a coisa. <strong>Detentor:</strong> conserva a posse em nome de outro, em relação de dependência e seguindo ordens.</p>
 <div class="civil-alert">Exemplo clássico de detenção: empregado, caseiro ou capataz que guarda o bem em nome do patrão. O tempo, sozinho, não transforma detenção em posse.</div></section>

 <section><h4>3. Posse direta × indireta — art. 1.197</h4><p>A posse se desdobra. Locatário, comodatário e usufrutuário podem exercer posse direta; quem lhes entregou a coisa conserva a indireta. Uma <strong>não anula</strong> a outra.</p><p>O possuidor direto pode defender sua posse até contra o indireto.</p></section>

 <section><h4>4. Composse — art. 1.199</h4><p>Duas ou mais pessoas possuem coisa indivisa. Cada uma pode praticar atos possessórios, desde que não exclua os atos dos demais compossuidores.</p></section>

 <section><h4>5. Posse justa × injusta</h4><p><strong>Justa:</strong> não violenta, não clandestina e não precária. <strong>Injusta:</strong> marcada por pelo menos um desses vícios.</p><table class="civil-compare"><tr><th>Violenta</th><th>Clandestina</th><th>Precária</th></tr><tr><td>Obtida com força/coação.</td><td>Obtida ocultamente.</td><td>Abuso de confiança: quem recebeu legitimamente passa a reter indevidamente.</td></tr></table></section>

 <section><h4>6. Boa-fé × má-fé — classificação independente</h4><p>Boa-fé existe quando o possuidor ignora o vício ou obstáculo à aquisição. Justo título gera presunção de boa-fé, salvo prova em contrário ou quando a lei a exclui.</p><div class="civil-alert">Posse injusta não é sinônimo de posse de má-fé. É possível, em determinadas situações, que o possuidor desconheça o vício objetivo da posse.</div></section>

 <section><h4>7. Quando cessa a boa-fé — art. 1.202</h4><p>A posse deixa de ser de boa-fé quando as circunstâncias fazem presumir que o possuidor não ignora a indevida posse. Isso é decisivo para frutos, deterioração e benfeitorias.</p></section>

 <section><h4>8. Conservação do caráter e interversão — art. 1.203</h4><p>Salvo prova em contrário, a posse mantém o caráter com que foi adquirida. A <strong>interversio possessionis</strong> é alteração juridicamente relevante da causa/natureza da posse, como oposição inequívoca do possuidor direto ao indireto em circunstâncias capazes de modificar o título possessório.</p></section>

 <section><h4>9. Aquisição — arts. 1.204 e 1.205</h4><ul><li>Adquire-se a posse quando se torna possível exercer, em nome próprio, algum poder inerente à propriedade.</li><li>Pode ser adquirida pela própria pessoa, por representante ou por terceiro sem mandato, sujeito à ratificação.</li></ul></section>

 <section><h4>10. Transmissão da posse — arts. 1.206 e 1.207</h4><ul><li>Herdeiros e legatários recebem a posse com os mesmos caracteres.</li><li>Sucessor universal continua de direito a posse do antecessor.</li><li>Sucessor singular pode unir a própria posse à do antecessor para os efeitos legais.</li></ul></section>

 <section><h4>11. Mera tolerância, violência e clandestinidade — art. 1.208</h4><p>Atos de mera permissão ou tolerância não induzem posse. Atos violentos ou clandestinos não autorizam aquisição possessória enquanto persistir a violência ou clandestinidade.</p><div class="civil-alert">O art. 1.208 não diz que “ano e dia” saneia automaticamente o vício.</div></section>

 <section><h4>12. Presunção sobre móveis — art. 1.209</h4><p>A posse do imóvel faz presumir, <strong>até prova em contrário</strong>, a posse das coisas móveis que nele estiverem.</p></section>

 <section><h4>13. Tutela possessória — art. 1.210</h4><table class="civil-compare"><tr><th>Agressão</th><th>Proteção</th></tr>
 <tr><td>Turbação</td><td>Manutenção da posse.</td></tr>
 <tr><td>Esbulho</td><td>Reintegração da posse.</td></tr>
 <tr><td>Ameaça / justo receio</td><td>Proteção preventiva — interdito proibitório no plano processual.</td></tr></table>
 <p>A alegação de propriedade ou outro direito sobre a coisa <strong>não impede</strong> manutenção ou reintegração.</p></section>

 <section><h4>14. Desforço imediato — art. 1.210, §1º</h4><p>Autotutela possessória excepcional: o possuidor turbado ou esbulhado pode manter-se ou restituir-se por sua própria força, desde que o faça <strong>logo</strong> e sem exceder o <strong>indispensável</strong>.</p></section>

 <section><h4>15. Conflito entre possuidores e terceiro receptor — arts. 1.211 e 1.212</h4><ul><li>Se vários se dizem possuidores, mantém-se provisoriamente quem está com a coisa, salvo obtenção viciosa manifesta a partir de outro.</li><li>É possível agir contra terceiro que recebeu coisa esbulhada sabendo dessa origem.</li></ul></section>

 <section><h4>16. Frutos — arts. 1.214 a 1.216</h4><table class="civil-compare"><tr><th>Boa-fé</th><th>Má-fé</th></tr>
 <tr><td>Direito aos frutos percebidos enquanto durar a boa-fé.</td><td>Responde pelos frutos colhidos/percebidos e pelos que culpavelmente deixou de perceber.</td></tr>
 <tr><td>Pendentes quando cessa a boa-fé são restituídos, descontados produção/custeio.</td><td>Tem direito às despesas de produção e custeio.</td></tr></table></section>

 <section><h4>17. Perda ou deterioração — arts. 1.217 e 1.218</h4><p><strong>Boa-fé:</strong> não responde pela perda/deterioração a que não der causa.</p><p><strong>Má-fé:</strong> responde até pelos eventos acidentais, salvo se provar que o mesmo aconteceria na posse do reivindicante.</p></section>

 <section><h4>18. Benfeitorias — arts. 1.219 a 1.222</h4><table class="civil-compare"><tr><th>Possuidor de boa-fé</th><th>Possuidor de má-fé</th></tr>
 <tr><td>Indenização: necessárias + úteis.</td><td>Indenização: somente necessárias.</td></tr>
 <tr><td>Retenção: necessárias + úteis.</td><td>Sem retenção.</td></tr>
 <tr><td>Voluptuárias: pode levantar se não pagas e sem detrimento.</td><td>Não pode levantar voluptuárias.</td></tr></table>
 <p>Benfeitorias compensam-se com danos e só geram ressarcimento se ainda existirem na época da evicção. Para possuidor de má-fé, reivindicante escolhe valor atual ou custo; para boa-fé, valor atual.</p></section>

 <section><h4>19. Perda da posse — arts. 1.223 e 1.224</h4><p>Perde-se a posse quando cessa o poder fático sobre o bem. Para quem não presenciou o esbulho, a perda só se considera quando, sabendo dele, abstém-se de retornar ou, tentando, é violentamente repelido.</p></section>

 <section><h4>20. Posse ad interdicta × posse ad usucapionem</h4><p><strong>Ad interdicta:</strong> posse apta à proteção possessória. <strong>Ad usucapionem:</strong> além da posse, exige os requisitos da modalidade aquisitiva, especialmente animus domini, lapso e ausência de oposição quando pertinentes.</p><p>Locatário, comodatário e outros possuidores diretos têm tutela possessória, mas sua posse derivada não é automaticamente ad usucapionem.</p></section>

 <section><h4>21. Função social e socioambiental da posse</h4><p>A posse não é examinada apenas como fato físico: sua tutela dialoga com dignidade, moradia, produtividade, boa-fé, função social da propriedade e proteção ambiental.</p><div class="civil-alert"><b>Cuidado de prova:</b> função social/socioambiental é vetor interpretativo, não autorização para ignorar texto legal. Mera tolerância continua sem induzir posse; detenção continua distinta de posse; bem público não se torna usucapível por simples utilização social.</div></section>
 </div>`
}
function civil12DeepBody(){
 return `<div class="civil-theory">
 <section class="civil-juris"><h4>STJ 2026 — ocupação familiar pode ser mera tolerância</h4><p>No Informativo 894/2026, o STJ decidiu que a ocupação de imóvel de ascendente por descendente, em contexto de administração e solidariedade familiar, em regra revela mera liberalidade/tolerância e não demonstra automaticamente animus domini. Para usucapião, é necessária prova da posse qualificada.</p></section>

 <section class="civil-juris"><h4>STJ 2024 — detenção não basta para usucapião</h4><p>No Informativo 830, a Quarta Turma reafirmou que animus domini pressupõe posse efetiva; mera detenção ou uso fundado apenas em tolerância não basta para posse ad usucapionem.</p></section>

 <section class="civil-juris"><h4>STJ — a qualidade da posse pode mudar</h4><p>No Informativo 735, o STJ reconheceu que a mesma relação pode atravessar período de boa-fé e depois de má-fé. Com a mudança do contexto jurídico, mudam também os efeitos quanto às benfeitorias: boa-fé permite indenização/retenção nos termos do art. 1.219; má-fé limita-se ao art. 1.220.</p></section>

 <section class="civil-juris"><h4>STJ — benfeitorias não são reconhecidas de ofício</h4><p>No REsp 1.836.846/PR, o STJ entendeu que o juiz não pode, em ação possessória, conceder de ofício indenização por benfeitorias úteis ou necessárias quando a parte não formulou o pedido correspondente, em respeito à congruência processual.</p></section>

 <section class="civil-juris"><h4>STJ — possessória não substitui despejo</h4><p>Em relação locatícia, a posse indireta do locador existe, mas a retomada do imóvel alugado deve seguir a ação de despejo prevista na Lei de Locações. O STJ afastou o uso da possessória como atalho para essa finalidade.</p></section>

 <section><h4>Mapa de pegadinhas</h4><table class="civil-compare"><tr><th>Pegadinha</th><th>Regra correta</th></tr>
 <tr><td>CC exige animus domini para toda posse.</td><td>Não; o art. 1.196 reflete a concepção objetiva.</td></tr>
 <tr><td>Empregado que guarda o bem é possuidor.</td><td>Em relação de dependência/ordens, é detentor.</td></tr>
 <tr><td>Posse direta elimina a indireta.</td><td>Coexistem.</td></tr>
 <tr><td>Possuidor direto não pode agir contra o indireto.</td><td>Pode defender sua posse contra ele.</td></tr>
 <tr><td>Posse injusta = posse de má-fé.</td><td>Classificações diferentes.</td></tr>
 <tr><td>Justo título é indispensável para toda boa-fé.</td><td>Não; ele gera presunção.</td></tr>
 <tr><td>Mera tolerância gera posse com o tempo.</td><td>Art. 1.208: não induz posse por si só.</td></tr>
 <tr><td>Violência/clandestinidade geram posse imediatamente.</td><td>Não enquanto persistirem.</td></tr>
 <tr><td>A posse do imóvel não alcança móveis nele encontrados.</td><td>Há presunção relativa.</td></tr>
 <tr><td>Propriedade registrada vence automaticamente possessória.</td><td>Juízo possessório protege posse; alegação dominial não obsta por si só.</td></tr>
 <tr><td>Desforço pode ocorrer a qualquer tempo.</td><td>Deve ser imediato e proporcional.</td></tr>
 <tr><td>Má-fé perde todo direito sobre despesas e benfeitorias.</td><td>Tem produção/custeio dos frutos e benfeitorias necessárias, sem retenção.</td></tr>
 <tr><td>Boa-fé responde por caso fortuito.</td><td>Não responde se não deu causa.</td></tr>
 <tr><td>Má-fé nunca responde por acidente.</td><td>Responde, salvo prova da exceção do art. 1.218.</td></tr>
 <tr><td>Toda benfeitoria do boa-fé dá retenção.</td><td>Retenção só por necessárias e úteis.</td></tr>
 <tr><td>Função social transforma detenção em posse.</td><td>Não.</td></tr></table></section>
 </div>`
}
function civil12ErrorStep(){
 const id='errors12',m=civilModuleState('m12'),done=!!m.errorsReviewed,open=localStorage.getItem(civil12StepOpenKey(id))==='1';
 const qs=civil12StageQuestions('errors12'),unresolved=qs.filter(q=>civilAnswer(q.id)?.lastCorrect===false);
 const rows=qs.map((q,i)=>{const a=civilAnswer(q.id);return `<div class="civil-error-row"><div><b>${q.kind==='real'?'FCC':'Autoral'} • ${esc(q.subject)}</b><small>${a?.lastCorrect?'Corrigida na última tentativa':'Ainda errada na última tentativa'} · ${a?.attempts||0} tentativa(s)</small></div><button class="civil-btn" onclick="civil12Ui={stage:'errors12',index:${i}};localStorage.setItem(civil12StepOpenKey('errors12'),'1');renderSubjects()">Revisar</button></div>`}).join('');
 return `<section class="civil-step ${done?'done':''} ${open?'open':''}" data-step="errors12"><button class="civil-step-head" onclick="toggleCivil12Step('errors12')"><span class="civil-step-n">${done?'✓':'7'}</span><span class="civil-step-title"><b>Revisão de erros</b><small>Somente erros do Módulo 12.</small></span><span class="civil-step-status">${qs.length} no histórico · ${unresolved.length} ainda erradas</span><span>⌄</span></button>
 <div class="civil-step-body">${qs.length?`<div class="civil-error-list">${rows}</div>${civil12Ui.stage==='errors12'?`<div style="margin-top:9px">${civil12StageSession('errors12')}</div>`:''}`:'<div class="muted small">Nenhum erro registrado neste módulo ainda.</div>'}
 <label class="civil-manual-done"><input type="checkbox" ${done?'checked':''} onchange="civilSetModule('m12',{errorsReviewed:this.checked})"> Marcar minha revisão de erros como concluída</label></div></section>`
}
