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
