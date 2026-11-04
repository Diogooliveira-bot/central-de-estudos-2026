// Jornada Hotmart → Premium contra PostgreSQL real (PGlite, em memória).
// Executa as migrações versionadas e os handlers reais; nenhum banco externo,
// nenhuma credencial e nenhum e-mail real. Complementa o teste opt-in em Neon TEST.
import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import {PGlite} from '@electric-sql/pglite';
import {createHotmartWebhook} from '../lib/hotmart-webhook.js';
import {createHotmartClaim} from '../lib/hotmart-claim-handler.js';
import {getEffectivePlan,canAccessFeature} from '../lib/plan-access.js';

process.env.AUTH_SECRET ||= crypto.randomBytes(48).toString('hex');
const HOTTOK=crypto.randomBytes(32).toString('hex');
const PRODUCT='8805543',OFFER6='o4y1mlg9',OFFER12='gh4ajvj1';
const env={VERCEL_ENV:'preview',VERCEL_URL:'homolog.example.vercel.app',
  HOTMART_TEST_RECEIVER_ENABLED:'true',HOTMART_PRODUCT_ID:PRODUCT,
  HOTMART_OFFER_6M_CODE:OFFER6,HOTMART_OFFER_12M_CODE:OFFER12,HOTMART_HOTTOK:HOTTOK,
  GMAIL_USER:'alertas.sinteticos@example.invalid'};

const db=new PGlite();
for(const file of fs.readdirSync(new URL('../db/migrations/',import.meta.url)).sort())
  await db.exec(fs.readFileSync(new URL('../db/migrations/'+file,import.meta.url),'utf8'));

// Mesmo contrato do driver Neon: sql`...${v}...` → linhas.
function sql(strings,...values){
  const text=strings.reduce((acc,part,i)=>acc+'$'+i+part);
  return db.query(text,values.map(v=>v instanceof Date?v.toISOString():v)).then(r=>r.rows);
}
const welcome=[],alerts=[];
let smtpDown=false;
const webhook=createHotmartWebhook({env,sqlProvider:()=>sql,
  sendWelcome:async m=>{if(smtpDown)throw Object.assign(Error('smtp'),{code:'ECONNECTION'});welcome.push(m)},
  sendAlert:async m=>{alerts.push(m)}});
const claim=createHotmartClaim({sqlProvider:()=>sql});

function res(){return {headers:{},setHeader(k,v){this.headers[k]=v},end(v){this.body=v?JSON.parse(v):null}}}
async function call(handler,req){const r=res();await handler(req,r);return r}
function hook(body,token=HOTTOK){
  const headers={'content-type':'application/json'};
  if(token!=null)headers['x-hotmart-hottok']=token;
  return call(webhook,{method:'POST',headers,body});
}
function claimReq(action,body){
  return call(claim,{method:'POST',query:{action},body,
    headers:{host:env.VERCEL_URL,origin:'https://'+env.VERCEL_URL,'content-type':'application/json'}});
}
const STATUS={PURCHASE_APPROVED:'APPROVED',PURCHASE_REFUNDED:'REFUNDED',
  PURCHASE_CHARGEBACK:'CHARGEBACK',PURCHASE_CANCELED:'CANCELLED',PURCHASE_EXPIRED:'EXPIRED',
  PURCHASE_BILLET_PRINTED:'BILLET_PRINTED',PURCHASE_DELAYED:'DELAYED',PURCHASE_PROTEST:'DISPUTE'};
function event(kind,{tx,email,offer=OFFER6,status,product=PRODUCT}={}){
  return {version:'2.0.0',id:'EVT-'+crypto.randomUUID(),event:kind,creation_date:Date.now(),
    data:{product:{id:Number(product)},buyer:{email,name:'Pessoa Ficticia'},
      purchase:{transaction:tx||'HP'+crypto.randomInt(1e9,9e9),offer:{code:offer},
        status:status??STATUS[kind],price:{value:97,currency_value:'BRL'}}}};
}
async function student(email,{plan='free'}={}){
  const id=crypto.randomUUID();
  await sql`INSERT INTO central_users(user_id,name,email,role,password_hash,active)
    VALUES(${id},'Aluno Ficticio',${email},'aluno','x',TRUE)`;
  if(plan)await sql`INSERT INTO central_user_subscriptions
    (subscription_id,user_id,plan_code,status,starts_at,grant_source)
    VALUES(${crypto.randomUUID()},${id},${plan},'active',NOW()-INTERVAL '1 day','manual')`;
  return id;
}
const mail=()=>'aluno-'+crypto.randomUUID().slice(0,8)+'@example.invalid';
const endsAt=async id=>new Date((await getEffectivePlan(sql,id)).endsAt);
const monthsFromNow=m=>{const d=new Date();d.setMonth(d.getMonth()+m);return d};
const close=(a,b,ms=3*86400000)=>Math.abs(a-b)<ms;
const orderOf=async tx=>(await sql`SELECT * FROM central_hotmart_orders WHERE transaction_id=${tx}`)[0];

