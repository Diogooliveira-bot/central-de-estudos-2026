/* Base Completa · Banco de questões (cliente).
 * Enunciados e CORREÇÃO vêm do servidor (/api/questoes): o gabarito e o comentário só chegam depois que o
 * aluno responde, e o plano Gratuito tem limite diário de questões distintas (hoje 5; o servidor decide).
 * O índice (content/questoes/index.js) diz quais módulos já têm questões e os títulos ficam em titulos.js.
 * Para acrescentar questões: content/questoes/LEIAME.md. */
(function (g) {
  'use strict';
  if (g.BCQuestoes) return;
  const VERSION = '20261113lim1';
  const NOMES = {
    adm: 'Direito Administrativo', cpc: 'Direito Processual Civil', pt: 'Português', penal: 'Direito Penal',
    cpp: 'Direito Processual Penal', cf: 'Direito Constitucional', civil: 'Direito Civil', rlm: 'Raciocínio Lógico-Matemático', info: 'Informática'
  };
  const API = '/api/questoes';
  const modulosCache = {};          // 'adm:3' → [{id,q,options,origem}]
  const pending = {};
  let ultimoUso = null;             // {plan, limit, used, remaining, answeredToday}
  let ultimoErro = null;
  const indice = () => g.BC_QUESTOES_INDICE || {};
  function modulos(disc) { return (indice()[disc] || []).slice(); }
  function has(disc, n) { return (indice()[disc] || []).includes(Number(n)); }
  function usage() { return ultimoUso ? JSON.parse(JSON.stringify(ultimoUso)) : null; }
  function erro() { return ultimoErro || { status: 0, mensagem: 'As questões deste módulo ainda não estão disponíveis.' }; }
  function msgPorStatus(status) {
    if (status === 401) return 'Sua sessão expirou. Entre novamente para resolver questões.';
    if (status === 403) return 'Seu plano atual não permite acessar estas questões.';
    if (status === 0) return 'Sem conexão. Conecte-se à internet para resolver questões.';
    return 'As questões estão temporariamente indisponíveis. Tente novamente em instantes.';
  }
  async function chamar(url, opcoes) {
    try {
      const r = await fetch(url, Object.assign({ credentials: 'same-origin', cache: 'no-store' }, opcoes || {}));
      let corpo = null; try { corpo = await r.json(); } catch (_) { /* resposta sem JSON */ }
      return { status: r.status, ok: r.ok, corpo };
    } catch (_) { return { status: 0, ok: false, corpo: null }; }
  }
  function guardarUso(u) { if (u && typeof u === 'object') ultimoUso = u; }
  // Enunciados do módulo (sem gabarito). Devolve [] e deixa o motivo em erro().
  function carregar(disc, n) {
    const key = disc + ':' + Number(n);
    if (Array.isArray(modulosCache[key])) return Promise.resolve(modulosCache[key]);
    if (!has(disc, n) || typeof fetch === 'undefined') return Promise.resolve([]);
    if (!pending[key]) pending[key] = chamar(API + '?action=modulo&disc=' + encodeURIComponent(disc) + '&n=' + Number(n)).then(r => {
      delete pending[key];
      if (r.ok && r.corpo && Array.isArray(r.corpo.items) && r.corpo.items.length) {
        modulosCache[key] = r.corpo.items; ultimoErro = null; guardarUso(r.corpo.usage);
        return r.corpo.items;
      }
      ultimoErro = { status: r.status, mensagem: r.status === 404 ? 'As questões deste módulo ainda não estão disponíveis.' : msgPorStatus(r.status) };
      return [];
    });
    return pending[key];
  }
  // Corrige uma questão no servidor. Sucesso: { ok:true, correct, answer, explanation, lawRef, usage }.
  async function responder(disc, n, id, choice) {
    const r = await chamar(API + '?action=responder', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ disc, n: Number(n), id, choice })
    });
    const c = r.corpo || {};
    if (r.ok && typeof c.correct === 'boolean') {
      const u = c.usage || null;
      if (u) {
        const antes = ultimoUso || {};
        const lista = new Set(antes.answeredToday || []); lista.add(id);
        guardarUso(Object.assign({}, antes, u, { answeredToday: [...lista], enabled: true, resetsAt: antes.resetsAt || '00:00 America/Sao_Paulo' }));
      }
      return { ok: true, status: r.status, correct: c.correct, answer: c.answer, explanation: String(c.explanation || ''), lawRef: String(c.lawRef || ''), usage: c.usage || null };
    }
    if (r.status === 429) {
      const antes = ultimoUso || {};
      guardarUso(Object.assign({}, antes, { plan: 'free', limit: c.dailyLimit, used: c.used, remaining: 0, enabled: true }));
      return { ok: false, status: 429, code: c.code || 'DAILY_LIMIT', mensagem: c.error || 'Limite diário atingido.' };
    }
    return { ok: false, status: r.status, mensagem: msgPorStatus(r.status) };
  }
  // Uso do dia (para a faixa do hub). Não gasta cota.
  async function carregarUso() {
    const r = await chamar(API + '?action=uso');
    if (r.ok && r.corpo && r.corpo.usage) guardarUso(r.corpo.usage);
    return usage();
  }
  g.BCQuestoes = Object.freeze({ version: VERSION, nomes: NOMES, modulos, has, get: carregar, answer: responder, usage, carregarUso, erro });
})(window);
