-- Base Completa: Hotmart Webhook 2.0 — caixa de entrada isolada.
-- Executar somente num branch de TESTES Neon. Não concede Premium ou cria contas.
-- A integração de produção ainda precisa conciliação de vendas e ativação segura.
BEGIN;
CREATE TABLE IF NOT EXISTS public.central_hotmart_webhook_inbox (
  event_id TEXT PRIMARY KEY,
  event_name TEXT NOT NULL,
  transaction_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  offer_code TEXT NOT NULL,
  access_months SMALLINT NOT NULL CHECK (access_months IN (6,12)),
  buyer_email TEXT NOT NULL,
  hotmart_created_at TIMESTAMPTZ,
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processing_state TEXT NOT NULL DEFAULT 'awaiting_integration'
    CHECK (processing_state IN ('awaiting_integration','processed','ignored','error'))
);
CREATE INDEX IF NOT EXISTS central_hotmart_webhook_transaction_idx
  ON public.central_hotmart_webhook_inbox(transaction_id, received_at);
COMMIT;
