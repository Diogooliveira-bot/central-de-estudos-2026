import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {gunzipSync} from 'node:zlib';

const root=path.dirname(fileURLToPath(import.meta.url));
const sourcePath=path.join(root,'../../content/adm/autor-20261110/adm-m02-submitted-review.js');
const source=fs.readFileSync(sourcePath,'utf8');
const packed=source.match(/window\.ADM_SUBMITTED_REVIEW\s*=\s*window\.ADM_SUBMITTED_REVIEW\s*\|\|\s*\{\};\s*window\.ADM_SUBMITTED_REVIEW\[2\]\s*=\s*"([^"]+)"/);
if(!packed)throw new Error('Fonte real da revisão guiada do ADM M02 não encontrada.');
const review=gunzipSync(Buffer.from(packed[1],'base64')).toString('utf8');
const headings=[...review.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi)]
 .map(m=>({title:m[1].replace(/<[^>]+>/g,'').trim(),id:(m[0].match(/\bid="([^"]+)"/i)||[])[1]||''}))
 .filter(x=>/^\d{2}\s+/.test(x.title));
const editorial=JSON.parse(fs.readFileSync(path.join(root,'art-content.json'),'utf8'));
if(headings.length!==9||editorial.length!==headings.length)throw new Error(`A fonte contém ${headings.length} capítulos; eram esperados nove resumos editoriais.`);
const chapters=headings.map((chapter,i)=>{
 const art=editorial[i];
 if(!chapter.title.startsWith(String(i+1).padStart(2,'0')+' ')||!art.central||art.cards?.length!==4||art.tips?.length!==2||art.icons?.length!==4)throw new Error(`Conteúdo incompleto ou fora da ordem no capítulo ${i+1}.`);
 if(art.cards.some((card,j)=>card.length!==2||!card[0]||!card[1])||!/^pegadinha/i.test(art.cards[3][0]))throw new Error(`Quadros inválidos no capítulo ${i+1}.`);
 return {chapter:i+1,source_id:chapter.id,title:chapter.title.replace(/^\d{2}\s+/,''),...art};
});
fs.writeFileSync(path.join(root,'data.json'),JSON.stringify({module:2,module_title:'Direito Administrativo',source:'content/adm/autor-20261110/adm-m02-submitted-review.js',chapters},null,2)+'\n');
console.log(`Mapped ${chapters.length} original M02 chapters from the submitted guided review.`);
