import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {loadModules,occurrences,references} from '../scripts/audit-civil-law-references.mjs';
const modules=loadModules();
test('every operative article cited in all 15 modules has literal law',()=>{
 for(const [n,m]of Object.entries(modules)){
  const dom=new JSDOM(m.html),d=dom.window.document;
  const keys=new Set([...d.querySelectorAll('[data-law-key]')].map(x=>x.dataset.lawKey));
  if(+n===4)for(const x of d.querySelectorAll('.law-article[id^="art-"]'))keys.add('cc:'+x.id.split('-')[1]);
  for(const ref of occurrences(+n,d))if(!ref.law.startsWith('historical-'))assert(keys.has(ref.law+':'+ref.n),'M'+n+' '+ref.law+':'+ref.n+' '+ref.topic);
  dom.window.close();
 }
});
test('lettered articles, cross-code references and special concessions remain complete',()=>{
 for(const [n,keys]of [[5,['cpc:487','cpc:921','cpc:369']],[12,['cc:1240-A','cc:1354-A','cc:1368-E']],[13,['cc:2038','mp2220:1','mp2220:9','dl271:7','dl271:8']],[15,['cc:1815-A','cpc:610','cpc:648']]]){
  const d=new JSDOM(modules[n].html).window.document;
  for(const key of keys){const el=d.querySelector('[data-law-key="'+key+'"]');assert(el,key);assert.match(el.querySelector('p').textContent,/^Art\./);assert(el.querySelector('a.law-official[href^="https://www2.camara.leg.br/"]'));}
 }
 assert.deepEqual(references('arts. 1.240-A e 1.815-A').map(x=>x.n),['1240-A','1815-A']);
 const d=new JSDOM(modules[8].html).window.document;
 assert.equal(d.querySelector('[data-law-key="cc:757"]'),null,'revoked insurance chapter must not return as current law');
 assert(d.querySelector('[data-law-key="seguro:133"]'));
});
