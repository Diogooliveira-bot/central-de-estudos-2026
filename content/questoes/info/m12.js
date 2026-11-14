/* Banco de questões — Noções de Informática, módulo 12. Questões autorais (não são de banca).
 * Para acrescentar questões, veja content/questoes/LEIAME.md e rode "npm run questoes:check". */
window.BC_QUESTOES=window.BC_QUESTOES||{};
(window.BC_QUESTOES.info=window.BC_QUESTOES.info||{})[12]=[
 {
  "id": "info-m12-autoral-01",
  "origem": "autoral-ia",
  "q": "Em um sistema de acompanhamento de processos, alguém sem autorização altera o valor de uma causa. Qual propriedade da tríade da segurança da informação foi diretamente violada?",
  "options": [
   "a confidencialidade, pois alguém não autorizado teve contato com o dado",
   "a integridade, pois houve modificação indevida do dado",
   "a disponibilidade, pois o sistema deixou de poder ser utilizado",
   "o não repúdio, pois o autor da alteração nunca poderá ser identificado",
   "a rastreabilidade, pois o sistema não registrou o acesso do usuário"
  ],
  "answer": 1,
  "explanation": "A tríade clássica reúne confidencialidade, integridade e disponibilidade. Integridade é a garantia de que os dados não são modificados indevidamente; alterar sem autorização o valor de um processo viola exatamente isso. A confidencialidade trata de quem pode acessar a informação, e não de ela ser alterada. A disponibilidade trata de o dado ou serviço poder ser usado quando necessário, e o sistema segue funcionando no cenário. Não repúdio e rastreabilidade são propriedades complementares, ligadas a evidência de autoria e registro de ações; nada no enunciado diz que faltem registros.",
  "lawRef": "Segurança da informação — tríade CID"
 },
 {
  "id": "info-m12-autoral-02",
  "origem": "autoral-ia",
  "q": "Um servidor exposto à internet está sem a atualização que corrige uma falha conhecida. Em termos conceituais, essa falha não corrigida é:",
  "options": [
   "uma ameaça, pois é a fonte do evento que causa o dano",
   "um risco, pois é a própria probabilidade de que o atacante tenha sucesso",
   "um controle preventivo, pois impede a ação do atacante sobre o servidor",
   "uma vulnerabilidade, pois é uma fraqueza que pode ser explorada",
   "um incidente, pois o dano ao servidor já ocorreu de forma consumada"
  ],
  "answer": 3,
  "explanation": "Vulnerabilidade é uma fraqueza explorável, como uma falha conhecida sem correção em um servidor exposto. Ameaça é a fonte ou o evento com potencial de causar dano, como o atacante que explora a falha; ela não é a fraqueza em si. Risco relaciona a probabilidade e o impacto de eventos adversos, e depende do cenário; a falha apenas contribui para ele. Controle preventivo é uma medida que reduz a chance de exploração, como aplicar a atualização, o oposto do que o enunciado descreve. E incidente é um evento que já afetou a segurança, o que o texto não afirma.",
  "lawRef": "Segurança da informação — ameaça, vulnerabilidade e risco"
 },
 {
  "id": "info-m12-autoral-03",
  "origem": "autoral-ia",
  "q": "Segundo a versão 2.0 do NIST Cybersecurity Framework (CSF), as funções que organizam a gestão de segurança são:",
  "options": [
   "Governar, Identificar, Proteger, Detectar, Responder e Recuperar",
   "Identificar, Proteger, Detectar, Responder e Recuperar, sem função de governança",
   "Governar, Prevenir, Detectar, Corrigir, Auditar e Documentar",
   "Identificar, Proteger, Detectar, Responder, Recuperar e Auditar",
   "Governar, Identificar, Proteger, Detectar e Responder, apenas cinco"
  ],
  "answer": 0,
  "explanation": "O NIST CSF 2.0 organiza a gestão de segurança em seis funções: Governar, Identificar, Proteger, Detectar, Responder e Recuperar. A governança foi destacada como sexta função. A lista com apenas as cinco funções, sem Governar, corresponde à versão anterior e não deve ser usada como se fosse a 2.0. As demais alternativas inventam funções que não existem no framework, como Prevenir, Corrigir, Auditar e Documentar, ou omitem Recuperar e deixam a lista incompleta. Memorizar os seis verbos na ordem é a forma mais segura de não errar esse tipo de item.",
  "lawRef": "NIST CSF 2.0 — seis funções, incluindo Governar"
 },
 {
  "id": "info-m12-autoral-04",
  "origem": "autoral-ia",
  "q": "Um programa malicioso criptografa os arquivos de um computador e exibe uma mensagem exigindo pagamento para devolver o acesso aos dados. Esse comportamento é típico de:",
  "options": [
   "spyware, que coleta informações do usuário sem que ele perceba",
   "worm, que se propaga por redes sem anexar-se a arquivo hospedeiro",
   "keylogger, que registra as teclas digitadas pela vítima",
   "rootkit, que oculta a presença do invasor e mantém o acesso",
   "ransomware, que bloqueia ou criptografa dados e exige pagamento"
  ],
  "answer": 4,
  "explanation": "Ransomware é o malware que bloqueia o acesso ou criptografa os dados e exige pagamento, como no cenário. Spyware coleta informações indevidamente, sem sequestrar arquivos. Worm se destaca pela propagação por redes ou sistemas sem se anexar a um hospedeiro; a propagação não é o ponto do enunciado. Keylogger registra teclas digitadas, e rootkit procura ocultar a presença do invasor e manter acesso. As categorias podem se sobrepor, mas a criptografia dos arquivos com exigência de pagamento identifica o ransomware. Por isso backups isolados e testados são a principal defesa de recuperação.",
  "lawRef": "Segurança da informação — malwares e ransomware"
 },
 {
  "id": "info-m12-autoral-05",
  "origem": "autoral-ia",
  "q": "Ana quer enviar uma mensagem sigilosa a Bruno usando criptografia assimétrica, de modo que apenas ele consiga lê-la. Ana deve cifrar a mensagem com:",
  "options": [
   "a chave privada de Ana, que somente ela conhece e guarda em segredo",
   "a chave privada de Bruno, que fica guardada em segredo com ele",
   "a chave pública de Bruno, e ele a abrirá com a sua chave privada",
   "a chave pública de Ana, que Bruno poderia obter com facilidade",
   "o hash da mensagem, que Bruno recalcula para ler o conteúdo"
  ],
  "answer": 2,
  "explanation": "Na confidencialidade assimétrica típica, a mensagem é cifrada com a chave pública do destinatário e aberta somente com a chave privada correspondente; assim, só Bruno a lê. A chave privada de Ana serviria à assinatura, que prova origem, e não ao sigilo, pois qualquer um com a chave pública de Ana poderia abrir. A chave privada de Bruno deve ficar apenas com ele, e Ana nem a conhece. Cifrar com a chave pública de Ana não ajuda Bruno, que não tem a privada dela. Hash não é criptografia reversível: ele gera um resumo e não permite recuperar o conteúdo.",
  "lawRef": "Criptografia assimétrica — chaves pública e privada"
 },
 {
  "id": "info-m12-autoral-06",
  "origem": "autoral-ia",
  "q": "Assinale a alternativa correta sobre a assinatura digital, feita em sistemas de chave pública, e seus efeitos:",
  "options": [
   "garante, por si só, o sigilo do documento assinado",
   "é gerada com a chave pública do signatário e validada com a privada",
   "consiste em aplicar um hash que pode ser revertido para recuperar o texto",
   "ajuda a comprovar integridade e origem, mas não implica sigilo",
   "dispensa qualquer relação de confiança com certificados digitais"
  ],
  "answer": 3,
  "explanation": "A assinatura digital usa operação vinculada à chave privada do signatário e é validada com a chave pública correspondente; com isso, ajuda a comprovar integridade e origem, conforme os mecanismos e a confiança envolvidos. Ela não implica, por si só, sigilo: o documento pode seguir legível. A inversão de chaves, descrita na alternativa sobre chave pública para assinar, está errada. O hash não é reversível, então não recupera o texto original. E o certificado digital é justamente o que associa uma identidade a uma chave pública sob regras de confiança de uma autoridade certificadora.",
  "lawRef": "Segurança da informação — assinatura digital"
 },
 {
  "id": "info-m12-autoral-07",
  "origem": "autoral-ia",
  "q": "Considere o uso de funções hash criptográficas para verificar arquivos. Assinale a afirmação correta sobre elas:",
  "options": [
   "permitem recuperar o dado original a partir do resumo, usando a chave secreta",
   "produzem um resumo de tamanho fixo, não reversível, útil para verificar integridade",
   "geram resumos cujo tamanho cresce junto com o tamanho do arquivo original",
   "garantem o sigilo do conteúdo, pois ninguém consegue ler o resumo",
   "são exemplos de criptografia simétrica, pois usam uma única chave compartilhada"
  ],
  "answer": 1,
  "explanation": "Uma função hash criptográfica gera, a partir dos dados, um resumo de comprimento fixo, com propriedades que dificultam reverter o processo e achar colisões. Por isso serve para verificar integridade: se o resumo muda, o dado mudou. Hash não é criptografia reversível, então não há chave secreta que devolva o original. O tamanho do resumo é fixo e não acompanha o do arquivo. Ele também não garante sigilo, pois o dado original continua onde estava. E criptografia simétrica é outra coisa: usa uma chave secreta compartilhada para cifrar e decifrar.",
  "lawRef": "Segurança da informação — função hash e integridade"
 },
 {
  "id": "info-m12-autoral-08",
  "origem": "autoral-ia",
  "q": "Qual das combinações abaixo constitui autenticação em múltiplos fatores com fatores de categorias diferentes?",
  "options": [
   "senha mais código gerado por aplicativo autenticador no celular do usuário",
   "duas senhas distintas, ambas longas, únicas e memorizadas pelo usuário",
   "senha mais um PIN numérico de seis dígitos que o usuário também memoriza",
   "senha mais a resposta a uma pergunta secreta que só o usuário sabe",
   "um PIN mais outra senha, escolhidas em momentos diferentes, ambas memorizadas"
  ],
  "answer": 0,
  "explanation": "MFA combina fatores de categorias diferentes: algo que se sabe (senha, PIN), algo que se tem (chave física, aplicativo autenticador) e algo que se é (biometria). Senha mais código do aplicativo autenticador une conhecimento e posse. Duas senhas, senha mais PIN, senha mais pergunta secreta e PIN mais senha são todos fatores da mesma categoria, algo que se sabe; portanto não constituem, por si sós, dois fatores distintos, embora possam parecer mais seguros. Vale lembrar ainda que métodos resistentes a phishing, como chaves de segurança e passkeys, podem ser mais fortes que códigos por SMS.",
  "lawRef": "Autenticação — múltiplos fatores e categorias"
 },
 {
  "id": "info-m12-autoral-09",
  "origem": "autoral-ia",
  "q": "Na gestão de cópias de segurança, a orientação conhecida como 3-2-1 recomenda manter, respectivamente:",
  "options": [
   "duas cópias em três tipos de mídia, todas guardadas no mesmo local físico",
   "três cópias em dois tipos de mídia, todas mantidas no local principal",
   "uma cópia completa, replicada em dois locais e protegida por três senhas",
   "três cópias em um único tipo de mídia, com duas delas apenas sincronizadas",
   "três cópias, em dois tipos de mídia, uma delas fora do local principal"
  ],
  "answer": 4,
  "explanation": "A regra 3-2-1 recomenda três cópias dos dados, em dois tipos de mídia, com pelo menos uma cópia fora do local principal, o que protege contra falha de um meio e contra desastres no local. As variações que mudam os números, que mantêm tudo no mesmo local ou que usam um só tipo de mídia, perdem exatamente essas proteções. Em cenários modernos, contra ransomware, convém ainda ter cópias isoladas ou imutáveis, testar a restauração e controlar credenciais. Sincronização não conta como cópia de recuperação, pois pode propagar exclusões e erros.",
  "lawRef": "Backup — regra 3-2-1"
 },
 {
  "id": "info-m12-autoral-10",
  "origem": "autoral-ia",
  "q": "Um site exibe o cadeado de conexão segura (HTTPS) e tem certificado válido. Sobre isso, é correto afirmar que:",
  "options": [
   "o site é honesto, pois o certificado comprova a idoneidade de quem o publica",
   "o site está livre de phishing, pois o HTTPS bloqueia páginas fraudulentas",
   "o HTTPS protege a comunicação com o site, mas o conteúdo ainda pode ser falso",
   "o HTTPS dispensa antivírus e firewall, pois criptografa todo o computador",
   "o cadeado mostra que o site foi aprovado por um órgão de segurança"
  ],
  "answer": 2,
  "explanation": "O HTTPS usa TLS e mecanismos criptográficos para proteger a comunicação entre navegador e site; o certificado associa um nome de serviço a uma chave pública sob regras de confiança. Isso não certifica a honestidade de quem publica o conteúdo: um site fraudulento também pode ter HTTPS e certificado válido. Por isso o cadeado não garante ausência de phishing. O HTTPS não protege o computador inteiro nem substitui antivírus e firewall, que têm outras funções. E o cadeado não representa aprovação de órgão de segurança algum sobre o conteúdo da página.",
  "lawRef": "Segurança da informação — HTTPS, TLS e certificado"
 }

];
