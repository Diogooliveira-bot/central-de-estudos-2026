-- Base Completa — hardening de autenticação, auditoria administrativa e funções sensíveis.
-- Migração aditiva: não altera usuários, assinaturas, conteúdo ou limites comerciais.
BEGIN;

CREATE TABLE IF NOT EXISTS public.central_auth_rate_limits (
  identity_hash TEXT PRIMARY KEY,
  scope TEXT NOT NULL CHECK (scope IN ('login-email','login-ip')),
  window_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  attempt_count INTEGER NOT NULL DEFAULT 1 CHECK (attempt_count > 0),
  last_attempt_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS central_auth_rate_limits_last_attempt_idx
  ON public.central_auth_rate_limits(last_attempt_at);

CREATE TABLE IF NOT EXISTS public.central_admin_security_audit (
  audit_id BIGSERIAL PRIMARY KEY,
  actor_user_id TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN (
    'user_created','user_updated','student_deleted','password_reset'
  )),
  target_user_id TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS central_admin_security_audit_created_idx
  ON public.central_admin_security_audit(created_at DESC);
CREATE INDEX IF NOT EXISTS central_admin_security_audit_actor_idx
  ON public.central_admin_security_audit(actor_user_id,created_at DESC);

-- Funções PostgreSQL recebem EXECUTE de PUBLIC por padrão. A aplicação usa a
-- credencial privada do servidor; a função de quota não deve ficar disponível
-- a qualquer role que futuramente ganhe conexão com o banco.
REVOKE ALL ON FUNCTION public.central_claim_questao(TEXT, TEXT) FROM PUBLIC;

REVOKE UPDATE, DELETE, TRUNCATE ON public.central_admin_security_audit FROM PUBLIC;
REVOKE ALL ON public.central_auth_rate_limits FROM PUBLIC;

COMMIT;
