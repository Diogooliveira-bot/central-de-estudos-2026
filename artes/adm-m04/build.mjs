import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {gunzipSync} from 'node:zlib';

const root=path.dirname(fileURLToPath(import.meta.url));
const sourcePath=path.join(root,'../../content/adm/autor-20261110/adm-m04-submitted-review.js');
const source=fs.readFileSync(sourcePath,'utf8');
const packed=source.match(/window\.ADM_SUBMITTED_REVIEW\s*=\s*window\.ADM_SUBMITTED_REVIEW\s*\|\|\s*\{\};\s*window\.ADM_SUBMITTED_REVIEW\[4\]\s*=\s*"([^"]+)"/);
if(!packed)throw new Error('Fonte real da Revisão Guiada do ADM M04 não encontrada.');
const review=gunzipSync(Buffer.from(packed[1],'base64')).toString('utf8');
const headings=[...review.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi)]
 .map(m=>({title:m[1].replace(/<[^>]+>/g,'').trim(),id:(m[0].match(/\bid="([^"]+)"/i)||[])[1]||''}))
 .filter(x=>/^\d{2}\s+/.test(x.title));
const expected=['01 A ideia de poder-dever e seus limites','02 Poder hierárquico: organizar e coordenar','03 Delegação, avocação e distribuição de competências','04 Poder disciplinar: apurar e responsabilizar','05 Poder regulamentar e poder normativo','06 Poder de polícia administrativa','07 Discricionariedade, vinculação e controle','08 Abuso de poder: excesso e desvio','09 Como identificar o poder em situações concretas'];
if(headings.length!==expected.length||headings.some((x,i)=>x.title!==expected[i]))throw new Error('A estrutura real da Revisão Guiada M04 mudou; interrompido para evitar associação incorreta.');
const editorial=JSON.parse(fs.readFileSync(path.join(root,'art-content.json'),'utf8'));
if(editorial.length!==headings.length)throw new Error('A quantidade de resumos editoriais não corresponde aos capítulos da revisão.');
const chapters=headings.map((chapter,i)=>{
 const art=editorial[i];
 if(!art.central||art.cards?.length!==4||art.tips?.length!==2||art.icons?.length!==4)throw new Error(`Conteúdo incompleto no capítulo ${i+1}.`);
 if(art.cards.some(card=>card.length!==2||!card[0]||!card[1])||!/^pegadinha/i.test(art.cards[3][0]))throw new Error(`Quadros inválidos no capítulo ${i+1}.`);
 return {chapter:i+1,source_id:chapter.id,title:chapter.title.replace(/^\d{2}\s+/,''),...art};
});
fs.writeFileSync(path.join(root,'data.json'),JSON.stringify({module:4,module_title:'Direito Administrativo',source:'content/adm/autor-20261110/adm-m04-submitted-review.js',chapters},null,2)+'\n');
console.log(`Mapeados ${chapters.length} capítulos reais da Revisão Guiada ADM M04.`);
