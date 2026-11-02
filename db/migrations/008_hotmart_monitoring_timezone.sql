-- Base Completa / Hotmart: monitoramento de falhas, reprocessamento e fuso.
-- Aditiva e idempotente: não altera pedidos, contas nem assinaturas existentes.
-- Reversão: DROP FUNCTION public.central_hotmart_reprocess_order(TEXT);
--           DROP TABLE public.central_hotmart_webhook_issues;
--           ALTER FUNCTION ... RESET TimeZone (nas quatro funções abaixo).
BEGIN;
-- Somente notificações autenticadas (HOTTOK válido) chegam aqui; sem e-mail,
-- nome, token ou payload do comprador.
CREATE TABLE IF NOT EXISTS public.central_hotmart_webhook_issues (
  id BIGSERIAL PRIMARY KEY,
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  severity TEXT NOT NULL CHECK (severity IN ('info','error')),
  reason TEXT NOT NULL,
  http_status SMALLINT NOT NULL,
  event_id TEXT,
  event_name TEXT,
  transaction_id TEXT,
  offer_code TEXT,
  alerted_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS central_hotmart_webhook_issues_open_idx
  ON public.central_hotmart_webhook_issues(received_at DESC) WHERE resolved_at IS NULL;
CREATE INDEX IF NOT EXISTS central_hotmart_webhook_issues_reason_idx
  ON public.central_hotmart_webhook_issues(reason, alerted_at DESC);

-- Prazos de 6/12 meses contados no calendário de Fortaleza (UTC-3, sem horário de verão).
ALTER FUNCTION public.central_hotmart_activate_order(TEXT,TEXT) SET TimeZone='America/Fortaleza';
ALTER FUNCTION public.central_hotmart_revoke_order(TEXT) SET TimeZone='America/Fortaleza';
ALTER FUNCTION public.central_hotmart_apply_event(TEXT,TEXT,TEXT,TEXT,TEXT,SMALLINT,TEXT,TEXT,TIMESTAMPTZ,TEXT,TIMESTAMPTZ) SET TimeZone='America/Fortaleza';
ALTER FUNCTION public.central_hotmart_redeem_claim(TEXT,TEXT,TEXT,TEXT) SET TimeZone='America/Fortaleza';

-- Reprocessamento manual de uma compra aprovada ainda sem crédito (ex.: revisão
-- manual resolvida, conta criada depois). Nunca reativa compra estornada.
CREATE OR REPLACE FUNCTION public.central_hotmart_reprocess_order(p_transaction TEXT)
RETURNS TABLE(outcome TEXT) LANGUAGE plpgsql
SET search_path = public,pg_temp SET TimeZone='America/Fortaleza' AS $fn$
DECLARE
  v_order public.central_hotmart_orders%ROWTYPE;
  v_uid TEXT;
BEGIN
  PERFORM pg_advisory_xact_lock(hashtextextended(p_transaction,105));
  SELECT * INTO v_order FROM public.central_hotmart_orders
   WHERE transaction_id=p_transaction FOR UPDATE;
  IF NOT FOUND THEN RETURN QUERY SELECT 'not_found'::TEXT; RETURN; END IF;
  IF v_order.state<>'approved' THEN RETURN QUERY SELECT 'not_approved'::TEXT; RETURN; END IF;
  IF v_order.credit_applied THEN RETURN QUERY SELECT 'already_applied'::TEXT; RETURN; END IF;
  SELECT u.user_id INTO v_uid FROM public.central_users u
   WHERE lower(u.email)=v_order.buyer_email LIMIT 1;
  IF v_uid IS NULL THEN RETURN QUERY SELECT 'no_account'::TEXT; RETURN; END IF;
  RETURN QUERY SELECT public.central_hotmart_activate_order(p_transaction,v_uid);
  UPDATE public.central_hotmart_webhook_issues SET resolved_at=NOW()
   WHERE transaction_id=p_transaction AND resolved_at IS NULL
     AND EXISTS(SELECT 1 FROM public.central_hotmart_orders
                 WHERE transaction_id=p_transaction AND credit_applied);
END $fn$;
REVOKE ALL ON FUNCTION public.central_hotmart_reprocess_order(TEXT) FROM PUBLIC;
COMMIT;
