# Base Completa — Etapa 10.5.1 | Regressão do seletor de onboarding e nova prévia controlada

**Data:** 28/10/2026. **Branch:** `preview/legal-complete-premium-v1-20261025`. **Produção e `main`: não modificadas**.

## Contexto e achado

O usuário aprovou o environment privado para a publicação da correção de carregamento de Civil/CPC, commit `7efe8866098b51c359c27a00ff2bf6a4369c57f8`. A execução [GitHub Actions 40755836130](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40755836130) ultrapassou os testes de autenticação, Premium, 60/60 casos editoriais do CPC e carregamento dos módulos, mas **falhou no teste de navegação de Civil em Chromium** antes de publicar, preservando a Preview anterior.

Falha exata: o teste `tests/etapa10-4-cpc-home-flow-browser.mjs` usava o seletor `[data-student-onboarding] [data-onboarding-close]`, que passou a corresponder a **dois botões** do onboarding: `Configurar depois` e `Agora não`. A execução `.isVisible()` caiu na verificação `strict mode violation` do Playwright. Esse erro ocorreu no **teste de automação**, sem demonstração de defeito do conteúdo CPC ou do carregador.

## Correção isolada

O seletor foi restringido ao botão real de fechar o onboarding:

`page.locator('[data-student-onboarding] button.student-onboarding-close').first()`

A mudança afeta **somente o teste**: não foram alterados o HTML dos alunos, JavaScript de produção, conteúdos jurídicos, IDs, direitos de planos, dados, leitura nem bancos.

## Resultados

- [GitHub Actions 40757167111](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40757167111): `completed/success`, código imutável testado `84111d7916ec1ad05d476d722c313fe0fa362960`.
- **60/60** cenários editoriais CPC M01–M20 (390/768/1366 px) aprovados.
- **3/3** cenários de navegação integral Premium (Chromium local com autenticação simulada) aprovados.
- Testes **Gratuito e Premium** em `tests/etapa10-4-cpc-home-flow-browser.mjs`: ambos `ready=true`, `navVisible=true`, `cpcReady=true`, `mode=ok`; o Gratuito preserva o 403 esperado em requisição simulada de conteúdo Premium.
- [Evidências 12847280678](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40757167111/artifacts/12847280678), com métricas e capturas; expiração prevista para 11/11/2026.
- **Ressalva:** a fixture do Gratuito continua registrando `Unexpected end of JSON input` sem impedir abertura CPC. Isso permanece como achado da simulação, ainda não atribuído à Preview real.

## Nova liberação privada

Workflow `.github/workflows/deploy-private-visual-preview.yml` foi atualizado para checkout e verificações vinculados ao SHA **`84111d7916ec1ad05d476d722c313fe0fa362960`**, com testagem completa e publicação restrita a `base-completa-teste-visual` em target Preview. **Vercel Authentication, revisão obrigatória do environment `bc-preview-private`, banco de homologação e Hotmart desligado permanecem intactos.**

- **Nova execução aguardando aprovação:** [40757485979](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40757485979).
- Última versão READY verificada antes dessa aprovação: `dpl_7ucKUZSZpA6Uzkv1weop8WrS3NKu`, SHA `7584a48e72c94a3650ca5fb021c3cbfc4412517d`, **sem a correção de Civil**.
- Após aprovação, exigir `READY` e `meta.githubCommitSha=84111d...` para reconhecer publicação. Somente então iniciar login das contas fictícias no novo domínio e validar entrega dos materiais CPC e Civil e persistência real.

**Não declarar Etapa 10.4 integralmente encerrada:** os testes no Chromium foram locais; acesso a módulos e progresso com sessão Premium/Gratuito no deployment atualizado continuam pendentes. A aprovação anterior foi consumida pela execução que falhou, exigindo nova aprovação do environment para a nova execução.
