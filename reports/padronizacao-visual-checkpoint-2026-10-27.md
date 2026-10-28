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
- **Resultado final:** 45/45 testes Chromium aprovados; ver matriz e advertências abaixo.

## Etapa 7 — Civil M01–M15 finalizada (27/10/2026)

- **Workflow Chromium:** [40604021477](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40604021477), `completed/success`. Todos os 45 testes (15 módulos × 390/768/1366 px) aprovados.
- **Artefatos:** [12780446265](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40604021477/artifacts/12780446265); incluem capturas e `metricas.json`, com expiração prevista em 10/11/2026.
- Conteúdo carregado do **pacote original gzip/base64**: 15 conjuntos de apostila completa e 15 resumos. Leitor original `CivilNative.openReader`, sem simular textos. M03 usa formatador existente `CivilBensApostila.enhance`, confirmado ativado.
- Foram preservados os materiais, a política Premium, a distinção entre resumo e completo e o progresso. Os testes de persistência ocorreram exclusivamente no `localStorage` descartável do Chromium de testes; não testam o Neon nem usuários reais.

### Matriz Civil para inspeção editorial

| Módulo | Caracteres renderizados | Títulos H2/H3 | Tabelas HTML | Quadros fonte (`pre.civil-source-table`) remanescentes |
|---|---:|---:|---:|---:|
| M01 | 26.396 | 2/3 | 0 | 1 |
| M02 | 25.113 | 2/2 | 0 | 1 |
| M03 | 25.095 | 10/12 | 0 | 0 (formatador aplicado) |
| M04 | 43.026 | 11/38 | 0 | 13 |
| M05 | 20.478 | 2/3 | 0 | 1 |
| M06 | 35.173 | 2/2 | 0 | 1 |
| M07 | 20.451 | 2/3 | 0 | 1 |
| M08 | 33.921 | 27/0 | 0 | 2 |
| M09 | 19.156 | 19/11 | 0 | 4 |
| M10 | 28.677 | 2/3 | 0 | 1 |
| M11 | 28.200 | 10/19 | 0 | 7 |
| M12 | 27.019 | 2/4 | 0 | 1 |
| M13 | 29.200 | 3/12 | 0 | 1 |
| M14 | 22.946 | 2/3 | 0 | 1 |
| M15 | 33.638 | 10/19 | 0 | 5 |

- **Pendência alta:** nenhum dos 15 leitores Civil gerou `<table>` HTML no seletor testado. Há blocos `pre` ainda presentes em 14 módulos e M03 convertido para uma representação visual própria. Inspecionar comparativos individualmente antes de converter; não presumir que uma captura visualmente correta equivale a tabela semanticamente estruturada.
- **Títulos:** vários módulos têm apenas 2 H2; conferir hierarquia dos blocos de conteúdo extraído e destaques que não se enquadraram no seletor `.bc-native-callout`. M03 preserva o layout especial; não reformatar em massa.
- **Validação não concluída:** qualidade editorial, precisão jurídica e autenticação Premium na Preview atualizada. Aprovação técnica **não** autoriza deploy ou merge.
- **Progressão acumulada:** ADM 20/20 + CF 15/15 + Penal 17/17 + CPC 20/20 + Civil 15/15 = **87/109 módulos jurídicos com testes Chromium**.
- **Próxima disciplina jurídica:** Processual Penal, 22 módulos ainda por testar.

## Etapa 8.0 — Direito Processual Penal M01–M22 (27/10/2026)

- A partir do checkpoint `2f738923ab74ed895532e920403a521469ae9cd4`, foi confirmado o índice com **22 módulos CPP**, contidos no pacote original `content/cpp/cpp-native-content-packed.js` (gzip/base64).
- Leitor de produção mantido: `ui/cpp-native-study-v1.js`, usando `ui/native-reading-session.js`, `ui/cpp-native-study-v1.css` e tema Premium escopado.
- Workflow novo de testes: `.github/workflows/verify-etapa8-cpp-m01-m22.yml`; script: `tests/etapa8-cpp-m01-m22-browser.mjs`.
- Exercitar conteúdo original realmente descompactado e os resumos em Chromium real, 390/768/1366 px, inclusive navegação, marcação de conclusão e persistência local, aparência Premium restrita ao completo, sem overflow de página ou erro JS.
- Inventariar H1/H2/H3, tabelas HTML, elementos `pre` e callouts. O resultado **não implica** certificação editorial do material ou da estrutura semântica de possíveis comparativos.
- Sem alterar conteúdo, leitor, `main`, produção, credenciais, acesso pago, Neon ou fluxo da Preview privada.
- **Resultado:** 66/66 testes Chromium aprovados no workflow `40605367162`; detalhes, inventário e pendências no fechamento abaixo.

## Etapa 8 — CPP M01–M22: encerramento técnico (27/10/2026)

- **Workflow Chromium:** [40605367162](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40605367162) — `completed/success`, 66/66 testes (22 módulos × 390/768/1366 px), sem erro de JavaScript ou overflow horizontal global.
- **Evidências:** [artefato 12780652508](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40605367162/artifacts/12780652508), cerca de 9,4 MB com screenshots e `metricas.json`, expira aproximadamente em 10/11/2026.
- Teste sobre a **fonte original descompactada** de `content/cpp/cpp-native-content-packed.js` (22 completos e 22 resumos), com `ui/cpp-native-study-v1.js` e sessão real do leitor. O Premium foi aplicado apenas às versões completas. O botão **Concluir leitura** persistiu no `localStorage` isolado após fechamento e reabertura dos 22 módulos; os resumos permaneceram fora do tema. Não houve login real, Neon nem teste de autorização de aluno.
- Os 22 módulos possuem tabelas **HTML semânticas detectadas** (com linhas) no leitor e CSS Premium nos títulos. A existência de uma tabela HTML não prova que todas as comparações do documento original foram convertidas nem que cada coluna foi validada editorialmente.

### Inventário visual — Direito Processual Penal

| CPP | Caracteres lidos | H2 | H3 | Tabelas HTML | Índice do leitor |
|---|---:|---:|---:|---:|---:|
| M01 | 34.189 | 10 | 16 | 8 | 28 |
| M02 | 36.144 | 15 | 16 | 11 | 33 |
| M03 | 52.718 | 10 | 3 | 11 | 15 |
| M04 | 45.194 | 3 | 26 | 10 | 31 |
| M05 | 30.328 | 20 | 93 | 8 | 50 |
| M06 | 57.050 | 36 | 56 | 21 | 50 |
| M07 | 62.388 | 37 | 67 | 14 | 50 |
| M08 | 37.828 | 23 | 11 | 8 | 50 |
| M09 | 31.202 | 36 | 71 | 14 | 50 |
| M10 | 51.234 | 2 | 31 | 10 | 33 |
| M11 | 42.792 | 14 | 89 | 12 | 50 |
| M12 | 75.487 | 10 | 20 | 22 | 32 |
| M13 | 61.677 | 62 | 37 | 19 | 50 |
| M14 | 64.969 | 44 | 35 | 16 | 50 |
| M15 | 48.154 | 53 | 67 | 8 | 50 |
| M16 | 53.374 | 25 | 64 | 13 | 50 |
| M17 | 33.298 | 54 | 102 | 8 | 50 |
| M18 | 37.561 | 43 | 68 | 9 | 50 |
| M19 | 52.869 | 2 | 40 | 22 | 42 |
| M20 | 49.039 | 32 | 42 | 15 | 50 |
| M21 | 52.413 | 2 | 30 | 13 | 32 |
| M22 | 52.568 | 40 | 29 | 13 | 50 |

### Pendências editoriais/UX identificadas — não alteradas neste ciclo

