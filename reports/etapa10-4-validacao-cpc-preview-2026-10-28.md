# Etapa 10.4 — validação de Direito Processual Civil na Preview privada

**Data:** 28/10/2026 (UTC)  
**Repositório:** `Diogooliveira-bot/central-de-estudos-2026`  
**Branch isolada:** `preview/legal-complete-premium-v1-20261025`  
**Projeto Vercel:** `base-completa-teste-visual`  
**Commit de partida solicitado:** `f5dc763b6fcd0f995e2a44ff98e0f03ef3d630e9`  
**Produção:** não acessada, não alterada e não publicada.

## Resumo executivo

A validação reproduziu dois defeitos reais e encadeados no carregamento de Direito Processual Civil para o aluno Gratuito:

1. No deployment do commit `f5dc763b`, o HTTP 403 esperado do banco Premium de questões CPC era tratado como falha fatal e impedia a abertura da disciplina.
2. No deployment intermediário `84111d7`, o 403 já era tratado, os 62 scripts de M01–M20 eram corretamente incluídos, mas o carregador aguardava um marcador inexistente, `window.__M08Installed`. O M08 real registra `window.CpcStudyM08 = true`, portanto a tela expirava após 15 segundos com “Registro da disciplina incompleto”.

Foi aplicada somente a correção comprovada do segundo defeito: o predicado de prontidão agora valida M02–M20 pelo mesmo marcador real `CpcStudyMXX`, incluindo M08. O teste de regressão foi ajustado para reproduzir o contrato real.

O SHA corrigido passou a auditoria automatizada de CPC M01–M20 em Chromium: **60/60 cenários** (20 módulos × 390, 768 e 1366 px), incluindo o fluxo pelo menu da plataforma e a verificação aprofundada de M05.

A publicação de um novo deployment privado foi solicitada, porém a Vercel recusou a criação com HTTP 402 porque o projeto ultrapassou o limite de mais de 100 deployments em 24 horas. O workflow privado ficou aguardando o ambiente protegido. Não houve tentativa de contornar o limite e nenhuma ação foi feita em Production.

## Evidência ao vivo na Preview

### Commit inicial `f5dc763b`

Deployment privado inspecionado:

- `dpl_H3XSoKBuzMh1wZrTe5PoAhstRJjn`
- `base-completa-teste-visual-30p9rguhx-estudotd.vercel.app`
- estado Vercel: `READY`
- target: Preview (`target: null`)

Passos executados com a conta sintética Gratuita:

1. login confirmado;
2. menu **Disciplinas**;
3. cartão **Direito Processual Civil**;
4. carregamento da disciplina.

Resultado reproduzido:

```text
[Central discipline load] cpc Error:
HTTP 403: /content/cpc/cpc-fixation-questions-v1.js
```

O endpoint de plano confirmou `plan: free` e ausência de direito a `theory.complete`. O 403 era esperado para o arquivo Premium, mas bloqueava indevidamente o conteúdo resumido.

### Deployment intermediário `84111d7`

Deployment privado inspecionado:

- `dpl_4VvG9FvYJHKmEVepP6teJspdfyLD`
- `base-completa-teste-visual-4d5y5lrms-estudotd.vercel.app`
- estado Vercel: `READY`
- target: Preview (`target: null`)

No mesmo percurso real pelo menu, o manifesto injetado continha **62 scripts CPC**, com dados, leitores e controladores de M01–M20. O 403 Premium deixou de ser fatal, mas o carregamento terminou com:

```text
[Central discipline load] cpc Error: Registro da disciplina incompleto
```

A inspeção do código comprovou:

- o carregador exigia `window.__M08Installed`;
- a busca no repositório não encontrou definição desse identificador;
- `cpc-study-m08-lite.js` registra `window.CpcStudyM08 = true`;
- os demais módulos usam `window.CpcStudyMXX = true` ou `{ installed: true }`.

## Correção aplicada

### Produto

Commit `a12ae34dbb8668e831a625c58a5dbaf9b852cb3c`:

- arquivo: `central-discipline-loader.js`;
- remoção do marcador inexistente `__M08Installed`;
- inclusão de M08 no mesmo laço que valida os marcadores reais M02–M20;
- nenhuma alteração de conteúdo, entitlement, login, banco, pagamento ou Production.

### Regressão

Commit `463500d02a62364f54ff4a359bd7955b12074ae6`:

- arquivo: `tests/etapa10-4-cpc-portal-load-unit.mjs`;
- fixture atualizada para `CpcStudyM08: true`;
- asserção explícita de que o carregador não volta a depender de `__M08Installed`.

### Pin da Preview privada

Commit `2ac450bd6c14d464d1ed43364ddca02f5e56462e`:

- atualiza somente o SHA aprovado no workflow privado;
- mantém projeto, branch e ambiente isolados;
- o comando continua sendo `vercel deploy --yes`, sem `--prod`;
- o workflow permanece com checagens explícitas do projeto temporário e bloqueio de Production.

## Resultado automatizado

Workflow principal aprovado:

- [Auditoria editorial CPC M01–M20 — Chromium, run 40769365242](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40769365242)
- conclusão: `success`
- SHA: `463500d02a62364f54ff4a359bd7955b12074ae6`
- artefato: `etapa10-auditoria-editorial-cpc`
- artifact ID: `12852001497`
- digest: `sha256:550b7c7d93ef50ef46fb25ff7a811bd043ecf5b809b0c2a84646bb8ddba184e7`

Outras verificações da cabeça da branch:

- [Validar visual ADM M03 — Preview privada, run 40769690266](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40769690266): `success`
- [Verificar Etapa 3.0 — Penal e CPC M01, run 40769690348](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40769690348): `success`

### M01–M20

Foram executados **60 cenários**:

