import { requireSession, sameOriginRequest } from '../lib/auth.js';

function send(res,status,body){
  res.statusCode=status;
  res.setHeader('Content-Type','application/json; charset=utf-8');
  res.setHeader('Cache-Control','no-store');
  res.end(JSON.stringify(body));
}
async function readJsonBody(req){
  if(req.body&&typeof req.body==='object')return req.body;
  if(typeof req.body==='string')return JSON.parse(req.body||'{}');
  const chunks=[];for await(const chunk of req)chunks.push(chunk);
  const raw=Buffer.concat(chunks).toString('utf8');
  return raw?JSON.parse(raw):{};
}
function cleanMatch(match){
  return {
    message:String(match?.message||''),
    shortMessage:String(match?.shortMessage||''),
    offset:Number(match?.offset||0),
    length:Number(match?.length||0),
    replacements:Array.isArray(match?.replacements)?match.replacements.slice(0,5).map(r=>({value:String(r?.value||'')})):[],
    rule:{id:String(match?.rule?.id||''),issueType:String(match?.rule?.issueType||'')}
  };
}
export default async function handler(req,res){
  try{
    if(req.method!=='POST'){res.setHeader('Allow','POST');return send(res,405,{error:'Método não permitido'})}
    if(!sameOriginRequest(req))return send(res,403,{error:'Origem da requisição não permitida'});
    const auth=await requireSession(req,['admin','editor']);
    if(!auth.ok)return send(res,auth.status,{error:auth.error});
    const body=await readJsonBody(req);
    const text=String(body?.text||'').trim();
    const language=String(body?.language||'pt-BR').trim()||'pt-BR';
    if(!text)return send(res,400,{error:'Texto não informado'});
    if(text.length>50000)return send(res,413,{error:'Texto muito longo para revisão'});
    const form=new URLSearchParams();
    form.set('text',text);form.set('language',language);
    const controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),12000);
    let response;
    try{
      response=await fetch('https://api.languagetool.org/v2/check',{
        method:'POST',
        headers:{'Content-Type':'application/x-www-form-urlencoded','Accept':'application/json'},
        body:form.toString(),
        signal:controller.signal
      });
    }finally{clearTimeout(timer)}
    if(!response.ok)return send(res,502,{error:'Serviço de revisão indisponível no momento'});
    const data=await response.json();
    return send(res,200,{language:data?.language?.code||language,matches:Array.isArray(data?.matches)?data.matches.map(cleanMatch):[]});
  }catch(error){
    console.error('spellcheck error',error);
    return send(res,500,{error:error?.name==='AbortError'?'A revisão demorou mais que o esperado':'Falha interna na revisão ortográfica'});
  }
}
