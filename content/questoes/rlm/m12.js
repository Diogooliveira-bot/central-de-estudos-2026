/* Banco de questões — Raciocínio Lógico-Matemático, módulo 12. Questões autorais (não são de banca).
 * Para acrescentar questões, veja content/questoes/LEIAME.md e rode "npm run questoes:check". */
window.BC_QUESTOES=window.BC_QUESTOES||{};
(window.BC_QUESTOES.rlm=window.BC_QUESTOES.rlm||{})[12]=[
 {
  "id": "rlm-m12-autoral-01",
  "origem": "autoral-ia",
  "q": "Um produto recebeu desconto de 15%, passando a custar R$ 340,00. Em seguida, por pagamento a prazo, incidiu sobre esses R$ 340,00 um acréscimo de 10%. Em relação ao preço original, antes do desconto, o preço final é:",
  "options": [
   "5% menor",
   "15% menor",
   "aproximadamente 7% menor",
   "6,5% menor",
   "aproximadamente 4,3% menor"
  ],
  "answer": 3,
  "explanation": "Primeiro ache o preço original: com desconto de 15%, o fator é 0,85, logo o original é 340 ÷ 0,85 = R$ 400,00. O preço final é 340 × 1,10 = R$ 374,00. A variação em relação ao original é (374 − 400) ÷ 400 = −26 ÷ 400 = −6,5%. Pelos fatores: 0,85 × 1,10 = 0,935, ou seja, 93,5% do original. Erros: somar os percentuais (−15% + 10% = −5%); ignorar o acréscimo (−15%); usar o preço final como base (26 ÷ 374 ≈ 6,95%); e calcular o original somando 15% a 340 (340 × 1,15 = R$ 391,00), o que leva a (374 − 391) ÷ 391 ≈ −4,3%.",
  "lawRef": "Percentuais sucessivos por fator; valor original = valor final ÷ fator"
 },
 {
  "id": "rlm-m12-autoral-02",
  "origem": "autoral-ia",
  "q": "O preço de um insumo era de R$ 5.000,00 por tonelada. Em janeiro subiu 20%; em julho subiu mais 15% sobre o preço vigente; em outubro caiu 10% sobre o preço vigente. O preço por tonelada após a queda de outubro é:",
  "options": [
   "R$ 6.250,00",
   "R$ 6.210,00",
   "R$ 6.400,00",
   "R$ 6.075,00",
   "R$ 6.900,00"
  ],
  "answer": 1,
  "explanation": "Variações sucessivas se compõem multiplicando os fatores: 1,20 × 1,15 × 0,90 = 1,242. Passo a passo: 5.000 × 1,20 = 6.000; 6.000 × 1,15 = 6.900; 6.900 × 0,90 = R$ 6.210,00 (alta total de 24,2%). Erros: somar os percentuais (+20% + 15% − 10% = +25%), o que dá R$ 6.250,00; calcular a queda de 10% sobre o preço inicial (6.900 − 500), que dá R$ 6.400,00; somar os dois aumentos (35%) e só então aplicar a queda (5.000 × 1,35 × 0,90), que dá R$ 6.075,00; e parar antes da queda, R$ 6.900,00.",
  "lawRef": "Percentuais sucessivos — multiplicação de fatores, cada um sobre a base vigente"
 },
 {
  "id": "rlm-m12-autoral-03",
  "origem": "autoral-ia",
  "q": "Dois descontos sucessivos, de 10% e depois de 20%, deixaram o preço de uma mercadoria em R$ 360,00. O preço antes dos descontos era de:",
  "options": [
   "R$ 468,00",
   "R$ 475,20",
   "R$ 450,00",
   "R$ 514,29",
   "R$ 500,00"
  ],
  "answer": 4,
  "explanation": "Os descontos se compõem por multiplicação: 0,90 × 0,80 = 0,72, ou seja, o preço final é 72% do original (desconto total de 28%, e não 30%). Para achar o original, divida pelo fator: 360 ÷ 0,72 = R$ 500,00. Conferência: 500 × 0,90 = 450 e 450 × 0,80 = 360. Erros: somar os descontos (30%) e dividir por 0,70 dá R$ 514,29; acrescentar 30% ao preço final (360 × 1,30) dá R$ 468,00; acrescentar 10% e 20% ao preço final (360 × 1,10 × 1,20) dá R$ 475,20; e considerar só o desconto de 20% (360 ÷ 0,80) dá R$ 450,00.",
  "lawRef": "Valor original = valor final ÷ fator acumulado dos descontos sucessivos"
 },
 {
  "id": "rlm-m12-autoral-04",
  "origem": "autoral-ia",
  "q": "A taxa de inadimplência de uma carteira de crédito era de 12% e caiu para 9%. Depois, subiu 2 pontos percentuais, chegando a 11%. A variação relativa da taxa final em relação à taxa inicial, de 12%, foi uma:",
  "options": [
   "queda de aproximadamente 8,3%",
   "queda de 1%",
   "queda de 25%",
   "queda de aproximadamente 9,1%",
   "alta de aproximadamente 22,2%"
  ],
  "answer": 0,
  "explanation": "A variação relativa é (final − inicial) ÷ inicial, e a base é a taxa inicial: (11 − 12) ÷ 12 = −1 ÷ 12 ≈ −8,3%. A diferença de 1 ponto percentual (de 12% para 11%) mede a distância entre as taxas; não é o mesmo que \"1%\" de variação relativa, o que explica a alternativa da queda de 1%. A queda de 25% é só a primeira etapa (3 ÷ 12), e a alta de 22,2% é só a segunda (2 ÷ 9). A queda de 9,1% usa a taxa final como base (1 ÷ 11), quando o enunciado manda comparar com a taxa inicial.",
  "lawRef": "Variação relativa x pontos percentuais — a base é o valor inicial"
 },
 {
  "id": "rlm-m12-autoral-05",
  "origem": "autoral-ia",
  "q": "Uma pesquisa ouviu 1.200 servidores: 60% são mulheres. Entre as mulheres, 35% se declararam satisfeitas; entre os homens, 55%. Dentre os servidores satisfeitos, o percentual de mulheres é de, aproximadamente:",
  "options": [
   "21,0%",
   "35,0%",
   "48,8%",
   "43,0%",
   "60,0%"
  ],
  "answer": 2,
  "explanation": "Mulheres: 60% de 1.200 = 720; satisfeitas: 35% de 720 = 252. Homens: 1.200 − 720 = 480; satisfeitos: 55% de 480 = 264. Total de satisfeitos: 252 + 264 = 516. O que se pede é a participação das mulheres entre os satisfeitos, então o denominador é 516: 252 ÷ 516 ≈ 48,8%. Cada alternativa errada usa outra base: 21% é 252 ÷ 1.200 (mulheres satisfeitas sobre todos os servidores); 35% é a taxa de satisfação das mulheres; 43% é 516 ÷ 1.200, o percentual de satisfeitos no total; e 60% é a proporção de mulheres entre todos os pesquisados.",
  "lawRef": "Porcentagem em tabelas — escolher o total correto como denominador"
 },
 {
  "id": "rlm-m12-autoral-06",
  "origem": "autoral-ia",
  "q": "Um comerciante comprou uma mercadoria por R$ 240,00 e fixou o preço de venda de modo que o lucro fosse de 20% do próprio preço de venda. Depois, concedeu 10% de desconto sobre esse preço de venda. Em relação ao custo, o lucro final foi de:",
  "options": [
   "12,5%",
   "8%",
   "10%",
   "11,1%",
   "20%"
  ],
  "answer": 0,
  "explanation": "Lucro de 20% sobre a venda significa que o custo é 80% do preço de venda: PV = 240 ÷ 0,80 = R$ 300,00. Com desconto de 10%, o preço cai para 300 × 0,90 = R$ 270,00, e o lucro passa a ser 270 − 240 = R$ 30,00. Em relação ao custo (a base pedida): 30 ÷ 240 = 12,5%. Erros: calcular o preço de venda como custo + 20% do custo (288), o que dá 259,20 e lucro de 8% sobre o custo; subtrair os percentuais (20% − 10% = 10%); usar a venda como base (30 ÷ 270 ≈ 11,1%); ou ignorar o desconto (20%).",
  "lawRef": "Lucro sobre custo x lucro sobre venda — identificar a base de cada percentual"
 },
 {
  "id": "rlm-m12-autoral-07",
  "origem": "autoral-ia",
  "q": "Em 40 litros de uma solução, 25% do volume é álcool. Acrescentam-se 10 litros de álcool puro à solução. A porcentagem de álcool na nova solução é de:",
  "options": [
   "35%",
   "50%",
   "62,5%",
   "40%",
   "20%"
  ],
  "answer": 3,
  "explanation": "Álcool inicial: 25% de 40 = 10 L. Depois do acréscimo, há 10 + 10 = 20 L de álcool, e o volume total passa a ser 40 + 10 = 50 L. A concentração é 20 ÷ 50 = 40%. Erros: somar os pontos percentuais (25% + 10% = 35%); esquecer que o volume total aumentou (20 ÷ 40 = 50%); fazer a média simples das concentrações, (25% + 100%) ÷ 2 = 62,5%, o que só valeria para volumes iguais das duas partes (aqui são 40 L e 10 L); e dividir apenas o álcool acrescentado pelo total (10 ÷ 50 = 20%).",
  "lawRef": "Porcentagem de mistura — recalcular a base (volume total) após o acréscimo"
 },
 {
  "id": "rlm-m12-autoral-08",
  "origem": "autoral-ia",
  "q": "O preço de um produto caiu 20% e, em seguida, subiu 30%. Para voltar exatamente ao preço inicial, o preço atual deve sofrer uma queda de, aproximadamente (duas casas decimais):",
  "options": [
   "4,00%",
   "10,00%",
   "3,85%",
   "20,00%",
   "25,00%"
  ],
  "answer": 2,
  "explanation": "Com os fatores, o preço atual é 0,80 × 1,30 = 1,04 do inicial, isto é, 4% acima. Para voltar ao inicial, é preciso multiplicar por x tal que 1,04 · x = 1, ou seja, x = 1 ÷ 1,04 ≈ 0,9615, o que corresponde a queda de 1 − 0,9615 ≈ 3,85%. O cálculo de 4% usa o preço inicial como base, mas a queda incide sobre o preço atual (1,04): 0,04 ÷ 1,04 ≈ 3,85%. Os 10% resultam de 30% − 20%, desconsiderando as bases; os 20% repetem a primeira queda; e os 25% são a alta necessária para recuperar uma queda de 20% (1 ÷ 0,8 = 1,25), não a queda pedida.",
  "lawRef": "Variações sucessivas e inversão — fator inverso aplicado sobre a base atual"
 },
 {
  "id": "rlm-m12-autoral-09",
  "origem": "autoral-ia",
  "q": "Sabendo que 30% de 40% de um número N é igual a 36, o valor de N é:",
  "options": [
   "120",
   "90",
   "51,43",
   "3.000",
   "300"
  ],
  "answer": 4,
  "explanation": "Porcentagens encadeadas se multiplicam: 30% de 40% de N = 0,30 × 0,40 × N = 0,12 N. Então 0,12 N = 36 e N = 36 ÷ 0,12 = 300. Conferência: 40% de 300 = 120 e 30% de 120 = 36. Erros: considerar só o 30% (36 ÷ 0,3 = 120) ou só o 40% (36 ÷ 0,4 = 90); somar os percentuais, 30% + 40% = 70% (36 ÷ 0,7 ≈ 51,43); e errar duas casas decimais ao converter 12% (36 ÷ 0,012 = 3.000).",
  "lawRef": "Porcentagem de porcentagem — produto de fatores; conversão de % em decimal"
 },
 {
  "id": "rlm-m12-autoral-10",
  "origem": "autoral-ia",
  "q": "Em uma promoção, a loja anuncia \"leve 3, pague 2\" e ainda dá mais 10% de desconto sobre o valor a pagar. Uma pessoa compra 6 unidades de um produto que custa R$ 90,00 cada. Em relação ao preço sem promoção, o desconto total obtido é de:",
  "options": [
   "43,3%",
   "40,0%",
   "33,3%",
   "36,0%",
   "23,3%"
  ],
  "answer": 1,
  "explanation": "Sem promoção, 6 unidades custam 6 × 90 = R$ 540,00. Com \"leve 3, pague 2\", paga-se por 4 unidades: 4 × 90 = R$ 360,00 (desconto de 1/3, isto é, 33,3%). Sobre esse valor incidem 10% de desconto: 360 × 0,90 = R$ 324,00. Desconto total: (540 − 324) ÷ 540 = 216 ÷ 540 = 40%. Pelos fatores: 2/3 × 0,90 = 0,60, ou seja, paga-se 60% do preço. Erros: somar os descontos (33,3% + 10% = 43,3%); considerar só a promoção (33,3%); aplicar os 10% ao desconto da promoção (40% × 0,90 = 36%); e subtrair os percentuais (33,3% − 10% = 23,3%), em vez de compor os fatores.",
  "lawRef": "Descontos sucessivos por fator — não se somam percentuais de bases diferentes"
 },
 {
  "id": "rlm-m12-autoral-11",
  "origem": "autoral-ia",
  "q": "Dos 200 processos distribuídos a uma vara em um mês, 25% foram sentenciados. Quantos processos foram sentenciados?",
  "options": [
   "25",
   "40",
   "50",
   "75",
   "100"
  ],
  "answer": 2,
  "explanation": "25% é o mesmo que 25/100 = 1/4. Então 1/4 de 200 = 50 processos. Ou: 0,25 × 200 = 50. Erros comuns: responder o próprio 25 do enunciado; calcular 20% (40), por confundir com uma quinta parte; calcular 75% (75) ou 50% (100). Atalho: 25% é um quarto, então divida por 4.",
  "lawRef": "Porcentagem de uma quantidade"
 },
 {
  "id": "rlm-m12-autoral-12",
  "origem": "autoral-ia",
  "q": "Um material de escritório custava R$ 80,00 e sofreu aumento de 10%. O novo preço é:",
  "options": [
   "R$ 88,00",
   "R$ 90,00",
   "R$ 8,00",
   "R$ 72,00",
   "R$ 880,00"
  ],
  "answer": 0,
  "explanation": "Aumento de 10%: fator 1,10. 80 × 1,10 = 88. Outra forma: 10% de 80 = 8 e 80 + 8 = 88. Erros comuns: somar 10 reais em vez de 10% (90); responder só o valor do aumento (8); aplicar desconto em vez de acréscimo (72); ou errar a casa decimal (880). O acréscimo percentual incide sobre o preço, não é um valor fixo.",
  "lawRef": "Acréscimo percentual"
 },
 {
  "id": "rlm-m12-autoral-13",
  "origem": "autoral-ia",
  "q": "Em uma compra do tribunal, um fornecedor concedeu desconto de 20% sobre o preço de tabela. Para obter o valor a pagar, deve-se multiplicar o preço de tabela por:",
  "options": [
   "1,20",
   "0,20",
   "0,02",
   "0,80",
   "1,80"
  ],
  "answer": 3,
  "explanation": "Pagar com desconto de 20% significa pagar 100% − 20% = 80% do preço, ou seja, fator 0,80. Exemplo: 100 × 0,80 = 80. Erros comuns: usar 1,20, que é o fator de um acréscimo de 20%; usar 0,20, que é o valor do desconto e não o que se paga; 0,02, erro de casa decimal; ou 1,80, que seria acréscimo de 80%. Fator de desconto é 1 − taxa; fator de acréscimo é 1 + taxa.",
  "lawRef": "Fator de desconto"
 },
 {
  "id": "rlm-m12-autoral-14",
  "origem": "autoral-ia",
  "q": "Após um desconto de 25%, um equipamento passou a custar R$ 150,00. O preço antes do desconto era:",
  "options": [
   "R$ 187,50",
   "R$ 200,00",
   "R$ 175,00",
   "R$ 112,50",
   "R$ 600,00"
  ],
  "answer": 1,
  "explanation": "O preço com desconto é 75% do original: 0,75 × P = 150, então P = 150 ÷ 0,75 = 200. Conferência: 25% de 200 = 50 e 200 − 50 = 150. Erros comuns: aumentar 25% sobre 150 (187,50), esquecendo que o desconto incidiu sobre o original e não sobre 150; somar 25 reais (175); aplicar de novo o desconto (150 × 0,75 = 112,50); ou multiplicar por 4 (600). Para achar o original, divide-se pelo fator.",
  "lawRef": "Percentual sobre o valor original (fator)"
 },
 {
  "id": "rlm-m12-autoral-15",
  "origem": "autoral-ia",
  "q": "Um valor de R$ 100,00 recebe acréscimo de 20% e, em seguida, desconto de 20% sobre o novo valor. O resultado é:",
  "options": [
   "R$ 100,00",
   "R$ 104,00",
   "R$ 120,00",
   "R$ 80,00",
   "R$ 96,00"
  ],
  "answer": 4,
  "explanation": "Após +20%: 100 × 1,20 = 120. O desconto de 20% incide sobre 120: 120 × 0,80 = 96. Fator total: 1,20 × 0,80 = 0,96, ou seja, queda de 4%. Erros comuns: achar que +20% e −20% se anulam (100); inverter o sinal da variação líquida (104); ignorar o desconto (120); ou aplicar dois descontos (80). Percentuais sucessivos incidem sobre bases diferentes e não se somam.",
  "lawRef": "Percentuais sucessivos (fatores multiplicativos)"
 },
 {
  "id": "rlm-m12-autoral-16",
  "origem": "autoral-ia",
  "q": "O número de processos de uma vara passou de 80 para 100 entre dois semestres. A variação percentual foi de:",
  "options": [
   "20%",
   "25%",
   "125%",
   "80%",
   "75%"
  ],
  "answer": 1,
  "explanation": "Variação relativa = (valor final − valor inicial) ÷ valor inicial = (100 − 80) ÷ 80 = 20 ÷ 80 = 0,25 = 25%. Erros comuns: dividir a diferença pelo valor final (20 ÷ 100 = 20%); dar o valor final como percentual do inicial (125%); dar o inicial como percentual do final (80%); ou subtrair de 100% (75%). A base da variação é sempre o valor inicial.",
  "lawRef": "Variação percentual"
 },
 {
  "id": "rlm-m12-autoral-17",
  "origem": "autoral-ia",
  "q": "A taxa de congestionamento de um tribunal subiu de 12% para 17%. Quanto ela aumentou, em pontos percentuais?",
  "options": [
   "41,7 pontos percentuais",
   "12 pontos percentuais",
   "17 pontos percentuais",
   "5 pontos percentuais",
   "29 pontos percentuais"
  ],
  "answer": 3,
  "explanation": "Pontos percentuais são a diferença simples entre duas taxas: 17% − 12% = 5 pontos percentuais. O crescimento relativo seria 5 ÷ 12 ≈ 41,7%, mas isso não é o que se pede. Erros comuns: responder o crescimento relativo (41,7); repetir uma das taxas (12 ou 17); ou somar as taxas (29). Ponto percentual compara taxas entre si, subtraindo-as.",
  "lawRef": "Pontos percentuais x variação percentual"
 },
 {
  "id": "rlm-m12-autoral-18",
  "origem": "autoral-ia",
  "q": "Dois aumentos sucessivos de 15% equivalem a um aumento único de:",
  "options": [
   "32,25%",
   "30%",
   "31%",
   "30,5%",
   "35%"
  ],
  "answer": 0,
  "explanation": "Aumentos sucessivos multiplicam fatores: 1,15 × 1,15 = 1,3225, o que representa aumento de 32,25%. Exemplo: 100 sobe para 115 e depois 115 × 1,15 = 132,25. Erros comuns: somar 15% + 15% = 30%, esquecendo que o segundo aumento incide sobre o valor já aumentado; e valores como 31%, 30,5% ou 35%, que não resultam de nenhum cálculo correto. Use sempre o produto dos fatores.",
  "lawRef": "Aumentos sucessivos"
 },
 {
  "id": "rlm-m12-autoral-19",
  "origem": "autoral-ia",
  "q": "Um preço de R$ 240,00 sofre aumento de 25% e, depois, desconto de 20% sobre o valor já aumentado. O preço final é:",
  "options": [
   "R$ 300,00",
   "R$ 192,00",
   "R$ 252,00",
   "R$ 228,00",
   "R$ 240,00"
  ],
  "answer": 4,
  "explanation": "Fator total: 1,25 × 0,80 = 1,00, então o preço volta ao valor inicial. Passo a passo: 240 × 1,25 = 300 e 300 × 0,80 = 240. Erros comuns: ignorar o desconto (300); ignorar o aumento (240 × 0,80 = 192); somar +25 − 20 = +5% (252); ou subtrair os dois percentuais com sinal errado (228, equivalente a −5%). Um aumento de 25% é desfeito por desconto de 20%, porque o desconto incide sobre base maior.",
  "lawRef": "Percentuais sucessivos (fatores)"
 },
 {
  "id": "rlm-m12-autoral-20",
  "origem": "autoral-ia",
  "q": "A participação de um tipo de ação passou de 40% para 50% do total de processos. O acréscimo relativo dessa participação foi de:",
  "options": [
   "10%",
   "20%",
   "25%",
   "12,5%",
   "50%"
  ],
  "answer": 2,
  "explanation": "Variação relativa = (50 − 40) ÷ 40 = 10 ÷ 40 = 0,25 = 25%. A variação absoluta é 10 pontos percentuais, mas o enunciado pede acréscimo relativo. Erros comuns: responder 10% (confunde pontos percentuais com relativo); dividir por 50 (20%); dividir por 80 (12,5%, pois 10 ÷ 80), que usa base errada; ou repetir o 50. A base do acréscimo relativo é o valor inicial, 40%.",
  "lawRef": "Variação relativa x pontos percentuais"
 }
];
