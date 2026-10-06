import { requireSession } from '../lib/auth.js';

function send(res,status,body){
  res.statusCode=status;
  res.setHeader('Content-Type','application/json; charset=utf-8');
  res.setHeader('Cache-Control','no-store');
  res.end(JSON.stringify(body));
}

async function ensureTables(sql){
  await sql`
    CREATE TABLE IF NOT EXISTS central_user_sync_state (
      user_id TEXT PRIMARY KEY REFERENCES central_users(user_id) ON DELETE CASCADE,
      revision BIGINT NOT NULL DEFAULT 0,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      device_id TEXT,
      content_hash TEXT,
      payload JSONB NOT NULL DEFAULT '{}'::jsonb,
      payload_bytes INTEGER NOT NULL DEFAULT 0
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS central_user_progress_summary (
      user_id TEXT PRIMARY KEY REFERENCES central_users(user_id) ON DELETE CASCADE,
      overall_pct INTEGER NOT NULL DEFAULT 0,
      questions BIGINT NOT NULL DEFAULT 0,
      study_seconds BIGINT NOT NULL DEFAULT 0,
      last_study TIMESTAMPTZ,
      disciplines JSONB NOT NULL DEFAULT '[]'::jsonb,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}

export default async function handler(req,res){
  const session=await requireSession(req,['admin']);
  if(!session.ok)return send(res,session.status,{error:session.error});
  if(req.method!=='GET'){
    res.setHeader('Allow','GET');
    return send(res,405,{error:'Método não permitido'});
  }

  try{
    const sql=session.sql;
    await ensureTables(sql);
    const rows=await sql`
      SELECT
        u.user_id,u.name,u.email,u.role,u.active,u.created_at,u.updated_at,u.last_login,
        s.revision AS sync_revision,s.updated_at AS last_sync,s.payload_bytes,
        p.overall_pct,p.questions,p.study_seconds,p.last_study,p.disciplines,p.updated_at AS progress_updated_at
      FROM central_users u
      LEFT JOIN central_user_sync_state s ON s.user_id=u.user_id
      LEFT JOIN central_user_progress_summary p ON p.user_id=u.user_id
      ORDER BY CASE u.role WHEN 'admin' THEN 1 WHEN 'editor' THEN 2 ELSE 3 END,u.name ASC
    `;

    const users=rows.map((row)=>({
      id:String(row.user_id),
      name:String(row.name||''),
      email:String(row.email||''),
      role:String(row.role||'aluno'),
      active:row.active!==false,
      createdAt:row.created_at||null,
      lastLogin:row.last_login||null,
      sync:{
        revision:Number(row.sync_revision||0),
        lastSync:row.last_sync||null,
        bytes:Number(row.payload_bytes||0),
        hasData:Number(row.sync_revision||0)>0
      },
      progress:{
        overallPct:Number(row.overall_pct||0),
        questions:Number(row.questions||0),
        studySeconds:Number(row.study_seconds||0),
        lastStudy:row.last_study||null,
        updatedAt:row.progress_updated_at||null,
        disciplines:Array.isArray(row.disciplines)?row.disciplines:[]
      }
    }));

    return send(res,200,{
      summary:{
        total:users.length,
        active:users.filter((u)=>u.active).length,
        admins:users.filter((u)=>u.role==='admin').length,
        editors:users.filter((u)=>u.role==='editor').length,
        students:users.filter((u)=>u.role==='aluno').length,
        synced:users.filter((u)=>u.sync.hasData).length,
        studying:users.filter((u)=>u.progress.lastStudy).length
      },
      users
    });
  }catch(error){
    console.error('admin dashboard error',error);
    return send(res,500,{error:error?.message||'Falha ao carregar o painel administrativo'});
  }
}
