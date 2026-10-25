import test from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { deterministicAnswer, isSignupIntent, redactPersonalData, requiresClaude, systemPrompt } from "../lib/whatsapp-sales-assistant.js";
import { extractMessages, verifyMetaSignature } from "../lib/whatsapp-sales-meta.js";
import { createStore, decrypt, encrypt, hashContact } from "../lib/whatsapp-sales-store.js";

const env={SALES_HASH_KEY:"local-test-hash-key",SALES_CONTEXT_ENCRYPTION_KEY:Buffer.alloc(32,9).toString("base64")};

test("apresenta regras confirmadas e não inventa preço",()=>{
 assert.match(deterministicAnswer("plano gratuito"),/20 questões por dia/);
 assert.match(deterministicAnswer("quanto custa o premium?"),/preço confirmado/);
 assert.match(deterministicAnswer("premium TEC Qconcursos"),/exclusivos/);
});

test("detecta pedido de cadastro e não gera convite para pergunta vaga",()=>{
 assert.equal(isSignupIntent("Quero me cadastrar"),true);
 assert.equal(isSignupIntent("Como posso criar minha conta?"),true);
 assert.equal(isSignupIntent("Qual é o preço?"),false);
});

test("retira identificadores sensíveis e protege prompt de ações administrativas",()=>{
 const clean=redactPersonalData("e-mail ana@example.com CPF 123.456.789-09");
 assert.doesNotMatch(clean,/ana@example|123\.456/);
 assert.match(systemPrompt(),/não consulte alunos/);
 assert.match(systemPrompt(),/Não invente preço/);
});

test("perguntas factuais e cadastro não consomem chamada Claude",()=>{
 const cfg={SALES_ANTHROPIC_API_KEY:"test",SALES_ANTHROPIC_MODEL:"haiku"};
 assert.equal(requiresClaude("Quanto custa o Premium?",cfg),false);
 assert.equal(requiresClaude("Quero me cadastrar",cfg),false);
 assert.equal(requiresClaude("Me explica como organizar os estudos",cfg),true);
});

test("valida HMAC Meta e extrai só mensagens textuais",()=>{
 const body=Buffer.from('{"object":"whatsapp_business_account"}');
 const secret="test-secret"; const sig=`sha256=${createHmac("sha256",secret).update(body).digest("hex")}`;
 assert.equal(verifyMetaSignature(body,sig,secret),true);
 assert.equal(verifyMetaSignature(body,"sha256=nope",secret),false);
 const messages=extractMessages({object:"whatsapp_business_account",entry:[{changes:[{value:{messages:[{id:"wamid.1",from:"5511999999999",type:"text",text:{body:"oi"}},{id:"wamid.2",from:"1",type:"image"}]}}]}]});
 assert.equal(messages.length,1);
});

test("hash de contato e contexto cifrado não expõem telefone ou conversa",()=>{
 const phone="5511999999999"; assert.notEqual(hashContact(phone,env),phone);
 const value=[{role:"user",content:"quero entrar"}]; const box=encrypt(value,env);
 assert.deepEqual(decrypt(box,env),value); assert.doesNotMatch(box.ciphertext,/quero entrar/);
});

test("convite automático expõe token só no link e persiste hash",async()=>{
 let query="";let values=[];
 const sql=async(strings,...args)=>{query=strings.join("?");values=args;return[{invitation_id:args[2]}];};
 const store=createStore(sql);
 const invite=await store.createInviteLink("https://preview.example.vercel.app/");
 const url=invite.url;
 const token=new URL(url).searchParams.get("token");
 assert.match(url,/\/convite\.html\?token=/);
 assert.equal(token.length,43);
 assert.match(query,/whatsapp-sales-assistant/);
 assert.equal(values.includes(token),false);
 assert.match(query,/total<100/);
 assert.equal(invite.tokenHash.length,64);
});
