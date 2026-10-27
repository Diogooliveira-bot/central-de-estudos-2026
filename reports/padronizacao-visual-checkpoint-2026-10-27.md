# Base Completa — checkpoint da padronização visual (27/10/2026)

## Escopo, branch e segurança
- Branch exclusiva: `preview/legal-complete-premium-v1-20261025`.
- Base anterior a esta etapa: `b277cdf51f424e070587108e24188b32b2ed0b98`.
- Sem autorização para promover para `main`, alterar banco de produção, editar material jurídico ou excluir rascunhos do editor.
- Identidade Premium compartilhada já escopada às versões **completas** de seis disciplinas jurídicas.
- Português, RLM e versões resumidas continuam fora do tema nesta etapa.

## Provas já concluídas
- ADM M03 — workflow `40471584335`, conclusão `success`, Chromium real sobre fixture com conteúdo aprovado, em 390/768/1366 px, screenshots como artefatos.
- Penal M01 e CPC M01 — workflow `40471584737`, conclusão `success`, Chromium real com leitores e fontes originais carregados localmente, em 390/768/1366 px, screenshots e verificações de progresso.
- Estas são **provas no Chromium de teste**, não equivalem à validação de toda a jornada autenticada na Preview Vercel.
- A Preview protegida do commit `10c4d9a3...` teve desktop validado na Etapa 3.2.
- Penal M01: restam resíduos de paginação/numeração e comparativos em prosa; revisão editorial humana pendente.
- CPC M01: as correções de reflow estão no commit anterior da branch e passaram no Chromium de teste; validar visualmente na Preview atualizada.

## Próximo lote iniciado (Etapa 4.0)
- Disciplina: **Direito Constitucional**.
- Módulo amostral: **M01**; mantém conteúdo aprovado `content/cf/m01-native-data.js` e leitor `ui/cf-native-study-v2.js` sem modificação.
- Adicionado teste com Chromium, fontes e leitor reais, nas resoluções 390×844, 768×1024, 1366×768:
  1. Ativação do CSS Premium só no modo completo;
  2. Hierarquia visual e ausência de vazamento horizontal na página;
  3. Semântica das tabelas e renderização de caixas pedagógicas;
  4. Persistência das marcações, quando presentes;
  5. Exclusão do visual exclusivo na versão resumida;
  6. Capturas e métricas como artefatos de CI.
- Workflow independente: `.github/workflows/verify-etapa4-cf-m01-premium.yml`.
- A aprovação final de CF M01 depende do resultado do workflow e de inspeção visual das capturas. Não declarar os demais 14 módulos constitucionais aprovados por analogia.

## Próxima ação depois do CI
1. Ler a conclusão do workflow CF M01 e suas métricas/capturas. Corrigir no tema/leitor apenas problemas estruturais seguros, com testes.
2. Conferir em Preview privada autenticada os 3 pilotos anteriores e CF M01 no celular/tablet.
3. Após aprovação, expandir Constitucional e demais 106 módulos jurídicos **por lotes**, sem conversão automática de conteúdo-fonte.
4. Fazer etapa separada para Português (24) e RLM (15) com cuidado adicional de backup do progresso.
5. Integrar somente versões aprovadas, com rollback e proteção Premium comprovados.

## Resultado verificado em 27/10/2026 — CF M01

- Workflow: https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40586776775
- Execução: **success**, sem falhas.
- Commit testado: `97fd2cd5bf4c1a5f3467abcaf5635ac803da2e0c`.
- Chromium em 390×844, 768×1024 e 1366×768: tema Premium aplicado somente à versão completa.
- Resultados iguais nas três larguras: **48 títulos H2, 9 tabelas HTML semânticas, 44 caixas pedagógicas e 10 checkboxes**.
- Checkbox selecionado permanece marcado após fechar/reabrir o leitor.
- Nenhum vazamento horizontal de página e nenhum erro JS nos três tamanhos.
- Modo resumido permaneceu sem a classe visual Premium.
- Artefato de capturas e métricas: https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40586776775/artifacts/12772815668 (retenção GitHub Actions de 14 dias).
- **Limite:** execução local Chromium sobre leitor real/fonte original; ainda não é uma aprovação da sessão autenticada de ponta a ponta nem uma revisão editorial de cada título/tabela.

