/* Banco de questões — Noções de Informática, módulo 04. Questões autorais (não são de banca).
 * Para acrescentar questões, veja content/questoes/LEIAME.md e rode "npm run questoes:check". */
window.BC_QUESTOES=window.BC_QUESTOES||{};
(window.BC_QUESTOES.info=window.BC_QUESTOES.info||{})[4]=[
 {
  "id": "info-m04-autoral-01",
  "origem": "autoral-ia",
  "q": "Um analista precisa gerar, no Word, um sumário automático para um relatório extenso e permitir a navegação pelo Painel de Navegação. Qual é a forma mais adequada de formatar os títulos das seções?",
  "options": [
   "Aplicar negrito e fonte maior a cada título de seção, mantendo o texto no estilo Normal",
   "Centralizar e sublinhar cada título de seção, pois o Word identifica títulos pelo alinhamento",
   "Aplicar a cada título de seção os estilos de título do Word, como Título 1 e Título 2",
   "Digitar a numeração dos títulos manualmente e inserir uma quebra de página antes de cada um",
   "Colocar cada título dentro de uma caixa de texto para que o Word o reconheça como estrutura"
  ],
  "answer": 2,
  "explanation": "O sumário automático e o Painel de Navegação se baseiam na estrutura do documento, que o Word reconhece pelos estilos de título (Título 1, Título 2 etc.). Por isso é preciso aplicar o estilo, e não só imitar o visual; depois de alterações, basta atualizar o sumário. Negrito com fonte maior muda apenas a aparência dos caracteres e deixa o parágrafo no estilo Normal, sem nível hierárquico. Centralizar e sublinhar também é aparência e não cria estrutura. Numerar manualmente e inserir quebra de página organiza a paginação, mas não define níveis de título. Caixa de texto é um objeto flutuante e não entra na estrutura de títulos.",
  "lawRef": "Word — estilos de título, sumário automático e Painel de Navegação"
 },
 {
  "id": "info-m04-autoral-02",
  "origem": "autoral-ia",
  "q": "Considere as formatações aplicadas no Word: I. negrito; II. recuo da primeira linha; III. cor da fonte; IV. espaçamento depois do parágrafo. São formatações de parágrafo, e não de caracteres, apenas:",
  "options": [
   "II e IV, pois recuos e espaçamentos entre parágrafos pertencem ao parágrafo",
   "I e III, pois negrito e cor da fonte são propriedades do parágrafo inteiro",
   "I, II e IV, pois o negrito também é uma propriedade aplicada ao parágrafo",
   "II, III e IV, pois a cor da fonte também é uma propriedade do parágrafo",
   "I e IV, pois negrito e espaçamento são as únicas formatações de parágrafo"
  ],
  "answer": 0,
  "explanation": "A formatação de caracteres inclui fonte, tamanho, negrito, itálico, sublinhado, cor e realce. A de parágrafo envolve alinhamento, recuos, espaçamento antes e depois, entrelinhas, tabulações, bordas e listas. Assim, o recuo da primeira linha (II) e o espaçamento depois do parágrafo (IV) são de parágrafo. A opção que cita negrito e cor da fonte como propriedades do parágrafo inverte os grupos. Incluir o negrito junto com II e IV erra porque ele é de caractere. Incluir a cor da fonte também erra pelo mesmo motivo. Dizer que só negrito e espaçamento são de parágrafo mistura um item de caractere e deixa de fora o recuo da primeira linha.",
  "lawRef": "Word — formatação de caracteres versus formatação de parágrafo"
 },
 {
  "id": "info-m04-autoral-03",
  "origem": "autoral-ia",
  "q": "Em um documento do Word, apenas uma parte do texto deve ter orientação paisagem, além de cabeçalho e numeração de páginas diferentes do restante. Qual recurso permite essa configuração independente?",
  "options": [
   "Quebra de página, que inicia nova página e dá configuração própria ao trecho seguinte",
   "Quebra de linha manual, que separa o trecho do restante do parágrafo anterior",
   "Colunas do Layout, que dividem o texto em partes independentes na mesma página",
   "Comentário, que isola o trecho escolhido para ter configurações próprias na revisão",
   "Quebra de seção, que delimita regiões com configurações de página próprias"
  ],
  "answer": 4,
  "explanation": "A quebra de seção delimita regiões do documento que podem ter configurações próprias, como orientação, cabeçalhos, rodapés e numeração, respeitando a vinculação entre seções. A quebra de página apenas faz o texto seguinte começar em nova página; não cria uma região com configurações independentes. A quebra de linha manual encerra uma linha sem iniciar novo parágrafo e não tem relação com a configuração de página. O recurso Colunas organiza o fluxo do texto em colunas jornalísticas, mas não muda orientação nem cabeçalho de um trecho. Comentário é uma anotação de revisão, que não altera o layout nem isola o trecho.",
  "lawRef": "Word — quebra de seção versus quebra de página"
 },
 {
  "id": "info-m04-autoral-04",
  "origem": "autoral-ia",
  "q": "Sobre os recursos da guia Revisão e a recuperação de edições anteriores em documentos do Microsoft Word, é INCORRETO afirmar que:",
  "options": [
   "com Controlar Alterações ativo, inserções e exclusões podem ser registradas para aceitação ou rejeição posterior",
   "um comentário é uma anotação de revisão e, por si só, não altera o conteúdo do texto do documento",
   "aceitar uma alteração controlada faz a modificação passar a integrar o texto final do documento",
   "o Ctrl+Z, que desfaz uma edição local, equivale a restaurar versão anterior de arquivo compartilhado",
   "comparar documentos auxilia a identificar as diferenças existentes entre duas versões do arquivo"
  ],
  "answer": 3,
  "explanation": "A afirmação incorreta é a que equipara Ctrl+Z a restaurar uma versão anterior: Ctrl+Z desfaz ações recentes na edição local, enquanto o histórico de versões de um arquivo salvo em local colaborativo, como OneDrive ou SharePoint, recupera estados anteriores do arquivo inteiro, a depender de permissões e disponibilidade. As demais são corretas: Controlar Alterações registra inserções e exclusões para aceite ou rejeição; comentário é anotação e não modifica o texto; aceitar uma alteração a incorpora ao texto final; e comparar documentos mostra as diferenças entre duas versões do mesmo arquivo.",
  "lawRef": "Word — Revisão: Controlar Alterações, comentários, comparação e versões"
 },
 {
  "id": "info-m04-autoral-05",
  "origem": "autoral-ia",
  "q": "Uma pessoa vai distribuir um relatório finalizado a vários leitores, que não precisam do Word nem pretendem editar o texto, preservando a aparência do documento. O procedimento mais adequado é:",
  "options": [
   "salvar o arquivo como modelo (.dotx), formato que fixa a aparência e dispensa o uso do Word",
   "usar Arquivo > Exportar (ou Salvar como) e escolher o formato PDF",
   "renomear a extensão do arquivo de .docx para .pdf diretamente no Explorador de Arquivos",
   "salvar no formato .doc, um formato legado que impede qualquer edição do documento",
   "usar somente a Visualização de Impressão, que já gera um arquivo próprio para distribuição"
  ],
  "answer": 1,
  "explanation": "A exportação para PDF produz uma saída voltada à apresentação e à distribuição, que em muitos cenários preserva a aparência e pode ser lida sem o Word. O modelo .dotx é uma estrutura inicial reutilizável, feita para ser aberta no Word e criar novos documentos; não é formato de distribuição somente leitura. Trocar a extensão no Explorador de Arquivos não converte o conteúdo, e o arquivo resultante não abre corretamente. O .doc é formato legado e continua editável. A Visualização de Impressão apenas mostra como ficará a página e não altera o conteúdo nem gera arquivo; para isso seria necessário exportar ou imprimir em PDF.",
  "lawRef": "Word — formatos .docx, .dotx, .doc e exportação para PDF"
 },
 {
  "id": "info-m04-autoral-06",
  "origem": "autoral-ia",
  "q": "Considere o uso de tabelas em um documento do Microsoft Word, inseridas pela guia Inserir. Assinale a alternativa correta sobre elas:",
  "options": [
   "permitem mesclar e dividir células, aplicar bordas e repetir linhas de cabeçalho",
   "oferecem os mesmos recursos de cálculo de uma planilha do Excel, incluindo tabelas dinâmicas",
   "são criadas pelo recurso Colunas, da guia Layout, que organiza o texto em forma de tabela",
   "são inseridas pela guia Revisão, que concentra os comandos de tabelas e de comentários",
   "não permitem ordenar linhas, pois a ordenação de dados existe somente no Excel"
  ],
  "answer": 0,
  "explanation": "Tabelas do Word organizam informações em linhas, colunas e células, e permitem mesclar e dividir células, aplicar bordas, ordenar linhas e repetir linhas de cabeçalho em várias páginas. Embora aceitem campos e fórmulas simples, não têm as possibilidades de cálculo de uma planilha, e tabelas dinâmicas são recurso do Excel. O recurso Colunas cria colunas jornalísticas de texto, que não são tabela. A inserção de tabelas é feita pela guia Inserir (grade de linhas e colunas), e a guia Revisão trata de ortografia, comentários e controle de alterações. A ordenação de linhas também existe nas tabelas do Word.",
  "lawRef": "Word — tabelas: mesclar, dividir, bordas, ordenar e repetir cabeçalho"
 },
 {
  "id": "info-m04-autoral-07",
  "origem": "autoral-ia",
  "q": "Qual atalho de teclado, no Word para Windows, abre a caixa que permite substituir uma palavra por outra em todo o documento?",
  "options": [
   "Ctrl+F, que abre o painel de pesquisa de trechos do texto",
   "Ctrl+P, que abre as opções de impressão do documento",
   "Ctrl+Z, que desfaz a última ação realizada no documento",
   "Ctrl+H, que abre a janela de Localizar e Substituir",
   "Ctrl+X, que recorta o trecho selecionado para a área de transferência"
  ],
  "answer": 3,
  "explanation": "Ctrl+H abre Localizar e Substituir, onde se informa o texto procurado e o texto novo e se pode substituir cada ocorrência ou todas. Como a substituição global pode alterar trechos indesejados, convém conferir as ocorrências e as opções de pesquisa antes de confirmar. Ctrl+F abre a pesquisa, que apenas localiza trechos, sem substituí-los. Ctrl+P abre a tela de impressão, com impressora, páginas e cópias. Ctrl+Z desfaz a última ação, não troca palavras por outras. Ctrl+X recorta a seleção para a área de transferência, retirando-a do texto. Em ambientes Windows esses atalhos são os usuais, mas podem variar conforme idioma e versão.",
  "lawRef": "Word (Windows) — atalhos Ctrl+H, Ctrl+F, Ctrl+P, Ctrl+Z e Ctrl+X"
 },
 {
  "id": "info-m04-autoral-08",
  "origem": "autoral-ia",
  "q": "Um relatório deve exibir a numeração de páginas no rodapé, exceto na capa, que é a primeira página. Qual configuração atende ao pedido?",
  "options": [
   "Inserir uma quebra de página após a capa, o que passa a remover a numeração apenas da capa",
   "Inserir o número de página no rodapé e marcar a opção Primeira Página Diferente nas opções de cabeçalho e rodapé",
   "Apagar o número digitado na página da capa, o que o removeria somente dessa página",
   "Aplicar uma marca-d'água na capa para cobrir o número de página exibido nela",
   "Inserir o número no cabeçalho, pois o rodapé não admite numeração diferenciada na capa"
  ],
  "answer": 1,
  "explanation": "A opção Primeira Página Diferente faz a primeira página ter cabeçalho e rodapé próprios, de modo que o número de página no rodapé aparece nas demais e fica de fora da capa. A quebra de página só inicia nova página e não altera a numeração da capa. Apagar o número em uma página sem ativar essa opção o remove de todas as páginas da seção, porque o rodapé é compartilhado. A marca-d'água é um elemento visual de fundo; não substitui a configuração e não oculta o número de forma adequada. Mudar o número para o cabeçalho não resolve nada, pois tanto o cabeçalho quanto o rodapé aceitam a configuração de primeira página diferente.",
  "lawRef": "Word — numeração de páginas, rodapé e Primeira Página Diferente"
 },
 {
  "id": "info-m04-autoral-09",
  "origem": "autoral-ia",
  "q": "Compare o recuo esquerdo e o recuo da primeira linha de um parágrafo no Word. É correto afirmar que:",
  "options": [
   "os dois deslocam o parágrafo inteiro, diferindo apenas no valor padrão em centímetros",
   "o recuo esquerdo altera a margem da página inteira, e o da primeira linha, a do parágrafo",
   "o recuo da primeira linha é formatação de caracteres, e o recuo esquerdo, de parágrafo",
   "o texto justificado é o resultado de aplicar o recuo da primeira linha a todas as linhas",
   "o recuo esquerdo desloca todas as linhas do parágrafo, e o da primeira linha afeta só a linha inicial"
  ],
  "answer": 4,
  "explanation": "Recuos são formatação de parágrafo. O recuo esquerdo desloca todas as linhas do parágrafo em relação à margem; o recuo da primeira linha desloca somente a linha inicial, como nos parágrafos usuais de textos corridos. Os dois não se confundem, e a diferença não é só o valor padrão. O recuo não altera a margem da página, que é configurada em Layout e vale para a página ou seção. Nenhum dos dois recuos é formatação de caracteres, que abrange fonte, tamanho, negrito e cor. Justificar é um alinhamento que ajusta espaços para alinhar as duas margens nas linhas apropriadas; não decorre de recuo.",
  "lawRef": "Word — recuos de parágrafo (esquerdo e da primeira linha) e alinhamento"
 },
 {
  "id": "info-m04-autoral-10",
  "origem": "autoral-ia",
  "q": "Na guia Página Inicial do Word, o botão Mostrar Tudo (¶) exibe as marcas de formatação. Sobre a marca de parágrafo, é correto afirmar que ela:",
  "options": [
   "é um caractere decorativo, e a sua exclusão não altera a estrutura nem a formatação do texto",
   "indica a presença de comentários de revisão no texto e mostra o nome do autor de cada um",
   "delimita o fim de um parágrafo e guarda as propriedades de formatação desse parágrafo",
   "marca apenas as quebras de página, sendo ignorada nas quebras de parágrafo comuns",
   "ao ser exibida, aplica negrito ao texto e muda a formatação do documento"
  ],
  "answer": 2,
  "explanation": "A marca de parágrafo delimita onde um parágrafo termina e carrega as propriedades de formatação dele, como alinhamento, recuos e espaçamento. Por isso, excluí-la une o parágrafo ao seguinte, que pode assumir a formatação resultante; ela não é um enfeite sem efeito. Comentários aparecem como anotações de revisão e não são sinalizados por essa marca. As quebras de página têm indicação própria e a marca de parágrafo aparece em todo fim de parágrafo, não somente nelas. O botão Mostrar Tudo apenas exibe as marcas na tela; ele não aplica negrito nem altera a formatação do conteúdo.",
  "lawRef": "Word — marca de parágrafo e botão Mostrar Tudo (¶)"
 }
];
