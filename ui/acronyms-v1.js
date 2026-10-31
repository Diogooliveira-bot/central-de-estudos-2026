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
    LIMPE: 'Legalidade, Impessoalidade, Moralidade, Publicidade e Eficiência', FCC: 'Fundação Carlos Chagas'
  };
  const KEYS = Object.keys(GLOSSARY).sort((a, b) => b.length - a.length).map(k => k.replace('/', '\\/'));
  // Sigla isolada (não parte de outra palavra, nem de "CF-88-x" ou identificadores).
  const PATTERN = new RegExp('(?<![\\p{L}\\p{N}_/.-])(' + KEYS.join('|') + ')(?![\\p{L}\\p{N}_-])', 'gu');
  const SUBJECTS = ['cf', 'penal', 'cpc', 'adm', 'civil', 'cpp'];
  const SKIP = 'script,style,textarea,input,select,button,code,pre,abbr,mark,svg,.bc-acr-full,[contenteditable="true"]';
  const seen = new WeakSet();
  const plain = text => String(text || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

  function containers() {
    const list = [...document.querySelectorAll('.bc-native-reader-overlay .bc-native-article')];
    SUBJECTS.forEach(id => document.querySelectorAll('#subjects .subject[data-id="' + id + '"] :is(.cf-module-body,.cv-module-body,.detail-panel,.cpp-mod-body,.civil-module-body)')
      .forEach(el => list.push(el)));
    return list.filter(el => el.isConnected);
  }

  function process(root) {
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
        const key = match[1], name = GLOSSARY[key];
        fragment.append(text.slice(from, match.index));
        const before = plain(text.slice(Math.max(0, match.index - name.length - 6), match.index));
        const abbr = document.createElement('abbr');
        abbr.className = 'bc-acr'; abbr.title = name; abbr.textContent = key;
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

  const style = document.createElement('style');
  style.textContent = 'abbr.bc-acr{text-decoration:underline dotted;text-underline-offset:2px;cursor:help}';
  document.head.appendChild(style);

  let queued = false;
  function scan() { queued = false; containers().forEach(process); }
  new MutationObserver(() => { if (!queued) { queued = true; setTimeout(scan, 120); } })
    .observe(document.documentElement, {childList: true, subtree: true});
  g.CentralAcronyms = {process, GLOSSARY};
})(window);
