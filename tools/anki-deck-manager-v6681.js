(function(){
'use strict';
var VERSION='6681';
var STYLE_ID='central-anki-deck-manager-style';
var MODAL_ID='central-anki-deck-manager-modal';

function clone(v){return JSON.parse(JSON.stringify(v));}
function siteData(){
  var d=null;
  try{d=window.ANKI_SITE_DATA||null;}catch(_){}
  if(!d){try{if(typeof SITE_DATA!=='undefined')d=SITE_DATA;}catch(_){}}
  return d&&Array.isArray(d.cards)?d:null;
}
function allDecks(){
  var d=siteData(), out={};
  if(d){
    (d.decks||[]).forEach(function(x){if(typeof x==='string'&&x.trim())out[x.trim()]=1;});
    (d.cards||[]).forEach(function(c){if(c&&c.deck)out[String(c.deck).trim()]=1;});
  }
  try{
    for(var i=0;i<localStorage.length;i++){
      var raw=localStorage.getItem(localStorage.key(i));
      if(!raw)continue;
      var v;try{v=JSON.parse(raw);}catch(_){continue;}
      collectDecks(v,out,0);
    }
  }catch(_){}
  return Object.keys(out).sort(function(a,b){return a.localeCompare(b,'pt-BR');});
}
function collectDecks(v,out,depth){
  if(!v||typeof v!=='object'||depth>5)return;
  if(Array.isArray(v)){
    v.forEach(function(x){if(x&&typeof x==='object'&&x.deck)out[String(x.deck).trim()]=1; else if(typeof x==='object')collectDecks(x,out,depth+1);});
    return;
  }
  if(Array.isArray(v.decks))v.decks.forEach(function(x){if(typeof x==='string'&&x.trim())out[x.trim()]=1;});
  if(Array.isArray(v.cards))v.cards.forEach(function(c){if(c&&c.deck)out[String(c.deck).trim()]=1;});
  Object.keys(v).forEach(function(k){if(k!=='cards'&&k!=='decks')collectDecks(v[k],out,depth+1);});
}
function isDeckOrChild(deck,target){
  deck=String(deck||'').trim(); target=String(target||'').trim();
  return deck===target||deck.indexOf(target+'::')===0;
}
function recalc(obj){
  if(obj&&Array.isArray(obj.cards)){
    if('totalCards' in obj)obj.totalCards=obj.cards.length;
    if(Array.isArray(obj.decks)){
      var set={};
      obj.cards.forEach(function(c){if(c&&c.deck)set[c.deck]=1;});
      obj.decks=obj.decks.filter(function(d){return set[d];});
      Object.keys(set).forEach(function(d){if(obj.decks.indexOf(d)<0)obj.decks.push(d);});
      obj.decks.sort(function(a,b){return a.localeCompare(b,'pt-BR');});
      if('deckCount' in obj)obj.deckCount=obj.decks.length;
    }
  }
}
function mutateObject(obj,depth,fn){
  if(!obj||typeof obj!=='object'||depth>5)return false;
  var changed=false;
  if(Array.isArray(obj)){
    for(var i=0;i<obj.length;i++)if(obj[i]&&typeof obj[i]==='object'&&mutateObject(obj[i],depth+1,fn))changed=true;
    return changed;
  }
  if(Array.isArray(obj.cards)){
    if(fn(obj))changed=true;
    recalc(obj);
  }
  Object.keys(obj).forEach(function(k){
    if(k==='cards'||k==='decks')return;
    if(obj[k]&&typeof obj[k]==='object'&&mutateObject(obj[k],depth+1,fn))changed=true;
  });
  return changed;
}
function persistEverywhere(fn){
  var changed=false,d=siteData();
  if(d&&fn(d)){recalc(d);changed=true;}
  try{
    var keys=[];for(var i=0;i<localStorage.length;i++)keys.push(localStorage.key(i));
    keys.forEach(function(k){
      if(!k)return;
      var raw=localStorage.getItem(k);if(!raw)return;
      var v;try{v=JSON.parse(raw);}catch(_){return;}
      var before;try{before=JSON.stringify(v);}catch(_){return;}
      var localChanged=false;
      if(v&&typeof v==='object'&&!Array.isArray(v)&&v.deck&&v.fields){
        var box={cards:[v],decks:[v.deck]};
        localChanged=fn(box);
        if(localChanged){
          if(box.cards.length)localStorage.setItem(k,JSON.stringify(box.cards[0]));
          else localStorage.removeItem(k);
          changed=true;
        }
        return;
      }
      if(mutateObject(v,0,fn))localChanged=true;
      if(localChanged){
        var after=JSON.stringify(v);
        if(after!==before)localStorage.setItem(k,after);
        changed=true;
      }
    });
  }catch(_){}
  try{localStorage.setItem('central:anki:deck-manager-version',VERSION);}catch(_){}
  return changed;
}
function deleteDeck(target){
  var removed=0;
  persistEverywhere(function(obj){
    var before=obj.cards.length;
    obj.cards=obj.cards.filter(function(c){return !isDeckOrChild(c&&c.deck,target);});
    var diff=before-obj.cards.length;
    if(diff){removed=Math.max(removed,diff);}
    if(Array.isArray(obj.decks))obj.decks=obj.decks.filter(function(d){return !isDeckOrChild(d,target);});
    return diff>0;
  });
  return removed;
}
function firstTemplate(){
  var d=siteData();
  if(d&&d.cards&&d.cards.length)return clone(d.cards[0]);
  return null;
}
function setFields(card,front,back){
  var f=card.fields&&typeof card.fields==='object'?card.fields:{};
  var keys=Object.keys(f), frontKey=null, backKey=null;
  ['Frente','Front','Pergunta','Question'].some(function(k){if(k in f){frontKey=k;return true;}return false;});
  ['Verso','Back','Resposta','Answer'].some(function(k){if(k in f){backKey=k;return true;}return false;});
  if(!frontKey)frontKey=keys[0]||'Frente';
  if(!backKey)backKey=keys.filter(function(k){return k!==frontKey;})[0]||'Verso';
  card.fields={};card.fields[frontKey]=front;card.fields[backKey]=back;
}
function makeCard(deck,front,back,index,template){
  var c=template?clone(template):{};
  c.id='user-'+Date.now().toString(36)+'-'+index+'-'+Math.random().toString(36).slice(2,9);
  c.deck=deck;
  setFields(c,front,back);
  c.source='importado-texto';
  c.tags='importado usuario';
  if('stats' in c)delete c.stats;
  if('suspended' in c)c.suspended=false;
  if('createdAt' in c)c.createdAt=new Date().toISOString();
  return c;
}
function importCards(deck,rows){
  var template=firstTemplate();
  var cards=rows.map(function(r,i){return makeCard(deck,r[0],r[1],i,template);});
  persistEverywhere(function(obj){
    if(!Array.isArray(obj.cards))return false;
    Array.prototype.push.apply(obj.cards,clone(cards));
    if(Array.isArray(obj.decks)&&obj.decks.indexOf(deck)<0)obj.decks.push(deck);
    return true;
  });
  return cards.length;
}
function parseText(text){
  var lines=String(text||'').replace(/\r/g,'').split('\n').map(function(x){return x.trim();}).filter(Boolean);
  if(!lines.length)throw new Error('Cole o conteúdo do baralho.');
  var m=lines[0].match(/^BARALHO\s*:\s*(.+)$/i);
  if(!m)throw new Error('A primeira linha deve ser: BARALHO: Nome do baralho');
  var deck=m[1].trim();if(!deck)throw new Error('Informe o nome do baralho.');
  var rows=[];
  lines.slice(1).forEach(function(line,n){
    if(/^#/.test(line))return;
    var parts=line.indexOf(';;')>=0?line.split(';;'):(line.indexOf('\t')>=0?line.split('\t'):null);
    if(!parts||parts.length<2)throw new Error('Linha '+(n+2)+' inválida. Use: Pergunta ;; Resposta');
    var front=parts.shift().trim(),back=parts.join(';;').trim();
    if(!front||!back)throw new Error('Linha '+(n+2)+' está sem pergunta ou resposta.');
    rows.push([front,back]);
  });
  if(!rows.length)throw new Error('Nenhum card válido encontrado.');
  return {deck:deck,rows:rows};
}
function css(){
  if(document.getElementById(STYLE_ID))return;
  var s=document.createElement('style');s.id=STYLE_ID;
  s.textContent='.cadm-btn{position:fixed;right:16px;bottom:18px;z-index:2147483000;border:0;border-radius:14px;padding:12px 16px;background:#111827;color:#fff;font:600 14px system-ui;box-shadow:0 8px 24px #0003}.cadm-back{position:fixed;inset:0;z-index:2147483001;background:#0008;display:flex;align-items:center;justify-content:center;padding:16px}.cadm-box{width:min(680px,100%);max-height:88vh;overflow:auto;background:#fff;color:#111;border-radius:18px;padding:20px;font:14px/1.45 system-ui;box-shadow:0 20px 60px #0005}.cadm-head{display:flex;justify-content:space-between;gap:12px;align-items:center}.cadm-head h2{margin:0;font-size:20px}.cadm-close{border:0;background:#eee;border-radius:10px;padding:8px 11px}.cadm-tabs{display:flex;gap:8px;margin:18px 0}.cadm-tabs button,.cadm-action{border:1px solid #d1d5db;background:#f9fafb;border-radius:10px;padding:10px 12px;font-weight:600}.cadm-tabs button.active{background:#111827;color:#fff}.cadm-pane{display:none}.cadm-pane.active{display:block}.cadm-box textarea,.cadm-box select{width:100%;box-sizing:border-box;border:1px solid #d1d5db;border-radius:10px;padding:11px;background:#fff;color:#111}.cadm-box textarea{min-height:260px;font:13px/1.4 ui-monospace,monospace;resize:vertical}.cadm-note{background:#f3f4f6;border-radius:10px;padding:10px;margin:10px 0}.cadm-danger{background:#b91c1c;color:#fff;border-color:#b91c1c}.cadm-status{margin-top:10px;font-weight:600}';
  document.head.appendChild(s);
}
function modal(){
  css();
  var old=document.getElementById(MODAL_ID);if(old)old.remove();
  var back=document.createElement('div');back.id=MODAL_ID;back.className='cadm-back';
  var decks=allDecks();
  back.innerHTML='<div class="cadm-box"><div class="cadm-head"><h2>Gerenciar baralhos</h2><button class="cadm-close">Fechar</button></div><div class="cadm-tabs"><button data-tab="import" class="active">Importar baralho</button><button data-tab="delete">Excluir baralho</button></div><section class="cadm-pane active" data-pane="import"><div class="cadm-note"><b>Formato:</b><br>BARALHO: Direito Constitucional<br>Pergunta 1 ;; Resposta 1<br>Pergunta 2 ;; Resposta 2</div><textarea id="cadm-text" placeholder="BARALHO: Nome do baralho\nPergunta ;; Resposta"></textarea><p><button class="cadm-action" id="cadm-import">Importar</button></p><div class="cadm-status" id="cadm-import-status"></div></section><section class="cadm-pane" data-pane="delete"><p>Escolha o baralho. Subbaralhos dentro dele também serão removidos.</p><select id="cadm-deck"><option value="">Selecione...</option>'+decks.map(function(d){return '<option value="'+escapeHtml(d)+'">'+escapeHtml(d)+'</option>';}).join('')+'</select><p><button class="cadm-action cadm-danger" id="cadm-delete">Excluir baralho</button></p><div class="cadm-status" id="cadm-delete-status"></div></section></div>';
  document.body.appendChild(back);
  back.querySelector('.cadm-close').onclick=function(){back.remove();};
  back.onclick=function(e){if(e.target===back)back.remove();};
  back.querySelectorAll('[data-tab]').forEach(function(btn){btn.onclick=function(){var t=btn.getAttribute('data-tab');back.querySelectorAll('[data-tab]').forEach(function(b){b.classList.toggle('active',b===btn);});back.querySelectorAll('[data-pane]').forEach(function(p){p.classList.toggle('active',p.getAttribute('data-pane')===t);});};});
  back.querySelector('#cadm-import').onclick=function(){
    var st=back.querySelector('#cadm-import-status');st.textContent='';
    try{var p=parseText(back.querySelector('#cadm-text').value);var n=importCards(p.deck,p.rows);st.textContent=n+' cards importados em “'+p.deck+'”. Atualizando...';setTimeout(function(){location.reload();},700);}catch(e){st.textContent=e.message||String(e);}
  };
  back.querySelector('#cadm-delete').onclick=function(){
    var sel=back.querySelector('#cadm-deck'),st=back.querySelector('#cadm-delete-status'),d=sel.value;st.textContent='';
    if(!d){st.textContent='Selecione um baralho.';return;}
    if(!window.confirm('Excluir “'+d+'” e todos os cards desse baralho? Esta ação não pode ser desfeita.'))return;
    var n=deleteDeck(d);st.textContent='Baralho excluído ('+n+' cards removidos). Atualizando...';setTimeout(function(){location.reload();},700);
  };
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function addButton(){
  if(document.getElementById('central-anki-deck-manager-button'))return;
  var b=document.createElement('button');b.id='central-anki-deck-manager-button';b.className='cadm-btn';b.textContent='⚙ Baralhos';b.onclick=modal;document.body.appendChild(b);
}
window.centralAnkiDeckManager={version:VERSION,open:modal,parseText:parseText,deleteDeck:deleteDeck,importCards:importCards};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(addButton,250);});else setTimeout(addButton,250);
})();
