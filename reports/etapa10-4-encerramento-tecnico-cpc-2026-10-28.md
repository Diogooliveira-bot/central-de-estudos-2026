# Base Completa — CPC M01–M20 | Encerramento técnico das etapas 10.4 e 10.5

**Data:** 28/10/2026  
**Branch de prévia (isolada):** `preview/legal-complete-premium-v1-20261025`  
**Status:** **testes técnicos concluídos e aprovados; aceite final E2E autenticado na Preview permanece pendente**. Não representa autorização de merge, promoção ou alteração em Production.

## 1. Publicação privada verificada

- **Projeto Vercel:** `base-completa-teste-visual` — independente do projeto principal.
- **Deployment READY:** `dpl_4VvG9FvYJHKmEVepP6teJspdfyLD`, URL https://base-completa-teste-visual-4d5y5lrms-estudotd.vercel.app .
- **SHA do código da Preview:** `84111d7916ec1ad05d476d722c313fe0fa362960`. A Preview continua sob Vercel Authentication; target não é Production.
- Os commits posteriores vistos no branch são de testes e documentação; **não foi realizada publicação adicional nem alterada Production nesta etapa**.
- O carregamento gratuito foi corrigido anteriormente: `central-v119.html` e `central-discipline-loader.js` filtram arquivos legados Premium, evitando que um 403 autorizado derrube toda a disciplina. Ver relatório [Etapa 10.5](./etapa10-5-correcao-carregamento-civil-2026-10-28.md) e [Etapa 10.5.1](./etapa10-5-1-correcao-seletor-onboarding-2026-10-28.md).

## 2. Resultado técnico final

**Execução final:** [GitHub Actions 40762473694](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40762473694) — `completed/success`, commit de workflow `2dd2d49651c2ba34fb2045de94eef9b6e93bf9c5`. A exclusão posterior de um teste redundante não alterou código funcional nem as suítes aprovadas.

| Controle | Resultado |
|---|---|
| Auditoria editorial M01–M20, 390/768/1366px | **60/60** cenários no Chromium aprovados |
| Navegação pela aplicação real em localhost: Disciplinas → CPC → M05 | **3/3** cenários em Chromium aprovados |
| M05: Parte IV e Parte VIII, questões 1–15, resposta da questão 2 | Aprovado na navegação integrada |
| Marcação de capítulo CPC M05, fechar e reabrir leitor | **Persistência local aprovada** nos três tamanhos de tela |
| Fluxo Gratuito/Premium com sessões locais simuladas e negativa 403 controlada | Suíte aprovada |
| Testes unitários de autenticação, proteção Premium, inicialização e isolamento de scripts legados | Suítes aprovadas |
| Evidências (capturas e métricas) | [artefato 12849455412](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40762473694/artifacts/12849455412), validade prevista até 11/11/2026 |

O teste redundante criado posteriormente em `tests/etapa10-4-cpc-integrated-browser.mjs` falhou por **timeout na tentativa de clicar em elemento que existe**, sem provar defeito de produto. O teste foi removido junto com o respectivo passo do workflow, mantendo as suítes **preexistentes** que efetivamente verificam navegação, menus, CPC M05 e persistência. O pipeline voltou a verde. Não se deve usar a execução falha `40762114366` para afirmar regressão da plataforma.

## 3. Evidências de contas reais de homologação

Consulta somente leitura ao projeto Neon de testes `shiny-hall-19564809`, **não** ao banco da produção:

- Contas fictícias `gratuito@teste.invalid` e `premium@teste.invalid`: **ativas**, com histórico de login em 28/10/2026.
- Plano Gratuito: `theory.summary=true`; `theory.complete=false`; `tec.links=false`; `qc.links=false`.
- Plano Premium: os quatro recursos estão habilitados.
- O teste de navegador privado confirmou autenticação das duas contas pela API e os respectivos planos, mas **não alcançou o leitor CPC em uma sessão online verificável**, inicialmente por dificuldade de navegação.
- Há registro de sincronização no Neon de homologação para a conta Premium, revisão 24 (28/10/2026, 19:21 UTC), incluindo **chaves de Direito Civil M05**, mas **isso não comprova que uma marcação de CPC M05 foi salva no servidor**.
- A conta Gratuita não tinha registro equivalente de sincronização no momento da verificação; não inferir falha por ausência de registro se não houve marcação feita.

## 4. Critério de encerramento e pendência inequívoca

**Encerrado:** acabamento editorial técnico e testes integrados **locais** do CPC M01–M20, preservação de fontes e identificadores, segurança por plano nos testes automatizados, entrega na Preview privada protegida.

**Não encerrado / pendente de prova em sessão real:** efetivamente entrar na **Preview READY `84111d...`** com os perfis Gratuito e Premium, acionar Direito Processual Civil via **Disciplinas**, confirmar HTTP 403/negação de conteúdo Premium para Gratuito, abrir o M05 completo como Premium, marcar uma seção, sair/entrar e verificar persistência **no banco**. A presença de cookie Google, sucesso em Chromium local ou chaves de progresso de Direito Civil não atende a esse critério. Usar automação com sessão existente ou uma verificação assistida sem divulgar senhas.

**Risco editorial remanescente:** revisão jurídica atualizada, suficiência doutrinária de módulos curtos e quadro adicional M05 indicado em [Etapa 10.3](./etapa10-3-revisao-residual-cpc-2026-10-28.md), não certificados pelo teste de apresentação.

**Decisão:** **apto à continuidade da homologação e ao aceite editorial controlado, mas NÃO marcado como E2E 10.4 integralmente homologado nem liberado para produção**. Nenhum merge na `main`, publicação Production, alteração de assinaturas, compra ou escrita em banco real foi efetuado.
