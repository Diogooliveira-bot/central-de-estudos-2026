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
- **Status ao criar o checkpoint:** aguardar a execução do GitHub Actions; não declarar aprovação antes de examinar resultado e métricas.
- O deployment controlado permanece bloqueado por aprovação manual do ambiente; não criar Preview desprotegida nem enviar URL de deployment antigo como se fosse atual.
