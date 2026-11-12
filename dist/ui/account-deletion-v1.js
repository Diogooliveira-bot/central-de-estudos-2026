/* Base Completa — "Excluir minha conta" (Configurações › Minha conta).
   Confirma com a senha atual e a palavra EXCLUIR; o servidor apaga a conta e os dados
   ligados a ela (lib/account-deletion-handler.js). Disponível apenas para alunos. */
(function (g) {
  'use strict';
  if (g.CentralAccountDeletion) return;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));
  function role() { return String(g.BASE_COMPLETA_USER?.role || g.CentralPlanAccess?.plan?.role || 'aluno'); }

  function open() {
    if (document.getElementById('bc-account-delete')) return;
    const box = document.createElement('div');
    box.id = 'bc-account-delete';
    box.className = 'bc-acc-del';
    box.innerHTML =
      '<form class="bc-acc-del-box" role="dialog" aria-modal="true" aria-labelledby="bc-acc-del-title" novalidate>' +
      '<h2 id="bc-acc-del-title">Excluir minha conta</h2>' +
      '<p>Esta ação é <strong>definitiva</strong>. Serão apagados seu cadastro, progresso, anotações sincronizadas, preferências e o acesso aos planos, inclusive o tempo restante do Premium.</p>' +
      '<p class="bc-acc-del-note">Registros que a lei obriga a guardar, como os de compras, são mantidos sem vínculo com a sua conta. As anotações salvas só neste aparelho continuam nele até você limpar os dados do navegador.</p>' +
      '<label>Senha atual<input type="password" name="password" autocomplete="current-password" required></label>' +
      '<label>Digite <b>EXCLUIR</b> para confirmar<input type="text" name="confirmation" autocomplete="off" autocapitalize="characters" required></label>' +
      '<p class="bc-acc-del-msg" role="alert" hidden></p>' +
      '<div class="bc-acc-del-actions"><button type="button" data-cancel>Cancelar</button><button type="submit" class="danger">Excluir definitivamente</button></div>' +
      '</form>';
    document.body.appendChild(box);
    const form = box.querySelector('form'), msg = box.querySelector('.bc-acc-del-msg'), submit = form.querySelector('[type=submit]');
    const close = () => { box.remove(); document.removeEventListener('keydown', onKey, true); };
    const onKey = e => { if (e.key === 'Escape') { e.preventDefault(); e.stopImmediatePropagation(); close(); } };
    document.addEventListener('keydown', onKey, true);
    box.addEventListener('click', e => { if (e.target === box || e.target.closest('[data-cancel]')) close(); });
    const show = text => { msg.hidden = false; msg.textContent = text; };
    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (role() !== 'aluno') return show('Contas da equipe são excluídas pelo administrador.');
      const password = form.password.value, confirmation = form.confirmation.value.trim().toUpperCase();
      if (!password) return show('Informe sua senha atual.');
      if (confirmation !== 'EXCLUIR') return show('Digite EXCLUIR para confirmar.');
      submit.disabled = true; submit.textContent = 'Excluindo…';
      try {
        const r = await fetch('/api/auth?action=delete-account', {
          method: 'POST', credentials: 'same-origin', cache: 'no-store',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({password, confirmation})
        });
        const data = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(data.error || 'Não foi possível excluir a conta.');
        try { localStorage.clear(); sessionStorage.clear(); } catch (_) {}
        form.innerHTML = '<h2>Conta excluída</h2><p>Sua conta e seus dados foram apagados. Obrigado por ter estudado com a Base Completa.</p>';
        setTimeout(() => { location.href = '/login.html'; }, 2500);
      } catch (err) {
        show(err.message); submit.disabled = false; submit.textContent = 'Excluir definitivamente';
      }
    });
    form.password.focus();
  }

  document.addEventListener('click', e => {
    const b = e.target.closest?.('[data-account-delete]');
    if (b) { e.preventDefault(); open(); }
  });
  const st = document.createElement('style');
  st.textContent =
    '.bc-acc-del{position:fixed;inset:0;z-index:2147483200;display:grid;place-items:center;padding:16px;background:rgba(10,30,45,.55)}' +
    '.bc-acc-del-box{width:min(440px,100%);background:#fff;color:#12384e;border-radius:16px;padding:22px;box-shadow:0 18px 50px rgba(0,0,0,.25);font:15px/1.5 system-ui,-apple-system,Segoe UI,sans-serif}' +
    '.bc-acc-del-box h2{margin:0 0 8px;font-size:20px}.bc-acc-del-box p{margin:0 0 12px}.bc-acc-del-note{font-size:13px;color:#4b6475}' +
    '.bc-acc-del-box label{display:block;margin:0 0 12px;font-weight:600;font-size:14px}' +
    '.bc-acc-del-box input{display:block;width:100%;box-sizing:border-box;margin-top:5px;padding:10px 12px;border:1px solid #c9d6e2;border-radius:10px;font:inherit}' +
    '.bc-acc-del-msg{color:#b42318;font-weight:600}' +
    '.bc-acc-del-actions{display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap}' +
    '.bc-acc-del-actions button{font:600 15px system-ui,sans-serif;border-radius:10px;padding:10px 16px;border:1px solid #c9d6e2;background:#fff;color:#12384e;cursor:pointer}' +
    '.bc-acc-del-actions .danger{background:#b42318;border-color:#b42318;color:#fff}.bc-acc-del-actions .danger:disabled{opacity:.6}';
  document.head.appendChild(st);
  g.CentralAccountDeletion = {open};
})(window);
