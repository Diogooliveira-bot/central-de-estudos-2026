# Base Completa — Etapa 10.4.3 | Contas autenticadas e matriz de planos

**Data:** 28/10/2026. **Projeto de teste:** Vercel `base-completa-teste-visual`, deployment `dpl_H3XSoKBuzMh1wZrTe5PoAhstRJjn`, código-fonte aprovado `f5dc763b6fcd0f995e2a44ff98e0f03ef3d630e9`. Banco Neon **`shiny-hall-19564809`**.

## Verificações comprovadas

- O proprietário informou ter criado as duas senhas e salvo dois perfis de navegador independentes.
- Consulta **somente leitura** ao Neon confirmou usuários sintéticos ativos, sem bloqueios e com registros de login da aplicação no dia 28/10/2026. Premium último login: **10:28:32 UTC**. Gratuito: **10:30:25 UTC**. Estes são registros históricos do banco; isoladamente não provam que a sessão atual do navegador continua válida.
- As contas têm assinatura `active` e permissão prevista:

| Recurso | Gratuito | Premium |
|---|---|---|
| Teoria resumida | Habilitado | Habilitado |
| Teoria completa | Bloqueado por entitlement | Habilitado |
| Links TEC | Bloqueado por entitlement | Habilitado |
| Links QConcursos | Bloqueado por entitlement | Habilitado |

- Nenhuma consulta alterou senha, plano, progressos, pagamentos ou contas.
- A Preview publicada, seu banco isolado e os testes do Chromium da Etapa 10.4.1 permanecem aprovados.

## Limitações e ensaios não certificados

Foram submetidas duas execuções de browser com os perfis persistidos, uma para Gratuito e outra para Premium, com instrução para comprovar sessão, plano, navegação e progresso, **sem inserir senhas**. No último retorno disponível, as execuções **estavam `pending` (passo 0, sem resultado observável)**:

- Gratuito: execução `adcac97b-feac-4065-8acb-d7bfe1d659cd`.
- Premium: execução `926eefdb-5fab-499b-a5f7-7af025d33f43`.

O perfil de navegador registrou autenticação em Google, mas a leitura do banco indica que as contas da Base também fizeram login. **Não tratar isso como prova da persistência de cookie no navegador.**

**Ainda falta aferir por sessão real** a resposta HTTP de bloqueio de `/content/cpc/mXX-native-data.js` para Gratuito, o acesso Premium ao M01–M20 na Preview, as tabelas e a persistência da marcação de leitura. A auditoria local de 60/60 cenários e os 40/40 testes de autenticação e autorização de código já foram aprovados em etapa anterior, mas não substituem E2E autenticado no deployment.

**Conclusão:** perfis de teste existentes, contas com histórico de login e permissões do banco corretas. **Etapa 10.4 não pode ser marcada como homologada integralmente.** Não houve modificação em Production, `main`, banco real ou qualquer configuração de segurança.

## Resultado definitivo das duas sessões de navegador

Após a criação deste relatório, **ambas as execuções passaram de `pending` para `completed`**, e produziram evidências reais da aplicação, pelo navegador com perfis separados.

### Gratuito — execução `adcac97b-feac-4065-8acb-d7bfe1d659cd`

- `GET /api/auth?action=me`: **`authenticated:true`**, papel **`aluno`**, conta sintética correta.
- `GET /api/plans?action=me`: **`plan:free`, `status:active`**, `theory.summary=true`, `theory.complete=false`, `tec.links=false`, `qc.links=false`, `lei_em_dia.dailyLimit=20`.
- **Observação de UI:** a navegação de `/central-v119.html` apresentou tela de falha de carregamento ao navegador de testes. **Não foram observadas apostilas resumidas, nem testadas as marcações**.
- **Importante:** as respostas de entitlement provam a política server-side; **não comprovam isoladamente que a UI bloqueou um clique ou que um arquivo retornou HTTP 403**.

### Premium — execução `926eefdb-5fab-499b-a5f7-7af025d33f43`

