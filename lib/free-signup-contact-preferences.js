import {readJsonBody,requireSession,sameOriginRequest} from './auth.js';
function answer(res,status,body){
 res.statusCode=status;
 res.setHeader('Content-Type','application/json; charset=utf-8');
 res.setHeader('Cache-Control','private, no-store');
 res.setHeader('X-Content-Type-Options','nosniff');
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
      SELECT marketing_opt_in,whatsapp_ciphertext IS NOT NULL AS has_whatsapp
      FROM public.central_free_signup_contacts WHERE user_id=${user.id} LIMIT 1
   `;
   return answer(res,200,{marketingOptIn:rows[0]?.marketing_opt_in===true,
     hasWhatsapp:rows[0]?.has_whatsapp===true});
  }
  const body=await readBody(req);
  if(!['revokeMarketing','eraseWhatsapp'].includes(body?.action))
   return answer(res,400,{error:'Ação não permitida'});
  const erase=body.action==='eraseWhatsapp';
  const rows=await sql`
    UPDATE public.central_free_signup_contacts
       SET marketing_opt_in=FALSE,marketing_consent_at=NULL,
           consent_notice_version=NULL,
           whatsapp_ciphertext=CASE WHEN ${erase} THEN NULL ELSE whatsapp_ciphertext END,
           updated_at=NOW()
     WHERE user_id=${user.id}
     RETURNING user_id
  `;
  return answer(res,200,{ok:true,marketingOptIn:false,
    hasWhatsapp:erase?false:undefined,message:erase?'WhatsApp apagado':'Mensagens comerciais desautorizadas'});
 }catch(error){
  console.error('free signup contact preferences',String(error?.code||error?.name||'UNKNOWN').slice(0,20));
  return answer(res,503,{error:'Preferências temporariamente indisponíveis'});
 }
}

}
export default createContactPreferencesHandler();