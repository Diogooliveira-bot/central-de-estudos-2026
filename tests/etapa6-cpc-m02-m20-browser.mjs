/* Etapa 6 — Direito Processual Civil M02–M20 no leitor original.
 * Chromium local, sem sessão autenticada ou contato com Production/Neon.
 * Validação técnica não equivale a revisão jurídica e editorial.
 */
import assert from 'node:assert/strict';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { chromium } from 'playwright';
const read=p=>readFile(new URL('../'+p,import.meta.url),'utf8');
const ids=Array.from({length:19},(_,i)=>i+2);
const two=n=>String(n).padStart(2,'0');
const [baseCss, premiumCss, readingCss, readingJs, themeActivator,...sources]=await Promise.all([
 read('ui/native-study-reader.css'),read('ui/legal-complete-premium-v1.css'),
 read('ui/reading-appearance-v1.css'),read('ui/reading-appearance-v1.js'),
 read('ui/legal-complete-premium-v1.js'),
 ...ids.flatMap(n=>[
  read('content/cpc/m'+two(n)+'-native-data.js'),
  read('ui/cpc-m'+two(n)+'-native-study-reader.js')
 ])
]);
const byNumber=new Map(ids.map((n,i)=>[n,{data:sources[i*2],reader:sources[i*2+1]}]));
await mkdir('artifacts/etapa6-cpc-m02-m20',{recursive:true});
const server=createServer((_req,res)=>{
 res.writeHead(200,{'content-type':'text/html; charset=utf-8'});
 res.end('<!doctype html><html lang="pt-BR" class="bc-ui-v1" data-bc-reading-mode="paper"><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><main id="subjects"></main></body></html>');
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
let browser;
const result=[];
try{
 browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 for(const width of [390,768,1366]){
  const height=width===390?844:width===768?1024:768;
  for(const n of ids){
   const label='CPC M'+two(n),id='cpcM'+two(n)+'NativeReaderOverlay',api='CpcM'+two(n)+'NativeReader';
   const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
   const errors=[]; page.on('pageerror',e=>errors.push(e.message));
   try{
    await page.goto('http://127.0.0.1:'+server.address().port);
    for(const css of [baseCss,premiumCss,readingCss])await page.addStyleTag({content:css});
    for(const script of [readingJs,themeActivator,byNumber.get(n).data,byNumber.get(n).reader])await page.addScriptTag({content:script});
    const source=await page.evaluate(n=>{
      const o=window.BASE_NATIVE_CONTENT?.cpc?.['m'+String(n).padStart(2,'0')];
      return {loaded:!!o,title:o?.title||'',completeChars:String(o?.complete||'').length,summaryChars:String(o?.summary||'').length,chapters:o?.chapters?.complete?.length||0};
    },n);
    assert.equal(source.loaded,true,label+': falta arquivo de dados');
    assert.ok(source.completeChars>450,label+': teoria completa ausente/curta');
    assert.ok(source.summaryChars>100,label+': teoria resumida ausente');
    assert.equal(await page.evaluate(a=>typeof window[a],api),'object',label+': leitor não inicializado');
    await page.evaluate(a=>window[a].open('complete'),api);
    await page.waitForFunction(id=>document.getElementById(id)?.classList.contains('bc-apostila-v1'),id,{timeout:8000});
    await page.waitForTimeout(80);
    const m=await page.evaluate(id=>{
      const o=document.getElementById(id),a=o.querySelector('.bc-native-article');
      const h2=a?.querySelector('h2'),tables=[...a.querySelectorAll('table')];
      const headers=[...a.querySelectorAll('h2,h3')].map(h=>h.textContent.trim()).filter(Boolean);
      return {
       premium:o.classList.contains('bc-apostila-v1'),
       appearance:o.classList.contains('bc-reading-appearance'),
       rawTitle:o.querySelector('.bc-native-reader-title b')?.textContent.trim(),
       backLabel:o.querySelector('[data-cpc-back]')?.textContent.trim(),
       textChars:a?.textContent.trim().length||0,
       h2Count:a.querySelectorAll('h2').length,
       h3Count:a.querySelectorAll('h3').length,
       h2Border:h2?getComputedStyle(h2).borderLeftWidth:null,
       tables:tables.length,
       tablesSemantic:tables.every(t=>t.rows.length>0),
       tableWrappers:a.querySelectorAll('.adm-table-scroll,.bc-native-table-scroll,.bc-editor-table-wrap').length,
       callouts:a.querySelectorAll('.bc-native-callout').length,
       chapterChecks:o.querySelectorAll('[data-cpc-chapter-check]').length,
       headingSamples:headers.slice(0,5),
       noPageOverflow:document.documentElement.scrollWidth<=innerWidth+2,
       suspiciousMalformedNumbers:headers.filter(h=>/^[0-9]{2,4}[.][0-9A-Za-zÀ-ÿ]/.test(h)).slice(0,6)
      };
    },id);
    assert.ok(m.premium,label+': tema não ativou');
    assert.ok(m.appearance,label+': falta aparência de leitura');
    assert.ok(m.textChars>450,label+': leitor exibiu conteúdo insuficiente');
    assert.ok(m.h2Count>=1,label+': hierarquia H2 ausente');
    assert.equal(m.h2Border,'5px',label+': H2 não recebeu padrão Premium');
    assert.equal(m.tablesSemantic,true,label+': tabelas perderam estrutura');

    if([18,19,20].includes(n)){
      const proof=await page.evaluate(n=>{
        const o=document.getElementById('cpcM'+n+'NativeReaderOverlay');
        const wrap=o.querySelector('[data-cpc-editorial-pilot="m'+n+'"]');
        const table=wrap?.querySelector('table');
        if(!table)return {exists:false};
        const rows=[...table.tBodies[0].rows].map(r=>[...r.cells].map(c=>c.textContent.trim()));
        const full=window.BASE_NATIVE_CONTENT.cpc['m'+n].complete.replace(/\s+/g,' ');
        const delim=n===18?' = ':': ';
        return {
          exists:true,count:rows.length,cols:table.tHead.rows[0].cells.length,
          faithful:rows.every(row=>full.includes(row.join(delim))),
          semantic:table.caption!==null&&[...table.tBodies[0].rows].every(r=>r.cells[0].tagName==='TH'&&r.cells[0].scope==='row'),
          columns:[...table.tHead.rows[0].cells].every(c=>c.tagName==='TH'&&c.scope==='col'),
          scroll:wrap.scrollWidth>wrap.clientWidth,
          original:o.querySelector('.bc-native-article').textContent.includes({18:'29. QUADRO-MESTRE',19:'15. COISA JULGADA COLETIVA',20:'9. IAC X IRDR'}[n])
        };
      },n);
      assert.equal(proof.exists,true,label+': tabela não encontrada');
      assert.equal(proof.count,{18:4,19:3,20:2}[n],label+': linhas alteradas');
      assert.equal(proof.cols,2,label+': colunas alteradas');
      assert.equal(proof.faithful,true,label+': não corresponde ao original');
      assert.equal(proof.semantic,true,label+': falta semântica da tabela');
      assert.equal(proof.columns,true,label+': falta cabeçalho de coluna');
      assert.equal(proof.original,true,label+': título original ausente');
      if(width===390)assert.equal(proof.scroll,true,label+': scroll interno ausente');
    }


    if([15,16,17].includes(n)){
      const pilot=await page.evaluate(n=>{
        const o=document.getElementById('cpcM'+n+'NativeReaderOverlay');
        const wrap=o.querySelector('[data-cpc-editorial-pilot="m'+n+'"]');
        const t=wrap?.querySelector('table');
        if(!t)return {exists:false};
        const raw=window.BASE_NATIVE_CONTENT.cpc['m'+n].complete.replace(/\s+/g,' ').trim();
        const rows=[...t.tBodies[0].rows].map(row=>[...row.cells].map(c=>c.textContent.trim()));
        const proofs=n===15?rows.map(r=>r.join('→')):n===16?rows.map(r=>r.join(': ')):['Embargos = via ampla; pré-executividade = via estreita.'];
        return {
          exists:true,
          rows:rows.length,
          cols:t.tHead.rows[0].cells.length,
          verified:proofs.every(x=>raw.includes(x)),
          semanticRows:[...t.tBodies[0].rows].every(r=>r.cells[0].tagName==='TH'&&r.cells[0].scope==='row'),
          semanticHead:[...t.tHead.rows[0].cells].every(c=>c.tagName==='TH'&&c.scope==='col'),
          caption:!!t.caption?.textContent.trim(),
          localScroll:wrap.scrollWidth>wrap.clientWidth,
          originalPresent:o.querySelector('.bc-native-article').textContent.includes({15:'21. QUADRO DOS RECURSOS',16:'19. QUADRO COMPARATIVO DAS ESPÉCIES',17:'29. EMBARGOS X PRÉ-EXECUTIVIDADE'}[n]),
          back:o.querySelector('[data-cpc-back]')?.textContent.trim()
        };
      },n);
      assert.equal(pilot.exists,true,label+': quadro não apareceu');
      assert.equal(pilot.rows,{15:6,16:6,17:2}[n],label+': número de linhas');
      assert.equal(pilot.cols,2,label+': número de colunas');
      assert.equal(pilot.verified,true,label+': informações não localizadas literalmente na fonte');
      assert.equal(pilot.semanticRows,true,label+': cabeçalho de linha inválido');
      assert.equal(pilot.semanticHead,true,label+': cabeçalho de coluna inválido');
      assert.equal(pilot.caption,true,label+': legenda ausente');
      assert.equal(pilot.originalPresent,true,label+': corpo original ocultado');
      assert.equal(pilot.back,'← Voltar ao M'+n,label+': retorno não corresponde ao módulo');
      if(width===390)assert.equal(pilot.localScroll,true,label+': tabela não rola dentro do contêiner no celular');
    }


    // Etapa 9.5 — CPC M12–M14: verificações de tabela, fonte e resumos.
    if([12,13,14].includes(n)){
      const pilot=await page.evaluate(n=>{
        const overlay=document.getElementById('cpcM'+n+'NativeReaderOverlay');
        const wrap=overlay.querySelector('[data-cpc-editorial-pilot="m'+n+'"]');
        const table=wrap?.querySelector('table');
        if(!table)return {exists:false};
        const raw=window.BASE_NATIVE_CONTENT.cpc['m'+n].complete.replace(/\s+/g,' ').trim();
        const rows=[...table.tBodies[0].rows].map(tr=>[...tr.cells].map(cell=>cell.textContent.trim()));
        const evidence={
          12:['autor prova fato constitutivo; réu, fato impeditivo, modificativo ou extintivo.'],
          13:['Arbitramento: quando determinado pela sentença, convencionado ou exigido pela natureza do objeto.','Procedimento comum: quando necessário alegar/provar fato novo para quantificar.'],
          14:rows.map(row=>row.join(': '))
        }[n];
        return {
          exists:true,
          rows:rows.length,
          cols:table.tHead.rows[0].cells.length,
          sourceVerified:evidence.every(line=>raw.includes(line)),
          semantics:[...table.tBodies[0].rows].every(tr=>tr.cells[0].tagName==='TH'&&tr.cells[0].scope==='row'),
          caption:!!table.caption?.textContent?.trim(),
          localScroll:wrap.scrollWidth>wrap.clientWidth,
          originalHeadingVisible:overlay.querySelector('.bc-native-article').textContent.includes({12:'3. ÔNUS DA PROVA',13:'18. MODALIDADES DE LIQUIDAÇÃO',14:'19. QUADRO COMPARATIVO DOS RITOS'}[n]),
          back:overlay.querySelector('[data-cpc-back]')?.textContent.trim()
        };
      },n);
      assert.equal(pilot.exists,true,label+': quadro consultivo ausente');
      assert.equal(pilot.rows,{12:2,13:2,14:5}[n],label+': número de linhas não confere');
      assert.equal(pilot.cols,2,label+': número de colunas não confere');
      assert.equal(pilot.sourceVerified,true,label+': material original não comprova a tabela');
      assert.equal(pilot.semantics,true,label+': cabeçalhos de linhas não semânticos');
      assert.equal(pilot.caption,true,label+': legenda não exibida');
      assert.equal(pilot.originalHeadingVisible,true,label+': conteúdo original não visível');
      assert.equal(pilot.back,'← Voltar ao M'+n,label+': botão de retorno mudou');
      if(width===390)assert.equal(pilot.localScroll,true,label+': tabela sem rolagem local no celular');
    }


    // Etapa 9.4 — M09–M11: correspondência literal com a teoria original.
    if([9,10,11].includes(n)){
      const pilot=await page.evaluate(n=>{
        const o=document.getElementById('cpcM'+String(n).padStart(2,'0')+'NativeReaderOverlay');
        const wrap=o.querySelector('[data-cpc-editorial-pilot="m'+n+'"]');
        const table=wrap?.querySelector('table');
        if(!table)return {found:false};
        const raw=window.BASE_NATIVE_CONTENT.cpc['m'+String(n).padStart(2,'0')].complete.replace(/\s+/g,' ');
        const rows=[...table.tBodies[0].rows].map(r=>[...r.cells].map(c=>c.textContent.trim()));
        const originalContent=o.querySelector('.bc-native-article').textContent;
        const labels={9:'12. TUTELA DA EVIDÊNCIA — ART. 311',10:'9. INDEFERIMENTO X IMPROCEDÊNCIA LIMINAR',11:'13. JULGAMENTO CONFORME O ESTADO — ARTS. 354 A 356'};
        return {
          found:true,rows:rows.length,cols:table.tHead.rows[0].cells.length,
          sourceVerified:rows.every(row=>raw.includes(row[0]+': '+row[1])),
          semantic:[...table.tBodies[0].rows].every(r=>r.cells[0].tagName==='TH'&&r.cells[0].scope==='row'),
          caption:!!table.caption?.textContent.trim(),
          scrollX:wrap.scrollWidth>wrap.clientWidth,
          originalVisible:originalContent.includes(labels[n]),
          back:o.querySelector('[data-cpc-back]')?.textContent.trim()
        };
      },n);
      assert.equal(pilot.found,true,label+': quadro não renderizou');
      assert.equal(pilot.rows,{9:4,10:2,11:3}[n],label+': número de linhas');
      assert.equal(pilot.cols,2,label+': número de colunas');
      assert.equal(pilot.sourceVerified,true,label+': quadro difere da apostila original');
      assert.equal(pilot.semantic,true,label+': cabeçalho semântico ausente');
      assert.equal(pilot.caption,true,label+': legenda editorial ausente');
      assert.equal(pilot.originalVisible,true,label+': transcrição original foi suprimida');
      assert.equal(pilot.back,'← Voltar ao M'+String(n).padStart(2,'0'),label+': botão de retorno');
      if(width===390)assert.equal(pilot.scrollX,true,label+': quadro sem rolagem horizontal interna');
    }


    if([6,7,8].includes(n)){
      const pilot=await page.evaluate(n=>{
        const o=document.getElementById('cpcM0'+n+'NativeReaderOverlay');
        const wrap=o.querySelector('[data-cpc-editorial-pilot="m0'+n+'"]');
        const table=wrap?.querySelector('table');
        if(!table)return {exists:false};
        const source=window.BASE_NATIVE_CONTENT.cpc['m0'+n].complete.replace(/\s+/g,' ').trim();
        const rows=[...table.tBodies[0].rows].map(r=>[...r.cells].map(c=>c.textContent.trim()));
        const m06=n===6&&rows.length===2&&
          source.includes('causas predominantemente objetivas causas de natureza mais subjetiva/pessoal')&&
          source.includes('maior intensidade de risco à imparcialidade risco menos objetivo');
        return {
          exists:true,rows:rows.length,columns:table.tHead.rows[0].cells.length,
          sourceVerified:n===6?m06:rows.every(row=>source.includes(row.join(' '))),
          semantics:[...table.tBodies[0].rows].every(r=>r.cells[0].tagName==='TH'&&r.cells[0].scope==='row'),
          caption:!!table.caption?.textContent,
          localScroll:wrap.scrollWidth>wrap.clientWidth,
          originalRemains:o.querySelector('.bc-native-article').textContent.includes(n===6?'3.1. Diferença estrutural':n===7?'QUADRO COMPARATIVO':'Regra Número'),
          back:o.querySelector('[data-cpc-back]')?.textContent.trim()
        };
      },n);
      assert.equal(pilot.exists,true,label+': quadro editorial não aparece');
      assert.equal(pilot.rows,{6:2,7:5,8:10}[n],label+': linhas da tabela alteradas');
      assert.equal(pilot.columns,n===6?3:2,label+': colunas da tabela alteradas');
      assert.equal(pilot.sourceVerified,true,label+': conteúdo não localizado no material original');
      assert.equal(pilot.semantics,true,label+': cabeçalhos de linha não semânticos');
      assert.equal(pilot.caption,true,label+': legenda do quadro ausente');
      assert.equal(pilot.originalRemains,true,label+': fonte textual original ausente');
      assert.equal(pilot.back,'← Voltar ao M0'+n,label+': retorno mudou inesperadamente');
      if(width===390)assert.equal(pilot.localScroll,true,label+': rolagem local da tabela ausente');
    }


    if([3,4,5].includes(n)){
      const pilot=await page.evaluate(n=>{
        const id='cpcM'+String(n).padStart(2,'0')+'NativeReaderOverlay';
        const o=document.getElementById(id);
        const wrap=o.querySelector('[data-cpc-editorial-pilot="m0'+n+'"]');
        const table=wrap?.querySelector('table');
        if(!table)return {found:false};
        const data=window.BASE_NATIVE_CONTENT.cpc['m0'+n].complete.replace(/\s+/g,' ').trim();
        const rows=[...table.tBodies[0].rows].map(r=>[...r.cells].map(c=>c.textContent.trim()));
        return {
          found:true,rows:rows.length,columns:table.tHead.rows[0].cells.length,
          semanticallyValid:[...table.tBodies[0].rows].every(r=>r.cells[0].tagName==='TH'&&r.cells[0].scope==='row'),
          sourceProved:rows.every(row=>data.includes(row.join(' '))),
          responsive:wrap.scrollWidth>wrap.clientWidth,
          caption:!!table.caption?.textContent.includes('original'),
          label:o.querySelector('[data-cpc-back]')?.textContent.trim()
        };
      },n);
      const expectedRows={3:5,4:5,5:4}[n];
      const expectedCols=n===4?2:3;
      assert.equal(pilot.found,true,label+': quadro não localizado');
      assert.equal(pilot.rows,expectedRows,label+': linhas inesperadas');
      assert.equal(pilot.columns,expectedCols,label+': colunas inesperadas');
      assert.equal(pilot.semanticallyValid,true,label+': células semânticas ausentes');
      assert.equal(pilot.sourceProved,true,label+': informação não corresponde à fonte');
      assert.equal(pilot.caption,true,label+': explicação de consulta ausente');
      assert.equal(pilot.label,'← Voltar ao M0'+n,label+': botão incorreto');
      if(width===390)assert.equal(pilot.responsive,true,label+': scroll local ausente');
    }


    if(n===2){
      const pilot=await page.evaluate(()=>{
        const overlay=document.getElementById('cpcM02NativeReaderOverlay');
        const table=overlay.querySelector('[data-cpc-editorial-pilot="m02-merito"] table');
        if(!table)return {exists:false};
        const rows=[...table.tBodies[0].rows].map(row=>[...row.cells].map(cell=>cell.textContent.trim()));
        const raw=window.BASE_NATIVE_CONTENT.cpc.m02.complete.replace(/\s+/g,' ').trim();
        const wrap=table.parentElement;
        return {
          exists:true,
          rows:rows.length,
          columns:table.tHead.rows[0].cells.length,
          sourceVerified:rows.every(row=>raw.includes(row.join(' '))),
          semantic: [...table.tBodies[0].rows].every(row=>row.cells[0].tagName==='TH'&&row.cells[0].scope==='row'),
          scrollX:wrap.scrollWidth>wrap.clientWidth,
          originalPreserved:overlay.querySelector('.bc-native-article').textContent.includes('Impossibilidade jurídica do pedido'),
          button:overlay.querySelector('[data-cpc-back]')?.textContent.trim()
        };
      });
      assert.equal(pilot.exists,true,label+': tabela editorial não inserida');
      assert.equal(pilot.rows,6,label+': contagem das situações');
      assert.equal(pilot.columns,3,label+': contagem das colunas');
      assert.equal(pilot.sourceVerified,true,label+': informações sem respaldo textual');
      assert.equal(pilot.semantic,true,label+': falta cabeçalho de linha semântico');
      assert.equal(pilot.originalPreserved,true,label+': transcrição original ausente');
      assert.equal(pilot.button,'← Voltar ao M02',label+': rótulo de retorno');
      if(width===390)assert.equal(pilot.scrollX,true,label+': não há rolagem local da tabela');
    }

    assert.equal(m.noPageOverflow,true,label+': página com vazamento horizontal');
    assert.ok(m.chapterChecks>=1,label+': marcações de capítulo ausentes');
    assert.ok(m.rawTitle?.includes(label),label+': módulo errado aberto');
    const base='artifacts/etapa6-cpc-m02-m20/cpc-m'+two(n)+'-'+width;
    await page.locator('#'+id+' .bc-native-reader').screenshot({path:base+'-leitor.png'});
    if(m.tables)await page.locator('#'+id+' .bc-native-article table').first().screenshot({path:base+'-tabela.png'});
    const toggle=page.locator('#'+id+' .bc-reading-chapters-toggle');
    assert.equal(await toggle.count(),1,label+': botão Capítulos ausente');
    await toggle.click();
    const ck=page.locator('#'+id+' [data-cpc-chapter-check]').last();
    // Algumas seções ficam automaticamente concluídas ao serem visualizadas.
    // Testar o estado concluído explicitamente, que deve persistir após reabrir.
    if(await ck.evaluate(b=>b.classList.contains('done')))await ck.click();
    if(!(await ck.evaluate(b=>b.classList.contains('done'))))await ck.click();
    assert.equal(await ck.evaluate(b=>b.classList.contains('done')),true,label+': não concluiu o capítulo');
    await page.evaluate(a=>window[a].close(),api);
    await page.evaluate(a=>window[a].open('complete'),api);
    await page.waitForFunction(id=>!!document.getElementById(id)?.querySelector('[data-cpc-chapter-check]'),id);
    const persistent=await page.locator('#'+id+' [data-cpc-chapter-check]').last().evaluate(b=>b.classList.contains('done'));
    assert.equal(persistent,true,label+': capítulo concluído não persistiu');
    await page.evaluate(a=>window[a].open('summary'),api);
    await page.waitForTimeout(70);
    const summaryPremium=await page.locator('#'+id).evaluate(o=>o.classList.contains('bc-apostila-v1'));
    assert.equal(summaryPremium,false,label+': tema exclusivo aplicado no resumo');
    if([18,19,20].includes(n))assert.equal(await page.locator('#'+id+' [data-cpc-editorial-pilot]').count(),0,label+': quadro vazou para resumo');
    if([15,16,17].includes(n))assert.equal(await page.locator('#'+id+' [data-cpc-editorial-pilot]').count(),0,label+': quadro adicional apareceu no resumo');
    if([12,13,14].includes(n))assert.equal(await page.locator('#'+id+' [data-cpc-editorial-pilot]').count(),0,label+': quadro do completo vazou para o resumo');
    if([9,10,11].includes(n))assert.equal(await page.locator('#'+id+' [data-cpc-editorial-pilot]').count(),0,label+': novo quadro Premium vazou para o resumo');
    if([6,7,8].includes(n))assert.equal(await page.locator('#'+id+' [data-cpc-editorial-pilot]').count(),0,label+': novo quadro vazou ao resumo');
    if([3,4,5].includes(n))assert.equal(await page.locator('#'+id+' [data-cpc-editorial-pilot]').count(),0,label+': quadro do completo apareceu no resumo');
    if(n===2)assert.equal(await page.locator('#'+id+' [data-cpc-editorial-pilot]').count(),0,label+': quadro Premium vazou para o resumo');
    assert.deepEqual(errors,[],label+': erros JavaScript');
    result.push({module:label,width,source,...m,chapterPersisted:true,summaryUnstyled:true,errors:[]});
   }finally{await page.close();}
  }
 }
 assert.equal(result.length,57,'esperados 19 módulos × 3 larguras');
 await writeFile('artifacts/etapa6-cpc-m02-m20/metricas.json',JSON.stringify(result,null,2)+'\n');
 console.log('ETAPA6_CPC_RESULTS='+JSON.stringify(result));
}finally{if(browser)await browser.close();server.close();}
