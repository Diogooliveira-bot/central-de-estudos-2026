/* RLM TJCE 2026 — leitor integrado da Base Completa. Nenhum iframe de aula nem navegação externa. */
(function(g){
'use strict';
if(g.RlmNative)return;
const PREFIX='central-v6:rlm-tjce2026:',OVER='bcRlmReaderOverlay',LETTERS=['A','B','C','D','E'];
const TOPIC_PREFIX='rlm-tjce2026-';
let active=null, lastFocus=null, pageByModule={};
const el=id=>document.getElementById(id);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function manifest(){return g.RLM_TJCE_STRUCTURE?.modulos||[];}
function mod(id){return manifest().find(m=>m.id===id)||null;}
function lesson(id){return g.RLM_CURSO_AULAS?.[id]||null;}
function uid(id){return id==='M01'?'rlm-calculo-rapido-v6638':TOPIC_PREFIX+id.toLowerCase();}
function markKey(id){return 'central-v6:done:'+uid(id);}
function readJSON(key){try{return JSON.parse(localStorage.getItem(key)||'{}')||{}}catch(_){return {}}}
function answers(id){return readJSON(PREFIX+'answers:'+id);}
function saveAnswers(id,x){try{localStorage.setItem(PREFIX+'answers:'+id,JSON.stringify(x))}catch(e){console.warn('[RLM] Sem armazenamento local',e)}}
function answered(id){return Object.keys(answers(id)).length;}
function isDone(id){return localStorage.getItem(markKey(id))==='1';}
function result(id){
 const arr=lesson(id)?.questions||[],record=answers(id);
 let count=0,correct=0;for(let i=0;i<arr.length;i++){if(record[i]!==undefined){count++;if(record[i]===arr[i].answer)correct++}}
 return {count,correct,total:arr.length,pct:count?Math.round(100*correct/count):0};
}
function stats(){
 const modules=manifest();
 const done=modules.filter(m=>isDone(m.id)).length;
 return {total:modules.length+1,done,pct:Math.round(done/(modules.length+1)*100)||0,unit:'módulos'};
}
function syncCentral(){try{if(typeof g.renderSubjects==='function')g.renderSubjects()}catch(e){console.warn('[RLM] Falha ao atualizar card',e)};try{if(typeof g.renderDisciplineGrid==='function')g.renderDisciplineGrid()}catch(_){}}
function mark(id,checked){
 if(!mod(id)&&id!=='RF')return;
 try{localStorage.setItem(markKey(id),checked?'1':'0')}catch(_){}
 syncCentral();
 if(active&&active.id===id)renderOverlay();
}
/* Mesmo padrão de módulos expansíveis do Direito Penal: sem modificar o acervo. */
function moduleOpenKey(id){return PREFIX+'module-open:'+id;}
function isModuleOpen(id){return localStorage.getItem(moduleOpenKey(id))==='1';}
function toggleModule(id){
 if(!mod(id)&&id!=='RF')return false;
 const opening=!isModuleOpen(id);
 try{localStorage.setItem(moduleOpenKey(id),opening?'1':'0')}catch(_){}
 const node=document.querySelector('#subjects .bc-rlm-course [data-rlm-module="'+id+'"]')||
 document.querySelector('.bc-rlm-course [data-rlm-module="'+id+'"]');
 if(node){
  node.classList.toggle('open',opening);
  node.querySelector('.cf-module-head')?.setAttribute('aria-expanded',String(opening));
 }
 return false;
}
function materialCard(id,stage,label,description,icon){
 return '<button type="button" class="bc-native-material-card" data-rlm-kind="'+stage+'" onclick="RlmNative.open(\''+id+'\',\''+stage+'\')">'+
 '<span class="bc-native-material-icon" aria-hidden="true">'+icon+'</span>'+
 '<span><strong>'+esc(label)+'</strong><small>'+esc(description)+'</small></span>'+
 '<span class="bc-native-material-action">Abrir →</span></button>';
}
function card(m){
 const done=isDone(m.id),p=m.id==='M01'?0:Math.round(result(m.id).count/10*100);
 const openState=isModuleOpen(m.id);
 const percent=done?100:p;
 const cards=m.id==='M01'?
  materialCard(m.id,'speed','Treino de velocidade','Os seis treinos e o cronômetro original, sem sair da Central.','⏱'):
  materialCard(m.id,'theory','Aula','Teoria, exemplos resolvidos e revisão rápida com bizus.','📚')+
  materialCard(m.id,'quiz','Questões','10 questões: clique na alternativa e veja a correção na hora.','✓')+
  materialCard(m.id,'map','Mapa mental','Síntese visual com os ramos e conceitos do módulo.','🧠');
 const sub=m.id==='M01'?'Treino original preservado · cálculo rápido':m.eixo;
 return '<section class="cf-module ds-module bc-rlm-module'+(openState?' open':'')+'" data-rlm-module="'+m.id+'">'+
 '<button class="cf-module-head ds-module-head" type="button" aria-expanded="'+openState+'" onclick="return RlmNative.toggleModule(\''+m.id+'\')">'+
 '<span class="cf-module-no">'+(m.id==='M01'?'MÓDULO 01':'MÓDULO '+Number(m.id.slice(1)))+'</span>'+
 '<span class="cf-module-title">'+esc(m.titulo)+'</span>'+
 '<span class="cf-module-stat">'+(done?'100%':p?p+'% prática':'0%')+'</span><span class="chev" aria-hidden="true">⌄</span></button>'+
 '<div class="cf-module-body ds-module-body"><div class="cf-subtitle">'+esc(sub)+'</div>'+
 '<section class="bc-native-materials bc-native-materials-static"><div class="bc-native-metrics">'+
 '<article class="bc-native-metric-card"><div class="bc-native-ring" style="--pct:'+percent+'"><div class="bc-native-ring-inner"><b>'+percent+'%</b><span>'+ (m.id==='M01'?'módulo':'atividade')+'</span></div></div>'+
 '<div class="bc-native-metric-copy"><small>'+ (m.id==='M01'?'CONCLUSÃO DO TREINO':'ACOMPANHAMENTO DO MÓDULO')+'</small>'+
 '<strong>'+ (done?'Módulo concluído':m.id==='M01'?'Treino disponível':result(m.id).count+' de 10 questões respondidas')+'</strong>'+
 '<span>'+ (m.id==='M01'?'Histórico e cronômetro originais preservados.':'O percentual da prática não substitui a conclusão manual do módulo.')+'</span></div></article></div>'+
 '<div class="bc-native-materials-head"><div><b>Materiais do módulo</b><small>Escolha como estudar</small></div><small>'+esc(m.id)+' · conteúdo nativo</small></div>'+
 '<div class="bc-native-material-grid">'+cards+'</div></section>'+
 '<label class="bc-rlm-complete bc-rlm-complete-inline"><input type="checkbox" '+(done?'checked ':'')+
 'onchange="RlmNative.mark(\''+m.id+'\',this.checked)">Marcar módulo como concluído</label></div></section>';
}
function reviewCard(){
 const opened=isModuleOpen('RF'),done=isDone('RF');
 return '<section class="cf-module ds-module bc-rlm-module'+(opened?' open':'')+'" data-rlm-module="RF">'+
 '<button class="cf-module-head ds-module-head" aria-expanded="'+opened+'" onclick="return RlmNative.toggleModule(\'RF\')">'+
 '<span class="cf-module-no">REVISÃO FINAL</span><span class="cf-module-title">Revisão cumulativa e simulado FCC</span>'+
 '<span class="cf-module-stat">'+(done?'100%':'0%')+'</span><span class="chev" aria-hidden="true">⌄</span></button>'+
 '<div class="cf-module-body ds-module-body"><div class="cf-subtitle">20 questões autorais, reunindo os 14 módulos teóricos.</div>'+
 '<section class="bc-native-materials bc-native-materials-static"><div class="bc-native-materials-head"><div><b>Material de revisão</b><small>Questões comentadas com correção imediata.</small></div><small>RF · conteúdo nativo</small></div>'+
 '<div class="bc-native-material-grid">'+materialCard('RF','review','Simulado cumulativo','20 questões autorais e comentários imediatos.','✓')+'</div></section>'+
 '<label class="bc-rlm-complete bc-rlm-complete-inline"><input type="checkbox" '+(done?'checked ':'')+'onchange="RlmNative.mark(\'RF\',this.checked)">Revisão concluída</label></div></section>';
}
function renderMaster(){
 if(!manifest().length)return '<div class="bc-rlm-warn">A matriz do curso RLM não está carregada.</div>';
 const list=manifest(),groups=[
 ['Treino de velocidade',list.slice(0,1)],
 ['Bloco I · Lógica e raciocínio',list.slice(1,9)],
 ['Bloco II · Matemática',list.slice(9,12)],
 ['Bloco III · Estatística',list.slice(12,15)]
 ];
 const done=list.filter(m=>isDone(m.id)).length;
 return '<div class="bc-rlm-course" data-central-native-rlm="1"><section class="bc-rlm-intro ds-course-intro">'+
 '<span class="bc-rlm-kicker">Analista Judiciário · TJCE 2026 · FCC</span>'+
 '<h3>Raciocínio Lógico-Matemático</h3><p>Aula, questões comentadas e mapa mental em cada módulo, com os filtros de questões do TEC e do QC.</p>'+
 '<div class="bc-rlm-stats"><span class="bc-rlm-stat"><strong>15</strong> módulos</span>'+
 '<span class="bc-rlm-stat"><strong>14</strong> apostilas</span><span class="bc-rlm-stat"><strong>140</strong> questões autorais</span>'+
 '<span class="bc-rlm-stat"><strong>'+done+'/15</strong> módulos concluídos</span></div>'+
 '</section>'+
 groups.map(([name,arr])=>'<section class="bc-rlm-group"><h4>'+esc(name)+'</h4><div class="cf-modules bc-rlm-modules">'+arr.map(card).join('')+'</div></section>').join('')+
 '<section class="bc-rlm-group"><h4>Revisão geral</h4><div class="cf-modules bc-rlm-modules">'+reviewCard()+'</div></section></div>';
}
function oldTarget(value){
 let t=String(value||'').replace(/^#/,'').toLowerCase();
 const map={calculo:'M01',rlm1:'M10',rlm2:'M10',rlm3:'M10',rlm4:'M11',rlm5:'M12',rlm6:'M05',rlm7:'M08',rlm8:'M03',rlm9:'M04'};
 if(/^m(0[1-9]|1[0-5])$/.test(t))return t.toUpperCase();
 if(t==='rf')return 'RF';
 return map[t]||'M01';
}
function open(id='M02',stage='theory'){
 const m=id==='RF'?{id:'RF',titulo:'Revisão cumulativa FCC'}:mod(id);
 if(!m)return false;
 close(false);
 lastFocus=document.activeElement;
 active={id,stage:id==='M01'?'speed':id==='RF'?'review':normStage(stage)};
 if(g.CentralStudyNavigation?.rememberReturn)try{g.CentralStudyNavigation.rememberReturn()}catch(_){}
 const wrapper=document.createElement('div');wrapper.id=OVER;wrapper.className='bc-rlm-overlay bc-native-reader-overlay';
 wrapper.setAttribute('role','presentation');
 wrapper.addEventListener('mousedown',ev=>{if(ev.target===wrapper)close()});
 document.body.appendChild(wrapper);document.body.classList.add('bc-rlm-open');
 try{if(typeof saveLast==='function')saveLast({rlmModule:id,rlmStage:active.stage,title:'RLM • '+m.titulo,at:Date.now()})}catch(_){}
 renderOverlay();
 requestAnimationFrame(()=>wrapper.querySelector('.bc-rlm-close')?.focus());
 return false;
}
function close(restoreFocus=true){
 const item=el(OVER);
 if(item){item.querySelector('iframe')?.remove();item.remove();}
 document.body.classList.remove('bc-rlm-open');
 active=null;
 if(restoreFocus&&lastFocus&&lastFocus.isConnected)lastFocus.focus();
}
function normStage(stage){return stage==='summary'||stage==='sources'?'quiz':stage;}
function move(id){return open(id,id==='RF'?'review':id==='M01'?'speed':'theory');}
/* Leitor RLM com o mesmo shell, índice lateral e ferramentas do leitor nativo de Penal. */
function stageLabel(stage){
 return ({speed:'Treino de velocidade',theory:'Aula',quiz:'Questões',map:'Mapa mental',review:'Revisão final'})[stage]||'Material';
}
function stageSections(stage){
 return stage==='theory'?'.bc-rlm-lesson,.bc-rlm-tips-block':
 stage==='quiz'?'.bc-rlm-quiz':
 stage==='map'?'.bc-rlm-map-node':
 stage==='review'?'.bc-rlm-quiz':'';
}
function setupToc(stage){
 const root=el('bcRlmScroll'),toc=el('bcRlmToc');
 if(!root||!toc)return;
 const selector=stageSections(stage),nodes=selector?Array.from(root.querySelectorAll(selector)):[];
 toc.innerHTML='<div class="bc-native-toc-label">Índice do material</div>'+
 (nodes.length?nodes.map((node,i)=>{
  node.dataset.rlmJump=String(i);
  const heading=node.querySelector('h3,b,.bc-rlm-quiz-meta')?.textContent?.trim()||
   ((stage==='quiz'?'Questão ': 'Parte ')+(i+1));
  return '<button type="button" data-rlm-jump="'+i+'" onclick="RlmNative.jump('+i+')">'+esc(heading.slice(0,105))+'</button>';
 }).join(''):'<div class="bc-rlm-index-hint">Abra o material e utilize as ferramentas de leitura.</div>');
}
function jump(i){
 const root=el('bcRlmScroll'),target=root?.querySelector('[data-rlm-jump="'+i+'"]');
 if(!target)return;
 target.scrollIntoView({behavior:'smooth',block:'start'});
 const buttons=el('bcRlmToc')?.querySelectorAll('button')||[];
 buttons.forEach(b=>b.classList.toggle('active',b.dataset.rlmJump===String(i)));
}
function removeSearchMarks(){
 const root=el('bcRlmScroll');if(!root)return;
 root.querySelectorAll('mark[data-rlm-search]').forEach(mark=>mark.replaceWith(document.createTextNode(mark.textContent)));
 root.normalize();
}
function search(term){
 removeSearchMarks();
 const box=el('bcRlmSearchMeta');if(!box)return;
 const query=String(term||'').trim();
 if(query.length<2){box.textContent='';return;}
 const root=el('bcRlmScroll');
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{
  acceptNode(node){
   if(!node.nodeValue?.trim()||node.parentElement?.closest('mark,script,style,button'))return NodeFilter.FILTER_REJECT;
   return node.nodeValue.toLocaleLowerCase('pt-BR').includes(query.toLocaleLowerCase('pt-BR'))?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;
  }
 });
 const matches=[];while(walker.nextNode())matches.push(walker.currentNode);
 let n=0;for(const node of matches){
  const raw=node.nodeValue,haystack=raw.toLocaleLowerCase('pt-BR'),needle=query.toLocaleLowerCase('pt-BR'),fragment=document.createDocumentFragment();
  let p=0,k;while((k=haystack.indexOf(needle,p))>=0){
   fragment.appendChild(document.createTextNode(raw.slice(p,k)));
   const mark=document.createElement('mark');mark.dataset.rlmSearch='1';mark.textContent=raw.slice(k,k+query.length);fragment.appendChild(mark);
   n++;p=k+query.length;
  }
  fragment.appendChild(document.createTextNode(raw.slice(p)));node.replaceWith(fragment);
 }
 box.textContent=n+' ocorrência(s)';
 root.querySelector('mark[data-rlm-search]')?.scrollIntoView({block:'center'});
}
function setFont(delta){
 const article=el('bcRlmArticle');
 if(!article)return;
 const key=PREFIX+'reader-font';
 let font=Math.max(14,Math.min(21,(Number(localStorage.getItem(key))||16)+delta));
 article.style.fontSize=font+'px';
 try{localStorage.setItem(key,String(font))}catch(_){}
}
function renderOverlay(){
 if(!active)return;
 const host=el(OVER);if(!host)return;
 const m=active.id==='RF'?{id:'RF',titulo:'Revisão cumulativa FCC'}:mod(active.id);
 if(!m)return;
 const stage=active.stage;
 const previous=el('bcRlmScroll'),oldY=previous?.scrollTop||0;
 const links=active.id==='M01'?[]:active.id==='RF'?[]:[
 ['theory','Aula'],['quiz','Questões'],['map','Mapa mental']
 ];
 const actions=links.map(([kind,label])=>'<button type="button" class="bc-rlm-tool-tab'+(kind===stage?' active':'')+
 '" aria-pressed="'+(kind===stage)+'" onclick="RlmNative.tab(\''+kind+'\')">'+label+'</button>').join('');
 host.innerHTML='<section class="bc-native-reader bc-rlm-reader" role="dialog" aria-modal="true" aria-label="Leitor nativo de RLM">'+
 '<header class="bc-native-reader-head bc-rlm-reader-header"><div class="bc-native-reader-title bc-rlm-header-left">'+
 '<b>RLM '+esc(m.id)+' — '+esc(m.titulo)+'</b><small>'+esc(stageLabel(stage))+' · experiência nativa da Base Completa</small></div>'+
 '<label class="bc-rlm-complete bc-rlm-reader-check"><input type="checkbox" '+(isDone(m.id)?'checked':'')+
 ' onchange="RlmNative.mark(\''+m.id+'\',this.checked)"> Concluído</label>'+
 '<button class="bc-native-reader-close bc-rlm-close" title="Voltar à Central" aria-label="Fechar leitor e voltar à Central" onclick="RlmNative.close()">×</button>'+
 '<div class="bc-native-reader-progress-track"><div class="bc-native-reader-progress" id="bcRlmReadBar"></div></div></header>'+
 '<div class="bc-native-reader-tools bc-rlm-reader-tools">'+
 '<input id="bcRlmSearch" type="search" placeholder="Buscar neste material…" aria-label="Buscar no material" oninput="RlmNative.search(this.value)">'+
 '<span class="bc-rlm-search-meta" id="bcRlmSearchMeta" aria-live="polite"></span>'+
 '<button type="button" title="Diminuir fonte" onclick="RlmNative.setFont(-1)">A−</button>'+
 '<button type="button" title="Aumentar fonte" onclick="RlmNative.setFont(1)">A+</button>'+
 '<button type="button" onclick="RlmNative.top()">↑ Topo</button>'+
 (actions?'<span class="bc-rlm-tool-divider"></span>'+actions:'')+
 '</div>'+
 '<div class="bc-native-reader-body bc-rlm-reader-body"><nav class="bc-native-toc bc-rlm-toc" id="bcRlmToc" aria-label="Índice de capítulos"></nav>'+
 '<main class="bc-native-scroll bc-rlm-reader-content" id="bcRlmScroll">'+
 '<article class="bc-native-article bc-rlm-article" id="bcRlmArticle">'+bodyFor(m,stage)+'</article></main></div>'+
 '<footer class="bc-rlm-reader-footer"><button class="bc-rlm-btn" onclick="RlmNative.close()">← Voltar aos módulos</button>'+
 '<small>Mesmos conteúdos e respostas anteriores, novo padrão visual.</small>'+
 '<button class="bc-rlm-btn primary" onclick="RlmNative.next()">Próxima etapa →</button></footer></section>';
 setupToc(stage);
 const content=el('bcRlmScroll');
 if(stage!=='speed')content.scrollTop=oldY;
 const article=el('bcRlmArticle');
 article.style.fontSize=(Number(localStorage.getItem(PREFIX+'reader-font'))||16)+'px';
 content.addEventListener('scroll',updateReadBar,{passive:true});
 updateReadBar();
 if(stage==='speed')speedReady(content.querySelector('iframe'));
}
function top(){el('bcRlmScroll')?.scrollTo({top:0,behavior:'smooth'})}
function updateReadBar(){
 const node=el('bcRlmScroll'),bar=el('bcRlmReadBar');if(!node||!bar)return;
 const max=node.scrollHeight-node.clientHeight;
 bar.style.width=(max>0?Math.min(100,Math.round(node.scrollTop/max*100)):100)+'%';
}

function tab(stage){
 if(!active)return;
 stage=normStage(stage);
 if(!['theory','quiz','map','review','speed'].includes(stage))return;
 active.stage=stage;renderOverlay();el('bcRlmScroll').scrollTop=0;
}
function next(){
 if(!active)return;
 if(active.id==='M01')return open('M02','theory');
 if(active.id==='RF')return close();
 const order=['theory','quiz','map'],i=order.indexOf(active.stage);
 if(i<order.length-1)return tab(order[i+1]);
 const pos=manifest().findIndex(x=>x.id===active.id);
 return pos>=manifest().length-1?open('RF'):open(manifest()[pos+1].id);
}
function bodyFor(m,stage){
 if(stage==='speed')return speed();
 if(stage==='review')return review();
 const d=lesson(m.id);
 if(!d)return '<div class="bc-rlm-warn">Os dados deste módulo ainda não foram carregados. Volte à Central e atualize a página.</div>';
 if(stage==='theory')return theory(m,d);
 if(stage==='quiz')return quiz(m,d);
 if(stage==='map')return mindmap(m,d);
 return theory(m,d);
}
function title(txt,desc){return '<span class="bc-rlm-kicker">Base Completa · edição de estudos</span><h2>'+esc(txt)+'</h2><p class="bc-rlm-article-lead">'+esc(desc)+'</p>'}
function theory(m,d){
 return title('Aula','Conceitos, métodos de resolução, exemplos guiados e recursos visuais. Abra as resoluções depois de tentar cada exemplo e use o índice para retomar um capítulo.')+
 d.theory.map((ch,i)=>'<section class="bc-rlm-lesson"><h3>'+String(i+1).padStart(2,'0')+' · '+esc(ch.title)+'</h3>'+
 (g.RlmTheoryResources?g.RlmTheoryResources.chapter(ch):ch.paragraphs.map(p=>'<p>'+esc(p)+'</p>').join('')+'<details class="bc-rlm-example"><summary>Ver exemplo resolvido</summary><p>'+esc(ch.example)+'</p></details>')+'</section>').join('')+
 '<section class="bc-rlm-tips-block"><h3>Revisão rápida · bizus</h3><div class="bc-rlm-tips">'+d.summary.map((q,i)=>'<section class="bc-rlm-tip"><b>'+String(i+1).padStart(2,'0')+' · '+esc(q.title)+'</b><p>'+esc(q.text)+'</p><em><strong>BIZU: </strong>'+esc(q.bizu)+'</em></section>').join('')+'</div></section>'+
 (g.RlmTheoryResources?.references(d)||'')+
 '<div class="bc-rlm-module-next"><button class="bc-rlm-btn primary" onclick="RlmNative.tab(\'quiz\')">Resolver as questões →</button></div>';
}
function quiz(m,d){
 return title('Questões','3 fáceis • 4 médias • 3 difíceis. Clique na alternativa: o gabarito e a explicação aparecem na hora.')+
 '<div class="bc-rlm-scores" id="bcRlmScore">'+scoreHtml(m.id)+'</div>'+
 d.questions.map((q,i)=>cardQuestion(m.id,q,i)).join('')+
 '<div class="bc-rlm-module-next"><button class="bc-rlm-btn primary" onclick="RlmNative.tab(\'map\')">Abrir mapa mental →</button></div>';
}
function scoreHtml(id){
 const p=result(id);return '<b>'+p.count+'/'+p.total+' respondidas</b> · '+p.correct+' acertos · '+p.pct+'% nas respondidas';
}
function cardQuestion(id,q,i,review=false){
 const store=review?'RF':id, key=review?'R'+id+'-'+i:String(i),selected=answers(store)[key],has=selected!==undefined;
 const classes=['fácil','médio','difícil'];
 const name=LETTERS[q.answer]||'?';
 return '<section class="bc-rlm-quiz" id="bcRlmQ-'+store+'-'+id+'-'+i+'" data-level="'+esc(q.level)+'">'+
 '<div class="bc-rlm-quiz-meta">'+(review?'Simulado · '+id:'Questão '+String(i+1).padStart(2,'0'))+' · '+esc(q.level)+' · Autoral</div>'+
 '<h3>'+esc(q.prompt)+'</h3>'+
 '<div class="bc-rlm-options">'+q.options.map((label,k)=>{
 const c=has?(k===q.answer?' right':k===selected?' wrong':''):'';
 return '<button class="bc-rlm-option'+c+'" '+(has?'disabled':'')+' onclick="RlmNative.answer(\''+id+'\','+i+','+k+','+(review?'true':'false')+')"><b>'+LETTERS[k]+'</b><span>'+esc(label)+'</span></button>';
 }).join('')+'</div>'+
 (has?'<div class="bc-rlm-feedback'+(selected===q.answer?'':' wrong')+'" role="status"><b>'+(selected===q.answer?'✓ Acertou':'✕ Errou')+' · alternativa correta: '+name+'</b>'+esc(q.explanation)+'</div>':'')+'</section>';
}
function answer(id,i,choice,review=false){
 const d=lesson(id),q=d?.questions?.[i];if(!q||!Number.isInteger(choice)||choice<0||choice>4)return;
 const area=review?'RF':id,key=review?'R'+id+'-'+i:String(i),rec=answers(area);
 if(rec[key]!==undefined)return;
 rec[key]=choice;saveAnswers(area,rec);
 const node=el('bcRlmQ-'+area+'-'+id+'-'+i);if(node)node.outerHTML=cardQuestion(id,q,i,review);
 const score=el('bcRlmScore');if(score)score.innerHTML=review?reviewScore():scoreHtml(id);
}
function mindmap(m,d){
 return title('Mapa mental','Ramos e subtemas da aula estruturados para revisão visual, sem rolagem lateral.')+
 '<div class="bc-rlm-map"><div class="bc-rlm-map-center">'+esc(m.titulo)+'</div>'+
 '<div class="bc-rlm-map-grid">'+d.mindmap.map(node=>'<section class="bc-rlm-map-node"><b>'+esc(node.name)+'</b><ul>'+
 node.branches.map(b=>'<li>'+esc(b)+'</li>').join('')+'</ul></section>').join('')+'</div></div>'+
 '<div class="bc-rlm-module-next"><button class="bc-rlm-btn primary" onclick="RlmNative.next()">Próximo módulo →</button></div>';
}
const reviewSpec=[['M02',4],['M03',4],['M04',4],['M05',4],['M06',4],['M07',4],['M08',4],['M09',4],['M10',4],['M11',4],['M12',4],['M13',4],['M14',4],['M15',4],['M03',7],['M04',7],['M05',7],['M11',7],['M12',7],['M14',7]];
function reviewScore(){
 let count=0,correct=0,record=answers('RF');
 for(const [id,i] of reviewSpec){const key='R'+id+'-'+i,q=lesson(id)?.questions?.[i];if(q&&record[key]!==undefined){count++;if(record[key]===q.answer)correct++}}
 return '<b>'+count+'/20 respondidas</b> · '+correct+' acertos · '+(count?Math.round(100*correct/count):0)+'%';
}
function review(){
 return title('Simulado cumulativo','20 questões autorais em estilo prova, com alternativas e feedback imediato. Inclui Lógica, Matemática e Estatística. Não são questões oficiais FCC.')+
 '<div class="bc-rlm-scores" id="bcRlmScore">'+reviewScore()+'</div>'+
 reviewSpec.map(([id,i])=>lesson(id)?.questions?.[i]?cardQuestion(id,lesson(id).questions[i],i,true):'').join('');
}
function speed(){
 return title('Treino de velocidade','O motor do antigo módulo de cálculo rápido foi preservado com seus seis treinos, cronômetro e histórico. Funciona dentro da janela da Central.')+
 '<div class="bc-rlm-warn">Treino original mantido. Os demais módulos antigos de RLM não fazem parte do novo curso.</div>'+
 '<iframe class="bc-rlm-speed" title="Motor original de treino de velocidade" src="/tools/rlm.html#calculo" loading="eager" onload="RlmNative.speedReady(this)"></iframe>';
}
function speedReady(frame){
 try{
  const doc=frame.contentDocument,win=frame.contentWindow;
  if(!doc||!win)return;
  if(!doc.getElementById('bc-rlm-only-speed')){
   const style=doc.createElement('style');style.id='bc-rlm-only-speed';
   style.textContent='html,body{background:#f6f9fc!important}main.wrap{background:transparent!important;max-width:none!important;margin:0!important;padding:14px!important} main.wrap>:not(#fastView){display:none!important}#fastView{display:block!important;position:static!important}#fastView>.back{display:none!important}.fast-view,.fast-hero,.fast-grid{max-width:100%!important}';
   doc.head.appendChild(style);
  }
  win.fastClose=()=>g.RlmNative.close();
  if(typeof win.openFastHome==='function')win.openFastHome();
 }catch(e){console.warn('[RLM] Falha ao adaptar treino original',e)}
}
function onKey(ev){
 if(!active)return;
 if(ev.key==='Escape'){ev.preventDefault();close();return;}
 if(ev.key==='Tab'){
  const root=el(OVER),elements=Array.from(root?.querySelectorAll('button:not(:disabled),a[href],input:not(:disabled),summary')||[]).filter(x=>x.getClientRects().length);
  if(!elements.length)return;
  const first=elements[0],last=elements[elements.length-1];
  if(ev.shiftKey&&document.activeElement===first){ev.preventDefault();last.focus()}
  else if(!ev.shiftKey&&document.activeElement===last){ev.preventDefault();first.focus()}
 }
}
document.addEventListener('keydown',onKey,true);
g.RlmNative={renderMaster,open,close,tab,next,move,mark,stats,answer,speedReady,oldTarget,toggleModule,jump,search,setFont,top};
try{
 const prev=g.openEmbeddedTool;
 if(typeof prev==='function'){
  const redirect=function(name,options,btn){
   if(name==='rlm')return open(oldTarget(options?.target||'calculo'));
   return prev.call(this,name,options,btn);
  };
  g.openEmbeddedTool=redirect;
  try{openEmbeddedTool=redirect}catch(_){}
 }
}catch(e){console.warn('[RLM] Link legado ainda externo',e)}
try{
 if(typeof g.centralResumeLast==='function'){
  const oldResume=g.centralResumeLast;
  g.centralResumeLast=function(){
   try{const last=JSON.parse(localStorage.getItem('central-v6:last')||'null');if(last?.rlmModule)return open(last.rlmModule,last.rlmStage)}catch(_){}
   return oldResume.apply(this,arguments);
  };
  try{centralResumeLast=g.centralResumeLast}catch(_){}
 }
}catch(_){}
if(document.readyState==='loading'){
 document.addEventListener('DOMContentLoaded',()=>setTimeout(syncCentral,0),{once:true});
}else{
 setTimeout(syncCentral,0);
}
})(window);
