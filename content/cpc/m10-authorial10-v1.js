/* Base Completa | Direito Processual Civil M10 (Formação, suspensão, extinção e petição inicial): dez questões originais autorais e comentadas.
 * Não são questões reais de bancas. Escritas em 11/11/2026 no nível de prova (5 alternativas),
 * com gabarito equilibrado (A–E, duas vezes cada); cada lei citada traz o nome e cada artigo, o que ele diz.
 * Fontes: CPC (Código de Processo Civil, Lei 13.105/2015), arts. 240, 241, 312 a 315, 317, 319, 321, 324, 326, 327, 329 a 332 e 334; Lei 10.406/2002 (Código Civil), art. 397.
 */
window.BC_CPC_AUTHORIAL_OVERRIDES=window.BC_CPC_AUTHORIAL_OVERRIDES||{};
window.BC_CPC_AUTHORIAL_OVERRIDES[10]=[
  {
    "id": "cpc-m10-autoral-01",
    "q": "Credor de obrigação sem termo, que nunca interpelou o devedor, protocola ação de cobrança em 3 de fevereiro. O despacho que ordena a citação é de 20 de fevereiro, e a citação válida do réu ocorre em 10 de abril. Segundo o CPC:",
    "options": [
      "a ação só se considera proposta em 10 de abril, pois a relação processual se forma por completo apenas com a citação válida",
      "a ação se considera proposta em 20 de fevereiro, data do despacho, e desde então o réu está constituído em mora",
      "a ação se considera proposta em 3 de fevereiro, e a mora do réu retroage a essa data, assim como a litispendência",
      "a ação se considera proposta em 20 de fevereiro, mas a mora do réu só se constitui com o trânsito em julgado da sentença",
      "a ação se considera proposta em 3 de fevereiro, mas a mora do réu só se constitui com a citação, em 10 de abril"
    ],
    "answer": 4,
    "explanation": "O art. 312 do CPC diz: \"Considera-se proposta a ação quando a petição inicial for protocolada, todavia, a propositura da ação só produz quanto ao réu os efeitos mencionados no art. 240 depois que for validamente citado\". O art. 240 diz que a citação válida \"induz litispendência, torna litigiosa a coisa e constitui em mora o devedor\", ressalvados os arts. 397 e 398 do Código Civil. Como a obrigação não tem termo e não houve interpelação prévia (o art. 397, parágrafo único, da Lei 10.406/2002 (Código Civil) diz que, não havendo termo, a mora se constitui mediante interpelação judicial ou extrajudicial), a mora surge com a citação. A ação nasce com o protocolo, e não com o despacho ou a citação. Só a interrupção da prescrição, operada pelo despacho, retroage à data da propositura (art. 240, § 1º); a mora e a litispendência quanto ao réu não retroagem.",
    "lawRef": "CPC (Lei 13.105/2015), arts. 240 e 312; Código Civil, art. 397, parágrafo único",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "cpc-m10-autoral-02",
    "q": "No processo X, as partes convencionaram a suspensão do processo. No processo Y, o juiz suspendeu o feito porque a sentença de mérito depende do julgamento de outra causa, ainda pendente. Quanto ao prazo máximo de suspensão, segundo o art. 313 do CPC:",
    "options": [
      "1 ano em X e 6 meses em Y, findos os quais o processo Y é extinto sem resolução do mérito",
      "6 meses em X e 1 ano em Y, findos os quais os dois processos são extintos sem resolução do mérito",
      "6 meses em X e 1 ano em Y, esgotados os quais o juiz determinará o prosseguimento do processo",
      "1 ano nos dois casos, prazo máximo único fixado para toda hipótese de suspensão prevista no art. 313",
      "6 meses em X; em Y, não há prazo máximo, e o processo aguarda o trânsito em julgado da causa prejudicial"
    ],
    "answer": 2,
    "explanation": "O art. 313 do CPC diz que se suspende o processo \"II - pela convenção das partes\" e \"V - quando a sentença de mérito: a) depender do julgamento de outra causa ou da declaração de existência ou de inexistência de relação jurídica que constitua o objeto principal de outro processo pendente\". O § 4º diz: \"O prazo de suspensão do processo nunca poderá exceder 1 (um) ano nas hipóteses do inciso V e 6 (seis) meses naquela prevista no inciso II\". E o § 5º diz que \"o juiz determinará o prosseguimento do processo assim que esgotados os prazos previstos no § 4º\". Assim, o fim do prazo não gera extinção: o processo retoma seu curso. As alternativas que invertem os prazos, que fixam prazo único para toda suspensão ou que admitem espera indefinida pela causa prejudicial contrariam o § 4º.",
    "lawRef": "CPC (Lei 13.105/2015), art. 313, II e V, \"a\", e §§ 4º e 5º",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "cpc-m10-autoral-03",
    "q": "A advogada que é a única patrona da ré em ação de cobrança obtém, por sentença, a adoção de uma criança. Ela comprova o fato com o termo judicial e notifica a cliente. Segundo o CPC, o processo:",
    "options": [
      "fica suspenso por 120 dias, prazo equivalente ao da licença-maternidade, contado do trânsito em julgado da adoção",
      "fica suspenso por 30 dias, contados da data da concessão da adoção, já que houve notificação à cliente",
      "fica suspenso por 8 dias, prazo que o CPC prevê para a parentalidade, sem distinguir entre parto e adoção",
      "não se suspende, pois a suspensão prevista no CPC se limita ao parto e não alcança a hipótese de adoção",
      "só se suspende se o juiz entender que há risco de prejuízo à defesa, já que a medida depende de sua avaliação"
    ],
    "answer": 1,
    "explanation": "O art. 313, IX, do CPC diz que se suspende o processo \"pelo parto ou pela concessão de adoção, quando a advogada responsável pelo processo constituir a única patrona da causa\". O § 6º diz que, nesse caso, \"o período de suspensão será de 30 (trinta) dias, contado a partir da data do parto ou da concessão da adoção\", mediante certidão de nascimento ou documento similar, ou termo judicial que tenha concedido a adoção, \"desde que haja notificação ao cliente\". O prazo de 8 dias é o do inciso X, quando o advogado único patrono \"tornar-se pai\" (§ 7º). A lei inclui expressamente a adoção, não usa o prazo da licença-maternidade e não deixa a suspensão à discricionariedade do juiz: preenchidos os requisitos, ela ocorre.",
    "lawRef": "CPC (Lei 13.105/2015), art. 313, IX e X, e §§ 6º e 7º",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "cpc-m10-autoral-04",
    "q": "A petição inicial não informa o CPF nem o endereço eletrônico do réu, mas traz seu endereço residencial completo, suficiente para a citação. Além disso, a petição não indica o valor da causa. Segundo o CPC, o juiz deve:",
    "options": [
      "mandar emendar a inicial em 15 dias quanto ao valor da causa, indicando o que corrigir, sem exigir CPF e e-mail",
      "indeferir a petição inicial de plano, pois a falta do valor da causa e dos dados do réu são vícios que não admitem correção",
      "mandar emendar a inicial em 5 dias quanto a todos os pontos, inclusive CPF e e-mail do réu, sob pena de indeferimento",
      "mandar emendar a inicial em 15 dias quanto ao CPF e ao e-mail do réu, que são requisitos indispensáveis à citação eletrônica",
      "mandar citar o réu e deixar a fixação do valor da causa para a sentença, pois a omissão não impede o andamento do processo"
    ],
    "answer": 0,
    "explanation": "O art. 319 do CPC diz que a petição inicial indicará, entre outros, os nomes, o CPF ou CNPJ, o endereço eletrônico, o domicílio e a residência das partes (inciso II) e o valor da causa (inciso V). Mas o § 2º diz que \"a petição inicial não será indeferida se, a despeito da falta de informações a que se refere o inciso II, for possível a citação do réu\". Quanto ao valor da causa, o art. 321 diz que o juiz, ao verificar que a inicial não preenche os requisitos dos arts. 319 e 320, \"determinará que o autor, no prazo de 15 (quinze) dias, a emende ou a complete, indicando com precisão o que deve ser corrigido ou completado\"; só se o autor não cumprir a diligência a inicial será indeferida (parágrafo único). O art. 317 reforça que, antes de decisão sem resolução de mérito, o juiz deve dar à parte a chance de corrigir o vício. O prazo de emenda é de 15 dias, não 5.",
    "lawRef": "CPC (Lei 13.105/2015), art. 319, II, V e § 2º; arts. 317 e 321",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "cpc-m10-autoral-05",
    "q": "Em ação de indenização, o juiz cível suspendeu o processo porque o conhecimento do mérito depende da verificação de fato delituoso. Passaram-se 4 meses da intimação do ato de suspensão, e a ação penal não foi proposta. Segundo o art. 315 do CPC:",
    "options": [
      "o processo continua suspenso até completar 1 ano, prazo máximo previsto para a suspensão em razão de fato delituoso",
      "o processo deve ser extinto sem resolução do mérito, pois a inércia em propor a ação penal impede o julgamento cível",
      "o processo continua suspenso até o trânsito em julgado da sentença penal, pois a jurisdição criminal prevalece sobre a cível",
      "cessa o efeito da suspensão, e cabe ao juiz cível examinar incidentalmente a questão prévia do fato delituoso",
      "cessa o efeito da suspensão só após 6 meses, prazo máximo da suspensão por convenção, aplicado aqui por analogia"
    ],
    "answer": 3,
    "explanation": "O art. 315 do CPC diz: \"Se o conhecimento do mérito depender de verificação da existência de fato delituoso, o juiz pode determinar a suspensão do processo até que se pronuncie a justiça criminal\". O § 1º diz: \"Se a ação penal não for proposta no prazo de 3 (três) meses, contado da intimação do ato de suspensão, cessará o efeito desse, incumbindo ao juiz cível examinar incidentalmente a questão prévia\". O prazo de 1 ano vem do § 2º e só se aplica se a ação penal for proposta: nesse caso, o processo fica suspenso pelo prazo máximo de 1 ano, e depois o juiz cível também decide a questão. Não há extinção nem espera indefinida, e o prazo de 6 meses da convenção (art. 313, § 4º) não se aplica. Durante a suspensão, o art. 314 diz que é vedado praticar atos processuais, mas o juiz pode determinar atos urgentes para evitar dano irreparável.",
    "lawRef": "CPC (Lei 13.105/2015), art. 315, §§ 1º e 2º; art. 314",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "cpc-m10-autoral-06",
    "q": "Segundo o art. 324 do CPC, é lícito ao autor formular pedido genérico na seguinte situação:",
    "options": [
      "indenização por lesões corporais cujas sequelas ainda não podem ser dimensionadas, pois a vítima segue em tratamento",
      "cobrança de dívida de valor conhecido pelo autor, que prefere ver a quantia apurada só na fase de liquidação de sentença",
      "ação reivindicatória de imóvel determinado, em que o autor pede \"os bens que vierem a ser apurados\" ao longo da instrução",
      "revisão de contrato de financiamento, sem discriminar as cláusulas controvertidas nem quantificar o valor incontroverso",
      "ação declaratória em que o autor deixa para a fase de instrução a definição de qual relação jurídica quer ver declarada"
    ],
    "answer": 0,
    "explanation": "O art. 324 do CPC diz que \"o pedido deve ser determinado\", mas o § 1º diz que é lícito formular pedido genérico: \"I - nas ações universais, se o autor não puder individuar os bens demandados; II - quando não for possível determinar, desde logo, as consequências do ato ou do fato; III - quando a determinação do objeto ou do valor da condenação depender de ato que deva ser praticado pelo réu\". A vítima em tratamento se enquadra no inciso II. Na cobrança de valor conhecido não há impossibilidade, apenas conveniência do autor. A reivindicatória de bem determinado não é ação universal, e o autor pode individuar o bem. O art. 330, § 2º, diz que, nas ações de revisão de obrigação decorrente de empréstimo, financiamento ou alienação de bens, o autor tem de discriminar as obrigações que pretende controverter e quantificar o valor incontroverso, sob pena de inépcia. E deixar indefinida a relação a declarar é pedido indeterminado, causa de inépcia (art. 330, § 1º, II).",
    "lawRef": "CPC (Lei 13.105/2015), art. 324, § 1º (pedido genérico), e art. 330, §§ 1º, II, e 2º",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "cpc-m10-autoral-07",
    "q": "Contra o mesmo réu, o autor cumula, em um só processo pelo procedimento comum, pedido de cobrança de nota promissória vencida e pedido de indenização por danos ao seu veículo em colisão causada pelo réu, fatos sem nenhuma relação entre si. A cumulação é:",
    "options": [
      "inadmissível, pois a cumulação de pedidos exige conexão entre eles, isto é, pedido ou causa de pedir comum",
      "admissível apenas se o réu concordar expressamente, por se tratar de cumulação de pedidos sem conexão",
      "admissível, se os pedidos forem compatíveis, o juízo for competente para ambos e o procedimento for adequado",
      "admissível somente se os pedidos forem formulados em ordem subsidiária, já que não guardam relação entre si",
      "inadmissível, pois a cumulação simples só é permitida quando os pedidos derivam do mesmo contrato ou do mesmo fato"
    ],
    "answer": 2,
    "explanation": "O art. 327 do CPC diz: \"É lícita a cumulação, em um único processo, contra o mesmo réu, de vários pedidos, ainda que entre eles não haja conexão\". O § 1º diz que são requisitos de admissibilidade da cumulação que \"I - os pedidos sejam compatíveis entre si; II - seja competente para conhecer deles o mesmo juízo; III - seja adequado para todos os pedidos o tipo de procedimento\", e o § 2º admite a cumulação de pedidos com procedimentos diversos se o autor usar o procedimento comum. A conexão não é exigida, nem o consentimento do réu. A ordem subsidiária (art. 326, que diz ser lícito formular mais de um pedido para que o juiz conheça do posterior quando não puder acolher o anterior) não é condição para cumular; o § 3º do art. 327 apenas dispensa a compatibilidade nesse tipo de cumulação.",
    "lawRef": "CPC (Lei 13.105/2015), art. 327, caput e §§ 1º a 3º; art. 326",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "cpc-m10-autoral-08",
    "q": "O réu já foi citado e contestou, mas o processo ainda não foi saneado. O autor pretende acrescentar nova causa de pedir à petição inicial. Segundo o art. 329 do CPC, o aditamento:",
    "options": [
      "é livre até o saneamento, independentemente de consentimento do réu, bastando que o juiz ouça a parte contrária em 5 dias",
      "é vedado, pois, depois da citação, o pedido e a causa de pedir ficam estabilizados e não podem mais ser alterados",
      "depende apenas de autorização do juiz, que decidirá sobre a conveniência da alteração, ouvido o Ministério Público",
      "é possível até a sentença, desde que o réu consinta e que não haja necessidade de produção de novas provas no processo",
      "depende do consentimento do réu, que terá prazo mínimo de 15 dias para se manifestar, com possível prova suplementar"
    ],
    "answer": 4,
    "explanation": "O art. 329 do CPC diz que o autor poderá: \"I - até a citação, aditar ou alterar o pedido ou a causa de pedir, independentemente de consentimento do réu; II - até o saneamento do processo, aditar ou alterar o pedido e a causa de pedir, com consentimento do réu, assegurado o contraditório mediante a possibilidade de manifestação deste no prazo mínimo de 15 (quinze) dias, facultado o requerimento de prova suplementar\". Como o réu já foi citado e o processo não foi saneado, aplica-se o inciso II: é preciso o consentimento do réu. Não há liberdade plena após a citação, nem vedação absoluta antes do saneamento; o limite final é o saneamento, e não a sentença, e a decisão não depende só da conveniência do juiz. O parágrafo único diz que a regra se aplica também à reconvenção.",
    "lawRef": "CPC (Lei 13.105/2015), art. 329, I e II (alteração do pedido e da causa de pedir)",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "cpc-m10-autoral-09",
    "q": "Em causa que dispensa a fase instrutória, o juiz, sem citar o réu, julga liminarmente improcedente o pedido, por contrariar enunciado de súmula do STJ. O autor apela. Segundo o art. 332 do CPC:",
    "options": [
      "a decisão extingue o processo sem resolução do mérito, por isso o autor pode simplesmente repropor a mesma ação",
      "o juiz pode se retratar em 5 dias; se não o fizer, mandará citar o réu para apresentar contrarrazões em 15 dias",
      "o juiz pode se retratar em 15 dias; se não o fizer, o recurso sobe ao tribunal sem a participação do réu",
      "o juiz deve mandar citar o réu para contestar em 15 dias, pois a apelação desfaz automaticamente a sentença liminar",
      "a decisão deveria ter sido impugnada por agravo de instrumento, pois foi proferida antes da citação do réu"
    ],
    "answer": 1,
    "explanation": "O art. 332 do CPC diz que, \"nas causas que dispensem a fase instrutória, o juiz, independentemente da citação do réu, julgará liminarmente improcedente o pedido que contrariar: I - enunciado de súmula do Supremo Tribunal Federal ou do Superior Tribunal de Justiça\", entre outras hipóteses. É sentença de mérito, que faz coisa julgada, diferente do indeferimento da inicial (art. 330), que não resolve o mérito. O § 3º diz que, \"interposta a apelação, o juiz poderá retratar-se em 5 (cinco) dias\", e o § 4º diz que, havendo retratação, o processo prossegue com a citação do réu e, \"se não houver retratação, determinará a citação do réu para apresentar contrarrazões, no prazo de 15 (quinze) dias\". O recurso cabível é a apelação, e não o agravo. Se não houver apelação, o § 2º diz que o réu será intimado do trânsito em julgado.",
    "lawRef": "CPC (Lei 13.105/2015), art. 332, caput, I, e §§ 2º a 4º; art. 330",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "cpc-m10-autoral-10",
    "q": "Na petição inicial, o autor manifestou desinteresse na autocomposição; o réu, citado, nada disse. A audiência de conciliação foi designada, e o autor faltou sem justificativa. Segundo o art. 334 do CPC:",
    "options": [
      "a audiência não deveria ter sido designada, pois basta que uma das partes manifeste desinteresse para que ela não ocorra",
      "a ausência do autor gera a extinção do processo sem resolução do mérito, por abandono da causa, após sua intimação pessoal",
      "a ausência do autor é ato atentatório à dignidade da justiça, com multa de até 10% do valor da causa, revertida ao réu",
      "a ausência do autor é ato atentatório, punido com multa de até 2% da vantagem pretendida ou do valor da causa",
      "a ausência do autor não gera sanção, pois ele já havia manifestado desinteresse na conciliação na petição inicial"
    ],
    "answer": 3,
    "explanation": "O art. 334, § 4º, I, do CPC diz que a audiência não será realizada \"se ambas as partes manifestarem, expressamente, desinteresse na composição consensual\"; o § 5º diz que o autor deve indicar o desinteresse na petição inicial e o réu, \"por petição, apresentada com 10 (dez) dias de antecedência, contados da data da audiência\". Como o réu se calou, a audiência era obrigatória. O § 8º diz que \"o não comparecimento injustificado do autor ou do réu à audiência de conciliação é considerado ato atentatório à dignidade da justiça e será sancionado com multa de até dois por cento da vantagem econômica pretendida ou do valor da causa, revertida em favor da União ou do Estado\". Não há extinção por abandono, a multa não é de 10% nem revertida ao réu, e o desinteresse unilateral não isenta o faltoso. O caput diz que a audiência é marcada com antecedência mínima de 30 dias, com citação do réu pelo menos 20 dias antes.",
    "lawRef": "CPC (Lei 13.105/2015), art. 334, caput e §§ 4º, 5º e 8º",
    "provenance": "questao-autoral-IA-revisada"
  }
];
