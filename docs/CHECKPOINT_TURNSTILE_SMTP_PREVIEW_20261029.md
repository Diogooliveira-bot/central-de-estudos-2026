# Base Completa — Checkpoint Turnstile e SMTP da Preview
**Data:** 29/10/2026. **Política:** branch de integração apenas; nenhuma alteração na main/Production, nenhuma liberação de cadastro ou checkout.

## Execução confirmada nesta rodada

### Turnstile
- A integração existente já renderiza widget em `cadastro-gratuito.html` quando a API fornece `siteKey`, envia `turnstileToken` e valida no servidor com Cloudflare `/turnstile/v0/siteverify` conferindo `success`, `action='free-signup'` e `hostname`.
- Corrigido o **risco comprovado na lógica anterior de configuração**: as chaves oficiais de teste Cloudflare podiam satisfazer o gate sintático de Production quando flags comerciais estivessem habilitadas. Agora `signupCaptchaConfigured` recusa as cinco sitekeys de teste e as três secret keys de teste em `VERCEL_ENV=production` (qualquer combinação), mas permite o uso em testes não produtivos.
- Código: `lib/free-signup-security.js`. Testes ajustados: `tests/public-free-signup-4-5-unit.mjs`.
- Commits: `17c9ae6e7f67b5ab3c86abf361961d9d2465fff6` e `bf17bd53410d7a9849411aec5a7117e00c8cc1da`.
- Os seis workflows da integração no commit `bf17bd5` terminaram `success`, incluindo `Lancamento Base Completa - integracao controlada`, id `40866149683`.
- Preview criada automaticamente para esse commit, `dpl_ATMvDEaYBgu7dzSaUAkXZdJow8F9`, `READY`; branch alias estável: https://central-de-estudos-git-integration-lancamento-b-28e944-estudotd.vercel.app/ .
- A Preview retornou `HTTP 200 {"enabled":false,"siteKey":null}` em `/api/auth?action=free-signup-status` (comportamento esperado enquanto falta widget real e SMTP de teste).

### SMTP
- Confirmado que `lib/password-reset.js` tem suporte Gmail SMTP com TLS 1.2+, porta 465, timeout e validação da identidade. `lib/free-signup-handler.js` compartilha o transportador.
- Teste Mailpit pré-existente, aprovado em CI anterior: simula o SMTP efetivo localmente para mensagem de cadastro e recuperação e consome token de confirmação; isso NÃO prova recebimento de email externo.
- Criada na Vercel a variável **não secreta** `GMAIL_USER=basecompleta.estudos@gmail.com`, restrita ao Preview da branch `integration/lancamento-base-completa-20261028`.
- `GMAIL_APP_PASSWORD` permanece **ausente em Preview**. A senha de aplicativo de Production não foi lida, copiada ou exposta.

### Isolamento
- Neon TEST: `br-sweet-waterfall-b7ry8jlw`, configurado no Preview com guard de endpoint. Production permanece em `main` e endpoint original.
- Nenhum segredo de Turnstile ou Gmail foi exposto neste arquivo, em comentário ou em log.
- Não habilitar as flags públicas antes da etapa de homologação com credenciais reais.

## Pendências para fechar ambos com serviços externos reais

**A. Cloudflare:** necessário acesso autenticado à conta Cloudflare. Criar widget Turnstile **Non-Interactive**, hostname permitido `central-de-estudos-git-integration-lancamento-b-28e944-estudotd.vercel.app` para Preview (eventuais URLs específicas também requerem configuração apropriada). Obter Site Key e Secret Key reais, configurar no projeto Vercel `central-de-estudos` SOMENTE no target Preview com gitBranch da integração como `BC_SIGNUP_TURNSTILE_SITE_KEY` (site key pública) e `BC_SIGNUP_TURNSTILE_SECRET_KEY` (secret criptografado/sensível). Não usar chaves públicas de teste como proteção efetiva. Confirmar na validação server-side hostname e ação `free-signup`.

**B. SMTP:** não é necessário criar um segundo endereço de email. Na conta existente `basecompleta.estudos@gmail.com`, criar **nova senha de app exclusiva de homologação**; salvar diretamente na Vercel como variável criptografada/sensível `GMAIL_APP_PASSWORD`, target Preview, gitBranch da integração. Não reutilizar a senha de app configurada em Production e não enviá-la pelo chat. Reimplantar a Preview depois das variáveis. Testar em caixa real controlada o recebimento de e-mail de confirmação, link único e reset de senha, com contas sintéticas.

**C. Smoke/E2E final:** somente após A e B, com aprovação do ambiente TEST, habilitar temporariamente `BC_PUBLIC_FREE_SIGNUP_ENABLED=true` e `BC_FREE_SIGNUP_PREVIEW_ISOLATED=YES` no **Preview branch-scoped**, verificar novamente o endpoint TEST antes de gravar dados e executar browser E2E desktop/celular com proteção Vercel, Turnstile verdadeiro, SMTP externo, login/logout, rate limit e bloqueio de abuso. Desativar novamente as flags ao fim se ainda houver gates comerciais abertos. Nunca habilitar flags Production nesta etapa.

## Gates e decisão

| Componente | Estado |
|---|---|
| Código do Turnstile + verificação server-side | Implementado; hardening aprovado em CI |
| Cloudflare widget real e chaves Preview | BLOQUEADO por ausência de sessão/credenciais da conta |
| SMTP Gmail client + templates | Implementado; Mailpit testado anteriormente |
| Remetente Preview branch-scoped | Configurado |
| Nova senha Gmail de app exclusivamente Preview | BLOQUEADO por autenticação do proprietário |
| Recebimento externo real | NÃO TESTADO |
| Cadastro público em Preview / Production | Mantido fechado |
| PR / Production | PR draft, sem merge; Production intocada |

**Decisão:** ambos estão preparados tecnicamente, mas NÃO podem ser classificados como integrações reais concluídas até autenticação da conta Cloudflare e da conta Google para emissão das credenciais seguras. O próximo passo não é refazer código: obter essas duas credenciais por canais autenticados e depois executar E2E hospedado.

## Evidências
- PR #187: https://github.com/Diogooliveira-bot/central-de-estudos-2026/pull/187
- Código Turnstile: https://github.com/Diogooliveira-bot/central-de-estudos-2026/commit/17c9ae6e7f67b5ab3c86abf361961d9d2465fff6
- Regressão e gate Production: https://github.com/Diogooliveira-bot/central-de-estudos-2026/commit/bf17bd53410d7a9849411aec5a7117e00c8cc1da
- GitHub Actions: https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40866149683
- Deployment Preview: https://vercel.com/estudotd/central-de-estudos/ATMvDEaYBgu7dzSaUAkXZdJow8F9
- Cloudflare test keys: https://developers.cloudflare.com/turnstile/troubleshooting/testing/
- Cloudflare server-side: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
