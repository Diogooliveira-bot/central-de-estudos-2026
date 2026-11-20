import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.dirname(fileURLToPath(import.meta.url));
const source=fs.readFileSync(path.join(root,'../../content/cf/m11-teoria-guiada-data.js'),'utf8');
const match=source.match(/g\.BC_CF_GUIDED_MODULES\[11\]=(.*);\}\)\(window\);/s);
if(!match) throw new Error('Fonte real da Revisão Guiada do módulo 11 não encontrada.');
const module=JSON.parse(match[1]);
const art=JSON.parse(fs.readFileSync(path.join(root,'art-content.json'),'utf8'));
if(module.topics.length!==12||art.length!==module.topics.length) throw new Error('A fonte e as artes precisam conter os mesmos 12 capítulos.');
const chapters=module.topics.map((topic,i)=>({chapter:i+1,title:topic[0],review:topic[1],example:topic[2],constitutional_reference:topic[3],exam_trap:topic[4],memorization:[topic[5],topic[6]],...art[i]}));
for(const c of chapters){
  if(c.cards.length!==4||c.tips.length!==2||c.icons.length!==4) throw new Error(`Conteúdo incompleto no capítulo ${c.chapter}.`);
  if(!c.title||!c.central||c.cards.some(x=>x.length!==2)||c.cards[3][0].toLowerCase().indexOf('pegadinha')<0) throw new Error(`Estrutura inválida no capítulo ${c.chapter}.`);
}
fs.writeFileSync(path.join(root,'data.json'),JSON.stringify({module:11,module_title:module.title,chapters},null,2)+'\n');
console.log(`Mapped ${chapters.length} chapters from the real M11 source.`);
