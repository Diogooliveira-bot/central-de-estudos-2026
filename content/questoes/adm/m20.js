/* Banco de questões — Direito Administrativo, módulo 20. Questões autorais (não são de banca).
 * Para acrescentar questões, veja content/questoes/LEIAME.md e rode "npm run questoes:check". */
window.BC_QUESTOES=window.BC_QUESTOES||{};
(window.BC_QUESTOES.adm=window.BC_QUESTOES.adm||{})[20]=[
 {
  "id": "adm-m20-autoral-01",
  "origem": "autoral-ia",
  "q": "Considere as seguintes situações: I. pessoa natural que guarda contatos de amigos para fins exclusivamente particulares e não econômicos; II. jornal que trata dados pessoais para fins exclusivamente jornalísticos; III. empresa sediada no exterior que oferta serviços a pessoas localizadas no Brasil e trata seus dados; IV. órgão policial que trata dados exclusivamente para investigação e repressão de infrações penais. A Lei 13.709/2018 (Lei Geral de Proteção de Dados Pessoais — LGPD) NÃO se aplica às situações:",
  "options": [
   "I e II, apenas",
   "II e IV, apenas",
   "I, II e III, apenas",
   "III e IV, apenas",
   "I, II e IV, apenas"
  ],
  "answer": 4,
  "explanation": "O art. 3º da Lei 13.709/2018 (Lei Geral de Proteção de Dados Pessoais — LGPD) diz que a lei se aplica a qualquer tratamento realizado por pessoa natural ou jurídica, de direito público ou privado, independentemente do país de sua sede, desde que a operação seja realizada no Brasil, tenha por objetivo a oferta de bens ou serviços ou o tratamento de dados de indivíduos localizados no Brasil, ou os dados tenham sido coletados no Brasil. Por isso a situação III está sujeita à lei (C e D estão erradas). O art. 4º diz que a lei não se aplica ao tratamento feito por pessoa natural para fins exclusivamente particulares e não econômicos (I), para fins exclusivamente jornalísticos e artísticos (II) e para fins exclusivos de segurança pública, defesa nacional, segurança do Estado ou investigação e repressão de infrações penais (IV); o § 1º diz que este último será regido por legislação específica, observados o devido processo legal, os princípios gerais de proteção e os direitos do titular. Assim, I, II e IV estão excluídas (A e B estão incompletas).",
  "lawRef": "Lei 13.709/2018 (Lei Geral de Proteção de Dados Pessoais — LGPD), art. 3º (aplicação territorial) e art. 4º, I, II, a, e III (exclusões)"
 },
 {
  "id": "adm-m20-autoral-02",
  "origem": "autoral-ia",
  "q": "Secretaria de Saúde substituiu nomes e CPFs de pacientes por códigos e manteve, em arquivo separado e sob seu controle, a tabela que relaciona cada código ao respectivo paciente. Segundo a Lei 13.709/2018 (Lei Geral de Proteção de Dados Pessoais — LGPD), esses dados:",
  "options": [
   "são dados anonimizados e, por isso, deixam de ser considerados dados pessoais para os fins da lei",
   "deixam de ser dados sensíveis, embora continuem pessoais, porque a codificação elimina a referência à saúde do titular",
   "foram pseudonimizados e continuam sendo dados pessoais, pois a reidentificação é possível pela informação mantida à parte",
   "são anonimizados enquanto a tabela estiver protegida, e só voltam a ser dados pessoais se houver vazamento da tabela de códigos",
   "foram bloqueados, pois a substituição por códigos equivale à suspensão temporária de qualquer operação de tratamento"
  ],
  "answer": 2,
  "explanation": "O art. 5º, III, da Lei 13.709/2018 (Lei Geral de Proteção de Dados Pessoais — LGPD) diz que dado anonimizado é o \"relativo a titular que não possa ser identificado, considerando a utilização de meios técnicos razoáveis e disponíveis na ocasião de seu tratamento\". O art. 12 diz que os dados anonimizados não são dados pessoais, salvo quando a anonimização puder ser revertida com meios próprios ou com esforços razoáveis. No caso, a própria Secretaria pode reidentificar os pacientes com a tabela; logo, não há anonimização (A e D estão erradas). O art. 13, § 4º, diz que pseudonimização é o tratamento pelo qual o dado perde a possibilidade de associação a um indivíduo, senão pelo uso de informação adicional mantida separadamente pelo controlador em ambiente controlado e seguro: o dado continua pessoal e, por se referir à saúde, continua sensível, nos termos do art. 5º, II (B está errada). Bloqueio, segundo o art. 5º, XIII, é a suspensão temporária do tratamento com guarda do dado, o que não ocorreu (E está errada).",
  "lawRef": "Lei 13.709/2018 (Lei Geral de Proteção de Dados Pessoais — LGPD), art. 5º, II, III e XIII, art. 12 e art. 13, § 4º (anonimização e pseudonimização)"
 },
 {
  "id": "adm-m20-autoral-03",
  "origem": "autoral-ia",
  "q": "Rede de academias pretende tratar a impressão digital dos clientes para controlar o acesso às unidades e usar o histórico de frequência para enviar ofertas personalizadas. Segundo a Lei 13.709/2018 (Lei Geral de Proteção de Dados Pessoais — LGPD), é correto afirmar que:",
  "options": [
   "o legítimo interesse pode fundamentar o envio de ofertas, mas não está entre as hipóteses que autorizam o tratamento de dados sensíveis",
   "o legítimo interesse fundamenta os dois tratamentos, pois o art. 11 admite essa base para dados sensíveis desde que haja teste de ponderação",
   "o tratamento da biometria depende sempre de consentimento, pois o art. 11 não prevê hipótese de tratamento de dado sensível sem consentimento",
   "dados biométricos não são sensíveis, salvo quando revelam origem racial ou étnica, e podem ser tratados com base em qualquer hipótese do art. 7º",
   "o envio de ofertas exige consentimento, pois o legítimo interesse só pode ser invocado pela Administração Pública na execução de políticas públicas"
  ],
  "answer": 0,
  "explanation": "O art. 7º, IX, da Lei 13.709/2018 (Lei Geral de Proteção de Dados Pessoais — LGPD) diz que o tratamento pode ocorrer quando necessário para atender aos interesses legítimos do controlador ou de terceiro, exceto se prevalecerem direitos e liberdades fundamentais do titular. O art. 10 diz que o legítimo interesse só pode fundamentar o tratamento para finalidades legítimas, consideradas a partir de situações concretas, como o apoio e a promoção de atividades do controlador, e apenas com os dados estritamente necessários; a base não é exclusiva da Administração (E está errada). O art. 5º, II, diz que o dado biométrico vinculado a pessoa natural é sensível (D está errada). O art. 11 diz que o dado sensível só pode ser tratado com consentimento específico e destacado ou, sem consentimento, nas hipóteses indispensáveis que lista, como obrigação legal, exercício regular de direitos e prevenção à fraude e segurança do titular em processos de identificação e autenticação; há, portanto, hipóteses sem consentimento (C está errada), mas o legítimo interesse não está entre elas (B está errada).",
  "lawRef": "Lei 13.709/2018 (Lei Geral de Proteção de Dados Pessoais — LGPD), art. 7º, IX, art. 10 (legítimo interesse) e art. 11 (dados sensíveis)"
 },
 {
  "id": "adm-m20-autoral-04",
  "origem": "autoral-ia",
  "q": "Empresa de comércio eletrônico obtém o consentimento dos clientes por meio de cláusula que autoriza \"o uso dos dados para quaisquer finalidades da empresa e de seus parceiros\". Segundo a Lei 13.709/2018 (Lei Geral de Proteção de Dados Pessoais — LGPD):",
  "options": [
   "o consentimento é válido, pois foi fornecido por escrito, e cabe ao titular provar eventual vício na manifestação de vontade",
   "o consentimento é válido, mas sua revogação só pode ocorrer mediante pagamento dos custos operacionais do controlador",
   "o consentimento é válido para a empresa e os parceiros, pois a lei dispensa consentimento específico para o compartilhamento",
   "a autorização é nula por ser genérica, e o ônus de provar que o consentimento atendeu à lei é do controlador",
   "a autorização só pode ser anulada se o titular demonstrar prejuízo concreto decorrente do tratamento de seus dados"
  ],
  "answer": 3,
  "explanation": "O art. 5º, XII, da Lei 13.709/2018 (Lei Geral de Proteção de Dados Pessoais — LGPD) diz que consentimento é a \"manifestação livre, informada e inequívoca pela qual o titular concorda com o tratamento de seus dados pessoais para uma finalidade determinada\". O art. 8º, § 4º, diz que o consentimento deve se referir a finalidades determinadas e que as autorizações genéricas são nulas, independentemente de prejuízo (E está errada). O § 2º diz que cabe ao controlador o ônus da prova de que o consentimento foi obtido em conformidade com a lei (A está errada). O § 5º diz que o consentimento pode ser revogado a qualquer momento, por manifestação expressa do titular, mediante procedimento gratuito e facilitado (B está errada). O art. 7º, § 5º, diz que o controlador que precisar comunicar ou compartilhar dados com outros controladores deve obter consentimento específico para esse fim, ressalvadas as hipóteses de dispensa (C está errada).",
  "lawRef": "Lei 13.709/2018 (Lei Geral de Proteção de Dados Pessoais — LGPD), art. 5º, XII, art. 7º, § 5º, e art. 8º, §§ 2º, 4º e 5º (consentimento)"
 },
 {
  "id": "adm-m20-autoral-05",
  "origem": "autoral-ia",
  "q": "Para cadastrar interessados em receber boletim informativo por e-mail, órgão público exige nome, e-mail, CPF, estado civil, renda mensal e religião. Considerando os princípios do art. 6º da Lei 13.709/2018 (Lei Geral de Proteção de Dados Pessoais — LGPD), a exigência viola principalmente o princípio da:",
  "options": [
   "finalidade, que consiste na limitação do tratamento ao mínimo necessário para a realização de seus propósitos",
   "necessidade, que limita o tratamento ao mínimo necessário, com dados pertinentes, proporcionais e não excessivos",
   "adequação, que garante aos titulares consulta facilitada e gratuita sobre a forma e a duração do tratamento de seus dados",
   "qualidade dos dados, que impõe a coleta do maior número possível de dados para garantir sua exatidão e atualização",
   "prevenção, que consiste na realização do tratamento apenas para propósitos legítimos, específicos e informados ao titular"
  ],
  "answer": 1,
  "explanation": "O art. 6º, III, da Lei 13.709/2018 (Lei Geral de Proteção de Dados Pessoais — LGPD) diz que o princípio da necessidade é a \"limitação do tratamento ao mínimo necessário para a realização de suas finalidades, com abrangência dos dados pertinentes, proporcionais e não excessivos em relação às finalidades do tratamento de dados\". Para enviar um boletim por e-mail, CPF, renda e religião são excessivos, e a religião é até dado sensível. As demais alternativas trocam as definições: o inciso I diz que a finalidade é o tratamento para propósitos legítimos, específicos, explícitos e informados ao titular (A e E confundem); o inciso II diz que a adequação é a compatibilidade do tratamento com as finalidades informadas, enquanto a consulta facilitada e gratuita é o livre acesso, do inciso IV (C); o inciso V diz que a qualidade é a garantia de exatidão, clareza, relevância e atualização dos dados, e não a coleta máxima (D); o inciso VIII diz que a prevenção é a adoção de medidas para prevenir danos.",
  "lawRef": "Lei 13.709/2018 (Lei Geral de Proteção de Dados Pessoais — LGPD), art. 6º, I a V e VIII (princípios, em especial a necessidade)"
 },
 {
  "id": "adm-m20-autoral-06",
  "origem": "autoral-ia",
  "q": "Aplicativo de jogos voltado a crianças de 8 a 11 anos coleta dados pessoais dos usuários. Segundo o art. 14 da Lei 13.709/2018 (Lei Geral de Proteção de Dados Pessoais — LGPD):",
  "options": [
   "o consentimento pode ser dado pela própria criança, desde que as informações estejam em linguagem simples e acessível à sua idade",
   "é vedada qualquer coleta de dados de crianças sem o consentimento parental, inclusive para contatar os pais ou o responsável",
   "o controlador pode condicionar a participação no jogo ao fornecimento de dados além dos estritamente necessários, se os pais concordarem",
   "o consentimento de ambos os pais é obrigatório, sendo insuficiente o de apenas um deles ou o do responsável legal",
   "a coleta sem consentimento parental é admitida para contatar os pais, uma única vez e sem armazenamento, ou para proteger a criança"
  ],
  "answer": 4,
  "explanation": "O art. 14 da Lei 13.709/2018 (Lei Geral de Proteção de Dados Pessoais — LGPD) diz que o tratamento de dados de crianças e adolescentes deve ser feito em seu melhor interesse. O § 1º diz que o tratamento de dados de crianças deve ocorrer com consentimento específico e em destaque dado \"por pelo menos um dos pais ou pelo responsável legal\" (A e D estão erradas). O § 3º diz que os dados podem ser coletados sem esse consentimento quando a coleta for necessária para contatar os pais ou o responsável, utilizados uma única vez e sem armazenamento, ou para a proteção da criança, e nunca repassados a terceiros sem o consentimento (B está errada). O § 4º diz que os controladores não devem condicionar a participação em jogos, aplicações de internet ou outras atividades ao fornecimento de informações além das estritamente necessárias (C está errada). A ANPD, em enunciado de 2023, admitiu também o uso das demais bases legais dos arts. 7º e 11, desde que observado o melhor interesse.",
  "lawRef": "Lei 13.709/2018 (Lei Geral de Proteção de Dados Pessoais — LGPD), art. 14, caput e §§ 1º, 3º e 4º (dados de crianças)"
 },
 {
  "id": "adm-m20-autoral-07",
  "origem": "autoral-ia",
  "q": "Titular pede a um banco a confirmação da existência e o acesso a seus dados pessoais, por declaração completa com a origem dos dados e a finalidade do tratamento. Pede também a revisão de decisão tomada unicamente com base em tratamento automatizado, que lhe negou crédito. Segundo a Lei 13.709/2018 (Lei Geral de Proteção de Dados Pessoais — LGPD):",
  "options": [
   "a declaração completa deve ser fornecida em até 15 dias do requerimento, e a revisão da decisão automatizada é direito do titular",
   "a declaração completa deve ser fornecida imediatamente, e a revisão da decisão automatizada deve ser feita necessariamente por pessoa natural",
   "a declaração completa deve ser fornecida em até 30 dias, e a revisão da decisão automatizada só cabe se o titular tiver consentido com o tratamento",
   "o acesso só é garantido se o tratamento tiver por base o consentimento, e decisões automatizadas de crédito não podem ser revistas",
   "a declaração completa deve ser fornecida em até 15 dias, mas o direito de revisão não alcança as decisões automatizadas sobre crédito"
  ],
  "answer": 0,
  "explanation": "O art. 18 da Lei 13.709/2018 (Lei Geral de Proteção de Dados Pessoais — LGPD) diz que o titular tem direito, entre outros, à confirmação da existência de tratamento e ao acesso aos dados, qualquer que seja a base legal (D está errada). O art. 19 diz que a confirmação e o acesso serão fornecidos em formato simplificado, imediatamente, ou por declaração clara e completa, com origem dos dados, critérios e finalidade, \"no prazo de até 15 (quinze) dias, contado da data do requerimento do titular\" (B e C estão erradas quanto ao prazo). O art. 20 diz que o titular pode pedir a revisão de decisões tomadas unicamente com base em tratamento automatizado que afetem seus interesses, incluídas as que definem seu perfil pessoal, profissional, de consumo e de crédito (E está errada). A exigência de revisão por pessoa natural, prevista na redação original, foi retirada pela Lei 13.853/2019 (alterações na LGPD), com veto mantido pelo Congresso (B está errada também nesse ponto).",
  "lawRef": "Lei 13.709/2018 (Lei Geral de Proteção de Dados Pessoais — LGPD), arts. 18, 19, II, e 20 (direitos de acesso e de revisão de decisões automatizadas)"
 },
 {
  "id": "adm-m20-autoral-08",
  "origem": "autoral-ia",
  "q": "Secretaria estadual pretende transferir a uma empresa privada dados pessoais constantes de suas bases de dados. Segundo a Lei 13.709/2018 (Lei Geral de Proteção de Dados Pessoais — LGPD), essa transferência:",
  "options": [
   "é livre, pois os dados tratados pelo Poder Público são de acesso público e podem ser compartilhados com qualquer interessado",
   "é vedada em qualquer hipótese, porque a lei proíbe a comunicação de dados de bases públicas a entidades privadas",
   "depende sempre de consentimento específico de cada titular, única hipótese legal que autoriza o repasse a entidade privada",
   "é, em regra, vedada, salvo em hipóteses legais como a execução descentralizada de atividade pública que a exija",
   "é permitida sempre que a empresa for contratada por licitação, dispensada a indicação de finalidade específica e determinada"
  ],
  "answer": 3,
  "explanation": "O art. 23 da Lei 13.709/2018 (Lei Geral de Proteção de Dados Pessoais — LGPD) diz que o tratamento de dados pelo Poder Público deve atender à sua finalidade pública, na persecução do interesse público, para executar competências legais. O art. 26, § 1º, diz que é vedado ao Poder Público transferir a entidades privadas dados pessoais constantes de bases a que tenha acesso, exceto em hipóteses como: execução descentralizada de atividade pública que exija a transferência, exclusivamente para esse fim específico e determinado, observada a Lei 12.527/2011 (Lei de Acesso à Informação); dados acessíveis publicamente; previsão legal ou transferência respaldada em contratos, convênios ou instrumentos congêneres; e prevenção de fraudes e irregularidades ou proteção da segurança e integridade do titular. A regra, portanto, é a vedação (A está errada), com exceções legais (B está errada), que não se limitam ao consentimento (C). Mesmo nas exceções, exige-se finalidade específica (E está errada).",
  "lawRef": "Lei 13.709/2018 (Lei Geral de Proteção de Dados Pessoais — LGPD), art. 23 (tratamento pelo Poder Público) e art. 26, § 1º (transferência a entidades privadas)"
 },
 {
  "id": "adm-m20-autoral-09",
  "origem": "autoral-ia",
  "q": "Empresa operadora, contratada por um hospital privado (controlador) para armazenar prontuários, descumpriu instruções lícitas do hospital e deixou de adotar medidas de segurança, o que causou vazamento de dados. Segundo a Lei 13.709/2018 (Lei Geral de Proteção de Dados Pessoais — LGPD), quanto à reparação dos danos aos titulares:",
  "options": [
   "apenas o controlador responde, pois o operador age em nome dele e não responde diretamente perante o titular dos dados",
   "apenas o operador responde, pois a conduta de terceiro sempre exclui a responsabilidade do controlador pelos danos",
   "o operador responde solidariamente, equiparando-se ao controlador, ressalvadas as excludentes previstas na lei",
   "o operador responde apenas subsidiariamente, se o controlador não tiver patrimônio suficiente para indenizar os titulares",
   "nenhum agente responde se provar que usou as técnicas disponíveis à época, ainda que tenha violado a legislação de dados"
  ],
  "answer": 2,
  "explanation": "O art. 42 da Lei 13.709/2018 (Lei Geral de Proteção de Dados Pessoais — LGPD) diz que o controlador ou o operador que, em razão do tratamento, causar dano patrimonial ou moral, individual ou coletivo, em violação à legislação de proteção de dados, é obrigado a repará-lo. O § 1º, I, diz que \"o operador responde solidariamente pelos danos causados pelo tratamento quando descumprir as obrigações da legislação de proteção de dados ou quando não tiver seguido as instruções lícitas do controlador, hipótese em que o operador equipara-se ao controlador\", salvo as excludentes do art. 43 (A e D estão erradas). O art. 43 diz que os agentes só não respondem se provarem que não realizaram o tratamento, que não houve violação à legislação ou que o dano decorre de culpa exclusiva do titular ou de terceiro; o operador contratado não é terceiro, e o mero uso de técnicas da época não exclui a responsabilidade de quem violou a lei (B e E estão erradas). O art. 44, parágrafo único, diz que responde pelos danos da violação de segurança o agente que, ao deixar de adotar as medidas de segurança, der causa ao dano.",
  "lawRef": "Lei 13.709/2018 (Lei Geral de Proteção de Dados Pessoais — LGPD), arts. 42, § 1º, I, 43 e 44, parágrafo único (responsabilidade civil dos agentes)"
 },
 {
  "id": "adm-m20-autoral-10",
  "origem": "autoral-ia",
  "q": "A ANPD constatou infração à LGPD cometida por uma autarquia estadual, após regular processo administrativo. Segundo o art. 52 da Lei 13.709/2018 (Lei Geral de Proteção de Dados Pessoais — LGPD), a autarquia:",
  "options": [
   "pode receber multa simples de até 2% de seu orçamento anual, limitada no total a R$ 50 milhões por infração",
   "pode receber, entre outras, advertência, publicização da infração e bloqueio ou eliminação dos dados, mas não multa",
   "não se sujeita a nenhuma sanção da ANPD, que só fiscaliza agentes de tratamento de direito privado",
   "pode receber, como primeira sanção, a suspensão do exercício da atividade de tratamento pelo prazo de até 1 ano",
   "pode ser sancionada sem procedimento administrativo prévio, diante da urgência na proteção dos dados dos titulares"
  ],
  "answer": 1,
  "explanation": "O art. 52 da Lei 13.709/2018 (Lei Geral de Proteção de Dados Pessoais — LGPD) prevê advertência, multa simples (de até 2% do faturamento da pessoa jurídica de direito privado, limitada a R$ 50 milhões por infração), multa diária, publicização, bloqueio, eliminação, suspensão parcial do banco de dados, suspensão da atividade de tratamento e proibição de atividades. O § 3º diz que as sanções dos incisos I, IV, V, VI, X, XI e XII podem ser aplicadas às entidades e aos órgãos públicos, sem prejuízo da Lei 8.112/1990 (Estatuto dos Servidores Públicos Federais), da Lei 8.429/1992 (Lei de Improbidade Administrativa) e da Lei 12.527/2011 (Lei de Acesso à Informação); as multas dos incisos II e III ficam de fora (A e C estão erradas). O § 1º diz que as sanções são aplicadas após procedimento administrativo com ampla defesa (E está errada). O § 6º diz que as suspensões e a proibição só cabem depois de imposta ao menos uma das sanções dos incisos II a VI no mesmo caso, e o inciso XI diz que a suspensão dura no máximo 6 meses, prorrogável por igual período (D está errada).",
  "lawRef": "Lei 13.709/2018 (Lei Geral de Proteção de Dados Pessoais — LGPD), art. 52, caput e §§ 1º, 3º e 6º (sanções administrativas)"
 }
];
