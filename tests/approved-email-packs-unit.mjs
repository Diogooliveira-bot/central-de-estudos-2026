import test from 'node:test';
import assert from 'node:assert/strict';
import {APPROVED_EMAIL_TYPES,renderApprovedEmail} from '../lib/approved-email-packs.js';
import {readFileSync} from 'node:fs';

function fields(type){
 const source=readFileSync(new URL('../lib/email-packs/'+type+'.js',import.meta.url),'utf8');
 const keys=new Set([...source.matchAll(/{{([A-Z][A-Z0-9_]*)}}/g)].map(x=>x[1]));
 const data={};
 for(const key of keys){
   data[key]=key.startsWith('LINK_')?'https://app.basecompleta.com.br/login.html'
     :key==='PERCENTUAL_BARRA'?55
     :key.startsWith('PERCENTUAL_')||key==='APROVEITAMENTO'?'55%'
     :key==='PRIMEIRO_NOME'?'Ana': 'Dado demonstrativo';
 }
 return data;
}
test('nove modelos aprovados são renderizáveis sem campos restantes nem CID',()=>{
 assert.equal(APPROVED_EMAIL_TYPES.length,9);
 for(const type of APPROVED_EMAIL_TYPES){
   const mail=renderApprovedEmail(type,fields(type));
   assert.ok(mail.subject.length>5,type);
   assert.match(mail.html,/BASE COMPLETA/i,type);
   assert.ok(mail.text.length>30,type);
   assert.doesNotMatch(mail.html,/cid:bc-|{{[A-Z_]+}}/,type);
   assert.doesNotMatch(mail.text,/{{[A-Z_]+}}/,type);
   assert.ok(mail.html.includes('https://app.basecompleta.com.br/icons/email/logo.webp'),type);
 }
});
test('dados incompletos ou URLs arbitrárias impedem o envio',()=>{
 assert.throws(()=>renderApprovedEmail('premium-ativado',{}),/obrigatório/);
 assert.throws(()=>renderApprovedEmail('inexistente',{}),/desconhecido/);
 const values=fields('premium-ativado');
 values.LINK_CENTRAL='https://evil.example/entrar';
 assert.throws(()=>renderApprovedEmail('premium-ativado',values),/não autorizado/);
});
test('nome injetado é escapado no HTML',()=>{
 const values=fields('premium-ativado');
 values.PRIMEIRO_NOME='<script>alert(1)</script>';
 const msg=renderApprovedEmail('premium-ativado',values);
 assert.doesNotMatch(msg.html,/<script>alert\(1\)<\/script>/);
 assert.match(msg.html,/&lt;script&gt;/);
});
test('resumo semanal valida percentuais e não admite valores arbitrários em CSS',()=>{
 const values=fields('resumo-semanal');
 values.PERCENTUAL_BARRA='50;position:absolute';
 assert.throws(()=>renderApprovedEmail('resumo-semanal',values),/Percentual inválido/);
});
