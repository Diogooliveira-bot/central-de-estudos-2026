/* Editorial presentation only: original theory, questions and progress are preserved. */
(function(g){
 'use strict';
 const routes={1:['Princípios','Interpretação','Conflito aparente'],2:['Lei no tempo','Lei no espaço','Aplicação'],3:['Fato típico','Conduta','Dolo e culpa'],4:['Ilicitude','Justificantes','Excesso'],5:['Culpabilidade','Imputabilidade','Teoria do erro'],6:['Autoria','Participação','Comunicabilidade'],7:['Penas','Dosimetria','Concurso de crimes'],8:['Ação penal','Punibilidade','Prescrição'],9:['Vida e integridade','Honra','Liberdade'],10:['Subtração','Fraude','Receptação'],11:['Moeda e papéis','Documentos','Outras falsidades'],12:['Liberdade sexual','Vulnerabilidade','Disposições gerais'],13:['Funcionário público','Particular','Administração da Justiça'],14:['Sujeitos','Finalidade específica','Condutas típicas'],15:['Infração antecedente','Ocultação','Consequências'],16:['Contratação','Execução','Tipos penais'],17:['Garantias penais','Pessoa jurídica','Consolidação']};
 const norm=t=>String(t||'').replace(/\s+/g,' ').trim();
 function el(tag,cls,text){const x=document.createElement(tag);if(cls)x.className=cls;if(text!==undefined)x.textContent=text;return x;}
 function scheme(label,title,items){const s=el('section','penv-scheme');s.append(el('small','',label),el('h3','',title));const grid=el('div','penv-grid');items.forEach(([name,lines],i)=>{const card=el('div','penv-tile');card.append(el('span','',String(i+1).padStart(2,'0')),el('b','',name));lines.forEach(t=>card.append(el('p','',t)));grid.append(card)});s.append(grid);return s;}
 function normalizeOutline(article,n){
  const title=norm(g.PENAL_FULL_THEORY?.['p'+n]?.title).toLocaleLowerCase('pt-BR');
  const heads=[...article.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(x=>!x.closest('.bc-native-internal-review'));
  let chapter=0;
  heads.forEach(h=>{
   const text=norm(h.textContent),original=h.tagName;
   if(/^PEN\s*M\d+\s*[—–-]/i.test(text)||text.toLocaleLowerCase('pt-BR')===title){h.classList.add('penv-source-title');return;}
   const label=/^[^\p{L}\p{N}]*(?:TEORIA|LEI SECA|DECORE|EXEMPLOS?|PEGADINHA|CASO PR[ÁA]TICO|QUADRO|COMPARA[ÇC][ÃA]O|REGRA ATUAL|ALERTA HIST[ÓO]RICO)(?:\b|\s|[—:])/iu.test(text)&&!/^\d/.test(text);
   const numbered=/^\d+[.)]\s/.test(text)&&(['H1','H2'].includes(original)||n===2&&original==='H3');
   const main=numbered||[3,6].includes(n)&&original==='H3'&&!label||n===4&&original==='H2';
   const tag=label?'p':main?'h2':/^\d+\.\d+/.test(text)?'h3':original==='H4'&&!main?'h4':'h3';
   let node=h;if(h.tagName.toLowerCase()!==tag){node=el(tag);for(const attr of h.attributes)node.setAttribute(attr.name,attr.value);while(h.firstChild)node.append(h.firstChild);h.replaceWith(node);}
   node.classList.add(label?'penv-label':main?'penv-chapter':'penv-subsection');
   if(main){chapter++;if(!node.id)node.id='penv-m'+n+'-chapter-'+chapter;}
  });
  // The native index already contains chapter numbers in its labels.
  article.closest('.bc-native-reader-overlay')?.querySelectorAll('.bc-native-chapter-jump').forEach(button=>{
   const number=button.querySelector('span');if(number&&/^\d+[.]/.test(norm(button.textContent.slice(number.textContent.length))))number.hidden=true;
  });
 }
 function laws(article,n,theory){
  const data=g.PENAL_VISUAL_LAW,entries=data?.modules[n];if(!entries?.length)return;
  const intro=el('section','penv-law-library');intro.append(el('div','penv-law-title','Lei seca — redação literal'),el('p','','Consulte os dispositivos destacados após a explicação de cada assunto. O mesmo artigo reaparece em assuntos diferentes; os demais dispositivos estão no recorte complementar.'));
  const groups=new Map(),chapters=[...article.querySelectorAll('.penv-chapter')];
  function chapterOf(target){return chapters.filter(h=>h===target||Boolean(h.compareDocumentPosition(target)&Node.DOCUMENT_POSITION_FOLLOWING)).at(-1)||article;}
  entries.forEach(entry=>{
   const law=data.articles[entry.key];if(!law)return;
   const placed=new Set(),anchors=entry.anchors?.length?entry.anchors:[entry.anchor];
   anchors.forEach(anchor=>{
    let target=anchor?theory.find(x=>norm(x.textContent)===anchor):null;
    if(!target&&anchor)target=theory.find(x=>norm(x.textContent).startsWith(anchor));
    const scope=target?chapterOf(target):intro;if(placed.has(scope))return;
    if(target&&(/^H[1-6]$/.test(target.tagName)||target.classList.contains('penv-label'))){
     const first=theory.find(x=>!/^H/.test(x.tagName)&&!x.classList.contains('penv-label')&&!x.closest('.penv-source-title')&&chapterOf(x)===scope&&Boolean(target.compareDocumentPosition(x)&Node.DOCUMENT_POSITION_FOLLOWING));
     if(first)target=first;else target=null;
    }
    if(target)target=target.closest('table')||target.closest('ul,ol')||target.closest('blockquote,aside,.layer,.bc-native-callout')||target;
    if(target?.querySelector('.penv-chapter'))target=null;
    const host=target||intro;placed.add(scope);
    let group=groups.get(host);
    if(!group){group=el('section','penv-law-group');group.append(el('div','penv-law-label',target?'Lei seca do assunto':'Recorte legal complementar'));if(target)target.after(group);else intro.append(group);groups.set(host,group);}
    if(group.querySelector('[data-law-key="'+entry.key+'"]'))return;
    const box=el('details','penv-literal-law');box.open=Boolean(target);box.dataset.lawKey=entry.key;box.append(el('summary','',law.label+' · Lei seca'));
    const quote=el('blockquote');law.paragraphs.forEach(line=>quote.append(el('p','',line)));const link=el('a','','Consultar fonte oficial');link.href=law.officialUrl;link.target='_blank';link.rel='noopener noreferrer';box.append(quote,link);group.append(box);
   });
  });
  if(intro.querySelector('.penv-literal-law')){const fold=el('details','penv-law-fold');fold.append(el('summary','','Dispositivos complementares do módulo'));for(const group of [...intro.querySelectorAll('.penv-law-group')])fold.append(group);intro.append(fold);article.querySelector('.bc-native-internal-review')?.before(intro);if(!intro.parentElement)article.append(intro);}
 }
 function enhance(article,n){
  if(!article||article.classList.contains('penal-visual-preview')||!routes[n])return;
  normalizeOutline(article,n);
  const original=[...article.querySelectorAll('h1,h2,h3,h4,h5,h6,p,li,td,th,div')].filter(x=>!x.closest('.bc-native-internal-review,.bc-native-study-progress,.penv-source-title')&&!x.querySelector('p,li,table,div,h1,h2,h3,h4,h5,h6'));
  const eligible=x=>!x.closest('.bc-native-internal-review,.penv-scheme');
  const title=g.PENAL_FULL_THEORY?.['p'+n]?.title||'Direito Penal — Módulo '+n;
  article.classList.add('penal-visual-preview');article.dataset.penalVisualModule=n;
  const hero=el('section','penv-hero');hero.append(el('div','penv-eyebrow','BASE COMPLETA / DIREITO PENAL / M'+String(n).padStart(2,'0')),el('span','penv-edition','APOSTILA · TEORIA COMPLETA'),el('h1','',title),el('p','','Estude a teoria em profundidade e use os quadros visuais para organizar as diferenças e recuperar os pontos centrais.'));
  const route=el('div','penv-route');[...routes[n],'Fixação'].forEach((t,i)=>{const item=el('span');item.append(el('b','',String(i+1).padStart(2,'0')),document.createTextNode(t));route.append(item)});hero.append(route);article.prepend(hero);
  // Keep complete comparison cells and qualifications; never infer a legal rule.
  const table=[...article.querySelectorAll('table')].filter(eligible).find(t=>t.rows.length>=3&&t.rows.length<=6&&!t.querySelector('[colspan],[rowspan]')&&[...t.rows].every(r=>r.cells.length===t.rows[0].cells.length&&r.cells.length>=2&&r.cells.length<=4&&norm(r.textContent).length<1400));
  if(table){const rows=[...table.rows],labels=[...rows[0].cells].map(c=>norm(c.textContent));table.after(scheme('COMPARE OS PONTOS · QUADRO DO MATERIAL','Uma comparação para guardar',rows.slice(1).map(r=>{const c=[...r.cells].map(x=>norm(x.textContent));return[c[0],c.slice(1).map((v,i)=>labels[i+1]+': '+v)]})));}
  const list=[...article.querySelectorAll('ul,ol')].filter(eligible).find(x=>!x.querySelector('ul,ol')&&x.children.length>=2&&x.children.length<=4&&[...x.children].every(c=>norm(c.textContent).length>20&&norm(c.textContent).length<450));
  if(list)list.after(scheme('ORGANIZE A LEITURA · PONTOS DO MATERIAL','Observe estes pontos em conjunto',[...list.children].map((x,i)=>['Ponto '+(i+1),[norm(x.textContent)]])));
  const quiz=article.querySelector('.bc-native-internal-review');const review=scheme('ANTES DE RESPONDER','Recupere o caminho do módulo',routes[n].map(t=>[t,['Explique o tema com suas palavras e confira as regras, distinções e exceções na teoria.']]));if(quiz)quiz.before(review);else article.append(review);
  article.querySelectorAll('blockquote,aside,.layer,.bc-native-callout').forEach(x=>{if(x.closest('.penv-scheme,.bc-native-internal-review'))return;const label=x.querySelector('strong,b');if(label&&/LEI SECA|PEGADINHA|EXEMPLO|DOUTRINA|DECORE|JURISPRUDÊNCIA/i.test(label.textContent))x.classList.add('penv-callout')});
  laws(article,n,original);
 }
 g.PenalVisualPreview={enhance};
})(window);
