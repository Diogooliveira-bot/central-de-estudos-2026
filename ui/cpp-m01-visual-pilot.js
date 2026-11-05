/* Visual editorial layer for all complete CPP modules. Source blocks are preserved. */
(function(g){
 'use strict';
 const routes={2:['Lei no tempo','Lei no espaço','Interpretação'],3:['Investigação','Características','Controle'],4:['Ação pública','Ação privada','Condições'],5:['Juiz','Partes','Auxiliares'],6:['Jurisdição','Competência','Conflitos'],7:['Prejudiciais','Exceções','Incidentes'],8:['Prejuízo','Classificação','Consequências'],9:['Atos','Prazos','Contagem'],10:['Citação','Intimação','Efeitos'],11:['Estrutura','Fundamentação','Decisões'],12:['Prova','Limites','Valoração'],13:['Cautelares','Flagrante','Controle'],14:['Preventiva','Alternativas','Liberdade'],15:['Ritos','Defesa','Julgamento'],16:['Princípios','Fases','Plenário'],17:['Ritos especiais','Particularidades','Comparações'],18:['Âmbito','Defesa preliminar','Procedimento'],19:['Admissibilidade','Princípios','Efeitos'],20:['Cabimento','Prazos','Efeitos'],21:['Competência','Procedimento','Soluções consensuais'],22:['Habeas corpus','Cabimento','Outras ações']};
 function general(body,n){
  const article=body.querySelector('.bc-native-article'),module=g.CPP_NATIVE_INDEX?.modules.find(m=>m.number===n);
  if(!article||!module||article.classList.contains('cpp-visual-pilot'))return;
  const topics=routes[n];if(!topics)return;
  article.classList.add('cpp-visual-pilot');
  const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
  const eligible=el=>!el.closest('.cpp-native-question,.cppv-scheme,details.question')&&!/Gabarito:|Resposta comentada/i.test(el.textContent);
  function section(label,title){const s=document.createElement('section');s.className='cppv-scheme';s.dataset.cppVisualAdded='1';const small=document.createElement('small');small.textContent=label;const h=document.createElement('h3');h.textContent=title;const grid=document.createElement('div');grid.className='cppv-grid';s.append(small,h,grid);return {s,grid};}
  function tile(grid,title,lines,i){const card=document.createElement('div');card.className='cppv-tile';const num=document.createElement('span');num.textContent=String(i+1).padStart(2,'0');const b=document.createElement('b');b.textContent=title;card.append(num,b);lines.forEach(line=>{const p=document.createElement('p');p.textContent=line;card.append(p)});grid.append(card);}
  const hero=document.createElement('section');hero.className='cppv-hero';
  const eyebrow=document.createElement('div');eyebrow.className='cppv-eyebrow';eyebrow.textContent='BASE COMPLETA / PROCESSO PENAL / M'+String(n).padStart(2,'0');
  const badge=document.createElement('span');badge.className='cppv-edition';badge.textContent='APOSTILA · TEORIA COMPLETA';
  const title=document.createElement('h1');title.textContent=module.title;
  const intro=document.createElement('p');intro.textContent='Estude a teoria em profundidade e use os quadros visuais para organizar as diferenças e recuperar os pontos centrais.';
  const route=document.createElement('div');route.className='cppv-route';
  [...topics,'Fixação'].forEach((t,i)=>{const span=document.createElement('span');const num=document.createElement('b');num.textContent=String(i+1).padStart(2,'0');span.append(num,document.createTextNode(t));route.append(span)});
  hero.append(eyebrow,badge,title,intro,route);article.prepend(hero);
  const heads=[...article.querySelectorAll('h1,h2,h3,h4')].filter(eligible);
  heads.forEach(h=>{if(/^\d+[.\s—]/.test(clean(h.textContent)))h.classList.add('cppv-section-heading')});
  // Re-express one complete comparison using every cell and every row. No inferred rules.
  const table=[...article.querySelectorAll('table')].filter(eligible).find(t=>t.rows.length>=3&&t.rows.length<=6&&!t.querySelector('[colspan],[rowspan]')&&[...t.rows].every(r=>r.cells.length===t.rows[0].cells.length&&r.cells.length>=2&&r.cells.length<=4&&r.textContent.length<1600));
  if(table){
   const rows=[...table.rows],labels=[...rows[0].cells].map(c=>clean(c.textContent));
   const {s,grid}=section('COMPARE OS PONTOS · QUADRO DO MATERIAL','Uma comparação para guardar');
   rows.slice(1).forEach((row,i)=>{const cells=[...row.cells].map(c=>clean(c.textContent));tile(grid,cells[0],cells.slice(1).map((v,j)=>labels[j+1]+': '+v),i)});
   table.after(s);
  }
  // Keep each original item whole, including its qualifiers and exceptions.
  const list=[...article.querySelectorAll('ul,ol')].filter(eligible).find(l=>l.children.length>=2&&l.children.length<=4&&!l.querySelector('ul,ol')&&[...l.children].every(c=>clean(c.textContent).length>20&&clean(c.textContent).length<500)&&(!table||!(l.compareDocumentPosition(table)&Node.DOCUMENT_POSITION_FOLLOWING)));
  if(list){const {s,grid}=section('ORGANIZE A LEITURA · PONTOS DO MATERIAL','Observe estes pontos em conjunto');[...list.children].forEach((li,i)=>tile(grid,'Ponto '+(i+1),[clean(li.textContent)],i));list.after(s);}
  const firstQuestion=article.querySelector('.cpp-native-question');
  if(firstQuestion){const {s,grid}=section('ANTES DE RESPONDER','Recupere o caminho do módulo');topics.forEach((topic,i)=>tile(grid,topic,['Explique o tema com suas palavras e confira as regras, distinções e exceções na teoria.'],i));const questionHeading=firstQuestion.previousElementSibling;const sectionHeading=questionHeading?.previousElementSibling;(/questões.*fixação|questões.*internas/i.test(sectionHeading?.textContent||'')?sectionHeading:questionHeading||firstQuestion).before(s);}
  styleCallouts(article);
 }
 function styleCallouts(article){
  article.querySelectorAll('div,aside,blockquote').forEach(el=>{
   if(el.closest('.cppv-hero,.cppv-scheme,.cpp-native-question'))return;
   const label=el.querySelector(':scope > strong,:scope > b,:scope > p > strong,:scope > p > b');
   if(!label||el.textContent.length>3500)return;
   const t=label.textContent.toUpperCase();
   const type=/PEGADINHA/.test(t)?'attention':/LEI SECA|CPP, ART|CF, ART/.test(t)?'law':/DOUTRINA/.test(t)?'doctrine':/EXEMPLO/.test(t)?'example':/DECORE|SÍNTESE|CONCEITO-BASE/.test(t)?'memory':'';
   if(type)el.classList.add('cppv-callout','cppv-'+type);
  });
 }
 function enhance(body,n,kind){
  if(kind!=='complete')return;
  if(Number(n)!==1)return general(body,Number(n));
  const article=body.querySelector('.bc-native-article');
  if(!article||article.classList.contains('cpp-visual-pilot'))return;
  article.classList.add('cpp-visual-pilot');
  const hero=document.createElement('section');hero.className='cppv-hero';
  hero.innerHTML='<div class="cppv-eyebrow">BASE COMPLETA / PROCESSO PENAL / M01</div><span class="cppv-edition">LEITURA COMPLETA · PILOTO VISUAL</span><h1>Introdução ao<br>Direito Processual Penal</h1><p>Conceitos, sistemas e garantias para compreender a estrutura do processo penal.</p><div class="cppv-route"><span><b>01</b> Fundamentos</span><span><b>02</b> Sistemas</span><span><b>03</b> Garantias</span><span><b>04</b> Fixação</span></div>';
  article.prepend(hero);
  const heads=[...article.querySelectorAll('h1,h2,h3,h4')];
  heads.forEach(h=>{if(/^\d+\.\s/.test(h.textContent.trim()))h.classList.add('cppv-section-heading');});
  function insertBeforeHeading(pattern,node){const head=heads.find(h=>pattern.test(h.textContent.trim()));if(head)head.before(node);}
  function visual(label,title,items){
   const section=document.createElement('section');section.className='cppv-scheme';section.dataset.cppVisualAdded='1';
   const eyebrow=document.createElement('small');eyebrow.textContent=label;
   const heading=document.createElement('h3');heading.textContent=title;
   const grid=document.createElement('div');grid.className='cppv-grid';
   items.forEach(([name,description],i)=>{const card=document.createElement('div');card.className='cppv-tile';const number=document.createElement('span');number.textContent=String(i+1).padStart(2,'0');const b=document.createElement('b');b.textContent=name;const p=document.createElement('p');p.textContent=description;card.append(number,b,p);grid.append(card)});
   section.append(eyebrow,heading,grid);return section;
  }
  insertBeforeHeading(/^3\. CONCEITO/,visual('VISÃO DE CONJUNTO','Duas dimensões do mesmo processo',[
   ['Instrumental','O processo permite a aplicação jurisdicional do direito penal.'],
   ['Garantidora','O processo condiciona e limita o exercício do poder de punir.']
  ]));
  insertBeforeHeading(/^5\.3/,visual('ORGANIZE AS FUNÇÕES','Sistema acusatório: funções separadas',[
   ['Acusar','Acusação atribuída ao sujeito legitimado.'],['Defender','Defesa adequada e contraditório efetivo.'],['Julgar','Juiz imparcial, institucionalmente separado das partes.']
  ]));
  insertBeforeHeading(/^12\./,visual('REVISÃO VISUAL · CLASSIFICAÇÃO DOUTRINÁRIA','Presunção de inocência em três dimensões',[
   ['Tratamento','O acusado não pode ser tratado como definitivamente culpado antes do trânsito em julgado.'],
   ['Prova','Não existe dever geral do acusado de provar sua inocência.'],
   ['Julgamento','Dúvida juridicamente relevante incompatível com a condenação: in dubio pro reo.']
  ]));
  // Style existing explanatory blocks by their actual labels; never alter questions.
  article.querySelectorAll('div,aside,blockquote').forEach(el=>{
   if(el.closest('.cppv-hero,.cppv-scheme,.cpp-native-question'))return;
   const label=el.querySelector(':scope > strong,:scope > b,:scope > p > strong,:scope > p > b');
   if(!label||el.textContent.length>3500)return;
   const t=label.textContent.toUpperCase();
   const type=/PEGADINHA/.test(t)?'attention':/LEI SECA|CPP, ART|CF, ART/.test(t)?'law':/DOUTRINA/.test(t)?'doctrine':/EXEMPLO/.test(t)?'example':/DECORE|SÍNTESE|CONCEITO-BASE/.test(t)?'memory':'';
   if(type){el.classList.add('cppv-callout','cppv-'+type);}
  });
  insertBeforeHeading(/^4\. 10 QUESTÕES/,visual('ANTES DE RESPONDER','Recupere o caminho do módulo',[
   ['Conceito','Explique as dimensões instrumental e garantidora.'],['Sistemas','Diferencie concentração e separação de funções.'],['Garantias','Relacione cada garantia à sua função no processo.']
  ]));
 }
 g.CppVisualPilot={enhance};
})(window);
