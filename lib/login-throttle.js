import crypto from 'node:crypto';
import net from 'node:net';

/**
 * Limite de tentativas de login.
 *
 * Problema do desenho anterior: o bloqueio era só por conta (5 erros -> 10 min).
 * Qualquer pessoa podia errar a senha de um aluno de propósito e deixá-lo sem
 * acesso, e quem testava muitas contas a partir de uma rede nunca era limitado.
 *
 * Desenho atual (janelas fixas de 15 min, todas expiram sozinhas):
 *   1. por IP .............. 20 falhas   -> bloqueia aquela rede (todas as contas)
 *   2. por conta + IP ...... 5 falhas    -> bloqueia só aquele par; o aluno em
 *                                           outra rede não é afetado
 *   3. por conta (qualquer IP) 30 falhas -> passa a aceitar só redes "conhecidas"
 *                                           (que já entraram com sucesso nos
 *                                           últimos 30 dias). Freia ataque
 *                                           distribuído sem trancar o dono.
 *
 * Privacidade: nada é guardado em claro. As chaves são HMAC do e-mail e do IP
 * (IPv6 reduzido ao prefixo /64, senão cada endereço seria um "IP novo").
 *
 * Disponibilidade: se a tabela de controle falhar, o login continua (falha
 * aberta) e o erro é registrado; o banco principal fora do ar já derruba o
 * login por outros motivos.
 */

export const THROTTLE_LIMITS = Object.freeze({
  windowMs: 15 * 60 * 1000,
  perIp: 20,
  perAccountIp: 5,
  perAccountAny: 30,
  trustMs: 30 * 24 * 60 * 60 * 1000,
});

/* ------------------------------ IP do cliente ----------------------------- */

function expandIpv6(ip) {
  const [head, tail] = ip.split('::');
  const groupsOf = (part) => (part ? part.split(':') : []);
  const fixV4 = (groups) => {
    const last = groups[groups.length - 1];
    if (last && last.includes('.')) {
      const p = last.split('.').map(Number);
      groups.splice(-1, 1, ((p[0] << 8) | p[1]).toString(16), ((p[2] << 8) | p[3]).toString(16));
    }
    return groups;
  };
  const h = fixV4(groupsOf(head));
  const t = tail === undefined ? [] : fixV4(groupsOf(tail));
  const all = tail === undefined ? h : [...h, ...Array(Math.max(0, 8 - h.length - t.length)).fill('0'), ...t];
  return all.map((g) => g.toLowerCase().padStart(4, '0'));
}

/** Devolve o IPv4, ou o prefixo /64 do IPv6, ou '' se não for um IP válido. */
export function normalizeIp(value) {
  let ip = String(value || '').trim();
  if (!ip) return '';
  ip = ip.replace(/^\[|\]$/g, '').replace(/%.*$/, '');
  if (/^\d{1,3}(\.\d{1,3}){3}:\d+$/.test(ip)) ip = ip.slice(0, ip.lastIndexOf(':'));
  const mapped = ip.match(/^::ffff:(\d{1,3}(?:\.\d{1,3}){3})$/i);
  if (mapped) ip = mapped[1];
  if (net.isIPv4(ip)) return ip;
  if (net.isIPv6(ip)) return expandIpv6(ip).slice(0, 4).join(':') + '::/64';
  return '';
}

/**
 * Na Vercel, x-vercel-forwarded-for / x-real-ip / x-forwarded-for chegam
 * sobrescritos com o IP real do cliente (não vêm do navegador). Se a hospedagem
 * mudar para algo que apenas acrescenta ao x-forwarded-for, esta função precisa
 * ser revista, porque o primeiro valor passaria a ser forjável.
 */
export function clientIp(req) {
  const headers = req?.headers || {};
  const first = (value) => String(Array.isArray(value) ? value[0] : value || '').split(',')[0].trim();
  const raw = first(headers['x-vercel-forwarded-for'])
    || first(headers['x-real-ip'])
    || first(headers['x-forwarded-for'])
    || String(req?.socket?.remoteAddress || '');
  return normalizeIp(raw) || 'unknown';
}

/* --------------------------------- chaves --------------------------------- */

function digest(secret, label, value) {
  return crypto.createHmac('sha256', secret).update(label + '|' + value).digest('base64url').slice(0, 32);
}

export function throttleKeys({ ip, email, secret = process.env.AUTH_SECRET }) {
  const key = String(secret || '');
  if (key.length < 32) throw new Error('AUTH_SECRET não configurado ou muito curto');
  const mail = String(email || '').trim().toLowerCase();
  return {
    ip: 'ip:' + digest(key, 'ip', ip),
    pair: 'pair:' + digest(key, 'pair', mail + '|' + ip),
    account: 'acct:' + digest(key, 'acct', mail),
    trust: 'trust:' + digest(key, 'trust', mail + '|' + ip),
  };
}

/* --------------------------------- lógica --------------------------------- */

