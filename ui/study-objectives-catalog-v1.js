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
    penal: { id:'penal', name:'Direito Penal', available:true, questionKey:'penal', notice:'Carregamento da teoria completa dos módulos 11 a 17 pendente.' },
    cpp: { id:'cpp', name:'Direito Processual Penal', available:true, questionKey:'processual-penal' },
    trab: { id:'trab', name:'Direito do Trabalho', available:true, questionKey:'trabalho' },
    ptra: { id:'ptra', name:'Direito Processual do Trabalho', available:true, questionKey:'processual-trabalho' },
    rlm: { id:'rlm', name:'Raciocínio Lógico-Matemático', available:true, questionKey:'rlm' },
  };

  const goals = {
    'career-tribunais-analista': {
      id:'career-tribunais-analista', type:'career', group:'Por carreira', shortLabel:'Tribunais · Analista',
      title:'Tribunais — Analista Judiciário',
      description:'Trilha inicial configurável. A distribuição das disciplinas deve ser ajustada ao tribunal e ao edital escolhidos.',
      subjectIds:['pt','cf','adm','civil','cpc','penal','cpp','trab','ptra','rlm'],
    },
    'career-tribunais-tecnico': {
      id:'career-tribunais-tecnico', type:'career', group:'Por carreira', shortLabel:'Tribunais · Técnico',
      title:'Tribunais — Técnico Judiciário',
      description:'Trilha inicial configurável. A distribuição das disciplinas deve ser ajustada ao tribunal e ao edital escolhidos.',
      subjectIds:['pt','cf','adm','civil','cpc','penal','cpp','rlm'],
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
      subjectIds:['pt','rlm','cf','adm','trab','ptra','civil','cpc'],
      examSubjects:[
        {id:'trt8-pt',title:'Língua Portuguesa',subjectId:'pt',status:'partial',note:'Teoria disponível; correspondências por módulo em auditoria.'},
        {id:'trt8-rlm',title:'Matemática e Raciocínio lógico',subjectId:'rlm',status:'partial'},
        {id:'trt8-leg',title:'Noções de Legislação',status:'preparation',note:'Legislação específica do TRT-8, CNJ e CSJT: em preparação.'},
        {id:'trt8-dh',title:'Noções de Direitos Humanos',status:'preparation'},
        {id:'trt8-pcd',title:'Noções sobre direitos das pessoas com deficiência',status:'preparation'},
        {id:'trt8-info',title:'Noções de Informática',status:'preparation'},
        {id:'trt8-cf',title:'Direito Constitucional',subjectId:'cf',status:'partial'},
        {id:'trt8-adm',title:'Direito Administrativo',subjectId:'adm',status:'partial'},
        {id:'trt8-trab',title:'Direito do Trabalho',subjectId:'trab',status:'partial'},
        {id:'trt8-ptra',title:'Direito Processual do Trabalho',subjectId:'ptra',status:'partial'},
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

  global.CentralStudyObjectiveCatalog = Object.freeze({ version:1, subjects, goals });
})(window);