test('webhook sem HOTTOK ou com HOTTOK errado é rejeitado sem tocar no banco',async()=>{
  const tx='HP-AUTH-'+crypto.randomInt(1e6);
  assert.equal((await hook(event('PURCHASE_APPROVED',{tx,email:mail()}),null)).statusCode,401);
  assert.equal((await hook(event('PURCHASE_APPROVED',{tx,email:mail()}),'x'.repeat(64))).statusCode,401);
  assert.equal(await orderOf(tx),undefined);
});

test('aluno novo: compra aprovada → e-mail com link de ativação → Premium 6 meses',async()=>{
  const email=mail(),tx='HP-NEW-'+crypto.randomInt(1e6);
  const r=await hook(event('PURCHASE_APPROVED',{tx,email}));
  assert.equal(r.statusCode,200);assert.equal(r.body.state,'pending_claim');
  const sent=welcome.find(m=>m.to===email);assert.ok(sent,'e-mail de ativação capturado');
  assert.equal((await claimReq('check',{token:sent.token})).body.valid,true);
  const redeem=await claimReq('redeem',{token:sent.token,name:'Pessoa Ficticia',password:'Senha-Forte-123!'});
  assert.equal(redeem.statusCode,201,JSON.stringify(redeem.body));
  const uid=redeem.body.user.id;
  const plan=await getEffectivePlan(sql,uid);
  assert.equal(plan.plan,'premium');assert.ok(close(new Date(plan.endsAt),monthsFromNow(6)));
  assert.equal((await claimReq('redeem',{token:sent.token,name:'Outra',password:'Senha-Forte-123!'})).statusCode,410,'link de uso único');
});

test('link de ativação expirado não ativa',async()=>{
  const email=mail(),tx='HP-EXP-'+crypto.randomInt(1e6);
  await hook(event('PURCHASE_APPROVED',{tx,email}));
  const sent=welcome.find(m=>m.to===email);
  await sql`UPDATE central_hotmart_orders SET claim_expires_at=NOW()-INTERVAL '1 minute' WHERE transaction_id=${tx}`;
  assert.equal((await claimReq('check',{token:sent.token})).body.valid,false);
  assert.equal((await claimReq('redeem',{token:sent.token,name:'Pessoa Ficticia',password:'Senha-Forte-123!'})).statusCode,410);
});

test('e-mail da compra diferente do cadastro: conta existente não recebe Premium, comprador recebe convite',async()=>{
  const existing=await student(mail()),buyer=mail();
  const r=await hook(event('PURCHASE_APPROVED',{email:buyer}));
  assert.equal(r.body.state,'pending_claim');
  assert.equal((await getEffectivePlan(sql,existing)).plan,'free');
  assert.ok(welcome.some(m=>m.to===buyer));
});

test('aluno existente: plano atualizado sem e-mail; 6 e 12 meses',async()=>{
  for(const [offer,months] of [[OFFER6,6],[OFFER12,12]]){
    const email=mail(),uid=await student(email),before=welcome.length;
    const r=await hook(event('PURCHASE_APPROVED',{email,offer}));
    assert.equal(r.body.state,'applied');assert.equal(welcome.length,before);
    assert.equal((await getEffectivePlan(sql,uid)).plan,'premium');
    assert.ok(close(await endsAt(uid),monthsFromNow(months)),months+' meses');
  }
});

test('recompra antes do vencimento soma ao tempo restante',async()=>{
  const email=mail(),uid=await student(email);
  await hook(event('PURCHASE_APPROVED',{email,offer:OFFER6}));
  const first=await endsAt(uid);
  await hook(event('PURCHASE_APPROVED',{email,offer:OFFER12}));
  const second=await endsAt(uid);
  const expected=new Date(first);expected.setMonth(expected.getMonth()+12);
  assert.ok(close(second,expected,2*86400000),'6 + 12 = 18 meses a partir da primeira compra');
});

