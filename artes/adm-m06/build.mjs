import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { gunzipSync } from 'node:zlib';

const root=path.dirname(fileURLToPath(import.meta.url));
const sourcePath=path.join(root,'../../content/adm/autor-20261110/adm-m06-submitted-review.js');
const source=fs.readFileSync(sourcePath,'utf8');
const packed=source.match(/ADM_SUBMITTED_REVIEW\[6\]="([^"]+)"/);
if(!packed)throw new Error('Fonte real da Revisão Guiada ADM M06 não encontrada.');
const html=gunzipSync(Buffer.from(packed[1],'base64')).toString('utf8');
const headings=[...html.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi)]
 .map(m=>m[1].replace(/<[^>]+>/g,'').trim())
 .filter(title=>/^\d{2}\s+/.test(title));
const expected=[
 '01 Por que existe processo administrativo?',
 '02 Princípios, direitos e deveres',
 '03 Como o processo começa?',
 '04 Quem pode conduzir e decidir?',
 '05 Forma e comunicação dos atos',
 '06 Instrução: apurar antes de decidir',
 '07 Decisão: concluir e explicar',
 '08 Quando a decisão precisa ser corrigida',
 '09 Quando alguém discorda da decisão',
 '10 Contagem de prazos e outras regras úteis'
];
if(headings.length!==expected.length||headings.some((title,i)=>title!==expected[i]))
 throw new Error('Os títulos da Revisão Guiada M06 mudaram; não associe as artes.');
const data=JSON.parse(fs.readFileSync(path.join(root,'data.json'),'utf8'));
if(data.module!==6||data.chapters.length!==headings.length)throw new Error('O inventário de artes não corresponde aos capítulos reais.');
for(let i=0;i<headings.length;i++){
 const chapter=data.chapters[i];
 if(chapter.chapter!==i+1||chapter.title!==headings[i].replace(/^\d{2}\s+/,''))
  throw new Error(`Título ou número divergente no capítulo ${i+1}.`);
 if(!chapter.central||chapter.cards?.length!==4||chapter.tips?.length!==2||chapter.icons?.length!==4)
  throw new Error(`Arte incompleta no capítulo ${i+1}.`);
 if(chapter.cards.some(card=>card.length!==2||!card[0]||!card[1])||!/^pegadinha/i.test(chapter.cards[3][0]))
  throw new Error(`Quadros inválidos no capítulo ${i+1}.`);
}
console.log(`Inventário validado: ${headings.length} capítulos reais da Revisão Guiada ADM M06.`);