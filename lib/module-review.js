/* Revisão editorial dos módulos — registro por conta administrativa e eventos imutáveis. */
export const REVIEW_KEY=/^(?:cf|adm|civil|cpc|cpp|penal|rlm|info|pt):(?:0[1-9]|[1-9][0-9])$/;
export function normalizeReviewKey(input){
  const key=String(input||'').trim().toLowerCase();
  return REVIEW_KEY.test(key)?key:'';
}
export function keyFromLabel(label){
  const parts=String(label||'').split('|');
  if(parts.length<2)return '';
  const normalized=parts.slice(-2).join(' ').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const named=[
    ['cpp',/(?:direito )?processual penal|processo penal/],
    ['cpc',/(?:direito )?processual civil|processo civil/],
    ['cf',/direito constitucional|\bconstitucional\b/],
    ['adm',/direito administrativo|\badministrativo\b/],
    ['penal',/direito penal|\bpenal\b/],
    ['civil',/direito civil|\bcivil\b/],
    ['rlm',/raciocinio logico|\brlm\b/],
    ['info',/informatica/],
    ['pt',/portugues/]
  ];
  let subject=named.find(([_,rx])=>rx.test(normalized))?.[0]||'';
  let number=/(?:modulo|module|\bm)\s*[-#:]?\s*0*(\d{1,2})(?!\d)/.exec(normalized)?.[1];
  // Alguns leitores identificam o módulo somente por siglas: PEN M01, RLM M03, CF M07.
  const prefixed=/(?:^|[\s|/])(?:cf|adm|pen|penal|cpc|cpp|civ|civil|pt|rlm|info|inf)\s*(?:m|modulo)?\s*0*(\d{1,2})(?!\d)/.exec(normalized);
  if(prefixed){
    const prefix=/(?:^|[\s|/])(cf|adm|pen|penal|cpc|cpp|civ|civil|pt|rlm|info|inf)\s*(?:m|modulo)?\s*0*\d{1,2}/.exec(normalized)?.[1];
    const aliases={cf:'cf',adm:'adm',pen:'penal',penal:'penal',cpc:'cpc',cpp:'cpp',civ:'civil',civil:'civil',pt:'pt',rlm:'rlm',info:'info',inf:'info'};
    subject=aliases[prefix]||subject;
    number=prefixed[1]||number;
  }
  return subject&&number?normalizeReviewKey(subject+':'+String(Number(number)).padStart(2,'0')):'';
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
