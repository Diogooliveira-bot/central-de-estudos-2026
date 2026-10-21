import crypto from 'node:crypto';
import {
  createSessionToken, database, ensureUsersTable, hashPassword, normalizeEmail,
  publicUser, readJsonBody, requireSession, sameOriginRequest, sessionCookie,
  validatePassword,
} from '../lib/auth.js';
import {
  createInviteToken, ensureInvitesTable, hashInviteToken, inviteStatus,
  INVITE_MAX_ACTIVE, INVITE_TTL_DAYS, validInviteToken,
} from '../lib/invites.js';

function send(res, status, body, headers = {}) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  for (const [name, value] of Object.entries(headers)) res.setHeader(name, value);
  res.end(JSON.stringify(body));
}

const validEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const cleanName = name => String(name || '').trim().replace(/\s+/g, ' ').slice(0, 120);

async function checkInvite(req, res) {
  const token = String(req.query?.token || '');
  if (!validInviteToken(token)) return send(res, 404, { error: 'Convite inválido ou indisponível' });
  const sql = database();
  await ensureInvitesTable(sql);
  const rows = await sql`
    SELECT invited_email, recipient_name, expires_at, used_at, revoked_at
    FROM central_student_invites WHERE token_hash=${hashInviteToken(token)} LIMIT 1
  `;
  const row = rows[0];
  if (!row || inviteStatus(row) !== 'pendente') {
    return send(res, 410, { error: 'Este convite expirou, foi utilizado ou foi cancelado' });
  }
  return send(res, 200, {
    valid: true,
    invitedEmail: row.invited_email || null,
    recipientName: row.recipient_name || null,
    expiresAt: row.expires_at,
  });
}

async function redeemInvite(req, res) {
  const body = await readJsonBody(req);
  const token = String(body.token || '');
  const name = cleanName(body.name);
  const email = normalizeEmail(body.email);
  const password = String(body.password || '');
  if (!validInviteToken(token)) return send(res, 404, { error: 'Convite inválido ou indisponível' });
  if (!name) return send(res, 400, { error: 'Informe seu nome' });
  if (!validEmail(email)) return send(res, 400, { error: 'Informe um e-mail válido' });
  const passwordError = validatePassword(password);
  if (passwordError) return send(res, 400, { error: passwordError });

  const sql = database();
  await ensureUsersTable(sql);
  await ensureInvitesTable(sql);
  const hash = hashInviteToken(token);
  const invitations = await sql`
    SELECT invited_email, expires_at, used_at, revoked_at
    FROM central_student_invites WHERE token_hash=${hash} LIMIT 1
  `;
  const invited = invitations[0];
  if (!invited || inviteStatus(invited) !== 'pendente') {
    return send(res, 410, { error: 'Este convite expirou, foi utilizado ou foi cancelado' });
  }
  if (invited.invited_email && invited.invited_email !== email) {
    return send(res, 403, { error: 'Este convite está reservado para outro e-mail' });
  }
  const existing = await sql`SELECT 1 FROM central_users WHERE LOWER(email)=${email} LIMIT 1`;
  if (existing.length) return send(res, 409, { error: 'Este e-mail já possui uma conta. Entre com sua senha.' });

  const id = crypto.randomUUID();
  const passwordHash = hashPassword(password);
  // As duas operações acontecem na MESMA instrução SQL: caso o INSERT falhe,
  // o UPDATE do convite também é desfeito. Uma corrida não cria duas contas.
  let users;
  try {
    users = await sql`
      WITH claimed AS (
        UPDATE central_student_invites
        SET used_at=NOW(), used_by=${id}
        WHERE token_hash=${hash}
          AND used_at IS NULL AND revoked_at IS NULL AND expires_at > NOW()
          AND (invited_email IS NULL OR invited_email=${email})
        RETURNING invitation_id
      ), created AS (
        INSERT INTO central_users(user_id,name,email,role,password_hash,active)
        SELECT ${id}, ${name}, ${email}, 'aluno', ${passwordHash}, TRUE
        FROM claimed
        RETURNING user_id,name,email,role,active,session_version,created_at,updated_at,last_login
      )
      SELECT * FROM created
    `;
  } catch (error) {
    if (error?.code === '23505') return send(res, 409, { error: 'Este e-mail já possui uma conta' });
    throw error;
  }
  if (!users.length) return send(res, 410, { error: 'Convite já utilizado ou indisponível' });
  const user = users[0];
  return send(res, 201, { ok: true, user: publicUser(user) }, {
    'Set-Cookie': sessionCookie(createSessionToken(user)),
  });
}

