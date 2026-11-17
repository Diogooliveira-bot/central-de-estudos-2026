# Base Completa — responsividade e desempenho

Relatório de homologação · 16/11/2026. Alterações em branch; produção e main não foram publicadas por este trabalho.

Fonte medida: `81463c9a872967b5847f0de79ea3f55fea1c8371`. Referência: main `4defec04e2a99b4bce26f9a9573ae46a9c786454`. PRs #308, #310 e #311 revisados.

## A. Problemas confirmados

| Gravidade | Causa | Arquivos |
|---|---|---|
| Alta | Automático retornava escala 1 no celular; tablet alterava meta viewport; computador ampliava só parte da interface. | ui/tablet-scale-v1.js, ui/auto-scale-v1.css |
| Alta | Fontes em px e regras com !important mantinham menus, controles e leitores fora do ajuste. | index.html, CSS da experiência do aluno, leitores |
| Alta | A lista de módulos tinha teto de 870 px, inclusive em monitores grandes. | ui/disciplinas-foco-v1.css |
| Média | Regras sobrepostas de tablet fixavam altura e largura dos botões; o texto de Mais ficava cortado. | ui/tablet-scale-v1.css, ui/student-experience-v3.css |
| Alta | A lista aguardava o carregamento de teoria e scripts da disciplina; o carregador esperava grupos inteiros antes da execução. | central-discipline-loader.js, ui/disciplinas-foco-v1.js |
| Média | Revalidação forçada de scripts, estilos duplicados e catálogo administrativo na inicialização do aluno. | central-v119.html, central-discipline-loader.js, vercel.json |
| Média | Observadores reagiam a alterações sem relação com a seção ativa ou dentro da leitura. | ui/student-ux-core-v3.js, ui/disciplinas-foco-v1.js |

A limitação do viewport dinâmico em aparelhos físicos não foi medida: é uma hipótese de compatibilidade, além da inconsistência arquitetural confirmada no código. A autenticação já reaproveitava o usuário carregado; não foi removida nem contornada.

## B. Correções

- Um ajuste de tipografia por variáveis CSS e rem em telas e sobreposições; viewport permanece device-width. Sem zoom CSS parcial.
- Mesma chave central-v6:ui-scale:v1 e mesmos valores salvos: 0, 1, 1.15 e 1.3. Alteração imediata, recarga e rotação verificadas. Automático adapta a base por largura; Normal/Maior/Muito maior usam bases manuais.
- Lista de módulos com Grid proporcional e até 1920 px; painel de módulo até 1100 px e leitores mantêm seus limites próprios. Margens de 12–40 px. Menu de tablet em duas linhas.
- Catálogo gerado somente com números e títulos públicos de seis disciplinas. A lista aparece antes da teoria; ao abrir o módulo, o carregador autorizado e os componentes nativos continuam sendo usados.
- Downloads concorrentes limitados a oito, execução na ordem original assim que cada dependência chega; reutilização na sessão, repetição após falha sem executar novamente arquivos concluídos e interrupção da navegação obsoleta.
- Mantida a remoção dos 39 legados de Administrativo e cinco de Civil do PR #310. Nenhum conteúdo jurídico foi reescrito.
- Cache público de um dia apenas para CSS versionado de ui/. Conteúdo Premium, APIs, autenticação e dados privados continuam sujeitos às proteções existentes. Service worker respeita no-store e evita revalidar respostas explicitamente immutable.
- Medidas de autenticação, interface, download por arquivo, execução por arquivo, atualização do DOM e leitores. O ensaio também registra CPU de scripts/layout pelo Chromium.

A primeira abertura de módulo ainda pode baixar o conjunto da disciplina. Não foi implementado um desmembramento completo de toda a teoria por módulo. Isso evita prometer que a melhoria da lista elimina todo o tempo até a leitura.

## C. Comparação visual

As imagens são capturas originais de Chromium, sem geração artificial ou montagem da interface. As capturas completas estão nos artefatos da [execução de navegador](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/43850726558) e no pacote de entrega COMPARACAO.html.

| Dispositivo | Resolução da comparação | Arquivos principais |
|---|---|---|
| Celular | 390 × 844 | 390x844-home.png, 390x844-modules.png, 390x844-summary.png |
| Tablet | 820 × 1180 | 820x1180-home.png, 820x1180-modules.png, 820x1180-summary.png |
| Computador | 1920 × 1080 | 1920x1080-home.png, 1920x1080-modules.png, 1920x1080-summary.png |

Tamanho computado dos títulos de módulos após a correção:

