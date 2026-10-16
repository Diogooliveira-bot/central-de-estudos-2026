// Extract the texts used by the current readers. This inventory is not legal validation.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import zlib from 'node:zlib';
import crypto from 'node:crypto';
import {JSDOM} from 'jsdom';
const root=path.resolve(import.meta.dirname,'..');
const out=path.resolve(process.argv[2]||'/tmp/central-theory-review');
fs.mkdirSync(out,{recursive:true});
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const evaluate=s=>{const c={window:{},console,setTimeout:()=>0,clearTimeout(){},document:{}};vm.runInNewContext(s,c,{timeout:15000});return c.window};
const dom=new JSDOM('<!doctype html><html><head></head><body></body></html>',{runScripts:'outside-only',url:'http://localhost/'});
const plain=s=>{const d=dom.window.document.createElement('div');d.innerHTML=String(s).replace(/<\/(?:p|div|section|article|h[1-6]|li|tr|pre)>/gi,'$&\n').replace(/<\/(?:td|th)>/gi,'$& | ').replace(/<br\s*\/?>/gi,'\n');d.querySelectorAll('style,script').forEach(n=>n.remove());return d.textContent.replace(/[\t ]+/g,' ').replace(/\n[ ]+/g,'\n').replace(/\n{3,}/g,'\n\n').trim()};
const rows=[];
function record(subject,num,mode,title,source,raw,format='html'){
 const text=format==='html'?plain(raw):String(raw).replace(/\r\n/g,'\n');
 const id=`${subject}-${num}-${mode}`;
 fs.writeFileSync(path.join(out,id+'.txt'),text);
 rows.push({id,subject,module:String(num),mode,title,source,characters:text.length,words:text.split(/\s+/).filter(Boolean).length,sha256:crypto.createHash('sha256').update(text).digest('hex'),extraction:text?'ok':'empty',legalReview:'pending',languageReview:'triage-only'});
}
const fullPenal=evaluate([1,2,3,4].map(n=>read(`penal-full-theory-data-0${n}.js`)).join('\n')).PENAL_FULL_THEORY;
for(const [s,n] of [['cf',15],['cpc',20],['penal',17]])for(let i=1;i<=n;i++){
 const p=`content/${s}/m${String(i).padStart(2,'0')}-native-data.js`;
 const d=evaluate(read(p)).BASE_NATIVE_CONTENT[s]['m'+String(i).padStart(2,'0')];
 for(const m of ['summary','complete'])record(s,i,m,d.title,p,d[m]||(s==='penal'&&m==='complete'?fullPenal['p'+i]?.html:'')||'',s==='cf'?'text':'html');
}
for(const s of ['civil','cpp']){
 const p=`content/${s}/${s}-native-content-packed.js`;
 const b64=read(p).match(/"([A-Za-z0-9+/=]{100,})"/)[1];
 const d=JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')));
 for(const [key,v] of Object.entries(d))for(const m of ['summary','complete'])record(s,Number(key.match(/\d+$/)[0]),m,v.title,p,v[m+'Html']);
}
const ptraFiles=fs.readdirSync(path.join(root,'content/ptra/packed')).filter(p=>p.endsWith('.bin')).sort();
const ptra=JSON.parse(zlib.gunzipSync(Buffer.concat(ptraFiles.map(p=>fs.readFileSync(path.join(root,'content/ptra/packed',p))))));
for(const d of ptra.modules)for(const [m,key] of [['summary','resumido'],['complete','completo']])record('ptra',d.number,m,d.title,'content/ptra/packed/ptra-pack-01.bin … 12.bin',d[key].pages.join('\n\n'),'text');
for(let n=1;n<=18;n++){
 const p=`modules/trabalho/native/modules/m${String(n).padStart(2,'0')}.json`,d=JSON.parse(read(p));
 for(const [m,k] of [['summary','resumida'],['complete','completa']])record('trabalho',n,m,d.titulo,p,d.tipos[k].paginas.join('\n\n'),'text');
}
const pt=JSON.parse(zlib.gunzipSync(Buffer.from(read('portugues-autodidata-data.txt').trim(),'base64')));
for(const [k,v] of Object.entries(pt))record('portugues',k,'integrated',k,'portugues-autodidata-data.txt',v);
const rlm=evaluate(['estrutura','aulas-logica','aulas-raciocinio','aulas-matematica','aulas-estatistica'].map(f=>read(`content/rlm-tjce-2026/${f}.js`)).join('\n'));
const strings=v=>typeof v==='string'?v:Array.isArray(v)?v.map(strings).join('\n'):v&&typeof v==='object'?Object.values(v).map(strings).join('\n'):'';
for(const [k,v] of Object.entries(rlm.RLM_CURSO_AULAS)){
 for(const [mode,key] of [['complete','theory'],['summary','summary']])record('rlm',k,mode,v.title||k,'content/rlm-tjce-2026/aulas-*.js',strings(v[key]??''),'text');
}
const a=dom.window;a.renderDetail=()=>'';a.renderAll=()=>{};
const lazySource=read('central-lazy-theory-v66119.js');
const groupStart=lazySource.indexOf('var groups=');
const groupEnd=lazySource.indexOf('\n};',groupStart)+3;
const lazy=evaluate(lazySource.slice(groupStart,groupEnd)+'\nwindow.__auditGroups=groups;');
for(const file of lazy.__auditGroups.adm){const p=file.split('?')[0];if(p.startsWith('adm-'))a.eval(read(p))}
a.document.dispatchEvent(new a.Event('DOMContentLoaded'));
const ix=evaluate(read('content/adm/adm-native-index.js')).ADM_NATIVE_INDEX;
for(const [uid,meta] of Object.entries(ix.modules)){
 const p=`content/adm/m${String(meta.number).padStart(2,'0')}-native-data-lite.js`;
 const d=Object.values(evaluate(read(p)).ADM_NATIVE_CONTENT)[0];
 record('adm',meta.number,'summary',meta.title,p,d.summaryHtml);
 const legacy=a.renderDetail({id:'adm'},{uid},{});
 record('adm',meta.number,'complete',meta.title,'adm-m*-content/runtime + adm-m9-m20-bundle-v66160.js',legacy+(d.completeAppendHtml||''));
}
const result={baseSha:process.env.AUDIT_BASE_SHA||'unspecified',scope:'Text extraction and automated triage; legal review status is individual and explicit.',bySubject:{},totalTexts:rows.length,totalWords:rows.reduce((n,x)=>n+x.words,0),rows};
for(const s of new Set(rows.map(x=>x.subject)))result.bySubject[s]={texts:rows.filter(x=>x.subject===s).length,modules:new Set(rows.filter(x=>x.subject===s).map(x=>x.module)).size,words:rows.filter(x=>x.subject===s).reduce((n,x)=>n+x.words,0)};
fs.writeFileSync(path.join(out,'inventory.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({totalTexts:result.totalTexts,totalWords:result.totalWords,bySubject:result.bySubject,empty:rows.filter(x=>!x.characters).map(x=>x.id)},null,2));
dom.window.close();
