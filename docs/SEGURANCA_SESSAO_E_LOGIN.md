# Sessão revogada e limite de login — itens 4, 8 e 9 do plano de ação

Branch: `fix/seguranca-sessao-login-deps`. Nada aqui foi publicado nem aplicado em produção.

## Item 4 — Revogação de sessão no middleware

**Problema:** `middleware.js` aceitava o cookie assinado até vencer (2 h, ou 30 dias com
"manter conectado"). Conta desativada, rebaixada ou com senha trocada continuava abrindo
páginas e arquivos; só as APIs (`lib/auth.js`) conferiam o banco.

**Agora:** `lib/session-guard.js` confere `active`, `role` e `session_version` no banco.

| Regra | Valor |
|---|---|
| Prazo máximo para a revogação valer | **30 s** por instância do middleware (cache em memória) |
| Consultas por rajada de arquivos | 1 por aluno (pedidos simultâneos compartilham a consulta) |
| Banco fora do ar, com resultado anterior | vale por até **5 min**, depois recusa |
| Banco fora do ar, sem resultado anterior | **503** com `Retry-After: 15` (nunca libera; não é redirecionamento, então o service worker não guarda nada) |
| Papel usado em `/usuarios.html` e `/update-central.html` | o do **banco**, não o do cookie |
| Sessão revogada | 302 para `/login.html` e cookie apagado |

`api/users.js` já incrementava `session_version` ao mudar papel, desativar ou resetar senha;
nenhuma mudança foi necessária ali. O visitante da Prévia continua sem tocar o banco
(`tests/session-revocation-preview-unit.mjs`).

Ajuste: `GUARD_TTL_MS` e `GUARD_STALE_MS` em `lib/session-guard.js`.

## Item 8 — Alerta do `npm audit` (Zod)

Cadeia: `@vercel/functions` → `@vercel/oidc` → `@vercel/cli-config` → `zod@4.1.11` (versão
exata). Mesmo a versão mais nova de `@vercel/cli-config` (0.3.3) fixa o 4.1.11, então
atualizar não resolve. Foi adicionado `"overrides": { "zod": "4.6.7" }` (mesma major).
O downgrade sugerido por `npm audit fix --force` **não** foi usado. `npm audit`: 0 vulnerabilidades.

**Rever quando** `@vercel/cli-config` passar a pedir um zod corrigido: o `overrides` pode sair.

## Item 9 — Limite de tentativas de login

**Problema:** 5 erros trancavam a **conta** por 10 min. Qualquer pessoa podia travar um aluno
de propósito, e quem testava muitas contas de uma mesma rede nunca era limitado.

**Agora** (`lib/login-throttle.js`, janelas fixas de 15 min que expiram sozinhas):

| Limite | Efeito |
|---|---|
| 20 falhas por IP | bloqueia aquela rede (todas as contas) |
| 5 falhas por conta + IP | bloqueia só aquele par; o aluno em outra rede segue entrando |
| 30 falhas na conta, vindas de qualquer rede | aceita só redes **conhecidas** (já entraram com sucesso nos últimos 30 dias) |

- A resposta é `429` com `Retry-After` e mensagem genérica; o antigo "a conta foi bloqueada"
  (que revelava que o e-mail existe) saiu. E-mail inexistente conta como falha igual.
- Só hashes (HMAC com `AUTH_SECRET`) são gravados — nunca e-mail ou IP em claro. IPv6 é
  reduzido ao prefixo /64.
- Se a tabela de controle falhar, o login continua (falha aberta) e o erro vai para o log.
- Colunas `failed_attempts` e `locked_until` ficam sem uso (não foram removidas).

### Mudança de esquema (precisa de autorização antes do merge)

O código cria a tabela sozinho no primeiro login após o deploy, uma vez por instância
(`CREATE TABLE IF NOT EXISTS`), no mesmo padrão de `ensureUsersTable`. Para criá-la
antes, de forma controlada:

```sql
CREATE TABLE IF NOT EXISTS central_login_throttle (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL,
  window_start TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Atenção com Prévias:** `docs/PREVIEW_ACCESS.md` avisa que `DATABASE_URL` pode ser o banco de
produção também em Preview. Um login real feito numa prévia desta branch criaria essa tabela
e gravaria contadores no banco de produção. O link de visitante não faz isso (APIs bloqueadas).

## Riscos que continuam

- **Rede compartilhada (campus, república):** quem erra a senha de um colega na mesma rede
  pode bloqueá-lo naquele IP por 15 min, repetidamente. Não vira bloqueio da conta.
- **Durante um ataque distribuído (30+ redes):** o dono da conta numa rede nova espera a janela
  (até 15 min). Solução completa exige CAPTCHA ou verificação por e-mail — fora deste escopo.
- **Cookie "manter conectado" (30 dias)** segue existindo; agora é revogável em até 30 s.
- O IP vem de `x-vercel-forwarded-for` / `x-real-ip` / `x-forwarded-for`, que a Vercel
  sobrescreve. Se a hospedagem mudar, `clientIp()` precisa ser revisto.
- Um segundo limitador por conta ainda não existe para `POST /api/auth?action=bootstrap`
  (protegido só por `BACKUP_SECRET`).

## O que foi e o que NÃO foi verificado

Verificado: testes unitários (`session-revocation-unit`, `session-revocation-preview-unit`,
`login-throttle-unit`), incluindo o middleware e o handler reais contra um Neon simulado; os
testes novos **falham** contra o `middleware.js` e o `api/auth.js` originais; o SQL do
limitador foi executado em um Postgres real (PGlite) fora do repositório; o middleware empacota
para Edge sem módulos do Node.

**Não verificado:** build e execução reais na Vercel (Edge), consulta ao Neon de verdade, login
com conta fictícia no navegador e o comportamento do service worker/PWA. Isso depende de um
ambiente de homologação com banco isolado (item 12 do plano). A Prévia "sem login" **não**
exercita estas mudanças: o visitante não passa pelo guard nem pelo login.
