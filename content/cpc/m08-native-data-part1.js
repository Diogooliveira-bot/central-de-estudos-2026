(function(g){g.BASE_NATIVE_CONTENT=g.BASE_NATIVE_CONTENT||{};g.BASE_NATIVE_CONTENT.cpc=g.BASE_NATIVE_CONTENT.cpc||{};g.BASE_NATIVE_CONTENT.cpc.m08={
moduleId:'cpc8',number:8,title:'Comunicação dos atos processuais e nulidades',
summary:`1. VISÃO GERAL
Comunicação processual: cartas, citação e intimação. Nulidades: finalidade do ato, prejuízo, dependência e aproveitamento.
Cartas: ordem, precatória, rogatória e arbitral. Preferencialmente eletrônicas; devolução ao juízo de origem em 10 dias.

2. CITAÇÃO
Convoca réu, executado ou interessado para integrar a relação processual. Comparecimento espontâneo supre falta ou nulidade e inicia prazo de defesa.
Efeitos: litispendência, coisa litigiosa e mora. Prescrição liga-se ao despacho que ordena a citação.
Formas: eletrônica, correio, oficial de justiça, hora certa e edital.
Hora certa: 2 tentativas + suspeita de ocultação + retorno no dia útil imediato + comunicação posterior.
Edital: excepcional, prazo de 20 a 60 dias. Tema 1.338/STJ exige esgotamento razoável e motivado.
Domicílio Judicial Eletrônico: citações e comunicações pessoais. DJEN: publicações oficiais e edital.

3. INTIMAÇÃO E NULIDADES
Intimação dá ciência dos atos e termos do processo. Pedido expresso de intimação em nome de advogado indicado deve ser respeitado.
Art. 276: não se pede nulidade causada pela própria parte.
Art. 277: forma diversa pode ser preservada se a finalidade foi alcançada.
Art. 278: alegação na primeira oportunidade, salvo exceções.
Art. 279: falta de intimação obrigatória do MP exige ouvi-lo sobre prejuízo.
Art. 281: nulidade atinge atos subsequentes dependentes.
Art. 282: juiz delimita efeitos e evita repetição inútil.
Art. 283: preservam-se atos aproveitáveis sem prejuízo à defesa.

4. ARTIGOS PARA DECORAR
236-237 cartas; 238 citação; 239 §1º comparecimento espontâneo; 240 efeitos; 246 eletrônica; 252-254 hora certa; 256-257 edital; 269 intimação; 272 §5º advogado indicado; 276-283 nulidades.

5. PEGADINHAS E REVISÃO
Citação não é intimação. Eletrônica é preferencial, não exclusiva. Comparecimento espontâneo pode suprir vício. Hora certa exige ocultação. Edital não exige diligências infinitas. Nulidade não contamina automaticamente tudo depois. Domicílio não se confunde com DJEN.`,
complete:`1. VISÃO GERAL
A comunicação dos atos processuais ocorre entre órgãos jurisdicionais, principalmente por cartas, e entre o juízo e os sujeitos do processo, sobretudo por citação e intimação.

2. CARTAS PROCESSUAIS
De ordem: tribunal para juízo vinculado. Precatória: juízo brasileiro para outro juízo brasileiro. Rogatória: cooperação internacional. Arbitral: juízo arbitral para Judiciário.
As cartas são preferencialmente eletrônicas, podem ser itinerantes e, cumpridas, retornam ao juízo de origem em 10 dias.

3. CITAÇÃO: CONCEITO E FUNÇÃO
Citação convoca réu, executado ou interessado para integrar a relação processual. Deve ser efetivada em até 45 dias da propositura. Comparecimento espontâneo supre falta ou nulidade.

4. EFEITOS DA CITAÇÃO
A citação válida induz litispendência, torna litigiosa a coisa e constitui mora, ressalvadas hipóteses legais. A interrupção da prescrição decorre do despacho que ordena a citação.

5. QUEM PODE RECEBER, ONDE E QUANDO
A citação é pessoal, mas admite representante nas hipóteses legais. Pode ocorrer onde o citando se encontre. Há restrições temporárias e disciplina própria para incapacidade ou impossibilidade de receber.

6. CITAÇÃO ELETRÔNICA
É preferencial. O CPC prevê expedição em até 2 dias úteis da decisão. O Domicílio Judicial Eletrônico atende citações e comunicações pessoais; o DJEN atende publicações oficiais.
`,chapters:{summary:[
{id:'s1',title:'Visão geral e cartas',match:'1. VISÃO GERAL'},
{id:'s2',title:'Citação',match:'2. CITAÇÃO'},
{id:'s3',title:'Intimação e nulidades',match:'3. INTIMAÇÃO E NULIDADES'},
{id:'s4',title:'Artigos para decorar',match:'4. ARTIGOS PARA DECORAR'},
{id:'s5',title:'Pegadinhas e revisão',match:'5. PEGADINHAS E REVISÃO'}],
complete:[
{id:'c1',title:'Visão geral',match:'1. VISÃO GERAL'},
{id:'c2',title:'Cartas processuais',match:'2. CARTAS PROCESSUAIS'},
{id:'c3',title:'Citação: conceito e função',match:'3. CITAÇÃO: CONCEITO E FUNÇÃO'},
{id:'c4',title:'Efeitos da citação',match:'4. EFEITOS DA CITAÇÃO'},
{id:'c5',title:'Quem pode receber, onde e quando',match:'5. QUEM PODE RECEBER'},
{id:'c6',title:'Citação eletrônica',match:'6. CITAÇÃO ELETRÔNICA'},
{id:'c7',title:'Correio e oficial',match:'7. CITAÇÃO PELO CORREIO'},
{id:'c8',title:'Hora certa',match:'8. HORA CERTA'},
{id:'c9',title:'Edital',match:'9. CITAÇÃO POR EDITAL'},
{id:'c10',title:'Formas atípicas',match:'10. FORMAS ATÍPICAS'},
{id:'c11',title:'Intimação',match:'11. INTIMAÇÃO'},
{id:'c12',title:'Nulidades processuais',match:'12. NULIDADES'},
{id:'c13',title:'Classificação das nulidades',match:'13. CLASSIFICAÇÃO'},
{id:'c14',title:'Prazos e números',match:'14. NÚMEROS'},
{id:'c15',title:'Pegadinhas e revisão',match:'15. PEGADINHAS'}]}};})(window);
(function(g){
function src(){return g.BASE_NATIVE_CONTENT?.cpc?.m08}
function key(m,id){return 'central-v6:cpc-m08:'+m+':'+id}
function stats(m){const a=src()?.chapters?.[m]||[];return {done:a.filter(x=>localStorage.getItem(key(m,x.id))==='1').length,total:a.length}}
function close(){document.getElementById('cpcM08Reader')?.remove();document.body.style.overflow=''}
function open(m){
 const d=src();if(!d)return;
 const raw=m==='summary'?d.summary:d.complete,chs=d.chapters?.[m]||[];
 const o=document.createElement('div');o.id='cpcM08Reader';o.className='bc-native-reader-overlay';
 o.innerHTML='<section class="bc-native-reader"><header class="bc-native-reader-head"><div class="bc-native-reader-title"><b>CPC M08 — '+d.title+'</b><small>'+(m==='summary'?'Conteúdo resumido':'Conteúdo completo')+' • leitura incorporada</small></div><button class="bc-native-reader-close" onclick="CpcM08NativeReader.close()">×</button></header><div class="bc-native-reader-tools"><button class="primary" onclick="CpcM08NativeReader.close()">← Voltar ao M08</button></div><div class="bc-native-reader-body"><nav class="bc-native-toc">'+chs.map((x,i)=>'<label class="bc-native-toc-row"><input type="checkbox" data-m08="'+x.id+'" '+(localStorage.getItem(key(m,x.id))==='1'?'checked':'')+'><span>'+(i+1)+'. '+x.title+'</span></label>').join('')+'</nav><main class="bc-native-scroll"><article class="bc-native-article"><h1>'+d.title+'</h1>'+raw.split(/\n\s*\n/).map(p=>'<p>'+p.replace(/[&<>]/g,z=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[z]))+'</p>').join('')+'</article></main></div></section>';
 document.body.appendChild(o);document.body.style.overflow='hidden';
 o.querySelectorAll('[data-m08]').forEach(i=>i.onchange=()=>{localStorage.setItem(key(m,i.dataset.m08),i.checked?'1':'0');try{renderAll()}catch(_){}});
}
g.CpcM08NativeReader={open,close,stats};
})(window);
/* __M08_MINI_RENDER__ */
(function(g){
 function H(w){
  var a=g.CpcM08NativeReader.stats('summary'),b=g.CpcM08NativeReader.stats('complete');
  return '<section class="cf-module" data-cf="cpc8"><button class="cf-module-head" onclick="toggleCpcModule(\'cpc8\')"><span class="cf-module-no">MÓDULO 8</span><span class="cf-module-title">'+w.title+'</span><span class="chev">⌄</span></button><div class="cf-module-body"><section class="bc-native-materials bc-native-materials-static"><div class="bc-native-material-grid"><button class="bc-native-material-card" onclick="CpcM08NativeReader.open(\'summary\')"><span class="bc-native-material-icon">⚡</span><span><strong>Conteúdo resumido</strong><small>'+a.done+'/'+a.total+' capítulos</small></span></button><button class="bc-native-material-card" onclick="CpcM08NativeReader.open(\'complete\')"><span class="bc-native-material-icon">📚</span><span><strong>Conteúdo completo</strong><small>'+b.done+'/'+b.total+' capítulos</small></span></button><button class="bc-native-material-card"><span class="bc-native-material-icon">🧠</span><span><strong>Mapa mental</strong><small>Carrossel M08</small></span></button></div></section></div></section>';
 }
 function I(){
  if(!g.CpcStudyV1||!g.__CPC_WEEKS){setTimeout(I,120);return}
  if(g.__M08Installed)return;g.__M08Installed=true;
  var prevProgress=g.CpcStudyV1.progress;
  g.CpcStudyV1.progress=function(id){return id==='cpc8'||id==='w8'?g.cpcM08Progress():prevProgress(id)};
  var prev=g.CpcStudyV1.renderMaster;
  g.CpcStudyV1.renderMaster=function(){var base=prev(),w=g.__CPC_WEEKS.find(x=>x.id==='cpc8'),i=base.lastIndexOf('</div>');return w?base.slice(0,i)+H(w)+base.slice(i):base};
  try{renderAll()}catch(_){}
 }setTimeout(I,0);
})(window);
/* __M08_ENHANCE__ */
(function(g){
 const K='central-v6:cpc-study-v1',Q='cpc_tjce_fcc_guided_v34';
 function J(k){try{return JSON.parse(localStorage.getItem(k)||'{}')}catch(_){return {}}}
 function M(){return Object.assign({map:false,decorando:false},J(K).modules?.w8||{})}
 function setM(p){const s=J(K);s.modules=s.modules||{};s.modules.w8=Object.assign({},s.modules.w8||{},p);localStorage.setItem(K,JSON.stringify(s));try{renderAll()}catch(_){}}
 function q(m){return !!J(Q).weeks?.cpc8?.[m]}
 function ext(){const x=J(K).external?.w8||{};return {done:+x.done||0,correct:+x.correct||0}}
 function saveExt(){const s=J(K),d=Math.max(0,+document.getElementById('m08done')?.value||0),a=Math.min(d,Math.max(0,+document.getElementById('m08ok')?.value||0));s.external=s.external||{};s.external.w8={done:d,correct:a};localStorage.setItem(K,JSON.stringify(s));try{renderAll()}catch(_){}}
 function pct(){const m=M(),a=g.CpcM08NativeReader.stats('summary'),b=g.CpcM08NativeReader.stats('complete'),t=1+a.total+5+b.total+10+1,d=(m.map?1:0)+a.done+(q('intermediate')?5:0)+b.done+(q('fixation')?10:0)+(m.decorando?1:0);return Math.round(d/t*100)}
 function mapOpen(){const old=document.getElementById('m08map');if(old)return;const cards=[['Visão geral','Cartas, citação, intimação e nulidades.'],['Citação','238 conceito • 239 comparecimento • 240 efeitos • 246 eletrônica.'],['Hora certa e edital','2 tentativas + ocultação • edital excepcional • 20–60 dias.'],['Intimação','269 conceito • 272 §5º advogado indicado • 274 endereço.'],['Nulidades','276 causa • 277 finalidade • 278 oportunidade • 281 dependência.'],['Decore','45 • 2 úteis • 3 úteis • 5% • 2 tentativas • 10 dias • 20–60 dias.']];let i=0,o=document.createElement('div');o.id='m08map';o.className='bc-cpc-map-overlay';function draw(){o.innerHTML='<div class="bc-cpc-map-overlay-head"><div><b>CPC M08 — Mapa Mental</b><span>'+(i+1)+' / '+cards.length+'</span></div><button class="bc-cpc-map-close" id="m08close">← Voltar ao M08</button></div><div style="display:grid;place-items:center;height:calc(100vh - 70px);padding:24px;background:#eef4fb"><article style="max-width:760px;width:100%;padding:34px;border-radius:26px;background:white"><h2>'+cards[i][0]+'</h2><p style="font-size:22px;line-height:1.45">'+cards[i][1]+'</p><div class="cf-actions"><button class="cf-btn" id="m08prev">← Anterior</button><button class="cf-btn primary" id="m08next">'+(i===cards.length-1?'Concluir':'Próximo →')+'</button></div></article></div>';o.querySelector('#m08close').onclick=close;o.querySelector('#m08prev').onclick=()=>{i=Math.max(0,i-1);draw()};o.querySelector('#m08next').onclick=()=>{if(i===cards.length-1){setM({map:true});close()}else{i++;draw()}}}function close(){o.remove();document.body.style.overflow=''}document.body.appendChild(o);document.body.style.overflow='hidden';draw()}
 function enhance(){const el=document.querySelector('[data-cf="cpc8"] .cf-module-body');if(!el||el.dataset.m08enh)return;el.dataset.m08enh='1';const m=M(),x=ext(),p=pct(),acc=x.done?Math.round(x.correct/x.done*1000)/10:0;const cards=el.querySelectorAll('.bc-native-material-card');if(cards[2])cards[2].onclick=mapOpen;const top=document.createElement('section');top.className='cpc-study-intro';top.innerHTML='<div><h3>Cobertura do módulo</h3><p>Leitura + questões internas + mapa + Decorando.</p></div><div class="cpc-study-pct">'+p+'%</div>';el.insertBefore(top,el.children[1]||null);const extra=document.createElement('div');extra.innerHTML='<section class="cpc-study-intro"><div><h3>Fixação interna</h3><p>5 questões no resumido e 10 no completo.</p></div><div class="cpc-study-actions"><button class="cf-btn '+(q('intermediate')?'good':'')+'" onclick="startCpcQuiz(\'cpc8\',\'intermediate\',5)">5 do resumido</button><button class="cf-btn '+(q('fixation')?'good':'')+'" onclick="startCpcQuiz(\'cpc8\',\'fixation\',10)">10 do completo</button></div></section><div class="cpc-bottom-grid"><section class="cpc-mini-panel"><h4>⚖️ Decorando a Lei</h4><button class="cf-btn primary" onclick="openLeiSecaEnxuta(null,\'cpc\',\'cpc-m08\')">Abrir Decorando</button> <button class="cf-btn" onclick="cpcM08Set({decorando:'+(!m.decorando)+'})">'+(m.decorando?'✓ Concluído':'Marcar concluído')+'</button></section><section class="cpc-mini-panel"><h4>🎯 Questões externas</h4><div class="cpc-external-form"><label>Feitas<input id="m08done" type="number" value="'+x.done+'"></label><label>Acertos<input id="m08ok" type="number" value="'+x.correct+'"></label><button class="cf-btn" onclick="cpcM08SaveExternal()">Salvar</button></div><div class="cpc-ext-score">'+(x.done?acc+'%':'—')+'</div></section></div>';el.appendChild(extra)}
 g.cpcM08Set=setM;g.cpcM08SaveExternal=saveExt;g.cpcM08OpenMap=mapOpen;g.cpcM08Progress=pct;
 const old=g.renderAll;g.renderAll=function(){const r=old.apply(this,arguments);setTimeout(enhance,0);return r};setTimeout(enhance,300);
})(window);