- `GET /api/auth?action=me`: **`authenticated:true`**, papel **`aluno`**, conta sintética correta.
- `GET /api/plans?action=me`: **`plan:premium`, `status:active`**, `theory.complete=true`, `theory.summary=true`, `tec.links=true`, `qc.links=true`, `premium.reviews=true`, `progress.advanced_sync=true`.
- O dashboard foi aberto e mostrou **Direito Processual Civil (20 módulos)**, mas a automação **não conseguiu chegar à apostila M05**, de modo que seções, tabelas, questões e progresso continuam sem teste E2E.
- A automação interpretou o endereço `/central-v119.html` mudando para `/` como um redirecionamento suspeito. **Revisão do código confirmou que isso é o comportamento intencional da inicialização**: o bootstrap obtém `index.html`, executa `history.replaceState(..., '/')` e reconstitui a aplicação. **Não abrir incidente por esse comportamento isoladamente.**
- Rotas exploratórias `/central`, `/#/cpc` e similares não fazem parte do contrato de navegação; seus 404 não demonstram falha do leitor. O caminho correto de UI utiliza **Disciplinas → Direito Processual Civil**, via `centralHardSubject('cpc')` e `jumpSubject('cpc')` dentro da Central.
- A persistência de leitura **não foi testada** porque o leitor não foi aberto.

### Esclarecimento do contrato de entrega gratuita

O `lib/private-content-handler.js` implementa para `/content/cpc/mXX-native-data.js` uma **projeção somente de resumo para o plano Gratuito** (em geral resposta **HTTP 200 com JavaScript expurgado de conteúdo completo**), e não necessariamente 403. **Requisitar 403 para todos esses arquivos seria um teste incorreto**; o critério seguro é que o texto Premium completo não seja entregue. Para arquivos TEC/QC o acesso gratuito deve ficar negado.

### Estado de aceite

- **Homologados efetivamente:** autenticação real de aluno Gratuito e Premium, plano/estado e direitos reportados pelas APIs do deployment publicado.
- **Não homologados:** comportamento do frontend do curso em ambos os planos, bloqueio HTTP efetivo/expurgo de todos os arquivos, CPC M01–M20 aberto no deployment, tabelas e persistência de progresso.
- **Evidência de falha a investigar:** erro de carregamento observado na UI Gratuita; não afirmar causa ou abrangência sem reprodução e logs do navegador.
- Os 60/60 testes Chromium local e a suíte de regras de planos permanecem aprovados, mas têm escopo distinto dos testes autenticados.

**Próxima ação técnica:** retomar E2E pelo fluxo de interface documentado, reproduzir erro da Central no perfil Gratuito e coletar console/rede para identificar eventual correção. Caso se confirme defeito, encaminhar à Etapa 10.5 sob a mesma branch privada, sem promoção à Production.

Nenhuma alteração foi feita em `main`, banco de produção, usuários reais, conteúdo jurídico ou controle de pagamento.

## Resultado posterior — navegador autenticado (28/10/2026)

**As duas execuções finalizaram** após a primeira atualização deste relatório. A leitura definitiva substitui o estado anterior `pending`:

