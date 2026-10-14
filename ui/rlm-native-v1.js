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
  materialCard(m.id,'summary','Conteúdo resumido','Primeira leitura, bizus e 10 questões com correção imediata.','⚡')+
  materialCard(m.id,'theory','Conteúdo completo','Teoria, unidades e exemplos resolvidos com resposta oculta.','📚')+
  materialCard(m.id,'map','Mapa mental','Síntese visual com os ramos e conceitos do módulo.','🧠')+
  materialCard(m.id,'sources','Questões e fontes','Banco FCC preservado, TEC e situação dos filtros QC.','✓');
 const sub=m.id==='M01'?'Treino original preservado · cálculo rápido':m.eixo;
 return '<section class="cf-module ds-module bc-rlm-module'+(openState?' open':'')+'" data-rlm-module="'+m.id+'">'+
 '<button class="cf-module-head ds-module-head" type="button" aria-expanded="'+openState+'" onclick="return RlmNative.toggleModule(\''+m.id+'\')">'+
 '<span class="cf-module-no">'+(m.id==='M01'?'TREINO':'MÓDULO '+Number(m.id.slice(1)))+'</span>'+
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
 '<h3>Raciocínio Lógico-Matemático</h3><p>Teoria completa, resumo com bizus, questões comentadas e mapas mentais — agora nos mesmos cartões expansíveis das demais disciplinas.</p>'+
 '<div class="bc-rlm-stats"><span class="bc-rlm-stat"><strong>15</strong> módulos</span>'+
 '<span class="bc-rlm-stat"><strong>14</strong> apostilas</span><span class="bc-rlm-stat"><strong>140</strong> questões autorais</span>'+
 '<span class="bc-rlm-stat"><strong>200</strong> FCC legadas</span><span class="bc-rlm-stat"><strong>'+done+'/15</strong> módulos concluídos</span></div>'+
 '<div class="bc-rlm-warn">Questões FCC antigas: gabaritos e comentários pendentes de auditoria. Filtros novos do QConcursos ainda não verificados.</div></section>'+
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
 active={id,stage:id==='M01'?'speed':id==='RF'?'review':stage};
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
function move(id){return open(id,id==='RF'?'review':id==='M01'?'speed':'theory');}
/* Leitor RLM com o mesmo shell, índice lateral e ferramentas do leitor nativo de Penal. */
function stageLabel(stage){
 return ({speed:'Treino de velocidade',theory:'Conteúdo completo',summary:'Conteúdo resumido',map:'Mapa mental',sources:'Questões e fontes',review:'Revisão final'})[stage]||'Material';
}
function stageSections(stage){
 return stage==='theory'?'.bc-rlm-lesson':
 stage==='summary'?'.bc-rlm-tip,.bc-rlm-quiz':
 stage==='map'?'.bc-rlm-map-node':
 stage==='sources'?'.bc-rlm-line,.bc-rlm-quiz':
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
   ((stage==='summary'?'Dica ': 'Parte ')+(i+1));
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
 ['summary','Resumo'],['theory','Completo'],['map','Mapa mental'],['sources','Questões FCC / TEC / QC']
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
 if(!['theory','summary','map','sources','review','speed'].includes(stage))return;
 active.stage=stage;renderOverlay();el('bcRlmScroll').scrollTop=0;
}
function next(){
 if(!active)return;
 if(active.id==='M01')return open('M02','theory');
 if(active.id==='RF')return close();
 const order=['theory','summary','map','sources'],i=order.indexOf(active.stage);
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
 if(stage==='summary')return summary(m,d);
 if(stage==='map')return mindmap(m,d);
 if(stage==='sources')return sources(m);
 return theory(m,d);
}
function title(txt,desc){return '<span class="bc-rlm-kicker">Base Completa · edição de estudos</span><h2>'+esc(txt)+'</h2><p class="bc-rlm-article-lead">'+esc(desc)+'</p>'}
function theory(m,d){
 return title('Teoria completa','Cinco unidades com conceitos, demonstrações, métodos FCC e exemplos resolvidos. O texto está na primeira edição e passará por revisão editorial.')+
 d.theory.map((ch,i)=>'<section class="bc-rlm-lesson"><h3>'+String(i+1).padStart(2,'0')+' · '+esc(ch.title)+'</h3>'+
 ch.paragraphs.map(p=>'<p>'+esc(p)+'</p>').join('')+
 '<details class="bc-rlm-example"><summary>Ver exemplo resolvido</summary><p>'+esc(ch.example)+'</p></details></section>').join('')+
 '<div class="bc-rlm-module-next"><button class="bc-rlm-btn primary" onclick="RlmNative.tab(\'summary\')">Resumo com dicas e prática →</button></div>';
}
function summary(m,d){
 return title('Resumo com dicas e bizus','Revisão aplicada ao edital. Após o resumo, responda às 10 questões autorais em ordem de dificuldade; cada escolha revela o gabarito e a explicação.')+
 '<div class="bc-rlm-tips">'+d.summary.map((q,i)=>'<section class="bc-rlm-tip"><b>'+String(i+1).padStart(2,'0')+' · '+esc(q.title)+'</b><p>'+esc(q.text)+'</p><em><strong>BIZU: </strong>'+esc(q.bizu)+'</em></section>').join('')+'</div>'+
 '<h2>Prática progressiva</h2><p class="bc-rlm-article-lead">3 fáceis • 4 médias • 3 difíceis. Questões autorais, não retiradas de provas FCC.</p>'+
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
 '<div class="bc-rlm-module-next"><button class="bc-rlm-btn primary" onclick="RlmNative.tab(\'sources\')">Questões reais e filtros →</button></div>';
}
const TEC={
 'rlm-01':['Proposições e conectivos','https://www.tecconcursos.com.br/questoes/cadernos/101791585'],
 'rlm-02':['Equivalências, negações e álgebra','https://www.tecconcursos.com.br/questoes/cadernos/101888528'],
 'rlm-03':['Argumentação e primeira ordem','https://www.tecconcursos.com.br/questoes/cadernos/101888612'],
 'rlm-04':['Associação e verdade ou mentira','https://www.tecconcursos.com.br/questoes/cadernos/101889213'],
 'rlm-05':['Sequências e orientação','https://www.tecconcursos.com.br/questoes/cadernos/101889314'],
 'rlm-06':['Problemas especiais de lógica','https://www.tecconcursos.com.br/questoes/cadernos/101889431'],
 'mat-01':['Conjuntos','https://www.tecconcursos.com.br/questoes/cadernos/101890229'],
 'mat-02':['Números e operações','https://www.tecconcursos.com.br/questoes/cadernos/101890343'],
 'mat-04':['Proporcionalidade e porcentagem','https://www.tecconcursos.com.br/questoes/cadernos/101890577'],
 'mat-05':['Gráficos, medidas e moeda','https://www.tecconcursos.com.br/questoes/cadernos/101890621']
};
function legacy(id){return (g.RLM_FCC_LEGADO||[]).filter(q=>q.module===id);}
function realCard(q){
 const key=q.id,area='fcc-'+q.module,record=answers(area),choice=record[key],has=choice!==undefined;
 const opts=Object.entries(q.options||{}).filter(([k])=>LETTERS.includes(k)).map(([letter,value])=>'<button class="bc-rlm-option'+(has?(letter===q.answer?' right':letter===choice?' wrong':''):'')+'" '+(has||q.visualRequired?'disabled':'')+' onclick="RlmNative.answerReal(\''+q.module+'\',\''+esc(key)+'\',\''+letter+'\')"><b>'+letter+'</b><span>'+esc(value)+'</span></button>').join('');
 const source=q.url&&/^https:\/\/www\.tecconcursos\.com\.br\/questoes\/\d+$/.test(q.url)?'<a href="'+esc(q.url)+'" target="_blank" rel="noopener noreferrer" class="bc-rlm-btn">Ver no TEC ↗</a>':'';
 return '<section class="bc-rlm-quiz"><div class="bc-rlm-quiz-meta">FCC · questão legado · '+esc(q.source)+'</div><h3>'+esc(q.prompt)+'</h3>'+
 (q.visualRequired?'<div class="bc-rlm-warn">Questão depende de imagem do PDF original. Alternativas bloqueadas até conferência da figura.</div>':'<div class="bc-rlm-options">'+opts+'</div>')+
 (has?'<div class="bc-rlm-feedback'+(choice===q.answer?'':' wrong')+'"><b>'+(choice===q.answer?'Conforme gabarito legado: acertou':'Conforme gabarito legado: '+esc(q.answer))+'</b>Gabarito do acervo antigo; ainda sem comentário individual auditado. Para praticar com explicação imediata, use a aba Resumo e prática.</div>':'')+
 '<p style="font-size:11px;color:#71859a;margin-top:10px">Página de origem: '+esc(q.page)+' · '+esc(q.topic)+'</p>'+source+'</section>';
}
function realPage(id){
 const list=legacy(id),total=list.length,size=5,max=Math.max(1,Math.ceil(total/size)),page=Math.max(0,Math.min(pageByModule[id]||0,max-1));
 pageByModule[id]=page;
 return list.slice(page*size,(page+1)*size).map(realCard).join('')+
 '<div class="bc-rlm-module-next"><button class="bc-rlm-btn" '+(page===0?'disabled':'')+' onclick="RlmNative.fccStep(-1)">← Anteriores</button><span style="font-size:12px;color:#70869a">Página '+(page+1)+'/'+max+'</span><button class="bc-rlm-btn" '+(page+1>=max?'disabled':'')+' onclick="RlmNative.fccStep(1)">Próximas →</button></div>';
}
function fccStep(step){
 if(!active)return;const id=active.id;
 pageByModule[id]=Math.max(0,(pageByModule[id]||0)+step);
 const target=el('bcRlmRealBank');if(target){target.innerHTML=realPage(id);target.scrollIntoView({behavior:'smooth',block:'nearest'})}
}
function answerReal(id,questionId,letter){
 const q=legacy(id).find(x=>x.id===questionId);if(!q||q.visualRequired||!LETTERS.includes(letter))return;
 const area='fcc-'+id,rec=answers(area);if(rec[questionId]!==undefined)return;
 rec[questionId]=letter;saveAnswers(area,rec);
 const parent=el('bcRlmRealBank');if(parent)parent.innerHTML=realPage(id);
}
function sources(m){
 const candidates=m.tecCandidatos||[],items=legacy(m.id);
 return title('Questões e filtros','Questões FCC antigas separadas das autorais. Os cadernos TEC são referências existentes na Central, mas a adequação de seus filtros ao novo módulo precisa ser revisada.')+
 '<div class="bc-rlm-line"><div><b>QConcursos</b><small>Filtro de RLM ainda não cadastrado nem validado</small></div><span class="bc-rlm-pill">Pendente</span></div>'+
 '<div class="bc-rlm-line"><div><b>TEC Concursos</b><small>'+esc(candidates.length?candidates.join(' · '):'Sem correspondência específica confirmada')+'</small></div><span class="bc-rlm-pill">Confirmar assunto</span></div>'+
 '<div class="bc-rlm-module-next">'+candidates.filter(id=>TEC[id]).map(id=>'<a class="bc-rlm-btn" href="'+esc(TEC[id][1])+'" target="_blank" rel="noopener noreferrer">TEC '+esc(id)+' ↗</a>').join('')+'</div>'+
 '<div class="bc-rlm-line"><div><b>Banco FCC da Central antiga</b><small>'+items.length+' questões originais recuperadas; comentários individuais ainda pendentes</small></div><span class="bc-rlm-pill">Não auditado</span></div>'+
 (items.length?'<div class="bc-rlm-warn">Gabaritos importados sem certificação independente. Três questões dependem de imagem do PDF-fonte e estão bloqueadas até que as figuras sejam verificadas.</div><div id="bcRlmRealBank">'+realPage(m.id)+'</div>':'<div class="bc-rlm-warn">Ainda não há questão FCC original no banco local para este assunto. Use a prática autoral comentada no resumo.</div>');
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
g.RlmNative={renderMaster,open,close,tab,next,move,mark,stats,answer,answerReal,fccStep,speedReady,oldTarget,toggleModule,jump,search,setFont,top};
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
