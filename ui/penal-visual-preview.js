/* Editorial presentation only: original theory, questions and progress are preserved. */
(function(g){
 'use strict';
 const routes={1:['Princípios','Interpretação','Conflito aparente'],2:['Lei no tempo','Lei no espaço','Aplicação'],3:['Fato típico','Conduta','Dolo e culpa'],4:['Ilicitude','Justificantes','Excesso'],5:['Culpabilidade','Imputabilidade','Teoria do erro'],6:['Autoria','Participação','Comunicabilidade'],7:['Penas','Dosimetria','Concurso de crimes'],8:['Ação penal','Punibilidade','Prescrição'],9:['Vida e integridade','Honra','Liberdade'],10:['Subtração','Fraude','Receptação'],11:['Moeda e papéis','Documentos','Outras falsidades'],12:['Liberdade sexual','Vulnerabilidade','Disposições gerais'],13:['Funcionário público','Particular','Administração da Justiça'],14:['Sujeitos','Finalidade específica','Condutas típicas'],15:['Infração antecedente','Ocultação','Consequências'],16:['Contratação','Execução','Tipos penais'],17:['Garantias penais','Pessoa jurídica','Consolidação']};
 const norm=t=>String(t||'').replace(/\s+/g,' ').trim();
 function el(tag,cls,text){const x=document.createElement(tag);if(cls)x.className=cls;if(text!==undefined)x.textContent=text;return x;}
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
    if(!group){group=el('section','penv-law-group');if(target)target.after(group);else intro.append(group);groups.set(host,group);}
    if(group.querySelector('[data-law-key="'+entry.key+'"]'))return;
    const box=el('details','penv-literal-law');box.open=Boolean(target);box.dataset.lawKey=entry.key;box.append(el('summary','','LEI SECA · '+law.label));
    const quote=el('blockquote');law.paragraphs.forEach(line=>quote.append(el('p','',line)));const link=el('a','','Consultar fonte oficial');link.href=law.officialUrl;link.target='_blank';link.rel='noopener noreferrer';box.append(quote,link);group.append(box);
   });
  });
  if(intro.querySelector('.penv-literal-law')){const fold=el('details','penv-law-fold');fold.append(el('summary','','Dispositivos complementares do módulo'));for(const group of [...intro.querySelectorAll('.penv-law-group')])fold.append(group);intro.append(fold);article.querySelector('.bc-native-internal-review')?.before(intro);if(!intro.parentElement)article.append(intro);}
 }
 function enhance(article,n){
  if(!article||article.classList.contains('penal-visual-preview')||!routes[n])return;
  normalizeOutline(article,n);
  const original=[...article.querySelectorAll('h1,h2,h3,h4,h5,h6,p,li,td,th,div')].filter(x=>!x.closest('.bc-native-internal-review,.bc-native-study-progress,.penv-source-title')&&!x.querySelector('p,li,table,div,h1,h2,h3,h4,h5,h6'));
  const title=g.PENAL_FULL_THEORY?.['p'+n]?.title||'Direito Penal — Módulo '+n;
  article.classList.add('penal-visual-preview');article.dataset.penalVisualModule=n;
  const hero=el('section','penv-hero');hero.append(el('div','penv-eyebrow','BASE COMPLETA / DIREITO PENAL / M'+String(n).padStart(2,'0')),el('h1','',title),el('p','penv-reading-route',routes[n].join(' · ')));article.prepend(hero);
  // Read continuously: retain the original tables, examples and final review.
  // Do not duplicate original comparisons or lists into additional cards.
  laws(article,n,original);
 }
 g.PenalVisualPreview={enhance};
})(window);
