-- Base Completa — Etapa 9: modelo inicial de planos e progresso
-- Alvo pretendido: somente Neon de homologação, projeto soft-dawn-40179120.
-- NÃO EXECUTADO. Revisão humana e autorização explícita são obrigatórias.
-- PostgreSQL / Neon. Não contém segredos, dados de teste ou dados pessoais.
--
-- A migração é aditiva: não atribui planos a usuários existentes, não altera
-- senhas, sessões nem progresso. Em produção, preparar e revisar uma migração
-- própria após backup e comparação do schema; não executar este arquivo às cegas.

BEGIN;

-- 1. Usuários e autenticação: espelha o contrato atual de lib/auth.js.
-- Em uma base existente, CREATE TABLE IF NOT EXISTS não altera a tabela.
CREATE TABLE IF NOT EXISTS public.central_users (
  user_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('admin','editor','aluno')),
  password_hash TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  failed_attempts INTEGER NOT NULL DEFAULT 0,
  locked_until TIMESTAMPTZ,
  last_login TIMESTAMPTZ,
  session_version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Falha de forma explícita se uma central_users preexistente não for compatível.
-- Não adiciona nem altera colunas em uma tabela existente.
DO $schema_check$
DECLARE
  required_column RECORD;
BEGIN
  FOR required_column IN
    SELECT * FROM (VALUES
      ('user_id', 'text'),
      ('name', 'text'),
      ('email', 'text'),
      ('role', 'text'),
      ('password_hash', 'text'),
      ('active', 'boolean'),
      ('session_version', 'integer')
    ) AS required(name, data_type)
  LOOP
    IF NOT EXISTS (
      SELECT 1
      FROM information_schema.columns c
      WHERE c.table_schema = 'public'
        AND c.table_name = 'central_users'
        AND c.column_name = required_column.name
        AND c.data_type = required_column.data_type
    ) THEN
      RAISE EXCEPTION 'central_users incompatível: coluna ausente ou tipo inesperado (%)', required_column.name;
    END IF;
  END LOOP;
END
$schema_check$;

-- Igual ao índice usado pelo login. Duplicatas que diferem só por caixa fazem
-- a migração parar para análise, em vez de escolher ou apagar uma conta.
CREATE UNIQUE INDEX IF NOT EXISTS central_users_email_lower_idx
  ON public.central_users (LOWER(email));

