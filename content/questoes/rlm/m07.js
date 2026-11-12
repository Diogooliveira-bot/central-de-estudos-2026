/* Banco de questões — Raciocínio Lógico-Matemático, módulo 07. Questões autorais (não são de banca).
 * Para acrescentar questões, veja content/questoes/LEIAME.md e rode "npm run questoes:check". */
window.BC_QUESTOES=window.BC_QUESTOES||{};
(window.BC_QUESTOES.rlm=window.BC_QUESTOES.rlm||{})[7]=[
 {
  "id": "rlm-m07-autoral-01",
  "origem": "autoral-ia",
  "q": "Considere a analogia: \"sismógrafo : ondas sísmicas :: anemômetro : ?\". Mantida a mesma relação entre o primeiro e o segundo termos (instrumento e fenômeno que ele registra ou mede), o termo que completa corretamente a analogia é:",
  "options": [
   "a temperatura do ar.",
   "a umidade relativa do ar.",
   "a pressão atmosférica.",
   "a velocidade do vento.",
   "o volume de chuva."
  ],
  "answer": 3,
  "explanation": "A primeira parte da analogia liga um instrumento ao fenômeno que ele registra ou mede: o sismógrafo registra as ondas sísmicas. A mesma relação deve valer no segundo par. O anemômetro é o instrumento que mede a velocidade do vento. As demais alternativas são grandezas que também têm seus instrumentos, mas não o anemômetro: a temperatura do ar é medida pelo termômetro; a umidade relativa, pelo higrômetro; a pressão atmosférica, pelo barômetro; e o volume de chuva, pelo pluviômetro. Todas são atraentes porque pertencem ao mesmo campo (meteorologia), mas a analogia exige a relação exata entre instrumento e grandeza, e não a proximidade temática.",
  "lawRef": "Analogia — relação instrumento : grandeza medida"
 },
 {
  "id": "rlm-m07-autoral-02",
  "origem": "autoral-ia",
  "q": "Em certo tribunal, sabe-se que: (1) todo analista judiciário é servidor público federal; (2) nenhum servidor público federal exerce mandato eletivo; (3) alguns bacharéis em Direito exercem mandato eletivo. A partir dessas três informações, conclui-se, necessariamente, que:",
  "options": [
   "algum bacharel em Direito não é analista judiciário.",
   "nenhum bacharel em Direito é servidor público federal.",
   "todo analista judiciário é bacharel em Direito.",
   "algum servidor público federal é bacharel em Direito.",
   "todo bacharel em Direito sem mandato eletivo é analista judiciário."
  ],
  "answer": 0,
  "explanation": "Pela informação (3), existe ao menos um bacharel em Direito que exerce mandato eletivo. Pela (2), quem exerce mandato eletivo não é servidor público federal; logo esse bacharel não é servidor federal. Pela (1), todo analista é servidor federal; por contraposição, quem não é servidor federal não é analista. Portanto esse bacharel não é analista judiciário, e a conclusão \"algum bacharel em Direito não é analista judiciário\" é necessária. B exagera: só se sabe que os bacharéis com mandato não são servidores, nada se diz dos demais. C e E invertem a direção da relação em (1): \"todo analista é servidor\" não equivale a \"todo servidor (ou bacharel) é analista\". D não é necessária: as informações não garantem que exista algum bacharel entre os servidores, apenas que nada o impede.",
  "lawRef": "Relações entre classes — direção da relação e contraposição"
 },
 {
  "id": "rlm-m07-autoral-03",
  "origem": "autoral-ia",
  "q": "Um conceito C é definido como o conjunto dos números inteiros positivos menores que 100 que são múltiplos de 4, não são múltiplos de 3 e não são múltiplos de 10. Quantos elementos tem o conjunto C?",
  "options": [
   "12",
   "13",
   "16",
   "21",
   "24"
  ],
  "answer": 1,
  "explanation": "As três condições devem valer ao mesmo tempo (interseção). Os múltiplos de 4 menores que 100 são 4, 8, ..., 96: 24 números. Retiramos os múltiplos de 3; como já são múltiplos de 4, são os múltiplos de 12 (12, 24, ..., 96): 8 números, restando 16. Agora retiramos os múltiplos de 10 que ainda estão no conjunto: os múltiplos de 4 e de 10 são os múltiplos de 20 (20, 40, 60, 80), mas o 60 já saiu na etapa anterior (é múltiplo de 12), então só saem 20, 40 e 80. Restam 16 − 3 = 13 elementos. O resultado 12 vem de retirar o 60 duas vezes; 16 esquece a terceira condição; 21 retira os três múltiplos de 10 sem aplicar a condição sobre o 3; 24 considera só os múltiplos de 4.",
  "lawRef": "Conceitos com condições combinadas — interseção e contagem sem dupla subtração"
 },
 {
  "id": "rlm-m07-autoral-04",
  "origem": "autoral-ia",
  "q": "Quatro dos cinco números abaixo pertencem ao mesmo conceito, definido por uma única propriedade aritmética. Assinale o número que NÃO pertence a esse conceito.",
  "options": [
   "48",
   "72",
   "96",
   "120",
   "150"
  ],
  "answer": 4,
  "explanation": "Procure uma propriedade que valha para quatro números e falhe em um só, testando-a em todo o grupo. Todos os cinco números são múltiplos de 6 (e de 3, e pares), de modo que essas propriedades não discriminam nenhum deles, o que torna a questão traiçoeira. Já 48 = 2 × 24, 72 = 3 × 24, 96 = 4 × 24 e 120 = 5 × 24 são múltiplos de 24, enquanto 150 = 6 × 24 + 6 deixa resto 6 e, portanto, não é múltiplo de 24. A mesma separação ocorre com a propriedade \"múltiplo de 8\" (150 não é) e \"múltiplo de 12\" (150 não é). Propriedades parciais, como \"termina em zero\" (120 e 150) ou \"tem dois algarismos\" (48, 72, 96), explicam apenas parte dos dados e por isso devem ser descartadas. O elemento discrepante é 150.",
  "lawRef": "Elemento discrepante — critério único que explica todos os dados"
 },
 {
  "id": "rlm-m07-autoral-05",
  "origem": "autoral-ia",
  "q": "Rui é irmão de Sara. Sara é mãe de Tadeu, e Tadeu é pai de Úrsula. Nessas condições, Úrsula é, em relação a Rui:",
  "options": [
   "sobrinha-neta.",
   "sobrinha.",
   "prima.",
   "neta.",
   "sobrinha-bisneta."
  ],
  "answer": 0,
  "explanation": "Siga a cadeia de parentesco passo a passo. Rui é irmão de Sara; Sara é mãe de Tadeu, logo Tadeu é sobrinho de Rui (filho da irmã). Úrsula é filha de Tadeu, ou seja, filha de um sobrinho de Rui e, portanto, sobrinha-neta de Rui. A alternativa B para no primeiro degrau da cadeia (só seria sobrinha se fosse filha de Sara); C (prima) exigiria que um dos pais de Úrsula fosse irmão de um dos pais de Rui; D exigiria que Úrsula fosse filha de um filho de Rui; E avança uma geração além do que o enunciado informa. Em questões de parentesco, cada \"é pai de\", \"é mãe de\" ou \"é irmão de\" precisa ser aplicado na direção correta, pois a relação é assimétrica.",
  "lawRef": "Relações assimétricas — cadeia de parentesco"
 },
 {
  "id": "rlm-m07-autoral-06",
  "origem": "autoral-ia",
  "q": "Em um tribunal, é considerado \"processo prioritário\" aquele que atende, ao mesmo tempo, às duas condições seguintes: (i) o autor tem 60 anos de idade ou mais, ou a causa envolve doença grave; (ii) o processo não está sobrestado (suspenso). Os cinco processos abaixo foram analisados.\nI. Autor com 59 anos, causa sem doença grave, em tramitação normal.\nII. Autor com 72 anos, causa sem doença grave, processo sobrestado.\nIII. Autor com exatamente 60 anos, causa sem doença grave, em tramitação normal.\nIV. Autor com 41 anos, causa envolvendo doença grave, processo sobrestado.\nV. Autor com 38 anos, causa sem doença grave, em tramitação normal.\nSão prioritários:",
  "options": [
   "somente o processo I.",
   "os processos I, III e V.",
   "somente o processo III.",
   "os processos II, III e IV.",
   "os processos II e IV."
  ],
  "answer": 2,
  "explanation": "Aplique os dois critérios a cada processo. A condição (i) é uma disjunção (idade de 60 anos ou mais OU doença grave) e a (ii) é uma exigência simultânea (não estar sobrestado). I: 59 anos e sem doença grave, falha em (i). II: cumpre (i) pela idade, mas está sobrestado e falha em (ii). III: \"60 anos ou mais\" inclui exatamente 60, logo cumpre (i), e está em tramitação normal, cumprindo (ii): prioritário. IV: cumpre (i) pela doença grave, mas está sobrestado: falha em (ii). V: 38 anos e sem doença grave, falha em (i). Só o III é prioritário. As armadilhas: B ignora a condição (i) e considera só a tramitação normal; D ignora a condição (ii) e aceita os sobrestados; E faz o mesmo e ainda lê \"60 anos ou mais\" como \"mais de 60 anos\", excluindo o processo III; A arredonda os 59 anos do processo I.",
  "lawRef": "Conceito com condições simultâneas — interseção de critérios"
 },
 {
  "id": "rlm-m07-autoral-07",
  "origem": "autoral-ia",
  "q": "Considere a relação: \"cão : mamífero\". Assinale o par de termos que mantém, na mesma ordem, a relação existente entre o primeiro e o segundo termos do par dado.",
  "options": [
   "mamífero : baleia",
   "planeta : Terra",
   "roda : carro",
   "árvore : floresta",
   "triângulo : polígono"
  ],
  "answer": 4,
  "explanation": "A relação \"cão : mamífero\" é de elemento particular para a classe a que pertence (o cão é um tipo de mamífero), na direção do específico para o geral. Quem identifica apenas a proximidade entre os termos erra a direção. Em \"triângulo : polígono\", o triângulo é um tipo de polígono, com a mesma relação e a mesma ordem. As demais alternativas trazem outras relações. \"Mamífero : baleia\" e \"planeta : Terra\" mantêm a ideia de classe e elemento, porém na ordem inversa (do geral para o específico). \"Roda : carro\" é relação de parte e todo, e \"árvore : floresta\" liga elemento a coletivo, que não coincide com \"ser um tipo de\". A analogia é proporcional e compara relações, não termos: a relação é assimétrica e não pode ser trocada pela sua inversa.",
  "lawRef": "Analogia — relação \"tipo de\" (específico para geral) e sua direção"
 },
 {
  "id": "rlm-m07-autoral-08",
  "origem": "autoral-ia",
  "q": "Em um setor com 30 servidores, 18 dominam o idioma inglês e 14 dominam o espanhol. Nada se sabe sobre quantos dominam os dois idiomas ou nenhum deles. A única afirmação necessariamente verdadeira é:",
  "options": [
   "no máximo 2 servidores dominam os dois idiomas.",
   "exatamente 2 servidores dominam os dois idiomas.",
   "pelo menos 1 servidor não domina nenhum dos dois idiomas.",
   "pelo menos 2 servidores dominam os dois idiomas.",
   "mais da metade dos servidores domina os dois idiomas."
  ],
  "answer": 3,
  "explanation": "Seja x o número de servidores que dominam os dois idiomas. Quem domina pelo menos um idioma são 18 + 14 − x = 32 − x servidores, e esse total não pode passar de 30, o que força x ≥ 2. Assim, \"pelo menos 2 dominam os dois idiomas\" é necessária. Quanto ao máximo, x só pode chegar a 14 (todos os de espanhol também falam inglês), não a 2: logo A é falsa em algumas configurações. B é apenas possível (x = 2), mas x pode valer de 2 a 14. Os servidores sem nenhum dos dois idiomas são 30 − (32 − x) = x − 2, o que dá zero quando x = 2: então C é possível, mas não necessária. E é impossível, pois mais da metade seria mais de 15 servidores e o máximo é 14. Hipótese compatível não é conclusão necessária.",
  "lawRef": "Conclusão necessária x possível — extremos de interseção de conjuntos"
 },
 {
  "id": "rlm-m07-autoral-09",
  "origem": "autoral-ia",
  "q": "Em certo código, cada letra de uma palavra é substituída por outra, segundo uma regra fixa de deslocamento no alfabeto de 26 letras, que recomeça em A depois do Z. Nesse código, a palavra TRAMITE é escrita como WUDPLWH. No mesmo código, a palavra PRAZO é escrita como:",
  "options": [
   "MOXWL",
   "SUDCR",
   "SUDBR",
   "SUDDR",
   "RTCBQ"
  ],
  "answer": 1,
  "explanation": "Compare as letras correspondentes: T→W, R→U, A→D, M→P, I→L, T→W, E→H. Em todas, a letra codificada está 3 posições à frente no alfabeto. Aplique o deslocamento de +3 a PRAZO: P→S, R→U, A→D, Z→C (após Z, o alfabeto recomeça: A, B, C) e O→R, resultando em SUDCR. O erro de MOXWL é deslocar na direção contrária (−3); SUDBR e SUDDR erram o recomeço do alfabeto depois do Z (contam uma casa a menos ou a mais); RTCBQ usa deslocamento de 2 posições, que não bate com o exemplo dado. Sempre extraia a regra de todos os pares conhecidos e confira-a em cada letra antes de aplicá-la à palavra pedida, atentando para o ciclo do alfabeto.",
  "lawRef": "Código de substituição — deslocamento fixo com recomeço do alfabeto"
 },
 {
  "id": "rlm-m07-autoral-10",
  "origem": "autoral-ia",
  "q": "Em um órgão, as relações de subordinação direta são as seguintes: Carlos é subordinado direto de Dora; Dora é subordinada direta de Edu; Edu e Helena são subordinados diretos de Fábio; Fábio é subordinado direto de Gil. Considerando que a relação é transitiva (quem é superior ao superior de alguém também é superior a essa pessoa), quantas pessoas são hierarquicamente superiores a Dora?",
  "options": [
   "1",
   "2",
   "3",
   "4",
   "5"
  ],
  "answer": 2,
  "explanation": "Monte a cadeia no sentido ascendente a partir de Dora: Dora é subordinada direta de Edu; Edu é subordinado direto de Fábio; Fábio é subordinado direto de Gil. Pela transitividade, são superiores a Dora: Edu (superior direto), Fábio (superior do superior) e Gil (superior de Fábio). São 3 pessoas. O resultado 1 considera apenas o superior direto; 2 esquece Gil; 4 inclui Helena, que é subordinada de Fábio, ou seja, colega de Edu e não superior de Dora (estar no mesmo nível de um superior não gera relação de superioridade); 5 inclui ainda Carlos, que é subordinado a Dora e, portanto, está abaixo dela. A relação de subordinação é assimétrica: o sentido (quem é subordinado de quem) precisa ser respeitado em cada elo.",
  "lawRef": "Relação de ordem — transitividade e direção da subordinação"
 }
];