**Situação atual:** CF M01 aprovado no teste técnico de Chromium. Em etapa seguinte, validar visualmente a experiência autenticada na Preview protegida antes de liberar lote Constitucional M02–M15.

## Etapa 4.1 — Ampliação técnica Constitucional M02–M15 (27/10/2026)

- **Bloqueio de Preview**: o workflow privado na branch está `waiting` por aprovação do ambiente `bc-preview-private` (execução inicial 40586988531). A Vercel mostrou somente o deployment antigo `dpl_AFDqqbXCtoqnExTuKYy2MxkoKth5` (SHA 10c4d9a). Portanto, a aprovação visual autenticada de CF M01 e a publicação de uma Preview atualizada **não estão concluídas**. Não contornar essa proteção.
- **Avanço independente**: teste automático do leitor real de CF com as 14 fontes originais M02–M15 em Chromium 390, 768 e 1366 px, sem dados de alunos.
- Arquivo de teste: `tests/etapa4-cf-m02-m15-premium-browser.mjs`.
- Workflow: `.github/workflows/verify-etapa4-cf-m02-m15-premium.yml`.
- Verificações: ativação do tema apenas na apostila completa; títulos H2, largura da página, semântica e rolagem de tabelas, caixas, checkbox persistente onde houver e exclusão do tema no resumido.
- **Não editar** fontes, editor de conteúdo, leitor, produção, bancos ou permissões Premium nesta etapa. O teste comprova a aparência técnica do código-fonte, não a qualidade editorial ou o acesso autenticado.
- **Resultado verificado em GitHub Actions:** `40596415752`, Chromium concluído com **success**. Foram 42 casos: M02–M15 × 390/768/1366 px, todos aprovados, com 0 erros JavaScript.
- **Provas:** tema no completo; resumo sem tema; tabelas HTML semânticas com contêiner de rolagem; 14 conjuntos de controles de leitura; persistência dos checkboxes; sem overflow da página.
- **Artefatos:** https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40596415752/artifacts/12777290753 (42 capturas + métricas, retenção de 14 dias; podem expirar).
- **Métricas permanentes resumidas (medidas iguais nas 3 larguras):**

| Módulo | Títulos de seção | Tabelas | Caixas | Checkboxes |
|---|---:|---:|---:|---:|
| CF M02 | 89 | 10 | 62 | 10 |
| CF M03 | 52 | 12 | 19 | 11 |
| CF M04 | 54 | 11 | 20 | 10 |
| CF M05 | 54 | 14 | 20 | 11 |
| CF M06 | 58 | 10 | 63 | 18 |
| CF M07 | 65 | 9 | 71 | 18 |
| CF M08 | 50 | 22 | 27 | 10 |
| CF M09 | 61 | 23 | 31 | 10 |
| CF M10 | 43 | 16 | 24 | 10 |
| CF M11 | 53 | 20 | 24 | 10 |
| CF M12 | 64 | 28 | 24 | 10 |
| CF M13 | 56 | 16 | 14 | 8 |
| CF M14 | 42 | 15 | 14 | 8 |
| CF M15 | 38 | 12 | 12 | 10 |

- **Decisão:** os 15 módulos de Direito Constitucional estão tecnicamente validados no Chromium de teste. Não declarar publicação, auditoria jurídica, inspeção editorial individual ou homologação online aprovada.
- **Bloqueio ainda existente:** Preview atualizada aguarda a aprovação obrigatória do ambiente GitHub `bc-preview-private`. Não contornar ou publicar em ambiente aberto.
- **Ponto de retomada:** fazer validação autenticada na Preview privada depois da aprovação do ambiente; seguir com um lote piloto de outra disciplina jurídica, preservando conteúdos e progresso.

\n## Etapa 4.2 — Pilotos Administrativo M01/M08/M20 (27/10/2026)

