from pathlib import Path
p=Path("tools/vade.html")
s=p.read_text(encoding="utf-8")

needle='<body><div id="app"></div><script>'
replacement='<body><div id="app"></div><script src="vade-pdf-catalog.js?v=20261005"></script><script>'
if 'vade-pdf-catalog.js' not in s:
    s=s.replace(needle,replacement,1)

merge_code="""
for(const pg of (window.VADE_PDF_GROUPS||[])){
 const existing=LAW_GROUPS.find(g=>g.id===pg.id);
 if(existing){
   const ids=new Set(existing.laws.map(l=>l.id));
   for(const l of pg.laws)if(!ids.has(l.id))existing.laws.push(l);
 }else{
   LAW_GROUPS.push(pg);
 }
}
const PDF_LAW_MAP=Object.fromEntries(
 (window.VADE_PDF_GROUPS||[]).flatMap(g=>g.laws).map(l=>[l.id,l])
);
"""
marker="const STATE_KEY='vade-mecum-central-v1';"
if "const PDF_LAW_MAP=" not in s:
    s=s.replace(marker,merge_code+"\n"+marker,1)

s=s.replace(
 "function vmLaw(){return LAW_DATA[vm.lawId]}",
 "function vmLaw(){return LAW_DATA[vm.lawId]||(PDF_LAW_MAP[vm.lawId]?{law:PDF_LAW_MAP[vm.lawId],articles:[],introduction:[]}:null)}",
 1
)

css="""
.vm-pdf-panel{max-width:950px;margin:0 auto 18px;border:1px solid var(--line);border-radius:10px;background:#fff;overflow:hidden}
.vm-pdf-note{display:flex;justify-content:space-between;gap:14px;align-items:center;padding:12px 14px;border-bottom:1px solid var(--line);background:#fbfcfb}
.vm-pdf-note strong{display:block;font-size:11px}.vm-pdf-note small{display:block;color:var(--muted);font-size:9px;margin-top:3px;line-height:1.45}
.vm-pdf-note a{white-space:nowrap;border:1px solid var(--green);border-radius:8px;background:var(--green);color:#fff;padding:8px 10px;text-decoration:none;font-size:9px;font-weight:800}
.vm-pdf-frame{display:block;width:100%;height:72vh;min-height:620px;border:0;background:#f2f3f2}
@media(max-width:820px){.vm-pdf-frame{height:68vh;min-height:500px}.vm-pdf-note{align-items:flex-start;flex-direction:column}}
"""
style_marker='</style>\n\n<style id="central-native-return-style">'
if ".vm-pdf-panel{" not in s:
    s=s.replace(style_marker,css+'\n</style>\n\n<style id="central-native-return-style">',1)

start=s.index("function vmRender(){")
end=s.index("\ndocument.addEventListener('selectionchange'",start)
new_render="""function vmRender(){
 const law=vmLaw();
 if(!law){
  document.getElementById('app').innerHTML='<div class=\"vm-empty\">Diploma nao encontrado.</div>';
  return;
 }
 const meta=law.law||{};
 document.documentElement.style.setProperty('--fontScale',vm.fontScale);

 if(meta.pdfOnly&&meta.pdfUrl){
  document.getElementById('app').innerHTML=`<div class=\"vm-shell\">${vmHeader()}<div class=\"vm-grid\">${vmSidebar()}<main class=\"vm-main\">${vmLawSelect()}
   <section class=\"vm-law-head\"><div><span class=\"eyebrow\">${vmEsc(meta.shortName||'')}</span><h1>${vmEsc(meta.displayTitle||meta.title||'')}</h1><p>${vmEsc(meta.subtitle||'')}</p></div>
   <div class=\"vm-law-head-actions\"><a href=\"${vmEsc(meta.pdfUrl)}\" target=\"_blank\" rel=\"noopener\">Abrir PDF</a></div></section>
   <section class=\"vm-pdf-panel\"><div class=\"vm-pdf-note\"><div><strong>PDF oficial anexado ao Vade Mecum</strong><small>Use a busca e a navegacao do visualizador de PDF. O arquivo fica armazenado junto da Central.</small></div><a href=\"${vmEsc(meta.pdfUrl)}\" target=\"_blank\" rel=\"noopener\">Abrir em nova aba</a></div>
   <iframe class=\"vm-pdf-frame\" src=\"${vmEsc(meta.pdfUrl)}#view=FitH\" title=\"${vmEsc(meta.displayTitle||meta.title||'PDF legal')}\"></iframe></section>
   </main></div></div>`;
  return;
 }

 const list=vmFiltered(),shown=list.slice(0,vm.visible);
 document.getElementById('app').innerHTML=`<div class=\"vm-shell\">${vmHeader()}<div class=\"vm-grid\">${vmSidebar()}<main class=\"vm-main\">${vmLawSelect()}
 <section class=\"vm-law-head\"><div><span class=\"eyebrow\">${vmEsc(meta.shortName||'')}</span><h1>${vmEsc(meta.displayTitle||meta.title||'')}</h1><p>${vmEsc(meta.subtitle||'')}</p>${meta.abstract?`<p>${vmEsc(meta.abstract)}</p>`:''}</div><div class=\"vm-law-head-actions\"><button onclick=\"vm.indexOpen=true;vmRender()\">Indice</button>${meta.officialUrl?`<a href=\"${vmEsc(meta.officialUrl)}\" target=\"_blank\" rel=\"noopener\">Fonte oficial</a>`:''}</div></section>
 <div class=\"vm-toolbar\"><span>Exibir</span>${[['all','Todos'],['highlighted','Marcados'],['highImportance','Importancia alta'],['unclassified','Sem classificacao']].map(([v,l])=>`<button class=\"vm-filter ${vm.filter===v?'active':''}\" onclick=\"vmSetFilter('${v}')\">${l}</button>`).join('')}</div>
 <div class=\"vm-results-info\">${list.length} artigo(s) encontrado(s) - ${Object.keys(vmState).filter(k=>k.startsWith(vm.lawId+':')).length} com registro de estudo</div>
 ${!vm.query && vm.filter==='all' && (law.introduction||[]).length?`<section class=\"vm-intro\">${law.introduction.map(x=>`<p>${vmEsc(x)}</p>`).join('')}</section>`:''}
 <section class=\"vm-articles\">${shown.map(vmArticle).join('')}</section>${!shown.length?'<div class=\"vm-empty\">Nenhum artigo encontrado com este filtro.</div>':''}${shown.length<list.length?`<button class=\"vm-more\" onclick=\"vm.visible+=${PAGE_SIZE};vmRender()\">Carregar mais ${PAGE_SIZE}</button>`:''}
 </main></div>${vmIndex()}</div>`;
 setTimeout(vmHydrateImages,0)
}
"""
s=s[:start]+new_render+s[end:]
p.write_text(s,encoding="utf-8")
print("patched",len(s))
