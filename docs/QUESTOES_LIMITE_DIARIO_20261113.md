# Questões do módulo — limite diário do plano Gratuito (5 por dia)

**Estado:** código publicável a qualquer momento. O limite só **liga** quando a migração 010 é aplicada no banco de Production; antes disso a API funciona como antes (sem limite).

## Regra
- **Gratuito:** até **5 questões distintas por dia** (dia civil em `America/Sao_Paulo`, zera à meia-noite de Brasília).
  Vale para o total do aluno (todas as disciplinas e módulos). Responder de novo a **mesma questão no mesmo dia não gasta cota**.
- **Premium e equipe (admin/editor):** sem limite e sem registro de uso.
- Premium vencido ou cancelado após o período pago volta ao limite do Gratuito.
- O aluno Gratuito continua vendo os enunciados de todas as questões; o **gabarito e o comentário só saem depois de "Responder"**, e só dentro da cota.

## Como funciona (o limite é do servidor, não do navegador)
| Peça | Arquivo |
| --- | --- |
| API | `lib/questoes-handler.js` → `GET /api/questoes?action=modulo|uso`, `POST /api/questoes?action=responder` (rota em `vercel.json` + `api/auth.js`) |
| Cota atômica | função SQL `central_claim_questao` (migração `db/migrations/010_questoes_daily_limit.sql`), com trava por aluno/dia: cliques simultâneos não furam o limite |
| Valor do limite | tabela `central_plan_entitlements`, feature `questoes_modulo` (Gratuito = 5, Premium = sem limite) |
| Cliente | `ui/questoes-bank-v1.js` (chama a API) e `ui/questoes-area-v1.js` (faixa "X de 5", bloqueio da 6ª, mensagens) |
| Arquivos do banco | `content/questoes/<disc>/mNN.js` **não são mais entregues** ao Gratuito (`lib/protected-content.js`): só o servidor os lê. `index.js` e `titulos.js` (sem gabarito) continuam liberados |

## Mudar o limite sem publicar código
```sql
-- exemplo: 10 por dia
UPDATE public.central_plan_entitlements SET daily_limit = 10, updated_at = NOW()
 WHERE plan_code = 'free' AND feature_code = 'questoes_modulo';
-- sem limite no Gratuito: daily_limit = NULL.  Desligar para o Gratuito: enabled = FALSE.
```
O texto da tela e a faixa usam o valor do servidor. Os textos públicos (Termos, vitrine, cadastro) dizem "até 5" e precisam ser atualizados se o número mudar.

## Ordem de publicação
O código tolera a migração ausente: sem a função/tabela da 010, a API **não limita** (comportamento anterior) e registra um aviso no log; depois de aplicada, o limite de 5 vale na hora, sem novo deploy.
1. Merge/deploy do código (seguro com ou sem a migração).
2. **Backup/ponto de restauração** do banco real de Production e aplicação de `010_questoes_daily_limit.sql` (aditiva) no banco **real** — confira a branch Neon antes (ver `docs/HOTMART_HOMOLOGACAO_20261101.md`, seção sobre o banco errado: Production = projeto `neon-beige-arrow`, branch `br-gentle-rice-aw5a3i2i`).
3. Conferir: `SELECT plan_code,enabled,daily_limit FROM central_plan_entitlements WHERE feature_code='questoes_modulo';` → free = 5, premium = NULL; e `SELECT proname FROM pg_proc WHERE proname='central_claim_questao';` → 1 linha.
4. Smoke em Production com conta fictícia Gratuita: responder 5, ver o aviso na 6ª; reabrir o módulo e confirmar que a cota não voltou.

## Reversão
- Rápida (sem código): `UPDATE ... SET daily_limit = NULL` libera o Gratuito sem limite.
- Código: reverter o PR (Instant Rollback da Vercel). A migração não precisa ser desfeita; para remover:
  `DROP FUNCTION public.central_claim_questao(TEXT, TEXT); DROP TABLE public.central_questoes_daily_usage; DELETE FROM public.central_plan_entitlements WHERE feature_code='questoes_modulo';`

## Testes
- `tests/questoes-limit-pg-scenarios.mjs` — 16 cenários em PostgreSQL real (PGlite) com as migrações 001–010 e o handler real: 5/dia, 6ª recusada sem revelar a correção, repetida não gasta, 8 cliques paralelos → exatamente 5, virada de dia, Premium/staff sem limite, Premium vencido, mudança do limite pelo banco, entradas inválidas, origem cruzada, todos os 148 módulos sem gabarito na lista pública.
- `tests/questoes-area-unit.mjs`, `tests/questoes-bank-unit.mjs` — cliente (faixa, bloqueio, modo Foco, erros de rede/sessão).
- `tests/questoes-area-browser.mjs` — Chromium contra o handler real + PGlite (Gratuito bloqueado na 6ª, reabrir não devolve a cota, Premium livre).

## Limitações conhecidas
- O aluno Gratuito vê os **enunciados** de todas as questões (só a correção é limitada).
- O histórico "acertou/errou" fica no aparelho (localStorage); a **cota** fica no servidor e vale entre aparelhos.
- Offline: sem internet não há correção (antes o banco era baixado). A faixa de questões mostra "Sem conexão".
- Informática ainda não tem questões no banco; entra quando houver arquivos em `content/questoes/info/` (o servidor já aceita a disciplina).
