(function(){
'use strict';

if(window.__civilTheoryModule6LoadedV1)return;
window.__civilTheoryModule6LoadedV1=true;

var VERSION='1.0.0';
var MODULE_ID='civ-obrigacoes';
var STORAGE_KEY='central-v6:civil-theory-subtopics-v1';

var TOPICS=[
  {
    id:'estrutura-obrigacao',
    title:'Relação obrigacional: estrutura, fontes e classificações úteis',
    basis:'CC, arts. 233 e seguintes; doutrina civilista',
    text:'Obrigação é relação jurídica transitória em que o credor pode exigir do devedor uma prestação economicamente apreciável de dar, fazer ou não fazer. O vínculo não se resume à dívida: ele também é orientado pela boa-fé, pela cooperação e pela responsabilidade patrimonial decorrente do inadimplemento.',
    sections:[
      {title:'Elementos da obrigação',bullets:['Sujeito ativo é o credor, titular da pretensão à prestação.','Sujeito passivo é o devedor, obrigado ao adimplemento.','Objeto imediato é a prestação; o objeto mediato é o bem, serviço ou abstenção sobre o qual ela recai.','O vínculo jurídico permite exigir o cumprimento e, quando cabível, responsabilizar o patrimônio do devedor.']},
      {title:'Classificações que ajudam na prova',bullets:['Dar, fazer e não fazer classificam a obrigação pelo conteúdo da prestação.','Coisa certa e coisa incerta distinguem objeto individualizado de objeto indicado ao menos pelo gênero e quantidade.','Obrigações simples, alternativas e facultativas não se confundem: na alternativa existem duas ou mais prestações devidas; na facultativa existe uma prestação devida e outra faculdade de liberação.','Divisibilidade refere-se à prestação; solidariedade refere-se ao vínculo entre sujeitos e nunca se presume.','Obrigações propter rem acompanham determinada posição real; obrigações naturais não são judicialmente exigíveis, mas o pagamento espontâneo, em regra, não se repete.']}
    ],
    table:{headers:['Critério','Pergunta-chave','Exemplo'],rows:[['Prestação','Dar, fazer ou não fazer?','Entregar veículo; pintar parede; não construir'],['Objeto','Certo ou incerto?','Veículo de chassi definido; 100 sacas de café'],['Pluralidade','Há uma ou várias prestações?','Alternativa: entregar A ou B'],['Fracionamento','Prestação admite divisão útil?','Dinheiro normalmente é divisível'],['Sujeitos','Existe solidariedade legal ou convencional?','Dois devedores obrigados pelo total']]},
    example:'Se três devedores prometem entregar conjuntamente uma obra de arte única, a indivisibilidade decorre do objeto. Eles só serão solidários se a lei ou o negócio também criar solidariedade.',
    trap:'Indivisibilidade e solidariedade podem produzir a exigibilidade do todo em certas situações, mas são institutos diferentes. A indivisibilidade nasce da prestação; a solidariedade, da lei ou da vontade.',
    memorize:['Prestação = dar, fazer ou não fazer.','Solidariedade não se presume.','Indivisibilidade está no objeto; solidariedade está no vínculo.','Obrigação natural pode ser paga validamente mesmo sem exigibilidade judicial.']
  },
  {
    id:'dar-coisa-certa',
    title:'Obrigação de dar coisa certa: acessórios, perda e deterioração',
    basis:'CC, arts. 233 a 237',
    text:'Na obrigação de dar coisa certa, o objeto já está individualizado. A prestação abrange os acessórios, salvo se o título ou as circunstâncias indicarem o contrário. Antes da tradição, a distribuição dos riscos depende de culpa e de saber se houve perda total ou simples deterioração.',
    sections:[
      {title:'Perda antes da tradição',bullets:['Sem culpa do devedor, a obrigação se resolve para ambas as partes.','Com culpa do devedor, ele responde pelo equivalente e por perdas e danos.','A mesma lógica se aplica enquanto pendente condição suspensiva, nos termos do art. 234.']},
      {title:'Deterioração',bullets:['Sem culpa, o credor pode resolver a obrigação ou aceitar a coisa com abatimento proporcional do preço.','Com culpa, o credor pode exigir o equivalente ou aceitar a coisa no estado em que se encontra, sempre com direito às perdas e danos.']},
      {title:'Melhoramentos e frutos',bullets:['Até a tradição, a coisa pertence ao devedor, inclusive com melhoramentos e acrescidos, pelos quais pode exigir aumento do preço.','Se o credor não concordar com o aumento, o devedor pode resolver a obrigação.','Frutos percebidos pertencem ao devedor; frutos pendentes cabem ao credor.']}
    ],
    table:{headers:['Evento','Sem culpa do devedor','Com culpa do devedor'],rows:[['Perda total','Resolve-se a obrigação','Equivalente + perdas e danos'],['Deterioração','Resolver ou aceitar com abatimento','Equivalente ou coisa no estado + perdas e danos']]},
    example:'Antes de entregar quadro determinado, um raio destrói o depósito sem qualquer culpa do devedor. A obrigação de entregar a coisa certa se resolve; se a destruição decorresse de armazenamento negligente, haveria equivalente e perdas e danos.',
    trap:'Na coisa certa, a perda fortuita antes da tradição não obriga o devedor a entregar outra coisa equivalente. O objeto era precisamente aquele bem individualizado.',
    memorize:['Coisa certa inclui acessórios, salvo exceção.','Perda sem culpa → resolução.','Perda com culpa → equivalente + perdas e danos.','Deterioração sem culpa → resolução ou abatimento.']
  },
  {
    id:'restituir-coisa-certa',
    title:'Obrigação de restituir coisa certa',
    basis:'CC, arts. 238 a 242',
    text:'Na obrigação de restituir, a coisa pertence ao credor e estava legitimamente em poder do devedor. Por isso, a distribuição dos riscos não é idêntica à obrigação de entregar coisa própria: a perda fortuita recai, em regra, sobre o proprietário.',
    sections:[
      {title:'Perda e deterioração',bullets:['Se a coisa se perde sem culpa do devedor antes da restituição, o credor suporta a perda e a obrigação se resolve, preservados direitos até a data da perda.','Se houver culpa do devedor, ele responde pelo equivalente e por perdas e danos.','Se a coisa se deteriora sem culpa, o credor a recebe no estado em que estiver, sem indenização; se houver culpa, aplica-se a responsabilidade correspondente.']},
      {title:'Melhoramentos e acréscimos',bullets:['Se surgirem sem despesa ou trabalho do devedor, o credor os recebe sem indenizar.','Se decorrerem de trabalho ou despesa do devedor, aplicam-se as regras relativas às benfeitorias do possuidor de boa-fé ou de má-fé, conforme o caso.','Quanto aos frutos, aplicam-se também as regras possessórias pertinentes.']}
    ],
    table:{headers:['Situação','Consequência'],rows:[['Perda fortuita','Credor, proprietário, suporta a perda'],['Perda culposa','Devedor paga equivalente + perdas e danos'],['Deterioração fortuita','Credor recebe a coisa como está'],['Acréscimo natural','Beneficia o credor sem indenização']]},
    example:'Comodatário deve devolver bem determinado e ele perece em evento inevitável, sem culpa e fora de mora. Como a coisa era do credor, a perda fortuita segue o proprietário.',
    trap:'Não aplique automaticamente à restituição a mesma regra da obrigação de entregar. Pergunte primeiro de quem é a coisa antes da tradição ou restituição.',
    memorize:['Restituir = coisa do credor em poder do devedor.','Perda fortuita → risco do credor.','Culpa do devedor → equivalente + perdas e danos.']
  },
  {
    id:'dar-coisa-incerta',
    title:'Obrigação de dar coisa incerta: gênero, quantidade e escolha',
    basis:'CC, arts. 243 a 246',
    text:'A coisa incerta deve ser indicada ao menos pelo gênero e pela quantidade. A individualização ocorre pela escolha, que, em regra, cabe ao devedor; antes dela, vigora proteção forte do credor contra a alegação de perda do gênero.',
    sections:[
      {title:'Escolha e qualidade',bullets:['Salvo disposição diversa, a escolha pertence ao devedor.','O devedor não pode dar a pior coisa nem é obrigado a prestar a melhor; deve observar qualidade média compatível com o gênero.','Cientificado o credor da escolha, aplicam-se as regras da coisa certa.']},
      {title:'Gênero não perece antes da escolha',bullets:['Antes da escolha, o devedor não pode alegar perda ou deterioração da coisa, ainda que por força maior ou caso fortuito.','A regra parte da fungibilidade dentro do gênero: a prestação pode ser satisfeita com outros bens que o integrem.','Depois de individualizada e comunicada a escolha, o risco passa a seguir as regras da coisa certa.']}
    ],
    table:{headers:['Momento','Regime'],rows:[['Antes da escolha','Gênero + quantidade; devedor não alega perda fortuita'],['Escolha','Em regra pelo devedor, sem pior nem obrigação de melhor'],['Após ciência do credor','Aplicam-se regras da coisa certa']]},
    example:'Devedor deve entregar 100 sacas de café tipo especificado. Incêndio destrói apenas o estoque que ele pretendia usar antes da escolha comunicada. A obrigação permanece, pois outras sacas do gênero podem ser adquiridas.',
    trap:'A máxima genus nunquam perit atua antes da concentração. Depois da escolha devidamente individualizada e comunicada, a obrigação passa ao regime de coisa certa.',
    memorize:['Coisa incerta = gênero + quantidade.','Escolha: em regra, devedor.','Nem pior, nem obrigado à melhor.','Antes da escolha, não se alega perda nem por força maior.']
  },
  {
    id:'obrigacao-fazer',
    title:'Obrigação de fazer: fungível, infungível e execução por terceiro',
    basis:'CC, arts. 247 a 249',
    text:'Na obrigação de fazer, a prestação consiste em atividade do devedor. A consequência do inadimplemento depende de saber se a prestação é personalíssima e de existir ou não culpa pela impossibilidade.',
    sections:[
      {title:'Prestação infungível',bullets:['Se apenas o devedor puder cumprir, a recusa ou impossibilidade culposa gera perdas e danos.','A pessoalidade pode resultar da natureza da prestação ou de convenção entre as partes.','Se a prestação se tornar impossível sem culpa do devedor, resolve-se a obrigação.']},
      {title:'Prestação fungível',bullets:['Se o fato puder ser executado por terceiro, o credor pode mandar executá-lo à custa do devedor em caso de mora ou recusa.','Em urgência, o credor pode executar ou mandar executar o fato independentemente de autorização judicial prévia, sem prejuízo do ressarcimento.','A execução específica é preferida quando ainda for útil e juridicamente possível.']}
    ],
    table:{headers:['Tipo','Inadimplemento'],rows:[['Fazer infungível/personalíssimo','Perdas e danos se culpa; resolução se impossibilidade sem culpa'],['Fazer fungível','Pode ser realizado por terceiro à custa do devedor'],['Urgência','Credor pode providenciar o fato e cobrar depois']]},
    example:'Artista contratado especificamente para pintar retrato personalíssimo se recusa culposamente: não se substitui automaticamente por outro artista; cabem perdas e danos. Já reparo comum pode ser executado por terceiro à custa do devedor.',
    trap:'Nem toda obrigação de fazer se converte imediatamente em perdas e danos. Se a prestação for fungível, a tutela específica por terceiro pode satisfazer o interesse do credor.',
    memorize:['Fazer infungível: pessoa do devedor importa.','Fazer fungível: terceiro pode cumprir.','Urgência permite execução direta pelo credor, com ressarcimento.']
  },
  {
    id:'obrigacao-nao-fazer',
    title:'Obrigação de não fazer',
    basis:'CC, arts. 250 e 251',
    text:'A obrigação negativa impõe abstenção. Ela se extingue se, sem culpa do devedor, tornar-se impossível abster-se do ato; quando o ato proibido é praticado, pode surgir dever de desfazimento e indenização.',
    sections:[
      {title:'Impossibilidade sem culpa',bullets:['Se se torna impossível ao devedor abster-se do ato que prometeu não praticar, sem culpa sua, extingue-se a obrigação.','A impossibilidade precisa ser real e não provocada pelo próprio devedor.']},
      {title:'Descumprimento',bullets:['Praticado o ato vedado, o credor pode exigir que o devedor o desfaça, sob pena de desfazimento à sua custa, além de perdas e danos.','Em urgência, o credor pode desfazer ou mandar desfazer independentemente de autorização judicial prévia, sem prejuízo do ressarcimento.','Nas obrigações negativas, o inadimplemento ocorre desde o dia em que o ato proibido é praticado, conforme art. 390.']}
    ],
    table:{headers:['Situação','Efeito'],rows:[['Abstenção impossível sem culpa','Extinção da obrigação'],['Devedor pratica o ato','Desfazimento + perdas e danos'],['Urgência','Credor pode desfazer diretamente e cobrar custos']]},
    example:'Proprietário prometeu não erguer muro acima de certa altura e o constrói. O credor pode exigir a demolição da parte excedente e perdas e danos quando cabíveis.',
    trap:'A obrigação de não fazer não entra em mora apenas após interpelação: o art. 390 considera inadimplente o devedor desde a prática do ato de que deveria se abster.',
    memorize:['Não fazer = dever de abstenção.','Praticou o ato → desfazimento + perdas e danos.','Art. 390: inadimplemento desde a prática do ato proibido.']
  },
  {
    id:'obrigacoes-alternativas',
    title:'Obrigações alternativas',
    basis:'CC, arts. 252 a 256',
    text:'Na obrigação alternativa são devidas duas ou mais prestações, mas o cumprimento de uma delas libera o devedor. A escolha, em regra, cabe ao devedor, e o regime muda conforme a impossibilidade seja fortuita ou culposa e conforme quem detenha a escolha.',
    sections:[
      {title:'Escolha',bullets:['Salvo estipulação em contrário, a escolha compete ao devedor.','O devedor não pode obrigar o credor a receber parte de uma prestação e parte de outra.','Nas prestações periódicas, a escolha pode ser exercida a cada período.','Se a escolha competir a várias pessoas e não houver unanimidade, o juiz decide após prazo para acordo; se atribuída a terceiro que não queira ou não possa exercê-la, também pode haver intervenção judicial.']},
      {title:'Impossibilidade',bullets:['Se uma das prestações se torna inexequível, subsiste o débito quanto à outra.','Se todas se tornam impossíveis sem culpa do devedor, extingue-se a obrigação.','Quando a impossibilidade decorre de culpa, as consequências variam conforme a escolha pertencia ao devedor ou ao credor e conforme uma ou todas as prestações foram atingidas.']}
    ],
    table:{headers:['Situação','Regra-base'],rows:[['Escolha sem cláusula especial','Devedor escolhe'],['Uma prestação impossível','Subsiste a outra'],['Todas impossíveis sem culpa','Extinção'],['Culpa + escolha do credor','Credor recebe proteção mais ampla conforme arts. 255 e 256']]},
    example:'A deve entregar a B o veículo X ou o veículo Y. Se X perece fortuitamente, Y continua devido. Se ambos perecem sem culpa de A, a obrigação se extingue.',
    trap:'Obrigação alternativa não permite, por vontade unilateral do devedor, entregar metade de cada prestação. O credor tem direito a uma prestação integral dentre as alternativas.',
    memorize:['Escolha: em regra, devedor.','Não pode misturar partes das prestações.','Uma impossível → outra subsiste.','Todas impossíveis sem culpa → extingue.']
  },
  {
    id:'divisiveis-indivisiveis',
    title:'Obrigações divisíveis e indivisíveis',
    basis:'CC, arts. 257 a 263',
    text:'A divisibilidade depende da possibilidade de fracionar a prestação sem alteração relevante de substância, valor ou finalidade. Com pluralidade de sujeitos, a obrigação divisível se presume repartida em quotas; a indivisível pode ser exigida por inteiro por causa da natureza da prestação.',
    sections:[
      {title:'Divisível',bullets:['Havendo vários credores ou devedores, presume-se dividida em tantas obrigações iguais e distintas quantos forem os sujeitos, salvo regra diversa.','Cada devedor responde por sua quota e cada credor exige a sua parte.']},
      {title:'Indivisível',bullets:['Cada devedor pode ser obrigado pela dívida toda, mas quem paga se sub-roga nos direitos do credor contra os demais coobrigados.','Cada credor pode exigir a prestação inteira, devendo prestar caução de ratificação dos demais nas hipóteses legais.','A remissão concedida por um credor não autoriza exigir a prestação integral sem descontar a quota correspondente.','Convertida a obrigação em perdas e danos, perde-se a indivisibilidade; a culpa individual repercute na responsabilidade pelas perdas e danos.']}
    ],
    table:{headers:['Critério','Divisível','Indivisível'],rows:[['Prestação','Admite fracionamento útil','Não admite fracionamento sem perda de substância/valor/finalidade'],['Pluralidade','Quotas autônomas, em regra','Pode-se exigir a prestação inteira'],['Conversão em perdas e danos','Mantém natureza pecuniária fracionável','Cessa a indivisibilidade']]},
    example:'Entrega de escultura única é indivisível. Se dois devedores estão obrigados a entregá-la, um pode ser demandado pelo todo, não por solidariedade presumida, mas pela indivisibilidade da prestação.',
    trap:'Quando a obrigação indivisível se converte em perdas e danos, a indivisibilidade deixa de existir. Não transforme automaticamente o valor indenizatório em obrigação solidária.',
    memorize:['Divisibilidade = possibilidade de fracionar a prestação.','Indivisível pode gerar exigência do todo sem solidariedade.','Conversão em perdas e danos faz cessar a indivisibilidade.']
  },
  {
    id:'solidariedade-geral',
    title:'Solidariedade: conceito e regras gerais',
    basis:'CC, arts. 264 a 266',
    text:'Há solidariedade quando, na mesma obrigação, concorre mais de um credor ou mais de um devedor, cada qual com direito ou obrigado à dívida toda. Trata-se de exceção ao fracionamento e, por isso, não se presume.',
    sections:[
      {title:'Fonte',bullets:['Solidariedade resulta da lei ou da vontade das partes.','Mera pluralidade de credores ou devedores não basta.','A obrigação pode ser solidária mesmo que as modalidades aplicáveis aos cointeressados sejam diferentes, como condição, termo ou lugar de pagamento distintos.']},
      {title:'Efeito essencial',bullets:['Solidariedade ativa permite a cada credor reclamar o todo.','Solidariedade passiva permite ao credor exigir o todo de qualquer devedor solidário.','No plano interno, quem recebe ou paga além de sua quota deve ajustar contas com os demais.']}
    ],
    table:{headers:['Instituto','Origem','Efeito'],rows:[['Solidariedade ativa','Lei ou vontade','Cada credor pode exigir o todo'],['Solidariedade passiva','Lei ou vontade','Cada devedor responde pelo todo'],['Indivisibilidade','Natureza/razão da prestação','Todo exigível porque prestação não se fraciona']]},
    example:'Dois fiadores só responderão solidariamente se houver base legal ou convencional para tanto. A simples presença de dois devedores não cria solidariedade.',
    trap:'A frase “havendo vários devedores, presume-se solidariedade” está errada. O art. 265 é literal: a solidariedade não se presume.',
    memorize:['Art. 265: solidariedade não se presume.','Fonte: lei ou vontade.','Ativa = vários credores; passiva = vários devedores.']
  },
  {
    id:'solidariedade-ativa',
    title:'Solidariedade ativa',
    basis:'CC, arts. 267 a 274',
    text:'Na solidariedade ativa, cada credor pode exigir do devedor o cumprimento integral. Depois do pagamento, remissão ou satisfação a um dos credores, surgem efeitos internos entre os cocredores.',
    sections:[
      {title:'Cobrança e pagamento',bullets:['Cada credor solidário pode exigir a prestação por inteiro.','Enquanto nenhum credor demandar o devedor, este pode pagar a qualquer deles.','Se um credor ajuíza demanda, o pagamento deve observar os efeitos jurídicos dessa iniciativa.','O pagamento feito a um credor extingue a dívida até o montante pago e gera dever de rateio interno.']},
      {title:'Morte, conversão e exceções',bullets:['Morrendo credor solidário e deixando herdeiros, cada herdeiro só pode exigir a quota do crédito correspondente ao seu quinhão, salvo se a obrigação for indivisível.','A conversão da prestação em perdas e danos não elimina a solidariedade.','O devedor não pode opor a um credor solidário exceções pessoais que teria apenas contra outro credor.','O credor que recebe ou remite responde aos demais pela parte que lhes cabe.']}
    ],
    table:{headers:['Evento','Efeito'],rows:[['Antes de demanda','Devedor pode pagar a qualquer credor solidário'],['Morte de credor','Crédito se reparte entre herdeiros, salvo indivisibilidade'],['Conversão em perdas e danos','Solidariedade permanece'],['Exceção pessoal contra um credor','Não se opõe aos demais']]},
    example:'A deve R$ 30 mil solidariamente a B e C. Antes de qualquer demanda, pode pagar a B. B, porém, deverá acertar internamente com C a participação correspondente.',
    trap:'A solidariedade ativa não significa que o credor que recebeu o total pode conservar sozinho toda a prestação. Há relação externa com o devedor e relação interna entre cocredores.',
    memorize:['Cada credor pode exigir o todo.','Antes da demanda, devedor escolhe a qual credor pagar.','Conversão em perdas e danos não extingue solidariedade.']
  },
  {
    id:'solidariedade-passiva',
    title:'Solidariedade passiva e direito de regresso',
    basis:'CC, arts. 275 a 285',
    text:'Na solidariedade passiva, o credor pode exigir a dívida inteira de um, alguns ou todos os devedores. O pagamento integral extingue a relação externa, mas gera direito de regresso entre os coobrigados segundo suas quotas e interesses.',
    sections:[
      {title:'Relação com o credor',bullets:['O credor pode cobrar total ou parcialmente de qualquer devedor solidário sem que a cobrança parcial implique renúncia à solidariedade.','Pagamento parcial ou remissão obtida por um devedor reduz a dívida pelo montante correspondente, sem liberar os demais além desse limite.','As exceções comuns podem ser opostas por qualquer devedor; exceções pessoais só por quem as possui.','Renúncia à solidariedade em favor de um ou alguns devedores não extingue necessariamente a solidariedade dos demais.']},
      {title:'Culpa, juros e insolvência',bullets:['Se a prestação se torna impossível por culpa de um dos devedores, todos continuam obrigados pelo equivalente, mas somente o culpado responde pelas perdas e danos adicionais.','Todos respondem pelos juros da mora, ainda que a ação tenha sido proposta contra apenas um; o culpado pelo atraso deve ressarcir os demais no plano interno quando cabível.','O insolvente tem sua quota rateada entre os coobrigados, inclusive nas condições legais relativas aos exonerados da solidariedade.']},
      {title:'Regresso',bullets:['Quem paga o total cobra dos demais suas quotas.','Presumem-se iguais as partes no débito, salvo prova de divisão diversa.','Se a dívida interessava exclusivamente a um devedor, ele responde por inteiro perante o coobrigado que pagou.']}
    ],
    table:{headers:['Situação','Consequência'],rows:[['Credor cobra um devedor','Pode exigir o todo'],['Impossibilidade culposa de um','Todos: equivalente; culpado: perdas e danos'],['Pagamento integral por um','Nasce regresso contra os demais'],['Dívida interessa só a um','Esse suporta integralmente no plano interno']]},
    example:'Três devedores solidários devem R$ 90 mil. O credor cobra tudo de um deles. Pago o total, esse devedor poderá regressar contra os demais pelas quotas, salvo se a dívida interessava exclusivamente a um deles.',
    trap:'Perdas e danos decorrentes da culpa de apenas um devedor solidário não são automaticamente suportadas por todos. O equivalente pode permanecer solidário, mas o adicional indenizatório recai sobre o culpado.',
    memorize:['Credor pode cobrar um, alguns ou todos.','Pagamento integral → regresso.','Exceção pessoal só aproveita a quem pertence.','Culpa de um: perdas e danos adicionais do culpado.']
  },
  {
    id:'cessao-credito',
    title:'Cessão de crédito',
    basis:'CC, arts. 286 a 298',
    text:'Cessão de crédito é negócio pelo qual o credor transfere sua posição ativa a terceiro. Em regra, não depende do consentimento do devedor, mas sua eficácia perante ele exige ciência, e a responsabilidade do cedente varia conforme a existência e a solvência do crédito.',
    sections:[
      {title:'Possibilidade e eficácia',bullets:['O crédito pode ser cedido se a natureza da obrigação, a lei ou convenção com o devedor não se opuserem.','Cláusula proibitiva não pode ser oposta ao cessionário de boa-fé se não constar do instrumento da obrigação.','Salvo disposição contrária, a cessão abrange os acessórios do crédito.','Perante o devedor, a cessão só produz efeitos após notificação ou declaração escrita de ciência; antes disso, pagamento ao credor primitivo pode liberá-lo.']},
      {title:'Defesas do devedor',bullets:['O devedor pode opor ao cessionário as exceções que tinha contra o cedente ao tempo em que tomou conhecimento da cessão.','A mudança de credor não pode piorar artificialmente a posição defensiva do devedor.']},
      {title:'Responsabilidade do cedente',bullets:['Na cessão onerosa, o cedente responde pela existência do crédito ao tempo da cessão, ainda que não tenha assumido expressamente essa garantia.','Na cessão gratuita, responde pela existência se tiver agido de má-fé.','Pela solvência do devedor, o cedente só responde quando expressamente se obrigar e dentro dos limites legais.']}
    ],
    table:{headers:['Questão','Regra'],rows:[['Consentimento do devedor','Em regra, não é requisito'],['Eficácia perante devedor','Exige notificação/ciência'],['Acessórios','Acompanham o crédito, salvo disposição contrária'],['Existência do crédito oneroso','Cedente responde'],['Solvência do devedor','Só se assumida, nos limites legais']]},
    example:'Credor cede crédito a terceiro sem pedir autorização do devedor. A cessão pode ser válida, mas, enquanto o devedor não souber dela, pagamento de boa-fé ao credor original pode liberá-lo.',
    trap:'Notificação do devedor não é, em regra, requisito de existência da cessão; é requisito para sua eficácia em relação a ele.',
    memorize:['Cessão muda o credor.','Devedor não precisa consentir, em regra.','Devedor precisa ser cientificado para eficácia contra ele.','Solvência só é garantida se assumida.']
  },
  {
    id:'assuncao-divida',
    title:'Assunção de dívida',
    basis:'CC, arts. 299 a 303',
    text:'Assunção de dívida substitui o polo passivo da relação obrigacional. Ao contrário da cessão de crédito, exige, como regra, consentimento expresso do credor, porque a pessoa e o patrimônio do devedor influenciam a segurança do crédito.',
    sections:[
      {title:'Consentimento e exoneração',bullets:['Terceiro pode assumir a obrigação com consentimento expresso do credor.','O devedor primitivo é exonerado, salvo se o novo devedor já era insolvente ao tempo da assunção e o credor ignorava a insolvência.','Em regra, o silêncio do credor não vale como consentimento.','Exceção relevante: adquirente de imóvel hipotecado pode assumir o crédito garantido; notificado o credor, a ausência de impugnação em trinta dias vale como assentimento.']},
      {title:'Garantias e exceções',bullets:['Garantias especiais prestadas pelo devedor primitivo extinguem-se com a assunção, salvo assentimento expresso dele para manutenção.','Anulada a substituição, restaura-se o débito com suas garantias, ressalvadas as garantias de terceiros nas condições legais.','O novo devedor não pode opor ao credor exceções pessoais que pertenciam exclusivamente ao devedor antigo.']}
    ],
    table:{headers:['Instituto','Quem muda','Consentimento do outro polo'],rows:[['Cessão de crédito','Credor','Devedor: em regra não consente'],['Assunção de dívida','Devedor','Credor: consentimento expresso, em regra']]},
    example:'Comprador assume dívida do vendedor perante banco. Sem consentimento expresso do banco, a substituição do devedor não produz, em regra, o efeito liberatório pretendido.',
    trap:'Não aplique à assunção de dívida a regra da cessão de crédito. Aqui o consentimento do credor é central; o silêncio normalmente significa recusa, salvo hipótese legal específica.',
    memorize:['Assunção muda o devedor.','Regra: consentimento expresso do credor.','Novo insolvente + credor ignorava → devedor primitivo não se exonera.','Imóvel hipotecado: silêncio por 30 dias pode valer assentimento.']
  },
  {
    id:'pagamento-sujeitos',
    title:'Pagamento: quem pode pagar e a quem se deve pagar',
    basis:'CC, arts. 304 a 312',
    text:'Pagamento é o adimplemento da prestação. Pode ser realizado pelo devedor ou por terceiros em situações diversas, e deve ser dirigido ao credor, representante ou pessoa legitimada, com regras especiais para credor putativo e incapaz.',
    sections:[
      {title:'Quem paga',bullets:['Qualquer interessado na extinção da dívida pode pagá-la e utilizar meios de exoneração se o credor se opuser.','Terceiro não interessado pode pagar em nome e à conta do devedor, salvo oposição deste.','Terceiro não interessado que paga em nome próprio tem direito a reembolso, mas não se sub-roga automaticamente nos direitos do credor.','Se paga antes do vencimento em nome próprio, o reembolso só é exigível no vencimento.']},
      {title:'Quem recebe',bullets:['Pagamento deve ser feito ao credor ou a quem o represente; fora disso, só vale se ratificado ou na medida em que reverter em proveito do credor.','Pagamento de boa-fé ao credor putativo é válido, ainda que depois se prove que não era credor.','Pagamento conscientemente feito a credor incapaz de quitar só vale se o devedor provar efetivo benefício.','O portador da quitação é presumido autorizado a receber, salvo circunstâncias contrárias.']}
    ],
    table:{headers:['Situação','Efeito'],rows:[['Terceiro interessado paga','Pode ocorrer sub-rogação nas hipóteses legais'],['Terceiro não interessado em nome próprio','Reembolso, sem sub-rogação automática'],['Pagamento a credor putativo de boa-fé','Válido'],['Pagamento a pessoa sem legitimidade','Depende de ratificação ou proveito']]},
    example:'Herdeiro responsável por bem hipotecado paga dívida para evitar execução: possui interesse jurídico na extinção. Já amigo que paga em nome próprio sem interesse tem, em regra, reembolso, mas não assume automaticamente todas as garantias do credor.',
    trap:'Reembolso e sub-rogação não são sinônimos. O terceiro não interessado que paga em nome próprio tem direito a reembolso, mas o art. 305 nega sub-rogação automática.',
    memorize:['Interessado pode pagar e buscar exoneração.','Não interessado em nome próprio: reembolso, sem sub-rogação automática.','Credor putativo + boa-fé = pagamento válido.']
  },
  {
    id:'pagamento-objeto-prova',
    title:'Objeto do pagamento, quitação e prova',
    basis:'CC, arts. 313 a 326',
    text:'O credor tem direito exatamente à prestação devida e não pode ser compelido a aceitar coisa diferente, ainda que mais valiosa. A quitação documenta o adimplemento e o Código estabelece presunções específicas sobre parcelas, juros e entrega do título.',
    sections:[
      {title:'Exatidão da prestação',bullets:['Credor não é obrigado a receber prestação diversa da devida, ainda que mais valiosa.','Mesmo sendo divisível a obrigação, credor não pode ser obrigado a receber por partes nem devedor a pagar parceladamente se isso não foi ajustado.','Dívidas em dinheiro são pagas pelo valor nominal, ressalvadas regras de atualização, cláusulas lícitas e revisão legal.','Desproporção manifesta e imprevisível entre valor da prestação e momento da execução pode autorizar correção judicial nos termos do art. 317.']},
      {title:'Quitação e presunções',bullets:['Quitação regular identifica dívida, devedor, tempo, lugar e assinatura, podendo valer mesmo sem todos os requisitos se as circunstâncias demonstrarem pagamento.','Quitação da última parcela periódica presume pagas as anteriores, até prova em contrário.','Quitação do capital sem reserva dos juros presume-os pagos.','Entrega do título ao devedor firma presunção de pagamento, admitida prova em contrário dentro do prazo legal.']}
    ],
    table:{headers:['Regra','Pegadinha'],rows:[['Prestação exata','Credor não é obrigado a aceitar outra mais valiosa'],['Pagamento parcial','Não pode ser imposto sem ajuste'],['Última prestação periódica quitada','Presume anteriores pagas'],['Capital quitado sem reserva','Presume juros pagos']]},
    example:'Devedor deve R$ 10 mil e oferece equipamento de R$ 12 mil. O credor não é obrigado a aceitá-lo só porque vale mais; a substituição dependeria de concordância, podendo configurar dação em pagamento.',
    trap:'O princípio da identidade impede impor prestação diferente. Valor econômico superior não substitui o objeto devido por decisão unilateral do devedor.',
    memorize:['Credor recebe o que foi devido.','Parcelamento não se presume.','Quitação gera presunções legais importantes.','Prestação diversa depende de concordância.']
  },
  {
    id:'pagamento-lugar-tempo',
    title:'Lugar, tempo do pagamento e vencimento antecipado',
    basis:'CC, arts. 327 a 333',
    text:'O Código define regras supletivas para local e momento do pagamento. Em regra, paga-se no domicílio do devedor, mas título, lei, natureza da obrigação ou circunstâncias podem deslocar o local; situações de risco patrimonial podem antecipar o vencimento.',
    sections:[
      {title:'Lugar',bullets:['Regra supletiva: domicílio do devedor.','As partes podem convencionar outro local, e a lei, natureza da obrigação ou circunstâncias podem estabelecer solução diversa.','Se houver dois ou mais lugares indicados, a escolha, em regra, cabe ao credor.','Pagamento relativo a imóvel ou prestação concernente a imóvel é feito no local do bem quando a natureza assim exigir.','Repetição do pagamento em local diverso pode fazer presumir renúncia do credor ao local originalmente previsto.']},
      {title:'Tempo e antecipação',bullets:['Sem época ajustada, o credor pode exigir imediatamente, ressalvadas obrigações que dependam de tempo por sua natureza ou circunstâncias.','O credor pode cobrar antes do vencimento nas hipóteses do art. 333, como falência/concurso de credores e perda ou insuficiência de garantias sem reforço.','Na solidariedade passiva, o vencimento antecipado por situação pessoal de um devedor não se estende automaticamente aos demais solventes, conforme a regra legal.']}
    ],
    table:{headers:['Tema','Regra'],rows:[['Lugar, se nada consta','Domicílio do devedor'],['Dois lugares previstos','Credor escolhe, em regra'],['Sem data de vencimento','Exigibilidade imediata, ressalvadas circunstâncias'],['Garantia insuficiente sem reforço','Pode haver vencimento antecipado']]},
    example:'Dívida garantida perde substancialmente sua garantia e o devedor, intimado, recusa reforço. O credor pode invocar o vencimento antecipado previsto no Código.',
    trap:'A regra padrão é pagamento no domicílio do devedor, não do credor. Questões costumam inverter essa regra supletiva.',
    memorize:['Regra de lugar: domicílio do devedor.','Art. 333 prevê vencimento antecipado.','Solidariedade não espalha automaticamente vencimento antecipado pessoal.']
  },
  {
    id:'consignacao-pagamento',
    title:'Pagamento em consignação',
    basis:'CC, arts. 334 a 345; CPC, arts. 539 a 549',
    text:'A consignação permite ao devedor liberar-se quando quer pagar, mas encontra obstáculo juridicamente relevante. O depósito judicial ou bancário, nos casos legais, equivale a pagamento se forem observados os requisitos da prestação.',
    sections:[
      {title:'Hipóteses centrais',bullets:['Credor não pode ou recusa injustificadamente receber ou dar quitação.','Credor não comparece para receber no lugar, tempo e condições devidos.','Credor é incapaz, desconhecido, ausente ou está em local incerto, perigoso ou difícil.','Há dúvida sobre quem deve legitimamente receber.','Existe litígio sobre o objeto do pagamento.']},
      {title:'Efeitos e requisitos',bullets:['Pessoas, objeto, modo e tempo devem satisfazer os requisitos do pagamento válido.','Depósito deve ser requerido no lugar do pagamento.','Efetivado o depósito, cessam para o depositante juros e riscos, salvo se a consignação for julgada improcedente.','Levantamento antes da aceitação/impugnação mantém a obrigação; após procedência ou certos atos do credor, há efeitos sobre coobrigados e garantias.']}
    ],
    table:{headers:['Problema','Consignação?'],rows:[['Credor recusa sem justa causa','Sim'],['Dúvida sobre quem recebe','Sim'],['Credor em local incerto/difícil','Sim'],['Devedor quer mudar objeto devido','Não: consignação não altera a prestação']]},
    example:'Locador se recusa sem justificativa a receber aluguel e dar recibo. O locatário pode consignar a prestação observando valor, tempo, lugar e forma devidos.',
    trap:'Consignação não serve para impor pagamento defeituoso. Para ter força liberatória, o depósito deve reproduzir os requisitos do pagamento correto.',
    memorize:['Consignação = pagamento por depósito nas hipóteses legais.','Recusa injusta, ausência, incapacidade, dúvida e litígio são hipóteses clássicas.','Depósito correto pode cessar juros e riscos.']
  },
  {
    id:'subrogacao',
    title:'Pagamento com sub-rogação',
    basis:'CC, arts. 346 a 351',
    text:'Sub-rogação transfere ao pagador os direitos, ações, privilégios e garantias do credor, nos limites legais. Pode decorrer diretamente da lei ou de convenção.',
    sections:[
      {title:'Sub-rogação legal',bullets:['Opera nas hipóteses previstas no art. 346, como pagamento por credor a credor preferencial, adquirente de imóvel hipotecado que paga credor hipotecário e terceiro interessado que paga dívida pela qual era ou podia ser obrigado.','Independe de declaração convencional quando preenchidos os requisitos legais.']},
      {title:'Sub-rogação convencional',bullets:['Pode ocorrer quando o credor recebe pagamento de terceiro e expressamente lhe transfere seus direitos.','Também pode surgir em empréstimo feito ao devedor para pagar a dívida, com condições legais expressas de destinação e sub-rogação.']},
      {title:'Limites',bullets:['Sub-rogado recebe direitos e garantias do credor originário.','Na sub-rogação legal, só pode exercer direitos até a soma efetivamente desembolsada.','Credor originário parcialmente pago tem preferência sobre o sub-rogado quanto ao restante, se os bens do devedor forem insuficientes.']}
    ],
    table:{headers:['Figura','Efeito'],rows:[['Pagamento simples por terceiro não interessado em nome próprio','Reembolso, sem sub-rogação automática'],['Sub-rogação legal','Transfere direitos por força da lei'],['Sub-rogação convencional','Transfere direitos por acordo expresso']]},
    example:'Fiador paga dívida garantida. Por ser juridicamente interessado, pode sub-rogar-se nos direitos do credor contra o devedor.',
    trap:'Todo pagamento por terceiro não gera sub-rogação. Compare o art. 305 com as hipóteses dos arts. 346 e 347.',
    memorize:['Sub-rogação transfere direitos e garantias.','Pode ser legal ou convencional.','Pagador não pode lucrar além dos limites legais da sub-rogação.']
  },
  {
    id:'imputacao-pagamento',
    title:'Imputação do pagamento',
    basis:'CC, arts. 352 a 355',
    text:'Imputação resolve a qual dívida será atribuído um pagamento quando o mesmo devedor possui vários débitos da mesma natureza perante o mesmo credor e o valor entregue não basta para todos.',
    sections:[
      {title:'Ordem de escolha',bullets:['O devedor tem preferência para indicar qual dívida líquida e vencida está pagando.','Se ele não escolhe e o credor declara na quitação a dívida imputada, a imputação prevalece, salvo vício juridicamente relevante.','Se nenhum deles faz imputação válida, a lei direciona o pagamento às dívidas líquidas e vencidas há mais tempo; sendo simultâneas, à mais onerosa.']},
      {title:'Capital e juros',bullets:['Existindo capital e juros, o pagamento se imputa primeiro aos juros vencidos e depois ao capital, salvo estipulação em contrário ou quitação do credor por conta do capital.','A regra impede que o devedor reduza unilateralmente o principal deixando juros vencidos pendentes.']}
    ],
    table:{headers:['Quem define','Regra'],rows:[['Devedor','Primeira escolha, se requisitos presentes'],['Credor','Pode indicar na quitação se devedor silenciou'],['Lei','Dívida vencida mais antiga; entre simultâneas, mais onerosa'],['Capital + juros','Primeiro juros, depois capital, em regra']]},
    example:'Devedor possui duas dívidas vencidas e paga valor suficiente para uma. Se identifica no ato qual pretende quitar, essa escolha orienta a imputação, desde que a dívida seja líquida e vencida.',
    trap:'Na ausência de qualquer indicação, não se escolhe arbitrariamente a dívida mais nova ou menos onerosa: o Código fornece critérios.',
    memorize:['Devedor escolhe primeiro.','Depois pode prevalecer indicação do credor na quitação.','Sem indicação: mais antiga; empate, mais onerosa.','Juros antes do capital, em regra.']
  },
  {
    id:'dacao-pagamento',
    title:'Dação em pagamento',
    basis:'CC, arts. 356 a 359',
    text:'Dação em pagamento ocorre quando o credor consente em receber prestação diversa da originalmente devida. É exceção ao princípio da identidade do pagamento e depende de concordância.',
    sections:[
      {title:'Estrutura',bullets:['Credor pode consentir em receber prestação diversa.','Determinada a coisa dada em pagamento e seu preço, aplicam-se, no que couber, regras de compra e venda.','Se a prestação nova consistir em título de crédito, a transferência segue a disciplina pertinente.']},
      {title:'Evicção',bullets:['Se o credor sofre evicção da coisa recebida em pagamento, restabelece-se a obrigação primitiva.','A quitação dada perde efeito nessa medida, preservados direitos de terceiros.','A regra demonstra que a dação só extingue definitivamente a dívida se o credor conservar legitimamente o objeto recebido.']}
    ],
    table:{headers:['Pagamento comum','Dação'],rows:[['Cumpre a prestação originalmente devida','Credor aceita prestação diferente'],['Não depende de nova concordância sobre objeto','Depende de consentimento do credor'],['Extingue pela execução do devido','Pode restaurar obrigação em caso de evicção']]},
    example:'Dívida em dinheiro é quitada com veículo aceito pelo credor. Se terceiro posteriormente vence ação e retira o veículo por direito anterior, a obrigação original pode ser restabelecida.',
    trap:'Devedor não pode impor dação por oferecer bem mais valioso. Sem consentimento do credor, permanece o dever de prestar o objeto original.',
    memorize:['Dação = prestação diferente aceita pelo credor.','Consentimento é indispensável.','Evicção pode restaurar a obrigação primitiva.']
  },
  {
    id:'novacao',
    title:'Novação',
    basis:'CC, arts. 360 a 367',
    text:'Novação extingue obrigação anterior e cria nova obrigação substitutiva. Pode alterar objeto, devedor ou credor, mas exige intenção inequívoca de novar; uma segunda obrigação compatível com a primeira não basta.',
    sections:[
      {title:'Espécies',bullets:['Objetiva: nova dívida substitui a anterior entre as mesmas partes.','Subjetiva passiva: novo devedor substitui o antigo.','Subjetiva ativa: novo credor substitui o anterior mediante nova obrigação.']},
      {title:'Animus novandi',bullets:['Sem ânimo inequívoco de novar, a nova obrigação apenas confirma a anterior.','A novação pode decorrer de incompatibilidade absoluta entre as obrigações, mas a intenção precisa resultar de modo claro.','Obrigações nulas ou extintas não podem ser novadas; obrigações meramente anuláveis podem, conforme o art. 367.']},
      {title:'Acessórios e garantias',bullets:['A novação extingue acessórios e garantias da dívida anterior, salvo estipulação em contrário.','Garantias reais prestadas por terceiro não podem ser preservadas contra ele sem consentimento.','Novação entre credor e um devedor solidário pode produzir efeitos liberatórios sobre os demais nos termos legais.']}
    ],
    table:{headers:['Mudança','Tipo'],rows:[['Prestação/objeto','Novação objetiva'],['Devedor','Novação subjetiva passiva'],['Credor','Novação subjetiva ativa']]},
    example:'Partes apenas parcelam dívida e alteram vencimentos sem declarar substituição nem criar obrigação incompatível. Isso não significa automaticamente novação.',
    trap:'Novação não se presume. Renegociação, parcelamento ou emissão de novo documento não bastam, isoladamente, sem animus novandi.',
    memorize:['Novação extingue antiga e cria nova.','Animus novandi é indispensável.','Nula/extinta não se nova; anulável pode ser novada.','Acessórios e garantias, em regra, se extinguem.']
  },
  {
    id:'compensacao',
    title:'Compensação',
    basis:'CC, arts. 368 a 380',
    text:'Compensação extingue, até onde se equivalem, obrigações entre pessoas que são reciprocamente credora e devedora uma da outra. A compensação legal exige requisitos de exigibilidade e homogeneidade e admite exceções expressas.',
    sections:[
      {title:'Requisitos básicos',bullets:['Dívidas recíprocas entre as mesmas pessoas, ressalvadas situações legalmente equiparadas.','Dívidas líquidas, vencidas e de coisas fungíveis.','Se as coisas fungíveis diferirem em qualidade especificada, não se compensam sem compatibilidade.','Prazos de favor não impedem compensação.']},
      {title:'Hipóteses de exclusão',bullets:['Não há compensação quando uma dívida provém de esbulho, furto ou roubo.','Também há restrições para comodato, depósito, alimentos e coisas não suscetíveis de penhora.','As partes podem excluir previamente a compensação ou renunciar a ela.','A compensação não pode prejudicar direito de terceiro; regras específicas protegem cessões e penhoras.']},
      {title:'Fiador',bullets:['Fiador pode compensar sua dívida com crédito que o credor tenha contra o devedor principal, nos termos do art. 371.','A regra decorre da acessoriedade da fiança e não cria compensação irrestrita em qualquer relação triangular.']}
    ],
    table:{headers:['Requisito','Em regra'],rows:[['Reciprocidade','Sim'],['Liquidez','Sim'],['Vencimento','Sim'],['Fungibilidade','Sim'],['Alimentos','Não compensáveis pela regra especial']]},
    example:'A deve R$ 10 mil a B e B deve R$ 6 mil líquidos e vencidos a A. Presentes os demais requisitos, as dívidas compensam-se até R$ 6 mil, restando R$ 4 mil.',
    trap:'Existência de créditos recíprocos não basta. Verifique liquidez, vencimento, fungibilidade e as hipóteses legais que afastam a compensação.',
    memorize:['Compensação = dívidas recíprocas se extinguem até onde coincidem.','Exige, em regra, liquidez + vencimento + fungibilidade.','Alimentos e depósitos estão entre restrições clássicas.']
  },
  {
    id:'confusao-remissao',
    title:'Confusão e remissão das dívidas',
    basis:'CC, arts. 381 a 388',
    text:'Confusão ocorre quando as qualidades de credor e devedor se reúnem na mesma pessoa. Remissão é o perdão da dívida aceito pelo devedor. Ambos podem extinguir a obrigação total ou parcialmente, com efeitos próprios nas relações solidárias e garantias.',
    sections:[
      {title:'Confusão',bullets:['Pode atingir toda a dívida ou apenas parte dela.','Na solidariedade, reunião das qualidades em um sujeito extingue a obrigação apenas até a parte correspondente, preservando o restante nas condições legais.','Cessando a confusão, a obrigação pode restabelecer-se com seus acessórios quando juridicamente cabível.']},
      {title:'Remissão',bullets:['Perdão extingue a obrigação se aceito pelo devedor e não prejudicar terceiro.','Devolução voluntária do instrumento particular da obrigação pode provar desoneração nas condições legais.','Restituição voluntária do objeto empenhado prova renúncia à garantia real, não extinção da dívida.','Remissão concedida a um codevedor solidário reduz a dívida pela quota correspondente, ainda que o credor preserve solidariedade contra os demais.']}
    ],
    table:{headers:['Instituto','Fato gerador','Efeito'],rows:[['Confusão','Mesma pessoa vira credora e devedora','Extinção total ou parcial'],['Remissão','Perdão aceito','Extinção da dívida na extensão remitida'],['Devolução do penhor','Renúncia à garantia','Dívida permanece']]},
    example:'Credor devolve voluntariamente bem empenhado ao devedor. Isso prova renúncia ao penhor, mas não significa, por si só, perdão da dívida principal.',
    trap:'Renunciar à garantia não é remitir a dívida. O art. 387 separa expressamente o objeto empenhado da obrigação principal.',
    memorize:['Confusão = credor e devedor na mesma pessoa.','Remissão = perdão aceito.','Devolver penhor extingue garantia, não a dívida.']
  },
  {
    id:'inadimplemento-geral',
    title:'Inadimplemento absoluto, responsabilidade patrimonial e caso fortuito',
    basis:'CC, arts. 389 a 393',
    text:'O inadimplemento pode ser absoluto, quando a prestação deixa de ser útil ou possível, ou relativo, quando ainda pode ser cumprida com atraso e se configura mora. O Código associa o descumprimento imputável a perdas e danos, juros, atualização monetária e honorários.',
    sections:[
      {title:'Consequências gerais',bullets:['Não cumprida a obrigação, o devedor responde por perdas e danos, juros, atualização monetária e honorários de advogado.','Pelo inadimplemento respondem os bens do devedor, observadas as limitações processuais de impenhorabilidade.','Nas obrigações negativas, o inadimplemento ocorre desde a prática do ato proibido.','Nos contratos benéficos e onerosos, o art. 392 distribui padrões de culpa de modo específico.']},
      {title:'Caso fortuito e força maior',bullets:['Devedor não responde pelos prejuízos de caso fortuito ou força maior, salvo se houver assumido expressamente essa responsabilidade ou se outra regra deslocar o risco.','O fato necessário é aquele cujos efeitos não era possível evitar ou impedir.','Mora pode alterar a distribuição do risco: o devedor moroso pode responder pela impossibilidade superveniente nas condições do art. 399.']}
    ],
    table:{headers:['Situação','Efeito-base'],rows:[['Inadimplemento imputável','Perdas e danos + encargos'],['Fortuito/força maior sem assunção de risco','Em regra exclui responsabilidade'],['Obrigação de não fazer violada','Inadimplemento desde o ato proibido'],['Devedor em mora','Pode responder até por fortuito nas condições legais']]},
    example:'Devedor deveria entregar bem em data essencial e, por culpa, não o faz quando o evento já perdeu sua finalidade. A prestação pode tornar-se inútil ao credor, caracterizando inadimplemento absoluto.',
    trap:'Caso fortuito não é escudo universal. Assunção de risco, mora relevante e regras especiais podem manter a responsabilidade.',
    memorize:['Inadimplemento absoluto ≠ mora.','Art. 389 atualizado: perdas e danos + juros + atualização + honorários.','Fortuito exclui responsabilidade em regra, não sempre.']
  },
  {
    id:'mora',
    title:'Mora do devedor e mora do credor',
    basis:'CC, arts. 394 a 401',
    text:'Mora é atraso juridicamente relevante quando a prestação ainda interessa. Pode ser do devedor, que não paga no tempo, lugar ou forma devidos, ou do credor, que injustificadamente não recebe corretamente.',
    sections:[
      {title:'Mora do devedor',bullets:['Obrigação positiva, líquida e com termo: o inadimplemento no vencimento constitui mora de pleno direito.','Sem termo, a mora depende de interpelação judicial ou extrajudicial, salvo regra específica.','Nas obrigações decorrentes de ato ilícito, a mora conta da prática do ato.','Sem fato ou omissão imputável ao devedor, não há mora.','Devedor moroso responde pelos prejuízos, juros, atualização e honorários e pode responder pela impossibilidade superveniente durante o atraso, salvo prova liberatória do art. 399.']},
      {title:'Mora do credor',bullets:['Recusa injustificada em receber corretamente pode colocar o credor em mora.','Mora do credor reduz a responsabilidade do devedor pela conservação da coisa, obriga o credor a ressarcir despesas e o sujeita à estimativa mais favorável ao devedor se o valor oscilar entre datas, nos termos legais.']},
      {title:'Purgação',bullets:['Devedor purga a mora oferecendo prestação mais prejuízos até a data da oferta.','Credor purga recebendo e sujeitando-se aos efeitos da mora até a mesma data.','Se a prestação ficou inútil ao credor, pode haver inadimplemento absoluto, não simples purgação da mora.']}
    ],
    table:{headers:['Espécie','Conduta','Efeito'],rows:[['Mora ex re','Termo certo descumprido','Automática, em regra'],['Mora ex persona','Sem termo','Depende de interpelação'],['Mora creditoris','Credor não recebe corretamente','Efeitos sobre riscos e despesas'],['Purgação','Correção do atraso + encargos','Cessa efeitos futuros da mora']]},
    example:'Dívida líquida vence em 10 de maio e não é paga: a mora se constitui pelo vencimento, em regra. Se não havia termo, normalmente será necessária interpelação.',
    trap:'Mora não é qualquer atraso cronológico. Exige atraso juridicamente imputável e prestação ainda útil; se a utilidade desapareceu, o caso pode ser inadimplemento absoluto.',
    memorize:['Art. 394: mora pode ser do devedor ou credor.','Termo certo → mora automática, em regra.','Sem termo → interpelação, em regra.','Prestação inútil pode converter atraso em inadimplemento absoluto.']
  },
  {
    id:'perdas-danos',
    title:'Perdas e danos: dano emergente e lucro cessante',
    basis:'CC, arts. 402 a 405',
    text:'Perdas e danos procuram recompor os prejuízos causalmente ligados ao inadimplemento. O Código inclui o que o credor efetivamente perdeu e o que razoavelmente deixou de lucrar, limitados aos efeitos diretos e imediatos da inexecução.',
    sections:[
      {title:'Extensão',bullets:['Dano emergente é a perda patrimonial efetiva.','Lucro cessante é o ganho razoavelmente esperado que deixou de ocorrer.','Mesmo em caso de dolo, o art. 403 limita a reparação aos prejuízos efetivos e lucros cessantes por efeito direto e imediato da inexecução, sem prejuízo de regras especiais.']},
      {title:'Obrigações em dinheiro',bullets:['Perdas e danos incluem atualização monetária, juros, custas e honorários, sem prejuízo da pena convencional.','Se os juros de mora não cobrirem o prejuízo e não houver pena convencional, pode haver indenização suplementar mediante prova.','O art. 405 prevê juros de mora desde a citação inicial, ressalvados marcos específicos decorrentes da natureza da obrigação, do vencimento e de legislação especial.']}
    ],
    table:{headers:['Categoria','Conteúdo'],rows:[['Dano emergente','O que efetivamente perdeu'],['Lucro cessante','O que razoavelmente deixou de ganhar'],['Nexo','Efeito direto e imediato da inexecução'],['Dívida em dinheiro','Atualização + juros + custas + honorários']]},
    example:'Empresa deixa de entregar máquina e o comprador prova gastos extras imediatos e lucro razoavelmente frustrado pela paralisação. Ambos podem integrar perdas e danos se houver nexo direto e prova adequada.',
    trap:'Lucro cessante não é lucro imaginário ou meramente possível. O Código exige aquilo que razoavelmente se deixou de lucrar.',
    memorize:['402 = dano emergente + lucro cessante.','403 = efeito direto e imediato.','404 foi atualizado pela Lei 14.905/2024.']
  },
  {
    id:'juros-atualizacao-14905',
    title:'Atualização monetária e juros legais após a Lei 14.905/2024',
    basis:'CC, arts. 389, 395, 404 e 406; Lei 14.905/2024',
    text:'A Lei 14.905/2024 alterou o regime supletivo de atualização monetária e juros. Em 2026, tabelas antigas que simplesmente tratam a taxa legal como 1% ao mês ou reproduzem a redação anterior do art. 406 não devem ser usadas sem atualização.',
    sections:[
      {title:'Atualização monetária',bullets:['Se não houver índice convencionado nem lei específica, aplica-se a variação do IPCA ou índice que o substitua, conforme art. 389, parágrafo único.','Atualização monetária recompõe a expressão nominal do valor e não se confunde com juros moratórios.']},
      {title:'Taxa legal de juros',bullets:['Quando os juros não forem convencionados, forem pactuados sem taxa ou decorrerem da lei, aplica-se a taxa legal do art. 406.','A taxa legal corresponde à Selic deduzido o índice de atualização monetária referido no art. 389.','A metodologia de cálculo e aplicação é definida pelo Conselho Monetário Nacional e divulgada pelo Banco Central.','Se o resultado da taxa legal for negativo, considera-se zero no período de referência.']},
      {title:'Como evitar dupla contagem',bullets:['Não some mecanicamente Selic integral e IPCA quando estiver aplicando o regime supletivo atual do Código.','A lei estruturou a taxa legal justamente como Selic menos o índice de atualização monetária, preservando funções distintas.','Sempre confira se contrato ou lei especial estabelecem disciplina própria.']}
    ],
    table:{headers:['Componente','Regra supletiva atual'],rows:[['Correção monetária','IPCA, se não convencionada nem prevista em lei específica'],['Juros legais','Selic menos o índice de atualização do art. 389'],['Resultado negativo da taxa legal','Zero']]},
    example:'Contrato não fixa índice de correção nem taxa de juros e não há lei especial. A solução deve partir dos arts. 389 e 406 na redação da Lei 14.905/2024, e não de material antigo que aplique automaticamente 1% ao mês.',
    trap:'“Juros legais = 1% ao mês” como regra geral do Código Civil está desatualizado após a Lei 14.905/2024.',
    memorize:['Sem índice: IPCA, em regra.','Taxa legal: Selic − atualização do art. 389.','Taxa legal negativa = zero.','Lei 14.905/2024 é atualização obrigatória para 2026.']
  },
  {
    id:'clausula-penal',
    title:'Cláusula penal',
    basis:'CC, arts. 408 a 416; jurisprudência do STJ',
    text:'Cláusula penal prefixa consequência econômica para inadimplemento total, descumprimento de cláusula ou mora. Pode funcionar como coerção e liquidação prévia de danos, mas está sujeita a limites e redução equitativa.',
    sections:[
      {title:'Compensatória e moratória',bullets:['Para inadimplemento total, a pena converte-se em alternativa em benefício do credor: ele não recebe simultaneamente prestação integral e pena compensatória como se fossem cumulativas.','Para mora ou violação de cláusula específica, o credor pode exigir a pena juntamente com o cumprimento da obrigação principal.','Valor da cláusula penal não pode exceder o valor da obrigação principal.']},
      {title:'Redução equitativa',bullets:['O juiz deve reduzir a penalidade se a obrigação principal tiver sido cumprida em parte ou se o montante for manifestamente excessivo, considerando natureza e finalidade do negócio.','O STJ admite que essa redução seja realizada de ofício, por se tratar de controle imposto pelo art. 413.','A redução não significa inexistência da cláusula, mas adequação do valor.']},
      {title:'Prova do prejuízo',bullets:['Para exigir a pena convencional, o credor não precisa alegar prejuízo.','Indenização suplementar só é exigível se tiver sido convencionada; nessa hipótese, a pena funciona como mínimo e o excedente deve ser provado.']}
    ],
    table:{headers:['Cláusula','Cumula com obrigação principal?','Prova de prejuízo?'],rows:[['Compensatória por inadimplemento total','Em regra, alternativa','Não para a pena'],['Moratória','Sim','Não para a pena'],['Suplementar acima da pena','Somente se convencionada','Sim, quanto ao excedente']]},
    example:'Contrato fixa multa de 40% e a obrigação foi quase integralmente cumprida. Mesmo prevista no contrato, a penalidade pode e deve ser reduzida equitativamente se manifestamente excessiva ou diante do cumprimento parcial.',
    trap:'Art. 413 usa comando de redução, não mera faculdade livre. A jurisprudência do STJ admite atuação de ofício.',
    memorize:['Pena não pode exceder obrigação principal.','Mora: pena pode cumular com cumprimento.','Art. 413: cumprimento parcial ou excesso → redução equitativa.','Pena dispensa prova do prejuízo.']
  },
  {
    id:'arras',
    title:'Arras ou sinal',
    basis:'CC, arts. 417 a 420; Lei 14.905/2024',
    text:'Arras consistem na entrega de dinheiro ou bem móvel por ocasião do contrato. Podem confirmar o vínculo ou, quando expressamente associado direito de arrependimento, funcionar como indenização predeterminada pela desistência.',
    sections:[
      {title:'Arras confirmatórias',bullets:['Integram ou reforçam o contrato e, em caso de execução, são restituídas ou computadas na prestação, conforme sua natureza.','Se quem deu as arras inadimplir, a outra parte pode considerar o contrato desfeito e retê-las.','Se quem recebeu inadimplir, quem as deu pode considerar o contrato desfeito e exigir devolução mais o equivalente, além dos encargos previstos na redação atual do art. 418.','A parte inocente pode optar pela execução do contrato e perdas e danos, valendo as arras como mínimo da indenização nas condições do art. 419.']},
      {title:'Arras penitenciais',bullets:['Existem quando o contrato estipula direito de arrependimento.','Nesse caso, as arras têm função unicamente indenizatória.','Quem deu perde-as ao arrepender-se; quem recebeu as devolve mais o equivalente se exercer o arrependimento.','Não cabe indenização suplementar nesse regime.']}
    ],
    table:{headers:['Tipo','Direito de arrependimento','Função'],rows:[['Confirmatórias','Não é elemento necessário','Confirmação + mínimo indenizatório em hipóteses legais'],['Penitenciais','Sim','Indenização pelo exercício do arrependimento']]},
    example:'Comprador entrega sinal e o contrato não prevê arrependimento. Se o vendedor descumpre, aplicam-se as arras confirmatórias e as opções legais; não se presume direito de desistir livremente.',
    trap:'Arras não são sempre penitenciais. Direito de arrependimento precisa estar previsto; sem ele, a função normal é confirmatória.',
    memorize:['Confirmatórias reforçam o contrato.','Penitenciais pressupõem direito de arrependimento.','Art. 418 também foi atualizado pela Lei 14.905/2024.']
  },
  {
    id:'promessa-recompensa',
    title:'Promessa de recompensa',
    basis:'CC, arts. 854 a 860',
    text:'Quem anuncia publicamente recompensa a quem preencher condição ou prestar serviço assume obrigação unilateral. O direito nasce do cumprimento do fato anunciado, mesmo que a pessoa não tenha agido motivada pela promessa.',
    sections:[
      {title:'Formação e cumprimento',bullets:['Anúncio público com condição ou serviço determinado vincula o promitente.','Quem realiza o serviço ou satisfaz a condição pode exigir a recompensa mesmo sem ter atuado por interesse na promessa.','Se mais de uma pessoa executa o ato, a lei disciplina prioridade, simultaneidade, divisão e sorteio quando a recompensa for indivisível.']},
      {title:'Revogação e concurso',bullets:['Antes do cumprimento, a promessa pode ser revogada com a mesma publicidade, salvo quando o prazo fixado revelar renúncia ao poder de retirar a oferta durante sua duração.','Candidato de boa-fé que realizou despesas pode ter direito a reembolso nas condições legais.','Concursos com promessa pública exigem prazo e devem observar a decisão da pessoa indicada como julgadora e as regras do anúncio.']}
    ],
    table:{headers:['Evento','Efeito'],rows:[['Anúncio público válido','Nasce vinculação unilateral'],['Condição cumprida','Recompensa exigível'],['Revogação possível','Mesma publicidade e antes do cumprimento'],['Prazo de execução fixado','Em regra impede retirada durante o prazo']]},
    example:'Empresa anuncia publicamente recompensa pela localização de objeto. Pessoa que o encontra e cumpre as condições pode exigir o prêmio ainda que nem soubesse do anúncio quando iniciou a busca.',
    trap:'A promessa de recompensa não exige contrato bilateral nem aceitação dirigida prévia. A obrigação surge do anúncio e do preenchimento da condição.',
    memorize:['Anúncio público pode gerar obrigação unilateral.','Cumpriu condição → pode cobrar.','Revogação exige mesma publicidade e limites legais.']
  },
  {
    id:'gestao-negocios',
    title:'Gestão de negócios',
    basis:'CC, arts. 861 a 875',
    text:'Gestão de negócios ocorre quando alguém, sem autorização, intervém em negócio alheio segundo o interesse e a vontade presumível do dono. A lei impõe deveres de diligência e prestação de contas e distribui os riscos conforme utilidade, necessidade e eventual oposição do interessado.',
    sections:[
      {title:'Deveres do gestor',bullets:['Atuar conforme interesse e vontade presumível do dono.','Comunicar a gestão quando possível e aguardar instruções sem abandonar providências urgentes.','Continuar a gestão até que o dono ou sucessor possa assumi-la quando a interrupção trouxer risco.','Empregar diligência habitual e prestar contas.','Responder por culpa e, em hipóteses agravadas, por consequências mais amplas quando atua contra vontade manifesta ou assume operações arriscadas.']},
      {title:'Efeitos para o dono',bullets:['Se a gestão foi útil ou necessária, o dono deve cumprir obrigações regularmente contraídas e reembolsar despesas necessárias ou úteis nas condições legais.','Ratificação da gestão produz efeitos semelhantes aos do mandato desde o início.','Gestão realizada para afastar prejuízo iminente recebe tratamento protetivo ainda que o resultado não seja integralmente favorável, conforme os requisitos legais.']}
    ],
    table:{headers:['Situação','Consequência-base'],rows:[['Gestão útil/necessária','Reembolso e assunção de obrigações nas condições legais'],['Ratificação','Efeitos aproximados ao mandato desde o início'],['Contra vontade manifesta','Responsabilidade do gestor pode se agravar']]},
    example:'Vizinho ausente sofre rompimento de tubulação; terceiro providencia reparo urgente sem mandato para evitar destruição do imóvel. Se a gestão foi necessária e adequada, pode haver reembolso.',
    trap:'Gestão de negócios não é mandato tácito automático. Ela começa justamente sem autorização e só a ratificação posterior aproxima seus efeitos dos do mandato.',
    memorize:['Gestão = atuação sem autorização em interesse alheio.','Gestor deve diligência e contas.','Ratificação retroage aos efeitos próprios da gestão ratificada.']
  },
  {
    id:'pagamento-indevido',
    title:'Pagamento indevido e repetição',
    basis:'CC, arts. 876 a 883',
    text:'Quem recebe aquilo que não era devido deve restituir. O instituto corrige deslocamento patrimonial decorrente de pagamento sem causa, com regras específicas sobre prova do erro, boa-fé, alienação de imóvel e hipóteses em que a repetição é vedada.',
    sections:[
      {title:'Dever de restituir',bullets:['Pagamento de dívida inexistente, já extinta ou feito a pessoa errada pode gerar restituição.','Também pode haver restituição quando se paga além do devido.','Quem pagou voluntariamente o indevido deve, em regra, provar o erro, ressalvadas hipóteses legais.','Se o recebedor inutilizou título, deixou prescrever ação ou abandonou garantias confiando legitimamente no pagamento, a repetição pode ser afastada, restando eventual ação contra o verdadeiro devedor.']},
      {title:'Limites da repetição',bullets:['Não se repete o que foi pago para solver dívida prescrita ou obrigação judicialmente inexigível nas hipóteses do art. 882.','Quem entrega algo para obter fim ilícito, imoral ou proibido por lei não tem simples direito de repetição em seu favor, aplicando-se a destinação legal.','Boa ou má-fé do recebedor repercute em frutos, benfeitorias e responsabilidades conforme remissões legais.']}
    ],
    table:{headers:['Pagamento','Regra'],rows:[['Sem dívida','Restituição, em regra'],['Dívida prescrita paga voluntariamente','Não se repete apenas por estar prescrita'],['Fim ilícito/imoral','Repetição em favor do pagador é afastada'],['Recebedor alterou posição de boa-fé nas condições do art. 880','Pode haver proteção contra repetição']]},
    example:'Pessoa paga novamente fatura já quitada por erro operacional. Demonstrado o pagamento indevido, surge, em regra, dever de restituição.',
    trap:'Dívida prescrita não é igual a dívida inexistente. O pagamento voluntário de obrigação prescrita, em regra, não pode ser repetido.',
    memorize:['Recebeu o que não era devido → restitui, em regra.','Pagamento voluntário indevido: erro normalmente deve ser provado.','Dívida prescrita paga espontaneamente não se repete.']
  },
  {
    id:'enriquecimento-sem-causa',
    title:'Enriquecimento sem causa',
    basis:'CC, arts. 884 a 886; jurisprudência do STJ',
    text:'Enriquecimento sem causa impede que alguém obtenha vantagem patrimonial injustificada à custa de outra pessoa. A restituição busca eliminar o deslocamento sem causa e tem caráter subsidiário quando o ordenamento fornece meio específico adequado.',
    sections:[
      {title:'Requisitos',bullets:['Enriquecimento de uma parte.','Empobrecimento correspondente de outra.','Relação causal entre vantagem e sacrifício.','Ausência de justa causa jurídica.','Inexistência de meio específico que afaste a ação de enriquecimento no caso concreto, segundo a subsidiariedade do art. 886.']},
      {title:'Extensão e causa superveniente',bullets:['A restituição alcança o indevidamente auferido com atualização.','Se a coisa determinada deixou de existir, considera-se o valor na época em que foi exigida, conforme a disciplina legal aplicável.','O dever de restituir também surge quando a causa que justificava o enriquecimento deixa de existir.','A jurisprudência do STJ trata a ação in rem verso como instrumento subsidiário, não como atalho para contornar prescrição ou requisitos de ação específica.']}
    ],
    table:{headers:['Elemento','Pergunta'],rows:[['Enriquecimento','Houve vantagem patrimonial?'],['Empobrecimento','Outra pessoa suportou sacrifício correlato?'],['Causa','Existe fundamento jurídico para a vantagem?'],['Subsidiariedade','A lei já oferece ação específica adequada?']]},
    example:'Patrimônio de A aumenta diretamente à custa de B sem contrato, lei ou outra causa que justifique a transferência e sem remédio específico mais adequado. Pode surgir restituição por enriquecimento sem causa.',
    trap:'A ação de enriquecimento não serve para ressuscitar pretensão específica já prescrita nem para contornar regime jurídico que fornece solução própria.',
    memorize:['Art. 884: ninguém enriquece sem causa à custa de outrem.','Art. 886: subsidiariedade.','Sem causa ou causa que deixou de existir → restituição pode surgir.']
  },
  {
    id:'preferencias-creditorias',
    title:'Preferências e privilégios creditórios',
    basis:'CC, arts. 955 a 965',
    text:'Quando o patrimônio do devedor é insuficiente para todos os credores, o Código disciplina preferências materiais entre créditos. A igualdade é a regra na ausência de título legal de preferência; direitos reais e privilégios rompem essa paridade nos limites da lei.',
    sections:[
      {title:'Ordem e paridade',bullets:['Sem título legal de preferência, credores têm igual direito sobre os bens do devedor comum.','Títulos legais de preferência são privilégios e direitos reais.','Crédito real prefere ao pessoal; crédito pessoal privilegiado prefere ao simples; privilégio especial prefere ao geral.','Credores da mesma classe e mesmo título podem sofrer rateio proporcional quando o produto dos bens for insuficiente.']},
      {title:'Privilégio especial e geral',bullets:['Privilégio especial incide sobre bens expressamente sujeitos pela lei ao pagamento do crédito favorecido.','Privilégio geral alcança bens não sujeitos a crédito real nem a privilégio especial.','Os arts. 964 e 965 enumeram hipóteses de créditos com privilégio especial e geral e devem ser consultados em questões literais.','A aplicação prática convive com legislação falimentar, processual, trabalhista e tributária especial, que pode estabelecer regimes próprios.']}
    ],
    table:{headers:['Classe','Preferência-base'],rows:[['Crédito real','Prefere ao pessoal'],['Pessoal privilegiado','Prefere ao pessoal simples'],['Privilégio especial','Prefere ao geral'],['Mesma classe e título','Rateio proporcional se insuficiente']]},
    example:'Dois credores quirografários sem qualquer preferência legal concorrem em igualdade sobre o patrimônio disponível; a mera anterioridade cronológica do crédito não cria preferência civil.',
    trap:'Preferência não se presume pela data da dívida. É necessário título legal de preferência ou direito real aplicável.',
    memorize:['Sem preferência legal → igualdade.','Real > pessoal.','Privilegiado > simples.','Especial > geral.']
  }
];

function esc(v){
  return String(v==null?'':v).replace(/[&<>"']/g,function(c){return({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])});
}
function load(){
  try{
    var value=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');
    if(!value||typeof value!=='object')value={};
    if(!value.done||typeof value.done!=='object')value.done={};
    return value;
  }catch(e){return {done:{}}}
}
function save(value){
  value.version=1;
  value.updatedAt=new Date().toISOString();
  localStorage.setItem(STORAGE_KEY,JSON.stringify(value));
}
function isDone(state,topicId){
  return !!(state.done&&state.done[MODULE_ID]&&state.done[MODULE_ID][topicId]);
}
function countDone(state){
  return TOPICS.filter(function(t){return isDone(state,t.id)}).length;
}
function richTopicHtml(topic){
  var html='<p class="ct-lead">'+esc(topic.text)+'</p>';
  (topic.sections||[]).forEach(function(section){
    html+='<section class="ct-section"><h5>'+esc(section.title)+'</h5>';
    if(section.text)html+='<p>'+esc(section.text)+'</p>';
    if(section.bullets&&section.bullets.length)html+='<ul>'+section.bullets.map(function(item){return '<li>'+esc(item)+'</li>'}).join('')+'</ul>';
    html+='</section>';
  });
  if(topic.table&&topic.table.headers&&topic.table.rows){
    html+='<div class="ct-table-wrap"><table><thead><tr>'+topic.table.headers.map(function(item){return '<th>'+esc(item)+'</th>'}).join('')+'</tr></thead><tbody>';
    html+=topic.table.rows.map(function(row){return '<tr>'+row.map(function(item){return '<td>'+esc(item)+'</td>'}).join('')+'</tr>'}).join('');
    html+='</tbody></table></div>';
  }
  if(topic.example)html+='<aside class="ct-callout ct-example"><b>Exemplo aplicado</b><p>'+esc(topic.example)+'</p></aside>';
  if(topic.trap)html+='<aside class="ct-callout ct-trap"><b>Pegadinha FCC</b><p>'+esc(topic.trap)+'</p></aside>';
  if(topic.memorize&&topic.memorize.length)html+='<aside class="ct-callout ct-memorize"><b>O que memorizar</b><ul>'+topic.memorize.map(function(item){return '<li>'+esc(item)+'</li>'}).join('')+'</ul></aside>';
  html+='<div class="ct-basis"><b>Base legal</b><span>'+esc(topic.basis)+'</span></div>';
  return html;
}
function topicHtml(topic,index,state){
  var done=isDone(state,topic.id);
  return '<details class="ct-topic ct-rich '+(done?'done':'')+'" data-ct-topic="'+esc(topic.id)+'"><summary><span class="ct-index">'+String(index+1).padStart(2,'0')+'</span><span class="ct-title"><b>'+esc(topic.title)+'</b><small>'+esc(topic.basis)+'</small></span><span class="ct-status">'+(done?'✓':'Abrir')+'</span></summary><div class="ct-body">'+richTopicHtml(topic)+'<div class="ct-complete"><button type="button" class="'+(done?'done':'')+'" onclick="return civilTheoryModule6Toggle(&quot;'+esc(topic.id)+'&quot;,this)">'+(done?'✓ Subtópico estudado — desfazer':'Marcar subtópico como estudado')+'</button></div></div></details>';
}
function shellHtml(state){
  var done=countDone(state),pct=TOPICS.length?Math.round(done/TOPICS.length*100):0;
  return '<div class="ct-shell ct-shell-complete" data-ct-module="'+MODULE_ID+'" data-ct-module6-v="66108"><div class="ct-head"><div><span>TEORIA COMPLETA DO MÓDULO 6</span><b>'+TOPICS.length+' subtópicos para aprender e revisar</b><small>Obrigações: modalidades, transmissão, pagamento, extinção, inadimplemento, atos unilaterais e preferências. Anki, Decorando, TEC e histórico permanecem separados e preservados.</small></div><strong data-ct-count>'+done+'/'+TOPICS.length+'</strong></div><div class="ct-meter"><span data-ct-bar style="width:'+pct+'%"></span></div><div class="ct-list">'+TOPICS.map(function(topic,index){return topicHtml(topic,index,state)}).join('')+'</div></div>';
}
function enhance(html){
  try{
    var parser=new DOMParser(),doc=parser.parseFromString('<div id="ctm6-root">'+html+'</div>','text/html'),root=doc.getElementById('ctm6-root');
    if(!root)return html;
    var module=root.querySelector('[data-civil-analista="'+MODULE_ID+'"]');
    if(!module)return html;
    var oldShell=module.querySelector('.ct-shell[data-ct-module="'+MODULE_ID+'"]');
    var oldCount=oldShell?oldShell.querySelectorAll('.ct-topic').length:0;
    if(oldShell)oldShell.remove();
    var sections=Array.from(module.querySelectorAll('.civil-a-section'));
    var theory=sections.find(function(section){var h=section.querySelector('h4');return h&&/teoria essencial/i.test(h.textContent||'')});
    if(!theory)return html;
    var marker=theory.querySelector('.csp-topic-read');
    if(marker)marker.insertAdjacentHTML('beforebegin',shellHtml(load()));
    else theory.insertAdjacentHTML('beforeend',shellHtml(load()));
    var meta=root.querySelector('.civil-a-meta');
    if(meta&&!meta.querySelector('.ct-chip-obrigacoes')){
      meta.insertAdjacentHTML('beforeend','<span class="civil-a-chip ct-chip ct-chip-obrigacoes">Módulo 6 completo · '+TOPICS.length+' subtópicos</span>');
    }
    var globalChip=root.querySelector('.civil-a-meta .ct-chip:not(.ct-chip-obrigacoes)');
    if(globalChip&&oldCount&&TOPICS.length!==oldCount){
      var txt=globalChip.textContent||'';
      globalChip.textContent=txt.replace(/(\d+)(\s+subtópicos)/,function(_,n,s){return String(Number(n)+TOPICS.length-oldCount)+s});
    }
    return root.innerHTML;
  }catch(e){
    console.error('Teoria completa do Módulo 6',e);
    return html;
  }
}
function updateVisible(state){
  var shell=document.querySelector('.ct-shell[data-ct-module="'+MODULE_ID+'"]');
  if(!shell)return;
  var done=countDone(state),pct=TOPICS.length?Math.round(done/TOPICS.length*100):0;
  var count=shell.querySelector('[data-ct-count]'),bar=shell.querySelector('[data-ct-bar]');
  if(count)count.textContent=done+'/'+TOPICS.length;
  if(bar)bar.style.width=pct+'%';
}

window.civilTheoryModule6Toggle=function(topicId,button){
  if(!TOPICS.some(function(t){return t.id===topicId}))return false;
  var state=load();
  state.done[MODULE_ID]=state.done[MODULE_ID]||{};
  var next=!state.done[MODULE_ID][topicId];
  if(next)state.done[MODULE_ID][topicId]={at:Date.now()};else delete state.done[MODULE_ID][topicId];
  save(state);
  var topic=button&&button.closest?button.closest('.ct-topic'):null;
  if(topic){
    topic.classList.toggle('done',next);
    var status=topic.querySelector('.ct-status');
    if(status)status.textContent=next?'✓':'Abrir';
  }
  if(button){
    button.classList.toggle('done',next);
    button.textContent=next?'✓ Subtópico estudado — desfazer':'Marcar subtópico como estudado';
  }
  updateVisible(state);
  return false;
};

var originalRenderCivil=window.renderCivilMaster;
if(typeof originalRenderCivil==='function'){
  window.renderCivilMaster=function(){
    return enhance(originalRenderCivil.apply(this,arguments));
  };
}

window.__civilTheoryModule6SelfTest=function(){
  var ids=TOPICS.map(function(t){return t.id});
  return {version:VERSION,moduleId:MODULE_ID,total:TOPICS.length,unique:new Set(ids).size,rich:TOPICS.filter(function(t){return !!(t.sections&&t.table&&t.example&&t.trap&&t.memorize)}).length,ids:ids};
};

function rerender(){
  try{
    if(typeof window.renderAll==='function')window.renderAll();
    else if(typeof window.renderSubjects==='function')window.renderSubjects();
  }catch(e){console.error('Renderização do Módulo 6',e)}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(rerender,20)},{once:true});
else setTimeout(rerender,20);

})();