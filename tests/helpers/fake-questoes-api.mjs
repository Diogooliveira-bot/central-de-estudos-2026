// Servidor de mentira de /api/questoes para testes do navegador/jsdom.
// Reproduz o contrato real (enunciados sem gabarito; correção só em "responder"; limite diário do Gratuito).
export function installFakeQuestoesApi(w, { plan = 'free', limit = 5, answered = [], falhar = null } = {}) {
  const usados = new Set(answered);
  const chamadas = { responder: 0, modulo: 0, uso: 0 };
  const usage = () => plan === 'free'
    ? { plan: 'free', enabled: true, limit, used: usados.size, remaining: Math.max(0, limit - usados.size), answeredToday: [...usados], resetsAt: '00:00 America/Sao_Paulo' }
    : { plan, limit: null, used: 0, remaining: null, answeredToday: [] };
  const json = (status, body) => Promise.resolve({ ok: status >= 200 && status < 300, status, json: () => Promise.resolve(body) });
  w.fetch = (url, opts = {}) => {
    const u = new URL(String(url), 'https://app.example');
    if (u.pathname !== '/api/questoes') return json(404, {});
    if (falhar) return falhar === 'rede' ? Promise.reject(new Error('offline')) : json(falhar, { error: 'x' });
    const action = u.searchParams.get('action');
    if (action === 'uso') { chamadas.uso++; return json(200, { usage: usage() }); }
    if (action === 'modulo') {
      chamadas.modulo++;
      const items = (w.BC_QUESTOES?.[u.searchParams.get('disc')]?.[Number(u.searchParams.get('n'))] || [])
        .map(q => ({ id: q.id, q: q.q, options: q.options.slice(), origem: q.origem }));
      return items.length ? json(200, { items, usage: usage() }) : json(404, { error: 'Módulo sem questões' });
    }
    if (action === 'responder') {
      chamadas.responder++;
      const b = JSON.parse(opts.body || '{}');
      const q = (w.BC_QUESTOES?.[b.disc]?.[Number(b.n)] || []).find(x => x.id === b.id);
      if (!q) return json(404, { error: 'Questão não encontrada' });
      if (plan === 'free' && !usados.has(q.id)) {
        if (usados.size >= limit) return json(429, { error: `Você já respondeu as ${limit} questões gratuitas de hoje`, code: 'DAILY_LIMIT', used: usados.size, dailyLimit: limit });
        usados.add(q.id);
      }
      const us = usage();
      return json(200, { id: q.id, choice: b.choice, correct: b.choice === q.answer, answer: q.answer, explanation: q.explanation, lawRef: q.lawRef, usage: { plan: us.plan, limit: us.limit, used: us.used, remaining: us.remaining } });
    }
    return json(400, {});
  };
  return { chamadas, usados };
}
