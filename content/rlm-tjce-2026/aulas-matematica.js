/* Conteúdo original de apoio RLM FCC, com questões autorais explicitamente identificadas. */
window.RLM_CURSO_AULAS=Object.assign(window.RLM_CURSO_AULAS||{}, {
  "M10": {
    "theory": [
      {
        "title": "Operações e sinais",
        "paragraphs": [
          "O conjunto dos inteiros inclui negativos, zero e positivos; os racionais são números expressáveis como fração a/b com a e b inteiros, b≠0. Em somas, observe os sinais: −8 + 3 = −5. Em produtos e divisões, sinais iguais produzem positivo, diferentes produzem negativo. A subtração de um número equivale à soma de seu oposto.",
          "Na ordem de operações, resolva primeiro agrupamentos, depois potências e raízes, depois multiplicações e divisões, e finalmente adições e subtrações, respeitando esquerda para direita entre operações de mesma prioridade. Não há prioridade global da multiplicação sobre divisão."
        ],
        "example": "Exemplo resolvido: 3 + 2×(8−5)² = 3 + 2×9 =21."
      },
      {
        "title": "Frações, decimais e equivalência",
        "paragraphs": [
          "Frações representam partes de um todo ou quocientes. Multiplique numerador e denominador pelo mesmo número não nulo para obter frações equivalentes. Somar frações exige denominador comum; multiplicar permite numerador × numerador e denominador × denominador; dividir equivale a multiplicar pelo inverso da segunda fração.",
          "Para transformar 0,375 em fração, escreva 375/1000 e simplifique por 125, chegando a 3/8. Números decimais finitos sempre são racionais. Antes de resolver um problema, identifique qual é o todo sobre o qual cada fração incide; metade do restante difere de metade do total inicial."
        ],
        "example": "Exemplo resolvido: 2/3 +1/4 =8/12+3/12 =11/12. Já 2/3 × 1/4 =2/12 =1/6."
      },
      {
        "title": "Potências, divisibilidade, MDC e MMC",
        "paragraphs": [
          "A potência a^n representa produto de n fatores iguais; a^0=1 para a≠0. Para potências de mesma base, somam-se expoentes na multiplicação e subtraem-se na divisão. Divisibilidade: número é múltiplo de 3 quando a soma dos algarismos é múltipla de 3; de 9 quando essa soma é múltipla de 9; de 2 quando termina em algarismo par.",
          "O máximo divisor comum (MDC) ajuda a montar grupos idênticos do maior tamanho possível. O mínimo múltiplo comum (MMC) localiza coincidências de ciclos e denominadores comuns. Na fatoração, o MDC usa os menores expoentes de fatores comuns; o MMC usa os maiores expoentes de todos."
        ],
        "example": "Exemplo resolvido: MDC(18,24)=6 e MMC(18,24)=72. Dois eventos que se repetem a cada 18 e 24 dias coincidem a cada 72 dias."
      },
      {
        "title": "Equações elementares e unidades",
        "paragraphs": [
          "Muitos enunciados de raciocínio matemático conduzem a equação linear: 'o triplo de um número menos 4 é 17' vira 3x−4=17, logo x=7. Defina a incógnita e transforme cada frase em operação, mantendo a mesma unidade dos dois lados da igualdade.",
          "Conversão de unidades é fonte de erros: 1 hora=60 minutos; 1 km=1000 m; 1 kg=1000 g; 1 litro=1000 mL. Ao combinar quantidades, converta antes de somar. Arredondamento deve ocorrer no final, respeitando precisão pedida no enunciado."
        ],
        "example": "Exemplo resolvido: uma pessoa anda 1,5 km mais 250 m, totalizando 1750 m."
      },
      {
        "title": "Problemas com partes e restos",
        "paragraphs": [
          "Um tipo frequente de cálculo pede fração de uma quantidade e depois fração do restante. A cada etapa, atualize a base: gastar 1/3 de 90 deixa 60, e gastar metade do restante retira 30; sobram 30. Não some as frações diretamente, porque a segunda tem base diferente.",
          "Use diagramas de barras quando houver partilha proporcional ou comparação entre pessoas. Confira o resultado substituindo-o nas condições originais: a interpretação correta deve satisfazer todos os passos do enunciado."
        ],
        "example": "Exemplo resolvido: de 120 fichas, são distribuídos 25% (30); restam 90. Se 2/3 do restante são utilizados, usam-se 60 e sobram 30."
      }
    ],
    "summary": [
      {
        "title": "Sinais",
        "text": "Produto: iguais = positivo, diferentes = negativo.",
        "bizu": "−(−a)=+a."
      },
      {
        "title": "Frações",
        "text": "Somar pede denominador comum; dividir é multiplicar pelo inverso.",
        "bizu": "Sempre identifique a base da fração."
      },
      {
        "title": "MDC/MMC",
        "text": "MDC agrupa; MMC sincroniza ciclos.",
        "bizu": "MMC(18,24)=72."
      },
      {
        "title": "Prioridades",
        "text": "Parênteses, potência, multiplicação/divisão, adição/subtração.",
        "bizu": "Operações do mesmo nível: da esquerda para direita."
      },
      {
        "title": "Unidades",
        "text": "Padronize as unidades antes da equação.",
        "bizu": "1h=60min; 1kg=1000g."
      }
    ],
    "mindmap": [
      {
        "name": "Números",
        "branches": [
          "inteiros",
          "racionais",
          "sinais"
        ]
      },
      {
        "name": "Operações",
        "branches": [
          "frações",
          "potências",
          "precedência"
        ]
      },
      {
        "name": "Divisibilidade",
        "branches": [
          "múltiplos",
          "MDC",
          "MMC"
        ]
      },
      {
        "name": "Problemas",
        "branches": [
          "equações",
          "frações do restante",
          "unidades"
        ]
      }
    ],
    "questions": [
      {
        "level": "fácil",
        "prompt": "Calcule 8 − 3×2.",
        "options": [
          "10",
          "5",
          "2",
          "16",
          "1"
        ],
        "answer": 2,
        "explanation": "Multiplicação vem primeiro: 3×2=6; 8−6=2.",
        "origin": "autoral"
      },
      {
        "level": "fácil",
        "prompt": "Quanto vale 1/2 + 1/4?",
        "options": [
          "2/6",
          "3/4",
          "1/6",
          "1/8",
          "2/4"
        ],
        "answer": 1,
        "explanation": "1/2=2/4, então 2/4+1/4=3/4.",
        "origin": "autoral"
      },
      {
        "level": "fácil",
        "prompt": "Qual é o MMC de 4 e 6?",
        "options": [
          "2",
          "6",
          "8",
          "12",
          "24"
        ],
        "answer": 3,
        "explanation": "Múltiplos comuns: 12, 24, ...; o menor é 12.",
        "origin": "autoral"
      },
      {
        "level": "médio",
        "prompt": "Calcule −3×(−5)+2.",
        "options": [
          "−17",
          "−13",
          "13",
          "17",
          "7"
        ],
        "answer": 3,
        "explanation": "Sinais iguais geram +15; +2 =17.",
        "origin": "autoral"
      },
      {
        "level": "médio",
        "prompt": "0,375 equivale à fração simplificada:",
        "options": [
          "3/4",
          "3/5",
          "3/8",
          "5/8",
          "7/20"
        ],
        "answer": 2,
        "explanation": "375/1000 divide numerador e denominador por 125: 3/8.",
        "origin": "autoral"
      },
      {
        "level": "médio",
        "prompt": "Uma tarefa consome 2/5 de 100 unidades e depois metade do restante. Quantas unidades sobram?",
        "options": [
          "20",
          "25",
          "30",
          "40",
          "50"
        ],
        "answer": 2,
        "explanation": "Primeiro consome 40, sobram 60; metade de 60 são 30, então sobram 30.",
        "origin": "autoral"
      },
      {
        "level": "médio",
        "prompt": "O triplo de um número menos 7 é 20. O número vale:",
        "options": [
          "7",
          "8",
          "9",
          "10",
          "11"
        ],
        "answer": 2,
        "explanation": "3x−7=20 →3x=27→x=9.",
        "origin": "autoral"
      },
      {
        "level": "difícil",
        "prompt": "Calcule 2 + 3×(5−2)² − 4.",
        "options": [
          "7",
          "21",
          "25",
          "27",
          "31"
        ],
        "answer": 2,
        "explanation": "(5−2)=3; 3²=9; 3×9=27; 2+27−4=25.",
        "origin": "autoral"
      },
      {
        "level": "difícil",
        "prompt": "Dois alarmes disparam a cada 12 e 18 minutos. Se dispararam juntos agora, quando voltarão a coincidir?",
        "options": [
          "6 minutos",
          "18 minutos",
          "24 minutos",
          "30 minutos",
          "36 minutos"
        ],
        "answer": 4,
        "explanation": "MMC(12,18)=36 minutos.",
        "origin": "autoral"
      },
      {
        "level": "difícil",
        "prompt": "Qual é o MDC de 84 e 126?",
        "options": [
          "7",
          "14",
          "21",
          "28",
          "42"
        ],
        "answer": 4,
        "explanation": "84=2²×3×7 e 126=2×3²×7. MDC=2×3×7=42.",
        "origin": "autoral"
      }
    ]
  },
  "M11": {
    "theory": [
      {
        "title": "Razão como comparação por quociente",
        "paragraphs": [
          "Razão entre grandezas comparáveis é o quociente de duas medidas, preservando a ordem especificada. A razão de 3 homens para 5 mulheres é 3/5, não 3/8; a fração de homens no total, em contraste, é 3/(3+5)=3/8. Essa distinção aparece em problemas que misturam razão entre partes e participação no todo.",
          "Quando unidades diferem, converta para a mesma unidade antes de calcular razão adimensional. Em problemas de velocidade e produtividade, mantenha as unidades no quociente, como quilômetros por hora ou peças por trabalhador."
        ],
        "example": "Exemplo resolvido: razão de cadernos azuis para vermelhos é 2:3; em lote de 25, as partes são 2×5=10 azuis e 3×5=15 vermelhos."
      },
      {
        "title": "Proporção e sua propriedade",
        "paragraphs": [
          "Uma proporção iguala razões: a/b=c/d, com denominadores não nulos. A propriedade fundamental é a·d = b·c. Antes de usar, confira se os termos foram organizados na ordem correspondente. Dizer 2/3 = x/12 permite achar x=8.",
          "Grandezas diretamente proporcionais mantêm razão constante: se uma dobra, a outra dobra. Inversamente proporcionais mantêm produto constante: se uma dobra, a outra cai pela metade. São relações assumidas pelo modelo, não propriedades de todo fenômeno real."
        ],
        "example": "Exemplo resolvido: 4/7 = x/21 → 7x=84 → x=12."
      },
      {
        "title": "Regra de três simples direta",
        "paragraphs": [
          "Quando quantidades crescem ou diminuem na mesma direção proporcional, monte duas colunas com a mesma unidade em cada uma. Se 4 cadernos custam R$ 28, então 7 cadernos do mesmo tipo custam x com x/28 =7/4; logo x=49.",
          "Leia condições de preço constante. Se houver desconto progressivo, taxa de entrega fixa ou mudança de eficiência, a relação pode deixar de ser direta. A regra de três aplica uma hipótese de proporcionalidade que precisa ser justificada pelo enunciado."
        ],
        "example": "Exemplo resolvido: 6 metros de tecido custam 90 reais; 10 metros custam 90×10/6=150 reais."
      },
      {
        "title": "Regra de três simples inversa",
        "paragraphs": [
          "Se 6 trabalhadores iguais concluem tarefa fixa em 10 dias, 12 trabalhadores iguais, com mesma jornada e eficiência, concluem em 5 dias. O produto trabalhadores × dias permanece 60 trabalhador-dias. A seta inversa significa crescimento em uma grandeza e queda na outra.",
          "Cuidado com 'dobrar a velocidade' e 'dobrar o tempo': para distância constante, velocidade e tempo são inversamente proporcionais. Para distância variável, pode não haver essa relação. Não use fórmula memorizada sem verificar o que se mantém constante."
        ],
        "example": "Exemplo resolvido: a 60 km/h, um trajeto leva 3h. A 90 km/h, com a mesma distância, leva 60×3/90=2h."
      },
      {
        "title": "Divisão em partes proporcionais e problemas",
        "paragraphs": [
          "Repartir 360 em razão 2:3:4 significa dividir 360 por 9 partes iguais: cada parte vale 40; as quantidades são 80, 120 e 160. Se as partes forem inversamente proporcionais a 2 e 3, a relação das parcelas é 1/2 : 1/3 = 3:2.",
          "Resolva cada problema em três linhas: grandezas e unidades, tipo de relação, conta e verificação. Um resultado inverso aparentemente plausível pode violar a direção esperada; mais máquinas iguais devem reduzir, e não aumentar, o tempo para uma tarefa fixa."
        ],
        "example": "Exemplo resolvido: R$ 450 divididos na proporção 2:3 dão 450×2/5=180 e 450×3/5=270."
      }
    ],
    "summary": [
      {
        "title": "Razão x fração do total",
        "text": "A:B=2:3 implica frações 2/5 e 3/5 no total.",
        "bizu": "Some as partes antes de dividir."
      },
      {
        "title": "Proporção",
        "text": "a/b=c/d implica ad=bc.",
        "bizu": "Alinhe grandezas semelhantes."
      },
      {
        "title": "Direta",
        "text": "Dobra uma, dobra a outra.",
        "bizu": "Preço unitário constante é caso típico."
      },
      {
        "title": "Inversa",
        "text": "Uma aumenta e a outra diminui no mesmo fator.",
        "bizu": "Produto constante nas condições fixadas."
      },
      {
        "title": "Repartição",
        "text": "Some pesos e distribua pelo peso relativo.",
        "bizu": "2:3:4 são nove partes."
      }
    ],
    "mindmap": [
      {
        "name": "Razões",
        "branches": [
          "parte/parte",
          "parte/todo",
          "unidades"
        ]
      },
      {
        "name": "Proporções",
        "branches": [
          "a/b=c/d",
          "produto cruzado"
        ]
      },
      {
        "name": "Regra de três",
        "branches": [
          "direta",
          "inversa",
          "grandezas fixas"
        ]
      },
      {
        "name": "Repartições",
        "branches": [
          "pesos",
          "soma das partes",
          "verificação"
        ]
      }
    ],
    "questions": [
      {
        "level": "fácil",
        "prompt": "A razão 3:4, em uma população de 35 pessoas divididas em dois grupos, corresponde a quantas pessoas no primeiro grupo?",
        "options": [
          "10",
          "12",
          "15",
          "20",
          "21"
        ],
        "answer": 2,
        "explanation": "São 7 partes; cada parte vale 35/7=5, e o primeiro grupo vale 3×5=15.",
        "origin": "autoral"
      },
      {
        "level": "fácil",
        "prompt": "Se 2/5 = x/20, então x vale:",
        "options": [
          "4",
          "6",
          "8",
          "10",
          "12"
        ],
        "answer": 2,
        "explanation": "2×20=5x, portanto x=8.",
        "origin": "autoral"
      },
      {
        "level": "fácil",
        "prompt": "Se 5 unidades custam R$ 30 a preço constante, 10 custam:",
        "options": [
          "R$ 40",
          "R$ 45",
          "R$ 50",
          "R$ 60",
          "R$ 75"
        ],
        "answer": 3,
        "explanation": "Dobrar quantidade dobra preço, resultando 60 reais.",
        "origin": "autoral"
      },
      {
        "level": "médio",
        "prompt": "Um veículo percorre 90 km em 1,5 h. Mantendo velocidade, percorre quantos km em 4 h?",
        "options": [
          "180",
          "210",
          "240",
          "270",
          "300"
        ],
        "answer": 2,
        "explanation": "Velocidade constante =90/1,5=60 km/h; em 4h, 240 km.",
        "origin": "autoral"
      },
      {
        "level": "médio",
        "prompt": "8 trabalhadores concluem tarefa em 15 dias. Com 12 trabalhadores iguais e mesma jornada, o prazo é:",
        "options": [
          "8",
          "10",
          "12",
          "18",
          "22"
        ],
        "answer": 1,
        "explanation": "Produto constante 8×15=120; 120/12=10 dias.",
        "origin": "autoral"
      },
      {
        "level": "médio",
        "prompt": "R$ 280 são repartidos em razão 3:4. Qual a maior parcela?",
        "options": [
          "R$ 100",
          "R$ 120",
          "R$ 140",
          "R$ 160",
          "R$ 180"
        ],
        "answer": 3,
        "explanation": "Há 7 partes de 40 reais; maior parcela 4×40=160.",
        "origin": "autoral"
      },
      {
        "level": "médio",
        "prompt": "Uma torneira de vazão constante enche 18 L em 3 minutos. Quantos litros em 7 minutos?",
        "options": [
          "36",
          "39",
          "42",
          "45",
          "48"
        ],
        "answer": 2,
        "explanation": "Vazão =6 L/min; em 7 min produz 42 L.",
        "origin": "autoral"
      },
      {
        "level": "difícil",
        "prompt": "A 48 km/h, um percurso fixo leva 2h30. A 60 km/h, quanto leva?",
        "options": [
          "1h30",
          "1h45",
          "2h",
          "2h15",
          "2h25"
        ],
        "answer": 2,
        "explanation": "Distância 48×2,5=120 km. Tempo 120/60=2h.",
        "origin": "autoral"
      },
      {
        "level": "difícil",
        "prompt": "Uma quantia é dividida em partes inversamente proporcionais a 2 e 3. Qual a razão entre a primeira e a segunda parte?",
        "options": [
          "2:3",
          "3:2",
          "1:5",
          "2:5",
          "5:6"
        ],
        "answer": 1,
        "explanation": "Pesos inversos são 1/2 e 1/3. Dividindo ambos por 1/6, razão 3:2.",
        "origin": "autoral"
      },
      {
        "level": "difícil",
        "prompt": "9 máquinas iguais fazem 540 peças em 6 horas. Quantas peças 12 máquinas iguais fazem em 5 horas?",
        "options": [
          "450",
          "500",
          "550",
          "600",
          "650"
        ],
        "answer": 3,
        "explanation": "Produção por máquina-hora = 540/(9×6)=10 peças. 12×5×10=600 peças.",
        "origin": "autoral"
      }
    ]
  },
  "M12": {
    "theory": [
      {
        "title": "Porcentagem como razão de base 100",
        "paragraphs": [
          "Uma taxa de p% significa p/100 da base considerada. 25% de 240 = (25/100)×240 = 60. A palavra 'de' costuma indicar multiplicação, e o valor que recebe a porcentagem precisa estar identificado. Em problemas de pesquisa, 60% dos respondentes não significa necessariamente 60% da população inteira.",
          "Percentuais se convertem em fator decimal: 5%=0,05; 125%=1,25; 0,5%=0,005. Erros de duas casas decimais são frequentes. Ao calcular diferença percentual entre valores, a base é o valor de referência explicitado."
        ],
        "example": "Exemplo resolvido: 12,5% de 160 = 1/8 de 160 =20."
      },
      {
        "title": "Acréscimos e descontos por fatores",
        "paragraphs": [
          "Aumentar um valor V em p% equivale a multiplicar por (1+p/100). Descontar p% equivale a multiplicar por (1−p/100). Assim, aumento de 20% em R$ 80: 80×1,20=96. Desconto de 25% em R$ 200: 200×0,75=150.",
          "Para achar valor original antes de aumento/desconto, divida pelo fator aplicado. Se após desconto de 20% o preço é R$ 120, o valor inicial é 120/0,8=150. Subtrair 20% de 120 voltando atrás estaria errado, pois mudaria a base."
        ],
        "example": "Exemplo resolvido: após acréscimo de 10%, o preço é R$ 220. Valor inicial 220/1,10=R$ 200."
      },
      {
        "title": "Percentuais sucessivos",
        "paragraphs": [
          "Acréscimos e descontos sucessivos compõem-se por multiplicação de fatores, não por soma direta. Um aumento de 10% seguido de redução de 10% resulta em fator 1,1×0,9=0,99; saldo 1% inferior ao valor original. A ordem de dois fatores percentuais fixos comuta em produto, mas as bases intermediárias mudam.",
          "Dois aumentos de 20% produzem 1,2²=1,44, isto é, 44% de aumento total. Percentuais são números relativos; sempre verifique a grandeza usada no denominador da comparação."
        ],
        "example": "Exemplo resolvido: R$ 100 sobem 30% e depois caem 20%: 100×1,30×0,80=104 reais, ganho líquido de 4%."
      },
      {
        "title": "Variação relativa e pontos percentuais",
        "paragraphs": [
          "Variação percentual de inicial A para final B é (B−A)/A×100%, quando A≠0. De 80 para 100 há aumento de 20/80=25%; a queda de 100 para 80 é 20/100=20%. Os percentuais não são simétricos porque mudam as bases.",
          "Quando uma taxa passa de 12% para 15%, ela cresce 3 pontos percentuais, mas sua variação relativa é (15−12)/12 =25%. 'Ponto percentual' mede diferença entre taxas, não variação relativa das taxas."
        ],
        "example": "Exemplo resolvido: taxa de aprovação de 40% para 50% cresceu 10 pontos percentuais ou 25% em termos relativos."
      },
      {
        "title": "Porcentagem aplicada a tabelas e problemas",
        "paragraphs": [
          "Em gráficos e tabelas, escolha o total correto como denominador: percentual por linha, por coluna ou da amostra geral produzem respostas diferentes. Para converter uma porcentagem de gráfico em quantidade, multiplique a taxa pelo total correspondente. Somente arredonde quando o problema exigir números inteiros e as regras permitirem.",
          "Confira sanidade do resultado: 15% de um valor positivo deve ser menor que o total; uma despesa após desconto de 30% corresponde a 70% do preço. Se houver aumento e desconto, não se pode cancelar taxas iguais como se incidissem sobre a mesma base."
        ],
        "example": "Exemplo resolvido: em 240 respostas, 35% escolheram A, então 84 escolheram A; as restantes são 156."
      }
    ],
    "summary": [
      {
        "title": "Percentual",
        "text": "p% de V = pV/100.",
        "bizu": "12,5%=1/8; 25%=1/4; 50%=1/2."
      },
      {
        "title": "Fatores",
        "text": "Subida usa 1+p; queda usa 1−p (p decimal).",
        "bizu": "Para achar valor original, divida pelo fator."
      },
      {
        "title": "Sucessão",
        "text": "Multiplique fatores sucessivos.",
        "bizu": "+10% e −10% resultam em −1%, não zero."
      },
      {
        "title": "Variação",
        "text": "(final−inicial)/inicial ×100%.",
        "bizu": "A base é sempre o valor inicial."
      },
      {
        "title": "Pontos percentuais",
        "text": "Diferença entre taxas percentuais.",
        "bizu": "De 12% para 15%=3 p.p.; variação relativa 25%."
      }
    ],
    "mindmap": [
      {
        "name": "Base",
        "branches": [
          "p/100",
          "percentual de V"
        ]
      },
      {
        "name": "Reajustes",
        "branches": [
          "fator de aumento",
          "fator de desconto",
          "inversão"
        ]
      },
      {
        "name": "Sucessões",
        "branches": [
          "produto de fatores",
          "variação líquida"
        ]
      },
      {
        "name": "Comparações",
        "branches": [
          "taxa relativa",
          "pontos percentuais",
          "tabelas"
        ]
      }
    ],
    "questions": [
      {
        "level": "fácil",
        "prompt": "25% de 200 vale:",
        "options": [
          "25",
          "40",
          "50",
          "75",
          "100"
        ],
        "answer": 2,
        "explanation": "Um quarto de 200 é 50.",
        "origin": "autoral"
      },
      {
        "level": "fácil",
        "prompt": "R$ 80 com aumento de 10% tornam-se:",
        "options": [
          "R$ 82",
          "R$ 84",
          "R$ 86",
          "R$ 88",
          "R$ 90"
        ],
        "answer": 3,
        "explanation": "80×1,10=88 reais.",
        "origin": "autoral"
      },
      {
        "level": "fácil",
        "prompt": "Um desconto de 20% corresponde a multiplicar o preço por:",
        "options": [
          "1,20",
          "0,80",
          "0,20",
          "0,02",
          "1,80"
        ],
        "answer": 1,
        "explanation": "Resta 80% do original, fator 0,80.",
        "origin": "autoral"
      },
      {
        "level": "médio",
        "prompt": "Se após desconto de 25% um produto custa R$ 150, o preço inicial era:",
        "options": [
          "R$ 175",
          "R$ 180",
          "R$ 190",
          "R$ 200",
          "R$ 225"
        ],
        "answer": 3,
        "explanation": "Preço final é 75% do inicial: 150/0,75=200.",
        "origin": "autoral"
      },
      {
        "level": "médio",
        "prompt": "Aumentar R$ 100 em 20% e depois descontar 20% produz:",
        "options": [
          "R$ 96",
          "R$ 100",
          "R$ 104",
          "R$ 108",
          "R$ 120"
        ],
        "answer": 0,
        "explanation": "100×1,2×0,8=96, redução líquida de 4%.",
        "origin": "autoral"
      },
      {
        "level": "médio",
        "prompt": "A variação percentual de 80 para 100 é:",
        "options": [
          "20%",
          "25%",
          "30%",
          "40%",
          "80%"
        ],
        "answer": 1,
        "explanation": "Diferença 20 sobre base inicial 80: 20/80=25%.",
        "origin": "autoral"
      },
      {
        "level": "médio",
        "prompt": "Uma taxa cresce de 12% para 17%. Quantos pontos percentuais aumentou?",
        "options": [
          "3",
          "4",
          "5",
          "12",
          "17"
        ],
        "answer": 2,
        "explanation": "17−12 =5 pontos percentuais.",
        "origin": "autoral"
      },
      {
        "level": "difícil",
        "prompt": "Dois aumentos sucessivos de 15% equivalem ao aumento único de:",
        "options": [
          "30%",
          "30,5%",
          "31%",
          "32,25%",
          "35%"
        ],
        "answer": 3,
        "explanation": "1,15² =1,3225, logo aumento de 32,25%.",
        "origin": "autoral"
      },
      {
        "level": "difícil",
        "prompt": "Após aumento de 25% e desconto de 20%, um preço de R$ 240 passa a:",
        "options": [
          "R$ 230",
          "R$ 240",
          "R$ 245",
          "R$ 250",
          "R$ 260"
        ],
        "answer": 1,
        "explanation": "Os fatores 1,25 e 0,8 se anulam: 240×1 =240.",
        "origin": "autoral"
      },
      {
        "level": "difícil",
        "prompt": "De 40% para 50% há acréscimo relativo de:",
        "options": [
          "10%",
          "12,5%",
          "20%",
          "25%",
          "50%"
        ],
        "answer": 3,
        "explanation": "Diferença 10 p.p.; variação relativa usa base 40%: 10/40=25%.",
        "origin": "autoral"
      }
    ]
  }
});
