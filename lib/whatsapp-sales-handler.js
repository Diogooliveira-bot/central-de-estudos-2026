import { timingSafeEqual } from "node:crypto";
import { SUPPORT_EMAIL, generateReply, isSignupIntent, redactPersonalData, requiresClaude } from "./whatsapp-sales-assistant.js";
import { extractMessages, verifyMetaSignature, sendText } from "./whatsapp-sales-meta.js";
import { decrypt, encrypt, hashContact, neonStore } from "./whatsapp-sales-store.js";

function sendJson(res, status, data) { res.statusCode = status; res.setHeader?.("content-type", "application/json; charset=utf-8"); res.end(JSON.stringify(data)); }
function equal(a = "", b = "") { const x = Buffer.from(String(a)); const y = Buffer.from(String(b)); return x.length === y.length && timingSafeEqual(x, y); }

function signupBaseUrl(env) {
  if (env.SALES_BASE_URL) return env.SALES_BASE_URL;
  const host = env.VERCEL_BRANCH_URL || env.VERCEL_URL;
  return env.VERCEL_ENV === "preview" && host ? `https://${host}` : "";
}

async function rawBody(req, limit = 256 * 1024) {
  if (Buffer.isBuffer(req.rawBody)) return req.rawBody;
  if (typeof req.rawBody === "string") return Buffer.from(req.rawBody);
  const chunks=[]; let size=0;
  for await (const chunk of req) { size+=chunk.length; if(size>limit) throw new Error("payload too large"); chunks.push(chunk); }
  return Buffer.concat(chunks);
}

function isStop(text) { const n=String(text).normalize("NFD").replace(/[\u0300-\u036f]/g,"").trim().toLowerCase(); return /^(sair|parar|stop|cancelar|nao quero receber.*|nao envie.*|nao mande.*|quero parar.*)$/.test(n); }
function isResume(text) { const n=String(text).normalize("NFD").replace(/[\u0300-\u036f]/g,"").trim().toLowerCase(); return /^(voltar|retomar atendimento|continuar atendimento)$/.test(n); }

export function createHandler({ env=process.env, storeFactory=neonStore, reply=generateReply, send=sendText }={}) {
  return async function handler(req,res) {
    if(req.method==="GET") {
      const q=req.query||Object.fromEntries(new URL(req.url,"https://localhost").searchParams);
      if(q["hub.mode"]!=="subscribe"||!env.META_WEBHOOK_VERIFY_TOKEN||!equal(q["hub.verify_token"],env.META_WEBHOOK_VERIFY_TOKEN)) return sendJson(res,403,{error:"verification failed"});
      res.statusCode=200; return res.end(String(q["hub.challenge"]||""));
    }
    if(req.method!=="POST") return sendJson(res,405,{error:"method not allowed"});
    if(!env.META_APP_SECRET) return sendJson(res,503,{error:"webhook not configured"});
    let raw; try { raw=await rawBody(req); } catch { return sendJson(res,413,{error:"payload too large"}); }
    const sig=req.headers?.["x-hub-signature-256"]||"";
    if(!verifyMetaSignature(raw,sig,env.META_APP_SECRET)) return sendJson(res,401,{error:"invalid signature"});
    let payload; try { payload=JSON.parse(raw.toString("utf8")); } catch { return sendJson(res,400,{error:"invalid JSON"}); }
    const messages=extractMessages(payload); if(!messages.length) return sendJson(res,200,{received:true,processed:0});
    const baseUrl = signupBaseUrl(env);
    if(!env.DATABASE_URL||!baseUrl) return sendJson(res,503,{error:"storage or signup URL not configured"});
    let store; try { store=await storeFactory(env.DATABASE_URL); await store.purgeExpired?.(); } catch { return sendJson(res,503,{error:"storage unavailable"}); }
    let processed=0; let failed=0;
    for(const message of messages) {
      let claimed=false; let sentSuccessfully=false; let contact=""; let unsentInviteHash="";
      try {
        contact=hashContact(message.from,env);
        claimed=await store.claimEvent(message.id); if(!claimed) continue;
        if(isStop(message.text)) {
          await store.addOptOut(contact); await store.clearContext(contact);
          await send({to:message.from,text:`Tudo certo. Parei as respostas automáticas por aqui. Se precisar, escreva para ${SUPPORT_EMAIL}.`,env});
          await store.finishEvent(message.id,"completed"); processed++; continue;
        }
        if(await store.optedOut(contact)) {
          if(isResume(message.text)) await store.clearOptOut(contact);
          else { await store.finishEvent(message.id,"completed"); processed++; continue; }
        }
        const maxMessages=Number(env.SALES_MAX_MESSAGES_PER_CONTACT_PER_DAY||12);
        const ttl=Number(env.SALES_CONTEXT_TTL_DAYS||30);
        if(!await store.takeContactQuota(contact,maxMessages,ttl)) {
          await send({to:message.from,text:`O limite de mensagens automáticas de hoje foi atingido. Se precisar de ajuda, escreva para ${SUPPORT_EMAIL}.`,env});
          await store.finishEvent(message.id,"completed"); processed++; continue;
        }
        const prior=await store.readContext(contact); const history=prior?decrypt(prior,env):[];
        const safeText=redactPersonalData(message.text); let answer;
        if(isSignupIntent(safeText)) {
          try { const invite=await store.createInviteLink(baseUrl); unsentInviteHash=invite.tokenHash; answer=`Pronto! Aqui está seu convite individual para criar sua conta gratuita: ${invite.url} Ele vale por 7 dias e só pode ser usado uma vez. No cadastro, crie sua própria senha. Não envie sua senha pelo WhatsApp.`; }
          catch { answer=`Não consegui gerar seu link agora. Para receber ajuda, escreva para ${SUPPORT_EMAIL}.`; }
        } else if(requiresClaude(safeText,env)&&!await store.takeClaudeQuota(Number(env.SALES_MAX_CLAUDE_CALLS_PER_DAY||100))) {
          answer=`No momento não consigo responder automaticamente. Escreva para ${SUPPORT_EMAIL}.`;
        } else {
          answer=await reply({text:safeText,history,env});
        }
        const first=!history.length;
        const final=first?`Oi! Sou a atendente virtual da Base Completa e uso IA para responder. Posso manter o contexto desta conversa por até ${ttl} dias. Não envie senha, cartão ou documentos por aqui. Escreva SAIR para parar as respostas. ${answer}`:answer;
        await send({to:message.from,text:final,env});
        sentSuccessfully=true;
        await store.finishEvent(message.id,"completed");
        unsentInviteHash="";
        const next=[...history,{role:"user",content:safeText},{role:"assistant",content:redactPersonalData(final)}].slice(-8);
        await store.writeContext(contact,encrypt(next,env)); processed++;
      } catch {
        failed++;
        if(unsentInviteHash) await store.revokeSalesInvite(unsentInviteHash).catch(()=>{});
        if(claimed&&!sentSuccessfully) await store.finishEvent(message.id,"failed").catch(()=>{});
      }
    }
    return sendJson(res,failed ? 503 : 200,{received:true,processed,failed});
  };
}
