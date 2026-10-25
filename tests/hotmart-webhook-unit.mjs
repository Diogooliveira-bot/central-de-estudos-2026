import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHotmartWebhook, readHotmartEvent, webhookConfig } from '../lib/hotmart-webhook.js';

const token = 'TestOnlyHottok0123456789xxxxxxxx';
const env = {
  VERCEL_ENV: 'preview',
  HOTMART_TEST_RECEIVER_ENABLED: 'true',
  HOTMART_HOTTOK: token,
  HOTMART_PRODUCT_ID: '8805543',
  HOTMART_OFFER_6M_CODE: 'semestreTEST',
  HOTMART_OFFER_12M_CODE: 'anualTEST',
};
function event(eventName='PURCHASE_APPROVED', offer='semestreTEST', overrides={}) {
  return {
    id: 'wh_evt_12345',
    event: eventName,
    version: '2.0.0',
    creation_date: 1792930000000,
    data: {
      product: { id: 8805543 },
      purchase: { transaction: 'HP_TEST_12345', offer: { code: offer },
        price: { value: 1, currency_value: 'BRL' } },
      buyer: { email: 'ALUNO@EXAMPLE.COM' },
    },
    ...overrides,
  };
}
function req(body=event(), secret=token) {
  return {
    method:'POST',body,headers:{
      'x-hotmart-hottok':secret,
      'content-type':'application/json',
    },
  };
}
function result() {
  return {
    statusCode:0,headers:{},
    setHeader(name,value){this.headers[name.toLowerCase()]=value;},
    end(text){this.body=JSON.parse(text);},
  };
}
function fakeDb() {
  const seen=new Set(), queries=[];
  return {
    queries,
    sql:async (chunks,...values) => {
      const statement=chunks.join('?');
      queries.push({ statement, values });
      if (statement.includes('INSERT INTO public.central_hotmart_webhook_inbox')) {
        if (seen.has(values[0])) return [];
        seen.add(values[0]);
        return [{event_id:values[0]}];
      }
      return [];
    },
  };
}
test('sem chave e configuração só admite preview explicitamente habilitada',async()=>{
  assert.equal(webhookConfig({...env,VERCEL_ENV:'production'}),null);
  assert.equal(webhookConfig({...env,HOTMART_TEST_RECEIVER_ENABLED:'false'}),null);
  assert.equal(webhookConfig({...env,HOTMART_HOTTOK:''}),null);
  assert.equal(webhookConfig({...env,HOTMART_OFFER_12M_CODE:'semestreTEST'}),null);
  assert.deepEqual(webhookConfig(env).offers, {semestreTEST:6,anualTEST:12});
});
test('identifica oferta pelo código, jamais pelo preço ou nome',()=>{
  const cfg=webhookConfig(env);
  const approved=readHotmartEvent(event(),cfg);
  assert.equal(approved.value.months,6);
  assert.equal(approved.value.email,'aluno@example.com');
  assert.equal(readHotmartEvent(event('PURCHASE_APPROVED','anualTEST'),cfg).value.months,12);
  assert.equal(readHotmartEvent(event('PURCHASE_APPROVED','outro'),cfg).ignored,true);
  assert.equal(readHotmartEvent(event('PURCHASE_APPROVED','semestreTEST',{data:{...event().data,product:{id:99999}}}),cfg).ignored,true);
});
test('webhook rejeita chave inválida e não toca banco',async()=>{
  const db=fakeDb(),handler=createHotmartWebhook({env,sqlProvider:()=>db.sql});
  const res=result();await handler(req(event(),'invalido'),res);
  assert.equal(res.statusCode,401);
  assert.equal(db.queries.length,0);
  const prod=result();await createHotmartWebhook({env:{...env,VERCEL_ENV:'production'},sqlProvider:()=>db.sql})(req(),prod);
  assert.equal(prod.statusCode,503);
});
test('só POST JSON, com limite, formato e e-mail válidos',async()=>{
  const db=fakeDb(),handler=createHotmartWebhook({env,sqlProvider:()=>db.sql});
  const r1=result();await handler({...req(),method:'GET'},r1);
  assert.equal(r1.statusCode,405);
  const r2=result();await handler({...req(),headers:{...req().headers,'content-type':'text/plain'}},r2);
  assert.equal(r2.statusCode,415);
  const r3=result();await handler({...req(),headers:{...req().headers,'content-length':'500000'}},r3);
  assert.equal(r3.statusCode,413);
  const r4=result();await handler(req({...event(),version:'1.0.0'}),r4);
  assert.equal(r4.statusCode,422);
  const bad=event();bad.data.buyer.email='email-ruim';
  const r5=result();await handler(req(bad),r5);
  assert.equal(r5.statusCode,422);
  assert.equal(db.queries.length,0);
});
test('eventos autenticados são armazenados sem ativar planos e em modo idempotente',async()=>{
  const db=fakeDb(),handler=createHotmartWebhook({env,sqlProvider:()=>db.sql});
  const accepted=result();await handler(req(),accepted);
  assert.equal(accepted.statusCode,200);
  assert.equal(accepted.body.received,true);
  assert.equal(accepted.body.duplicate,false);
  const duplicate=result();await handler(req(),duplicate);
  assert.equal(duplicate.body.duplicate,true);
  const inserted=db.queries.filter(x=>x.statement.includes('INSERT INTO public.central_hotmart_webhook_inbox'));
  assert.equal(inserted.length,2);
  assert.equal(inserted[0].values[5],6);
  assert.equal(inserted[0].values[6],'aluno@example.com');
  assert.ok(db.queries.every(x=>!x.statement.includes('central_user_subscriptions')));
  const refund=event('PURCHASE_REFUNDED','anualTEST',{id:'wh_evt_54321'});
  const r=result();await handler(req(refund),r);
  assert.equal(r.statusCode,200);
  const refundSql=db.queries.filter(x=>x.statement.includes('INSERT INTO public.central_hotmart_webhook_inbox')).at(-1);
  assert.equal(refundSql.values[1],'PURCHASE_REFUNDED');
  assert.equal(refundSql.values[5],12);
});
test('roteamento público e configuração na Vercel são limitados a webhook sem credenciais no código',async()=>{
  const auth=await readFile(new URL('../api/auth.js',import.meta.url),'utf8');
  const vercel=JSON.parse(await readFile(new URL('../vercel.json',import.meta.url),'utf8'));
  assert.match(auth,/premiumApi === 'hotmart-webhook'/);
  assert.ok(vercel.rewrites.some(x=>x.source==='/api/hotmart-webhook'&&x.destination==='/api/auth?bc_api=hotmart-webhook'));
  const migration=await readFile(new URL('../db/migrations/002_hotmart_webhook_inbox.sql',import.meta.url),'utf8');
  assert.match(migration,/CREATE TABLE IF NOT EXISTS public.central_hotmart_webhook_inbox/);
  assert.doesNotMatch(migration,/DROP TABLE|TRUNCATE|DELETE FROM central_users/i);
});
