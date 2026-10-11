import fs from 'node:fs';
import vm from 'node:vm';
import zlib from 'node:zlib';
import path from 'node:path';
import assert from 'node:assert/strict';
const root = path.resolve('.');
const read = p => fs.readFileSync(path.join(root,p),'utf8');
const rows=[];
function evaluate(src){
  const context={console,window:{},globalThis:null,document:{},atob:x=>Buffer.from(x,'base64').toString('binary')};
  context.globalThis=context.window;context.setTimeout=(fn)=>{if(typeof fn==='function')fn()};context.clearTimeout=()=>{};
  vm.runInNewContext(src,context,{timeout:12000});
  return context.window;
}
function record(subject,n,summary,complete,extra={}){
 const valid = Boolean(summary && complete);
 rows.push({subject,module:'M'+String(n).padStart(2,'0'),
   summaryLength:String(summary||'').length,completeLength:String(complete||'').length,
   bothModes:valid,...extra});
}
let fullPenal={};
try{const joined=[1,2,3,4].map(n=>read('penal-full-theory-data-0'+n+'.js')).join('\n');fullPenal=evaluate(joined).PENAL_FULL_THEORY||{}}catch(e){console.warn('Full penal theory load',e.message)}
for(const [subject,count] of [['penal',17],['cpc',20],['cf',15]]){
 for(let n=1;n<=count;n++){
  const p='content/'+subject+'/m'+String(n).padStart(2,'0')+'-native-data.js';
  try {
   let src=read(p); if(subject==='cpc' && n===8 && fs.existsSync(path.join(root,'content/cpc/m08-native-data-part1.js'))) src=read('content/cpc/m08-native-data-part1.js')+'\n'+src;
   const data=evaluate(src).BASE_NATIVE_CONTENT?.[subject]?.['m'+String(n).padStart(2,'0')];
   record(subject,n,data?.summary,data?.complete||(subject==='penal'?fullPenal['p'+n]?.html:''),{source:p,title:data?.title||null,
     chaptersSummary:data?.chapters?.summary?.length??null,
     chaptersComplete:data?.chapters?.complete?.length??null,
     questionSummary:data?.internalQuestions?.summary?.length??null,
     questionComplete:data?.internalQuestions?.complete?.length??null,
     issue:data?'':'source did not register'});
  } catch(e){record(subject,n,'','',{source:p,issue:e.message.slice(0,150)})}
 }
}
for(let n=1;n<=20;n++){
 const p='content/adm/m'+String(n).padStart(2,'0')+'-native-data-lite.js';
 try{
  const all=evaluate(read(p)).ADM_NATIVE_CONTENT||{};
  const data=Object.values(all)[0]||{};
  record('adm',n,data.summaryHtml,'',{source:p,title:data.title||null,
   completeAppendLength:String(data.completeAppendHtml||'').length,
   issue:'complete mode depends on LEGACY runtime; needs authenticated open'});
 }catch(e){record('adm',n,'','',{source:p,issue:e.message.slice(0,130)})}
}
for(const [subject,count] of [['civil',15],['cpp',22]]){
 try{
  const s=read('content/'+subject+'/'+subject+'-native-content-packed.js');
  const match=s.match(/"([A-Za-z0-9+/=]{100,})"/);
  const packed=JSON.parse(zlib.gunzipSync(Buffer.from(match[1],'base64')).toString('utf8'));
  const values=Object.values(packed);
  console.log('PACKED_SHAPE',subject,JSON.stringify({rootKeys:Object.keys(packed).slice(0,6),firstShape:Object.keys(values[0]||{}).slice(0,12)}));
  for(let n=1;n<=count;n++){
   const variants=[packed[n],packed['m'+String(n).padStart(2,'0')],packed[subject+'-m'+String(n).padStart(2,'0')],packed.modules?.[n-1]];
   const item=variants.find(Boolean)||{};
   const summary=item.summaryHtml||item.summary||item.resumida||item.resumido||item.resumo||'';
   const complete=item.completeHtml||item.complete||item.completa||item.integral||'';
   record(subject,n,summary,complete,{source:'content/'+subject+'/'+subject+'-native-content-packed.js',
     packedKeys:Object.keys(item).slice(0,12),issue:!summary||!complete?'packed mapping needs schema resolution':''});
  }
 }catch(e){for(let n=1;n<=count;n++)record(subject,n,'','',{issue:'packed error: '+e.message.slice(0,90)})}
}
for(let n=1;n<=18;n++){
 const p='modules/trabalho/base-completa/m'+String(n).padStart(2,'0')+'.html';
 const s=read(p);
 const text=s.match(/<main[\s>][\s\S]*?<\/main>/i)?.[0]||'';
 rows.push({subject:'trabalho',module:'M'+String(n).padStart(2,'0'),
   htmlLength:s.length,bodyLength:text.length,headings:(text.match(/<h[1-6][\s>]/gi)||[]).length,
   lists:(text.match(/<ul[\s>]|<ol[\s>]/gi)||[]).length,
   universalAssets:s.includes('/ui/universal-reader-v1.js')&&s.includes('/ui/universal-reader-v1.css'),
   issue: text?'':'main missing'});
}
const stats={total:rows.length,bySubject:Object.fromEntries([...new Set(rows.map(x=>x.subject))].map(name=>[name,rows.filter(x=>x.subject===name).length])),
  textModesFullyConfirmed:rows.filter(x=>x.bothModes).length,
  notConfirmed:rows.filter(x=>!x.bothModes&&x.subject!=='trabalho').length,
  missingSource:rows.filter(x=>x.issue && (/error|register|missing/.test(x.issue))).length,
  trabalhoFormatted:rows.filter(x=>x.subject==='trabalho'&&x.universalAssets).length};
console.log('AUDIT_STATS',JSON.stringify(stats));
if(process.env.AUDIT_COMPACT==='1')console.log('AUDIT_UNCONFIRMED',JSON.stringify(rows.filter(x=>!x.bothModes&&x.subject!=='trabalho').map(x=>({subject:x.subject,module:x.module,issue:x.issue}))));
else for(const row of rows)console.log('AUDIT_ROW',JSON.stringify(row));
assert.equal(rows.length,127,'expected modules: 17 penal+20 CPC+15 CF+20 ADM+15 Civil+22 CPP+18 Trabalho = 127');
assert.equal(stats.trabalhoFormatted,18);
