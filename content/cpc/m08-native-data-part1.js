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
  var prev=g.CpcStudyV1.renderMaster;
  g.CpcStudyV1.renderMaster=function(){var base=prev(),w=g.__CPC_WEEKS.find(x=>x.id==='cpc8'),i=base.lastIndexOf('</div>');return w?base.slice(0,i)+H(w)+base.slice(i):base};
  try{renderAll()}catch(_){}
 }setTimeout(I,0);
})(window);