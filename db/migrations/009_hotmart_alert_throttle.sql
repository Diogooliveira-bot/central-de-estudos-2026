-- Base Completa / Hotmart: um alerta por motivo a cada 30 minutos, mesmo com
-- notificações simultâneas. Aditiva; não altera pedidos, contas nem assinaturas.
-- Reversão: DROP TABLE public.central_hotmart_alert_throttle;
BEGIN;
CREATE TABLE IF NOT EXISTS public.central_hotmart_alert_throttle (
  reason TEXT PRIMARY KEY,
  last_alert_at TIMESTAMPTZ NOT NULL
);
COMMIT;
