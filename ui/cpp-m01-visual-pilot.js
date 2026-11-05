/* Editorial pilot: only the complete CPP M01 reader. Source text is preserved. */
(function(g){
 'use strict';
 function enhance(body,n,kind){
  if(Number(n)!==1||kind!=='complete')return;
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
