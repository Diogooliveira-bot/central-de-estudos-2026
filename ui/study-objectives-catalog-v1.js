/* Catálogo editorial dos objetivos. IDs de disciplina são os IDs canônicos já usados pela Central. */
(function (global) {
  'use strict';
  if (global.CentralStudyObjectiveCatalog) return;

  const subjects = {
    pt: { id:'pt', name:'Língua Portuguesa', available:true, questionKey:'portugues' },
    cf: { id:'cf', name:'Direito Constitucional', available:true, questionKey:'constitucional' },
    adm: { id:'adm', name:'Direito Administrativo', available:true, questionKey:'administrativo' },
    civil: { id:'civil', name:'Direito Civil', available:true, questionKey:'civil' },
    cpc: { id:'cpc', name:'Direito Processual Civil', available:true, questionKey:'processual-civil' },
    penal: { id:'penal', name:'Direito Penal', available:true, questionKey:'penal', },
    cpp: { id:'cpp', name:'Direito Processual Penal', available:true, questionKey:'processual-penal' },
    rlm: { id:'rlm', name:'Raciocínio Lógico-Matemático', available:true, questionKey:'rlm' },
    info: { id:'info', name:'Informática', available:true, questionKey:'informatica', status:'theory_published' },
  };

  const goals = {
    'career-tribunais-analista': {
      id:'career-tribunais-analista', type:'career', group:'Por carreira', shortLabel:'Tribunais · Analista',
      title:'Tribunais — Analista Judiciário',
      description:'Trilha inicial configurável. A distribuição das disciplinas deve ser ajustada ao tribunal e ao edital escolhidos.',
      subjectIds:['pt','cf','adm','civil','cpc','penal','cpp','rlm','info'],
    },
    'career-tribunais-tecnico': {
      id:'career-tribunais-tecnico', type:'career', group:'Por carreira', shortLabel:'Tribunais · Técnico',
      title:'Tribunais — Técnico Judiciário',
      description:'Trilha inicial configurável. A distribuição das disciplinas deve ser ajustada ao tribunal e ao edital escolhidos.',
      subjectIds:['pt','cf','adm','civil','cpc','penal','cpp','rlm','info'],
    },
    'exam-tjpb-2026-analista-judiciaria': {
      id:'exam-tjpb-2026-analista-judiciaria', type:'exam', group:'Por edital', shortLabel:'TJPB 2026 · Analista',
      title:'TJPB 2026 — Analista Judiciário, Área Judiciária',
      description:'Catálogo baseado no conteúdo programático oficial do Diário da Justiça de 20/10/2026.',
      subjectIds:['pt','cf','adm','civil','cpc','penal','cpp'],
      examSubjects:[
        { id:'tjp-pt', title:'Língua Portuguesa', subjectId:'pt' },
        { id:'tjp-ethics', title:'Ética e Gestão no Serviço Público', status:'preparation' },
        { id:'tjp-it-data', title:'Noções de Informática e Proteção de Dados', status:'preparation' },
        { id:'tjp-cf', title:'Direito Constitucional', subjectId:'cf' },
        { id:'tjp-adm', title:'Direito Administrativo', subjectId:'adm' },
        { id:'tjp-civil-consumer', title:'Direito Civil e Direito do Consumidor', subjectId:'civil', status:'partial', note:'Direito Civil disponível. Direito do Consumidor — Em preparação.' },
        { id:'tjp-cpc', title:'Direito Processual Civil', subjectId:'cpc' },
        { id:'tjp-penal', title:'Direito Penal', subjectId:'penal' },
        { id:'tjp-cpp', title:'Direito Processual Penal', subjectId:'cpp' },
        { id:'tjp-human-rights', title:'Direitos Humanos e Tutela Coletiva', status:'preparation' },
      ],
    },
    'exam-trt8-2026-analista-judiciaria': {
      id:'exam-trt8-2026-analista-judiciaria', type:'exam', group:'Por edital', shortLabel:'TRT-8 2026 · Analista',
      title:'TRT-8 2026 — Analista Judiciário, Área Judiciária',
      description:'Edital 01/2026 da FCC, com retificação de 08/10/2026. Conteúdos em auditoria; links e cobertura parcial.',
      subjectIds:['pt','rlm','cf','adm','civil','cpc'],
      examSubjects:[
        {id:'trt8-pt',title:'Língua Portuguesa',subjectId:'pt',status:'partial',note:'Teoria disponível; correspondências por módulo em auditoria.'},
        {id:'trt8-rlm',title:'Matemática e Raciocínio lógico',subjectId:'rlm',status:'partial'},
        {id:'trt8-leg',title:'Noções de Legislação',status:'preparation',note:'Legislação específica do TRT-8, CNJ e CSJT: em preparação.'},
        {id:'trt8-dh',title:'Noções de Direitos Humanos',status:'preparation'},
        {id:'trt8-pcd',title:'Noções sobre direitos das pessoas com deficiência',status:'preparation'},
        {id:'trt8-info',title:'Noções de Informática',status:'preparation'},
        {id:'trt8-cf',title:'Direito Constitucional',subjectId:'cf',status:'partial'},
        {id:'trt8-adm',title:'Direito Administrativo',subjectId:'adm',status:'partial'},
        {id:'trt8-civil',title:'Direito Civil',subjectId:'civil',status:'partial'},
        {id:'trt8-cpc',title:'Direito Processual Civil',subjectId:'cpc',status:'partial'},
      ],
    },
    'free-study': {
      id:'free-study', type:'free', group:'Estudo livre', shortLabel:'Estudo livre', title:'Estudo livre',
      description:'Todas as disciplinas e todos os módulos já existentes permanecem disponíveis.',
      subjectIds:Object.keys(subjects),
    },
  };

  // Orientação inicial por área e cargo. Nunca afirma equivalência com edital.
  const areas = [
    { id:"policial", title:"Área Policial", icon:"♜", description:"Polícias Civil, Militar, Federal, Rodoviária e Penal" },
    { id:"judiciaria", title:"Área Judiciária", icon:"⚖", description:"Tribunais, justiça e apoio judiciário" },
    { id:"administrativa", title:"Área Administrativa", icon:"▤", description:"Prefeituras, órgãos públicos e gestão" },
    { id:"bancaria", title:"Área Bancária", icon:"▣", description:"Instituições financeiras e bancos públicos" },
    { id:"fiscal", title:"Fiscal e Controle", icon:"▥", description:"Auditoria, tributos e fiscalização" },
    { id:"guarda", title:"Guarda Municipal", icon:"⬡", description:"Segurança municipal e proteção comunitária" },
    { id:"transito", title:"Trânsito e Mobilidade", icon:"◇", description:"Fiscalização, mobilidade urbana e trânsito" },
    { id:"educacao", title:"Educação", icon:"▦", description:"Carreiras educacionais" },
    { id:"saude", title:"Saúde Pública", icon:"✚", description:"Atendimento e apoio à saúde" },
  ];
  const careerRoles = [
    { id:"career-policial-militar-soldado",area:"policial",title:"Soldado da Polícia Militar",subjectIds:["pt","rlm","cf","adm","penal","cpp","info"] },
    { id:"career-policial-militar-oficial",area:"policial",title:"Oficial da Polícia Militar",subjectIds:["pt","rlm","cf","adm","penal","cpp","info"] },
    { id:"career-policial-civil-investigador",area:"policial",title:"Investigador da Polícia Civil",subjectIds:["pt","rlm","cf","adm","penal","cpp","info"] },
    { id:"career-policial-civil-escrivao",area:"policial",title:"Escrivão da Polícia Civil",subjectIds:["pt","rlm","cf","adm","penal","cpp","info"] },
    { id:"career-policial-civil-delegado",area:"policial",title:"Delegado de Polícia Civil",subjectIds:["pt","cf","adm","civil","penal","cpp","cpc","info"] },
    { id:"career-policial-federal-agente",area:"policial",title:"Agente de Polícia Federal",subjectIds:["pt","rlm","cf","adm","penal","cpp","info"] },
    { id:"career-policial-federal-escrivao",area:"policial",title:"Escrivão de Polícia Federal",subjectIds:["pt","rlm","cf","adm","penal","cpp","info"] },
    { id:"career-policial-rodoviario-federal",area:"policial",title:"Policial Rodoviário Federal",subjectIds:["pt","rlm","cf","adm","penal","cpp","info"] },
    { id:"career-policial-penal",area:"policial",title:"Policial Penal",subjectIds:["pt","rlm","cf","adm","penal","cpp","info"] },
    { id:"career-perito-criminal",area:"policial",title:"Perito Criminal",subjectIds:["pt","rlm","cf","adm","penal","cpp","info"] },
    { id:"career-guarda-municipal",area:"guarda",title:"Guarda Municipal",subjectIds:["pt","rlm","cf","adm","penal","cpp","info"] },
    { id:"career-inspetor-guarda-municipal",area:"guarda",title:"Inspetor da Guarda Municipal",subjectIds:["pt","rlm","cf","adm","penal","cpp","info"] },
    { id:"career-agente-transito",area:"transito",title:"Agente de Trânsito",subjectIds:["pt","rlm","cf","adm","info"] },
    { id:"career-fiscal-transito",area:"transito",title:"Fiscal de Trânsito",subjectIds:["pt","rlm","cf","adm","info"] },
    { id:"career-agente-mobilidade-urbana",area:"transito",title:"Agente de Mobilidade Urbana",subjectIds:["pt","rlm","cf","adm","info"] },
    { id:"career-analista-transito",area:"transito",title:"Analista de Trânsito",subjectIds:["pt","rlm","cf","adm","info"] },
    { id:"career-tribunais-analista",area:"judiciaria",title:"Analista Judiciário",subjectIds:["pt","rlm","cf","adm","civil","cpc","penal","cpp","info"] },
    { id:"career-tribunais-tecnico",area:"judiciaria",title:"Técnico Judiciário",subjectIds:["pt","rlm","cf","adm","civil","cpc","penal","cpp","info"] },
    { id:"career-oficial-justica",area:"judiciaria",title:"Oficial de Justiça",subjectIds:["pt","cf","adm","civil","cpc","info"] },
    { id:"career-analista-judiciario-administrativo",area:"judiciaria",title:"Analista Judiciário — Área Administrativa",subjectIds:["pt","rlm","cf","adm","info"] },
    { id:"career-tecnico-judiciario-administrativo",area:"judiciaria",title:"Técnico Judiciário — Área Administrativa",subjectIds:["pt","rlm","cf","adm","info"] },
    { id:"career-agente-administrativo",area:"administrativa",title:"Agente Administrativo",subjectIds:["pt","rlm","cf","adm","info"] },
    { id:"career-assistente-administrativo",area:"administrativa",title:"Assistente Administrativo",subjectIds:["pt","rlm","cf","adm","info"] },
    { id:"career-tecnico-administrativo",area:"administrativa",title:"Técnico Administrativo",subjectIds:["pt","rlm","cf","adm","info"] },
    { id:"career-analista-administrativo",area:"administrativa",title:"Analista Administrativo",subjectIds:["pt","rlm","cf","adm","info"] },
    { id:"career-auditor-fiscal",area:"fiscal",title:"Auditor Fiscal",subjectIds:["pt","rlm","cf","adm","info"] },
    { id:"career-fiscal-tributario",area:"fiscal",title:"Fiscal Tributário",subjectIds:["pt","rlm","cf","adm","info"] },
    { id:"career-auditor-controle-externo",area:"fiscal",title:"Auditor de Controle Externo",subjectIds:["pt","rlm","cf","adm","info"] },
    { id:"career-tecnico-controle-externo",area:"fiscal",title:"Técnico de Controle Externo",subjectIds:["pt","rlm","cf","adm","info"] },
    { id:"career-escriturario-bancario",area:"bancaria",title:"Escriturário Bancário",subjectIds:["pt","rlm","info"] },
    { id:"career-tecnico-bancario",area:"bancaria",title:"Técnico Bancário",subjectIds:["pt","rlm","info"] },
    { id:"career-professor-educacao-basica",area:"educacao",title:"Professor da Educação Básica",subjectIds:["pt","rlm","cf","info"] },
    { id:"career-pedagogo",area:"educacao",title:"Pedagogo",subjectIds:["pt","rlm","cf","info"] },
    { id:"career-tecnico-enfermagem",area:"saude",title:"Técnico de Enfermagem",subjectIds:["pt","rlm","cf","info"] },
    { id:"career-agente-comunitario-saude",area:"saude",title:"Agente Comunitário de Saúde",subjectIds:["pt","rlm","cf","info"] },
  ];
  for (const role of careerRoles) {
    const area = areas.find((item) => item.id === role.area);
    const existing = goals[role.id];
    goals[role.id] = {
      ...(existing || {}),
      id:role.id, type:'career', group:area.title, area:area.id,
      shortLabel:role.title, title:role.title,
      description:'Sugestão inicial com as disciplinas disponíveis. Ajuste os assuntos conforme o edital do seu concurso.',
      subjectIds:role.subjectIds.slice(),
    };
  }
  global.CentralStudyObjectiveCatalog = Object.freeze({ version:2, subjects, goals, areas });
})(window);

