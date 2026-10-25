import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import crypto from 'node:crypto';
import {
 createHotmartWebhook,readHotmartEvent,webhookConfig,hashClaimToken,
 hotmartSiteBase,sendHotmartWelcome
} from '../lib/hotmart-webhook.js';
import { createHotmartClaim } from '../lib/hotmart-claim-handler.js';

const token='TestOnlyHottok0123456789xxxxxxxx';
const env={
 VERCEL_ENV:'preview',VERCEL_URL:'test-preview.vercel.app',
 HOTMART_TEST_RECEIVER_ENABLED:'true',HOTMART_HOTTOK:token,
 HOTMART_PRODUCT_ID:'8805543',
 HOTMART_OFFER_6M_CODE:'semestralTEST',
 HOTMART_OFFER_12M_CODE:'anualTEST',
 GMAIL_USER:'teste@gmail.com',GMAIL_APP_PASSWORD:'1234567890123456'
};
function event(name='PURCHASE_APPROVED',offer='semestralTEST',changes={}){
 const statuses={
 PURCHASE_APPROVED:'APPROVED',PURCHASE_REFUNDED:'REFUNDED',
 PURCHASE_CANCELED:'CANCELLED',PURCHASE_CHARGEBACK:'CHARGEBACK',
 PURCHASE_EXPIRED:'EXPIRED',PURCHASE_COMPLETE:'COMPLETE',
 };
 return {
   id:'evt_abcdef123',event:name,creation_date:1792930000000,version:'2.0.0',
   data:{product:{id:8805543},
    buyer:{email:'TESTE@EXAMPLE.COM',name:'Aluno Teste'},
    purchase:{transaction:'HP1234567890',status:statuses[name],
      offer:{code:offer},price:{value:97,currency_value:'BRL'}}},
   ...changes
 };
}
function req(body=event(),secret=token){
 return {method:'POST',headers:{'x-hotmart-hottok':secret,'content-type':'application/json'},body};
}
function res(){
 return {statusCode:0,headers:{},setHeader(k,v){this.headers[k.toLowerCase()]=v;},
 end(s){this.body=JSON.parse(s)}};
}
test('chave e ambiente de produção inativo bloqueiam pagamentos',()=>{
 assert.equal(webhookConfig({...env,VERCEL_ENV:'production'}),null);
 assert.equal(webhookConfig({...env,HOTMART_TEST_RECEIVER_ENABLED:'false'}),null);
 assert.equal(webhookConfig({...env,HOTMART_HOTTOK:''}),null);
 assert.equal(webhookConfig({...env,HOTMART_OFFER_12M_CODE:'semestralTEST'}),null);
 assert.equal(webhookConfig({...env,VERCEL_ENV:'production',HOTMART_LIVE_ENABLED:'true'}).offers.anualTEST,12);
});
test('apenas oferta e produto exatos definem os meses; desconto não altera plano',()=>{
 const cfg=webhookConfig(env);
 const semi=readHotmartEvent(event(),cfg).value;
 assert.equal(semi.months,6);
 assert.equal(semi.email,'teste@example.com');
 assert.equal(semi.buyerName,'Aluno Teste');
 assert.equal(readHotmartEvent(event('PURCHASE_APPROVED','anualTEST'),cfg).value.months,12);
 assert.equal(readHotmartEvent(event('PURCHASE_COMPLETE'),cfg).ignored,true);
 assert.equal(readHotmartEvent(event('PURCHASE_APPROVED','inexistente'),cfg).ignored,true);
 const mismatch=event();mismatch.data.product.id=8805554;
 assert.equal(readHotmartEvent(mismatch,cfg).ignored,true);
 const wrongState=event();wrongState.data.purchase.status='REFUNDED';
 assert.ok(readHotmartEvent(wrongState,cfg).error);
 const wrongVersion=event();wrongVersion.version='1.0.0';
 assert.ok(readHotmartEvent(wrongVersion,cfg).error);
 const badEmail=event();badEmail.data.buyer.email='nao-email';
 assert.ok(readHotmartEvent(badEmail,cfg).error);
 const noEmail=event('PURCHASE_REFUNDED');delete noEmail.data.buyer.email;
 assert.equal(readHotmartEvent(noEmail,cfg).value.email,'');
});
test('rota rejeita não autenticados, GET, tipo e payload grande sem banco',async()=>{
 let dbCalls=0;
 const handler=createHotmartWebhook({env,sqlProvider:()=>{dbCalls++;return()=>[]}});
 const r1=res();await handler(req(event(),'errado'),r1);assert.equal(r1.statusCode,401);
 const r2=res();await handler({...req(),method:'GET'},r2);assert.equal(r2.statusCode,405);
 const r3=res();await handler({...req(),headers:{...req().headers,'content-type':'text/plain'}},r3);assert.equal(r3.statusCode,415);
 const r4=res();await handler({...req(),headers:{...req().headers,'content-length':'34000'}},r4);assert.equal(r4.statusCode,413);
 const r5=res();await handler(req({version:'inválido'}),r5);assert.equal(r5.statusCode,422);
 assert.equal(dbCalls,0);
});
test('compra aprovada existente chama função atômica sem criar conta fictícia',async()=>{
 const queries=[];
 const sql=async (chunks,...values)=>{queries.push({sql:chunks.join('?'),values});return [{outcome:'applied',should_send_email:false}]};
 const handler=createHotmartWebhook({env,sqlProvider:()=>sql,
   sendWelcome:async()=>{throw Error('E-mail desnecessário')}});
 const response=res();await handler(req(),response);
 assert.equal(response.statusCode,200);
 assert.equal(response.body.state,'applied');
 assert.ok(queries[0].sql.includes('central_hotmart_apply_event'));
 assert.equal(queries[0].values[5],6);
 assert.equal(queries.length,1);
});
test('nova compra envia link por e-mail e marca envio somente depois de aceito',async()=>{
 let smtp=0;const queries=[];
 const sql=async(chunks,...values)=>{
   const statement=chunks.join('?');queries.push({statement,values});
   return statement.includes('central_hotmart_apply_event')
     ?[{outcome:'pending_claim',should_send_email:true}]:[];
 };
 const handler=createHotmartWebhook({env,sqlProvider:()=>sql,
   sendWelcome:async({to,token})=>{
    assert.equal(to,'teste@example.com');
    assert.match(token,/^[A-Za-z0-9_-]{43}$/);smtp++;
   }});
 const r=res();await handler(req(),r);
 assert.equal(r.statusCode,200);assert.equal(r.body.state,'pending_claim');
 assert.equal(smtp,1);assert.equal(queries.length,2);
 assert.ok(queries[1].statement.includes('claim_sent_at=NOW()'));
 assert.match(queries[0].values[9],/^[a-f0-9]{64}$/);
});
test('falha de e-mail devolve 503 para reenvio pela Hotmart sem confirmar entrega',async()=>{
 let touched=0;
 const h=createHotmartWebhook({env,sqlProvider:()=>async()=>{touched++;return [{outcome:'pending_claim',should_send_email:true}]},
   sendWelcome:async()=>{throw Error('SMTP indisponível')}});
 const r=res();const log=console.error;console.error=()=>{};
 try{await h(req(),r)}finally{console.error=log}
 assert.equal(r.statusCode,503);assert.equal(touched,1);
});
test('e-mails de ativação só usam HTTPS e evitam revelar tokens fora do destino',async()=>{
 assert.equal(hotmartSiteBase(env),'https://test-preview.vercel.app');
 assert.equal(hotmartSiteBase({...env,VERCEL_ENV:'production'}),'https://central-de-estudos-ecru.vercel.app');
 assert.throws(()=>hotmartSiteBase({...env,BC_PUBLIC_URL:'http://outro.exemplo'}));
 let message;
 await sendHotmartWelcome({env,to:'teste@example.com',token:'abc123',
   transport:async(m)=>{message=m;return 'test'}});
 assert.match(message.html,/ativar-acesso\.html#token=abc123/);
 assert.match(message.text,/7 dias/);
 assert.equal(message.to,'teste@example.com');
 assert.equal(hashClaimToken('abc'),crypto.createHash('sha256').update('abc').digest('hex'));
});
test('claim protege token, senha e criação exclusiva após comprovante',async()=>{
 let calls=0;
 const sql=async(chunks,...values)=>{
   const s=chunks.join('?');calls++;
   if(s.includes('SELECT 1 FROM public.central_hotmart_orders'))return [{ok:1}];
   if(s.includes('central_hotmart_redeem_claim'))
     return [{user_id:'97a681be-8db8-4d0b-9c1a-d39f7f94c245',name:'Aluno Teste',email:'teste@example.com',role:'aluno',active:true,session_version:1}];
   return [];
 };
 const claim=createHotmartClaim({sqlProvider:()=>sql});
 const t='a'.repeat(43);
 let r=res();await claim({method:'POST',headers:{},query:{action:'check'},body:{token:t}},r);
 assert.equal(r.statusCode,200);assert.equal(r.body.valid,true);
 const fake=res();await claim({method:'POST',headers:{},query:{action:'redeem'},body:{token:'inválido',name:'Aluno Teste',password:'12345678'}},fake);
 assert.equal(fake.statusCode,410);
 assert.equal(calls,1);
 // The successful redeem needs AUTH_SECRET to sign the session.
 const before=process.env.AUTH_SECRET;process.env.AUTH_SECRET='a'.repeat(48);
 try{
   r=res();await claim({method:'POST',headers:{},query:{action:'redeem'},body:{token:t,name:'Aluno Teste',password:'SenhaForte@321'}},r);
   assert.equal(r.statusCode,201);assert.match(r.headers['set-cookie'],/HttpOnly; Secure/);
   assert.equal(r.body.user.email,'teste@example.com');
 }finally{
   if(before===undefined)delete process.env.AUTH_SECRET;else process.env.AUTH_SECRET=before;
 }
});
test('roteamento público e contrato SQL preservam o plano atual',async()=>{
 const [middleware,auth,vercel,sql]=await Promise.all([
  readFile(new URL('../middleware.js',import.meta.url),'utf8'),
  readFile(new URL('../api/auth.js',import.meta.url),'utf8'),
  readFile(new URL('../vercel.json',import.meta.url),'utf8'),
  readFile(new URL('../db/migrations/003_hotmart_automatic_access.sql',import.meta.url),'utf8'),
 ]);
 assert.match(middleware,/ativar-acesso\.html/);
 assert.match(auth,/premiumApi === 'hotmart-claim'/);
 const config=JSON.parse(vercel);
 assert.ok(config.rewrites.some(x=>x.source==='/api/hotmart-claim'));
 assert.match(sql,/central_hotmart_redeem_claim/);
 assert.match(sql,/WHERE o\.claim_token_hash=p_claim_hash AND o\.claim_expires_at>NOW\(\)/);
 assert.match(sql,/AND o\.state='approved' AND o\.user_id IS NULL AND o\.credit_applied=FALSE/);

 assert.match(sql,/central_hotmart_apply_event/);
 assert.match(sql,/pg_advisory_xact_lock/);
 assert.match(sql,/state='revoked'/);
 assert.match(sql,/claim_token_hash=NULL/);
 assert.match(sql,/credit_applied=FALSE/);
 assert.match(sql,/grant_source IN \('manual','mercadopago','hotmart'\)/);
});

test('painel de compras exige administrador e permite reenvio protegido',async()=>{
 const [page,middleware,plans,menu]=await Promise.all([
  readFile(new URL('../vendas-hotmart.html',import.meta.url),'utf8'),
  readFile(new URL('../middleware.js',import.meta.url),'utf8'),
  readFile(new URL('../lib/plans-handler.js',import.meta.url),'utf8'),
  readFile(new URL('../planos.html',import.meta.url),'utf8'),
 ]);
 assert.match(page,/Compras pela Hotmart/);
 assert.match(page,/\/api\/plans\?action=hotmart/);
 assert.match(page,/Reenviar link de ativação/);
 assert.match(middleware,/path === '\/vendas-hotmart\.html'/);
 assert.match(plans,/requireSession\(req, \['admin'\]\)/);
 assert.match(plans,/hotmartAdmin/);
 assert.match(plans,/claim_sent_at<NOW\(\)-INTERVAL '60 seconds'/);
 assert.match(menu,/href="\/vendas-hotmart\.html"/);
});
