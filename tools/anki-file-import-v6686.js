(function(){
'use strict';
var VERSION='6686';
function trim(s){return String(s==null?'':s).trim()}
function parseTextFormat(text){
  var raw=String(text||'').replace(/^\uFEFF/,'').replace(/\r/g,'');
  var lines=raw.split('\n');
  var first=-1;
  for(var i=0;i<lines.length;i++){
    var t=trim(lines[i]);
    if(t && t.charAt(0)!=='#'){ first=i; break; }
  }
  if(first<0) throw new Error('Arquivo vazio.');
  var m=trim(lines[first]).match(/^BARALHO\s*:\s*(.+)$/i);
  if(!m) return null;
  var deck=trim(m[1]);
  if(!deck) throw new Error('O arquivo não informa o nome do baralho.');
  var rows=[];
  for(var j=first+1;j<lines.length;j++){
    var line=trim(lines[j]);
    if(!line || line.charAt(0)==='#') continue;
    var pos=line.indexOf(';;');
    if(pos<0) throw new Error('Linha '+(j+1)+' inválida. O formato deve ser: Pergunta ;; Resposta');
    var front=trim(line.slice(0,pos));
    var back=trim(line.slice(pos+2));
    if(!front || !back) throw new Error('Linha '+(j+1)+' está sem pergunta ou resposta.');
    rows.push([front,back]);
  }
  if(!rows.length) throw new Error('Nenhum card válido foi encontrado.');
  return {deck:deck,rows:rows};
}
function parseCsvLine(line,delimiter){
  var out=[],cur='',quote=false;
  for(var i=0;i<line.length;i++){
    var ch=line[i];
    if(ch==='"'){
      if(quote && line[i+1]==='"'){cur+='"';i++;}
      else quote=!quote;
    }else if(ch===delimiter && !quote){out.push(cur);cur='';}
    else cur+=ch;
  }
  out.push(cur);
  return out;
}
function parseCsvFormat(text,fileName){
  var raw=String(text||'').replace(/^\uFEFF/,'').replace(/\r/g,'');
  var lines=raw.split('\n').filter(function(x){return trim(x)!==''});
  if(lines.length<2) throw new Error('CSV sem cards.');
  var delim=lines[0].indexOf(';')>=0?';':',';
  var header=parseCsvLine(lines[0],delim).map(function(x){return trim(x).toLocaleLowerCase('pt-BR')});
  var fi=header.indexOf('frente'), bi=header.indexOf('verso');
  if(fi<0) fi=header.indexOf('front');
  if(bi<0) bi=header.indexOf('back');
  if(fi<0 || bi<0) throw new Error('CSV precisa ter colunas Frente e Verso.');
  var rows=[];
  for(var i=1;i<lines.length;i++){
    var cols=parseCsvLine(lines[i],delim);
    var f=trim(cols[fi]), b=trim(cols[bi]);
    if(f && b) rows.push([f,b]);
  }
  if(!rows.length) throw new Error('Nenhum card válido encontrado no CSV.');
  var base=String(fileName||'BARALHO IMPORTADO').replace(/\.[^.]+$/,'').replace(/[_-]+/g,' ').trim();
  return {deck:base||'BARALHO IMPORTADO',rows:rows};
}
function parseFile(text,fileName){
  var p=parseTextFormat(text);
  if(p) return p;
  return parseCsvFormat(text,fileName);
}
function enhance(){
  var modal=document.getElementById('cadm-modal');
  if(!modal) return;
  var pane=modal.querySelector('[data-pane="import"]');
  if(!pane || pane.querySelector('[data-file-import-6686]')) return;
  var block=document.createElement('div');
  block.setAttribute('data-file-import-6686','1');
  block.style.cssText='margin:12px 0 16px;padding:12px;border:1px solid #d6dce6;border-radius:12px;background:#f8fafc';
  block.innerHTML='<div style="font-weight:800;margin-bottom:8px">Importar arquivo diretamente</div><div style="font-size:13px;margin-bottom:10px;color:#475569">Aceita o arquivo TXT criado para a Central e também CSV com colunas Frente e Verso.</div><label class="cadm-action" style="display:inline-flex;align-items:center;gap:8px;cursor:pointer;background:#172033;color:#fff">📁 Selecionar arquivo<input data-anki-file type="file" accept=".txt,.csv,text/plain,text/csv" style="display:none"></label><div data-file-status style="font-weight:700;margin-top:10px"></div>';
  var note=pane.querySelector('.cadm-note');
  if(note && note.nextSibling) pane.insertBefore(block,note.nextSibling); else pane.insertBefore(block,pane.firstChild);
  var input=block.querySelector('[data-anki-file]'), status=block.querySelector('[data-file-status]');
  input.addEventListener('change',async function(){
    var file=input.files&&input.files[0];
    if(!file) return;
    try{
      status.textContent='Lendo '+file.name+'...';
      var text=await file.text();
      var p=parseFile(text,file.name);
      if(!window.centralAnkiDeckManager || typeof window.centralAnkiDeckManager.importCards!=='function') throw new Error('Gerenciador do Anki ainda não carregou. Feche esta janela e abra novamente.');
      if(!window.confirm('Importar '+p.rows.length+' cards para “'+p.deck+'”?')){ status.textContent='Importação cancelada.'; input.value=''; return; }
      status.textContent='Importando '+p.rows.length+' cards...';
      var n=await window.centralAnkiDeckManager.importCards(p.deck,p.rows);
      status.textContent=n+' cards importados com sucesso. Atualizando o Anki...';
      setTimeout(function(){location.reload()},700);
    }catch(e){
      status.textContent='Erro: '+(e&&e.message?e.message:String(e));
      input.value='';
    }
  });
}
var obs=new MutationObserver(enhance);
function boot(){enhance();obs.observe(document.documentElement,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
window.centralAnkiFileImport={version:VERSION,parseFile:parseFile};
})();