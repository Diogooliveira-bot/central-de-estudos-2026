-- Base Completa Etapa 4.5 — limpar somente solicitacoes de cadastro sem confirmacao.
-- EXECUTAR MANUALMENTE OU EM JOB DE MANUTENCAO, apos homologar acesso.
-- NUNCA executar por engano na Production antes do backup e da autorizacao especifica.
-- Nenhum usuario ou assinatura e alterado por estes comandos.
BEGIN;
DELETE FROM public.central_free_signup_pending WHERE expires_at < NOW();
DELETE FROM public.central_free_signup_limits WHERE window_start < NOW() - INTERVAL '7 days';
COMMIT;
