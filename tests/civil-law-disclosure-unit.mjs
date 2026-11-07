import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {JSDOM} from 'jsdom';
import {loadModules} from '../scripts/audit-civil-law-references.mjs';
test('all 15 Civil modules can collapse and reopen literal law without dropping articles or anchors',async()=>{
 const modules=loadModules();let blocks=0;
 for(const m of Object.values(modules)){
  const dom=new JSDOM(m.html,{runScripts:'outside-only'}),w=dom.window,d=w.document;
  const before=[...d.querySelectorAll('.law-article')].map(x=>x.outerHTML);
  const count=d.querySelectorAll('.law').length;
  w.eval(fs.readFileSync('ui/civil-law-disclosure-v1.js','utf8'));
  w.CivilLawDisclosure.enhance(d.body);
  assert.equal(d.querySelectorAll('details.law:not([open])').length,count);
  assert.deepEqual([...d.querySelectorAll('.law-article')].map(x=>x.outerHTML),before);
  const law=d.querySelector('details.law');assert.equal(law.firstElementChild.tagName,'SUMMARY');
  law.firstElementChild.click();assert.equal(law.open,true);
  law.firstElementChild.click();assert.equal(law.open,false);
  w.CivilLawDisclosure.enhance(d.body);assert.equal(d.querySelectorAll('details.law').length,count);
  assert.equal(d.querySelectorAll('details.law details.law').length,0);
  blocks+=count;dom.window.close();
 }
 assert.ok(blocks>100);
});
