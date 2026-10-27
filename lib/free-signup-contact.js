import crypto from 'node:crypto';
export const CONTACT_NOTICE_VERSION='signup-whatsapp-v1-2026-10-27';
export function signupPiiKeyConfigured(env=process.env){
 return /^[a-f0-9]{64}$/i.test(String(env.BC_SIGNUP_PII_KEY||''));
}
export function normalizeWhatsapp(value){
 if(value==null||value==='')return null;
 if(typeof value!=='string'||value.length>32)throw Error('WhatsApp inválido');
 const compact=value.replace(/[()\s+.-]/g,'');
 let national=compact;
 if(compact.startsWith('55')&&(compact.length===12||compact.length===13))national=compact.slice(2);
 if(!/^[1-9]\d{9,10}$/.test(national))
  throw Error('WhatsApp inválido: informe DDD e número brasileiro');
 return '+55'+national;
}
export function protectWhatsapp(whatsapp,env=process.env){
 if(!whatsapp)return null;
 if(!signupPiiKeyConfigured(env))throw Error('Proteção de contato indisponível');
 const iv=crypto.randomBytes(12);
 const cipher=crypto.createCipheriv('aes-256-gcm',Buffer.from(env.BC_SIGNUP_PII_KEY,'hex'),iv);
 const data=Buffer.concat([cipher.update(whatsapp,'utf8'),cipher.final()]);
 return 'v1.'+iv.toString('base64url')+'.'+cipher.getAuthTag().toString('base64url')+'.'+data.toString('base64url');
}