| Largura | Automático | Normal | Maior | Muito maior |
|---|---|---|---|---|
| 390 px | 17px | 16px | 18.4px | 20.8px |
| 820 px | 17.6px | 16px | 18.4px | 20.8px |
| 1920 px | 19.2px | 16px | 18.4px | 20.8px |

Antes, as fontes computadas desses títulos permaneciam em 14 px no celular e 15 px no tablet/computador nas quatro opções. A emulação não reproduz de forma confiável o efeito óptico da alteração dinâmica de viewport em hardware real.

## D. Desempenho medido

Chromium real em GitHub Actions, aplicação servida por HTTP local com gzip, APIs e usuário Premium fictícios. Duas condições: rede local normal; rede limitada a 1,6 Mbps/150 ms junto com CPU 4×. Primeiro acesso em contexto novo; segundo no mesmo contexto com cache HTTP disponível. Service worker bloqueado neste ensaio. Uma amostra por condição/disciplina, sujeita à variação do runner.

Os 23,3 s do relatório PERFORMANCE_20261115.md são referência histórica, não o denominador desta comparação: ambiente, perfil de CPU e servidor diferem. Não se pode alegar redução em relação a esse número usando estes ensaios.

| Inicialização | Antes (s) | Depois (s) | Variação |
|---|---:|---:|---:|
| Normal · primeiro | 0,97 | 0,72 | +26.3% de redução |
| Normal · segundo | 0,74 | 0,50 | +32.6% de redução |
| 4G lento + CPU 4× · primeiro | 10,48 | 9,29 | +11.3% de redução |
| 4G lento + CPU 4× · segundo | 10,19 | 7,39 | +27.5% de redução |

A meta inicial era reduzir a inicialização em pelo menos 30%, idealmente. O resultado efetivo está na tabela; não se considera a meta atingida quando a medição ficar abaixo dela. Para as listas, a meta após o diagnóstico foi ficar abaixo de 1 s em 4G/CPU 4× e não aguardar a teoria.

Tempos em segundos. Cada célula é **antes → depois**. “Leitura” começa no clique no módulo e termina quando o texto da revisão aparece. “Total” soma lista + leitura e evita atribuir ganho à simples transferência de espera entre etapas. “Completa” é a abertura após a revisão, com a disciplina já carregada. “Reabrir” é voltar à lista na mesma sessão.

### Rede normal — primeiro acesso

| Disciplina | Lista | Leitura | Total | Completa | Reabrir |
|---|---:|---:|---:|---:|---:|
| Constitucional | 0,57 → 0,09 | 0,69 → 0,64 | 1,26 → 0,73 | 0,62 → 0,40 | 0,21 → 0,15 |
| Administrativo | 0,52 → 0,11 | 1,02 → 0,75 | 1,55 → 0,86 | 0,58 → 0,50 | 0,37 → 0,18 |
| Civil | 0,47 → 0,12 | 0,46 → 0,43 | 0,93 → 0,56 | 0,64 → 0,54 | 0,20 → 0,12 |
| Penal | 0,74 → 0,10 | 0,85 → 1,01 | 1,59 → 1,11 | 0,71 → 0,51 | 0,23 → 0,15 |
| Processo Civil | 1,04 → 0,11 | 1,01 → 1,88 | 2,05 → 1,99 | 0,88 → 0,65 | 0,24 → 0,17 |
| Processo Penal | 0,42 → 0,11 | 0,69 → 0,58 | 1,10 → 0,68 | 0,58 → 0,50 | 0,24 → 0,17 |
| Português | 0,21 → 0,13 | 0,72 → 0,51 | 0,93 → 0,64 | 0,49 → 0,36 | 0,22 → 0,13 |
| RLM | 0,19 → 0,15 | 0,37 → 0,27 | 0,56 → 0,42 | 0,26 → 0,22 | 0,10 → 0,12 |
| Informática | 0,22 → 0,12 | 0,36 → 0,20 | 0,57 → 0,32 | 0,16 → 0,13 | 0,15 → 0,11 |

### Rede normal — segundo acesso

