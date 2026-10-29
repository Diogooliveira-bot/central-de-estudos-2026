# Base Completa — Homologação técnica sem Hotmart e sem publicação

**Data:** 29/10/2026. **Ambiente autorizado:** Preview privada da PR #187, com `main`/Neon Production preservados. **Objetivo:** reduzir pendências para GO comercial futuro, sem depender do Work, da Hotmart nem de domínio próprio.

## 1. Execução verificada

### GitHub, código e regressão

- Branch `integration/lancamento-base-completa-20261028`; PR #187 aberta e draft, sem merge, marcada mergeável no último check.
- Correção comprovada em `conheca.html`: versão anterior apresentava anual R$194, equivalente mensal incorreto de R$16,17, afirmação de custo proporcional igual e comparação com preço futuro sem aprovação. Agora exibe **R$179 para 12 meses**, **R$97 para 6 meses**, **R$14,92/mês** como equivalência do anual (não mensalidade), **economia de R$15** ao comparar dois semestres, sem afirmar preço futuro inventado.
- Checkout continua **desativado**, CTA `data-preview-only`, sem pagar. Ajustado teste `tests/commercial-journey-4-5-unit.mjs` para exigir R$179 e ausência de preço antigo. Acrescentado teste de consistência entre página comercial da Central e Termos.
- Workflow `Lancamento Base Completa - integracao controlada` na versão anterior da alteração, run `40893055430`: **108 testes / 108 aprovados / 0 falhas** em `focused-regression`; `commercial-browser` passou desktop, tablet, celular e SMTP capturado localmente com APIs simuladas. **A CI no HEAD posterior ao teste cruzado deve ser novamente conferida antes do fechamento.**
- **CI posterior à correção do teste cruzado:** run `40894577510`, job `focused-regression`: **109/109 testes aprovados, 0 falhas**, incluindo preços R$179/R$97 e confirmação de compra única; o job `commercial-browser` também concluiu com sucesso (APIs simuladas). Um commit intermediário falhou porque uma expressão de teste não refletia literalmente o texto publicado; a expectativa foi ajustada e o novo teste passou.
- **Configuração de URL pública:** a consulta dos nomes das variáveis Vercel não encontrou `BC_PUBLIC_APP_URL` nem `BC_PUBLIC_URL`. Em Production, `public-app-url.js` falha de forma fechada sem a configuração e rejeita explicitamente `central-de-estudos-ecru.vercel.app`. Antes do GO, definir endereço `*.vercel.app` controlado, HTTPS, permitido pela validação e configurá-lo na Production com o consentimento para release. O alias público existente aponta a um deployment da branch de integração, **não deve ser trocado agora**.
- O navegador de CI **não** representa aluno autenticado navegando o deployment remoto nem valida e-mail real/Hotmart. Um teste de componentes com Neon TEST foi registrado em `tests/launch-neon-integration.mjs`, mas não foi reexecutado nesta rodada com credenciais externas.

### Verificação HTTP read-only de endpoints reais

| Recurso | Resultado conferido | Limitação |
|---|---|---|
| Preview privada / `conheca.html` | HTTP 200, R$179 presente, R$194 ausente, checkout bloqueado | GET de página, não fluxo pago |
| Preview / `cadastro-gratuito.html` | HTTP 200 | Não preencheu formulário nem criou aluno |
| Preview / `recuperar-senha.html` | HTTP 200 | Não consumiu token real |
| Preview / `login.html` | HTTP 200 | Não autenticou aluno |
| Preview / `termos-de-uso.html`, privacidade e cookies | HTTP 200 | Documentos ainda minutas |
| Preview / `api/auth?action=free-signup-status` | HTTP 200, `enabled=true`, Turnstile disponível | **Somente Preview isolada**, não significa Production aberta |
| Preview / `api/auth?action=me` sem credencial | HTTP 200, `authenticated=false` | Não prova entitlements de usuário logado |
| Alias público atual `central-de-estudos-ecru.vercel.app` / `api/auth?action=free-signup-status` | HTTP 200, `enabled=false`, siteKey ausente | Cadastro público segue desativado |
| Vitrine V25 / home | HTTP 200, anual R$179, CTAs fechados, `noindex` | Não é checkout nem app autenticado |

**Identidade do deployment:** o alias estável da Preview aponta para `dpl_DMRgKdsVEZS8V43yz6iniSKU8bnG` (`READY`, SHA `b6e915f322215bc1ab088476ca70c9e0a07c50be` no momento da leitura). O atual alias público do aplicativo `central-de-estudos-ecru.vercel.app` aponta para `dpl_CRNXhAJdzN2pD9dGAjShtX3Z1SW1`, `READY`, SHA `26739f95be0aa2faf87336bc76e5dc279165ffa2`, também vindo da branch de integração. **Não confundir esses aliases com GO de um deployment Production final.** Não mover alias neste estágio.

