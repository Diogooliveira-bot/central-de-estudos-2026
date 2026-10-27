import { database } from '../lib/db.js';

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return send(res, 405, { error: 'method_not_allowed' });

  try {
    const raw = String(process.env.DATABASE_URL || '');
    const parsed = new URL(raw);
    const host = parsed.hostname;
    const endpoint = host.split('.')[0].replace(/-pooler$/, '');
    const sql = database();
    const rows = await sql`SELECT current_database() AS database_name, NOW() AS checked_at`;

    return send(res, 200, {
      vercelEnvironment: process.env.VERCEL_ENV || null,
      gitBranch: process.env.VERCEL_GIT_COMMIT_REF || null,
      database: rows[0]?.database_name || parsed.pathname.replace(/^\//, ''),
      endpoint,
      pooled: host.includes('-pooler'),
      expectedHomologationEndpoint: endpoint === 'ep-late-haze-b8j5xjdh',
      productionEndpointBlocked: endpoint !== 'ep-wild-math-awuoq9pk',
      authSecretConfigured: Boolean(process.env.AUTH_SECRET),
      backupSecretConfigured: Boolean(process.env.BACKUP_SECRET),
      hotmartLiveEnabled: String(process.env.HOTMART_LIVE_ENABLED || '').toLowerCase() === 'true',
      hotmartTestReceiverEnabled: String(process.env.HOTMART_TEST_RECEIVER_ENABLED || '').toLowerCase() === 'true',
      gmailConfigured: Boolean(process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_USER),
      checkedAt: rows[0]?.checked_at || null
    });
  } catch {
    return send(res, 500, { error: 'environment_proof_failed' });
  }
}