1. **Índice truncado:** `ui/cpp-native-study-v1.js` usa `.slice(0,50)` ao construir o índice. Nos módulos com mais de 50 títulos, a navegação *não mostra todos os tópicos*, ainda que o corpo esteja carregado. Corrigir essa limitação com solução responsiva e teste de desempenho/acessibilidade, sem tocar no progresso.
2. **Hierarquia:** CPP M04, M10, M19 e M21 têm apenas 2–3 H2, mas dezenas de H3; conferir se as seções principais foram niveladas corretamente. CPP M03 mistura títulos de orientação e títulos de capítulo. Não usar conversão indiscriminada.
3. **Tabelas longas:** são 8–22 tabelas HTML por módulo. Conferir no visual editorial mobile cabeçalhos, contraste, rolagem horizontal local e fidelidade às fontes; o teste atual verificou estrutura básica e ausência de overflow **da página**.
4. **CPP M16:** há um bloco `pre` remanescente entre tabelas e seções; verificar a legibilidade do conteúdo antes de converter.
5. **Validação da Preview privada:** continua pendente de aprovação do ambiente `bc-preview-private`. O workflow de deploy ainda está fixado no SHA antigo `10c4d9a...`; aprovar a execução sem atualizar o checkout pinado **não exibe** automaticamente esta versão.
6. **Fidelidade jurídica, provas e aluno autenticado:** não validados nesta rodada. O resultado Chromium confirma somente os comportamentos explicitamente testados com fixtures estáticas locais, não autorização Premium, sincronização Neon nem precisão editorial/legal.

### Marco de cobertura dos 109 módulos jurídicos

| Disciplina | Testes técnicos do visual Premium |
|---|---:|
| Administrativo | 20/20 |
| Constitucional | 15/15 |
| Penal | 17/17 |
| Processual Civil | 20/20 |
| Civil | 15/15 |
| Processual Penal | 22/22 |
| **Total** | **109/109** |

**Status correto: 109/109 módulos exercitados em testes técnicos em Chromium local. NÃO são 109/109 apostilas editorialmente aprovadas, liberadas em Preview autenticada ou publicadas na produção.** Mantidos `main`, Production, segredos, acesso pago e banco Neon.

### Próximas etapas recomendadas depois da primeira rodada técnica

- **Etapa 9 — Correção visual editorial segura:** fila de pendências com prioridade para tabelas em CPC M02–M20 (nenhuma HTML detectada), blocos `pre` de Civil, quadros achatados de Penal M01, hierarquia de títulos e índice truncado CPP; trabalhar por amostras e módulos, preservando texto, tabelas e rastreabilidade de comparação.
- **Etapa 10 — Preview privada integrada:** revisão de segurança, aprovação manual do `bc-preview-private`, atualização controlada do SHA de checkout pinado para um commit aprovado; validação real autenticada e controles de acesso sem tornar Preview pública e sem modificar Production.
- **Etapa 11 — Aprovação e eventual publicação:** somente mediante autorização expressa e após os gates editoriais, responsivos e de segurança. Não mesclar em `main` por inferência.

## Etapa 9.1 — Piloto editorial CPC M02 (28/10/2026)

- **Alteração restrita ao leitor M02:** seis linhas inequívocas do quadro “O que extingue sem mérito e o que é mérito” ganham `<table>` semântica responsiva, com cabeçalhos de coluna e linha. Cada linha é validada literalmente contra a apostila original em tempo de execução, antes de ser exibida.
- **Zero supressões:** a transcrição original continua integralmente no corpo do leitor. O quadro organizado é uma **consulta adicional**, não uma reescrita do documento, e não abrange a linha jurídica de classificação ambígua. Os demais quadros permanecem na fila editorial.
- Corrigido apenas o rótulo do botão M02 (“Voltar ao M02”); ação e destino inalterados. Resumo e progressos intocados.
- Testes novos no workflow já existente `verify-etapa6-cpc-m02-m20.yml`: seis linhas, fonte, semântica de tabela, scroll local a 390 px, texto original preservado, retorno corrigido e isolamento do resumo, além dos 57 testes de regressão de CPC.
- **Estado:** aguardando resultado do CI; não confundir este piloto com conclusão editorial dos 19 módulos.

## Etapa 9.1 — Resultado confirmado do piloto CPC M02 (28/10/2026)

- **CI final:** [GitHub Actions 40606692686](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40606692686) — `completed/success`, sobre o commit `2df5914f960f283a914584c359aaae48e550e898`.
- **57/57 verificações técnicas CPC** passaram (19 módulos × 3 larguras). CPC M02 exibiu **1 tabela semântica** nas três larguras (390/768/1366 px); CPC M03–M20 continuam com **0 tabelas HTML** detectadas.
- A tabela do M02 contém **6 linhas × 3 colunas** rastreadas literalmente ao original aprovado, cabeçalhos de linha e coluna, rolagem horizontal **local** no celular de 390 px e sem overflow da página.
- O texto do original **não foi removido nem editado**: o quadro é de consulta adicional e os casos ambíguos permanecem na transcrição existente. O resumo não recebe a tabela e mantém seu visual original. A conclusão de capítulos persistiu após reabrir.
- O rótulo “Voltar ao M02” foi corrigido no mesmo leitor, sem alterar a ação de fechar. Nenhuma alteração a código do banco, direitos Premium, conteúdo jurídico, `main` ou Production.
- **Artefatos:** [capturas e métricas, ID 12781290791](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40606692686/artifacts/12781290791), com validade aproximada até **11/11/2026**.
- **Não aprovado ainda:** acabamento editorial completo de CPC M02 (ou M03–M20), confrontação visual humana das tabelas e Preview autenticada atualizada. O workflow da Preview permanece protegido e com checkout antigo.
- **Próximo lote sugerido:** escolher comparativos de CPC M03–M05 apenas quando a divisão de colunas puder ser cotejada com o original, sem preencher lacunas por interpretação; estabelecer testes de equivalência e capturas de tabela para cada conversão.

## Etapa 9.2 — Pilotos editoriais CPC M03–M05 (27/10/2026)

- **Escopo técnico conservador:** acrescentar quadros consultivos em `ui/cpc-m03-native-study-reader.js`, `m04` e `m05`, sem editar `content/cpc/*.js`, sem conversão geral de OCR/PDF e sem mudanças em permissões, aluno, banco, produção ou `main`.
- **M03:** critérios de competência — cinco linhas verificadas literalmente; colunas Critério, Regra predominante, Consequência típica; ancorado no item "2. CRITÉRIOS DE COMPETÊNCIA". O texto original e exceções legais permanecem abaixo.
- **M04:** cinco faixas de honorários contra a Fazenda Pública, com percentuais e bases **copiados literalmente** da apostila do M04. O texto sobre progressividade e exceções continua intacto; nenhum cálculo jurídico novo foi adicionado.
- **M05:** quadro "Classificação visual" de litisconsórcio com quatro critérios, espécies e perguntas-chave. Inserção próxima a "2. CONCEITO E FINALIDADE"; transcrição de fonte original mantida.
- Cada linha é **validada literalmente** contra o campo `complete` antes de mostrar a nova tabela. Se faltar qualquer linha ou âncora, a tabela adicional não é exibida. Isso protege contra desencontro com o conteúdo original.
- Todas as tabelas usam `<table>`, `<caption>`, `<thead>`, `<tbody>`, `th[scope=row]` e a classe responsiva `.table-wrap`. A nova vista é aditiva apenas ao conteúdo completo. Os botões "Voltar ao M01" desses três leitores foram corrigidos para M03/M04/M05 sem alterar a ação nem o destino.
- Regressão estendida dos **19 módulos CPC × 390/768/1366 px** verifica 5/5/4 linhas, fidelidade à fonte, scroll local de tabela no celular, isolamento dos resumos e progresso após reabrir, somada aos critérios anteriores para M02.
- **Status:** CI aprovado em 57/57 casos, detalhes no encerramento técnico abaixo; revisão editorial e experiência integrada seguem pendentes.

## Etapa 9.2 — Encerramento técnico dos pilotos CPC M03–M05 (28/10/2026)

