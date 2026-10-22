const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const strip = value => value.replace(/^(Exemplo explicado|Caso de comparação|Caso resolvido|Caso explicado|Aprofundamento jurisprudencial|Aprofundamento|Teste de compreensão|Resposta comentada|Guarde o essencial)\.\s*/, '');
const defaultSpecs = [
 ['Constituição e constitucionalismo','Organização do Estado e limitação do poder','A Constituição organiza o Estado, limita o poder e protege direitos.', 'A CF/88 organiza o Estado e protege direitos; os arts. 1º a 4º estabelecem seus princípios fundamentais. [1]', '“Uma lei posterior pode contrariar livremente a Constituição.” Errado: a data posterior não supera a hierarquia constitucional.', 'Constitucionalismo: limitação e proteção. Constituição: referência normativa fundamental.'],
 ['Concepções e elementos da Constituição','Classificações doutrinárias','Concepções mudam o olhar; elementos identificam a função dos conjuntos de normas.', 'As concepções e os elementos são classificações doutrinárias, não listas transcritas dos arts. 1º a 4º. Diferencie teoria e texto constitucional.', '“Se uma norma é elemento orgânico, ela é necessariamente de eficácia limitada.” Errado: função e eficácia são critérios distintos.', 'Lassalle: poder real. Schmitt: decisão. Kelsen: normatividade. Elementos: função das normas.'],
 ['Classificações da CF/88','Origem, forma, elaboração, estabilidade e finalidade','Cada adjetivo da CF/88 responde a um critério diferente.', 'O procedimento especial do art. 60 ajuda a compreender a rigidez; os objetivos do art. 3º ilustram o caráter dirigente. As categorias são doutrinárias. [1]', '“Rígida significa imutável.” Errado: a reforma é possível, sob procedimento e limites especiais.', 'Promulgada, escrita, codificada, dogmática, rígida, formal, analítica, dirigente e eclética.'],
 ['Supremacia e efeitos das normas','Validade, vigência, eficácia e efetividade; ADI 815','Estar em vigor, ser válido e funcionar na prática são perguntas diferentes.', 'A supremacia condiciona as normas inferiores. Na ADI 815, o STF afastou o controle de originárias por suposta hierarquia entre elas. Emendas se submetem ao art. 60. [1,2]', '“Baixa efetividade significa inexistência jurídica.” Errado: descumprimento não elimina a eficácia jurídica.', 'Validade: conformidade. Vigência: tempo. Eficácia: efeitos jurídicos. Efetividade: realização concreta.'],
 ['Eficácia plena, contida e limitada','Classificação de José Afonso da Silva','Descubra se a lei completa os efeitos principais ou restringe um direito já exercitável.', 'Art. 2º: exemplo de eficácia plena do comando básico. Art. 5º, XIII: liberdade profissional, exemplo de contida. Art. 37, VII: greve do servidor, exemplo clássico de limitada. [1]', '“Toda menção a lei torna a norma limitada.” Errado: é preciso identificar a função da lei.', 'Plena: núcleo completo. Contida: alcance restringível. Limitada: integração para efeitos principais, mas já vincula.'],
 ['Poder constituinte e reforma','Art. 60; organização dos entes; revisão do ADCT','O originário inaugura a ordem; o derivado atua dentro dos limites que ela estabeleceu.', 'Art. 60: cada Casa, dois turnos e três quintos dos membros; promulgação pelas Mesas. Limites circunstanciais e materiais não são dispensados pelo quórum. ADCT, art. 3º: revisão excepcional já exercida. [1]', '“A emenda aprovada com votos suficientes pode abolir a separação dos Poderes.” Errado: o limite material continua incidindo.', 'Originário cria. Derivado é condicionado. Cláusula pétrea impede reforma tendente a abolir o núcleo protegido.'],
 ['Recepção e mudança de ordem','Recepção, repristinação e desconstitucionalização','Uma nova Constituição não exige recriar toda lei anterior válida e compatível.', 'A recepção pode alterar o status formal, como no CTN no campo reservado à lei complementar. A LINDB, art. 2º, § 3º, afasta a restauração legislativa automática da lei revogada. [3,4]', '“Uma lei anterior só é recebida se tiver a mesma forma hoje exigida.” Errado: a mudança formal não impede sozinha a recepção.', 'Recepção: validade anterior e compatibilidade material. Repristinação legislativa: não automática. Desconstitucionalização: não presumida.'],
 ['Interpretação, mutação e Preâmbulo','Princípios interpretativos; ADI 2.076','Interpretar busca coerência; mutação muda sentido sem mudar redação.', 'Na ADI 2.076, o STF afastou a reprodução obrigatória da invocação de Deus no Preâmbulo estadual e sua força normativa autônoma. Isso não elimina direitos inscritos no corpo constitucional. [5]', '“O Preâmbulo precisa ser copiado pelos Estados.” Errado segundo a ADI 2.076.', 'Unidade e efetividade, com limites. Emenda: mudança formal. Mutação: mudança de sentido. Preâmbulo: sem comando autônomo.'],
 ['República, Federação e fundamentos','Arts. 1º e 18; soberania popular','A soberania pertence à República Federativa do Brasil; seus entes são autônomos.', 'Art. 1º: cinco fundamentos e origem popular do poder. Art. 18: União, Estados, DF e Municípios são autônomos nos termos constitucionais. A união é indissolúvel. [1]', '“A União é a própria República e os demais entes são soberanos.” Errado: União e RFB não se confundem; os entes têm autonomia.', 'República: governo. Federação: Estado. SO-CI-DI-VA-PLU: fundamentos. Poder emana do povo.'],
 ['Poderes, objetivos e relações internacionais','Arts. 2º, 3º e 4º','Fundamentos são bases; objetivos são fins; princípios internacionais orientam a atuação externa.', 'Art. 2º: independência e harmonia. Art. 3º: quatro objetivos. Art. 4º: dez princípios e integração econômica, política, social e cultural latino-americana. [1]', '“Dignidade é objetivo e desenvolvimento nacional é fundamento.” Errado: as classificações foram invertidas.', 'Art. 1º: bases. Art. 2º: Poderes. Art. 3º: fins. Art. 4º: relações internacionais.'],
];

