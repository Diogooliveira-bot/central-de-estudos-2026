from pathlib import Path

path = Path("tools/decorando.html")
text = path.read_text(encoding="utf-8")

VISIBLE_OLD = 'function visible(){return statusFiltered(selectedActive())}'
VISIBLE_NEW = '''function visible(){
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

ANSWER_OLD = '''function answerFocus(value){
  const a=visible()[ui.articleIndex];if(!a||ui.choice!==null)return;
  ui.choice=value;record(a,value);render()
}'''
ANSWER_NEW = '''function answerFocus(value){
  const a=visible()[ui.articleIndex];if(!a||ui.choice!==null)return;
  // Fix: fixe o ID antes de registrar. O registro altera os filtros por status
  // e, sem este pin, a mesma posição pode passar a apontar para a questão seguinte.
  ui.focusArticleId=a.id;ui.choice=value;record(a,value);render()
}'''

MOVE_OLD = '''function move(dir){
  const v=visible(),n=ui.articleIndex+dir;if(n<0||n>=v.length)return;
  ui.articleIndex=n;ui.choice=null;ui.historyOpen=false;ui.commentOpen=false;render();window.scrollTo({top:0,behavior:"smooth"})
}'''
MOVE_INTERMEDIATE = '''function move(dir){
  const v=visible(),n=ui.articleIndex+dir;if(n<0||n>=v.length)return;
  ui.articleIndex=n;ui.choice=null;ui.focusArticleId=null;ui.historyOpen=false;ui.commentOpen=false;render();window.scrollTo({top:0,behavior:"smooth"})
}'''
MOVE_NEW = '''function move(dir){
  const natural=statusFiltered(selectedActive());
  const currentPinned=ui.choice!==null&&ui.focusArticleId&&!natural.some(a=>a.id===ui.focusArticleId);
  const n=currentPinned
    ? ui.articleIndex+(dir>0?0:-1)
    : ui.articleIndex+dir;
  if(n<0||n>=natural.length)return;
  ui.articleIndex=n;ui.choice=null;ui.focusArticleId=null;ui.historyOpen=false;ui.commentOpen=false;render();window.scrollTo({top:0,behavior:"smooth"})
}'''

changed = False

def patch(old, new, label):
    global text, changed
    count = text.count(old)
    if count:
        text = text.replace(old, new)
        changed = True
        print(f"patched {count} occurrence(s): {label}")
        return
    if new in text:
        print(f"already patched: {label}")
        return
    raise SystemExit(f"expected code not found: {label}")

patch(VISIBLE_OLD, VISIBLE_NEW, "visible")
patch(ANSWER_OLD, ANSWER_NEW, "answerFocus")

# Accept both the original move() and the first hotfix version, so the patch is
# safe for a fresh checkout and for repositories where the first fix already ran.
if MOVE_INTERMEDIATE in text:
    count = text.count(MOVE_INTERMEDIATE)
    text = text.replace(MOVE_INTERMEDIATE, MOVE_NEW)
    changed = True
    print(f"patched {count} occurrence(s): move intermediate -> final")
elif MOVE_OLD in text:
    count = text.count(MOVE_OLD)
    text = text.replace(MOVE_OLD, MOVE_NEW)
    changed = True
    print(f"patched {count} occurrence(s): move original -> final")
elif MOVE_NEW in text:
    print("already patched: move final")
else:
    raise SystemExit("expected code not found: move")

if changed:
    path.write_text(text, encoding="utf-8")
    print("tools/decorando.html updated")
else:
    print("no changes needed")
