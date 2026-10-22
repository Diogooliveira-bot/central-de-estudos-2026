import importlib.util
import json
from pathlib import Path

from docx import Document
from docx.shared import Pt


ROOT = Path(__file__).resolve().parents[1]
TEMPLATE = Path('/workspace/scratch/150b36589797/upload/01-CF-M02-Apostila-Didatica-1.docx')
SOURCE = Path('/workspace/scratch/150b36589797/upload/CF-M04-Organizacao-do-Estado-Teoria-completa.txt')
OUT = Path('/workspace/scratch/150b36589797/output/cf-m04/CF-M04-Apostila-Didatica-1.docx')


def load_base_builder():
    path = ROOT / 'scripts/build-cf-m01-docx.py'
    spec = importlib.util.spec_from_file_location('cf_m01_docx_builder', path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


B = load_base_builder()


def p(doc, text, style='Normal'):
    return B.add_rich_paragraph(doc, text, style)


def h(doc, text, level=1):
    return B.add_heading(doc, text, level)


def bullets(doc, items):
    for item in items:
        p(doc, item, 'List Bullet')


def table(doc, headers, rows):
    return B.add_table(doc, [headers, *rows])


def update_running_text(doc):
    for section in doc.sections:
        for container in (section.header, section.footer):
            for paragraph in container.paragraphs:
                for run in paragraph.runs:
                    run.text = run.text.replace('CF M02', 'CF M04')


def add_cover(doc):
    top = doc.add_paragraph(style='Normal')
    run = top.add_run('BASE COMPLETA')
    B.add_run_format(run, size=12, bold=True, color='142F50')
    top.paragraph_format.space_after = Pt(18)
    doc.add_paragraph('Organização do Estado', style='Title')
    doc.add_paragraph('Direito Constitucional • CF M04', style='Subtitle')
    doc.add_paragraph('Teoria explicada e aprofundamento para concursos de tribunais', style='Subtitle')
    meta = doc.add_paragraph('Edição didática • 22 de outubro de 2026', style='Normal')
    meta.paragraph_format.space_before = Pt(10)
    intro = doc.add_paragraph(
        'Compreenda como a Federação distribui autonomia competências bens e mecanismos de intervenção.',
        style='Normal',
    )
    intro.paragraph_format.space_before = Pt(18)
    intro.paragraph_format.space_after = Pt(20)


QUESTIONS = [
    {
        'n': 1, 'difficulty': 'Fácil',
        'q': 'Qual afirmação diferencia corretamente soberania e autonomia na Federação brasileira?',
        'options': [
            'Cada Estado possui soberania externa e a União possui apenas autonomia.',
            'A República Federativa do Brasil é soberana; União, Estados, Distrito Federal e Municípios são autônomos.',
            'Somente União e Estados possuem autonomia.',
            'Municípios possuem soberania apenas em assuntos locais.',
        ],
        'answer': 1,
        'explanation': 'Soberania pertence ao Estado federal brasileiro. Os entes federativos exercem autonomia dentro das competências e limites definidos pela Constituição.'
    },
    {
        'n': 2, 'difficulty': 'Fácil',
        'q': 'O Território Federal, se criado, terá qual posição constitucional?',
        'options': [
            'Será ente federativo autônomo equivalente a Estado.',
            'Integrará a União e não será ente federativo autônomo.',
            'Será Município especial.',
            'Integrará o Distrito Federal.',
        ],
        'answer': 1,
        'explanation': 'O art. 18 inclui União, Estados, Distrito Federal e Municípios como entes autônomos. Território Federal integra a União.'
    },
    {
        'n': 3, 'difficulty': 'Fácil',
        'q': 'Qual associação entre artigo e tipo de competência está correta?',
        'options': [
            'Art. 21 — legislativa concorrente.',
            'Art. 22 — material comum.',
            'Art. 23 — material comum.',
            'Art. 24 — material exclusiva da União.',
        ],
        'answer': 2,
        'explanation': 'O art. 23 distribui tarefas administrativas comuns a União, Estados, Distrito Federal e Municípios.'
    },
    {
        'n': 4, 'difficulty': 'Fácil',
        'q': 'A competência estadual prevista no art. 25, § 1º é denominada:',
        'options': ['Privativa delegada.', 'Comum cooperativa.', 'Residual ou remanescente.', 'Exclusiva internacional.'],
        'answer': 2,
        'explanation': 'Aos Estados pertencem as competências que não lhes sejam vedadas e não tenham sido atribuídas constitucionalmente a outro ente.'
    },
    {
        'n': 5, 'difficulty': 'Média',
        'q': 'Lei complementar federal autoriza os Estados a legislar sobre questão específica de matéria do art. 22. A autorização é constitucional?',
        'options': [
            'Não, porque competência privativa nunca admite autorização.',
            'Sim, pois o parágrafo único do art. 22 admite autorização por lei complementar para questões específicas.',
            'Sim, mas apenas mediante lei ordinária federal.',
            'Não, porque apenas Municípios podem receber essa autorização.',
        ],
        'answer': 1,
        'explanation': 'A delegação prevista no art. 22 exige lei complementar federal e limita-se a questões específicas. Não transfere integralmente a matéria.'
    },
    {
        'n': 6, 'difficulty': 'Média',
        'q': 'Na ausência de norma geral federal sobre matéria concorrente, um Estado edita disciplina própria. Posteriormente surge norma geral federal incompatível. O que acontece?',
        'options': [
            'A lei estadual é automaticamente revogada por inteiro.',
            'A lei federal é inválida porque a matéria já foi ocupada pelo Estado.',
            'Fica suspensa a eficácia da lei estadual no ponto contrário à norma geral federal.',
            'As duas leis deixam de produzir efeitos.',
        ],
        'answer': 2,
        'explanation': 'O art. 24, § 4º fala em suspensão da eficácia no que for contrário, e não em revogação automática da lei estadual.'
    },
    {
        'n': 7, 'difficulty': 'Média',
        'q': 'Município proíbe completamente o transporte privado individual por aplicativo. À luz do Tema 967 do STF, a medida é:',
        'options': [
            'Válida, porque todo transporte é assunto exclusivamente local.',
            'Inválida, pois a regulamentação municipal não pode proibir a atividade nem contrariar parâmetros federais.',
            'Válida apenas se aprovada por plebiscito.',
            'Inválida somente por falta de lei complementar estadual.',
        ],
        'answer': 1,
        'explanation': 'Municípios e Distrito Federal podem regulamentar e fiscalizar, mas não proibir ou restringir de modo incompatível com a livre iniciativa e a legislação federal.'
    },
    {
        'n': 8, 'difficulty': 'Média',
        'q': 'A criação ordinária de novo Município exige qual conjunto constitucional?',
        'options': [
            'Lei federal ordinária e referendo nacional.',
            'Lei estadual, período definido por lei complementar federal, estudos de viabilidade e plebiscito das populações envolvidas.',
            'Emenda à Constituição estadual e consulta apenas à população do novo Município.',
            'Decreto do Governador e aprovação do Senado.',
        ],
        'answer': 1,
        'explanation': 'O art. 18, § 4º reúne essas etapas. A falta da lei complementar federal impede novas criações pelo procedimento ordinário.'
    },
    {
        'n': 9, 'difficulty': 'Difícil',
        'q': 'O Poder Judiciário estadual está coagido e impedido de exercer suas funções. Qual é o gatilho constitucional da intervenção federal?',
        'options': [
            'Solicitação do Governador ao Congresso.',
            'Requisição do Supremo Tribunal Federal.',
            'Representação do Prefeito ao Superior Tribunal de Justiça.',
            'Decreto autônomo do Presidente sem provocação e sem fundamento constitucional.',
        ],
        'answer': 1,
        'explanation': 'Quando a coação recai sobre o Judiciário, a intervenção depende de requisição do STF. Para Legislativo ou Executivo local coagido ou impedido, a Constituição trabalha com solicitação do respectivo Poder.'
    },
    {
        'n': 10, 'difficulty': 'Difícil',
        'q': 'Qual alternativa descreve corretamente a relação entre os arts. 23, 24 e 30, II?',
        'options': [
            'Municípios integram expressamente o caput do art. 24.',
            'O art. 23 é legislativo e o art. 24 é administrativo.',
            'O art. 23 atribui atuação material comum; o art. 24 prevê legislação concorrente entre União, Estados e DF; Municípios suplementam pelo art. 30, II.',
            'Somente a União pode atuar nas matérias dos arts. 23 e 24.',
        ],
        'answer': 2,
        'explanation': 'A banca costuma misturar os três dispositivos. O Município participa da execução comum do art. 23 e possui competência suplementar pelo art. 30, II, mas não aparece no caput do art. 24.'
    },
]


REVIEW_QUESTIONS = [
    {
        'n': 1, 'difficulty': 'Fácil',
        'q': 'Certo ou errado: a União e a República Federativa do Brasil são a mesma pessoa jurídica.',
        'options': ['Certo.', 'Errado.'], 'answer': 1,
        'explanation': 'A União é ente federativo e pessoa jurídica de direito público interno. A República Federativa do Brasil é o Estado soberano.'
    },
    {
        'n': 2, 'difficulty': 'Fácil',
        'q': 'Certo ou errado: o Distrito Federal pode ser dividido em Municípios.',
        'options': ['Certo.', 'Errado.'], 'answer': 1,
        'explanation': 'A Constituição proíbe a divisão do Distrito Federal em Municípios.'
    },
    {
        'n': 3, 'difficulty': 'Média',
        'q': 'Certo ou errado: lei ordinária federal pode autorizar Estados a legislar amplamente sobre matéria do art. 22.',
        'options': ['Certo.', 'Errado.'], 'answer': 1,
        'explanation': 'A autorização depende de lei complementar e alcança apenas questões específicas.'
    },
    {
        'n': 4, 'difficulty': 'Média',
        'q': 'Certo ou errado: compete ao Município fixar o horário de funcionamento do comércio local.',
        'options': ['Certo.', 'Errado.'], 'answer': 0,
        'explanation': 'A Súmula Vinculante 38 reconhece essa competência municipal por se tratar de assunto de interesse local.'
    },
    {
        'n': 5, 'difficulty': 'Difícil',
        'q': 'Certo ou errado: toda intervenção exige apreciação posterior do Poder Legislativo.',
        'options': ['Certo.', 'Errado.'], 'answer': 1,
        'explanation': 'A Constituição prevê hipóteses em que o controle político é dispensado e, se suficiente, o decreto pode limitar-se à suspensão do ato impugnado.'
    },
]


def add_question(doc, q, review=False):
    label = 'Revisão' if review else 'Questão'
    h(doc, f"{label} {q['n']} {q['difficulty']}", 2)
    p(doc, q['q'])
    for i, option in enumerate(q['options']):
        p(doc, f"{chr(65 + i)}) {option}")
    p(doc, f"Resposta comentada. {chr(65 + q['answer'])}. {q['explanation']}")


def build_body(doc):
    h(doc, 'Leitura orientada', 1)
    p(doc, 'Pense em três problemas. Um Estado quer editar regra sobre matéria nacional. Um Município pretende organizar um serviço local. O Governo Federal cogita intervir em uma unidade da Federação. Para resolver cada caso, não basta reconhecer o nome do ente: é preciso descobrir de onde vem a competência, qual é o limite da autonomia e se a Constituição autorizou a medida.')
    p(doc, 'Este módulo funciona como um mapa. Primeiro, identifica quem integra a Federação. Depois, mostra quais tarefas e leis pertencem a cada ente. Por fim, explica quando a autonomia pode ser temporariamente restringida por intervenção. A sequência evita o erro mais comum de prova: decorar artigos sem compreender a função de cada um.')
    p(doc, 'Se estiver começando, use a regra de bolso 21 faz, 22 legisla privativamente, 23 todos fazem, 24 União Estados e DF legislam concorrentemente, 25 guarda o residual estadual e 30 cuida do interesse local. Se já possui base, concentre-se nos limites, nas exceções e na jurisprudência.')

    h(doc, 'Percurso do módulo', 2)
    bullets(doc, [
        'Aula 1 • Federação soberania autonomia e indissolubilidade.',
        'Aula 2 • União Estados Distrito Federal Municípios e Territórios.',
        'Aula 3 • Alterações territoriais e vedações federativas.',
        'Aula 4 • Bens da União e dos Estados.',
        'Aula 5 • Método para identificar competências.',
        'Aula 6 • Arts. 21 a 24 e a diferença entre fazer e legislar.',
        'Aula 7 • Competências estaduais municipais e distritais.',
        'Aula 8 • Intervenção federal e estadual.',
        'Aula 9 • Jurisprudência aplicada.',
        'Aula 10 • Questões revisão ativa e checklist.',
    ])

    h(doc, '1 Federação e autonomia', 1)
    h(doc, '1.1 O que é forma de Estado', 2)
    p(doc, 'Forma de Estado descreve como o poder político se distribui no território. No Estado unitário há um centro político principal. Na Federação existem diferentes centros autônomos com competências definidas pela Constituição. Isso não significa vários países dentro do Brasil: o Estado brasileiro permanece uno e soberano no plano internacional.')
    p(doc, 'Caso explicado. Um governador não pode declarar independência do Estado. A autonomia permite organizar governo, editar normas e administrar matérias próprias; não concede soberania nem direito de separação.')
    table(doc, ['Elemento', 'Federação', 'Confederação'], [
        ['Fundamento', 'Constituição', 'Tratado entre membros'],
        ['Vínculo', 'Indissolúvel e sem direito de secessão', 'Pode admitir retirada conforme o pacto'],
        ['Poder dos membros', 'Autonomia constitucional', 'Soberania preservada pelos membros'],
        ['Solução de conflitos', 'Órgão jurisdicional constitucional', 'Mecanismos previstos no tratado'],
    ])
    p(doc, 'A forma federativa é protegida como cláusula pétrea. A Constituição rígida, a repartição de competências, a representação dos Estados no Senado, a solução judicial de conflitos federativos e a intervenção excepcional ajudam a preservar o pacto.')

    h(doc, '1.2 Soberania não é autonomia', 2)
    table(doc, ['Conceito', 'Titular', 'Alcance'], [
        ['Soberania', 'República Federativa do Brasil', 'Poder estatal supremo e atuação internacional'],
        ['Autonomia', 'União Estados Distrito Federal e Municípios', 'Capacidades exercidas dentro da Constituição'],
    ])
    p(doc, 'A autonomia costuma ser decomposta em auto-organização, autogoverno, autolegislação e autoadministração. A extensão concreta varia. Estados possuem Constituições estaduais; Municípios e Distrito Federal regem-se por Leis Orgânicas; o Distrito Federal acumula competências legislativas estaduais e municipais, mas não pode ser dividido em Municípios.')

    h(doc, '2 Organização político administrativa', 1)
    h(doc, '2.1 Quem integra a Federação', 2)
    table(doc, ['Unidade', 'Instrumento de organização', 'Ponto decisivo'], [
        ['União', 'Constituição Federal e legislação federal', 'É ente federativo interno e não se confunde com o Estado soberano'],
        ['Estados', 'Constituição estadual e leis estaduais', 'Possuem competência residual'],
        ['Distrito Federal', 'Lei Orgânica', 'Acumula competências estaduais e municipais e não se divide em Municípios'],
        ['Municípios', 'Lei Orgânica', 'Atuam especialmente no interesse local'],
        ['Territórios Federais', 'Lei federal', 'Integram a União e não são entes federativos autônomos'],
    ])
    p(doc, 'Brasília é a Capital Federal. A expressão “União” designa um dos entes federativos e uma pessoa jurídica de direito público interno. A expressão “República Federativa do Brasil” designa o Estado soberano que mantém relações internacionais. Trocar essas ideias leva a erros em questões sobre bens, competências e representação externa.')

    h(doc, '2.2 União', 2)
    p(doc, 'A União possui competências materiais e legislativas enumeradas principalmente nos arts. 21 e 22, participa das competências comum e concorrente e possui os bens listados no art. 20. Um bem pertencer à União não significa que toda atividade relacionada a ele esteja sujeita apenas à legislação federal. Competência patrimonial, administrativa e legislativa devem ser examinadas separadamente.')

    h(doc, '2.3 Estados', 2)
    p(doc, 'Os Estados organizam-se por Constituições e leis próprias, observando os princípios da Constituição Federal. Sua regra geral é residual: exercem competências que não lhes sejam vedadas nem tenham sido atribuídas a outro ente. Também exploram serviços locais de gás canalizado e podem instituir, por lei complementar estadual, regiões metropolitanas, aglomerações urbanas e microrregiões formadas por Municípios limítrofes para funções públicas de interesse comum.')
    p(doc, 'Aprofundamento. Competência residual não significa competência ilimitada. Antes de concluir que a matéria pertence ao Estado, verifique se a Constituição a reservou à União, ao Município ou ao Distrito Federal, ou se a colocou em regime comum ou concorrente.')

    h(doc, '2.4 Distrito Federal', 2)
    p(doc, 'A Lei Orgânica distrital é votada em dois turnos, com interstício mínimo de dez dias, e aprovada por dois terços da Câmara Legislativa. O Distrito Federal não possui Municípios e recebe, em regra, competências legislativas reservadas aos Estados e aos Municípios.')
    p(doc, 'Alguns serviços distritais têm organização e manutenção atribuídas à União, conforme a Constituição, como Poder Judiciário, Ministério Público, Defensoria Pública e polícias do Distrito Federal. Isso não retira a autonomia distrital; apenas expressa uma distribuição constitucional específica.')

    h(doc, '2.5 Municípios', 2)
    p(doc, 'A Lei Orgânica municipal também exige dois turnos, interstício mínimo de dez dias e aprovação por dois terços da Câmara Municipal. A competência municipal gira em torno do interesse local, da suplementação de normas federais e estaduais e da prestação de serviços públicos locais.')
    table(doc, ['Competência municipal', 'Como aparece no caso concreto'], [
        ['Legislar sobre interesse local', 'Horário de funcionamento do comércio local'],
        ['Suplementar legislação federal e estadual', 'Completar a disciplina sem contrariar norma válida'],
        ['Organizar serviços locais', 'Transporte coletivo e serviços urbanos'],
        ['Ordenar o território', 'Planejamento e controle do uso do solo'],
        ['Proteger patrimônio local', 'Medidas de preservação histórico cultural'],
        ['Atuar em educação e saúde', 'Cooperação técnica e financeira com União e Estado'],
    ])
    p(doc, 'Caso resolvido. O Município pode fixar o horário do comércio por interesse local. Isso não autoriza contrariar lei federal válida sobre matéria privativa da União. Interesse local não significa isolamento da ordem constitucional.')

    h(doc, '2.6 Territórios Federais', 2)
    p(doc, 'Territórios Federais integram a União. Se possuírem mais de cem mil habitantes, a Constituição prevê órgãos judiciários de primeira e segunda instâncias, membros do Ministério Público, defensores públicos federais e Câmara Territorial. A existência desses órgãos não converte o Território em ente federativo autônomo.')

    h(doc, '3 Alterações territoriais e vedações', 1)
    h(doc, '3.1 Estados e Municípios', 2)
    table(doc, ['Mudança', 'Etapas constitucionais centrais'], [
        ['Estados e Territórios', 'Plebiscito da população diretamente interessada e lei complementar do Congresso Nacional'],
        ['Municípios', 'Lei estadual no período definido por lei complementar federal, estudos de viabilidade e plebiscito das populações envolvidas'],
    ])
    p(doc, 'O plebiscito favorável para alteração envolvendo Estados é requisito necessário, mas não obriga o Congresso a aprovar a lei complementar. Para Municípios, a ausência da lei complementar federal prevista no art. 18, § 4º impede novas criações pelo procedimento ordinário. A prova costuma apresentar o plebiscito como se fosse a única etapa; isso está errado.')

    h(doc, '3.2 Vedações do artigo 19', 2)
    bullets(doc, [
        'Estabelecer cultos religiosos ou igrejas, subvencioná-los, embaraçar seu funcionamento ou manter relação de dependência ou aliança, ressalvada a colaboração de interesse público na forma da lei.',
        'Recusar fé aos documentos públicos.',
        'Criar distinções entre brasileiros ou preferências entre si.',
    ])
    p(doc, 'Essas vedações alcançam todos os entes. Elas protegem laicidade estatal, circulação nacional dos documentos públicos e igualdade federativa. Colaboração de interesse público com entidade religiosa não se confunde com dependência ou aliança institucional.')

    h(doc, '4 Bens da União e dos Estados', 1)
    p(doc, 'Os arts. 20 e 26 distribuem patrimônios públicos. Em vez de decorar listas isoladas, observe o critério: bens de alcance nacional, fronteiriço, internacional ou estratégico aparecem com frequência no domínio da União; bens não reservados à União e ligados ao território estadual podem pertencer aos Estados.')
    table(doc, ['União exemplos', 'Estados exemplos'], [
        ['Terras devolutas indispensáveis à defesa de fronteiras fortificações vias federais e preservação ambiental', 'Terras devolutas não compreendidas entre as da União'],
        ['Rios que banhem mais de um Estado sirvam de limite internacional ou se estendam a território estrangeiro', 'Águas superficiais ou subterrâneas ressalvadas as decorrentes de obras da União'],
        ['Mar territorial plataforma continental zona econômica exclusiva e recursos naturais correspondentes', 'Ilhas fluviais e lacustres não pertencentes à União'],
        ['Recursos minerais inclusive do subsolo e sítios arqueológicos', 'Outros bens definidos pelo art. 26 e pela ordem constitucional'],
    ])
    p(doc, 'Pegadinha. O recurso mineral pertence à União, mas isso não resolve sozinho quem legisla sobre toda atividade econômica ou ambiental ligada à mineração. Examine também os arts. 22, 23 e 24.')

    h(doc, '5 Repartição de competências', 1)
    h(doc, '5.1 O método que evita confusão', 2)
    p(doc, 'A primeira pergunta é sobre o verbo. O enunciado descreve executar uma tarefa pública ou criar uma norma? A segunda é sobre o interesse predominante: nacional, regional ou local. A terceira é sobre o regime constitucional: exclusivo, privativo, comum, concorrente, residual ou suplementar.')
    table(doc, ['Dispositivo', 'Natureza', 'Quem exerce', 'Ideia central'], [
        ['Art. 21', 'Material exclusiva', 'União', 'Executar administrar explorar manter'],
        ['Art. 22', 'Legislativa privativa', 'União', 'Legislar sobre matérias nacionais enumeradas'],
        ['Art. 23', 'Material comum', 'União Estados DF e Municípios', 'Atuação administrativa cooperativa'],
        ['Art. 24', 'Legislativa concorrente', 'União Estados e DF', 'Normas gerais e suplementação'],
        ['Art. 25 § 1º', 'Residual', 'Estados', 'O que não foi vedado nem atribuído a outro ente'],
        ['Art. 30', 'Local e suplementar', 'Municípios', 'Interesse local serviços locais e complementação normativa'],
    ])
    p(doc, 'Regra de bolso. Art. 21 faz; art. 22 legisla privativamente; art. 23 todos fazem; art. 24 União, Estados e Distrito Federal legislam concorrentemente; art. 25 deixa o residual aos Estados; art. 30 cuida do local.')

    h(doc, '5.2 Artigo 21 competência material exclusiva', 2)
    p(doc, 'O art. 21 reúne tarefas administrativas da União: relações internacionais, guerra e paz, emissão de moeda, reservas cambiais, serviço postal, telecomunicações, energia, transportes interestaduais e internacionais, defesa contra calamidades e serviços específicos do Distrito Federal, entre outras. É competência material exclusiva. Não aplique aqui a delegação do parágrafo único do art. 22, que pertence à competência legislativa privativa.')

    h(doc, '5.3 Artigo 22 competência legislativa privativa', 2)
    p(doc, 'A União legisla privativamente sobre direito civil, comercial, penal, processual, eleitoral, agrário, marítimo, aeronáutico, espacial e do trabalho; desapropriação; águas e energia; informática e telecomunicações; trânsito e transporte; jazidas e minas; nacionalidade; populações indígenas; seguridade social; diretrizes e bases da educação; registros públicos; atividades nucleares; normas gerais de licitação e outras matérias enumeradas.')
    p(doc, 'O parágrafo único permite que lei complementar federal autorize os Estados a legislar sobre questões específicas. Três limites devem aparecer juntos: autorização federal, veículo lei complementar e recorte específico. Não há transferência completa da matéria nem autorização por lei ordinária.')

    h(doc, '5.4 Artigo 23 competência material comum', 2)
    p(doc, 'No art. 23, todos os entes cooperam administrativamente. Entre os exemplos estão proteção da Constituição e das instituições democráticas, saúde e assistência, patrimônio cultural, meio ambiente, florestas, fauna e flora, moradia e saneamento, combate à pobreza e educação para segurança do trânsito. Leis complementares fixam normas de cooperação para equilibrar desenvolvimento e bem-estar.')
    p(doc, 'Caso explicado. União, Estado e Município podem atuar na proteção ambiental. Isso não significa que todos possam legislar sem observar a divisão normativa dos arts. 22, 24 e 30. Executar políticas e produzir leis são perguntas diferentes.')

    h(doc, '5.5 Artigo 24 competência legislativa concorrente', 2)
    p(doc, 'Na concorrência, a União edita normas gerais e Estados e Distrito Federal suplementam. Se não existir lei federal de normas gerais, Estados e Distrito Federal exercem competência legislativa plena para atender suas peculiaridades. Quando surge norma geral federal, fica suspensa a eficácia da lei estadual no ponto incompatível. A lei estadual não é automaticamente revogada.')
    table(doc, ['Momento', 'Poder do Estado ou DF', 'Efeito'], [
        ['Existe norma geral federal', 'Competência suplementar', 'Detalha a disciplina sem contrariar a norma geral'],
        ['Não existe norma geral federal', 'Competência plena temporária', 'Atende peculiaridades regionais'],
        ['Norma geral federal surge depois', 'Lei estadual permanece no ordenamento', 'Eficácia suspensa apenas no ponto conflitante'],
    ])
    p(doc, 'Matérias recorrentes incluem direito tributário, financeiro, penitenciário, econômico e urbanístico; orçamento; produção e consumo; meio ambiente; responsabilidade por dano ambiental e ao consumidor; educação; previdência; saúde; assistência jurídica; pessoas com deficiência; infância e juventude; e organização das polícias civis.')

    h(doc, '5.6 Estados Municípios e Distrito Federal', 2)
    p(doc, 'Estados combinam competência residual com competências expressas e participação nos arts. 23 e 24. Municípios exercem interesse local, suplementação, serviços locais e demais atribuições do art. 30. O Distrito Federal acumula, em regra, competências legislativas estaduais e municipais, participa dos regimes comum e concorrente e não possui Municípios.')

    h(doc, '6 Intervenção', 1)
    h(doc, '6.1 Por que a intervenção é excepcional', 2)
    p(doc, 'A autonomia é a regra. A intervenção é medida temporária e taxativa para proteger o pacto federativo e valores constitucionais. A União não intervém nos Estados nem no Distrito Federal salvo as hipóteses do art. 34. O Estado não intervém em seus Municípios, e a União não intervém diretamente em Município fora de Território Federal, salvo a moldura do art. 35.')

    h(doc, '6.2 Intervenção federal', 2)
    table(doc, ['Hipótese do art. 34', 'Finalidade'], [
        ['Integridade nacional', 'Preservar a unidade do Estado'],
        ['Invasão estrangeira ou de uma unidade em outra', 'Repelir agressão territorial'],
        ['Grave comprometimento da ordem pública', 'Restabelecer normalidade institucional'],
        ['Livre exercício dos Poderes locais', 'Impedir coação ou bloqueio institucional'],
        ['Reorganização financeira', 'Corrigir situações taxativamente previstas'],
        ['Execução de lei federal ordem ou decisão judicial', 'Garantir autoridade da ordem jurídica'],
        ['Princípios constitucionais sensíveis', 'Proteger República democracia direitos humanos autonomia municipal contas e mínimos de educação e saúde'],
    ])
    p(doc, 'O procedimento varia conforme a causa. Legislativo ou Executivo local coagido ou impedido solicita a intervenção. Se a coação atingir o Judiciário, há requisição do STF. A desobediência a ordem ou decisão judicial pode envolver requisição do STF, STJ ou TSE. Para recusa à execução de lei federal e violação de princípio sensível, atua a representação do Procurador-Geral da República perante o STF nos termos do art. 36.')
    p(doc, 'O decreto presidencial especifica amplitude, prazo e condições e, se necessário, nomeia interventor. Em regra, é submetido ao Congresso Nacional em vinte e quatro horas. Nas hipóteses em que a Constituição dispensa o controle político, o decreto pode limitar-se à suspensão do ato impugnado, se isso bastar. Cessados os motivos, as autoridades afastadas retornam, salvo impedimento legal.')

    h(doc, '6.3 Intervenção estadual', 2)
    table(doc, ['Hipótese do art. 35', 'Núcleo da cobrança'], [
        ['Dívida fundada', 'Falta de pagamento por dois anos consecutivos sem força maior'],
        ['Prestação de contas', 'Contas devidas não são apresentadas na forma da lei'],
        ['Educação e saúde', 'Município não aplica os mínimos constitucionais'],
        ['Representação no Tribunal de Justiça', 'Assegurar princípios da Constituição estadual ou executar lei ordem ou decisão judicial'],
    ])
    p(doc, 'Na hipótese dependente de provimento do Tribunal de Justiça, a Constituição dispensa apreciação pela Assembleia Legislativa e admite que o decreto se limite à suspensão do ato, se suficiente. Não conclua que toda intervenção segue exatamente o mesmo gatilho e o mesmo controle.')

    h(doc, '7 Jurisprudência aplicada', 1)
    table(doc, ['Entendimento', 'Como usar na questão'], [
        ['STF Tema 967', 'Município e DF regulamentam e fiscalizam transporte por aplicativo, mas não podem proibir nem contrariar parâmetros federais'],
        ['Súmula Vinculante 38', 'Município pode fixar horário de funcionamento do comércio local'],
        ['Competência concorrente', 'Suplementação quando há norma geral; competência plena temporária quando não há'],
        ['Criação de Municípios', 'Exige a lei complementar federal prevista no art. 18 § 4º para o procedimento ordinário'],
        ['Intervenção', 'Hipóteses são excepcionais e não podem ser ampliadas livremente por Constituição estadual'],
    ])
    p(doc, 'Caso resolvido. Lei municipal pode disciplinar fiscalização de motoristas por aplicativo, mas não eliminar a atividade nem contrariar a moldura federal de trânsito e transporte. A competência local existe, porém funciona dentro do sistema federativo.')

    h(doc, '8 Dez questões de aplicação', 1)
    p(doc, 'Resolva antes de consultar o comentário. As quatro primeiras questões são fáceis, as quatro seguintes são médias e as duas últimas são difíceis.')
    for q in QUESTIONS:
        add_question(doc, q)

    h(doc, '9 Conteúdo resumido', 1)
    p(doc, 'Federação. A República Federativa do Brasil é soberana. União, Estados, Distrito Federal e Municípios são autônomos, sem direito de secessão. Territórios integram a União e não são entes federativos.')
    p(doc, 'Entes. Estados possuem competência residual. O Distrito Federal acumula competências legislativas estaduais e municipais e não se divide em Municípios. Municípios cuidam especialmente do interesse local e da suplementação.')
    p(doc, 'Competências. Art. 21 é material exclusiva da União; art. 22 é legislativa privativa e admite autorização aos Estados por lei complementar para questões específicas; art. 23 é material comum; art. 24 é legislativa concorrente. Norma geral federal superveniente suspende a eficácia do conflito estadual.')
    p(doc, 'Intervenção. É exceção temporária e taxativa. Primeiro identifique a hipótese; depois, o gatilho constitucional; por fim, verifique decreto, controle político e cessação.')

    h(doc, '10 Cinco questões de revisão', 1)
    p(doc, 'Julgue certo ou errado e explique o motivo antes de consultar a resposta.')
    for q in REVIEW_QUESTIONS:
        add_question(doc, q, review=True)

    h(doc, '11 Revisão ativa', 1)
    h(doc, 'Revisão de cinco minutos', 2)
    bullets(doc, [
        'Diga quem é soberano e quem possui autonomia.',
        'Explique por que Território Federal não é ente federativo.',
        'Reconstrua a regra 21 22 23 24 25 e 30.',
        'Diferencie competência material de legislativa.',
        'Explique autorização do art. 22 e competência plena do art. 24.',
        'Diga o efeito de norma geral federal superveniente.',
        'Liste as hipóteses centrais de intervenção federal e estadual.',
    ])

    h(doc, 'O módulo em um minuto', 2)
    p(doc, 'O federalismo distribui poder sem dividir a soberania. Cada ente possui autonomia e competências constitucionais. União concentra matérias nacionais; Estados recebem o residual; Municípios cuidam do local; Distrito Federal acumula funções estaduais e municipais. A cooperação aparece no art. 23 e a legislação concorrente no art. 24. A intervenção restringe temporariamente a autonomia apenas nas hipóteses e pelo procedimento constitucional.')

    h(doc, 'O que decorar', 2)
    bullets(doc, [
        'Entes autônomos: União Estados Distrito Federal e Municípios.',
        'Território integra a União.',
        'Lei Orgânica do DF e do Município: dois turnos, dez dias e dois terços.',
        'Art. 19: cultos, fé aos documentos e distinções ou preferências.',
        'Art. 21 material exclusiva; art. 22 legislativa privativa.',
        'Art. 23 material comum; art. 24 legislativa concorrente.',
        'Art. 25 § 1º residual dos Estados; art. 30 interesse local e suplementação.',
        'Intervenção: arts. 34 a 36 e decreto submetido em regra em vinte e quatro horas.',
    ])

    h(doc, 'Pegadinhas que a prova usa', 2)
    p(doc, '“União e República Federativa do Brasil são sinônimos.” Errado: a União é um ente; a República é o Estado soberano.')
    p(doc, '“O art. 21 admite delegação por lei complementar.” Errado: a autorização a Estados está no art. 22 e alcança questões específicas de matéria legislativa.')
    p(doc, '“Municípios integram o caput do art. 24.” Errado: sua suplementação decorre do art. 30, II.')
    p(doc, '“Norma geral federal posterior revoga a lei estadual.” Errado: suspende a eficácia do que for incompatível.')
    p(doc, '“Plebiscito favorável cria automaticamente Estado ou Município.” Errado: existem outras etapas constitucionais.')
    p(doc, '“Toda intervenção depende de controle legislativo posterior.” Errado: há exceções constitucionais.')

    h(doc, 'Erros de estudo a corrigir', 2)
    p(doc, 'Decorar matérias sem observar o verbo. Correção: antes de escolher o artigo, pergunte se o caso envolve executar ou legislar.')
    p(doc, 'Tratar interesse predominante como critério absoluto. Correção: use-o para orientar, mas confira a distribuição textual da Constituição.')
    p(doc, 'Confundir competência plena do art. 24 com delegação do art. 22. Correção: a primeira nasce da ausência de norma geral; a segunda exige lei complementar federal.')
    p(doc, 'Começar intervenção pelo procedimento. Correção: primeiro confirme uma hipótese taxativa; sem hipótese constitucional, não existe intervenção válida.')

    h(doc, 'Checklist de domínio', 2)
    for item in [
        '☐ Explico a diferença entre soberania e autonomia.',
        '☐ Identifico os entes federativos e a posição dos Territórios.',
        '☐ Comparo Constituição estadual com Lei Orgânica distrital e municipal.',
        '☐ Reconstruo as etapas das alterações territoriais.',
        '☐ Distingo bens competências materiais e competências legislativas.',
        '☐ Aplico corretamente os arts. 21 22 23 24 25 e 30.',
        '☐ Explico autorização legislativa e competência plena sem confundi-las.',
        '☐ Distingo suspensão de eficácia de revogação.',
        '☐ Identifico hipótese gatilho e controle da intervenção.',
        '☐ Justifico as respostas das quinze questões do módulo.',
    ]:
        p(doc, item)
    p(doc, 'Se algum item ainda depender de adivinhação, retorne à aula correspondente antes de marcar o módulo como concluído.')

    h(doc, '12 Referências e fontes de consulta', 1)
    p(doc, 'Constituição da República Federativa do Brasil de 1988. Texto compilado, especialmente arts. 18 a 36. Consulta em 22 de outubro de 2026.')
    p(doc, 'Fonte oficial: https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm')
    p(doc, 'Supremo Tribunal Federal. Tema 967 da repercussão geral. Transporte privado individual por aplicativo e competência municipal.')
    p(doc, 'Fonte oficial: https://portal.stf.jus.br/jurisprudenciarepercussao/verAndamentoProcesso.asp?classeProcesso=RE&incidente=5206938&numeroProcesso=1054110&numeroTema=967')
    p(doc, 'Supremo Tribunal Federal. Súmula Vinculante 38. Horário de funcionamento do comércio local.')
    p(doc, 'Fonte oficial: https://portal.stf.jus.br/jurisprudencia/sumariosumulas.asp?base=26&sumula=2183')
    p(doc, 'Supremo Tribunal Federal. Constituição e jurisprudência sobre os arts. 18 e 30.')
    p(doc, 'Fonte oficial: https://portal.stf.jus.br/constituicao-supremo/artigo.asp?abrirArtigo=18&abrirBase=CF')
    p(doc, 'Base de partida: arquivo CF M04 de teoria completa enviado pelo usuário. O conteúdo foi reorganizado e ampliado pedagogicamente, com correção da distinção entre competência material exclusiva e legislativa privativa.')


def main():
    if not SOURCE.exists():
        raise FileNotFoundError(SOURCE)
    doc = Document(str(TEMPLATE))
    B.clear_body(doc)
    update_running_text(doc)
    add_cover(doc)
    build_body(doc)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    doc.save(str(OUT))
    print(json.dumps({'output': str(OUT), 'bytes': OUT.stat().st_size, 'questions': 15}, ensure_ascii=False))


if __name__ == '__main__':
    main()
