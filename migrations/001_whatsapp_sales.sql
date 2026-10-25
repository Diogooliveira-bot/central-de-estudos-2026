-- RASCUNHO NÃO EXECUTADO. Executar apenas em uma branch Neon de teste, após revisão.
CREATE TABLE IF NOT EXISTS whatsapp_sales_events (
  message_id TEXT PRIMARY KEY,
  state TEXT NOT NULL CHECK (state IN ('processing', 'completed', 'failed')),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS whatsapp_sales_conversations (
  contact_hash TEXT PRIMARY KEY,
  context_ciphertext TEXT NOT NULL DEFAULT '',
  context_iv TEXT NOT NULL DEFAULT '',
  context_tag TEXT NOT NULL DEFAULT '',
  message_count INTEGER NOT NULL DEFAULT 0,
  day_started_at DATE NOT NULL DEFAULT CURRENT_DATE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS whatsapp_sales_usage (
  usage_day DATE PRIMARY KEY DEFAULT CURRENT_DATE,
  claude_calls INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS whatsapp_sales_opt_out (
  contact_hash TEXT PRIMARY KEY,
  opted_out_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS whatsapp_sales_conversations_expiry_idx
  ON whatsapp_sales_conversations (expires_at);
