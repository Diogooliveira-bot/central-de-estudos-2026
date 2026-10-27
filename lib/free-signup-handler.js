import crypto from 'node:crypto';
import { createSessionToken,database,hashPassword,normalizeEmail,publicUser,sameOriginRequest,sessionCookie,validatePassword } from './auth.js';
import { safeSignupBody,signupCaptchaConfigured,signupCaptchaPartial,verifiedClientIp,verifySignupBot } from './free-signup-security.js';
import { deliverViaGmail,emailConfig,rateIdentity,resetPageBase } from './password-reset.js';
import { normalizeWhatsapp,protectWhatsapp,signupPiiKeyConfigured,CONTACT_NOTICE_VERSION } from './free-signup-contact.js';
const GENERIC='Se o e-mail estiver disponível, você receberá um link de confirmação. Verifique também o spam.';
export function freeSignupEnabled(env=process.env){
  if(env.BC_PUBLIC_FREE_SIGNUP_ENABLED!=='true'||signupCaptchaPartial(env))return false;
  if(env.VERCEL_ENV==='preview')return env.BC_FREE_SIGNUP_PREVIEW_ISOLATED==='YES';
  if(env.VERCEL_ENV==='production')return env.BC_PUBLIC_FREE_SIGNUP_PRODUCTION_APPROVED==='YES'
    && env.BC_SIGNUP_PRIVACY_APPROVED==='YES' && signupCaptchaConfigured(env)
    && signupPiiKeyConfigured(env);
  return false;
}
function send(res,status,data,cookie){
  res.statusCode=status;
  res.setHeader('Content-Type','application/json; charset=utf-8');
  res.setHeader('Cache-Control','private, no-store');
  res.setHeader('Referrer-Policy','no-referrer');
  res.setHeader('X-Content-Type-Options','nosniff');
  if(cookie)res.setHeader('Set-Cookie',cookie);
  res.end(JSON.stringify(data));
}
async function rate(sql,hash,limit,seconds){
  const rows=await sql`
    INSERT INTO public.central_free_signup_limits(identity_hash,window_start,last_requested_at,attempt_count)
    VALUES (${hash},NOW(),NOW(),1)
    ON CONFLICT (identity_hash) DO UPDATE SET
      window_start=CASE WHEN central_free_signup_limits.window_start<NOW()-INTERVAL '1 hour'
        THEN NOW() ELSE central_free_signup_limits.window_start END,
      attempt_count=CASE WHEN central_free_signup_limits.window_start<NOW()-INTERVAL '1 hour'
        THEN 1 ELSE central_free_signup_limits.attempt_count+1 END,
      last_requested_at=NOW()
    WHERE central_free_signup_limits.window_start<NOW()-INTERVAL '1 hour'
      OR (central_free_signup_limits.attempt_count<${limit}
        AND central_free_signup_limits.last_requested_at<NOW()-${seconds}*INTERVAL '1 second')
    RETURNING identity_hash
  `;
  return rows.length>0;
}
export function createFreeSignupHandler({env=process.env,sqlProvider=database,sendEmail=deliverViaGmail,botVerifier=verifySignupBot}={}){
  return async function handle(req,res){
    try{
      if(req.method!=='POST'||!sameOriginRequest(req))return send(res,403,{error:'Método ou origem não permitidos'});
      if(!freeSignupEnabled(env))return send(res,503,{error:'Cadastro gratuito ainda não liberado'});
      const config=emailConfig(env);
      if(!config)return send(res,503,{error:'Confirmação de e-mail indisponível'});
      const body=await safeSignupBody(req);
      const action=String(body.action||'request');
      const sql=sqlProvider();
      if(action==='request'){
        const name=String(body.name||'').trim().replace(/\s+/g,' ').slice(0,120);
        const email=normalizeEmail(body.email);
        const password=String(body.password||'');
        if(name.length<2||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
          return send(res,400,{error:'Informe nome e e-mail válidos'});
        const passwordError=validatePassword(password);
        if(passwordError)return send(res,400,{error:passwordError});
        if(password.length<12)return send(res,400,{error:'Use uma senha de pelo menos 12 caracteres'});
        let whatsapp;
        try { whatsapp=normalizeWhatsapp(body.whatsapp); }
        catch(_) {return send(res,400,{error:'WhatsApp inválido; informe DDD e número ou deixe em branco'});}
        const marketingOptIn=body.marketingOptIn===true;
        if(marketingOptIn&&!whatsapp)return send(res,400,{error:'Informe um WhatsApp para autorizar mensagens comerciais'});
        if(whatsapp&&!signupPiiKeyConfigured(env))return send(res,503,{error:'Proteção do WhatsApp indisponível'});
        const whatsappCiphertext=protectWhatsapp(whatsapp,env);
        if(signupCaptchaConfigured(env) && !await botVerifier({
          token:body.turnstileToken,requestHost:req.headers?.host,env
        }))return send(res,403,{error:'Não foi possível confirmar a verificação de segurança'});
        if(!await rate(sql,rateIdentity('signup-email',email,env.AUTH_SECRET),3,90))
          return send(res,200,{ok:true,message:GENERIC});
        const ip=env.VERCEL_ENV==='production' ? verifiedClientIp(req) :
          (verifiedClientIp(req)||String(req.headers?.['x-real-ip']||'').trim());
        if(!ip||!await rate(sql,rateIdentity('signup-ip',ip,env.AUTH_SECRET),12,20))
          return send(res,200,{ok:true,message:GENERIC});
        const previous=await sql`SELECT 1 FROM public.central_users WHERE LOWER(email)=${email} LIMIT 1`;
        if(previous.length)return send(res,200,{ok:true,message:GENERIC});
        const token=crypto.randomBytes(32).toString('base64url');
        const tokenHash=crypto.createHash('sha256').update(token).digest('hex');
        const passwordHash=hashPassword(password);
        await sql`
          INSERT INTO public.central_free_signup_pending(token_hash,email,name,password_hash,expires_at,
            whatsapp_ciphertext,marketing_opt_in,consent_notice_version)
          VALUES (${tokenHash},${email},${name},${passwordHash},NOW()+INTERVAL '30 minutes',
            ${whatsappCiphertext},${marketingOptIn},${marketingOptIn?CONTACT_NOTICE_VERSION:null})
          ON CONFLICT (email) DO UPDATE SET
            token_hash=EXCLUDED.token_hash,name=EXCLUDED.name,password_hash=EXCLUDED.password_hash,
            created_at=NOW(),expires_at=EXCLUDED.expires_at,
            whatsapp_ciphertext=EXCLUDED.whatsapp_ciphertext,
            marketing_opt_in=EXCLUDED.marketing_opt_in,
            consent_notice_version=EXCLUDED.consent_notice_version
        `;
        const url=resetPageBase(env)+'/cadastro-gratuito.html#token='+encodeURIComponent(token);
        const message={
          from:config.from,to:email,subject:'Confirme seu cadastro gratuito — Base Completa',
          text:'Para confirmar seu cadastro gratuito, abra o link em até 30 minutos:\n'+url+
            '\nSe não solicitou, ignore esta mensagem.',
          html:'<p>Confirme seu cadastro gratuito na Base Completa.</p><p><a href="'+url+'">Confirmar e-mail</a></p>'+
            '<p>Link válido por 30 minutos, apenas uma vez.</p>',
        };
        try{await sendEmail(message,config);}catch(_){
          return send(res,503,{error:'Não foi possível enviar o e-mail. Tente novamente mais tarde'});
        }
        return send(res,200,{ok:true,message:GENERIC});
      }
      if(action==='confirm'){
        const token=String(body.token||'');
        if(!/^[A-Za-z0-9_-]{43}$/.test(token))
          return send(res,410,{error:'Link inválido ou expirado'});
        const digest=crypto.createHash('sha256').update(token).digest('hex');
        const id=crypto.randomUUID(),subscriptionId=crypto.randomUUID();
        // Um único comando atômico: consome token, cria aluno, concede SOMENTE free, audita.
        const rows=await sql`
          WITH claimed AS (
            DELETE FROM public.central_free_signup_pending
            WHERE token_hash=${digest} AND expires_at>NOW()
            RETURNING email,name,password_hash,whatsapp_ciphertext,marketing_opt_in,consent_notice_version
          ), created AS (
            INSERT INTO public.central_users (user_id,name,email,role,password_hash,active)
            SELECT ${id},name,email,'aluno',password_hash,TRUE FROM claimed
            ON CONFLICT DO NOTHING
            RETURNING user_id,name,email,role,active,session_version,created_at,updated_at,last_login
          ), assigned AS (
            INSERT INTO public.central_user_subscriptions
              (subscription_id,user_id,plan_code,status,starts_at,ends_at,grant_source,granted_by)
            SELECT ${subscriptionId},user_id,'free','active',NOW(),NULL,'manual',NULL FROM created
            RETURNING subscription_id,user_id
          ), contact_saved AS (
            INSERT INTO public.central_free_signup_contacts
              (user_id,whatsapp_ciphertext,marketing_opt_in,marketing_consent_at,consent_notice_version)
            SELECT created.user_id,claimed.whatsapp_ciphertext,claimed.marketing_opt_in,
              CASE WHEN claimed.marketing_opt_in THEN NOW() ELSE NULL END,
              claimed.consent_notice_version
            FROM created CROSS JOIN claimed
            RETURNING user_id
          ), audited AS (
            INSERT INTO public.central_user_plan_audit
              (user_id,subscription_id,action,new_plan_code,new_status)
            SELECT user_id,subscription_id,'public_signup','free','active' FROM assigned
            RETURNING audit_id
          )
          SELECT * FROM created WHERE EXISTS(SELECT 1 FROM audited)
            AND EXISTS(SELECT 1 FROM contact_saved)
        `;
        if(!rows.length)return send(res,410,{error:'Link inválido, expirado ou utilizado'});
        return send(res,201,{ok:true,user:publicUser(rows[0])},
          sessionCookie(createSessionToken(rows[0])));
      }
      return send(res,400,{error:'Ação inválida'});
    }catch(error){
      if(error?.httpStatus===413)return send(res,413,{error:'Solicitação grande demais'});
      console.error('free signup error',String(error?.code||error?.name||'UNKNOWN').slice(0,24));
      return send(res,503,{error:'Cadastro temporariamente indisponível'});
    }
  };
}
export default createFreeSignupHandler();
