// A rota já está agendada uma vez por dia no vercel.json.
// Só executa se houver CRON_SECRET e a automação estiver explicitamente habilitada.
import {safeSecretEqual} from '../lib/auth.js';
import {runPremiumEmailAutomation,premiumAutomationEnabled} from '../lib/email-premium-automation.js';

export default async function handler(req,res){
  res.setHeader('Cache-Control','private, no-store');
  res.setHeader('Content-Type','application/json; charset=utf-8');
  if(req.method!=='GET'){res.statusCode=405;return res.end(JSON.stringify({error:'Método inválido'}));}
  const secret=String(process.env.CRON_SECRET||'');
  const auth=String(req.headers?.authorization||'');
  if(secret.length<32||!safeSecretEqual(auth,'Bearer '+secret)){
    res.statusCode=401;return res.end(JSON.stringify({error:'Não autorizado'}));
  }
  if(!premiumAutomationEnabled()){
    res.statusCode=200;return res.end(JSON.stringify({enabled:false,attempted:0,sent:0,failed:0}));
  }
  try{
    const result=await runPremiumEmailAutomation();
    res.statusCode=200;return res.end(JSON.stringify(result));
  }catch(err){
    console.error('premium email cron failed',String(err?.code||err?.name||'UNKNOWN').slice(0,36));
    res.statusCode=503;return res.end(JSON.stringify({error:'Não foi possível processar a rotina'}));
  }
}
