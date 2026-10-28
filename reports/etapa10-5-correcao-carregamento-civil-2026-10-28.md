# Base Completa — Etapa 10.5 | Falha de carregamento de Direito Civil

**Data:** 28/10/2026  
**Branch de trabalho:** `preview/legal-complete-premium-v1-20261025`  
**Commit funcional validado:** `7efe8866098b51c359c27a00ff2bf6a4369c57f8`  
**Situação:** correção **implementada e aprovada em testes locais**, publicação **privada aguardando revisão**, produção **inalterada**.

## Sintoma confirmado

Captura fornecida pelo proprietário: painel de **Direito Civil**, 15 módulos, exibindo `Não foi possível carregar. Verifique sua conexão e tente novamente.` com botão `Tentar novamente`. Esse texto corresponde exatamente a `placeholder()` de `central-discipline-loader.js`, acionado quando `states.civil.error` está preenchido. Não é mensagem do navegador nem evidência de conteúdo excluído.

Os testes de navegador anteriores confirmaram sessões autenticadas dos alunos sintéticos Gratuito e Premium, mas **não concluíram acesso às apostilas** na Preview; por isso a etapa 10.4 permanecia pendente.

## Causa identificada no código

O bootstrap de `central-v119.html` aplica `isPremiumOnlyScript(src)` aos arquivos do aluno Gratuito na lista `window.__centralDisciplineFiles`. O script legado `central-lazy-theory-v66119.js`, entretanto, registra **outra** lista, `window.CentralTheoryFiles`, incluindo:

- `content/civil/civil-sharing-links.js` — links exclusivamente Premium;
- `cpc-theory-module1-v66119.js` — teoria antiga exclusiva Premium;
- `adm-m1-theory-v66141.js` e `content/adm/adm-sharing-links.js` — materiais exclusivamente Premium;
- duplicatas e leitores legados.

`central-discipline-loader.js` concatenava as duas listas em `filesFor(id)` **sem reaplicar o filtro do plano Gratuito**. Assim, um `403` correto do servidor para um material pago rejeitava o lote, definia `states[id].error` e fazia **a disciplina inteira apresentar falha**. A conclusão se baseia no fluxo do código e em testes reproduzindo a negativa HTTP; não se afirma que esse foi o único erro possível em todas as sessões do usuário.

## Correção segura

1. `central-v119.html`: compartilha com o carregador o indicador do aluno Gratuito e o **mesmo predicado** `isPremiumOnlyScript` já utilizado no bootstrap, sem duplicar a política e sem inferir planos por e-mail.
2. `central-discipline-loader.js`: filtra os arquivos da lista suplementar antes de buscar; preserva a deduplicação e a ordem dos scripts, conserva a negativa `403` de conteúdo pago e **falha de forma fechada** se a política não estiver disponível.
3. Não houve alteração dos dados, textos jurídicos, contas, direitos de plano, tokens, progresso ou requisições do Premium.
4. Teste novo: `tests/central-discipline-plan-loading-unit.mjs` simula os carregadores de Civil, CPC e ADM com um `403` para arquivos pagos, testa a deduplicação e a ausência de filtro (falha fechada).
5. Teste de navegador estendido: `tests/etapa10-4-cpc-home-flow-browser.mjs` abre CPC e depois **Civil** em Chromium real nos dois planos, verifica 15 módulos, ausência de placeholder, e realiza um `GET` proposital de `civil-sharing-links.js` com usuário Gratuito, esperando `403`.

## Evidência de testes

- [GitHub Actions 40755456846](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40755456846): **success**, SHA `7efe886...`.
- **5/5 novos testes unitários** de carregamento aprovados; autenticação/entitlements e demais testes Premium aprovados.
- **60/60 verificações editoriais CPC M01–M20** aprovadas; navegação integrada CPC/M05 em Chromium aprovada.
- **Chromium Premium e Gratuito: resultados `mode:ok`**, sem erro de carregamento do Civil, com os 15 módulos renderizados nos dois casos. O teste exige que os 403 de scripts legados Premium **não** ocorram durante o carregamento; realiza GETs separados, esperadamente negados com 403, para atestar proteção do servidor.
- [Artefatos 12845459072](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40755456846/artifacts/12845459072) com capturas/métricas de auditoria e browser, retenção prevista até **11/11/2026**.
- Observação: existe um `Unexpected end of JSON input` não bloqueante na fixture local do Gratuito, que não foi atribuído a esta correção. Os dois GETs 403 explícitos foram intencionalmente exercitados; precisam ser distinguidos de 403 durante carregamento. Não foi concluída auditoria de console livre de todo erro.

## Próximo passo obrigatório para homologação integrada

O workflow de Preview `.github/workflows/deploy-private-visual-preview.yml` foi **preparado**, fixando o SHA `7efe886...` e exigindo novamente os testes unitários e de Chromium para Civil/CPC antes do deployment no projeto temporário `base-completa-teste-visual`, ambiente protegido `bc-preview-private`.

**Run aguardando aprovação:** [40755836130](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40755836130).

Depois da revisão e do deployment READY, verificar que o SHA do deployment é `7efe886...`, manter Vercel Authentication e banco de testes, abrir Civil com aluno Gratuito e Premium de homologação e atestar persistência real. **Não publicar em Production sem esses resultados.**

**Escopo de segurança:** `main`, Production, Neon real, conteúdo-fonte, assinaturas e progresso dos alunos permaneceram intactos.
