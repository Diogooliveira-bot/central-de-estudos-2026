/* CF M01 — piloto de teoria guiada. Isolado; não altera o conteúdo nativo nem o progresso existente. */
(function (global) {
  'use strict';
  if (global.__BC_CF_M01_GUIDED_PILOT__) return;
  global.__BC_CF_M01_GUIDED_PILOT__ = true;

  const SUBJECTS = [
    {
      title: 'Constitucionalismo e Constituição',
      base: 'Uma Constituição não serve apenas para dizer quem governa. Sua função central é organizar o Estado, limitar o exercício do poder e proteger direitos. O constitucionalismo é o movimento histórico e jurídico que defende essa submissão do poder político a regras superiores. Assim, nem mesmo quem ganhou uma eleição pode agir fora dos limites constitucionais.',
      example: 'Imagine uma lei que autorize um governante a fechar jornais que o critiquem. Mesmo aprovada pelo Legislativo, ela poderá contrariar a Constituição, pois o poder estatal deve respeitar os direitos fundamentais e o controle constitucional.',
      law: 'Ideia central: Constituição = organização do Estado + limitação do poder + proteção de direitos.',
      deeper: 'A supremacia da Constituição funciona como parâmetro de validade das normas inferiores. Na Constituição de 1988, a separação de Poderes, os direitos fundamentais e o controle de constitucionalidade compõem essa arquitetura.',
      trap: 'Ter um documento chamado Constituição não é suficiente, por si só, para concluir que o poder político é efetivamente limitado.',
      recall: 'Constitucionalismo limita o poder; Constituição é a norma fundamental do Estado.',
      check: 'Eu sei diferenciar Constituição e constitucionalismo.'
    },
    {
      title: 'Os sentidos de Constituição',
      base: 'A doutrina enxerga a Constituição por ângulos diferentes. Ferdinand Lassalle pergunta quais forças sociais realmente comandam a vida política: é o sentido sociológico. Carl Schmitt destaca as decisões políticas fundamentais sobre a estrutura estatal: é o sentido político. Hans Kelsen analisa a Constituição como norma jurídica superior: é o sentido jurídico. A concepção cultural integra fatores históricos, sociais, políticos e jurídicos.',
      example: 'Se uma banca menciona os fatores reais de poder que atuam na sociedade, a palavra-chave remete a Lassalle. Se destaca a decisão política fundamental, remete a Schmitt. Se enfatiza a hierarquia normativa, remete a Kelsen.',
      law: 'Memorize as associações: Lassalle → sociológico; Schmitt → político; Kelsen → jurídico; concepção cultural → integração de fatores.',
      deeper: 'Essas concepções são modelos de análise. Elas não significam que a Constituição brasileira deva ser aplicada exclusivamente por uma dessas perspectivas.',
      trap: 'Não associe Lassalle à norma fundamental de Kelsen, nem confunda decisão política fundamental com simples vontade momentânea de um governante.',
      recall: 'Lassalle = forças sociais; Schmitt = decisão política; Kelsen = norma superior.',
      check: 'Eu identifico os quatro sentidos de Constituição.'
    },
    {
      title: 'Como a Constituição de 1988 é classificada',
      base: 'As classificações ajudam a descrever a origem, a forma e a estrutura do texto constitucional. A CF/88 é promulgada porque resulta de uma Assembleia Constituinte; escrita e codificada porque suas normas estão reunidas em texto constitucional; rígida porque sua alteração é mais difícil do que a de uma lei ordinária; formal porque prevalece a inserção no texto constitucional; analítica porque disciplina diversos assuntos; dogmática, dirigente e eclética conforme as classificações doutrinárias usuais.',
      example: 'Uma lei ordinária costuma seguir o procedimento legislativo ordinário. Já uma emenda constitucional exige votação em dois turnos em cada Casa do Congresso Nacional, com três quintos dos votos. Essa dificuldade adicional ajuda a entender a rigidez.',
      law: 'Para a prova: promulgada • escrita • codificada • dogmática • rígida • formal • analítica • dirigente • eclética.',
      deeper: 'Rigidez não significa imutabilidade: a própria Constituição prevê emendas no art. 60. Certas matérias, porém, recebem proteção reforçada das cláusulas pétreas.',
      trap: 'Constituição rígida não é Constituição impossível de alterar. E "analítica" não significa, necessariamente, melhor ou pior: descreve sua extensão temática.',
      recall: 'CF/88: promulgada, escrita, rígida, formal e analítica — entre outras classificações clássicas.',
      check: 'Eu consigo explicar as principais classificações da CF/88.'
    },
    {
      title: 'Supremacia constitucional e hierarquia',
      base: 'Pense no ordenamento como um conjunto de regras que precisam ser compatíveis entre si. A Constituição está no topo desse sistema e funciona como referência para leis e atos inferiores. Se uma lei contraria a Constituição, poderá ser afastada pelo controle de constitucionalidade, conforme as regras aplicáveis.',
      example: 'Se uma lei municipal restringe indevidamente uma liberdade assegurada pela Constituição, não basta dizer que a Câmara Municipal aprovou a lei: ela também precisa ser constitucional.',
      law: 'Regra: norma infraconstitucional deve respeitar a Constituição. Emendas constitucionais integram a Constituição, mas estão sujeitas aos limites do poder constituinte derivado.',
      deeper: 'Entre normas constitucionais originárias não se utiliza uma hierarquia formal para invalidar uma delas por outra. O intérprete busca harmonização. Já as emendas podem sofrer controle por violarem os limites constitucionais de reforma.',
      trap: 'Não conclua que uma norma constitucional originária se torna inválida simplesmente por parecer colidir com outra: o tratamento jurídico não é igual ao das leis inferiores.',
      recall: 'Constituição superior às leis; emendas respeitam limites do art. 60.',
      check: 'Eu entendo a supremacia e a posição das emendas constitucionais.'
    },
    {
      title: 'Eficácia plena, contida e limitada',
      base: 'Essa classificação responde a uma pergunta muito comum: a norma constitucional já consegue produzir seus efeitos ou depende de complemento? Uma norma de eficácia plena tem aplicabilidade imediata e integral. Uma norma de eficácia contida também já se aplica, mas admite restrição nas hipóteses constitucionalmente autorizadas. Uma norma de eficácia limitada precisa de integração para atingir plenamente os efeitos pretendidos — embora já produza consequências jurídicas.',
      example: 'Imagine três comandos: o primeiro funciona integralmente desde já; o segundo já funciona, mas pode ter seu alcance restringido nos termos admitidos pela Constituição; o terceiro estabelece um objetivo constitucional cuja concretização integral depende de atuação normativa posterior.',
      law: 'Plena = imediata e integral. Contida = imediata, mas restringível. Limitada = integração para efeitos plenos, sem ser juridicamente vazia.',
      deeper: 'Normas programáticas são, em geral, classificadas como de eficácia limitada. Mesmo antes da legislação integradora, orientam a atuação estatal e limitam opções incompatíveis com seus fins.',
      trap: 'A banca costuma afirmar que normas de eficácia limitada não têm qualquer eficácia jurídica. Isso está errado: elas já geram efeitos jurídicos.',
      recall: 'Plena aplica; contida aplica e pode restringir; limitada precisa de integração.',
      check: 'Eu diferencio eficácia plena, contida e limitada.'
    },
    {
      title: 'Poder constituinte originário e derivado',
      base: 'Para entender quem cria e modifica uma Constituição, separe duas situações. O poder constituinte originário inaugura uma nova ordem constitucional. O poder constituinte derivado existe porque a Constituição o prevê; por isso, seu exercício encontra limites. O poder reformador altera o texto por emenda; o decorrente permite aos Estados organizar suas Constituições, respeitando a Constituição Federal.',
      example: 'Criar uma nova ordem constitucional é diferente de aprovar uma emenda na ordem atual. Um parlamentar não pode alterar a Constituição por qualquer procedimento: precisa cumprir o processo de reforma previsto no art. 60.',
      law: 'Art. 60: proposta de emenda discutida e votada em cada Casa do Congresso, em dois turnos, aprovada por três quintos em ambos. Há limites formais, circunstanciais e materiais.',
      deeper: 'O art. 60, § 4º protege a forma federativa de Estado; o voto direto, secreto, universal e periódico; a separação dos Poderes; e os direitos e garantias individuais. Não será objeto de deliberação a proposta tendente a aboli-los.',
      trap: 'Poder constituinte derivado não é ilimitado. E cláusula pétrea não equivale a proibição de qualquer alteração textual: veda-se proposta tendente à abolição do núcleo protegido.',
      recall: 'Originário cria a ordem; derivado a modifica com limites. Cláusulas pétreas protegem núcleos essenciais.',
      check: 'Eu sei diferenciar os poderes constituintes e as cláusulas pétreas.'
    },
    {
      title: 'Recepção, repristinação e desconstitucionalização',
      base: 'Quando entra em vigor uma nova Constituição, o ordenamento anterior não desaparece por inteiro. Leis anteriores materialmente compatíveis podem continuar válidas: esse fenômeno é a recepção. As incompatíveis deixam de ser recebidas. Repristinação é o retorno à vigência de norma antes revogada. Desconstitucionalização é a eventual conservação, com outra posição normativa, de normas da Constituição anterior.',
      example: 'Imagine uma lei antiga cujo conteúdo não contraria a nova Constituição. Ela pode continuar em vigor por recepção. Já a lei antiga incompatível não continua válida apenas porque nunca foi formalmente revogada.',
      law: 'Recepção depende de compatibilidade material com a nova Constituição. Repristinação e desconstitucionalização não são automáticas como regra geral.',
      deeper: 'Em concursos, a distinção central costuma ser entre incompatibilidade da lei anterior com a nova Constituição e inconstitucionalidade de lei editada já sob a Constituição vigente.',
      trap: 'Não chame automaticamente a lei anterior incompatível de "inconstitucionalidade superveniente". O enquadramento usual é não recepção.',
      recall: 'Recepção = compatibilidade material; repristinação = retorno de norma revogada.',
      check: 'Eu diferencio recepção, não recepção e repristinação.'
    },
    {
      title: 'Interpretação constitucional e mutação',
      base: 'Interpretar a Constituição é buscar o significado de suas normas considerando o sistema como um todo. O princípio da unidade procura evitar leituras isoladas e contraditórias. A máxima efetividade busca realizar a força jurídica dos comandos constitucionais. Já a mutação constitucional ocorre quando a compreensão de um dispositivo muda sem que suas palavras sejam formalmente alteradas.',
      example: 'Se o texto de um artigo continua idêntico, mas sua interpretação juridicamente admitida evolui, fala-se em mutação. Se o Congresso altera a redação pelo rito do art. 60, ocorre emenda constitucional.',
      law: 'Emenda constitucional = mudança formal do texto. Mutação constitucional = mudança informal do sentido, sem alteração da redação.',
      deeper: 'A interpretação deve respeitar os limites da própria Constituição, a distribuição de competências e a coerência entre seus dispositivos. Mutação não é autorização para o intérprete substituir livremente o texto constitucional.',
      trap: 'A banca poderá chamar de mutação a hipótese em que a redação foi efetivamente modificada por emenda: isso está errado.',
      recall: 'Emenda muda o texto; mutação muda o sentido.',
      check: 'Eu sei separar interpretação, mutação e emenda.'
    },
    {
      title: 'O Preâmbulo da Constituição',
      base: 'O Preâmbulo é a apresentação solene dos valores associados à elaboração da Constituição. Ele ajuda a compreender seu contexto político e axiológico, mas o Supremo Tribunal Federal entende que não possui força normativa autônoma, nem é de reprodução obrigatória pelas Constituições estaduais.',
      example: 'Uma questão afirma que toda Constituição estadual precisa copiar, palavra por palavra, o Preâmbulo da Constituição Federal. O enunciado está errado segundo o entendimento do STF.',
      law: 'STF, ADI 2.076: o Preâmbulo não possui força normativa autônoma e não é obrigatório nos textos estaduais.',
      deeper: 'Ele pode ser utilizado como elemento de auxílio interpretativo; isso não o transforma em parâmetro autônomo de controle de constitucionalidade.',
      trap: 'Não confunda relevância histórica e interpretativa com caráter normativo autônomo.',
      recall: 'Preâmbulo: valor interpretativo, sem força normativa autônoma.',
      check: 'Eu compreendo a posição jurídica do Preâmbulo.'
    },
    {
      title: 'Art. 1º — Fundamentos da República',
      base: 'Os fundamentos são as bases de sustentação da República Federativa do Brasil. Eles respondem à pergunta: quais valores estruturam o Estado brasileiro? O art. 1º afirma que o Brasil é um Estado Democrático de Direito e enumera soberania, cidadania, dignidade da pessoa humana, valores sociais do trabalho e da livre iniciativa, e pluralismo político.',
      example: 'Se uma questão fala em dignidade da pessoa humana e pergunta se é fundamento ou objetivo da República, a resposta é fundamento, previsto no art. 1º, III.',
      law: 'Art. 1º, I a V: soberania; cidadania; dignidade da pessoa humana; valores sociais do trabalho e da livre iniciativa; pluralismo político. Parágrafo único: todo poder emana do povo, exercido por representantes eleitos ou diretamente, nos termos da Constituição.',
      deeper: 'Soberania refere-se ao Estado brasileiro no plano interno e externo; Estados, Distrito Federal e Municípios possuem autonomia nos limites constitucionais, não soberania própria.',
      trap: 'Não confunda soberania da República com autonomia dos entes federativos. Dignidade da pessoa humana é fundamento, não objetivo.',
      recall: 'Art. 1º = fundamentos; poder emana do povo.',
      check: 'Eu consigo lembrar os cinco fundamentos do art. 1º.'
    },
    {
      title: 'Art. 2º — Separação dos Poderes',
      base: 'A Constituição distribui funções estatais entre Legislativo, Executivo e Judiciário. A finalidade dessa separação não é criar três poderes isolados e sem contato, mas reduzir a concentração de poder e permitir controles recíprocos. Por isso, a Constituição exige independência e harmonia.',
      example: 'O Legislativo produz leis e fiscaliza; o Executivo administra e implementa políticas; o Judiciário exerce a função jurisdicional. Existem funções típicas e funções atípicas e controles recíprocos previstos na Constituição.',
      law: 'Art. 2º: são Poderes da União, independentes e harmônicos entre si, o Legislativo, o Executivo e o Judiciário.',
      deeper: 'O sistema de freios e contrapesos permite mecanismos de fiscalização e contenção recíproca. Independência não significa inexistência de limites ou controles constitucionais.',
      trap: 'Se a alternativa disser que a separação de Poderes é absoluta, desconfie: a Constituição prevê harmonia e controles recíprocos.',
      recall: 'Art. 2º = independência + harmonia + freios e contrapesos.',
      check: 'Eu sei explicar a separação dos Poderes.'
    },
    {
      title: 'Art. 3º — Objetivos fundamentais',
      base: 'Os objetivos descrevem resultados que a República deve buscar. Enquanto os fundamentos do art. 1º dizem sobre quais bases o Estado se organiza, o art. 3º aponta fins e transformações sociais a serem perseguidos: construir uma sociedade livre, justa e solidária; garantir o desenvolvimento nacional; erradicar a pobreza e a marginalização e reduzir as desigualdades sociais e regionais; promover o bem de todos, sem preconceitos ou outras formas de discriminação.',
      example: 'Uma política pública direcionada a reduzir desigualdades regionais está relacionada a um objetivo fundamental, não a um princípio específico das relações internacionais.',
      law: 'Art. 3º: construir; garantir; erradicar/reduzir; promover. Os verbos ajudam a lembrar a natureza de objetivos a alcançar.',
      deeper: 'A formulação do art. 3º orienta a atuação estatal, a interpretação jurídica e a conformação de políticas públicas, no âmbito das competências constitucionais.',
      trap: 'Desenvolvimento nacional e redução das desigualdades são objetivos do art. 3º; não os confunda com os fundamentos do art. 1º.',
      recall: 'Art. 3º = finalidades da República; lembre dos verbos de ação.',
      check: 'Eu consigo identificar os quatro objetivos fundamentais.'
    },
    {
      title: 'Art. 4º — Relações internacionais',
      base: 'O art. 4º orienta a atuação do Brasil nas relações com outros países. Entre seus princípios estão independência nacional, prevalência dos direitos humanos, autodeterminação dos povos, não intervenção, igualdade entre os Estados, defesa da paz, solução pacífica dos conflitos, repúdio ao terrorismo e ao racismo, cooperação entre os povos para o progresso da humanidade e concessão de asilo político.',
      example: 'Uma questão afirma que a defesa da paz é objetivo fundamental previsto no art. 3º. Está errada: trata-se de princípio das relações internacionais, no art. 4º.',
      law: 'Art. 4º, I a X: independência; direitos humanos; autodeterminação; não intervenção; igualdade; paz; solução pacífica; repúdio a terrorismo/racismo; cooperação; asilo político. Parágrafo único: busca de integração econômica, política, social e cultural dos povos da América Latina.',
      deeper: 'A integração latino-americana aparece no parágrafo único como diretriz constitucional específica, sem substituir os princípios enumerados nos incisos.',
      trap: 'Não coloque asilo político no art. 3º; ele integra o art. 4º. Também não confunda igualdade entre Estados com igualdade entre indivíduos.',
      recall: 'Art. 4º = atuação internacional do Brasil + integração latino-americana.',
      check: 'Eu reconheço os princípios das relações internacionais.'
    }
  ];

  const KEY = 'bc:cf:m01:teoria-guiada:checklist:v1';
  let currentOverlay = null;
  let previousFocus = null;
  let previousOverflow = '';
  let scheduled = false;

  function escapeHTML(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c];
    });
  }
  function paragraphs(value) {
    return String(value||'').split(/\n\n+/).map(function(part){return '<p>'+escapeHTML(part)+'</p>';}).join('');
  }
  function loadChecklist() {
    try { const value = JSON.parse(localStorage.getItem(KEY)||'{}'); return value && typeof value==='object' ? value : {}; }
    catch (_) { return {}; }
  }
  function setChecklist(index, checked) {
    const state = loadChecklist();
    state[index] = checked;
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (_) {}
  }
  function cards(topic, index) {
    return '<section class="bc-m01-topic" aria-labelledby="bc-m01-heading-'+index+'">'+
      '<h2 id="bc-m01-heading-'+index+'"><span>'+String(index+1).padStart(2,'0')+'</span> '+escapeHTML(topic.title)+'</h2>'+
      '<div class="bc-m01-card bc-m01-foundation"><h3>Entenda</h3>'+paragraphs(topic.base)+'</div>'+
      '<div class="bc-m01-card bc-m01-example"><h3>Na prática</h3>'+paragraphs(topic.example)+'</div>'+
      '<div class="bc-m01-card bc-m01-law"><h3>Regra e fundamento</h3>'+paragraphs(topic.law)+'</div>'+
      '<div class="bc-m01-card bc-m01-deeper"><h3>Aprofundamento</h3>'+paragraphs(topic.deeper)+'</div>'+
      '<div class="bc-m01-card bc-m01-trap"><h3>Pegadinha de prova</h3>'+paragraphs(topic.trap)+'</div>'+
      '<div class="bc-m01-card bc-m01-recall"><h3>Revisão em 30 segundos</h3>'+paragraphs(topic.recall)+'</div>'+
      '</section>';
  }
  function checklist() {
    const state = loadChecklist();
    return '<section class="bc-m01-checklist" aria-label="Checklist de compreensão"><h2>Checklist de compreensão</h2>'+
      '<p>Marque os assuntos que já consegue explicar sem consultar o texto.</p>'+
      SUBJECTS.map(function(topic, index){
        return '<label><input type="checkbox" data-bc-m01-check="'+index+'" '+(state[index]?'checked':'')+'><span>'+escapeHTML(topic.check)+'</span></label>';
      }).join('')+
      '<p class="bc-m01-local-note">Estas marcações são apenas deste piloto e ficam neste navegador. Não alteram o progresso oficial do módulo.</p></section>';
  }
  function close() {
    if (!currentOverlay) return;
    document.removeEventListener('keydown', onKey);
    currentOverlay.remove(); currentOverlay = null;
    document.body.style.overflow = previousOverflow;
    if (previousFocus && previousFocus.isConnected) previousFocus.focus();
  }
  function onKey(event) {
    if (event.key === 'Escape') close();
    if (event.key !== 'Tab' || !currentOverlay) return;
    const controls = Array.from(currentOverlay.querySelectorAll('button:not([disabled]),input:not([disabled])'));
    const first=controls[0], last=controls[controls.length-1];
    if (event.shiftKey && document.activeElement===first) {event.preventDefault();last.focus();}
    else if (!event.shiftKey && document.activeElement===last){event.preventDefault();first.focus();}
  }
  function changeMode(mode) {
    if (!currentOverlay) return;
    const reader=currentOverlay.querySelector('.bc-m01-reader');
    if (!reader) return;
    reader.dataset.view = mode;
    currentOverlay.querySelectorAll('[data-bc-m01-mode]').forEach(function(btn){
      const active = btn.dataset.bcM01Mode === mode;
      btn.setAttribute('aria-pressed',active?'true':'false');
      btn.classList.toggle('active',active);
    });
    const scroller=currentOverlay.querySelector('.bc-m01-scroll');
    if(scroller)scroller.scrollTop=0;
  }
  function open() {
    close();
    previousFocus=document.activeElement;
    previousOverflow=document.body.style.overflow;
    const overlay=document.createElement('div');
    overlay.className='bc-m01-overlay';
    overlay.setAttribute('role','dialog');
    overlay.setAttribute('aria-modal','true');
    overlay.setAttribute('aria-label','Teoria guiada do módulo 01 de Direito Constitucional');
    overlay.innerHTML='<div class="bc-m01-reader" data-view="study">'+
      '<nav class="bc-m01-toolbar" aria-label="Controles de leitura">'+
      '<button type="button" data-bc-m01-close>← Voltar</button>'+
      '<div class="bc-m01-modes" role="group" aria-label="Modo de leitura">'+
      '<button type="button" class="active" data-bc-m01-mode="study" aria-pressed="true">Primeira leitura</button>'+
      '<button type="button" data-bc-m01-mode="review" aria-pressed="false">Revisão rápida</button></div>'+
      '</nav>'+
      '<main class="bc-m01-scroll" tabindex="0"><div class="bc-m01-paper">'+SUBJECTS.map(cards).join('')+checklist()+'</div></main>'+
      '</div>';
    document.body.appendChild(overlay);currentOverlay=overlay;
    document.body.style.overflow='hidden';
    overlay.querySelector('[data-bc-m01-close]').addEventListener('click',close);
    overlay.querySelectorAll('[data-bc-m01-mode]').forEach(function(btn){
      btn.addEventListener('click',function(){changeMode(btn.dataset.bcM01Mode);});
    });
    overlay.querySelectorAll('[data-bc-m01-check]').forEach(function(input){
      input.addEventListener('change',function(){setChecklist(input.dataset.bcM01Check,input.checked);});
    });
    document.addEventListener('keydown',onKey);
    overlay.querySelector('[data-bc-m01-close]').focus();
  }
  function mount() {
    const card=document.querySelector('.cf-module[data-cf="w1"] .cf-study-review .cf-study-actions');
    if(!card || card.querySelector('[data-bc-m01-launch]'))return;
    const button=document.createElement('button');
    button.type='button';button.className='bc-m01-pilot-launch';
    button.setAttribute('data-bc-m01-launch','');
    button.textContent='Nova teoria guiada · testar';
    button.setAttribute('aria-label','Abrir a nova teoria guiada experimental do módulo 01');
    button.addEventListener('click',open);
    card.appendChild(button);
  }
  function scheduleMount() {
    if(scheduled)return;scheduled=true;
    requestAnimationFrame(function(){scheduled=false;mount();});
  }
  function css() {
    if(document.getElementById('bc-m01-pilot-style'))return;
    const style=document.createElement('style');
    style.id='bc-m01-pilot-style';
    style.textContent=[
      '.cf-module[data-cf="w1"] .cf-study-actions .bc-m01-pilot-launch{border:1px solid #94b3d3!important;background:#f0f6fc!important;color:#1b527f!important;box-shadow:none!important;font-size:12px!important;min-height:40px!important;}',
      '.bc-m01-overlay{position:fixed;inset:0;z-index:2147483000;background:#f0f3f8;color:#172b47;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;}',
      '.bc-m01-reader{width:100%;height:100%;display:flex;flex-direction:column;}',
      '.bc-m01-toolbar{flex:0 0 auto;min-height:54px;padding:8px max(14px,env(safe-area-inset-right));border-bottom:1px solid #dce3eb;background:#fff;display:flex;align-items:center;justify-content:space-between;gap:12px;}',
      '.bc-m01-toolbar button{font:600 13px/1.3 inherit;padding:10px 13px;border-radius:8px;cursor:pointer;border:1px solid #cbd6e2;background:#fff;color:#183653;}',
      '.bc-m01-modes{display:flex;gap:4px;padding:4px;background:#edf2f7;border-radius:10px;}',
      '.bc-m01-modes button{border:0;background:transparent;padding:9px 12px;}',
      '.bc-m01-modes button.active{background:#203b61;color:#fff;}',
      '.bc-m01-toolbar button:focus-visible,.bc-m01-checklist input:focus-visible{outline:3px solid #3988d9;outline-offset:2px;}',
      '.bc-m01-scroll{flex:1;min-height:0;overflow:auto;overscroll-behavior:contain;}',
      '.bc-m01-paper{width:min(780px,calc(100% - 28px));margin:0 auto;padding:28px 0 90px;}',
      '.bc-m01-topic{margin-bottom:38px;}',
      '.bc-m01-topic h2{margin:0 0 14px;font-size:clamp(20px,3vw,26px);font-weight:750;line-height:1.27;letter-spacing:-.018em;color:#1d3657;}',
      '.bc-m01-topic h2 span{font-size:12px;letter-spacing:.04em;color:#67809d;vertical-align:middle;margin-right:5px;}',
      '.bc-m01-card{padding:17px 20px;margin:0 0 10px;border:1px solid #dce3eb;border-radius:12px;background:#fff;box-shadow:0 1px 2px rgba(20,38,63,.02);}',
      '.bc-m01-card h3{margin:0 0 9px;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.075em;color:#385b80;}',
      '.bc-m01-card p{margin:0;font-size:16px;line-height:1.75;color:#27384e;}',
      '.bc-m01-card p+p{margin-top:10px;}',
      '.bc-m01-example{background:#edf8f2;border-left:4px solid #438b68;}',
      '.bc-m01-law{background:#fffaf0;border-left:4px solid #be9152;}',
      '.bc-m01-deeper{background:#f1f6fc;border-left:4px solid #6c87b2;}',
      '.bc-m01-trap{background:#fff8e3;border-left:4px solid #d5a62e;}',
      '.bc-m01-recall{background:#203b61;border-color:#203b61;}',
      '.bc-m01-recall h3,.bc-m01-recall p{color:#fff;}',
      '.bc-m01-reader[data-view="review"] .bc-m01-foundation,.bc-m01-reader[data-view="review"] .bc-m01-example,.bc-m01-reader[data-view="review"] .bc-m01-deeper{display:none;}',
      '.bc-m01-checklist{border-top:1px solid #d7e1eb;padding:22px 0;}',
      '.bc-m01-checklist h2{margin:0 0 8px;font-size:22px;color:#1d3657;}',
      '.bc-m01-checklist>p{font-size:14px;color:#5b6d82;line-height:1.5;}',
      '.bc-m01-checklist label{display:flex;align-items:flex-start;gap:12px;margin:7px 0;padding:12px 14px;background:#fff;border:1px solid #dce3eb;border-radius:10px;font-size:14px;line-height:1.4;cursor:pointer;}',
      '.bc-m01-checklist input{margin-top:2px;width:18px;height:18px;accent-color:#203b61;}',
      '.bc-m01-checklist .bc-m01-local-note{font-size:12px;color:#65788d;}',
      '@media(max-width:600px){.bc-m01-toolbar{gap:5px;padding:8px}.bc-m01-toolbar button{font-size:12px;padding:9px}.bc-m01-modes button{padding:8px 6px}.bc-m01-paper{padding-top:18px;width:calc(100% - 22px)}.bc-m01-card{padding:14px 15px}.bc-m01-card p{font-size:15px;line-height:1.7}.bc-m01-topic{margin-bottom:30px}}',
      '@media(prefers-reduced-motion:reduce){.bc-m01-scroll{scroll-behavior:auto}}'
    ].join('\n');
    document.head.appendChild(style);
  }
  css();
  document.addEventListener('click',scheduleMount,true);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true}); else mount();
  const observer = new MutationObserver(scheduleMount);
  observer.observe(document.body || document.documentElement,{childList:true,subtree:true});
  global.BcCfM01GuidedPilot = Object.freeze({open:open,close:close,subjects:SUBJECTS.length});
})(window);
