import { database, normalizeEmail, safeSecretEqual } from './auth.js';

// Safe first phase: inbox-only webhook for Vercel Preview.
// Do not enable production until purchase verification and automated provisioning exist.
export function webhookConfig(env = process.env) {
  const productId = String(env.HOTMART_PRODUCT_ID || '').trim();
  const semi = String(env.HOTMART_OFFER_6M_CODE || '').trim();
  const anual = String(env.HOTMART_OFFER_12M_CODE || '').trim();
  const hottok = String(env.HOTMART_HOTTOK || '').trim();
  if (env.VERCEL_ENV !== 'preview' ||
      env.HOTMART_TEST_RECEIVER_ENABLED !== 'true' ||
      !/^[0-9]{4,20}$/.test(productId) ||
      !/^[a-zA-Z0-9_-]{4,80}$/.test(semi) ||
      !/^[a-zA-Z0-9_-]{4,80}$/.test(anual) ||
      semi === anual || hottok.length < 24 || hottok.length > 256) return null;
  return { productId, hottok, offers: { [semi]: 6, [anual]: 12 } };
}

const SUPPORTED_EVENTS = new Set([
  'PURCHASE_APPROVED', 'PURCHASE_CANCELED', 'PURCHASE_REFUNDED',
  'PURCHASE_CHARGEBACK', 'PURCHASE_EXPIRED', 'PURCHASE_COMPLETE',
]);

/** Strict, independent of the checkout's payable total/discount. */
export function readHotmartEvent(body, config) {
  if (!body || typeof body !== 'object' || Array.isArray(body) || body.version !== '2.0.0') {
    return { error: 'Versão ou formato inválido' };
  }
  const eventName = String(body.event || '');
  if (!SUPPORTED_EVENTS.has(eventName)) return { ignored: true, reason: 'Evento não utilizado' };
  const productId = String(body.data?.product?.id || '');
  if (productId !== config.productId) return { ignored: true, reason: 'Produto fora da configuração' };

  const offerCode = String(body.data?.purchase?.offer?.code || '').trim();
  const months = Object.hasOwn(config.offers, offerCode) ? config.offers[offerCode] : null;
  if (!months) return { ignored: true, reason: 'Oferta não autorizada' };

  const eventId = String(body.id || '').trim();
  const transaction = String(body.data?.purchase?.transaction || '').trim();
  const email = normalizeEmail(body.data?.buyer?.email || '');
  if (!/^[a-zA-Z0-9_-]{5,120}$/.test(eventId) ||
      !/^[a-zA-Z0-9_-]{5,120}$/.test(transaction) ||
      !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
    return { error: 'Dados da transação incompletos' };
  }
  return { value: {
    eventId, eventName, transaction, productId, offerCode,
    months, email,
    createdAt: Number.isSafeInteger(body.creation_date) && body.creation_date > 0
      ? new Date(body.creation_date).toISOString() : null,
  } };
}

export async function ensureHotmartInbox(sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS public.central_hotmart_webhook_inbox (
      event_id TEXT PRIMARY KEY,
      event_name TEXT NOT NULL,
      transaction_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      offer_code TEXT NOT NULL,
      access_months SMALLINT NOT NULL CHECK (access_months IN (6,12)),
      buyer_email TEXT NOT NULL,
      hotmart_created_at TIMESTAMPTZ,
      received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      processing_state TEXT NOT NULL DEFAULT 'awaiting_integration'
         CHECK (processing_state IN ('awaiting_integration','processed','ignored','error'))
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS central_hotmart_webhook_transaction_idx
    ON public.central_hotmart_webhook_inbox(transaction_id, received_at)`;
}

function answer(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.end(JSON.stringify(data));
}

export function createHotmartWebhook({ env = process.env, sqlProvider = database } = {}) {
  return async (req, res) => {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return answer(res, 405, { error: 'Método não permitido' });
    }
    const config = webhookConfig(env);
    if (!config) return answer(res, 503, { error: 'Integração em preparação' });
    const received = String(req.headers?.['x-hotmart-hottok'] || '');
    if (!safeSecretEqual(received, config.hottok)) {
      return answer(res, 401, { error: 'Notificação não autorizada' });
    }
    if (!/^application\\/json(?:;|$)/i.test(String(req.headers?.['content-type'] || ''))) {
      return answer(res, 415, { error: 'Use JSON' });
    }
    const declaredLength = Number(req.headers?.['content-length'] || 0);
    if (!Number.isFinite(declaredLength) || declaredLength > 32768) {
      return answer(res, 413, { error: 'Notificação acima do tamanho permitido' });
    }
    try {
      let body = req.body;
      if (typeof body === 'string') body = JSON.parse(body);
      if (!body) {
        let bytes = 0, parts = [];
        for await (const chunk of req) {
          bytes += chunk.length;
          if (bytes > 32768) return answer(res, 413, { error: 'Notificação acima do tamanho permitido' });
          parts.push(chunk);
        }
        body = JSON.parse(Buffer.concat(parts).toString('utf8'));
      }
      if (Buffer.byteLength(JSON.stringify(body)) > 32768) return answer(res, 413, { error: 'Notificação acima do tamanho permitido' });
      const parsed = readHotmartEvent(body, config);
      if (parsed.error) return answer(res, 422, { error: parsed.error });
      if (parsed.ignored) return answer(res, 200, { ok: true, ignored: true });
      const { eventId, eventName, transaction, productId, offerCode, months, email, createdAt } = parsed.value;
      const sql = sqlProvider();
      await ensureHotmartInbox(sql);
      const rows = await sql`
        INSERT INTO public.central_hotmart_webhook_inbox
          (event_id,event_name,transaction_id,product_id,offer_code,
           access_months,buyer_email,hotmart_created_at)
        VALUES (${eventId},${eventName},${transaction},${productId},${offerCode},
                ${months},${email},${createdAt}::timestamptz)
        ON CONFLICT (event_id) DO NOTHING
        RETURNING event_id
      `;
      return answer(res, 200, { ok: true, received: true, duplicate: rows.length === 0 });
    } catch (err) {
      // No webhook tokens, payloads or buyer PII in Vercel logs.
      console.error('hotmart webhook intake failed', String(err?.code || err?.name || 'UNKNOWN').slice(0,32));
      return answer(res, 503, { error: 'Recebimento indisponível' });
    }
  };
}

export default createHotmartWebhook();
