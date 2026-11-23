import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import vm from 'node:vm';
import { gunzipSync } from 'node:zlib';

const read=path=>readFileSync(path,'utf8');
const packed=(path,pattern)=>{
 const match=read(path).match(pattern);
 assert.ok(match,'conteúdo compactado localizado: '+path);
 return match[1];
};
const module=8;
const pack=mode=>packed(`content/adm/m08-apostila-${mode}.js`,new RegExp(`\\["${module}:${mode}"\\]="([^"]+)"`));
const submitted=()=>packed('content/adm/autor-20261110/adm-m08-submitted-review.js',new RegExp(`ADM_SUBMITTED_REVIEW\\[${module}\\]="([^"]+)"`));
async function load(mode){
 const win={ADM_APOSTILA_PACKED:{[`${module}:${mode}`]:pack(mode)},ADM_SUBMITTED_REVIEW:{[module]:submitted()}};
 const document={querySelector:()=>null,createElement:()=>({dataset:{}}),head:{append:()=>{}}};
 const context=vm.createContext({window:win,document,atob,Blob,Response,DecompressionStream,Map,Promise});
 vm.runInContext(read('ui/adm-apostila-reading-v1.js'),context);
 return {html:await win.AdmApostilaReading.load(module,mode)};
}

const expected=[
 'Por que o Estado precisa ser controlado',
 'Formas de classificar o controle',
 'Controle administrativo e autotutela',
 'Controle interno em cada Poder',
 'Controle externo e Poder Legislativo',
 'Tribunais de Contas: função e competências',
 'Controle judicial e seus limites',
 'Controle social e transparência',
 'Uma situação concreta reunindo os controles',
 'Como as modalidades se relacionam'
];

test('ADM M08: 10 artes acompanham os capítulos reais da Revisão Guiada, na ordem',async()=>{
 const {html}=await load('summary');
 const chapters=[...html.matchAll(/<h2\b[^>]*>\s*(\d{2}\s+[^<]*?)\s*<\/h2>/gi)].map(m=>({title:m[1].trim(),index:m.index}));
 const figures=[...html.matchAll(/<figure[^>]+data-adm-review-art="([^"]+)"[^>]*>[\s\S]*?<\/figure>/g)].map(m=>({key:m[1],html:m[0],index:m.index}));
 assert.equal(chapters.length,10);assert.equal(figures.length,10);
 for(let i=0;i<10;i++){
  const n=String(i+1).padStart(2,'0'),figure=figures[i];
  assert.equal(chapters[i].title,`${n} ${expected[i]}`);
  assert.equal(figure.key,`08-${n}`);
  assert.match(figure.html,new RegExp(`src="/assets/adm/revisao-guiada/m08/ADM-M08-C${n}\\.webp"`));
  assert.match(figure.html,/loading="lazy"/);assert.match(figure.html,/decoding="async"/);assert.match(figure.html,/alt="Arte de revisão/);
  assert.ok(existsSync(`assets/adm/revisao-guiada/m08/ADM-M08-C${n}.webp`));
  assert.ok(existsSync(`artes/adm-m08/png/ADM-M08-C${n}.png`));
  assert.ok(figure.index>chapters[i].index);
  if(i<9)assert.ok(figure.index<chapters[i+1].index);
 }
 assert.match(html,/5 Questões Internas/);
});

test('ADM M08: Conteúdo Completo continua idêntico e sem imagens da revisão',async()=>{
 const {html}=await load('complete');
 assert.doesNotMatch(html,/data-adm-review-art|ADM-M08-C\\d{2}\\.(?:webp|png)/);
 assert.equal(html,gunzipSync(Buffer.from(pack('complete'),'base64')).toString('utf8'));
 const numbered=[...html.matchAll(/<h2\\b[^>]*data-adm-session=/gi)];
 assert.equal(numbered.length,14,'as 14 sessões originais do Conteúdo Completo permanecem intactas');
});

test('ADM M08: o manifesto offline inclui somente o conjunto de 10 WebP',()=>{
 const manifest=JSON.parse(read('central-offline-files-v66172.json'));
 assert.equal(manifest.build,'20261122-adm-m05-guided-art-v1');
 for(let i=1;i<=10;i++){
  const n=String(i).padStart(2,'0');
  assert.ok(manifest.files.includes(`/assets/adm/revisao-guiada/m08/ADM-M08-C${n}.webp`));
 }
 assert.ok(manifest.files.some(path=>path.includes('adm-apostila-reading-v1.js?v=20261123admm08arts1')));
 assert.ok(manifest.files.filter(path=>path.includes('/assets/adm/revisao-guiada/m08/ADM-M08-C')).length===10);
});

test('ADM M08: inventário preserva as cinco seções didáticas e os dez capítulos reais',()=>{
 const mapping=JSON.parse(read('artes/adm-m08/mapping.json'));
 assert.equal(mapping.didactic_sections.length,5);
 assert.deepEqual(mapping.didactic_sections.map(x=>x.guided_chapters),[[1,2],[3],[5,6],[4],[7,8]]);
 assert.deepEqual(mapping.additional_integrative_guided_chapters,[9,10]);
});
