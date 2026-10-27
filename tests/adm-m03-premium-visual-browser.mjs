/* Chromium real: renderização de uma cópia DOM fiel do HTML aprovado M03,
 * com CSS real carregado na ordem correspondente ao app. Não utiliza credenciais.
 * As imagens são capturas do fixture de navegador, não do site autenticado.
 */
import assert from 'node:assert/strict';
import { readFile, mkdir } from 'node:fs/promises';
import vm from 'node:vm';
import { chromium } from 'playwright';
const read=file=>readFile(new URL('../'+file,import.meta.url),'utf8');
const source=await read('content/adm/m03-approved-complete.js');
const ctx={window:{}};vm.runInNewContext(source,ctx);
const html=ctx.window.ADM_APPROVED_COMPLETE[3];
const cssFiles=['ui/native-study-reader.css','ui/adm-native-layer.css','ui/legal-complete-premium-v1.css','ui/reading-appearance-v1.css'];
const styles=await Promise.all(cssFiles.map(read));
const activation=await read('ui/legal-complete-premium-v1.js');
await mkdir('artifacts/adm-m03-premium',{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const metrics=[];
try{
 for(const width of [390,768,1366]){
  const height=width===390?844:width===768?1024:768;
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
  await page.setContent('<!doctype html><html lang="pt-BR" class="bc-ui-v1" data-bc-reading-mode="paper"><head><meta charset="UTF-8"></head><body>'+
   '<div id="adm-native-reader" class="bc-native-reader-overlay adm-native-overlay bc-reading-appearance" data-bc-premium-adm-m03="1">'+
   '<div class="bc-native-reader"><header class="bc-native-reader-head"><div class="bc-native-reader-title"><b>Atos Administrativos</b><small>DIREITO ADMINISTRATIVO · MÓDULO 03 · COMPLETO</small></div></header>'+
   '<div class="bc-native-reader-tools">Leitor</div><div class="bc-native-reader-body"><main class="bc-native-scroll"><article class="bc-native-article adm-approved-reading">'+html+'</article></main></div></div></div></body></html>');
  for(const content of styles)await page.addStyleTag({content});
  await page.addScriptTag({content:activation});
  const m=await page.evaluate(()=>{
   const overlay=document.getElementById('adm-native-reader');
   const article=overlay.querySelector('.bc-native-article');
   const title=article.querySelector('h1');
   const label=article.querySelector('h1+p');
   const session=article.querySelector('h2');
   const wrap=article.querySelector('.adm-table-scroll');
   const table=wrap.querySelector('table');
   return {
    premium:overlay.classList.contains('bc-apostila-v1'),
    primaryClasses:[...article.classList],
    title: title.textContent,
    titleColor:getComputedStyle(title).color,
    sessionBg:getComputedStyle(session).backgroundColor,
    labelRaw:label.textContent,
    pseudoBefore:getComputedStyle(label,'::before').content,
    pseudoAfter:getComputedStyle(label,'::after').content,
    tableDisplay:getComputedStyle(table).display,
    wrapScroll:wrap.scrollWidth-wrap.clientWidth,
    tableRows:table.rows.length,
    tableColumns:table.rows[0].cells.length,
    hyphens:getComputedStyle(table.rows[1].cells[0]).hyphens,
    overflowViewport:document.documentElement.scrollWidth>window.innerWidth+2,
   };
  });
  assert.equal(m.premium,true,'tema não ativou');
  assert.equal(m.labelRaw,'DIREITO ADMINISTRATIVOMÓDULO 03');
  assert.match(m.pseudoBefore,/DIREITO ADMINISTRATIVO/);
  assert.match(m.pseudoAfter,/MÓDULO 03/);
  assert.equal(m.tableDisplay,'table','tabela perdeu layout semântico');
  assert.equal(m.tableColumns,4);
  assert.equal(m.tableRows,5);
  assert.equal(m.hyphens,'none');
  assert.equal(m.overflowViewport,false,'vazamento horizontal de viewport');
  if(width<=768)assert.ok(m.wrapScroll>60,'faltou rolagem interna da tabela: '+width+'px');
  const pre='artifacts/adm-m03-premium/'+width;
  await page.locator('.bc-native-article>h1').screenshot({path:pre+'-titulo.png'});
  await page.locator('.bc-native-article>h2').first().screenshot({path:pre+'-sessao.png'});
  await page.locator('.adm-table-scroll').first().screenshot({path:pre+'-tabela.png'});
  if(width<=768){
   const shift=await page.evaluate(()=>{
    const el=document.querySelector('.adm-table-scroll');el.scrollLeft=el.scrollWidth;return el.scrollLeft;
   });
   assert.ok(shift>40,'tabela não foi rolável pelo navegador');
   await page.locator('.adm-table-scroll').first().screenshot({path:pre+'-tabela-lateral.png'});
  }
  metrics.push({width,...m});
  await page.close();
 }
 console.log('CHROMIUM_VISUAL_RESULTS='+JSON.stringify(metrics));
}finally{await browser.close()}
