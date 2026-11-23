const d = (id, name, centralId, coverage, topics, weight = 1, moduleIds = []) => ({
  id, name, centralId, coverage, topics, weight, moduleIds
});

export const CONCURSOS_2026_SEED = [
  {
    id: 'gmf-fortaleza-monitoramento',
    name: 'Guarda Municipal de Fortaleza',
    organ: 'Prefeitura Municipal de Fortaleza · SESEC/SEPOG',
    state: 'CE', sphere: 'Municipal', year: 2026,
    noticeNumber: null, noticeDate: null,
    status: 'previsto', active: true, featured: true,
    board: null, vacancies: null, salary: null,
    registrationStart: null, registrationEnd: null, examDate: null,
    lastVerified: '2026-11-17',
    summary: 'Novo concurso ainda sem edital oficial. O programa abaixo é somente a referência do Edital nº 01/2023, cujo último grupo foi empossado em fevereiro de 2026.',
    pending: ['Aguardar ato oficial de autorização ou novo edital', 'Confirmar banca, vagas, remuneração e cronograma somente após publicação oficial'],
    sources: [
      {type:'edital-referencia', title:'Edital oficial nº 01/2023 — SESEC/SEPOG', url:'https://fortaleza.ce.gov.br/images/0001/27_03_2023_GMF.pdf'},
      {type:'retificacao', title:'Aditivo oficial do concurso de 2023', url:'https://www.fortaleza.ce.gov.br/noticias/prefeitura-de-fortaleza-divulga-aditivo-ao-edital-do-concurso-da-guarda-municipal'},
      {type:'situacao', title:'Última turma do concurso de 2023 empossada em 06/02/2026', url:'https://www.fortaleza.ce.gov.br/noticias/prefeito-evandro-empossa-260-novos-guardas-municipais-e-anuncia-pccs-para-a-categoria-ainda-em-2026'}
    ],
    cargos: [{name:'Guarda Municipal', education:'Ensino médio (referência 2023)', vacancies:'1.000 no edital de referência', salary:'R$ 3.152,78 + auxílio-alimentação (valor do edital de 2023; não é remuneração confirmada para novo concurso)'}],
    subjects: [
      d('gmf-pt','Língua Portuguesa','pt','complete',['Interpretação de textos','Coesão e articulação textual','Sintaxe','Classes de palavras','Concordância','Regência','Ortografia e acentuação'],18,['pt']),
      d('gmf-rlm','Raciocínio Lógico','rlm','partial',['Estruturas lógicas','Raciocínio verbal, matemático e sequencial','Orientação espacial e temporal','Conjuntos','Problemas aritméticos, geométricos e matriciais'],10,['rlm']),
      d('gmf-info','Noções de Informática','info','partial',['Hardware','Windows e Linux','Writer','Calc','Correio eletrônico','Reuniões on-line','Internet e navegadores','Segurança da informação'],10,['info']),
      d('gmf-atual','Atualidades',null,'missing',['Fatos políticos, econômicos, sociais, culturais, científicos e jurídicos dos seis meses anteriores à prova'],4),
      d('gmf-fortaleza','Conhecimentos sobre Fortaleza',null,'missing',['Geografia','População','Aspectos políticos, econômicos e culturais','Patrimônio','História de Fortaleza'],9),
      d('gmf-adm','Direito Administrativo','adm','partial',['Estado, governo e administração pública','Fontes e princípios','Atos administrativos: requisitos, atributos, classificação, invalidação e prescrição'],9,['adm-01','adm-02']),
      d('gmf-cf','Direito Constitucional e Direitos Humanos','cf','partial',['Princípios fundamentais','Direitos e garantias fundamentais','Direitos políticos','Organização do Estado','Administração pública','Segurança pública','Política urbana','Família e grupos protegidos','Teoria geral dos direitos humanos'],14,['w1','w2','w3','w4','w5']),
      d('gmf-penal','Direito Penal e Processo Penal','penal','partial',['Teoria do crime','Crimes contra pessoa, patrimônio, dignidade sexual, fé e administração pública','Inquérito policial','Provas e cadeia de custódia','Busca e apreensão','Prisão em flagrante e cautelares'],16,['p1','p3','p8','cpp-02-02-inquerito-policial','cpp-06-06-provas-e-cadeia-de-custodia','cpp-07-07-prisao-e-cautelares']),
      d('gmf-leg','Legislação Extravagante',null,'partial',['Estatuto Geral das Guardas','Lei de Drogas','Crimes de preconceito','ECA','Crimes ambientais','CTB','Estatuto do Desarmamento','Lei Maria da Penha','Abuso de Autoridade','Lei Orgânica e Estatuto dos Servidores de Fortaleza'],12)
    ]
  },
  {
    id:'tjce-2026', name:'Tribunal de Justiça do Estado do Ceará', organ:'TJCE', state:'CE', sphere:'Estadual', year:2026,
    noticeNumber:'01/2026', noticeDate:'2026-05-15', status:'publicado', active:true, featured:true,
    board:'Fundação Carlos Chagas (FCC)', vacancies:24, salary:null,
    registrationStart:'2026-05-18', registrationEnd:'2026-06-22', examDate:'2026-08-09', lastVerified:'2026-11-18',
    currentStage:'Provas realizadas; resultados definitivos das provas publicados e avaliações complementares em andamento.', currentStageDate:'2026-11-16',
    summary:'Concurso em andamento para cargos de nível médio e superior. As provas já foram realizadas; o TJCE publicou resultados e convocações posteriores em outubro e novembro.',
    pending:['Remunerações variam por cargo e devem ser consultadas no quadro oficial do edital'],
    sources:[
      {type:'edital',title:'Edital nº 01/2026 — texto oficial no DJEA',url:'https://djea-con.tjce.jus.br/materias/170430'},
      {type:'acompanhamento',title:'Página oficial de concursos e seleções do TJCE',url:'https://www.tjce.jus.br/institucional/concursos-selecoes/'},
      {type:'comunicado',title:'Situação oficial publicada em 16/11/2026',url:'https://www.tjce.jus.br/noticias/concurso-para-servidor-do-tjce-resultados-das-avaliacoes-de-titulo-e-biopsicossocial-sao-divulgados/'}
    ],
    cargos:[{name:'Técnico Judiciário',education:'Nível médio',vacancies:'Conforme quadro oficial'},{name:'Analista Judiciário',education:'Nível superior',vacancies:'Conforme especialidade'},{name:'Oficial de Justiça',education:'Nível superior',vacancies:'Conforme quadro oficial'}],
    subjects:[
      d('tjce-pt','Língua Portuguesa','pt','complete',['Interpretação','Gramática e reescrita'],10,['pt']),
      d('tjce-rlm','Raciocínio Lógico-Matemático','rlm','partial',['Lógica','Matemática e estatística'],8,['rlm']),
      d('tjce-cf','Direito Constitucional','cf','partial',['Constituição e direitos fundamentais','Organização do Estado e dos Poderes'],10,['cf']),
      d('tjce-adm','Direito Administrativo','adm','partial',['Princípios','Atos','Poderes','Agentes','Licitações e controle'],12,['adm']),
      d('tjce-civil','Direito Civil','civil','partial',['Parte geral','Obrigações e contratos','Responsabilidade e direitos reais'],12,['civil']),
      d('tjce-cpc','Direito Processual Civil','cpc','partial',['Parte geral do CPC','Conhecimento','Recursos','Execução'],14,['cpc']),
      d('tjce-penal','Direito Penal','penal','partial',['Parte geral e crimes em espécie'],8,['penal']),
      d('tjce-cpp','Direito Processual Penal','cpp','partial',['Inquérito','Ação penal','Provas','Prisões e procedimentos'],10,['cpp']),
      d('tjce-local','Legislação e conhecimentos institucionais',null,'missing',['Normas específicas do TJCE e do Estado do Ceará'],8)
    ]
  },
  {
    id:'alece-2026', name:'Assembleia Legislativa do Estado do Ceará', organ:'ALECE', state:'CE', sphere:'Estadual', year:2026,
    noticeNumber:'01/2026', noticeDate:'2026-05-21', status:'publicado', active:true, featured:true,
    board:'IDECAN', vacancies:200, salary:'R$ 3.037,91 (Técnico) e R$ 6.083,30 (Analista), valores básicos do edital',
    registrationStart:'2026-05-21', registrationEnd:'2026-07-13', examDate:'2026-08-16', lastVerified:'2026-11-18',
    currentStage:'Provas realizadas; concurso na fase de resultados da prova discursiva e avaliação de títulos.', currentStageDate:'2026-11-18',
    summary:'200 vagas imediatas: 30 para Técnico Legislativo e 170 para Analista Legislativo em 29 especialidades, além de cadastro de reserva. As provas já foram realizadas.',
    pending:['Conteúdos específicos devem ser consultados por especialidade no edital oficial'],
    sources:[
      {type:'edital',title:'Edital nº 01/2026 — Diário Oficial da ALECE',url:'https://portaldoservidor.al.ce.gov.br/storage/anexos/b2H4l1CyZdqfhSZEDMwpJ5OYQJs8ChycwQcyD2Nx.pdf'},
      {type:'retificacoes',title:'Página oficial do concurso e retificações',url:'https://transparencia.al.ce.gov.br/portal/concursos-publicos'},
      {type:'situacao',title:'Resultados e comunicados oficiais do concurso',url:'https://transparencia.al.ce.gov.br/portal/concursos-publicos'}
    ],
    cargos:[{name:'Técnico Legislativo',education:'Nível médio',vacancies:30},{name:'Analista Legislativo — Direito',education:'Nível superior em Direito',vacancies:20},{name:'Analista Legislativo — demais especialidades',education:'Nível superior específico',vacancies:150}],
    subjects:[
      d('alece-pt','Língua Portuguesa','pt','complete',['Interpretação e gramática'],8,['pt']),
      d('alece-info','Informática','info','partial',['Sistemas, escritório, internet e segurança'],6,['info']),
      d('alece-rlm','Raciocínio Lógico','rlm','partial',['Lógica e matemática'],6,['rlm']),
      d('alece-cf','Direito Constitucional','cf','partial',['Constituição, direitos, Estado e Poder Legislativo'],9,['cf']),
      d('alece-adm','Direito Administrativo','adm','partial',['Administração pública, atos, agentes, licitações e controle'],10,['adm']),
      d('alece-local','Legislação institucional da ALECE',null,'missing',['Constituição Estadual, Regimento e normas institucionais indicadas por cargo'],7),
      d('alece-specific','Conhecimentos específicos da especialidade',null,'missing',['Programa varia entre as 29 especialidades de Analista'],20)
    ]
  },
  {
    id:'sefaz-ce-2026', name:'Secretaria da Fazenda do Estado do Ceará', organ:'SEFAZ-CE', state:'CE', sphere:'Estadual', year:2026,
    noticeNumber:'01/2026', noticeDate:'2026-04-24', status:'publicado', active:true, featured:true,
    board:'Fundação Carlos Chagas (FCC)', vacancies:100, salary:'R$ 16.136,64 (vencimento básico inicial informado oficialmente)',
    registrationStart:'2026-04-27', registrationEnd:'2026-06-01', examDate:'2026-08-01', lastVerified:'2026-11-18',
    currentStage:'Provas realizadas; resultados das provas objetivas e discursivas já divulgados.', currentStageDate:'2026-09-09',
    summary:'100 vagas imediatas e 200 para cadastro de reserva no cargo de Auditor-Fiscal da Fazenda Estadual. As provas já foram realizadas.',
    pending:['O concurso possui conhecimentos tributários, contábeis e econômicos ainda sem cobertura na Central'],
    sources:[{type:'edital',title:'Edital nº 01/2026 no Diário Oficial do Estado',url:'https://www.ce.gov.br/sefaz/wp-content/uploads/sites/46/2026/04/do20260424p02.pdf'},{type:'situacao',title:'Notícia oficial da SEFAZ-CE',url:'https://www.ce.gov.br/sefaz/2026/04/24/sefaz-ce-publica-edital-para-auditor-fiscal-com-100-vagas/'},{type:'resultado',title:'Comunicado oficial sobre o resultado das provas',url:'https://www.ce.gov.br/sefaz/comunicados-2/'}],
    cargos:[{name:'Auditor-Fiscal da Fazenda Estadual',education:'Nível superior',vacancies:100,salary:'R$ 16.136,64'}],
    subjects:[d('sefaz-pt','Língua Portuguesa','pt','complete',['Interpretação e gramática'],7,['pt']),d('sefaz-rlm','Raciocínio Lógico e Estatística','rlm','partial',['Lógica, matemática financeira e estatística'],8,['rlm']),d('sefaz-cf','Direito Constitucional','cf','partial',['Constituição e sistema tributário'],7,['cf']),d('sefaz-adm','Direito Administrativo','adm','partial',['Administração, atos, agentes, licitações e controle'],7,['adm']),d('sefaz-civil','Direito Civil e Empresarial','civil','partial',['Obrigações, contratos e empresa'],7,['civil']),d('sefaz-tax','Direito Tributário e legislação tributária',null,'missing',['Sistema tributário, tributos estaduais e processo tributário'],18),d('sefaz-account','Contabilidade, auditoria e economia',null,'missing',['Contabilidade geral e avançada, auditoria, economia e finanças públicas'],20),d('sefaz-ti','Tecnologia e análise de dados','info','partial',['Tecnologia, dados e segurança'],8,['info'])]
  },
  {
    id:'tce-ce-monitoramento', name:'Tribunal de Contas do Estado do Ceará', organ:'TCE-CE', state:'CE', sphere:'Estadual', year:2026,
    noticeNumber:null, noticeDate:null, status:'previsto', active:false, featured:false, board:null, vacancies:null, salary:null,
    registrationStart:null, registrationEnd:null, examDate:null, lastVerified:'2026-11-17',
    summary:'Cadastro desativado: a notícia originalmente usada como previsão se referia ao concurso de 2015. Sem anúncio oficial atual confirmado para novo edital.',
    pending:['Aguardar anúncio oficial atual antes de reativar o cadastro'],
    sources:[{type:'verificacao',title:'Declaração oficial: sem concurso realizado entre janeiro e outubro de 2026',url:'https://www.tce.ce.gov.br/downloads/Transparncia/Declarao_Janeiro_Outubro26_Assinada.pdf'}],
    cargos:[],
    subjects:[d('tce-ce-common','Programa ainda não publicado',null,'missing',['Não usar conteúdo de concurso anterior como se fosse o programa de 2026'],1)]
  },
  {
    id:'tjpb-2026', name:'Tribunal de Justiça da Paraíba', organ:'TJPB', state:'PB', sphere:'Estadual', year:2026,
    noticeNumber:'01/2026', noticeDate:'2026-10-20', status:'publicado', active:true, featured:false, board:'Fundação Getulio Vargas (FGV)', vacancies:50, salary:null,
    registrationStart:'2026-10-20', registrationEnd:'2026-11-18', examDate:null, lastVerified:'2026-11-17',
    summary:'50 vagas para Analista Judiciário. A área Judiciária já possui programa verticalizado na Central e o detalhamento existente foi preservado.', pending:['Confirmar remunerações e data de prova diretamente no edital oficial'],
    sources:[{type:'edital',title:'Publicação oficial do Edital nº 01/2026 — TJPB',url:'https://www.tjpb.jus.br/web/guest/w/tjpb-divulga-edital-de-concurso-com-vagas-nas-%C3%A1reas-jur%C3%ADdica-ti-e-contabilidade'},{type:'situacao',title:'Prazo de inscrições confirmado pelo TJPB em 17/11/2026',url:'https://corregedoria.tjpb.jus.br/web/guest/w/inscri%C3%A7%C3%B5es-para-concurso-do-tjpb-terminam-nesta-quarta-feira-18-'}],
    cargos:[{name:'Analista Judiciário — Área Judiciária',education:'Nível superior em Direito',vacancies:'Conforme edital oficial'}],
    subjects:[d('tjpb-pt','Língua Portuguesa','pt','complete',['Programa verticalizado existente'],20,['pt']),d('tjpb-cf','Direito Constitucional','cf','partial',['Programa verticalizado existente'],15,['cf']),d('tjpb-adm','Direito Administrativo','adm','partial',['Programa verticalizado existente'],15,['adm']),d('tjpb-civil','Direito Civil','civil','partial',['Programa verticalizado existente'],15,['civil']),d('tjpb-cpc','Direito Processual Civil','cpc','partial',['Programa verticalizado existente'],15,['cpc']),d('tjpb-penal','Direito Penal','penal','partial',['Programa verticalizado existente'],10,['penal']),d('tjpb-cpp','Direito Processual Penal','cpp','partial',['Programa verticalizado existente'],10,['cpp'])]
  },
  {
    id:'trt8-2026', name:'Tribunal Regional do Trabalho da 8ª Região', organ:'TRT-8', state:'PA/AP', sphere:'Federal', year:2026,
    noticeNumber:'01/2026', noticeDate:'2026-09-01', status:'publicado', active:true, featured:false, board:'Fundação Carlos Chagas (FCC)', vacancies:null, salary:null,
    registrationStart:null, registrationEnd:null, examDate:null, lastVerified:'2026-11-17',
    summary:'Programa verticalizado existente na Central para Analista Judiciário — Área Judiciária, incluindo retificação oficial de outubro.', pending:['Cobertura de Direito do Trabalho e Processo do Trabalho não integra a Central atual'],
    sources:[{type:'edital',title:'Edital nº 01/2026 — FCC',url:'https://www.concursosfcc.com.br/concursos/trt8r126/trt8r126_edital_de_abertura.pdf'},{type:'retificacao',title:'Edital nº 02/2026 — retificação oficial',url:'https://www.in.gov.br/web/dou/-/edital-n-2-de-7-de-outubro-de-2026-737300524'}],
    cargos:[{name:'Analista Judiciário — Área Judiciária',education:'Nível superior em Direito',vacancies:'Conforme edital oficial'}],
    subjects:[d('trt8-pt','Língua Portuguesa','pt','complete',['Programa verticalizado existente'],13,['pt']),d('trt8-rlm','Raciocínio Lógico-Matemático','rlm','partial',['Programa verticalizado existente'],12,['rlm']),d('trt8-cf','Direito Constitucional','cf','partial',['Programa verticalizado existente'],14,['cf']),d('trt8-adm','Direito Administrativo','adm','partial',['Programa verticalizado existente'],14,['adm']),d('trt8-civil','Direito Civil','civil','partial',['Programa verticalizado existente'],18,['civil']),d('trt8-cpc','Direito Processual Civil','cpc','partial',['Programa verticalizado existente'],20,['cpc']),d('trt8-trab','Direito e Processo do Trabalho',null,'missing',['Disciplinas removidas da Central'],24),d('trt8-local','Legislação, Direitos Humanos e normas do TRT-8',null,'missing',['Normas específicas do órgão'],12)]
  },
  {
    id:'dataprev-2026', name:'DATAPREV', organ:'Empresa de Tecnologia e Informações da Previdência', state:'Nacional', sphere:'Federal', year:2026,
    noticeNumber:'01/2026', noticeDate:'2026-07-03', status:'publicado', active:true, featured:false, board:'Fundação Getulio Vargas (FGV)', vacancies:212, salary:null,
    registrationStart:'2026-07-06', registrationEnd:'2026-08-06', examDate:'2026-10-11', lastVerified:'2026-11-17',
    summary:'212 vagas efetivas de nível superior e cadastro de reserva, distribuídas em 13 perfis técnicos e diversas cidades, inclusive Fortaleza.', pending:['Remuneração e conteúdo específico variam por perfil'],
    sources:[{type:'edital',title:'Edital nº 01/2026 — DATAPREV',url:'https://portal.dataprev.gov.br/sites/default/files/arquivos/edital_concurso_dataprev_2026-_diario_oficial_da_uniao_de_03-07-2026.pdf'},{type:'situacao',title:'Notícia oficial do Ministério da Gestão',url:'https://www.gov.br/gestao/pt-br/assuntos/noticias/2026/Julho/dataprev-abre-concurso-publico-com-212-vagas-de-nivel-superior/'}],
    cargos:[{name:'Analista de Tecnologia da Informação — diversos perfis',education:'Nível superior',vacancies:'Distribuídas por 13 perfis'},{name:'Advocacia, Contabilidade, Comunicação, Administração e Engenharia',education:'Nível superior específico',vacancies:'Conforme edital'}],
    subjects:[d('dataprev-pt','Língua Portuguesa','pt','complete',['Conhecimentos gerais'],8,['pt']),d('dataprev-rlm','Raciocínio Lógico','rlm','partial',['Conhecimentos gerais'],6,['rlm']),d('dataprev-info','Informática e Tecnologia','info','partial',['Cobertura introdutória; conteúdos profissionais exigem material específico'],12,['info']),d('dataprev-specific','Conhecimentos específicos por perfil',null,'missing',['TI avançada, contabilidade, advocacia, engenharia e demais especialidades'],30)]
  },
  {
    id:'abgf-2026', name:'Agência Brasileira Gestora de Fundos Garantidores e Garantias', organ:'ABGF', state:'Nacional', sphere:'Federal', year:2026,
    noticeNumber:'01/2026', noticeDate:'2026-06-29', status:'publicado', active:true, featured:false, board:'Fundação Carlos Chagas (FCC)', vacancies:7, salary:'R$ 8.000,00 a R$ 15.200,00, conforme cargo',
    registrationStart:'2026-07-06', registrationEnd:'2026-08-17', examDate:'2026-09-27', lastVerified:'2026-11-17',
    summary:'Primeiro concurso público da ABGF: 7 vagas imediatas e 42 para cadastro de reserva, todos de nível superior.', pending:['Conteúdos específicos devem ser consultados por cargo no edital completo da FCC'],
    sources:[{type:'acompanhamento',title:'Página oficial do concurso ABGF',url:'https://www.abgf.gov.br/transparencia-e-governanca/informacao-de-pessoal/concurso-publico/'}],
    cargos:[{name:'Analista — diversas áreas',education:'Nível superior',vacancies:'Conforme edital'}],
    subjects:[d('abgf-pt','Língua Portuguesa','pt','complete',['Conhecimentos gerais'],8,['pt']),d('abgf-rlm','Raciocínio Lógico','rlm','partial',['Conhecimentos gerais'],6,['rlm']),d('abgf-cf','Direito Constitucional','cf','partial',['Conforme cargo'],6,['cf']),d('abgf-adm','Direito Administrativo','adm','partial',['Conforme cargo'],6,['adm']),d('abgf-specific','Conhecimentos específicos',null,'missing',['Programa varia por área profissional'],20)]
  },
  {
    id:'receita-federal-autorizado-2026', name:'Receita Federal do Brasil', organ:'Secretaria Especial da Receita Federal do Brasil', state:'Nacional', sphere:'Federal', year:2026,
    noticeNumber:null, noticeDate:null, status:'previsto', active:true, featured:false, board:null, vacancies:146, salary:null,
    registrationStart:null, registrationEnd:null, examDate:null, lastVerified:'2026-11-17',
    summary:'Concurso autorizado pela Portaria MGI nº 5.505/2026. Ainda não há edital de abertura confirmado neste cadastro.', pending:['Publicação do edital','Definição da banca, remuneração, inscrições, prova e conteúdo programático'],
    sources:[{type:'autorizacao',title:'Autorização oficial do concurso — Ministério da Gestão',url:'https://www.gov.br/gestao/pt-br/assuntos/editoria-defeso-eleitoral/publicadas-portarias-que-autorizam-concurso-na-receita-federal-e-no-banco-central/'}],
    cargos:[{name:'Analista-Tributário',education:'Nível superior',vacancies:116},{name:'Auditor-Fiscal',education:'Nível superior',vacancies:30}],
    subjects:[d('rfb-pending','Conteúdo programático ainda não publicado',null,'missing',['Não usar edital antigo como programa oficial de 2026'],1)]
  },
  {
    id:'bacen-autorizado-2026', name:'Banco Central do Brasil', organ:'Banco Central do Brasil', state:'Nacional', sphere:'Federal', year:2026,
    noticeNumber:null, noticeDate:null, status:'previsto', active:true, featured:false, board:null, vacancies:170, salary:null,
    registrationStart:null, registrationEnd:null, examDate:null, lastVerified:'2026-11-17',
    summary:'Concurso autorizado pela Portaria MGI nº 5.508/2026. Ainda não há edital de abertura confirmado neste cadastro.', pending:['Publicação do edital','Definição da banca, remuneração, inscrições, prova e conteúdo programático'],
    sources:[{type:'autorizacao',title:'Autorização oficial do concurso — Ministério da Gestão',url:'https://www.gov.br/gestao/pt-br/assuntos/editoria-defeso-eleitoral/publicadas-portarias-que-autorizam-concurso-na-receita-federal-e-no-banco-central/'}],
    cargos:[{name:'Auditor',education:'Nível superior',vacancies:100},{name:'Técnico',education:'Nível intermediário',vacancies:50},{name:'Procurador',education:'Nível superior',vacancies:20}],
    subjects:[d('bacen-pending','Conteúdo programático ainda não publicado',null,'missing',['Não usar edital antigo como programa oficial de 2026'],1)]
  },

  {
    id:'prf-2021-policial-rodoviario-federal',
    name:'Polícia Rodoviária Federal — Policial Rodoviário Federal (referência 2021)',
    organ:'Polícia Rodoviária Federal', state:'BR', sphere:'Federal', year:2021,
    noticeNumber:'Edital nº 1, de 18 de janeiro de 2021', noticeDate:'2021-01-18',
    status:'encerrado', active:true, featured:false, board:'Cebraspe', vacancies:1500,
    salary:'R$ 9.899,88 (valor indicado no edital de 2021)',
    registrationStart:null, registrationEnd:null, examDate:null, lastVerified:'2026-11-22',
    currentStage:'Concurso de 2021 encerrado. Cadastro usado somente como referência de teste para mapear o edital.',
    summary:'Catálogo histórico baseado no Edital PRF nº 1/2021. A existência de disciplina na Base Completa não comprova cobertura do programa: todos os assuntos começam sem vínculo de capítulo e exigem auditoria pedagógica.',
    pending:['Auditar cada assunto contra capítulos reais antes de ligar conteúdo ou alterar cobertura','Conferir retificações do edital e preservar a versão histórica do programa','Os capítulos específicos de Física, Geopolítica, Ética, Legislação de Trânsito e legislação da carreira não foram considerados disponíveis'],
    sources:[
      {type:'edital-oficial',title:'Edital Concurso PRF nº 1, de 18 de janeiro de 2021 — Cebraspe',url:'https://cdn.cebraspe.org.br/concursos/prf_21/arquivos/ED_1_PRF_2021_ABERTURA.PDF'},
      {type:'pagina-oficial',title:'Concurso PRF 2021 — página institucional da PRF',url:'https://www.gov.br/prf/pt-br/acesso-a-informacao/servidores/concursos-e-selecoes/concurso-2021'}
    ],
    cargos:[{name:'Policial Rodoviário Federal',education:'Curso superior em qualquer área; CNH categoria B ou superior (conforme edital)',vacancies:1500,salary:'R$ 9.899,88 (edital de 2021)'}],
    subjects:[
      d('prf21-pt','Língua Portuguesa','pt','missing',['Compreensão e interpretação; gêneros textuais; ortografia; coesão; morfossintaxe; reescrita; correspondência oficial'],6),
      d('prf21-rlm','Raciocínio Lógico-Matemático','rlm','missing',['Equações e sistemas; funções; razão, proporção e porcentagem; sequências; contagem, probabilidade e estatística; conjuntos; geometria, métricas, áreas e volumes'],5),
      d('prf21-info','Informática','info','missing',['Internet e intranet; navegadores, correio, busca e colaboração; Windows; acesso remoto e arquivos; transformação digital; segurança; computação em nuvem'],4),
      d('prf21-fis','Física',null,'missing',['Cinemática escalar e vetorial; movimento circular; leis de Newton; trabalho, potência e energia; quantidade de movimento, impulso e colisões'],3),
      d('prf21-etica','Ética e Cidadania',null,'missing',['Ética, moral, princípios e valores; ética e função pública; governança; códigos e sistema de ética; cidadania, transparência, acesso à informação e conflitos de interesses'],3),
      d('prf21-geo','Geopolítica Brasileira',null,'missing',['Território e organização do Estado; produção e trabalho; urbanização e população; transportes; economia internacional; meio ambiente; biomas e ecossistemas'],3),
      d('prf21-lingua-estrangeira','Língua Estrangeira (Inglês ou Espanhol)',null,'missing',['Compreensão de texto escrito; itens gramaticais relevantes à compreensão semântica — opção por inglês ou espanhol'],2),
      d('prf21-transito','Legislação de Trânsito',null,'missing',['Código de Trânsito Brasileiro, inclusive alterações listadas no edital; Lei nº 5.970/1973; resoluções CONTRAN expressamente enumeradas no Anexo III'],12),
      d('prf21-adm','Direito Administrativo','adm','missing',['Organização administrativa; atos administrativos; agentes públicos e Lei nº 8.112/1990; carreira PRF; poderes administrativos; licitações; controle da Administração; responsabilidade civil do Estado; regime jurídico-administrativo'],5),
      d('prf21-cf','Direito Constitucional','cf','missing',['Poder constituinte; direitos e garantias; Poder Executivo; competências da União; defesa do Estado; segurança pública e atribuições constitucionais da PRF; ordem social'],5),
      d('prf21-penal','Direito Penal','penal','missing',['Princípios; aplicação da lei penal; tipicidade, dolo, culpa, erro, tentativa e consumação; ilicitude; culpabilidade; crimes em espécie previstos no edital'],5),
      d('prf21-cpp','Direito Processual Penal','cpp','missing',['Ação penal; termo circunstanciado; atos processuais; prova e preservação de local de crime; busca e apreensão; prisões; identificação criminal; diligências investigatórias'],5),
      d('prf21-legislacao-especial','Legislação Especial',null,'missing',['Leis nº 5.553/1968, 12.037/2009, 8.069/1990, 8.072/1990, 9.099/1995, 9.455/1997, 9.605/1998, 10.826/2003, 11.343/2006, 12.850/2013, 13.675/2018 e 13.869/2019; Decreto nº 1.655/1995 e dispositivos expressos do Decreto nº 9.662/2019'],5),
      d('prf21-direitos-humanos','Direitos Humanos',null,'missing',['Direitos humanos na Constituição Federal e tratados; Declaração Universal dos Direitos Humanos; Convenção Americana sobre Direitos Humanos (Decreto nº 678/1992)'],2)
    ]
  },
];

