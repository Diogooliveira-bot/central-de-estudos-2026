-- BASE COMPLETA / planos personalizados Léo v1.0.0
-- Somente homologação até autorização de Production.
CREATE TABLE IF NOT EXISTS central_study_plans (
 id UUID PRIMARY KEY,
 user_id TEXT NOT NULL REFERENCES central_users(user_id) ON DELETE CASCADE,
 source_plan_id TEXT,
 sha256 CHAR(64) NOT NULL,
 title TEXT NOT NULL,
 original JSONB NOT NULL,
 normalized JSONB NOT NULL,
 pdf_bytes BYTEA NOT NULL,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '24 months'),
 UNIQUE (user_id, sha256),
 UNIQUE (user_id, id)
);
CREATE TABLE IF NOT EXISTS central_study_plan_active (
 user_id TEXT PRIMARY KEY REFERENCES central_users(user_id) ON DELETE CASCADE,
 plan_id UUID NOT NULL,
 updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 FOREIGN KEY (user_id, plan_id) REFERENCES central_study_plans(user_id,id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS central_study_plan_task_state (
 user_id TEXT NOT NULL,
 plan_id UUID NOT NULL,
 task_id TEXT NOT NULL,
 completed BOOLEAN NOT NULL DEFAULT FALSE,
 subject_id TEXT,
 module_uid TEXT,
 updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 PRIMARY KEY (user_id,plan_id,task_id),
 FOREIGN KEY (user_id,plan_id) REFERENCES central_study_plans(user_id,id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS central_study_plans_user_date_idx
 ON central_study_plans(user_id,created_at DESC);
