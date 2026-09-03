(function(){
'use strict';
var VERSION='6687', DB='anki-offline-tauanne-v1';
function trim(s){return String(s==null?'':s).trim()}
function norm(s){return trim(s).toLocaleLowerCase('pt-BR')}
function match(deck,target){deck=String(deck||'');target=String(target||'');return deck===target||deck.indexOf(target+'::')===0}
function parseTextFormat(text){
  var raw=String(text||'').replace(/^\uFEFF/,'').replace(/\r/g,'');
  var lines=raw.split('\n'), groups=[], current=null, removeDecks=[], foundDirective=false;
  function getGroup(deck){for(var i=0;i<groups.length;i++)if(groups[i].deck===deck)return groups[i];var g={deck:deck,rows:[]};groups.push(g);return g}
  for(var i=0;i<lines.length;i++){
    var line=trim(lines[i]);
    if(!line||line.charAt(0)==='#') continue;
    var rm=line.match(/^REMOVER_BARALHO\s*:\s*(.+)$/i);
    if(rm){var rd=trim(rm[1]);if(rd)removeDecks.push(rd);foundDirective=true;continue}
    var m=line.match(/^BARALHO\s*:\s*(.+)$/i);
    if(m){var deck=trim(m[1]);if(!deck)throw new Error('Linha '+(i+1)+': nome de baralho vazio.');current=getGroup(deck);foundDirective=true;continue}
    if(!current){if(foundDirective)throw new Error('Linha '+(i+1)+': card sem BARALHO definido.');return null}
    var pos=line.indexOf(';;');
    if(pos<0)throw new Error('Linha '+(i+1)+' inválida. Use: Pergunta ;; Resposta');
    var front=trim(line.slice(0,pos)),back=trim(line.slice(pos+2));
    if(!front||!back)throw new Error('Linha '+(i+1)+' está sem pergunta ou resposta.');
    current.rows.push([front,back]);
  }
  groups=groups.filter(function(g){return g.rows.length});
  if(!groups.length){if(foundDirective)throw new Error('Nenhum card válido encontrado.');return null}
  var seen={};groups.forEach(function(g){var out=[];g.rows.forEach(function(r){var k=norm(r[0])+'\u241f'+norm(r[1]);if(!seen[g.deck])seen[g.deck]={};if(!seen[g.deck][k]){seen[g.deck][k]=1;out.push(r)}});g.rows=out});
  return{groups:groups,removeDecks:Array.from(new Set(removeDecks)),total:groups.reduce(function(n,g){return n+g.rows.length},0)};
}
function parseCsvLine(line,delimiter){var out=[],cur='',quote=false;for(var i=0;i<line.length;i++){var ch=line[i];if(ch==='"'){if(quote&&line[i+1]==='"'){cur+='"';i++;}else quote=!quote}else if(ch===delimiter&&!quote){out.push(cur);cur=''}else cur+=ch}out.push(cur);return out}
function parseCsvFormat(text,fileName){
  var raw=String(text||'').replace(/^\uFEFF/,'').replace(/\r/g,''),lines=raw.split('\n').filter(function(x){return trim(x)!==''});
  if(lines.length<2)throw new Error('CSV sem cards.');var delim=lines[0].indexOf(';')>=0?';':',';
  var header=parseCsvLine(lines[0],delim).map(function(x){return norm(x)}),fi=header.indexOf('frente'),bi=header.indexOf('verso');if(fi<0)fi=header.indexOf('front');if(bi<0)bi=header.indexOf('back');if(fi<0||bi<0)throw new Error('CSV precisa ter colunas Frente e Verso.');
  var rows=[],seen={};for(var i=1;i<lines.length;i++){var cols=parseCsvLine(lines[i],delim),f=trim(cols[fi]),b=trim(cols[bi]);if(f&&b){var k=norm(f)+'\u241f'+norm(b);if(!seen[k]){seen[k]=1;rows.push([f,b])}}}
  if(!rows.length)throw new Error('Nenhum card válido encontrado no CSV.');
  var base=String(fileName||'BARALHO IMPORTADO').replace(/\.[^.]+$/,'').replace(/[_-]+/g,' ').trim();return{groups:[{deck:base||'BARALHO IMPORTADO',rows:rows}],removeDecks:[],total:rows.length};
}
function parseFile(text,fileName){var p=parseTextFormat(text);return p||parseCsvFormat(text,fileName)}
function allCards(){return new Promise(function(ok,no){var r=indexedDB.open(DB,1);r.onsuccess=function(){var d=r.result,tx=d.transaction('cards','readonly'),q=tx.objectStore('cards').getAll();q.onsuccess=function(){ok(q.result||[])};q.onerror=function(){no(q.error)}};r.onerror=function(){no(r.error)}})}
function cardFront(c){return trim(c&&c.fields&&(c.fields.Frente||c.fields.Front)||c&&c.front)}
function cardBack(c){return trim(c&&c.fields&&(c.fields.Verso||c.fields.Back)||c&&c.back)}
async function importPlan(plan,status){
  if(!window.centralAnkiDeckManager||typeof window.centralAnkiDeckManager.importCards!=='function')throw new Error('Gerenciador do Anki ainda não carregou. Feche esta janela e abra novamente.');
  var cards=await allCards(),removeCount=0;
  plan.removeDecks.forEach(function(d){removeCount+=cards.filter(function(c){return c&&!c.suspended&&match(c.deck,d)}).length});
  var msg='Importar '+plan.total+' cards em '+plan.groups.length+' subbaralho'+(plan.groups.length===1?'':'s')+'?';
  if(removeCount)msg+='\n\nTambém serão removidos '+removeCount+' cards do antigo “'+plan.removeDecks.join(', ')+'”.';
  msg+='\n\nCards idênticos já existentes no mesmo subbaralho serão ignorados.';
  if(!window.confirm(msg))return{cancelled:true};
  for(var r=0;r<plan.removeDecks.length;r++){status.textContent='Removendo baralho antigo...';await window.centralAnkiDeckManager.deleteDeck(plan.removeDecks[r])}
  cards=await allCards();var existing={};cards.forEach(function(c){if(!c||c.suspended||!c.deck)return;var k=norm(c.deck)+'\u241e'+norm(cardFront(c))+'\u241f'+norm(cardBack(c));existing[k]=1});
  var imported=0,skipped=0;
  for(var i=0;i<plan.groups.length;i++){
    var g=plan.groups[i],fresh=[];
    g.rows.forEach(function(row){var k=norm(g.deck)+'\u241e'+norm(row[0])+'\u241f'+norm(row[1]);if(existing[k]){skipped++}else{existing[k]=1;fresh.push(row)}});
    if(fresh.length){status.textContent='Importando '+g.deck+' ('+(i+1)+'/'+plan.groups.length+')...';imported+=await window.centralAnkiDeckManager.importCards(g.deck,fresh)}
  }
  return{imported:imported,skipped:skipped,removed:removeCount};
}
function enhance(){
  var modal=document.getElementById('cadm-modal');if(!modal)return;var pane=modal.querySelector('[data-pane="import"]');if(!pane||pane.querySelector('[data-file-import-6687]'))return;
  var old=pane.querySelector('[data-file-import-6686]');if(old)old.remove();
  var block=document.createElement('div');block.setAttribute('data-file-import-6687','1');block.style.cssText='margin:12px 0 16px;padding:12px;border:1px solid #d6dce6;border-radius:12px;background:#f8fafc';
  block.innerHTML='<div style="font-weight:800;margin-bottom:8px">Importar arquivo organizado</div><div style="font-size:13px;margin-bottom:10px;color:#475569">Aceita um TXT com vários BARALHO: no mesmo arquivo e CSV com Frente/Verso. O TXT reorganizado pode remover o antigo FLASHCARDS REVISADOS após sua confirmação.</div><label class="cadm-action" style="display:inline-flex;align-items:center;gap:8px;cursor:pointer;background:#172033;color:#fff">📁 Selecionar arquivo<input data-anki-file type="file" accept=".txt,.csv,text/plain,text/csv" style="display:none"></label><div data-file-status style="font-weight:700;margin-top:10px"></div>';
  var note=pane.querySelector('.cadm-note');if(note&&note.nextSibling)pane.insertBefore(block,note.nextSibling);else pane.insertBefore(block,pane.firstChild);
  var input=block.querySelector('[data-anki-file]'),status=block.querySelector('[data-file-status]');
  input.addEventListener('change',async function(){var file=input.files&&input.files[0];if(!file)return;try{status.textContent='Lendo '+file.name+'...';var text=await file.text(),plan=parseFile(text,file.name);status.textContent='Preparando '+plan.total+' cards em '+plan.groups.length+' subbaralhos...';var res=await importPlan(plan,status);if(res.cancelled){status.textContent='Importação cancelada.';input.value='';return}status.textContent=res.imported+' cards importados'+(res.skipped?' · '+res.skipped+' repetidos ignorados':'')+(res.removed?' · '+res.removed+' antigos removidos':'')+'. Atualizando o Anki...';setTimeout(function(){location.reload()},900)}catch(e){status.textContent='Erro: '+(e&&e.message?e.message:String(e));input.value=''}})
}
var obs=new MutationObserver(enhance);function boot(){enhance();obs.observe(document.documentElement,{childList:true,subtree:true})}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();window.centralAnkiFileImport={version:VERSION,parseFile:parseFile};
})();