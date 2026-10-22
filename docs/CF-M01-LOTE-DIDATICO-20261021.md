# CF M01 — edição didática de trabalho

Data: 21/10/2026. Status: preparada localmente; não publicada.

## Correção do padrão visual

A primeira entrega do M01 foi substituída: usava leitor e apresentação diferentes do M02 de referência. A edição corrigida reutiliza o CSS da apostila `BASE_COMPLETA_CF_M02_INTERATIVA.html`, sem trocar sua paleta, tipografia, cabeçalho, cartões ou espaçamentos principais.

Cada tema agora repete: Em uma frase; Entenda de verdade; Como funciona na prática; O que diz a Constituição; Aprofundamento; Pegadinha; Revisão em 30 segundos; Teste com resposta oculta. Os modos Primeira leitura e Revisão rápida não apagam marcações. Há conclusão por tema, checklist final e preservação das quinze questões respondíveis. O conteúdo de todas as aulas permanece no arquivo, conferido por teste de cada parágrafo.

O HTML guiado é a referência visual corrigida. Sua integração ao leitor da Central será feita na etapa conjunta do lote: publicar somente os dados textuais no renderizador genérico não reproduziria esse novo visual. Não houve alteração da produção nem publicação de prévia externa nesta correção.

## Entrega

- Teoria completa em dez aulas progressivas, com revisão e referências.
- Teoria resumida para primeira leitura e revisão.
- Dez questões autorais (4 fáceis, 4 médias, 2 difíceis).
- Cinco questões autorais de revisão (2 fáceis, 2 médias, 1 difícil).
- Comentários sobre as alternativas por seu conteúdo, sem letras fixas incompatíveis com o embaralhamento do leitor.
- Revisão em cinco minutos; módulo em um minuto; memorização; pegadinhas; erros de estudo.
- Blocos comparativos responsivos e dez itens de checklist por leitura.
- Lei em Dia: destino preparado `cf-m01`, confirmado no catálogo local.
- Infográfico existente preservado, sem reconstrução ou alteração de permissões.

## Cobertura do arquivo original

| Base original | Localização na nova completa |
| --- | --- |
| Constitucionalismo e conceito | Aula 1 |
| Concepções e elementos | Aula 2 |
| Classificações da CF/88 | Aula 3 |
| Supremacia, validade, vigência, eficácia e aplicabilidade | Aula 4 |
| Eficácia plena, contida, limitada e programáticas | Aula 5 |
| Poder constituinte e limites | Aula 6 |
| Recepção, repristinação e desconstitucionalização | Aula 7 |
| Interpretação, mutação e Preâmbulo | Aula 8 |
| República, Federação, soberania popular e fundamentos | Aula 9 |
| Poderes, objetivos e relações internacionais | Aula 10 |
| Lei seca e jurisprudência | Aula 11 e fontes identificadas |
| Pegadinhas, memorização, exemplos e revisão | Distribuídos nas aulas e na revisão ativa |

## Conferência jurídica

Fontes oficiais e endereços estão na apostila. Conferidos: CF/88 (Planalto), LINDB art. 2º, § 3º (Planalto), ADI 815 (STF), ADI 2.076 (STF) e exemplo de recepção do CTN no registro da ADI 1.917 (STF).

Correções e ressalvas: recepção pode alterar o enquadramento formal; Constituição rígida não é imutável; limitada não é sem eficácia; normas originárias não se confundem com emendas; super-rigidez e poder decorrente distrital têm ressalva doutrinária; revisão do ADCT é excepcional e já exercida. Não se atribuiu autoria de banca nem frequência estatística às questões.

## Testes

- Testes específicos de M01 e M02: 12 aprovados, sem falhas, incluindo equivalência do CSS, sequência dos blocos, cobertura de cada parágrafo, alternância dos modos e persistência.
- Suíte geral: 134 testes; 133 aprovados, nenhuma falha, 1 ignorado.
- Comparações verificadas: células mantêm rótulos e não perdem colunas.
- Checklist: marcar, desmarcar, contador e reabertura; independência entre M01/M02 e completa/resumida.
- Navegador local: visual dos blocos; marcação preservada após recarregar; questão respondida com comentário correto; avanço para questão seguinte.
- Arquivo independente: não depende de autenticação, rede, banco de alunos ou publicação. Links oficiais exigem conexão.
- Limite: a persistência no arquivo depende de armazenamento local permitido pelo navegador. O arquivo avisa se esse recurso estiver indisponível. A homologação conjunta na Central será feita ao reunir o lote.

## Integração futura

Fonte editorial: `content/cf/editorial/m01-didatico.md`.

Dados preparados: `content/cf/m01-native-data.js`, preservando `w1`, número, título e URL do infográfico. Carregador e manifesto offline locais têm versão nova do M01.

Reconstrução: `CF_M01_OUTPUT_DIR=/caminho/de/saida node scripts/build-cf-m01-didatico.mjs`.

Testes específicos: `npm run test:cf-didatico`.

Nenhum push, merge ou deploy foi executado nesta etapa. M01 e M02 ficam no lote em preparação. Faltam três módulos a selecionar/enviar antes da revisão conjunta e de autorização para publicação.
