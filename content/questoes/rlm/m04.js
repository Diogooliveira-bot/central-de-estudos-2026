/* Banco de questões — Raciocínio Lógico-Matemático, módulo 04. Questões autorais (não são de banca).
 * Para acrescentar questões, veja content/questoes/LEIAME.md e rode "npm run questoes:check". */
window.BC_QUESTOES=window.BC_QUESTOES||{};
(window.BC_QUESTOES.rlm=window.BC_QUESTOES.rlm||{})[4]=[
 {
  "id": "rlm-m04-autoral-01",
  "origem": "autoral-ia",
  "q": "Considere os cinco argumentos abaixo (o \"ou\" deve ser entendido como inclusivo). Assinale aquele que é válido.",
  "options": [
   "Se Ana for aprovada, será nomeada. Ana foi nomeada. Logo, Ana foi aprovada.",
   "Se Beto recorrer, o prazo será suspenso. Beto não recorreu. Logo, o prazo não foi suspenso.",
   "Dora é juíza ou é promotora. Dora é juíza. Logo, Dora não é promotora.",
   "Todo perito é bacharel. Algum bacharel é professor. Logo, algum perito é professor.",
   "Se Caio recorrer, o prazo será suspenso. O prazo não foi suspenso. Logo, Caio não recorreu."
  ],
  "answer": 4,
  "explanation": "O argumento válido tem a forma do modus tollens: P → Q; ¬Q; logo ¬P. Se recorrer implica suspensão e a suspensão não ocorreu, Caio não pode ter recorrido. Os demais são inválidos: (1) \"Se Ana for aprovada, será nomeada; foi nomeada; logo, foi aprovada\" afirma o consequente (Ana pode ter sido nomeada por outro caminho); (2) \"Se Beto recorrer, o prazo é suspenso; não recorreu; logo, o prazo não foi suspenso\" nega o antecedente (a suspensão pode ter outra causa); (3) \"J ou P; J; logo, não P\" só valeria para o \"ou\" exclusivo, mas com o \"ou\" inclusivo Dora pode ser juíza e promotora; (4) \"Todo perito é bacharel; algum bacharel é professor; logo, algum perito é professor\": o bacharel professor pode não ser perito. Em todos, basta um contraexemplo com premissas verdadeiras e conclusão falsa.",
  "lawRef": "Modus tollens e falácias de argumentação (afirmação do consequente, negação do antecedente)"
 },
 {
  "id": "rlm-m04-autoral-02",
  "origem": "autoral-ia",
  "q": "Admita verdadeiras as premissas: (1) se há quórum, a sessão é aberta; (2) se a sessão é aberta, a pauta é votada; (3) a pauta não foi votada; (4) há quórum ou o presidente adiou a sessão (ou inclusivo). Dessas premissas conclui-se, necessariamente, que:",
  "options": [
   "houve quórum e o presidente não adiou a sessão",
   "a sessão foi aberta, mas a pauta não foi votada",
   "não houve quórum e o presidente adiou a sessão",
   "não houve quórum, mas a sessão foi aberta",
   "houve quórum e a pauta foi votada"
  ],
  "answer": 2,
  "explanation": "Encadeando (1) e (2), obtém-se: se há quórum, a pauta é votada. Como a pauta não foi votada (3), pelo modus tollens não há quórum (¬Q). Na premissa (4), \"há quórum ou o presidente adiou\", a primeira parcela é falsa; para a disjunção ser verdadeira, a segunda tem de ser: o presidente adiou a sessão (silogismo disjuntivo). Logo: sem quórum e com adiamento. As demais alternativas contradizem as premissas: afirmar quórum nega a conclusão do modus tollens; \"a sessão foi aberta\" também levaria à pauta votada (por 2); e \"houve quórum e a pauta foi votada\" contraria (3).",
  "lawRef": "Silogismo hipotético, modus tollens e silogismo disjuntivo"
 },
 {
  "id": "rlm-m04-autoral-03",
  "origem": "autoral-ia",
  "q": "Considere as premissas: (1) todo analista é bacharel; (2) algum bacharel é perito; (3) nenhum perito é estagiário. Dessas premissas conclui-se, necessariamente, que:",
  "options": [
   "algum analista é perito",
   "algum bacharel não é estagiário",
   "nenhum analista é estagiário",
   "todo bacharel é perito",
   "algum perito não é bacharel"
  ],
  "answer": 1,
  "explanation": "Pela premissa (2), existe pelo menos um bacharel que é perito; pela (3), esse perito não é estagiário. Portanto, existe um bacharel que não é estagiário: \"algum bacharel não é estagiário\". As outras conclusões podem ser falsas com premissas verdadeiras: \"algum analista é perito\" exigiria que o bacharel perito fosse analista, o que as premissas não dizem (todo analista é bacharel, mas não o inverso); \"nenhum analista é estagiário\" é falso se algum analista, bacharel que não seja perito, for estagiário (a premissa 3 só fala de peritos); \"todo bacharel é perito\" inverte indevidamente (2), que só garante existência; e \"algum perito não é bacharel\" nada tem de necessário: os peritos podem ser todos bacharéis. Em diagramas, o ponto comum entre B e P está fora de E.",
  "lawRef": "Silogismos categóricos — \"todo\", \"algum\" e \"nenhum\""
 },
 {
  "id": "rlm-m04-autoral-04",
  "origem": "autoral-ia",
  "q": "Considere o argumento: premissa (1) \"A petição só é indeferida se for intempestiva\"; premissa (2) \"A petição é indeferida ou o autor emenda a petição\" (ou inclusivo); conclusão: \"O autor emenda a petição\". Para que o argumento se torne válido, é suficiente acrescentar a premissa:",
  "options": [
   "a petição foi indeferida",
   "a petição é intempestiva",
   "o autor não emendou a petição",
   "a petição é tempestiva",
   "a petição é intempestiva ou foi indeferida"
  ],
  "answer": 3,
  "explanation": "Seja I = \"indeferida\", T = \"tempestiva\" e E = \"o autor emenda\". A premissa (1) é I → ¬T e a (2) é I ∨ E. Se acrescentarmos T, a contrapositiva de (1), T → ¬I, dá ¬I; em (2), com I falsa, a outra parcela precisa ser verdadeira: E. O argumento fica válido. As outras opções não garantem E: \"foi indeferida\" torna a disjunção (2) verdadeira por si só e deixa E livre; \"é intempestiva\" nada diz sobre I (a condicional (1) não é reversível); \"o autor não emendou\" é justamente a negação da conclusão (com ela, as premissas ainda podem ser verdadeiras, com I verdadeira e T falsa, e a conclusão fica falsa); e a disjunção \"intempestiva ou indeferida\" tampouco afasta I.",
  "lawRef": "Validade — premissa adicional e silogismo disjuntivo"
 },
 {
  "id": "rlm-m04-autoral-05",
  "origem": "autoral-ia",
  "q": "Três servidores — Ari, Beto e Cris — são suspeitos de ter vazado um documento, e apenas um deles é o responsável. Cada um fez uma declaração: Ari: \"O responsável é o Beto\"; Beto: \"Eu não sou o responsável\"; Cris: \"O responsável é o Ari ou sou eu\". Sabendo que exatamente uma das três declarações é verdadeira, o responsável é:",
  "options": [
   "Beto",
   "Ari",
   "Cris",
   "Ari ou Cris, os dados não permitem distinguir",
   "nenhum dos três, pois as declarações são contraditórias"
  ],
  "answer": 0,
  "explanation": "Teste cada hipótese e conte as declarações verdadeiras. Se o responsável fosse Ari: a declaração de Ari é falsa; a de Beto (\"eu não sou\") é verdadeira; a de Cris (\"Ari ou eu\") é verdadeira — duas verdadeiras, o que contraria o enunciado. Se fosse Cris: a de Ari é falsa; a de Beto é verdadeira; a de Cris também — de novo duas. Se fosse Beto: a de Ari é verdadeira; a de Beto é falsa (ele é o responsável); a de Cris é falsa (nem Ari nem Cris). Exatamente uma verdadeira: só essa hipótese é compatível. Os dados, portanto, distinguem o responsável, e não há contradição. O procedimento é o de testar as hipóteses e descartar as que violam a condição dada.",
  "lawRef": "Dedução lógica — teste de hipóteses com declarações verdadeiras e falsas"
 },
 {
  "id": "rlm-m04-autoral-06",
  "origem": "autoral-ia",
  "q": "Assinale o único argumento válido.",
  "options": [
   "Todo múltiplo de 6 é par. O número 12 é par. Logo, 12 é múltiplo de 6.",
   "Se 8 é par, então 8 é divisível por 2. O número 8 é divisível por 2. Logo, 8 é par.",
   "Alguns primos são pares. Alguns pares são múltiplos de 4. Logo, alguns primos são múltiplos de 4.",
   "Todo número primo é ímpar. O número 2 é primo. Logo, o número 2 é ímpar.",
   "Nenhum primo é múltiplo de 6. O número 7 não é múltiplo de 6. Logo, 7 é primo."
  ],
  "answer": 3,
  "explanation": "Validade é uma propriedade da forma: não pode haver situação com premissas verdadeiras e conclusão falsa. No argumento correto, a forma é \"todo P é I; 2 é P; logo 2 é I\", uma inclusão, que é válida mesmo com a premissa falsa (nem todo primo é ímpar) e a conclusão falsa: se as premissas fossem verdadeiras, a conclusão seria. Os demais são inválidos, ainda que tenham premissas e conclusões verdadeiras: \"todo múltiplo de 6 é par; 12 é par; logo é múltiplo de 6\" inverte a inclusão; \"P → Q; Q; logo P\" afirma o consequente; \"alguns... alguns... logo alguns\" não preserva o termo médio; \"nenhum primo é múltiplo de 6; 7 não é múltiplo de 6; logo 7 é primo\" confunde a ausência de um atributo com a presença de outro. Verdade factual das frases não é critério de validade.",
  "lawRef": "Validade vs. verdade factual — inclusão de conjuntos e falácias"
 },
 {
  "id": "rlm-m04-autoral-07",
  "origem": "autoral-ia",
  "q": "Para avaliar o argumento \"P → Q; Q → R; logo R → P\" por meio da tabela-verdade, procuram-se as linhas em que as premissas são verdadeiras e a conclusão é falsa. Assinale a alternativa correta.",
  "options": [
   "O argumento é válido, pois a conclusão apenas reorganiza a cadeia P → Q → R.",
   "O argumento é inválido, pois há exatamente duas linhas com premissas verdadeiras e conclusão falsa.",
   "O argumento é inválido, pois há exatamente uma linha com premissas verdadeiras e conclusão falsa.",
   "O argumento é inválido, pois há exatamente três linhas com premissas verdadeiras e conclusão falsa.",
   "O argumento é válido, pois há linhas em que premissas e conclusão são verdadeiras."
  ],
  "answer": 1,
  "explanation": "A conclusão R → P é falsa apenas quando R é V e P é F. Nessas condições, as premissas: P → Q é V (antecedente falso, qualquer que seja Q) e Q → R é V (consequente verdadeiro, qualquer que seja Q). Como Q pode ser V ou F, há duas linhas (P=F, Q=V, R=V e P=F, Q=F, R=V) em que as premissas são V e a conclusão é F: duas linhas de contraexemplo, e o argumento é inválido. Dizer que é válido porque \"inverte a cadeia\" é confundir a conclusão com a recíproca: o silogismo hipotético conclui P → R, e não R → P. Existir linha em que tudo é verdadeiro (por exemplo, P, Q, R todos V) não prova validade: a validade exige a ausência de qualquer contraexemplo.",
  "lawRef": "Tabela de validade — busca de contraexemplos"
 },
 {
  "id": "rlm-m04-autoral-08",
  "origem": "autoral-ia",
  "q": "Cinco servidores — Ana, Bia, Caio, Davi e Eva — atendem, cada um, em um dos guichês numerados de 1 a 5, sem repetição. Sabe-se que: Ana atende em guichê de número maior que o de Bia; Caio e Davi atendem em guichês vizinhos (números consecutivos); Eva não atende em guichê de extremidade (1 ou 5); o guichê de Eva é vizinho ao de Ana; o número do guichê de Caio é menor que o de Bia. É necessariamente verdadeiro que:",
  "options": [
   "Bia atende no guichê 3.",
   "Caio atende no guichê 1.",
   "Caio atende no guichê 2.",
   "Davi atende no guichê 1.",
   "Davi atende no guichê 2."
  ],
  "answer": 0,
  "explanation": "As regras dão Caio < Bia < Ana, e Eva (guichê 2, 3 ou 4) é vizinha de Ana. Teste a posição de Ana, que só pode ser 3, 4 ou 5. Ana = 3: Caio e Bia ficam com 1 e 2 (Caio = 1, Bia = 2), Eva precisa ser vizinha de Ana e só resta o 4, e Davi iria para o 5, longe de Caio: viola a regra dos vizinhos. Ana = 4: Eva só pode ser 3 (o 5 é extremidade); sobram 1, 2 e 5, e Caio < Bia < 4 impõe Caio = 1, Bia = 2, deixando Davi no 5, longe de Caio: inválido. Ana = 5: Eva = 4 (o único vizinho que não é extremidade); sobram 1, 2 e 3 para Bia, Caio e Davi. Bia = 2 obrigaria Caio = 1 e Davi = 3, que não são vizinhos; logo Bia = 3 e Caio e Davi ocupam 1 e 2, em qualquer ordem. Há, portanto, duas soluções, e em ambas Bia atende no guichê 3. Caio e Davi podem trocar de lugar, de modo que nenhuma afirmação sobre eles é necessária.",
  "lawRef": "Dedução lógica — ordenação e restrições de posição"
 },
 {
  "id": "rlm-m04-autoral-09",
  "origem": "autoral-ia",
  "q": "Admita verdadeiras as seguintes premissas sobre um servidor: (1) se ele é cedido, perde a gratificação; (2) se perde a gratificação, não recebe auxílio; (3) ele recebe auxílio. Assinale a afirmação que, acrescentada a essas premissas, as torna logicamente incompatíveis (inconsistentes).",
  "options": [
   "O servidor não perde a gratificação.",
   "Se o servidor é cedido, então recebe auxílio.",
   "O servidor recebe auxílio e não é cedido.",
   "Se o servidor perde a gratificação, então não é cedido.",
   "O servidor é cedido ou perde a gratificação."
  ],
  "answer": 4,
  "explanation": "De (3) e (2), por modus tollens: se recebe auxílio, não perde a gratificação (¬G). De ¬G e (1), por modus tollens: não é cedido (¬C). Portanto, as premissas já fixam ¬C e ¬G; qualquer afirmação que exija C ou G entra em conflito. \"O servidor é cedido ou perde a gratificação\" exige C ∨ G, que é falsa com ¬C e ¬G: inconsistência. As demais são consistentes com ¬C e ¬G: \"não perde\" é ¬G; \"se é cedido, então recebe auxílio\" é verdadeira porque o antecedente é falso; \"recebe auxílio e não é cedido\" repete A e ¬C; e \"se perde a gratificação, então não é cedido\" tem antecedente falso. Note que a incompatibilidade não exige afirmar a negação de uma premissa: basta afirmar algo que as premissas já excluem.",
  "lawRef": "Consistência de premissas — contradição e encadeamento"
 },
 {
  "id": "rlm-m04-autoral-10",
  "origem": "autoral-ia",
  "q": "Em uma ilha, cada habitante é sempre sincero (só diz verdades) ou sempre mentiroso (só diz falsidades). Três habitantes declaram: X: \"Exatamente um de nós três é mentiroso\"; Y: \"Exatamente dois de nós três são mentirosos\"; Z: \"Os três somos mentirosos\". É correto concluir que:",
  "options": [
   "X é sincero, e Y e Z são mentirosos.",
   "Z é sincero, e X e Y são mentirosos.",
   "X e Z são mentirosos, e Y é sincero.",
   "X, Y e Z são mentirosos.",
   "Y e Z são sinceros, e X é mentiroso."
  ],
  "answer": 2,
  "explanation": "Se Z fosse sincero, sua declaração (\"os três somos mentirosos\") seria verdadeira, mas isso o tornaria mentiroso: contradição; logo Z é mentiroso. Se X fosse sincero, haveria exatamente um mentiroso (o próprio Z), e Y seria sincero, mas Y afirma que há dois mentirosos, o que seria falso: contradição; logo X é mentiroso. Com X e Z mentirosos, a declaração de Y (\"exatamente dois são mentirosos\") é verdadeira se Y for sincero, e Y precisa ser sincero (se fosse mentiroso, os três seriam mentirosos e a declaração de Z seria verdadeira, contradição). Assim X e Z mentem e Y diz a verdade. A verificação dos oito casos possíveis confirma essa solução como a única.",
  "lawRef": "Dedução lógica — sinceros e mentirosos (análise de casos)"
 },
 {
  "id": "rlm-m04-autoral-11",
  "origem": "autoral-ia",
  "q": "Considere as premissas: \"Se o prazo é prorrogado, o recurso é aceito\" (P → Q) e \"O prazo foi prorrogado\" (P). Conclui-se validamente que:",
  "options": [
   "O prazo não foi prorrogado (¬P).",
   "O recurso foi aceito (Q).",
   "O recurso não foi aceito (¬Q).",
   "O prazo é prorrogado se e somente se o recurso é aceito (P ↔ Q).",
   "Se o recurso é aceito, o prazo é prorrogado (Q → P)."
  ],
  "answer": 1,
  "explanation": "Trata-se do modus ponens: de P → Q e P, conclui-se Q. Se a condicional vale e o antecedente ocorre, o consequente necessariamente ocorre. Verificação: a única linha em que as duas premissas são verdadeiras é P = V e Q = V, e nela Q é verdadeiro. ¬P contradiz a segunda premissa; ¬Q contradiz o resultado. A bicondicional e a recíproca (Q → P) não decorrem das premissas, pois o recurso poderia ser aceito por outra razão, sem prorrogação.",
  "lawRef": "Modus ponens"
 },
 {
  "id": "rlm-m04-autoral-12",
  "origem": "autoral-ia",
  "q": "Considere as premissas \"Todo analista é servidor\" e \"Todo servidor é concursado\". A conclusão \"Todo analista é concursado\" torna o argumento:",
  "options": [
   "Inválido em qualquer circunstância.",
   "Válido apenas se os conjuntos analistas e concursados forem iguais.",
   "Inválido, pois faltam premissas sobre indivíduos específicos.",
   "Válido, pela transitividade da inclusão de conjuntos.",
   "Inconclusivo, pois depende de haver servidores que não são analistas."
  ],
  "answer": 3,
  "explanation": "Em diagramas: o conjunto dos analistas está dentro do dos servidores, que está dentro do dos concursados; logo analistas ⊆ concursados. É o silogismo da transitividade (Barbara): sempre que as premissas forem verdadeiras, a conclusão será verdadeira, portanto o argumento é válido. Não é necessário que os conjuntos sejam iguais; podem existir servidores que não são analistas e isso não afeta a conclusão. Também não se exigem premissas sobre indivíduos, pois a conclusão é sobre classes inteiras.",
  "lawRef": "Silogismo categórico: transitividade (todo A é B, todo B é C)"
 },
 {
  "id": "rlm-m04-autoral-13",
  "origem": "autoral-ia",
  "q": "A validade de um argumento dedutivo depende:",
  "options": [
   "da forma: não é possível ter todas as premissas verdadeiras e a conclusão falsa.",
   "de a conclusão parecer realista ou aceitável.",
   "de quem enunciou as premissas e de sua autoridade.",
   "de as premissas serem fatos historicamente comprovados.",
   "do número de pessoas ou itens mencionados nas premissas."
  ],
  "answer": 0,
  "explanation": "Validade é uma propriedade da estrutura do raciocínio: um argumento é válido quando, supondo todas as premissas verdadeiras, a conclusão é necessariamente verdadeira (não existe a combinação premissas V e conclusão F). Isso é independente de a conclusão soar plausível, de quem a afirmou ou de as premissas serem verdadeiras de fato: um argumento pode ser válido com premissas falsas, e inválido com premissas e conclusão verdadeiras. Já a solidez exige validade e premissas verdadeiras.",
  "lawRef": "Conceito de validade de argumento"
 },
 {
  "id": "rlm-m04-autoral-14",
  "origem": "autoral-ia",
  "q": "Premissas: \"Se o alarme toca, a sala é evacuada\" e \"A sala não foi evacuada\". A conclusão válida é:",
  "options": [
   "O alarme tocou.",
   "A sala não existe.",
   "O alarme não tocou.",
   "O alarme está com defeito.",
   "A evacuação ocorreu."
  ],
  "answer": 2,
  "explanation": "Modus tollens: de P → Q e ¬Q, conclui-se ¬P. Se o alarme tocar, a sala é evacuada; como não foi evacuada, o alarme não pode ter tocado. Pela contrapositiva, ¬Q → ¬P é equivalente à condicional dada. \"O alarme tocou\" é o oposto do que se deduz; \"a evacuação ocorreu\" contradiz a segunda premissa; \"o alarme está com defeito\" e \"a sala não existe\" são hipóteses externas, que não decorrem logicamente das premissas.",
  "lawRef": "Modus tollens"
 },
 {
  "id": "rlm-m04-autoral-15",
  "origem": "autoral-ia",
  "q": "Considere as premissas \"Se choveu, a rua está molhada\" (P → Q) e \"A rua está molhada\" (Q). Concluir que \"choveu\" (P) é um raciocínio:",
  "options": [
   "válido, chamado modus ponens.",
   "válido, chamado modus tollens.",
   "válido, chamado contraposição.",
   "válido, chamado silogismo disjuntivo.",
   "inválido, conhecido como falácia da afirmação do consequente."
  ],
  "answer": 4,
  "explanation": "Afirmar o consequente não garante o antecedente: a rua pode estar molhada por outro motivo (lavagem, vazamento). Contraexemplo: P = F e Q = V torna P → Q verdadeira e Q verdadeira, mas P falsa, portanto premissas V e conclusão F. O modus ponens afirma o antecedente; o modus tollens nega o consequente; a contraposição transforma P → Q em ¬Q → ¬P; e o silogismo disjuntivo usa uma disjunção. Nenhum deles descreve o raciocínio dado, que é inválido.",
  "lawRef": "Falácia da afirmação do consequente"
 },
 {
  "id": "rlm-m04-autoral-16",
  "origem": "autoral-ia",
  "q": "As premissas \"P ou Q\" (disjunção inclusiva) e \"não P\" levam, validamente, a:",
  "options": [
   "P",
   "¬Q",
   "P ∧ Q",
   "Q",
   "¬P ∧ ¬Q"
  ],
  "answer": 3,
  "explanation": "Silogismo disjuntivo: uma disjunção verdadeira exige pelo menos uma parcela verdadeira; sendo P falsa (segunda premissa), resta Q verdadeira. Pela tabela: a única linha com P ∨ Q verdadeira e ¬P verdadeira é P = F e Q = V. Logo Q é consequência obrigatória. P contradiz a segunda premissa; ¬Q e ¬P ∧ ¬Q tornariam a disjunção falsa; e P ∧ Q exige P verdadeira, o que a segunda premissa não permite.",
  "lawRef": "Silogismo disjuntivo"
 },
 {
  "id": "rlm-m04-autoral-17",
  "origem": "autoral-ia",
  "q": "Se P → Q e Q → R são verdadeiras, qual conclusão necessariamente vale?",
  "options": [
   "P → R",
   "R → P",
   "Q → P",
   "P ∧ R",
   "¬P → ¬R"
  ],
  "answer": 0,
  "explanation": "É o silogismo hipotético: encadeando duas condicionais, P → Q e Q → R, resulta P → R. Raciocínio: se P ocorre, então Q ocorre; e, ocorrendo Q, R ocorre. As demais são falácias ou não decorrem: R → P e Q → P são recíprocas; ¬P → ¬R é a inversa da conclusão (não equivalente a ela); e P ∧ R afirmaria que P e R são verdadeiras de fato, o que as condicionais não garantem, pois P poderia ser falsa.",
  "lawRef": "Silogismo hipotético"
 },
 {
  "id": "rlm-m04-autoral-18",
  "origem": "autoral-ia",
  "q": "Considere: \"Se estudo, reviso\"; \"Se reviso, aprendo\"; \"Não aprendi\". Qual conclusão decorre necessariamente?",
  "options": [
   "Estudei e revisei.",
   "Não estudei, mas revisei.",
   "Aprendi pelo menos uma vez.",
   "Nada se conclui das premissas.",
   "Não revisei e não estudei."
  ],
  "answer": 4,
  "explanation": "Parte-se da premissa certa: \"Não aprendi\" (¬A). Pela contrapositiva da segunda condicional, ¬A → ¬R, logo não revisei. Pela contrapositiva da primeira, ¬R → ¬E, logo não estudei. Então a conclusão é: não revisei e não estudei. \"Estudei e revisei\" contradiz as premissas. \"Não estudei, mas revisei\" contradiz ¬R. \"Aprendi pelo menos uma vez\" contradiz a terceira premissa. E \"nada se conclui\" é falso, pois a cadeia de modus tollens leva à conclusão.",
  "lawRef": "Modus tollens encadeado e contrapositiva"
 },
 {
  "id": "rlm-m04-autoral-19",
  "origem": "autoral-ia",
  "q": "Para mostrar que o argumento \"P → Q; Q; logo P\" é inválido, é preciso um contraexemplo, isto é, uma atribuição que torne as premissas verdadeiras e a conclusão falsa. Qual atribuição serve?",
  "options": [
   "P = V e Q = V",
   "P = F e Q = V",
   "P = V e Q = F",
   "P = F e Q = F",
   "Não existe tal atribuição."
  ],
  "answer": 1,
  "explanation": "Procura-se premissas V e conclusão F. A conclusão P é falsa só se P = F. Com P = F, a premissa P → Q é verdadeira para qualquer Q, e a premissa Q exige Q = V. Logo P = F e Q = V é o contraexemplo: P → Q = V, Q = V, P = F. Em P = V e Q = V a conclusão é verdadeira (não é contraexemplo); em P = V e Q = F a premissa P → Q é falsa; em P = F e Q = F a premissa Q é falsa. Como o contraexemplo existe, o argumento é inválido.",
  "lawRef": "Validade por contraexemplo"
 },
 {
  "id": "rlm-m04-autoral-20",
  "origem": "autoral-ia",
  "q": "Considere as premissas: \"Todo auxiliar é servidor\" e \"Nenhum servidor é terceirizado\". Qual conclusão é obrigatória?",
  "options": [
   "Algum auxiliar é terceirizado.",
   "Todo terceirizado é auxiliar.",
   "Nenhum auxiliar é terceirizado.",
   "Nenhum servidor é auxiliar.",
   "Algum terceirizado é servidor."
  ],
  "answer": 2,
  "explanation": "No diagrama, o conjunto dos auxiliares está dentro do dos servidores, e o dos servidores não tem nenhum ponto em comum com o dos terceirizados; logo auxiliares e terceirizados também não se intersectam: nenhum auxiliar é terceirizado. As demais são falsas ou não decorrem: \"algum auxiliar é terceirizado\" e \"algum terceirizado é servidor\" contradizem a segunda premissa; \"todo terceirizado é auxiliar\" é inversão sem base; \"nenhum servidor é auxiliar\" contraria a primeira premissa, pois os auxiliares são servidores.",
  "lawRef": "Silogismo categórico com premissa negativa"
 }
];
