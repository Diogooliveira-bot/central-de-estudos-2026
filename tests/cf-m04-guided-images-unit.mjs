import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const data=JSON.parse(fs.readFileSync(path.join(root,'artes/cf-m04/data.json'),'utf8'));
const reader=fs.readFileSync(path.join(root,'content/cf/cf-teoria-guiada-reader-v1.js'),'utf8');
const titles=[
 'Federação: soberania e autonomia',
 'Quem integra o Estado brasileiro: art. 18',
 'União: competências e bens',
 'Estados: Constituição própria e competência residual',
 'Distrito Federal: competências acumuladas e limites',
 'Municípios: interesse local e Lei Orgânica',
 'Criação e alteração de Estados e Municípios',
 'Vedações federativas e bens dos Estados',
 'Competência material exclusiva da União: art. 21',
 'Competência legislativa privativa da União: art. 22',
 'Competência material comum: art. 23',
 'Competência legislativa concorrente: art. 24',
 'Quando há intervenção: excepcionalidade',
 'Intervenção federal, estadual e procedimentos'
];
const cardMatch=reader.match(/function card\(topic,index,n\)\{[\s\S]*?\n\}/);
assert.ok(cardMatch,'card renderer exists');
const renderCard=new Function('esc','p','lawBox',cardMatch[0]+'; return card;')(
 v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),
 v=>'<p>'+String(v??'')+'</p>',
 ()=>''
);

test('M04 tem uma arte para cada capítulo real, na ordem e com títulos originais',()=>{
 assert.equal(data.length,14);assert.deepEqual(data.map(x=>x.title),titles);
});

test('cada PNG mede 1229 × 1536 e tem WebP correspondente',()=>{
 for(let i=1;i<=14;i++){
  const n=String(i).padStart(2,'0');
  const png=fs.readFileSync(path.join(root,'artes/cf-m04/png/CF-M04-C'+n+'.png'));
  assert.equal(png.subarray(1,4).toString(),'PNG');
  assert.equal(png.readUInt32BE(16),1229);assert.equal(png.readUInt32BE(20),1536);
  const webp=fs.readFileSync(path.join(root,'assets/cf/revisao-guiada/m04/CF-M04-C'+n+'.webp'));
  assert.equal(webp.subarray(0,4).toString(),'RIFF');assert.equal(webp.subarray(8,12).toString(),'WEBP');
 }
});

test('imagem é colocada ao final do capítulo M04 e não é adicionada aos outros módulos',()=>{
 for(let i=0;i<14;i++){
  const html=renderCard([titles[i],'texto'],i,4);
  assert.equal((html.match(/<figure class="bc-review-infographic"/g)||[]).length,1);
  assert.ok(html.indexOf('<figure')>html.indexOf('<h2'));
  assert.ok(html.includes('/assets/cf/revisao-guiada/m04/CF-M04-C'+String(i+1).padStart(2,'0')+'.webp'));
  assert.ok(html.endsWith('</figure></section>'));
 }
 assert.ok(!renderCard([titles[0],'texto'],0,3).includes('bc-review-infographic'));
 assert.ok(renderCard(['Imunidade material parlamentar','texto'],0,6).includes('/assets/cf/revisao-guiada/m06/CF-M06-C01.webp'));
 assert.ok(renderCard([titles[0],'texto'],0,5).includes('/assets/cf/revisao-guiada/m05/CF-M05-C01.webp'));
 assert.match(reader,/loading="lazy" decoding="async" width="1229" height="1536"/);
 assert.match(reader,/\.bc-review-infographic img\{display:block;width:100%;height:auto/);
});
