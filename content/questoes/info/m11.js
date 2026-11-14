/* Banco de questões — Noções de Informática, módulo 11. Questões autorais (não são de banca).
 * Para acrescentar questões, veja content/questoes/LEIAME.md e rode "npm run questoes:check". */
window.BC_QUESTOES=window.BC_QUESTOES||{};
(window.BC_QUESTOES.info=window.BC_QUESTOES.info||{})[11]=[
 {
  "id": "info-m11-autoral-01",
  "origem": "autoral-ia",
  "q": "Um cliente de e-mail está configurado para receber mensagens por IMAP. Qual protocolo é o principal responsável por ENVIAR uma nova mensagem ao servidor de correio?",
  "options": [
   "IMAP, porque além de sincronizar pastas ele é o protocolo principal de envio",
   "POP3, porque faz a transferência da mensagem do remetente para o servidor",
   "SMTP, protocolo usado no envio e na transferência de mensagens entre servidores",
   "HTTP, porque todo envio de mensagens depende de uma página de navegador",
   "FTP, porque o anexo precisa ser transferido como arquivo para o destinatário"
  ],
  "answer": 2,
  "explanation": "O SMTP é o protocolo usado principalmente para enviar mensagens e transferi-las entre servidores; por isso o cliente o usa na submissão, mesmo que o recebimento seja feito por IMAP. O IMAP serve para acessar e sincronizar as pastas e mensagens mantidas no servidor, não para enviar. O POP3 é associado ao recebimento por download, e não ao envio. HTTP e FTP não são os protocolos de correio: o webmail usa HTTPS apenas como forma de acesso pelo navegador, e anexos viajam dentro da própria mensagem, sem exigir FTP. Confundir o protocolo de envio com o de consulta da caixa é erro clássico.",
  "lawRef": "Correio eletrônico — protocolos SMTP, IMAP e POP3"
 },
 {
  "id": "info-m11-autoral-02",
  "origem": "autoral-ia",
  "q": "Uma servidora precisa enviar um convite a 30 pessoas de órgãos diferentes sem que os destinatários vejam os endereços uns dos outros. Qual campo deve ser usado para listá-los?",
  "options": [
   "Cco (cópia oculta), que não expõe os endereços aos demais destinatários comuns",
   "Cc (cópia), que oculta os endereços dos demais e mantém apenas o remetente visível",
   "Para, com todos os endereços, pois o campo principal nunca exibe a lista completa",
   "Responder a todos, que protege automaticamente os endereços dos participantes",
   "Encaminhar, que remove os destinatários anteriores e apaga o histórico da mensagem"
  ],
  "answer": 0,
  "explanation": "O campo Cco (cópia oculta, ou BCC) permite enviar a mensagem a destinatários sem expor seus endereços aos demais destinatários comuns, o que atende ao cenário. O Cc é uma cópia normalmente visível a todos, portanto expõe a lista. O campo Para indica os destinatários principais e também aparece para quem recebe. Responder a todos e Encaminhar são ações sobre uma mensagem recebida, não campos de endereçamento, e nenhuma delas protege endereços; responder a todos, aliás, pode expor informação a quem não precisava recebê-la. Vale lembrar que o Cco não impede que um destinatário encaminhe o conteúdo depois.",
  "lawRef": "Correio eletrônico — campos Para, Cc e Cco"
 },
 {
  "id": "info-m11-autoral-03",
  "origem": "autoral-ia",
  "q": "Uma pessoa acessa a mesma caixa de e-mail pelo celular e pelo notebook e quer que pastas e mensagens fiquem consistentes nos dois aparelhos. Qual protocolo é o mais adequado?",
  "options": [
   "SMTP, pois mantém as pastas espelhadas entre todos os dispositivos do usuário",
   "POP3, pois mantém sempre a caixa sincronizada entre vários dispositivos",
   "HTTP, pois é o único protocolo capaz de abrir uma caixa em dois aparelhos",
   "FTP, pois copia as pastas do servidor para cada aparelho e mantém iguais",
   "IMAP, pois acessa e sincroniza pastas e mensagens mantidas no servidor"
  ],
  "answer": 4,
  "explanation": "O IMAP foi pensado para acessar e sincronizar pastas e mensagens que permanecem no servidor, o que mantém celular e notebook consistentes. O SMTP trata de envio e transferência entre servidores, não de consulta nem de sincronização da caixa. O POP3 é tradicionalmente associado ao recebimento por download; ele não representa, automaticamente, sincronização completa de pastas entre aparelhos, e seu comportamento sobre manter ou apagar cópias depende da configuração do cliente. HTTP e FTP não são protocolos de correio para essa finalidade: o webmail usa o navegador, mas isso não torna o HTTP o único meio de acesso.",
  "lawRef": "Correio eletrônico — IMAP e sincronização da caixa"
 },
 {
  "id": "info-m11-autoral-04",
  "origem": "autoral-ia",
  "q": "Uma empresa contrata de um provedor máquinas virtuais, rede e armazenamento, e instala nelas o próprio sistema operacional e as aplicações. Esse arranjo corresponde ao modelo de serviço:",
  "options": [
   "SaaS, porque o provedor entrega o software pronto para o usuário final",
   "IaaS, porque o provedor oferece infraestrutura como máquinas virtuais e redes",
   "PaaS, porque o provedor entrega o sistema operacional configurado e as aplicações",
   "Edge computing, porque as máquinas ficam próximas dos dispositivos conectados",
   "IoT, porque as máquinas virtuais são sensores conectados ao provedor"
  ],
  "answer": 1,
  "explanation": "IaaS (infraestrutura como serviço) oferece recursos como máquinas virtuais, redes e armazenamento, sobre os quais o cliente instala o que quiser; é exatamente o cenário descrito. SaaS entrega software pronto ao usuário final, como um serviço de e-mail pelo navegador, e o cliente não instala nada. PaaS fornece uma plataforma gerenciada para criar e executar aplicações, sem que o cliente administre a máquina virtual. Edge computing e IoT não são modelos de serviço de nuvem: o primeiro desloca processamento para perto da origem dos dados; o segundo integra sensores e dispositivos conectados.",
  "lawRef": "Computação em nuvem — modelos IaaS, PaaS e SaaS"
 },
 {
  "id": "info-m11-autoral-05",
  "origem": "autoral-ia",
  "q": "Ao apagar por engano uma pasta no computador, uma usuária viu a pasta sumir também do celular e do site do serviço de nuvem. O que esse fato ilustra?",
  "options": [
   "que a nuvem remove arquivos sozinha para economizar espaço e proteger o usuário",
   "que o backup propaga as exclusões de propósito, para manter todas as cópias iguais",
   "que o serviço está com falha, pois toda exclusão local deveria ser ignorada",
   "que a sincronização propaga alterações, inclusive exclusões, e não substitui o backup",
   "que a lixeira do serviço apaga definitivamente qualquer item no mesmo instante"
  ],
  "answer": 3,
  "explanation": "A sincronização propaga alterações entre locais e dispositivos, e isso inclui exclusões e substituições acidentais; por isso ela não substitui o backup, que deve permitir recuperar estados úteis mesmo após erro, corrupção ou ataque. Não é a nuvem apagando por conta própria: a exclusão partiu do usuário e foi replicada. O backup não existe para propagar exclusões, e sim para guardar estados recuperáveis. Também não há falha: replicar a mudança é o comportamento esperado. Por fim, a lixeira mantém itens removidos por período variável conforme o plano, e não os apaga de forma definitiva e imediata.",
  "lawRef": "Nuvem — sincronização não é backup"
 },
 {
  "id": "info-m11-autoral-06",
  "origem": "autoral-ia",
  "q": "Um e-mail urgente pede atualização de senha por um link cujo domínio lembra o da instituição, mas tem uma letra diferente. A identidade visual parece idêntica. O mais adequado é:",
  "options": [
   "tratar como possível phishing, não clicar e comunicar a área responsável",
   "clicar para conferir, pois a identidade visual convincente garante a origem",
   "responder pedindo que o remetente confirme que a mensagem é verdadeira",
   "atualizar a senha logo, porque a urgência indica que o aviso é legítimo",
   "encaminhar a todos os colegas para que cada um teste o link por conta própria"
  ],
  "answer": 0,
  "explanation": "Domínio semelhante, mas divergente do institucional, somado à urgência, é indício clássico de phishing: tentativa de obter dados ou induzir ações fraudulentas. O correto é não clicar e avisar a área responsável. A identidade visual convincente não prova nada, pois é fácil de copiar. Responder ao golpista apenas confirma que o endereço está ativo e não valida a origem. Urgência é justamente uma pressão usada em engenharia social, e não sinal de legitimidade. Encaminhar o link aos colegas amplia a exposição e o risco, em vez de reduzi-lo.",
  "lawRef": "Correio eletrônico — phishing e domínio falso"
 },
 {
  "id": "info-m11-autoral-07",
  "origem": "autoral-ia",
  "q": "Para compartilhar um relatório confidencial em um serviço de nuvem seguindo o princípio do acesso mínimo, a prática mais adequada é:",
  "options": [
   "gerar um link para qualquer pessoa com permissão de editor, por praticidade",
   "enviar o link em uma lista aberta e revisar os acessos somente no fim do ano",
   "conceder acesso a pessoas específicas como visualizadoras e revisar as permissões",
   "deixar o arquivo público por algum tempo, apagando o link depois de um mês",
   "dar permissão de editor a toda a equipe, porque assim ninguém precisa pedir acesso"
  ],
  "answer": 2,
  "explanation": "O acesso mínimo recomenda conceder apenas o necessário: compartilhar com pessoas específicas, no modo de visualizador quando não for preciso editar, e revisar permissões e remover acessos quando deixarem de ser úteis. O link para qualquer pessoa pode ser incompatível com documentos confidenciais, ainda mais com permissão de editor. Divulgar o link em lista aberta e revisar só depois de muito tempo mantém a exposição por período desnecessário. Deixar o arquivo público, mesmo temporariamente, contraria a proteção do sigilo, e editor para todos amplia riscos de alteração indevida e vazamento.",
  "lawRef": "Nuvem — compartilhamento seguro e acesso mínimo"
 },
 {
  "id": "info-m11-autoral-08",
  "origem": "autoral-ia",
  "q": "Em relação ao funcionamento do correio eletrônico e de seus recursos, é INCORRETO afirmar que:",
  "options": [
   "o endereço do remetente exibido, por si só, não prova que a mensagem é legítima",
   "o webmail dá acesso ao correio por navegador, usualmente sobre HTTPS",
   "a assinatura de e-mail pode ser um simples bloco de texto identificador ou uma assinatura digital",
   "responder a todos pode expor informação a destinatários que não precisavam recebê-la",
   "o uso do Cco impede que um destinatário encaminhe o conteúdo a terceiros"
  ],
  "answer": 4,
  "explanation": "A afirmação incorreta é a última: o Cco apenas oculta os endereços dos destinatários em cópia oculta, mas quem recebe a mensagem pode encaminhá-la a quem quiser, pois o conteúdo está com ele. As demais são verdadeiras: o endereço exibido pode ser forjado ou ter nome de exibição falso, então não prova legitimidade; o webmail é o acesso pelo navegador, normalmente sobre HTTPS; a assinatura pode ser texto identificador ou criptográfica, conceitos distintos; e responder a todos pode distribuir dados a quem não deveria vê-los.",
  "lawRef": "Correio eletrônico — Cco, webmail e assinatura"
 },
 {
  "id": "info-m11-autoral-09",
  "origem": "autoral-ia",
  "q": "Um colega alterou e salvou por cima parte de um documento em edição no serviço de nuvem, e a versão anterior precisa ser recuperada. Qual recurso atende melhor a essa necessidade?",
  "options": [
   "o filtro de spam, que separa mensagens indesejadas da caixa principal",
   "o histórico de versões, que permite recuperar edições anteriores do arquivo",
   "a lixeira, destinada a itens removidos, e não a edições anteriores de um arquivo mantido",
   "o Cco, que guarda uma cópia oculta de cada alteração feita no documento",
   "a autenticação em duas etapas, que desfaz as alterações feitas por terceiros"
  ],
  "answer": 1,
  "explanation": "O histórico de versões permite recuperar edições anteriores de um arquivo, conforme as regras do serviço, e é o recurso indicado quando o conteúdo foi substituído. A lixeira mantém itens removidos por período variável; aqui o arquivo continua existindo, apenas foi alterado, e por isso ela não é o recurso adequado. O filtro de spam atua sobre mensagens indesejadas de e-mail. O Cco é um campo de endereçamento de e-mail e não guarda versões. A autenticação em duas etapas protege o acesso à conta, mas não desfaz alterações feitas por quem já tinha permissão.",
  "lawRef": "Nuvem — histórico de versões e lixeira"
 },
 {
  "id": "info-m11-autoral-10",
  "origem": "autoral-ia",
  "q": "Sobre a segurança e a responsabilidade pelos dados mantidos em serviços de computação em nuvem, é correto afirmar:",
  "options": [
   "ao migrar para a nuvem, a responsabilidade pelos dados passa por completo ao provedor",
   "nuvem pública garante, por definição, que os dados ficam no território nacional",
   "a autenticação em duas etapas dispensa a revisão das permissões de compartilhamento",
   "a nuvem não é invulnerável: 2FA, controle de acesso e backup reduzem riscos",
   "a nuvem privada elimina a necessidade de backup, retenção e controle de acesso"
  ],
  "answer": 3,
  "explanation": "A nuvem não é invulnerável e o usuário não perde a responsabilidade sobre seus dados: autenticação em duas etapas, permissões adequadas, retenção e backup se complementam. Não é verdade que a responsabilidade passe integralmente ao provedor. Os termos público, privado e híbrido descrevem o tipo de implantação e, por si sós, não determinam o país onde os dados ficam nem a proteção contratual. O 2FA protege a conta, mas não substitui a revisão de links e permissões de compartilhamento. E mesmo uma nuvem privada precisa de backup e de controle de acesso.",
  "lawRef": "Nuvem — responsabilidade e segurança dos dados"
 }

];
