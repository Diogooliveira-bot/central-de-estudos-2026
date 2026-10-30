import crypto from 'node:crypto';
import { publicAppBase } from './public-app-url.js';
import {
  clearSessionCookie,
  database,
  ensureUsersTable,
  hashPassword,
  normalizeEmail,
  readJsonBody,
  sameOriginRequest,
  validatePassword,
} from './auth.js';

export const PASSWORD_RESET_TTL_MINUTES = 30;
const GENERIC_MESSAGE = 'Se houver uma conta ativa com esse e-mail, você receberá um link de recuperação. Verifique também o spam.';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function newResetToken() {
  return crypto.randomBytes(32).toString('base64url');
}
export function validResetToken(value) {
  return typeof value === 'string' && /^[A-Za-z0-9_-]{43}$/.test(value);
}
export function resetTokenHash(token) {
  return validResetToken(token) ? crypto.createHash('sha256').update(token).digest('hex') : '';
}
export function rateIdentity(kind, value, secret = process.env.AUTH_SECRET || '') {
  if (typeof secret !== 'string' || secret.length < 32) throw new Error('Segredo de autenticação indisponível');
  return crypto.createHmac('sha256', secret).update(kind + ':' + value).digest('hex');
}

export function resetPageBase(env = process.env) {
  return publicAppBase(env);
}

export function emailConfig(env = process.env) {
  const email = String(env.GMAIL_USER || '').trim().toLowerCase();
  const password = String(env.GMAIL_APP_PASSWORD || '').replace(/\s+/g, '');
  // Evitar remetente arbitrário: Gmail só pode enviar como a conta autenticada.
  if (!/^[a-z0-9][a-z0-9._+-]*@gmail\.com$/.test(email) || !/^[A-Za-z0-9]{16}$/.test(password)) {
    return null;
  }
  return { user: email, password, from: 'Base Completa <' + email + '>' };
}

export function gmailSmtpOptions(config) {
  if (!config?.user || !config?.password) throw new Error('Conta de envio Gmail não configurada');
  return {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user: config.user, pass: config.password },
    tls: { servername:'smtp.gmail.com', minVersion:'TLSv1.2' },
    connectionTimeout: 9000, greetingTimeout: 9000, socketTimeout: 12000,
  };
}

export async function deliverViaGmail(message, config) {
  const { default: nodemailer } = await import('nodemailer');
  const transporter = nodemailer.createTransport(gmailSmtpOptions(config));
  try {
    const result = await transporter.sendMail(message);
    if (!result?.messageId || !result.accepted?.includes(message.to)) {
      throw new Error('Gmail não confirmou a entrega para o destinatário');
    }
    return result.messageId;
  } finally {
    transporter.close();
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (letter) => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;',
  })[letter]);
}

export async function sendResetEmail({ to, link, id, config, transport = deliverViaGmail }) {
  if (!config) throw new Error('Serviço de e-mail não configurado');
  const subject = 'Redefinição de senha · Base Completa';
  const safeLink = escapeHtml(link);
  const html = '<div style="background:#f5f8fb;padding:30px;font-family:Arial,sans-serif;color:#153049"><div style="max-width:480px;margin:auto;background:white;padding:32px;border-radius:16px"><p style="color:#117c87;font-weight:bold;letter-spacing:2px;font-size:11px">BASE COMPLETA</p><h1 style="font-size:24px;margin:18px 0">Recuperar sua senha</h1><p style="line-height:1.6">Recebemos uma solicitação para redefinir a senha da sua Central de Estudos.</p><p style="margin:26px 0"><a href="' + safeLink + '" style="background:#10364c;color:white;padding:14px 22px;border-radius:9px;text-decoration:none;font-weight:bold">Criar nova senha</a></p><p style="color:#65788a;font-size:13px;line-height:1.6">Este link é válido por 30 minutos e pode ser usado somente uma vez. Se você não solicitou a alteração, ignore esta mensagem.</p></div></div>';
  const text = 'Base Completa — Recuperação de senha\n\nAbra o link para criar uma nova senha:\n' + link + '\n\nVálido por 30 minutos e para apenas um uso. Se você não solicitou esta alteração, ignore esta mensagem.';
  return transport({from:config.from,to,subject,html,text,messageId:'<'+id+'@basecompleta.local>'},config);
}

