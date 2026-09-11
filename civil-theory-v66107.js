(function(){
'use strict';

if(window.__civilTheorySubtopicsLoadedV1)return;
window.__civilTheorySubtopicsLoadedV1=true;

var VERSION='1.5.0';
var STORAGE_KEY='central-v6:civil-theory-subtopics-v1';
var THEORY={
  'civ-pessoa-natural':[
    {
      id:'personalidade-nascituro',
      title:'Personalidade civil e início da pessoa natural',
      basis:'CC, arts. 1º e 2º',
      text:'A personalidade civil é a aptidão genérica para ser titular de direitos e deveres. Toda pessoa a possui; por isso, ela não se confunde com a possibilidade de praticar pessoalmente cada ato da vida civil. Pelo texto do Código Civil, a personalidade começa com o nascimento com vida, embora a lei resguarde, desde a concepção, os direitos do nascituro.',
      sections:[
        {title:'Nascimento com vida',bullets:['O dado decisivo é a existência de vida após a separação do corpo materno, ainda que por tempo muito curto.','Viabilidade prolongada, forma humana e corte do cordão umbilical não são requisitos legais para o início da personalidade.','Se houve nascimento com vida e morte logo depois, a criança chegou a adquirir direitos, inclusive sucessórios, que poderão ser transmitidos aos seus próprios herdeiros.']},
        {title:'Nascituro e prole eventual',bullets:['Nascituro é o ser humano já concebido, mas ainda não nascido. Seus direitos são protegidos desde a concepção.','Prole eventual é a pessoa ainda não concebida, considerada pela lei apenas em situações específicas, como certas disposições testamentárias.','A doutrina formula teorias natalista, concepcionista e da personalidade condicional. Para questão de literalidade, parta sempre do art. 2º: nascimento com vida, com direitos do nascituro resguardados desde a concepção.']}
      ],
      table:{headers:['Conceito','Situação','Ponto central'],rows:[['Pessoa nascida','Nasceu com vida','Tem personalidade civil'],['Nascituro','Já foi concebido','A lei resguarda seus direitos desde a concepção'],['Prole eventual','Ainda não foi concebida','Só recebe proteção nas hipóteses legais específicas']]},
      example:'Ana falece durante o parto. O bebê respira após o nascimento e morre minutos depois. Como nasceu com vida, adquiriu personalidade e pode ter herdado de Ana; o patrimônio recebido será transmitido segundo a sucessão do próprio bebê.',
      trap:'A FCC pode trocar “personalidade” por “capacidade de exercício” ou afirmar que a personalidade depende de viabilidade. Está errado: personalidade começa com o nascimento com vida; capacidade para exercer atos pessoalmente é outro tema.',
      memorize:['Personalidade: aptidão para titularizar direitos e deveres.','Regra literal: nascimento com vida.','Proteção do nascituro: desde a concepção.','Nascituro já foi concebido; prole eventual ainda não.']
    },
    {
      id:'capacidade-incapacidade',
      title:'Capacidade de direito e capacidade de exercício',
      basis:'CC, arts. 1º, 3º e 4º',
      text:'Capacidade de direito, também chamada capacidade de gozo, é a aptidão para adquirir direitos e contrair deveres e acompanha toda pessoa. Capacidade de exercício, ou de fato, é a aptidão para praticar pessoalmente os atos da vida civil. A incapacidade limita o exercício; não elimina personalidade nem capacidade de direito.',
      sections:[
        {title:'Incapacidade absoluta',bullets:['Após a Lei Brasileira de Inclusão, somente os menores de 16 anos são absolutamente incapazes.','Seus atos são praticados por representante. Como regra, o negócio praticado diretamente pelo absolutamente incapaz é nulo.']},
        {title:'Incapacidade relativa',bullets:['São relativamente incapazes os maiores de 16 e menores de 18 anos.','Também o são os ébrios habituais, os viciados em tóxico, aqueles que, por causa transitória ou permanente, não puderem exprimir vontade, e os pródigos.','O relativamente incapaz é assistido nos atos para os quais a lei exige assistência. Como regra, a falta de assistência torna o negócio anulável.','A extensão concreta da limitação não é necessariamente idêntica em todas as hipóteses; no caso do pródigo, por exemplo, a proteção se concentra nos atos patrimoniais que possam comprometer seus bens.']}
      ],
      table:{headers:['Categoria','Quem integra','Proteção nos atos civis','Regra do negócio sem proteção'],rows:[['Absolutamente incapaz','Menor de 16 anos','Representação','Nulidade'],['Relativamente incapaz','Hipóteses do art. 4º','Assistência','Anulabilidade'],['Capaz','Quem não está sujeito a limitação legal','Age pessoalmente','Negócio normalmente válido']]},
      example:'Um adolescente de 15 anos deve ser representado. Aos 17, em regra, será assistido. Em ambos os casos ele continua titular de patrimônio e de direitos: o que muda é a forma de exercício.',
      trap:'Deficiência, por si só, não consta dos arts. 3º e 4º como causa de incapacidade. Também está errada a antiga afirmação de que quem não pode exprimir vontade é absolutamente incapaz: hoje essa é hipótese de incapacidade relativa.',
      memorize:['Toda pessoa tem capacidade de direito.','Absolutamente incapaz: apenas o menor de 16 anos.','Absoluta → representação → nulidade, em regra.','Relativa → assistência → anulabilidade, em regra.']
    },
    {
      id:'deficiencia-curatela-decisao-apoiada',
      title:'Pessoa com deficiência, curatela e decisão apoiada',
      basis:'CC, arts. 4º e 1.767 a 1.783-A; LBI, arts. 6º e 84 a 87',
      text:'A Lei Brasileira de Inclusão abandonou a associação automática entre deficiência e incapacidade. A pessoa com deficiência tem assegurado o exercício de sua capacidade legal em igualdade de condições com as demais pessoas. Quando necessário, podem ser adotados mecanismos individualizados de proteção, sem uma substituição genérica de sua vontade.',
      sections:[
        {title:'Curatela',bullets:['É medida protetiva extraordinária, proporcional às necessidades e circunstâncias do caso concreto e deve durar o menor tempo possível.','A sentença deve delimitar os atos alcançados. Pela regra literal da LBI, a curatela afeta somente atos relacionados a direitos de natureza patrimonial e negocial.','Não alcança, por si, direito ao próprio corpo, sexualidade, matrimônio, privacidade, educação, saúde, trabalho e voto.','A existência de deficiência não basta: é indispensável avaliar se a pessoa se enquadra em hipótese legal e qual apoio efetivamente necessita.']},
        {title:'Tomada de decisão apoiada',bullets:['É um processo no qual a própria pessoa com deficiência escolhe pelo menos duas pessoas idôneas e de sua confiança para apoiá-la em decisões sobre atos da vida civil.','Os apoiadores fornecem informações e elementos para que a pessoa exerça sua capacidade; não se tornam representantes gerais.','O pedido apresenta os limites do apoio e os compromissos dos apoiadores e é submetido ao Judiciário.','A pessoa apoiada conserva capacidade e protagonismo. O apoiador que agir com negligência, pressão indevida ou descumprimento pode ser afastado e responsabilizado.']}
      ],
      table:{headers:['Medida','Quem decide','Efeito principal','Alcance'],rows:[['Curatela','Curador, dentro dos limites da sentença','Proteção excepcional com delimitação judicial','Regra literal: atos patrimoniais e negociais'],['Decisão apoiada','A própria pessoa apoiada','Recebe auxílio para formar e manifestar a decisão','Termos definidos no processo, sem perda geral da capacidade']]},
      example:'Uma pessoa com deficiência intelectual pode escolher apoiadores para compreender um financiamento e decidir por si. Se não conseguir exprimir vontade e houver necessidade concreta, o juiz poderá fixar curatela apenas para determinados atos patrimoniais.',
      trap:'“Pessoa com deficiência é relativamente incapaz” é falso. A deficiência não reduz automaticamente a capacidade civil. Outra inversão comum é dizer que a tomada de decisão apoiada transfere a decisão aos apoiadores; quem decide é a pessoa apoiada.',
      memorize:['Deficiência não gera incapacidade automática.','Curatela: extraordinária, proporcional e pelo menor tempo possível.','Curatela: limites expressos na sentença; foco patrimonial e negocial.','Decisão apoiada: a pessoa mantém a decisão e escolhe ao menos dois apoiadores.']
    },
    {
      id:'emancipacao',
      title:'Maioridade e emancipação',
      basis:'CC, art. 5º',
      text:'A menoridade cessa aos 18 anos completos. A emancipação antecipa a capacidade civil plena antes dessa idade, sem transformar o adolescente em maior para todos os ramos do Direito. Ela pode decorrer de ato voluntário dos pais, de decisão judicial ou diretamente de um fato previsto em lei.',
      sections:[
        {title:'Emancipação voluntária',bullets:['Concedida por ambos os pais, ou por um deles na falta do outro, por instrumento público.','Não depende de homologação judicial.','Exige que o menor tenha 16 anos completos.']},
        {title:'Emancipação judicial',bullets:['É concedida por sentença, ouvido o tutor.','Também pressupõe 16 anos completos.','É utilizada especialmente quando o menor está sob tutela, pois o tutor não pode emancipá-lo por simples ato particular.']},
        {title:'Emancipação legal',bullets:['Decorre do casamento.','Decorre do exercício de emprego público efetivo.','Decorre da colação de grau em curso de ensino superior.','Decorre do estabelecimento civil ou comercial, ou de relação de emprego, desde que o menor com 16 anos completos tenha economia própria.']}
      ],
      table:{headers:['Espécie','Fato ou ato','Forma','Idade mínima expressa'],rows:[['Voluntária','Concessão dos pais','Instrumento público, sem homologação','16 anos completos'],['Judicial','Sentença após ouvir o tutor','Processo judicial','16 anos completos'],['Legal','Hipóteses do parágrafo único do art. 5º','Opera por força da lei','Depende da hipótese; economia própria exige 16 anos']]},
      example:'Uma jovem de 16 anos que mantém estabelecimento comercial e possui economia própria emancipa-se por força da lei. Já a simples existência de um trabalho informal sem economia própria não basta para essa hipótese.',
      trap:'Emancipação produz capacidade para a vida civil, mas não antecipa automaticamente maioridade penal, idade mínima para habilitação ou outros limites de leis especiais. Casamento é hipótese legal; união estável não aparece no rol do art. 5º.',
      memorize:['Maioridade civil: 18 anos completos.','Voluntária: pais + instrumento público + 16 anos.','Judicial: sentença + tutor ouvido + 16 anos.','Legal: casamento, emprego público efetivo, grau superior ou economia própria nas condições legais.']
    },
    {
      id:'morte-comoriencia-registro',
      title:'Morte, morte presumida e comoriência',
      basis:'CC, arts. 6º a 8º',
      text:'A existência da pessoa natural termina com a morte. Além da morte comprovada, o Código admite morte presumida na ausência e, excepcionalmente, sem decretação de ausência. A comoriência resolve a incerteza sobre a ordem de falecimentos de pessoas que morreram na mesma ocasião.',
      sections:[
        {title:'Morte presumida sem ausência',bullets:['Pode ser declarada quando for extremamente provável a morte de quem estava em perigo de vida.','Também pode ser declarada para desaparecido em campanha ou feito prisioneiro que não seja encontrado até dois anos após o término da guerra.','A declaração somente pode ser requerida depois de esgotadas buscas e averiguações.','A sentença deve fixar a data provável do falecimento.']},
        {title:'Comoriência',bullets:['Aplica-se quando duas ou mais pessoas morrem na mesma ocasião e não é possível verificar quem morreu primeiro.','A lei presume que morreram simultaneamente.','A presunção é relativa: prova confiável da ordem das mortes afasta a comoriência.','Sem sobrevivência entre elas, os comorientes não herdam uns dos outros; examina-se separadamente a sucessão de cada um.']}
      ],
      table:{headers:['Situação','Requisito principal','Efeito'],rows:[['Morte comprovada','Constatação do óbito','Fim da personalidade e abertura da sucessão'],['Morte presumida sem ausência','Hipótese do art. 7º + buscas esgotadas','Sentença fixa data provável'],['Comoriência','Impossibilidade de provar a ordem das mortes','Presunção de simultaneidade']]},
      example:'Pai e filho, herdeiros um do outro, morrem no mesmo acidente. Sem prova de quem sobreviveu, presume-se morte simultânea: o filho não herda do pai e o pai não herda do filho.',
      trap:'Morrer no mesmo lugar ou pelo mesmo evento não basta para a comoriência; é necessária a impossibilidade de descobrir a ordem das mortes. E as hipóteses do art. 7º dispensam o procedimento de ausência, mas não dispensam buscas e averiguações.',
      memorize:['Morte encerra a existência da pessoa natural.','Art. 7º: perigo de vida ou desaparecimento ligado à guerra.','Morte presumida direta: buscas esgotadas e data provável na sentença.','Comoriência: presunção de mortes simultâneas e ausência de transmissão entre os comorientes.']
    },
    {
      id:'estado-registros',
      title:'Estado da pessoa e registros públicos',
      basis:'CC, arts. 9º e 10; Lei 6.015/1973',
      text:'Estado da pessoa é sua posição juridicamente relevante no meio social e familiar, com projeções individuais, familiares e políticas. Os registros públicos documentam fatos e atos do estado civil, oferecem publicidade, autenticidade, segurança e eficácia, mas registro e averbação cumprem funções diferentes.',
      sections:[
        {title:'O que se registra',bullets:['Nascimentos, casamentos e óbitos.','Emancipação por outorga dos pais ou por sentença do juiz.','Interdição por incapacidade absoluta ou relativa, observada a leitura atual do regime de incapacidades.','Sentença declaratória de ausência e de morte presumida.']},
        {title:'O que se averba',bullets:['Sentenças que decretam nulidade ou anulação do casamento, divórcio, separação judicial e restabelecimento da sociedade conjugal.','Atos judiciais ou extrajudiciais que declaram ou reconhecem filiação.','A averbação anota alteração ou ocorrência posterior à margem de um registro já existente; não é sinônimo de criar o assento originário.']}
      ],
      table:{headers:['Técnica','Função prática','Exemplo'],rows:[['Registro','Cria o assento principal do fato ou ato','Nascimento, casamento, óbito, emancipação'],['Averbação','Atualiza um assento anterior','Divórcio no registro de casamento; reconhecimento de filiação']]},
      example:'O casamento recebe assento próprio no registro civil. Se depois houver divórcio, a sentença ou escritura será averbada no assento do casamento, preservando o histórico jurídico.',
      trap:'A banca costuma trocar as listas dos arts. 9º e 10. Memorize a lógica: nascimento, casamento e óbito são registros; divórcio e reconhecimento de filiação são acontecimentos posteriores e, por isso, são averbados.',
      memorize:['Registro forma o assento principal.','Averbação atualiza registro já existente.','Ausência e morte presumida: registro.','Divórcio e reconhecimento de filiação: averbação.']
    },
    {
      id:'direitos-personalidade',
      title:'Teoria geral dos direitos da personalidade',
      basis:'CC, arts. 11 e 12',
      text:'Direitos da personalidade protegem os aspectos essenciais da pessoa, como integridade física e psíquica, identidade, honra, imagem, nome e privacidade. São projeções da dignidade humana e podem receber tutela preventiva, inibitória e reparatória. O rol do Código Civil é exemplificativo, não uma lista fechada.',
      sections:[
        {title:'Características essenciais',bullets:['São intransmissíveis e irrenunciáveis, como regra expressa do art. 11.','Seu exercício não pode sofrer limitação voluntária permanente e geral, ressalvadas as hipóteses autorizadas pelo ordenamento.','São oponíveis contra todos, extrapatrimoniais em sua essência, inatos e imprescritíveis quanto ao direito em si.','Não são absolutos: podem colidir com liberdade de expressão, informação, interesse público e outros direitos fundamentais, exigindo ponderação no caso concreto.','A pretensão patrimonial de indenização decorrente da violação pode prescrever, embora o direito da personalidade em si não desapareça pelo não uso.']},
        {title:'Tutela contra ameaça ou lesão',bullets:['Pode-se exigir que cesse a ameaça ou a lesão.','Também se pode reclamar perdas e danos, sem prejuízo de outras sanções previstas em lei.','Em caso de pessoa falecida, têm legitimação para requerer proteção o cônjuge sobrevivente ou qualquer parente em linha reta ou colateral até o quarto grau, segundo a regra geral do art. 12.','Alguns direitos possuem disciplina específica e legitimados próprios; por isso, a regra especial deve ser observada.']}
      ],
      table:{headers:['Afirmação','Correta?','Por quê'],rows:[['Podem ser vendidos definitivamente','Não','São intransmissíveis e extrapatrimoniais em sua essência'],['Podem ser renunciados de modo geral','Não','O art. 11 estabelece irrenunciabilidade'],['Podem sofrer toda e qualquer limitação','Não','Limitações devem ser específicas, temporárias e juridicamente justificadas'],['Geram prevenção e reparação','Sim','É possível fazer cessar a lesão e pedir perdas e danos']]},
      example:'Uma autorização específica para uso de imagem em determinada campanha não significa renúncia definitiva à imagem em qualquer contexto. Se a utilização ultrapassar o consentimento, poderá haver cessação e reparação.',
      trap:'“Imprescritível” não significa que toda ação indenizatória possa ser proposta a qualquer tempo. O direito da personalidade não se extingue pelo não uso, mas a pretensão de reparação patrimonial submete-se à prescrição.',
      memorize:['Rol dos arts. 11 a 21 é exemplificativo.','Regra: intransmissíveis e irrenunciáveis.','Direitos não são absolutos.','Tutela: cessar ameaça/lesão + perdas e danos + outras sanções.']
    },
    {
      id:'corpo-tratamento-medico',
      title:'Corpo, transplantes e tratamento médico',
      basis:'CC, arts. 13 a 15; Lei 9.434/1997',
      text:'A integridade corporal integra os direitos da personalidade. O Código Civil disciplina a disposição do próprio corpo em vida, a destinação gratuita para depois da morte e a proteção contra constrangimento a tratamento médico ou intervenção cirúrgica com risco de vida. A matéria convive com legislação especial, especialmente a de transplantes.',
      sections:[
        {title:'Disposição do corpo em vida',bullets:['Salvo exigência médica, é vedado dispor do próprio corpo quando isso importar diminuição permanente da integridade física ou contrariar os bons costumes.','A regra admite a disposição para fins de transplante na forma estabelecida em lei especial.','Consentimento não torna lícita qualquer intervenção: finalidade, risco, integridade e disciplina legal continuam relevantes.']},
        {title:'Disposição após a morte',bullets:['É válida a disposição gratuita do próprio corpo, total ou parcialmente, para depois da morte, com objetivo científico ou altruístico.','O ato de disposição pode ser livremente revogado a qualquer tempo.','Na efetivação de transplantes, devem ser observadas as regras especiais sobre autorização e procedimento.']},
        {title:'Tratamento médico',bullets:['Ninguém pode ser constrangido a submeter-se, com risco de vida, a tratamento médico ou intervenção cirúrgica.','A autonomia exige informação adequada sobre diagnóstico, benefícios, riscos e alternativas, ressalvadas situações excepcionais disciplinadas pelo ordenamento.']}
      ],
      table:{headers:['Hipótese','Regra central','Observação'],rows:[['Disposição em vida','Veda diminuição permanente ou ofensa aos bons costumes','Admite exigência médica e transplante conforme lei especial'],['Disposição pós-morte','Gratuita, com finalidade científica ou altruística','Livremente revogável'],['Tratamento com risco de vida','Vedação ao constrangimento','Protege autonomia do paciente']]},
      example:'Uma pessoa pode declarar que deseja destinar gratuitamente seu corpo à pesquisa depois da morte e revogar essa decisão posteriormente. A execução concreta deverá respeitar os requisitos legais aplicáveis.',
      trap:'O art. 14 não autoriza venda do corpo: a disposição pós-morte deve ser gratuita e ter finalidade científica ou altruística. No art. 15, a literalidade associa a vedação ao constrangimento à existência de risco de vida.',
      memorize:['Art. 13: corpo em vida e limites.','Art. 14: disposição gratuita pós-morte + finalidade científica/altruística + revogabilidade.','Art. 15: ninguém será constrangido a tratamento ou cirurgia com risco de vida.','Transplantes obedecem também à lei especial.']
    },
    {
      id:'nome-imagem-privacidade',
      title:'Nome, pseudônimo, imagem, honra e privacidade',
      basis:'CC, arts. 16 a 21; Lei 6.015/1973, arts. 56 e 57',
      text:'Nome, pseudônimo, imagem, honra e vida privada identificam e protegem a pessoa em suas relações sociais. O Código assegura nome e prenome, impede usos que exponham ao desprezo público ou explorem indevidamente fins comerciais e autoriza medidas para impedir ou fazer cessar violações à vida privada.',
      sections:[
        {title:'Nome e pseudônimo',bullets:['Toda pessoa tem direito ao nome, nele compreendidos prenome e sobrenome.','Sem autorização, não se pode usar o nome alheio em propaganda comercial.','O pseudônimo adotado para atividades lícitas recebe a mesma proteção conferida ao nome.','Atualmente, a pessoa registrada, ao atingir a maioridade, pode requerer pessoalmente e sem motivação a alteração extrajudicial do prenome uma vez. A desconstituição dessa alteração ou nova mudança imotivada depende de sentença judicial.','Sobrenomes podem ser alterados diretamente no registro nas hipóteses legais, como inclusão de sobrenomes familiares e mudanças relacionadas a casamento, divórcio e filiação.']},
        {title:'Imagem e honra',bullets:['Divulgação de escritos, transmissão da palavra e publicação, exposição ou utilização da imagem podem ser proibidas quando atingirem honra, boa fama ou respeitabilidade, ou quando se destinarem a fins comerciais, ressalvadas autorização e hipóteses justificadas pela administração da justiça ou manutenção da ordem pública.','A indenização pode coexistir com a medida destinada a impedir ou cessar a divulgação.','Para proteção da imagem de morto ou ausente, o art. 20 indica como legitimados o cônjuge, os ascendentes e os descendentes.']},
        {title:'Vida privada',bullets:['A vida privada da pessoa natural é inviolável.','A pedido do interessado, o juiz adotará as providências necessárias para impedir ou fazer cessar ato contrário à norma.','Privacidade não elimina automaticamente liberdade de informação; eventual conflito exige finalidade legítima, interesse público e proporcionalidade.']}
      ],
      table:{headers:['Bem protegido','Conduta típica de violação','Resposta jurídica'],rows:[['Nome/pseudônimo','Uso desautorizado, depreciativo ou comercial','Proibição, cessação e eventual indenização'],['Imagem/honra','Exposição lesiva ou exploração comercial indevida','Impedimento da divulgação e reparação'],['Vida privada','Intromissão ou divulgação injustificada','Providências para impedir ou cessar o ato']]},
      example:'Uma empresa usa a fotografia e o nome de alguém para anunciar produto sem autorização. A pessoa pode pedir a retirada da campanha e indenização, sem precisar aceitar uma exploração comercial permanente de sua identidade.',
      trap:'A regra atual do registro civil não limita a alteração imotivada do prenome ao primeiro ano após a maioridade. Ela pode ser requerida após os 18 anos, pessoalmente, por via extrajudicial, uma vez. Não confunda os legitimados gerais do art. 12 com os legitimados específicos da imagem no art. 20.',
      memorize:['Nome inclui prenome e sobrenome; pseudônimo lícito recebe proteção.','Prenome: alteração extrajudicial imotivada uma vez após a maioridade.','Imagem: atenção a honra, fins comerciais, autorização e exceções legais.','Vida privada: providências para impedir ou cessar violação.']
    },
    {
      id:'ausencia',
      title:'Ausência: curadoria e sucessões provisória e definitiva',
      basis:'CC, arts. 22 a 39',
      text:'Ausência é o regime protetivo aplicável a quem desaparece de seu domicílio sem notícias e deixa patrimônio que precisa de administração. O procedimento não produz imediatamente morte presumida: ele avança por etapas, com prazos e efeitos diferentes para proteger o ausente, seus possíveis sucessores e terceiros.',
      sections:[
        {title:'1. Curadoria dos bens',bullets:['Se a pessoa desaparece sem deixar representante ou procurador encarregado de administrar os bens, o juiz declara a ausência, arrecada os bens e nomeia curador.','A mesma solução se aplica quando o mandatário não quer ou não pode exercer ou continuar o mandato, ou quando seus poderes são insuficientes.','O cônjuge não separado judicialmente nem de fato por mais de dois anos antes da declaração é o legítimo curador. Na falta dele, seguem-se pais e descendentes, nesta ordem, sem impedimento; entre descendentes, os mais próximos precedem os remotos.','Na falta dessas pessoas, o juiz escolhe o curador. A sentença fixa poderes e obrigações conforme as circunstâncias.']},
        {title:'2. Sucessão provisória',bullets:['Pode ser requerida um ano depois da arrecadação dos bens; se o ausente deixou representante ou procurador, o prazo é de três anos.','Podem requerê-la os interessados indicados no art. 27, como cônjuge não separado, herdeiros presumidos, titulares de direito dependente da morte e credores de obrigações vencidas e não pagas.','A sentença que determina a abertura só produz efeito cento e oitenta dias depois de publicada pela imprensa, mas, transitada em julgado, procede-se à abertura do testamento, ao inventário e à partilha como se o ausente fosse falecido.','Em regra, herdeiros que entram na posse prestam garantias de restituição. Ascendentes, descendentes e cônjuge, uma vez provada a qualidade de herdeiros, podem entrar sem garantia.','Ascendentes, descendentes e cônjuge fazem seus todos os frutos e rendimentos; os demais sucessores devem capitalizar metade, prestar contas e assegurar restituição.']},
        {title:'3. Sucessão definitiva',bullets:['Pode ser requerida dez anos depois do trânsito em julgado da sentença que abriu a sucessão provisória.','Também pode ser requerida quando se provar que o ausente conta 80 anos de idade e que as últimas notícias dele datam de cinco anos.','Com a sucessão definitiva, levantam-se as garantias e a posição dos sucessores se consolida, sem eliminar por completo os efeitos de eventual retorno no prazo legal.']},
        {title:'Retorno do ausente',bullets:['Se aparecer durante a curadoria, recupera o patrimônio administrado.','Se aparecer durante a sucessão provisória, cessam as vantagens dos sucessores, que devem observar a disciplina legal de restituição, frutos e responsabilidade.','Se regressar nos dez anos seguintes à abertura da sucessão definitiva, recebe os bens existentes no estado em que se encontrarem, os sub-rogados em seu lugar ou o preço recebido pelos alienados.','Passado esse prazo sem regresso e sem interessado que promova a sucessão definitiva, os bens seguem a destinação pública prevista no art. 39.']}
      ],
      table:{headers:['Fase','Quando começa','Situação dos bens'],rows:[['Curadoria','Desaparecimento + falta ou insuficiência de representante','Arrecadação e administração por curador'],['Sucessão provisória','1 ano da arrecadação; 3 anos se havia representante/procurador','Posse provisória, em regra com garantia'],['Sucessão definitiva','10 anos do trânsito da abertura provisória; ou ausente com 80 anos e 5 sem notícias','Consolidação, ressalvados efeitos do retorno']]},
      example:'Carlos desaparece sem procurador. Após arrecadação, espera-se um ano para pedir sucessão provisória. Se tivesse deixado procurador com poderes para administrar, o prazo seria de três anos. A sucessão definitiva, como regra, somente viria dez anos após o trânsito da sentença de abertura provisória.',
      trap:'Os prazos contam de marcos diferentes: 1 ou 3 anos relacionam-se à sucessão provisória; 10 anos contam do trânsito em julgado da sentença de abertura provisória para a definitiva. A hipótese “80 anos de idade + 5 anos sem notícias” é alternativa.',
      memorize:['Curadoria: desaparecimento e falta/insuficiência de representante.','Provisória: 1 ano da arrecadação ou 3 anos com representante/procurador.','Efeito da sentença provisória: 180 dias após publicação.','Definitiva: 10 anos do trânsito da provisória ou 80 anos de idade + 5 sem notícias.','Retorno em até 10 anos da definitiva: bens existentes, sub-rogados ou preço.']
    }
  ],
  'civ-obrigacoes':[
    {id:'promessa-recompensa',title:'Promessa de recompensa',basis:'CC, arts. 854 a 860',text:'Quem anuncia publicamente recompensa em troca de certo comportamento ou resultado assume obrigação mesmo sem aceitação prévia dirigida. A revogação deve observar a mesma publicidade e não prejudica quem já cumpriu a condição. Se várias pessoas realizarem o ato, aplicam-se os critérios legais; concursos com prêmio exigem prazo e decisão conforme o anúncio.'},
    {id:'gestao-negocios',title:'Gestão de negócios',basis:'CC, arts. 861 a 875',text:'Há gestão de negócios quando alguém, sem autorização, intervém em negócio alheio no interesse e segundo a vontade presumível do dono. O gestor deve agir com diligência, prestar contas e continuar a gestão quando a interrupção trouxer risco. A ratificação produz efeitos semelhantes aos do mandato; gestão contra vontade manifesta amplia a responsabilidade do gestor.'},
    {id:'pagamento-indevido',title:'Pagamento indevido',basis:'CC, arts. 876 a 883',text:'Quem recebe o que não era devido deve restituir, inclusive quando a dívida existia mas foi paga à pessoa errada ou em extensão superior. Em regra, quem pagou voluntariamente prova o erro, ressalvadas hipóteses legais. A boa ou má-fé do recebedor repercute em frutos, benfeitorias e responsabilidade, e há proteção específica quando o título foi inutilizado ou a garantia abandonada.'},
    {id:'enriquecimento-sem-causa',title:'Enriquecimento sem causa',basis:'CC, arts. 884 a 886',text:'Ninguém pode enriquecer sem justa causa à custa de outra pessoa. A restituição limita-se ao enriquecimento obtido e ao empobrecimento correlato, com atualização. Se a causa inicialmente existente deixa de existir, também surge o dever de restituir. A ação é subsidiária: não cabe quando a lei fornece outro meio específico para recomposição.'}
  ],
  'civ-contratos-geral':[
    {id:'vicios-redibitorios',title:'Vícios redibitórios',basis:'CC, arts. 441 a 446',text:'São defeitos ocultos, anteriores à tradição, que tornam a coisa recebida em contrato comutativo imprópria ao uso ou lhe diminuem sensivelmente o valor. O adquirente escolhe entre redibição e abatimento do preço. A ignorância do alienante não elimina a garantia, mas sua ciência amplia as perdas e danos. Os prazos decadenciais variam conforme bem, posse e natureza do vício.'},
    {id:'eviccao',title:'Evicção',basis:'CC, arts. 447 a 457',text:'Evicção é a perda total ou parcial do bem por decisão fundada em direito anterior à aquisição. Nos contratos onerosos, o alienante responde pela garantia ainda que a aquisição tenha ocorrido em hasta pública. As partes podem ampliar, reduzir ou excluir a garantia, mas a exclusão não afasta toda restituição quando o adquirente ignorava o risco ou não o assumiu.'},
    {id:'contratos-aleatorios-preliminar',title:'Contratos aleatórios, contrato preliminar e pessoa a declarar',basis:'CC, arts. 458 a 471',text:'Nos contratos aleatórios, uma prestação depende de risco assumido, com consequências distintas se o risco recair sobre existência, quantidade ou coisa futura. O contrato preliminar deve conter os elementos essenciais do definitivo, salvo a forma, e pode gerar execução específica. Na cláusula de pessoa a declarar, a nomeação tempestiva substitui o contratante originário com os efeitos legais.'},
    {id:'extincao-contrato',title:'Extinção dos contratos',basis:'CC, arts. 472 a 480',text:'Distrato, resilição unilateral, resolução por inadimplemento e resolução por onerosidade excessiva têm fundamentos e efeitos diferentes. Cláusula resolutiva expressa opera conforme o ajuste; a tácita costuma exigir interpelação judicial. Nos contratos bilaterais, a exceção de contrato não cumprido protege o equilíbrio das prestações. A onerosidade extraordinária exige os pressupostos legais e pode permitir modificação equitativa.'}
  ],
  'civ-contratos-especie':[
    {id:'compra-venda',title:'Compra e venda',basis:'CC, arts. 481 a 504',text:'A compra e venda obriga uma parte a transferir domínio e a outra a pagar preço em dinheiro. Consenso sobre coisa e preço aperfeiçoa o contrato, mas a propriedade só se transfere pela tradição ou pelo registro. Estude riscos, despesas, venda por medida ou corpo certo, restrições entre cônjuges e ascendentes, preferência de condômino e venda conjunta.'},
    {id:'clausulas-especiais-venda',title:'Cláusulas especiais da compra e venda',basis:'CC, arts. 505 a 532',text:'Retrovenda permite ao vendedor de imóvel recobrá-lo no prazo legal; venda a contento e sujeita a prova dependem da satisfação do comprador; preempção impõe preferência; reserva de domínio conserva a propriedade móvel com o vendedor até pagamento; venda sobre documentos desloca a entrega para a tradição documental. Cada cláusula possui objeto, forma, prazo e efeitos próprios.'},
    {id:'troca-permuta',title:'Troca ou permuta',basis:'CC, art. 533',text:'Na troca, cada contratante entrega uma coisa para receber outra, aplicando-se em geral as regras da compra e venda. Salvo ajuste, despesas do instrumento dividem-se. É anulável a troca desigual entre ascendente e descendente sem consentimento dos demais descendentes e do cônjuge do alienante, conforme a regra legal.'},
    {id:'estimatorio',title:'Contrato estimatório',basis:'CC, arts. 534 a 537',text:'O consignante entrega bens móveis ao consignatário, que pode vendê-los e pagar o preço estimado ou restituí-los no prazo. Se a restituição integral se torna impossível, ainda sem culpa, permanece o dever de pagar. Enquanto não pago o preço, credores do consignatário não podem penhorar a coisa; o consignante não pode dispor dela antes da restituição ou comunicação.'},
    {id:'doacao',title:'Doação',basis:'CC, arts. 538 a 564',text:'Doação é liberalidade que transfere bens ou vantagens do patrimônio do doador ao donatário e, em regra, exige aceitação. Pode ser pura, remuneratória, modal, contemplativa ou em forma de subvenção periódica. Observe forma, doação verbal de pequeno valor, proteção da legítima, vedação à doação universal, reversão, doação entre cônjuges e revogação por ingratidão ou inexecução do encargo.'},
    {id:'locacao-coisas',title:'Locação de coisas',basis:'CC, arts. 565 a 578; Lei 8.245/1991',text:'O locador cede uso e gozo temporários de coisa não fungível mediante retribuição. Deve entregá-la e mantê-la apta ao uso; o locatário paga aluguel, usa conforme o ajuste, comunica turbações e restitui a coisa. O Código disciplina a locação em geral, enquanto imóveis urbanos submetem-se prioritariamente à Lei do Inquilinato.'},
    {id:'emprestimo',title:'Empréstimo: comodato e mútuo',basis:'CC, arts. 579 a 592',text:'Comodato é empréstimo gratuito de coisa infungível, com restituição da própria coisa; aperfeiçoa-se com a tradição. Mútuo transfere a propriedade de coisa fungível, impondo devolução de equivalente do mesmo gênero, qualidade e quantidade. No mútuo econômico presumem-se juros, respeitadas as regras vigentes. Riscos, despesas e mora diferem nos dois contratos.'},
    {id:'prestacao-servico',title:'Prestação de serviço',basis:'CC, arts. 593 a 609',text:'A disciplina civil aplica-se à prestação lícita material ou imaterial que não esteja sujeita às leis trabalhistas ou especiais. Remuneração, prazo, aviso prévio, impossibilidade e término seguem o contrato e o Código. O prazo convencional não pode exceder o limite legal, e ninguém pode ser constrangido indefinidamente à prestação pessoal.'},
    {id:'empreitada',title:'Empreitada',basis:'CC, arts. 610 a 626',text:'Na empreitada, o empreiteiro entrega uma obra, podendo fornecer apenas trabalho ou também materiais. O fornecimento de materiais não se presume. Distribuição dos riscos, alterações no projeto, medição, suspensão e preço dependem da modalidade. Em edifícios e construções consideráveis, há garantia legal de solidez e segurança, com prazo e decadência próprios.'},
    {id:'deposito',title:'Depósito',basis:'CC, arts. 627 a 652',text:'O depositário recebe bem móvel para guardar e restituir quando exigido. O depósito voluntário costuma ser gratuito e prova-se por escrito; o necessário decorre de calamidade ou obrigação legal. O depositário emprega cuidado próprio, não usa a coisa sem licença e possui hipóteses restritas de retenção. Hospedeiros respondem pelos bens dos hóspedes no regime legal.'},
    {id:'mandato',title:'Mandato',basis:'CC, arts. 653 a 692',text:'Mandato ocorre quando alguém recebe poderes para praticar atos ou administrar interesses em nome de outra pessoa; procuração é o instrumento. Pode ser expresso ou tácito, gratuito ou oneroso, geral ou especial. O mandatário deve atuar dentro dos poderes, prestar contas e transferir vantagens; substabelecimento, mandato em causa própria, excesso de poderes e extinção têm efeitos específicos.'},
    {id:'comissao',title:'Comissão',basis:'CC, arts. 693 a 709',text:'O comissário realiza negócios em nome próprio, mas por conta do comitente. Perante terceiros, ele é parte do contrato; internamente deve seguir instruções, agir com diligência e prestar contas. Em regra não responde pela insolvência de terceiros, salvo culpa ou cláusula del credere, que gera responsabilidade e remuneração adicional.'},
    {id:'agencia-distribuicao',title:'Agência e distribuição',basis:'CC, arts. 710 a 721',text:'O agente promove, de forma não eventual e sem dependência, negócios do proponente em determinada zona, mediante retribuição. Há distribuição quando o agente possui a coisa negociada à sua disposição. Exclusividade territorial, comissão, despesas, aviso prévio e indenização pelo encerramento seguem o contrato e a lei, sem confundir agência com emprego, comissão ou representação comercial especial.'},
    {id:'corretagem',title:'Corretagem',basis:'CC, arts. 722 a 729',text:'O corretor aproxima interessados e busca o resultado previsto sem relação de mandato, serviço ou dependência. Deve agir com diligência e informar riscos e circunstâncias relevantes. A remuneração torna-se devida quando alcançado o resultado da mediação, inclusive em situações legalmente previstas de arrependimento, exclusividade ou conclusão posterior decorrente da atividade.'},
    {id:'transporte',title:'Transporte',basis:'CC, arts. 730 a 756',text:'O transportador conduz pessoas ou coisas de um lugar a outro mediante retribuição, sem afastar tratados e legislação especial. No transporte de pessoas, a responsabilidade pela integridade é acentuada e cláusula de não indenizar é inválida. No transporte de coisas, documento, embalagem, informação, avaria, perda, entrega e responsabilidade de transportadores sucessivos exigem atenção.'},
    {id:'seguro',title:'Seguro privado',basis:'Lei 15.040/2024',text:'Desde a vigência da Lei 15.040/2024, o contrato de seguro privado possui disciplina legal própria, com revogação dos antigos arts. 757 a 802 do Código Civil. A teoria deve ser lida pela lei nova: interesse legítimo, risco garantido, prêmio, formação, agravamento do risco, sinistro, regulação, liquidação, seguro de dano, seguro sobre a vida e prescrição.'},
    {id:'constituicao-renda',title:'Constituição de renda',basis:'CC, arts. 803 a 813',text:'Uma pessoa entrega capital ou bem para que outra pague prestação periódica, temporária ou vitalícia. O contrato pode ser gratuito ou oneroso, em favor do instituidor ou de terceiro, e exige escritura pública quando a lei assim determina. Nulidade por morte próxima causada por doença conhecida e regras sobre resgate, falta de pagamento e impenhorabilidade merecem atenção.'},
    {id:'jogo-aposta',title:'Jogo e aposta',basis:'CC, arts. 814 a 817',text:'Dívidas de jogo ou aposta, em regra, não obrigam ao pagamento e o que foi pago voluntariamente não se repete, salvo dolo ou perda por menor ou interdito. A regra alcança contratos destinados a encobrir ou reconhecer a dívida, mas preserva jogos legalmente permitidos, prêmios autorizados e operações econômicas sobre títulos e mercadorias quando legítimas.'},
    {id:'fianca',title:'Fiança',basis:'CC, arts. 818 a 839',text:'O fiador garante obrigação de terceiro perante o credor. A fiança exige forma escrita, não admite interpretação extensiva e pode garantir dívida futura, mas a cobrança depende de liquidez. Benefício de ordem, solidariedade, outorga conjugal quando exigível, exoneração, sub-rogação e extinção são pontos centrais. A obrigação do fiador não pode superar a dívida garantida.'},
    {id:'transacao-compromisso',title:'Transação e compromisso',basis:'CC, arts. 840 a 853',text:'Na transação, as partes previnem ou encerram litígio mediante concessões recíprocas; só direitos patrimoniais privados admitem transação e sua interpretação é restrita. Compromisso arbitral submete controvérsia à arbitragem, observada a Lei de Arbitragem. Não confunda compromisso com cláusula compromissória nem transação com simples renúncia ou reconhecimento.'}
  ],
  'civ-responsabilidade':[
    {id:'funcoes-principios',title:'Funções e princípios da responsabilidade civil',basis:'CC, arts. 927 e 944',text:'A responsabilidade civil busca principalmente reparar o dano patrimonial e compensar o dano extrapatrimonial, além de exercer efeitos preventivos. Predominam reparação integral e proibição de enriquecimento sem causa. O valor mede-se pela extensão do dano, com redução equitativa apenas na hipótese legal de desproporção excessiva entre culpa e dano.'},
    {id:'pressupostos',title:'Conduta, dano, nexo e imputação',basis:'CC, arts. 186 e 927',text:'A responsabilidade exige fato imputável, dano juridicamente relevante e nexo causal; na responsabilidade subjetiva soma-se culpa em sentido amplo. Ato ilícito pode decorrer de ação ou omissão. Sem dano não há indenização civil, embora possa existir tutela preventiva. O nexo delimita quais consequências podem ser atribuídas ao agente.'},
    {id:'culpa-abuso',title:'Culpa, dolo e abuso de direito',basis:'CC, arts. 186 e 187',text:'Dolo é vontade dirigida ao resultado ilícito; culpa envolve violação do dever de cuidado por negligência, imprudência ou imperícia. O abuso de direito é ilícito objetivo: configura-se quando o titular excede manifestamente os limites impostos pelo fim econômico ou social, pela boa-fé ou pelos bons costumes, independentemente de intenção específica de prejudicar.'},
    {id:'objetiva-risco',title:'Responsabilidade subjetiva, objetiva e teoria do risco',basis:'CC, art. 927, parágrafo único',text:'A culpa é a regra geral de imputação, mas a lei pode impor responsabilidade objetiva. O Código também a prevê quando a atividade normalmente desenvolvida cria, por sua natureza, risco especial aos direitos de terceiros. Responsabilidade objetiva dispensa prova da culpa, não do dano e do nexo; excludentes causais continuam relevantes.'},
    {id:'excludentes',title:'Excludentes de ilicitude e de causalidade',basis:'CC, arts. 188, 393, 929 e 930',text:'Legítima defesa, exercício regular de direito e remoção necessária de perigo podem afastar ilicitude nos limites legais. Caso fortuito, força maior, culpa exclusiva da vítima e fato exclusivo de terceiro podem romper o nexo conforme o regime aplicável. Mesmo ato lícito em estado de necessidade pode gerar indenização ao terceiro inocente, com direito de regresso.'},
    {id:'responsabilidade-terceiros',title:'Responsabilidade por fato de terceiros',basis:'CC, arts. 932 a 934',text:'Pais, tutores, curadores, empregadores, donos de hotéis e participantes gratuitos no produto do crime respondem nas hipóteses legais. O art. 933 afasta a necessidade de culpa própria desses responsáveis. É preciso verificar vínculo, situação de guarda ou exercício do trabalho e eventual direito de regresso contra o causador direto, ressalvadas limitações familiares.'},
    {id:'animais-coisas',title:'Responsabilidade por animais, edifícios e coisas lançadas',basis:'CC, arts. 936 a 938',text:'Dono ou detentor do animal responde pelo dano, salvo culpa da vítima ou força maior. Dono de edifício ou construção responde por ruína causada por falta manifesta de reparos. Quem habita prédio responde por coisas que dele caem ou são lançadas em lugar indevido; quando não se identifica a unidade, a solução depende da prova e da jurisprudência aplicável.'},
    {id:'danos',title:'Dano material, moral, estético e perda de uma chance',basis:'CC, arts. 402, 403 e 944',text:'Dano emergente é a perda efetiva; lucro cessante é o ganho razoavelmente frustrado. Dano moral protege interesse existencial, e dano estético pode ser autônomo quando possui fundamento próprio. Perda de uma chance exige oportunidade séria e real, não mera esperança, e indeniza a probabilidade perdida, não automaticamente o benefício final integral.'},
    {id:'indenizacao-quantificacao',title:'Extensão e quantificação da indenização',basis:'CC, arts. 944 a 954',text:'A indenização deve recompor consequências diretas e imediatas comprovadas. Culpa concorrente da vítima reduz o valor conforme a gravidade comparada das condutas. O Código prevê critérios para morte, lesão, incapacidade, ofensa à honra, usurpação e dano processual. Pensão, despesas, lucros cessantes, juros e correção devem ser separados por natureza e termo inicial.'},
    {id:'solidariedade-regresso',title:'Solidariedade, transmissão e direito de regresso',basis:'CC, arts. 928, 934, 942 e 943',text:'Coautores e pessoas legalmente responsáveis podem responder solidariamente perante a vítima. Quem paga integralmente pode buscar regresso nos limites legais. A obrigação de reparar e o direito de exigir reparação transmitem-se com a herança. O incapaz responde subsidiária e equitativamente quando responsáveis não têm obrigação ou meios suficientes, preservado o mínimo existencial.'}
  ],
  'civ-pessoa-juridica':[
    {
      id:'autonomia-patrimonial',
      title:'Conceito de pessoa jurídica e autonomia patrimonial',
      basis:'CC, arts. 45, 47, 49-A e 50',
      text:'Pessoa jurídica é uma organização de pessoas ou de bens à qual o ordenamento atribui personalidade própria para exercer direitos e assumir deveres. Com a personificação, ela passa a ter nome, domicílio, patrimônio e esfera jurídica distintos dos de seus integrantes. Essa separação não é uma fraude presumida: a autonomia patrimonial é um instrumento lícito de organização e de alocação de riscos, essencial para estimular empreendimentos, empregos, tributos, renda e inovação.',
      sections:[
        {title:'Personalidade própria',bullets:['A pessoa jurídica atua no mundo jurídico por meio de seus órgãos e representantes, mas os direitos e obrigações regularmente assumidos pertencem à própria entidade.','Sócios, associados, instituidores e administradores não são proprietários diretos dos bens que integram o patrimônio da pessoa jurídica.','A mudança dos integrantes não necessariamente extingue a entidade: a pessoa jurídica possui continuidade própria conforme a lei e seu ato constitutivo.']},
        {title:'Separação patrimonial',bullets:['A regra é a incomunicabilidade entre o patrimônio da entidade e o patrimônio de seus membros.','A mera existência de dívida não autoriza cobrança direta contra sócios ou administradores; é necessário examinar o tipo jurídico, a lei e eventual garantia ou abuso.','A autonomia não é absoluta: pode ser afastada pontualmente por responsabilidade legal, garantia pessoal ou desconsideração, sem eliminar a pessoa jurídica.']}
      ],
      table:{headers:['Plano','Titular','Consequência'],rows:[['Pessoa jurídica','A própria entidade','Adquire direitos, contrata e responde com seu patrimônio'],['Integrantes','Sócios, associados ou instituidores','Não se confundem automaticamente com a entidade'],['Administrador','Órgão ou representante','Pratica atos imputados à entidade dentro de seus poderes']]},
      example:'Uma sociedade compra um imóvel com recursos próprios. O bem pertence à sociedade, e não aos sócios na proporção de suas quotas. Um credor pessoal de um sócio não pode simplesmente penhorar o imóvel social como se fosse patrimônio particular dele.',
      trap:'Autonomia patrimonial não significa irresponsabilidade nem blindagem ilícita. A regra é a separação; a responsabilização de integrante depende de fundamento jurídico específico. Também não confunda personalidade jurídica com limitação de responsabilidade: há pessoas jurídicas cujos membros podem responder em hipóteses previstas em lei.',
      memorize:['Pessoa jurídica: centro autônomo de direitos e deveres.','Patrimônio da entidade não se confunde com o de seus integrantes.','Autonomia patrimonial é regra lícita, expressamente valorizada pelo art. 49-A.','Afastamento da separação exige fundamento específico e não extingue automaticamente a entidade.']
    },
    {
      id:'classificacao-personificacao',
      title:'Classificação das pessoas jurídicas',
      basis:'CC, arts. 40 a 44 e 48-A',
      text:'O Código Civil classifica as pessoas jurídicas em direito público interno, direito público externo e direito privado. A classificação define o regime aplicável, a forma de criação, as prerrogativas e a responsabilidade. No campo privado, o art. 44 contém o rol das formas personificadas e deve ser lido em sua redação atual: a EIRELI foi retirada do sistema e o inciso VII passou a prever os empreendimentos de economia solidária.',
      sections:[
        {title:'Direito público',bullets:['São pessoas de direito público interno a União, os Estados, o Distrito Federal, os Territórios, os Municípios, as autarquias — inclusive associações públicas — e as demais entidades públicas criadas por lei.','Pessoas de direito público externo são os Estados estrangeiros e todas as pessoas regidas pelo direito internacional público.','A responsabilidade civil das pessoas de direito público interno pelos atos de seus agentes segue o regime constitucional e o art. 43 do Código Civil, assegurado o regresso quando houver culpa ou dolo.']},
        {title:'Direito privado',bullets:['O art. 44 contempla associações, sociedades, fundações, organizações religiosas, partidos políticos e empreendimentos de economia solidária.','O inciso VI, que tratava da EIRELI, está revogado. As EIRELIs existentes foram transformadas em sociedades limitadas unipessoais por determinação legal.','Organizações religiosas possuem liberdade de criação, organização, estruturação interna e funcionamento, sem prejuízo dos controles legais aplicáveis.','Partidos políticos organizam-se e funcionam conforme legislação específica. As deliberações das pessoas jurídicas privadas podem ocorrer por meios eletrônicos, nos termos do art. 48-A.']}
      ],
      table:{headers:['Categoria','Exemplos','Regime central'],rows:[['Público interno','União, Estados, DF, Municípios e autarquias','Direito público e leis de criação'],['Público externo','Estados estrangeiros e organismos internacionais','Direito internacional público'],['Privado','Associações, sociedades, fundações, organizações religiosas, partidos e economia solidária','Código Civil e legislação especial']]},
      example:'Uma autarquia municipal é pessoa jurídica de direito público interno. Já uma associação beneficente registrada é pessoa jurídica de direito privado, ainda que preste serviço de interesse público e receba recursos estatais.',
      trap:'EIRELI não integra mais o rol do art. 44. Outra armadilha é classificar como pública toda entidade que presta atividade de interesse coletivo: finalidade pública ou colaboração com o Estado não altera, por si só, a natureza privada da entidade.',
      memorize:['Três grupos: público interno, público externo e privado.','Art. 44 atual: inciso VI revogado; inciso VII = empreendimentos de economia solidária.','Autarquia é pública; empresa pública e sociedade de economia mista são privadas.','Assembleias e deliberações privadas podem ocorrer eletronicamente.']
    },
    {
      id:'pj-privadas-terceiro-setor',
      title:'Pessoas jurídicas privadas e Terceiro Setor',
      basis:'CC, art. 44; Leis 9.637/1998, 9.790/1999 e 13.019/2014',
      text:'As formas de pessoa jurídica de direito privado não se confundem com títulos, qualificações ou regimes de parceria. No chamado Terceiro Setor, entidades privadas sem finalidade lucrativa desenvolvem atividades de interesse social e podem receber enquadramentos específicos, desde que preencham os requisitos legais. Organização Social, OSCIP e Organização da Sociedade Civil não são novos tipos de pessoa jurídica: a entidade continua sendo, em geral, associação ou fundação.',
      sections:[
        {title:'Forma jurídica e finalidade',bullets:['Associação é formada pela união de pessoas para fins não econômicos.','Fundação resulta da afetação de patrimônio a finalidade legal.','Sociedade é organizada para o exercício de atividade econômica e partilha de resultados entre os sócios.','Ausência de finalidade lucrativa não significa proibição de receita, superávit, contratação de empregados ou atividade econômica instrumental; significa não distribuir resultados a integrantes.']},
        {title:'Qualificações e enquadramentos',bullets:['Organização Social — OS — é qualificação concedida pelo Poder Público conforme a Lei 9.637/1998, associada ao contrato de gestão.','OSCIP é qualificação disciplinada pela Lei 9.790/1999, com regime de termo de parceria.','Organização da Sociedade Civil — OSC — é conceito utilizado pela Lei 13.019/2014 para disciplinar parcerias com a Administração.','A obtenção ou perda de uma qualificação não cria nem extingue, sozinha, a personalidade civil da associação ou fundação.']}
      ],
      table:{headers:['Expressão','Natureza','Instrumento associado'],rows:[['Associação ou fundação','Forma de pessoa jurídica privada','Estatuto e registro'],['OS','Qualificação legal','Contrato de gestão'],['OSCIP','Qualificação legal','Termo de parceria'],['OSC','Enquadramento para o regime de parcerias','Termo de colaboração, fomento ou acordo de cooperação']]},
      example:'Uma associação cultural registrada pode preencher os requisitos e ser qualificada como OS. Ela não deixa de ser associação nem ganha uma segunda personalidade; apenas passa a se submeter também ao regime jurídico da qualificação e do contrato de gestão.',
      trap:'A banca pode afirmar que OS e OSCIP são espécies autônomas do art. 44. Está errado. Também é falso dizer que entidade sem fins lucrativos não pode cobrar por serviços ou obter superávit; o ponto decisivo é a destinação institucional e a vedação à distribuição privada dos resultados.',
      memorize:['Forma jurídica não se confunde com qualificação.','OS, OSCIP e OSC não são novas pessoas jurídicas.','Sem fins lucrativos ≠ sem receita ou sem superávit.','Resultados devem ser destinados às finalidades institucionais.']
    },
    {
      id:'personificacao-registro-entes',
      title:'Personificação, registro e entes despersonalizados',
      basis:'CC, arts. 45, 46 e 986; CPC, art. 75',
      text:'A existência legal das pessoas jurídicas de direito privado começa com a inscrição do ato constitutivo no registro competente, precedida de autorização ou aprovação estatal quando a lei exigir. O registro é constitutivo da personalidade civil; cadastros administrativos e fiscais cumprem outras funções. Antes da personificação, ou quando a lei não atribui personalidade, pode existir um ente com capacidade processual e disciplina patrimonial própria, sem se tornar pessoa jurídica.',
      sections:[
        {title:'Efeito do registro',bullets:['O ato constitutivo é levado ao Registro Civil de Pessoas Jurídicas ou à Junta Comercial, conforme a natureza da entidade.','Alterações relevantes do ato constitutivo também devem ser averbadas para produzir a publicidade jurídica adequada.','Decai em três anos o direito de anular a constituição da pessoa jurídica por defeito do ato, contados da publicação de sua inscrição no registro.','CNPJ é cadastro fiscal: sua existência, isoladamente, não prova que houve personificação no registro civil ou empresarial competente.']},
        {title:'Entes sem personalidade',bullets:['Sociedade em comum, massa falida, espólio, herança jacente ou vacante e condomínio podem atuar em juízo por representação prevista em lei, embora não sejam automaticamente pessoas jurídicas.','Capacidade de ser parte ou possuir CNPJ não equivale a personalidade jurídica.','Na sociedade em comum, enquanto não inscritos os atos constitutivos, as relações seguem o regime específico e os sócios podem responder solidária e ilimitadamente nos termos do Código.']}
      ],
      table:{headers:['Situação','Personalidade jurídica?','Observação'],rows:[['Ato constitutivo registrado','Sim, se presentes os requisitos legais','Registro tem efeito constitutivo'],['Apenas CNPJ','Não necessariamente','Cadastro fiscal não substitui registro'],['Sociedade em comum','Não','Possui regime próprio antes do registro'],['Espólio ou massa falida','Não','Têm capacidade processual por previsão legal']]},
      example:'Um grupo assina contrato social, inicia atividade e obtém inscrição fiscal, mas não arquiva o ato na Junta Comercial. O CNPJ não supre o registro constitutivo: perante o Direito Civil, a organização ainda não adquiriu personalidade societária regular.',
      trap:'Não confunda personalidade com capacidade processual. Um condomínio pode demandar e ser demandado, e um espólio pode ter CNPJ, sem que isso os transforme automaticamente em pessoas jurídicas do art. 44.',
      memorize:['Pessoa jurídica privada nasce com o registro competente.','Autorização estatal, quando exigida, não substitui o registro.','CNPJ não é prova suficiente de personalidade.','Ente despersonalizado pode ter representação e capacidade processual.']
    },
    {
      id:'ato-constitutivo-administracao',
      title:'Ato constitutivo, administração e representação',
      basis:'CC, arts. 46 a 49 e 48-A',
      text:'O ato constitutivo organiza a vida interna da pessoa jurídica e o registro dá publicidade aos elementos que interessam a terceiros. A entidade forma e manifesta sua vontade por órgãos previstos na lei e no estatuto ou contrato social. Os atos dos administradores obrigam a pessoa jurídica quando praticados dentro dos poderes definidos no ato constitutivo, sem prejuízo da proteção de terceiros e das regras especiais de cada tipo.',
      sections:[
        {title:'Conteúdo do registro',bullets:['Devem constar denominação, fins, sede, duração e fundo social, quando houver.','O registro identifica fundadores ou instituidores e diretores, além do modo de administração e representação ativa e passiva, judicial e extrajudicial.','Também deve informar se o ato constitutivo é reformável, como respondem os membros pelas obrigações sociais e quais são as condições de extinção e o destino do patrimônio.']},
        {title:'Deliberação e administração',bullets:['Se a administração for coletiva, as decisões são tomadas pela maioria dos presentes, salvo disposição diversa do ato constitutivo.','O direito de anular decisões administrativas que violem a lei ou o estatuto, ou sejam viciadas por erro, dolo, simulação ou fraude, decai em três anos.','Se faltar administração, o juiz, a requerimento de interessado, nomeará administrador provisório.','Respeitados direitos de participação e manifestação, deliberações privadas podem ocorrer eletronicamente conforme o art. 48-A.']}
      ],
      table:{headers:['Elemento','Função','Efeito prático'],rows:[['Ato constitutivo','Define estrutura, órgãos e poderes','Organiza a entidade internamente'],['Registro','Publiciza os elementos legais','Constitui a personalidade privada'],['Administrador','Executa a vontade orgânica','Obriga a entidade dentro de seus poderes'],['Administrador provisório','Supre ausência de gestão','É nomeado judicialmente']]},
      example:'O estatuto autoriza o diretor financeiro a celebrar contratos até determinado valor. Se ele atua dentro desse limite, o negócio é imputado à pessoa jurídica; eventual violação interna dos poderes exige análise própria quanto aos efeitos perante a entidade e terceiros.',
      trap:'A pessoa jurídica não age apenas por procuração: seus órgãos manifestam a vontade da própria entidade. Atenção também ao prazo: a anulação das decisões administrativas do art. 48 possui decadência de três anos.',
      memorize:['Art. 46: dados essenciais do registro.','Atos regulares dos administradores obrigam a pessoa jurídica.','Administração coletiva: maioria dos presentes, salvo regra diversa.','Sem administrador: nomeação judicial provisória.']
    },
    {
      id:'dissolucao-direitos-personalidade',
      title:'Dissolução, liquidação e direitos da personalidade',
      basis:'CC, arts. 51 e 52',
      text:'Dissolução, liquidação e extinção são momentos distintos. Dissolvida a pessoa jurídica ou cassada a autorização para funcionar, ela continua existindo para concluir a liquidação: arrecada bens, paga dívidas, recebe créditos e dá destino ao saldo. A extinção somente se completa com o encerramento da liquidação e o cancelamento da inscrição no registro. Além disso, a pessoa jurídica recebe, no que couber, a proteção dos direitos da personalidade.',
      sections:[
        {title:'Etapas do encerramento',bullets:['Dissolução inicia o processo de encerramento, por causa legal, estatutária, deliberativa ou judicial.','Durante a liquidação, a personalidade subsiste para os atos necessários à conclusão das relações pendentes.','O liquidante deve promover os atos próprios do encerramento e averbar a dissolução no registro.','Depois de encerrada a liquidação, cancela-se a inscrição e ocorre a extinção da pessoa jurídica.']},
        {title:'Proteção da personalidade',bullets:['Nome, honra objetiva, imagem e reputação comercial podem ser protegidos quando compatíveis com a natureza da pessoa jurídica.','A entidade pode sofrer dano moral quando atingida sua honra objetiva, isto é, a consideração de que desfruta perante terceiros.','Direitos estritamente ligados à existência biológica ou à personalidade humana não se transferem mecanicamente à pessoa jurídica; aplica-se a cláusula “no que couber”.']}
      ],
      table:{headers:['Momento','Situação da personalidade','Finalidade'],rows:[['Dissolução','Ainda subsiste','Inicia o encerramento'],['Liquidação','Subsiste de modo funcional','Resolver ativos, passivos e relações pendentes'],['Cancelamento do registro','Personalidade extinta','Concluir a existência jurídica']]},
      example:'Uma associação delibera sua dissolução, mas ainda possui contratos, créditos e dívidas. Ela não desaparece no dia da assembleia: continua personificada durante a liquidação e só se extingue com o cancelamento registral após o encerramento.',
      trap:'Dissolução não é sinônimo de extinção imediata. Outra armadilha é negar genericamente dano moral à pessoa jurídica: ela pode ser indenizada quando houver lesão à honra objetiva, embora não possua sofrimento psíquico humano.',
      memorize:['Dissolução abre o encerramento; liquidação resolve pendências.','A personalidade subsiste durante a liquidação.','Extinção: após encerramento e cancelamento no registro.','Direitos da personalidade aplicam-se à pessoa jurídica no que couber.']
    },
    {
      id:'desconsideracao',
      title:'Desconsideração: teoria maior e teoria menor',
      basis:'CC, art. 50; CDC, art. 28, § 5º',
      text:'A desconsideração afasta episodicamente a separação patrimonial para que determinados efeitos de uma obrigação alcancem bens de sócios ou administradores. Ela não anula o ato constitutivo, não dissolve a entidade e não cria responsabilidade universal. No Código Civil vigora a teoria maior, que exige abuso da personalidade. Em relações de consumo, o art. 28, § 5º, adota fórmula mais ampla, conhecida como teoria menor.',
      sections:[
        {title:'Teoria maior do Código Civil',bullets:['Exige abuso da personalidade jurídica caracterizado por desvio de finalidade ou confusão patrimonial; os requisitos são alternativos.','Desvio de finalidade é definido legalmente como uso da pessoa jurídica com propósito de lesar credores e para a prática de atos ilícitos de qualquer natureza.','Confusão patrimonial é a ausência de separação de fato, evidenciada, entre outras hipóteses, por pagamentos repetitivos de obrigações alheias, transferências sem contraprestação efetiva ou outros atos de descumprimento da autonomia.','A extensão alcança bens particulares de administradores ou sócios beneficiados direta ou indiretamente pelo abuso.']},
        {title:'O que não basta e teoria menor',bullets:['A mera existência de grupo econômico não autoriza a desconsideração civil sem os requisitos do art. 50.','A mera expansão ou alteração da finalidade original da atividade econômica específica não configura desvio de finalidade.','Insolvência, falta de bens ou encerramento irregular, isoladamente, não substituem a prova do abuso na teoria maior.','No CDC, a personalidade pode ser afastada quando for obstáculo ao ressarcimento de prejuízos causados ao consumidor, sem a mesma exigência cumulativa de demonstração do abuso civil.']}
      ],
      table:{headers:['Regime','Pressuposto central','Alcance'],rows:[['Teoria maior — CC','Abuso por desvio de finalidade ou confusão patrimonial','Sócios ou administradores beneficiados pelo abuso'],['Teoria menor — CDC','Personalidade como obstáculo ao ressarcimento do consumidor','Aplicação excepcional no campo de consumo']]},
      example:'Uma sociedade paga reiteradamente despesas pessoais do sócio e transfere ativos a ele sem contraprestação, ficando sem recursos para cumprir obrigações. Esses fatos podem demonstrar confusão patrimonial; a dívida isolada ou a simples falta de dinheiro, por si sós, não bastariam no regime do Código Civil.',
      trap:'A FCC pode somar indevidamente os requisitos: no art. 50, desvio de finalidade ou confusão patrimonial bastam alternativamente, desde que provados. Também é errado tratar a desconsideração como extinção da pessoa jurídica ou fazê-la alcançar automaticamente todos os sócios.',
      memorize:['CC = teoria maior: abuso comprovado.','Abuso: desvio de finalidade OU confusão patrimonial.','Grupo, insolvência e encerramento irregular isolados não bastam no CC.','CDC § 5º = personalidade como obstáculo ao ressarcimento.']
    },
    {
      id:'desconsideracao-inversa-incidente',
      title:'Desconsideração inversa e procedimento judicial',
      basis:'CC, art. 50, § 3º; CPC, arts. 133 a 137',
      text:'Na desconsideração direta, efeitos da dívida da pessoa jurídica alcançam patrimônio de sócio ou administrador. Na modalidade inversa, expressamente admitida, efeitos de obrigação pessoal do sócio alcançam bens da pessoa jurídica utilizados abusivamente para ocultar ou desviar patrimônio. Em ambos os sentidos, a medida deve respeitar contraditório, requerimento e os pressupostos do direito material aplicável.',
      sections:[
        {title:'Incidente de desconsideração',bullets:['É instaurado a pedido da parte ou do Ministério Público, quando lhe couber intervir; o juiz não o abre de ofício como regra do CPC.','Cabe em todas as fases do processo de conhecimento, no cumprimento de sentença e na execução fundada em título extrajudicial.','Se a desconsideração já for requerida na petição inicial, dispensa-se o incidente autônomo e o sócio ou a pessoa jurídica será citado.','Instaurado o incidente, o processo é suspenso, salvo a hipótese de pedido formulado na inicial. O requerido tem quinze dias para manifestar-se e requerer provas.']},
        {title:'Decisão e efeitos',bullets:['Concluída a instrução, o incidente é resolvido por decisão interlocutória; se decidido pelo relator, cabe agravo interno.','Acolhido o pedido, alienação ou oneração de bens ocorrida em fraude de execução é ineficaz em relação ao requerente.','O incidente não dispensa a prova dos requisitos do art. 50 do Código Civil, do CDC ou de outra norma material aplicável.','Na modalidade inversa, a entidade deve participar do contraditório porque seu patrimônio poderá ser atingido.']}
      ],
      table:{headers:['Modalidade','Dívida originária','Patrimônio excepcionalmente alcançado'],rows:[['Direta','Da pessoa jurídica','Do sócio ou administrador beneficiado'],['Inversa','Do sócio ou administrador','Da pessoa jurídica usada abusivamente']]},
      example:'Um devedor transfere patrimônio pessoal para uma sociedade que controla e passa a usar os bens sociais como se fossem seus para frustrar credores. Demonstrado o abuso, o credor pode pedir a desconsideração inversa, com citação da sociedade e respeito ao procedimento dos arts. 133 a 137 do CPC.',
      trap:'Desconsideração inversa não serve para cobrar toda dívida pessoal do sócio contra qualquer sociedade da qual participe. É indispensável provar o pressuposto material e assegurar contraditório. No CPC, a instauração é provocada pela parte ou pelo MP, não decretada espontaneamente pelo juiz.',
      memorize:['Direta: dívida da PJ → patrimônio do integrante.','Inversa: dívida do integrante → patrimônio da PJ.','IDPJ cabe em todas as fases e exige contraditório.','Pedido na inicial dispensa incidente separado; requerido é citado.']
    },
    {
      id:'associacoes',
      title:'Associações',
      basis:'CC, arts. 53 a 61',
      text:'Associação é a união organizada de pessoas para fins não econômicos. O núcleo da definição é a inexistência de finalidade de distribuir resultados entre os associados: a entidade pode arrecadar receitas, cobrar por atividades, ter patrimônio e até desenvolver atividade econômica instrumental, desde que os recursos sejam aplicados em seus objetivos institucionais. Entre associados não há direitos e obrigações recíprocos como decorrência automática da condição associativa.',
      sections:[
        {title:'Estatuto, associados e exclusão',bullets:['O estatuto deve indicar denominação, fins, sede, requisitos de admissão, demissão e exclusão, direitos e deveres, fontes de recursos, órgãos deliberativos, condições de alteração e dissolução e forma de gestão e aprovação de contas.','Os associados têm direitos iguais, mas o estatuto pode instituir categorias com vantagens especiais.','A qualidade de associado é, em regra, intransmissível, salvo disposição estatutária; transferir quota ou fração patrimonial não torna o adquirente associado automaticamente.','A exclusão somente é admissível por justa causa, em procedimento que assegure defesa e recurso conforme o estatuto.']},
        {title:'Assembleia e dissolução',bullets:['Compete privativamente à assembleia geral destituir administradores e alterar o estatuto, observados convocação e quórum estatutários.','A convocação dos órgãos deliberativos segue o estatuto, mas um quinto dos associados possui o direito de promovê-la.','Na dissolução, o patrimônio líquido remanescente será destinado à entidade de fins não econômicos designada no estatuto; se este for omisso, a instituição pública de fins idênticos ou semelhantes, conforme deliberação.','O estatuto ou a deliberação pode permitir restituição atualizada de contribuições feitas pelos associados ao patrimônio, antes da destinação do remanescente, nos limites legais.']}
      ],
      table:{headers:['Ponto','Regra'],rows:[['Finalidade','Não econômica, sem distribuição de resultados'],['Direitos','Iguais, admitidas categorias com vantagens especiais'],['Exclusão','Justa causa + defesa + recurso'],['Competência privativa da assembleia','Destituir administradores e alterar estatuto'],['Convocação por associados','Garantida a um quinto']]},
      example:'Uma associação educacional cobra mensalidades e termina o ano com superávit. Isso não a transforma automaticamente em sociedade se todo o resultado for aplicado na finalidade institucional e não houver distribuição aos associados.',
      trap:'“Fins não econômicos” não significa atividade gratuita ou ausência de receita. Atenção também à exclusão: não basta previsão genérica do estatuto; exige-se justa causa e procedimento com direito de defesa e recurso.',
      memorize:['Associação = união de pessoas.','Fim não econômico = sem distribuição aos associados.','Exclusão: justa causa, defesa e recurso.','Um quinto dos associados pode convocar órgão deliberativo.']
    },
    {
      id:'fundacoes',
      title:'Fundações',
      basis:'CC, arts. 62 a 69',
      text:'Fundação privada é uma pessoa jurídica formada pela afetação de bens livres a uma finalidade duradoura prevista em lei. Diferentemente da associação, seu centro não é um quadro de membros, mas o patrimônio destinado pelo instituidor. A instituição ocorre por escritura pública ou testamento, com dotação especial de bens e especificação do fim, podendo o instituidor também indicar a forma de administração.',
      sections:[
        {title:'Constituição e estatuto',bullets:['As finalidades fundacionais estão legalmente delimitadas e abrangem, entre outras, assistência social, cultura e patrimônio histórico, educação, saúde, segurança alimentar, meio ambiente e desenvolvimento sustentável, pesquisa, cidadania, direitos humanos, democracia e atividades religiosas.','Se os bens forem insuficientes e o instituidor não dispuser de outro modo, serão incorporados a outra fundação de finalidade igual ou semelhante.','Na instituição por ato entre vivos, o instituidor é obrigado a transferir os bens; se não o fizer, o registro poderá ocorrer por mandado judicial.','A pessoa encarregada formulará o estatuto no prazo fixado; se não houver prazo, em 180 dias. Vencido o prazo, cabe ao Ministério Público elaborá-lo.']},
        {title:'Fiscalização, alteração e extinção',bullets:['O Ministério Público do Estado onde situada a fundação vela por ela; no Distrito Federal e Territórios, a atribuição pertence ao respectivo Ministério Público. Se atuar em mais de um Estado, cada órgão estadual fiscaliza a atividade local.','A alteração estatutária exige deliberação de dois terços dos competentes, respeito à finalidade e aprovação do Ministério Público; sem decisão em 45 dias, ou diante de negativa, pode haver suprimento judicial.','Se a alteração não for unânime, a minoria vencida deve ser cientificada para impugnar em dez dias.','Tornando-se ilícita, impossível ou inútil a finalidade, ou vencido o prazo de existência, promove-se a extinção e o patrimônio recebe a destinação legal, em regra para fundação de fim igual ou semelhante.']}
      ],
      table:{headers:['Aspecto','Fundação','Associação'],rows:[['Elemento central','Patrimônio afetado','União de pessoas'],['Instrumento inicial','Escritura pública ou testamento','Estatuto aprovado pelos associados'],['Finalidade','Deve estar entre as admitidas em lei','Fim não econômico lícito'],['Fiscalização estrutural','Ministério Público','Sem curadoria geral equivalente']]},
      example:'Uma pessoa destina por testamento um conjunto de imóveis à criação de fundação de pesquisa científica. Se o patrimônio for insuficiente e o testador nada tiver previsto, os bens serão incorporados a outra fundação de finalidade igual ou semelhante.',
      trap:'Fundação não tem sócios nem associados. A banca também troca os quóruns e prazos: alteração estatutária exige dois terços; o MP dispõe de 45 dias; a minoria vencida tem dez dias para impugnar.',
      memorize:['Fundação = patrimônio afetado a finalidade legal.','Instituição: escritura pública ou testamento.','Estatuto não elaborado: prazo legal supletivo de 180 dias e atuação do MP.','Alteração: 2/3 + preservação da finalidade + aprovação do MP.']
    },
    {
      id:'domicilio',
      title:'Domicílio da pessoa natural',
      basis:'CC, arts. 70 a 74 e 76 a 78',
      text:'Domicílio civil da pessoa natural é, em regra, o lugar onde ela estabelece residência com ânimo definitivo. Residência é o elemento objetivo, enquanto o propósito de permanência fornece o elemento subjetivo. O Código admite pluralidade, domicílio profissional, domicílio aparente e domicílio necessário, além da eleição contratual por escrito para o exercício de direitos e o cumprimento de obrigações.',
      sections:[
        {title:'Domicílio voluntário e plural',bullets:['Se a pessoa possui diversas residências onde viva alternadamente, qualquer delas pode ser considerada domicílio.','Quanto às relações concernentes à profissão, também é domicílio o lugar onde ela é exercida. Se a profissão for exercida em lugares diversos, cada um será domicílio para a relação correspondente.','Quem não tem residência habitual considera-se domiciliado onde for encontrado.','A mudança de domicílio ocorre com transferência da residência acompanhada da intenção manifesta pelas circunstâncias ou pelas declarações feitas às autoridades dos lugares de saída e chegada.']},
        {title:'Domicílio necessário',bullets:['Possuem domicílio necessário o incapaz, o servidor público, o militar, o marítimo e o preso.','O incapaz domicilia-se com seu representante ou assistente; o servidor, onde exerce permanentemente suas funções; o militar, onde serve, com regras próprias para Marinha e Aeronáutica.','O marítimo domicilia-se onde o navio está matriculado; o preso, no lugar em que cumpre a sentença.','O agente diplomático brasileiro citado no exterior que alegar extraterritorialidade sem indicar domicílio no país pode ser demandado no Distrito Federal ou no último ponto do território brasileiro onde o teve.']}
      ],
      table:{headers:['Espécie','Critério','Exemplo'],rows:[['Voluntário geral','Residência + ânimo definitivo','Lugar escolhido para viver de modo estável'],['Profissional','Lugar de exercício da profissão','Escritório para obrigações profissionais'],['Aparente','Lugar onde a pessoa é encontrada','Pessoa sem residência habitual'],['Necessário','Fixado diretamente pela lei','Incapaz, servidor, militar, marítimo e preso'],['Contratual','Eleição escrita pelas partes','Local de exercício do direito contratual']]},
      example:'Uma médica mora alternadamente em duas cidades e mantém consultório em uma terceira. As duas residências podem ser domicílios gerais, e o consultório será domicílio quanto às relações ligadas à profissão.',
      trap:'Residência e domicílio não são sinônimos absolutos. A pessoa pode ter várias residências e vários domicílios. Atenção ao preso: o texto legal considera o lugar em que cumpre a sentença, e não qualquer local de prisão provisória.',
      memorize:['Regra: residência com ânimo definitivo.','Várias residências alternadas = qualquer delas pode ser domicílio.','Profissão em vários lugares = cada um para a relação correspondente.','Necessário: incapaz, servidor, militar, marítimo e preso.']
    },
    {
      id:'domicilio-pessoa-juridica',
      title:'Domicílio da pessoa jurídica e eleição contratual',
      basis:'CC, arts. 75 e 78',
      text:'O domicílio da pessoa jurídica varia conforme sua natureza. Para os entes políticos, a lei indica o centro administrativo. Nas demais pessoas jurídicas, vale o lugar onde funcionam diretoria e administração ou o domicílio especial eleito no estatuto ou ato constitutivo. A multiplicidade de estabelecimentos produz domicílios especiais para os atos praticados em cada um, solução relevante para obrigações e competência territorial.',
      sections:[
        {title:'Critérios legais',bullets:['O domicílio da União é o Distrito Federal; o dos Estados e Territórios, as respectivas capitais; o do Município, o lugar onde funciona a administração municipal.','Para as demais pessoas jurídicas, é o lugar de funcionamento das diretorias e administrações, ou o local especial indicado no estatuto ou ato constitutivo.','Se houver estabelecimentos em lugares diferentes, cada um será considerado domicílio para os atos nele praticados.','Se a administração ou diretoria tiver sede no exterior, considera-se domicílio, quanto às obrigações contraídas por cada agência, o lugar do estabelecimento brasileiro correspondente.']},
        {title:'Domicílio de eleição',bullets:['Nos contratos escritos, as partes podem especificar domicílio onde se exercitem e cumpram os direitos e obrigações resultantes do negócio.','A eleição contratual não transforma o local em domicílio geral da pessoa; seus efeitos se vinculam ao contrato.','A cláusula deve ser interpretada em conjunto com regras processuais de competência, proteção do consumidor e controle de abusividade.','Domicílio especial previsto no ato constitutivo da pessoa jurídica e domicílio de eleição em contrato são figuras próximas, mas possuem fontes e alcances diferentes.']}
      ],
      table:{headers:['Pessoa ou situação','Domicílio'],rows:[['União','Distrito Federal'],['Estado ou Território','Respectiva capital'],['Município','Onde funciona a administração municipal'],['Demais pessoas jurídicas','Diretoria/administração ou local especial constitutivo'],['Vários estabelecimentos','Cada local, para os atos ali praticados'],['Direção no exterior','Agência brasileira, para a obrigação correspondente']]},
      example:'Uma empresa tem sede administrativa em Recife e filial em Salvador. Para contrato celebrado e executado pela filial, Salvador é considerado domicílio quanto àquele ato, ainda que a sede geral permaneça em Recife.',
      trap:'A existência de várias filiais não cria várias personalidades jurídicas, mas pode criar vários domicílios especiais. E a cláusula de eleição não afasta automaticamente normas imperativas de competência ou a proteção contra cláusula abusiva.',
      memorize:['União: DF; Estados: capitais; Município: sede administrativa.','PJ privada: diretoria/administração ou domicílio constitutivo especial.','Cada estabelecimento é domicílio para os atos nele praticados.','Eleição contratual deve ser escrita e vale para o negócio correspondente.']
    }
  ],
  'civ-bens':[
    {
      id:'bem-coisa-patrimonio-circulacao',
      title:'Bem, coisa, patrimônio e circulação jurídica',
      basis:'CC, arts. 91, 1.233 a 1.237, 1.263 e 1.911',
      text:'Bem é tudo aquilo que pode satisfazer interesse juridicamente relevante e integrar uma relação de direito. A doutrina diverge sobre a relação entre bem e coisa: para uma corrente, bem é gênero e coisa é o bem material; para outra, coisa é gênero e bem é a parcela útil e apropriável. O Código Civil não adota essa distinção com uniformidade, por isso a prova costuma cobrar menos a terminologia abstrata e mais a possibilidade de apropriação, circulação e avaliação econômica.',
      sections:[
        {title:'Patrimônio e circulação',bullets:['Patrimônio é uma universalidade de direito formada pelo complexo de relações jurídicas economicamente apreciáveis de uma pessoa, abrangendo posições ativas e passivas.','A regra é que os bens apropriáveis circulem; a inapropriabilidade e a inalienabilidade são excepcionais e dependem da natureza do objeto ou de fundamento jurídico.','Bens naturalmente insuscetíveis de apropriação, como a luz solar em estado comum, não entram livremente no comércio. Outros são retirados da circulação por lei ou por cláusula válida.','A cláusula de inalienabilidade imposta por liberalidade implica impenhorabilidade e incomunicabilidade, mas a previsão isolada destas últimas não cria automaticamente inalienabilidade.']},
        {title:'Coisa sem dono, abandonada e perdida',bullets:['Res nullius, em sentido estrito, é a coisa que nunca teve dono e pode ser adquirida por ocupação, respeitadas as limitações legais.','Res derelicta é a coisa voluntariamente abandonada: existiu dono, mas houve intenção inequívoca de renunciar à propriedade.','Coisa perdida continua pertencendo ao dono. Quem a encontra deve restituí-la ou entregá-la à autoridade e possui apenas os direitos assegurados ao descobridor.','A distinção depende da intenção exteriorizada pelo antigo titular; a simples ausência do proprietário não transforma coisa perdida em abandonada.']}
      ],
      table:{headers:['Categoria','Situação jurídica','Exemplo'],rows:[['Res nullius','Nunca teve dono e admite apropriação nas condições legais','Coisa originariamente sem proprietário'],['Res derelicta','Foi abandonada com intenção de renúncia','Móvel deixado para descarte'],['Coisa perdida','Ainda possui proprietário','Celular esquecido em restaurante'],['Bem fora do comércio','Não admite livre apropriação ou alienação','Bem público afetado']]},
      example:'Uma bicicleta deixada ao lado do lixo com aviso de descarte pode revelar abandono. Já a bicicleta esquecida diante de uma loja continua sendo coisa perdida, mesmo que o proprietário demore a retornar.',
      trap:'A FCC pode tratar toda coisa aparentemente sem dono como res nullius. Está errado: coisa perdida possui dono e não pode ser apropriada pelo descobridor. Também não inverta a regra do art. 1.911: inalienabilidade implica impenhorabilidade e incomunicabilidade, mas o inverso não é automático.',
      memorize:['Bem e coisa não possuem distinção doutrinária pacífica.','Patrimônio reúne relações jurídicas de valor econômico.','Abandono exige intenção de renunciar; perda não.','Coisa perdida deve ser restituída ou entregue à autoridade.']
    },
    {
      id:'moveis-imoveis',
      title:'Bens imóveis',
      basis:'CC, arts. 79 a 81',
      text:'Bens imóveis são o solo e tudo quanto se incorpora a ele natural ou artificialmente. A imobilidade pode decorrer da própria natureza, da incorporação física realizada pelo ser humano ou de determinação expressa da lei. A classificação importa porque aquisição, transferência, garantias, competência e forma dos negócios podem variar conforme a natureza imobiliária do objeto.',
      sections:[
        {title:'Imóveis por natureza e incorporação',bullets:['O solo é o imóvel por natureza, compreendendo suas incorporações naturais enquanto ligadas a ele.','Construções, plantações e outras incorporações permanentes realizadas pelo ser humano são imóveis por acessão física ou artificial.','A antiga categoria de imóvel por acessão intelectual não foi repetida pelo Código de 2002; os bens destinados ao uso, serviço ou aformoseamento sem incorporação são estudados como pertenças.']},
        {title:'Imóveis por determinação legal',bullets:['São imóveis os direitos reais sobre imóveis e as ações que os asseguram.','O direito à sucessão aberta é imóvel para os efeitos legais, ainda que a herança seja composta exclusivamente por dinheiro, veículos ou outros móveis.','Edificação separada do solo que conserve sua unidade ao ser removida para outro local não perde a natureza imobiliária.','Materiais provisoriamente separados de um prédio para nele serem reempregados continuam imóveis.']}
      ],
      table:{headers:['Espécie','Critério','Exemplo'],rows:[['Por natureza','Solo e incorporações naturais','Terreno e árvores enraizadas'],['Por acessão física','Incorporação humana permanente','Edificação'],['Por determinação legal','A lei atribui natureza imobiliária','Sucessão aberta; direito real sobre imóvel'],['Imóvel que conserva a natureza','Separação temporária nas hipóteses do art. 81','Material retirado para reemprego no prédio']]},
      example:'Uma herança contém apenas saldo bancário e dois automóveis. Mesmo sem imóvel físico no acervo, o direito à sucessão aberta é classificado legalmente como bem imóvel.',
      trap:'Não confunda o acervo concreto com o direito sucessório: a sucessão aberta é imóvel por determinação legal. Outra inversão comum é afirmar que toda edificação removida vira móvel; ela continua imóvel se for retirada conservando sua unidade para outro local.',
      memorize:['Art. 79: solo + incorporações naturais ou artificiais.','Direitos reais sobre imóveis e ações correspondentes são imóveis.','Direito à sucessão aberta é imóvel.','Reemprego no mesmo prédio mantém a natureza imobiliária do material separado.']
    },
    {
      id:'bens-moveis',
      title:'Bens móveis e bens móveis por antecipação',
      basis:'CC, arts. 82 a 84',
      text:'São móveis os bens suscetíveis de movimento próprio ou de remoção por força alheia sem alteração de sua substância ou destinação econômico-social. A categoria abrange móveis por natureza, semoventes, bens mobilizados por antecipação e bens que a lei expressamente equipara a móveis. A possibilidade de registro ou até de hipoteca em situações especiais não altera automaticamente essa classificação.',
      sections:[
        {title:'Móveis por natureza e antecipação',bullets:['Móveis propriamente ditos são removidos por força externa; semoventes possuem movimento próprio, como os animais.','Móvel por antecipação é o bem atualmente incorporado ao solo, mas considerado móvel porque será separado em razão da finalidade do negócio, como árvores vendidas para corte ou uma safra negociada antes da colheita.','A mobilização por antecipação decorre da destinação econômica e da separação futura, não da simples vontade abstrata de chamar o bem de móvel.']},
        {title:'Móveis por determinação legal',bullets:['Energias que tenham valor econômico são bens móveis.','Direitos reais sobre objetos móveis e as ações correspondentes possuem natureza mobiliária.','Direitos pessoais de caráter patrimonial e suas ações também são móveis para os efeitos legais.','Materiais destinados à construção permanecem móveis enquanto não empregados; materiais provenientes de demolição readquirem a qualidade de móveis.']}
      ],
      table:{headers:['Situação','Classificação','Razão'],rows:[['Animal','Móvel semovente','Movimento próprio'],['Energia com valor econômico','Móvel por lei','Art. 83, I'],['Árvore vendida para corte','Móvel por antecipação','Separação futura já considerada no negócio'],['Tijolo ainda não empregado','Móvel','Art. 84'],['Material retirado para reemprego no mesmo prédio','Imóvel','Exceção do art. 81, II']]},
      example:'Uma construtora compra tijolos para uma obra: enquanto armazenados, são móveis. Depois de incorporados à parede, tornam-se imóveis. Se forem retirados em uma demolição definitiva, readquirem natureza mobiliária.',
      trap:'Material separado de um prédio para ser reutilizado nele continua imóvel; material proveniente de demolição definitiva é móvel. Navio e aeronave não se tornam imóveis apenas porque possuem registro especial ou podem ser objeto de hipoteca.',
      memorize:['Movimento sem alterar substância ou destinação econômico-social.','Semovente é espécie de móvel.','Energia com valor econômico é móvel.','Antes do emprego e após demolição: material móvel; separação temporária para reemprego: imóvel.']
    },
    {
      id:'fungiveis',
      title:'Bens fungíveis e infungíveis',
      basis:'CC, art. 85',
      text:'Fungibilidade é a possibilidade de substituir um bem móvel por outro da mesma espécie, qualidade e quantidade. O bem infungível possui individualidade relevante que impede restituição por simples equivalente. A literalidade do art. 85 restringe a classificação aos móveis, embora a individualização possa decorrer da natureza do objeto ou da finalidade atribuída pelas partes.',
      sections:[
        {title:'Critério de substituição',bullets:['Dinheiro e mercadorias padronizadas são exemplos típicos de bens fungíveis.','Obra de arte original, joia de família ou exemplar autografado podem ser infungíveis por características próprias ou valor afetivo juridicamente considerado.','Um objeto normalmente fungível pode ser individualizado pelas partes e tratado como infungível, como uma cédula específica entregue para exposição.','A fungibilidade é analisada na relação concreta: não basta pertencer ao mesmo gênero se qualidade ou quantidade relevantes forem diferentes.']},
        {title:'Efeitos nos contratos',bullets:['No mútuo, transferem-se bens fungíveis e o mutuário restitui outros da mesma espécie, qualidade e quantidade.','No comodato, a coisa emprestada é infungível e deve ser devolvida em sua individualidade.','A perda de coisa infungível não se resolve automaticamente pela entrega de outra aparentemente semelhante.']}
      ],
      table:{headers:['Categoria','Substituição','Exemplo'],rows:[['Fungível','Por outro da mesma espécie, qualidade e quantidade','Dinheiro; saco padronizado de arroz'],['Infungível por natureza','Possui características únicas','Quadro original'],['Infungível por individualização','As partes valorizam aquele exemplar específico','Cédula histórica identificada pelo número']]},
      example:'Carlos entrega a uma exposição uma moeda comum, mas identificada e escolhida por ter pertencido ao avô. Apesar de moedas serem normalmente fungíveis, aquela foi individualizada e deverá ser restituída como o mesmo objeto.',
      trap:'O art. 85 fala em bens móveis. A banca também pode omitir um dos três critérios: a substituição exige mesma espécie, qualidade e quantidade, e não apenas outro objeto parecido.',
      memorize:['Fungibilidade: substituição por equivalente completo.','Espécie + qualidade + quantidade.','A classificação legal recai sobre móveis.','A vontade pode individualizar bem normalmente fungível.']
    },
    {
      id:'consumiveis',
      title:'Bens consumíveis e inconsumíveis',
      basis:'CC, art. 86',
      text:'Consumível é o bem móvel cujo uso importa destruição imediata da própria substância. O Código também considera consumível o móvel destinado à alienação, introduzindo a consuntibilidade jurídica. O critério não é a mera possibilidade abstrata de vender: é preciso que a destinação econômico-jurídica concreta do bem seja sua alienação, como ocorre com mercadorias em estoque.',
      sections:[
        {title:'Consumo físico e jurídico',bullets:['Consumível de fato desaparece ou perde imediatamente sua substância com o uso normal, como alimento, combustível ou medicamento.','Consumível de direito é o bem móvel destinado à alienação, como o livro colocado no estoque de uma livraria.','O mesmo objeto pode receber classificação diferente conforme a destinação: um automóvel de uso familiar é fisicamente inconsumível; um automóvel no estoque de uma concessionária é juridicamente consumível.','Para a literalidade do art. 86, não se deve afirmar genericamente que todo bem alienável é consumível.']},
        {title:'Bens inconsumíveis',bullets:['São fisicamente inconsumíveis os que permitem uso reiterado sem destruição imediata da substância.','A deterioração gradual pelo tempo não transforma automaticamente o bem durável em consumível.','Um objeto fisicamente consumível pode estar juridicamente impedido de circular, e os dois eixos devem ser analisados separadamente.']}
      ],
      table:{headers:['Critério','Consumível','Inconsumível'],rows:[['Físico','Uso destrói imediatamente a substância','Uso permite repetição'],['Jurídico','Móvel concretamente destinado à alienação','Não destinado à alienação no contexto'],['Exemplo','Alimento; mercadoria em estoque','Livro de biblioteca; veículo de uso pessoal']]},
      example:'Dois computadores idênticos podem ter classificação jurídica diferente: o exposto para venda numa loja é consumível por destinação; o utilizado diariamente pelo escritório é inconsumível, embora ambos possam ser fisicamente alienados.',
      trap:'“Pode ser vendido” não significa, sozinho, “destinado à alienação”. A FCC pode transformar qualquer bem alienável em consumível, ampliando indevidamente o art. 86.',
      memorize:['Consumo físico: destruição imediata pelo uso.','Consumo jurídico: móvel destinado à alienação.','Deterioração lenta não é consumo imediato.','A finalidade concreta pode alterar a classificação do mesmo objeto.']
    },
    {
      id:'divisiveis',
      title:'Bens divisíveis e indivisíveis',
      basis:'CC, arts. 87 e 88',
      text:'Bem divisível pode ser fracionado sem alteração de sua substância, diminuição considerável de valor ou prejuízo do uso a que se destina. Os três critérios são alternativos para impedir a divisão: mesmo que o fracionamento seja materialmente possível, o bem será juridicamente indivisível se perder identidade, valor relevante ou utilidade. A indivisibilidade pode ser natural, legal ou convencional.',
      sections:[
        {title:'Modalidades',bullets:['Indivisibilidade natural decorre das características e da finalidade concreta do bem, como uma escultura ou um animal vivo destinado à montaria.','Indivisibilidade legal resulta de norma que impede o fracionamento, como ocorre em situações envolvendo herança antes da partilha e determinadas relações reais.','Indivisibilidade convencional decorre da vontade das partes nos limites admitidos pelo ordenamento.','Bens móveis e imóveis podem ser divisíveis ou indivisíveis; a classificação não se limita à possibilidade física de corte.']},
        {title:'Divisão econômica',bullets:['Bem indivisível pode ser alienado e ter o preço repartido entre os interessados.','A impossibilidade de fracionar a coisa não significa impossibilidade de dividir seu valor econômico.','A finalidade pode mudar a conclusão: um cavalo vivo destinado ao esporte é indivisível; após abate regular para comercialização da carne, o produto admite fracionamento.']}
      ],
      table:{headers:['Indivisibilidade','Origem','Exemplo'],rows:[['Natural','Natureza ou função concreta','Escultura'],['Legal','Determinação do ordenamento','Herança antes da partilha'],['Convencional','Vontade das partes','Carga contratada para entrega unitária']]},
      example:'Um imóvel pequeno pode ser fisicamente dividido por uma parede, mas, se o fracionamento inviabilizar seu uso e reduzir consideravelmente o valor, será indivisível para os efeitos jurídicos.',
      trap:'Divisibilidade jurídica não é sinônimo de possibilidade material. Basta alteração da substância, perda considerável de valor ou prejuízo do uso para afastar a divisibilidade do art. 87.',
      memorize:['Três testes: substância, valor e uso.','Indivisibilidade: natural, legal ou convencional.','Móveis e imóveis podem ser indivisíveis.','Coisa indivisível pode ser vendida e o valor repartido.']
    },
    {
      id:'singulares-coletivos',
      title:'Bens singulares e coletivos',
      basis:'CC, arts. 89 a 91',
      text:'Bem singular é considerado individualmente, ainda que esteja fisicamente reunido a outros. Bem coletivo ou universal resulta de uma pluralidade tratada como unidade para determinada finalidade. A coletividade não elimina necessariamente a autonomia dos componentes: o conjunto pode ser objeto de uma relação jurídica e, nos limites legais, cada elemento pode receber relações próprias.',
      sections:[
        {title:'Bens singulares',bullets:['São considerados de per si, independentemente dos demais, como um livro de uma biblioteca ou uma árvore de um pomar.','A doutrina distingue singulares simples, cujos elementos se unem naturalmente, e compostos, formados por intervenção humana.','A reunião física não cria automaticamente universalidade; é preciso verificar titularidade e destinação unitária quando se tratar de universalidade de fato.']},
        {title:'Universalidades',bullets:['Universalidade de fato é a pluralidade de bens singulares pertencentes à mesma pessoa e com destinação unitária, como rebanho, biblioteca ou frota.','Os bens que a compõem podem ser objeto de relações jurídicas próprias, conforme o parágrafo único do art. 90.','Universalidade de direito é o complexo de relações jurídicas de uma pessoa dotadas de valor econômico, reconhecido como unidade pelo ordenamento.','Herança e patrimônio são exemplos tradicionais de universalidades de direito, envolvendo direitos, obrigações e outras posições jurídicas.']}
      ],
      table:{headers:['Categoria','Formação','Exemplo'],rows:[['Singular','Consideração individual','Um veículo'],['Universalidade de fato','Bens da mesma pessoa + destinação unitária','Frota empresarial'],['Universalidade de direito','Complexo de relações jurídicas com valor econômico','Herança; patrimônio']]},
      example:'Uma biblioteca particular pode ser negociada como conjunto, sem que cada livro perca sua individualidade. Um exemplar específico ainda poderá ser vendido separadamente se não houver impedimento.',
      trap:'Universalidade de fato exige que os bens pertençam à mesma pessoa e tenham destinação unitária. Já a universalidade de direito não é simples reunião de objetos: é um complexo de relações jurídicas economicamente apreciáveis.',
      memorize:['Singular = considerado individualmente.','Universalidade de fato: mesma pessoa + destinação unitária.','Componentes da universalidade de fato conservam autonomia jurídica possível.','Universalidade de direito reúne relações jurídicas, não apenas coisas.']
    },
    {
      id:'principal-acessorio',
      title:'Bens principais e acessórios',
      basis:'CC, art. 92',
      text:'Principal é o bem que existe sobre si, abstrata ou concretamente; acessório é aquele cuja existência supõe a do principal. Dessa relação surge o princípio da gravitação jurídica, segundo o qual o acessório tende a acompanhar a sorte do principal. O princípio, porém, não é absoluto: lei, contrato, natureza do acessório ou circunstâncias podem impor solução diferente.',
      sections:[
        {title:'Relação de dependência',bullets:['A classificação é relacional: um bem não é acessório em abstrato, mas em comparação com outro.','Solo é principal em relação à construção incorporada; veículo é principal em relação a componentes que completam seu funcionamento.','Partes integrantes, pertenças, frutos, produtos e benfeitorias são categorias estudadas dentro das relações de acessoriedade, mas não possuem exatamente o mesmo regime.']},
        {title:'Gravitação jurídica e exceções',bullets:['Em regra, a transferência ou extinção do principal repercute nos acessórios que o integram.','As pertenças constituem exceção expressa: o negócio sobre o principal não as abrange automaticamente.','Frutos e produtos, mesmo ainda unidos ao principal, podem ser objeto de negócio jurídico separado.','A vontade das partes pode separar elementos quando a lei, a natureza e a preservação do bem permitirem.']}
      ],
      table:{headers:['Bem','Característica','Regra geral'],rows:[['Principal','Existe por si','Define o centro da relação'],['Acessório','Pressupõe relação com o principal','Tende a acompanhar o principal'],['Pertença','Acessório autônomo destinado duradouramente','Não acompanha automaticamente'],['Fruto ou produto','Deriva do principal','Pode ser negociado antes da separação']]},
      example:'Na venda de um automóvel, seus componentes funcionais normalmente acompanham o principal. Um equipamento removível instalado apenas para uso pessoal poderá ser excluído, especialmente se for pertença e o contrato não o abranger.',
      trap:'“O acessório sempre segue o principal” é formulação absoluta e errada. A gravitação jurídica comporta exceções, sendo as pertenças a principal cobrança literal dos arts. 93 e 94.',
      memorize:['Principal existe sobre si; acessório supõe o principal.','A classificação depende da relação entre os bens.','Gravitação jurídica é regra, não dogma absoluto.','Pertenças e negócios separados com frutos/produtos mostram exceções.']
    },
    {
      id:'pertencas-partes-integrantes',
      title:'Pertenças e partes integrantes',
      basis:'CC, arts. 93 e 94',
      text:'Parte integrante liga-se funcional ou materialmente ao principal de modo que sua retirada o deixa incompleto. Pertença conserva autonomia e não integra a substância do principal, embora seja destinada de modo duradouro ao seu uso, serviço ou aformoseamento. A distinção determina se o elemento acompanha automaticamente um negócio celebrado sobre o principal.',
      sections:[
        {title:'Partes integrantes',bullets:['Formam com o principal um todo funcional, como a instalação elétrica de uma casa ou as rodas necessárias ao funcionamento de um veículo.','Sua remoção compromete a completude ou a utilização normal do bem principal.','Embora o Código não apresente uma seção autônoma com esse nome, a categoria é extraída do contraste feito pelo art. 93 e do regime geral do principal e acessório.']},
        {title:'Pertenças',bullets:['Não constituem partes integrantes e mantêm individualidade física e jurídica.','Devem possuir destinação duradoura ao uso, serviço ou aformoseamento de outro bem; mera colocação ocasional não basta.','O negócio relativo ao principal não abrange as pertenças, salvo se o contrário resultar da lei, da manifestação de vontade ou das circunstâncias do caso.','A finalidade concreta é decisiva: o mesmo objeto pode ser pertença em uma situação e simples bem independente em outra.']}
      ],
      table:{headers:['Critério','Parte integrante','Pertença'],rows:[['Vínculo','Compõe material ou funcionalmente o principal','Destinação duradoura, sem integração'],['Autonomia','Reduzida em relação ao conjunto','Conservada'],['Negócio com o principal','Em regra acompanha','Em regra não acompanha'],['Exemplo','Fiação elétrica','Piano destinado ao aformoseamento da casa']]},
      example:'Na venda de uma residência, a fiação e as portas acompanham o imóvel como partes integrantes. Um piano utilizado na decoração não será incluído automaticamente, salvo previsão contratual, lei ou circunstâncias que demonstrem o contrário.',
      trap:'Pertença é acessória, mas não segue automaticamente o principal. A FCC costuma aplicar indiscriminadamente o princípio da gravitação e contrariar o art. 94.',
      memorize:['Parte integrante completa o principal.','Pertença mantém autonomia.','Pertença exige destinação duradoura.','Negócio do principal não abrange pertenças, salvo lei, vontade ou circunstâncias.']
    },
    {
      id:'frutos-produtos',
      title:'Frutos e produtos',
      basis:'CC, art. 95',
      text:'Frutos são utilidades produzidas periodicamente pelo bem principal sem redução de sua substância. Produtos são retirados do principal com diminuição de sua quantidade, qualidade ou valor, pois não se renovam periodicamente nas mesmas condições. Apesar de ainda não separados, frutos e produtos podem ser objeto de negócio jurídico.',
      sections:[
        {title:'Classificações dos frutos',bullets:['Naturais decorrem da força orgânica do bem, como frutos de uma árvore e crias de animais.','Industriais resultam da atuação humana organizada sobre a matéria-prima.','Civis são rendimentos decorrentes de relação jurídica, como aluguéis e juros.','Quanto ao estado, podem ser pendentes, percebidos, estantes, percipiendos ou consumidos, conforme estejam ligados, colhidos, armazenados, não colhidos no momento devido ou já utilizados.']},
        {title:'Produtos e negociação',bullets:['Petróleo extraído, minério retirado e madeira obtida com redução da fonte são exemplos de produtos.','A retirada do produto diminui o conteúdo econômico ou material do principal.','O art. 95 permite venda de safra futura, frutos pendentes ou recursos a extrair, mesmo antes da separação material.','A qualificação repercute em posse, usufruto, contratos e deveres de restituição, devendo ser aplicada conforme o instituto envolvido.']}
      ],
      table:{headers:['Elemento','Periodicidade','Efeito sobre o principal','Exemplo'],rows:[['Fruto','Renovável periodicamente','Não reduz a substância','Aluguel; fruta colhida'],['Produto','Não se renova nas mesmas condições','Reduz quantidade, qualidade ou valor','Minério; petróleo'],['Fruto pendente','Ainda ligado','Pode ser negociado','Safra futura']]},
      example:'As laranjas colhidas de uma árvore são frutos naturais porque a fonte permanece produtiva. A madeira obtida pelo corte definitivo da árvore é produto, pois a extração reduz a própria fonte.',
      trap:'Produto não é sinônimo de fruto industrial. Fruto industrial decorre do trabalho humano e se renova na atividade; produto reduz a substância ou o valor do bem principal.',
      memorize:['Fruto: periodicidade sem diminuição da fonte.','Produto: extração com redução da fonte.','Frutos: naturais, industriais e civis.','Mesmo não separados, frutos e produtos podem ser negociados.']
    },
    {
      id:'benfeitorias',
      title:'Benfeitorias e acessões',
      basis:'CC, arts. 96 e 97; arts. 1.248 a 1.259',
      text:'Benfeitoria é intervenção realizada sobre bem preexistente para conservá-lo, facilitar seu uso ou proporcionar deleite. Acessão é forma de aquisição ou acréscimo pela incorporação de elemento novo, natural ou artificial, com aumento do volume ou da substância do principal. A distinção repercute em indenização, retenção, propriedade e efeitos da posse.',
      sections:[
        {title:'Espécies de benfeitorias',bullets:['Necessárias conservam o bem ou impedem sua deterioração, como reparar estrutura comprometida.','Úteis aumentam ou facilitam o uso, como instalar acesso que amplie a funcionalidade.','Voluptuárias destinam-se ao mero deleite ou recreio, sem aumentar o uso habitual, ainda que sejam caras ou tornem o bem mais agradável.','A classificação depende da finalidade objetiva da obra no caso concreto, e não apenas de seu custo ou aparência.']},
        {title:'Acessões e melhoramentos naturais',bullets:['Acessões podem decorrer de fenômenos naturais ou de atividade humana, como aluvião, formação de ilha, construção ou plantação.','Construir casa em terreno antes vazio é exemplo de acessão artificial, pois se cria e incorpora elemento novo.','Não são benfeitorias os melhoramentos ou acréscimos que sobrevêm ao bem sem intervenção do proprietário, possuidor ou detentor.','As regras de indenização das benfeitorias variam conforme boa-fé, título e relação jurídica; a classificação, sozinha, não resolve todo o direito à indenização.']}
      ],
      table:{headers:['Categoria','Finalidade ou origem','Exemplo'],rows:[['Necessária','Conservar ou evitar deterioração','Reparo de viga comprometida'],['Útil','Aumentar ou facilitar uso','Instalação funcional de acesso'],['Voluptuária','Deleite ou recreio','Ornamento sem aumento do uso habitual'],['Acessão','Incorporação de elemento novo','Construção em terreno vazio']]},
      example:'Trocar telhas quebradas para impedir infiltração é benfeitoria necessária. Construir uma casa nova em terreno vazio é acessão. O elevado valor de uma piscina não a torna útil se sua função concreta for apenas recreativa.',
      trap:'O preço da obra não define a espécie de benfeitoria. Outra troca frequente é chamar todo acréscimo de benfeitoria: melhoramento natural sem intervenção e criação nova por acessão possuem regime diferente.',
      memorize:['Necessária conserva; útil facilita; voluptuária proporciona deleite.','Classificação depende da função concreta.','Art. 97 exclui acréscimos sem intervenção.','Acessão cria ou incorpora elemento novo ao principal.']
    },
    {
      id:'bens-publicos-classificacao',
      title:'Bens públicos: conceito e classificação',
      basis:'CC, arts. 98 e 99; CJF, Enunciado 287',
      text:'Pela literalidade do art. 98, são públicos os bens pertencentes às pessoas jurídicas de direito público interno; todos os demais são particulares, seja qual for seu proprietário. Dentro do patrimônio público, a destinação separa bens de uso comum do povo, bens de uso especial e bens dominicais. Em questões doutrinárias, pode aparecer a proteção funcional de bens privados afetados à prestação de serviço público, mas ela não autoriza ignorar o critério literal.',
      sections:[
        {title:'Três categorias',bullets:['Uso comum do povo: destinados à utilização geral, como rios, mares, estradas, ruas e praças.','Uso especial: destinados a serviço ou estabelecimento da Administração, inclusive autarquias, como escolas, hospitais e prédios administrativos.','Dominicais: integram o patrimônio disponível das pessoas jurídicas de direito público como objeto de direito pessoal ou real, sem afetação direta a uso coletivo ou serviço.','Salvo lei em contrário, são dominicais os bens das pessoas jurídicas de direito público às quais se tenha dado estrutura de direito privado.']},
        {title:'Entidades privadas e afetação',bullets:['Empresa pública e sociedade de economia mista são pessoas jurídicas de direito privado; seus bens não se tornam dominicais apenas porque o capital é estatal.','O Enunciado 287 do CJF admite classificação funcional como público do bem privado afetado à prestação de serviço público, posição que deve ser identificada como doutrinária.','Em prova de literalidade, comece pelo art. 98: titularidade por pessoa jurídica de direito público interno.','A proteção especial de determinado bem de entidade privada depende de sua efetiva vinculação ao serviço público e do regime jurídico aplicável.']}
      ],
      table:{headers:['Categoria','Destinação','Exemplo'],rows:[['Uso comum','Utilização pela coletividade','Praça; rua; rio'],['Uso especial','Serviço ou estabelecimento público','Escola; hospital; sede de autarquia'],['Dominical','Patrimônio público sem afetação imediata','Terreno público disponível']]},
      example:'Um prédio municipal onde funciona uma unidade de saúde é bem de uso especial. Um terreno pertencente ao Município sem destinação pública atual pode ser dominical. Já a sede de uma empresa pública não vira dominical apenas pela origem estatal da empresa.',
      trap:'O PDF utiliza a sede da Caixa como exemplo automático de bem dominical, mas a Caixa é pessoa jurídica de direito privado. Para literalidade, bem dominical pertence a pessoa jurídica de direito público; eventual proteção do bem privado exige análise da afetação ao serviço.',
      memorize:['Art. 98: titularidade pública interna é o critério literal.','Uso comum = coletividade.','Uso especial = serviço ou estabelecimento público.','Dominical = patrimônio público sem afetação direta.']
    },
    {
      id:'afetacao-desafetacao-alienacao',
      title:'Afetação, desafetação e alienação dos bens públicos',
      basis:'CC, arts. 99 a 101',
      text:'Afetação é a vinculação do bem a uma finalidade pública, seja uso coletivo ou prestação de serviço. Desafetação retira essa destinação e converte o bem, em regra, à categoria dominical. A passagem entre categorias não altera necessariamente o titular, mas modifica o regime de disponibilidade e a possibilidade de alienação.',
      sections:[
        {title:'Bens afetados',bullets:['Bens de uso comum e de uso especial estão afetados a funções públicas.','Enquanto conservarem essa qualificação, são inalienáveis na forma determinada pela lei.','A inalienabilidade é condicionada à manutenção da destinação, e não significa impossibilidade eterna de mudança do regime.','Afetação pode resultar de lei, ato administrativo ou situação de fato juridicamente reconhecida, conforme o caso e as exigências aplicáveis.']},
        {title:'Desafetação e alienação',bullets:['Desafetação encerra a destinação pública específica e normalmente transforma o bem em dominical.','Bens dominicais podem ser alienados, mas somente com observância das exigências legais, como autorização, avaliação, interesse público e procedimento adequado quando exigidos.','Desafetar não transfere automaticamente a propriedade e não dispensa as formalidades da alienação.','Um bem dominical pode ser novamente afetado, passando a uso comum ou especial conforme a nova destinação.']}
      ],
      table:{headers:['Situação','Destinação','Alienação'],rows:[['Uso comum','Coletividade','Inalienável enquanto mantida a qualificação'],['Uso especial','Serviço ou estabelecimento público','Inalienável enquanto mantida a qualificação'],['Dominical','Sem afetação pública imediata','Possível, observadas as exigências legais'],['Desafetação','Retira destinação pública','Prepara disponibilidade, mas não aliena sozinha']]},
      example:'Uma escola pública é desativada definitivamente e o imóvel é regularmente desafetado. Ele pode passar à categoria dominical, mas sua venda ainda depende do cumprimento do procedimento legal; a desafetação, isoladamente, não entrega o bem ao comprador.',
      trap:'Bens dominicais não são livremente alienáveis como patrimônio privado comum: a alienação exige a forma prevista em lei. Também é errado afirmar que a desafetação já transfere a propriedade.',
      memorize:['Afetação vincula o bem a função pública.','Uso comum e uso especial são afetados.','Desafetação normalmente converte o bem em dominical.','Dominical pode ser alienado, sempre com requisitos legais.']
    },
    {
      id:'bens-publicos-usucapiao-uso',
      title:'Usucapião, ocupação e uso dos bens públicos',
      basis:'CC, arts. 102 e 103; CF, arts. 183, § 3º, e 191, parágrafo único; STJ, Súmula 619',
      text:'Nenhum bem público pode ser adquirido por usucapião. A proibição alcança bens de uso comum, de uso especial e dominicais, móveis ou imóveis conforme a regra civil, e é reforçada constitucionalmente quanto aos imóveis. O fato de o bem dominical poder ser alienado segundo a lei não o torna usucapível enquanto permanecer público.',
      sections:[
        {title:'Ocupação indevida',bullets:['Posse prolongada, moradia, produção ou ausência de oposição estatal não criam usucapião de bem público.','A ocupação indevida caracteriza mera detenção de natureza precária, conforme a orientação consolidada do STJ.','A Súmula 619 afasta direito de retenção e indenização por acessões e benfeitorias realizadas pelo ocupante indevido.','Alienação regular pelo Poder Público e usucapião são institutos distintos: o primeiro depende de ato e requisitos legais; o segundo é aquisição pela posse, vedada sobre bem público.']},
        {title:'Uso comum gratuito ou retribuído',bullets:['O uso comum dos bens públicos pode ser gratuito ou retribuído, conforme estabelecer a entidade responsável por sua administração.','Cobrança pelo uso não transforma o bem em particular nem elimina sua destinação coletiva.','Pedágio e outras remunerações legalmente instituídas demonstram que uso comum não significa necessariamente gratuidade.','Autorizações, permissões e concessões de uso não transferem, por si, o domínio do bem ao usuário.']}
      ],
      table:{headers:['Situação','Consequência'],rows:[['Ocupação prolongada de praça','Não produz usucapião'],['Ocupação de terreno público dominical','Não produz usucapião'],['Benfeitoria por ocupante indevido','Sem retenção ou indenização, conforme Súmula 619'],['Uso comum remunerado','Admitido se estabelecido legalmente']]},
      example:'Uma pessoa ocupa por vinte anos terreno pertencente ao Município, constrói moradia e paga encargos locais. Enquanto o imóvel continuar público, não haverá usucapião, mesmo que seja dominical e não esteja destinado a serviço público.',
      trap:'O PDF sugere que bens dominicais poderiam ser usucapidos, mas isso contraria o art. 102 do Código Civil e a proibição constitucional. Alienabilidade condicionada não se confunde com usucapibilidade.',
      memorize:['Todos os bens públicos são insuscetíveis de usucapião.','A vedação também alcança os dominicais.','Ocupação indevida = detenção precária.','Uso comum pode ser gratuito ou retribuído.']
    }
  ],
  'civ-negocio':[
    {
      id:'fato-juridico-suporte',
      title:'Fato jurídico, suporte fático e juridicização',
      basis:'Teoria geral dos fatos jurídicos; CC, arts. 104 a 185',
      text:'Fato jurídico é o acontecimento natural ou humano ao qual o Direito atribui consequências. Nem tudo o que ocorre na realidade ingressa no mundo jurídico: é necessário que o acontecimento concreto corresponda aos elementos previstos na hipótese normativa, completando o chamado suporte fático.',
      sections:[
        {title:'Do mundo fático ao mundo jurídico',bullets:['Mundo fático é o conjunto de acontecimentos da realidade; mundo jurídico é a parcela dessa realidade selecionada pelas normas.','Suporte fático abstrato é a descrição hipotética contida na norma; suporte fático concreto é a ocorrência real dos elementos descritos.','Juridicização é a entrada do fato no mundo jurídico quando se completam os elementos necessários para a incidência da norma.','Se faltar elemento nuclear do suporte fático, pode existir acontecimento material, mas não o fato jurídico pretendido.']},
        {title:'Elementos do suporte fático',bullets:['Elementos nucleares e completantes são indispensáveis à formação do fato jurídico.','Elementos complementares qualificam sujeito, objeto e forma e são examinados sobretudo no plano da validade.','Elementos integrativos, como certos registros e autorizações, podem ser necessários para uma eficácia específica.','A separação é doutrinária e serve para localizar o defeito: existência, validade ou eficácia.']}
      ],
      table:{headers:['Expressão','Significado','Consequência'],rows:[['Suporte fático abstrato','Hipótese descrita pela norma','Indica o que precisa ocorrer'],['Suporte fático concreto','Ocorrência real dos elementos','Permite a incidência normativa'],['Juridicização','Entrada do fato no mundo jurídico','Faz nascer a consequência jurídica'],['Deficiência nuclear','Falta elemento essencial à formação','Impede o fato jurídico pretendido']]},
      example:'Duas pessoas conversam sobre a venda de um imóvel, mas não chegam a manifestar concordância definitiva. Houve negociação no mundo fático, porém ainda não se formou o negócio jurídico de compra e venda.',
      trap:'A importância econômica ou social do acontecimento não o transforma, por si só, em fato jurídico. O ponto decisivo é sua correspondência com a hipótese prevista pelo ordenamento.',
      memorize:['Fato real não é automaticamente fato jurídico.','Suporte abstrato está na norma; suporte concreto ocorre na realidade.','Suporte completo permite a incidência da norma.','Juridicização é o ingresso no mundo jurídico.']
    },
    {
      id:'classificacao-fatos-juridicos',
      title:'Classificação dos fatos jurídicos',
      basis:'Teoria geral; CC, art. 185',
      text:'Os fatos jurídicos podem decorrer da natureza ou de conduta humana. Nos fatos humanos, a vontade pode ser irrelevante para o efeito, limitar-se à prática do ato ou permitir que os particulares conformem os efeitos dentro dos limites do ordenamento.',
      sections:[
        {title:'Fatos naturais e condutas humanas',bullets:['Fato jurídico em sentido estrito tem como núcleo acontecimento independente da vontade, como nascimento, morte ou decurso do tempo.','No ato-fato jurídico existe conduta humana, mas a intenção de produzir o efeito jurídico é irrelevante.','No ato jurídico em sentido estrito há vontade de praticar o ato, porém os efeitos essenciais são predeterminados pela lei.','No negócio jurídico, a autonomia privada participa da criação, modificação, conservação ou extinção dos efeitos.']},
        {title:'Espécies de ato-fato',bullets:['Ato-fato real ou material produz resultado juridicamente relevante pela atuação concreta.','Ato-fato indenizativo faz surgir obrigação de reparar, independentemente de uma vontade dirigida a esse efeito.','Ato-fato caducificante liga comportamento ou omissão à perda de uma posição jurídica.','As categorias são construções doutrinárias; a questão deve ser resolvida pela função que a vontade desempenha.']}
      ],
      table:{headers:['Categoria','Papel da vontade','Exemplo'],rows:[['Fato jurídico estrito','Núcleo independe da vontade','Nascimento, morte, maioridade'],['Ato-fato jurídico','Conduta existe, mas intenção jurídica é irrelevante','Apropriação material nas condições legais'],['Ato jurídico estrito','Vontade pratica o ato; efeitos vêm da lei','Pagamento'],['Negócio jurídico','Vontade conforma efeitos admitidos','Contrato, doação, testamento']]},
      example:'Quem paga dívida deseja realizar o pagamento, mas não escolhe livremente seus efeitos essenciais: quitação e extinção seguem a lei. Na compra e venda, as partes podem conformar objeto, preço, prazo e outras cláusulas.',
      trap:'No ato-fato existe conduta humana. O que se torna irrelevante não é a conduta, mas a vontade dirigida especificamente à produção do efeito jurídico.',
      memorize:['Fato estrito: núcleo natural.','Ato-fato: conduta humana com vontade jurídica irrelevante.','Ato estrito: efeitos predeterminados pela lei.','Negócio: autonomia privada conforma efeitos.']
    },
    {
      id:'conceito-classificacoes-negocio',
      title:'Conceito e classificações do negócio jurídico',
      basis:'CC, arts. 104 a 114',
      text:'Negócio jurídico é manifestação de vontade pela qual uma ou mais pessoas procuram produzir efeitos reconhecidos pelo Direito. A autonomia privada permite organizar interesses, mas permanece submetida à lei, à ordem pública, aos bons costumes, à boa-fé e às demais limitações do ordenamento.',
      sections:[
        {title:'Número e destino das manifestações',bullets:['Unilateral forma-se com uma manifestação de vontade; bilateral exige manifestações convergentes de duas partes; plurilateral reúne manifestações orientadas a finalidade comum.','Negócio unilateral receptício precisa chegar ao conhecimento de destinatário; o não receptício produz efeitos sem ciência de destinatário determinado.','A classificação bilateral considera a formação do negócio, não a quantidade de obrigações geradas.','Contrato é negócio bilateral ou plurilateral; testamento é exemplo clássico de negócio unilateral e não receptício.']},
        {title:'Conteúdo, momento e forma',bullets:['Gratuito atribui vantagem sem contraprestação equivalente; oneroso envolve sacrifícios e vantagens patrimoniais recíprocos.','Inter vivos destina-se a produzir efeitos durante a vida; mortis causa tem a morte como pressuposto típico de eficácia.','Solene depende de forma determinada pela lei; não solene submete-se à liberdade de formas.','Negócio principal existe autonomamente; o acessório pressupõe outro negócio ou obrigação.']}
      ],
      table:{headers:['Classificação','Primeira categoria','Segunda categoria'],rows:[['Formação','Unilateral: uma manifestação','Bilateral/plurilateral: manifestações convergentes'],['Patrimônio','Gratuito: vantagem sem equivalente','Oneroso: prestações ou sacrifícios recíprocos'],['Momento','Inter vivos','Mortis causa'],['Forma','Solene ou formal','Não solene']]},
      example:'O testamento é unilateral, não receptício, formal e mortis causa. A compra e venda é normalmente bilateral, receptícia, onerosa e inter vivos.',
      trap:'Negócio bilateral não significa necessariamente que ambas as partes assumam obrigações. A bilateralidade aqui se refere às manifestações necessárias à formação.',
      memorize:['Unilateral/bilateral: formação.','Gratuito/oneroso: vantagens e sacrifícios.','Inter vivos/mortis causa: momento típico da eficácia.','Autonomia privada não significa liberdade sem limites.']
    },
    {
      id:'planos-existencia-validade-eficacia',
      title:'Planos da existência, validade e eficácia',
      basis:'CC, arts. 104, 121 a 137 e 166 a 184',
      text:'O negócio jurídico deve ser examinado em três planos sucessivos. Primeiro se verifica se ele chegou a existir juridicamente; depois, se foi formado de maneira válida; por fim, se está apto a produzir imediatamente todos os efeitos pretendidos.',
      sections:[
        {title:'Existência e validade',bullets:['No plano da existência observam-se agente, manifestação de vontade, objeto e forma exteriorizadora.','No plano da validade esses elementos são qualificados: agente capaz e legitimado, vontade livre, objeto lícito, possível e determinado ou determinável, além de forma adequada.','Negócio nulo ou anulável chegou a existir, mas apresenta deficiência no plano da validade.','Inexistência não se confunde com nulidade, embora a lei nem sempre utilize expressamente a categoria do negócio inexistente.']},
        {title:'Eficácia',bullets:['Eficácia examina a produção concreta dos efeitos do negócio existente e válido.','Condição, termo, registro ou autorização podem retardar, limitar ou completar determinados efeitos.','Negócio válido pode estar temporariamente ineficaz; negócio anulável, por sua vez, produz efeitos enquanto não for desconstituído.','O registro pode ser requisito de aquisição ou eficácia perante terceiros sem integrar necessariamente a formação do contrato.']}
      ],
      table:{headers:['Plano','Pergunta','Exame principal'],rows:[['Existência','O negócio chegou a se formar?','Agente, vontade exteriorizada, objeto e forma'],['Validade','Foi formado conforme o Direito?','Capacidade, licitude, possibilidade e forma adequada'],['Eficácia','Já produz os efeitos pretendidos?','Condição, termo, registro e outros fatores']]},
      example:'A compra e venda de imóvel pode formar contrato válido entre as partes, mas a propriedade imobiliária somente se transfere com o registro do título no Registro de Imóveis.',
      trap:'Validade e eficácia não são sinônimos. A condição suspensiva pode impedir a aquisição do direito enquanto pendente sem tornar inválido o negócio.',
      memorize:['Existência: formação.','Validade: perfeição jurídica.','Eficácia: produção dos efeitos.','Nulo e anulável são negócios existentes, porém inválidos.']
    },
    {
      id:'agente-capacidade-legitimidade',
      title:'Agente capaz, capacidade e legitimidade',
      basis:'CC, arts. 104, I, 105, 166, I, e 171, I',
      text:'A validade do negócio exige agente capaz. Além da capacidade civil geral, certos atos dependem de legitimidade, entendida como aptidão específica para participar daquela relação jurídica ou dispor daquele interesse.',
      sections:[
        {title:'Capacidade nos negócios',bullets:['Negócio praticado diretamente por absolutamente incapaz é, em regra, nulo.','Negócio praticado por relativamente incapaz sem a assistência exigida é, em regra, anulável.','A incapacidade limita o exercício pessoal dos direitos; não elimina personalidade nem capacidade de direito.','Representação e assistência são técnicas protetivas diferentes e sua necessidade depende do grau de incapacidade.']},
        {title:'Legitimidade e art. 105',bullets:['Pessoa plenamente capaz pode não possuir legitimidade para negócio específico por causa da posição que ocupa.','A incapacidade relativa de uma parte não pode ser invocada pela outra em benefício próprio.','Em regra, a incapacidade relativa também não aproveita aos cointeressados capazes.','Excepcionalmente, pode aproveitar aos cointeressados se o objeto do direito ou da obrigação comum for indivisível.']}
      ],
      table:{headers:['Conceito','Alcance','Falta ou deficiência'],rows:[['Capacidade de direito','Aptidão para titularizar direitos e deveres','Não é eliminada pela incapacidade de exercício'],['Capacidade de exercício','Aptidão para agir pessoalmente','Pode exigir representação ou assistência'],['Legitimidade','Aptidão específica para aquele negócio','Impede ou condiciona ato determinado']]},
      example:'Uma pessoa pode ser plenamente capaz e, ainda assim, estar impedida de adquirir determinado bem em razão da função que exerce ou de sua posição na relação. O problema é de legitimidade, não de capacidade geral.',
      trap:'Não confunda incapacidade com ilegitimidade. A primeira atinge o modo de exercício dos atos civis; a segunda é impedimento ou exigência ligada a negócio específico.',
      memorize:['Validade exige agente capaz.','Absoluta: representação e nulidade, em regra.','Relativa: assistência e anulabilidade, em regra.','Capacidade é geral; legitimidade é específica.']
    },
    {
      id:'objeto-forma-negocio',
      title:'Objeto e forma do negócio jurídico',
      basis:'CC, arts. 104, II e III, e 106 a 109; art. 183',
      text:'O objeto deve ser lícito, possível, determinado ou determinável. A forma deve ser a prescrita pela lei ou, quando não houver solenidade obrigatória, qualquer forma que não seja proibida.',
      sections:[
        {title:'Objeto lícito, possível e determinável',bullets:['Ilicitude pode ser direta ou resultar da finalidade ilícita do conjunto negocial.','A impossibilidade pode ser física ou jurídica e precisa ser examinada conforme a natureza da prestação.','A impossibilidade inicial não invalida se for relativa ou cessar antes da realização da condição à qual o negócio estiver subordinado.','Indeterminação absoluta invalida; objeto determinável é válido quando houver critérios para sua identificação futura.']},
        {title:'Liberdade e exigência de forma',bullets:['A regra é a liberdade das formas: forma especial somente é necessária quando a lei expressamente exigir.','Forma é o modo de exteriorização da vontade; instrumento é o suporte documental. Nem todo negócio exige documento.','Salvo disposição contrária, escritura pública é essencial para negócios sobre direitos reais imobiliários de valor superior a trinta salários mínimos.','Se as partes estipularem que o negócio não valerá sem instrumento público, ele se torna da substância do ato.','A invalidade do instrumento não invalida o negócio quando este puder ser provado por outro meio.']}
      ],
      table:{headers:['Requisito','Regra','Cuidado'],rows:[['Licitude','Objeto conforme o ordenamento','Analisar também a finalidade conjunta'],['Possibilidade','Prestação física e juridicamente realizável','Impossibilidade relativa pode não invalidar'],['Determinação','Determinado ou determinável','Só a indeterminação absoluta invalida'],['Forma','Livre, salvo exigência expressa','Forma não é sinônimo de instrumento']]},
      example:'A venda de safra futura não é inválida apenas porque os produtos ainda não existem, desde que o objeto possa ser determinado e a prestação seja juridicamente possível.',
      trap:'O Código não exige apenas objeto determinado: aceita expressamente objeto determinável. Também está errado afirmar que negócio não solene é negócio sem forma.',
      memorize:['Objeto: lícito + possível + determinado ou determinável.','Regra: liberdade de formas.','Escritura pública: direitos reais sobre imóvel acima do limite legal.','Forma e instrumento não são sinônimos.']
    },
    {
      id:'manifestacao-interpretacao-vontade',
      title:'Manifestação de vontade e interpretação',
      basis:'CC, arts. 110 a 114',
      text:'A vontade precisa ser exteriorizada e interpretada dentro do contexto do negócio. O Código protege a confiança do destinatário, considera a intenção consubstanciada na declaração e exige interpretação conforme a boa-fé e os usos.',
      sections:[
        {title:'Reserva mental e silêncio',bullets:['Na reserva mental, o declarante manifesta algo que internamente não deseja. A declaração subsiste se o destinatário não conhecia a reserva.','Se o destinatário conhecia a reserva, desaparece a razão para proteger sua confiança na declaração.','Silêncio não é consentimento automático: somente importa anuência quando circunstâncias ou usos o autorizarem e não for necessária declaração expressa.','Manifestação pode ser expressa ou resultar de comportamento concludente, respeitadas as exigências legais de forma.']},
        {title:'Critérios de interpretação',bullets:['Atende-se mais à intenção consubstanciada na declaração do que ao sentido puramente literal.','Consideram-se comportamento posterior das partes, usos, costumes e práticas de mercado, boa-fé e razoável negociação.','Se identificável, considera-se o sentido mais benéfico à parte que não redigiu o dispositivo.','As partes podem pactuar regras de interpretação, integração e preenchimento de lacunas diversas das regras legais supletivas.','Negócios benéficos e renúncia interpretam-se estritamente.']}
      ],
      table:{headers:['Situação','Regra'],rows:[['Reserva desconhecida pelo destinatário','A manifestação subsiste'],['Reserva conhecida pelo destinatário','A manifestação não recebe a mesma proteção'],['Silêncio','Só vale como anuência nas condições do art. 111'],['Cláusula ambígua','Aplicam-se os critérios do art. 113'],['Renúncia ou negócio benéfico','Interpretação estrita']]},
      example:'Se uma cláusula é ambígua, mas as partes a executaram durante meses de uma única maneira, o comportamento posterior pode confirmar o sentido juridicamente adequado.',
      trap:'A violação da boa-fé não transforma automaticamente todo negócio em nulo. A consequência depende da norma violada e do regime aplicável ao caso.',
      memorize:['Vontade interna precisa ser exteriorizada.','Silêncio não é aceitação automática.','Interpretação: intenção exteriorizada + confiança + boa-fé + contexto.','Renúncia e negócio benéfico têm interpretação estrita.']
    },
    {
      id:'representacao-negocio-juridico',
      title:'Representação',
      basis:'CC, arts. 115 a 120',
      text:'Na representação, uma pessoa manifesta vontade em nome de outra. Quando o representante atua nos limites dos poderes conferidos, os efeitos do negócio recaem diretamente sobre o representado.',
      sections:[
        {title:'Origem e extensão dos poderes',bullets:['Os poderes de representação são conferidos pela lei ou pelo interessado.','O representante deve provar a qualidade em que atua e a extensão de seus poderes perante quem negocia.','Se não demonstrar os poderes, responde pelos atos que os excederem nas condições legais.','Representação legal segue as normas específicas do instituto; representação voluntária é disciplinada especialmente pelas regras do mandato.']},
        {title:'Autocontrato e conflito de interesses',bullets:['É anulável o negócio que o representante celebra consigo mesmo, em interesse próprio ou por conta de terceiro, salvo autorização legal ou do representado.','A regra do autocontrato também alcança o negócio realizado por pessoa que recebeu poderes por substabelecimento.','Negócio em conflito de interesses é anulável se a outra parte sabia ou deveria saber do conflito.','No conflito do art. 119, o prazo decadencial é de 180 dias, contado da conclusão do negócio ou da cessação da incapacidade.']}
      ],
      table:{headers:['Situação','Consequência'],rows:[['Atuação dentro dos poderes','Efeitos recaem sobre o representado'],['Excesso não esclarecido','Representante pode responder pelo excesso'],['Contrato consigo mesmo','Anulável, salvo permissão'],['Conflito conhecido pela contraparte','Anulável em 180 dias nas condições do art. 119']]},
      example:'Procurador autorizado apenas a administrar determinado bem o vende sem possuir poder de alienação. A atuação ultrapassa a extensão da representação conferida.',
      trap:'O prazo de 180 dias está ligado ao conflito de interesses do art. 119. Não deve ser aplicado automaticamente a toda e qualquer hipótese de representação.',
      memorize:['Poderes vêm da lei ou do interessado.','Dentro dos poderes: efeitos para o representado.','Autocontrato: anulável, salvo permissão.','Conflito conhecido: anulável; prazo específico de 180 dias.']
    },
    {
      id:'condicao',
      title:'Condição',
      basis:'CC, arts. 121 a 130',
      text:'Condição é a cláusula que deriva da vontade das partes e subordina efeitos do negócio a evento futuro e incerto. Ela pode suspender a aquisição do direito ou extingui-lo quando o evento ocorrer.',
      sections:[
        {title:'Suspensiva e resolutiva',bullets:['Na condição suspensiva, enquanto o evento não ocorrer, ainda não se adquire o direito pretendido.','Mesmo pendente, o titular do direito eventual pode praticar atos destinados a conservá-lo.','Na condição resolutiva, o negócio produz efeitos desde a conclusão e o direito pode ser exercido até o evento.','Em negócio continuado ou periódico, atos anteriores compatíveis com a condição e a boa-fé podem ser preservados após a resolução.']},
        {title:'Condições proibidas e impossíveis',bullets:['São vedadas condições contrárias à lei, à ordem pública ou aos bons costumes, que privem o negócio de todo efeito ou o submetam ao puro arbítrio de uma parte.','Condição puramente potestativa é proibida; não se deve afirmar que toda condição ligada à conduta de uma parte seja inválida.','Condições ilícitas, incompreensíveis ou contraditórias invalidam o negócio subordinado.','Condição física ou juridicamente impossível, se suspensiva, invalida o negócio; se resolutiva, considera-se inexistente.','Condição de não fazer coisa impossível também é considerada inexistente.']},
        {title:'Interferência maliciosa',bullets:['Considera-se verificada a condição cujo implemento foi maliciosamente impedido por quem seria desfavorecido.','Considera-se não verificada a condição provocada maliciosamente por quem se beneficiaria de sua ocorrência.','A regra impede que a parte obtenha vantagem por comportamento contrário à boa-fé.']}
      ],
      table:{headers:['Condição','Enquanto pendente','Quando ocorre'],rows:[['Suspensiva','Direito ainda não foi adquirido','Nasce a aquisição pretendida'],['Resolutiva','Negócio vigora e direito é exercido','Extingue-se o direito subordinado'],['Impossível suspensiva','Invalida o negócio','Não há aquisição'],['Impossível resolutiva','Cláusula tida por inexistente','Negócio permanece']]},
      example:'“Doarei o veículo se você for aprovado no concurso.” A aprovação é evento futuro e incerto; enquanto não ocorrer, o beneficiário ainda não adquiriu o direito.',
      trap:'Nem toda condição potestativa é proibida. O Código veda a puramente potestativa, entregue ao puro arbítrio de uma parte.',
      memorize:['Condição = futuro + incerto.','Suspensiva impede aquisição.','Resolutiva permite exercício até o evento.','Impossível suspensiva invalida; impossível resolutiva é tida por inexistente.']
    },
    {
      id:'termo-prazo',
      title:'Termo e contagem dos prazos',
      basis:'CC, arts. 131 a 135',
      text:'Termo é acontecimento futuro e certo que estabelece o início ou o fim do exercício dos efeitos do negócio. Prazo é o intervalo entre os marcos temporais e possui regras civis próprias de contagem.',
      sections:[
        {title:'Termo inicial e final',bullets:['O termo inicial suspende o exercício, mas não a aquisição do direito.','O termo final encerra a eficácia do negócio quando chega o momento certo.','O evento pode ter data determinada ou ser certo com momento desconhecido, como a morte.','Ao termo inicial e final aplicam-se, no que couber, regras das condições suspensiva e resolutiva.']},
        {title:'Contagem civil',bullets:['Salvo disposição contrária, exclui-se o dia do começo e inclui-se o do vencimento.','Se o vencimento cair em feriado, prorroga-se para o próximo dia útil.','Meado corresponde ao décimo quinto dia do mês; prazos em horas contam-se de minuto a minuto.','Prazos de meses e anos expiram no dia de igual número ou no imediato quando faltar correspondência.','Nos contratos, o prazo presume-se em favor do devedor; nos testamentos, em favor do herdeiro, ressalvada conclusão diversa.','Negócio entre vivos sem prazo é, em regra, exequível desde logo, salvo necessidade de tempo ou execução em lugar diverso.']}
      ],
      table:{headers:['Elemento','Evento','Efeito'],rows:[['Condição suspensiva','Futuro e incerto','Suspende aquisição'],['Termo inicial','Futuro e certo','Suspende exercício, não aquisição'],['Termo final','Futuro e certo','Encerra eficácia'],['Prazo','Intervalo entre termos','Delimita o tempo juridicamente relevante']]},
      example:'Direito adquirido hoje para ser exercido em 1º de dezembro está sujeito a termo inicial: a aquisição já ocorreu, mas o exercício deve aguardar a data.',
      trap:'O termo inicial não impede a aquisição do direito; impede seu exercício. Essa é a diferença clássica em relação à condição suspensiva.',
      memorize:['Condição: futuro e incerto.','Termo: futuro e certo.','Termo inicial suspende exercício, não aquisição.','Prazo é o intervalo; termo é o marco.']
    },
    {
      id:'encargo-modo',
      title:'Encargo ou modo',
      basis:'CC, arts. 136 e 137',
      text:'Encargo é obrigação acessória imposta ao beneficiário de uma liberalidade. Limita a vantagem recebida, mas não impede normalmente que o direito seja adquirido e exercido desde a formação do negócio.',
      sections:[
        {title:'Efeitos do encargo',bullets:['Aparece principalmente em doações e disposições testamentárias.','Em regra, não suspende aquisição nem exercício do direito.','Pode funcionar como condição suspensiva se o disponente expressamente lhe atribuir esse efeito.','O descumprimento pode permitir as medidas previstas para a liberalidade e o encargo concretamente estabelecido.']},
        {title:'Encargo ilícito ou impossível',bullets:['Como regra, o encargo ilícito ou impossível é considerado não escrito, preservando-se a liberalidade.','Se o encargo for motivo determinante da liberalidade, sua ilicitude ou impossibilidade invalida o negócio inteiro.','A solução demonstra o princípio da conservação: elimina-se a cláusula quando ela for separável da vontade principal.']}
      ],
      table:{headers:['Elemento acidental','Evento ou conteúdo','Efeito básico'],rows:[['Condição','Evento futuro e incerto','Suspende aquisição ou resolve direito'],['Termo','Evento futuro e certo','Adia exercício ou encerra eficácia'],['Encargo','Ônus ligado à liberalidade','Em regra, não suspende aquisição nem exercício']]},
      example:'Uma pessoa doa terreno ao Município com o encargo de construir uma escola. O Município adquire o direito, mas fica vinculado à finalidade validamente imposta.',
      trap:'Encargo não é sinônimo de condição. Somente suspenderá aquisição ou exercício quando o disponente o impuser expressamente como condição suspensiva.',
      memorize:['Encargo = liberalidade + ônus.','Regra: não suspende aquisição nem exercício.','Ilícito ou impossível: não escrito.','Se for motivo determinante: invalida o negócio.']
    },
    {
      id:'erro-ignorancia',
      title:'Erro ou ignorância',
      basis:'CC, arts. 138 a 144',
      text:'Erro é a falsa percepção da realidade formada pelo próprio declarante; ignorância representa desconhecimento. O negócio é anulável quando a declaração resulta de erro substancial perceptível por pessoa de diligência normal diante das circunstâncias.',
      sections:[
        {title:'Erro substancial',bullets:['Pode interessar à natureza do negócio, ao objeto principal ou a qualidade essencial.','Pode recair sobre identidade ou qualidade essencial da pessoa, desde que tenha influência relevante.','Erro de direito pode ser substancial quando não importa recusa à aplicação da lei e constitui motivo único ou principal do negócio.','Erro meramente acidental, sem influência determinante, não autoriza anulação.']},
        {title:'Situações especiais',bullets:['Falso motivo somente vicia quando expresso como razão determinante.','Transmissão errônea por intermediário recebe o mesmo regime da declaração direta.','Erro de indicação da pessoa ou coisa não vicia se o contexto permitir identificar quem ou o que se pretendia.','Erro de cálculo autoriza apenas retificação da declaração.','O negócio é preservado se o destinatário se oferecer para executá-lo conforme a vontade real do declarante.']}
      ],
      table:{headers:['Situação','Consequência'],rows:[['Erro substancial nas condições legais','Negócio anulável'],['Falso motivo não expresso como determinante','Não vicia'],['Indicação errada, mas identificação possível','Negócio preservado'],['Erro de cálculo','Somente retificação'],['Oferta de execução conforme vontade real','Negócio preservado']]},
      example:'Alguém compra quadro acreditando ser obra original, quando é uma réplica. Se a autenticidade era qualidade essencial nas circunstâncias, poderá haver erro substancial.',
      trap:'Erro de cálculo não gera anulabilidade. A consequência expressamente prevista é a retificação da declaração.',
      memorize:['Erro nasce no próprio declarante.','Precisa ser substancial e reconhecível nas circunstâncias.','Cálculo: retificação.','Execução conforme vontade real preserva o negócio.']
    },
    {
      id:'dolo',
      title:'Dolo',
      basis:'CC, arts. 145 a 150',
      text:'Dolo é a atuação destinada a induzir ou manter outra pessoa em erro. Diferentemente do erro espontâneo, há comportamento comissivo ou omissivo que interfere na formação da vontade do declarante.',
      sections:[
        {title:'Dolo principal e acidental',bullets:['Dolo principal é causa determinante: sem o engano, a vítima não teria celebrado o negócio; torna-o anulável.','Dolo acidental existe quando o negócio seria celebrado, mas de outro modo; gera somente perdas e danos.','Nos negócios bilaterais, silêncio intencional sobre fato ignorado pela outra parte pode configurar omissão dolosa se, sem ele, o negócio não teria ocorrido.','A distinção depende da influência concreta do engano sobre a decisão.']},
        {title:'Terceiro, representante e dolo recíproco',bullets:['Dolo de terceiro permite anulação se a parte beneficiada sabia ou deveria saber.','Se o beneficiário não sabia nem deveria saber, o negócio subsiste e o terceiro responde pelos danos.','Dolo do representante legal limita a responsabilidade do representado ao proveito obtido; no representante convencional, há responsabilidade solidária pelas perdas e danos.','Se ambas as partes agem com dolo, nenhuma pode alegá-lo para anular nem reclamar indenização.']}
      ],
      table:{headers:['Modalidade','Negócio','Indenização'],rows:[['Dolo principal','Anulável','Pode haver reparação'],['Dolo acidental','Subsiste','Perdas e danos'],['Dolo de terceiro conhecido pelo beneficiário','Anulável','Beneficiário e terceiro conforme o caso'],['Dolo recíproco','Nenhuma parte anula por esse fundamento','Nenhuma reclama indenização']]},
      example:'O vendedor sabe que o veículo sofreu grave alagamento e oculta deliberadamente o fato. Se o comprador não teria contratado sabendo disso, existe dolo principal.',
      trap:'Dolo acidental não anula o negócio. Ele gera somente satisfação das perdas e danos.',
      memorize:['Erro: engano próprio.','Dolo: alguém induz ou mantém o erro.','Principal anula; acidental indeniza.','Dolo recíproco impede anulação e indenização entre as partes.']
    },
    {
      id:'coacao',
      title:'Coação',
      basis:'CC, arts. 151 a 155',
      text:'Coação é a pressão que provoca fundado temor de dano iminente e considerável à pessoa, à sua família ou aos seus bens, levando-a a manifestar vontade que não formaria livremente.',
      sections:[
        {title:'Gravidade e avaliação concreta',bullets:['A ameaça precisa ser séria e relevante, com fundado temor de dano iminente e considerável.','Consideram-se idade, condição, saúde, temperamento e todas as circunstâncias capazes de influir na gravidade.','Ameaça de exercício normal de direito e simples temor reverencial não configuram coação.','Se a ameaça atingir pessoa não pertencente à família, o juiz decide conforme as circunstâncias.']},
        {title:'Coação de terceiro e coação física',bullets:['Se o beneficiário sabia ou deveria saber da coação praticada por terceiro, o negócio é viciado e ele responde solidariamente com o coator.','Se o beneficiário não sabia nem deveria saber, o negócio subsiste e o terceiro responde pelos danos.','Na força física absoluta, que elimina completamente a manifestação, parte relevante da doutrina identifica inexistência por ausência de vontade.','A força absoluta não deve ser confundida com a coação moral, na qual existe declaração, embora viciada pelo temor.']}
      ],
      table:{headers:['Situação','Consequência'],rows:[['Coação moral relevante','Negócio anulável'],['Exercício normal de direito','Não configura coação'],['Simples temor reverencial','Não configura coação'],['Coação de terceiro conhecida pelo beneficiário','Anulação possível + responsabilidade solidária'],['Coação de terceiro desconhecida','Negócio subsiste; coator indeniza']]},
      example:'Alguém assina contrato após ameaça séria e imediata contra sua família. A vontade foi exteriorizada, mas sua formação foi contaminada por temor juridicamente relevante.',
      trap:'Receio de desagradar pai, chefe ou autoridade não basta. O simples temor reverencial é expressamente excluído pelo Código.',
      memorize:['Dano iminente e considerável.','Avaliação considera as características do coagido.','Temor reverencial não vicia.','Conhecimento do beneficiário define os efeitos da coação de terceiro.']
    },
    {
      id:'estado-perigo',
      title:'Estado de perigo',
      basis:'CC, art. 156',
      text:'Estado de perigo ocorre quando alguém, premido pela necessidade de salvar a si ou pessoa de sua família de grave dano conhecido pela outra parte, assume obrigação excessivamente onerosa.',
      sections:[
        {title:'Elementos caracterizadores',bullets:['Deve existir necessidade de evitar grave dano, no modelo legal centrado na proteção da pessoa.','O negócio precisa ser celebrado por causa da situação de perigo.','A obrigação assumida deve ser excessivamente onerosa.','A outra parte deve conhecer o grave dano e a situação que pressiona o declarante.','Quando a pessoa ameaçada não pertence à família, o juiz examina as circunstâncias do vínculo.']},
        {title:'Diferenças relevantes',bullets:['Na coação, a ameaça é provocada por alguém; no estado de perigo, a pressão decorre da necessidade de salvamento.','Na lesão, não se exige que a parte favorecida conheça a necessidade ou inexperiência; no estado de perigo, o conhecimento é elemento legal.','A anulação segue o prazo decadencial de quatro anos contado da realização do negócio.']}
      ],
      table:{headers:['Elemento','Estado de perigo'],rows:[['Situação','Necessidade de salvamento diante de grave dano'],['Ciência da contraparte','Obrigatória'],['Desequilíbrio','Obrigação excessivamente onerosa'],['Consequência','Anulabilidade']]},
      example:'Hospital condiciona procedimento urgente necessário à vida de familiar a obrigação manifestamente excessiva, conhecendo o desespero de quem contrata.',
      trap:'O conhecimento da situação pela parte favorecida integra o estado de perigo. Essa exigência não aparece da mesma forma na lesão.',
      memorize:['Necessidade de salvamento.','Grave dano.','Conhecimento da outra parte.','Obrigação excessivamente onerosa.']
    },
    {
      id:'lesao',
      title:'Lesão',
      basis:'CC, art. 157',
      text:'Lesão ocorre quando alguém, por premente necessidade ou inexperiência, assume prestação manifestamente desproporcional ao valor da prestação oposta. O defeito é aferido na formação do negócio.',
      sections:[
        {title:'Elementos subjetivo e objetivo',bullets:['Elemento subjetivo é a premente necessidade ou a inexperiência; as hipóteses são alternativas.','Elemento objetivo é a prestação manifestamente desproporcional à contraprestação.','A desproporção é examinada conforme os valores vigentes no momento da celebração.','Desequilíbrio surgido posteriormente pode configurar outro instituto, mas não transforma automaticamente o caso em lesão.']},
        {title:'Conhecimento e conservação',bullets:['O Código não exige que a parte favorecida conheça ou explore deliberadamente a necessidade ou inexperiência.','A anulação não será decretada se houver suplemento suficiente.','Também se preserva o negócio se a parte favorecida concordar em reduzir seu proveito.','A solução privilegia o reequilíbrio e a conservação em vez da destruição do negócio.']}
      ],
      table:{headers:['Critério','Lesão','Estado de perigo'],rows:[['Situação subjetiva','Necessidade ou inexperiência','Necessidade de salvar de grave dano'],['Ciência da favorecida','Não é requisito legal','É requisito legal'],['Elemento objetivo','Prestação manifestamente desproporcional','Obrigação excessivamente onerosa'],['Conservação','Suplemento ou redução do proveito','Solução depende do regime aplicável']]},
      example:'Pessoa inexperiente vende bem de alto valor por quantia irrisória sem compreender a desproporção existente na celebração.',
      trap:'A lesão é aferida no momento em que o negócio foi celebrado. Desproporção superveniente não é automaticamente lesão.',
      memorize:['Necessidade ou inexperiência.','Desproporção manifesta na celebração.','Não exige dolo de aproveitamento.','Suplemento ou redução pode preservar o negócio.']
    },
    {
      id:'fraude-contra-credores',
      title:'Fraude contra credores',
      basis:'CC, arts. 158 a 165; CPC, art. 792; STJ, Súmula 375',
      text:'Fraude contra credores é vício social relacionado à diminuição patrimonial do devedor insolvente, ou que se torna insolvente, com prejuízo de credores anteriores. Pelo Código Civil, os negócios fraudulentos são anuláveis.',
      sections:[
        {title:'Negócios gratuitos e onerosos',bullets:['Transmissão gratuita e remissão de dívida podem ser anuladas se o devedor já era insolvente ou se tornou insolvente pelo ato, ainda que ignorasse a situação.','Somente credores que já existiam ao tempo do ato podem pleitear a anulação; credor com garantia também pode agir se ela se tornar insuficiente.','Nos contratos onerosos, exige-se insolvência notória ou motivo para que o outro contratante a conhecesse.','Os requisitos não são idênticos nos atos gratuitos e onerosos; a prova não deve ser tratada de modo uniforme.']},
        {title:'Ação, proteção do acervo e presunções',bullets:['A demanda pode atingir o devedor, quem celebrou com ele e terceiros adquirentes de má-fé.','Adquirente que ainda não pagou pode depositar em juízo o preço corrente; se inferior, deve completar o valor real para conservar os bens.','Pagamento antecipado de dívida não vencida e garantia concedida pelo insolvente recebem as consequências dos arts. 162 e 163.','Negócios ordinários indispensáveis à atividade ou subsistência do devedor e da família presumem-se de boa-fé.','A vantagem da anulação retorna ao acervo sujeito ao concurso de credores, não exclusivamente ao autor.']},
        {title:'Fraude contra credores e fraude à execução',bullets:['Fraude contra credores é defeito material do negócio e gera anulabilidade civil.','Fraude à execução ocorre nas hipóteses processuais do art. 792 do CPC e produz ineficácia perante a execução.','Nas execuções civis submetidas à regra geral, a Súmula 375 do STJ exige registro da penhora ou prova de má-fé do terceiro, sem prejuízo de regimes especiais.']}
      ],
      table:{headers:['Instituto','Regime','Efeito central'],rows:[['Fraude contra credores','CC, arts. 158 a 165','Anulabilidade'],['Fraude à execução','CPC, art. 792','Ineficácia perante a execução'],['Ato gratuito do insolvente','Ciência do adquirente não integra a mesma regra do oneroso','Pode ser anulado nas condições do art. 158'],['Contrato oneroso','Insolvência notória ou cognoscível','Pode ser anulado nas condições do art. 159']]},
      example:'Devedor já insolvente doa seu único imóvel depois de contrair a dívida. O credor anterior poderá buscar a anulação, e a vantagem retornará ao acervo destinado aos credores.',
      trap:'Anulado o negócio fraudulento, o resultado não é entregue somente ao credor que ajuizou a ação; reverte em proveito do acervo sujeito ao concurso.',
      memorize:['Crédito deve ser anterior ao ato.','Gratuito e oneroso têm requisitos diferentes.','Fraude contra credores é anulável.','Fraude à execução é ineficaz perante a execução.']
    },
    {
      id:'teoria-invalidade',
      title:'Teoria das invalidades: nulidade e anulabilidade',
      basis:'CC, arts. 166 a 184',
      text:'Invalidade é o defeito que atinge negócio juridicamente existente. O Código distingue nulidade, ligada predominantemente à proteção da ordem jurídica, e anulabilidade, voltada à tutela de interesses particulares.',
      sections:[
        {title:'Nulidade',bullets:['Pode ser alegada por qualquer interessado e pelo Ministério Público quando lhe couber intervir.','Deve ser pronunciada de ofício pelo juiz quando conhecer do negócio ou de seus efeitos e encontrar a nulidade provada.','Não pode ser suprida pelo juiz, não admite confirmação e não convalesce pelo decurso do tempo.','A impossibilidade de convalescimento não significa que toda consequência patrimonial ligada ao negócio seja necessariamente imprescritível.']},
        {title:'Anulabilidade',bullets:['Não tem efeito invalidante antes de julgada e não pode ser pronunciada de ofício.','Somente os interessados podem alegá-la e, em regra, aproveita exclusivamente a quem a invocou.','Admite confirmação, salvo direito de terceiro, e está sujeita a prazos decadenciais.','Depois da anulação, o art. 182 determina a restituição ao estado anterior ou indenização equivalente.']}
      ],
      table:{headers:['Critério','Negócio nulo','Negócio anulável'],rows:[['Alegação','Interessado ou MP, quando couber','Somente interessados'],['Reconhecimento de ofício','Sim, se provado','Não'],['Confirmação','Não admite','Admite, salvo direito de terceiro'],['Tempo','Não convalesce','Submete-se à decadência'],['Antes da sentença','Nulidade já integra o negócio','Produz efeitos até a anulação']]},
      example:'Negócio praticado por relativamente incapaz sem assistência produz efeitos enquanto não for anulado; negócio com objeto ilícito enquadra-se em hipótese de nulidade.',
      trap:'Não memorize simplesmente que a anulabilidade possui efeito “sempre ex nunc”. Antes da sentença o negócio produz efeitos, mas o art. 182 impõe restituição após a anulação.',
      memorize:['Nulidade: ordem pública, ofício e sem confirmação.','Anulabilidade: interesse particular, decadência e confirmação.','Ambas pressupõem negócio existente.','Restituição ao estado anterior segue o art. 182.']
    },
    {
      id:'nulidade-simulacao-conversao',
      title:'Nulidade, simulação e conversão substancial',
      basis:'CC, arts. 166 a 170',
      text:'O art. 166 reúne as hipóteses gerais de nulidade, enquanto o art. 167 disciplina especificamente a simulação. Mesmo diante de nulidade, o princípio da conservação pode permitir o aproveitamento de negócio diverso por conversão substancial.',
      sections:[
        {title:'Hipóteses de nulidade',bullets:['É nulo o negócio celebrado por pessoa absolutamente incapaz.','Também é nulo quando o objeto for ilícito, impossível ou indeterminável, ou o motivo determinante comum às partes for ilícito.','A falta da forma prescrita ou de solenidade essencial gera nulidade.','É nulo o negócio destinado a fraudar lei imperativa, bem como aquele que a lei declarar nulo ou proibir sem estabelecer outra sanção.','Violação genérica da boa-fé não deve ser transformada automaticamente em nulidade sem identificação do fundamento legal.']},
        {title:'Simulação',bullets:['O negócio simulado é nulo porque existe divergência deliberada entre a aparência e a vontade real.','Há simulação absoluta quando negócio algum é realmente desejado; na relativa, o negócio aparente encobre outro.','Pode haver interposição fictícia de pessoa, cláusula não verdadeira ou instrumento antedatado ou pós-datado.','O negócio dissimulado subsiste se preencher seus próprios requisitos de substância e forma.','Direitos de terceiros de boa-fé perante os contraentes são preservados.']},
        {title:'Conversão substancial',bullets:['Negócio nulo pode subsistir como outro se contiver os requisitos deste.','A finalidade precisa permitir concluir que as partes teriam desejado o negócio válido se previssem a nulidade.','Conversão não é confirmação do nulo: não se sana o negócio original, mas aproveita-se sua estrutura para negócio diverso e válido.']}
      ],
      table:{headers:['Figura','Negócio aparente ou original','Possível aproveitamento'],rows:[['Simulação absoluta','Aparência sem negócio real','Negócio aparente é nulo'],['Simulação relativa','Negócio aparente encobre outro','Dissimulado subsiste se válido'],['Conversão substancial','Negócio original é nulo','Outro negócio subsiste se presentes os requisitos'],['Confirmação','Não se aplica ao nulo','Reservada ao anulável']]},
      example:'Partes usam negócio aparente para encobrir doação. A aparência simulada é nula; a doação somente subsistirá se atender aos requisitos materiais e formais que lhe são próprios.',
      trap:'Negócio simulado é nulo, mas o dissimulado não é automaticamente inválido. Ele pode subsistir se válido na substância e na forma.',
      memorize:['Art. 166: hipóteses gerais de nulidade.','Simulado é nulo.','Dissimulado pode subsistir.','Conversão aproveita o nulo como outro negócio; não o confirma.']
    },
    {
      id:'anulabilidade-conservacao',
      title:'Anulabilidade, confirmação e conservação',
      basis:'CC, arts. 171 a 184',
      text:'São anuláveis os negócios nos casos expressamente previstos e, em regra geral, por incapacidade relativa ou por erro, dolo, coação, estado de perigo, lesão e fraude contra credores. O sistema permite confirmar, integrar e preservar o que puder ser validamente aproveitado.',
      sections:[
        {title:'Confirmação e autorização posterior',bullets:['Negócio anulável pode ser confirmado pelas partes, salvo direito de terceiro.','Confirmação expressa deve conter a substância do negócio e a vontade de mantê-lo.','Confirmação expressa é dispensada quando o devedor, ciente do vício, cumpre voluntariamente parte do negócio.','Confirmação ou execução voluntária extingue as ações e exceções disponíveis contra o negócio.','Quando o defeito for falta de autorização de terceiro, a autorização posterior valida o ato.']},
        {title:'Prazos decadenciais',bullets:['Coação: quatro anos contados do dia em que cessar.','Erro, dolo, fraude contra credores, estado de perigo e lesão: quatro anos da realização do negócio.','Atos de incapazes: quatro anos da cessação da incapacidade.','Quando a lei declarar o ato anulável sem fixar prazo: dois anos da conclusão.','Prazos especiais, como os 180 dias do art. 119, prevalecem em sua hipótese própria.']},
        {title:'Efeitos e conservação',bullets:['Anulado o negócio, as partes retornam ao estado anterior; se impossível, são indenizadas pelo equivalente.','Invalidade do instrumento não atinge o negócio quando ele puder ser provado por outro meio.','Invalidade parcial não prejudica a parte válida quando ela for separável e respeitar a intenção das partes.','Invalidade da obrigação principal implica a das acessórias; invalidade da acessória não induz automaticamente a da principal.','Confirmação do anulável, conversão do nulo e separação da parte válida concretizam o princípio da conservação.']}
      ],
      table:{headers:['Hipótese','Prazo','Início'],rows:[['Coação','4 anos','Cessação da coação'],['Erro, dolo, fraude, perigo ou lesão','4 anos','Realização do negócio'],['Ato de incapaz','4 anos','Cessação da incapacidade'],['Anulabilidade sem prazo próprio','2 anos','Conclusão do ato'],['Conflito de interesses do representante','180 dias','Conclusão ou cessação da incapacidade']]},
      example:'Negócio anulável por falta de autorização de terceiro pode ser preservado se a autorização for concedida posteriormente, desde que não prejudique direito de terceiro.',
      trap:'O prazo de quatro anos não começa no mesmo momento em todas as hipóteses. Na coação conta-se da cessação; nos demais vícios indicados, da realização do negócio.',
      memorize:['Anulável pode ser confirmado.','Confirmação não pode prejudicar terceiro.','Art. 178: quatro anos com marcos diferentes.','Art. 179: dois anos quando a lei não fixar prazo.','Conservação preserva a parte juridicamente aproveitável.']
    }
  ],
  'civ-prescricao-prova':[
    {
      id:'tempo-estabilizacao-relacoes',
      title:'Tempo, segurança jurídica e estabilização das relações',
      basis:'CC, arts. 189 a 211',
      text:'O decurso do tempo produz efeitos jurídicos porque o ordenamento não permite que todas as situações permaneçam indefinidamente abertas. Prescrição e decadência estabilizam relações, mas atuam sobre posições jurídicas diferentes: a primeira se relaciona à pretensão nascida da violação de um direito; a segunda, em regra, limita o exercício de um direito potestativo.',
      sections:[
        {title:'Função dos limites temporais',bullets:['A passagem do tempo, somada à inércia do titular, pode impedir a exigência coercitiva de uma prestação ou extinguir a possibilidade de produzir determinada mudança jurídica.','O fundamento não é premiar quem descumpriu um dever, mas proteger segurança, previsibilidade e estabilidade das relações.','Antes de procurar o prazo, é indispensável identificar a natureza da posição jurídica e o tipo de tutela pretendida.']},
        {title:'Roteiro de identificação',bullets:['Primeiro: houve violação de um direito e nasceu a possibilidade de exigir uma prestação? A tendência é prescricional.','Segundo: a pessoa possui poder de criar, modificar ou extinguir uma relação por manifestação própria? A tendência é decadencial.','Terceiro: a lei prevê prazo específico? Só depois dessa classificação devem ser consultados os arts. 205 e 206 ou a regra decadencial própria.']}
      ],
      table:{headers:['Situação','Posição jurídica','Efeito temporal provável'],rows:[['Prestação não cumprida','Pretensão de exigir o cumprimento','Prescrição'],['Poder de anular ou modificar relação','Direito potestativo','Decadência'],['Estado ou direito sem prazo extintivo legal','Tutela declaratória ou situação imprescritível','Não se presume prazo por analogia']]},
      example:'Um credor que não recebe uma dívida possui pretensão contra o devedor. Já quem sofreu dolo em um negócio possui o poder de pedir sua anulação no prazo legal. Embora ambos procurem o Judiciário, o primeiro caso é normalmente prescricional e o segundo, decadencial.',
      trap:'Não basta observar se existe uma ação judicial. A classificação depende da posição material protegida: pretensão ligada a prestação aponta para prescrição; direito potestativo sujeito a prazo aponta para decadência.',
      memorize:['Tempo + inércia + previsão jurídica produzem estabilização.','Pretensão liga-se à prescrição.','Direito potestativo liga-se à decadência.','Classifique o direito antes de decorar o prazo.']
    },
    {
      id:'pretensao-acao-direito-potestativo',
      title:'Direito subjetivo, pretensão, ação e direito potestativo',
      basis:'CC, arts. 189 e 882; CPC, art. 17',
      text:'Direito subjetivo, pretensão e ação não são sinônimos. O direito subjetivo assegura uma vantagem protegida; quando um dever correspondente é violado, surge a pretensão de exigir uma prestação. A ação processual é o direito de provocar a jurisdição. O direito potestativo, por sua vez, permite ao titular produzir alteração na esfera jurídica de outra pessoa, sem depender de uma prestação desta.',
      sections:[
        {title:'Direito, pretensão e ação',bullets:['O art. 189 adota a ideia de que a pretensão nasce com a violação do direito.','A prescrição atinge a pretensão nos prazos legais; não se deve repetir a fórmula imprecisa de que extingue o direito de ação.','Mesmo prescrita a pretensão, pode subsistir obrigação natural: se o devedor paga voluntariamente dívida prescrita, em regra não pode exigir restituição apenas por esse fundamento.']},
        {title:'Direito potestativo',bullets:['Seu exercício sujeita a outra parte a um efeito jurídico, como ocorre no pedido de anulação de negócio viciado.','Não há dever de prestação correspondente antes do exercício; existe estado de sujeição.','Quando a lei fixa prazo para o exercício de direito potestativo, a consequência normal é decadência.']}
      ],
      table:{headers:['Categoria','Conteúdo','Relação com o tempo'],rows:[['Direito subjetivo','Vantagem protegida pelo ordenamento','Pode originar pretensão se violado'],['Pretensão','Poder de exigir prestação','Sujeita à prescrição'],['Ação processual','Direito de provocar a jurisdição','Não se confunde com a pretensão material'],['Direito potestativo','Poder de alterar uma relação jurídica','Pode sujeitar-se à decadência']]},
      example:'Se o comprador não paga o preço, o vendedor tem pretensão de cobrança. Se uma parte foi coagida a contratar, possui direito potestativo de obter a anulação, sujeito ao prazo decadencial.',
      trap:'A expressão “prescrição da ação” é frequente, mas a literalidade atual do Código Civil afirma que a prescrição extingue a pretensão. A FCC pode explorar exatamente essa troca terminológica.',
      memorize:['Direito violado → nasce a pretensão.','Pretensão → exigir prestação.','Ação → provocar o Judiciário.','Direito potestativo → modificar situação jurídica.']
    },
    {
      id:'actio-nata',
      title:'Nascimento da pretensão e teoria da actio nata',
      basis:'CC, art. 189; jurisprudência do STJ',
      text:'A teoria da actio nata procura determinar o momento em que começa a correr a prescrição. Pela leitura objetiva do art. 189, o termo inicial coincide com a violação do direito. Em situações específicas, a jurisprudência utiliza orientação subjetiva, considerando a ciência inequívoca da lesão e de sua autoria quando o titular não podia exercer utilmente a pretensão antes disso.',
      sections:[
        {title:'Regra objetiva',bullets:['Violado o direito, surge a pretensão e começa o prazo correspondente.','Não é necessário aguardar que o titular decida agir nem que reúna toda a prova disponível.','Vencida uma dívida e não paga, a pretensão normalmente nasce no vencimento.']},
        {title:'Dimensão subjetiva',bullets:['É aplicada de maneira excepcional quando a lesão ou sua autoria não eram cognoscíveis no momento do fato.','Exige ciência efetiva ou possível dos elementos essenciais para o exercício da pretensão, não mero conhecimento abstrato de risco.','O marco inicial depende da natureza da relação e da orientação jurisprudencial específica; não se transforma toda prescrição em prazo contado da conveniência do interessado.']}
      ],
      table:{headers:['Teoria','Marco inicial','Aplicação'],rows:[['Actio nata objetiva','Violação do direito','Regra extraída do art. 189'],['Actio nata subjetiva','Ciência inequívoca da lesão e de sua autoria','Situações excepcionais reconhecidas pela jurisprudência']]},
      example:'Dívida vencida em 10 de março e não paga gera, em regra, pretensão nessa data. Diferentemente, um dano oculto cuja causa somente pôde ser descoberta depois pode exigir análise da actio nata subjetiva.',
      trap:'A ciência subjetiva não é uma autorização geral para o titular escolher quando começa o prazo. A regra continua sendo o nascimento da pretensão com a violação do direito.',
      memorize:['Actio nata responde: quando nasceu a pretensão?','Regra: violação do direito.','Exceção jurisprudencial: ciência inequívoca quando antes não era possível agir.','A natureza da pretensão define o marco aplicável.']
    },
    {
      id:'prescricao-conceito-efeitos',
      title:'Prescrição: conceito, objeto e efeitos',
      basis:'CC, arts. 189, 205 e 206',
      text:'Prescrição é o efeito jurídico atribuído ao transcurso do prazo legal sobre uma pretensão não exercida. O Código diz que a pretensão se extingue pela prescrição. O direito material que lhe deu origem não é apagado como se jamais tivesse existido, razão pela qual podem subsistir efeitos como a obrigação natural e o pagamento voluntário válido.',
      sections:[
        {title:'Elementos essenciais',bullets:['Existência de direito subjetivo a uma prestação.','Violação desse direito e nascimento da pretensão.','Inércia do titular durante o prazo estabelecido em lei.','Ausência de causa que impeça, suspenda ou interrompa a contagem.']},
        {title:'Consequências',bullets:['Reconhecida a prescrição, a pretensão não pode ser acolhida coercitivamente.','A decisão que reconhece prescrição resolve o mérito no processo civil.','A exceção relacionada à pretensão prescreve no mesmo prazo, conforme a regra específica do art. 190.']}
      ],
      table:{headers:['Elemento','Pergunta de controle'],rows:[['Violação','O dever jurídico foi descumprido?'],['Pretensão','Já é possível exigir a prestação?'],['Prazo','Qual prazo legal corresponde à pretensão?'],['Contagem','Existe impedimento, suspensão ou interrupção?']]},
      example:'Uma dívida líquida documentada não cobrada dentro do prazo pode ter a pretensão atingida pela prescrição. Se o devedor, sem erro ou coação, paga voluntariamente depois, o pagamento não se torna automaticamente indevido.',
      trap:'Prescrição não é punição processual por demora dentro de um processo e não se confunde com preclusão. Também não se deve afirmar que ela elimina a personalidade, o direito de ação ou o fato histórico que originou a obrigação.',
      memorize:['Objeto da prescrição: pretensão.','Pressuposto: direito violado.','Prazo: somente o fixado em lei.','Reconhecimento processual resolve o mérito.']
    },
    {
      id:'excecao-renuncia-prazos',
      title:'Exceção, renúncia e inalterabilidade dos prazos',
      basis:'CC, arts. 190 a 192',
      text:'A exceção prescreve no mesmo prazo da pretensão correspondente. A prescrição consumada pode ser renunciada expressa ou tacitamente, desde que não haja prejuízo de terceiro. Antes da consumação, a renúncia é inválida. Os prazos prescricionais são legais e não podem ser ampliados ou reduzidos por acordo.',
      sections:[
        {title:'Renúncia à prescrição',bullets:['Só é válida depois de consumado o prazo.','Pode ser expressa, mediante declaração direta, ou tácita, quando decorre de comportamento incompatível com a intenção de aproveitar a prescrição.','Não pode prejudicar terceiros, como outros credores interessados na preservação do patrimônio do devedor.']},
        {title:'Autonomia privada limitada',bullets:['As partes não podem criar prazo prescricional diferente do legal.','Cláusula que encurta ou alonga o prazo não substitui os arts. 205 e 206.','Acordos sobre cumprimento, vencimento ou reconhecimento da dívida podem produzir outros efeitos, mas não alteram diretamente o prazo legal.']}
      ],
      table:{headers:['Tema','Regra'],rows:[['Exceção','Prescreve no mesmo prazo da pretensão'],['Renúncia antecipada','Não é admitida'],['Renúncia após consumação','Expressa ou tácita, sem prejuízo de terceiro'],['Alteração contratual do prazo','Proibida']]},
      example:'Depois de consumada a prescrição, o devedor reconhece por escrito a obrigação e promete pagá-la. O comportamento pode representar renúncia tácita, desde que não prejudique terceiro.',
      trap:'Interrupção ocorre antes de concluído o prazo e faz a contagem recomeçar. Renúncia pressupõe prescrição já consumada. Trocar os dois institutos muda completamente o momento e o efeito.',
      memorize:['Art. 190: exceção acompanha a pretensão.','Renúncia somente depois de consumada.','Renúncia: expressa ou tácita.','Prazo prescricional não se altera por acordo.']
    },
    {
      id:'alegacao-oficio-contraditorio',
      title:'Alegação, reconhecimento de ofício e contraditório',
      basis:'CC, art. 193; CPC, art. 487, II e parágrafo único',
      text:'A parte a quem aproveita pode alegar a prescrição em qualquer grau de jurisdição. O CPC também permite que o juiz decida de ofício sobre prescrição ou decadência, mas, em regra, exige que as partes tenham oportunidade prévia de se manifestar. O reconhecimento produz resolução de mérito.',
      sections:[
        {title:'Atuação da parte e do juiz',bullets:['A alegação cabe à parte beneficiada pela prescrição.','A matéria pode ser examinada de ofício pelo magistrado conforme o CPC.','O contraditório prévio evita decisão-surpresa e permite discutir termo inicial, prazo e causas modificadoras da contagem.']},
        {title:'Limites processuais',bullets:['“Qualquer grau de jurisdição” não autoriza ignorar limites próprios de recursos extraordinários, necessidade de base fática ou coisa julgada.','Antes de reconhecer, o julgador deve verificar se a decisão de mérito será realmente favorável à parte beneficiada.','A prescrição não se confunde com abandono processual nem com prescrição intercorrente.']}
      ],
      table:{headers:['Questão','Regra'],rows:[['Quem pode alegar?','Parte a quem a prescrição aproveita'],['O juiz pode reconhecer?','Sim, de ofício ou a requerimento'],['Há contraditório?','Em regra, manifestação prévia das partes'],['Natureza da decisão','Resolução do mérito']]},
      example:'Ao perceber possível prescrição, o juiz abre vista às partes. O autor demonstra que houve interrupção por reconhecimento inequívoco da dívida, fato que precisa ser analisado antes da decisão.',
      trap:'A possibilidade de reconhecimento de ofício não dispensa automaticamente o contraditório. A FCC pode apresentar como correta uma decisão-surpresa fundada apenas na constatação do prazo.',
      memorize:['Art. 193: alegação pela parte beneficiada.','CPC: reconhecimento de ofício é possível.','Regra: ouvir as partes antes.','Prescrição reconhecida → mérito resolvido.']
    },
    {
      id:'incapazes-representantes-sucessores',
      title:'Incapazes, pessoas jurídicas, representantes e sucessores',
      basis:'CC, arts. 195, 196 e 198, I',
      text:'O Código protege o absolutamente incapaz impedindo que a prescrição corra contra ele. Já os relativamente incapazes e as pessoas jurídicas possuem ação contra assistentes ou representantes legais que tenham dado causa à prescrição ou deixado de alegá-la oportunamente. A sucessão, por si só, não reinicia a contagem.',
      sections:[
        {title:'Proteção e responsabilidade',bullets:['Não corre prescrição contra os absolutamente incapazes do art. 3º: atualmente, menores de 16 anos.','O art. 195 menciona relativamente incapazes e pessoas jurídicas, assegurando ação regressiva contra assistente ou representante faltoso.','A regra busca impedir que a negligência de quem deveria proteger o interesse fique sem consequência.']},
        {title:'Sucessão',bullets:['A prescrição iniciada contra uma pessoa continua contra seu sucessor.','O prazo não volta ao início apenas porque houve morte, cessão ou outra sucessão na posição jurídica.','Eventual nova causa legal de impedimento ou suspensão deve ser examinada separadamente.']}
      ],
      table:{headers:['Situação','Efeito'],rows:[['Menor de 16 anos','Prescrição não corre contra ele'],['Relativamente incapaz prejudicado pelo assistente','Pode agir contra o responsável'],['Pessoa jurídica prejudicada pelo representante','Pode agir contra o responsável'],['Sucessão durante a contagem','Prazo continua, em regra']]},
      example:'Um crédito é transmitido por sucessão quando parte do prazo já transcorreu. O sucessor recebe a posição no estado em que se encontra; a contagem não recomeça automaticamente do zero.',
      trap:'A proteção direta do art. 198, I, alcança os absolutamente incapazes do art. 3º, não todo relativamente incapaz. Estes aparecem no art. 195 em relação à responsabilidade do assistente.',
      memorize:['Absolutamente incapaz: prescrição não corre contra.','Relativamente incapaz: ação contra assistente faltoso.','Pessoa jurídica: ação contra representante faltoso.','Sucessor recebe o prazo em andamento.']
    },
    {
      id:'impedimento-suspensao',
      title:'Impedimento e suspensão da prescrição',
      basis:'CC, arts. 197 a 201',
      text:'Impedimento e suspensão paralisam a fluência do prazo pelas mesmas causas legais, mas atuam em momentos diferentes. No impedimento, a causa já existe quando a pretensão nasce e a contagem nem começa. Na suspensão, a causa surge depois de iniciado o prazo; conserva-se o período já transcorrido e, cessada a causa, corre apenas o saldo.',
      sections:[
        {title:'Impedimento',bullets:['A causa protetiva está presente antes do termo inicial.','O relógio prescricional permanece em zero enquanto durar a situação.','Encerrada a causa, inicia-se a contagem integral do prazo.']},
        {title:'Suspensão',bullets:['A prescrição já começou quando sobrevém a causa legal.','O tempo anterior não é apagado.','Cessada a causa, a contagem prossegue pelo período restante, e não por prazo integral novo.']}
      ],
      table:{headers:['Instituto','Quando atua','Efeito sobre o tempo'],rows:[['Impedimento','Antes do início da contagem','Prazo ainda não começa'],['Suspensão','Depois de iniciado o prazo','Pausa e continua pelo saldo'],['Interrupção','Durante a contagem, por causa legal','Apaga o tempo anterior e reinicia']]},
      example:'Se uma causa suspensiva surge quando já passaram dois dos cinco anos, a contagem para. Quando a causa termina, restam três anos; não se inicia novo prazo de cinco.',
      trap:'Suspensão não zera o prazo. Quem zera o período anterior e provoca recomeço integral é a interrupção.',
      memorize:['Impedimento: não começou.','Suspensão: começou, parou e continua.','Interrupção: começou, zerou e recomeça.','Impedimento e suspensão compartilham as causas legais.']
    },
    {
      id:'causas-familia-incapacidade-servico',
      title:'Causas pessoais: família, incapacidade e serviço público',
      basis:'CC, arts. 197 e 198',
      text:'Os arts. 197 e 198 impedem ou suspendem a prescrição em relações de especial confiança familiar e em situações nas quais o titular enfrenta obstáculo juridicamente relevante. As hipóteses são legais e devem ser lidas com precisão, sem ampliações automáticas.',
      sections:[
        {title:'Relações protegidas pelo art. 197',bullets:['Entre cônjuges, durante a constância da sociedade conjugal.','Entre ascendentes e descendentes, durante o poder familiar.','Entre tutelados ou curatelados e seus tutores ou curadores, enquanto durar tutela ou curatela.']},
        {title:'Pessoas protegidas pelo art. 198',bullets:['Contra os absolutamente incapazes referidos no art. 3º.','Contra ausentes do País em serviço público da União, dos Estados ou dos Municípios.','Contra pessoas servindo nas Forças Armadas em tempo de guerra.']}
      ],
      table:{headers:['Hipótese','Duração da proteção'],rows:[['Cônjuges','Constância da sociedade conjugal'],['Ascendente e descendente','Durante o poder familiar'],['Tutor/curador e protegido','Durante tutela ou curatela'],['Menor de 16 anos','Enquanto absolutamente incapaz'],['Serviço público fora do País','Enquanto presente a situação legal'],['Forças Armadas','Serviço em tempo de guerra']]},
      example:'Enquanto um filho menor está submetido ao poder familiar, não corre prescrição entre ele e o genitor abrangido pela regra. A mera relação de parentesco, depois de encerrado o poder familiar, não mantém indefinidamente a proteção.',
      trap:'A lei não diz que a prescrição nunca corre entre ascendentes e descendentes. A paralisação está vinculada ao período do poder familiar.',
      memorize:['197: cônjuges; pais e filhos; tutela e curatela.','198: menor de 16; serviço público fora do País; Forças Armadas em guerra.','A duração da causa define quando o relógio volta a correr.']
    },
    {
      id:'condicao-termo-eviccao-criminal',
      title:'Condição, termo, evicção e fato apurado no juízo criminal',
      basis:'CC, arts. 199 e 200',
      text:'A prescrição não corre quando a pretensão ainda não pode ser utilmente exercida em razão de condição suspensiva, falta de vencimento ou ação de evicção pendente. Também fica paralisada quando a ação civil se origina de fato que precisa ser apurado no juízo criminal, até a sentença penal definitiva.',
      sections:[
        {title:'Inexigibilidade temporária',bullets:['Pendente condição suspensiva, ainda não se produziu o efeito que tornaria exigível a prestação.','Antes do vencimento, o devedor não está em mora apenas pelo decurso do tempo e a pretensão de cobrança ainda não nasceu.','Pendente ação de evicção, a lei impede a fluência na relação abrangida.']},
        {title:'Relação entre juízo civil e criminal',bullets:['Se o fato originador deve ser apurado criminalmente, a prescrição civil não corre antes da sentença penal definitiva.','A regra evita decisões incompatíveis sobre a existência e a autoria do fato.','É necessário vínculo entre a pretensão civil e o fato submetido à apuração criminal; não basta a existência de investigação sem pertinência.']}
      ],
      table:{headers:['Causa','Motivo da paralisação'],rows:[['Condição suspensiva pendente','Efeito jurídico ainda não exigível'],['Prazo não vencido','Prestação ainda inexigível'],['Ação de evicção pendente','Dependência da solução legal'],['Fato a apurar criminalmente','Espera pela sentença penal definitiva']]},
      example:'Uma indenização civil depende da apuração definitiva de fato criminoso que originou a ação. Na hipótese do art. 200, o prazo não corre antes da sentença penal definitiva.',
      trap:'O art. 200 não exige apenas que exista boletim de ocorrência. A ação civil deve originar-se de fato que deva ser efetivamente apurado no juízo criminal.',
      memorize:['Art. 199: condição, vencimento e evicção.','Art. 200: fato dependente de apuração criminal.','Sem exigibilidade útil, não corre prescrição.']
    },
    {
      id:'suspensao-solidariedade',
      title:'Suspensão e credores solidários',
      basis:'CC, art. 201',
      text:'A suspensão da prescrição em favor de um credor solidário não se comunica automaticamente aos demais. Ela somente beneficia os outros credores quando a obrigação for indivisível. A regra combina os efeitos pessoais da causa suspensiva com a impossibilidade material ou jurídica de fracionar a prestação.',
      sections:[
        {title:'Regra',bullets:['Causa pessoal de suspensão protege o credor que se encontra na situação legal.','Os demais credores solidários continuam submetidos à contagem.','Solidariedade, isoladamente, não transmite o benefício.']},
        {title:'Exceção da indivisibilidade',bullets:['Se a prestação não puder ser dividida, a suspensão em favor de um credor aproveita aos demais.','Solidariedade diz respeito ao vínculo entre sujeitos; indivisibilidade decorre do objeto da prestação.','Os institutos podem coexistir, mas não são sinônimos.']}
      ],
      table:{headers:['Situação','Efeito'],rows:[['Credores solidários + obrigação divisível','Suspensão beneficia apenas o credor protegido'],['Credores solidários + obrigação indivisível','Suspensão aproveita aos demais']]},
      example:'Três credores solidários possuem crédito em dinheiro, normalmente divisível. Uma causa pessoal que suspenda a prescrição para um deles não paralisa automaticamente o prazo dos outros.',
      trap:'A FCC pode afirmar que a solidariedade sempre comunica a suspensão. O art. 201 exige também indivisibilidade da obrigação.',
      memorize:['Suspensão tem efeito pessoal.','Solidariedade, sozinha, não comunica.','Comunicação aos demais somente se a obrigação for indivisível.']
    },
    {
      id:'interrupcao-hipoteses',
      title:'Hipóteses de interrupção da prescrição',
      basis:'CC, art. 202; CPC, art. 240',
      text:'A interrupção elimina o tempo prescricional já transcorrido e provoca nova contagem. O art. 202 reúne atos judiciais e extrajudiciais capazes de demonstrar exercício da pretensão, constituição em mora ou reconhecimento do direito pelo devedor. Em regra, a interrupção somente pode ocorrer uma vez.',
      sections:[
        {title:'Atos judiciais e formais',bullets:['Despacho do juiz, ainda que incompetente, que ordena a citação, desde que o interessado a promova conforme a lei processual.','Protesto judicial nas mesmas condições e protesto cambial.','Apresentação de título de crédito em inventário ou concurso de credores.','Qualquer ato judicial que constitua o devedor em mora.']},
        {title:'Reconhecimento pelo devedor',bullets:['Qualquer ato inequívoco, mesmo extrajudicial, que importe reconhecimento do direito.','O comportamento deve revelar de modo claro que o devedor reconhece a posição do credor.','Pedido de prazo, pagamento parcial ou confissão de dívida podem ser relevantes conforme o contexto.']}
      ],
      table:{headers:['Grupo','Hipóteses'],rows:[['Judicial','Despacho citatório, protesto judicial, ato de constituição em mora'],['Cambial ou concursal','Protesto cambial e apresentação do título em inventário/concurso'],['Extrajudicial','Reconhecimento inequívoco do direito pelo devedor']]},
      example:'Antes do fim do prazo, o devedor envia mensagem reconhecendo expressamente a dívida e solicita parcelamento. Se inequívoco, o ato pode interromper a prescrição.',
      trap:'Não é apenas a propositura abstrata da ação que aparece na literalidade do art. 202, I. A regra menciona o despacho que ordena a citação, em diálogo com os efeitos processuais do art. 240 do CPC.',
      memorize:['Interrupção: apaga o tempo anterior.','Regra: somente uma vez.','Pode resultar de ato judicial ou extrajudicial.','Reconhecimento do devedor deve ser inequívoco.']
    },
    {
      id:'interrupcao-reinicio',
      title:'Reinício do prazo depois da interrupção',
      basis:'CC, art. 202, parágrafo único',
      text:'Interrompida a prescrição, a contagem recomeça da data do ato interruptivo ou do último ato do processo destinado a interrompê-la. Diferentemente da suspensão, não se aproveita o período anterior. A definição do marco concreto depende da hipótese interruptiva utilizada.',
      sections:[
        {title:'Efeito temporal',bullets:['O período anteriormente decorrido é inutilizado para a contagem.','Inicia-se prazo integral da mesma duração prevista para a pretensão.','A interrupção não cria prazo material diferente; apenas reinicia o prazo legal aplicável.']},
        {title:'Marco do recomeço',bullets:['Em ato isolado, conta-se da data do ato interruptivo.','Quando houver processo utilizado para interromper, considera-se o último ato processual relevante para esse efeito.','É preciso distinguir o momento da interrupção do momento em que o prazo volta a fluir.']}
      ],
      table:{headers:['Evento','Tempo anterior','Contagem posterior'],rows:[['Suspensão','É preservado','Continua pelo saldo'],['Interrupção','É descartado','Recomeça integralmente']]},
      example:'De um prazo de cinco anos, três já transcorreram quando ocorre interrupção válida. Cessado o efeito interruptivo, começa nova contagem integral de cinco anos, não apenas dos dois restantes.',
      trap:'Interrupção não significa que a pretensão se torna imprescritível. Depois do ato, o prazo volta a correr conforme a regra legal.',
      memorize:['Suspensão guarda o passado.','Interrupção apaga o passado.','Recomeço: ato interruptivo ou último ato processual destinado a interromper.','O novo período tem a duração legal da pretensão.']
    },
    {
      id:'interrupcao-sujeitos-fiador',
      title:'Interrupção entre credores, devedores, herdeiros e fiador',
      basis:'CC, arts. 203 e 204',
      text:'Qualquer interessado pode promover a interrupção, mas seus efeitos entre vários sujeitos dependem da natureza do vínculo. A regra é pessoal: ato de um credor não beneficia os demais, e ato contra um coobrigado não prejudica os outros. Solidariedade, indivisibilidade e fiança geram exceções expressas.',
      sections:[
        {title:'Regra e solidariedade',bullets:['Interrupção por um credor comum não aproveita aos outros.','Interrupção contra um codevedor comum ou seu herdeiro não prejudica os demais coobrigados.','Se houver solidariedade ativa, o ato de um credor beneficia os outros.','Se houver solidariedade passiva, o ato contra um devedor envolve os demais e seus herdeiros, conforme a lei.']},
        {title:'Herdeiros, indivisibilidade e fiança',bullets:['Ato contra um herdeiro de devedor solidário não prejudica os outros herdeiros ou devedores, salvo obrigação e direito indivisíveis.','A interrupção contra o devedor principal prejudica o fiador.','O inverso não está previsto: ato praticado apenas contra o fiador não interrompe automaticamente contra o principal.']}
      ],
      table:{headers:['Ato interruptivo','Comunicação do efeito'],rows:[['Por credor comum','Não beneficia outros credores'],['Por credor solidário','Beneficia demais credores solidários'],['Contra codevedor comum','Não atinge os demais'],['Contra devedor solidário','Envolve os demais e seus herdeiros nos termos legais'],['Contra devedor principal','Prejudica o fiador']]},
      example:'O credor interrompe a prescrição contra o devedor principal. Como a fiança é acessória, o efeito alcança o fiador. Se o ato fosse dirigido somente ao fiador, não haveria a mesma comunicação automática ao principal.',
      trap:'Solidariedade e indivisibilidade alteram efeitos em situações específicas. Não aplique mecanicamente a regra de comunicação a todo credor, devedor ou herdeiro.',
      memorize:['Regra: interrupção é pessoal.','Solidariedade pode comunicar.','Indivisibilidade protege a unidade da prestação.','Principal → fiador; não presuma o caminho inverso.']
    },
    {
      id:'prazo-geral-dez-anos',
      title:'Prazo geral de dez anos',
      basis:'CC, art. 205',
      text:'Quando a lei não estabelece prazo prescricional menor para determinada pretensão, aplica-se o prazo geral de dez anos. O art. 205 é subsidiário: antes de utilizá-lo, deve-se verificar o art. 206 e a legislação especial. Não se escolhe o prazo pela aparência de justiça do caso.',
      sections:[
        {title:'Aplicação subsidiária',bullets:['O prazo decenal só incide na falta de prazo específico.','Legislação especial pode afastar tanto o art. 205 quanto as hipóteses do art. 206.','A classificação da pretensão precede a escolha: não se usa o prazo geral para direito sujeito à decadência.']},
        {title:'Método para questões',bullets:['Identifique a relação jurídica e a prestação exigida.','Procure hipótese específica no art. 206.','Verifique lei especial aplicável.','Somente na ausência de prazo menor utilize dez anos.']}
      ],
      table:{headers:['Etapa','Pergunta'],rows:[['1','É pretensão sujeita à prescrição?'],['2','Existe prazo no art. 206?'],['3','Existe lei especial?'],['4','Se não houver prazo menor, aplica-se o art. 205']]},
      example:'Uma pretensão contratual não se enquadra em prazo específico do art. 206 nem em lei especial. Depois dessa verificação, aplica-se o prazo geral de dez anos.',
      trap:'O art. 205 não diz que toda pretensão contratual prescreve em dez anos. Dívida líquida constante de instrumento público ou particular, por exemplo, possui prazo especial de cinco anos.',
      memorize:['Art. 205 = regra subsidiária.','Prazo geral = dez anos.','Primeiro procure prazo especial.','Não aplique prescrição a direito decadencial.']
    },
    {
      id:'prazos-especiais-artigo-206',
      title:'Prazos especiais de um a cinco anos',
      basis:'CC, art. 206, §§ 1º a 5º',
      text:'O art. 206 concentra os principais prazos prescricionais especiais do Código Civil. A prova costuma trocar a duração ou o termo inicial entre hipóteses semelhantes. A memorização deve ser feita por grupos, sempre observando que leis especiais podem estabelecer disciplina própria.',
      sections:[
        {title:'Um e dois anos',bullets:['Um ano: hospedagem ou alimentos consumidos no próprio estabelecimento; emolumentos, custas e honorários de tabeliães, auxiliares da justiça, serventuários, árbitros e peritos; avaliação de bens para capital de sociedade anônima; credores não pagos contra sócios, acionistas e liquidantes após encerramento da liquidação.','Dois anos: prestações alimentares, contados individualmente do vencimento de cada parcela.','O antigo prazo securitário do art. 206, §1º, II, foi revogado e deve ser estudado pela Lei 15.040/2024.']},
        {title:'Três, quatro e cinco anos',bullets:['Três anos: aluguéis; rendas temporárias ou vitalícias vencidas; juros, dividendos e acessórios periódicos; enriquecimento sem causa; reparação civil; lucros ou dividendos de má-fé; hipóteses societárias; títulos de crédito ressalvada lei especial; beneficiário ou terceiro no seguro obrigatório.','Quatro anos: pretensão relativa à tutela, contada da aprovação das contas.','Cinco anos: cobrança de dívida líquida constante de instrumento público ou particular; honorários de profissionais liberais e categorias indicadas; despesas judiciais do vencedor contra o vencido.']}
      ],
      table:{headers:['Prazo','Núcleos mais cobrados'],rows:[['1 ano','Hospedagem/alimentos; agentes da justiça; avaliação societária; liquidação societária'],['2 anos','Prestações alimentares vencidas'],['3 anos','Aluguéis; acessórios periódicos; enriquecimento sem causa; reparação civil; títulos de crédito'],['4 anos','Tutela após aprovação das contas'],['5 anos','Dívida líquida documentada; honorários profissionais; despesas do vencedor']]},
      example:'Cada prestação alimentar prescreve em dois anos a partir do respectivo vencimento. Parcelas sucessivas, portanto, podem ter datas prescricionais diferentes.',
      trap:'Reparação civil é, em regra, trienal; cobrança de dívida líquida documentada é quinquenal; o prazo geral decenal só entra quando não houver regra menor. Essas três hipóteses são frequentemente embaralhadas.',
      memorize:['2 = alimentos.','3 = aluguéis, acessórios, enriquecimento e reparação.','4 = tutela.','5 = dívida líquida documentada e honorários.','10 = regra geral subsidiária.']
    },
    {
      id:'seguro-atualizacao-2026',
      title:'Prescrição nos seguros: atualização legislativa de 2026',
      basis:'Lei 15.040/2024, arts. 126, 127 e 133; CC, art. 206, §3º, IX',
      text:'A Lei nº 15.040/2024 revogou o antigo inciso II do §1º do art. 206 do Código Civil e passou a disciplinar diretamente os principais prazos prescricionais dos contratos de seguro. Por isso, materiais que ainda repetem integralmente a redação antiga do Código precisam ser atualizados.',
      sections:[
        {title:'Prazos da nova lei',bullets:['Um ano, contado da ciência do fato gerador, para pretensões da seguradora contra segurado ou estipulante, remunerações dos intervenientes e relações entre cosseguradoras, seguradoras, resseguradoras e retrocessionárias.','Um ano, contado da ciência da recepção da recusa expressa e motivada, para o segurado exigir indenização, capital, reserva, prestações vencidas e restituição de prêmio.','Três anos, contados da ciência do fato gerador, para beneficiários ou terceiros prejudicados exigirem da seguradora as prestações previstas na lei.']},
        {title:'Suspensão especial',bullets:['Além das causas do Código Civil, o pedido de reconsideração da recusa de pagamento suspende a prescrição uma única vez quando recebido pela seguradora.','A suspensão termina quando o interessado é comunicado da decisão final da seguradora.','O art. 206, §3º, IX, continua relevante para a hipótese ali descrita de seguro de responsabilidade civil obrigatório.']}
      ],
      table:{headers:['Titular da pretensão','Prazo','Termo inicial'],rows:[['Seguradora e intervenientes nas hipóteses legais','1 ano','Ciência do fato gerador'],['Segurado contra seguradora','1 ano','Ciência da recepção da recusa expressa e motivada'],['Beneficiário ou terceiro prejudicado','3 anos','Ciência do fato gerador']]},
      example:'A seguradora recusa expressamente a indenização e comunica o segurado. Para a pretensão do segurado abrangida pela nova lei, o prazo anual parte da ciência da recepção dessa recusa motivada.',
      trap:'Não use automaticamente o texto antigo do art. 206, §1º, II. Em 2026, ele está revogado e o núcleo da disciplina prescricional securitária está nos arts. 126 e 127 da Lei nº 15.040/2024.',
      memorize:['Seguro: conferir Lei 15.040/2024.','Segurado: 1 ano da ciência da recusa motivada.','Beneficiário/terceiro: 3 anos do fato gerador conhecido.','Reconsideração suspende uma vez.']
    },
    {
      id:'prescricao-intercorrente',
      title:'Prescrição intercorrente',
      basis:'CC, art. 206-A; CPC, art. 921',
      text:'Prescrição intercorrente ocorre durante o processo quando, depois de exercida a pretensão e instaurada a atividade executiva, a inércia juridicamente relevante permite que o tempo volte a atuar contra o credor. O art. 206-A determina que ela observe o mesmo prazo da pretensão e as causas de impedimento, suspensão e interrupção do Código Civil, em diálogo com o art. 921 do CPC.',
      sections:[
        {title:'Estrutura',bullets:['A pretensão original foi exercida, mas a satisfação executiva permanece paralisada nas condições legais.','O prazo intercorrente corresponde ao prazo prescricional da própria pretensão.','A contagem processual segue o regime do CPC, inclusive suspensão da execução e marco inicial previsto em lei.']},
        {title:'Garantias procedimentais',bullets:['Impedimento, suspensão e interrupção aplicam-se conforme o art. 206-A.','O reconhecimento exige observância do contraditório e dos marcos processuais.','Não é qualquer demora do processo que gera automaticamente prescrição intercorrente; é necessária situação legal de inércia e fluência do prazo.']}
      ],
      table:{headers:['Prescrição comum','Prescrição intercorrente'],rows:[['Antes ou fora do processo, atinge pretensão não exercida no prazo','Surge no curso da atividade executiva paralisada'],['Prazo dos arts. 205, 206 ou lei especial','Mesmo prazo da pretensão correspondente'],['Considera causas modificadoras do Código','Também considera impedimento, suspensão e interrupção']]},
      example:'Uma pretensão de reparação civil reconhecida judicialmente possui prazo trienal. Na execução paralisada nos termos legais, a prescrição intercorrente observará o mesmo prazo, contado segundo o regime processual aplicável.',
      trap:'A prescrição intercorrente não começa necessariamente no dia do ajuizamento nem decorre de toda suspensão processual. É indispensável identificar o marco do art. 921 do CPC.',
      memorize:['Intercorrente acontece no processo.','Prazo igual ao da pretensão.','CC 206-A + CPC 921.','Mera demora judicial não basta.']
    },
    {
      id:'decadencia-conceito-direitos-potestativos',
      title:'Decadência e direitos potestativos',
      basis:'CC, arts. 178, 179 e 207 a 211',
      text:'Decadência é a perda do direito potestativo pelo seu não exercício dentro do prazo previsto. Como esse direito permite constituir, modificar ou extinguir uma relação jurídica, seu exercício coloca a outra parte em estado de sujeição, e não diante de um dever de prestar previamente violado.',
      sections:[
        {title:'Identificação material',bullets:['Direitos potestativos não exigem uma prestação anterior da contraparte.','O prazo costuma acompanhar ações constitutivas, como anulação de negócio jurídico.','A lei pode fixar prazo dentro do próprio dispositivo ou capítulo que disciplina o direito.']},
        {title:'Ações e prazos',bullets:['Ações condenatórias normalmente se relacionam a pretensões e prescrição.','Ações constitutivas com prazo legal normalmente se relacionam à decadência.','Ações meramente declaratórias tendem a não se sujeitar a prescrição ou decadência, sem prejuízo da prescrição das consequências patrimoniais exigidas.']}
      ],
      table:{headers:['Tutela predominante','Objeto','Regime temporal típico'],rows:[['Condenatória','Prestação de dar, fazer ou não fazer','Prescrição'],['Constitutiva','Criação, alteração ou extinção da relação','Decadência quando houver prazo'],['Declaratória','Certeza sobre existência ou inexistência','Em regra, imprescritível quanto à declaração']]},
      example:'A vítima de dolo pode pedir a anulação do negócio dentro do prazo de quatro anos. O prazo limita o exercício do direito potestativo de desconstituir o negócio, caracterizando decadência.',
      trap:'Nem toda ação constitutiva está sujeita a decadência: é necessário que exista prazo legal ou convencional aplicável. Sem prazo, não se inventa decadência por analogia.',
      memorize:['Decadência atinge direito potestativo.','Direito potestativo cria estado de sujeição.','Constitutiva + prazo = forte sinal de decadência.','Declaratória não recebe prazo por simples analogia.']
    },
    {
      id:'prescricao-decadencia-comparacao',
      title:'Prescrição e decadência: comparação completa',
      basis:'CC, arts. 189 a 211; CPC, art. 487, II',
      text:'Prescrição e decadência não se diferenciam apenas pelo prazo. A distinção envolve a natureza do direito, o objeto atingido, a possibilidade de renúncia, a atuação do juiz e a incidência de causas que alteram a contagem. A comparação sistemática evita a maioria das pegadinhas.',
      sections:[
        {title:'Prescrição',bullets:['Pressupõe violação de direito e nascimento de pretensão.','Prazos são legais e não podem ser alterados por acordo.','Admite renúncia depois de consumada e sem prejuízo de terceiro.','Possui causas de impedimento, suspensão e interrupção.']},
        {title:'Decadência',bullets:['Recai normalmente sobre direito potestativo.','Pode ser legal ou convencional.','Na legal, a renúncia é nula e o juiz conhece de ofício.','Na convencional, a parte beneficiada deve alegar e o juiz não pode suprir a alegação.']}
      ],
      table:{headers:['Critério','Prescrição','Decadência'],rows:[['Objeto','Pretensão','Direito potestativo'],['Ação típica','Condenatória','Constitutiva'],['Alteração do prazo','Não pode por acordo','Admissível na modalidade convencional'],['Renúncia','Depois de consumada, sem prejuízo de terceiro','Nula se o prazo for legal'],['Interrupção','Admitida uma vez','Em regra, não se aplica'],['Conhecimento de ofício','Possível com contraditório','Obrigatório na legal; vedado suprimento na convencional']]},
      example:'A cobrança de indenização por dano está sujeita à prescrição. A anulação do negócio por dolo está sujeita à decadência. O fato de ambos os pedidos chegarem ao Judiciário não unifica os regimes.',
      trap:'A decadência convencional não recebe o mesmo tratamento da legal. Se a questão disser apenas que “toda decadência deve ser reconhecida de ofício”, estará errada.',
      memorize:['Prescrição: pretensão.','Decadência: direito potestativo.','Legal: juiz conhece, renúncia nula.','Convencional: parte alega, juiz não supre.']
    },
    {
      id:'decadencia-causas-excecoes',
      title:'Impedimento, suspensão e interrupção da decadência',
      basis:'CC, arts. 207 e 208; CDC, art. 26, §2º',
      text:'Como regra, não se aplicam à decadência as normas que impedem, suspendem ou interrompem a prescrição. A própria lei, entretanto, pode estabelecer exceções. O Código Civil aplica à decadência a responsabilidade de assistentes e representantes do art. 195 e a proteção do absolutamente incapaz prevista no art. 198, I.',
      sections:[
        {title:'Regra e exceções do Código',bullets:['A decadência normalmente corre de modo contínuo.','Não se transportam automaticamente as causas dos arts. 197 a 204.','O art. 208 manda aplicar os arts. 195 e 198, I: responsabilidade do protetor faltoso e impedimento em favor do absolutamente incapaz.']},
        {title:'Exceções em legislação especial',bullets:['O CDC estabelece situações que obstam a decadência para reclamação por vício do produto ou serviço.','A reclamação comprovada ao fornecedor produz o efeito até resposta negativa inequívoca.','A instauração de inquérito civil também obsta o prazo até seu encerramento.','Essas exceções não autorizam criar outras sem previsão legal.']}
      ],
      table:{headers:['Regra','Tratamento'],rows:[['Causas prescricionais em geral','Não se aplicam à decadência'],['Absolutamente incapaz','Proteção do art. 198, I, por força do art. 208'],['Representante ou assistente faltoso','Responsabilidade do art. 195'],['CDC, art. 26, §2º','Hipóteses especiais que obstam a decadência']]},
      example:'O direito de reclamar de vício no CDC está sujeito à decadência, mas uma reclamação comprovada ao fornecedor pode obstar o prazo até a resposta negativa inequívoca.',
      trap:'É errado afirmar tanto que a decadência nunca sofre qualquer paralisação quanto que todas as causas de suspensão da prescrição se aplicam a ela. A resposta correta depende de previsão legal específica.',
      memorize:['Regra: decadência corre continuamente.','Art. 208: arts. 195 e 198, I.','Lei especial pode criar exceção.','CDC: reclamação comprovada e inquérito civil.']
    },
    {
      id:'decadencia-legal-convencional',
      title:'Decadência legal e decadência convencional',
      basis:'CC, arts. 209 a 211; CPC, art. 487, II',
      text:'A origem do prazo define o regime da decadência. Se estabelecido por lei, o interesse protegido é tratado como indisponível para fins de renúncia e o juiz deve conhecê-lo de ofício. Se criado por convenção válida, a parte beneficiada pode alegá-lo em qualquer grau, mas o magistrado não pode substituir sua iniciativa.',
      sections:[
        {title:'Decadência legal',bullets:['Prazo nasce diretamente da lei.','É nula a renúncia ao prazo fixado em lei.','O juiz deve conhecer da decadência legal de ofício, assegurando contraditório no processo.']},
        {title:'Decadência convencional',bullets:['Prazo decorre de acordo admitido pelo ordenamento.','A parte a quem aproveita pode alegá-lo em qualquer grau de jurisdição, respeitados os limites processuais.','O juiz não pode suprir a ausência de alegação.','Por proteger interesse disponível, admite renúncia pela parte beneficiada.']}
      ],
      table:{headers:['Critério','Legal','Convencional'],rows:[['Origem','Lei','Acordo das partes'],['Renúncia','Nula','Admitida pela parte beneficiada'],['Conhecimento de ofício','Dever do juiz','Vedado'],['Alegação','Pode ser reconhecida independentemente de pedido','Cabe à parte a quem aproveita']]},
      example:'Um contrato estabelece prazo convencional para exercício de determinada faculdade. Encerrado o prazo, somente a parte beneficiada pode invocar a decadência; o juiz não pode reconhecê-la por iniciativa própria.',
      trap:'A frase “decadência pode ser reconhecida de ofício” é incompleta. Isso vale para a decadência legal; na convencional, o art. 211 proíbe o suprimento judicial.',
      memorize:['Legal: lei, sem renúncia, de ofício.','Convencional: acordo, renunciável, depende da parte.','Origem do prazo define o regime.']
    },
    {
      id:'prova-forma-meios',
      title:'Forma especial e meios de prova dos fatos jurídicos',
      basis:'CC, art. 212; CPC, arts. 369 e seguintes',
      text:'O art. 212 enumera confissão, documento, testemunha, presunção e perícia como meios de prova dos fatos jurídicos. A liberdade probatória, porém, não supera forma especial exigida para a própria validade ou existência do negócio. Primeiro se verifica a exigência formal; somente depois se escolhe o meio adequado para demonstrar o fato.',
      sections:[
        {title:'Forma e prova',bullets:['Forma é o modo de exteriorização do negócio; prova é o instrumento utilizado para demonstrar sua ocorrência e conteúdo.','Quando a lei impõe forma especial como requisito do negócio, outro meio de prova não cria validamente o ato que deixou de observá-la.','Nos fatos e negócios sem forma especial, admitem-se os meios do art. 212 e outros moralmente legítimos segundo o CPC.']},
        {title:'Meios enumerados',bullets:['Confissão: admissão de fato contrário ao interesse do confitente.','Documento: representação material ou eletrônica de fatos e declarações.','Testemunha: relato de pessoa sobre fatos percebidos.','Presunção: conclusão extraída de fato conhecido.','Perícia: conhecimento técnico ou científico aplicado à prova.']}
      ],
      table:{headers:['Instituto','Pergunta'],rows:[['Forma especial','A lei exige modo específico para o negócio?'],['Admissibilidade','O meio de prova é lícito e adequado?'],['Valor probatório','O conteúdo é autêntico, íntegro e suficiente?'],['Produção processual','Foram observadas as regras do CPC?']]},
      example:'Milhares de pessoas podem ter assistido a uma cerimônia informal, mas os depoimentos não transformam o evento em casamento se faltaram os requisitos legais constitutivos.',
      trap:'Quantidade de testemunhas ou gravações não substitui solenidade exigida para a validade do negócio. Provar que o evento ocorreu não significa provar que produziu o efeito jurídico pretendido.',
      memorize:['Primeiro: existe forma especial?','Depois: escolha o meio de prova.','CC 212: confissão, documento, testemunha, presunção e perícia.','Forma válida e prova suficiente são problemas diferentes.']
    },
    {
      id:'confissao',
      title:'Confissão: eficácia, representação e anulação',
      basis:'CC, arts. 213 e 214; CPC, arts. 389 a 395',
      text:'A confissão somente produz eficácia quando feita por quem pode dispor do direito relacionado aos fatos confessados. Se realizada por representante, vincula o representado apenas dentro dos poderes conferidos. É irrevogável, mas pode ser anulada quando decorre de erro de fato ou coação.',
      sections:[
        {title:'Eficácia',bullets:['Quem não pode dispor do direito não produz confissão eficaz sobre ele.','Representante não pode confessar além do âmbito em que poderia vincular o representado.','Confissão refere-se a fatos e não substitui automaticamente requisitos formais do negócio.']},
        {title:'Irrevogabilidade e anulação',bullets:['Mero arrependimento não permite retirar a confissão.','Erro de fato e coação são as hipóteses expressas do art. 214.','Erro de direito não aparece como fundamento legal de anulação.','O dolo pode ser juridicamente relevante quando tenha provocado erro de fato, mas não deve ser apresentado como hipótese literal autônoma do art. 214.']}
      ],
      table:{headers:['Situação','Consequência'],rows:[['Confitente capaz de dispor','Confissão pode ser eficaz'],['Representante','Eficácia limitada aos poderes'],['Arrependimento','Não revoga a confissão'],['Erro de fato ou coação','Pode fundamentar anulação'],['Erro de direito','Não é hipótese do art. 214']]},
      example:'Representante autorizado apenas a administrar um bem não pode, por confissão, reconhecer validamente obrigação que exceda seus poderes e disponha do patrimônio do representado.',
      trap:'“Irrevogável” não significa “absolutamente imune à anulação”. O ato não pode ser retirado por vontade simples, mas erro de fato ou coação permitem anulá-lo.',
      memorize:['Confissão exige poder de disposição.','Representante só vincula dentro dos poderes.','Irrevogável não é igual a inimpugnável.','Anulação literal: erro de fato ou coação.']
    },
    {
      id:'documentos-publicos-particulares-eletronicos',
      title:'Documentos públicos, particulares e eletrônicos',
      basis:'CC, arts. 215 a 226',
      text:'A prova documental abrange instrumentos públicos e particulares, certidões, traslados, cópias, mensagens e reproduções eletrônicas. O valor de cada documento depende de autoria, autenticidade, conteúdo, forma exigida e eventual impugnação. Fé pública não transforma toda declaração em verdade absoluta nem supre requisito legal ausente.',
      sections:[
        {title:'Documento público e escritura',bullets:['A escritura pública lavrada por tabelião possui fé pública e faz prova plena nos limites legais.','Deve registrar data, local, identidade e capacidade, qualificação, vontade, exigências legais e fiscais, leitura e assinaturas.','Certidões e traslados extraídos por autoridades competentes possuem a força probante definida nos arts. 216 a 218.','Fé pública alcança os fatos que o agente declara terem ocorrido em sua presença, sem impedir discussão jurídica sobre validade ou vícios.']},
        {title:'Instrumento particular e terceiros',bullets:['Instrumento feito e assinado por quem administra livremente seus bens prova obrigações convencionais de qualquer valor.','Seus efeitos, assim como os da cessão, não operam contra terceiros antes do registro público quando a lei assim estabelece.','A falta ou insuficiência do instrumento pode ser suprida por outros meios legais quando não houver forma especial indispensável.','Documento em língua estrangeira deve ser traduzido para produzir efeitos legais no País.']},
        {title:'Reproduções e livros empresariais',bullets:['Fotografias, vídeos, áudios e reproduções eletrônicas fazem prova plena dos fatos ou coisas se a parte contrária não impugnar sua exatidão.','Impugnada a autenticidade ou integridade, pode ser necessária verificação técnica e apresentação do original.','Livros e fichas empresariais provam contra seu titular e podem provar em seu favor quando regulares e confirmados por outros elementos.','Escrituração não substitui escritura pública ou instrumento especial exigido por lei.']}
      ],
      table:{headers:['Documento','Força principal','Limite importante'],rows:[['Escritura pública','Fé pública e prova plena','Não sana vício material do negócio'],['Instrumento particular','Prova obrigações convencionais','Efeito perante terceiros pode depender de registro'],['Reprodução eletrônica','Prova se não impugnada','Impugnação pode exigir perícia'],['Livros empresariais','Podem provar contra e, com requisitos, a favor','Não substituem forma especial']]},
      example:'Uma conversa eletrônica pode provar reconhecimento de dívida se sua exatidão não for impugnada. Se houver alegação fundamentada de adulteração, a autenticidade poderá depender de perícia e de outros elementos.',
      trap:'Registro do instrumento particular não é, em regra, requisito para provar a obrigação entre os signatários; ele é relevante para a produção de efeitos perante terceiros.',
      memorize:['Público: fé pública nos limites do ato.','Particular: prova entre partes; terceiros podem exigir registro.','Eletrônico: vale se íntegro e não impugnado.','Livro empresarial não supera forma especial.']
    },
    {
      id:'testemunhas-presuncoes',
      title:'Prova testemunhal e presunções',
      basis:'CC, arts. 219, 227 e 228; CPC, arts. 442 a 463',
      text:'A prova testemunhal é admitida segundo o Código Civil e o CPC, inclusive como complemento da prova escrita. O art. 228 identifica pessoas que, em regra, não são admitidas como testemunhas, mas permite excepcionalmente seu depoimento sobre fatos que somente elas conheçam. Presunções podem ser relativas ou absolutas conforme admitam prova contrária.',
      sections:[
        {title:'Testemunhas',bullets:['Não são admitidos, pela literalidade do art. 228, menores de 16 anos; interessado no litígio, amigo íntimo ou inimigo capital; cônjuge, ascendentes, descendentes e colaterais até terceiro grau de alguma parte, por consanguinidade ou afinidade.','O juiz pode admitir o depoimento dessas pessoas para fatos que somente elas conheçam, atribuindo-lhe o valor adequado.','Pessoa com deficiência pode testemunhar em igualdade de condições, com recursos de tecnologia assistiva.','O antigo limite econômico do caput do art. 227 foi revogado pelo CPC de 2015; permaneceu a admissibilidade complementar ou subsidiária da testemunha.']},
        {title:'Presunções',bullets:['Presunção relativa, juris tantum, admite prova em contrário.','Presunção absoluta, juris et de jure, não admite prova contrária.','Declarações em documento assinado presumem-se verdadeiras em relação aos signatários, mas declarações meramente enunciativas sem relação direta não retiram do interessado o ônus de prová-las.','Presunção não se confunde com ficção jurídica nem com simples opinião do julgador.']}
      ],
      table:{headers:['Instituto','Regra'],rows:[['Testemunha impedida pela literalidade civil','Pode ser excepcionalmente ouvida sobre fato que só ela conhece'],['Pessoa com deficiência','Igualdade com tecnologia assistiva'],['Presunção relativa','Admite prova em contrário'],['Presunção absoluta','Não admite prova em contrário'],['Declaração assinada','Presunção relativa ao signatário, com limites']]},
      example:'O único presente a determinado fato é parente de uma das partes. Embora abrangido pela regra do art. 228, o juiz pode admitir seu depoimento excepcionalmente porque somente ele conhece o acontecimento.',
      trap:'A pessoa com deficiência não pode ser excluída por essa condição. A lei determina igualdade e fornecimento dos recursos necessários à comunicação.',
      memorize:['Testemunha: observar CC + CPC.','Fato conhecido somente pela pessoa permite admissão excepcional.','PcD testemunha em igualdade.','Juris tantum admite prova; juris et de jure não.']
    },
    {
      id:'pericia-recusa-exame',
      title:'Perícia e recusa ao exame médico',
      basis:'CC, arts. 231 e 232; CPC, arts. 464 a 480; STJ, Súmula 301',
      text:'Perícia é utilizada quando a demonstração do fato exige conhecimento técnico ou científico. No campo médico, a pessoa não é fisicamente obrigada a se submeter ao exame, mas não pode aproveitar-se da própria recusa. O juiz pode considerar a negativa como elemento capaz de suprir a prova pretendida, em conjunto com as demais circunstâncias.',
      sections:[
        {title:'Consequências da recusa',bullets:['A recusa ao exame médico necessário impede que a pessoa obtenha vantagem probatória da própria resistência.','A negativa à perícia ordenada pelo juiz pode suprir a prova que se pretendia produzir.','A consequência não equivale automaticamente a confissão absoluta: deve ser valorada com o conjunto probatório.']},
        {title:'Investigação de paternidade',bullets:['A recusa do suposto pai ao exame de DNA induz presunção relativa de paternidade.','Por ser relativa, a conclusão pode ser confrontada com outros elementos do processo.','O objetivo é impedir que quem detém a possibilidade de esclarecer o fato inviabilize injustificadamente a prova.']}
      ],
      table:{headers:['Conduta','Efeito probatório'],rows:[['Submissão ao exame','Produção direta do dado técnico'],['Recusa ao exame necessário','Não pode beneficiar quem recusou'],['Recusa à perícia judicial','Pode suprir a prova pretendida'],['Recusa ao DNA','Presunção relativa de paternidade']]},
      example:'Em investigação de paternidade, o suposto pai recusa injustificadamente o DNA. A recusa gera presunção relativa, que será apreciada juntamente com documentos, depoimentos e demais elementos.',
      trap:'A recusa não autoriza condução física automática nem produz verdade absoluta em todos os casos. Seu efeito é probatório e deve ser analisado dentro do processo.',
      memorize:['Ninguém aproveita a própria recusa.','Art. 232: recusa pode suprir a prova.','DNA recusado → presunção relativa.','Perícia é valorada com o conjunto probatório.']
    }
  ],
  'civ-posse':[
    {id:'posse-detencao',title:'Posse, detenção e teorias possessórias',basis:'CC, arts. 1.196 e 1.198',text:'O Código adota concepção objetiva: possuidor é quem exerce de fato algum poder inerente à propriedade, ainda que não seja dono. Detentor conserva a coisa em nome de outro, em relação de dependência e seguindo ordens. Atos de mera permissão ou tolerância e atos violentos ou clandestinos enquanto persistirem esses vícios não induzem posse.'},
    {id:'direta-indireta-composse',title:'Posse direta, indireta e composse',basis:'CC, arts. 1.197 e 1.199',text:'A posse direta de quem tem materialmente a coisa pode coexistir com a posse indireta de quem a cedeu temporariamente; uma não anula a outra e ambas têm tutela possessória. Na composse, duas ou mais pessoas exercem posse sobre coisa indivisa e nenhuma pode excluir o exercício compatível das demais.'},
    {id:'justa-injusta',title:'Posse justa, injusta, de boa-fé e de má-fé',basis:'CC, arts. 1.200 a 1.202',text:'Posse injusta é violenta, clandestina ou precária. Boa-fé existe quando o possuidor ignora o vício ou obstáculo à aquisição; justo título gera presunção relativa. A boa-fé cessa quando as circunstâncias revelam que o possuidor não pode ignorar a indevida ocupação. Os eixos justa/injusta e boa-fé/má-fé são independentes.'},
    {id:'continuidade-interversao',title:'Continuidade dos caracteres e interversão da posse',basis:'CC, arts. 1.203 e 1.208',text:'Salvo prova em contrário, a posse conserva o caráter com que foi adquirida. Detenção e posse precária não se transformam apenas pelo decurso do tempo; exige-se mudança objetiva e inequívoca na causa da relação, exteriorizada contra o antigo possuidor. Violência e clandestinidade impedem aquisição enquanto duram, mas cessado o vício pode começar nova situação possessória.'},
    {id:'aquisicao-sucessao',title:'Aquisição, transmissão e soma das posses',basis:'CC, arts. 1.204 a 1.209',text:'Adquire-se posse quando se torna possível exercer, em nome próprio, poder sobre a coisa. Pode ser adquirida pessoalmente, por representante ou por terceiro com ratificação. O sucessor universal continua a posse com os mesmos caracteres; o sucessor singular pode somar a posse anterior à sua, assumindo também suas qualidades para os efeitos legais.'},
    {id:'tutela-possessoria',title:'Proteção possessória e desforço imediato',basis:'CC, arts. 1.210 a 1.213; CPC, arts. 554 a 568',text:'Turbação autoriza manutenção, esbulho autoriza reintegração e ameaça autoriza interdito proibitório. O possuidor pode defender-se ou restituir-se por força própria se agir logo e sem exceder o indispensável. Alegação de propriedade não impede tutela possessória. Conflitos coletivos exigem procedimento, mediação e cautelas específicas do CPC.'},
    {id:'frutos-responsabilidade',title:'Frutos e responsabilidade pela perda ou deterioração',basis:'CC, arts. 1.214 a 1.218',text:'O possuidor de boa-fé tem direito aos frutos percebidos enquanto ela durar e restitui os pendentes, descontadas despesas. O de má-fé responde pelos frutos colhidos e pelos que deixou de perceber por culpa, com direito às despesas de produção e custeio. A responsabilidade pela perda da coisa também varia conforme boa-fé, culpa e momento da constituição em mora.'},
    {id:'benfeitorias-retencao',title:'Benfeitorias, acessões e direito de retenção',basis:'CC, arts. 1.219 a 1.222',text:'O possuidor de boa-fé é indenizado pelas benfeitorias necessárias e úteis, pode levantar voluptuárias sem dano e retém a coisa pelas indenizáveis. O de má-fé recebe apenas as necessárias e não tem retenção nem levantamento. Acessões não se confundem automaticamente com benfeitorias, e a compensação considera danos e indenizações.'},
    {id:'perda-posse',title:'Perda da posse',basis:'CC, arts. 1.223 e 1.224',text:'Perde-se a posse quando cessa, contra a vontade do possuidor, o poder sobre a coisa, ainda que ele não tenha notícia imediata. Para quem não presenciou o esbulho, a perda só se caracteriza quando, informado, se abstém de retornar ou, tentando recuperá-la, é violentamente repelido.'}
  ],
  'civ-propriedade':[
    {id:'direitos-reais',title:'Direitos reais: estrutura, aquisição e rol legal',basis:'CC, arts. 1.225 a 1.227',text:'Direito real atribui poder imediato sobre bem e eficácia perante terceiros, com sequela e preferência quando cabíveis. Seu rol depende de previsão legal, embora leis especiais possam criar figuras fora do Código. Direitos reais sobre móveis normalmente se adquirem com tradição; sobre imóveis constituídos por atos entre vivos, com registro do título, ressalvadas hipóteses legais.'},
    {id:'propriedade-geral',title:'Propriedade: poderes, função social e limitações',basis:'CC, arts. 1.228 a 1.237',text:'O proprietário pode usar, gozar, dispor e reaver a coisa, mas deve exercer o direito conforme finalidades econômicas, sociais, ambientais e culturais. São vedados atos sem utilidade própria destinados a prejudicar terceiros. Descoberta de coisa alheia perdida impõe restituição e procedimento legal; não autoriza apropriação imediata.'},
    {id:'usucapiao-imovel',title:'Usucapião de imóveis',basis:'CC, arts. 1.238 a 1.244; CF, arts. 183 e 191',text:'Usucapião é aquisição originária fundada em posse qualificada pelo tempo. Modalidades extraordinária, ordinária, especiais urbana e rural, familiar e coletivas possuem prazos e requisitos distintos. Justo título e boa-fé só são exigidos nas modalidades que os preveem. Bens públicos não se usucapem, e soma de posses depende de continuidade e compatibilidade.'},
    {id:'registro-acessao',title:'Registro do título e acessão imobiliária',basis:'CC, arts. 1.245 a 1.259',text:'Negócio jurídico não transfere sozinho a propriedade imobiliária: enquanto não houver registro, o alienante continua havido como dono. Registro inexato pode ser retificado ou anulado. Acessão ocorre por formação de ilhas, aluvião, avulsão, abandono de álveo e construções ou plantações, com soluções que variam conforme titularidade do solo, materiais e boa ou má-fé.'},
    {id:'aquisicao-movel',title:'Aquisição da propriedade móvel',basis:'CC, arts. 1.260 a 1.274',text:'Bens móveis podem ser adquiridos por usucapião, ocupação, achado de tesouro, tradição, especificação, confusão, comissão e adjunção. A tradição pode ser real, simbólica ou consensual e exige título causal válido. Em conflitos de materiais ou obras de diferentes donos, boa-fé, valor, separabilidade e indenização orientam a solução.'},
    {id:'perda-propriedade',title:'Perda da propriedade',basis:'CC, arts. 1.275 e 1.276',text:'Além de outras causas, perde-se propriedade por alienação, renúncia, abandono, perecimento e desapropriação. Para imóvel, alienação e renúncia dependem de registro. Abandono exige intenção de não mais ser dono e pode gerar arrecadação pelo poder público; não se presume apenas por falta de uso, embora cessação de ônus fiscais e atos materiais reforcem a presunção legal.'},
    {id:'vizinhanca',title:'Direitos de vizinhança',basis:'CC, arts. 1.277 a 1.313',text:'O regime limita propriedades próximas para assegurar convivência: uso anormal, árvores limítrofes, passagem forçada, cabos e tubulações, águas, limites entre prédios e direito de construir. São obrigações ligadas à situação dos imóveis, não simples favores pessoais. Passagem forçada protege prédio encravado e não se confunde com servidão convencional.'},
    {id:'condominio-geral',title:'Condomínio geral',basis:'CC, arts. 1.314 a 1.330',text:'Cada condômino pode usar a coisa conforme sua destinação, defender a posse, reivindicá-la e alienar sua parte ideal, sem excluir os demais. Despesas e frutos distribuem-se proporcionalmente. Administração segue deliberação da maioria calculada pelo valor dos quinhões. Em regra, ninguém é obrigado a permanecer no condomínio, podendo exigir divisão ou venda do bem indivisível.'},
    {id:'condominio-edilicio',title:'Condomínio edilício',basis:'CC, arts. 1.331 a 1.358',text:'Unidades autônomas coexistem com partes comuns e frações ideais. Instituição, convenção e regimento estruturam o condomínio. Condôminos têm direitos e deveres relativos ao uso, despesas, destinação e convivência; inadimplemento e conduta antissocial geram sanções com requisitos próprios. Síndico, assembleia, conselho, obras e alteração de fachada envolvem competências e quóruns específicos.'},
    {id:'condominio-lotes',title:'Condomínio de lotes',basis:'CC, art. 1.358-A; Lei 6.766/1979',text:'No condomínio de lotes, partes designadas como lotes são unidades imobiliárias autônomas vinculadas a fração ideal das áreas comuns. Aplicam-se, no que couber, as regras do condomínio edilício e a legislação urbanística e registral. Não se confunde com loteamento comum nem com simples associação de moradores.'},
    {id:'multipropriedade',title:'Condomínio em multipropriedade',basis:'CC, arts. 1.358-B a 1.358-U',text:'Multipropriedade divide o uso do imóvel em unidades periódicas de tempo, pertencentes a titulares distintos. Cada fração temporal é autônoma, indivisível e submetida à convenção e administração próprias. Instituição, duração mínima dos períodos, transferência, despesas, renúncia translativa e regras para sistemas de locação ou intercâmbio devem ser estudadas separadamente.'},
    {id:'resoluvel-fiduciaria',title:'Propriedade resolúvel e propriedade fiduciária',basis:'CC, arts. 1.359 a 1.368-B; legislação especial',text:'Propriedade resolúvel extingue-se quando ocorre condição ou termo previsto no título. Na propriedade fiduciária móvel do Código, o devedor transfere domínio resolúvel ao credor para garantir a dívida e conserva posse direta. Inadimplemento autoriza consolidação e venda segundo o regime aplicável, não apropriação automática em pacto comissório.'},
    {id:'fundo-investimento',title:'Fundo de investimento',basis:'CC, arts. 1.368-C a 1.368-F',text:'Fundo de investimento é comunhão de recursos constituída sob a forma de condomínio de natureza especial, destinada à aplicação em ativos. O regulamento pode limitar responsabilidade dos cotistas ao valor das cotas e prever classes com patrimônios segregados. Registro, insolvência, responsabilidade de prestadores e disciplina da CVM integram o regime.'}
  ],
  'civ-direitos-reais':[
    {id:'superficie',title:'Direito de superfície',basis:'CC, arts. 1.369 a 1.377; Estatuto da Cidade, arts. 21 a 24',text:'O proprietário pode conceder a outra pessoa o direito de construir ou plantar no terreno por escritura pública registrada. No Código Civil, o prazo é determinado e obra no subsolo só cabe se inerente ao objeto. A concessão pode ser gratuita ou onerosa, transmite-se nos limites legais e extingue-se pelo termo ou desvio de finalidade. O Estatuto da Cidade possui regime urbano próprio.'},
    {id:'servidoes',title:'Servidões prediais',basis:'CC, arts. 1.378 a 1.389',text:'Servidão proporciona utilidade ao prédio dominante e grava o prédio serviente de dono diverso. Constitui-se por declaração expressa ou testamento com registro; a servidão aparente também pode ser adquirida por usucapião. O exercício deve ser menos oneroso ao serviente, as obras incumbem a quem se beneficia salvo título diverso, e a indivisibilidade acompanha divisões dos prédios.'},
    {id:'usufruto',title:'Usufruto',basis:'CC, arts. 1.390 a 1.411',text:'Usufruto permite possuir, usar, administrar e colher frutos de bem alheio, preservada a substância. Pode recair sobre bens móveis, imóveis ou patrimônio, por prazo ou vitaliciamente. O direito é inalienável, embora seu exercício possa ser cedido. Inventário, caução quando exigível, conservação, despesas, frutos, deterioração e causas de extinção delimitam usufrutuário e nu-proprietário.'},
    {id:'uso',title:'Direito real de uso',basis:'CC, arts. 1.412 e 1.413',text:'O usuário pode usar a coisa e perceber frutos apenas na medida das necessidades próprias e da família, avaliadas segundo sua condição social e o lugar. O direito é mais restrito que o usufruto e possui caráter personalíssimo. Aplicam-se-lhe, no que couber, regras do usufruto.'},
    {id:'habitacao',title:'Direito real de habitação',basis:'CC, arts. 1.414 a 1.416',text:'Habitação autoriza ocupar gratuitamente casa alheia com a família. O titular não pode alugá-la nem emprestá-la; o direito é personalíssimo. Se conferido a mais de uma pessoa, cada uma pode habitar sem pagar aluguel às demais, mas nenhuma pode impedir o exercício das outras. Não confunda com o direito sucessório de habitação, que tem fundamento próprio.'},
    {id:'promitente-comprador',title:'Direito do promitente comprador',basis:'CC, arts. 1.417 e 1.418; STJ, Súmula 239',text:'Promessa de compra e venda sem arrependimento e registrada confere direito real de aquisição ao promitente comprador. Cumprida a obrigação, ele pode exigir escritura e, diante da recusa, adjudicação. O registro é requisito do direito real perante terceiros, mas a adjudicação compulsória contra o vendedor não depende dele; exige-se, porém, quitação nos termos aplicáveis.'},
    {id:'garantias-geral',title:'Garantias reais: princípios comuns',basis:'CC, arts. 1.419 a 1.430',text:'Penhor, hipoteca e anticrese vinculam bem ao pagamento e conferem preferência nos limites legais. Só proprietário ou titular autorizado pode gravar o bem; propriedade superveniente pode validar a garantia registrada. Especialização e publicidade identificam dívida e bem. É nulo o pacto que permita ao credor ficar automaticamente com o objeto, mas é possível dação após vencimento.'},
    {id:'penhor',title:'Penhor',basis:'CC, arts. 1.431 a 1.472',text:'No penhor comum, a posse de coisa móvel é transferida ao credor ou representante; espécies especiais podem permanecer com o devedor. O credor deve guardar, conservar, prestar contas e restituir após pagamento, tendo direitos de retenção e excussão nos limites legais. Penhor rural, industrial, mercantil, de direitos, títulos, veículos e legal possuem constituição e publicidade próprias.'},
    {id:'hipoteca',title:'Hipoteca',basis:'CC, arts. 1.473 a 1.505; Lei 14.711/2023',text:'Hipoteca grava principalmente imóveis e certos bens equiparados sem transferir a posse. Pode haver hipotecas sucessivas, observada a prioridade registral. A garantia alcança acessões, melhoramentos e construções. Vencimento, extensão, remição, perempção, execução e sub-rogação seguem o Código com as alterações do Marco Legal das Garantias.'},
    {id:'anticrese-laje',title:'Anticrese e direito real de laje',basis:'CC, arts. 1.506 a 1.510-E',text:'Na anticrese, o devedor entrega imóvel ao credor para que perceba frutos e rendimentos e os impute na dívida, devendo administrá-lo e prestar contas. A laje cria unidade autônoma sobre projeção superior ou inferior de construção-base, com matrícula própria e sem fração ideal do terreno. Titular pode usar, gozar e dispor, e lajes sucessivas dependem das autorizações legais.'}
  ],
  'civ-familia':[
    {id:'familia-nocoes',title:'Direito de Família: princípios e entidades familiares',basis:'CF, arts. 1º, III, e 226; CC, arts. 1.511 e seguintes',text:'O Direito de Família é orientado por dignidade, igualdade, solidariedade, afetividade, pluralidade familiar, autonomia responsável e melhor interesse de crianças e adolescentes. Casamento, união estável, parentalidade e outras formações protegidas não podem ser estudados por hierarquia discriminatória. Normas pessoais costumam ser indisponíveis, enquanto efeitos patrimoniais admitem maior autonomia dentro dos limites legais.'},
    {id:'casamento-capacidade',title:'Casamento: capacidade, impedimentos e causas suspensivas',basis:'CC, arts. 1.517 a 1.524',text:'A idade núbil é 16 anos, com autorização enquanto não atingida a maioridade, e não se admite casamento abaixo dessa idade. Impedimentos do art. 1.521 proíbem o casamento e podem gerar nulidade. Causas suspensivas aconselham adiamento para proteção patrimonial e, se desrespeitadas, não invalidam o vínculo, mas podem impor consequências como separação legal de bens.'},
    {id:'habilitacao-celebracao',title:'Habilitação, celebração e prova do casamento',basis:'CC, arts. 1.525 a 1.547',text:'A habilitação verifica capacidade e inexistência de impedimentos, com documentação, publicidade e atuação registral. A celebração exige manifestação livre e simultânea perante autoridade competente e testemunhas, admitindo procuração especial e casamento em situações excepcionais. A certidão é a prova ordinária; falta do registro pode ser suprida pelos meios legais.'},
    {id:'invalidade-putativo',title:'Invalidade e casamento putativo',basis:'CC, arts. 1.548 a 1.564',text:'Nulidade e anulabilidade dependem de causas taxativas, legitimidade e prazos diferentes. Defeitos de vontade, incapacidade etária nas hipóteses legais, mandato revogado e incompetência da autoridade podem conduzir à anulação. O casamento putativo, contraído de boa-fé por um ou ambos, preserva efeitos até a sentença para o cônjuge de boa-fé e sempre em relação aos filhos.'},
    {id:'eficacia-dissolucao',title:'Efeitos e dissolução da sociedade e do vínculo conjugal',basis:'CC, arts. 1.565 a 1.582; CF, art. 226, § 6º',text:'Cônjuges assumem deveres recíprocos e direção colaborativa da família, com igualdade jurídica. Morte e divórcio dissolvem o vínculo; separação e demais figuras devem ser lidas conforme o sistema constitucional e processual vigente. O divórcio é direito potestativo, não depende de culpa ou prazo e pode ser decretado sem resolver previamente todas as questões patrimoniais.'},
    {id:'protecao-filhos-guarda',title:'Proteção dos filhos, guarda e convivência',basis:'CC, arts. 1.583 a 1.590; Lei 14.713/2023',text:'Guarda unilateral ou compartilhada deve servir ao melhor interesse do filho. A compartilhada é referência quando ambos os genitores estão aptos, mas não se aplica automaticamente diante de risco de violência doméstica ou familiar. Guarda não se confunde com poder familiar; convivência, alimentos, informação e participação nas decisões permanecem sujeitos à proteção integral.'},
    {id:'parentesco',title:'Relações de parentesco',basis:'CC, arts. 1.591 a 1.595',text:'Parentesco pode ser natural ou civil, em linha reta ou colateral. Na linha reta contam-se graus por gerações; na colateral sobe-se ao ascendente comum e desce-se ao parente, limitada pelo Código para efeitos gerais. Afinidade liga cada cônjuge ou companheiro aos parentes do outro e não se extingue, na linha reta, com a dissolução da união.'},
    {id:'filiacao',title:'Filiação e presunções de parentalidade',basis:'CC, arts. 1.596 a 1.606; CF, art. 227, § 6º',text:'Todos os filhos possuem os mesmos direitos, vedadas designações discriminatórias. O Código estabelece presunções de concepção na constância do casamento e regras sobre prova e contestação, que devem dialogar com reprodução assistida e parentalidade socioafetiva. O estado de filiação é protegido por ações próprias, e posse de estado pode ter relevância probatória.'},
    {id:'reconhecimento-filhos',title:'Reconhecimento dos filhos',basis:'CC, arts. 1.607 a 1.617; Lei 8.560/1992',text:'O filho havido fora do casamento pode ser reconhecido conjunta ou separadamente no registro, por escritura ou escrito público, testamento ou manifestação perante juiz. O reconhecimento é irrevogável e pode preceder o nascimento ou ocorrer depois da morte se houver descendentes. Consentimento e impugnação variam conforme idade; investigação de parentalidade é direito personalíssimo, indisponível e imprescritível.'},
    {id:'adocao',title:'Adoção',basis:'CC, arts. 1.618 e 1.619; ECA, arts. 39 a 52-D',text:'A adoção de crianças e adolescentes rege-se pelo ECA e constitui medida excepcional e irrevogável orientada ao melhor interesse. Cria vínculo de filiação com igualdade plena e rompe vínculos jurídicos anteriores, salvo impedimentos matrimoniais. A adoção de maiores também exige processo judicial e aplicação das regras pertinentes, com consentimentos e diferença etária legal.'},
    {id:'poder-familiar',title:'Poder familiar',basis:'CC, arts. 1.630 a 1.638; ECA',text:'Poder familiar é função exercida em igualdade pelos pais no interesse dos filhos menores: criação, educação, guarda, representação, assistência e administração patrimonial. Divergências podem ser levadas ao juiz. Extinção, suspensão e perda possuem causas legais distintas; sanções exigem devido processo e proporcionalidade e não eliminam automaticamente dever alimentar.'},
    {id:'patrimonio-pacto',title:'Direito patrimonial e pacto antenupcial',basis:'CC, arts. 1.639 a 1.657',text:'Os nubentes podem escolher e combinar regimes dentro da lei. Sem convenção válida, aplica-se a comunhão parcial. Alteração do regime durante o casamento exige autorização judicial, pedido motivado de ambos e proteção de terceiros. Pacto antenupcial exige escritura pública e só produz eficácia com o casamento; para valer perante terceiros, deve ser registrado no local competente.'},
    {id:'comunhao-parcial',title:'Regime de comunhão parcial',basis:'CC, arts. 1.658 a 1.666',text:'Comunicam-se, em regra, bens adquiridos onerosamente durante o casamento, ainda que em nome de apenas um cônjuge. Excluem-se bens anteriores, heranças, doações particulares e hipóteses legais de sub-rogação, além de obrigações estranhas à família. Frutos percebidos na constância do vínculo e benfeitorias em bens particulares merecem atenção.'},
    {id:'comunhao-universal',title:'Regime de comunhão universal',basis:'CC, arts. 1.667 a 1.671',text:'A comunhão universal abrange bens presentes e futuros e dívidas, salvo exclusões legais e convencionais. Permanecem incomunicáveis, entre outros, bens doados ou herdados com cláusula de incomunicabilidade e os sub-rogados, dívidas anteriores sem proveito comum e bens de uso pessoal. A incomunicabilidade do principal não impede necessariamente comunicação dos frutos.'},
    {id:'participacao-separacao',title:'Participação final nos aquestos e separação de bens',basis:'CC, arts. 1.672 a 1.688',text:'Na participação final, durante o casamento cada cônjuge administra patrimônio próprio; na dissolução calcula-se o direito à metade dos aquestos conforme regras de apuração e exclusão. Na separação convencional, patrimônios permanecem apartados, sem afastar contribuição às despesas familiares. A separação obrigatória deve ser lida com a legislação e a interpretação constitucional vigentes.'},
    {id:'bens-filhos-menores',title:'Usufruto e administração dos bens de filhos menores',basis:'CC, arts. 1.689 a 1.693',text:'Pais, no exercício do poder familiar, administram os bens dos filhos menores e têm usufruto legal, mas há exclusões: bens adquiridos pelo filho fora do casamento antes do reconhecimento, valores auferidos por maior de 16 anos em atividade própria e bens com cláusula de exclusão, entre outros. Atos que excedem simples administração dependem de autorização judicial.'},
    {id:'alimentos',title:'Alimentos',basis:'CC, arts. 1.694 a 1.710; Lei 5.478/1968',text:'Parentes, cônjuges e companheiros podem pedir alimentos necessários a vida compatível com a condição social e educação, segundo necessidade, possibilidade e proporcionalidade. A obrigação é recíproca e segue ordem de proximidade, admitindo complementação. Alimentos são atuais, variáveis e, em regra, irrepetíveis; maioridade não extingue pensão automaticamente, exigindo decisão com contraditório.'},
    {id:'bem-familia',title:'Bem de família voluntário e legal',basis:'CC, arts. 1.711 a 1.722; Lei 8.009/1990',text:'O bem de família voluntário nasce por escritura ou testamento, dentro do limite patrimonial legal, e pode abranger imóvel e valores destinados à conservação. O bem de família legal decorre diretamente da Lei 8.009/1990 e protege a moradia contra dívidas civis, comerciais, fiscais e outras, ressalvadas exceções taxativas. A proteção também pode alcançar pessoa solteira, separada ou viúva.'},
    {id:'uniao-estavel',title:'União estável',basis:'CC, arts. 1.723 a 1.727; CF, art. 226, § 3º',text:'Configura-se pela convivência pública, contínua e duradoura estabelecida com objetivo de constituir família, sem prazo mínimo ou exigência geral de coabitação. Impedimentos matrimoniais em regra obstam o reconhecimento, ressalvada separação de fato ou judicial. Sem contrato escrito, aplica-se comunhão parcial no que couber; deveres pessoais, filiação e conversão em casamento seguem proteção equivalente.'},
    {id:'tutela-curatela-apoio',title:'Tutela, curatela e tomada de decisão apoiada',basis:'CC, arts. 1.728 a 1.783-A; Lei 13.146/2015',text:'Tutela protege menor sem pais no exercício do poder familiar e envolve nomeação, garantias, administração, prestação de contas e cessação. Curatela é excepcional, proporcional e pelo menor tempo possível, alcançando prioritariamente atos patrimoniais e negociais. Na tomada de decisão apoiada, pessoa com deficiência plenamente capaz escolhe apoiadores para auxiliá-la, sem substituição geral de vontade.'}
  ],
  'civ-sucessoes':[
    {id:'abertura-saisine',title:'Abertura da sucessão e princípio da saisine',basis:'CC, arts. 1.784 a 1.787',text:'A sucessão se abre com a morte, quando a herança se transmite automaticamente aos herdeiros legítimos e testamentários. A lei vigente na abertura rege sucessão e legitimação. O foro e o lugar da abertura relacionam-se ao último domicílio do falecido, com regras processuais subsidiárias. Saisine transfere a titularidade, mas não dispensa inventário e partilha.'},
    {id:'heranca-administracao',title:'Herança, indivisibilidade e administração',basis:'CC, arts. 1.788 a 1.797',text:'Herança reúne relações patrimoniais transmissíveis e é considerada universalidade indivisível até a partilha, regida em relação aos coerdeiros pelas normas do condomínio. A sucessão legítima atua quando não há testamento eficaz ou quanto à parte não abrangida. Administração inicial cabe a pessoas na ordem legal e depois ao inventariante, sem confundir herança com patrimônio pessoal dos herdeiros.'},
    {id:'vocacao-capacidade',title:'Vocação hereditária e capacidade para suceder',basis:'CC, arts. 1.798 a 1.803',text:'Podem suceder as pessoas nascidas ou concebidas ao tempo da abertura. Na sucessão testamentária, também podem ser chamadas pessoas jurídicas e filhos ainda não concebidos de pessoas indicadas e vivas, observadas condições e prazos. A lei exclui da nomeação certas pessoas ligadas à elaboração ou aprovação do testamento para preservar liberdade e autenticidade da vontade.'},
    {id:'aceitacao-renuncia',title:'Aceitação e renúncia da herança',basis:'CC, arts. 1.804 a 1.813',text:'Aceitação confirma a transmissão desde a abertura e pode ser expressa, tácita ou presumida. Renúncia retroage e exige escritura pública ou termo judicial; não pode ser parcial, condicional ou a termo. Credores do renunciante podem aceitar em seu nome mediante autorização nas condições legais. Cessão gratuita a todos os coerdeiros pode equivaler a renúncia, mas cessão dirigida costuma importar aceitação e transmissão.'},
    {id:'indignidade-deserdacao',title:'Indignidade e deserdação',basis:'CC, arts. 1.814 a 1.818 e 1.961 a 1.965',text:'Indignidade exclui sucessor que pratica uma das condutas graves previstas em lei e, em regra, depende de sentença em ação própria, ressalvadas inovações legais. Deserdação atinge herdeiro necessário por causa legal declarada em testamento e que deve ser provada. Os efeitos são pessoais: descendentes do excluído podem suceder como se ele tivesse morrido antes.'},
    {id:'jacente-vacante-peticao',title:'Herança jacente, vacante e petição de herança',basis:'CC, arts. 1.819 a 1.828',text:'Sem herdeiro conhecido, arrecadam-se e administram-se os bens como herança jacente, com editais para habilitação. Cumpridos requisitos e prazos, declara-se vacância e ocorre destinação ao poder público, sem aquisição imediata na abertura. Petição de herança permite ao verdadeiro herdeiro reconhecer sua qualidade e recuperar o acervo ou parte dele, com efeitos sobre possuidor e terceiros.'},
    {id:'ordem-vocacao',title:'Sucessão legítima e ordem de vocação',basis:'CC, arts. 1.829 a 1.844; STF, Tema 809',text:'A ordem chama descendentes em concorrência com cônjuge conforme o regime de bens, depois ascendentes com cônjuge, cônjuge sozinho e colaterais até o quarto grau. Concorrência, meação e herança são conceitos distintos. O companheiro submete-se ao mesmo regime sucessório do cônjuge conforme a decisão do STF, devendo-se afastar a antiga distinção do art. 1.790.'},
    {id:'necessarios-legitima',title:'Herdeiros necessários e legítima',basis:'CC, arts. 1.845 a 1.850',text:'Descendentes, ascendentes e cônjuge são herdeiros necessários e têm reserva de metade da herança, a legítima, calculada sobre patrimônio líquido com as regras de colação. O testador só dispõe livremente da metade disponível quando existirem necessários. Cláusulas restritivas sobre a legítima exigem justa causa declarada, e exclusão sucessória somente ocorre nos casos legais.'},
    {id:'representacao',title:'Direito de representação',basis:'CC, arts. 1.851 a 1.856',text:'Representação permite que descendentes ocupem o lugar do herdeiro pré-morto, recebendo por estirpe o que lhe caberia. Opera sem limite na linha reta descendente, nunca na ascendente, e na linha colateral apenas em favor de filhos de irmãos quando concorrem com irmãos do falecido. Não se representa renunciante, salvo situações sucessórias autônomas previstas em lei.'},
    {id:'testamento-geral',title:'Testamento em geral e capacidade de testar',basis:'CC, arts. 1.857 a 1.861',text:'Testamento é negócio unilateral, personalíssimo, formal, gratuito e revogável. Pode tratar da parte disponível e também de disposições não patrimoniais, como reconhecimento de filho. A legítima limita a liberdade patrimonial. Capacidade ativa é aferida no momento do ato: maiores de 16 anos podem testar se tiverem discernimento, e incapacidade superveniente não invalida testamento válido.'},
    {id:'formas-testamento',title:'Formas ordinárias, formas especiais e codicilo',basis:'CC, arts. 1.862 a 1.896',text:'Testamentos ordinários são público, cerrado e particular, cada qual com solenidades, testemunhas, leitura, aprovação e confirmação próprias. Formas especiais — marítima, aeronáutica e militar — são excepcionais e sujeitas a requisitos e caducidade. Não se admitem testamentos conjuntivos. Codicilo serve para disposições simples, funeral e bens móveis de pequeno valor, sem substituir testamento amplo.'},
    {id:'disposicoes-testamentarias',title:'Disposições testamentárias',basis:'CC, arts. 1.897 a 1.911',text:'A vontade do testador deve ser interpretada para preservar sentido lícito e coerente. Nomeação pode ser pura, condicional, para certo fim ou por motivo; termos, condições impossíveis, pessoa incerta e delegação indevida seguem regras próprias. Erro na indicação pode ser corrigido pelo contexto, e disposições captatórias ou contrárias à lei são nulas.'},
    {id:'legados-acrescer',title:'Legados e direito de acrescer',basis:'CC, arts. 1.912 a 1.946',text:'Legado atribui bem ou vantagem determinada ao legatário e pode recair sobre coisa, crédito, quitação, alimento, usufruto ou prestação periódica. Aquisição, posse, riscos, frutos, despesas e caducidade variam conforme objeto e evento. Direito de acrescer redistribui quota vaga entre coerdeiros ou colegatários quando reunidos os requisitos da nomeação conjunta e não há substituto.'},
    {id:'substituicoes-fideicomisso',title:'Substituições e fideicomisso',basis:'CC, arts. 1.947 a 1.960',text:'O testador pode indicar substituto para o caso de o primeiro nomeado não querer ou não poder suceder, inclusive reciprocamente. No fideicomisso, o fiduciário recebe propriedade resolúvel e a transmite ao fideicomissário no evento previsto. O Código restringe fideicomisso em favor de pessoa ainda não concebida na abertura e limita encadeamentos sucessivos.'},
    {id:'reducao-revogacao',title:'Redução, revogação, rompimento e testamenteiro',basis:'CC, arts. 1.966 a 1.990',text:'Disposições que excedem a parte disponível sofrem redução para preservar a legítima. O testamento pode ser revogado total ou parcialmente por forma testamentária; incompatibilidade entre atos posteriores define a extensão. Rompimento decorre de superveniência de herdeiro nas hipóteses legais. O testamenteiro cumpre disposições, defende validade, presta contas e pode receber vintena dentro dos limites.'},
    {id:'inventario-sonegados-dividas',title:'Inventário, sonegados e pagamento de dívidas',basis:'CC, arts. 1.991 a 2.001; CPC, arts. 610 e seguintes',text:'Inventário identifica herdeiros, bens, dívidas, meação e tributos para preparar a partilha. O inventariante administra e representa o espólio sob controle judicial ou no procedimento extrajudicial cabível. Ocultação dolosa de bens pode gerar pena de sonegados. A herança responde pelas dívidas; depois da partilha, herdeiros respondem dentro das forças e na proporção do quinhão.'},
    {id:'colacao',title:'Colação e adiantamento da legítima',basis:'CC, arts. 2.002 a 2.012',text:'Descendentes que concorrem à sucessão do ascendente devem conferir doações recebidas em vida para igualar legítimas, salvo dispensa válida imputada à parte disponível. O valor e a forma da colação seguem as regras legais, e omissão pode caracterizar sonegação. Gastos ordinários de educação, sustento e outras liberalidades excluídas não entram automaticamente.'},
    {id:'partilha-garantia-anulacao',title:'Partilha, garantia dos quinhões e anulação',basis:'CC, arts. 2.013 a 2.027; CPC',text:'A partilha pode ser amigável ou judicial e deve buscar igualdade possível quanto a valor, natureza e qualidade dos bens. Bens indivisíveis podem ser adjudicados com reposição ou alienados. Coerdeiros garantem reciprocamente evicção dos quinhões nas condições legais. Partilha amigável pode ser anulada por vícios, e a judicial rescindida ou impugnada pelos meios e prazos próprios.'}
  ]
};

var originalRenderCivil=window.renderCivilMaster;

function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])})}
function load(){
  try{
    var value=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');
    if(!value||typeof value!=='object')value={};
    if(!value.done||typeof value.done!=='object')value.done={};
    return value;
  }catch(e){return {done:{}}}
}
function save(value){
  value.version=1;value.updatedAt=new Date().toISOString();
  localStorage.setItem(STORAGE_KEY,JSON.stringify(value));
}
function isDone(state,moduleId,topicId){return !!(state.done&&state.done[moduleId]&&state.done[moduleId][topicId])}
function countDone(state,moduleId){return (THEORY[moduleId]||[]).filter(function(t){return isDone(state,moduleId,t.id)}).length}
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
function topicHtml(moduleId,topic,index,state){
  var done=isDone(state,moduleId,topic.id);
  var rich=!!(topic.sections||topic.table||topic.example||topic.trap||topic.memorize);
  return '<details class="ct-topic '+(rich?'ct-rich ':'')+(done?'done':'')+'" data-ct-topic="'+esc(topic.id)+'"><summary><span class="ct-index">'+String(index+1).padStart(2,'0')+'</span><span class="ct-title"><b>'+esc(topic.title)+'</b><small>'+esc(topic.basis)+'</small></span><span class="ct-status">'+(done?'✓':'Abrir')+'</span></summary><div class="ct-body">'+(rich?richTopicHtml(topic):'<p>'+esc(topic.text)+'</p>')+'<div class="ct-complete"><button type="button" class="'+(done?'done':'')+'" onclick="return civilTheorySubtopicToggle(&quot;'+esc(moduleId)+'&quot;,&quot;'+esc(topic.id)+'&quot;,this)">'+(done?'✓ Subtópico estudado — desfazer':'Marcar subtópico como estudado')+'</button></div></div></details>';
}
function shellHtml(moduleId,state){
  var topics=THEORY[moduleId]||[],done=countDone(state,moduleId),pct=topics.length?Math.round(done/topics.length*100):0;
  var complete=moduleId==='civ-pessoa-natural'||moduleId==='civ-pessoa-juridica'||moduleId==='civ-bens'||moduleId==='civ-negocio'||moduleId==='civ-prescricao-prova';
  return '<div class="ct-shell '+(complete?'ct-shell-complete':'')+'" data-ct-module="'+esc(moduleId)+'"><div class="ct-head"><div><span>'+(complete?'TEORIA COMPLETA DO PDF':'TEORIA ORGANIZADA DOS PDFs')+'</span><b>'+topics.length+' subtópicos para '+(complete?'aprender e revisar':'estudar em sequência')+'</b><small>Somente conteúdo teórico; as questões dos arquivos não foram importadas.</small></div><strong data-ct-count>'+done+'/'+topics.length+'</strong></div><div class="ct-meter"><span data-ct-bar style="width:'+pct+'%"></span></div><div class="ct-list">'+topics.map(function(topic,index){return topicHtml(moduleId,topic,index,state)}).join('')+'</div></div>';
}
function enhance(html){
  try{
    var parser=new DOMParser(),doc=parser.parseFromString('<div id="ct-root">'+html+'</div>','text/html'),root=doc.getElementById('ct-root');
    if(!root)return html;
    var state=load();
    Object.keys(THEORY).forEach(function(moduleId){
      var module=root.querySelector('[data-civil-analista="'+moduleId+'"]');if(!module)return;
      var sections=Array.from(module.querySelectorAll('.civil-a-section'));
      var theory=sections.find(function(section){var h=section.querySelector('h4');return h&&/teoria essencial/i.test(h.textContent||'')});
      if(!theory)return;
      var marker=theory.querySelector('.csp-topic-read');
      if(marker)marker.insertAdjacentHTML('beforebegin',shellHtml(moduleId,state));
      else theory.insertAdjacentHTML('beforeend',shellHtml(moduleId,state));
    });
    var meta=root.querySelector('.civil-a-meta');
    if(meta)meta.insertAdjacentHTML('beforeend','<span class="civil-a-chip ct-chip">Teoria ampliada · '+totalTopics()+' subtópicos</span>');
    return root.innerHTML;
  }catch(e){console.error('Teoria Civil organizada',e);return html}
}
function totalTopics(){return Object.keys(THEORY).reduce(function(sum,id){return sum+THEORY[id].length},0)}
function updateVisible(moduleId,state){
  var shell=document.querySelector('.ct-shell[data-ct-module="'+moduleId+'"]');if(!shell)return;
  var total=(THEORY[moduleId]||[]).length,done=countDone(state,moduleId),pct=total?Math.round(done/total*100):0;
  var count=shell.querySelector('[data-ct-count]'),bar=shell.querySelector('[data-ct-bar]');
  if(count)count.textContent=done+'/'+total;if(bar)bar.style.width=pct+'%';
}

