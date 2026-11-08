import fs from 'node:fs';
import zlib from 'node:zlib';
import crypto from 'node:crypto';
import {JSDOM} from 'jsdom';

const source=process.argv[2];
if(!source)throw new Error('Informe o HTML aprovado da prévia de Administrativo.');
const bytes=fs.readFileSync(source),doc=new JSDOM(bytes.toString()).window.document;
const modules=JSON.parse(doc.querySelector('#data').textContent),checks=[];
for(let n=1;n<=20;n++)for(const mode of ['complete','summary']){
 const dom=new JSDOM(modules[n][mode]),article=dom.window.document.querySelector('article');
 for(const heading of article.querySelectorAll(':scope > h2')){
  const marker=heading.querySelector('.section-no');
  if(marker)heading.dataset.admSession=String(Number(marker.textContent));
 }
 const html=article.innerHTML,packed=zlib.gzipSync(html,{level:9}).toString('base64');
 fs.writeFileSync(`content/adm/m${String(n).padStart(2,'0')}-apostila-${mode}.js`,
  'window.ADM_APOSTILA_PACKED=window.ADM_APOSTILA_PACKED||{};window.ADM_APOSTILA_PACKED['+JSON.stringify(n+':'+mode)+']='+JSON.stringify(packed)+';\n');
 checks.push({module:n,mode,htmlSha256:crypto.createHash('sha256').update(html).digest('hex'),lawBlocks:article.querySelectorAll('details.law').length,sessions:article.querySelectorAll('[data-adm-session]').length});
 dom.window.close();
}
fs.writeFileSync('audits/adm-reading-release-20261108.json',JSON.stringify({approvedPreviewSha256:crypto.createHash('sha256').update(bytes).digest('hex'),modules:20,modes:2,checks},null,2)+'\n');

// Scope the approved content styles to the ADM reader only.
const style=doc.querySelector('style'),sheet=style.sheet;
const scope='#adm-native-reader .bc-native-article.adm-apostila';
function rules(list){return [...list].map(rule=>{
 if(rule.type===4){const nested=rules(rule.cssRules);return nested?'@media '+rule.conditionText+'{'+nested+'}':'';}
 if(rule.type!==1)return '';
 const selectors=rule.selectorText.split(',').map(s=>s.trim()).filter(s=>/^(?:h[1-4]\b|p\b|ul\b|ol\b|li\b|strong\b|b\b|a\b|table\b|td\b|th\b|mark\b|details\.law|\.(?:section-no|overview|flow|adm-table-scroll|note|law|synthesis|check-label|lead)\b)/.test(s));
 return selectors.length?selectors.map(s=>scope+' '+s).join(',')+'{'+rule.style.cssText+'}':'';
}).filter(Boolean).join('\n');}
let css=rules(sheet.cssRules);
css+='\n#adm-native-reader{--bc-reading-paper:#fff;--bc-reading-text:#2c3e4d;--bc-reading-line:#dbe5ed;--bc-reading-inset:#f6f9fc;}\n';
css+=scope+'{width:min(100%,1000px)!important;max-width:1000px!important;padding:32px 38px 80px!important;font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif!important;}\n';
css+=scope+' > :is(h1,h2,h3){background:none!important;box-shadow:none!important;border-radius:0!important;border-left:0!important;color:#173854!important;font-family:inherit!important;}\n';
css+=scope+' > h1{border:0!important;padding:0!important;margin:0 0 32px!important;}\n';
css+=scope+' :is(.overview,.flow) :is(p,li){text-align:left!important;text-align-last:auto!important;}\n';
css+=scope+' > h2{font-size:1.3em!important;padding:25px 0 0!important;border-top:1px solid var(--bc-reading-line)!important;border-bottom:0!important;margin:48px 0 18px!important;}\n';
css+=scope+' > h3{font-size:1.08em!important;border:0!important;padding:0!important;margin:28px 0 12px!important;}\n';
css+=scope+' table :is(td,th){font-size:.84em!important;}\n';
css+='html[data-bc-reading-mode="night"] #adm-native-reader{--bc-reading-paper:#252525;--bc-reading-text:#d8d2c8;--bc-reading-line:#414141;--bc-reading-inset:#2d2d2d;}\n';
css+='html[data-bc-reading-mode="night"] '+scope+' :is(.law,th){background:var(--bc-reading-inset)!important;color:var(--bc-reading-text)!important;}\n';
css+='html[data-bc-reading-mode="night"] '+scope+' :is(h1,h2,h3,h4,p,li,strong,summary){color:var(--bc-reading-text)!important;}\n';
css+='@media(max-width:700px){'+scope+'{width:100%!important;padding:22px 18px 65px!important;}}\n';
css+='@media(max-width:700px){'+scope+' table.bc-tcards tr{display:table-row!important}'+scope+' table.bc-tcards :is(td,th){display:table-cell!important}'+scope+' table.bc-tcards td::before{display:none!important}}\n';
fs.writeFileSync('ui/adm-apostila-reading-v1.css',css);
console.log('Imported '+checks.length+' approved reading views.');
