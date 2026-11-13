-- Base Completa / Questões do módulo: limite diário para o plano Gratuito.
-- Aditiva: cria uma tabela, uma função e duas linhas de direitos (entitlements).
-- Não altera usuários, assinaturas, progresso nem a cota do Lei em Dia.
--
-- Regra: o aluno Gratuito resolve até `daily_limit` QUESTÕES DISTINTAS por dia (dia civil em
-- America/Sao_Paulo). Responder de novo a mesma questão no mesmo dia não gasta cota.
-- Premium e equipe não têm limite (a API nem chama a função para a equipe).
-- O valor do limite mora em central_plan_entitlements e pode ser mudado SEM publicar código:
--   UPDATE public.central_plan_entitlements SET daily_limit = 10, updated_at = NOW()
--    WHERE plan_code = 'free' AND feature_code = 'questoes_modulo';
--
-- Ordem de publicação: aplicar esta migração no banco de Production ANTES de publicar o código
-- (sem a função, a API responde 503 "Questões temporariamente indisponíveis").
-- Reversão: DROP FUNCTION public.central_claim_questao(TEXT, TEXT);
--           DROP TABLE public.central_questoes_daily_usage;
--           DELETE FROM public.central_plan_entitlements WHERE feature_code = 'questoes_modulo';
BEGIN;

CREATE TABLE IF NOT EXISTS public.central_questoes_daily_usage (
  user_id TEXT NOT NULL REFERENCES public.central_users(user_id) ON DELETE CASCADE,
  usage_date DATE NOT NULL,
  question_id TEXT NOT NULL,
  first_answered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, usage_date, question_id)
);
CREATE INDEX IF NOT EXISTS central_questoes_daily_usage_date_idx
  ON public.central_questoes_daily_usage (usage_date, user_id);

INSERT INTO public.central_plan_entitlements (plan_code, feature_code, enabled, daily_limit)
VALUES ('free', 'questoes_modulo', TRUE, 5),
       ('premium', 'questoes_modulo', TRUE, NULL)
ON CONFLICT (plan_code, feature_code) DO NOTHING;

-- Função atômica: só ela grava o uso. Chamadas simultâneas do mesmo aluno/dia são serializadas
-- por advisory lock transacional. Devolve:
--   allowed        a resposta pode ser entregue;
--   already_counted a questão já tinha sido respondida hoje (não gastou cota agora);
--   used_count     questões distintas já usadas hoje (inclui esta, se permitida);
--   daily_limit    limite do plano (NULL = sem limite);
--   effective_plan 'free' | 'premium' | NULL (conta inválida).
CREATE OR REPLACE FUNCTION public.central_claim_questao(
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
    RETURN QUERY SELECT FALSE, FALSE, 0, 5, NULL::TEXT;
    RETURN;
  END IF;

  v_today := (NOW() AT TIME ZONE 'America/Sao_Paulo')::DATE;
  PERFORM pg_advisory_xact_lock(hashtextextended('questoes:' || p_user_id || ':' || v_today::TEXT, 0));

  SELECT u.role, u.active
    INTO v_role, v_active
    FROM public.central_users AS u
   WHERE u.user_id = p_user_id
   FOR SHARE;

  IF NOT FOUND OR v_active IS DISTINCT FROM TRUE OR v_role <> 'aluno' THEN
    RETURN QUERY SELECT FALSE, FALSE, 0, 5, NULL::TEXT;
    RETURN;
  END IF;

  SELECT s.plan_code, s.status, s.starts_at, s.ends_at
    INTO v_plan, v_status, v_starts_at, v_ends_at
    FROM public.central_user_subscriptions AS s
   WHERE s.user_id = p_user_id
     AND s.starts_at <= NOW()
   ORDER BY s.starts_at DESC, s.created_at DESC
   LIMIT 1
   FOR SHARE;

  -- Premium dentro do período pago (cancelamento é agendado): sem limite.
  IF v_plan = 'premium'
     AND v_status IN ('active','cancelled')
     AND (v_ends_at IS NULL OR v_ends_at > NOW()) THEN
    RETURN QUERY SELECT TRUE, FALSE, 0, NULL::INTEGER, 'premium'::TEXT;
    RETURN;
  END IF;

  -- Premium vencido/cancelado após o período pago volta ao Gratuito.
  IF v_plan = 'premium'
     AND (v_status IN ('expired','cancelled') OR (v_ends_at IS NOT NULL AND v_ends_at <= NOW())) THEN
    v_plan := 'free';
    v_status := 'active';
    v_ends_at := NULL;
  END IF;

  IF v_plan = 'free' AND v_status = 'active'
     AND (v_ends_at IS NULL OR v_ends_at > NOW()) THEN
    NULL;
  ELSE
    -- Sem plano atribuído (ou plano inválido): não presumimos plano.
    RETURN QUERY SELECT FALSE, FALSE, 0, 5, NULL::TEXT;
    RETURN;
  END IF;

  SELECT e.daily_limit INTO v_limit
    FROM public.central_plan_entitlements AS e
   WHERE e.plan_code = 'free' AND e.feature_code = 'questoes_modulo' AND e.enabled = TRUE;
  IF NOT FOUND THEN
    -- Recurso desligado para o Gratuito.
    RETURN QUERY SELECT FALSE, FALSE, 0, 0, 'free'::TEXT;
    RETURN;
  END IF;
  IF v_limit IS NULL THEN
    -- Linha existe e está ligada sem limite: Gratuito liberado.
    RETURN QUERY SELECT TRUE, FALSE, 0, NULL::INTEGER, 'free'::TEXT;
    RETURN;
  END IF;

  SELECT COUNT(*)::INTEGER INTO v_count
    FROM public.central_questoes_daily_usage AS q
   WHERE q.user_id = p_user_id AND q.usage_date = v_today;

  IF EXISTS (
    SELECT 1 FROM public.central_questoes_daily_usage AS q
     WHERE q.user_id = p_user_id AND q.usage_date = v_today AND q.question_id = p_question_id
  ) THEN
    RETURN QUERY SELECT TRUE, TRUE, v_count, v_limit, 'free'::TEXT;
    RETURN;
  END IF;

  IF v_count >= v_limit THEN
    RETURN QUERY SELECT FALSE, FALSE, v_count, v_limit, 'free'::TEXT;
    RETURN;
  END IF;

  INSERT INTO public.central_questoes_daily_usage (user_id, usage_date, question_id)
  VALUES (p_user_id, v_today, p_question_id)
  ON CONFLICT (user_id, usage_date, question_id) DO NOTHING;

  RETURN QUERY SELECT TRUE, FALSE, v_count + 1, v_limit, 'free'::TEXT;
END
$function$;

COMMIT;
