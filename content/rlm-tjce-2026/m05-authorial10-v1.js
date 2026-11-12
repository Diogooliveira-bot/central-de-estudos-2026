/* Base Completa | Raciocínio Lógico-Matemático M05 (Conjuntos e Diagramas Lógicos): dez questões originais autorais e comentadas.
 * Não são questões reais de bancas. Escritas em 11/11/2026 no nível de prova (5 alternativas),
 * com gabarito equilibrado (A–E, duas vezes cada); cada lei citada traz o nome e cada artigo, o que ele diz.
 * Fontes: Teoria dos conjuntos e diagramas de Venn e Euler: pertinência, inclusão, união, interseção, princípio da inclusão-exclusão (dois e três conjuntos), proposições categóricas e negação de quantificadores. Questões autorais.
 */
window.BC_RLM_AUTHORIAL_OVERRIDES=window.BC_RLM_AUTHORIAL_OVERRIDES||{};
window.BC_RLM_AUTHORIAL_OVERRIDES[5]=[
  {
    "id": "rlm-m05-autoral-01",
    "q": "Em um grupo de 140 servidores, 84 falam inglês, 63 falam espanhol e 21 não falam nenhum dos dois idiomas. O número de servidores que falam apenas espanhol é:",
    "options": [
      "28",
      "42",
      "35",
      "56",
      "63"
    ],
    "answer": 2,
    "explanation": "Se 21 servidores não falam nenhum idioma, falam pelo menos um deles 140 − 21 = 119. Pela união, |I ∪ E| = |I| + |E| − |I ∩ E|, logo 119 = 84 + 63 − |I ∩ E|, e |I ∩ E| = 147 − 119 = 28 (falam os dois). Apenas espanhol: 63 − 28 = 35. O valor 28 é a interseção, e não a região pedida; 42 resulta de subtrair do total de espanhol os 21 que não falam nada (63 − 21), erro de misturar o complementar com a interseção; 56 corresponde a apenas inglês (84 − 28); 63 é o total de falantes de espanhol, sem retirar quem também fala inglês. Conferência: 56 + 28 + 35 + 21 = 140.",
    "lawRef": "Princípio da inclusão-exclusão para dois conjuntos",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "rlm-m05-autoral-02",
    "q": "Uma pesquisa com 80 pessoas apurou que 42 usam o sistema A, 35 usam o B e 30 usam o C. Além disso, 15 usam A e B, 12 usam A e C, 10 usam B e C, e 5 usam os três sistemas. O número de pessoas que usam exatamente dois dos três sistemas é:",
    "options": [
      "22",
      "37",
      "32",
      "27",
      "17"
    ],
    "answer": 0,
    "explanation": "Os números das interseções duas a duas (15, 12 e 10) incluem as 5 pessoas que usam os três sistemas, contadas em cada par. Para obter só quem usa exatamente dois sistemas, retira-se a tripla de cada interseção: A e B apenas: 15 − 5 = 10; A e C apenas: 12 − 5 = 7; B e C apenas: 10 − 5 = 5. Soma: 10 + 7 + 5 = 22 (ou 37 − 3 × 5 = 22). O erro mais comum é somar as interseções sem retirar a tripla (37) ou retirá-la apenas uma vez (32). Retirar duas vezes dá 27 e quatro vezes dá 17, também incorretos. Conferência: usam só A, 42 − 10 − 7 − 5 = 20; só B, 35 − 10 − 5 − 5 = 15; só C, 30 − 7 − 5 − 5 = 13; união = 20 + 15 + 13 + 22 + 5 = 75, e 5 pessoas não usam nenhum dos três.",
    "lawRef": "Inclusão-exclusão para três conjuntos — regiões do diagrama de Venn",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "rlm-m05-autoral-03",
    "q": "Sabe-se que é falsa a afirmação \"Algum inscrito não foi habilitado\". Nessas condições, é necessariamente verdadeiro que:",
    "options": [
      "nenhum inscrito foi habilitado",
      "algum inscrito foi habilitado",
      "todo habilitado foi inscrito",
      "todo inscrito foi habilitado",
      "algum habilitado não foi inscrito"
    ],
    "answer": 3,
    "explanation": "A negação de \"Algum A não é B\" é \"Todo A é B\". Se é falso que algum inscrito não foi habilitado, então todos os inscritos foram habilitados. \"Nenhum inscrito foi habilitado\" é a contrária, não a negação, e é incompatível com a verdade de \"todo inscrito foi habilitado\" (se houver inscritos). \"Algum inscrito foi habilitado\" não é necessária: pela lógica usual, \"todo A é B\" é compatível com A vazio, e a afirmação \"algum\" exige que exista ao menos um inscrito. \"Todo habilitado foi inscrito\" inverte a relação (pode haver habilitados que nunca se inscreveram), e \"algum habilitado não foi inscrito\" também fala de habilitados fora do conjunto dos inscritos, sobre o que nada se afirmou. O diagrama correto tem o conjunto dos inscritos dentro do dos habilitados.",
    "lawRef": "Negação de quantificadores — \"algum A não é B\" e \"todo A é B\"",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "rlm-m05-autoral-04",
    "q": "Dos 70 candidatos de um grupo, alguns estudam as matérias Administrativo, Constitucional e Civil. Sabe-se que: 24 estudam Administrativo; 36 estudam Constitucional; 30 estudam Civil; todo candidato que estuda Administrativo também estuda Constitucional; 14 estudam Constitucional e Civil; 6 estudam Administrativo e Civil. O número de candidatos que estudam apenas Constitucional (e nenhuma das outras duas) é:",
    "options": [
      "8",
      "4",
      "12",
      "16",
      "22"
    ],
    "answer": 1,
    "explanation": "Como todo candidato de Administrativo estuda Constitucional, o conjunto A está dentro de B. Logo, os 6 que estudam A e C também estudam B, ou seja, A ∩ B ∩ C = 6. Dos 14 que estudam B e C, 6 estudam também A, de modo que 14 − 6 = 8 estudam B e C, mas não A. Os que estudam B sem C e sem A: |B| − |A| − 8 = 36 − 24 − 8 = 4 (todos os 24 de A estão dentro dos 36 de B). Conferência: apenas A e B, sem C: 24 − 6 = 18; A, B e C: 6; B e C sem A: 8; apenas B: 4; apenas C: 30 − 14 = 16. Total: 18 + 6 + 8 + 4 + 16 = 52, e 70 − 52 = 18 candidatos não estudam nenhuma das três. Os erros: 12 (36 − 24, esquecendo B ∩ C), 22 (36 − 14, esquecendo A), 8 (a região B e C sem A) e 16 (apenas Civil).",
    "lawRef": "Diagramas de Venn com inclusão de conjuntos — contagem por regiões",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "rlm-m05-autoral-05",
    "q": "Admita verdadeiras as premissas: (1) todo perito é bacharel; (2) algum perito é professor; (3) nenhum bacharel é analfabeto jurídico. Conclui-se, necessariamente, que:",
    "options": [
      "todo professor é bacharel",
      "algum professor é analfabeto jurídico",
      "todo bacharel é perito",
      "nenhum professor é perito",
      "algum professor não é analfabeto jurídico"
    ],
    "answer": 4,
    "explanation": "Por (2), há pelo menos um perito que é professor; por (1), esse perito é bacharel; por (3), nenhum bacharel é analfabeto jurídico, logo esse professor não é analfabeto jurídico. Portanto, existe um professor que não é analfabeto jurídico. As demais conclusões não são necessárias: \"todo professor é bacharel\" generaliza a partir de apenas alguns professores (os que são peritos); \"algum professor é analfabeto jurídico\" pode ser verdadeira, mas não é forçada pelas premissas (outro professor, fora dos peritos, poderia sê-lo); \"todo bacharel é perito\" inverte a premissa (1); e \"nenhum professor é perito\" contradiz a premissa (2). Em diagramas, o ponto da interseção entre perito e professor está dentro de B e fora de N.",
    "lawRef": "Silogismos categóricos — diagramas de Venn e Euler",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "rlm-m05-autoral-06",
    "q": "Em um grupo de 80 candidatos, 55 falam inglês e 48 falam espanhol. Sem outras informações sobre o grupo, o menor número possível de candidatos que falam os dois idiomas é:",
    "options": [
      "0",
      "7",
      "23",
      "48",
      "103"
    ],
    "answer": 2,
    "explanation": "O número de falantes de ambos é |I ∩ E| = |I| + |E| − |I ∪ E| = 103 − |I ∪ E|. Como |I ∪ E| não pode superar o total do grupo (80), |I ∩ E| ≥ 103 − 80 = 23. O mínimo ocorre quando todos os candidatos falam pelo menos um dos dois idiomas (ninguém fora da união). A resposta 0 supõe que os grupos possam ser disjuntos, o que é impossível porque 55 + 48 = 103 > 80; 7 é a diferença entre os dois grupos (55 − 48), sem relação com a interseção; 48 é o máximo possível da interseção (todo o grupo de espanhol dentro do de inglês); 103 é a soma, que ignora a duplicidade. Verificação: com 23 em comum, só inglês 32, só espanhol 25 e 32 + 23 + 25 = 80.",
    "lawRef": "Inclusão-exclusão — limites da interseção",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "rlm-m05-autoral-07",
    "q": "Considere os números inteiros de 1 a 100. A quantidade desses números que não são múltiplos de 4 nem de 6 é:",
    "options": [
      "67",
      "33",
      "59",
      "63",
      "75"
    ],
    "answer": 0,
    "explanation": "Múltiplos de 4 entre 1 e 100: 100 ÷ 4 = 25. Múltiplos de 6: ⌊100 ÷ 6⌋ = 16. Múltiplos de 4 e de 6 são múltiplos de mmc(4, 6) = 12: ⌊100 ÷ 12⌋ = 8. Pela inclusão-exclusão, são múltiplos de 4 ou de 6: 25 + 16 − 8 = 33. Nenhum dos dois: 100 − 33 = 67. Erros: 33 é a própria união; 59 resulta de 100 − 25 − 16, sem corrigir a interseção; 63 vem de tomar o produto 24 como se fosse o mmc (⌊100 ÷ 24⌋ = 4), obtendo 25 + 16 − 4 = 37 e 100 − 37; 75 conta apenas os que não são múltiplos de 4. O conjunto dos múltiplos comuns é o dos múltiplos do mmc, não do produto.",
    "lawRef": "Inclusão-exclusão com múltiplos — complemento da união",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "rlm-m05-autoral-08",
    "q": "Sabe-se que: (1) todo analista que domina SQL domina Python; (2) nenhum analista que domina Python é estagiário. Rui é analista e estagiário. Conclui-se, necessariamente, que Rui:",
    "options": [
      "domina SQL, mas não domina Python",
      "domina Python, mas não domina SQL",
      "domina SQL e Python",
      "não domina SQL nem Python",
      "não domina Python, mas pode ou não dominar SQL"
    ],
    "answer": 3,
    "explanation": "Rui é analista e estagiário. Pela premissa (2), como nenhum analista que domina Python é estagiário, Rui não domina Python. Pela premissa (1), todo analista que domina SQL domina Python; como Rui é analista e não domina Python, ele não pode dominar SQL (contrapositiva: quem não domina Python não domina SQL). Logo, Rui não domina nenhum dos dois. Em diagramas, SQL está inteiramente dentro de Python (para analistas) e Python está separado dos estagiários; Rui fica fora de Python e, portanto, fora de SQL. As duas primeiras alternativas e a terceira afirmam domínio de Python ou SQL, o que as premissas excluem; a última deixa SQL em aberto, mas a contrapositiva fecha a questão.",
    "lawRef": "Diagramas lógicos — inclusão, disjunção e contrapositiva",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "rlm-m05-autoral-09",
    "q": "Em uma turma de 50 candidatos, 22 estudam a disciplina A, 20 estudam a B e 18 estudam a C. Além disso, 8 estudam A e B, 7 estudam A e C, 6 estudam B e C (esses números incluem quem estuda as três), e 8 candidatos não estudam nenhuma das três disciplinas. O número de candidatos que estudam as três disciplinas é:",
    "options": [
      "0",
      "6",
      "8",
      "11",
      "3"
    ],
    "answer": 4,
    "explanation": "Pelo menos uma disciplina estudam 50 − 8 = 42 candidatos. A inclusão-exclusão dá |A ∪ B ∪ C| = |A| + |B| + |C| − |A ∩ B| − |A ∩ C| − |B ∩ C| + |A ∩ B ∩ C|. Substituindo: 42 = 22 + 20 + 18 − 8 − 7 − 6 + t = 60 − 21 + t = 39 + t, e t = 3. Conferência por regiões: só A e B, 8 − 3 = 5; só A e C, 7 − 3 = 4; só B e C, 6 − 3 = 3; só A, 22 − 5 − 4 − 3 = 10; só B, 20 − 5 − 3 − 3 = 9; só C, 18 − 4 − 3 − 3 = 8. Soma: 10 + 9 + 8 + 5 + 4 + 3 + 3 = 42. O erro de 11 vem de esquecer os 8 que não estudam nada (50 = 39 + t); 8 confunde a tripla com a região dos que não estudam nenhuma; 0 e 6 ignoram o termo da interseção tripla.",
    "lawRef": "Inclusão-exclusão para três conjuntos — incógnita na interseção tripla",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "rlm-m05-autoral-10",
    "q": "Sendo A = {1, 2, {3}, {1, 2}}, considere as afirmações: I. 3 ∈ A; II. {3} ∈ A; III. {1, 2} ⊆ A; IV. {1, 2} ∈ A; V. {3} ⊆ A; VI. ∅ ⊆ A. São verdadeiras apenas:",
    "options": [
      "II e IV",
      "II, III, IV e VI",
      "II, III e IV",
      "I, II, III, IV e VI",
      "II, III, IV, V e VI"
    ],
    "answer": 1,
    "explanation": "Pertinência (∈) relaciona elemento e conjunto; inclusão (⊆) relaciona conjuntos. Os elementos de A são quatro: 1, 2, {3} e {1, 2}. I é falsa: 3 não é elemento de A (o elemento é o conjunto {3}). II é verdadeira: {3} é elemento de A. III é verdadeira: {1, 2} é subconjunto de A porque 1 e 2 são elementos de A. IV é verdadeira: {1, 2} também é um elemento de A. V é falsa: {3} ⊆ A exigiria 3 ∈ A, o que é falso. VI é verdadeira: o conjunto vazio é subconjunto de qualquer conjunto. Logo, II, III, IV e VI. Quem confunde ∈ com ⊆ tende a só aceitar II e IV; quem esquece do vazio chega a II, III e IV; quem aceita o 3 como elemento erra em I e V.",
    "lawRef": "Noções de conjuntos — pertinência, inclusão e conjunto vazio",
    "provenance": "questao-autoral-IA-revisada"
  }
];