window.civilTheorySubtopicToggle=function(moduleId,topicId,button){
  if(!THEORY[moduleId]||!THEORY[moduleId].some(function(t){return t.id===topicId}))return false;
  var state=load();state.done[moduleId]=state.done[moduleId]||{};
  var next=!state.done[moduleId][topicId];
  if(next)state.done[moduleId][topicId]={at:Date.now()};else delete state.done[moduleId][topicId];
  save(state);
  var topic=button&&button.closest?button.closest('.ct-topic'):null;
  if(topic){topic.classList.toggle('done',next);var status=topic.querySelector('.ct-status');if(status)status.textContent=next?'✓':'Abrir'}
  if(button){button.classList.toggle('done',next);button.textContent=next?'✓ Subtópico estudado — desfazer':'Marcar subtópico como estudado'}
  updateVisible(moduleId,state);
  return false;
};

if(typeof originalRenderCivil==='function')window.renderCivilMaster=function(){return enhance(originalRenderCivil.apply(this,arguments))};
window.__civilTheorySubtopicsSelfTest=function(){
  var moduleIds=Object.keys(THEORY),ids=[],moduleCounts={};moduleIds.forEach(function(m){moduleCounts[m]=THEORY[m].length;THEORY[m].forEach(function(t){ids.push(m+'::'+t.id)})});
  return {version:VERSION,storageKey:STORAGE_KEY,modulesEnhanced:moduleIds.length,totalTopics:ids.length,uniqueTopics:new Set(ids).size,moduleCounts:moduleCounts,module1Ids:(THEORY['civ-pessoa-natural']||[]).map(function(t){return t.id}),module1RichTopics:(THEORY['civ-pessoa-natural']||[]).filter(function(t){return !!(t.sections&&t.table&&t.example&&t.trap&&t.memorize)}).length,module2Ids:(THEORY['civ-pessoa-juridica']||[]).map(function(t){return t.id}),module2RichTopics:(THEORY['civ-pessoa-juridica']||[]).filter(function(t){return !!(t.sections&&t.table&&t.example&&t.trap&&t.memorize)}).length,module3Ids:(THEORY['civ-bens']||[]).map(function(t){return t.id}),module3RichTopics:(THEORY['civ-bens']||[]).filter(function(t){return !!(t.sections&&t.table&&t.example&&t.trap&&t.memorize)}).length,module4Ids:(THEORY['civ-negocio']||[]).map(function(t){return t.id}),module4RichTopics:(THEORY['civ-negocio']||[]).filter(function(t){return !!(t.sections&&t.table&&t.example&&t.trap&&t.memorize)}).length,module5Ids:(THEORY['civ-prescricao-prova']||[]).map(function(t){return t.id}),module5RichTopics:(THEORY['civ-prescricao-prova']||[]).filter(function(t){return !!(t.sections&&t.table&&t.example&&t.trap&&t.memorize)}).length,untouchedModules:['civ-empresa']};
};

