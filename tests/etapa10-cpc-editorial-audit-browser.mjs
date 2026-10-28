/* Etapa 10 — auditoria editorial de CPC M01–M20.
 * Chromium real e fontes originais em localhost; sem sessão de aluno, rede externa,
 * produção, Preview Vercel ou banco de dados. Métricas diagnósticas não são
 * certificação de precisão jurídica nem de fidelidade visual humana.
 */
import assert from 'node:assert/strict';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {createServer} from 'node:http';
import {chromium} from 'playwright';
const read=p=>readFile(new URL('../'+p,import.meta.url),'utf8');
const pad=n=>String(n).padStart(2,'0');
const styles=await Promise.all([
 read('ui/native-study-reader.css'),
 read('ui/legal-complete-premium-v1.css'),
 read('ui/reading-appearance-v1.css')
]);
const shell=await Promise.all([
 read('ui/reading-appearance-v1.js'),read('ui/legal-complete-premium-v1.js')
]);
const modules=await Promise.all(Array.from({length:20},async(_,i)=>{
 const n=i+1,id=pad(n);
 return {
  n,
  data:await read('content/cpc/m'+id+'-native-data.js'),
  reader:await read(n===1?'ui/cpc-native-study-reader.js':'ui/cpc-m'+id+'-native-study-reader.js')
 };
}));
const dir='artifacts/etapa10-cpc-editorial';
await mkdir(dir,{recursive:true});
const server=createServer((req,res)=>{
 res.writeHead(200,{'content-type':'text/html; charset=utf-8'});
 res.end('<!doctype html><html lang="pt-BR" class="bc-ui-v1" data-bc-reading-mode="paper"><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><main id="subjects"></main></body></html>');
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const base='http://127.0.0.1:'+server.address().port;
let browser;
const findings=[];
try{
 browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 for(const width of [390,768,1366]){
  for(const module of modules){
   const {n}=module,label='CPC M'+pad(n),id=n===1?'cpcNativeReaderOverlay':'cpcM'+pad(n)+'NativeReaderOverlay',
   api=n===1?'CpcNativeReader':'CpcM'+pad(n)+'NativeReader';
   const page=await browser.newPage({viewport:{width,height:width===390?844:width===768?1024:768},deviceScaleFactor:1});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   try{
    await page.goto(base);
    for(const css of styles)await page.addStyleTag({content:css});
    for(const js of [...shell,module.data,module.reader])await page.addScriptTag({content:js});
    await page.evaluate(api=>window[api].open('complete'),api);
    await page.waitForFunction(id=>document.getElementById(id)?.classList.contains('bc-apostila-v1'),id,{timeout:10000});
    await page.waitForTimeout(60);
    const result=await page.evaluate(({n,id,width})=>{
     const o=document.getElementById(id),a=o.querySelector('.bc-native-article');
     const src=window.BASE_NATIVE_CONTENT.cpc['m'+String(n).padStart(2,'0')].complete;
     const text=a.innerText.replace(/\s+/g,' ').trim();
     const sourceLines=src.replace(/\r/g,'').split('\n').map(s=>s.replace(/\s+/g,' ').trim()).filter(s=>s.length>28&&!/^BASE COMPLETA/.test(s));
     const lost=sourceLines.filter(s=>!text.includes(s));
     const squish=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^\p{L}\p{N}]/gu,'').toLowerCase();
     const rendered=squish(a.textContent);
     const knownHeadings=new Set([...a.querySelectorAll('[data-bc-original-heading]')].map(h=>h.dataset.bcOriginalHeading));
     const diagnostic=lost.map(line=>{
      const compact=squish(line);
      const first=squish(line.split(/\s+/).slice(0,8).join(' '));
      const last=squish(line.split(/\s+/).slice(-8).join(' '));
      const heading=knownHeadings.has(line);
      let reason=heading?'rótulo_de_título':
         rendered.includes(compact)?'conteúdo_presente_reformatado':
         /^(versão final auditada|foco:|núcleo legal:|perfil:|atualização jurídica:)/i.test(line)?'metadado_editorial':
         rendered.includes(first)&&rendered.includes(last)?'fragmentos_presentes_conferir':
         rendered.includes(first)?'início_presente_conferir':'confronto_manual';
      return {reason,line};
     });
     const diagnosis=Object.fromEntries([...new Set(diagnostic.map(x=>x.reason))].map(reason=>[reason,diagnostic.filter(x=>x.reason===reason).length]));

     const headings=[...a.querySelectorAll('h1,h2,h3')].map(h=>({level:h.tagName,title:h.textContent.trim(),id:h.id}));
     const suspicious=headings.filter(h=>/^\d+\.\s+\d+\./.test(h.title)||/^\d+\.\s*$/i.test(h.title));
     const repeated=headings.map(h=>h.title).filter((h,i,arr)=>arr.indexOf(h)!==i);
     const toc=[...o.querySelectorAll('.bc-native-toc button')];
     const tables=[...a.querySelectorAll('table')].map((t,i)=>{
      const wrap=t.closest('.table-wrap,.bc-cpc-m01-table-scroll,.bc-editor-table-wrap,.adm-table-scroll');
      const th=[...t.querySelectorAll('thead th')];
      const styles=getComputedStyle(t);
      return {
       index:i,rows:t.tBodies[0]?.rows.length||0,cols:t.tHead?.rows[0]?.cells.length||0,
       caption:!!t.caption?.textContent.trim(),
       headers:th.length,headingScopes:th.every(h=>h.scope==='col'),
       rowHeaderScopes:[...t.tBodies].every(tb=>[...tb.rows].every(r=>r.cells[0]?.tagName==='TH'&&r.cells[0]?.scope==='row')),
       wrapper:!!wrap,overflowX:wrap?getComputedStyle(wrap).overflowX:null,
       scrollWidth:wrap?.scrollWidth||0,clientWidth:wrap?.clientWidth||0,
       tableWidth:Math.round(t.getBoundingClientRect().width),
       minFont:Math.min(...[...t.querySelectorAll('th,td')].map(c=>parseFloat(getComputedStyle(c).fontSize)||100)),
       nativeDisplay:styles.display
      };
     });
     return {
      module:'CPC M'+String(n).padStart(2,'0'),width,title:window.BASE_NATIVE_CONTENT.cpc['m'+String(n).padStart(2,'0')].title,
      sourceChars:src.length,readableChars:text.length,
      sourceLines:sourceLines.length,notExactLines:lost.length,
      missingLineExamples:lost.slice(0,30),diagnosis,lineDiagnostics:n<=8?diagnostic:[],missingLinePercent:Math.round(1000*lost.length/Math.max(1,sourceLines.length))/10,
      headingsTotal:headings.length,h1:headings.filter(h=>h.level==='H1').length,h2:headings.filter(h=>h.level==='H2').length,h3:headings.filter(h=>h.level==='H3').length,
      suspiciousHeadings:suspicious,repeatedHeadings:[...new Set(repeated)].slice(0,9),
      normalizedHeadingCount:a.querySelectorAll('[data-bc-original-heading]').length,
      quizM06Count:a.querySelectorAll('h2.bc-cpc-m06-quiz-question').length,quizM06Font:n===6?parseFloat(getComputedStyle(a.querySelector('.bc-cpc-m06-quiz-question')||a).fontSize):null,
      tocItems:toc.length,chapterCheckButtons:o.querySelectorAll('[data-cpc-chapter-check]').length,
      tables,pageOverflow:document.documentElement.scrollWidth>innerWidth+2,
      premium:o.classList.contains('bc-apostila-v1'),readerName:o.querySelector('.bc-native-reader-title b')?.textContent.trim(),
      narrowArticle:a.getBoundingClientRect().width<260,
      horizontalArticleOverflow:a.scrollWidth>a.clientWidth+4
     };
    },{n,id,width});
    assert.equal(result.premium,true,label+': tema Premium não carregado');
    assert.equal(result.h1,1,label+': esperado um H1 no artigo');
    assert.ok(result.h2>0,label+': capítulos H2 indisponíveis');
    assert.equal(result.pageOverflow,false,label+': transbordamento da página');
    assert.ok(result.tables.length>0,label+': quadro consultivo HTML ausente');
    assert.ok(result.tables.every(t=>t.rows>0&&t.cols>1&&t.wrapper),label+': tabela fora do padrão semântico');
    assert.ok(result.tables.every(t=>t.overflowX==='auto'),label+': tabela sem rolagem horizontal própria');
    if(width===390)assert.ok(result.tables.every(t=>t.scrollWidth>t.clientWidth+1),label+': tabela sem rolagem celular');
    if(n===1)assert.ok(result.tables.every(t=>t.caption),label+': tabela principal sem legenda acessível');
    if(n===2||n===4)assert.equal(result.suspiciousHeadings.length,0,label+': cabeçalhos continuam com numeração duplicada');
    if(n===6){
      assert.equal(result.suspiciousHeadings.length,0,label+': número duplicado no teste rápido ou nos títulos');
      assert.equal(result.quizM06Count,15,label+': teste rápido deve ter 15 itens sem perder IDs');
      assert.equal(result.quizM06Font,18,label+': estilo de questão diferente do padrão esperado');
    }
    if([2,4,6].includes(n))assert.equal(result.normalizedHeadingCount,{2:2,4:2,6:2}[n],label+': correção editorial dos títulos não aplicada');

    if(n===5){
     const editorial=await page.evaluate(id=>{
      const o=document.getElementById(id),a=o.querySelector('.bc-native-article');
      const raw=window.BASE_NATIVE_CONTENT.cpc.m05.complete;
      const markers=[...a.querySelectorAll('p.bc-cpc-m05-part-divider:not([data-bc-editorial-boundary])')];
      const p=markers[0],previous=p?.previousElementSibling;
      const next=p?.nextElementSibling;
      return {
       sourceUnchanged:raw.includes('IRDR são exceções expressasPARTE IV - PEGADINHAS FCC'),
       dividerCount:markers.length,
       exactDivider:p?.textContent.trim()==='PARTE IV - PEGADINHAS FCC',
       previousContainsCompleteClause:previous?.tagName==='P'&&previous.textContent.trim().endsWith('IRDR são exceções expressas'),
       nextHeadingIntact:next?.tagName==='H2'&&next.textContent.trim().startsWith('41. AS 18 CONFUSÕES MAIS IMPORTANTES'),
       gluedVisible:[...a.querySelectorAll('p')].some(el=>el.textContent.includes('expressasPARTE IV')),
       dividerFont:p?parseFloat(getComputedStyle(p).fontSize):0,
       onlyVisualClass:!!p&&!p.id,
      };
     },id);
     assert.equal(editorial.sourceUnchanged,true,label+': fonte M05 foi modificada indevidamente');
     assert.equal(editorial.dividerCount,1,label+': seção PARTE IV não foi isolada');
     assert.equal(editorial.exactDivider,true,label+': título mudou durante a conversão');
     assert.equal(editorial.previousContainsCompleteClause,true,label+': frase anterior perdeu texto');
     assert.equal(editorial.nextHeadingIntact,true,label+': seção 41 deixou de ser capítulo');
     assert.equal(editorial.gluedVisible,false,label+': colagem de PDF segue no leitor');
     assert.equal(editorial.dividerFont,16,label+': estilo editorial da parte está incorreto');
     assert.equal(editorial.onlyVisualClass,true,label+': o divisor ganhou ID de capítulo');
     if(width===390)await page.locator('#'+id+' .bc-cpc-m05-part-divider:not([data-bc-editorial-boundary])').screenshot({path:dir+'/m05-390-parte-iv.png'});
    }

    if(n===5){
      const finalQuiz=await page.evaluate(id=>{
        const article=document.getElementById(id).querySelector('.bc-native-article');
        const headings=[...article.querySelectorAll('h2.bc-cpc-m05-quiz-heading')];
        const prompt=article.querySelector('p.bc-cpc-m05-quiz-prompt');
        const divider=article.querySelector('[data-bc-editorial-boundary="parte-viii"]');
        const source=window.BASE_NATIVE_CONTENT.cpc.m05.complete;
        const question1=headings.find(h=>h.textContent.trim().startsWith('1. Todo litisconsórcio necessário'));
        const last=headings.find(h=>h.textContent.trim().startsWith('15. Na denunciação'));
        const rawText=article.innerText;
        return {
          originalUnchanged:source.includes('mérito.2. O requerimento')&&source.includes('Art. 129.PARTE VIII'),
          headings:headings.length,
          unchangedH2:[...article.querySelectorAll('h2')].length===69,
          prompt:prompt?.textContent.trim().startsWith('2. O requerimento de limitação'),
          promptFont:prompt?parseFloat(getComputedStyle(prompt).fontSize):0,
          h2Font:question1?parseFloat(getComputedStyle(question1).fontSize):0,
          firstQuestion:!!question1,lastQuestion:!!last,
          questionResponse:prompt?.nextElementSibling?.textContent.trim()==='Gabarito: CERTO. Art. 113, § 2º.',
          priorAnswer:prompt?.previousElementSibling?.textContent.trim().endsWith('uniformidade do mérito.'),
          afterAnswer:divider?.previousElementSibling?.textContent.trim().endsWith('Gabarito: CERTO. Art. 129.'),
          part8:divider?.textContent.trim()==='PARTE VIII - ROTEIRO DE REVISÃO',
          part8NoId:!!divider&&!divider.id,
          nextSection:divider?.nextElementSibling?.tagName==='H2'&&divider.nextElementSibling.textContent.trim().startsWith('45. REVISÃO EM 10 MINUTOS'),
          noGlues:!rawText.includes('mérito.2.')&&!rawText.includes('Art. 129.PARTE VIII'),
        };
      },id);
      assert.equal(finalQuiz.originalUnchanged,true,label+': fonte do módulo alterada');
      assert.equal(finalQuiz.headings,14,label+': esperadas 14 questões originais em H2');
      assert.equal(finalQuiz.unchangedH2,true,label+': quantidade de H2 foi alterada');
      assert.equal(finalQuiz.firstQuestion,true,label+': questão 1 não identificada');
      assert.equal(finalQuiz.lastQuestion,true,label+': questão 15 não identificada');
      assert.equal(finalQuiz.prompt,true,label+': questão 2 não separada');
      assert.equal(finalQuiz.promptFont,18,label+': tipografia da questão 2');
      assert.equal(finalQuiz.h2Font,18,label+': tipografia das questões H2');
      assert.equal(finalQuiz.questionResponse,true,label+': gabarito da questão 2 não está isolado');
      assert.equal(finalQuiz.priorAnswer,true,label+': gabarito da questão 1 truncado');
      assert.equal(finalQuiz.afterAnswer,true,label+': resposta da questão 15 truncada');
      assert.equal(finalQuiz.part8,true,label+': título da Parte VIII ausente');
      assert.equal(finalQuiz.part8NoId,true,label+': divisor gerou novo capítulo');
      assert.equal(finalQuiz.nextSection,true,label+': capítulo 45 não preservado');
      assert.equal(finalQuiz.noGlues,true,label+': trechos do PDF ainda estão colados');
      if(width===390)await page.locator('#'+id+' .bc-cpc-m05-quiz-prompt').screenshot({path:dir+'/m05-390-questao-2.png'});
    }
    assert.deepEqual(errors,[],label+': erro JavaScript');
    findings.push({...result,errors});
    if(width===390||n===1||n===20){
     await page.locator('#'+id+' .bc-native-reader').screenshot({path:dir+'/m'+pad(n)+'-'+width+'-leitor.png'});
     await page.locator('#'+id+' .bc-native-article table').first().screenshot({path:dir+'/m'+pad(n)+'-'+width+'-tabela.png'});
    }
    await page.evaluate(api=>window[api].close(),api);
   }finally{await page.close();}
  }
 }
 assert.equal(findings.length,60,'esperados 20 módulos × 3 telas');
 await writeFile(dir+'/metricas.json',JSON.stringify(findings,null,2)+'\n');
 console.log('ETAPA10_CPC_AUDIT='+JSON.stringify(findings));
}finally{if(browser)await browser.close();server.close()}