- **Workflow:** [GitHub Actions 40607564248](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40607564248), `completed/success` no commit `b33ae9d91f204297094aeaac290c447943a030f5`.
- **Matriz:** 19 módulos CPC × 390, 768 e 1366 px = **57/57 verificações aprovadas**, sem JavaScript errors, sem overflow global e com checkboxes persistentes. Outros módulos não foram alterados.
- **Quadros consultivos preservando a fonte:** CPC M03 — 5 linhas e 3 colunas ("Critérios de competência"); CPC M04 — 5 linhas e 2 colunas (faixas de honorários); CPC M05 — 4 linhas e 3 colunas (classificação do litisconsórcio). Todos com `<caption>`, cabeçalhos e `scope=row`, rolagem horizontal local confirmada no viewport de 390 px.
- **Fidelidade:** cada linha foi confrontada literalmente com o original no CI e também é confrontada antes da renderização. Nenhuma substituição do texto original do material; o adicional é exibido **somente no modo completo**. No modo resumido, quadros Premium não aparecem.
- **Navegação:** botões de retorno indicam M03, M04 ou M05, com o mesmo comportamento de fechar e retornar ao módulo.
- **Artefato de evidências:** [12781491929](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40607564248/artifacts/12781491929), aproximadamente 6,25 MB de capturas e `metricas.json`, expiração prevista em **11/11/2026**.
- **Panorama CPC atual:** M02, M03, M04 e M05 têm 1 tabela HTML consultiva cada no leitor completo; M06–M20 continuam com 0 tabelas HTML identificadas. Este resultado **não** significa que todos os quadros dos M02–M05 foram reconstruídos.
- **Pendências:** cotejamento editorial humano de todos os quadros remanescentes, revisão jurídica das fontes, validação em sessão Premium real na Preview protegida e autorização do ambiente de deploy privado. Não usar esta execução como aprovação para `main`/Production.
- **Próxima etapa recomendada:** inventariar e tratar CPC M06–M08 de modo conservador, começando por comparativos com limites claros de coluna; se o OCR não permitir atribuição inequívoca, registrar para confronto manual em vez de inventar conteúdo.

## Etapa 9.3 — Acabamento editorial CPC M06–M08 (28/10/2026)

- **Correção restrita à apresentação, sem alterar arquivos de conteúdo:** M06/M07/M08 ganham quadros consultivos verificados literalmente com a fonte original antes de serem exibidos. A transcrição de cada apostila fica íntegra e os novos quadros aparecem exclusivamente em **completo**.
- **M06** (2 linhas × 3 colunas): confronto impedimento × suspeição para natureza e intensidade do risco. Os nomes dos aspectos são rótulos editoriais de navegação, enquanto as afirmações jurídicas são literais do original. Outras ressalvas permanecem na transcrição.
- **M07** (5 linhas × 2 colunas): sentença, decisão interlocutória, despacho, ato ordinatório e acórdão — cinco caracterizações com correspondência literal do texto original.
- **M08** (10 linhas × 2 colunas): os prazos e números constantes do quadro da apostila, transcritos literalmente. **Ainda requerem revisão jurídica independente e verificação de atualização normativa**, não incluída no teste de fidelidade editorial.
- As tabelas utilizam legenda, cabeçalhos e rolagem local `.table-wrap`; resumo, marcações, progresso e leitores dos demais módulos inalterados. Os botões "Voltar ao M06/M07/M08" **já estavam corretos**, portanto não foram modificados.
- Testes estendidos nos 19 módulos CPC × 390/768/1366 px com verificação da fonte, tabela, rolagem mobile, resumo e progresso. **Status inicial: aguardando CI**, sem liberação de Production, banco Neon, `main` ou Preview protegida.

## Etapa 9.3 — CPC M06–M08: fechamento técnico (28/10/2026)

- **Execução comprovada:** [GitHub Actions 40608578760](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40608578760), `completed/success` para o commit `9be03cde3a4e0027f181288cb13740360968f68c`.
- **57/57 verificações CPC**: 19 leitores M02–M20 nas larguras 390/768/1366 px. Sem erros JavaScript, sem transbordamento horizontal global, progresso persistente após reabertura; nenhum vazamento dos quadros Premium para resumos.
- **Resultados dos quadros:**
  - **M06:** impedimento × suspeição, duas comparações e três colunas, sem retirar nuances jurídicas já existentes no material.
  - **M07:** cinco tipos de pronunciamentos judiciais (sentença, decisão interlocutória, despacho, ato ordinatório e acórdão), cinco linhas e duas colunas.
  - **M08:** dez registros de prazos/números do quadro original, dez linhas e duas colunas, transcrição literal.
- **Responsividade:** cada quadro foi validado em 390, 768 e 1366 px, com scroll horizontal **interno** em 390 px; elementos `table` com `caption`, cabeçalhos semânticos de coluna e linha.
- **Integridade:** arquivos originais `content/cpc/m0{6,7,8}-native-data.js` intocados; a verificação de correspondência com fonte original executou no navegador antes da inserção. Os botões de retorno desses três leitores já tinham o rótulo correto e não foram alterados.
- **Evidências:** [artefato 12781673169](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40608578760/artifacts/12781673169), aproximadamente 6,7 MB com capturas e `metricas.json`, válido aproximadamente até **11/11/2026**.
- **Limites:** verificar literalmente as linhas no material fornecido **não equivale** a validação atualizada dos enunciados de lei, jurisprudência ou prazos — sobretudo os números do M08. A revisão editorial humana das outras passagens, tabelas e conteúdo legislativo continua pendente, assim como Preview autenticada.
- **Panorama CPC atualizado:** M02–M08 contêm 1 quadro HTML consultivo piloto cada (**7 módulos**). M09–M20 seguem com **0 tabelas HTML** detectadas. Os módulos M02–M08 também contêm quadros remanescentes a reconstruir individualmente quando inequívocos.
- **Próximo lote conservador:** examinar CPC M09–M11, identificar quadros cujas células possam ser comprovadas pela fonte, e evitar reconstrução inferida de extrações de PDF com palavras deslocadas.
- Sem merge, deploy em Production, mudança de Neon, alteração de permissões Premium ou publicação da Preview privada.

## Etapa 9.4 — Acabamento editorial CPC M09–M11 (28/10/2026)

- Os três módulos usam fonte `complete` compacta em string multiline em `content/cpc/m09/m10/m11-native-data.js`. A conferência verificou que são apostilas completas menores que muitos módulos anteriores; extensão não equivale, por si só, a perda, mas permanece **pendente de revisão editorial contra as fontes de origem**.
- Alterados **somente** os leitores `ui/cpc-m09/m10/m11-native-study-reader.js` e seus testes; os dados originais completos/resumidos não foram reescritos.
- **M09:** quadro das hipóteses do art. 311 (incisos I–IV), 4 linhas × 2 colunas, transcrição literal das expressões `I:`, `II:`, `III:`, `IV:`.
- **M10:** indeferimento × improcedência liminar, 2 linhas × 2 colunas, com as caracterizações originais; sem acrescentar ou reinterpretar causas de cabimento.
- **M11:** julgamento conforme o estado, arts. 354–356, 3 linhas × 2 colunas, com sínteses inteiras da fonte original e sem cortes nem simplificações.
- Os quadros só surgem se cada descrição constar literalmente da teoria original. São consultas adicionais antes da transcrição existente, com `table`, `caption`, `th`, `.table-wrap` e scroll horizontal local; nada é apagado do texto original nem exibido no resumo. Os botões de retorno dos três módulos já estavam corretos e foram mantidos.
- O arquivo `tests/etapa6-cpc-m02-m20-browser.mjs` passa a verificar essas três novas tabelas em três larguras e regressões de todos os 19 módulos CPC. **Status final: 57/57 testes aprovados na execução 40609589480, com detalhes no encerramento abaixo.**
- Sem deploy em Production, merge `main`, alteração de permissões Premium ou Neon. A Preview privada integrada exige validação e autorização separadas.

## Etapa 9.4 — Encerramento técnico CPC M09–M11 (28/10/2026)

