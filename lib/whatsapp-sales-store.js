import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes, randomUUID } from "node:crypto";

function privacyKeys(env) {
  const encryptionKey = Buffer.from(env.SALES_CONTEXT_ENCRYPTION_KEY || "", "base64");
  if (!env.SALES_HASH_KEY || encryptionKey.length !== 32) throw new Error("Chaves privadas da atendente não configuradas");
  return { hashKey: env.SALES_HASH_KEY, encryptionKey };
}

export function hashContact(phone, env = process.env) {
  const { hashKey } = privacyKeys(env);
  return createHmac("sha256", hashKey).update(String(phone)).digest("hex");
}

export function encrypt(value, env = process.env) {
  const { encryptionKey } = privacyKeys(env); const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey, iv);
  const ciphertext = Buffer.concat([cipher.update(JSON.stringify(value), "utf8"), cipher.final()]);
  return { ciphertext: ciphertext.toString("base64"), iv: iv.toString("base64"), tag: cipher.getAuthTag().toString("base64") };
}

export function decrypt(record, env = process.env) {
  const { encryptionKey } = privacyKeys(env);
  const decipher = createDecipheriv("aes-256-gcm", encryptionKey, Buffer.from(record.iv, "base64"));
  decipher.setAuthTag(Buffer.from(record.tag, "base64"));
  return JSON.parse(Buffer.concat([decipher.update(Buffer.from(record.ciphertext, "base64")), decipher.final()]).toString("utf8"));
}

export function createStore(sql) {
  return {
    async claimEvent(id) {
      const rows = await sql`INSERT INTO whatsapp_sales_events (message_id,state) VALUES (${id},'processing') ON CONFLICT (message_id) DO UPDATE SET state='processing',updated_at=now() WHERE whatsapp_sales_events.state='failed' OR whatsapp_sales_events.updated_at < now()-interval '2 minutes' RETURNING message_id`;
      return rows.length > 0;
    },
    async finishEvent(id, state) { await sql`UPDATE whatsapp_sales_events SET state=${state},updated_at=now() WHERE message_id=${id}`; },
    async takeContactQuota(hash, max, ttl) {
      const rows = await sql`INSERT INTO whatsapp_sales_conversations (contact_hash,message_count,day_started_at,expires_at) VALUES (${hash},1,CURRENT_DATE,now()+(${ttl}*interval '1 day')) ON CONFLICT (contact_hash) DO UPDATE SET message_count=CASE WHEN whatsapp_sales_conversations.day_started_at<CURRENT_DATE THEN 1 ELSE whatsapp_sales_conversations.message_count+1 END,day_started_at=CURRENT_DATE,updated_at=now(),expires_at=now()+(${ttl}*interval '1 day') WHERE whatsapp_sales_conversations.day_started_at<CURRENT_DATE OR whatsapp_sales_conversations.message_count<${max} RETURNING contact_hash`;
      return rows.length > 0;
    },
    async takeClaudeQuota(max) {
      const rows = await sql`INSERT INTO whatsapp_sales_usage (usage_day,claude_calls) VALUES (CURRENT_DATE,1) ON CONFLICT (usage_day) DO UPDATE SET claude_calls=whatsapp_sales_usage.claude_calls+1 WHERE whatsapp_sales_usage.claude_calls<${max} RETURNING usage_day`;
      return rows.length > 0;
    },
    async readContext(hash) {
      const rows = await sql`SELECT context_ciphertext AS ciphertext,context_iv AS iv,context_tag AS tag FROM whatsapp_sales_conversations WHERE contact_hash=${hash} AND expires_at>now()`;
      return rows[0]?.ciphertext ? rows[0] : null;
    },
    async writeContext(hash, data) { await sql`UPDATE whatsapp_sales_conversations SET context_ciphertext=${data.ciphertext},context_iv=${data.iv},context_tag=${data.tag},updated_at=now() WHERE contact_hash=${hash}`; },
    async clearContext(hash) { await sql`DELETE FROM whatsapp_sales_conversations WHERE contact_hash=${hash}`; },
    async optedOut(hash) { const rows = await sql`SELECT contact_hash FROM whatsapp_sales_opt_out WHERE contact_hash=${hash}`; return rows.length > 0; },
    async addOptOut(hash) { await sql`INSERT INTO whatsapp_sales_opt_out(contact_hash) VALUES (${hash}) ON CONFLICT (contact_hash) DO NOTHING`; },
    async clearOptOut(hash) { await sql`DELETE FROM whatsapp_sales_opt_out WHERE contact_hash=${hash}`; },
    async purgeExpired() {
      await sql`DELETE FROM whatsapp_sales_conversations WHERE expires_at<=now()`;
      await sql`DELETE FROM whatsapp_sales_events WHERE updated_at<now()-interval '90 days'`;
      await sql`DELETE FROM whatsapp_sales_usage WHERE usage_day<CURRENT_DATE-interval '90 days'`;
    },
    async createInviteLink(baseUrl) {
      const token = randomBytes(32).toString("base64url");
      const tokenHash = createHash("sha256").update(token, "utf8").digest("hex");
      const id = randomUUID();
      const expiresAt = new Date(Date.now() + 7 * 86400000).toISOString();
      const rows = await sql`WITH active AS (SELECT COUNT(*)::int AS total FROM central_student_invites WHERE used_at IS NULL AND revoked_at IS NULL AND expires_at>now()), created AS (INSERT INTO central_student_invites(invitation_id,token_hash,invited_email,recipient_name,created_by,expires_at) SELECT ${id},${tokenHash},NULL,'Cadastro solicitado pelo WhatsApp','whatsapp-sales-assistant',${expiresAt} FROM active WHERE total<100 RETURNING invitation_id) SELECT invitation_id FROM created`;
      if (!rows.length) throw new Error("Convite não criado");
      return { url: `${baseUrl.replace(/\/$/, "")}/convite.html?token=${encodeURIComponent(token)}`, tokenHash };
    },
    async revokeSalesInvite(tokenHash) { await sql`UPDATE central_student_invites SET revoked_at=now() WHERE token_hash=${tokenHash} AND used_at IS NULL AND revoked_at IS NULL`; },
  };
}

export async function neonStore(databaseUrl) {
  const { neon } = await import("@neondatabase/serverless");
  return createStore(neon(databaseUrl));
}
