/* Conteúdo didático original; não são itens oficiais FCC. */
window.RLM_CURSO_AULAS=Object.assign(window.RLM_CURSO_AULAS||{}, {
  "M02": {
    "theory": [
      {
        "title": "Proposição e valor lógico",
        "paragraphs": [
          "Na lógica clássica, uma proposição é uma sentença declarativa à qual se pode atribuir exatamente um dos valores verdadeiros: verdadeiro (V) ou falso (F). 'Fortaleza fica no Ceará' é uma proposição; 'Feche a porta' (ordem), 'Qual é sua idade?' (pergunta) e 'x é maior que 5', sem valor fixado para x, não são proposições fechadas.",
          "O princípio da não contradição impede que uma mesma proposição seja V e F simultaneamente, no mesmo sentido. O terceiro excluído estabelece, nesse sistema, que ela é V ou F. O fato de não sabermos o valor de verdade não transforma uma frase declarativa em pergunta. Classifique a estrutura primeiro, investigue o valor depois."
        ],
        "example": "Exemplo resolvido: '2 + 3 = 5' é proposição verdadeira. '2 + x = 5' é sentença aberta; com x = 3, transforma-se em proposição verdadeira."
      },
      {
        "title": "Conectivos e tradução do português",
        "paragraphs": [
          "Os conectivos formam proposições compostas: P e Q (conjunção, P ∧ Q); P ou Q (disjunção inclusiva, P ∨ Q); ou P ou Q, mas não ambos (exclusiva); se P, então Q (condicional, P → Q); P se e somente se Q (bicondicional, P ↔ Q); não P (negação, ¬P). Em concursos, a palavra 'ou' só será exclusiva quando o contexto exigir exclusividade.",
          "Uma conjunção só é verdadeira quando as duas partes o são. A disjunção inclusiva é falsa somente quando ambas são falsas. O enunciado pode trocar a ordem natural: 'Q se P' significa P → Q; 'P somente se Q' significa P → Q. Uma hipótese de trabalho pode ser falsa sem comprometer uma condicional verdadeira."
        ],
        "example": "Exemplo resolvido: 'Se estudo (P), então reviso (Q)' traduz-se por P → Q; 'Estudo e não reviso' traduz-se por P ∧ ¬Q."
      },
      {
        "title": "Tabela-verdade e condicionais",
        "paragraphs": [
          "Para P e Q, a tabela-verdade possui quatro combinações: VV, VF, FV e FF. Em P → Q, o único caso falso é P verdadeiro e Q falso. A condicional não afirma que P ocorreu; ela proíbe, sob a regra assumida, que P ocorra sem Q. A bicondicional é verdadeira quando ambas têm o mesmo valor lógico.",
          "Para n proposições simples independentes, uma tabela completa tem 2 elevado a n linhas: com três letras, são oito linhas. Em expressões longas, calcule primeiro as negações, depois conjunções e disjunções e, por fim, condicionais/bicondicionais, observando os parênteses."
        ],
        "example": "Exemplo resolvido: se P = F e Q = V, P → Q = V, P ∧ Q = F e P ∨ Q = V."
      },
      {
        "title": "Condições necessária e suficiente",
        "paragraphs": [
          "Em P → Q, P é condição suficiente para Q; Q é condição necessária para P. Isso não garante que Q provoque P. A reciprocidade depende de uma afirmação adicional Q → P. Em P ↔ Q há as duas implicações, e cada condição é necessária e suficiente para a outra.",
          "O modo mais seguro de resolver uma afirmação verbal é identificar o fato que vem após 'se' e convertê-lo em antecedente. Não substitua 'somente se' por 'se': as duas expressões apontam para lados diferentes da condicional."
        ],
        "example": "Exemplo resolvido: 'Entrarei somente se houver autorização' implica Entrar → Autorização. Autorização é necessária para entrar; pode haver autorização sem entrada."
      },
      {
        "title": "Método de prova e erros recorrentes",
        "paragraphs": [
          "Ao enfrentar uma questão FCC: destaque as proposições simples, atribua letras, identifique o conectivo principal, escreva a expressão e só então avalie alternativas. Essa sequência evita resolver pela intuição frases com 'apenas se', 'não é verdade que' e 'mas'. Na lógica formal, 'mas' funciona como 'e': expressa contraste retórico, não uma tabela nova.",
          "Use contraexemplos controlados. Para derrubar 'P implica Q', basta encontrar um caso permitido em que P seja verdadeiro e Q falso. Para derrubar 'P e Q', basta uma parte falsa. Não extrapole além das premissas: a lógica das proposições analisa a forma, e não a plausibilidade do assunto narrado."
        ],
        "example": "Exemplo resolvido: 'Ana estuda, mas Bruno não estuda' corresponde a A ∧ ¬B; basta Bruno estudar para a afirmação inteira ser falsa."
      }
    ],
    "summary": [
      {
        "title": "Proposição",
        "text": "Frase declarativa com valor de verdade definido.",
        "bizu": "Pergunta, ordem e variável livre não são proposições fechadas."
      },
      {
        "title": "Conjunção e disjunção",
        "text": "P ∧ Q exige VV; P ∨ Q inclusiva só é falsa em FF.",
        "bizu": "Sem 'exatamente um', comece pelo OU inclusivo."
      },
      {
        "title": "Condicional",
        "text": "P → Q só é falsa quando P é V e Q é F.",
        "bizu": "Verdade da condicional não prova a ocorrência de P."
      },
      {
        "title": "Necessária e suficiente",
        "text": "Em P → Q, P é suficiente; Q é necessária.",
        "bizu": "'P somente se Q' também vira P → Q."
      },
      {
        "title": "Tabelas-verdade",
        "text": "Com n proposições simples, há 2^n linhas.",
        "bizu": "Parênteses e negações devem ser respeitados."
      }
    ],
    "mindmap": [
      {
        "name": "Frases",
        "branches": [
          "proposição: V ou F",
          "sentenças abertas",
          "interrogativas e ordens"
        ]
      },
      {
        "name": "Conectivos",
        "branches": [
          "¬, ∧, ∨",
          "→ e ↔",
          "ou exclusivo"
        ]
      },
      {
        "name": "Tabelas",
        "branches": [
          "2^n combinações",
          "caso VF da condicional",
          "equivalência de valores"
        ]
      },
      {
        "name": "Tradução",
        "branches": [
          "se e somente se",
          "somente se",
          "necessária/suficiente"
        ]
      }
    ],
    "questions": [
      {
        "level": "fácil",
        "prompt": "Qual frase é uma proposição lógica?",
        "options": [
          "Abra o processo.",
          "Que horas são?",
          "O número 8 é par.",
          "x + 1 = 4, sem fixar x.",
          "Tomara que chova."
        ],
        "answer": 2,
        "explanation": "É declarativa e possui valor V. Ordens, perguntas, desejos e sentença com variável livre não têm valor lógico determinado.",
        "origin": "autoral"
      },
      {
        "level": "fácil",
        "prompt": "A conjunção P ∧ Q é verdadeira quando:",
        "options": [
          "P for verdadeiro, qualquer que seja Q.",
          "Q for verdadeiro, qualquer que seja P.",
          "P e Q forem falsos.",
          "P e Q forem verdadeiros.",
          "P e Q tiverem valores diferentes."
        ],
        "answer": 3,
        "explanation": "A conjunção exige simultaneamente P = V e Q = V.",
        "origin": "autoral"
      },
      {
        "level": "fácil",
        "prompt": "Para duas proposições simples P e Q, quantas linhas há na tabela-verdade completa?",
        "options": [
          "2",
          "3",
          "4",
          "6",
          "8"
        ],
        "answer": 2,
        "explanation": "São 2^n combinações; para n = 2, 2² = 4.",
        "origin": "autoral"
      },
      {
        "level": "médio",
        "prompt": "Se P é verdadeira e Q é falsa, o valor de P → Q é:",
        "options": [
          "V",
          "F",
          "indefinido",
          "igual a Q ∨ P",
          "igual a ¬P"
        ],
        "answer": 1,
        "explanation": "A condicional é falsa exatamente na combinação antecedente verdadeiro e consequente falso.",
        "origin": "autoral"
      },
      {
        "level": "médio",
        "prompt": "A sentença 'Vou ao fórum somente se houver expediente' é representada, com F = ir ao fórum e E = haver expediente, por:",
        "options": [
          "E → F",
          "F → E",
          "F ∧ E",
          "F ↔ E",
          "¬E → F"
        ],
        "answer": 1,
        "explanation": "'Somente se' introduz condição necessária. Ir ao fórum implica haver expediente; não o contrário.",
        "origin": "autoral"
      },
      {
        "level": "médio",
        "prompt": "Qual expressão representa 'Não é verdade que Paulo trabalha e estuda'?",
        "options": [
          "¬P ∧ E",
          "P ∨ E",
          "¬(P ∧ E)",
          "P → E",
          "P ↔ E"
        ],
        "answer": 2,
        "explanation": "A negação incide sobre toda a conjunção: ¬(P ∧ E), equivalente a ¬P ∨ ¬E.",
        "origin": "autoral"
      },
      {
        "level": "médio",
        "prompt": "Sabendo P = F e Q = F, qual o valor de P ∨ Q (ou inclusivo)?",
        "options": [
          "V",
          "F",
          "V apenas se Q for V",
          "impossível determinar",
          "igual a ¬P ∧ Q"
        ],
        "answer": 1,
        "explanation": "O OU inclusivo é falso somente quando todas as parcelas são falsas.",
        "origin": "autoral"
      },
      {
        "level": "difícil",
        "prompt": "Em que atribuição a fórmula (P → Q) ∧ P é verdadeira?",
        "options": [
          "P = V e Q = V",
          "P = V e Q = F",
          "P = F e Q = V",
          "P = F e Q = F",
          "P e Q são sempre independentes da fórmula"
        ],
        "answer": 0,
        "explanation": "Para a conjunção ser verdadeira, P deve ser V. Para P → Q ser V com P verdadeiro, Q também deve ser V. Só VV satisfaz ambas as parcelas.",
        "origin": "autoral"
      },
      {
        "level": "difícil",
        "prompt": "A frase 'Se Renato não viaja, então Carla trabalha' tem qual antecedente?",
        "options": [
          "Carla trabalha",
          "Renato viaja",
          "Carla não trabalha",
          "Renato não viaja",
          "Carla viaja"
        ],
        "answer": 3,
        "explanation": "O antecedente é a parte que segue 'se': ¬R, com R = Renato viaja.",
        "origin": "autoral"
      },
      {
        "level": "difícil",
        "prompt": "Qual afirmação sobre P ↔ Q é correta?",
        "options": [
          "Só é verdadeira em VF.",
          "Só é verdadeira em FV.",
          "É verdadeira exatamente quando P e Q têm o mesmo valor lógico.",
          "É sempre verdadeira.",
          "É equivalente a P ∨ Q."
        ],
        "answer": 2,
        "explanation": "A bicondicional é verdadeira em VV e FF, pois P e Q coincidem.",
        "origin": "autoral"
      }
    ]
  },
  "M03": {
    "theory": [
      {
        "title": "A negação troca o valor lógico",
        "paragraphs": [
          "Negar uma proposição significa construir uma sentença verdadeira exatamente nos casos em que a original é falsa. A negação de 'Hoje há sessão' é 'Hoje não há sessão'; a de 'Não há sessão' é 'Há sessão'. Negação lógica não é mera escolha de um verbo contrário: 'Não é obrigatório' não equivale a 'É proibido'.",
          "Duas negações consecutivas se cancelam: ¬(¬P) = P. Quando aparecem conectivos, a negação precisa incidir sobre a expressão inteira, respeitando sua estrutura. Decida primeiro qual conectivo domina a sentença."
        ],
        "example": "Exemplo resolvido: negar 'Ana é servidora' produz 'Ana não é servidora'; negar 'Ana não é servidora' restabelece a primeira afirmação."
      },
      {
        "title": "Leis de De Morgan",
        "paragraphs": [
          "A negação da conjunção transforma-se em disjunção de negações: ¬(P ∧ Q) ↔ (¬P ∨ ¬Q). A negação da disjunção inclusiva torna-se conjunção de negações: ¬(P ∨ Q) ↔ (¬P ∧ ¬Q). O conectivo muda e cada parcela é negada.",
          "Uma pergunta frequente é 'Qual frase contradiz o enunciado?'. Para refutar 'Todos vieram e assinaram', basta que não tenham vindo OU não tenham assinado. Já para refutar 'Alguém veio ou assinou', as duas ações precisam faltar. Se houver três parcelas, aplique a regra a todas elas."
        ],
        "example": "Exemplo resolvido: ¬(Chove ∨ Venta) = Não chove ∧ Não venta. A negação de 'Chove e venta' é 'Não chove ou não venta'."
      },
      {
        "title": "Negação da condicional",
        "paragraphs": [
          "Como P → Q equivale a ¬P ∨ Q, sua negação equivale a P ∧ ¬Q. Isto é: 'Se há prova, estudo' só é desmentido por um caso em que há prova e eu não estudo. 'Não há prova' sozinho não contradiz a promessa condicional.",
          "A recíproca Q → P não é a negação, tampouco a inversa ¬P → ¬Q. A contrapositiva ¬Q → ¬P, ao contrário, é logicamente equivalente a P → Q. Use pares de letras para não inverter fórmulas."
        ],
        "example": "Exemplo resolvido: negar 'Se A é aprovado, então B é convocado' dá 'A é aprovado e B não é convocado'."
      },
      {
        "title": "Equivalências fundamentais",
        "paragraphs": [
          "Entre equivalências úteis: P → Q ↔ ¬P ∨ Q; P → Q ↔ ¬Q → ¬P; P ↔ Q ↔ (P → Q) ∧ (Q → P); ¬(P ∨ Q) ↔ ¬P ∧ ¬Q; ¬(P ∧ Q) ↔ ¬P ∨ ¬Q. Equivalência significa mesma coluna final de valores em todos os casos.",
          "Diferencie uma fórmula equivalente de uma consequência apenas provável. As frases 'Se P, então Q' e 'Se Q, então P' não são equivalentes em geral. Para testar, escolha P = F e Q = V: a primeira condicional é V; a segunda é F."
        ],
        "example": "Exemplo resolvido: 'Se há energia, a máquina liga' pode ser reescrita como 'Se a máquina não liga, então não há energia' somente dentro da regra formal enunciada."
      },
      {
        "title": "Quantificadores e linguagem natural",
        "paragraphs": [
          "Negar 'todos os servidores concluíram a tarefa' produz 'pelo menos um servidor não concluiu a tarefa'. Negar 'existe um aluno aprovado' equivale a 'nenhum aluno foi aprovado'. A negação inverte o quantificador universal/existencial e nega o predicado.",
          "As palavras 'algum', 'pelo menos um' e 'existe' equivalem em problemas de existência. Cuidado com 'algum não': não significa 'nenhum'. Para negar 'nenhum A é B', basta afirmar que ao menos um A é B. Esses recursos serão aplicados também aos diagramas."
        ],
        "example": "Exemplo resolvido: a negação de 'Todo processo é eletrônico' é 'Existe ao menos um processo que não é eletrônico'."
      }
    ],
    "summary": [
      {
        "title": "De Morgan",
        "text": "Negação de E vira OU; negação de OU vira E.",
        "bizu": "Troque o conectivo e negue todas as parcelas."
      },
      {
        "title": "Condicional",
        "text": "¬(P → Q) equivale a P ∧ ¬Q.",
        "bizu": "Para desmentir a promessa, mostre condição cumprida e resultado ausente."
      },
      {
        "title": "Contrapositiva",
        "text": "P → Q equivale a ¬Q → ¬P.",
        "bizu": "Contrapositiva não é recíproca."
      },
      {
        "title": "Reescrita útil",
        "text": "P → Q equivale a ¬P ∨ Q.",
        "bizu": "Atenção ao alcance do NÃO."
      },
      {
        "title": "Quantificadores",
        "text": "Não(Todo A é B) = Existe A que não é B.",
        "bizu": "Negue o quantificador e a propriedade."
      }
    ],
    "mindmap": [
      {
        "name": "Negações",
        "branches": [
          "dupla negação",
          "contradição",
          "escopo"
        ]
      },
      {
        "name": "De Morgan",
        "branches": [
          "¬(P ∧ Q)",
          "¬(P ∨ Q)"
        ]
      },
      {
        "name": "Condicional",
        "branches": [
          "¬(P→Q) = P∧¬Q",
          "contrapositiva",
          "¬P∨Q"
        ]
      },
      {
        "name": "Quantificadores",
        "branches": [
          "todo ↔ existe contraexemplo",
          "algum ↔ nenhum"
        ]
      }
    ],
    "questions": [
      {
        "level": "fácil",
        "prompt": "A negação de 'Ana estuda e Bruno trabalha' é:",
        "options": [
          "Ana não estuda e Bruno não trabalha.",
          "Ana não estuda ou Bruno não trabalha.",
          "Ana estuda ou Bruno trabalha.",
          "Ana não estuda e Bruno trabalha.",
          "Ana estuda e Bruno não trabalha."
        ],
        "answer": 1,
        "explanation": "De Morgan: negar P ∧ Q produz ¬P ∨ ¬Q.",
        "origin": "autoral"
      },
      {
        "level": "fácil",
        "prompt": "A negação de 'P ou Q', no sentido inclusivo, é:",
        "options": [
          "¬P ou ¬Q",
          "P e Q",
          "¬P e ¬Q",
          "P e ¬Q",
          "¬P → Q"
        ],
        "answer": 2,
        "explanation": "De Morgan: ¬(P ∨ Q) ↔ ¬P ∧ ¬Q.",
        "origin": "autoral"
      },
      {
        "level": "fácil",
        "prompt": "A negação de 'Todos foram pontuais' é:",
        "options": [
          "Ninguém foi pontual.",
          "Todos foram impontuais.",
          "Alguém foi pontual.",
          "Ao menos uma pessoa não foi pontual.",
          "Alguns foram pontuais."
        ],
        "answer": 3,
        "explanation": "Basta uma pessoa impontual para derrubar a universal.",
        "origin": "autoral"
      },
      {
        "level": "médio",
        "prompt": "Qual expressão equivale a P → Q?",
        "options": [
          "P ∧ Q",
          "¬P ∨ Q",
          "P ∨ ¬Q",
          "Q → P",
          "¬P ∧ Q"
        ],
        "answer": 1,
        "explanation": "A condicional é falsa somente em P = V e Q = F, assim como ¬P ∨ Q.",
        "origin": "autoral"
      },
      {
        "level": "médio",
        "prompt": "A negação de 'Se corro, então treino' é:",
        "options": [
          "Se não corro, não treino.",
          "Se treino, corro.",
          "Corro e não treino.",
          "Não corro ou treino.",
          "Corro e treino."
        ],
        "answer": 2,
        "explanation": "Negar P → Q gera P ∧ ¬Q.",
        "origin": "autoral"
      },
      {
        "level": "médio",
        "prompt": "A contrapositiva de 'Se A, então B' é:",
        "options": [
          "Se B, então A.",
          "Se não A, então não B.",
          "A e não B.",
          "Se não B, então não A.",
          "A ou B."
        ],
        "answer": 3,
        "explanation": "A contrapositiva ¬B → ¬A é equivalente à condicional original.",
        "origin": "autoral"
      },
      {
        "level": "médio",
        "prompt": "Negar 'Nenhum aluno faltou' resulta em:",
        "options": [
          "Todos faltaram.",
          "Nenhum compareceu.",
          "Pelo menos um aluno faltou.",
          "Alguns compareceram.",
          "Todo aluno faltou."
        ],
        "answer": 2,
        "explanation": "Negação de 'nenhum' é 'existe pelo menos um'.",
        "origin": "autoral"
      },
      {
        "level": "difícil",
        "prompt": "Qual é a negação de '(P ∨ Q) → R'?",
        "options": [
          "¬P ∧ ¬Q ∧ R",
          "(P ∨ Q) ∧ ¬R",
          "(P ∧ Q) ∧ ¬R",
          "¬(P ∨ Q) ∧ R",
          "¬P ∨ ¬Q ∨ R"
        ],
        "answer": 1,
        "explanation": "A negação da condicional é antecedente verdadeiro E consequente falso. Mantém-se P ∨ Q e nega-se R.",
        "origin": "autoral"
      },
      {
        "level": "difícil",
        "prompt": "Qual frase é equivalente a 'Não é verdade que, se estudo, então sou aprovado'?",
        "options": [
          "Não estudo e sou aprovado.",
          "Se não estudo, não sou aprovado.",
          "Estudo e não sou aprovado.",
          "Não estudo ou sou aprovado.",
          "Estudo se e somente se sou aprovado."
        ],
        "answer": 2,
        "explanation": "O contraexemplo de uma condicional é antecedente verdadeiro e consequente falso.",
        "origin": "autoral"
      },
      {
        "level": "difícil",
        "prompt": "A negação de 'Todos os A são B ou C' (OU inclusivo) é:",
        "options": [
          "Existe A que não é B e não é C.",
          "Nenhum A é B ou C.",
          "Todos os A não são B.",
          "Existe A que não é B ou não é C.",
          "Todos os A são B e C."
        ],
        "answer": 0,
        "explanation": "Negar universal exige um contraexemplo: existe A que não atende a B ∨ C, portanto ¬B ∧ ¬C.",
        "origin": "autoral"
      }
    ]
  },
  "M04": {
    "theory": [
      {
        "title": "Premissas, hipóteses e conclusão",
        "paragraphs": [
          "Um argumento contém premissas, tomadas como pontos de partida, e uma conclusão que se pretende derivar. Validade é propriedade da estrutura: o argumento é válido se for impossível suas premissas serem todas verdadeiras e a conclusão falsa ao mesmo tempo. Uma conclusão factualmente verdadeira pode resultar de raciocínio inválido.",
          "Ao ler um problema, marque o que foi dado ('sabemos que', 'admite-se', 'toda vez que') e o que se pede ('logo', 'conclui-se'). Não acrescente relações que o enunciado não forneceu; trate personagens e eventos fictícios como símbolos."
        ],
        "example": "Exemplo resolvido: 'Todos os analistas trabalham no tribunal. Lia é analista. Logo, Lia trabalha no tribunal' é válido por inclusão lógica."
      },
      {
        "title": "Modus ponens e modus tollens",
        "paragraphs": [
          "Modus ponens: P → Q; P; portanto Q. Modus tollens: P → Q; ¬Q; portanto ¬P. São dois esquemas centrais para provas objetivas. O primeiro aplica a regra ao caso confirmado; o segundo exclui o antecedente quando o resultado esperado não ocorreu.",
          "Falácias comuns: afirmar o consequente (P → Q; Q; logo P) e negar o antecedente (P → Q; ¬P; logo ¬Q). Ambas tentam usar uma implicação como se fosse equivalência. Em problemas reais, Q pode ocorrer por razões diversas de P."
        ],
        "example": "Exemplo resolvido: se há sessão (P), há expediente (Q). Não há expediente (¬Q). Conclui-se que não há sessão (¬P)."
      },
      {
        "title": "Encadeamento e contradição",
        "paragraphs": [
          "O silogismo hipotético encadeia P → Q e Q → R para obter P → R. Se sabemos também P, concluímos R. Para mostrar uma proposição impossível nas premissas, suponha-a e derive simultaneamente R e ¬R; a suposição é incompatível com o sistema.",
          "A prova por contraposição também simplifica cadeias: de P → R podemos inferir ¬R → ¬P. Tome cuidado com a direção: três afirmações isoladas sobre P, Q e R não formam uma cadeia se os consequentes e antecedentes não coincidirem."
        ],
        "example": "Exemplo resolvido: se Ana estuda, então revisa; se revisa, então aprende; Ana estuda. Logo, Ana aprende."
      },
      {
        "title": "Tabelas de validade e contraexemplos",
        "paragraphs": [
          "Para verificar um argumento com poucas proposições, construa as linhas de verdade e procure uma linha em que todas as premissas sejam V, mas a conclusão F. Se existir, o argumento é inválido; se não existir, é válido. Alternativamente, una as premissas com E e tente negar a conclusão.",
          "O contraexemplo deve obedecer a todas as premissas. Não basta imaginar situação em que a conclusão falhe se alguma premissa também estiver falsa. Premissas inconsistentes, no cálculo clássico, não admitem linha em que todas sejam verdadeiras; esse detalhe torna argumentos triviais formalmente válidos, mas pedagogicamente inúteis."
        ],
        "example": "Exemplo resolvido: de 'P ou Q' e 'não P', conclui-se Q. Se Q também fosse falso, a primeira premissa seria falsa; não há contraexemplo."
      },
      {
        "title": "Argumentos categóricos e método operacional",
        "paragraphs": [
          "Palavras como todo, nenhum e algum exigem raciocínio por inclusão de conjuntos: Todo A é B, Todo B é C implica Todo A é C. Já 'Todo A é B' e 'Algum B é C' não autorizam concluir que algum A é C. A área B compartilhada pode conter elementos alheios a A.",
          "Procedimento de prova: reescreva cada premissa em uma linha, traduza conectivos e quantificadores, trace uma pequena cadeia/diagrama, teste a alternativa como conclusão necessária. A FCC pode misturar conteúdos verbais, espaciais e matemáticos; a obrigação é demonstrar, e não apenas achar plausível."
        ],
        "example": "Exemplo resolvido: Todo técnico é servidor; nenhum servidor é robô. Portanto, nenhum técnico é robô."
      }
    ],
    "summary": [
      {
        "title": "Validade",
        "text": "Premissas V e conclusão F é o único tipo de contraexemplo que invalida argumento.",
        "bizu": "Verdade factual não equivale a validade."
      },
      {
        "title": "Modus ponens",
        "text": "P→Q e P garantem Q.",
        "bizu": "Confirme o antecedente."
      },
      {
        "title": "Modus tollens",
        "text": "P→Q e ¬Q garantem ¬P.",
        "bizu": "Negou o resultado? Negue a condição."
      },
      {
        "title": "Falácias",
        "text": "P→Q e Q não permitem concluir P.",
        "bizu": "Consequente verdadeiro pode ter outras causas."
      },
      {
        "title": "Cadeias",
        "text": "P→Q, Q→R permitem P→R.",
        "bizu": "Una setas com o termo intermediário idêntico."
      }
    ],
    "mindmap": [
      {
        "name": "Argumento",
        "branches": [
          "premissa",
          "conclusão",
          "validade"
        ]
      },
      {
        "name": "Inferências",
        "branches": [
          "modus ponens",
          "modus tollens",
          "silogismo hipotético"
        ]
      },
      {
        "name": "Falácias",
        "branches": [
          "afirmação do consequente",
          "negação do antecedente"
        ]
      },
      {
        "name": "Métodos",
        "branches": [
          "contraexemplo",
          "diagrama",
          "tabela-verdade"
        ]
      }
    ],
    "questions": [
      {
        "level": "fácil",
        "prompt": "De P → Q e P, conclui-se validamente:",
        "options": [
          "¬P",
          "¬Q",
          "Q",
          "P ↔ Q",
          "Q → P"
        ],
        "answer": 2,
        "explanation": "É a regra modus ponens: regra condicional mais antecedente afirmado.",
        "origin": "autoral"
      },
      {
        "level": "fácil",
        "prompt": "O argumento 'Todo A é B; todo B é C; logo, todo A é C' é:",
        "options": [
          "Inválido em qualquer caso.",
          "Válido por inclusão transitiva.",
          "Válido apenas se A = C.",
          "Inválido porque faltam indivíduos.",
          "Inconclusivo"
        ],
        "answer": 1,
        "explanation": "A está contido em B, que está contido em C; portanto, A está contido em C.",
        "origin": "autoral"
      },
      {
        "level": "fácil",
        "prompt": "A validade de um argumento depende de:",
        "options": [
          "Conclusão parecer realista.",
          "Autoria das premissas.",
          "Forma que impede premissas V e conclusão F.",
          "Número de pessoas envolvidas.",
          "Todas as premissas serem historicamente verdadeiras."
        ],
        "answer": 2,
        "explanation": "A validade é estrutural e preserva a verdade das premissas para a conclusão.",
        "origin": "autoral"
      },
      {
        "level": "médio",
        "prompt": "De 'Se o alarme toca, a sala é evacuada' e 'A sala não foi evacuada', conclui-se:",
        "options": [
          "O alarme tocou.",
          "O alarme não tocou.",
          "A sala não existe.",
          "O alarme está quebrado.",
          "A evacuação ocorreu."
        ],
        "answer": 1,
        "explanation": "Modus tollens: P → Q e ¬Q implicam ¬P.",
        "origin": "autoral"
      },
      {
        "level": "médio",
        "prompt": "De P → Q e Q, concluir P é:",
        "options": [
          "Modus ponens.",
          "Modus tollens.",
          "Contraposição.",
          "Afirmação do consequente, inválida em geral.",
          "Silogismo disjuntivo."
        ],
        "answer": 3,
        "explanation": "Q pode ocorrer sem P; falta a premissa Q → P.",
        "origin": "autoral"
      },
      {
        "level": "médio",
        "prompt": "As premissas 'P ou Q' e 'não P' levam a:",
        "options": [
          "P",
          "Q",
          "não Q",
          "P e Q",
          "não P e não Q"
        ],
        "answer": 1,
        "explanation": "Silogismo disjuntivo: se pelo menos uma é V e P é F, Q é V.",
        "origin": "autoral"
      },
      {
        "level": "médio",
        "prompt": "Se P → Q e Q → R, qual conclusão necessariamente vale?",
        "options": [
          "R → P",
          "P → R",
          "Q → P",
          "P ∧ R",
          "¬P → ¬R"
        ],
        "answer": 1,
        "explanation": "Encadeamento de duas condicionais produz P → R.",
        "origin": "autoral"
      },
      {
        "level": "difícil",
        "prompt": "Considere: 'Se estudo, reviso'; 'Se reviso, aprendo'; 'Não aprendi'. O que se conclui?",
        "options": [
          "Estudei e revisei.",
          "Não estudei, mas revisei.",
          "Não revisei e não estudei.",
          "Aprendi pelo menos uma vez.",
          "Nada se conclui."
        ],
        "answer": 2,
        "explanation": "Contrapondo a segunda, ¬Aprendo → ¬Reviso. Contrapondo a primeira, ¬Reviso → ¬Estudo.",
        "origin": "autoral"
      },
      {
        "level": "difícil",
        "prompt": "Qual situação constitui contraexemplo para inferência de P → Q e Q para P?",
        "options": [
          "P=V, Q=V",
          "P=V, Q=F",
          "P=F, Q=V",
          "P=F, Q=F",
          "Nenhuma combinação"
        ],
        "answer": 2,
        "explanation": "Se P=F e Q=V, P→Q é V e a segunda premissa Q também; mas a conclusão P é F.",
        "origin": "autoral"
      },
      {
        "level": "difícil",
        "prompt": "Todo A é B. Nenhum B é C. Qual conclusão é obrigatória?",
        "options": [
          "Algum A é C.",
          "Todo C é A.",
          "Nenhum A é C.",
          "Nenhum B é A.",
          "Algum C é B."
        ],
        "answer": 2,
        "explanation": "Como A está dentro de B e B não intercepta C, nenhum A pertence a C.",
        "origin": "autoral"
      }
    ]
  },
  "M05": {
    "theory": [
      {
        "title": "Noções de conjuntos e relações",
        "paragraphs": [
          "Um conjunto é uma coleção definida de elementos. A pertinência indica que um objeto pertence a um conjunto (x ∈ A); a inclusão indica que todos os elementos de A também pertencem a B (A ⊆ B). União A ∪ B reúne integrantes de pelo menos um; interseção A ∩ B contém os comuns; diferença A − B mantém elementos de A fora de B.",
          "O complemento de A depende de um universo U previamente escolhido. O número de elementos da união de dois conjuntos finitos é |A∪B| = |A|+|B|−|A∩B|; subtrai-se a interseção porque teria sido contada duas vezes."
        ],
        "example": "Exemplo resolvido: 18 alunos fazem inglês, 13 fazem francês e 5 fazem ambos. Fazem ao menos um dos idiomas 18+13−5=26."
      },
      {
        "title": "Diagramas de Venn e Euler",
        "paragraphs": [
          "O diagrama de Venn separa regiões possíveis de conjuntos por áreas sobrepostas. Para situações com 'todos', os conjuntos podem estar inteiramente contidos em outros; com 'nenhum', permanecem separados; com 'algum', deve existir pelo menos um elemento em uma interseção.",
          "Não presuma que um conjunto abstrato tem elementos se o problema não afirma existência. Em especial, 'todo A é B' pode ser verdadeiro mesmo quando A é vazio no cálculo lógico usual. A afirmação 'algum A é B' exige existência real de interseção."
        ],
        "example": "Exemplo resolvido: Todo A é B e nenhum B é C. Desenhe A dentro de B e C fora de B; conclui-se que nenhum A é C."
      },
      {
        "title": "Quantificadores categóricos",
        "paragraphs": [
          "As proposições categóricas principais são: 'Todo A é B' (inclusão); 'Nenhum A é B' (interseção vazia); 'Algum A é B' (interseção não vazia); e 'Algum A não é B' (parte de A fora de B). A palavra 'algum' significa ao menos um, e não necessariamente uma minoria.",
          "Em problemas de concurso, a posição de sujeito/predicado importa. 'Todo A é B' não implica 'Todo B é A'. Já 'Nenhum A é B' equivale a 'Nenhum B é A'. Para testar uma conclusão, represente os conjuntos e veja se há configuração compatível em que ela seria falsa."
        ],
        "example": "Exemplo resolvido: se todo magistrado é servidor público (premissa fictícia), não é permitido concluir que todo servidor público é magistrado."
      },
      {
        "title": "Negação de quantificadores",
        "paragraphs": [
          "A negação de 'Todo A é B' é 'Algum A não é B'; a de 'Nenhum A é B' é 'Algum A é B'; a de 'Algum A é B' é 'Nenhum A é B'; a de 'Algum A não é B' é 'Todo A é B'. A negação não transforma automaticamente 'todo' em 'nenhum': bastaria um contraexemplo.",
          "Treine enunciados longos convertendo-os primeiro em categorias simples. 'Não existe candidato que não estudou' equivale a 'Todos os candidatos estudaram'. Duplas negações e o escopo de 'algum' são armadilhas frequentes."
        ],
        "example": "Exemplo resolvido: negar 'Ao menos um processo não é eletrônico' equivale a 'Todos os processos são eletrônicos'."
      },
      {
        "title": "Contagem por regiões",
        "paragraphs": [
          "Preencha diagramas com interseções começando da região mais interna. Em dois conjuntos, use 'apenas A' = |A| − |A∩B|. Se há três conjuntos, lembre-se de acrescentar de volta a interseção tripla no princípio da inclusão-exclusão: |A∪B∪C| = |A|+|B|+|C| − |A∩B|−|A∩C|−|B∩C| + |A∩B∩C|.",
          "Quando o total do universo é informado, a região 'nenhum dos conjuntos' é total menos a união. Não use apenas a soma dos grupos sem retirar duplicidades."
        ],
        "example": "Exemplo resolvido: em turma de 40, 18 gostam de chá, 22 de café e 7 de ambos. Gostam de pelo menos um: 33. De nenhum: 7."
      }
    ],
    "summary": [
      {
        "title": "União",
        "text": "|A∪B| = |A|+|B|−|A∩B|.",
        "bizu": "Tire duplicidade da interseção."
      },
      {
        "title": "Todo A é B",
        "text": "A fica contido em B.",
        "bizu": "Não inverta para 'Todo B é A'."
      },
      {
        "title": "Nenhum A é B",
        "text": "A∩B é vazio.",
        "bizu": "Separação vale nos dois sentidos."
      },
      {
        "title": "Algum A é B",
        "text": "Pelo menos um pertence aos dois.",
        "bizu": "Há elemento existente na interseção."
      },
      {
        "title": "Negação de todo",
        "text": "Não(todo A é B) = algum A não é B.",
        "bizu": "Um contraexemplo basta."
      }
    ],
    "mindmap": [
      {
        "name": "Operações",
        "branches": [
          "união",
          "interseção",
          "diferença"
        ]
      },
      {
        "name": "Proposições",
        "branches": [
          "todo",
          "nenhum",
          "algum",
          "algum não"
        ]
      },
      {
        "name": "Diagramas",
        "branches": [
          "inclusão",
          "separação",
          "interseção"
        ]
      },
      {
        "name": "Contagem",
        "branches": [
          "apenas um",
          "união",
          "universo complementar"
        ]
      }
    ],
    "questions": [
      {
        "level": "fácil",
        "prompt": "Se A tem 12 elementos, B tem 10 e A∩B tem 4, então |A∪B| é:",
        "options": [
          "18",
          "22",
          "26",
          "16",
          "12"
        ],
        "answer": 0,
        "explanation": "12 + 10 − 4 = 18, pois a interseção seria contada duas vezes.",
        "origin": "autoral"
      },
      {
        "level": "fácil",
        "prompt": "'Todo A é B' significa:",
        "options": [
          "B está dentro de A.",
          "A está contido em B.",
          "A e B não se cruzam.",
          "A e B não têm elementos.",
          "Algum B não é A, necessariamente."
        ],
        "answer": 1,
        "explanation": "A ⊆ B: todo elemento de A pertence a B.",
        "origin": "autoral"
      },
      {
        "level": "fácil",
        "prompt": "Qual é a negação de 'Nenhum A é B'?",
        "options": [
          "Todo A é B.",
          "Nenhum B é A.",
          "Algum A é B.",
          "Algum A não é B.",
          "Todo B não é A."
        ],
        "answer": 2,
        "explanation": "É suficiente existir pelo menos um elemento comum.",
        "origin": "autoral"
      },
      {
        "level": "médio",
        "prompt": "Em 30 pessoas, 19 gostam de música, 16 de cinema e 8 de ambos. Quantas gostam de ao menos uma atividade?",
        "options": [
          "19",
          "27",
          "35",
          "43",
          "11"
        ],
        "answer": 1,
        "explanation": "Somam-se as duas frequências e subtrai-se a interseção: 19+16−8=27 pessoas em pelo menos uma atividade.",
        "origin": "autoral"
      },
      {
        "level": "médio",
        "prompt": "'Algum A não é B' exige que:",
        "options": [
          "Todos os A fiquem fora de B.",
          "Exista ao menos um elemento de A fora de B.",
          "Nenhum A pertença a B.",
          "A e B sejam conjuntos iguais.",
          "Algum B esteja fora de A."
        ],
        "answer": 1,
        "explanation": "É afirmação existencial: basta um A que não pertence a B.",
        "origin": "autoral"
      },
      {
        "level": "médio",
        "prompt": "De 'Todo A é B' e 'Nenhum B é C' conclui-se:",
        "options": [
          "Todo C é A.",
          "Algum A é C.",
          "Nenhum A é C.",
          "Algum C é A.",
          "A e C se intersectam."
        ],
        "answer": 2,
        "explanation": "A está dentro de B, que é separado de C; logo A não intercepta C.",
        "origin": "autoral"
      },
      {
        "level": "médio",
        "prompt": "Em turma de 50, 28 preferem A, 21 preferem B e 9 preferem ambos. Quantos não preferem nenhum?",
        "options": [
          "7",
          "9",
          "10",
          "12",
          "19"
        ],
        "answer": 2,
        "explanation": "A união contém 28+21−9=40, então 50−40=10.",
        "origin": "autoral"
      },
      {
        "level": "difícil",
        "prompt": "Se |A|=20, |B|=17 e |A∪B|=30, quantos pertencem somente a A?",
        "options": [
          "3",
          "7",
          "10",
          "13",
          "20"
        ],
        "answer": 3,
        "explanation": "A∩B = 20+17−30=7; somente A =20−7=13.",
        "origin": "autoral"
      },
      {
        "level": "difícil",
        "prompt": "Todo A é B; algum B é C. Qual conclusão é necessária?",
        "options": [
          "Algum A é C.",
          "Nenhum A é C.",
          "Todo C é A.",
          "Não é possível concluir que algum A é C.",
          "Todo B é A."
        ],
        "answer": 3,
        "explanation": "Os B que pertencem a C podem estar fora de A; o diagrama admite as duas possibilidades.",
        "origin": "autoral"
      },
      {
        "level": "difícil",
        "prompt": "Se |A|=15, |B|=16, |C|=13, as três interseções duas a duas têm 4, 3 e 5 elementos, e a interseção tripla tem 2, a união vale:",
        "options": [
          "32",
          "34",
          "36",
          "38",
          "40"
        ],
        "answer": 1,
        "explanation": "Inclusão-exclusão: 15+16+13−4−3−5+2 = 34.",
        "origin": "autoral"
      }
    ]
  }
});