- **CI validado:** [GitHub Actions 40609589480](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40609589480), concluído com `success` para o commit `ecd4c854761e64134f3cc288caafd0534b151e03`; **57/57 testes** CPC M02–M20 nos viewports 390, 768 e 1366 px.
- **Quadros consultivos novos:** M09, quatro linhas (incisos I–IV do art. 311); M10, duas linhas (indeferimento × improcedência liminar); M11, três linhas (arts. 354, 355 e 356). Todos são HTML `<table>` com `<caption>`, `<thead>`, `th scope`, cabeçalhos e scroll horizontal local no celular.
- **Fidelidade e segurança:** cada célula transcrita é confrontada literalmente com o texto `complete` original em tempo de execução; o texto original continua exibido e não houve alteração nos arquivos `content/cpc/m09..m11-native-data.js`. Os quadros não são adicionados ao resumo. Leitura e marcação de capítulos continuam funcionando com persistência local.
- **Correção durante CI:** o primeiro commit `9dece065...` inadvertidamente salvou o script do M09 como `ui/cpc-m9-native-study-reader.js`, e os testes falharam por ausência de tabela M09. O commit corretivo `ecd4c854...` instalou-o no caminho correto `ui/cpc-m09-native-study-reader.js`, excluiu o arquivo órfão e flexibilizou a verificação de legenda para aceitar textos explicativos diferentes. **A execução corrigida passou.**
- **Capturas e métricas:** [artefato 12782521030](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40609589480/artifacts/12782521030), aproximadamente 7 MB; expira por volta de **11/11/2026**.
- **Cobertura editorial piloto:** CPC **M02–M11**, 10 módulos com ao menos uma tabela de consulta HTML; **M12–M20** ainda não receberam tabelas consultivas nesta etapa. M02–M11 continuam com outros possíveis quadros e revisões de títulos pendentes.
- **Ponto de atenção editorial:** as teorias completas originais de M09/M10/M11 têm respectivamente 4.572, 4.428 e 6.103 caracteres, bem menos que certos módulos de CPC anteriores. O teste confirmou que se renderizam corretamente, mas **não prova** suficiência editorial, atualização jurídica ou equivalência a fontes externas de origem.
- **Próxima etapa recomendada:** inspecionar M12–M14 para reconstruções com alinhamento inequívoco e, depois, revisar visualmente todas as tabelas reconstruídas no ambiente integrado autenticado, respeitando a autorização `bc-preview-private` e o SHA pinado.
- Não houve mudanças em Production, `main`, Neon, conteúdo jurídico, políticas de acesso ou pagamentos. Sem publicação da Preview privada atualizada.

## Etapa 9.5 — Pilotos CPC M12–M14 (28/10/2026)

- Escopo: quadros adicionais no **modo completo** dos leitores CPC M12, M13 e M14, sem editar o texto jurídico original ou os resumos. Os botões de retorno já estão corretos; não sofreram alteração.
- **M12, ônus estático da prova:** quadro com autor/fato constitutivo e réu/fato impeditivo, modificativo ou extintivo (2 linhas). A fonte é uma frase contínua; ambas as atribuições são guardadas por verificação literal da frase.
- **M13, modalidades de liquidação:** arbitramento versus procedimento comum, 2 linhas × 2 colunas, com descrições integrais extraídas do material sem interpretá-las. Cálculo aritmético não foi transformado em terceira modalidade.
- **M14, ritos do cumprimento:** 5 linhas × 2 colunas, literalmente transcritas do quadro que já existe em texto no item 19. O material original contém alertas de atualização, especialmente art. 529-A (vigência futura segundo o material) e prazos. **A etapa não certifica a vigência das normas citadas**; a verificação jurídica permanece pendente.
- Tabelas usam `table`, `caption`, `th scope` e contêiner `.table-wrap` com rolagem horizontal própria. Cada quadro só é adicionado quando toda sua evidência literal é encontrada no original. Nenhuma parte do texto já renderizado é excluída.
- Teste de regressão dos 19 módulos CPC em Chromium nas larguras 390, 768 e 1366 px, verificando quadro, semântica, fonte, rolagem, resumo e persistência. **CI concluído com 57/57 verificações aprovadas — detalhes do fechamento abaixo.**
- Branch e Preview privadas mantidas, sem aprovação de deployment, `main`, Production ou Neon.

## Etapa 9.5 — CPC M12–M14: encerramento técnico (28/10/2026)

- **CI aprovado:** [GitHub Actions 40610065608](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40610065608), `completed/success` sobre o commit `e793857f913a244e98fc318e4fda888297bb4a6c`.
- **57/57 cenários Chromium aprovados:** 19 leitores CPC M02–M20 × 390/768/1366 px, sem erros JS, overflow de página, perda de progresso local ou aplicação das tabelas Premium no modo resumo.
- **M12:** quadro sobre ônus estático de autor e réu (2 linhas × 2 colunas). Frase original usada como prova de ambas as atribuições; nenhuma afirmação editorial nova sobre distribuição dinâmica.
- **M13:** arbitramento × procedimento comum em liquidação (2 linhas × 2 colunas), descrições integrais e sem classificar cálculo aritmético como modalidade.
- **M14:** ritos de cumprimento de sentença (5 linhas × 2 colunas), linhas retiradas sem abreviação do quadro original. Regimes, prazos e atualizações legislativas requerem revisão jurídica adicional independente da comparação literal.
- HTML semântico `<caption>`, `<thead>`, `<tbody>`, cabeçalhos `th[scope]` e scroll local `.table-wrap` no celular. Tabelas só são exibidas se o texto de origem contiver todas as informações; os originais `content/cpc/m12/m13/m14-native-data.js` permaneceram intocados.
- **Evidências:** [artefato 12782282518](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40610065608/artifacts/12782282518), 7,3 MB de capturas e métricas, com expiração aproximada em **11/11/2026**.
- **Cobertura dos pilotos CPC:** M02–M14, ou **13 módulos** com ao menos uma tabela de consulta HTML. M15–M20 seguem ainda sem tabelas HTML registradas nesses testes; muitos quadros de M02–M14 também aguardam tratamento pontual.
- **Próximo lote recomendado:** CPC M15–M17 com preservação literal; depois M18–M20. Ao final, revisar editorialmente todas as tabelas piloto e validar os leitores na Preview integrada e protegida, com controle de autenticidade/segurança.
- **Limites:** não são aprovações de exatidão jurídica atualizada, acesso Premium autenticado na Preview ou publicação em Production. Não houve alteração em `main`, Production, Neon ou políticas de acesso.

## Etapas 9.6–9.7 — Fechamento dos pilotos CPC M15–M20 (28/10/2026)

- **M15–M17:** 6 correspondências recurso/decisão, 6 espécies de execução, 2 distinções embargos/pré-executividade. Chromium 57/57: [run 40610747519](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40610747519), commit `27570534`, [evidências 12783381129](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40610747519/artifacts/12783381129).
- **M18–M20:** quatro procedimentos especiais, três categorias de coisa julgada coletiva, distinção IAC/IRDR. Chromium **57/57**: [run 40611574232](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40611574232), commit `7489da41`, [evidências 12782917822](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40611574232/artifacts/12782917822), expiração prevista em 11/11/2026.
- **Resultado consolidado:** CPC **M02–M20 = 19/19 módulos** com pelo menos um quadro de consulta semântico HTML no modo completo. M01 segue na validação própria de seus pilotos. Cada tabela adicional foi confrontada com a fonte literal; arquivos de conteúdo e resumos não foram modificados. Confirmados scroll horizontal local a 390 px, uso de cabeçalhos e persistência de leitura.
- **Pendências:** reconstrução de outros quadros originais, suficiência e hierarquia editorial de cada apostila, atualização jurídica normativa e jurisprudencial, validação em Preview privada com aluno autenticado. Testes isolados não validam permissão Premium integrada.
- **Próxima fase recomendada:** auditoria de acabamento transversal CPC M01–M20, fidelidade de tabelas e títulos, capturas visuais e posteriormente homologação integrada autorizada. Nenhuma alteração em Production, `main`, banco Neon ou direitos de acesso.

## Etapa 10 — Auditoria transversal CPC M01–M20 (28/10/2026)