export async function ensurePasswordResetTables(sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS central_password_resets (
      token_hash TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES central_users(user_id) ON DELETE CASCADE,
      requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      expires_at TIMESTAMPTZ NOT NULL,
      delivery_status TEXT NOT NULL DEFAULT 'pending',
      used_at TIMESTAMPTZ
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS central_password_resets_user_idx ON central_password_resets(user_id, requested_at DESC)`;
  await sql`
    CREATE TABLE IF NOT EXISTS central_password_reset_limits (
      identity_hash TEXT PRIMARY KEY,
      window_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      last_requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      attempt_count INTEGER NOT NULL DEFAULT 1
    )
  `;
}

async function reserveRate(sql, hash, limit, seconds) {
  // Rate-limit persistente e atômico em Neon, válido entre múltiplas instâncias da Vercel.
  const rows = await sql`
    INSERT INTO central_password_reset_limits (identity_hash, window_start, last_requested_at, attempt_count)
    VALUES (${hash}, NOW(), NOW(), 1)
    ON CONFLICT (identity_hash) DO UPDATE SET
      window_start=CASE WHEN central_password_reset_limits.window_start < NOW() - INTERVAL '1 hour'
                        THEN NOW() ELSE central_password_reset_limits.window_start END,
      attempt_count=CASE WHEN central_password_reset_limits.window_start < NOW() - INTERVAL '1 hour'
                         THEN 1 ELSE central_password_reset_limits.attempt_count + 1 END,
      last_requested_at=NOW()
    WHERE central_password_reset_limits.window_start < NOW() - INTERVAL '1 hour'
       OR (central_password_reset_limits.attempt_count < ${limit}
           AND central_password_reset_limits.last_requested_at < NOW() - ${seconds} * INTERVAL '1 second')
    RETURNING identity_hash
  `;
  return rows.length > 0;
}

function respond(res, status, body, cookie) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, private');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (cookie) res.setHeader('Set-Cookie', cookie);
  res.end(JSON.stringify(body));
}

async function requestReset(req, res) {
  const cfg = emailConfig();
  // Nunca fingir que enviou e-mail sem um Gmail e senha de app configurados.
  if (!cfg) return respond(res, 503, { error:'A recuperação por e-mail ainda não está disponível. Solicite ajuda ao administrador.' });

  const body = await readJsonBody(req);
  const email = normalizeEmail(body.email);
  if (!EMAIL_PATTERN.test(email)) return respond(res, 400, { error:'Informe um e-mail válido' });

  const sql = database();
  await ensureUsersTable(sql);
  await ensurePasswordResetTables(sql);

  const emailAllowed = await reserveRate(sql, rateIdentity('email', email), 3, 60);
  // Independente de a conta existir, devolve a mesma resposta para evitar descoberta de usuários.
  if (!emailAllowed) return respond(res, 200, { ok:true, message:GENERIC_MESSAGE });

  const forwarded = String(req.headers?.['x-forwarded-for'] || '').split(',')[0].trim().slice(0, 65);
  if (forwarded && !await reserveRate(sql, rateIdentity('ip', forwarded), 15, 15)) {
    return respond(res, 200, { ok:true, message:GENERIC_MESSAGE });
  }

  const users = await sql`
    SELECT user_id,email FROM central_users WHERE LOWER(email)=${email}
      AND role IN ('aluno','editor','admin') AND active=TRUE LIMIT 1
  `;
  if (!users.length) return respond(res, 200, { ok:true, message:GENERIC_MESSAGE });

  const token = newResetToken();
  const hashed = resetTokenHash(token);
  const id = crypto.randomUUID();
  const link = resetPageBase() + '/recuperar-senha.html#token=' + encodeURIComponent(token);
  await sql`
    INSERT INTO central_password_resets(token_hash,user_id,expires_at)
    VALUES (${hashed}, ${users[0].user_id}, NOW() + INTERVAL '30 minutes')
  `;
  try {
    await sendResetEmail({ to:email, link, id, config:cfg });
    // Aceite do SMTP não prova entrega na caixa de entrada; não registrar e-mails ou tokens.
    console.info('password reset email accepted by SMTP');
    await sql`
      UPDATE central_password_resets SET delivery_status='sent'
      WHERE token_hash=${hashed} AND delivery_status='pending'
    `;
    await sql`
      UPDATE central_password_resets SET used_at=NOW()
      WHERE user_id=${users[0].user_id} AND token_hash<>${hashed}
        AND used_at IS NULL AND delivery_status='sent'
    `;
  } catch (error) {
    await sql`UPDATE central_password_resets SET delivery_status='failed', used_at=NOW() WHERE token_hash=${hashed}`;
    // Registrar somente códigos técnicos, jamais a mensagem SMTP (pode conter e-mail).
    const smtpCode = String(error?.code || 'UNKNOWN').replace(/[^A-Z0-9_]/gi, '').slice(0, 32);
    const smtpStatus = Number.isInteger(error?.responseCode) ? error.responseCode : null;
    console.error('password reset email delivery failed', { smtpCode, smtpStatus });
    // Mesma mensagem para conta existente ou inexistente.
  }
  return respond(res, 200, { ok:true, message:GENERIC_MESSAGE });
}

async function checkReset(req, res) {
  const body = await readJsonBody(req);
  const hashed = resetTokenHash(body.token);
  if (!hashed) return respond(res, 200, { valid:false });
  const sql = database();
  await ensureUsersTable(sql);
  await ensurePasswordResetTables(sql);
  const rows = await sql`
    SELECT 1 FROM central_password_resets r
    JOIN central_users u ON u.user_id=r.user_id
    WHERE r.token_hash=${hashed} AND r.used_at IS NULL AND r.delivery_status='sent'
      AND r.expires_at>NOW() AND u.active=TRUE AND u.role IN ('aluno','editor','admin')
    LIMIT 1
  `;
  return respond(res, 200, { valid:rows.length>0 });
}

export async function confirmReset(req, res, {sqlProvider=database, ensureUsers=ensureUsersTable, ensureTables=ensurePasswordResetTables}={}) {
  const body = await readJsonBody(req);
  const hashed = resetTokenHash(body.token);
  if (!hashed) return respond(res, 410, { error:'Link inválido ou expirado. Solicite outro.' });
  const password = String(body.password || '');
  const validation = validatePassword(password);
  if (validation) return respond(res, 400, { error:validation });

  // Optional dependency injection supports isolated negative/replay tests;
  // production continues to use the same database and table guards.
  const sql = sqlProvider();
  await ensureUsers(sql);
  await ensureTables(sql);
  const nextHash = hashPassword(password);
  // Claim e alteração atômicos. Se o token já foi usado, o UPDATE não retorna linha.
  const rows = await sql`
    WITH claimed AS (
      UPDATE central_password_resets r SET used_at=NOW()
      WHERE r.token_hash=${hashed} AND r.used_at IS NULL
        AND r.delivery_status='sent' AND r.expires_at>NOW()
        AND EXISTS (SELECT 1 FROM central_users u
          WHERE u.user_id=r.user_id AND u.active=TRUE AND u.role IN ('aluno','editor','admin'))
      RETURNING r.user_id
    ), changed AS (
      UPDATE central_users u SET
        password_hash=${nextHash}, failed_attempts=0, locked_until=NULL,
        session_version=session_version+1, updated_at=NOW()
      FROM claimed WHERE u.user_id=claimed.user_id
      RETURNING u.user_id
    )
    SELECT user_id FROM changed
  `;
  if (!rows.length) return respond(res, 410, { error:'Link inválido, expirado ou já utilizado. Solicite outro.' });
  await sql`
    UPDATE central_password_resets SET used_at=NOW()
    WHERE user_id=${rows[0].user_id} AND used_at IS NULL
  `;
  return respond(res, 200, { ok:true, message:'Senha alterada. Entre com sua nova senha.' }, clearSessionCookie());
}

export default async function handlePasswordReset(req, res, action) {
  if (req.method !== 'POST') return respond(res, 405, { error:'Método não permitido' });
  if (!sameOriginRequest(req)) return respond(res, 403, { error:'Origem não permitida' });
  try {
    if (action === 'request') return requestReset(req, res);
    if (action === 'check') return checkReset(req, res);
    if (action === 'confirm') return confirmReset(req, res);
    return respond(res, 404, { error:'Ação de recuperação inválida' });
  } catch (error) {
    console.error('password reset internal error', error?.name || 'Error');
    return respond(res, 503, { error:'Não foi possível concluir a recuperação agora. Tente novamente mais tarde.' });
  }
}
