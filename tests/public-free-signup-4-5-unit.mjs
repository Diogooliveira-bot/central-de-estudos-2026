import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createFreeSignupHandler,freeSignupEnabled} from '../lib/free-signup-handler.js';
const env={
  VERCEL_ENV:'preview',VERCEL_URL:'preview-bc-test.vercel.app',
  BC_PUBLIC_FREE_SIGNUP_ENABLED:'true',BC_FREE_SIGNUP_PREVIEW_ISOLATED:'YES',
  AUTH_SECRET:'only-for-fictional-4-5-test-this-is-not-real',
  GMAIL_USER:'test-only@gmail.com',GMAIL_APP_PASSWORD:'TESTONLYDUMMY123',
};
process.env.AUTH_SECRET=env.AUTH_SECRET;
function res(){return{headers:{},setHeader(k,v){this.headers[k]=v},end(body){this.body=JSON.parse(body)}}}
function req(body,method='POST',origin='https://localhost'){return{method,headers:{host:'localhost',origin,'x-real-ip':'127.0.0.42','sec-fetch-site':origin==='https://localhost'?'same-origin':'cross-site'},body}}
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
  assert.equal(freeSignupEnabled({...env,VERCEL_ENV:'production',BC_PUBLIC_FREE_SIGNUP_PRODUCTION_APPROVED:'YES'}),true);
});
test('recusa solicitações cross-site e contas sem senha forte sem banco',async()=>{
 const {handler,calls}=setup();
 let r=res();await handler(req({action:'request'},'POST','https://evil.invalid'),r);
 assert.equal(r.statusCode,403);assert.equal(calls.length,0);
 r=res();await handler(req({action:'request',name:'Nome Simulado',email:'teste@example.invalid',password:'short'}),r);
 assert.equal(r.statusCode,400);assert.equal(calls.length,0);
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
 assert.match(auth,/free-signup-status/);
 assert.match(auth,/freeSignupEnabled\(\)/);
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
