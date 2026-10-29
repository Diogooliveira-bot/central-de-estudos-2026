# Etapa 10.4 — validação de Direito Processual Civil na Preview privada

**Data:** 28–29/10/2026 (UTC)  
**Repositório:** `Diogooliveira-bot/central-de-estudos-2026`  
**Branch isolada:** `preview/legal-complete-premium-v1-20261025`  
**Projeto Vercel:** `base-completa-teste-visual`  
**Commit de partida solicitado:** `f5dc763b6fcd0f995e2a44ff98e0f03ef3d630e9`  
**SHA validado:** `463500d02a62364f54ff4a359bd7955b12074ae6`  
**Produção:** não acessada, não alterada e não publicada.

## Resultado executivo

A Etapa 10.4 foi concluída na Preview privada.

Dois defeitos reais e encadeados foram reproduzidos a partir do commit solicitado:

1. no deployment de `f5dc763b`, o HTTP 403 esperado do banco Premium de questões CPC era tratado como falha fatal para o aluno Gratuito;
2. no deployment intermediário `84111d7`, o 403 já não era fatal, mas o carregador aguardava o marcador inexistente `window.__M08Installed`; o M08 real registra `window.CpcStudyM08 = true`.

Foi aplicada somente a correção comprovada do contrato de prontidão do M08, com teste de regressão. O SHA corrigido passou **60/60 cenários Chromium** para M01–M20, em 390, 768 e 1366 px.

Depois da liberação da cota Vercel, foi criado e inspecionado um novo deployment privado:

- deployment: `dpl_4wScDvpKUMCtYi1W75ZRoqXjEdtM`;
- URL: `https://base-completa-teste-visual-g60lrn1a5-estudotd.vercel.app`;
- SHA: `463500d02a62364f54ff4a359bd7955b12074ae6`;
- estado: `READY`;
- target: Preview (`target: null`);
- projeto: `base-completa-teste-visual`;
- nenhuma promoção, alias ou publicação em Production.

Na Preview corrigida, os perfis sintéticos Gratuito e Premium foram validados ao vivo. O Gratuito recebeu apenas teoria resumida e bloqueio correto do conteúdo completo; o Premium abriu as apostilas completas. A persistência foi comprovada após recarga no Gratuito e após recarga, logout e novo login no Premium.

Nenhum novo defeito de produto foi encontrado no SHA corrigido. Portanto, não houve correção adicional.

## Ambiente isolado

A Preview usa banco Neon de teste isolado:

- projeto Neon: `shiny-hall-19564809`;
- variáveis configuradas somente no ambiente Preview;
- `HOTMART_LIVE_ENABLED=false`;
- `HOTMART_TEST_RECEIVER_ENABLED=false`;
- `EXAM_PROGRESS_PREVIEW_DB_ISOLATED=true`;
- contas Gratuito e Premium distintas, criadas para teste;
- nenhum segredo, e-mail ou senha foi registrado neste relatório.

A inspeção foi somente leitura no banco. Produção não foi consultada nem modificada.

## Reprodução dos defeitos

### Commit inicial `f5dc763b`

Deployment privado inspecionado:

- `dpl_H3XSoKBuzMh1wZrTe5PoAhstRJjn`;
- `base-completa-teste-visual-30p9rguhx-estudotd.vercel.app`;
- estado: `READY`;
- target: Preview.

Percurso real com a conta Gratuita:

1. login;
2. menu **Disciplinas**;
3. cartão **Direito Processual Civil**;
4. carregamento da disciplina.

Resultado:

```text
[Central discipline load] cpc Error:
HTTP 403: /content/cpc/cpc-fixation-questions-v1.js
```

O plano era `free`, sem direito a `theory.complete`. O 403 era esperado para o recurso Premium, mas derrubava indevidamente a teoria resumida.

### Deployment intermediário `84111d7`

Deployment privado inspecionado:

- `dpl_4VvG9FvYJHKmEVepP6teJspdfyLD`;
- `base-completa-teste-visual-4d5y5lrms-estudotd.vercel.app`;
- estado: `READY`;
- target: Preview.

