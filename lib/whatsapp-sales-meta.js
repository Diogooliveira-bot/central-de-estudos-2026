import { createHmac, timingSafeEqual } from "node:crypto";

function equal(a = "", b = "") {
  const x = Buffer.from(String(a)); const y = Buffer.from(String(b));
  return x.length === y.length && timingSafeEqual(x, y);
}

export function verifyMetaSignature(rawBody, signature, appSecret) {
  if (!rawBody || !signature?.startsWith("sha256=") || !appSecret) return false;
  const expected = `sha256=${createHmac("sha256", appSecret).update(rawBody).digest("hex")}`;
  return equal(signature, expected);
}

export function extractMessages(payload) {
  if (payload?.object !== "whatsapp_business_account" || !Array.isArray(payload.entry)) return [];
  return payload.entry.flatMap((entry) => (entry.changes || []).flatMap((change) => (change.value?.messages || [])
    .filter((message) => message.type === "text" && message.id && message.from && message.text?.body)
    .map((message) => ({ id: String(message.id), from: String(message.from), text: String(message.text.body).slice(0, 1800) }))));
}

export async function sendText({ to, text, env = process.env, fetchImpl = fetch }) {
  if (!env.WHATSAPP_GRAPH_VERSION || !env.WHATSAPP_PHONE_NUMBER_ID || !env.WHATSAPP_ACCESS_TOKEN) throw new Error("WhatsApp API não configurada");
  const url = `https://graph.facebook.com/${env.WHATSAPP_GRAPH_VERSION}/${env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
  const response = await fetchImpl(url, { method: "POST", headers: { authorization: `Bearer ${env.WHATSAPP_ACCESS_TOKEN}`, "content-type": "application/json" }, body: JSON.stringify({ messaging_product: "whatsapp", recipient_type: "individual", to, type: "text", text: { body: text } }), signal: AbortSignal.timeout(10_000) });
  if (!response.ok) throw new Error(`WhatsApp API returned ${response.status}`);
  return response.json();
}