export function createLoginThrottle({ store, limits = THROTTLE_LIMITS, log = console.error } = {}) {
  if (!store) throw new Error('createLoginThrottle: store é obrigatório');
  const L = { ...THROTTLE_LIMITS, ...limits };

  const live = (entry) => (entry && entry.ageMs < L.windowMs ? entry : null);
  const retryAfterSec = (entry) => Math.max(1, Math.ceil((L.windowMs - entry.ageMs) / 1000));

  function decide(counts, trusted) {
    if (counts.ip && counts.ip.count >= L.perIp) return { blocked: true, scope: 'ip', retryAfterSec: retryAfterSec(counts.ip) };
    if (counts.pair && counts.pair.count >= L.perAccountIp) return { blocked: true, scope: 'pair', retryAfterSec: retryAfterSec(counts.pair) };
    if (counts.account && counts.account.count >= L.perAccountAny && !trusted) {
      return { blocked: true, scope: 'account', retryAfterSec: retryAfterSec(counts.account) };
    }
    return { blocked: false };
  }

  return {
    /** Antes de conferir a senha. Nunca lança: em falha do controle, libera. */
    async check(keys) {
      try {
        const rows = await store.peek([keys.ip, keys.pair, keys.account, keys.trust]);
        const trustEntry = rows.get(keys.trust);
        const trusted = !!(trustEntry && trustEntry.ageMs < L.trustMs);
        const counts = { ip: live(rows.get(keys.ip)), pair: live(rows.get(keys.pair)), account: live(rows.get(keys.account)) };
        return { ...decide(counts, trusted), trusted };
      } catch (error) {
        log('login throttle indisponível (check):', error?.message || error);
        return { blocked: false, trusted: false, degraded: true };
      }
    },

    /** Depois de uma senha errada (ou de um e-mail que não existe). */
    async recordFailure(keys, { trusted = false } = {}) {
      try {
        const [ip, pair, account] = await Promise.all([
          store.hit(keys.ip, L.windowMs),
          store.hit(keys.pair, L.windowMs),
          store.hit(keys.account, L.windowMs),
        ]);
        await store.maybePrune?.();
        return decide({ ip, pair, account }, trusted);
      } catch (error) {
        log('login throttle indisponível (failure):', error?.message || error);
        return { blocked: false, degraded: true };
      }
    },

    /** Depois de um login correto: libera o par e marca a rede como conhecida. */
    async recordSuccess(keys) {
      try {
        await Promise.all([store.clear(keys.pair), store.touch(keys.trust)]);
        await store.maybePrune?.();
      } catch (error) {
        log('login throttle indisponível (success):', error?.message || error);
      }
    },
  };
}

export function throttleMessage(retryAfterSec) {
  const minutes = Math.max(1, Math.ceil(Number(retryAfterSec || 60) / 60));
  return `Muitas tentativas de login. Aguarde ${minutes} minuto${minutes > 1 ? 's' : ''} e tente novamente. `
    + 'Se esqueceu a senha, peça a redefinição ao administrador.';
}

/* ------------------------- armazenamento (Neon) --------------------------- */

let tableReady = null; // uma criação por instância da função, não por requisição

async function ensureTable(sql) {
  if (!tableReady) {
    tableReady = sql`
      CREATE TABLE IF NOT EXISTS central_login_throttle (
        key TEXT PRIMARY KEY,
        count INTEGER NOT NULL,
        window_start TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `.catch((error) => { tableReady = null; throw error; });
  }
  return tableReady;
}

export function createNeonThrottleStore(sql, { random = Math.random } = {}) {
  const ageOf = (row) => ({ count: Number(row.count), ageMs: Math.max(0, Number(row.age_ms)) });
  return {
    async peek(keys) {
      await ensureTable(sql);
      const rows = await sql`
        SELECT key, count, EXTRACT(EPOCH FROM (NOW() - window_start)) * 1000 AS age_ms
        FROM central_login_throttle
        WHERE key = ANY(${keys})
      `;
      return new Map(rows.map((row) => [row.key, ageOf(row)]));
    },
    async hit(key, windowMs) {
      await ensureTable(sql);
      const windowSec = windowMs / 1000;
      const rows = await sql`
        INSERT INTO central_login_throttle AS t (key, count, window_start)
        VALUES (${key}, 1, NOW())
        ON CONFLICT (key) DO UPDATE SET
          count = CASE WHEN t.window_start < NOW() - make_interval(secs => ${windowSec}) THEN 1 ELSE t.count + 1 END,
          window_start = CASE WHEN t.window_start < NOW() - make_interval(secs => ${windowSec}) THEN NOW() ELSE t.window_start END
        RETURNING count, EXTRACT(EPOCH FROM (NOW() - window_start)) * 1000 AS age_ms
      `;
      return ageOf(rows[0]);
    },
    async touch(key) {
      await ensureTable(sql);
      await sql`
        INSERT INTO central_login_throttle (key, count, window_start)
        VALUES (${key}, 1, NOW())
        ON CONFLICT (key) DO UPDATE SET count = 1, window_start = NOW()
      `;
    },
    async clear(key) {
      await ensureTable(sql);
      await sql`DELETE FROM central_login_throttle WHERE key = ${key}`;
    },
    /** Limpeza ocasional (1 em 100): apaga o que já passou da validade das "redes conhecidas". */
    async maybePrune() {
      if (random() >= 0.01) return;
      await sql`DELETE FROM central_login_throttle WHERE window_start < NOW() - interval '40 days'`;
    },
  };
}
