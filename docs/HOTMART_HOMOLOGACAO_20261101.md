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
| `tests/hotmart-pg-scenarios.mjs` (18 jornadas, PostgreSQL 17 real via PGlite, migrações 001–008, handlers reais) | 18/18 ✅ local e no CI. **Antes das correções: 12/17** (falhas = itens 1, 3, 4, 5). |
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

## Auditoria do painel Hotmart (somente leitura, 01/11, sessão do proprietário)

- ⚠️ Produto 8805543 com **"Vendas ativas" LIGADO** (não é mais rascunho) e webhook de Production ativo. Nenhuma venda real até agora.
- Ofertas: `o4y1mlg9` "Base Completa Premium — Semestral" R$ 97,00; `gh4ajvj1` com nome **"Preço base"** R$ 179,00 (nome não informa "Anual 12 meses"). Ambas parceladas com juros pagos pelo cliente; **conversão de moeda ativa** (compra em moeda ≠ BRL não libera e gera alerta). Reembolso: 7 dias.
- Webhook "Base Completa — Teste de pagamentos": ativo, versão 2.0.0, produto 8805543, URL `https://central-de-estudos-ecru.vercel.app/api/hotmart-webhook` (alias de Production). Eventos: compra aprovada, completa, cancelada, reembolsada, expirada, chargeback e cancelamento de assinatura — **lacuna da Issue #193 já resolvida**.
- Histórico: só eventos de teste oficial (transação `HP16015479281022`, produto de teste), 25/10 e 30/10, todos **200 - Processado** ⇒ o HOTTOK da Hotmart confere com o de Production.
- Pendente: links de checkout, textos públicos, termos e e-mail de suporte no checkout (página de links não carregou).

## Execução aprovada pelo proprietário (02/11/2026, Fortaleza)

- ✅ **Neon TEST** `br-sweet-waterfall-b7ry8jlw`: migração 008 aplicada com trava de branch; jornada SQL sintética **10/10** (aprovação 6m, duplicidade, recompra +12m, reembolso parcial, chargeback, reaprovação ignorada, fora de ordem, Pix expirado, progresso preservado, convite + reprocessamento, fuso). Transação de referência `SYNTH-efa6bb1d…`; contas sintéticas desativadas.
- ✅ **Backup Production**: branch `backup/pre-008-hotmart-20261102` = `br-cool-dew-b7rkcgo4` (pai `br-blue-sunset-b7jcts9i`, LSN 0/24EA298).
- ✅ **Migração 008 em Production** (`br-blue-sunset-b7jcts9i`, trava de branch): antes/depois 6 usuários, 5 assinaturas, 0 pedidos; tabela de falhas, função de reprocessamento e 5 funções no fuso de Fortaleza confirmadas.
- ⚠️ **Conversão de moeda**: a Hotmart não permite desligar para preços em BRL. Código ajustado: aprovação em outra moeda libera o plano da oferta (cenário novo, 18/18).
- ⚠️ **Nome da oferta anual**: salvar exige marcar novo aceite sobre recuperador automático/pagamento recorrente; não aceito sem autorização específica — nada alterado. "Descrição na página de pagamento" das ofertas está vazia.
- ❌ **Merge/deploy**: bloqueado (merge dispara Production e precisa ser feito pelo proprietário); Vercel Hobby com limite de deploys ("retry in 24 hours").

## Pós-merge (02/11/2026 06:52–06:56, Fortaleza)

- ✅ PR #209 mergeada (`a40cb57`), deploy Production `dpl_Aw4PRMbuRXjQq3ZivMBbug9hm3NX` READY; sem HOTTOK → 401 em ecru e app.basecompleta.com.br.
- ✅ Teste oficial Hotmart 02/11 06:52: 7 eventos → **200 - Processado**; logs Vercel mostram `product_not_configured` (produto de teste) e `informational_event`, como esperado.
- ❌ **Banco errado nos relatórios**: o registro falhou com `42P01`. A Production usa o Neon `neon-beige-arrow` (`solitary-dust-76502943`), branch `br-gentle-rice-aw5a3i2i` (endpoint ativo às 09:51:44Z, durante o teste), com 12 usuários / 9 alunos ativos / 3 Premium manuais, migrações 002–006, **sem 007 e sem 008**. O projeto `shiny-hall-19564809` (`br-blue-sunset`), tratado como "Production" desde a Missão 03, **não é usado pelo app** — a 008 aplicada lá é inofensiva.
- ⚠️ Backup no banco real bloqueado: limite de 10 branches e de snapshots do plano gratuito. Ponto de restauração PITR registrado: LSN `0/1E6FE470` em 02/11/2026 06:55:34 (retenção de 6 h).
- Impacto enquanto a 008 não estiver no banco real: compras são liberadas/revogadas normalmente (003 presente); ficam sem efeito o registro de falhas (só log Vercel), o reprocessamento pelo painel e o fuso de Fortaleza. A 007 ausente afeta os avisos de vencimento Premium.
