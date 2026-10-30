-- Base Completa / Hotmart 2.0: customer purchases and atomic provisioning.
-- DO NOT run on Neon production until verified live events and cutover approval.
-- Idempotent extension of 002; does not insert buyers or activate any plan on migration.
BEGIN;
-- Compatibilidade com reexecucao: somente ampliar a restricao antiga,
-- sem removê-la em uma segunda passagem, e preservar tabelas/linhas existentes.
DO $hotmart_constraints$
DECLARE
  v_grant_check TEXT;
BEGIN
  SELECT pg_get_constraintdef(c.oid) INTO v_grant_check
  FROM pg_constraint c
  WHERE c.conrelid='public.central_user_subscriptions'::regclass
    AND c.conname='central_user_subscriptions_grant_source_check';
  IF v_grant_check IS NULL OR position('hotmart' in lower(v_grant_check))=0 THEN
    ALTER TABLE public.central_user_subscriptions
      DROP CONSTRAINT IF EXISTS central_user_subscriptions_grant_source_check;
    ALTER TABLE public.central_user_subscriptions
      ADD CONSTRAINT central_user_subscriptions_grant_source_check
      CHECK (grant_source IN ('manual','mercadopago','hotmart'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint c
    WHERE c.conrelid='public.central_user_subscriptions'::regclass
      AND c.conname='central_user_subscriptions_hotmart_requires_id'
  ) THEN
    ALTER TABLE public.central_user_subscriptions
      ADD CONSTRAINT central_user_subscriptions_hotmart_requires_id
      CHECK (grant_source <> 'hotmart' OR provider_subscription_id IS NOT NULL);
  END IF;
END
$hotmart_constraints$;

CREATE TABLE IF NOT EXISTS public.central_hotmart_orders (
  transaction_id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  offer_code TEXT NOT NULL,
  access_months SMALLINT NOT NULL CHECK (access_months IN (6,12)),
  buyer_email TEXT NOT NULL,
  buyer_name TEXT NOT NULL DEFAULT '',
  state TEXT NOT NULL CHECK (state IN ('pending','approved','revoked')),
  approved_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  credit_applied BOOLEAN NOT NULL DEFAULT FALSE,
  user_id TEXT REFERENCES public.central_users(user_id) ON DELETE SET NULL,
  subscription_id TEXT REFERENCES public.central_user_subscriptions(subscription_id) ON DELETE SET NULL,
  claim_token_hash TEXT UNIQUE,
  claim_expires_at TIMESTAMPTZ,
  claim_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (credit_applied = FALSE OR (user_id IS NOT NULL AND subscription_id IS NOT NULL))
);
CREATE INDEX IF NOT EXISTS central_hotmart_orders_buyer_idx
  ON public.central_hotmart_orders(lower(buyer_email), created_at DESC);
CREATE INDEX IF NOT EXISTS central_hotmart_orders_sub_idx
  ON public.central_hotmart_orders(subscription_id)
  WHERE subscription_id IS NOT NULL;

-- Called only from the authenticated webhook or the one-time verified e-mail claim.
-- Locks the existing account before changing its single active subscription.
CREATE OR REPLACE FUNCTION public.central_hotmart_activate_order(p_transaction TEXT,p_user_id TEXT)
RETURNS TEXT LANGUAGE plpgsql SET search_path = public,pg_temp AS $fn$
DECLARE
  v_order public.central_hotmart_orders%ROWTYPE;
  v_user public.central_users%ROWTYPE;
  v_current public.central_user_subscriptions%ROWTYPE;
  v_premium public.central_user_subscriptions%ROWTYPE;
  v_subscription TEXT;
  v_new_end TIMESTAMPTZ;
BEGIN
  SELECT * INTO v_order FROM public.central_hotmart_orders
   WHERE transaction_id=p_transaction FOR UPDATE;
  IF NOT FOUND OR v_order.state <> 'approved' THEN RETURN 'not_approved'; END IF;
  IF v_order.credit_applied THEN RETURN 'already_applied'; END IF;

  SELECT * INTO v_user FROM public.central_users WHERE user_id=p_user_id FOR UPDATE;
  IF NOT FOUND OR v_user.role <> 'aluno' OR v_user.active IS DISTINCT FROM TRUE
     OR lower(v_user.email) <> v_order.buyer_email THEN
    RETURN 'manual_review';
  END IF;
  SELECT * INTO v_current FROM public.central_user_subscriptions
   WHERE user_id=p_user_id AND status='active'
   ORDER BY created_at DESC LIMIT 1 FOR UPDATE;
  SELECT * INTO v_premium FROM public.central_user_subscriptions
   WHERE user_id=p_user_id AND plan_code='premium'
     AND status IN ('active','cancelled') AND ends_at > NOW()
   ORDER BY ends_at DESC LIMIT 1 FOR UPDATE;

  -- Never overwrite paid manual entitlements or undo a staff cancellation.
  IF v_premium.subscription_id IS NOT NULL AND
    (v_premium.grant_source <> 'hotmart' OR v_premium.status = 'cancelled') THEN
    RETURN 'manual_review';
  END IF;
  IF v_premium.subscription_id IS NOT NULL THEN
    v_subscription := v_premium.subscription_id;
    UPDATE public.central_user_subscriptions
       SET ends_at = ends_at + make_interval(months=>v_order.access_months),
           updated_at=NOW()
     WHERE subscription_id=v_subscription;
  ELSE
    -- An old plan (including an expired Premium) must not block a paid one.
    UPDATE public.central_user_subscriptions
       SET status='expired',updated_at=NOW()
     WHERE user_id=p_user_id AND status='active';
    v_subscription := gen_random_uuid()::text;
    v_new_end := NOW() + make_interval(months=>v_order.access_months);
    INSERT INTO public.central_user_subscriptions
      (subscription_id,user_id,plan_code,status,starts_at,ends_at,
       grant_source,provider_subscription_id)
    VALUES(v_subscription,p_user_id,'premium','active',NOW(),v_new_end,
           'hotmart',p_transaction);
  END IF;
  UPDATE public.central_hotmart_orders SET user_id=p_user_id,
    subscription_id=v_subscription,credit_applied=TRUE,
    claim_token_hash=NULL,claim_expires_at=NULL,updated_at=NOW()
   WHERE transaction_id=p_transaction;
  INSERT INTO public.central_user_plan_audit
    (user_id,subscription_id,action,new_plan_code,new_status,metadata)
  VALUES(p_user_id,v_subscription,'hotmart_purchase','premium','active',
         jsonb_build_object('transaction_id',p_transaction,
                            'access_months',v_order.access_months));
  RETURN 'applied';
END $fn$;

CREATE OR REPLACE FUNCTION public.central_hotmart_revoke_order(p_transaction TEXT)
RETURNS TEXT LANGUAGE plpgsql SET search_path = public,pg_temp AS $fn$
DECLARE
  v_order public.central_hotmart_orders%ROWTYPE;
  v_sub public.central_user_subscriptions%ROWTYPE;
  v_end TIMESTAMPTZ;
BEGIN
  SELECT * INTO v_order FROM public.central_hotmart_orders
   WHERE transaction_id=p_transaction FOR UPDATE;
  IF NOT FOUND OR v_order.credit_applied IS DISTINCT FROM TRUE THEN
    RETURN 'no_entitlement';
  END IF;
  IF v_order.user_id IS NOT NULL THEN
    PERFORM 1 FROM public.central_users WHERE user_id=v_order.user_id FOR UPDATE;
  END IF;
  SELECT * INTO v_sub FROM public.central_user_subscriptions
   WHERE subscription_id=v_order.subscription_id FOR UPDATE;
  IF FOUND AND v_sub.grant_source='hotmart' AND v_sub.status IN ('active','cancelled') THEN
    v_end := v_sub.ends_at - make_interval(months=>v_order.access_months);
    IF v_end <= NOW() THEN
      UPDATE public.central_user_subscriptions
        SET status='expired', ends_at=GREATEST(NOW(),starts_at+INTERVAL '1 second'),
            updated_at=NOW() WHERE subscription_id=v_sub.subscription_id;
    ELSE
      UPDATE public.central_user_subscriptions SET ends_at=v_end,updated_at=NOW()
       WHERE subscription_id=v_sub.subscription_id;
    END IF;
    INSERT INTO public.central_user_plan_audit
      (user_id,subscription_id,action,old_plan_code,new_plan_code,old_status,new_status,metadata)
    VALUES(v_order.user_id,v_sub.subscription_id,'hotmart_revoked',
      'premium','premium',v_sub.status,
      CASE WHEN v_end<=NOW() THEN 'expired' ELSE 'active' END,
      jsonb_build_object('transaction_id',p_transaction,
                         'access_months',v_order.access_months));
  END IF;
  UPDATE public.central_hotmart_orders SET credit_applied=FALSE,updated_at=NOW()
   WHERE transaction_id=p_transaction;
  RETURN 'revoked';
END $fn$;

-- Receives only verified Hottok events; atomically deduplicates and reconciles.
-- Refund/chargeback/cancel tombstones always prevail over later approvals.
CREATE OR REPLACE FUNCTION public.central_hotmart_apply_event(
 p_event_id TEXT,p_event_name TEXT,p_transaction TEXT,p_product TEXT,
 p_offer TEXT,p_months SMALLINT,p_email TEXT,p_name TEXT,
 p_created_at TIMESTAMPTZ,p_claim_hash TEXT,p_claim_expiry TIMESTAMPTZ
) RETURNS TABLE(outcome TEXT,should_send_email BOOLEAN,recipient_email TEXT)
LANGUAGE plpgsql SET search_path = public,pg_temp AS $fn$
DECLARE
  v_row public.central_hotmart_orders%ROWTYPE;
  v_uid TEXT;
  v_role TEXT;
  v_active BOOLEAN;
  v_action TEXT;
  v_inserted TEXT;
  v_revoked BOOLEAN;
BEGIN
  PERFORM pg_advisory_xact_lock(hashtextextended(p_transaction,105));
  INSERT INTO public.central_hotmart_webhook_inbox
      (event_id,event_name,transaction_id,product_id,offer_code,
       access_months,buyer_email,hotmart_created_at,processing_state)
  VALUES (p_event_id,p_event_name,p_transaction,p_product,p_offer,p_months,
          p_email,p_created_at,'processed')
  ON CONFLICT(event_id) DO NOTHING RETURNING event_id INTO v_inserted;

  IF v_inserted IS NULL AND EXISTS (
    SELECT 1 FROM public.central_hotmart_webhook_inbox
    WHERE event_id=p_event_id AND transaction_id<>p_transaction
  ) THEN
    RAISE EXCEPTION 'ID de evento já associado a outra transação'
      USING ERRCODE='22023';
  END IF;

  SELECT * INTO v_row FROM public.central_hotmart_orders
   WHERE transaction_id=p_transaction FOR UPDATE;
  IF FOUND AND (v_row.product_id<>p_product OR v_row.offer_code<>p_offer
     OR v_row.access_months<>p_months
     OR (p_email<>'' AND v_row.buyer_email<>'' AND v_row.buyer_email<>p_email)) THEN
    RAISE EXCEPTION 'Metadados de transação divergentes' USING ERRCODE='22023';
  END IF;

  v_revoked := p_event_name IN
    ('PURCHASE_REFUNDED','PURCHASE_CHARGEBACK','PURCHASE_CANCELED','PURCHASE_EXPIRED');

  IF NOT FOUND THEN
    INSERT INTO public.central_hotmart_orders
      (transaction_id,product_id,offer_code,access_months,buyer_email,buyer_name,
       state,approved_at,revoked_at)
    VALUES(p_transaction,p_product,p_offer,p_months,p_email,p_name,
       CASE WHEN v_revoked THEN 'revoked' ELSE 'approved' END,
       CASE WHEN v_revoked THEN NULL ELSE NOW() END,
       CASE WHEN v_revoked THEN NOW() ELSE NULL END);
    SELECT * INTO v_row FROM public.central_hotmart_orders
       WHERE transaction_id=p_transaction FOR UPDATE;
  END IF;

  IF v_revoked THEN
    IF v_row.state <> 'revoked' THEN
      UPDATE public.central_hotmart_orders SET state='revoked',
        revoked_at=NOW(),claim_token_hash=NULL,claim_expires_at=NULL,
        updated_at=NOW() WHERE transaction_id=p_transaction;
      PERFORM public.central_hotmart_revoke_order(p_transaction);
    END IF;
    RETURN QUERY SELECT 'revoked'::TEXT,FALSE,NULL::TEXT;
    RETURN;
  END IF;

  IF v_row.state='revoked' THEN
    RETURN QUERY SELECT 'ignored_after_reversal'::TEXT,FALSE,NULL::TEXT;
    RETURN;
  END IF;

  IF v_row.credit_applied THEN
    RETURN QUERY SELECT 'already_applied'::TEXT,FALSE,NULL::TEXT;
    RETURN;
  END IF;

  IF v_row.buyer_email='' THEN
    RETURN QUERY SELECT 'manual_review'::TEXT,FALSE,NULL::TEXT;
    RETURN;
  END IF;

  SELECT user_id,role,active INTO v_uid,v_role,v_active
   FROM public.central_users WHERE lower(email)=v_row.buyer_email LIMIT 1;
  IF FOUND THEN
    IF v_role='aluno' AND v_active THEN
      v_action := public.central_hotmart_activate_order(p_transaction,v_uid);
      RETURN QUERY SELECT v_action,FALSE,NULL::TEXT;
    ELSE
      RETURN QUERY SELECT 'manual_review'::TEXT,FALSE,NULL::TEXT;
    END IF;
    RETURN;
  END IF;

  -- Only an unattached approved order receives a single-use email claim.
  IF v_row.claim_sent_at IS NULL AND
    (v_row.claim_token_hash IS NULL OR v_row.updated_at < NOW()-INTERVAL '2 minutes')
    AND length(p_claim_hash)=64 THEN
    UPDATE public.central_hotmart_orders SET claim_token_hash=p_claim_hash,
      claim_expires_at=p_claim_expiry,updated_at=NOW()
    WHERE transaction_id=p_transaction;
    RETURN QUERY SELECT 'pending_claim'::TEXT,TRUE,v_row.buyer_email;
    RETURN;
  END IF;
  RETURN QUERY SELECT 'pending_claim'::TEXT,FALSE,NULL::TEXT;
END $fn$;

CREATE OR REPLACE FUNCTION public.central_hotmart_redeem_claim(
 p_claim_hash TEXT,p_user_id TEXT,p_name TEXT,p_password_hash TEXT
) RETURNS TABLE(user_id TEXT,name TEXT,email TEXT,role TEXT,
                active BOOLEAN,session_version INTEGER)
LANGUAGE plpgsql SET search_path=public,pg_temp AS $fn$
DECLARE
  v_order public.central_hotmart_orders%ROWTYPE;
  v_other RECORD;
  v_result TEXT;
BEGIN
  SELECT * INTO v_order FROM public.central_hotmart_orders o
   WHERE o.claim_token_hash=p_claim_hash AND o.claim_expires_at>NOW()
     AND o.state='approved' AND o.user_id IS NULL AND o.credit_applied=FALSE
   FOR UPDATE;
  IF NOT FOUND THEN RETURN; END IF;
  IF EXISTS(SELECT 1 FROM public.central_users WHERE lower(central_users.email)=v_order.buyer_email) THEN
    RAISE EXCEPTION 'O e-mail já possui conta' USING ERRCODE='23505';
  END IF;
  INSERT INTO public.central_users(user_id,name,email,role,password_hash,active)
  VALUES(p_user_id,p_name,v_order.buyer_email,'aluno',p_password_hash,TRUE);

  v_result := public.central_hotmart_activate_order(v_order.transaction_id,p_user_id);
  IF v_result<>'applied' THEN
    RAISE EXCEPTION 'Falha ao liberar o acesso' USING ERRCODE='22023';
  END IF;
  -- Multiple purchases by the same verified email are also applied once.
  FOR v_other IN SELECT transaction_id FROM public.central_hotmart_orders
    WHERE buyer_email=v_order.buyer_email AND state='approved'
      AND credit_applied=FALSE AND transaction_id<>v_order.transaction_id
    ORDER BY created_at,transaction_id
  LOOP
    PERFORM public.central_hotmart_activate_order(v_other.transaction_id,p_user_id);
  END LOOP;
  RETURN QUERY SELECT u.user_id,u.name,u.email,u.role,u.active,u.session_version
    FROM public.central_users u WHERE u.user_id=p_user_id;
END $fn$;

REVOKE ALL ON FUNCTION public.central_hotmart_activate_order(TEXT,TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.central_hotmart_revoke_order(TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.central_hotmart_apply_event(TEXT,TEXT,TEXT,TEXT,TEXT,SMALLINT,TEXT,TEXT,TIMESTAMPTZ,TEXT,TIMESTAMPTZ) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.central_hotmart_redeem_claim(TEXT,TEXT,TEXT,TEXT) FROM PUBLIC;
COMMIT;
