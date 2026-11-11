// Resend transactional transport. Not wired to signup/reset until isolated tests pass.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEFAULT_FROM = 'Base Completa <notificacoes@basecompleta.com.br>';
export function resendConfig(env=process.env) {
  const apiKey=String(env.RESEND_API_KEY||'').trim();
  if(!/^re_[A-Za-z0-9_-]{12,}$/.test(apiKey))return null;
  return {apiKey,from:DEFAULT_FROM};
}
export async function sendViaResend(message,config,{fetcher=fetch}={}) {
  if(!config?.apiKey)throw new Error('Resend indisponível');
  const to=String(message?.to||'').trim();
  if(!EMAIL.test(to)||to.length>254)throw new Error('Destinatário inválido');
  const subject=String(message?.subject||'').trim();
  const text=String(message?.text||'');
  const html=String(message?.html||'');
  if(!subject||subject.length>200||(!text&&!html))throw new Error('Mensagem inválida');
  const body={from:DEFAULT_FROM,to:[to],subject};
  if(text)body.text=text;
  if(html)body.html=html;
  // No uncontrolled arbitrary sender or reply-to; branded verified domain only.
  const response=await fetcher('https://api.resend.com/emails',{
    method:'POST',
    headers:{Authorization:'Bearer '+config.apiKey,'Content-Type':'application/json'},
    body:JSON.stringify(body),
    signal:AbortSignal.timeout(10000),
  });
  if(!response.ok) {
    // Never expose transport responses: they may contain recipient addresses.
    const error=new Error('Falha no envio Resend');
    error.code='RESEND_HTTP_'+response.status;
    throw error;
  }
  const data=await response.json();
  if(typeof data?.id!=='string'||!data.id)throw new Error('Resend não confirmou aceite');
  return data.id;
}
