import test from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { createHandler } from "../lib/whatsapp-sales-handler.js";
import { hashContact } from "../lib/whatsapp-sales-store.js";

const env={META_APP_SECRET:"meta-secret",META_WEBHOOK_VERIFY_TOKEN:"verify-token",DATABASE_URL:"test-only",SALES_BASE_URL:"https://preview.example.vercel.app",SALES_HASH_KEY:"hash",SALES_CONTEXT_ENCRYPTION_KEY:Buffer.alloc(32,1).toString("base64")};
const res=()=>({setHeader(){},end(body=""){this.body=body;}});
const payload=(id,text)=>({object:"whatsapp_business_account",entry:[{changes:[{value:{messages:[{id,from:"5511999999999",type:"text",text:{body:text}}]}}]}]});
const request=(data)=>{const rawBody=Buffer.from(JSON.stringify(data));return{method:"POST",rawBody,headers:{"x-hub-signature-256":`sha256=${createHmac("sha256",env.META_APP_SECRET).update(rawBody).digest("hex")}`}};};

function memoryStore(){
 const ids=new Set(), optout=new Set(), context=new Map(), invites=[];
 return {ids,optout,context,invites,
  async purgeExpired(){},async claimEvent(id){if(ids.has(id))return false;ids.add(id);return true;},async finishEvent(){},
  async takeContactQuota(){return true;},async takeClaudeQuota(){return true;},async readContext(hash){return context.get(hash)||null;},async writeContext(hash,v){context.set(hash,v);},async clearContext(hash){context.delete(hash);},
  async optedOut(hash){return optout.has(hash);},async addOptOut(hash){optout.add(hash);},async clearOptOut(hash){optout.delete(hash);},
  async createInviteLink(base){invites.push(base);return{url:`${base}/convite.html?token=one-time-token`,tokenHash:"mock-hash"};},
  async revokeSalesInvite(){},
 };
}

test("GET confirma webhook só com token correto",async()=>{
 const h=createHandler({env});const r=res();
 await h({method:"GET",query:{"hub.mode":"subscribe","hub.verify_token":"verify-token","hub.challenge":"abc"}},r);
 assert.equal(r.statusCode,200);assert.equal(r.body,"abc");
});

test("evento repetido não cria segundo convite nem envia segunda mensagem",async()=>{
 const store=memoryStore(),sent=[];
 const h=createHandler({env,storeFactory:async()=>store,send:async m=>sent.push(m),reply:async()=>"Resposta"});
 for(let i=0;i<2;i++){const r=res();await h(request(payload("wamid.signup","Quero me cadastrar")),r);assert.equal(r.statusCode,200);}
 assert.equal(store.invites.length,1);assert.equal(sent.length,1);assert.match(sent[0].text,/convite individual/);assert.match(sent[0].text,/convite.html/);
});

test("SAIR remove contexto e bloqueia as próximas respostas",async()=>{
 const store=memoryStore(),sent=[];const h=createHandler({env,storeFactory:async()=>store,send:async m=>sent.push(m),reply:async()=>"Resposta"});
 const contactHash=hashContact("5511999999999",env);store.context.set(contactHash,{ciphertext:"encrypted",iv:"iv",tag:"tag"});
 const stop=payload("wamid.stop","SAIR");await h(request(stop),res());
 const later=payload("wamid.later","Qual o preço?");await h(request(later),res());
 assert.equal(sent.length,1);assert.equal(store.optout.size,1);assert.equal(store.context.has(contactHash),false);
});

test("webhook rejeita assinatura falsa sem criar convite",async()=>{
 const store=memoryStore();const h=createHandler({env,storeFactory:async()=>store});
 const req=request(payload("wamid.bad","Quero me cadastrar"));req.headers["x-hub-signature-256"]="sha256=bad";const r=res();
 await h(req,r);assert.equal(r.statusCode,401);assert.equal(store.invites.length,0);
});

test("Preview usa o endereço de branch da Vercel para convites sem variável adicional",async()=>{
 const store=memoryStore();const sent=[];
 const h=createHandler({env:{...env,SALES_BASE_URL:"",VERCEL_ENV:"preview",VERCEL_BRANCH_URL:"central-de-estudos-git-homologacao-estudotd.vercel.app"},storeFactory:async()=>store,send:async x=>sent.push(x),reply:async()=>"Resposta"});
 const r=res();await h(request(payload("wamid.preview-signup","Quero me cadastrar")),r);
 assert.equal(store.invites[0],"https://central-de-estudos-git-homologacao-estudotd.vercel.app");
 assert.equal(sent.length,1);
});
