/* Banco de questões — Raciocínio Lógico-Matemático, módulo 14. Questões autorais (não são de banca).
 * Para acrescentar questões, veja content/questoes/LEIAME.md e rode "npm run questoes:check". */
window.BC_QUESTOES=window.BC_QUESTOES||{};
(window.BC_QUESTOES.rlm=window.BC_QUESTOES.rlm||{})[14]=[
 {
  "id": "rlm-m14-autoral-01",
  "origem": "autoral-ia",
  "q": "Três turmas de um curso de formação fizeram a mesma prova. A turma A tem 12 alunos e média 8,5; a turma B tem 18 alunos e média 6,5; a turma C tem 30 alunos e média 7,0. A média geral dos 60 alunos é:",
  "options": [
   "7,33",
   "7,50",
   "7,00",
   "7,60",
   "7,15"
  ],
  "answer": 4,
  "explanation": "A média geral é a média ponderada pelos tamanhos das turmas: soma total das notas = 12 × 8,5 + 18 × 6,5 + 30 × 7,0 = 102 + 117 + 210 = 429; dividindo por 60 alunos, 429/60 = 7,15. A alternativa 7,33 é a média simples das três médias ((8,5 + 6,5 + 7,0)/3), que só vale se as turmas tiverem o mesmo tamanho. A de 7,50 é a média das médias de A e B, que ignora a turma C. A de 7,00 é a média da turma mais numerosa, e não a geral. A de 7,60 troca os pesos: a turma de 12 alunos recebe o peso da de 30 e vice-versa.",
  "lawRef": "Média ponderada: Σ(média × tamanho) ÷ Σ tamanhos"
 },
 {
  "id": "rlm-m14-autoral-02",
  "origem": "autoral-ia",
  "q": "Os tempos de resposta, em dias, de oito pedidos foram registrados na ordem de chegada: 12, 5, 9, 21, 7, 14, 6 e 30. A mediana desses tempos, em dias, é:",
  "options": [
   "9,0",
   "10,5",
   "12,0",
   "13,0",
   "14,0"
  ],
  "answer": 1,
  "explanation": "A mediana exige os dados ordenados: 5, 6, 7, 9, 12, 14, 21, 30. Como n = 8 é par, a mediana é a média dos valores nas posições n/2 = 4 e n/2 + 1 = 5, isto é, (9 + 12)/2 = 10,5. A alternativa 14,0 vem de não ordenar: a média dos dois valores centrais da lista original (21 e 7). A de 13,0 é a média aritmética (104/8), que é outra medida. As de 9,0 e 12,0 pegam apenas um dos dois valores centrais, esquecendo que, com n par, é preciso tirar a média entre eles.",
  "lawRef": "Mediana com n par: ordenar e tirar a média dos dois centrais"
 },
 {
  "id": "rlm-m14-autoral-03",
  "origem": "autoral-ia",
  "q": "O número de faltas de oito servidores em um semestre foi: 3, 5, 5, 6, 7, 7, 8 e 9. Sobre essa distribuição, é correto afirmar que:",
  "options": [
   "é amodal, pois nenhum valor aparece mais de duas vezes",
   "a moda é 2, que é a maior frequência observada",
   "a média é igual à mediana, pois ambas valem 6,5",
   "é bimodal, com modas 5 e 7, e a média (6,25) é menor que a mediana (6,5)",
   "a mediana é 7, pois é o valor central da lista"
  ],
  "answer": 3,
  "explanation": "Os valores 5 e 7 aparecem duas vezes cada, e nenhum outro se repete mais; a distribuição tem duas modas empatadas (5 e 7), portanto é bimodal. A média é (3 + 5 + 5 + 6 + 7 + 7 + 8 + 9)/8 = 50/8 = 6,25. Com n = 8, a mediana é a média dos valores das posições 4 e 5: (6 + 7)/2 = 6,5. Logo, a média é menor que a mediana, e a alternativa D está correta. A alternativa de amodal confunde duas modas com ausência de moda. A que diz que a moda é 2 toma a frequência como se fosse a moda: moda é o valor, não a frequência. A que iguala média e mediana trata 6,5 como média, mas ela vale 6,25. A que diz que a mediana é 7 escolhe um dos centrais, esquecendo a média entre 6 e 7.",
  "lawRef": "Moda (bimodal), média e mediana de dados brutos"
 },
 {
  "id": "rlm-m14-autoral-04",
  "origem": "autoral-ia",
  "q": "Cinco valores, 12, 18, 25, 9 e x, têm média aritmética igual a 17. A mediana do conjunto é:",
  "options": [
   "18",
   "17",
   "21",
   "25",
   "12"
  ],
  "answer": 0,
  "explanation": "Se a média é 17 e são 5 valores, a soma é 85. Como 12 + 18 + 25 + 9 = 64, x = 85 − 64 = 21 (confira: a soma dos desvios em relação à média, −5 + 1 + 8 − 8 + 4, é zero). Ordenando: 9, 12, 18, 21, 25. Com n = 5 (ímpar), a mediana ocupa a posição (5 + 1)/2 = 3: é 18. A alternativa 17 confunde mediana com média. A de 21 é o valor de x que se acabou de descobrir, mas ele ocupa a quarta posição. A de 25 é o terceiro valor da lista original sem ordenar. A de 12 é o primeiro valor do enunciado, sem relação com a posição central.",
  "lawRef": "Valor ausente pela média (soma = n × média) e mediana de n ímpar"
 },
 {
  "id": "rlm-m14-autoral-05",
  "origem": "autoral-ia",
  "q": "A tabela mostra quantos processos cada um dos 25 servidores de um setor relatou no mês:\n\nProcessos relatados | 1 | 2 | 3 | 4 | 5\nServidores | 3 | 4 | 6 | 9 | 3\n\nA mediana, a moda e a média são, respectivamente:",
  "options": [
   "4; 3; 3,2",
   "3; 9; 3,2",
   "3; 4; 3,2",
   "3; 4; 3,0",
   "13; 4; 3,2"
  ],
  "answer": 2,
  "explanation": "Frequências acumuladas: 3, 7, 13, 22 e 25. Com n = 25, a mediana está na posição 13, que pertence ao valor 3 (acumulada 13). A moda é o valor de maior frequência, ou seja, 4 (9 servidores). A média ponderada é (1×3 + 2×4 + 3×6 + 4×9 + 5×3)/25 = (3 + 8 + 18 + 36 + 15)/25 = 80/25 = 3,2. A alternativa \"4; 3; 3,2\" troca mediana e moda. A \"3; 9; 3,2\" toma a frequência 9 como moda. A \"3; 4; 3,0\" calcula a média simples dos valores 1 a 5 ((1+2+3+4+5)/5), sem usar as frequências como pesos. A \"13; 4; 3,2\" informa a posição da mediana, e não o seu valor.",
  "lawRef": "Mediana, moda e média em tabela de frequências"
 },
 {
  "id": "rlm-m14-autoral-06",
  "origem": "autoral-ia",
  "q": "Cinco servidores recebem R$ 3.000,00, R$ 3.200,00, R$ 3.400,00, R$ 3.600,00 e R$ 3.800,00. Um sexto servidor, com salário de R$ 9.400,00, passa a integrar o grupo. Em relação à situação anterior, o aumento da média e o da mediana são, respectivamente:",
  "options": [
   "R$ 1.000,00 e R$ 200,00",
   "R$ 1.000,00 e R$ 100,00",
   "R$ 1.880,00 e R$ 100,00",
   "R$ 1.000,00 e zero",
   "R$ 4.400,00 e R$ 3.500,00"
  ],
  "answer": 1,
  "explanation": "Antes: média = 17.000/5 = 3.400 e mediana = 3.400 (terceiro valor). Depois: soma = 26.400, média = 26.400/6 = 4.400 (aumento de R$ 1.000,00); com n = 6, a mediana é a média do terceiro e do quarto valores: (3.400 + 3.600)/2 = 3.500 (aumento de R$ 100,00). O valor extremo mexe muito na média e pouco na mediana. A alternativa de R$ 200,00 usa só o quarto valor (3.600) como mediana. A de R$ 1.880,00 divide o valor novo por 5, o que não é a variação da média. A de \"zero\" supõe que a mediana não muda, esquecendo a média dos dois centrais. A última apresenta os novos valores da média e da mediana, e não os aumentos pedidos.",
  "lawRef": "Efeito de valor extremo: média x mediana"
 },
 {
  "id": "rlm-m14-autoral-07",
  "origem": "autoral-ia",
  "q": "O tempo, em minutos, de 70 atendimentos foi agrupado assim:\n\nClasse (min) | Atendimentos\n[0, 10) | 12\n[10, 20) | 20\n[20, 30) | 18\n[30, 40) | 14\n[40, 50) | 6\n\nAdmitindo que os valores de cada classe estejam concentrados no ponto médio, a média aproximada do tempo de atendimento, em minutos, é:",
  "options": [
   "17,43",
   "25,00",
   "27,43",
   "15,00",
   "22,43"
  ],
  "answer": 4,
  "explanation": "Os pontos médios são 5, 15, 25, 35 e 45. Média ≈ (5×12 + 15×20 + 25×18 + 35×14 + 45×6)/70 = (60 + 300 + 450 + 490 + 270)/70 = 1.570/70 ≈ 22,43 minutos. A alternativa 25,00 é a média simples dos pontos médios, que ignora as frequências. A de 17,43 usa os limites inferiores das classes no lugar dos pontos médios, subestimando a média em 5 minutos; a de 27,43 usa os limites superiores e superestima na mesma medida. A de 15,00 é o ponto médio da classe modal ([10, 20), a de maior frequência), que não é a média, pois esta depende de todas as classes.",
  "lawRef": "Média de dados agrupados: pontos médios ponderados pelas frequências"
 },
 {
  "id": "rlm-m14-autoral-08",
  "origem": "autoral-ia",
  "q": "Em um processo seletivo, a nota final é a média ponderada de três provas, com pesos 2, 3 e 5. Um candidato tirou 6,5 na primeira prova e 7,0 na segunda. Para que a nota final seja, no mínimo, 7,0, a nota mínima que ele precisa tirar na terceira prova é:",
  "options": [
   "7,2",
   "7,5",
   "7,0",
   "6,8",
   "8,5"
  ],
  "answer": 0,
  "explanation": "Para média final 7,0 com pesos que somam 10, é preciso ter soma ponderada igual a 70. As duas primeiras provas dão 2 × 6,5 + 3 × 7,0 = 13 + 21 = 34. Falta 70 − 34 = 36, que deve vir da terceira prova de peso 5: 36/5 = 7,2. A alternativa 7,5 resolve como se as provas tivessem o mesmo peso (3 × 7 − 6,5 − 7 = 7,5). A de 7,0 supõe que basta repetir a média desejada. A de 6,8 divide 34 por 5, misturando a soma ponderada já obtida com o peso da terceira prova. A de 8,5 desconsidera o peso 2 da primeira prova (usa peso 1): (70 − 6,5 − 21)/5 = 8,5.",
  "lawRef": "Média ponderada: nota mínima necessária"
 },
 {
  "id": "rlm-m14-autoral-09",
  "origem": "autoral-ia",
  "q": "Em uma carreira, o salário médio é R$ 4.000,00, a mediana é R$ 3.600,00 e a moda é R$ 3.000,00. Concede-se primeiro um reajuste linear de 10% sobre todos os salários e depois um abono fixo de R$ 200,00 a cada servidor. A nova mediana é:",
  "options": [
   "R$ 3.960,00",
   "R$ 3.800,00",
   "R$ 4.160,00",
   "R$ 4.180,00",
   "R$ 4.600,00"
  ],
  "answer": 2,
  "explanation": "Multiplicar todos os valores por uma constante e depois somar outra constante aplica a mesma transformação a média, à mediana e à moda: nova mediana = 3.600 × 1,10 + 200 = 3.960 + 200 = 4.160. A alternativa de R$ 3.960,00 esquece o abono. A de R$ 3.800,00 soma o abono mas esquece o reajuste. A de R$ 4.180,00 inverte a ordem das operações ((3.600 + 200) × 1,10), o que daria o resultado de abono antes do reajuste. A de R$ 4.600,00 é a nova média (4.000 × 1,10 + 200), e não a mediana.",
  "lawRef": "Transformação linear de dados: média, mediana e moda"
 },
 {
  "id": "rlm-m14-autoral-10",
  "origem": "autoral-ia",
  "q": "Uma tabela de frequências traz os valores 2, 4, 6 e 8, com frequências 6, 5, x e 5, respectivamente. Sabe-se que a média aritmética é 4,8. A mediana dessa distribuição é:",
  "options": [
   "2",
   "4,8",
   "5",
   "4",
   "6"
  ],
  "answer": 3,
  "explanation": "Pela média: (2×6 + 4×5 + 6x + 8×5)/(16 + x) = 4,8, ou seja, (72 + 6x) = 4,8 × (16 + x) = 76,8 + 4,8x, de onde 1,2x = 4,8 e x = 4. O total é n = 20. Frequências acumuladas: 6, 11, 15 e 20. Com n par, a mediana é a média das posições 10 e 11, que estão no valor 4 (acumulada 11): mediana = 4. A alternativa 2 é a moda (maior frequência, 6). A de 4,8 é a média informada. A de 5 é a média simples dos quatro valores distintos ((2+4+6+8)/4), sem usar as frequências. A de 6 confunde o valor 6 com a posição dele na tabela, mas esse valor só aparece depois da posição 11.",
  "lawRef": "Frequência desconhecida pela média; mediana por acumuladas"
 },
 {
  "id": "rlm-m14-autoral-11",
  "origem": "autoral-ia",
  "q": "Um servidor atendeu 4, 6 e 8 pessoas em três dias consecutivos. A média aritmética de atendimentos por dia é:",
  "options": [
   "5",
   "6",
   "7",
   "8",
   "4"
  ],
  "answer": 1,
  "explanation": "A média aritmética é a soma dos valores dividida pela quantidade de observações: (4 + 6 + 8)/3 = 18/3 = 6. Como a média é um valor de equilíbrio, ela deve ficar entre o menor e o maior valor: por isso 4 e 8, que são justamente os extremos, só seriam médias se todos os dados fossem iguais a eles. Os valores 5 e 7 são resultados típicos de somar errado ou dividir pela quantidade errada: 5 seria a média de 4 e 6, e 7 seria a de 6 e 8, ou seja, deixam um dos dados de fora.",
  "lawRef": "Média aritmética simples"
 },
 {
  "id": "rlm-m14-autoral-12",
  "origem": "autoral-ia",
  "q": "Três processos foram julgados em 7, 2 e 5 dias, respectivamente. A mediana desses tempos, em dias, é:",
  "options": [
   "2",
   "4,67",
   "6",
   "7",
   "5"
  ],
  "answer": 4,
  "explanation": "A mediana é o valor central dos dados ordenados. Colocando em ordem crescente, 2, 5, 7, o termo central é 5. Usar a ordem de chegada (7, 2, 5) e apontar o termo do meio sem ordenar leva ao erro de marcar 2. A alternativa 4,67 é a média aritmética (14/3), outra medida de posição. A de 6 é a média apenas de 7 e 5. A de 7 é o maior valor. Lembre que, com número ímpar de observações, a mediana é sempre um dos próprios dados.",
  "lawRef": "Mediana"
 },
 {
  "id": "rlm-m14-autoral-13",
  "origem": "autoral-ia",
  "q": "O número de recursos apresentados em sete processos foi: 2, 5, 3, 5, 4, 5 e 1. A moda desse conjunto é:",
  "options": [
   "4",
   "3,57",
   "5",
   "3",
   "1"
  ],
  "answer": 2,
  "explanation": "A moda é o valor que aparece com maior frequência. O valor 5 aparece três vezes, e os demais aparecem uma vez cada, então a moda é 5. A alternativa 4 é a mediana (ordenados: 1, 2, 3, 4, 5, 5, 5, o termo central é 4). A de 3,57 é a média aritmética (25/7 ≈ 3,57). A de 3 é um valor que aparece uma única vez, e a de 1 é o menor valor. Cada alternativa errada corresponde a outra medida ou a um valor sem destaque na frequência.",
  "lawRef": "Moda"
 },
 {
  "id": "rlm-m14-autoral-14",
  "origem": "autoral-ia",
  "q": "Em um concurso interno, a nota final é a média ponderada de duas provas: a primeira, com peso 2, e a segunda, com peso 1. Um candidato tirou 6 na primeira e 9 na segunda. Sua nota final é:",
  "options": [
   "7",
   "7,5",
   "8",
   "6",
   "9"
  ],
  "answer": 0,
  "explanation": "Na média ponderada, cada nota é multiplicada pelo seu peso, e a soma é dividida pela soma dos pesos: (6 × 2 + 9 × 1)/(2 + 1) = 21/3 = 7. A alternativa 7,5 é a média simples (6 + 9)/2, que ignora os pesos e, por isso, está errada. A de 8 e a de 9 supervalorizam a segunda prova, que tem peso menor. A de 6 é a nota da prova de maior peso, mas a média é puxada para cima pela outra nota, ficando entre 6 e 9, mais perto de 6 por causa do peso 2.",
  "lawRef": "Média ponderada"
 },
 {
  "id": "rlm-m14-autoral-15",
  "origem": "autoral-ia",
  "q": "Os tempos de quatro audiências, em horas, foram, na ordem de realização: 11, 3, 9 e 7. A mediana desses tempos, em horas, é:",
  "options": [
   "7",
   "9",
   "7,5",
   "8",
   "10"
  ],
  "answer": 3,
  "explanation": "Com quantidade par de dados, a mediana é a média dos dois termos centrais da lista ordenada. Ordenando: 3, 7, 9, 11. Os termos centrais são 7 e 9, e a mediana é (7 + 9)/2 = 8. As alternativas 7 e 9 escolhem apenas um dos termos centrais. A de 7,5 é a média aritmética de todos os dados ((3 + 7 + 9 + 11)/4 = 7,5), e não a mediana. A de 10 é a média de 9 e 11, que não são os termos centrais.",
  "lawRef": "Mediana com número par de observações"
 },
 {
  "id": "rlm-m14-autoral-16",
  "origem": "autoral-ia",
  "q": "Cinco servidores de um setor têm média de 8 horas extras no mês. A soma total de horas extras dos cinco é:",
  "options": [
   "8",
   "16",
   "40",
   "32",
   "48"
  ],
  "answer": 2,
  "explanation": "A média é a soma dividida pela quantidade de observações, então a soma é média × quantidade: 8 × 5 = 40 horas. A alternativa 8 é a própria média. A de 16 é 8 × 2 e a de 32 é 8 × 4, que usam a quantidade errada de servidores. A de 48 é 8 × 6, que conta um servidor a mais. Para confirmar, divida a soma encontrada por 5: 40/5 = 8, que é a média dada.",
  "lawRef": "Média e soma: soma = média × n"
 },
 {
  "id": "rlm-m14-autoral-17",
  "origem": "autoral-ia",
  "q": "O número de faltas de cinco servidores em um semestre foi 2, 2, 3, 4 e 4. Qual é a moda desse conjunto?",
  "options": [
   "2 e 4 (o conjunto é bimodal)",
   "2 apenas",
   "4 apenas",
   "3 apenas",
   "Não há moda (o conjunto é amodal)"
  ],
  "answer": 0,
  "explanation": "A moda é o valor de maior frequência. Aqui, 2 aparece duas vezes, 4 aparece duas vezes e 3 aparece uma vez. As duas maiores frequências empatam em 2, então há duas modas, 2 e 4, e o conjunto é bimodal. Dizer que só 2 ou só 4 é a moda ignora o empate. O valor 3 é o de menor frequência. Dizer que não há moda seria correto apenas se todos os valores tivessem a mesma frequência, o que não ocorre, pois o 3 aparece uma só vez.",
  "lawRef": "Moda: conjuntos bimodais"
 },
 {
  "id": "rlm-m14-autoral-18",
  "origem": "autoral-ia",
  "q": "Uma turma de 10 alunos tem média 7 em uma prova, e outra turma, de 30 alunos, tem média 9 na mesma prova. A média conjunta dos 40 alunos é:",
  "options": [
   "8",
   "7,5",
   "9",
   "8,25",
   "8,5"
  ],
  "answer": 4,
  "explanation": "A média conjunta é uma média ponderada pelas quantidades de alunos: (10 × 7 + 30 × 9)/(10 + 30) = (70 + 270)/40 = 340/40 = 8,5. A alternativa 8 é a média simples das duas médias ((7 + 9)/2), que ignora que a segunda turma é três vezes maior. A de 7,5 e a de 8,25 são resultados intermediários sem base na ponderação correta. A de 9 seria a média só se a primeira turma tivesse peso nulo. Como a turma maior tem média maior, o resultado fica mais perto de 9 do que de 7.",
  "lawRef": "Média ponderada pelo tamanho dos grupos"
 },
 {
  "id": "rlm-m14-autoral-19",
  "origem": "autoral-ia",
  "q": "Os dados 1, 2, 3, 4 e x têm média aritmética igual a 4. O valor de x é:",
  "options": [
   "20",
   "10",
   "4",
   "6",
   "2,5"
  ],
  "answer": 1,
  "explanation": "Com cinco dados e média 4, a soma deve ser 5 × 4 = 20. Os quatro dados conhecidos somam 1 + 2 + 3 + 4 = 10, então x = 20 − 10 = 10. Conferindo: (10 + 10)/5 = 4. A alternativa 20 é a soma total, e não o valor de x. A de 4 iguala x à média, o que só valeria se os outros dados fossem todos 4. A de 6 vem de dividir por 4 em vez de 5 (4 × 4 − 10). A de 2,5 é a média dos quatro dados conhecidos (10/4).",
  "lawRef": "Média aritmética: valor desconhecido a partir da média"
 },
 {
  "id": "rlm-m14-autoral-20",
  "origem": "autoral-ia",
  "q": "Em um conjunto de cinco observações, os valores são 1, 2, 2, 8 e 17. A média aritmética, a mediana e a moda são, respectivamente:",
  "options": [
   "6, 8 e 2",
   "2, 6 e 2",
   "6, 6 e 2",
   "6, 2 e 2",
   "5, 2 e 8"
  ],
  "answer": 3,
  "explanation": "Média: (1 + 2 + 2 + 8 + 17)/5 = 30/5 = 6. Mediana: os dados já estão ordenados e o termo central (o 3º de cinco) é 2. Moda: o valor 2 aparece duas vezes e os demais uma vez, logo a moda é 2. Resposta: 6, 2 e 2. O valor extremo 17 puxa a média para cima, mas não afeta a mediana nem a moda. As alternativas com mediana 8 ou 6 erram o termo central, e a que traz 5 como média ou 8 como moda erra a conta ou a frequência.",
  "lawRef": "Média, mediana e moda"
 }
];