var style=document.createElement('style');style.id='civil-theory-subtopics-v66107';style.textContent='\
.ct-shell{margin-top:11px;border:1px solid rgba(36,199,122,.34);border-radius:11px;background:linear-gradient(180deg,rgba(36,199,122,.065),rgba(139,124,255,.035));padding:11px}.ct-shell-complete{border-color:rgba(36,199,122,.52);box-shadow:inset 0 1px 0 rgba(255,255,255,.025)}.ct-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.ct-head span{display:block;color:#45d58e;font-size:8px;font-weight:900;letter-spacing:.08em}.ct-head b{display:block;margin-top:3px;font-size:11px}.ct-head small{display:block;margin-top:4px;color:var(--muted);font-size:8px;line-height:1.45}.ct-head>strong{color:#75e5ad;font-size:12px;white-space:nowrap}.ct-meter{height:5px;margin:9px 0 10px;border-radius:999px;overflow:hidden;background:var(--panel2)}.ct-meter span{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#24c77a,#8b7cff);transition:width .2s}.ct-list{display:grid;gap:6px}.ct-topic{border:1px solid var(--line);border-radius:9px;background:var(--panel);overflow:hidden}.ct-topic[open]{border-color:rgba(139,124,255,.42)}.ct-topic.done{border-color:rgba(36,199,122,.42)}.ct-topic summary{list-style:none;display:grid;grid-template-columns:30px minmax(0,1fr) auto;gap:9px;align-items:center;min-height:48px;padding:7px 9px;cursor:pointer}.ct-topic summary::-webkit-details-marker{display:none}.ct-topic summary:hover{background:var(--surface-hover)}.ct-index{width:27px;height:27px;display:grid;place-items:center;border:1px solid var(--line2);border-radius:7px;background:var(--panel2);color:var(--muted);font-size:8px;font-weight:900}.ct-topic.done .ct-index{border-color:#24c77a;background:rgba(36,199,122,.1);color:#75e5ad}.ct-title b{display:block;font-size:10px;line-height:1.35}.ct-title small{display:block;margin-top:3px;color:#8b7cff;font-size:8px}.ct-status{color:var(--muted);font-size:8px;font-weight:800}.ct-topic.done .ct-status{color:#65dfa3}.ct-body{padding:0 11px 11px 48px;border-top:1px solid var(--line)}.ct-body p{margin:10px 0 0;color:var(--muted);font-size:10px;line-height:1.68}.ct-rich .ct-body{padding:3px 18px 16px 48px}.ct-rich .ct-lead{color:var(--text);font-size:11px;line-height:1.75}.ct-section{margin-top:16px}.ct-section h5{margin:0 0 7px;color:#b8afff;font-size:10px;letter-spacing:.015em}.ct-section p{margin-top:0}.ct-section ul,.ct-callout ul{margin:0;padding-left:18px;color:var(--muted);font-size:10px;line-height:1.65}.ct-section li+li,.ct-callout li+li{margin-top:5px}.ct-table-wrap{margin-top:16px;overflow-x:auto;border:1px solid var(--line);border-radius:9px}.ct-table-wrap table{width:100%;border-collapse:collapse;min-width:520px;font-size:9px;line-height:1.5}.ct-table-wrap th,.ct-table-wrap td{padding:8px 9px;text-align:left;vertical-align:top;border-bottom:1px solid var(--line);border-right:1px solid var(--line)}.ct-table-wrap th:last-child,.ct-table-wrap td:last-child{border-right:0}.ct-table-wrap tr:last-child td{border-bottom:0}.ct-table-wrap th{background:var(--panel2);color:#b8afff;font-weight:900}.ct-table-wrap td{color:var(--muted)}.ct-callout{margin-top:12px;padding:10px 11px;border:1px solid var(--line);border-radius:9px;background:var(--panel2)}.ct-callout>b,.ct-basis>b{display:block;margin-bottom:4px;font-size:9px;letter-spacing:.035em}.ct-callout p{margin:0;font-size:10px;line-height:1.65}.ct-example{border-color:rgba(59,130,246,.32);background:rgba(59,130,246,.055)}.ct-example>b{color:#7db5ff}.ct-trap{border-color:rgba(245,158,11,.38);background:rgba(245,158,11,.06)}.ct-trap>b{color:#fbbf55}.ct-memorize{border-color:rgba(36,199,122,.38);background:rgba(36,199,122,.065)}.ct-memorize>b{color:#65dfa3}.ct-basis{display:flex;align-items:center;gap:9px;margin-top:12px;padding:9px 11px;border:1px dashed rgba(139,124,255,.4);border-radius:9px;color:var(--muted);font-size:9px}.ct-basis b{margin:0;color:#b8afff}.ct-complete{display:flex;justify-content:flex-end;margin-top:10px;padding-top:9px;border-top:1px dashed var(--line)}.ct-complete button{min-height:34px;border:1px solid rgba(139,124,255,.42);border-radius:8px;background:rgba(139,124,255,.08);color:#b8afff;padding:7px 11px;font-size:9px;font-weight:800;cursor:pointer}.ct-complete button.done{border-color:rgba(36,199,122,.52);background:rgba(36,199,122,.1);color:#75e5ad}.ct-chip{border-color:rgba(36,199,122,.45)!important;color:#65dfa3!important}\
@media(max-width:760px){.ct-shell{padding:10px}.ct-topic summary{grid-template-columns:30px minmax(0,1fr) auto;min-height:54px}.ct-title b{font-size:11px}.ct-title small,.ct-status,.ct-head small{font-size:9px}.ct-body,.ct-rich .ct-body{padding-left:12px;padding-right:12px}.ct-body p,.ct-rich .ct-lead{font-size:11px;line-height:1.72}.ct-section h5{font-size:11px}.ct-section ul,.ct-callout ul,.ct-callout p{font-size:11px}.ct-table-wrap table{font-size:10px}.ct-callout{padding:11px}.ct-complete button{width:100%;min-height:42px;font-size:10px}}';document.head.appendChild(style);

function rerender(){try{if(typeof window.renderAll==='function')window.renderAll();else if(typeof window.renderSubjects==='function')window.renderSubjects()}catch(e){console.error('Renderização da teoria civil',e)}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(rerender,0)},{once:true});else setTimeout(rerender,0);
})();
