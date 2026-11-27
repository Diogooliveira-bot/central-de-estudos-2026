/* Conteúdo didático original. */
window.RLM_CURSO_AULAS=Object.assign(window.RLM_CURSO_AULAS||{}, {
  "M06": {
    "theory": [
      {
        "title": "Relações entre entidades",
        "paragraphs": [
          "Questões de associação distribuem características entre pessoas, lugares, objetos, horários ou eventos. O desafio não é decorar fórmulas, mas garantir simultaneamente todas as restrições. Comece listando categorias e membros: pessoas Ana, Bia e Caio; cargos X, Y e Z; dias segunda, terça e quarta.",
          "Quando cada pessoa recebe exatamente um cargo e cada cargo pertence a uma única pessoa, há uma correspondência um a um. Construa uma tabela de possibilidades e risque combinações proibidas; o que sobra pode ser obrigatório. Se o enunciado permitir repetição, não aplique exclusividade não declarada."
        ],
        "example": "Exemplo resolvido: Ana não ocupa X; Bia ocupa X; cargos distintos X, Y e Z. Assim, Ana e Caio devem dividir Y e Z, mas sem outro dado não é possível escolher qual."
      },
      {
        "title": "Tabela de dupla entrada",
        "paragraphs": [
          "Na tabela, coloque uma categoria nas linhas e outra nas colunas. Marque ✓ para relação confirmada e × para impossibilidade. Depois de fixar um ✓ em uma correspondência exclusiva, elimine outras posições na mesma linha e coluna. Essa propagação é o núcleo do método.",
          "Se existem três categorias, use tabelas separadas (pessoa × objeto; pessoa × dia; objeto × dia) ou uma matriz organizada. Cruzar conclusões entre tabelas evita erros de salto lógico. Anote também condições negativas e não só as positivas."
        ],
        "example": "Exemplo resolvido: Lia usa bolsa azul; cada pessoa usa uma cor distinta. Todas as outras pessoas recebem × na coluna azul."
      },
      {
        "title": "Ordenações, posições e restrições",
        "paragraphs": [
          "Enunciados podem dizer 'A vem imediatamente antes de B', 'C não ocupa uma extremidade', 'D fica entre A e B'. Desenhe casas numeradas e transforme essas condições em blocos. 'Imediatamente antes' une duas posições consecutivas; 'antes' permite outras pessoas entre elas.",
          "Use primeiro as restrições mais fortes, especialmente extremidades, adjacências e posições fixas. Se restarem duas soluções possíveis, mantenha ambas até nova informação; uma alternativa correta deve valer em todas as configurações admissíveis."
        ],
        "example": "Exemplo resolvido: em uma fila de três lugares, X está à esquerda de Y e Y à esquerda de Z. A única ordenação é X-Y-Z."
      },
      {
        "title": "Verdade, mentira e condições",
        "paragraphs": [
          "Problemas com pessoas que sempre mentem ou sempre dizem a verdade exigem traduzir cada frase em proposições. Se uma pessoa mente sempre, sua afirmação inteira é falsa — não se deve necessariamente negar cada parcela de uma frase composta. Considere também se a fala de alguém sobre outra pessoa introduz uma condicional.",
          "Teste casos em tabela curta: hipótese 'Ana verdadeira', confira o valor da frase dela e as consequências para as demais. Exclua cenários contraditórios. Questões de 'exatamente uma afirmação é verdadeira' exigem contar afirmações verdadeiras, não pessoas verdadeiras."
        ],
        "example": "Exemplo resolvido: 'Exatamente um entre P e Q ocorreu' é (P ∨ Q) ∧ ¬(P ∧ Q). Se P for verdadeiro, Q deve ser falso."
      },
      {
        "title": "Deduções necessárias e teste das alternativas",
        "paragraphs": [
          "Após preencher as restrições, classifique cada resposta: necessária (ocorre em todas as soluções), possível (ocorre em algumas), impossível (não ocorre em nenhuma). A banca examinadora costuma pedir o que 'necessariamente' se conclui; uma hipótese compatível, embora atraente, não resolve a pergunta.",
          "Para não listar todas as permutações, teste a afirmação contrária à alternativa candidata. Se houver uma configuração que respeita o enunciado e refuta a conclusão, ela não é necessária. Se não houver, você encontrou uma consequência lógica."
        ],
        "example": "Exemplo resolvido: A pode estar em 1º ou 2º em soluções distintas. Portanto, 'A está em 1º' é possível, mas não é conclusão necessária."
      }
    ],
    "summary": [
      {
        "title": "Modelagem",
        "text": "Identifique conjuntos e se a correspondência é exclusiva.",
        "bizu": "Não pressuponha exclusividade ausente."
      },
      {
        "title": "Tabela",
        "text": "✓ confirma e × elimina combinações.",
        "bizu": "Ao marcar ✓, propague exclusões na linha e coluna apenas quando houver exclusividade."
      },
      {
        "title": "Ordem",
        "text": "'Imediatamente antes' forma bloco; 'antes' só define precedência.",
        "bizu": "Numere casas e teste extremidades."
      },
      {
        "title": "Verdade/mentira",
        "text": "Fala de mentiroso é falsa como proposição inteira.",
        "bizu": "Negar P e Q gera não P ou não Q."
      },
      {
        "title": "Necessário x possível",
        "text": "Necessário vale em toda solução.",
        "bizu": "Uma configuração contrária derruba a necessidade."
      }
    ],
    "mindmap": [
      {
        "name": "Entidades",
        "branches": [
          "pessoas",
          "objetos",
          "lugares",
          "tempos"
        ]
      },
      {
        "name": "Restrições",
        "branches": [
          "exclusividade",
          "proibição",
          "adjacência",
          "ordem"
        ]
      },
      {
        "name": "Ferramentas",
        "branches": [
          "tabelas",
          "casas numeradas",
          "hipóteses"
        ]
      },
      {
        "name": "Conclusões",
        "branches": [
          "possível",
          "necessária",
          "impossível"
        ]
      }
    ]
  },
  "M07": {
    "theory": [
      {
        "title": "Raciocínio verbal como estrutura lógica",
        "paragraphs": [
          "Raciocínio verbal exige reconhecer relações precisas entre termos, afirmações e categorias. Uma analogia como 'juiz : julgamento :: professor : aula' relaciona profissão e atividade, não proximidade fonética ou opinião pessoal. É preciso identificar a regra que conecta o primeiro par e testá-la no segundo.",
          "Distinga implicação formal de associação de ideias. O fato de duas palavras aparecerem juntas não autoriza conclusão causal. Em provas, condições e restrições expressas são mais importantes do que o conhecimento de mundo presumido sobre personagens fictícios."
        ],
        "example": "Exemplo resolvido: 'termômetro : temperatura :: relógio : tempo' usa a relação instrumento–grandeza medida."
      },
      {
        "title": "Formação de conceitos e critérios",
        "paragraphs": [
          "Formar um conceito é agrupar objetos pela propriedade definida como critério. Se a classe contém triângulos, quadrados e pentágonos, 'polígonos' é um conceito possível. Já agrupar por cor pode gerar partições diferentes; o enunciado deve fornecer ou permitir inferir a regra.",
          "Procure atributos essenciais, não coincidências superficiais. Uma categoria pode ser definida por forma, função, relação numérica, ordem alfabética, quantidade de elementos ou combinação explícita dessas propriedades. Teste o critério em todos os membros, não apenas em dois."
        ],
        "example": "Exemplo resolvido: 4, 9, 16 e 25 são quadrados perfeitos positivos; 20 não é."
      },
      {
        "title": "Discriminação de elementos",
        "paragraphs": [
          "Questões de elemento discrepante apresentam itens semelhantes em uma dimensão e um distinto. Em '2, 3, 5, 7, 9', somente 9 não é primo. Contudo, grupos sem critério suficientemente especificado podem admitir regras alternativas; uma boa solução prioriza a regra mais simples que cobre todos os elementos de forma inequívoca.",
          "Faça uma tabela mental de atributos: paridade, divisibilidade, número de letras, papel semântico, classe gramatical ou relação funcional. Ao detectar um padrão, procure um contraexemplo entre os próprios itens."
        ],
        "example": "Exemplo resolvido: entre quadrado, retângulo, losango e triângulo, somente o triângulo não é quadrilátero."
      },
      {
        "title": "Analogias e relações de ordem",
        "paragraphs": [
          "Analogia proporcional compara relações, não identidades. A relação 'parte de' difere de 'produz' e de 'instrumento de'. Em contexto verbal, sinônimos e antônimos podem aparecer, mas a lógica exigirá reconhecer qual vínculo é estável: oposto, causa, sequência, tipo de ou elemento de.",
          "Evite substituir uma relação assimétrica por outra simétrica. 'Todo piano é instrumento musical' não é o mesmo que 'Todo instrumento musical é piano'. Em classificações, 'pertencer a uma classe' e 'a classe conter o indivíduo' descrevem direções inversas."
        ],
        "example": "Exemplo resolvido: 'página : livro :: capítulo : livro' ilustra partes de um todo, mas página e capítulo são partes de naturezas diferentes; prefira pares com a mesma relação."
      },
      {
        "title": "Conceitos com condições combinadas",
        "paragraphs": [
          "Um enunciado pode definir um objeto por vários atributos: 'inteiro positivo que é par, múltiplo de 3 e menor que 20'. Fixe primeiro o universo dos inteiros positivos. Ser par e múltiplo de 3 equivale a ser múltiplo de 6; menores que 20, restam 6, 12 e 18. Sem a restrição de positividade, zero e inteiros negativos também poderiam satisfazer as condições.",
          "Em exercícios de concursos, o principal risco é generalizar indevidamente. A prova permite usar exatamente as regras explícitas ou demonstravelmente inferidas. Se vários objetos satisfazem as condições, informe que a escolha não é única em vez de inventar um dado ausente."
        ],
        "example": "Exemplo resolvido: inteiros positivos pares e múltiplos de 5 menores que 25 são 10 e 20; um único elemento não pode ser inferido."
      }
    ],
    "summary": [
      {
        "title": "Analogia",
        "text": "Descubra a relação entre A e B antes de comparar C e D.",
        "bizu": "Relação, não semelhança visual."
      },
      {
        "title": "Conceito",
        "text": "A regra classifica todos os membros sem exceções.",
        "bizu": "Teste a hipótese no grupo inteiro."
      },
      {
        "title": "Exclusão",
        "text": "O discrepante falha no critério comum.",
        "bizu": "Evite regras criativas que explicam apenas parte dos dados."
      },
      {
        "title": "Condições",
        "text": "Critérios simultâneos funcionam como interseção.",
        "bizu": "Liste por requisito mais restritivo."
      },
      {
        "title": "Necessidade",
        "text": "Conclusão verdadeira em apenas alguns casos não é necessária.",
        "bizu": "Aparecimento frequente não é prova."
      }
    ],
    "mindmap": [
      {
        "name": "Analogia",
        "branches": [
          "parte–todo",
          "instrumento–medida",
          "categoria–exemplo"
        ]
      },
      {
        "name": "Formação",
        "branches": [
          "propriedade",
          "regra",
          "classificação"
        ]
      },
      {
        "name": "Discriminação",
        "branches": [
          "padrão comum",
          "elemento distinto",
          "contraexemplo"
        ]
      },
      {
        "name": "Inferência",
        "branches": [
          "condições",
          "interseção",
          "necessidade"
        ]
      }
    ]
  },
  "M08": {
    "theory": [
      {
        "title": "Identificação de padrões em sequências",
        "paragraphs": [
          "Uma sequência é uma lista ordenada de elementos produzidos por alguma regra. O mesmo conjunto numérico pode gerar sequências diferentes dependendo da ordem. Em concursos, procure primeiro diferenças consecutivas (progressão aritmética), depois razões multiplicativas (progressão geométrica), operações alternadas e relações entre termos distantes.",
          "Anote índices (posição 1, 2, 3...) para não confundir valor do termo com posição. Uma regra deve explicar todos os termos observados. Um trecho finito pode admitir diferentes regras de continuação: confira o critério informado ou sustentado pelo contexto e pelas alternativas. Reconhecer um padrão plausível não demonstra que ele seja a única continuação matematicamente possível."
        ],
        "example": "Exemplo resolvido: seguindo o critério de somar 3 a cada termo, 4, 7, 10, 13, ... continua com 13+3=16. A conclusão depende desse critério de formação."
      },
      {
        "title": "Diferenças e multiplicações",
        "paragraphs": [
          "Progressão aritmética (PA) tem diferença constante r: a_n = a_1 + (n−1)r. Progressão geométrica (PG) tem razão constante q: a_n = a_1·q^(n−1). Nem todo padrão é PA ou PG; a sequência 2, 5, 10, 17, ... tem diferenças 3, 5, 7 e próxima diferença 9.",
          "Quando diferenças não são constantes, calcule as diferenças das diferenças. Padrões de quadrados (1,4,9,16...), cubos (1,8,27...), fatoriais (1,2,6,24...) e números primos podem ser úteis, mas não devem ser presumidos sem evidência."
        ],
        "example": "Exemplo resolvido: 1, 4, 9, 16, 25 são quadrados de 1 a 5. O sexto termo é 36."
      },
      {
        "title": "Alternância e intercalamento",
        "paragraphs": [
          "Em uma sequência como 2, 10, 4, 20, 6, 30, ..., os termos de índices ímpares seguem 2,4,6,...; os de índices pares, 10,20,30,... Tratar tudo como uma progressão única produz respostas erradas.",
          "Separe posições 1,3,5... e 2,4,6..., teste transformações por etapas (+2, ×3, −1...), e confira a continuação. Se houver elementos de três em três, o ciclo pode ter três subsequências."
        ],
        "example": "Exemplo resolvido: 2, 10, 4, 20, 6, 30, 8, ...; a próxima posição par é 40."
      },
      {
        "title": "Sequências alfabéticas e ciclos",
        "paragraphs": [
          "Para letras, associe posições no alfabeto A=1, B=2, ..., Z=26 (considerando 26 letras) e identifique saltos. Evite supor letras acentuadas como posições extras sem determinação. Em uma sequência que se repete a cada k elementos, a posição n depende do resto de n pela divisão por k.",
          "Para achar o 101º elemento de um padrão de quatro símbolos A, B, C, D, calcule 101 dividido por 4: resto 1, logo o 101º corresponde ao primeiro símbolo. Resto zero corresponde ao último símbolo do ciclo."
        ],
        "example": "Exemplo resolvido: A, C, E, G, ... corresponde a posições 1,3,5,7 e segue I."
      },
      {
        "title": "Sequências figurais e matrizes",
        "paragraphs": [
          "Figuras podem variar por número de pontos, rotação, posição, cor ou sobreposição. Descreva a transformação de cada etapa: 'gira 90° no sentido horário', 'acrescenta dois traços', 'inverte a cor'. A figura ausente deve obedecer a todas as dimensões observáveis, não só a uma.",
          "Matrizes de figuras exigem testar regras por linha e coluna, como soma, subtração, simetria ou alternância. Não confunda contar unidades com comparar áreas visuais, especialmente quando símbolos mudam de tamanho."
        ],
        "example": "Exemplo resolvido: uma seta aponta norte, leste, sul, oeste em passos de 90° à direita; o próximo aponta norte."
      }
    ],
    "summary": [
      {
        "title": "Diferenças",
        "text": "Verifique a(n+1)−a(n) antes de buscar fórmulas.",
        "bizu": "PA: a_n = a_1 + (n−1)r."
      },
      {
        "title": "Razões",
        "text": "Teste multiplicação/divisão por fator constante.",
        "bizu": "PG: a_n = a_1·q^(n−1)."
      },
      {
        "title": "Alternância",
        "text": "Separe termos de índice par e ímpar.",
        "bizu": "Duas sequências podem estar intercaladas."
      },
      {
        "title": "Ciclos",
        "text": "Resto da divisão de n por k localiza a posição.",
        "bizu": "Resto zero indica fim do ciclo."
      },
      {
        "title": "Figuras",
        "text": "Descreva deslocamento, rotação, contagem ou cor.",
        "bizu": "Uma transformação precisa explicar todos os passos."
      }
    ],
    "mindmap": [
      {
        "name": "Numéricas",
        "branches": [
          "diferenças",
          "razões",
          "potências"
        ]
      },
      {
        "name": "Intercaladas",
        "branches": [
          "índices pares",
          "índices ímpares"
        ]
      },
      {
        "name": "Cíclicas",
        "branches": [
          "período",
          "resto da divisão"
        ]
      },
      {
        "name": "Figurais",
        "branches": [
          "rotação",
          "simetria",
          "quantidade"
        ]
      }
    ]
  },
  "M09": {
    "theory": [
      {
        "title": "Referenciais e direções cardeais",
        "paragraphs": [
          "Orientação espacial só faz sentido com um referencial: norte, sul, leste e oeste. Em um mapa convencional, norte aponta para cima e leste para a direita, mas a pessoa pode estar voltada para qualquer direção. 'Virar à direita' é uma rotação relativa à orientação atual, não significa necessariamente deslocar-se para leste.",
          "Comece desenhando rosa dos ventos e marcando um vetor de orientação. Cada mudança de direção altera o vetor atual, e somente depois se determina o deslocamento seguinte. Não confunda virar 90° com andar certa distância."
        ],
        "example": "Exemplo resolvido: voltado para norte, gire 90° à direita: leste. Depois 90° à esquerda: volta para norte."
      },
      {
        "title": "Deslocamentos no plano",
        "paragraphs": [
          "Em trajetos ortogonais, separe componentes horizontal e vertical. Andar 3 unidades a leste e 2 a oeste resulta em 1 unidade a leste; andar 4 ao norte e 1 ao sul resulta em 3 ao norte. A distância percorrida é soma dos trechos; o deslocamento é diferença entre posições inicial e final.",
          "Se a questão pedir menor distância em linha reta, o teorema de Pitágoras pode ser necessário: para componentes perpendiculares x e y, d = √(x²+y²). Não confunda com distância percorrida no trajeto das ruas."
        ],
        "example": "Exemplo resolvido: 3 km a leste e 4 km ao norte resultam em deslocamento em linha reta de 5 km, mas distância efetivamente percorrida de 7 km."
      },
      {
        "title": "Posição relativa e espelhamentos",
        "paragraphs": [
          "Em filas e mapas, 'à esquerda de A' pode mudar conforme o ponto de vista adotado. Quando a pessoa olha para o sul, seu lado esquerdo aponta para leste. Em desenhos de espelho, a imagem inverte frente/trás relativamente ao plano do espelho, não necessariamente uma rotação simples da figura.",
          "Use setas e rótulos dos eixos em vez de descrições vagas. Para sequências de rotação, 360° retorna à posição inicial e quatro giros de 90° formam um ciclo completo."
        ],
        "example": "Exemplo resolvido: uma pessoa voltada ao sul tem leste à esquerda e oeste à direita."
      },
      {
        "title": "Dias da semana e aritmética modular",
        "paragraphs": [
          "A semana repete-se de 7 em 7 dias. Para descobrir o dia após N dias, use N mod 7: se hoje é terça e transcorrem 17 dias, resto 3; três dias depois é sexta. Para dias anteriores, retroceda conforme o mesmo resto.",
          "A pergunta 'daqui a 7 dias' aponta para o mesmo dia da semana, mas 'contando hoje como dia 1' altera a contagem inclusiva. Leia se a contagem é de intervalos transcorridos ou de posições enumeradas."
        ],
        "example": "Exemplo resolvido: 100 dias após uma segunda-feira corresponde a 100 mod 7 = 2 dias depois, isto é, quarta-feira."
      },
      {
        "title": "Horas, intervalos e linha do tempo",
        "paragraphs": [
          "Converta horários em minutos para somar ou subtrair intervalos: 2h35 =155 minutos. Ao passar de 23h59 para 0h00, o dia muda; quando a questão envolve turnos ou compromissos em dias diferentes, trace linha do tempo e marque cada mudança de data.",
          "Se um evento começa às 9h45 e dura 2h30, termina às 12h15. A palavra 'antes' ou 'depois' pode referir-se a ordem temporal, não necessariamente intervalo exato; adote somente as informações fornecidas."
        ],
        "example": "Exemplo resolvido: das 22h40 até 1h10 do dia seguinte decorrem 2h30, ou 150 minutos."
      }
    ],
    "summary": [
      {
        "title": "Rosa dos ventos",
        "text": "N em cima, L à direita, S embaixo, O à esquerda.",
        "bizu": "Direita e esquerda são relativas ao observador."
      },
      {
        "title": "Deslocamento",
        "text": "Some movimentos por eixo; diferencie trajeto de posição final.",
        "bizu": "Pitágoras só se pedirem linha reta."
      },
      {
        "title": "Giros",
        "text": "Quatro giros de 90° equivalem a uma volta.",
        "bizu": "Controle orientação atual após cada rotação."
      },
      {
        "title": "Calendários",
        "text": "Resto mod 7 representa avanço semanal.",
        "bizu": "Sete dias depois = mesmo dia."
      },
      {
        "title": "Horários",
        "text": "Converta tudo para minutos e organize linha do tempo.",
        "bizu": "Contagem inclusiva exige cuidado."
      }
    ],
    "mindmap": [
      {
        "name": "Orientação",
        "branches": [
          "norte/sul",
          "leste/oeste",
          "direita/esquerda"
        ]
      },
      {
        "name": "Trajetos",
        "branches": [
          "eixos",
          "distância percorrida",
          "deslocamento"
        ]
      },
      {
        "name": "Calendário",
        "branches": [
          "período de 7 dias",
          "resto da divisão"
        ]
      },
      {
        "name": "Tempo",
        "branches": [
          "intervalos",
          "virada de dia",
          "linha do tempo"
        ]
      }
    ]
  }
});
