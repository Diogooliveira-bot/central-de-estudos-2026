from pathlib import Path

path = Path("tools/decorando.html")
text = path.read_text(encoding="utf-8")

replacements = [
    (
        'function visible(){return statusFiltered(selectedActive())}',
        '''function visible(){
  const list=statusFiltered(selectedActive());
  // No modo Foco, preserve a questão recém-respondida mesmo quando o filtro
  // (ex.: "nunca vista" ou "errei") deixaria de incluí-la após o registro.
  // Assim o feedback continua ligado à mesma questão até o usuário navegar.
  if(ui.choice!==null&&ui.focusArticleId&&!list.some(a=>a.id===ui.focusArticleId)){
    const pinned=selectedActive().find(a=>a.id===ui.focusArticleId);
    if(pinned)list.splice(Math.min(ui.articleIndex,list.length),0,pinned)
  }
  return list
}'''
    ),
    (
        '''function answerFocus(value){
  const a=visible()[ui.articleIndex];if(!a||ui.choice!==null)return;
  ui.choice=value;record(a,value);render()
}''',
        '''function answerFocus(value){
  const a=visible()[ui.articleIndex];if(!a||ui.choice!==null)return;
  // Fix: fixe o ID antes de registrar. O registro altera os filtros por status
  // e, sem este pin, a mesma posição pode passar a apontar para a questão seguinte.
  ui.focusArticleId=a.id;ui.choice=value;record(a,value);render()
}'''
    ),
    (
        '''function move(dir){
  const v=visible(),n=ui.articleIndex+dir;if(n<0||n>=v.length)return;
  ui.articleIndex=n;ui.choice=null;ui.historyOpen=false;ui.commentOpen=false;render();window.scrollTo({top:0,behavior:"smooth"})
}''',
        '''function move(dir){
  const v=visible(),n=ui.articleIndex+dir;if(n<0||n>=v.length)return;
  ui.articleIndex=n;ui.choice=null;ui.focusArticleId=null;ui.historyOpen=false;ui.commentOpen=false;render();window.scrollTo({top:0,behavior:"smooth"})
}'''
    ),
]

changed = False
for old, new in replacements:
    count = text.count(old)
    if count:
        text = text.replace(old, new)
        changed = True
        print(f"patched {count} occurrence(s): {old.splitlines()[0]}")
    elif new in text:
        print(f"already patched: {old.splitlines()[0]}")
    else:
        raise SystemExit(f"expected code not found: {old.splitlines()[0]}")

if changed:
    path.write_text(text, encoding="utf-8")
    print("tools/decorando.html updated")
else:
    print("no changes needed")
