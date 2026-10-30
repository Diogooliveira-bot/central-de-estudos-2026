// Links de uso único devem usar apenas a origem de Production verificada na Vercel.
// Previews e hostnames transitórios não são autorizados como origem pública.
const VERCEL_HOST = /^[a-z0-9-]+\.vercel\.app$/;
const PUBLIC_HOST = /^(?:app\.basecompleta\.com\.br|central-de-estudos(?:-ecru)?\.vercel\.app)$/;

export function validatedPublicOrigin(value) {
  const input=String(value||'').trim();
  let url;
  try{url=new URL(input)}catch{throw Error('URL pública da Central inválida')}
  if(url.protocol!=='https:'||!PUBLIC_HOST.test(url.hostname)||
    url.username||url.password||url.port||url.pathname!=='/'||
    url.search||url.hash){
    throw Error('URL pública da Central insegura ou de homologação');
  }
  return url.origin;
}

export function publicAppBase(env=process.env) {
  if(env.VERCEL_ENV==='preview'){
    // A Preview sempre gera links no próprio deployment, nunca no domínio de Production.
    const host=String(env.VERCEL_URL||'').trim().toLowerCase();
    if(!VERCEL_HOST.test(host))throw Error('Endereço seguro da Preview indisponível');
    return 'https://'+host;
  }
  if(env.VERCEL_ENV==='production'){
    // Propriedade de domínio não é presumida. Sem URL pública verificada,
    // falhar fechado em vez de enviar tokens a um deployment antigo.
    const url=String(env.BC_PUBLIC_APP_URL||env.BC_PUBLIC_URL||'').trim();
    if(!url)throw Error('BC_PUBLIC_APP_URL não configurada para produção');
    return validatedPublicOrigin(url);
  }
  throw Error('Ambiente desconhecido; endereço de cadastro indisponível');
}
