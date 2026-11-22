import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.dirname(fileURLToPath(import.meta.url));
const sourcePath=path.join(root,'../../content/adm/autor-20261110/adm-m07-submitted-review.js');
const source=fs.readFileSync(sourcePath,'utf8');
const packed=source.match(/window\.ADM_SUBMITTED_REVIEW\s*=\s*window\.ADM_SUBMITTED_REVIEW\s*\|\|\s*\{\};\s*window\.ADM_SUBMITTED_REVIEW\[7\]\s*=\s*"([^"]+)"/);
if(!packed)throw new Error('Fonte real da Revisão Guiada do ADM M07 não encontrada.');
const review=Buffer.from(packed[1],'base64');
const {gunzipSync}=await import('node:zlib');
const html=gunzipSync(review).toString('utf8');
const headings=[...html.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi)]
 .map(m=>({title:m[1].replace(/<[^>]+>/g,'').trim(),id:(m[0].match(/\bid="([^"]+)"/i)||[])[1]||''}))
 .filter(x=>/^\d{2}\s+/.test(x.title));
const expected=['01 Por que a LINDB importa para a Administração?','02 Art. 20 — consequências práticas e motivação','03 Art. 21 — invalidação e regularização','04 Art. 22 — dificuldades reais da gestão pública','05 Arts. 23 e 24 — segurança diante de mudanças','06 Art. 26 — compromisso para resolver problemas','07 Art. 27 — compensações por efeitos injustos','08 Art. 28 — responsabilização por dolo ou erro grosseiro','09 Arts. 29 e 30 — participação e previsibilidade','10 Como o Decreto nº 9.830/2019 complementa a LINDB'];
if(headings.length!==expected.length||headings.some((x,i)=>x.title!==expected[i]))throw new Error('A estrutura real da Revisão Guiada M07 mudou; interrompido para evitar associação incorreta.');
const editorial=JSON.parse(fs.readFileSync(path.join(root,'art-content.json'),'utf8'));
if(editorial.length!==headings.length)throw new Error('A quantidade de resumos editoriais não corresponde aos capítulos da revisão.');
const chapters=headings.map((chapter,i)=>{
 const art=editorial[i];
 if(!art.central||art.cards?.length!==4||art.tips?.length!==2||art.icons?.length!==4)throw new Error(`Conteúdo incompleto no capítulo ${i+1}.`);
 if(art.cards.some(card=>card.length!==2||!card[0]||!card[1])||!/^pegadinha/i.test(art.cards[3][0]))throw new Error(`Quadros inválidos no capítulo ${i+1}.`);
 return {chapter:i+1,source_id:chapter.id,title:chapter.title.replace(/^\d{2}\s+/,''),...art};
});
fs.writeFileSync(path.join(root,'data.json'),JSON.stringify({module:7,module_title:'Direito Administrativo',source:'content/adm/autor-20261110/adm-m07-submitted-review.js',chapters},null,2)+'\n');
console.log(`Mapeados ${chapters.length} capítulos reais da Revisão Guiada ADM M07.`);
