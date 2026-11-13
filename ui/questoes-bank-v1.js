/* Base Completa · Banco de questões.
 * Um arquivo por módulo (content/questoes/<disciplina>/mNN.js), baixado só quando o aluno abre
 * as questões do módulo. O índice (content/questoes/index.js) diz quais módulos já têm questões.
 * Para acrescentar questões: content/questoes/LEIAME.md. */
(function (g) {
  'use strict';
  if (g.BCQuestoes) return;
  const VERSION = '20261112q1';
  const NOMES = {
    adm: 'Direito Administrativo', cpc: 'Direito Processual Civil', pt: 'Português', penal: 'Direito Penal',
    cpp: 'Direito Processual Penal', cf: 'Direito Constitucional', civil: 'Direito Civil', rlm: 'Raciocínio Lógico-Matemático', info: 'Informática'
  };
  const pending = {};
  const indice = () => g.BC_QUESTOES_INDICE || {};
  const nn = n => String(Number(n)).padStart(2, '0');
  function modulos(disc) { return (indice()[disc] || []).slice(); }
  function has(disc, n) { return (indice()[disc] || []).includes(Number(n)); }
  function cache(disc, n) { return g.BC_QUESTOES && g.BC_QUESTOES[disc] && g.BC_QUESTOES[disc][Number(n)]; }
  function carregar(disc, n) {
    const ready = cache(disc, n);
    if (Array.isArray(ready)) return Promise.resolve(ready);
    if (!has(disc, n) || typeof document === 'undefined') return Promise.resolve([]);
    const key = disc + ':' + Number(n);
    if (!pending[key]) pending[key] = new Promise(resolve => {
      const s = document.createElement('script');
      let done = false;
      const fim = () => {
        if (done) return; done = true; clearTimeout(timer); s.remove();
        const items = cache(disc, n);
        if (!Array.isArray(items)) delete pending[key];
        resolve(Array.isArray(items) ? items : []);
      };
      const timer = setTimeout(fim, 15000);
      s.src = '/content/questoes/' + disc + '/m' + nn(n) + '.js?v=' + VERSION;
      s.async = true; s.onload = fim; s.onerror = fim;
      document.head.appendChild(s);
    });
    return pending[key];
  }
  g.BCQuestoes = Object.freeze({ version: VERSION, nomes: NOMES, modulos, has, get: carregar });
})(window);
