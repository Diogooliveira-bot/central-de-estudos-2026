import {requireSession} from './auth.js';

function send(res,status,data){
  res.statusCode=status;
  res.setHeader('Content-Type','application/json; charset=utf-8');
  res.setHeader('Cache-Control','private, no-store');
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('Referrer-Policy','no-referrer');
  res.end(JSON.stringify(data));
}

// Visibilidade dos cadastros do site comercial: apenas administradores.
// Nunca retorna hash de senha, hash do token, IP nem consentimentos pessoais.
export default async function handler(req,res){
  try{
    if(req.method!=='GET'){
      res.setHeader('Allow','GET');
      return send(res,405,{error:'Método não permitido'});
    }
    const session=await requireSession(req,['admin']);
    if(!session.ok)return send(res,session.status,{error:session.error});
    const sql=session.sql;
    const [pending,confirmed]=await Promise.all([
      sql`
        SELECT name,email,created_at,expires_at
        FROM public.central_free_signup_pending
        ORDER BY created_at DESC LIMIT 100
      `,
      sql`
        SELECT u.name,u.email,u.active,l.terms_version,l.recorded_at
        FROM public.central_free_signup_legal_acceptances l
        JOIN public.central_users u ON u.user_id=l.user_id
        WHERE u.role='aluno'
        ORDER BY l.recorded_at DESC LIMIT 100
      `,
    ]);
    return send(res,200,{
      pending:pending.map(row=>({
        name:row.name,email:row.email,
        createdAt:row.created_at,expiresAt:row.expires_at,
      })),
      confirmed:confirmed.map(row=>({
        name:row.name,email:row.email,active:row.active,
        termsVersion:row.terms_version,confirmedAt:row.recorded_at,
      })),
    });
  }catch(error){
    console.error('admin public signups error',String(error?.code||error?.name||'UNKNOWN').slice(0,24));
    return send(res,503,{error:'Não foi possível consultar os cadastros públicos'});
  }
}
