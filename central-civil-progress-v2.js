(function(){
'use strict';

var VERSION='2.0.0';
var STORAGE_KEY='central-v6:civil-study-progress-v1';
var TEC_KEY='central-v6:tec:registros';
var DEFAULT_TEC_TARGET=50;
var READING_PARTS=[
  ['coverage','Cobertura'],
  ['theory','Teoria'],
  ['jurisprudence','Jurisprudência'],
  ['examples','Exemplos'],
  ['traps','Pegadinhas']
];
var MODULES=[
  {id:'civ-pessoa-natural',title:'Pessoa Natural e Direitos da Personalidade',deck:'04 DIREITO CIVIL::01 PESSOA NATURAL E DIREITOS DA PERSONALIDADE',anki:47,decorando:37,tec:['cc-01']},
  {id:'civ-pessoa-juridica',title:'Pessoas Jurídicas e Domicílio',deck:'04 DIREITO CIVIL::02 PESSOAS JURÍDICAS E DOMICÍLIO',anki:34,decorando:66,tec:['cc-02']},
  {id:'civ-bens',title:'Bens',deck:'04 DIREITO CIVIL::03 BENS',anki:34,decorando:44,tec:['cc-03']},
  {id:'civ-negocio',title:'Negócio Jurídico',deck:'04 DIREITO CIVIL::04 NEGÓCIO JURÍDICO',anki:74,decorando:55,tec:['cc-04']},
  {id:'civ-prescricao-prova',title:'Prescrição, Decadência e Prova',deck:'04 DIREITO CIVIL::05 PRESCRIÇÃO, DECADÊNCIA E PROVA',anki:48,decorando:72,tec:['cc-05']},
  {id:'civ-obrigacoes',title:'Obrigações',deck:'04 DIREITO CIVIL::06 OBRIGAÇÕES',anki:143,decorando:140,tec:['cc-06','cc-07','cc-08']},
  {id:'civ-contratos-geral',title:'Contratos em Geral',deck:'04 DIREITO CIVIL::07 CONTRATOS EM GERAL',anki:58,decorando:47,tec:['cc-09']},
  {id:'civ-contratos-especie',title:'Contratos em Espécie',deck:'04 DIREITO CIVIL::08 CONTRATOS EM ESPÉCIE',anki:56,decorando:120,tec:['cc-10','cc-11']},
  {id:'civ-responsabilidade',title:'Responsabilidade Civil',deck:'04 DIREITO CIVIL::09 RESPONSABILIDADE CIVIL',anki:40,decorando:43,tec:['cc-12']},
  {id:'civ-empresa',title:'Direito de Empresa e Nome Empresarial',deck:'04 DIREITO CIVIL::10 DIREITO DE EMPRESA E NOME EMPRESARIAL',anki:32,decorando:55,tec:['emp-01','emp-02']},
  {id:'civ-posse',title:'Posse',deck:'04 DIREITO CIVIL::11 POSSE',anki:43,decorando:45,tec:['cc-13']},
  {id:'civ-propriedade',title:'Propriedade, Vizinhança e Condomínios',deck:'04 DIREITO CIVIL::12 PROPRIEDADE, VIZINHANÇA E CONDOMÍNIOS',anki:35,decorando:59,tec:['cc-14','cc-15']},
  {id:'civ-direitos-reais',title:'Outros Direitos Reais e Garantias',deck:'04 DIREITO CIVIL::13 OUTROS DIREITOS REAIS E GARANTIAS',anki:30,decorando:44,tec:['cc-16','cc-17']},
  {id:'civ-familia',title:'Direito de Família',deck:'04 DIREITO CIVIL::14 DIREITO DE FAMÍLIA',anki:98,decorando:124,tec:['cc-18','cc-19','cc-20']},
  {id:'civ-sucessoes',title:'Direito das Sucessões',deck:'04 DIREITO CIVIL::15 DIREITO DAS SUCESSÕES',anki:90,decorando:105,tec:['cc-21','cc-22','cc-23']}
];
var MODULE_BY_ID=new Map(MODULES.map(function(m){return [m.id,m]}));
var ankiRuntime={ready:false,modules:{},signature:''};
var originalRenderCivil=window.renderCivilMaster;
var originalSubjStats=window.subjStats;

function clamp(v){v=Math.round(Number(v)||0);return Math.max(0,Math.min(100,v))}
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])})}
function escAttr(v){return esc(v)}
function emptyState(){return {schemaVersion:2,modules:{},updatedAt:null}}
function loadProgress(){
  try{
    var s=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');
    if(!s||typeof s!=='object')return emptyState();
    if(!s.modules||typeof s.modules!=='object')s.modules={};
    s.schemaVersion=2;
    return s;
  }catch(e){return emptyState()}
}
function saveProgress(s){
  s.schemaVersion=2;s.updatedAt=new Date().toISOString();
  localStorage.setItem(STORAGE_KEY,JSON.stringify(s));
}
function moduleState(s,id){
  if(!s.modules[id]||typeof s.modules[id]!=='object')s.modules[id]={};
  var m=s.modules[id];
  if(!m.reading||typeof m.reading!=='object')m.reading={};
  m.anki=clamp(m.anki);m.decorando=clamp(m.decorando);
  if(!Number.isFinite(Number(m.tecTarget))||Number(m.tecTarget)<1)m.tecTarget=DEFAULT_TEC_TARGET;
  m.tecTarget=Math.max(1,Math.min(10000,Math.round(Number(m.tecTarget))));
  return m;
}
function loadTec(){try{var x=JSON.parse(localStorage.getItem(TEC_KEY)||'[]');return Array.isArray(x)?x:[]}catch(e){return []}}
function loadDecorando(){try{var x=JSON.parse(localStorage.getItem('lei-seca-enxuta-state')||'{}');return x&&typeof x==='object'?x:{}}catch(e){return {}}}
function readingPct(ms){var n=READING_PARTS.filter(function(x){return !!ms.reading[x[0]]}).length;return n*20}
function reviewedInDecorando(moduleId,deco){
  var index=window.CIVIL_DECORANDO_IDS_V1&&window.CIVIL_DECORANDO_IDS_V1[moduleId];
  if(!Array.isArray(index)||!index.length)return {ready:false,done:0,total:(MODULE_BY_ID.get(moduleId)||{}).decorando||0,pct:0};
  var attempts=deco.attempts||{},answered=deco.answered||{},done=0;
  index.forEach(function(id){if((Array.isArray(attempts[id])&&attempts[id].length)||Object.prototype.hasOwnProperty.call(answered,id))done++});
  return {ready:true,done:done,total:index.length,pct:index.length?Math.round(done/index.length*100):0};
}
function ankiInfo(m){
  var found=ankiRuntime.modules[m.id];
  if(found)return found;
  return {ready:false,done:0,total:m.anki,pct:0};
}
function tecRows(m,regs){
  var allowed=new Set(m.tec);
  return regs.map(function(r,index){return {r:r,index:index}}).filter(function(x){return x.r&&((x.r.moduleId===m.id)||allowed.has(String(x.r.cid||'')))}).sort(function(a,b){return String(b.r.dt||'').localeCompare(String(a.r.dt||''))||b.index-a.index});
}
function moduleStats(m,s,regs,deco){
  var ms=moduleState(s,m.id),ai=ankiInfo(m),di=reviewedInDecorando(m.id,deco),rows=tecRows(m,regs);
  var reading=readingPct(ms);
  var anki=ai.ready?ai.pct:clamp(ms.anki);
  var decorando=di.ready?di.pct:clamp(ms.decorando);
  var tecDone=0,tecCorrect=0;
  rows.forEach(function(x){var f=Math.max(0,Number(x.r.f)||0),a=Math.max(0,Number(x.r.a)||0);tecDone+=f;tecCorrect+=Math.min(f,a)});
  var tecTarget=ms.tecTarget||DEFAULT_TEC_TARGET;
  var tec=Math.min(100,Math.round(tecDone/tecTarget*100));
  return {reading:reading,anki:anki,decorando:decorando,tec:tec,overall:Math.round((reading+decorando+tec)/3),ankiInfo:ai,decorandoInfo:di,rows:rows,tecDone:tecDone,tecCorrect:tecCorrect,tecErrors:Math.max(0,tecDone-tecCorrect),tecTarget:tecTarget,tecAverage:tecDone?Math.round(tecCorrect/tecDone*100):null};
}
function courseStats(){
  var s=loadProgress(),regs=loadTec(),deco=loadDecorando(),sum=0,done=0;
  MODULES.forEach(function(m){var x=moduleStats(m,s,regs,deco);sum+=x.overall;if(x.overall===100)done++});
  return {total:MODULES.length,done:done,pct:Math.round(sum/MODULES.length)};
}
function stageBar(pct){return '<div class="csp-meter" aria-hidden="true"><span style="width:'+clamp(pct)+'%"></span></div>'}
function shortCaderno(cid){
  try{
    var c=(window.TEC_CADERNOS_DATA&&window.TEC_CADERNOS_DATA.cadernos||[]).find(function(x){return x.id===cid});
    return c?String(c.nome||c.id).replace(/^[A-ZÇ-]+(?:-[A-ZÇ]+)?\s+\d+\s+-\s+/i,''):String(cid||'TEC');
  }catch(e){return String(cid||'TEC')}
}
function fmtDate(d){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(String(d||'')))return String(d||'');
  var p=d.split('-');return p[2]+'/'+p[1]+'/'+p[0];
}
function pctColor(p){return p>=80?'good':p>=60?'warn':'low'}
function readingCard(m,ms,st){
  var done=READING_PARTS.filter(function(part){return !!ms.reading[part[0]]}).length;
  return '<article class="csp-stage-card"><div class="csp-stage-head"><div><b>Leitura</b><small>'+done+'/5 tópicos concluídos · marque no fim de cada texto</small></div><strong>'+st.reading+'%</strong></div>'+stageBar(st.reading)+'<p class="csp-auto-status">Os botões de leitura ficam junto ao conteúdo, exatamente onde você termina de ler.</p></article>';
}
function automaticCard(st,kind,title,icon,label,auto){
  var text=auto&&auto.ready?auto.done+'/'+auto.total+' '+label+' registrados automaticamente':'Aguardando os dados automáticos desta ferramenta';
  if(!auto.ready&&st[kind]>0)text+=' · progresso anterior preservado';
  return '<article class="csp-stage-card"><div class="csp-stage-head"><div><b>'+icon+' '+esc(title)+'</b><small>'+esc(text)+'</small></div><strong>'+st[kind]+'%</strong></div>'+stageBar(st[kind])+'<p class="csp-auto-status">O progresso muda sozinho conforme você usa '+esc(title)+'.</p></article>';
}
function readingAction(m,part,checked){
  var label=checked?'✓ Leitura concluída — desfazer':'Marcar leitura concluída';
  return '<div class="csp-topic-read"><button type="button" class="'+(checked?'done':'')+'" onclick="return civilStudyToggleReading(&quot;'+escAttr(m.id)+'&quot;,&quot;'+part[0]+'&quot;,'+(!checked)+')">'+label+'</button></div>';
}
function tecCard(m,st){
  var rows=st.rows,best=null;
  rows.forEach(function(x){var f=Math.max(0,Number(x.r.f)||0),a=Math.max(0,Number(x.r.a)||0),p=f?Math.round(a/f*100):0;if(best===null||p>best)best=p});
  var last=rows.length?(Number(rows[0].r.f)?Math.round(Number(rows[0].r.a||0)/Number(rows[0].r.f)*100):0):null;
  var history=rows.length?'<div class="csp-tec-history">'+rows.map(function(x,i){var r=x.r,f=Math.max(0,Number(r.f)||0),a=Math.min(f,Math.max(0,Number(r.a)||0)),erros=Math.max(0,f-a),p=f?Math.round(a/f*100):0,round=rows.length-i;return '<div class="csp-tec-row"><span><b>Rodada '+round+' · '+fmtDate(r.dt)+'</b><small>'+esc(shortCaderno(r.cid))+(r.note?' · '+esc(r.note):'')+'</small></span><span>'+a+'/'+f+' · '+erros+' erros</span><strong class="'+pctColor(p)+'">'+p+'%</strong><button type="button" title="Apagar esta rodada" aria-label="Apagar rodada" onclick="civilStudyDeleteTec('+x.index+')">×</button></div>'}).join('')+'</div>':'<p class="csp-empty">Nenhuma rodada registrada neste módulo.</p>';
  var summary=rows.length?'<div class="csp-tec-summary"><span>Geral <b>'+st.tecAverage+'%</b></span><span>Última <b>'+last+'%</b></span><span>Melhor <b>'+best+'%</b></span><span>Erros <b>'+st.tecErrors+'</b></span></div>':'<div class="csp-tec-summary"><span>Registre feitas e acertos ao terminar cada sessão.</span></div>';
  var reached=st.tec>=100?'<p class="csp-tec-reached">✓ Meta atingida. Você pode continuar registrando novas rodadas.</p>':'';
  return '<article class="csp-stage-card csp-tec"><div class="csp-stage-head"><div><b>✓ Questões TEC</b><small>'+st.tecDone+'/'+st.tecTarget+' questões · '+rows.length+' rodada'+(rows.length===1?'':'s')+' registrada'+(rows.length===1?'':'s')+'</small></div><strong>'+st.tec+'%</strong></div>'+stageBar(st.tec)+'<div class="csp-tec-target"><div class="csp-target-control"><label>Meta do módulo <input type="number" min="1" max="10000" step="1" inputmode="numeric" aria-label="Meta de questões do TEC" value="'+st.tecTarget+'"></label><button type="button" onclick="civilStudySetTecTarget(&quot;'+escAttr(m.id)+'&quot;,this.parentElement.querySelector(&quot;input&quot;).value)">Salvar meta</button></div><small>Rodadas ilimitadas. A meta mede progresso; os acertos medem desempenho.</small></div>'+summary+reached+'<button type="button" class="csp-add-round" onclick="civilStudyOpenTecModal(&quot;'+escAttr(m.id)+'&quot;)">＋ Registrar nova rodada</button>'+history+'</article>';
}
function progressPanel(m,ms,st){
  return '<section class="csp-panel"><div class="csp-panel-head"><div><span>PROGRESSO DE ESTUDO</span><b>'+st.overall+'% do módulo</b></div><div class="csp-panel-note">Média de Leitura, Decorando e TEC</div></div>'+stageBar(st.overall)+'<div class="csp-grid">'+readingCard(m,ms,st)+automaticCard(st,'decorando','Decorando','📖','questões',st.decorandoInfo)+tecCard(m,st)+'</div></section>';
}
function moduleToolsFooter(m){
 var noteKey='central-v6:civil-note:'+m.id;
 return '<section class="csp-module-footer" aria-label="Ferramentas e anotações do módulo"><div class="csp-footer-links"><button type="button" onclick="openEmbeddedTool(&quot;decorando&quot;,{},this)">📖 Decorando a Lei</button><button type="button" onclick="openEmbeddedTool(&quot;vade&quot;,{},this)">⚖ Vade Mecum</button><button type="button" onclick="centralSidebarAction(&quot;tec-cadernos&quot;,this)">▤ Cadernos do TEC</button></div><label class="csp-note-label" for="csp-note-'+escAttr(m.id)+'">Anotações do módulo<textarea id="csp-note-'+escAttr(m.id)+'" placeholder="Regra, dúvida ou observação do módulo..." oninput="localStorage.setItem(&quot;'+noteKey+'&quot;,this.value)">'+esc(localStorage.getItem(noteKey)||'')+'</textarea></label></section>';
}
function enhanceCivilHtml(html){
  try{
    var parser=new DOMParser(),doc=parser.parseFromString('<div id="csp-root">'+html+'</div>','text/html'),root=doc.getElementById('csp-root');
    if(!root)return html;
    var state=loadProgress(),regs=loadTec(),deco=loadDecorando(),sum=0,done=0,reviewed=0;
    MODULES.forEach(function(m){
      var section=root.querySelector('[data-civil-analista="'+m.id+'"]');if(!section)return;
      var ms=moduleState(state,m.id),st=moduleStats(m,state,regs,deco);sum+=st.overall;if(st.overall===100)done++;
      if(section.querySelector('.civil-a-reviewed.on'))reviewed++;
      var body=section.querySelector('.civil-module-body');if(body){body.insertAdjacentHTML('afterbegin',progressPanel(m,ms,st));}
      var textSections=section.querySelectorAll('.civil-a-section');
      READING_PARTS.forEach(function(part,index){
        var textSection=textSections[index];
        if(textSection)textSection.insertAdjacentHTML('beforeend',readingAction(m,part,!!ms.reading[part[0]]));
      });
      var status=section.querySelector('.civil-module-state');
      if(status)status.innerHTML='<span class="csp-stage-summary">L '+st.reading+' · D '+st.decorando+' · T '+st.tec+'</span><b class="civil-pct '+(st.overall===100?'csp-full':'')+'">'+st.overall+'%</b>';
    });
    var pct=Math.round(sum/MODULES.length),target=root.querySelector('.civil-target');
    if(target)target.innerHTML='<span>Progresso de estudo</span><b>'+done+'/15 concluídos · '+pct+'%</b>';
    var introMeta=root.querySelector('.civil-a-meta');
    if(introMeta){
      introMeta.insertAdjacentHTML('beforeend','<span class="civil-a-chip csp-revision-chip">Revisões: '+reviewed+'/15</span><span class="civil-a-chip csp-active-chip">Progresso por etapa ativo</span>');
    }
    var overall=root.querySelector('.civil-master > .civil-overall');if(overall)overall.innerHTML='<span style="width:'+pct+'%"></span>';
    return root.innerHTML;
  }catch(e){console.error('Progresso de Direito Civil',e);return html}
}