- **Relatório detalhado e pendências:** [etapa10-auditoria-editorial-cpc-2026-10-28.md](./etapa10-auditoria-editorial-cpc-2026-10-28.md).
- **GitHub Actions:** [40612533828](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40612533828) — `success`, **60/60** combinações M01–M20 × 390/768/1366 px. Evidências: [artefato 12783393871](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40612533828/artifacts/12783393871), aproximadamente 2,7 MB.
- Corrigida **legenda acessível da tabela CPC M01 (14 linhas × 3 colunas)**; saneados **5 rótulos de títulos** com números duplicados: M02 (2), M04 (2) e M06 (1). A fonte jurídica, IDs dos títulos, conteúdo resumido e progresso não foram alterados.
- Os **20 módulos** possuem pelo menos uma tabela HTML consultiva com rolagem local e cabeçalhos; todos passaram nos testes técnicos. **Não equivale** a completar a conversão de todos os quadros originais nem revisão jurídica.
- **Pendentes:** cotejamento dirigido de linhas do M01–M08 não idênticas em comparação textual automatizada (não significa perda), item de questionário M06 erroneamente reconhecido como H2, hierarquia de títulos, suficiência editorial/jurídica das teorias e Preview com aluno autenticado.
- **Próxima etapa segura:** cotejamento editorial M01–M08, começando por M06 e pelos trechos sinalizados, preservando a integralidade das fontes. Nada em `main`, Production, Neon ou Preview protegida.

## Etapa 10.1 — Cotejamento dirigido CPC M01–M08 (28/10/2026)

- **Relatório técnico e tabela por módulo:** [etapa10-1-cotejamento-cpc-m01-m08-2026-10-28.md](./etapa10-1-cotejamento-cpc-m01-m08-2026-10-28.md).
- **Resultado validado:** [Chromium 40613918617](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40613918617), **60/60 verificações aprovadas**; [capturas e métricas 12784721204](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40613918617/artifacts/12784721204), expiram aproximadamente em 11/11/2026.
- **72 diferenças da auditoria anterior classificadas:** 61 sequências textuais presentes apesar de reformatação, 6 títulos exibidos com rótulos normalizados e 5 metadados editoriais filtrados. **Não surgiram novas evidências de perda jurídica nesse rastreamento textual**, mas a presença de caracteres não equivale à conferência humana ou jurídica integral.
- **Correção M06:** questão nº 10 não exibe mais o prefixo espúrio `20.`; as **15 questões** recebem cartão de revisão com fonte de **18 px** em vez de estilo de título de 27 px. Não houve troca de tag H2, ID, índice, comportamento de progresso ou alteração da fonte original.
- **Incidente corrigido:** a primeira execução falhou por conflito de CSS; após ajustar a regra específica do M06, a segunda passou. Regressão CPC M02–M20 também aprovada em [40613898570](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40613898570).
- **Próxima etapa recomendada:** separar visualmente a junção textual comprovada no **CPC M05** ("...expressasPARTE IV...") e examinar demais quebras originadas na extração, mantendo todos os textos intactos. Depois, revisar profundidade/hierarquia de M09–M20 e homologar na Preview autenticada com autorização.
- Sem mudança de `main`, Production, banco Neon, permissões, assinaturas ou publicação de Preview privada.

## Etapa 10.2 — Divisor da PARTE IV no CPC M05 (28/10/2026)

- **Relatório detalhado:** [etapa10-2-cpc-m05-divisor-2026-10-28.md](./etapa10-2-cpc-m05-divisor-2026-10-28.md).
- **Reparo específico:** separar visualmente a frase final sobre amicus curiae do título "PARTE IV - PEGADINHAS FCC", colados na extração de PDF. Exceção no parser apenas para essa linha literal, preservando a frase, o H2 do item 41 e todos os IDs/checkpoints de capítulos. Fonte `content/cpc/m05-native-data.js` e resumo **intocados**.
- **Validação:** [auditoria 40615263401](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40615263401) — **60/60**; [regressão 40615263698](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40615263698) — **57/57**. Três resoluções 390/768/1366 px, persistência de progresso e aparência Premium.
- **Evidências:** [12784812995](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40615263401/artifacts/12784812995) e [12784902747](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40615263698/artifacts/12784902747); retenção aproximada até 11/11/2026.
- **Etapas estimadas para esta frente CPC:** 10.3 (revisão residual), 10.4 (Preview Premium autenticada), 10.5 (correções/aceite, se necessário). Não representam a conclusão das demais disciplinas, da atualização jurídica ou da comercialização da Base Completa.
- Nenhuma atualização autorizada ou realizada em `main`, Production, Neon, planos ou Preview protegida.

## Etapa 10.3 — Revisão editorial residual CPC (28/10/2026)

- **Relatório detalhado:** [etapa10-3-revisao-residual-cpc-2026-10-28.md](./etapa10-3-revisao-residual-cpc-2026-10-28.md).
- **Execução técnica concluída:** separadas as junções de gabarito 1 → questão 2 e gabarito 15 → "PARTE VIII" do teste final do **CPC M05**; 15 questões destacadas na leitura completa. Apenas DOM e CSS da Preview; arquivo de fonte, resumo, número de H2 e IDs/checkpoints originais preservados.
- **CI confirmada:** [auditoria 40616347534](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40616347534) **60/60**, [regressão 40616082342](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40616082342) **57/57** em 390/768/1366 px.
- **Evidências:** [auditoria 12784913993](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40616347534/artifacts/12784913993) e [regressão 12785395982](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40616082342/artifacts/12785395982), expiração prevista até 11/11/2026.
- **Pendências identificadas:** junção ainda presente na fonte `direito material.26. QUEM PODE REQUER` do M05, cuja correção de H2 exige preservar/migrar índices de progresso; auditoria de outros quadros, suficiência editorial dos módulos curtos M09/M10/M15/M17, revisão jurídica e teste com aluno autenticado.
- **Próxima etapa recomendada:** 10.4 — homologação integrada em Preview privada com conta Premium e Gratuito em homologação, após confirmar o deployment/commit autorizado e sem modificar Production. 10.5 somente se surgirem correções ou pendências de aceite.

## Etapa 10.4 — Pré-homologação integrada CPC (28/10/2026)

- **Relatório:** [etapa10-4-homologacao-integrada-cpc-2026-10-28.md](./etapa10-4-homologacao-integrada-cpc-2026-10-28.md).
- **Testes aprovados sobre commit `f5dc763b...`:** [GitHub Actions 40653718030](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40653718030): **40/40 testes de autenticação/proteção Premium**, 11/11 unidades de layout e **60/60 verificações visuais do CPC M01–M20** em Chromium local; [capturas e métricas 12799764112](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40653718030/artifacts/12799764112).
- **Atenção: NÃO HOMOLOGADA COM ALUNO REAL.** Preview visual `base-completa-teste-visual` ainda no commit `10c4d9a...`; Preview privada da aplicação `central-de-estudos` encontrada no commit `d6ca4229...`, anterior às correções finais; nenhum deployment exato do commit testado localizado no projeto principal.
- **Bloqueio seguro:** workflow privado está fixado no SHA antigo e depende de aprovação `bc-preview-private`. Banco Neon `base-completa-homologacao` existe, mas não foi comprovada a conexão isolada do Preview desta branch com ele; há `DATABASE_URL` genérica em Preview. Não disparar login de contas de teste ou modificar o pin/proteção antes de confirmar o ambiente.
- **Próximo passo:** confirmar ligação Preview → Neon de homologação, atualizar e aprovar deployment privado de SHA verificado sem expor segredo, testar Premium/Gratuito em sessão autenticada e registrar evidências. Se houver defeitos, abrir a Etapa 10.5.
- Sem alterações em `main`, Production, Neon, plano dos alunos, pagamentos ou proteção da Vercel.

## Etapa 10.4.1 — Preview privada preparada; publicação sob aprovação (28/10/2026)

