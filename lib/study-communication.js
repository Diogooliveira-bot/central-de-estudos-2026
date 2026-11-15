/* Base Completa — suporte e relatórios solicitados pelo próprio aluno.
   O envio de relatório só pode ter como destinatário o e-mail autenticado. */
import crypto from 'node:crypto';
import { readJsonBody, requireSession, sameOriginRequest } from './auth.js';
import { deliverViaGmail, emailConfig } from './password-reset.js';
import { transactionalEmailConfig, sendTransactionalEmail } from './transactional-email.js';
import { sendApprovedEventEmail } from './approved-email-dispatcher.js';

const SUPPORT_EMAIL = 'basecompleta.estudos@gmail.com';
const ZONE = 'America/Fortaleza';

function respond(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.end(JSON.stringify(body));
}
function clean(v, max=160) { return String(v == null ? '' : v).trim().replace(/[\x00-\x1F\x7F]/g, ' ').replace(/\s+/g, ' ').slice(0, max); }
function escapeHtml(v) { return String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function integer(v, max=100) { const n=Number(v); return Number.isFinite(n) ? Math.max(0, Math.min(max, Math.round(n))) : 0; }
function supportWhatsapp(phone) {
  const digits=String(phone||'').replace(/\D/g,'');
  return /^55\d{10,11}$/.test(digits) ? 'https://wa.me/'+digits : null;
}
function safeReport(input) {
  const source=Array.isArray(input?.disciplines) ? input.disciplines.slice(0, 20) : [];
  const disciplines=source.map(d => ({
    name:clean(d?.name, 85),
    pct:integer(d?.pct),
    modules:(Array.isArray(d?.modules) ? d.modules.slice(0, 75) : []).map(m => ({
      title:clean(m?.title, 145),
      pct:integer(m?.pct)
    })).filter(m => m.title)
  })).filter(d=>d.name);
  let done=0, underway=0, pending=0;
  for (const d of disciplines) for (const m of d.modules) {
    if (m.pct===100) done++;
    else if (m.pct>0) underway++;
    else pending++;
  }
  return {
    disciplines, done, underway, pending,
    studySeconds:integer(input?.studySeconds, 100000000),
    questions:integer(input?.questions, 10000000),
    recordedAt:new Date().toISOString()
  };
}
function reportMessage(user, report) {
  const date=new Intl.DateTimeFormat('pt-BR',{dateStyle:'long',timeZone:ZONE}).format(new Date(report.recordedAt));
  const lines=[
    'BASE COMPLETA — RELATÓRIO DE ESTUDOS',
    'Aluno: '+clean(user.name, 120),
    'Emissão: '+date,
    '',
    'Módulos com conclusão registrada: '+report.done,
    'Módulos com progresso parcial: '+report.underway,
    'Módulos sem progresso registrado: '+report.pending,
    'Questões registradas (estimativa acumulada): '+report.questions,
    'Tempo ativo aproximado acumulado: '+Math.floor(report.studySeconds/3600)+'h '+Math.floor(report.studySeconds%3600/60)+'min',
    ''
  ];
  for (const d of report.disciplines) {
    lines.push(d.name+' — '+d.pct+'%');
    for (const m of d.modules) {
      const status=m.pct===100?'Concluído':m.pct>0?'Em andamento':'Sem progresso registrado';
      lines.push('  - '+m.title+': '+m.pct+'% ('+status+')');
    }
    lines.push('');
  }
  lines.push('Este relatório reflete registros na Central no momento da emissão. 0% significa ausência de progresso registrado, não prova que o assunto não foi estudado fora da plataforma.');
  lines.push('Os indicadores de tempo e questões são aproximados e não constituem certificação de carga horária.');
  return {
    subject:'Seu relatório de estudos · Base Completa',
    text:lines.join('\n'),
    html:'<main style="max-width:720px;margin:auto;font:15px/1.65 Arial,sans-serif;color:#15314b;padding:26px"><h1 style="font-size:23px">Base Completa · Relatório de estudos</h1><div style="white-space:pre-wrap">'+escapeHtml(lines.join('\n'))+'</div></main>'
  };
}
// Protocolo curto exibido ao aluno e à equipe (o id completo fica no banco).
export const ticketProtocol = id => String(id).slice(0, 8).toUpperCase();
// 1) aviso à equipe (Reply-To = e-mail do aluno: responder já escreve para ele); 2) confirmação ao aluno.
// Falha de e-mail nunca derruba o chamado, que já está salvo e aparece no painel do administrador.
export async function notifyTicket({ id, subject, message, user, env = process.env, send = sendTransactionalEmail, sendConfirmation = sendApprovedEventEmail }) {
  const protocol = ticketProtocol(id);
  const text = 'Novo chamado de suporte Base Completa\nProtocolo: ' + protocol + '\nAluno: ' + user.name + '\nE-mail: ' + user.email + '\nAssunto: ' + subject + '\n\n' + message + '\n\n— Responda este e-mail: a resposta vai direto para o aluno.';
  try {
    const cfg = transactionalEmailConfig(env);
    if (cfg) await send({ from: cfg.from, to: SUPPORT_EMAIL, replyTo: user.email, subject: 'Suporte Base Completa #' + protocol + ' · ' + subject, text }, cfg);
  } catch (e) { console.warn('support ticket mail not delivered', String(e?.code || e?.name || 'ERROR').slice(0, 24)); }
  try {
    await sendConfirmation({
      type: 'suporte-recebido', to: user.email, env, verifiedEventId: 'support:' + id,
      fields: {
        PRIMEIRO_NOME: clean(user.name, 60).split(' ')[0] || 'estudante',
        NUMERO_PROTOCOLO: protocol, ASSUNTO_ATENDIMENTO: subject,
        DATA_ABERTURA: new Intl.DateTimeFormat('pt-BR', { timeZone: ZONE, day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date()),
        LINK_CENTRAL: 'https://app.basecompleta.com.br/',
      },
    });
  } catch (e) { console.warn('support confirmation not delivered', String(e?.code || e?.name || 'ERROR').slice(0, 24)); }
}
async function ensureTables(sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS central_student_support_tickets (
      ticket_id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES central_users(user_id) ON DELETE CASCADE,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','closed')),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS central_student_support_tickets_user_idx ON central_student_support_tickets(user_id, created_at DESC)`;
  await sql`
    CREATE TABLE IF NOT EXISTS central_study_report_delivery (
      delivery_id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES central_users(user_id) ON DELETE CASCADE,
      status TEXT NOT NULL DEFAULT 'sending' CHECK (status IN ('sending','sent','failed')),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      completed_at TIMESTAMPTZ
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS central_study_report_delivery_user_idx ON central_study_report_delivery(user_id, created_at DESC)`;
  await sql`CREATE TABLE IF NOT EXISTS central_app_contact_settings(setting_key TEXT PRIMARY KEY, setting_value TEXT NOT NULL DEFAULT '', updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`;
}
export default async function handler(req,res) {
  if (!['GET','POST'].includes(req.method)) {
    res.setHeader('Allow','GET, POST');
    return respond(res,405,{error:'Método não permitido'});
  }
  if (req.method==='POST' && !sameOriginRequest(req)) return respond(res,403,{error:'Origem não permitida'});
  const session=await requireSession(req,['aluno','editor','admin']);
  if (!session.ok) return respond(res,session.status,{error:session.error});
  const action=String(req.query?.action||'config').trim().toLowerCase();
  const isPreviewDemo=process.env.VERCEL_ENV==='preview' && session.user.id==='bc-preview-demo-20261109';
  try {
    const sql=session.sql;
    await ensureTables(sql);
    if (req.method==='GET' && action==='config') {
      const rows=await sql`SELECT setting_value FROM central_app_contact_settings WHERE setting_key='support_whatsapp' LIMIT 1`;
      const number=rows.length?rows[0].setting_value:String(process.env.BC_SUPPORT_WHATSAPP_NUMBER||'');
      return respond(res,200,{email:SUPPORT_EMAIL,whatsappUrl:supportWhatsapp(number),userEmail:session.user.email,
        whatsappNumber:session.user.role==='admin'?String(number||'').replace(/\D/g,''):undefined});
    }
    if (req.method==='GET' && action==='tickets') {
      if (session.user.role!=='admin') return respond(res,403,{error:'Acesso administrativo necessário'});
      const tickets=await sql`
        SELECT t.ticket_id,t.subject,t.message,t.status,t.created_at,t.updated_at,
               u.name AS user_name,u.email AS user_email
        FROM central_student_support_tickets t
        JOIN central_users u ON u.user_id=t.user_id
        ORDER BY t.created_at DESC LIMIT 100
      `;
      return respond(res,200,{tickets});
    }
    if (req.method!=='POST') return respond(res,404,{error:'Ação inválida'});
    const body=await readJsonBody(req);
    if (JSON.stringify(body).length>100000) return respond(res,413,{error:'Dados excessivamente grandes'});
    if (action==='whatsapp-config') {
      if (session.user.role!=='admin') return respond(res,403,{error:'Acesso administrativo necessário'});
      const digits=String(body.phone||'').replace(/\D/g,'');
      if (digits && !/^55\d{10,11}$/.test(digits)) return respond(res,400,{error:'Informe o DDI 55 e um número brasileiro com DDD, ou deixe em branco para desativar.'});
      await sql`INSERT INTO central_app_contact_settings(setting_key,setting_value,updated_at) VALUES('support_whatsapp',${digits},NOW()) ON CONFLICT(setting_key) DO UPDATE SET setting_value=EXCLUDED.setting_value,updated_at=NOW()`;
      return respond(res,200,{ok:true,whatsappUrl:supportWhatsapp(digits)});
    }
    if (action==='contact') {
      const subject=clean(body.subject,120), message=String(body.message||'').trim().slice(0,3000);
      if (subject.length<4 || message.length<12 || message.length>3000) {
        return respond(res,400,{error:'Informe um assunto (4 caracteres) e uma mensagem (12 a 3000 caracteres).'});
      }
      const id=crypto.randomUUID();
      // A limitação também vale entre instâncias da Vercel.
      const created=await sql`
        INSERT INTO central_student_support_tickets(ticket_id,user_id,subject,message)
        SELECT ${id},${session.user.id},${subject},${message}
        WHERE (SELECT COUNT(*) FROM central_student_support_tickets
               WHERE user_id=${session.user.id} AND created_at>NOW()-INTERVAL '1 hour')<5
        RETURNING ticket_id
      `;
      if (!created.length) return respond(res,429,{error:'Limite de cinco mensagens por hora atingido.'});
      if (!isPreviewDemo) await notifyTicket({ id, subject, message, user: session.user });
      return respond(res,201,{ok:true,ticketId:id});
    }
    if (action==='ticket-status') {
      if (session.user.role!=='admin') return respond(res,403,{error:'Acesso administrativo necessário'});
      const id=clean(body.ticketId,70),status=body.status==='closed'?'closed':body.status==='open'?'open':'';
      if (!status || !/^[a-f0-9-]{36}$/i.test(id)) return respond(res,400,{error:'Dados inválidos'});
      const updated=await sql`UPDATE central_student_support_tickets SET status=${status},updated_at=NOW() WHERE ticket_id=${id} RETURNING ticket_id`;
      return respond(res,updated.length?200:404,updated.length?{ok:true}:{error:'Mensagem não encontrada'});
    }
    if (action==='admin-report-email') {
      if (session.user.role!=='admin') return respond(res,403,{error:'Acesso administrativo necessário'});
      const studentId=clean(body.userId,64);
      if (!/^[a-f0-9-]{36}$/i.test(studentId)) return respond(res,400,{error:'Aluno inválido'});
      const cfg=emailConfig();
      if (!cfg) return respond(res,503,{error:'Envio de e-mail não configurado'});
      const rows=await sql`
        SELECT u.name,u.email,p.disciplines,p.modules,p.questions,p.study_seconds
        FROM central_users u
        LEFT JOIN central_user_progress_summary p ON p.user_id=u.user_id
        WHERE u.user_id=${studentId} AND u.role='aluno' AND u.active=TRUE LIMIT 1
      `;
      if (!rows.length) return respond(res,404,{error:'Aluno ativo não encontrado'});
      const row=rows[0], stored=Array.isArray(row.disciplines)?row.disciplines:[];
      const modules=Array.isArray(row.modules)?row.modules:[];
      if (!modules.length) return respond(res,409,{error:'O aluno ainda não sincronizou o progresso por módulo.'});
      const grouped=stored.map(d=>({id:String(d.id||''),name:String(d.name||''),pct:d.pct,modules:[]}));
      for (const m of modules) {
        const group=grouped.find(d=>d.id===String(m.subjectId||''));
        if (group) group.modules.push({title:m.name,pct:m.pct});
      }
      const report=safeReport({disciplines:grouped,questions:row.questions,studySeconds:row.study_seconds});
      const id=crypto.randomUUID();
      const reserved=await sql`
        INSERT INTO central_study_report_delivery(delivery_id,user_id,status)
        SELECT ${id},${studentId},'sending'
        WHERE (SELECT COUNT(*) FROM central_study_report_delivery
               WHERE user_id=${studentId} AND created_at>NOW()-INTERVAL '1 day')<3
          AND NOT EXISTS (
            SELECT 1 FROM central_study_report_delivery
            WHERE user_id=${studentId} AND created_at>NOW()-INTERVAL '5 minutes'
          )
        RETURNING delivery_id
      `;
      if (!reserved.length) return respond(res,429,{error:'Aguarde cinco minutos entre envios (limite de três por aluno/dia).'});
      try {
        const mail=reportMessage({name:row.name},report);
        await deliverViaGmail({from:cfg.from,to:row.email,...mail,messageId:'<'+id+'@basecompleta.local>'},cfg);
        await sql`UPDATE central_study_report_delivery SET status='sent',completed_at=NOW() WHERE delivery_id=${id}`;
        return respond(res,200,{ok:true,email:row.email});
      } catch(e) {
        await sql`UPDATE central_study_report_delivery SET status='failed',completed_at=NOW() WHERE delivery_id=${id}`;
        console.warn('admin study report failed',String(e?.code||e?.name||'ERROR').slice(0,24));
        return respond(res,503,{error:'Não foi possível enviar o relatório agora'});
      }
    }
    if (action==='report-email') {
      if (isPreviewDemo) return respond(res,403,{error:'No modo de demonstração, o envio de e-mails reais está desativado.'});
      const cfg=emailConfig();
      if (!cfg) return respond(res,503,{error:'Envio por e-mail ainda não configurado no servidor.'});
      const report=safeReport(body.report);
      if (!report.disciplines.length || !(report.done+report.underway+report.pending)) {
        return respond(res,400,{error:'Sem dados suficientes de módulos para criar um relatório.'});
      }
      const id=crypto.randomUUID();
      const reserved=await sql`
        INSERT INTO central_study_report_delivery(delivery_id,user_id,status)
        SELECT ${id},${session.user.id},'sending'
        WHERE (SELECT COUNT(*) FROM central_study_report_delivery
               WHERE user_id=${session.user.id} AND created_at>NOW()-INTERVAL '1 day')<3
          AND NOT EXISTS (
            SELECT 1 FROM central_study_report_delivery
            WHERE user_id=${session.user.id} AND created_at>NOW()-INTERVAL '5 minutes'
          )
        RETURNING delivery_id
      `;
      if (!reserved.length) return respond(res,429,{error:'Aguarde cinco minutos entre envios (máximo de três por dia).'});
      try {
        const mail=reportMessage(session.user,report);
        await deliverViaGmail({from:cfg.from,to:session.user.email,...mail,messageId:'<'+id+'@basecompleta.local>'},cfg);
        await sql`UPDATE central_study_report_delivery SET status='sent',completed_at=NOW() WHERE delivery_id=${id}`;
        return respond(res,200,{ok:true,email:session.user.email});
      } catch(e) {
        await sql`UPDATE central_study_report_delivery SET status='failed',completed_at=NOW() WHERE delivery_id=${id}`;
        console.warn('study report email failed',String(e?.code||e?.name||'ERROR').slice(0,24));
        return respond(res,503,{error:'Não foi possível entregar seu relatório agora. Tente novamente mais tarde.'});
      }
    }
    return respond(res,404,{error:'Ação inválida'});
  } catch(error) {
    console.error('study communication failure',String(error?.code||error?.name||'ERROR').slice(0,24));
    return respond(res,503,{error:'Serviço temporariamente indisponível'});
  }
}
