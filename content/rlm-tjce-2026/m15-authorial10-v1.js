/* Base Completa | Raciocínio Lógico-Matemático M15 (Amplitude, Desvio Médio, Variância e Desvio Padrão): dez questões originais autorais e comentadas.
 * Não são questões reais de bancas. Escritas em 11/11/2026 no nível de prova (5 alternativas),
 * com gabarito equilibrado (A–E, duas vezes cada); cada lei citada traz o nome e cada artigo, o que ele diz.
 * Fontes: Estatística descritiva básica: amplitude total, desvio médio absoluto em relação à média, variância populacional e amostral corrigida (n−1), desvio padrão e efeito de transformações lineares.
 */
window.BC_RLM_AUTHORIAL_OVERRIDES=window.BC_RLM_AUTHORIAL_OVERRIDES||{};
window.BC_RLM_AUTHORIAL_OVERRIDES[15]=[
  {
    "id": "rlm-m15-autoral-01",
    "q": "Os tempos, em minutos, de cinco audiências de um conjunto completo (considerado a população) foram 3, 5, 5, 7 e 10. A variância populacional desses tempos, em min², é:",
    "options": [
      "2,0",
      "7,0",
      "28,0",
      "5,6",
      "2,37"
    ],
    "answer": 3,
    "explanation": "A média é (3 + 5 + 5 + 7 + 10)/5 = 30/5 = 6. Os desvios são −3, −1, −1, 1 e 4, e seus quadrados são 9, 1, 1, 1 e 16, com soma 28. Como os cinco valores formam a população inteira, divide-se por N = 5: σ² = 28/5 = 5,6. A alternativa 7,0 é a variância amostral corrigida (28/4), que seria usada para estimar a variância de uma população a partir de uma amostra, o que não é o caso. A de 28,0 é só a soma dos quadrados dos desvios, sem dividir. A de 2,37 é o desvio padrão (√5,6). A de 2,0 é o desvio médio absoluto ((3 + 1 + 1 + 1 + 4)/5), que usa módulos e não quadrados.",
    "lawRef": "Variância populacional: Σ(x − μ)² ÷ N",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "rlm-m15-autoral-02",
    "q": "Um conjunto de 4 valores tem média 10 e variância populacional 12. Acrescenta-se ao conjunto um quinto valor, igual a 10. A nova variância populacional é:",
    "options": [
      "9,6",
      "12,0",
      "15,0",
      "8,0",
      "48,0"
    ],
    "answer": 0,
    "explanation": "A variância populacional inicial é 12 com N = 4; logo, a soma dos quadrados dos desvios é 12 × 4 = 48. O novo valor é igual à média, então a média continua 10 e o novo desvio é zero: a soma dos quadrados permanece 48, mas agora o divisor é N = 5. Assim, 48/5 = 9,6: a dispersão diminui, pois o novo valor está no centro. A alternativa 12,0 supõe que nada muda por a média ser a mesma, esquecendo que o divisor aumenta. A de 15,0 inverte a proporção (12 × 5/4). A de 8,0 divide 48 por 6, somando 1 ao número de valores já acrescentado. A de 48,0 é a soma dos quadrados dos desvios, sem dividir.",
    "lawRef": "Variância populacional: efeito de acrescentar um valor igual à média",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "rlm-m15-autoral-03",
    "q": "Os tempos de resposta de um órgão têm variância populacional igual a 9 min². Cada tempo é multiplicado por 2 (conversão para uma nova unidade) e, em seguida, somam-se 10 a todos os valores. A nova variância, na nova unidade ao quadrado, é:",
    "options": [
      "18",
      "36",
      "28",
      "46",
      "6"
    ],
    "answer": 1,
    "explanation": "Somar uma constante não altera a dispersão. Multiplicar todos os valores por k multiplica o desvio padrão por |k| e a variância por k². Aqui, k = 2 e a variância passa a 2² × 9 = 36 (o desvio padrão vai de 3 para 6). A alternativa 18 multiplica a variância por k, e não por k². A de 28 aplica à variância a transformação inteira (2 × 9 + 10). A de 46 multiplica corretamente por 4 e soma 10, como se a constante fosse somada à variância. A de 6 é o novo desvio padrão, e não a variância.",
    "lawRef": "Transformação linear: Var(kX + c) = k² · Var(X)",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "rlm-m15-autoral-04",
    "q": "Cinco valores, 12, 15, 18, 21 e 24, têm amplitude total 12 e média 18. O maior valor é substituído por 36. A nova amplitude e a nova média são, respectivamente:",
    "options": [
      "12 e 20,4",
      "24 e 18",
      "36 e 20,4",
      "12 e 18",
      "24 e 20,4"
    ],
    "answer": 4,
    "explanation": "Com a substituição, o conjunto passa a ser 12, 15, 18, 21 e 36. A amplitude total é máximo − mínimo = 36 − 12 = 24. A soma passa de 90 para 102, e a média passa a 102/5 = 20,4. A amplitude dobrou, e a média subiu, mostrando a sensibilidade de ambas a valores extremos. A alternativa \"12 e 20,4\" atualiza a média, mas esquece de refazer a amplitude. A \"24 e 18\" refaz a amplitude, mas mantém a média antiga. A \"36 e 20,4\" confunde amplitude com o valor máximo. A \"12 e 18\" ignora completamente a mudança.",
    "lawRef": "Amplitude total (máximo − mínimo) e sensibilidade a extremos",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "rlm-m15-autoral-05",
    "q": "Uma tabela mostra o número de diligências por oficial de justiça em um dia:\n\nDiligências | 1 | 2 | 3 | 4\nOficiais | 2 | 3 | 4 | 1\n\nTratando os 10 oficiais como a população, a variância das diligências é:",
    "options": [
      "0,93",
      "6,60",
      "0,84",
      "8,40",
      "0,92"
    ],
    "answer": 2,
    "explanation": "A média é (1×2 + 2×3 + 3×4 + 4×1)/10 = 24/10 = 2,4. Soma ponderada dos quadrados dos desvios: 2×(1 − 2,4)² + 3×(2 − 2,4)² + 4×(3 − 2,4)² + 1×(4 − 2,4)² = 3,92 + 0,48 + 1,44 + 2,56 = 8,4. Dividindo por N = 10, σ² = 0,84. Confere pela outra forma: a média dos quadrados é (2 + 12 + 36 + 16)/10 = 6,6, e 6,6 − 2,4² = 6,6 − 5,76 = 0,84. A alternativa 0,93 usa o divisor n − 1 = 9 (variância amostral), inadequado quando os dados são a população. A de 6,60 é só a média dos quadrados, sem subtrair o quadrado da média. A de 8,40 é a soma dos quadrados dos desvios, sem dividir. A de 0,92 é o desvio padrão (√0,84).",
    "lawRef": "Variância populacional em tabela de frequências",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "rlm-m15-autoral-06",
    "q": "Duas equipes têm a produção diária de cinco servidores, em processos: Equipe A = 6, 8, 10, 12, 14; Equipe B = 2, 6, 10, 14, 18. Considerando os dados como populações, é correto afirmar que:",
    "options": [
      "as duas equipes têm a mesma média, logo a mesma dispersão, e variância e desvio padrão coincidem",
      "a variância de B (32) é o quádruplo da de A (8), e o desvio padrão de B é o dobro do de A",
      "a variância de B é o dobro da de A (16 contra 8), e o desvio padrão de B é o quádruplo do de A",
      "os desvios padrão são 8 (A) e 32 (B), pois a raiz quadrada é usada só para amostras",
      "o desvio médio absoluto de B é igual ao de A, já que as duas médias são iguais a 10"
    ],
    "answer": 1,
    "explanation": "Ambas têm média 10. Equipe A: desvios −4, −2, 0, 2 e 4; quadrados 16, 4, 0, 4 e 16; soma 40; σ² = 8 e σ ≈ 2,83. Equipe B: desvios −8, −4, 0, 4 e 8; quadrados 64, 16, 0, 16 e 64; soma 160; σ² = 32 e σ ≈ 5,66. Os valores de B são o dobro dos desvios de A, então o desvio padrão dobra e a variância é multiplicada por 2² = 4. A primeira alternativa ignora que médias iguais não implicam dispersões iguais. A que diz \"variância dobra e desvio padrão quadruplica\" troca as relações (k² e |k|). A que atribui desvios padrão 8 e 32 confunde variância com desvio padrão. A que iguala os desvios médios erra: os desvios absolutos médios são 2,4 (A) e 4,8 (B).",
    "lawRef": "Comparação de dispersão: variância x desvio padrão",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "rlm-m15-autoral-07",
    "q": "A variância amostral corrigida (divisor n − 1) de 9 observações é igual a 4. Se esses mesmos 9 valores fossem considerados uma população, a variância seria, aproximadamente:",
    "options": [
      "3,56",
      "4,50",
      "4,00",
      "36,00",
      "32,00"
    ],
    "answer": 0,
    "explanation": "A variância amostral corrigida é s² = Σ(x − x̄)²/(n − 1); logo, Σ(x − x̄)² = 4 × (9 − 1) = 32. Como população, o divisor passa a N = 9: σ² = 32/9 ≈ 3,56, menor que a amostral, pois o divisor é maior. A alternativa 4,50 faz a conversão no sentido contrário (4 × 9/8). A de 4,00 supõe que as duas variâncias coincidem. A de 36,00 usa 4 × 9, tomando o divisor errado para recuperar a soma dos quadrados. A de 32,00 é a soma dos quadrados dos desvios, sem dividir.",
    "lawRef": "Variância amostral (n − 1) x populacional (N)",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "rlm-m15-autoral-08",
    "q": "Dez valores têm média 20 e desvio padrão populacional 4. A soma dos quadrados dos dez valores (Σx²) é:",
    "options": [
      "4.000",
      "160",
      "4.016",
      "3.840",
      "4.160"
    ],
    "answer": 4,
    "explanation": "A variância populacional é a média dos quadrados menos o quadrado da média: σ² = Σx²/N − μ². Então 16 = Σx²/10 − 400, de onde Σx²/10 = 416 e Σx² = 4.160. Outra via: a soma dos quadrados dos desvios é 10 × 16 = 160, e Σx² = Σ(x − μ)² + N·μ² = 160 + 10 × 400 = 4.160. A alternativa 4.000 é só N·μ², sem a parte da dispersão. A de 160 é só a soma dos quadrados dos desvios. A de 4.016 soma 16 (a variância) ao invés de 160. A de 3.840 subtrai os 160 em vez de somá-los.",
    "lawRef": "Variância: σ² = (Σx²)/N − μ²",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "rlm-m15-autoral-09",
    "q": "O desvio padrão dos tempos de atendimento de um setor é 30 minutos. A variância desses tempos, expressa em horas ao quadrado (h²), é:",
    "options": [
      "15",
      "0,50",
      "900",
      "0,25",
      "0,0083"
    ],
    "answer": 3,
    "explanation": "A variância tem a unidade dos dados ao quadrado. Em minutos, é 30² = 900 min². Como 1 h = 60 min, 1 h² = 3.600 min²; portanto, 900/3.600 = 0,25 h². Outra via: o desvio padrão em horas é 30/60 = 0,5 h, e a variância é 0,5² = 0,25. A alternativa 0,50 é o desvio padrão em horas, e não a variância. A de 15 divide 900 por 60, esquecendo que a unidade está elevada ao quadrado. A de 900 não converte a unidade (é a variância em min²). A de 0,0083 divide o desvio padrão (30) por 3.600.",
    "lawRef": "Unidades: variância na unidade ao quadrado",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "rlm-m15-autoral-10",
    "q": "A tabela mostra quantas horas extras cada um dos 10 servidores de um setor fez no mês:\n\nHoras extras | 2 | 4 | 6\nServidores | 3 | 5 | 2\n\nO desvio médio absoluto em relação à média é:",
    "options": [
      "10,80",
      "1,00",
      "1,08",
      "1,33",
      "0,42"
    ],
    "answer": 2,
    "explanation": "A média é (2×3 + 4×5 + 6×2)/10 = 38/10 = 3,8. Os desvios absolutos são |2 − 3,8| = 1,8; |4 − 3,8| = 0,2; |6 − 3,8| = 2,2. Ponderando pelas frequências: 1,8×3 + 0,2×5 + 2,2×2 = 5,4 + 1,0 + 4,4 = 10,8. Dividindo por 10 servidores, DM = 1,08. A alternativa 10,80 é a soma dos desvios, sem dividir. A de 1,00 mede os desvios em torno de 4 (mediana e moda), e não em torno da média. A de 1,33 ignora as frequências e calcula com os valores 2, 4 e 6 uma única vez (média 4). A de 0,42 soma os desvios 1,8, 0,2 e 2,2 sem multiplicar pelas frequências, mas divide por 10.",
    "lawRef": "Desvio médio absoluto em torno da média, em tabela de frequências",
    "provenance": "questao-autoral-IA-revisada"
  }
];
