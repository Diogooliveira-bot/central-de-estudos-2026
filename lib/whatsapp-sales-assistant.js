export const SUPPORT_EMAIL = process.env.SALES_SUPPORT_EMAIL || "basecompleta.estudos@gmail.com";

export const FACTS = Object.freeze({
  product: "A Base Completa é uma central para organizar os estudos para concursos.",
  free: "O Gratuito inclui materiais resumidos, Vade Mecum, até 20 questões por dia no Lei em Dia e edital verticalizado para marcar assuntos estudados sem sincronização com a Central.",
  premium: "Os links e cadernos externos do TEC Concursos e QConcursos (QC) são exclusivos do Premium. A lista completa de benefícios do Premium ainda precisa de confirmação.",
  price: "Não há preço aprovado disponível para a atendente informar.",
  checkout: "O checkout do Mercado Pago ainda não está integrado.",
  supportEmail: SUPPORT_EMAIL,
});

export function redactPersonalData(text = "") {
  return String(text)
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[e-mail removido]")
    .replace(/\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/g, "[documento removido]")
    .replace(/\b(?:\+?55\s*)?(?:\(?\d{2}\)?\s*)?9?\d{4}[-.\s]?\d{4}\b/g, "[telefone removido]")
    .replace(/\b(?:\d[ -]*?){13,19}\b/g, "[número de cartão removido]")
    .replace(/(senha|password|código de segurança|cvv)\s*[:=]?\s*\S+/gi, "$1 [removido]")
    .slice(0, 1800);
}

export function isSignupIntent(text) {
  const n = String(text).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  return /\b(quero me cadastrar|quero cadastrar|vou me cadastrar|como me cadastro|fazer cadastro|link (?:de|para) cadastro|manda (?:o )?link|envia (?:o )?link|criar minha conta|criar conta|começar gratis|comecar gratis)\b/.test(n);
}

export function deterministicAnswer(text) {
  const n = String(text).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const asksPrice=/preco|valor|custa|mensalidade|desconto|parcel|a vista/.test(n);
  const mentionsPremium=/premium|tec concursos|qconcursos|\bqc\b/.test(n);
  if (asksPrice && mentionsPremium) return `Os links e cadernos externos do TEC Concursos e QConcursos (QC) são exclusivos do Premium. Ainda não tenho preço confirmado para informar. Para evitar informação errada, fale com ${SUPPORT_EMAIL}.`;
  if (asksPrice) return `Ainda não tenho preço confirmado para informar. Para evitar informação errada, fale com ${SUPPORT_EMAIL}.`;
  if (/mercado pago|checkout|pagamento|paguei|compra aprovada|cartao/.test(n)) return `O checkout ainda não está integrado e eu não consigo consultar ou confirmar pagamentos. Se for uma situação excepcional, escreva para ${SUPPORT_EMAIL}.`;
  if (mentionsPremium) return `${FACTS.premium} O preço ainda não foi confirmado.`;
  if (/gratuito|gratis|free|questoes|lei em dia|vade|edital/.test(n)) return FACTS.free;
  if (/o que e|sobre a base|plataforma|como funciona|acessar|acesso/.test(n)) return `${FACTS.product} Você pode começar pelo plano Gratuito e usar os recursos liberados nele.`;
  return `Não tenho essa informação confirmada. Posso explicar os planos e recursos da Base Completa. Para uma situação excepcional, escreva para ${SUPPORT_EMAIL}.`;
}

export function requiresClaude(text, env = process.env) {
  if (!env.SALES_ANTHROPIC_API_KEY || isSignupIntent(text)) return false;
  const n = String(text).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  return !/preco|valor|custa|mensalidade|desconto|parcel|mercado pago|checkout|pagamento|paguei|cartao|premium|tec concursos|qconcursos|\bqc\b|gratuito|gratis|free|questoes|lei em dia|vade|edital|o que e|sobre a base|plataforma|como funciona|acessar|acesso/.test(n);
}

export function systemPrompt() {
  return [
    "Você é uma atendente virtual da Base Completa. Fale português brasileiro simples, natural e curto.",
    "Fique no assunto de apresentação e uso geral da plataforma. Não acesse nem chame funções administrativas, não consulte alunos, não veja pagamentos e não afirme que compra foi aprovada.",
    "Não invente preço, desconto, condição, recurso ou link. Se não houver fato confirmado, diga isso e informe o e-mail de suporte.",
    "Nunca peça senha, cartão, documento ou código de segurança. Se receber dado pessoal, não repita.",
    `Fatos aprovados: ${JSON.stringify(FACTS)}. Suporte: ${SUPPORT_EMAIL}.`,
    "Responda em até 70 palavras e sem pressão de compra.",
  ].join("\n");
}

export async function generateReply({ text, history = [], env = process.env, fetchImpl = fetch }) {
  if (!requiresClaude(text, env)) return deterministicAnswer(text);
  const fallback = deterministicAnswer(text);
  try {
    const response = await fetchImpl("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": env.SALES_ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: env.SALES_ANTHROPIC_MODEL || "claude-haiku-4-5-20251001", max_tokens: 180, system: systemPrompt(), messages: [...history.slice(-6), { role: "user", content: redactPersonalData(text) }] }),
      signal: AbortSignal.timeout(12_000),
    });
    if (!response.ok) return fallback;
    const data = await response.json();
    return (data.content?.find((item) => item.type === "text")?.text || fallback).trim().slice(0, 1200);
  } catch { return fallback; }
}
