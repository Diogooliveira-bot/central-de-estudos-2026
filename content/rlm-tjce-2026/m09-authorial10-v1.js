/* Base Completa | Raciocínio Lógico-Matemático M09 (Orientação Espacial e Temporal): dez questões originais autorais e comentadas.
 * Não são questões reais de bancas. Escritas em 11/11/2026 no nível de prova (5 alternativas),
 * com gabarito equilibrado (A–E, duas vezes cada); cada lei citada traz o nome e cada artigo, o que ele diz.
 * Fontes: Raciocínio lógico-matemático: pontos cardeais e giros relativos, deslocamento e distância percorrida, teorema de Pitágoras em trajetos ortogonais, lateralidade, dias da semana (resto da divisão por 7), calendário, intervalos de tempo e imagem de relógio em espelho plano.
 */
window.BC_RLM_AUTHORIAL_OVERRIDES=window.BC_RLM_AUTHORIAL_OVERRIDES||{};
window.BC_RLM_AUTHORIAL_OVERRIDES[9]=[
  {
    "id": "rlm-m09-autoral-01",
    "q": "Um agente, inicialmente voltado para o norte, executa o seguinte trajeto: anda 6 m em frente; vira 90° à direita e anda 4 m; vira 90° à esquerda e anda 3 m; vira 90° à esquerda e anda 10 m; vira 90° à esquerda e anda 5 m, parando em seguida. Ao final, em relação ao ponto de partida, o agente se encontra:",
    "options": [
      "a 6 m a leste e 4 m ao norte, voltado para o sul.",
      "a 6 m a oeste e 4 m ao sul, voltado para o norte.",
      "a 4 m a oeste e 6 m ao norte, voltado para o sul.",
      "a 6 m a oeste e 4 m ao norte, voltado para o sul.",
      "a 6 m a oeste e 4 m ao norte, voltado para o leste."
    ],
    "answer": 3,
    "explanation": "Tome o leste como eixo x positivo e o norte como eixo y positivo, e atualize a orientação a cada giro (virar à direita ou à esquerda é relativo à direção atual). Partida em (0, 0), voltado para o norte. Anda 6 m: (0, 6). Direita: passa a olhar para o leste; anda 4 m: (4, 6). Esquerda: volta a olhar para o norte; anda 3 m: (4, 9). Esquerda: olha para o oeste; anda 10 m: (−6, 9). Esquerda: olha para o sul; anda 5 m: (−6, 4). Posição final: 6 m a oeste e 4 m ao norte do ponto de partida, voltado para o sul. A alternativa A inverte o sentido leste-oeste (confunde esquerda com direita); B erra o sinal vertical e a orientação; C troca os eixos; E acerta a posição, mas erra a orientação final, que resulta do último giro à esquerda a partir do oeste.",
    "lawRef": "Orientação espacial — giros relativos e coordenadas (leste/norte)",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "rlm-m09-autoral-02",
    "q": "Um carteiro parte de uma agência, caminha 7 km para o norte, depois 12 km para o leste e, por fim, 2 km para o sul. A diferença entre a distância que ele efetivamente percorreu e a menor distância, em linha reta, entre o ponto onde parou e a agência é de:",
    "options": [
      "4 km",
      "8 km",
      "9 km",
      "13 km",
      "21 km"
    ],
    "answer": 1,
    "explanation": "A distância percorrida é a soma dos trechos: 7 + 12 + 2 = 21 km. A posição final deve ser obtida por componentes: no eixo norte-sul, 7 km ao norte e 2 km ao sul resultam em 5 km ao norte; no eixo leste-oeste, 12 km a leste. Como os componentes são perpendiculares, a menor distância (linha reta) é a hipotenusa do triângulo retângulo de catetos 12 e 5: √(12² + 5²) = √169 = 13 km. A diferença pedida é 21 − 13 = 8 km. O erro 4 km vem de somar os componentes (12 + 5 = 17) como se fossem a linha reta, sem usar Pitágoras; 9 km vem de usar só o componente leste (21 − 12); 13 km e 21 km são, respectivamente, a distância em linha reta e a percorrida, mas não a diferença. Não confunda trajeto percorrido com deslocamento.",
    "lawRef": "Deslocamento x distância percorrida — componentes ortogonais e Pitágoras",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "rlm-m09-autoral-03",
    "q": "Um robô está voltado para o nordeste. Ele repete 7 vezes a seguinte sequência de giros: 135° no sentido horário, 45° no sentido anti-horário e 90° no sentido horário. Ao final das 7 repetições, o robô estará voltado para:",
    "options": [
      "o nordeste.",
      "o noroeste.",
      "o sudeste.",
      "o sul.",
      "o sudoeste."
    ],
    "answer": 4,
    "explanation": "Considere o sentido horário como positivo. Em cada repetição, o giro líquido é +135° − 45° + 90° = +180°. Em 7 repetições, o giro total é 7 × 180° = 1260°; como 1260 = 3 × 360 + 180, sobra um giro efetivo de 180°. O nordeste está a 45° do norte; somando 180°, chega-se a 225°, que corresponde ao sudoeste. Os erros previstos: tratar todos os giros como horários (270° por repetição, 1890° no total, resto 90°) leva ao sudeste; tratá-los como anti-horários leva ao noroeste; ignorar o giro de 45° (225° por repetição, 1575° no total, resto 135°) leva ao sul; supor que o resultado volta ao início (como se o giro líquido fosse múltiplo de 360°) leva ao nordeste. Quatro giros de 90° formam uma volta completa, e é o resto da divisão por 360° que importa.",
    "lawRef": "Giros — soma algébrica de ângulos e resto da divisão por 360°",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "rlm-m09-autoral-04",
    "q": "Ana, Bia e Caio estão lado a lado, em linha, todos voltados para o sul. Do ponto de vista deles, Ana está à esquerda de Bia e Caio está à direita de Bia. Dani está imediatamente atrás de Bia, e Elisa está 2 m ao sul de Caio, voltada de frente para ele. Assinale a alternativa correta.",
    "options": [
      "Ana é a que está mais a oeste, e Dani está ao sul de Bia.",
      "Caio é o que está mais a oeste, e a mão direita de Elisa aponta para o oeste.",
      "Caio é o que está mais a oeste, Dani está ao norte de Bia e a mão direita de Elisa aponta para o leste.",
      "Ana é a que está mais a oeste, Dani está ao norte de Bia e a mão direita de Elisa aponta para o leste.",
      "Caio é o que está mais a oeste, Dani está ao sul de Bia e a mão direita de Elisa aponta para o leste."
    ],
    "answer": 2,
    "explanation": "Lateralidade depende da orientação de quem olha. Quem está voltado para o sul tem o leste à esquerda e o oeste à direita. Logo, a pessoa que está à esquerda (Ana) fica mais a leste, e a que está à direita (Caio) fica mais a oeste. Dani está \"atrás\" de Bia: como Bia olha para o sul, as costas dela estão voltadas para o norte, então Dani está ao norte de Bia. Elisa está ao sul de Caio e olha de frente para ele, ou seja, olha para o norte; quem olha para o norte tem o leste à direita, então a mão direita de Elisa aponta para o leste. Portanto C é a única correta. A erra o lado de Ana e o \"atrás\"; B erra a mão de Elisa; D erra a posição de Ana; E erra a posição de Dani. Desenhe sempre uma rosa dos ventos e marque para onde cada pessoa olha.",
    "lawRef": "Posição relativa — direita e esquerda dependem da orientação do observador",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "rlm-m09-autoral-05",
    "q": "Um relatório é emitido a cada 45 dias. O 1º relatório foi emitido em uma segunda-feira. O 12º relatório será emitido em uma:",
    "options": [
      "sábado.",
      "terça-feira.",
      "quarta-feira.",
      "quinta-feira.",
      "sexta-feira."
    ],
    "answer": 0,
    "explanation": "Do 1º ao 12º relatório há 11 intervalos de 45 dias, ou seja, 11 × 45 = 495 dias. Como a semana se repete a cada 7 dias, interessa o resto da divisão: 495 = 7 × 70 + 5, resto 5. Avançando 5 dias a partir da segunda-feira: terça, quarta, quinta, sexta, sábado. O 12º relatório sai num sábado. Os erros típicos estão nos intervalos: usar 12 intervalos (540 dias, resto 1) leva à terça-feira; usar 10 intervalos (450 dias, resto 2) leva à quarta-feira; considerar só um intervalo (45 dias, resto 3) leva à quinta-feira; e 13 intervalos (585 dias, resto 4) leva à sexta-feira. Em contagens de eventos periódicos, o número de intervalos é sempre uma unidade a menos que o número de eventos.",
    "lawRef": "Dias da semana — resto da divisão por 7 e número de intervalos",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "rlm-m09-autoral-06",
    "q": "Em certo ano, o dia 10 de março caiu em uma terça-feira. Nesse mesmo ano, o dia 5 de junho caiu em uma:",
    "options": [
      "quarta-feira.",
      "quinta-feira.",
      "sábado.",
      "domingo.",
      "sexta-feira."
    ],
    "answer": 4,
    "explanation": "Conte os dias transcorridos de 10 de março a 5 de junho, sem incluir o dia de partida. Restam 21 dias em março (de 10 a 31), 30 em abril, 31 em maio e mais 5 dias em junho: 21 + 30 + 31 + 5 = 87 dias. Como 87 = 7 × 12 + 3, o resto é 3, e a semana avança 3 dias a partir da terça-feira: quarta, quinta, sexta. Portanto 5 de junho é sexta-feira. Os erros previstos: tratar todos os meses como de 30 dias dá 85 dias (resto 1) e leva à quarta-feira; esquecer que maio tem 31 dias dá 86 dias (resto 2) e leva à quinta-feira; contar o dia inicial (contagem inclusiva) dá 88 (resto 4) e leva ao sábado; e 89 dias (resto 5) levaria ao domingo. Atenção ao número de dias de cada mês.",
    "lawRef": "Calendário — contagem de dias entre datas e resto da divisão por 7",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "rlm-m09-autoral-07",
    "q": "Um plantonista iniciou seu turno às 22h40 e o encerrou às 6h15 do dia seguinte. Nesse período, fez uma pausa de 45 minutos, que não é computada como trabalho. O tempo efetivamente trabalhado foi de:",
    "options": [
      "6h50min",
      "7h35min",
      "8h20min",
      "15h40min",
      "16h25min"
    ],
    "answer": 0,
    "explanation": "Faça a linha do tempo, marcando a mudança de dia. De 22h40 até meia-noite decorrem 1h20min; de meia-noite até 6h15 decorrem 6h15min. O turno total tem 1h20 + 6h15 = 7h35min (em minutos: 80 + 375 = 455). Descontada a pausa de 45 minutos, o tempo trabalhado é 455 − 45 = 410 minutos, ou seja, 6h50min. A alternativa B é o turno total, sem descontar a pausa; C soma a pausa em vez de descontá-la (455 + 45 = 500 min = 8h20); D e E resultam de subtrair os horários sem considerar a virada do dia (22h40 − 6h15 = 16h25) e, em seguida, descontar ou não os 45 minutos (16h25 − 45 min = 15h40). Converter tudo para minutos evita erros nas viradas de hora.",
    "lawRef": "Intervalos de tempo — linha do tempo, virada do dia e conversão em minutos",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "rlm-m09-autoral-08",
    "q": "Um mês de 30 dias começa em uma quinta-feira. Os dias da semana que ocorrem exatamente cinco vezes nesse mês são:",
    "options": [
      "apenas a quinta-feira.",
      "quinta-feira, sexta-feira e sábado.",
      "quinta-feira e sexta-feira.",
      "sexta-feira e sábado.",
      "sábado e domingo."
    ],
    "answer": 2,
    "explanation": "Um mês de 30 dias tem 4 semanas completas (28 dias), em que cada dia da semana ocorre 4 vezes, mais 2 dias excedentes. Esses 2 dias são os primeiros do mês: dia 29 (quinta-feira) e dia 30 (sexta-feira). Portanto, quinta e sexta ocorrem 5 vezes, e os demais, 4 vezes. A alternativa B vale para um mês de 31 dias (3 dias excedentes: quinta, sexta e sábado); A vale para um mês de 29 dias (1 dia excedente); D e E contam os excedentes a partir de um dia errado: os dias excedentes são sempre os que iniciam o mês, na mesma ordem. Conferindo: as quintas são 1, 8, 15, 22 e 29 e as sextas são 2, 9, 16, 23 e 30; os sábados são 3, 10, 17 e 24, apenas quatro.",
    "lawRef": "Calendário — 4 semanas completas e dias excedentes do mês",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "rlm-m09-autoral-09",
    "q": "A imagem de um relógio de ponteiros, refletida em um espelho plano vertical, aparece marcando 8h20. A hora realmente marcada pelo relógio é:",
    "options": [
      "3h20",
      "3h40",
      "4h20",
      "4h40",
      "8h40"
    ],
    "answer": 1,
    "explanation": "Na imagem refletida, a esquerda e a direita do mostrador trocam de lado, e cada posição do ponteiro é simétrica em relação ao eixo vertical (12-6). Isso significa que a hora real e a hora vista somam 12h00. A hora real é, portanto, 12h00 − 8h20 = 3h40 (em minutos: 720 − 500 = 220 = 3h40). Conferência: às 3h40, o ponteiro dos minutos está sobre o 8 (40 min) e o das horas está entre o 3 e o 4; no espelho, o dos minutos aparece sobre o 4 (20 min) e o das horas entre o 8 e o 9, o que lê como 8h20. Os erros previstos: 4h40 vem de subtrair 12 − 8 = 4 e 60 − 20 = 40 sem pedir emprestado uma hora; 3h20 mantém os minutos; 4h20 também mantém os minutos e esquece o empréstimo; 8h40 espelha só os minutos.",
    "lawRef": "Espelhamento — imagem de relógio (hora real = 12h00 − hora vista)",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "rlm-m09-autoral-10",
    "q": "Dois veículos partem ao mesmo tempo de um mesmo ponto: um segue em linha reta para o leste a 60 km/h e o outro segue em linha reta para o norte a 80 km/h. Decorridas 1h30min da partida, qual é a distância, em linha reta, entre os dois veículos?",
    "options": [
      "90 km",
      "100 km",
      "120 km",
      "150 km",
      "210 km"
    ],
    "answer": 3,
    "explanation": "Converta o tempo: 1h30min = 1,5 h. O primeiro veículo percorre 60 × 1,5 = 90 km para o leste; o segundo, 80 × 1,5 = 120 km para o norte. As direções leste e norte são perpendiculares, de modo que as posições finais e o ponto de partida formam um triângulo retângulo de catetos 90 e 120. A distância entre os veículos é a hipotenusa: √(90² + 120²) = √(8100 + 14400) = √22500 = 150 km. Os erros: 90 km e 120 km são a distância percorrida por apenas um dos veículos; 100 km seria a distância entre eles após 1 hora (√(60² + 80²)), esquecendo os 30 minutos restantes; 210 km é a soma dos percursos (90 + 120), o que só valeria se andassem em sentidos opostos pela mesma reta. Perpendicularidade pede Pitágoras, não soma.",
    "lawRef": "Deslocamento no plano — velocidade, tempo e teorema de Pitágoras",
    "provenance": "questao-autoral-IA-revisada"
  }
];
