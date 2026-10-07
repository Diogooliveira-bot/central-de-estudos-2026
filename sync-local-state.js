/* Estado local sincronizável pertence à conta autenticada neste navegador. */
const DB_NAME='central-sync-device-v2', STORE='kv', OWNER_KEY='central-v6:local-owner';

export function isSyncKey(key){
  return !!key && key!==OWNER_KEY && key!=='__central_folder_probe__' &&
    key!=='__central_storage_probe__' && !/^central-v6:pt(?::|-)/.test(key) &&
    !/^dominio_portugues/i.test(key);
}
export function collectSyncStorage(){
  const snapshot={};
  for(let i=0;i<localStorage.length;i++){
    const key=localStorage.key(i);
    if(isSyncKey(key))snapshot[key]=localStorage.getItem(key);
  }
  return snapshot;
}
export function clearSyncStorage(){
  const keys=[];
  for(let i=0;i<localStorage.length;i++){
    const key=localStorage.key(i);
    if(isSyncKey(key))keys.push(key);
  }
  keys.forEach(key=>localStorage.removeItem(key));
}
export function applySnapshot(snapshot){
  if(!snapshot || typeof snapshot!=='object' || Array.isArray(snapshot))throw new Error('Cópia local inválida');
  clearSyncStorage();
  for(const [key,value] of Object.entries(snapshot))if(isSyncKey(key))localStorage.setItem(key,String(value));
}
function openDb(){
  return new Promise((resolve,reject)=>{
    const request=indexedDB.open(DB_NAME,1);
    request.onupgradeneeded=()=>{if(!request.result.objectStoreNames.contains(STORE))request.result.createObjectStore(STORE)};
    request.onsuccess=()=>resolve(request.result);
    request.onerror=()=>reject(request.error);
  });
}
async function snapshotFor(uid){
  const db=await openDb();
  return new Promise((resolve,reject)=>{
    const tx=db.transaction(STORE,'readonly'),request=tx.objectStore(STORE).get('u:'+uid+':local-snapshot');
    request.onsuccess=()=>resolve(request.result);
    request.onerror=()=>reject(request.error);
    tx.oncomplete=()=>db.close();
  });
}
async function saveSnapshotFor(uid,snapshot){
  const db=await openDb();
  return new Promise((resolve,reject)=>{
    const tx=db.transaction(STORE,'readwrite');
    tx.objectStore(STORE).put(snapshot,'u:'+uid+':local-snapshot');
    tx.oncomplete=()=>{db.close();resolve()};
    tx.onerror=()=>{db.close();reject(tx.error)};
  });
}
export async function prepareLocalUserState(uid){
  uid=String(uid||'');
  if(!uid)throw new Error('Conta local não identificada');
  const owner=String(localStorage.getItem(OWNER_KEY)||'');
  if(owner===uid)return;
  if(owner){
    await saveSnapshotFor(owner,collectSyncStorage());
    const target=await snapshotFor(uid);
    clearSyncStorage();
    if(target)applySnapshot(target);
  }else{
    // Instalações anteriores não registravam proprietário; preserve o estado existente.
    await saveSnapshotFor(uid,collectSyncStorage());
  }
  localStorage.setItem(OWNER_KEY,uid);
}
