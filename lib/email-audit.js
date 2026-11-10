// Histórico mínimo de e-mails: sem conteúdo, destinatário, token ou informações de estudo.
// O registro é best-effort e jamais altera o resultado do envio.
import crypto from 'node:crypto';
import {database} from './auth.js';

export function emailAuditKind(message){
  const allowed=new Set(['signup-confirmation','signup-welcome','password-reset','password-changed','premium-activated','premium-expiring','premium-expired','weekly-study','support-received']);
  return allowed.has(message?.auditKind)?message.auditKind:null;
}
export async function ensureEmailAuditTable(sql){
  await sql`
    CREATE TABLE IF NOT EXISTS public.central_email_audit (
      id BIGSERIAL PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      kind TEXT NOT NULL,
      provider TEXT NOT NULL,
      outcome TEXT NOT NULL CHECK(outcome IN ('accepted','failed')),
      recipient_hash TEXT,
      provider_id TEXT,
      error_code TEXT
    )
  `;
}
export async function auditEmailDelivery({message,config,outcome,providerId,error,env=process.env,sqlProvider=database}={}){
  const kind=emailAuditKind(message);
  if(!kind || !['accepted','failed'].includes(outcome))return false;
  const secret=String(env.AUTH_SECRET||'');
  const recipient=String(message?.to||'').toLowerCase().trim();
  const recipientHash=secret.length>=32 && recipient ? crypto.createHmac('sha256',secret).update(recipient).digest('hex') : null;
  const provider=config?.provider==='resend'?'resend':config?.provider==='gmail'?'gmail':'unknown';
  const code=outcome==='failed'?String(error?.code||error?.name||'UNKNOWN').replace(/[^A-Z0-9_]/gi,'').slice(0,40):null;
  const safeId=outcome==='accepted'&&typeof providerId==='string'?providerId.slice(0,150):null;
  try {
    const sql=sqlProvider();
    await ensureEmailAuditTable(sql);
    await sql`
      INSERT INTO public.central_email_audit (kind,provider,outcome,recipient_hash,provider_id,error_code)
      VALUES (${kind},${provider},${outcome},${recipientHash},${safeId},${code})
    `;
    return true;
  }catch(err){
    console.warn('email audit unavailable',String(err?.code||err?.name||'UNKNOWN').slice(0,32));
    return false;
  }
}