- **Relatório detalhado:** [etapa10-4-1-preparacao-preview-autenticada-2026-10-28.md](./etapa10-4-1-preparacao-preview-autenticada-2026-10-28.md).
- **Vercel isolado:** projeto temporário `base-completa-teste-visual`, não o projeto de produção. `DATABASE_URL` do target Preview configurada como `sensitive` para projeto Neon de teste `shiny-hall-19564809`, que já possui alunos fictícios Gratuito e Premium e a matriz `central_plan_entitlements` completa. Segredos já existentes e protegidos. `EXAM_PROGRESS_PREVIEW_DB_ISOLATED=true`, Hotmart live e receiver de teste desativados, Vercel Authentication preservada.
- **Workflow fixado em código aprovado:** `f5dc763b6fcd0f995e2a44ff98e0f03ef3d630e9`, com testes de autenticação, Premium e Chromium antes do deploy. Continua sob environment protegido `bc-preview-private`; [execução 40660741519](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40660741519) em `waiting` para aprovação do revisor.
- **Limite rigoroso:** não houve deployment do commit novo nem sessão autenticada Premium/Gratuito. A versão READY existente no projeto temporário ainda é `10c4d9a...` e **não** comprova as melhorias recentes.
- **Próximo checkpoint:** revisão/autorização do environment do GitHub, verificação do novo SHA READY e testes de acesso por plano com credenciais de homologação, sem alterar Production, `main` ou Neon real. Somente então concluir a 10.4.

## Etapa 10.4.1 — Publicação privada aprovada e executada (28/10/2026)

- **GitHub Actions:** [40660957860](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40660957860) terminou com `success` após aprovação humana do environment protegido. Deploy Vercel do projeto temporário `base-completa-teste-visual`: `dpl_H3XSoKBuzMh1wZrTe5PoAhstRJjn`, **READY**, commit exato `f5dc763b6fcd0f995e2a44ff98e0f03ef3d630e9`, URL https://base-completa-teste-visual-30p9rguhx-estudotd.vercel.app .
- **Proteção:** Vercel Authentication mantida para todos os deployments; o link temporário criado para inspeção teve revogação solicitada. Banco Preview de teste configurado como `DATABASE_URL` sensível e Hotmart live desligado.
- **Smoke test:** login HTML exibido; `/api/auth?action=me` sem sessão: HTTP 200, `authenticated:false`. Esse resultado comprova ausência de autenticação anônima nesse endpoint, não a íntegra da separação de planos. Requisições automatizadas de arquivos CPC pagos pararam na camada de proteção Vercel e **não** comprovam código HTTP da aplicação.
- **Homologação integrada ainda pendente:** teste autenticado Premium e Gratuito com credenciais protegidas, direitos de acesso, salvamento do progresso e visual da Preview publicada. **Não atestar etapa 10.4 concluída** até verificar isso de modo real.
- **Relatório pós-aprovação:** [Etapa 10.4.1](./etapa10-4-1-preparacao-preview-autenticada-2026-10-28.md). Nenhuma alteração em `main`, banco de produção, contas reais ou política de proteção do projeto.

## Etapa 10.4.3 — Logins e entitlements homologação (28/10/2026)

- **Evidência:** [relatório da validação de sessões](./etapa10-4-3-validacao-sessoes-cpc-2026-10-28.md).
- Duas contas fictícias **ativas**, com senhas criadas pelo proprietário e **últimos logins efetivos registrados** no Neon de homologação às 10:28 UTC (Premium) e 10:30 UTC (Gratuito).
- A matriz no banco confirmou que `theory.summary` é habilitada para ambos; `theory.complete`, `tec.links` e `qc.links` são desabilitadas para Gratuito e habilitadas para Premium.
- Testes de navegador foram iniciados com perfis separados, mas o último retorno era **`pending`, passo zero**, sem evidência de leitura CPC ou progresso real. **Não declarar Etapa 10.4 homologada** sem resultados autenticados end-to-end.
- Nenhuma alteração em `main`, Production, alunos reais ou pagamentos. Banco consultado somente para estas verificações.

## Etapa 10.4.3 — Testes autenticados, reprodução de falha no Gratuito e correção pendente (28/10/2026)

- **Relatório:** [etapa10-4-3-cpc-sessoes-autenticadas-e-correcao-free-2026-10-28.md](./etapa10-4-3-cpc-sessoes-autenticadas-e-correcao-free-2026-10-28.md).
- **Autenticação real confirmada** nas duas contas fictícias por `GET /api/auth?action=me`. Plano real de cada conta confirmado no Neon de teste (Premium e Gratuito ativos).
- **Premium:** painel e 20 módulos CPC visíveis; abertura efetiva M05, tabelas, progresso **não concluídos** devido ao modal inicial e limite da automação.
- **Gratuito:** falha real e repetida de carregamento `Preparando sua Central / Não foi possível concluir o carregamento`; ainda não foi possível verificar resumo CPC ou bloqueio real dos conteúdos pagos.
- **Correção de bootstrap isolada em `central-v119.html`:** não injetar scripts premium-only para aluno Gratuito, mantendo 403 do servidor e resumos nativos projetados. Sem alterações em permissões, conteúdos originais, bancos reais ou Production.
- **GitHub Actions** [40674760691](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40674760691): aprovado **3/3 testes novos de bootstrap**, **40/40 segurança e autenticação**, **11/11 tema e pilotos**, **60/60 Chromium**; [artefato 12809229793](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40674760691/artifacts/12809229793).
- **Deployment privado corrigido ainda NÃO APROVADO:** novo workflow em [40674969770](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40674969770), exige `bc-preview-private`, SHA fixado em `123820c59525da2883951e822a6d622d64b85fcc`. Somente depois de READY repetir os cenários autenticados e validar progresso real.
- **Classificação:** Etapa 10.4 ainda parcial; Etapa 10.5 iniciada como correção necessária, não publicada; Production intacta.

## Etapa 10.4.3 — E2E autenticado parcial: plano aprovado, leitor pendente (28/10/2026)

- **Relatório com evidências:** [etapa10-4-3-validacao-sessoes-cpc-2026-10-28.md](./etapa10-4-3-validacao-sessoes-cpc-2026-10-28.md).
- **Confirmado em navegador com perfis salvos:** `/api/auth?action=me` autenticou as duas contas sintéticas; `/api/plans?action=me` confirmou plano Gratuito e Premium ativos e direitos corretos. Gratuito: resumo sim, apostila completa e links TEC/QC não, Lei em Dia com limite 20/dia. Premium: resumo e apostila completa sim, links TEC/QC sim e sincronização de progresso avançado.
- **Teste UI ainda não aprovado:** navegador Gratuito observou erro de carregamento da Central; navegador Premium chegou ao dashboard com CPC listado (20 módulos), mas não acessou o leitor nem comprovou persistência.
- **Navegação esclarecida:** `/central-v119.html` monta `index.html` e normaliza a URL para `/` intencionalmente; isso não é falha comprovada. Para abrir o CPC, usar clique **Disciplinas → Direito Processual Civil**, não rotas `/central` ou `/#/cpc`.
- **Contrato de acesso:** arquivos CPC `mXX-native-data.js` podem retornar JS **projetado somente com resumos** no Gratuito; não exigir 403 indiscriminadamente. Verificar que conteúdo completo não seja entregue.
- **Conclusão:** a segurança de autenticação/entitlements está homologada; **Etapa 10.4 permanece parcial até testar a UI, as apostilas e o progresso reais**. Evitar qualquer merge/publicação até essa verificação ou correção. Nenhuma mudança em Production/`main`/banco real.

## Etapa 10.4.3 — Resultado dos testes autenticados (28/10/2026)

