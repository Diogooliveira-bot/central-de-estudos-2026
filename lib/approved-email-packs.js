// Catálogo dos nove modelos aprovados em 30/10/2026 (Pacotes 2 e 3).
// Modelos prontos para uso por ações autenticadas do servidor.
// Não habilitar disparos em massa, campanhas ou cobranças por este módulo.
import activated from './email-packs/premium-ativado.js';
import expiring from './email-packs/premium-perto-do-vencimento.js';
import expired from './email-packs/premium-expirado.js';
import refunded from './email-packs/reembolso-confirmado.js';
import cancelled from './email-packs/cancelamento-confirmado.js';
import firstStudy from './email-packs/primeiro-estudo.js';
import weekly from './email-packs/resumo-semanal.js';
import materials from './email-packs/novos-materiais.js';
import support from './email-packs/suporte-recebido.js';

const TEMPLATES=Object.freeze({
 'premium-ativado':activated,
 'premium-perto-do-vencimento':expiring,
 'premium-expirado':expired,
 'reembolso-confirmado':refunded,
 'cancelamento-confirmado':cancelled,
 'primeiro-estudo':firstStudy,
 'resumo-semanal':weekly,
 'novos-materiais':materials,
 'suporte-recebido':support,
});
const PLACEHOLDER=/{{([A-Z][A-Z0-9_]*)}}/g;
const URL_KEYS=/^LINK_/;
const PERCENTAGE_KEYS=new Set(['PERCENTUAL_BARRA','PERCENTUAL_PLANEJADO','APROVEITAMENTO']);
export const APPROVED_EMAIL_TYPES=Object.freeze(Object.keys(TEMPLATES));
export function escapeApprovedValue(value){
 return String(value??'').replace(/[&<>"']/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
}
function safeLink(value){
 let url;
 try{url=new URL(String(value));}catch{throw new Error('Link inválido para e-mail');}
 const host=url.hostname.toLowerCase();
 const valid=host==='app.basecompleta.com.br'||host==='basecompleta.com.br'||
  host==='central-de-estudos-ecru.vercel.app'||
  /^central-de-estudos-[a-z0-9-]+-estudotd\.vercel\.app$/.test(host);
 if(url.protocol!=='https:'||!valid||url.username||url.password||url.port)
  throw new Error('Link de e-mail não autorizado');
 return url.toString();
}
function normalizedValue(key,value){
 if(value===null||value===undefined||String(value).trim()==='')
  throw new Error('Campo de e-mail obrigatório: '+key);
 if(URL_KEYS.test(key))return safeLink(value);
 if(key==='PERCENTUAL_BARRA'){
  const n=Number(value);
  if(!Number.isFinite(n)||n<0||n>100)throw new Error('Percentual inválido');
  return String(Math.round(n));
 }
 if(PERCENTAGE_KEYS.has(key)&&!/^(\d{1,3})([.,]\d{1,2})?%?$/.test(String(value)))
  throw new Error('Percentual inválido');
 const str=String(value).trim();
 if(str.length>500)throw new Error('Campo de e-mail muito longo: '+key);
 return str;
}
export function renderApprovedEmail(type,fields){
 const template=TEMPLATES[type];
 if(!template)throw new Error('Modelo de e-mail desconhecido');
 if(!fields||typeof fields!=='object'||Array.isArray(fields))throw new Error('Dados de e-mail ausentes');
 const render=(source,html=false)=>String(source).replace(PLACEHOLDER,(_,key)=>{
  if(!Object.hasOwn(fields,key))throw new Error('Campo de e-mail obrigatório: '+key);
  const value=normalizedValue(key,fields[key]);
  return html?escapeApprovedValue(value):value;
 });
 const subject=render(template.subject);
 const html=render(template.html,true);
 const text=render(template.text);
 if(PLACEHOLDER.test(subject+html+text))throw new Error('Marcador não preenchido');
 if(subject.length>200)throw new Error('Assunto demasiado longo');
 return {subject,html,text};
}
