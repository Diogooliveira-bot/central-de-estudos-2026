#!/usr/bin/env node
// Auditoria QUANTITATIVA dos módulos GMF; não substitui revisão pedagógica.
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root=fileURLToPath(new URL('../',import.meta.url));
const subjects=[['atual','Atualidades',6],['fortaleza','Conhecimentos sobre Fortaleza',9],['legesp','Legislação Extravagante',11],['dh','Direitos Humanos',4]];
const chapters=[];
const memo=new Map();
function load(relative,variable){
 const key=relative+':'+variable;
 if(memo.has(key))return memo.get(key);
 const source=readFileSync(join(root,relative),'utf8');
 const match=source.match(new RegExp('window\\.'+variable+'\\s*=\\s*([\\s\\S]*?);\\s*$'));
 if(!match)throw new Error('Objeto não encontrado: '+relative+' / '+variable);
 const obj=JSON.parse(match[1]);
 memo.set(key,obj);
 return obj;
}
function wordCount(html){
 return (String(html).replace(/<[^>]*>/g,' ').replace(/&(?:[a-z]+|#\d+|#x[\da-f]+);/gi,' ').match(/[\p{L}\p{N}]+(?:[-’'][\p{L}\p{N}]+)*/gu)||[]).length;
}
for(const [disc,,total] of subjects){
 for(let number=1;number<=total;number++){
  const module='m'+String(number).padStart(2,'0');
  for(const mode of ['full','review']){
   const relative=number===1?'content/gmf/m01-'+mode+'-v1.js':'content/gmf/'+disc+'/'+module+'-'+mode+'-v1.js';
   const variable=number===1?'GMF_M01_'+mode.toUpperCase():'GMF_MODULE_'+mode.toUpperCase();
   const payload=load(relative,variable);
   const data=number===1?payload[disc]:payload;
   if(!data||!Array.isArray(data.chapters)||!data.chapters.length)throw new Error('Capítulos ausentes: '+disc+' '+module+' '+mode);
   data.chapters.forEach((chapter,index)=>chapters.push({
    disc,module,mode,number:index+1,title:chapter.title,words:wordCount(chapter.html),
    example:/exemplo|situaç[aã]o|caso prático/i.test(chapter.html),
    table:/<table[\s>]/i.test(chapter.html),list:/<(?:ul|ol)[\s>]/i.test(chapter.html),
    sources:data.resources?.length||0
   }));
  }
 }
}
function sum(items){return items.reduce((a,v)=>a+v.words,0)}
function avg(items){return Math.round(sum(items)/items.length)}
const full=chapters.filter(x=>x.mode==='full');
const review=chapters.filter(x=>x.mode==='review');
const short=review.filter(x=>x.words<100);
const quote=value=>'"'+String(value??'').replace(/"/g,'""')+'"';
const header=['Disciplina','Modulo','Modalidade','Capitulo','Titulo','Palavras','Menciona_exemplo','Tem_tabela','Tem_lista','Fontes_do_modulo','Alerta_automatico','Avaliacao_pedagogica'];
const csv=[header,...chapters.map(x=>[x.disc,x.module,x.mode,x.number,x.title,x.words,x.example?'sim':'nao',x.table?'sim':'nao',x.list?'sim':'nao',x.sources,x.mode==='review'&&x.words<100?'revisão curta':'','PENDENTE de análise individual'])].map(row=>row.map(quote).join(',')).join('\n')+'\n';
const md=[
 '# Inventário quantitativo da GMF — PR #394','',
 '**Origem:** arquivos atuais de content/gmf. **Gerado em:** '+new Date().toISOString().slice(0,10)+'.','',
 '> Este inventário NÃO comprova qualidade jurídica, pedagógica ou funcionamento do leitor. A aprovação requer leitura e avaliação de cada capítulo.',
 '',
 '## Números gerais','',
 '- Módulos: 30, cada um com Conteúdo Completo e Revisão Guiada.',
 '- Total de capítulos: '+chapters.length+' ('+full.length+' teoria; '+review.length+' revisão).',
 '- Teoria: '+sum(full)+' palavras; média '+avg(full)+'; mínimo '+Math.min(...full.map(x=>x.words))+'; máximo '+Math.max(...full.map(x=>x.words))+'.',
 '- Revisão: '+sum(review)+' palavras; média '+avg(review)+'; mínimo '+Math.min(...review.map(x=>x.words))+'; máximo '+Math.max(...review.map(x=>x.words))+'.',
 '- Revisões com menos de 100 palavras: '+short.length+' (triagem prioritária, não reprovação).','',
 '## Resumo por módulo','',
 '| Disciplina | Módulo | Capítulos teoria | Média teoria | Capítulos revisão | Média revisão | Revisões abaixo de 100 palavras | Status |',
 '|---|---|---:|---:|---:|---:|---:|---|'
];
for(const [disc,name,total] of subjects)for(let n=1;n<=total;n++){
 const module='m'+String(n).padStart(2,'0');
 const f=full.filter(x=>x.disc===disc&&x.module===module);
 const r=review.filter(x=>x.disc===disc&&x.module===module);
 md.push('| '+name+' | '+module.toUpperCase()+' | '+f.length+' | '+avg(f)+' | '+r.length+' | '+avg(r)+' | '+r.filter(x=>x.words<100).length+' | Pendente de auditoria pedagógica |');
}
md.push('','## Revisões para inspeção prioritária','',
 '| Disciplina | Módulo | Capítulo | Palavras |','|---|---|---|---:|');
for(const x of short){
 const name=subjects.find(s=>s[0]===x.disc)[1];
 md.push('| '+name+' | '+x.module.toUpperCase()+' | '+String(x.title).replace(/\|/g,'/')+' | '+x.words+' |');
}
md.push('','## Limitações','',
 '- Contagem automática de palavras após remover tags HTML e entidades.',
 '- Os marcadores de exemplos, tabelas e listas no CSV são heurísticos e não equivalem a avaliação didática.',
 '- Não há validação jurídica, confrontação integral com o edital ou teste visual autenticado nesta rotina.',
 '- Cada capítulo ainda exige leitura integral, correção seletiva e testes.','');
mkdirSync(join(root,'reports'),{recursive:true});
writeFileSync(join(root,'reports/gmf-chapter-inventory.csv'),csv,'utf8');
writeFileSync(join(root,'reports/gmf-chapter-inventory.md'),md.join('\n')+'\n','utf8');
console.log('GMF: '+chapters.length+' capítulos; '+full.length+' teoria, '+review.length+' revisão, '+short.length+' revisões abaixo de 100 palavras.');
