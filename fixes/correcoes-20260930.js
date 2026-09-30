(function(){
'use strict';
if(window.__BASE_CORRECOES_20260930__)return;
window.__BASE_CORRECOES_20260930__=true;

var VERSION='20260930r1';
var scheduled=false,observer=null,nativeSubjStats=null;

function q(sel,root){return (root||document).querySelector(sel)}
function qa(sel,root){return Array.prototype.slice.call((root||document).querySelectorAll(sel))}
function localDate(){
  var d=new Date(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');
  return d.getFullYear()+'-'+m+'-'+day;
}
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function setText(el,value){if(el&&el.textContent!==String(value))el.textContent=String(value)}
function setHtml(el,value){if(el&&el.innerHTML!==String(value))el.innerHTML=String(value)}
function smoothTo(el){
  if(!el)return;
  try{el.scrollIntoView({behavior:'smooth',block:'start'})}catch(_){try{el.scrollIntoView()}catch(__){}}
  try{el.focus({preventScroll:true})}catch(_){}
}

/* ---------------------------------------------------------
   1. Configurações: fechamento real + textos para usuário.
   --------------------------------------------------------- */
function settingsElement(){return document.getElementById('centralSettingsBackdrop')}
function forceCloseSettings(){
  var el=settingsElement();if(!el)return false;
  el.classList.add('hidden');
  el.setAttribute('aria-hidden','true');
  el.style.display='none';
  el.style.pointerEvents='none';
  return false;
}
function forceOpenSettings(){
  var el=settingsElement();if(!el)return false;
  el.classList.remove('hidden');
  el.removeAttribute('aria-hidden');
  el.style.removeProperty('display');
  el.style.removeProperty('pointer-events');
  try{if(typeof window.refreshCentralThemeButtons==='function')window.refreshCentralThemeButtons()}catch(_){}
  return false;
}
function hardenSettings(){
  var el=settingsElement();if(!el)return;
  var title=q('#centralSettingsTitle',el);
  var subtitle=title&&title.parentElement?q('p',title.parentElement):null;
  if(subtitle)setText(subtitle,'Aparência, backup e instalação');
  qa('.central-settings-note',el).forEach(function(note){
    var text=String(note.textContent||'');
    if(/DATABASE_URL|BACKUP_SECRET|Segurança do backup online/i.test(text)){
      note.hidden=true;
      note.setAttribute('aria-hidden','true');
    }
  });
  var status=q('#centralBackupStatus',el);
  if(status&&/Vercel|banco configurado|snapshot/i.test(status.textContent||'')){
    setText(status,'Baixe uma cópia local a qualquer momento. O histórico online aparece quando estiver disponível.');
  }
  var x=q('.central-settings-close',el);
  if(x){x.setAttribute('type','button');x.setAttribute('aria-label','Fechar configurações');x.title='Fechar configurações'}
  var done=q('.central-settings-footer button',el);
  if(done){done.setAttribute('type','button');setText(done,'Concluído')}
  if(el.classList.contains('hidden'))forceCloseSettings();
}
function installSettingsGuards(){
  var oldOpen=window.openCentralSettings,oldClose=window.closeCentralSettings;
  if(!oldOpen||!oldOpen.__bcFix){
    var open=function(){try{if(typeof oldOpen==='function')oldOpen.apply(this,arguments)}catch(_){}return forceOpenSettings()};
    open.__bcFix=true;window.openCentralSettings=open;
  }
  if(!oldClose||!oldClose.__bcFix){
    var close=function(){try{if(typeof oldClose==='function')oldClose.apply(this,arguments)}catch(_){}return forceCloseSettings()};
    close.__bcFix=true;window.closeCentralSettings=close;
  }
}

/* ---------------------------------------------------------
   2. Literais \n visíveis: só em nós de texto da interface.
   Scripts, código, inputs e áreas editáveis ficam intocados.
   --------------------------------------------------------- */
function fixLiteralNewlines(root){
  root=root||document.body;if(!root||!document.createTreeWalker)return;
  var walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{
    acceptNode:function(node){
      var p=node.parentElement;
      if(!p||!node.nodeValue||node.nodeValue.indexOf('\\n')<0)return NodeFilter.FILTER_REJECT;
      if(p.closest('script,style,pre,code,textarea,input,select,option,[contenteditable="true"]'))return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  var nodes=[],n;while((n=walker.nextNode()))nodes.push(n);
  nodes.forEach(function(node){
    node.nodeValue=node.nodeValue.replace(/\\n/g,'\n');
    if(node.parentElement)node.parentElement.classList.add('bc-linebreak-fixed');
  });
}

/* ---------------------------------------------------------
   3. Fonte real de contagens.
   CPP usa o curso de 22 módulos; Civil usa o curso próprio.
   No topo da Central, todas as unidades curriculares são módulos.
   --------------------------------------------------------- */
function cppStats(){
  var api=window.CppCourseV1;
  if(!api||!Array.isArray(api.modules)||!api.modules.length)return null;
  var state=null;try{state=api.state()}catch(_){}
  var done=0,total=api.modules.length;
  api.modules.forEach(function(m){
    var x=state&&state.modules?state.modules[m.num]:null;
    if(x&&x.reading&&x.anki&&x.decorando&&x.tec)done++;
  });
  var pct=0;try{pct=Number(api.overall().pct)||0}catch(_){pct=total?Math.round(done/total*100):0}
  return {done:done,total:total,pct:pct,unit:'módulos'};
}
function rlmStats(subject){
  var topics=(subject&&subject.topics)||[];
  var modules=topics.filter(function(t){return /^rlm-m\d+/i.test(String(t.uid||''))});
  if(!modules.length)return null;
  var done=modules.filter(function(t){
    try{return typeof window.goalDone==='function'&&window.goalDone(t.uid)}catch(_){return false}
  }).length;
  return {done:done,total:modules.length,pct:Math.round(done/modules.length*100),unit:'módulos'};
}
function normalizeStats(subject,stats){
  if(!subject)return stats;
  if(subject.id==='cpp'){var c=cppStats();if(c)return c}
  if(subject.id==='rlm'){var r=rlmStats(subject);if(r)return r}
  stats=stats||{done:0,total:(subject.topics||[]).length,pct:0};
  return {done:Number(stats.done)||0,total:Number(stats.total)||0,pct:Number(stats.pct)||0,unit:'módulos'};
}
function installStatsWrapper(){
  if(window.subjStats&&window.subjStats.__bcCounts)return;
  if(typeof window.subjStats!=='function')return;
  nativeSubjStats=window.subjStats;
  var wrapped=function(subject){
    var base=null;
    try{base=nativeSubjStats(subject)}catch(_){base={done:0,total:(subject&&subject.topics||[]).length,pct:0}}
    return normalizeStats(subject,base);
  };
  wrapped.__bcCounts=true;
  window.subjStats=wrapped;
}
function subjectById(id){
  try{return Array.isArray(window.SUBJECTS)?window.SUBJECTS.find(function(s){return s&&s.id===id}):null}catch(_){return null}
}
function domStats(id){
  var section=q('.subject[data-id="'+String(id||'').replace(/"/g,'')+'"]');if(!section)return null;
  if(id==='rlm'){
    var mods=qa('.topic-item[data-uid^="rlm-m"]',section);
    if(mods.length){
      var rd=mods.filter(function(m){var cb=q(':scope > .topic-row input[type="checkbox"]',m);return !!(cb&&cb.checked)}).length;
      return {done:rd,total:mods.length,pct:Math.round(rd/mods.length*100),unit:'módulos'};
    }
  }
  var text=(q('.subject-count',section)||{}).textContent||'',m=text.match(/(\d+)\s*\/\s*(\d+)/);
  var pctText=(q('.subject-pct',section)||{}).textContent||'',pm=pctText.match(/(\d{1,3})\s*%/);
  if(m)return {done:Number(m[1]),total:Number(m[2]),pct:pm?Number(pm[1]):Math.round(Number(m[1])/Math.max(1,Number(m[2]))*100),unit:'módulos'};
  return null;
}
function statsFor(id){
  var subject=subjectById(id);
  if(id==='cpp'){var cpp=cppStats();if(cpp)return cpp}
  if(subject&&typeof window.subjStats==='function'){try{return normalizeStats(subject,window.subjStats(subject))}catch(_){}}
  return domStats(id);
}
function normalizeCounts(){
  qa('.subject[data-id]').forEach(function(section){
    var id=section.getAttribute('data-id'),st=statsFor(id),count=q('.subject-count',section);
    if(st&&count)setText(count,st.done+'/'+st.total+' módulos');
    var pct=q('.subject-pct',section);
    if(st&&pct){setText(pct,st.pct+'%');pct.classList.toggle('done',st.pct===100)}
  });
  qa('.disc-card[data-id]').forEach(function(card){
    var id=card.getAttribute('data-id'),st=statsFor(id);if(!st)return;
    var small=q('small',card),meta=q('.disc-meta',card);
    if(small){
      if(id==='rlm')setText(small,st.total+' módulos + cálculo rápido');
      else setText(small,st.total+' módulos • curso integrado');
    }
    if(meta)setText(meta,st.done+'/'+st.total+' módulos · '+st.pct+'%');
  });
}

/* ---------------------------------------------------------
   4. Primeiro acesso: orientação em vez de "0 de 0".
   --------------------------------------------------------- */
function agendaToday(){
  try{
    if(window.CentralAgenda&&typeof window.CentralAgenda.read==='function'){
      var value=window.CentralAgenda.read(localDate());return Array.isArray(value)?value:[];
    }
  }catch(_){}
  return null;
}
function firstAccessHtml(){
  return '<div class="bc-first-access" data-bc-first-access>'+
    '<strong>Seu dia ainda não foi planejado.</strong>'+
    '<span>Você pode montar a agenda ou abrir diretamente a primeira sessão pendente.</span>'+
    '<div class="bc-first-access-actions">'+
    '<button type="button" class="primary" data-bc-plan-day>Planejar meu dia</button>'+
    '<button type="button" data-bc-first-session>Começar primeira sessão</button>'+
    '</div></div>';
}
function enhanceFirstAccess(){
  var tasks=agendaToday();if(tasks===null||tasks.length)return;
  var count=q('#dayCount'),pct=q('#dayPct'),bar=q('#dayBar'),host=q('#homeAgenda'),pending=q('#homePending');
  if(count)setText(count,'Dia ainda não planejado');
  if(pct)setText(pct,'Escolha por onde começar');
  if(bar)bar.style.width='0%';
  if(host&&!q('[data-bc-first-access]',host))host.innerHTML=firstAccessHtml();
  if(pending)setHtml(pending,'<div class="muted small" style="padding:12px 0">Sem pendências cadastradas. Planeje o dia ou comece por um módulo pendente.</div>');
  var label=q('#homeTodayLabel');if(label)setText(label,'Nenhuma tarefa cadastrada para hoje.');
  var cont=q('#continueBox');
  if(cont&&/Nenhuma sessão recente/i.test(cont.textContent||'')&&!q('[data-bc-first-session]',cont)){
    cont.insertAdjacentHTML('beforeend','<div style="margin-top:9px"><button type="button" class="btn primary sm" data-bc-first-session>Começar primeira sessão</button></div>');
  }
}
function firstIncompleteSubject(){
  var list=[];try{list=Array.isArray(window.SUBJECTS)?window.SUBJECTS:[]}catch(_){}
  if(!list.length)list=qa('.subject[data-id]').map(function(el){return {id:el.getAttribute('data-id')||''}});
  for(var i=0;i<list.length;i++){
    var item=list[i],st=statsFor(item.id);
    if(!st||st.pct<100)return item;
  }
  return list[0]||null;
}
function openFirstSession(){
  var subject=firstIncompleteSubject();if(!subject)return false;
  try{
    if(typeof window.openHome==='function')window.openHome();
    localStorage.setItem('central-v6:open:'+subject.id,'1');
    if(typeof window.renderSubjects==='function')window.renderSubjects();
  }catch(_){}
  var tries=0;
  function find(){
    tries++;
    var section=q('.subject[data-id="'+String(subject.id).replace(/"/g,'')+'"]');
    if(!section&&tries<15){setTimeout(find,100);return}
    if(!section)return;
    if(!section.classList.contains('open')){
      var sh=q('.subject-head',section);if(sh)sh.click();else section.classList.add('open');
    }
    setTimeout(function(){
      var roots=qa('.cf-module,.civil-module,.cpp-mod,.topic-item',section);
      var target=roots.find(function(root){
        if(root.matches('.cpp-mod')){
          var n=Number(root.getAttribute('data-cpp-num')),state=null;
          try{state=window.CppCourseV1.state().modules[n]}catch(_){}
          return !(state&&state.reading&&state.anki&&state.decorando&&state.tec);
        }
        var cb=q(':scope > .topic-row input[type="checkbox"]',root);
        if(cb)return !cb.checked;
        var p=q('.cf-module-stat,.civil-module-state,.cpp-mpct',root);
        return !p||!/100\s*%/.test(p.textContent||'');
      })||roots[0];
      if(!target){smoothTo(section);return}
      var head=q('.cf-module-head,.civil-module-head,.cpp-mod-head,.topic-row',target);
      if(!target.classList.contains('open')&&head)head.click();
      setTimeout(function(){smoothTo(head||target)},80);
    },120);
  }
  setTimeout(find,80);
  return false;
}

/* ---------------------------------------------------------
   5. Navegação de módulos longos, sem tocar no progresso.
   --------------------------------------------------------- */
function moduleBody(module){
  return q('.detail-panel,.cf-module-body,.civil-module-body,.cpp-mod-body',module);
}
function sessionCandidates(body){
  if(!body)return [];
  var groups=[
    'article[class*="adm-"][class*="-session"]',
    '.cpp-sections > .cpp-sec',
    '.civil-a-section',
    '.civil-step',
    '.cf-steps > .cf-step',
    'article[id*="-s"]'
  ];
  for(var i=0;i<groups.length;i++){
    var found=qa(groups[i],body).filter(function(el){
      return !el.closest('.bc-session-nav')&&!el.classList.contains('bc-session-pager');
    });
    if(found.length>=2)return found;
  }
  return [];
}
function sessionTitle(el,index){
  var head=q('.adm-m1-session-head h3,[class*="-session-head"] h3,.cf-step-copy b,h2,h3,h4,:scope > b',el);
  var text=(head&&head.textContent||'').replace(/\s+/g,' ').trim();
  return text||('Sessão '+String(index+1).padStart(2,'0'));
}
function moduleKey(module){
  return module.getAttribute('data-uid')||module.getAttribute('data-cf')||module.getAttribute('data-penal')||
    module.getAttribute('data-cpc')||module.getAttribute('data-ptn-module')||module.getAttribute('data-civil-analista')||
    module.getAttribute('data-civil')||('cpp-'+(module.getAttribute('data-cpp-num')||''))||'module';
}
function enhanceSessionNavigation(module){
  var body=moduleBody(module);if(!body)return;
  var sessions=sessionCandidates(body);
  if(sessions.length<2){
    qa(':scope > .bc-session-nav',body).forEach(function(x){x.remove()});
    qa('.bc-session-pager',body).forEach(function(x){x.remove()});
    return;
  }
  var signature=sessions.map(function(s,i){return sessionTitle(s,i)}).join('|');
  if(body.getAttribute('data-bc-session-signature')===signature&&q(':scope > .bc-session-nav',body))return;
  qa(':scope > .bc-session-nav',body).forEach(function(x){x.remove()});
  qa('.bc-session-pager',body).forEach(function(x){x.remove()});
  sessions.forEach(function(s,i){s.setAttribute('data-bc-session-index',String(i))});
  var nav=document.createElement('details');nav.className='bc-session-nav';nav.open=false;
  nav.innerHTML='<summary>Índice de sessões · '+sessions.length+'</summary><div class="bc-session-index">'+
    sessions.map(function(s,i){return '<button type="button" data-bc-jump-session="'+i+'">'+(i+1)+'. '+esc(sessionTitle(s,i))+'</button>'}).join('')+'</div>';
  var first=sessions[0],top=first;
  while(top.parentElement&&top.parentElement!==body&&top.parentElement.children.length===1)top=top.parentElement;
  body.insertBefore(nav,body.firstChild);
  sessions.forEach(function(s,i){
    var pager=document.createElement('nav');pager.className='bc-session-pager';pager.setAttribute('aria-label','Navegação entre sessões');
    pager.innerHTML='<button type="button" data-bc-prev-session="'+i+'" '+(i===0?'disabled':'')+'>← Sessão anterior</button>'+
      '<button type="button" class="next" data-bc-next-session="'+i+'" '+(i===sessions.length-1?'disabled':'')+'>Próxima sessão →</button>';
    s.appendChild(pager);
  });
  body.setAttribute('data-bc-session-signature',signature);
}
function enhanceAllSessionNav(){
  qa('.topic-item[data-uid],.cf-module,.civil-module,.cpp-mod').forEach(function(module){
    if(!module.classList.contains('open'))return;
    try{enhanceSessionNavigation(module)}catch(e){console.warn('Índice de sessões',moduleKey(module),e)}
  });
}
function jumpSession(button,direction){
  var module=button.closest('.topic-item,.cf-module,.civil-module,.cpp-mod');if(!module)return false;
  var body=moduleBody(module),sessions=sessionCandidates(body);if(!sessions.length)return false;
  var index=Number(button.getAttribute(direction==='jump'?'data-bc-jump-session':direction==='prev'?'data-bc-prev-session':'data-bc-next-session'));
  if(direction==='prev')index--;else if(direction==='next')index++;
  index=Math.max(0,Math.min(sessions.length-1,index));
  smoothTo(sessions[index]);
  var nav=q(':scope > .bc-session-nav',body);if(nav&&direction==='jump')nav.open=false;
  return false;
}

/* ---------------------------------------------------------
   6. Rótulos e botões de retorno.
   --------------------------------------------------------- */
function normalizeNavigationLabels(){
  qa('.central-view-back,.central-embedded-back').forEach(function(btn){
    setText(btn,'← Voltar à Central');
    btn.setAttribute('aria-label','Voltar à Central');
    btn.title='Voltar à Central';
  });
}

/* ---------------------------------------------------------
   Atualização coordenada.
   --------------------------------------------------------- */
function enhance(){
  scheduled=false;
  try{installSettingsGuards();hardenSettings()}catch(e){console.warn('Configurações',e)}
  try{installStatsWrapper();normalizeCounts()}catch(e){console.warn('Contagens',e)}
  try{fixLiteralNewlines(document.body)}catch(e){console.warn('Quebras de linha',e)}
  try{enhanceFirstAccess()}catch(e){console.warn('Primeiro acesso',e)}
  try{normalizeNavigationLabels()}catch(e){console.warn('Navegação',e)}
  try{enhanceAllSessionNav()}catch(e){console.warn('Sessões',e)}
}
function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(enhance)}

document.addEventListener('click',function(event){
  var plan=event.target.closest('[data-bc-plan-day]');
  if(plan){event.preventDefault();try{if(window.CentralAgenda&&typeof window.CentralAgenda.open==='function')window.CentralAgenda.open(plan);else if(typeof window.openAgenda==='function')window.openAgenda(plan)}catch(_){}return}
  var first=event.target.closest('[data-bc-first-session]');
  if(first){event.preventDefault();openFirstSession();return}
  var close=event.target.closest('#centralSettingsBackdrop .central-settings-close,#centralSettingsBackdrop .central-settings-footer button');
  if(close){event.preventDefault();event.stopPropagation();forceCloseSettings();return}
  var back=event.target.closest('.central-view-back,.central-embedded-back');
  if(back&&typeof window.openHome==='function'){event.preventDefault();window.openHome();return}
  var jump=event.target.closest('[data-bc-jump-session]');
  if(jump){event.preventDefault();jumpSession(jump,'jump');return}
  var prev=event.target.closest('[data-bc-prev-session]');
  if(prev&&!prev.disabled){event.preventDefault();jumpSession(prev,'prev');return}
  var next=event.target.closest('[data-bc-next-session]');
  if(next&&!next.disabled){event.preventDefault();jumpSession(next,'next');return}
  if(event.target.closest('#subjects'))schedule();
},true);

document.addEventListener('keydown',function(event){
  if(event.key==='Escape'&&settingsElement()&&!settingsElement().classList.contains('hidden'))forceCloseSettings();
});
document.addEventListener('change',function(event){if(event.target.closest('#subjects,#agendaView'))schedule()});
window.addEventListener('central-progress-changed',schedule);
window.addEventListener('storage',schedule);

function start(){
  enhance();
  observer=new MutationObserver(function(){schedule()});
  observer.observe(document.body,{childList:true,subtree:true,characterData:true});
  setTimeout(enhance,150);
  setTimeout(enhance,650);
  setTimeout(enhance,1500);
}
window.BaseCorrecoes20260930={
  version:VERSION,
  refresh:enhance,
  closeSettings:forceCloseSettings,
  openSettings:forceOpenSettings,
  startFirstSession:openFirstSession,
  cppStats:cppStats
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();