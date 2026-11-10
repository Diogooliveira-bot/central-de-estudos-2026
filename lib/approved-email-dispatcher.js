// Server-only sender for verified business events.
// Does not create a public API or a scheduler. All campaigns are disabled by default.
import {transactionalEmailConfig,sendTransactionalEmail} from './transactional-email.js';
import {APPROVED_EMAIL_TYPES,renderApprovedEmail} from './approved-email-packs.js';
const RELATIONSHIP=new Set(['primeiro-estudo','resumo-semanal','novos-materiais']);
const TYPES=new Set(APPROVED_EMAIL_TYPES);
export async function sendApprovedEventEmail({
 type,to,fields,verifiedEventId,marketingConsent=false,
 env=process.env,transport=sendTransactionalEmail
}={}){
 if(!TYPES.has(type))throw new Error('Tipo de e-mail desconhecido');
 if(typeof verifiedEventId!=='string'||verifiedEventId.length<8||verifiedEventId.length>160)
  throw new Error('Disparo sem evento verificado');
 if(RELATIONSHIP.has(type)&&marketingConsent!==true)
  throw new Error('Consentimento de relacionamento não concedido');
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(to||'')))
  throw new Error('Destinatário inválido');
 const config=transactionalEmailConfig(env);
 if(!config)throw new Error('Provedor de e-mail indisponível');
 const mail=renderApprovedEmail(type,fields);
 return transport({from:config.from,to,...mail},config);
}
