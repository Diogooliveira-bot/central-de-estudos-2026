# Homologação sem domínio próprio — 28/10/2026

## Decisão operacional
O proprietário informou que **não possui ainda o domínio `app.basecompleta.com.br`**. A homologação deve continuar com URLs provisórias da Vercel. Não comprar domínio e não configurar DNS do domínio futuro sem titularidade demonstrada.

## Diagnóstico
A recuperação de senha e o e-mail de ativação da Hotmart continham fallback de produção fixo para `central-de-estudos-ecru.vercel.app`, que está associado a uma Preview anterior. Um link de uso único enviado ao ambiente incorreto pode impedir a conclusão do cadastro ou da ativação Premium.

## Correção
- `lib/public-app-url.js` resolve a origem de cada ambiente com segurança.
- Na Preview, links de confirmação e ativação usam `https://` + `VERCEL_URL` do próprio deployment, sem depender do domínio não registrado.
- Em Production, exige `BC_PUBLIC_APP_URL` (com `BC_PUBLIC_URL` somente como compatibilidade), com HTTPS, host permitido e sem caminhos, queries, credenciais ou fragmentos. Sem configuração adequada, **falha fechado**; não envia token para a Preview antiga.
- Origem `central-de-estudos-ecru.vercel.app` é proibida como URL pública de Production por ser Preview de homologação.
- `lib/password-reset.js`, `lib/hotmart-webhook.js` e `lib/premium-expiry-reminders.js` usam a mesma política.
- Nenhuma variável de Production foi criada ou alterada. Não permitir e-mails públicos até escolher e verificar um hostname definitivo, que pode ser um domínio `.vercel.app` sob controle do projeto.

## Evidências
- GitHub Actions: https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40793520906
- 52 testes aprovados, 0 falhas, cobrindo autenticação/Hotmart, recuperação, avisos e URLs seguras.
- Neon TEST `br-sweet-waterfall-b7ry8jlw`: tables de cadastro, aceites, Hotmart e expiração confirmadas por consultas somente leitura.
- Deployment Preview `dpl_HGEEGFLY4gxn2Ub8jY79ZWZg2849` no commit `d1040a7` ficou READY. Os novos ajustes precisam de um deployment posterior à incorporação.
- Validação HTTP/browser da Preview ainda inconclusiva por proteção de autenticação e timeouts da ferramenta remota. Não afirmar E2E real.

## Critérios pendentes
- Verificar em runtime a ligação da Preview à branch Neon de TESTE (só a variável escopada foi confirmada).
- Configurar Turnstile, SMTP de homologação autorizado e executar cadastro/recuperação E2E sem contas produtivas.
- Confirmar um endereço de Production acessível **antes** de configurar `BC_PUBLIC_APP_URL` ou enviar links a alunos reais.
- Hotmart LIVE em Production continua sob revisão e sem novos testes pagos.
- Manter PR de lançamento #187 em draft; sem alterar `main`, dados reais, pagamentos nem assinaturas.
