# Base Completa — CPC | Etapa 10.4.4 — Diagnóstico de testes autenticados e regressão de carregamento

**Data:** 28/10/2026  
**Projeto GitHub:** `Diogooliveira-bot/central-de-estudos-2026`  
**Branch isolada:** `preview/legal-complete-premium-v1-20261025`  
**Produção:** **nenhuma modificação**.

## Referência da prévia realmente publicada

- Projeto Vercel de teste: `base-completa-teste-visual`.
- Deployment: `dpl_H3XSoKBuzMh1wZrTe5PoAhstRJjn`, READY, SHA **`f5dc763b6fcd0f995e2a44ff98e0f03ef3d630e9`**.
- URL privada: `https://base-completa-teste-visual-30p9rguhx-estudotd.vercel.app`. Vercel Authentication permanece ativa; links temporários com bypass são efêmeros e não devem ser guardados em arquivos, relatórios nem mensagens compartilhadas.
- Banco Neon exclusivo desta Preview: `shiny-hall-19564809`, sem utilizar dados de produção.

## Resultado definitivo dos dois ensaios de navegador autenticado

**Gratuito:** execução TinyFish `adcac97b-feac-4065-8acb-d7bfe1d659cd`, status **completed**, 22 passos. `/api/auth?action=me` confirmou `authenticated: true` e aluno fictício; `/api/plans?action=me` confirmou `free`, `active`, `theory.summary=true`, `theory.complete=false`, `tec.links=false`, `qc.links=false`, `lei_em_dia.dailyLimit=20`. Ao abrir a Central, o navegador registrou erro de carregamento, de forma que não conseguiu comprovar a leitura CPC resumida nem marcar progresso. Esse resultado **não é HTTP 403 de recurso completo**, é prova da configuração da conta e de falha na navegação.

**Premium:** execução TinyFish `926eefdb-5fab-499b-a5f7-7af025d33f43`, status **completed**, 60 passos. Sessão `authenticated: true`, conta fictícia `premium` ativa, entitlements de teoria completa e links habilitados. Painel principal apresentou oito disciplinas e a informação de **20 módulos de Processo Civil**, mas o navegador não chegou ao leitor CPC M05 nem realizou marcação de progresso.

## Diagnóstico do redirecionamento e do carregador

1. O arquivo `central-v119.html` **reescreve deliberadamente a URL para `/`** com `history.replaceState` depois de buscar `/index.html?central_source=...` e injetar a aplicação. Portanto, o retorno do Premium ao endereço raiz não demonstra que o CPC esteja ausente. O navegador tentou rotas inexistentes `/central` e `/#/cpc`; o caminho correto é usar a UI: **Disciplinas → Direito Processual Civil → M05 → Apostila completa**. Não registrar o 404 dessas rotas inventadas como defeito do produto.
2. `central-discipline-loader.js` buscava todos os arquivos de uma disciplina antes de executá-los. A lista CPC contém `/content/cpc/cpc-fixation-questions-v1.js`, **arquivo exclusivo de `premium.reviews`** e bloqueado HTTP 403 para Gratuito. Um único HTTP 403 interrompia `Promise.all` e impedia os resumos de carregarem. Foi incluído tratamento **estritamente limitado** a esse arquivo e ao status 403, que verifica o plano/entitlement novamente pela API `/api/plans?action=me` e, somente para `free` sem `premium.reviews`, ignora a bateria Premium. Arquivos de apostilas 403, erros 500 e falhas reais de Premium continuam causando erro visível — sem perda de proteção.
3. O bootstrap da branch também já possui filtragem de scripts exclusivos Premium (`isPremiumOnlyScript`) e verificação do plano no servidor, cobertas por `tests/etapa10-4-free-bootstrap-unit.mjs`. A correção específica do carregador é uma defesa adicional se o arquivo pago aparecer na lista apesar do filtro.

## Testes e evidências produzidos

- Novo teste **`tests/etapa10-4-cpc-portal-load-unit.mjs`** com sete cenários: rota raiz intencional, acesso seguro de Gratuito à teoria resumida, acesso Premium a questões, 403 inesperado Premium, 403 em apostila, falha de API de plano, e erro 500 no banco de questões.
- Auditoria GitHub Actions **[40703450603](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40703450603)** contém os testes citados, 60 cenários Chromium dos módulos CPC M01–M20 e um teste adicional de navegação pelo menu real da Central em 390/768/1366px. **Conferir conclusão do run e artefatos antes de registrar aprovado.**
- Trabalhos coexistentes na mesma branch incluem `tests/etapa10-4-free-bootstrap-unit.mjs` e `tests/etapa10-4-cpc-central-navigation-browser.mjs`, que complementam a checagem da Central mas não substituem o deployment autenticado com Neon.
- Regressões visuais anteriores 60/60 e 57/57 na build publicada foram aprovadas (ver relatórios das Etapas 10.3 e 10.4.1).

## Limites e sequência obrigatória para outra conversa

**A Etapa 10.4 NÃO está integralmente encerrada.** O login real e a segregação dos planos pela API estão comprovados; a abertura da apostila M05 em navegador autenticado na Preview publicada e a persistência real de progresso ainda não estão.

1. Confirmar sucesso de `40703450603`, checar captura/diagnóstico do teste real de navegação (fixture). Caso a navegação local falhe, corrigir apenas na branch da Preview, **sem atualizar produção**.
2. Confirmar o SHA exato da branch após a correção. O deployment READY **`f5dc763b` não contém o novo reparo**. Para testar de verdade, aprovar nova Preview privada com commit que tenha CI aprovado, mantendo o ambiente protegido `bc-preview-private` e o Neon de testes.
3. No deployment novo, usar sessões persistidas de **duas contas sintéticas**: `gratuito@teste.invalid` e `premium@teste.invalid`. A conta Premium de teste criada expira em 04/11/2026; renovar **somente na homologação** se necessário.
4. Navegar pela UI (não por rotas adivinhadas); Gratuito: abrir CPC M05 resumo, validar bloqueios de apostila completa e TEC/QC; Premium: abrir CPC M05 completo, Parte IV/VIII, tabela, questão 2, gabaritos e botão de progresso; marcar seção de conta fictícia, sair/entrar e confirmar persistência. Testar 390/768/1366px.
5. Somente depois dessas evidências, encerrar a 10.4 e passar ao aceite final 10.5 se necessário.

**Nunca** desativar Vercel Authentication, copiar tokens/senhas de teste para o GitHub ou tocar em `main`, Production, assinaturas de alunos reais ou Neon de produção.

## Comando de retomada sugerido

“Continuar Base Completa — CPC Etapa 10.4 pelo relatório `reports/etapa10-4-4-cpc-e2e-diagnostico-correcao-2026-10-28.md`, na branch `preview/legal-complete-premium-v1-20261025`. Consultar a execução CI `40703450603` e o SHA atual, validar correções do carregador, preparar nova Preview privada e concluir E2E com Gratuito/Premium de homologação. Não alterar produção.”