- Constituição M01–M15: testes Chromium anteriores aprovados. Preview autenticada **ainda não liberada** — workflow 40596613037 aguardando aprovação do ambiente `bc-preview-private`.
- Novo avanço autorizado sem bypass da proteção: testar no Chromium os módulos ADM M01, M08 e M20 (amostras priorizadas no inventário) com o **leitor real** `ui/adm-native-layer.js`, `ui/native-reading-session.js`, índices/fontes `content/adm` e tema escopado `ui/legal-complete-premium-v1.css`.
- Novos arquivos: `tests/etapa4-adm-pilots-browser.mjs`; `.github/workflows/verify-etapa4-adm-pilots.yml`.
- Testes isolados sem autenticação, acessos remotos ao banco, Hotmart ou conteúdo produtivo: 390/768/1366, títulos, tabela, CSS, ausência de vazamento lateral, navegação, persistência de marcação e modo resumido sem tema.
- Sem alterações dos dados aprovados, leitores, editor, login ou `main`.
- **Resultado:** GitHub Actions `40599132103` concluído com sucesso em Chromium; 9 verificações (ADM M01, M08 e M20 em três larguras). M01: 10 tabelas, 19 checkboxes de conteúdo e 6 de sessão. M08: 20 tabelas, 14 + 14 checkboxes. M20: 31 tabelas, 15 + 14 checkboxes. Todos com CSS Premium, tabelas semânticas, sem overflow lateral/erros JS, marcações preservadas após reabertura e resumo sem tema Premium. Capturas: https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40599132103/artifacts/12776359525. Revisão editorial de caixas e títulos ainda necessária; o seletor usado para caixas pedagógicas retornou zero nos três pilotos, não significa que o conteúdo não contenha destaques.
- O deployment controlado permanece bloqueado por aprovação manual do ambiente; não criar Preview desprotegida nem enviar URL de deployment antigo como se fosse atual.

## Etapa 4.3 — Teste dos 16 módulos administrativos restantes (27/10/2026)

- Base: `4d72b2cfa64b8e639eb2c1723f2f926328867db3`, pilotos ADM M01/M08/M20 aprovados em Chromium.
- Lote a testar: ADM M02, M04–M07 e M09–M19. ADM M03 já é a referência visual anterior. Assim, o conjunto cobre os 20 módulos administrativos.
- Novos arquivos: `tests/etapa4-adm-expansion-browser.mjs`, `.github/workflows/verify-etapa4-adm-expansion.yml`.
- Teste com o leitor ADM real, conteúdo aprovado, 390/768/1366 px, sem acesso a APIs nem credenciais. O progresso é verificado apenas com o armazenamento isolado do navegador de teste.
- Não houve edição do conteúdo e não há aprovação editorial ou deploy protegido atualizados.
- **Resultado confirmado:** GitHub Actions `40599475563` concluiu com `success` no commit `5ca17e3dae8092c1d3fe5a2115172f956ccadcd5`.
- **Cobertura:** 48 testes dos 16 módulos ADM M02/M04–M07/M09–M19 em 390, 768 e 1366 px; 0 falhas; 0 erros JavaScript; títulos e tema Premium operantes; sem overflow horizontal da página; todas as tabelas reais com contêiner rolável; checkboxes de conteúdo preservados após reabertura; resumo sem tema Premium.
- **Matriz de referência** (contagens por módulo iguais nas 3 resoluções):

| ADM | Tabelas | Checkboxes no conteúdo | Checks por sessão |
|---|---:|---:|---:|
| M02 | 18 | 30 | 10 |
| M04 | 15 | 11 | 12 |
| M05 | 14 | 20 | 20 |
| M06 | 15 | 14 | 14 |
| M07 | 14 | 13 | 13 |
| M09 | 21 | 19 | 19 |
| M10 | 22 | 14 | 14 |
| M11 | 17 | 14 | 14 |
| M12 | 13 | 14 | 14 |
| M13 | 16 | 42 | 14 |
| M14 | 27 | 14 | 14 |
| M15 | 20 | 14 | 14 |
| M16 | 19 | 42 | 14 |
| M17 | 17 | 14 | 14 |
| M18 | 22 | 14 | 14 |
| M19 | 20 | 14 | 14 |

- **Cobertura acumulada ADM:** 20/20 módulos com validação técnica Chromium. M03 foi a referência de fixture com conteúdo aprovado; os outros 19 foram exercitados pelo leitor ADM real em teste local.
- **Limitação:** sem conclusão da Preview autenticada; revisão editorial/visibilidade real de caixas, legibilidade jurídica de cada tabela e persistência no Neon ainda não avaliadas. Em especial, o seletor de caixas pedagógicas dos testes retornou 0 em vários materiais ADM, devendo haver inventário editorial antes de declarar o acabamento Premium definitivo.
- **Próximo passo:** realizar inspeção editorial em amostras e a Preview privada (após a aprovação do ambiente `bc-preview-private`); seguir então para lote de Direito Penal/Processo Civil sem modificar texto automaticamente.

