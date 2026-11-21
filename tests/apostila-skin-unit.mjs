import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=p=>fs.readFileSync(p,'utf8');

test('Visual das apostilas: arquivos existem, sem seletor global e sem mexer no texto',()=>{
 const css=read('ui/apostila-skin-v1.css'),js=read('ui/apostila-skin-v1.js');
 assert.ok(css.includes('data-bc-reading-mode="night"'),'precisa do modo noturno');
 assert.ok(!/^\s*(?:body|html|p|h1|h2|table)\s*\{/m.test(css),'não pode estilizar elementos soltos fora das apostilas');
 // O JS só adiciona classes: não cria, move nem apaga elementos.
 assert.ok(!/createElement|appendChild|insertBefore|\.before\(|\.after\(|\.remove\(\)|textContent\s*=|innerHTML\s*=/.test(js),'o marcador não pode alterar a estrutura nem o texto');
 assert.ok(js.includes('classList.add'));
});

test('Visual das apostilas: carregado no aplicativo e no modo offline',()=>{
 const idx=read('index.html'),off=JSON.parse(read('central-offline-files-v66172.json'));
 assert.match(idx,/\/ui\/apostila-skin-v1\.css\?v=/);
 assert.match(idx,/\/ui\/apostila-skin-v1\.js\?v=/);
 const list=JSON.stringify(off);
 assert.ok(list.includes('/ui/apostila-skin-v1.css')&&list.includes('/ui/apostila-skin-v1.js'));
});