### Neon e recuperação — somente leitura

| Branch | ID | Verificação |
|---|---|---|
| Produtiva `main` | `br-blue-sunset-b7jcts9i` | primary/default, 6 usuários, 5 assinaturas, 3 preferências; schema de cadastro público ainda não integrado |
| Cópia restaurada de testes | `br-shy-sound-b754sfmz` | Independente, pronta para consultas, 6 usuários, 5 assinaturas, 2 preferências |
| TEST lançamento | `br-sweet-waterfall-b7ry8jlw` | Independente, 10 contas de teste, 13 assinaturas, schema de cadastro e Hotmart TEST presente |

- Snapshot manual de Production `snap-red-lake-b7ytcuk2`, criado 28/10/2026 17:26:34 UTC e com expiração **04/11/2026 23:59:59 UTC**. Não substituir nem excluir.
- A cópia de testes legível é evidência útil de recuperação anterior, **não** comprova a restauração completa e recente desse snapshot. Ainda falta ensaio documentado de recuperação/rollback imediatamente antes do GO.
- Nenhum SQL de escrita foi executado nesta etapa. Não houve criação de conta, restauração sobre `main`, alteração de configurações de banco produtivo ou exposição de dados pessoais.

## 2. Portões de segurança finais antes do merge

1. **Exatidão de versão:** publicar Preview com o SHA exato de HEAD da PR e rodar os 6 workflows sem falhas, incluindo regressão comercial e navegação Chromium.
2. **Autenticação E2E autenticada:** com contas sintéticas já aprovadas, visitar Preview privada em desktop e celular; conferir signup real Turnstile + Gmail, login/logout, troca de senha, token não reutilizável, cota Free, permissões Premium e progresso; registrar resultados sem senhas ou tokens no GitHub.
3. **Isolamento do Neon:** conferir novamente a conexão de Preview com o branch TEST antes de qualquer escrita; impedir que a Preview use `main`. Não executar migrações por engano.
4. **Retenção de conta e regressões:** confirmar que mudança Premium → Free não apaga progresso, que TEC/QConcursos permanecem exclusivos Premium e que a cota de 20 questões/dia do Lei em Dia é aplicada no servidor.
5. **Backup/rollback:** criar backup fresco validado imediatamente antes do GO, testar restauração em branch nova e isolada (nunca sobre `main`), comparar contagens e versões, preservar deployment antigo e documentar rollback de app, banco e aliases.
6. **Endereço público seguro:** escolher um `*.vercel.app` permanente e validado para o app antes do lançamento; o hostname `central-de-estudos-ecru.vercel.app` está explicitamente rejeitado pela função `validatedPublicOrigin` em Production. Confirmar `BC_PUBLIC_APP_URL`, links transacionais e URLs externas; `basecompleta.com.br` ainda não foi comprado.
7. **Documentos finais e Hotmart:** continuam bloqueios **adiados por decisão do proprietário**; não remover guarda de `v24-draft-2026-10-28` nem abrir checkout enquanto pendentes.
8. **Controle de mudança:** PR #187 permanece draft. Merge e deploy Production apenas após pré-requisitos e GO explícito. Confirmar `main`, diff, envs de Production, plano de reversão e smoke real pós-publicação.

## 3. Preparação de rollback (não executado)

- **App público antes da liberação:** alias `central-de-estudos-ecru.vercel.app` → `dpl_CRNXhAJdzN2pD9dGAjShtX3Z1SW1`. Este identificador é uma referência de estado, não prova de rollback validado. Não promover Preview ao endereço público durante o teste.
- **Preview validada de marketing anterior:** `dpl_DMRgKdsVEZS8V43yz6iniSKU8bnG`. A PR pode avançar depois sem criar deployment automaticamente se houver limitação da Vercel.
- **Banco:** a branch `main` protegida é a fonte da verdade; sempre fazer snapshot e testar branch restaurada antes de qualquer ajuste em Production. Um rollback de aplicação **não** desfaz automaticamente migrações de banco nem alterações dos alunos, exigindo plano de compatibilidade.
- **Consentimentos:** não migrar aprovações de termos `draft` para a versão legal final.
- **Critérios de abortar lançamento:** 1) cadastro público indevido, 2) usuários Free recebendo conteúdo Premium ou TEC/QC, 3) Neon Prod conectado à Preview, 4) falha de recuperação/login/senha, 5) falha de checkout/ativação/reembolso, 6) documentos finais não aprovados, 7) rollback sem evidência.

**Decisão deste checkpoint: preparação técnica avançou; NO-GO para Production.** Encerrar apenas quando as evidências E2E e comerciais obrigatórias forem completas.
