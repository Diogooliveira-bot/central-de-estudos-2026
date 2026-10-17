/* Estatística descritiva TJCE 2026, exercícios autorais, não questões oficiais FCC. */
window.RLM_CURSO_AULAS=Object.assign(window.RLM_CURSO_AULAS||{}, {
  "M13": {
    "theory": [
      {
        "title": "Leitura de tabelas e identificação de variáveis",
        "paragraphs": [
          "Uma tabela estatística apresenta dados organizados por linhas e colunas. O título descreve o fenômeno; os cabeçalhos indicam categorias, intervalos, datas e unidades. Antes de efetuar operações, identifique se cada valor é uma contagem (frequência), uma proporção, uma média ou uma taxa.",
          "Variável qualitativa descreve categorias (setor, tipo de atendimento), enquanto variável quantitativa registra número (idade, tempo de espera). Quantitativa discreta costuma vir de contagens; contínua, de mensurações em intervalos. O gráfico correto depende do tipo de dado e da comparação desejada."
        ],
        "example": "Exemplo resolvido: tabela A=18 atendimentos, B=12; total 30. A frequência relativa de A é 18/30=60%."
      },
      {
        "title": "Frequências e distribuições",
        "paragraphs": [
          "Frequência absoluta é a contagem de ocorrências de uma categoria ou intervalo. Frequência relativa divide a absoluta pelo total de observações e pode ser apresentada em porcentagem. A soma de todas as frequências absolutas deve ser o tamanho da amostra; a soma das relativas deve ser 1 (ou 100%), salvo arredondamentos.",
          "Frequência acumulada soma as contagens até determinada classe em uma ordenação. Em dados agrupados, a definição dos limites de cada intervalo deve impedir que uma observação seja contada duas vezes; intervalos como [10,20) incluem 10, mas excluem 20."
        ],
        "example": "Exemplo resolvido: classes com frequências 4, 6 e 10 têm acumuladas 4, 10 e 20; a última coincide com o total."
      },
      {
        "title": "Gráficos de barras, setores e linhas",
        "paragraphs": [
          "Gráficos de barras comparam categorias; o de linhas enfatiza evolução ao longo de uma variável ordenada, comumente tempo; o de setores mostra composição de um todo. Em gráfico de setores, o ângulo da fatia é frequência relativa ×360°; 25% equivale a 90°.",
          "Ao interpretar barras, confira se eixo vertical começa em zero. Um eixo truncado pode exagerar visualmente pequenas diferenças. Em linhas, distinga mudança absoluta de percentual e observe se os intervalos no eixo horizontal têm o mesmo tamanho."
        ],
        "example": "Exemplo resolvido: setor que corresponde a 40% de um total ocupa 0,40×360°=144°."
      },
      {
        "title": "Histograma e infográficos",
        "paragraphs": [
          "Histograma representa distribuição de variável quantitativa por intervalos. As barras são contíguas quando os intervalos se sucedem sem lacunas; barras de categorias nominais normalmente ficam separadas. Com classes de mesma largura, alturas podem refletir frequências; com larguras diferentes, a área da barra deve representar a frequência, exigindo densidade de frequência na altura.",
          "Infográficos combinam elementos visuais e texto. Leia unidade, legenda, universo da pesquisa, período e escala antes de concluir. Figuras decorativas não são provas de proporção; somente valores ou escalas explicitadas justificam comparações numéricas."
        ],
        "example": "Exemplo resolvido: classes de igual largura com frequências 5, 9 e 6 possuem total de 20 observações; a classe central concentra 45%."
      },
      {
        "title": "Inferência responsável a partir de gráficos",
        "paragraphs": [
          "Um gráfico descritivo permite constatar padrões dentro dos dados exibidos, mas não estabelece automaticamente causalidade nem generalização populacional. Aumento simultâneo de duas séries pode refletir uma terceira variável. A interpretação deve se limitar a comparações sustentadas pelo universo e período pesquisados.",
          "No concurso, pergunte: 'a alternativa afirma mais do que o gráfico oferece?'. Se o gráfico contém valores somente para janeiro e fevereiro, não conclua tendência anual. Se mostra percentuais, não conclua volume absoluto sem conhecer o total."
        ],
        "example": "Exemplo resolvido: 60% de 20 respostas são 12, enquanto 50% de 100 são 50; o maior percentual não implica maior quantidade absoluta."
      }
    ],
    "summary": [
      {
        "title": "Frequência relativa",
        "text": "f_rel = f_abs/n; percentual =100×f_rel.",
        "bizu": "Somatório relativo =100% com possível arredondamento."
      },
      {
        "title": "Gráfico de setores",
        "text": "Ângulo =360°×proporção.",
        "bizu": "25%=90°, 50%=180°."
      },
      {
        "title": "Histograma",
        "text": "Intervalos de variável quantitativa; barras contíguas.",
        "bizu": "Larguras diferentes exigem atenção à área."
      },
      {
        "title": "Gráficos e escalas",
        "text": "Leia legenda, período, unidade e eixo.",
        "bizu": "Eixo truncado pode enganar."
      },
      {
        "title": "Interpretação",
        "text": "Distingua contagem, percentual e tendência.",
        "bizu": "Correlação visual não demonstra causa."
      }
    ],
    "mindmap": [
      {
        "name": "Tabelas",
        "branches": [
          "categorias",
          "unidades",
          "totais"
        ]
      },
      {
        "name": "Frequências",
        "branches": [
          "absoluta",
          "relativa",
          "acumulada"
        ]
      },
      {
        "name": "Gráficos",
        "branches": [
          "barras",
          "setores",
          "linhas",
          "histograma"
        ]
      },
      {
        "name": "Crítica",
        "branches": [
          "escala",
          "percentual x volume",
          "causalidade"
        ]
      }
    ],
    "questions": [
      {
        "level": "fácil",
        "prompt": "Em tabela com 40 respostas, uma categoria recebeu 10. A frequência relativa é:",
        "options": [
          "10%",
          "20%",
          "25%",
          "30%",
          "40%"
        ],
        "answer": 2,
        "explanation": "10/40=0,25, equivalente a 25%.",
        "origin": "autoral"
      },
      {
        "level": "fácil",
        "prompt": "Em gráfico de setores, a fatia de 50% corresponde a:",
        "options": [
          "45°",
          "90°",
          "120°",
          "180°",
          "270°"
        ],
        "answer": 3,
        "explanation": "Metade de 360° equivale a 180°.",
        "origin": "autoral"
      },
      {
        "level": "fácil",
        "prompt": "Qual gráfico é especialmente adequado para frequências de valores quantitativos agrupados em intervalos?",
        "options": [
          "Histograma",
          "Fluxograma",
          "Organograma",
          "Mapa rodoviário",
          "Cronograma"
        ],
        "answer": 0,
        "explanation": "O histograma representa distribuição quantitativa por classes intervalares.",
        "origin": "autoral"
      },
      {
        "level": "médio",
        "prompt": "Em tabela com frequências 3, 7 e 10, qual a frequência acumulada até a segunda classe?",
        "options": [
          "3",
          "7",
          "10",
          "17",
          "20"
        ],
        "answer": 2,
        "explanation": "A acumulada até a segunda classe é 3+7=10.",
        "origin": "autoral"
      },
      {
        "level": "médio",
        "prompt": "Em 60 atendimentos, 18 foram do setor A. Qual percentual representa A?",
        "options": [
          "20%",
          "25%",
          "30%",
          "35%",
          "40%"
        ],
        "answer": 2,
        "explanation": "18/60=0,30, portanto 30%.",
        "origin": "autoral"
      },
      {
        "level": "médio",
        "prompt": "Um setor de gráfico circular ocupa 72°. Que porcentagem representa?",
        "options": [
          "10%",
          "15%",
          "20%",
          "25%",
          "30%"
        ],
        "answer": 2,
        "explanation": "O gráfico inteiro tem 360°. A classe ocupa 72°, então a proporção é 72/360=0,20, equivalente a 20%.",
        "origin": "autoral"
      },
      {
        "level": "médio",
        "prompt": "Qual afirmação é correta sobre gráfico de barras com eixo vertical iniciado acima de zero?",
        "options": [
          "Impede qualquer interpretação.",
          "Pode ampliar a percepção visual de pequenas diferenças.",
          "Não altera a aparência relativa das barras.",
          "Prova erro estatístico em todos os casos.",
          "É sempre um histograma."
        ],
        "answer": 1,
        "explanation": "O truncamento do eixo pode exagerar diferenças visuais; os valores e a escala devem ser lidos.",
        "origin": "autoral"
      },
      {
        "level": "difícil",
        "prompt": "Três categorias têm frequências absolutas 12, 18 e 30. Qual a frequência relativa conjunta das duas primeiras?",
        "options": [
          "30%",
          "40%",
          "45%",
          "50%",
          "60%"
        ],
        "answer": 3,
        "explanation": "Total 60; duas primeiras somam 30. Proporção 30/60=50%.",
        "origin": "autoral"
      },
      {
        "level": "difícil",
        "prompt": "Uma classe de histograma tem largura 4 e frequência 20; outra tem largura 10 e frequência 30. Se a área representa frequência, a razão das alturas da primeira para a segunda é:",
        "options": [
          "1:1",
          "3:2",
          "5:3",
          "2:5",
          "5:2"
        ],
        "answer": 2,
        "explanation": "Alturas são densidades 20/4=5 e 30/10=3. Razão 5:3.",
        "origin": "autoral"
      },
      {
        "level": "difícil",
        "prompt": "Um infográfico mostra 70% de 10 casos na cidade A e 50% de 40 na B. Qual cidade tem mais ocorrências da categoria?",
        "options": [
          "A, porque 70% > 50%.",
          "A, pois 7 > 20.",
          "B, pois 20 > 7.",
          "Igual número.",
          "Impossível comparar mesmo com totais."
        ],
        "answer": 2,
        "explanation": "A: 7 casos; B: 20 casos. O maior percentual pertence à cidade com menor número absoluto.",
        "origin": "autoral"
      }
    ]
  },
  "M14": {
    "theory": [
      {
        "title": "Média aritmética simples",
        "paragraphs": [
          "Média aritmética simples é a soma dos valores dividida pela quantidade de observações: média = (x1+...+xn)/n. Ela fornece uma medida de posição central que utiliza todos os valores. Não confunda média com valor mais frequente nem com o valor central após ordenação.",
          "A soma dos desvios em relação à média é zero: Σ(xi−média)=0. Esse resultado permite descobrir valores ausentes em tabelas. A média é afetada por observações muito distantes do centro, chamadas valores extremos."
        ],
        "example": "Exemplo resolvido: 5, 6, 7 e 10 têm média 28/4=7."
      },
      {
        "title": "Média ponderada",
        "paragraphs": [
          "A média ponderada atribui pesos às observações: Σ(xi·wi)/Σwi. Os pesos podem representar créditos de disciplinas, frequências em tabelas ou proporções da população. Não divida apenas pelo número de valores distintos; divida pela soma dos pesos.",
          "Se as categorias têm frequências 2, 3 e 1 para valores 4, 6 e 10, a média é (4×2+6×3+10×1)/(2+3+1)=36/6=6. No caso de médias de grupos, a média global deve ponderar pelos tamanhos dos grupos, não tirar média simples de médias se os grupos têm volumes diferentes."
        ],
        "example": "Exemplo resolvido: uma prova vale peso 2 com nota 7 e outra peso 3 com nota 9. Média = (14+27)/5=8,2."
      },
      {
        "title": "Mediana em conjuntos de dados",
        "paragraphs": [
          "Mediana é o valor central quando os dados estão ordenados. Com quantidade ímpar n, ocupa posição (n+1)/2; com quantidade par, é a média dos valores nas posições n/2 e n/2+1. Ordenar é etapa obrigatória, especialmente quando a tabela apresenta dados fora de sequência.",
          "Por depender da posição e não diretamente da magnitude de todos os termos, a mediana costuma ser mais robusta que a média contra valores extremos. Em distribuição de frequências, a mediana é identificada pelas posições acumuladas."
        ],
        "example": "Exemplo resolvido: dados 9, 2, 5, 8 ordenam-se 2, 5, 8, 9; mediana = (5+8)/2=6,5."
      },
      {
        "title": "Moda e interpretação conjunta",
        "paragraphs": [
          "Moda é o valor ou categoria de maior frequência. Uma distribuição é unimodal quando tem uma moda; bimodal quando dois valores se destacam empatados na maior frequência; e multimodal quando há várias modas. Pela convenção introdutória adotada neste curso, quando nenhum valor se repete, a distribuição é amodal. Ter duas ou mais modas não significa ausência de moda.",
          "Média, mediana e moda respondem a perguntas diferentes. Em salários com alguns valores extremos muito altos, a mediana pode representar melhor a observação central. A moda identifica o valor mais comum, útil também para variáveis qualitativas, para as quais média não faz sentido."
        ],
        "example": "Exemplo resolvido: 2, 2, 3, 4, 4 tem duas modas, 2 e 4, cada uma com frequência 2; portanto, é bimodal. A mediana é 3 e a média é 3. Já 1, 2, 3, 4 é amodal pela convenção adotada, pois nenhum valor se repete."
      },
      {
        "title": "Tendência central em tabelas",
        "paragraphs": [
          "Ao calcular média de tabela de frequência, faça a soma valor × frequência dividida pelo total. Para mediana, monte a frequência acumulada e encontre as posições centrais. Para moda, localize o maior número de ocorrências. A soma das frequências precisa bater com n informado.",
          "Não confunda classe modal de dados agrupados (intervalo mais frequente) com moda exata de dados brutos. Quando apenas intervalos são fornecidos, a média e a mediana exatas podem não ser recuperáveis sem hipóteses; o exercício pode pedir aproximações."
        ],
        "example": "Exemplo resolvido: valores 1, 2 e 3 com frequências 2, 3 e 1 têm média (2+6+3)/6=11/6, mediana 2 e moda 2."
      }
    ],
    "summary": [
      {
        "title": "Média simples",
        "text": "Soma ÷ número de observações.",
        "bizu": "Utiliza todos os valores e é sensível a extremos."
      },
      {
        "title": "Média ponderada",
        "text": "Σ(valor×peso) / Σpesos.",
        "bizu": "Peso pode ser frequência."
      },
      {
        "title": "Mediana",
        "text": "Ordene os dados; encontre a(s) posição(ões) central(is).",
        "bizu": "Para n par, faça a média dos dois centrais."
      },
      {
        "title": "Moda",
        "text": "Valor ou categoria de maior frequência, não a frequência em si.",
        "bizu": "Duas modas: bimodal. Nenhum valor repetido: amodal, pela convenção do curso."
      },
      {
        "title": "Conferência",
        "text": "Σ(x−média)=0.",
        "bizu": "Médias de grupos exigem pesos pelos tamanhos."
      }
    ],
    "mindmap": [
      {
        "name": "Média",
        "branches": [
          "simples",
          "ponderada",
          "valores extremos"
        ]
      },
      {
        "name": "Mediana",
        "branches": [
          "ordenar",
          "n par",
          "n ímpar"
        ]
      },
      {
        "name": "Moda",
        "branches": [
          "valor de maior frequência",
          "bimodal: duas modas",
          "amodal: nenhum valor repetido (convenção do curso)"
        ]
      },
      {
        "name": "Tabelas",
        "branches": [
          "valor×frequência",
          "acumulada",
          "grupo"
        ]
      }
    ],
    "questions": [
      {
        "level": "fácil",
        "prompt": "A média de 4, 6 e 8 é:",
        "options": [
          "4",
          "5",
          "6",
          "7",
          "8"
        ],
        "answer": 2,
        "explanation": "Somando os valores 4, 6 e 8 encontramos 18; dividindo pelo total de três observações, a média é 6.",
        "origin": "autoral"
      },
      {
        "level": "fácil",
        "prompt": "Qual é a mediana de 7, 2 e 5?",
        "options": [
          "2",
          "3",
          "5",
          "6",
          "7"
        ],
        "answer": 2,
        "explanation": "Ordenando 2, 5, 7, o termo central é 5.",
        "origin": "autoral"
      },
      {
        "level": "fácil",
        "prompt": "A moda de 1, 2, 2, 3, 4 é:",
        "options": [
          "1",
          "2",
          "2,4",
          "3",
          "4"
        ],
        "answer": 1,
        "explanation": "2 aparece duas vezes, mais que os demais.",
        "origin": "autoral"
      },
      {
        "level": "médio",
        "prompt": "A média ponderada das notas 6 (peso 2) e 9 (peso 1) é:",
        "options": [
          "6",
          "7",
          "7,5",
          "8",
          "9"
        ],
        "answer": 1,
        "explanation": "(6×2+9×1)/(2+1)=21/3=7.",
        "origin": "autoral"
      },
      {
        "level": "médio",
        "prompt": "A mediana de 3, 7, 9, 11 é:",
        "options": [
          "7",
          "8",
          "9",
          "9,5",
          "10"
        ],
        "answer": 1,
        "explanation": "Ordenado: duas posições centrais 7 e 9; média =8.",
        "origin": "autoral"
      },
      {
        "level": "médio",
        "prompt": "Cinco valores têm média 8. Qual é sua soma?",
        "options": [
          "8",
          "16",
          "32",
          "40",
          "48"
        ],
        "answer": 3,
        "explanation": "A soma é média×n =8×5=40.",
        "origin": "autoral"
      },
      {
        "level": "médio",
        "prompt": "Em dados 2, 2, 3, 4, 4, a moda é:",
        "options": [
          "2 apenas",
          "4 apenas",
          "3 apenas",
          "2 e 4",
          "Não há moda"
        ],
        "answer": 3,
        "explanation": "2 e 4 aparecem duas vezes cada e são as frequências máximas.",
        "origin": "autoral"
      },
      {
        "level": "difícil",
        "prompt": "Uma turma de 10 alunos tem média 7 e outra de 30 tem média 9. A média conjunta é:",
        "options": [
          "7,5",
          "8",
          "8,25",
          "8,5",
          "9"
        ],
        "answer": 3,
        "explanation": "(10×7+30×9)/40 =340/40=8,5.",
        "origin": "autoral"
      },
      {
        "level": "difícil",
        "prompt": "Os dados 1, 2, 3, 4 e x têm média 4. Quanto vale x?",
        "options": [
          "6",
          "7",
          "8",
          "9",
          "10"
        ],
        "answer": 4,
        "explanation": "Soma necessária 5×4=20. Quatro termos somam 10; x=10.",
        "origin": "autoral"
      },
      {
        "level": "difícil",
        "prompt": "Um conjunto tem cinco observações 1, 2, 2, 8, 17. Quais são média, mediana e moda, respectivamente?",
        "options": [
          "6, 2 e 2",
          "6, 6 e 2",
          "2, 6 e 2",
          "6, 8 e 2",
          "5, 2 e 8"
        ],
        "answer": 0,
        "explanation": "Soma 30 → média 6. Terceiro termo é 2 → mediana 2. O mais frequente é 2.",
        "origin": "autoral"
      }
    ]
  },
  "M15": {
    "theory": [
      {
        "title": "Dispersão e centralidade",
        "paragraphs": [
          "Duas amostras podem ter a mesma média e apresentar comportamentos muito diferentes. Dados 5,5,5 têm média 5 e dispersão zero; dados 1,5,9 também têm média 5, mas valores mais afastados. Medidas de dispersão quantificam espalhamento, permitindo comparar estabilidade e variabilidade.",
          "Dispersão não substitui tendência central. É recomendável interpretar uma média acompanhada de alguma medida de variabilidade. Valores extremos podem afetar bastante medidas quadráticas, como variância e desvio padrão."
        ],
        "example": "Exemplo resolvido: A={4,4,4} e B={2,4,6} têm média 4; B é mais disperso."
      },
      {
        "title": "Amplitude total",
        "paragraphs": [
          "Amplitude total é máximo − mínimo. É simples e informativa sobre extensão dos dados, mas ignora todos os valores intermediários. Um único valor extremo pode aumentar drasticamente a amplitude; por isso, ela não descreve sozinha a distribuição.",
          "Quando os dados são medidos na mesma unidade, amplitude permanece nessa unidade. Não confunda amplitude de classe, que é largura de intervalo, com amplitude total da amostra."
        ],
        "example": "Exemplo resolvido: para 8, 3, 12 e 7, a amplitude é 12−3=9."
      },
      {
        "title": "Desvio médio absoluto",
        "paragraphs": [
          "O desvio médio em torno da média aritmética, na convenção usual para estatística descritiva básica, é a média dos valores absolutos das diferenças em relação à média: DM = Σ|xi−média|/n. Usa módulos porque somar desvios com sinais produziria zero.",
          "Compare 2,4,6: média 4; desvios absolutos 2,0,2; DM=4/3≈1,33. A expressão 'desvio médio' pode ter convenções de referência em materiais específicos; neste curso é sempre identificada como desvio médio absoluto em relação à média."
        ],
        "example": "Exemplo resolvido: dados 3,5,7 têm média 5, desvios absolutos 2,0,2 e DM=4/3."
      },
      {
        "title": "Variância: população e amostra",
        "paragraphs": [
          "A variância descritiva de um conjunto de dados é a média dos quadrados dos desvios em relação à sua média: divide-se a soma por sua quantidade de valores. Para uma população de N valores: σ² = Σ(xi−μ)²/N. Quando o objetivo é estimar a variância populacional a partir de uma amostra, usa-se usualmente a variância amostral corrigida s² = Σ(xi−x̄)²/(n−1), para n>1. Identifique o objetivo e a convenção do enunciado: a palavra 'amostra', isoladamente, não determina qual cálculo foi solicitado.",
          "A variância nunca é negativa, já que cada parcela é um quadrado. Ela é zero somente quando todos os dados são iguais. Sua unidade é a unidade original ao quadrado, de modo que interpretação em reais ou minutos costuma ficar mais intuitiva com o desvio padrão."
        ],
        "example": "Exemplo resolvido: os dados 2,4,6 têm média 4 e soma dos quadrados dos desvios 4+0+4=8. Para descrever os três valores como população, a variância é 8/3 ≈2,67. Se forem uma amostra usada para estimar a variância populacional pela fórmula corrigida, s²=8/(3−1)=4. O objetivo do cálculo explica a mudança de denominador."
      },
      {
        "title": "Desvio padrão e transformações",
        "paragraphs": [
          "Desvio padrão é a raiz quadrada da variância: σ=√σ² (população) ou s=√s² (amostra). Tem a mesma unidade dos dados. Quando todos os valores são multiplicados por k, o desvio padrão é multiplicado por |k| e a variância, por k². Somar uma constante a todos os dados não altera dispersão.",
          "Para comparar grupos com escalas muito diferentes, a dispersão absoluta pode ser inadequada; existe o coeficiente de variação, mas não é foco literal do programa. Concentre-se em amplitude, desvio médio, variância e desvio padrão, interpretando corretamente qual denominador o enunciado solicita."
        ],
        "example": "Exemplo resolvido: população 2, 2, 6, 6 tem média 4; quadrados dos desvios somam 16; variância 16/4=4; desvio padrão 2."
      }
    ],
    "summary": [
      {
        "title": "Amplitude",
        "text": "Máximo − mínimo.",
        "bizu": "Vê extremos, não a distribuição interna."
      },
      {
        "title": "Desvio médio",
        "text": "Σ|xi−média|/n.",
        "bizu": "Use valor absoluto antes de somar."
      },
      {
        "title": "Variância populacional",
        "text": "Σ(x−μ)²/N.",
        "bizu": "O denominador é N para população."
      },
      {
        "title": "Variância amostral corrigida",
        "text": "Σ(x−x̄)²/(n−1).",
        "bizu": "Use n−1 para a estimativa corrigida; confira o objetivo e a convenção do enunciado."
      },
      {
        "title": "Desvio padrão",
        "text": "Raiz quadrada da variância.",
        "bizu": "Mesma unidade original; nunca negativo."
      },
      {
        "title": "Transformações",
        "text": "Adicionar constante não muda dispersão; multiplicar por k muda DP por |k|.",
        "bizu": "Variância multiplica por k²."
      }
    ],
    "mindmap": [
      {
        "name": "Amplitude",
        "branches": [
          "máximo−mínimo",
          "extremos"
        ]
      },
      {
        "name": "Desvio médio",
        "branches": [
          "média",
          "módulos",
          "média dos desvios"
        ]
      },
      {
        "name": "Variância",
        "branches": [
          "quadrados",
          "populacional N",
          "amostral n−1"
        ]
      },
      {
        "name": "Desvio padrão",
        "branches": [
          "raiz quadrada",
          "unidades",
          "transformações"
        ]
      }
    ],
    "questions": [
      {
        "level": "fácil",
        "prompt": "A amplitude dos dados 3, 5, 9, 12 é:",
        "options": [
          "7",
          "8",
          "9",
          "10",
          "12"
        ],
        "answer": 2,
        "explanation": "Amplitude é a diferença entre o maior e o menor elemento: 12−3=9 unidades. Os valores intermediários não entram no cálculo.",
        "origin": "autoral"
      },
      {
        "level": "fácil",
        "prompt": "Se todos os valores de uma população são 7, sua variância é:",
        "options": [
          "0",
          "1",
          "7",
          "14",
          "49"
        ],
        "answer": 0,
        "explanation": "Todos os desvios em relação à média 7 são zero.",
        "origin": "autoral"
      },
      {
        "level": "fácil",
        "prompt": "O desvio padrão é:",
        "options": [
          "A média dos dados.",
          "O quadrado da mediana.",
          "A raiz quadrada da variância.",
          "A diferença entre moda e média.",
          "O maior valor observado."
        ],
        "answer": 2,
        "explanation": "Por definição, DP =√variância.",
        "origin": "autoral"
      },
      {
        "level": "médio",
        "prompt": "Para a população 2, 4, 6, a média vale 4 e a variância populacional é:",
        "options": [
          "2",
          "8/3",
          "4",
          "8",
          "16"
        ],
        "answer": 1,
        "explanation": "Desvios −2,0,+2; quadrados 4+0+4=8; divide por N=3 →8/3.",
        "origin": "autoral"
      },
      {
        "level": "médio",
        "prompt": "Para a população 1, 3, qual o desvio padrão populacional?",
        "options": [
          "0",
          "1",
          "2",
          "4",
          "√2"
        ],
        "answer": 1,
        "explanation": "Média 2; desvios −1 e +1; variância (1+1)/2=1; DP=1.",
        "origin": "autoral"
      },
      {
        "level": "médio",
        "prompt": "Os valores 3, 5 e 7 têm média 5. O desvio médio absoluto em relação à média é:",
        "options": [
          "2/3",
          "1",
          "4/3",
          "2",
          "4"
        ],
        "answer": 2,
        "explanation": "Desvios absolutos 2,0,2; média dos desvios =4/3.",
        "origin": "autoral"
      },
      {
        "level": "médio",
        "prompt": "Se todos os dados são acrescidos de 10, o desvio padrão:",
        "options": [
          "Aumenta 10.",
          "Diminui 10.",
          "Multiplica por 10.",
          "Permanece igual.",
          "Torna-se zero."
        ],
        "answer": 3,
        "explanation": "Translação desloca a média e cada dado igualmente; as diferenças para a média ficam iguais.",
        "origin": "autoral"
      },
      {
        "level": "difícil",
        "prompt": "A amostra 1, 3, 5 possui média 3. Qual a variância amostral (divisor n−1)?",
        "options": [
          "2",
          "3",
          "4",
          "8",
          "12"
        ],
        "answer": 2,
        "explanation": "Quadrados dos desvios: 4+0+4=8. Dividindo por 3−1=2 resulta 4.",
        "origin": "autoral"
      },
      {
        "level": "difícil",
        "prompt": "Uma população tem variância 9. Se todos os dados são multiplicados por 2, sua nova variância será:",
        "options": [
          "9",
          "12",
          "18",
          "27",
          "36"
        ],
        "answer": 4,
        "explanation": "A variância é multiplicada pelo quadrado do fator: 9×2²=36.",
        "origin": "autoral"
      },
      {
        "level": "difícil",
        "prompt": "Para a população 2, 2, 6, 6, o desvio padrão populacional é:",
        "options": [
          "1",
          "2",
          "3",
          "4",
          "√2"
        ],
        "answer": 1,
        "explanation": "Média 4; desvios −2,−2,+2,+2; soma dos quadrados=16; variância=16/4=4; DP=2.",
        "origin": "autoral"
      }
    ]
  }
});
