-- ETAPA 4.4 — PLANO PARA APROVACAO. NAO EXECUTAR SEM AUTORIZACAO.
-- NENHUMA senha deve ser escrita neste arquivo publico.
-- 1. DEPOIS da autorizacao, criar bc_neon_backup_ro pelo Neon API.
-- 2. Confirmar LOGIN, NOSUPERUSER, NOCREATEDB, NOCREATEROLE, NOREPLICATION, NOBYPASSRLS.
-- 3. Aplicar APENAS estas permissoes pela conta administradora competente.
-- 4. O backup completo precisa incluir public E neon_auth. Verificado em metadados,
--    sem acessar nenhuma linha dos dados reais.
-- A execucao destas GRANTs ALTERA ACLs de Production; portanto NAO EXECUTADA.

BEGIN;
GRANT CONNECT ON DATABASE neondb TO bc_neon_backup_ro;
GRANT USAGE ON SCHEMA public, neon_auth TO bc_neon_backup_ro;
GRANT SELECT ON ALL TABLES IN SCHEMA public, neon_auth TO bc_neon_backup_ro;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA public, neon_auth TO bc_neon_backup_ro;
COMMIT;

-- Não aplicar privilégios de INSERT, UPDATE, DELETE, TRUNCATE, CREATE,
-- ownership, REPLICATION, BYPASSRLS ou privilégios administrativos.
-- Não executar ALTER DEFAULT PRIVILEGES para evitar acesso futuro indesejado.
-- Se uma tabela/sequence for criada posteriormente, um novo backup poderá
-- falhar por falta de SELECT; preferir falhar fechado e revisar as permissões.

-- Para conferir como bc_neon_backup_ro DEPOIS de criada, sem ler linhas reais:
-- SELECT current_user, current_database(), current_setting('server_version');
-- SELECT n.nspname,
-- count(c.oid) FILTER (WHERE c.relkind IN ('r','p','v','m','f')) AS relations,
-- count(c.oid) FILTER (WHERE c.relkind IN ('r','p','v','m','f')
--   AND NOT has_table_privilege(current_user,c.oid,'SELECT')) AS not_readable,
-- count(c.oid) FILTER (WHERE c.relkind='S'
--   AND NOT has_sequence_privilege(current_user,c.oid,'SELECT')) AS sequences_not_readable
-- FROM pg_namespace n LEFT JOIN pg_class c ON c.relnamespace=n.oid
-- WHERE n.nspname IN ('public','neon_auth') GROUP BY n.nspname;

-- Nota: pg_dump extrai o banco, mas nao configurações globais, credenciais
-- de provedores externos, nem todos os recursos gerenciados de Neon Auth.
-- A restauração real isolada é critério de aceite, não apenas retorno 0 do dump.
