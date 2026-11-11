/* Bateria autoral produzida para a Base Completa — RLM M01.
 * Revisão de 11/11/2026: problemas de mais de uma etapa no nível de prova de tribunal,
 * 5 alternativas com os erros de cálculo mais comuns e gabarito equilibrado (A–E, duas vezes cada).
 */
window.BC_RLM_M01_AUTHORIAL=[
  {
    "q": "O preço de um produto sofre aumento de 20% e, em seguida, desconto de 20% sobre o novo valor. Em relação ao preço inicial, o preço final é:",
    "options": [
      "igual ao inicial",
      "4% menor",
      "4% maior",
      "2% menor",
      "0,4% menor"
    ],
    "answer": 1,
    "explanation": "Porcentagens sucessivas se multiplicam: 1,20 × 0,80 = 0,96. O preço final é 96% do inicial, ou seja, 4% menor. O erro comum é somar +20% e −20% e concluir que nada mudou."
  },
  {
    "q": "Uma repartição tem 120 servidores, dos quais 3/5 são mulheres. Fazem plantão 1/4 das mulheres e 1/3 dos homens. Quantos servidores fazem plantão?",
    "options": [
      "30",
      "32",
      "36",
      "34",
      "40"
    ],
    "answer": 3,
    "explanation": "Mulheres: 3/5 de 120 = 72; plantão: 72 ÷ 4 = 18. Homens: 120 − 72 = 48; plantão: 48 ÷ 3 = 16. Total: 18 + 16 = 34."
  },
  {
    "q": "Um prêmio de R$ 5.400,00 será dividido entre dois servidores em partes inversamente proporcionais ao número de faltas no ano: 2 e 4 faltas. Quanto receberá o servidor com menos faltas?",
    "options": [
      "R$ 3.600,00",
      "R$ 1.800,00",
      "R$ 2.700,00",
      "R$ 3.000,00",
      "R$ 3.240,00"
    ],
    "answer": 0,
    "explanation": "Inversamente proporcional a 2 e 4 equivale a diretamente proporcional a 1/2 e 1/4, ou seja, a 2 e 1. São 3 partes de R$ 1.800,00: quem faltou menos recebe 2 × 1.800 = R$ 3.600,00. Dividir na razão direta 2:4 daria R$ 1.800,00, o erro mais comum."
  },
  {
    "q": "Seis servidores digitalizam 900 processos em 5 dias, trabalhando 6 horas por dia. Mantido o mesmo ritmo individual, quantos dias quatro servidores levarão para digitalizar 1.200 processos trabalhando 8 horas por dia?",
    "options": [
      "6",
      "7",
      "8",
      "10",
      "7,5"
    ],
    "answer": 4,
    "explanation": "Cada servidor digitaliza 900 ÷ (6 × 5 × 6) = 5 processos por hora. Quatro servidores, 8 horas por dia, fazem 4 × 8 × 5 = 160 processos por dia. Para 1.200 processos: 1.200 ÷ 160 = 7,5 dias."
  },
  {
    "q": "Na sequência 3, 7, 15, 31, 63, ..., o próximo termo é:",
    "options": [
      "95",
      "125",
      "127",
      "126",
      "129"
    ],
    "answer": 2,
    "explanation": "Cada termo é o dobro do anterior mais 1: 3 × 2 + 1 = 7; 7 × 2 + 1 = 15; ...; 63 × 2 + 1 = 127. Também se pode ver que as diferenças (4, 8, 16, 32) dobram: a próxima é 64, e 63 + 64 = 127."
  },
  {
    "q": "A média aritmética de cinco notas é 7,2. Retirada a maior nota, a média das quatro restantes passa a ser 6,5. Qual era a maior nota?",
    "options": [
      "10,0",
      "9,5",
      "9,0",
      "8,7",
      "7,9"
    ],
    "answer": 0,
    "explanation": "A soma das cinco notas é 5 × 7,2 = 36. A soma das quatro restantes é 4 × 6,5 = 26. A nota retirada vale 36 − 26 = 10. Fazer só a diferença das médias (7,2 − 6,5) leva a respostas erradas."
  },
  {
    "q": "Um servidor gastou 1/3 do salário com aluguel e 1/4 do restante com alimentação, sobrando R$ 2.400,00. Qual é o salário?",
    "options": [
      "R$ 3.600,00",
      "R$ 4.200,00",
      "R$ 6.000,00",
      "R$ 4.800,00",
      "R$ 5.400,00"
    ],
    "answer": 3,
    "explanation": "Depois do aluguel sobram 2/3 do salário. A alimentação consome 1/4 desse restante, ou seja, sobram 3/4 de 2/3 = 1/2 do salário. Se metade é R$ 2.400,00, o salário é R$ 4.800,00. Aplicar 1/4 sobre o salário inteiro, e não sobre o restante, é o erro comum."
  },
  {
    "q": "Um preço passou de R$ 80,00 para R$ 92,00 e, depois, voltou a R$ 80,00. Em relação a R$ 92,00, a redução foi de aproximadamente:",
    "options": [
      "15%",
      "13%",
      "12%",
      "11,5%",
      "15,5%"
    ],
    "answer": 1,
    "explanation": "A redução foi de R$ 12,00 sobre a base de R$ 92,00: 12 ÷ 92 ≈ 0,13, ou cerca de 13%. Os 15% correspondem ao aumento (12 ÷ 80), calculado sobre outra base."
  },
  {
    "q": "Cada processo leva 2 h 45 min para ser digitalizado e não pode ser interrompido de um dia para o outro. Em 4 dias de 8 horas de trabalho, quantos processos, no máximo, serão concluídos?",
    "options": [
      "11",
      "12",
      "8",
      "9",
      "10"
    ],
    "answer": 2,
    "explanation": "Um dia tem 8 h = 480 min, e cada processo leva 165 min. Cabem 2 processos por dia (330 min), porque o terceiro passaria de 480 min. Em 4 dias: 2 × 4 = 8. Dividir o tempo total (1.920 min ÷ 165 ≈ 11,6) ignora a restrição de não interromper o processo."
  },
  {
    "q": "Três alarmes tocam a cada 12, 18 e 30 minutos. Se tocaram juntos às 8 h, voltarão a tocar juntos pela primeira vez às:",
    "options": [
      "9 h 30 min",
      "10 h",
      "10 h 30 min",
      "12 h",
      "11 h"
    ],
    "answer": 4,
    "explanation": "Os alarmes voltam a coincidir no mínimo múltiplo comum dos intervalos: MMC(12, 18, 30) = 180 minutos = 3 horas. Logo, às 8 h + 3 h = 11 h."
  }
];
