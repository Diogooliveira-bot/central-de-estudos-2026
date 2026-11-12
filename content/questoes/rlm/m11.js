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
 }
];
