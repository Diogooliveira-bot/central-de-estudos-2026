// Temporary localhost runner for real-browser homologation when the protected
// Vercel Preview cannot be opened by automation. Never bind to a public IP.
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import handleAuth from '../api/auth.js';
import handleObjective from '../api/objective.js';

const db=new URL(process.env.PR398_TEST_DATABASE_URL||'postgresql://invalid/invalid');
assert.equal(db.hostname,'ep-withered-shadow-b80dbzj9-pooler.c-14.us-east-1.aws.neon.tech');
assert.equal(db.pathname,'/pr398_concursos_ficticios');
process.env.DATABASE_URL=db.href;
process.env.AUTH_SECRET=crypto.randomBytes(48).toString('hex');
process.env.VERCEL_ENV='preview';
process.env.VERCEL_GIT_COMMIT_REF='codex/concursos-compartilhados-prf-2021';
process.env.BC_PREVIEW_NEON_GUARD='YES';
process.env.BC_PREVIEW_NEON_EXPECTED_HOST=db.hostname;
process.env.CONTESTS_PREVIEW_DB_ISOLATED='true';
process.env.EXAM_PROGRESS_PREVIEW_DB_ISOLATED='true';
const publicRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../dist');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.css':'text/css; charset=utf-8','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2','.pdf':'application/pdf','.txt':'text/plain; charset=utf-8'};
const port=Number(process.env.PR398_TEST_PORT||8765);
assert.ok(Number.isInteger(port)&&port>=1024&&port<=65535);

http.createServer(async(req,res)=>{
  try {
    const url=new URL(req.url,`http://127.0.0.1:${port}`);
    req.query=Object.fromEntries(url.searchParams);
    if(url.pathname==='/api/concursos') {req.query.resource='concursos';return await handleObjective(req,res);}
    if(url.pathname==='/api/objective')return await handleObjective(req,res);
    if(url.pathname==='/api/auth')return await handleAuth(req,res);
    if(url.pathname==='/api/plans') {req.query.bc_api='plans';return await handleAuth(req,res);}
    const requested=url.pathname==='/'?'/central-v119.html':decodeURIComponent(url.pathname);
    const file=path.resolve(publicRoot,'.'+requested);
    if(!file.startsWith(publicRoot+path.sep)) {res.writeHead(403);return res.end();}
    const metadata=await stat(file).catch(()=>null);
    if(!metadata?.isFile()) {res.writeHead(404);return res.end('Arquivo não encontrado');}
    res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'public, max-age=60'});
    res.end(await readFile(file));
  } catch(error) {
    console.error('Homologação local:',error.message);
    if(!res.headersSent)res.writeHead(500,{'Content-Type':'text/plain'});
    res.end('Erro no servidor de homologação');
  }
}).listen(port,'127.0.0.1',()=>console.log(`Homologação local pronta em 127.0.0.1:${port}`));
