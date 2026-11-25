/* Base Completa — "Revisão" no padrão visual do Direito Constitucional (apostila teórica).
   Só marca o leitor aberto; todo o desenho está em revisao-padrao-cf-v1.css. Não altera conteúdo nem progresso. */
(function (global) {
  'use strict';
  if (global.BCRevisaoPadraoCF) return;
  const CLASS = 'bc-rev-cf';
  const READERS = '.bc-native-reader-overlay,#centralPortugueseReader';
  function isReview(overlay) {
    const label = overlay.querySelector('.bc-native-reader-title small,.bc-native-reader-head small,.pt-doc-eyebrow')?.textContent || '';
    return /revis|resumid/i.test(label);
  }
  /* ---- Lei seca recolhível na Revisão (Administrativo, Penal e Processo Penal) ---------------------------
     Mesmo gesto do Constitucional: logo depois do assunto que cita o artigo, "▸ Ver lei seca — CP, art. 59 e mais 2",
     fechado. O vínculo é feito pelas citações do próprio texto ("CP, art. 59", "Constituição Federal — artigo 37").
     Usa os textos legais já existentes na Teoria completa; sem acesso a eles, nada aparece (sem erro). */
  // Arquivos por módulo, só com a redação oficial (liberados à Revisão do plano Gratuito).
  const LEI_DEFAULT = { penal: 'cp', cpp: 'cpp', adm: '' };
  const LEI_VERSION = '20261115rev1';
  const SHORT = { cf: 'CF/88', cp: 'CP', cpp: 'CPP' };
  const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const norm = t => String(t || '').replace(/\s+/g, ' ').trim();
  function identify(text) {
    const t = String(text || '').toUpperCase();
    const m = t.match(/DIREITO\s+(ADMINISTRATIVO|PROCESSUAL PENAL|PENAL)\s*[·•-]\s*M[ÓO]DULO\s*(\d{1,2})/);
    if (!m) return null;
    return { disc: m[1] === 'ADMINISTRATIVO' ? 'adm' : m[1] === 'PENAL' ? 'penal' : 'cpp', n: Number(m[2]) };
  }
  // Sinônimos com que o texto costuma chamar cada norma.
  function lawPattern(item) {
    const known = { cf: /constitui[çc][ãa]o|\bCF\b|\bCRFB\b/i, cp: /c[óo]digo penal|\bCP\b/i, cpp: /c[óo]digo de processo penal|\bCPP\b/i, cc: /c[óo]digo civil|\bCC\b/i, cpc: /c[óo]digo de processo civil|\bCPC\b/i };
    if (known[item.law]) return known[item.law];
    const digits = String(item.law).match(/\d+/);
    if (digits) { const d = digits[0]; const spaced = d.length > 3 ? d.slice(0, -3) + '\\.?' + d.slice(-3) : d; return new RegExp('(?<!\\d)' + spaced + '(?!\\d)'); }
    const name = norm(String(item.label).split(/\s[—-]\s|·/)[0]).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return name.length > 3 ? new RegExp(name, 'i') : null;
  }
  // Pares {pos, refs[]} para cada "art./arts./artigo(s)" do texto (inteiros, com sufixo -A etc.; ignora § e incisos).
  function articleCitations(text) {
    const out = [], re = /\bart(?:igos?|s?\.?)\s*((?:\d{1,4}(?:\.\d{3})?\s*[ºo°]?(?:\s*-\s*[A-Z])?(?:\s*(?:,|;|e|ou|a|ao|à|até|–|—|e\/ou)\s*(?:§\s*\d+\s*[ºo°]?\s*,?\s*|[IVXLC]{1,6}\s*,?\s*|(?:inc(?:iso)?s?\.?|par[áa]grafo|caput|al[íi]nea)\s*[a-zIVXLC0-9º°]*\s*,?\s*)*)?)+)/giu;
    let m;
    while ((m = re.exec(text))) {
      const refs = [];
      const nums = /(\d{1,4}(?:\.\d{3})?)\s*[ºo°]?(?:\s*-\s*([A-Z]))?/g;
      let x; const body = m[1];
      while ((x = nums.exec(body))) {
        const before = body.slice(Math.max(0, x.index - 2), x.index);
        if (/§\s*$/.test(before) || /§\s*\d*\s*$/.test(body.slice(0, x.index).slice(-6))) continue;
        refs.push(x[1].replace('.', '') + (x[2] ? '-' + x[2] : ''));
      }
      if (refs.length) out.push({ pos: m.index, end: m.index + m[0].length, refs });
    }
    return out;
  }
  // Quais dispositivos o texto de um bloco cita? defaultLaw: norma assumida quando só se diz "art. 59".
  function citedItems(text, items, defaultLaw) {
    const cites = articleCitations(text);
    if (!cites.length) return [];
    const pats = new Map();
    const result = [];
    items.forEach(item => {
      if (!pats.has(item.law)) pats.set(item.law, lawPattern(item));
      const pat = pats.get(item.law);
      const hit = cites.some(c => {
        if (!c.refs.includes(String(item.ref).replace(/^0+/, ''))) return false;
        const before = text.slice(Math.max(0, c.pos - 90), c.pos), after = text.slice(c.end, c.end + 70);
        if (pat) {
          // mesma norma citada logo antes ("CP, art. 59") ou logo depois ("art. 59 do Código Penal")
          if (new RegExp(pat.source, pat.flags.replace('g', '')).test(before.slice(-60)) || new RegExp(pat.source, pat.flags.replace('g', '')).test(after.slice(0, 50))) {
            // se outra norma conhecida está mais perto, não é esta
            return true;
          }
        }
        // sem norma por perto: vale a norma padrão da disciplina
        const anyLaw = /constitui[çc][ãa]o|\bCF\b|c[óo]digo|\bC[CP]P?\b|\bLei\s+(?:n[ºo°.]*\s*)?\d|Estatuto/i.test(before.slice(-40) + after.slice(0, 40));
        return !anyLaw && defaultLaw && item.law === defaultLaw;
      });
      if (hit) result.push(item);
    });
    return result;
  }
  function blockOf(head) {
    const nodes = [head];
    for (let el = head.nextElementSibling; el && !/^H[1-6]$/.test(el.tagName) && !el.querySelector?.('h1,h2,h3,h4'); el = el.nextElementSibling) nodes.push(el);
    return nodes;
  }
  function groupHtml(items) {
    const first = items[0], short = (SHORT[first.law] ? SHORT[first.law] + ', art. ' + first.ref : first.label.replace(/^Lei seca\s*·\s*/i, '').replace(/\s*[·—-]\s*Art\.?\s*/i, ', art. '));
    const more = items.length > 1 ? ' e mais ' + (items.length - 1) : '';
    return '<summary>Ver lei seca — ' + esc(short) + more + '</summary><div class="bc-rev-lei-body" data-empty="1"></div>';
  }
  function fillGroup(det, items) {
    const body = det.querySelector('.bc-rev-lei-body');
    if (!body || !body.dataset.empty) return;
    delete body.dataset.empty;
    body.innerHTML = items.map(it => '<div class="bc-rev-lei-art"><h5>' + esc(it.label.replace(/^Lei seca\s*·\s*/i, '')) + '</h5>' +
      it.paragraphs.map(p => '<p>' + esc(p) + '</p>').join('') +
      (it.url ? '<a href="' + esc(it.url) + '" target="_blank" rel="noopener noreferrer">Consultar fonte oficial</a>' : '') + '</div>').join('');
  }
  // Coloca a lei seca logo após cada trecho do texto que cita o artigo. Devolve quantos blocos receberam.
  function place(article, items, defaultLaw) {
    const heads = [...article.querySelectorAll('h2,h3,h4')].filter(h => !h.closest('.bc-native-internal-review') && !/Quest(ões|oes) Internas/i.test(h.textContent));
    let count = 0, chapterSeen = new Set(), chapter = null;
    const stop = [...article.querySelectorAll('h2')].find(h => /Quest(ões|oes) Internas/i.test(h.textContent));
    // texto introdutório antes do primeiro título também conta
    const lead = [];
    for (let el = article.firstElementChild; el && !/^H[1-6]$/.test(el.tagName); el = el.nextElementSibling) lead.push(el);
    const units = heads.map(h => ({ head: h, nodes: blockOf(h) }));
    units.forEach(u => {
      if (stop && (stop.compareDocumentPosition(u.head) & Node.DOCUMENT_POSITION_FOLLOWING)) return;
      if (u.head.tagName === 'H2') { chapter = u.head; chapterSeen = new Set(); }
      const text = u.nodes.map(n => n.textContent).join(' \n ');
      // listas de fontes e links oficiais não são "assunto": não recebem lei seca
      if (/^\s*(fontes?|refer[êe]ncias?|bibliografia|links?)\b/i.test(u.head.textContent) || (text.match(/https?:\/\//g) || []).length >= 2) return;
      const hits = citedItems(text, items, defaultLaw).filter(i => !chapterSeen.has(i.key));
      if (!hits.length) return;
      hits.forEach(i => chapterSeen.add(i.key));
      const det = document.createElement('details');
      det.className = 'bc-rev-lei-group';
      det.innerHTML = groupHtml(hits);
      det.addEventListener('toggle', () => { if (det.open) fillGroup(det, hits); });
      const last = u.nodes[u.nodes.length - 1];
      last.after(det);
      count++;
    });
    return count;
  }
  function loadScript(src, ready) {
    return new Promise((resolve, reject) => {
      if (ready()) return resolve();
      const tag = document.createElement('script'); tag.src = src;
      tag.onload = () => { tag.remove(); ready() ? resolve() : reject(new Error('vazio')); };
      tag.onerror = () => { tag.remove(); reject(new Error('indisponível')); };
      document.head.append(tag);
    });
  }
  async function itemsFor(info) {
    const read = () => global.BC_LEI_REVISAO && global.BC_LEI_REVISAO[info.disc] && global.BC_LEI_REVISAO[info.disc][info.n];
    await loadScript('/content/' + (info.disc === 'cpp' ? 'cpp' : info.disc) + '/lei-revisao/m' + String(info.n).padStart(2, '0') + '.js?v=' + LEI_VERSION, () => !!read());
    return (read() || []).filter(it => it && Array.isArray(it.paragraphs) && it.paragraphs.length);
  }
  async function attachLei(overlay) {
    if (overlay.dataset.bcLei) return;
    const info = identify(overlay.querySelector('.bc-native-reader-title small,.bc-native-reader-head small')?.textContent);
    if (!info) return;
    overlay.dataset.bcLei = 'pendente';
    try {
      const items = await itemsFor(info);
      const article = overlay.querySelector('.bc-native-article');
      if (!items.length || !article || article.querySelector('.bc-rev-lei-group')) { overlay.dataset.bcLei = 'vazio'; return; }
      const n = place(article, items, LEI_DEFAULT[info.disc] || '');
      overlay.dataset.bcLei = n ? 'ok' : 'sem-citacoes';
    } catch (e) { overlay.dataset.bcLei = 'indisponivel'; }
  }

  const REVIEW_CHECK_ITEMS = {
  "adm": [
    [
      "Sei explicar por que a Administração se submete a regras especiais.",
      "Distingo prerrogativas e sujeições do regime jurídico-administrativo.",
      "Consigo explicar os cinco princípios do LIMPE.",
      "Sei diferenciar motivação, finalidade, proporcionalidade, segurança jurídica e autotutela.",
      "Consigo identificar o princípio aplicável em um caso concreto.",
      "Sei relacionar os princípios estudados à legislação apresentada."
    ],
    [
      "Distingo Estado, governo, Administração, ente, órgão e entidade.",
      "Sei explicar a Administração Direta e a teoria do órgão.",
      "Distingo desconcentração, descentralização, outorga e delegação.",
      "Sei identificar como se criam as entidades da Administração Indireta.",
      "Distingo autarquias e fundações públicas.",
      "Distingo empresas públicas e sociedades de economia mista.",
      "Sei explicar a posição dos conselhos profissionais e a particularidade da OAB.",
      "Distingo agência reguladora e agência executiva.",
      "Consigo classificar a organização administrativa em um caso concreto."
    ],
    [
      "Sei identificar o que caracteriza um ato administrativo.",
      "Identifico os cinco elementos de validade.",
      "Distingo motivo, motivação e teoria dos motivos determinantes.",
      "Sei explicar os atributos do ato administrativo.",
      "Distingo ato vinculado, discricionário e mérito administrativo.",
      "Reconheço as principais classificações dos atos.",
      "Distingo perfeição, validade e eficácia.",
      "Distingo anulação, revogação e convalidação.",
      "Consigo identificar um vício e a solução adequada em um caso."
    ],
    [
      "Sei explicar poder-dever e seus limites.",
      "Reconheço o poder hierárquico.",
      "Distingo delegação e avocação.",
      "Reconheço o poder disciplinar e a necessidade de defesa.",
      "Distingo poder regulamentar e normativo.",
      "Sei explicar o poder de polícia, seus atributos e ciclo.",
      "Distingo vinculação e discricionariedade e seus limites.",
      "Distingo excesso de poder e desvio de finalidade.",
      "Consigo identificar o poder utilizado em um caso concreto."
    ],
    [
      "Sei explicar o conceito de agente público.",
      "Distingo as espécies de agentes públicos.",
      "Distingo cargo, emprego e função pública.",
      "Sei explicar o regime jurídico e o ingresso por concurso.",
      "Distingo nomeação, posse e exercício.",
      "Distingo provimento, vacância, remoção e redistribuição.",
      "Distingo estágio probatório, efetividade e estabilidade.",
      "Sei identificar direitos, deveres e responsabilidades dos agentes.",
      "Consigo reconhecer as regras e exceções de acumulação de cargos."
    ],
    [
      "Sei explicar a finalidade e o âmbito da Lei nº 9.784/1999.",
      "Identifico princípios, direitos e deveres no processo administrativo.",
      "Sei diferenciar instauração de ofício e a pedido.",
      "Distingo competência, delegação, avocação, impedimento e suspeição.",
      "Sei explicar a forma e a comunicação dos atos.",
      "Sei explicar a instrução e a produção de provas.",
      "Conheço o dever de decidir e motivar.",
      "Distingo anulação, revogação, convalidação e decadência.",
      "Distingo recurso e revisão administrativa.",
      "Consigo identificar os principais prazos e sua contagem."
    ],
    [
      "Sei explicar a finalidade da LINDB aplicada à Administração.",
      "Sei identificar a exigência de considerar consequências práticas no art. 20.",
      "Sei explicar invalidação e regularização no art. 21.",
      "Sei explicar a consideração das dificuldades reais do gestor no art. 22.",
      "Distingo transição e proteção da confiança nos arts. 23 e 24.",
      "Sei explicar o compromisso do art. 26.",
      "Reconheço as compensações previstas no art. 27.",
      "Distingo dolo e erro grosseiro no art. 28.",
      "Sei explicar consulta pública e previsibilidade nos arts. 29 e 30.",
      "Sei relacionar o Decreto nº 9.830/2019 à LINDB."
    ],
    [
      "Sei explicar por que a Administração está sujeita a controle.",
      "Distingo controle interno, externo e os momentos de fiscalização.",
      "Distingo controle administrativo, anulação e revogação.",
      "Sei explicar a função do controle interno.",
      "Sei explicar o controle externo do Legislativo.",
      "Identifico competências dos Tribunais de Contas.",
      "Reconheço os limites do controle judicial.",
      "Sei explicar controle social e transparência.",
      "Consigo identificar o controle adequado em uma situação concreta.",
      "Sei relacionar as diferentes modalidades de controle."
    ],
    [
      "Distingo titularidade e execução do serviço público.",
      "Distingo prestação direta, concessão e permissão.",
      "Identifico poder concedente, concessionária e usuário.",
      "Sei explicar serviço adequado e continuidade.",
      "Conheço os direitos e deveres do usuário.",
      "Relaciono tarifa, modicidade e equilíbrio econômico-financeiro.",
      "Sei explicar licitação, edital e contrato de concessão.",
      "Reconheço fiscalização, responsabilidade e bens reversíveis.",
      "Distingo intervenção, encampação e caducidade.",
      "Consigo aplicar os conceitos de concessão a um caso."
    ],
    [
      "Sei explicar a finalidade e o âmbito das PPPs.",
      "Distingo concessão comum, patrocinada e administrativa.",
      "Distingo contraprestação pública e aporte.",
      "Reconheço os requisitos de valor, prazo e objeto.",
      "Sei explicar repartição de riscos e garantias contratuais.",
      "Reconheço exigências de planejamento, consulta e licitação.",
      "Sei explicar garantias e Sociedade de Propósito Específico.",
      "Reconheço mecanismos de fiscalização e limites fiscais.",
      "Sei explicar problemas de execução e encerramento.",
      "Consigo identificar as características de uma PPP em um caso.",
      "Relaciono qualidade do serviço e planejamento contínuo.",
      "Reconheço os termos essenciais da Lei nº 11.079/2004."
    ],
    [
      "Sei explicar a finalidade do MROSC.",
      "Sei identificar uma organização da sociedade civil.",
      "Distingo termo de colaboração, termo de fomento e acordo de cooperação.",
      "Sei explicar a função do plano de trabalho.",
      "Reconheço chamamento público e hipóteses de exceção.",
      "Sei explicar os requisitos e a formalização da parceria.",
      "Reconheço regras de execução, recursos e responsabilidades.",
      "Distingo gestor e comissão de monitoramento.",
      "Sei explicar prestação de contas, resultados e sanções.",
      "Consigo acompanhar as etapas de uma parceria em um caso.",
      "Reconheço o vocabulário essencial da lei."
    ],
    [
      "Sei explicar a posição do Terceiro Setor.",
      "Reconheço organização social e contrato de gestão.",
      "Reconheço OSCIP e termo de parceria.",
      "Distingo OS e OSCIP.",
      "Identifico Sistema S e fundações de apoio.",
      "Sei explicar o controle dos recursos públicos no Terceiro Setor.",
      "Distingo consórcio público de convênio e associação privada.",
      "Sei explicar a criação e natureza jurídica dos consórcios.",
      "Distingo contrato de rateio e contrato de programa.",
      "Reconheço alteração, retirada e extinção do consórcio.",
      "Consigo distinguir cooperação com entidades privadas e consórcios em um caso.",
      "Reconheço os principais termos do módulo."
    ],
    [
      "Distingo ilegalidade, improbidade e corrupção.",
      "Sei explicar dolo e sujeitos responsabilizáveis.",
      "Identifico enriquecimento ilícito do art. 9º.",
      "Identifico lesão ao erário do art. 10.",
      "Reconheço as hipóteses de violação de princípios do art. 11.",
      "Distingo as sanções das três categorias de improbidade.",
      "Sei explicar apuração, ação e acordo de não persecução civil.",
      "Reconheço regras de prescrição e ressarcimento.",
      "Sei explicar aplicação temporal e independência das esferas.",
      "Consigo distinguir irregularidade e improbidade em um caso."
    ],
    [
      "Sei explicar conceito e finalidade da licitação.",
      "Reconheço o âmbito da Lei nº 14.133/2021.",
      "Distingo princípios e objetivos da licitação.",
      "Identifico agentes, licitante, objeto e documentos.",
      "Distingo as cinco modalidades.",
      "Distingo modalidade e critério de julgamento.",
      "Sei ordenar as fases da licitação.",
      "Reconheço transparência, governança e gestão de riscos.",
      "Distingo procedimentos auxiliares e contratação direta.",
      "Consigo aplicar a lógica da licitação em um caso."
    ],
    [
      "Sei explicar a função da fase preparatória.",
      "Relaciono necessidade pública e Plano de Contratações Anual.",
      "Sei explicar o Estudo Técnico Preliminar.",
      "Distingo Termo de Referência, anteprojeto e projetos.",
      "Reconheço quantificação, padronização e parcelamento.",
      "Distingo pesquisa de preços, sobrepreço e inexequibilidade.",
      "Sei explicar gestão de riscos e sustentabilidade.",
      "Relaciono modalidade, critério, edital e controle preparatório.",
      "Consigo ordenar o planejamento de uma contratação em um caso."
    ],
    [
      "Sei ordenar as fases gerais da licitação.",
      "Sei escolher a modalidade a partir do objeto.",
      "Distingo critérios de julgamento.",
      "Distingo modos aberto e fechado de disputa.",
      "Sei explicar julgamento, exequibilidade e desempate.",
      "Distingo julgamento e habilitação.",
      "Distingo recursos, adjudicação e homologação.",
      "Reconheço publicidade, PNCP e impugnação.",
      "Consigo acompanhar a seleção de um fornecedor em um caso."
    ],
    [
      "Sei explicar por que a contratação direta exige fundamento.",
      "Distingo dispensa e inexigibilidade.",
      "Sei explicar a instrução da contratação direta do art. 72.",
      "Reconheço hipóteses de inexigibilidade do art. 74.",
      "Sei identificar a dispensa por valor e evitar fracionamento indevido.",
      "Distingo emergência, licitação deserta e fracassada.",
      "Sei explicar publicidade, controle e responsabilização.",
      "Consigo identificar a hipótese e instrução adequada em um caso."
    ],
    [
      "Sei explicar as características do contrato administrativo.",
      "Reconheço formalização e publicidade do contrato.",
      "Distingo duração, vigência e prorrogação.",
      "Distingo funções de fiscal, gestor e contratado.",
      "Sei explicar garantias e matriz de riscos.",
      "Distingo alterações unilaterais e consensuais e seus limites.",
      "Distingo reajuste, repactuação e revisão.",
      "Distingo recebimento, pagamento e controle da qualidade.",
      "Reconheço sanções e devido processo.",
      "Distingo extinção, nulidade e encerramento.",
      "Consigo acompanhar a execução contratual em um caso."
    ],
    [
      "Sei explicar finalidade e âmbito da LAI.",
      "Distingo transparência ativa e passiva.",
      "Sei identificar os requisitos de um pedido de acesso.",
      "Conheço regras de resposta, prazos, custo e negativa.",
      "Sei explicar o recurso administrativo.",
      "Reconheço hipóteses e graus de sigilo.",
      "Sei distinguir acesso à informação e proteção da intimidade.",
      "Reconheço deveres de guarda e transparência.",
      "Consigo aplicar as regras da LAI em um caso."
    ],
    [
      "Distingo dados pessoais, sensíveis e operações de tratamento.",
      "Distingo titular, controlador, operador e encarregado.",
      "Reconheço os princípios do art. 6º da LGPD.",
      "Sei explicar bases legais de tratamento.",
      "Identifico os direitos do titular.",
      "Reconheço regras de tratamento pelo Poder Público.",
      "Sei explicar segurança da informação e incidentes.",
      "Identifico o papel da ANPD e as sanções.",
      "Sei conciliar LAI e LGPD.",
      "Consigo aplicar a proteção de dados em um caso."
    ]
  ],
  "cpp": [
    [
      "Sei explicar a finalidade do processo penal.",
      "Distingo os sistemas processuais e reconheço o modelo acusatório.",
      "Identifico os princípios e garantias processuais.",
      "Sei explicar a função do juiz das garantias.",
      "Reconheço fontes, interpretação e limites do processo penal."
    ],
    [
      "Sei explicar a aplicação da lei processual penal no espaço.",
      "Sei identificar a aplicação da lei nova a processos em andamento.",
      "Distingo normas processuais, materiais e mistas.",
      "Distingo interpretação e integração.",
      "Reconheço a influência do direito internacional e da especialidade procedimental."
    ],
    [
      "Sei explicar a natureza e finalidade do inquérito.",
      "Reconheço as formas de instauração do inquérito.",
      "Sei explicar indiciamento, prazos e relatório.",
      "Reconheço direitos da defesa, acesso aos autos e diligências.",
      "Distingo arquivamento e retomada da investigação."
    ],
    [
      "Sei explicar ação penal e justa causa.",
      "Distingo ação pública condicionada e incondicionada.",
      "Reconheço princípios da ação penal privada.",
      "Identifico princípios e condições da acusação.",
      "Sei explicar o acordo de não persecução penal."
    ],
    [
      "Sei explicar a função e imparcialidade do juiz.",
      "Distingo Ministério Público e assistência à acusação.",
      "Reconheço as funções do acusado e da defesa.",
      "Distingo assistentes técnicos, peritos e auxiliares.",
      "Distingo ofendido e testemunhas."
    ],
    [
      "Distingo jurisdição e competência.",
      "Sei identificar a regra do lugar da infração.",
      "Distingo conexão e continência.",
      "Distingo competência absoluta, relativa e suas nulidades.",
      "Reconheço prerrogativa de função e juiz natural."
    ],
    [
      "Sei explicar o que é uma questão incidental.",
      "Reconheço exceções processuais e objeções.",
      "Distingo incidente de falsidade e insanidade mental.",
      "Sei explicar restituição de coisas apreendidas.",
      "Reconheço a finalidade das medidas assecuratórias."
    ],
    [
      "Sei explicar a finalidade das nulidades processuais.",
      "Distingo nulidade absoluta e relativa.",
      "Reconheço instrumentalidade, convalidação e aproveitamento.",
      "Sei identificar o momento de arguir nulidade.",
      "Reconheço a importância da defesa efetiva e os limites da invalidação."
    ],
    [
      "Sei explicar a finalidade dos atos processuais.",
      "Distingo prazos processuais e materiais penais.",
      "Identifico termo inicial e ciência válida.",
      "Distingo preclusão, restituição e justa causa.",
      "Reconheço a importância dos registros e do contraditório nas audiências."
    ],
    [
      "Distingo citação e intimação.",
      "Reconheço citação pessoal e por precatória.",
      "Distingo citação por edital e por hora certa.",
      "Identifico regras de intimação da defesa e das instituições.",
      "Sei reconhecer nulidades e aproveitamento dos atos."
    ],
    [
      "Sei identificar estrutura e fundamentação da sentença.",
      "Reconheço as hipóteses de absolvição.",
      "Sei explicar condenação e individualização.",
      "Distingo emendatio e mutatio libelli.",
      "Reconheço efeitos, publicação e correções da sentença."
    ],
    [
      "Distingo prova e elemento informativo.",
      "Reconheço prova ilícita e cadeia de custódia.",
      "Distingo perícia, documentos e testemunhas.",
      "Sei explicar os cuidados com reconhecimento de pessoas.",
      "Reconheço buscas, interceptações e meios especiais de prova."
    ],
    [
      "Sei explicar a finalidade das medidas cautelares.",
      "Distingo modalidades de flagrante.",
      "Reconheço o auto de prisão e os direitos da pessoa presa.",
      "Sei explicar a audiência de custódia e suas decisões.",
      "Reconheço a necessidade de avaliar riscos concretos."
    ],
    [
      "Sei identificar os pressupostos da prisão preventiva.",
      "Reconheço proporcionalidade e revisão da prisão.",
      "Identifico medidas cautelares diversas da prisão.",
      "Distingo prisão temporária e domiciliar.",
      "Sei explicar liberdade provisória e fiança."
    ],
    [
      "Sei identificar o rito aplicável.",
      "Distingo recebimento, rejeição e resposta à acusação.",
      "Reconheço absolvição sumária e saneamento.",
      "Sei ordenar os atos da audiência.",
      "Sei explicar alegações finais e sentença."
    ],
    [
      "Reconheço competência e princípios do Tribunal do Júri.",
      "Sei explicar a primeira fase do procedimento.",
      "Distingo pronúncia, impronúncia, absolvição sumária e desclassificação.",
      "Sei explicar o plenário e o Conselho de Sentença.",
      "Reconheço recursos e limites da soberania dos veredictos."
    ],
    [
      "Sei explicar por que existem procedimentos especiais.",
      "Reconheço a estrutura procedimental da Lei de Drogas.",
      "Reconheço a proteção da vítima na violência doméstica.",
      "Identifico os demais ritos abordados na revisão.",
      "Sei distinguir a aplicação da regra especial e da geral."
    ],
    [
      "Sei identificar o procedimento especial estudado.",
      "Sei explicar a defesa preliminar e sua finalidade.",
      "Distingo recebimento da acusação e defesa posterior.",
      "Reconheço o alcance da Súmula 330.",
      "Sei distinguir o procedimento dos demais regimes de responsabilidade estudados."
    ],
    [
      "Sei explicar natureza e função dos recursos.",
      "Reconheço princípios de cabimento e impugnação.",
      "Identifico admissibilidade e interesse recursal.",
      "Distingo efeitos e limites do julgamento.",
      "Distingo renúncia e desistência recursal."
    ],
    [
      "Reconheço o recurso em sentido estrito.",
      "Sei explicar apelação e devolução do julgamento.",
      "Distingo embargos de declaração e infringentes.",
      "Reconheço particularidades dos recursos excepcionais.",
      "Identifico os demais instrumentos e prazos apresentados na revisão."
    ],
    [
      "Reconheço competência e princípios dos Juizados Especiais Criminais.",
      "Sei explicar o termo circunstanciado.",
      "Distingo composição civil dos danos e representação.",
      "Distingo transação penal e suspensão condicional do processo.",
      "Reconheço o rito sumaríssimo e seus recursos."
    ],
    [
      "Sei explicar a finalidade do habeas corpus.",
      "Reconheço cabimento, autoridade coatora e competência.",
      "Distingo liminar e decisão final.",
      "Sei explicar revisão criminal e coisa julgada.",
      "Reconheço mandado de segurança criminal e os outros instrumentos estudados."
    ]
  ]
};
  REVIEW_CHECK_ITEMS.cpc = [
  [
    "Distingo direito ao processo justo e resultado favorável no julgamento.",
    "Sei explicar iniciativa da parte, impulso oficial e soluções consensuais.",
    "Reconheço contraditório e vedação à decisão surpresa.",
    "Sei identificar as situações de contraditório diferido.",
    "Sei explicar a aplicação da lei processual no tempo."
  ],
  [
    "Sei explicar o direito de ação sem confundi-lo com o resultado do processo.",
    "Distingo legitimidade e julgamento do mérito.",
    "Distingo jurisdição, processo e procedimento.",
    "Distingo extinção sem mérito e improcedência.",
    "Sei explicar a cooperação jurídica internacional estudada."
  ],
  [
    "Sei explicar a finalidade das regras de competência.",
    "Distingo competência absoluta e relativa.",
    "Reconheço os limites do foro de eleição.",
    "Sei identificar conexão e reunião de processos.",
    "Sei explicar a finalidade do conflito de competência."
  ],
  [
    "Distingo capacidade de ser parte e representação processual.",
    "Sei identificar a regularização de defeitos de representação.",
    "Reconheço deveres processuais e litigância de má-fé.",
    "Sei explicar gratuidade, despesas e honorários.",
    "Reconheço os limites dos poderes do advogado."
  ],
  [
    "Sei identificar as hipóteses de litisconsórcio.",
    "Distingo litisconsórcio necessário e unitário.",
    "Sei explicar a assistência de terceiro.",
    "Distingo denunciação da lide e chamamento ao processo.",
    "Distingo desconsideração da personalidade jurídica e amicus curiae."
  ],
  [
    "Sei explicar os poderes e a imparcialidade do juiz.",
    "Distingo as funções do perito e do juiz.",
    "Reconheço a atuação do Ministério Público no processo.",
    "Distingo Advocacia Pública e Defensoria Pública.",
    "Sei identificar a função dos sujeitos processuais em um caso."
  ],
  [
    "Sei explicar a finalidade e a forma dos atos processuais.",
    "Reconheço os limites dos negócios processuais e do calendário.",
    "Distingo sentença, decisão interlocutória e despacho.",
    "Sei identificar o termo inicial e a contagem dos prazos.",
    "Distingo indisponibilidade do sistema judicial e problema particular de conexão."
  ],
  [
    "Distingo citação e intimação.",
    "Reconheço os meios de comunicação processual estudados.",
    "Sei explicar os efeitos da citação válida.",
    "Reconheço quando o comparecimento espontâneo supre a citação.",
    "Sei analisar nulidades e prejuízo processual."
  ],
  [
    "Sei explicar a finalidade e a provisoriedade da tutela provisória.",
    "Distingo tutela cautelar e antecipada.",
    "Sei identificar as formas do pedido e a estabilização da tutela.",
    "Distingo tutela de urgência e da evidência.",
    "Consigo escolher a tutela adequada em um caso concreto."
  ],
  [
    "Sei identificar a formação da demanda e os requisitos da petição inicial.",
    "Distingo pedido certo e determinado.",
    "Distingo emenda, indeferimento e julgamento de mérito.",
    "Reconheço as regras da audiência de conciliação.",
    "Distingo suspensão e extinção do processo."
  ],
  [
    "Distingo defesa processual e defesa de mérito.",
    "Reconheço os efeitos e limites da revelia.",
    "Distingo contestação e reconvenção.",
    "Sei identificar quando cabe julgamento antecipado parcial.",
    "Sei explicar a finalidade do saneamento."
  ],
  [
    "Sei explicar a finalidade da prova processual.",
    "Reconheço a distribuição e a redistribuição do ônus da prova.",
    "Sei identificar os meios de prova adequados e sua comunhão.",
    "Reconheço as hipóteses de produção antecipada da prova.",
    "Sei explicar valoração da prova e fundamentação judicial."
  ],
  [
    "Distingo decisão com e sem resolução do mérito.",
    "Sei identificar os requisitos e limites da fundamentação.",
    "Reconheço a finalidade da remessa necessária.",
    "Sei explicar os limites da coisa julgada.",
    "Distingo liquidação e rediscussão do mérito."
  ],
  [
    "Distingo cumprimento de sentença e execução de título extrajudicial.",
    "Reconheço o procedimento de pagamento voluntário estudado.",
    "Sei explicar impugnação ao cumprimento de sentença.",
    "Distingo cumprimento definitivo e provisório.",
    "Sei identificar as medidas adequadas a diferentes obrigações."
  ],
  [
    "Sei identificar o recurso cabível a partir do pronunciamento judicial.",
    "Reconheço requisitos de admissibilidade recursal.",
    "Sei explicar a finalidade dos embargos de declaração.",
    "Distingo recurso especial e extraordinário.",
    "Sei identificar a aplicação adequada dos precedentes."
  ],
  [
    "Sei identificar os requisitos de um título executivo.",
    "Sei explicar a finalidade da execução e seus limites.",
    "Reconheço os limites da responsabilidade patrimonial.",
    "Distingo execução para entrega de coisa e para pagamento.",
    "Reconheço os regimes especiais de execução estudados."
  ],
  [
    "Sei explicar o início da execução por quantia.",
    "Distingo penhora e expropriação.",
    "Reconheço as regras de impenhorabilidade estudadas.",
    "Sei explicar embargos à execução e seus efeitos.",
    "Reconheço suspensão e prescrição intercorrente."
  ],
  [
    "Sei identificar o procedimento especial adequado ao problema.",
    "Sei explicar a finalidade da consignação em pagamento.",
    "Reconheço o cabimento dos embargos de terceiro.",
    "Distingo ação monitória e execução.",
    "Sei explicar a finalidade da restauração de autos."
  ],
  [
    "Distingo direitos difusos, coletivos e individuais homogêneos.",
    "Reconheço os legitimados das ações coletivas estudadas.",
    "Distingo mandado de segurança e mandado de injunção.",
    "Sei explicar o cabimento do habeas data.",
    "Distingo ação popular e ações de controle de constitucionalidade."
  ],
  [
    "Distingo recursos e outros procedimentos nos tribunais.",
    "Distingo IAC e IRDR.",
    "Sei explicar a finalidade do conflito de competência e da arguição constitucional estudada.",
    "Reconheço a finalidade e os limites da ação rescisória.",
    "Sei explicar as hipóteses de reclamação estudadas."
  ]
];
  // Somente fontes do próprio material de revisão: jamais consultar a teoria completa.
  function reviewChecklistSource(overlay) {
    if (!isReview(overlay)) return null;
    const article = overlay.querySelector('.bc-native-article');
    if (!article?.querySelectorAll) return null;
    const label = overlay.querySelector('.bc-native-reader-title small,.bc-native-reader-head small')?.textContent || '';
    const info = identify(label);
    const cpc = article.querySelector('.cpc-didactic-review[data-cpc-review]');
    let disc, n, headings;
    if (cpc && article.querySelector('[data-cpc-apostila="summary"]')) {
      disc = 'cpc'; n = Number(cpc.dataset.cpcReview);
      headings = [...cpc.querySelectorAll('.cpc-study-step > summary > strong')];
    } else if (info?.disc === 'adm' || info?.disc === 'cpp') {
      disc = info.disc; n = info.n;
      const source = article.querySelector(disc === 'adm' ? '.adm-author-reading' : '.bc-apostila-teoria');
      if (!source) return null;
      headings = [...source.querySelectorAll('h2')].filter(h => /^\s*\d{1,2}(?:[.)]|\s|—|–)/.test(h.textContent));
    } else return null;
    const max = disc === 'cpp' ? 22 : 20;
    if (!Number.isInteger(n) || n < 1 || n > max) return null;
    const items = [...new Set(headings.map(h => norm(h.textContent)
      .replace(/^\d{1,2}(?:[.)]|\s|—|–)+\s*/, '')
      .replace(/[.?!]+$/, '').trim()).filter(Boolean))];
    const curated = REVIEW_CHECK_ITEMS[disc]?.[n - 1];
    const statements = curated?.length === items.length ? curated : items.map(topic => 'Consigo explicar, com minhas palavras: ' + topic + '.');
    return items.length ? { article, disc, n, items: statements } : null;
  }
  function attachChecklist(overlay) {
    const data = reviewChecklistSource(overlay);
    if (!data) return false;
    const { article, disc, n, items } = data;
    const signature = JSON.stringify(items);
    const previous = article.querySelector('[data-bc-review-comprehension]');
    if (previous?.dataset.signature === signature && previous === article.lastElementChild) return true;
    const doc = article.ownerDocument;
    const key = 'bc:' + disc + ':m' + String(n).padStart(2, '0') + ':revisao:compreensao:v1';
    let state = Object.create(null);
    try {
      const saved = JSON.parse(global.localStorage.getItem(key) || '{}');
      if (saved && typeof saved === 'object' && !Array.isArray(saved)) Object.assign(state, saved);
    } catch (_) {}
    // Remover apenas checagens antigas explicitamente identificadas como checklist de compreensão.
    // Os controles de questões e progresso por capítulo não são checklists de compreensão.
    article.querySelectorAll('[data-bc-review-comprehension],.bc-apostila-checklist,.bc-m01-checklist,.cf-native-checklist').forEach(el => el.remove());
    const details = doc.createElement('details');
    details.className = 'bc-apostila-checklist bc-revision-comprehension';
    details.dataset.bcReviewComprehension = disc + ':' + n;
    details.dataset.signature = signature;
    const summary = doc.createElement('summary');
    summary.textContent = 'Minha checagem de compreensão';
    const section = doc.createElement('section');
    section.className = 'bc-m01-checklist';
    section.setAttribute('aria-label', 'Checklist de compreensão');
    const heading = doc.createElement('h2'); heading.textContent = 'Checklist de compreensão';
    const intro = doc.createElement('p'); intro.textContent = 'Marque apenas os assuntos que você já consegue explicar com suas palavras.';
    section.append(heading, intro);
    for (const topic of items) {
      const row = doc.createElement('label'), input = doc.createElement('input'), span = doc.createElement('span');
      input.type = 'checkbox'; input.checked = state[topic] === true;
      span.textContent = topic;
      input.addEventListener('change', () => {
        state[topic] = input.checked;
        try { global.localStorage.setItem(key, JSON.stringify(state)); } catch (_) {}
      });
      row.append(input, span); section.append(row);
    }
    const note = doc.createElement('p'); note.className = 'bc-m01-local-note';
    note.textContent = 'Checklist salvo neste navegador, sem alterar o progresso oficial do módulo.';
    section.append(note); details.append(summary, section); article.append(details);
    return true;
  }

  function mark(root) {
    const list = root.matches?.(READERS) ? [root] : [...(root.querySelectorAll?.(READERS) || [])];
    list.forEach(el => {
      const on = isReview(el);
      if (on !== el.classList.contains(CLASS)) el.classList.toggle(CLASS, on);
      if (on) attachChecklist(el);
      if (on && !el.dataset.bcLei) {
        // O leitor do Administrativo monta o texto de forma assíncrona: tenta até o artigo existir.
        let tries = 0;
        const ready = () => !!identify(el.querySelector('.bc-native-reader-title small,.bc-native-reader-head small')?.textContent) && !!el.querySelector('.bc-native-article h2');
        const wait = () => { if (ready()) attachLei(el); else if (tries++ < 40 && el.isConnected) setTimeout(wait, 250); };
        wait();
      }
    });
  }
  function start() {
    mark(document.body);
    new MutationObserver(records => {
      for (const r of records) {
        r.addedNodes.forEach(n => { if (n.nodeType === 1) mark(n); });
        const reader = r.target.closest?.(READERS);
        if (reader && reader.querySelector('.bc-native-article')) attachChecklist(reader);
        if (r.type === 'characterData' || r.type === 'attributes') { const o = r.target.parentElement?.closest?.(READERS); if (o) mark(o); }
      }
    }).observe(document.body, { childList: true, subtree: true });
  }
  global.BCRevisaoPadraoCF = { mark, citedItems, articleCitations, reviewChecklistSource, attachChecklist };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})(window);
