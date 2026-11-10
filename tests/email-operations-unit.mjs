import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {emailAuditKind,auditEmailDelivery} from '../lib/email-audit.js';
import {premiumAutomationEnabled,premiumAutomationFields,runPremiumEmailAutomation} from '../lib/email-premium-automation.js';
const base=import.meta.url;
test('audit events explicitly recognized; never store content or recipient',async()=>{
 assert.equal(emailAuditKind({auditKind:'signup-confirmation'}),'signup-confirmation');
 assert.equal(emailAuditKind({auditKind:'arbitrary'}),null);
 const queries=[];
 const sql=(parts,...args)=>{queries.push({parts:parts.join('?'),args});return Promise.resolve([])};
 const ok=await auditEmailDelivery({
  message:{auditKind:'signup-confirmation',to:'aluno@example.com',text:'DO NOT LOG CONTENT'},
  config:{provider:'resend'},outcome:'accepted',providerId:'res_mock_123',
  env:{AUTH_SECRET:'s'.repeat(40)},sqlProvider:()=>sql
 });
 assert.equal(ok,true);
 assert.equal(queries.length,2);
 const insert=queries[1];
 assert.ok(insert.args.some(x=>typeof x==='string'&&x.length===64),'recipient HMAC required');
 assert.ok(!JSON.stringify(queries).includes('aluno@example.com'));
 assert.ok(!JSON.stringify(queries).includes('DO NOT LOG CONTENT'));
});
test('audit database failure cannot invalidate successful email',async()=>{
 const result=await auditEmailDelivery({message:{auditKind:'signup-welcome',to:'x@example.com'},config:{provider:'resend'},
 outcome:'accepted',sqlProvider:()=>{throw Error('DATABASE_DOWN')}});
 assert.equal(result,false);
});
test('premium automation starts disabled and never queries on missing flag',async()=>{
 assert.equal(premiumAutomationEnabled({VERCEL_ENV:'production'}),false);
 assert.equal(premiumAutomationEnabled({VERCEL_ENV:'preview',BC_PREMIUM_EMAIL_AUTOMATION_ENABLED:'YES'}),false);
 assert.equal(premiumAutomationEnabled({VERCEL_ENV:'production',BC_PREMIUM_EMAIL_AUTOMATION_ENABLED:'YES'}),true);
 const res=await runPremiumEmailAutomation({env:{VERCEL_ENV:'production'},sqlProvider:()=>{throw Error('must not connect')}});
 assert.deepEqual(res,{disabled:true,attempted:0,sent:0,failed:0});
});
test('premium reminder formats verified expiry dates without imaginary pricing',()=>{
 const fields=premiumAutomationFields({name:'Maria A',endsAt:'2027-05-10T12:00:00Z',kind:'expiring'});
 assert.equal(fields.PRIMEIRO_NOME,'Maria');
 assert.equal(fields.DATA_VENCIMENTO,'10/05/2027');
 assert.equal(fields.DIAS_RESTANTES,'7');
 assert.match(fields.LINK_CENTRAL,/^https:\/\/app\.basecompleta\.com\.br/);
 assert.throws(()=>premiumAutomationFields({kind:'expired',endsAt:'invalid'}));
});
test('admin email page only uses authenticated history endpoint, no untrusted HTML',()=>{
 const html=readFileSync(new URL('../admin-email-ops.html',base),'utf8');
 const admin=readFileSync(new URL('../api/admin-dashboard.js',base),'utf8');
 const page=readFileSync(new URL('../usuarios.html',base),'utf8');
 assert.match(admin,/requireSession\(req,\['admin'\]\)/);
 assert.match(admin,/email-history/);
 assert.match(page,/admin-email-ops\.html/);
 assert.match(html,/textContent=String\(value/);
 assert.doesNotMatch(html,/innerHTML\s*=\s*item/);
});
test('cron requires a bearer token and disabled automation never sends',()=>{
 const cron=readFileSync(new URL('../api/premium-expiry-reminders.js',base),'utf8');
 assert.match(cron,/safeSecretEqual\(auth,'Bearer '\+secret\)/);
 assert.match(cron,/premiumAutomationEnabled\(\)/);
});