## Fechamento da Etapa 4.3 — Evidências salvas (27/10/2026)

- Execução revalidada após correção do caminho dos artefatos: [GitHub Actions 40599729567](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40599729567) — **success**, 48 casos em Chromium real, zero falhas.
- Evidências: [97 arquivos — 48 capturas principais, 48 capturas de tabelas, metricas.json](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40599729567/artifacts/12778705139), retenção até 10/11/2026.
- Conteúdo e leitores originais preservados. As capturas são do leitor em teste local, não da Central com sessão autenticada.
- Direito Administrativo: 20/20 módulos tecnicamente testados no conjunto desta branch (M03 em fixture fiel; M01/M02/M04–M20 em leitores reais). Direito Constitucional: 15/15 módulos tecnicamente testados.
- Próxima fase editorial: revisar cartões de exemplo/pegadinha, tabelas longas e hierarquia individual; verificar a Preview Vercel **somente após aprovação** do ambiente protegido. Em seguida, testar os demais módulos das outras quatro disciplinas jurídicas. Nenhuma publicação em produção autorizada ou executada.

## Etapa 5.0 — Direito Penal M02–M17 (27/10/2026)

- Continuação da branch isolada depois do commit `3f9cf3fb782c4ea4d0c47d8d3bf36b849cc441a8`.
- M01 mantém piloto próprio com testes aprovados e pendências editoriais de marcadores de PDF, títulos e quadros achatados.
- M02–M17: testar os 16 leitores `ui/native-study-reader-mNN.js` com `content/penal/mNN-native-data.js` e os quatro arquivos `penal-full-theory-data-01..04.js`. Certos módulos M11–M17 usam conteúdo completo exclusivamente em `window.PENAL_FULL_THEORY`; não inferir que `data.complete` vazio significa apostila ausente.
- Testes isolados no Chromium, 390×844/768×1024/1366×768, sobre o leitor original, validação de conteúdo realmente renderizado, CSS Premium, tabela HTML, checkboxes, persistência local, isolamento dos resumos e ausência de erros.
- Coletar métricas de possíveis artefatos de PDF/títulos suspeitos para uma **revisão editorial**, sem transformar tais registros em edição automática do conteúdo.
- Arquivos de teste: `tests/etapa5-penal-m02-m17-browser.mjs`, `.github/workflows/verify-etapa5-penal-m02-m17.yml`.
- Sem mudanças de conteúdo, UI produtiva, banco, credenciais nem `main`. Preview Vercel ainda depende da aprovação do ambiente `bc-preview-private`, não contornar.
- **Status:** CI final aprovado no commit `c74da4633374095aa159a2b85788f6e5e67da8e9`; ver detalhes e matriz abaixo.

## Etapa 5.0 — Resultado validado do lote Penal (27/10/2026)

- **Workflow final:** [40601516970](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40601516970), `completed/success` no commit `c74da4633374095aa159a2b85788f6e5e67da8e9`.
- **Cobertura real:** 16 módulos PEN M02–M17 × 390, 768 e 1366 px = **48 testes técnicos aprovados**, sem exceções nem erros de JavaScript.
- **Evidências originais:** [artefato 12778437865](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40601516970/artifacts/12778437865), screenshots e `metricas.json`, validade limitada a 14 dias (até aproximadamente 10/11/2026).
- **Leitores utilizados:** `BaseNativeReaderM02`…`M17` verdadeiros, com os respectivos dados de `content/penal` e os quatro arquivos `penal-full-theory-data-01..04.js`; não foram utilizadas simulações de teorias inexistentes.
- Todos os 16: CSS Premium ativado no modo completo, controles de leitura presentes, ao menos um H2 estilizado corretamente, corpo da apostila renderizado, tabelas HTML estruturadas quando existentes, ausência de vazamento horizontal na página, checkbox visível após clicar em "Capítulos", marcação positiva preservada ao reabrir o leitor e **modo resumido fora do tema**.
- **Nota sobre as marcações:** alguns leitores marcam capítulos automaticamente quando visualizados. Uma marcação desfeita manualmente pode voltar a aparecer como concluída ao reabrir se o capítulo for considerado visto. O teste final comprova a persistência de uma marcação *concluída*, não a persistência de uma desmarcação. Conferir a experiência de desmarcar na inspeção funcional antes da liberação.

