/* Base Completa | Raciocínio Lógico-Matemático M08 (Sequências e Padrões Lógicos): dez questões originais autorais e comentadas.
 * Não são questões reais de bancas. Escritas em 11/11/2026 no nível de prova (5 alternativas),
 * com gabarito equilibrado (A–E, duas vezes cada); cada lei citada traz o nome e cada artigo, o que ele diz.
 * Fontes: Raciocínio lógico-matemático: progressão aritmética (a_n = a_1 + (n−1)r), progressão geométrica (a_n = a_1·q^(n−1)), sequências alternadas e intercaladas, ciclos e resto da divisão, diferenças de segunda ordem, sequências alfabéticas, transformações figurais e unicidade da lei de formação.
 */
window.BC_RLM_AUTHORIAL_OVERRIDES=window.BC_RLM_AUTHORIAL_OVERRIDES||{};
window.BC_RLM_AUTHORIAL_OVERRIDES[8]=[
  {
    "id": "rlm-m08-autoral-01",
    "q": "Um tribunal digitaliza, a cada dia, uma quantidade de processos que cresce em valor constante de um dia para o seguinte. No 5º dia foram digitalizados 23 processos e, no 12º dia, 58 processos. Considerando os 20 primeiros dias, quantos processos foram digitalizados no total?",
    "options": [
      "1010",
      "1060",
      "1113",
      "1960",
      "2020"
    ],
    "answer": 0,
    "explanation": "Os valores formam uma PA, pois o acréscimo diário é constante. Entre o 5º e o 12º dia há 7 passos e a diferença é 58 − 23 = 35, logo a razão é r = 35 ÷ 7 = 5. O primeiro termo é a_1 = a_5 − 4r = 23 − 20 = 3. O 20º termo é a_20 = a_1 + 19r = 3 + 95 = 98. A soma dos 20 primeiros termos é S = 20 × (3 + 98) ÷ 2 = 1010. As respostas erradas vêm de falhas típicas: 1060 usa a_20 = a_1 + 20r (103), contando um passo a mais; 1113 soma 21 termos; 1960 multiplica 20 pelo último termo (98), sem usar a média entre o primeiro e o último; 2020 esquece de dividir por 2 na fórmula da soma.",
    "lawRef": "Progressão aritmética — razão, termo geral e soma dos n primeiros termos",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "rlm-m08-autoral-02",
    "q": "O número de tentativas de acesso indevido registradas por um sistema, em cada hora, forma uma progressão geométrica de razão positiva. Na 3ª hora foram registradas 12 tentativas e, na 6ª hora, 96. Quantas tentativas foram registradas, ao todo, nas 6 primeiras horas?",
    "options": [
      "93",
      "189",
      "192",
      "381",
      "756"
    ],
    "answer": 1,
    "explanation": "Entre a 3ª e a 6ª hora há três passos, logo a razão q satisfaz q³ = 96 ÷ 12 = 8, e como a razão é positiva, q = 2. O primeiro termo é a_1 = 12 ÷ q² = 12 ÷ 4 = 3. A sequência é 3, 6, 12, 24, 48, 96. Pela fórmula da soma, S_6 = a_1 × (q⁶ − 1) ÷ (q − 1) = 3 × 63 = 189 (conferindo: 3 + 6 + 12 + 24 + 48 + 96 = 189). O erro 93 é a soma das 5 primeiras horas; 192 é o 7º termo (96 × 2), e não a soma; 381 é a soma de 7 termos; 756 resulta de tratar o 3º termo (12) como se fosse o primeiro: 12 × 63.",
    "lawRef": "Progressão geométrica — razão, termo inicial e soma dos n primeiros termos",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "rlm-m08-autoral-03",
    "q": "Considere a sequência 5, 6, 9, 12, 13, 24, 17, 48, 21, 96, ..., cuja lei de formação se mantém indefinidamente. A soma do 15º com o 16º termo dessa sequência é:",
    "options": [
      "225",
      "417",
      "801",
      "805",
      "829"
    ],
    "answer": 2,
    "explanation": "A sequência é intercalada. Nas posições ímpares estão 5, 9, 13, 17, 21, ..., uma PA de razão 4; nas posições pares estão 6, 12, 24, 48, 96, ..., uma PG de razão 2. O 15º termo é o 8º da PA: 5 + 7 × 4 = 33. O 16º termo é o 8º da PG: 6 × 2⁷ = 768. A soma é 33 + 768 = 801. Os erros comuns envolvem o índice dentro de cada subsequência (o termo de posição 15 é o 8º ímpar, e não o 15º, e o de posição 16 é o 8º par): 805 usa 5 + 8 × 4 = 37 no lugar de 33; 829 usa 61 no lugar de 33 (o 15º termo da PA); 417 e 225 erram o expoente da PG (6 × 2⁶ = 384 e 6 × 2⁵ = 192, somados a 33). Separe sempre as posições ímpares e pares antes de procurar a regra.",
    "lawRef": "Sequência intercalada — PA nas posições ímpares e PG nas pares",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "rlm-m08-autoral-04",
    "q": "Considere a sequência de letras formada pela repetição indefinida da palavra TRIBUNAL, isto é, T, R, I, B, U, N, A, L, T, R, I, B, U, N, A, L, T, R, ... Entre as 2026 primeiras letras dessa sequência, quantas vezes aparece a letra R?",
    "options": [
      "253",
      "254",
      "255",
      "256",
      "506"
    ],
    "answer": 1,
    "explanation": "A sequência tem ciclo de 8 letras, e a letra R ocupa a 2ª posição de cada ciclo. Dividindo 2026 por 8, obtém-se quociente 253 e resto 2 (253 × 8 = 2024). Os 253 ciclos completos contêm 253 letras R. As 2 letras restantes são as duas primeiras do ciclo seguinte, T e R, o que acrescenta mais uma letra R. Logo são 253 + 1 = 254. A alternativa 253 considera só os ciclos completos, ignorando o resto; 255 e 256 exageram o acréscimo; 506 supõe, sem base, duas letras R por ciclo. O resto da divisão indica onde o último ciclo termina: resto 2 significa que o ciclo parcial inclui apenas as duas primeiras letras.",
    "lawRef": "Ciclos — quociente e resto da divisão para contar ocorrências",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "rlm-m08-autoral-05",
    "q": "Considere a sequência 3, 4, 7, 12, 19, 28, ..., na qual as diferenças entre termos consecutivos formam uma progressão aritmética. O 15º termo dessa sequência é:",
    "options": [
      "172",
      "196",
      "199",
      "202",
      "228"
    ],
    "answer": 2,
    "explanation": "Calculando as diferenças, obtém-se 1, 3, 5, 7, 9, ..., uma PA de razão 2 (o enunciado garante que ela se mantém). A diferença que leva do termo n ao termo n + 1 é 2n − 1. Somando as diferenças de 1 a n − 1 (soma dos primeiros ímpares), tem-se a_n = 3 + (n − 1)². Conferindo: a_6 = 3 + 25 = 28. Para n = 15: a_15 = 3 + 14² = 3 + 196 = 199. Os erros típicos: 172 usa 13² + 3, ou seja, deixa o índice atrasado em um; 196 esquece de somar o primeiro termo 3; 228 usa 15² + 3, adiantando o índice; 202 soma o 3 duas vezes. Quando as diferenças não são constantes, estude as diferenças das diferenças.",
    "lawRef": "Diferenças de segunda ordem — diferenças em progressão aritmética",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "rlm-m08-autoral-06",
    "q": "Considere o alfabeto de 26 letras (A = 1, B = 2, ..., Z = 26), que recomeça em A depois do Z. Na sequência de letras A, C, F, J, O, ..., cada letra avança no alfabeto um número de posições que cresce uma unidade a cada passo. A sétima letra dessa sequência é:",
    "options": [
      "A",
      "Z",
      "C",
      "B",
      "U"
    ],
    "answer": 3,
    "explanation": "Associe cada letra à sua posição: A = 1, C = 3, F = 6, J = 10, O = 15. Os saltos são 2, 3, 4, 5, logo o próximo salto é 6 (O → U, posição 21) e o seguinte, 7. A sexta letra é U (21) e a sétima tem posição 21 + 7 = 28. Como o alfabeto tem 26 letras e recomeça, subtrai-se 26: 28 − 26 = 2, que corresponde à letra B. A resposta U é a sexta letra, e não a sétima; Z pararia a contagem na última posição do alfabeto, sem recomeçar; A e C resultam de contar o alfabeto como se tivesse 27 ou 25 letras (28 − 27 = 1; 28 − 25 = 3). Em sequências alfabéticas, lembre sempre do ciclo de 26 letras.",
    "lawRef": "Sequência alfabética — saltos crescentes e ciclo de 26 letras",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "rlm-m08-autoral-07",
    "q": "Uma seta é desenhada inicialmente apontando para o norte, na cor preta. A cada passo da sequência, a seta gira 135° no sentido horário e inverte sua cor (preta vira branca e branca vira preta). Após 25 passos, a seta estará apontando para:",
    "options": [
      "o sudeste, na cor preta.",
      "o oeste, na cor preta.",
      "o norte, na cor preta.",
      "o sudoeste, na cor branca.",
      "o sudeste, na cor branca."
    ],
    "answer": 4,
    "explanation": "Duas transformações independentes precisam ser acompanhadas. A rotação acumulada em 25 passos é 25 × 135° = 3375°. Como 360° é uma volta completa, 3375 ÷ 360 dá 9 voltas (3240°) e resto 135°; a seta aponta 135° no sentido horário a partir do norte, isto é, para o sudeste (leste a 90°, sudeste a 135°). Quanto à cor, ela se inverte a cada passo; como 25 é ímpar, termina na cor oposta à inicial: branca. A alternativa A acerta a direção mas esquece a cor; B corresponde a 26 passos na direção (3510° ≡ 270°) e C a 24 passos (3240° ≡ 0°, norte, em que a cor ainda é preta); D gira no sentido anti-horário (−135° ≡ 225°, sudoeste). A figura deve obedecer a todas as dimensões observadas, não só a uma.",
    "lawRef": "Sequência figural — rotação acumulada (resto por 360°) e alternância de cor",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "rlm-m08-autoral-08",
    "q": "Os três primeiros termos de uma sequência são 1, 2, 4. Com base apenas nessas informações, assinale a afirmação correta.",
    "options": [
      "O 4º termo é necessariamente 8, pois a sequência é uma PG de razão 2.",
      "O 4º termo é necessariamente 6, pois cada termo aumenta de 2 unidades.",
      "O 4º termo é necessariamente 7, pois as diferenças crescem uma unidade.",
      "Mais de uma lei de formação é compatível com os termos dados; sem a regra, a continuação não é única.",
      "Nenhuma lei de formação é compatível, pois a sequência não é PA nem PG."
    ],
    "answer": 3,
    "explanation": "Um trecho finito costuma admitir mais de uma regra de continuação, e reconhecer um padrão plausível não demonstra que ele seja o único possível. Aqui, 1, 2, 4 é compatível com a PG de razão 2, que daria 8, mas também com a regra \"as diferenças entre termos consecutivos crescem 1 a cada passo\" (diferenças 1, 2, 3, ...), que daria 4 + 3 = 7. Logo A e C afirmam como necessário algo que é só uma possibilidade. B é falsa: os termos não aumentam de 2 em 2 (a diferença entre 1 e 2 é 1). E também é falsa: 1, 2, 4 é uma PG de razão 2, e existem leis compatíveis. Em provas, a banca costuma informar a lei de formação ou deixá-la clara pelo contexto; sem isso, apenas a alternativa que reconhece a não unicidade é logicamente sustentável.",
    "lawRef": "Padrões — a lei de formação não é única a partir de poucos termos",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "rlm-m08-autoral-09",
    "q": "Em uma figura, bolinhas são dispostas em forma de triângulo. A 1ª figura tem 1 bolinha, a 2ª tem 3, a 3ª tem 6 e a 4ª tem 10; cada figura nova acrescenta à anterior uma linha com uma bolinha a mais do que a linha acrescentada na figura anterior. Quantas bolinhas terá a 20ª figura?",
    "options": [
      "210",
      "231",
      "400",
      "420",
      "441"
    ],
    "answer": 0,
    "explanation": "A figura n tem uma linha a mais que a anterior, e essa linha nova tem n bolinhas: 1, 1 + 2 = 3, 1 + 2 + 3 = 6, 1 + 2 + 3 + 4 = 10. Logo a figura n tem a soma dos n primeiros números naturais, que é a soma da PA 1, 2, ..., n, igual a n × (n + 1) ÷ 2. Para n = 20: 20 × 21 ÷ 2 = 210. Os erros típicos: 231 é a 21ª figura (21 × 22 ÷ 2); 420 esquece de dividir por 2; 400 e 441 tratam a contagem como quadrados (20² e 21²), regra que serve para outro padrão (1, 4, 9, 16); a regra deve explicar os termos dados (1, 3, 6, 10), o que o padrão dos quadrados não faz. Conferindo pelas diferenças: 2, 3, 4 ... crescem de 1 em 1, como na regra.",
    "lawRef": "Padrão figural — números triangulares (diferenças crescentes)",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "rlm-m08-autoral-10",
    "q": "Considere a sequência 2, 7, 5, 4, 9, 10, 6, 11, 15, 8, 13, 20, ..., cuja lei de formação se mantém. A soma dos termos que ocupam as posições 29, 30 e 31 é:",
    "options": [
      "90",
      "92",
      "93",
      "95",
      "97"
    ],
    "answer": 4,
    "explanation": "A sequência é formada por três subsequências intercaladas, conforme o resto da divisão da posição por 3. Posições 1, 4, 7, 10, ...: 2, 4, 6, 8, ..., ou seja, o termo é o dobro de k, em que k é a ordem dentro da subsequência. Posições 2, 5, 8, 11, ...: 7, 9, 11, 13, ... (PA de razão 2, começando em 7). Posições 3, 6, 9, 12, ...: 5, 10, 15, 20, ... (múltiplos de 5). A posição 29 deixa resto 2 e é o 10º termo da segunda subsequência: 7 + 9 × 2 = 25. A posição 30 deixa resto 0 e é o 10º múltiplo de 5: 50. A posição 31 deixa resto 1 e é o 11º termo da primeira: 22. A soma é 25 + 50 + 22 = 97. Os valores 90, 92, 93 e 95 vêm de errar em uma unidade a ordem de algum termo dentro da subsequência: 92 usa 45 no lugar de 50; 95 usa 20 no lugar de 22 (ou 23 no lugar de 25); 93 combina esses dois últimos erros; 90 combina um deles com o 45.",
    "lawRef": "Três subsequências intercaladas — classificação da posição pelo resto na divisão por 3",
    "provenance": "questao-autoral-IA-revisada"
  }
];