-- 2. Convites: preserva o fluxo atual de criação de alunos por convite.
CREATE TABLE IF NOT EXISTS public.central_student_invites (
  invitation_id TEXT PRIMARY KEY,
  token_hash TEXT NOT NULL UNIQUE,
  invited_email TEXT,
  recipient_name TEXT,
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  used_by TEXT,
  revoked_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS central_student_invites_created_idx
  ON public.central_student_invites (created_at DESC);

-- 3. Catálogo comercial separado do papel administrativo.
CREATE TABLE IF NOT EXISTS public.central_plans (
  plan_code TEXT PRIMARY KEY CHECK (plan_code IN ('free','premium')),
  display_name TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.central_plans (plan_code, display_name)
VALUES ('free', 'Gratuito'), ('premium', 'Premium')
ON CONFLICT (plan_code) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.central_plan_entitlements (
  plan_code TEXT NOT NULL REFERENCES public.central_plans(plan_code),
  feature_code TEXT NOT NULL,
  enabled BOOLEAN NOT NULL,
  daily_limit INTEGER,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (plan_code, feature_code),
  CHECK (daily_limit IS NULL OR daily_limit >= 0)
);

-- Política comercial inicial. A aplicação deve consultar esta matriz no
-- servidor; ela não substitui autorização em APIs nem proteção dos arquivos.
INSERT INTO public.central_plan_entitlements
  (plan_code, feature_code, enabled, daily_limit)
VALUES
  ('free',    'theory.summary',             TRUE,  NULL),
  ('free',    'theory.complete',            FALSE, NULL),
  ('free',    'vade_mecum',                 TRUE,  NULL),
  ('free',    'lei_em_dia',                 TRUE,  20),
  ('free',    'tec.links',                  FALSE, NULL),
  ('free',    'qc.links',                   FALSE, NULL),
  ('free',    'tec.question_books_filters', FALSE, NULL),
  ('free',    'qc.question_books_filters',  FALSE, NULL),
  ('free',    'premium.reviews',            FALSE, NULL),
  ('free',    'progress.advanced_sync',     FALSE, NULL),
  ('free',    'edital.mark.studied',        TRUE,  NULL),
  ('free',    'edital.mark.reviewed',       FALSE, NULL),
  ('free',    'edital.mark.questions',      FALSE, NULL),
  ('free',    'edital.sync',               FALSE, NULL),
  ('premium', 'theory.summary',             TRUE,  NULL),
  ('premium', 'theory.complete',            TRUE,  NULL),
  ('premium', 'vade_mecum',                 TRUE,  NULL),
  ('premium', 'lei_em_dia',                 TRUE,  NULL),
  ('premium', 'tec.links',                  TRUE,  NULL),
  ('premium', 'qc.links',                   TRUE,  NULL),
  ('premium', 'tec.question_books_filters', TRUE,  NULL),
  ('premium', 'qc.question_books_filters',  TRUE,  NULL),
  ('premium', 'premium.reviews',            TRUE,  NULL),
  ('premium', 'progress.advanced_sync',     TRUE,  NULL),
  ('premium', 'edital.mark.studied',        TRUE,  NULL),
  ('premium', 'edital.mark.reviewed',       TRUE,  NULL),
  ('premium', 'edital.mark.questions',      TRUE,  NULL),
  ('premium', 'edital.sync',               TRUE,  NULL)
ON CONFLICT (plan_code, feature_code) DO NOTHING;

-- 4. Assinaturas: histórico por usuário, sem dados de cartão.
-- Sem linha válida significa plano não atribuído; usuários existentes não são
-- convertidos automaticamente. Plano gratuito também precisa de atribuição.
CREATE TABLE IF NOT EXISTS public.central_user_subscriptions (
  subscription_id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.central_users(user_id) ON DELETE CASCADE,
  plan_code TEXT NOT NULL REFERENCES public.central_plans(plan_code),
  status TEXT NOT NULL CHECK (status IN ('active','expired','cancelled')),
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  grant_source TEXT NOT NULL CHECK (grant_source IN ('manual','mercadopago')),
  provider_subscription_id TEXT,
  granted_by TEXT REFERENCES public.central_users(user_id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (ends_at IS NULL OR ends_at > starts_at),
  CHECK (plan_code <> 'premium' OR ends_at IS NOT NULL),
  CHECK (status <> 'cancelled' OR cancelled_at IS NOT NULL),
  CHECK (grant_source <> 'mercadopago' OR provider_subscription_id IS NOT NULL)
);

-- No máximo uma atribuição ativa por usuário. Antes de uma nova ativação, a
-- futura API deve encerrar/expirar a atribuição anterior em uma transação.
CREATE UNIQUE INDEX IF NOT EXISTS central_user_subscriptions_one_active_idx
  ON public.central_user_subscriptions (user_id)
  WHERE status = 'active';
CREATE INDEX IF NOT EXISTS central_user_subscriptions_user_history_idx
  ON public.central_user_subscriptions (user_id, created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS central_user_subscriptions_provider_id_idx
  ON public.central_user_subscriptions (grant_source, provider_subscription_id)
  WHERE provider_subscription_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.central_user_plan_audit (
  audit_id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.central_users(user_id) ON DELETE CASCADE,
  subscription_id TEXT REFERENCES public.central_user_subscriptions(subscription_id) ON DELETE SET NULL,
  changed_by TEXT REFERENCES public.central_users(user_id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  old_plan_code TEXT,
  new_plan_code TEXT,
  old_status TEXT,
  new_status TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS central_user_plan_audit_user_created_idx
  ON public.central_user_plan_audit (user_id, created_at DESC);

COMMENT ON TABLE public.central_user_subscriptions IS
  'Histórico de plano comercial; nunca armazena PAN, CVV ou dados de cartão.';
COMMENT ON COLUMN public.central_user_subscriptions.provider_subscription_id IS
  'Identificador de assinatura do provedor, não credencial nem dado de cartão.';

-- 5. Progresso existente definido pelas APIs atuais.
CREATE TABLE IF NOT EXISTS public.central_user_preferences (
  user_id TEXT PRIMARY KEY REFERENCES public.central_users(user_id) ON DELETE CASCADE,
  study_objective_id TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.central_exam_topic_progress (
  user_id TEXT NOT NULL REFERENCES public.central_users(user_id) ON DELETE CASCADE,
  exam_id TEXT NOT NULL,
  topic_id TEXT NOT NULL,
  marker TEXT NOT NULL CHECK (marker IN ('studied','reviewed','questions')),
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, exam_id, topic_id, marker)
);
CREATE INDEX IF NOT EXISTS central_exam_topic_progress_exam_user_idx
  ON public.central_exam_topic_progress (exam_id, user_id);

CREATE TABLE IF NOT EXISTS public.central_user_sync_state (
  user_id TEXT PRIMARY KEY REFERENCES public.central_users(user_id) ON DELETE CASCADE,
  revision BIGINT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  device_id TEXT,
  content_hash TEXT,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  payload_bytes INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.central_user_progress_summary (
  user_id TEXT PRIMARY KEY REFERENCES public.central_users(user_id) ON DELETE CASCADE,
  overall_pct INTEGER NOT NULL DEFAULT 0,
  questions BIGINT NOT NULL DEFAULT 0,
  study_seconds BIGINT NOT NULL DEFAULT 0,
  last_study TIMESTAMPTZ,
  disciplines JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Quota diária do Lei em Dia. A chave por questão torna reaberturas
-- idempotentes. Usage date é calculada no fuso America/Sao_Paulo pelo servidor
-- PostgreSQL; não aceite user_id, plano ou data vindos do navegador.
CREATE TABLE IF NOT EXISTS public.central_lei_em_dia_daily_usage (
  user_id TEXT NOT NULL REFERENCES public.central_users(user_id) ON DELETE CASCADE,
  usage_date DATE NOT NULL,
  question_id TEXT NOT NULL,
  first_served_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, usage_date, question_id)
);
CREATE INDEX IF NOT EXISTS central_lei_em_dia_daily_usage_date_idx
  ON public.central_lei_em_dia_daily_usage (usage_date, user_id);

-- Função atômica preparada para integração a uma futura API que entrega UMA
-- questão validada. Só a função incrementa a quota: chamadas simultâneas do
-- mesmo usuário/dia são serializadas por advisory lock transacional.
-- Esta função não substitui a verificação da sessão, a validação do ID da
-- questão, nem a proteção do arquivo/catálogo que contém as questões.
CREATE OR REPLACE FUNCTION public.central_claim_lei_em_dia_question(
  p_user_id TEXT,
  p_question_id TEXT
)
RETURNS TABLE (
  allowed BOOLEAN,
  already_counted BOOLEAN,
  used_count INTEGER,
  daily_limit INTEGER,
  effective_plan TEXT
)
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $function$
DECLARE
  v_today DATE;
  v_role TEXT;
  v_active BOOLEAN;
  v_plan TEXT;
  v_status TEXT;
  v_starts_at TIMESTAMPTZ;
  v_ends_at TIMESTAMPTZ;
  v_count INTEGER;
  v_limit INTEGER;
BEGIN
  IF p_user_id IS NULL OR length(p_user_id) = 0
     OR p_question_id IS NULL OR length(p_question_id) = 0
     OR length(p_question_id) > 200 THEN
    RETURN QUERY SELECT FALSE, FALSE, 0, 20, NULL::TEXT;
    RETURN;
  END IF;

  v_today := (NOW() AT TIME ZONE 'America/Sao_Paulo')::DATE;
  PERFORM pg_advisory_xact_lock(hashtextextended(p_user_id || ':' || v_today::TEXT, 0));

  SELECT u.role, u.active
    INTO v_role, v_active
    FROM public.central_users AS u
   WHERE u.user_id = p_user_id
   FOR SHARE;

  IF NOT FOUND OR v_active IS DISTINCT FROM TRUE OR v_role <> 'aluno' THEN
    RETURN QUERY SELECT FALSE, FALSE, 0, 20, NULL::TEXT;
    RETURN;
  END IF;

  -- Cancellation is scheduled: Premium remains active through ends_at.
  -- After expiry/cancellation/end-of-period, the effective student plan is Free.
  SELECT s.plan_code, s.status, s.starts_at, s.ends_at
    INTO v_plan, v_status, v_starts_at, v_ends_at
    FROM public.central_user_subscriptions AS s
   WHERE s.user_id = p_user_id
     AND s.starts_at <= NOW()
   ORDER BY s.starts_at DESC, s.created_at DESC
   LIMIT 1
   FOR SHARE;

  IF v_plan = 'premium'
     AND v_status IN ('active','cancelled')
     AND (v_ends_at IS NULL OR v_ends_at > NOW()) THEN
    RETURN QUERY SELECT TRUE, FALSE, 0, NULL::INTEGER, 'premium'::TEXT;
    RETURN;
  END IF;

  IF v_plan = 'premium'
     AND (v_status IN ('expired','cancelled') OR (v_ends_at IS NOT NULL AND v_ends_at <= NOW())) THEN
    -- Premium vencido ou cancelado após o período pago retorna ao Gratuito.
    v_plan := 'free';
    v_status := 'active';
    v_ends_at := NULL;
  END IF;

  IF v_plan = 'free' AND v_status = 'active'
     AND (v_ends_at IS NULL OR v_ends_at > NOW()) THEN
    NULL;
  ELSIF v_plan = 'free' AND (v_status <> 'active' OR (v_ends_at IS NOT NULL AND v_ends_at <= NOW())) THEN
    RETURN QUERY SELECT FALSE, FALSE, 0, 20, NULL::TEXT;
    RETURN;
  ELSIF v_plan IS DISTINCT FROM 'free' THEN
    -- Conta sem plano (por exemplo, antiga e ainda não migrada) continua
    -- não atribuída; não presumimos plano para contas existentes.
    RETURN QUERY SELECT FALSE, FALSE, 0, 20, NULL::TEXT;
    RETURN;
  END IF;

  SELECT e.daily_limit INTO v_limit
    FROM public.central_plan_entitlements AS e
   WHERE e.plan_code = 'free' AND e.feature_code = 'lei_em_dia' AND e.enabled = TRUE;
  IF v_limit IS NULL OR v_limit < 1 THEN
    RETURN QUERY SELECT FALSE, FALSE, 0, 20, 'free'::TEXT;
    RETURN;
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.central_lei_em_dia_daily_usage AS q
     WHERE q.user_id = p_user_id
       AND q.usage_date = v_today
       AND q.question_id = p_question_id
  ) THEN
    SELECT COUNT(*)::INTEGER INTO v_count
      FROM public.central_lei_em_dia_daily_usage AS q
     WHERE q.user_id = p_user_id AND q.usage_date = v_today;
    RETURN QUERY SELECT TRUE, TRUE, v_count, v_limit, 'free'::TEXT;
    RETURN;
  END IF;

  SELECT COUNT(*)::INTEGER INTO v_count
    FROM public.central_lei_em_dia_daily_usage AS q
   WHERE q.user_id = p_user_id AND q.usage_date = v_today;

  IF v_count >= v_limit THEN
    RETURN QUERY SELECT FALSE, FALSE, v_count, v_limit, 'free'::TEXT;
    RETURN;
  END IF;

  INSERT INTO public.central_lei_em_dia_daily_usage (user_id, usage_date, question_id)
  VALUES (p_user_id, v_today, p_question_id)
  ON CONFLICT (user_id, usage_date, question_id) DO NOTHING;

  SELECT COUNT(*)::INTEGER INTO v_count
    FROM public.central_lei_em_dia_daily_usage AS q
   WHERE q.user_id = p_user_id AND q.usage_date = v_today;

  RETURN QUERY SELECT TRUE, FALSE, v_count, v_limit, 'free'::TEXT;
END
$function$;

-- Atribuição administrativa atômica. A função confere o ator no banco,
-- serializa alterações por usuário e grava histórico na mesma transação.
CREATE OR REPLACE FUNCTION public.central_admin_assign_plan(
  p_actor_id TEXT,
  p_user_id TEXT,
  p_plan_code TEXT,
  p_subscription_id TEXT,
  p_starts_at TIMESTAMPTZ,
  p_ends_at TIMESTAMPTZ
)
RETURNS TABLE (subscription_id TEXT, user_id TEXT, plan_code TEXT, status TEXT, starts_at TIMESTAMPTZ, ends_at TIMESTAMPTZ)
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $function$
DECLARE
  v_actor_role TEXT;
  v_actor_active BOOLEAN;
  v_target_role TEXT;
  v_old_plan TEXT;
  v_old_status TEXT;
BEGIN
  SELECT role, active INTO v_actor_role, v_actor_active
    FROM public.central_users WHERE central_users.user_id = p_actor_id FOR SHARE;
  IF NOT FOUND OR v_actor_role <> 'admin' OR v_actor_active IS DISTINCT FROM TRUE THEN
    RAISE EXCEPTION 'Ação exclusiva de administrador ativo' USING ERRCODE = '42501';
  END IF;
  SELECT role INTO v_target_role
    FROM public.central_users WHERE central_users.user_id = p_user_id FOR UPDATE;
  IF NOT FOUND OR v_target_role <> 'aluno' THEN
    RAISE EXCEPTION 'Plano comercial só pode ser atribuído a aluno' USING ERRCODE = '22023';
  END IF;
  IF p_plan_code NOT IN ('free','premium') OR p_subscription_id IS NULL OR p_subscription_id = '' OR p_starts_at IS NULL THEN
    RAISE EXCEPTION 'Dados do plano inválidos' USING ERRCODE = '22023';
  END IF;
  IF p_plan_code = 'premium' AND (p_ends_at IS NULL OR p_ends_at <= p_starts_at) THEN
    RAISE EXCEPTION 'Premium exige vencimento posterior ao início' USING ERRCODE = '22023';
  END IF;
  IF p_plan_code = 'free' AND p_ends_at IS NOT NULL AND p_ends_at <= p_starts_at THEN
    RAISE EXCEPTION 'Período do Gratuito inválido' USING ERRCODE = '22023';
  END IF;
  IF p_starts_at > NOW() THEN
    RAISE EXCEPTION 'A atribuição manual não pode iniciar no futuro' USING ERRCODE = '22023';
  END IF;

  SELECT s.plan_code, s.status INTO v_old_plan, v_old_status
    FROM public.central_user_subscriptions AS s
   WHERE s.user_id = p_user_id AND s.status = 'active'
   ORDER BY s.starts_at DESC, s.created_at DESC LIMIT 1 FOR UPDATE;

  UPDATE public.central_user_subscriptions
     SET status = 'expired', updated_at = NOW()
   WHERE central_user_subscriptions.user_id = p_user_id
     AND central_user_subscriptions.status = 'active';

  RETURN QUERY
  WITH created AS (
    INSERT INTO public.central_user_subscriptions
      (subscription_id,user_id,plan_code,status,starts_at,ends_at,grant_source,granted_by)
    VALUES (p_subscription_id,p_user_id,p_plan_code,'active',p_starts_at,p_ends_at,'manual',p_actor_id)
    RETURNING central_user_subscriptions.subscription_id, central_user_subscriptions.user_id,
              central_user_subscriptions.plan_code, central_user_subscriptions.status,
              central_user_subscriptions.starts_at, central_user_subscriptions.ends_at
  ), audit AS (
    INSERT INTO public.central_user_plan_audit
      (user_id,subscription_id,changed_by,action,old_plan_code,new_plan_code,old_status,new_status)
    SELECT c.user_id,c.subscription_id,p_actor_id,'assigned',v_old_plan,c.plan_code,v_old_status,c.status
      FROM created c
    RETURNING audit_id
  )
  SELECT c.subscription_id,c.user_id,c.plan_code,c.status,c.starts_at,c.ends_at FROM created c;
END
$function$;

-- Cancelamento preserva acesso até ends_at. Após o fim do período pago, a
-- resolução efetiva cai automaticamente para Free, sem precisar de cron.
CREATE OR REPLACE FUNCTION public.central_admin_cancel_plan(p_actor_id TEXT, p_subscription_id TEXT)
RETURNS TABLE (subscription_id TEXT, user_id TEXT, plan_code TEXT, status TEXT, starts_at TIMESTAMPTZ, ends_at TIMESTAMPTZ, cancelled_at TIMESTAMPTZ)
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $function$
DECLARE
  v_actor_role TEXT;
  v_actor_active BOOLEAN;
  v_old RECORD;
BEGIN
  SELECT role, active INTO v_actor_role, v_actor_active
    FROM public.central_users WHERE central_users.user_id = p_actor_id FOR SHARE;
  IF NOT FOUND OR v_actor_role <> 'admin' OR v_actor_active IS DISTINCT FROM TRUE THEN
    RAISE EXCEPTION 'Ação exclusiva de administrador ativo' USING ERRCODE = '42501';
  END IF;
  SELECT s.* INTO v_old
    FROM public.central_user_subscriptions s
   WHERE s.subscription_id = p_subscription_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Assinatura não encontrada' USING ERRCODE = 'P0002'; END IF;
  IF v_old.plan_code <> 'premium' OR v_old.status NOT IN ('active','cancelled') THEN
    RAISE EXCEPTION 'Assinatura Premium não está cancelável' USING ERRCODE = '22023';
  END IF;

  UPDATE public.central_user_subscriptions AS target
     SET status = 'cancelled', cancelled_at = COALESCE(target.cancelled_at,NOW()), updated_at = NOW()
   WHERE target.subscription_id = p_subscription_id;
  INSERT INTO public.central_user_plan_audit
    (user_id,subscription_id,changed_by,action,old_plan_code,new_plan_code,old_status,new_status)
  VALUES (v_old.user_id,p_subscription_id,p_actor_id,'cancelled',v_old.plan_code,v_old.plan_code,v_old.status,'cancelled');
  RETURN QUERY SELECT s.subscription_id,s.user_id,s.plan_code,s.status,s.starts_at,s.ends_at,s.cancelled_at
    FROM public.central_user_subscriptions s WHERE s.subscription_id = p_subscription_id;
END
$function$;

CREATE OR REPLACE FUNCTION public.central_admin_expire_plan(p_actor_id TEXT, p_subscription_id TEXT)
RETURNS TABLE (subscription_id TEXT, user_id TEXT, plan_code TEXT, status TEXT, starts_at TIMESTAMPTZ, ends_at TIMESTAMPTZ)
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $function$
DECLARE
  v_actor_role TEXT;
  v_actor_active BOOLEAN;
  v_old RECORD;
BEGIN
  SELECT role, active INTO v_actor_role, v_actor_active
    FROM public.central_users WHERE central_users.user_id = p_actor_id FOR SHARE;
  IF NOT FOUND OR v_actor_role <> 'admin' OR v_actor_active IS DISTINCT FROM TRUE THEN
    RAISE EXCEPTION 'Ação exclusiva de administrador ativo' USING ERRCODE = '42501';
  END IF;
  SELECT s.* INTO v_old
    FROM public.central_user_subscriptions s
   WHERE s.subscription_id = p_subscription_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Assinatura não encontrada' USING ERRCODE = 'P0002'; END IF;
  IF v_old.plan_code <> 'premium' OR v_old.status NOT IN ('active','cancelled') THEN
    RAISE EXCEPTION 'Assinatura Premium não pode ser expirada neste estado' USING ERRCODE = '22023';
  END IF;
  UPDATE public.central_user_subscriptions AS target
     SET status = 'expired', ends_at = CASE WHEN target.ends_at IS NULL OR target.ends_at > NOW() THEN NOW() ELSE target.ends_at END,
         updated_at = NOW()
   WHERE target.subscription_id = p_subscription_id
     AND target.starts_at < NOW();
  IF NOT FOUND THEN RAISE EXCEPTION 'Não é possível expirar uma assinatura que ainda não começou' USING ERRCODE = '22023'; END IF;
  INSERT INTO public.central_user_plan_audit
    (user_id,subscription_id,changed_by,action,old_plan_code,new_plan_code,old_status,new_status)
  VALUES (v_old.user_id,p_subscription_id,p_actor_id,'expired',v_old.plan_code,v_old.plan_code,v_old.status,'expired');
  RETURN QUERY SELECT s.subscription_id,s.user_id,s.plan_code,s.status,s.starts_at,s.ends_at
    FROM public.central_user_subscriptions s WHERE s.subscription_id = p_subscription_id;
END
$function$;

-- Evita invocação anônima via grants padrão. O serviço usa a conexão privada
-- do servidor; se a aplicação passar a usar uma role de runtime distinta da
-- role proprietária da função, conceder EXECUTE somente a essa role após
-- identificá-la e revisar seus privilégios. Nunca expor DATABASE_URL ao cliente.
REVOKE ALL ON FUNCTION public.central_claim_lei_em_dia_question(TEXT, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.central_admin_assign_plan(TEXT, TEXT, TEXT, TEXT, TIMESTAMPTZ, TIMESTAMPTZ) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.central_admin_cancel_plan(TEXT, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.central_admin_expire_plan(TEXT, TEXT) FROM PUBLIC;

COMMIT;

-- Pós-migração (somente leitura), a executar sob autorização futura:
-- 1) conferir tabelas/índices/constraints e que nenhuma assinatura foi criada;
-- 2) conferir que central_users não recebeu novas contas por esta migração;
-- 3) testar a função com IDs sintéticos numa transação de teste controlada;
-- 4) validar contagem 20/21, repetição do mesmo ID e chamadas concorrentes;
-- 5) ROLLBACK de fixture de teste ou recriar a branch isolada após os testes.
