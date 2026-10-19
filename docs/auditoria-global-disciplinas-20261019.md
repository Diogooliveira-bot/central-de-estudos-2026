# Auditoria global das disciplinas — 19/10/2026

## Escopo e versão de referência

- Repositório: `Diogooliveira-bot/central-de-estudos-2026`.
- Base: `main` no commit `b65fac593d03ad5586878ff2cede7538faa199bd` (Vercel produção antes desta tarefa).
- Branch de trabalho: `codex/global-discipline-standardization-20261019`.
- Arquivo de entrada atual: `central-v119.html`; montagem de disciplinas: `central-structural-v66119/runtime.js` e carregadores por disciplina.
- Não foi feita alteração em `main`, merge ou publicação de produção.

## Inventário verificado no código

O sistema contém dez disciplinas na ordem de navegação, sem disciplina adicional no registro atual. Os módulos ativos vêm dos índices nativos quando eles substituem os catálogos legados; isso explica contagens diferentes entre alguns arquivos.

| Disciplina | Módulos ativos no índice utilizado | Fonte estrutural | Renderização principal | Situação da auditoria visual |
|---|---:|---|---|---|
| Língua Portuguesa | 24 + revisão cumulativa | `ui/current-courses.js`, dados `pt` | cartões nativos `pt-cf-*`; atividades interativas | PENDENTE — referência preservada; inspeção visual por módulo ainda necessária |
| Direito Constitucional | 15 | `ui/cf-native-study-v2.js`, `CF_WEEKS` | cartões nativos `cf-study-*` e leitor CF | PENDENTE — referência preservada; inspeção visual por módulo ainda necessária |
| Direito Administrativo | 20 | `central-structural-v66119/runtime.js`, índice nativo ADM | linhas `topic-item` e leitor ADM | PENDENTE — testar posição de filtros, registros legados e leitores |
| Direito Civil | 15 | catálogo e índice Civil | `civil-module` / leitor Civil | PENDENTE — testar questões, anotações e visualizadores |
| Direito Processual Civil | 20 | catálogo e `cpc-study-*` | módulos CPC e leitores próprios | PENDENTE — confirmar por módulo questões e filtros |
| Direito Penal | 17 | `PENAL_WEEKS`, `ui/current-courses.js` | `cf-module` e leitor Penal | PENDENTE — preservar fixação e treino próprios |
| Direito Processual Penal | 22 | `content/cpp/cpp-native-index.js` | `cpp-mod` / leitor CPP | PENDENTE — catálogo legado tem 16; índice nativo e testes confirmam 22 |
| Raciocínio Lógico-Matemático | 15 + revisão final | `RLM_TJCE_STRUCTURE` | `bc-rlm-module`; M01 tem treino de velocidade | PENDENTE — manter treino M01 e revisar módulo final separadamente |
| Direito do Trabalho | 18 | catálogo de tópicos do runtime | `topic-item` / leitor de Trabalho | PENDENTE — confirmar estrutura, botões e registros por módulo |
| Direito Processual do Trabalho | 21 | `content/ptra/ptra-native-index.js` | renderizador PTRA nativo | PENDENTE — catálogo legado tem 11; índice nativo confirma 21 |

**Total inventariado: 189 unidades de módulo/revisão** (contando as duas revisões cumulativas indicadas). O número é do código-fonte atual, não uma suposição de conteúdo.

## Achados de implementação

1. CF e Português já usam cartões de estudo próprios aprovados e devem ser mantidos como referência.
2. A camada `ui/discipline-standard.js` já consolida parte do cabeçalho, progresso, rodapé, revisão e anotações em vários renderizadores. Nesta branch ela também coloca os cartões completos, resumidos e visuais na ordem aprovada e adiciona uma apresentação vertical comum quando um renderizador nativo tem esses cartões. CF e Português ficam intactos; o treino de velocidade de RLM M01 mantém a ordem original.
3. Os leitores e componentes de imagem são heterogêneos. CF, Civil, ADM e CPP abrem visualizações de imagem/SVG sem controles uniformes de zoom e download; PTRA já tem zoom próprio. Nenhum conteúdo ou imagem foi substituído.
4. A estrutura de filtros e os links públicos TEC/QConcursos estão em catálogo compartilhado. O teste do catálogo foi atualizado para conferir links externos válidos, já que as colunas do catálogo abrem diretamente o filtro e não são controles de seleção.
5. O caminho de visitante de prévia continua restrito ao ambiente Vercel Preview e ao bloqueio de APIs descrito em `docs/PREVIEW_ACCESS.md`.

