/* Base Completa — Relatório do aluno e contato, integrado à Central existente. */
(function () {
  'use strict';
  if (window.BCStudyCommunication) return;

  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const clamp = v => { const n=Number(v); return Number.isFinite(n) ? Math.max(0,Math.min(100,Math.round(n))) : 0; };
  const statusName = p => p===100 ? 'Concluído' : p>0 ? 'Em andamento' : 'Sem progresso registrado';
  const user = () => window.BASE_COMPLETA_USER || {};
  const isPreviewDemo = () => user().id === 'bc-preview-demo-20261109';
  let layer, currentReport, config, statusElement;

  function findSubjects() {
    try { if (typeof SUBJECTS !== 'undefined' && Array.isArray(SUBJECTS)) return SUBJECTS; } catch (_) {}
    return Array.isArray(window.SUBJECTS) ? window.SUBJECTS : [];
  }
  function buildReport() {
    const source=findSubjects();
    let done=0, underway=0, pending=0;
    const disciplines=source.map(s => {
      const topics = s.id==='cpp' ? (window.CentralHomeProgressData?.cppModules || s.topics || []) : (s.topics||[]);
      if (!Array.isArray(topics)) return null;
      let saved=null;
      try { saved=window.CentralDisciplineLoader?.percentages(s); } catch (_) {}
      const modules=topics.map((m,index) => {
        let value=saved?.[index];
        if (!Number.isFinite(Number(value))) {
          try { value=typeof window.mapaTopicPct==='function' ? window.mapaTopicPct(s,index,m) : 0; }
          catch (_) { value=0; }
        }
        const pct=clamp(value);
        if (pct===100) done++; else if (pct>0) underway++; else pending++;
        return {title:String(m.title||m.name||('Módulo '+(index+1))).replace(/^\d+\s*[-–]?\s*/,''),pct};
      });
      const pct=modules.length ? Math.round(modules.reduce((sum,m)=>sum+m.pct,0)/modules.length) : 0;
      return {id:s.id,name:String(s.name||s.id),pct,modules};
    }).filter(d=>d&&d.modules.length);
    const stats=typeof window.BaseCompletaProgressReportSnapshot==='function'
      ? window.BaseCompletaProgressReportSnapshot() : {};
    return {name:user().name||'Aluno',disciplines,done,underway,pending,
      questions:Math.max(0,Number(stats.questions)||0),
      studySeconds:Math.max(0,Number(stats.studySeconds)||0),
      recordedAt:new Date().toISOString()};
  }

  function compactText(r) {
    const fmt=new Intl.DateTimeFormat('pt-BR',{dateStyle:'short',timeStyle:'short',timeZone:'America/Fortaleza'});
    const lines=['BASE COMPLETA | RELATÓRIO DE ESTUDOS',
      'Aluno: '+r.name,'Emissão: '+fmt.format(new Date(r.recordedAt)),'',
      'Módulos concluídos: '+r.done,
      'Em andamento: '+r.underway,
      'Sem progresso registrado: '+r.pending,''];
    r.disciplines.forEach(d => lines.push(d.name+': '+d.pct+'%'));
    const focus=r.disciplines.flatMap(d=>d.modules.filter(m=>m.pct<100).map(m=>d.name+' — '+m.title+' ('+m.pct+'%)'));
    if (focus.length) {
      lines.push('', 'Pendências prioritárias / sem conclusão registrada:');
      focus.slice(0,12).forEach(t=>lines.push('• '+t));
      if (focus.length>12) lines.push('E mais '+(focus.length-12)+' módulos sem conclusão registrada.');
    }
    lines.push('','0% significa falta de registro na plataforma, não ausência de estudo fora dela.');
    return lines.join('\n');
  }

  function setStatus(message,error=false) {
    if (!statusElement) return;
    statusElement.textContent=message;
    statusElement.classList.toggle('bc-comm-error',Boolean(error));
  }
  function showTab(tab) {
    layer.querySelectorAll('[data-bc-panel]').forEach(el=>el.hidden=el.dataset.bcPanel!==tab);
    layer.querySelectorAll('[data-bc-tab]').forEach(el=>el.setAttribute('aria-selected',String(el.dataset.bcTab===tab)));
    setStatus('');
    if (tab==='report') renderReport();
    if (tab==='support') loadConfig();
    if (tab==='inbox') loadInbox();
  }
  function open(tab='report') {
    if (!layer) return;
    layer.hidden=false;
    document.body.classList.add('bc-comm-open');
    showTab(tab);
    layer.querySelector('.bc-comm-close')?.focus();
  }
  function close() {
    if (!layer) return;
    layer.hidden=true;
    document.body.classList.remove('bc-comm-open');
  }
  function renderReport() {
    currentReport=buildReport();
    const r=currentReport, host=layer.querySelector('#bcCommReport');
    if (!r.disciplines.length) {
      host.innerHTML='<p>Não foi possível ler os módulos nesta tela. Volte à Central e tente novamente.</p>';
      return;
    }
    const fmt=new Intl.DateTimeFormat('pt-BR',{dateStyle:'short',timeStyle:'short',timeZone:'America/Fortaleza'});
    host.innerHTML='<p class="bc-comm-note">Emissão: '+esc(fmt.format(new Date(r.recordedAt)))+
      ' · O relatório reflete os registros disponíveis neste dispositivo.</p>'+
      '<div class="bc-comm-metrics"><div><b>'+r.done+'</b><span>Concluídos</span></div><div><b>'+r.underway+
      '</b><span>Em andamento</span></div><div><b>'+r.pending+'</b><span>Sem registro</span></div></div>'+
      r.disciplines.map(d => '<details class="bc-comm-group"><summary><b>'+esc(d.name)+
      '</b><span>'+d.pct+'% · '+d.modules.length+' módulos</span></summary><div class="bc-comm-modules">'+
      d.modules.map(m=>'<div><span>'+esc(m.title)+'</span><small>'+esc(statusName(m.pct))+
      ' · '+m.pct+'%</small></div>').join('')+'</div></details>').join('')+
      '<p class="bc-comm-note">Um módulo com 0% está sem progresso registrado — isso não comprova que o aluno deixou de estudá-lo fora da plataforma. O tempo de estudo, quando disponível, é aproximado.</p>';
  }
  async function request(action,method='GET',body) {
    const response=await fetch('/api/study-communication?action='+encodeURIComponent(action),{
      method,credentials:'same-origin',cache:'no-store',
      headers:method==='POST'?{'Content-Type':'application/json'}:undefined,
      body:method==='POST'?JSON.stringify(body):undefined
    });
    let data={};
    try { data=await response.json(); } catch (_) {}
    if (!response.ok) throw new Error(data.error||'Não foi possível concluir a solicitação.');
    return data;
  }
  async function loadConfig() {
    try {
      config=await request('config');
      const wa=layer.querySelector('#bcCommWhatsappSupport');
      const hint=layer.querySelector('#bcCommWhatsappHint');
      if (config.whatsappUrl) {
        wa.href=config.whatsappUrl+'?text='+encodeURIComponent('Olá, sou aluno da Base Completa e preciso de ajuda.');
        wa.hidden=false;hint.hidden=true;
      } else {
        wa.hidden=true;hint.hidden=false;
      }
      const email=layer.querySelector('#bcCommEmailSupport');
      email.href='mailto:'+config.email+'?subject='+encodeURIComponent('Suporte Base Completa');
      email.textContent='Enviar e-mail para '+config.email;
      const phone=layer.querySelector('#bcCommPhone');
      if (phone) phone.value=config.whatsappNumber||'';
    } catch(e) { setStatus(e.message,true); }
  }
  async function saveWhatsappNumber(event) {
    event.preventDefault();
    const form=event.currentTarget,button=form.querySelector('button[type="submit"]');
    button.disabled=true;setStatus('Salvando número oficial...');
    try {
      await request('whatsapp-config','POST',{phone:form.elements.phone.value});
      await loadConfig();setStatus('Número de WhatsApp atualizado para todos os alunos.');
    } catch(e) { setStatus(e.message,true); }
    finally { button.disabled=false; }
  }
  async function sendTicket(event) {
    event.preventDefault();
    const form=event.currentTarget, button=form.querySelector('button[type="submit"]');
    button.disabled=true;setStatus('Registrando sua mensagem...');
    try {
      const data=await request('contact','POST',{
        subject:form.elements.subject.value,message:form.elements.message.value
      });
      form.reset();
      setStatus('Mensagem recebida! Protocolo: '+String(data.ticketId||'').slice(0,8).toUpperCase()+'. Enviamos a confirmação para o seu e-mail; respondemos em até 5 dias, no mesmo e-mail.');
    } catch(e) { setStatus(e.message,true); }
    finally { button.disabled=false; }
  }
  async function sendEmail() {
    const button=layer.querySelector('#bcCommSendEmail');
    if (!currentReport?.disciplines?.length) return setStatus('O relatório ainda não está pronto.',true);
    button.disabled=true;setStatus('Enviando para o e-mail da sua conta...');
    try {
      const data=await request('report-email','POST',{report:currentReport});
      setStatus('Relatório enviado ao e-mail cadastrado: '+data.email+'. Confira também a pasta Spam.');
    } catch(e) { setStatus(e.message,true); }
    finally { button.disabled=false; }
  }
  function sendWhatsapp() {
    if (!currentReport) return;
    // Abre o WhatsApp com a mensagem preenchida; o envio final depende do usuário.
    window.open('https://api.whatsapp.com/send?text='+encodeURIComponent(compactText(currentReport)),
      '_blank','noopener,noreferrer');
  }
  function printReport() {
    if (!currentReport) return;
    const r=currentReport;
    const win=window.open('','_blank');
    if (!win) return setStatus('O navegador bloqueou a impressão. Permita a abertura de janelas.',true);
    const date=new Intl.DateTimeFormat('pt-BR',{dateStyle:'long',timeZone:'America/Fortaleza'}).format(new Date(r.recordedAt));
    const groups=r.disciplines.map(d=>'<section><h2>'+esc(d.name)+' <small>'+d.pct+'%</small></h2><table><thead><tr><th>Módulo</th><th>Situação</th><th>Progresso</th></tr></thead><tbody>'+
      d.modules.map(m=>'<tr><td>'+esc(m.title)+'</td><td>'+esc(statusName(m.pct))+'</td><td>'+m.pct+'%</td></tr>').join('')+'</tbody></table></section>').join('');
    win.document.open();
    win.document.write('<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Relatório de estudos — Base Completa</title><style>body{font:13px/1.5 Arial,sans-serif;color:#182d42;margin:35px}h1{color:#133b5e;font-size:23px}h2{font-size:16px;margin:22px 0 8px;border-bottom:1px solid #d7e1e9;padding-bottom:6px}h2 small{float:right}table{width:100%;border-collapse:collapse}th,td{text-align:left;border-bottom:1px solid #e2e9ef;padding:6px}td:last-child{text-align:right}thead{background:#f1f5f9}section{break-inside:avoid}footer{margin-top:18px;color:#5d7081;font-size:11px}@media print{body{margin:14mm}}</style></head><body>'+
      '<p>BASE COMPLETA · CENTRAL DE ESTUDOS</p><h1>Relatório de estudos</h1><p>Aluno: <b>'+esc(r.name)+'</b><br>Emissão: '+esc(date)+'</p>'+
      '<p><b>'+r.done+'</b> concluídos · <b>'+r.underway+'</b> em andamento · <b>'+r.pending+'</b> sem progresso registrado</p>'+
      groups+'<footer>Relatório baseado nos registros da Central. 0% não comprova ausência de estudo fora da plataforma. Para salvar em PDF, selecione “Salvar como PDF” na impressão.</footer></body></html>');
    win.document.close();win.focus();setTimeout(()=>win.print(),250);
  }
  async function loadInbox() {
    const target=layer.querySelector('#bcCommInbox');
    target.textContent='Carregando mensagens...';
    try {
      const data=await request('tickets');
      const items=Array.isArray(data.tickets)?data.tickets:[];
      target.innerHTML=items.length ? items.map(t=>'<article class="bc-comm-ticket"><p><b>'+esc(t.subject)+
        '</b> <small>'+esc(t.status==='closed'?'Resolvido':'Aberto')+'</small></p><p>'+esc(t.user_name)+' · '+esc(t.user_email)+'</p><p class="bc-comm-ticket-text">'+esc(t.message)+'</p>'+
        '<button type="button" data-bc-ticket="'+esc(t.ticket_id)+'" data-bc-next="'+(t.status==='closed'?'open':'closed')+'">'+
        (t.status==='closed'?'Reabrir':'Marcar como resolvido')+'</button></article>').join('') : '<p>Não há mensagens de suporte.</p>';
    } catch(e) { target.textContent=e.message; }
  }
  async function changeTicket(button) {
    button.disabled=true;
    try {
      await request('ticket-status','POST',{ticketId:button.dataset.bcTicket,status:button.dataset.bcNext});
      await loadInbox();
    } catch(e) { button.disabled=false; setStatus(e.message,true); }
  }
  function addStyle() {
    if (document.getElementById('bcCommStyle')) return;
    const style=document.createElement('style');style.id='bcCommStyle';style.textContent=`
      .bc-comm-open{overflow:hidden}.bc-comm-overlay[hidden],.bc-comm-overlay [hidden]{display:none!important}
      .bc-comm-overlay{position:fixed;inset:0;z-index:2147483000;background:#07162d99;display:flex;align-items:center;justify-content:center;padding:14px;font-family:Inter,system-ui,Arial,sans-serif}
      .bc-comm-dialog{position:relative;background:white;color:#17334c;width:min(840px,100%);max-height:92dvh;overflow:auto;border-radius:17px;box-shadow:0 30px 80px #07162d33;padding:25px}
      .bc-comm-dialog h2{margin:0 32px 5px 0;font-size:23px;font-weight:800;letter-spacing:-.025em;color:#102e4c}
      .bc-comm-dialog p{line-height:1.55}.bc-comm-caption,.bc-comm-note{color:#5b7085;font-size:12px}
      .bc-comm-close{position:absolute;right:16px;top:16px;border:0;background:#edf3f8;color:#163854;width:35px;height:35px;border-radius:9px;font-size:22px;cursor:pointer}
      .bc-comm-tabs{display:flex;gap:8px;flex-wrap:wrap;margin:22px 0;border-bottom:1px solid #dce6ee;padding-bottom:12px}
      .bc-comm-tabs button,.bc-comm-actions button,.bc-comm-actions a,.bc-comm-dialog form button,.bc-comm-ticket button{font:700 13px Inter,system-ui,Arial,sans-serif;border:1px solid #cbd9e5;border-radius:9px;padding:11px 14px;background:white;color:#173b5d;cursor:pointer;text-decoration:none}
      .bc-comm-tabs button[aria-selected=true],.bc-comm-actions button:first-child,.bc-comm-dialog form button{background:#173b5d;color:white;border-color:#173b5d}
      .bc-comm-actions{display:flex;flex-wrap:wrap;gap:9px;margin:18px 0}
      .bc-comm-actions button:disabled,.bc-comm-dialog button:disabled{opacity:.55;cursor:wait}
      .bc-comm-metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin:15px 0}
      .bc-comm-metrics>div{border:1px solid #dce7ef;border-radius:10px;padding:12px;background:#f8fbfd}
      .bc-comm-metrics b{display:block;font-size:24px;color:#153954}.bc-comm-metrics span{color:#62778a;font-size:11px}
      .bc-comm-group{margin:8px 0;border:1px solid #dce5eb;border-radius:9px;overflow:hidden}
      .bc-comm-group summary{display:flex;justify-content:space-between;align-items:center;gap:12px;cursor:pointer;padding:13px;background:#fafcfe;font-size:13px}
      .bc-comm-group summary span{white-space:nowrap;color:#48657c}
      .bc-comm-modules>div{display:flex;justify-content:space-between;gap:14px;padding:9px 13px;border-top:1px solid #edf1f5;font-size:12px}
      .bc-comm-modules small{white-space:nowrap;color:#506d82}
      .bc-comm-dialog form label{display:block;font-size:12px;font-weight:750;margin:14px 0 5px}
      .bc-comm-dialog input,.bc-comm-dialog textarea{width:100%;background:white;color:#163650;border:1px solid #cddde8;border-radius:8px;padding:11px 12px;font:14px system-ui}
      .bc-comm-dialog textarea{min-height:120px;resize:vertical}
      .bc-comm-status{font-size:12px;color:#215c79;min-height:17px}.bc-comm-error{color:#a82424}
      .bc-comm-ticket{border:1px solid #dce5eb;border-radius:11px;padding:13px;margin:10px 0}
      .bc-comm-ticket p{margin:6px 0;font-size:12px}.bc-comm-ticket-text{white-space:pre-wrap}
      @media(max-width:640px){.bc-comm-overlay{padding:0}.bc-comm-dialog{width:100%;height:100dvh;max-height:100dvh;border-radius:0;padding:19px}.bc-comm-modules>div{display:block}.bc-comm-modules small{display:block;margin-top:4px}.bc-comm-dialog h2{font-size:20px}}
    `;
    document.head.appendChild(style);
  }
  function init() {
    addStyle();
    layer=document.createElement('div');layer.className='bc-comm-overlay';layer.hidden=true;
    layer.innerHTML=`<section class="bc-comm-dialog" role="dialog" aria-modal="true" aria-label="Acompanhamento de estudos e suporte">
      <button type="button" class="bc-comm-close" aria-label="Fechar janela">×</button>
      <h2>Acompanhamento e suporte</h2>
      <p class="bc-comm-caption">Base Completa · Seu espaço de estudos</p>
      ${isPreviewDemo()?'<p class="bc-comm-note"><strong>Modo de teste:</strong> as informações e mensagens ficam no ambiente de homologação, sem envio automático de e-mails.</p>':''}
      <div class="bc-comm-tabs" role="tablist">
        <button type="button" data-bc-tab="report" aria-selected="true">Meu relatório</button>
        <button type="button" data-bc-tab="support" aria-selected="false">Fale conosco</button>
        ${user().role==='admin'?'<button type="button" data-bc-tab="inbox" aria-selected="false">Mensagens recebidas</button>':''}
      </div>
      <div data-bc-panel="report">
        <h3>Meu relatório de estudos</h3>
        <p class="bc-comm-note">Veja os módulos concluídos, em andamento e sem progresso registrado.</p>
        <div id="bcCommReport"></div>
        <div class="bc-comm-actions">
          ${isPreviewDemo()?'<p class="bc-comm-note">Demonstração: envio de relatório por e-mail desativado.</p>':'<button type="button" id="bcCommSendEmail">Enviar ao meu e-mail</button>'}
          <button type="button" id="bcCommSendWhatsapp">Compartilhar pelo WhatsApp</button>
          <button type="button" id="bcCommPrint">Imprimir / salvar PDF</button>
        </div>
      </div>
      <div data-bc-panel="support" hidden>
        <h3>Como podemos ajudar?</h3>
        <div class="bc-comm-actions">
          <a id="bcCommWhatsappSupport" hidden target="_blank" rel="noopener noreferrer">Conversar pelo WhatsApp</a>
          <a id="bcCommEmailSupport" href="mailto:basecompleta.estudos@gmail.com">Enviar e-mail</a>
        </div>
        <p id="bcCommWhatsappHint" class="bc-comm-note">O WhatsApp de suporte será exibido quando o número oficial for configurado.</p>
        ${user().role==='admin'?'<form id="bcCommPhoneForm"><h3>Configurar WhatsApp oficial</h3><label for="bcCommPhone">Número com DDI e DDD</label><input id="bcCommPhone" name="phone" inputmode="tel" placeholder="Ex.: 5585999999999"><p class="bc-comm-note">Deixe vazio para desativar o botão. Somente administradores podem alterar.</p><button type="submit">Salvar WhatsApp de suporte</button></form>':''}
        <form id="bcCommTicketForm">
          <h3>Enviar mensagem pela Central</h3>
          <label for="bcCommSubject">Assunto</label><input id="bcCommSubject" name="subject" maxlength="120" minlength="4" required placeholder="Ex.: dúvida sobre meu acesso">
          <label for="bcCommMessage">Mensagem</label><textarea id="bcCommMessage" name="message" maxlength="3000" minlength="12" required placeholder="Descreva sua dúvida."></textarea>
          <button type="submit">Enviar mensagem</button>
        </form>
      </div>
      <div data-bc-panel="inbox" hidden><h3>Mensagens dos alunos</h3><div id="bcCommInbox"></div></div>
      <p class="bc-comm-status" id="bcCommStatus" role="status" aria-live="polite"></p>
    </section>`;
    document.body.appendChild(layer);
    statusElement=layer.querySelector('#bcCommStatus');
    layer.querySelector('.bc-comm-close').addEventListener('click',close);
    layer.addEventListener('click',e=>{
      if (e.target===layer) close();
      const tab=e.target.closest('[data-bc-tab]');if (tab) showTab(tab.dataset.bcTab);
      const ticket=e.target.closest('[data-bc-ticket]');if (ticket) changeTicket(ticket);
    });
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!layer.hidden)close()});
    layer.querySelector('#bcCommSendEmail')?.addEventListener('click',sendEmail);
    layer.querySelector('#bcCommSendWhatsapp').addEventListener('click',sendWhatsapp);
    layer.querySelector('#bcCommPrint').addEventListener('click',printReport);
    layer.querySelector('#bcCommTicketForm').addEventListener('submit',sendTicket);
    layer.querySelector('#bcCommPhoneForm')?.addEventListener('submit',saveWhatsappNumber);

    function addNavigation() {
      const modern = document.documentElement.classList.contains('student-experience-v3');
      const more = document.querySelector('#studentMorePanel .student-more-grid');
      // V3 hides every unregistered direct navigation child. Expose the tools
      // in the existing Mais panel instead of adding invisible sidebar entries.
      if (modern && more) {
        document.getElementById('bcStudyReportNav')?.remove();
        document.getElementById('bcStudySupportNav')?.remove();
        for (const [id,title,subtitle,tab,icon] of [
          ['bcStudyReportMore','Meu relatório','Módulos e progresso','report','▤'],
          ['bcStudySupportMore','Fale conosco','Dúvidas e atendimento','support','✉']
        ]) {
          if (document.getElementById(id)) continue;
          const button=document.createElement('button');
          button.id=id;button.type='button';
          button.innerHTML='<span aria-hidden="true">'+icon+'</span><span><b>'+title+'</b><small>'+subtitle+'</small></span>';
          button.addEventListener('click',()=>{
            const panel=document.getElementById('studentMorePanel');
            if(panel) panel.hidden=true;
            document.documentElement.classList.remove('student-more-open');
            const trigger=document.getElementById('studentMoreButton');
            trigger?.setAttribute('aria-expanded','false');
            open(tab);
          });
          more.insertBefore(button,more.querySelector('[data-student-more-action="logout"]'));
        }
      } else if (!modern) {
        const nav=document.querySelector('#centralSidebar .nav,#centralSidebar nav,aside .nav');
        if (nav) {
          for (const [id,title,tab,icon] of [
            ['bcStudyReportNav','Meu relatório','report','▤'],
            ['bcStudySupportNav','Fale conosco','support','✉']
          ]) {
            if (document.getElementById(id)) continue;
            const button=document.createElement('button');button.id=id;button.type='button';button.className='bc-auth-nav-link';
            button.innerHTML='<span class="nav-icon" aria-hidden="true">'+icon+'</span><span class="nav-text">'+title+'</span>';
            button.addEventListener('click',()=>open(tab));
            nav.appendChild(button);
          }
        }
      }
      const perf=document.getElementById('performanceView');
      if (perf&&!document.getElementById('bcReportPerformanceBtn')) {
        const hero=perf.querySelector('.hero');
        if(hero) {
          const b=document.createElement('button');b.id='bcReportPerformanceBtn';b.type='button';b.className='btn';
          b.textContent='Gerar relatório de estudos';b.addEventListener('click',()=>open('report'));
          hero.appendChild(b);
        }
      }
    }
    addNavigation();
    // A Central reconstitui o menu em algumas navegações.
    setInterval(addNavigation,2000);
  }
  window.BCStudyCommunication={open,buildReport,compactText};
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
