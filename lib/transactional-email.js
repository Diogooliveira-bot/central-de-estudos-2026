import {emailConfig,deliverViaGmail} from './password-reset.js';
import {resendConfig,sendViaResend} from './resend-email.js';

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
  if(config?.provider==='resend')return sendViaResend(message,config);
  if(config?.provider==='gmail')return deliverViaGmail(message,config);
  throw new Error('Provedor de e-mail não configurado');
}