if(typeof originalRenderCivil==='function'){
  window.renderCivilMaster=function(){return enhanceCivilHtml(originalRenderCivil.apply(this,arguments))};
}
if(typeof originalSubjStats==='function'){
  window.subjStats=function(s){if(s&&s.id==='civil'){var x=courseStats();return {total:x.total,done:x.done,pct:x.pct,unit:'módulos'}}return originalSubjStats.apply(this,arguments)};
}

window.civilStudyToggleReading=function(id,part,value){
  if(!MODULE_BY_ID.has(id)||!READING_PARTS.some(function(x){return x[0]===part}))return false;
  var s=loadProgress(),m=moduleState(s,id);m.reading[part]=!!value;saveProgress(s);rerender();return false;
};
window.civilStudySetTecTarget=function(id,value){
  if(!MODULE_BY_ID.has(id))return false;
  var target=Math.max(1,Math.min(10000,Math.round(Number(value)||DEFAULT_TEC_TARGET)));
  var s=loadProgress(),m=moduleState(s,id);m.tecTarget=target;saveProgress(s);rerender();toast('Meta do TEC atualizada para '+target+' questões.');return false;
};

function localToday(){var d=new Date(),y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');return y+'-'+m+'-'+day}
function ensureModal(){
  var modal=document.getElementById('csp-tec-modal');if(modal)return modal;
  modal=document.createElement('div');modal.id='csp-tec-modal';modal.className='csp-modal-backdrop';modal.setAttribute('aria-hidden','true');
  modal.innerHTML='<section class="csp-modal" role="dialog" aria-modal="true" aria-labelledby="csp-modal-title"><div class="csp-modal-head"><div><span>DIREITO CIVIL</span><h3 id="csp-modal-title">Registrar rodada do TEC</h3><p id="csp-modal-module"></p></div><button type="button" onclick="civilStudyCloseTecModal()" aria-label="Fechar">×</button></div><form onsubmit="return civilStudySaveTec(event)"><input type="hidden" id="csp-modal-module-id"><label>Caderno TEC<select id="csp-modal-caderno" required></select></label><div class="csp-form-row"><label>Data<input id="csp-modal-date" type="date" required></label><label>Questões feitas<input id="csp-modal-feitas" type="number" min="1" step="1" inputmode="numeric" placeholder="20" required></label><label>Acertos<input id="csp-modal-acertos" type="number" min="0" step="1" inputmode="numeric" placeholder="0" required></label></div><label>Observação <small>(opcional)</small><input id="csp-modal-note" type="text" maxlength="100" placeholder="Ex.: segunda passada no caderno"></label><div class="csp-live-result">Percentual desta rodada: <b id="csp-modal-pct">—</b></div><div class="csp-modal-actions"><button type="button" onclick="civilStudyCloseTecModal()">Cancelar</button><button type="submit" class="primary">Salvar rodada</button></div></form></section>';
  modal.addEventListener('click',function(e){if(e.target===modal)window.civilStudyCloseTecModal()});
  document.body.appendChild(modal);
  ['csp-modal-feitas','csp-modal-acertos'].forEach(function(id){modal.querySelector('#'+id).addEventListener('input',updateModalPct)});
  return modal;
}
function updateModalPct(){
  var f=Math.max(0,parseInt(document.getElementById('csp-modal-feitas')&&document.getElementById('csp-modal-feitas').value,10)||0),a=Math.max(0,parseInt(document.getElementById('csp-modal-acertos')&&document.getElementById('csp-modal-acertos').value,10)||0),out=document.getElementById('csp-modal-pct');
  if(out)out.textContent=f&&a<=f?Math.round(a/f*100)+'%':'—';
}
window.civilStudyOpenTecModal=function(id){
  var m=MODULE_BY_ID.get(id);if(!m)return false;
  var modal=ensureModal(),sel=modal.querySelector('#csp-modal-caderno');
  sel.innerHTML=m.tec.map(function(cid){return '<option value="'+escAttr(cid)+'">'+esc(shortCaderno(cid))+'</option>'}).join('');
  modal.querySelector('#csp-modal-module-id').value=id;modal.querySelector('#csp-modal-module').textContent=m.title;modal.querySelector('#csp-modal-date').value=localToday();modal.querySelector('#csp-modal-feitas').value='';modal.querySelector('#csp-modal-acertos').value='';modal.querySelector('#csp-modal-note').value='';modal.querySelector('#csp-modal-pct').textContent='—';
  modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.documentElement.classList.add('csp-modal-open');setTimeout(function(){modal.querySelector('#csp-modal-feitas').focus()},40);return false;
};
window.civilStudyCloseTecModal=function(){var modal=document.getElementById('csp-tec-modal');if(modal){modal.classList.remove('open');modal.setAttribute('aria-hidden','true')}document.documentElement.classList.remove('csp-modal-open');return false};
window.civilStudyFooterRows=function(id){
  var m=MODULE_BY_ID.get(id);if(!m)return [];
  return tecRows(m,loadTec()).map(function(x){return {index:x.index,done:Number(x.r.f)||0,correct:Number(x.r.a)||0,date:x.r.dt}});
};
window.civilStudyRegisterRound=function(id,done,correct){
  var m=MODULE_BY_ID.get(id);
  if(!m||!Number.isInteger(done)||!Number.isInteger(correct)||done<1||correct<0||correct>done)return false;
  var regs=loadTec();
  regs.push({rid:'civil-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7),cid:'',dt:localToday(),f:done,a:correct,moduleId:id,note:'',source:'module-footer'});
  localStorage.setItem(TEC_KEY,JSON.stringify(regs));rerender();return true;
};
window.civilStudySaveTec=function(e){
  if(e)e.preventDefault();
  var id=document.getElementById('csp-modal-module-id').value,m=MODULE_BY_ID.get(id),cid=document.getElementById('csp-modal-caderno').value,dt=document.getElementById('csp-modal-date').value,f=Math.max(0,parseInt(document.getElementById('csp-modal-feitas').value,10)||0),a=Math.max(0,parseInt(document.getElementById('csp-modal-acertos').value,10)||0),note=String(document.getElementById('csp-modal-note').value||'').trim();
  if(!m||m.tec.indexOf(cid)<0){alert('Escolha um caderno válido.');return false}if(f<1){alert('Informe a quantidade de questões feitas.');return false}if(a>f){alert('Acertos não pode ser maior que as questões feitas.');return false}
  var regs=loadTec();regs.push({rid:'civil-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7),cid:cid,dt:dt||localToday(),f:f,a:a,moduleId:id,note:note,source:'civil-progress-v2'});localStorage.setItem(TEC_KEY,JSON.stringify(regs));window.civilStudyCloseTecModal();rerender();toast('Rodada salva · '+Math.round(a/f*100)+'% de acerto');return false;
};
window.civilStudyDeleteTec=function(index){
  var regs=loadTec(),r=regs[index];if(!r)return false;
  if(!confirm('Apagar a rodada de '+fmtDate(r.dt)+' ('+(Number(r.a)||0)+'/'+(Number(r.f)||0)+' acertos)?'))return false;
  regs.splice(index,1);localStorage.setItem(TEC_KEY,JSON.stringify(regs));rerender();toast('Rodada apagada.');return false;
};
function toast(message){var el=document.getElementById('csp-toast');if(!el){el=document.createElement('div');el.id='csp-toast';document.body.appendChild(el)}el.textContent=message;el.classList.add('show');clearTimeout(el._timer);el._timer=setTimeout(function(){el.classList.remove('show')},2600)}
function rerender(){try{if(typeof window.renderAll==='function')window.renderAll();else if(typeof window.renderSubjects==='function')window.renderSubjects()}catch(e){console.error('Atualização do progresso civil',e)}}

function computeAnki(cards){
  var result={};MODULES.forEach(function(m){result[m.id]={ready:true,done:0,total:0,pct:0}});
  (cards||[]).forEach(function(c){if(!c||c.suspended)return;var m=MODULES.find(function(x){return c.deck===x.deck||String(c.deck||'').startsWith(x.deck+'::')});if(!m)return;var x=result[m.id],stats=c.stats||{};x.total++;if((Number(stats.correct)||0)+(Number(stats.wrong)||0)>0||(Array.isArray(stats.history)&&stats.history.length))x.done++});
  MODULES.forEach(function(m){var x=result[m.id];if(!x.total)x.total=m.anki;x.pct=x.total?Math.round(x.done/x.total*100):0});return result;
}
function refreshAnkiStats(force){
  if(!window.indexedDB)return Promise.resolve(false);
  return new Promise(function(resolve){
    var req;try{req=indexedDB.open('anki-offline-tauanne-v1',1)}catch(e){resolve(false);return}
    req.onupgradeneeded=function(){try{req.transaction.abort()}catch(e){}};
    req.onerror=function(){resolve(false)};
    req.onsuccess=function(){
      var db=req.result;if(!db.objectStoreNames.contains('cards')){db.close();resolve(false);return}
      var tx=db.transaction('cards','readonly'),get=tx.objectStore('cards').getAll();
      get.onerror=function(){db.close();resolve(false)};
      get.onsuccess=function(){var next=computeAnki(get.result),signature=MODULES.map(function(m){var x=next[m.id];return x.done+'/'+x.total}).join('|'),changed=signature!==ankiRuntime.signature;ankiRuntime={ready:true,modules:next,signature:signature};db.close();if(changed||force)rerender();resolve(true)};
    };
  });
}
window.civilStudyRefreshData=function(){refreshAnkiStats(true);return false};
window.__civilStudySelfTest=function(){
  var index=window.CIVIL_DECORANDO_IDS_V1||{},decorandoIndexed=MODULES.reduce(function(n,m){return n+(Array.isArray(index[m.id])?index[m.id].length:0)},0),x=courseStats();
  return {version:VERSION,storageKey:STORAGE_KEY,schemaVersion:2,modules:MODULES.length,ankiCards:MODULES.reduce(function(n,m){return n+m.anki},0),decorandoQuestions:MODULES.reduce(function(n,m){return n+m.decorando},0),decorandoIndexed:decorandoIndexed,tecCadernos:new Set(MODULES.flatMap(function(m){return m.tec})).size,defaultTecTarget:DEFAULT_TEC_TARGET,course:x};
};

var style=document.createElement('style');style.id='central-civil-progress-style-v1';style.textContent='\
.csp-panel{margin:0 0 13px;border:1px solid rgba(36,199,122,.34);border-radius:12px;background:linear-gradient(180deg,rgba(36,199,122,.07),transparent 90%);padding:12px}.csp-panel-head{display:flex;align-items:end;justify-content:space-between;gap:12px;margin-bottom:9px}.csp-panel-head span{display:block;color:#45d58e;font-size:8px;font-weight:900;letter-spacing:.08em}.csp-panel-head b{display:block;margin-top:3px;font-size:14px}.csp-panel-note{color:var(--muted);font-size:9px;text-align:right}.csp-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:10px}.csp-stage-card{min-width:0;border:1px solid var(--line);border-radius:10px;background:var(--panel);padding:10px}.csp-stage-head{display:flex;align-items:flex-start;justify-content:space-between;gap:8px}.csp-stage-head b{display:block;font-size:10px}.csp-stage-head small{display:block;color:var(--muted);font-size:8px;line-height:1.4;margin-top:3px}.csp-stage-head strong{color:#8b7cff;font-size:13px;white-space:nowrap}.csp-meter{height:6px;background:var(--panel2);border-radius:999px;overflow:hidden;margin-top:8px}.csp-meter span{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#24c77a,#8b7cff);transition:width .2s}.csp-reading{display:flex;flex-wrap:wrap;gap:5px;margin-top:9px}.csp-read-check{display:flex;align-items:center;gap:5px;border:1px solid var(--line2);border-radius:999px;background:var(--panel2);color:var(--muted);padding:5px 7px;font-size:8px;cursor:pointer}.csp-read-check input{position:absolute;opacity:0;pointer-events:none}.csp-read-check span{width:13px;height:13px;display:grid;place-items:center;border:1px solid var(--line2);border-radius:4px;background:var(--input);font-size:8px}.csp-read-check.on{border-color:rgba(36,199,122,.55);color:#75e5ad;background:rgba(36,199,122,.1)}.csp-read-check.on span{border-color:#24c77a;background:#137448;color:#fff}.csp-manual{display:grid;grid-template-columns:minmax(80px,1fr) 38px auto;align-items:center;gap:8px;margin-top:10px}.csp-manual input[type=range]{width:100%;accent-color:#24c77a}.csp-manual output{font-size:9px;color:var(--muted)}.csp-manual label{font-size:8px;color:var(--muted);white-space:nowrap}.csp-manual label input{accent-color:#24c77a;vertical-align:-2px}.csp-tec{grid-column:1/-1}.csp-tec-summary{display:flex;gap:7px;flex-wrap:wrap;margin-top:9px}.csp-tec-summary span{border:1px solid var(--line);border-radius:999px;background:var(--panel2);color:var(--muted);padding:5px 8px;font-size:8px}.csp-tec-summary b{color:var(--text)}.csp-add-round{margin-top:9px;border:1px solid rgba(56,189,248,.45);border-radius:8px;background:rgba(56,189,248,.09);color:#9bdcff;padding:7px 10px;font-size:9px;font-weight:800;cursor:pointer}.csp-tec-history{display:grid;gap:5px;margin-top:9px;max-height:235px;overflow:auto}.csp-tec-row{display:grid;grid-template-columns:minmax(0,1fr) auto 46px 24px;align-items:center;gap:8px;border-top:1px solid var(--line);padding-top:6px;font-size:8px;color:var(--muted)}.csp-tec-row span:first-child{min-width:0}.csp-tec-row span:first-child b,.csp-tec-row span:first-child small{display:block}.csp-tec-row span:first-child small{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-top:2px}.csp-tec-row strong{font-size:10px;text-align:right}.csp-tec-row strong.good{color:#45d58e}.csp-tec-row strong.warn{color:#e0b64f}.csp-tec-row strong.low{color:#e08a7a}.csp-tec-row button{border:0;background:transparent;color:#e08a7a;font-size:16px;cursor:pointer}.csp-empty{font-size:8px;color:var(--muted);margin:8px 0 0}.civil-pct.csp-full{color:#45d58e}.csp-revision-chip{border-color:rgba(139,124,255,.35)!important}.csp-active-chip{border-color:rgba(36,199,122,.45)!important;color:#65dfa3!important}.csp-stage-summary{white-space:nowrap}.csp-modal-backdrop{position:fixed;inset:0;z-index:2147483646;display:none;place-items:center;padding:16px;background:rgba(3,8,18,.76);backdrop-filter:blur(4px)}.csp-modal-backdrop.open{display:grid}.csp-modal{width:min(530px,100%);max-height:calc(100dvh - 32px);overflow:auto;border:1px solid var(--line2);border-radius:15px;background:var(--panel);color:var(--text);box-shadow:0 24px 80px rgba(0,0,0,.45)}.csp-modal-head{display:flex;justify-content:space-between;gap:12px;padding:16px;border-bottom:1px solid var(--line)}.csp-modal-head span{font-size:8px;font-weight:900;letter-spacing:.09em;color:#45d58e}.csp-modal-head h3{font-size:16px;margin:3px 0}.csp-modal-head p{font-size:9px;color:var(--muted);margin:0}.csp-modal-head>button{align-self:flex-start;border:0;background:transparent;color:var(--muted);font-size:24px}.csp-modal form{display:grid;gap:11px;padding:16px}.csp-modal label{display:grid;gap:5px;color:var(--muted);font-size:9px;font-weight:750}.csp-modal input,.csp-modal select{width:100%;box-sizing:border-box;border:1px solid var(--line2);border-radius:8px;background:var(--input);color:var(--text);padding:10px;font:inherit}.csp-form-row{display:grid;grid-template-columns:1.2fr 1fr 1fr;gap:8px}.csp-live-result{border:1px solid rgba(36,199,122,.35);border-radius:9px;background:rgba(36,199,122,.07);padding:10px;color:var(--muted);font-size:10px}.csp-live-result b{color:#55dfa0}.csp-modal-actions{display:flex;justify-content:flex-end;gap:7px;padding-top:3px}.csp-modal-actions button{border:1px solid var(--line2);border-radius:8px;background:var(--panel2);color:var(--text);padding:9px 12px;font-size:10px;font-weight:800}.csp-modal-actions button.primary{border-color:#24c77a;background:#137448;color:#fff}.csp-modal-open{overflow:hidden}#csp-toast{position:fixed;left:50%;bottom:78px;z-index:2147483647;transform:translate(-50%,18px);opacity:0;pointer-events:none;border:1px solid rgba(36,199,122,.5);border-radius:999px;background:#10261e;color:#aaf2cb;padding:9px 13px;font:800 11px system-ui,sans-serif;box-shadow:0 8px 26px rgba(0,0,0,.3);transition:.2s}#csp-toast.show{opacity:1;transform:translate(-50%,0)}\
@media(max-width:760px){.csp-grid{grid-template-columns:1fr}.csp-tec{grid-column:auto}.csp-panel-head{align-items:flex-start}.csp-panel-note{text-align:left}.subject[data-id="civil"] .civil-module-head{grid-template-columns:45px minmax(0,1fr) auto 20px}.subject[data-id="civil"] .civil-module-state{display:flex;flex-direction:column;align-items:flex-end}.csp-stage-summary{display:none}}\
@media(max-width:520px){.csp-panel{padding:10px}.csp-manual{grid-template-columns:minmax(70px,1fr) 34px}.csp-manual label{grid-column:1/-1}.csp-form-row{grid-template-columns:1fr 1fr}.csp-form-row label:first-child{grid-column:1/-1}.csp-tec-row{grid-template-columns:minmax(0,1fr) auto 42px 22px}.csp-tec-row>span:nth-child(2){display:none}}';
document.head.appendChild(style);
var styleV2=document.createElement('style');styleV2.id='central-civil-progress-style-v2';styleV2.textContent='\
.csp-auto-status{margin:8px 0 0;color:var(--muted);font-size:8px;line-height:1.45}.csp-topic-read{display:flex;justify-content:flex-end;margin-top:10px;padding-top:9px;border-top:1px dashed var(--line)}.csp-topic-read button{min-height:34px;border:1px solid rgba(139,124,255,.42);border-radius:8px;background:rgba(139,124,255,.08);color:#b8afff;padding:7px 11px;font-size:9px;font-weight:800;cursor:pointer}.csp-topic-read button.done{border-color:rgba(36,199,122,.52);background:rgba(36,199,122,.1);color:#75e5ad}.csp-tec-target{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:10px;padding:9px;border:1px solid var(--line);border-radius:9px;background:var(--panel2)}.csp-target-control{display:flex;align-items:center;gap:6px}.csp-tec-target label{display:flex;align-items:center;gap:6px;color:var(--text);font-size:9px;font-weight:800;white-space:nowrap}.csp-tec-target input{width:68px;border:1px solid var(--line2);border-radius:7px;background:var(--input);color:var(--text);padding:6px 7px;font:inherit;text-align:center}.csp-target-control button{min-height:30px;border:1px solid rgba(56,189,248,.4);border-radius:7px;background:rgba(56,189,248,.08);color:#9bdcff;padding:6px 8px;font-size:8px;font-weight:800;cursor:pointer}.csp-tec-target small{color:var(--muted);font-size:8px;line-height:1.4;text-align:right}.csp-tec-reached{margin:9px 0 0;color:#65dfa3;font-size:8px;font-weight:800}\
@media(max-width:760px){.csp-topic-read button{min-height:40px;font-size:10px}.csp-tec-target{align-items:flex-start;flex-direction:column}.csp-tec-target small{text-align:left}.csp-tec-target input{min-height:34px;font-size:12px}}';
styleV2.textContent += '.csp-module-footer{margin-top:13px;padding:12px;border:1px solid var(--line);border-radius:11px;background:var(--panel)}.csp-footer-links{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:12px}.csp-footer-links button{min-height:36px;border:1px solid var(--line2);border-radius:8px;background:var(--panel2);color:var(--text);padding:7px 10px;font-size:10px;font-weight:800;cursor:pointer}.csp-note-label{display:grid;gap:6px;color:var(--muted);font-size:10px;font-weight:800}.csp-note-label textarea{width:100%;min-height:92px;resize:vertical;border:1px solid var(--line2);border-radius:8px;background:var(--input);color:var(--text);padding:10px;font:inherit;line-height:1.5}@media(max-width:520px){.csp-footer-links{display:grid;grid-template-columns:1fr}.csp-footer-links button{min-height:42px;text-align:left}.csp-note-label textarea{min-height:110px}}';
document.head.appendChild(styleV2);

document.addEventListener('keydown',function(e){if(e.key==='Escape'&&document.getElementById('csp-tec-modal')&&document.getElementById('csp-tec-modal').classList.contains('open'))window.civilStudyCloseTecModal()});
document.addEventListener('click',function(e){var head=e.target&&e.target.closest&&e.target.closest('.subject[data-id="civil"] > .subject-head');if(head)setTimeout(function(){refreshAnkiStats(false)},80)},true);
window.addEventListener('storage',function(e){if([STORAGE_KEY,TEC_KEY,'lei-seca-enxuta-state'].includes(e.key))rerender()});
document.addEventListener('visibilitychange',function(){if(!document.hidden)refreshAnkiStats(false)});
refreshAnkiStats(false).finally(function(){rerender()});
})();
