import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const root=resolve('.');
const mime={'.js':'application/javascript','.css':'text/css','.html':'text/html','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.json':'application/json','.txt':'text/plain'};
const server=createServer(async(req,res)=>{
 const u=new URL(req.url,'http://127.0.0.1');
 if(u.pathname.startsWith('/api/')){
   const body=u.pathname==='/api/auth'?{authenticated:true,user:{id:'universal-reader-audit',name:'Aluno de teste',role:'aluno'}}:{ok:true};
   res.writeHead(200,{'Content-Type':'application/json'});res.end(JSON.stringify(body));return;
 }
 const p=resolve(root,'.'+decodeURIComponent(u.pathname==='/'?'/central-v119.html':u.pathname));
 if(!p.startsWith(root+'/')){res.writeHead(403);res.end();return}
 try{res.writeHead(200,{'Content-Type':mime[extname(p)]||'application/octet-stream'});res.end(await readFile(p))}
 catch(e){res.writeHead(404);res.end('not found')}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const base='http://127.0.0.1:'+server.address().port,rows=[];
let browser;
try{
 browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 for(const vp of [{name:'celular',width:390,height:844},{name:'tablet',width:768,height:1024},{name:'computador',width:1366,height:768}]){
  const context=await browser.newContext({viewport:{width:vp.width,height:vp.height},serviceWorkers:'block'});
  const page=await context.newPage();const assetErrors=[],events=[];page.on('pageerror',e=>events.push('pageerror:'+e.message.slice(0,130)));page.on('console',e=>{if(e.type()==='error')events.push('console:'+e.text().slice(0,120))});
  page.on('response',r=>{if(r.status()===404&&/universal-reader-v1/.test(r.url()))assetErrors.push(r.url())});
  try {
   const response=await page.goto(base+'/central-v119.html',{waitUntil:'domcontentloaded',timeout:35000});
   await page.waitForFunction(()=>!!window.CentralUniversalReader,null,{timeout:12500});
   const result=await page.evaluate(()=>({
     reader:typeof window.CentralUniversalReader?.scan==='function',
     css:[...document.styleSheets].some(s=>s.href?.includes('universal-reader-v1.css')),
     app:!!document.querySelector('#subjects'),
     bootPending:document.documentElement.classList.contains('central-boot-pending'),
     hasAdmIndex:!!window.ADM_NATIVE_INDEX,
     overflow:document.documentElement.scrollWidth>innerWidth+2
   }));
   rows.push({viewport:vp.name,http:response?.status(),...result,missingAssets:assetErrors,
     pass:response?.status()===200&&result.reader&&result.css&&result.app&&assetErrors.length===0});
   if(vp.name==='computador'){
    try{
      await page.evaluate(async()=>{
        if(window.CentralDisciplineLoader?.load) await window.CentralDisciplineLoader.load('adm');
        else if(window.loadCentralTheoryGroup) await window.loadCentralTheoryGroup('adm');
      });
      await page.waitForTimeout(350);
      const adm=await page.evaluate(()=>{
        const uids=Object.keys(window.ADM_NATIVE_INDEX?.modules||{});
        const problems=[];
        const stages=[];
        for(const uid of uids) {
          try{
            const entry=typeof window.topicByUid==='function'?window.topicByUid(uid):null;
            const html=entry && typeof window.renderDetail==='function'?window.renderDetail(entry.s,entry.t,entry.r||{}):'';
            stages.push({uid,htmlLength:String(html||'').length,legacyLength:String(window.ADM_NATIVE_LEGACY?.[uid]||'').length,visualCards:(String(html||'').match(/<article class="adm-cf-card\b/g)||[]).length});
          }catch(e){problems.push({uid,error:e.message})}
        }
        return {indexCount:uids.length,legacyAvailable:stages.filter(x=>x.legacyLength>0).length,
          stageCount:stages.filter(x=>x.htmlLength>0).length,threeCards:stages.filter(x=>x.visualCards===3).length,problems:problems.slice(0,6),samples:stages.slice(0,2)};
      });
      console.log('ADM_RUNTIME',JSON.stringify(adm));
      assert.equal(adm.indexCount,20);
      assert.equal(adm.legacyAvailable,20);
      assert.equal(adm.threeCards,20,'todos os módulos ADM devem apresentar os três cards aprovados');
      const attempts=await page.evaluate(async()=>{
        const items=Object.keys(window.ADM_NATIVE_INDEX.modules),checks=[];
        for(const uid of items){
          for(const kind of ['summary','complete']){
            try{
              await window.AdmNative.open(uid,kind,false);
              const node=document.querySelector('#adm-native-reader .bc-native-article');
              checks.push({uid,kind,characters:node?.textContent?.length||0,
                headings:node?.querySelectorAll('h1,h2,h3').length||0,
                success:Boolean(node && node.textContent.length>250)});
            }catch(e){checks.push({uid,kind,success:false,error:e.message.slice(0,100)})}
            window.AdmNative.close();
          }
        }
        return checks;
      });
      console.log('ADM_OPEN',JSON.stringify({total:attempts.length,passed:attempts.filter(x=>x.success).length,
        failed:attempts.filter(x=>!x.success).slice(0,8)}));
      assert.equal(attempts.length,40,'20 módulos administrativos devem abrir em dois modos');
      assert.equal(attempts.filter(x=>x.success).length,40,'todas as teorias administrativas devem abrir');

      const editorial=await page.evaluate(()=>{
        const box=document.createElement('div');
        box.className='bc-native-reader-overlay';
        box.innerHTML='<article class="bc-native-article">'+
          '<p id="bc-editorial-paragraph">Os requisitos legais devem ser analisados\\nconjuntamente antes de concluir o caso.</p>'+
          '<table id="bc-editorial-test-table"><thead><tr><th>Regra</th><th>Exceção</th></tr></thead>'+
          '<tbody><tr><td>Regra geral prevista em lei</td><td>Hipótese prevista na norma.</td></tr></tbody></table>'+
          '<pre id="bc-editorial-test-raw"></pre><pre id="bc-editorial-test-prose"></pre></article>';
        document.body.appendChild(box);
        const raw=box.querySelector('#bc-editorial-test-raw');
        const prose=box.querySelector('#bc-editorial-test-prose');
        raw.textContent=Array.from({length:14},(_,i)=>
          'Item '+i+' | Regra aplicável em cada hipótese | Efeito jurídico da ocorrência').join(String.fromCharCode(10));
        prose.textContent=Array.from({length:14},(_,i)=>
          'O conteúdo do parágrafo '+i+' demonstra que o leitor deve respeitar o texto integral.').join(String.fromCharCode(10));
        window.CentralUniversalReader.scan(box);
        const p=box.querySelector('#bc-editorial-paragraph');
        const table=box.querySelector('#bc-editorial-test-table');
        const projection=box.querySelector('.bc-universal-projection');
        const result={css:!![...document.styleSheets].find(x=>x.href?.includes('editorial-juridico-legibilidade-v1.css')),
          aligned:getComputedStyle(p).textAlign,paragraphWhitespace:getComputedStyle(p).whiteSpace,
          rawPreserved:raw.dataset.bcUniversalDone==='table-preserved'&&!raw.hidden,
          rawWhitespace:getComputedStyle(raw).whiteSpace,sourceText:raw.textContent.includes('Efeito jurídico'),
          tableScrollable:table.parentElement.classList.contains('bc-editorial-table-scroll'),
          tableDisplay:getComputedStyle(table).display,tableSemantics:table.rows.length===2,
          proseProjected:!!projection,projectionWhitespace:projection?getComputedStyle(projection.querySelector('p')).whiteSpace:null};
        box.remove();return result;
      });
      console.log('EDITORIAL_READABILITY',JSON.stringify(editorial));
      assert.ok(editorial.css&&editorial.tableScrollable&&editorial.tableSemantics,'tabelas devem preservar linhas e rolagem');
      assert.equal(editorial.tableDisplay,'table','tabelas devem preservar células e colunas reais');
      assert.equal(editorial.aligned,'justify','texto do leitor deve ser justificado');
      assert.equal(editorial.paragraphWhitespace,'normal','não preservar quebra manual dentro de frases');
      assert.ok(editorial.rawPreserved&&editorial.sourceText&&editorial.rawWhitespace==='pre','quadros de texto tabular devem manter colunas');
      assert.ok(editorial.proseProjected&&editorial.projectionWhitespace==='normal','parágrafos importados devem fluir sem quebra artificial');
      const otherLayouts=await page.evaluate(async()=>{
        const ids=['cf','civil','cpp','penal','cpc'],out=[];
        for(const id of ids){
          localStorage.setItem('central-v6:open:'+id,'1');
          let error=null;
          try{await window.CentralDisciplineLoader.load(id)}catch(e){error=e.message}
          try{window.renderAll?.()}catch(_){}
          if(['penal','cpc'].includes(id)){
            const m=document.querySelector('.subject[data-id="'+id+'"] .cf-module');
            if(m&&!m.classList.contains('open'))m.querySelector('.cf-module-head')?.click();
          }
          await new Promise(resolve=>setTimeout(resolve,240));
          const root=document.querySelector('.subject[data-id="'+id+'"]');
          const body=root?.querySelector('.subject-body');
          const modules=body?.querySelectorAll('.cf-module,.cv-module,[data-cpp-native-module]')||[];
          out.push({id,error,ready:window.CentralDisciplineLoader?.isReady(id),
            modules:modules.length,htmlLength:body?.innerHTML?.length||0,
            flags:{cf:!!window.CfNativeStudy,civil:!!window.CivilNative,cpp:!!window.CppNative,
              penal:!!window.__centralCurrentPenal,cpc:!!window.CpcStudyV1?.installed},
            cards:{cf:body?.querySelectorAll('.cf-study-card').length||0,
              civil:body?.querySelectorAll('.cv-standard-card').length||0,
              cpp:body?.querySelectorAll('.adm-native-card').length||0,
              penal:body?.querySelectorAll('.bc-native-material-card').length||0,
              cpc:body?.querySelectorAll('.cpc-approved-card').length||0},
            penalApproved:body?.querySelectorAll('.penal-approved-card').length||0,
            unifiedCss:!!document.querySelector('link[href*="premium-juridico-unificado-v1.css"]')&&
              [...document.styleSheets].some(x=>x.href?.includes('premium-juridico-unificado-v1.css')),
            cppColumns:id==='cpp'?getComputedStyle(body.querySelector('.adm-native-material-grid')).gridTemplateColumns:null,
            sample:body?.textContent?.replace(/\\s+/g,' ').slice(0,200)});
        }
        return out;
      });
      console.log('OTHER_LAYOUTS',JSON.stringify(otherLayouts));
      assert.ok(otherLayouts.every(x=>x.ready&&!x.error),'todas as disciplinas devem carregar sem erro');
      assert.ok(otherLayouts.every(x=>x.unifiedCss),'CSS Premium deve estar ativo nas cinco disciplinas');
      for(const [id,n] of Object.entries({cf:15,civil:15,cpp:22,penal:17,cpc:20})){
        const row=otherLayouts.find(x=>x.id===id);
        assert.equal(row?.modules,n,id+' deve apresentar todos os módulos');
        if(id==='cf')assert.ok(row.cards.cf>=45,'Constitucional requer três cards por módulo');
        if(id==='civil')assert.equal(row.cards.civil,45,'Civil requer os 45 cards');
        if(id==='cpp')assert.equal(row.cards.cpp,66,'Processo Penal requer os 66 cards');
        if(id==='penal')assert.ok(row.cards.penal+row.penalApproved>=49,'Penal requer os cards nativos');
        if(id==='cpc')assert.equal(row.cards.cpc,3,'CPC requer três cards no módulo aberto');
      }
      const cpp=otherLayouts.find(x=>x.id==='cpp');
      assert.ok(cpp.cppColumns.startsWith('minmax(')&&cpp.cppColumns.endsWith('1fr)'), 'Processo Penal precisa de uma coluna de cards');


    }catch(e){console.log('ADM_RUNTIME_BLOCKER',e.message.slice(0,300));throw e}
   }
  }catch(e){const debug=await page.evaluate(()=>({url:location.href,ready:document.readyState,title:document.title,status:document.querySelector('#status')?.textContent,body:document.body?.textContent?.slice(0,280),hasIndex:!!document.querySelector('#subjects'),hasAsset:!!document.querySelector('script[src*=universal-reader]')})).catch(x=>({evalError:x.message}));rows.push({viewport:vp.name,pass:false,error:e.message.slice(0,300),debug,events:events.slice(-8),missingAssets:assetErrors})}
  await context.close();
 }
}finally{await browser?.close();await new Promise(r=>server.close(r))}
console.log('CENTRAL_BROWSER',JSON.stringify(rows));
assert.ok(rows.every(x=>x.pass),'Universal assets must be active in real Central bootstrap');
