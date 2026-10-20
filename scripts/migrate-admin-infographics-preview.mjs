import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { neon } from '@neondatabase/serverless';

export function shouldRunInfographicMigration(env=process.env){
  return env.VERCEL_ENV==='preview' &&
    env.VERCEL_GIT_COMMIT_REF==='integration/objetivos-prod-20261020';
}

function fromGitBlobSha(bytes){
  return createHash('sha1').update(Buffer.from(`blob ${bytes.length}\0`)).update(bytes).digest('hex');
}
async function run(){
  if(!shouldRunInfographicMigration())return;
  if(process.env.VERCEL_GIT_REPO_OWNER!=='Diogooliveira-bot'||process.env.VERCEL_GIT_REPO_SLUG!=='central-de-estudos-2026'){
    throw new Error('Infographic migration stopped: Preview source repository is not the approved repository');
  }
  const manifest=JSON.parse(await readFile(new URL('../content/admin-infographics-manifest.json',import.meta.url),'utf8'));
  if(!process.env.DATABASE_URL)throw new Error('Preview infographics migration requires DATABASE_URL');
  const sql=neon(process.env.DATABASE_URL);
  const identity=(await sql`SELECT current_setting('neon.project_id',true) AS project_id,current_setting('neon.branch_id',true) AS branch_id,current_database() AS database_name`)[0]||{};
  if(identity.project_id!==manifest.expectedNeonProject||identity.branch_id!==manifest.expectedNeonBranch||identity.database_name!==manifest.database){
    throw new Error('Infographic migration stopped: connected database is not the isolated homologation branch');
  }
  await sql`CREATE TABLE IF NOT EXISTS public.central_private_infographics(
    path text PRIMARY KEY,
    content_type text NOT NULL,
    content bytea NOT NULL,
    source_sha text NOT NULL,
    byte_length integer NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
  )`;
  const existingRows=await sql`SELECT path,source_sha,byte_length FROM public.central_private_infographics`;
  const existing=new Map(existingRows.map(row=>[row.path,row]));
  let migrated=0,skipped=0;
  for(const asset of manifest.assets){
    const cached=existing.get(asset.path);
    if(cached&&cached.source_sha===asset.gitBlobSha&&Number(cached.byte_length)===asset.size){skipped++;continue}
    const url=`https://raw.githubusercontent.com/Diogooliveira-bot/central-de-estudos-2026/${manifest.sourceCommit}/${asset.path.split('/').map(encodeURIComponent).join('/')}`;
    const response=await fetch(url,{cache:'no-store',redirect:'error'});
    if(!response.ok)throw new Error(`Infographic source fetch failed for ${asset.path}: HTTP ${response.status}`);
    const bytes=Buffer.from(await response.arrayBuffer());
    if(bytes.length!==asset.size||fromGitBlobSha(bytes)!==asset.gitBlobSha)throw new Error(`Infographic source integrity check failed for ${asset.path}`);
    const chunkBytes=90_000;
    for(let offset=0,part=0;offset<bytes.length;offset+=chunkBytes,part++){
      const chunk=bytes.subarray(offset,Math.min(offset+chunkBytes,bytes.length));
      const base64=chunk.toString('base64');
      if(part===0){
        await sql`INSERT INTO public.central_private_infographics(path,content_type,content,source_sha,byte_length)
          VALUES(${asset.path},${asset.contentType},decode(${base64},'base64'),${asset.gitBlobSha},${chunk.length})
          ON CONFLICT(path) DO UPDATE SET content=EXCLUDED.content,content_type=EXCLUDED.content_type,source_sha=EXCLUDED.source_sha,byte_length=EXCLUDED.byte_length`;
      }else{
        await sql`INSERT INTO public.central_private_infographics(path,content_type,content,source_sha,byte_length)
          VALUES(${asset.path},${asset.contentType},decode(${base64},'base64'),${asset.gitBlobSha},${chunk.length})
          ON CONFLICT(path) DO UPDATE SET content=public.central_private_infographics.content||EXCLUDED.content,content_type=EXCLUDED.content_type,source_sha=EXCLUDED.source_sha,byte_length=public.central_private_infographics.byte_length+EXCLUDED.byte_length`;
      }
    }
    migrated++;
  }
  const stored=await sql`SELECT path,source_sha,byte_length,octet_length(content) AS stored_bytes FROM public.central_private_infographics`;
  const byPath=new Map(stored.map(row=>[row.path,row]));
  const invalid=manifest.assets.filter(asset=>{
    const row=byPath.get(asset.path);
    return !row||row.source_sha!==asset.gitBlobSha||Number(row.byte_length)!==asset.size||Number(row.stored_bytes)!==asset.size;
  });
  if(invalid.length)throw new Error(`Infographic migration verification failed for ${invalid.length} file(s)`);
  console.log(JSON.stringify({infographicMigration:'verified',assetCount:manifest.assets.length,migrated,alreadyPresent:skipped,totalBytes:manifest.assets.reduce((sum,asset)=>sum+asset.size,0)}));
}
run().catch(error=>{console.error(error.message);process.exitCode=1});
