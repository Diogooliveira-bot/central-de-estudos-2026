# Base Completa — Etapa 10.4 | Pré-homologação integrada do CPC

**Data:** 28/10/2026  
**Branch isolada:** `preview/legal-complete-premium-v1-20261025`  
**Situação:** **PRÉ-REQUISITOS TÉCNICOS APROVADOS; HOMOLOGAÇÃO AUTENTICADA BLOQUEADA POR CONTROLES DE SEGURANÇA**.

## 1. Inventário efetivamente confirmado

- **Branch jurídica:** commit `f5dc763b6fcd0f995e2a44ff98e0f03ef3d630e9` contém acréscimo à auditoria do teste de autenticação/planos, sem alterar conteúdo das apostilas.
- **Projeto Vercel de prévia visual:** `base-completa-teste-visual`, deployment READY `dpl_AFDqqbXCtoqnExTuKYy2MxkoKth5` no commit **`10c4d9a3...`**. Proteção por Vercel Authentication está **habilitada para todos os deployments**. **Não é a versão atual do CPC**.
- **Projeto Vercel da aplicação:** `central-de-estudos`, possui deployments Preview protegidos por Vercel Authentication; último identificado da branch jurídica: `dpl_7hSXy4mHa7kdRBrhM8RFXifu3Ljp` no commit **`d6ca4229...`**. A busca pelo commit atual da branch não retornou deployment. Não usar esse deployment antigo como prova de funcionamento das alterações finais.
- **Workflow de publicação da prévia visual:** `.github/workflows/deploy-private-visual-preview.yml` exige o environment protegido `bc-preview-private` e faz checkout **explicitamente fixado em `10c4d9a3...`**, independente da branch que disparou o fluxo. O run mais recente ficou em **waiting**. **Não foi solicitado desbloqueio do environment nem alterado o pin**.
- **Banco Neon de homologação:** projeto `base-completa-homologacao` existe (identificado apenas por metadados) e tem uma branch `main`. No projeto Vercel da aplicação há `DATABASE_URL` no escopo geral de Preview, mas a consulta por variável específica da branch jurídica não retornou correspondência. Isso **não permite concluir** que o Preview usa o Neon de homologação: a URL/ligação efetiva não foi verificada. Nenhum dado do Neon foi consultado ou modificado.
- **Contas de teste:** nenhuma sessão autenticada Premium ou Gratuita foi aberta no deployment atual; não usar contas reais nem fabricar credenciais. Nenhum fluxo de inscrição, pagamento, ativação ou migração foi executado.

## 2. Testes executados com sucesso no código da branch

GitHub Actions: [execução 40653718030](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40653718030), `completed/success` no commit `f5dc763b...`.

| Verificação | Resultado | Limite |
|---|---|---|
| Autenticação e proteção Premium — `npm run test:premium-and-auth` | **40/40 testes unitários aprovados** (26 de proteção Premium e 14 de autenticação/recuperação) | Usa mocks/fixtures locais, não login real |
| Tema/estrutura jurídica — testes unitários pré-existentes | **11/11 aprovados** | Não valida conta real |
| Auditoria CPC M01–M20 em Chromium | **60/60 cenários aprovados** (390, 768 e 1366 px) | Localhost isolado e sem sessão Premium |
| Evidências | [artefato 12799764112](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40653718030/artifacts/12799764112) | Capturas e métricas; expiração estimada em **11/11/2026** |

Foram revalidados temas Premium, estrutura das tabelas, ausência de overflow/erro JavaScript, acessibilidade básica da tabela, preservação visual e correções editoriais do M05. Testes server-side cobrem regras de plano e entrega privada conforme a suíte existente, mas **não substituem o teste com os dois perfis autenticados no ambiente Vercel**.

## 3. Portas de segurança pendentes antes de considerar 10.4 concluída

1. **Conferir e registrar a vinculação exata da configuração de Preview da branch jurídica ao banco Neon de homologação**, sem imprimir ou exportar strings de conexão. A simples presença da variável `DATABASE_URL` geral não garante isolamento.
2. **Preparar um deployment protegido da aplicação com SHA exato testado**, sem atualizar Production ou `main`; atualizar o fluxo da prévia visual apenas com aprovação específica e preservar o environment `bc-preview-private`.
3. **Confirmar contas de homologação controladas Premium e Gratuito**, sem informações pessoais de alunos e sem compartilhar senhas ou tokens em logs, capturas ou chat. Nenhuma criação/elevação de assinatura real.
4. **Executar no deployment autenticado** os testes de acesso Premium ao conteúdo CPC completo, negação de acesso a Gratuito, sessões, leitores M01–M20, scroll móvel, marcações e persistência. Conferir também bloqueio HTTP das URLs de dados `/content/cpc/mXX-native-data.js` quando usuário não possui direito.
5. Registrar evidências, exceções e aceite editorial humano sem publicar em Production.

## 4. Resultado e recomendação

**Classificação:** 10.4 **parcialmente executada / bloqueada no teste integrado**. Não homologar nem aprovar publicação real com base somente no CI. O próximo trabalho depende, em primeiro lugar, da confirmação do isolamento banco/Preview e do deployment do SHA correto. O fluxo privado protegido não deve ser simplesmente aprovado enquanto estiver pinado em commit obsoleto.

Nenhuma alteração foi feita em `main`, Production, Neon, direitos de aluno ou configurações de proteção Vercel. Apenas a suíte de testes do branch de preview foi reforçada.
