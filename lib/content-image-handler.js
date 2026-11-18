/* Imagens incorporadas aos módulos: upload exclusivo do administrador. */
import { randomUUID } from 'node:crypto';
import { requireSession, sameOriginRequest, readJsonBody } from './auth.js';
import { requirePlanFeature } from './plan-access.js';
import { contentEditorReadFeature } from './content-editor-access.js';

const UUID = /^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/i;
const MAX_BYTES = 900_000;
const MAX_JSON = 1_500_000;

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}
async function ensureTable(sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS central_content_images (
      image_id UUID PRIMARY KEY,
      content_id TEXT NOT NULL,
      mime_type TEXT NOT NULL DEFAULT 'image/webp',
      image_bytes BYTEA NOT NULL,
      uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}
export function validWebp(bytes) {
  return bytes.length >= 16 &&
    bytes.toString('ascii', 0, 4) === 'RIFF' &&
    bytes.toString('ascii', 8, 12) === 'WEBP' &&
    ['VP8 ', 'VP8L', 'VP8X'].includes(bytes.toString('ascii', 12, 16));
}

export async function handleContentImage(req, res) {
  try {
    const method = String(req.method || '').toUpperCase();
    if (method === 'GET') {
      // Acesso à imagem herda a classificação do material ao qual ela pertence:
      // revisões guiadas são gratuitas, teoria completa continua Premium.
      const session = await requireSession(req, ['admin', 'editor', 'aluno']);
      if (!session.ok) return json(res, session.status, { error: session.error });
      const id = String(req.query?.id || '');
      if (!UUID.test(id)) return json(res, 400, { error: 'Imagem inválida' });
      const rows = await session.sql`SELECT content_id, encode(image_bytes,'base64') AS base64 FROM central_content_images WHERE image_id=${id}::uuid LIMIT 1`;
      if (!rows.length) return json(res, 404, { error: 'Imagem não encontrada' });
      const access = await requirePlanFeature(req, contentEditorReadFeature(rows[0].content_id), ['admin', 'editor', 'aluno']);
      if (!access.ok) return json(res, access.status, { error: access.error });
      const data = Buffer.from(rows[0].base64, 'base64');
      res.statusCode = 200;
      res.setHeader('Content-Type', 'image/webp');
      res.setHeader('Content-Length', String(data.length));
      res.setHeader('Cache-Control', 'private, no-store');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      return res.end(data);
    }
    if (method !== 'POST') {
      res.setHeader('Allow', 'GET, POST');
      return json(res, 405, { error: 'Método não permitido' });
    }
    if (!sameOriginRequest(req)) return json(res, 403, { error: 'Origem não permitida' });
    const auth = await requireSession(req, ['admin']);
    if (!auth.ok) return json(res, auth.status, { error: auth.error });
    const body = await readJsonBody(req);
    const contentId = String(body?.contentId || '').trim();
    const value = String(body?.dataUrl || '');
    if (!/^reader:[a-z0-9]{1,50}$/.test(contentId)) return json(res, 400, { error: 'Módulo inválido' });
    if (value.length > MAX_JSON) return json(res, 413, { error: 'Imagem muito grande' });
    const match = /^data:image\/webp;base64,([A-Za-z0-9+/]+={0,2})$/.exec(value);
    if (!match) return json(res, 400, { error: 'Envie uma imagem WebP válida' });
    const bytes = Buffer.from(match[1], 'base64');
    if (!bytes.length || bytes.length > MAX_BYTES) return json(res, 413, { error: 'Imagem acima do limite de 900 KB' });
    if (!validWebp(bytes)) return json(res, 400, { error: 'Formato de imagem inválido' });
    const sql = auth.sql;
    await ensureTable(sql);
    const id = randomUUID();
    await sql`INSERT INTO central_content_images (image_id,content_id,mime_type,image_bytes) VALUES (${id}::uuid,${contentId},'image/webp',decode(${match[1]},'base64'))`;
    return json(res, 201, { ok: true, id, url: '/api/content-editor?action=image&id=' + encodeURIComponent(id) });
  } catch (error) {
    console.error('content images error', String(error?.code || error?.name || 'UNKNOWN').slice(0, 32));
    if (Number(error?.statusCode) === 413) return json(res, 413, { error: 'Solicitação acima do limite permitido' });
    return json(res, 500, { error: 'Falha ao processar imagem' });
  }
}
