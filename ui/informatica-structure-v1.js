/* Base Completa | Informática: estrutura editorial, sem publicar aulas ou questões incompletas.
   Registrar os módulos aqui permite produção gradual sem alterar o padrão das outras disciplinas. */
(function (global) {
  "use strict";
  if (global.BaseInformatica || typeof SUBJECTS === "undefined" || !Array.isArray(SUBJECTS) || typeof global.renderSubjects !== "function") return;
  const MODULES = [
  {
    "id": "m01",
    "number": 1,
    "title": "Fundamentos de Informática",
    "outline": [
      "Hardware e software",
      "componentes do computador",
      "CPU e periféricos",
      "memória RAM e ROM",
      "armazenamento e unidades de medida",
      "arquivos e formatos."
    ],
    "status": "in_production",
    "theory": {
      "summary": null,
      "complete": null
    },
    "questions": {
      "authorial": null,
      "qc": [{"label":"Abrir filtro · 50 questões","count":50,"boards":"FGV e FCC","url":"https://www.qconcursos.com/questoes-de-concursos/questoes?discipline_ids%5B%5D=46&examining_board_ids%5B%5D=1&examining_board_ids%5B%5D=63&exclude_nullified=true&exclude_outdated=true&per_page=20&publication_year%5B%5D=2024&publication_year%5B%5D=2025&sort=newest&subject_ids%5B%5D=4849"}]
    }
  },
  {
    "id": "m02",
    "number": 2,
    "title": "Windows 10 e 11",
    "outline": [
      "Área de trabalho e interface",
      "Explorador de Arquivos",
      "arquivos, pastas e extensões",
      "atalhos de teclado",
      "configurações e acessibilidade",
      "gerenciamento e segurança do sistema."
    ],
    "status": "in_production",
    "theory": {
      "summary": null,
      "complete": null
    },
    "questions": {
      "authorial": null,
      "qc": [{"label":"Abrir filtro · 41 questões","count":41,"boards":"FGV e FCC","url":"https://www.qconcursos.com/questoes-de-concursos/questoes?discipline_ids%5B%5D=46&examining_board_ids%5B%5D=1&examining_board_ids%5B%5D=63&exclude_nullified=true&exclude_outdated=true&per_page=20&publication_year%5B%5D=2023&publication_year%5B%5D=2024&publication_year%5B%5D=2025&sort=newest&subject_ids%5B%5D=19793"}]
    }
  },
  {
    "id": "m03",
    "number": 3,
    "title": "Linux",
    "outline": [
      "Distribuições e ambientes",
      "estrutura de diretórios",
      "usuários e permissões",
      "terminal",
      "comandos de navegação e manipulação de arquivos",
      "comparação com Windows."
    ],
    "status": "in_production",
    "theory": {
      "summary": null,
      "complete": null
    },
    "questions": {
      "authorial": null,
      "qc": [{"label":"Abrir filtro · 30 questões","count":30,"boards":"FGV, FCC e Cebraspe","url":"https://www.qconcursos.com/questoes-de-concursos/questoes?discipline_ids%5B%5D=46&examining_board_ids%5B%5D=1&examining_board_ids%5B%5D=2&examining_board_ids%5B%5D=63&exclude_nullified=true&exclude_outdated=true&per_page=20&publication_year%5B%5D=2020&publication_year%5B%5D=2021&publication_year%5B%5D=2022&publication_year%5B%5D=2023&publication_year%5B%5D=2024&publication_year%5B%5D=2025&publication_year%5B%5D=2026&sort=newest&subject_ids%5B%5D=16733"}]
    }
  },
  {
    "id": "m04",
    "number": 4,
    "title": "Microsoft Word",
    "outline": [
      "Interface e documentos",
      "formatação de texto e parágrafos",
      "estilos e páginas",
      "tabelas e imagens",
      "revisão e comentários",
      "impressão, exportação e atalhos."
    ],
    "status": "in_production",
    "theory": {
      "summary": null,
      "complete": null
    },
    "questions": {
      "authorial": null,
      "qc": [{"label":"Abrir filtro · 72 questões","count":72,"boards":"FGV e FCC","url":"https://www.qconcursos.com/questoes-de-concursos/questoes?discipline_ids%5B%5D=46&examining_board_ids%5B%5D=1&examining_board_ids%5B%5D=63&exclude_nullified=true&exclude_outdated=true&per_page=20&publication_year%5B%5D=2023&publication_year%5B%5D=2024&publication_year%5B%5D=2025&publication_year%5B%5D=2026&sort=newest&subject_ids%5B%5D=1102"}]
    }
  },
  {
    "id": "m05",
    "number": 5,
    "title": "Microsoft Excel I — Fundamentos",
    "outline": [
      "Pastas de trabalho e planilhas",
      "células e intervalos",
      "tipos de dados",
      "referências relativas, absolutas e mistas",
      "fórmulas e operadores",
      "formatação e impressão."
    ],
    "status": "in_production",
    "theory": {
      "summary": null,
      "complete": null
    },
    "questions": {
      "authorial": null,
      "qc": [{"label":"Abrir filtro · 22 questões","count":22,"boards":"FGV e FCC","url":"https://www.qconcursos.com/questoes-de-concursos/questoes?discipline_ids%5B%5D=46&examining_board_ids%5B%5D=1&examining_board_ids%5B%5D=63&exclude_nullified=true&exclude_outdated=true&per_page=20&q=SOMA&sort=newest&subject_ids%5B%5D=18405"}]
    }
  },
  {
    "id": "m06",
    "number": 6,
    "title": "Microsoft Excel II — Funções e Recursos",
    "outline": [
      "Funções matemáticas e estatísticas",
      "funções lógicas",
      "funções de texto e data",
      "pesquisa e referência",
      "classificação, filtros e gráficos",
      "erros comuns de fórmulas."
    ],
    "status": "in_production",
    "theory": {
      "summary": null,
      "complete": null
    },
    "questions": {
      "authorial": null,
      "qc": [{"label":"Abrir filtro · 24 questões","count":24,"boards":"FGV, FCC, Cebraspe e VUNESP","url":"https://www.qconcursos.com/questoes-de-concursos/questoes?discipline_ids%5B%5D=46&examining_board_ids%5B%5D=1&examining_board_ids%5B%5D=2&examining_board_ids%5B%5D=63&examining_board_ids%5B%5D=152&exclude_nullified=true&exclude_outdated=true&per_page=20&q=PROCV&sort=newest&subject_ids%5B%5D=18405"}]
    }
  },
  {
    "id": "m07",
    "number": 7,
    "title": "Microsoft PowerPoint",
    "outline": [
      "Slides e layouts",
      "temas e mestre de slides",
      "textos, tabelas e imagens",
      "transições e animações",
      "modo de apresentação",
      "exportação e impressão."
    ],
    "status": "in_production",
    "theory": {
      "summary": null,
      "complete": null
    },
    "questions": {
      "authorial": null,
      "qc": [{"label":"Abrir filtro · 21 questões","count":21,"boards":"FGV e FCC","url":"https://www.qconcursos.com/questoes-de-concursos/questoes?discipline_ids%5B%5D=46&examining_board_ids%5B%5D=1&examining_board_ids%5B%5D=63&exclude_nullified=true&exclude_outdated=true&per_page=20&publication_year%5B%5D=2023&publication_year%5B%5D=2024&publication_year%5B%5D=2025&publication_year%5B%5D=2026&sort=newest&subject_ids%5B%5D=2961"}]
    }
  },
  {
    "id": "m08",
    "number": 8,
    "title": "LibreOffice e Ferramentas Online",
    "outline": [
      "Writer, Calc e Impress",
      "formatos e compatibilidade",
      "diferenças em relação ao Office",
      "Google Docs, Sheets e Slides",
      "colaboração e versões",
      "armazenamento compartilhado."
    ],
    "status": "in_production",
    "theory": {
      "summary": null,
      "complete": null
    },
    "questions": {
      "authorial": null,
      "qc": [{"label":"Abrir filtro · 55 questões","count":55,"boards":"FGV e FCC","url":"https://www.qconcursos.com/questoes-de-concursos/questoes?discipline_ids%5B%5D=46&examining_board_ids%5B%5D=1&examining_board_ids%5B%5D=63&exclude_nullified=true&exclude_outdated=true&per_page=20&q=LibreOffice&sort=newest"}]
    }
  },
  {
    "id": "m09",
    "number": 9,
    "title": "Internet, Navegadores e Pesquisa",
    "outline": [
      "Internet e web",
      "URLs e domínios",
      "navegadores e abas",
      "cookies, cache e histórico",
      "mecanismos de busca e operadores",
      "downloads, privacidade e segurança."
    ],
    "status": "in_production",
    "theory": {
      "summary": null,
      "complete": null
    },
    "questions": {
      "authorial": null,
      "qc": [{"label":"Abrir filtro · 92 questões","count":92,"boards":"FGV e FCC","url":"https://www.qconcursos.com/questoes-de-concursos/questoes?discipline_ids%5B%5D=46&examining_board_ids%5B%5D=1&examining_board_ids%5B%5D=63&exclude_nullified=true&exclude_outdated=true&per_page=20&publication_year%5B%5D=2023&publication_year%5B%5D=2024&publication_year%5B%5D=2025&publication_year%5B%5D=2026&sort=newest&subject_ids%5B%5D=237"}]
    }
  },
  {
    "id": "m10",
    "number": 10,
    "title": "Redes de Computadores",
    "outline": [
      "Conceitos e tipos de rede",
      "topologias e equipamentos",
      "IP e DNS",
      "TCP/IP, HTTP e HTTPS",
      "Wi-Fi, Ethernet e VPN",
      "intranet e extranet."
    ],
    "status": "in_production",
    "theory": {
      "summary": null,
      "complete": null
    },
    "questions": {
      "authorial": null,
      "qc": [{"label":"Abrir filtro · 21 questões","count":21,"boards":"FGV e FCC","url":"https://www.qconcursos.com/questoes-de-concursos/questoes?discipline_ids%5B%5D=46&examining_board_ids%5B%5D=1&examining_board_ids%5B%5D=63&exclude_nullified=true&exclude_outdated=true&per_page=20&publication_year%5B%5D=2023&publication_year%5B%5D=2024&publication_year%5B%5D=2025&sort=newest&subject_ids%5B%5D=324"}]
    }
  },
  {
    "id": "m11",
    "number": 11,
    "title": "Correio Eletrônico e Nuvem",
    "outline": [
      "Contas e clientes de e-mail",
      "destinatários, cópia e cópia oculta",
      "anexos e boas práticas",
      "SMTP, POP3 e IMAP",
      "serviços e modelos de nuvem",
      "sincronização e colaboração."
    ],
    "status": "in_production",
    "theory": {
      "summary": null,
      "complete": null
    },
    "questions": {
      "authorial": null,
      "qc": [{"label":"E-mail · 34 questões","count":34,"boards":"FGV e FCC","url":"https://www.qconcursos.com/questoes-de-concursos/questoes?discipline_ids%5B%5D=46&examining_board_ids%5B%5D=1&examining_board_ids%5B%5D=63&exclude_nullified=true&exclude_outdated=true&per_page=20&publication_year%5B%5D=2023&publication_year%5B%5D=2024&publication_year%5B%5D=2025&publication_year%5B%5D=2026&sort=newest&subject_ids%5B%5D=241"},{"label":"Nuvem · 54 questões","count":54,"boards":"FGV e FCC","url":"https://www.qconcursos.com/questoes-de-concursos/questoes?discipline_ids%5B%5D=46&examining_board_ids%5B%5D=1&examining_board_ids%5B%5D=63&exclude_nullified=true&exclude_outdated=true&per_page=20&sort=newest&subject_ids%5B%5D=11846"}]
    }
  },
  {
    "id": "m12",
    "number": 12,
    "title": "Segurança da Informação",
    "outline": [
      "Confidencialidade, integridade e disponibilidade",
      "autenticação e senhas",
      "malware e engenharia social",
      "phishing",
      "criptografia e certificados",
      "backup, restauração e atualizações."
    ],
    "status": "in_production",
    "theory": {
      "summary": null,
      "complete": null
    },
    "questions": {
      "authorial": null,
      "qc": [{"label":"Abrir filtro · 76 questões","count":76,"boards":"FGV e FCC","url":"https://www.qconcursos.com/questoes-de-concursos/questoes?discipline_ids%5B%5D=46&examining_board_ids%5B%5D=1&examining_board_ids%5B%5D=63&exclude_nullified=true&exclude_outdated=true&per_page=20&publication_year%5B%5D=2023&publication_year%5B%5D=2024&publication_year%5B%5D=2025&publication_year%5B%5D=2026&sort=newest&subject_ids%5B%5D=825"}]
    }
  },
  {
    "id": "m13",
    "number": 13,
    "title": "Inteligência Artificial e Tecnologias Digitais",
    "outline": [
      "Conceitos de IA e aprendizado de máquina",
      "IA generativa",
      "usos e limitações",
      "vieses e verificação de respostas",
      "dados pessoais e privacidade",
      "tendências digitais e atenção ao edital."
    ],
    "status": "in_production",
    "theory": {
      "summary": null,
      "complete": null
    },
    "questions": {
      "authorial": null,
      "qc": [{"label":"Abrir filtro · 22 questões","count":22,"boards":"FGV e FCC","url":"https://www.qconcursos.com/questoes-de-concursos/questoes?discipline_ids%5B%5D=46&examining_board_ids%5B%5D=1&examining_board_ids%5B%5D=63&exclude_nullified=true&exclude_outdated=true&per_page=20&q=inteligencia%20artificial&sort=newest"}]
    }
  }
];
  const ID = "info";
  const PREFIX = "central-v6:info:module-open:";
  const esc = value => String(value == null ? "" : value).replace(/[&<>"']/g, ch => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  })[ch]);
  const pad = n => String(n).padStart(2, "0");
  const subject = SUBJECTS.find(s => s.id === ID) || {
    id:ID,
    name:"Informática",
    special:"13 módulos • teoria e revisão disponíveis",
    topics:MODULES.map(m=>({
      uid:"info-" + m.id, title:pad(m.number) + " " + m.title.toUpperCase(),
      origin:"Módulo " + pad(m.number) + " • Em construção", type:"Curso",
      tips:["Conteúdo teórico em elaboração; nenhum estudo está marcado como concluído."]
    }))
  };
  if (!SUBJECTS.some(s => s.id === ID)) SUBJECTS.push(subject);

  // Cartões no padrão visual das disciplinas já aprovadas.
  function materialCard(m,kind,icon,title,description,labels,mode,action) {
    const filters=kind==="map"&&Array.isArray(m.questions?.qc)?m.questions.qc:[];
    const available=mode==="complete"||mode==="review"||filters.length>0;
    const tags=labels.map(x=>'<span>'+esc(x)+'</span>').join('');
    let button;
    if (kind==="map" && filters.length) {
      button=filters.map(filter=>'<a class="pt-cf-button pt-cf-button-open" href="'+esc(filter.url)+'" target="_blank" rel="noopener noreferrer" data-bc-info-qc="'+esc(m.id)+'"><span>'+esc(filter.label)+'</span></a>').join('');
    } else {
      button=available
        ? '<button type="button" class="pt-cf-button pt-cf-button-open" data-bc-info-mode="'+mode+'" onclick="return BaseInformaticaReader.open(\''+esc(m.id)+'\',\''+mode+'\')">'+esc(action)+'</button>'
        : '<button type="button" class="pt-cf-button bc-info-disabled" disabled aria-disabled="true" title="Em construção">Em construção</button>';
    }
    return '<article class="pt-cf-card pt-cf-card-'+kind+(available?'':' bc-info-coming-card')+'" data-bc-info-card="'+kind+'">'+
      '<span class="pt-cf-icon" aria-hidden="true">'+esc(icon)+'</span>'+
      '<b>'+esc(title)+'</b><small>'+esc(description)+'</small>'+
      '<span class="pt-cf-tags">'+tags+'</span><div class="pt-cf-actions">'+button+'</div></article>';
  }
  function moduleMarkup(m) {
    const open=(()=>{try{return global.localStorage.getItem(PREFIX+m.id)==="1";}catch(_){return false;}})();
    const outline=m.outline.map(t=>'<li>'+esc(t)+'</li>').join('');
    const reading='<section class="pt-cf-reading bc-info-reading" aria-label="Progresso de leitura">'+
      '<div class="pt-cf-reading-line"><div><b>Leitura do módulo</b>'+
      '<small>Acompanhe a teoria e a revisão; depois resolva as questões do módulo.</small></div>'+
      '<strong class="bc-info-reading-value">0%</strong></div>'+
      '<div class="pt-cf-progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" aria-label="Progresso de leitura"><span style="width:0%"></span></div></section>';
    const oriented=global.BCOrientation?global.BCOrientation.html('info:'+Number(String(m.id).replace(/\D/g,''))):'';
    const materials='<section class="pt-cf-cards bc-info-materials" aria-label="Materiais e links do módulo">'+
      materialCard(m,'review','↺','Versão de revisão','Síntese, conceitos para memorizar e recuperação ativa.',['Resumo','Revisão disponível'],'review','Revisar conteúdo')+
      materialCard(m,'primary','≡','Teoria completa','Leitura por capítulos com exemplos e acompanhamento.',['Apostila','Teoria disponível'],'complete','Estudar conteúdo')+
      '</section>';
    // Questões autorais: o cartão "Questões do módulo" é inserido pelo app (ui/questoes-modulo-card-v1.js)
    // logo depois do bloco acima; o filtro Qconcursos vem em seguida (ordem padrão: revisão, teoria, questões, QC).
    const links='<section class="pt-cf-cards bc-info-materials bc-info-links" aria-label="Filtro de questões do módulo">'+
      materialCard(m,'map','QC',m.questions.qc.length>1?'Filtros Qconcursos':'Filtro Qconcursos','Recorte de questões validado para este módulo.',['QC',m.questions.qc.reduce((total,filter)=>total+filter.count,0)+' questões'],'qc','Abrir filtro')+
      '</section>';
    return '<section class="cf-module bc-info-module '+(open?'open':'')+'" data-module="info-'+esc(m.id)+'">'+
      '<button type="button" class="cf-module-head" aria-expanded="'+(open?'true':'false')+'" onclick="return BaseInformatica.toggle(\''+esc(m.id)+'\')">'+
      '<span class="cf-module-no">MÓDULO '+pad(m.number)+'</span><span class="cf-module-title">'+esc(m.title)+'</span>'+
      '<span class="bc-info-status">Em construção</span><span class="cf-module-stat">0%</span><span class="chev">⌄</span></button>'+
      '<div class="cf-module-body"><div class="pt-cf-module-inside bc-info-inside">'+reading+oriented+materials+links+
      '<p class="bc-info-note">A teoria e a revisão estão disponíveis. Os filtros Qconcursos foram selecionados por módulo; as questões autorais ficam no cartão <strong>Questões do módulo</strong>. O percentual mede apenas a leitura, não a conclusão integral.</p>'+
      '</div></div></section>';
  }
  function shell() {
    return '<div class="subject-bar"><span style="width:0%"></span></div>' +
      '<div class="bc-info-intro"><b>Informática para concursos públicos</b>' +
      '<p>13 módulos com teoria completa, revisão, 10 questões autorais por módulo e filtros Qconcursos selecionados.</p></div>' +
      '<div class="cf-modules bc-info-modules">' + MODULES.map(moduleMarkup).join("") + '</div>';
  }
  const previousStats = global.subjStats;
  if (typeof previousStats === "function") global.subjStats = function (s) {
    if (s && s.id === ID) return {total:MODULES.length,done:0,pct:0,unit:"módulos"};
    return previousStats.apply(this, arguments);
  };
  const previousSubjects = global.renderSubjects;
  global.renderSubjects = function () {
    const result = previousSubjects.apply(this, arguments);
    const el = global.document.querySelector('#subjects > .subject[data-id="info"]');
    if (el && el.classList.contains("open")) {
      const body = el.querySelector(":scope > .subject-body");
      if (body) body.innerHTML = shell();
    }
    return result;
  };
  const previousGrid = global.renderDisciplineGrid;
  if (typeof previousGrid === "function") global.renderDisciplineGrid = function () {
    const result = previousGrid.apply(this, arguments);
    const card = global.document.querySelector('#disciplineGrid .disc-card[data-id="info"]');
    if (card) {
      const description = card.querySelector("small");
      const stats = card.querySelector(".disc-meta");
      if (description) description.textContent = "13 módulos • teoria e revisão disponíveis";
      if (stats) stats.textContent = "0/13 módulos · 0%";
    }
    return result;
  };
  const api = {
    modules:MODULES,
    toggle(id) {
      const m = MODULES.find(item => item.id === id);
      if (!m) return false;
      const el = global.document.querySelector('#subjects .bc-info-module[data-module="info-' + id + '"]');
      if (!el) return false;
      const opening = !el.classList.contains("open");
      el.classList.toggle("open",opening);
      const button = el.querySelector(".cf-module-head");
      if (button) button.setAttribute("aria-expanded",String(opening));
      try { global.localStorage.setItem(PREFIX + id, opening ? "1" : "0"); } catch (_) {}
      return false;
    },
    hasPublishedTheory(id) {
      const m = MODULES.find(item=>item.id===id);
      return Boolean(m && (m.status==="published" || m.status==="theory_published") && m.theory.summary && m.theory.complete);
    }
  };
  Object.freeze(MODULES);
  global.BaseInformatica = Object.freeze(api);
  // Não cria questões, links fictícios ou progresso de leitura antes da publicação.
  try { global.renderAll && global.renderAll(); } catch (err) { console.warn("Informática: estrutura disponível, atualização de tela pendente.",err); }
  try { global.renderDisciplineGrid && global.renderDisciplineGrid(); } catch (_) {}
})(window);
