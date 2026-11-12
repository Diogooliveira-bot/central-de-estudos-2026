/* Base Completa | Raciocínio Lógico-Matemático M06 (Associação de Informações): dez questões originais autorais e comentadas.
 * Não são questões reais de bancas. Escritas em 11/11/2026 no nível de prova (5 alternativas),
 * com gabarito equilibrado (A–E, duas vezes cada); cada lei citada traz o nome e cada artigo, o que ele diz.
 * Fontes: Raciocínio lógico-matemático: correspondência entre conjuntos (tabela de dupla entrada), ordenações com restrições, verdade e mentira, contagem de arranjos e distinção entre conclusão necessária e possível.
 */
window.BC_RLM_AUTHORIAL_OVERRIDES=window.BC_RLM_AUTHORIAL_OVERRIDES||{};
window.BC_RLM_AUTHORIAL_OVERRIDES[6]=[
  {
    "id": "rlm-m06-autoral-01",
    "q": "Quatro servidores (Ana, Beto, Carla e Davi) foram escalados, cada um em um setor diferente (Protocolo, Arquivo, Cartório e Distribuição) e em um dia diferente da semana (segunda, terça, quarta e quinta-feira), de modo que cada setor e cada dia correspondem a um único servidor. Sabe-se que: (1) Ana não trabalha no Arquivo; (2) Beto atende na terça-feira; (3) Carla não trabalha na Distribuição nem no Protocolo; (4) o servidor do Arquivo atende no dia imediatamente seguinte ao do servidor do Protocolo; (5) Davi não atende na segunda nem na quinta-feira; (6) Ana atende em dia anterior ao de Carla. Com base nessas informações, é correto concluir, necessariamente, que:",
    "options": [
      "Beto trabalha no Arquivo e Davi, na Distribuição.",
      "Ana trabalha na Distribuição e Davi, no Protocolo.",
      "Carla trabalha no Cartório e Beto, no Protocolo.",
      "Ana atende na segunda-feira e Carla, na quinta-feira.",
      "Carla trabalha no Arquivo e Davi, no Protocolo."
    ],
    "answer": 3,
    "explanation": "Método da tabela com propagação de exclusões, pois a correspondência é um a um. Pela condição (2), Beto fica com a terça; pela (5), Davi não pode ficar com segunda nem quinta e a terça já é de Beto, logo Davi atende na quarta. Sobram segunda e quinta para Ana e Carla e, como Ana atende antes de Carla (6), Ana fica com a segunda e Carla com a quinta. Isso vale em todas as soluções. Já os setores admitem quatro distribuições compatíveis: (Ana, Beto, Carla, Davi) = (Protocolo, Arquivo, Cartório, Distribuição); (Cartório, Distribuição, Arquivo, Protocolo); (Distribuição, Protocolo, Cartório, Arquivo); ou (Distribuição, Cartório, Arquivo, Protocolo). Por isso as alternativas A, B e C valem em apenas uma solução cada, e a E vale em duas: são possíveis, mas não necessárias. Uma configuração que respeita o enunciado e contraria a alternativa já a descarta como conclusão necessária.",
    "lawRef": "Associação lógica — tabela de eliminação; conclusão necessária x possível",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "rlm-m06-autoral-02",
    "q": "Cinco candidatos (Lara, Marcos, Nina, Otávio e Paulo) formarão uma fila única, com posições numeradas de 1 a 5, sem empates. Sabe-se que: Lara fica imediatamente antes de Marcos; Nina não ocupa nenhuma das extremidades; Otávio fica em posição anterior à de Lara (não necessariamente imediatamente anterior); Paulo não é o último da fila. Quantas filas distintas satisfazem simultaneamente todas essas condições?",
    "options": [
      "1",
      "4",
      "6",
      "8",
      "9"
    ],
    "answer": 1,
    "explanation": "Trate \"Lara imediatamente antes de Marcos\" como um bloco de duas casas consecutivas e teste a posição do bloco. Como Otávio precisa estar antes de Lara, o bloco não pode começar na casa 1. Se o bloco ocupar as casas 2-3, Otávio fica na 1, Nina (que não pode ficar nas pontas) fica na 4 e Paulo na 5, o que viola a regra de Paulo não ser o último. Se ocupar as casas 3-4, Nina precisa ficar na 2 e Otávio na 1, restando a casa 5 para Paulo: novamente inválido. Resta o bloco nas casas 4-5. As casas 1, 2 e 3 recebem Nina, Otávio e Paulo, com Nina fora da casa 1: Nina na 2 (2 ordens para os outros dois) ou Nina na 3 (2 ordens), total 4. Quem esquece a restrição sobre Paulo obtém 6; quem ignora a de Otávio, 8; quem trata \"antes\" como \"imediatamente antes\" obtém só 1 fila.",
    "lawRef": "Associação lógica — ordenação com bloco (\"imediatamente antes\") e contagem de casos",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "rlm-m06-autoral-03",
    "q": "Quatro funcionários (Heitor, Irene, Jorge e Karla) são suspeitos de ter apagado um arquivo do sistema, e apenas um deles o fez. Cada um declarou: Heitor: \"Foi a Irene.\" Irene: \"Foi a Karla.\" Jorge: \"Não fui eu.\" Karla: \"A Irene está mentindo.\" Sabe-se que exatamente uma das quatro declarações é verdadeira. Quem apagou o arquivo?",
    "options": [
      "Heitor",
      "Irene",
      "Karla",
      "Não é possível determinar, pois mais de um funcionário é compatível com as declarações.",
      "Jorge"
    ],
    "answer": 4,
    "explanation": "Teste cada hipótese de culpado e conte as declarações verdadeiras, lembrando que o enunciado exige exatamente uma. Se Heitor fosse o culpado: a fala de Heitor (\"Foi a Irene\") é falsa; a de Irene (\"Foi a Karla\"), falsa; a de Jorge (\"Não fui eu\"), verdadeira, pois não foi ele; e a de Karla, verdadeira, pois a fala de Irene é falsa. Duas verdadeiras: hipótese descartada. Se fosse Irene: Heitor, Jorge e Karla dizem coisas verdadeiras (três), descartada. Se fosse Karla: Irene e Jorge acertam (duas), descartada. Se fosse Jorge: Heitor erra, Irene erra, Jorge mente ao negar a autoria, e apenas Karla acerta, ao dizer que Irene mente. Exatamente uma verdadeira, logo Jorge é o único culpado compatível. Existe, portanto, uma única solução, e a alternativa D é falsa. Contar \"pessoas honestas\" em vez de \"declarações verdadeiras\" leva aos erros A, B e C.",
    "lawRef": "Verdade e mentira — teste de hipóteses com contagem de afirmações verdadeiras",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "rlm-m06-autoral-04",
    "q": "Marcos, que sempre mente, fez a seguinte declaração: \"Se eu compareci à audiência, então assinei a ata ou paguei a taxa.\" Como a declaração inteira é falsa, conclui-se, necessariamente, que Marcos:",
    "options": [
      "não compareceu à audiência, não assinou a ata e não pagou a taxa.",
      "compareceu à audiência, não assinou a ata, mas pagou a taxa.",
      "compareceu à audiência e deixou de cumprir apenas uma das duas exigências: assinar a ata ou pagar a taxa.",
      "compareceu à audiência, não assinou a ata e não pagou a taxa.",
      "não compareceu à audiência, ou assinou a ata, ou pagou a taxa."
    ],
    "answer": 3,
    "explanation": "A fala de um mentiroso é falsa como proposição inteira, e não parcela por parcela. A declaração tem a forma P → (Q ∨ R), em que P é comparecer, Q é assinar a ata e R é pagar a taxa. Uma condicional só é falsa quando o antecedente é verdadeiro e o consequente é falso. Logo, P é verdadeiro (Marcos compareceu) e Q ∨ R é falso. Pela lei de De Morgan, a negação de uma disjunção exige que as duas parcelas sejam falsas: ele não assinou a ata e não pagou a taxa. Resultado: compareceu, não assinou e não pagou. A alternativa A nega também o antecedente; B e C admitem que uma das exigências foi cumprida (o \"ou\" falso exige as duas descumpridas); E é apenas a forma equivalente da própria condicional, ou seja, a declaração verdadeira que Marcos não pode ter feito.",
    "lawRef": "Negação da condicional e de De Morgan — fala de mentiroso é falsa como um todo",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "rlm-m06-autoral-05",
    "q": "Uma unidade distribui quatro processos (P1, P2, P3 e P4) entre três analistas (X, Y e Z). Cada processo é entregue a um único analista, mas um mesmo analista pode receber mais de um processo, ou nenhum. Sabe-se que: P1 não é entregue a X; P2 e P3 são entregues ao mesmo analista; P4 é entregue a analista diferente do que recebeu P1. De quantas maneiras diferentes a distribuição pode ser feita?",
    "options": [
      "6",
      "8",
      "12",
      "18",
      "36"
    ],
    "answer": 2,
    "explanation": "Aqui não há exclusividade: o enunciado permite repetição, e impor que analistas ou processos sejam distintos é o erro clássico. Conte por etapas, respeitando as restrições. P1 pode ir para Y ou Z: 2 possibilidades. P2 e P3 formam uma unidade, pois vão ao mesmo analista, que pode ser qualquer um dos três (inclusive o de P1): 3 possibilidades. P4 deve ir a analista diferente do de P1, sobrando 2 possibilidades. Total: 2 × 3 × 2 = 12. A resposta 18 (2 × 3 × 3) esquece a restrição de P4; 36 trata P2 e P3 como escolhas independentes (2 × 3 × 3 × 2); 8 supõe, sem autorização do texto, que P2 e P3 não podem ficar com o analista de P1 (2 × 2 × 2); 6 esquece de contar P4 (2 × 3).",
    "lawRef": "Associação sem exclusividade — princípio multiplicativo com restrições",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "rlm-m06-autoral-06",
    "q": "Três servidores fazem afirmações sobre a juntada de três documentos aos autos de um processo: o ofício, o parecer e o despacho. O primeiro diz: \"Se o ofício foi juntado, então o parecer foi juntado.\" O segundo diz: \"O ofício foi juntado ou o despacho foi juntado.\" O terceiro diz: \"Se o parecer foi juntado, então o despacho foi juntado.\" Sabe-se que exatamente uma dessas três afirmações é verdadeira. Conclui-se que:",
    "options": [
      "nenhum dos três documentos foi juntado.",
      "apenas o ofício foi juntado.",
      "apenas o despacho foi juntado.",
      "o ofício e o parecer foram juntados.",
      "apenas o parecer foi juntado."
    ],
    "answer": 4,
    "explanation": "Chame de X, Y e Z a juntada do ofício, do parecer e do despacho. As afirmações são I: X → Y; II: X ∨ Z; III: Y → Z. Como exatamente uma é verdadeira, teste as oito combinações. Nenhum juntado (X, Y, Z falsos): I e III verdadeiras, duas verdadeiras. Só o ofício: II e III verdadeiras (a III é verdadeira porque o antecedente é falso). Só o despacho: as três verdadeiras. Ofício e parecer: I e II verdadeiras. Só o parecer: I é verdadeira (antecedente falso), II é falsa (nem ofício nem despacho) e III é falsa (parecer juntado sem despacho): exatamente uma. As demais combinações (parecer e despacho; ofício e despacho; os três) resultam em duas ou três verdadeiras. Só resta a juntada apenas do parecer. Lembre que uma condicional com antecedente falso é verdadeira, o que explica as armadilhas das alternativas A e B.",
    "lawRef": "Exatamente uma afirmação verdadeira — tabela-verdade das condicionais",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "rlm-m06-autoral-07",
    "q": "Em uma ilha, todo habitante é veraz (sempre diz a verdade) ou mentiroso (sempre mente). Três habitantes declaram: A diz: \"B é mentiroso.\" B diz: \"A e C são do mesmo tipo.\" C diz: \"Entre nós três há exatamente um mentiroso.\" Pode-se concluir, necessariamente, que:",
    "options": [
      "C é mentiroso.",
      "A é veraz.",
      "B é veraz.",
      "A e B são do mesmo tipo.",
      "há exatamente um mentiroso entre os três."
    ],
    "answer": 0,
    "explanation": "Teste primeiro a hipótese de C ser veraz; então haveria exatamente um mentiroso entre A e B. Se A fosse veraz, B seria mentiroso e a fala de B (\"A e C são do mesmo tipo\") teria de ser falsa; mas A e C seriam ambos veracíssimos, ou seja, do mesmo tipo, e a fala seria verdadeira: contradição. Se A fosse mentiroso, B seria veraz e sua fala teria de ser verdadeira; mas A é mentiroso e C é veraz, tipos diferentes: contradição. Logo C é mentiroso, e a frase de C (\"há exatamente um mentiroso\") é falsa. Agora há duas soluções: A veraz e B mentiroso (a fala de B é falsa, pois A e C são de tipos diferentes, e a de C também é falsa, pois haveria dois mentirosos); ou A mentiroso e B veraz (a fala de B é verdadeira, pois A e C são ambos mentirosos, e a de A é falsa). Só \"C é mentiroso\" vale nas duas soluções. As alternativas B e C são apenas possíveis; D (A e B do mesmo tipo) e E (exatamente um mentiroso) são impossíveis.",
    "lawRef": "Verdade e mentira — teste de casos; conclusão necessária",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "rlm-m06-autoral-08",
    "q": "Cinco processos (P1 a P5) serão julgados, um por sessão, em cinco sessões consecutivas numeradas de 1 a 5, sem repetição de sessão. Sabe-se que: (1) P1 é julgado antes de P2, não necessariamente na sessão imediatamente anterior; (2) P3 é julgado na sessão imediatamente seguinte à de P2; (3) P4 não é julgado na 1ª nem na 5ª sessão; (4) P5 é julgado antes de P1. Assinale a afirmação que pode ser verdadeira, mas não é necessariamente verdadeira.",
    "options": [
      "P4 é julgado depois de P3.",
      "P1 é julgado na 2ª sessão.",
      "P5 é julgado na 1ª sessão.",
      "P2 é julgado na 4ª sessão.",
      "P4 é julgado antes de P2."
    ],
    "answer": 1,
    "explanation": "Como P5 vem antes de P1, e P1 antes de P2, o processo P2 só pode ser julgado da 3ª sessão em diante, e P3 vem logo depois dele. Se P2 fosse a 3ª sessão, P3 seria a 4ª, P5 e P1 ocupariam a 1ª e a 2ª, e sobraria a 5ª sessão para P4, o que a condição (3) proíbe. Logo P2 é a 4ª sessão e P3 a 5ª. Sobram as sessões 1, 2 e 3 para P5, P1 e P4, com P5 antes de P1 e P4 fora da 1ª sessão. Há exatamente duas soluções: P5, P1, P4 (P1 na 2ª sessão) ou P5, P4, P1 (P1 na 3ª sessão). Em ambas, P5 é julgado na 1ª sessão (C), P2 na 4ª (D) e P4 antes de P2 (E): essas três são necessárias. A (P4 depois de P3, que está na 5ª sessão) é impossível. A única que ocorre em uma solução e não na outra é B: P1 na 2ª sessão pode acontecer, mas não é necessário.",
    "lawRef": "Ordenação com restrições — afirmação possível x necessária",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "rlm-m06-autoral-09",
    "q": "Cinco pessoas (Alice, Bruno, Célia, Dino e Elisa) sentam-se em volta de uma mesa circular com cinco lugares iguais. Duas disposições que diferem apenas por uma rotação da mesa são consideradas iguais, mas disposições espelhadas são consideradas diferentes. Sabe-se que Alice senta-se ao lado de Bruno, que Dino senta-se ao lado de Elisa e que Bruno não se senta ao lado de Dino. De quantas maneiras as cinco pessoas podem se acomodar?",
    "options": [
      "6",
      "8",
      "24",
      "30",
      "120"
    ],
    "answer": 0,
    "explanation": "Como rotações não contam como disposições distintas, fixe Alice em um lugar; a mesa passa a ter quatro lugares livres numerados no sentido horário. Bruno senta-se imediatamente à direita ou à esquerda de Alice (2 casos, simétricos). Tome Bruno à direita de Alice e chame de 2, 3 e 4 os lugares seguintes. O lugar 2 (vizinho de Bruno) não pode ser de Dino, e Dino e Elisa precisam ser vizinhos. Dino e Elisa nos lugares 2-3: Dino não pode ficar no 2, então Elisa no 2, Dino no 3 e Célia no 4 (1 disposição). Dino e Elisa nos lugares 3-4: Célia fica no 2 e há duas ordens para o casal (2 disposições). São 3 disposições em cada caso, total 3 × 2 = 6. O valor 8 aparece quando se esquece uma das três restrições; 30 conta as rotações como diferentes (6 × 5); 24 e 120 ignoram as restrições (4! com Alice fixa, ou 5! em fila).",
    "lawRef": "Associação em mesa circular — fixar uma pessoa e contar com restrições",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "rlm-m06-autoral-10",
    "q": "Quatro candidatos (Ana, Bruno, Carla e Davi) foram aprovados e classificados do 1º ao 4º lugar, sem empates. Cada um escolheu um tribunal diferente para lotação: TJ, TRF, TRT e TRE. Sabe-se que: (1) Ana foi classificada imediatamente depois de Bruno; (2) Carla foi classificada antes de Davi; (3) Davi escolheu o TJ ou o TRE; (4) quem escolheu o TRF foi o último colocado; (5) quem escolheu o TRT foi classificado antes de quem escolheu o TRE; (6) Bruno não escolheu o TRE. Quem foi o 3º colocado e qual tribunal ele escolheu?",
    "options": [
      "Carla, TRT",
      "Davi, TRE",
      "Bruno, TJ",
      "Ana, TRF",
      "Davi, TJ"
    ],
    "answer": 2,
    "explanation": "Primeiro, a ordem. Por (1), Bruno e Ana formam o bloco \"Bruno-Ana\". Por (2), Carla vem antes de Davi. As ordens possíveis são: Carla-Davi-Bruno-Ana; Carla-Bruno-Ana-Davi; Bruno-Ana-Carla-Davi. Por (4), o último colocado escolheu o TRF; nas duas últimas ordens o último é Davi, que, por (3), só pode ficar com TJ ou TRE: contradição. Logo a ordem é Carla (1º), Davi (2º), Bruno (3º), Ana (4ª), e Ana escolheu o TRF. Agora os tribunais restantes (TJ, TRT, TRE) para Carla, Davi e Bruno. Bruno não escolheu o TRE (6) e Davi só TJ ou TRE (3). Se Davi ficasse com o TJ, o TRE iria para Carla (já que Bruno não pode) e o TRT para Bruno; mas (5) exige TRT antes de TRE, e Bruno (3º) vem depois de Carla (1ª): contradição. Então Davi escolheu o TRE; o TRT, que deve vir antes, é de Carla, e sobra o TJ para Bruno. O 3º colocado é Bruno, que escolheu o TJ.",
    "lawRef": "Associação lógica — tabela de eliminação com três categorias (pessoa, posição, tribunal)",
    "provenance": "questao-autoral-IA-revisada"
  }
];
