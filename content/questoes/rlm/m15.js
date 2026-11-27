/* Banco de questões — Raciocínio Lógico-Matemático, módulo 15. Questões autorais (não são de banca).
 * Para acrescentar questões, veja content/questoes/LEIAME.md e rode "npm run questoes:check". */
window.BC_QUESTOES=window.BC_QUESTOES||{};
(window.BC_QUESTOES.rlm=window.BC_QUESTOES.rlm||{})[15]=[
 {
  "id": "rlm-m15-autoral-01",
  "origem": "autoral-ia",
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
  "lawRef": "Variância populacional: Σ(x − μ)² ÷ N"
 },
 {
  "id": "rlm-m15-autoral-02",
  "origem": "autoral-ia",
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
  "lawRef": "Variância populacional: efeito de acrescentar um valor igual à média"
 },
 {
  "id": "rlm-m15-autoral-03",
  "origem": "autoral-ia",
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
  "lawRef": "Transformação linear: Var(kX + c) = k² · Var(X)"
 },
 {
  "id": "rlm-m15-autoral-04",
  "origem": "autoral-ia",
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
  "lawRef": "Amplitude total (máximo − mínimo) e sensibilidade a extremos"
 },
 {
  "id": "rlm-m15-autoral-05",
  "origem": "autoral-ia",
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
  "lawRef": "Variância populacional em tabela de frequências"
 },
 {
  "id": "rlm-m15-autoral-06",
  "origem": "autoral-ia",
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
  "lawRef": "Comparação de dispersão: variância x desvio padrão"
 },
 {
  "id": "rlm-m15-autoral-07",
  "origem": "autoral-ia",
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
  "lawRef": "Variância amostral (n − 1) x populacional (N)"
 },
 {
  "id": "rlm-m15-autoral-08",
  "origem": "autoral-ia",
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
  "lawRef": "Variância: σ² = (Σx²)/N − μ²"
 },
 {
  "id": "rlm-m15-autoral-09",
  "origem": "autoral-ia",
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
  "lawRef": "Unidades: variância na unidade ao quadrado"
 },
 {
  "id": "rlm-m15-autoral-10",
  "origem": "autoral-ia",
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
  "lawRef": "Desvio médio absoluto em torno da média, em tabela de frequências"
 },
 {
  "id": "rlm-m15-autoral-11",
  "origem": "autoral-ia",
  "q": "Os tempos de espera, em dias, de quatro processos foram 3, 5, 9 e 12. A amplitude desses tempos, em dias, é:",
  "options": [
   "7,25",
   "12",
   "9",
   "3",
   "15"
  ],
  "answer": 2,
  "explanation": "A amplitude total é a diferença entre o maior e o menor valor: 12 − 3 = 9 dias. Os valores intermediários (5 e 9) não influenciam a amplitude. A alternativa 7,25 é a média aritmética dos dados (29/4), que é medida de posição, e não de dispersão. A de 12 é o maior valor, e a de 3 é o menor valor, sem fazer a diferença entre eles. A de 15 resulta de somar o maior e o menor, em vez de subtrair.",
  "lawRef": "Amplitude total"
 },
 {
  "id": "rlm-m15-autoral-12",
  "origem": "autoral-ia",
  "q": "Os seis servidores de uma seção (a população completa) têm, todos, exatamente 7 anos de serviço. A variância populacional do tempo de serviço é:",
  "options": [
   "0",
   "1",
   "7",
   "14",
   "49"
  ],
  "answer": 0,
  "explanation": "A variância mede o quanto os dados se afastam da média. Aqui a média é 7 e todos os valores são iguais a 7, de modo que todos os desvios são zero e a variância populacional é (0² + 0² + ... )/6 = 0. A alternativa 7 confunde variância com a média. A de 49 é o quadrado da média, e a de 14 é o dobro dela, sem relação com os desvios. A de 1 seria uma dispersão mínima típica de dados que diferem de 1 unidade da média, o que não ocorre. Dispersão zero significa dados todos iguais.",
  "lawRef": "Variância: dados iguais têm dispersão nula"
 },
 {
  "id": "rlm-m15-autoral-13",
  "origem": "autoral-ia",
  "q": "Em Estatística, sobre o desvio padrão de um conjunto de dados, é correto afirmar que ele é:",
  "options": [
   "a média aritmética dos valores observados",
   "o quadrado da variância",
   "a diferença entre o maior e o menor valor",
   "a diferença entre a média e a mediana",
   "a raiz quadrada da variância, expresso na mesma unidade dos dados"
  ],
  "answer": 4,
  "explanation": "O desvio padrão é, por definição, a raiz quadrada positiva da variância. Como a variância é calculada com desvios elevados ao quadrado, sua unidade é a dos dados ao quadrado (min², R$²), e a raiz devolve o resultado à unidade original, o que facilita a interpretação. A média aritmética é uma medida de posição. O quadrado da variância não tem esse papel. A diferença entre o maior e o menor valor é a amplitude. A diferença entre média e mediana não é medida de dispersão padronizada.",
  "lawRef": "Desvio padrão = raiz quadrada da variância"
 },
 {
  "id": "rlm-m15-autoral-14",
  "origem": "autoral-ia",
  "q": "Considere a população formada pelos valores 2, 4 e 6, cuja média é 4. A variância populacional (divisor N) é:",
  "options": [
   "2",
   "8/3",
   "4",
   "8",
   "16"
  ],
  "answer": 1,
  "explanation": "Desvios em relação à média 4: −2, 0 e +2. Quadrados: 4, 0 e 4, somando 8. Como se trata de população, divide-se por N = 3, e a variância é 8/3 ≈ 2,67. A alternativa 4 é a variância amostral (divisor n − 1 = 2), que não se aplica porque o enunciado trata de população. A de 8 é a soma dos quadrados dos desvios, sem dividir. A de 2 é o maior desvio absoluto em relação à média (a média dos desvios absolutos seria 4/3). A de 16 é o quadrado da média.",
  "lawRef": "Variância populacional"
 },
 {
  "id": "rlm-m15-autoral-15",
  "origem": "autoral-ia",
  "q": "Os tempos de uma população de oito atendimentos, em minutos, são 2, 4, 4, 4, 5, 5, 7 e 9. O desvio padrão populacional é:",
  "options": [
   "4",
   "2,14",
   "32",
   "2",
   "5"
  ],
  "answer": 3,
  "explanation": "A média é 40/8 = 5. Os desvios são −3, −1, −1, −1, 0, 0, +2 e +4, e seus quadrados somam 9 + 1 + 1 + 1 + 0 + 0 + 4 + 16 = 32. A variância populacional é 32/8 = 4 e o desvio padrão é a raiz, √4 = 2 minutos. A alternativa 4 é a variância, não o desvio padrão. A de 2,14 é o desvio padrão amostral (√(32/7)), que usa o divisor n − 1 e não se aplica a população. A de 32 é a soma dos quadrados dos desvios, e a de 5 é a média.",
  "lawRef": "Desvio padrão populacional"
 },
 {
  "id": "rlm-m15-autoral-16",
  "origem": "autoral-ia",
  "q": "Para os valores 3, 5 e 7, de média 5, o desvio médio absoluto em relação à média é:",
  "options": [
   "8/3",
   "1",
   "2",
   "4",
   "4/3"
  ],
  "answer": 4,
  "explanation": "O desvio médio absoluto é a média dos módulos dos desvios em relação à média. Desvios: 3 − 5 = −2, 5 − 5 = 0 e 7 − 5 = 2; módulos: 2, 0 e 2, somando 4. Dividindo por 3 valores: 4/3 ≈ 1,33. A alternativa 8/3 é a variância populacional, que usa quadrados dos desvios (4 + 0 + 4 = 8, dividido por 3). A de 4 é a soma dos módulos, sem dividir. A de 2 é o maior desvio absoluto, e a de 1 não corresponde a nenhuma etapa do cálculo.",
  "lawRef": "Desvio médio absoluto"
 },
 {
  "id": "rlm-m15-autoral-17",
  "origem": "autoral-ia",
  "q": "Um abono fixo de R$ 200,00 é concedido a todos os servidores de um órgão. Em relação ao desvio padrão dos salários, após o abono ele:",
  "options": [
   "aumenta R$ 200,00",
   "fica multiplicado por 200",
   "permanece igual",
   "diminui R$ 200,00",
   "torna-se zero"
  ],
  "answer": 2,
  "explanation": "Somar uma constante a todos os dados desloca a média pelo mesmo valor, mas não altera as distâncias entre cada dado e a média: os desvios continuam iguais, assim como a variância e o desvio padrão. Por isso o desvio padrão permanece igual. Ele não aumenta R$ 200,00 (isso valeria para a média), não é multiplicado por 200 (isso só ocorreria se os salários fossem multiplicados, e não somados) e também não diminui. Só se tornaria zero se todos os salários fossem iguais.",
  "lawRef": "Propriedades: translação não altera a dispersão"
 },
 {
  "id": "rlm-m15-autoral-18",
  "origem": "autoral-ia",
  "q": "Uma amostra de três valores é 1, 3 e 5, com média 3. A variância amostral (divisor n − 1) é:",
  "options": [
   "4",
   "8/3",
   "2",
   "3",
   "8"
  ],
  "answer": 0,
  "explanation": "Desvios em relação à média 3: −2, 0 e +2. Quadrados: 4, 0 e 4, somando 8. Como o enunciado pede a variância amostral, o divisor é n − 1 = 2, e a variância é 8/2 = 4. A alternativa 8/3 é a variância populacional (divisor N = 3), que não é a pedida. A de 8 é a soma dos quadrados sem dividir. A de 2 é a divisão de 4 por 2, ou o maior desvio, sem corresponder à fórmula. A de 3 é a própria média.",
  "lawRef": "Variância amostral (divisor n − 1)"
 },
 {
  "id": "rlm-m15-autoral-19",
  "origem": "autoral-ia",
  "q": "Uma população tem variância 9. Se todos os dados forem multiplicados por 2, a nova variância será:",
  "options": [
   "18",
   "36",
   "9",
   "6",
   "81"
  ],
  "answer": 1,
  "explanation": "A variância é medida em unidades ao quadrado, então multiplicar todos os dados por uma constante k multiplica a variância por k². Com k = 2, a nova variância é 9 × 2² = 36. Em termos do desvio padrão, ele passa de 3 para 6 (multiplica por 2), e 6² = 36. A alternativa 18 multiplica a variância por 2, esquecendo o quadrado. A de 6 é o novo desvio padrão, e não a variância. A de 9 supõe que a variância não muda. A de 81 eleva a variância original ao quadrado.",
  "lawRef": "Variância e mudança de escala: k²"
 },
 {
  "id": "rlm-m15-autoral-20",
  "origem": "autoral-ia",
  "q": "A população formada pelos valores 2, 2, 6 e 6 tem média 4. O desvio padrão populacional é:",
  "options": [
   "4",
   "2,31",
   "16",
   "2",
   "8"
  ],
  "answer": 3,
  "explanation": "Os desvios em relação à média 4 são −2, −2, +2 e +2, cujos quadrados somam 4 + 4 + 4 + 4 = 16. A variância populacional é 16/4 = 4, e o desvio padrão é √4 = 2. A alternativa 4 é a variância. A de 2,31 é o desvio padrão amostral (√(16/3)), que usa n − 1 e não se aplica a uma população. A de 16 é a soma dos quadrados, sem dividir. A de 8 é a soma dos módulos dos desvios (2 + 2 + 2 + 2).",
  "lawRef": "Desvio padrão populacional"
 }
];
