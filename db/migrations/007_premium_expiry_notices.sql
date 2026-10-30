-- Etapa 2.19: avisos transacionais de vencimento Premium.
-- MIGRACAO ADITIVA, APENAS PROPOSTA. NAO APLICAR EM PRODUCTION SEM HOMOLOGACAO.
-- Requer central_users e central_user_subscriptions (migration 001).
BEGIN;
CREATE TABLE IF NOT EXISTS public.central_premium_expiry_notices (
  notice_id TEXT PRIMARY KEY,
  subscription_id TEXT NOT NULL REFERENCES public.central_user_subscriptions(subscription_id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES public.central_users(user_id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('seven_days','expiry_day')),
  ends_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('sending','sent','failed','skipped')),
  smtp_message_id TEXT,
  error_code TEXT,
  reserved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(subscription_id,kind,ends_at)
);
CREATE INDEX IF NOT EXISTS central_premium_expiry_notices_status_idx
  ON public.central_premium_expiry_notices(status,reserved_at);
COMMENT ON TABLE public.central_premium_expiry_notices IS
  'Idempotencia dos avisos operacionais de vencimento; sem consentimento de marketing nem mensagem publicitaria.';
COMMIT;
