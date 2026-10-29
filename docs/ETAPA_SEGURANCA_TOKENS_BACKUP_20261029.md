# Base Completa — auditoria de tokens, replay e backup

**Data:** 29/10/2026 · **Branch:** `integration/lancamento-base-completa-20261028` · **PR:** #187 (draft). **Escopo:** avançar sem o Work e sem a Hotmart. Nenhuma alteração em Production, Neon `main` ou `main` GitHub.

## 1. Código de segurança inspecionado

### Cadastro gratuito

- `lib/free-signup-handler.js`: token de confirmação é aleatório (32 bytes), gravado somente como SHA-256; validade 30 minutos; confirmação usa **uma única transação SQL com `DELETE ... RETURNING`** condicionada a hash, vencimento, maioridade e versão dos Termos.
- O resultado só cria o aluno e atribui **plano Gratuito** quando o token é consumido; uma segunda confirmação retorna HTTP 410, e tokens malformados são rejeitados antes do SQL.
- Limites por e-mail/IP persistem no Neon, e há proteção Turnstile no cadastro em Preview.
- Production permanece **fail-closed** enquanto a versão dos Termos contiver `draft`; essa guarda NÃO deve ser removida até a versão legal definitiva.

### Recuperação de senha

- `lib/password-reset.js`: 32 bytes aleatórios e SHA-256, validade 30 minutos; exige `delivery_status='sent'`, `used_at IS NULL`, conta ativa e função de recuperação.
- `WITH claimed AS (UPDATE ... RETURNING)` consome o token atomically; a alteração de senha incrementa `session_version`, invalidando sessões anteriores, e o serviço invalida outros tokens pendentes da conta.
- Os testes de regressão agora podem injetar SQL fictício **apenas na função `confirmReset`** para exercitar tentativas repetidas, sem alterar o caminho padrão de produção.

## 2. Alterações realmente executadas (somente branch da PR)

1. `lib/password-reset.js` — exportação de `confirmReset` com dependências opcionais injetáveis; os defaults continuam `database`, `ensureUsersTable` e `ensurePasswordResetTables`. Commit `ce9c2574d3bc3591cf04eabbd16796d6fbd26ae7`.
2. `tests/password-reset-unit.mjs` — dois cenários: uso único seguido de segundo uso (HTTP 410 sem novo hash de senha/sessão) e token inválido/expirado (HTTP 410). Commit `59df79c94b2c629bd93a66cffa5dabdad2319ff1`.
3. `tests/public-free-signup-4-5-unit.mjs` — dois cenários: confirmação em duplicidade (HTTP 410 sem segundo usuário/plano) e token inválido/expirado (HTTP 410). Commit `14d3d11be9659e9e982c21260c2c5d391c70c992`.
4. **Evidência de execução real de CI:** workflow `Lancamento Base Completa - integracao controlada`, run `40889280334`, job `focused-regression` `123501341590` concluiu **107 testes / 107 aprovados / 0 falhas**. Os quatro novos testes aparecem nominalmente como **ok 37, ok 38, ok 72 e ok 73** no log. Testes de código com **SQL simulado**, não comprovação de tentativa real com banco TEST.

## 3. Verificação somente leitura do Neon

- Projeto `shiny-hall-19564809`, branch produtiva original `main` = `br-blue-sunset-b7jcts9i`: `primary=true`, `default=true`, permanece com proteções `vercel production branch`.
- Leitura agregada de `main`: **6 usuários**, tabela de resets existente, **2 registros de recuperação usados**. A tabela de cadastro público da integração (`public.central_free_signup_pending`) **ainda não existe em `main`**, esperado enquanto a PR não for mesclada. Não inspecionar segredos, e-mails, telefones, CPFs ou hashes.
- Branch TEST = `br-sweet-waterfall-b7ry8jlw`: **10 usuários sintéticos/de homologação**, **4 solicitações de reset**, das quais **3 usadas** e **1 vencida sem uso**; **0 cadastros gratuitos pendentes** no momento da leitura. Não equiparar esses contadores a um teste de replay controlado.
- Snapshot Production existente: `snap-red-lake-b7ytcuk2` (criado em **28/10/2026 17:26:34 UTC**; expira em **04/11/2026 23:59:59 UTC**). Snapshot manual. **Não foi feito teste de restauração desta cópia nem comprovada rotina automática de novos snapshots.** Criar novo backup verificado imediatamente antes de qualquer GO de lançamento, sem substituir ou apagar o existente.

## 4. Gates ainda pendentes

| Gate | Estado |
|---|---|
| Testes unitários negativos de tokens (4 novos testes) | **APROVADO** |
| Replay real de token contra Neon TEST via Preview hospedada | **PENDENTE** (não afirmar E2E) |
| Token concorrente, brute force/rate limit em ambiente hospedado e sessão invalidada após reset | **PENDENTE de E2E** |
| Atualização coordenada de versão final de Termos no backend/formulário | **PENDENTE de aprovação jurídica** |
| Teste de restauração e nova cópia validada antes do lançamento | **PENDENTE** |
| Hotmart, domínio próprio e venda pública | **FORA DE ESCOPO DESTA RODADA** |

**Decisão:** continuar **NO-GO** para mesclar/ativar Production; não reexecutar etapas previamente confirmadas pelo proprietário. Este checkpoint é evidência técnica, não certificação de segurança absoluta.
