/* Base Completa — área "Questões".
 * Disciplinas → módulos → questões do módulo.
 * Como resolver:
 *   - modo Rolagem (todas na tela) ou Foco (uma por vez, com "Avançar");
 *   - o aluno SELECIONA a alternativa e depois toca em "Responder";
 *   - cada alternativa pode ser riscada (descarte);
 *   - toda vez que o módulo é aberto, as respostas começam zeradas;
 *   - um mini histórico por questão mostra se o aluno acertou ou errou da última vez.
 * As questões e a correção vêm do servidor (ui/questoes-bank-v1.js → /api/questoes). O plano Gratuito responde
 * até N questões distintas por dia (N vem do servidor, hoje 5); o gabarito só aparece depois de "Responder".
 * Tudo fica dentro de [data-bc-questoes-area]. */
(function (g) {
  'use strict';
  if (g.BCQuestoesArea) return;
  const STORE = 'central-v6:questoes:v2';   // histórico por questão (não guarda a sessão)
  const MODE_KEY = 'central-v6:questoes:modo';
  const LETRAS = 'ABCDE';
  // Disciplinas extras (ex.: GMF) entram pelo catálogo, depois das nove originais.
  const ORDEM_BASE = ['adm', 'cf', 'civil', 'cpc', 'cpp', 'penal', 'pt', 'rlm', 'info'];
  const ordem = () => ORDEM_BASE.concat((g.GmfCourseCatalog?.subjects?.length ? g.GmfCourseCatalog.subjects.map(s => s && s.id) : ['atual', 'fortaleza', 'legesp', 'dh']).filter(id => id && !ORDEM_BASE.includes(id)));
  const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const nn = n => String(Number(n)).padStart(2, '0');
  const bank = () => g.BCQuestoes;
  const titulos = () => g.BC_QUESTOES_TITULOS || {};
  const qtdDe = (disc, n) => ((g.BC_QUESTOES_QTD || {})[disc] || {})[n] || 10;
  let overlay = null, lastFocus = null, view = null, fromModule = false, sess = null;

  // ---- histórico (somente neste aparelho): id → { u: 'c'|'e' (última vez), c: acertos, e: erros } ----
  function lerHist() { try { const x = JSON.parse(localStorage.getItem(STORE) || '{}'); return x && typeof x === 'object' && x.h && typeof x.h === 'object' ? x : { h: {} }; } catch (_) { return { h: {} }; } }
  function gravarHist(x) { try { localStorage.setItem(STORE, JSON.stringify(x)); } catch (_) { /* sem armazenamento: segue sem salvar */ } }
  function registrar(id, acertou) {
    const t = lerHist(), r = t.h[id] || { c: 0, e: 0 };
    r.u = acertou ? 'c' : 'e'; if (acertou) r.c++; else r.e++;
    t.h[id] = r; gravarHist(t);
  }
  // Resumo por módulo a partir do histórico (sem baixar os arquivos): id "adm-m03-autoral-01" → adm:3.
  function resumoModulo(disc, n) {
    const t = lerHist(), pref = disc + '-m' + nn(n) + '-';
    let respondidas = 0, acertos = 0;
    Object.keys(t.h).forEach(id => { if (id.startsWith(pref)) { respondidas++; if (t.h[id].u === 'c') acertos++; } });
    return { respondidas, acertos };
  }
  function modoSalvo() { try { return localStorage.getItem(MODE_KEY) === 'foco' ? 'foco' : 'rolagem'; } catch (_) { return 'rolagem'; } }
  function salvarModo(m) { try { localStorage.setItem(MODE_KEY, m); } catch (_) { /* ignora */ } }

  // ---- janela ----
  let marcados = [];
  function fechar() {
    if (overlay) overlay.remove(); overlay = null; view = null; sess = null;
    document.body.classList.remove('bcqa-open');
    const nav = document.querySelector('[data-bcqa-rail]');
    if (nav) { nav.classList.remove('active'); nav.removeAttribute('aria-current'); }
    marcados.forEach(b => { b.classList.add('active'); b.setAttribute('aria-current', 'page'); }); marcados = [];
    document.removeEventListener('keydown', teclas); g.removeEventListener('resize', ajustarBase);
    if (lastFocus && lastFocus.isConnected) try { lastFocus.focus(); } catch (_) { /* ignora */ }
  }
  const suave = () => (g.matchMedia && g.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth');
  // Questão que recebe as teclas: em Foco, a da tela; em Rolagem, a primeira não respondida que está visível.
  function questaoAtiva() {
    if (!sess || !overlay) return null;
    if (sess.mode === 'foco') return sess.items[sess.i] ? { q: sess.items[sess.i], i: sess.i } : null;
    const corpo = overlay.querySelector('[data-bcqa-corpo]'), topo = corpo ? corpo.getBoundingClientRect().top + 90 : 0;
    const secs = [...overlay.querySelectorAll('.bcqa-q')];
    const visivel = secs.find(sec => { const q = sess.items[Number(sec.dataset.i)]; return q && !respondida(q) && sec.getBoundingClientRect().bottom > topo; }) || secs.find(sec => !respondida(sess.items[Number(sec.dataset.i)]));
    return visivel ? { q: sess.items[Number(visivel.dataset.i)], i: Number(visivel.dataset.i) } : null;
  }
  // Atalhos (computador): A–E (ou 1–5) escolhem, Enter responde/avança, ← → navegam em Foco. Esc volta.
  function teclas(e) {
    if (e.key === 'Escape') { e.preventDefault(); voltar(); return; }
    if (e.ctrlKey || e.metaKey || e.altKey || !view || view.tipo !== 'quiz' || !sess || !overlay) return;
    const alvo = e.target; if (alvo && alvo.closest && alvo.closest('input,textarea,select,[contenteditable="true"]')) return;
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key, ativa = questaoAtiva(); if (!ativa) return;
    const { q, i } = ativa, sec = overlay.querySelector('.bcqa-q[data-i="' + i + '"]');
    const idx = 'abcde'.indexOf(k) >= 0 && k.length === 1 ? 'abcde'.indexOf(k) : '12345'.indexOf(k) >= 0 && k.length === 1 ? '12345'.indexOf(k) : -1;
    if (idx >= 0 && idx < q.options.length && !respondida(q)) { e.preventDefault(); sec && sec.querySelector('[data-op="' + idx + '"]')?.click(); return; }
    if (e.key === 'Enter' && !(alvo && alvo.closest && alvo.closest('button,a,summary'))) {
      const resp = sec && sec.querySelector('[data-responder]'), prox = overlay.querySelector('[data-prox]');
      if (resp && !resp.disabled) { e.preventDefault(); resp.click(); } else if (sess.mode === 'foco' && prox && !prox.disabled) { e.preventDefault(); prox.click(); }
      return;
    }
    if (sess.mode === 'foco' && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
      const b = overlay.querySelector(e.key === 'ArrowRight' ? '[data-prox]' : '[data-ant]'); if (b && !b.disabled) { e.preventDefault(); b.click(); }
    }
  }
  function garantirJanela() {
    if (overlay) return overlay;
    lastFocus = document.activeElement;
    overlay = document.createElement('div');
    overlay.className = 'bcqa-overlay';
    overlay.setAttribute('data-bc-questoes-area', '1');
    overlay.innerHTML = '<div class="bcqa-dialog" role="dialog" aria-modal="true" aria-label="Questões"><header><button type="button" class="bcqa-btn" data-bcqa-voltar aria-label="Voltar">‹ Voltar</button><div class="bcqa-title"><b data-bcqa-titulo></b><small data-bcqa-sub></small></div><button type="button" class="bcqa-btn bcqa-x" data-bcqa-fechar aria-label="Fechar">×</button></header><div class="bcqa-body" data-bcqa-corpo></div></div>';
    overlay.addEventListener('mousedown', e => { if (e.target === overlay) fechar(); });
    overlay.querySelector('[data-bcqa-fechar]').addEventListener('click', fechar);
    overlay.querySelector('[data-bcqa-voltar]').addEventListener('click', voltar);
    document.body.appendChild(overlay);
    document.body.classList.add('bcqa-open');
    // O menu do topo passa a marcar "Questões" enquanto a janela está aberta (e devolve a marcação ao fechar).
    const nav = document.querySelector('[data-bcqa-rail]');
    if (nav && nav.parentElement) {
      marcados = [...nav.parentElement.querySelectorAll('.active,[aria-current="page"]')].filter(b => b !== nav);
      marcados.forEach(b => { b.classList.remove('active'); b.removeAttribute('aria-current'); });
      nav.classList.add('active'); nav.setAttribute('aria-current', 'page');
    }
    document.addEventListener('keydown', teclas);
    ajustarBase(); g.addEventListener('resize', ajustarBase);
    return overlay;
  }
  // No celular a barra de atalhos da Central fica embaixo da tela: a janela termina acima dela, senão os botões
  // fixos (Anterior/Avançar) ficam escondidos atrás da barra.
  function ajustarBase() {
    if (!overlay) return;
    const barra = document.querySelector('.student-nav-scroll'), r = barra && barra.getBoundingClientRect();
    const embaixo = r && r.height > 0 && r.top > g.innerHeight / 2;
    overlay.style.bottom = embaixo ? Math.max(0, Math.round(g.innerHeight - r.top)) + 'px' : '';
  }
  function pintar(titulo, sub, html, voltarVisivel) {
    const o = garantirJanela();
    o.querySelector('[data-bcqa-titulo]').textContent = titulo;
    o.querySelector('[data-bcqa-sub]').textContent = sub || '';
    o.querySelector('[data-bcqa-voltar]').hidden = !voltarVisivel;
    const corpo = o.querySelector('[data-bcqa-corpo]');
    corpo.classList.remove('bcqa-quiz');
    corpo.innerHTML = html; corpo.scrollTop = 0;
    return corpo;
  }
  function voltar() {
    if (!view || view.tipo === 'hub' || (view.tipo === 'quiz' && fromModule)) return fechar();
    if (view.tipo === 'quiz') return abrirDisciplina(view.disc);
    return abrirHub();
  }

  // ---- hub e lista de módulos ----
  function barra(pct) { return '<div class="bcqa-bar" aria-hidden="true"><i style="width:' + pct + '%"></i></div>'; }
  function abrirHub() {
    const B = bank(); fromModule = false; view = { tipo: 'hub' }; sess = null;
    const cards = ordem().filter(d => g.GmfStudyObjective?.allowsSubject(d)!==false && B && B.modulos(d).length).map(d => {
      const mods = B.modulos(d); let resp = 0;
      mods.forEach(n => { resp += resumoModulo(d, n).respondidas; });
      const total = mods.reduce((a, n) => a + qtdDe(d, n), 0), pct = total ? Math.round(resp / total * 100) : 0;
      return '<button type="button" class="bcqa-card" data-disc="' + d + '"><b>' + esc(B.nomes[d]) + '</b><small>' + mods.length + ' módulos · ' + total + ' questões</small>' + barra(pct) + '<small>' + resp + ' já respondidas</small></button>';
    }).join('');
    const corpo = pintar('Questões', 'Escolha a disciplina', '<p class="bcqa-intro">Questões inéditas por módulo, com correção na hora e comentário. Ao abrir um módulo, as respostas começam zeradas; o histórico mostra se você acertou ou errou da última vez.</p><div class="bcqa-grid">' + (cards || '<p class="bcqa-empty">As questões ainda estão carregando. Tente de novo em instantes.</p>') + '</div>', false);
    corpo.querySelectorAll('[data-disc]').forEach(b => b.addEventListener('click', () => abrirDisciplina(b.dataset.disc)));
    corpo.querySelector('[data-disc]')?.focus();
    // Faixa do limite diário (só aparece para o plano Gratuito).
    if (B && B.carregarUso) B.carregarUso().then(() => {
      if (!view || view.tipo !== 'hub' || !corpo.isConnected) return;
      const h = usoHtml(); if (h && !corpo.querySelector('[data-uso]')) corpo.insertAdjacentHTML('afterbegin', h);
    });
    return false;
  }
  function abrirDisciplina(disc) {
    const B = bank(); view = { tipo: 'disc', disc }; sess = null;
    const mods = B ? B.modulos(disc) : [];
    const cards = mods.map(n => {
      const s = resumoModulo(disc, n), qt = qtdDe(disc, n), pct = Math.round(Math.min(s.respondidas, qt) / qt * 100);
      const t = (titulos()[disc] || {})[n] || ('Módulo ' + nn(n));
      return '<button type="button" class="bcqa-card" data-mod="' + n + '"><small>MÓDULO ' + nn(n) + '</small><b>' + esc(t) + '</b>' + barra(pct) + '<small>' + (s.respondidas ? s.respondidas + '/' + qt + ' já respondidas · ' + s.acertos + ' certas na última vez' : qt + ' questões') + '</small></button>';
    }).join('');
    const corpo = pintar(B ? B.nomes[disc] : 'Questões', 'Escolha o módulo', '<div class="bcqa-grid">' + cards + '</div>', true);
    corpo.querySelectorAll('[data-mod]').forEach(b => b.addEventListener('click', () => abrirModulo(disc, Number(b.dataset.mod), false)));
    corpo.querySelector('[data-mod]')?.focus();
    return false;
  }

  // ---- questionário ----
  async function abrirModulo(disc, n, doModulo) {
    const B = bank(); if (!B) return false;
    fromModule = !!doModulo; view = { tipo: 'quiz', disc, n }; sess = null;
    const titulo = (titulos()[disc] || {})[n] || ('Módulo ' + nn(n));
    pintar(titulo, B.nomes[disc] + ' · módulo ' + nn(n), '<div class="bcqa-skel" role="status" aria-label="Carregando as questões"><i class="w40"></i><i class="w90"></i><i class="w70"></i><u></u><u></u><u></u><u></u></div>', true);
    const items = await B.get(disc, n);
    if (!view || view.tipo !== 'quiz' || view.disc !== disc || view.n !== n) return false; // aluno já saiu
    if (!items.length) {
      const falha = !!(B.erro && B.erro());
      const corpoErro = pintar(titulo, B.nomes[disc] + ' · módulo ' + nn(n), '<div class="bcqa-empty">' + mascote('ideia') + '<p>' + esc(B.erro ? B.erro().mensagem : 'As questões deste módulo ainda não estão disponíveis.') + '</p>' + (falha ? '<button type="button" class="bcqa-btn bcqa-primary" data-retry>Tentar de novo</button>' : '') + '</div>', true);
      corpoErro.querySelector('[data-retry]')?.addEventListener('click', () => abrirModulo(disc, n, fromModule));
      return false;
    }
    // Sempre começa do zero: a sessão não vem de aberturas anteriores.
    sess = { disc, n, titulo, items, mode: modoSalvo(), i: 0, sel: {}, ans: {}, res: {}, strike: {}, erro: {}, busy: {}, previa: lerHist().h };
    desenhar();
    return false;
  }
  const respondida = q => !!sess.res[q.id];
  function contagem() {
    let r = 0, a = 0; sess.items.forEach(q => { if (respondida(q)) { r++; if (sess.res[q.id].correct) a++; } });
    return { r, a, total: sess.items.length };
  }
  // ---- limite diário do plano Gratuito (a regra e o valor vêm do servidor) ----
  const uso = () => (bank() && bank().usage ? bank().usage() : null);
  const limitado = () => { const u = uso(); return !!(u && u.plan === 'free' && u.limit != null); };
  const jaContou = q => { const u = uso(); return !!(u && (u.answeredToday || []).includes(q.id)); };
  // Sem cota: o Gratuito já usou tudo e esta questão ainda não foi respondida hoje.
  const semCota = q => { const u = uso(); return limitado() && u.remaining === 0 && !jaContou(q) && !respondida(q); };
  function usoHtml() {
    const u = uso();
    if (!u || u.plan === 'premium' || u.plan === 'staff') return '';
    if (!limitado()) return '';
    const pl = '<a class="bcqa-link" href="https://basecompleta.com.br/#planos" target="_blank" rel="noopener">Conheça o Premium</a>';
    if (u.remaining === 0) return '<div class="bcqa-uso bcqa-uso-fim" role="status" data-uso>' + mascote('ideia') + '<div><b>Você usou as ' + u.limit + ' questões gratuitas de hoje.</b> A cota volta à meia-noite (horário de Brasília). Você ainda pode rever as que já respondeu hoje. No Premium não há limite diário · ' + pl + '</div></div>';
    return '<div class="bcqa-uso" role="status" data-uso><b>Plano gratuito:</b> ' + u.used + ' de ' + u.limit + ' questões respondidas hoje · restam ' + u.remaining + '. Cada questão nova gasta 1; repetir uma já respondida hoje não gasta.</div>';
  }
  function histHtml(q) {
    const h = sess.previa[q.id];
    if (!h) return '<span class="bcqa-hist bcqa-hist-novo">Ainda não respondida</span>';
    const cont = [h.c ? h.c + (h.c === 1 ? ' acerto' : ' acertos') : '', h.e ? h.e + (h.e === 1 ? ' erro' : ' erros') : ''].filter(Boolean).join(' · ');
    return '<span class="bcqa-hist ' + (h.u === 'c' ? 'bcqa-hist-ok' : 'bcqa-hist-erro') + '">' + (h.u === 'c' ? '✓ Acertou da última vez' : '✕ Errou da última vez') + (cont ? ' · ' + cont : '') + '</span>';
  }
  const ICONE_RISCO = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16"/><path d="M8.5 7.2C9.3 5.9 10.5 5 12.3 5c2.1 0 3.6 1 3.6 2.6M8 16.4c.8 1.6 2.3 2.6 4.3 2.6 2.2 0 3.7-1.1 3.7-2.8"/></svg>';
  function cardQuestao(q, i) {
    const feita = respondida(q), r = feita ? sess.res[q.id] : null, escolha = feita ? sess.ans[q.id] : sess.sel[q.id], riscadas = sess.strike[q.id] || {}, bloqueada = semCota(q), ocupada = !!sess.busy[q.id];
    const ops = q.options.map((o, j) => {
      const st = feita ? (j === r.answer ? ' correct' : j === escolha ? ' wrong' : '') : (j === escolha ? ' selected' : '');
      const risc = riscadas[j] ? ' struck' : '';
      const marca = feita ? (j === r.answer ? '<i class="bcqa-mark" aria-hidden="true">✓</i><span class="bcqa-sr"> (alternativa correta)</span>' : (j === escolha ? '<i class="bcqa-mark" aria-hidden="true">✕</i><span class="bcqa-sr"> (sua resposta, incorreta)</span>' : '')) : '';
      return '<div class="bcqa-optrow"><button type="button" class="bcqa-option' + st + risc + '" data-op="' + j + '" ' + (feita ? 'disabled' : '') + ' role="radio" aria-checked="' + (j === escolha) + '"><b class="bcqa-letter">' + LETRAS[j] + '</b><span class="bcqa-txt">' + esc(o) + '</span>' + marca + '</button>' +
        (feita ? '' : '<button type="button" class="bcqa-strike' + (riscadas[j] ? ' on' : '') + '" data-strike="' + j + '" aria-pressed="' + !!riscadas[j] + '" aria-label="' + (riscadas[j] ? 'Desfazer risco da' : 'Riscar a') + ' alternativa ' + LETRAS[j] + '" title="' + (riscadas[j] ? 'Desfazer o risco' : 'Riscar (descartar) esta alternativa') + '">' + ICONE_RISCO + '</button>') + '</div>';
    }).join('');
    const dica = bloqueada ? '<small class="bcqa-dica bcqa-dica-limite">Limite diário atingido: volte amanhã para responder esta questão.</small>'
      : (Number.isInteger(escolha) ? '' : '<small class="bcqa-dica">Selecione uma alternativa para responder.</small>');
    const erro = sess.erro[q.id] ? '<small class="bcqa-erro" role="alert">' + esc(sess.erro[q.id]) + '</small>' : '';
    const acao = feita ? '' : '<div class="bcqa-actions"><button type="button" class="bcqa-btn bcqa-primary" data-responder ' + (Number.isInteger(escolha) && !bloqueada && !ocupada ? '' : 'disabled') + '>' + (ocupada ? 'Corrigindo…' : 'Responder') + '</button>' + dica + erro + '</div>';
    const fb = feita ? '<div class="bcqa-feedback ' + (r.correct ? 'ok' : 'err') + (sess.novoFb === q.id ? ' bcqa-pop' : '') + '" role="status"><div class="bcqa-fb-head"><i aria-hidden="true">' + (r.correct ? '✓' : '✕') + '</i><strong>' + (r.correct ? 'Resposta correta' : 'Resposta incorreta · gabarito ' + LETRAS[r.answer]) + '</strong></div>' + (r.explanation ? '<p class="bcqa-fb-text"><span class="bcqa-fb-label">Comentário</span>' + esc(r.explanation) + '</p>' : '') + (r.lawRef ? '<span class="bcqa-base">Base: ' + esc(r.lawRef) + '</span>' : '') + '</div>' : '';
    return '<section class="bcqa-q' + (sess.trocou ? ' bcqa-enter' : '') + '" data-i="' + i + '"><p class="bcqa-meta">QUESTÃO ' + nn(i + 1) + ' DE ' + sess.items.length + '</p>' + histHtml(q) + '<h3>' + esc(q.q) + '</h3><div class="bcqa-options" role="radiogroup" aria-label="Alternativas">' + ops + '</div>' + acao + fb + '</section>';
  }
  function mascote(pose) { return '<img class="bcqa-mascote" src="/assets/mascote/mascote-' + pose + '.webp" alt="" aria-hidden="true" width="40" height="96" loading="lazy" decoding="async">'; }
  function resultadoHtml(c) {
    if (c.r !== c.total) return '';
    const erros = c.r - c.a;
    const pct = Math.round(c.a / c.total * 100);
    const pose = pct >= 80 ? 'comemorando-2' : pct >= 50 ? 'joinha' : 'erros';
    const faixa = pct >= 80 ? 'Excelente desempenho!' : pct >= 50 ? 'Bom caminho, falta pouco.' : 'Vale reforçar este módulo.';
    const rever = sess.items.map((q, i) => ({ q, i })).filter(x => respondida(x.q) && !sess.res[x.q.id].correct);
    const lista = rever.length ? '<div class="bcqa-review"><b>Para revisar</b><ul>' + rever.map(x => '<li><button type="button" class="bcqa-chip" data-goto="' + x.i + '">Questão ' + nn(x.i + 1) + (sess.res[x.q.id].lawRef ? ' · ' + esc(sess.res[x.q.id].lawRef) : '') + '</button></li>').join('') + '</ul></div>' : '';
    return '<div class="bcqa-result" role="status">' + mascote(pose) + '<div class="bcqa-result-main"><div class="bcqa-ring" style="--p:' + pct + '" aria-hidden="true"><span>' + pct + '%</span></div><div class="bcqa-result-copy"><b>Resultado: ' + c.a + ' de ' + c.total + ' (' + pct + '%)</b><span class="bcqa-result-sub">' + faixa + ' ' + (erros ? 'Revise os comentários das que errou e refaça só os erros.' : 'Sem erros neste módulo.') + '</span><span class="bcqa-pills"><i class="ok">✓ ' + c.a + ' ' + (c.a === 1 ? 'acerto' : 'acertos') + '</i><i class="err">✕ ' + erros + ' ' + (erros === 1 ? 'erro' : 'erros') + '</i></span></div></div>' + lista + (erros ? '<div class="bcqa-actions"><button type="button" class="bcqa-btn bcqa-primary" data-erros>Refazer só os erros</button></div>' : '') + '</div>';
  }
  // Faixa fixa no topo: modo, contagem, mapa de questões (acertou/errou/atual) e menu de ações.
  function fitaHtml(c) {
    const dots = sess.items.map((q, i) => {
      const feita = respondida(q), ok = feita && sess.res[q.id].correct, atual = sess.mode === 'foco' && i === sess.i;
      const rotulo = 'Questão ' + (i + 1) + ': ' + (feita ? (ok ? 'acertou' : 'errou') : 'não respondida');
      return '<button type="button" class="bcqa-dot' + (feita ? (ok ? ' ok' : ' err') : (semCota(q) ? ' lock' : '')) + (atual ? ' cur' : '') + '" data-goto="' + i + '" aria-label="' + rotulo + '"' + (atual ? ' aria-current="step"' : '') + '>' + (i + 1) + '</button>';
    }).join('');
    const erros = c.r - c.a > 0;
    const menu = erros || c.r ? '<details class="bcqa-menu"><summary class="bcqa-btn" aria-label="Mais ações" title="Mais ações">⋯</summary><div class="bcqa-menu-list">' + (erros ? '<button type="button" class="bcqa-btn" data-erros>Refazer só os erros</button>' : '') + (c.r ? '<button type="button" class="bcqa-btn" data-zerar>Recomeçar o módulo</button>' : '') + '</div></details>' : '';
    const modos = '<div class="bcqa-modes" role="tablist" aria-label="Modo de resolução"><button type="button" role="tab" class="bcqa-mode' + (sess.mode === 'rolagem' ? ' on' : '') + '" aria-selected="' + (sess.mode === 'rolagem') + '" data-modo="rolagem">☰ Rolagem</button><button type="button" role="tab" class="bcqa-mode' + (sess.mode === 'foco' ? ' on' : '') + '" aria-selected="' + (sess.mode === 'foco') + '" data-modo="foco">◎ Foco</button></div>';
    return '<div class="bcqa-strip"><div class="bcqa-strip-row">' + modos + '<span class="bcqa-count" data-stats>' + c.r + '/' + c.total + ' respondidas · ' + c.a + ' acertos</span>' + menu + '</div><div class="bcqa-dots" role="group" aria-label="Mapa das questões">' + dots + '</div></div><p class="bcqa-keys" aria-hidden="true">Atalhos: <kbd>A</kbd>–<kbd>E</kbd> escolher · <kbd>Enter</kbd> responder · <kbd>←</kbd> <kbd>→</kbd> navegar</p>';
  }
  function desenhar(manterRolagem) {
    const B = bank(), c = contagem();
    let lista;
    if (sess.mode === 'foco') {
      const q = sess.items[sess.i], ultima = sess.i === sess.items.length - 1;
      lista = cardQuestao(q, sess.i) + '<div class="bcqa-nav"><button type="button" class="bcqa-btn" data-ant ' + (sess.i === 0 ? 'disabled' : '') + '>‹ Anterior</button><button type="button" class="bcqa-btn bcqa-primary' + (respondida(q) ? ' bcqa-next-ready' : '') + '" data-prox ' + (respondida(q) || semCota(q) ? '' : 'disabled') + '>' + (ultima ? 'Ver resultado' : 'Avançar ›') + '</button></div>';
    } else lista = sess.items.map((q, i) => cardQuestao(q, i)).join('');
    const corpo = pintar(sess.titulo, B.nomes[sess.disc] + ' · módulo ' + nn(sess.n), fitaHtml(c) + usoHtml() + resultadoHtml(c) + lista, true);
    corpo.classList.add('bcqa-quiz');
    const rolarFb = sess.novoFb; sess.novoFb = null; sess.trocou = false;
    ligar(corpo);
    const fita = corpo.querySelector('.bcqa-strip'); if (fita) corpo.style.setProperty('--qa-strip-h', fita.offsetHeight + 'px');
    const dots = corpo.querySelector('.bcqa-dots'), atual = dots && dots.querySelector('.cur');
    if (atual) dots.scrollLeft = atual.offsetLeft - dots.clientWidth / 2 + atual.offsetWidth / 2;
    if (rolarFb) { const fb = corpo.querySelector('.bcqa-q .bcqa-feedback.bcqa-pop'); if (fb) (g.requestAnimationFrame || g.setTimeout)(() => { try { fb.scrollIntoView({ block: 'start', behavior: suave() }); } catch (_) { /* ignora */ } }); }
    return corpo;
  }
  function rolar(corpo, y) { corpo.scrollTop = y; }
  function ligar(corpo) {
    const redesenhar = () => { const pos = overlay.querySelector('[data-bcqa-corpo]').scrollTop; rolar(desenhar(), pos); };
    corpo.querySelectorAll('[data-modo]').forEach(b => b.addEventListener('click', () => { if (sess.mode === b.dataset.modo) return; sess.mode = b.dataset.modo; salvarModo(sess.mode); desenhar(); }));
    corpo.querySelectorAll('[data-goto]').forEach(b => b.addEventListener('click', () => {
      const idx = Number(b.dataset.goto);
      if (sess.mode === 'foco') { sess.i = idx; sess.trocou = true; desenhar(); }
      else corpo.querySelector('.bcqa-q[data-i="' + idx + '"]')?.scrollIntoView({ block: 'start', behavior: suave() });
    }));
    corpo.querySelectorAll('.bcqa-q').forEach(sec => {
      const i = Number(sec.dataset.i), q = sess.items[i];
      sec.querySelectorAll('[data-op]').forEach(b => b.addEventListener('click', () => {
        if (respondida(q)) return;
        const j = Number(b.dataset.op);
        sess.sel[q.id] = sess.sel[q.id] === j ? undefined : j;
        if (sess.sel[q.id] === j && (sess.strike[q.id] || {})[j]) delete sess.strike[q.id][j]; // escolher desfaz o risco
        redesenhar();
      }));
      sec.querySelectorAll('[data-strike]').forEach(b => b.addEventListener('click', () => {
        if (respondida(q)) return;
        const j = Number(b.dataset.strike), r = (sess.strike[q.id] = sess.strike[q.id] || {});
        if (r[j]) delete r[j]; else { r[j] = true; if (sess.sel[q.id] === j) sess.sel[q.id] = undefined; }
        redesenhar();
      }));
      sec.querySelector('[data-responder]')?.addEventListener('click', async () => {
        const j = sess.sel[q.id]; if (!Number.isInteger(j) || respondida(q) || sess.busy[q.id] || semCota(q)) return;
        const atual = sess; sess.busy[q.id] = true; delete sess.erro[q.id]; redesenhar();
        const r = await bank().answer(atual.disc, atual.n, q.id, j);
        if (sess !== atual) return;                       // aluno saiu ou recomeçou
        delete sess.busy[q.id];
        if (r && r.ok) { sess.ans[q.id] = j; sess.res[q.id] = r; sess.novoFb = q.id; registrar(q.id, r.correct === true); }
        else if (r && r.status === 429) { sess.erro[q.id] = 'Você já usou as questões gratuitas de hoje. A cota volta à meia-noite (Brasília).'; }
        else sess.erro[q.id] = (r && r.mensagem) || 'Não foi possível corrigir agora. Tente de novo.';
        redesenhar();
      });
    });
    corpo.querySelector('[data-ant]')?.addEventListener('click', () => { if (sess.i > 0) { sess.i--; sess.trocou = true; desenhar(); } });
    corpo.querySelector('[data-prox]')?.addEventListener('click', () => {
      if (sess.i < sess.items.length - 1) { sess.i++; sess.trocou = true; desenhar(); }
      else { const topo = desenhar(); topo.scrollTop = 0; }   // última: o resultado aparece no topo
    });
    corpo.querySelectorAll('[data-erros]').forEach(b => b.addEventListener('click', () => {
      sess.items.forEach(q => { if (respondida(q) && !sess.res[q.id].correct) { delete sess.ans[q.id]; delete sess.res[q.id]; delete sess.sel[q.id]; } });
      sess.previa = lerHist().h; sess.i = Math.max(0, sess.items.findIndex(q => !respondida(q))); sess.trocou = true; desenhar().scrollTop = 0;
    }));
    corpo.querySelectorAll('[data-zerar]').forEach(b => b.addEventListener('click', () => { sess.sel = {}; sess.ans = {}; sess.res = {}; sess.erro = {}; sess.strike = {}; sess.i = 0; sess.previa = lerHist().h; sess.trocou = true; desenhar().scrollTop = 0; }));
  }

  // ---- entradas: atalho do topo, menu lateral e menu "Mais" no celular ----
  function abrirDoMenu(botao) { lastFocus = botao || document.activeElement; abrirHub(); return false; }
  function criarEntradaMenu() {
    if (!document.body) return;
    const nav = document.querySelector('#centralSidebar .nav');
    if (nav && !nav.querySelector('[data-bcqa-nav]')) {
      const ref = nav.querySelector('[data-central-native="disciplines"]');
      const b = document.createElement('button');
      b.type = 'button'; b.setAttribute('data-bcqa-nav', '1'); b.setAttribute('data-i', '?');
      b.innerHTML = '<span class="nav-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.1 9a3 3 0 1 1 4.6 2.5c-.9.6-1.7 1.2-1.7 2.5M12 17.5h.01"/><circle cx="12" cy="12" r="9"/></svg></span><span class="nav-text">Questões</span>';
      b.addEventListener('click', () => abrirDoMenu(b));
      if (ref) ref.after(b); else nav.appendChild(b);
    }
    // Barra de atalhos do topo (visual atual da Central): "Questões" logo antes de "Lei em Dia".
    const rail = document.querySelector('.student-nav-scroll');
    if (rail && !rail.querySelector('[data-bcqa-rail]')) {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'student-quick-nav'; b.setAttribute('data-bcqa-rail', '1');
      b.setAttribute('data-student-primary-nav', 'questoes'); b.setAttribute('aria-label', 'Questões'); b.setAttribute('title', 'Questões');
      b.innerHTML = '<span class="nav-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.2a2.6 2.6 0 1 1 3.8 2.3c-.8.5-1.3 1-1.3 2M12 16.8h.01"/></svg></span><span class="nav-text">Questões</span>';
      b.addEventListener('click', () => abrirDoMenu(b));
      const lei = [...rail.querySelectorAll('button')].find(x => /lei em dia/i.test(x.textContent));
      if (lei) lei.before(b); else rail.appendChild(b);
    }
    // "Questões" já está no menu do topo: não repetir em "Mais opções".
    document.querySelectorAll('#studentMorePanel [data-bcqa-more]').forEach(el => el.remove());
  }
  function iniciar() {
    criarEntradaMenu();
    let fila = false;
    new MutationObserver(() => { if (fila) return; fila = true; (g.requestAnimationFrame || g.setTimeout)(() => { fila = false; try { criarEntradaMenu(); } catch (_) { /* janela encerrada */ } }, 60); }).observe(document.body, { childList: true, subtree: true });
  }

  g.BCQuestoesArea = Object.freeze({
    openHub: abrirHub,
    openMenu: abrirDoMenu,
    openDiscipline: abrirDisciplina,
    openModule: (disc, n) => { lastFocus = document.activeElement; return abrirModulo(disc, Number(n), true); },
    close: fechar
  });
  if (document.body) iniciar(); else document.addEventListener('DOMContentLoaded', iniciar, { once: true });
})(window);
