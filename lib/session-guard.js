import { neon } from '@neondatabase/serverless';

/**
 * Revogação de sessão para o middleware (páginas e arquivos estáticos).
 *
 * O cookie de sessão é assinado e vale até `exp`, mas a conta pode ser
 * desativada, rebaixada ou ter a senha trocada depois da emissão. As APIs já
 * conferem isso no banco (lib/auth.js -> requireSession). Este módulo faz a
 * mesma conferência para o middleware, sem consultar o banco a cada arquivo:
 *
 *  - o resultado fica em memória por `ttlMs` (padrão 30 s) por usuário;
 *  - pedidos simultâneos do mesmo usuário compartilham UMA consulta;
 *  - se o banco falhar, um resultado antigo (até `staleMs`) ainda vale; sem
 *    resultado antigo, o acesso é recusado (503) em vez de liberado.
 *
 * Prazo máximo para a revogação surtir efeito: `ttlMs` (30 s) por instância
 * do middleware.
 *
 * Este arquivo roda no middleware (Edge): não importe `node:crypto` aqui nem
 * `lib/auth.js`.
 */

export const GUARD_ROLES = ['admin', 'editor', 'aluno'];
export const GUARD_TTL_MS = 30 * 1000;
export const GUARD_STALE_MS = 5 * 60 * 1000;
const MAX_ENTRIES = 500;

export function createSessionGuard({
  lookup,
  ttlMs = GUARD_TTL_MS,
  staleMs = GUARD_STALE_MS,
  now = Date.now,
} = {}) {
  if (typeof lookup !== 'function') throw new Error('createSessionGuard: lookup é obrigatório');
  const cache = new Map();   // uid -> { at, row }
  const pending = new Map(); // uid -> Promise<row|null>

  function remember(uid, row) {
    if (cache.size >= MAX_ENTRIES) {
      // descarta o mais antigo (Map preserva a ordem de inserção)
      cache.delete(cache.keys().next().value);
    }
    cache.delete(uid);
    cache.set(uid, { at: now(), row });
  }

  function fetchRow(uid) {
    if (pending.has(uid)) return pending.get(uid);
    const promise = Promise.resolve()
      .then(() => lookup(uid))
      .then((row) => {
        remember(uid, row || null);
        return row || null;
      })
      .finally(() => pending.delete(uid));
    pending.set(uid, promise);
    return promise;
  }

  function evaluate(payload, row) {
    if (!row || row.active === false) return { ok: false, reason: 'revoked' };
    if (Number(row.session_version || 1) !== Number(payload.sv || 0)) return { ok: false, reason: 'revoked' };
    const role = String(row.role || '').toLowerCase();
    if (!GUARD_ROLES.includes(role)) return { ok: false, reason: 'revoked' };
    // O papel vem do BANCO, não do cookie: quem foi rebaixado perde as
    // páginas de administração no próximo ciclo, sem esperar o cookie vencer.
    return { ok: true, role };
  }

  return {
    /** payload = conteúdo já verificado (assinatura e validade) do cookie. */
    async check(payload) {
      const uid = String(payload?.uid || '');
      if (!uid) return { ok: false, reason: 'revoked' };

      const cached = cache.get(uid);
      if (cached && now() - cached.at < ttlMs) return evaluate(payload, cached.row);

      try {
        return evaluate(payload, await fetchRow(uid));
      } catch (_) {
        if (cached && now() - cached.at < staleMs) return evaluate(payload, cached.row);
        return { ok: false, reason: 'unavailable' };
      }
    },
    /** Só para testes e para forçar nova consulta. */
    clear() {
      cache.clear();
      pending.clear();
    },
  };
}

export function createNeonSessionLookup(getDatabaseUrl = () => process.env.DATABASE_URL) {
  return async function lookup(uid) {
    const url = String(getDatabaseUrl() || '');
    if (!url) throw new Error('DATABASE_URL ausente');
    const sql = neon(url);
    const rows = await sql`
      SELECT role, active, session_version
      FROM central_users
      WHERE user_id=${uid}
      LIMIT 1
    `;
    return rows[0] || null;
  };
}

export const sessionGuard = createSessionGuard({ lookup: createNeonSessionLookup() });
