import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {protectedAsset} from '../lib/protected-content.js';
import middleware from '../middleware.js';

const middlewareSource=readFileSync(new URL('../middleware.js',import.meta.url),'utf8');
const signup=readFileSync(new URL('../cadastro-gratuito.html',import.meta.url),'utf8');
const documents=[
 ['/termos-de-uso.html','Termos de Uso'],
 ['/politica-de-privacidade.html','Política de Privacidade'],
 ['/politica-de-cookies.html','Política de Cookies']
];

test('As páginas legais estão explicitamente na lista pública do middleware',()=>{
 const match=middlewareSource.match(/const PUBLIC_PATHS = new Set\(\[([\s\S]*?)\]\);/);
 assert.ok(match,'Lista pública não localizada');
 for(const [route] of documents){
  assert.ok(match[1].includes("'"+route+"'"),route+' ainda exige login');
  assert.equal(protectedAsset(route),null);
 }
 assert.ok(!match[1].includes("'/planos.html'"),'Admin não pode virar público');
 assert.ok(!match[1].includes("'/usuarios.html'"),'Gestão não pode virar pública');
 assert.ok(!match[1].includes("'/tools/decorando.html'"),'Ferramenta protegida não pode virar pública');
});

test('Links do cadastro apontam para textos existentes, com título correto',()=>{
 for(const [route,title] of documents){
  const page=readFileSync(new URL('..'+route,import.meta.url),'utf8');
  assert.match(page,/<!doctype html>/i);
  assert.ok(page.includes('<title>')&&page.includes(title),route+' tem título inesperado');
  assert.ok(page.includes('basecompleta.estudos@gmail.com'),route+' deve informar o canal de contato');
 }
 assert.ok(signup.includes('href="/termos-de-uso.html"'));
 assert.ok(signup.includes('href="/politica-de-privacidade.html"'));
});

test('Middleware permite GET anônimo das páginas legais sem liberar conteúdo Premium',async()=>{
 for(const [route] of documents){
  const request=new Request('https://example.test'+route,{method:'GET'});
  const response=await middleware(request);
  assert.notEqual(response.status,302,'Documento redirecionado para login: '+route);
  assert.notEqual(response.status,403,'Documento bloqueado: '+route);
 }
 const request=new Request('https://example.test/central-v119.html',{method:'GET'});
 const response=await middleware(request);
 assert.equal(response.status,302,'A plataforma deve continuar protegida');
 assert.match(response.headers.get('location')||'',/login\.html/);
});

test('Política de Cookies descreve o cookie de sessão real e nenhum rastreador',()=>{
 const cookies=readFileSync(new URL('../politica-de-cookies.html',import.meta.url),'utf8');
 const auth=readFileSync(new URL('../lib/auth.js',import.meta.url),'utf8');
 const name=auth.match(/COOKIE_NAME = '([^']+)'/)[1];
 assert.ok(cookies.includes(name),'Política deve citar o cookie '+name);
 assert.match(auth,/HttpOnly; Secure; SameSite=Lax/);
 assert.ok(cookies.includes('challenges.cloudflare.com'));
 const signupPage=readFileSync(new URL('../cadastro-gratuito.html',import.meta.url),'utf8');
 assert.doesNotMatch(signupPage,/googletagmanager|google-analytics|gtag\(|fbq\(|_vercel\/insights/i);
});
