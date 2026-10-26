export const SUPPORT_EMAIL = process.env.SALES_SUPPORT_EMAIL || "basecompleta.estudos@gmail.com";

export const FACTS = Object.freeze({
  "product": "A Base Completa é uma plataforma de estudos para concursos públicos, com disciplinas básicas organizadas por módulos. O objetivo é construir uma base forte para vários concursos, sem se limitar a um edital.",
  "free": "O Gratuito inclui teoria resumida, Vade Mecum, até 20 questões por dia no Lei em Dia e edital verticalizado para marcar o que estudou, sem sincronizar o progresso. Não inclui cadernos e links TEC/QC.",
  "premium": "O Premium inclui teoria completa e resumida, questões e revisões por módulo, filtros de cadernos do TEC Concursos e do QConcursos por módulo, Lei em Dia completo, Vade Mecum com destaques, edital verticalizado com progresso, agenda e atualizações durante o acesso. TEC e QConcursos são plataformas externas, e as assinaturas delas não estão incluídas.",
  "price": "Preço de lançamento do Premium: R$ 97 por 6 meses (equivalente a R$ 16,17/mês) ou R$ 194 por 12 meses. É acesso por período, não mensalidade recorrente. Não prometa desconto adicional.",
  "checkout": "Pagamento pela Hotmart. Link oficial confirmado para o semestral: https://pay.hotmart.com/B108186453Y?off=o4y1mlg9. Para o anual, oriente a consultar a Central ou o suporte; não invente link.",
  "supportEmail": "basecompleta.estudos@gmail.com"
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
  const n = String(text).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const asksPrice = /preco|valor|custa|mensalidade|desconto|parcel|a vista|planos/.test(n);
  const mentionsPremium = /premium|tec concursos|qconcursos|\bqc\b/.test(n);
  if (/paguei|compra aprovada|comprovante|reembolso|cancelamento|estorno|nao liberou|nao recebi acesso/.test(n)) {
    return 'Não consigo confirmar pagamentos ou liberar acesso pelo WhatsApp. Se você já comprou, confira o e-mail informado na Hotmart e, se precisar, escreva para ' + SUPPORT_EMAIL + '. Nunca envie senha ou dados de cartão.';
  }
  if (/comprar|assinar|checkout|link de pagamento|quero o premium|como pagar/.test(n)) {
    return FACTS.price + ' ' + FACTS.checkout + ' A confirmação e liberação do acesso dependem da Hotmart e da Central.';
  }
  if (asksPrice) return FACTS.price + ' ' + FACTS.checkout;
  if (mentionsPremium) return FACTS.premium + ' ' + FACTS.price;
  if (/gratuito|gratis|free|questoes|lei em dia|vade|edital/.test(n)) return FACTS.free;
  if (/o que e|sobre a base|plataforma|como funciona|acessar|acesso|materias|disciplinas/.test(n)) {
    return FACTS.product + ' Você pode começar gratuitamente e depois escolher o Premium.';
  }
  return 'Posso explicar os planos, os materiais e como estudar na Base Completa. Para algo específico, escreva para ' + SUPPORT_EMAIL + '.';
}

export function requiresClaude(text, env = process.env) {
  if (!env.SALES_ANTHROPIC_API_KEY || isSignupIntent(text)) return false;
  const n = String(text).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  return !/preco|valor|custa|mensalidade|desconto|parcel|planos|a vista|comprar|assinar|checkout|pagamento|paguei|cartao|reembolso|cancelamento|comprovante|estorno|premium|tec concursos|qconcursos|\bqc\b|gratuito|gratis|free|questoes|lei em dia|vade|edital|o que e|sobre a base|plataforma|como funciona|acessar|acesso|materias|disciplinas/.test(n);
}

export function systemPrompt() {
  return [
    "Você é uma atendente virtual da Base Completa. Fale português brasileiro simples, natural e curto.",
    "Fique no assunto de apresentação e uso geral da plataforma. Não acesse nem chame funções administrativas, não consulte alunos, não veja pagamentos e não afirme que compra foi aprovada.",
    "Não invente preço, desconto, condição, recurso ou link. Use os preços e o link Hotmart aprovados nos fatos. Nunca diga que pagamento foi aprovado ou que o Premium já foi liberado.",
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
