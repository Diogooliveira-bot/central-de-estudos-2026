import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {freeSignupWhatsappEnabled,createFreeSignupHandler,freeSignupEnabled,publicFreeSignupReady,FREE_SIGNUP_TERMS_VERSION} from '../lib/free-signup-handler.js';
import {signupCaptchaConfigured,verifySignupBot,safeSignupBody,verifiedClientIp} from '../lib/free-signup-security.js';
import crypto from 'node:crypto';
import {normalizeWhatsapp,protectWhatsapp,signupPiiKeyConfigured,EMAIL_MARKETING_NOTICE_VERSION} from '../lib/free-signup-contact.js';
const env={
  VERCEL_ENV:'preview',VERCEL_URL:'preview-bc-test.vercel.app',
  BC_PUBLIC_FREE_SIGNUP_ENABLED:'true',BC_FREE_SIGNUP_PREVIEW_ISOLATED:'YES',
  AUTH_SECRET:'only-for-fictional-4-5-test-this-is-not-real',
  GMAIL_USER:'test-only@gmail.com',GMAIL_APP_PASSWORD:'TESTONLYDUMMY123',
};
process.env.AUTH_SECRET=env.AUTH_SECRET;
function res(){return{headers:{},setHeader(k,v){this.headers[k]=v},end(body){this.body=JSON.parse(body)}}}
function req(body,method='POST',origin='https://localhost'){
 const data=body?.action==='request'
   ?{ageConfirmed:true,termsAccepted:true,termsVersion:FREE_SIGNUP_TERMS_VERSION,...body}:body;
 return{method,headers:{host:'localhost',origin,'x-real-ip':'127.0.0.42','sec-fetch-site':origin==='https://localhost'?'same-origin':'cross-site'},body:data}
}
function setup(){
  const calls=[],sent=[];
  const sql=async(strings,...values)=>{
    const source=strings.join('?');calls.push({source,values});
    if(source.includes('central_free_signup_limits'))return [{identity_hash:'dummy'}];
    if(source.includes('SELECT 1 FROM public.central_users'))return [];
    if(source.includes('INSERT INTO public.central_free_signup_pending'))return [];
    if(source.includes('WITH claimed AS'))return [{
      user_id:'fictional-free-user',name:'Pessoa Fictícia',email:'ficticio@example.invalid',
      role:'aluno',active:true,session_version:1,created_at:new Date().toISOString(),
    }];
    throw Error('unexpected sql');
  };
  return{calls,sent,handler:createFreeSignupHandler({env,sqlProvider:()=>sql,sendEmail:async m=>{sent.push(m);return 'simulado'}})};
}
test('somente em Preview isolada e com sinal explicito; Production bloqueada',()=>{
  assert.equal(freeSignupEnabled({}),false);
  assert.equal(freeSignupEnabled({...env,BC_FREE_SIGNUP_PREVIEW_ISOLATED:'NO'}),false);
  assert.equal(freeSignupEnabled({...env,VERCEL_ENV:'production'}),false);
  assert.equal(freeSignupEnabled({...env,VERCEL_ENV:'production',BC_PUBLIC_FREE_SIGNUP_PRODUCTION_APPROVED:'YES'}),false);
  const captchaEnv={...env,VERCEL_ENV:'production',BC_PUBLIC_FREE_SIGNUP_PRODUCTION_APPROVED:'YES',BC_SIGNUP_PRIVACY_APPROVED:'YES',BC_SIGNUP_TERMS_FINAL_APPROVED:'YES',BC_SIGNUP_TURNSTILE_SITE_KEY:'3x00000000000000000000FF',BC_SIGNUP_TURNSTILE_SECRET_KEY:'1x0000000000000000000000000000000AA',BC_SIGNUP_PII_KEY:'11'.repeat(32)};
  // Cloudflare dummy keys are for test suites only; NEVER enable live registration.
  assert.equal(freeSignupEnabled(captchaEnv),false);
  assert.equal(signupCaptchaConfigured(captchaEnv),false);
  assert.equal(signupCaptchaConfigured({...captchaEnv,VERCEL_ENV:'preview'}),true);
  const siteWithDummySecret={...captchaEnv,BC_SIGNUP_TURNSTILE_SITE_KEY:'realFormatSiteKey_ABCDEFGHIJKLMNOPQR'};
  assert.equal(freeSignupEnabled(siteWithDummySecret),false);
  const secretWithDummySite={...captchaEnv,BC_SIGNUP_TURNSTILE_SECRET_KEY:'realFormatSecretKey_ABCDEFGHIJKLMNOPQRSTUVWXYZ'};
  assert.equal(freeSignupEnabled(secretWithDummySite),false);
  const syntheticRealPair={...siteWithDummySecret,BC_SIGNUP_TURNSTILE_SECRET_KEY:'realFormatSecretKey_ABCDEFGHIJKLMNOPQRSTUVWXYZ'};
  // Syntactic configuration only: no assertion here proves the keys are real/operational.
  // Even with all approval flags set, draft Terms must keep Production disabled.
  assert.equal(FREE_SIGNUP_TERMS_VERSION.includes('draft'),false);
  assert.equal(freeSignupEnabled(syntheticRealPair),true);
  assert.equal(freeSignupEnabled({...syntheticRealPair,BC_SIGNUP_PRIVACY_APPROVED:'NO'}),false);
  assert.equal(freeSignupEnabled({...syntheticRealPair,BC_SIGNUP_TERMS_FINAL_APPROVED:'NO'}),false);
  // WhatsApp fora do lançamento: cadastro abre sem chave PII, mas o campo fica desativado.
  const withoutPii={...syntheticRealPair};delete withoutPii.BC_SIGNUP_PII_KEY;
  assert.equal(freeSignupEnabled(withoutPii),true);
  assert.equal(freeSignupWhatsappEnabled(withoutPii),false);
  assert.equal(freeSignupWhatsappEnabled({...syntheticRealPair,BC_SIGNUP_PII_KEY:'66'.repeat(32)}),true);
  assert.equal(freeSignupEnabled({...syntheticRealPair,BC_PUBLIC_FREE_SIGNUP_ENABLED:'false'}),false);
});
test('botão público não aparece sem SMTP, sessão e Neon, mesmo com flag habilitada',()=>{
 const ready={...env,DATABASE_URL:'postgresql://placeholder.invalid/nao-conectar'};
 assert.equal(publicFreeSignupReady(ready),true);
 assert.equal(publicFreeSignupReady({...ready,GMAIL_APP_PASSWORD:''}),false);
 assert.equal(publicFreeSignupReady({...ready,GMAIL_USER:''}),false);
 assert.equal(publicFreeSignupReady({...ready,AUTH_SECRET:'curto'}),false);
 assert.equal(publicFreeSignupReady({...ready,DATABASE_URL:''}),false);
 assert.equal(publicFreeSignupReady({...ready,BC_PUBLIC_FREE_SIGNUP_ENABLED:'false'}),false);
 assert.equal(publicFreeSignupReady({...ready,VERCEL_ENV:'production'}),false);
});
test('recusa solicitações cross-site e contas sem senha forte sem banco',async()=>{
 const {handler,calls}=setup();
 let r=res();await handler(req({action:'request'},'POST','https://evil.invalid'),r);
 assert.equal(r.statusCode,403);assert.equal(calls.length,0);
 r=res();await handler(req({action:'request',name:'Nome Simulado',email:'teste@example.invalid',password:'short'}),r);
 assert.equal(r.statusCode,400);assert.equal(calls.length,0);
});
test('maioridade e aceite de Termos sao obrigatorios no backend antes de SQL e e-mail',async()=>{
 const {handler,calls,sent}=setup();
 const base={action:'request',name:'Pessoa Fictícia',email:'ficticio@example.invalid',password:'Senhacom12ouMais@123'};
 for(const overrides of [{ageConfirmed:false},{termsAccepted:false},{termsVersion:'versao-antiga'},{termsVersion:'terms-2026-10-30-v1'},{ageConfirmed:'true'},{termsAccepted:'true'}]){
  const out=res();await handler(req({...base,...overrides}),out);
  assert.ok([400,409].includes(out.statusCode));
 }
 assert.equal(calls.length,0);
 assert.equal(sent.length,0);
});
test('aceite versionado vai para pendencia e historico atomico do aluno',async()=>{
 const {handler,calls}=setup();
 let r=res();await handler(req({action:'request',name:'Pessoa Fictícia',email:'ficticio@example.invalid',password:'Senhacom12ouMais@123'}),r);
 assert.equal(r.statusCode,200);
 const pending=calls.find(x=>x.source.includes('INSERT INTO public.central_free_signup_pending'));
 assert.ok(pending);
 assert.match(pending.source,/age_declared_at,terms_accepted_at,terms_version/);
 assert.equal(pending.values.at(-3),FREE_SIGNUP_TERMS_VERSION);
 assert.equal(pending.values.at(-2),false);
 assert.equal(pending.values.at(-1),null);
 r=res();await handler(req({action:'confirm',token:'T'.repeat(43)}),r);
 assert.equal(r.statusCode,201);
 const atomic=calls.find(x=>x.source.includes('WITH claimed AS'));
 assert.match(atomic.source,/central_free_signup_legal_acceptances/);
 assert.match(atomic.source,/terms_version=\?/);
 assert.match(atomic.source,/EXISTS\(SELECT 1 FROM legal_saved\)/);
 assert.doesNotMatch(atomic.source,/INSERT INTO public\.central_user_subscriptions[\s\S]*?'premium'/);
});
test('cadastro novo só envia link; não cria conta antes de confirmar email',async()=>{
 const {handler,calls,sent}=setup();let r=res();
 await handler(req({action:'request',name:'Pessoa Fictícia',email:'ficticio@example.invalid',password:'Senhacom12ouMais@123'}),r);
 assert.equal(r.statusCode,200);assert.equal(sent.length,1);
 assert.match(sent[0].text,/cadastro-gratuito\.html#token=/);
 assert.equal(sent[0].text.includes('Senha'),false);
 assert.equal(calls.some(x=>x.source.includes('INSERT INTO public.central_users')),false);
 assert.equal(calls.some(x=>x.source.includes('free_signup_pending')),true);
});
test('confirmação atômica cria exclusivamente aluno gratuito',async()=>{
 const {handler,calls}=setup();let r=res();
 await handler(req({action:'confirm',token:'T'.repeat(43)}),r);
 assert.equal(r.statusCode,201);
 assert.equal(r.body.user.role,'aluno');
 assert.match(r.headers['Set-Cookie'],/HttpOnly; Secure; SameSite=Lax/);
 const atomic=calls.find(x=>x.source.includes('WITH claimed AS'));
 assert.ok(atomic);
 assert.match(atomic.source,/DELETE FROM public\.central_free_signup_pending/);
 assert.match(atomic.source,/'aluno'/);
 assert.match(atomic.source,/'free','active'/);
 assert.doesNotMatch(atomic.source,/'premium'/);
});
test('token de confirmacao gratuita: segundo uso devolve 410 sem nova conta ou plano',async()=>{
 let confirmations=0,creations=0;
 const sql=async(strings,...values)=>{
   const query=strings.join('?');
   if(!query.includes('WITH claimed AS'))throw Error('Consulta inesperada');
   confirmations++;
   assert.match(query,/DELETE FROM public\.central_free_signup_pending/);
   assert.match(query,/token_hash=\?/);
   assert.match(query,/expires_at>NOW\(\)/);
   assert.match(query,/terms_version=\?/);
   assert.match(query,/'free','active'/);
   assert.doesNotMatch(query,/'premium'/);
   if(confirmations>1)return [];
   creations++;
   return [{user_id:'synthetic-user-one',name:'Pessoa Simulada',email:'simulado@example.invalid',
      role:'aluno',active:true,session_version:1}];
 };
 const handler=createFreeSignupHandler({env,sqlProvider:()=>sql});
 const request=req({action:'confirm',token:'T'.repeat(43)});
 const first=res();await handler(request,first);
 assert.equal(first.statusCode,201);
 assert.equal(first.body.user.role,'aluno');
 const repeated=res();await handler(request,repeated);
 assert.equal(repeated.statusCode,410);
 assert.match(repeated.body.error,/utilizado/);
 assert.equal(confirmations,2);
 assert.equal(creations,1);
 assert.equal(repeated.headers['Set-Cookie'],undefined);
});

test('token de cadastro malformado ou expirado nao cria aluno gratuito',async()=>{
 let hits=0;
 const sql=async(strings,...values)=>{
   const query=strings.join('?');
   hits++;
   if(!query.includes('WITH claimed AS'))throw Error('Consulta inesperada');
   return [];
 };
 const handler=createFreeSignupHandler({env,sqlProvider:()=>sql});
 const bad=res();await handler(req({action:'confirm',token:'invalido'}),bad);
 assert.equal(bad.statusCode,410);
 assert.equal(hits,0);
 const expired=res();await handler(req({action:'confirm',token:'E'.repeat(43)}),expired);
 assert.equal(expired.statusCode,410);
 assert.equal(hits,1);
 assert.equal(expired.headers['Set-Cookie'],undefined);
});

test('sem e-mail habilitado, falha fechada e não acessa banco',async()=>{
 const {handler,calls}=setup();
 const disabled=createFreeSignupHandler({env:{...env,BC_PUBLIC_FREE_SIGNUP_ENABLED:'false'},sqlProvider:()=>{throw Error('must not connect')}});
 let r=res();await disabled(req({action:'request'}),r);
 assert.equal(r.statusCode,503);
 assert.equal(calls.length,0);
});
test('página de cadastro remove token da URL e não libera Premium',()=>{
 const page=readFileSync(new URL('../cadastro-gratuito.html',import.meta.url),'utf8');
 assert.match(page,/history\.replaceState/);
 assert.match(page,/autocomplete="new-password"/);
 assert.match(page,/action:'confirm'/);
 assert.match(page,/20 questões por dia/);
 assert.match(page,/TEC, QConcursos/);
});

test('middleware libera somente tela de cadastro, sem recursos pagos',()=>{
 const middleware=readFileSync(new URL('../middleware.js',import.meta.url),'utf8');
 const auth=readFileSync(new URL('../api/auth.js',import.meta.url),'utf8');
 assert.match(middleware,/['"]\/cadastro-gratuito\.html['"]/);
 assert.match(auth,/action === 'free-signup'/);
 assert.match(middleware,/protectedAsset\(path\)/);
});
test('token inválido não consulta banco',async()=>{
 const {handler,calls}=setup();
 const r=res();
 await handler(req({action:'confirm',token:'curto'}),r);
 assert.equal(r.statusCode,410);
 assert.equal(calls.length,0);
});

test('link cadastro aparece só quando a API confirmar que está habilitado',()=>{
 const page=readFileSync(new URL('../login.html',import.meta.url),'utf8');
 const auth=readFileSync(new URL('../api/auth.js',import.meta.url),'utf8');
 assert.match(page,/id="publicSignupLink"[^>]*hidden/);
 assert.match(page,/free-signup-status/);
 assert.match(page,/if\(signup\.enabled\)/);
 assert.match(page,/id="firstAccessInviteHint"/);
 assert.match(page,/firstAccessInviteHint'\)\.hidden=true/);
 assert.match(page,/id="commercialSiteLink"/);
 assert.match(page,/base-completa-vitrine-estatica-2026\.vercel\.app/);
 assert.match(auth,/free-signup-status/);
 assert.match(auth,/publicFreeSignupReady\(\)/);
});

test('falha simulada de entrega SMTP não confirma cadastro',async()=>{
 let emails=0;
 const fakeSql=async(strings,...values)=>{
   const q=strings.join('?');
   if(q.includes('central_free_signup_limits'))return [{identity_hash:'dummy'}];
   if(q.includes('SELECT 1 FROM public.central_users'))return [];
   if(q.includes('INSERT INTO public.central_free_signup_pending'))return [];
   throw Error('SQL inesperado');
 };
 const handler=createFreeSignupHandler({
   env,sqlProvider:()=>fakeSql,
   sendEmail:async()=>{emails++;throw Error('SMTP de homologação indisponível')}
 });
 const r=res();
 await handler(req({action:'request',name:'Teste Sem Envio',email:'falha@example.invalid',password:'SenhaLongaDeTeste1234!'}),r);
 assert.equal(r.statusCode,503);
 assert.equal(emails,1);
 assert.equal(r.headers['Set-Cookie'],undefined);
});
test('cadastro público não aceita GET nem tentativa de criar admin',async()=>{
 const {handler,calls}=setup();
 let r=res();
 await handler(req({action:'request'},'GET'),r);
 assert.equal(r.statusCode,403);
 assert.equal(calls.length,0);
 r=res();
 await handler(req({action:'request',name:'Teste Operador',email:'outro@example.invalid',password:'SenhaLongaDeTeste1234!',role:'admin',plan:'premium'}),r);
 assert.equal(r.statusCode,200);
 const c=calls.filter(x=>x.source.includes('INSERT INTO public.central_free_signup_pending'));
 assert.equal(c.length,1);
 assert.equal(c[0].source.includes('admin'),false);
});

test('Turnstile faz verificacao obrigatoria no SERVIDOR e rejeita erro, troca de host, replay',async()=>{
 const envBot={BC_SIGNUP_TURNSTILE_SITE_KEY:'3x00000000000000000000FF',BC_SIGNUP_TURNSTILE_SECRET_KEY:'1x0000000000000000000000000000000AA'};
 assert.equal(signupCaptchaConfigured(envBot),true);
 const valid=await verifySignupBot({token:'token-ficticio',requestHost:'preview-bc-test.vercel.app',env:envBot,
   fetcher:async()=>({ok:true,json:async()=>({success:true,action:'free-signup',hostname:'preview-bc-test.vercel.app'})})});
 assert.equal(valid,true);
 for(const bogus of [
  {success:false,action:'free-signup',hostname:'preview-bc-test.vercel.app'},
  {success:true,action:'login',hostname:'preview-bc-test.vercel.app'},
  {success:true,action:'free-signup',hostname:'outro.vercel.app'},
 ]){
  assert.equal(await verifySignupBot({token:'falso',requestHost:'preview-bc-test.vercel.app',env:envBot,
   fetcher:async()=>({ok:true,json:async()=>bogus})}),false);
 }
 assert.equal(await verifySignupBot({token:'token',requestHost:'preview-bc-test.vercel.app',env:envBot,
   fetcher:async()=>{throw Error('timeout simulado')}}),false);
});
test('backend impede signup com CAPTCHA ausente antes de consultar SQL',async()=>{
 const cfg={...env,BC_SIGNUP_TURNSTILE_SITE_KEY:'3x00000000000000000000FF',BC_SIGNUP_TURNSTILE_SECRET_KEY:'1x0000000000000000000000000000000AA'};
 let sqlCalled=0;
 const h=createFreeSignupHandler({env:cfg,sqlProvider:()=>{sqlCalled++;return()=>[]},botVerifier:async()=>false});
 const r=res();await h(req({action:'request',name:'Pessoa Teste',email:'captcha@example.invalid',password:'SenhaFicticia123456!'}),r);
 assert.equal(r.statusCode,403);
 assert.equal(sqlCalled,1); // Construcao de cliente SQL nao executa SQL ou consulta tabela
});
test('payload enorme bloqueado e IP precisa ser valido',async()=>{
 const r=res();const {handler}=setup();
 const reqLarge=req({action:'request',name:'A'.repeat(15000)});
 await handler(reqLarge,r);
 assert.equal(r.statusCode,413);
 assert.equal(verifiedClientIp({headers:{'x-vercel-forwarded-for':'192.0.2.19'}}),'192.0.2.19');
 assert.equal(verifiedClientIp({headers:{'x-vercel-forwarded-for':'not-an-ip'}}),'');
});

test('WhatsApp opcional validado e criptografado sem texto puro',()=>{
 const envTest={BC_SIGNUP_PII_KEY:'22'.repeat(32)};
 assert.equal(normalizeWhatsapp(''),null);
 assert.equal(normalizeWhatsapp('(85) 99999-9999'),'+5585999999999');
 assert.equal(normalizeWhatsapp('+55 85 99999-9999'),'+5585999999999');
 assert.throws(()=>normalizeWhatsapp('123'),/inválido/);
 assert.equal(signupPiiKeyConfigured(envTest),true);
 const encrypted=protectWhatsapp('+5585999999999',envTest);
 assert.match(encrypted,/^v1\./);
 assert.equal(encrypted.includes('5585999999999'),false);
 assert.notEqual(protectWhatsapp('+5585999999999',envTest),encrypted);
 const parts=encrypted.split('.');
 const dec=crypto.createDecipheriv('aes-256-gcm',Buffer.from(envTest.BC_SIGNUP_PII_KEY,'hex'),Buffer.from(parts[1],'base64url'));
 dec.setAuthTag(Buffer.from(parts[2],'base64url'));
 const restored=Buffer.concat([dec.update(Buffer.from(parts[3],'base64url')),dec.final()]).toString();
 assert.equal(restored,'+5585999999999');
});
test('opt-in separado: sem WhatsApp nao aceita marketing e com contato exige chave',async()=>{
 const {handler}=setup();
 let r=res();
 await handler(req({action:'request',name:'Ficticio',email:'ficticio@example.invalid',password:'SenhaSeguraLonga123!',marketingOptIn:true}),r);
 assert.equal(r.statusCode,400);
 r=res();
 await handler(req({action:'request',name:'Ficticio',email:'ficticio@example.invalid',password:'SenhaSeguraLonga123!',whatsapp:'(85) 99999-9999',marketingOptIn:false}),r);
 assert.equal(r.statusCode,503);
});
test('consentimento desmarcado é persistido como false, com WhatsApp somente cifrado',async()=>{
 const cfg={...env,BC_SIGNUP_PII_KEY:'33'.repeat(32)};
 let pending;
 const sql=async(strings,...values)=>{
  const q=strings.join('?');
  if(q.includes('central_free_signup_limits'))return [{identity_hash:'test'}];
  if(q.includes('SELECT 1 FROM public.central_users'))return [];
  if(q.includes('INSERT INTO public.central_free_signup_pending')){
    pending={query:q,values};return [];
  }
  throw Error('unexpected database operation');
 };
 const h=createFreeSignupHandler({env:cfg,sqlProvider:()=>sql,sendEmail:async()=>true});
 const r=res();await h(req({action:'request',name:'Ficticia',email:'no-marketing@example.invalid',password:'SenhaSeguraLonga123!',whatsapp:'(85) 99999-9999',marketingOptIn:false}),r);
 assert.equal(r.statusCode,200);
 assert.ok(pending);
 assert.equal(pending.values[5],false);
 assert.equal(pending.values[6],null);
 assert.match(pending.values[4],/^v1\./);
 assert.equal(pending.values[4].includes('99999'),false);
});
test('consentimento comercial expresso possui versao e nao ativa Premium',async()=>{
 const cfg={...env,BC_SIGNUP_PII_KEY:'44'.repeat(32)};
 let captured;
 const sql=async(strings,...values)=>{
  const q=strings.join('?');
  if(q.includes('central_free_signup_limits'))return [{identity_hash:'test'}];
  if(q.includes('SELECT 1 FROM public.central_users'))return [];
  if(q.includes('INSERT INTO public.central_free_signup_pending')){captured={q,values};return [];}
  throw Error('unexpected query');
 };
 const h=createFreeSignupHandler({env:cfg,sqlProvider:()=>sql,sendEmail:async()=>true});
 const r=res();await h(req({action:'request',name:'Pessoa Ficticia',email:'marketing@example.invalid',password:'SenhaSeguraLonga123!',whatsapp:'(85) 99999-9999',marketingOptIn:true}),r);
 assert.equal(r.statusCode,200);
 assert.equal(captured.values[5],true);
 assert.equal(captured.values[6],'signup-whatsapp-v1-2026-10-27');
 assert.doesNotMatch(captured.q,/'premium'/);
});

test('consentimento de e-mail e independente de WhatsApp, facultativo e versionado',async()=>{
 const cfg={...env,BC_SIGNUP_PII_KEY:'55'.repeat(32)};
 const requests=[];
 const sql=async(strings,...values)=>{
  const q=strings.join('?');
  if(q.includes('central_free_signup_limits'))return [{identity_hash:'test'}];
  if(q.includes('SELECT 1 FROM public.central_users'))return [];
  if(q.includes('INSERT INTO public.central_free_signup_pending')){requests.push({q,values});return [];}
  throw Error('SQL inesperado');
 };
 const h=createFreeSignupHandler({env:cfg,sqlProvider:()=>sql,sendEmail:async()=>true});
 const a=res();
 await h(req({action:'request',name:'Aluno Sem WhatsApp',email:'emailmarketing@example.invalid',
  password:'SenhaSeguraLonga123!',emailMarketingOptIn:true}),a);
 assert.equal(a.statusCode,200);
 let saved=requests.at(-1);
 assert.equal(saved.values[5],false);
 assert.equal(saved.values[6],null);
 assert.equal(saved.values.at(-2),true);
 assert.equal(saved.values.at(-1),EMAIL_MARKETING_NOTICE_VERSION);
 assert.match(saved.q,/email_marketing_opt_in/);
 const b=res();
 await h(req({action:'request',name:'Aluno Sem WhatsApp',email:'emailmarketing@example.invalid',
  password:'SenhaSeguraLonga123!',emailMarketingOptIn:'true'}),b);
 assert.equal(b.statusCode,200);
 saved=requests.at(-1);
 assert.equal(saved.values.at(-2),false);
 assert.equal(saved.values.at(-1),null);
 const c=res();
 await h(req({action:'request',name:'Aluno Com WhatsApp',email:'whatsapp@example.invalid',
  password:'SenhaSeguraLonga123!',marketingOptIn:true,whatsapp:'(85) 99999-9999',
  emailMarketingOptIn:false}),c);
 assert.equal(c.statusCode,200);
 saved=requests.at(-1);
 assert.equal(saved.values[5],true);
 assert.equal(saved.values.at(-2),false);
 assert.equal(saved.values.at(-1),null);
});
test('consentimentos de e-mail e WhatsApp sao salvos separadamente na mesma transacao FREE',async()=>{
 const {handler,calls}=setup();
 const out=res();
 await handler(req({action:'confirm',token:'T'.repeat(43)}),out);
 assert.equal(out.statusCode,201);
 const q=calls.find(x=>x.source.includes('WITH claimed AS')).source;
 assert.match(q,/email_marketing_opt_in,email_marketing_notice_version/);
 assert.match(q,/claimed\.email_marketing_opt_in/);
 assert.match(q,/claimed\.email_marketing_notice_version/);
 assert.match(q,/'free','active'/);
 assert.doesNotMatch(q,/'premium'/);
});


test('publicacao legal permanece bloqueada ate versao final coordenada e servico validado',()=>{
 const register=readFileSync(new URL('../cadastro-gratuito.html',import.meta.url),'utf8');
 const terms=readFileSync(new URL('../termos-de-uso.html',import.meta.url),'utf8');
 const privacy=readFileSync(new URL('../politica-de-privacidade.html',import.meta.url),'utf8');
 const cookies=readFileSync(new URL('../politica-de-cookies.html',import.meta.url),'utf8');
 const m=register.match(/termsVersion:'([^']+)'/);
 assert.ok(m,'Formulario precisa declarar a versao dos Termos');
 assert.equal(m[1],FREE_SIGNUP_TERMS_VERSION,'Frontend e backend devem aceitar a mesma versao');
 assert.doesNotMatch(FREE_SIGNUP_TERMS_VERSION,/draft|minuta|pre[-_]?launch/i);
 for(const html of [terms,privacy,cookies]){
   assert.match(html,/noindex,nofollow,noarchive/);
   assert.match(html,/Cadastro gratuito disponível\. Contratação Premium ainda não aberta\./);
   assert.ok(html.includes(FREE_SIGNUP_TERMS_VERSION),'Página legal deve exibir a versão vigente do aceite');
   assert.doesNotMatch(html,/pré-lançamento|ainda não liberado|permanecem desabilitados/i);
   assert.match(html,/basecompleta\.estudos@gmail\.com/);
 }
 assert.match(terms,/R\$ 97,00 por seis meses/);
 assert.match(terms,/R\$ 179,00 por doze meses/);
 assert.doesNotMatch(terms,/R\$ 194,00 por doze meses/);
 assert.match(terms,/cinco dias/);
 assert.match(terms,/confirmação imediata/);
 assert.match(terms,/sete dias/);
 assert.match(privacy,/quinze dias/);
 assert.match(privacy,/Os critérios de retenção variam conforme a categoria/);
 assert.match(cookies,/verificação técnica realizada em 30\/10\/2026/);
 assert.match(cookies,/não há cookies opcionais que dependam de consentimento/);
});
