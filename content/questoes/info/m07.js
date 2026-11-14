/* Banco de questões — Noções de Informática, módulo 07. Questões autorais (não são de banca).
 * Para acrescentar questões, veja content/questoes/LEIAME.md e rode "npm run questoes:check". */
window.BC_QUESTOES=window.BC_QUESTOES||{};
(window.BC_QUESTOES.info=window.BC_QUESTOES.info||{})[7]=[
 {
  "id": "info-m07-autoral-01",
  "origem": "autoral-ia",
  "q": "Uma equipe quer que o mesmo logotipo apareça em todos os slides de uma apresentação, sem copiá-lo slide a slide. O procedimento mais adequado no PowerPoint é:",
  "options": [
   "aplicar uma transição ao primeiro slide, que repassa seus objetos aos demais slides",
   "inseri-lo nas anotações do apresentador, que são exibidas ao público em todos os slides",
   "inseri-lo no Slide Mestre (guia Exibir), para que os layouts vinculados herdem o elemento",
   "trocar o tema, pois o tema grava automaticamente as imagens do usuário em todos os slides",
   "copiá-lo e colá-lo na Classificação de Slides, que o replica em todos os slides da sequência"
  ],
  "answer": 2,
  "explanation": "O Slide Mestre (guia Exibir) centraliza elementos e formatações compartilhados pelos layouts; um logotipo colocado nele aparece nos slides que usam esses layouts e pode ser alterado em um só lugar. Transição é o efeito de passagem de um slide para outro e não repassa objetos. As anotações do apresentador são apoio a quem apresenta e não fazem parte do que o público vê. O tema reúne cores, fontes e efeitos, e não guarda imagens do usuário por conta própria. Já a Classificação de Slides serve para organizar a ordem dos slides, e colar o objeto ali não o replica nos demais.",
  "lawRef": "PowerPoint — Slide Mestre: elementos compartilhados entre layouts"
 },
 {
  "id": "info-m07-autoral-02",
  "origem": "autoral-ia",
  "q": "Em um slide, o título deve surgir depois da imagem, ao clique do mouse, e o slide seguinte deve entrar com efeito de dissolução. Esses dois efeitos são, respectivamente:",
  "options": [
   "animação aplicada ao objeto título e transição aplicada à troca de slides",
   "transição aplicada ao objeto título e animação aplicada à troca de slides",
   "animação nos dois casos, pois ambos usam os mesmos recursos da guia Animações",
   "transição nos dois casos, pois ambos ocorrem durante a exibição dos slides",
   "layout aplicado ao título e tema aplicado à troca entre os slides da apresentação"
  ],
  "answer": 0,
  "explanation": "Animação é aplicada a um objeto dentro do slide: fazer o título surgir depois da imagem, ao clique, define entrada, ordem e acionamento desse objeto. Transição é o efeito visual da passagem de um slide para outro, como a dissolução do slide seguinte. Por isso é errado inverter os papéis, como se a transição atuasse sobre o título ou a animação sobre a troca de slides. Também é errado dizer que os dois efeitos são o mesmo recurso só porque ocorrem na exibição: ficam em guias distintas (Animações e Transições). Layout e tema não controlam efeitos: o layout define espaços reservados e o tema reúne cores, fontes e efeitos visuais.",
  "lawRef": "PowerPoint — animação (objeto) x transição (troca de slides)"
 },
 {
  "id": "info-m07-autoral-03",
  "origem": "autoral-ia",
  "q": "Durante a edição, o apresentador quer iniciar a exibição exatamente a partir do slide que está selecionado, e não do primeiro. No Windows, o atalho usual para isso é:",
  "options": [
   "F5, que inicia a exibição desde o primeiro slide",
   "Ctrl+M, que insere um novo slide depois do atual",
   "Esc, que reinicia a exibição a partir do slide atual",
   "Ctrl+N, que abre o slide atual em modo de exibição",
   "Shift+F5, que exibe a partir do slide atual"
  ],
  "answer": 4,
  "explanation": "No Windows, Shift+F5 inicia a apresentação a partir do slide atual, o que atende à necessidade descrita. F5 inicia a exibição desde o primeiro slide, ignorando qual está selecionado. Ctrl+M insere um novo slide depois do atual, ou seja, é comando de edição e não de exibição. Esc encerra a apresentação em andamento, e não a reinicia. Ctrl+N cria uma nova apresentação em branco e não exibe a atual. Os atalhos podem variar com versão, idioma e foco, mas esses são os usuais do PowerPoint em português para Windows.",
  "lawRef": "PowerPoint — atalhos F5, Shift+F5, Ctrl+M e Esc"
 },
 {
  "id": "info-m07-autoral-04",
  "origem": "autoral-ia",
  "q": "Considere os conceitos de layout e de tema no PowerPoint. Assinale a alternativa que descreve corretamente a diferença entre eles:",
  "options": [
   "o layout reúne cores, fontes e efeitos; o tema define a disposição dos espaços reservados",
   "o layout define a disposição dos espaços reservados no slide; o tema reúne cores, fontes e efeitos",
   "ambos definem apenas a ordem das animações dos objetos que aparecem em cada slide",
   "o layout controla a passagem entre slides; o tema controla os efeitos de entrada dos objetos",
   "o layout só pode ser alterado no Slide Mestre; o tema só pode ser alterado em cada slide individual"
  ],
  "answer": 1,
  "explanation": "O layout define a disposição e os tipos de espaços reservados (título, corpo, imagem) de cada slide; o tema reúne cores, fontes e efeitos. A alternativa que troca os conceitos inverte as definições. Dizer que ambos tratam da ordem das animações é falso: a ordem e o acionamento das animações são configurados por objeto, no painel de animação. Atribuir ao layout o controle da passagem entre slides o confunde com a transição, e atribuir ao tema os efeitos de entrada dos objetos o confunde com a animação. Por fim, o layout pode ser escolhido para cada slide, e não apenas no Slide Mestre, e o tema não se limita ao slide individual.",
  "lawRef": "PowerPoint — layout (espaços reservados) x tema (cores, fontes, efeitos)"
 },
 {
  "id": "info-m07-autoral-05",
  "origem": "autoral-ia",
  "q": "É INCORRETO afirmar, sobre as anotações do apresentador e o modo do apresentador do PowerPoint, que:",
  "options": [
   "as anotações são textos de apoio destinados a quem apresenta",
   "é possível imprimir páginas de anotações, com o slide e o texto de apoio",
   "o modo do apresentador pode mostrar anotações e controles só a quem apresenta, com telas distintas",
   "com o modo do apresentador em telas distintas, as anotações aparecem também ao público",
   "duplicar a tela não equivale a usar o modo do apresentador com exibições distintas"
  ],
  "answer": 3,
  "explanation": "A afirmação incorreta é a de que o público vê as anotações na tela de projeção. As anotações do apresentador são apoio privado: no modo do apresentador, com exibição configurada em telas distintas, quem apresenta vê anotações e controles, enquanto o público vê apenas os slides. As demais afirmações são verdadeiras: as anotações são textos de apoio a quem apresenta; podem ser impressas em páginas de anotações; o modo do apresentador separa o que cada pessoa vê quando as telas estão configuradas para isso; e duplicar a tela não equivale a esse modo, pois mostra o mesmo conteúdo nas duas telas.",
  "lawRef": "PowerPoint — anotações e modo do apresentador"
 },
 {
  "id": "info-m07-autoral-06",
  "origem": "autoral-ia",
  "q": "Uma apresentação com transições, animações e vídeo será distribuída como arquivo estático para leitura. Sobre exportá-la para PDF, é correto afirmar que:",
  "options": [
   "o PDF serve à distribuição estática, mas pode não preservar transições, animações e mídia como no original",
   "o PDF preserva integralmente transições, animações e vídeos, com a mesma execução do PowerPoint",
   "o PDF mantém a apresentação editável como .pptx, sendo apenas uma extensão renomeada",
   "a exportação para PDF só é possível depois de ocultar todos os slides da apresentação",
   "a exportação para PDF apaga o arquivo .pptx original assim que a conversão termina"
  ],
  "answer": 0,
  "explanation": "O PDF é adequado para distribuição estática, mas pode não preservar transições, efeitos interativos e mídia como no arquivo original: ele serve para leitura, não para exibição animada. Por isso é falso que preserve integralmente animações e vídeos. Também é falso que seja apenas um .pptx renomeado, pois se trata de outro formato, que não é editável como apresentação. Não existe exigência de ocultar slides para exportar. Por fim, exportar cria um novo arquivo e não apaga o .pptx original, que continua disponível para edição.",
  "lawRef": "PowerPoint — exportação para PDF e limites de preservação"
 },
 {
  "id": "info-m07-autoral-07",
  "origem": "autoral-ia",
  "q": "Ao preparar uma apresentação, o autor oculta um dos slides. Quanto ao efeito dessa ação, assinale a alternativa correta:",
  "options": [
   "o slide é excluído definitivamente do arquivo e não pode mais ser reexibido",
   "o slide passa a ser exibido apenas no modo Normal e some do modo de edição seguinte",
   "o slide continua no arquivo, mas deixa de ser exibido na sequência usual da apresentação",
   "o slide é movido automaticamente para o final, sem nenhuma alteração na exibição",
   "o slide é convertido em página de anotações do apresentador, sem aparecer na lista de slides"
  ],
  "answer": 2,
  "explanation": "Ocultar um slide impede sua exibição na sequência usual da apresentação, mas não o apaga do arquivo: ele continua disponível para edição e pode voltar a ser exibido ao desfazer a ocultação. Não é exclusão definitiva, como sugere a primeira alternativa errada. Também não é correto dizer que passa a aparecer só no modo Normal e some depois, nem que é movido para o final: a posição na ordem é a mesma. Por fim, ocultar não converte o slide em página de anotações; as anotações são texto de apoio vinculado ao slide, e não o próprio slide transformado.",
  "lawRef": "PowerPoint — ocultar slide x excluir slide"
 },
 {
  "id": "info-m07-autoral-08",
  "origem": "autoral-ia",
  "q": "Para tornar uma apresentação mais acessível a pessoas que usam leitores de tela, uma boa prática, entre as abaixo, é:",
  "options": [
   "substituir os textos por imagens, pois o leitor de tela descreve qualquer figura sem texto alternativo",
   "usar cores de baixo contraste entre texto e fundo, para reduzir o cansaço visual do público",
   "concentrar todo o conteúdo em um único slide, para o leitor de tela percorrê-lo de uma vez",
   "deixar os slides sem título, para que o leitor de tela não leia o mesmo texto em duplicidade",
   "incluir texto alternativo nas imagens e usar títulos de slides significativos"
  ],
  "answer": 4,
  "explanation": "Texto alternativo nas imagens permite que leitores de tela descrevam a figura a quem não a enxerga, e títulos de slides significativos ajudam a navegar e a entender a estrutura. Substituir texto por imagens piora a acessibilidade: sem texto alternativo, a figura fica sem descrição. Cores de baixo contraste dificultam a leitura, e a boa prática é o contrário, o contraste adequado. Concentrar tudo em um único slide prejudica a ordem de leitura e a organização; a orientação é evitar texto excessivo em cada slide. Remover os títulos também é errado, pois cada slide deve ter um título que o identifique.",
  "lawRef": "PowerPoint — acessibilidade: texto alternativo, títulos e contraste"
 },
 {
  "id": "info-m07-autoral-09",
  "origem": "autoral-ia",
  "q": "Um arquivo de apresentação é salvo com a extensão .ppsx. Ao ser aberto, o comportamento associado a esse formato é:",
  "options": [
   "abrir sempre no modo Classificação de Slides, sem permitir a exibição dos slides em tela cheia",
   "iniciar diretamente a exibição dos slides, sem passar pelo modo de edição Normal",
   "abrir apenas as anotações do apresentador, sem os slides",
   "ser o formato exclusivo de apresentações com macros habilitadas",
   "ser o formato padrão de documentos de texto do Word"
  ],
  "answer": 1,
  "explanation": "O formato .ppsx está associado à exibição direta como apresentação: ao abrir o arquivo, os slides começam a ser exibidos, sem passar pelo modo Normal de edição. Classificação de Slides é um modo de exibição, e não uma extensão, e não impede a exibição. O arquivo não guarda apenas anotações. Também não é exclusivo de macros, pois apresentações com macros usam outros formatos, e nada tem a ver com texto do Word, cujos formatos usuais são .docx e .doc. O .pptx continua sendo o formato usual de edição. Lembre que o .ppsx não é o único meio de executar slides: qualquer apresentação pode ser exibida com F5.",
  "lawRef": "PowerPoint — formatos .pptx (edição) e .ppsx (exibição direta)"
 },
 {
  "id": "info-m07-autoral-10",
  "origem": "autoral-ia",
  "q": "Em um slide há dois objetos animados. O segundo deve começar automaticamente assim que o primeiro terminar sua animação, sem novo clique. A opção de início adequada para o segundo é:",
  "options": [
   "Ao clicar, que exige novo clique do apresentador para iniciar",
   "Com o anterior, que inicia junto com a animação anterior",
   "o avanço automático por tempo da transição, que troca o slide",
   "Após o anterior, que inicia quando a animação anterior termina",
   "o Painel de Seleção, que organiza objetos sobrepostos e define o início"
  ],
  "answer": 3,
  "explanation": "Quando o segundo objeto deve iniciar sozinho assim que o primeiro terminar, usa-se o início Após o anterior. A opção Ao clicar exige novo clique do apresentador, o que contraria o enunciado. Com o anterior faz as duas animações começarem juntas, e não em sequência. O avanço automático por tempo, nas opções de transição, controla quando o slide é trocado, e não o início de uma animação de objeto. O Painel de Seleção ajuda a escolher e ordenar objetos sobrepostos, mas não define o acionamento das animações. Assim, apenas Após o anterior atende à sequência automática descrita.",
  "lawRef": "PowerPoint — início de animação: ao clicar, com o anterior, após o anterior"
 }
];
