import crypto from 'node:crypto';
import {
  hashPassword,
  normalizeEmail,
  normalizeRole,
  publicUser,
  readJsonBody,
  requireSession,
  validatePassword,
  sameOriginRequest,
} from '../lib/auth.js';

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

function cleanName(value) {
  return String(value || '').trim().replace(/\s+/g, ' ').slice(0, 120);
}
function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default async function handler(req, res) {
  try {
    if (req.method === 'POST' && !sameOriginRequest(req)) return send(res, 403, { error: 'Origem da requisição não permitida' });
    const session = await requireSession(req, ['admin']);
    if (!session.ok) return send(res, session.status, { error: session.error });
    const sql = session.sql;

    if (req.method === 'GET') {
      const rows = await sql`
        SELECT user_id,name,email,role,active,created_at,updated_at,last_login
        FROM central_users
        ORDER BY
          CASE role WHEN 'admin' THEN 1 WHEN 'editor' THEN 2 ELSE 3 END,
          name ASC
      `;
      return send(res, 200, { users: rows.map(publicUser), currentUserId: session.user.id });
    }

    if (req.method === 'POST') {
      const body = await readJsonBody(req);
      const action = String(body.action || '').toLowerCase();

      if (action === 'create') {
        const name = cleanName(body.name);
        const email = normalizeEmail(body.email);
        const role = normalizeRole(body.role);
        const password = String(body.password || '');
        const passwordError = validatePassword(password);
        if (!name) return send(res, 400, { error: 'Informe o nome' });
        if (!validEmail(email)) return send(res, 400, { error: 'Informe um e-mail válido' });
        if (!role) return send(res, 400, { error: 'Perfil inválido' });
        if (passwordError) return send(res, 400, { error: passwordError });

        const existing = await sql`SELECT user_id FROM central_users WHERE LOWER(email)=${email} LIMIT 1`;
        if (existing.length) return send(res, 409, { error: 'Já existe um usuário com este e-mail' });

        const rows = await sql`
          INSERT INTO central_users(user_id,name,email,role,password_hash,active)
          VALUES(${crypto.randomUUID()},${name},${email},${role},${hashPassword(password)},TRUE)
          RETURNING user_id,name,email,role,active,created_at,updated_at,last_login
        `;
        return send(res, 201, { ok: true, user: publicUser(rows[0]) });
      }

      if (action === 'update') {
        const userId = String(body.userId || '');
        if (!userId) return send(res, 400, { error: 'Usuário não informado' });
        if (userId === session.user.id && (body.active === false || (body.role && body.role !== 'admin'))) {
          return send(res, 400, { error: 'Você não pode remover seu próprio acesso de administrador' });
        }

        const found = await sql`
          SELECT user_id,name,email,role,active,created_at,updated_at,last_login
          FROM central_users WHERE user_id=${userId} LIMIT 1
        `;
        if (!found.length) return send(res, 404, { error: 'Usuário não encontrado' });

        const current = found[0];
        const name = body.name == null ? current.name : cleanName(body.name);
        const role = body.role == null ? current.role : normalizeRole(body.role);
        const active = body.active == null ? current.active : !!body.active;
        if (!name || !role) return send(res, 400, { error: 'Dados do usuário inválidos' });

        if (current.role === 'admin' && (role !== 'admin' || !active)) {
          const admins = await sql`SELECT COUNT(*)::int AS count FROM central_users WHERE role='admin' AND active=TRUE`;
          if (Number(admins[0]?.count || 0) <= 1) return send(res, 400, { error: 'A Central precisa manter pelo menos um administrador ativo' });
        }

        const rows = await sql`
          UPDATE central_users
          SET name=${name}, role=${role}, active=${active},
              session_version=session_version + CASE WHEN role IS DISTINCT FROM ${role} OR active IS DISTINCT FROM ${active} THEN 1 ELSE 0 END,
              updated_at=NOW()
          WHERE user_id=${userId}
          RETURNING user_id,name,email,role,active,created_at,updated_at,last_login
        `;
        return send(res, 200, { ok: true, user: publicUser(rows[0]) });
      }

      if (action === 'reset-password') {
        const userId = String(body.userId || '');
        const password = String(body.password || '');
        const passwordError = validatePassword(password);
        if (!userId) return send(res, 400, { error: 'Usuário não informado' });
        if (passwordError) return send(res, 400, { error: passwordError });

        const rows = await sql`
          UPDATE central_users
          SET password_hash=${hashPassword(password)}, failed_attempts=0, locked_until=NULL,
              session_version=session_version+1, updated_at=NOW()
          WHERE user_id=${userId}
          RETURNING user_id
        `;
        if (!rows.length) return send(res, 404, { error: 'Usuário não encontrado' });
        return send(res, 200, { ok: true });
      }

      return send(res, 400, { error: 'Ação inválida' });
    }

    res.setHeader('Allow', 'GET, POST');
    return send(res, 405, { error: 'Método não permitido' });
  } catch (error) {
    console.error('users api error', error);
    return send(res, 500, { error: error?.message || 'Falha interna ao gerenciar usuários' });
  }
}
