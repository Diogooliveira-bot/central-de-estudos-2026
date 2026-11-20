import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.dirname(fileURLToPath(import.meta.url));
const raw=fs.readFileSync(path.join(root,'source-m09.js'),'utf8');
const match=raw.match(/g\.BC_CF_GUIDED_MODULES\[9\]=(.*);\}\)\(window\);/s);
if(!match)throw new Error('Fonte real do módulo 9 não encontrada.');
const source=JSON.parse(match[1]);
const art=JSON.parse(fs.readFileSync(path.join(root,'art-content.json'),'utf8'));
if(source.topics.length!==11||art.length!==11)throw new Error('A fonte e os resumos devem conter os mesmos 11 capítulos.');
const chapters=source.topics.map((topic,i)=>({
  chapter:i+1,title:topic[0],review:topic[1],example:topic[2],
  constitutional_reference:topic[3],exam_trap:topic[4],memorization:[topic[5],topic[6]],
  ...art[i]
}));
for(let i=0;i<chapters.length;i++){
  if(chapters[i].cards.length!==4||chapters[i].tips.length!==2)throw new Error(`Conteúdo visual incompleto no capítulo ${i+1}.`);
}
const data={module:9,module_title:source.title,chapters};
fs.writeFileSync(path.join(root,'data.json'),JSON.stringify(data,null,2)+'\n');
console.log(`Mapped ${chapters.length} chapters from the M09 source.`);
