import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import vm from 'node:vm';
import { gunzipSync } from 'node:zlib';

const read=path=>readFileSync(path,'utf8');
const packed=(path,pattern)=>{const match=read(path).match(pattern);assert.ok(match,'conteúdo compactado localizado: '+path);return match[1]};
const number=7;
const pack=mode=>packed(`content/adm/m07-apostila-${mode}.js`,new RegExp(`\\["${number}:${mode}"\\]="([^"]+)"`));
const submitted=()=>packed('content/adm/autor-20261110/adm-m07-submitted-review.js',new RegExp(`ADM_SUBMITTED_REVIEW\\[${number}\\]="([^"]+)"`));
async function load(mode){
 const win={ADM_APOSTILA_PACKED:{[`${number}:${mode}`]:pack(mode)},ADM_SUBMITTED_REVIEW:{[number]:submitted()}};
 const document={querySelector:()=>null,createElement:()=>({dataset:{}}),head:{append:()=>{}}};
 const context=vm.createContext({window:win,document,atob,Blob,Response,DecompressionStream,Map,Promise});
 vm.runInContext(read('ui/adm-apostila-reading-v1.js'),context);
 return {html:await win.AdmApostilaReading.load(number,mode)};
}
const expected=[
 '01 Por que a LINDB importa para a Administração?',
 '02 Art. 20 — consequências práticas e motivação',
 '03 Art. 21 — invalidação e regularização',
 '04 Art. 22 — dificuldades reais da gestão pública',
 '05 Arts. 23 e 24 — segurança diante de mudanças',
 '06 Art. 26 — compromisso para resolver problemas',
 '07 Art. 27 — compensações por efeitos injustos',
 '08 Art. 28 — responsabilização por dolo ou erro grosseiro',
 '09 Arts. 29 e 30 — participação e previsibilidade',
 '10 Como o Decreto nº 9.830/2019 complementa a LINDB'
];

test('ADM M07: as dez artes acompanham os capítulos reais, em ordem e ao final de cada capítulo',async()=>{
 const {html}=await load('summary');
 const chapters=[...html.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi)].map(m=>({title:m[1].replace(/<[^>]+>/g,'').trim(),index:m.index})).filter(x=>/^\d{2}\s+/.test(x.title));
 const figures=[...html.matchAll(/<figure[^>]+data-adm-review-art="([^"]+)"[^>]*>[\s\S]*?<\/figure>/g)].map(m=>({key:m[1],html:m[0],index:m.index}));
 assert.equal(chapters.length,10);assert.equal(figures.length,10);
 for(let i=0;i<10;i++){
  const n=String(i+1).padStart(2,'0'),figure=figures[i];
  assert.equal(chapters[i].title,expected[i]);assert.equal(figure.key,`07-${n}`);
  assert.match(figure.html,new RegExp(`src="/assets/adm/revisao-guiada/m07/ADM-M07-C${n}\\.webp"`));
  assert.match(figure.html,/loading="lazy"/);assert.match(figure.html,/decoding="async"/);
  assert.ok(existsSync(`assets/adm/revisao-guiada/m07/ADM-M07-C${n}.webp`));
  assert.ok(figure.index>chapters[i].index);
  if(i<9)assert.ok(figure.index<chapters[i+1].index);
 }
 assert.match(html,/5 Questões Internas/);
});

test('ADM M07: Conteúdo Completo é devolvido sem artes e sem alterações',async()=>{
 const {html}=await load('complete');
 assert.doesNotMatch(html,/data-adm-review-art|ADM-M07-C\d{2}\.(?:webp|png)/);
 assert.equal(html,gunzipSync(Buffer.from(pack('complete'),'base64')).toString('utf8'));
});

test('ADM M07: manifesto offline inclui os dez WebP e o carregador versionado',()=>{
 const manifest=JSON.parse(read('central-offline-files-v66172.json'));
 assert.equal(manifest.build,'20261122-adm-m07-guided-art-v1');
 assert.ok(manifest.files.includes('/ui/adm-apostila-reading-v1.js?v=20261122admm07arts1'));
 for(let i=1;i<=10;i++)assert.ok(manifest.files.includes(`/assets/adm/revisao-guiada/m07/ADM-M07-C${String(i).padStart(2,'0')}.webp`));
 const css=read('ui/adm-apostila-reading-v1.css');
 assert.match(css,/adm-guided-review-art img\{[^}]*width:100%;height:auto;max-width:100%/);
 assert.match(css,/@media\(max-width:640px\)[^{]*\{[^}]*adm-guided-review-art/);
});