test('prazo calculado no fuso America/Fortaleza',async()=>{
  const fns=await sql`SELECT proname,proconfig FROM pg_proc WHERE proname IN
    ('central_hotmart_activate_order','central_hotmart_revoke_order','central_hotmart_apply_event','central_hotmart_redeem_claim')`;
  assert.equal(fns.length,4);
  for(const f of fns)assert.ok((f.proconfig||[]).includes('TimeZone=America/Fortaleza'),f.proname);
  // 30/04 22h em Fortaleza já é 01/05 em UTC; +6 meses deve cair em 30/10, não 31/10.
  await db.exec("SET TimeZone='America/Fortaleza'");
  const [row]=await sql`SELECT to_char(('2026-04-30 22:00-03'::timestamptz + make_interval(months=>6)),'YYYY-MM-DD HH24:MI') AS d`;
  await db.exec("SET TimeZone='UTC'");
  assert.equal(row.d,'2026-10-30 22:00');
});

test('notificação duplicada (mesmo evento ou nova tentativa) não duplica crédito',async()=>{
  const email=mail(),uid=await student(email),body=event('PURCHASE_APPROVED',{email});
  await hook(body);const first=await endsAt(uid);
  assert.equal((await hook(body)).statusCode,200);
  const retry=structuredClone(body);retry.id='EVT-'+crypto.randomUUID();
  assert.equal((await hook(retry)).body.state,'already_applied');
  assert.equal((await endsAt(uid)).getTime(),first.getTime());
});

test('fora de ordem: reembolso antes da aprovação impede liberação; aprovação tardia libera a partir do recebimento',async()=>{
  const email=mail(),uid=await student(email),tx='HP-OOO-'+crypto.randomInt(1e6);
  assert.equal((await hook(event('PURCHASE_REFUNDED',{tx,email}))).statusCode,200);
  assert.equal((await hook(event('PURCHASE_APPROVED',{tx,email}))).body.state,'ignored_after_reversal');
  assert.equal((await getEffectivePlan(sql,uid)).plan,'free');
  const late=event('PURCHASE_APPROVED',{email});late.creation_date=Date.now()-5*86400000;
  assert.equal((await hook(late)).body.state,'applied');
  assert.ok(close(await endsAt(uid),monthsFromNow(6)));
});

test('Pix/boleto pendente, atrasado ou expirado não libera Premium',async()=>{
  const email=mail(),uid=await student(email),tx='HP-PIX-'+crypto.randomInt(1e6);
  for(const kind of ['PURCHASE_BILLET_PRINTED','PURCHASE_DELAYED']){
    const r=await hook(event(kind,{tx,email}));assert.equal(r.statusCode,200);assert.equal(r.body.ignored,true);
  }
  assert.equal((await hook(event('PURCHASE_EXPIRED',{tx,email}))).statusCode,200);
  assert.equal((await getEffectivePlan(sql,uid)).plan,'free');
  assert.equal((await orderOf(tx)).credit_applied,false);
});

test('reembolso, chargeback e cancelamento revogam; progresso preservado; recursos Premium bloqueados',async()=>{
  for(const [kind,status] of [['PURCHASE_REFUNDED','REFUNDED'],['PURCHASE_CHARGEBACK','CHARGEBACK'],
    ['PURCHASE_CANCELED','CANCELED'],['PURCHASE_REFUNDED','PARTIALLY_REFUNDED']]){
    const email=mail(),uid=await student(email),tx='HP-REV-'+crypto.randomInt(1e9);
    await sql`INSERT INTO central_user_sync_state(user_id,revision,payload) VALUES(${uid},1,'{"cpc-m05":{"percent":45}}'::jsonb)`;
    await hook(event('PURCHASE_APPROVED',{tx,email}));
    assert.equal(await canAccessFeature(sql,{id:uid,role:'aluno',active:true},'tec.links'),true);
    const r=await hook(event(kind,{tx,email,status}));
    assert.equal(r.statusCode,200,kind+'/'+status+': '+JSON.stringify(r.body));
    assert.equal((await getEffectivePlan(sql,uid)).plan,'free',kind+'/'+status);
    assert.equal(await canAccessFeature(sql,{id:uid,role:'aluno',active:true},'tec.links'),false);
    assert.equal(await canAccessFeature(sql,{id:uid,role:'aluno',active:true},'qc.links'),false);
    const [p]=await sql`SELECT payload FROM central_user_sync_state WHERE user_id=${uid}`;
    assert.equal(p.payload['cpc-m05'].percent,45);
  }
});

test('reembolso de uma de duas compras retira só o tempo dela',async()=>{
  const email=mail(),uid=await student(email),tx1='HP-A-'+crypto.randomInt(1e9);
  await hook(event('PURCHASE_APPROVED',{tx:tx1,email,offer:OFFER6}));
  await hook(event('PURCHASE_APPROVED',{email,offer:OFFER12}));
  await hook(event('PURCHASE_REFUNDED',{tx:tx1,email}));
  assert.equal((await getEffectivePlan(sql,uid)).plan,'premium');
  assert.ok(close(await endsAt(uid),monthsFromNow(12)));
});

