/* Banco de questões — Noções de Informática, módulo 01. Questões autorais (não são de banca).
 * Para acrescentar questões, veja content/questoes/LEIAME.md e rode "npm run questoes:check". */
window.BC_QUESTOES=window.BC_QUESTOES||{};
(window.BC_QUESTOES.info=window.BC_QUESTOES.info||{})[1]=[
 {
  "id": "info-m01-autoral-01",
  "origem": "autoral-ia",
  "q": "Em um sistema de protocolo, o número “31” aparece isolado em uma tela. Depois, o sistema exibe “31 inscrições confirmadas hoje”. Sobre dado e informação, assinale a alternativa correta.",
  "options": [
   "O número 31 isolado já é informação completa, pois todo valor numérico registrado em um sistema tem significado próprio",
   "A frase exibida continua sendo apenas dado, porque informação só existe depois que o valor é gravado em uma unidade de armazenamento",
   "O 31 isolado é um dado bruto; a frase vira informação porque o valor ganhou contexto que permite interpretá-lo",
   "Dado e informação são sinônimos exatos em computação, e a diferença só aparece quando o texto é escrito como frase completa",
   "O sistema só transforma dados em informação se gravar o resultado; sem gravação, não há processamento algum"
  ],
  "answer": 2,
  "explanation": "Dado é um registro bruto, como o número 31 sozinho; informação surge quando o dado recebe contexto, como em “31 inscrições confirmadas hoje”. Por isso o 31 isolado não é informação completa: falta saber o que ele conta. Também é errado dizer que dado e informação são sinônimos, pois a distinção é justamente a presença de contexto. A ideia de que informação só existe após a gravação em armazenamento confunde processamento com armazenamento: o sistema pode interpretar e exibir resultados sem salvá-los, e entrada, processamento e saída não implicam, por si, gravação de dados.",
  "lawRef": "Fundamentos — dado x informação e ciclo entrada, processamento e saída"
 },
 {
  "id": "info-m01-autoral-02",
  "origem": "autoral-ia",
  "q": "Assinale a alternativa que compara corretamente a memória RAM e uma unidade SSD em um computador pessoal.",
  "options": [
   "A RAM é a memória de trabalho e perde o conteúdo sem energia; o SSD guarda arquivos de forma não volátil",
   "A RAM guarda os arquivos de forma permanente, e o SSD é a memória volátil usada apenas enquanto os programas estão em execução",
   "O SSD é um tipo de RAM mais veloz, pois ambos usam memória flash e perdem os dados quando o computador é desligado",
   "Ambos são memórias voláteis, e a diferença é que o SSD tem menor capacidade e custo maior que a RAM em qualquer modelo",
   "A RAM é não volátil, razão pela qual um documento aberto e não salvo sobrevive a uma queda de energia do computador"
  ],
  "answer": 0,
  "explanation": "A RAM (na forma usual, DRAM) é a memória de trabalho: mantém programas e dados em uso e é volátil, perdendo o conteúdo quando falta energia. O SSD é armazenamento secundário, baseado em memória flash e não volátil, adequado para guardar arquivos. Estão errados: dizer que a RAM guarda arquivos permanentemente e o SSD é volátil (inverte os papéis); tratar o SSD como RAM mais veloz que perde dados ao desligar (flash retém dados); afirmar que ambos são voláteis ou que o SSD sempre tem menor capacidade e custo maior (não há regra geral); e supor que a RAM é não volátil, o que faria um documento não salvo sobreviver a uma queda de energia.",
  "lawRef": "Hardware — memória RAM (volátil) x armazenamento SSD (não volátil)"
 },
 {
  "id": "info-m01-autoral-03",
  "origem": "autoral-ia",
  "q": "Uma operadora anuncia conexão de 200 Mbps. Considerando que 1 byte tem 8 bits e ignorando perdas, o valor máximo teórico de transferência, em megabytes por segundo, é de:",
  "options": [
   "200 MB/s",
   "1.600 MB/s",
   "8 MB/s",
   "25 MB/s",
   "40 MB/s"
  ],
  "answer": 3,
  "explanation": "Mbps significa megabits por segundo, e MB/s significa megabytes por segundo. Como 1 byte tem 8 bits, divide-se 200 por 8, o que dá 25 MB/s no máximo teórico. O valor de 200 MB/s ignora a diferença entre bit e byte e trata as duas unidades como iguais. O valor de 1.600 MB/s resulta de multiplicar por 8 em vez de dividir, invertendo a conversão. O valor de 8 MB/s usa o fator da conversão como se fosse o resultado. O valor de 40 MB/s equivale a dividir por 5, número sem relação com a conversão entre bits e bytes. Letra minúscula b indica bit; letra maiúscula B indica byte.",
  "lawRef": "Bits, bytes e unidades — Mb x MB e conversão de velocidade"
 },
 {
  "id": "info-m01-autoral-04",
  "origem": "autoral-ia",
  "q": "Um técnico compara dois SSDs de um mesmo fabricante, um SATA e outro NVMe. Sobre SSD, SATA e NVMe, é correto afirmar:",
  "options": [
   "NVMe é a memória flash que armazena os dados do SSD, e SATA é o nome do chip magnético usado no HDD",
   "SATA é uma interface muito usada; NVMe é um protocolo para armazenamento em PCIe, e um SSD pode usar qualquer um",
   "Todo SSD é NVMe, e SATA designa apenas discos rígidos mecânicos, que não podem usar essa interface",
   "SSD e NVMe são sinônimos de memória RAM, e o SATA é o barramento que liga a RAM ao processador",
   "NVMe funciona somente com HDD, que depende de discos giratórios, e o SSD usa obrigatoriamente a interface SATA"
  ],
  "answer": 1,
  "explanation": "SATA e NVMe são termos de naturezas diferentes: SATA é uma interface amplamente utilizada, e NVMe é um protocolo desenhado para armazenamento não volátil em conexões como PCIe. Um SSD pode usar SATA ou NVMe, conforme o modelo. Está errado dizer que NVMe é a própria memória flash e que SATA é chip magnético: ambos descrevem a forma de conexão e comunicação. Também é falso que todo SSD seja NVMe, pois há SSDs SATA, e que SATA sirva só a HDD. SSD e NVMe não são sinônimos de RAM, que é memória volátil de trabalho. Por fim, NVMe foi pensado para memória flash, e não para HDD.",
  "lawRef": "Armazenamento — SSD, interface SATA e protocolo NVMe"
 },
 {
  "id": "info-m01-autoral-05",
  "origem": "autoral-ia",
  "q": "Um programa é distribuído sem custo, mas seu código-fonte é fechado e a licença proíbe modificar e redistribuir. Esse programa é classificado como:",
  "options": [
   "software livre, pois a gratuidade do programa garante as liberdades de uso, estudo e modificação",
   "código aberto, porque todo software sem custo permite estudar o código-fonte",
   "shareware, pois esse termo designa qualquer programa de licença fechada",
   "software como serviço (SaaS), pois foi obtido sem pagamento pela internet",
   "freeware: uso gratuito, sem as liberdades de modificar e redistribuir do software livre"
  ],
  "answer": 4,
  "explanation": "Freeware é o programa de uso gratuito que pode continuar com código fechado e sem permissão de modificação ou redistribuição. Gratuidade não é o mesmo que liberdade: software livre se define pelas liberdades de usar, estudar, modificar e redistribuir, e não pela ausência de preço, de modo que o programa do enunciado não é livre. Também não é código aberto, pois o código-fonte é fechado. Shareware costuma envolver avaliação por tempo limitado ou recursos reduzidos, e não designa toda licença fechada. SaaS descreve software fornecido como serviço pela rede e gerenciado pelo provedor, o que não depende de o programa ser pago ou gratuito. Um programa comercial também pode ser livre.",
  "lawRef": "Software — software livre x freeware, shareware e SaaS"
 },
 {
  "id": "info-m01-autoral-06",
  "origem": "autoral-ia",
  "q": "Um usuário executa três instâncias independentes do mesmo editor de texto ao mesmo tempo. Sobre programa e processo, é correto afirmar:",
  "options": [
   "Há um programa e, em execução, três processos, cada um com estado e recursos próprios",
   "Há três programas distintos, pois cada janela aberta cria uma nova cópia do programa instalado",
   "Programa e processo são sinônimos, e abrir o editor três vezes cria um único processo",
   "O processo é o arquivo executável guardado no disco, e o programa é o que fica na RAM",
   "Existe um só processo, pois o sistema operacional impede executar o mesmo programa mais de uma vez"
  ],
  "answer": 0,
  "explanation": "Programa é um conjunto de instruções, como o editor instalado; processo é uma instância desse programa em execução, com estado e recursos próprios. O mesmo programa pode originar vários processos, e por isso as três instâncias independentes correspondem a um programa e três processos. Dizer que são três programas confunde instância com instalação. Tratar os termos como sinônimos apaga a distinção que a teoria exige. Inverter os conceitos, chamando de processo o arquivo no disco, também é erro, pois o arquivo em disco é o programa. E o sistema operacional não impede a execução repetida do mesmo programa: multitarefa existe justamente para alternar várias tarefas.",
  "lawRef": "Inicialização, programas e processos — programa x processo"
 },
 {
  "id": "info-m01-autoral-07",
  "origem": "autoral-ia",
  "q": "Um usuário renomeia o arquivo relatorio.txt para relatorio.pdf. Sobre o efeito dessa troca de extensão, assinale a alternativa correta.",
  "options": [
   "O sistema converte o texto em um PDF válido, reescrevendo o conteúdo interno conforme a nova extensão",
   "O arquivo é compactado automaticamente, pois a extensão PDF aplica compressão aos textos renomeados",
   "O conteúdo é criptografado, e o arquivo só abre para quem souber a senha do usuário",
   "Muda só o nome: o conteúdo continua sendo texto simples, e o arquivo pode não abrir como PDF",
   "O arquivo é movido para outra pasta, pois a extensão PDF é vinculada à pasta Documentos"
  ],
  "answer": 3,
  "explanation": "A extensão é a parte final do nome e sugere o formato ou a associação com um programa, mas renomear não converte o conteúdo interno. O arquivo continua sendo texto simples, e um leitor de PDF pode não conseguir abri-lo corretamente. Para obter um PDF de verdade, é preciso usar a função de exportar, imprimir como PDF ou converter. Não há conversão automática, compactação nem criptografia: compactar agrupa e pode reduzir o tamanho, mas é outra operação, e criptografar exige procedimento próprio. Tampouco a extensão altera a localização do arquivo: mover é uma operação diferente, que muda a pasta, e nenhuma extensão fica vinculada a uma pasta específica.",
  "lawRef": "Arquivos, pastas e extensões — renomear não converte o formato"
 },
 {
  "id": "info-m01-autoral-08",
  "origem": "autoral-ia",
  "q": "Sobre a memória virtual, técnica de gerenciamento de memória do sistema operacional, é correto afirmar:",
  "options": [
   "Aumenta fisicamente a RAM instalada, pois transforma parte do HDD ou SSD em módulos de memória RAM extras",
   "É um tipo de memória cache embutida no processador, com acesso mais rápido que o dos registradores",
   "Mapeia espaços de memória dos processos e pode usar disco ou SSD como paginação, mais lenta que a RAM",
   "Substitui a RAM por completo, e por isso os computadores modernos dispensam módulos de memória",
   "É a memória ROM que guarda o firmware de inicialização e jamais pode ser regravada"
  ],
  "answer": 2,
  "explanation": "Memória virtual é uma técnica de gerenciamento de endereços: o sistema operacional mapeia o espaço de memória dos processos e, conforme o caso, usa disco ou SSD como área de paginação. Esse acesso costuma ser mais lento que o da RAM. Ela não aumenta a quantidade de RAM física: nada é transformado em módulos de memória, e por isso também não substitui a RAM nem torna os módulos dispensáveis. Não é cache de processador, que mantém cópias de dados usados com frequência e fica entre os registradores e a RAM, sem ser mais rápida que os registradores. Tampouco é ROM: firmwares são frequentemente mantidos em chips flash, regraváveis por procedimentos específicos.",
  "lawRef": "Memórias — memória virtual, paginação e RAM física"
 },
 {
  "id": "info-m01-autoral-09",
  "origem": "autoral-ia",
  "q": "Considerando o modelo conceitual de hierarquia de memória, da mais próxima da CPU para a mais distante, a ordem correta é:",
  "options": [
   "cache, registradores, RAM, armazenamento secundário",
   "RAM, cache, registradores, armazenamento secundário",
   "registradores, RAM, cache, armazenamento secundário",
   "armazenamento secundário, RAM, cache, registradores",
   "registradores, cache, RAM, armazenamento secundário"
  ],
  "answer": 4,
  "explanation": "Na representação conceitual, os registradores ficam mais próximos da CPU e guardam valores usados diretamente nas operações. Em seguida vem a cache, que mantém cópias de dados e instruções de uso frequente para reduzir acessos à RAM (com níveis L1, L2 e L3). Depois vem a RAM, memória de trabalho dos programas em execução, e por último o armazenamento secundário, como HDD ou SSD, que é não volátil e mais lento. As demais ordens estão erradas: colocar a cache antes dos registradores, a RAM antes da cache, a RAM antes da cache e dos registradores, ou inverter toda a sequência contraria a relação entre proximidade da CPU, velocidade e capacidade.",
  "lawRef": "Memórias — hierarquia: registradores, cache, RAM e armazenamento secundário"
 },
 {
  "id": "info-m01-autoral-10",
  "origem": "autoral-ia",
  "q": "Uma pasta é sincronizada entre o notebook e a nuvem. Ao apagar um arquivo no notebook, a exclusão é replicada na nuvem. O que esse fato ilustra?",
  "options": [
   "A sincronização é sempre backup completo, pois guarda cópias eternas de tudo que for apagado",
   "Sincronização mantém locais iguais e pode replicar exclusões; backup é cópia preparada para recuperação",
   "Backup e sincronização são sinônimos, e ambos impedem a perda de arquivos apagados por engano",
   "A nuvem não depende de infraestrutura física, e por isso a exclusão feita no notebook se propaga na hora",
   "A compactação dos arquivos protege contra exclusões, e por isso não deveria haver replicação"
  ],
  "answer": 1,
  "explanation": "Sincronização mantém dois ou mais locais com o mesmo conteúdo, e por isso pode replicar a exclusão de um arquivo entre dispositivos. Backup é uma cópia preparada para recuperação, mantida de forma a permitir restaurar dados perdidos; por essa razão, a simples sincronização não o substitui. Está errado afirmar que ela guarda cópias eternas, pois nada garante isso, e que backup e sincronização são sinônimos. A nuvem continua dependendo de infraestrutura física de armazenamento em servidores, e a velocidade da propagação não é o ponto do caso. Por fim, compactar agrupa e pode reduzir espaço, mas não é backup nem criptografia, e não protege contra exclusões.",
  "lawRef": "Armazenamento — backup x sincronização"
 }
];
