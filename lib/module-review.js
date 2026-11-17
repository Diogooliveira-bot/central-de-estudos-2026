/* Revisão editorial dos módulos — registro por conta administrativa e eventos imutáveis. */
export const REVIEW_KEY=/^(?:cf|adm|civil|cpc|cpp|penal|rlm|info|pt):(?:0[1-9]|[1-9][0-9])$/;
export function normalizeReviewKey(input){
  const key=String(input||'').trim().toLowerCase();
  return REVIEW_KEY.test(key)?key:'';
}
export function keyFromLabel(label){
  const parts=String(label||'').split('|');
  if(parts.length<3)return '';
  const title=String(parts[parts.length-2]||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
  const sub=String(parts[parts.length-1]||'');
  const match=/(?:m[oó]dulo|module|\bm)\s*[-#]?\s*0*(\d{1,2})(?!\d)/i.exec(sub);
  if(!match)return '';
  const aliases={
    'direito constitucional':'cf','constitucional':'cf',
    'direito administrativo':'adm','administrativo':'adm',
    'direito civil':'civil','civil':'civil',
    'direito processual civil':'cpc','processo civil':'cpc','processual civil':'cpc',
    'direito processual penal':'cpp','processo penal':'cpp','processual penal':'cpp',
    'direito penal':'penal','penal':'penal',
    'raciocinio logico matematico':'rlm','raciocinio logico':'rlm','rlm':'rlm',
    'informatica':'info','portugues':'pt'
  };
  const subject=aliases[title];
  return normalizeReviewKey(subject+':'+String(Number(match[1])).padStart(2,'0'));
}
export async function ensureReviewTables(sql){
  await sql`
    CREATE TABLE IF NOT EXISTS central_module_review_status (
      module_key TEXT PRIMARY KEY,
      reviewed BOOLEAN NOT NULL DEFAULT FALSE,
      reviewed_by TEXT,
      reviewed_by_name TEXT,
      reviewed_at TIMESTAMPTZ,
      last_edit_by TEXT,
      last_edit_by_name TEXT,
      last_edit_at TIMESTAMPTZ,
      last_content_id TEXT,
      last_revision BIGINT,
      version BIGINT NOT NULL DEFAULT 0,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS central_module_review_events (
      event_id BIGSERIAL PRIMARY KEY,
      module_key TEXT NOT NULL,
      content_id TEXT,
      revision BIGINT,
      action TEXT NOT NULL CHECK(action IN ('publish','restore','review','reopen')),
      actor_id TEXT NOT NULL,
      actor_name TEXT NOT NULL,
      at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS central_module_review_events_recent ON central_module_review_events(at DESC,event_id DESC)`;
}
export function statusView(row,key){
  if(!row)return {key,reviewed:false,version:0,reviewedBy:null,reviewedAt:null,lastEditedBy:null,lastEditedAt:null,lastRevision:null};
  return {
    key:row.module_key,reviewed:row.reviewed===true,version:Number(row.version||0),
    reviewedBy:row.reviewed_by_name||null,reviewedAt:row.reviewed_at||null,
    lastEditedBy:row.last_edit_by_name||null,lastEditedAt:row.last_edit_at||null,
    lastRevision:row.last_revision==null?null:Number(row.last_revision)
  };
}