## Estado por critério

| Critério | Estado | Evidência |
|---|---|---|
| Inventário das disciplinas e contagens | CORRIGIDO / inventariado | Índices nativos e catálogo principal; divergências CPP e PTRA registradas acima |
| Cartões CF/Português como referência | CORRIGIDO / preservado | Não alterados; os renderizadores de referência ficam fora da adaptação comum |
| Cartões dos demais renderizadores nativos | CORRIGIDO PARCIALMENTE | Civil, ADM, PTRA, RLM, CPC e Penal são adaptados por classes do componente; Trabalho e estruturas sem cartões seguem pendentes |
| Questões, gabaritos e histórico | PENDENTE | Nenhuma questão ou armazenamento foi alterado nesta etapa |
| Filtros TEC/QC e links | CORRIGIDO / teste | Teste valida links públicos do catálogo e separação de plataformas |
| Anotações | PENDENTE | Nenhum armazenamento migrado; duplicações devem ser analisadas por módulo |
| Leitores | PENDENTE | A implementação exige testes de abertura, fechamento, busca, fonte e rolagem por renderizador |
| Infográficos | CORRIGIDO PARCIALMENTE | Controles compartilhados de zoom/download implementados para visualizadores de imagem existentes; testes de navegador e auditoria de disponibilidade ainda pendentes |
| Testes automatizados | CORRIGIDO PARCIALMENTE | `npm test`: 91 aprovados; inclui ordem dos cartões, handlers, ADM M01, RLM M01 e regressões de questões. Testes visuais/e2e nas quatro larguras ainda pendentes |
| Produção | PRESERVADA | Branch isolada; sem merge, alias de produção ou publicação |

## Próximas verificações

- Conferir cada módulo aberto em 1440, 1024, 768 e 390 px e registrar os botões, quantidade real de questões, notas, infográfico e filtros.
- Testar navegação e console no deploy Preview com visitante fictício; não usar conta nem dados reais de aluno.
- Adaptar a estrutura apenas onde os controles reais possam ser associados sem duplicar ou apagar handlers e armazenamento.
- Atualizar esta auditoria com APROVADO, CORRIGIDO, PENDENTE ou NÃO APLICÁVEL somente após teste efetivo.

## Verificação real na prévia — checkpoint parcial

- Implantação Preview do commit `01dcb793b7973c8eecc46f7ff4b837a777823197`: READY. A versão de produção não recebeu esse commit.
- Em Direito Administrativo M01, a automação abriu a teoria completa e a versão resumida; o leitor exibiu respectivamente 10 e 5 questões. Nenhuma questão foi respondida.
- O M01 exibiu 4 filtros QConcursos e 4 filtros TEC com links e controles de resultado. Foram removidos visualmente do DOM o filtro TEC legado e o formulário manual antigo; o painel consolidado, histórico armazenado, compartilhamentos válidos e anotações permaneceram.
- O M01 exibiu apenas um card de anotações. A ordem observada ficou materiais → anotações → filtros/compartilhamentos → ferramentas adicionais.
- O infográfico real do M01 abriu integral, com rolagem, zoom, ajuste e botão de download. Não houve substituição de imagem.
- Viewport efetivamente observado: 1363 × 936 px. O console do app não apresentou erros; os únicos erros listados vieram de uma extensão do navegador.
- Não foi possível simular 1440, 1024, 768 e 390 px nesta sessão, nem abrir individualmente as outras 188 unidades. Por isso, a auditoria por módulo segue **PENDENTE** e a branch/PR permanece em rascunho.
