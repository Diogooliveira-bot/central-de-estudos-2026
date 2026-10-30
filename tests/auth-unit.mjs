import { recordFailedLogin } from '../lib/auth.js';
import authHandler from '../api/auth.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import { createSessionToken, verifySessionToken, sessionCookie, clearSessionCookie, sameOriginRequest, normalizeRole, hashPassword, verifyPassword } from '../lib/auth.js';

process.env.AUTH_SECRET='audit-only-secret-for-local-unit-tests-20261007';
const user={user_id:'student-test',email:'student@example.test',name:'Student',role:'aluno',session_version:2};
test('session signature, expiry and version payload',()=>{
  const token=createSessionToken(user,60);
  assert.equal(verifySessionToken(token)?.uid,user.user_id);
  assert.equal(verifySessionToken(token)?.sv,2);
  assert.equal(verifySessionToken(token.slice(0,-1)+'x'),null);
  assert.equal(verifySessionToken(createSessionToken(user,-1)),null);
});
test('cookie flags and origin check',()=>{
  assert.match(sessionCookie('token'),/HttpOnly; Secure; SameSite=Lax/);
  assert.match(clearSessionCookie(),/Max-Age=0/);
  assert.equal(sameOriginRequest({method:'POST',headers:{host:'example.test',origin:'https://example.test','sec-fetch-site':'same-origin'}}),true);
  assert.equal(sameOriginRequest({method:'POST',headers:{host:'example.test',origin:'https://evil.test','sec-fetch-site':'cross-site'}}),false);
});
test('roles and password hash',()=>{
  assert.equal(normalizeRole('editor'),'editor');assert.equal(normalizeRole('superuser'),'');
  const hash=hashPassword('audit-password');assert.equal(verifyPassword('audit-password',hash),true);assert.equal(verifyPassword('wrong-password',hash),false);
});

test('falha de login usa incremento atômico no banco, não contador desatualizado', async()=>{
  let captured = '';
  const unlocked = await recordFailedLogin(async (parts, ...values)=>{
    captured=parts.join('?');
    assert.deepEqual(values,['synthetic-user']);
    return [{locked_until:null}];
  },'synthetic-user');
  assert.equal(unlocked.locked,false);
  assert.match(captured,/UPDATE central_users/);
  assert.match(captured,/failed_attempts\s*\+\s*1/);
  assert.match(captured,/failed_attempts\s*>=\s*4/);
  assert.match(captured,/locked_until IS NULL OR locked_until <= NOW\(\)/);
  const locked=await recordFailedLogin(async()=>[{locked_until:'2026-11-01T00:00:00Z'}],'synthetic-user');
  assert.equal(locked.locked,true);
  assert.equal((await recordFailedLogin(async()=>[],'synthetic-user')).locked,true);
});

test('API de login não divulga detalhes internos quando o banco está indisponível', async()=>{
  const previous=process.env.DATABASE_URL;
  delete process.env.DATABASE_URL;
  const response={
    headers:{},statusCode:0,
    setHeader(name,value){this.headers[name]=value;},
    end(body){this.payload=JSON.parse(body);}
  };
  try{
    await authHandler({
      method:'POST',query:{action:'login'},
      headers:{host:'central.test',origin:'https://central.test'},
      body:{email:'aluno@example.invalid',password:'senha-de-teste'}
    },response);
  }finally{
    if(previous===undefined)delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL=previous;
  }
  assert.equal(response.statusCode,503);
  assert.equal(response.payload.error,'Autenticação temporariamente indisponível');
  assert.doesNotMatch(JSON.stringify(response.payload),/DATABASE_URL|Neon|postgres/i);
  assert.equal(response.headers['Set-Cookie'],undefined);
});
