/* Banco de questões — Noções de Informática, módulo 03. Questões autorais (não são de banca).
 * Para acrescentar questões, veja content/questoes/LEIAME.md e rode "npm run questoes:check". */
window.BC_QUESTOES=window.BC_QUESTOES||{};
(window.BC_QUESTOES.info=window.BC_QUESTOES.info||{})[3]=[
 {
  "id": "info-m03-autoral-01",
  "origem": "autoral-ia",
  "q": "Sobre os termos Linux, kernel e distribuição, usados para descrever esses sistemas, assinale a alternativa correta.",
  "options": [
   "Linux designa tecnicamente o kernel; distribuições, como Debian e Fedora, o combinam com utilitários e pacotes",
   "Linux é um aplicativo de escritório, e Debian, Ubuntu e Fedora são versões do Windows adaptadas para servidores",
   "O kernel é o programa que interpreta comandos digitados, e a distribuição é apenas o terminal",
   "Todas as distribuições têm a mesma interface gráfica e os mesmos programas instalados",
   "Distribuição é o nome do kernel, e Linux é o conjunto de utilitários que acompanha cada distribuição"
  ],
  "answer": 0,
  "explanation": "Tecnicamente, Linux é o núcleo (kernel), responsável por gerenciar recursos. Uma distribuição, como Debian, Ubuntu ou Fedora, combina o kernel com utilitários, bibliotecas, gerenciador de pacotes e, quando aplicável, interface gráfica. Por isso não é correto dizer que Linux é um aplicativo de escritório, nem relacioná-lo ao Windows. Quem interpreta os comandos digitados é a shell, como o Bash, e o terminal apenas apresenta o ambiente para interagir com ela, de modo que o kernel não tem essa função. Também não existe interface idêntica em todas as distribuições, pois há ambientes como GNOME e KDE Plasma. E a alternativa que inverte os nomes de distribuição e kernel está errada.",
  "lawRef": "Linux — kernel x distribuição, shell e terminal"
 },
 {
  "id": "info-m03-autoral-02",
  "origem": "autoral-ia",
  "q": "Um administrador procura os arquivos de configuração do sistema e os logs. Em distribuições Linux comuns, os diretórios típicos para essas funções são, respectivamente:",
  "options": [
   "/home e /tmp",
   "/usr e /dev",
   "/etc e /var",
   "/var e /etc",
   "/proc e /home"
  ],
  "answer": 2,
  "explanation": "Em distribuições Linux comuns, /etc guarda arquivos de configuração do sistema, e /var guarda dados variáveis, como logs. Por isso a ordem correta é /etc e /var. A ordem inversa, /var e /etc, troca as funções. /home contém as pastas dos usuários, e /tmp guarda arquivos temporários, o que não corresponde ao enunciado. /usr abriga programas e dados compartilhados, e /dev contém interfaces de dispositivos. /proc apresenta informações virtuais de processos e do kernel. Todos esses diretórios fazem parte de uma única árvore iniciada em / (raiz), e dispositivos e partições são montados nela.",
  "lawRef": "Linux — hierarquia de diretórios: /etc, /var, /home, /tmp, /usr, /dev e /proc"
 },
 {
  "id": "info-m03-autoral-03",
  "origem": "autoral-ia",
  "q": "No terminal do Linux, um usuário quer mudar o nome do arquivo resumo.txt para revisao.txt, no mesmo diretório. Qual comando atende ao pedido?",
  "options": [
   "cp resumo.txt revisao.txt",
   "rm resumo.txt revisao.txt",
   "ls resumo.txt revisao.txt",
   "touch resumo.txt revisao.txt",
   "mv resumo.txt revisao.txt"
  ],
  "answer": 4,
  "explanation": "O comando mv move ou renomeia: mv resumo.txt revisao.txt renomeia o arquivo no mesmo diretório. O comando cp copia e mantém o original, de modo que passariam a existir dois arquivos, e não a troca de nome. O comando rm remove arquivos e, normalmente, não envia para uma lixeira, de modo que apagaria ambos os arquivos. O comando ls apenas lista arquivos, sem modificá-los. O comando touch pode criar arquivo vazio ou atualizar marcas temporais, e não renomeia. Em questões sobre comandos, os verbos determinam a resposta: listar, ls; copiar, cp; mover, mv; apagar, rm.",
  "lawRef": "Linux — comandos básicos no terminal: mv, cp, rm, ls e touch"
 },
 {
  "id": "info-m03-autoral-04",
  "origem": "autoral-ia",
  "q": "No Linux, qual comando atribui ao arquivo script.sh leitura, escrita e execução ao proprietário, e somente leitura e execução ao grupo e aos outros?",
  "options": [
   "chmod 777 script.sh",
   "chmod 755 script.sh",
   "chmod 700 script.sh",
   "chmod 750 script.sh",
   "chmod 644 script.sh"
  ],
  "answer": 1,
  "explanation": "Na notação octal, r vale 4, w vale 2 e x vale 1. O proprietário com rwx soma 7, e grupo e outros com r-x somam 5 cada, o que resulta em 755, isto é, rwxr-xr-x. O valor 777 daria rwx a todos, inclusive escrita ao grupo e aos outros. O valor 700 manteria o proprietário com rwx, mas retiraria todas as permissões do grupo e dos outros. O valor 750 daria r-x ao grupo e nenhuma permissão aos outros. O valor 644 daria rw- ao proprietário e apenas leitura aos demais, sem execução para ninguém. O comando chmod é o que altera permissões, conforme a autorização do usuário.",
  "lawRef": "Linux — permissões: chmod e notação octal (755)"
 },
 {
  "id": "info-m03-autoral-05",
  "origem": "autoral-ia",
  "q": "A listagem feita com o comando ls -l mostra a sequência -rwxr-xr-- para um arquivo. Qual interpretação está correta?",
  "options": [
   "É um diretório; o proprietário só lê, o grupo escreve e os outros executam",
   "É um arquivo regular, e todos os usuários podem ler, escrever e executar",
   "É um arquivo regular; proprietário e grupo têm rwx, e os outros não têm permissão alguma",
   "É um arquivo regular: proprietário com rwx, grupo com r-x e outros somente com r--",
   "É um link simbólico; o proprietário lê e executa, o grupo escreve e os outros leem"
  ],
  "answer": 3,
  "explanation": "O primeiro caractere, o hífen, indica arquivo regular. Em seguida vêm três trios: rwx para o proprietário (ler, escrever e executar), r-x para o grupo (ler e executar) e r-- para os outros (somente ler). Por isso a interpretação correta é a que descreve essas três permissões. Não se trata de diretório, que seria indicado por d. Não é verdade que todos possam escrever e executar, nem que grupo e proprietário tenham rwx sem que os outros tenham alguma permissão: os outros têm leitura. Também não se trata de link simbólico, indicado por l, e as permissões descritas nessa alternativa não correspondem aos trios exibidos.",
  "lawRef": "Linux — permissões: leitura de ls -l e trios rwx"
 },
 {
  "id": "info-m03-autoral-06",
  "origem": "autoral-ia",
  "q": "O arquivo lista.txt já contém texto. Em um shell como o Bash, qual é a diferença entre ls >> lista.txt e ls > lista.txt?",
  "options": [
   ">> acrescenta a saída do ls ao final do arquivo; > normalmente substitui o conteúdo existente",
   "O >> substitui todo o conteúdo do arquivo e o > acrescenta a saída ao final dele, sem apagar nada",
   "Ambos apenas exibem a saída na tela, sem gravar nada no arquivo lista.txt, que permanece igual",
   "O >> envia a saída do ls como entrada de outro comando, e o > grava no arquivo, substituindo-o",
   "Ambos excluem o arquivo lista.txt e criam outro com o mesmo nome, mas com conteúdo vazio"
  ],
  "answer": 0,
  "explanation": "O símbolo > direciona a saída para um arquivo, geralmente substituindo seu conteúdo anterior, enquanto >> acrescenta a saída ao final do arquivo. Por isso a alternativa que inverte os papéis está errada. Também não é verdade que ambos apenas exibam a saída na tela: o redirecionamento grava no arquivo em vez de mostrar o resultado. Quem envia a saída de um comando como entrada de outro é o pipe, representado por |, e não o >>. Por fim, nenhum dos dois exclui previamente o arquivo e recria um vazio como regra: o > substitui o conteúdo, e o >> mantém o que já existia.",
  "lawRef": "Linux — redirecionamento de saída: > x >> no shell"
 },
 {
  "id": "info-m03-autoral-07",
  "origem": "autoral-ia",
  "q": "Em um diretório com vários arquivos, qual é o resultado do comando ls | grep pdf digitado no terminal?",
  "options": [
   "Procura a palavra pdf dentro do conteúdo de todos os arquivos PDF e mostra as linhas encontradas",
   "Grava em um arquivo chamado grep a lista de arquivos do diretório que são do tipo PDF",
   "Lista os arquivos e mostra só as linhas da listagem que contêm “pdf”, sem examinar o conteúdo",
   "Apaga os arquivos cujo nome contém pdf, pois o grep remove as linhas que correspondem ao padrão",
   "Converte para PDF os arquivos do diretório e lista o resultado da conversão"
  ],
  "answer": 2,
  "explanation": "O pipe (|) envia a saída do ls como entrada do grep, que procura padrões em texto. O resultado é a lista de nomes cujas linhas contêm “pdf”, sem examinar o conteúdo interno dos arquivos. Por isso não procura a palavra dentro dos PDFs: para pesquisar conteúdo, o grep teria de receber os próprios arquivos. Também não grava em um arquivo chamado grep, pois isso exigiria redirecionamento com >. O grep apenas filtra linhas e nunca apaga arquivos, e o comando não converte formatos. A saída da listagem e o filtro por padrão de texto formam a combinação típica entre ls e grep.",
  "lawRef": "Linux — pipes: ls | grep filtra a listagem"
 },
 {
  "id": "info-m03-autoral-08",
  "origem": "autoral-ia",
  "q": "Um iniciante confunde os termos root, sudo e o diretório /. Sobre esses três elementos, assinale a alternativa correta.",
  "options": [
   "root e / são a mesma coisa: a raiz da árvore de diretórios é também a conta administrativa do sistema",
   "sudo cria uma nova conta de usuário com privilégios de administrador e a mantém ativa",
   "sudo lista os arquivos ocultos de um diretório, que só o administrador pode visualizar",
   "O diretório /root é onde ficam as pastas pessoais de todos os usuários comuns do sistema",
   "root é a conta administrativa; sudo executa comandos com privilégios de outro usuário, se autorizado"
  ],
  "answer": 4,
  "explanation": "Root é a conta administrativa tradicional, e o diretório / é a raiz da árvore de diretórios: não são a mesma coisa, apesar de os nomes parecerem relacionados. O comando sudo permite executar comandos com privilégios autorizados de outro usuário, geralmente o administrador. Ele não cria contas nem as mantém ativas, e não serve para listar arquivos ocultos, tarefa ligada ao ls com opções adequadas. O diretório /root costuma ser a pasta pessoal do administrador, e as pastas dos usuários comuns ficam em /home. Por isso a alternativa que associa /root a todos os usuários comuns está errada.",
  "lawRef": "Linux — root, sudo e diretório raiz (/)"
 },
 {
  "id": "info-m03-autoral-09",
  "origem": "autoral-ia",
  "q": "Um aluno pergunta qual comando usar para instalar um programa no Linux. Sobre gerenciadores de pacotes, é correto afirmar:",
  "options": [
   "apt serve para todas as distribuições, e o dnf existe apenas no Windows",
   "apt é comum na família Debian e dnf na família Fedora; não existe comando de instalação universal",
   "Todo programa no Linux é instalado exclusivamente com o comando kill, aplicado ao nome do pacote",
   "O dnf é o gerenciador de Debian e Ubuntu, e o apt é exclusivo do Fedora",
   "Gerenciadores de pacotes não existem no Linux, que só instala programas compilando o código-fonte"
  ],
  "answer": 1,
  "explanation": "O apt é comum em distribuições da família Debian, como Debian e Ubuntu, e o dnf em sistemas da família Fedora. Não existe comando de instalação universal para todas as distribuições, e ainda há métodos como o Flatpak. Por isso é errado dizer que o apt serve a todas e que o dnf existe apenas no Windows. Inverter as famílias, atribuindo o dnf a Debian e Ubuntu e o apt ao Fedora, também é erro. O kill envia sinais para processos e nada tem a ver com instalação. Por fim, os gerenciadores de pacotes existem justamente para instalar, atualizar e remover programas com suas dependências, sem exigir compilação manual.",
  "lawRef": "Linux — gerenciadores de pacotes: apt e dnf"
 },
 {
  "id": "info-m03-autoral-10",
  "origem": "autoral-ia",
  "q": "Um usuário que vem do Windows quer entender como o Linux trata nomes e volumes de armazenamento. Qual afirmação está correta?",
  "options": [
   "O Linux identifica as partições por letras, como C: e D:, e separa diretórios por barra invertida",
   "Relatorio.txt e relatorio.txt são sempre o mesmo arquivo no Linux, pois os nomes ignoram maiúsculas e minúsculas",
   "O Linux não permite usar pendrives ou partições adicionais, pois não possui ponto de montagem",
   "Há uma árvore iniciada em /, partições são montadas em diretórios e nomes costumam diferenciar maiúsculas",
   "No Linux só há interface por terminal, e por isso não é possível mover arquivos em ambiente gráfico"
  ],
  "answer": 3,
  "explanation": "No Linux, os diretórios formam uma única árvore iniciada em / (raiz), e dispositivos e partições são montados em diretórios dela, em vez de receberem letras como C:. Os nomes geralmente diferenciam maiúsculas de minúsculas, de modo que Relatorio.txt e relatorio.txt podem coexistir. A barra de separação usual é /, e a barra invertida tem outros usos, como escape na shell. Por isso é errado falar em letras de unidade, dizer que os nomes sempre ignoram maiúsculas, ou negar o uso de pendrives, pois eles são montados na árvore. Também é errado afirmar que só existe terminal: ambientes como GNOME e KDE Plasma permitem mover arquivos graficamente.",
  "lawRef": "Linux — pontos de montagem, diferenciação de maiúsculas e comparação com o Windows"
 }
];