export const RESEARCH_REJECTIONS = [
  {name:'INSS', reason:'Órgão informou em 28/10/2026 que não há inscrições nem autorização para novo concurso.', url:'https://www.gov.br/inss/pt-br/assuntos/noticias/atencao-nao-ha-inscricoes-abertas-para-concurso-do-inss-cuidado-com-golpes/'},
  {name:'Banco do Brasil', reason:'O BB informou em 03/06/2026 que não há previsão de novo edital.', url:'https://imprensa.bb.com.br/bb-esclarece-que-nao-ha-previsao-de-novo-concurso-2/'},
  {name:'Polícia Rodoviária Federal', reason:'Não foi localizado edital de abertura de 2026; a PRF mantém alertas sobre concursos falsos.', url:'https://www.gov.br/prf/pt-br/noticias/nacionais/2025/dezembro/alerta-site-anunciando-selecao-para-carreira-da-prf-e-fraude'},
  {name:'Polícia Federal', reason:'O concurso recente é regido pelo Edital nº 1/2025; atos de homologação em 2026 não são novo edital de abertura.', url:'https://www.gov.br/pf/pt-br/acesso-a-informacao/servidores/concursos'},
  {name:'Polícia Civil do Ceará', reason:'Os atos de 2026 localizados dão continuidade a concursos anteriores; não foi identificado novo edital de abertura de 2026.', url:'https://www.ce.gov.br/aesp/categoria/concurso-pcce/'},
  {name:'Polícia Penal do Ceará', reason:'Não foi localizado edital de abertura oficial de 2026 nas fontes do Estado consultadas.', url:'https://www.ce.gov.br/categoria/concurso/'}
];