O manifesto incluiu 62 scripts CPC, com dados, leitores e controladores de M01–M20. O 403 Premium deixou de ser fatal, mas o carregamento terminou com:

```text
[Central discipline load] cpc Error: Registro da disciplina incompleto
```

Causa comprovada:

- o carregador exigia `window.__M08Installed`;
- não havia definição desse identificador no repositório;
- `cpc-study-m08-lite.js` registra `window.CpcStudyM08 = true`;
- M02–M20 usam o contrato `window.CpcStudyMXX = true` ou `{ installed: true }`.

## Correção mínima

### Produto

Commit `a12ae34dbb8668e831a625c58a5dbaf9b852cb3c`:

- arquivo: `central-discipline-loader.js`;
- remove a dependência do marcador inexistente `__M08Installed`;
- inclui M08 no mesmo laço de prontidão real usado por M02–M20;
- não altera conteúdo, entitlement, login, banco, pagamento ou Production.

### Regressão

Commit `463500d02a62364f54ff4a359bd7955b12074ae6`:

- arquivo: `tests/etapa10-4-cpc-portal-load-unit.mjs`;
- fixture com `CpcStudyM08: true`;
- asserção explícita para impedir nova dependência de `__M08Installed`.

### Workflow privado

Commit `2ac450bd6c14d464d1ed43364ddca02f5e56462e`:

- fixa o SHA aprovado no workflow privado;
- mantém projeto, branch e ambiente isolados;
- usa `vercel deploy --yes`, sem `--prod`;
- preserva as checagens que impedem Production.

## Cobertura M01–M20

Workflow aprovado:

- [Auditoria editorial CPC M01–M20 — Chromium, run 40769365242](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40769365242);
- conclusão: `success`;
- SHA: `463500d02a62364f54ff4a359bd7955b12074ae6`;
- artefato: `etapa10-auditoria-editorial-cpc`;
- artifact ID: `12852001497`;
- digest: `sha256:550b7c7d93ef50ef46fb25ff7a811bd043ecf5b809b0c2a84646bb8ddba184e7`.

| Cobertura | Resultado |
|---|---:|
| Módulos | M01–M20 |
| Viewports | 390, 768 e 1366 px |
| Cenários | 60 |
| Cenários aprovados | 60 |
| Falhas de leitor | 0 |
| Overflow horizontal de artigo | 0 |
| Overflow de página | 0 |
| Tabelas verificadas | 60 |
| Leitores identificados corretamente | 60 |

Em navegador autenticado ao vivo, a disciplina exibiu os 20 módulos e carregou M20 sem erro. As pontas também foram abertas com conta Premium:

- M01 completo: **CPC M01 — Normas fundamentais, fontes, aplicação e direito intertemporal**, 5.932 palavras, 12 capítulos, sem bloqueio;
- M20 completo: **CPC M20 — Processos nos tribunais, ação rescisória, IAC, IRDR e reclamação**, 2.267 palavras, 60 blocos, sem bloqueio.

A combinação de grade ao vivo, abertura das pontas e matriz Chromium cobre M01–M20 sem afirmar que cada um dos 20 leitores foi aberto manualmente na mesma sessão.

## M05 — validação aprofundada

### Automação

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
- 14 títulos de questões destacados;
- marcação de capítulo preservada após fechar e reabrir o leitor.

### Preview ao vivo — Premium

O leitor completo abriu com:

- título: **CPC M05 — Litisconsórcio e intervenção de terceiros**;
- rótulo: **Conteúdo completo • leitura incorporada à Base Completa**;
- 5.162 palavras;
- leitura estimada de 25 min;
- 15 capítulos;
- conteúdo jurídico integral, tabelas e seções de revisão;
- ausência de mensagem de bloqueio.

Um capítulo foi marcado, produzindo `1 / 15 capítulos`.

Persistência comprovada:

1. fechamento do leitor;
2. recarga completa da Central;
3. reabertura de Direito Processual Civil;
4. M05 restaurado com `1/15 capítulos`;
5. logout;
6. novo login no mesmo perfil Premium;
7. confirmação de plano Premium ativo;
8. reabertura de CPC;
9. M05 novamente restaurado com `1/15 capítulos`.

