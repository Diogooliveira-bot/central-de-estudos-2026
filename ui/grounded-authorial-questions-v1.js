/* Base Completa — questões discursivas autorais ancoradas na teoria publicada.
 * NÃO usa bancos de concursos nem inventa gabaritos: extrai a resposta do próprio
 * módulo e apresenta perguntas de recuperação ativa. Uso em prévia até auditoria.
 */
(function(g){
'use strict';
if(g.BcGroundedQuestions)return;
const clean=s=>String(s||'').replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/[\u00a0\t]+/g,' ').replace(/\s+/g,' ').trim();
const BAD=/^(?:base completa|vers[aã]o|resumo|como usar|conte[uú]do|p[aá]gina|conclus[aã]o|revis[aã]o ativa|quest[õo]es?|gabarito|explica[çc][aã]o|atividade|bloco [ab]|aula \d+|exerc[ií]cio)/i;
function safe(s){return clean(s).replace(/\b(?:www\.|https?:\/\/)\S+/g,'').trim()}
function accept(topic,body){
 const t=safe(topic),b=safe(body);
 return t.length>=7&&t.length<=145&&b.length>=75&&b.length<=1100&&!BAD.test(t)&&!/gabarito|correta\s*[:]|[A-E]\)\s.+[A-E]\)\s/i.test(b);
}
function fromMarkup(markup){
 const root=document.createElement('div');root.innerHTML=String(markup||'');
 root.querySelectorAll('script,style,nav,footer,.pta-question,.pta-feedback,details.question,.questions,.qgrid').forEach(x=>x.remove());
 const result=[];
 for(const h of root.querySelectorAll('h2,h3,h4')){
  const topic=safe(h.textContent);
  let body='',n=h.nextElementSibling;
  for(let k=0;n&&k<5;k++,n=n.nextElementSibling){
   if(/^H[1-6]$/.test(n.tagName))break;
   if(n.matches('details,.pta-question,.pt-module-finish'))continue;
   body+=' '+(n.textContent||'');
   if(body.length>=170)break;
  }
  if(accept(topic,body))result.push({topic,body:safe(body)});
 }
 if(result.length<10){
  // Em resumos com poucas seções, recuperar blocos explicativos independentes.
  // Alternativas, listas de gabarito e exercícios de fixação não entram.
  const blocks=[...root.querySelectorAll('p,li')];
  for(let i=0;i<blocks.length&&result.length<30;i++){
   const el=blocks[i];
   if(el.closest('details,article.q,.qgrid,.questions,.pta-question,.pta-feedback,[data-pta-source-hidden]'))continue;
   const body=safe(el.textContent);
   if(body.length<90||body.length>850||/^[A-E][).]\s|^Gabarito\s*:|^Quest[aã]o\s*\d/i.test(body))continue;
   const topic=(body.match(/^.{1,95}?[.!?:](?:\s|$)/)?.[0]||body.slice(0,90)).trim();
   if(accept(topic,body))result.push({topic,body});
  }
 }
 return result;
}
function fromText(text){
 const lines=String(text||'').replace(/\r/g,'').split(/\n/).map(s=>s.trim()).filter(Boolean);
 const result=[];
 for(let i=0;i<lines.length;i++){
  const line=lines[i],m=/^((?:\d{1,2}(?:\.\d{1,2}){0,2})[.)]?\s+)(.{7,120})$/.exec(line);
  if(!m||/^(?:Quest[aã]o|Q\d+|[A-E]\))/i.test(m[2]))continue;
  const topic=safe(m[2]);
  let body='';
  for(let j=i+1;j<lines.length&&j<=i+6;j++){
   if(/^\d{1,2}(?:\.\d{1,2}){0,2}[.)]?\s+.{7,}/.test(lines[j]))break;
   body+=' '+lines[j];
   if(body.length>240)break;
  }
  if(accept(topic,body))result.push({topic,body:safe(body)});
 }
 // PDF compactado em linhas corridas: usa parágrafos suficientemente substanciais.
 if(result.length<10){
  let current='';
  for(const line of lines){
   if(/^(?:BASE COMPLETA|CPC M\d\d|M\d\d|Fonte:|Quest[aã]o \d+)/i.test(line))continue;
   if(line.length<25){current='';continue}
   current+=' '+line;
   if(current.length>=230){
    const body=safe(current),topic=body.split(/[.;:]/)[0].slice(0,110);
    if(accept(topic,body))result.push({topic,body});
    current='';
   }
  }
 }
 return result;
}
const prompts=[
 topic=>'Qual é a regra ou ideia central explicada em “'+topic+'”?',
 topic=>'Que ponto essencial o módulo apresenta em “'+topic+'”?',
 topic=>'Como você explicaria o conteúdo da seção “'+topic+'”?',
 topic=>'Qual orientação jurídica ou conceitual é dada em “'+topic+'”?',
 topic=>'Qual conhecimento deve ser lembrado sobre “'+topic+'”?',
 topic=>'O que a leitura ensina a respeito de “'+topic+'”?',
 topic=>'Resuma, com suas palavras, o fundamento apresentado em “'+topic+'”.',
 topic=>'Que informação é indispensável na revisão de “'+topic+'”?',
 topic=>'Explique o aspecto principal de “'+topic+'”.',
 topic=>'Que regra, condição ou consequência foi apresentada em “'+topic+'”?'
];
function build({html='',text='',discipline='',module='',title=''}={}){
 const blocks=[...fromMarkup(html),...fromText(text)],result=[],seen=new Set();
 for(const b of blocks){
  const k=b.topic.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ');
  if(seen.has(k)||result.length>=10)continue;seen.add(k);
  const i=result.length;
  result.push({id:'grounded-'+i+1,type:'open',q:prompts[i](b.topic),
   answerText:b.body.slice(0,550),
   explanation:'Resposta fundamentada no texto do módulo. Compare com a leitura para consolidar este ponto.'});
 }
 return result;
}
g.BcGroundedQuestions=Object.freeze({build,fromText,fromMarkup});
})(window);
