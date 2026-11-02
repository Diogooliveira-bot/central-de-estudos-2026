import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { imageSignature } from '../api/content-editor.js';
import { validWebp } from '../api/content-images.js';

function tick(ms=20){return new Promise(resolve=>setTimeout(resolve,ms))}
async function makeEditor(role){
  const dom=new JSDOM(`<!doctype html><html><body>
    <div class="bc-native-reader-overlay">
      <div class="bc-native-reader-title"><b>Direito Constitucional</b><small>Módulo 01</small></div>
      <div class="bc-native-reader-tools"></div>
      <article class="bc-native-article"><p>Texto inicial.</p></article>
    </div></body></html>`,{
    url:'https://example.test/central-v119.html',
    runScripts:'outside-only',pretendToBeVisual:true
  });
  const {window}=dom;let saved='',uploads=0;
  window.fetch=async (url,opts={})=>{
    if(String(url).startsWith('/api/auth'))return {ok:true,json:async()=>({authenticated:true,user:{role}})};
    if(String(url).startsWith('/api/content-images')){
      uploads++;
      const body=JSON.parse(opts.body);
      assert.match(body.contentId,/^reader:[a-z0-9]+$/);
      assert.match(body.dataUrl,/^data:image\/webp;base64,/);
      return {ok:true,json:async()=>({ok:true,url:'/api/content-images?id=00000000-0000-4000-8000-000000000001'})};
    }
    if(opts.method==='POST'){saved=JSON.parse(opts.body).html;return{ok:true,json:async()=>({ok:true})}}
    return {ok:true,json:async()=>({exists:false})};
  };
  window.FileReader=class{readAsDataURL(){this.result='data:image/png;base64,AAAA';this.onload()}};
  window.Image=class{set src(value){this.naturalWidth=1200;this.naturalHeight=800;this.onload()}};
  window.HTMLCanvasElement.prototype.getContext=function(){return{drawImage(){}}};
  window.HTMLCanvasElement.prototype.toDataURL=function(){return'data:image/webp;base64,UklGRhAAAABXRUJQVlA4IAAAAAA='};
  window.eval(readFileSync(new URL('../ui/visual-editor-v1.js',import.meta.url),'utf8'));
  await tick();
  return {dom,window,get saved(){return saved},get uploads(){return uploads}};
}

test('administrador insere imagem e salva legenda, descrição e tamanho',async()=>{
 const app=await makeEditor('admin'),{document,Event}=app.window;
 document.querySelector('.bc-editor-trigger').click();
 const add=document.querySelector('[data-add]');
 assert.ok(add.querySelector('option[value="image"]'));
 add.value='image';add.dispatchEvent(new Event('change',{bubbles:true}));
 const file=document.querySelector('input[type="file"]');
 assert.ok(file);
 Object.defineProperty(file,'files',{value:[{type:'image/png',size:100}]});
 file.dispatchEvent(new Event('change',{bubbles:true}));
 await tick(30);
 const figure=document.querySelector('.bc-editor-image');
 assert.ok(figure);
 assert.equal(figure.querySelector('img').getAttribute('src'),'/api/content-images?id=00000000-0000-4000-8000-000000000001');
 assert.equal(app.uploads,1);
 figure.click();
 let action=document.querySelector('[data-image-action]');
 assert.equal(action.hidden,false);
 action.value='small';action.dispatchEvent(new Event('change',{bubbles:true}));
 assert.ok(figure.classList.contains('bc-editor-image-small'));
 figure.querySelector('figcaption').textContent='Infográfico explicativo';
 document.querySelector('[data-save]').click();
 await tick();
 assert.match(app.saved,/Infográfico explicativo/);
 assert.match(app.saved,/bc-editor-image-small/);
 assert.doesNotMatch(app.saved,/<figcaption[^>]*contenteditable/);
 app.dom.window.close();
});

test('editor pode editar texto, mas não vê opção para adicionar imagem',async()=>{
 const app=await makeEditor('editor'),{document}=app.window;
 document.querySelector('.bc-editor-trigger').click();
 assert.equal(document.querySelector('[data-add] option[value="image"]'),null);
 assert.equal(app.uploads,0);
 app.dom.window.close();
});

test('aluno não recebe ferramentas de edição',async()=>{
 const app=await makeEditor('aluno');
 assert.equal(app.window.document.querySelector('.bc-editor-trigger'),null);
 app.dom.window.close();
});

test('assinatura de imagens distingue substituição e alterações de figura',()=>{
 const original='<p>Um</p><figure class="bc-editor-image"><img src="/api/content-images?id=a"><figcaption>Legenda</figcaption></figure>';
 assert.equal(imageSignature(original),imageSignature(original.replace('Um','Dois')));
 assert.notEqual(imageSignature(original),imageSignature(original.replace('id=a','id=b')));
 assert.notEqual(imageSignature(original),imageSignature(original.replace('Legenda','Outra')));
 assert.notEqual(imageSignature('<p>Texto</p>'),imageSignature('<p>Texto</p><img src="/a.webp">'));
});

test('upload aceita somente assinatura WebP reconhecida',()=>{
 assert.equal(validWebp(Buffer.from('RIFF1234WEBPVP8 0000','ascii')),true);
 assert.equal(validWebp(Buffer.from('RIFF1234WEBPVP8X0000','ascii')),true);
 assert.equal(validWebp(Buffer.from('notanimage','utf8')),false);
});