| Cobertura | Resultado |
|---|---:|
| Módulos | M01–M20 |
| Viewports | 390, 768 e 1366 px |
| Cenários | 60 |
| Falhas de leitor | 0 |
| Overflow horizontal de artigo | 0 |
| Overflow de página | 0 |
| Tabelas verificadas | 60 |
| Leitores identificados corretamente | 60 |

Todos os módulos tiveram título, leitor, índice, checks de capítulo, tabela e responsividade validados. M01–M08 também passaram pela comparação editorial detalhada; as diferenças apontadas pelo auditor foram classificadas como metadado, rótulo ou conteúdo presente reformatado, sem perda material acusada pelo teste.

### M05 — validação aprofundada

**Litisconsórcio e intervenção de terceiros**:

- 34.849 caracteres na fonte;
- 34.507 caracteres legíveis;
- 455 linhas de origem;
- 70 títulos;
- 30 itens no índice;
- 15 controles de capítulo;
- tabela 4 × 3 com legenda, cabeçalhos, escopos e wrapper responsivo;
- sem overflow em 390, 768 e 1366 px;
- sem erro de leitor;
- divisores **PARTE IV — PEGADINHAS FCC** e **PARTE VIII — ROTEIRO DE REVISÃO** presentes;
- 14 títulos de questões destacados e a Questão 2 identificada;
- marcação de capítulo preservada após fechar e reabrir o leitor nos três viewports.

### Entrada pela Central

O teste integrado percorreu:

1. bootstrap autenticado simulado;
2. menu **Disciplinas**;
3. cartão **Direito Processual Civil**;
4. carregamento completo;
5. abertura de M05;
6. marcação de capítulo;
7. fechamento e reabertura de M05.

O teste passou em 390, 768 e 1366 px.

## Gratuito e Premium

O artefato `etapa10-4-cpc-home-flow/results.json` registrou:

| Plano | Central pronta | CPC pronto | Erro CPC | Resultado |
|---|---:|---:|---:|---|
| Premium | sim | sim | não | aprovado |
| Gratuito | sim | sim | não | aprovado |

Para o Gratuito, o teste confirmou que o HTTP 403 de `/content/cpc/cpc-fixation-questions-v1.js` é esperado e não derruba a disciplina. O conteúdo completo e as questões Premium continuam protegidos; a teoria resumida permanece disponível.

Foi observado também um erro legado de JSON em `central-structural-v66119/civil-course-006-final.js`. Ele não foi causado pela correção CPC, não impediu os cenários CPC e não foi alterado, para respeitar o escopo e a regra de corrigir apenas o problema comprovado pertinente.

## Persistência do progresso

### Comprovado

- persistência local da marcação de capítulo de M05 ao fechar e reabrir o leitor;
- resultado positivo nos três viewports;
- chaves de progresso permanecem associadas ao fixture do usuário de teste e são descartadas ao final do contexto de teste.

### Ainda não comprovado ao vivo

A persistência remota autenticada após recarga/relogin no Neon da Preview **não pôde ser encerrada** porque o SHA corrigido não recebeu um novo deployment Vercel. O deployment anterior continua bloqueado pelo marcador incorreto. Nenhuma conclusão de persistência remota é inferida a partir do teste local.

## Bloqueio operacional da Vercel

A tentativa de criar o deployment privado do SHA `463500d` retornou:

```text
HTTP 402 payment_required
api-deployments-free-per-day
Resource is limited — more than 100 deployments in 24 hours
retryAfter: 86400
```

Workflow preparado:

- [Deploy privado — prévia visual jurídica, run 40769690383](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40769690383)
- estado no fechamento deste relatório: `waiting`
- ambiente: `bc-preview-private`
- SHA que o workflow fará checkout: `463500d02a62364f54ff4a359bd7955b12074ae6`

Não foi removida nenhuma proteção de ambiente e não foi tentado outro projeto ou target.

## Matriz final

| Item | Estado | Evidência |
|---|---|---|
| Preview inicial `f5dc763b` inspecionada | concluído | Vercel READY + navegador autenticado |
| Navegação pelo menu até CPC | concluído | reprodução ao vivo + Chromium integrado |
| Defeito do 403 Gratuito | comprovado | console e resposta HTTP ao vivo |
| Defeito do marcador M08 | comprovado | loader + controlador M08 + timeout ao vivo |
| Correção mínima | concluído | commits `a12ae34` e `463500d` |
| M01–M20 | aprovado em CI real Chromium | 60/60 cenários |
| M05 aprofundado | aprovado em CI real Chromium | conteúdo, estrutura, tabela, questões e progresso local |
| Bloqueios Gratuito | aprovado em CI; evidência parcial ao vivo | entitlement livre + 403 esperado |
| Premium | aprovado em CI; API da Preview já confirmada | conteúdo completo não exposto ao Gratuito |
| Persistência local | aprovada | fechar/reabrir leitor em 3 viewports |
| Persistência remota após reload/relogin | pendente | depende de novo deployment do SHA corrigido |
| Novo deployment privado | bloqueado | limite Vercel de 100/24h |
| Production | preservada | nenhum deploy, alias, promoção ou alteração |

## Próxima ação segura

Após a janela de 24 horas da Vercel e a aprovação normal do ambiente privado:

1. executar o workflow `Deploy privado — prévia visual jurídica`;
2. confirmar que o deployment é Preview (`target: null`);
3. repetir o login Gratuito e Premium no deployment novo;
4. abrir CPC pelo menu;
5. abrir M01–M20 e aprofundar M05;
6. no Premium, marcar um capítulo de M05, recarregar e relogar;
7. confirmar a mesma marcação restaurada;
8. anexar o resultado ao relatório;
9. não promover, não atribuir alias de Production e não usar `--prod`.

