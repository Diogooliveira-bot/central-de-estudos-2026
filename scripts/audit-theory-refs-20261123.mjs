/* Auditoria somente leitura, sem modificar conteúdo ou progresso. */
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {JSDOM} from 'jsdom';
const read=p=>readFileSync(p,'utf8');
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,' ').trim();
const badQuestion=/^(?:\d{1,2}\s*[–—-]\s*(?:FACIL|MEDIO|DIFICIL)\b|(?:CONTEUDO\s+)?(?:COMPLETO|RESUMIDO)\s*[–—-]\s*10 QUESTOES\b|QUESTAO\s*(?:N[Oº.]*)?\s*\d+\b|GABARITO\s*:|FIXACAO\s*:\s*\(?1\)?\s|(?:10|5)\s+QUESTOES\s+INTERNAS\b)/i;
const refHeading=/^(?:\d{1,2}\s*[.)–—-]?\s*)?(?:REFERENCIAS(?:\s+.*)?|BIBLIOGRAFIA(?:\s+.*)?|FONTES\s+(?:OFICIAIS|DE CONSULTA|CONSULTADAS))$/i;
const doc=new JSDOM('<!doctype html><html><head></head><body></body></html>',{url:'https://example.org',pretendToBeVisual:true,runScripts:'outside-only'});
const win=doc.window;
win.eval(read('ui/old-questions-removed-v1.js'));
win.eval(read('ui/cf-apostila-reading-v1.js'));
function probe(label,html,scopeClass='bc-native-article'){
 const el=win.document.createElement('article');el.className=scopeClass;el.innerHTML=html||'';
 win.document.body.append(el);
 const beforeText=norm(el.textContent);
 const beforeRefs=[...el.querySelectorAll('h2,h3,h4,h5,p')].filter(h=>refHeading.test(norm(h.textContent))).length;
 const beforeBad=[...el.querySelectorAll('h2,h3,h4,h5,p,li')].filter(h=>badQuestion.test(norm(h.textContent))&&(!h.querySelector('h2,h3,h4,h5,p,li'))).length;
 win.BCQuestionsRemovedUI.sweep();
 const headings=[...el.querySelectorAll('h2,h3,h4,h5,p')].filter(h=>refHeading.test(norm(h.textContent)));
 const tails=headings.map(h=>{
   let cur=h.nextElementSibling,post=[];while(cur&&post.length<8){if(!cur.matches('footer,[role="contentinfo"],.adm-reading-check-list,.adm-session-reader-check,.gmf-reader-done,.bc-info-reader-end'))post.push(norm(cur.textContent).slice(0,90));cur=cur.nextElementSibling;}
   return {title:norm(h.textContent).slice(0,72),following:post.slice(0,3)};
 });
 const leftovers=[...el.querySelectorAll('h2,h3,h4,h5,p,li')].filter(h=>badQuestion.test(norm(h.textContent))&&(!h.querySelector('h2,h3,h4,h5,p,li'))).map(h=>norm(h.textContent).slice(0,125)).slice(0,12);
 const fixation=[...el.querySelectorAll('p,li')].filter(e=>/^(?:FIXACAO\s*:\s*\(\d+\)|PERGUNTAS\s+DE\s+REVIS[AÃ]O\s*:)/i.test(norm(e.textContent))).map(x=>norm(x.textContent).slice(0,150)).slice(0,3);
 const afterText=norm(el.textContent);
 el.remove();
 return {label,beforeChars:beforeText.length,afterChars:afterText.length,beforeRefs,afterRefs:headings.length,beforeBad,afterBad:leftovers.length,markers:leftovers,fixation,refs:tails};
}
function unpack(path){const s=read(path);const m=s.match(/="([A-Za-z0-9+/=]+)";?\s*$/);if(!m)throw Error('Base64 ausente: '+path);return gunzipSync(Buffer.from(m[1],'base64')).toString('utf8')}
const report={revision:'da8ead2e',scope:'sem Português; somente auditoria',adm:[],cf:[],gmf:[],info:[],packages:[],errors:[]};
for(let n=1;n<=20;n++){
 for(const mode of ['summary','complete']){
  try{const html=unpack('content/adm/m'+String(n).padStart(2,'0')+'-apostila-'+mode+'.js');report.adm.push(probe('ADM M'+String(n).padStart(2,'0')+' '+mode,html));}
  catch(e){report.errors.push({area:'ADM',n,mode,error:String(e)})}
 }
}
for(let n=1;n<=15;n++){
 try{
  const s=read('content/cf/m'+String(n).padStart(2,'0')+'-native-data.js');
  const k='.m'+String(n).padStart(2,'0')+'=',start=s.indexOf(k);
  const o=JSON.parse(s.slice(start+k.length,s.lastIndexOf(';})(window)')));
  const completeHtml=win.CfApostilaReading.render(o.complete,n);
  report.cf.push(probe('CF M'+String(n).padStart(2,'0')+' completo',completeHtml));
  const refPositions=[...o.complete.matchAll(/^(?:\d{1,2}\.?\s*)?(?:REFER[EÊ]NCIAS|BIBLIOGRAFIA|FONTES CONSULTADAS)/gmi)].map(m=>m.index);
  const last=refPositions.at(-1);
  report.cf.at(-1).rawReferenceAfter=last!=null?o.complete.length-last:null;
 }catch(e){report.errors.push({area:'CF',n,error:String(e)})}
}
for(let kind of ['full','review']){
 try{
  const s=read('content/gmf/m01-'+(kind==='full'?'full':'review')+'-v1.js');
  const data=JSON.parse(s.slice(s.indexOf('={')+1,s.lastIndexOf(';')));
  for(const [discipline,module] of Object.entries(data)){
   for(let i=0;i<module.chapters.length;i++)report.gmf.push(probe('GMF '+discipline+' M01 '+kind+' C'+(i+1),module.chapters[i].html,'gmf-reader-prose'));
  }
 }catch(e){report.errors.push({area:'GMF',kind,error:String(e)})}
}
for(let n=1;n<=13;n++){
 try{
  const s=read('content/informatica/m'+String(n).padStart(2,'0')+'.js');
  const start=s.indexOf('.m'+String(n).padStart(2,'0')+'=');
  const data=JSON.parse(s.slice(start+5,s.lastIndexOf(';})(window)')));
  for(let i=0;i<(data.full||[]).length;i++)report.info.push(probe('INFO M'+String(n).padStart(2,'0')+' teoria C'+(i+1),data.full[i].html,'bc-info-reader-content'));
 }catch(e){report.errors.push({area:'INFO',n,error:String(e)})}
}
function visit(v,path,seen,count=0){
 if(count>8||seen.length>5000)return;
 if(typeof v==='string'&&/<(?:p|h[1-6]|section)\b/i.test(v)&&/(summary|complete|html|content|theory)/i.test(path))seen.push({path,len:v.length,questions:(v.match(/Gabarito\s*:|Quest[ãa]o\s+\d+|Quest[õo]es Internas/gi)||[]).length,refs:(v.match(/Refer[eê]ncias|Bibliografia/gi)||[]).length,probe:probe(path,v)});
 else if(Array.isArray(v))v.forEach((x,i)=>visit(x,path+'['+i+']',seen,count+1));
 else if(v&&typeof v==='object')Object.entries(v).forEach(([k,x])=>visit(x,path+'.'+k,seen,count+1));
}
for(const discipline of ['civil','cpp']){
 try{
  const payload=unpack('content/'+discipline+'/'+discipline+'-native-content-packed.js');
  let obj;try{obj=JSON.parse(payload)}catch(e){obj=null}
  const found=[];if(obj)visit(obj,discipline,found);
  report.packages.push({discipline,decodedBytes:payload.length,isJson:!!obj,keys:obj&&typeof obj==='object'?Object.keys(obj).slice(0,20):[],snippets:!obj?payload.slice(0,120):null,blocks:found.length,questionBlocks:found.filter(x=>x.probe.afterBad||x.probe.fixation.length).slice(0,35).map(x=>({path:x.path,markers:x.probe.markers,fixation:x.probe.fixation})),outOfOrderRefs:found.filter(x=>x.probe.refs.some(r=>r.following.length)).slice(0,20).map(x=>({path:x.path,refs:x.probe.refs}))});
 }catch(e){report.errors.push({area:discipline,error:String(e)})}
}
mkdirSync('audits/teoria-20261123',{recursive:true});
writeFileSync('audits/teoria-20261123/report.json',JSON.stringify(report,null,2));
for(const area of ['adm','cf','gmf','info']){
 const rows=report[area];
 console.log('AUDIT_AREA '+area+' '+JSON.stringify({documents:rows.length,questionLeft:rows.filter(x=>x.afterBad||x.fixation.length).map(x=>({label:x.label,afterBad:x.afterBad,markers:x.markers.slice(0,4),fixation:x.fixation})).slice(0,45),referencesWithFollowing:rows.filter(x=>x.refs.some(r=>r.following.length)).map(x=>({label:x.label,refs:x.refs})).slice(0,28)}));
}
console.log('AUDIT_PACKAGES '+JSON.stringify(report.packages));
console.log('AUDIT_ERRORS '+JSON.stringify(report.errors));
doc.window.close();
