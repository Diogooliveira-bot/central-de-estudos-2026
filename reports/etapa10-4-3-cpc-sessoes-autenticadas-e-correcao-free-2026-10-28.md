# Base Completa — Etapa 10.4.3 | Sessões autenticadas e correção de abertura do Gratuito

**Data:** 28/10/2026  
**Ambiente:** Vercel Preview privada `base-completa-teste-visual`; Neon sintético `shiny-hall-19564809`.  
**Estado:** **homologação autenticada parcialmente executada; falha visual do Gratuito reproduzida; correção aprovada no código e pendente de nova publicação privada.**

## 1. Ensaios reais com sessões dos alunos fictícios

Os dois navegadores de homologação tinham sessões salvas pelo proprietário sem divulgação das senhas. Os ensaios ocorreram no deployment privado `dpl_H3XSoKBuzMh1wZrTe5PoAhstRJjn` com SHA `f5dc763b6fcd0f995e2a44ff98e0f03ef3d630e9`.

| Cenário | Evidência / resultado |
|---|---|
| Conta Premium: `/api/auth?action=me` | **Autenticada**, papel `aluno`, ativa. |
| Conta Gratuita: `/api/auth?action=me` | **Autenticada**, papel `aluno`, ativa. |
| Vinculação dos planos | **Confirmada no Neon de testes**: uma conta é `free/active` e outra `premium/active`, ambas fictícias. Não inferir o plano apenas pelo nome no frontend. |
| Dashboard Premium | **Abriu** `/central-v119.html`, exibiu Direito Processual Civil com 20 módulos. Modal de objetivo inicial dificultou a navegação. |
| Dashboard Gratuito | **Falha reproduzida**: tela `Preparando sua Central` exibe `Não foi possível concluir o carregamento. Verifique a conexão e tente novamente.` e botão `Tentar novamente`; recarregar não resolveu. |
| Apostila CPC M05 no Premium | **Não verificada**: automação não concluiu a navegação ao módulo antes do limite da sessão. |
| Bloqueio real do M05, TEC/QC no Gratuito | **Não verificado** em UI, porque o dashboard não iniciou. |
| Persistência de progresso | **Não executada**; não se fizeram alterações de estudo nesta rodada. |

Evidências dos navegadores: [Premium — primeiro ensaio](https://agent.tinyfish.ai/runs/73d2bd0b-bc12-4e1b-b2b5-829881945c36), [Gratuito — primeiro ensaio](https://agent.tinyfish.ai/runs/0cb12e5b-cbfa-4e08-8ef3-20cdb8c55f50), [Premium — navegação CPC](https://agent.tinyfish.ai/runs/fef1e02e-124f-4b03-848a-5dd63a875f3b), [Gratuito — reprodução do erro](https://agent.tinyfish.ai/runs/1f7817b8-7f28-48f1-a98c-19dd8bdd1abc). Sessões, tokens, cookies, senhas, hashes e informações pessoais não foram registrados neste relatório.

**Falha de teste identificada:** uma automação tentou a rota não existente `/cpc` e outra usou `/api/auth?action=plans-me`, que não é endpoint válido. O caminho correto da Central é `/central-v119.html` e a API de plano é `/api/plans?action=me`; não considerar erro 404 desses caminhos inventados como defeito do CPC.

## 2. Investigação e correção segura no código

Inspecionados `central-v119.html`, `central-boot-ready.js`, `lib/protected-content.js`, `lib/private-content-handler.js` e `middleware.js`.

**Causa estrutural identificada:** o bootstrap antigo injeta scripts premium-only, como fontes de teoria completa, TEC e partes de RLM, antes de verificar o plano. A camada de entrega privada **corretamente devolve 403** para arquivos sem projeção segura ao plano Gratuito. O `central-boot-ready.js` trata falha de qualquer tag `SCRIPT` como erro geral de inicialização, portanto requisições incompatíveis com o plano podem bloquear a tela inteira. Esta relação é coerente com o erro reproduzido; a confirmação final da correção só ocorre após deployment e novo ensaio real.

**Mudança proposta e isolada na branch jurídica**, sem tocar no código de permissões do servidor:
- A abertura em `central-v119.html` consulta a API autoritativa `/api/plans?action=me`, exceto o modo de convidado sintético sem usuário.
- Apenas com `free` verificado, omite da injeção tags de scripts premium-only e respectivos carregamentos preguiçosos de disciplinas, preservando dados nativos projetados de resumo gratuito.
- Não altera nem afrouxa `protectedAsset()`, middleware, respostas 403, hashes, tabelas, IDs de progresso ou conteúdo jurídico.
- Mantém o bootstrap Premium e a estrutura visual do CPC inalterados.

Arquivo de regressão: `tests/etapa10-4-free-bootstrap-unit.mjs`. Atesta cobertura de arquivos protegidos declarados no carregamento, preservação das fontes projetadas e bloqueio server-side.

## 3. Verificação técnica

[GitHub Actions 40674760691](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40674760691), SHA **`123820c59525da2883951e822a6d622d64b85fcc`**: `completed/success`.

- **3/3** testes novos de bootstrap Gratuito, sem falhas.
- **26/26** testes de proteção Premium e **14/14** de autenticação, sem falhas.
- **11/11** testes de layout Premium e piloto, sem falhas.
- **60/60** verificações CPC M01–M20 em Chromium local: 390, 768 e 1366px; fonte, títulos, tabelas, ausência de overflow/erros.
- Evidências visuais: [artefato 12809229793](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40674760691/artifacts/12809229793).

**Limite:** testes de Chromium são locais, não substituem uma navegação autenticada no deployment Vercel com a versão corrigida.

## 4. Próximo bloqueio: nova aprovação de deployment privado

Arquivo `.github/workflows/deploy-private-visual-preview.yml` atualizado para fixar o SHA `123820c59525da2883951e822a6d622d64b85fcc`; adiciona a regressão do Gratuitto à suíte pré-publicação. Continua usando **somente** projeto temporário `base-completa-teste-visual`, `vercel deploy --yes` sem `--prod`, `bc-preview-private` protegido.

**Nova execução aguardando revisão:** [40674969770](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40674969770). O último deployment READY anterior `f5dc763b...` **ainda não inclui a correção**.

Após aprovação, confirmar SHA novo em Vercel READY, repetir nos perfis autenticados: painel Gratuito → resumos CPC e bloqueio do M05 completo/TEC/QC; painel Premium → apostila completa M05 e partes IV/VIII, tabelas; persistência real da leitura; evidências em celular/tablet/computador. Não publicar em Production.

**Status editorial:** 10.4 parcialmente executada; reparo de interface da Etapa 10.5 preparado, **ainda não homologado em browser real**.
