/* Base Completa — orientação inicial curta (Foco · Atenção · Como estudar).
   Uma única implementação para todas as disciplinas. Os textos padrão ficam em
   ui/orientation-defaults-v1.js; administradores/editores podem ajustá-los aqui mesmo,
   e a versão editada é lida por todos os alunos (GET /api/content-editor?action=orientations).
   Sem a API (convidado, offline), vale o texto padrão. Texto simples, nunca HTML. */
(function (global) {
  'use strict';
  if (global.BCOrientation) return;

  var FIELDS = [
    ['foco', 'Foco'],
    ['atencao', 'Atenção'],
    ['dica', 'Como estudar']
  ];
  var MAX = 400;
  var KEY_RE = /^(adm|cf|civil|cpc|penal|cpp|rlm|info):\d{1,2}$/;
  var overrides = {};
  var loadStarted = false;

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function validKey(key) { return KEY_RE.test(String(key || '')); }
  function defaults(key) {
    var all = global.BC_ORIENTATION_DEFAULTS || {};
    return all[key] || null;
  }
  function role() {
    var user = global.BASE_COMPLETA_USER || {};
    return String(user.role || global.__BASE_COMPLETA_USER_ROLE__ || '').toLowerCase();
  }
  function canEdit() {
    return global.__BASE_COMPLETA_PREVIEW_GUEST__ !== true && (role() === 'admin' || role() === 'editor');
  }
  /** Texto efetivo: edição publicada por campo, senão o padrão. */
  function get(key) {
    var base = defaults(key) || {};
    var over = (overrides[key] && overrides[key].fields) || {};
    var out = {};
    FIELDS.forEach(function (f) { out[f[0]] = over[f[0]] || base[f[0]] || ''; });
    return out;
  }
  function hasText(text) { return FIELDS.some(function (f) { return !!text[f[0]]; }); }

  function body(key) {
    var text = get(key);
    return FIELDS.filter(function (f) { return text[f[0]]; }).map(function (f) {
      return '<p><strong>' + f[1] + ':</strong> ' + esc(text[f[0]]) + '</p>';
    }).join('');
  }

  /** HTML da orientação do módulo (string vazia quando não há texto). */
  function html(key, opts) {
    if (!validKey(key)) return '';
    loadOverrides();
    var text = get(key);
    if (!hasText(text)) return '';
    installStyle();
    return '<section class="bc-orient' + (opts && opts.bare ? ' bc-orient-bare' : '') + '" data-bc-orient="' + esc(key) + '" aria-label="Como estudar este módulo">' +
      '<div class="bc-orient-head">' + (opts && opts.bare ? '<span></span>' : '<b>Como estudar este módulo</b>') +
      (canEdit() ? '<button type="button" class="bc-orient-edit" data-bc-orient-edit="' + esc(key) + '">Editar</button>' : '') +
      '</div><div class="bc-orient-body">' + body(key) + '</div></section>';
  }

  function nodes(key) {
    return Array.prototype.slice.call(document.querySelectorAll('[data-bc-orient]')).filter(function (n) {
      return n.getAttribute('data-bc-orient') === key;
    });
  }
  function refresh(key) {
    (key ? nodes(key) : Array.prototype.slice.call(document.querySelectorAll('[data-bc-orient]'))).forEach(function (node) {
      var k = node.getAttribute('data-bc-orient');
      if (node.querySelector('.bc-orient-form')) return; // não sobrescreve edição em andamento
      var target = node.querySelector('.bc-orient-body');
      if (target) target.innerHTML = body(k);
    });
  }

  function loadOverrides() {
    if (loadStarted || typeof fetch !== 'function' || global.__BASE_COMPLETA_PREVIEW_GUEST__ === true) return;
    loadStarted = true;
    fetch('/api/content-editor?action=orientations', { credentials: 'same-origin', cache: 'no-cache' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        if (!data || !Array.isArray(data.items)) return;
        data.items.forEach(function (item) {
          var key = String(item.id || '').replace(/^orient:/, '');
          if (!validKey(key)) return;
          try {
            var fields = JSON.parse(item.html);
            var clean = {};
            FIELDS.forEach(function (f) { if (typeof fields[f[0]] === 'string' && fields[f[0]]) clean[f[0]] = fields[f[0]].slice(0, MAX); });
            overrides[key] = { fields: clean, revision: Number(item.revision) || 0 };
          } catch (_) { /* registro inválido é ignorado: vale o padrão */ }
        });
        refresh();
      })
      .catch(function () { /* sem rede: texto padrão */ });
  }

  function apiSend(method, key, payload) {
    var url = '/api/content-editor' + (method === 'DELETE' ? '?id=' + encodeURIComponent('orient:' + key) : '');
    return fetch(url, {
      method: method,
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: method === 'DELETE' ? undefined : JSON.stringify(payload)
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (data) {
        if (!r.ok) throw new Error(data.error || 'Não foi possível salvar.');
        return data;
      });
    });
  }

  function openEditor(key) {
    var node = nodes(key)[0];
    if (!node || node.querySelector('.bc-orient-form')) return;
    var text = get(key);
    var target = node.querySelector('.bc-orient-body');
    var form = document.createElement('form');
    form.className = 'bc-orient-form';
    form.innerHTML = FIELDS.map(function (f) {
      return '<label>' + f[1] + '<textarea name="' + f[0] + '" rows="3" maxlength="' + MAX + '">' + esc(text[f[0]]) + '</textarea></label>';
    }).join('') +
      '<div class="bc-orient-actions">' +
      '<button type="submit" class="bc-orient-save">Salvar</button>' +
      '<button type="button" data-bc-orient-cancel>Cancelar</button>' +
      '<button type="button" data-bc-orient-reset>Restaurar texto padrão</button>' +
      '<span class="bc-orient-status" role="status" aria-live="polite"></span></div>';
    target.innerHTML = '';
    target.appendChild(form);
    var status = form.querySelector('.bc-orient-status');
    function done(message) { form.remove(); refresh(key); if (message) flash(node, message); }
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var fields = {};
      FIELDS.forEach(function (f) { fields[f[0]] = String(form.elements[f[0]].value || '').replace(/[<>]/g, '').replace(/\s+/g, ' ').trim(); });
      if (!hasText(fields)) { status.textContent = 'Preencha ao menos um campo ou use “Restaurar texto padrão”.'; return; }
      status.textContent = 'Salvando…';
      apiSend('POST', key, {
        id: 'orient:' + key,
        label: 'Orientação inicial ' + key,
        html: JSON.stringify(fields),
        expectedRevision: overrides[key] ? overrides[key].revision : 0
      }).then(function (data) {
        overrides[key] = { fields: fields, revision: Number(data.revision) || 0 };
        done('Orientação salva para todos os alunos.');
      }).catch(function (error) { status.textContent = error.message; });
    });
    form.querySelector('[data-bc-orient-cancel]').addEventListener('click', function () { done(); });
    form.querySelector('[data-bc-orient-reset]').addEventListener('click', function () {
      if (!overrides[key]) { done('Já está no texto padrão.'); return; }
      status.textContent = 'Restaurando…';
      apiSend('DELETE', key).then(function () {
        delete overrides[key];
        done('Texto padrão restaurado.');
      }).catch(function (error) { status.textContent = error.message; });
    });
    var first = form.querySelector('textarea');
    if (first) first.focus();
  }
  function flash(node, message) {
    var note = document.createElement('small');
    note.className = 'bc-orient-flash';
    note.textContent = message;
    node.appendChild(note);
    setTimeout(function () { if (note.parentNode) note.remove(); }, 2600);
  }

  document.addEventListener('click', function (event) {
    var button = event.target && event.target.closest && event.target.closest('[data-bc-orient-edit]');
    if (!button) return;
    event.preventDefault();
    event.stopPropagation();
    if (canEdit()) openEditor(button.getAttribute('data-bc-orient-edit'));
  }, true);

  function installStyle() {
    try { installStyleUnsafe(); } catch (_) { /* estilo é opcional */ }
  }
  function installStyleUnsafe() {
    if (document.getElementById('bc-orient-style')) return;
    var s = document.createElement('style');
    s.id = 'bc-orient-style';
    s.textContent =
      '.bc-orient{margin:0 0 14px;padding:12px 14px;border:1px solid var(--line,rgba(127,127,127,.28));border-left:3px solid var(--accent,#24c77a);border-radius:10px;background:var(--panel,transparent);color:var(--text,inherit)}' +
      '.bc-orient-head{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:6px}' +
      '.bc-orient-head b{font-size:13px}' +
      '.bc-orient-bare{margin:0;padding:6px 0 0;border:0;border-left:0;background:transparent}' +
      '.bc-orient-bare .bc-orient-head{justify-content:flex-end;margin:0}' +
      '.bc-orient p{margin:4px 0;font-size:13px;line-height:1.5}' +
      '.bc-orient strong{font-weight:800}' +
      '.bc-orient-edit,.bc-orient-actions button{min-height:30px;padding:4px 10px;border:1px solid var(--line2,rgba(127,127,127,.4));border-radius:8px;background:var(--panel2,transparent);color:var(--text,inherit);font:inherit;font-size:12px;font-weight:700;cursor:pointer}' +
      '.bc-orient-form{display:grid;gap:8px}' +
      '.bc-orient-form label{display:grid;gap:3px;font-size:12px;font-weight:800}' +
      '.bc-orient-form textarea{width:100%;box-sizing:border-box;padding:8px;border:1px solid var(--line2,rgba(127,127,127,.4));border-radius:8px;background:var(--input,transparent);color:var(--text,inherit);font:inherit;font-size:13px;font-weight:400;resize:vertical}' +
      '.bc-orient-actions{display:flex;flex-wrap:wrap;align-items:center;gap:8px}' +
      '.bc-orient-save{border-color:rgba(36,199,122,.7)!important}' +
      '.bc-orient-status,.bc-orient-flash{font-size:12px;color:var(--muted,inherit)}';
    document.head.appendChild(s);
  }

  global.BCOrientation = { html: html, get: get, refresh: refresh, canEdit: canEdit, _overrides: overrides };
})(window);
