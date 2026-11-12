/* Estado local sincronizável pertence à conta autenticada neste navegador. */
const DB_NAME='central-sync-device-v2', STORE='kv', OWNER_KEY='central-v6:local-owner';
const OBJECTIVE_PREF_KEYS=[
  'central-v6:study-objective:v1',
  'central-v6:study-objective:pending:v1',
  'central-v6:free-study-subjects:v1',
];
// O objetivo e as matérias livres têm sincronização própria em /api/objective.
// Cópias de preferências permanecem separadas por usuário neste dispositivo.
function collectObjectivePrefs(){
  const prefs={};
  for(const key of OBJECTIVE_PREF_KEYS){
    const value=localStorage.getItem(key);
    if(value!==null)prefs[key]=value;
  }
  return prefs;
}
function replaceObjectivePrefs(snapshot){
  for(const key of OBJECTIVE_PREF_KEYS)localStorage.removeItem(key);
  if(!snapshot||typeof snapshot!=='object'||Array.isArray(snapshot))return;
  for(const key of OBJECTIVE_PREF_KEYS){
    if(Object.prototype.hasOwnProperty.call(snapshot,key))localStorage.setItem(key,String(snapshot[key]));
  }
}

export function isSyncKey(key){
  return !!key && key!==OWNER_KEY && key!=='__central_folder_probe__' &&
    key!=='__central_storage_probe__' && !/^central-v6:pt(?::|-)/.test(key) &&
    !/^central-v6:study-objective(?::|-)/.test(key) &&
    !/^central-v6:free-study-subjects(?::|-)/.test(key) &&
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
async function snapshotFor(uid,suffix='local-snapshot'){
  const db=await openDb();
  return new Promise((resolve,reject)=>{
    const tx=db.transaction(STORE,'readonly'),request=tx.objectStore(STORE).get('u:'+uid+':'+suffix);
    request.onsuccess=()=>resolve(request.result);
    request.onerror=()=>reject(request.error);
    tx.oncomplete=()=>db.close();
  });
}
async function saveSnapshotFor(uid,snapshot,suffix='local-snapshot'){
  const db=await openDb();
  return new Promise((resolve,reject)=>{
    const tx=db.transaction(STORE,'readwrite');
    tx.objectStore(STORE).put(snapshot,'u:'+uid+':'+suffix);
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
    // Nunca mostrar as preferências privadas do usuário anterior ao entrar em outra conta.
    await saveSnapshotFor(owner,collectSyncStorage());
    await saveSnapshotFor(owner,collectObjectivePrefs(),'objective-prefs');
    const target=await snapshotFor(uid);
    const prefTarget=await snapshotFor(uid,'objective-prefs');
    clearSyncStorage();
    replaceObjectivePrefs(prefTarget);
    if(target)applySnapshot(target);
  }else{
    // Instalações anteriores não registravam proprietário; preserve o estado existente.
    await saveSnapshotFor(uid,collectSyncStorage());
    await saveSnapshotFor(uid,collectObjectivePrefs(),'objective-prefs');
  }
  localStorage.setItem(OWNER_KEY,uid);
}
