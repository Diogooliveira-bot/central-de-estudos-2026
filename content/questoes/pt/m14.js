/* Banco de questões — Português, módulo 14. Questões autorais (não são de banca).
 * Para acrescentar questões, veja content/questoes/LEIAME.md e rode "npm run questoes:check". */
window.BC_QUESTOES=window.BC_QUESTOES||{};
(window.BC_QUESTOES.pt=window.BC_QUESTOES.pt||{})[14]=[
 {
  "id": "pt-m14-autoral-01",
  "origem": "autoral-ia",
  "q": "Quantas orações há no período \"Os servidores que tinham sido convocados devem apresentar-se ao setor quando forem chamados\"?",
  "options": [
   "Sete orações, uma para cada forma verbal presente no período.",
   "Três orações, pois cada locução verbal ou tempo composto forma uma só oração.",
   "Quatro orações, pois \"tinham sido convocados\" equivale a duas orações distintas.",
   "Duas orações, pois a oração iniciada por \"que\" integra o sujeito e não é contada.",
   "Cinco orações, pois só o auxiliar \"devem\" deixa de formar oração própria."
  ],
  "answer": 1,
  "explanation": "Contar verbos mecanicamente falha: locução verbal e tempo composto formam um único núcleo verbal e, portanto, uma só oração. Há três estruturas verbais: \"tinham sido convocados\" (tempo composto + passiva), \"devem apresentar-se\" (locução com auxiliar modal) e \"forem chamados\" (passiva). Logo, três orações (B): a principal (Os servidores devem apresentar-se ao setor), a adjetiva restritiva (que tinham sido convocados) e a adverbial temporal (quando forem chamados). A conta sete formas verbais. C e E desmembram arbitrariamente as estruturas. D erra ao excluir a adjetiva: ela integra o sujeito, mas continua sendo oração, pois tem verbo próprio.",
  "lawRef": "Período composto — contagem de orações; locução verbal e tempo composto formam uma só oração"
 },
 {
  "id": "pt-m14-autoral-02",
  "origem": "autoral-ia",
  "q": "Assinale a alternativa em que a oração introduzida pelo conectivo é coordenada sindética explicativa, e não subordinada adverbial causal.",
  "options": [
   "A audiência foi adiada porque o juiz adoeceu na véspera.",
   "Como o sistema falhou, os prazos processuais foram prorrogados.",
   "Feche as janelas da sala, pois vai chover.",
   "Visto que faltaram documentos, o pedido foi indeferido.",
   "Já que o prazo terminou, o recurso não será conhecido."
  ],
  "answer": 2,
  "explanation": "A pergunta-chave é: a oração indica a causa do fato ou justifica a fala/ordem do enunciador? Em C, a chuva não causa o fechamento das janelas; ela justifica a ordem dada no imperativo (\"feche\"): trata-se de coordenada sindética explicativa. Nas demais há relação real de causa e efeito: em A, o adoecimento do juiz provocou o adiamento; em B, o \"como\" anteposto à principal tem valor causal (= porque); em D e E, \"visto que\" e \"já que\" são conjunções subordinativas causais, e a falta de documentos e o fim do prazo produziram as consequências descritas.",
  "lawRef": "Período composto — coordenada explicativa (justifica a enunciação) × subordinada causal (causa do fato)"
 },
 {
  "id": "pt-m14-autoral-03",
  "origem": "autoral-ia",
  "q": "Em \"O relator já analisou todos os recursos; o processo está, pois, pronto para julgamento\", a oração em que aparece o \"pois\" é:",
  "options": [
   "coordenada explicativa, que justifica a análise feita pelo relator.",
   "subordinada adverbial causal, equivalente a \"porque o processo está pronto\".",
   "subordinada adverbial consecutiva, que exprime efeito da intensidade de uma ação.",
   "coordenada adversativa, que opõe a análise dos recursos ao julgamento.",
   "coordenada conclusiva, que exprime inferência tirada do fato anterior."
  ],
  "answer": 4,
  "explanation": "Quando o \"pois\" vem deslocado, depois do verbo e isolado por vírgulas, tem valor conclusivo (= portanto, logo): o falante tira uma conclusão do fato anterior — se todos os recursos foram analisados, o processo está pronto. Por isso E está correta. A e B atribuem ao \"pois\" o valor que ele tem quando inicia a oração (explicação ou causa). C confunde conclusão com consequência: a consecutiva exprime um efeito produzido pela intensidade de algo (\"estudou tanto que passou\"), e não uma inferência do falante. D está errada porque não há oposição entre as orações.",
  "lawRef": "Período composto — coordenada conclusiva (\"pois\" posposto ao verbo) × explicativa × consecutiva"
 },
 {
  "id": "pt-m14-autoral-04",
  "origem": "autoral-ia",
  "q": "Assinale a análise correta da oração subordinada destacada entre colchetes.",
  "options": [
   "Em \"É provável [que o prazo seja prorrogado]\", a oração é substantiva subjetiva.",
   "Em \"A verdade é [que ninguém foi avisado]\", a oração é substantiva subjetiva.",
   "Em \"Os candidatos esperam [que o resultado saia logo]\", a oração é substantiva objetiva indireta.",
   "Em \"Só desejo isto: [que todos sejam aprovados]\", a oração é substantiva objetiva direta.",
   "Em \"Convém [que os documentos sejam revisados]\", a oração é adjetiva restritiva."
  ],
  "answer": 0,
  "explanation": "O teste do ISTO mostra a função da oração substantiva. Em A, \"Isto é provável\": a oração é o sujeito do verbo de ligação — subjetiva. Em B, \"a verdade\" já é o sujeito; a oração vem depois do verbo de ligação e funciona como predicativo (\"A verdade é isto\"): predicativa. Em C, \"esperar\" é transitivo direto (\"esperam isto\"), sem preposição: objetiva direta. Em D, a oração vem depois de dois-pontos e explica o pronome \"isto\", que já é o objeto direto: apositiva. Em E, não há antecedente para um relativo; a oração é o sujeito de \"convém\" (\"Isto convém\"): subjetiva, e não adjetiva.",
  "lawRef": "Período composto — subordinadas substantivas (subjetiva × predicativa × objetiva direta × apositiva); teste do ISTO"
 },
 {
  "id": "pt-m14-autoral-05",
  "origem": "autoral-ia",
  "q": "Assinale a frase em que a oração introduzida por \"de que\" é subordinada substantiva completiva nominal.",
  "options": [
   "Os servidores lembraram-se de que o prazo vencia naquele dia.",
   "O diretor duvidava de que a proposta fosse aprovada pelo conselho.",
   "A comissão necessitava de que os documentos fossem enviados logo.",
   "A equipe tinha certeza de que o sistema voltaria a funcionar.",
   "O documento de que precisávamos chegou ontem ao protocolo."
  ],
  "answer": 3,
  "explanation": "Objetiva indireta e completiva nominal são ambas introduzidas por preposição; a diferença está em quem rege a preposição: um verbo (objetiva indireta) ou um nome (completiva nominal). Em D, a preposição \"de\" é exigida pelo substantivo \"certeza\" (ter certeza DE algo): completiva nominal. Em A, B e C, quem rege a preposição são os verbos \"lembrar-se\", \"duvidar\" e \"necessitar\" (lembrar-se DE, duvidar DE, necessitar DE): objetivas indiretas. Em E, o \"que\" retoma o antecedente \"documento\" e é pronome relativo; a oração é adjetiva restritiva, e não substantiva (o teste do ISTO não funciona).",
  "lawRef": "Período composto — objetiva indireta (regida por verbo) × completiva nominal (regida por nome) × adjetiva"
 },
 {
  "id": "pt-m14-autoral-06",
  "origem": "autoral-ia",
  "q": "Considere: I. \"Os candidatos que apresentaram recurso terão a nota revista.\" II. \"Os candidatos, que apresentaram recurso, terão a nota revista.\" É correto afirmar:",
  "options": [
   "As duas frases têm o mesmo sentido, pois as vírgulas em II são facultativas.",
   "Em I, todos os candidatos apresentaram recurso; em II, apenas parte deles.",
   "A frase II é incorreta, porque oração iniciada por \"que\" não pode vir entre vírgulas.",
   "Em I, a oração é explicativa e acrescenta um comentário sobre todos os candidatos.",
   "Em II, a oração indica que todos os candidatos referidos apresentaram recurso."
  ],
  "answer": 4,
  "explanation": "A adjetiva restritiva, sem vírgulas, seleciona um subconjunto: em I, só os candidatos que recorreram terão a nota revista (há outros que não recorreram). A explicativa, isolada por vírgulas, acrescenta um comentário sobre uma referência já delimitada: em II, todos os candidatos em questão apresentaram recurso, e todos terão a nota revista — por isso E está correta. A erra porque as vírgulas não são facultativas: mudam o universo de referência. B inverte os sentidos. C está errada, pois a explicativa vem justamente entre vírgulas. D atribui a I a classificação que cabe a II.",
  "lawRef": "Período composto — adjetiva restritiva × explicativa; efeito de sentido das vírgulas"
 },
 {
  "id": "pt-m14-autoral-07",
  "origem": "autoral-ia",
  "q": "Assinale a alternativa em que a função sintática do pronome relativo está corretamente indicada.",
  "options": [
   "Em \"Este é o parecer de que o relator discordou\", o \"que\" é objeto indireto.",
   "Em \"A cidade onde a sessão ocorreu fica no interior\", o \"onde\" é sujeito.",
   "Em \"O servidor cujo pedido foi negado recorreu\", o \"cujo\" é objeto direto.",
   "Em \"Os documentos que a comissão analisou sumiram\", o \"que\" é sujeito.",
   "Em \"A testemunha que depôs ontem mentiu\", o \"que\" é objeto direto."
  ],
  "answer": 0,
  "explanation": "Para achar a função do relativo, substitua-o pelo antecedente e reconstrua a oração. Em A: \"o relator discordou do parecer\" — \"discordar\" rege a preposição \"de\", e o relativo é objeto indireto. Em B: \"a sessão ocorreu na cidade\" — \"onde\" indica lugar e é adjunto adverbial; o sujeito de \"ocorreu\" é \"a sessão\". Em C: \"o pedido do servidor foi negado\" — \"cujo\" indica posse e é adjunto adnominal de \"pedido\". Em D: \"a comissão analisou os documentos\" — o sujeito é \"a comissão\", e o \"que\" é objeto direto. Em E: \"a testemunha depôs ontem\" — o \"que\" é sujeito.",
  "lawRef": "Período composto — função sintática do pronome relativo (reconstrução com o antecedente)"
 },
 {
  "id": "pt-m14-autoral-08",
  "origem": "autoral-ia",
  "q": "Em \"Sem ter estudado o edital, o candidato foi aprovado na primeira fase\", a oração reduzida de infinitivo tem valor de:",
  "options": [
   "condição, equivalente a \"se não tivesse estudado o edital\".",
   "causa, equivalente a \"porque não tinha estudado o edital\".",
   "finalidade, equivalente a \"para que não estudasse o edital\".",
   "concessão, equivalente a \"embora não tivesse estudado o edital\".",
   "consequência, equivalente a \"de modo que não estudou o edital\"."
  ],
  "answer": 3,
  "explanation": "\"Sem\" + infinitivo muda de valor conforme a relação com a principal. Aqui há um obstáculo (não ter estudado) que não impediu o resultado (a aprovação): é concessão, equivalente a \"embora não tivesse estudado\" (D). A seria correta em \"Sem estudar o edital, o candidato não será aprovado\", em que o resultado depende de uma condição negativa. B é incoerente: não ter estudado não é a causa da aprovação. C e E não correspondem à estrutura: não há propósito nem efeito decorrente da oração principal.",
  "lawRef": "Período composto — reduzida de infinitivo com \"sem\": concessão × condição"
 },
 {
  "id": "pt-m14-autoral-09",
  "origem": "autoral-ia",
  "q": "Assinale a alternativa em que o \"como\" introduz oração subordinada adverbial conformativa.",
  "options": [
   "Como o sistema estava fora do ar, o prazo foi prorrogado.",
   "O recurso foi processado como determina o regimento interno.",
   "Ele defendeu a tese como um advogado experiente a defenderia.",
   "Ninguém sabe como o processo desapareceu do cartório.",
   "Todos elogiaram a maneira como a audiência foi conduzida."
  ],
  "answer": 1,
  "explanation": "O \"como\" não é automaticamente comparativo; seu valor depende da estrutura. Em B, equivale a \"conforme\" / \"segundo\": o processamento seguiu o que o regimento determina — conformidade. Em A, o \"como\" anteposto à principal tem valor causal (= porque o sistema estava fora do ar). Em C, compara-se a defesa feita por ele com a de um advogado experiente: comparativa. Em D, o \"como\" é advérbio interrogativo de modo em interrogativa indireta, e a oração é substantiva objetiva direta (\"Ninguém sabe isto\"). Em E, o \"como\" retoma o antecedente \"maneira\" e funciona como relativo (= pela qual).",
  "lawRef": "Período composto — valores do COMO: conformidade × causa × comparação × interrogativo × relativo"
 },
 {
  "id": "pt-m14-autoral-10",
  "origem": "autoral-ia",
  "q": "Desenvolvendo-se a oração reduzida em \"Persistindo os atrasos na entrega, o contrato será rescindido\", obtém-se, com preservação do sentido:",
  "options": [
   "Embora persistam os atrasos na entrega, o contrato será rescindido.",
   "Assim que persistiram os atrasos na entrega, o contrato será rescindido.",
   "Se persistirem os atrasos na entrega, o contrato será rescindido.",
   "À medida que persistem os atrasos na entrega, o contrato será rescindido.",
   "Para que persistam os atrasos na entrega, o contrato será rescindido."
  ],
  "answer": 2,
  "explanation": "A reduzida de gerúndio não traz conectivo, e o valor é dado pelo contexto. Aqui a rescisão (futura) depende de os atrasos persistirem: o valor é condicional, e o desenvolvimento adequado é \"Se persistirem os atrasos\" (C), com futuro do subjuntivo correlacionado ao futuro do presente \"será\". A muda o sentido para concessão (a rescisão ocorreria apesar dos atrasos, quando eles são justamente o motivo). B usa um pretérito incompatível com \"será rescindido\" e altera a relação. D introduz proporção (aumento gradual simultâneo), inexistente no original. E cria finalidade absurda: rescindir o contrato para que os atrasos persistam.",
  "lawRef": "Período composto — oração reduzida de gerúndio com valor condicional e seu desenvolvimento"
 }
];
