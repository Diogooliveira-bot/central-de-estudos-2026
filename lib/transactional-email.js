import {emailConfig,deliverViaGmail} from './password-reset.js';
import {resendConfig,sendViaResend} from './resend-email.js';
import {auditEmailDelivery,emailAuditKind} from './email-audit.js';

// Opt-in only: existing Gmail behaviour remains the default.
export function transactionalEmailConfig(env=process.env) {
  if(env.BC_EMAIL_PROVIDER==='resend') {
    const cfg=resendConfig(env);
    return cfg ? {...cfg,provider:'resend'} : null;
  }
  const cfg=emailConfig(env);
  return cfg ? {...cfg,provider:'gmail'} : null;
}
export async function sendTransactionalEmail(message,config) {
  const transport=config?.provider==='resend'?sendViaResend:
    config?.provider==='gmail'?deliverViaGmail:null;
  if(!transport)throw new Error('Provedor de e-mail não configurado');
  // O histórico é registrado apenas para modelos com tipo aprovado explícito.
  try{
    const providerId=await transport(message,config);
    if(emailAuditKind(message))await auditEmailDelivery({message,config,outcome:'accepted',providerId});
    return providerId;
  }catch(error){
    if(emailAuditKind(message))await auditEmailDelivery({message,config,outcome:'failed',error});
    throw error;
  }
}
