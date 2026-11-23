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
const module=6;
const pack=(mode)=>packed(`content/adm/m06-apostila-${mode}.js`,new RegExp(`\\["${module}:${mode}"\\]="([^"]+)"`));
const submitted=()=>packed('content/adm/autor-20261110/adm-m06-submitted-review.js',new RegExp(`ADM_SUBMITTED_REVIEW\\[${module}\\]="([^"]+)"`));
async function load(mode){
 const win={ADM_APOSTILA_PACKED:{[`${module}:${mode}`]:pack(mode)},ADM_SUBMITTED_REVIEW:{[module]:submitted()}};
 const document={querySelector:()=>null,createElement:()=>({dataset:{}}),head:{append:()=>{}}};
 const context=vm.createContext({window:win,document,atob,Blob,Response,DecompressionStream,Map,Promise});
 vm.runInContext(read('ui/adm-apostila-reading-v1.js'),context);
 return {html:await win.AdmApostilaReading.load(module,mode)};
}

const expected=[
 'Por que existe processo administrativo?',
 'Princípios, direitos e deveres',
 'Como o processo começa?',
 'Quem pode conduzir e decidir?',
 'Forma e comunicação dos atos',
 'Instrução: apurar antes de decidir',
 'Decisão: concluir e explicar',
 'Quando a decisão precisa ser corrigida',
 'Quando alguém discorda da decisão',
 'Contagem de prazos e outras regras úteis'
];

test('ADM M06: 10 artes correspondem, em ordem, aos capítulos reais da Revisão Guiada',async()=>{
 const {html}=await load('summary');
  const chapters=[...html.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi)].map(m=>({title:m[1].replace(/<[^>]+>/g,'').trim(),index:m.index})).filter(x=>/^\d{2}\s+/.test(x.title));
  const figures=[...html.matchAll(/<figure[^>]+data-adm-review-art="([^"]+)"[^>]*>[\s\S]*?<\/figure>/g)].map(m=>({key:m[1],html:m[0],index:m.index}));
  assert.equal(chapters.length,10);assert.equal(figures.length,10);
  for(let i=0;i<10;i++){
   const n=String(i+1).padStart(2,'0'),figure=figures[i];
   assert.equal(chapters[i].title,`${n} ${expected[i]}`);
   assert.equal(figure.key,`06-${n}`);
   assert.match(figure.html,new RegExp(`src="/assets/adm/revisao-guiada/m06/ADM-M06-C${n}\\.webp"`));
   assert.match(figure.html,/loading="lazy"/);assert.match(figure.html,/decoding="async"/);
   assert.ok(existsSync(`assets/adm/revisao-guiada/m06/ADM-M06-C${n}.webp`));
   assert.ok(figure.index>chapters[i].index);
   if(i<9)assert.ok(figure.index<chapters[i+1].index);
  }
  assert.match(html,/5 Questões Internas/);
});

test('ADM M06: Conteúdo Completo permanece sem imagens da Revisão Guiada',async()=>{
 const {html}=await load('complete');
 assert.doesNotMatch(html,/data-adm-review-art|ADM-M06-C\d{2}\.(?:webp|png)/);
 assert.equal(html,gunzipSync(Buffer.from(pack('complete'),'base64')).toString('utf8'));
});

test('ADM M06: manifesto offline e CSS mantêm carregamento responsivo das artes',()=>{
 const manifest=JSON.parse(read('central-offline-files-v66172.json'));
 assert.equal(manifest.build,'20261122-adm-m05-guided-art-v1');
 for(let i=1;i<=10;i++){
  const n=String(i).padStart(2,'0');
  assert.ok(manifest.files.includes(`/assets/adm/revisao-guiada/m06/ADM-M06-C${n}.webp`));
 }
 assert.ok(manifest.files.some(path=>path.includes('adm-apostila-reading-v1.js?v=20261123admm08arts1')));
 const css=read('ui/adm-apostila-reading-v1.css');
 assert.match(css,/adm-guided-review-art img\{[^}]*width:100%;height:auto;max-width:100%/);
 assert.match(css,/@media\(max-width:640px\)[^{]*\{[^}]*adm-guided-review-art/);
});