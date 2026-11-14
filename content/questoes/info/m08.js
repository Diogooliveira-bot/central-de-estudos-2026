/* Banco de questões — Noções de Informática, módulo 08. Questões autorais (não são de banca).
 * Para acrescentar questões, veja content/questoes/LEIAME.md e rode "npm run questoes:check". */
window.BC_QUESTOES=window.BC_QUESTOES||{};
(window.BC_QUESTOES.info=window.BC_QUESTOES.info||{})[8]=[
 {
  "id": "info-m08-autoral-01",
  "origem": "autoral-ia",
  "q": "Um usuário precisa escrever uma expressão matemática com fração e raiz quadrada para inseri-la em um documento. Entre os componentes do LibreOffice, o mais adequado é:",
  "options": [
   "Calc, programa de planilhas e cálculos em células",
   "Math, editor de fórmulas matemáticas",
   "Base, programa de bancos de dados",
   "Draw, programa de desenhos e diagramas vetoriais",
   "Impress, programa de apresentações de slides"
  ],
  "answer": 1,
  "explanation": "O Math é o editor de fórmulas matemáticas do LibreOffice: serve para criar expressões como frações e raízes e inseri-las em documentos ou usá-las de forma independente. O Calc é a planilha, voltada a cálculos em células, e não ao editor de fórmulas; confundir os dois é erro comum. O Base trata de bancos de dados. O Draw produz desenhos e diagramas vetoriais, e o Impress cria e exibe slides. Assim, para a necessidade descrita, apenas o Math é a ferramenta própria da suíte.",
  "lawRef": "LibreOffice — Math (fórmulas) x Calc, Base, Draw e Impress"
 },
 {
  "id": "info-m08-autoral-02",
  "origem": "autoral-ia",
  "q": "Os arquivos nativos de textos, de planilhas e de apresentações do LibreOffice usam, respectivamente, as extensões do formato OpenDocument:",
  "options": [
   ".ods, .odt e .odp",
   ".odp, .ods e .odt",
   ".docx, .xlsx e .pptx",
   ".odt, .ods e .odp",
   ".odb, .odg e .odt"
  ],
  "answer": 3,
  "explanation": "No formato OpenDocument, o Writer salva textos em .odt, o Calc salva planilhas em .ods e o Impress salva apresentações em .odp, nessa ordem. Trocar a ordem, como usar .ods para textos ou .odp para planilhas, inverte as associações. As extensões .docx, .xlsx e .pptx pertencem à família Microsoft Office, e não ao formato nativo do LibreOffice, embora a suíte abra e salve muitos formatos do Office. Já .odb e .odg identificam arquivos do Base e do Draw, respectivamente, e não de textos, planilhas e apresentações.",
  "lawRef": "LibreOffice — extensões ODF: .odt, .ods e .odp"
 },
 {
  "id": "info-m08-autoral-03",
  "origem": "autoral-ia",
  "q": "Considere as finalidades dos programas da suíte LibreOffice (Writer, Calc, Impress, Draw, Base e Math). Assinale a alternativa correta:",
  "options": [
   "o Base oferece ferramentas para bancos de dados, e o Calc é o programa de planilhas",
   "o Base é o equivalente direto do Excel e serve para criar planilhas com fórmulas",
   "o Math substitui o Calc em cálculos de planilhas, pois ambos trabalham com fórmulas",
   "o Draw é o editor de textos e documentos de uso geral da suíte",
   "o Impress é o programa de bancos de dados da suíte"
  ],
  "answer": 0,
  "explanation": "Base oferece ferramentas para bancos de dados e o Calc é o programa de planilhas da suíte. O Base não equivale ao Excel: quem corresponde ao Excel é o Calc. O Math é editor de fórmulas matemáticas e não substitui a planilha, mesmo que ambos lidem com expressões. O Draw é o programa de desenhos e diagramas vetoriais, e não de textos, cujo programa é o Writer. O Impress é o programa de apresentações, e não de bancos de dados. Cada programa atua sobre um tipo de documento diferente, e confundir finalidades é a pegadinha mais comum.",
  "lawRef": "LibreOffice — finalidade de Base, Calc, Math, Draw e Impress"
 },
 {
  "id": "info-m08-autoral-04",
  "origem": "autoral-ia",
  "q": "Um usuário abre no Writer um arquivo .docx com estilos e paginação elaborados e o salva como .odt. Qual cuidado é adequado após a conversão?",
  "options": [
   "nenhum, pois a conversão entre DOCX e ODT é idêntica em todos os recursos",
   "verificar se o arquivo abre no Word, já que o .odt só abre no Word e nunca no Writer",
   "apagar o .docx antes da conversão, para evitar duplicidade de arquivos",
   "salvar também como PDF e passar a editar o PDF, que é o formato nativo do Writer",
   "conferir estilos, paginação e recursos, pois compatibilidade não significa fidelidade absoluta"
  ],
  "answer": 4,
  "explanation": "Compatibilidade não significa fidelidade absoluta: o Writer abre e salva DOCX e ODT, mas estilos, paginação, fontes e recursos específicos podem mudar na conversão, então é preciso conferir o resultado. Não é verdade que a conversão seja idêntica em todos os recursos. Também é falso que o .odt só abra no Word e nunca no Writer, pois é o formato nativo do Writer. Apagar o .docx antes da conversão é imprudente, porque elimina o original que serve de referência. E o PDF não é formato nativo do Writer: é uma exportação para distribuição, sem equivalência de edição completa.",
  "lawRef": "LibreOffice Writer — conversão DOCX/ODT e fidelidade"
 },
 {
  "id": "info-m08-autoral-05",
  "origem": "autoral-ia",
  "q": "Para que um documento do Writer tenha estrutura navegável e permita gerar um sumário, o procedimento correto é:",
  "options": [
   "aplicar apenas negrito e fonte maior, manualmente, a cada título",
   "colocar cada título em uma tabela de uma única célula",
   "aplicar estilos de título hierárquicos aos títulos do documento",
   "salvar o documento como .ods, para que o sumário seja gerado pelo Calc",
   "exportar para PDF antes de tudo, pois o sumário só existe no arquivo PDF"
  ],
  "answer": 2,
  "explanation": "Estilos de título hierárquicos criam a estrutura do documento: servem à navegação e permitem gerar o sumário automaticamente. Aplicar apenas negrito e fonte maior altera a aparência, mas não cria hierarquia reconhecida pelo programa, por isso não equivale a estilo de título. Colocar cada título em uma tabela de uma célula não gera estrutura, só complica a formatação. O sumário é recurso do Writer, e não do Calc, que é planilha cuja extensão nativa é .ods. E exportar para PDF é etapa de distribuição: o sumário é criado no documento de texto antes dela, e não existe apenas no PDF.",
  "lawRef": "LibreOffice Writer — estilos de título e sumário"
 },
 {
  "id": "info-m08-autoral-06",
  "origem": "autoral-ia",
  "q": "No Calc, uma planilha de vendas deve exibir temporariamente apenas as linhas de uma região, sem apagar as demais nem alterar a ordem dos registros. O recurso adequado é:",
  "options": [
   "a classificação, que reordena os registros e mantém todas as linhas visíveis",
   "a formatação condicional, que remove as linhas fora da regra definida",
   "o filtro, que oculta temporariamente as linhas que não atendem ao critério",
   "a exclusão manual das linhas das demais regiões, que preserva os dados",
   "o congelamento de linhas, que oculta as linhas fora do critério"
  ],
  "answer": 2,
  "explanation": "O filtro oculta temporariamente as linhas que não atendem ao critério, mostrando só a região desejada sem apagar os demais dados nem alterar sua ordem. A classificação reordena os registros e mantém todas as linhas visíveis, então não serve para exibir apenas uma região. A formatação condicional muda a aparência das células segundo regras, mas não remove linhas. Excluir manualmente as linhas das outras regiões apaga dados, o que contraria o enunciado, pois os dados deveriam ser preservados. O congelamento de linhas apenas mantém cabeçalhos visíveis ao rolar a planilha e não oculta linhas por critério.",
  "lawRef": "LibreOffice Calc — filtrar x classificar x formatação condicional"
 },
 {
  "id": "info-m08-autoral-07",
  "origem": "autoral-ia",
  "q": "Em uma planilha do Calc, um usuário lê as referências B3 e A1:A10 em uma fórmula. Elas representam, respectivamente:",
  "options": [
   "um intervalo de três células e uma única célula, a de endereço A10",
   "uma linha inteira e uma coluna inteira da planilha",
   "duas abas diferentes da mesma planilha, identificadas por esses códigos",
   "uma fórmula de soma e uma fórmula de média, respectivamente",
   "uma célula (coluna B, linha 3) e um intervalo da coluna A, da linha 1 à linha 10"
  ],
  "answer": 4,
  "explanation": "Em planilhas do Calc, B3 é o endereço de uma única célula, na coluna B e linha 3. A1:A10 é um intervalo, que reúne as células da coluna A da linha 1 à linha 10. Dizer que B3 é um intervalo de três células e A10 uma célula única troca os conceitos: B3 sozinha já é uma célula, e os dois-pontos é que indicam intervalo. Afirmar que são uma linha e uma coluna inteiras também é errado. Abas são identificadas por nome, e não por esses endereços. E nenhum dos dois é fórmula: fórmulas como SOMA e MÉDIA é que usam intervalos como argumento.",
  "lawRef": "LibreOffice Calc — endereço de célula e intervalo"
 },
 {
  "id": "info-m08-autoral-08",
  "origem": "autoral-ia",
  "q": "Um arquivo do Google Docs, Sheets ou Slides é compartilhado com colegas. Quanto às permissões de compartilhamento, assinale a alternativa correta:",
  "options": [
   "quem recebe apenas a permissão de visualização pode ler o documento, mas não altera o original",
   "quem tem permissão de visualização pode editar o original, desde que o faça pelo navegador",
   "comentar e editar são o mesmo nível de permissão, pois ambos alteram o texto do documento",
   "um link configurado como público é sempre seguro, pois só quem conhece o autor consegue abrir",
   "ao conceder a permissão de Editor, as alterações da pessoa não afetam o documento compartilhado"
  ],
  "answer": 0,
  "explanation": "Visualizar, comentar e editar são níveis distintos de permissão. Com acesso de visualização, a pessoa lê o documento, mas não altera o original. Dizer que quem visualiza pode editar inverte o conceito; comentar também não equivale a editar, pois o comentário serve para discussão, sem alterar o conteúdo. Ao conceder a permissão de Editor, as alterações passam a integrar o documento compartilhado, ao contrário do que afirma a última alternativa errada. E um link público mal configurado pode expor dados: não é sempre seguro, e revisar permissões é parte da segurança da informação.",
  "lawRef": "Google Docs/Sheets/Slides — permissões: visualizar, comentar, editar"
 },
 {
  "id": "info-m08-autoral-09",
  "origem": "autoral-ia",
  "q": "Um gestor afirma que, como o Google Docs possui histórico de versões, não é necessária nenhuma política de backup. Quanto a essa afirmação, é correto dizer que ela:",
  "options": [
   "é correta, pois o histórico de versões é sinônimo de backup independente",
   "é correta, pois a sincronização entre dispositivos equivale a uma cópia de recuperação",
   "é equivocada, pois o histórico de versões torna todos os documentos automaticamente públicos",
   "é equivocada: versionamento, sincronização e backup são técnicas distintas",
   "é equivocada, pois o Google Docs não permite restaurar nenhuma versão anterior"
  ],
  "answer": 3,
  "explanation": "A afirmação é equivocada: versionamento mantém estados anteriores do arquivo, sincronização reproduz alterações entre dispositivos e backup prepara cópias independentes para recuperação. São técnicas diferentes, que podem coexistir, e uma não substitui a outra nem a política formal de retenção. O histórico de versões não é sinônimo de backup, e a sincronização também não: uma exclusão, por exemplo, pode ser replicada aos dispositivos. O histórico não torna os documentos públicos, e o Google Docs permite, conforme a autorização, conferir e restaurar versões anteriores.",
  "lawRef": "Edição colaborativa — versionamento x sincronização x backup"
 },
 {
  "id": "info-m08-autoral-10",
  "origem": "autoral-ia",
  "q": "Uma equipe vai migrar uma apresentação do formato .pptx para o formato .odp, usando o Impress. O cuidado adequado nessa migração é:",
  "options": [
   "nenhum, pois o conteúdo é convertido sem qualquer alteração de aparência",
   "conferir layout, fontes, animações, vídeos e transições, pois alguns elementos podem mudar",
   "saber que o Impress não abre arquivos do PowerPoint em nenhuma situação",
   "apenas renomear a extensão para .odp, o que converte corretamente o arquivo",
   "converter antes para .ods, que preserva animações e transições dos slides"
  ],
  "answer": 1,
  "explanation": "Compatibilidade não significa identidade: ao migrar PPTX para ODP, o texto costuma ser preservado, mas layout, fontes, animações, vídeos e transições podem mudar, e por isso devem ser conferidos. Não se pode afirmar que a conversão ocorra sem qualquer alteração. O Impress abre arquivos do PowerPoint, ao contrário do que diz uma alternativa. Renomear a extensão não converte o formato: a conversão exige abrir e salvar no formato desejado. Converter para .ods é incorreto, pois .ods é a extensão de planilhas do Calc, e não de apresentações.",
  "lawRef": "LibreOffice Impress — migração PPTX para ODP e fidelidade"
 }
];
