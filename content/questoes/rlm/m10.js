/* Banco de questões — Raciocínio Lógico-Matemático, módulo 10. Questões autorais (não são de banca).
 * Para acrescentar questões, veja content/questoes/LEIAME.md e rode "npm run questoes:check". */
window.BC_QUESTOES=window.BC_QUESTOES||{};
(window.BC_QUESTOES.rlm=window.BC_QUESTOES.rlm||{})[10]=[
 {
  "id": "rlm-m10-autoral-01",
  "origem": "autoral-ia",
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
  "lawRef": "Ordem das operações — parênteses, potências, multiplicação/divisão (esquerda para a direita), adição/subtração"
 },
 {
  "id": "rlm-m10-autoral-02",
  "origem": "autoral-ia",
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
  "lawRef": "Sistema de equações do 1º grau com números inteiros — jogo de sinais"
 },
 {
  "id": "rlm-m10-autoral-03",
  "origem": "autoral-ia",
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
  "lawRef": "MDC — divisão em grupos iguais do maior tamanho possível"
 },
 {
  "id": "rlm-m10-autoral-04",
  "origem": "autoral-ia",
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
  "lawRef": "MMC — coincidência de ciclos; contagem de intervalos (n-ésima ocorrência = n − 1 intervalos)"
 },
 {
  "id": "rlm-m10-autoral-05",
  "origem": "autoral-ia",
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
  "lawRef": "Critérios de divisibilidade por 5 e por 9 (45 = 5 × 9)"
 },
 {
  "id": "rlm-m10-autoral-06",
  "origem": "autoral-ia",
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
  "lawRef": "Equação do 1º grau — problemas de idades (a diferença de tempo vale para cada pessoa)"
 },
 {
  "id": "rlm-m10-autoral-07",
  "origem": "autoral-ia",
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
  "lawRef": "Conversão de unidades (tempo e volume) antes do cálculo; taxa por segundo"
 },
 {
  "id": "rlm-m10-autoral-08",
  "origem": "autoral-ia",
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
  "lawRef": "Operações com frações e decimais — denominador comum e divisão pelo inverso"
 },
 {
  "id": "rlm-m10-autoral-09",
  "origem": "autoral-ia",
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
  "lawRef": "Potências — propriedades do produto e do quociente de mesma base; sinal com expoente ímpar; a⁰ = 1"
 },
 {
  "id": "rlm-m10-autoral-10",
  "origem": "autoral-ia",
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
  "lawRef": "Frações do restante — atualizar a base a cada etapa; equação do 1º grau"
 },
 {
  "id": "rlm-m10-autoral-11",
  "origem": "autoral-ia",
  "q": "No setor de arquivo, o valor da expressão 8 − 3 × 2 + 12 ÷ 4 é calculado por um servidor. Qual é o resultado correto?",
  "options": [
   "13",
   "5,5",
   "2",
   "5",
   "14"
  ],
  "answer": 3,
  "explanation": "Pela ordem das operações, multiplicações e divisões vêm antes de somas e subtrações: 3 × 2 = 6 e 12 ÷ 4 = 3. Depois, 8 − 6 + 3 = 5. Erros comuns: fazer 8 − 3 primeiro (5 × 2 = 10, mais 3, dá 13); resolver tudo da esquerda para a direita, sem prioridades ((8 − 3) × 2 + 12) ÷ 4 = 5,5; esquecer a divisão e parar em 8 − 6 = 2; ou somar 12 sem dividir por 4, obtendo 8 − 6 + 12 = 14. Só 5 respeita a hierarquia das operações.",
  "lawRef": "Ordem das operações"
 },
 {
  "id": "rlm-m10-autoral-12",
  "origem": "autoral-ia",
  "q": "Um servidor gastou 1/2 do expediente em atendimento ao público e 1/4 do expediente em triagem de documentos. A fração do expediente ocupada pelas duas atividades juntas é:",
  "options": [
   "3/4",
   "2/6",
   "1/6",
   "2/4",
   "1/8"
  ],
  "answer": 0,
  "explanation": "Para somar frações é preciso denominador comum. O MMC de 2 e 4 é 4, então 1/2 = 2/4. Somando: 2/4 + 1/4 = 3/4 do expediente. Erros comuns: somar numeradores e denominadores separadamente (1+1)/(2+4) = 2/6, que não é a regra de soma de frações; multiplicar as frações (1/2 × 1/4 = 1/8); somar só os numeradores mantendo o primeiro denominador (2/4, igual a 1/2, que ignora o 1/4); e 1/6, que não resulta de operação correta com essas frações. A soma correta mantém o denominador comum e soma só os numeradores.",
  "lawRef": "Soma de frações com denominadores diferentes"
 },
 {
  "id": "rlm-m10-autoral-13",
  "origem": "autoral-ia",
  "q": "O menor número inteiro positivo que é divisível ao mesmo tempo por 4 e por 6 é:",
  "options": [
   "2",
   "6",
   "8",
   "24",
   "12"
  ],
  "answer": 4,
  "explanation": "Procura-se o MMC (mínimo múltiplo comum) de 4 e 6. Múltiplos de 4: 4, 8, 12, 16, 20, 24... Múltiplos de 6: 6, 12, 18, 24... O primeiro valor que aparece nas duas listas é 12. Por decomposição: 4 = 2² e 6 = 2 × 3; o MMC usa os fatores comuns e não comuns com o maior expoente, 2² × 3 = 12. Erros: 2 é o MDC (maior divisor comum), não o MMC; 6 não é divisível por 4 e 8 não é divisível por 6; 24 é divisível por ambos, mas é um múltiplo comum maior (é o produto 4 × 6), não o menor.",
  "lawRef": "MMC de dois números"
 },
 {
  "id": "rlm-m10-autoral-14",
  "origem": "autoral-ia",
  "q": "O valor da expressão −3 × (−5) − 2 × (−4) é:",
  "options": [
   "7",
   "23",
   "−7",
   "−23",
   "8"
  ],
  "answer": 1,
  "explanation": "Regra de sinais: sinais iguais dão produto positivo e sinais diferentes dão negativo. −3 × (−5) = +15. Depois, 2 × (−4) = −8, e subtrair −8 equivale a somar 8: 15 − (−8) = 15 + 8 = 23. Erros comuns: tratar a segunda parcela como −8 sem inverter o sinal da subtração (15 − 8 = 7); errar o sinal do primeiro produto (−15 + 8 = −7 ou −15 − 8 = −23); ou calcular somente a segunda parcela, obtendo 8. Só 23 aplica corretamente a regra de sinais nas duas partes.",
  "lawRef": "Regra de sinais em multiplicação e subtração"
 },
 {
  "id": "rlm-m10-autoral-15",
  "origem": "autoral-ia",
  "q": "Em uma estatística do tribunal, a fração 0,375 dos processos foi concluída no mês. Escrita como fração irredutível, essa taxa é:",
  "options": [
   "3/4",
   "3/5",
   "3/8",
   "5/8",
   "7/20"
  ],
  "answer": 2,
  "explanation": "0,375 tem três casas decimais, então vale 375/1000. Dividindo numerador e denominador por 125 (que é o MDC de 375 e 1000), resulta 3/8. Conferência: 3 ÷ 8 = 0,375. Erros comuns: 3/4 vale 0,75; 3/5 vale 0,6; 5/8 vale 0,625 (troca de numerador); 7/20 vale 0,35, valor próximo, mas diferente. Dica: 1/8 = 0,125, então 3/8 = 3 × 0,125 = 0,375.",
  "lawRef": "Conversão de decimal em fração irredutível"
 },
 {
  "id": "rlm-m10-autoral-16",
  "origem": "autoral-ia",
  "q": "Uma tarefa de digitalização usa 2/5 de 100 unidades de papel e, depois, metade do que restou. Quantas unidades ainda sobram?",
  "options": [
   "20",
   "40",
   "50",
   "60",
   "30"
  ],
  "answer": 4,
  "explanation": "Primeiro, 2/5 de 100 = 40 unidades consumidas, sobrando 100 − 40 = 60. Em seguida, consome-se metade do restante: 60 ÷ 2 = 30, e sobram 30 unidades. Erros comuns: tomar metade das 40 consumidas (20); parar no primeiro consumo, que dá 40 consumidas, ou considerar o que sobrou naquela etapa, que dá 60; ou tomar a metade do total original (50), esquecendo que a metade é do restante e não das 100. Resolva sempre em etapas, atualizando a base da fração.",
  "lawRef": "Fração de quantidade em etapas sucessivas"
 },
 {
  "id": "rlm-m10-autoral-17",
  "origem": "autoral-ia",
  "q": "O triplo de um número, diminuído de 7, é igual a 20. Esse número vale:",
  "options": [
   "27",
   "13",
   "9",
   "7",
   "17"
  ],
  "answer": 2,
  "explanation": "Traduzindo para equação: 3x − 7 = 20. Somando 7 aos dois lados: 3x = 27. Dividindo por 3: x = 9. Conferência: 3 × 9 − 7 = 27 − 7 = 20. Erros comuns: esquecer de dividir por 3 e parar em 27; subtrair em vez de somar o 7 (20 − 7 = 13); responder o próprio número 7 do enunciado; ou subtrair o 3 de 20 (17), sem pensar que 3 é multiplicador. A operação inversa deve ser aplicada na ordem contrária.",
  "lawRef": "Equação do 1º grau — operações inversas"
 },
 {
  "id": "rlm-m10-autoral-18",
  "origem": "autoral-ia",
  "q": "O valor da expressão 2 + 3 × (5 − 2)² − 4 é:",
  "options": [
   "25",
   "7",
   "27",
   "1",
   "79"
  ],
  "answer": 0,
  "explanation": "Ordem: parênteses, potência, multiplicação, soma e subtração. (5 − 2) = 3; 3² = 9; 3 × 9 = 27; 2 + 27 − 4 = 25. Erros comuns: esquecer a potência (2 + 3 × 3 − 4 = 7); calcular só 3 × 9 = 27 sem somar 2 nem subtrair 4; elevar ao quadrado só o 2 dentro do parêntese (5 − 2² = 1, que dá 2 + 3 − 4 = 1); ou multiplicar antes da potência, (3 × 3)² = 81, o que dá 79. O expoente vale apenas para o parêntese.",
  "lawRef": "Ordem das operações com potência e parênteses"
 },
 {
  "id": "rlm-m10-autoral-19",
  "origem": "autoral-ia",
  "q": "Dois alarmes do tribunal tocam, respectivamente, a cada 12 e a cada 18 minutos, e tocaram juntos agora. Depois de quantos minutos voltarão a tocar juntos pela primeira vez?",
  "options": [
   "6 minutos",
   "36 minutos",
   "18 minutos",
   "24 minutos",
   "216 minutos"
  ],
  "answer": 1,
  "explanation": "É um problema de MMC. 12 = 2² × 3 e 18 = 2 × 3²; o MMC usa cada fator com o maior expoente: 2² × 3² = 36. Conferência: 36 = 3 × 12 = 2 × 18. Erros comuns: usar o MDC, que é 6; escolher o maior número (18), que não é múltiplo de 12; 24 é múltiplo de 12, mas não de 18; 216 é o produto 12 × 18, que é um múltiplo comum, porém não o menor. Pedir 'quando voltam a coincidir' sempre indica MMC.",
  "lawRef": "MMC — eventos periódicos"
 },
 {
  "id": "rlm-m10-autoral-20",
  "origem": "autoral-ia",
  "q": "Qual é o máximo divisor comum (MDC) entre 84 e 126?",
  "options": [
   "6",
   "14",
   "21",
   "42",
   "252"
  ],
  "answer": 3,
  "explanation": "Decompondo: 84 = 2² × 3 × 7 e 126 = 2 × 3² × 7. O MDC usa apenas os fatores comuns, com o menor expoente: 2 × 3 × 7 = 42. Conferência: 84 ÷ 42 = 2 e 126 ÷ 42 = 3, que não têm mais divisor comum. Erros comuns: parar antes de terminar a decomposição (6, 14 ou 21 dividem os dois números, mas não são o maior) e confundir com o MMC, que é 252 (2² × 3² × 7).",
  "lawRef": "MDC por decomposição em fatores primos"
 }
];
