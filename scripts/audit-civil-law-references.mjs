import fs from 'node:fs';
import vm from 'node:vm';
import zlib from 'node:zlib';
import {JSDOM} from 'jsdom';
export const normalizeNumber=n=>String(n).replace(/[ºo]/gi,'').replaceAll('.','').toUpperCase();
const N='\\d{1,4}(?:\\.\\d{3})?(?:-[A-Z])?';
export function references(text){
 const results=[];const re=new RegExp('\\barts?\\.\\s*('+N+')[ºo]?(?:\\s*(?:(?:a|até|e|,|[-–])\\s*)'+N+'[ºo]?)*','gi');
 for(const m of text.matchAll(re)){
  const span=m[0].replace(/^arts?\.\s*/i,'');const nums=[...span.matchAll(new RegExp(N,'gi'))].map(x=>({n:normalizeNumber(x[0]),start:x.index,end:x.index+x[0].length}));
  for(let i=0;i<nums.length;i++){
   results.push({n:nums[i].n,index:m.index,quote:m[0]});
   if(i){const between=span.slice(nums[i-1].end,nums[i].start).replace(/[ºo]/g,'').trim();const lo=Number(nums[i-1].n),hi=Number(nums[i].n);if(/^(?:a|até|-|–)$/i.test(between)&&Number.isInteger(lo)&&Number.isInteger(hi)&&hi>=lo&&hi-lo<500)for(let n=lo+1;n<hi;n++)results.push({n:String(n),index:m.index,quote:m[0]});}
  }
 }
 return results;
}
export function topicFor(el){let node=el;while(node){if(/^H[1-4]$/.test(node.tagName))return node;let prev=node.previousElementSibling;while(prev){if(/^H[1-4]$/.test(prev.tagName))return prev;prev=prev.previousElementSibling;}node=node.parentElement;}return null;}
export function lawFor(module,el,ref){
 const text=el.textContent,topic=topicFor(el)?.textContent||'',index=Number(topic.match(/^\s*2\.(\d+)/)?.[1]);
 const context=text.slice(Math.max(0,ref.index-95),ref.index+ref.quote.length+95);
 if(module===11&&/CPC\/1973/.test(text))return 'historical-cpc';
 if(module===8&&((Number(ref.n)>=757&&Number(ref.n)<=802)||(index===15&&ref.n==='206')))return 'historical-cc';
 if(module===1&&index===5&&['6','84','85'].includes(ref.n))return 'lbi';
 if(module===8&&index===15)return 'seguro';
 if(module===11&&index===11)return 'cpc';
 if(module===15&&['610','648'].includes(ref.n))return 'cpc';
 if(module===2&&ref.n==='37')return 'cf';
 const after=text.slice(ref.index+ref.quote.length,ref.index+ref.quote.length+65);
 const before=text.slice(Math.max(0,ref.index-95),ref.index);
 if(/^\s*(?:do|no)\s*(?:CC|Código Civil)/i.test(after)||module===5&&['231','232'].includes(ref.n))return 'cc';
 if(/^\s*(?:[ºo]|,|§[^,;]*,)?\s*(?:do|no|e o)?\s*(?:CPC|Código de Processo Civil)/i.test(after)||/(?:CPC|Código de Processo Civil)[^.;]{0,50}$/i.test(before))return 'cpc';
 if(/^\s*(?:da|na)\s*(?:CF|Constituição Federal)/i.test(after)||/(?:CF\/88|Constituição Federal)[^;]{0,30}$/i.test(before))return 'cf';
 if(/^\s*(?:da LBI|do Estatuto da Pessoa com Deficiência)/i.test(after))return 'lbi';
 return 'cc';
}
export function loadModules(){const w={};vm.runInNewContext(fs.readFileSync('content/civil/civil-visual-apostila-packed.js','utf8'),{window:w});return JSON.parse(zlib.gunzipSync(Buffer.from(w.CIVIL_APOSTILA_PACKED_B64,'base64')));}
export function occurrences(module,document){const out=[];for(const el of document.querySelectorAll('h2,h3,h4,p,li,td,th')){if(el.closest('.law,.overview,.synthesis')||el.querySelector('p,li,table'))continue;for(const ref of references(el.textContent)){out.push({module,el,...ref,law:lawFor(module,el,ref),topic:topicFor(el)?.textContent||''});}}return out;}
if(process.argv[1]?.endsWith('audit-civil-law-references.mjs')){
 const data=loadModules(),out=[];
 for(const [n,m]of Object.entries(data)){
  const dom=new JSDOM(m.html),d=dom.window.document,covered=new Set([...d.querySelectorAll('[data-law-key]')].map(x=>x.dataset.lawKey));
  if(+n===4)for(const el of d.querySelectorAll('.law-article[id^="art-"]'))covered.add('cc:'+el.id.split('-')[1]);
  for(const ref of occurrences(+n,d))if(!covered.has(ref.law+':'+ref.n)&&!ref.law.startsWith('historical-'))out.push({module:+n,key:ref.law+':'+ref.n,topic:ref.topic,quote:ref.quote,context:ref.el.textContent.replace(/\s+/g,' ').slice(0,350)});
  dom.window.close();
 }
 fs.writeFileSync('../civil-review/missing-law-references.json',JSON.stringify(out,null,2));
 for(let n=1;n<=15;n++)console.log('M'+n,[...new Set(out.filter(x=>x.module===n).map(x=>x.key))].join(', '));
}
