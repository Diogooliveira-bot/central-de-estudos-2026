(function(){
'use strict';
if(window.__centralUserSyncV1)return;window.__centralUserSyncV1=true;

var DB_NAME='central-sync-device-v2',STORE='kv',LOCAL_OWNER_KEY='central-v6:local-owner';
var busy=false,lastCheckHash='',timers=[];
var CRONO_KEY='CENTRAL_CRONOGRAMA_6M_V2',AGENDA_PREFIX='central-v6:agenda:';
var user=window.BASE_COMPLETA_USER||null;
var userId=String(window.__BASE_COMPLETA_USER_ID__||user&&user.id||'');
var meta={device:'',revision:0,hash:''};

function currentVersion(){return String(window.CENTRAL_VERSION||'6.6.120').replace(/^v/,'')}
function mkFor(uid,k){return 'u:'+uid+':'+k}
function mk(k){return mkFor(userId,k)}
function dbOpen(){return new Promise(function(resolve,reject){var r=indexedDB.open(DB_NAME,1);r.onupgradeneeded=function(){if(!r.result.objectStoreNames.contains(STORE))r.result.createObjectStore(STORE)};r.onsuccess=function(){resolve(r.result)};r.onerror=function(){reject(r.error)}})}
async function kvGet(k){var db=await dbOpen();return new Promise(function(resolve,reject){var tx=db.transaction(STORE,'readonly'),r=tx.objectStore(STORE).get(mk(k));r.onsuccess=function(){resolve(r.result)};r.onerror=function(){reject(r.error)}})}
async function kvSet(k,v){var db=await dbOpen();return new Promise(function(resolve,reject){var tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).put(v,mk(k));tx.oncomplete=function(){resolve()};tx.onerror=function(){reject(tx.error)}})}
async function kvGetFor(uid,k){var db=await dbOpen();return new Promise(function(resolve,reject){var tx=db.transaction(STORE,'readonly'),r=tx.objectStore(STORE).get(mkFor(uid,k));r.onsuccess=function(){resolve(r.result)};r.onerror=function(){reject(r.error)}})}
async function kvSetFor(uid,k,v){var db=await dbOpen();return new Promise(function(resolve,reject){var tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).put(v,mkFor(uid,k));tx.oncomplete=function(){resolve()};tx.onerror=function(){reject(tx.error)}})}
function newDevice(){return 'device-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,10)}
function isPortugueseDataKey(k){k=String(k||'');return /^central-v6:pt(?::|-)/.test(k)||/^dominio_portugues/i.test(k)}
function isSyncKey(k){return !!k&&k!=='__central_folder_probe__'&&k!=='__central_storage_probe__'&&k!==LOCAL_OWNER_KEY&&!isPortugueseDataKey(k)}
function sanitizePayload(payload){var out={};if(!payload||typeof payload!=='object'||Array.isArray(payload))return out;Object.keys(payload).forEach(function(k){if(isSyncKey(k))out[k]=payload[k]});return out}
function collect(){var out={};try{for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(isSyncKey(k))out[k]=localStorage.getItem(k)}}catch(_){}return out}
function clearSyncStorage(){try{var keys=[];for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(isSyncKey(k))keys.push(k)}keys.forEach(function(k){localStorage.removeItem(k)})}catch(_){}}
function hashObject(obj){var s=JSON.stringify(obj),h=2166136261;for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return (h>>>0).toString(16)+'-'+s.length}
function status(msg,type){var el=document.getElementById('centralSyncStatus');if(el){el.textContent=msg;el.className='central-backup-status'+(type?' '+type:'')}}
async function saveMeta(){await Promise.all([kvSet('device',meta.device),kvSet('revision',meta.revision),kvSet('hash',meta.hash),kvSet('local-snapshot',collect())])}
async function request(path,opt){opt=opt||{};var r=await fetch(path,opt),txt=await r.text(),j={};try{j=txt?JSON.parse(txt):{}}catch(_){j={error:txt||('HTTP '+r.status)}}if(r.status===401){location.replace('/login.html?next='+encodeURIComponent(location.pathname+location.search));throw new Error('Sessão expirada')}if(!r.ok){var e=new Error(j.error||('HTTP '+r.status));e.status=r.status;e.body=j;throw e}return j}
function jsonObject(v){try{var x=JSON.parse(String(v||''));return x&&typeof x==='object'&&!Array.isArray(x)?x:null}catch(_){return null}}
function mergeCronogramaValue(localValue,cloudValue){
 if(localValue==null)return cloudValue;if(cloudValue==null)return localValue;
 var l=jsonObject(localValue),c=jsonObject(cloudValue);if(!l||!c)return localValue;
 if(l.version&&c.version&&l.version!==c.version)return cloudValue;
 var out=Object.assign({},c,l);out.version=c.version||l.version;
 out.completed=Object.assign({},c.completed&&typeof c.completed==='object'?c.completed:{},l.completed&&typeof l.completed==='object'?l.completed:{});
 var map={};(Array.isArray(c.reinforce)?c.reinforce:[]).forEach(function(x){if(x&&x.id)map[x.id]=x});(Array.isArray(l.reinforce)?l.reinforce:[]).forEach(function(x){if(x&&x.id)map[x.id]=x});out.reinforce=Object.keys(map).map(function(k){return map[k]});
 out.selected=l.selected!=null?l.selected:(c.selected!=null?c.selected:null);
 try{return JSON.stringify(out)}catch(_){return localValue}
}
function mergeAgendaValue(localValue,cloudValue){
 if(localValue==null)return cloudValue;if(cloudValue==null)return localValue;
 try{
  var l=JSON.parse(localValue),c=JSON.parse(cloudValue);
  if(Array.isArray(l)&&Array.isArray(c))return localValue;
  if(l&&c&&typeof l==='object'&&typeof c==='object'&&!Array.isArray(l)&&!Array.isArray(c))return JSON.stringify(Object.assign({},c,l));
 }catch(_){}
 return localValue;
}
function mergePayload(local,cloud,preferLocal){
 var src=sanitizePayload(local||{}),remote=sanitizePayload(cloud||{});
 var out=preferLocal?Object.assign({},remote,src):Object.assign({},src,remote);
 if(Object.prototype.hasOwnProperty.call(src,CRONO_KEY))out[CRONO_KEY]=mergeCronogramaValue(src[CRONO_KEY],out[CRONO_KEY]);
 Object.keys(src).forEach(function(k){if(k.indexOf(AGENDA_PREFIX)===0)out[k]=mergeAgendaValue(src[k],out[k])});
 return out;
}
function applySnapshot(payload){
 if(!payload||typeof payload!=='object'||Array.isArray(payload))throw new Error('cópia inválida');
 payload=sanitizePayload(payload);clearSyncStorage();
 Object.keys(payload).forEach(function(k){localStorage.setItem(k,String(payload[k]))});
}
function applyCloud(payload){
 applySnapshot(payload);
 try{window.dispatchEvent(new Event('central-cloud-applied'))}catch(_){}
}
async function prepareLocalUserState(){
 var owner='';try{owner=String(localStorage.getItem(LOCAL_OWNER_KEY)||'')}catch(_){}
 if(owner===userId)return;
 if(owner&&owner!==userId){
  await kvSetFor(owner,'local-snapshot',collect());
  var target=await kvGetFor(userId,'local-snapshot');
  clearSyncStorage();
  if(target&&typeof target==='object')applySnapshot(target);
  try{localStorage.setItem(LOCAL_OWNER_KEY,userId)}catch(_){}
  return;
 }
 await kvSetFor(userId,'local-snapshot',collect());
 try{localStorage.setItem(LOCAL_OWNER_KEY,userId)}catch(_){}
}
async function push(local,hash,base){return request('/api/sync',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({payload:local,hash:hash,baseRevision:base,deviceId:meta.device})})}
async function safetyBackup(local,note){try{await request('/api/backups',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'save',note:note,backup:{formato:'central-backup-v3-user',app:'Base Completa',versao:'v'+currentVersion(),exportadoEm:new Date().toISOString(),origem:'sync',userId:userId,dados:local}})})}catch(_){}}

