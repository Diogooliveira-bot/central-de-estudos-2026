# Etapa 4.6 — Isolamento de Preview e verificação operacional (28/10/2026)

## Diagnóstico
- PR de lançamento #187 aberto em draft. Último commit antes desta etapa: `996a37e9e24d92f8cfc5b4473f3c9688f173b379`.
- Os sete workflows do referido commit passaram em GitHub Actions.
- O deployment Vercel `dpl_CnhgY4dMKXnp89TSseGTonxmkokS` era READY (branch de integração); o alias `central-de-estudos-ecru.vercel.app` ainda apontava para commit anterior (`26739f9`).
- `app.basecompleta.com.br` está cadastrado/verificado na Vercel, mas a consulta DNS à Vercel indica `misconfigured=true`, com nameservers do Registro.br e sem CNAME/A retornado. **Não inferir que esse domínio funcione em produção.**
- `HOTMART_LIVE_ENABLED`: production `true`; preview `false` (consultado na Vercel). O valor de produção foi **mantido** para não alterar o comportamento existente. Risco permanece até auditar a configuração de webhook/variáveis.
- Vercel Preview possuía `DATABASE_URL` compartilhada, sem vínculo demonstrado com o Neon TEST correto. Branch específica de integração não possuía override.
- O snapshot principal Neon `pre-lancamento-production-audit-20261028` tem validade informada até 04/11/2026. Verificar renovação e teste de restauração antes do GO.

## Ações executadas nesta etapa
- Neon `shiny-hall-19564809`: branch de testes **`br-sweet-waterfall-b7ry8jlw`**, nome `test/codex-lancamento-20261028`, existe, `default=false`, `primary=false`, `current_state=ready`.
- Inspecionada a branch por consultas **somente leitura**: encontradas tabelas `central_hotmart_webhook_inbox`, `central_hotmart_orders`, `central_free_signup_pending`, `central_free_signup_contacts`, `central_free_signup_legal_acceptances` e os campos de aceites e opt-in de e-mail.
- Obtida conexão exclusiva da branch TEST via interface Neon e gravada na Vercel como **`DATABASE_URL` do tipo sensitive, alvo Preview com gitBranch exato `integration/lancamento-base-completa-20261028`**.
- Verificado pela lista de variáveis que a configuração branch-scoped foi criada. **Nenhuma credencial foi registrada em GitHub ou logs. Nenhuma variável Production foi alterada.**
- Uma nova execução de deployment será necessária para que a alteração de variável entre no runtime. Confirmar branch, SHA e ambiente antes de qualquer teste integrado.

## Restrições de segurança e critérios de conclusão
1. **Não aplicar migrações em Production, alterar contas de alunos, fazer compras reais, ativar cadastro público ou mesclar PR #187 em main.**
2. Confirmar no novo deployment Preview que `DATABASE_URL` usa exclusivamente TEST, sem revelar URL/credencial em logs. Usar diagnóstico seguro por identidade de branch ou consulta SQL `SELECT` apenas; se indisponível, deixar pendente.
3. **NÃO ativar o webhook Hotmart LIVE no Preview**, cuja flag está desativada.
4. Domínio `app.basecompleta.com.br` precisa de revisão DNS pelo provedor competente; não mexer no DNS do domínio em uso inadvertidamente.
5. Resolver documentos legais definitivos, SMTP real, Cloudflare Turnstile, cadastro E2E e recuperação antes de GO.
6. Abrir vendas só após backup restaurável atual, validação contratual/comercial e testes ponta a ponta.

**Status: configuração de isolamento de Preview criada e registrada. Homologação de ponta a ponta ainda pendente.**