### Matriz editorial de Penal

Contagens de elementos efetivamente renderizados no navegador (mesmas nas três larguras); valores zero indicam que **o seletor do teste** não detectou esse tipo de elemento, não que o conteúdo tenha necessariamente perdido comparações ou destaques.

| Penal | H2 | H3 | Tabelas HTML | Caixas com classe `bc-native-callout` | Capítulos marcáveis |
|---|---:|---:|---:|---:|---:|
| M02 | 1 | 34 | 16 | 42 | 24 |
| M03 | 1 | 49 | 30 | 40 | 39 |
| M04 | 19 | 46 | 14 | 31 | 18 |
| M05 | 34 | 125 | 23 | 0 | 33 |
| M06 | 1 | 25 | 20 | 32 | 15 |
| M07 | 67 | 46 | 21 | 5 | 14 |
| M08 | 33 | 110 | 13 | 0 | 31 |
| M09 | 42 | 190 | 0 | 1 | 40 |
| M10 | 28 | 10 | 11 | 1 | 25 |
| M11 | 37 | 22 | 12 | 0 | 36 |
| M12 | 20 | 73 | 13 | 0 | 17 |
| M13 | 49 | 39 | 1 | 0 | 48 |
| M14 | 43 | 13 | 5 | 0 | 42 |
| M15 | 28 | 62 | 12 | 0 | 27 |
| M16 | 69 | 26 | 4 | 1 | 25 |
| M17 | 14 | 30 | 1 | 0 | 13 |

### Pendências editoriais e de homologação (não resolvidas por estes testes)

1. **Penal M01**: artefatos de paginação/numeração e quadros de comparação achatados em texto, conforme relatório de origem da Etapa 3.2. Corrigir de maneira individual, preservando todos os termos jurídicos.
2. **PEN M02, M03 e M06**: apenas um H2 e muitos H3 — conferir a hierarquia visual em captura e corrigir caso os títulos estejam deslocados. Não fazer conversão automática de H3→H2.
3. **PEN M09 e M13**: detectadas respectivamente 0 e 1 tabela HTML no material; verificar visualmente se comparações importantes estão em linhas de texto, sem converter trechos sem estrutura definida.
4. **PEN M05, M08, M11–M15 e M17**: nenhuma caixa com a classe `bc-native-callout` nos seletores do teste. Conferir se as notas e alertas possuem outro marcador/estrutura e se estão visualmente destacados antes de alterar CSS.
5. O detector experimental de títulos "suspeitos" apontou vários títulos com numeração normal de 10 a 17; **não tomar isso como erro confirmado**. A inspeção editorial humana é mandatória.
6. Não houve login real ou validação em Preview Vercel atualizada. O workflow protegido `deploy-private-visual-preview.yml` ainda exige autorização de `bc-preview-private`, e faz checkout fixo do commit `10c4d9a...`. Isso significa que mesmo uma execução aprovada **não incluirá automaticamente os commits atuais** sem mudança controlada e revalidação do pin; não mudar o pin nesta etapa.

### Estado consolidado

- **Constitucional:** 15/15 módulos tecnicamente validados em Chromium.
- **Administrativo:** 20/20 módulos tecnicamente validados em Chromium.
- **Penal:** 17/17 módulos tecnicamente validados em Chromium (M01 piloto, M02–M17 na Etapa 5).
- **Processual Civil (CPC):** M01 piloto; M02–M20 ainda sem validação de lote.
- **Civil e Processual Penal:** pendentes.
- **Total: 53 de 109 módulos jurídicos com testes técnicos executados**. Isso não equivale a 53 módulos aprovados editorialmente ou publicados.
- **Português e RLM:** continuam fora deste ciclo jurídico, precisam de tratamento e proteção de progresso em lote separado.

