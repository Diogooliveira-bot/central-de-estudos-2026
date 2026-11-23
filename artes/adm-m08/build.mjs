import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { gunzipSync } from 'node:zlib';

const root=path.dirname(fileURLToPath(import.meta.url));
const sourcePath=path.join(root,'../../content/adm/autor-20261110/adm-m08-submitted-review.js');
const source=fs.readFileSync(sourcePath,'utf8');
const packed=source.match(/ADM_SUBMITTED_REVIEW\[8\]="([^"]+)"/);
if(!packed)throw new Error('Fonte real da Revisão Guiada ADM M08 não encontrada.');
const html=gunzipSync(Buffer.from(packed[1],'base64')).toString('utf8');
const headings=[...html.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi)]
 .map(m=>m[1].replace(/<[^>]+>/g,'').trim())
 .filter(title=>/^\d{2}\s+/.test(title));
const expected=[
 '01 Por que o Estado precisa ser controlado',
 '02 Formas de classificar o controle',
 '03 Controle administrativo e autotutela',
 '04 Controle interno em cada Poder',
 '05 Controle externo e Poder Legislativo',
 '06 Tribunais de Contas: função e competências',
 '07 Controle judicial e seus limites',
 '08 Controle social e transparência',
 '09 Uma situação concreta reunindo os controles',
 '10 Como as modalidades se relacionam'
];
if(headings.length!==expected.length||headings.some((title,i)=>title!==expected[i]))
 throw new Error('Os títulos da Revisão Guiada M08 mudaram; não associe as artes.');
const didactic=fs.readFileSync(path.join(root,'../../content/adm/adm-review-didactic-m06-m10.js'),'utf8');
const expectedThemes=[
 'O que significa controle administrativo?',
 'Autotutela e controle por recurso',
 'Controle externo e Tribunais de Contas',
 'Controle interno e responsabilidade institucional',
 'Controle judicial e participação do cidadão'
];
const module8=didactic.slice(didactic.indexOf('\n8:{'),didactic.indexOf('\n9:{'));
for(const title of expectedThemes)if(!module8.includes(title))throw new Error(`Seção didática M08 não localizada: ${title}`);
const data=JSON.parse(fs.readFileSync(path.join(root,'data.json'),'utf8'));
if(data.module!==8||data.chapters.length!==headings.length)throw new Error('O inventário de artes não corresponde aos capítulos reais.');
for(let i=0;i<headings.length;i++){
 const chapter=data.chapters[i];
 if(chapter.chapter!==i+1||chapter.title!==headings[i].replace(/^\d{2}\s+/,''))
  throw new Error(`Título ou número divergente no capítulo ${i+1}.`);
 if(!chapter.central||chapter.cards?.length!==4||chapter.tips?.length!==2||chapter.icons?.length!==4)
  throw new Error(`Arte incompleta no capítulo ${i+1}.`);
 if(chapter.cards.some(card=>card.length!==2||!card[0]||!card[1])||!/^pegadinha/i.test(chapter.cards[3][0]))
  throw new Error(`Quadros inválidos no capítulo ${i+1}.`);
}
console.log(`Inventário validado: ${headings.length} capítulos da Revisão Guiada e 5 seções didáticas M08.`);
