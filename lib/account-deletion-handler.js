// Exclusão da própria conta pelo aluno (Termos de Uso, item 11; LGPD, art. 18, VI).
// - Somente alunos autenticados; contas de equipe (admin/editor) não se excluem por aqui.
// - Exige a senha atual e a palavra EXCLUIR; senha errada conta como tentativa de login.
// - Apaga a linha de central_users: as tabelas do aluno (progresso, sincronização,
//   preferências, assinaturas, aceites, backups, avisos e redefinições de senha) usam
//   ON DELETE CASCADE. Pedidos da Hotmart ficam com user_id nulo (ON DELETE SET NULL),
//   preservando o registro fiscal da compra sem vínculo com a conta.
// - Encerra a sessão no navegador.
import { clearSessionCookie, readJsonBody, recordFailedLogin, requireSession, sameOriginRequest, verifyPassword } from './auth.js';

export const DELETE_CONFIRMATION = 'EXCLUIR';

function answer(res, status, body, cookie) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (cookie) res.setHeader('Set-Cookie', cookie);
  res.end(JSON.stringify(body));
}

export function createAccountDeletionHandler({ getSession = requireSession, readBody = readJsonBody, verify = verifyPassword, failedLogin = recordFailedLogin } = {}) {
  return async function handle(req, res) {
    if (req.method !== 'POST') return answer(res, 405, { error: 'Método não permitido' });
    if (!sameOriginRequest(req)) return answer(res, 403, { error: 'Origem não permitida' });
    try {
      const session = await getSession(req, ['admin', 'editor', 'aluno']);
      if (!session.ok) return answer(res, session.status, { error: session.error });
      const { sql, user } = session;
      if (user.role !== 'aluno') return answer(res, 403, { error: 'Contas da equipe são excluídas pelo administrador.' });
      const body = await readBody(req);
      if (String(body?.confirmation || '').trim().toUpperCase() !== DELETE_CONFIRMATION)
        return answer(res, 400, { error: 'Digite EXCLUIR para confirmar.' });
      const password = String(body?.password || '');
      if (!password) return answer(res, 400, { error: 'Informe sua senha atual.' });
      const rows = await sql`
        SELECT password_hash, locked_until FROM central_users
        WHERE user_id=${user.id} AND active=TRUE LIMIT 1
      `;
      const row = rows[0];
      if (!row) return answer(res, 401, { error: 'Sessão inválida ou expirada' });
      if (row.locked_until && new Date(row.locked_until) > new Date())
        return answer(res, 429, { error: 'Muitas tentativas. Aguarde alguns minutos e tente novamente.' });
      if (!verify(password, row.password_hash)) {
        await failedLogin(sql, user.id);
        return answer(res, 401, { error: 'Senha incorreta.' });
      }
      // Pedido de cadastro gratuito ainda pendente com o mesmo e-mail (dado pessoal).
      await sql`DELETE FROM public.central_free_signup_pending WHERE LOWER(email)=${String(user.email || '').toLowerCase()}`;
      const deleted = await sql`
        DELETE FROM central_users WHERE user_id=${user.id} AND role='aluno' RETURNING user_id
      `;
      if (!deleted.length) return answer(res, 409, { error: 'Não foi possível excluir a conta. Tente novamente.' });
      console.info('account deletion', 'ok');
      return answer(res, 200, { ok: true }, clearSessionCookie());
    } catch (error) {
      console.error('account deletion failed', String(error?.code || error?.name || 'UNKNOWN').slice(0, 30));
      return answer(res, 500, { error: 'Não foi possível excluir a conta agora. Tente novamente mais tarde.' });
    }
  };
}

export default createAccountDeletionHandler();