**Próximo ponto seguro de retomada:** testar CPC M02–M20 no Chromium com os leitores e os conteúdos originais, sem alterar `main`/Production; depois revisar as pendências editoriais e liberar a Preview privada somente pelo fluxo autorizado.

## Etapa 6.0 — CPC M02–M20 em Chromium (27/10/2026)

- Expandir a validação técnica do piloto CPC M01 para os outros **19 módulos** no fluxo **exclusivamente de testes**, sem editar o leitor, o código produtivo, os dados aprovados ou o banco Neon.
- Fontes: `content/cpc/m02..m20-native-data.js` carregadas individualmente, leitores `ui/cpc-m02..m20-native-study-reader.js` e CSS Premium da branch. `m08-native-data-part1.js` é um patch legado separado e **não substitui** o arquivo final M08 neste teste.
- Testes em Chromium real nas larguras 390/768/1366: conteúdo completo, título e estrutura, CSS Premium, capítulos marcáveis, persistência local de marcação **concluída**, resumo sem tema e ausência de JavaScript erro/overflow lateral.
- Diagnóstico editorial: contagens reais de H2/H3, tabelas, caixas, cabeçalhos suspeitos e rótulos de navegação (não é revisão de qualidade jurídica).
- Novo teste: `tests/etapa6-cpc-m02-m20-browser.mjs`.
- Workflow: `.github/workflows/verify-etapa6-cpc-m02-m20.yml`.
- Nenhuma autorização de deploy, produção ou bypass de `bc-preview-private`. A Preview continua protegida e não foi liberada para validação autenticada da versão atual.
- **Resultado:** workflow `40602235970` concluído com `success` em `1dc97aa81577ff59df96bfab72a161735b2a371d`; 57/57 casos Chromium aprovados. Evidências e limitações no fechamento abaixo.

## Etapa 6.0 — Fechamento CPC M02–M20 e fila editorial (27/10/2026)

- **Execução:** [GitHub Actions 40602235970](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40602235970) — `success`, teste em Chromium real sobre os leitores existentes de **19 módulos × 390/768/1366 px = 57 casos**; nenhum erro JavaScript ou vazamento lateral da página.
- **Capturas e matriz JSON:** [artefato 12778679016](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40602235970/artifacts/12778679016) (reter até 10/11/2026). O teste registra capturas do leitor em fixture isolada; não são evidências de uma sessão Premium autenticada na Vercel.
- **Passaram:** conteúdo completo realmente renderizado, CSS Premium nos títulos do completo, controles de leitura, capítulo concluído persistindo ao reabrir e versão resumida fora do tema. Os materiais originais não foram alterados.

### Matriz de inspeção CPC M02–M20

| CPC | Caracteres da fonte completa | H2 | H3 | Tabelas HTML no leitor | Caixas pedagógicas | Capítulos marcáveis |
|---|---:|---:|---:|---:|---:|---:|
| M02 | 39.059 | 20 | 0 | 0 | 11 | 15 |
| M03 | 28.387 | 19 | 32 | 0 | 7 | 15 |
| M04 | 41.250 | 48 | 0 | 0 | 12 | 15 |
| M05 | 34.849 | 69 | 0 | 0 | 10 | 15 |
| M06 | 38.991 | 30 | 2 | 0 | 5 | 15 |
| M07 | 34.922 | 34 | 0 | 0 | 15 | 15 |
| M08 | 27.055 | 15 | 35 | 0 | 8 | 15 |
| M09 | 4.572 | 15 | 0 | 0 | 0 | 15 |
| M10 | 4.428 | 15 | 0 | 0 | 0 | 15 |
| M11 | 6.103 | 17 | 0 | 0 | 0 | 17 |
| M12 | 7.016 | 20 | 0 | 0 | 0 | 20 |
| M13 | 5.227 | 20 | 0 | 0 | 0 | 20 |
| M14 | 8.152 | 24 | 0 | 0 | 0 | 24 |
| M15 | 3.424 | 26 | 0 | 0 | 0 | 26 |
| M16 | 6.599 | 25 | 0 | 0 | 0 | 25 |
| M17 | 3.131 | 40 | 0 | 0 | 0 | 40 |
| M18 | 7.782 | 37 | 0 | 0 | 0 | 37 |
| M19 | 13.103 | 44 | 0 | 0 | 0 | 44 |
| M20 | 15.359 | 60 | 0 | 0 | 0 | 60 |

