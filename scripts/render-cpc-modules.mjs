import fs from 'node:fs';
import {JSDOM} from 'jsdom';
export async function renderModule(n,mode='complete'){
 const dom=new JSDOM('<!doctype html><body></body>',{runScripts:'outside-only',pretendToBeVisual:true,url:'https://preview.local'}),w=dom.window;
 w.HTMLElement.prototype.scrollIntoView=()=>{};w.alert=message=>{throw Error(message)};
 w.eval(fs.readFileSync('content/cpc/m'+String(n).padStart(2,'0')+'-native-data.js','utf8'));
 const file=n===1?'ui/cpc-native-study-reader.js':'ui/cpc-m'+String(n).padStart(2,'0')+'-native-study-reader.js';
 w.eval(fs.readFileSync(file,'utf8'));w.CpcApostilaReading={transform:async html=>html};
 const api=n===1?w.CpcNativeReader:w['CpcM'+String(n).padStart(2,'0')+'NativeReader'];await api.open(mode);
 const article=w.document.querySelector('.bc-native-article');if(!article)throw Error('No article M'+n);
 const source=w.BASE_NATIVE_CONTENT.cpc['m'+String(n).padStart(2,'0')];
 const result={title:source.title,html:article.outerHTML,raw:source[mode],chapters:JSON.parse(JSON.stringify(source.chapters[mode]))};dom.window.close();return result;
}
if(process.argv[1]?.endsWith('render-cpc-modules.mjs')){
 const out={};for(let n=1;n<=20;n++){out[n]={};for(const mode of ['complete','summary'])out[n][mode]=await renderModule(n,mode);console.log(n,out[n].complete.html.length);}
 fs.writeFileSync('../cpc-review/rendered.json',JSON.stringify(out));
}
