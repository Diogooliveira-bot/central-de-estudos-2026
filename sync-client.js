(function(){
'use strict';
if(window.__centralSync6679)return;window.__centralSync6679=true;
var DB_NAME='central-sync-device-v1',STORE='kv';
var meta={enabled:false,secret:'',device:'',revision:0,hash:''};
var busy=false,lastCheckHash='';
var CRONO_KEY='CENTRAL_CRONOGRAMA_6M_V2',AGENDA_PREFIX='central-v6:agenda:';

function dbOpen(){return new Promise(function(resolve,reject){var r=indexedDB.open(DB_NAME,1);r.onupgradeneeded=function(){if(!r.result.objectStoreNames.contains(STORE))r.result.createObjectStore(STORE)};r.onsuccess=function(){resolve(r.result)};r.onerror=function(){reject(r.error)}})}
async function kvGet(k){var db=await dbOpen();return new Promise(function(resolve,reject){var tx=db.transaction(STORE,'readonly'),r=tx.objectStore(STORE).get(k);r.onsuccess=function(){resolve(r.result)};r.onerror=function(){reject(r.error)}})}
async function kvSet(k,v){var db=await dbOpen();return new Promise(function(resolve,reject){var tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).put(v,k);tx.oncomplete=function(){resolve()};tx.onerror=function(){reject(tx.error)}})}
async function kvDel(k){var db=await dbOpen();return new Promise(function(resolve,reject){var tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).delete(k);tx.oncomplete=function(){resolve()};tx.onerror=function(){reject(tx.error)}})}
function newDevice(){return 'device-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,10)}
function collect(){var out={};try{for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k&&k!=='__central_folder_probe__'&&k!=='__central_storage_probe__')out[k]=localStorage.getItem(k)}}catch(_){}return out}
function hashObject(obj){var s=JSON.stringify(obj),h=2166136261;for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return (h>>>0).toString(16)+'-'+s.length}
function status(msg,type){var el=document.getElementById('centralSyncStatus');if(el){el.textContent=msg;el.className='central-backup-status'+(type?' '+type:'')}var b=document.getElementById('centralSyncToggle');if(b)b.textContent=meta.enabled?'☁ Desativar neste aparelho':'☁ Ativar neste aparelho'}
async function saveMeta(){await Promise.all([kvSet('enabled',meta.enabled),kvSet('secret',meta.secret),kvSet('device',meta.device),kvSet('revision',meta.revision),kvSet('hash',meta.hash)])}
async function request(path,opt){opt=opt||{};opt.headers=Object.assign({'X-Backup-Key':meta.secret},opt.headers||{});var r=await fetch(path,opt),txt=await r.text(),j={};try{j=txt?JSON.parse(txt):{}}catch(_){j={error:txt||('HTTP '+r.status)}}if(!r.ok){var e=new Error(j.error||('HTTP '+r.status));e.status=r.status;e.body=j;throw e}return j}
function jsonObject(v){try{var x=JSON.parse(String(v||''));return x&&typeof x==='object'&&!Array.isArray(x)?x:null}catch(_){return null}}
function mergeCronogramaValue(localValue,cloudValue){
 if(localValue==null)return cloudValue;
 if(cloudValue==null)return localValue;
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
function mergeCritical(local,cloud){
 var out=Object.assign({},cloud||{}),src=local||{};
 if(Object.prototype.hasOwnProperty.call(src,CRONO_KEY))out[CRONO_KEY]=mergeCronogramaValue(src[CRONO_KEY],out[CRONO_KEY]);
 Object.keys(src).forEach(function(k){if(k.indexOf(AGENDA_PREFIX)===0)out[k]=mergeAgendaValue(src[k],out[k])});
 return out;
}
function applyCloud(payload){if(!payload||typeof payload!=='object'||Array.isArray(payload))throw new Error('cópia online inválida');localStorage.clear();Object.keys(payload).forEach(function(k){if(k&&k!=='__central_folder_probe__'&&k!=='__central_storage_probe__')localStorage.setItem(k,String(payload[k]))});try{window.dispatchEvent(new Event('central-cloud-applied'))}catch(_){}}
async function push(local,hash,base){return request('/api/sync',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({payload:local,hash:hash,baseRevision:base,deviceId:meta.device})})}
async function safetyBackup(local,note){try{await request('/api/backups',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'save',note:note,backup:{formato:'central-backup-v2',app:'Central de Estudos',versao:'v6.6.105',exportadoEm:new Date().toISOString(),origem:'sync',dados:local}})})}catch(_){}}
async function persistAnkiMigration(){
 if(!window.__centralAnkiMigrated6679)return false;
 var local=collect(),h=hashObject(local),sent=await push(local,h,meta.revision);
 meta.revision=sent.revision;meta.hash=h;lastCheckHash=h;window.__centralAnkiMigrated6679=false;return true;
}
async function sync(reason){
 if(!meta.enabled||busy||!navigator.onLine)return;busy=true;status('Sincronizando...','warn');
 try{
  var local=collect(),localHash=hashObject(local),cloud=await request('/api/sync');
  if(!cloud.exists){var first=await push(local,localHash,0);meta.revision=first.revision;meta.hash=localHash;lastCheckHash=localHash;await saveMeta();status('Sincronizado agora • primeira cópia online criada.','ok');return}
  if(cloud.revision>meta.revision){
   if(localHash!==meta.hash&&meta.revision>0)await safetyBackup(local,'Cópia automática antes de resolver conflito de sincronização');
   var cloudPayload=cloud.payload||{},merged=mergeCritical(local,cloudPayload),remoteHash=hashObject(cloudPayload);
   applyCloud(merged);meta.revision=cloud.revision;
   if(!(await persistAnkiMigration())){meta.hash=remoteHash;lastCheckHash=remoteHash}
   await saveMeta();status('Atualização recebida da nuvem sem perder os checks da agenda. Recarregando...','ok');setTimeout(function(){location.reload()},700);return
  }
  if(localHash!==meta.hash||reason==='manual'){
   try{var sent=await push(local,localHash,meta.revision);meta.revision=sent.revision;meta.hash=localHash;lastCheckHash=localHash;await saveMeta();status('Sincronizado agora.','ok')}
   catch(e){
    if(e.status===409){
     var newest=await request('/api/sync');await safetyBackup(local,'Cópia automática antes de receber alteração mais recente');
     var newestPayload=newest.payload||{},mergedNewest=mergeCritical(local,newestPayload),newestHash=hashObject(newestPayload);
     applyCloud(mergedNewest);meta.revision=newest.revision;
     if(!(await persistAnkiMigration())){meta.hash=newestHash;lastCheckHash=newestHash}
     await saveMeta();status('Conflito resolvido preservando os checks da agenda. Recarregando...','warn');setTimeout(function(){location.reload()},700);return
    }
    throw e
   }
  }else{lastCheckHash=localHash;status('Sincronizado • nenhuma alteração pendente.','ok')}
 }catch(e){status((navigator.onLine?'Falha na sincronização: ':'Sem internet: ')+e.message,'err')}finally{busy=false}
}
async function toggle(){
 if(meta.enabled){if(!confirm('Desativar a sincronização automática somente neste aparelho? Seus dados locais e backups serão mantidos.'))return;meta.enabled=false;meta.secret='';meta.revision=0;meta.hash='';await Promise.all([kvSet('enabled',false),kvDel('secret'),kvDel('revision'),kvDel('hash')]);status('Desativada neste aparelho. Os dados locais foram mantidos.','warn');return}
 var secret=(prompt('Digite a mesma chave BACKUP_SECRET usada nos backups online:')||'').trim();if(!secret)return;
 meta.secret=secret;meta.enabled=true;if(!meta.device)meta.device=newDevice();try{sessionStorage.setItem('central-backup:session-secret',secret)}catch(_){}await saveMeta();status('Conectando este aparelho...','warn');
 try{
  var cloud=await request('/api/sync');
  if(cloud.exists){
   var before=collect();await safetyBackup(before,'Antes de ativar sincronização neste aparelho');
   var initialCloud=cloud.payload||{},initialMerged=mergeCritical(before,initialCloud),initialRemoteHash=hashObject(initialCloud);
   applyCloud(initialMerged);meta.revision=cloud.revision;
   if(!(await persistAnkiMigration())){meta.hash=initialRemoteHash;lastCheckHash=initialRemoteHash}
   await saveMeta();status('Cópia online recebida sem perder os checks locais da agenda. Recarregando...','ok');setTimeout(function(){location.reload()},700)
  }else await sync('enable')
 }catch(e){meta.enabled=false;meta.secret='';await Promise.all([kvSet('enabled',false),kvDel('secret')]);status('Não foi possível ativar: '+e.message,'err')}
}
function injectUi(){
 if(document.getElementById('centralSyncStatus'))return;
 var body=document.querySelector('.central-settings-body');if(!body)return;
 var wrap=document.createElement('div');wrap.id='centralSyncPanel';wrap.innerHTML='<span class="central-setting-label" style="margin-top:16px">Sincronização entre aparelhos</span><div class="central-backup-row"><button class="central-btn-sec" id="centralSyncToggle">☁ Ativar neste aparelho</button><button class="central-btn-sec" id="centralSyncNow">↻ Sincronizar agora</button></div><div id="centralSyncStatus" class="central-backup-status">Carregando...</div><div class="central-settings-note" style="margin-top:7px"><b>Como funciona:</b> ative primeiro no aparelho com o progresso correto. Alterações continuam salvas offline e são enviadas quando a internet voltar.</div>';
 body.appendChild(wrap);document.getElementById('centralSyncToggle').onclick=toggle;document.getElementById('centralSyncNow').onclick=function(){if(!meta.enabled)status('Ative a sincronização neste aparelho primeiro.','warn');else sync('manual')};
}
function loadUpdater(){
 if(window.__centralUpdater66105||document.querySelector('script[data-central-updater]'))return;
 var s=document.createElement('script');s.src='./central-updater-v66105.js?v=66105-'+Date.now();s.async=true;s.setAttribute('data-central-updater','1');document.head.appendChild(s);
}
function observe(){if(!meta.enabled)return;var h=hashObject(collect());if(!lastCheckHash)lastCheckHash=h;if(h!==lastCheckHash){lastCheckHash=h;status(navigator.onLine?'Alteração detectada; enviando...':'Alteração salva no aparelho; aguardando internet.','warn');setTimeout(function(){sync('change')},900)}}
async function init(){
 injectUi();loadUpdater();meta.enabled=!!(await kvGet('enabled'));meta.secret=(await kvGet('secret'))||'';meta.device=(await kvGet('device'))||newDevice();meta.revision=Number((await kvGet('revision'))||0);meta.hash=(await kvGet('hash'))||'';await kvSet('device',meta.device);if(meta.secret)try{sessionStorage.setItem('central-backup:session-secret',meta.secret)}catch(_){}
 var brand=document.querySelector('.brand-copy small');if(brand)brand.textContent='v6.6.105 • Atualização manual + sincronização';var badge=document.querySelector('.central-version-v41');if(badge)badge.textContent='v6.6.105';status(meta.enabled?'Sincronização ativa neste aparelho.':'Desativada neste aparelho. Ative primeiro no aparelho que contém o progresso correto.',meta.enabled?'ok':'');if(meta.enabled)sync('startup');setInterval(observe,5000);setInterval(function(){sync('poll')},30000)
}
window.addEventListener('online',function(){if(meta.enabled)sync('online')});window.addEventListener('offline',function(){if(meta.enabled)status('Sem internet. Alterações continuam salvas neste aparelho.','warn')});document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible'&&meta.enabled)sync('visible')});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
setTimeout(loadUpdater,1200);
})();