- Os navegadores com contas de homologação **terminaram**, substituindo a anotação antiga de `pending`. [Relatório atualizado](./etapa10-4-3-validacao-sessoes-cpc-2026-10-28.md).
- **Gratuito:** login real `authenticated:true`, plano `free` ativo via API, `theory.summary=true`, `theory.complete=false`, TEC/QC desativados; **Lei em Dia 20/dia**. Tentativa de abrir a Central apresentou erro de carregamento. Bloqueio HTTP do arquivo completo ainda não medido.
- **Premium:** login real `authenticated:true`, plano `premium` ativo via API, teoria completa habilitada. O navegador apresentou dashboard inicial mas não conseguiu abrir os módulos CPC; progresso de leitura não testado. **Não é correto declarar aprovação completa nem defeito comprovado da apostila.**
- **Diagnóstico da rota:** em `central-v119.html` o bootstrap chama `history.replaceState` para `/` intencionalmente. A navegação suportada é **Disciplinas → Direito Processual Civil**, via `centralHardSubject('cpc')`; tentativas de navegar para `/#/cpc` ou `/central` não comprovam falha.
- **Próximo ensaio dirigido:** clicar na UI de disciplina CPC com cada conta e avaliar apostila M05, 403 real para Gratuito, persistência Premium, falha de carregamento Gratuito (se reproduzir). Sem modificar Production.

## Etapa 10.4.4 — Navegação CPC comprovada em Chromium local (28/10/2026)

- **Relatório:** [etapa10-4-4-validacao-navegacao-cpc-2026-10-28.md](./etapa10-4-4-validacao-navegacao-cpc-2026-10-28.md).
- **Resultado:** [CI 40686290633](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40686290633) **success**, com 60/60 cenários editoriais e **3/3 fluxos completos de navegação** (390/768/1366 px): escolha "Estudo livre", clique em Disciplinas e no cartão CPC, carregamento dos 20 módulos, leitor M05 e marcadores editoriais; check de capítulo pendente persiste ao fechar/reabrir. Sem erros JS. [Evidências 12815675693](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40686290633/artifacts/12815675693).
- **Causa dos falsos bloqueios anteriores:** o modal obrigatório de objetivo do primeiro acesso impedia clicar no menu sem seleção prévia. O índice de capítulos fica recolhido até abrir **Aa** (no celular) e **Capítulos**. Desmarcar capítulo lido pode ativar novo check automático após reabrir; teste passou a marcar capítulo inicialmente pendente.
- **Limite:** testes de navegação foram realizados em Chromium local com sessão simulada; as sessões reais `free` e `premium` foram autenticadas e o Neon confirmou as permissões, mas ainda não há evidência de leitura completa/progresso e bloqueios HTTP **no deployment Vercel**. Portanto **não encerrar integralmente 10.4** sem E2E real em Preview.
- Mudanças desta sequência limitaram-se à suíte de teste e documentação na branch de Preview. Nenhuma publicação da branch mais recente, merge ou alteração em produção.

## Etapa 10.4.4 — Autenticação real comprovada, falha Gratuito tratada e nova Preview pendente (28/10/2026)

- **Relatório de retomada:** [etapa10-4-4-cpc-e2e-diagnostico-correcao-2026-10-28.md](./etapa10-4-4-cpc-e2e-diagnostico-correcao-2026-10-28.md).
- **E2E real já executado nas contas fictícias:** Gratuito e Premium autenticaram na Base (e API de planos reconheceu `free` e `premium` com entitlements corretos). Contudo, o navegador do Gratuito registrou erro de carregamento e o do Premium não alcançou a apostila M05; **não declarar progresso persistente real validado**.
- **Diagnóstico corrigido:** o bootstrap `central-v119.html` muda intencionalmente a rota para `/` — não é erro. A UI adequada é **Disciplinas → Direito Processual Civil → M05**. O loader podia interromper toda a disciplina se uma bateria Premium do CPC retornasse 403 para Gratuito; foi aplicado tratamento por arquivo exato, exclusivamente após confirmar `free` e `premium.reviews=false` na API do plano. Bloqueio real de apostila, 403 inesperado e falha 500 continuam explícitos.
- **CI concluída:** [40703450603](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40703450603), **success** sobre o SHA `176cb0e1fe99c37ef1e92534b2f0cdbca47a50a7`: **7/7** testes do loader, **60/60** verificações editoriais, **3/3** cenários da Central completa no Chromium (390/768/1366 px), incluindo M05 e persistência de marcação em **sessão simulada local**. [Capturas 12821879218](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40703450603/artifacts/12821879218).
- **Próxima ação protegida:** [Aprovar deployment privado 40704051853](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40704051853) no environment `bc-preview-private`; o workflow está fixado no SHA auditado `176cb0e1...`, projeto `base-completa-teste-visual`, nunca Production. A Preview READY existente ainda é `f5dc763b...` e não inclui a correção.
- **Após aprovação:** confirmar novo SHA READY; então validar **na Preview publicada**, com `gratuito@teste.invalid` e `premium@teste.invalid`, bloqueio HTTP de conteúdo pago, resumo CPC, módulo M05 e progresso após fechar e reabrir. Só concluir a Etapa 10.4 com essas evidências reais; em seguida verificar pendências editoriais/aceite 10.5.
- Nenhuma alteração em `main`, Production, contas reais ou banco Neon de produção. Alterações apenas no código e testes da branch isolada + documentação.

## Etapa 10.4 — Execuções autenticadas de navegador encerradas (28/10/2026)

- **Verificação final:** runs Gratuito `adcac97b-feac-4065-8acb-d7bfe1d659cd` e Premium `926eefdb-5fab-499b-a5f7-7af025d33f43` encerrados. Os dois obtiveram `authenticated:true` e a API de planos confirmou os direitos corretos: Gratuito sem teoria completa/TEC/QC; Premium habilitado.
- **Pendente:** o navegador Gratuito não carregou corretamente a Central; Premium chegou ao dashboard com 20 módulos de CPC, mas não abriu as apostilas usando o menu real. Sem prova de HTTP 403 do arquivo pago ou de persistência de marcações. Não homologar integralmente.
- **Diagnóstico esclarecido:** `central-v119.html` troca intencionalmente o caminho visível para `/`; isso **não** demonstra defeito de roteamento. Evitar corrigir uma suposta falha sem reproduzi-la pelo fluxo de navegação correto.
- **Relatório atualizado:** [Etapa 10.4.3](./etapa10-4-3-validacao-sessoes-cpc-2026-10-28.md). Próximo ensaio: `Disciplinas → Direito Processual Civil → M05` pela interface real; testar proteção HTTP e progresso.

## Etapa 10.4.5 — Bootstrap Gratuito corrigido e E2E local aprovado (28/10/2026)

- **Relatório:** [etapa10-4-5-cpc-fluxo-gratuito-integrado-2026-10-28.md](./etapa10-4-5-cpc-fluxo-gratuito-integrado-2026-10-28.md).
- **Correção efetiva na branch jurídica:** `central-v119.html` inicializa exclusivamente no plano Gratuito as coleções legadas vazias `CF_QUESTIONS`, `PENAL_QUESTIONS`, `CPC_QUESTIONS`; isso evita quebra do painel quando as baterias Premium são protegidas/retiradas, sem liberar perguntas pagas. Carregador existente continua não tolerando erros de apostila ou indisponibilidade.
- **Chromium aprovado:** [run 40740525439](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40740525439) no SHA `7584a48e72c94a3650ca5fb021c3cbfc4412517d`: **60/60** auditoria editorial, **3/3** navegação completa Premium M05/progresso (simulado local), **2/2** boot + CPC em Premium/Gratuito (simulado local), HTTP 403 **simulado** na URL de banco pago para Gratuito; [artefato 12838069616](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40740525439/artifacts/12838069616).
- **Restrição:** o cenário Free ainda registra um `Unexpected end of JSON input` não fatal na fixture de APIs; falta atribuir origem. Não concluir E2E real do deployment ou aceitar progresso integrado baseado somente no localhost.
- **Publicação privada aguardando revisão:** [run 40740988534](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40740988534), ambiente `bc-preview-private`, fonte fixada em `7584a48e...`, projeto temporário `base-completa-teste-visual`. **A Preview READY ainda estava no código anterior** e necessita aprovação humana no GitHub.
- **Próximo passo:** após revisão/aprovação privada, validar deployment READY pelo SHA, entrada das duas contas de homologação, HTTP 403 real para Gratuito, apostila M05 e persistência Premium na Preview, sem alterar Production, `main` ou Neon real.

