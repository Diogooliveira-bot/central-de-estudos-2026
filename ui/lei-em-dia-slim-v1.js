/* Base Completa — Lei em Dia enxuto, versão de homologação.
   Camada somente de apresentação; mantém o renderizador, a API autorizada,
   as questões, os filtros originais e os dados do usuário. */
(function(){
  'use strict';
  if(typeof render!=='function'||typeof ui==='undefined')return;
  const mascot='/assets/mascote/';
  const mk=(tag,cls,txt)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(txt!==undefined)el.textContent=txt;return el};
  const by=(root,sel)=>root&&root.querySelector(sel);
  const reviewPending=()=>typeof allActiveAll==='function'
    ?allActiveAll().filter(q=>typeof lastAttempt==='function'&&lastAttempt(q.id)?.correct===false).length:0;
  const safeText=(el,value)=>{if(el)el.textContent=value};
  document.documentElement.classList.add('bc-led-slim');

  // ETAPA 1: dois campos principais e filtros adicionais recolhíveis.
  function simplifyFilters(root){
    const form=by(root,'.bc-accordion');
    const discipline=by(form,'.bc-discipline-step');
    const moduleField=by(form,'.bc-filter-section .bc-step-fields .qc-field');
    if(discipline&&moduleField){
      const block=mk('div','bc-slim-module-step');
      const title=mk('div','bc-step-title');
      title.innerHTML='<span aria-hidden="true">02</span><strong>Módulo</strong>';
      block.append(title,moduleField);
      discipline.after(block);
    }
    const sections=[...root.querySelectorAll('.bc-filter-section')];
    if(sections[0]){
      const title=by(sections[0],'.bc-step-title strong');
      safeText(title,'Refinar por lei e assunto');
    }
    if(sections[1]){
      const title=by(sections[1],'.bc-step-title strong');
      safeText(title,'Banca, ano e origem');
    }
    const intro=by(root,'.qc-title p');
    safeText(intro,'Escolha uma disciplina e um módulo para começar. Os demais filtros são opcionais.');
    const stats=by(root,'.qc-status');
    const group=by(stats,'.qc-status-options');
    if(group){
      const extra=mk('details','bc-led-more-status');
      const summary=mk('summary','','Mais situações');
      const box=mk('div','bc-led-status-extra');
      const buttons=[...group.querySelectorAll(':scope > button')];
      buttons.forEach((button,i)=>{
        if(i===2 || i===4){box.appendChild(button);if(button.classList.contains('selected'))extra.open=true}
        if(i===1){const n=button.firstChild;if(n&&n.nodeType===3)n.textContent='Não respondidas'}
        if(i===3){const n=button.firstChild;if(n&&n.nodeType===3)n.textContent='Errei'}
      });
      if(box.children.length){extra.append(summary,box);group.after(extra)}
    }
    const hint=by(stats,'.qc-status-heading small');
    if(hint){
      hint.textContent='Pratique questões novas ou revise as que errou.';
      const note=mk('p','bc-slim-subtle','Uma questão é dominada após 5 acertos consecutivos; os erros reiniciam a sequência.');
      if(!by(stats,'.bc-slim-subtle'))stats.append(note);
    }
    const oldOpts=by(root,'.qc-opts summary strong');
    safeText(oldOpts,'Preferências de estudo');
    const go=by(root,'.bc-session-action .qc-go');
    safeText(go,'Começar a resolver →');
    const title=by(root,'.qc-title h1');
    safeText(title,'Pratique a lei com questões');
    const topMascot=by(root,'.qc-mascote');
    if(topMascot){topMascot.alt='';topMascot.decoding='async'}
  }

  // ETAPA 2: questão com foco no enunciado, resposta e fundamento legal.
  function simplifyStudy(root){
    const title=by(root,'.study-header-actions .topbar-audit');
    safeText(title,'Meu progresso');
    const actions=by(root,'.exercise-card .question-actions');
    if(actions){
      const buttons=[...actions.querySelectorAll(':scope > button')];
      const movable=buttons.filter(b=>/Comentário|Editar|Excluir/i.test(b.textContent||''));
      if(movable.length){
        const more=mk('details','bc-led-more-actions');
        const summary=mk('summary','','Mais opções');
        const bucket=mk('div','bc-led-extra-actions');
        movable.forEach(b=>bucket.append(b));
        more.append(summary,bucket);actions.append(more);
      }
    }
    const phrase=by(root,'.exercise-heading h2');
    if(phrase&&phrase.textContent.trim()==='Julgue o item a seguir')phrase.textContent='Julgue a afirmação';
    const footer=by(root,'.article-footer');
    if(footer){const go=by(footer,'.btn-next');if(go)go.textContent='Próxima questão →'}
    // Alertas de revisão jurídica, autoria, gabarito e artigos permanecem visíveis.
  }

  // ETAPA 3: painel resumido, mantendo os indicadores completos sob demanda.
  function simplifyAudit(root){
    const header=by(root,'.audit-heading h1');
    safeText(header,'Seu progresso');
    safeText(by(root,'.audit-heading p'),'Veja seus resultados e identifique onde vale revisar.');
    const metric=by(root,'.metric-grid');
    if(metric){
      const cards=[...metric.children].filter(x=>x.tagName==='ARTICLE');
      if(cards.length>=7){
        const main=[cards[1],cards[2]];
        safeText(by(cards[2],'span'),'Aproveitamento');
        const pending=mk('article','bc-led-pending-metric');
        pending.append(mk('span','','Para revisar'),mk('strong','',String(reviewPending())),mk('small','','questões com último resultado incorreto'));
        const extra=mk('details','bc-led-extra-metrics');
        const summary=mk('summary','','Ver todos os indicadores');
        const grid=mk('div','bc-led-extra-metrics-grid');
        [cards[0],...cards.slice(3)].forEach(c=>grid.append(c));
        extra.append(summary,grid);
        metric.replaceChildren(...main,pending);
        metric.after(extra);
      }
    }
  }

  // ETAPA 4: entrada direta para revisão dos erros, sem modificar tentativas.
  function addReviewShortcut(root,screen){
    if(screen==='audit'){
      const heading=by(root,'.audit-heading');
      if(!heading)return;
      const pending=reviewPending();
      const bar=mk('div','bc-led-review-bar');
      const msg=mk('p','',pending
        ?pending+' questão(ões) com último resultado incorreto. Escolha uma disciplina e revise essas questões.'
        :'Nenhum erro pendente no histórico atual. Continue praticando.');
      const btn=mk('button','', 'Revisar meus erros');
      btn.type='button';btn.disabled=!pending;
      btn.addEventListener('click',()=>{
        if(typeof chooseDiscipline==='function')chooseDiscipline(saved.preferences.discipline);
        ui.discPicked=true;
        ui.screen='filters';
        if(typeof chooseStatus==='function')chooseStatus('wrong');
        else render();
        window.scrollTo(0,0);
      });
      bar.append(msg,btn);heading.after(bar);
    }else if(screen==='filters'){
      const row=by(root,'.bc-session-action');
      if(!row||!ui.discPicked||typeof statusCounts!=='function')return;
      const wrong=statusCounts().wrong;
      if(!wrong)return;
      const btn=mk('button','bc-led-text-action','Revisar '+wrong+' erro'+(wrong===1?'':'s'));
      btn.type='button';
      btn.addEventListener('click',()=>{chooseStatus('wrong');startStudy()});
      const wrap=mk('div','bc-led-inline-actions');wrap.append(btn);
      row.before(wrap);
    }
  }

  // ETAPA 5: mascote só em momentos úteis, nunca sobre o enunciado.
  function addMascot(root,screen){
    if(screen==='audit'){
      const bar=by(root,'.bc-led-review-bar');
      if(!bar)return;
      const img=mk('img');img.src=mascot+(reviewPending()?'mascote-erros.webp':'mascote-comemorando.webp');img.alt='';img.loading='lazy';img.width=52;img.height=56;
      img.style.cssText='width:52px;height:56px;object-fit:contain;flex:none';
      bar.prepend(img);
    }else if(screen==='study'){
      const empty=by(root,'.empty-status');
      if(empty&&!/limite diário|carregando|indisponível|erro/i.test(empty.textContent||'')){
        const img=mk('img');img.src=mascot+'mascote-livros.webp';img.alt='';img.loading='lazy';img.width=70;img.height=76;
        img.style.cssText='display:block;width:70px;height:76px;object-fit:contain;margin:0 auto 8px';
        empty.prepend(img);
      }
    }
  }

  // ETAPA 6: proteção contra texto cortado, menus encobertos e telas estreitas.
  function mobileAccessibility(root){
    root.querySelectorAll('.qc-select,.qc-go,.btn-next,.bc-led-text-action,.bc-led-review-bar button').forEach(b=>{
      if(b.tagName==='BUTTON'&&!b.hasAttribute('type'))b.type='button';
    });
    const wrapper=by(root,'.qc-content,.audit-content,.workspace');
    if(wrapper)wrapper.style.minWidth='0';
  }

  // A escolha de um módulo principal é única; fechar o popover evita
  // que seu backdrop impeça o botão "Começar a resolver".
  if(typeof qcPick==='function'){
    const baseQcPick=qcPick;
    qcPick=function(field,key){
      if(field==='module'&&!ui.selectedModules.has(key))ui.selectedModules.clear();
      baseQcPick(field,key);
      if(field==='module'){ui.dd=null;render()}
    };
  }

  const originalRender=render;
  let busy=false;
  render=function(){
    originalRender();
    if(busy)return;
    busy=true;
    try{
      const root=document.getElementById('app');
      if(!root)return;
      const screen=ui.screen;
      if(screen==='filters')simplifyFilters(root);
      if(screen==='study')simplifyStudy(root);
      if(screen==='audit')simplifyAudit(root);
      addReviewShortcut(root,screen);
      addMascot(root,screen);
      mobileAccessibility(root);
    }catch(error){
      // Em caso de problema na camada visual, os elementos essenciais já
      // foram renderizados pelo aplicativo original.
      console.error('Lei em Dia (prévia): ajuste visual não aplicado',error);
    }finally{busy=false}
  };
  // A primeira abertura recolhe apenas filtros opcionais; depois respeita
  // as escolhas de expansão feitas pelo aluno.
  if(!ui.filterOpen)ui.filterOpen={subjects:false,banks:false};
  else if(ui.screen==='filters')ui.filterOpen.subjects=false;
  render();
})();
