/* Base Completa — siglas sempre com descrição nas disciplinas jurídicas.
   Na primeira ocorrência de cada texto: "Constituição Federal (CF)"; nas
   seguintes, a sigla mostra o nome completo ao tocar/passar o mouse (<abbr>).
   Só apresentação: o conteúdo salvo e a contagem de progresso não mudam.
   Siglas ambíguas (MP = Ministério Público/Medida Provisória, UFs etc.) ficam de fora. */
(function (g) {
  'use strict';
  if (g.CentralAcronyms) return;
  const GLOSSARY = {
    'CF/88': 'Constituição Federal de 1988', CF: 'Constituição Federal', CPC: 'Código de Processo Civil',
    CPP: 'Código de Processo Penal', CP: 'Código Penal', CC: 'Código Civil', CTN: 'Código Tributário Nacional',
    CLT: 'Consolidação das Leis do Trabalho', CDC: 'Código de Defesa do Consumidor',
    ECA: 'Estatuto da Criança e do Adolescente', LEP: 'Lei de Execução Penal',
    LINDB: 'Lei de Introdução às Normas do Direito Brasileiro', LGPD: 'Lei Geral de Proteção de Dados Pessoais',
    LAI: 'Lei de Acesso à Informação', LIA: 'Lei de Improbidade Administrativa',
    MROSC: 'Marco Regulatório das Organizações da Sociedade Civil', PPP: 'Parceria Público-Privada',
    OSCIP: 'Organização da Sociedade Civil de Interesse Público', OSC: 'Organização da Sociedade Civil',
    ANPD: 'Autoridade Nacional de Proteção de Dados', ETP: 'Estudo Técnico Preliminar',
    PNCP: 'Portal Nacional de Contratações Públicas', SRP: 'Sistema de Registro de Preços',
    PCA: 'Plano de Contratações Anual', SPE: 'Sociedade de Propósito Específico',
    LDO: 'Lei de Diretrizes Orçamentárias', LOA: 'Lei Orçamentária Anual', PPA: 'Plano Plurianual',
    PEC: 'Proposta de Emenda à Constituição', EC: 'Emenda Constitucional', LC: 'Lei Complementar',
    STF: 'Supremo Tribunal Federal', STJ: 'Superior Tribunal de Justiça', TST: 'Tribunal Superior do Trabalho',
    TSE: 'Tribunal Superior Eleitoral', STM: 'Superior Tribunal Militar', TCU: 'Tribunal de Contas da União',
    CNJ: 'Conselho Nacional de Justiça', CNMP: 'Conselho Nacional do Ministério Público',
    TRF: 'Tribunal Regional Federal', TJ: 'Tribunal de Justiça', OAB: 'Ordem dos Advogados do Brasil',
    ADI: 'Ação Direta de Inconstitucionalidade', ADC: 'Ação Declaratória de Constitucionalidade',
    ADO: 'Ação Direta de Inconstitucionalidade por Omissão', ADPF: 'Arguição de Descumprimento de Preceito Fundamental',
    HC: 'Habeas Corpus', RHC: 'Recurso Ordinário em Habeas Corpus', MS: 'Mandado de Segurança',
    MI: 'Mandado de Injunção', HD: 'Habeas Data', RE: 'Recurso Extraordinário', REsp: 'Recurso Especial',
    RESE: 'Recurso em Sentido Estrito', IRDR: 'Incidente de Resolução de Demandas Repetitivas',
    IAC: 'Incidente de Assunção de Competência', IP: 'Inquérito Policial', APF: 'Auto de Prisão em Flagrante',
    ANPP: 'Acordo de Não Persecução Penal', ANPC: 'Acordo de Não Persecução Cível',
    CPI: 'Comissão Parlamentar de Inquérito', DJEN: 'Diário de Justiça Eletrônico Nacional',
    RPV: 'Requisição de Pequeno Valor', RPPS: 'Regime Próprio de Previdência Social',
    RGPS: 'Regime Geral de Previdência Social', SV: 'Súmula Vinculante', DF: 'Distrito Federal',
    LIMPE: 'Legalidade, Impessoalidade, Moralidade, Publicidade e Eficiência', FCC: 'Fundação Carlos Chagas',
    ARP: 'Ata de Registro de Preços', PMI: 'Procedimento de Manifestação de Interesse', EP: 'Empresa Pública',
    PJ: 'Pessoa Jurídica', EIRELI: 'Empresa Individual de Responsabilidade Limitada',
    LCP: 'Lei das Contravenções Penais', RSE: 'Recurso em Sentido Estrito', CPM: 'Código Penal Militar',
    LEF: 'Lei de Execução Fiscal', JEC: 'Juizado Especial Cível', JECRIM: 'Juizado Especial Criminal',
    TCO: 'Termo Circunstanciado de Ocorrência', MPF: 'Ministério Público Federal', DPU: 'Defensoria Pública da União',
    AGU: 'Advocacia-Geral da União', PGR: 'Procurador-Geral da República', CGU: 'Controladoria-Geral da União'
  };
  // Siglas com mais de um significado: só são tratadas quando o próprio texto define o sentido.
  const CONTEXT = {
    MP: [[/medida[s]? provis[óo]ria|\bMPs?\s+n[ºo°]|editar\s+MP|convers[ãa]o\s+da\s+MP/i, 'Medida Provisória'],
         [/minist[ée]rio p[úu]blico|promotor|den[úu]ncia|a[çc][ãa]o penal|inqu[ée]rito|parquet/i, 'Ministério Público']],
    PF: [[/pessoa f[íi]sica|\bPJ\b/, 'Pessoa Física'], [/pol[íi]cia federal/i, 'Polícia Federal']],
    SEM: [[/\bEP\b|economia mista/, 'Sociedade de Economia Mista']],
    TR: [[/licita|\bETP\b|contrata[çc][ãa]o|anteprojeto/i, 'Termo de Referência']],
    CR: [[/\bSTJ\b|rogat[óo]ria/, 'Carta Rogatória']]
  };
  const KEYS = [...Object.keys(GLOSSARY), ...Object.keys(CONTEXT)].sort((a, b) => b.length - a.length).map(k => k.replace('/', '\\/'));
  // Sigla isolada (não parte de outra palavra, nem de "CF-88-x" ou identificadores).
  const PATTERN = new RegExp('(?<![\\p{L}\\p{N}_/.-])(' + KEYS.join('|') + ')(?![\\p{L}\\p{N}_-])', 'gu');
  const SUBJECTS = ['cf', 'penal', 'cpc', 'adm', 'civil', 'cpp'];
  const SKIP = 'script,style,textarea,input,select,button,code,pre,a,abbr,mark,svg,.bc-acr-full,[contenteditable="true"]';
  const seen = new WeakSet();
  const plain = text => String(text || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

  function containers() {
    const list = [...document.querySelectorAll('.bc-native-reader-overlay .bc-native-article, .cv-reader article, .cv-reader-content, .cpp-source, .adm-native-content')];
    SUBJECTS.forEach(id => document.querySelectorAll('#subjects .subject[data-id="' + id + '"] :is(.cf-module-body,.cv-module-body,.detail-panel,.cpp-mod-body,.civil-module-body)')
      .forEach(el => list.push(el)));
    return list.filter(el => el.isConnected);
  }

  function contextNames(root) {
    const text = root.textContent || '', names = {};
    for (const [key, rules] of Object.entries(CONTEXT)) {
      const hit = rules.filter(([re]) => re.test(text));
      if (hit.length === 1) names[key] = hit[0][1]; // dois sentidos possíveis no mesmo texto: não arrisca
    }
    return names;
  }
  function process(root) {
    const ctx = contextNames(root);
    const expanded = new Set([...root.querySelectorAll('.bc-acr-full')].map(el => el.dataset.acr));
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: node => seen.has(node) || !node.nodeValue.trim() || node.parentElement?.closest(SKIP) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
    });
    const nodes = [];
    for (let node = walker.nextNode(); node; node = walker.nextNode()) nodes.push(node);
    nodes.forEach(node => {
      const text = node.nodeValue;
      PATTERN.lastIndex = 0;
      if (!PATTERN.test(text)) { seen.add(node); return; }
      PATTERN.lastIndex = 0;
      const heading = !!node.parentElement.closest('h1,h2,h3,h4,h5,h6,summary,strong.title');
      const fragment = document.createDocumentFragment();
      let from = 0, match;
      while ((match = PATTERN.exec(text))) {
        const key = match[1], name = GLOSSARY[key] || ctx[key];
        if (!name) { fragment.append(text.slice(from, match.index + key.length)); from = match.index + key.length; continue; }
        fragment.append(text.slice(from, match.index));
        const before = plain(text.slice(Math.max(0, match.index - name.length - 6), match.index));
        const abbr = document.createElement('abbr');
        abbr.className = 'bc-acr'; abbr.title = name; abbr.textContent = key;
        abbr.tabIndex = 0; abbr.setAttribute('role', 'button'); abbr.setAttribute('aria-label', key + ': ' + name);
        // Expande a primeira ocorrência do texto, salvo em títulos ou quando o nome já vem antes.
        if (!heading && !expanded.has(key) && !before.includes(plain(name))) {
          const full = document.createElement('span');
          full.className = 'bc-acr-full'; full.dataset.acr = key;
          full.append(name + ' (', abbr, ')');
          fragment.append(full);
        } else fragment.append(abbr);
        expanded.add(key);
        from = match.index + key.length;
      }
      fragment.append(text.slice(from));
      node.replaceWith(fragment);
    });
  }

  // Toque, clique ou Enter/Espaço mostram o significado (title não funciona no celular).
  let tip = null, tipFor = null;
  function hideTip() { if (tip) { tip.remove(); tip = null; tipFor?.setAttribute('aria-expanded', 'false'); tipFor = null; } }
  function showTip(el) {
    hideTip();
    tip = document.createElement('div');
    tip.className = 'bc-acr-tip'; tip.setAttribute('role', 'tooltip'); tip.id = 'bc-acr-tip';
    tip.textContent = el.textContent + ' — ' + el.title;
    (el.closest('.bc-native-reader-overlay') || document.body).appendChild(tip);
    const r = el.getBoundingClientRect(), w = Math.min(320, innerWidth - 24);
    tip.style.maxWidth = w + 'px';
    tip.style.left = Math.max(12, Math.min(r.left, innerWidth - tip.offsetWidth - 12)) + 'px';
    tip.style.top = (r.bottom + 6 + tip.offsetHeight < innerHeight ? r.bottom + 6 : Math.max(8, r.top - tip.offsetHeight - 6)) + 'px';
    tipFor = el; el.setAttribute('aria-expanded', 'true'); el.setAttribute('aria-describedby', 'bc-acr-tip');
  }
  document.addEventListener('click', e => {
    const a = e.target.closest?.('abbr.bc-acr');
    if (a) { e.preventDefault(); a === tipFor ? hideTip() : showTip(a); return; }
    hideTip();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { hideTip(); return; }
    const a = e.target.closest?.('abbr.bc-acr');
    if (a && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); a === tipFor ? hideTip() : showTip(a); }
  });
  document.addEventListener('scroll', hideTip, true);

  const style = document.createElement('style');
  style.textContent = 'abbr.bc-acr{text-decoration:underline dotted;text-underline-offset:2px;cursor:help;border-radius:3px}' +
    'abbr.bc-acr:focus-visible{outline:2px solid #1d7f86;outline-offset:2px}' +
    '.bc-acr-tip{position:fixed;z-index:2147483100;padding:8px 11px;border-radius:9px;background:#12384e;color:#fff;font:600 13px/1.4 system-ui,-apple-system,Segoe UI,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.25);text-align:left}';
  document.head.appendChild(style);

  let queued = false;
  function scan() { queued = false; containers().forEach(process); }
  new MutationObserver(() => { if (!queued) { queued = true; setTimeout(scan, 120); } })
    .observe(document.documentElement, {childList: true, subtree: true});
  g.CentralAcronyms = {process, GLOSSARY};
})(window);
