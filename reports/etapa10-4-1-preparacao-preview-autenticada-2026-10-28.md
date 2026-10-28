# Base Completa — Etapa 10.4.1 | Preparação da Preview autenticada

**Data:** 28/10/2026  
**Classificação:** preparação concluída; **deployment privado pendente de aprovação**; homologação com sessão Premium/Gratuito ainda não executada.

## Ambiente identificado e protegido

- **Projeto temporário Vercel:** `base-completa-teste-visual` (ID `prj_9lWICZgoJh4UNHZQ6CleUAmQIHqG`). Proteção `Vercel Authentication` mantida para todos os deployments. Não é o projeto de produção `central-de-estudos`.
- **Banco de teste:** projeto Neon `shiny-hall-19564809`, independente do projeto de produção e do outro Neon denominado `base-completa-homologacao`. O banco usado **nesta Preview** possui tabelas `central_users`, `central_user_subscriptions` e `central_plan_entitlements`. Em consulta somente leitura, foram encontrados três alunos (um Gratuito e dois Premium) e um administrador, todos sujeitos às regras do banco de teste. Não foram lidos nem divulgados e-mails/senhas dos alunos.
- **Permissões confirmadas diretamente na base de teste:** `theory.complete`, `tec.links` e `qc.links` negados ao plano Gratuito, permitidos ao Premium; `theory.summary` liberado a ambos.
- **Variável sensível `DATABASE_URL`:** atualizada **somente no target Preview do projeto temporário** via conexão do Neon de teste, com tipo `sensitive`; não inserida em código, commits, logs ou relatório. `lib/auth.js` usa `process.env.DATABASE_URL` como conexão.
- **Segredos de autenticação:** `AUTH_SECRET`, `BC_TEST_FREE_PASSWORD` e `BC_TEST_PREMIUM_PASSWORD` já existiam protegidos no projeto temporário, sem necessidade de lê-los ou alterá-los.
- **Controles preservados:** `EXAM_PROGRESS_PREVIEW_DB_ISOLATED=true`, `HOTMART_LIVE_ENABLED=false`, `HOTMART_TEST_RECEIVER_ENABLED=false` no ambiente Preview do projeto temporário. Nenhuma configuração da Production foi alterada.

## Workflow seguro da publicação privada

Arquivo `.github/workflows/deploy-private-visual-preview.yml` atualizado na branch jurídica:

1. Commit-fonte fixado em `f5dc763b6fcd0f995e2a44ff98e0f03ef3d630e9`, cuja [auditoria técnica 40653718030](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40653718030) passou com 40/40 verificações de autenticação/proteção e 60/60 verificações Chromium.
2. Checkout do **SHA imutável aprovado**, e assertivas para o SHA, branch e projeto Vercel temporário. Não usa `vercel --prod` nem promove deploy.
3. Mantido environment protegido **`bc-preview-private`**, com revisão humana antes da execução dos passos de deploy. Sem contornar aprovação ou proteção SSO.
4. Antes de publicar: `npm test`, `npm run test:premium-protection`, `npm run test:premium-and-auth`, regressões e teste visual CPC M01–M20 com Chromium em 390, 768 e 1366 px, além do build protegido.
5. **Nova execução em espera:** [GitHub Actions 40660741519](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40660741519). O workflow continuará pendente até a revisão do environment.

## Estado, limites e próximos passos

**Não declarar 10.4 homologada enquanto não houver publicação e autenticação reais.** O deployment atualmente READY no projeto temporário ainda corresponde ao commit antigo `10c4d9a3...`; a versão jurídica aprovada `f5dc763b...` **não foi publicada nem examinada com alunos autenticados**. Na execução atual do workflow, não foi efetuada nenhuma ação no deployment por estar atrás da aprovação.

Assim que o revisor autorizado aprovar a execução **40660741519** no environment `bc-preview-private`, verificar o novo deployment READY com `meta.githubCommitSha` igual a `f5dc763b...`, confirmar a proteção Vercel, e executar a matriz de homologação com contas **de teste**:

- Gratuito: acesso à teoria resumida e bloqueio HTTP da apostila completa, dos dados jurídicos `/content/cpc/mXX-native-data.js` completos e dos links TEC/QC.
- Premium: acesso ao leitor M01–M20, tabelas, navegação e progresso persistente.
- Celular/tablet/computador: responsividade e ausência de perda de dados de progresso entre reaberturas.
- Sem disparar mensagens, pagamentos, e-mails comerciais ou atualizações de produção.

Se houver falha de deploy, permissão, login ou persistência, registrar como **Etapa 10.5**, sem promoção/merge. O aceite editorial/jurídico continua separado.

**Não houve alteração em `main`, Production, plano de alunos reais, conteúdo jurídico original nem em bancos de dados reais; apenas configuração e leitura no banco Neon de teste, workflow de Preview e registro técnico.**