async function sync(reason){
 if(!userId||busy||!navigator.onLine)return;
 busy=true;status('Sincronizando sua conta...','warn');
 try{
  var local=collect(),localHash=hashObject(local),cloud=await request('/api/sync');
  if(!cloud.exists){
   var first=await push(local,localHash,0);
   meta.revision=first.revision;meta.hash=localHash;lastCheckHash=localHash;await saveMeta();
   status('Conta sincronizada • primeira cópia criada.','ok');return;
  }
  if(cloud.revision>meta.revision){
   if(localHash!==meta.hash&&meta.revision>0)await safetyBackup(local,'Cópia automática antes de receber dados mais recentes');
   var cloudPayload=sanitizePayload(cloud.payload||{}),hasLocalChanges=(localHash!==meta.hash&&meta.revision>0);
   var merged=mergePayload(local,cloudPayload,hasLocalChanges),remoteHash=hashObject(cloudPayload);
   applyCloud(merged);meta.revision=cloud.revision;meta.hash=hasLocalChanges?hashObject(merged):remoteHash;lastCheckHash=meta.hash;await saveMeta();
   if(hasLocalChanges){var sent=await push(merged,meta.hash,meta.revision);meta.revision=sent.revision;await saveMeta()}
   status('Sua conta recebeu as alterações mais recentes.','ok');return;
  }
  if(localHash!==meta.hash||reason==='manual'){
   try{
    var sent2=await push(local,localHash,meta.revision);meta.revision=sent2.revision;meta.hash=localHash;lastCheckHash=localHash;await saveMeta();status('Sua conta está sincronizada.','ok');
   }catch(e){
    if(e.status===409){meta.revision=0;meta.hash='';await saveMeta();return sync('conflict')}
    throw e;
   }
  }else{lastCheckHash=localHash;status('Sincronizado • nenhuma alteração pendente.','ok')}
 }catch(e){status((navigator.onLine?'Falha na sincronização: ':'Sem internet: ')+e.message,'err')}
 finally{busy=false}
}

