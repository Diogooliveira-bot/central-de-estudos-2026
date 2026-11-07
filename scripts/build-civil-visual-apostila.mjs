// Build the approved Civil reading presentation without changing the source corpus,
// quiz banks, summaries, progress keys, or student data.
// Usage: node scripts/build-civil-visual-apostila.mjs <official-source-directory> <preview-directory>
import fs from 'node:fs';
import vm from 'node:vm';
import zlib from 'node:zlib';
import crypto from 'node:crypto';
import path from 'node:path';
import { JSDOM } from 'jsdom';
const sources=path.resolve(process.argv[2]||'../civil-preview/sources');
const output=path.resolve(process.argv[3]||'../civil-preview/dist');
fs.mkdirSync(output,{recursive:true});
const source={};vm.runInNewContext(fs.readFileSync('content/civil/civil-native-content-packed.js','utf8'),{window:source});
const originals=JSON.parse(zlib.gunzipSync(Buffer.from(source.CIVIL_NATIVE_PACKED_B64,'base64')));
const approved=new JSDOM(fs.readFileSync(path.join(output,'Previa_Direito_Civil_M04.html'),'utf8')).window.document;
const baseCSS=approved.querySelector('style').textContent;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const normalize=s=>s.replace(/\s+/g,' ').trim();
const num=s=>String(s).replace(/º|\.$/g,'').replaceAll('.','').toUpperCase();
const R=(a,b)=>Array.from({length:b-a+1},(_,i)=>String(a+i));
const E=(law,...ns)=>ns.flat().map(n=>law+':'+n);
const C=(...ns)=>E('cc',...ns);
const urls=JSON.parse(fs.readFileSync(path.join(sources,'urls.json')));
const registry={};
const vade=JSON.parse(fs.readFileSync(path.join(sources,'vade.json')));
for(const law of ['cc','cf','cpc'])for(const a of vade[law].articles){
 const n=num(a.label.replace(/^Art\.\s*/,''));registry[law+':'+n]={label:(law==='cf'?'CF/88':law.toUpperCase())+' · '+a.label,paragraphs:a.paragraphs,officialUrl:law==='cc'?'https://www2.camara.leg.br/legin/fed/lei/2002/lei-10406-10-janeiro-2002-432893-normaatualizada-pl.html':vade[law].law.officialUrl};
}
function parseOfficial(file,law,label,url){
 const dom=new JSDOM(fs.readFileSync(file,'utf8')),d=dom.window.document;let current=null;const articles={};
 d.querySelectorAll('s,strike,del').forEach(n=>n.remove());
 let paragraphs=[...d.querySelectorAll('p')];
 if(law==='seguro'){
  const root=d.querySelector('.texto');
  root.querySelectorAll('br').forEach(x=>x.replaceWith(d.createTextNode('\n')));
  root.querySelectorAll('center').forEach(x=>x.append(d.createTextNode('\n')));
  paragraphs=root.textContent.split('\n').map(textContent=>({textContent}));
 }
 for(const p of paragraphs){
  let t=normalize(p.textContent);if(!t)continue;
  const m=t.match(/^Art\.\s*(\d[\d.]*)(?:[ºo])?(?:-([A-Z]))?\.?\s/);
  if(m){const key=num(m[1])+(m[2]?'-'+m[2]:'');current=articles[key]?null:key;if(current)articles[current]=[];}
  if(/^(?:CAPÍTULO|TÍTULO|LIVRO|Seção|Subseção)\b/.test(t)){current=null;continue;}
  if(current){t=t.replace(/\s*\((?:Artigo|Inciso|Parágrafo|“Caput”|Caput|Alínea|Redação|Vide|Vigência)[^)]*\)/g,'').trim();if(t)articles[current].push(t);}
 }
 for(const [n,paragraphs]of Object.entries(articles))registry[law+':'+n]={label:label+' · Art. '+n,paragraphs,officialUrl:url};
 dom.window.close();return Object.keys(articles).length;
}
parseOfficial(path.join(sources,'cc.html'),'cc','CC','https://www2.camara.leg.br/legin/fed/lei/2002/lei-10406-10-janeiro-2002-432893-normaatualizada-pl.html');
for(const [law,label]of [['lbi','Lei 13.146/2015'],['seguro','Lei 15.040/2024'],['arbitragem','Lei 9.307/1996'],['bemfamilia','Lei 8.009/1990']])parseOfficial(path.join(sources,'civil-law-'+law+'.html'),law,label,urls[law]);
// Every range here corresponds to the subject actually explained in that section.
const maps={
 1:{1:C(1,2),2:C(2,542),3:C(1,3,4),4:C(3,4),5:[...E('lbi',6,84,85),...C('1783-A')],6:C(5),7:C(6,7),8:C(8),9:C(11,12),10:C(13,14,15),11:C(16,17,18,19),12:C(20,21),13:C(12,20),14:C(22,26,37,38),15:C(R(22,25)),16:C(R(26,36)),17:C(37,38,39)},
 2:{1:C(40,'49-A'),2:C(R(40,44)),3:C(45,46,47,48,'48-A',49),4:C(R(53,61)),5:C(R(62,69)),6:C(44),7:[...C(43,52),...E('cf',37)],8:C('49-A',50),9:C(51,61,69),10:C(R(70,74)),11:C(76),12:C(75),13:[...C(78),...E('cpc',63)]},
 3:{2:C(R(79,81)),3:C(R(82,84)),4:C(85),5:C(86),6:C(87,88),7:C(89,90,91),8:C(92),9:C(95),10:C(93,94),11:C(96,97),12:[...C(R(98,103)),...E('cf',183,191)]},
 5:{1:C(189),2:C(R(190,196)),3:C(R(197,204)),4:C(205,206,'206-A'),5:C(R(207,211)),6:C(212),7:C(213,214),8:C(R(215,226)),9:C(R(227,232))},
 6:{1:C(233),2:C(882),3:C(R(233,246)),4:C(R(247,251)),5:C(R(252,256)),6:C(R(257,285)),7:C(R(286,303)),8:C(R(304,333)),9:C(R(334,388)),10:C(R(389,405)),11:C(389,395,404,406,407),12:C(R(408,416)),13:C(R(417,420)),14:C(R(854,886)),15:C(R(955,965))},
 7:{1:C(421),2:C('421-A'),3:C(422),4:C(R(427,435)),5:C(113,423,424,425,426),6:C(R(436,438)),7:C(439,440),8:C(R(467,471)),9:C(R(441,446)),10:C(R(447,457)),11:C(R(472,477)),12:C(317,478,479,480)},
 8:{1:C(R(481,532)),2:C(533),3:C(R(534,537)),4:C(R(538,564)),5:C(R(565,578)),6:C(R(579,592)),7:C(R(593,609)),8:C(R(610,626)),9:C(R(627,652)),10:C(R(653,692)),11:C(R(693,709)),12:C(R(710,721)),13:C(R(722,729)),14:C(R(730,756)),15:E('seguro',1,2,4,5,13,14,15,16,20,21,49,54,57,58,59,60,66,67,68,69,70,71,72,86,87,88,116,126,127,128,133,134),16:C(R(803,813)),17:C(R(814,817)),18:C(R(818,839)),19:C(R(840,850)),20:[...C(R(851,853)),...E('arbitragem',1,2,3,4,9)]},
 9:{1:C(186,187,188,929,930),2:C(186,927),3:C(186,927),4:C(402,403,944),5:C(393,945),6:C(928,932,933,934),7:C(936,937,938),8:C(942,943,939,940,941),9:C(944,945,946),10:C(R(947,951)),11:C(389,395,397,398,927)},
 10:{1:C(887,888,889,890,903),2:C(966,967,970,971),3:C(967,968,969,985,986),4:C(R(1142,1149)),5:C(R(1169,1178),1179,1180,1181,1194,1195),6:C(981,982,983,985,986,991,997),7:C(1052,1053,1054,1060,1061,1071,1076,1078),8:C(1033,1034,1035,1087,1102,1113,1116,1119),9:C(R(1155,1168))},
 11:{1:C(1196,1228),2:C(1196),3:C(1198,1208),4:C(1197,1199,1200,1201,1202,1203),5:C(R(1204,1209),1223,1224),6:C(1198,1203,1208),7:C(R(1214,1216)),8:C(1217,1218),9:C(1219,1220,1221,1222),10:C(1210,1211,1212,1213),11:E('cpc',R(554,568)),12:[...C(98,99,100,101,102),...E('cf',183,191)]},
 12:{1:C(1228),2:C(R(1233,1237)),3:C(R(1238,1259)),4:C(R(1260,1274)),5:C(1275,1276),6:C(R(1277,1313)),7:C(R(1314,1330)),8:C(R(1331,1358)),9:C('1358-A'),10:C(['1358-B','1358-C','1358-D','1358-E','1358-F','1358-G','1358-H','1358-I','1358-J','1358-K','1358-L','1358-M','1358-N','1358-O','1358-P','1358-Q','1358-R','1358-S','1358-T','1358-U']),11:C(1359,1360),12:C(R(1361,1368))},
 13:{1:C(R(1369,1377)),2:C(R(1378,1389)),3:C(R(1390,1411)),4:C(R(1412,1416)),5:C(1417,1418),7:C(R(1419,1430)),8:C(R(1431,1472)),9:C(R(1473,1505)),10:C(R(1506,1510)),11:C('1510-A','1510-B','1510-C','1510-D','1510-E')},
 14:{1:C(R(1517,1524)),2:C(1525,1533,1534,1535,1543,1548,1550,1561),3:C(1565,1566,1639,1640,1641,1655,1658,1667,1672,1687),4:C(1641,1639),5:[...C(1571,1581),...E('cf',226)],6:C(R(1591,1597),1609,1610,1614),7:C(R(1630,1638)),8:C(R(1723,1727)),9:C(R(1694,1710)),10:[...C(R(1711,1722)),...E('bemfamilia',R(1,5))],11:[...C(1728,1767,1774,1775),...E('lbi',6,84,85)],12:C('1783-A')},
 15:{1:C(R(1784,1791)),2:C(R(1798,1803)),3:C(R(1804,1813)),4:C(R(1814,1818),R(1961,1965)),5:C(R(1819,1823)),6:C(R(1824,1828)),7:C(R(1829,1844)),8:C(R(1845,1850)),9:C(R(1851,1856)),10:C(R(1857,1861)),11:C(R(1862,1896)),12:C(R(1881,1885)),13:C(R(1897,1946)),14:C(R(1947,1960)),15:C(R(1967,1975)),16:C(R(1976,1990)),17:C(R(1991,2027))}
};
const routes={
 1:[['Personalidade','Início e proteção dos direitos da pessoa.'],['Capacidade','Exercício dos atos e mecanismos de apoio.'],['Ausência','Proteção patrimonial e sucessão.']],
 2:[['Constituição','Registro, organização e atuação da pessoa jurídica.'],['Patrimônio','Autonomia e hipóteses de desconsideração.'],['Domicílio','Critérios de localização jurídica.']],
 3:[['Em si mesmos','Mobilidade, fungibilidade, consumo e divisão.'],['Entre si','Principal, acessório, pertenças e benfeitorias.'],['Titularidade','Regime dos bens públicos e particulares.']],
 4:[['Existência','Elementos que formam o negócio.'],['Validade','Capacidade, objeto, forma e defeitos.'],['Eficácia','Condição, termo e produção dos efeitos.']],
 5:[['Prescrição','Pretensão, termo inicial e causas de alteração.'],['Decadência','Direito potestativo e prazo de exercício.'],['Prova','Meios admitidos e seus limites.']],
 6:[['Prestação','Dar, fazer e não fazer; sujeitos e objeto.'],['Cumprimento','Pagamento, transmissão e extinção.'],['Inadimplemento','Mora, perdas e danos e garantias.']],
 7:[['Formação','Proposta, aceitação e princípios.'],['Efeitos','Garantias e posições das partes.'],['Extinção','Resolução, resilição e revisão.']],
 8:[['Tipo contratual','Identifique a função do contrato.'],['Regras próprias','Confira obrigações, riscos e garantias.'],['Regime aplicável','Distinga Código Civil e legislação especial.']],
 9:[['Conduta','Ato ilícito, abuso e regime aplicável.'],['Dano e nexo','Demonstração do prejuízo e vínculo causal.'],['Reparação','Responsáveis, extensão e critérios.']],
 10:[['Atividade','Empresário, registro e estabelecimento.'],['Organização','Sociedades, administração e patrimônio.'],['Identificação','Nome empresarial e proteção.']],
 11:[['Situação possessória','Posse, detenção e classificações.'],['Efeitos','Frutos, benfeitorias e responsabilidade.'],['Proteção','Autotutela e tutela judicial.']],
 12:[['Propriedade','Conteúdo, aquisição e perda.'],['Convivência','Vizinhança e regimes de condomínio.'],['Regimes próprios','Multipropriedade e propriedade fiduciária.']],
 13:[['Fruição','Superfície, servidões, usufruto, uso e habitação.'],['Aquisição','Promessa de compra e direitos correlatos.'],['Garantia','Penhor, hipoteca e anticrese.']],
 14:[['Vínculos','Casamento, união estável e parentesco.'],['Efeitos','Regimes patrimoniais e alimentos.'],['Proteção','Poder familiar, tutela, curatela e apoio.']],
 15:[['Abertura','Transmissão e vocação hereditária.'],['Destinação','Sucessão legítima e testamentária.'],['Partilha','Inventário, dívidas e colação.']]
};
const joins={1:{'2.4':'Deficiência'},2:{'2.3':'administração','2.6':'de economia solidária','2.7':'jurídica'},7:{'2.4':'aceitação'},8:{'5.':'imóveis urbanos','20.':'9.307/1996'},14:{'2.1':'CAUSAS SUSPENSIVAS','2.2':'CASAMENTO PUTATIVO','2.3':'BENS','2.4':'ATUALIZAÇÃO OBRIGATÓRIA','2.6':'FILHOS','2.8':'PATRIMONIAL','2.9':'MAIORIDADE','2.11':'DEFICIÊNCIA'}};
function fixHeadings(article,n){
 for(const h of article.querySelectorAll('h1,h2,h3,h4')){
  const t=normalize(h.textContent),code=t.match(/^(2\.\d+|\d+\.)/)?.[1],join=joins[n]?.[code];
  if(join&&!t.endsWith(join)){
   const next=h.nextElementSibling;
   if(next&&normalize(next.textContent).startsWith(join)){
    h.textContent=t+' '+join;
    const walker=article.ownerDocument.createTreeWalker(next,4);let left=join;
    while(walker.nextNode()&&left){const x=walker.currentNode,clean=x.nodeValue.trimStart();if(clean.startsWith(left)){x.nodeValue=clean.slice(left.length).trimStart();left='';}else if(left.startsWith(clean)){left=left.slice(clean.length);x.nodeValue='';}}
    if(!normalize(next.textContent))next.remove();
   }
  }
  const tt=normalize(h.textContent);
  if(/^2\.\d/.test(tt))h.outerHTML='<h3>'+esc(tt)+'</h3>';
 }
}
let serial=0;
function lawBlock(keys){
 const unique=[...new Set(keys)];if(!unique.length)return '';
 return '<aside class="law" aria-label="Lei seca relacionada à explicação"><div class="law-label">LEI SECA</div>'+unique.map(key=>{
  const law=registry[key];if(!law?.paragraphs?.length)throw Error('Dispositivo ausente: '+key);
  return '<div class="law-article" data-law-key="'+key+'" id="cv-law-'+(++serial)+'"><div class="law-source">'+esc(law.label)+'</div>'+law.paragraphs.map(t=>'<p>'+esc(t)+'</p>').join('')+'<a class="law-official" href="'+esc(law.officialUrl||'https://www.planalto.gov.br')+'" target="_blank" rel="noopener noreferrer">Fonte oficial</a></div>';
 }).join('')+'</aside>';
}
const modules={},audit=[];
for(let n=1;n<=15;n++){
 const m=originals['civil-m'+String(n).padStart(2,'0')],dom=new JSDOM(m.completeHtml,{runScripts:'outside-only',url:'https://preview.local/'}),w=dom.window,d=w.document;
 let article=d.querySelector('article');
 if(n===3){article.classList.add('bc-native-article');w.eval(fs.readFileSync('ui/civil-bens-apostila-v1.js','utf8'));w.CivilBensApostila.enhance(d.body,'complete');}
 for(const f of ['ui/universal-reader-v1.js','ui/editorial-reading-v2.js'])w.eval(fs.readFileSync(f,'utf8'));
 for(let i=0;i<4;i++){w.CentralUniversalReader.enhance(article);w.CentralEditorialReading.process(article);}
 article.querySelectorAll('[hidden]').forEach(x=>x.remove());
 article.querySelectorAll('.bc-term').forEach(x=>x.replaceWith(d.createTextNode(x.textContent)));
 fixHeadings(article,n);
 for(const h of [...article.querySelectorAll('h1,h2,h3,h4')]){
  const text=normalize(h.textContent);
  if(!/^\d{1,2}\.(?:\d+(?:\.\d+)*\.?\s|\s)/.test(text)){
   const p=d.createElement('p');p.className=text.length<85?'civil-source-callout-title':'';p.textContent=text;h.replaceWith(p);
  }
 }
 // Correct hierarchy in the contracts module: the 20 species belong to chapter 2.
 if(n===8){let inside=false;for(const h of [...article.querySelectorAll('h2,h3')]){if(/^2\. TEORIA/.test(h.textContent)){inside=true;continue;}if(/^3\. LEI SECA/.test(h.textContent)){inside=false;continue;}if(inside&&/^\d+\.\s/.test(h.textContent))h.outerHTML='<h3>2.'+esc(h.textContent.replace(/^(\d+)\.\s/,'$1 '))+'</h3>';}}
 const before=normalize(article.textContent);
 for(const h of [...article.querySelectorAll('h2,h3')]){
  let match=normalize(h.textContent).match(/^2\.(\d+)(?:\.|\s)/);if(!match)continue;
  // Parent 2.4 of Posse is expanded by its own 2.4.x subsections, not repeated here.
  if(/^2\.\d+\.\d+/.test(h.textContent))continue;
  const index=+match[1],keys=maps[n]?.[index]||[];let last=h,next=h.nextElementSibling;
  while(next&&!/^H[123]$/.test(next.tagName)){last=next;next=next.nextElementSibling;}
  if(keys.length)last.insertAdjacentHTML('afterend',lawBlock(keys));
 }
 // M04 uses the exact content/layout approved by the owner, without rebuilding it.
 if(n===4){article.replaceWith(d.importNode(approved.querySelector('article'),true));article=d.querySelector('article');}
 else{
  const route=routes[n];const overview=d.createElement('section');overview.className='overview';overview.innerHTML='<p class="eyebrow">ANTES DA TEORIA</p><h2>Visão do módulo</h2><div class="planes">'+route.map((r,i)=>'<div><span>0'+(i+1)+'</span><h3>'+esc(r[0])+'</h3><p>'+esc(r[1])+'</p></div>').join('')+'</div>';
  article.prepend(overview);
  const synthesis=d.createElement('section');synthesis.className='synthesis';synthesis.innerHTML='<p class="eyebrow">SÍNTESE VISUAL</p><h2>Recupere a estrutura do assunto</h2><ol>'+route.map(r=>'<li><strong>'+esc(r[0])+'</strong><span>'+esc(r[1])+'</span></li>').join('')+'</ol>';article.append(synthesis);
 }
 article.classList.add('cv-apostila');article.dataset.civilVisualModule=n;
 const walker=d.createTreeWalker(article,w.NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
 for(const x of nodes){if(x.parentElement.closest('.law'))continue;x.nodeValue=x.nodeValue.replace(/A doutrina fornecida organiza/g,'A doutrina organiza').replace(/As obras doutrinárias fornecidas/g,'As obras doutrinárias').replace(/das edições doutrinárias fornecidas/g,'das edições doutrinárias anteriores').replace(/Teoria Completa\s*•\s*Atualizado em 04\/10\/2026/g,'');}
 // Headings in examples/steps are prose labels, not additional chapters.
 for(const h of [...article.querySelectorAll('h2,h3')])if(/^\d+\)\s/.test(h.textContent.trim())){const p=d.createElement('p');p.innerHTML='<strong>'+esc(h.textContent.trim())+'</strong>';h.replaceWith(p);}
 let i=0;for(const h of article.querySelectorAll('h2,h3'))h.id='cv-m'+n+'-h'+(++i);
 modules[n]={title:m.title,html:article.outerHTML};
 audit.push({module:n,title:m.title,sourceHash:crypto.createHash('sha256').update(m.completeHtml).digest('hex'),sourceWords:before.split(' ').length,headings:i,lawBlocks:article.querySelectorAll('.law').length,lawArticles:article.querySelectorAll('.law-article').length,tables:article.querySelectorAll('table').length,remainingPre:article.querySelectorAll('pre').length});
 dom.window.close();
}
const packed=zlib.gzipSync(JSON.stringify(modules),{level:9}).toString('base64');
fs.writeFileSync('content/civil/civil-visual-apostila-packed.js','/* Approved Civil presentation; source corpus remains unchanged. */\nwindow.CIVIL_APOSTILA_PACKED_B64='+JSON.stringify(packed)+';\n');
// The embedded standalone file has no accounts, APIs or student information.
const css=baseCSS+'\nselect{font:inherit;font-size:13px;border:1px solid var(--line);padding:7px;max-width:360px;color:var(--navy);background:#fff}.law-source{font-size:12px;font-weight:700;color:var(--blue);margin-bottom:8px}.law-official{font-size:11px;color:var(--muted)}.cv-apostila h3{scroll-margin-top:90px}.hero h1{text-wrap:balance}@media(max-width:600px){.toolbar{flex-wrap:wrap}.tools{width:100%}.tools select{flex:1;min-width:0}.layout{padding-top:20px}}';
const moduleOptions=Object.entries(modules).map(([n,m])=>'<option value="'+n+'">M'+String(n).padStart(2,'0')+' · '+esc(m.title)+'</option>').join('');
const preview='<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Prévia · Direito Civil · 15 módulos</title><style>'+css+'</style></head><body><header class="toolbar"><div class="brand">BASE COMPLETA<small>DIREITO CIVIL · 15 MÓDULOS · PRÉVIA</small></div><div class="tools"><select id="module" aria-label="Escolher módulo">'+moduleOptions+'</select><button id="menu" aria-expanded="false">Sumário</button><button id="minus" aria-label="Diminuir fonte">A−</button><button id="plus" aria-label="Aumentar fonte">A+</button></div></header><div class="layout"><nav aria-label="Sumário"></nav><main></main></div><script id="data" type="application/json">'+JSON.stringify(modules).replaceAll('<','\\u003c')+'</script><script>'+fs.readFileSync('ui/civil-law-disclosure-v1.js','utf8')+'\n'+fs.readFileSync('scripts/civil-standalone-preview-runtime.js','utf8')+'</script></body></html>';
fs.writeFileSync(path.join(output,'Previa_Direito_Civil_15_Modulos.html'),preview);
fs.writeFileSync(path.join(output,'index.html'),preview);
fs.writeFileSync(path.join(output,'civil-visual-audit.json'),JSON.stringify(audit,null,2));
fs.writeFileSync('audits/civil-visual-apostila-20261106.json',JSON.stringify(audit,null,2)+'\n');
console.log(JSON.stringify({modules:15,lawArticles:audit.reduce((a,x)=>a+x.lawArticles,0),bytes:Buffer.byteLength(preview),audit}));