- **Gratuito** — [execução adcac97b](https://agent.tinyfish.ai/runs/adcac97b-feac-4065-8acb-d7bfe1d659cd), `completed`, 22 passos. O navegador acessou `/api/auth?action=me` e comprovou `authenticated:true` como aluno fictício; `/api/plans?action=me` retornou plano `free` ativo, `theory.summary=true`, `theory.complete=false`, `tec.links=false`, `qc.links=false` e `lei_em_dia` com limite de 20 por dia. A tentativa de abrir a Central encontrou uma mensagem de erro de carregamento, sem visualização de módulo. **Não houve verificação de resposta HTTP 403 do endpoint de conteúdo completo**, apenas confirmação de entitlement na API.
- **Premium** — [execução 926eefdb](https://agent.tinyfish.ai/runs/926eefdb-5fab-499b-a5f7-7af025d33f43), `completed`, 60 passos. Confirmado `authenticated:true` e plano `premium` ativo por API, com `theory.complete` e demais recursos habilitados. A ferramenta viu o painel inicial, mas **não abriu a disciplina CPC nem o leitor M05**, e não encontrou um botão de progresso. **Nenhuma marcação foi realizada ou testada.**
- **Interpretação técnica corrigida:** o bootstrap de `central-v119.html` chama `history.replaceState(..., '/')` depois de carregar e reconstruir `index.html`; por isso, trocar a URL para `/` **é comportamento intencional**, não prova de defeito. A interface contém uma aba **Disciplinas** e um botão de **Direito Processual Civil** que chama `centralHardSubject('cpc')`. As tentativas de descobrir rotas independentes `/#/cpc` ou `/central` não refletem a navegação suportada.
- **Conclusão técnica:** autenticação real **aprovada para os dois planos**; permissões **aprovadas na API**; navegação CPC, autorização HTTP de conteúdo e persistência de leitura **ainda pendentes**. A falha de navegação pela automação não foi reproduzida nem diagnosticada com segurança como bug do site. O caso Gratuito teve mensagem de erro de carregamento e merece reprodução manual com registro de console/rede.

**Próximo ensaio dirigido:** usar a UI no endereço `/`, clicar `Disciplinas → Direito Processual Civil → M05 → Apostila completa` na sessão Premium; reabrir após marcar progresso em conta de teste. Na conta Gratuita, abrir a mesma disciplina, conferir resumo e verificar resposta 403 ao arquivo CPC completo sem alterar o plano. Se o erro de carregamento se reproduzir, capturar URL e console em Preview para correção isolada. **Não publicar em Production** antes de concluir esses testes.


## Fechamento das duas execuções de navegador (resultado posteriormente recebido)

As duas execuções terminaram em `completed`, sem erro da ferramenta, mas **o roteiro de homologação do leitor CPC não foi completado**:

- **Gratuito:** [execução adcac97b](https://agent.tinyfish.ai/runs/adcac97b-feac-4065-8acb-d7bfe1d659cd). A API `/api/auth?action=me` retornou `authenticated:true` para o aluno fictício. A API `/api/plans?action=me` confirmou `free/active`, `theory.complete=false`, `tec.links=false`, `qc.links=false`, e `lei_em_dia` habilitado com limite diário de 20. A tentativa de carregar a Central terminou com mensagem de falha de carregamento e não permitiu verificar um módulo CPC na interface.
- **Premium:** [execução 926eefdb](https://agent.tinyfish.ai/runs/926eefdb-5fab-499b-a5f7-7af025d33f43). A API `/api/auth?action=me` retornou `authenticated:true`; `/api/plans?action=me` confirmou `premium/active` com `theory.complete=true`, `tec.links=true` e `qc.links=true`. O agente alcançou o dashboard, visualizou a disciplina **Direito Processual Civil com 20 módulos**, porém não conseguiu abrir um leitor M05/M01–M20; não aferiu marcação de leitura nem persistência.
- **Ressalva diagnóstica:** o agente Premium tratou a mudança da URL `/central-v119.html` para `/` como redirecionamento defeituoso. A inspeção do próprio `central-v119.html` revelou a instrução **intencional** `history.replaceState(..., '/')` no carregador, portanto **essa mudança de endereço não prova defeito**. Tentativas de rotas hash improvisadas não são evidência de erro na navegação normal via cartão/disciplinas.
- **Conclusão técnica:** autenticação e entitlements foram confirmados **também por HTTP autenticado**, não só por consultas ao banco; ainda falta comprovação visual e HTTP da **entrega de apostila completa no Premium**, **negação de acesso ao arquivo completo no Gratuito**, e **persistência real**. Não declarar Etapa 10.4 totalmente aprovada; investigar carregamento inicial e executar a navegação pelos controles reais da interface, sem deduzir rotas.
- Os dados de autenticação, senhas e cookies não foram registrados neste documento. Nenhuma alteração foi feita em produção.

## Encerramento dos dois testes de navegador — 28/10/2026

As duas execuções previamente registradas como `pending` **terminaram com status `completed`**.

**Gratuito**, run `adcac97b-feac-4065-8acb-d7bfe1d659cd` (22 passos): `/api/auth?action=me` confirmou `authenticated:true`, aluno fictício. `/api/plans?action=me` confirmou `free/active`, `theory.summary=true`, `theory.complete=false`, `tec.links=false`, `qc.links=false`, `lei_em_dia` habilitado com limite diário de 20. O agente relatou falha genérica ao carregar `central-v119.html`; não distinguiu falha persistente da aplicação de limitação da automação. Não abriu módulo CPC nem comprovou HTTP 403 do conteúdo completo.

**Premium**, run `926eefdb-5fab-499b-a5f7-7af025d33f43` (60 passos): `/api/auth?action=me` confirmou `authenticated:true`; `/api/plans?action=me` confirmou `premium/active` e `theory.complete=true`. O agente viu o dashboard e **Direito Processual Civil (20 módulos)**, mas não navegou ao M05 pelas opções reais da interface e não encontrou apostilas. Tentou URLs inventadas (`/#/central`, `/#/cpc`, `/central`), que retornaram 404. **Esses caminhos não são rotas oficiais verificadas.**

**Correção de diagnóstico:** no código `central-v119.html`, a instrução `history.replaceState(null,'',appPath+entryUrl.search+entryUrl.hash)` deliberadamente substitui a URL por `/` (exceto `/central-de-questoes`) antes de gravar a interface principal via `document.open();document.write(html);document.close()`. A troca de URL para `/` **não comprova erro de navegação**, portanto não deve fundamentar alteração do roteador sem teste adicional.

**Resultado verificado:** ✅ autenticação real das duas contas fictícias e seus planos; ✅ matriz de direitos em resposta real da API; ⚠️ bloqueio HTTP 403 de arquivos CPC no Gratuito ainda não comprovado; ⚠️ leitor Premium M01–M20 e M05 não aberto; ⚠️ persistência do progresso não testada; ⚠️ falha de carregamento no Gratuito não diagnosticada. **Etapa 10.4 permanece parcialmente aprovada, não encerrada.**

**Próximo ensaio:** usar a navegação real **Disciplinas → Direito Processual Civil → M05**, comparar resposta HTTP do ativo pago, abrir/fechar leitor Premium e testar marcação/persistência. Evitar recriar contas. Sessões têm TTL de 2 horas; se expiradas, autenticar novamente com as mesmas senhas.

## Atualização — resultados finais dos testes autenticados no navegador (28/10/2026)

As duas execuções que constavam pendentes **foram concluídas**, com evidência de API autenticada. Links para inspeção técnica privada:

- [Teste Gratuito — execução adcac97b](https://agent.tinyfish.ai/runs/adcac97b-feac-4065-8acb-d7bfe1d659cd): resposta `authenticated:true`, `role:aluno`, plano `free`, status `active`. A resposta de `/api/plans?action=me` confirmou `theory.summary:enabled`, `theory.complete:false`, `qc.links:false`, `tec.links:false` e `lei_em_dia` limite de **20 por dia**. O navegador exibiu "Não foi possível concluir o carregamento" ao tentar abrir a interface da Central; o módulo CPC não foi visualizado. Não se verificou o HTTP status direto dos materiais Premium nessa sessão.
- [Teste Premium — execução 926eefdb](https://agent.tinyfish.ai/runs/926eefdb-5fab-499b-a5f7-7af025d33f43): resposta `authenticated:true`, `role:aluno`, `plan:premium`, `status:active`, e permissões de teoria completa e links QC/TEC ativas. A interface principal listou **Direito Processual Civil — 20 módulos**, mas o agente não conseguiu abrir uma apostila. Tentativas de navegar para rotas imaginadas `/#/cpc` e `/central` terminaram em 404; sem evidência de progresso ou visual da M05.

### Diagnóstico de navegação

A leitura de `central-v119.html` e `vercel.json` no commit implantado mostrou que a SPA usa `/central-v119.html` como *bootstrap* e, após carregar a página `/index.html?central_source=...`, executa `history.replaceState(..., '/')` para manter a Central na raiz. Portanto, **o redirecionamento para `/` é previsto**, e rotas `/#/cpc` não são o percurso correto. Existe um botão de disciplina `Direito Processual Civil` com ação `centralHardSubject('cpc')`. A falta de navegação adequada no teste Premium **não demonstra que o conteúdo falha para o aluno**.

### Resultado atualizado, sem extrapolação

**Aprovado:** autenticação real de ambas as contas, identificação do plano, matriz de direitos retornada pela API, implantação Preview READY no commit aprovado e testes unitários/Chromium local previamente confirmados.

**Pendente:** abrir o CPC por clique de disciplina, testar a entrega HTTP autenticada/negada de arquivos completos (não confundir entitlements com execução efetiva do bloqueio), conferir M01–M20 e M05, validar leitura e persistência. A falha de carregamento apontada no Gratuito necessita diagnóstico adicional.

O navegador externo que fez os testes não dispõe mais de saldo para novas ações no mesmo serviço; não iniciar cargas repetidas sem autorização para eventual custo. Uma alternativa é usar **ChatGPT Work**, que o proprietário deve iniciar na interface, para navegar no Preview protegido com os dois perfis de homologação já configurados, sem mudar Production ou `main`.

**Etapa 10.4: autenticação e regras de plano confirmadas; validação funcional do leitor e do progresso NÃO concluída.**
