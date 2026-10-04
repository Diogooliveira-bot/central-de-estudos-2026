/* Apenas para a prévia de validação; removido antes da publicação. */
const validationFetch=self.fetch.bind(self);let validationOffline=false;
self.fetch=(...args)=>validationOffline?Promise.reject(new TypeError('Rede indisponível na simulação offline')):validationFetch(...args);
importScripts('/sw.js');
self.addEventListener('message',event=>{
 const type=event.data&&event.data.type;if(!type||!type.startsWith('VALIDATION_'))return;
 event.waitUntil((async()=>{
  try{
   if(type==='VALIDATION_PREPARE'){
    validationOffline=false;await prepareOffline();const cache=await caches.open(CACHE);
    const required=['/central-v119.html','/index.html?central_source=20261004-home-reading-v1','/ui/home-topnav-v1.css?v=20261004a8','/ui/home-topnav-v1.js?v=20261004a8','/ui/reading-appearance-v1.css?v=20261004r3','/ui/reading-appearance-v1.js?v=20261004r3','/assets/base-completa-symbol.png','/ui/native-study-reader.css?v=20261003fix1','/ui/cpc-native-study-reader.js?v=20261003cpcnative1','/content/cpc/m01-native-data.js?v=20261003cpcnative1'];
    const missing=[];for(const url of required)if(!await cache.match(url))missing.push(url);
    event.ports[0].postMessage({cached:(await cache.keys()).length,missing});return;
   }
   validationOffline=type==='VALIDATION_OFFLINE';event.ports[0].postMessage({offline:validationOffline});
  }catch(error){event.ports[0].postMessage({error:error.message});}
 })());
});
