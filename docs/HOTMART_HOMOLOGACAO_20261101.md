# Hotmart → Premium — homologação 01/11/2026 (Fortaleza)

**Veredito: NÃO PRONTA para vender.** A lógica de liberação/revogação está correta e testada em
PostgreSQL real, mas faltam provas que só o painel Hotmart e o Neon permitem (seção "Bloqueios").

Base: `main` 58d9e784 (o mesmo código Hotmart da PR #187 já está em Production). Branch:
`fix/hotmart-homologacao-20261101`, PR #209 (draft, sem merge, sem deploy em Production).

## Estado encontrado

| Item | Evidência |
| --- | --- |
| ⚠️ Webhook de **Production já armado** | `POST https://app.basecompleta.com.br/api/hotmart-webhook` e `…ecru.vercel.app…` sem HOTTOK → **401 "Notificação não autorizada"** (o handler só responde isso com `VERCEL_ENV=production` + `HOTMART_LIVE_ENABLED=true` + HOTTOK/produto/ofertas válidos). `vercel env ls production`: `HOTMART_LIVE_ENABLED`, `HOTMART_HOTTOK`, `HOTMART_PRODUCT_ID`, `HOTMART_OFFER_6M/12M_CODE` criados há 7 dias. Produto 8805543 em rascunho ⇒ sem vendas reais possíveis; nenhum dado foi alterado. |
| ✅ `ecru.vercel.app` hoje é alias de **Production** (não Preview antiga) | `main` redireciona `/login.html` de ecru para `app.basecompleta.com.br`; ambos atendem a mesma Production. |
| ✅ Domínio `app.basecompleta.com.br` resolve | `GET /` → 307 para `/central-v119.html` (antes: DNS misconfigured). |
| ⚠️ Previews protegidas por Vercel Authentication | Qualquer POST para a Preview → 401 `Protected deployment`. A Hotmart **não consegue** notificar uma Preview sem bypass de automação. |
| ✅ Isolamento TEST × Production no código | `assertPreviewDatabaseIsolation` bloqueia a Preview fora do host Neon TEST; Production fecha (503) sem `HOTMART_LIVE_ENABLED`. |
| ✅ E-mail | Gmail SMTP (`@gmail.com`): SPF/DKIM assinados pelo Google. Limite ~500 envios/dia. |

## Problemas encontrados e corrigidos nesta branch

1. **Revogação podia ser recusada (422)**: reembolso/chargeback/cancelamento/expiração exigiam status
   exato (`CANCELLED`, `REFUNDED`…). Com `CANCELED` ou `PARTIALLY_REFUNDED` o aluno **manteria Premium**.
   Agora só a aprovação exige `APPROVED`/BRL.
2. **Venda silenciosamente não liberada**: oferta/produto/moeda desconhecidos respondiam 200 "ignorado"
   sem registro. Agora ficam em `central_hotmart_webhook_issues` e geram alerta.
3. **Sem registro de falhas nem alerta**: nova tabela (sem e-mail/nome/token/payload) e alerta por e-mail
   (`HOTMART_ALERT_EMAIL` ou o próprio `GMAIL_USER`), no máximo 1 por motivo a cada 30 min.
4. **Sem reprocessamento**: `central_hotmart_reprocess_order` + botão "Reprocessar liberação" e lista de
   falhas em `/vendas-hotmart.html`. Nunca reativa compra estornada.
5. **Prazo em UTC**: funções Hotmart passam a usar `TimeZone=America/Fortaleza` (30/04 22h + 6 meses = 30/10, não 31/10).

## Regras de negócio (testadas)

Semestral = 6 meses, Anual = 12 meses a partir do recebimento da aprovação · recompra antes do vencimento
**soma** ao prazo restante · depois de vencido recomeça do zero · reembolso de uma de duas compras retira só
o tempo dela · reembolso/chargeback antes da aprovação impede liberação futura daquela transação ·
Pix/boleto pendente (`BILLET_PRINTED`, `DELAYED`) e expirado não liberam · e-mail da compra diferente do
cadastro ⇒ convite para o e-mail da compra (a conta antiga continua Gratuita; unificar é manual) ·
conta de equipe/inativa/Premium manual ⇒ revisão manual com alerta.

## Testes

| Suíte | Resultado |
| --- | --- |
| `tests/hotmart-pg-scenarios.mjs` (17 jornadas, PostgreSQL 17 real via PGlite, migrações 001–008, handlers reais) | 17/17 ✅ local e no CI. **Antes das correções: 12/17** (falhas = itens 1, 3, 4, 5). |
| `tests/hotmart-webhook-unit.mjs` | 15/15 ✅ |
| Regressão focada do CI (`focused-regression`) | 142/142 ✅ |
| `test:premium-and-auth` | 27 + 18 ✅ |
| `npm test` | 190/191 — a falha (`cf-m08-m15-apostilas-unit`) é idêntica na `main` sem estas mudanças. |
| CI da PR #209 | 6/6 ✅ (focused-regression, commercial-browser, penal-v3, pwa-navigation, Vercel, comments) |
| Revisão independente (script novo, estado bruto das tabelas) | duplicidade, reembolso, chargeback, vencimento ±1 s ✅; mutações "sem deduplicação" e "sem revogação" **detectadas**. |
| Hospedado (Preview da branch) | Bloqueado na proteção Vercel (401) antes do handler — ver Bloqueios. |
| Production (somente leitura) | Sem HOTTOK → 401 ✅. Nenhum evento enviado. |

## Bloqueios (sem eles não há GO)

1. **Painel Hotmart sem sessão** (navegador embutido na tela de login; Claude in Chrome desconectado):
   não foi possível conferir preços (doc antiga cita Anual **R$ 194** × referência R$ 179), modalidade,
   parcelamento, checkout, garantia/termos, URL/eventos/versão do webhook nem disparar o teste oficial.
2. **Neon sem sessão**: migração 008 não aplicada no TEST nem em Production; sem consulta ao inbox.
3. **Proteção de Preview**: para a Hotmart notificar a homologação é preciso bypass de automação.

## Plano preparado para Production (executar só após "aprovo")

1. **Backup**: Neon → branch `pre-008-<data>` a partir da Production. Reversão: restaurar/resetar para ela.
2. **Migração 008** na Production (aditiva; não altera linhas). Reversão no cabeçalho do arquivo.
3. **Merge da PR #209** → deploy automático. Reversão: Vercel *Instant Rollback* para `dpl_5CQfeX5GZEkDzkCSQFhi39e6fMki` (Production atual) ou `git revert`.
4. **Webhook Hotmart** (versão 2.0.0, produto 8805543): URL `https://app.basecompleta.com.br/api/hotmart-webhook`;
   eventos Compra aprovada, reembolsada, chargeback, cancelada, expirada (+ boleto impresso, atrasada e
   protesto só para registro). HOTTOK do painel = `HOTMART_HOTTOK` de Production. Reversão: desativar o webhook.
5. **Smoke**: teste oficial da Hotmart → 200; `/vendas-hotmart.html` sem falhas abertas; checkout só depois.
