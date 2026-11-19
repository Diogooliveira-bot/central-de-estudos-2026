import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {JSDOM} from 'jsdom';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const data=JSON.parse(fs.readFileSync(path.join(root,'artes/cf-m05/data.json'),'utf8'));
const reader=fs.readFileSync(path.join(root,'content/cf/cf-teoria-guiada-reader-v1.js'),'utf8');
const titles=[
 'Administração Pública: quem atua e o que faz',
 'Administração direta e indireta',
 'LIMPE: princípios expressos do art. 37',
 'Acesso a cargos e concurso público',
 'Validade do concurso e direito à nomeação',
 'Função de confiança, comissão e temporários',
 'Sindicatos e greve de servidores',
 'Remuneração, subsídio e teto constitucional',
 'Acumulação remunerada de cargos',
 'Servidor público que assume mandato eletivo',
 'Responsabilidade civil do Estado',
 'Improbidade e consequências constitucionais',
 'Estabilidade e perda do cargo',
 'Regime próprio e regime geral de previdência',
 'Aposentadoria diferenciada de agentes de saúde: EC 140/2026',
 'Nepotismo e dever de impessoalidade'
];
const cardMatch=reader.match(/function card\(topic,index,n\)\{[\s\S]*?\n\}/);
assert.ok(cardMatch,'card renderer exists');
const renderCard=new Function('esc','p','lawBox',cardMatch[0]+'; return card;')(
 v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),
 v=>'<p>'+String(v??'')+'</p>',
 ()=>''
);

test('M05 reproduz os 16 capítulos reais, na ordem e sem trocar títulos',()=>{
 assert.equal(data.length,16);assert.deepEqual(data.map(x=>x.title),titles);
 for(const item of data){
  assert.equal(item.cards.length,4);
  assert.equal(item.tips.length,2);
  for(const card of item.cards)assert.equal(card.length,2);
 }
});

test('cada arte M05 existe em PNG 1229 × 1536 e WebP otimizado',()=>{
 for(let i=1;i<=16;i++){
  const n=String(i).padStart(2,'0');
  const png=fs.readFileSync(path.join(root,'artes/cf-m05/png/CF-M05-C'+n+'.png'));
  assert.equal(png.subarray(1,4).toString(),'PNG');
  assert.equal(png.readUInt32BE(16),1229);assert.equal(png.readUInt32BE(20),1536);
  const webp=fs.readFileSync(path.join(root,'assets/cf/revisao-guiada/m05/CF-M05-C'+n+'.webp'));
  assert.equal(webp.subarray(0,4).toString(),'RIFF');assert.equal(webp.subarray(8,12).toString(),'WEBP');
 }
});

test('cada imagem M05 é inserida no final do capítulo correspondente e não em outro módulo',()=>{
 for(let i=0;i<16;i++){
  const html=renderCard([titles[i],'texto'],i,5);
  assert.equal((html.match(/<figure class="bc-review-infographic"/g)||[]).length,1);
  assert.ok(html.indexOf('<figure')>html.indexOf('<h2'));
  assert.ok(html.includes('/assets/cf/revisao-guiada/m05/CF-M05-C'+String(i+1).padStart(2,'0')+'.webp'));
  assert.ok(html.endsWith('</figure></section>'));
 }
 assert.ok(!renderCard([titles[0],'texto'],0,4).includes('/m05/'));
 assert.ok(!renderCard([titles[0],'texto'],0,6).includes('bc-review-infographic'));
 assert.match(reader,/loading="lazy" decoding="async" width="1229" height="1536"/);
});

test('leitor real abre os 16 capítulos do M05 com a arte correta no final de cada um',()=>{
 const dom=new JSDOM('<!doctype html><html><body></body></html>',{url:'https://example.test',runScripts:'outside-only'});
 const w=dom.window;
 w.eval(fs.readFileSync(path.join(root,'content/cf/m05-teoria-guiada-data.js'),'utf8'));
 w.eval(reader);
 assert.equal(w.BcCfGuidedReader.open(5),true);
 const chapters=w.document.querySelectorAll('.bc-m01-topic.bc-apostila-topic');
 const figures=w.document.querySelectorAll('.bc-review-infographic');
 assert.equal(chapters.length,16);assert.equal(figures.length,16);
 figures.forEach((figure,index)=>{
  const img=figure.querySelector('img');
  assert.equal(img.getAttribute('src'),'/assets/cf/revisao-guiada/m05/CF-M05-C'+String(index+1).padStart(2,'0')+'.webp');
  assert.equal(figure.parentElement,chapters[index]);
  assert.equal(chapters[index].lastElementChild,figure);
 });
 w.close();
});
