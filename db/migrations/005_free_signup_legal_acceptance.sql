-- BASE COMPLETA - ETAPA 2.17: declaração de maioridade e aceite de Termos.
-- PRE-LANCAMENTO: a versão V24 é MINUTA, nao representa aprovacao juridica.
-- Aplicar somente na branch isolada do Neon TEST apos revisao; nunca autonomamente na Production.
-- Requer previamente a migracao 004_public_free_signup.sql.
BEGIN;
ALTER TABLE public.central_free_signup_pending
  ADD COLUMN IF NOT EXISTS age_declared_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS terms_accepted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS terms_version TEXT;

-- Registro permanente associado a conta, nunca apenas um checkbox de interface.
-- Um registro por usuario/versao permite documentar uma futura revisão dos Termos.
CREATE TABLE IF NOT EXISTS public.central_free_signup_legal_acceptances (
  user_id TEXT NOT NULL REFERENCES public.central_users(user_id) ON DELETE CASCADE,
  terms_version TEXT NOT NULL CHECK (length(terms_version) BETWEEN 4 AND 90),
  terms_accepted_at TIMESTAMPTZ NOT NULL,
  age_declared_at TIMESTAMPTZ NOT NULL,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, terms_version)
);
CREATE INDEX IF NOT EXISTS central_free_signup_legal_acceptances_recorded_idx
  ON public.central_free_signup_legal_acceptances(recorded_at);

-- Pendencias antigas sem declaracao/aceite permanecem no banco apenas ate expirar:
-- a confirmacao da nova versao do backend recusa usá-las.
COMMIT;