## Retomada da Etapa 10.4 — Preview corrigida publicada e smoke comprovado (28/10/2026)

- O status anterior **“deploy aguardando aprovação”** foi superado: [GitHub Actions 40740988534](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40740988534) concluiu com `success`, e a **Preview protegida** `dpl_7ucKUZSZpA6Uzkv1weop8WrS3NKu` está `READY` com SHA exato `7584a48e72c94a3650ca5fb021c3cbfc4412517d`.
- Endereço: `https://base-completa-teste-visual-jhlc5cief-estudotd.vercel.app`. Google/Vercel SSO do projeto mantido. Smoke sem conta: página de login HTTP 200, `/api/auth?action=me` HTTP 200 com `authenticated:false`. Nenhuma liberação automática de plano.
- [CI da origem implantada](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40740525439): 60/60 editorial CPC, 3/3 navegação local M05 com progresso, 2/2 boot local Gratuito/Premium. O mock Free usa HTTP 403 **simulado**; não alegar autorização HTTP real comprovada no Vercel.
- Sessões autenticadas anteriores em navegador comprovadas **somente no deployment velho** `f5dc763b...`. Nova Preview necessita login das contas fictícias e testes manuais ou navegador autenticado para validação de acessos e persistência. Nova automação por navegador terceiro não foi iniciada devido à insuficiência de saldo; não houve falha comprovada da nova Preview.
- Um link temporário com TTL 3600 segundos foi disponibilizado ao proprietário fora dos relatórios (não incluir tokens de acesso em commits). Plano de ensaio: **Estudo livre → Disciplinas → Direito Processual Civil → M05** no Premium e Gratuito; verificar acesso correto, título Parte VIII e persistência Premium, bloqueio Gratuito e, separadamente, HTTP 403.
- **Conclusão:** Etapa 10.4 permanece **parcial** até prova de execução na Preview implantada. Sem mudanças em Production, `main`, Neon real ou pagamentos. [Relatório atualizado](./etapa10-4-5-cpc-fluxo-gratuito-integrado-2026-10-28.md).

## Etapa 10.5 — Correção de carregamento Civil e CPC em Gratuito (28/10/2026)

- **Falha recebida em captura:** `Não foi possível carregar` no painel Civil; origem mapeada ao `placeholder()` do `central-discipline-loader.js`.
- **Causa verificada no código:** a lista suplementar `CentralTheoryFiles` incluía scripts de links/teoria Premium mesmo quando o aluno Gratuito já tinha sua lista principal filtrada; 403 correto do servidor bloqueava o carregamento completo da disciplina.
- **Patch isolado:** `central-v119.html` exporta o filtro de scripts Premium e flag do plano à Central; `central-discipline-loader.js` filtra a lista suplementar também, sem remover conteúdo pago do Premium nem tornar arquivos públicos.
- **CI [40755456846](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40755456846), commit `7efe886...`: success**. Novos testes **5/5**; Chromium com Civil M01–M15 em **Gratuito e Premium**, mais 60/60 CPC, simulação explícita de 403, tudo aprovado. Ressalva: exceção não bloqueante `Unexpected end of JSON input` observada na fixture do Gratuito permanece fora do escopo.
- **Relatório completo:** [etapa10-5-correcao-carregamento-civil-2026-10-28.md](./etapa10-5-correcao-carregamento-civil-2026-10-28.md).
- **Próximo passo:** [aprovação do workflow privado 40755836130](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40755836130), verificar Vercel Preview READY com commit `7efe886...` e testar sessões reais de homologação. **Não afirmar produção corrigida** antes de publicação controlada.
- Nenhuma modificação em `main`, Production, banco real, conteúdos jurídicos ou dados de progresso.

## Etapa 10.5.1 — Proteção da Preview preservada após falha de teste (28/10/2026)

- [Relatório de diagnóstico e correção](./etapa10-5-1-correcao-seletor-onboarding-2026-10-28.md).
- [Deploy privado anterior 40755836130](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40755836130) foi aprovado pelo proprietário, mas **falhou antes de publicar**: Playwright strict mode em dois botões `data-onboarding-close` do onboarding. Não houve alteração no ambiente publicado.
- Correção apenas no seletor do teste `tests/etapa10-4-cpc-home-flow-browser.mjs`: usa `button.student-onboarding-close`. Código testado SHA `84111d7916ec1ad05d476d722c313fe0fa362960`.
- [Auditoria 40757167111](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40757167111) **success**, 60/60 CPC, 3/3 navegação Premium mock, 2/2 abertura CPC Gratuito/Premium, com bloqueio simulado 403 no Gratuito. Erro JSON não fatal remanescente da fixture não prova defeito em produção.
- **Próximo bloqueio:** [nova aprovação privada 40757485979](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40757485979), environment `bc-preview-private`. Fonte pinada para a nova Preview `84111d...`. Não liberar Production nem afirmar homologação autenticada E2E antes do deployment READY no SHA e de testes reais.

## Etapas 10.4/10.5 — Encerramento técnico CPC (28/10/2026)

- **Relatório final da frente técnica CPC:** [etapa10-4-encerramento-tecnico-cpc-2026-10-28.md](./etapa10-4-encerramento-tecnico-cpc-2026-10-28.md).
- **Auditoria GitHub Actions 40762473694** `completed/success`: 60/60 cenários editoriais M01–M20, 3/3 navegações integradas via Disciplinas até CPC M05 com persistência de capítulo após reabrir, fluxo Gratuito/Premium simulado com negativa 403 esperada e testes de segurança de login e carregamento aprovados. [Capturas e métricas 12849455412](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40762473694/artifacts/12849455412).
- **Prévia protegida READY:** Vercel `dpl_4VvG9FvYJHKmEVepP6teJspdfyLD`, commit funcional `84111d7916ec1ad05d476d722c313fe0fa362960`. Sem Production.
- **Teste redundante retirado:** tentativa extra de click em botão CPC falhou por timeout no próprio fixture; removida para manter os testes integrados já aprovados. Não se comprovou defeito novo na plataforma.
- **Sessões de teste:** duas contas fictícias Gratuito e Premium autenticaram-se, entitlements corretos. O Neon de homologação registrou sincronização Premium de Direito Civil M05, porém **não há evidência equivalente de persistência de CPC na Preview**.
- **Decisão:** *acabamento e homologação técnica local do CPC concluídos*; **homologação E2E em produção-like com login e sincronização CPC não certificada**. Não promover, nem afirmar aprovação jurídica final antes de verificar o leitor e o 403 por sessão real no deployment.
- **Segurança:** `main`, Production, dados de alunos reais e pagamentos intactos.

## Etapa 10.4 — E2E com dois alunos de homologação (28/10/2026)

- **Relatório atualizado:** [etapa10-4-3-validacao-sessoes-cpc-2026-10-28.md](./etapa10-4-3-validacao-sessoes-cpc-2026-10-28.md).
- **Navegadores concluídos:** [Gratuito](https://agent.tinyfish.ai/runs/adcac97b-feac-4065-8acb-d7bfe1d659cd) e [Premium](https://agent.tinyfish.ai/runs/926eefdb-5fab-499b-a5f7-7af025d33f43) confirmaram `/api/auth?action=me` com aluno autenticado e `/api/plans?action=me` com direitos esperados (Gratuito sem teoria completa/TEC/QC e 20 questões Lei em Dia/dia; Premium com teoria completa/TEC/QC).
- **Ainda bloqueado:** leitura visual M01–M20 e persistência do progresso. No Gratuito, a Central não terminou de carregar no navegador; no Premium, a interface principal mostrou CPC com 20 módulos, mas o agente não entrou na apostila. O redirecionamento para `/` é comportamento previsto em `central-v119.html`, e rotas imaginadas `/#/cpc` não devem ser usadas. Abrir CPC clicando na disciplina.
- **Classificação:** validação de autenticação e plano **aprovada**, homologação editorial autenticada **pendente**; não houve alterações em Production ou `main`. Para completar, usar navegação visual no Work ou navegador próprio do proprietário com as duas contas sintéticas, sem compartilhar senhas.
