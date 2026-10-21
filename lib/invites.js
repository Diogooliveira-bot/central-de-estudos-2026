import crypto from 'node:crypto';

export const INVITE_TTL_DAYS = 7;
export const INVITE_MAX_ACTIVE = 100;

export function createInviteToken() {
  return crypto.randomBytes(32).toString('base64url');
}

export function validInviteToken(token) {
  return typeof token === 'string' && /^[a-zA-Z0-9_-]{43}$/.test(token);
}

export function hashInviteToken(token) {
  if (!validInviteToken(token)) return '';
  return crypto.createHash('sha256').update(token, 'utf8').digest('hex');
}

export function inviteStatus(row, now = Date.now()) {
  if (row.revoked_at) return 'revogado';
  if (row.used_at) return 'utilizado';
  if (new Date(row.expires_at).getTime() <= now) return 'expirado';
  return 'pendente';
}

export async function ensureInvitesTable(sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS central_student_invites (
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
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS central_student_invites_created_idx ON central_student_invites (created_at DESC)`;
}
