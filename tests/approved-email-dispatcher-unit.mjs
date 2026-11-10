import test from 'node:test';
import assert from 'node:assert/strict';
import {sendApprovedEventEmail} from '../lib/approved-email-dispatcher.js';
const resendEnv={BC_EMAIL_PROVIDER:'resend',RESEND_API_KEY:'re_mockkey01234567890'};
const fields={PRIMEIRO_NOME:'Ana',LINK_CENTRAL:'https://app.basecompleta.com.br/login.html',
  LINK_PREFERENCIAS:'https://app.basecompleta.com.br/configuracoes.html'};
test('evento Premium confirmado usa Resend e mantém o modelo aprovado',async()=>{
 let emitted;
 const extra={NOME_PLANO:'Premium Semestral',DATA_INICIO:'10/11/2026',DATA_VENCIMENTO:'10/05/2027',IDENTIFICADOR_PEDIDO:'ABC123456'};
 const result=await sendApprovedEventEmail({type:'premium-ativado',to:'teste@example.com',
 fields:{...fields,...extra},verifiedEventId:'hotmart-event-123456',env:resendEnv,
 transport:async(msg,cfg)=>{emitted={msg,cfg};return 'accepted-mock'}});
 assert.equal(result,'accepted-mock');
 assert.match(emitted.msg.subject,/Premium está ativo/);
 assert.match(emitted.msg.html,/Premium Semestral/);
 assert.equal(emitted.cfg.provider,'resend');
});
test('envio de relacionamento sem consentimento é bloqueado',async()=>{
 await assert.rejects(sendApprovedEventEmail({type:'primeiro-estudo',
  to:'teste@example.com',fields,verifiedEventId:'student-event-123',env:resendEnv,
  transport:()=>{throw Error('never')} }),/Consentimento/);
});
test('mensagem sem evento verificado não dispara',async()=>{
 await assert.rejects(sendApprovedEventEmail({type:'suporte-recebido',
  to:'teste@example.com',fields,env:resendEnv,transport:()=>{throw Error('never')} }),/evento verificado/);
});
test('sem configuração válida não envia por nenhum provedor',async()=>{
 await assert.rejects(sendApprovedEventEmail({type:'premium-ativado',
  to:'teste@example.com',fields,verifiedEventId:'hotmart-event-1234',env:{BC_EMAIL_PROVIDER:'resend'},
  transport:()=>{throw Error('never')} }),/Provedor/);
});
