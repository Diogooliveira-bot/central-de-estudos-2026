/* Banco de questões — Noções de Informática, módulo 02. Questões autorais (não são de banca).
 * Para acrescentar questões, veja content/questoes/LEIAME.md e rode "npm run questoes:check". */
window.BC_QUESTOES=window.BC_QUESTOES||{};
(window.BC_QUESTOES.info=window.BC_QUESTOES.info||{})[2]=[
 {
  "id": "info-m02-autoral-01",
  "origem": "autoral-ia",
  "q": "Ao sair da mesa por alguns minutos, um servidor pressiona Win+L. Sobre o efeito desse atalho no Windows, assinale a alternativa correta.",
  "options": [
   "Encerra a sessão do usuário e fecha os programas abertos, exigindo nova autenticação ao voltar",
   "Bloqueia a sessão: os programas continuam abertos, e é preciso autenticar-se para voltar",
   "Desliga o computador por completo, liberando a memória e interrompendo os processos em execução",
   "Hiberna o computador, gravando o conteúdo da RAM no disco e desligando a energia",
   "Abre o Explorador de Arquivos na pasta do usuário, para localizar os documentos recentes"
  ],
  "answer": 1,
  "explanation": "Win+L bloqueia a estação: a sessão do usuário continua ativa, os programas seguem abertos e é preciso se autenticar para voltar. Por isso não equivale a encerrar a sessão, que fecha os aplicativos do usuário, nem a desligar o computador, que interrompe os processos em execução, nem a hibernar, que grava o estado da memória e desliga a energia. Também não abre o Explorador de Arquivos: esse atalho é Win+E. A distinção entre bloquear, encerrar sessão, desligar e hibernar é uma pegadinha comum, e a ação do bloqueio é a de proteger a tela contra acesso de terceiros sem perder o trabalho em andamento.",
  "lawRef": "Windows 10 e 11 — atalhos: Win+L bloqueia a sessão"
 },
 {
  "id": "info-m02-autoral-02",
  "origem": "autoral-ia",
  "q": "Assinale a alternativa em que o atalho de teclado está associado à sua função usual no Windows 10 e no Windows 11.",
  "options": [
   "Win+D: bloquear a estação de trabalho",
   "Alt+Tab: abrir a caixa Executar",
   "Ctrl+Shift+Esc: abrir o Explorador de Arquivos",
   "Win+E: abrir o Explorador de Arquivos",
   "Win+R: mostrar ou ocultar a área de trabalho"
  ],
  "answer": 3,
  "explanation": "Win+E abre o Explorador de Arquivos, e essa é a associação correta. Win+D mostra ou oculta a área de trabalho, e não bloqueia a estação, função de Win+L. Alt+Tab alterna entre janelas abertas, e não abre a caixa Executar, que é aberta por Win+R. Ctrl+Shift+Esc abre o Gerenciador de Tarefas, e não o Explorador de Arquivos. Por fim, Win+R abre Executar, e não mostra a área de trabalho. As alternativas erradas trocam as funções entre atalhos reais, o que é uma forma frequente de distrator; memorizar o par atalho-função de uso frequente evita o erro.",
  "lawRef": "Windows 10 e 11 — atalhos: Win+E, Win+D, Win+R, Alt+Tab e Ctrl+Shift+Esc"
 },
 {
  "id": "info-m02-autoral-03",
  "origem": "autoral-ia",
  "q": "Em novembro de 2026, o que se pode afirmar corretamente sobre o ciclo comum de suporte do sistema Windows 10?",
  "options": [
   "Terminou em 14/10/2025; o sistema segue funcionando, e existem programas específicos de atualizações estendidas",
   "O suporte geral continua sem data de término, e o Windows 10 recebe normalmente todas as atualizações de segurança",
   "O Windows 10 deixou de funcionar quando o suporte acabou, pois o sistema se bloqueia na data final",
   "O suporte terminou em 2021, junto com o lançamento do Windows 11, que o substituiu em todos os computadores",
   "O fim do suporte obriga todos os usuários a migrar para o Windows 11 em até 30 dias, sob pena de multa"
  ],
  "answer": 0,
  "explanation": "O ciclo comum de suporte do Windows 10 terminou em 14 de outubro de 2025. Isso não faz o sistema parar de funcionar: ele continua operando, mas deixa de receber o ciclo comum de atualizações de segurança, e existem programas específicos de atualizações estendidas, com regras próprias. Estão erradas as ideias de que o suporte continua sem término e de que o sistema se bloqueia na data final. Também é falso que o suporte tenha terminado em 2021 com a chegada do Windows 11, que apenas passou a coexistir com o Windows 10. E não existe obrigação legal ou prazo de 30 dias com multa para migrar de versão.",
  "lawRef": "Windows 10 e 11 — ciclo de suporte: fim do suporte geral do Windows 10 em 14/10/2025"
 },
 {
  "id": "info-m02-autoral-04",
  "origem": "autoral-ia",
  "q": "Ao instalar um programa, o Windows exibe uma janela pedindo confirmação ou credenciais de administrador. Esse comportamento é típico de qual recurso?",
  "options": [
   "Windows Update, que verifica e instala atualizações aplicáveis ao sistema e a seus componentes",
   "Firewall do Windows, que filtra comunicações de rede segundo regras de entrada e saída",
   "BitLocker, que criptografa o volume em que o sistema está instalado para proteger dados",
   "Histórico de arquivos, que guarda versões anteriores de documentos para recuperação",
   "Controle de Conta de Usuário (UAC), que pede confirmação quando a operação exige elevação"
  ],
  "answer": 4,
  "explanation": "O Controle de Conta de Usuário (UAC) solicita confirmação ou credenciais quando uma operação exige elevação de privilégios, como instalar programas ou alterar configurações do sistema. Isso apoia a política de usar somente os privilégios necessários. O Windows Update distribui atualizações e não pede elevação para cada instalação de programa. O firewall filtra comunicações de rede segundo regras. O BitLocker, quando disponível e configurado, criptografa volumes para proteger dados em repouso. O histórico de arquivos e os recursos de versões atuam na recuperação de documentos. Nenhum deles tem como função específica pedir autorização antes de executar uma operação administrativa.",
  "lawRef": "Windows 10 e 11 — segurança: Controle de Conta de Usuário (UAC) e elevação"
 },
 {
  "id": "info-m02-autoral-05",
  "origem": "autoral-ia",
  "q": "Sobre o BitLocker, quando está disponível e configurado em um computador com Windows, é correto afirmar:",
  "options": [
   "Dispensa o backup, pois a criptografia do volume impede qualquer perda de arquivos",
   "Atua como antimalware, bloqueando vírus e ransomware antes de chegarem ao computador",
   "Pode criptografar volumes para proteger dados em repouso, mas não substitui o backup",
   "Filtra o tráfego de rede por regras de entrada e saída, bloqueando conexões não autorizadas",
   "Compacta os arquivos do volume para economizar espaço, reduzindo o tamanho de documentos"
  ],
  "answer": 2,
  "explanation": "O BitLocker pode criptografar volumes, protegendo dados em repouso, por exemplo se o equipamento for perdido ou furtado. Isso não evita perda por exclusão acidental nem por ransomware após os dados serem acessados por uma sessão autorizada, razão pela qual o backup continua necessário. Não é antimalware: a busca por programas maliciosos cabe a ferramentas como o Microsoft Defender. Também não é firewall, que filtra comunicações de rede segundo regras. Por fim, criptografar não é compactar: compactação agrupa e pode reduzir espaço, mas é outra operação e não protege o conteúdo contra acesso indevido.",
  "lawRef": "Windows 10 e 11 — segurança: BitLocker e criptografia de volumes"
 },
 {
  "id": "info-m02-autoral-06",
  "origem": "autoral-ia",
  "q": "Um disco físico de 1 TB foi dividido em duas partes, e cada uma recebeu NTFS. Sobre os conceitos envolvidos, assinale a alternativa correta.",
  "options": [
   "Disco, partição e sistema de arquivos são o mesmo conceito, e NTFS é o nome do disco físico",
   "O disco é a unidade física, a partição o divide, e cada partição pode receber um sistema de arquivos",
   "As partições são criadas a partir do sistema de arquivos, que é o equipamento onde os dados são gravados",
   "NTFS é um tipo de partição física que só pode existir em SSD e nunca em HDD",
   "Um disco físico só pode ter uma partição, pois o NTFS não permite dividir o armazenamento"
  ],
  "answer": 1,
  "explanation": "Unidade física, partição e sistema de arquivos são níveis diferentes: uma unidade física pode conter partições, e uma partição pode receber um sistema de arquivos, como o NTFS, que suporta permissões e outros recursos. Por isso o disco de 1 TB dividido em duas partes, ambas com NTFS, é um caso perfeitamente possível. Não são o mesmo conceito, e NTFS não é o nome do disco. O sistema de arquivos não é o equipamento: ele organiza nomes, localização e acesso. NTFS não é tipo de partição restrito a SSD, pois também é usado em HDD. E um disco pode ter várias partições, sem que o NTFS o impeça.",
  "lawRef": "Windows 10 e 11 — unidades, partições e sistemas de arquivos (NTFS)"
 },
 {
  "id": "info-m02-autoral-07",
  "origem": "autoral-ia",
  "q": "Um arquivo foi excluído, por engano, de uma pasta sincronizada com a nuvem. Qual afirmação descreve corretamente o risco e a recuperação?",
  "options": [
   "Nada muda na nuvem, pois a sincronização só envia arquivos novos e nunca replica exclusões",
   "A exclusão é sempre irreversível, pois serviços de nuvem não têm lixeira nem histórico de versões",
   "O arquivo volta sozinho em poucos minutos, pois o Windows mantém cópia automática de tudo que é apagado",
   "A recuperação é garantida por tempo indeterminado, pois a lixeira do provedor nunca apaga nenhum item",
   "A sincronização pode replicar a exclusão; a recuperação depende de lixeira ou versões do provedor"
  ],
  "answer": 4,
  "explanation": "A sincronização transmite alterações e pode replicar exclusões, de modo que apagar o arquivo na pasta sincronizada pode removê-lo também no armazenamento remoto. A recuperação, quando possível, depende da lixeira ou do histórico de versões do provedor, recursos que têm prazos e limitações. Estão errados: afirmar que exclusões nunca são replicadas, que a exclusão é sempre irreversível por não haver lixeira, que o Windows devolve o arquivo sozinho e que a lixeira do provedor garante a recuperação por tempo indeterminado. Nenhuma dessas ideias corresponde ao funcionamento dos serviços de nuvem integrados, como o OneDrive, e não se deve presumir recuperação garantida.",
  "lawRef": "Windows 10 e 11 — arquivos em nuvem: sincronização, exclusão e recuperação"
 },
 {
  "id": "info-m02-autoral-08",
  "origem": "autoral-ia",
  "q": "Depois de instalar um programa com defeito, um usuário restaurou o sistema a um ponto de restauração anterior, esperando recuperar também um documento excluído na semana passada. O que é correto afirmar?",
  "options": [
   "A restauração não é backup de documentos; para recuperá-lo, caberiam a Lixeira, um backup ou versões",
   "A restauração recupera todos os documentos excluídos, pois grava cópia integral dos arquivos pessoais",
   "A restauração reinstala o sistema do zero e apaga todos os dados do disco, inclusive os documentos",
   "O ponto de restauração copia cada pasta pessoal, e por isso funciona como um backup de arquivos",
   "Depois de uma restauração do sistema, nenhum documento excluído pode ser recuperado por qualquer meio"
  ],
  "answer": 0,
  "explanation": "Restaurar configurações do sistema não necessariamente recupera um documento excluído: ponto de restauração, backup de arquivos e reinstalação ou redefinição do sistema são recursos distintos, e nenhum deles é substituto universal dos demais. Para recuperar o documento, o recurso adequado pode ser a Lixeira, um backup ou o histórico de versões, conforme o caso. Por isso é errado dizer que a restauração recupera tudo, que ela copia cada pasta pessoal como um backup, ou que reinstala o sistema do zero apagando todos os dados, o que descreveria outro procedimento. Também é errado afirmar que nada pode ser recuperado depois de uma restauração.",
  "lawRef": "Windows 10 e 11 — recuperação: ponto de restauração x backup de arquivos"
 },
 {
  "id": "info-m02-autoral-09",
  "origem": "autoral-ia",
  "q": "No Windows, em condições usuais, qual das alternativas descreve corretamente os atalhos Alt+F4 e Ctrl+F4?",
  "options": [
   "Ctrl+F4 fecha a janela ativa; Alt+F4 fecha apenas o documento ou a aba atual do aplicativo",
   "Alt+F4 fecha a janela ativa; Ctrl+Shift+Esc fecha apenas o documento ou a aba do aplicativo",
   "Alt+F4 fecha a janela ou o aplicativo ativo; Ctrl+F4 fecha documento ou aba onde houver suporte",
   "Win+F4 fecha a janela ativa; Alt+Tab fecha apenas o documento ou a aba em uso no aplicativo aberto",
   "Ctrl+F4 desliga o computador por completo; Alt+F4 bloqueia a sessão do usuário atual"
  ],
  "answer": 2,
  "explanation": "Alt+F4 fecha a janela ou o aplicativo ativo, enquanto Ctrl+F4 costuma fechar apenas o documento ou a aba em aplicações específicas que oferecem esse recurso. Por isso a primeira alternativa, que troca as duas funções, está errada. Ctrl+Shift+Esc abre o Gerenciador de Tarefas, e não fecha documentos ou abas; Alt+Tab alterna entre janelas abertas, e não fecha nada. Win+F4 não é o atalho usual para fechar a janela ativa. E nenhum dos dois atalhos desliga o computador ou bloqueia a sessão: o bloqueio é feito com Win+L. Fechar uma janela também pode não finalizar todos os processos do aplicativo.",
  "lawRef": "Windows 10 e 11 — atalhos: Alt+F4 x Ctrl+F4"
 },
 {
  "id": "info-m02-autoral-10",
  "origem": "autoral-ia",
  "q": "Um usuário precisa verificar se o driver de uma placa de vídeo apresenta erro. Qual ferramenta do Windows apresenta o hardware instalado e seus respectivos drivers?",
  "options": [
   "Gerenciador de Tarefas",
   "Lixeira",
   "Explorador de Arquivos",
   "Gerenciador de Dispositivos",
   "Controle de Conta de Usuário"
  ],
  "answer": 3,
  "explanation": "O Gerenciador de Dispositivos apresenta o hardware e os drivers associados, e por isso é a ferramenta indicada para verificar o estado do driver de uma placa de vídeo. O Gerenciador de Tarefas mostra processos, desempenho e aplicativos de inicialização, e não organiza o hardware por driver: é comum confundir os dois, por terem nomes parecidos. A Lixeira guarda temporariamente arquivos excluídos, e o Explorador de Arquivos organiza unidades, pastas e documentos. O Controle de Conta de Usuário solicita confirmação ou credenciais em operações que exigem elevação, e não lista dispositivos nem informa sobre drivers instalados.",
  "lawRef": "Windows 10 e 11 — Gerenciador de Dispositivos x Gerenciador de Tarefas"
 }
];