test('vencimento devolve ao Gratuito com progresso preservado',async()=>{
  const email=mail(),uid=await student(email);
  await sql`INSERT INTO central_user_sync_state(user_id,revision,payload) VALUES(${uid},1,'{"m":1}'::jsonb)`;
  await hook(event('PURCHASE_APPROVED',{email}));
  await sql`UPDATE central_user_subscriptions SET ends_at=starts_at+INTERVAL '1 microsecond'
    WHERE user_id=${uid} AND grant_source='hotmart'`;
  assert.equal((await getEffectivePlan(sql,uid)).plan,'free');
  assert.equal(await canAccessFeature(sql,{id:uid,role:'aluno',active:true},'tec.links'),false);
  assert.equal((await sql`SELECT 1 FROM central_user_sync_state WHERE user_id=${uid}`).length,1);
  // Nova compra depois de vencido reinicia o prazo a partir de agora.
  await hook(event('PURCHASE_APPROVED',{email,offer:OFFER12}));
  assert.ok(close(await endsAt(uid),monthsFromNow(12)));
});

test('falha de SMTP responde 503 para a Hotmart reenviar e não perde a compra',async()=>{
  const email=mail(),body=event('PURCHASE_APPROVED',{email});
  smtpDown=true;
  try{assert.equal((await hook(body)).statusCode,503)}finally{smtpDown=false}
  const ok=await hook(body);assert.equal(ok.statusCode,200);
  assert.ok(welcome.some(m=>m.to===email));
});

test('falhas autenticadas ficam registradas sem dados pessoais e geram alerta',async()=>{
  const before=alerts.length;
  const unknownOffer=event('PURCHASE_APPROVED',{email:mail(),offer:'oferta-nova'});
  const r=await hook(unknownOffer);
  assert.equal(r.statusCode,200);assert.equal(r.body.ignored,true);
  const recurring=event('PURCHASE_APPROVED',{email:mail()});recurring.data.subscription={subscriber:{code:'X'}};
  assert.equal((await hook(recurring)).statusCode,422);
  const issues=await sql`SELECT * FROM central_hotmart_webhook_issues ORDER BY id`;
  const offer=issues.find(i=>i.event_id===unknownOffer.id);
  assert.ok(offer,'oferta desconhecida registrada');assert.equal(offer.reason,'offer_not_configured');
  assert.ok(issues.some(i=>i.event_id===recurring.id&&i.http_status===422));
  assert.ok(!JSON.stringify(issues).includes('@'),'sem e-mail de comprador no registro');
  assert.ok(alerts.length>before,'alerta enviado');
  assert.ok(alerts.every(a=>!String(a.text).includes(HOTTOK)));
});

test('revisão manual (conta da equipe) é registrada e alertada; reprocessamento libera depois do ajuste',async()=>{
  const email=mail(),id=crypto.randomUUID();
  await sql`INSERT INTO central_users(user_id,name,email,role,password_hash,active) VALUES(${id},'Equipe',${email},'editor','x',TRUE)`;
  const tx='HP-MR-'+crypto.randomInt(1e9);
  assert.equal((await hook(event('PURCHASE_APPROVED',{tx,email}))).body.state,'manual_review');
  assert.ok((await sql`SELECT 1 FROM central_hotmart_webhook_issues WHERE transaction_id=${tx} AND reason='manual_review'`).length);
  await sql`UPDATE central_users SET role='aluno' WHERE user_id=${id}`;
  const [again]=await sql`SELECT * FROM central_hotmart_reprocess_order(${tx})`;
  assert.equal(again.outcome,'applied');
  assert.equal((await getEffectivePlan(sql,id)).plan,'premium');
});

test('compra internacional (conversão automática de moeda) libera o plano da oferta',async()=>{
  const email=mail(),uid=await student(email),body=event('PURCHASE_APPROVED',{email,offer:OFFER12});
  body.data.purchase.price={value:34.5,currency_value:'USD'};
  assert.equal((await hook(body)).body.state,'applied');
  assert.ok(close(await endsAt(uid),monthsFromNow(12)));
});

test('Production sem HOTMART_LIVE_ENABLED permanece fechada (503)',async()=>{
  const prod=createHotmartWebhook({env:{...env,VERCEL_ENV:'production',HOTMART_TEST_RECEIVER_ENABLED:'true'},sqlProvider:()=>sql});
  const r=await call(prod,{method:'POST',headers:{'content-type':'application/json','x-hotmart-hottok':HOTTOK},body:event('PURCHASE_APPROVED',{email:mail()})});
  assert.equal(r.statusCode,503);
});
