-- ETAPA 4.5: somente aplicar em banco de HOMOLOGACAO, nunca Production sem aprovacao.
CREATE TABLE IF NOT EXISTS public.central_free_signup_pending (
 token_hash TEXT PRIMARY KEY,
 email TEXT NOT NULL UNIQUE,
 name TEXT NOT NULL,
 password_hash TEXT NOT NULL,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 expires_at TIMESTAMPTZ NOT NULL,
 CONSTRAINT central_free_signup_name_length CHECK (length(name) BETWEEN 1 AND 120)
);
CREATE INDEX IF NOT EXISTS central_free_signup_pending_exp ON public.central_free_signup_pending(expires_at);
CREATE TABLE IF NOT EXISTS public.central_free_signup_limits (
 identity_hash TEXT PRIMARY KEY,
 window_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 last_requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 attempt_count INTEGER NOT NULL DEFAULT 1
);
-- Nao alterar tabelas existentes; protecoes Gratuito/Premium permanecem intactas.

CREATE INDEX IF NOT EXISTS central_free_signup_limits_old_idx ON public.central_free_signup_limits(window_start);

-- Campos opcionais: nunca gravar número de telefone em texto puro.
ALTER TABLE public.central_free_signup_pending
 ADD COLUMN IF NOT EXISTS whatsapp_ciphertext TEXT,
 ADD COLUMN IF NOT EXISTS marketing_opt_in BOOLEAN NOT NULL DEFAULT FALSE,
 ADD COLUMN IF NOT EXISTS consent_notice_version TEXT;

-- Preferências comerciais separadas da identidade e da assinatura.
-- Somente com consentimento afirmativo e WhatsApp informado.
CREATE TABLE IF NOT EXISTS public.central_free_signup_contacts (
 user_id TEXT PRIMARY KEY REFERENCES public.central_users(user_id) ON DELETE CASCADE,
 whatsapp_ciphertext TEXT,
 marketing_opt_in BOOLEAN NOT NULL DEFAULT FALSE,
 marketing_consent_at TIMESTAMPTZ,
 consent_notice_version TEXT,
 consent_source TEXT NOT NULL DEFAULT 'free_signup',
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 CHECK (NOT marketing_opt_in OR whatsapp_ciphertext IS NOT NULL),
 CHECK ((marketing_opt_in AND marketing_consent_at IS NOT NULL AND consent_notice_version IS NOT NULL)
         OR (NOT marketing_opt_in AND marketing_consent_at IS NULL))
);
