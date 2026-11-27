/* Banco de questões — Raciocínio Lógico-Matemático, módulo 11. Questões autorais (não são de banca).
 * Para acrescentar questões, veja content/questoes/LEIAME.md e rode "npm run questoes:check". */
window.BC_QUESTOES=window.BC_QUESTOES||{};
(window.BC_QUESTOES.rlm=window.BC_QUESTOES.rlm||{})[11]=[
 {
  "id": "rlm-m11-autoral-01",
  "origem": "autoral-ia",
  "q": "Em um setor, a razão entre o número de homens e o de mulheres é 4:5. Depois que 6 mulheres deixaram o setor, a razão passou a ser 10:11. Antes da saída das mulheres, o setor tinha um total de:",
  "options": [
   "84 pessoas",
   "90 pessoas",
   "54 pessoas",
   "99 pessoas",
   "105 pessoas"
  ],
  "answer": 1,
  "explanation": "Na razão 4:5, o número de homens é 4k e o de mulheres é 5k. Saindo 6 mulheres, a nova razão é 4k/(5k − 6) = 10/11. Pela propriedade fundamental da proporção (produto dos meios igual ao produto dos extremos): 44k = 10(5k − 6) = 50k − 60, logo 6k = 60 e k = 10. Havia 40 homens e 50 mulheres, total de 90. Conferência: depois da saída, 40 homens e 44 mulheres, e 40/44 = 10/11. O número 84 é o total depois da saída, não antes; 54 resulta de usar k = 6 (confundindo o 6 do enunciado com a constante); 99 e 105 vêm de somar partes (9 · 11 e 21 · 5) sem montar a equação.",
  "lawRef": "Razão entre partes x fração do total; propriedade fundamental da proporção (ad = bc)"
 },
 {
  "id": "rlm-m11-autoral-02",
  "origem": "autoral-ia",
  "q": "Em um mapa de escala 1:200.000, um trecho de rodovia mede 7,5 cm. Um veículo que percorre o trecho real com velocidade média de 45 km/h leva:",
  "options": [
   "33 minutos",
   "2 minutos",
   "180 minutos",
   "200 minutos",
   "20 minutos"
  ],
  "answer": 4,
  "explanation": "A escala 1:200.000 diz que 1 cm no mapa equivale a 200.000 cm no terreno. Logo, 7,5 cm equivalem a 7,5 × 200.000 = 1.500.000 cm = 15.000 m = 15 km (100.000 cm = 1 km). Com 45 km/h, o tempo é 15 ÷ 45 = 1/3 de hora = 20 minutos. Os erros vêm das conversões: tomar 1/3 de hora como 33 minutos (confundindo 0,33 hora com minutos); errar o fator de conversão de cm para km, o que dá 1,5 km (tempo de 2 minutos) ou 150 km (200 minutos); e inverter a divisão, 45 ÷ 15 = 3 horas = 180 minutos.",
  "lawRef": "Escala como razão; conversão cm → km; tempo = distância ÷ velocidade"
 },
 {
  "id": "rlm-m11-autoral-03",
  "origem": "autoral-ia",
  "q": "Uma impressora A imprime 120 páginas em 8 minutos e uma impressora B imprime 90 páginas em 5 minutos. Funcionando ao mesmo tempo, sem interrupções, o tempo necessário para imprimirem 1.320 páginas é de:",
  "options": [
   "40 minutos",
   "80 minutos",
   "88 minutos",
   "73 minutos e 20 segundos",
   "82 minutos"
  ],
  "answer": 0,
  "explanation": "Primeiro calcule a taxa de cada máquina: A faz 120 ÷ 8 = 15 páginas por minuto e B faz 90 ÷ 5 = 18 páginas por minuto. Juntas, as taxas se somam: 33 páginas por minuto. Tempo: 1.320 ÷ 33 = 40 minutos. Erros comuns: usar a média das taxas (16,5 páginas/min), o que dá 80 minutos; considerar só a impressora A (1.320 ÷ 15 = 88 minutos) ou só a B (1.320 ÷ 18 = 73 min 20 s); e dividir o total de páginas pelo total de minutos das duas (210 ÷ 13 ≈ 16,15 páginas/min), que dá cerca de 82 minutos.",
  "lawRef": "Grandezas diretamente proporcionais — taxas de produção que se somam"
 },
 {
  "id": "rlm-m11-autoral-04",
  "origem": "autoral-ia",
  "q": "Doze operários, trabalhando no mesmo ritmo, concluiriam uma obra em 30 dias. Depois de 10 dias de trabalho, 4 operários foram desligados. Mantendo o ritmo dos que ficaram, o número de dias que ainda faltarão para concluir a obra é:",
  "options": [
   "35",
   "40",
   "45",
   "30",
   "13,3"
  ],
  "answer": 3,
  "explanation": "A obra equivale a 12 × 30 = 360 operários-dia. Em 10 dias, os 12 operários fizeram 12 × 10 = 120 operários-dia, restando 360 − 120 = 240. Com 8 operários, o tempo é 240 ÷ 8 = 30 dias (operários e dias são inversamente proporcionais: o produto é constante). Erros: calcular o tempo total com 8 operários (360 ÷ 8 = 45 dias) e não considerar o que já foi feito; descontar os 10 dias dessa conta total, 45 − 10 = 35; somar os 10 dias já trabalhados aos 30 que faltam, 40, que seria o prazo total e não o que ainda falta; e tratar a relação como direta (20 × 8/12 ≈ 13,3), quando menos operários exigem mais dias.",
  "lawRef": "Regra de três inversa — produto operários × dias constante, com obra parcialmente executada"
 },
 {
  "id": "rlm-m11-autoral-05",
  "origem": "autoral-ia",
  "q": "Oito máquinas idênticas, funcionando 6 horas por dia durante 15 dias, produzem 14.400 peças. Seis dessas máquinas, funcionando 10 horas por dia, produzirão 19.200 peças em:",
  "options": [
   "9 dias",
   "12 dias",
   "16 dias",
   "20 dias",
   "44,4 dias"
  ],
  "answer": 2,
  "explanation": "Regra de três composta: compare cada grandeza com os dias. Menos máquinas (6 contra 8) exigem mais dias: relação inversa. Mais horas por dia (10 contra 6) exigem menos dias: relação inversa. Mais peças (19.200 contra 14.400) exigem mais dias: relação direta. Então dias = 15 × (8/6) × (6/10) × (19.200/14.400) = 15 × 4/3 × 3/5 × 4/3 = 16. Conferência pela produção horária: 14.400 ÷ (8 × 6 × 15) = 20 peças por máquina por hora, e 19.200 ÷ (6 × 10 × 20) = 16 dias. Erros: considerar apenas as máquinas, 15 × 8/6 = 20; ignorar as peças, 15 × 4/3 × 3/5 = 12; tratar máquinas como diretas, 15 × 6/8 × 3/5 × 4/3 = 9; tratar horas como diretas, 15 × 4/3 × 10/6 × 4/3 ≈ 44,4.",
  "lawRef": "Regra de três composta — identificar relação direta ou inversa de cada grandeza com a incógnita"
 },
 {
  "id": "rlm-m11-autoral-06",
  "origem": "autoral-ia",
  "q": "Um prêmio de R$ 7.020,00 será repartido entre três servidores em partes diretamente proporcionais ao número de processos julgados e inversamente proporcionais ao número de faltas. O servidor A julgou 10 processos e teve 2 faltas; o B, 9 processos e 3 faltas; o C, 8 processos e 4 faltas. O servidor A receberá:",
  "options": [
   "R$ 2.600,00",
   "R$ 3.240,00",
   "R$ 3.510,00",
   "R$ 2.106,00",
   "R$ 1.777,22"
  ],
  "answer": 2,
  "explanation": "Cada servidor recebe em proporção a processos ÷ faltas: A = 10/2 = 5; B = 9/3 = 3; C = 8/4 = 2. A soma é 10 partes, e cada parte vale 7.020 ÷ 10 = R$ 702,00. A recebe 5 × 702 = R$ 3.510,00 (B recebe R$ 2.106,00 e C, R$ 1.404,00; total 7.020). Erros: usar só os processos (10:9:8, soma 27) dá a A R$ 2.600,00; usar só o inverso das faltas (1/2 : 1/3 : 1/4 = 6:4:3, soma 13) dá R$ 3.240,00; multiplicar processos por faltas (20:27:32) dá R$ 1.777,22; e R$ 2.106,00 é o valor de B, não de A.",
  "lawRef": "Divisão em partes proporcionais composta — direta aos processos e inversa às faltas"
 },
 {
  "id": "rlm-m11-autoral-07",
  "origem": "autoral-ia",
  "q": "Um carro percorre uma estrada de 180 km na ida a 60 km/h e faz o mesmo trajeto na volta a 90 km/h. A velocidade média do carro em todo o percurso de ida e volta, em km/h, é:",
  "options": [
   "72",
   "75",
   "73,5",
   "80",
   "66"
  ],
  "answer": 0,
  "explanation": "Velocidade média é distância total ÷ tempo total. Na ida: 180 ÷ 60 = 3 h. Na volta: 180 ÷ 90 = 2 h. Distância total: 360 km; tempo total: 5 h. Velocidade média = 360 ÷ 5 = 72 km/h. A média aritmética das velocidades, (60 + 90) ÷ 2 = 75, só serviria se os tempos de ida e volta fossem iguais; aqui o carro passa mais tempo na velocidade menor, e por isso a média fica abaixo de 75. A média geométrica, √(60 × 90) ≈ 73,5, também não representa distância total sobre tempo total. Os valores 80 e 66 não correspondem a nenhuma média desse enunciado.",
  "lawRef": "Velocidade média = distância total ÷ tempo total (média harmônica para distâncias iguais)"
 },
 {
  "id": "rlm-m11-autoral-08",
  "origem": "autoral-ia",
  "q": "Uma solução de 40 litros contém álcool e água na razão 3:7. O número de litros de água que devem ser acrescentados para que a razão entre álcool e água passe a ser 1:4 é:",
  "options": [
   "5",
   "8",
   "48",
   "12",
   "20"
  ],
  "answer": 4,
  "explanation": "A razão 3:7 tem 10 partes; cada parte vale 40 ÷ 10 = 4 L. Há 12 L de álcool e 28 L de água. Acrescentando x litros de água, o álcool continua com 12 L e a razão vira 12/(28 + x) = 1/4. Logo, 28 + x = 48 e x = 20. Conferência: 12 L de álcool e 48 L de água, e 12:48 = 1:4. Erros: aplicar a razão 1:4 às partes originais (3/(7 + x) = 1/4) dá x = 5; comparar o álcool com o volume total da solução (12/(40 + x) = 1/4) dá x = 8; responder 48, que é a quantidade final de água, e não o acréscimo; e 12 supõe que se acrescenta tanta água quanto há de álcool.",
  "lawRef": "Razão entre partes — manter constante a quantidade que não muda e resolver a proporção"
 },
 {
  "id": "rlm-m11-autoral-09",
  "origem": "autoral-ia",
  "q": "Em uma pizzaria, o preço de cada pizza é proporcional à área, e uma pizza de 30 cm de diâmetro custa R$ 36,00. Mantida a mesma proporcionalidade, uma pizza de 45 cm de diâmetro custará:",
  "options": [
   "R$ 54,00",
   "R$ 51,00",
   "R$ 121,50",
   "R$ 81,00",
   "R$ 72,00"
  ],
  "answer": 3,
  "explanation": "O preço é proporcional à área, e a área de um círculo é proporcional ao quadrado do diâmetro (A = πd²/4). A razão entre os diâmetros é 45/30 = 3/2, logo a razão entre as áreas é (3/2)² = 9/4 = 2,25. Preço = 36 × 2,25 = R$ 81,00. O erro clássico é aplicar a regra de três direta ao diâmetro: 36 × 45/30 = R$ 54,00, o que só valeria se o preço fosse proporcional ao diâmetro. Também erram quem soma a diferença de diâmetros ao preço (36 + 15 = R$ 51,00), quem usa o cubo da razão (36 × 3,375 = R$ 121,50, que seria proporcional ao volume) e quem apenas dobra o preço (R$ 72,00).",
  "lawRef": "Proporcionalidade com o quadrado do diâmetro (área); nem toda relação é diretamente proporcional"
 },
 {
  "id": "rlm-m11-autoral-10",
  "origem": "autoral-ia",
  "q": "Uma loja cobrou R$ 40,00 por 4 canetas iguais, valor que já inclui uma taxa de entrega fixa de R$ 12,00, independente da quantidade. Para a compra de 10 canetas iguais, com a mesma taxa de entrega, o valor total é:",
  "options": [
   "R$ 100,00",
   "R$ 82,00",
   "R$ 70,00",
   "R$ 94,00",
   "R$ 106,00"
  ],
  "answer": 1,
  "explanation": "A regra de três só vale para a parte proporcional da conta. Tirando a taxa fixa, 4 canetas custam 40 − 12 = R$ 28,00, ou R$ 7,00 cada. Para 10 canetas: 10 × 7 = R$ 70,00, mais a taxa de R$ 12,00 uma única vez: R$ 82,00. Erros: aplicar a regra de três ao total (40 × 10/4 = R$ 100,00), multiplicando também a taxa fixa por 2,5; esquecer a taxa de entrega (R$ 70,00); cobrá-la duas vezes (70 + 12 + 12 = R$ 94,00); e cobrar uma taxa a cada 4 canetas (3 taxas, 70 + 36 = R$ 106,00).",
  "lawRef": "Regra de três direta — só vale para a parte proporcional (taxa fixa fica fora)"
 },
 {
  "id": "rlm-m11-autoral-11",
  "origem": "autoral-ia",
  "q": "Trinta e cinco servidores foram divididos em dois grupos na razão 3:4. O grupo menor tem:",
  "options": [
   "20 servidores",
   "15 servidores",
   "21 servidores",
   "5 servidores",
   "28 servidores"
  ],
  "answer": 1,
  "explanation": "Razão 3:4 significa 3k e 4k servidores, com 3k + 4k = 35. Logo 7k = 35 e k = 5. O grupo menor tem 3 × 5 = 15 servidores e o maior 4 × 5 = 20 (soma 35). Erros comuns: responder o grupo maior (20), que não foi pedido; tomar 3/5 do total (21) ou 4/5 (28), somando errado as partes (a soma das partes é 7 e não 5); ou responder só o valor de k (5). Passos: somar as partes, achar k e multiplicar.",
  "lawRef": "Divisão em partes proporcionais (razão entre partes)"
 },
 {
  "id": "rlm-m11-autoral-12",
  "origem": "autoral-ia",
  "q": "Em uma equipe, 2 em cada 5 servidores trabalham em regime de teletrabalho. Mantida essa proporção, em um grupo de 20 servidores, quantos trabalham em teletrabalho?",
  "options": [
   "4",
   "10",
   "12",
   "18",
   "8"
  ],
  "answer": 4,
  "explanation": "A proporção é 2/5 = x/20. Pela propriedade fundamental, 5x = 2 × 20 = 40, logo x = 8. Conferência: 20 ÷ 5 = 4 grupos de 5, cada um com 2, ou seja, 4 × 2 = 8. Erros comuns: somar em vez de multiplicar proporcionalmente (4 por usar apenas 2 × 2); dividir 20 por 2 (10); calcular a parte complementar, 3/5 de 20 = 12; ou subtrair 2 de 20 (18). A conta certa é produto dos meios igual ao produto dos extremos.",
  "lawRef": "Proporção — propriedade fundamental (ad = bc)"
 },
 {
  "id": "rlm-m11-autoral-13",
  "origem": "autoral-ia",
  "q": "Cinco canetas custam R$ 30,00, a preço constante. Quanto custam 12 canetas?",
  "options": [
   "R$ 72,00",
   "R$ 60,00",
   "R$ 42,00",
   "R$ 150,00",
   "R$ 360,00"
  ],
  "answer": 0,
  "explanation": "Regra de três simples direta: mais canetas, mais custo. 5 canetas — 30; 12 canetas — x. Então x = 12 × 30 ÷ 5 = 360 ÷ 5 = 72. Outro caminho: preço unitário 30 ÷ 5 = 6; 12 × 6 = 72. Erros comuns: multiplicar 12 por 5 (60); somar 12 ao custo (42), pensando de forma aditiva; multiplicar 30 por 5 (150); ou multiplicar 30 por 12 e esquecer de dividir por 5 (360). Em grandezas diretas, o aumento é proporcional, não aditivo.",
  "lawRef": "Regra de três simples direta"
 },
 {
  "id": "rlm-m11-autoral-14",
  "origem": "autoral-ia",
  "q": "Um veículo oficial percorre 90 km em 1,5 hora, em velocidade constante. Mantida essa velocidade, quantos quilômetros percorre em 4 horas?",
  "options": [
   "360 km",
   "135 km",
   "240 km",
   "33,75 km",
   "92,5 km"
  ],
  "answer": 2,
  "explanation": "Distância e tempo são diretamente proporcionais. Velocidade = 90 ÷ 1,5 = 60 km/h. Em 4 horas: 60 × 4 = 240 km. Por regra de três: 90/1,5 = x/4, então x = 90 × 4 ÷ 1,5 = 240. Erros comuns: multiplicar 90 por 4 sem dividir por 1,5 (360); multiplicar 90 por 1,5 (135); tratar as grandezas como inversas (90 × 1,5 ÷ 4 = 33,75); ou raciocinar com soma (90 + 2,5 = 92,5). Mais tempo, mais distância: direta.",
  "lawRef": "Regra de três simples direta (velocidade constante)"
 },
 {
  "id": "rlm-m11-autoral-15",
  "origem": "autoral-ia",
  "q": "Oito servidores concluem uma tarefa em 15 dias. Em quantos dias 12 servidores, com mesmo ritmo e jornada, concluem a mesma tarefa?",
  "options": [
   "22,5 dias",
   "11 dias",
   "19 dias",
   "10 dias",
   "8 dias"
  ],
  "answer": 3,
  "explanation": "Mais servidores, menos dias: grandezas inversamente proporcionais. O trabalho total vale 8 × 15 = 120 servidor-dias. Com 12 servidores: 120 ÷ 12 = 10 dias. Erros comuns: tratar como direta (15 × 12 ÷ 8 = 22,5); raciocinar com soma ou subtração (15 − 4 = 11 ou 15 + 4 = 19); ou repetir o número 8. Antes de armar a regra de três, pergunte se aumentar uma grandeza faz a outra aumentar ou diminuir.",
  "lawRef": "Regra de três simples inversa"
 },
 {
  "id": "rlm-m11-autoral-16",
  "origem": "autoral-ia",
  "q": "Uma verba de R$ 280,00 será repartida em partes proporcionais a 3 e 4. O valor da maior parte é:",
  "options": [
   "R$ 160,00",
   "R$ 120,00",
   "R$ 210,00",
   "R$ 140,00",
   "R$ 70,00"
  ],
  "answer": 0,
  "explanation": "As partes são 3k e 4k e somam 280: 7k = 280, logo k = 40. A menor parte é 3 × 40 = 120 e a maior é 4 × 40 = 160 (120 + 160 = 280). Erros comuns: responder a menor parte (120); tomar 3/4 do total (210); dividir por 2 (140), esquecendo a razão; ou responder o valor de k (70 seria 280 ÷ 4, em vez de 280 ÷ 7). Divisão proporcional: some as partes para achar k.",
  "lawRef": "Divisão em partes diretamente proporcionais"
 },
 {
  "id": "rlm-m11-autoral-17",
  "origem": "autoral-ia",
  "q": "Uma torneira de vazão constante enche 18 litros em 3 minutos. Quantos litros enche em 7 minutos?",
  "options": [
   "25 litros",
   "22 litros",
   "126 litros",
   "42 litros",
   "6 litros"
  ],
  "answer": 3,
  "explanation": "Vazão = 18 ÷ 3 = 6 litros por minuto. Em 7 minutos: 6 × 7 = 42 litros. Regra de três direta: 18/3 = x/7, x = 18 × 7 ÷ 3 = 42. Erros comuns: somar os 7 minutos aos 18 litros (25); somar a diferença de tempo, 18 + 4 = 22; multiplicar 18 por 7 sem dividir por 3 (126); ou parar na vazão por minuto (6). Mais tempo, mais água: grandezas diretas.",
  "lawRef": "Regra de três simples direta (vazão)"
 },
 {
  "id": "rlm-m11-autoral-18",
  "origem": "autoral-ia",
  "q": "Um percurso de 140 km fixos leva 3h30 a 40 km/h. Se a velocidade passar a 60 km/h, o mesmo percurso levará:",
  "options": [
   "2h33min",
   "2h20min",
   "5h15min",
   "2h30min",
   "2h"
  ],
  "answer": 1,
  "explanation": "Distância fixa: velocidade e tempo são inversamente proporcionais. Tempo = 140 ÷ 60 = 2,333... h, ou 2h e 0,333 × 60 = 20 minutos. Conferência: 40 × 3,5 = 140 km. Erros comuns: tratar como direta (3,5 × 60 ÷ 40 = 5,25 h = 5h15min); ler 2,33 h como 2h33min (o decimal não é minuto); estimar 2h30min sem conta; ou arredondar para 2h. Converta a parte decimal da hora multiplicando por 60.",
  "lawRef": "Regra de três inversa — velocidade e tempo"
 },
 {
  "id": "rlm-m11-autoral-19",
  "origem": "autoral-ia",
  "q": "Uma quantia de R$ 600,00 é dividida em partes inversamente proporcionais a 2 e 3. O valor da primeira parte é:",
  "options": [
   "R$ 240,00",
   "R$ 300,00",
   "R$ 450,00",
   "R$ 200,00",
   "R$ 360,00"
  ],
  "answer": 4,
  "explanation": "Partes inversamente proporcionais a 2 e 3 são diretamente proporcionais a 1/2 e 1/3. Multiplicando por 6: 3 e 2. Então a primeira parte é 3k e a segunda 2k, com 5k = 600 e k = 120. Primeira: 3 × 120 = 360; segunda: 2 × 120 = 240. Erros comuns: usar 2 e 3 diretamente (a primeira seria 240); dividir igualmente (300); tomar 3/4 do total (450); ou 1/3 de 600 (200). Inversa: quem tem o número maior recebe menos.",
  "lawRef": "Divisão em partes inversamente proporcionais"
 },
 {
  "id": "rlm-m11-autoral-20",
  "origem": "autoral-ia",
  "q": "Nove máquinas iguais produzem 540 peças em 6 horas. Quantas peças produzem 12 dessas máquinas em 5 horas?",
  "options": [
   "450 peças",
   "720 peças",
   "600 peças",
   "405 peças",
   "540 peças"
  ],
  "answer": 2,
  "explanation": "Regra de três composta, com grandezas diretas. Produção por máquina por hora: 540 ÷ (9 × 6) = 540 ÷ 54 = 10 peças. Com 12 máquinas em 5 horas: 12 × 5 × 10 = 600. Erros comuns: considerar só a mudança de tempo (540 × 5/6 = 450); só a mudança de máquinas (540 × 12/9 = 720); inverter o número de máquinas (540 × 9/12 = 405); ou não alterar nada (540). Compare cada grandeza com a incógnita separadamente.",
  "lawRef": "Regra de três composta"
 }
];
