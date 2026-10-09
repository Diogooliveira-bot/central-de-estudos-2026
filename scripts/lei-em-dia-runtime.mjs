import {readFileSync} from 'node:fs';
import vm from 'node:vm';
export function leiRuntime(root,storage=new Map(),search=''){
 const html=readFileSync(new URL('tools/decorando.html',root),'utf8');
 const document={documentElement:{dataset:{}},readyState:'complete',addEventListener(){},getElementById(){return null}};
 const window={scrollTo(){},addEventListener(){}};
 const localStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)};
 const context=vm.createContext({document,window,localStorage,URLSearchParams,location:{search},setTimeout(){},clearTimeout(){}});
 for(const m of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)){
  const external=m[1].match(/src="\.\/(decorando-data-[^"?]+)(?:\?[^" ]*)?"/);
  if(external)vm.runInContext(readFileSync(new URL('tools/'+external[1],root),'utf8'),context);
  else if(m[2].includes('const TOPICS_CF')||m[2].includes('const DATA_ADM_EXTRAS'))vm.runInContext(m[2].replace(/\nrender\(\);\s*$/, '\nrender=()=>{};'),context);
 }
 return context;
}
