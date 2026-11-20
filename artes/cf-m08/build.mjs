import fs from 'node:fs';
import path from 'node:path';
const root=path.dirname(new URL(import.meta.url).pathname);
const repoSource=path.resolve(root,'../../content/cf/m08-teoria-guiada-data.js');
const raw=fs.readFileSync(fs.existsSync(repoSource)?repoSource:path.join(root,'source-m08.js'),'utf8');
const match=raw.match(/g\.BC_CF_GUIDED_MODULES\[8\]=(\{[\s\S]*\});\}\)\(window\);?/);
if(!match) throw new Error('Não encontrei o módulo 8 no arquivo-fonte.');
const source=JSON.parse(match[1]);
const art=JSON.parse(fs.readFileSync(path.join(root,'art-content.json'),'utf8'));
if(source.topics.length!==11 || art.length!==11) throw new Error('A quantidade de capítulos ou artes não confere.');
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
const data=source.topics.map((t,i)=>({chapter:i+1,title:t[0],review:t[1],example:t[2],constitutional_reference:t[3],exam_trap:t[4],memorization:[t[5],t[6]],central:art[i].central,cards:art[i].cards,tips:art[i].tips}));
fs.writeFileSync(path.join(root,'data.json'),JSON.stringify({module:8,module_title:source.title,chapters:data},null,2)+'\n');
const template=fs.readFileSync(path.join(root,'template.html'),'utf8');
for(const item of data){
 let html=template.replaceAll('__NUM__',String(item.chapter)).replaceAll('__TITLE__',esc(item.title)).replaceAll('__CENTRAL__',esc(item.central)).replaceAll('__T1__',esc(item.tips[0])).replaceAll('__T2__',esc(item.tips[1])).replaceAll('CF M04','CF M08');
 for(let i=0;i<4;i++){html=html.replaceAll(`template-assets/icon${i+1}.png`,`template-assets/icon${i+1}.svg`).replaceAll(`__H${i+1}__`,esc(item.cards[i][0])).replaceAll(`__B${i+1}__`,esc(item.cards[i][1]));}
 fs.writeFileSync(path.join(root,`CF-M07-C${String(item.chapter).padStart(2,'0')}.html`),html);
}
console.log(`Mapped ${data.length} chapters from the source; wrote data.json and HTML files.`);
