// Repair only the law excerpts: preserve all approved theory and reading markup.
// Usage: node scripts/complete-civil-law-references.mjs <official HTML directory> [standalone.html]
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {loadModules,occurrences,normalizeNumber} from './audit-civil-law-references.mjs';
const dir=process.argv[2];if(!dir)throw Error('Official source directory required');
const sourceInfo={
 cc:['CC','https://www2.camara.leg.br/legin/fed/lei/2002/lei-10406-10-janeiro-2002-432893-normaatualizada-pl.html'],
 cpc:['CPC','https://www2.camara.leg.br/legin/fed/lei/2015/lei-13105-16-marco-2015-780273-normaatualizada-pl.html'],
 mp2220:['MP 2.220/2001','https://www2.camara.leg.br/legin/fed/medpro/2001/medidaprovisoria-2220-4-setembro-2001-396074-normaatualizada-pe.html'],
 dl271:['Decreto-Lei 271/1967','https://www2.camara.leg.br/legin/fed/declei/1960-1969/decreto-lei-271-28-fevereiro-1967-378103-normaatualizada-pe.html']
};
const registry={};const norm=t=>t.replace(/\s+/g,' ').trim();
for(const [code,[label,url]]of Object.entries(sourceInfo)){
 const dom=new JSDOM(fs.readFileSync(path.join(dir,code+'.html'),'utf8'));const d=dom.window.document;let current;
 for(const p of d.querySelectorAll('p')){
  const text=norm(p.textContent);if(!text)continue;
  const match=text.match(/^Art\.\s*(\d[\d.]*)(?:[ºo])?(?:-([A-Z]))?\.?\s/);
  if(match){current=code+':'+normalizeNumber(match[1])+(match[2]?'-'+match[2]:'');if(registry[current]){current=null;continue;}registry[current]={label:label+' · Art. '+normalizeNumber(match[1])+(match[2]?'-'+match[2]:''),url,paragraphs:[]};}
  if(/^(?:CAPÍTULO|TÍTULO|LIVRO|Seção|Subseção|Brasília|Este texto)/i.test(text)){current=null;continue;}
  if(!current)continue;
  const copy=p.cloneNode(true);copy.querySelectorAll('s,strike,del').forEach(x=>x.remove());
  let clean=norm(copy.textContent).replace(/\s*\((?:Artigo|Inciso|Parágrafo|“Caput”|Caput|Alínea|Redação|Vide|Vigência)[^)]*\)/g,'').trim();
  if(clean)registry[current].paragraphs.push(clean);
 }
 dom.window.close();
}
const data=loadModules(),report=[];const esc=t=>String(t).replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function covered(d,n){const keys=new Set([...d.querySelectorAll('[data-law-key]')].map(x=>x.dataset.lawKey));if(n===4)for(const el of d.querySelectorAll('.law-article[id^="art-"]'))keys.add('cc:'+el.id.split('-')[1]);return keys;}
function prose(d){const a=d.querySelector('article').cloneNode(true);a.querySelectorAll('.law').forEach(x=>x.remove());return a.outerHTML;}
function anchor(el){return el.closest('table')||el.closest('ul,ol')||el;}
function section(d,prefix){return [...d.querySelectorAll('h2,h3,h4')].find(h=>h.textContent.trim().startsWith(prefix+' '));}
function afterExplanation(h){let e=h;while(e.nextElementSibling&&!/^(H[1-4]|ASIDE)$/.test(e.nextElementSibling.tagName))e=e.nextElementSibling;return e;}
for(const [number,m]of Object.entries(data)){
 const n=+number,dom=new JSDOM(m.html),d=dom.window.document,before=prose(d),has=covered(d,n),plans=new Map();
 function add(key,el,reason){if(has.has(key))return;const entry=registry[key];assert(entry?.paragraphs.length,'Missing official text: '+key);assert(!entry.paragraphs.join(' ').includes('Ã'),'Invalid encoding '+key);assert(/^Art\./.test(entry.paragraphs[0]),'Invalid article opening '+key);has.add(key);const a=anchor(el);if(!plans.has(a))plans.set(a,[]);plans.get(a).push(key);report.push({module:n,key,reason,source:entry.url});}
 const refs=occurrences(n,d).filter(r=>!r.law.startsWith('historical-'));
 // Prefer the actual theory paragraph over later revision mentions. Broad normative
 // ranges belong to the law chapter, keeping the introductory overview readable.
 refs.sort((a,b)=>Number(!/^2\./.test(a.topic.trim()))-Number(!/^2\./.test(b.topic.trim())));
 for(const ref of refs){
  let target=ref.el;
  if(n===10&&ref.quote.includes(' a ')&&Number(ref.n)>=966)target=afterExplanation(section(d,'3.'));
  if(n===10&&Number(ref.n)>=887&&Number(ref.n)<=926)target=afterExplanation(section(d,'2.1.3'));
  add(ref.law+':'+ref.n,target,'Cited article or range: '+ref.quote);
 }
 // Lettered articles do not appear in a numeric-only expansion of a range.
 for(const [key,prefix]of n===12?[['cc:1240-A','2.3.1'],['cc:1354-A','2.8'],['cc:1368-A','2.12'],['cc:1368-B','2.12'],['cc:1368-C','2.12'],['cc:1368-D','2.12'],['cc:1368-E','2.12']]:n===15?[['cc:1815-A','2.4']]:[]){add(key,afterExplanation(section(d,prefix)),'Lettered article in the cited subject');}
 if(n===13){for(let i=1;i<=9;i++)add('mp2220:'+i,afterExplanation(section(d,'2.6')),'Special concession for housing');for(const i of [7,8])add('dl271:'+i,afterExplanation(section(d,'2.6')),'Concession of real right of use');}
 let serial=0;
 for(const [el,keys]of plans){
  keys.sort((a,b)=>a.localeCompare(b,'en',{numeric:true}));
  const html='<aside class="law" aria-label="Lei seca relacionada à explicação"><div class="law-label">LEI SECA</div>'+keys.map(key=>{const x=registry[key];return '<div class="law-article" data-law-key="'+key+'" id="cv-added-'+n+'-'+(++serial)+'"><div class="law-source">'+esc(x.label)+'</div>'+x.paragraphs.map(t=>'<p>'+esc(t)+'</p>').join('')+'<a class="law-official" href="'+esc(x.url)+'" target="_blank" rel="noopener noreferrer">Fonte oficial</a></div>';}).join('')+'</aside>';
  el.insertAdjacentHTML('afterend',html);
 }
 assert.equal(prose(d),before,'Approved theory changed in module '+n);
 const final=covered(d,n);for(const ref of occurrences(n,d))if(!ref.law.startsWith('historical-'))assert(final.has(ref.law+':'+ref.n),'Unresolved reference '+n+' '+ref.law+':'+ref.n);
 m.html=d.querySelector('article').outerHTML;dom.window.close();
}
const packed=zlib.gzipSync(JSON.stringify(data),{level:9}).toString('base64');
fs.writeFileSync('content/civil/civil-visual-apostila-packed.js','/* Approved Civil presentation; source corpus remains unchanged. */\nwindow.CIVIL_APOSTILA_PACKED_B64='+JSON.stringify(packed)+';\n');
const auditPath='audits/civil-visual-apostila-20261106.json',audit=JSON.parse(fs.readFileSync(auditPath));
for(const row of audit){const d=new JSDOM(data[row.module].html).window.document;row.lawBlocks=d.querySelectorAll('.law').length;row.lawArticles=d.querySelectorAll('.law-article').length;}
fs.writeFileSync(auditPath,JSON.stringify(audit,null,2)+'\n');
fs.writeFileSync('audits/civil-law-completion-20261107.json',JSON.stringify({added:report.length,modulesChecked:15,unresolvedCurrentReferences:0,excludedHistoricalReferences:['CC 757–802 (revoked insurance chapter)','CC 206 §1 II (revoked insurance rule)','CPC/1973 historical comparison'],articles:report},null,2)+'\n');
if(process.argv[3]){const file=process.argv[3],html=fs.readFileSync(file,'utf8');fs.writeFileSync(file,html.replace(/(<script id="data" type="application\/json">)[\s\S]*?(<\/script>)/,(_,a,b)=>a+JSON.stringify(data).replaceAll('<','\\u003c')+b));}
console.log(JSON.stringify({added:report.length,byModule:report.reduce((o,x)=>(o[x.module]=(o[x.module]||0)+1,o),{}),unresolved:0}));