| Disciplina | Lista | Leitura | Total | Completa | Reabrir |
|---|---:|---:|---:|---:|---:|
| Constitucional | 0,51 → 0,09 | 0,73 → 0,52 | 1,24 → 0,62 | 0,53 → 0,37 | 0,21 → 0,14 |
| Administrativo | 0,43 → 0,10 | 0,87 → 0,71 | 1,31 → 0,81 | 0,65 → 0,36 | 0,26 → 0,17 |
| Civil | 0,45 → 0,10 | 0,33 → 0,39 | 0,78 → 0,49 | 0,57 → 0,39 | 0,20 → 0,14 |
| Penal | 0,73 → 0,11 | 0,85 → 0,77 | 1,58 → 0,88 | 0,76 → 0,51 | 0,25 → 0,14 |
| Processo Civil | 0,95 → 0,11 | 0,91 → 1,45 | 1,86 → 1,56 | 1,00 → 0,66 | 0,26 → 0,17 |
| Processo Penal | 0,39 → 0,11 | 0,59 → 0,42 | 0,98 → 0,53 | 0,57 → 0,48 | 0,26 → 0,16 |
| Português | 0,28 → 0,16 | 0,60 → 0,41 | 0,88 → 0,57 | 0,51 → 0,33 | 0,21 → 0,13 |
| RLM | 0,19 → 0,14 | 0,29 → 0,23 | 0,49 → 0,36 | 0,24 → 0,24 | 0,17 → 0,13 |
| Informática | 0,22 → 0,14 | 0,35 → 0,21 | 0,57 → 0,34 | 0,18 → 0,13 | 0,16 → 0,12 |

### 4G lento + CPU 4× — primeiro acesso

| Disciplina | Lista | Leitura | Total | Completa | Reabrir |
|---|---:|---:|---:|---:|---:|
| Constitucional | 4,00 → 0,39 | 2,51 → 4,92 | 6,51 → 5,32 | 2,92 → 1,78 | 0,94 → 0,69 |
| Administrativo | 2,39 → 0,37 | 6,10 → 5,11 | 8,49 → 5,48 | 3,38 → 2,74 | 1,34 → 0,88 |
| Civil | 2,37 → 0,37 | 2,64 → 3,24 | 5,01 → 3,61 | 6,99 → 5,83 | 0,92 → 0,57 |
| Penal | 7,11 → 0,36 | 3,75 → 8,50 | 10,87 → 8,87 | 4,00 → 3,02 | 1,07 → 0,73 |
| Processo Civil | 8,30 → 0,37 | 6,26 → 10,28 | 14,56 → 10,66 | 5,55 → 3,75 | 1,23 → 0,82 |
| Processo Penal | 2,67 → 0,37 | 3,89 → 4,24 | 6,56 → 4,61 | 6,31 → 5,05 | 1,17 → 0,71 |
| Português | 0,86 → 0,52 | 4,54 → 3,75 | 5,41 → 4,28 | 1,98 → 1,28 | 0,90 → 0,55 |
| RLM | 0,84 → 0,44 | 1,00 → 0,84 | 1,84 → 1,28 | 0,87 → 0,64 | 0,71 → 0,42 |
| Informática | 0,81 → 0,43 | 2,09 → 1,08 | 2,90 → 1,51 | 1,15 → 0,76 | 0,67 → 0,45 |

### 4G lento + CPU 4× — segundo acesso

| Disciplina | Lista | Leitura | Total | Completa | Reabrir |
|---|---:|---:|---:|---:|---:|
| Constitucional | 4,24 → 0,41 | 3,31 → 4,81 | 7,55 → 5,23 | 2,65 → 1,77 | 0,96 → 0,61 |
| Administrativo | 2,40 → 0,33 | 5,94 → 4,88 | 8,34 → 5,22 | 4,19 → 2,80 | 1,29 → 0,80 |
| Civil | 2,61 → 0,39 | 2,69 → 3,16 | 5,29 → 3,55 | 6,91 → 5,72 | 1,08 → 0,58 |
| Penal | 7,47 → 0,36 | 4,28 → 8,18 | 11,75 → 8,54 | 4,17 → 2,84 | 1,23 → 0,74 |
| Processo Civil | 8,45 → 0,36 | 6,19 → 10,51 | 14,64 → 10,87 | 5,39 → 4,10 | 1,10 → 0,77 |
| Processo Penal | 2,71 → 0,38 | 3,53 → 4,24 | 6,24 → 4,62 | 6,27 → 5,20 | 1,28 → 0,75 |
| Português | 1,23 → 0,56 | 4,27 → 3,56 | 5,49 → 4,12 | 2,18 → 1,31 | 0,99 → 0,55 |
| RLM | 0,94 → 0,48 | 1,32 → 0,86 | 2,26 → 1,35 | 0,96 → 0,64 | 0,84 → 0,41 |
| Informática | 0,96 → 0,45 | 2,09 → 1,05 | 3,05 → 1,51 | 1,50 → 0,86 | 0,77 → 0,44 |

Instrumentação completa e contagens de requisições estão nos JSONs de evidência. Português, RLM e Informática já tinham estruturas próprias; os ganhos não são uniformes. RLM foi medido no M02 porque o M01 é uma atividade de velocidade com outro fluxo. Nas demais disciplinas, M01. Não foram medidos todos os módulos de todas as disciplinas.

### Etapas instrumentadas — primeiro acesso em 4G/CPU 4×

