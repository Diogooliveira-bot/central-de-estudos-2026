import fs from 'node:fs';import path from 'node:path';import zlib from 'node:zlib';import crypto from 'node:crypto';import{JSDOM}from'jsdom';
const dir=process.argv[2]||'../cpc-review/sources',urls=JSON.parse(fs.readFileSync(path.join(dir,'urls.json'))),all={};
const norm=t=>String(t).replace(/\s+/g,' ').trim();const num=t=>t.replace(/[ºo]/gi,'').replaceAll('.','').toUpperCase();
const labels={cpc:'CPC',cf:'CF/88',cc:'CC',lindb:'LINDB',arbitragem:'Lei 9.307/1996',popular:'Lei 4.717/1965',acp:'Lei 7.347/1985',cdc:'CDC',ms:'Lei 12.016/2009',mi:'Lei 13.300/2016',hd:'Lei 9.507/1997',adi:'Lei 9.868/1999',adpf:'Lei 9.882/1999',relevancia:'Lei 15.484/2026'};
for(const [law,url]of Object.entries(urls)){
 const dom=new JSDOM(fs.readFileSync(path.join(dir,law+'.html'),'utf8')),d=dom.window.document;let current;
 const root=d.querySelector('.textoNorma');let lines;
 if(root){const copy=root.cloneNode(true);copy.querySelectorAll('s,strike,del').forEach(x=>x.remove());copy.querySelectorAll('br').forEach(x=>x.replaceWith(d.createTextNode('\n')));copy.querySelectorAll('p,dir,blockquote,h2,h3').forEach(x=>x.append(d.createTextNode('\n')));lines=copy.textContent.split('\n').map(norm);}
 else lines=[...d.querySelectorAll('p')].map(p=>norm(p.textContent));
 for(let text of lines){if(!text)continue;if(law==='cf'&&/ATO DAS DISPOSIÇÕES CONSTITUCIONAIS TRANSITÓRIAS/.test(text))break;
  const match=text.match(/^Art\.\s*(\d[\d.]*)(?:[ºo])?(?:-([A-Z]))?\.?\s/);
  if(match){const key=law+':'+num(match[1])+(match[2]?'-'+match[2]:'');current=key;if(all[key]){current=null;continue;}all[key]={label:labels[law]+' · Art. '+num(match[1])+(match[2]?'-'+match[2]:''),url,paragraphs:[]};}
  if(/^(?:CAPÍTULO|TÍTULO|LIVRO|Seção|Subseção|Brasília|Este texto)/i.test(text)){current=null;continue;}
  if(current)all[current].paragraphs.push(text);
 }
 dom.window.close();
}
fs.writeFileSync('../cpc-review/laws-all.json',JSON.stringify(all));
console.log(JSON.stringify(Object.fromEntries(Object.keys(labels).map(law=>[law,Object.keys(all).filter(k=>k.startsWith(law+':')).length]))));