export function renderGuidedM01({source, module, css, config = {}}) {
  const specs = config.specs || defaultSpecs;
  const code = config.code || 'M01';
  const title = config.title || 'Constituição, normas constitucionais e princípios fundamentais';
  const subtitle = config.subtitle || 'Teoria guiada + revisão inteligente. Entenda o assunto pela primeira vez e revise por blocos, sem precisar consultar dois materiais.';
  const introCopy = config.introCopy || 'Uma ideia simples, explicação orientada, exemplo, lei, aprofundamento, pegadinha, revisão e teste por tema.';
  const storage = config.storage || 'basecompleta-cf-m01-guiada-v2';
  const topicWord = config.topicWord || 'temas orientados';
  const sections = config.sections || {intro:'# Leitura orientada', percurso:'# Percurso do módulo', law:'# 11. Lei seca', lawEnd:'# 12. Dez questões', review:'# 15. Revisão ativa', reviewEnd:'# 16. Referências', references:'# 16. Referências', referencesEnd:'# Checklist de domínio'};
  const questionTitle = config.questionTitle || 'Dez questões de aplicação · 4F / 4M / 2D';
  const reviewTitle = config.reviewTitle || 'Cinco questões de revisão · 2F / 2M / 1D';
  const essential = config.essential || 'A Constituição organiza e limita. Plena aplica o núcleo; contida admite restrição; limitada exige integração para efeitos principais, mas já vincula. Originário cria; derivado reforma sob limites. Recepção exige validade anterior e compatibilidade material. República é governo; Federação é Estado; soberania é da RFB. Art. 1º: bases; art. 2º: Poderes; art. 3º: fins; art. 4º: relações internacionais.';
  const pairs = config.pairs || [['Constituição × constitucionalismo','Norma fundamental de organização e proteção × movimento de limitação do poder.'],['República × Federação','Forma de governo × forma de Estado.'],['Soberania × autonomia','Atributo da RFB × capacidades dos entes nos limites constitucionais.'],['Plena × contida × limitada','Núcleo completo × alcance restringível × integração para efeitos principais.'],['Originário × derivado','Cria a ordem × atua sob seus limites.'],['Emenda × mutação','Mudança formal × mudança de sentido sem alteração da redação.'],['Fundamentos × objetivos','Bases do art. 1º × fins do art. 3º.'],['Recepção × repristinação','Compatibilidade com nova Constituição × retorno de vigência da norma revogada.']];
  function section(a, b) {
    const start = source.indexOf(a), end = b ? source.indexOf(b, start + a.length) : source.length;
    if (start < 0 || end < 0) throw new Error(`Seção ausente: ${a}`);
    return source.slice(start, end).trim();
  }
  function md(text) {
    const lines = text.split('\n'); let out = '';
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      if (line.startsWith('|')) {
        const rows = [];
        while (i < lines.length && lines[i].trim().startsWith('|')) {
          const cells = lines[i].trim().slice(1, -1).split('|').map(s=>s.trim());
          if (!cells.every(s=>/^:?-+:?$/.test(s))) rows.push(cells);
          i++;
        }
        i--;
        const head = rows.shift();
        out += '<div class="compare">'+rows.map(row=>'<div class="comparecard"><small>'+esc(head[0])+'</small><b>'+esc(row[0])+'</b>'+row.slice(1).map((value,j)=>'<p><strong>'+esc(head[j+1])+':</strong> '+esc(value)+'</p>').join('')+'</div>').join('')+'</div>';
      } else if (/^#{1,3} /.test(line)) out += '<h4>'+esc(line.replace(/^#{1,3} /,''))+'</h4>';
      else if (line.startsWith('https://')) out += '<p><a href="'+esc(line)+'" target="_blank" rel="noopener noreferrer">Consultar fonte oficial ↗</a></p>';
      else if (line.startsWith('- ')) out += '<p>'+esc(line.slice(2))+'</p>';
      else out += '<p>'+esc(line)+'</p>';
    }
    return out;
  }
  const box = (type, label, content) => '<div class="box '+type+'"><h3>'+esc(label)+'</h3>'+content+'</div>';
  const label = n => String(n).padStart(2, '0');
  const themes = specs.map((spec,i)=>{
    const n=i+1, id=label(n);
    const original = section('# '+n+'. ', '# '+(n+1)+'. ').split('\n').slice(1).join('\n').trim();
    const groups={explain:[],example:[],deep:[],recap:[]};
    let prompt='', answer='';
    for (const block of original.split(/\n\n+/)) {
      if (block.startsWith('Teste de compreensão.')) prompt=strip(block);
      else if (block.startsWith('Resposta comentada.')) answer=strip(block);
      else if (/^(Exemplo explicado|Caso de comparação|Caso resolvido|Caso explicado)\./.test(block)) groups.example.push(strip(block));
      else if (block.startsWith('Aprofundamento.') || block.startsWith('Aprofundamento jurisprudencial.')) groups.deep.push(strip(block));
      else if (block.startsWith('Guarde o essencial.')) groups.recap.push(strip(block));
      else groups.explain.push(block);
    }
    if (!prompt || !answer) throw new Error('Tema sem teste: '+id);
    if (!groups.example.length) groups.example.push('Uma norma distribui competências entre órgãos: sua função é orgânica. Isso não responde, por si só, se sua eficácia é plena, contida ou limitada. Classifique separadamente a função e a aplicação.');
    if (!groups.deep.length) {
      const starts = n===4 ? ['Mas não conclua','Norma originária'] : n===10 ? ['Esses agrupamentos'] : [];
      groups.deep = groups.explain.filter(p=>starts.some(start=>p.startsWith(start)));
      groups.explain = groups.explain.filter(p=>!groups.deep.includes(p));
      if (!groups.deep.length && config.allowDeepFallback !== false && groups.explain.length > 1) groups.deep = [groups.explain.pop()];
      if (!groups.deep.length) throw new Error('Tema sem aprofundamento: '+id);
    }
    return '<section class="chapter" id="tema-'+id+'" data-id="'+id+'"><div class="chapter-head"><div class="chapter-number">TEMA '+id+' · CF '+esc(code)+'</div><h2>'+esc(spec[0])+'</h2><p class="chapter-sub">'+esc(spec[1])+'</p></div>'
      +box('core','Em uma frase','<p>'+esc(spec[2])+'</p>')
      +box('explain','01 · Entenda de verdade',groups.explain.map(md).join(''))
      +box('example','02 · Como funciona na prática',groups.example.map(md).join(''))
      +box('law','03 · O que diz a Constituição','<p>'+esc(spec[3])+'</p>')
      +box('deep','04 · Aprofundamento para ir além',groups.deep.map(md).join(''))
      +box('trap','05 · Pegadinha de prova','<p>'+esc(spec[4])+'</p>')
      +box('recap','06 · Revisão em 30 segundos',groups.recap.length ? groups.recap.map(md).join('') : '<p>'+esc(spec[5])+'</p>')
      +box('test','Teste rápido · Responda antes de conferir','<p>'+esc(prompt)+'</p><details><summary>Mostrar gabarito comentado</summary><p>'+esc(answer)+'</p></details><p class="printanswer"><b>Gabarito:</b> '+esc(answer)+'</p>')
      +'<div class="done-wrap noprint"><label class="done"><input class="chaptercheck" data-key="tema-'+id+'" type="checkbox"> Concluí este tema</label></div></section>';
  }).join('\n');
  const checks = [...source.matchAll(/^- \[ \] (.+)$/gm)].map(m=>m[1]);
  const checkId = (text,index) => {let h=2166136261;for(const ch of index+'|'+text)h=Math.imul(h^ch.charCodeAt(0),16777619)>>>0;return 'item-'+h.toString(36)};
  function quiz(mode,title) {
    return '<section class="finish" id="questoes-'+mode+'"><h2>'+title+'</h2><p>Questões autorais do CF '+esc(code)+'. Responda antes de abrir o comentário.</p>'+module.questions[mode].map((q,i)=>
      box('test','Questão '+q.n+' · '+q.difficulty,'<fieldset data-question="'+mode+'-'+i+'" data-answer="'+q.answer+'"><legend>'+esc(q.q)+'</legend>'+q.options.map((option,j)=>'<label class="quiz-choice"><input type="radio" name="'+mode+'-'+i+'" value="'+j+'"> <span>'+String.fromCharCode(65+j)+') '+esc(option)+'</span></label>').join('')+'<button type="button" class="toggle noprint" data-verify>Conferir resposta</button><p class="mini" data-feedback role="status" aria-live="polite"></p><details><summary>Mostrar gabarito comentado</summary><p>Gabarito: '+String.fromCharCode(65+q.answer)+'. '+esc(q.explanation)+'</p></details><p class="printanswer"><b>Gabarito: '+String.fromCharCode(65+q.answer)+'.</b> '+esc(q.explanation)+'</p></fieldset>')
    ).join('')+'</section>';
  }
  const intro=section(sections.intro,sections.percurso).replace(sections.intro,'').trim();
  const review=section(sections.review,sections.reviewEnd).split('\n').slice(1).join('\n');
  const lawGuide=section(sections.law,sections.lawEnd).split('\n').slice(1).join('\n');
  const references=section(sections.references,sections.referencesEnd).split('\n').slice(1).join('\n');
  const body = '<main class="shell"><header class="topbar"><div class="eyebrow">Base Completa / Direito Constitucional / CF '+esc(code)+'</div><h1>'+esc(title)+'</h1><p>'+esc(subtitle)+'</p><div class="topmeta"><span class="pill">'+specs.length+' '+esc(topicWord)+'</span><span class="pill">Lei + exemplo + prova</span><span class="pill">Revisão rápida</span></div></header>'
  +'<div class="toolbar noprint"><div class="toggles"><button type="button" class="toggle active" id="modeFull">Primeira leitura</button><button type="button" class="toggle" id="modeReview">Revisão rápida</button><button type="button" class="toggle" id="printModule">Imprimir / PDF</button></div><div class="toolbar-hint">Alterne o modo sem perder as marcações.</div></div>'
  +'<section class="intro"><h2>Como usar esta apostila</h2><p>'+esc(introCopy)+' Edição de trabalho, ainda não publicada na Central.</p><div class="path"><div class="pathcard"><b>Trilha de aprendizagem</b><span>Em uma frase → Entenda → Exemplo → Lei → Aprofundamento → Pegadinha → Teste.</span></div><div class="pathcard"><b>Trilha de revisão</b><span>Em uma frase → Lei → Pegadinha → Revisão em 30 segundos → Teste.</span></div></div><details class="reading-guide"><summary>Ver leitura orientada e roteiro de estudo</summary>'+md(intro)+'</details><div class="header-section" style="margin-top:20px"><h2 style="font-size:17px;margin:0">Navegue pelos temas</h2><span class="mini">Toque em qualquer assunto</span></div><nav class="toc">'+specs.map((s,i)=>'<a href="#tema-'+label(i+1)+'">'+label(i+1)+' · '+esc(s[0])+'</a>').join('')+'<a href="#questoes-complete">10 questões</a><a href="#questoes-summary">5 questões de revisão</a><a href="#fechamento">Checklist final</a></nav><div class="progressrow noprint"><b class="mini" id="progressLabel">0 de '+specs.length+' temas concluídos</b><div class="progress"><div class="progressbar" id="progressBar"></div></div><button type="button" class="toggle" id="resetProgress" style="padding:6px 10px">Limpar marcações</button></div><p id="storageWarning" class="mini" hidden>Este visualizador bloqueia o armazenamento local. As marcações funcionarão nesta sessão, mas poderão ser perdidas ao fechar.</p></section>'
  +themes+'<section class="finish" id="lei-seca"><h2>Lei seca e jurisprudência explicadas</h2>'+md(lawGuide)+'</section>'
  +quiz('complete',questionTitle)+quiz('summary',reviewTitle)
  +'<section class="finish" id="revisao-ativa"><h2>Revisão ativa</h2>'+md(review)+'</section>'
  +'<section class="finish" id="fechamento"><h2>Fechamento: não confunda</h2><p>Recupere a diferença que muda a resposta.</p><div class="compare">'+pairs.map(([a,b])=>'<div class="comparecard"><b>'+esc(a)+'</b><small>'+esc(b)+'</small></div>').join('')+'</div><h2 style="margin-top:25px">Checklist final de domínio</h2><p>Marque somente o que consegue explicar sem consultar. As marcações ficam <b>somente neste navegador</b>; este arquivo não sincroniza com a Central.</p><div class="finalcheck">'+checks.map((c,i)=>'<label><input type="checkbox" class="extraCheck" data-key="check-'+label(i+1)+'" data-legacy-key="'+checkId(c,i)+'"><span>'+esc(c)+'</span></label>').join('')+'</div><div class="progressrow noprint"><b class="mini" id="finalLabel">0 de '+checks.length+' marcados no checklist</b><div class="progress"><div class="progressbar" id="finalBar"></div></div></div>'
  +box('recap','O essencial em um minuto','<p>'+esc(essential)+'</p>')+'</section><section class="references"><h2 style="font-size:15px">Fontes oficiais e nota editorial</h2>'+md(references)+'<p class="webhint">Versão interativa sem conexão para leitura e exercícios. Links oficiais exigem rede. Sem login, envio de respostas ou sincronização.</p></section><div class="footer">Base Completa · Apostila CF '+esc(code)+' · Edição de trabalho · 2026</div></main>';
  const behavior = `
  (function(){
    const storage='${storage}'; let memory={}, persisted=true;
    try{const parsed=JSON.parse(localStorage.getItem(storage)||'{}');memory=parsed&&typeof parsed==='object'&&!Array.isArray(parsed)?parsed:{};localStorage.setItem(storage,JSON.stringify(memory))}catch(e){persisted=false}
    if(persisted&&!memory.migrated){try{const legacy=JSON.parse(localStorage.getItem('central-v6:cf-reader-checks:${module.number}:complete')||'{}');document.querySelectorAll('.extraCheck').forEach(c=>{if(legacy[c.dataset.legacyKey])memory[c.dataset.key]=true});memory.migrated=true;localStorage.setItem(storage,JSON.stringify(memory))}catch(e){}}
    const save=()=>{try{localStorage.setItem(storage,JSON.stringify(memory))}catch(e){persisted=false;document.getElementById('storageWarning').hidden=false}};
    const update=()=>{for(const [selector,label,bar,kind] of [['.chaptercheck','progressLabel','progressBar','temas concluídos'],['.extraCheck','finalLabel','finalBar','marcados no checklist']]){const inputs=[...document.querySelectorAll(selector)];let count=0;inputs.forEach(c=>{c.checked=!!memory[c.dataset.key];if(c.checked)count++});document.getElementById(label).textContent=count+' de '+inputs.length+' '+kind;document.getElementById(bar).style.width=(100*count/inputs.length)+'%'}};
    document.querySelectorAll('input[type=checkbox]').forEach(c=>c.addEventListener('change',()=>{memory[c.dataset.key]=c.checked;save();update()}));
    function change(review){document.body.classList.toggle('review-only',review);document.getElementById('modeFull').classList.toggle('active',!review);document.getElementById('modeReview').classList.toggle('active',review);document.getElementById('modeFull').setAttribute('aria-pressed',String(!review));document.getElementById('modeReview').setAttribute('aria-pressed',String(review));memory.mode=review?'review':'full';save()}
    document.getElementById('modeFull').onclick=()=>change(false);document.getElementById('modeReview').onclick=()=>change(true);document.getElementById('printModule').onclick=()=>window.print();
    document.getElementById('resetProgress').onclick=()=>{if(confirm('Limpar todas as marcações deste módulo neste navegador?')){Object.keys(memory).filter(k=>/^(tema-|check-)/.test(k)).forEach(k=>delete memory[k]);save();update()}};
    document.querySelectorAll('[data-question]').forEach(field=>{const key='answer-'+field.dataset.question,feedback=field.querySelector('[data-feedback]'),choices=[...field.querySelectorAll('input[type=radio]')];const show=value=>{feedback.textContent=value===Number(field.dataset.answer)?'Correto. Leia o comentário para conferir o raciocínio.':'Incorreto. Consulte o comentário e reveja o ponto que mudou a resposta.';field.querySelector('details').open=true};if(Number.isInteger(memory[key])){const saved=choices.find(c=>Number(c.value)===memory[key]);if(saved){saved.checked=true;show(memory[key])}}field.querySelector('[data-verify]').onclick=()=>{const selected=choices.find(c=>c.checked);if(!selected){feedback.textContent='Escolha uma alternativa antes de conferir.';return}memory[key]=Number(selected.value);save();show(memory[key])}});
    document.getElementById('storageWarning').hidden=persisted;update();change(memory.mode==='review');
  })();`;
  const extraCSS = '\n/* Complementos funcionais; a aparência dos temas usa o CSS do M02. */\n.reading-guide{margin-top:18px}.reading-guide>summary{cursor:pointer;color:var(--navy);font-weight:700}.box h4{font-size:15px;color:var(--navy);margin:18px 0 8px}.box h4:first-child{margin-top:0}.comparecard p{font-size:13px;margin:7px 0 0}.quiz-choice{display:flex;gap:9px;margin:10px 0;align-items:flex-start;cursor:pointer}.quiz-choice input{margin-top:6px;accent-color:var(--navy)}fieldset{border:0;padding:0;min-width:0}legend{font-weight:700;margin-bottom:12px}button:focus-visible,a:focus-visible,summary:focus-visible,input:focus-visible{outline:3px solid #365f84;outline-offset:3px}@media print{.quiz-choice input{appearance:auto}.reading-guide{display:none}}\n';
  return '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>CF '+esc(code)+' — Teoria Guiada + Revisão Inteligente | Base Completa</title><style>'+css.replaceAll('CF M02','CF '+code)+extraCSS+'</style></head><body>'+body+'<script>'+behavior+'</script></body></html>';
}