Na versão corrigida, a autenticação fictícia levou 172,5 ms e a etapa de interface principal, 7714,5 ms. Foram registradas 170 requisições na inicialização e 1.046.442 bytes transferidos. O Chromium mediu 1381,8 ms de execução de scripts, 150,5 ms de layout e 480,0 ms de recálculo de estilos. Essas medidas têm limites distintos e não devem ser somadas ao tempo observado de 9,29 s. A autenticação real depende do serviço publicado e não foi medida aqui.

| Disciplina | Arquivos do carregador | Execução síncrona (ms) | Atualização do DOM (ms) | Carregador pronto (s) |
|---|---:|---:|---:|---:|
| Constitucional | 34 | 123.0 | 52.3 | 2,94 |
| Administrativo | 4 | 49.3 | 51.3 | 0,50 |
| Civil | 21 | 43.0 | 56.6 | 1,48 |
| Penal | 93 | 288.8 | 48.6 | 5,91 |
| Processo Civil | 70 | 199.7 | 124.2 | 5,17 |
| Processo Penal | 8 | 60.0 | 50.9 | 1,60 |

Os downloads acima ocorrem ao abrir o primeiro módulo; a lista dessas seis disciplinas usa apenas o catálogo público. Os tempos individuais de download estão nos JSONs e se sobrepõem por concorrência. A execução síncrona não inclui callbacks posteriores; DOM mede a atualização do carregador, não toda a renderização do leitor. Português, RLM e Informática usam outros fluxos e não têm essas marcas por arquivo. “Carregador pronto” não equivale a leitura visível: os tempos completos do percurso estão nas tabelas anteriores.

## E. Testes e limites

- npm test: 408 testes, 407 aprovados, um ignorado, zero falhas. O ignorado é o teste de bootstrap Civil que depende do Chromium local indisponível; a execução de navegador é feita separadamente no CI.
- npm run test:discipline-loading: 7/7 aprovados.
- npm run test:premium-protection: 27/27 aprovados.
- Regressões novas de escala/carregador: 14/14 aprovadas.
- Navegador visual: 480 verificações; 0 falhas registradas.
- Navegador de desempenho: 36 percursos disciplina/condição; 0 falhas registradas.
- Resoluções: 360×800, 390×844, 430×932, 768×1024, 1024×768, 820×1180, 1180×820, 1024×1366, 1366×1024, 1366×768, 1920×1080 e 2560×1440.
- Telas: início, disciplinas, módulos, revisão, teoria completa, agenda, progresso, questões, configurações e menu. Capturas de carregamento quando o estado real estava visível. Quatro tamanhos por tela; recarga e rotação verificadas.
- Checagem automatizada de overflow horizontal do documento e largura da lista; inspeção visual de capturas selecionadas. Não é prova formal de ausência de toda sobreposição em qualquer conteúdo.
- Duas falhas preexistentes de workflows permanecem no trecho Lei em Dia: seletor .qc-origin-options (run 43719074639) e seleção textual de Direito Administrativo no roteiro gratuito (run 43719074485). Foram reproduzidas antes desta alteração e continuam no mesmo trecho. Não foram suprimidas nem tratadas como aprovação.
- Antes de chegar ao trecho legado de Lei em Dia, o roteiro Gratuito atual passou nas seis disciplinas jurídicas: revisão disponível e teoria completa bloqueada. O teste de SMTP teve uma falha transitória e passou em nova execução sem mudança de código comercial. O workflow Civil apresentou uma falha de encerramento assíncrono do JSDOM após as asserções; a repetição no mesmo commit passou (run 43849789899), sem alteração de código.
- Corrigidas durante a revisão: primeira abertura com corpo nativo fechado, substituição assíncrona de Civil/CPP, seletor de teste que aguardava download antes do clique, regra de 870 px que ainda prevalecia e texto do botão Mais cortado.
- Sem aparelhos físicos Android/iPad; sem Safari. Autenticação real, sincronização entre dispositivos, banco, dados de alunos e PWA offline não foram validados de ponta a ponta nesta rodada. Os testes de segurança/cache são isolados. A aplicação publicada apresentou login obrigatório.

## F. Revisão e publicação

- [Pull Request #313](https://github.com/Diogooliveira-bot/central-de-estudos-2026/pull/313)
- [Prévia de homologação](https://central-de-estudos-2r634y8yf-estudotd.vercel.app) — pode exigir login; não contém credencial no link.
- [Execução e evidências do navegador](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/43850726558)
- Branch: fix/responsividade-desempenho-20261115.
- Nenhum merge na main, alteração de DNS, plano, banco ou publicação em produção foi realizado. A aprovação de produção permanece com o proprietário.
