import {readJsonBody,requireSession,sameOriginRequest} from './auth.js';
import {EMAIL_MARKETING_NOTICE_VERSION} from './free-signup-contact.js';

function answer(res,status,body){
 res.statusCode=status;
 res.setHeader('Content-Type','application/json; charset=utf-8');
 res.setHeader('Cache-Control','private, no-store');
 res.setHeader('X-Content-Type-Options','nosniff');
 res.setHeader('Referrer-Policy','no-referrer');
 res.end(JSON.stringify(body));
}

export function createContactPreferencesHandler({getSession=requireSession,readBody=readJsonBody}={}){
 return async function handle(req,res){
  if(!['GET','POST'].includes(req.method))return answer(res,405,{error:'Método não permitido'});
  if(req.method==='POST'&&!sameOriginRequest(req))return answer(res,403,{error:'Origem não permitida'});
  try{
   const session=await getSession(req);
   if(!session.ok)return answer(res,session.status,{error:session.error});
   const {sql,user}=session;
   if(req.method==='GET'){
    const rows=await sql`
      SELECT marketing_opt_in,whatsapp_ciphertext IS NOT NULL AS has_whatsapp,
             email_marketing_opt_in
      FROM public.central_free_signup_contacts WHERE user_id=${user.id} LIMIT 1
    `;
    return answer(res,200,{
      marketingOptIn:rows[0]?.marketing_opt_in===true,
      hasWhatsapp:rows[0]?.has_whatsapp===true,
      emailMarketingOptIn:rows[0]?.email_marketing_opt_in===true,
      emailNoticeVersion:EMAIL_MARKETING_NOTICE_VERSION,
    });
   }
   const body=await readBody(req);
   const action=body?.action;
   if(action==='enableEmailMarketing'){
    if(body.emailMarketingOptIn!==true||body.emailNoticeVersion!==EMAIL_MARKETING_NOTICE_VERSION)
      return answer(res,400,{error:'Confirme a autorização e atualize a página para ver a versão vigente'});
    // Também atende usuários convidados que não possuem registro prévio de contato.
    // A inscrição por email não altera a preferência de WhatsApp nem cria plano pago.
    await sql`
      INSERT INTO public.central_free_signup_contacts
        (user_id,marketing_opt_in,whatsapp_ciphertext,email_marketing_opt_in,
         email_marketing_consent_at,email_marketing_notice_version,
         email_marketing_revoked_at)
      VALUES (${user.id},FALSE,NULL,TRUE,NOW(),${EMAIL_MARKETING_NOTICE_VERSION},NULL)
      ON CONFLICT (user_id) DO UPDATE SET
        email_marketing_opt_in=TRUE,
        email_marketing_consent_at=NOW(),
        email_marketing_notice_version=EXCLUDED.email_marketing_notice_version,
        email_marketing_revoked_at=NULL,updated_at=NOW()
    `;
    return answer(res,200,{ok:true,emailMarketingOptIn:true,
      message:'Autorização de e-mails comerciais registrada'});
   }
   if(action==='revokeEmailMarketing'){
    await sql`
      UPDATE public.central_free_signup_contacts
         SET email_marketing_opt_in=FALSE,
             email_marketing_revoked_at=CASE WHEN email_marketing_opt_in
               THEN NOW() ELSE email_marketing_revoked_at END,
             updated_at=NOW()
       WHERE user_id=${user.id}
    `;
    return answer(res,200,{ok:true,emailMarketingOptIn:false,
      message:'E-mails comerciais desautorizados'});
   }
   if(!['revokeMarketing','eraseWhatsapp'].includes(action))
    return answer(res,400,{error:'Ação não permitida'});
   const erase=action==='eraseWhatsapp';
   await sql`
     UPDATE public.central_free_signup_contacts
        SET marketing_opt_in=FALSE,marketing_consent_at=NULL,
            consent_notice_version=NULL,
            whatsapp_ciphertext=CASE WHEN ${erase} THEN NULL ELSE whatsapp_ciphertext END,
            updated_at=NOW()
      WHERE user_id=${user.id}
   `;
   return answer(res,200,{ok:true,marketingOptIn:false,
     hasWhatsapp:erase?false:undefined,
     message:erase?'WhatsApp apagado':'Mensagens comerciais pelo WhatsApp desautorizadas'});
  }catch(error){
   console.error('free signup contact preferences',
     String(error?.code||error?.name||'UNKNOWN').slice(0,20));
   return answer(res,503,{error:'Preferências temporariamente indisponíveis'});
  }
 };
}
export default createContactPreferencesHandler();
