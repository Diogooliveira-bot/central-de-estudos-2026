import test from 'node:test';
import assert from 'node:assert/strict';
import {assertPreviewDatabaseIsolation} from '../lib/auth.js';

const branch='integration/lancamento-base-completa-20261028';
const host='ep-codex-test.us-east-1.aws.neon.tech';
const url='postgresql://ficticio:senha-ficticia@'+host+'/neondb?sslmode=require';
const allowed={
 VERCEL_ENV:'preview',VERCEL_GIT_COMMIT_REF:branch,
 BC_PREVIEW_NEON_EXPECTED_HOST:host,DATABASE_URL:url
};

test('Preview de lançamento aceita somente endpoint Neon TEST explicitamente aprovado',()=>{
 assert.equal(assertPreviewDatabaseIsolation(allowed),true);
 assert.equal(assertPreviewDatabaseIsolation({...allowed,BC_PREVIEW_NEON_GUARD:'YES'}),true);
});
test('Preview de lançamento falha se a variável de host TEST faltar',()=>{
 assert.throws(()=>assertPreviewDatabaseIsolation({...allowed,BC_PREVIEW_NEON_EXPECTED_HOST:''}),/Preview bloqueada/);
});
test('Preview de lançamento falha se apontar para o Neon principal ou outra branch',()=>{
 const bad='postgresql://ficticio:senha-ficticia@ep-production.us-east-1.aws.neon.tech/neondb?sslmode=require';
 assert.throws(()=>assertPreviewDatabaseIsolation({...allowed,DATABASE_URL:bad}),/banco Neon diferente/);
});
test('Preview de lançamento não aceita host de outro provedor ou URL inválida',()=>{
 assert.throws(()=>assertPreviewDatabaseIsolation({...allowed,BC_PREVIEW_NEON_EXPECTED_HOST:'localhost'}),/host Neon TEST/);
 assert.throws(()=>assertPreviewDatabaseIsolation({...allowed,DATABASE_URL:'invalid'}),/conexão Neon inválida/);
 assert.throws(()=>assertPreviewDatabaseIsolation({...allowed,DATABASE_URL:'https://'+host+'/neondb'}),/banco Neon diferente/);
});
test('Preview de lançamento com guard explícito independe da variável automática de Git',()=>{
 assert.throws(()=>assertPreviewDatabaseIsolation({...allowed,VERCEL_GIT_COMMIT_REF:'',BC_PREVIEW_NEON_GUARD:'YES',DATABASE_URL:'postgresql://ficticio:fake@ep-wrong.us-east-1.aws.neon.tech/neondb'}),/banco Neon diferente/);
});
test('Production e outras Previews não herdam o guard isolado da integração',()=>{
 assert.equal(assertPreviewDatabaseIsolation({...allowed,VERCEL_ENV:'production',DATABASE_URL:'postgresql://mock:mock@ep-other.us-east-1.aws.neon.tech/neondb'}),true);
 assert.equal(assertPreviewDatabaseIsolation({...allowed,VERCEL_GIT_COMMIT_REF:'feature-outra-preview',BC_PREVIEW_NEON_GUARD:'',DATABASE_URL:'postgresql://mock:mock@ep-other.us-east-1.aws.neon.tech/neondb'}),true);
});
test('erros do guard não revelam usuário, senha ou URL do Neon',()=>{
 const secret='senha-que-nunca-deve-aparecer-nos-logs';
 try{
  assertPreviewDatabaseIsolation({...allowed,DATABASE_URL:'postgresql://ficticio:'+secret+'@ep-wrong.us-east-1.aws.neon.tech/neondb'});
  assert.fail('Guard precisa bloquear');
 }catch(error){
  assert.match(error.message,/Preview bloqueada/);
  assert.equal(error.message.includes(secret),false);
  assert.equal(error.message.includes('ep-wrong'),false);
 }
});
