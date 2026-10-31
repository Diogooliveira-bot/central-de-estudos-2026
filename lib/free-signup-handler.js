import crypto from 'node:crypto';
import {waitUntil} from '@vercel/functions';
import {confirmationEmail,welcomeEmail} from './transactional-email-templates.js';
import { createSessionToken,database,hashPassword,normalizeEmail,publicUser,sameOriginRequest,sessionCookie,validatePassword } from './auth.js';
import { safeSignupBody,signupCaptchaConfigured,signupCaptchaPartial,verifiedClientIp,verifySignupBot } from './free-signup-security.js';
import { deliverViaGmail,emailConfig,rateIdentity,resetPageBase } from './password-reset.js';
import { normalizeWhatsapp,protectWhatsapp,signupPiiKeyConfigured,CONTACT_NOTICE_VERSION,EMAIL_MARKETING_NOTICE_VERSION } from './free-signup-contact.js';
const GENERIC='Se o e-mail estiver disponível, você receberá um link de confirmação. Verifique também o spam.';
// v2: versão de abertura do cadastro gratuito (30/10/2026); vendas Premium seguem fechadas.
export const FREE_SIGNUP_TERMS_VERSION='terms-2026-10-30-v2';
export function freeSignupEnabled(env=process.env){
  if(env.BC_PUBLIC_FREE_SIGNUP_ENABLED!=='true'||signupCaptchaPartial(env))return false;
  if(env.VERCEL_ENV==='preview')return env.BC_FREE_SIGNUP_PREVIEW_ISOLATED==='YES';
  // A flag administrativa isolada não transforma a versão provisória dos Termos
  // em documento final. O lançamento exige atualizar FREE_SIGNUP_TERMS_VERSION
  // e o formulário após aprovação jurídica, antes de abrir Production.
  if(env.VERCEL_ENV==='production')return !/draft|minuta|pre[-_]?launch|pre[-_]?lancamento/i.test(FREE_SIGNUP_TERMS_VERSION)
    && env.BC_PUBLIC_FREE_SIGNUP_PRODUCTION_APPROVED==='YES'
    && env.BC_SIGNUP_PRIVACY_APPROVED==='YES'
    && env.BC_SIGNUP_TERMS_FINAL_APPROVED==='YES' && signupCaptchaConfigured(env);
  return false;
}
/**
 * Gate da apresentação pública: nunca anunciar formulário disponível
 * enquanto faltarem email, sessão ou banco, mesmo que a flag esteja ligada.
 * Não consulta segredos nem estabelece conexões externas.
 */