function injectUi(){
 if(document.getElementById('centralSyncStatus'))return;
 var body=document.querySelector('.central-settings-body');if(!body)return;
 var wrap=document.createElement('div');wrap.id='centralSyncPanel';
 wrap.innerHTML='<span class="central-setting-label" style="margin-top:16px">Sincronização da conta</span><div class="central-backup-row"><button class="central-btn-sec" id="centralSyncNow">↻ Sincronizar agora</button></div><div id="centralSyncStatus" class="central-backup-status">Preparando...</div><div class="central-settings-note" style="margin-top:7px"><b>Conta atual:</b> '+String(user&&user.name||user&&user.email||'Usuário')+'. Seu progresso é separado dos demais usuários e sincroniza automaticamente quando houver internet.</div>';
 body.appendChild(wrap);
 document.getElementById('centralSyncNow').onclick=function(){sync('manual')};
}
function observe(){var h=hashObject(collect());if(!lastCheckHash)lastCheckHash=h;if(h!==lastCheckHash){lastCheckHash=h;status(navigator.onLine?'Alteração detectada; salvando na sua conta...':'Alteração salva neste aparelho; aguardando internet.','warn');setTimeout(function(){sync('change')},900)}}

async function init(){
 if(!userId){
  try{var r=await fetch('/api/auth?action=me',{cache:'no-store'}),j=await r.json();if(j&&j.authenticated&&j.user){user=j.user;userId=String(j.user.id||'')}}catch(_){}
 }
 if(!userId)return;
 await prepareLocalUserState();
 injectUi();
 meta.device=(await kvGet('device'))||newDevice();
 meta.revision=Number((await kvGet('revision'))||0);
 meta.hash=(await kvGet('hash'))||'';
 await kvSet('device',meta.device);
 var version=currentVersion(),brand=document.querySelector('.brand-copy small'),badge=document.querySelector('.central-version-v41');
 if(brand)brand.textContent='v'+version+' • conta '+(user&&user.name||'sincronizada');
 if(badge)badge.textContent='v'+version;
 status(navigator.onLine?'Sincronização da conta ativa.':'Sem internet. Seus dados continuam separados neste aparelho.',navigator.onLine?'ok':'warn');
 sync('startup');
 timers.push(setInterval(observe,15000));
 timers.push(setInterval(function(){sync('poll')},120000));
}

window.addEventListener('online',function(){status('Internet restaurada; sincronizando...','warn');sync('online')});
window.addEventListener('offline',function(){status('Sem internet. Alterações ficam salvas somente na sua conta neste aparelho até reconectar.','warn')});
document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible')sync('visible')});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