Isso comprova persistência entre sessões autenticadas na Preview isolada.

## Perfil Gratuito

O endpoint `/api/plans?action=me` confirmou:

| Direito | Resultado |
|---|---|
| `theory.summary` | habilitado |
| `theory.complete` | bloqueado |
| links/filtros TEC e QConcursos | bloqueados |
| `premium.reviews` | bloqueado |
| `progress.advanced_sync` | bloqueado |

Percurso realizado pelo menu da plataforma: **Disciplinas → Direito Processual Civil**.

A grade M01–M20 abriu sem erro do loader. Leitores resumidos verificados ao vivo:

| Módulo | Título | Palavras | Estimativa |
|---|---|---:|---:|
| M01 | Normas fundamentais, fontes, aplicação e direito intertemporal | 1.834 | 9 min |
| M02 | Jurisdição, ação, processo, pressupostos e mérito | 1.612 | 8 min |
| M03 | Competência, conexão, continência e conflitos | 1.292 | 6 min |
| M05 | Litisconsórcio e intervenção de terceiros | 1.695 | 8 min |

O acesso ao leitor completo foi tentado em M01 e M05. Em ambos, a UI exibiu somente:

```text
Este recurso é exclusivo do Base Completa Premium.
A teoria resumida continua disponível neste módulo.
```

Não houve exposição do conteúdo completo.

Persistência Gratuita:

1. a etapa **Leitura orientada inicial** do M05 foi marcada;
2. a UI passou a 33%, 1/3;
3. a página foi recarregada;
4. CPC foi reaberto pelo menu;
5. M05 permaneceu em **Progresso da teoria 33% concluído**, `1/3`, com **Leitura concluída**.

Como `progress.advanced_sync` é bloqueado no Gratuito, essa evidência demonstra a persistência local prevista para o plano.

## Perfil Premium

O endpoint `/api/plans?action=me` confirmou plano `premium` ativo e:

- `theory.summary=true`;
- `theory.complete=true`;
- `vade_mecum=true`;
- `lei_em_dia=true`;
- links e filtros TEC/QConcursos habilitados;
- `premium.reviews=true`;
- `progress.advanced_sync=true`;
- marcações e sincronização de edital habilitadas.

Os direitos foram novamente confirmados depois de logout e novo login, antes da verificação final do M05.

## Observação fora do escopo

Foi observado um erro legado de JSON em:

`central-structural-v66119/civil-course-006-final.js`

Ele pertence a Direito Civil, não foi causado pela correção CPC, não impediu os cenários de Direito Processual Civil e não foi alterado. Isso preserva a regra de corrigir somente problemas comprovados e pertinentes ao escopo.

## Matriz final

| Item | Estado | Evidência |
|---|---|---|
| Preview inicial `f5dc763b` | reproduzida | 403 Gratuito fatal |
| Defeito do marcador M08 | reproduzido | timeout e contrato real do controlador |
| Correção mínima | concluída | `a12ae34` + `463500d` |
| Novo deployment privado | READY | `dpl_4wScDvpKUMCtYi1W75ZRoqXjEdtM` |
| Target | Preview | `target: null` |
| M01–M20 | aprovado | 60/60 Chromium + grade ao vivo |
| M05 completo Premium | aprovado | 5.162 palavras, 15 capítulos |
| Bloqueios Gratuito | aprovado | resumo liberado; completo bloqueado |
| Persistência Gratuito | aprovada | 33% após reload |
| Persistência Premium local | aprovada | 1/15 após reload |
| Persistência Premium remota | aprovada | 1/15 após logout/relogin |
| Novo problema no SHA corrigido | nenhum | nenhuma correção adicional |
| Production | preservada | nenhum deploy, promoção ou alias |

## Conclusão

A Etapa 10.4 está concluída na Preview privada. O carregador de Direito Processual Civil abre M01–M20, os direitos Gratuito/Premium estão respeitados, M05 funciona em profundidade e o progresso persiste conforme cada plano.

Nenhuma ação de Production foi executada. A Preview permanece isolada e não deve ser promovida automaticamente.