### Problemas editoriais encontrados — NÃO corrigidos automaticamente

1. **Prioridade alta — tabelas:** nos 19 leitores M02–M20, `article.querySelectorAll('table')` retornou **zero**. O M01 já demonstrou que tabelas reais são possíveis no leitor. Investigar comparativos existentes no conteúdo textual e converter **individualmente** em HTML semântico somente onde a estrutura for inequívoca, sem perder textos, notas, links ou edições. Medir cada tabela e sua rolagem no mobile.
2. **Botões de retorno:** os leitores CPC M02, M03, M04 e M05 renderizam `← Voltar ao M01`, embora pertençam a outros módulos. Corrigir esses rótulos depois de confirmar rota/ação correta; o teste comprovou abertura e fechamento, mas não a navegação integrada autenticada.
3. **Títulos/numeração:** em CPC M03/M08, a métrica de títulos potencialmente suspeitos incluiu números de subseções normais como `10.1` e `11.1`. **Não corrigir com regex global**; verificar visualmente a hierarquia e os prefixos reais. CPC M06 tem sequência visível `4. 2.6. Responsabilidade... `, a conferir com o original.
4. **Caixas:** CPC M09–M20 retornaram zero elementos `.bc-native-callout`. Confirmar se os destaques foram mantidos em parágrafos simples ou têm outro tipo de marcação antes de substituir texto.
5. **Extensão da teoria:** M09–M20 têm fontes menores que alguns módulos anteriores (ex.: M17 3.131 caracteres). Isso **não prova ausência de conteúdo**, mas merece conferência contra o material completo previamente aprovado.
6. **Proteção e publicação:** não houve validação da Preview integrada autenticada atualizada. O workflow privado ainda é protegido pelo ambiente `bc-preview-private` e usa SHA pinado do deploy antigo. Não ignorar a aprovação nem colocar Preview comercial integrada em acesso público.

### Quadro acumulado de validação técnica

| Disciplina | Módulos testados no Chromium |
|---|---:|
| Direito Constitucional | 15/15 |
| Direito Administrativo | 20/20 |
| Direito Penal | 17/17 |
| Direito Processual Civil | 20/20 |
| Direito Civil | 0/15 |
| Direito Processual Penal | 0/22 |

**Total: 72/109 módulos jurídicos tecnicamente testados.** Não implica aprovação editorial, legal, validação do acesso premium autenticado ou publicação.

**Próxima etapa segura:** testar Direito Civil e Direito Processual Penal em lotes separados, evitando recompactação de dados; em paralelo, iniciar correção editorial de CPC/Penal baseada em evidências e conferir a Preview protegida somente após autorização.

## Etapa 7.0 — Civil M01–M15 (27/10/2026)

- Base segura: branch `preview/legal-complete-premium-v1-20261025` no commit `3252fb1404710ab4c12055c13cc72e52d53c8822`.
- Inventário civil verificado: 15 módulos no `civil-native-index.js`, conteúdo integrado em `civil-native-content-packed.js` (gzip/base64) e leitor `ui/civil-native-study-v1.js` que usa `ui/native-reading-session.js`.
- **Particularidade Civil M03:** `CivilBensApostila.enhance` usa formatação editorial própria dos `pre.civil-source-table`; teste carrega o JS já existente, sem edição/reempacotamento de apostilas.
- Teste Chromium isolado para 390/768/1366 px: carregamento/decodificação original, presença de 15 apostilas completas e resumos, leitor próprio, estilo Premium apenas no completo, títulos, TOC, tabelas, ausência de overflow, conclusão de leitura no armazenamento do próprio navegador de teste e preservação após fechar/reabrir.
- Arquivos novos: `tests/etapa7-civil-m01-m15-browser.mjs` e `.github/workflows/verify-etapa7-civil-m01-m15.yml`.
- Nenhum leitor, texto jurídico, editor, banco Neon, Production, `main` ou Preview protegido foi alterado. Teste **não substitui** validação autenticada ou conferência editorial.
- **Status inicial:** aguardando conclusão do workflow e métricas para marcar a disciplina tecnicamente testada.
