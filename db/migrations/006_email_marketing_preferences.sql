-- Base Completa - Etapa 2.18: preferencia opcional de marketing por E-MAIL.
-- Somente Neon TEST. Aplicar apos as migracoes 004 e 005.
-- NUNCA aplicar automaticamente em producao.
BEGIN;
ALTER TABLE public.central_free_signup_pending
  ADD COLUMN IF NOT EXISTS email_marketing_opt_in BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS email_marketing_notice_version TEXT;
ALTER TABLE public.central_free_signup_contacts
  ADD COLUMN IF NOT EXISTS email_marketing_opt_in BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS email_marketing_consent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS email_marketing_notice_version TEXT,
  ADD COLUMN IF NOT EXISTS email_marketing_revoked_at TIMESTAMPTZ;
-- Histórico de aceite é mantido em caso de revogação para auditoria.
-- A condição de envio de marketing é SEMPRE email_marketing_opt_in=TRUE.
-- WhatsApp continua governado exclusivamente por marketing_opt_in.
ALTER TABLE public.central_free_signup_contacts
  ADD CONSTRAINT central_email_marketing_opt_in_requires_notice
  CHECK (
    email_marketing_opt_in=FALSE
    OR (email_marketing_consent_at IS NOT NULL
        AND email_marketing_notice_version IS NOT NULL)
  );
COMMIT;
