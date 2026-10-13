(function (g) {
  'use strict';
  if (g.__qcCentralSharingLinksInstalled) return;
  g.__qcCentralSharingLinksInstalled = true;

  const root = g.QC_CENTRAL_SHARING_LINKS;
  if (!root || !Array.isArray(root.items)) return;
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[c]);
  const entries = root.items;
  const style = document.createElement('style');
  style.textContent = `
    .qc-platform-sharing{margin:16px 0 20px;padding:16px;border:1px solid #b8dfe5;border-left:4px solid #087e8b;border-radius:12px;background:#f1fbfc;color:#193d45}
    .qc-platform-sharing-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:10px}
    .qc-platform-sharing-head b{font-size:15px;letter-spacing:.01em}
    .qc-platform-sharing-head small{font-size:12px;color:#477079;text-align:right}
    .qc-platform-sharing-list{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr));gap:8px}
    .qc-platform-sharing-link,.qc-platform-sharing-pending{display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:58px;padding:10px 12px;border:1px solid #cce8ec;border-radius:9px;background:#fff;color:#173d45;text-decoration:none;box-sizing:border-box}
    .qc-platform-sharing-link:hover{border-color:#087e8b;box-shadow:0 3px 12px rgba(8,126,139,.12)}
    .qc-platform-sharing-link span:first-child,.qc-platform-sharing-pending span:first-child{display:grid;gap:4px;min-width:0}
    .qc-platform-sharing-link b,.qc-platform-sharing-pending b{font-size:13px;line-height:1.4;overflow-wrap:anywhere}
    .qc-platform-sharing-link small,.qc-platform-sharing-pending small{font-size:11px;color:#557178;line-height:1.4}
    .qc-platform-sharing-action{flex:0 0 auto;color:#087e8b;font-size:12px;font-weight:700}
    .qc-platform-sharing-pending{border-style:dashed;background:#fffdfa;color:#625940}
    .qc-platform-sharing-pending .qc-platform-sharing-action{color:#766a43}
    @media(max-width:600px){.qc-platform-sharing{padding:12px}.qc-platform-sharing-head{align-items:flex-start;flex-direction:column}.qc-platform-sharing-head small{text-align:left}.qc-platform-sharing-list{grid-template-columns:1fr}.qc-platform-sharing-link,.qc-platform-sharing-pending{align-items:flex-start}.qc-platform-sharing-action{font-size:11px}}
  `;
  (document.head || document.documentElement).appendChild(style);

  function rowsFor(disciplineKey, moduleCode) {
    return entries.filter((x) => x.disciplineKey === disciplineKey && x.code.split('.')[0] === moduleCode);
  }
  function panel(disciplineKey, moduleCode) {
    const rows = rowsFor(disciplineKey, moduleCode);
    if (!rows.length) return null;
    const linked = rows.filter((x) => x.status === 'VALIDADO' && x.public && x.id && x.quantity > 0 && x.link);
    const pending = rows.filter((x) => !linked.includes(x));
    const section = document.createElement('section');
    section.className = 'qc-platform-sharing';
    section.dataset.qcSharingPanel = `${disciplineKey}:${moduleCode}`;
    section.setAttribute('aria-label', `Cadernos QConcursos de ${moduleCode}`);
    const content = rows.map((x) => {
      const label = x.kind === 'general' ? `${x.code} geral` : x.code;
      const title = x.notebookTitle || x.title || x.code;
      if (x.status === 'VALIDADO' && x.public && x.id && x.quantity > 0 && x.link) {
        return `<a class="qc-platform-sharing-link" href="${esc(x.link)}" target="_blank" rel="noopener noreferrer" data-qc-sharing="${esc(x.code)}"><span><b>${esc(label)} · ${esc(title)}</b><small>ID ${esc(x.id)} · ${Number(x.quantity)} questões · Público</small></span><span class="qc-platform-sharing-action">Abrir no QConcursos ↗</span></a>`;
      }
      const reason = x.pendingReason || 'sem link público confirmado';
      return `<div class="qc-platform-sharing-pending" data-qc-pending="${esc(x.code)}"><span><b>${esc(label)} · ${esc(title)}</b><small>${esc(reason)}</small></span><span class="qc-platform-sharing-action">Pendente</span></div>`;
    }).join('');
    section.innerHTML = `<div class="qc-platform-sharing-head"><b>QConcursos</b><small>${linked.length} link${linked.length === 1 ? '' : 's'} público${linked.length === 1 ? '' : 's'} · ${pending.length} pendente${pending.length === 1 ? '' : 's'}</small></div><div class="qc-platform-sharing-list">${content}</div>`;
    return section;
  }
  function mount(host, key, code, before) {
    if (!host || host.querySelector(`[data-qc-sharing-panel="${key}:${code}"]`)) return;
    const el = panel(key, code);
    if (!el) return;
    if (before?.parentNode === host) host.insertBefore(el, before);
    else host.appendChild(el);
  }
  function refresh() {
    document.querySelectorAll('[data-adm-native]').forEach((zone) => {
      const uid = zone.getAttribute('data-adm-native');
      const number = Number(g.ADM_NATIVE_INDEX?.modules?.[uid]?.number);
      if (!number) return;
      const code = `M${String(number).padStart(2, '0')}`;
      mount(zone, 'administrativo', code, zone.querySelector('.adm-native-hint'));
    });
    document.querySelectorAll('#subjects .subject[data-id="penal"] .cf-module[data-cf]').forEach((module) => {
      const number = Number(String(module.getAttribute('data-cf') || '').replace(/^p/i, ''));
      if (!number) return;
      const code = `M${String(number).padStart(2, '0')}`;
      mount(module.querySelector('.cf-module-body'), 'penal', code, null);
    });
    document.querySelectorAll('[data-cpp-native-module]').forEach((module) => {
      const number = Number(module.getAttribute('data-cpp-native-module'));
      if (!number) return;
      const code = `M${String(number).padStart(2, '0')}`;
      const host = module.querySelector('.detail-panel');
      mount(host, 'processual-penal', code, host?.querySelector('.cpp-native-tec-panel')?.nextElementSibling || null);
    });
  }
  let scheduled = false;
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    g.requestAnimationFrame(() => { scheduled = false; refresh(); });
  }
  const observer = new MutationObserver(schedule);
  const start = () => {
    refresh();
    if (document.documentElement) observer.observe(document.documentElement, { childList: true, subtree: true });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})(window);
