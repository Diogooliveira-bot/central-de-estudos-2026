/* CPC reading presentation: preserves source theory and all study storage keys. */
(function(g){
'use strict';
const routes={
1:[['Fundamentos','Constituição, garantias e normas fundamentais orientam a interpretação.'],['Aplicação','Identifique espaço, tempo e integração das normas processuais.'],['Situação concreta','Relacione a regra, sua exceção e o efeito no processo.']],
2:[['Jurisdição','Função estatal, limites nacionais e cooperação.'],['Ação','Legitimidade, interesse e acesso à tutela jurisdicional.'],['Processo','Pressupostos e análise do mérito são planos distintos.']],
3:[['Critério','Matéria, pessoa, função, território e valor.'],['Juízo competente','Aplique o foro geral ou a regra especial.'],['Controle','Verifique prevenção, modificação e incompetência.']],
4:[['Sujeitos','Capacidade, representação e atuação dos procuradores.'],['Conduta','Deveres, responsabilidade e boa-fé no processo.'],['Custos','Despesas, honorários e gratuidade da justiça.']],
5:[['Pluralidade','Quem participa como parte e em qual posição.'],['Formação','Litisconsórcio necessário ou facultativo.'],['Intervenção','Escolha o instituto conforme o vínculo do terceiro.']],
6:[['Julgamento','Poderes, deveres, impedimento e suspeição do juiz.'],['Apoio','Auxiliares da justiça e suas atribuições.'],['Atuação institucional','MP, Advocacia Pública e Defensoria Pública.']],
7:[['Forma','Validade, publicidade e negócios processuais.'],['Prática','Tempo, lugar e meios eletrônicos.'],['Contagem','Termo inicial, dias úteis e hipóteses especiais.']],
8:[['Comunicação','Identifique citação, intimação ou carta.'],['Realização','Confira destinatário, meio e momento.'],['Validade','Examine finalidade, prejuízo e possibilidade de correção.']],
9:[['Fundamento','Urgência ou evidência.'],['Técnica','Tutela antecipada ou cautelar; pedido antecedente ou incidental.'],['Efeitos','Confira responsabilidade, estabilização e cessação.']],
10:[['Início','Propositura e requisitos da petição inicial.'],['Andamento','Suspensão e providências de regularização.'],['Encerramento','Distinga extinção sem mérito e resolução do mérito.']],
11:[['Defesa','Contestação, reconvenção e efeitos da revelia.'],['Organização','Questões pendentes, fatos e provas no saneamento.'],['Julgamento','Extinção, julgamento antecipado ou instrução.']],
12:[['Necessidade','Objeto, ônus e admissibilidade da prova.'],['Produção','Identifique o meio probatório e suas regras.'],['Valoração','Relacione a prova à fundamentação da decisão.']],
13:[['Decisão','Estrutura, limites e efeitos da sentença.'],['Estabilidade','Remessa necessária e coisa julgada.'],['Quantificação','Liquidação define o valor sem rediscutir o mérito.']],
14:[['Título judicial','Identifique a obrigação reconhecida.'],['Cumprimento','A técnica varia conforme a prestação e o devedor.'],['Defesa','Impugnação e limites da matéria discutida.']],
15:[['Admissibilidade','Cabimento, prazo e requisitos do recurso.'],['Julgamento','Efeitos, competência e resultado.'],['Precedentes','Distinga os regimes de repercussão geral, relevância e repetitivos.']],
16:[['Título','Certeza, liquidez e exigibilidade.'],['Prestação','Entregar, fazer, não fazer, pagar ou prestar alimentos.'],['Regime','Verifique as regras próprias do devedor e da obrigação.']],
17:[['Constrição','Responsabilidade patrimonial e penhora.'],['Satisfação','Avaliação e expropriação.'],['Defesa','Embargos e efeitos sobre a execução.']],
18:[['Pedido','Identifique a tutela específica buscada.'],['Procedimento','Confira legitimidade, requisitos e atos próprios.'],['Resultado','Relacione decisão, efeitos e impugnação cabível.']],
19:[['Direito protegido','Individual, coletivo, difuso ou individual homogêneo.'],['Instrumento','Escolha a ação constitucional ou coletiva adequada.'],['Regime','Confira legitimidade, procedimento e efeitos da decisão.']],
20:[['Instituto','Distinga IAC, IRDR, rescisória e reclamação.'],['Tramitação','Competência, requisitos, participação e julgamento.'],['Efeitos','Observe precedentes, alcance da decisão e meios de impugnação.']]
};
const norm=t=>String(t||'').replace(/\s+/g,' ').trim();
const number=t=>String(t).replace(/[ºo]/gi,'').replaceAll('.','').toUpperCase();
const lawNames={cpc:'CPC',cf:'Constituição Federal',cc:'Código Civil',lindb:'LINDB',arbitragem:'Lei 9.307/1996',popular:'Lei 4.717/1965',acp:'Lei 7.347/1985',cdc:'CDC',ms:'Lei 12.016/2009',mi:'Lei 13.300/2016',hd:'Lei 9.507/1997',adi:'Lei 9.868/1999',adpf:'Lei 9.882/1999',relevancia:'Lei 15.484/2026'};
const lawMarker=/\b(CPC(?:\s*(?:\/|de\s*)\s*1973)?|CF(?:\/\d+)?|Constituição(?: Federal)?|CC|Código Civil|LINDB|LACP|CDC|Lei\s*(?:n[ºo°.]?\s*)?(?:9[.]?307|4[.]?717|7[.]?347|12[.]?016|13[.]?300|9[.]?507|9[.]?868|9[.]?882|15[.]?484)(?:\/\d+)?)\b/gi;
function markerLaw(s){if(/1973/.test(s))return 'historical';if(/CPC/i.test(s))return 'cpc';if(/^(CF|Constitui)/i.test(s))return 'cf';if(/^(CC|Código Civil)$/i.test(s))return 'cc';if(/LINDB/i.test(s))return 'lindb';if(/LACP/i.test(s))return 'acp';if(/CDC/i.test(s))return 'cdc';const n=s.replace(/\D/g,'');for(const [k,v]of Object.entries({9307:'arbitragem',4717:'popular',7347:'acp',12016:'ms',13300:'mi',9507:'hd',9868:'adi',9882:'adpf',15484:'relevancia'}))if(n.startsWith(k))return v;return 'cpc';}
function sectionLaw(heading,n){if(n!==19)return 'cpc';if(/POPULAR/.test(heading))return 'popular';if(/CIVIL PÚBLICA|ASSOCIAÇÃO NA ACP|INQUÉRITO CIVIL/.test(heading))return 'acp';if(/DIREITOS (?:DIFUSOS|COLETIVOS|INDIVIDUAIS)|COISA JULGADA COLETIVA/.test(heading))return 'cdc';if(/SEGURANÇA|NO MS/.test(heading))return 'ms';if(/INJUNÇÃO/.test(heading))return 'mi';if(/HABEAS DATA|NO HD/.test(heading))return 'hd';if(/ADPF/.test(heading))return 'adpf';if(/ADI|ADC|ADO/.test(heading))return 'adi';if(/PLENÁRIO|VINCULANTE|CONTROLE INCIDENTAL/.test(heading))return 'cf';return 'cpc';}
function lawAt(text,index,end,heading,n){
 const suffix=text.slice(end,end+65),prefix=text.slice(0,index);
 const explicit=suffix.match(/^\s*(?:[,;:]?\s*)?(?:do|da|dos|das|no|na)\s+(CPC(?:\/1973)?|CF(?:\/\d+)?|Constituição(?: Federal)?|CC|Código Civil|LINDB|LACP|CDC|Lei\s*(?:n[ºo°.]?\s*)?[\d.]+(?:\/\d+)?)/i);
 if(explicit)return markerLaw(explicit[1]);
 const markers=[...prefix.matchAll(lawMarker)];if(markers.length){const law=markerLaw(markers.at(-1)[0]);return law==='relevancia'?'cpc':law;}
 if(/CPC[ /]*(?:de )?1973/.test(text))return 'historical';
 return sectionLaw(heading,n);
}
const N='\\d{1,4}(?:\\.\\d{3})?(?:-[A-Z])?';
function references(text,heading,n,registry){
 const out=[];const re=new RegExp('\\barts?\\.\\s*'+N+'[ºo]?(?:\\s*(?:(?:a|até|e|,|[-–])\\s*)'+N+'[ºo]?)*','gi');
 for(const match of text.matchAll(re)){
  const law=lawAt(text,match.index,match.index+match[0].length,heading,n);
  if(law==='historical')continue;
  const span=match[0].replace(/^arts?\.\s*/i,''),ns=[...span.matchAll(new RegExp(N,'gi'))];
  for(let i=0;i<ns.length;i++){
   const id=number(ns[i][0]);const code=(law==='cf'&&!registry['cf:'+id]&&registry['cpc:'+id])||n===20&&id==='97'?'cpc':law;const resolved=n===20&&id==='97'?'cf':code;const key=resolved+':'+id;out.push(key);
   if(i){const sep=span.slice(ns[i-1].index+ns[i-1][0].length,ns[i].index).replace(/[ºo]/g,'').trim();if(/^(?:a|até|-|–)$/i.test(sep)){
    const lo=number(ns[i-1][0]),hi=number(ns[i][0]);
    for(const candidate of Object.keys(registry)){const [code,a]=candidate.split(':');if(code===law&&a.localeCompare(lo,'en',{numeric:true})>=0&&a.localeCompare(hi,'en',{numeric:true})<=0)out.push(candidate);}
   }}
  }
 }
 for(const match of text.matchAll(/\b(CPC|CF|CC|LINDB)\s+(\d{1,4}(?:\.\d{3})?(?:-[A-Z])?)(?:\s*\/\s*(\d{1,4}(?:\.\d{3})?))?/gi)){
  const code=markerLaw(match[1]);for(const raw of [match[2],match[3]].filter(Boolean)){const id=number(raw);if((code==='cf'&&Number(id)>250)||Number(id)===1973||Number(id)>2200)continue;if(registry[code+':'+id])out.push(code+':'+id);}
 }
 return [...new Set(out)];
}
const special19={2:['cdc:81','acp:21'],3:['cdc:81'],4:['cdc:81'],5:['cdc:81'],6:['popular:1'],7:['popular:1','popular:6'],8:['popular:5','popular:6','popular:9','popular:21'],9:['popular:18','popular:19'],10:['acp:1'],11:['acp:5'],12:['acp:5'],13:['acp:5','acp:8','acp:9'],14:['acp:2','acp:16'],15:['cdc:103','cdc:104'],16:['cf:5'],17:['ms:1'],18:['ms:1','ms:5','ms:6'],19:['ms:7'],20:['ms:23','ms:25'],21:['ms:21','ms:22'],22:['mi:1','mi:2'],23:['mi:4','mi:5','mi:6','mi:7'],24:['mi:8','mi:9','mi:10','mi:11'],25:['mi:12','mi:13'],26:['hd:7'],27:['hd:8'],28:['cf:97'],29:['cf:97'],30:['cf:97'],31:['cf:103','adi:2','adi:13'],32:['cf:102'],33:['cf:102','adi:14'],34:['adi:5','adi:10','adi:22','adi:23'],35:['adi:27','adi:28'],36:['adpf:1','adpf:4'],37:['adpf:5','adpf:10','adpf:11'],38:['mi:2','adi:12-H']};
const comparisons={
3:['CRITÉRIOS DE COMPETÊNCIA',[['Critério','Regra predominante','Ponto decisivo'],['Matéria, pessoa e função','Absoluta','Não se modifica por convenção das partes.'],['Território e valor','Relativa, em regra','Confira as hipóteses especiais previstas em lei.']]],
5:['LITISCONSÓRCIO',[['Classificação','Pergunta principal','Critério'],['Necessário ou facultativo','Quem precisa participar?','Imposição legal ou natureza da relação jurídica.'],['Unitário ou simples','A decisão precisa ser uniforme?','Possibilidade de resultados diferentes para os litisconsortes.']]],
8:['CITAÇÃO',[['Ato','Função','Referência'],['Citação','Integrar réu, executado ou interessado à relação processual.','CPC, art. 238'],['Intimação','Dar ciência dos atos e termos do processo.','CPC, art. 269']]],
9:['TUTELA DE URGÊNCIA',[['Tutela','Pressuposto','Liminar'],['Urgência','Probabilidade do direito e perigo de dano ou risco ao resultado útil.','Pode ser concedida liminarmente ou após justificação prévia.'],['Evidência','Uma das hipóteses do art. 311; dispensa perigo de dano.','Somente nas hipóteses dos incisos II e III do art. 311.']]],
13:['COISA JULGADA',[['Plano','Estabilidade','Alcance'],['Formal','Imutabilidade dentro do processo.','Relaciona-se ao encerramento da discussão no mesmo processo.'],['Material','Imutabilidade da decisão de mérito nos termos legais.','Projeta efeitos para além do processo, observados seus limites.']]],
20:['IAC — CABIMENTO',[['Incidente','Pressuposto','Distinção'],['IAC','Questão relevante de direito, com grande repercussão social.','Sem repetição em múltiplos processos, nos termos do art. 947.'],['IRDR','Repetição efetiva de processos sobre a mesma questão unicamente de direito.','Risco à isonomia e à segurança jurídica, nos termos do art. 976.']]]
};
function comparison(article,n){const config=comparisons[n];if(!config)return;const d=article.ownerDocument,heading=[...article.querySelectorAll('h2,h3')].find(h=>h.textContent.toUpperCase().includes(config[0]));if(!heading)return;let anchor=heading;while(anchor.nextElementSibling&&!/^H[234]$/.test(anchor.nextElementSibling.tagName)&&!anchor.nextElementSibling.matches('details.cpc-law'))anchor=anchor.nextElementSibling;const holder=d.createElement('div');holder.className='cpc-comparison';holder.dataset.cpcVisual='comparison';holder.setAttribute('role','region');holder.setAttribute('aria-label','Comparação para revisão');holder.tabIndex=0;const table=d.createElement('table');for(let i=0;i<config[1].length;i++){const tr=d.createElement('tr');for(const text of config[1][i]){const cell=d.createElement(i?'td':'th');if(!i)cell.scope='col';cell.textContent=text;tr.append(cell);}table.append(tr);}holder.append(table);anchor.after(holder);}
function textSection(d,title,cls,route){const s=d.createElement('section');s.className=cls;const h=d.createElement('h2');h.textContent=title;s.append(h);const list=d.createElement(cls==='cpc-overview'?'div':'ol');list.className='cpc-route';for(const [name,explanation]of route){const item=d.createElement(cls==='cpc-overview'?'div':'li'),strong=d.createElement('strong'),p=d.createElement('p');strong.textContent=name;p.textContent=explanation;item.append(strong,p);list.append(item);}s.append(list);return s;}
function enhance(article,n,mode,registry){
 if(article.dataset.cpcApostila)return {missing:[]};const d=article.ownerDocument;article.dataset.cpcApostila=mode;article.classList.add('cpc-apostila');
 // Continuous prose keeps authored warnings and examples without surrounding cards.
 for(const aside of [...article.querySelectorAll('.bc-native-callout')]){const div=d.createElement('div');div.className='cpc-prose-note';while(aside.firstChild)div.append(aside.firstChild);aside.replaceWith(div);}
 for(const h of [...article.querySelectorAll('h2,h3,h4,.cpc-prose-note>b')])if(/^(?:Entenda|Na prática|Aprofundamento|Regra e fundamento|Revisão em 30 segundos)$/i.test(norm(h.textContent)))h.remove();
 // Paragraphs containing only duplicated cover matter are typographic debris.
 for(const p of [...article.querySelectorAll('p')]){const t=norm(p.textContent);if(/^(?:M\d{2}|BASE|COMPLETA|APOSTILA COMPLETA|A P O ST I L A C O M P L E TA|D I R E I TO P R O C E S S U A L C I V I L)$/.test(t))p.remove();}
 // Match the existing reader's cover cleanup without touching the first chapter.
 const prefix=[];for(let node=article.querySelector(':scope>h1')?.nextElementSibling||article.firstElementChild;node&&node.tagName!=='H2';node=node.nextElementSibling)if(!node.matches('.bc-native-kicker,.lead,.bc-native-study-progress'))prefix.push(node);
 if(/BASE COMPLETA|(?:\b\p{Lu} ){6,}/u.test(prefix.map(x=>x.textContent).join(' ')))prefix.forEach(x=>x.remove());
 for(const legacy of [...article.querySelectorAll('details.lei-seca')]){
  const label=legacy.querySelector('summary')?.textContent||'',codeMatch=label.match(/(?:CPC|CF(?:\/88)?|CC|LINDB|CDC|LACP|Lei\s+[\d.]+(?:\/\d+)?)/i),fallback=codeMatch?markerLaw(codeMatch[0]):'cpc';
  const keys=[];for(const p of legacy.querySelectorAll('p')){const m=norm(p.textContent).match(/^Art\.\s*([\d.]+(?:-[A-Z])?)/i);if(m){const id=number(m[1]);keys.push((registry[fallback+':'+id]?fallback:'cpc')+':'+id);}}
  const anchor=d.createElement('span');anchor.className='cpc-law-anchor';anchor.dataset.legacyKeys=JSON.stringify(keys);legacy.replaceWith(anchor);
 }
 const baseline=article.cloneNode(true);baseline.querySelectorAll('details.lei-seca').forEach(x=>x.remove());
 const blocks=[...article.children];let heading='',bucket=[],keys=new Set(),missing=[];const bodyBefore=norm(baseline.textContent);

 function flush(){if(!bucket.length)return;const valid=[...keys].filter(k=>{if(registry[k])return true;missing.push({key:k,heading});return false;});if(valid.length){const law=d.createElement('details');law.className='cpc-law';law.setAttribute('aria-label','Lei seca relacionada à explicação');const summary=d.createElement('summary');summary.textContent='Lei seca · '+valid.length+(valid.length===1?' artigo':' artigos');law.append(summary);for(const key of valid){const entry=registry[key],item=d.createElement('div');item.className='cpc-law-article';item.dataset.lawKey=key;const label=d.createElement('p');label.className='cpc-law-label';label.textContent=entry.label;item.append(label);for(const text of entry.paragraphs){const p=d.createElement('p');p.textContent=text;item.append(p);}const link=d.createElement('a');link.href=entry.url;link.target='_blank';link.rel='noopener noreferrer';link.textContent='Fonte oficial';item.append(link);law.append(item);}bucket.at(-1).after(law);}bucket=[];keys=new Set();}
 for(const block of blocks){
  if(/^H[234]$/.test(block.tagName)){flush();heading=norm(block.textContent).toUpperCase();}
  bucket.push(block);
  const elements=block.matches('p,li,td,th,h2,h3,h4')?[block]:[...block.querySelectorAll('p,li,td,th')].filter(x=>!x.querySelector('p,li,table'));
  for(const el of elements)for(const k of references(norm(el.textContent),heading,n,registry))keys.add(k);
  const anchors=block.matches('.cpc-law-anchor')?[block]:[...block.querySelectorAll('.cpc-law-anchor')];for(const anchor of anchors)for(const key of JSON.parse(anchor.dataset.legacyKeys))keys.add(key);
  const index=Number(heading.match(/^(\d+)\./)?.[1]);if(n===19&&mode==='complete')for(const key of special19[index]||[])keys.add(key);
 }
 flush();
 article.querySelectorAll('.cpc-law-anchor').forEach(x=>x.remove());
 comparison(article,n);
 const route=routes[n];article.prepend(textSection(d,'Visão do módulo','cpc-overview',route));article.append(textSection(d,'Síntese para revisar','cpc-synthesis',route));
 return {missing,bodyBefore};
}

/* Revisão explicada M09–M20: a apresentação é aditiva. O índice, o texto original,
   as questões e a teoria completa permanecem intocados. */
const didacticPending=new Map();
async function didactic(n){
 if(n<1||n>20)return null;
 if(g.CPC_DIDACTIC_REVIEW?.[n])return g.CPC_DIDACTIC_REVIEW[n];
 const group=n<=4?'m01-m04':n<=8?'m05-m08':n<=14?'m09-m14':'m15-m20';
 if(!didacticPending.has(group)){
  const task=new Promise((resolve,reject)=>{
   const script=document.createElement('script');
   script.src='/content/cpc/cpc-review-didactic-'+group+'.js?v=20261110cpcraciocinio1';
   script.onload=()=>{script.remove();resolve();};
   script.onerror=()=>{script.remove();reject(new Error('Não foi possível carregar a revisão didática do CPC'));};
   document.head.append(script);
  }).catch(error=>{didacticPending.delete(group);throw error;});
  didacticPending.set(group,task);
 }
 await didacticPending.get(group);
 const result=g.CPC_DIDACTIC_REVIEW?.[n];
 if(!result||!Array.isArray(result.sections)||!result.sections.length)
  throw new Error('Revisão explicada do CPC M'+n+' indisponível');
 return result;
}
function insertDidactic(host,n,data){
 const d=host.ownerDocument,part=d.createElement('section');
 part.className='cpc-didactic-review cpc-learning-path cpc-reasoning-path';
 part.dataset.cpcReview=String(n);
 const eyebrow=d.createElement('p');eyebrow.className='cpc-study-eyebrow';eyebrow.textContent='PRIMEIRA LEITURA · MÓDULO '+String(n).padStart(2,'0');part.append(eyebrow);
 const heading=d.createElement('h2');heading.textContent='Entenda o assunto a partir de um caso';part.append(heading);
 const story=data.story,hasStory=!!(story&&Array.isArray(story.steps)&&story.steps.length);
 const lead=d.createElement('p');lead.className='cpc-didactic-lead';
 lead.textContent=hasStory?story.case:data.intro;part.append(lead);
 const guide=d.createElement('p');guide.className='cpc-study-instruction';
 guide.textContent=hasStory?'Acompanhe o raciocínio. Cada etapa explica por que a próxima é necessária.':'Leia uma etapa por vez. Abra a próxima quando terminar.';
 part.append(guide);
 const stages=d.createElement('div');stages.className='cpc-study-stages';
 const lesson=hasStory?story.steps:data.sections;
 for(let i=0;i<lesson.length;i++){
  const [title,paragraphs,exampleOrQuestion,answer]=lesson[i];
  const step=d.createElement('details');step.className='cpc-study-step';step.dataset.step=String(i+1);if(i===0)step.open=true;
  const label=d.createElement('summary'),number=d.createElement('span'),name=d.createElement('strong');
  number.className='cpc-study-number';number.textContent=String(i+1).padStart(2,'0');
  name.textContent=title;label.append(number,name);step.append(label);
  const body=d.createElement('div');body.className='cpc-study-step-body';
  for(const txt of paragraphs||[]){const p=d.createElement('p');p.textContent=txt;body.append(p);}
  if(hasStory){
   const question=d.createElement('p');question.className='cpc-think-question';question.textContent=exampleOrQuestion;body.append(question);
   const check=d.createElement('details');check.className='cpc-think-check';
   const chkSummary=d.createElement('summary');chkSummary.textContent='Conferir o raciocínio';check.append(chkSummary);
   const response=d.createElement('p');response.textContent=answer;check.append(response);body.append(check);
  }else if(exampleOrQuestion){
   const ex=d.createElement('p'),strong=d.createElement('strong');ex.className='cpc-didactic-example';
   strong.textContent='Exemplo: ';ex.append(strong,d.createTextNode(String(exampleOrQuestion).replace(/^Exemplo:\s*/i,'')));body.append(ex);
  }
  const done=d.createElement('button');done.type='button';done.className='cpc-study-done';done.dataset.cpcStepDone=String(i);done.textContent='Concluir esta etapa';body.append(done);
  step.append(body);stages.append(step);
 }
 part.append(stages);
 if(hasStory&&story.conclusion){
  const close=d.createElement('p');close.className='cpc-reasoning-conclusion';
  const title=d.createElement('strong');title.textContent='O raciocínio que você construiu: ';
  close.append(title,d.createTextNode(story.conclusion));part.append(close);
 }
 const recall=d.createElement('details');recall.className='cpc-study-recall';
 const summary=d.createElement('summary');summary.textContent='Agora, o que memorizar';recall.append(summary);
 const list=d.createElement('ul');list.className='cpc-didactic-memory';
 for(const txt of data.remember||[]){const item=d.createElement('li');item.textContent=txt;list.append(item);}
 recall.append(list);part.append(recall);
 if(data.laws?.length){
  const sources=d.createElement('details');sources.className='cpc-didactic-sources';
  const sum=d.createElement('summary');sum.textContent='Consultar legislação';sources.append(sum);
  const links=d.createElement('ul');
  for(const [name,url] of data.laws){if(!/^https:\/\//.test(url))continue;const li=d.createElement('li'),a=d.createElement('a');a.href=url;a.target='_blank';a.rel='noopener noreferrer';a.textContent=name;li.append(a);links.append(li);}
  sources.append(links);part.append(sources);
 }
 const original=d.createElement('details');original.className='cpc-original-reference';
 const originalLabel=d.createElement('summary');originalLabel.textContent='Consulta avançada: resumo original e artigos';
 const originalBody=d.createElement('div');originalBody.className='cpc-original-body';
 while(host.firstChild)originalBody.append(host.firstChild);
 original.append(originalLabel,originalBody);host.append(part,original);
 return host;
}
let pending;
async function laws(){if(!pending)pending=(async()=>{if(!g.CPC_READING_LAWS_B64)await import('/content/cpc/cpc-reading-laws-v1.js?v=20261107cpc2');const bytes=Uint8Array.from(atob(g.CPC_READING_LAWS_B64),c=>c.charCodeAt(0));return JSON.parse(await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).text());})().catch(e=>{pending=null;throw e});return pending;}
function styles(){if(document.getElementById('cpc-apostila-style'))return;const link=document.createElement('link');link.id='cpc-apostila-style';link.rel='stylesheet';link.href='/ui/cpc-apostila-reading-v1.css?v=20261110cpcraciocinio1';document.head.append(link);}
g.CpcApostilaReading=Object.freeze({references,enhance,routes,lawNames,async transform(html,n,mode){styles();const registry=await laws(),review=mode==='summary'?await didactic(n):null,template=document.createElement('template');template.innerHTML=html;const host=document.createElement('article');host.append(template.content);enhance(host,n,mode,registry);if(review)insertDidactic(host,n,review);return '<div class="cpc-apostila" data-cpc-apostila="'+mode+'">'+host.innerHTML+'</div>';}});

// O cabeçalho dos leitores calcula a duração antes da transformação editorial.
// Atualizamos apenas o número exibido, sem tocar na progressão salva.
if(typeof MutationObserver!=='undefined'&&document.body){
 const updateReadingTime=()=>{
  for(const overlay of document.querySelectorAll('.bc-native-reader-overlay')){
   const guided=overlay.querySelector('.cpc-learning-path');
   if(guided&&!overlay.dataset.cpcGuidedBound){
    overlay.dataset.cpcGuidedBound='1';
    const steps=[...guided.querySelectorAll('.cpc-study-step')];
    const checks=[...overlay.querySelectorAll('[data-cpc-chapter-check]')];
    const segment=i=>checks.slice(Math.floor(i*checks.length/steps.length),Math.floor((i+1)*checks.length/steps.length));
    const refreshButtons=()=>steps.forEach((step,i)=>{
     const button=step.querySelector('[data-cpc-step-done]');
     if(button){const done=segment(i).length>0&&segment(i).every(x=>x.classList.contains('done'));button.textContent=done?'Etapa concluída ✓':'Concluir esta etapa';button.classList.toggle('done',done);}
    });
    guided.addEventListener('click',event=>{
     const button=event.target.closest('[data-cpc-step-done]');
     if(!button)return;
     const i=Number(button.dataset.cpcStepDone);
     for(const check of segment(i))if(!check.classList.contains('done'))check.click();
     refreshButtons();
     if(i+1<steps.length){
      steps[i].open=false;steps[i+1].open=true;
      steps[i+1].scrollIntoView?.({behavior:'smooth',block:'nearest'});
     }else guided.querySelector('.cpc-study-recall')?.setAttribute('open','');
    });
    refreshButtons();
   }
   if(overlay.dataset.cpcDidacticTiming)return;
   const didactic=overlay.querySelector('.cpc-didactic-review'),meta=overlay.querySelector('.bc-native-reader-meta'),article=overlay.querySelector('.bc-native-article');
   if(!didactic||!meta||!article)continue;
   const count=didactic.textContent.trim().split(/\s+/).filter(Boolean).length;
   meta.textContent=count.toLocaleString('pt-BR')+' palavras • ~'+Math.max(1,Math.ceil(count/210))+' min';
   overlay.dataset.cpcDidacticTiming='1';
  }
 };
 const listener=new MutationObserver(updateReadingTime);
 listener.observe(document.body,{childList:true});
}
})(window);
