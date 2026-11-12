/* Base Completa | Raciocínio Lógico-Matemático M10 (Fundamentos Matemáticos): dez questões originais autorais e comentadas.
 * Não são questões reais de bancas. Escritas em 11/11/2026 no nível de prova (5 alternativas),
 * com gabarito equilibrado (A–E, duas vezes cada); cada lei citada traz o nome e cada artigo, o que ele diz.
 * Fontes: Conteúdo do módulo: operações e sinais, ordem das operações, frações e decimais, potências, divisibilidade, MDC e MMC, equações do 1º grau e conversão de unidades.
 */
window.BC_RLM_AUTHORIAL_OVERRIDES=window.BC_RLM_AUTHORIAL_OVERRIDES||{};
window.BC_RLM_AUTHORIAL_OVERRIDES[10]=[
  {
    "id": "rlm-m10-autoral-01",
    "q": "O valor da expressão 48 ÷ 6 × 2 − 3 × (7 − 2)² ÷ 5 + 2³ é:",
    "options": [
      "7",
      "−3",
      "9",
      "22,2",
      "73"
    ],
    "answer": 2,
    "explanation": "Respeitando a ordem das operações: primeiro o parêntese, (7 − 2) = 5; depois potências, 5² = 25 e 2³ = 8; depois multiplicações e divisões, da esquerda para a direita: 48 ÷ 6 × 2 = 8 × 2 = 16 e 3 × 25 ÷ 5 = 75 ÷ 5 = 15; por fim, somas e subtrações: 16 − 15 + 8 = 9. Os erros mais comuns: fazer a multiplicação antes da divisão (48 ÷ 12 = 4, que dá 4 − 15 + 8 = −3); aplicar o expoente só ao 2 (7 − 2² = 3, que dá 22,2); calcular 2³ como 2 × 3 = 6 (16 − 15 + 6 = 7); e resolver tudo da esquerda para a direita, sem prioridades (que dá 73).",
    "lawRef": "Ordem das operações — parênteses, potências, multiplicação/divisão (esquerda para a direita), adição/subtração",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "rlm-m10-autoral-02",
    "q": "Em uma prova de 60 questões, cada acerto vale +4 pontos, cada erro vale −1 ponto e a questão em branco vale 0. Um candidato deixou 5 questões em branco e obteve 145 pontos. O número de questões que ele errou foi:",
    "options": [
      "15",
      "25",
      "19",
      "40",
      "20"
    ],
    "answer": 0,
    "explanation": "Como 5 questões ficaram em branco, o candidato respondeu 55. Sendo a os acertos e e os erros: a + e = 55 e 4a − e = 145. Somando as duas equações, 5a = 200, logo a = 40 e e = 55 − 40 = 15. Conferência: 4 × 40 − 15 = 145. Quem esquece as questões em branco e usa a + e = 60 obtém a = 41 e e = 19. Quem trata o erro como +1 (erro de sinal) chega a a = 30 e e = 25. A resposta 40 é o número de acertos, não de erros, e 20 resulta de contar as 5 em branco como erros (60 − 40).",
    "lawRef": "Sistema de equações do 1º grau com números inteiros — jogo de sinais",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "rlm-m10-autoral-03",
    "q": "Três rolos de fita medem 252 m, 420 m e 588 m. Deseja-se cortá-los em pedaços de comprimentos iguais, o maior possível, sem deixar sobra. O número total de pedaços obtidos é:",
    "options": [
      "30",
      "84",
      "105",
      "45",
      "15"
    ],
    "answer": 4,
    "explanation": "O maior comprimento possível é o MDC. Fatorando: 252 = 2² · 3² · 7; 420 = 2² · 3 · 5 · 7; 588 = 2² · 3 · 7². Os fatores comuns com menor expoente são 2², 3 e 7, logo MDC = 4 · 3 · 7 = 84 m. Os pedaços são 252 ÷ 84 = 3, 420 ÷ 84 = 5 e 588 ÷ 84 = 7, total de 15. O valor 84 é o comprimento do pedaço, e não a quantidade pedida. As demais alternativas vêm de um MDC incompleto: com 42 m teríamos 6 + 10 + 14 = 30 pedaços; com 28 m, 9 + 15 + 21 = 45; com 12 m, 21 + 35 + 49 = 105. Nesses casos o pedaço não é o maior possível.",
    "lawRef": "MDC — divisão em grupos iguais do maior tamanho possível",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "rlm-m10-autoral-04",
    "q": "Três linhas de ônibus partem do mesmo terminal a cada 12, 15 e 20 minutos, respectivamente. Os três veículos saíram juntos às 6h40, e essa foi a primeira saída simultânea contada. A sexta saída simultânea ocorrerá às:",
    "options": [
      "12h40",
      "11h40",
      "9h10",
      "21h40",
      "10h40"
    ],
    "answer": 1,
    "explanation": "As saídas coincidem a cada MMC(12, 15, 20) minutos. Fatorando: 12 = 2² · 3; 15 = 3 · 5; 20 = 2² · 5. O MMC usa os maiores expoentes de todos os fatores: 2² · 3 · 5 = 60 minutos. A primeira coincidência é às 6h40; a sexta ocorre depois de 5 intervalos (e não 6), ou seja, 5 × 60 = 300 minutos = 5 horas depois: 11h40. Erros típicos: contar 6 intervalos leva a 12h40; calcular o MMC como 30 dá 5 × 30 = 150 min e 9h10; multiplicar 12 × 15 e usar 180 min dá 5 × 180 = 900 min e 21h40; contar apenas 4 intervalos dá 10h40.",
    "lawRef": "MMC — coincidência de ciclos; contagem de intervalos (n-ésima ocorrência = n − 1 intervalos)",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "rlm-m10-autoral-05",
    "q": "Sendo 5A3B um número de quatro algarismos (A e B são algarismos) divisível por 45, a soma de todos os números 5A3B que satisfazem essa condição é:",
    "options": [
      "5.130",
      "59.976",
      "32.895",
      "10.665",
      "5.535"
    ],
    "answer": 3,
    "explanation": "Como 45 = 5 × 9 e 5 e 9 são primos entre si, o número deve ser divisível por 5 e por 9 ao mesmo tempo. Por 5: B = 0 ou B = 5. Por 9: a soma dos algarismos, 5 + A + 3 + B, deve ser múltipla de 9. Com B = 0: 8 + A = 9 dá A = 1 (A = 10 não existe), número 5.130. Com B = 5: 13 + A = 18 dá A = 5, número 5.535. A soma é 5.130 + 5.535 = 10.665. Quem usa 15 em vez de 45 (múltiplo de 3 e de 5) encontra seis números e soma 32.895; quem exige só divisibilidade por 9 encontra onze números (soma 59.976); as opções 5.130 e 5.535 contam apenas um dos dois números.",
    "lawRef": "Critérios de divisibilidade por 5 e por 9 (45 = 5 × 9)",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "rlm-m10-autoral-06",
    "q": "Ana tem o dobro da idade de Beto. Há 4 anos, a idade de Ana era o triplo da idade de Beto. A soma das idades dos dois daqui a 5 anos será:",
    "options": [
      "34",
      "24",
      "29",
      "26",
      "32"
    ],
    "answer": 0,
    "explanation": "Seja b a idade atual de Beto; a de Ana é 2b. Há 4 anos: 2b − 4 = 3(b − 4), isto é, 2b − 4 = 3b − 12, logo b = 8 e Ana tem 16 anos. Conferência: há 4 anos eles tinham 12 e 4, e 12 = 3 × 4. Daqui a 5 anos terão 21 e 13, e a soma é 34. A resposta 24 é a soma das idades de hoje; 29 aparece quando se acrescenta 5 uma só vez, em vez de 5 para cada pessoa (24 + 5); 32 resulta de usar 4 anos, e não 5, para cada um (24 + 8); e 26 é a soma das idades de quatro anos atrás (12 + 4 = 16) acrescida de 5 para cada um (16 + 10).",
    "lawRef": "Equação do 1º grau — problemas de idades (a diferença de tempo vale para cada pessoa)",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "rlm-m10-autoral-07",
    "q": "Uma torneira com defeito goteja 45 mL a cada 90 segundos. Mantido o ritmo constante, o volume desperdiçado em 8 horas é de:",
    "options": [
      "1,44 L",
      "14,4 L",
      "21,6 L",
      "144 L",
      "14.400 L"
    ],
    "answer": 1,
    "explanation": "O ritmo é 45 mL ÷ 90 s = 0,5 mL por segundo. Em 8 horas há 8 × 3.600 = 28.800 segundos, e o volume é 0,5 × 28.800 = 14.400 mL. Como 1 litro = 1.000 mL, isso equivale a 14,4 L. Os erros vêm das unidades: deixar o resultado em mL e chamá-lo de litros dá 14.400 L; errar a casa decimal na conversão dá 144 L ou 1,44 L; e tratar 45 mL como sendo por minuto (45 × 480 = 21.600 mL) dá 21,6 L, porque os 90 segundos foram lidos como 60.",
    "lawRef": "Conversão de unidades (tempo e volume) antes do cálculo; taxa por segundo",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "rlm-m10-autoral-08",
    "q": "O valor de (0,375 + 1/4) ÷ (5/6 − 1/3) é:",
    "options": [
      "5/16",
      "15/32",
      "8",
      "5/8",
      "5/4"
    ],
    "answer": 4,
    "explanation": "Primeiro, 0,375 = 375/1000 = 3/8, e 3/8 + 1/4 = 3/8 + 2/8 = 5/8. Depois, 5/6 − 1/3 = 5/6 − 2/6 = 3/6 = 1/2. A divisão equivale a multiplicar pelo inverso: 5/8 ÷ 1/2 = 5/8 × 2 = 10/8 = 5/4. Erros comuns: multiplicar em vez de multiplicar pelo inverso (5/8 × 1/2 = 5/16); subtrair numeradores e denominadores separadamente (5/6 − 1/3 = 4/3) e dividir 5/8 ÷ 4/3 = 15/32; ler 0,375 como 375/100 = 15/4, o que dá 8; e parar no numerador, 5/8, esquecendo a divisão.",
    "lawRef": "Operações com frações e decimais — denominador comum e divisão pelo inverso",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "rlm-m10-autoral-09",
    "q": "O valor da expressão (2⁷ · 4³) ÷ 8⁴ − (−2)³ + 3 · 2⁰ é:",
    "options": [
      "75",
      "−3",
      "13",
      "10",
      "16"
    ],
    "answer": 2,
    "explanation": "Reduza tudo à base 2: 4³ = (2²)³ = 2⁶ e 8⁴ = (2³)⁴ = 2¹². Então (2⁷ · 2⁶) ÷ 2¹² = 2¹³ ÷ 2¹² = 2. Em seguida, (−2)³ = −8 (expoente ímpar mantém o sinal negativo), e subtrair −8 equivale a somar 8. Por fim, 2⁰ = 1, logo 3 · 2⁰ = 3. Total: 2 + 8 + 3 = 13. Erros comuns: tratar −(−2)³ como −8, o que dá 2 − 8 + 3 = −3; usar 2⁰ = 0, o que dá 10; usar 2⁰ = 2, o que dá 16; e cortar as bases sem converter (2⁷ · 2³ ÷ 2⁴ = 64), o que dá 64 + 8 + 3 = 75.",
    "lawRef": "Potências — propriedades do produto e do quociente de mesma base; sinal com expoente ímpar; a⁰ = 1",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "rlm-m10-autoral-10",
    "q": "Um tanque estava com 3/5 de sua capacidade. Consumiu-se 1/3 do conteúdo que havia e, em seguida, acrescentaram-se 20 litros, o que deixou o tanque com 4/5 da capacidade. A capacidade total do tanque, em litros, é:",
    "options": [
      "25",
      "37,5",
      "100",
      "50",
      "40"
    ],
    "answer": 3,
    "explanation": "Seja C a capacidade. Havia 3/5 de C; consumir 1/3 do conteúdo deixa 2/3 do conteúdo, isto é, 2/3 × 3/5 = 2/5 de C. Depois de acrescentar 20 L, o tanque tem 4/5 de C. Logo, 20 L correspondem a 4/5 − 2/5 = 2/5 de C, e C = 20 ÷ 2/5 = 50 L. Conferência: 3/5 de 50 = 30 L; consome-se 10 L; restam 20 L; com mais 20 L há 40 L, que é 4/5 de 50. Erros: ignorar o consumo (20 L = 4/5 − 3/5 = 1/5 de C) dá 100; tomar 1/3 da capacidade, e não do conteúdo, dá 37,5; tomar metade do conteúdo dá 40; e supor que 20 L equivalem aos 4/5 dá 25.",
    "lawRef": "Frações do restante — atualizar a base a cada etapa; equação do 1º grau",
    "provenance": "questao-autoral-IA-revisada"
  }
];
