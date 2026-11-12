/* Base Completa — área "Questões".
 * Disciplinas → módulos → as questões do módulo, com correção imediata, comentário e progresso.
 * As questões vêm do banco (ui/questoes-bank-v1.js). Os módulos também abrem a mesma tela já
 * no módulo certo (ui/questoes-modulo-card-v1.js), no padrão da Lei em Dia.
 * Tudo que esta área desenha fica dentro de [data-bc-questoes-area]. */
(function (g) {
  'use strict';
  if (g.BCQuestoesArea) return;
  const STORE = 'central-v6:questoes:v1';
  const LETRAS = 'ABCDE';
  const ORDEM = ['adm', 'cf', 'civil', 'cpc', 'cpp', 'penal', 'pt', 'rlm'];
  const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const nn = n => String(Number(n)).padStart(2, '0');
  const bank = () => g.BCQuestoes;
  const titulos = () => g.BC_QUESTOES_TITULOS || {};
  const qtdDe = (disc, n) => ((g.BC_QUESTOES_QTD || {})[disc] || {})[n] || 10;
  let overlay = null, lastFocus = null, view = null, fromModule = false;

  // ---- progresso (somente neste aparelho; não apaga nada dos outros registros do aluno) ----
  function lerTudo() { try { const x = JSON.parse(localStorage.getItem(STORE) || '{}'); return x && typeof x === 'object' && x.r && typeof x.r === 'object' ? x : { r: {} }; } catch (_) { return { r: {} }; } }
  function gravarTudo(x) { try { localStorage.setItem(STORE, JSON.stringify(x)); } catch (_) { /* sem armazenamento: segue sem salvar */ } }
  function respostas(disc, n) { return lerTudo().r[disc + ':' + n] || {}; }
  function gravarResposta(disc, n, id, escolha) { const t = lerTudo(), k = disc + ':' + n; (t.r[k] = t.r[k] || {})[id] = escolha; gravarTudo(t); }
  function limpar(disc, n, soErros, items) {
    const t = lerTudo(), k = disc + ':' + n, r = t.r[k] || {};
    items.forEach(q => { if (!soErros || (Number.isInteger(r[q.id]) && r[q.id] !== q.answer)) delete r[q.id]; });
    t.r[k] = r; gravarTudo(t);
  }
  function contar(items, r) {
    let respondidas = 0, acertos = 0;
    items.forEach(q => { const c = r[q.id]; if (Number.isInteger(c) && c >= 0 && c < q.options.length) { respondidas++; if (c === q.answer) acertos++; } });
    return { respondidas, acertos, total: items.length };
  }
  // Resumo por módulo/disciplina sem baixar os arquivos: usa só o que já foi respondido.
  function resumoModulo(disc, n) {
    const r = respostas(disc, n); let respondidas = 0, acertos = 0;
    // O gabarito não está em memória até o módulo abrir; guardamos o placar no registro.
    const t = lerTudo().p && lerTudo().p[disc + ':' + n];
    if (t) { respondidas = t.r; acertos = t.a; } else respondidas = Object.keys(r).length;
    return { respondidas, acertos };
  }
  function salvarPlacar(disc, n, c) { const t = lerTudo(); t.p = t.p || {}; t.p[disc + ':' + n] = { r: c.respondidas, a: c.acertos }; gravarTudo(t); }

  // ---- estrutura da janela ----
  function fechar() {
    if (overlay) overlay.remove(); overlay = null; view = null;
    document.body.classList.remove('bcqa-open');
    document.removeEventListener('keydown', teclas);
    if (lastFocus && lastFocus.isConnected) try { lastFocus.focus(); } catch (_) { /* ignora */ }
  }
  function teclas(e) { if (e.key === 'Escape') { e.preventDefault(); voltar(); } }
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
    document.addEventListener('keydown', teclas);
    return overlay;
  }
  function pintar(titulo, sub, html, voltarVisivel) {
    const o = garantirJanela();
    o.querySelector('[data-bcqa-titulo]').textContent = titulo;
    o.querySelector('[data-bcqa-sub]').textContent = sub || '';
    o.querySelector('[data-bcqa-voltar]').hidden = !voltarVisivel;
    const corpo = o.querySelector('[data-bcqa-corpo]');
    corpo.innerHTML = html; corpo.scrollTop = 0;
    return corpo;
  }
  function voltar() {
    if (!view || view.tipo === 'hub' || (view.tipo === 'quiz' && fromModule)) return fechar();
    if (view.tipo === 'quiz') return abrirDisciplina(view.disc);
    return abrirHub();
  }

  // ---- telas ----
  function barra(pct) { return '<div class="bcqa-bar" aria-hidden="true"><i style="width:' + pct + '%"></i></div>'; }
  function abrirHub() {
    const B = bank(); fromModule = false; view = { tipo: 'hub' };
    const cards = ORDEM.filter(d => B && B.modulos(d).length).map(d => {
      const mods = B.modulos(d); let resp = 0;
      mods.forEach(n => { resp += resumoModulo(d, n).respondidas; });
      const total = mods.reduce((a, n) => a + qtdDe(d, n), 0), pct = total ? Math.round(resp / total * 100) : 0;
      return '<button type="button" class="bcqa-card" data-disc="' + d + '"><b>' + esc(B.nomes[d]) + '</b><small>' + mods.length + ' módulos · ' + total + ' questões</small>' + barra(pct) + '<small>' + resp + ' respondidas</small></button>';
    }).join('');
    const corpo = pintar('Questões', 'Escolha a disciplina', '<p class="bcqa-intro">Questões inéditas por módulo, com correção na hora e comentário. Seu progresso fica salvo neste aparelho.</p><div class="bcqa-grid">' + (cards || '<p class="bcqa-empty">As questões ainda estão carregando. Tente de novo em instantes.</p>') + '</div>', false);
    corpo.querySelectorAll('[data-disc]').forEach(b => b.addEventListener('click', () => abrirDisciplina(b.dataset.disc)));
    corpo.querySelector('[data-disc]')?.focus();
    return false;
  }
  function abrirDisciplina(disc) {
    const B = bank(); view = { tipo: 'disc', disc };
    const mods = B ? B.modulos(disc) : [];
    const cards = mods.map(n => {
      const s = resumoModulo(disc, n), qt = qtdDe(disc, n), pct = Math.round(Math.min(s.respondidas, qt) / qt * 100);
      const t = (titulos()[disc] || {})[n] || ('Módulo ' + nn(n));
      return '<button type="button" class="bcqa-card" data-mod="' + n + '"><small>MÓDULO ' + nn(n) + '</small><b>' + esc(t) + '</b>' + barra(pct) + '<small>' + s.respondidas + '/' + qt + ' respondidas' + (s.respondidas ? ' · ' + s.acertos + ' acertos' : '') + '</small></button>';
    }).join('');
    const corpo = pintar(B ? B.nomes[disc] : 'Questões', 'Escolha o módulo', '<div class="bcqa-grid">' + cards + '</div>', true);
    corpo.querySelectorAll('[data-mod]').forEach(b => b.addEventListener('click', () => abrirModulo(disc, Number(b.dataset.mod), false)));
    corpo.querySelector('[data-mod]')?.focus();
    return false;
  }
  function cardQuestao(q, i, escolha, total) {
    const feita = Number.isInteger(escolha) && escolha >= 0 && escolha < q.options.length;
    const ops = q.options.map((o, j) => {
      const st = feita ? (j === q.answer ? ' correct' : j === escolha ? ' wrong' : '') : '';
      return '<button type="button" class="bcqa-option' + st + '" data-op="' + j + '" ' + (feita ? 'disabled' : '') + ' aria-pressed="' + (j === escolha) + '"><b>' + LETRAS[j] + '</b><span>' + esc(o) + '</span></button>';
    }).join('');
    const fb = feita ? '<div class="bcqa-feedback" role="status"><strong>' + (escolha === q.answer ? '✓ Resposta correta' : '✕ Resposta incorreta · gabarito ' + LETRAS[q.answer]) + '</strong>' + esc(q.explanation) + (q.lawRef ? '<span class="bcqa-base">Base: ' + esc(q.lawRef) + '</span>' : '') + '</div>' : '';
    return '<section class="bcqa-q" data-i="' + i + '"><p class="bcqa-meta">QUESTÃO ' + nn(i + 1) + ' DE ' + total + '</p><h3>' + esc(q.q) + '</h3><div class="bcqa-options">' + ops + '</div>' + fb + '</section>';
  }
  async function abrirModulo(disc, n, doModulo) {
    const B = bank(); if (!B) return false;
    fromModule = !!doModulo; view = { tipo: 'quiz', disc, n };
    const titulo = (titulos()[disc] || {})[n] || ('Módulo ' + nn(n));
    pintar(titulo, B.nomes[disc] + ' · módulo ' + nn(n), '<p class="bcqa-empty">Carregando as questões…</p>', true);
    const items = await B.get(disc, n);
    if (!view || view.tipo !== 'quiz' || view.disc !== disc || view.n !== n) return false; // aluno já saiu
    if (!items.length) { pintar(titulo, B.nomes[disc] + ' · módulo ' + nn(n), '<p class="bcqa-empty">As questões deste módulo ainda não estão disponíveis.</p>', true); return false; }
    desenharQuiz(disc, n, titulo, items);
    return false;
  }
  function desenharQuiz(disc, n, titulo, items) {
    const B = bank(), r = respostas(disc, n), c = contar(items, r); salvarPlacar(disc, n, c);
    const pct = Math.round(c.respondidas / items.length * 100);
    const final = c.respondidas === items.length
      ? '<div class="bcqa-result" role="status"><b>Resultado: ' + c.acertos + ' de ' + items.length + ' (' + Math.round(c.acertos / items.length * 100) + '%)</b>' + (c.acertos === items.length ? 'Sem erros neste módulo.' : 'Revise os comentários das que errou e refaça só os erros.') + '</div>' : '';
    const botoes = '<div class="bcqa-actions">' + (c.respondidas - c.acertos > 0 ? '<button type="button" class="bcqa-btn" data-erros>Refazer só os erros</button>' : '') + (c.respondidas ? '<button type="button" class="bcqa-btn" data-zerar>Refazer o módulo</button>' : '') + '</div>';
    const corpo = pintar(titulo, B.nomes[disc] + ' · módulo ' + nn(n),
      '<div class="bcqa-stats"><span data-stats>' + c.respondidas + '/' + items.length + ' respondidas · ' + c.acertos + ' acertos</span></div>' + barra(pct) + final + botoes +
      items.map((q, i) => cardQuestao(q, i, r[q.id], items.length)).join(''), true);
    corpo.querySelectorAll('.bcqa-q').forEach(sec => {
      const i = Number(sec.dataset.i), q = items[i];
      sec.querySelectorAll('[data-op]').forEach(b => b.addEventListener('click', () => {
        if (Number.isInteger(respostas(disc, n)[q.id])) return;
        gravarResposta(disc, n, q.id, Number(b.dataset.op));
        const rolagem = corpo.scrollTop; desenharQuiz(disc, n, titulo, items); overlay.querySelector('[data-bcqa-corpo]').scrollTop = rolagem;
      }));
    });
    corpo.querySelector('[data-erros]')?.addEventListener('click', () => { limpar(disc, n, true, items); desenharQuiz(disc, n, titulo, items); });
    corpo.querySelector('[data-zerar]')?.addEventListener('click', () => { limpar(disc, n, false, items); desenharQuiz(disc, n, titulo, items); });
  }

  // ---- entradas: menu lateral e menu "Mais" no celular ----
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
    const grid = document.querySelector('#studentMorePanel .student-more-grid');
    if (grid && !grid.querySelector('[data-bcqa-more]')) {
      const b = document.createElement('button');
      b.type = 'button'; b.setAttribute('data-bcqa-more', '1'); b.setAttribute('data-student-more-action', 'questoes');
      b.innerHTML = '<span aria-hidden="true">?</span><span><b>Questões</b><small>Por módulo, com comentário</small></span><span class="student-more-arrow" aria-hidden="true">→</span>';
      b.addEventListener('click', e => { e.stopPropagation(); document.getElementById('studentMorePanel')?.setAttribute('hidden', ''); abrirDoMenu(b); });
      grid.insertBefore(b, grid.firstChild);
    }
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
