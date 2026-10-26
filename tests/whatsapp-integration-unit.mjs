import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const auth = readFileSync(new URL('../api/auth.js', import.meta.url),'utf8');
const cfg = JSON.parse(readFileSync(new URL('../vercel.json',import.meta.url),'utf8'));
const migration = readFileSync(new URL('../db/migrations/004_whatsapp_sales.sql',import.meta.url),'utf8');

test('WhatsApp roteado dentro da função auth sem criar décima segunda função',()=>{
  assert.match(auth,/createWhatsappSalesHandler/);
  assert.match(auth,/bodyParser:\s*false/);
  assert.ok(auth.indexOf("action === 'whatsapp-sales'") < auth.indexOf("!sameOriginRequest(req)"));
  assert.deepEqual(cfg.rewrites.find(x=>x.source==='/api/whatsapp-sales'),{
    source:'/api/whatsapp-sales',destination:'/api/auth?action=whatsapp-sales'
  });
});
test('Hotmart, recuperação de senha, convites e planos permanecem na auth',()=>{
  for(const item of ['handleHotmartWebhook(req, res)','handleHotmartClaim(req, res)',
    'handlePasswordReset(req, res','handleInviteAction(req, res','handlePlans(req, res)']) {
    assert.ok(auth.includes(item),item);
  }
});
test('migração comercial é aditiva e não mexe em assinaturas nem compradores',()=>{
  assert.match(migration,/CREATE TABLE IF NOT EXISTS whatsapp_sales_events/);
  assert.match(migration,/CREATE TABLE IF NOT EXISTS whatsapp_sales_conversations/);
  assert.doesNotMatch(migration,/\b(?:DROP|TRUNCATE|DELETE|UPDATE)\s+(?:TABLE\s+)?central_/i);
});