// WhatsApp é opcional: sem BC_SIGNUP_PII_KEY o formulário oculta o campo e o
// servidor recusa números, nunca gravando contato sem criptografia.
export function freeSignupWhatsappEnabled(env=process.env){
  return signupPiiKeyConfigured(env);
}
export function publicFreeSignupReady(env=process.env){
  return freeSignupEnabled(env)
    && Boolean(emailConfig(env))
    && String(env.AUTH_SECRET || '').length >= 32
    && Boolean(String(env.DATABASE_URL || '').trim());
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
// Retenção (Política de Privacidade): solicitações não confirmadas expiram em
// 30 min e são apagadas no próximo pedido de cadastro válido; o controle de tentativas
// (só hash, sem dado pessoal) é descartado após 7 dias. Falha aqui não bloqueia.
async function pruneExpired(sql){
  try{
    await sql`DELETE FROM public.central_free_signup_pending WHERE expires_at<NOW()`;
    await sql`DELETE FROM public.central_free_signup_limits WHERE window_start<NOW()-INTERVAL '7 days'`;
  }catch(error){
    console.warn('free signup prune',String(error?.code||error?.name||'UNKNOWN').slice(0,20));
  }
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
export function createFreeSignupHandler({env=process.env,sqlProvider=database,sendEmail=deliverViaGmail,botVerifier=verifySignupBot,backgroundTask=waitUntil}={}){
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
        // Os dois aceites sao obrigatorios, separados do marketing e validados no servidor.
        if(body.ageConfirmed!==true)return send(res,400,{error:'Confirme que possui 18 anos ou mais'});
        if(body.termsAccepted!==true)return send(res,400,{error:'É necessário aceitar os Termos de Uso'});
        if(body.termsVersion!==FREE_SIGNUP_TERMS_VERSION)
          return send(res,409,{error:'Os Termos de Uso foram atualizados. Recarregue o cadastro para ler a versão vigente'});
        let whatsapp;
        try { whatsapp=normalizeWhatsapp(body.whatsapp); }
        catch(_) {return send(res,400,{error:'WhatsApp inválido; informe DDD e número ou deixe em branco'});}
        const marketingOptIn=body.marketingOptIn===true;
        // Email e WhatsApp usam escolhas independentes, ambas desmarcadas por padrão.
        const emailMarketingOptIn=body.emailMarketingOptIn===true;
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
        await pruneExpired(sql);
        const previous=await sql`SELECT 1 FROM public.central_users WHERE LOWER(email)=${email} LIMIT 1`;
        if(previous.length)return send(res,200,{ok:true,message:GENERIC});
        const token=crypto.randomBytes(32).toString('base64url');
        const tokenHash=crypto.createHash('sha256').update(token).digest('hex');
        const passwordHash=hashPassword(password);
        await sql`
          INSERT INTO public.central_free_signup_pending(token_hash,email,name,password_hash,expires_at,
            whatsapp_ciphertext,marketing_opt_in,consent_notice_version,
            age_declared_at,terms_accepted_at,terms_version,
            email_marketing_opt_in,email_marketing_notice_version)
          VALUES (${tokenHash},${email},${name},${passwordHash},NOW()+INTERVAL '30 minutes',
            ${whatsappCiphertext},${marketingOptIn},${marketingOptIn?CONTACT_NOTICE_VERSION:null},
            NOW(),NOW(),${FREE_SIGNUP_TERMS_VERSION},
            ${emailMarketingOptIn},${emailMarketingOptIn?EMAIL_MARKETING_NOTICE_VERSION:null})
          ON CONFLICT (email) DO UPDATE SET
            token_hash=EXCLUDED.token_hash,name=EXCLUDED.name,password_hash=EXCLUDED.password_hash,
            created_at=NOW(),expires_at=EXCLUDED.expires_at,
            whatsapp_ciphertext=EXCLUDED.whatsapp_ciphertext,
            marketing_opt_in=EXCLUDED.marketing_opt_in,
            consent_notice_version=EXCLUDED.consent_notice_version,
            age_declared_at=EXCLUDED.age_declared_at,
            terms_accepted_at=EXCLUDED.terms_accepted_at,
            terms_version=EXCLUDED.terms_version,
            email_marketing_opt_in=EXCLUDED.email_marketing_opt_in,
            email_marketing_notice_version=EXCLUDED.email_marketing_notice_version
        `;
        const url=resetPageBase(env)+'/cadastro-gratuito.html#token='+encodeURIComponent(token);
        const message={from:config.from,to:email,...confirmationEmail({name,link:url})};
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
              AND age_declared_at IS NOT NULL AND terms_accepted_at IS NOT NULL
              AND terms_version=${FREE_SIGNUP_TERMS_VERSION}
            RETURNING email,name,password_hash,whatsapp_ciphertext,marketing_opt_in,
              consent_notice_version,age_declared_at,terms_accepted_at,terms_version,
              email_marketing_opt_in,email_marketing_notice_version
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
              (user_id,whatsapp_ciphertext,marketing_opt_in,marketing_consent_at,consent_notice_version,
               email_marketing_opt_in,email_marketing_consent_at,email_marketing_notice_version)
            SELECT created.user_id,claimed.whatsapp_ciphertext,claimed.marketing_opt_in,
              CASE WHEN claimed.marketing_opt_in THEN NOW() ELSE NULL END,
              claimed.consent_notice_version,claimed.email_marketing_opt_in,
              CASE WHEN claimed.email_marketing_opt_in THEN NOW() ELSE NULL END,
              claimed.email_marketing_notice_version
            FROM created CROSS JOIN claimed
            RETURNING user_id
          ), legal_saved AS (
            INSERT INTO public.central_free_signup_legal_acceptances
              (user_id,terms_version,terms_accepted_at,age_declared_at)
            SELECT created.user_id,claimed.terms_version,claimed.terms_accepted_at,
              claimed.age_declared_at
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
            AND EXISTS(SELECT 1 FROM legal_saved)
        `;
        if(!rows.length)return send(res,410,{error:'Link inválido, expirado ou utilizado'});
        // Boas-vindas são mensagem de serviço e só são agendadas depois de a
        // criação atômica da conta FREE ter sido confirmada pelo Neon.
        // Não atrasar nem desfazer a ativação se o SMTP estiver indisponível.
        try {
          const welcome={from:config.from,to:rows[0].email,
            ...welcomeEmail({name:rows[0].name,link:resetPageBase(env)+'/login.html'})};
          const task=Promise.resolve().then(()=>sendEmail(welcome,config)).catch(error=>{
            console.warn('welcome email failed',String(error?.code||error?.name||'UNKNOWN').slice(0,24));
          });
          backgroundTask(task);
        } catch(error) {
          console.warn('welcome email scheduling unavailable',String(error?.code||error?.name||'UNKNOWN').slice(0,24));
        }
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