async function listInvites(res, sql) {
  await ensureInvitesTable(sql);
  const rows = await sql`
    SELECT i.invitation_id, i.invited_email, i.recipient_name, i.created_at,
           i.expires_at, i.used_at, i.revoked_at, u.name AS used_by_name
    FROM central_student_invites i
    LEFT JOIN central_users u ON u.user_id=i.used_by
    ORDER BY i.created_at DESC LIMIT 200
  `;
  return send(res, 200, {
    invites: rows.map(row => ({
      id: row.invitation_id,
      email: row.invited_email,
      recipientName: row.recipient_name,
      createdAt: row.created_at,
      expiresAt: row.expires_at,
      usedAt: row.used_at,
      usedByName: row.used_by_name,
      status: inviteStatus(row),
    })),
  });
}

async function createInvite(req, res, sql, admin) {
  const body = await readJsonBody(req);
  const email = normalizeEmail(body.email);
  const recipientName = cleanName(body.recipientName);
  if (email && !validEmail(email)) return send(res, 400, { error: 'Informe um e-mail válido ou deixe em branco' });
  if (!email && !recipientName) return send(res, 400, { error: 'Informe ao menos o nome ou o e-mail do destinatário' });
  await ensureInvitesTable(sql);
  if (email) {
    const users = await sql`SELECT 1 FROM central_users WHERE LOWER(email)=${email} LIMIT 1`;
    if (users.length) return send(res, 409, { error: 'Esse e-mail já está cadastrado na Central' });
  }
  const [{ count }] = await sql`
    SELECT COUNT(*)::int AS count FROM central_student_invites
    WHERE used_at IS NULL AND revoked_at IS NULL AND expires_at > NOW()
  `;
  if (Number(count) >= INVITE_MAX_ACTIVE) return send(res, 429, { error: 'Limite de convites pendentes atingido. Revogue os antigos.' });
  const token = createInviteToken();
  const expiresAt = new Date(Date.now() + INVITE_TTL_DAYS * 86400000).toISOString();
  const id = crypto.randomUUID();
  await sql`
    INSERT INTO central_student_invites
      (invitation_id, token_hash, invited_email, recipient_name, created_by, expires_at)
    VALUES (${id}, ${hashInviteToken(token)}, ${email || null},
            ${recipientName || null}, ${admin.id}, ${expiresAt})
  `;
  // O token em texto puro nunca fica armazenado. Esta é a única resposta que o contém.
  return send(res, 201, { ok: true, token, id, expiresAt });
}

async function revokeInvite(req, res, sql) {
  const body = await readJsonBody(req);
  const id = String(body.id || '');
  if (!/^[0-9a-f-]{36}$/i.test(id)) return send(res, 400, { error: 'Identificador de convite inválido' });
  await ensureInvitesTable(sql);
  const rows = await sql`
    UPDATE central_student_invites SET revoked_at=NOW()
    WHERE invitation_id=${id} AND used_at IS NULL AND revoked_at IS NULL
    RETURNING invitation_id
  `;
  if (!rows.length) return send(res, 409, { error: 'Convite já utilizado, revogado ou inexistente' });
  return send(res, 200, { ok: true });
}

export default async function handler(req, res) {
  try {
    const action = String(req.query?.action || '').toLowerCase();
    if (req.method === 'POST' && !sameOriginRequest(req)) {
      return send(res, 403, { error: 'Origem da requisição não permitida' });
    }
    if (req.method === 'GET' && action === 'check') return checkInvite(req, res);
    if (req.method === 'POST' && action === 'redeem') return redeemInvite(req, res);

    const session = await requireSession(req, ['admin']);
    if (!session.ok) return send(res, session.status, { error: session.error });
    if (req.method === 'GET' && action === 'admin') return listInvites(res, session.sql);
    if (req.method === 'POST' && action === 'create') return createInvite(req, res, session.sql, session.user);
    if (req.method === 'POST' && action === 'revoke') return revokeInvite(req, res, session.sql);
    return send(res, 404, { error: 'Ação de convite inválida' });
  } catch (error) {
    console.error('invites api error', error);
    return send(res, 500, { error: 'Não foi possível concluir a solicitação' });
  }
}
